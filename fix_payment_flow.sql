-- FIX PAYMENT FLOW - KEEP BOTH TABLES
-- Run these in Supabase SQL Editor

-- 1. Add subscription_type to payment_transactions if missing
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS subscription_type TEXT;

-- 2. Update tripay callback function to handle BOTH tables
CREATE OR REPLACE FUNCTION process_tripay_payment_callback(
  p_tripay_reference TEXT,
  p_payment_status TEXT,
  p_payment_method TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payment_record RECORD;
  subscription_id UUID;
BEGIN
  -- Find payment in payment_transactions
  SELECT * INTO payment_record
  FROM payment_transactions
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Payment not found');
  END IF;
  
  -- If PAID, update both tables
  IF p_payment_status = 'PAID' THEN
    -- 1. Update payment_transactions status to 'paid'
    UPDATE payment_transactions 
    SET status = 'paid', updated_at = NOW()
    WHERE tripay_reference = p_tripay_reference;
    
    -- 2. Insert/Update pro_subscriptions (Pro users only)
    INSERT INTO pro_subscriptions (
      user_id, 
      user_email,
      subscription_type,
      subscription_start_date,
      subscription_end_date,
      status,
      tripay_reference,
      amount_paid,
      currency,
      verse_access,
      pro_badge,
      created_at,
      updated_at
    ) VALUES (
      payment_record.user_id,
      payment_record.user_email,
      payment_record.subscription_type,
      NOW(),
      CASE payment_record.subscription_type
        WHEN '1_day' THEN NOW() + INTERVAL '1 day'
        WHEN '1_week' THEN NOW() + INTERVAL '7 days'
        WHEN '1_month' THEN NOW() + INTERVAL '30 days'
        WHEN '1_year' THEN NOW() + INTERVAL '1 year'
        ELSE NOW() + INTERVAL '30 days'
      END,
      'active',
      p_tripay_reference,
      payment_record.amount,
      payment_record.currency,
      true,
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      subscription_type = EXCLUDED.subscription_type,
      subscription_start_date = EXCLUDED.subscription_start_date,
      subscription_end_date = EXCLUDED.subscription_end_date,
      status = 'active',
      tripay_reference = EXCLUDED.tripay_reference,
      amount_paid = EXCLUDED.amount_paid,
      verse_access = true,
      pro_badge = true,
      updated_at = NOW()
    RETURNING id INTO subscription_id;
    
    RETURN json_build_object(
      'success', true, 
      'action', 'subscription_activated',
      'subscription_id', subscription_id
    );
  END IF;
  
  RETURN json_build_object('success', true, 'action', 'status_updated');
END;
$$;

-- 3. Fix tripay-create-payment to ONLY use payment_transactions (no pro_subscriptions)
-- This will be done in the Edge Function file

-- 4. Automatic expiry - users removed from pro_subscriptions when expired
-- Add this to check_unified_pro_status or create scheduled function
-- Users with subscription_end_date < NOW() lose Pro access automatically