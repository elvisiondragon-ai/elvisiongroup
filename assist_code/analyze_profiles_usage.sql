-- Check current profiles table schema
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check which columns have data vs empty/null
SELECT
    'id' as column_name,
    COUNT(*) as total_rows,
    COUNT(id) as non_null_count,
    COUNT(*) - COUNT(id) as null_count
FROM profiles
UNION ALL
SELECT
    'user_id',
    COUNT(*),
    COUNT(user_id),
    COUNT(*) - COUNT(user_id)
FROM profiles
UNION ALL
SELECT
    'display_name',
    COUNT(*),
    COUNT(display_name),
    COUNT(*) - COUNT(display_name)
FROM profiles
UNION ALL
SELECT
    'level',
    COUNT(*),
    COUNT(level),
    COUNT(*) - COUNT(level)
FROM profiles
UNION ALL
SELECT
    'experience_points',
    COUNT(*),
    COUNT(experience_points),
    COUNT(*) - COUNT(experience_points)
FROM profiles
UNION ALL
SELECT
    'streak_days',
    COUNT(*),
    COUNT(streak_days),
    COUNT(*) - COUNT(streak_days)
FROM profiles
UNION ALL
SELECT
    'total_sessions',
    COUNT(*),
    COUNT(total_sessions),
    COUNT(*) - COUNT(total_sessions)
FROM profiles
UNION ALL
SELECT
    'achievements',
    COUNT(*),
    COUNT(achievements),
    COUNT(*) - COUNT(achievements)
FROM profiles
UNION ALL
SELECT
    'avatar_url',
    COUNT(*),
    COUNT(avatar_url),
    COUNT(*) - COUNT(avatar_url)
FROM profiles
UNION ALL
SELECT
    'preferred_language',
    COUNT(*),
    COUNT(preferred_language),
    COUNT(*) - COUNT(preferred_language)
FROM profiles
UNION ALL
SELECT
    'is_premium',
    COUNT(*),
    COUNT(is_premium),
    COUNT(*) - COUNT(is_premium)
FROM profiles
UNION ALL
SELECT
    'premium_expires_at',
    COUNT(*),
    COUNT(premium_expires_at),
    COUNT(*) - COUNT(premium_expires_at)
FROM profiles
UNION ALL
SELECT
    'last_login_date',
    COUNT(*),
    COUNT(last_login_date),
    COUNT(*) - COUNT(last_login_date)
FROM profiles
UNION ALL
SELECT
    'last_streak_bonus_date',
    COUNT(*),
    COUNT(last_streak_bonus_date),
    COUNT(*) - COUNT(last_streak_bonus_date)
FROM profiles
UNION ALL
SELECT
    'last_notification_time',
    COUNT(*),
    COUNT(last_notification_time),
    COUNT(*) - COUNT(last_notification_time)
FROM profiles
UNION ALL
SELECT
    'total_verses',
    COUNT(*),
    COUNT(total_verses),
    COUNT(*) - COUNT(total_verses)
FROM profiles
UNION ALL
SELECT
    'total_journal',
    COUNT(*),
    COUNT(total_journal),
    COUNT(*) - COUNT(total_journal)
FROM profiles
UNION ALL
SELECT
    'daily_xp_earned',
    COUNT(*),
    COUNT(daily_xp_earned),
    COUNT(*) - COUNT(daily_xp_earned)
FROM profiles
UNION ALL
SELECT
    'app_version',
    COUNT(*),
    COUNT(app_version),
    COUNT(*) - COUNT(app_version)
FROM profiles
UNION ALL
SELECT
    'cache_cleared_at',
    COUNT(*),
    COUNT(cache_cleared_at),
    COUNT(*) - COUNT(cache_cleared_at)
FROM profiles
UNION ALL
SELECT
    'user_email',
    COUNT(*),
    COUNT(user_email),
    COUNT(*) - COUNT(user_email)
FROM profiles
UNION ALL
SELECT
    'total_elite_habit',
    COUNT(*),
    COUNT(total_elite_habit),
    COUNT(*) - COUNT(total_elite_habit)
FROM profiles
UNION ALL
SELECT
    'analytics_used',
    COUNT(*),
    COUNT(analytics_used),
    COUNT(*) - COUNT(analytics_used)
FROM profiles
UNION ALL
SELECT
    'last_analytics_date',
    COUNT(*),
    COUNT(last_analytics_date),
    COUNT(*) - COUNT(last_analytics_date)
FROM profiles;

-- Check for columns with only default values (potentially unused)
SELECT
    'Columns with all default/zero values:' as analysis;

-- Check specific patterns that indicate unused columns
SELECT
    COUNT(*) as total_users,
    COUNT(CASE WHEN total_sessions > 0 THEN 1 END) as users_with_sessions,
    COUNT(CASE WHEN total_verses > 0 THEN 1 END) as users_with_verses,
    COUNT(CASE WHEN total_journal > 0 THEN 1 END) as users_with_journal,
    COUNT(CASE WHEN total_elite_habit > 0 THEN 1 END) as users_with_elite_habit,
    COUNT(CASE WHEN analytics_used > 0 THEN 1 END) as users_with_analytics,
    COUNT(CASE WHEN daily_xp_earned > 0 THEN 1 END) as users_with_daily_xp,
    COUNT(CASE WHEN avatar_url IS NOT NULL THEN 1 END) as users_with_avatar,
    COUNT(CASE WHEN last_login_date IS NOT NULL THEN 1 END) as users_with_login_date,
    COUNT(CASE WHEN cache_cleared_at IS NOT NULL THEN 1 END) as users_with_cache_cleared
FROM profiles;