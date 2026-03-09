-- Check profiles table schema
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check profiles table constraints
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- Check relationship between auth.users and profiles
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'profiles';

-- Check current null email situation
SELECT
    COUNT(*) as total_profiles,
    COUNT(email) as profiles_with_email,
    COUNT(*) - COUNT(email) as null_emails,
    ROUND((COUNT(email) * 100.0 / COUNT(*)), 2) as email_fill_rate
FROM profiles;

-- Sample of null email profiles (first 5)
SELECT
    id,
    email,
    display_name,
    created_at,
    updated_at
FROM profiles
WHERE email IS NULL
LIMIT 5;

-- Check auth.users vs profiles email mismatch
SELECT
    p.id,
    p.email as profile_email,
    au.email as auth_email,
    p.created_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.email IS NULL AND au.email IS NOT NULL
LIMIT 10;