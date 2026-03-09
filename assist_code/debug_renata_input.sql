-- Debug what RENATA is actually receiving from the reflections
-- Let's see the EXACT data being sent to ChatGPT

-- 1. Show exactly what reflections contain for the user
SELECT
    user_id,
    reflection,
    LENGTH(reflection) as char_count,
    created_at
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC
LIMIT 20;

-- 2. Count financial keywords that should be obvious
SELECT
    user_id,
    COUNT(CASE WHEN reflection ILIKE '%juta%' THEN 1 END) as juta_mentions,
    COUNT(CASE WHEN reflection ILIKE '%uang%' THEN 1 END) as uang_mentions,
    COUNT(CASE WHEN reflection ILIKE '%harus%' THEN 1 END) as harus_mentions,
    COUNT(CASE WHEN reflection ILIKE '%dapat%' THEN 1 END) as dapat_mentions,
    COUNT(*) as total_reflections
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
GROUP BY user_id;

-- 3. Show the combined text that would be sent to ChatGPT
SELECT
    string_agg(reflection, E'\n---\n' ORDER BY created_at DESC) as combined_reflections_text
FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5';

-- 4. Verify if reflections are being fetched properly by the API call
SELECT COUNT(*) as total_user_reflections FROM reflections WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5';

-- 5. Show most recent reflection content to verify data quality
SELECT reflection FROM reflections
WHERE user_id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5'
ORDER BY created_at DESC
LIMIT 5;