-- POPULATE MISSING PROFILE COUNTERS
-- Fix total_journal and total_elite_habit for existing users

-- 1. Check current state of counters
SELECT 
    'Current counter state' as info,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_journal IS NOT NULL THEN 1 END) as profiles_with_journal_count,
    COUNT(CASE WHEN total_elite_habit IS NOT NULL THEN 1 END) as profiles_with_habit_count,
    AVG(COALESCE(total_journal, 0)) as avg_journal_count,
    AVG(COALESCE(total_elite_habit, 0)) as avg_habit_count
FROM profiles;

-- 2. Count actual reflections per user vs profile counters
SELECT 
    'Journal count validation' as check_type,
    p.user_id,
    p.display_name,
    p.total_journal as profile_count,
    COUNT(r.id) as actual_reflections,
    CASE 
        WHEN p.total_journal = COUNT(r.id) THEN '✅ Match'
        WHEN p.total_journal IS NULL THEN '❌ Missing counter'
        ELSE '⚠️ Mismatch'
    END as status
FROM profiles p
LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
GROUP BY p.user_id, p.display_name, p.total_journal
ORDER BY actual_reflections DESC
LIMIT 10;

-- 3. Count actual elite_habits per user vs profile counters
SELECT 
    'Elite habit count validation' as check_type,
    p.user_id,
    p.display_name,
    p.total_elite_habit as profile_count,
    COUNT(eh.id) as actual_habits,
    CASE 
        WHEN p.total_elite_habit = COUNT(eh.id) THEN '✅ Match'
        WHEN p.total_elite_habit IS NULL THEN '❌ Missing counter'
        ELSE '⚠️ Mismatch'
    END as status
FROM profiles p
LEFT JOIN elite_habits eh ON p.user_id = eh.user_id
GROUP BY p.user_id, p.display_name, p.total_elite_habit
ORDER BY actual_habits DESC
LIMIT 10;

-- 4. UPDATE: Populate total_journal from actual reflection counts
UPDATE profiles 
SET total_journal = reflection_counts.count_reflections,
    updated_at = now()
FROM (
    SELECT 
        r.user_id::uuid as user_id,
        COUNT(r.id) as count_reflections
    FROM reflections r
    GROUP BY r.user_id::uuid
) AS reflection_counts
WHERE profiles.user_id = reflection_counts.user_id
  AND (profiles.total_journal IS NULL 
       OR profiles.total_journal != reflection_counts.count_reflections);

-- 5. UPDATE: Populate total_elite_habit from actual habit counts  
UPDATE profiles 
SET total_elite_habit = habit_counts.count_habits,
    updated_at = now()
FROM (
    SELECT 
        eh.user_id,
        COUNT(eh.id) as count_habits
    FROM elite_habits eh
    GROUP BY eh.user_id
) AS habit_counts
WHERE profiles.user_id = habit_counts.user_id
  AND (profiles.total_elite_habit IS NULL 
       OR profiles.total_elite_habit != habit_counts.count_habits);

-- 6. Set counters to 0 for users with no activity
UPDATE profiles 
SET total_journal = 0,
    updated_at = now()
WHERE total_journal IS NULL 
  AND NOT EXISTS (
      SELECT 1 FROM reflections r 
      WHERE r.user_id::uuid = profiles.user_id
  );

UPDATE profiles 
SET total_elite_habit = 0,
    updated_at = now()
WHERE total_elite_habit IS NULL 
  AND NOT EXISTS (
      SELECT 1 FROM elite_habits eh 
      WHERE eh.user_id = profiles.user_id
  );

-- 7. Verification: Check final state
SELECT 
    'FINAL VERIFICATION' as status,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_journal IS NOT NULL THEN 1 END) as profiles_with_journal_count,
    COUNT(CASE WHEN total_elite_habit IS NOT NULL THEN 1 END) as profiles_with_habit_count,
    SUM(COALESCE(total_journal, 0)) as total_journal_activities,
    SUM(COALESCE(total_elite_habit, 0)) as total_habit_activities,
    COUNT(CASE WHEN total_journal = 0 AND total_elite_habit = 0 THEN 1 END) as inactive_users,
    COUNT(CASE WHEN (total_journal > 0 OR total_elite_habit > 0) THEN 1 END) as active_users
FROM profiles;

-- 8. Show users with highest activity for validation
SELECT 
    'Top active users' as info,
    display_name,
    total_journal,
    total_elite_habit,
    (COALESCE(total_journal, 0) + COALESCE(total_elite_habit, 0)) as total_activity,
    updated_at
FROM profiles
WHERE (total_journal > 0 OR total_elite_habit > 0)
ORDER BY (COALESCE(total_journal, 0) + COALESCE(total_elite_habit, 0)) DESC
LIMIT 10;