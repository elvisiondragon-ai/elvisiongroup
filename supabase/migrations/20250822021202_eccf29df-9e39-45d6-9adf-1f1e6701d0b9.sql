-- Fix security warnings by setting proper search_path on functions

-- Update check_pro_status function
DROP FUNCTION IF EXISTS public.check_pro_status(uuid);
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id uuid)
RETURNS TABLE(
  is_pro boolean,
  subscription_type text,
  status text,
  expires_at timestamp with time zone,
  days_remaining integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  pro_record RECORD;
  has_pro_achievement boolean;
  expires TIMESTAMPTZ;
  remaining_days INTEGER;
BEGIN
  -- Check if user has 'pro' achievement in profile
  SELECT 'pro' = ANY(achievements) INTO has_pro_achievement
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  has_pro_achievement := COALESCE(has_pro_achievement, false);
  
  -- Get active pro subscription
  SELECT * INTO pro_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id
    AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Determine expiration date
  IF pro_record.subscription_type = 'trial' THEN
    expires := pro_record.trial_end_date;
  ELSE
    expires := pro_record.subscription_end_date;
  END IF;
  
  -- Calculate remaining days
  remaining_days := EXTRACT(DAY FROM (expires - now()));
  
  -- Check if expired and update status if needed
  IF expires IS NOT NULL AND expires < now() AND pro_record.status = 'active' THEN
    -- Update status to expired
    UPDATE public.pro_subscriptions 
    SET status = 'expired', updated_at = now()
    WHERE user_id = p_user_id AND status = 'active';
    
    -- Remove pro achievement
    PERFORM public.revoke_pro_status(p_user_id);
    
    RETURN QUERY SELECT false, pro_record.subscription_type, 'expired'::text, expires, remaining_days;
  ELSE
    RETURN QUERY SELECT 
      has_pro_achievement AND (expires IS NULL OR expires > now()),
      COALESCE(pro_record.subscription_type, 'none'), 
      COALESCE(pro_record.status, 'inactive'), 
      expires, 
      remaining_days;
  END IF;
END;
$function$;

-- Update sync_pro_status_from_subscription function
CREATE OR REPLACE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;