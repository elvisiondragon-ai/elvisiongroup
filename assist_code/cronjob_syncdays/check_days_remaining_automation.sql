-- Check if cron jobs or functions exist for days_remaining automation

-- 1. Check for cron jobs (pg_cron extension)
SELECT * FROM cron.job WHERE command LIKE '%days_remaining%' OR command LIKE '%subscription%';

-- 2. Check for scheduled functions
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'pg_cron' OR schemaname = 'cron';

-- 3. Check for functions related to days_remaining
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_catalog.pg_get_function_result(p.oid) as result_type,
    pg_catalog.pg_get_function_arguments(p.oid) as arguments,
    p.prosrc as function_body
FROM pg_catalog.pg_proc p
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname LIKE '%days%' 
   OR p.proname LIKE '%subscription%'
   OR p.proname LIKE '%remaining%'
   OR p.prosrc LIKE '%days_remaining%'
ORDER BY schema_name, function_name;

-- 4. Check for triggers on pro_subscriptions table
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'pro_subscriptions';

-- 5. Check current days_remaining vs calculated values
SELECT 
    id,
    user_email,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW())) as calculated_days,
    (days_remaining - EXTRACT(DAY FROM (subscription_end_date - NOW()))) as difference
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY difference DESC;