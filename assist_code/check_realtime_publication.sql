-- Check if chat_messages table is included in supabase_realtime publication
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'chat_messages';

-- Show all tables in supabase_realtime publication
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY schemaname, tablename;

-- Add chat_messages to publication if missing
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;