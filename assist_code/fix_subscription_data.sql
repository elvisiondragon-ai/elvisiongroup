-- Fix subscription data for users with null fields
-- Update missing fields and correct days_remaining

-- Fix first user (mock6@yahoo.com)
UPDATE public.pro_subscriptions 
SET 
    amount_paid = '100000.00',
    currency = 'IDR',
    user_email = 'mock6@yahoo.com',
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))),
    updated_at = NOW()
WHERE user_id = '9a178d5c-c6f2-465a-b5f6-4e3dee6a388b';

-- Fix second user (id: 2f5e663d-98f7-41db-9fcb-73d5c25f1fc6)
UPDATE public.pro_subscriptions 
SET 
    amount_paid = '100000.00',
    user_email = (SELECT email FROM auth.users WHERE id = 'bd19d5e0-0cb8-45b7-b769-0a8b0981bae9'),
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))),
    updated_at = NOW()
WHERE id = '2f5e663d-98f7-41db-9fcb-73d5c25f1fc6';

-- Verify both fixes
SELECT 
    id,
    user_id,
    user_email,
    amount_paid,
    currency,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW())) as calculated_days
FROM public.pro_subscriptions 
WHERE user_id IN ('9a178d5c-c6f2-465a-b5f6-4e3dee6a388b', 'bd19d5e0-0cb8-45b7-b769-0a8b0981bae9');