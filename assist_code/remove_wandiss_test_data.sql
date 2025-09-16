-- REMOVE WANDISS588@GMAIL.COM TEST DATA FROM ELITE_HABITS
-- Clean up all test records created during debugging

-- 1. First, show what we're about to delete
SELECT 'RECORDS TO DELETE' as status,
       h.id,
       h.exercise_type,
       h.duration_minutes,
       h.date,
       h.created_at
FROM public.elite_habits h
JOIN auth.users u ON h.user_id = u.id
WHERE u.email = 'wandiss588@gmail.com'
ORDER BY h.created_at DESC;

-- 2. Delete all elite_habits records for wandiss588@gmail.com
DELETE FROM public.elite_habits
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'wandiss588@gmail.com'
);

-- 3. Also clean up any test records we created during debugging
DELETE FROM public.elite_habits
WHERE exercise_type IN (
    'DEBUG TEST',
    'MANUAL DEBUG TEST',
    'TEST FIX',
    'QUICK TEST',
    'RLS POLICY TEST',
    'BACK TO WORKING',
    'SAFE EMAIL TEST'
);

-- 4. Reset the total_elite_habit count for wandiss user in profiles
UPDATE public.profiles
SET total_elite_habit = 0
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'wandiss588@gmail.com'
);

-- 5. Show what remains after cleanup
SELECT 'REMAINING RECORDS' as status,
       COUNT(*) as total_records,
       COUNT(DISTINCT user_id) as unique_users
FROM public.elite_habits;

-- 6. Show current profiles with elite habit counts
SELECT 'CURRENT PROFILE TOTALS' as status,
       u.email,
       p.total_elite_habit,
       (SELECT COUNT(*) FROM public.elite_habits WHERE user_id = u.id) as actual_records
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.total_elite_habit > 0 OR u.email = 'wandiss588@gmail.com'
ORDER BY p.total_elite_habit DESC;