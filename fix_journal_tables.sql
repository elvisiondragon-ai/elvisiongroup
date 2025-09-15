-- Fix Journal Tables and Add User Email Columns
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Add user_email column to reflections table
ALTER TABLE reflections
ADD COLUMN user_email TEXT;

-- 2. Add user_email column to profiles table
ALTER TABLE profiles
ADD COLUMN user_email TEXT;

-- 3. Update existing reflections with user emails from auth.users
UPDATE reflections
SET user_email = auth.users.email
FROM auth.users
WHERE reflections.user_id = auth.users.id;

-- 4. Update existing profiles with user emails from auth.users
UPDATE profiles
SET user_email = auth.users.email
FROM auth.users
WHERE profiles.user_id = auth.users.id;

-- 5. Fix total_journal count in profiles table to match actual reflections count
UPDATE profiles
SET total_journal = (
    SELECT COUNT(*)
    FROM reflections
    WHERE reflections.user_id = profiles.user_id
);

-- 6. Create trigger to automatically update total_journal when reflection is added
CREATE OR REPLACE FUNCTION update_total_journal_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for INSERT on reflections table
DROP TRIGGER IF EXISTS trigger_update_journal_count_insert ON reflections;
CREATE TRIGGER trigger_update_journal_count_insert
    AFTER INSERT ON reflections
    FOR EACH ROW
    EXECUTE FUNCTION update_total_journal_count();

-- 8. Create trigger for DELETE on reflections table
CREATE OR REPLACE FUNCTION update_total_journal_count_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = OLD.user_id
    )
    WHERE user_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_journal_count_delete ON reflections;
CREATE TRIGGER trigger_update_journal_count_delete
    AFTER DELETE ON reflections
    FOR EACH ROW
    EXECUTE FUNCTION update_total_journal_count_delete();

-- 9. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_email ON reflections(user_email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_email ON profiles(user_email);
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON reflections(user_id);

-- 10. Add constraints to ensure user_email is populated for new records
-- (Optional - uncomment if you want to enforce this)
-- ALTER TABLE reflections
-- ADD CONSTRAINT reflections_user_email_not_null
-- CHECK (user_email IS NOT NULL);

-- ALTER TABLE profiles
-- ADD CONSTRAINT profiles_user_email_not_null
-- CHECK (user_email IS NOT NULL);

-- Verification queries to check the fixes:
-- SELECT user_id, user_email, total_journal FROM profiles LIMIT 10;
-- SELECT user_id, user_email, content FROM reflections LIMIT 10;
-- SELECT p.user_id, p.total_journal, COUNT(r.id) as actual_reflections
-- FROM profiles p
-- LEFT JOIN reflections r ON p.user_id = r.user_id
-- GROUP BY p.user_id, p.total_journal
-- HAVING p.total_journal != COUNT(r.id)
-- LIMIT 10;