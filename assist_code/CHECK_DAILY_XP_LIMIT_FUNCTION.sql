-- Check the function that limits XP to 30 per day
-- Find where daily limit is implemented

-- 1. Find the award_xp function that contains daily limit logic
SELECT 
    'AWARD_XP FUNCTION WITH DAILY LIMIT' as info,
    pg_get_functiondef(p.oid) as function_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'award_xp';

-- 2. Check current daily XP usage for today's users
SELECT 
    'TODAYS DAILY XP USAGE' as info,
    COUNT(*) as active_users_today,
    AVG(daily_xp_sum) as avg_daily_xp,
    MAX(daily_xp_sum) as max_daily_xp,
    COUNT(CASE WHEN daily_xp_sum >= 30 THEN 1 END) as users_at_limit
FROM (
    SELECT 
        user_id,
        COALESCE(SUM(xp_amount), 0) as daily_xp_sum
    FROM public.xp_transactions
    WHERE DATE(created_at) = CURRENT_DATE
    GROUP BY user_id
) daily_stats;

-- 3. Show users who hit 30 XP limit today
SELECT 
    p.user_email,
    p.level,
    p.experience_points,
    COALESCE(SUM(xt.xp_amount), 0) as daily_xp_earned,
    COUNT(xt.id) as daily_transactions
FROM public.profiles p
LEFT JOIN public.xp_transactions xt ON p.user_id = xt.user_id 
    AND DATE(xt.created_at) = CURRENT_DATE
GROUP BY p.user_id, p.user_email, p.level, p.experience_points
HAVING COALESCE(SUM(xt.xp_amount), 0) >= 30
ORDER BY daily_xp_earned DESC;

-- 4. Check the daily limit logic in award_xp function (lines 49-69)
SELECT 
    'DAILY LIMIT LOGIC' as info,
    'The award_xp function checks:
    - Gets daily XP: SUM(xp_amount) FROM xp_transactions WHERE DATE(created_at) = CURRENT_DATE
    - Calculates remaining: 30 - daily_xp_earned  
    - If remaining <= 0: returns early with daily_limit_reached
    - Caps actual XP award: LEAST(p_xp_amount, remaining_xp)
    - Updates daily_xp_earned in profiles table
    ' as explanation;

-- 5. Test what happens when user tries to earn XP at limit
SELECT 
    'SIMULATE XP AWARD AT LIMIT' as test,
    CASE 
        WHEN 30 - 30 <= 0 THEN 'Would return: daily_limit_reached = true'
        ELSE 'Would award: ' || LEAST(5, 30 - 25) || ' XP'
    END as result;