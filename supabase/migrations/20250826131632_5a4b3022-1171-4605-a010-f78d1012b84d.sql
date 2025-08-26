-- Fix XP/Level system and create comprehensive days_remaining management
-- PART 1: Fix the XP level calculation issue

-- Fix award_xp function to properly update level when XP threshold is reached
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_total_xp INTEGER;
  new_level INTEGER;
  old_level INTEGER;
  old_xp INTEGER;
BEGIN
  -- Get current level and XP
  SELECT level, experience_points INTO old_level, old_xp 
  FROM public.profiles WHERE user_id = p_user_id;
  
  -- Update experience points
  UPDATE public.profiles 
  SET experience_points = experience_points + p_xp_amount,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING experience_points INTO new_total_xp;
  
  -- Calculate new level based on total XP
  new_level := public.calculate_level_from_xp(new_total_xp);
  
  -- Update level if changed
  IF new_level != old_level THEN
    UPDATE public.profiles 
    SET level = new_level,
        updated_at = now()
    WHERE user_id = p_user_id;
    
    -- Log level up
    INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
    VALUES (p_user_id, 'level_up', 0, jsonb_build_object('old_level', old_level, 'new_level', new_level, 'total_xp', new_total_xp));
  END IF;
  
  -- Log the activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_metadata);
  
  -- Log the XP transaction
  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, p_xp_amount, 'earned', COALESCE(p_reason, p_activity_type));
END;
$$;

-- PART 2: Create days_remaining table and management system

-- Add days_remaining column to pro_subscriptions if it doesn't exist
ALTER TABLE public.pro_subscriptions 
ADD COLUMN IF NOT EXISTS days_remaining INTEGER;

-- Create comprehensive days_remaining table
CREATE TABLE IF NOT EXISTS public.days_remaining (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_id UUID REFERENCES public.pro_subscriptions(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('trial', 'monthly', 'yearly')),
  days_remaining INTEGER NOT NULL DEFAULT 0,
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  trial_start_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.days_remaining ENABLE ROW LEVEL SECURITY;

-- RLS policies for days_remaining table
CREATE POLICY "Verified admins can manage days_remaining" ON public.days_remaining
  FOR ALL USING (is_verified_admin(auth.uid()));

CREATE POLICY "Users can view their own days_remaining" ON public.days_remaining
  FOR SELECT USING (auth.uid() = user_id);

-- Remove the old duplicate trigger 
DROP TRIGGER IF EXISTS update_days_remaining_trigger ON public.pro_subscriptions;