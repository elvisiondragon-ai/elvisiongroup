-- SIMPLE ANALYSIS: What does unique_active_subscription_per_user constraint do?

-- ============================================================================
-- 1. WHAT IS THE CONSTRAINT?
-- ============================================================================
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as what_it_does
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- ============================================================================
-- 2. WHAT DATA DOES IT AFFECT?
-- ============================================================================
-- Show current active subscriptions (what constraint protects)
SELECT 
    user_id,
    user_email,
    status,
    subscription_type,
    subscription_end_date,
    created_at
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY user_id, created_at;

-- ============================================================================
-- 3. WHAT HAPPENS WHEN USER TRIES TO UPGRADE?
-- ============================================================================
-- Show users with multiple records (active + pending/expired)
SELECT 
    user_id,
    user_email,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'expired') as expired_count
FROM public.pro_subscriptions 
GROUP BY user_id, user_email
HAVING COUNT(*) > 1
ORDER BY total_records DESC;

-- ============================================================================
-- 4. CONSTRAINT WORKFLOW SUMMARY
-- ============================================================================
SELECT 
    'CONSTRAINT WORKFLOW:' as info,
    'Prevents: INSERT new record with same user_id + status=active' as prevents,
    'Allows: Multiple records per user with different status' as allows,
    'Problem: User cant upgrade (extend) because INSERT fails' as problem;