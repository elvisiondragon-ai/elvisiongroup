-- Check REAL auth.users table structure (not assumptions)

-- 1. Get actual column names that exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Show sample auth.users record with actual columns
SELECT * FROM auth.users 
WHERE email = 'dragon@yahoo.com' 
LIMIT 1;