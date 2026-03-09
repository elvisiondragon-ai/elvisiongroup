-- MODIFY CONSTRAINT TO ALLOW UPGRADES/EXTENSIONS
-- When user has Pro, just extend subscription_end_date + new plan duration

-- ============================================================================
-- STEP 1: DROP EXISTING CONSTRAINT
-- ============================================================================
ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT IF EXISTS unique_active_subscription_per_user;

-- ============================================================================
-- STEP 2: ADD NEW SMARTER CONSTRAINT
-- ============================================================================
-- Allow multiple records per user, but only ONE can be 'active' at a time
-- This allows pending payments while user has active subscription
ALTER TABLE public.pro_subscriptions 
ADD CONSTRAINT unique_active_subscription_per_user 
UNIQUE (user_id) 
WHERE (status = 'active');

-- ============================================================================
-- STEP 3: CREATE TRIGGER TO AUTO-EXTEND INSTEAD OF INSERT DUPLICATE
-- ============================================================================
CREATE OR REPLACE FUNCTION public.auto_extend_subscription() 
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    existing_sub RECORD;
    extension_days INTEGER;
BEGIN
    -- Only trigger on INSERT of active subscription
    IF NEW.status != 'active' THEN
        RETURN NEW;
    END IF;
    
    -- Check if user already has active subscription
    SELECT * INTO existing_sub 
    FROM public.pro_subscriptions 
    WHERE user_id = NEW.user_id AND status = 'active'
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- If user has existing active subscription, extend it instead
    IF existing_sub.id IS NOT NULL THEN
        -- Calculate extension days
        extension_days := CASE NEW.subscription_type
            WHEN '1_day' THEN 1
            WHEN '1_week' THEN 7  
            WHEN '1_month' THEN 30
            WHEN '1_year' THEN 365
            ELSE 30
        END;
        
        -- Extend existing subscription
        UPDATE public.pro_subscriptions 
        SET 
            subscription_end_date = GREATEST(subscription_end_date, NOW()) + (extension_days || ' days')::INTERVAL,
            subscription_type = NEW.subscription_type, -- Update to new plan type
            amount_paid = COALESCE(amount_paid, 0) + NEW.amount_paid,
            tripay_reference = NEW.tripay_reference, -- Update reference
            updated_at = NOW()
        WHERE id = existing_sub.id;
        
        -- Return NULL to prevent INSERT (we updated existing instead)
        RETURN NULL;
    END IF;
    
    -- If no existing subscription, allow normal INSERT
    RETURN NEW;
END;
$$;

-- ============================================================================
-- STEP 4: ATTACH TRIGGER TO TABLE
-- ============================================================================
CREATE TRIGGER auto_extend_subscription_trigger
    BEFORE INSERT ON public.pro_subscriptions
    FOR EACH ROW 
    EXECUTE FUNCTION auto_extend_subscription();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check constraint exists
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname = 'unique_active_subscription_per_user';

-- Check trigger exists  
SELECT 
    tgname as trigger_name,
    tgfoid::regproc as function_name,
    CASE tgenabled 
        WHEN 'O' THEN 'ENABLED'
        ELSE 'DISABLED'
    END as status
FROM pg_trigger 
WHERE tgname = 'auto_extend_subscription_trigger';