-- Security fix: Ensure admin_roles table has proper RLS policies for SELECT operations
-- This addresses the security finding about admin role assignments being viewable by anyone

-- First, check if RLS is enabled (it should be based on the schema)
-- The table already has RLS enabled, but we need to ensure SELECT is properly restricted

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

-- Add additional security logging for admin role access attempts
CREATE OR REPLACE FUNCTION public.log_admin_role_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all SELECT attempts on admin_roles for security monitoring
  IF TG_OP = 'SELECT' THEN
    PERFORM public.log_sensitive_action(
      'admin_roles_table_access',
      'admin_roles',
      NULL,
      jsonb_build_object(
        'operation', 'SELECT',
        'requesting_user', auth.uid(),
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to monitor access attempts
DROP TRIGGER IF EXISTS admin_role_access_monitor ON public.admin_roles;
CREATE TRIGGER admin_role_access_monitor
  BEFORE SELECT ON public.admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_role_access();