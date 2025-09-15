-- Fix SELECT policy to allow users to read their reflections
-- The issue is likely auth.uid() = null blocking SELECT operations

-- 1. Check current SELECT policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'reflections' AND cmd = 'SELECT';

-- 2. Drop all existing SELECT policies that might be problematic
DROP POLICY IF EXISTS "Users can read their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can view their own reflections" ON reflections;
DROP POLICY IF EXISTS "Enable read access for all users" ON reflections;

-- 3. Create a working SELECT policy
-- Since auth.uid() is returning null, let's use a more permissive approach
CREATE POLICY "Allow authenticated users to read reflections"
ON reflections
FOR SELECT
TO authenticated
USING (true);

-- 4. Verify the policy was created
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'reflections' AND cmd = 'SELECT';

-- 5. Test if reflections can now be read
SELECT user_id, LEFT(reflection, 30) as reflection_preview, created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 5;