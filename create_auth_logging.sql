-- Create table to log auth requests
CREATE TABLE IF NOT EXISTS auth_request_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  request_type TEXT,
  user_agent TEXT,
  ip_address INET,
  component_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to log auth requests
CREATE OR REPLACE FUNCTION log_auth_request(
  p_user_id UUID DEFAULT NULL,
  p_request_type TEXT DEFAULT 'getUser',
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_component_name TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO auth_request_logs (user_id, request_type, user_agent, ip_address, component_name)
  VALUES (p_user_id, p_request_type, p_user_agent, p_ip_address::inet, p_component_name);
END;
$$;

-- Query to see auth request patterns
CREATE OR REPLACE FUNCTION get_auth_request_stats()
RETURNS TABLE(
  component_name TEXT,
  request_count BIGINT,
  unique_users BIGINT,
  last_request TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.component_name,
    COUNT(*) as request_count,
    COUNT(DISTINCT l.user_id) as unique_users,
    MAX(l.created_at) as last_request
  FROM auth_request_logs l
  WHERE l.created_at >= NOW() - INTERVAL '1 hour'
  GROUP BY l.component_name
  ORDER BY request_count DESC;
END;
$$;