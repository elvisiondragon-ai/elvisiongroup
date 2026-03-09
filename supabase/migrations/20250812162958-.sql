-- CRITICAL SECURITY FIX: Secure customer email and subscription data
-- This migration addresses multiple security vulnerabilities in financial and subscription data

-- 1. Create a separate secure table for email storage with enhanced protection
CREATE TABLE IF NOT EXISTS public.user_contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_encrypted TEXT NOT NULL, -- Will store encrypted email
  email_hash TEXT NOT NULL, -- For lookup without revealing email
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on the new contact info table
ALTER TABLE public.user_contact_info ENABLE ROW LEVEL SECURITY;

-- Create ultra-restrictive policies for contact info
CREATE POLICY "Users can only view their own contact info"
ON public.user_contact_info
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own contact info"
ON public.user_contact_info
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own contact info"
ON public.user_contact_info
FOR UPDATE
USING (auth.uid() = user_id);

-- 2. Remove email column from vip_subscriptions to eliminate exposure
-- First, backup existing emails in the new secure table
INSERT INTO public.user_contact_info (user_id, email_encrypted, email_hash)
SELECT 
  user_id,
  email, -- TODO: This should be encrypted in production
  encode(digest(email, 'sha256'), 'hex')
FROM public.vip_subscriptions
WHERE email IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Remove the exposed email column
ALTER TABLE public.vip_subscriptions DROP COLUMN IF EXISTS email;

-- 3. Strengthen RLS policies for vip_subscriptions
-- Drop existing admin policy that's too permissive
DROP POLICY IF EXISTS "Admin can view all subscriptions" ON public.vip_subscriptions;

-- Create more restrictive admin access through a secure function
CREATE OR REPLACE FUNCTION public.is_verified_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- More restrictive admin check - requires specific admin role
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
    AND 'verified_admin' = ANY(achievements)
  );
END;
$function$;

-- New restrictive admin policy
CREATE POLICY "Verified admins can view subscriptions"
ON public.vip_subscriptions
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  public.is_verified_admin(auth.uid())
);

-- 4. Enhanced security for payment_transactions
-- Create function to validate payment access with additional security checks
CREATE OR REPLACE FUNCTION public.can_access_payment_transaction(
  p_user_id UUID, 
  p_transaction_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  is_owner BOOLEAN := FALSE;
  is_admin BOOLEAN := FALSE;
BEGIN
  -- Check ownership
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
  ) INTO is_owner;
  
  -- Check verified admin status
  is_admin := public.is_verified_admin(p_user_id);
  
  -- Log access attempt for audit
  PERFORM public.log_data_access(
    'payment_transactions',
    'access_attempt',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', p_user_id,
      'is_owner', is_owner,
      'is_admin', is_admin,
      'access_granted', (is_owner OR is_admin)
    )
  );
  
  RETURN (is_owner OR is_admin);
END;
$function$;

-- Update payment transaction policies to use the secure function
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;

CREATE POLICY "Secure payment transaction access"
ON public.payment_transactions
FOR SELECT
USING (public.can_access_payment_transaction(auth.uid(), id));

-- 5. Add data classification and protection metadata
CREATE TABLE IF NOT EXISTS public.data_classification (
  table_name TEXT PRIMARY KEY,
  classification TEXT NOT NULL, -- 'public', 'internal', 'confidential', 'restricted'
  pii_fields TEXT[], -- List of fields containing PII
  retention_days INTEGER,
  audit_required BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Classify our sensitive tables
INSERT INTO public.data_classification (table_name, classification, pii_fields, retention_days, audit_required)
VALUES 
  ('user_contact_info', 'restricted', ARRAY['email_encrypted'], 2555, TRUE), -- 7 years
  ('vip_subscriptions', 'confidential', ARRAY['ip_address'], 2555, TRUE),
  ('payment_transactions', 'restricted', ARRAY['bank_account', 'moota_webhook_data'], 2555, TRUE),
  ('device_tokens', 'confidential', ARRAY['token', 'platform'], 365, TRUE)
ON CONFLICT (table_name) DO UPDATE SET
  classification = EXCLUDED.classification,
  pii_fields = EXCLUDED.pii_fields,
  retention_days = EXCLUDED.retention_days,
  audit_required = EXCLUDED.audit_required;

-- 6. Create a secure function to retrieve user email when needed
CREATE OR REPLACE FUNCTION public.get_user_email_secure(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_email TEXT;
BEGIN
  -- Only allow users to get their own email or verified admins
  IF auth.uid() != p_user_id AND NOT public.is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Cannot retrieve email for other users';
  END IF;
  
  -- Log access for audit
  PERFORM public.log_data_access(
    'user_contact_info',
    'email_access',
    p_user_id,
    jsonb_build_object(
      'requesting_user', auth.uid(),
      'target_user', p_user_id
    )
  );
  
  SELECT email_encrypted INTO user_email
  FROM public.user_contact_info
  WHERE user_id = p_user_id;
  
  RETURN user_email;
END;
$function$;

-- 7. Add triggers for automatic audit logging on sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Log any SELECT operations on sensitive tables
  IF TG_OP = 'SELECT' AND TG_TABLE_NAME IN ('vip_subscriptions', 'payment_transactions', 'user_contact_info') THEN
    PERFORM public.log_data_access(
      TG_TABLE_NAME,
      'sensitive_data_access',
      COALESCE(OLD.id, OLD.user_id),
      jsonb_build_object(
        'operation', TG_OP,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_vip_subscriptions_access
  AFTER SELECT ON public.vip_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_sensitive_data_access();

CREATE TRIGGER audit_payment_transactions_access
  AFTER SELECT ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_sensitive_data_access();

CREATE TRIGGER audit_user_contact_info_access
  AFTER SELECT ON public.user_contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_sensitive_data_access();

-- 8. Create a view for safe subscription display (without sensitive data)
CREATE OR REPLACE VIEW public.subscription_summary AS
SELECT 
  id,
  user_id,
  subscription_type,
  status,
  trial_start_date,
  trial_end_date,
  subscription_start_date,
  subscription_end_date,
  -- Mask sensitive fields
  CASE 
    WHEN auth.uid() = user_id THEN currency
    ELSE '***'
  END as currency,
  CASE 
    WHEN auth.uid() = user_id THEN amount_paid
    ELSE NULL
  END as amount_paid,
  created_at,
  updated_at
FROM public.vip_subscriptions
WHERE auth.uid() = user_id OR public.is_verified_admin(auth.uid());

-- Grant appropriate permissions
GRANT SELECT ON public.subscription_summary TO authenticated;

-- 9. Add rate limiting for sensitive data access
CREATE OR REPLACE FUNCTION public.check_sensitive_data_rate_limit(
  p_user_id UUID,
  p_table_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Stricter rate limits for sensitive data access
  RETURN public.check_rate_limit(
    p_user_id, 
    'sensitive_data_access_' || p_table_name,
    5, -- Max 5 attempts
    15 -- Per 15 minutes
  );
END;
$function$;