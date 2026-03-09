-- PAYMENT SPEED OPTIMIZATION SQL
-- After backup restore, still slow - need performance fixes

-- 1. ADD CRITICAL INDEXES FOR PAYMENT OPERATIONS
-- These will speed up all payment-related queries significantly

-- User lookups (most common in payment flow)
CREATE INDEX IF NOT EXISTS idx_waiting_payment_user_id ON waiting_payment(user_id);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_tripay_ref ON waiting_payment(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_status ON waiting_payment(status);

CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_user_id ON pro_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_tripay_ref ON pro_subscriptions(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_pro_subscriptions_status ON pro_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- 2. OPTIMIZE TABLE STATISTICS FOR BETTER QUERY PLANNING
ANALYZE waiting_payment;
ANALYZE pro_subscriptions;
ANALYZE profiles;
ANALYZE subscription_plans;

-- 3. CLEAN UP DEAD TUPLES (VACUUM)
-- This removes old/deleted data that slows queries
VACUUM ANALYZE waiting_payment;
VACUUM ANALYZE pro_subscriptions;
VACUUM ANALYZE profiles;

-- 4. CHECK CURRENT PERFORMANCE AFTER OPTIMIZATION
-- Run this to see if indexes were created
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('waiting_payment', 'pro_subscriptions', 'profiles', 'subscription_plans')
AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- 5. TEST PAYMENT QUERY SPEED
-- These are the queries Edge Function runs - should be much faster now
EXPLAIN ANALYZE 
SELECT * FROM waiting_payment WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';

EXPLAIN ANALYZE 
SELECT * FROM pro_subscriptions WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f';

EXPLAIN ANALYZE 
SELECT * FROM subscription_plans WHERE is_active = true;

-- 6. OPTIMIZE CONNECTION SETTINGS (if allowed)
-- These improve database performance for payment operations
SET work_mem = '256MB';
SET shared_buffers = '256MB';
SET effective_cache_size = '1GB';

-- 7. CHECK CURRENT TABLE SIZES AFTER CLEANUP
SELECT 
    schemaname,
    relname as table_name,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    ROUND(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) as dead_percentage
FROM pg_stat_user_tables 
WHERE relname IN ('waiting_payment', 'pro_subscriptions', 'profiles', 'subscription_plans')
ORDER BY dead_percentage DESC;

-- 8. FINAL PERFORMANCE TEST
-- Time how long payment queries take
\timing on
SELECT COUNT(*) FROM waiting_payment WHERE status = 'pending';
SELECT COUNT(*) FROM pro_subscriptions WHERE status = 'active';
\timing off