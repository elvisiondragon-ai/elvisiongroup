-- Check for Database Triggers that might cause double-increments
-- This could be the root cause of total_journal and total_elite_habit incrementing by 2

-- 1. Check all triggers on profiles table
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement,
    t.action_condition
FROM information_schema.triggers t
WHERE t.event_object_table = 'profiles'
ORDER BY t.trigger_name;

-- 2. Check all triggers on reflections table
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement,
    t.action_condition
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY t.trigger_name;

-- 3. Check all triggers on elite_habits table
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement,
    t.action_condition
FROM information_schema.triggers t
WHERE t.event_object_table = 'elite_habits'
ORDER BY t.trigger_name;

| trigger_name                            | event_manipulation | action_timing | action_statement                                   | action_condition |
| --------------------------------------- | ------------------ | ------------- | -------------------------------------------------- | ---------------- |
| auto_populate_elite_habit_email_trigger | INSERT             | BEFORE        | EXECUTE FUNCTION auto_populate_elite_habit_email() | null             |
| handle_elite_habits_updated_at          | UPDATE             | BEFORE        | EXECUTE FUNCTION handle_updated_at()               | null             |
| sync_elite_habit_count_delete           | DELETE             | AFTER         | EXECUTE FUNCTION sync_elite_habit_count()          | null             |
| sync_elite_habit_count_insert           | INSERT             | AFTER         | EXECUTE FUNCTION sync_elite_habit_count()          | null             |
| sync_elite_habit_count_update           | UPDATE             | AFTER         | EXECUTE FUNCTION sync_elite_habit_count()          | null             |

-- 4. Check for functions that might auto-increment counters
SELECT 
    p.proname as function_name,
    p.prosrc as function_body
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND (p.prosrc ILIKE '%total_journal%' OR p.prosrc ILIKE '%total_elite_habit%')
ORDER BY p.proname;

[
  {
    "function_name": "award_audio_xp",
    "function_body": "\n  DECLARE\n      daily_total INTEGER;\n  BEGIN\n      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total\n      FROM xp_transactions\n      WHERE user_id = user_uuid\n      AND transaction_type = 'audio_completion'\n      AND created_at >= CURRENT_DATE;\n\n      IF daily_total >= 20 THEN RETURN 0; END IF;\n      IF is_journal AND minutes_listened < 60 THEN RETURN 0; END IF;\n\n      INSERT INTO xp_transactions (user_id, xp_amount, transaction_type,\n  reason)\n      VALUES (user_uuid, 10, 'audio_completion', 'Audio completed');\n\n      IF is_journal THEN\n          UPDATE profiles SET\n              total_journal_sessions = total_journal_sessions + 1,\n              last_activity_date = CURRENT_DATE\n          WHERE user_id = user_uuid;\n      ELSE\n          UPDATE profiles SET\n              total_verses_completed = total_verses_completed + 1,\n              last_activity_date = CURRENT_DATE\n          WHERE user_id = user_uuid;\n\n          UPDATE profiles SET is_zen_master = TRUE\n          WHERE user_id = user_uuid AND total_verses_completed >= 100;\n      END IF;\n\n      PERFORM update_streak(user_uuid);\n      RETURN 10;\n  END;\n  "
  },
  {
    "function_name": "award_journal_xp",
    "function_body": "\n  DECLARE\n      daily_total INTEGER;\n      last_journal TIMESTAMP;\n  BEGIN\n      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total\n      FROM xp_transactions\n      WHERE user_id = user_uuid\n      AND transaction_type = 'journal_completion'\n      AND created_at >= CURRENT_DATE;\n\n      IF daily_total >= 5 THEN RETURN 0; END IF;\n\n      SELECT MAX(created_at) INTO last_journal\n      FROM xp_transactions\n      WHERE user_id = user_uuid\n      AND transaction_type = 'journal_completion';\n\n      IF last_journal IS NOT NULL AND last_journal > NOW() - INTERVAL '1 \n  hour' THEN\n          RETURN 0;\n      END IF;\n\n      INSERT INTO xp_transactions (user_id, xp_amount, transaction_type,\n  reason)\n      VALUES (user_uuid, 5, 'journal_completion', 'Journal entry');\n\n      -- Update journal counter\n      UPDATE profiles SET\n          total_journal_sessions = total_journal_sessions + 1,\n          last_activity_date = CURRENT_DATE\n      WHERE user_id = user_uuid;\n\n      -- Update streak and check Week Warrior\n      PERFORM update_streak(user_uuid);\n\n      RETURN 5;\n  END;\n  "
  },
  {
    "function_name": "award_xp",
    "function_body": "\n  DECLARE\n    old_level INTEGER;\n    new_level INTEGER;\n    old_xp INTEGER;\n    new_xp INTEGER;\n    level_up_occurred BOOLEAN := false;\n    achievement_earned BOOLEAN := false;\n    daily_xp_earned INTEGER;\n    remaining_xp INTEGER;\n    actual_xp_to_award INTEGER;\n    daily_limit_hit BOOLEAN := false;\n  BEGIN\n    -- Check daily XP limit first\n    SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned\n    FROM public.xp_transactions\n    WHERE user_id = p_user_id\n      AND DATE(created_at) = CURRENT_DATE;\n\n    -- Calculate remaining XP for today\n    remaining_xp := GREATEST(0, 30 - daily_xp_earned);\n\n    -- If daily limit already reached, return early\n    IF remaining_xp <= 0 THEN\n      RETURN jsonb_build_object(\n        'success', false,\n        'reason', 'daily_limit_reached',\n        'daily_xp_earned', daily_xp_earned,\n        'daily_limit', 30,\n        'remaining_xp', 0,\n        'limit_reached', true,\n        'show_notification', false\n      );\n    END IF;\n\n    -- Cap XP award to remaining daily limit\n    actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);\n    daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;\n\n    -- Get current profile data\n    SELECT level, experience_points INTO old_level, old_xp\n    FROM public.profiles WHERE user_id = p_user_id;\n\n    -- If no profile exists, create one\n    IF NOT FOUND THEN\n      INSERT INTO public.profiles (user_id, level, experience_points,\n  total_verses, total_journal)\n      VALUES (p_user_id, 1, 0, 0, 0)\n      ON CONFLICT (user_id) DO NOTHING;\n      old_level := 1;\n      old_xp := 0;\n    END IF;\n\n    -- Calculate new XP and level\n    new_xp := old_xp + actual_xp_to_award;\n    new_level := public.calculate_level_from_xp(new_xp);\n    level_up_occurred := new_level > old_level;\n\n    -- Update profile with new XP, level AND increment counters\n    UPDATE public.profiles\n    SET experience_points = new_xp,\n        level = new_level,\n        updated_at = now(),\n        total_verses = CASE\n          WHEN p_activity_type IN ('verse_completion', 'audio_completion')\n  THEN COALESCE(total_verses, 0) + 1\n          ELSE COALESCE(total_verses, 0)\n        END,\n        total_journal = CASE\n          WHEN p_activity_type = 'journal_completion' THEN\n  COALESCE(total_journal, 0) + 1\n          ELSE COALESCE(total_journal, 0)\n        END\n    WHERE user_id = p_user_id;\n\n    -- Level 3 achievement\n    IF new_level >= 3 AND old_level < 3 THEN\n      UPDATE public.profiles\n      SET achievements = CASE\n        WHEN achievements IS NULL THEN ARRAY['level_3']\n        WHEN 'level_3' = ANY(achievements) THEN achievements\n        ELSE array_append(achievements, 'level_3')\n      END\n      WHERE user_id = p_user_id;\n      achievement_earned := true;\n    END IF;\n\n    -- Insert logs (CAREFULLY - no triggers should fire)\n    INSERT INTO public.user_activities (user_id, activity_type, xp_earned,\n  metadata)\n    VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);\n\n    INSERT INTO public.xp_transactions (user_id, xp_amount,\n  transaction_type, reason)\n    VALUES (p_user_id, actual_xp_to_award, p_activity_type,\n  COALESCE(p_reason, 'XP awarded'));\n\n    -- Return result\n    RETURN jsonb_build_object(\n      'success', true,\n      'old_xp', old_xp,\n      'new_xp', new_xp,\n      'xp_awarded', actual_xp_to_award,\n      'requested_xp', p_xp_amount,\n      'old_level', old_level,\n      'new_level', new_level,\n      'level_up', level_up_occurred,\n      'achievement_earned', achievement_earned,\n      'daily_xp_earned', daily_xp_earned + actual_xp_to_award,\n      'daily_limit', 30,\n      'remaining_xp', remaining_xp - actual_xp_to_award,\n      'limit_reached', daily_limit_hit,\n      'show_notification', daily_limit_hit\n    );\n  END;\n  "
  },
  {
    "function_name": "check_and_award_achievements",
    "function_body": "\nDECLARE\n  user_profile RECORD;\n  current_achievements TEXT[];\n  new_achievements TEXT[] := ARRAY[]::TEXT[];\nBEGIN\n  -- Get current profile data\n  SELECT * INTO user_profile \n  FROM profiles \n  WHERE user_id = user_id_param;\n  \n  current_achievements := COALESCE(user_profile.achievements, ARRAY[]::TEXT[]);\n  \n  -- Check for 7-day streak achievement\n  IF user_profile.streak_days >= 7 AND NOT ('7_day_streak' = ANY(current_achievements)) THEN\n    new_achievements := array_append(new_achievements, '7_day_streak');\n  END IF;\n  \n  -- Check for Zen Master achievement (100 journal entries)\n  IF user_profile.total_journal >= 100 AND NOT ('zen_master' = ANY(current_achievements)) THEN\n    new_achievements := array_append(new_achievements, 'zen_master');\n  END IF;\n  \n  -- Update achievements if new ones found\n  IF array_length(new_achievements, 1) > 0 THEN\n    UPDATE profiles \n    SET achievements = array_cat(current_achievements, new_achievements)\n    WHERE user_id = user_id_param;\n    \n    -- Log achievement awards\n    INSERT INTO user_activities (user_id, activity_type, metadata)\n    VALUES (user_id_param, 'achievement_unlocked', jsonb_build_object('achievements', new_achievements));\n  END IF;\nEND;\n"
  },
  {
    "function_name": "handle_xp_transaction_trigger",
    "function_body": "\nBEGIN\n  -- Handle verse completion (audio completion)\n  IF NEW.activity_type = 'audio_completion' THEN\n    PERFORM increment_total_verses(NEW.user_id);\n  END IF;\n  \n  -- Handle journal completion \n  IF NEW.activity_type IN ('journal_completion', 'journal_spiritual') THEN\n    PERFORM increment_total_journal(NEW.user_id, NEW.activity_type);\n  END IF;\n  \n  -- Update streak and check achievements after any XP transaction\n  PERFORM update_user_streak(NEW.user_id);\n  PERFORM check_and_award_achievements(NEW.user_id);\n  \n  RETURN NEW;\nEND;\n"
  },
  {
    "function_name": "increment_total_journal",
    "function_body": "\nBEGIN\n  UPDATE profiles \n  SET total_journal = COALESCE(total_journal, 0) + 1\n  WHERE user_id = user_id_param;\n  \n  -- Log the update\n  INSERT INTO user_activities (user_id, activity_type, metadata)\n  VALUES (user_id_param, 'journal_completion', jsonb_build_object('source', source_type));\nEND;\n"
  },
  {
    "function_name": "sync_elite_habit_count",
    "function_body": "\nBEGIN\n    -- Update the profiles table with the new count for the affected user\n    UPDATE public.profiles\n    SET total_elite_habit = (\n        SELECT COUNT(*)\n        FROM public.elite_habits\n        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)\n    )\n    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);\n\n    RETURN COALESCE(NEW, OLD);\nEND;\n"
  },
  {
    "function_name": "update_total_journal_count",
    "function_body": "\nBEGIN\n    -- Update total_journal count in profiles table\n    UPDATE profiles\n    SET total_journal = (\n        SELECT COUNT(*)\n        FROM reflections\n        WHERE user_id = NEW.user_id\n    )\n    WHERE user_id = NEW.user_id;\n\n    RETURN NEW;\nEND;\n"
  },
  {
    "function_name": "update_total_journal_count_delete",
    "function_body": "\nBEGIN\n    -- Update total_journal count in profiles table\n    UPDATE profiles\n    SET total_journal = (\n        SELECT COUNT(*)\n        FROM reflections\n        WHERE user_id = OLD.user_id\n    )\n    WHERE user_id = OLD.user_id;\n\n    RETURN OLD;\nEND;\n"
  }
]

-- 5. Check if there are RLS policies affecting these operations
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'reflections', 'elite_habits')
ORDER BY tablename, policyname;
[
  {
    "schemaname": "public",
    "tablename": "elite_habits",
    "policyname": "Users can delete own elite habits",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "elite_habits",
    "policyname": "Users can insert own elite habits",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "elite_habits",
    "policyname": "Users can update own elite habits",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "elite_habits",
    "policyname": "Users can view own elite habits",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "elite_habits",
    "policyname": "elite_habits_insert",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Auth users can view profiles",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "true",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Users can insert their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Users can manage own profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Users can only access their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Users can update their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = user_id)",
    "with_check": "(auth.uid() = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "Users can view their own profile",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "profiles_update",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(auth.uid() = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "reflections",
    "policyname": "Users can delete own reflections",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((auth.uid())::text = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "reflections",
    "policyname": "Users can insert own reflections",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((auth.uid())::text = user_id)"
  },
  {
    "schemaname": "public",
    "tablename": "reflections",
    "policyname": "Users can select own reflections",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((auth.uid())::text = user_id)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "reflections",
    "policyname": "Users can update own reflections",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((auth.uid())::text = user_id)",
    "with_check": "((auth.uid())::text = user_id)"
  }
]

-- 6. Check for any foreign key constraints or references
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND (tc.table_name IN ('profiles', 'reflections', 'elite_habits')
       OR ccu.table_name IN ('profiles', 'reflections', 'elite_habits'));