-- Fix function search path security warnings
-- Update functions to include SET search_path directive

CREATE OR REPLACE FUNCTION public.enhanced_admin_role_audit()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all admin role operations with enhanced detail
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_created',
      'admin_roles',
      NEW.id,
      jsonb_build_object(
        'target_user', NEW.user_id,
        'role_granted', NEW.role,
        'granted_by', auth.uid(),
        'expires_at', NEW.expires_at,
        'operation_timestamp', now()
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_updated',
      'admin_roles',
      NEW.id,
      jsonb_build_object(
        'target_user', NEW.user_id,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_active', OLD.is_active,
        'new_active', NEW.is_active,
        'updated_by', auth.uid(),
        'operation_timestamp', now()
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_deleted',
      'admin_roles',
      OLD.id,
      jsonb_build_object(
        'target_user', OLD.user_id,
        'deleted_role', OLD.role,
        'deleted_by', auth.uid(),
        'operation_timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.validate_admin_role_operation(
  p_target_user_id uuid,
  p_role text,
  p_operation text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  requesting_user_id uuid;
  is_super_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if requesting user is super admin
  is_super_admin := EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = requesting_user_id 
    AND role = 'super_admin' 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
  
  -- Log the validation attempt
  PERFORM public.log_sensitive_action(
    'admin_role_validation',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'target_user', p_target_user_id,
      'requested_role', p_role,
      'operation', p_operation,
      'is_super_admin', is_super_admin,
      'validation_result', is_super_admin
    )
  );
  
  RETURN is_super_admin;
END;
$$;