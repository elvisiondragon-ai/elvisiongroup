-- FIX DAYS_REMAINING SYNC ISSUE
-- The days_remaining field is out of sync with actual subscription_end_date

-- ============================================================================
-- IMMEDIATE FIX #1: UPDATE ALL DAYS_REMAINING VALUES NOW
-- ============================================================================
-- This will sync all days_remaining values with actual subscription_end_date
UPDATE public.pro_subscriptions 
SET 
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
    updated_at = NOW()
WHERE status = 'active' 
AND subscription_end_date IS NOT NULL;

-- ============================================================================
-- IMMEDIATE FIX #2: EXPIRE USERS WITH 0 OR NEGATIVE DAYS
-- ============================================================================
-- After updating days_remaining, expire any users with 0 or negative days
UPDATE public.pro_subscriptions 
SET 
    status = 'expired',
    updated_at = NOW()
WHERE status = 'active' 
AND (
    days_remaining <= 0 
    OR subscription_end_date <= NOW()
);

-- ============================================================================
-- IMMEDIATE FIX #3: DELETE EXPIRED RECORDS 
-- ============================================================================
-- Clean up expired records to trigger cleanup
DELETE FROM public.pro_subscriptions 
WHERE status = 'expired';

-- ============================================================================
-- LONG-TERM FIX: ADD DAILY CRON JOB FOR DAYS_REMAINING SYNC
-- ============================================================================
-- Create a daily job to sync days_remaining values
SELECT cron.schedule(
    'daily-days-remaining-sync',
    '0 1 * * *', -- 1 AM daily
    $$
    -- Update days_remaining for all active subscriptions
    UPDATE public.pro_subscriptions 
    SET 
        days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
        updated_at = NOW()
    WHERE status = 'active' 
    AND subscription_end_date IS NOT NULL;
    
    -- Expire subscriptions with 0 or negative days
    UPDATE public.pro_subscriptions 
    SET 
        status = 'expired',
        updated_at = NOW()
    WHERE status = 'active' 
    AND (days_remaining <= 0 OR subscription_end_date <= NOW());
    
    -- Clean up expired records
    DELETE FROM public.pro_subscriptions WHERE status = 'expired';
    $$
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after the fixes to verify everything is correct

-- Check if days_remaining is now synced
SELECT 
    '=== DAYS REMAINING SYNC CHECK ===' as check_type,
    user_email,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as actual_days,
    CASE 
        WHEN days_remaining = EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER THEN '✅ SYNCED'
        ELSE '❌ STILL OUT OF SYNC'
    END as sync_status
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC;

-- Check for any remaining expired users
SELECT 
    '=== EXPIRED USERS CHECK ===' as check_type,
    COUNT(*) as expired_count,
    string_agg(user_email, ', ') as expired_emails
FROM public.pro_subscriptions 
WHERE status = 'active' 
AND (subscription_end_date <= NOW() OR days_remaining <= 0);

-- Check cron jobs
SELECT 
    '=== CRON JOBS ===' as check_type,
    jobname,
    schedule,
    active
FROM cron.job 
WHERE jobname LIKE '%days%' OR jobname LIKE '%sync%' OR jobname LIKE '%expire%'
ORDER BY jobname;