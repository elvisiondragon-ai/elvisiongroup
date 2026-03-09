-- Delete chat messages from users who have deleted their accounts
-- This removes orphaned chat messages where user_id no longer exists in auth.users

DELETE FROM chat_messages 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);

-- Verification: Count how many messages were deleted
SELECT 
  COUNT(*) as orphaned_messages_count,
  'Messages from deleted users have been removed' as status
FROM chat_messages 
WHERE user_id NOT IN (
  SELECT id FROM auth.users
);