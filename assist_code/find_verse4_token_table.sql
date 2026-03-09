-- Find where verse 4 token system is stored
-- Since user_profiles doesn't exist, check other tables

-- 1. List all tables to find where user data is stored
SELECT 'Available tables:' as info;
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check auth.users table structure (might have verse4 data)
SELECT 'auth.users structure:' as info;
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 3. Look for any columns with 'verse' in the name across all tables
SELECT 'Tables with verse-related columns:' as info;
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
AND column_name ILIKE '%verse%'
ORDER BY table_name, column_name;

-- 4. Look for any columns with 'token' or 'usage' in the name
SELECT 'Tables with token/usage columns:' as info;
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public'
AND (column_name ILIKE '%token%' OR column_name ILIKE '%usage%' OR column_name ILIKE '%used%')
ORDER BY table_name, column_name;