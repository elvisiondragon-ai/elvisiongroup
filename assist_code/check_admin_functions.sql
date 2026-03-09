-- Check what admin functions exist
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%admin%'
ORDER BY routine_name;

-- Check existing policies to see what functions they use
SELECT 
    schemaname,
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('admin_roles', 'days_remaining', 'data_classification')
ORDER BY tablename, policyname;