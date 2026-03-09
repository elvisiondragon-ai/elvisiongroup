-- Schema Check: Verify is_admin fields exist in both tables
-- Run these queries to check if is_admin columns exist

-- Check profiles table schema for is_admin field
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check chat_messages table schema for is_admin field  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if any profiles have is_admin = true
SELECT user_id, display_name, is_admin 
FROM profiles 
WHERE is_admin = true;

-- Check if any chat_messages have is_admin = true
SELECT user_id, user_name, is_admin, message, created_at
FROM chat_messages 
WHERE is_admin = true
ORDER BY created_at DESC;