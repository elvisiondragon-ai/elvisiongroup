-- VALIDATION: Check reflection vs profile counter mismatch
-- Following rule.txt: Find validation for rapid click issue

-- 1. Check users with counter mismatch (reflections vs total_journal)
SELECT 
    'MISMATCH DETECTION' as check_type,
    p.user_id,
    p.display_name,
    p.total_journal as profile_counter,
    COUNT(r.id) as actual_reflections,
    COUNT(r.id) - p.total_journal as mismatch_amount,
    CASE 
        WHEN COUNT(r.id) = p.total_journal THEN '✅ Perfect match'
        WHEN COUNT(r.id) > p.total_journal THEN '❌ More reflections than counter'
        WHEN COUNT(r.id) < p.total_journal THEN '⚠️ Counter higher than reflections'
    END as mismatch_status
FROM profiles p
LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
WHERE p.total_journal IS NOT NULL
GROUP BY p.user_id, p.display_name, p.total_journal
HAVING COUNT(r.id) != p.total_journal
ORDER BY (COUNT(r.id) - p.total_journal) DESC
LIMIT 10;

-- 2. Check for rapid duplicate reflections (same user, same minute)
SELECT 
    'RAPID CLICK DUPLICATES' as check_type,
    r.user_id,
    r.user_email,
    DATE_TRUNC('minute', r.created_at) as minute_group,
    COUNT(*) as reflections_per_minute,
    STRING_AGG(r.reflection, ' | ') as duplicate_content
FROM reflections r
GROUP BY r.user_id, r.user_email, DATE_TRUNC('minute', r.created_at)
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC, DATE_TRUNC('minute', r.created_at) DESC
LIMIT 10;

-- 3. Show recent reflection activity to identify patterns
SELECT 
    'RECENT REFLECTION PATTERNS' as info,
    r.user_id,
    r.user_email,
    r.created_at,
    LENGTH(r.reflection) as content_length,
    LAG(r.created_at) OVER (PARTITION BY r.user_id ORDER BY r.created_at) as previous_reflection_time,
    EXTRACT(EPOCH FROM (r.created_at - LAG(r.created_at) OVER (PARTITION BY r.user_id ORDER BY r.created_at))) as seconds_between_reflections
FROM reflections r
WHERE r.created_at > NOW() - INTERVAL '24 hours'
ORDER BY r.user_id, r.created_at DESC
LIMIT 15;

-- 4. Summary of mismatch severity
SELECT 
    'MISMATCH SUMMARY' as summary,
    COUNT(*) as total_users_with_journals,
    COUNT(CASE WHEN actual_count = profile_count THEN 1 END) as perfect_matches,
    COUNT(CASE WHEN actual_count > profile_count THEN 1 END) as under_counted_profiles,
    COUNT(CASE WHEN actual_count < profile_count THEN 1 END) as over_counted_profiles,
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