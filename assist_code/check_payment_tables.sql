-- CHECK IF WAITING_PAYMENT TABLE EXISTS AND ITS STRUCTURE
-- Skip migration history since that table doesn't exist

-- 1. CHECK IF WAITING_PAYMENT TABLE EXISTS
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'waiting_payment';

-- 2. IF IT EXISTS, CHECK ITS STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waiting_payment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. CHECK PRO_SUBSCRIPTIONS STRUCTURE
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. CHECK ALL PAYMENT RELATED TABLES
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%payment%' OR table_name LIKE '%subscription%')
ORDER BY table_name;