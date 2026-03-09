-- Update chat_messages table to use is_pro instead of is_vip
ALTER TABLE public.chat_messages RENAME COLUMN is_vip TO is_pro;