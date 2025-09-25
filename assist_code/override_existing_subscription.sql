-- OVERRIDE existing subscription data (no new columns, just update existing)

CREATE OR REPLACE FUNCTION public.activate_pro_subscription(
    p_tripay_reference text, 
    p_payment_method text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  waiting_record RECORD;
  existing_sub RECORD;
  subscription_id UUID;
  days_to_add INTEGER;
  correct_amount NUMERIC;
BEGIN
  -- Get waiting payment record
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Waiting payment not found for reference: %', p_tripay_reference;
  END IF;
  
  -- Get correct amount
  correct_amount := CASE waiting_record.subscription_type
      WHEN '1_day' THEN 4000
      WHEN '1_week' THEN 30000
      WHEN '1_month' THEN 100000
      WHEN '1_year' THEN 800000
      ELSE 100000
  END;
  
  -- Get days
  days_to_add := CASE waiting_record.subscription_type
      WHEN '1_day' THEN 1
      WHEN '1_week' THEN 7
      WHEN '1_month' THEN 30
      WHEN '1_year' THEN 365
      ELSE 30
  END;
  
  -- Check if user has active subscription
  SELECT * INTO existing_sub
  FROM public.pro_subscriptions
  WHERE user_id = waiting_record.user_id AND status = 'active';
  
  IF existing_sub.id IS NOT NULL THEN
    -- OVERRIDE existing subscription
    UPDATE public.pro_subscriptions 
    SET 
        subscription_end_date = NOW() + (days_to_add || ' days')::INTERVAL,
        subscription_type = waiting_record.subscription_type,
        amount_paid = correct_amount,
        tripay_reference = p_tripay_reference,
        customer_phone = waiting_record.customer_phone,
        days_remaining = days_to_add,
        updated_at = NOW()
    WHERE id = existing_sub.id;
    
    subscription_id := existing_sub.id;
    
  ELSE
    -- CREATE new subscription
    INSERT INTO public.pro_subscriptions (
      user_id, user_email, customer_phone, subscription_type,
      amount_paid, currency, status, tripay_reference,
      subscription_start_date, subscription_end_date, days_remaining,
      ip_address, verse_access, pro_badge, created_at, updated_at
    ) VALUES (
      waiting_record.user_id, waiting_record.user_email, waiting_record.customer_phone,
      waiting_record.subscription_type, correct_amount, waiting_record.currency,
      'active', p_tripay_reference, NOW(), 
      NOW() + (days_to_add || ' days')::INTERVAL, days_to_add,
      waiting_record.ip_address, true, true, NOW(), NOW()
    ) RETURNING id INTO subscription_id;
  END IF;
  
  -- Delete from waiting_payment
  DELETE FROM public.waiting_payment WHERE tripay_reference = p_tripay_reference;
  
  RETURN subscription_id;
END;
$$;