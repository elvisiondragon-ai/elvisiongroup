-- Delete chat messages by user email
-- Usage: Replace 'user@example.com' with the actual email

DELETE FROM chat_messages 
WHERE user_id IN (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'user@example.com'
);

-- Verification: Check remaining messages for that user
SELECT COUNT(*) as remaining_messages 
FROM chat_messages 
WHERE user_id IN (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'user@example.com'
);