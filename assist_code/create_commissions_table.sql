-- Create the 'commissions' table
CREATE TABLE public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_user_id UUID NOT NULL REFERENCES auth.users(id),
    user_email TEXT NOT NULL, -- Added user_email column
    product_name TEXT NOT NULL,
    sale_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    sale_amount NUMERIC NOT NULL,
    commission_percentage NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    transaction_id TEXT, -- Optional: to link to a specific payment transaction
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) for the 'commissions' table
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to view their own commissions
CREATE POLICY "Users can view their own commissions."
ON public.commissions FOR SELECT
TO authenticated
USING (auth.uid() = affiliate_user_id);

-- Create a policy to allow inserts only if the affiliate_user_id matches the authenticated user (or via a service role for backend inserts)
-- For backend inserts (e.g., from a Supabase Function), you might use the service role.
-- For frontend, this would typically be managed by an API.
-- For now, let's assume inserts will primarily come from a backend service.
-- If you need to allow authenticated users to *insert* their own commission records from the client,
-- you would need a more complex policy, likely involving a function to verify the sale.
-- For this setup, we'll keep it restricted, assuming backend logic handles inserts.
CREATE POLICY "Affiliates cannot directly insert commissions from client-side."
ON public.commissions FOR INSERT
TO authenticated
WITH CHECK (FALSE); -- Prevents direct client-side inserts by authenticated users

-- You might need an additional policy for your backend service to insert data,
-- for example, using a service role or a specific Supabase function.
-- Example of a policy for a Supabase function (assuming it runs with service role):
-- This policy allows the service role to insert. If your function is not
-- using the service role, it would need to be re-evaluated.
-- It's common to handle inserts via a privileged function/webhook.