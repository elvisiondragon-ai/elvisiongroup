-- Fix http extension security issue
-- Move http extension from public schema to restricted schema

-- 1. Check current extension usage first
SELECT 
    'http_extension_usage_check' as test,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_definition ILIKE '%http_%'
  AND routine_schema = 'public';

-- 2. Check what depends on http extension
SELECT 
    'http_extension_dependencies' as test,
    d.objid,
    d.refobjid,
    pg_describe_object(d.classid, d.objid, d.objsubid) as dependent_object
FROM pg_depend d
JOIN pg_extension e ON d.refobjid = e.oid
WHERE e.extname = 'http';

-- 3. The actual fix (run after checking dependencies)
-- CREATE SCHEMA IF NOT EXISTS extensions;
-- ALTER EXTENSION http SET SCHEMA extensions;

-- Verification query to run after fix:
-- SELECT extname, nspname as schema_name
-- FROM pg_extension e
-- JOIN pg_namespace n ON e.extnamespace = n.oid 
-- WHERE extname = 'http';