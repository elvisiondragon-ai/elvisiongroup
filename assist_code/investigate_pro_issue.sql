-- =====================================================
-- Pro Subscription Investigation SQL
-- User: rudinazawa@gmail.com
-- Issue: User paid on Sept 16, lost Pro access by Sept 20
-- =====================================================

-- 1. Check User's Pro Subscription Status
-- This shows current subscription status and expected status
SELECT 
    ps.*,
    u.email,
    ps.status,
    ps.subscription_type,
    ps.expires_at,
    ps.created_at,
    ps.updated_at,
    CASE 
        WHEN ps.expires_at > NOW() AND ps.status = 'active' THEN 'SHOULD_BE_PRO'
        ELSE 'NOT_PRO'
    END as expected_status,
    EXTRACT(DAY FROM (ps.expires_at - NOW())) as days_remaining
FROM pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE u.email = 'rudinazawa@gmail.com'
ORDER BY ps.created_at DESC;

-- 2. Get User ID for RPC testing
SELECT 
    id as user_id,
    email,
    created_at as user_created
FROM auth.users 
WHERE email = 'rudinazawa@gmail.com';

-- 3. Test the RPC Function Directly
-- Replace 'USER_ID_HERE' with actual user ID from query above
-- SELECT * FROM check_unified_pro_status('USER_ID_HERE');

-- 4. Check All Payment Records
SELECT 
    pr.*,
    u.email,
    pr.status as payment_status,
    pr.amount,
    pr.payment_method,
    pr.subscription_type,
    pr.created_at as payment_date,
    pr.updated_at as payment_updated
FROM payment_records pr
JOIN auth.users u ON pr.user_id = u.id
WHERE u.email = 'rudinazawa@gmail.com'
ORDER BY pr.created_at DESC;

-- 5. Check if RPC Function Exists and View Definition
SELECT 
    proname as function_name,
    proargnames as arguments,
    prosrc as function_body
FROM pg_proc 
WHERE proname = 'check_unified_pro_status';

-- 6. Check Recent Activity (Combined View)
SELECT 
    u.email,
    ps.status as subscription_status,
    ps.subscription_type,
    ps.expires_at,
    ps.created_at as sub_created,
    ps.updated_at as sub_updated,
    pr.status as payment_status,
    pr.amount as payment_amount,
    pr.created_at as payment_date,
    pr.updated_at as payment_updated
FROM auth.users u
LEFT JOIN pro_subscriptions ps ON u.id = ps.user_id
LEFT JOIN payment_records pr ON u.id = pr.user_id
WHERE u.email = 'rudinazawa@gmail.com'
ORDER BY GREATEST(
    COALESCE(ps.updated_at, ps.created_at, '1970-01-01'), 
    COALESCE(pr.updated_at, pr.created_at, '1970-01-01')
) DESC;

-- 7. Check for Multiple Subscriptions (potential conflict)
SELECT 
    COUNT(*) as subscription_count,
    u.email
FROM pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE u.email = 'rudinazawa@gmail.com'
GROUP BY u.email, u.id;

-- 8. Check System Pro Status Cache Issues
-- Look for any system-level pro status tracking
SELECT 
    u.email,
    u.id,
    ps.status,
    ps.expires_at,
    NOW() as current_time,
    ps.expires_at > NOW() as should_be_active
FROM auth.users u
LEFT JOIN pro_subscriptions ps ON u.id = ps.user_id
WHERE u.email = 'rudinazawa@gmail.com';

-- =====================================================
-- POTENTIAL FIXES (Run only if issues found above)
-- =====================================================

-- Fix 1: Update subscription status if it's incorrectly set
-- Uncomment and run if subscription exists but status is wrong
/*
UPDATE pro_subscriptions 
SET 
    status = 'active',
    updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rudinazawa@gmail.com')
AND expires_at > NOW()
AND status != 'active';
*/

-- Fix 2: Extend subscription if it expired too early
-- Uncomment and run if subscription expired but should still be active
/*
UPDATE pro_subscriptions 
SET 
    expires_at = CURRENT_DATE + INTERVAL '1 year',
    status = 'active',
    updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rudinazawa@gmail.com')
AND expires_at <= NOW();
*/

-- Fix 3: Create missing subscription if payment exists but no subscription
-- Uncomment and run if payment was successful but no subscription was created
/*
INSERT INTO pro_subscriptions (
    user_id,
    subscription_type,
    status,
    expires_at,
    created_at,
    updated_at
)
SELECT 
    pr.user_id,
    pr.subscription_type,
    'active',
    CASE 
        WHEN pr.subscription_type = '1_year' THEN pr.created_at + INTERVAL '1 year'
        WHEN pr.subscription_type = '1_month' THEN pr.created_at + INTERVAL '1 month'
        WHEN pr.subscription_type = '1_week' THEN pr.created_at + INTERVAL '1 week'
        WHEN pr.subscription_type = '1_day' THEN pr.created_at + INTERVAL '1 day'
        ELSE pr.created_at + INTERVAL '1 year'
    END,
    NOW(),
    NOW()
FROM payment_records pr
JOIN auth.users u ON pr.user_id = u.id
WHERE u.email = 'rudinazawa@gmail.com'
AND pr.status = 'PAID'
AND NOT EXISTS (
    SELECT 1 FROM pro_subscriptions ps 
    WHERE ps.user_id = pr.user_id
);
*/

-- =====================================================
-- VERIFICATION QUERIES (Run after any fixes)
-- =====================================================

-- Verify Fix: Check final status
SELECT 
    u.email,
    ps.status,
    ps.subscription_type,
    ps.expires_at,
    ps.updated_at,
    CASE 
        WHEN ps.expires_at > NOW() AND ps.status = 'active' THEN 'PRO_ACTIVE'
        ELSE 'NOT_PRO'
    END as final_status
FROM pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE u.email = 'rudinazawa@gmail.com'
ORDER BY ps.created_at DESC
LIMIT 1;