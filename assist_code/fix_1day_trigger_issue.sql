-- ===========================================
-- FIX 1-DAY SUBSCRIPTION TRIGGER ISSUE
-- ===========================================
-- The auto_activate_subscription trigger is causing issues

-- ===========================================
-- 1. DELETE THE INCORRECT SUBSCRIPTION
-- ===========================================
DELETE FROM public.pro_subscriptions
WHERE id = '51cefd33-ae18-4e73-848d-f56830df3731'
AND user_email = 'elreyzandra@gmail.com';

-- ===========================================
-- 2. CHECK THE TRIGGER FUNCTION LOGIC
-- ===========================================
-- View the current trigger function
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'auto_activate_subscription';

-- ===========================================
-- 3. CREATE SUBSCRIPTION WITH EXPLICIT VALUES (BYPASS TRIGGER)
-- ===========================================
-- Insert with all values explicitly set to bypass auto-activation
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
    'test_1day',  -- Use different type to avoid trigger
    'active',
    NOW(),
    NOW() + INTERVAL '1 day',  -- Explicit 1 day
    0,
    'IDR',
    'TEST_1DAY_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    true,
    true,
    NOW(),
    NOW()
);

-- ===========================================
-- 4. VERIFY THE CORRECT SUBSCRIPTION
-- ===========================================
SELECT
    id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    subscription_end_date - subscription_start_date as actual_duration,
    EXTRACT(hours FROM subscription_end_date - subscription_start_date) as hours_remaining,
    EXTRACT(days FROM subscription_end_date - NOW()) as days_remaining_real,
    created_at
FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
ORDER BY created_at DESC
LIMIT 1;

-- ===========================================
-- 5. ALTERNATIVE: UPDATE EXISTING RECORD
-- ===========================================
-- If the above doesn't work, manually update the existing record:
-- UPDATE public.pro_subscriptions
-- SET
--     subscription_end_date = subscription_start_date + INTERVAL '1 day',
--     updated_at = NOW()
-- WHERE user_email = 'elreyzandra@gmail.com'
-- AND status = 'active';

-- ===========================================
-- 6. TEST THE NOTIFICATION FUNCTION
-- ===========================================
-- This should now trigger notifications since it expires in 1 day
-- Check what the function will find:
SELECT
    user_email,
    subscription_end_date,
    subscription_end_date - NOW() as time_until_expiry,
    CASE
        WHEN subscription_end_date - NOW() <= INTERVAL '1 day' THEN 'SHOULD_GET_EXPIRY_NOTICE'
        WHEN subscription_end_date - NOW() <= INTERVAL '3 days' THEN 'SHOULD_GET_WARNING'
        ELSE 'NO_NOTIFICATION_YET'
    END as notification_status
FROM public.pro_subscriptions
WHERE user_email = 'elreyzandra@gmail.com'
AND status = 'active';