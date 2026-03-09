-- ADD DELETE POLICY FOR CHAT MESSAGES
-- Allow users to delete their own chat messages

-- First check existing policies on chat_messages
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_messages'
ORDER BY cmd;

-- Add DELETE policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own chat messages" 
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Verify the new policy was created
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_messages'
AND cmd = 'DELETE';