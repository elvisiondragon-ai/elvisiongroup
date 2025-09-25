-- SINGLE FUNCTION: Insert new OR extend existing subscription

CREATE OR REPLACE FUNCTION upsert_subscription(
    p_user_id UUID,
    p_plan TEXT,
    p_amount NUMERIC,
    p_tripay_ref TEXT
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    days_to_add INTEGER;
    result_id UUID;
BEGIN
    days_to_add := CASE p_plan
        WHEN '1_day' THEN 1
        WHEN '1_week' THEN 7
        WHEN '1_month' THEN 30
        WHEN '1_year' THEN 365
        ELSE 30
    END;
    
    -- Try to extend existing active subscription
    UPDATE public.pro_subscriptions 
    SET 
        subscription_end_date = subscription_end_date + (days_to_add || ' days')::INTERVAL,
        subscription_type = p_plan,
        amount_paid = amount_paid + p_amount,
        tripay_reference = p_tripay_ref,
        updated_at = NOW()
    WHERE user_id = p_user_id AND status = 'active'
    RETURNING id INTO result_id;
    
    -- If no active subscription found, insert new one
    IF result_id IS NULL THEN
        INSERT INTO public.pro_subscriptions (
            user_id, subscription_type, status, 
            subscription_start_date, subscription_end_date,
            amount_paid, currency, tripay_reference
        ) VALUES (
            p_user_id, p_plan, 'active',
            NOW(), NOW() + (days_to_add || ' days')::INTERVAL,
            p_amount, 'IDR', p_tripay_ref
        ) RETURNING id INTO result_id;
    END IF;
    
    RETURN result_id;
END;
$$;