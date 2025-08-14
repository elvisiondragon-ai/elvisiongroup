-- Phase 1: Critical Payment Security Fixes

-- Drop the existing complex payment transaction policy that may be too permissive
DROP POLICY IF EXISTS "Enhanced secure payment transaction access" ON public.payment_transactions;

-- Create a much stricter, owner-only access policy for payment transactions
CREATE POLICY "Strict owner-only payment access" 
ON public.payment_transactions 
FOR SELECT 
USING (
  auth.uid() = user_id 
  AND check_sensitive_data_rate_limit(auth.uid(), 'payment_transactions')
);

-- Create a simple admin policy that's separate and more restrictive
CREATE POLICY "Admin payment access with strict validation"
ON public.payment_transactions
FOR SELECT
USING (
  is_verified_admin(auth.uid()) 
  AND check_sensitive_data_rate_limit(auth.uid(), 'payment_transactions')
);

-- Ensure only owners can insert their own transactions
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.payment_transactions;
CREATE POLICY "Strict owner transaction insert"
ON public.payment_transactions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND check_sensitive_data_rate_limit(auth.uid(), 'payment_transactions')
);

-- Add a function to safely retrieve payment data with masking
CREATE OR REPLACE FUNCTION public.get_masked_payment_transaction(p_transaction_id uuid)
RETURNS TABLE(
  id uuid,
  tripay_reference text,
  payment_method text,
  masked_amount text,
  currency text,
  status text,
  created_at timestamp with time zone,
  paid_at timestamp with time zone,
  expires_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  transaction_record RECORD;
  requesting_user_id uuid;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF requesting_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT check_sensitive_data_rate_limit(requesting_user_id, 'payment_transactions') THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  
  -- Get transaction and verify ownership
  SELECT * INTO transaction_record
  FROM public.payment_transactions pt
  WHERE pt.id = p_transaction_id AND pt.user_id = requesting_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found or access denied';
  END IF;
  
  -- Log access
  PERFORM log_sensitive_action(
    'masked_payment_access',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object('user_id', requesting_user_id)
  );
  
  -- Return masked data
  RETURN QUERY SELECT
    transaction_record.id,
    transaction_record.tripay_reference,
    transaction_record.payment_method,
    -- Mask the amount for additional security
    '***.' || RIGHT(transaction_record.amount::text, 2) as masked_amount,
    transaction_record.currency,
    transaction_record.status,
    transaction_record.created_at,
    transaction_record.paid_at,
    transaction_record.expires_at;
END;
$$;

-- Phase 2: Email Encryption Setup
-- Add encryption function for sensitive email data
CREATE OR REPLACE FUNCTION public.encrypt_email(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Simple obfuscation for now - can be enhanced with pgcrypto
  RETURN 'ENC:' || encode(p_email::bytea, 'base64');
END;
$$;

-- Add function to decrypt email data
CREATE OR REPLACE FUNCTION public.decrypt_email(p_encrypted_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if already encrypted
  IF p_encrypted_email LIKE 'ENC:%' THEN
    RETURN decode(substring(p_encrypted_email from 5), 'base64')::text;
  ELSE
    -- Return as-is if not encrypted (for backward compatibility)
    RETURN p_encrypted_email;
  END IF;
END;
$$;

-- Add safer email access function
CREATE OR REPLACE FUNCTION public.get_user_email_safe(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  encrypted_email text;
BEGIN
  -- Only allow users to get their own email
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied: Cannot retrieve email for other users';
  END IF;
  
  -- Check rate limiting
  IF NOT check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info') THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  
  -- Log access
  PERFORM log_sensitive_action(
    'safe_email_access',
    'user_contact_info',
    p_user_id,
    jsonb_build_object('requesting_user', auth.uid())
  );
  
  SELECT email_encrypted INTO encrypted_email
  FROM public.user_contact_info
  WHERE user_id = p_user_id;
  
  RETURN decrypt_email(encrypted_email);
END;
$$;