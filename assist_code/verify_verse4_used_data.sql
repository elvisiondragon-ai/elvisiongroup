-- Verify verse4_used data in profiles table
SELECT 
    user_id,
    user_email,
    display_name,
    verse4_used,
    level,
    created_at
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any NULL values in verse4_used
SELECT 
    COUNT(*) as total_users,
    COUNT(verse4_used) as users_with_verse4_used,
    COUNT(*) - COUNT(verse4_used) as users_with_null_verse4_used
FROM public.profiles;

-- Update any NULL verse4_used values to 0
UPDATE public.profiles 
SET verse4_used = 0 
WHERE verse4_used IS NULL;