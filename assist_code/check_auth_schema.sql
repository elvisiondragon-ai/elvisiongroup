-- Check auth.users table structure to see display_name field
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if there's a display_name column directly in auth.users
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users' 
  AND column_name LIKE '%display%';

-- Sample query to see actual auth.users data structure
SELECT 
    id,
    email,
    raw_user_meta_data,
    user_metadata,
    created_at
FROM auth.users 
LIMIT 1;

-- Check if display_name is stored in raw_user_meta_data or user_metadata
SELECT 
    email,
    raw_user_meta_data ->> 'display_name' as raw_display_name,
    user_metadata ->> 'display_name' as metadata_display_name
FROM auth.users
WHERE email IS NOT NULL
LIMIT 5;