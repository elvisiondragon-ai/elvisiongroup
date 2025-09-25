-- CHECK IF days_remaining COLUMN IN pro_subscriptions IS SAFE OR STILL ATTACHED TO COMPLEX LOGIC

-- ============================================================================
-- 1. CHECK COLUMN EXISTS AND ITS PROPERTIES
-- ============================================================================
SELECT 
    '=== COLUMN INFO ===' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_default = '0' THEN 'SIMPLE_DEFAULT'
        WHEN column_default IS NULL THEN 'NO_DEFAULT' 
        ELSE 'COMPLEX_DEFAULT'
    END as default_analysis
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND column_name = 'days_remaining'
AND table_schema = 'public';

-- ============================================================================
-- 2. CHECK IF ANY TRIGGERS STILL UPDATE days_remaining COLUMN
-- ============================================================================
SELECT 
    '=== TRIGGERS ON COLUMN ===' as check_type,
    pt.tgname as trigger_name,
    pp.proname as function_name,
    CASE pt.tgenabled 
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status,
    pg_get_triggerdef(pt.oid) as definition
FROM pg_trigger pt
JOIN pg_class pc ON pt.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
JOIN pg_proc pp ON pt.tgfoid = pp.oid
WHERE pn.nspname = 'public'
AND pc.relname = 'pro_subscriptions'
AND pg_get_triggerdef(pt.oid) ILIKE '%days_remaining%'
AND NOT pt.tgisinternal;

-- ============================================================================
-- 3. CHECK IF ANY FUNCTIONS READ FROM days_remaining COLUMN
-- ============================================================================
SELECT 
    '=== FUNCTIONS READING COLUMN ===' as check_type,
    p.proname as function_name,
    CASE 
        WHEN p.prosrc LIKE '%days_remaining%' THEN 'USES_COLUMN'
        ELSE 'NO_USAGE'
    END as reads_days_remaining,
    length(p.prosrc) as function_length
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.prosrc LIKE '%days_remaining%'
ORDER BY p.proname;

-- ============================================================================
-- 4. CHECK CURRENT VALUES vs CALCULATED VALUES
-- ============================================================================
SELECT 
    '=== COLUMN VALUE ANALYSIS ===' as check_type,
    user_email,
    subscription_end_date,
    days_remaining as stored_value,
    GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) as calculated_value,
    CASE 
        WHEN days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) THEN 'MATCHES'
        ELSE 'OUT_OF_SYNC'
    END as sync_status
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC
LIMIT 10;

-- ============================================================================
-- 5. CHECK IF COLUMN IS BEING UPDATED BY ANYTHING
-- ============================================================================
SELECT 
    '=== RECENT UPDATES ===' as check_type,
    user_email,
    days_remaining,
    updated_at,
    (NOW() - updated_at) as time_since_update
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY updated_at DESC
LIMIT 5;

-- ============================================================================
-- CONCLUSION QUERY: IS IT SAFE TO KEEP OR REMOVE?
-- ============================================================================
WITH analysis AS (
    SELECT 
        COUNT(*) FILTER (WHERE pg_get_triggerdef(pt.oid) ILIKE '%days_remaining%') as triggers_using_column,
        (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
         WHERE n.nspname = 'public' AND p.prosrc LIKE '%days_remaining%') as functions_using_column,
        COUNT(*) FILTER (WHERE ps.days_remaining != GREATEST(0, EXTRACT(DAY FROM (ps.subscription_end_date - NOW()))::INTEGER)) as out_of_sync_records
    FROM pg_trigger pt
    JOIN pg_class pc ON pt.tgrelid = pc.oid
    JOIN pg_namespace pn ON pc.relnamespace = pn.oid
    LEFT JOIN public.pro_subscriptions ps ON true
    WHERE pn.nspname = 'public'
    AND pc.relname = 'pro_subscriptions'
    AND NOT pt.tgisinternal
)
SELECT 
    '=== SAFETY ANALYSIS ===' as result,
    triggers_using_column,
    functions_using_column, 
    out_of_sync_records,
    CASE 
        WHEN triggers_using_column = 0 AND functions_using_column = 0 THEN 'SAFE_TO_REMOVE'
        WHEN triggers_using_column > 0 OR functions_using_column > 0 THEN 'STILL_HAS_DEPENDENCIES' 
        ELSE 'UNKNOWN'
    END as safety_status,
    CASE 
        WHEN out_of_sync_records = 0 THEN 'VALUES_SYNCED'
        ELSE 'VALUES_OUT_OF_SYNC'
    END as data_status
FROM analysis;