-- Security fix: Ensure admin_roles table has proper RLS policies for SELECT operations
-- This addresses the security finding about admin role assignments being viewable by anyone

-- Drop the existing overly broad "ALL" policy and create specific policies for better security
DROP POLICY IF EXISTS "Enhanced super admin management" ON public.admin_roles;

-- Create separate policies for different operations with stricter controls
-- Policy for SELECT: Only verified super admins can view admin role assignments
CREATE POLICY "Super admins can view admin roles"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (
  -- Use the security definer function to prevent recursion
  (verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text)::boolean
);

-- Policy for INSERT: Only verified super admins can create admin roles
CREATE POLICY "Super admins can create admin roles"
ON public.admin_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text)::boolean
);

-- Policy for UPDATE: Only verified super admins can update admin roles
CREATE POLICY "Super admins can update admin roles"
ON public.admin_roles
FOR UPDATE
TO authenticated
USING (
  (verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text)::boolean
)
WITH CHECK (
  (verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text)::boolean
);

-- Policy for DELETE: Only verified super admins can delete admin roles
CREATE POLICY "Super admins can delete admin roles"
ON public.admin_roles
FOR DELETE
TO authenticated
USING (
  (verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text)::boolean
);

-- Enhanced logging function for admin role access monitoring
CREATE OR REPLACE FUNCTION public.enhanced_admin_role_access_log()
RETURNS TRIGGER AS $$
BEGIN
  -- Log admin role table access for security monitoring
  PERFORM public.log_sensitive_action(
    'admin_roles_data_access',
    'admin_roles',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'operation', TG_OP,
      'requesting_user', auth.uid(),
      'target_user', COALESCE(NEW.user_id, OLD.user_id),
      'role', COALESCE(NEW.role, OLD.role),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for monitoring all operations on admin_roles
DROP TRIGGER IF EXISTS enhanced_admin_role_access_monitor ON public.admin_roles;
CREATE TRIGGER enhanced_admin_role_access_monitor
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_admin_role_access_log();