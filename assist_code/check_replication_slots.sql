-- ====================================================================
-- CHECK REPLICATION SLOTS - Find stuck postgres_changes pipeline
-- ====================================================================

-- 1. Check all replication slots
SELECT
    slot_name,
    plugin,
    slot_type,
    database,
    active,
    restart_lsn,
    confirmed_flush_lsn
FROM pg_replication_slots;

-- 2. Check if supabase_realtime slot exists and is active
SELECT
    slot_name,
    active,
    CASE
        WHEN active THEN '✅ ACTIVE'
        ELSE '❌ INACTIVE - THIS IS THE PROBLEM'
    END as status
FROM pg_replication_slots
WHERE slot_name LIKE '%realtime%' OR slot_name LIKE '%supabase%';

-- 3. Check WAL sender processes
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    sync_state
FROM pg_stat_replication;

-- ====================================================================
-- IF SLOT IS INACTIVE OR MISSING, CONTACT SUPABASE SUPPORT
-- ====================================================================
-- This means the Realtime server isn't connected to consume changes
-- Only Supabase support can restart the Realtime service connection
-- ====================================================================
