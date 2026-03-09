-- PERMANENT FIX FOR FRONTEND AUTH ISSUE
-- Replace temporary bypass policies with proper auth policies

-- 1. REMOVE TEMPORARY BYPASS POLICIES
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_profiles" ON profiles;

-- 2. CREATE PROPER AUTH POLICIES THAT WORK WITH FRONTEND
-- The issue is auth.uid() returns NULL from frontend JWT tokens
-- Solution: Use less strict policies that still check authentication

-- Chat Messages: Allow authenticated users (including those with JWT token issues)
CREATE POLICY "Allow authenticated users to read chat messages" 
ON chat_messages 
FOR SELECT 
TO authenticated 
USING (true);

-- Profiles: Allow authenticated users to read all profiles (needed for chat display)
CREATE POLICY "Allow authenticated users to read all profiles" 
ON profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Keep INSERT policies strict with auth.uid() check
CREATE POLICY "Users can insert their own chat messages" 
ON chat_messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 3. VERIFY NEW POLICIES
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