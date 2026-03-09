-- URGENT FIX: RESTORE CHAT SEND FUNCTIONALITY
-- User cannot send messages after policy changes

-- 1. Check current INSERT policies
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_messages'
AND cmd = 'INSERT';

-- 2. RESTORE INSERT POLICY FOR CHAT MESSAGES
DROP POLICY IF EXISTS "Authenticated users can create chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON chat_messages;

-- Create working INSERT policy
CREATE POLICY "Allow authenticated users to send messages"
ON chat_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 3. VERIFY AUTH STATUS
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'AUTHENTICATED - CAN SEND'
        ELSE 'NOT AUTHENTICATED - CANNOT SEND'
    END as send_status;

-- 4. TEST INSERT PERMISSION
-- This should return true if you can insert messages
SELECT 
    has_table_privilege('chat_messages', 'INSERT') as can_insert_table,
    current_user as database_user,
    auth.role() as auth_role;