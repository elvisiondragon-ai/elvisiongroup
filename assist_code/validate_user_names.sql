-- Validation check for user name inconsistency
-- Check all possible sources of user names and find discrepancies

-- 1. Check auth.users vs profiles display_name consistency
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'display_name' as auth_metadata_name,
    p.display_name as profile_display_name,
    p.user_email as profile_email,
    CASE 
        WHEN u.raw_user_meta_data->>'display_name' != p.display_name 
        THEN '❌ MISMATCH' 
        ELSE '✅ MATCH' 
    END as name_consistency_check
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email IS NOT NULL
ORDER BY u.created_at DESC
LIMIT 20;

-- 2. Look for specific user with email containing 'tastas' or display_name containing 'Tastas' or 'Rasa'
SELECT 
    'AUTH USERS' as source,
    u.id,
    u.email,
    u.raw_user_meta_data->>'display_name' as name,
    u.created_at
FROM auth.users u
WHERE LOWER(u.email) LIKE '%tastas%' 
   OR LOWER(u.raw_user_meta_data->>'display_name') LIKE '%tastas%'
   OR LOWER(u.raw_user_meta_data->>'display_name') LIKE '%rasa%'

UNION ALL

SELECT 
    'PROFILES' as source,
    p.user_id,
    p.user_email,
    p.display_name as name,
    p.created_at
FROM profiles p
WHERE LOWER(p.user_email) LIKE '%tastas%' 
   OR LOWER(p.display_name) LIKE '%tastas%'
   OR LOWER(p.display_name) LIKE '%rasa%'

ORDER BY created_at DESC;

-- 3. Check for duplicate profiles or orphaned records
SELECT 
    'DUPLICATE CHECK' as check_type,
    COUNT(*) as count,
    user_email,
    string_agg(display_name, ', ') as all_names
FROM profiles 
WHERE user_email IS NOT NULL
GROUP BY user_email
HAVING COUNT(*) > 1;

-- 4. Check auth metadata vs profile data for all users with potential issues
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'display_name' as auth_name,
    p.display_name as profile_name,
    p.user_email as profile_email,
    u.created_at as auth_created,
    p.created_at as profile_created,
    CASE 
        WHEN u.email != p.user_email THEN '❌ EMAIL MISMATCH'
        WHEN u.raw_user_meta_data->>'display_name' != p.display_name THEN '❌ NAME MISMATCH'
        ELSE '✅ CONSISTENT'
    END as consistency_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE p.user_id IS NOT NULL
ORDER BY consistency_status DESC, u.created_at DESC;