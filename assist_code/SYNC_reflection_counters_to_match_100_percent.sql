-- SYNC REFLECTION COUNTERS TO MATCH 100% WITH ACTUAL REFLECTIONS
-- Fix existing mismatches caused by rapid clicking before the frontend fix

-- 1. First show current mismatches for confirmation
SELECT 
    'BEFORE SYNC - Current mismatches' as status,
    COUNT(*) as total_users_with_journals,
    COUNT(CASE WHEN actual_count = profile_count THEN 1 END) as perfect_matches,
    COUNT(CASE WHEN actual_count != profile_count THEN 1 END) as mismatched_users,
    SUM(CASE WHEN actual_count > profile_count THEN (actual_count - profile_count) ELSE 0 END) as total_missing_increments
FROM (
    SELECT 
        p.user_id,
        p.total_journal as profile_count,
        COUNT(r.id) as actual_count
    FROM profiles p
    LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
    WHERE p.total_journal IS NOT NULL
    GROUP BY p.user_id, p.total_journal
) as counts;

-- 2. UPDATE: Sync total_journal to match actual reflection counts
UPDATE profiles 
SET total_journal = reflection_counts.actual_reflections,
    updated_at = now()
FROM (
    SELECT 
        r.user_id::uuid as user_id,
        COUNT(r.id) as actual_reflections
    FROM reflections r
    GROUP BY r.user_id::uuid
) AS reflection_counts
WHERE profiles.user_id = reflection_counts.user_id
  AND profiles.total_journal != reflection_counts.actual_reflections;

-- 3. Set total_journal to 0 for users with no reflections but non-zero counter
UPDATE profiles 
SET total_journal = 0,
    updated_at = now()
WHERE total_journal > 0 
  AND NOT EXISTS (
      SELECT 1 FROM reflections r 
      WHERE r.user_id::uuid = profiles.user_id
  );

-- 4. VERIFICATION: Ensure 100% perfect matches after sync
SELECT 
    'AFTER SYNC - Perfect match verification' as status,
    COUNT(*) as total_users_with_journals,
    COUNT(CASE WHEN actual_count = profile_count THEN 1 END) as perfect_matches,
    COUNT(CASE WHEN actual_count != profile_count THEN 1 END) as still_mismatched,
    CASE 
        WHEN COUNT(CASE WHEN actual_count != profile_count THEN 1 END) = 0 
        THEN '✅ 100% PERFECT SYNC ACHIEVED'
        ELSE '❌ Still have mismatches'
    END as sync_status
FROM (
    SELECT 
        p.user_id,
        p.total_journal as profile_count,
        COUNT(r.id) as actual_count
    FROM profiles p
    LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
    WHERE p.total_journal IS NOT NULL
    GROUP BY p.user_id, p.total_journal
) as counts;

-- 5. Show the specific user (Gustian) that was mismatched
SELECT 
    'GUSTIAN VERIFICATION' as check_type,
    p.user_id,
    p.display_name,
    p.total_journal as profile_counter_after_fix,
    COUNT(r.id) as actual_reflections,
    CASE 
        WHEN p.total_journal = COUNT(r.id) THEN '✅ FIXED - Perfect match'
        ELSE '❌ Still mismatched'
    END as fix_status
FROM profiles p
LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
WHERE p.display_name = 'Gustian'
GROUP BY p.user_id, p.display_name, p.total_journal;

-- 6. Final summary showing database integrity is now 100%
SELECT 
    'FINAL DATABASE INTEGRITY CHECK' as final_status,
    COUNT(*) as total_profiles_with_journals,
    COUNT(CASE WHEN actual_count = profile_count THEN 1 END) as perfect_matches,
    ROUND(
        (COUNT(CASE WHEN actual_count = profile_count THEN 1 END) * 100.0) 
        / COUNT(*), 2
    ) as match_percentage,
    CASE 
        WHEN COUNT(*) = COUNT(CASE WHEN actual_count = profile_count THEN 1 END)
        THEN '🎉 DATABASE 100% SYNCHRONIZED'
        ELSE '⚠️ Database integrity issue remains'
    END as integrity_status
FROM (
    SELECT 
        p.user_id,
        p.total_journal as profile_count,
        COUNT(r.id) as actual_count
    FROM profiles p
    LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
    WHERE p.total_journal IS NOT NULL
    GROUP BY p.user_id, p.total_journal
) as counts;