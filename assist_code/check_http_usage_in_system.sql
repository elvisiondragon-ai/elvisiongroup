-- Check what actually uses HTTP functions in your system
-- This will show if moving the extension will break anything

-- 1. Find all functions that call HTTP functions
SELECT 
    'functions_using_http' as test,
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (
    routine_definition ILIKE '%http_get%' OR
    routine_definition ILIKE '%http_post%' OR  
    routine_definition ILIKE '%http_put%' OR
    routine_definition ILIKE '%http_delete%' OR
    routine_definition ILIKE '%http_patch%' OR
    routine_definition ILIKE '%urlencode%'
  );

-- 2. Check for any triggers that use HTTP
SELECT 
    'triggers_using_http' as test,
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE action_statement ILIKE '%http_%';

-- 3. Check for any views that use HTTP
SELECT 
    'views_using_http' as test,
    table_name,
    view_definition
FROM information_schema.views
WHERE view_definition ILIKE '%http_%'
  AND table_schema = 'public';

-- 4. Check what's actually calling HTTP functions by looking at logs/usage
-- (This would need to be run separately if you have query logging enabled)

-- 5. List all HTTP functions available
SELECT 
    'available_http_functions' as test,
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND proname LIKE 'http_%'
ORDER BY proname;