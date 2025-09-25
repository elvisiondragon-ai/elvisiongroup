-- MAKE days_remaining A SIMPLE CALCULATED COLUMN
-- Remove all complexity, keep it as basic support column that calculates from subscription_end_date

-- ============================================================================
-- STEP 1: REMOVE ALL COMPLEX INFRASTRUCTURE
-- ============================================================================

-- Remove redundant days_remaining TABLE (not needed - use column only)
DROP TABLE IF EXISTS public.days_remaining CASCADE;

-- Remove sync TRIGGERS (don't sync, just calculate when needed)
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS calculate_days_remaining_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS update_days_remaining_trigger ON public.pro_subscriptions;

-- Remove sync FUNCTIONS (don't sync, just calculate)
DROP FUNCTION IF EXISTS public.sync_days_remaining_table() CASCADE;
DROP FUNCTION IF EXISTS public.sync_all_days_remaining_table() CASCADE;
DROP FUNCTION IF EXISTS public.sync_all_days_remaining() CASCADE;
DROP FUNCTION IF EXISTS public.daily_sync_days_remaining() CASCADE;
DROP FUNCTION IF EXISTS public.refresh_all_days_remaining() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_days_remaining_trigger() CASCADE;
DROP FUNCTION IF EXISTS public.update_days_remaining() CASCADE;

-- Remove sync CRON JOB (don't sync daily, calculate real-time)
SELECT cron.unschedule('daily-days-remaining-sync');

-- ============================================================================
-- STEP 2: CREATE SIMPLE CALCULATED VIEW (OPTIONAL - FOR EASY ACCESS)
-- ============================================================================
-- Create a simple view that shows subscription data with calculated days_remaining
CREATE OR REPLACE VIEW public.subscription_status AS
SELECT 
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    -- SIMPLE CALCULATION: days_remaining from subscription_end_date
    CASE 
        WHEN status = 'active' AND subscription_end_date > NOW() 
        THEN GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)
        ELSE 0 
    END as days_remaining,
    verse_access,
    pro_badge,
    created_at,
    updated_at
FROM public.pro_subscriptions;

-- ============================================================================
-- STEP 3: UPDATE FUNCTION TO USE SIMPLE CALCULATION
-- ============================================================================
-- Make check_unified_pro_status() calculate days_remaining simply
CREATE OR REPLACE FUNCTION public.check_unified_pro_status(p_user_id uuid) 
RETURNS TABLE(
  is_pro boolean, 
  subscription_type text, 
  status text, 
  expires_at timestamp with time zone, 
  days_remaining integer,  -- Simple calculated field
  verse_access boolean, 
  pro_badge boolean
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
    -- SIMPLE: Calculate days_remaining from subscription_end_date
    CASE 
        WHEN ps.status = 'active' AND ps.subscription_end_date > NOW() 
        THEN GREATEST(0, EXTRACT(DAY FROM (ps.subscription_end_date - NOW()))::INTEGER)
        ELSE 0 
    END as days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$$;

-- ============================================================================
-- STEP 4: KEEP THE COLUMN FOR QUICK REFERENCE (OPTIONAL)
-- ============================================================================
-- Keep days_remaining column as simple support field
-- Don't sync it automatically, just update it when convenient
-- It can serve as a quick reference but subscription_end_date is source of truth

-- Option A: Keep column and manually update when needed
-- UPDATE public.pro_subscriptions 
-- SET days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)
-- WHERE status = 'active';

-- Option B: Remove column entirely and always calculate
-- ALTER TABLE public.pro_subscriptions DROP COLUMN IF EXISTS days_remaining;

-- ============================================================================
-- STEP 5: VERIFICATION - SIMPLE TEST
-- ============================================================================
-- Test the simple function
SELECT 
    '=== SIMPLE FUNCTION TEST ===' as test,
    user_email,
    subscription_end_date,
    EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as calculated_days
FROM public.pro_subscriptions 
WHERE status = 'active'
LIMIT 5;

-- Test the updated function
-- SELECT * FROM check_unified_pro_status('d079c984-0ba6-442e-8ebe-73e064b8bf3e'::uuid);

-- ============================================================================
-- RESULT: SIMPLE ARCHITECTURE
-- ============================================================================
/*
BEFORE (COMPLEX):
- pro_subscriptions table with days_remaining column (synced)
- days_remaining table (redundant)
- 3 sync triggers
- 7+ sync functions  
- 1 daily sync cron job
- Potential sync bugs and maintenance overhead

AFTER (SIMPLE):
- pro_subscriptions table with subscription_end_date (source of truth)
- days_remaining column (optional quick reference, not synced)
- subscription_status view (easy calculated access)
- 1 function that calculates days_remaining when called
- 0 sync mechanisms
- 0 maintenance overhead
- Always accurate, no sync bugs possible

PRINCIPLE: 
- subscription_end_date = SOURCE OF TRUTH
- days_remaining = CALCULATED SUPPORT FIELD  
- No complex syncing, just calculate when needed
- Simple, reliable, maintainable
*/