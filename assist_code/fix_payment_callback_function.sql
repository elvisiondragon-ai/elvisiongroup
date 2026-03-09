-- Fix process_tripay_payment_callback to remove payment_transactions dependency
-- Also ensure days_remaining is calculated correctly

CREATE OR REPLACE FUNCTION public.process_tripay_payment_callback(
  p_tripay_reference TEXT,
  p_payment_status TEXT,
  p_payment_method TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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