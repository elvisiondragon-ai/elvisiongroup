-- Fix real-time for verse_notif table

-- 1. Enable FULL replica identity for real-time (REQUIRED)
ALTER TABLE public.verse_notif REPLICA IDENTITY FULL;

-- 2. Check if table is published for real-time
SELECT * FROM pg_publication_tables WHERE tablename = 'verse_notif';

-- 3. If not published, add to publication (this enables real-time)
-- Note: This might need to be done in Supabase dashboard under Database > Publications
-- Or try this command:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.verse_notif;

-- 4. Verify replica identity is now 'f' (FULL)
SELECT 
    schemaname, 
    tablename,
    c.relreplident as replica_identity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.schemaname
WHERE t.tablename = 'verse_notif' AND t.schemaname = 'public';

-- 5. Test insert to verify real-time works
INSERT INTO public.verse_notif (user_id, display_name, verse_title, verse_id) 
VALUES ('test-user-id', 'Test User', 'Test Verse', 999);

-- 6. Clean up test data
DELETE FROM public.verse_notif WHERE verse_title = 'Test Verse';