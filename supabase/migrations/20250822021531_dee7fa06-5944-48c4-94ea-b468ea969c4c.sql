-- Check and fix remaining functions without search_path

-- Update start_vip_trial function (if exists)
CREATE OR REPLACE FUNCTION public.start_vip_trial(p_user_id uuid, p_email text, p_ip_address text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  subscription_id UUID;
  trial_end TIMESTAMPTZ;
BEGIN
  -- Calculate trial end date (3 days from now)
  trial_end := now() + INTERVAL '3 days';
  
  -- Insert or update VIP subscription
  INSERT INTO public.vip_subscriptions (
    user_id, 
    email, 
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
$function$;

-- Update check_vip_status function (if exists)
CREATE OR REPLACE FUNCTION public.check_vip_status(p_user_id uuid)
RETURNS TABLE(is_vip boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  sub_record RECORD;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  SELECT * INTO sub_record
  FROM public.vip_subscriptions
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
    UPDATE public.vip_subscriptions 
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
$function$;