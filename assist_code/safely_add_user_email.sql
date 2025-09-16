-- SAFELY ADD USER_EMAIL TO ELITE_HABITS WITHOUT BREAKING ANYTHING
-- This adds user_email as completely optional and populates existing data

-- 1. Add user_email column as completely optional (NULL allowed, no constraints)
ALTER TABLE public.elite_habits
ADD COLUMN user_email TEXT DEFAULT NULL;

-- 2. Create index for performance (optional column)
CREATE INDEX IF NOT EXISTS elite_habits_user_email_idx ON public.elite_habits(user_email) WHERE user_email IS NOT NULL;

-- 3. Sync ALL existing records with user_email (populate what we can)
UPDATE public.elite_habits
SET user_email = auth.users.email
FROM auth.users
WHERE elite_habits.user_id = auth.users.id
AND elite_habits.user_email IS NULL;

-- 4. Create a safe trigger that ONLY adds user_email for NEW records (doesn't break existing inserts)
CREATE OR REPLACE FUNCTION public.auto_populate_elite_habit_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Only populate if user_email is NULL and we have a user_id
    IF NEW.user_email IS NULL AND NEW.user_id IS NOT NULL THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;

        -- If no email found, leave as NULL (don't break the insert)
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for new insertions only
CREATE TRIGGER auto_populate_elite_habit_email_trigger
    BEFORE INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_populate_elite_habit_email();

-- 6. Test that the system still works exactly like before
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
    record_count_before INTEGER;
    record_count_after INTEGER;
BEGIN
    -- Count records before test
    SELECT COUNT(*) INTO record_count_before FROM public.elite_habits;

    -- Get a real user
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 1;

    -- Test insertion EXACTLY like EliteHabit.tsx (without user_email)
    INSERT INTO public.elite_habits (
        user_id,
        exercise_type,
        duration_minutes,
        date
    ) VALUES (
        test_user_id,
        'SAFE EMAIL TEST',
        20,
        CURRENT_DATE::TEXT
    );

    -- Count records after test
    SELECT COUNT(*) INTO record_count_after FROM public.elite_habits;

    RAISE NOTICE 'SUCCESS: Records before: %, after: %, user: %', record_count_before, record_count_after, test_email;

END $$;

-- 7. Verify the user_email was auto-populated in the test
SELECT 'AUTO POPULATE TEST' as status,
       exercise_type,
       user_email,
       created_at
FROM public.elite_habits
WHERE exercise_type = 'SAFE EMAIL TEST'
ORDER BY created_at DESC;

-- 8. Show sync results for existing data
SELECT 'SYNC RESULTS' as status,
       COUNT(*) as total_records,
       COUNT(user_email) as records_with_email,
       COUNT(*) - COUNT(user_email) as records_without_email
FROM public.elite_habits;

-- 9. Show sample of synced data
SELECT 'SAMPLE SYNCED DATA' as status,
       exercise_type,
       user_email,
       date,
       created_at
FROM public.elite_habits
WHERE user_email IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;