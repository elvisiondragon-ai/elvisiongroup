-- Ensure Row Level Security is enabled on the global_product table
ALTER TABLE public.global_product ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they conflict or need to be recreated
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for anon users" ON public.global_product;


-- Policy to allow 'anon' role to INSERT into global_product
CREATE POLICY "Enable insert for anon users"
ON public.global_product
FOR INSERT
TO anon
WITH CHECK (true); -- 'true' means any anon user can insert

-- Policy to allow 'anon' role to SELECT from global_product
CREATE POLICY "Enable select for anon users"
ON public.global_product
FOR SELECT
TO anon
USING (true); -- 'true' means any anon user can select all rows. Adjust if more restrictive SELECT is needed.

-- Optional: If you also want authenticated users to INSERT and SELECT
-- DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.global_product;
-- DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.global_product;

-- CREATE POLICY "Enable insert for authenticated users"
-- ON public.global_product
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Enable select for authenticated users"
-- ON public.global_product
-- FOR SELECT
-- TO authenticated
-- USING (true);
