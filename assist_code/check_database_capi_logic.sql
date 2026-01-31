-- Check for Database-level CAPI or Pixel event logic
-- This script searches for functions and triggers that might be sending events to Meta or other external services

-- 1. Search for functions containing CAPI, PIXEL, or WEBHOOK keywords
SELECT 
    'functions_with_event_logic' as category,
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND (
    p.proname ILIKE '%capi%' OR
    p.proname ILIKE '%pixel%' OR
    p.proname ILIKE '%webhook%' OR
    pg_get_functiondef(p.oid) ILIKE '%graph.facebook.com%' OR
    pg_get_functiondef(p.oid) ILIKE '%capi-universal%' OR
    pg_get_functiondef(p.oid) ILIKE '%net.http_post%' OR
    pg_get_functiondef(p.oid) ILIKE '%http_post%'
  );

-- 2. Search for triggers that might be calling these functions
SELECT 
    'triggers_with_event_logic' as category,
    event_object_table as table_name,
    trigger_name,
    action_timing,
    event_manipulation as event,
    action_statement as definition
FROM information_schema.triggers
WHERE action_statement ILIKE '%capi%'
   OR action_statement ILIKE '%pixel%'
   OR action_statement ILIKE '%webhook%'
   OR action_statement ILIKE '%http%';

-- 3. Check for the existence of pg_net extension (used for background HTTP requests in Supabase)
SELECT 
    'extensions_check' as category,
    name, 
    installed_version 
FROM pg_available_extensions 
WHERE name = 'pg_net' AND installed_version IS NOT NULL;

-- 4. Check for any usage of net.http_post in the public schema
SELECT 
    'pg_net_usage' as category,
    proname, 
    pg_get_functiondef(oid) 
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND pg_get_functiondef(oid) ILIKE '%net.http_post%';
