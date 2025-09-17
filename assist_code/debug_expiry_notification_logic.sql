-- ===========================================
-- DEBUG WHY NO EXPIRY EMAIL WAS SENT
-- ===========================================
-- Check what the expire-subscriptions function is looking for

-- ===========================================
-- 1. CHECK YOUR SUBSCRIPTION TIMING
-- ===========================================
SELECT
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    NOW() as current_time,
    subscription_end_date - NOW() as time_until_expiry,
    EXTRACT(hours FROM subscription_end_date - NOW()) as hours_until_expiry,
    EXTRACT(days FROM subscription_end_date - NOW()) as days_until_expiry,
    -- Common notification windows
    CASE
        WHEN subscription_end_date <= NOW() THEN 'EXPIRED'
        WHEN subscription_end_date <= NOW() + INTERVAL '1 hour' THEN 'EXPIRES_IN_1_HOUR'
        WHEN subscription_end_date <= NOW() + INTERVAL '6 hours' THEN 'EXPIRES_IN_6_HOURS'
        WHEN subscription_end_date <= NOW() + INTERVAL '12 hours' THEN 'EXPIRES_IN_12_HOURS'
        WHEN subscription_end_date <= NOW() + INTERVAL '1 day' THEN 'EXPIRES_IN_1_DAY'
        WHEN subscription_end_date <= NOW() + INTERVAL '2 days' THEN 'EXPIRES_IN_2_DAYS'
        WHEN subscription_end_date <= NOW() + INTERVAL '3 days' THEN 'EXPIRES_IN_3_DAYS'
        ELSE 'TOO_EARLY_FOR_NOTIFICATION'
    END as notification_window
FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active'
ORDER BY created_at DESC;

-- ===========================================
-- 2. CHECK NOTIFICATION TIMING CRITERIA
-- ===========================================
-- Most notification systems trigger at specific intervals
-- Common patterns: 3 days before, 1 day before, few hours before

-- Check if your subscription matches typical warning periods:
SELECT
    'WARNING_CHECK' as check_type,
    user_email,
    subscription_end_date,
    CASE
        WHEN subscription_end_date <= NOW() + INTERVAL '3 days'
        AND subscription_end_date > NOW() + INTERVAL '2 days' THEN '3_DAY_WARNING'

        WHEN subscription_end_date <= NOW() + INTERVAL '1 day'
        AND subscription_end_date > NOW() + INTERVAL '6 hours' THEN '1_DAY_WARNING'

        WHEN subscription_end_date <= NOW() + INTERVAL '6 hours'
        AND subscription_end_date > NOW() THEN 'FINAL_WARNING'

        WHEN subscription_end_date <= NOW() THEN 'EXPIRED'

        ELSE 'NO_WARNING_NEEDED'
    END as warning_type
FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active';

-- ===========================================
-- 3. CHECK IF EMAILS WERE ALREADY SENT
-- ===========================================
-- Check if there's a tracking table for sent notifications
SELECT
    table_name,
    column_name
FROM information_schema.columns
WHERE table_name LIKE '%notification%'
OR table_name LIKE '%email%'
OR column_name LIKE '%email_sent%'
OR column_name LIKE '%notified%'
ORDER BY table_name;

-- ===========================================
-- 4. RECOMMENDATION
-- ===========================================
SELECT
    'NEXT_STEPS' as info,
    'Check the expire-subscriptions function source code to see exact timing criteria' as recommendation;