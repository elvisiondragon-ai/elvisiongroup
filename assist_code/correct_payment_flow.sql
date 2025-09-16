-- CORRECT PAYMENT FLOW: payment_transactions FIRST, then pro_subscriptions

-- 1. Function to create pending payment (call this when user clicks pay)
CREATE OR REPLACE FUNCTION public.create_pending_payment(
  p_user_id UUID,
  p_email TEXT,
  p_tripay_reference TEXT,
  p_amount INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 2. Function to confirm payment and make user PRO
CREATE OR REPLACE FUNCTION public.confirm_payment_make_pro(
  p_tripay_reference TEXT,
  p_subscription_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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