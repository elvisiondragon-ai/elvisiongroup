-- ANALYZE CONSTRAINT BEFORE MODIFYING
-- Find exactly what constraint exists and what data it affects

-- ============================================================================
-- 1. GET EXACT CONSTRAINT DEFINITION
-- ============================================================================
SELECT 
    '=== CONSTRAINT DETAILS ===' as info,
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as full_definition,
    conkey as column_positions,
    confkey as referenced_columns
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- ============================================================================
-- 2. GET TABLE STRUCTURE
-- ============================================================================
SELECT 
    '=== TABLE COLUMNS ===' as info,
    column_name,
    ordinal_position,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- 3. FIND WHAT DATA WOULD VIOLATE CURRENT CONSTRAINT
-- ============================================================================
-- Find users with multiple active subscriptions (if any)
SELECT 
    '=== POTENTIAL VIOLATIONS ===' as info,
    user_id,
    user_email,
    COUNT(*) as active_subscription_count,
    string_agg(subscription_type || ' (expires: ' || subscription_end_date::date || ')', ', ') as subscriptions
FROM public.pro_subscriptions 
WHERE status = 'active'
GROUP BY user_id, user_email
HAVING COUNT(*) > 1
ORDER BY active_subscription_count DESC;

-- ============================================================================
-- 4. CHECK ALL SUBSCRIPTION STATUSES
-- ============================================================================
SELECT 
    '=== STATUS BREAKDOWN ===' as info,
    status,
    COUNT(*) as count,
    COUNT(DISTINCT user_id) as unique_users
FROM public.pro_subscriptions 
GROUP BY status
ORDER BY count DESC;

-- ============================================================================
-- 5. FIND USERS WITH BOTH ACTIVE AND PENDING
-- ============================================================================
-- These users might be affected by constraint change
SELECT 
    '=== USERS WITH MIXED STATUS ===' as info,
    user_id,
    user_email,
    COUNT(*) FILTER (WHERE status = 'active') as active_subs,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_subs,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_subs,
    COUNT(*) as total_subs
FROM public.pro_subscriptions 
GROUP BY user_id, user_email
HAVING COUNT(DISTINCT status) > 1
ORDER BY total_subs DESC;

-- ============================================================================
-- 6. CHECK CONSTRAINT IMPACT ON CURRENT DATA
-- ============================================================================
-- See which records would be affected by new constraint
WITH constraint_test AS (
    SELECT 
        user_id,
        status,
        COUNT(*) OVER (PARTITION BY user_id, status) as same_status_count,
        ROW_NUMBER() OVER (PARTITION BY user_id, status ORDER BY created_at DESC) as status_rank
    FROM public.pro_subscriptions
)
SELECT 
    '=== CONSTRAINT IMPACT ===' as info,
    status,
    COUNT(*) FILTER (WHERE same_status_count > 1) as records_with_duplicates,
    COUNT(*) FILTER (WHERE same_status_count = 1) as records_unique,
    COUNT(*) as total_records
FROM constraint_test
GROUP BY status
ORDER BY status;

-- ============================================================================
-- 7. SAMPLE PROBLEM USER (if exists)
-- ============================================================================
-- Show detailed info for user who might have issues
SELECT 
    '=== SAMPLE PROBLEM USER ===' as info,
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    amount_paid,
    tripay_reference,
    created_at
FROM public.pro_subscriptions 
WHERE user_id IN (
    SELECT user_id 
    FROM public.pro_subscriptions 
    WHERE status = 'active'
    GROUP BY user_id 
    HAVING COUNT(*) > 1
    LIMIT 1
)
ORDER BY created_at DESC;