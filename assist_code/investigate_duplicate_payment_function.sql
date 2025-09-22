-- CRITICAL: Investigate duplicate payment callback function
-- This is extremely dangerous for payment processing

-- 1. Check ALL versions of process_tripay_payment_callback with their exact signatures
SELECT 
    'payment_callback_versions' as test,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as function_signature,
    pg_get_functiondef(p.oid) as full_definition,
    p.oid as function_oid
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'process_tripay_payment_callback'
ORDER BY p.oid;

-- 2. Check which version is actually being called by checking function dependencies
SELECT 
    'function_dependencies' as test,
    d.objid,
    d.refobjid,
    pg_describe_object(d.classid, d.objid, d.objsubid) as dependent_object,
    pg_describe_object(d.refclassid, d.refobjid, d.refobjsubid) as referenced_object
FROM pg_depend d
JOIN pg_proc p ON d.refobjid = p.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'process_tripay_payment_callback';

-- 3. Check recent function creation timestamps if available
SELECT 
    'function_metadata' as test,
    schemaname,
    routine_name,
    routine_type,
    external_language,
    is_deterministic,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'process_tripay_payment_callback';