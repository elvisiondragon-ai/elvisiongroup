-- Remove duplicate and conflicting RLS policies
-- Run this in Supabase SQL Editor

-- 1. Drop the problematic duplicate policies
DROP POLICY IF EXISTS "Users can create their own reflections" ON reflections;
DROP POLICY IF EXISTS "Users can view their own reflections" ON reflections;

-- 2. Keep only the working policies:
-- - "Allow authenticated users to insert reflections" (INSERT with true)
-- - "Users can read their own reflections" (SELECT with proper casting)
-- - "Users can update their own reflections" (UPDATE with proper casting)
-- - "Users can delete their own reflections" (DELETE with proper casting)

-- 3. Verify only the correct policies remain
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'reflections'
ORDER BY cmd, policyname;

-- 4. Test that reflections can now be inserted
-- (This should work now without the conflicting policy)
INSERT INTO reflections (user_id, question, reflection)
VALUES ('test-user-' || extract(epoch from now()), 'Test question after cleanup', 'Test reflection - should work now');

-- 5. Check if the test insert worked
SELECT COUNT(*) as total_reflections FROM reflections;

-- 6. Clean up the test record if needed
-- DELETE FROM reflections WHERE question = 'Test question after cleanup';