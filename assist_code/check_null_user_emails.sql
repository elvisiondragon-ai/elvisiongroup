-- Check current null user_email situation
SELECT
    COUNT(*) as total_profiles,
    COUNT(user_email) as profiles_with_email,
    COUNT(*) - COUNT(user_email) as null_emails,
    ROUND((COUNT(user_email) * 100.0 / COUNT(*)), 2) as email_fill_rate
FROM profiles;

-- Sample of null user_email profiles (first 10)
SELECT
    id,
    user_id,
    user_email,
    display_name,
    created_at,
    last_login_date
FROM profiles
WHERE user_email IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Check auth.users vs profiles user_email mismatch
SELECT
    p.id,
    p.user_email as profile_email,
    au.email as auth_email,
    p.display_name,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.user_email IS NULL AND au.email IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;

-- Count profiles missing email but auth has email
SELECT
    COUNT(*) as missing_email_count
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.user_email IS NULL AND au.email IS NOT NULL;