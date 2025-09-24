-- CHECK AUTH METADATA CONTENT
-- What's currently stored in auth.users metadata fields

-- 1. CHECK WHAT'S IN AUTH METADATA FIELDS
SELECT 
    id,
    email,
    raw_user_meta_data,
    raw_app_meta_data,
    created_at,
    updated_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. CHECK SPECIFIC METADATA KEYS
SELECT 
    id,
    email,
    raw_user_meta_data ->> 'display_name' as metadata_display_name,
    raw_user_meta_data ->> 'full_name' as metadata_full_name,
    raw_user_meta_data ->> 'name' as metadata_name,
    raw_user_meta_data ->> 'phone' as metadata_phone,
    raw_user_meta_data ->> 'avatar_url' as metadata_avatar,
    raw_app_meta_data ->> 'provider' as provider,
    raw_app_meta_data ->> 'providers' as providers
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. CHECK PROFILES TABLE VS METADATA COMPARISON
SELECT 
    au.id as auth_user_id,
    au.email,
    au.raw_user_meta_data ->> 'display_name' as auth_metadata_name,
    p.display_name as profiles_table_name,
    p.phone_number as profiles_phone,
    CASE 
        WHEN (au.raw_user_meta_data ->> 'display_name') IS NOT NULL 
        THEN '✅ HAS METADATA NAME'
        ELSE '❌ NO METADATA NAME'
    END as metadata_status,
    CASE 
        WHEN p.display_name IS NOT NULL 
        THEN '✅ HAS PROFILE NAME'
        ELSE '❌ NO PROFILE NAME'
    END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
ORDER BY au.created_at DESC 
LIMIT 10;

-- 4. CHECK ALL POSSIBLE METADATA KEYS
SELECT DISTINCT
    jsonb_object_keys(raw_user_meta_data) as user_metadata_keys
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL;

SELECT DISTINCT
    jsonb_object_keys(raw_app_meta_data) as app_metadata_keys
FROM auth.users 
WHERE raw_app_meta_data IS NOT NULL;

-- 5. SAMPLE METADATA STRUCTURE
SELECT 
    'SAMPLE AUTH METADATA STRUCTURE' as info,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL 
LIMIT 3;