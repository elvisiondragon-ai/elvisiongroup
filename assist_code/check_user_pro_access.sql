-- Simple validation: Check pro access for Pengembar4muda@gmail.com

-- Check pro_subscriptions table
SELECT 
    user_email,
    subscription_type,
    status,
    subscription_end_date,
    CASE 
        WHEN subscription_end_date >= CURRENT_DATE THEN 'HAS PRO ACCESS'
        ELSE 'NO PRO ACCESS - EXPIRED'
    END as pro_access
FROM pro_subscriptions 
WHERE user_email = 'Pengembar4muda@gmail.com';

-- Check profiles table
SELECT 
    user_email,
    is_pro,
    subscription_type,
    CASE 
        WHEN is_pro = true THEN 'HAS PRO ACCESS'
        ELSE 'NO PRO ACCESS'
    END as pro_access
FROM profiles 
WHERE user_email = 'Pengembar4muda@gmail.com';