-- Check reflections table structure and permissions
-- Run these queries in Supabase SQL Editor to diagnose the issue

-- 1. Check if reflections table exists and its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'reflections'
ORDER BY ordinal_position;

-- 2. Check current reflections count
SELECT COUNT(*) as total_reflections FROM reflections;

-- 3. Check recent reflections (last 10)
SELECT id, user_id, question, reflection, created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check RLS (Row Level Security) policies on reflections table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'reflections';

-- 5. Check if there are any constraints or triggers that might be blocking inserts
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'reflections'::regclass;

-- 6. Test a simple insert (replace with real user_id)
-- INSERT INTO reflections (user_id, question, reflection)
-- VALUES ('test-user-id', 'Test question', 'Test reflection');

-- 7. Check if profiles table has required user_ids
SELECT COUNT(*) as total_profiles FROM profiles;

-- 8. Check for any failed insertions in logs (if logging is enabled)
-- This would need to be checked in Supabase dashboard logs

-- 9. Verify table permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'reflections';

-- 10. Check if there are any foreign key constraints causing issues
SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
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
  AND tc.table_name = 'reflections';