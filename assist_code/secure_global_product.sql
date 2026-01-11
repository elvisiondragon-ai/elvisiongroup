-- 1. Enable Row Level Security on the table
ALTER TABLE public.global_product ENABLE ROW LEVEL SECURITY;

-- 2. Allow ANYONE (Anonymous + Authenticated) to INSERT (Enter the table)
-- This is required for your checkout flow to work for guests.
CREATE POLICY "Enable insert for everyone" 
ON public.global_product 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 3. Allow Users to SELECT (Read) ONLY their own data
-- This prevents users from scraping emails/phones of other buyers.
-- If the user is not logged in (user_id is null), they can't see anything (which is safe).
CREATE POLICY "Enable select for users based on user_id" 
ON public.global_product 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Note: We do NOT add policies for UPDATE or DELETE. 
-- This means only your Server (Edge Functions) can update status to 'PAID' or delete records.
-- This secures your payment data.
