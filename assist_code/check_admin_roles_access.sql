-- Check admin_roles table access and structure
-- Run this to debug the 404 and SQL errors

-- Check if admin_roles table exists and is accessible
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_roles';

-- Check RLS policies on admin_roles
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_roles';

-- Check column data types (might be causing the timestamp error)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_roles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Simple direct query to test access
SELECT user_id, role, is_active FROM admin_roles LIMIT 5;

-- Check if there are any views or functions that provide admin info
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%admin%';