-- CHAT COMPLETE FIX WITH CORRECT SYNTAX
-- Fixed PostgreSQL syntax errors

-- 1. FIX RLS POLICIES FOR CHAT ACCESS
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

-- Keep INSERT policies secure (FIXED SYNTAX)
DROP POLICY IF EXISTS "Authenticated users can create chat messages" ON chat_messages;
CREATE POLICY "Authenticated users can create chat messages" 
ON chat_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. ENSURE DELETE POLICY EXISTS AND WORKS
-- Since you can delete messages, make sure policy is optimal
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;

-- Create working delete policy
CREATE POLICY "Users can delete own messages" 
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (user_id::text = auth.uid()::text);

-- 3. ADD PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 4. OPTIMIZE TABLES
ANALYZE chat_messages;
ANALYZE profiles;

-- 5. VERIFY ALL POLICIES WORK
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
ORDER BY tablename, cmd;

-- 6. TEST DELETE FUNCTIONALITY
-- Check if you can see your own messages (should be deletable)
SELECT 
    id,
    user_name,
    message,
    created_at,
    user_id,
    CASE 
        WHEN user_id::text = auth.uid()::text THEN 'CAN_DELETE'
        ELSE 'CANNOT_DELETE'
    END as delete_permission
FROM chat_messages 
WHERE user_id::text = auth.uid()::text
ORDER BY created_at DESC
LIMIT 3;