-- Fix RLS policies for reflections table to handle UUID/TEXT type mismatch
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can create their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON public.reflections;

-- Recreate policies with proper type casting
CREATE POLICY "Users can view their own reflections"
ON public.reflections
FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own reflections"
ON public.reflections
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own reflections"
ON public.reflections
FOR UPDATE
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own reflections"
ON public.reflections
FOR DELETE
USING (auth.uid()::text = user_id::text);