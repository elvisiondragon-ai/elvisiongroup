-- PERMANENT SECURE FIX - Complete Chat Policies
-- Replace temporary policies with secure authenticated-only access

-- 1. Remove temporary insecure policies
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_profiles" ON profiles;

-- 2. Create secure policies - only authenticated users
CREATE POLICY "Authenticated users can read chat messages" 
ON chat_messages 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can read profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Ensure INSERT policies exist for authenticated users
DROP POLICY IF EXISTS "Authenticated users can create chat messages" ON chat_messages;
CREATE POLICY "Authenticated users can create chat messages"
ON chat_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. Ensure UPDATE policies exist for authenticated users
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- 5. CRITICAL: Ensure DELETE policy exists for chat messages
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Allow authenticated users to delete own messages" ON chat_messages;

CREATE POLICY "Authenticated users can delete own chat messages"
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (auth.uid()::text = user_id::text);

-- 6. Add performance indexes to speed up auth queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- 7. Optimize tables for faster auth queries
ANALYZE chat_messages;
ANALYZE profiles;
VACUUM ANALYZE chat_messages;
VACUUM ANALYZE profiles;

-- 8. Verify all policies are correctly set
SELECT 
    tablename,
    policyname,
    cmd,
    roles,
    CASE 
        WHEN cmd = 'SELECT' AND qual = 'true' THEN 'ALLOWS_ALL_AUTH_USERS'
        WHEN cmd = 'DELETE' AND qual LIKE '%user_id%' THEN 'USERS_OWN_DATA_ONLY'
        WHEN cmd = 'INSERT' AND with_check LIKE '%auth.uid%' THEN 'AUTH_REQUIRED'
        WHEN cmd = 'UPDATE' AND qual LIKE '%auth.uid%' THEN 'USERS_OWN_DATA_ONLY'
        ELSE 'OTHER_POLICY'
    END as policy_type
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
ORDER BY tablename, cmd;

-- 9. Test authentication and delete functionality
SELECT 
    auth.uid() as current_user_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'USER_AUTHENTICATED'
        ELSE 'USER_NOT_AUTHENTICATED'
    END as auth_status;

-- 10. Success verification - should show your deletable messages
SELECT 
    id,
    user_name,
    LEFT(message, 50) as message_preview,
    created_at,
    CASE 
        WHEN user_id::text = auth.uid()::text THEN 'DELETE_BUTTON_SHOULD_SHOW'
        ELSE 'NOT_YOUR_MESSAGE'
    END as delete_status
FROM chat_messages 
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 5;