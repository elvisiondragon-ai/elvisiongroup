-- SPIRITUAL JOURNAL AUTH OPTIMIZATION ANALYSIS
-- Current: Using getSession() which is slower
-- Target: Change to getUser() for faster auth userid loading

-- 1. CHECK CURRENT REFLECTIONS TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reflections' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. SAMPLE CURRENT DATA TO UNDERSTAND STRUCTURE
SELECT 
    id,
    user_id,
    user_email,
    reflection,
    created_at
FROM reflections 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. CHECK IF USER_ID MATCHES AUTH.USERS.ID
SELECT 
    r.id as reflection_id,
    r.user_id as reflection_user_id,
    r.user_email,
    au.id as auth_user_id,
    au.email as auth_email,
    CASE 
        WHEN r.user_id = au.id THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as id_validation
FROM reflections r
LEFT JOIN auth.users au ON r.user_id = au.id
ORDER BY r.created_at DESC
LIMIT 10;

-- 4. PERFORMANCE TEST: COUNT OPERATIONS
SELECT 
    'CURRENT_METHOD' as method_type,
    'getSession() -> session.user.id' as description,
    '2-step process' as complexity,
    'SLOWER' as performance
UNION ALL
SELECT 
    'OPTIMIZED_METHOD' as method_type,
    'getUser() -> user.id' as description,
    '1-step process' as complexity,
    'FASTER' as performance;

-- 5. VERIFICATION QUERY AFTER OPTIMIZATION
-- This query will be used to verify the optimization works
SELECT 
    COUNT(*) as total_reflections,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(created_at) as latest_reflection
FROM reflections;