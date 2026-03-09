-- Check if auth.users table has display_name column
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
    AND table_schema = 'auth'
ORDER BY ordinal_position;

-- Check what columns are available in auth.users
SELECT * FROM auth.users LIMIT 1;

-- Check raw_user_meta_data structure (this might contain display_name)
SELECT 
    id,
    email,
    raw_user_meta_data,
    user_metadata
FROM auth.users 
LIMIT 3;