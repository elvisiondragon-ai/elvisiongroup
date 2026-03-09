-- Check current verse4_used state for your user
SELECT 
    user_email,
    verse4_used,
    level,
    updated_at
FROM public.profiles 
WHERE user_email = 'elking.bali@gmail.com';

-- Quick increment test (run ONLY if you want to test)
-- UPDATE public.profiles 
-- SET verse4_used = verse4_used + 1 
-- WHERE user_email = 'elking.bali@gmail.com';

-- Reset to specific value for testing
-- UPDATE public.profiles 
-- SET verse4_used = 1 
-- WHERE user_email = 'elking.bali@gmail.com';