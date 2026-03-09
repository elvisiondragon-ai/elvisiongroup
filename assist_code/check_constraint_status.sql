-- Check if NOT NULL constraint is actually applied to user_email

SELECT
    column_name,
    is_nullable,
    data_type,
    CASE
        WHEN is_nullable = 'NO' THEN '✅ NOT NULL constraint applied'
        WHEN is_nullable = 'YES' THEN '❌ Still nullable - constraint not applied'
        ELSE 'Unknown status'
    END as constraint_status
FROM information_schema.columns
WHERE table_name = 'reflections'
  AND column_name = 'user_email';