-- Check subscription details for Pengembar4muda@gmail.com
-- Find subscription end date and current status

-- 1. Check current subscription status
SELECT 
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    CASE 
        WHEN subscription_end_date >= CURRENT_DATE THEN EXTRACT(DAY FROM (subscription_end_date - CURRENT_DATE))
        ELSE 0 
    END as days_remaining,
    CASE 
        WHEN subscription_end_date >= CURRENT_DATE THEN 'ACTIVE'
        ELSE 'EXPIRED'
    END as current_status,
    amount_paid,
    currency,
    tripay_reference,
    created_at
FROM pro_subscriptions 
WHERE user_email = 'Pengembar4muda@gmail.com' 
OR user_email ILIKE '%pengembar4muda%'
ORDER BY created_at DESC;

-- 2. Check if user exists in profiles table
SELECT 
    user_id,
    display_name,
    user_email,
    is_pro,
    subscription_type as profile_subscription_type,
    level,
    experience_points,
    created_at as profile_created
FROM profiles 
WHERE user_email = 'Pengembar4muda@gmail.com' 
OR user_email ILIKE '%pengembar4muda%';

-- 3. Check all subscription history for this user
SELECT 
    ps.subscription_type,
    ps.status,
    ps.subscription_start_date,
    ps.subscription_end_date,
    ps.amount_paid,
    ps.created_at,
    CASE 
        WHEN ps.subscription_end_date >= CURRENT_DATE THEN 'VALID'
        ELSE 'EXPIRED'
    END as validity_status
FROM pro_subscriptions ps
WHERE ps.user_email = 'Pengembar4muda@gmail.com' 
OR ps.user_email ILIKE '%pengembar4muda%'
ORDER BY ps.created_at DESC;