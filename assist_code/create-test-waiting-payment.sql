-- Create test waiting_payment record for testing callback
-- This needs to be inserted first before testing the callback

-- First, create a test user if needed (or use existing user UUID)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Generate a test user ID (or use actual user ID)
    test_user_id := gen_random_uuid();
    
    -- Insert test waiting_payment record
    INSERT INTO public.waiting_payment (
      user_id,
      user_email, 
      subscription_type,
      amount_paid,
      currency,
      tripay_reference,
      payment_method,
      payment_url,
      ip_address,
      created_at,
      updated_at
    ) VALUES (
      test_user_id,
      'elvisiondragon@gmail.com',
      '1_month',
      100000,
      'IDR', 
      'T4427226517122ZKAT6',
      'BCA Virtual Account',
      'https://tripay.co.id/checkout/dummy',
      '127.0.0.1',
      now(),
      now()
    ) ON CONFLICT (tripay_reference) DO UPDATE SET
      updated_at = now(),
      user_id = EXCLUDED.user_id;

    -- Insert payment_transaction record with user_id
    INSERT INTO public.payment_transactions (
      user_id,
      waiting_payment_id,
      tripay_reference,
      tripay_merchant_ref,
      amount,
      currency,
      status,
      created_at,
      updated_at
    ) VALUES (
      test_user_id,
      (SELECT id FROM public.waiting_payment WHERE tripay_reference = 'T4427226517122ZKAT6'),
      'T4427226517122ZKAT6',
      'EVG_test_callback', 
      100000,
      'IDR',
      'pending',
      now(),
      now()
    ) ON CONFLICT (tripay_reference) DO UPDATE SET
      updated_at = now(),
      user_id = EXCLUDED.user_id;
      
    RAISE NOTICE 'Test data created with user_id: %', test_user_id;
END $$;