-- SIMPLIFIED PAYMENT SLOWNESS DEBUG
-- Skip advanced queries that might not be available

-- 1. CHECK TABLE SIZES (large tables = slow queries)
SELECT 
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE tablename IN ('pro_subscriptions', 'profiles', 'subscription_plans', 'chat_messages')
ORDER BY live_rows DESC;

-- 2. CHECK INDEXES ON PAYMENT TABLES
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('pro_subscriptions', 'profiles', 'subscription_plans')
ORDER BY tablename;

-- 3. CHECK FOR MISSING CRITICAL INDEXES
-- User ID lookups (very common in payment flow)
SELECT 
    'profiles.user_id' as column_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE tablename = 'profiles' AND indexdef LIKE '%user_id%') 
        THEN 'HAS_INDEX' 
        ELSE 'MISSING_INDEX' 
    END as index_status
UNION ALL
SELECT 
    'pro_subscriptions.user_id' as column_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE tablename = 'pro_subscriptions' AND indexdef LIKE '%user_id%') 
        THEN 'HAS_INDEX' 
        ELSE 'MISSING_INDEX' 
    END as index_status
UNION ALL
SELECT 
    'pro_subscriptions.tripay_reference' as column_check,
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE tablename = 'pro_subscriptions' AND indexdef LIKE '%tripay_reference%') 
        THEN 'HAS_INDEX' 
        ELSE 'MISSING_INDEX' 
    END as index_status;

-- 4. COUNT ROWS IN EACH TABLE
SELECT 'pro_subscriptions' as table_name, COUNT(*) as total_rows FROM pro_subscriptions
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as total_rows FROM profiles  
UNION ALL
SELECT 'subscription_plans' as table_name, COUNT(*) as total_rows FROM subscription_plans;

-- 5. ADD MISSING INDEXES TO SPEED UP PAYMENT QUERIES
-- These are safe to add and will significantly speed up database operations

CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_user_id ON pro_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_tripay_ref ON pro_subscriptions(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_status ON pro_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- 6. OPTIMIZE TABLE STATISTICS
ANALYZE pro_subscriptions;
ANALYZE profiles;
ANALYZE subscription_plans;