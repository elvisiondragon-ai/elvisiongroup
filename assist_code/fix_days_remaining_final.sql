-- ===============================================
-- COMPLETE FIX FOR DAYS_REMAINING COLUMN (NO TRIAL)
-- This will make subscription_end_date the source of truth
-- ===============================================

-- 1. Clean up any existing problematic triggers and functions
DROP TRIGGER IF EXISTS calculate_days_remaining_after_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS update_days_remaining_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
DROP FUNCTION IF EXISTS public.calculate_days_remaining_after();
DROP FUNCTION IF EXISTS public.update_days_remaining();
DROP FUNCTION IF EXISTS public.sync_days_remaining_table();

-- 2. Add back the days_remaining column with proper defaults
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS days_remaining INTEGER DEFAULT 0;

-- Ensure the column is NOT NULL and has a default
ALTER TABLE public.pro_subscriptions 
ALTER COLUMN days_remaining SET DEFAULT 0,
ALTER COLUMN days_remaining SET NOT NULL;

-- Set any NULL values to 0
UPDATE public.pro_subscriptions 
SET days_remaining = 0 
WHERE days_remaining IS NULL;

-- 3. Create a simple trigger function that uses subscription_end_date as source of truth
CREATE OR REPLACE FUNCTION public.calculate_days_remaining_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Calculate days remaining from subscription_end_date (source of truth)
  IF NEW.subscription_end_date IS NOT NULL THEN
    NEW.days_remaining = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER);
  ELSE
    NEW.days_remaining = 0;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Create the trigger (BEFORE trigger so it calculates before storing)
CREATE TRIGGER calculate_days_remaining_trigger
  BEFORE INSERT OR UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_days_remaining_trigger();

-- 5. Create a function to manually sync all days_remaining values
CREATE OR REPLACE FUNCTION public.sync_all_days_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.pro_subscriptions 
  SET days_remaining = CASE
    WHEN subscription_end_date IS NOT NULL THEN
      GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - CURRENT_TIMESTAMP))::INTEGER)
    ELSE 0
  END;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- 6. Fix all existing data by recalculating days_remaining from source of truth
SELECT public.sync_all_days_remaining();

-- 7. Update the check_unified_pro_status function (no trial logic)
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
      WHEN ps.status = 'active' AND ps.subscription_end_date > now() THEN true 
      ELSE false 
    END as is_pro,
    ps.subscription_type,
    ps.status,
    ps.subscription_end_date as expires_at,
    ps.days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$function$;

-- 8. Update expire_subscriptions function (no trial logic)
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-expire subscriptions based on subscription_end_date
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_end_date < now() 
    AND status = 'active';
END;
$function$;

-- 9. Create a daily maintenance function (optional - for scheduled jobs)
CREATE OR REPLACE FUNCTION public.daily_sync_days_remaining()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  sync_count INTEGER;
BEGIN
  -- Sync all active subscriptions daily
  SELECT public.sync_all_days_remaining() INTO sync_count;
  
  -- Also expire subscriptions that have passed their end date
  PERFORM public.expire_subscriptions();
  
  -- Log the sync (optional)
  RAISE NOTICE 'Daily sync completed. Updated % subscription records.', sync_count;
  
  RETURN sync_count;
END;
$$;

-- 10. Verify the fix by checking a few records
SELECT 
  id,
  subscription_type,
  subscription_end_date,
  days_remaining,
  EXTRACT(DAY FROM (subscription_end_date - CURRENT_TIMESTAMP))::INTEGER as calculated_days_remaining,
  status
FROM public.pro_subscriptions 
WHERE status = 'active'
LIMIT 5;