-- Debug Counter Mismatch Issue
-- Analyze why total_journal and total_elite_habit are incrementing by 2 instead of 1

-- 1. Check current state of counters vs actual records
SELECT 
    p.user_id,
    p.user_email,
    p.total_verses as audio_counter,
    p.total_journal as journal_counter, 
    p.total_elite_habit as elite_counter,
    
    -- Count actual records
    (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) as actual_reflections,
    (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) as actual_elite_habits,
    
    -- Check for mismatch
    CASE 
        WHEN p.total_journal != (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) 
        THEN 'JOURNAL_MISMATCH' 
        ELSE 'JOURNAL_OK' 
    END as journal_status,
    
    CASE 
        WHEN p.total_elite_habit != (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) 
        THEN 'ELITE_MISMATCH' 
        ELSE 'ELITE_OK' 
    END as elite_status
    
FROM profiles p
WHERE p.total_journal > 0 OR p.total_elite_habit > 0
ORDER BY p.updated_at DESC
LIMIT 10;

-- 2. Check for duplicate entries in same transaction timeframe (potential double-save)
SELECT 
    'REFLECTIONS_DUPLICATES' as table_name,
    user_id,
    user_email,
    reflection,
    created_at,
    COUNT(*) as duplicate_count
FROM reflections 
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY user_id, user_email, reflection, DATE_TRUNC('minute', created_at)
HAVING COUNT(*) > 1

UNION ALL

SELECT 
    'ELITE_HABITS_DUPLICATES' as table_name,
    user_id,
    user_email,
    exercise_type || ' - ' || duration_minutes::text || 'min' as content,
    created_at,
    COUNT(*) as duplicate_count
FROM elite_habits 
WHERE created_at >= NOW() - INTERVAL '1 day'
GROUP BY user_id, user_email, exercise_type, duration_minutes, DATE_TRUNC('minute', created_at)
HAVING COUNT(*) > 1;

-- 3. Check for race conditions - multiple updates to same user within seconds
SELECT 
    'PROFILE_RAPID_UPDATES' as issue_type,
    user_id,
    user_email,
    updated_at,
    total_journal,
    total_elite_habit,
    LAG(updated_at) OVER (PARTITION BY user_id ORDER BY updated_at) as prev_update,
    EXTRACT(EPOCH FROM (updated_at - LAG(updated_at) OVER (PARTITION BY user_id ORDER BY updated_at))) as seconds_between_updates
FROM profiles 
WHERE updated_at >= NOW() - INTERVAL '1 day'
  AND (total_journal > 0 OR total_elite_habit > 0)
ORDER BY user_id, updated_at DESC;

-- 4. Fix counters to match actual records (RUN MANUALLY ONLY IF CONFIRMED MISMATCH)
/*
UPDATE profiles SET 
    total_journal = (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text),
    total_elite_habit = (SELECT COUNT(*) FROM elite_habits WHERE elite_habits.user_id::text = profiles.user_id::text),
    updated_at = NOW()
WHERE 
    total_journal != (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text)
    OR total_elite_habit != (SELECT COUNT(*) FROM elite_habits WHERE elite_habits.user_id::text = profiles.user_id::text);
*/

-- 5. Monitor live counter updates (check this during testing)
SELECT 
    user_id,
    user_email,
    total_journal,
    total_elite_habit,
    updated_at
FROM profiles 
WHERE updated_at >= NOW() - INTERVAL '5 minutes'
ORDER BY updated_at DESC;