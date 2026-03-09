-- FIX: EXTEND FROM EXISTING END DATE

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
  new_subscription_id UUID;
  new_end_date TIMESTAMPTZ;
  calculated_days INTEGER;
  days_to_add INTEGER;
BEGIN
  -- Get waiting payment record
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Waiting payment not found for reference: %', p_tripay_reference;
  END IF;
  
  -- Get days to add based on plan
  days_to_add := CASE waiting_record.subscription_type
      WHEN '1_day' THEN 1
      WHEN '1_week' THEN 7
      WHEN '1_month' THEN 30
      WHEN '1_year' THEN 365
      ELSE 30
  END;
  
  -- Check if user already has active subscription
  SELECT * INTO existing_sub
  FROM public.pro_subscriptions
  WHERE user_id = waiting_record.user_id AND status = 'active';
  
  IF existing_sub.id IS NOT NULL THEN
    -- EXTEND from existing end date
    new_end_date := existing_sub.subscription_end_date + (days_to_add || ' days')::INTERVAL;
    
    UPDATE public.pro_subscriptions 
    SET 
        subscription_end_date = new_end_date,
        subscription_type = waiting_record.subscription_type,
        amount_paid = existing_sub.amount_paid + waiting_record.amount_paid,
        tripay_reference = p_tripay_reference,
        updated_at = NOW()
    WHERE id = existing_sub.id
    RETURNING id INTO new_subscription_id;
    
  ELSE
    -- CREATE new subscription
    new_end_date := NOW() + (days_to_add || ' days')::INTERVAL;
    calculated_days := days_to_add;
    
    INSERT INTO public.pro_subscriptions (
      user_id, user_email, customer_phone, subscription_type,
      amount_paid, currency, status, tripay_reference,
      subscription_start_date, subscription_end_date, days_remaining,
      ip_address, verse_access, pro_badge, created_at, updated_at
    ) VALUES (
      waiting_record.user_id, waiting_record.user_email, waiting_record.customer_phone,
      waiting_record.subscription_type, waiting_record.amount_paid, waiting_record.currency,
      'active', p_tripay_reference, NOW(), new_end_date, calculated_days,
      waiting_record.ip_address, true, true, NOW(), NOW()
    ) RETURNING id INTO new_subscription_id;
  END IF;
  
  -- Delete from waiting_payment
  DELETE FROM public.waiting_payment WHERE tripay_reference = p_tripay_reference;
  
  RETURN new_subscription_id;
END;
$$;