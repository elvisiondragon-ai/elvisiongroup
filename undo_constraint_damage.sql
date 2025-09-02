-- UNDO all the damage from the constraint SQL

-- 1. Drop the constraints that broke everything
ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT IF EXISTS unique_user_subscription;

ALTER TABLE public.pro_subscriptions 
DROP CONSTRAINT IF EXISTS unique_email_subscription;

-- 2. Restore the original activate_pro_subscription function (simple INSERT)
CREATE OR REPLACE FUNCTION public.activate_pro_subscription(
  p_tripay_reference TEXT,
  p_payment_method TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  waiting_record RECORD;
  new_subscription_id UUID;
  subscription_end_date TIMESTAMPTZ;
  calculated_days INTEGER;
BEGIN
  -- Get waiting payment record
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Waiting payment not found for reference: %', p_tripay_reference;
  END IF;
  
  -- Calculate subscription end date
  subscription_end_date := public.calculate_subscription_end_date(
    waiting_record.subscription_type, 
    now()
  );
  
  -- Calculate days remaining
  calculated_days := EXTRACT(DAY FROM (subscription_end_date - now()))::INTEGER;
  
  -- Ensure days_remaining is not negative
  IF calculated_days < 0 THEN
    calculated_days := 0;
  END IF;
  
  -- Simple INSERT (back to original)
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email, 
    customer_phone,
    subscription_type,
    amount_paid,
    currency,
    status,
    tripay_reference,
    subscription_start_date,
    subscription_end_date,
    days_remaining,
    ip_address,
    verse_access,
    pro_badge,
    created_at,
    updated_at
  ) VALUES (
    waiting_record.user_id,
    waiting_record.user_email,
    waiting_record.customer_phone,
    waiting_record.subscription_type,
    waiting_record.amount_paid,
    waiting_record.currency,
    'active',
    waiting_record.tripay_reference,
    now(),
    subscription_end_date,
    calculated_days,
    waiting_record.ip_address,
    true,
    true,
    now(),
    now()
  ) RETURNING id INTO new_subscription_id;
  
  -- Remove from waiting_payment
  DELETE FROM public.waiting_payment 
  WHERE tripay_reference = p_tripay_reference;
  
  RETURN new_subscription_id;
END;
$$;