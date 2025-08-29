-- Test Payment Callback Simulation
-- Use this to manually test the real-time payment notification system

-- Step 1: Find a recent pending payment transaction
SELECT 
    id,
    tripay_reference,
    user_id,
    status,
    amount,
    created_at,
    subscription_id
FROM public.payment_transactions 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 2: Simulate payment completion (MANUAL TEST)
-- Replace 'YOUR_TRIPAY_REFERENCE' with actual reference from Step 1
-- This will trigger the real-time listener in Payment.tsx

UPDATE public.payment_transactions 
SET 
    status = 'paid',
    paid_at = NOW(),
    updated_at = NOW(),
    callback_data = jsonb_build_object(
        'status', 'PAID',
        'reference', tripay_reference,
        'amount', amount,
        'paid_at', extract(epoch from now())::integer,
        'payment_method', 'BCA Virtual Account',
        'simulation', true
    )
WHERE tripay_reference = 'YOUR_TRIPAY_REFERENCE_HERE'
AND status = 'pending';

-- Step 3: Also update the subscription to active
UPDATE public.pro_subscriptions 
SET 
    status = 'active',
    subscription_start_date = NOW(),
    updated_at = NOW()
WHERE tripay_reference = 'YOUR_TRIPAY_REFERENCE_HERE'
AND status = 'pending';

-- Step 4: Verify the changes
SELECT 
    'Payment Transaction' as table_name,
    tripay_reference,
    status,
    paid_at,
    callback_data
FROM public.payment_transactions 
WHERE tripay_reference = 'YOUR_TRIPAY_REFERENCE_HERE'

UNION ALL

SELECT 
    'Pro Subscription' as table_name,
    tripay_reference,
    status,
    subscription_start_date as paid_at,
    NULL as callback_data
FROM public.pro_subscriptions 
WHERE tripay_reference = 'YOUR_TRIPAY_REFERENCE_HERE';

-- Step 5: Check if user is now PRO
SELECT 
    p.user_id,
    p.user_email,
    p.subscription_type,
    p.status,
    p.subscription_start_date,
    p.subscription_end_date,
    CASE 
        WHEN p.status = 'active' AND p.subscription_end_date > NOW() THEN 'PRO'
        ELSE 'FREE'
    END as current_status
FROM public.pro_subscriptions p
WHERE p.tripay_reference = 'YOUR_TRIPAY_REFERENCE_HERE';