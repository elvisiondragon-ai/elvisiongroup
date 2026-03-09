-- AUTH REFRESH TOKENS ANALYSIS
-- Check refresh token patterns for excessive requests

-- 1. CHECK IF REFRESH_TOKENS TABLE EXISTS AND GET STRUCTURE
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'auth' 
    AND table_name = 'refresh_tokens'
ORDER BY ordinal_position;

-- 2. REFRESH TOKEN COUNT BY DATE (IF TABLE EXISTS)
SELECT 
    DATE(created_at) as token_date,
    COUNT(*) as tokens_created,
    COUNT(DISTINCT user_id) as unique_users
FROM auth.refresh_tokens 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY token_date DESC;

-- 3. USERS WITH EXCESSIVE REFRESH TOKENS
SELECT 
    user_id,
    COUNT(*) as token_count,
    MIN(created_at) as first_token,
    MAX(created_at) as last_token,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))/3600 as hours_span
FROM auth.refresh_tokens 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY user_id
HAVING COUNT(*) > 10
ORDER BY token_count DESC;

-- 4. RAPID TOKEN REFRESH PATTERNS
WITH token_gaps AS (
    SELECT 
        user_id,
        created_at,
        LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at) as prev_token,
        EXTRACT(EPOCH FROM (created_at - LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at))) as seconds_between
    FROM auth.refresh_tokens 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
)
SELECT 
    user_id,
    COUNT(*) as rapid_refreshes,
    AVG(seconds_between) as avg_seconds_between,
    MIN(seconds_between) as min_seconds_between
FROM token_gaps 
WHERE seconds_between < 300  -- Less than 5 minutes between refreshes
GROUP BY user_id
HAVING COUNT(*) > 3
ORDER BY rapid_refreshes DESC;

-- 5. CHECK ALL AUTH SCHEMA TABLES FOR COMPREHENSIVE VIEW
SELECT 
    t.table_name,
    COALESCE(row_count.count, 0) as estimated_rows
FROM information_schema.tables t
LEFT JOIN (
    SELECT 
        schemaname, 
        tablename, 
        n_tup_ins as count
    FROM pg_stat_user_tables 
    WHERE schemaname = 'auth'
) row_count ON t.table_name = row_count.tablename
WHERE t.table_schema = 'auth'
ORDER BY estimated_rows DESC;