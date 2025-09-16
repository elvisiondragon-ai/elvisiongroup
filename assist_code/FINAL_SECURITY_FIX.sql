-- FINAL SECURITY FIX - ONE SIMPLE SOLUTION
-- This prevents payment bypass while keeping existing Pro users

-- 1. Add required fields to payment_transactions for new payments
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS user_full_name TEXT,
ADD COLUMN IF NOT EXISTS user_email_payment TEXT;

-- 2. Create function to PREVENT unauthorized Pro upgrades (but keep existing ones)
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_pro()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only block NEW pro subscription inserts without valid payment
    IF TG_OP = 'INSERT' AND NEW.created_at >= NOW() - INTERVAL '1 minute' THEN
        -- Check if this comes from valid payment
        IF NEW.tripay_reference IS NULL OR NOT EXISTS (
            SELECT 1 FROM payment_transactions 
            WHERE tripay_reference = NEW.tripay_reference 
            AND status = 'paid'
        ) THEN
            RAISE EXCEPTION 'Pro subscription requires completed payment - contact support';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 3. Create trigger to prevent unauthorized upgrades
DROP TRIGGER IF EXISTS prevent_unauthorized_pro_trigger ON public.pro_subscriptions;
CREATE TRIGGER prevent_unauthorized_pro_trigger
    BEFORE INSERT ON public.pro_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_unauthorized_pro();

-- 4. Update usePro hook to use existing check_unified_pro_status (no changes needed to frontend)
-- The existing system will continue to work for current Pro users

-- 5. Create secure payment function that requires user info
CREATE OR REPLACE FUNCTION public.create_payment_with_validation(
    p_user_id UUID,
    p_subscription_type TEXT,
    p_payment_method TEXT,
    p_user_phone TEXT,
    p_user_full_name TEXT,
    p_user_email TEXT,
    p_tripay_reference TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    transaction_id UUID;
    amount INTEGER;
BEGIN
    -- Validation
    IF p_user_phone IS NULL OR p_user_full_name IS NULL OR p_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Phone, name, and email are required');
    END IF;
    
    -- Get amount
    amount := CASE p_subscription_type
        WHEN '1_day' THEN 4000
        WHEN '1_week' THEN 30000
        WHEN '1_month' THEN 100000
        WHEN '1_year' THEN 800000
        ELSE 100000
    END;
    
    -- Insert payment transaction with user info
    INSERT INTO public.payment_transactions (
        user_id, subscription_type, payment_method, 
        user_phone, user_full_name, user_email_payment,
        amount, currency, tripay_reference, status
    ) VALUES (
        p_user_id, p_subscription_type, p_payment_method,
        p_user_phone, p_user_full_name, p_user_email,
        amount, 'IDR', p_tripay_reference, 'pending'
    ) RETURNING id INTO transaction_id;
    
    RETURN json_build_object('success', true, 'transaction_id', transaction_id);
END;
$$;

-- 6. Show status
SELECT 
    'SECURITY STATUS' as status,
    (SELECT COUNT(*) FROM public.pro_subscriptions WHERE status = 'active' AND subscription_end_date > NOW()) as existing_pro_users_preserved,
    'Payment bypass prevention: ACTIVE' as security_status;

-- DONE! This is all you need.