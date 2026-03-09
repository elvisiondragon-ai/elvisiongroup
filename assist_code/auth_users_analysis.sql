-- AUTH USERS TABLE ANALYSIS
-- Based on actual auth.users schema structure

-- 1. CHECK RECENT USER ACTIVITY PATTERNS
SELECT 
    DATE(last_sign_in_at) as sign_in_date,
    COUNT(*) as users_signed_in,
    COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '1 hour' THEN 1 END) as recent_signins
FROM auth.users 
WHERE last_sign_in_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE(last_sign_in_at)
ORDER BY sign_in_date DESC;

-- 2. CHECK USER CREATION VS SIGN-IN PATTERNS (NEW REGISTRATIONS)
SELECT 
    DATE(created_at) as creation_date,
    COUNT(*) as new_users,
    COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as activated_users,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE(created_at)
ORDER BY creation_date DESC;

-- 3. CHECK FOR REPEATED SIGN-IN ATTEMPTS (TIMESTAMP ANALYSIS)
-- Users with very recent sign-ins that might indicate excessive auth calls
SELECT 
    id as user_id,
    email,
    last_sign_in_at,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - last_sign_in_at))/60 as minutes_since_last_signin,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'UNCONFIRMED'
        WHEN deleted_at IS NOT NULL THEN 'DELETED'
        WHEN banned_until IS NOT NULL THEN 'BANNED'
        ELSE 'ACTIVE'
    END as user_status
FROM auth.users 
WHERE last_sign_in_at >= NOW() - INTERVAL '1 hour'
ORDER BY last_sign_in_at DESC
LIMIT 20;

-- 4. CHECK USER CONFIRMATION STATUS
SELECT 
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'UNCONFIRMED'
        WHEN deleted_at IS NOT NULL THEN 'DELETED'
        WHEN banned_until IS NOT NULL THEN 'BANNED'
        WHEN is_anonymous = true THEN 'ANONYMOUS'
        ELSE 'CONFIRMED'
    END as status,
    COUNT(*) as count,
    COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_activity
FROM auth.users
GROUP BY 
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'UNCONFIRMED'
        WHEN deleted_at IS NOT NULL THEN 'DELETED'
        WHEN banned_until IS NOT NULL THEN 'BANNED'
        WHEN is_anonymous = true THEN 'ANONYMOUS'
        ELSE 'CONFIRMED'
    END
ORDER BY count DESC;

-- 5. CHECK FOR USERS WITH RECOVERY/CONFIRMATION TOKENS (PENDING ACTIONS)
SELECT 
    'RECOVERY_PENDING' as token_type,
    COUNT(*) as count,
    COUNT(CASE WHEN recovery_sent_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_requests
FROM auth.users 
WHERE recovery_token IS NOT NULL

UNION ALL

SELECT 
    'CONFIRMATION_PENDING' as token_type,
    COUNT(*) as count,
    COUNT(CASE WHEN confirmation_sent_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_requests
FROM auth.users 
WHERE confirmation_token IS NOT NULL

UNION ALL

SELECT 
    'EMAIL_CHANGE_PENDING' as token_type,
    COUNT(*) as count,
    COUNT(CASE WHEN email_change_sent_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_requests
FROM auth.users 
WHERE email_change_token_new IS NOT NULL;

-- 6. CHECK SSO USERS vs REGULAR USERS ACTIVITY
SELECT 
    CASE WHEN is_sso_user = true THEN 'SSO' ELSE 'REGULAR' END as user_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_24h,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as created_24h
FROM auth.users
GROUP BY is_sso_user
ORDER BY total_users DESC;