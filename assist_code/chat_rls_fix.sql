-- FIX RLS POLICIES FOR CHAT FUNCTIONALITY
-- Current issue: Users can't see community chat messages or other users' profiles

-- 1. FIX CHAT_MESSAGES SELECT POLICY
-- Current policy blocks reading messages without channel_id='community'
-- But Chat.tsx doesn't set channel_id, so no messages are visible

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Chat message access" ON chat_messages;

-- Create new policy: Allow authenticated users to read all chat messages
CREATE POLICY "Authenticated users can read all chat messages" 
ON chat_messages 
FOR SELECT 
TO public 
USING (auth.uid() IS NOT NULL);

-- 2. FIX PROFILES SELECT POLICY  
-- Current policy only allows users to see their own profile
-- But Chat.tsx needs to display other users' names and levels in chat

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create new policy: Allow authenticated users to read all profiles
CREATE POLICY "Authenticated users can read all profiles" 
ON profiles 
FOR SELECT 
TO public 
USING (auth.uid() IS NOT NULL);

-- 3. VERIFY POLICIES ARE CORRECTLY SET
-- Check the new policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('chat_messages', 'profiles')
AND cmd = 'SELECT'
ORDER BY tablename;

-- 4. TEST QUERIES THAT CHAT.TSX RUNS
-- These should now work for authenticated users

-- Test: Load all chat messages (Chat.tsx line 119-122)
-- SELECT * FROM chat_messages ORDER BY created_at ASC;

-- Test: Get user profile (Chat.tsx line 56-60) 
-- SELECT * FROM profiles WHERE user_id = auth.uid();

-- Test: Get any user profile for chat display
-- SELECT * FROM profiles LIMIT 1;