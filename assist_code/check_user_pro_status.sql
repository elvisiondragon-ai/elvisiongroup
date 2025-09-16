-- Check ALL sources that might be giving srcindocs@gmail.com Pro access

-- 1. Check pro_subscriptions table
SELECT 'pro_subscriptions' as table_name, * 
FROM public.pro_subscriptions 
WHERE user_email = 'srcindocs@gmail.com';

-- 2. Check days_remaining table
SELECT 'days_remaining' as table_name, * 
FROM public.days_remaining 
WHERE user_email = 'srcindocs@gmail.com';

-- 3. Check waiting_payment table
SELECT 'waiting_payment' as table_name, * 
FROM public.waiting_payment 
WHERE user_email = 'srcindocs@gmail.com';

-- 4. Check profiles table for any pro flags
SELECT 'profiles' as table_name, user_id, display_name, created_at
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'srcindocs@gmail.com';

-- 5. Check if there's a check_unified_pro_status function and what it returns
SELECT public.check_unified_pro_status(u.id) as pro_check_result
FROM auth.users u
WHERE u.email = 'srcindocs@gmail.com';

-- 6. Check all users with that email (in case of duplicates)
SELECT 'auth_users' as table_name, id, email, created_at
FROM auth.users 
WHERE email = 'srcindocs@gmail.com';