-- ENSURE ALL PAYMENT ATTEMPTS ARE TRACKED IN payment_transactions
-- Run this in Supabase SQL Editor

-- 1. First, check current payment_transactions structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Create a trigger function that ensures EVERY payment attempt is recorded
-- This will catch any payment creation that might be missed
CREATE OR REPLACE FUNCTION public.ensure_payment_tracking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log every insert attempt for debugging
  RAISE NOTICE 'Payment tracking trigger fired for user: %, reference: %', NEW.user_id, NEW.tripay_reference;
  
  -- Ensure we always have a payment record when pro_subscriptions gets a tripay_reference
  IF NEW.tripay_reference IS NOT NULL AND NEW.status = 'pending' THEN
    
    -- Check if payment_transactions record exists
    IF NOT EXISTS (
      SELECT 1 FROM public.payment_transactions 
      WHERE tripay_reference = NEW.tripay_reference
    ) THEN
      
      -- Insert missing payment record
      INSERT INTO public.payment_transactions (
        user_id,
        email,
        status,
        tripay_reference,
        merchant_ref,
        amount
      ) VALUES (
        NEW.user_id,
        NEW.user_email,
        'pending',
        NEW.tripay_reference,
        'AUTO_' || NEW.tripay_reference,
        COALESCE(NEW.amount_paid, 0)
      );
      
      RAISE NOTICE 'Auto-created payment_transactions record for reference: %', NEW.tripay_reference;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Create trigger on pro_subscriptions to ensure payment tracking
DROP TRIGGER IF EXISTS ensure_payment_tracking_trigger ON public.pro_subscriptions;

CREATE TRIGGER ensure_payment_tracking_trigger
  AFTER INSERT ON public.pro_subscriptions
  FOR EACH ROW
  WHEN (NEW.tripay_reference IS NOT NULL)
  EXECUTE FUNCTION public.ensure_payment_tracking();

-- 4. Manual function to create payment record (call this from edge function)
CREATE OR REPLACE FUNCTION public.create_pending_payment(
  p_user_id UUID,
  p_email TEXT,
  p_tripay_reference TEXT,
  p_merchant_ref TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  payment_id UUID;
BEGIN
  -- Insert into payment_transactions with PENDING status
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
    COALESCE(p_merchant_ref, 'EVG_' || extract(epoch from now())::bigint || '_' || substring(p_tripay_reference, 1, 8)),
    p_amount
  )
  RETURNING id INTO payment_id;
  
  RAISE NOTICE 'Created pending payment record: % for user: %', payment_id, p_user_id;
  
  RETURN payment_id;
END;
$$;

-- 5. Function to check if user has pending payments
CREATE OR REPLACE FUNCTION public.get_user_pending_payments(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  tripay_reference TEXT,
  merchant_ref TEXT,
  amount INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    pt.email,
    pt.tripay_reference,
    pt.merchant_ref,
    pt.amount,
    pt.created_at
  FROM public.payment_transactions pt
  WHERE pt.user_id = p_user_id 
    AND pt.status = 'pending'
  ORDER BY pt.created_at DESC;
END;
$$;

-- 6. Test the functions
-- Replace with actual user ID to test
-- SELECT public.create_pending_payment(
--   'your-user-id-here'::uuid,
--   'test@example.com',
--   'TEST_REF_123',
--   'TEST_MERCHANT_123',
--   50000
-- );

-- 7. Check all pending payments
SELECT 
  user_id,
  email,
  tripay_reference,
  merchant_ref,
  amount,
  status,
  created_at
FROM public.payment_transactions 
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 10;