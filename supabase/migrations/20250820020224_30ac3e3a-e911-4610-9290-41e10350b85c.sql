-- Enable RLS on tables that are missing it
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

-- Add basic policies for orders table
CREATE POLICY "Users can view their own orders" ON public.orders 
FOR SELECT USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service can insert orders" ON public.orders 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update orders" ON public.orders 
FOR UPDATE USING (true);

-- Add basic policies for packages table (public read access)
CREATE POLICY "Anyone can view packages" ON public.packages 
FOR SELECT USING (true);

-- Add basic policies for subscriptions table  
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions 
FOR SELECT USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service can insert subscriptions" ON public.subscriptions 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update subscriptions" ON public.subscriptions 
FOR UPDATE USING (true);

-- Add basic policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can insert transactions" ON public.transactions 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update transactions" ON public.transactions 
FOR UPDATE USING (true);

-- Add basic policies for user_memberships table
CREATE POLICY "Users can view their own memberships" ON public.user_memberships 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can insert memberships" ON public.user_memberships 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update memberships" ON public.user_memberships 
FOR UPDATE USING (true);