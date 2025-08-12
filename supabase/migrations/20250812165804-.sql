-- Fix function search path warnings by setting explicit search_path
-- Update all functions to have explicit search_path for security

ALTER FUNCTION public.is_super_admin_user() SET search_path TO 'public';
ALTER FUNCTION public.mask_sensitive_payment_data(text, numeric, jsonb, jsonb, jsonb) SET search_path TO 'public';
ALTER FUNCTION public.get_secure_payment_transaction(uuid) SET search_path TO 'public';
ALTER FUNCTION public.enhanced_payment_access_control(uuid, uuid) SET search_path TO 'public';
ALTER FUNCTION public.encrypt_payment_field(text, text) SET search_path TO 'public';
ALTER FUNCTION public.audit_payment_changes() SET search_path TO 'public';
ALTER FUNCTION public.get_payment_access_summary() SET search_path TO 'public';

-- Create a secure client-side function to access payment data safely
CREATE OR REPLACE FUNCTION public.get_user_payment_transactions(p_limit integer DEFAULT 10)
RETURNS TABLE(
  id uuid,
  tripay_reference text,
  payment_method text,
  masked_amount text,
  currency text,
  status text,
  created_at timestamptz,
  paid_at timestamptz,
  expires_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  requesting_user_id uuid;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Must be authenticated
  IF requesting_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(requesting_user_id, 'payment_transactions') THEN
    RAISE EXCEPTION 'Rate limit exceeded for payment data access';
  END IF;
  
  -- Log the access
  PERFORM public.log_sensitive_action(
    'user_payment_list_access',
    'payment_transactions',
    NULL,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'limit_requested', p_limit
    )
  );
  
  -- Return user's own transactions with masked sensitive data
  RETURN QUERY
  SELECT 
    pt.id,
    pt.tripay_reference,
    pt.payment_method,
    '***.' || RIGHT(pt.amount::text, 2) as masked_amount, -- Show last 2 digits only
    pt.currency,
    pt.status,
    pt.created_at,
    pt.paid_at,
    pt.expires_at
  FROM public.payment_transactions pt
  WHERE pt.user_id = requesting_user_id
  ORDER BY pt.created_at DESC
  LIMIT COALESCE(p_limit, 10);
END;
$$;

-- Create function to validate payment transaction access with enhanced logging
CREATE OR REPLACE FUNCTION public.validate_payment_transaction_access(
  p_transaction_id uuid,
  p_access_type text DEFAULT 'read'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  requesting_user_id uuid;
  transaction_owner uuid;
  is_admin boolean;
  access_granted boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check authentication
  IF requesting_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get transaction owner
  SELECT user_id INTO transaction_owner
  FROM public.payment_transactions
  WHERE id = p_transaction_id;
  
  -- Transaction must exist
  IF transaction_owner IS NULL THEN
    PERFORM public.log_sensitive_action(
      'payment_access_invalid_transaction',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', requesting_user_id,
        'access_type', p_access_type,
        'result', 'transaction_not_found'
      )
    );
    RETURN false;
  END IF;
  
  -- Check if user is verified admin
  is_admin := public.is_verified_admin(requesting_user_id);
  
  -- Determine access
  access_granted := (requesting_user_id = transaction_owner) OR is_admin;
  
  -- Log access attempt
  PERFORM public.log_sensitive_action(
    'payment_transaction_access_validation',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'transaction_owner', transaction_owner,
      'is_admin', is_admin,
      'access_type', p_access_type,
      'access_granted', access_granted
    )
  );
  
  RETURN access_granted;
END;
$$;