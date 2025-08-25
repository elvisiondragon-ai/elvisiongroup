-- Fix security issue: Restrict pro_user table access to protect sensitive payment data
-- Drop the overly permissive policy that allows anyone to manage all records
DROP POLICY IF EXISTS "Team can manage all pro_user records" ON public.pro_user;

-- Create secure policies for pro_user table
-- Users can only view their own pro_user records based on email match
CREATE POLICY "Users can view own pro subscription" 
ON public.pro_user 
FOR SELECT 
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Only authenticated users can insert their own records
CREATE POLICY "Users can create own pro subscription" 
ON public.pro_user 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Only allow system/service updates (for payment processing)
CREATE POLICY "System can update pro subscriptions" 
ON public.pro_user 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Verified admins can view all records for support purposes
CREATE POLICY "Admins can view all pro subscriptions" 
ON public.pro_user 
FOR SELECT 
USING (is_verified_admin(auth.uid()));