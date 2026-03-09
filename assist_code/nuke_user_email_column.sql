-- NUKE THE USER_EMAIL COLUMN - REVERT TO WORKING STATE
-- This will restore elite_habits to exactly how it was working before

-- 1. Drop the problematic trigger first
DROP TRIGGER IF EXISTS populate_elite_habit_user_email_trigger ON public.elite_habits;
DROP FUNCTION IF EXISTS public.populate_elite_habit_user_email();

-- 2. Drop the user_email column completely
ALTER TABLE public.elite_habits DROP COLUMN IF EXISTS user_email;

-- 3. Drop the index on user_email
DROP INDEX IF EXISTS elite_habits_user_email_idx;

-- 4. Test insertion exactly like EliteHabit.tsx (without user_email)
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
BEGIN
    -- Get a real user
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 1;

    -- Insert exactly like the original working code
    INSERT INTO public.elite_habits (
        user_id,
        exercise_type,
        duration_minutes,
        date
    ) VALUES (
        test_user_id,
        'BACK TO WORKING',
        15,
        CURRENT_DATE::TEXT
    );

    RAISE NOTICE 'SUCCESS: Back to original working state for user %', test_email;

END $$;

-- 5. Verify we're back to the original working structure
SELECT 'TABLE STRUCTURE AFTER NUKE' as status,
       column_name,
       data_type
FROM information_schema.columns
WHERE table_name = 'elite_habits' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check the test worked
SELECT 'WORKING STATE TEST' as status,
       exercise_type,
       duration_minutes,
       date,
       created_at
FROM public.elite_habits
WHERE exercise_type = 'BACK TO WORKING'
ORDER BY created_at DESC;