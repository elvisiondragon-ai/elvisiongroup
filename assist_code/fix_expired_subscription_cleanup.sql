-- INVESTIGATE: Why expired subscriptions are not being auto-removed
-- User Pengembar4muda@gmail.com expired on 2025-09-22, still in table on 2025-09-23

-- 1. Check all expired subscriptions that should be removed
SELECT 
    user_email,
    subscription_type,
    status,
    subscription_end_date,
    EXTRACT(DAY FROM (CURRENT_DATE - subscription_end_date)) as days_expired,
    created_at
FROM pro_subscriptions 
WHERE subscription_end_date < CURRENT_DATE
ORDER BY subscription_end_date DESC;

-- 2. Check if there's an auto-cleanup function/trigger
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name ILIKE '%subscription%' 
   OR routine_name ILIKE '%cleanup%'
   OR routine_name ILIKE '%expire%';

-- 3. Check for scheduled jobs/cron functions
SELECT 
    jobname,
    schedule,
    command
FROM cron.job 
WHERE command ILIKE '%subscription%' 
   OR command ILIKE '%expire%'
   OR command ILIKE '%cleanup%';

-- 4. FIX: Remove all expired subscriptions immediately
DELETE FROM pro_subscriptions 
WHERE subscription_end_date < CURRENT_DATE;

-- 5. Update profiles table - remove pro status for expired users
UPDATE profiles 
SET 
    is_pro = false,
    subscription_type = null
WHERE user_id IN (
    SELECT user_id FROM pro_subscriptions 
    WHERE subscription_end_date < CURRENT_DATE
);

-- 6. Verify cleanup worked
SELECT 
    COUNT(*) as remaining_expired_subscriptions
FROM pro_subscriptions 
WHERE subscription_end_date < CURRENT_DATE;

-- 7. Check specific user status after cleanup
SELECT 
    user_email,
    subscription_type,
    status,
    subscription_end_date
FROM pro_subscriptions 
WHERE user_email = 'Pengembar4muda@gmail.com';

-- 8. Check user profile after cleanup
SELECT 
    user_email,
    display_name,
    is_pro,
    subscription_type
FROM profiles 
WHERE user_email = 'Pengembar4muda@gmail.com';