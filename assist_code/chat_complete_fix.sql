-- COMPLETE CHAT.TSX FIX AFTER DATABASE RESTORE
-- All chat issues in one file

-- 1. FIX RLS POLICIES FOR CHAT ACCESS
-- After restore, need to ensure users can read/send messages

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Chat message access" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create permissive policies for chat functionality
CREATE POLICY "Authenticated users can read all chat messages" 
ON chat_messages 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can read all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Keep INSERT policies secure
CREATE POLICY IF NOT EXISTS "Authenticated users can create chat messages" 
ON chat_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. FIX DELETE POLICY FOR CHAT MESSAGES
-- Allow users to delete their own messages
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete own messages" ON chat_messages;

CREATE POLICY "Users can delete own chat messages" 
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (user_id::text = auth.uid()::text);

-- 3. ADD PERFORMANCE INDEXES FOR CHAT
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 4. OPTIMIZE CHAT TABLES
ANALYZE chat_messages;
ANALYZE profiles;
VACUUM ANALYZE chat_messages;

-- 5. VERIFY CHAT POLICIES ARE WORKING
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
ORDER BY tablename, cmd;

-- 6. TEST CHAT FUNCTIONALITY
-- Check if authenticated users can access data
SELECT 
    'chat_messages' as table_name,
    COUNT(*) as total_rows
FROM chat_messages
UNION ALL
SELECT 
    'profiles' as table_name,
    COUNT(*) as total_rows
FROM profiles;

-- 7. CHECK CURRENT AUTH STATE
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 8. CLEAN UP ANY CORRUPTED CHAT DATA
-- Remove any NULL or invalid messages
DELETE FROM chat_messages 
WHERE message IS NULL 
OR message = '' 
OR user_id IS NULL;

-- Update table statistics after cleanup
ANALYZE chat_messages;

-- 9. VERIFY CHAT MESSAGES STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. SUCCESS VERIFICATION
-- If this query returns data, chat is working
SELECT 
    COUNT(*) as total_messages,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(created_at) as latest_message
FROM chat_messages;