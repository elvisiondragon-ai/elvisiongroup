-- CRITICAL SECURITY FIX: Add search_path protection to admin functions
-- These functions control admin privileges and must be secured immediately

BEGIN;

-- ======================
-- 1. FIX: grant_admin_role
-- ======================
CREATE OR REPLACE FUNCTION public.grant_admin_role(
    p_target_user_id uuid,
    p_role text,
    p_expires_at timestamptz DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only super admins can grant roles
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Only super admins can grant admin roles';
  END IF;
  
  -- Validate role
  IF p_role NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Only admin or moderator roles can be granted';
  END IF;
  
  -- Insert the role
  INSERT INTO public.admin_roles (user_id, role, granted_by, expires_at)
  VALUES (p_target_user_id, p_role, auth.uid(), p_expires_at)
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    granted_by = EXCLUDED.granted_by,
    granted_at = now(),
    expires_at = EXCLUDED.expires_at,
    is_active = true;
  
  -- Log the role grant
  PERFORM public.log_sensitive_action(
    'admin_role_granted',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'role_granted', p_role,
      'granted_by', auth.uid(),
      'expires_at', p_expires_at
    )
  );
  
  RETURN true;
END;
$$;

-- ======================
-- 2. FIX: is_verified_admin
-- ======================
CREATE OR REPLACE FUNCTION public.is_verified_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check the admin_roles table instead of profile achievements
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = p_user_id 
    AND role IN ('admin', 'super_admin')
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;

-- ======================
-- 3. FIX: verify_admin_with_failsafe
-- ======================
CREATE OR REPLACE FUNCTION public.verify_admin_with_failsafe(
    p_user_id uuid,
    p_required_role text DEFAULT 'admin'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================
-- Verify the functions were updated with search_path protection
SELECT 
    'admin_functions_security_check' as test,
    routine_name,
    CASE 
        WHEN routine_definition LIKE '%SET search_path = ''''%' THEN 'SECURED'
        ELSE 'STILL_VULNERABLE'
    END as security_status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('grant_admin_role', 'is_verified_admin', 'verify_admin_with_failsafe')
ORDER BY routine_name;