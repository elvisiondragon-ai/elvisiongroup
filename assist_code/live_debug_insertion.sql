-- LIVE DEBUG: Check what happens during actual insertion
-- Run this BEFORE testing, then try clicking "Catat Elite Habit", then run again

-- 1. Current state check
SELECT 'BEFORE TEST' as phase,
       'elite_habits' as table_name,
       COUNT(*) as record_count,
       MAX(created_at) as latest_entry
FROM public.elite_habits
UNION ALL
SELECT 'BEFORE TEST' as phase,
       'profiles' as table_name,
       COUNT(*) as record_count,
       MAX(created_at) as latest_entry
FROM public.profiles;

-- 2. Check current user's profile data
SELECT 'CURRENT USER DATA' as phase,
       u.email,
       u.id as user_id,
       p.total_elite_habit,
       p.display_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 3;

-- 3. Check if elite_habits table is accessible
SELECT 'TABLE ACCESS TEST' as phase,
       COUNT(*) as accessible_records
FROM public.elite_habits;

-- 4. Test manual insertion with exact EliteHabit.tsx pattern
DO $$
DECLARE
    current_user_id UUID;
    current_user_email TEXT;
    today_string TEXT;
    insert_error TEXT;
BEGIN
    -- Get current user (replace with actual logged in user)
    SELECT u.id, u.email INTO current_user_id, current_user_email
    FROM auth.users u
    JOIN public.profiles p ON u.id = p.user_id
    ORDER BY u.created_at DESC
    LIMIT 1;

    today_string := CURRENT_DATE::TEXT;

    BEGIN
        -- Exact same insert as EliteHabit.tsx line 131-138
        INSERT INTO public.elite_habits (
            user_id,
            exercise_type,
            duration_minutes,
            date
        ) VALUES (
            current_user_id,
            'MANUAL DEBUG TEST',
            10,
            today_string
        );

        RAISE NOTICE 'SUCCESS: Manual insert worked for user %', current_user_email;

    EXCEPTION WHEN OTHERS THEN
        insert_error := SQLERRM;
        RAISE NOTICE 'ERROR: Manual insert failed: %', insert_error;
    END;
END $$;

-- 5. Check what happened after manual test
SELECT 'AFTER MANUAL TEST' as phase,
       exercise_type,
       user_email,
       duration_minutes,
       date,
       created_at
FROM public.elite_habits
WHERE exercise_type = 'MANUAL DEBUG TEST'
ORDER BY created_at DESC;

-- 6. Check profile total after manual test
SELECT 'PROFILE AFTER TEST' as phase,
       u.email,
       p.total_elite_habit,
       (SELECT COUNT(*) FROM public.elite_habits WHERE user_id = u.id) as actual_count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 3;

-- 7. Check for any constraints or triggers that might be blocking
SELECT 'CONSTRAINT CHECK' as phase,
       conname as constraint_name,
       contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'public.elite_habits'::regclass;

-- 8. Check RLS policies
SELECT 'RLS POLICIES' as phase,
       policyname,
       cmd,
       permissive,
       qual
FROM pg_policies
WHERE tablename = 'elite_habits' AND schemaname = 'public';