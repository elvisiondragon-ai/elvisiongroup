-- Track emails for users with null data and fix pro_subscriptions
-- Step 1: Find emails for all users with null user_email

SELECT 
    ps.id as subscription_id,
    ps.user_id,
    au.email,
    ps.subscription_end_date,
    EXTRACT(DAY FROM (ps.subscription_end_date - NOW())) as calculated_days,
    ps.days_remaining as current_days_remaining
FROM public.pro_subscriptions ps
LEFT JOIN auth.users au ON ps.user_id = au.id
WHERE ps.user_email IS NULL
ORDER BY ps.created_at;

-- Step 2: Update all records with null user_email
UPDATE public.pro_subscriptions 
SET 
    user_email = (SELECT email FROM auth.users WHERE id = pro_subscriptions.user_id),
    amount_paid = '100000.00',
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))),
    updated_at = NOW()
WHERE user_email IS NULL;

-- Step 3: Verify all fixes
SELECT 
    id,
    user_id,
    user_email,
    amount_paid,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW())) as calculated_days
FROM public.pro_subscriptions 
WHERE id IN (
    '2f5e663d-98f7-41db-9fcb-73d5c25f1fc6',
    '51f9022e-9e87-4c2c-a990-e2dceb40c738',
    '7b2ebb92-c4ec-47e5-81fb-edd5681b8c0d',
    '8332497f-a052-4fd2-a778-1b5bfab311fa',
    'aeb5509d-acd1-408c-b87f-1b07dc2661fc',
    'c02a9f0f-0df0-4c71-aea6-2552b382a44f',
    'df262b2c-102a-4ffd-83cd-3327a7444308',
    'e936ac1d-4428-43ef-93ec-188668668d2d',
    'f42bf2ab-9603-45c7-9373-b59e0e77d40c'
);