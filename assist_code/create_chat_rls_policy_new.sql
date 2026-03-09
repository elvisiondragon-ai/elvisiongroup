-- This policy allows anyone (including unauthenticated users) to read messages
-- from the 'chat_messages' table. This is necessary for your public chat view.
--
-- 1. First, you might want to delete any existing SELECT policy that is too restrictive.
--    You can find the policy name by running the check query in 'check_chat_rls_policies_new.sql'.
--    Example: DROP POLICY "Policy Name" ON public.chat_messages;
--
-- 2. Then, run this command in your Supabase SQL Editor to create the new, public policy.

CREATE POLICY "Enable public read access for all users"
ON public.chat_messages
FOR SELECT
USING (true);

-- After running this, unauthenticated users should be able to see chat messages.
