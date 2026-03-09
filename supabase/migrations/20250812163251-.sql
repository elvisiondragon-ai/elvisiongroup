-- Fix security issues introduced in the previous migration

-- 1. Fix the Security Definer View issue by dropping it and creating proper RLS policies instead
DROP VIEW IF EXISTS public.subscription_summary;

-- 2. Enable RLS on the data_classification table (this was missing)
ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for data_classification table - only verified admins can access
CREATE POLICY "Only verified admins can view data classification"
ON public.data_classification
FOR SELECT
USING (public.is_verified_admin(auth.uid()));

CREATE POLICY "Only verified admins can manage data classification"
ON public.data_classification
FOR ALL
USING (public.is_verified_admin(auth.uid()));

-- 3. Instead of the problematic view, create a secure function for subscription display
CREATE OR REPLACE FUNCTION public.get_safe_subscription_data(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  subscription_type TEXT,
  status TEXT,
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  masked_currency TEXT,
  masked_amount NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only allow users to get their own data or verified admins
  IF auth.uid() != p_user_id AND NOT public.is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Cannot retrieve subscription data for other users';
  END IF;
  
  -- Log access for audit
  PERFORM public.log_data_access(
    'vip_subscriptions',
    'safe_subscription_access',
    p_user_id,
    jsonb_build_object(
      'requesting_user', auth.uid(),
      'target_user', p_user_id
    )
  );
  
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.subscription_type,
    s.status,
    s.trial_start_date,
    s.trial_end_date,
    s.subscription_start_date,
    s.subscription_end_date,
    -- Mask sensitive fields based on access level
    CASE 
      WHEN auth.uid() = s.user_id THEN s.currency
      ELSE '***'
    END as masked_currency,
    CASE 
      WHEN auth.uid() = s.user_id THEN s.amount_paid
      ELSE NULL
    END as masked_amount
  FROM public.vip_subscriptions s
  WHERE s.user_id = p_user_id;
END;
$function$;

-- 4. Create additional security policies for device_tokens to address the warning
-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Users can view their own device tokens" ON public.device_tokens;
DROP POLICY IF EXISTS "Users can insert their own device tokens" ON public.device_tokens;
DROP POLICY IF EXISTS "Users can update their own device tokens" ON public.device_tokens;
DROP POLICY IF EXISTS "Users can delete their own device tokens" ON public.device_tokens;

-- Create more restrictive policies with rate limiting
CREATE POLICY "Secure device token access"
ON public.device_tokens
FOR SELECT
USING (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens')
);

CREATE POLICY "Secure device token insert"
ON public.device_tokens
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens')
);

CREATE POLICY "Secure device token update"
ON public.device_tokens
FOR UPDATE
USING (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens')
);

CREATE POLICY "Secure device token delete"
ON public.device_tokens
FOR DELETE
USING (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens')
);

-- 5. Add additional protection for user_contact_info with rate limiting
DROP POLICY IF EXISTS "Users can only view their own contact info" ON public.user_contact_info;
DROP POLICY IF EXISTS "Users can only insert their own contact info" ON public.user_contact_info;
DROP POLICY IF EXISTS "Users can only update their own contact info" ON public.user_contact_info;

CREATE POLICY "Ultra secure contact info access"
ON public.user_contact_info
FOR SELECT
USING (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info')
);

CREATE POLICY "Ultra secure contact info insert"
ON public.user_contact_info
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info')
);

CREATE POLICY "Ultra secure contact info update"
ON public.user_contact_info
FOR UPDATE
USING (
  auth.uid() = user_id AND 
  public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info')
);

-- 6. Create a data access monitoring function
CREATE OR REPLACE FUNCTION public.monitor_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Enhanced monitoring for sensitive table access
  IF TG_TABLE_NAME IN ('user_contact_info', 'payment_transactions', 'vip_subscriptions', 'device_tokens') THEN
    -- Check for suspicious access patterns
    PERFORM public.log_sensitive_action(
      'sensitive_table_access',
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      jsonb_build_object(
        'operation', TG_OP,
        'table', TG_TABLE_NAME,
        'timestamp', now(),
        'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply monitoring triggers
CREATE TRIGGER monitor_user_contact_info_access
  AFTER INSERT OR UPDATE OR DELETE ON public.user_contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.monitor_sensitive_data_access();

CREATE TRIGGER monitor_device_tokens_access
  AFTER INSERT OR UPDATE OR DELETE ON public.device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.monitor_sensitive_data_access();