-- Trigger function that uses the commission_rate and affiliate_email stored in the transaction row
-- This allows the Frontend/Edge Function to dictate the rate and capture the referrer's email.

CREATE OR REPLACE FUNCTION public.handle_successful_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    -- Default to 0.30 if column is null, otherwise use the row's value
    final_commission_rate NUMERIC := COALESCE(NEW.commission_rate, 0.30);
    commission_val NUMERIC;
BEGIN
    -- Check if status changed to PAID and wasn't PAID before
    IF NEW.status = 'PAID' AND (OLD.status IS NULL OR OLD.status != 'PAID') THEN
        
        -- If affiliate_id is present
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- Calculate commission based on the rate stored in the row
            commission_val := FLOOR(NEW.amount * final_commission_rate);
            
            -- Insert into commissions table
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email, -- This is the BUYER'S EMAIL (from the transaction row)
                affiliate_email, -- This is the REFERRER'S EMAIL (from the transaction row)
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.email, -- Buyer's email
                NEW.affiliate_email, -- Referrer's email (might be null if not captured)
                NEW.product_name,
                NEW.amount,
                final_commission_rate * 100, -- Store as percentage (e.g., 30 or 50)
                commission_val,
                NEW.tripay_reference, 
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for global_product
DROP TRIGGER IF EXISTS on_payment_success_commission_global ON public.global_product;
CREATE TRIGGER on_payment_success_commission_global
AFTER UPDATE ON public.global_product
FOR EACH ROW
EXECUTE FUNCTION public.handle_successful_payment_commission();

-- Same function adapted for waiting_payment
CREATE OR REPLACE FUNCTION public.handle_successful_waiting_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    -- Default to 0.30 if column is null, otherwise use the row's value
    final_commission_rate NUMERIC := COALESCE(NEW.commission_rate, 0.30);
    commission_val NUMERIC;
BEGIN
    -- waiting_payment uses lowercase 'paid' usually
    IF (NEW.status = 'paid' OR NEW.status = 'PAID') AND (OLD.status != 'paid' AND OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- Calculate commission based on the rate stored in the row
            commission_val := FLOOR(NEW.amount_paid * final_commission_rate);
            
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email, -- Buyer
                affiliate_email, -- Referrer
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.user_email, -- Buyer
                NEW.affiliate_email, -- Referrer
                NEW.subscription_type, -- product name equivalent
                NEW.amount_paid,
                final_commission_rate * 100,
                commission_val,
                NEW.tripay_reference,
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for waiting_payment
DROP TRIGGER IF EXISTS on_payment_success_commission_waiting ON public.waiting_payment;
CREATE TRIGGER on_payment_success_commission_waiting
AFTER UPDATE ON public.waiting_payment
FOR EACH ROW
EXECUTE FUNCTION public.handle_successful_waiting_payment_commission();