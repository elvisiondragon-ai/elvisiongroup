-- AUTH SCHEMA INVESTIGATION 
-- First check what auth tables and columns actually exist

-- 1. CHECK AUTH SCHEMA TABLES
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'auth'
ORDER BY table_name;

-- 2. CHECK COLUMNS IN AUTH TABLES
SELECT 
    table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth'
ORDER BY table_name, ordinal_position;

-- 3. CHECK IF AUDIT LOG EXISTS AND ITS STRUCTURE
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'audit_log_entries'
ORDER BY ordinal_position;

-- 4. CHECK SAMPLE DATA FROM AUDIT LOG (if exists)
SELECT *
FROM auth.audit_log_entries 
LIMIT 5;

-- 5. CHECK OTHER POSSIBLE AUTH LOG TABLES
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'auth'
    AND (table_name LIKE '%log%' OR table_name LIKE '%audit%' OR table_name LIKE '%event%');

-- 6. CHECK SUPABASE SYSTEM TABLES FOR AUTH METRICS
SELECT table_name
FROM information_schema.tables 
WHERE table_schema IN ('_analytics', 'supabase', 'extensions')
    AND (table_name LIKE '%auth%' OR table_name LIKE '%log%' OR table_name LIKE '%metric%');

-- 7. CHECK auth.users TABLE STRUCTURE
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'users'
ORDER BY ordinal_position;