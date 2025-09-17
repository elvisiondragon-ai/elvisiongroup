-- ===========================================
-- CHECK EXACT NOTIFICATION TIMING
-- ===========================================
-- The function looks for subscriptions expiring between 1-3 days

SELECT
    user_email,
    subscription_end_date,
    NOW() as current_time,
    subscription_end_date - NOW() as time_until_expiry,
    EXTRACT(hours FROM subscription_end_date - NOW()) as hours_until_expiry,

    -- Function checks
    NOW() + INTERVAL '1 day' as function_min_window,
    NOW() + INTERVAL '3 days' as function_max_window,

    -- Will this subscription match the function criteria?
    CASE
        WHEN subscription_end_date >= NOW() + INTERVAL '1 day'
        AND subscription_end_date <= NOW() + INTERVAL '3 days'
        THEN 'SHOULD_GET_WARNING_EMAIL ✓'

        WHEN subscription_end_date < NOW() + INTERVAL '1 day'
        AND subscription_end_date > NOW()
        THEN 'TOO_CLOSE_TO_EXPIRY (< 1 day)'

        WHEN subscription_end_date > NOW() + INTERVAL '3 days'
        THEN 'TOO_FAR_FROM_EXPIRY (> 3 days)'

        WHEN subscription_end_date <= NOW()
        THEN 'ALREADY_EXPIRED'

        ELSE 'UNKNOWN_CASE'
    END as notification_status

FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active';