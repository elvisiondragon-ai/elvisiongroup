-- ===========================================
-- RECHECK TRIAL01 STATUS
-- ===========================================

-- 1. Check if trial01 actually exists in pro_subscriptions
SELECT
    COUNT(*) as count_in_pro_subs,
    'pro_subscriptions table' as table_name
FROM pro_subscriptions
WHERE user_email = 'trial01@yahoo.com'
UNION ALL
-- 2. Check if trial01 exists in profiles
SELECT
    COUNT(*) as count_in_profiles,
    'profiles table' as table_name
FROM profiles
WHERE user_email = 'trial01@yahoo.com';

-- 3. Get the actual user_id for trial01 from profiles
SELECT user_id, display_name, user_email, created_at
FROM profiles
WHERE user_email = 'trial01@yahoo.com';

-- 4. Check pro_subscriptions with the actual user_id
SELECT *
FROM pro_subscriptions
WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'trial01@yahoo.com' LIMIT 1
);