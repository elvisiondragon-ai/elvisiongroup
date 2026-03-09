-- FIND THE ACTUAL SOURCE OF 86K AUTH REQUESTS
-- Not in sessions - must be in other tables or system logs

-- 1. CHECK ALL AUTH TABLES WITH ROW COUNTS
SELECT 
    schemaname,
    tablename,
    n_tup_ins as total_inserts,
    n_tup_upd as total_updates,
    n_tup_del as total_deletes,
    n_live_tup as current_rows,
    last_vacuum,
    last_analyze
FROM pg_stat_user_tables 
WHERE schemaname = 'auth'
ORDER BY n_tup_ins DESC;

-- 2. CHECK FOR AUDIT/LOG TABLES IN OTHER SCHEMAS
SELECT 
    schemaname,
    tablename,
    n_tup_ins as total_inserts,
    n_live_tup as current_rows
FROM pg_stat_user_tables 
WHERE tablename LIKE '%log%' 
   OR tablename LIKE '%audit%'
   OR tablename LIKE '%auth%'
   OR tablename LIKE '%request%'
ORDER BY n_tup_ins DESC;

-- 3. CHECK EXTENSIONS SCHEMA FOR SUPABASE ANALYTICS
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('extensions', '_analytics', 'supabase', 'realtime')
   AND (table_name LIKE '%auth%' 
        OR table_name LIKE '%log%'
        OR table_name LIKE '%metric%'
        OR table_name LIKE '%stat%')
ORDER BY table_schema, table_name;

-- 4. CHECK FOR FUNCTIONS/PROCEDURES THAT MIGHT LOG AUTH
SELECT 
    routine_schema,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%auth%'
   OR routine_name LIKE '%log%'
   OR routine_name LIKE '%metric%'
ORDER BY routine_schema, routine_name;

-- 5. LOOK FOR RECENTLY MODIFIED TABLES (HIGH ACTIVITY)
SELECT 
    schemaname,
    tablename,
    n_tup_ins + n_tup_upd + n_tup_del as total_activity,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables 
WHERE n_tup_ins + n_tup_upd + n_tup_del > 1000
ORDER BY total_activity DESC;

-- 6. CHECK POSTGRES LOG TABLES (IF ACCESSIBLE)
SELECT 
    tablename
FROM pg_tables 
WHERE tablename LIKE '%pg_stat%'
   OR tablename LIKE '%pg_log%'
ORDER BY tablename;

-- 7. CHECK IF SUPABASE EDGE FUNCTIONS SCHEMA EXISTS
SELECT 
    table_schema,
    table_name
FROM information_schema.tables 
WHERE table_schema LIKE '%supabase%'
   OR table_schema LIKE '%edge%'
ORDER BY table_schema, table_name;