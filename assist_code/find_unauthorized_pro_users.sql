-- ===========================================
-- FIND UNAUTHORIZED PRO USERS
-- ===========================================

-- 1. Check how frontend determines pro status (look for usePro hook logic)
-- Need to check what columns profiles table has that might indicate pro status
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name ILIKE '%pro%';

-- 2. Find users who appear to have pro access but are NOT in pro_subscriptions
-- Check for suspicious users like trial01
SELECT
    p.user_id,
    p.display_name,
    p.user_email,
    p.created_at,
    'Not in pro_subscriptions but suspicious' as issue
FROM profiles p
LEFT JOIN pro_subscriptions ps ON p.user_id = ps.user_id
WHERE ps.user_id IS NULL
AND (
    p.user_email ILIKE '%trial%'
    OR p.user_email ILIKE '%test%'
    OR p.user_email ILIKE '%admin%'
    OR p.display_name ILIKE '%trial%'
);

-- 3. Check if there are expired subscriptions still marked as active
SELECT
    user_id,
    user_email,
    status,
    subscription_end_date,
    days_remaining,
    CASE
        WHEN subscription_end_date < NOW() THEN 'EXPIRED'
        WHEN days_remaining <= 0 THEN 'NO_DAYS_LEFT'
        ELSE 'VALID'
    END as actual_status
FROM pro_subscriptions
WHERE status = 'active'
AND (subscription_end_date < NOW() OR days_remaining <= 0);

-- 4. Check prevent_unauthorized_pro function
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'prevent_unauthorized_pro';