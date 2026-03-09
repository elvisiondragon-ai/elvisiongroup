-- Check the actual structure of pro_subscriptions table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
ORDER BY ordinal_position;

-- Show a sample record to see all columns
SELECT * FROM pro_subscriptions LIMIT 1;