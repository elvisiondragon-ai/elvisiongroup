-- SIMPLIFIED AUTH DEBUG (no auth.config table)
-- User logged in but auth.uid() returns NULL

-- 1. TEST CURRENT AUTH STATE
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 2. CHECK RECENT USER LOGINS  
SELECT 
    id,
    email,
    last_sign_in_at,
    created_at
FROM auth.users 
ORDER BY last_sign_in_at DESC NULLS LAST
LIMIT 5;

-- 3. CHECK ACTIVE SESSIONS
SELECT 
    user_id,
    created_at,
    updated_at
FROM auth.sessions 
WHERE updated_at > NOW() - INTERVAL '1 day'
ORDER BY updated_at DESC;

-- 4. TEMPORARY FIX - BYPASS AUTH FOR TESTING
-- This will allow chat to work while we fix auth issue

-- Allow all users to read chat messages (temporary)
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_chat_messages" ON chat_messages;
CREATE POLICY "DEBUG_TEMP_allow_all_chat_messages" 
ON chat_messages 
FOR SELECT 
TO public 
USING (true);

-- Allow all users to read profiles (temporary)
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_profiles" ON profiles;
CREATE POLICY "DEBUG_TEMP_allow_all_profiles"
ON profiles 
FOR SELECT 
TO public 
USING (true);

-- 5. TEST IF CHAT WORKS NOW
-- SELECT COUNT(*) FROM chat_messages;
-- SELECT COUNT(*) FROM profiles;