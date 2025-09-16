-- Test that RENATA can properly access and analyze the reflection data

-- 1. Sample what RENATA will see from the new reflections table
SELECT
    user_id,
    reflection,
    content,
    question,
    created_at
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC
LIMIT 10;

-- 2. Count reflections for analysis (RENATA needs at least 3)
SELECT
    user_id,
    COUNT(*) as total_reflections,
    COUNT(CASE WHEN reflection IS NOT NULL AND LENGTH(reflection) > 10 THEN 1 END) as valid_reflections
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
GROUP BY user_id;

-- 3. Analyze content patterns (simulate what RENATA will do)
SELECT
    user_id,
    string_agg(reflection, ' ') as combined_text,
    COUNT(*) as reflection_count
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
GROUP BY user_id;

-- 4. Check for spiritual patterns in the reflections
SELECT
    user_id,
    reflection,
    CASE
        WHEN reflection ILIKE '%juta%' THEN 'Financial Goals'
        WHEN reflection ILIKE '%uang%' THEN 'Money Concerns'
        WHEN reflection ILIKE '%dapat%' THEN 'Manifestation'
        WHEN reflection ILIKE '%lepas%' THEN 'Release/Letting Go'
        WHEN reflection ILIKE '%harus%' THEN 'Pressure/Must'
        ELSE 'Other'
    END as spiritual_theme,
    created_at
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC
LIMIT 20;

-- 5. Show RENATA exactly what it will receive (format simulation)
SELECT
    'user_id: ' || user_id as debug_info,
    'reflection_count: ' || COUNT(*) as count_info,
    'sample_content: ' || LEFT(string_agg(reflection, ' | '), 200) as sample_data
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
GROUP BY user_id;