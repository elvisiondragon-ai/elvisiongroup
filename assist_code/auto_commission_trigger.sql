-- Trigger function to handle manual approvals (or any update to PAID)
CREATE OR REPLACE FUNCTION public.handle_successful_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_rate NUMERIC := 0.30; -- 30%
    commission_val NUMERIC;
BEGIN
    -- Check if status changed to PAID and wasn't PAID before
    IF NEW.status = 'PAID' AND (OLD.status IS NULL OR OLD.status != 'PAID') THEN
        
        -- If affiliate_id is present
        IF NEW.affiliate_id IS NOT NULL THEN
            -- Calculate commission
            commission_val := FLOOR(NEW.amount * commission_rate);
            
            -- Insert into commissions table
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.email,
                NEW.product_name,
                NEW.amount,
                commission_rate * 100,
                commission_val,
                NEW.tripay_reference, -- or merchant_ref if tripay_ref is null
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

-- Same function adapted for waiting_payment (fields are slightly different)
CREATE OR REPLACE FUNCTION public.handle_successful_waiting_payment_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_rate NUMERIC := 0.30;
    commission_val NUMERIC;
BEGIN
    -- waiting_payment uses lowercase 'paid' usually, but let's check both or standard
    -- In tripay-callback, we update to 'paid' (lowercase).
    IF (NEW.status = 'paid' OR NEW.status = 'PAID') AND (OLD.status != 'paid' AND OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            commission_val := FLOOR(NEW.amount_paid * commission_rate);
            
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.user_email,
                NEW.subscription_type, -- product name equivalent
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

-- Trigger for waiting_payment
DROP TRIGGER IF EXISTS on_payment_success_commission_waiting ON public.waiting_payment;
CREATE TRIGGER on_payment_success_commission_waiting
AFTER UPDATE ON public.waiting_payment
FOR EACH ROW
EXECUTE FUNCTION public.handle_successful_waiting_payment_commission();
