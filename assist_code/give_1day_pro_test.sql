-- Method B: Grant Pro by USER_ID (1 DAY FOR TESTING)
DO $$
DECLARE
    target_user_id UUID := 'ed289706-acf5-4af5-9301-2bfb0128f0f5'; -- CHANGE THIS USER_ID
    user_email TEXT;
BEGIN
    -- Get email from user ID
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = target_user_id;

    IF user_email IS NULL THEN
        RAISE EXCEPTION 'User with ID % not found', target_user_id;
    END IF;

    -- Delete any existing subscription
    DELETE FROM public.pro_subscriptions
    WHERE user_id = target_user_id;

    -- Insert new Pro subscription (1 DAY)
    INSERT INTO public.pro_subscriptions (
        user_id,
        user_email,
        subscription_type,
        subscription_start_date,
        subscription_end_date,
        status,
        tripay_reference,
        amount_paid,
        currency
    ) VALUES (
        target_user_id,
        user_email,
        '1_day',
        NOW(),
        NOW() + INTERVAL '1 day',
        'active',
        'ADMIN_GRANT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
        0,
        'IDR'
    );

    RAISE NOTICE 'Pro access granted to user: % for 1 day', user_email;
END $$;