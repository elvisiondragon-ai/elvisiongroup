-- Check if ALL tables with postgres_changes listeners are in publication

-- Should show: chat_messages, gold_reports, verse_notif
SELECT
    schemaname,
    tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename IN ('chat_messages', 'gold_reports', 'verse_notif')
ORDER BY tablename;

-- If any are missing, they need to be added:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.gold_reports;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.verse_notif;
