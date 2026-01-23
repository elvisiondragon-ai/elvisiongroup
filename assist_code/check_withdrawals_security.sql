SELECT 
    t.tablename, 
    t.rowsecurity as rls_enabled,
    p.policyname,
    p.permissive,
    p.roles,
    p.cmd,
    p.qual,
    p.with_check
FROM 
    pg_tables t
LEFT JOIN 
    pg_policies p ON t.tablename = p.tablename
WHERE 
    t.schemaname = 'public' 
    AND t.tablename = 'withdrawals';
