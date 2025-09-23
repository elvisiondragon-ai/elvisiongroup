-- PERMANENT SECURE FIX - Replace temporary policies

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

-- 3. Keep existing INSERT policies (they were fine)
-- Users can insert their own chat messages 
-- Users can insert their own profiles