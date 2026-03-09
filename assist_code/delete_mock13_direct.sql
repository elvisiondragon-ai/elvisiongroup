-- Direct delete from chat_messages table by user_email
DELETE FROM public.chat_messages 
WHERE user_email = 'mock13@yahooo.com';

-- Alternative: Delete by user_name if email stored differently
DELETE FROM public.chat_messages 
WHERE user_name = 'mock13' OR user_name ILIKE '%mock13%';

-- Verification: Check if any messages remain
SELECT * FROM public.chat_messages 
WHERE user_email = 'mock13@yahooo.com' 
   OR user_name = 'mock13' 
   OR user_name ILIKE '%mock13%';

-- Show current structure to verify column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
  AND table_schema = 'public';