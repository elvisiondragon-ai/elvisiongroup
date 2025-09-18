-- OPTION 1: Add NOT NULL constraint (CAREFUL - will fail if any nulls remain)
-- Only run AFTER fixing existing null emails

-- Check if safe to add constraint
SELECT
    COUNT(*) as remaining_null_emails
FROM profiles
WHERE user_email IS NULL;
-- Should show 0 before proceeding

-- Add NOT NULL constraint (run only if above shows 0)
ALTER TABLE profiles
ALTER COLUMN user_email SET NOT NULL;

-- OPTION 2: Add check constraint (safer alternative)
-- This allows existing nulls but prevents new ones
ALTER TABLE profiles
ADD CONSTRAINT check_user_email_not_empty
CHECK (user_email IS NOT NULL AND user_email != '');

-- OPTION 3: Create trigger to auto-populate from auth.users
CREATE OR REPLACE FUNCTION auto_populate_user_email()
RETURNS TRIGGER AS $$
BEGIN
    -- If user_email is null, get it from auth.users
    IF NEW.user_email IS NULL THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS trigger_auto_populate_user_email ON profiles;
CREATE TRIGGER trigger_auto_populate_user_email
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_user_email();