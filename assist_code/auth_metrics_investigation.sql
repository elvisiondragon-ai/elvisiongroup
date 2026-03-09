-- AUTH METRICS INVESTIGATION SQL
-- Run these queries to find root cause of high auth requests

-- 1. CHECK AUTH LOGS BREAKDOWN BY EVENT TYPE
SELECT 
    event_type,
    COUNT(*) as count,
    DATE(created_at) as date
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type, DATE(created_at)
ORDER BY count DESC;

-- 2. CHECK TOKEN REFRESH FREQUENCY
SELECT 
    event_type,
    ip_address,
    COUNT(*) as requests,
    COUNT(DISTINCT user_id) as unique_users,
    MIN(created_at) as first_request,
    MAX(created_at) as last_request
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND event_type IN ('token_refreshed', 'user_signedin')
GROUP BY event_type, ip_address
HAVING COUNT(*) > 100
ORDER BY requests DESC;

-- 3. CHECK USERS WITH EXCESSIVE AUTH ACTIVITY
SELECT 
    user_id,
    COUNT(*) as auth_requests,
    COUNT(DISTINCT event_type) as event_types,
    STRING_AGG(DISTINCT event_type, ', ') as events,
    COUNT(DISTINCT ip_address) as ip_count
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND user_id IS NOT NULL
GROUP BY user_id
HAVING COUNT(*) > 50
ORDER BY auth_requests DESC
LIMIT 20;

-- 4. CHECK FAILED VS SUCCESSFUL AUTH ATTEMPTS
SELECT 
    event_type,
    CASE 
        WHEN payload->>'error' IS NOT NULL THEN 'FAILED'
        ELSE 'SUCCESS'
    END as status,
    COUNT(*) as count
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type, status
ORDER BY count DESC;

-- 5. CHECK AUTH REQUESTS BY HOUR (PATTERN ANALYSIS)
SELECT 
    EXTRACT(HOUR FROM created_at) as hour,
    COUNT(*) as requests,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;

-- 6. CHECK FOR RAPID SUCCESSIVE REQUESTS (POSSIBLE LOOPS)
WITH rapid_requests AS (
    SELECT 
        user_id,
        ip_address,
        event_type,
        created_at,
        LAG(created_at) OVER (PARTITION BY user_id, event_type ORDER BY created_at) as prev_request,
        created_at - LAG(created_at) OVER (PARTITION BY user_id, event_type ORDER BY created_at) as time_diff
    FROM auth.audit_log_entries 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
        AND user_id IS NOT NULL
)
SELECT 
    user_id,
    event_type,
    COUNT(*) as rapid_requests,
    AVG(EXTRACT(EPOCH FROM time_diff)) as avg_seconds_between
FROM rapid_requests 
WHERE time_diff < INTERVAL '10 seconds'
GROUP BY user_id, event_type
HAVING COUNT(*) > 10
ORDER BY rapid_requests DESC;

-- 7. CHECK IP ADDRESSES WITH HIGH AUTH VOLUME
SELECT 
    ip_address,
    COUNT(*) as requests,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT event_type) as event_types,
    STRING_AGG(DISTINCT event_type, ', ') as events
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) > 100
ORDER BY requests DESC
LIMIT 10;

-- 8. CHECK USER AGENTS (IF AVAILABLE)
SELECT 
    payload->>'user_agent' as user_agent,
    COUNT(*) as requests,
    COUNT(DISTINCT user_id) as unique_users
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND payload->>'user_agent' IS NOT NULL
GROUP BY payload->>'user_agent'
HAVING COUNT(*) > 100
ORDER BY requests DESC;