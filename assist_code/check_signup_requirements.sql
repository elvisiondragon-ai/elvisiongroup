-- Check auth.users table structure (mandatory for signup)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- Check profiles table structure (user profile data)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what's required for signup by looking at NOT NULL constraints
SELECT
    tc.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.columns c ON c.table_name = tc.table_name AND c.column_name = ccu.column_name
WHERE tc.table_name IN ('users', 'profiles')
AND tc.table_schema IN ('auth', 'public')
AND tc.constraint_type = 'NOT NULL'
ORDER BY tc.table_name, c.ordinal_position;