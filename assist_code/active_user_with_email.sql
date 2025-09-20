-- ACTIVE users TODAY with email (last sign in today)
SELECT 
    email,
    last_sign_in_at AT TIME ZONE 'Asia/Jakarta' as last_sign_in_jakarta
FROM auth.users 
WHERE DATE(last_sign_in_at AT TIME ZONE 'Asia/Jakarta') = CURRENT_DATE
ORDER BY last_sign_in_at DESC;

-- ACTIVE users in LAST 24 HOURS with email (last sign in within 24h)
SELECT 
    email,
    last_sign_in_at AT TIME ZONE 'Asia/Jakarta' as last_sign_in_jakarta
FROM auth.users 
WHERE last_sign_in_at >= NOW() - INTERVAL '24 hours'
ORDER BY last_sign_in_at DESC;