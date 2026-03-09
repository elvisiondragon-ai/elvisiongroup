-- Test the new reflections table to ensure everything works

-- 1. Check current data
SELECT COUNT(*) as total_reflections FROM reflections;

-- 2. Show recent reflections to verify data integrity
SELECT
    user_id,
    user_email,
    LEFT(reflection, 60) as reflection_preview,
    LEFT(content, 60) as content_preview,
    created_at
FROM reflections
ORDER BY created_at DESC
LIMIT 10;

-- 3. Test insert (simulating what the app will do)
INSERT INTO reflections (user_id, user_email, question, reflection, content)
VALUES (
    'test-user-final',
    'test@final.com',
    'Apa yang paling ingin kamu lepaskan hari ini, agar hatimu bisa ringan kembali?',
    'Testing the final clean table - should work perfectly',
    'Testing the final clean table - should work perfectly'
);

-- 4. Test select (simulating app reading data)
SELECT * FROM reflections
WHERE user_id = 'test-user-final'
ORDER BY created_at DESC;

-- 5. Test RENATA-style data access
SELECT
    user_id,
    reflection,
    content,
    created_at
FROM reflections
WHERE user_id = 'test-user-final';

-- 6. Verify no RLS blocking (should return data)
SELECT COUNT(*) as accessible_reflections FROM reflections;

-- 7. Clean up test
DELETE FROM reflections WHERE user_id = 'test-user-final';

-- 8. Final verification - check if the problematic user's data is now accessible
SELECT
    user_id,
    COUNT(*) as reflection_count,
    MAX(created_at) as latest_reflection
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
GROUP BY user_id;