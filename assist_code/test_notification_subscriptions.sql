-- ===========================================
-- CREATE TEST SUBSCRIPTIONS FOR NOTIFICATION TESTING
-- ===========================================
-- Create subscriptions at different expiry times to test all notification scenarios

-- ===========================================
-- 1. DELETE CURRENT TEST SUBSCRIPTION
-- ===========================================
DELETE FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND tripay_reference LIKE 'T442722700%';

-- ===========================================
-- 2. CREATE SUBSCRIPTION EXPIRING IN 2.5 DAYS (SHOULD GET WARNING)
-- ===========================================
INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    amount_paid,
    currency,
    tripay_reference,
    verse_access,
    pro_badge,
    created_at,
    updated_at
) VALUES (
    '9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95',
    'elreyzandra@gmail.com',
    'test_2_5_days',
    'active',
    NOW(),
    NOW() + INTERVAL '2 days 12 hours',  -- 2.5 days = between 1-3 days window
    0,
    'IDR',
    'TEST_WARNING_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    true,
    true,
    NOW(),
    NOW()
);

-- ===========================================
-- 3. VERIFY THE TEST SUBSCRIPTION
-- ===========================================
SELECT
    user_email,
    subscription_type,
    subscription_end_date,
    NOW() as current_time,
    subscription_end_date - NOW() as time_until_expiry,
    EXTRACT(days FROM subscription_end_date - NOW()) as days_until_expiry,
    EXTRACT(hours FROM subscription_end_date - NOW()) as hours_until_expiry,

    -- Check notification window
    CASE
        WHEN subscription_end_date >= NOW() + INTERVAL '1 day'
        AND subscription_end_date <= NOW() + INTERVAL '3 days'
        THEN 'SHOULD_GET_WARNING_EMAIL ✓'

        WHEN subscription_end_date < NOW() + INTERVAL '1 day'
        THEN 'TOO_CLOSE_TO_EXPIRY (< 1 day)'

        WHEN subscription_end_date > NOW() + INTERVAL '3 days'
        THEN 'TOO_FAR_FROM_EXPIRY (> 3 days)'

        ELSE 'UNKNOWN_CASE'
    END as notification_status

FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active'
ORDER BY created_at DESC
LIMIT 1;