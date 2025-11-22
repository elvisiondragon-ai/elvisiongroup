-- Enable Row Level Security on the global_product table
ALTER TABLE public.global_product ENABLE ROW LEVEL SECURITY;

-- Drop any existing policy with the same name if it exists (optional, for safety)
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.global_product;

-- Create a new policy to allow 'anon' role to insert into global_product
CREATE POLICY "Enable insert for anon users"
ON public.global_product
FOR INSERT
TO anon
WITH CHECK (true);

-- Optional: If you also want authenticated users to insert (e.g., after login)
-- DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.global_product;
-- CREATE POLICY "Enable insert for authenticated users"
-- ON public.global_product
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);
