-- EMERGENCY FIX: Remove duplicate payment callback function
-- This is critical for payment system stability

BEGIN;

-- Step 1: Drop ALL versions of the payment callback function
-- This ensures we start clean without conflicting definitions
DROP FUNCTION IF EXISTS public.process_tripay_payment_callback(text, text, text);
DROP FUNCTION IF EXISTS public.process_tripay_payment_callback(text, text);
DROP FUNCTION IF EXISTS public.process_tripay_payment_callback CASCADE;

-- Step 2: Create ONE definitive secure version
-- Using the more robust version with proper error handling and security
CREATE FUNCTION public.process_tripay_payment_callback(
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
  -- Security: Validate inputs
  IF p_tripay_reference IS NULL OR trim(p_tripay_reference) = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid tripay reference',
      'reference', p_tripay_reference
    );
  END IF;
  
  IF p_payment_status IS NULL OR trim(p_payment_status) = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid payment status',
      'reference', p_tripay_reference
    );
  END IF;

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
  IF upper(p_payment_status) = 'PAID' THEN
    -- Move to pro_subscriptions (user gets pro access)
    new_subscription_id := public.activate_pro_subscription(
      p_tripay_reference, 
      p_payment_method
    );
    
    result := json_build_object(
      'success', true,
      'action', 'subscription_activated',
      'subscription_id', new_subscription_id,
      'user_id', waiting_record.user_id,
      'reference', p_tripay_reference
    );
    
    -- Log successful payment
    PERFORM public.log_sensitive_action(
      'payment_callback_success',
      'waiting_payment',
      waiting_record.id,
      json_build_object(
        'tripay_reference', p_tripay_reference,
        'payment_status', p_payment_status,
        'subscription_id', new_subscription_id
      )
    );
    
  ELSE
    -- Payment failed or cancelled, keep waiting_payment for potential retry
    result := json_build_object(
      'success', false,
      'action', 'payment_failed',
      'status', p_payment_status,
      'waiting_payment_id', waiting_record.id,
      'reference', p_tripay_reference
    );
    
    -- Log failed payment
    PERFORM public.log_sensitive_action(
      'payment_callback_failed',
      'waiting_payment', 
      waiting_record.id,
      json_build_object(
        'tripay_reference', p_tripay_reference,
        'payment_status', p_payment_status,
        'reason', 'payment_not_paid'
      )
    );
  END IF;
  
  RETURN result;
END;
$$;

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================

-- 1. Verify only ONE version exists now
SELECT 
    'payment_callback_final_check' as test,
    COUNT(*) as function_count,
    array_agg(pg_get_function_arguments(p.oid)) as signatures
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'process_tripay_payment_callback';

-- 2. Verify it has search_path protection
SELECT 
    'payment_callback_security_check' as test,
    routine_name,
    CASE 
        WHEN routine_definition LIKE '%SET search_path = ''''%' THEN 'SECURED'
        ELSE 'STILL_VULNERABLE'
    END as security_status,
    CASE 
        WHEN routine_definition LIKE '%log_sensitive_action%' THEN 'HAS_LOGGING'
        ELSE 'NO_LOGGING'
    END as logging_status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'process_tripay_payment_callback';