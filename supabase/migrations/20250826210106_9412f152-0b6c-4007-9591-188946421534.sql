-- 1. Standardize subscription types in existing data
UPDATE pro_subscriptions 
SET subscription_type = CASE 
  WHEN subscription_type = 'monthly' THEN '1_month'
  WHEN subscription_type = 'yearly' THEN '1_year'  
  WHEN subscription_type = 'weekly' THEN '1_week'
  WHEN subscription_type = 'daily' THEN '1_day'
  ELSE subscription_type
END
WHERE subscription_type IN ('monthly', 'yearly', 'weekly', 'daily');

-- 2. Update check_unified_pro_status function to use new subscription types
CREATE OR REPLACE FUNCTION public.check_unified_pro_status(p_user_id uuid)
RETURNS TABLE(is_pro boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer, verse_access boolean, pro_badge boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    CASE 
      WHEN ps.status = 'active' AND (
        (ps.subscription_type = 'trial' AND ps.trial_end_date > now()) OR
        (ps.subscription_type IN ('1_month', '1_year', '1_week', '1_day') AND ps.subscription_end_date > now())
      ) THEN true 
      ELSE false 
    END as is_pro,
    ps.subscription_type,
    ps.status,
    CASE
      WHEN ps.subscription_type = 'trial' THEN ps.trial_end_date
      ELSE ps.subscription_end_date
    END as expires_at,
    CASE
      WHEN ps.subscription_type = 'trial' THEN 
        EXTRACT(DAY FROM (ps.trial_end_date - now()))::INTEGER
      ELSE 
        EXTRACT(DAY FROM (ps.subscription_end_date - now()))::INTEGER
    END as days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$function$;

-- 3. Update sync_pro_status_from_subscription function
CREATE OR REPLACE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  has_active_subscription boolean := false;
  sub_record RECORD;
BEGIN
  -- Check if user has active pro subscription
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
      ELSIF sub_record.subscription_type IN ('1_month', '1_year', '1_week', '1_day') AND 
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

-- 4. Update expire_subscriptions function
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-expire trial subscriptions
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_type = 'trial' 
    AND trial_end_date < now() 
    AND status = 'active';
  
  -- Auto-expire paid subscriptions
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_type IN ('1_month', '1_year', '1_week', '1_day') 
    AND subscription_end_date < now() 
    AND status = 'active';
END;
$function$;

-- 5. Create new AFTER trigger for days_remaining calculation (non-blocking)
CREATE OR REPLACE FUNCTION public.calculate_days_remaining_after()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  calculated_days integer := 0;
BEGIN
  -- Calculate days remaining based on subscription type and end dates
  IF NEW.subscription_type = 'trial' AND NEW.trial_end_date IS NOT NULL THEN
    calculated_days := GREATEST(0, EXTRACT(DAY FROM (NEW.trial_end_date - now()))::INTEGER);
  ELSIF NEW.subscription_type IN ('1_month', '1_year', '1_week', '1_day') AND NEW.subscription_end_date IS NOT NULL THEN
    calculated_days := GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - now()))::INTEGER);
  END IF;
  
  -- Update days_remaining in a separate transaction to avoid blocking
  BEGIN
    UPDATE public.pro_subscriptions 
    SET days_remaining = calculated_days,
        updated_at = now()
    WHERE id = NEW.id;
  EXCEPTION 
    WHEN OTHERS THEN
      -- Log error but don't block the main operation
      RAISE NOTICE 'Failed to update days_remaining for subscription %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$function$;

-- 6. Drop old BEFORE trigger if it exists and create new AFTER trigger
DROP TRIGGER IF EXISTS calculate_days_remaining_trigger ON public.pro_subscriptions;

CREATE TRIGGER calculate_days_remaining_after_trigger
    AFTER INSERT OR UPDATE ON public.pro_subscriptions
    FOR EACH ROW
    WHEN (NEW.subscription_type IS NOT NULL)
    EXECUTE FUNCTION public.calculate_days_remaining_after();

-- 7. Create function to update subscription with proper duration calculation
CREATE OR REPLACE FUNCTION public.update_subscription_status_manually(
  p_subscription_id uuid,
  p_status text,
  p_subscription_type text,
  p_duration_type text DEFAULT '1_month'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  subscription_record RECORD;
  new_end_date timestamptz;
  result jsonb;
BEGIN
  -- Get subscription record
  SELECT * INTO subscription_record
  FROM public.pro_subscriptions
  WHERE id = p_subscription_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Subscription not found');
  END IF;
  
  -- Calculate end date based on duration type
  CASE p_duration_type
    WHEN '1_day' THEN new_end_date := now() + INTERVAL '1 day';
    WHEN '1_week' THEN new_end_date := now() + INTERVAL '1 week';
    WHEN '1_month' THEN new_end_date := now() + INTERVAL '1 month';
    WHEN '1_year' THEN new_end_date := now() + INTERVAL '1 year';
    ELSE new_end_date := now() + INTERVAL '1 month'; -- Default to 1 month
  END CASE;
  
  -- Update subscription
  UPDATE public.pro_subscriptions
  SET 
    status = p_status,
    subscription_type = p_duration_type,
    subscription_end_date = CASE 
      WHEN p_duration_type != 'trial' THEN new_end_date
      ELSE subscription_end_date
    END,
    trial_end_date = CASE 
      WHEN p_duration_type = 'trial' THEN new_end_date
      ELSE trial_end_date
    END,
    updated_at = now()
  WHERE id = p_subscription_id;
  
  -- Sync pro status
  PERFORM public.sync_pro_status_from_subscription(subscription_record.user_id);
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'subscription_id', p_subscription_id,
    'new_status', p_status,
    'new_type', p_duration_type,
    'new_end_date', new_end_date,
    'user_synced', true
  );
  
  RETURN result;
END;
$function$;

-- 8. Set sensible default for days_remaining and ensure it's not nullable
ALTER TABLE public.pro_subscriptions 
ALTER COLUMN days_remaining SET DEFAULT 0,
ALTER COLUMN days_remaining SET NOT NULL;

-- Update any NULL values to 0
UPDATE public.pro_subscriptions 
SET days_remaining = 0 
WHERE days_remaining IS NULL;

-- 9. Recalculate days_remaining for all active subscriptions
UPDATE public.pro_subscriptions 
SET days_remaining = CASE
  WHEN subscription_type = 'trial' AND trial_end_date IS NOT NULL THEN
    GREATEST(0, EXTRACT(DAY FROM (trial_end_date - now()))::INTEGER)
  WHEN subscription_type IN ('1_month', '1_year', '1_week', '1_day') AND subscription_end_date IS NOT NULL THEN
    GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - now()))::INTEGER)
  ELSE 0
END
WHERE status = 'active';