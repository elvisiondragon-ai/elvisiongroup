-- Check if session.user contains profile data to avoid loading screen

-- 1. Check what's in auth.users table (what session.user contains)
SELECT 
    id,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'dragon@yahoo.com';

-- 2. Check what's in profiles table (what UserProfileContext loads)
SELECT 
    user_id,
    display_name,
    level,
    experience_points,
    streak_days,
    achievements,
    total_verses,
    total_journal,
    total_elite_habit,
    avatar_url,
    created_at
FROM profiles 
WHERE user_email = 'dragon@yahoo.com';

-- 3. Compare: Does auth.users contain ANY profile data?
-- If session.user has all needed data, Profile.tsx doesn't need to wait for UserProfileContext