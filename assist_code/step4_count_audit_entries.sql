SELECT COUNT(*) as total_entries
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours';