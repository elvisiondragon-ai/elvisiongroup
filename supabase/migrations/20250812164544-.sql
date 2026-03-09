-- Fix infinite recursion in admin_roles policy first
DROP POLICY IF EXISTS "Users can view relevant admin roles" ON public.admin_roles;

-- Create a security definer function to check admin roles safely
CREATE OR REPLACE FUNCTION public.is_super_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- Recreate the admin roles policy without recursion
CREATE POLICY "Users can view relevant admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (
  -- Users can see their own roles
  auth.uid() = user_id 
  OR 
  -- Super admins can see all roles (using security definer function)
  public.is_super_admin_user()
);

-- Enhanced payment data security measures
-- 1. Create function to mask sensitive payment data
CREATE OR REPLACE FUNCTION public.mask_sensitive_payment_data(
  p_bank_account text,
  p_amount numeric,
  p_payment_instructions jsonb,
  p_callback_data jsonb,
  p_moota_webhook_data jsonb
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN jsonb_build_object(
    'bank_account_masked', 
    CASE 
      WHEN p_bank_account IS NOT NULL THEN 
        LEFT(p_bank_account, 4) || '****' || RIGHT(p_bank_account, 4)
      ELSE NULL 
    END,
    'amount_masked', 
    CASE 
      WHEN p_amount IS NOT NULL THEN '***.**'
      ELSE NULL 
    END,
    'has_payment_instructions', p_payment_instructions IS NOT NULL,
    'has_callback_data', p_callback_data IS NOT NULL,
    'has_webhook_data', p_moota_webhook_data IS NOT NULL
  );
END;
$$;

-- 2. Create secure payment transaction view function
CREATE OR REPLACE FUNCTION public.get_secure_payment_transaction(p_transaction_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  tripay_reference text,
  payment_method text,
  masked_amount text,
  currency text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  paid_at timestamptz,
  expires_at timestamptz,
  security_metadata jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  transaction_record RECORD;
  requesting_user_id uuid;
  is_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if requesting user is verified admin
  is_admin := public.is_verified_admin(requesting_user_id);
  
  -- Get transaction record
  SELECT * INTO transaction_record 
  FROM public.payment_transactions pt
  WHERE pt.id = p_transaction_id;
  
  -- Check access permissions
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  IF transaction_record.user_id != requesting_user_id AND NOT is_admin THEN
    RAISE EXCEPTION 'Access denied: Cannot access transaction for other users';
  END IF;
  
  -- Log access attempt
  PERFORM public.log_sensitive_action(
    'secure_payment_access',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'transaction_owner', transaction_record.user_id,
      'is_admin_access', is_admin,
      'access_time', now()
    )
  );
  
  -- Return masked data based on access level
  RETURN QUERY SELECT
    transaction_record.id,
    transaction_record.user_id,
    transaction_record.tripay_reference,
    transaction_record.payment_method,
    CASE 
      WHEN requesting_user_id = transaction_record.user_id OR is_admin THEN 
        transaction_record.amount::text
      ELSE '***.**'
    END as masked_amount,
    transaction_record.currency,
    transaction_record.status,
    transaction_record.created_at,
    transaction_record.updated_at,
    transaction_record.paid_at,
    transaction_record.expires_at,
    public.mask_sensitive_payment_data(
      transaction_record.bank_account,
      transaction_record.amount,
      transaction_record.payment_instructions,
      transaction_record.callback_data,
      transaction_record.moota_webhook_data
    ) as security_metadata;
END;
$$;

-- 3. Enhanced access control function with additional security
CREATE OR REPLACE FUNCTION public.enhanced_payment_access_control(p_user_id uuid, p_transaction_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_owner boolean := false;
  is_admin boolean := false;
  transaction_exists boolean := false;
  rate_limit_ok boolean := false;
BEGIN
  -- Check if transaction exists
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id
  ) INTO transaction_exists;
  
  IF NOT transaction_exists THEN
    PERFORM public.log_sensitive_action(
      'payment_access_attempt_invalid_transaction',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', p_user_id,
        'transaction_id', p_transaction_id,
        'result', 'transaction_not_found'
      )
    );
    RETURN false;
  END IF;
  
  -- Check rate limiting for payment data access
  rate_limit_ok := public.check_sensitive_data_rate_limit(p_user_id, 'payment_transactions');
  
  IF NOT rate_limit_ok THEN
    PERFORM public.log_sensitive_action(
      'payment_access_rate_limited',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', p_user_id,
        'reason', 'rate_limit_exceeded'
      )
    );
    RETURN false;
  END IF;
  
  -- Check ownership
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
  ) INTO is_owner;
  
  -- Check verified admin status
  is_admin := public.is_verified_admin(p_user_id);
  
  -- Log access attempt for audit
  PERFORM public.log_sensitive_action(
    'payment_access_validation',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', p_user_id,
      'is_owner', is_owner,
      'is_admin', is_admin,
      'access_granted', (is_owner OR is_admin),
      'rate_limit_passed', rate_limit_ok
    )
  );
  
  RETURN (is_owner OR is_admin);
END;
$$;

-- 4. Update RLS policies with enhanced security
DROP POLICY IF EXISTS "Secure payment transaction access" ON public.payment_transactions;

CREATE POLICY "Enhanced secure payment transaction access" 
ON public.payment_transactions 
FOR SELECT 
USING (enhanced_payment_access_control(auth.uid(), id));

-- 5. Create function to encrypt sensitive payment fields (placeholder for future enhancement)
CREATE OR REPLACE FUNCTION public.encrypt_payment_field(p_data text, p_field_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple obfuscation for now - in production, use proper encryption
  -- This can be enhanced with pgcrypto extension for real encryption
  CASE p_field_type
    WHEN 'bank_account' THEN
      RETURN 'ENCRYPTED:' || encode(p_data::bytea, 'base64');
    WHEN 'unique_code' THEN
      RETURN 'ENCRYPTED:' || encode(p_data::bytea, 'base64');
    ELSE
      RETURN p_data;
  END CASE;
END;
$$;

-- 6. Add trigger to monitor sensitive payment data changes
CREATE OR REPLACE FUNCTION public.audit_payment_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log any changes to payment transactions
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_sensitive_action(
      'payment_transaction_updated',
      'payment_transactions',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'old_amount', OLD.amount,
        'new_amount', NEW.amount,
        'updated_by', auth.uid()
      )
    );
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'payment_transaction_created',
      'payment_transactions',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'payment_method', NEW.payment_method,
        'created_by', auth.uid()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for payment transaction auditing
DROP TRIGGER IF EXISTS payment_transactions_audit_trigger ON public.payment_transactions;
CREATE TRIGGER payment_transactions_audit_trigger
  AFTER INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_payment_changes();

-- 7. Create payment data access summary function for monitoring
CREATE OR REPLACE FUNCTION public.get_payment_access_summary()
RETURNS TABLE(
  user_id uuid,
  access_count bigint,
  last_access timestamptz,
  suspicious_activity boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only verified admins can access this summary
  IF NOT public.is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    sal.user_id,
    COUNT(*) as access_count,
    MAX(sal.created_at) as last_access,
    -- Flag suspicious activity (more than 20 accesses in 1 hour)
    COUNT(*) > 20 AND MAX(sal.created_at) > (now() - interval '1 hour') as suspicious_activity
  FROM public.security_audit_log sal
  WHERE sal.action LIKE '%payment%'
    AND sal.created_at > (now() - interval '24 hours')
  GROUP BY sal.user_id
  ORDER BY access_count DESC;
END;
$$;