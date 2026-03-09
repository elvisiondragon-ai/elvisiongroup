-- This SQL job helps diagnose why the total_verses count is still being blocked.

-- 1. Verify the trigger is active
-- This query checks if the 'on_verse_completion' trigger is correctly installed on the 'user_activities' table.
SELECT
    'TRIGGER VERIFICATION' as info,
    tgname as trigger_name,
    relname as table_name,
    CASE
        WHEN tgenabled = 'O' THEN 'ENABLED'
        ELSE 'DISABLED'
    END as status
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE relname = 'user_activities' AND tgname = 'on_verse_completion';

-- 2. Check for recent verse completion activities
-- This query looks for recent verse completions that should have fired the trigger.
-- If you see recent entries here, the trigger should have run.
SELECT
    'RECENT VERSE COMPLETIONS' as info,
    user_id,
    activity_type,
    created_at
FROM public.user_activities
WHERE activity_type IN ('verse_completion', 'audio_completion')
ORDER BY created_at DESC
LIMIT 10;

-- 3. Re-examine the award_xp function
-- This will show us the current, active version of the award_xp function to ensure it was updated correctly.
SELECT
    'AWARD_XP FUNCTION DEFINITION' as info,
    pg_get_functiondef(p.oid) as function_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'award_xp';

-- 4. Check for other triggers on the profiles table
-- This query lists all triggers on the 'profiles' table to see if anything else could be interfering.
SELECT
    'OTHER PROFILES TRIGGERS' as info,
    tgname as trigger_name,
    relname as table_name,
    CASE
        WHEN tgenabled = 'O' THEN 'ENABLED'
        ELSE 'DISABLED'
    END as status
FROM pg_trigger
JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
WHERE relname = 'profiles';
