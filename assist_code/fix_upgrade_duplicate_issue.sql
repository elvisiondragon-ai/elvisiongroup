-- FIX UPGRADE ISSUE: User can't extend/upgrade due to duplicate constraint

-- ============================================================================
-- 1. CHECK THE CONSTRAINT
-- ============================================================================
SELECT 
    '=== CONSTRAINT INFO ===' as info,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- ============================================================================
-- 2. CHECK USER'S CURRENT SUBSCRIPTION
-- ============================================================================  
SELECT 
    '=== CURRENT USER SUBSCRIPTION ===' as info,
    user_id,
    user_email, 
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    days_remaining,
    created_at
FROM public.pro_subscriptions 
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC;

-- ============================================================================
-- 3. FIX OPTION 1: UPDATE EXISTING SUBSCRIPTION (EXTEND)
-- ============================================================================
-- Instead of inserting new, update existing subscription to extend it
-- EXAMPLE: Extend current user by 30 days

-- UPDATE public.pro_subscriptions 
-- SET 
--     subscription_end_date = subscription_end_date + INTERVAL '30 days',
--     subscription_type = '1_month', -- or new type
--     amount_paid = amount_paid + 100000, -- add new payment amount
--     updated_at = NOW()
-- WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5' 
-- AND status = 'active';

-- ============================================================================
-- 4. FIX OPTION 2: DELETE OLD, INSERT NEW (REPLACE)
-- ============================================================================
-- Delete existing subscription and create new one

-- BEGIN;
-- DELETE FROM public.pro_subscriptions 
-- WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5' 
-- AND status = 'active';

-- -- Then insert new subscription
-- INSERT INTO public.pro_subscriptions (...) VALUES (...);
-- COMMIT;

-- ============================================================================
-- 5. RECOMMENDED: CREATE UPGRADE FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.upgrade_user_subscription(
    p_user_id UUID,
    p_subscription_type TEXT,
    p_amount_paid NUMERIC,
    p_tripay_reference TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    existing_subscription RECORD;
    new_end_date TIMESTAMP WITH TIME ZONE;
    extension_days INTEGER;
BEGIN
    -- Get existing active subscription
    SELECT * INTO existing_subscription 
    FROM public.pro_subscriptions 
    WHERE user_id = p_user_id AND status = 'active'
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Calculate extension days based on subscription type
    extension_days := CASE p_subscription_type
        WHEN '1_day' THEN 1
        WHEN '1_week' THEN 7  
        WHEN '1_month' THEN 30
        WHEN '1_year' THEN 365
        ELSE 30
    END;
    
    IF existing_subscription.id IS NOT NULL THEN
        -- EXTEND existing subscription
        new_end_date := GREATEST(
            existing_subscription.subscription_end_date,
            NOW()
        ) + (extension_days || ' days')::INTERVAL;
        
        UPDATE public.pro_subscriptions 
        SET 
            subscription_end_date = new_end_date,
            subscription_type = p_subscription_type,
            amount_paid = COALESCE(amount_paid, 0) + p_amount_paid,
            tripay_reference = COALESCE(p_tripay_reference, tripay_reference),
            updated_at = NOW()
        WHERE id = existing_subscription.id;
        
        RETURN existing_subscription.id;
    ELSE
        -- CREATE new subscription
        INSERT INTO public.pro_subscriptions (
            user_id,
            subscription_type,
            status,
            subscription_start_date,
            subscription_end_date,
            amount_paid,
            currency,
            tripay_reference,
            created_at,
            updated_at
        ) VALUES (
            p_user_id,
            p_subscription_type,
            'active',
            NOW(),
            NOW() + (extension_days || ' days')::INTERVAL,
            p_amount_paid,
            'IDR',
            p_tripay_reference,
            NOW(),
            NOW()
        ) RETURNING id;
    END IF;
END;
$$;

-- ============================================================================
-- 6. TEST THE UPGRADE FUNCTION
-- ============================================================================
-- SELECT upgrade_user_subscription(
--     'ed289706-acf5-4af5-9301-2bfb0128f0f5'::UUID,
--     '1_month',
--     100000,
--     'TEST_UPGRADE_001'
-- );