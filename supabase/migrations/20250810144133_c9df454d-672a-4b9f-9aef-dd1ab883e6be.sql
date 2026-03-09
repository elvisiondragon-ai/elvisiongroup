-- Fix the notify_chat_message function to handle JWT claims properly
CREATE OR REPLACE FUNCTION public.notify_chat_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  jwt_claims json;
  user_id text;
BEGIN
  -- Safely get JWT claims
  BEGIN
    jwt_claims := current_setting('request.jwt.claims', true)::json;
    user_id := jwt_claims->>'sub';
  EXCEPTION
    WHEN OTHERS THEN
      -- If JWT claims are not available or invalid, use the user_id from the message
      user_id := NEW.user_id::text;
  END;
  
  -- Call edge function to send push notifications
  PERFORM net.http_post(
    url := 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/send-chat-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(user_id, 'anonymous')
    )::text,
    body := jsonb_build_object(
      'message_id', NEW.id,
      'sender_id', NEW.user_id,
      'sender_name', NEW.user_name,
      'message', NEW.message
    )::text
  );
  
  RETURN NEW;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS notify_chat_message_trigger ON public.chat_messages;
CREATE TRIGGER notify_chat_message_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_chat_message();