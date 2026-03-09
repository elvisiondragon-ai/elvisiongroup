-- Add unique constraint to pro_subscriptions to prevent duplicates
-- Only allow one active subscription per user

-- 1. First, clean up any existing duplicates (keep the latest one)
WITH duplicates AS (
  SELECT user_id, user_email,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM public.pro_subscriptions
)
DELETE FROM public.pro_subscriptions 
WHERE (user_id, created_at) IN (
  SELECT ps.user_id, ps.created_at
  FROM public.pro_subscriptions ps
  JOIN duplicates d ON ps.user_id = d.user_id
  WHERE d.rn > 1
);

-- 2. Add unique constraint on user_id (one subscription per user)
ALTER TABLE public.pro_subscriptions 
ADD CONSTRAINT unique_user_subscription UNIQUE (user_id);

-- 3. Also add unique constraint on user_email as backup
ALTER TABLE public.pro_subscriptions 
ADD CONSTRAINT unique_email_subscription UNIQUE (user_email);

-- 4. Update activate_pro_subscription function to use UPSERT instead of INSERT
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
  
  -- UPSERT into pro_subscriptions (UPDATE if exists, INSERT if not)
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
  ) 
  ON CONFLICT (user_id) DO UPDATE SET
    user_email = EXCLUDED.user_email,
    customer_phone = EXCLUDED.customer_phone,
    subscription_type = EXCLUDED.subscription_type,
    amount_paid = EXCLUDED.amount_paid,
    currency = EXCLUDED.currency,
    status = EXCLUDED.status,
    tripay_reference = EXCLUDED.tripay_reference,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    days_remaining = EXCLUDED.days_remaining,
    ip_address = EXCLUDED.ip_address,
    verse_access = EXCLUDED.verse_access,
    pro_badge = EXCLUDED.pro_badge,
    updated_at = now()
  RETURNING id INTO new_subscription_id;
  
  -- Remove from waiting_payment (payment processed)
  DELETE FROM public.waiting_payment 
  WHERE tripay_reference = p_tripay_reference;
  
  RETURN new_subscription_id;
END;
$$;

-- 5. Verify the constraints are working
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.pro_subscriptions'::regclass
  AND conname LIKE '%unique%';