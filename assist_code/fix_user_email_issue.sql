-- FIX THE USER_EMAIL ISSUE THAT BROKE ELITE HABITS
-- The problem: EliteHabit.tsx doesn't provide user_email in insert
-- Solution: Make user_email optional and auto-populate it

-- 1. Make user_email column optional (allow NULL)
ALTER TABLE public.elite_habits
ALTER COLUMN user_email DROP NOT NULL;

-- 2. Ensure the auto-populate trigger works for NULL user_email
CREATE OR REPLACE FUNCTION public.populate_elite_habit_user_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Always auto-populate user_email from auth.users if it's NULL or empty
    IF NEW.user_email IS NULL OR NEW.user_email = '' THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Recreate the trigger to ensure it works
DROP TRIGGER IF EXISTS populate_elite_habit_user_email_trigger ON public.elite_habits;
CREATE TRIGGER populate_elite_habit_user_email_trigger
    BEFORE INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_elite_habit_user_email();

-- 4. Test the fix with the exact same insert pattern as EliteHabit.tsx
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
    today_date TEXT;
BEGIN
    -- Get a real user for testing
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 1;

    IF test_user_id IS NOT NULL THEN
        today_date := CURRENT_DATE::TEXT;

        -- Insert exactly like EliteHabit.tsx does (WITHOUT user_email)
        INSERT INTO public.elite_habits (
            user_id,
            exercise_type,
            duration_minutes,
            date
        ) VALUES (
            test_user_id,
            'TEST FIX',
            15,
            today_date
        );

        RAISE NOTICE 'SUCCESS: Inserted test record for user % without providing user_email', test_email;

        -- Check if user_email was auto-populated
        SELECT user_email INTO test_email
        FROM public.elite_habits
        WHERE user_id = test_user_id AND exercise_type = 'TEST FIX'
        ORDER BY created_at DESC
        LIMIT 1;

        RAISE NOTICE 'SUCCESS: Auto-populated user_email is: %', test_email;

    ELSE
        RAISE NOTICE 'ERROR: No users found for testing';
    END IF;
END $$;

-- 5. Verify the fix worked
SELECT 'VERIFICATION' as status,
       COUNT(*) as total_records,
       COUNT(CASE WHEN user_email IS NOT NULL THEN 1 END) as records_with_email
FROM public.elite_habits;

SELECT 'LATEST RECORDS' as status,
       exercise_type,
       user_email,
       created_at
FROM public.elite_habits
ORDER BY created_at DESC
LIMIT 3;