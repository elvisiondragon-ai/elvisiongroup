-- FIND THE ACTUAL AUTH LOG TABLES
-- The 86K requests must be logged somewhere

-- 1. CHECK ALL POSSIBLE AUTH/LOG TABLES
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename LIKE '%auth%' 
   OR tablename LIKE '%log%' 
   OR tablename LIKE '%audit%'
   OR tablename LIKE '%session%'
   OR tablename LIKE '%token%'
ORDER BY schemaname, tablename;

-- 2. CHECK FOR SUPABASE ANALYTICS TABLES
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('_analytics', 'supabase_functions', 'extensions', 'realtime')
ORDER BY table_schema, table_name;

-- 3. CHECK FOR ANY TABLES WITH 'REQUEST' OR 'METRIC' IN NAME
SELECT 
    table_schema,
    table_name
FROM information_schema.tables 
WHERE table_name LIKE '%request%' 
   OR table_name LIKE '%metric%'
   OR table_name LIKE '%stat%'
   OR table_name LIKE '%usage%'
ORDER BY table_schema, table_name;

-- 4. CHECK auth SCHEMA FOR ALL TABLES
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 5. CHECK FOR REFRESH TOKENS TABLE (LIKELY CULPRIT)
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'refresh_tokens'
ORDER BY ordinal_position;

-- 6. CHECK FOR SESSIONS TABLE
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'sessions'
ORDER BY ordinal_position;