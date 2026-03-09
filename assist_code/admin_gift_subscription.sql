-- ADMINGIFT - mock6@yahoo.com - Ir. Budiyanto gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, user_email, tripay_reference, amount_paid, currency, days_remaining, created_at, updated_at) 
SELECT id, 'active', '1_month', now(), now() + interval '1 month', email, 'ADMINGIFT', 0, 'IDR', 
EXTRACT(epoch FROM (now() + interval '1 month' - now())) / 86400, now(), now() 
FROM auth.users WHERE email = 'mock6@yahoo.com';