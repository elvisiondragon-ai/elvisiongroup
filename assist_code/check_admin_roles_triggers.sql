-- Check for triggers or computed columns causing timestamp errors

-- Check for triggers on admin_roles table
SELECT tgname, tgenabled, tgtype, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = (SELECT oid FROM pg_class WHERE relname = 'admin_roles');

-- Check for functions that might be called during queries
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name LIKE '%admin%' OR routine_name LIKE '%verify%';

-- Check the exact columns and their types
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_roles' 
ORDER BY ordinal_position;

-- Try a very simple query to isolate the issue
SELECT user_id FROM admin_roles WHERE role = 'admin' LIMIT 1;