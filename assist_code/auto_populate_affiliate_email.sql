-- Function to automatically populate affiliate_email based on affiliate_id
-- This runs BEFORE insert, so the data is ready before the commission trigger fires.

CREATE OR REPLACE FUNCTION public.populate_affiliate_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Only attempt lookup if affiliate_id is present and email is missing
    IF NEW.affiliate_id IS NOT NULL AND NEW.affiliate_email IS NULL THEN
        
        -- Try to fetch email from auth.users (requires permission)
        -- OR from public.profiles if auth.users is restricted from this context
        -- Assuming public.profiles has user_id and email (or joined)
        
        SELECT email INTO NEW.affiliate_email
        FROM auth.users
        WHERE id = NEW.affiliate_id;
        
        -- Fallback: If auth.users access fails due to security definer issues,
        -- ensure this function is created with SECURITY DEFINER to run as owner.
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Important: SECURITY DEFINER allows accessing auth.users

-- Trigger for global_product
DROP TRIGGER IF EXISTS on_insert_populate_affiliate_email_global ON public.global_product;
CREATE TRIGGER on_insert_populate_affiliate_email_global
BEFORE INSERT ON public.global_product
FOR EACH ROW
EXECUTE FUNCTION public.populate_affiliate_email();

-- Trigger for waiting_payment
DROP TRIGGER IF EXISTS on_insert_populate_affiliate_email_waiting ON public.waiting_payment;
CREATE TRIGGER on_insert_populate_affiliate_email_waiting
BEFORE INSERT ON public.waiting_payment
FOR EACH ROW
EXECUTE FUNCTION public.populate_affiliate_email();

-- Note: You must ensure the 'affiliate_email' column exists in both tables first.
-- If not, run:
-- ALTER TABLE public.global_product ADD COLUMN IF NOT EXISTS affiliate_email TEXT;
-- ALTER TABLE public.waiting_payment ADD COLUMN IF NOT EXISTS affiliate_email TEXT;
