-- Check why dragon@yahoo.com shows email split instead of display_name in chat

-- 1. Check profiles table for dragon@yahoo.com
SELECT 
    user_id,
    user_email,
    display_name,
    level,
    is_pro,
    subscription_type
FROM profiles 
WHERE user_email = 'dragon@yahoo.com';

-- 2. Check chat_messages for this user
SELECT 
    user_id,
    user_name,
    message,
    created_at
FROM chat_messages 
WHERE user_id IN (
    SELECT user_id FROM profiles WHERE user_email = 'dragon@yahoo.com'
)
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check if display_name is NULL or empty
SELECT 
    user_email,
    display_name,
    CASE 
        WHEN display_name IS NULL THEN 'NULL'
        WHEN display_name = '' THEN 'EMPTY STRING'
        ELSE 'HAS VALUE'
    END as display_name_status
FROM profiles 
WHERE user_email = 'dragon@yahoo.com';