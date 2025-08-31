-- STEP 5: Update payment_transactions table to support both waiting_payment and pro_subscriptions
ALTER TABLE public.payment_transactions 
ADD COLUMN IF NOT EXISTS waiting_payment_id UUID REFERENCES public.waiting_payment(id) ON DELETE CASCADE;

-- Make subscription_id nullable since we'll use waiting_payment_id for pending payments
ALTER TABLE public.payment_transactions 
ALTER COLUMN subscription_id DROP NOT NULL;

-- Add check to ensure either subscription_id OR waiting_payment_id is set
ALTER TABLE public.payment_transactions
ADD CONSTRAINT payment_has_reference CHECK (
  (subscription_id IS NOT NULL AND waiting_payment_id IS NULL) OR
  (subscription_id IS NULL AND waiting_payment_id IS NOT NULL)
);

-- STEP 6: Create updated tripay callback function that uses the new flow
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
  payment_transaction_id UUID;
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
    
    -- Update payment transaction to point to new subscription
    UPDATE public.payment_transactions 
    SET 
      subscription_id = new_subscription_id,
      waiting_payment_id = NULL,
      status = 'paid',
      completed_at = now(),
      updated_at = now()
    WHERE waiting_payment_id = waiting_record.id
    RETURNING id INTO payment_transaction_id;
    
    result := json_build_object(
      'success', true,
      'action', 'subscription_activated',
      'subscription_id', new_subscription_id,
      'payment_transaction_id', payment_transaction_id,
      'user_id', waiting_record.user_id
    );
    
  ELSE
    -- Payment failed or cancelled, just update transaction status
    UPDATE public.payment_transactions 
    SET 
      status = 'failed',
      updated_at = now()
    WHERE waiting_payment_id = waiting_record.id;
    
    -- Keep waiting_payment for potential retry (don't delete)
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

-- STEP 7: Create function to check if user has any waiting payments
CREATE OR REPLACE FUNCTION public.get_user_payment_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  pro_record RECORD;
  waiting_record RECORD;
  result JSON;
BEGIN
  -- Check if user has active pro subscription
  SELECT * INTO pro_record
  FROM public.check_unified_pro_status(p_user_id)
  WHERE is_pro = true;
  
  IF FOUND THEN
    result := json_build_object(
      'status', 'pro_active',
      'is_pro', true,
      'subscription_type', pro_record.subscription_type,
      'expires_at', pro_record.expires_at,
      'days_remaining', pro_record.days_remaining
    );
  ELSE
    -- Check if user has waiting payment
    SELECT * INTO waiting_record
    FROM public.waiting_payment
    WHERE user_id = p_user_id 
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
      result := json_build_object(
        'status', 'payment_pending',
        'is_pro', false,
        'waiting_payment_id', waiting_record.id,
        'subscription_type', waiting_record.subscription_type,
        'amount', waiting_record.amount_paid,
        'payment_url', waiting_record.payment_url,
        'expires_at', waiting_record.expires_at
      );
    ELSE
      result := json_build_object(
        'status', 'no_subscription',
        'is_pro', false
      );
    END IF;
  END IF;
  
  RETURN result;
END;
$$;