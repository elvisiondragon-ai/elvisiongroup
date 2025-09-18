-- Admin Roles Approach - Better Design
-- First check if admin_roles table exists and structure

-- Check admin_roles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_roles' 
AND table_schema = 'public';

-- Sample admin_roles structure (if needs to be created)
-- CREATE TABLE admin_roles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES profiles(user_id),
--   role TEXT NOT NULL, -- 'admin', 'moderator', etc
--   granted_at TIMESTAMP DEFAULT NOW(),
--   granted_by UUID REFERENCES profiles(user_id),
--   is_active BOOLEAN DEFAULT true
-- );

-- Insert dragon@yahoo.com as admin (if not exists)
INSERT INTO admin_roles (user_id, role, granted_at, is_active)
SELECT p.user_id, 'admin', NOW(), true
FROM profiles p
JOIN auth.users u ON p.user_id = u.id  
WHERE u.email = 'dragon@yahoo.com'
AND NOT EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = p.user_id AND ar.role = 'admin'
);

-- Updated query for chat messages with admin_roles JOIN
SELECT cm.*,
       CASE WHEN ar.role = 'admin' AND ar.is_active = true 
            THEN true 
            ELSE false 
       END as is_admin
FROM chat_messages cm
LEFT JOIN admin_roles ar ON cm.user_id = ar.user_id AND ar.role = 'admin'
ORDER BY cm.created_at DESC
LIMIT 20;