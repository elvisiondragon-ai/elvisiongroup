-- Update activate_pro_subscription function to include days_remaining calculation

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
  
  -- Insert into pro_subscriptions (ONLY when payment confirmed)
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email, 
    customer_phone,
    subscription_type,
    amount_paid,
    currency,
    status, -- This will be 'active'
    tripay_reference,
    subscription_start_date,
    subscription_end_date,
    days_remaining, -- Include days_remaining explicitly
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
    'active', -- ONLY active subscriptions go here
    waiting_record.tripay_reference,
    now(), -- Start now when payment confirmed
    subscription_end_date,
    calculated_days, -- Set calculated days_remaining
    waiting_record.ip_address,
    true, -- Grant verse access
    true, -- Grant pro badge
    now(),
    now()
  ) RETURNING id INTO new_subscription_id;
  
  -- Remove from waiting_payment (payment processed)
  DELETE FROM public.waiting_payment 
  WHERE tripay_reference = p_tripay_reference;
  
  RETURN new_subscription_id;
END;
$$;