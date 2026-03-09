-- ====================================================================
-- RESET SUPABASE REALTIME PUBLICATION
-- ====================================================================
-- Path A: Try to restore postgres_changes (safe/reset)
-- This is non-destructive and fixes most "stalled" pipelines
-- ====================================================================

BEGIN;

-- Reset publication
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

-- Add back your tables (add any others you need)
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Ensure old records on UPDATE/DELETE can be sent
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

COMMIT;

-- ====================================================================
-- VERIFICATION
-- ====================================================================

-- 1. Verify publication exists and has chat_messages
SELECT
    pubname,
    schemaname,
    tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- 2. Verify replica identity is FULL
SELECT
    c.relname as tablename,
    CASE c.relreplident
        WHEN 'f' THEN 'FULL ✓'
        WHEN 'd' THEN 'DEFAULT (need FULL)'
        WHEN 'n' THEN 'NOTHING (need FULL)'
        WHEN 'i' THEN 'INDEX (need FULL)'
    END as replica_identity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'chat_messages'
AND n.nspname = 'public';

-- ====================================================================
-- NEXT STEPS AFTER RUNNING THIS SQL
-- ====================================================================
-- 1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
-- 2. Wait for chat to load
-- 3. Insert test message via browser console:
--
--    const { supabase } = await import('/src/integrations/supabase/client.ts');
--    await supabase.from('chat_messages').insert({
--      user_id: '3da83afb-aa8c-4c55-b3b0-8aa64000205f',
--      user_name: 'RESET TEST',
--      user_level: 1,
--      message: 'TEST AFTER PUBLICATION RESET - ' + new Date().getTime(),
--      channel_id: 'community'
--    });
--
-- 4. Check console for: 💖 Realtime message received:
-- ====================================================================
