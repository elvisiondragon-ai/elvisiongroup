--EXP SYSTEM DARI 0 sampai beres, aturan database harus buat dari 0 tidak bisa tambah atau edit
-- NUCLEAR OPTION: Find and drop ALL triggers that might be causing issues
 DO $$
 DECLARE
     trigger_record RECORD;
 BEGIN
     -- Drop all triggers on user_activities, xp_transactions, and profiles
     FOR trigger_record IN
         SELECT trigger_name, event_object_table
         FROM information_schema.triggers
         WHERE trigger_schema = 'public'
         AND event_object_table IN ('user_activities', 'xp_transactions',
 'profiles')
     LOOP
         EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name
 || ' ON public.' || trigger_record.event_object_table || ' CASCADE;';
         RAISE NOTICE 'Dropped trigger: % on table: %',
 trigger_record.trigger_name, trigger_record.event_object_table;
     END LOOP;
 END $$;

 -- Drop the problematic award_xp function completely
 DROP FUNCTION IF EXISTS public.award_xp CASCADE;

 -- Create the working version with NO triggers + analytics + elite_habit
 CREATE OR REPLACE FUNCTION public.award_xp(
   p_user_id uuid,
   p_xp_amount integer,
   p_activity_type text,
   p_reason text DEFAULT NULL,
   p_metadata jsonb DEFAULT '{}'
 )
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
 AS $function$
 DECLARE
   old_level INTEGER;
   new_level INTEGER;
   old_xp INTEGER;
   new_xp INTEGER;
   level_up_occurred BOOLEAN := false;
   achievement_earned BOOLEAN := false;
   daily_xp_earned INTEGER;
   remaining_xp INTEGER;
   actual_xp_to_award INTEGER;
   daily_limit_hit BOOLEAN := false;
 BEGIN
   -- Check daily XP limit first
   SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
   FROM public.xp_transactions
   WHERE user_id = p_user_id
     AND DATE(created_at) = CURRENT_DATE;

   -- Calculate remaining XP for today
   remaining_xp := GREATEST(0, 30 - daily_xp_earned);

   -- If daily limit already reached, return early
   IF remaining_xp <= 0 THEN
     RETURN jsonb_build_object(
       'success', false,
       'reason', 'daily_limit_reached',
       'daily_xp_earned', daily_xp_earned,
       'daily_limit', 30,
       'remaining_xp', 0,
       'limit_reached', true,
       'show_notification', false
     );
   END IF;

   -- Cap XP award to remaining daily limit
   actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);
   daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;

   -- Get current profile data
   SELECT level, experience_points INTO old_level, old_xp
   FROM public.profiles WHERE user_id = p_user_id;

   -- If no profile exists, create one (KEEP YOUR PERFECT SIMPLE INSERT + analytics + elite_habit)
   IF NOT FOUND THEN
     INSERT INTO public.profiles (user_id, level, experience_points,
 total_verses, total_journal, total_elite_habit, analytics_used)
     VALUES (p_user_id, 1, 0, 0, 0, 0, 0)
     ON CONFLICT (user_id) DO NOTHING;
     old_level := 1;
     old_xp := 0;
   END IF;

   -- Calculate new XP and level
   new_xp := old_xp + actual_xp_to_award;
   new_level := public.calculate_level_from_xp(new_xp);
   level_up_occurred := new_level > old_level;

   -- Update profile with new XP, level AND increment counters (ADDED elite_habit)
   UPDATE public.profiles
   SET experience_points = new_xp,
       level = new_level,
       updated_at = now(),
       total_verses = CASE
         WHEN p_activity_type IN ('verse_completion', 'audio_completion')
 THEN COALESCE(total_verses, 0) + 1
         ELSE COALESCE(total_verses, 0)
       END,
       total_journal = CASE
         WHEN p_activity_type = 'journal_completion' THEN
 COALESCE(total_journal, 0) + 1
         ELSE COALESCE(total_journal, 0)
       END,
       total_elite_habit = CASE
         WHEN p_activity_type = 'elite_habit_completion' THEN
 COALESCE(total_elite_habit, 0) + 1
         ELSE COALESCE(total_elite_habit, 0)
       END
   WHERE user_id = p_user_id;

   -- Level 3 achievement
   IF new_level >= 3 AND old_level < 3 THEN
     UPDATE public.profiles
     SET achievements = CASE
       WHEN achievements IS NULL THEN ARRAY['level_3']
       WHEN 'level_3' = ANY(achievements) THEN achievements
       ELSE array_append(achievements, 'level_3')
     END
     WHERE user_id = p_user_id;
     achievement_earned := true;
   END IF;

   -- Insert logs (CAREFULLY - no triggers should fire)
   INSERT INTO public.user_activities (user_id, activity_type, xp_earned,
 metadata)
   VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);

   INSERT INTO public.xp_transactions (user_id, xp_amount,
 transaction_type, reason)
   VALUES (p_user_id, actual_xp_to_award, p_activity_type,
 COALESCE(p_reason, 'XP awarded'));

   -- Return result
   RETURN jsonb_build_object(
     'success', true,
     'old_xp', old_xp,
     'new_xp', new_xp,
     'xp_awarded', actual_xp_to_award,
     'requested_xp', p_xp_amount,
     'old_level', old_level,
     'new_level', new_level,
     'level_up', level_up_occurred,
     'achievement_earned', achievement_earned,
     'daily_xp_earned', daily_xp_earned + actual_xp_to_award,
     'daily_limit', 30,
     'remaining_xp', remaining_xp - actual_xp_to_award,
     'limit_reached', daily_limit_hit,
     'show_notification', daily_limit_hit
   );
 END;
 $function$;