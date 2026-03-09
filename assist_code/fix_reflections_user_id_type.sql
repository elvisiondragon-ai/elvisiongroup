-- FIX: Convert reflections.user_id from TEXT to UUID to match other tables
-- This is the root cause of "operator does not exist: uuid = text" error

-- STEP 1: First, let's see what TEXT values are currently in reflections.user_id
SELECT 
    user_id,
    user_email,
    LENGTH(user_id) as user_id_length,
    user_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' as is_valid_uuid_format
FROM reflections
LIMIT 10;

-- STEP 2: Drop triggers temporarily to avoid conflicts during schema change
DROP TRIGGER IF EXISTS sync_reflection_count_insert ON reflections;
DROP TRIGGER IF EXISTS sync_reflection_count_delete ON reflections;  
DROP TRIGGER IF EXISTS sync_reflection_count_update ON reflections;

-- STEP 3: Convert the column type from TEXT to UUID
-- This will only work if all existing user_id values are valid UUID strings
ALTER TABLE reflections 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- STEP 4: Recreate the triggers with proper UUID functions
CREATE TRIGGER sync_reflection_count_insert
  AFTER INSERT ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_total_journal_count();

CREATE TRIGGER sync_reflection_count_delete
  AFTER DELETE ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_total_journal_count_delete();

CREATE TRIGGER sync_reflection_count_update
  AFTER UPDATE ON reflections
  FOR EACH ROW
  EXECUTE FUNCTION update_total_journal_count();

-- STEP 5: Verify the fix
SELECT 
    'AFTER_TYPE_FIX' as status,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('profiles', 'reflections', 'elite_habits') 
  AND column_name = 'user_id'
ORDER BY table_name;

-- STEP 6: Test that triggers work now
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY t.trigger_name;

-- STEP 7: Fix any counter mismatches now that types align
UPDATE profiles SET 
    total_journal = (SELECT COUNT(*) FROM reflections WHERE reflections.user_id = profiles.user_id)
WHERE 
    total_journal != (SELECT COUNT(*) FROM reflections WHERE reflections.user_id = profiles.user_id);