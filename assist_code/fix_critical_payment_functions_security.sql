-- EMERGENCY SECURITY FIX: Critical payment functions
-- These handle real money transactions and MUST be secured immediately
-- WARNING: Found duplicate process_tripay_payment_callback - need to clarify which version to use

BEGIN;

-- ======================
-- 1. FIX: create_pending_payment
-- ======================
CREATE OR REPLACE FUNCTION public.create_pending_payment(
    p_user_id uuid,
    p_email text,
    p_tripay_reference text,
    p_amount numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  payment_id UUID;
BEGIN
  INSERT INTO public.payment_transactions (
    user_id,
    email,
    status,
    tripay_reference,
    merchant_ref,
    amount
  ) VALUES (
    p_user_id,
    p_email,
    'pending',
    p_tripay_reference,
    'EVG_' || extract(epoch from now())::bigint,
    p_amount
  )
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$;

-- ======================
-- 2. FIX: confirm_payment_make_pro
-- ======================
CREATE OR REPLACE FUNCTION public.confirm_payment_make_pro(
    p_tripay_reference text,
    p_subscription_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Update payment to paid
  UPDATE public.payment_transactions 
  SET status = 'paid', updated_at = NOW()
  WHERE tripay_reference = p_tripay_reference
  RETURNING user_id, email INTO payment_record;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Make user PRO
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date
  ) VALUES (
    payment_record.user_id,
    payment_record.email,
    p_subscription_type,
    'active',
    NOW(),
    CASE p_subscription_type
      WHEN '1_day' THEN NOW() + INTERVAL '1 day'
      WHEN '1_week' THEN NOW() + INTERVAL '7 days'
      WHEN '1_month' THEN NOW() + INTERVAL '30 days'
      WHEN '1_year' THEN NOW() + INTERVAL '1 year'
      ELSE NOW() + INTERVAL '30 days'
    END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscription_type = EXCLUDED.subscription_type,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    status = 'active',
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$;

-- ======================
-- 3. FIX: process_tripay_payment_callback (VERSION 2 - more robust)
-- Using the second version as it appears more complete with proper error handling
-- ======================
CREATE OR REPLACE FUNCTION public.process_tripay_payment_callback(
    p_tripay_reference text,
    p_payment_status text,
    p_payment_method text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  waiting_record RECORD;
  new_subscription_id UUID;
  result JSON;
BEGIN
  -- Find the waiting payment
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment record not found',
      'reference', p_tripay_reference
    );
  END IF;
  
  -- If payment successful, activate subscription
  IF p_payment_status = 'PAID' THEN
    -- Move to pro_subscriptions (user gets pro access)
    new_subscription_id := public.activate_pro_subscription(
      p_tripay_reference, 
      p_payment_method
    );
    
    result := json_build_object(
      'success', true,
      'action', 'subscription_activated',
      'subscription_id', new_subscription_id,
      'user_id', waiting_record.user_id
    );
    
  ELSE
    -- Payment failed or cancelled, keep waiting_payment for potential retry
    result := json_build_object(
      'success', false,
      'action', 'payment_failed',
      'status', p_payment_status,
      'waiting_payment_id', waiting_record.id
    );
  END IF;
  
  RETURN result;
END;
$$;

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================

-- 1. Verify payment functions are now secured
SELECT 
    'payment_functions_security_check' as test,
    routine_name,
    CASE 
        WHEN routine_definition LIKE '%SET search_path = ''''%' THEN 'SECURED'
        ELSE 'STILL_VULNERABLE'
    END as security_status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('create_pending_payment', 'confirm_payment_make_pro', 'process_tripay_payment_callback')
ORDER BY routine_name;

-- 2. Check if there are still duplicate function definitions
SELECT 
    'duplicate_function_check' as test,
    routine_name,
    COUNT(*) as definition_count
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'process_tripay_payment_callback'
GROUP BY routine_name
HAVING COUNT(*) > 1;