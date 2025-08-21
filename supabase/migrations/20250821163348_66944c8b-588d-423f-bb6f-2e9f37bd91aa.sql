-- Update sync_pro_status_from_subscription function to use pro_subscriptions table
CREATE OR REPLACE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  has_active_subscription boolean := false;
  sub_record RECORD;
BEGIN
  -- Check if user has active pro subscription (updated table name)
  SELECT * INTO sub_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF FOUND THEN
    -- Check if subscription is active and not expired
    IF sub_record.status = 'active' THEN
      IF sub_record.subscription_type = 'trial' AND sub_record.trial_end_date > now() THEN
        has_active_subscription := true;
      ELSIF sub_record.subscription_type IN ('monthly', 'yearly') AND 
            (sub_record.subscription_end_date IS NULL OR sub_record.subscription_end_date > now()) THEN
        has_active_subscription := true;
      END IF;
    END IF;
  END IF;
  
  -- Grant or revoke pro status based on subscription
  IF has_active_subscription THEN
    PERFORM public.grant_pro_status(p_user_id);
  ELSE
    PERFORM public.revoke_pro_status(p_user_id);
  END IF;
  
  RETURN has_active_subscription;
END;
$$;

-- Update check_vip_status function to use pro_subscriptions and rename it
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id uuid)
RETURNS TABLE(is_pro boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  sub_record RECORD;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  SELECT * INTO sub_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ, NULL::INTEGER;
    RETURN;
  END IF;
  
  -- Determine expiration date
  IF sub_record.subscription_type = 'trial' THEN
    expires := sub_record.trial_end_date;
  ELSE
    expires := sub_record.subscription_end_date;
  END IF;
  
  -- Calculate remaining days
  remaining_days := EXTRACT(DAY FROM (expires - now()));
  
  -- Check if expired
  IF expires < now() AND sub_record.status = 'active' THEN
    -- Update status to expired
    UPDATE public.pro_subscriptions 
    SET status = 'expired', updated_at = now()
    WHERE user_id = p_user_id;
    
    RETURN QUERY SELECT false, sub_record.subscription_type, 'expired'::TEXT, expires, remaining_days;
  ELSE
    RETURN QUERY SELECT 
      (sub_record.status = 'active'), 
      sub_record.subscription_type, 
      sub_record.status, 
      expires, 
      remaining_days;
  END IF;
END;
$$;

-- Drop the old trigger and create new one for pro_subscriptions
DROP TRIGGER IF EXISTS trigger_auto_sync_pro ON public.vip_subscriptions;
DROP TRIGGER IF EXISTS trigger_auto_sync_pro ON public.pro_subscriptions;

CREATE TRIGGER trigger_auto_sync_pro
  AFTER INSERT OR UPDATE OR DELETE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_sync_pro_on_subscription_change();

-- Update start_vip_trial function to use pro_subscriptions
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