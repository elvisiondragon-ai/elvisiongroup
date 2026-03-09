-- RESTORE DATABASE TO 24 HOURS AGO
-- Migration yesterday broke payment system

-- OPTION 1: Check if Supabase has automated backups
-- From Supabase Dashboard > Settings > Database > Backups
-- Look for backup from 24 hours ago (Sep 22, 2025)

-- OPTION 2: Check recent migrations that can be rolled back
SELECT 
    version,
    name,
    executed_at,
    execution_time_in_millis
FROM supabase_migrations.schema_migrations 
WHERE executed_at > NOW() - INTERVAL '48 hours'
ORDER BY executed_at DESC;

-- OPTION 3: Check what tables were modified yesterday
SELECT 
    schemaname,
    relname as table_name,
    n_tup_ins as inserts_since_stats_reset,
    n_tup_upd as updates_since_stats_reset,
    n_tup_del as deletes_since_stats_reset,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE relname LIKE '%payment%' OR relname LIKE '%subscription%'
ORDER BY last_analyze DESC;

-- OPTION 4: Manual rollback commands (if you know specific changes)
-- You would need to provide what exactly was migrated yesterday

-- OPTION 5: Check current payment table structure vs expected
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waiting_payment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;