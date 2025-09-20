-- Reset verse4_used to 0 for specific user
UPDATE public.profiles 
SET verse4_used = 0 
WHERE user_email = 'elking.bali@gmail.com';

-- Or set to specific number for testing (e.g., 2 to test the final increment)
-- UPDATE public.profiles 
-- SET verse4_used = 2 
-- WHERE user_email = 'elking.bali@gmail.com';

-- Verify the change
SELECT 
    user_email,
    verse4_used,
    updated_at
FROM public.profiles 
WHERE user_email = 'elking.bali@gmail.com';