-- 1. FIX THE TRIGGER LOGIC (Force Email Lookup + 50% Rule)
CREATE OR REPLACE FUNCTION public.handle_successful_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_rate NUMERIC := 0.30;
    commission_val NUMERIC;
    fetched_affiliate_email TEXT;
BEGIN
    -- Check if status changed to PAID
    IF NEW.status = 'PAID' AND (OLD.status IS NULL OR OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- RULE: Uang Panas = 50%
            IF NEW.product_name ILIKE '%Uang Panas%' OR NEW.product_name ILIKE '%ebook_uangpanas%' THEN
                commission_rate := 0.50;
            END IF;

            -- Calculate Amount
            commission_val := FLOOR(NEW.amount * commission_rate);
            
            -- LOOKUP EMAIL DIRECTLY FROM AUTH.USERS
            -- This ensures we get the email even if global_product is missing it
            SELECT email INTO fetched_affiliate_email
            FROM auth.users
            WHERE id = NEW.affiliate_id;

            -- Insert Record
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                affiliate_email, -- Uses the fetched email
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.email,
                fetched_affiliate_email, 
                NEW.product_name,
                NEW.amount,
                commission_rate * 100,
                commission_val,
                NEW.tripay_reference,
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach Trigger to global_product
DROP TRIGGER IF EXISTS on_payment_success_commission_global ON public.global_product;
CREATE TRIGGER on_payment_success_commission_global
AFTER UPDATE ON public.global_product
FOR EACH ROW
EXECUTE FUNCTION public.handle_successful_payment_commission();


-- 2. APPLY SAME FIX TO WAITING_PAYMENT (Digital Products)
CREATE OR REPLACE FUNCTION public.handle_successful_waiting_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_rate NUMERIC := 0.30;
    commission_val NUMERIC;
    fetched_affiliate_email TEXT;
BEGIN
    IF (NEW.status = 'paid' OR NEW.status = 'PAID') AND (OLD.status != 'paid' AND OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- RULE: Uang Panas = 50%
            IF (NEW.subscription_type IS NOT NULL AND (NEW.subscription_type = 'ebook_uangpanas' OR NEW.subscription_type ILIKE '%Uang Panas%')) THEN
                 commission_rate := 0.50;
            END IF;

            commission_val := FLOOR(NEW.amount_paid * commission_rate);
            
            -- LOOKUP EMAIL
            SELECT email INTO fetched_affiliate_email
            FROM auth.users
            WHERE id = NEW.affiliate_id;
            
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                affiliate_email,
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.user_email,
                fetched_affiliate_email,
                NEW.subscription_type,
                NEW.amount_paid,
                commission_rate * 100,
                commission_val,
                NEW.tripay_reference,
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach Trigger to waiting_payment
DROP TRIGGER IF EXISTS on_payment_success_commission_waiting ON public.waiting_payment;
CREATE TRIGGER on_payment_success_commission_waiting
AFTER UPDATE ON public.waiting_payment
FOR EACH ROW
EXECUTE FUNCTION public.handle_successful_waiting_payment_commission();


-- 3. REPAIR EXISTING DATA (Backfill missing emails)
UPDATE public.commissions c
SET affiliate_email = u.email
FROM auth.users u
WHERE c.affiliate_user_id = u.id
AND (c.affiliate_email IS NULL OR c.affiliate_email = '');
