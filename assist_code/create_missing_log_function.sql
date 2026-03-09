-- Create missing log_sensitive_action function
-- This function is needed for payment callback logging

CREATE OR REPLACE FUNCTION public.log_sensitive_action(
    p_action_type text,
    p_table_name text,
    p_record_id uuid,
    p_metadata json
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Insert into security_audit_log table (or create simple logging)
    INSERT INTO public.security_audit_log (
        user_id,
        action_type,
        table_name,
        record_id,
        metadata,
        created_at
    ) VALUES (
        auth.uid(),
        p_action_type,
        p_table_name,
        p_record_id,
        p_metadata,
        NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        -- If security_audit_log table doesn't exist, ignore the error
        -- This prevents payment processing from failing due to missing logging table
        NULL;
END;
$$;

-- Alternative: Create the security_audit_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid,
    action_type text NOT NULL,
    table_name text,
    record_id uuid,
    metadata json,
    created_at timestamptz DEFAULT NOW()
);

-- Grant permissions
GRANT ALL ON public.security_audit_log TO authenticated;
GRANT ALL ON public.security_audit_log TO service_role;