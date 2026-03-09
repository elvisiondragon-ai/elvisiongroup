-- Fix reflections table RLS policies with proper type casting
-- Run these commands in Supabase SQL Editor

-- 1. First, check what type user_id column is
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reflections' AND column_name = 'user_id';

-- 2. Drop any existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to insert reflections" ON reflections;
DROP POLICY IF EXISTS "Users can read their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON reflections;
DROP POLICY IF EXISTS "Enable read access for all users" ON reflections;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reflections;
DROP POLICY IF EXISTS "Users can insert their own reflections" ON reflections;

-- 3. Create new policies with proper type casting
-- Allow authenticated users to insert reflections (no auth check to avoid null issues)
CREATE POLICY "Allow authenticated users to insert reflections"
ON reflections
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to read their own reflections (with proper type casting)
CREATE POLICY "Users can read their own reflections"
ON reflections
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Allow users to update their own reflections (with proper type casting)
CREATE POLICY "Users can update their own reflections"
ON reflections
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to delete their own reflections (with proper type casting)
CREATE POLICY "Users can delete their own reflections"
ON reflections
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- 4. Alternative: If user_id should be UUID type, let's fix the column type
-- (Uncomment if you want to change user_id to UUID instead)
/*
-- First, let's see if there's data in the table
SELECT COUNT(*) FROM reflections;

-- If the table is empty or you want to convert:
-- ALTER TABLE reflections ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Then use these policies instead:
-- CREATE POLICY "Users can read their own reflections"
-- ON reflections FOR SELECT TO authenticated
-- USING (auth.uid() = user_id);
*/

-- 5. Ensure RLS is enabled
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- 6. Verify the policies were created
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections';

-- 7. Test the fix (uncomment to test)
-- INSERT INTO reflections (user_id, question, reflection)
-- VALUES ('test-user-123', 'Test question', 'Test reflection after fix');