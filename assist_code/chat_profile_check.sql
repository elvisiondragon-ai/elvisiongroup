-- Check profiles table structure and data for Chat component
-- Check what columns exist in profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check existing data for display_name and achievements
SELECT user_id, display_name, achievements, user_email 
FROM profiles 
LIMIT 10;

-- Check if achievements column exists and its structure
SELECT user_id, achievements 
FROM profiles 
WHERE achievements IS NOT NULL 
LIMIT 5;