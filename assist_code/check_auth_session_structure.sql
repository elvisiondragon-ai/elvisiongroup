-- Check what fields exist in Supabase auth session/user tables

-- 1. Check auth.users table structure (where session data comes from)
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check if display_name or similar exists in auth.users
SELECT 
    id,
    email,
    phone,
    email_confirmed_at,
    phone_confirmed_at,
    raw_user_meta_data,
    user_metadata,
    created_at
FROM auth.users 
WHERE email = 'dragon@yahoo.com'
LIMIT 1;

-- 3. Check what's in raw_user_meta_data (sometimes has display info)
SELECT 
    email,
    raw_user_meta_data::text as metadata_content
FROM auth.users 
WHERE email = 'dragon@yahoo.com';