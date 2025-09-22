-- Check pro_subscriptions table schema
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pro_subscriptions'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check constraints
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.pro_subscriptions'::regclass;