-- Verify exact session metadata structure for display names - FIXED
-- This confirms what's available in session.user.user_metadata

-- 1. Show exact raw_user_meta_data structure (this becomes user_metadata in session)
SELECT 
    id,
    email,
    jsonb_pretty(raw_user_meta_data) as session_user_metadata,
    raw_user_meta_data->>'display_name' as display_name_value,
    raw_user_meta_data->>'full_name' as full_name_value,
    length(raw_user_meta_data->>'display_name') as display_name_length,
    length(raw_user_meta_data->>'full_name') as full_name_length
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check users created in last 24 hours to see current signup behavior
SELECT 
    'Recent signups (24h):' as info,
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 3. Specific check for display_name vs full_name availability
SELECT 
    CASE 
        WHEN raw_user_meta_data->>'display_name' IS NOT NULL AND trim(raw_user_meta_data->>'display_name') != '' THEN 'has_display_name'
        WHEN raw_user_meta_data->>'full_name' IS NOT NULL AND trim(raw_user_meta_data->>'full_name') != '' THEN 'has_full_name_only'
        ELSE 'no_names'
    END as metadata_status,
    COUNT(*) as user_count,
    array_agg(id ORDER BY created_at DESC) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_user_ids
FROM auth.users 
GROUP BY 1
ORDER BY user_count DESC;

-- 4. Show exact JSON keys available in metadata
SELECT DISTINCT
    jsonb_object_keys(raw_user_meta_data) as available_keys,
    COUNT(*) as users_with_this_key
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
GROUP BY 1
ORDER BY 2 DESC;

-- 5. Test specific users to see what session.user.user_metadata would contain
SELECT 
    'Session metadata simulation:' as note,
    id,
    email,
    raw_user_meta_data as what_frontend_gets_as_user_metadata,
    COALESCE(
        raw_user_meta_data->>'display_name',
        raw_user_meta_data->>'full_name'
    ) as fallback_logic_result
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
   AND (raw_user_meta_data->>'display_name' IS NOT NULL 
        OR raw_user_meta_data->>'full_name' IS NOT NULL)
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check Google OAuth vs regular signup metadata differences (FIXED)
WITH user_keys AS (
    SELECT 
        id,
        CASE 
            WHEN raw_user_meta_data ? 'provider' THEN 'oauth_signup'
            ELSE 'regular_signup'
        END as signup_type,
        raw_user_meta_data,
        raw_user_meta_data->>'display_name' as display_name,
        raw_user_meta_data->>'full_name' as full_name
    FROM auth.users 
    WHERE raw_user_meta_data IS NOT NULL
)
SELECT 
    signup_type,
    COUNT(*) as total,
    COUNT(CASE WHEN display_name IS NOT NULL THEN 1 END) as has_display_name,
    COUNT(CASE WHEN full_name IS NOT NULL THEN 1 END) as has_full_name
FROM user_keys
GROUP BY signup_type;

-- 7. Exact verification: what would the frontend code get?
SELECT 
    id,
    email,
    -- This simulates: session.user.user_metadata?.display_name
    raw_user_meta_data->>'display_name' as frontend_display_name,
    -- This simulates: session.user.user_metadata?.full_name  
    raw_user_meta_data->>'full_name' as frontend_full_name,
    -- This simulates the fallback logic
    COALESCE(
        raw_user_meta_data->>'display_name',
        raw_user_meta_data->>'full_name'
    ) as frontend_final_result,
    created_at
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
ORDER BY created_at DESC
LIMIT 15;

-- 8. Show all metadata keys across all users (FIXED approach)
SELECT 
    key_name,
    COUNT(*) as users_with_key
FROM (
    SELECT jsonb_object_keys(raw_user_meta_data) as key_name
    FROM auth.users 
    WHERE raw_user_meta_data IS NOT NULL
) keys
GROUP BY key_name
ORDER BY users_with_key DESC;