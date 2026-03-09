-- ===========================================
-- CHECK PRO SUBSCRIPTIONS TABLE STRUCTURE
-- ===========================================

-- 1. Check pro_subscriptions table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'pro_subscriptions'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check all data in pro_subscriptions
SELECT * FROM pro_subscriptions LIMIT 10;

-- 3. Check how pro status is determined (look for functions)
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_definition ILIKE '%pro_subscriptions%'
OR routine_name ILIKE '%pro%';