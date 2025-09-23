-- FIXED PAYMENT SLOWNESS DEBUG

-- 1. CHECK TABLE SIZES 
SELECT 
    schemaname,
    relname as table_name,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables 
WHERE relname IN ('pro_subscriptions', 'profiles', 'subscription_plans', 'chat_messages')
ORDER BY live_rows DESC;

-- 2. CHECK INDEXES ON PAYMENT TABLES
SELECT 
    t.relname as table_name,
    i.relname as index_name,
    pg_get_indexdef(i.oid) as index_definition
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
WHERE t.relname IN ('pro_subscriptions', 'profiles', 'subscription_plans')
ORDER BY t.relname;

-- 3. COUNT ROWS IN EACH TABLE
SELECT 'pro_subscriptions' as table_name, COUNT(*) as total_rows FROM pro_subscriptions
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as total_rows FROM profiles  
UNION ALL
SELECT 'subscription_plans' as table_name, COUNT(*) as total_rows FROM subscription_plans;

-- 4. ADD CRITICAL INDEXES TO SPEED UP PAYMENT QUERIES
-- These will significantly improve performance

CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_user_id ON pro_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_tripay_ref ON pro_subscriptions(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_status ON pro_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- 5. UPDATE TABLE STATISTICS FOR BETTER QUERY PLANNING
ANALYZE pro_subscriptions;
ANALYZE profiles; 
ANALYZE subscription_plans;