-- Debug why profile lookup isn't working for dragon@yahoo.com

-- Check what the profile query returns (same as Chat.tsx line 63)
SELECT 
    display_name, 
    level, 
    achievements, 
    is_pro, 
    subscription_type,
    user_id
FROM profiles 
WHERE user_id = (SELECT user_id FROM profiles WHERE user_email = 'dragon@yahoo.com');

-- Check if user_id matches between auth and profiles
SELECT 
    'dragon@yahoo.com' as email,
    user_id,
    display_name
FROM profiles 
WHERE user_email = 'dragon@yahoo.com';