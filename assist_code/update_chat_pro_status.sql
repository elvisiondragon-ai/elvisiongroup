-- Update existing chat messages with current pro status from profiles
-- File: assist_code/update_chat_pro_status.sql

-- Update is_pro column based on current profiles table
UPDATE chat_messages 
SET is_pro = profiles.is_pro
FROM profiles 
WHERE chat_messages.user_id = profiles.user_id;

-- Update subscription_type from active pro_subscriptions
UPDATE chat_messages 
SET subscription_type = pro_subscriptions.subscription_type
FROM pro_subscriptions 
WHERE chat_messages.user_id = pro_subscriptions.user_id 
  AND pro_subscriptions.status = 'active';

-- Verify the updates
SELECT 
  user_name,
  is_pro,
  subscription_type,
  COUNT(*) as message_count
FROM chat_messages 
GROUP BY user_name, is_pro, subscription_type
ORDER BY user_name;

-- Check specific user (your admin account)
SELECT 
  user_name,
  is_pro,
  subscription_type,
  message,
  created_at
FROM chat_messages 
WHERE user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
ORDER BY created_at DESC
LIMIT 5;