-- This query will show you the current Row Level Security policies
-- applied to your chat_messages table.
-- Run this in your Supabase SQL Editor to see what might be blocking reads.
SELECT * FROM pg_policies WHERE tablename = 'chat_messages';
