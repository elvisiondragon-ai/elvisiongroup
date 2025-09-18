-- Since all user_emails are now populated (0 remaining nulls)
-- Safe to add NOT NULL constraint to existing column

-- Add NOT NULL constraint to user_email column
ALTER TABLE profiles
ALTER COLUMN user_email SET NOT NULL;

-- Verify constraint was added
SELECT
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'user_email';