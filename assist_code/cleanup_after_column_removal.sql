-- Add NOT NULL constraint to user_email (since we fixed the nulls earlier)
ALTER TABLE profiles
ALTER COLUMN user_email SET NOT NULL;

-- Verify the constraint was added
SELECT
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name = 'user_email';