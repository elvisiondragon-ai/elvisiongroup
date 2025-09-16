-- Final fix for reflections table - handle UUID type properly
-- Run this in Supabase SQL Editor

-- 1. First, drop the problematic duplicate policies
DROP POLICY IF EXISTS "Users can create their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can view their own reflections" ON reflections;

-- 2. Since user_id is UUID type, let's fix the remaining policies to use proper UUID comparison
DROP POLICY IF EXISTS "Users can read their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON reflections;

-- 3. Create new policies with proper UUID handling
-- Allow users to read their own reflections (UUID comparison)
CREATE POLICY "Users can read their own reflections"
ON reflections
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own reflections (UUID comparison)
CREATE POLICY "Users can update their own reflections"
ON reflections
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reflections (UUID comparison)
CREATE POLICY "Users can delete their own reflections"
ON reflections
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Keep the permissive INSERT policy (this one is correct)
-- "Allow authenticated users to insert reflections" should remain as is

-- 5. Verify the final policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections'
ORDER BY cmd, policyname;

-- 6. Test with a proper UUID (generate a random one for testing)
INSERT INTO reflections (user_id, question, reflection)
VALUES (gen_random_uuid(), 'Test question after UUID fix', 'Test reflection with proper UUID');

-- 7. Check if the test insert worked
SELECT COUNT(*) as total_reflections FROM reflections;

-- 8. Check the latest reflection
SELECT user_id, question, reflection, created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 1;

-- 9. Clean up the test record
DELETE FROM reflections WHERE question = 'Test question after UUID fix';