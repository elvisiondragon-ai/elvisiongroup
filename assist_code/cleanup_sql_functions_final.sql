-- Remove all the SQL functions and table I created (FINAL FIXED VERSION)
-- Drop in correct order to handle dependencies

-- Drop trigger first (depends on function)
DROP TRIGGER IF EXISTS trigger_update_last_seen ON public.online_users;

-- Drop function after trigger is removed
DROP FUNCTION IF EXISTS public.update_last_seen();

-- Drop other functions
DROP FUNCTION IF EXISTS public.update_user_presence();
DROP FUNCTION IF EXISTS public.remove_user_presence(); 
DROP FUNCTION IF EXISTS public.cleanup_stale_presence();
DROP FUNCTION IF EXISTS public.get_online_users();

-- Drop table
DROP TABLE IF EXISTS public.online_users CASCADE;

-- Remove from realtime publication (safer way)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE tablename = 'online_users'
    ) THEN
        ALTER PUBLICATION supabase_realtime DROP TABLE public.online_users;
    END IF;
END $$;

SELECT 'All online_users functions and table removed' as result;