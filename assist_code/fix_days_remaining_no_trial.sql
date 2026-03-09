-- ===============================================
-- FINAL FIX: REMOVE TRIAL COLUMNS FROM DAYS_REMAINING TABLE
-- Match the actual pro_subscriptions table structure
-- ===============================================

-- 1. Clean up existing broken triggers and functions
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
DROP FUNCTION IF EXISTS public.sync_days_remaining_table();
DROP FUNCTION IF EXISTS public.sync_all_days_remaining_table();

-- 2. Remove trial columns from days_remaining table since they don't exist in pro_subscriptions
ALTER TABLE public.days_remaining 
DROP COLUMN IF EXISTS trial_start_date,
DROP COLUMN IF EXISTS trial_end_date;

-- 3. Update constraint to remove trial types
ALTER TABLE public.days_remaining 
DROP CONSTRAINT IF EXISTS days_remaining_subscription_type_check;

ALTER TABLE public.days_remaining 
ADD CONSTRAINT days_remaining_subscription_type_check 
CHECK (subscription_type IN ('1_month', '1_year', '1_week', '1_day', 'monthly', 'yearly'));

-- 4. Create simple sync function (no trial columns)
CREATE OR REPLACE FUNCTION public.sync_days_remaining_table()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_email TEXT;
  calculated_days INTEGER := 0;
BEGIN
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.days_remaining WHERE subscription_id = OLD.id;
    RETURN OLD;
  END IF;

  -- Get user email (prefer from pro_subscriptions, fallback to auth.users)
  user_email := COALESCE(NEW.user_email, (SELECT email FROM auth.users WHERE id = NEW.user_id));

  -- Calculate days remaining from subscription_end_date (source of truth)
  IF NEW.subscription_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER);
  END IF;

  -- Upsert to days_remaining table (no trial columns)
  INSERT INTO public.days_remaining (
    user_id,
    email,
    subscription_id,
    subscription_type,
    days_remaining,
    subscription_start_date,
    subscription_end_date,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.user_id,
    user_email,
    NEW.id,
    NEW.subscription_type,
    calculated_days,
    NEW.subscription_start_date,
    NEW.subscription_end_date,
    (NEW.status = 'active' AND NEW.subscription_end_date > now()),
    NEW.created_at,
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    subscription_id = EXCLUDED.subscription_id,
    subscription_type = EXCLUDED.subscription_type,
    days_remaining = EXCLUDED.days_remaining,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- 5. Create the trigger
CREATE TRIGGER sync_days_remaining_table_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_days_remaining_table();

-- 6. Create sync function for all existing data (no trial columns)
CREATE OR REPLACE FUNCTION public.sync_all_days_remaining_table()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
  sub_record RECORD;
BEGIN
  -- Clear existing data
  DELETE FROM public.days_remaining;
  
  -- Insert all current subscription data (no trial columns)
  FOR sub_record IN 
    SELECT 
      ps.id,
      ps.user_id,
      COALESCE(ps.user_email, au.email) as email,
      ps.subscription_type,
      ps.subscription_start_date,
      ps.subscription_end_date,
      ps.status,
      ps.created_at,
      GREATEST(0, EXTRACT(DAY FROM (ps.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER) as calculated_days
    FROM public.pro_subscriptions ps
    LEFT JOIN auth.users au ON ps.user_id = au.id
    WHERE ps.user_id IS NOT NULL
  LOOP
    INSERT INTO public.days_remaining (
      user_id,
      email,
      subscription_id,
      subscription_type,
      days_remaining,
      subscription_start_date,
      subscription_end_date,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      sub_record.user_id,
      sub_record.email,
      sub_record.id,
      sub_record.subscription_type,
      sub_record.calculated_days,
      sub_record.subscription_start_date,
      sub_record.subscription_end_date,
      (sub_record.status = 'active' AND sub_record.subscription_end_date > now()),
      sub_record.created_at,
      now()
    );
  END LOOP;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- 7. Sync all existing data
SELECT public.sync_all_days_remaining_table();

-- 8. Verify the fix
SELECT 
  'days_remaining table fixed (no trial columns)' as status,
  COUNT(*) as total_records 
FROM public.days_remaining;

-- 9. Show sample data
SELECT 
  email,
  subscription_type,
  days_remaining,
  is_active,
  subscription_end_date
FROM public.days_remaining 
LIMIT 5;