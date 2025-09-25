-- SYNC days_remaining COLUMN WITH CURRENT subscription_end_date

-- Update all active subscriptions to have correct days_remaining
UPDATE public.pro_subscriptions 
SET 
    days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
    updated_at = NOW()
WHERE status = 'active';

-- Verify the sync worked
SELECT 
    user_email,
    subscription_end_date,
    days_remaining as current_value,
    GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) as calculated_value,
    CASE 
        WHEN days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER) THEN '✅ SYNCED'
        ELSE '❌ OUT OF SYNC'
    END as status
FROM public.pro_subscriptions 
WHERE status = 'active'
ORDER BY subscription_end_date ASC;