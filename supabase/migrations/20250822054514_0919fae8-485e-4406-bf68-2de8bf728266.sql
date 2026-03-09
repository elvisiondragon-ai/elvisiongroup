-- Drop the problematic check_pro_status function
DROP FUNCTION IF EXISTS public.check_pro_status(uuid);

-- Create a new, working check_pro_status function
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
SET search_path TO 'public'
AS $$
DECLARE
  sub_record RECORD;
  current_time timestamptz := now();
BEGIN
  -- Get the most recent subscription for the user
  SELECT * INTO sub_record
  FROM public.pro_subscriptions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no subscription found, return not pro
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, null::text, null::text, null::timestamptz, null::integer;
    RETURN;
  END IF;
  
  -- Check if subscription is active and not expired
  IF sub_record.status = 'active' THEN
    -- Handle trial subscriptions
    IF sub_record.subscription_type = 'trial' THEN
      IF sub_record.trial_end_date > current_time THEN
        RETURN QUERY SELECT 
          true,
          sub_record.subscription_type,
          sub_record.status,
          sub_record.trial_end_date,
          EXTRACT(days FROM (sub_record.trial_end_date - current_time))::integer;
        RETURN;
      END IF;
    -- Handle paid subscriptions
    ELSIF sub_record.subscription_type IN ('monthly', 'yearly') THEN
      IF sub_record.subscription_end_date IS NULL OR sub_record.subscription_end_date > current_time THEN
        RETURN QUERY SELECT 
          true,
          sub_record.subscription_type,
          sub_record.status,
          sub_record.subscription_end_date,
          CASE 
            WHEN sub_record.subscription_end_date IS NULL THEN null::integer
            ELSE EXTRACT(days FROM (sub_record.subscription_end_date - current_time))::integer
          END;
        RETURN;
      END IF;
    END IF;
  END IF;
  
  -- If we get here, subscription is not active or expired
  RETURN QUERY SELECT false, sub_record.subscription_type, sub_record.status, sub_record.subscription_end_date, null::integer;
END;
$$;