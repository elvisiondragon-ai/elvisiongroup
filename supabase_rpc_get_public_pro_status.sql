-- RPC function to get Pro status for chat users (public information)
-- This bypasses RLS to allow all users to see Pro badges in chat

CREATE OR REPLACE FUNCTION get_public_pro_status(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  is_pro BOOLEAN,
  subscription_type TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ps.user_id,
    true as is_pro,
    ps.subscription_type
  FROM pro_subscriptions ps
  WHERE ps.user_id = ANY(user_ids)
    AND ps.status = 'active'
    AND ps.subscription_end_date > NOW();
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_public_pro_status(UUID[]) TO authenticated;