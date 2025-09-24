-- ANALYTICS SESSION: Performance Analysis for Loading Speed Issue
-- Problem: User click activities -> stuck -> server think no profiles data -> need wait 10 seconds

-- 1. CHECK CURRENT SESSION & AUTH FLOW
SELECT 'AUTH SESSION ANALYSIS' as analysis_type;

-- Check if profiles exist for users
SELECT 
    count(*) as total_profiles,
    count(CASE WHEN display_name IS NOT NULL THEN 1 END) as profiles_with_names,
    count(CASE WHEN phone_number IS NOT NULL THEN 1 END) as profiles_with_phone,
    avg(CASE WHEN created_at IS NOT NULL THEN 1 ELSE 0 END) as profile_completion_rate
FROM profiles;

-- Check recent profile access patterns
SELECT 
    DATE_TRUNC('hour', updated_at) as hour_bucket,
    count(*) as profile_updates,
    count(DISTINCT user_id) as unique_users
FROM profiles 
WHERE updated_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', updated_at)
ORDER BY hour_bucket DESC;

-- 2. IDENTIFY PERFORMANCE BOTTLENECKS
SELECT 'PERFORMANCE BOTTLENECK ANALYSIS' as analysis_type;

-- Check for missing profiles (users without profile records)
-- This might cause the 10-second wait issue
SELECT 
    'MISSING_PROFILES' as issue_type,
    count(*) as count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- Check profile creation patterns
SELECT 
    DATE(created_at) as creation_date,
    count(*) as profiles_created,
    count(CASE WHEN display_name IS NULL THEN 1 END) as incomplete_profiles
FROM profiles 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY creation_date DESC;

-- 3. ANALYZE CURRENT CACHING STRATEGY
SELECT 'CACHE ANALYSIS' as analysis_type;

-- Check for profiles that might benefit from caching
SELECT 
    user_id,
    display_name,
    level,
    experience_points,
    is_pro,
    subscription_type,
    updated_at,
    (NOW() - updated_at) as time_since_update
FROM profiles 
WHERE updated_at >= NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC
LIMIT 20;

-- 4. VERIFY INDEXES FOR FAST LOADING
SELECT 'INDEX ANALYSIS' as analysis_type;

-- Check if proper indexes exist for user_id lookups
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'profiles' 
AND schemaname = 'public';

-- 5. SOLUTION RECOMMENDATIONS SQL
SELECT 'SOLUTION RECOMMENDATIONS' as analysis_type;

-- Check which users are most active and would benefit from instant loading
SELECT 
    user_id,
    display_name,
    level,
    last_login_date,
    (NOW()::date - last_login_date) as days_since_login,
    is_pro,
    subscription_type
FROM profiles 
WHERE last_login_date >= NOW() - INTERVAL '7 days'
ORDER BY last_login_date DESC
LIMIT 50;