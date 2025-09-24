-- Check user activity and XP completion for evira.rotorasiko37@gmail.com

-- 1. Get user profile information
SELECT 
    'USER PROFILE' as info,
    user_email,
    level,
    experience_points,
    total_verses,
    total_journal,
    total_elite_habit,
    streak_days,
    daily_xp_earned,
    created_at,
    last_login_date
FROM public.profiles 
WHERE user_email = 'evira.rotorasiko37@gmail.com';

-- 2. Get user_id for detailed queries
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT user_id INTO target_user_id 
    FROM public.profiles 
    WHERE user_email = 'evira.rotorasiko37@gmail.com';
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User evira.rotorasiko37@gmail.com not found';
    ELSE
        RAISE NOTICE 'Found user ID: %', target_user_id;
    END IF;
END $$;

-- 3. Check all user activities (XP earning activities)
SELECT 
    'USER ACTIVITIES' as category,
    ua.activity_type,
    ua.xp_earned,
    ua.metadata,
    ua.created_at,
    DATE(ua.created_at) as activity_date
FROM public.user_activities ua
JOIN public.profiles p ON ua.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
ORDER BY ua.created_at DESC;

-- 4. Check all XP transactions
SELECT 
    'XP TRANSACTIONS' as category,
    xt.xp_amount,
    xt.transaction_type,
    xt.reason,
    xt.created_at,
    DATE(xt.created_at) as transaction_date
FROM public.xp_transactions xt
JOIN public.profiles p ON xt.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
ORDER BY xt.created_at DESC;

-- 5. Daily XP summary
SELECT 
    'DAILY XP SUMMARY' as summary,
    DATE(xt.created_at) as date,
    SUM(xt.xp_amount) as daily_xp,
    COUNT(*) as daily_activities,
    CASE 
        WHEN SUM(xt.xp_amount) >= 30 THEN '🔥 Hit Daily Limit'
        ELSE '📈 Can earn more'
    END as daily_status
FROM public.xp_transactions xt
JOIN public.profiles p ON xt.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
GROUP BY DATE(xt.created_at)
ORDER BY DATE(xt.created_at) DESC
LIMIT 10;

-- 6. Activity type breakdown
SELECT 
    'ACTIVITY BREAKDOWN' as breakdown,
    ua.activity_type,
    COUNT(*) as count,
    SUM(ua.xp_earned) as total_xp,
    AVG(ua.xp_earned) as avg_xp,
    MIN(ua.created_at) as first_activity,
    MAX(ua.created_at) as last_activity
FROM public.user_activities ua
JOIN public.profiles p ON ua.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
GROUP BY ua.activity_type
ORDER BY total_xp DESC;

-- 7. Recent activity (last 7 days)
SELECT 
    'RECENT ACTIVITY (7 days)' as recent,
    DATE(ua.created_at) as date,
    ua.activity_type,
    ua.xp_earned,
    ua.metadata,
    TO_CHAR(ua.created_at, 'HH24:MI:SS') as time
FROM public.user_activities ua
JOIN public.profiles p ON ua.user_id = p.user_id
WHERE p.user_email = 'evira.rotorasiko37@gmail.com'
AND ua.created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY ua.created_at DESC;