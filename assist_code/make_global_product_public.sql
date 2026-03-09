-- Make global_product publicly readable by EVERYONE (Auth + Anon)

-- 1. Enable RLS (standard practice, even if public)
ALTER TABLE public.global_product ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive SELECT policies to avoid conflicts
-- These might be hiding data from non-owners or unauthenticated users
DROP POLICY IF EXISTS "Enable select for anon users" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for admins" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for everyone" ON public.global_product;

-- 3. Create a single, permissive SELECT policy for the 'public' role
-- 'public' role in Postgres/Supabase includes both 'anon' and 'authenticated' roles.
CREATE POLICY "Enable public select"
ON public.global_product
FOR SELECT
TO public
USING (true);

-- 4. Verify policies (for your review after running)
SELECT * FROM pg_policies WHERE tablename = 'global_product';
