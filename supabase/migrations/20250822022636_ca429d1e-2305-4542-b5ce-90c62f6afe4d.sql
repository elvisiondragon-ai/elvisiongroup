-- Fix the ambiguous status column in check_pro_status function
CREATE OR REPLACE FUNCTION public.check_pro_status(p_user_id uuid)
RETURNS TABLE(
  is_pro boolean,
  subscription_type text,
  status text,
  expires_at timestamptz,
  days_remaining integer
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  subscription_record RECORD;
  current_time timestamptz := now();
BEGIN
  -- Get the most recent active subscription
  SELECT * INTO subscription_record
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
  
  -- If no subscription found
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, null::text, null::text, null::timestamptz, null::integer;
    RETURN;
  END IF;
  
  -- Check if subscription is active based on type
  IF subscription_record.subscription_type = 'trial' THEN
    IF subscription_record.status = 'active' AND 
       subscription_record.trial_end_date IS NOT NULL AND 
       subscription_record.trial_end_date > current_time THEN
      RETURN QUERY SELECT 
        true,
        subscription_record.subscription_type,
        subscription_record.status,
        subscription_record.trial_end_date,
        EXTRACT(days FROM (subscription_record.trial_end_date - current_time))::integer;
    ELSE
      RETURN QUERY SELECT false, subscription_record.subscription_type, 'expired', subscription_record.trial_end_date, 0;
    END IF;
  ELSIF subscription_record.subscription_type IN ('monthly', 'yearly') THEN
    IF subscription_record.status = 'active' AND
       (subscription_record.subscription_end_date IS NULL OR subscription_record.subscription_end_date > current_time) THEN
      RETURN QUERY SELECT 
        true,
        subscription_record.subscription_type,
        subscription_record.status,
        COALESCE(subscription_record.subscription_end_date, subscription_record.trial_end_date),
        CASE 
          WHEN subscription_record.subscription_end_date IS NOT NULL 
          THEN EXTRACT(days FROM (subscription_record.subscription_end_date - current_time))::integer
          ELSE null::integer
        END;
    ELSE
      RETURN QUERY SELECT false, subscription_record.subscription_type, 'expired', subscription_record.subscription_end_date, 0;
    END IF;
  ELSE
    RETURN QUERY SELECT false, subscription_record.subscription_type, subscription_record.status, null::timestamptz, null::integer;
  END IF;
  
  RETURN;
END;
$$;