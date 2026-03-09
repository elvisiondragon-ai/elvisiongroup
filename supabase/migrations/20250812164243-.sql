-- Add missing SELECT policy for admin_roles table
-- This allows users to view their own roles and super admins to view all roles
CREATE POLICY "Users can view relevant admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (
  -- Users can see their own roles
  auth.uid() = user_id 
  OR 
  -- Super admins can see all roles
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'super_admin' 
    AND ar.is_active = true 
    AND (ar.expires_at IS NULL OR ar.expires_at > now())
  )
);