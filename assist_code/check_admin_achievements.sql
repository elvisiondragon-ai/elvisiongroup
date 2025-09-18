-- ===========================================
-- CHECK ADMIN ACHIEVEMENTS
-- ===========================================

-- Check current admin achievements
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    'Current admin users' as status
FROM profiles
WHERE achievements::text ILIKE '%admin%'
ORDER BY created_at DESC;