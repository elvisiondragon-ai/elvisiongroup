-- Check what actually uses these HTTP functions in your codebase
-- This will show the real impact of moving the extension

-- 1. Search for ANY usage of HTTP functions in your database functions
SELECT 
    'http_usage_in_functions' as test,
    routine_name,
    routine_type,
    CASE 
        WHEN routine_definition ILIKE '%http_get%' THEN 'USES_HTTP_GET'
        WHEN routine_definition ILIKE '%http_post%' THEN 'USES_HTTP_POST'
        WHEN routine_definition ILIKE '%http_put%' THEN 'USES_HTTP_PUT'
        WHEN routine_definition ILIKE '%http_delete%' THEN 'USES_HTTP_DELETE'
        WHEN routine_definition ILIKE '%http_patch%' THEN 'USES_HTTP_PATCH'
        ELSE 'OTHER_HTTP'
    END as http_function_used,
    length(routine_definition) as function_size
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

-- 2. Look for specific functions that might make external API calls
SELECT 
    'potential_api_functions' as test,
    routine_name,
    routine_definition
FROM information_schema.routines  
WHERE routine_schema = 'public'
  AND (
    routine_name ILIKE '%api%' OR
    routine_name ILIKE '%webhook%' OR
    routine_name ILIKE '%callback%' OR
    routine_name ILIKE '%tripay%' OR
    routine_name ILIKE '%payment%' OR
    routine_name ILIKE '%notification%' OR
    routine_name ILIKE '%send%' OR
    routine_name ILIKE '%vps%'
  )
  AND (
    routine_definition ILIKE '%http_%' OR
    routine_definition ILIKE '%url%'
  );

-- 3. Check if any Edge Functions or triggers call HTTP
SELECT 
    'triggers_with_http' as test,
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE action_statement ILIKE '%http_%'
  AND trigger_schema = 'public';