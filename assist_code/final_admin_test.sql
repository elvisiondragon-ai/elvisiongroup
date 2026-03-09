-- Final test: Verify admin badge will show for dragon@yahoo.com
-- This simulates exactly what the frontend JOIN query does

SELECT 
    cm.user_id,
    cm.user_name,
    cm.user_level,
    cm.is_pro,
    LEFT(cm.message, 60) as message_preview,
    ar.role as admin_role,
    ar.is_active as admin_is_active,
    -- This is the exact logic the frontend uses
    CASE 
        WHEN ar.role = 'admin' AND ar.is_active = true 
        THEN true 
        ELSE false 
    END as will_show_admin_badge,
    cm.created_at
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id AND ar.role = 'admin'  
WHERE cm.user_id = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'
ORDER BY cm.created_at DESC
LIMIT 5;