-- Fix elite_habits table - add user_email column like other tables
-- This should fix the 403 permission error

ALTER TABLE public.elite_habits
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Update existing records with user emails
UPDATE public.elite_habits
SET user_email = auth.users.email
FROM auth.users
WHERE elite_habits.user_id = auth.users.id
  AND elite_habits.user_email IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS elite_habits_user_email_idx ON public.elite_habits(user_email);