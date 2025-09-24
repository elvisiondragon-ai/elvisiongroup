-- Check daily XP limit for evira.rotorasiko37@gmail.com

-- 1. Check today's XP usage
SELECT 
    'TODAYS XP USAGE' as info,
    p.user_email,
    COALESCE(SUM(xt.xp_amount), 0) as daily_xp_earned,
    30 - COALESCE(SUM(xt.xp_amount), 0) as remaining_xp,
    CASE 
        WHEN COALESCE(SUM(xt.xp_amount), 0) >= 30 THEN '🔥 LIMIT REACHED'
        ELSE '📈 Can earn more'
    END as limit_status
FROM public.profiles p
LEFT JOIN public.xp_transactions xt ON p.user_id = xt.user_id 
    AND DATE(xt.created_at) = CURRENT_DATE
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
GROUP BY p.user_email;

-- 2. Check last 7 days XP per day
SELECT 
    'DAILY XP LAST 7 DAYS' as period,
    DATE(xt.created_at) as date,
    SUM(xt.xp_amount) as daily_xp,
    COUNT(*) as transactions,
    CASE 
        WHEN SUM(xt.xp_amount) >= 30 THEN '🔥 Hit Limit'
        WHEN SUM(xt.xp_amount) >= 20 THEN '⚠️ Near Limit'
        ELSE '✅ Under Limit'
    END as status
FROM public.xp_transactions xt
JOIN public.profiles p ON xt.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
    AND xt.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(xt.created_at)
ORDER BY DATE(xt.created_at) DESC;

-- 3. Test what happens if evira tries to earn XP now
SELECT 
    'XP LIMIT TEST' as test,
    p.user_email,
    COALESCE(SUM(xt.xp_amount), 0) as current_daily_xp,
    CASE 
        WHEN COALESCE(SUM(xt.xp_amount), 0) >= 30 THEN 'Would return: daily_limit_reached'
        ELSE 'Can still earn: ' || (30 - COALESCE(SUM(xt.xp_amount), 0)) || ' XP today'
    END as award_xp_result
FROM public.profiles p
LEFT JOIN public.xp_transactions xt ON p.user_id = xt.user_id 
    AND DATE(xt.created_at) = CURRENT_DATE
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
GROUP BY p.user_email;

-- 4. Show today's XP transactions in detail
SELECT 
    'TODAYS TRANSACTIONS' as detail,
    xt.xp_amount,
    xt.transaction_type,
    xt.reason,
    TO_CHAR(xt.created_at, 'HH24:MI:SS') as time,
    xt.created_at
FROM public.xp_transactions xt
JOIN public.profiles p ON xt.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
    AND DATE(xt.created_at) = CURRENT_DATE
ORDER BY xt.created_at;

-- 5. Simulate award_xp function behavior for evira
SELECT 
    'SIMULATE AWARD_XP' as simulation,
    'Current daily XP: ' || COALESCE(SUM(xt.xp_amount), 0) as current_status,
    'Remaining today: ' || GREATEST(0, 30 - COALESCE(SUM(xt.xp_amount), 0)) as remaining,
    CASE 
        WHEN COALESCE(SUM(xt.xp_amount), 0) >= 30 THEN 
            'award_xp would return: {"success": false, "reason": "daily_limit_reached"}'
        ELSE 
            'award_xp would award: ' || LEAST(10, 30 - COALESCE(SUM(xt.xp_amount), 0)) || ' XP (if requesting 10 XP)'
    END as function_behavior
FROM public.xp_transactions xt
JOIN public.profiles p ON xt.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
    AND DATE(xt.created_at) = CURRENT_DATE;