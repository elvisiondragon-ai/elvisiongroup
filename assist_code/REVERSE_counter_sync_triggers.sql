-- EMERGENCY REVERSE: Remove all counter sync changes
-- This undoes all the trigger and counter modifications

-- 1. DROP ALL TRIGGERS IMMEDIATELY
DROP TRIGGER IF EXISTS trigger_sync_journal_counter ON reflections;
DROP TRIGGER IF EXISTS trigger_sync_habit_counter ON elite_habits;

-- 2. DROP THE FUNCTIONS
DROP FUNCTION IF EXISTS sync_total_journal_counter();
DROP FUNCTION IF EXISTS sync_total_elite_habit_counter();

-- 3. RESET ALL COUNTERS TO NULL (original state)
UPDATE profiles 
SET total_journal = NULL,
    total_elite_habit = NULL,
    updated_at = now()
WHERE total_journal IS NOT NULL 
   OR total_elite_habit IS NOT NULL;

-- 4. Verification: Check all triggers are removed
SELECT 
    'Trigger cleanup verification' as check_type,
    COUNT(*) as remaining_triggers
FROM information_schema.triggers 
WHERE trigger_name IN ('trigger_sync_journal_counter', 'trigger_sync_habit_counter');

-- 5. Verification: Check all functions are removed
SELECT 
    'Function cleanup verification' as check_type,
    COUNT(*) as remaining_functions
FROM information_schema.routines 
WHERE routine_name IN ('sync_total_journal_counter', 'sync_total_elite_habit_counter');

-- 6. Verification: Check counters are reset
SELECT 
    'Counter reset verification' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_journal IS NOT NULL THEN 1 END) as profiles_with_journal_counter,
    COUNT(CASE WHEN total_elite_habit IS NOT NULL THEN 1 END) as profiles_with_habit_counter,
    CASE 
        WHEN COUNT(CASE WHEN total_journal IS NOT NULL THEN 1 END) = 0 
         AND COUNT(CASE WHEN total_elite_habit IS NOT NULL THEN 1 END) = 0
        THEN '✅ All counters reset to NULL'
        ELSE '❌ Some counters still exist'
    END as reset_status
FROM profiles;

-- 7. Show current state
SELECT 
    'Current profiles state' as info,
    user_id,
    display_name,
    total_journal,
    total_elite_habit,
    updated_at
FROM profiles
WHERE total_journal IS NOT NULL 
   OR total_elite_habit IS NOT NULL
LIMIT 10;

-- 8. COMPLETE CLEANUP VERIFICATION
SELECT 
    'EMERGENCY REVERSE COMPLETE' as status,
    'All triggers removed' as triggers_status,
    'All functions removed' as functions_status,
    'All counters reset to NULL' as counters_status,
    'Database restored to original state' as final_status;