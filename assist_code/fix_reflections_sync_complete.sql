-- COMPLETE FIX: Create missing triggers AND fix existing counter mismatches
-- This will make reflections sync identical to elite_habits

-- STEP 1: Create missing triggers for reflections table
-- These mirror the elite_habits triggers exactly

-- Trigger for INSERT (when new reflection is added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'reflections' 
    AND trigger_name = 'sync_reflection_count_insert'
  ) THEN
    CREATE TRIGGER sync_reflection_count_insert
      AFTER INSERT ON reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_total_journal_count();
      
    RAISE NOTICE 'Created trigger: sync_reflection_count_insert';
  ELSE
    RAISE NOTICE 'Trigger sync_reflection_count_insert already exists';
  END IF;
END $$;

-- Trigger for DELETE (when reflection is deleted)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'reflections' 
    AND trigger_name = 'sync_reflection_count_delete'
  ) THEN
    CREATE TRIGGER sync_reflection_count_delete
      AFTER DELETE ON reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_total_journal_count_delete();
      
    RAISE NOTICE 'Created trigger: sync_reflection_count_delete';
  ELSE
    RAISE NOTICE 'Trigger sync_reflection_count_delete already exists';
  END IF;
END $$;

-- Optional: Trigger for UPDATE (for completeness, like elite_habits)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'reflections' 
    AND trigger_name = 'sync_reflection_count_update'
  ) THEN
    CREATE TRIGGER sync_reflection_count_update
      AFTER UPDATE ON reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_total_journal_count();
      
    RAISE NOTICE 'Created trigger: sync_reflection_count_update';
  ELSE
    RAISE NOTICE 'Trigger sync_reflection_count_update already exists';
  END IF;
END $$;

-- STEP 2: Fix ALL existing counter mismatches
-- Fix journal counters
UPDATE profiles SET 
    total_journal = (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text)
WHERE 
    total_journal != (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text);

-- Fix elite habit counters  
UPDATE profiles SET 
    total_elite_habit = (SELECT COUNT(*) FROM elite_habits WHERE elite_habits.user_id::text = profiles.user_id::text)
WHERE 
    total_elite_habit != (SELECT COUNT(*) FROM elite_habits WHERE elite_habits.user_id::text = profiles.user_id::text);

-- STEP 3: Verify the complete fix
SELECT 
    'AFTER_COMPLETE_FIX' as status,
    COUNT(*) as total_users,
    SUM(CASE WHEN journal_sync_status = '✅ JOURNAL_OK' THEN 1 ELSE 0 END) as journal_synced,
    SUM(CASE WHEN elite_sync_status = '✅ ELITE_OK' THEN 1 ELSE 0 END) as elite_synced
FROM (
    SELECT 
        p.user_id,
        CASE 
            WHEN p.total_journal = (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) 
            THEN '✅ JOURNAL_OK' 
            ELSE '❌ JOURNAL_MISMATCH' 
        END as journal_sync_status,
        
        CASE 
            WHEN p.total_elite_habit = (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) 
            THEN '✅ ELITE_OK' 
            ELSE '❌ ELITE_MISMATCH' 
        END as elite_sync_status
        
    FROM profiles p
    WHERE (p.total_journal > 0 OR p.total_elite_habit > 0)
) sync_check;

-- STEP 4: Show detailed results for verification
SELECT 
    p.user_id,
    p.user_email,
    p.total_journal as profile_journal_counter,
    p.total_elite_habit as profile_elite_counter,
    (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) as actual_reflections,
    (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) as actual_elite_habits,
    
    -- Check final sync status
    CASE 
        WHEN p.total_journal = (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) 
        THEN '✅ JOURNAL_SYNCED' 
        ELSE '❌ STILL_BROKEN' 
    END as journal_final_status,
    
    CASE 
        WHEN p.total_elite_habit = (SELECT COUNT(*) FROM elite_habits e WHERE e.user_id::text = p.user_id::text) 
        THEN '✅ ELITE_SYNCED' 
        ELSE '❌ STILL_BROKEN' 
    END as elite_final_status
    
FROM profiles p
WHERE (p.total_journal > 0 OR p.total_elite_habit > 0)
ORDER BY p.updated_at DESC
LIMIT 20;

-- STEP 5: Verify triggers were created
SELECT 
    'REFLECTIONS' as table_name,
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY t.trigger_name;