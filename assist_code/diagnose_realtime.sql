-- ====================================================================
-- COMPREHENSIVE REALTIME DIAGNOSTICS
-- Run all queries below in Supabase SQL Editor
-- ====================================================================

-- 1. CHECK: Is chat_messages in the supabase_realtime publication?
-- EXPECTED: Should return 1 row with chat_messages
SELECT
    pubname,
    schemaname,
    tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'chat_messages';
-- ❌ If NO ROWS: Table is not in publication (THIS IS THE PROBLEM)
-- ✅ If 1 ROW: Table is in publication

-- 2. CHECK: Replica identity setting
-- EXPECTED: Should show 'FULL ✓'
SELECT
    c.relname as tablename,
    CASE c.relreplident
        WHEN 'f' THEN 'FULL ✓'
        WHEN 'd' THEN 'DEFAULT (need FULL)'
        WHEN 'n' THEN 'NOTHING (need FULL)'
        WHEN 'i' THEN 'INDEX (need FULL)'
    END as replica_identity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'chat_messages'
AND n.nspname = 'public';
-- ❌ If NOT 'FULL ✓': Replica identity needs to be set to FULL
-- ✅ If 'FULL ✓': Replica identity is correct

-- 3. CHECK: RLS policies that allow SELECT
-- EXPECTED: Should show at least one policy allowing SELECT
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'chat_messages'
AND cmd = 'SELECT';
-- ❌ If NO ROWS: No SELECT policy (realtime needs SELECT access)
-- ✅ If ROWS: SELECT policies exist

-- 4. CHECK: Realtime publication has ALL or specific tables
-- EXPECTED: Should see if publication is for ALL TABLES or specific ones
SELECT
    pubname,
    puballtables,
    pubinsert,
    pubupdate,
    pubdelete
FROM pg_publication
WHERE pubname = 'supabase_realtime';
-- puballtables: true = all tables, false = specific tables only

-- 5. CHECK: Count how many tables are in the publication
SELECT COUNT(*) as table_count
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
-- Shows how many tables total are enabled for realtime

-- 6. LIST: All tables in supabase_realtime publication
SELECT
    schemaname,
    tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
-- Shows which tables are enabled for realtime
