-- CHAT FIX - CLEAN VERSION (NO DUPLICATES)
-- Only run what's needed

-- 1. CHECK EXISTING POLICIES FIRST
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
ORDER BY tablename, cmd;

-- 2. ONLY ADD MISSING INDEXES (safe to run)
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 3. OPTIMIZE TABLES (safe to run)
ANALYZE chat_messages;
ANALYZE profiles;

-- 4. TEST DELETE FUNCTIONALITY
-- Check if you can see and delete your own messages
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

-- 5. CHECK AUTH STATUS
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 6. TEST CHAT FUNCTIONALITY
SELECT 
    COUNT(*) as total_messages,
    COUNT(DISTINCT user_id) as unique_users,
    MAX(created_at) as latest_message
FROM chat_messages;