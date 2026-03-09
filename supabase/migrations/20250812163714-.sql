-- FINAL SECURITY HARDENING: Fix remaining critical vulnerabilities (corrected)

-- 1. Fix admin privilege escalation vulnerability
-- Create a separate admin roles table that users cannot modify
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL, -- 'admin', 'super_admin', 'moderator'
  granted_by UUID NOT NULL, -- Who granted this role
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ, -- Optional expiration
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS but make it very restrictive
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Only super admins can view and manage admin roles
CREATE POLICY "Only super admins can manage admin roles"
ON public.admin_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.role = 'super_admin' 
    AND ar.is_active = true
    AND (ar.expires_at IS NULL OR ar.expires_at > now())
  )
);

-- 2. Update the is_verified_admin function to use the new admin_roles table
CREATE OR REPLACE FUNCTION public.is_verified_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- 3. Fix chat message privacy issue - implement proper channel-based access
-- Add better channel support to chat messages
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allowed_users UUID[] DEFAULT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_privacy ON public.chat_messages(channel_id, is_private);

-- Replace the permissive chat policy with channel-based access control
DROP POLICY IF EXISTS "Users can view public community chat messages" ON public.chat_messages;

CREATE POLICY "Channel-based chat message access"
ON public.chat_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    -- Public community messages
    (channel_id = 'community' AND is_private = false) OR
    -- Private messages where user is explicitly allowed
    (is_private = true AND auth.uid() = ANY(allowed_users)) OR
    -- User's own messages
    (auth.uid() = user_id) OR
    -- Admin access
    public.is_verified_admin(auth.uid())
  )
);

-- 4. Create a secure chat message creation function
CREATE OR REPLACE FUNCTION public.create_chat_message(
  p_message TEXT,
  p_channel_id TEXT DEFAULT 'community',
  p_is_private BOOLEAN DEFAULT false,
  p_allowed_users UUID[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  message_id UUID;
  user_profile RECORD;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;
  
  -- Get user profile for level and pro status
  SELECT level, 'pro' = ANY(achievements) as is_pro, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  -- Insert the message
  INSERT INTO public.chat_messages (
    user_id,
    user_name, 
    user_level,
    is_pro,
    message,
    channel_id,
    is_private,
    allowed_users
  ) VALUES (
    auth.uid(),
    COALESCE(user_profile.display_name, 'Anonymous'),
    COALESCE(user_profile.level, 1),
    COALESCE(user_profile.is_pro, false),
    p_message,
    p_channel_id,
    p_is_private,
    p_allowed_users
  ) RETURNING id INTO message_id;
  
  -- Log the message creation
  PERFORM public.log_data_access(
    'chat_messages',
    'message_created',
    message_id,
    jsonb_build_object(
      'channel_id', p_channel_id,
      'is_private', p_is_private,
      'message_length', length(p_message)
    )
  );
  
  RETURN message_id;
END;
$function$;

-- 5. Create function to safely grant admin roles (only callable by super admins)
CREATE OR REPLACE FUNCTION public.grant_admin_role(
  p_target_user_id UUID,
  p_role TEXT,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- 6. Add emergency admin role revocation function
CREATE OR REPLACE FUNCTION public.revoke_admin_role(p_target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only super admins can revoke roles
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Only super admins can revoke admin roles';
  END IF;
  
  -- Revoke the role
  UPDATE public.admin_roles 
  SET is_active = false 
  WHERE user_id = p_target_user_id;
  
  -- Log the revocation
  PERFORM public.log_sensitive_action(
    'admin_role_revoked',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'revoked_by', auth.uid()
    )
  );
  
  RETURN true;
END;
$function$;