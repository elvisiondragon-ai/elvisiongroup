-- AUTOMATIC COUNTER SYNC TRIGGERS
-- Ensures total_journal and total_elite_habit stay in sync with actual data

-- 1. Function to sync reflection counter
CREATE OR REPLACE FUNCTION sync_total_journal_counter()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profiles.total_journal to match actual reflection count
    IF TG_OP = 'INSERT' THEN
        -- Increment counter on insert
        UPDATE profiles 
        SET total_journal = COALESCE(total_journal, 0) + 1,
            updated_at = now()
        WHERE user_id = NEW.user_id::uuid;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement counter on delete
        UPDATE profiles 
        SET total_journal = GREATEST(0, COALESCE(total_journal, 1) - 1),
            updated_at = now()
        WHERE user_id = OLD.user_id::uuid;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Function to sync elite habit counter  
CREATE OR REPLACE FUNCTION sync_total_elite_habit_counter()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profiles.total_elite_habit to match actual habit count
    IF TG_OP = 'INSERT' THEN
        -- Increment counter on insert
        UPDATE profiles 
        SET total_elite_habit = COALESCE(total_elite_habit, 0) + 1,
            updated_at = now()
        WHERE user_id = NEW.user_id;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement counter on delete
        UPDATE profiles 
        SET total_elite_habit = GREATEST(0, COALESCE(total_elite_habit, 1) - 1),
            updated_at = now()
        WHERE user_id = OLD.user_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Create triggers on reflections table
DROP TRIGGER IF EXISTS trigger_sync_journal_counter ON reflections;
CREATE TRIGGER trigger_sync_journal_counter
    AFTER INSERT OR DELETE ON reflections
    FOR EACH ROW
    EXECUTE FUNCTION sync_total_journal_counter();

-- 4. Create triggers on elite_habits table
DROP TRIGGER IF EXISTS trigger_sync_habit_counter ON elite_habits;
CREATE TRIGGER trigger_sync_habit_counter
    AFTER INSERT OR DELETE ON elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION sync_total_elite_habit_counter();

-- 5. Test the triggers work
-- Insert test data (DO NOT RUN - just for reference)
/*
-- Test reflection trigger
INSERT INTO reflections (user_id, user_email, reflection) 
VALUES ('test-uuid', 'test@example.com', 'test reflection');

-- Test habit trigger  
INSERT INTO elite_habits (user_id, user_email, exercise_type, duration_minutes, date) 
VALUES ('test-uuid', 'test@example.com', 'Test Exercise', 10, 'Mon Sep 24 2025');
*/

-- 6. Verification: Check if counters match actual data
SELECT 
    'Trigger verification - reflections' as check_type,
    p.user_id,
    p.display_name,
    p.total_journal as profile_counter,
    COUNT(r.id) as actual_count,
    CASE 
        WHEN p.total_journal = COUNT(r.id) THEN '✅ Perfect match'
        WHEN ABS(p.total_journal - COUNT(r.id)) <= 1 THEN '⚠️ Minor diff (expected)'
        ELSE '❌ Major mismatch'
    END as sync_status
FROM profiles p
LEFT JOIN reflections r ON p.user_id = r.user_id::uuid
GROUP BY p.user_id, p.display_name, p.total_journal
HAVING COUNT(r.id) > 0 OR p.total_journal > 0
ORDER BY actual_count DESC
LIMIT 10;

-- 7. Verification: Check habit counters
SELECT 
    'Trigger verification - habits' as check_type,
    p.user_id,
    p.display_name,
    p.total_elite_habit as profile_counter,
    COUNT(eh.id) as actual_count,
    CASE 
        WHEN p.total_elite_habit = COUNT(eh.id) THEN '✅ Perfect match'
        WHEN ABS(p.total_elite_habit - COUNT(eh.id)) <= 1 THEN '⚠️ Minor diff (expected)'
        ELSE '❌ Major mismatch'
    END as sync_status
FROM profiles p
LEFT JOIN elite_habits eh ON p.user_id = eh.user_id
GROUP BY p.user_id, p.display_name, p.total_elite_habit
HAVING COUNT(eh.id) > 0 OR p.total_elite_habit > 0
ORDER BY actual_count DESC
LIMIT 10;

-- 8. One-time sync for any existing mismatches (run after triggers are created)
-- Sync reflection counters
UPDATE profiles 
SET total_journal = reflection_counts.actual_count,
    updated_at = now()
FROM (
    SELECT 
        r.user_id::uuid as user_id,
        COUNT(r.id) as actual_count
    FROM reflections r
    GROUP BY r.user_id::uuid
) AS reflection_counts
WHERE profiles.user_id = reflection_counts.user_id
  AND profiles.total_journal != reflection_counts.actual_count;

-- Sync habit counters
UPDATE profiles 
SET total_elite_habit = habit_counts.actual_count,
    updated_at = now()
FROM (
    SELECT 
        eh.user_id,
        COUNT(eh.id) as actual_count
    FROM elite_habits eh
    GROUP BY eh.user_id
) AS habit_counts
WHERE profiles.user_id = habit_counts.user_id
  AND profiles.total_elite_habit != habit_counts.actual_count;

-- 9. Final status report
SELECT 
    'COUNTER SYNC STATUS' as final_report,
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN total_journal >= 0 THEN 1 END) as profiles_with_journal_counter,
    COUNT(CASE WHEN total_elite_habit >= 0 THEN 1 END) as profiles_with_habit_counter,
    SUM(COALESCE(total_journal, 0)) as total_reflections_counted,
    SUM(COALESCE(total_elite_habit, 0)) as total_habits_counted,
    (SELECT COUNT(*) FROM reflections) as actual_reflections_in_db,
    (SELECT COUNT(*) FROM elite_habits) as actual_habits_in_db
FROM profiles;