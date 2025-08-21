-- Fix the audit function for VIP subscriptions (remove email reference)
CREATE OR REPLACE FUNCTION public.audit_vip_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log subscription status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM public.log_sensitive_action(
      'vip_subscription_status_change',
      'vip_subscriptions',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'user_id', NEW.user_id
      )
    );
  END IF;
  
  -- Log new subscriptions
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'vip_subscription_created',
      'vip_subscriptions',
      NEW.id,
      jsonb_build_object(
        'subscription_type', NEW.subscription_type,
        'user_id', NEW.user_id
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Now grant hendi a 30-day subscription and pro status
INSERT INTO vip_subscriptions (
  user_id, 
  subscription_type, 
  status, 
  subscription_start_date, 
  subscription_end_date,
  amount_paid,
  currency
) VALUES (
  '8fa357c9-4450-4e90-b3c9-6886f7159287'::uuid,
  'monthly',
  'active',
  now(),
  now() + interval '30 days',
  25000,
  'IDR'
);