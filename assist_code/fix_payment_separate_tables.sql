-- FIX PAYMENT SYSTEM: SEPARATE TABLES APPROACH
-- This completely fixes the premature pro activation issue

-- STEP 1: Create waiting_payment table for unpaid subscriptions
CREATE TABLE IF NOT EXISTS public.waiting_payment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  subscription_type TEXT NOT NULL, -- '1_month', '1_year', etc.
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'IDR',
  tripay_reference TEXT UNIQUE,
  payment_method TEXT,
  payment_url TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours'), -- Payment link expires in 24h
  
  CONSTRAINT waiting_payment_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT waiting_payment_subscription_type_check CHECK (subscription_type IN ('1_month', '1_year', '1_week', '1_day', 'trial'))
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_waiting_payment_user_id ON public.waiting_payment(user_id);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_tripay_ref ON public.waiting_payment(tripay_reference);
CREATE INDEX IF NOT EXISTS idx_waiting_payment_expires_at ON public.waiting_payment(expires_at);

-- Enable RLS
ALTER TABLE public.waiting_payment ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own waiting payments" ON public.waiting_payment
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own waiting payments" ON public.waiting_payment  
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STEP 2: Create function to clean up expired payment links
CREATE OR REPLACE FUNCTION public.cleanup_expired_waiting_payments()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete waiting payments older than 24 hours
  DELETE FROM public.waiting_payment 
  WHERE expires_at < now();
END;
$$;

-- STEP 3: Create function to move from waiting_payment to pro_subscriptions
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
  
  -- Insert into pro_subscriptions (ONLY when payment confirmed)
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email, 
    subscription_type,
    amount_paid,
    currency,
    status, -- This will be 'active'
    tripay_reference,
    subscription_start_date,
    subscription_end_date,
    ip_address,
    verse_access,
    pro_badge,
    created_at,
    updated_at
  ) VALUES (
    waiting_record.user_id,
    waiting_record.user_email,
    waiting_record.subscription_type,
    waiting_record.amount_paid,
    waiting_record.currency,
    'active', -- ONLY active subscriptions go here
    waiting_record.tripay_reference,
    now(), -- Start now when payment confirmed
    subscription_end_date,
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

-- STEP 4: Update existing pro_subscriptions to remove any 'pending' status
-- Only keep actually paid subscriptions
DELETE FROM public.pro_subscriptions WHERE status = 'pending';

COMMENT ON TABLE public.waiting_payment IS 'Stores unpaid subscription attempts - users get NO pro access until payment confirmed';
COMMENT ON TABLE public.pro_subscriptions IS 'Stores ONLY confirmed paid subscriptions - users get pro access immediately';