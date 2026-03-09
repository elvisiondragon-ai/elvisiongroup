-- Add affiliate_id column to global_product if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'global_product' AND column_name = 'affiliate_id') THEN
        ALTER TABLE public.global_product ADD COLUMN affiliate_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Add affiliate_id column to waiting_payment if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waiting_payment' AND column_name = 'affiliate_id') THEN
        ALTER TABLE public.waiting_payment ADD COLUMN affiliate_id UUID REFERENCES auth.users(id);
    END IF;
END $$;
