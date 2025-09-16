-- LIVE DEBUGGING - Check what's actually happening with elite habits
-- Run this to see the current state after the fix

-- 1. Check if the table exists and has data
SELECT 'TABLE STATUS' as check_type,
       COUNT(*) as total_records,
       MAX(created_at) as latest_entry
FROM public.elite_habits;

-- 2. Check table structure
SELECT 'TABLE STRUCTURE' as check_type,
       column_name,
       data_type,
       is_nullable
FROM information_schema.columns
WHERE table_name = 'elite_habits' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if triggers exist
SELECT 'TRIGGERS' as check_type,
       trigger_name,
       event_manipulation,
       action_timing
FROM information_schema.triggers
WHERE event_object_table = 'elite_habits'
ORDER BY trigger_name;

-- 4. Check current user profiles total_elite_habit
SELECT 'PROFILE TOTALS' as check_type,
       u.email,
       p.total_elite_habit,
       p.user_id
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- 5. Check if there are any elite_habits records at all
SELECT 'RECENT ELITE HABITS' as check_type,
       h.id,
       h.user_email,
       h.exercise_type,
       h.duration_minutes,
       h.date,
       h.created_at
FROM public.elite_habits h
ORDER BY h.created_at DESC
LIMIT 10;

-- 6. Check for any constraints or policy issues
SELECT 'POLICIES' as check_type,
       schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual
FROM pg_policies
WHERE tablename = 'elite_habits';

-- 7. Test insertion manually with a real user
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
    insert_result INTEGER;
BEGIN
    -- Get the most recent user
    SELECT u.id, u.email INTO test_user_id, test_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 1;

    IF test_user_id IS NOT NULL THEN
        -- Try inserting a test record
        INSERT INTO public.elite_habits (
            user_id,
            user_email,
            exercise_type,
            duration_minutes,
            date
        ) VALUES (
            test_user_id,
            test_email,
            'DEBUG TEST',
            5,
            CURRENT_DATE::TEXT
        );

        GET DIAGNOSTICS insert_result = ROW_COUNT;
        RAISE NOTICE 'DEBUG TEST: Inserted % row(s) for user %', insert_result, test_email;

        -- Check if the profile total updated
        SELECT total_elite_habit INTO insert_result
        FROM public.profiles
        WHERE user_id = test_user_id;

        RAISE NOTICE 'DEBUG TEST: Profile total_elite_habit is now %', insert_result;

    ELSE
        RAISE NOTICE 'DEBUG TEST: No users found for testing';
    END IF;
END $$;

-- 8. Final verification after test
SELECT 'FINAL VERIFICATION' as check_type,
       COUNT(*) as total_habits,
       COUNT(DISTINCT user_id) as unique_users,
       MAX(created_at) as latest_created
FROM public.elite_habits;