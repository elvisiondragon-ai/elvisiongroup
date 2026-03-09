-- Check index usage and foreign key constraints for performance optimization

-- 1. Check days_remaining table structure and foreign key
SELECT 
    'days_remaining_structure' as test,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'days_remaining'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints on days_remaining
SELECT 
    'days_remaining_fkeys' as test,
    tc.constraint_name,
    kcu.column_name as local_column,
    ccu.table_name as foreign_table,
    ccu.column_name as foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'days_remaining'
    AND tc.table_schema = 'public';

-- 3. Check existing indexes on days_remaining
SELECT 
    'days_remaining_indexes' as test,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename = 'days_remaining';

-- 4. Check if the supposedly unused indexes actually exist and their definitions
SELECT 
    'unused_indexes_check' as test,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
  AND indexname IN (
      'idx_chat_messages_channel_id',
      'idx_waiting_payment_user_id', 
      'idx_waiting_payment_status',
      'elite_habits_date_idx',
      'elite_habits_user_email_idx'
  );

-- 5. Check index usage statistics (if available) - fixed column names
SELECT 
    'index_usage_stats' as test,
    schemaname,
    relname as tablename,
    indexrelname as indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND indexrelname IN (
      'idx_chat_messages_channel_id',
      'idx_waiting_payment_user_id', 
      'idx_waiting_payment_status',
      'elite_habits_date_idx',
      'elite_habits_user_email_idx'
  );

-- 6. Check if tables mentioned in unused indexes still exist
SELECT 
    'table_existence_check' as test,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('chat_messages', 'waiting_payment', 'elite_habits', 'days_remaining');