-- ===========================================
-- CHECK PRO STATUS FUNCTIONS
-- ===========================================

-- 1. Check how pro status is determined
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'check_unified_pro_status';

-- 2. Check what prevents unauthorized pro
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'prevent_unauthorized_pro';

-- 3. Check current pro_subscriptions data
SELECT * FROM pro_subscriptions ORDER BY created_at DESC LIMIT 5;

-- 4. Check for users with pro status but not in pro_subscriptions
-- First need to know how pro status is stored in profiles table
SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name ILIKE '%pro%';