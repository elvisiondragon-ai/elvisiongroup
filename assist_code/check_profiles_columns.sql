-- Check profiles table structure and the last_notification_time column

-- 1. Check if profiles table exists and see its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check specifically for last_notification_time column
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND column_name = 'last_notification_time'
    AND table_schema = 'public';

-- 3. Check if there are any rows in profiles table
SELECT COUNT(*) as total_profiles FROM profiles;

-- 4. Sample a few rows to see the data structure
SELECT 
    id,
    user_id,
    display_name,
    created_at,
    updated_at,
    last_notification_time
FROM profiles 
LIMIT 5;

-- 5. Check for any constraints on the last_notification_time column
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'profiles' 
    AND kcu.column_name = 'last_notification_time'
    AND tc.table_schema = 'public';