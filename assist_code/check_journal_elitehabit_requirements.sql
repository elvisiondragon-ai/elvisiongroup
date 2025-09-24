-- SIMPLE SQL CHECK: What data do JournalSpiritual.tsx and EliteHabit.tsx actually expect?
-- Following rule.txt: Simple validation, no assumptions

-- ==================================================
-- SECTION 1: SPIRITUAL JOURNAL DATA REQUIREMENTS
-- ==================================================

-- 1.1 Check reflections table structure - what does SpiritualJournal.tsx try to INSERT?
-- From line 80-87: user_id, user_email, reflection
SELECT
    'reflections table requirements' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reflections'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1.2 Check what fields SpiritualJournal.tsx actually uses vs what exists
-- Expected fields based on code: id, reflection, created_at, user_id, user_email
SELECT 
    'reflections field validation' as validation,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'id') THEN '✅' ELSE '❌' END as has_id,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'user_id') THEN '✅' ELSE '❌' END as has_user_id,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'user_email') THEN '✅' ELSE '❌' END as has_user_email,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'reflection') THEN '✅' ELSE '❌' END as has_reflection,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'created_at') THEN '✅' ELSE '❌' END as has_created_at;

-- 1.3 Check if reflections table has any data and what user_id format it uses
SELECT 
    'reflections data sample' as info,
    user_id,
    user_email,
    LENGTH(reflection) as reflection_length,
    created_at,
    CASE 
        WHEN user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN 'UUID format'
        ELSE 'Not UUID'
    END as user_id_format
FROM reflections
ORDER BY created_at DESC
LIMIT 5;

-- ==================================================
-- SECTION 2: ELITE HABIT DATA REQUIREMENTS
-- ==================================================

-- 2.1 Check elite_habits table structure
SELECT
    'elite_habits table requirements' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'elite_habits'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2.2 Check if elite_habits table exists at all
SELECT 
    'elite_habits existence check' as validation,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_habits' AND table_schema = 'public') 
        THEN '✅ Table exists' 
        ELSE '❌ Table missing' 
    END as table_status;

-- 2.3 Sample elite_habits data to understand structure
SELECT 
    'elite_habits data sample' as info,
    *
FROM elite_habits
ORDER BY created_at DESC
LIMIT 3;

-- ==================================================
-- SECTION 3: CROSS-REFERENCE WITH AUTH USERS
-- ==================================================

-- 3.1 Check if user_id values in reflections match auth.users
SELECT 
    'user_id validation' as check_type,
    COUNT(r.user_id) as total_reflections,
    COUNT(au.id) as matching_auth_users,
    COUNT(r.user_id) - COUNT(au.id) as orphaned_reflections
FROM reflections r
LEFT JOIN auth.users au ON r.user_id::uuid = au.id
WHERE r.created_at > NOW() - INTERVAL '30 days';

-- 3.2 Check if user_email in reflections matches auth.users.email
SELECT 
    'email validation' as check_type,
    r.user_email as reflection_email,
    au.email as auth_email,
    CASE WHEN r.user_email = au.email THEN '✅ Match' ELSE '❌ Mismatch' END as email_match
FROM reflections r
LEFT JOIN auth.users au ON r.user_id::uuid = au.id
ORDER BY r.created_at DESC
LIMIT 5;

-- ==================================================
-- SECTION 4: IDENTIFY MISSING DATA REQUIREMENTS
-- ==================================================

-- 4.1 Check if users trying to use journal have profiles (display_name issue)
SELECT 
    'profile data for journal users' as check_type,
    COUNT(DISTINCT r.user_id) as users_with_reflections,
    COUNT(DISTINCT p.user_id) as users_with_profiles,
    COUNT(DISTINCT CASE WHEN p.display_name IS NOT NULL AND trim(p.display_name) != '' THEN p.user_id END) as users_with_valid_display_names
FROM reflections r
LEFT JOIN profiles p ON r.user_id::uuid = p.user_id
WHERE r.created_at > NOW() - INTERVAL '7 days';

-- 4.2 Users who wrote reflections but have no profile data
SELECT 
    'users missing profile data' as issue,
    r.user_id,
    r.user_email,
    COUNT(r.id) as reflection_count,
    p.display_name,
    CASE 
        WHEN p.user_id IS NULL THEN '❌ No profile record'
        WHEN p.display_name IS NULL OR trim(p.display_name) = '' THEN '⚠️ Empty display_name' 
        ELSE '✅ Has profile'
    END as profile_status
FROM reflections r
LEFT JOIN profiles p ON r.user_id::uuid = p.user_id
WHERE r.created_at > NOW() - INTERVAL '7 days'
GROUP BY r.user_id, r.user_email, p.display_name, p.user_id
ORDER BY reflection_count DESC
LIMIT 10;

-- ==================================================
-- SECTION 5: SUMMARY OF REQUIREMENTS
-- ==================================================

-- 5.1 Final validation summary
SELECT 
    'REQUIREMENTS SUMMARY' as final_check,
    
    -- SpiritualJournal.tsx requirements
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'reflections') 
         THEN '✅ reflections table exists' 
         ELSE '❌ reflections table missing' END as spiritual_journal_table,
         
    -- EliteHabit.tsx requirements  
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'elite_habits') 
         THEN '✅ elite_habits table exists' 
         ELSE '❌ elite_habits table missing' END as elite_habit_table,
         
    -- Auth integration
    CASE WHEN (SELECT COUNT(*) FROM reflections r INNER JOIN auth.users au ON r.user_id::uuid = au.id) > 0
         THEN '✅ Auth users can create reflections'
         ELSE '⚠️ No valid auth user reflections found' END as auth_integration,
         
    -- Profile integration
    CASE WHEN (SELECT COUNT(*) FROM reflections r INNER JOIN profiles p ON r.user_id::uuid = p.user_id) > 0
         THEN '✅ Profile users have reflections'
         ELSE '⚠️ No profile integration found' END as profile_integration;