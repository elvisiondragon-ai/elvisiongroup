-- Drop the problematic notify_chat_message function that requires net schema
DROP FUNCTION IF EXISTS public.notify_chat_message() CASCADE;