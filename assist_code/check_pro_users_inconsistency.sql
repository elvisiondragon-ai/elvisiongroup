-- ===========================================
-- CHECK PRO USERS INCONSISTENCY
-- ===========================================

-- 1. Check pro_subscriptions table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pro_subscriptions'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check profiles table for pro-related columns
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND (column_name ILIKE '%pro%' OR column_name ILIKE '%subscription%')
ORDER BY ordinal_position;

-- 3. Find users who are marked as pro in profiles but NOT in pro_subscriptions
SELECT
    p.user_id,
    p.display_name,
    p.user_email,
    p.created_at as profile_created,
    'PRO in profiles but NOT in pro_subscriptions' as issue
FROM profiles p
LEFT JOIN pro_subscriptions ps ON p.user_id = ps.user_id
WHERE ps.user_id IS NULL
AND (
    -- Look for any pro indicators in profiles table
    p.display_name ILIKE '%pro%'
    OR p.user_email ILIKE '%trial%'
    OR p.user_email ILIKE '%test%'
);

-- 4. Check current pro_subscriptions data
SELECT
    user_id,
    subscription_type,
    status,
    expires_at,
    created_at
FROM pro_subscriptions
ORDER BY created_at DESC
LIMIT 10;