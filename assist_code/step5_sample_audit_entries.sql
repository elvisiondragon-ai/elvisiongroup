SELECT payload, ip_address, created_at
FROM auth.audit_log_entries 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;