-- Remove all the SQL functions and table I created
-- Run this if you want to completely clean up the database

-- Drop functions
DROP FUNCTION IF EXISTS public.update_user_presence();
DROP FUNCTION IF EXISTS public.remove_user_presence();
DROP FUNCTION IF EXISTS public.cleanup_stale_presence();
DROP FUNCTION IF EXISTS public.get_online_users();
DROP FUNCTION IF EXISTS public.update_last_seen();

-- Drop trigger
DROP TRIGGER IF EXISTS trigger_update_last_seen ON public.online_users;

-- Drop table
DROP TABLE IF EXISTS public.online_users CASCADE;

-- Remove from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.online_users;

SELECT 'All online_users functions and table removed' as result;