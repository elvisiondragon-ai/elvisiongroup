SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('auth', 'extensions', 'realtime', 'supabase_functions')
ORDER BY table_schema, table_name;