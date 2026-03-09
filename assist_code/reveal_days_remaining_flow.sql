-- REVEAL COMPLETE DAYS_REMAINING FLOW
-- This SQL shows everything related to days_remaining field and where it's used

-- ============================================================================
-- 1. SHOW ALL TABLES WITH days_remaining FIELD
-- ============================================================================
SELECT 
    '=== TABLES WITH DAYS_REMAINING ===' as section,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE column_name = 'days_remaining'
AND table_schema = 'public';

-- ============================================================================
-- 2. SHOW CURRENT PRO_SUBSCRIPTIONS DATA - SOURCE OF TRUTH vs CALCULATED
-- ============================================================================
SELECT 
    '=== PRO_SUBSCRIPTIONS ANALYSIS ===' as section,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    days_remaining as stored_days,
    EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as real_days,
    CASE 
        WHEN days_remaining = EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER THEN '✅ SYNCED'
        WHEN subscription_end_date < NOW() THEN '⚠️ EXPIRED'
        ELSE '❌ OUT_OF_SYNC'
    END as sync_status,
    created_at,
    updated_at,
    (NOW() - updated_at) as time_since_last_update
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC;

-- ============================================================================
-- 3. SHOW DAYS_REMAINING TABLE (IF EXISTS) - REDUNDANT DATA
-- ============================================================================
-- Check if days_remaining table exists
SELECT 
    '=== DAYS_REMAINING TABLE CHECK ===' as section,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'days_remaining' AND table_schema = 'public') 
        THEN 'TABLE EXISTS - REDUNDANT!'
        ELSE 'TABLE DOES NOT EXIST'
    END as table_status;

-- If table exists, show its contents
SELECT 
    '=== DAYS_REMAINING TABLE DATA ===' as section,
    dr.*,
    ps.subscription_end_date,
    EXTRACT(DAY FROM (ps.subscription_end_date - NOW()))::INTEGER as real_days,
    CASE 
        WHEN dr.days_remaining = EXTRACT(DAY FROM (ps.subscription_end_date - NOW()))::INTEGER THEN '✅ SYNCED'
        ELSE '❌ OUT_OF_SYNC'
    END as sync_with_real_date
FROM public.days_remaining dr
LEFT JOIN public.pro_subscriptions ps ON dr.subscription_id = ps.id
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'days_remaining' AND table_schema = 'public')
ORDER BY dr.days_remaining ASC;

-- ============================================================================
-- 4. SHOW ALL TRIGGERS RELATED TO days_remaining
-- ============================================================================
SELECT 
    '=== DAYS_REMAINING TRIGGERS ===' as section,
    pt.tgname as trigger_name,
    pc.relname as table_name,
    pp.proname as function_name,
    CASE pt.tgenabled 
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as status,
    pg_get_triggerdef(pt.oid) as trigger_definition
FROM pg_trigger pt
JOIN pg_class pc ON pt.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
JOIN pg_proc pp ON pt.tgfoid = pp.oid
WHERE pn.nspname = 'public'
AND (
    pt.tgname ILIKE '%days%remaining%' 
    OR pp.proname ILIKE '%days%remaining%'
    OR pg_get_triggerdef(pt.oid) ILIKE '%days_remaining%'
)
AND NOT pt.tgisinternal
ORDER BY pt.tgname;

-- ============================================================================
-- 5. SHOW ALL FUNCTIONS THAT USE days_remaining
-- ============================================================================
SELECT 
    '=== FUNCTIONS USING DAYS_REMAINING ===' as section,
    p.proname as function_name,
    p.prorettype::regtype as return_type,
    CASE 
        WHEN p.prosrc LIKE '%days_remaining%' THEN '✅ USES DAYS_REMAINING'
        ELSE '❌ NO USAGE'
    END as uses_days_remaining,
    length(p.prosrc) as function_length
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND (
    p.prosrc LIKE '%days_remaining%' 
    OR p.proname LIKE '%days%remaining%'
)
ORDER BY p.proname;

-- ============================================================================
-- 6. SHOW CRON JOBS RELATED TO days_remaining
-- ============================================================================
SELECT 
    '=== CRON JOBS FOR DAYS_REMAINING ===' as section,
    jobname,
    schedule,
    command,
    active,
    CASE 
        WHEN command LIKE '%days_remaining%' THEN '✅ SYNCS DAYS_REMAINING'
        WHEN command LIKE '%subscription%' THEN '⚠️ RELATED TO SUBSCRIPTIONS'
        ELSE '❓ OTHER'
    END as purpose
FROM cron.job 
WHERE command ILIKE '%days%remaining%' 
   OR command ILIKE '%sync%'
   OR command ILIKE '%subscription%'
   OR jobname ILIKE '%days%'
ORDER BY jobname;

-- ============================================================================
-- 7. SHOW WHAT SHOULD BE KEPT vs REMOVED
-- ============================================================================
SELECT 
    '=== RECOMMENDATION SUMMARY ===' as section,
    'KEEP' as action,
    'pro_subscriptions.subscription_end_date' as item,
    'SOURCE OF TRUTH - Real expiry date' as reason
UNION ALL
SELECT 
    '=== RECOMMENDATION SUMMARY ===',
    'REMOVE',
    'pro_subscriptions.days_remaining',
    'CALCULATED FIELD - Always becomes stale'
UNION ALL
SELECT 
    '=== RECOMMENDATION SUMMARY ===',
    'REMOVE',
    'days_remaining table',
    'REDUNDANT - Duplicates pro_subscriptions data'
UNION ALL
SELECT 
    '=== RECOMMENDATION SUMMARY ===',
    'REMOVE',
    'sync triggers for days_remaining',
    'COMPLEX - Adds bugs and maintenance overhead'
UNION ALL
SELECT 
    '=== RECOMMENDATION SUMMARY ===',
    'MODIFY',
    'check_unified_pro_status() function',
    'CALCULATE real-time from subscription_end_date'
UNION ALL
SELECT 
    '=== RECOMMENDATION SUMMARY ===',
    'UPDATE',
    'Frontend usePro.ts',
    'Calculate days from expires_at instead of database field';

-- ============================================================================
-- 8. SHOW SIMPLE REPLACEMENT LOGIC
-- ============================================================================
SELECT 
    '=== REPLACEMENT LOGIC ===' as section,
    user_email,
    subscription_end_date,
    -- OLD WAY: Stale stored field
    days_remaining as old_stale_way,
    -- NEW WAY: Real-time calculation
    GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) as new_realtime_way,
    -- DIFFERENCE
    (days_remaining - GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)) as difference,
    CASE 
        WHEN GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) = 0 THEN '🔥 SHOULD EXPIRE NOW'
        WHEN (days_remaining - GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)) > 0 THEN '⚠️ STORED VALUE TOO HIGH'
        WHEN (days_remaining - GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)) < 0 THEN '⚠️ STORED VALUE TOO LOW'
        ELSE '✅ VALUES MATCH'
    END as analysis
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC;

-- ============================================================================
-- 9. COUNT TOTAL IMPACT
-- ============================================================================
SELECT 
    '=== IMPACT SUMMARY ===' as section,
    (SELECT COUNT(*) FROM public.pro_subscriptions WHERE days_remaining != GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)) as out_of_sync_records,
    (SELECT COUNT(*) FROM public.pro_subscriptions WHERE status = 'active') as total_active_subscriptions,
    (SELECT COUNT(*) FROM public.pro_subscriptions WHERE status = 'active' AND subscription_end_date < NOW()) as should_be_expired,
    (SELECT COUNT(*) FROM information_schema.columns WHERE column_name = 'days_remaining' AND table_schema = 'public') as tables_with_days_remaining_field;