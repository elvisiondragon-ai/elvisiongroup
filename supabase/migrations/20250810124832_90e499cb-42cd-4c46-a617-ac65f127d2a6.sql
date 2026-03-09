-- Create user_activities table to track XP earning activities
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create xp_transactions table to log all XP gains
CREATE TABLE public.xp_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  xp_amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  reason TEXT,
  activity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_activities
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.user_activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for xp_transactions
CREATE POLICY "Users can view their own XP transactions" 
ON public.xp_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own XP transactions" 
ON public.xp_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER := 1;
  xp_needed INTEGER := 100;
  current_xp INTEGER := total_xp;
BEGIN
  WHILE current_xp >= xp_needed LOOP
    current_xp := current_xp - xp_needed;
    level := level + 1;
    
    -- XP requirements per level
    IF level <= 3 THEN
      xp_needed := 100;
    ELSIF level <= 6 THEN
      xp_needed := 150;
    ELSIF level <= 10 THEN
      xp_needed := 200;
    ELSE
      xp_needed := 250;
    END IF;
  END LOOP;
  
  RETURN level;
END;
$$ LANGUAGE plpgsql;

-- Function to get XP needed for next level
CREATE OR REPLACE FUNCTION public.get_xp_for_next_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF current_level <= 3 THEN
    RETURN 100;
  ELSIF current_level <= 6 THEN
    RETURN 150;
  ELSIF current_level <= 10 THEN
    RETURN 200;
  ELSE
    RETURN 250;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to award XP and update level
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id UUID,
  p_xp_amount INTEGER,
  p_activity_type TEXT,
  p_reason TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
DECLARE
  new_total_xp INTEGER;
  new_level INTEGER;
  old_level INTEGER;
BEGIN
  -- Get current level
  SELECT level INTO old_level FROM public.profiles WHERE user_id = p_user_id;
  
  -- Update experience points
  UPDATE public.profiles 
  SET experience_points = experience_points + p_xp_amount,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING experience_points INTO new_total_xp;
  
  -- Calculate new level
  new_level := public.calculate_level_from_xp(new_total_xp);
  
  -- Update level if changed
  IF new_level != old_level THEN
    UPDATE public.profiles 
    SET level = new_level,
        updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Log the activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_metadata);
  
  -- Log the XP transaction
  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, p_xp_amount, 'earned', COALESCE(p_reason, p_activity_type));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check daily chat limit
CREATE OR REPLACE FUNCTION public.check_daily_chat_limit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  daily_chat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO daily_chat_count
  FROM public.user_activities
  WHERE user_id = p_user_id
    AND activity_type = 'chat_message'
    AND created_at >= CURRENT_DATE;
    
  RETURN daily_chat_count < 10;
END;
$$ LANGUAGE plpgsql;