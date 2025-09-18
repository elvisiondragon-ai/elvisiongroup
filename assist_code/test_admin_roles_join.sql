-- Test the admin_roles JOIN approach
-- This mimics what the frontend will now do

-- Test 1: Check the JOIN works correctly
SELECT 
    cm.id,
    cm.user_id,
    cm.user_name,
    cm.user_level,
    cm.is_pro,
    cm.message,
    cm.created_at,
    ar.role,
    ar.is_active,
    CASE 
        WHEN ar.role = 'admin' AND ar.is_active = true THEN true 
        ELSE false 
    END as computed_is_admin
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id AND ar.role = 'admin'
WHERE cm.user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
ORDER BY cm.created_at DESC;

-- Test 2: Check all messages with admin status computed
SELECT 
    cm.user_name,
    cm.user_level,
    cm.is_pro,
    LEFT(cm.message, 50) as message_preview,
    ar.role as admin_role,
    ar.is_active as admin_active,
    CASE 
        WHEN ar.role = 'admin' AND ar.is_active = true THEN true 
        ELSE false 
    END as will_show_admin_badge,
    cm.created_at
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id AND ar.role = 'admin'
ORDER BY cm.created_at DESC
LIMIT 10;

-- Test 3: Verify dragon@yahoo.com admin setup
SELECT 'Admin roles verification:' as info;
SELECT ar.user_id, ar.role, ar.is_active, ar.granted_at, ar.user_email
FROM admin_roles ar
WHERE ar.user_email = 'dragon@yahoo.com';