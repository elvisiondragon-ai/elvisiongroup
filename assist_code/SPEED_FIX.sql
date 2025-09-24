-- SIMPLE FIX MODE: Fastest Loading Solution
-- REMOVE SESSION DEPENDENCIES + INSTANT CACHE + INDEPENDENT PROFILE FETCH

-- 1. SQL TO VERIFY CURRENT PERFORMANCE ISSUE
SELECT 'CURRENT PERFORMANCE CHECK' as fix_stage;

-- Check average profile load time by looking at recent updates
SELECT 
    count(*) as total_profiles,
    count(CASE WHEN display_name IS NOT NULL THEN 1 END) as complete_profiles,
    min(updated_at) as oldest_update,
    max(updated_at) as latest_update
FROM profiles;

-- Check users who would benefit from instant loading
SELECT 
    user_id,
    display_name,
    level,
    is_pro,
    subscription_type,
    last_login_date,
    phone_number IS NOT NULL as has_phone
FROM profiles 
WHERE last_login_date >= NOW() - INTERVAL '7 days'
   OR updated_at >= NOW() - INTERVAL '24 hours'
ORDER BY COALESCE(last_login_date, updated_at) DESC
LIMIT 20;

-- 2. VERIFY DATABASE INDEXES FOR FAST LOADING
SELECT 'DATABASE OPTIMIZATION CHECK' as fix_stage;

-- Check if user_id index exists for instant lookups
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'profiles' 
AND indexname LIKE '%user_id%';

-- If no index exists, this would create one:
-- CREATE INDEX CONCURRENTLY idx_profiles_user_id ON profiles(user_id);

-- 3. VERIFY AUTH TABLE PERFORMANCE  
SELECT 'AUTH PERFORMANCE CHECK' as fix_stage;

-- Check auth.users table responsiveness
SELECT 
    count(*) as total_auth_users,
    count(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    max(updated_at) as latest_auth_update
FROM auth.users;

-- 4. SOLUTION VALIDATION SQL
SELECT 'SOLUTION VALIDATION' as fix_stage;

-- Test query that components will use for instant loading
-- This simulates the new fast loading approach
SELECT 
    p.user_id,
    p.display_name,
    p.level,
    p.experience_points,
    p.is_pro,
    p.subscription_type,
    p.phone_number,
    au.email
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f' -- Test with known user
LIMIT 1;

-- 5. PERFORMANCE METRICS TO TRACK
SELECT 'PERFORMANCE METRICS' as fix_stage;

-- Before fix: measure current load patterns
SELECT 
    DATE_TRUNC('minute', updated_at) as minute_bucket,
    count(*) as profile_accesses
FROM profiles 
WHERE updated_at >= NOW() - INTERVAL '1 hour'
GROUP BY DATE_TRUNC('minute', updated_at)
ORDER BY minute_bucket DESC
LIMIT 10;

-- SUCCESS CRITERIA:
-- 1. Components render instantly with cached data
-- 2. Profile fetch happens in background  
-- 3. No 10-second wait times
-- 4. Activities work immediately on second visit
-- 5. First visit: fallback data → background fetch → cache for next time