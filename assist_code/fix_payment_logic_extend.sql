-- FIX PAYMENT LOGIC: Extend existing subscription instead of INSERT

CREATE OR REPLACE FUNCTION handle_subscription_payment(
    p_user_id UUID,
    p_user_email TEXT,
    p_plan TEXT,
    p_amount NUMERIC,
    p_tripay_ref TEXT
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    days_to_add INTEGER;
    result_id UUID;
    existing_sub RECORD;
BEGIN
    -- Get days based on plan
    days_to_add := CASE p_plan
        WHEN '1_day' THEN 1
        WHEN '1_week' THEN 7
        WHEN '1_month' THEN 30
        WHEN '1_year' THEN 365
        ELSE 30
    END;
    
    -- Check if user has active subscription
    SELECT * INTO existing_sub
    FROM public.pro_subscriptions 
    WHERE user_id = p_user_id AND status = 'active';
    
    IF existing_sub.id IS NOT NULL THEN
        -- EXTEND existing subscription
        UPDATE public.pro_subscriptions 
        SET 
            subscription_end_date = subscription_end_date + (days_to_add || ' days')::INTERVAL,
            subscription_type = p_plan,
            amount_paid = amount_paid + p_amount,
            tripay_reference = p_tripay_ref,
            updated_at = NOW()
        WHERE id = existing_sub.id
        RETURNING id INTO result_id;
    ELSE
        -- CREATE new subscription
        INSERT INTO public.pro_subscriptions (
            user_id, user_email, subscription_type, status,
            subscription_start_date, subscription_end_date,
            amount_paid, currency, tripay_reference,
            created_at, updated_at
        ) VALUES (
            p_user_id, p_user_email, p_plan, 'active',
            NOW(), NOW() + (days_to_add || ' days')::INTERVAL,
            p_amount, 'IDR', p_tripay_ref,
            NOW(), NOW()
        ) RETURNING id INTO result_id;
    END IF;
    
    RETURN result_id;
END;
$$;

-- Usage: SELECT handle_subscription_payment('user_id', 'email', '1_month', 100000, 'REF123');