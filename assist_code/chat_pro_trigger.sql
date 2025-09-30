-- Helper function to get pro status from profiles table
-- This reads from profiles which should mirror pro subscription status
CREATE OR REPLACE FUNCTION get_user_pro_status(p_user_id UUID)
RETURNS TABLE (
  is_pro BOOLEAN,
  subscription_type TEXT
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    COALESCE(ps.status = 'active' AND ps.subscription_end_date > NOW(), false) as is_pro,
    CASE 
      WHEN ps.status = 'active' AND ps.subscription_end_date > NOW() 
      THEN ps.subscription_type 
      ELSE NULL 
    END as subscription_type
  FROM pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  LIMIT 1;
$$;

-- BEFORE INSERT trigger function to enrich chat messages with pro status
CREATE OR REPLACE FUNCTION enrich_chat_message_with_pro_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_pro_data RECORD;
BEGIN
  -- Get pro status for the user
  SELECT * INTO user_pro_data 
  FROM get_user_pro_status(NEW.user_id);
  
  -- Set pro fields on the new message
  NEW.is_pro := COALESCE(user_pro_data.is_pro, false);
  NEW.subscription_type := user_pro_data.subscription_type;
  
  RETURN NEW;
END;
$$;

-- Create the BEFORE INSERT trigger on chat_messages
DROP TRIGGER IF EXISTS trigger_enrich_chat_pro_status ON public.chat_messages;

CREATE TRIGGER trigger_enrich_chat_pro_status
  BEFORE INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION enrich_chat_message_with_pro_status();

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_pro_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION enrich_chat_message_with_pro_status() TO authenticated;