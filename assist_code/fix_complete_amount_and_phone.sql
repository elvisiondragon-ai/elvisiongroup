-- FIX COMPLETE amount_paid AND customer_phone

-- Update all active subscriptions with correct amount_paid and get phone from waiting_payment
UPDATE public.pro_subscriptions 
SET 
    amount_paid = CASE subscription_type
        WHEN '1_day' THEN 4000
        WHEN '1_week' THEN 30000
        WHEN '1_month' THEN 100000
        WHEN '1_year' THEN 800000
        ELSE 100000
    END,
    customer_phone = COALESCE(
        customer_phone,
        (SELECT customer_phone FROM public.waiting_payment WHERE tripay_reference = pro_subscriptions.tripay_reference LIMIT 1),
        '085000000000'  -- default phone if not found
    ),
    updated_at = NOW()
WHERE status = 'active';

-- Check results
SELECT 
    user_email,
    subscription_type,
    amount_paid,
    customer_phone,
    tripay_reference
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY updated_at DESC
LIMIT 10;