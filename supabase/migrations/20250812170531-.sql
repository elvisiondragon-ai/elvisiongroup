-- Advanced Admin System Security Hardening
-- Multi-layered protection against admin system compromise

-- 1. Create admin activity monitoring table
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  target_resource text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  risk_score integer DEFAULT 0,
  requires_approval boolean DEFAULT false,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin activity log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view admin activity logs
CREATE POLICY "Super admins can view admin activity logs"
ON public.admin_activity_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = auth.uid()
    AND ar.role = 'super_admin'
    AND ar.is_active = true
    AND (ar.expires_at IS NULL OR ar.expires_at > now())
  )
);

-- System can insert admin activity logs
CREATE POLICY "System can insert admin activity logs"
ON public.admin_activity_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Create fail-safe admin verification function
CREATE OR REPLACE FUNCTION public.verify_admin_with_failsafe(
  p_user_id uuid,
  p_required_role text DEFAULT 'admin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_record RECORD;
  verification_result jsonb;
  current_time timestamptz := now();
BEGIN
  -- Initialize result
  verification_result := jsonb_build_object(
    'is_admin', false,
    'role', null,
    'expires_at', null,
    'verification_time', current_time,
    'security_checks', jsonb_build_array()
  );
  
  -- Security check 1: User must be authenticated
  IF p_user_id IS NULL THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'authentication', 'passed', false, 'reason', 'user_not_authenticated')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 2: Fetch admin role with comprehensive validation
  SELECT * INTO admin_record
  FROM public.admin_roles
  WHERE user_id = p_user_id
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > current_time);
  
  -- Security check 3: Role exists and is valid
  IF NOT FOUND THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'role_exists', 'passed', false, 'reason', 'no_active_admin_role')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 4: Role hierarchy validation
  IF p_required_role = 'super_admin' AND admin_record.role != 'super_admin' THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'role_hierarchy', 'passed', false, 'reason', 'insufficient_privileges')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 5: Rate limiting for admin operations
  IF NOT public.check_sensitive_data_rate_limit(p_user_id, 'admin_operations') THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'rate_limit', 'passed', false, 'reason', 'rate_limit_exceeded')
    );
    RETURN verification_result;
  END IF;
  
  -- All checks passed
  verification_result := jsonb_build_object(
    'is_admin', true,
    'role', admin_record.role,
    'expires_at', admin_record.expires_at,
    'verification_time', current_time,
    'security_checks', jsonb_build_array(
      jsonb_build_object('check', 'authentication', 'passed', true),
      jsonb_build_object('check', 'role_exists', 'passed', true),
      jsonb_build_object('check', 'role_hierarchy', 'passed', true),
      jsonb_build_object('check', 'rate_limit', 'passed', true)
    )
  );
  
  -- Log successful verification
  PERFORM public.log_sensitive_action(
    'admin_verification_success',
    'admin_roles',
    admin_record.id,
    verification_result
  );
  
  RETURN verification_result;
END;
$$;

-- 3. Enhanced admin role assignment with approval workflow
CREATE OR REPLACE FUNCTION public.secure_admin_role_grant(
  p_target_user_id uuid,
  p_role text,
  p_expires_at timestamptz DEFAULT NULL,
  p_justification text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  granting_user_id uuid;
  verification_result jsonb;
  requires_approval boolean := false;
  result jsonb;
BEGIN
  granting_user_id := auth.uid();
  
  -- Verify granting user is super admin
  verification_result := public.verify_admin_with_failsafe(granting_user_id, 'super_admin');
  
  IF NOT (verification_result->>'is_admin')::boolean THEN
    -- Log failed attempt
    PERFORM public.log_sensitive_action(
      'admin_role_grant_denied',
      'admin_roles',
      p_target_user_id,
      jsonb_build_object(
        'target_user', p_target_user_id,
        'requested_role', p_role,
        'denied_reason', 'insufficient_privileges',
        'verification_result', verification_result
      )
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Access denied: Super admin privileges required',
      'verification_result', verification_result
    );
  END IF;
  
  -- Determine if approval is needed (super_admin grants always require approval)
  requires_approval := (p_role = 'super_admin');
  
  -- Log the grant attempt with high detail
  INSERT INTO public.admin_activity_log (
    user_id,
    action,
    target_user_id,
    metadata,
    requires_approval
  ) VALUES (
    granting_user_id,
    'admin_role_grant_attempt',
    p_target_user_id,
    jsonb_build_object(
      'requested_role', p_role,
      'expires_at', p_expires_at,
      'justification', p_justification,
      'requires_approval', requires_approval,
      'verification_result', verification_result
    ),
    requires_approval
  );
  
  -- If approval not required, grant immediately
  IF NOT requires_approval THEN
    INSERT INTO public.admin_roles (user_id, role, granted_by, expires_at)
    VALUES (p_target_user_id, p_role, granting_user_id, p_expires_at)
    ON CONFLICT (user_id) DO UPDATE SET
      role = EXCLUDED.role,
      granted_by = EXCLUDED.granted_by,
      granted_at = now(),
      expires_at = EXCLUDED.expires_at,
      is_active = true;
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin role granted successfully',
      'role_granted', p_role,
      'requires_approval', false
    );
  ELSE
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin role grant submitted for approval',
      'role_requested', p_role,
      'requires_approval', true
    );
  END IF;
  
  -- Enhanced logging
  PERFORM public.log_sensitive_action(
    'admin_role_grant_processed',
    'admin_roles',
    p_target_user_id,
    result || jsonb_build_object('verification_result', verification_result)
  );
  
  RETURN result;
END;
$$;

-- 4. Admin role emergency revocation function
CREATE OR REPLACE FUNCTION public.emergency_revoke_admin_role(
  p_target_user_id uuid,
  p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  revoking_user_id uuid;
  verification_result jsonb;
  revoked_role text;
BEGIN
  revoking_user_id := auth.uid();
  
  -- Verify revoking user is super admin
  verification_result := public.verify_admin_with_failsafe(revoking_user_id, 'super_admin');
  
  IF NOT (verification_result->>'is_admin')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Access denied: Super admin privileges required'
    );
  END IF;
  
  -- Get current role before revocation
  SELECT role INTO revoked_role 
  FROM public.admin_roles 
  WHERE user_id = p_target_user_id AND is_active = true;
  
  -- Revoke the role
  UPDATE public.admin_roles 
  SET is_active = false, updated_at = now()
  WHERE user_id = p_target_user_id;
  
  -- Log emergency revocation
  PERFORM public.log_sensitive_action(
    'admin_role_emergency_revocation',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'revoked_role', revoked_role,
      'revoked_by', revoking_user_id,
      'reason', p_reason,
      'emergency_action', true
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin role emergency revocation completed',
    'revoked_role', revoked_role
  );
END;
$$;

-- 5. Admin system health check function
CREATE OR REPLACE FUNCTION public.admin_system_health_check()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  health_report jsonb;
  super_admin_count integer;
  expired_roles_count integer;
  suspicious_activity_count integer;
BEGIN
  -- Count active super admins
  SELECT COUNT(*) INTO super_admin_count
  FROM public.admin_roles
  WHERE role = 'super_admin' 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > now());
  
  -- Count expired but still active roles
  SELECT COUNT(*) INTO expired_roles_count
  FROM public.admin_roles
  WHERE is_active = true 
  AND expires_at IS NOT NULL 
  AND expires_at <= now();
  
  -- Count suspicious admin activity in last 24 hours
  SELECT COUNT(*) INTO suspicious_activity_count
  FROM public.security_audit_log
  WHERE action LIKE '%admin%'
  AND created_at > (now() - interval '24 hours')
  AND metadata->>'suspicious_activity' = 'true';
  
  health_report := jsonb_build_object(
    'timestamp', now(),
    'super_admin_count', super_admin_count,
    'expired_roles_count', expired_roles_count,
    'suspicious_activity_count', suspicious_activity_count,
    'status', CASE 
      WHEN super_admin_count = 0 THEN 'CRITICAL'
      WHEN expired_roles_count > 0 THEN 'WARNING'
      WHEN suspicious_activity_count > 5 THEN 'WARNING'
      ELSE 'HEALTHY'
    END,
    'recommendations', CASE
      WHEN super_admin_count = 0 THEN jsonb_build_array('No active super admins - system locked')
      WHEN expired_roles_count > 0 THEN jsonb_build_array('Clean up expired admin roles')
      WHEN suspicious_activity_count > 5 THEN jsonb_build_array('Review suspicious admin activity')
      ELSE jsonb_build_array('System operating normally')
    END
  );
  
  -- Log health check
  PERFORM public.log_sensitive_action(
    'admin_system_health_check',
    'admin_roles',
    NULL,
    health_report
  );
  
  RETURN health_report;
END;
$$;

-- 6. Update existing admin role policies to use the enhanced verification
DROP POLICY IF EXISTS "Super admins can manage all admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Only super admins can view admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Prevent unauthorized super admin creation" ON public.admin_roles;

-- New fail-safe policies using the enhanced verification function
CREATE POLICY "Enhanced super admin management"
ON public.admin_roles
FOR ALL
TO authenticated
USING (
  (public.verify_admin_with_failsafe(auth.uid(), 'super_admin')->>'is_admin')::boolean
)
WITH CHECK (
  (public.verify_admin_with_failsafe(auth.uid(), 'super_admin')->>'is_admin')::boolean
);

-- 7. Create automated cleanup function for expired roles
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_roles()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  cleanup_count integer;
BEGIN
  -- Deactivate expired roles
  UPDATE public.admin_roles 
  SET is_active = false, updated_at = now()
  WHERE is_active = true 
  AND expires_at IS NOT NULL 
  AND expires_at <= now();
  
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log cleanup action
  PERFORM public.log_sensitive_action(
    'admin_roles_automated_cleanup',
    'admin_roles',
    NULL,
    jsonb_build_object(
      'cleaned_up_count', cleanup_count,
      'cleanup_time', now()
    )
  );
  
  RETURN cleanup_count;
END;
$$;