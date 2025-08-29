-- 🔥 STRONG PAYMENT SYSTEM FIX 🔥
-- This will fix all the FUCKED UP issues

-- ==========================================
-- PART 1: DIAGNOSTIC - FIND THE PROBLEM
-- ==========================================

-- 1.1: Check what's wrong with your payments
SELECT 
    '🔍 DIAGNOSTIC: Your Recent Payments' as info,
    pt.id,
    pt.tripay_reference,
    pt.user_email,
    pt.payment_method,
    pt.status as payment_status,
    pt.amount,
    pt.created_at as payment_created,
    pt.paid_at,
    ps.status as subscription_status,
    ps.subscription_start_date,
    ps.subscription_end_date,
    CASE 
        WHEN ps.status = 'active' AND ps.subscription_end_date > NOW() THEN '🟢 PRO ACTIVE'
        WHEN ps.status = 'active' AND ps.subscription_end_date <= NOW() THEN '🟡 PRO EXPIRED' 
        WHEN ps.status = 'pending' THEN '🔴 PENDING PAYMENT'
        ELSE '⚫ UNKNOWN'
    END as current_status,
    CASE 
        WHEN pt.created_at < ps.subscription_start_date THEN '❌ PRO ACTIVATED BEFORE PAYMENT!'
        WHEN pt.paid_at IS NULL AND ps.status = 'active' THEN '❌ PRO ACTIVE BUT NOT PAID!'
        ELSE '✅ OK'
    END as issue_detected
FROM public.payment_transactions pt
LEFT JOIN public.pro_subscriptions ps ON pt.subscription_id = ps.id  
WHERE pt.user_email ILIKE '%YOUR_EMAIL%'  -- Replace with part of your email
ORDER BY pt.created_at DESC
LIMIT 10;

-- ==========================================
-- PART 2: RESET AND FIX FUCKED UP DATA
-- ==========================================

-- 2.1: Reset any PRO subscriptions that were activated without payment
UPDATE public.pro_subscriptions 
SET 
    status = 'pending',
    subscription_start_date = NULL,
    subscription_end_date = NULL,
    updated_at = NOW()
WHERE id IN (
    SELECT ps.id 
    FROM public.pro_subscriptions ps
    JOIN public.payment_transactions pt ON ps.id = pt.subscription_id
    WHERE ps.status = 'active' 
    AND pt.status = 'pending'
    AND pt.paid_at IS NULL
    AND ps.user_email ILIKE '%YOUR_EMAIL%'  -- Replace with part of your email
);

-- 2.2: Show what was reset
SELECT 
    '🔧 RESET RESULTS' as info,
    user_email,
    tripay_reference,
    status,
    subscription_start_date
FROM public.pro_subscriptions 
WHERE user_email ILIKE '%YOUR_EMAIL%'  -- Replace with part of your email
ORDER BY updated_at DESC;

-- ==========================================
-- PART 3: STRONG TEST SYSTEM
-- ==========================================

-- 3.1: Find your latest unpaid QRIS payment
SELECT 
    '🎯 TARGET FOR TESTING' as info,
    tripay_reference,
    user_email,
    payment_method,
    status,
    amount,
    created_at
FROM public.payment_transactions 
WHERE payment_method = 'QRIS' 
AND status = 'pending'
AND user_email ILIKE '%YOUR_EMAIL%'  -- Replace with part of your email
ORDER BY created_at DESC
LIMIT 1;

-- 3.2: MANUAL PAYMENT ACTIVATION (Copy tripay_reference from above)
-- Replace 'YOUR_TRIPAY_REF' with actual reference
DO $$
DECLARE
    target_ref TEXT := 'YOUR_TRIPAY_REF';  -- REPLACE THIS
    sub_id INT;
    user_email_val TEXT;
    sub_type TEXT;
BEGIN
    -- Update payment as paid
    UPDATE public.payment_transactions 
    SET 
        status = 'paid',
        paid_at = NOW(),
        updated_at = NOW(),
        callback_data = jsonb_build_object(
            'status', 'PAID',
            'reference', target_ref,
            'payment_method', 'QRIS',
            'paid_at', extract(epoch from now())::integer,
            'manual_test', true,
            'timestamp', NOW()::text
        )
    WHERE tripay_reference = target_ref
    AND status = 'pending';
    
    -- Get subscription details
    SELECT pt.subscription_id, ps.user_email, ps.subscription_type 
    INTO sub_id, user_email_val, sub_type
    FROM public.payment_transactions pt
    JOIN public.pro_subscriptions ps ON pt.subscription_id = ps.id
    WHERE pt.tripay_reference = target_ref;
    
    -- Calculate end date and activate subscription
    UPDATE public.pro_subscriptions 
    SET 
        status = 'active',
        subscription_start_date = NOW(),
        subscription_end_date = CASE 
            WHEN sub_type = '1_day' THEN NOW() + INTERVAL '1 day'
            WHEN sub_type = '1_week' THEN NOW() + INTERVAL '1 week'  
            WHEN sub_type = '1_month' THEN NOW() + INTERVAL '1 month'
            WHEN sub_type = '1_year' THEN NOW() + INTERVAL '1 year'
            ELSE NOW() + INTERVAL '1 month'
        END,
        updated_at = NOW()
    WHERE id = sub_id;
    
    -- Log the action
    RAISE NOTICE '✅ PAYMENT ACTIVATED: % for user: %', target_ref, user_email_val;
END $$;

-- 3.3: Verify the fix worked
SELECT 
    '🎉 VERIFICATION' as info,
    pt.tripay_reference,
    pt.status as payment_status,
    pt.paid_at,
    pt.callback_data->>'manual_test' as was_manual,
    ps.status as subscription_status,
    ps.subscription_start_date,
    ps.subscription_end_date,
    ps.user_email,
    CASE 
        WHEN ps.status = 'active' AND ps.subscription_end_date > NOW() THEN '🟢 PRO NOW ACTIVE'
        ELSE '🔴 STILL BROKEN'
    END as result
FROM public.payment_transactions pt
JOIN public.pro_subscriptions ps ON pt.subscription_id = ps.id
WHERE pt.tripay_reference = 'YOUR_TRIPAY_REF';  -- REPLACE THIS

-- ==========================================
-- PART 4: TEST REAL-TIME LISTENER
-- ==========================================

-- 4.1: Create a fake payment to test real-time
INSERT INTO public.payment_transactions (
    user_id, user_email, tripay_reference, tripay_merchant_ref,
    payment_method, amount, currency, status, created_at, updated_at
) VALUES (
    'your-user-id',  -- REPLACE WITH YOUR USER ID
    'your@email.com',  -- REPLACE WITH YOUR EMAIL
    'TEST_' || extract(epoch from now())::text,
    'EVG_TEST_' || extract(epoch from now())::text,
    'QRIS',
    50000,
    'IDR',
    'pending',
    NOW(),
    NOW()
);

-- 4.2: Get the test reference  
SELECT 
    '🧪 TEST PAYMENT CREATED' as info,
    tripay_reference,
    status,
    created_at
FROM public.payment_transactions 
WHERE tripay_reference LIKE 'TEST_%'
ORDER BY created_at DESC
LIMIT 1;

-- 4.3: Now update this test payment to 'paid' to trigger real-time
-- Copy the TEST_ reference from above and replace below
UPDATE public.payment_transactions 
SET 
    status = 'paid',
    paid_at = NOW(),
    updated_at = NOW(),
    callback_data = jsonb_build_object(
        'status', 'PAID',
        'test_trigger', true,
        'timestamp', NOW()::text
    )
WHERE tripay_reference = 'TEST_REFERENCE_HERE'  -- REPLACE THIS
AND status = 'pending';

-- ==========================================
-- PART 5: CLEANUP AND SUMMARY
-- ==========================================

-- 5.1: Summary of all your payments
SELECT 
    '📊 FINAL SUMMARY' as info,
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    MAX(created_at) as latest_payment
FROM public.payment_transactions 
WHERE user_email ILIKE '%YOUR_EMAIL%';  -- Replace with part of your email

-- 5.2: Your current PRO status
SELECT 
    '🏆 YOUR PRO STATUS' as info,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    CASE 
        WHEN status = 'active' AND subscription_end_date > NOW() THEN '🟢 PRO ACTIVE'
        ELSE '🔴 NOT PRO'
    END as current_status,
    EXTRACT(DAYS FROM (subscription_end_date - NOW())) as days_remaining
FROM public.pro_subscriptions 
WHERE user_email ILIKE '%YOUR_EMAIL%'  -- Replace with part of your email
ORDER BY created_at DESC
LIMIT 1;