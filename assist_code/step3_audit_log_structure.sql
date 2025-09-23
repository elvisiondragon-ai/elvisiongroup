SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'audit_log_entries'
ORDER BY ordinal_position;