-- Fix reflections table RLS policies
-- Run these commands in Supabase SQL Editor

-- 1. First, check current RLS policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections';

-- 2. Drop any existing restrictive policies (if they exist)
-- Uncomment if you see policies that are too restrictive
-- DROP POLICY IF EXISTS "Enable read access for all users" ON reflections;
-- DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reflections;
-- DROP POLICY IF EXISTS "Users can insert their own reflections" ON reflections;

-- 3. Create proper RLS policies for reflections table
-- Allow authenticated users to insert reflections
CREATE POLICY "Allow authenticated users to insert reflections"
ON reflections
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to read their own reflections
CREATE POLICY "Users can read their own reflections"
ON reflections
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- Allow users to update their own reflections
CREATE POLICY "Users can update their own reflections"
ON reflections
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own reflections
CREATE POLICY "Users can delete their own reflections"
ON reflections
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);

-- 4. Ensure RLS is enabled
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;

-- 5. Check if the policies were created successfully
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections';

-- 6. Test insert with a simple policy (uncomment to test)
-- INSERT INTO reflections (user_id, question, reflection)
-- VALUES ('test-user-123', 'Test question', 'Test reflection');