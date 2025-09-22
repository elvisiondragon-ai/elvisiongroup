-- Debug why payment function still shows as vulnerable
-- Check the actual function definition that's currently in the database

SELECT 
    'current_payment_function_definition' as test,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'process_tripay_payment_callback';

-- Also check with pg_proc to see if there's a caching issue
SELECT 
    'pg_proc_payment_function' as test,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as full_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'process_tripay_payment_callback';