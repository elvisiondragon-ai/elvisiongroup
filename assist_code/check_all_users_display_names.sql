-- Check if ALL users are having the same issue (email split instead of display_name)

-- 1. Compare profiles vs recent chat messages for all users
SELECT 
    p.user_email,
    p.display_name as profile_name,
    cm.user_name as chat_stored_name,
    cm.created_at,
    CASE 
        WHEN cm.user_name = p.display_name THEN 'CORRECT'
        WHEN cm.user_name = SPLIT_PART(p.user_email, '@', 1) THEN 'EMAIL SPLIT'
        ELSE 'OTHER'
    END as name_source
FROM profiles p
JOIN chat_messages cm ON p.user_id = cm.user_id
WHERE cm.created_at >= CURRENT_DATE - INTERVAL '2 days'
ORDER BY cm.created_at DESC
LIMIT 20;

-- This will show if the frontend is systematically using email split for everyone
-- or if it's only specific users