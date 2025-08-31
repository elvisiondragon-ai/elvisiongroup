-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id SERIAL PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  blocked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create unique index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint 
ON public.rate_limits(ip_address, endpoint);

-- Create rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip_address TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 1
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_window TIMESTAMP;
  rate_record RECORD;
  is_blocked BOOLEAN := FALSE;
BEGIN
  current_window := DATE_TRUNC('minute', NOW());
  
  -- Check if IP is currently blocked
  SELECT * INTO rate_record
  FROM public.rate_limits
  WHERE ip_address = p_ip_address::inet 
    AND endpoint = p_endpoint
    AND blocked_until > NOW();
    
  IF FOUND THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'blocked', true,
      'reason', 'IP temporarily blocked',
      'retry_after', EXTRACT(EPOCH FROM (rate_record.blocked_until - NOW()))
    );
  END IF;
  
  -- Get or create rate limit record
  INSERT INTO public.rate_limits (ip_address, endpoint, window_start, request_count)
  VALUES (p_ip_address::inet, p_endpoint, current_window, 1)
  ON CONFLICT (ip_address, endpoint)
  DO UPDATE SET
    request_count = CASE
      WHEN rate_limits.window_start < current_window - (p_window_minutes || ' minutes')::interval
      THEN 1
      ELSE rate_limits.request_count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < current_window - (p_window_minutes || ' minutes')::interval
      THEN current_window
      ELSE rate_limits.window_start
    END,
    updated_at = NOW()
  RETURNING * INTO rate_record;
  
  -- Check if limit exceeded
  IF rate_record.request_count > p_max_requests THEN
    -- Block IP for 10 minutes
    UPDATE public.rate_limits 
    SET blocked_until = NOW() + INTERVAL '10 minutes'
    WHERE ip_address = p_ip_address::inet AND endpoint = p_endpoint;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'blocked', true,
      'reason', 'Rate limit exceeded',
      'requests', rate_record.request_count,
      'max_requests', p_max_requests,
      'retry_after', 600
    );
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'blocked', false,
    'requests', rate_record.request_count,
    'max_requests', p_max_requests,
    'remaining', p_max_requests - rate_record.request_count
  );
END;
$$;