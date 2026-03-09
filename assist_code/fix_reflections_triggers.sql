-- Fix reflections table to have the same trigger setup as elite_habits
-- This will ensure journal counters sync properly to Profile.tsx

-- 1. Create triggers for reflections table (if they don't exist)
-- These should mirror the elite_habits triggers

-- Trigger for INSERT (when new reflection is added)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'reflections' 
    AND trigger_name = 'update_total_journal_count_insert'
  ) THEN
    CREATE TRIGGER update_total_journal_count_insert
      AFTER INSERT ON reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_total_journal_count();
  END IF;
END $$;

-- Trigger for DELETE (when reflection is deleted)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'reflections' 
    AND trigger_name = 'update_total_journal_count_delete'
  ) THEN
    CREATE TRIGGER update_total_journal_count_delete_trigger
      AFTER DELETE ON reflections
      FOR EACH ROW
      EXECUTE FUNCTION update_total_journal_count_delete();
  END IF;
END $$;

-- 2. Fix any existing counter mismatches
UPDATE profiles SET 
    total_journal = (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text)
WHERE 
    total_journal != (SELECT COUNT(*) FROM reflections WHERE reflections.user_id::text = profiles.user_id::text);

-- 3. Verify the fix
SELECT 
    'AFTER_FIX' as status,
    p.user_id,
    p.total_journal as profile_counter,
    (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) as actual_reflections,
    CASE 
        WHEN p.total_journal = (SELECT COUNT(*) FROM reflections r WHERE r.user_id::text = p.user_id::text) 
        THEN '✅ SYNCED' 
        ELSE '❌ STILL_BROKEN' 
    END as sync_status
FROM profiles p
WHERE p.total_journal > 0
ORDER BY p.updated_at DESC;