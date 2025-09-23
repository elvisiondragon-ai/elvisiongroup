-- DEBUG CHAT DELETE ISSUE
-- Policy exists but users can't delete their messages

-- 1. CHECK EXISTING DELETE POLICY
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_messages'
AND cmd = 'DELETE';

-- 2. CHECK CURRENT AUTH STATE
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 3. TEST IF USER CAN SEE THEIR OWN MESSAGES
SELECT 
    id,
    user_id,
    user_name,
    message,
    created_at,
    CASE 
        WHEN user_id = auth.uid() THEN 'CAN_DELETE'
        ELSE 'CANNOT_DELETE'
    END as delete_permission
FROM chat_messages 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 3;

-- 4. FIX THE DELETE POLICY (if needed)
-- Drop and recreate with correct conditions
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON chat_messages;

-- Create new DELETE policy that works with current auth setup
CREATE POLICY "Allow authenticated users to delete own messages" 
ON chat_messages 
FOR DELETE 
TO authenticated 
USING (user_id::text = auth.uid()::text);

-- 5. VERIFY THE FIX
SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'chat_messages'
AND cmd = 'DELETE';