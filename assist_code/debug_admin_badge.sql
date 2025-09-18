-- Debug: Check what the Supabase JOIN query actually returns
-- This should match exactly what the frontend receives

-- Test 1: Simple query to see admin_roles structure
SELECT 'admin_roles table structure:' as debug_info;
SELECT * FROM admin_roles WHERE user_email = 'dragon@yahoo.com';

-- Test 2: Test the exact JOIN query the frontend uses
SELECT 'Frontend JOIN query result:' as debug_info;
SELECT cm.*, ar.role, ar.is_active
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id
WHERE cm.user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
ORDER BY cm.created_at DESC
LIMIT 3;

-- Test 3: Check if JOIN is working (should show admin data)
SELECT 'JOIN verification:' as debug_info;
SELECT 
    cm.user_name,
    cm.user_id,
    ar.role,
    ar.is_active,
    ar.user_email
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id
WHERE cm.user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
LIMIT 1;