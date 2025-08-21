-- Ensure the start_pro_trial function is properly created
CREATE OR REPLACE FUNCTION public.start_pro_trial(p_user_id uuid, p_email text, p_ip_address text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  subscription_id UUID;
  trial_end TIMESTAMPTZ;
BEGIN
  -- Calculate trial end date (3 days from now)
  trial_end := now() + INTERVAL '3 days';
  
  -- Insert or update Pro subscription
  INSERT INTO public.pro_subscriptions (
    user_id, 
    user_email,
    ip_address,
    subscription_type,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    p_user_id, 
    p_email, 
    p_ip_address,
    'trial',
    'active',
    now(),
    trial_end
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    subscription_type = 'trial',
    status = 'active',
    trial_start_date = now(),
    trial_end_date = trial_end,
    updated_at = now()
  RETURNING id INTO subscription_id;
  
  RETURN subscription_id;
END;
$$;

-- Update audit trigger to use proper table name
CREATE OR REPLACE FUNCTION public.audit_pro_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log subscription status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM public.log_sensitive_action(
      'pro_subscription_status_change',
      'pro_subscriptions',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'user_id', NEW.user_id,
        'user_email', NEW.user_email
      )
    );
  END IF;
  
  -- Log new subscriptions
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'pro_subscription_created',
      'pro_subscriptions',
      NEW.id,
      jsonb_build_object(
        'subscription_type', NEW.subscription_type,
        'user_id', NEW.user_id,
        'user_email', NEW.user_email
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Replace the old audit trigger
DROP TRIGGER IF EXISTS audit_vip_changes_trigger ON public.pro_subscriptions;
CREATE TRIGGER audit_pro_changes_trigger
  AFTER INSERT OR UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_pro_changes();