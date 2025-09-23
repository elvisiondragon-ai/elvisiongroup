-- Check Supabase Auth Session Structure - FIXED VERSION
-- This will help understand what data is available in session.user

-- 1. Check auth.users table structure (this is what session.user contains)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check a sample user's data from auth.users
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    updated_at,
    email_confirmed_at
FROM auth.users 
LIMIT 3;

-- 3. Check what's inside raw_user_meta_data for display_name
SELECT 
    id,
    email,
    raw_user_meta_data::text as raw_meta,
    raw_user_meta_data->>'display_name' as raw_display_name,
    raw_user_meta_data->>'full_name' as raw_full_name
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL 
LIMIT 5;

-- 4. Compare with profiles table display_name
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'display_name' as auth_display_name,
    u.raw_user_meta_data->>'full_name' as auth_full_name,
    p.display_name as profile_display_name,
    CASE 
        WHEN u.raw_user_meta_data->>'display_name' IS NOT NULL THEN 'auth_raw_display'
        WHEN u.raw_user_meta_data->>'full_name' IS NOT NULL THEN 'auth_raw_full'
        WHEN p.display_name IS NOT NULL THEN 'profile_only'
        ELSE 'no_display_name'
    END as display_name_source
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days'
ORDER BY u.created_at DESC
LIMIT 10;

-- 5. Check if display_name exists in raw_user_meta_data from recent signups
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN raw_user_meta_data->>'display_name' IS NOT NULL THEN 1 END) as has_raw_display_name,
    COUNT(CASE WHEN raw_user_meta_data->>'full_name' IS NOT NULL THEN 1 END) as has_raw_full_name,
    COUNT(CASE WHEN profiles.display_name IS NOT NULL THEN 1 END) as has_profile_display_name
FROM auth.users 
LEFT JOIN profiles ON auth.users.id = profiles.user_id
WHERE auth.users.created_at > NOW() - INTERVAL '7 days';

-- 6. Sample query to see actual raw_user_meta_data content
SELECT 
    id,
    email,
    jsonb_pretty(raw_user_meta_data) as meta_formatted,
    raw_user_meta_data ? 'display_name' as has_display_name_key,
    raw_user_meta_data ? 'full_name' as has_full_name_key
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL 
ORDER BY created_at DESC
LIMIT 5;

-- 7. Check specific users who signed up recently to see metadata structure
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data,
    p.display_name as profile_name,
    u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.created_at > NOW() - INTERVAL '3 days'
ORDER BY u.created_at DESC;

-- 8. Test if we can find users with display_name in metadata
SELECT 
    'Users with display_name in raw_user_meta_data:' as info,
    COUNT(*) as count
FROM auth.users 
WHERE raw_user_meta_data->>'display_name' IS NOT NULL
UNION ALL
SELECT 
    'Users with full_name in raw_user_meta_data:' as info,
    COUNT(*) as count
FROM auth.users 
WHERE raw_user_meta_data->>'full_name' IS NOT NULL;