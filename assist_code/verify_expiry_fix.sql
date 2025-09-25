-- Verify that the expired users have been cleaned up
-- Run this to confirm the fix worked

-- Check if any expired users are still showing as 'active'
SELECT 
    '=== REMAINING EXPIRED USERS ===' as check_type,
    COUNT(*) as count,
    string_agg(user_email, ', ') as emails
FROM public.pro_subscriptions 
WHERE status = 'active' 
AND subscription_end_date < NOW();

-- Check current active subscriptions (should be clean now)
SELECT 
    '=== CURRENT ACTIVE USERS ===' as check_type,
    user_email,
    subscription_type,
    status,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as actual_days_remaining
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC
LIMIT 10;