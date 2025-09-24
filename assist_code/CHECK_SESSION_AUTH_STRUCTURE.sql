-- SQL to find out what's actually inside sessions and auth structure
-- Fast method to understand session vs auth vs user data

-- 1. Check auth.users table structure (main user data)
SELECT 
    'AUTH.USERS STRUCTURE' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
    AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 2. Check what's actually in auth.users (sample data)
SELECT 
    'AUTH.USERS SAMPLE DATA' as info,
    id,
    email,
    email_confirmed_at,
    phone,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users 
LIMIT 3;

-- 3. Check auth.sessions table structure 
SELECT 
    'AUTH.SESSIONS STRUCTURE' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'sessions'
    AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 4. Check what's in auth.sessions (sample data)
SELECT 
    'AUTH.SESSIONS SAMPLE DATA' as info,
    id,
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal,
    not_after,
    refreshed_at,
    user_agent,
    ip
FROM auth.sessions 
WHERE updated_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY updated_at DESC
LIMIT 5;

-- 5. Check auth.refresh_tokens structure
SELECT 
    'AUTH.REFRESH_TOKENS STRUCTURE' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'refresh_tokens'
    AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 6. Check relationship between auth.users, auth.sessions, and public.profiles
SELECT 
    'USER-SESSION-PROFILE RELATIONSHIP' as relationship,
    u.id as auth_user_id,
    u.email as auth_email,
    s.id as session_id,
    s.created_at as session_created,
    s.refreshed_at as session_refreshed,
    p.user_id as profile_user_id,
    p.display_name,
    p.level,
    p.experience_points
FROM auth.users u
LEFT JOIN auth.sessions s ON u.id = s.user_id
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE s.updated_at >= CURRENT_DATE - INTERVAL '3 days'
ORDER BY s.updated_at DESC
LIMIT 10;

-- 7. What happens when you call different Supabase functions
SELECT 
    'SUPABASE FUNCTION CALLS EXPLANATION' as explanation,
    'supabase.auth.getUser() - Gets user from JWT token (fast, client-side)
     supabase.auth.getSession() - Gets full session + user (slower, includes tokens)
     supabase.from("profiles") - Database query to profiles table (slowest)
     
     SESSION CONTAINS:
     - access_token (JWT)
     - refresh_token
     - expires_at
     - expires_in
     - token_type
     - user object (id, email, metadata)
     
     USER OBJECT CONTAINS:
     - id (UUID)
     - email
     - phone
     - created_at
     - updated_at
     - email_confirmed_at
     - raw_user_meta_data (custom fields)
     - raw_app_meta_data (system fields)
     
     SPEED RANKING (fastest to slowest):
     1. getUser() - just user data from token
     2. getSession() - full session + user data  
     3. database queries - actual database calls' as function_info;

-- 8. Check auth schema tables
SELECT 
    'ALL AUTH TABLES' as info,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

| info            | table_name        | table_type |
| --------------- | ----------------- | ---------- |
| ALL AUTH TABLES | audit_log_entries | BASE TABLE |
| ALL AUTH TABLES | flow_state        | BASE TABLE |
| ALL AUTH TABLES | identities        | BASE TABLE |
| ALL AUTH TABLES | instances         | BASE TABLE |
| ALL AUTH TABLES | mfa_amr_claims    | BASE TABLE |
| ALL AUTH TABLES | mfa_challenges    | BASE TABLE |
| ALL AUTH TABLES | mfa_factors       | BASE TABLE |
| ALL AUTH TABLES | oauth_clients     | BASE TABLE |
| ALL AUTH TABLES | one_time_tokens   | BASE TABLE |
| ALL AUTH TABLES | refresh_tokens    | BASE TABLE |
| ALL AUTH TABLES | saml_providers    | BASE TABLE |
| ALL AUTH TABLES | saml_relay_states | BASE TABLE |
| ALL AUTH TABLES | schema_migrations | BASE TABLE |
| ALL AUTH TABLES | sessions          | BASE TABLE |
| ALL AUTH TABLES | sso_domains       | BASE TABLE |
| ALL AUTH TABLES | sso_providers     | BASE TABLE |
| ALL AUTH TABLES | users             | BASE TABLE |