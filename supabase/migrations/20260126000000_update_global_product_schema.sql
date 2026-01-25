-- Create or update global_product table
CREATE TABLE IF NOT EXISTS public.global_product (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    phone text,
    email text,
    tripay_reference text,
    merchant_ref text,
    product_name text,
    status text DEFAULT 'pending'::text,
    amount integer,
    address text,
    user_id uuid,
    affiliate_id uuid,
    affiliate_email text,
    commission_rate numeric,
    fbc text,
    fbp text,
    capi_purchase_sent boolean DEFAULT false,
    ip_address text,
    user_agent text,
    CONSTRAINT global_product_pkey PRIMARY KEY (id)
);

-- Sequence setup
CREATE SEQUENCE IF NOT EXISTS public.global_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.global_product_id_seq OWNED BY public.global_product.id;

ALTER TABLE ONLY public.global_product ALTER COLUMN id SET DEFAULT nextval('public.global_product_id_seq'::regclass);

-- Enable RLS
ALTER TABLE public.global_product ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive SELECT policies to avoid conflicts
DROP POLICY IF EXISTS "Enable select for anon users" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for authenticated users" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for admins" ON public.global_product;
DROP POLICY IF EXISTS "Enable select for everyone" ON public.global_product;
DROP POLICY IF EXISTS "Enable public select" ON public.global_product;

-- Create a single, permissive SELECT policy for the 'public' role
CREATE POLICY "Enable public select"
ON public.global_product
FOR SELECT
TO public
USING (true);

-- Create a permissive INSERT policy for the 'public' role (needed for initial order creation)
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.global_product;
CREATE POLICY "Enable insert for everyone"
ON public.global_product
FOR INSERT
TO public
WITH CHECK (true);

-- Grant access
GRANT ALL ON TABLE public.global_product TO postgres;
GRANT ALL ON TABLE public.global_product TO service_role;
GRANT SELECT, INSERT ON TABLE public.global_product TO anon;
GRANT SELECT, INSERT ON TABLE public.global_product TO authenticated;
