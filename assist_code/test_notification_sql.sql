-- ===========================================
-- TEST NOTIFICATION LOGIC WITH SQL
-- ===========================================
-- Test what the fixed edge function will find

-- ===========================================
-- 1. SIMULATE THE FIXED FUNCTION QUERY
-- ===========================================
-- This is what the edge function now looks for:
-- subscriptions expiring <= 3 days from now (no minimum threshold)

SELECT
    'FIXED_FUNCTION_QUERY' as test_type,
    user_email,
    subscription_type,
    subscription_end_date,
    NOW() as current_time,
    subscription_end_date - NOW() as time_until_expiry,
    EXTRACT(days FROM subscription_end_date - NOW()) as days_remaining,
    EXTRACT(hours FROM subscription_end_date - NOW()) as hours_remaining,

    -- Will this be caught by the fixed function?
    CASE
        WHEN subscription_end_date <= NOW() + INTERVAL '3 days'
        AND subscription_end_date > NOW()
        THEN 'SHOULD_GET_NOTIFICATION ✓'

        WHEN subscription_end_date <= NOW()
        THEN 'ALREADY_EXPIRED'

        WHEN subscription_end_date > NOW() + INTERVAL '3 days'
        THEN 'TOO_FAR_AWAY'

        ELSE 'UNKNOWN'
    END as notification_result

FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active'
ORDER BY created_at DESC;

-- ===========================================
-- 2. EXACT FUNCTION REPLICA
-- ===========================================
-- This exactly replicates what the edge function does:

SELECT
    'EXACT_FUNCTION_REPLICA' as test_type,
    user_id,
    user_email,
    subscription_end_date,
    subscription_type,

    -- Calculate days remaining like the function does
    CEIL(EXTRACT(EPOCH FROM (subscription_end_date - NOW())) / 86400) as days_remaining_calc,

    -- Email that would be sent
    CASE
        WHEN CEIL(EXTRACT(EPOCH FROM (subscription_end_date - NOW())) / 86400) >= 1
        THEN 'WARNING_EMAIL'
        ELSE 'EXPIRY_EMAIL'
    END as email_type

FROM public.pro_subscriptions
WHERE status = 'active'
AND subscription_end_date IS NOT NULL
AND subscription_end_date <= (NOW() + INTERVAL '3 days')
AND subscription_end_date > NOW()
AND user_email = 'elreyzandra@gmail.com';