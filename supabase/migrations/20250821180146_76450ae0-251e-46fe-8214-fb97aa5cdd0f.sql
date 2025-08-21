-- Revoke super_admin from hendi@yahoo.com
UPDATE public.admin_roles 
SET is_active = false 
WHERE user_id = '8fa357c9-4450-4e90-b3c9-6886f7159287' AND role = 'super_admin';

-- Grant super_admin to elvisiondragon@gmail.com
INSERT INTO public.admin_roles (user_id, role, granted_by, is_active)
VALUES ('8c2cd3b1-6b77-4df9-92c5-467182ecd13d', 'super_admin', '8fa357c9-4450-4e90-b3c9-6886f7159287', true)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  granted_by = '8fa357c9-4450-4e90-b3c9-6886f7159287',
  granted_at = now(),
  is_active = true;