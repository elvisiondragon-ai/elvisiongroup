-- UPDATE EXISTING POLICIES (NOT CREATE NEW ONES)
-- Fix the 10-second delete button delay

-- 1. First check what policies currently exist
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

-- 2. ONLY UPDATE THE DELETE POLICY (the main issue)
-- Drop all existing delete policies first
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete own messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can delete own chat messages" ON chat_messages;

-- Create the correct delete policy
CREATE POLICY "Users can delete own messages"
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (auth.uid()::text = user_id::text);

-- 3. ADD PERFORMANCE INDEXES ONLY (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 4. OPTIMIZE TABLES (safe to run multiple times)
ANALYZE chat_messages;
ANALYZE profiles;

-- 5. TEST THE DELETE FUNCTIONALITY
SELECT 
    id,
    user_name,
    LEFT(message, 30) as message_preview,
    created_at,
    user_id,
    auth.uid() as current_auth_uid,
    CASE 
        WHEN user_id::text = auth.uid()::text THEN 'DELETE_BUTTON_SHOULD_APPEAR'
        WHEN auth.uid() IS NULL THEN 'NOT_AUTHENTICATED'
        ELSE 'NOT_YOUR_MESSAGE'
    END as delete_button_status
FROM chat_messages 
WHERE created_at > NOW() - INTERVAL '6 hours'
ORDER BY created_at DESC
LIMIT 5;