-- PROPER FIX: Restore counters to correct values from actual data
-- This fixes the damage and restores real counter values

-- 1. EMERGENCY: Remove dangerous triggers first
DROP TRIGGER IF EXISTS trigger_sync_journal_counter ON reflections;
DROP TRIGGER IF EXISTS trigger_sync_habit_counter ON elite_habits;
DROP FUNCTION IF EXISTS sync_total_journal_counter();
DROP FUNCTION IF EXISTS sync_total_elite_habit_counter();

-- 2. Restore total_journal to actual reflection counts
UPDATE profiles 
SET total_journal = COALESCE(reflection_counts.count_reflections, 0),
    updated_at = now()
FROM (
    SELECT 
        r.user_id::uuid as user_id, 
        COUNT(r.id) as count_reflections
    FROM reflections r 
    GROUP BY r.user_id::uuid
) AS reflection_counts
WHERE profiles.user_id = reflection_counts.user_id;

-- 3. Set total_journal to 0 for users with no reflections
UPDATE profiles 
SET total_journal = 0,
    updated_at = now()
WHERE total_journal IS NULL 
  AND NOT EXISTS (
      SELECT 1 FROM reflections r 
      WHERE r.user_id::uuid = profiles.user_id
  );

-- 4. Restore total_elite_habit to actual habit counts
UPDATE profiles 
SET total_elite_habit = COALESCE(habit_counts.count_habits, 0),
    updated_at = now()
FROM (
    SELECT 
        eh.user_id, 
        COUNT(eh.id) as count_habits
    FROM elite_habits eh 
    GROUP BY eh.user_id
) AS habit_counts
WHERE profiles.user_id = habit_counts.user_id;

-- 5. Set total_elite_habit to 0 for users with no habits
UPDATE profiles 
SET total_elite_habit = 0,
    updated_at = now()
WHERE total_elite_habit IS NULL 
  AND NOT EXISTS (
      SELECT 1 FROM elite_habits eh 
      WHERE eh.user_id = profiles.user_id
  );

-- 6. Verification: Ensure counters match actual data
SELECT 
    'VERIFICATION: Journal counters' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN p.total_journal = COALESCE(r.actual_count, 0) THEN 1 END) as correct_counters,
    COUNT(CASE WHEN p.total_journal != COALESCE(r.actual_count, 0) THEN 1 END) as incorrect_counters,
    CASE 
        WHEN COUNT(CASE WHEN p.total_journal != COALESCE(r.actual_count, 0) THEN 1 END) = 0 
        THEN '✅ ALL JOURNAL COUNTERS CORRECT'
        ELSE '❌ Some journal counters still wrong'
    END as journal_status
FROM profiles p
LEFT JOIN (
    SELECT r.user_id::uuid as user_id, COUNT(r.id) as actual_count
    FROM reflections r GROUP BY r.user_id::uuid
) r ON p.user_id = r.user_id;

-- 7. Verification: Habit counters
SELECT 
    'VERIFICATION: Habit counters' as check_type,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN p.total_elite_habit = COALESCE(h.actual_count, 0) THEN 1 END) as correct_counters,
    COUNT(CASE WHEN p.total_elite_habit != COALESCE(h.actual_count, 0) THEN 1 END) as incorrect_counters,
    CASE 
        WHEN COUNT(CASE WHEN p.total_elite_habit != COALESCE(h.actual_count, 0) THEN 1 END) = 0 
        THEN '✅ ALL HABIT COUNTERS CORRECT'
        ELSE '❌ Some habit counters still wrong'
    END as habit_status
FROM profiles p
LEFT JOIN (
    SELECT eh.user_id, COUNT(eh.id) as actual_count
    FROM elite_habits eh GROUP BY eh.user_id
) h ON p.user_id = h.user_id;

-- 8. Show sample of restored data
SELECT 
    'RESTORED DATA SAMPLE' as info,
    display_name,
    total_journal,
    total_elite_habit,
    updated_at
FROM profiles
WHERE (total_journal > 0 OR total_elite_habit > 0)
ORDER BY updated_at DESC
LIMIT 5;

-- 9. FINAL STATUS
SELECT 
    'SYSTEM RESTORED' as status,
    'Triggers removed' as safety_status,
    'Counters restored to actual values' as data_status,
    'No more automatic modifications' as protection_status;