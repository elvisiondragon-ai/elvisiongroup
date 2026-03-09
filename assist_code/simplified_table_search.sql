-- SIMPLIFIED TABLE SEARCH FOR 86K SOURCE
-- Using standard information_schema tables

-- 1. FIND ALL TABLES WITH 'AUTH', 'LOG', 'AUDIT' IN NAME
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%auth%' 
   OR table_name LIKE '%log%'
   OR table_name LIKE '%audit%'
   OR table_name LIKE '%request%'
   OR table_name LIKE '%metric%'
ORDER BY table_schema, table_name;

-- 2. CHECK ALL SCHEMAS AVAILABLE
SELECT DISTINCT table_schema
FROM information_schema.tables 
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY table_schema;

-- 3. CHECK ALL TABLES IN AUTH SCHEMA
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 4. CHECK FOR ANALYTICS OR MONITORING SCHEMAS
SELECT 
    table_schema,
    table_name
FROM information_schema.tables 
WHERE table_schema LIKE '%analytic%'
   OR table_schema LIKE '%monitor%'
   OR table_schema LIKE '%supabase%'
   OR table_schema LIKE '%stat%'
ORDER BY table_schema, table_name;

-- 5. SAMPLE DATA FROM EACH AUTH TABLE TO UNDERSTAND CONTENT
-- auth.users sample
SELECT 'auth.users' as table_name, COUNT(*) as row_count
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

-- auth.sessions sample  
SELECT 'auth.sessions' as table_name, COUNT(*) as row_count
FROM auth.sessions
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

-- Check if refresh_tokens exists
SELECT 'auth.refresh_tokens' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'refresh_tokens')
            THEN (SELECT COUNT(*)::text FROM auth.refresh_tokens WHERE created_at >= NOW() - INTERVAL '24 hours')
            ELSE 'TABLE_NOT_EXISTS'
       END as row_count;