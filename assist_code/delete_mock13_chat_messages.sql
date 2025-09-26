-- Delete all chat messages from user mock13@yahooo.com
DELETE FROM chat_messages 
WHERE user_id IN (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'mock13@yahooo.com'
);

-- Verification query
SELECT COUNT(*) as deleted_messages_count
FROM chat_messages 
WHERE user_id IN (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = 'mock13@yahooo.com'
);