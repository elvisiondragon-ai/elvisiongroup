-- Disable the blocking chat notification trigger that causes 10-second delays
-- This trigger calls an edge function that times out and blocks message inserts

DROP TRIGGER IF EXISTS on_chat_message_created ON public.chat_messages;

-- Optionally drop the function too since it's causing issues
DROP FUNCTION IF EXISTS public.notify_chat_message();

-- Note: If you want chat notifications later, implement them asynchronously
-- via client-side calls or non-blocking triggers