-- Delete last N users - Change only the number below:
-- CHANGE THIS NUMBER: How many users to delete (change 5 to any number you want)

DELETE FROM auth.users
WHERE id IN (
  SELECT id
  FROM auth.users
  ORDER BY created_at DESC
  LIMIT 5
);

-- Verify deletion
SELECT COUNT(*) as remaining_users FROM auth.users;