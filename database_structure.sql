-- SQL QUERIES TO UNDERSTAND YOUR DATABASE STRUCTURE
-- Copy these to Supabase SQL Editor one by one

-- ===========================================
-- 1. COUNT ALL TABLES AND THEIR COLUMNS
-- ===========================================
SELECT 
    schemaname as schema,
    tablename as table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = pt.tablename 
     AND table_schema = pt.schemaname) as column_count
FROM pg_tables pt
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- ===========================================
-- 2. LIST ALL YOUR TABLES WITH DETAILS
-- ===========================================
SELECT 
    schemaname as schema,
    tablename as table_name,
    tableowner as owner,
    hasindexes as has_indexes,
    hasrules as has_rules,
    hastriggers as has_triggers
FROM pg_tables 
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- ===========================================
-- 3. DETAILED COLUMN INFORMATION FOR ALL TABLES
-- ===========================================
SELECT 
    table_schema as schema,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name, ordinal_position;

-- ===========================================
-- 4. YOUR PUBLIC TABLES ONLY (YOUR MAIN TABLES)
-- ===========================================
SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name 
     AND table_schema = 'public') as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ===========================================
-- 5. DETAILED VIEW OF EACH PUBLIC TABLE STRUCTURE
-- ===========================================
-- Payment Tables
SELECT 'payment_transactions' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'pro_subscriptions' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'waiting_payments' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'waiting_payments' AND table_schema = 'public'
ORDER BY ordinal_position;

-- User Tables
SELECT 'profiles' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Content Tables (if exist)
SELECT 'verses' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'verses' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ===========================================
-- 6. TABLE RELATIONSHIPS (FOREIGN KEYS)
-- ===========================================
SELECT
    tc.table_name as table_name,
    kcu.column_name as column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- ===========================================
-- 7. SIMPLE SUMMARY FOR YOU
-- ===========================================
SELECT 
    'TOTAL TABLES' as info,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT 
    'TOTAL COLUMNS IN PUBLIC SCHEMA' as info,
    COUNT(*) as count
FROM information_schema.columns 
WHERE table_schema = 'public';