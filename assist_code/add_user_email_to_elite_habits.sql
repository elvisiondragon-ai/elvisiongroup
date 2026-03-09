-- Add user_email column to elite_habits table
-- This will help with analytics and user identification

-- Add the column to store user email
ALTER TABLE public.elite_habits
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create index for better performance on email lookups
CREATE INDEX IF NOT EXISTS elite_habits_user_email_idx ON public.elite_habits(user_email);

-- Update existing records with user emails from auth.users
-- Handle UUID/text conversion safely
UPDATE public.elite_habits
SET user_email = auth_users.email
FROM auth.users AS auth_users
WHERE elite_habits.user_id::uuid = auth_users.id
AND elite_habits.user_email IS NULL;

-- Create a function to automatically populate user_email on insert
CREATE OR REPLACE FUNCTION public.populate_elite_habit_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Get user email from auth.users table
    -- Handle both UUID and text formats safely
    BEGIN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id::uuid;
    EXCEPTION WHEN OTHERS THEN
        -- If conversion fails, try direct comparison
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id::text = NEW.user_id;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-populate email on insert
DROP TRIGGER IF EXISTS populate_elite_habit_email_trigger ON public.elite_habits;
CREATE TRIGGER populate_elite_habit_email_trigger
    BEFORE INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_elite_habit_email();

-- Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'elite_habits'
AND column_name = 'user_email';

-- Show sample data with emails
SELECT
    user_id,
    user_email,
    exercise_type,
    duration_minutes,
    created_at
FROM public.elite_habits
ORDER BY created_at DESC
LIMIT 5;