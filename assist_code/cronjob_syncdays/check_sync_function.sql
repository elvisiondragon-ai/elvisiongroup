-- Check the sync_days_remaining_daily() function implementation

-- 1. Get the function definition
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_catalog.pg_get_function_result(p.oid) as result_type,
    pg_catalog.pg_get_function_arguments(p.oid) as arguments,
    p.prosrc as function_body
FROM pg_catalog.pg_proc p
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'sync_days_remaining_daily';

-- 2. Test the function manually
SELECT sync_days_remaining_daily();

-- 3. Check if days_remaining matches calculated values after function runs
SELECT 
    id,
    user_email,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW())) as calculated_days,
    (days_remaining - EXTRACT(DAY FROM (subscription_end_date - NOW()))) as difference
FROM public.pro_subscriptions 
WHERE status = 'active'
AND ABS(days_remaining - EXTRACT(DAY FROM (subscription_end_date - NOW()))) > 1
ORDER BY difference DESC;