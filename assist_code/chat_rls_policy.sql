-- Chat Messages RLS Policy
-- Allows users to insert, update, and delete their own chat messages

-- Enable RLS on chat_messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for INSERT: Users can insert their own messages
CREATE POLICY "Users can insert their own chat messages" ON chat_messages
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can update their own messages
CREATE POLICY "Users can update their own chat messages" ON chat_messages
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Users can delete their own messages
CREATE POLICY "Users can delete their own chat messages" ON chat_messages
FOR DELETE 
USING (auth.uid() = user_id);

-- Policy for SELECT: All users can read all chat messages (public chat)
CREATE POLICY "Everyone can read chat messages" ON chat_messages
FOR SELECT 
USING (true);

-- Verification queries to test the policies
-- 1. Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'chat_messages';

-- 2. List all policies on chat_messages table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- 3. Test insert (run as authenticated user)
-- INSERT INTO chat_messages (user_id, user_name, user_level, is_pro, message) 
-- VALUES (auth.uid(), 'Test User', 1, false, 'Test message');

-- 4. Test update (run as authenticated user - should only update own messages)
-- UPDATE chat_messages 
-- SET message = 'Updated message' 
-- WHERE user_id = auth.uid() AND id = 'your-message-id';

-- 5. Test delete (run as authenticated user - should only delete own messages)
-- DELETE FROM chat_messages 
-- WHERE user_id = auth.uid() AND id = 'your-message-id';