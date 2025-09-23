-- AUTH SESSIONS DEEP DIVE - FIND THE 86K SOURCE
-- Check all auth database consumption patterns

-- 1. SESSIONS COUNT BY DATE (FIND SPIKE PATTERN)
SELECT 
    DATE(created_at) as session_date,
    COUNT(*) as sessions_created,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) / NULLIF(COUNT(DISTINCT user_id), 0) as sessions_per_user
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY session_date DESC;

-- 2. SESSIONS BY HOUR (FIND TIME PATTERN)
SELECT 
    DATE(created_at) as session_date,
    EXTRACT(HOUR FROM created_at) as hour,
    COUNT(*) as sessions_created,
    COUNT(DISTINCT user_id) as unique_users
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at)
ORDER BY session_date DESC, hour DESC;

-- 3. USERS WITH EXCESSIVE SESSION CREATION (TOP OFFENDERS)
SELECT 
    user_id,
    COUNT(*) as session_count,
    MIN(created_at) as first_session,
    MAX(created_at) as last_session,
    COUNT(DISTINCT ip) as different_ips,
    COUNT(DISTINCT user_agent) as different_agents
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 10
ORDER BY session_count DESC
LIMIT 20;

-- 4. SESSION REFRESH PATTERNS (REFRESHED_AT ANALYSIS)
SELECT 
    user_id,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN refreshed_at IS NOT NULL THEN 1 END) as refreshed_sessions,
    AVG(EXTRACT(EPOCH FROM (refreshed_at - created_at))/60) as avg_refresh_minutes,
    MAX(EXTRACT(EPOCH FROM (refreshed_at - created_at))/60) as max_refresh_minutes
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 5
ORDER BY total_sessions DESC;

-- 5. RAPID SESSION CREATION (POSSIBLE LOOPS)
WITH session_gaps AS (
    SELECT 
        user_id,
        ip,
        created_at,
        LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at) as prev_session,
        EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at))) as seconds_between
    FROM auth.sessions 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
)
SELECT 
    user_id,
    ip,
    COUNT(*) as rapid_sessions,
    AVG(seconds_between) as avg_seconds_between,
    MIN(seconds_between) as min_seconds_between
FROM session_gaps 
WHERE seconds_between < 60  -- Less than 1 minute between sessions
GROUP BY user_id, ip
HAVING COUNT(*) > 5
ORDER BY rapid_sessions DESC;

-- 6. IP ADDRESSES WITH HIGH SESSION VOLUME
SELECT 
    ip,
    COUNT(*) as sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT user_agent) as unique_agents,
    MIN(created_at) as first_session,
    MAX(created_at) as last_session
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY ip
HAVING COUNT(*) > 50
ORDER BY sessions DESC;

-- 7. USER AGENTS ANALYSIS (CHECK FOR BOTS OR AUTOMATED TOOLS)
SELECT 
    LEFT(user_agent, 100) as user_agent_start,
    COUNT(*) as sessions,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip) as unique_ips
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND user_agent IS NOT NULL
GROUP BY LEFT(user_agent, 100)
HAVING COUNT(*) > 20
ORDER BY sessions DESC;

-- 8. CURRENT ACTIVE SESSIONS vs TOTAL CREATED
SELECT 
    'TOTAL_CREATED_24H' as metric,
    COUNT(*) as count
FROM auth.sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
    'CURRENTLY_ACTIVE' as metric,
    COUNT(*) as count
FROM auth.sessions 
WHERE (not_after IS NULL OR not_after > NOW())
    AND created_at >= NOW() - INTERVAL '24 hours';