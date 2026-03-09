-- CHECK PAYMENT RELATED DATABASE SCHEMA
-- After HTTP migration, database schema might be corrupted

-- 1. CHECK ALL PAYMENT RELATED TABLES EXIST
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('subscription_plans', 'pro_subscriptions', 'profiles')
ORDER BY table_name;

-- 2. CHECK SUBSCRIPTION_PLANS TABLE STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'subscription_plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. CHECK PRO_SUBSCRIPTIONS TABLE STRUCTURE  
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. CHECK IF TABLES HAVE DATA
SELECT 
    'subscription_plans' as table_name,
    COUNT(*) as row_count
FROM subscription_plans
UNION ALL
SELECT 
    'pro_subscriptions' as table_name,
    COUNT(*) as row_count
FROM pro_subscriptions
UNION ALL
SELECT 
    'profiles' as table_name,
    COUNT(*) as row_count
FROM profiles;

-- 5. CHECK TABLE CONSTRAINTS AND INDEXES
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('subscription_plans', 'pro_subscriptions', 'profiles')
ORDER BY tc.table_name, tc.constraint_type;