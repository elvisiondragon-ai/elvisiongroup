-- ===========================================
-- CHECK FRONTEND PRO LOGIC AND UNAUTHORIZED USERS
-- ===========================================

-- 1. Find users with trial/test emails who might be getting pro access
SELECT
    p.user_id,
    p.display_name,
    p.user_email,
    p.created_at as profile_created,
    ps.user_id as has_pro_subscription,
    ps.status as subscription_status,
    ps.subscription_end_date,
    ps.days_remaining
FROM profiles p
LEFT JOIN pro_subscriptions ps ON p.user_id = ps.user_id
WHERE p.user_email ILIKE '%trial%'
OR p.user_email ILIKE '%test%'
OR p.display_name ILIKE '%trial%'
ORDER BY p.created_at DESC;

-- 2. Check if there are any hardcoded pro users in the system
-- Look for users who might be getting pro status from somewhere else
SELECT
    p.user_id,
    p.display_name,
    p.user_email,
    ps.status as subscription_status,
    ps.days_remaining,
    'Potential unauthorized pro user' as note
FROM profiles p
LEFT JOIN pro_subscriptions ps ON p.user_id = ps.user_id
WHERE ps.user_id IS NULL
AND p.user_email IN (
    'trial01@gmail.com',
    'test@gmail.com',
    'admin@gmail.com'
);

-- 3. Check the usePro hook logic by seeing what it queries
-- This will help understand how frontend determines pro status