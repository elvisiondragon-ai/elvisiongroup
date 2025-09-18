-- ===========================================
-- VERIFY PRO ACCESS REMAINS INTACT
-- ===========================================

-- 1. Verify pro_subscriptions table is untouched
SELECT
    COUNT(*) as total_pro_users,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_pro_users
FROM pro_subscriptions;

-- 2. Test pro status function still works
SELECT * FROM check_unified_pro_status('ed675b6c-0cd8-4475-aecc-74b921c68b35'); -- trial01

-- 3. Verify pro users can still access pro features
SELECT
    ps.user_email,
    ps.subscription_type,
    ps.status,
    ps.days_remaining,
    'Pro access intact' as verification
FROM pro_subscriptions ps
WHERE ps.status = 'active'
AND ps.subscription_end_date > NOW()
LIMIT 3;