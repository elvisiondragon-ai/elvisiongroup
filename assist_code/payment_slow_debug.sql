-- DEBUG SLOW PAYMENT CREATION
-- Check what database operations are causing slowness

-- 1. CHECK SLOW QUERIES IN LOG (if available)
-- Note: This might not work in all setups
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%subscription%' OR query LIKE '%pro_%' OR query LIKE '%payment%'
ORDER BY mean_time DESC
LIMIT 10;

-- 2. CHECK TABLE SIZES (large tables = slow queries)
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE tablename IN ('pro_subscriptions', 'profiles', 'subscription_plans', 'chat_messages')
ORDER BY live_rows DESC;

-- 3. CHECK INDEXES ON PAYMENT TABLES
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('pro_subscriptions', 'profiles', 'subscription_plans')
ORDER BY tablename;

-- 4. CHECK FOR MISSING INDEXES (common cause of slowness)
-- Check if frequently queried columns have indexes

-- User ID lookups (very common in payment flow)
SELECT 
    'profiles.user_id' as column_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE tablename = 'profiles' AND indexdef LIKE '%user_id%') 
        THEN 'HAS_INDEX' 
        ELSE 'MISSING_INDEX' 
    END as index_status;

-- Tripay reference lookups
SELECT 
    'pro_subscriptions.tripay_reference' as column_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE tablename = 'pro_subscriptions' AND indexdef LIKE '%tripay_reference%') 
        THEN 'HAS_INDEX' 
        ELSE 'MISSING_INDEX' 
    END as index_status;

-- 5. CHECK RECENT PAYMENT CREATION ATTEMPTS
-- Look for patterns that might cause slowness
SELECT 
    user_id,
    created_at,
    status,
    EXTRACT(EPOCH FROM (updated_at - created_at)) as processing_seconds
FROM pro_subscriptions 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- 6. ANALYZE TABLE STATISTICS (helps query planner)
-- This can speed up queries significantly
ANALYZE pro_subscriptions;
ANALYZE profiles;
ANALYZE subscription_plans;

-- 7. CHECK FOR BLOATED TABLES (need VACUUM)
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    ROUND(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) as dead_tuple_percent
FROM pg_stat_user_tables 
WHERE tablename IN ('pro_subscriptions', 'profiles', 'subscription_plans')
AND n_dead_tup > 0
ORDER BY dead_tuple_percent DESC;

-- 8. SUGGESTED PERFORMANCE IMPROVEMENTS
-- Add these indexes if missing:

-- CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_user_id ON pro_subscriptions(user_id);
-- CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_tripay_ref ON pro_subscriptions(tripay_reference);
-- CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_status ON pro_subscriptions(status);
-- CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
-- CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);