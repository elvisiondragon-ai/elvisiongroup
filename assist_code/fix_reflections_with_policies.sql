-- Fix reflections user_id type by handling RLS policies that depend on it
-- From schemareflect.sql, we know these policies exist on reflections table

-- STEP 1: Drop all RLS policies on reflections table that depend on user_id
DROP POLICY IF EXISTS "Users can delete own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can insert own reflections" ON reflections;  
DROP POLICY IF EXISTS "Users can select own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can update own reflections" ON reflections;

-- STEP 2: Drop triggers temporarily to avoid conflicts
DROP TRIGGER IF EXISTS sync_reflection_count_insert ON reflections;
DROP TRIGGER IF EXISTS sync_reflection_count_delete ON reflections;  
DROP TRIGGER IF EXISTS sync_reflection_count_update ON reflections;

-- STEP 3: Now we can safely convert the column type
ALTER TABLE reflections 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- STEP 4: Recreate all the RLS policies with proper UUID comparison
-- These policies mirror what was shown in schemareflect.sql

-- Policy: Users can delete own reflections  
CREATE POLICY "Users can delete own reflections" ON reflections
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Policy: Users can insert own reflections
CREATE POLICY "Users can insert own reflections" ON reflections
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can select own reflections  
CREATE POLICY "Users can select own reflections" ON reflections
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can update own reflections
CREATE POLICY "Users can update own reflections" ON reflections
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- STEP 5: Recreate the triggers with proper UUID functions
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

-- STEP 6: Verify everything is properly set up
SELECT 
    'COLUMN_TYPES' as check_type,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('profiles', 'reflections', 'elite_habits') 
  AND column_name = 'user_id'
UNION ALL
SELECT 
    'POLICIES' as check_type,
    tablename as table_name,
    policyname as column_name,
    cmd as data_type
FROM pg_policies 
WHERE tablename = 'reflections'
UNION ALL
SELECT 
    'TRIGGERS' as check_type,
    event_object_table as table_name,
    trigger_name as column_name,
    event_manipulation as data_type
FROM information_schema.triggers
WHERE event_object_table = 'reflections'
ORDER BY check_type, table_name;

-- STEP 7: Fix counter sync now that types match
UPDATE profiles SET 
    total_journal = (SELECT COUNT(*) FROM reflections WHERE reflections.user_id = profiles.user_id)
WHERE 
    total_journal != (SELECT COUNT(*) FROM reflections WHERE reflections.user_id = profiles.user_id);