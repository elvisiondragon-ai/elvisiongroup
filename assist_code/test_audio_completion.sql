-- Test that audio completion increment is working properly
-- This should show total_verses counting up even when XP limit is reached

-- Check current user profile stats
SELECT 
    user_id,
    display_name,
    total_verses,
    daily_xp_earned,
    experience_points,
    level
FROM profiles 
WHERE user_id = auth.uid();

-- Check XP transactions for today
SELECT 
    activity_type,
    xp_amount,
    reason,
    created_at::date as date,
    created_at::time as time
FROM xp_transactions 
WHERE user_id = auth.uid() 
    AND created_at::date = CURRENT_DATE
ORDER BY created_at DESC
LIMIT 20;

-- Check daily XP total for today
SELECT 
    SUM(xp_amount) as total_daily_xp,
    COUNT(*) as xp_activities_today
FROM xp_transactions 
WHERE user_id = auth.uid() 
    AND created_at::date = CURRENT_DATE;

-- Check current daily XP from profile
SELECT 
    daily_xp_earned,
    experience_points,
    (CASE 
        WHEN daily_xp_earned >= 30 THEN 'XP LIMIT REACHED'
        ELSE 'XP AVAILABLE'
    END) as xp_status
FROM profiles 
WHERE user_id = auth.uid();

-- This will help verify:
-- 1. total_verses increments even when daily_xp_earned = 30
-- 2. XP activities stop recording after 30 XP limit
-- 3. Counter tracking continues working properly