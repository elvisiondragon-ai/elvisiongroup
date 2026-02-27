

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "public";






CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";






CREATE TYPE "public"."subscription_status" AS ENUM (
    'active',
    'expired',
    'cancelled',
    'pending_payment'
);


ALTER TYPE "public"."subscription_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."activate_pro_subscription"("p_tripay_reference" "text", "p_payment_method" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  waiting_record RECORD;
  existing_sub RECORD;
  subscription_id UUID;
  days_to_add INTEGER;
  correct_amount NUMERIC;
BEGIN
  -- Get waiting payment record
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Waiting payment not found for reference: %', p_tripay_reference;
  END IF;
  
  -- Get correct amount
  correct_amount := CASE waiting_record.subscription_type
      WHEN '1_day' THEN 4000
      WHEN '1_week' THEN 30000
      WHEN '1_month' THEN 100000
      WHEN '1_year' THEN 800000
      ELSE 100000
  END;
  
  -- Get days
  days_to_add := CASE waiting_record.subscription_type
      WHEN '1_day' THEN 1
      WHEN '1_week' THEN 7
      WHEN '1_month' THEN 30
      WHEN '1_year' THEN 365
      ELSE 30
  END;
  
  -- Check if user has active subscription
  SELECT * INTO existing_sub
  FROM public.pro_subscriptions
  WHERE user_id = waiting_record.user_id AND status = 'active';
  
  IF existing_sub.id IS NOT NULL THEN
    -- OVERRIDE existing subscription
    UPDATE public.pro_subscriptions 
    SET 
        subscription_end_date = NOW() + (days_to_add || ' days')::INTERVAL,
        subscription_type = waiting_record.subscription_type,
        amount_paid = correct_amount,
        tripay_reference = p_tripay_reference,
        customer_phone = waiting_record.customer_phone,
        days_remaining = days_to_add,
        updated_at = NOW()
    WHERE id = existing_sub.id;
    
    subscription_id := existing_sub.id;
    
  ELSE
    -- CREATE new subscription
    INSERT INTO public.pro_subscriptions (
      user_id, user_email, customer_phone, subscription_type,
      amount_paid, currency, status, tripay_reference,
      subscription_start_date, subscription_end_date, days_remaining,
      ip_address, verse_access, pro_badge, created_at, updated_at
    ) VALUES (
      waiting_record.user_id, waiting_record.user_email, waiting_record.customer_phone,
      waiting_record.subscription_type, correct_amount, waiting_record.currency,
      'active', p_tripay_reference, NOW(), 
      NOW() + (days_to_add || ' days')::INTERVAL, days_to_add,
      waiting_record.ip_address, true, true, NOW(), NOW()
    ) RETURNING id INTO subscription_id;
  END IF;
  
  -- Delete from waiting_payment
  DELETE FROM public.waiting_payment WHERE tripay_reference = p_tripay_reference;
  
  RETURN subscription_id;
END;
$$;


ALTER FUNCTION "public"."activate_pro_subscription"("p_tripay_reference" "text", "p_payment_method" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_achievement"("user_id" "uuid", "achievement" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE profiles 
  SET achievements = array_append(achievements, achievement),
      updated_at = NOW()
  WHERE profiles.user_id = add_achievement.user_id 
  AND NOT (achievements @> ARRAY[achievement]);
END;
$$;


ALTER FUNCTION "public"."add_achievement"("user_id" "uuid", "achievement" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_pro_user_by_email"("p_email" "text", "p_subscription_type" "text" DEFAULT 'monthly'::"text", "p_duration_days" integer DEFAULT 30) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_record RECORD;
  start_date TIMESTAMPTZ;
  end_date TIMESTAMPTZ;
  result jsonb;
BEGIN
  -- Calculate dates
  start_date := now();
  end_date := start_date + (p_duration_days || ' days')::INTERVAL;
  
  -- Get user info if they exist
  SELECT u.id, p.display_name INTO user_record
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.email = p_email;
  
  -- Insert/update pro_user record
  INSERT INTO public.pro_user (
    email,
    status,
    subscription_type,
    start_date,
    end_date,
    amount,
    currency,
    payment_method
  ) VALUES (
    p_email,
    'active',
    p_subscription_type,
    start_date,
    end_date,
    CASE 
      WHEN p_subscription_type = 'yearly' THEN 1200000.00  -- 1.2M IDR yearly
      ELSE 100000.00  -- 100K IDR monthly
    END,
    'IDR',
    'Manual Grant'
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    status = 'active',
    subscription_type = EXCLUDED.subscription_type,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    amount = EXCLUDED.amount,
    updated_at = now();
  
  -- If user exists, create/update pro_subscription record and sync pro status
  IF user_record.id IS NOT NULL THEN
    -- Create pro_subscription record
    INSERT INTO public.pro_subscriptions (
      user_id,
      user_email,
      subscription_type,
      status,
      subscription_start_date,
      subscription_end_date,
      amount_paid,
      currency
    ) VALUES (
      user_record.id,
      p_email,
      p_subscription_type,
      'active',
      start_date,
      end_date,
      CASE 
        WHEN p_subscription_type = 'yearly' THEN 1200000.00
        ELSE 100000.00
      END,
      'IDR'
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      subscription_type = EXCLUDED.subscription_type,
      status = 'active',
      subscription_start_date = EXCLUDED.subscription_start_date,
      subscription_end_date = EXCLUDED.subscription_end_date,
      amount_paid = EXCLUDED.amount_paid,
      updated_at = now();
    
    -- Sync pro status to add 'pro' achievement
    PERFORM public.sync_pro_status_from_subscription(user_record.id);
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Pro status granted successfully',
      'user_found', true,
      'user_id', user_record.id,
      'display_name', user_record.display_name,
      'email', p_email,
      'subscription_type', p_subscription_type,
      'start_date', start_date,
      'end_date', end_date
    );
  ELSE
    result := jsonb_build_object(
      'success', true,
      'message', 'Pro user record created (user not yet registered)',
      'user_found', false,
      'email', p_email,
      'subscription_type', p_subscription_type,
      'start_date', start_date,
      'end_date', end_date,
      'note', 'Pro status will activate when user registers'
    );
  END IF;
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."add_pro_user_by_email"("p_email" "text", "p_subscription_type" "text", "p_duration_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_payout_queue_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  normalized_status text;
BEGIN
  normalized_status := btrim(NEW.status);
  IF normalized_status IS NULL OR normalized_status = '' THEN
    RAISE EXCEPTION 'status cannot be empty';
  END IF;

  CASE lower(normalized_status)
    WHEN 'paid' THEN normalized_status := 'Paid';
    WHEN 'pending' THEN normalized_status := 'pending';
    WHEN 'failed' THEN normalized_status := 'Failed';
    ELSE
      normalized_status := initcap(normalized_status);
  END CASE;

  UPDATE public.withdrawals w
  SET status = normalized_status,
      updated_at = now()
  WHERE w.id = OLD.id;

  NEW.status := normalized_status;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."admin_payout_queue_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_system_health_check"() RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  health_report jsonb;
  super_admin_count integer;
  expired_roles_count integer;
  suspicious_activity_count integer;
BEGIN
  -- Count active super admins
  SELECT COUNT(*) INTO super_admin_count
  FROM public.admin_roles
  WHERE role = 'super_admin' 
  AND is_active = true 
  AND (expires_at IS NULL OR expires_at > now());
  
  -- Count expired but still active roles
  SELECT COUNT(*) INTO expired_roles_count
  FROM public.admin_roles
  WHERE is_active = true 
  AND expires_at IS NOT NULL 
  AND expires_at <= now();
  
  -- Count suspicious admin activity in last 24 hours
  SELECT COUNT(*) INTO suspicious_activity_count
  FROM public.security_audit_log
  WHERE action LIKE '%admin%'
  AND created_at > (now() - interval '24 hours')
  AND metadata->>'suspicious_activity' = 'true';
  
  health_report := jsonb_build_object(
    'timestamp', now(),
    'super_admin_count', super_admin_count,
    'expired_roles_count', expired_roles_count,
    'suspicious_activity_count', suspicious_activity_count,
    'status', CASE 
      WHEN super_admin_count = 0 THEN 'CRITICAL'
      WHEN expired_roles_count > 0 THEN 'WARNING'
      WHEN suspicious_activity_count > 5 THEN 'WARNING'
      ELSE 'HEALTHY'
    END,
    'recommendations', CASE
      WHEN super_admin_count = 0 THEN jsonb_build_array('No active super admins - system locked')
      WHEN expired_roles_count > 0 THEN jsonb_build_array('Clean up expired admin roles')
      WHEN suspicious_activity_count > 5 THEN jsonb_build_array('Review suspicious admin activity')
      ELSE jsonb_build_array('System operating normally')
    END
  );
  
  -- Log health check
  PERFORM public.log_sensitive_action(
    'admin_system_health_check',
    'admin_roles',
    NULL,
    health_report
  );
  
  RETURN health_report;
END;
$$;


ALTER FUNCTION "public"."admin_system_health_check"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_chat_access"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log chat message creation for monitoring
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_data_access(
      'chat_messages',
      'message_sent',
      NEW.id,
      jsonb_build_object(
        'channel_id', NEW.channel_id,
        'message_length', length(NEW.message)
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."audit_chat_access"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_payment_access"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log payment transaction access
  IF TG_OP = 'SELECT' THEN
    PERFORM public.log_data_access(
      'payment_transactions',
      'access',
      OLD.id,
      jsonb_build_object(
        'amount', OLD.amount,
        'status', OLD.status
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."audit_payment_access"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_payment_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log any changes to payment transactions
  IF TG_OP = 'UPDATE' THEN
    PERFORM public.log_sensitive_action(
      'payment_transaction_updated',
      'payment_transactions',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'old_amount', OLD.amount,
        'new_amount', NEW.amount,
        'updated_by', auth.uid()
      )
    );
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'payment_transaction_created',
      'payment_transactions',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'payment_method', NEW.payment_method,
        'created_by', auth.uid()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."audit_payment_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_pro_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log subscription status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    PERFORM public.log_sensitive_action(
      'pro_subscription_status_change',
      'pro_subscriptions',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'user_id', NEW.user_id,
        'user_email', NEW.user_email
      )
    );
  END IF;
  
  -- Log new subscriptions
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'pro_subscription_created',
      'pro_subscriptions',
      NEW.id,
      jsonb_build_object(
        'subscription_type', NEW.subscription_type,
        'user_id', NEW.user_id,
        'user_email', NEW.user_email
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."audit_pro_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_subscription_access"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log VIP subscription access
  IF TG_OP = 'SELECT' THEN
    PERFORM public.log_data_access(
      'vip_subscriptions',
      'subscription_access',
      OLD.id,
      jsonb_build_object(
        'subscription_type', OLD.subscription_type,
        'status', OLD.status
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."audit_subscription_access"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."audit_vip_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."audit_vip_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_activate_subscription"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  BEGIN
    -- Auto-activate paid subscriptions when inserted
    IF NEW.subscription_type IN ('1_day', '1_week', '1_month', '1_year')
       AND NEW.status = 'pending'
       AND NEW.subscription_end_date IS NULL THEN

      NEW.status := 'active';
      NEW.subscription_start_date := now();
      NEW.subscription_end_date := now() +
        CASE NEW.subscription_type
          WHEN '1_day' THEN INTERVAL '1 day'
          WHEN '1_week' THEN INTERVAL '1 week'
          WHEN '1_month' THEN INTERVAL '1 month'
          WHEN '1_year' THEN INTERVAL '1 year'
        END;
      NEW.verse_access := true;
      NEW.pro_badge := true;
    END IF;

    RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."auto_activate_subscription"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_cleanup_pro_on_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- If status changed to cancelled, delete the record
  IF NEW.status = 'cancelled' THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  -- If days_remaining becomes 0 or negative, delete the record
  IF NEW.days_remaining <= 0 THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  -- If subscription_end_date is past, delete the record
  IF NEW.subscription_end_date < now() THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  RETURN NEW; -- Allow normal update
END;
$$;


ALTER FUNCTION "public"."auto_cleanup_pro_on_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_expire_pro_users"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
  DECLARE
    expired_count INTEGER;
  BEGIN
    DELETE FROM pro_subscriptions
    WHERE subscription_end_date <= NOW()
    AND status = 'active';

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
  END;
  $$;


ALTER FUNCTION "public"."auto_expire_pro_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_populate_elite_habit_email"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Only populate if user_email is NULL and we have a user_id
    IF NEW.user_email IS NULL AND NEW.user_id IS NOT NULL THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;

        -- If no email found, leave as NULL (don't break the insert)
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_populate_elite_habit_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."auto_sync_profile_metadata"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Only sync if essential fields changed
  IF (TG_OP = 'INSERT') OR 
     (OLD.display_name IS DISTINCT FROM NEW.display_name) OR
     (OLD.level IS DISTINCT FROM NEW.level) OR
     (OLD.is_pro IS DISTINCT FROM NEW.is_pro) OR
     (OLD.achievements IS DISTINCT FROM NEW.achievements) OR
     (OLD.subscription_type IS DISTINCT FROM NEW.subscription_type) THEN
    
    -- Update user metadata with essential fields only
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'display_name', NEW.display_name,
        'level', NEW.level,
        'is_pro', COALESCE(NEW.is_pro, false),
        'achievements', CASE 
          WHEN NEW.achievements IS NOT NULL THEN to_jsonb(NEW.achievements)
          ELSE '[]'::jsonb
        END,
        'subscription_type', NEW.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint,
        'sync_version', '4.0'
      )
    WHERE id = NEW.user_id;
    
    RAISE NOTICE 'Auto-synced profile metadata v4.0 for user: % (operation: %)', NEW.user_id, TG_OP;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_sync_profile_metadata"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_audio_xp"("user_uuid" "uuid", "is_journal" boolean DEFAULT false, "minutes_listened" integer DEFAULT 0) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  DECLARE
      xp_result jsonb;
  BEGIN
      -- Call the new XP awarding function with limit
      xp_result := public.award_xp_with_limit(
          user_uuid,
          10, -- XP amount for audio completion
          'audio_completion',
          'Audio completed',
          jsonb_build_object('is_journal', is_journal, 'minutes_listened', minutes_listened)
      );

      -- Return the XP awarded (or 0 if limited)
      RETURN (xp_result->>'xp_awarded')::integer;
  END;
$$;


ALTER FUNCTION "public"."award_audio_xp"("user_uuid" "uuid", "is_journal" boolean, "minutes_listened" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_journal_xp"("user_uuid" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
  DECLARE
      daily_total INTEGER;
      last_journal TIMESTAMP;
  BEGIN
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total
      FROM xp_transactions
      WHERE user_id = user_uuid
      AND transaction_type = 'journal_completion'
      AND created_at >= CURRENT_DATE;

      IF daily_total >= 5 THEN RETURN 0; END IF;

      SELECT MAX(created_at) INTO last_journal
      FROM xp_transactions
      WHERE user_id = user_uuid
      AND transaction_type = 'journal_completion';

      IF last_journal IS NOT NULL AND last_journal > NOW() - INTERVAL '1 
  hour' THEN
          RETURN 0;
      END IF;

      INSERT INTO xp_transactions (user_id, xp_amount, transaction_type,
  reason)
      VALUES (user_uuid, 5, 'journal_completion', 'Journal entry');

      -- Update journal counter
      UPDATE profiles SET
          total_journal_sessions = total_journal_sessions + 1,
          last_activity_date = CURRENT_DATE
      WHERE user_id = user_uuid;

      -- Update streak and check Week Warrior
      PERFORM update_streak(user_uuid);

      RETURN 5;
  END;
  $$;


ALTER FUNCTION "public"."award_journal_xp"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_xp"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text" DEFAULT NULL::"text", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  old_level INTEGER;
  new_level INTEGER;
  old_xp INTEGER;
  new_xp INTEGER;
  level_up_occurred BOOLEAN := false;
  achievement_earned BOOLEAN := false;
  daily_xp_earned INTEGER := 0;
  remaining_xp INTEGER := 0;
  actual_xp_to_award INTEGER := 0;
  daily_limit_hit BOOLEAN := false;
BEGIN
  -- 1) Ensure profile exists up-front (idempotent)
  INSERT INTO public.profiles (user_id, level, experience_points, total_verses, total_journal)
  VALUES (p_user_id, 1, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- 2) Load current profile data
  SELECT level, experience_points INTO old_level, old_xp
  FROM public.profiles WHERE user_id = p_user_id;

  IF old_level IS NULL THEN
    -- Safety in case of a race
    SELECT level, experience_points INTO old_level, old_xp
    FROM public.profiles WHERE user_id = p_user_id;
  END IF;

  IF old_level IS NULL THEN
    RAISE EXCEPTION 'Profile not found or not creatable for user_id=%', p_user_id;
  END IF;

  -- 3) Increment counters FIRST (independent of XP cap)
  -- NOTE: Removed total_journal increment; reflections triggers will maintain it.
  UPDATE public.profiles
  SET
    total_verses = CASE
      WHEN p_activity_type = 'verse_completion' THEN COALESCE(total_verses, 0) + 1
      ELSE COALESCE(total_verses, 0)
    END,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- 4) Daily XP limit (calculate after counters)
  SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
  FROM public.xp_transactions
  WHERE user_id = p_user_id
    AND DATE(created_at) = CURRENT_DATE;

  remaining_xp := GREATEST(0, 30 - daily_xp_earned);
  actual_xp_to_award := LEAST(GREATEST(p_xp_amount, 0), remaining_xp);
  daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30 OR remaining_xp = 0;

  -- 5) Calculate new XP and level (XP can be 0 when capped)
  new_xp := old_xp + actual_xp_to_award;
  new_level := public.calculate_level_from_xp(new_xp);
  level_up_occurred := new_level > old_level;

  -- 6) Update profile with new XP and level
  UPDATE public.profiles
  SET experience_points = new_xp,
      level = new_level,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- 7) Level-based achievements (example)
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

  -- 8) Logging: skip noisy 0-XP inserts to avoid "0 EXP earned" toasts
  IF actual_xp_to_award > 0 THEN
    INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
    VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);

    INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
    VALUES (p_user_id, actual_xp_to_award, p_activity_type, COALESCE(p_reason, 'XP awarded'));
  END IF;

  -- 9) UI helpers: let frontend suppress XP toast on cap and show counter text instead
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
    'remaining_xp', GREATEST(0, remaining_xp - actual_xp_to_award),
    'limit_reached', remaining_xp = 0,
    'show_notification', daily_limit_hit,

    -- New: toast control
    'show_xp_toast', actual_xp_to_award > 0,
    'toast_message',
      CASE
        WHEN actual_xp_to_award = 0 AND p_activity_type = 'verse_completion' THEN '+1 Total Verse'
        WHEN actual_xp_to_award = 0 AND p_activity_type = 'journal_completion' THEN '+1 Total Journal'
        WHEN actual_xp_to_award > 0 THEN CONCAT('+', actual_xp_to_award, ' EXP')
        ELSE NULL
      END
  );
END;
$$;


ALTER FUNCTION "public"."award_xp"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_xp_with_daily_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text" DEFAULT NULL::"text", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  DECLARE
      old_level INTEGER;
      new_level INTEGER;
      old_xp INTEGER;
      new_xp INTEGER;
      daily_xp INTEGER := 0;
      last_date DATE;
      remaining_daily_xp INTEGER;
      actual_xp_awarded INTEGER;
      level_up_occurred BOOLEAN := false;
      achievement_earned BOOLEAN := false;
      weekly_bonus_earned BOOLEAN := false;
      result jsonb;
  BEGIN
      -- Get current profile data (same as before)...
      SELECT level, experience_points, daily_xp_earned, last_xp_date
      INTO old_level, old_xp, daily_xp, last_date
      FROM public.profiles
      WHERE user_id = p_user_id;

      -- Reset daily XP if new day
      IF last_date != CURRENT_DATE THEN
          daily_xp := 0;
      END IF;

      -- Calculate remaining daily XP (max 35 per day)
      remaining_daily_xp := GREATEST(0, 35 - daily_xp);
      actual_xp_awarded := LEAST(p_xp_amount, remaining_daily_xp);

      -- If no XP can be awarded due to daily limit, return gentle message
      IF actual_xp_awarded <= 0 THEN
          RETURN jsonb_build_object(
              'success', false,
              'message', 'XP harian sudah tercapai (35/35). Kembali besok 
  untuk mendapat XP lagi! 😊',
              'daily_xp_earned', daily_xp,
              'daily_limit', 35,
              'remaining_daily_xp', 0
          );
      END IF;

      -- Continue with rest of function...
      -- (All the other logic remains the same)

      RETURN jsonb_build_object(
          'success', true,
          'xp_awarded', actual_xp_awarded,
          'daily_xp_earned', daily_xp + actual_xp_awarded,
          'daily_limit', 35,
          'remaining_daily_xp', GREATEST(0, 35 - (daily_xp +
  actual_xp_awarded))
      );
  END;
  $$;


ALTER FUNCTION "public"."award_xp_with_daily_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."award_xp_with_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text" DEFAULT NULL::"text", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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
      result jsonb;
  BEGIN
      -- Check daily XP limit first
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
      FROM xp_transactions
      WHERE user_id = p_user_id
      AND created_at >= CURRENT_DATE;

      -- Calculate remaining XP for today (limit 30 XP)
      remaining_xp := GREATEST(0, 30 - daily_xp_earned);

      -- Cap XP award to remaining daily limit
      actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);
      daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;

      -- Get current profile data
      SELECT level, experience_points INTO old_level, old_xp
      FROM public.profiles
      WHERE user_id = p_user_id;

      -- If no profile exists, create one
      IF NOT FOUND THEN
        INSERT INTO public.profiles (user_id, level, experience_points)
        VALUES (p_user_id, 1, 0)
        ON CONFLICT (user_id) DO NOTHING;
        old_level := 1;
        old_xp := 0;
      END IF;

      -- Calculate new XP and level
      new_xp := old_xp + actual_xp_to_award;
      new_level := public.calculate_level_from_xp(new_xp);
      level_up_occurred := new_level > old_level;

      -- Update profile with new XP and level
      UPDATE public.profiles
      SET experience_points = new_xp,
          level = new_level,
          updated_at = now()
      WHERE user_id = p_user_id;

      -- Award level 3 achievement badge if reached for first time
      IF new_level >= 3 AND old_level < 3 THEN
        UPDATE public.profiles
        SET achievements = CASE
          WHEN achievements IS NULL THEN ARRAY['level_3']
          ELSE array_append(achievements, 'level_3')
        END
        WHERE user_id = p_user_id;
        achievement_earned := true;
      END IF;

      -- Insert XP transaction only if actual_xp_to_award > 0
      IF actual_xp_to_award > 0 THEN
          INSERT INTO public.xp_transactions (
            user_id,
            xp_amount,
            transaction_type,
            reason
          ) VALUES (
            p_user_id,
            actual_xp_to_award,
            p_activity_type,
            COALESCE(p_reason, 'XP awarded')
          );
      END IF;

      -- Log the activity (even if 0 XP awarded, for tracking attempts)
      INSERT INTO public.user_activities (
        user_id,
        activity_type,
        xp_earned,
        metadata
      ) VALUES (
        p_user_id,
        p_activity_type,
        actual_xp_to_award,
        p_metadata || jsonb_build_object(
          'reason', p_reason,
          'old_level', old_level,
          'new_level', new_level,
          'level_up', level_up_occurred,
          'achievement_earned', achievement_earned,
          'requested_xp', p_xp_amount,
          'actual_xp_awarded', actual_xp_to_award,
          'daily_xp_earned', daily_xp_earned + actual_xp_to_award
        )
      );
      
      -- Return comprehensive result
      result := jsonb_build_object(
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
        'limit_reached', daily_limit_hit
      );
      
      RETURN result;
  END;
$$;


ALTER FUNCTION "public"."award_xp_with_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."broadcast_pro_subscription_change"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  channel_name text;
  payload json;
BEGIN
  -- Create a unique channel name for the specific tripay_reference.
  -- This ensures the notification is only sent to the client listening for this specific transaction.
  channel_name = 'pro_subs_' || NEW.tripay_reference;

  -- Construct the payload. The Supabase client library requires a top-level 'event' key
  -- for broadcast filtering.
  payload = json_build_object(
    'event', 'pro_subscription_update', -- This is the event name the client will listen for.
    'payload', json_build_object(
      'table', TG_TABLE_NAME,
      'event', TG_OP,
      'new', row_to_json(NEW)
    )
  );

  -- Notify the specific channel, sending the payload as a text-formatted JSON.
  PERFORM pg_notify(channel_name, payload::text);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."broadcast_pro_subscription_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_level_from_xp"("total_xp" integer) RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  level INTEGER := 1;
BEGIN
  -- Updated level requirements with new thresholds
  IF total_xp >= 15000 THEN
    RETURN 10;
  ELSIF total_xp >= 12000 THEN
    RETURN 9;
  ELSIF total_xp >= 9000 THEN
    RETURN 8;
  ELSIF total_xp >= 7000 THEN
    RETURN 7;
  ELSIF total_xp >= 4500 THEN
    RETURN 6;
  ELSIF total_xp >= 2500 THEN
    RETURN 5;
  ELSIF total_xp >= 1200 THEN
    RETURN 4;
  ELSIF total_xp >= 500 THEN
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$$;


ALTER FUNCTION "public"."calculate_level_from_xp"("total_xp" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_level_from_xp_backup_500"("total_xp" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  level INTEGER := 1;
BEGIN
  -- BACKUP: Old thresholds before change
  IF total_xp >= 15000 THEN
    RETURN 10;
  ELSIF total_xp >= 12000 THEN
    RETURN 9;
  ELSIF total_xp >= 9000 THEN
    RETURN 8;
  ELSIF total_xp >= 7000 THEN
    RETURN 7;
  ELSIF total_xp >= 4500 THEN
    RETURN 6;
  ELSIF total_xp >= 2500 THEN
    RETURN 5;
  ELSIF total_xp >= 1200 THEN
    RETURN 4;
  ELSIF total_xp >= 500 THEN  -- OLD: Level 3 was 500 XP
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$$;


ALTER FUNCTION "public"."calculate_level_from_xp_backup_500"("total_xp" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_subscription_end_date"("p_subscription_type" "text", "p_start_date" timestamp with time zone) RETURNS timestamp with time zone
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  plan_duration_days INTEGER;
BEGIN
  -- Get duration from subscription_plans table
  SELECT duration_days INTO plan_duration_days
  FROM public.subscription_plans
  WHERE id = p_subscription_type
  AND is_active = true;

  -- If found, use it
  IF plan_duration_days IS NOT NULL THEN
    RETURN p_start_date + (plan_duration_days || ' days')::INTERVAL;
  END IF;

  -- If not found, this is an error - no fallback needed
  RAISE EXCEPTION 'Invalid subscription_type: %. Valid types are: 1_day, 1_week, 1_month, 1_year', p_subscription_type;
END;
$$;


ALTER FUNCTION "public"."calculate_subscription_end_date"("p_subscription_type" "text", "p_start_date" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_access_payment_transaction"("p_user_id" "uuid", "p_transaction_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  is_owner BOOLEAN := FALSE;
  is_admin BOOLEAN := FALSE;
BEGIN
  -- Check ownership
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
  ) INTO is_owner;
  
  -- Check verified admin status
  is_admin := public.is_verified_admin(p_user_id);
  
  -- Log access attempt for audit
  PERFORM public.log_data_access(
    'payment_transactions',
    'access_attempt',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', p_user_id,
      'is_owner', is_owner,
      'is_admin', is_admin,
      'access_granted', (is_owner OR is_admin)
    )
  );
  
  RETURN (is_owner OR is_admin);
END;
$$;


ALTER FUNCTION "public"."can_access_payment_transaction"("p_user_id" "uuid", "p_transaction_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_access_verse"("p_user_id" "uuid", "p_verse_number" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_level INTEGER;
  pro_data RECORD;
BEGIN
  -- Get user level
  SELECT level INTO user_level
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Get unified pro status
  SELECT * INTO pro_data
  FROM public.check_unified_pro_status(p_user_id);
  
  -- Pro users with verse access can access verses 1-4 regardless of level
  IF pro_data.is_pro AND pro_data.verse_access AND p_verse_number <= 4 THEN
    RETURN true;
  END IF;
  
  -- Level-based access for non-pro users or verses beyond 4
  CASE p_verse_number
    WHEN 1 THEN RETURN user_level >= 3;
    WHEN 2 THEN RETURN user_level >= 4; 
    WHEN 3 THEN RETURN user_level >= 4;
    WHEN 4 THEN RETURN user_level >= 5;
    ELSE RETURN false;
  END CASE;
END;
$$;


ALTER FUNCTION "public"."can_access_verse"("p_user_id" "uuid", "p_verse_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_and_award_achievements"("user_id_param" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_profile RECORD;
  current_achievements TEXT[];
  new_achievements TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Get current profile data
  SELECT * INTO user_profile 
  FROM profiles 
  WHERE user_id = user_id_param;
  
  current_achievements := COALESCE(user_profile.achievements, ARRAY[]::TEXT[]);
  
  -- Check for 7-day streak achievement
  IF user_profile.streak_days >= 7 AND NOT ('7_day_streak' = ANY(current_achievements)) THEN
    new_achievements := array_append(new_achievements, '7_day_streak');
  END IF;
  
  -- Check for Zen Master achievement (100 journal entries)
  IF user_profile.total_journal >= 100 AND NOT ('zen_master' = ANY(current_achievements)) THEN
    new_achievements := array_append(new_achievements, 'zen_master');
  END IF;
  
  -- Update achievements if new ones found
  IF array_length(new_achievements, 1) > 0 THEN
    UPDATE profiles 
    SET achievements = array_cat(current_achievements, new_achievements)
    WHERE user_id = user_id_param;
    
    -- Log achievement awards
    INSERT INTO user_activities (user_id, activity_type, metadata)
    VALUES (user_id_param, 'achievement_unlocked', jsonb_build_object('achievements', new_achievements));
  END IF;
END;
$$;


ALTER FUNCTION "public"."check_and_award_achievements"("user_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_daily_audio_limit"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  daily_audio_xp INTEGER;
BEGIN
  SELECT COALESCE(SUM(xp_earned), 0) INTO daily_audio_xp
  FROM public.user_activities
  WHERE user_id = p_user_id
    AND activity_type = 'audio_completed'
    AND created_at >= CURRENT_DATE;
    
  RETURN daily_audio_xp < 20;
END;
$$;


ALTER FUNCTION "public"."check_daily_audio_limit"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_daily_chat_limit"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
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
$$;


ALTER FUNCTION "public"."check_daily_chat_limit"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_daily_journal_limit"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  daily_journal_xp INTEGER;
BEGIN
  SELECT COALESCE(SUM(xp_earned), 0) INTO daily_journal_xp
  FROM public.user_activities
  WHERE user_id = p_user_id
    AND activity_type = 'journal_entry'
    AND created_at >= CURRENT_DATE;
    
  RETURN daily_journal_xp < 5;
END;
$$;


ALTER FUNCTION "public"."check_daily_journal_limit"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_journal_spam_limits"("p_user_id" "uuid", "journal_text" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    journal_entries INTEGER := 0;
    last_date DATE;
    last_entry TIMESTAMP;
    result jsonb;
BEGIN
    -- Get current stats
    SELECT daily_journal_entries, last_journal_date, last_journal_timestamp
    INTO journal_entries, last_date, last_entry
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    -- Reset daily count if new day
    IF last_date != CURRENT_DATE OR last_date IS NULL THEN
        journal_entries := 0;
    END IF;
    
    -- Check daily limit (MAX 1 per day)
    IF journal_entries >= 1 THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'daily_limit',
            'message', 'Maksimal 1 jurnal spiritual per hari'
        );
    END IF;
    
    -- Check cooldown (minimum 4 hours between entries)
    IF last_entry IS NOT NULL AND last_entry > NOW() - INTERVAL '4 hours' THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'cooldown',
            'message', 'Tunggu 4 jam sebelum menulis jurnal berikutnya',
            'next_allowed', (last_entry + INTERVAL '4 hours')
        );
    END IF;
    
    -- Check content quality
    IF NOT validate_journal_entry(journal_text) THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'quality',
            'message', 'Jurnal harus minimal 30 karakter dan bermakna'
        );
    END IF;
    
    -- All checks passed
    RETURN jsonb_build_object(
        'allowed', true,
        'message', 'Journal entry valid'
    );
END;
$$;


ALTER FUNCTION "public"."check_journal_spam_limits"("p_user_id" "uuid", "journal_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_action" "text", "p_max_attempts" integer DEFAULT 10, "p_window_minutes" integer DEFAULT 60) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  attempt_count INTEGER;
  window_start TIMESTAMPTZ;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  SELECT COUNT(*) INTO attempt_count
  FROM public.rate_limit_log
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at > window_start;
  
  -- Log this attempt
  INSERT INTO public.rate_limit_log (user_id, action, ip_address)
  VALUES (p_user_id, p_action, inet_client_addr()::TEXT);
  
  RETURN attempt_count < p_max_attempts;
END;
$$;


ALTER FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_action" "text", "p_max_attempts" integer, "p_window_minutes" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_sensitive_data_rate_limit"("p_user_id" "uuid", "p_table_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Always allow - remove rate limiting for now
  RETURN true;
END;
$$;


ALTER FUNCTION "public"."check_sensitive_data_rate_limit"("p_user_id" "uuid", "p_table_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_unified_pro_status"("p_user_id" "uuid") RETURNS TABLE("is_pro" boolean, "subscription_type" "text", "status" "text", "expires_at" timestamp with time zone, "days_remaining" integer, "verse_access" boolean, "pro_badge" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE 
      WHEN ps.status = 'active' AND ps.subscription_end_date > now() THEN true 
      ELSE false 
    END as is_pro,
    ps.subscription_type,
    ps.status,
    ps.subscription_end_date as expires_at,
    -- SIMPLE: Calculate days_remaining from subscription_end_date
    CASE 
        WHEN ps.status = 'active' AND ps.subscription_end_date > NOW() 
        THEN GREATEST(0, EXTRACT(DAY FROM (ps.subscription_end_date - NOW()))::INTEGER)
        ELSE 0 
    END as days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$$;


ALTER FUNCTION "public"."check_unified_pro_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_user_notification_shown"("p_user_id" "uuid", "p_notification_type" character varying) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notifications 
        WHERE user_id = p_user_id 
        AND notification_type = p_notification_type
        AND read = true
    );
END;
$$;


ALTER FUNCTION "public"."check_user_notification_shown"("p_user_id" "uuid", "p_notification_type" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_weekly_challenge_bonus"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    current_streak INTEGER := 0;
    last_date DATE;
    bonus_awarded BOOLEAN := FALSE;
BEGIN
    -- Get current streak and last streak date
    SELECT COALESCE(weekly_streak,0), last_streak_date
    INTO current_streak, last_date
    FROM public.profiles
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    -- If user hit 35 XP today and yesterday was also 35 XP (consecutive)
    IF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        current_streak := current_streak + 1;
    ELSIF last_date = CURRENT_DATE THEN
        -- Same day, don't increment
        current_streak := current_streak;
    ELSE
        -- Streak broken, set computed to 1 but preserve existing using GREATEST when updating
        current_streak := 1;
    END IF;
    
    -- Check if completed 7-day challenge
    IF current_streak >= 7 THEN
        -- Award 50 bonus XP
        UPDATE public.profiles
        SET experience_points = COALESCE(experience_points,0) + 50,
            weekly_streak = GREATEST(COALESCE(weekly_streak,0), current_streak),
            last_streak_date = CURRENT_DATE
        WHERE user_id = p_user_id;
        
        -- Log the weekly bonus
        INSERT INTO public.user_activities (
            user_id,
            activity_type,
            xp_earned,
            metadata
        ) VALUES (
            p_user_id,
            'weekly_challenge_bonus',
            50,
            jsonb_build_object(
                'reason', 'Completed 7 consecutive days of 35 XP',
                'streak_days', current_streak
            )
        );
        
        bonus_awarded := TRUE;
    ELSE
        -- Update streak preserving previous high
        UPDATE public.profiles
        SET weekly_streak = GREATEST(COALESCE(weekly_streak,0), current_streak),
            last_streak_date = CURRENT_DATE
        WHERE user_id = p_user_id;
    END IF;
    
    RETURN bonus_awarded;
END;
$$;


ALTER FUNCTION "public"."check_weekly_challenge_bonus"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_chat_message_user_names"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update all chat messages where user_name contains @ symbol
  UPDATE public.chat_messages 
  SET user_name = CASE 
    WHEN user_name LIKE '%@%' THEN split_part(user_name, '@', 1)
    ELSE user_name
  END
  WHERE user_name LIKE '%@%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the cleanup action
  PERFORM public.log_sensitive_action(
    'chat_messages_user_names_cleanup',
    'chat_messages',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'cleanup_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_chat_message_user_names"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_admin_roles"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  cleanup_count integer;
BEGIN
  -- Deactivate expired roles
  UPDATE public.admin_roles 
  SET is_active = false, updated_at = now()
  WHERE is_active = true 
  AND expires_at IS NOT NULL 
  AND expires_at <= now();
  
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log cleanup action
  PERFORM public.log_sensitive_action(
    'admin_roles_automated_cleanup',
    'admin_roles',
    NULL,
    jsonb_build_object(
      'cleaned_up_count', cleanup_count,
      'cleanup_time', now()
    )
  );
  
  RETURN cleanup_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_admin_roles"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_pro_subscriptions"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Delete cancelled subscriptions
  DELETE FROM public.pro_subscriptions 
  WHERE status = 'cancelled';
  
  -- Delete expired subscriptions (days_remaining <= 0)
  DELETE FROM public.pro_subscriptions 
  WHERE days_remaining <= 0;
  
  -- Delete subscriptions past end date
  DELETE FROM public.pro_subscriptions 
  WHERE subscription_end_date < now();
  
  RAISE NOTICE 'Cleaned up expired/cancelled pro subscriptions';
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_pro_subscriptions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_waiting_payments"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Delete waiting payments older than 24 hours
  DELETE FROM public.waiting_payment 
  WHERE expires_at < now();
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_waiting_payments"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_offline_users"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.online_users 
    WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;


ALTER FUNCTION "public"."cleanup_offline_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_user_display_names"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Update all profiles where display_name contains @ symbol
  UPDATE public.profiles 
  SET display_name = CASE 
    WHEN display_name LIKE '%@%' THEN split_part(display_name, '@', 1)
    ELSE display_name
  END,
  updated_at = now()
  WHERE display_name LIKE '%@%';
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the cleanup action
  PERFORM public.log_sensitive_action(
    'user_display_names_cleanup',
    'profiles',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'cleanup_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_user_display_names"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_waiting_payment_24h"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM public.waiting_payment
  WHERE created_at < (NOW() - INTERVAL '24 hours');

  RAISE NOTICE 'Cleaned up waiting_payment records older than 24 hours at %', NOW();
END;
$$;


ALTER FUNCTION "public"."cleanup_waiting_payment_24h"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."confirm_payment_make_pro"("p_tripay_reference" "text", "p_subscription_type" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  payment_record RECORD;
BEGIN
  -- Update payment to paid
  UPDATE public.payment_transactions 
  SET status = 'paid', updated_at = NOW()
  WHERE tripay_reference = p_tripay_reference
  RETURNING user_id, email INTO payment_record;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Make user PRO
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date
  ) VALUES (
    payment_record.user_id,
    payment_record.email,
    p_subscription_type,
    'active',
    NOW(),
    CASE p_subscription_type
      WHEN '1_day' THEN NOW() + INTERVAL '1 day'
      WHEN '1_week' THEN NOW() + INTERVAL '7 days'
      WHEN '1_month' THEN NOW() + INTERVAL '30 days'
      WHEN '1_year' THEN NOW() + INTERVAL '1 year'
      ELSE NOW() + INTERVAL '30 days'
    END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscription_type = EXCLUDED.subscription_type,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    status = 'active',
    updated_at = NOW();
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."confirm_payment_make_pro"("p_tripay_reference" "text", "p_subscription_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text" DEFAULT 'community'::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  message_id UUID;
  user_profile RECORD;
  clean_username TEXT;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;
  
  -- Get user profile for level and display name
  SELECT level, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  -- Clean the username
  clean_username := CASE 
    WHEN user_profile.display_name LIKE '%@%' THEN split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;
  
  -- Insert ONLY the columns that exist now
  INSERT INTO public.chat_messages (
    user_id,
    user_name, 
    user_level,
    message,
    channel_id
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    p_message,
    p_channel_id
  ) RETURNING id INTO message_id;
  
  RETURN message_id;
END;
$$;


ALTER FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text" DEFAULT 'community'::"text", "p_is_private" boolean DEFAULT false, "p_allowed_users" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  message_id UUID;
  user_profile RECORD;
  clean_username TEXT;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;
  
  -- Get user profile for level and pro status from achievements
  SELECT level, 'pro' = ANY(achievements) as is_pro, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  -- Clean the username (remove email domain if present)
  clean_username := CASE 
    WHEN user_profile.display_name LIKE '%@%' THEN split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;
  
  -- Insert the message with cleaned username and proper pro status
  INSERT INTO public.chat_messages (
    user_id,
    user_name, 
    user_level,
    is_pro,
    message,
    channel_id,
    is_private,
    allowed_users
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    COALESCE(user_profile.is_pro, false),
    p_message,
    p_channel_id,
    p_is_private,
    p_allowed_users
  ) RETURNING id INTO message_id;
  
  -- Log the message creation
  PERFORM public.log_data_access(
    'chat_messages',
    'message_created',
    message_id,
    jsonb_build_object(
      'channel_id', p_channel_id,
      'is_private', p_is_private,
      'message_length', length(p_message),
      'username', clean_username,
      'is_pro', COALESCE(user_profile.is_pro, false)
    )
  );
  
  RETURN message_id;
END;
$$;


ALTER FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_missing_profiles"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
    INSERT INTO public.profiles (user_id, display_name, user_email,
  created_at)
    SELECT
      au.id,
      COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email,
  '@', 1), 'User'),
      au.email,
      now()
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.user_id
    WHERE p.user_id IS NULL;
  END;
  $$;


ALTER FUNCTION "public"."create_missing_profiles"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_payment_with_validation"("p_user_id" "uuid", "p_subscription_type" "text", "p_payment_method" "text", "p_user_phone" "text", "p_user_full_name" "text", "p_user_email" "text", "p_tripay_reference" "text") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    transaction_id UUID;
    amount INTEGER;
BEGIN
    -- Validation
    IF p_user_phone IS NULL OR p_user_full_name IS NULL OR p_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Phone, name, and email are required');
    END IF;
    
    -- Get amount
    amount := CASE p_subscription_type
        WHEN '1_day' THEN 4000
        WHEN '1_week' THEN 30000
        WHEN '1_month' THEN 100000
        WHEN '1_year' THEN 800000
        ELSE 100000
    END;
    
    -- Insert payment transaction with user info
    INSERT INTO public.payment_transactions (
        user_id, subscription_type, payment_method, 
        user_phone, user_full_name, user_email_payment,
        amount, currency, tripay_reference, status
    ) VALUES (
        p_user_id, p_subscription_type, p_payment_method,
        p_user_phone, p_user_full_name, p_user_email,
        amount, 'IDR', p_tripay_reference, 'pending'
    ) RETURNING id INTO transaction_id;
    
    RETURN json_build_object('success', true, 'transaction_id', transaction_id);
END;
$$;


ALTER FUNCTION "public"."create_payment_with_validation"("p_user_id" "uuid", "p_subscription_type" "text", "p_payment_method" "text", "p_user_phone" "text", "p_user_full_name" "text", "p_user_email" "text", "p_tripay_reference" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_pending_payment"("p_user_id" "uuid", "p_email" "text", "p_tripay_reference" "text", "p_amount" integer) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  payment_id UUID;
BEGIN
  INSERT INTO public.payment_transactions (
    user_id,
    email,
    status,
    tripay_reference,
    merchant_ref,
    amount
  ) VALUES (
    p_user_id,
    p_email,
    'pending',
    p_tripay_reference,
    'EVG_' || extract(epoch from now())::bigint,
    p_amount
  )
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$;


ALTER FUNCTION "public"."create_pending_payment"("p_user_id" "uuid", "p_email" "text", "p_tripay_reference" "text", "p_amount" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_email"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT p.user_email
  FROM public.profiles p
  WHERE p.user_id = auth.uid();
$$;


ALTER FUNCTION "public"."current_user_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."decrypt_email"("p_encrypted_email" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Check if already encrypted
  IF p_encrypted_email LIKE 'ENC:%' THEN
    RETURN decode(substring(p_encrypted_email from 5), 'base64')::text;
  ELSE
    -- Return as-is if not encrypted (for backward compatibility)
    RETURN p_encrypted_email;
  END IF;
END;
$$;


ALTER FUNCTION "public"."decrypt_email"("p_encrypted_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."emergency_revoke_admin_role"("p_target_user_id" "uuid", "p_reason" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  revoking_user_id uuid;
  verification_result jsonb;
  revoked_role text;
BEGIN
  revoking_user_id := auth.uid();
  
  -- Verify revoking user is super admin
  verification_result := public.verify_admin_with_failsafe(revoking_user_id, 'super_admin');
  
  IF NOT (verification_result->>'is_admin')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Access denied: Super admin privileges required'
    );
  END IF;
  
  -- Get current role before revocation
  SELECT role INTO revoked_role 
  FROM public.admin_roles 
  WHERE user_id = p_target_user_id AND is_active = true;
  
  -- Revoke the role
  UPDATE public.admin_roles 
  SET is_active = false, updated_at = now()
  WHERE user_id = p_target_user_id;
  
  -- Log emergency revocation
  PERFORM public.log_sensitive_action(
    'admin_role_emergency_revocation',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'revoked_role', revoked_role,
      'revoked_by', revoking_user_id,
      'reason', p_reason,
      'emergency_action', true
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin role emergency revocation completed',
    'revoked_role', revoked_role
  );
END;
$$;


ALTER FUNCTION "public"."emergency_revoke_admin_role"("p_target_user_id" "uuid", "p_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."encrypt_email"("p_email" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Simple obfuscation for now - can be enhanced with pgcrypto
  RETURN 'ENC:' || encode(p_email::bytea, 'base64');
END;
$$;


ALTER FUNCTION "public"."encrypt_email"("p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."encrypt_payment_field"("p_data" "text", "p_field_type" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Simple obfuscation for now - in production, use proper encryption
  -- This can be enhanced with pgcrypto extension for real encryption
  CASE p_field_type
    WHEN 'bank_account' THEN
      RETURN 'ENCRYPTED:' || encode(p_data::bytea, 'base64');
    WHEN 'unique_code' THEN
      RETURN 'ENCRYPTED:' || encode(p_data::bytea, 'base64');
    ELSE
      RETURN p_data;
  END CASE;
END;
$$;


ALTER FUNCTION "public"."encrypt_payment_field"("p_data" "text", "p_field_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enhanced_admin_role_access_log"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Log admin role table access for security monitoring
  PERFORM public.log_sensitive_action(
    'admin_roles_data_access',
    'admin_roles',
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'operation', TG_OP,
      'requesting_user', auth.uid(),
      'target_user', COALESCE(NEW.user_id, OLD.user_id),
      'role', COALESCE(NEW.role, OLD.role),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."enhanced_admin_role_access_log"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enhanced_admin_role_audit"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log all admin role operations with enhanced detail
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_created',
      'admin_roles',
      NEW.id,
      jsonb_build_object(
        'target_user', NEW.user_id,
        'role_granted', NEW.role,
        'granted_by', auth.uid(),
        'expires_at', NEW.expires_at,
        'operation_timestamp', now()
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_updated',
      'admin_roles',
      NEW.id,
      jsonb_build_object(
        'target_user', NEW.user_id,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_active', OLD.is_active,
        'new_active', NEW.is_active,
        'updated_by', auth.uid(),
        'operation_timestamp', now()
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_sensitive_action(
      'admin_role_deleted',
      'admin_roles',
      OLD.id,
      jsonb_build_object(
        'target_user', OLD.user_id,
        'deleted_role', OLD.role,
        'deleted_by', auth.uid(),
        'operation_timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."enhanced_admin_role_audit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enhanced_payment_access_control"("p_user_id" "uuid", "p_transaction_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  is_owner boolean := false;
  is_admin boolean := false;
  transaction_exists boolean := false;
  rate_limit_ok boolean := false;
BEGIN
  -- Check if transaction exists
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id
  ) INTO transaction_exists;
  
  IF NOT transaction_exists THEN
    PERFORM public.log_sensitive_action(
      'payment_access_attempt_invalid_transaction',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', p_user_id,
        'transaction_id', p_transaction_id,
        'result', 'transaction_not_found'
      )
    );
    RETURN false;
  END IF;
  
  -- Check rate limiting for payment data access
  rate_limit_ok := public.check_sensitive_data_rate_limit(p_user_id, 'payment_transactions');
  
  IF NOT rate_limit_ok THEN
    PERFORM public.log_sensitive_action(
      'payment_access_rate_limited',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', p_user_id,
        'reason', 'rate_limit_exceeded'
      )
    );
    RETURN false;
  END IF;
  
  -- Check ownership
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
  ) INTO is_owner;
  
  -- Check verified admin status
  is_admin := public.is_verified_admin(p_user_id);
  
  -- Log access attempt for audit
  PERFORM public.log_sensitive_action(
    'payment_access_validation',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', p_user_id,
      'is_owner', is_owner,
      'is_admin', is_admin,
      'access_granted', (is_owner OR is_admin),
      'rate_limit_passed', rate_limit_ok
    )
  );
  
  RETURN (is_owner OR is_admin);
END;
$$;


ALTER FUNCTION "public"."enhanced_payment_access_control"("p_user_id" "uuid", "p_transaction_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_payment_tracking"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Log every insert attempt for debugging
  RAISE NOTICE 'Payment tracking trigger fired for user: %, reference: %', NEW.user_id, NEW.tripay_reference;
  
  -- Ensure we always have a payment record when pro_subscriptions gets a tripay_reference
  IF NEW.tripay_reference IS NOT NULL AND NEW.status = 'pending' THEN
    
    -- Check if payment_transactions record exists
    IF NOT EXISTS (
      SELECT 1 FROM public.payment_transactions 
      WHERE tripay_reference = NEW.tripay_reference
    ) THEN
      
      -- Insert missing payment record
      INSERT INTO public.payment_transactions (
        user_id,
        email,
        status,
        tripay_reference,
        merchant_ref,
        amount
      ) VALUES (
        NEW.user_id,
        NEW.user_email,
        'pending',
        NEW.tripay_reference,
        'AUTO_' || NEW.tripay_reference,
        COALESCE(NEW.amount_paid, 0)
      );
      
      RAISE NOTICE 'Auto-created payment_transactions record for reference: %', NEW.tripay_reference;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."ensure_payment_tracking"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."expire_subscriptions"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Auto-expire subscriptions based on subscription_end_date
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_end_date < now() 
    AND status = 'active';
END;
$$;


ALTER FUNCTION "public"."expire_subscriptions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fix_user_levels"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.profiles 
  SET level = public.calculate_level_from_xp(experience_points),
      updated_at = now()
  WHERE level != public.calculate_level_from_xp(experience_points);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the fix
  PERFORM public.log_sensitive_action(
    'user_levels_corrected',
    'profiles',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'fix_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;


ALTER FUNCTION "public"."fix_user_levels"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_update_profile_on_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  activity_date date := (COALESCE(NEW.created_at, now()) AT TIME ZONE 'UTC')::date;
  prev_date date;
  prev_streak int := 0;
BEGIN
  -- Lock the profile row to avoid race conditions
  SELECT last_login_date, COALESCE(streak_days, 0) INTO prev_date, prev_streak
    FROM public.profiles
    WHERE user_id = NEW.user_id
    FOR UPDATE;

  IF NOT FOUND THEN
    -- If profile missing, insert with streak = 1
    INSERT INTO public.profiles (user_id, last_login_date, streak_days, created_at, updated_at)
    VALUES (NEW.user_id, activity_date, 1, now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
  END IF;

  -- If same date as last recorded activity, do nothing
  IF prev_date = activity_date THEN
    RETURN NEW;
  END IF;

  -- Different date: increment streak_days by 1 (counts distinct active days)
  UPDATE public.profiles
  SET last_login_date = activity_date,
      streak_days = prev_streak + 1,
      updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."fn_update_profile_on_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."force_global_cache_refresh"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
      UPDATE app_config
      SET current_version = current_version + 1,
          force_refresh = TRUE,
          updated_at = NOW()
      WHERE id = 1;

      UPDATE profiles
      SET app_version = 0,
          cache_cleared_at = NULL;

      RAISE NOTICE 'Global cache refresh triggered. New version: %',
          (SELECT current_version FROM app_config WHERE id = 1);
  END;
  $$;


ALTER FUNCTION "public"."force_global_cache_refresh"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."function_reject_mock"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.user_email is null then
    return new;
  end if;

  new.user_email := lower(new.user_email);

  if new.user_email in (
    'dragon@yahoo.com'
  ) then
    return null;
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."function_reject_mock"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."general_action_sync_display_name"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Only set when INSERTing or when user_id changed, or display_name is NULL
  IF (TG_OP = 'INSERT')
     OR (TG_OP = 'UPDATE' AND (NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.display_name IS NULL)) THEN
    SELECT p.display_name
      INTO NEW.display_name
    FROM public.profiles p
    WHERE p.user_id = NEW.user_id;

    -- If no profile row exists, keep whatever NEW.display_name is (can be NULL)
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."general_action_sync_display_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_auth_request_stats"() RETURNS TABLE("component_name" "text", "request_count" bigint, "unique_users" bigint, "last_request" timestamp without time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.component_name,
    COUNT(*) as request_count,
    COUNT(DISTINCT l.user_id) as unique_users,
    MAX(l.created_at) as last_request
  FROM auth_request_logs l
  WHERE l.created_at >= NOW() - INTERVAL '1 hour'
  GROUP BY l.component_name
  ORDER BY request_count DESC;
END;
$$;


ALTER FUNCTION "public"."get_auth_request_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_display_name"("p_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
  DECLARE
    result TEXT;
  BEGIN
    SELECT display_name INTO result
    FROM public.profiles
    WHERE user_id = p_user_id;

    RETURN COALESCE(result, 'Unknown User');
  END;
  $$;


ALTER FUNCTION "public"."get_current_display_name"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_user_fast"() RETURNS TABLE("user_id" "uuid", "display_name" "text", "level" integer, "is_pro" boolean)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as user_id,
        COALESCE(p.display_name, 'User') as display_name,
        COALESCE(p.level, 1) as level,
        COALESCE(p.is_pro, false) as is_pro
    FROM profiles p
    WHERE p.user_id = auth.uid()
    LIMIT 1;
END;
$$;


ALTER FUNCTION "public"."get_current_user_fast"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_daily_xp_status"("p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    daily_xp INTEGER := 0;
    weekly_streak INTEGER := 0;
    last_date DATE;
    result jsonb;
BEGIN
    -- Get current daily stats
    SELECT daily_xp_earned, weekly_streak, last_xp_date
    INTO daily_xp, weekly_streak, last_date
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    -- If no profile exists or it's a new day, reset values
    IF NOT FOUND OR last_date != CURRENT_DATE THEN
        daily_xp := 0;
    END IF;
    
    result := jsonb_build_object(
        'daily_xp_earned', daily_xp,
        'daily_limit', 35,
        'remaining_daily_xp', GREATEST(0, 35 - daily_xp),
        'weekly_streak', COALESCE(weekly_streak, 0),
        'days_until_bonus', GREATEST(0, 7 - COALESCE(weekly_streak, 0)),
        'is_daily_limit_reached', daily_xp >= 35
    );
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_daily_xp_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_level_from_xp"("xp_amount" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN CASE 
    WHEN xp_amount >= 15000 THEN 10
    WHEN xp_amount >= 12000 THEN 9
    WHEN xp_amount >= 9000 THEN 8
    WHEN xp_amount >= 7000 THEN 7
    WHEN xp_amount >= 4500 THEN 6
    WHEN xp_amount >= 2500 THEN 5
    WHEN xp_amount >= 1200 THEN 4
    WHEN xp_amount >= 500 THEN 3
    WHEN xp_amount >= 150 THEN 2
    ELSE 1
  END;
END;
$$;


ALTER FUNCTION "public"."get_level_from_xp"("xp_amount" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_level_from_xp"("xp_amount" integer) IS 'Calculates correct level based on total XP amount';



CREATE OR REPLACE FUNCTION "public"."get_masked_payment_transaction"("p_transaction_id" "uuid") RETURNS TABLE("id" "uuid", "tripay_reference" "text", "payment_method" "text", "masked_amount" "text", "currency" "text", "status" "text", "created_at" timestamp with time zone, "paid_at" timestamp with time zone, "expires_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  transaction_record RECORD;
  requesting_user_id uuid;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF requesting_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT check_sensitive_data_rate_limit(requesting_user_id, 'payment_transactions') THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  
  -- Get transaction and verify ownership
  SELECT * INTO transaction_record
  FROM public.payment_transactions pt
  WHERE pt.id = p_transaction_id AND pt.user_id = requesting_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found or access denied';
  END IF;
  
  -- Log access
  PERFORM log_sensitive_action(
    'masked_payment_access',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object('user_id', requesting_user_id)
  );
  
  -- Return masked data
  RETURN QUERY SELECT
    transaction_record.id,
    transaction_record.tripay_reference,
    transaction_record.payment_method,
    -- Mask the amount for additional security
    '***.' || RIGHT(transaction_record.amount::text, 2) as masked_amount,
    transaction_record.currency,
    transaction_record.status,
    transaction_record.created_at,
    transaction_record.paid_at,
    transaction_record.expires_at;
END;
$$;


ALTER FUNCTION "public"."get_masked_payment_transaction"("p_transaction_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_payment_access_summary"() RETURNS TABLE("user_id" "uuid", "access_count" bigint, "last_access" timestamp with time zone, "suspicious_activity" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Only verified admins can access this summary
  IF NOT public.is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    sal.user_id,
    COUNT(*) as access_count,
    MAX(sal.created_at) as last_access,
    -- Flag suspicious activity (more than 20 accesses in 1 hour)
    COUNT(*) > 20 AND MAX(sal.created_at) > (now() - interval '1 hour') as suspicious_activity
  FROM public.security_audit_log sal
  WHERE sal.action LIKE '%payment%'
    AND sal.created_at > (now() - interval '24 hours')
  GROUP BY sal.user_id
  ORDER BY access_count DESC;
END;
$$;


ALTER FUNCTION "public"."get_payment_access_summary"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_payment_status"("tripay_references" "text") RETURNS TABLE("status" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    wp.status
  FROM
    waiting_payment AS wp
  WHERE
    wp.tripay_references = get_payment_status.tripay_references;
END;
$$;


ALTER FUNCTION "public"."get_payment_status"("tripay_references" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_public_pro_status"("user_ids" "uuid"[]) RETURNS TABLE("user_id" "uuid", "is_pro" boolean, "subscription_type" "text")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    ps.user_id,
    true as is_pro,
    ps.subscription_type
  FROM pro_subscriptions ps
  WHERE ps.user_id = ANY(user_ids)
    AND ps.status = 'active'
    AND ps.subscription_end_date > NOW();
$$;


ALTER FUNCTION "public"."get_public_pro_status"("user_ids" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_remaining_daily_xp"("p_user_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    current_daily_xp INTEGER := 0;
    last_date DATE;
BEGIN
    -- Get current daily XP and last XP date
    SELECT daily_xp_earned, last_xp_date
    INTO current_daily_xp, last_date
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    -- If no profile exists, return full limit
    IF NOT FOUND THEN
        RETURN 35;
    END IF;
    
    -- If it's a new day, reset daily XP
    IF last_date != CURRENT_DATE THEN
        RETURN 35;
    END IF;
    
    -- Return remaining XP for today (max 35)
    RETURN GREATEST(0, 35 - COALESCE(current_daily_xp, 0));
END;
$$;


ALTER FUNCTION "public"."get_remaining_daily_xp"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_secure_payment_transaction"("p_transaction_id" "uuid") RETURNS TABLE("id" "uuid", "user_id" "uuid", "tripay_reference" "text", "payment_method" "text", "masked_amount" "text", "currency" "text", "status" "text", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "paid_at" timestamp with time zone, "expires_at" timestamp with time zone, "security_metadata" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  transaction_record RECORD;
  requesting_user_id uuid;
  is_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if requesting user is verified admin
  is_admin := public.is_verified_admin(requesting_user_id);
  
  -- Get transaction record
  SELECT * INTO transaction_record 
  FROM public.payment_transactions pt
  WHERE pt.id = p_transaction_id;
  
  -- Check access permissions
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  IF transaction_record.user_id != requesting_user_id AND NOT is_admin THEN
    RAISE EXCEPTION 'Access denied: Cannot access transaction for other users';
  END IF;
  
  -- Log access attempt
  PERFORM public.log_sensitive_action(
    'secure_payment_access',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'transaction_owner', transaction_record.user_id,
      'is_admin_access', is_admin,
      'access_time', now()
    )
  );
  
  -- Return masked data based on access level
  RETURN QUERY SELECT
    transaction_record.id,
    transaction_record.user_id,
    transaction_record.tripay_reference,
    transaction_record.payment_method,
    CASE 
      WHEN requesting_user_id = transaction_record.user_id OR is_admin THEN 
        transaction_record.amount::text
      ELSE '***.**'
    END as masked_amount,
    transaction_record.currency,
    transaction_record.status,
    transaction_record.created_at,
    transaction_record.updated_at,
    transaction_record.paid_at,
    transaction_record.expires_at,
    public.mask_sensitive_payment_data(
      transaction_record.bank_account,
      transaction_record.amount,
      transaction_record.payment_instructions,
      transaction_record.callback_data,
      transaction_record.moota_webhook_data
    ) as security_metadata;
END;
$$;


ALTER FUNCTION "public"."get_secure_payment_transaction"("p_transaction_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_email_safe"("p_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  encrypted_email text;
BEGIN
  -- Only allow users to get their own email
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Access denied: Cannot retrieve email for other users';
  END IF;
  
  -- Check rate limiting
  IF NOT check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info') THEN
    RAISE EXCEPTION 'Rate limit exceeded';
  END IF;
  
  -- Log access
  PERFORM log_sensitive_action(
    'safe_email_access',
    'user_contact_info',
    p_user_id,
    jsonb_build_object('requesting_user', auth.uid())
  );
  
  SELECT email_encrypted INTO encrypted_email
  FROM public.user_contact_info
  WHERE user_id = p_user_id;
  
  RETURN decrypt_email(encrypted_email);
END;
$$;


ALTER FUNCTION "public"."get_user_email_safe"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_email_secure"("p_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Only allow users to get their own email or verified admins
  IF auth.uid() != p_user_id AND NOT public.is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Cannot retrieve email for other users';
  END IF;
  
  -- Log access for audit
  PERFORM public.log_data_access(
    'user_contact_info',
    'email_access',
    p_user_id,
    jsonb_build_object(
      'requesting_user', auth.uid(),
      'target_user', p_user_id
    )
  );
  
  SELECT email_encrypted INTO user_email
  FROM public.user_contact_info
  WHERE user_id = p_user_id;
  
  RETURN user_email;
END;
$$;


ALTER FUNCTION "public"."get_user_email_secure"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_payment_status"("p_user_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  pro_record RECORD;
  waiting_record RECORD;
  result JSON;
BEGIN
  -- Check if user has active pro subscription
  SELECT * INTO pro_record
  FROM public.check_unified_pro_status(p_user_id)
  WHERE is_pro = true;
  
  IF FOUND THEN
    result := json_build_object(
      'status', 'pro_active',
      'is_pro', true,
      'subscription_type', pro_record.subscription_type,
      'expires_at', pro_record.expires_at,
      'days_remaining', pro_record.days_remaining
    );
  ELSE
    -- Check if user has waiting payment
    SELECT * INTO waiting_record
    FROM public.waiting_payment
    WHERE user_id = p_user_id 
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
      result := json_build_object(
        'status', 'payment_pending',
        'is_pro', false,
        'waiting_payment_id', waiting_record.id,
        'subscription_type', waiting_record.subscription_type,
        'amount', waiting_record.amount_paid,
        'payment_url', waiting_record.payment_url,
        'expires_at', waiting_record.expires_at
      );
    ELSE
      result := json_build_object(
        'status', 'no_subscription',
        'is_pro', false
      );
    END IF;
  END IF;
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_user_payment_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_payment_transactions"("p_limit" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "tripay_reference" "text", "payment_method" "text", "masked_amount" "text", "currency" "text", "status" "text", "created_at" timestamp with time zone, "paid_at" timestamp with time zone, "expires_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  requesting_user_id uuid;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Must be authenticated
  IF requesting_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(requesting_user_id, 'payment_transactions') THEN
    RAISE EXCEPTION 'Rate limit exceeded for payment data access';
  END IF;
  
  -- Log the access
  PERFORM public.log_sensitive_action(
    'user_payment_list_access',
    'payment_transactions',
    NULL,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'limit_requested', p_limit
    )
  );
  
  -- Return user's own transactions with masked sensitive data
  RETURN QUERY
  SELECT 
    pt.id,
    pt.tripay_reference,
    pt.payment_method,
    '***.' || RIGHT(pt.amount::text, 2) as masked_amount, -- Show last 2 digits only
    pt.currency,
    pt.status,
    pt.created_at,
    pt.paid_at,
    pt.expires_at
  FROM public.payment_transactions pt
  WHERE pt.user_id = requesting_user_id
  ORDER BY pt.created_at DESC
  LIMIT COALESCE(p_limit, 10);
END;
$$;


ALTER FUNCTION "public"."get_user_payment_transactions"("p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_xp_for_next_level"("current_level" integer) RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  CASE current_level
    WHEN 1 THEN RETURN 150;
    WHEN 2 THEN RETURN 500;
    WHEN 3 THEN RETURN 1200;
    WHEN 4 THEN RETURN 2500;
    WHEN 5 THEN RETURN 4500;
    WHEN 6 THEN RETURN 7000;
    WHEN 7 THEN RETURN 9000;
    WHEN 8 THEN RETURN 12000;
    WHEN 9 THEN RETURN 15000;
    ELSE RETURN 15000; -- Max level reached
  END CASE;
END;
$$;


ALTER FUNCTION "public"."get_xp_for_next_level"("current_level" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_xp_thresholds"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN jsonb_build_object(
    'thresholds', jsonb_build_array(0, 150, 500, 1200, 2500, 4500, 7000, 9000, 12000, 15000),
    'requirements', jsonb_build_object(
      '1', jsonb_build_object('total_xp', 0, 'xp_for_next', 150),
      '2', jsonb_build_object('total_xp', 150, 'xp_for_next', 350),
      '3', jsonb_build_object('total_xp', 500, 'xp_for_next', 700),
      '4', jsonb_build_object('total_xp', 1200, 'xp_for_next', 1300),
      '5', jsonb_build_object('total_xp', 2500, 'xp_for_next', 2000),
      '6', jsonb_build_object('total_xp', 4500, 'xp_for_next', 2500),
      '7', jsonb_build_object('total_xp', 7000, 'xp_for_next', 2000),
      '8', jsonb_build_object('total_xp', 9000, 'xp_for_next', 3000),
      '9', jsonb_build_object('total_xp', 12000, 'xp_for_next', 3000),
      '10', jsonb_build_object('total_xp', 15000, 'xp_for_next', 0)
    )
  );
END;
$$;


ALTER FUNCTION "public"."get_xp_thresholds"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_xp_thresholds"() IS 'Returns XP threshold data for frontend display';



CREATE OR REPLACE FUNCTION "public"."grant_admin_role"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Only super admins can grant roles
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Only super admins can grant admin roles';
  END IF;
  
  -- Validate role
  IF p_role NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role. Only admin or moderator roles can be granted';
  END IF;
  
  -- Insert the role
  INSERT INTO public.admin_roles (user_id, role, granted_by, expires_at)
  VALUES (p_target_user_id, p_role, auth.uid(), p_expires_at)
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    granted_by = EXCLUDED.granted_by,
    granted_at = now(),
    expires_at = EXCLUDED.expires_at,
    is_active = true;
  
  -- Log the role grant
  PERFORM public.log_sensitive_action(
    'admin_role_granted',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'role_granted', p_role,
      'granted_by', auth.uid(),
      'expires_at', p_expires_at
    )
  );
  
  RETURN true;
END;
$$;


ALTER FUNCTION "public"."grant_admin_role"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."grant_pro_status"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Add 'pro' to achievements array if not already present
  UPDATE public.profiles 
  SET achievements = CASE 
    WHEN 'pro' = ANY(achievements) THEN achievements
    ELSE array_append(achievements, 'pro')
  END,
  updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create profile if it doesn't exist
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, achievements)
    VALUES (p_user_id, ARRAY['pro'])
    ON CONFLICT (user_id) DO UPDATE SET
      achievements = CASE 
        WHEN 'pro' = ANY(excluded.achievements) THEN excluded.achievements
        ELSE array_append(profiles.achievements, 'pro')
      END,
      updated_at = now();
  END IF;
END;
$$;


ALTER FUNCTION "public"."grant_pro_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_daily_login"("p_user_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_profile RECORD;
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
  current_timestamp TIMESTAMP WITH TIME ZONE := now();
  computed_streak INTEGER := 0;
  xp_awarded INTEGER := 0;
  streak_bonus_awarded BOOLEAN := false;
  should_notify BOOLEAN := false;
  result jsonb;
BEGIN
  -- Get current user profile with lock
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Check if user already logged in today AND was notified recently
  IF user_profile.last_login_date = today_date THEN
    -- Check if notification was sent in the last hour (prevent spam)
    IF user_profile.last_notification_time IS NOT NULL AND 
       user_profile.last_notification_time > (current_timestamp - INTERVAL '1 hour') THEN
      -- User already logged in today and was notified recently
      RETURN jsonb_build_object(
        'streak_days', user_profile.streak_days,
        'xp_awarded', 0,
        'streak_bonus_awarded', false,
        'message', 'Already logged in today',
        'should_notify', false
      );
    END IF;
  END IF;
  
  -- Determine computed streak
  IF user_profile.last_login_date = yesterday_date THEN
    -- Consecutive login, increment streak
    computed_streak := COALESCE(user_profile.streak_days,0) + 1;
  ELSE
    -- First login after gap or null, computed streak = 1
    computed_streak := 1;
  END IF;
  
  -- Only process if this is actually a new login (not already processed today)
  IF user_profile.last_login_date != today_date THEN
    should_notify := true;
    
    -- Check for 7-day streak bonus: award when computed reaches multiple of 7
    IF computed_streak >= 7 AND (computed_streak % 7 = 0) THEN
      -- Award streak bonus (allow multiple bonuses on multiples of 7)
      IF user_profile.last_streak_bonus_date IS NULL OR 
         user_profile.last_streak_bonus_date < (today_date - INTERVAL '6 days') THEN
        xp_awarded := 50;
        streak_bonus_awarded := true;
        
        -- Award XP using existing function
        PERFORM public.award_xp(
          p_user_id,
          xp_awarded,
          'weekly_streak_bonus',
          'Completed 7-day login streak',
          jsonb_build_object('streak_days', computed_streak, 'bonus_date', today_date)
        );
        -- update last_streak_bonus_date
      END IF;
    END IF;

    -- Update profile: preserve highest streak using GREATEST
    UPDATE public.profiles
    SET 
      streak_days = GREATEST(COALESCE(streak_days,0), computed_streak),
      last_login_date = today_date,
      last_notification_time = current_timestamp,
      last_streak_bonus_date = CASE 
        WHEN streak_bonus_awarded THEN today_date 
        ELSE last_streak_bonus_date 
      END,
      updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Just update notification time to prevent spam
    UPDATE public.profiles
    SET last_notification_time = current_timestamp
    WHERE user_id = p_user_id;
  END IF;
  
  -- Build result
  result := jsonb_build_object(
    'streak_days', (SELECT streak_days FROM public.profiles WHERE user_id = p_user_id),
    'xp_awarded', xp_awarded,
    'streak_bonus_awarded', streak_bonus_awarded,
    'should_notify', should_notify,
    'message', CASE 
      WHEN NOT should_notify THEN 'Already logged in today'
      WHEN streak_bonus_awarded THEN 'Weekly streak bonus earned!'
      WHEN (SELECT streak_days FROM public.profiles WHERE user_id = p_user_id) = 1 THEN 'Login streak started!'
      ELSE 'Login streak continued!'
    END
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."handle_daily_login"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  BEGIN
    -- Simple insertion with fallback values
    INSERT INTO public.profiles (user_id, display_name, user_email,
  created_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name',
  split_part(NEW.email, '@', 1), 'User'),
      NEW.email,
      now()
    );

    RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user_trial"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    -- No more automatic trials - users must pay for Pro
    RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."handle_new_user_trial"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_subscription_payment"("p_user_id" "uuid", "p_user_email" "text", "p_plan" "text", "p_amount" numeric, "p_tripay_ref" "text") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    days_to_add INTEGER;
    result_id UUID;
    existing_sub RECORD;
BEGIN
    -- Get days based on plan
    days_to_add := CASE p_plan
        WHEN '1_day' THEN 1
        WHEN '1_week' THEN 7
        WHEN '1_month' THEN 30
        WHEN '1_year' THEN 365
        ELSE 30
    END;
    
    -- Check if user has active subscription
    SELECT * INTO existing_sub
    FROM public.pro_subscriptions 
    WHERE user_id = p_user_id AND status = 'active';
    
    IF existing_sub.id IS NOT NULL THEN
        -- EXTEND existing subscription
        UPDATE public.pro_subscriptions 
        SET 
            subscription_end_date = subscription_end_date + (days_to_add || ' days')::INTERVAL,
            subscription_type = p_plan,
            amount_paid = amount_paid + p_amount,
            tripay_reference = p_tripay_ref,
            updated_at = NOW()
        WHERE id = existing_sub.id
        RETURNING id INTO result_id;
    ELSE
        -- CREATE new subscription
        INSERT INTO public.pro_subscriptions (
            user_id, user_email, subscription_type, status,
            subscription_start_date, subscription_end_date,
            amount_paid, currency, tripay_reference,
            created_at, updated_at
        ) VALUES (
            p_user_id, p_user_email, p_plan, 'active',
            NOW(), NOW() + (days_to_add || ' days')::INTERVAL,
            p_amount, 'IDR', p_tripay_ref,
            NOW(), NOW()
        ) RETURNING id INTO result_id;
    END IF;
    
    RETURN result_id;
END;
$$;


ALTER FUNCTION "public"."handle_subscription_payment"("p_user_id" "uuid", "p_user_email" "text", "p_plan" "text", "p_amount" numeric, "p_tripay_ref" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_subscription_upgrade"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- If inserting active subscription and user already has active subscription
    IF NEW.status = 'active' AND EXISTS (
        SELECT 1 FROM pro_subscriptions
        WHERE user_id = NEW.user_id
        AND status = 'active'
        AND id != NEW.id
    ) THEN
        -- Get existing subscription
        WITH existing AS (
            SELECT * FROM pro_subscriptions
            WHERE user_id = NEW.user_id
            AND status = 'active'
            AND id != NEW.id
            ORDER BY subscription_end_date DESC
            LIMIT 1
        )
        -- If new subscription is longer, update existing instead of creating duplicate
        UPDATE pro_subscriptions
        SET
            subscription_type = CASE
                WHEN NEW.subscription_end_date > (SELECT subscription_end_date FROM existing) THEN NEW.subscription_type
                ELSE subscription_type
            END,
            subscription_end_date = GREATEST(subscription_end_date, NEW.subscription_end_date),
            days_remaining = GREATEST(days_remaining, NEW.days_remaining),
            updated_at = NOW()
        WHERE user_id = NEW.user_id AND status = 'active';

        -- Prevent the INSERT
        RETURN NULL;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_subscription_upgrade"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_successful_payment_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    commission_rate NUMERIC := 0.30;
    commission_val NUMERIC;
    fetched_affiliate_email TEXT;
BEGIN
    -- Check if status changed to PAID
    IF NEW.status = 'PAID' AND (OLD.status IS NULL OR OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- RULE: Uang Panas = 50%
            IF NEW.product_name ILIKE '%Uang Panas%' OR NEW.product_name ILIKE '%ebook_uangpanas%' THEN
                commission_rate := 0.50;
            END IF;

            -- Calculate Amount
            commission_val := FLOOR(NEW.amount * commission_rate);
            
            -- LOOKUP EMAIL DIRECTLY FROM AUTH.USERS
            -- This ensures we get the email even if global_product is missing it
            SELECT email INTO fetched_affiliate_email
            FROM auth.users
            WHERE id = NEW.affiliate_id;

            -- Insert Record
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                affiliate_email, -- Uses the fetched email
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.email,
                fetched_affiliate_email, 
                NEW.product_name,
                NEW.amount,
                commission_rate * 100,
                commission_val,
                NEW.tripay_reference,
                NOW()
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_successful_payment_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_successful_waiting_payment_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    commission_rate NUMERIC := 0.30;
    commission_val NUMERIC;
    fetched_affiliate_email TEXT;
BEGIN
    IF (NEW.status = 'paid' OR NEW.status = 'PAID') AND (OLD.status != 'paid' AND OLD.status != 'PAID') THEN
        
        IF NEW.affiliate_id IS NOT NULL THEN
            
            -- RULE: Uang Panas = 50%
            IF (NEW.subscription_type IS NOT NULL AND (NEW.subscription_type = 'ebook_uangpanas' OR NEW.subscription_type ILIKE '%Uang Panas%')) THEN
                 commission_rate := 0.50;
            END IF;

            commission_val := FLOOR(NEW.amount_paid * commission_rate);
            
            -- LOOKUP EMAIL
            SELECT email INTO fetched_affiliate_email
            FROM auth.users
            WHERE id = NEW.affiliate_id;
            
            INSERT INTO public.commissions (
                affiliate_user_id,
                user_email,
                affiliate_email,
                product_name,
                sale_amount,
                commission_percentage,
                commission_amount,
                transaction_id,
                created_at
            ) VALUES (
                NEW.affiliate_id,
                NEW.user_email,
                fetched_affiliate_email,
                NEW.subscription_type,
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
$$;


ALTER FUNCTION "public"."handle_successful_waiting_payment_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_xp_transaction_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Update streak and check achievements after any XP transaction
  PERFORM public.update_user_streak(NEW.user_id);
  PERFORM public.check_and_award_achievements(NEW.user_id);
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_xp_transaction_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_pro_achievement"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
    AND 'pro' = ANY(achievements)
  );
END;
$$;


ALTER FUNCTION "public"."has_pro_achievement"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_total_journal"("user_id_param" "uuid", "source_type" "text" DEFAULT 'journal_entry'::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _user_id uuid := user_id_param;
BEGIN
  UPDATE profiles
  SET total_journal = COALESCE(total_journal, 0) + 1, updated_at = now()
  WHERE user_id = _user_id;

  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (_user_id, 'journal_completion', jsonb_build_object('source', source_type));
END;
$$;


ALTER FUNCTION "public"."increment_total_journal"("user_id_param" "uuid", "source_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_total_verses"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."increment_total_verses"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_total_verses"("user_id_param" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _user_id uuid := user_id_param;
BEGIN
  UPDATE profiles
  SET total_verses = COALESCE(total_verses, 0) + 1, updated_at = now()
  WHERE user_id = _user_id;

  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (_user_id, 'verse_completion', '{"source": "audio_completion"}'::jsonb);
END;
$$;


ALTER FUNCTION "public"."increment_total_verses"("user_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_total_verses_unlimited"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Log the update
  INSERT INTO public.user_activities (user_id, activity_type, metadata)
  VALUES (p_user_id, 'total_verses_incremented', '{"source": "unlimited_increment"}'::jsonb);
END;
$$;


ALTER FUNCTION "public"."increment_total_verses_unlimited"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_verse_count"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Insert an internal-only activity log that the trigger ignores
  INSERT INTO public.user_activities (user_id, activity_type, metadata)
  VALUES (p_user_id, 'verse_incremented_internal', jsonb_build_object('source', 'unconditional_increment'));
END;
$$;


ALTER FUNCTION "public"."increment_verse_count"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_super_admin_user"() RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;


ALTER FUNCTION "public"."is_super_admin_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_verified_admin"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Check the admin_roles table instead of profile achievements
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = p_user_id 
    AND role IN ('admin', 'super_admin')
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;


ALTER FUNCTION "public"."is_verified_admin"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_auth_request"("p_user_id" "uuid" DEFAULT NULL::"uuid", "p_request_type" "text" DEFAULT 'getUser'::"text", "p_user_agent" "text" DEFAULT NULL::"text", "p_ip_address" "text" DEFAULT NULL::"text", "p_component_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO auth_request_logs (user_id, request_type, user_agent, ip_address, component_name)
  VALUES (p_user_id, p_request_type, p_user_agent, p_ip_address::inet, p_component_name);
END;
$$;


ALTER FUNCTION "public"."log_auth_request"("p_user_id" "uuid", "p_request_type" "text", "p_user_agent" "text", "p_ip_address" "text", "p_component_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_data_access"("p_table_name" "text", "p_operation" "text", "p_record_id" "uuid" DEFAULT NULL::"uuid", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.security_audit_log (
      user_id, 
      action, 
      table_name, 
      record_id, 
      metadata
    ) VALUES (
      auth.uid(), 
      p_operation || '_' || p_table_name,
      p_table_name, 
      p_record_id, 
      p_metadata
    );
  END IF;
END;
$$;


ALTER FUNCTION "public"."log_data_access"("p_table_name" "text", "p_operation" "text", "p_record_id" "uuid", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_sensitive_action"("p_action" "text", "p_table_name" "text" DEFAULT NULL::"text", "p_record_id" "uuid" DEFAULT NULL::"uuid", "p_metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, 
    action, 
    table_name, 
    record_id, 
    metadata
  ) VALUES (
    auth.uid(), 
    p_action, 
    p_table_name, 
    p_record_id, 
    p_metadata
  );
END;
$$;


ALTER FUNCTION "public"."log_sensitive_action"("p_action" "text", "p_table_name" "text", "p_record_id" "uuid", "p_metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_storage_action_and_call_edge"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions', 'pg_temp'
    AS $$
BEGIN
  -- Intentionally do nothing to avoid errors from logging/storage schema mismatches
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."log_storage_action_and_call_edge"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_notification_type_shown"("p_user_id" "uuid", "p_notification_type" character varying) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO notifications (
        user_id, 
        title, 
        message, 
        notification_type,
        read,
        created_at
    )
    VALUES (
        p_user_id, 
        'System Tracking', 
        'Internal tracking record for ' || p_notification_type, 
        p_notification_type,
        true,
        NOW()
    )
    ON CONFLICT DO NOTHING;
END;
$$;


ALTER FUNCTION "public"."mark_notification_type_shown"("p_user_id" "uuid", "p_notification_type" character varying) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mask_sensitive_payment_data"("p_bank_account" "text", "p_amount" numeric, "p_payment_instructions" "jsonb", "p_callback_data" "jsonb", "p_moota_webhook_data" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN jsonb_build_object(
    'bank_account_masked', 
    CASE 
      WHEN p_bank_account IS NOT NULL THEN 
        LEFT(p_bank_account, 4) || '****' || RIGHT(p_bank_account, 4)
      ELSE NULL 
    END,
    'amount_masked', 
    CASE 
      WHEN p_amount IS NOT NULL THEN '***.**'
      ELSE NULL 
    END,
    'has_payment_instructions', p_payment_instructions IS NOT NULL,
    'has_callback_data', p_callback_data IS NOT NULL,
    'has_webhook_data', p_moota_webhook_data IS NOT NULL
  );
END;
$$;


ALTER FUNCTION "public"."mask_sensitive_payment_data"("p_bank_account" "text", "p_amount" numeric, "p_payment_instructions" "jsonb", "p_callback_data" "jsonb", "p_moota_webhook_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."monitor_sensitive_data_access"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Enhanced monitoring for sensitive table access
  IF TG_TABLE_NAME IN ('user_contact_info', 'payment_transactions', 'vip_subscriptions', 'device_tokens') THEN
    -- Check for suspicious access patterns
    PERFORM public.log_sensitive_action(
      'sensitive_table_access',
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      jsonb_build_object(
        'operation', TG_OP,
        'table', TG_TABLE_NAME,
        'timestamp', now(),
        'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."monitor_sensitive_data_access"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."photo_credit_broadcast_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (OLD.tripay_reference IS DISTINCT FROM NEW.tripay_reference) THEN
    PERFORM realtime.broadcast_changes(
      'photo_credit:' || NEW.id::text, -- topic
      TG_OP,                           -- event
      TG_OP,                           -- event type (same)
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."photo_credit_broadcast_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."photo_credit_replace_on_reference"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- If reference is missing, let the insert proceed as normal
  IF NEW.tripay_reference IS NULL THEN
    RETURN NEW;
  END IF;

  -- Remove any existing row with the same reference
  DELETE FROM public.photo_credit
  WHERE tripay_reference = NEW.tripay_reference;

  -- Proceed with the new row
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."photo_credit_replace_on_reference"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."photo_credit_upsert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Treat NULL credit as 0
  NEW.credit := COALESCE(NEW.credit, 0);

  -- Update existing row if user exists
  UPDATE public.photo_credit t
  SET
    credit       = COALESCE(t.credit, 0) + NEW.credit,          -- accumulate
    credit_type  = COALESCE(NEW.credit_type, t.credit_type),    -- latest type if provided
    amount       = COALESCE(NEW.amount, t.amount),              -- keep latest non-null amount if provided
    status       = COALESCE(NEW.status, t.status),
    tripay_reference = COALESCE(NEW.tripay_reference, t.tripay_reference),
    user_name    = COALESCE(NEW.user_name, t.user_name),
    user_email   = COALESCE(NEW.user_email, t.user_email),
    phone_number = COALESCE(NEW.phone_number, t.phone_number)
  WHERE t.user_id = NEW.user_id;

  IF FOUND THEN
    RETURN NULL; -- skip insert, we already updated
  END IF;

  -- No existing row: initialize first record
  NEW.credit := COALESCE(NEW.credit, 0);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."photo_credit_upsert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_affiliate_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Only attempt lookup if affiliate_id is present and email is missing
    IF NEW.affiliate_id IS NOT NULL AND NEW.affiliate_email IS NULL THEN
        
        -- Try to fetch email from auth.users (requires permission)
        -- OR from public.profiles if auth.users is restricted from this context
        -- Assuming public.profiles has user_id and email (or joined)
        
        SELECT email INTO NEW.affiliate_email
        FROM auth.users
        WHERE id = NEW.affiliate_id;
        
        -- Fallback: If auth.users access fails due to security definer issues,
        -- ensure this function is created with SECURITY DEFINER to run as owner.
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_affiliate_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."populate_elite_habit_email"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Get user email from auth.users table
    -- Handle both UUID and text formats safely
    BEGIN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id::uuid;
    EXCEPTION WHEN OTHERS THEN
        -- If conversion fails, try direct comparison
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id::text = NEW.user_id;
    END;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."populate_elite_habit_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."prevent_unauthorized_pro"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Only block NEW pro subscription inserts without valid payment
    IF TG_OP = 'INSERT' AND NEW.created_at >= NOW() - INTERVAL '1 minute' THEN
        -- Check if this comes from valid payment
        IF NEW.tripay_reference IS NULL OR NOT EXISTS (
            SELECT 1 FROM payment_transactions 
            WHERE tripay_reference = NEW.tripay_reference 
            AND status = 'paid'
        ) THEN
            RAISE EXCEPTION 'Pro subscription requires completed payment - contact support';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."prevent_unauthorized_pro"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text") RETURNS json
    LANGUAGE "plpgsql"
    AS $$
  DECLARE
    payment_record RECORD;
  BEGIN
    -- Find payment in payment_transactions
    SELECT * INTO payment_record
    FROM payment_transactions
    WHERE tripay_reference = p_tripay_reference;

    IF NOT FOUND THEN
      RETURN json_build_object('success', false, 'error', 'Payment not found');
    END IF;

    -- If PAID, update payment_transactions and create pro_subscription
    IF p_payment_status = 'PAID' THEN
      -- Update payment status
      UPDATE payment_transactions
      SET status = 'paid', updated_at = NOW()
      WHERE tripay_reference = p_tripay_reference;

      -- Insert into pro_subscriptions (if not exists)
      INSERT INTO pro_subscriptions (user_id, email, subscription_type, status, tripay_reference, subscription_start_date, subscription_end_date, verse_access, pro_badge)
      VALUES (payment_record.user_id, payment_record.email, payment_record.subscription_type, 'active', p_tripay_reference, NOW(),
        CASE payment_record.subscription_type
          WHEN '1_day' THEN NOW() + INTERVAL '1 day'
          WHEN '1_week' THEN NOW() + INTERVAL '7 days'
          WHEN '1_month' THEN NOW() + INTERVAL '30 days'
          WHEN '1_year' THEN NOW() + INTERVAL '1 year'
        END, true, true)
      ON CONFLICT (user_id) DO NOTHING;

      RETURN json_build_object('success', true, 'action', 'subscription_activated');
    END IF;

    RETURN json_build_object('success', true, 'action', 'status_updated');
  END;
  $$;


ALTER FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text", "p_payment_method" "text") RETURNS json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  waiting_record RECORD;
  new_subscription_id UUID;
  result JSON;
BEGIN
  -- Find the pending payment in the 'waiting_payment' table
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    -- If no record is found, it might have been processed already or never existed.
    RETURN json_build_object(
      'success', false,
      'error', 'Payment record not found in waiting_payment table.',
      'reference', p_tripay_reference
    );
  END IF;
  
  -- Only proceed if the status from Tripay is 'PAID'
  IF p_payment_status = 'PAID' THEN
    -- This function should handle moving the record from waiting_payment
    -- to pro_subscriptions and setting the status to 'active'.
    -- We are assuming 'activate_pro_subscription' function already exists.
    new_subscription_id := public.activate_pro_subscription(
      p_tripay_reference, 
      p_payment_method
    );
    
    -- Return a success message
    result := json_build_object(
      'success', true,
      'action', 'subscription_activated',
      'subscription_id', new_subscription_id,
      'user_id', waiting_record.user_id
    );
    
  ELSE
    -- If status is not 'PAID' (e.g., 'FAILED', 'EXPIRED'), return a failure message.
    result := json_build_object(
      'success', false,
      'action', 'payment_not_paid',
      'status', p_payment_status,
      'waiting_payment_id', waiting_record.id
    );
  END IF;
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text", "p_payment_method" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reflections_counter_change"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET total_journal = COALESCE(total_journal, 0) + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET total_journal = GREATEST(COALESCE(total_journal, 0) - 1, 0),
        updated_at = now()
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."reflections_counter_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reflections_counter_sync"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);

  UPDATE public.profiles p
  SET total_journal = (
    SELECT COUNT(*)
    FROM public.reflections r
    WHERE r.user_id = v_user_id
  ),
      updated_at = now()
  WHERE p.user_id = v_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."reflections_counter_sync"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."revoke_admin_role"("p_target_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Only super admins can revoke roles
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  ) THEN
    RAISE EXCEPTION 'Only super admins can revoke admin roles';
  END IF;
  
  -- Revoke the role
  UPDATE public.admin_roles 
  SET is_active = false 
  WHERE user_id = p_target_user_id;
  
  -- Log the revocation
  PERFORM public.log_sensitive_action(
    'admin_role_revoked',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'target_user', p_target_user_id,
      'revoked_by', auth.uid()
    )
  );
  
  RETURN true;
END;
$$;


ALTER FUNCTION "public"."revoke_admin_role"("p_target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."revoke_pro_status"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Remove 'pro' from achievements array
  UPDATE public.profiles 
  SET achievements = array_remove(achievements, 'pro'),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."revoke_pro_status"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."secure_admin_role_grant"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_justification" "text" DEFAULT NULL::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  granting_user_id uuid;
  verification_result jsonb;
  requires_approval boolean := false;
  result jsonb;
BEGIN
  granting_user_id := auth.uid();
  
  -- Verify granting user is super admin
  verification_result := public.verify_admin_with_failsafe(granting_user_id, 'super_admin');
  
  IF NOT (verification_result->>'is_admin')::boolean THEN
    -- Log failed attempt
    PERFORM public.log_sensitive_action(
      'admin_role_grant_denied',
      'admin_roles',
      p_target_user_id,
      jsonb_build_object(
        'target_user', p_target_user_id,
        'requested_role', p_role,
        'denied_reason', 'insufficient_privileges',
        'verification_result', verification_result
      )
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Access denied: Super admin privileges required',
      'verification_result', verification_result
    );
  END IF;
  
  -- Determine if approval is needed (super_admin grants always require approval)
  requires_approval := (p_role = 'super_admin');
  
  -- Log the grant attempt with high detail
  INSERT INTO public.admin_activity_log (
    user_id,
    action,
    target_user_id,
    metadata,
    requires_approval
  ) VALUES (
    granting_user_id,
    'admin_role_grant_attempt',
    p_target_user_id,
    jsonb_build_object(
      'requested_role', p_role,
      'expires_at', p_expires_at,
      'justification', p_justification,
      'requires_approval', requires_approval,
      'verification_result', verification_result
    ),
    requires_approval
  );
  
  -- If approval not required, grant immediately
  IF NOT requires_approval THEN
    INSERT INTO public.admin_roles (user_id, role, granted_by, expires_at)
    VALUES (p_target_user_id, p_role, granting_user_id, p_expires_at)
    ON CONFLICT (user_id) DO UPDATE SET
      role = EXCLUDED.role,
      granted_by = EXCLUDED.granted_by,
      granted_at = now(),
      expires_at = EXCLUDED.expires_at,
      is_active = true;
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin role granted successfully',
      'role_granted', p_role,
      'requires_approval', false
    );
  ELSE
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin role grant submitted for approval',
      'role_requested', p_role,
      'requires_approval', true
    );
  END IF;
  
  -- Enhanced logging
  PERFORM public.log_sensitive_action(
    'admin_role_grant_processed',
    'admin_roles',
    p_target_user_id,
    result || jsonb_build_object('verification_result', verification_result)
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."secure_admin_role_grant"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone, "p_justification" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text" DEFAULT 'community'::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_profile RECORD;
  clean_username TEXT;
  message_id UUID;
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check rate limiting
  IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
    RAISE EXCEPTION 'Rate limit exceeded for chat messages';
  END IF;

  -- Get user profile for level and display name
  SELECT level, display_name
  INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Clean the username
  clean_username := CASE
    WHEN user_profile.display_name LIKE '%@%' THEN
      split_part(user_profile.display_name, '@', 1)
    ELSE COALESCE(user_profile.display_name, 'Anonymous')
  END;

  -- Insert ONLY the columns that exist now
  INSERT INTO public.chat_messages (
    user_id,
    user_name,
    user_level,
    message,
    channel_id
  ) VALUES (
    auth.uid(),
    clean_username,
    COALESCE(user_profile.level, 1),
    p_message,
    p_channel_id
  ) RETURNING id INTO message_id;

  RETURN message_id;
END;
$$;


ALTER FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text" DEFAULT 'general'::"text", "p_is_private" boolean DEFAULT false, "p_allowed_users" "uuid"[] DEFAULT NULL::"uuid"[]) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  DECLARE
    user_profile RECORD;
    clean_username text;
    message_id uuid;
    user_subscription_type text;
  BEGIN
    -- Check authentication
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Check rate limiting
    IF NOT public.check_sensitive_data_rate_limit(auth.uid(), 'chat_messages') THEN
      RAISE EXCEPTION 'Rate limit exceeded for chat messages';
    END IF;

    -- Get user profile for level and pro status
    SELECT level, 'pro' = ANY(achievements) as is_pro, display_name
    INTO user_profile
    FROM public.profiles
    WHERE user_id = auth.uid();

    -- Get user subscription type from active subscription
    SELECT subscription_type INTO user_subscription_type
    FROM public.pro_subscriptions
    WHERE user_id = auth.uid() AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Clean the username
    clean_username := CASE
      WHEN user_profile.display_name LIKE '%@%' THEN
  split_part(user_profile.display_name, '@', 1)
      ELSE COALESCE(user_profile.display_name, 'Anonymous')
    END;

    -- Insert the message with subscription_type
    INSERT INTO public.chat_messages (
      user_id,
      user_name,
      user_level,
      is_pro,
      message,
      channel_id,
      is_private,
      allowed_users,
      subscription_type
    ) VALUES (
      auth.uid(),
      clean_username,
      COALESCE(user_profile.level, 1),
      COALESCE(user_profile.is_pro, false),
      p_message,
      p_channel_id,
      p_is_private,
      p_allowed_users,
      user_subscription_type
    ) RETURNING id INTO message_id;

    RETURN message_id;
  END;
  $$;


ALTER FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_order_to_vps"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  perform net.http_post(
    url := current_setting('app.secrets.URL_PAYMENT'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-access-key', current_setting('app.secrets.AKSES_CURL')
    ),
    body := jsonb_build_object(
      'merchant_ref', NEW.merchant_ref,
      'amount', NEW.amount,
      'customer_name', NEW.customer_name,
      'customer_email', NEW.customer_email,
      'subscription_type', NEW.subscription_type
    )
  );
  return NEW;
end;
$$;


ALTER FUNCTION "public"."send_order_to_vps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_message_subscription_type"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  BEGIN
    -- Get user's current active subscription type
    SELECT subscription_type INTO NEW.subscription_type
    FROM pro_subscriptions
    WHERE user_id = NEW.user_id
      AND status = 'active'
    LIMIT 1;

    -- If no active subscription found, set to null
    IF NEW.subscription_type IS NULL THEN
      NEW.subscription_type = NULL;
    END IF;

    RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."set_message_subscription_type"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_profile_level_from_xp"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Ensure level stays in sync with experience_points
  NEW.level := public.calculate_level_from_xp(COALESCE(NEW.experience_points, 0));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_profile_level_from_xp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN NEW.updated_at = timezone('utc', now()); RETURN NEW; END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_user_id_from_email"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.user_email IS NOT NULL THEN
    SELECT id INTO NEW.user_id
    FROM auth.users
    WHERE email = NEW.user_email
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_user_id_from_email"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_user_id_from_subscription"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.user_id IS NULL AND NEW.subscription_id IS NOT NULL THEN
    SELECT user_id INTO NEW.user_id
    FROM pro_subscriptions
    WHERE id = NEW.subscription_id
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_user_id_from_subscription"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_days_remaining_daily"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Update all active subscriptions daily
    UPDATE public.pro_subscriptions 
    SET 
        days_remaining = GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER),
        updated_at = NOW()
    WHERE status = 'active';
    
    -- Get the count of updated rows
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    -- Log how many records updated
    RAISE NOTICE 'Updated % active subscriptions with new days_remaining', updated_count;
END;
$$;


ALTER FUNCTION "public"."sync_days_remaining_daily"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_display_name_to_metadata"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Sync from profiles to auth metadata
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                            jsonb_build_object('display_name', profiles.display_name),
        updated_at = now()
    FROM profiles 
    WHERE auth.users.id = profiles.user_id
      AND profiles.display_name IS NOT NULL 
      AND trim(profiles.display_name) != ''
      AND (auth.users.raw_user_meta_data->>'display_name' IS NULL 
           OR trim(auth.users.raw_user_meta_data->>'display_name') = ''
           OR auth.users.raw_user_meta_data->>'display_name' = 'Anonymous'
           OR auth.users.raw_user_meta_data->>'display_name' != profiles.display_name);
           
    -- Log the sync operation
    RAISE NOTICE 'Display name metadata sync completed at %', now();
END;
$$;


ALTER FUNCTION "public"."sync_display_name_to_metadata"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_elite_habit_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update the profiles table with the new count for the affected user
    UPDATE public.profiles
    SET
        total_elite_habit = (
            SELECT COUNT(*)
            FROM public.elite_habits
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
        ),
        updated_at = now()
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."sync_elite_habit_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_pro_status_from_subscription"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Do nothing, sync is not needed
  RETURN true;
END;
$$;


ALTER FUNCTION "public"."sync_pro_status_from_subscription"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_to_metadata"() RETURNS TABLE("user_id" "uuid", "status" "text", "synced_fields" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  sync_count integer := 0;
BEGIN
  -- Update user metadata with essential profile fields only
  WITH profile_data AS (
    SELECT 
      p.user_id,
      p.display_name,
      p.level,
      COALESCE(p.is_pro, false) as is_pro,
      p.achievements,
      p.subscription_type
    FROM profiles p
    WHERE p.display_name IS NOT NULL -- Only sync users with display names
  ),
  metadata_updates AS (
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'display_name', pd.display_name,
        'level', pd.level,
        'is_pro', pd.is_pro,
        'achievements', CASE 
          WHEN pd.achievements IS NOT NULL THEN to_jsonb(pd.achievements)
          ELSE '[]'::jsonb
        END,
        'subscription_type', pd.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint,
        'sync_version', '4.0'
      )
    FROM profile_data pd
    WHERE auth.users.id = pd.user_id
    RETURNING auth.users.id as updated_user_id
  )
  SELECT COUNT(*) INTO sync_count FROM metadata_updates;

  -- Return results for verification
  RETURN QUERY
  SELECT 
    p.user_id,
    'SYNCED'::text as status,
    format('display_name=%s, level=%s, is_pro=%s', 
           p.display_name, p.level::text, p.is_pro::text) as synced_fields
  FROM profiles p
  WHERE p.display_name IS NOT NULL;

  RAISE NOTICE 'Successfully synced % profiles to metadata v4.0', sync_count;
END;
$$;


ALTER FUNCTION "public"."sync_profile_to_metadata"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_reflection_count"("user_uuid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.profiles p
  SET total_journal = (
    SELECT COUNT(*)
    FROM public.reflections r
    WHERE r.user_id = user_uuid
  )
  WHERE p.id = user_uuid;
END;
$$;


ALTER FUNCTION "public"."sync_reflection_count"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_user_webinar_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NOW() >= NEW.ends_at THEN
        NEW.status := 'Expired';
    ELSE
        NEW.status := 'Active';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_user_webinar_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_verse_notif_display_name"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
  BEGIN
    -- Always use current display_name from profiles
    NEW.display_name := get_current_display_name(NEW.user_id);
    RETURN NEW;
  END;
  $$;


ALTER FUNCTION "public"."sync_verse_notif_display_name"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_user_presence"("p_email" "text" DEFAULT NULL::"text", "p_display_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    PERFORM update_user_online_status(auth.uid(), p_email, p_display_name);
END;
$$;


ALTER FUNCTION "public"."track_user_presence"("p_email" "text", "p_display_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_log_storage_action"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Do nothing, just return the row to avoid breaking storage operations
  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."trg_log_storage_action"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_cleanup_waiting_payment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.waiting_payment) % 10 = 0 THEN
    PERFORM cleanup_waiting_payment_24h();
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_cleanup_waiting_payment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_journal_tracking"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE public.profiles
    SET daily_journal_entries = CASE 
        WHEN last_journal_date != CURRENT_DATE OR last_journal_date IS NULL THEN 1
        ELSE daily_journal_entries + 1
    END,
    last_journal_date = CURRENT_DATE,
    last_journal_timestamp = NOW()
    WHERE user_id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."update_journal_tracking"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile_last_login"("p_last_login" timestamp with time zone, "p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE profiles
  SET last_login_date = p_last_login
  WHERE id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."update_profile_last_login"("p_last_login" timestamp with time zone, "p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login_date" "text") RETURNS TABLE("id" "uuid", "user_id" "uuid", "last_login_date" "date")
    LANGUAGE "sql"
    AS $$
  UPDATE public.profiles
  SET last_login_date = (p_last_login_date::date)
  WHERE (user_id = p_user_id OR id = p_user_id)
  RETURNING id, user_id, last_login_date;
$$;


ALTER FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login_date" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login" timestamp with time zone) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE profiles
  SET last_login_date = p_last_login
  WHERE id = p_user_id;
END;
$$;


ALTER FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_streak"("user_uuid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
  DECLARE
      last_date DATE;
      computed_streak INTEGER := 0;
      current_streak INTEGER := 0;
  BEGIN
      SELECT last_activity_date, COALESCE(streak_days,0) INTO last_date, current_streak
      FROM profiles WHERE user_id = user_uuid FOR UPDATE;

      IF last_date = CURRENT_DATE THEN
          -- Same day, no streak change
          RETURN;
      ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
          -- Consecutive day, computed streak increments
          computed_streak := current_streak + 1;
      ELSE
          -- Gap in days, computed streak is 1 (but we won't decrease existing)
          computed_streak := 1;
      END IF;

      -- Use GREATEST to avoid decreasing stored streak
      UPDATE profiles SET streak_days = GREATEST(COALESCE(streak_days,0), computed_streak)
      WHERE user_id = user_uuid;

      -- Check Week Warrior (7 day streak) without decreasing
      IF GREATEST(current_streak, computed_streak) >= 7 THEN
          UPDATE profiles SET is_week_warrior = TRUE
          WHERE user_id = user_uuid;
      END IF;
  END;
  $$;


ALTER FUNCTION "public"."update_streak"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_subscription_status_manually"("p_subscription_id" "uuid", "p_status" "text", "p_subscription_type" "text", "p_duration_type" "text" DEFAULT 'monthly'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  subscription_record RECORD;
  new_end_date TIMESTAMP WITH TIME ZONE;
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only verified admins can manually update subscription status';
  END IF;
  
  -- Get the subscription
  SELECT * INTO subscription_record
  FROM pro_subscriptions
  WHERE id = p_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;
  
  -- Calculate end date based on duration type
  IF p_status = 'active' AND p_subscription_type != 'trial' THEN
    CASE p_duration_type
      WHEN 'daily' THEN new_end_date := now() + INTERVAL '1 day';
      WHEN 'weekly' THEN new_end_date := now() + INTERVAL '1 week';
      WHEN 'monthly' THEN new_end_date := now() + INTERVAL '1 month';
      WHEN 'yearly' THEN new_end_date := now() + INTERVAL '1 year';
      ELSE new_end_date := now() + INTERVAL '1 month'; -- Default to monthly
    END CASE;
  END IF;
  
  -- Update the subscription
  UPDATE pro_subscriptions
  SET 
    status = p_status,
    subscription_type = p_subscription_type,
    subscription_start_date = CASE 
      WHEN p_status = 'active' AND p_subscription_type != 'trial' THEN now()
      ELSE subscription_start_date
    END,
    subscription_end_date = CASE 
      WHEN p_status = 'active' AND p_subscription_type != 'trial' THEN new_end_date
      ELSE subscription_end_date
    END,
    updated_at = now()
  WHERE id = p_subscription_id;
  
  -- Sync pro status for the user
  PERFORM sync_pro_status_from_subscription(subscription_record.user_id);
  
  -- Log the manual update
  PERFORM log_sensitive_action(
    'manual_subscription_update',
    'pro_subscriptions',
    p_subscription_id,
    jsonb_build_object(
      'admin_user', auth.uid(),
      'target_user', subscription_record.user_id,
      'old_status', subscription_record.status,
      'new_status', p_status,
      'old_type', subscription_record.subscription_type,
      'new_type', p_subscription_type,
      'duration_type', p_duration_type,
      'new_end_date', new_end_date
    )
  );
  
  result := jsonb_build_object(
    'success', true,
    'subscription_id', p_subscription_id,
    'status', p_status,
    'subscription_type', p_subscription_type,
    'end_date', new_end_date,
    'message', 'Subscription updated successfully'
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."update_subscription_status_manually"("p_subscription_id" "uuid", "p_status" "text", "p_subscription_type" "text", "p_duration_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_total_journal_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Recalculate total_journal exactly like sync_elite_habit_count does for total_elite_habit
  UPDATE public.profiles p
  SET total_journal = (
    SELECT COUNT(*) FROM public.reflections r WHERE r.user_id = COALESCE(NEW.user_id, OLD.user_id)
  ),
      updated_at = now()
  WHERE p.user_id = COALESCE(NEW.user_id, OLD.user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;


ALTER FUNCTION "public"."update_total_journal_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_total_journal_count_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = OLD.user_id  -- Direct UUID comparison, no casting needed
    )
    WHERE user_id = OLD.user_id;  -- Direct UUID comparison

    RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."update_total_journal_count_delete"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_online_status"("p_user_id" "uuid", "p_email" "text" DEFAULT NULL::"text", "p_display_name" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.online_users (user_id, email, display_name, last_seen)
    VALUES (
        p_user_id,
        COALESCE(p_email, (SELECT email FROM auth.users WHERE id = p_user_id)),
        COALESCE(p_display_name, (SELECT display_name FROM public.profiles WHERE user_id = p_user_id)),
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        last_seen = NOW(),
        email = COALESCE(EXCLUDED.email, online_users.email),
        display_name = COALESCE(EXCLUDED.display_name, online_users.display_name);
END;
$$;


ALTER FUNCTION "public"."update_user_online_status"("p_user_id" "uuid", "p_email" "text", "p_display_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_streak"("user_id_param" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  consecutive_days INTEGER := 0;
  check_date DATE;
  has_activity BOOLEAN;
  existing_streak INTEGER := 0;
BEGIN
  SELECT COALESCE(streak_days,0) INTO existing_streak FROM profiles WHERE user_id = user_id_param FOR UPDATE;

  -- Check last 7 days for consecutive activity
  FOR i IN 0..6 LOOP
    check_date := CURRENT_DATE - INTERVAL '1 day' * i;
    
    -- Check if user had any XP activity on this date
    SELECT EXISTS (
      SELECT 1 FROM xp_transactions 
      WHERE user_id = user_id_param 
      AND DATE(created_at) = check_date
    ) INTO has_activity;
    
    IF has_activity THEN
      consecutive_days := consecutive_days + 1;
    ELSE
      EXIT; -- Break streak
    END IF;
  END LOOP;
  
  -- Update streak in profile, but never decrease
  UPDATE profiles 
  SET streak_days = GREATEST(COALESCE(streak_days,0), consecutive_days)
  WHERE user_id = user_id_param;
  
END;
$$;


ALTER FUNCTION "public"."update_user_streak"("user_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_admin_role_operation"("p_target_user_id" "uuid", "p_role" "text", "p_operation" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  requesting_user_id uuid;
  is_super_admin boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check if requesting user is super admin
  is_super_admin := EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = requesting_user_id 
    AND role = 'super_admin' 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
  
  -- Log the validation attempt
  PERFORM public.log_sensitive_action(
    'admin_role_validation',
    'admin_roles',
    p_target_user_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'target_user', p_target_user_id,
      'requested_role', p_role,
      'operation', p_operation,
      'is_super_admin', is_super_admin,
      'validation_result', is_super_admin
    )
  );
  
  RETURN is_super_admin;
END;
$$;


ALTER FUNCTION "public"."validate_admin_role_operation"("p_target_user_id" "uuid", "p_role" "text", "p_operation" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_journal_entry"("journal_text" "text") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Must be at least 30 characters
    IF LENGTH(TRIM(journal_text)) < 30 THEN
        RETURN FALSE;
    END IF;
    
    -- Cannot be mostly repeated characters
    IF LENGTH(REPLACE(LOWER(journal_text), SUBSTRING(LOWER(journal_text), 1, 1), '')) < LENGTH(journal_text) * 0.5 THEN
        RETURN FALSE;
    END IF;
    
    -- Cannot be mostly numbers or special characters
    IF LENGTH(REGEXP_REPLACE(journal_text, '[^a-zA-Z\s]', '', 'g')) < LENGTH(journal_text) * 0.7 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."validate_journal_entry"("journal_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_payment_access"("p_user_id" "uuid", "p_transaction_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  -- Check if user owns the transaction
  SELECT EXISTS(
    SELECT 1 FROM public.payment_transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
  ) INTO is_owner;
  
  -- Log access attempt
  PERFORM public.log_data_access(
    'payment_transactions',
    'access_validation',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', p_user_id,
      'access_granted', is_owner
    )
  );
  
  RETURN is_owner;
END;
$$;


ALTER FUNCTION "public"."validate_payment_access"("p_user_id" "uuid", "p_transaction_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_payment_transaction_access"("p_transaction_id" "uuid", "p_access_type" "text" DEFAULT 'read'::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  requesting_user_id uuid;
  transaction_owner uuid;
  is_admin boolean;
  access_granted boolean;
BEGIN
  requesting_user_id := auth.uid();
  
  -- Check authentication
  IF requesting_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get transaction owner
  SELECT user_id INTO transaction_owner
  FROM public.payment_transactions
  WHERE id = p_transaction_id;
  
  -- Transaction must exist
  IF transaction_owner IS NULL THEN
    PERFORM public.log_sensitive_action(
      'payment_access_invalid_transaction',
      'payment_transactions',
      p_transaction_id,
      jsonb_build_object(
        'requesting_user', requesting_user_id,
        'access_type', p_access_type,
        'result', 'transaction_not_found'
      )
    );
    RETURN false;
  END IF;
  
  -- Check if user is verified admin
  is_admin := public.is_verified_admin(requesting_user_id);
  
  -- Determine access
  access_granted := (requesting_user_id = transaction_owner) OR is_admin;
  
  -- Log access attempt
  PERFORM public.log_sensitive_action(
    'payment_transaction_access_validation',
    'payment_transactions',
    p_transaction_id,
    jsonb_build_object(
      'requesting_user', requesting_user_id,
      'transaction_owner', transaction_owner,
      'is_admin', is_admin,
      'access_type', p_access_type,
      'access_granted', access_granted
    )
  );
  
  RETURN access_granted;
END;
$$;


ALTER FUNCTION "public"."validate_payment_transaction_access"("p_transaction_id" "uuid", "p_access_type" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_admin_with_failsafe"("p_user_id" "uuid", "p_required_role" "text" DEFAULT 'admin'::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  admin_record RECORD;
  verification_result jsonb;
  current_time timestamptz := now();
BEGIN
  -- Initialize result
  verification_result := jsonb_build_object(
    'is_admin', false,
    'role', null,
    'expires_at', null,
    'verification_time', current_time,
    'security_checks', jsonb_build_array()
  );
  
  -- Security check 1: User must be authenticated
  IF p_user_id IS NULL THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'authentication', 'passed', false, 'reason', 'user_not_authenticated')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 2: Fetch admin role with comprehensive validation
  SELECT * INTO admin_record
  FROM public.admin_roles
  WHERE user_id = p_user_id
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > current_time);
  
  -- Security check 3: Role exists and is valid
  IF NOT FOUND THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'role_exists', 'passed', false, 'reason', 'no_active_admin_role')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 4: Role hierarchy validation
  IF p_required_role = 'super_admin' AND admin_record.role != 'super_admin' THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'role_hierarchy', 'passed', false, 'reason', 'insufficient_privileges')
    );
    RETURN verification_result;
  END IF;
  
  -- Security check 5: Rate limiting for admin operations
  IF NOT public.check_sensitive_data_rate_limit(p_user_id, 'admin_operations') THEN
    verification_result := verification_result || jsonb_build_object(
      'security_checks', verification_result->'security_checks' || 
      jsonb_build_object('check', 'rate_limit', 'passed', false, 'reason', 'rate_limit_exceeded')
    );
    RETURN verification_result;
  END IF;
  
  -- All checks passed
  verification_result := jsonb_build_object(
    'is_admin', true,
    'role', admin_record.role,
    'expires_at', admin_record.expires_at,
    'verification_time', current_time,
    'security_checks', jsonb_build_array(
      jsonb_build_object('check', 'authentication', 'passed', true),
      jsonb_build_object('check', 'role_exists', 'passed', true),
      jsonb_build_object('check', 'role_hierarchy', 'passed', true),
      jsonb_build_object('check', 'rate_limit', 'passed', true)
    )
  );
  
  -- Log successful verification
  PERFORM public.log_sensitive_action(
    'admin_verification_success',
    'admin_roles',
    admin_record.id,
    verification_result
  );
  
  RETURN verification_result;
END;
$$;


ALTER FUNCTION "public"."verify_admin_with_failsafe"("p_user_id" "uuid", "p_required_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."waiting_payment_upsert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Always try to merge into existing row for this user_id
  UPDATE public.waiting_payment t
  SET
    user_email        = COALESCE(NEW.user_email, t.user_email),
    customer_phone    = COALESCE(NEW.customer_phone, t.customer_phone),
    subscription_type = COALESCE(NEW.subscription_type, t.subscription_type),
    amount_paid       = COALESCE(t.amount_paid,0) + COALESCE(NEW.amount_paid,0), -- accumulate if repeated
    currency          = COALESCE(NEW.currency, t.currency),
    status            = COALESCE(NEW.status, t.status),
    tripay_reference  = COALESCE(NEW.tripay_reference, t.tripay_reference),
    ip_address        = COALESCE(NEW.ip_address, t.ip_address),
    user_name         = COALESCE(NEW.user_name, t.user_name),
    updated_at        = COALESCE(NEW.updated_at, timezone('utc', now()))
  WHERE t.user_id = NEW.user_id;

  IF FOUND THEN
    RETURN NULL; -- merged -> skip insert
  END IF;

  -- No existing row: insert as new
  NEW.created_at := COALESCE(NEW.created_at, timezone('utc', now()));
  NEW.updated_at := COALESCE(NEW.updated_at, timezone('utc', now()));
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."waiting_payment_upsert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."waiting_payment_upsert_tripay_by_username"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- normalize username to avoid case/space mismatches
  NEW.user_name := trim(both from lower(NEW.user_name));

  UPDATE public.waiting_payment wp
     SET tripay_reference = NEW.tripay_reference,
         updated_at = timezone('utc', now())
   WHERE trim(both from lower(wp.user_name)) = NEW.user_name;

  IF FOUND THEN
    RETURN NULL; -- cancel insert, we updated existing row
  END IF;

  RETURN NEW; -- no existing row, proceed with insert
END;
$$;


ALTER FUNCTION "public"."waiting_payment_upsert_tripay_by_username"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."absen_hidup" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "last_checked_in" timestamp with time zone DEFAULT "now"() NOT NULL,
    "contacts" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."absen_hidup" OWNER TO "postgres";


ALTER TABLE "public"."absen_hidup" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."absen_hidup_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "display_name" "text",
    "level" integer DEFAULT 1 NOT NULL,
    "experience_points" integer DEFAULT 0 NOT NULL,
    "streak_days" integer DEFAULT 0 NOT NULL,
    "achievements" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar_url" "text",
    "preferred_language" "text" DEFAULT 'auto'::"text",
    "last_login_date" "date",
    "last_streak_bonus_date" "date",
    "total_verses" integer DEFAULT 0 NOT NULL,
    "total_journal" integer DEFAULT 0,
    "daily_xp_earned" integer DEFAULT 0,
    "app_version" integer DEFAULT 1,
    "user_email" "text",
    "total_elite_habit" integer DEFAULT 0,
    "analytics_used" integer DEFAULT 0,
    "last_analytics_date" "date",
    "is_admin" boolean DEFAULT false,
    "phone_number" "text",
    "is_pro" boolean DEFAULT false,
    "subscription_type" "text",
    "bank_name" "text",
    "account_number" "text",
    "account_holder" "text",
    "shopauto_settings" "jsonb" DEFAULT '{}'::"jsonb"
);

ALTER TABLE ONLY "public"."profiles" REPLICA IDENTITY FULL;


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profiles"."analytics_used" IS 'Number of analytics reports used in current month (max 1 for free users)';



COMMENT ON COLUMN "public"."profiles"."last_analytics_date" IS 'Date when user last generated an analytics report';



COMMENT ON COLUMN "public"."profiles"."shopauto_settings" IS 'Configuration for ShopAuto AI automation features';



CREATE TABLE IF NOT EXISTS "public"."withdrawals" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "bank_snapshot" "jsonb",
    "proof_image" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "affiliate_email" "text"
);


ALTER TABLE "public"."withdrawals" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."admin_payout_queue" WITH ("security_invoker"='true') AS
 SELECT "w"."id",
    "p"."display_name",
    "w"."affiliate_email" AS "email",
    "w"."amount",
    "w"."status",
    "w"."bank_snapshot",
    "w"."created_at"
   FROM ("public"."withdrawals" "w"
     LEFT JOIN "public"."profiles" "p" ON (("w"."user_id" = "p"."user_id")))
  WHERE ("w"."status" = 'pending'::"text")
  ORDER BY "w"."created_at";


ALTER VIEW "public"."admin_payout_queue" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "granted_by" "uuid" NOT NULL,
    "granted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true NOT NULL,
    "user_email" "text"
);


ALTER TABLE "public"."admin_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "user_id" "uuid",
    "event_type" "text" NOT NULL,
    "path" "text" NOT NULL,
    "content_id" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audio_tracks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "file_path" "text" NOT NULL,
    "file_url" "text",
    "duration" integer,
    "category" "text" DEFAULT 'verse'::"text",
    "created_by" "uuid",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "language" "text" DEFAULT 'id'::"text"
);


ALTER TABLE "public"."audio_tracks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."auth_request_logs" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "request_type" "text",
    "user_agent" "text",
    "ip_address" "inet",
    "component_name" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."auth_request_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."auth_request_logs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."auth_request_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."auth_request_logs_id_seq" OWNED BY "public"."auth_request_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_name" "text" NOT NULL,
    "user_level" integer DEFAULT 1 NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "channel_id" "text" DEFAULT 'community'::"text",
    "subscription_type" "text",
    "is_pro" boolean DEFAULT false,
    "streak_days" integer DEFAULT 0,
    "avatar_url" "text"
);

ALTER TABLE ONLY "public"."chat_messages" REPLICA IDENTITY FULL;


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."commissions" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "affiliate_user_id" "uuid" NOT NULL,
    "user_email" "text" NOT NULL,
    "product_name" "text" NOT NULL,
    "sale_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sale_amount" numeric NOT NULL,
    "commission_percentage" numeric NOT NULL,
    "commission_amount" numeric NOT NULL,
    "transaction_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "affiliate_email" "text"
);


ALTER TABLE "public"."commissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_classification" (
    "table_name" "text" NOT NULL,
    "classification" "text" NOT NULL,
    "pii_fields" "text"[],
    "retention_days" integer,
    "audit_required" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."data_classification" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."debug_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "function_name" "text",
    "error_code" "text",
    "error_message" "text",
    "parameters" "jsonb",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."debug_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."device_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token" "text" NOT NULL,
    "platform" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "device_tokens_platform_check" CHECK (("platform" = ANY (ARRAY['ios'::"text", 'android'::"text", 'web'::"text"])))
);


ALTER TABLE "public"."device_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."elite_habits" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "exercise_type" "text" NOT NULL,
    "duration_minutes" integer NOT NULL,
    "date" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_email" "text",
    "notes" "text"
);


ALTER TABLE "public"."elite_habits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_logs" (
    "id" integer NOT NULL,
    "from_email" character varying(255),
    "subject" "text",
    "original_content" "text",
    "ai_response" "text",
    "status" character varying(50),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "knowledge_base_id" "uuid"
);


ALTER TABLE "public"."email_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."email_logs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."email_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."email_logs_id_seq" OWNED BY "public"."email_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."general_action" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "display_name" "text",
    "user_email" "text",
    "action" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."general_action" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."global_member" (
    "user_id" "uuid" NOT NULL,
    "user_email" "text",
    "status" "public"."subscription_status" DEFAULT 'pending_payment'::"public"."subscription_status" NOT NULL,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone
);


ALTER TABLE "public"."global_member" OWNER TO "postgres";


COMMENT ON TABLE "public"."global_member" IS 'Manages ecosystem-wide memberships. An active status may grant product discounts.';



COMMENT ON COLUMN "public"."global_member"."user_id" IS 'Primary key, foreign key to the user in auth.users.';



COMMENT ON COLUMN "public"."global_member"."user_email" IS 'The email of the user at the time of membership creation/update.';



COMMENT ON COLUMN "public"."global_member"."status" IS 'Current status of the membership (e.g., active, expired).';



COMMENT ON COLUMN "public"."global_member"."end_date" IS 'The timestamp when the membership expires.';



CREATE TABLE IF NOT EXISTS "public"."global_product" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "phone" "text",
    "email" "text",
    "tripay_reference" "text",
    "merchant_ref" "text",
    "product_name" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "amount" integer,
    "address" "text",
    "user_id" "uuid",
    "affiliate_id" "uuid",
    "affiliate_email" "text",
    "fbc" "text",
    "fbp" "text",
    "ip_address" "text",
    "user_agent" "text",
    "capi_purchase_sent" boolean DEFAULT false,
    "commission_rate" numeric DEFAULT 0.30
);


ALTER TABLE "public"."global_product" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."global_product_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."global_product_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."global_product_id_seq" OWNED BY "public"."global_product"."id";



CREATE TABLE IF NOT EXISTS "public"."gold_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "message_id" "uuid" NOT NULL,
    "reported_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "message_content" "text"
);

ALTER TABLE ONLY "public"."gold_reports" REPLICA IDENTITY FULL;


ALTER TABLE "public"."gold_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "chat_notifications_enabled" boolean DEFAULT true NOT NULL,
    "quiet_hours_start" time without time zone,
    "quiet_hours_end" time without time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notification_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" DEFAULT 'info'::"text",
    "read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "notification_type" character varying(100)
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."page_visits" (
    "id" bigint NOT NULL,
    "path" "text" NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "user_id" "uuid",
    "ip_address" "inet"
);


ALTER TABLE "public"."page_visits" OWNER TO "postgres";


ALTER TABLE "public"."page_visits" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."page_visits_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."photo_credit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "credit_type" "text",
    "status" "text",
    "tripay_reference" "text",
    "user_name" "text",
    "user_email" "text",
    "phone_number" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "credit" integer,
    "amount" integer
);


ALTER TABLE "public"."photo_credit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pixel_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "pixel_id" "text",
    "event_name" "text",
    "event_id" "text",
    "user_data" "jsonb",
    "custom_data" "jsonb",
    "page_url" "text",
    "status" "text",
    "meta_response" "jsonb",
    "client_ip" "text",
    "user_agent" "text",
    "product_name" "text",
    "external_id" "text"
);


ALTER TABLE "public"."pixel_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pro_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "ip_address" "text",
    "subscription_type" "text" DEFAULT 'trial'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "subscription_start_date" timestamp with time zone,
    "subscription_end_date" timestamp with time zone,
    "amount_paid" numeric(10,2),
    "currency" "text" DEFAULT 'IDR'::"text",
    "tripay_reference" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_email" "text",
    "customer_phone" "text",
    "verse_access" boolean DEFAULT true,
    "pro_badge" boolean DEFAULT true,
    "days_remaining" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "vip_subscriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'expired'::"text", 'cancelled'::"text", 'pending'::"text"])))
);


ALTER TABLE "public"."pro_subscriptions" OWNER TO "postgres";


COMMENT ON TABLE "public"."pro_subscriptions" IS 'Stores ONLY confirmed paid subscriptions - users get pro access immediately';



CREATE TABLE IF NOT EXISTS "public"."rate_limit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "ip_address" "text",
    "action" "text" NOT NULL,
    "attempts" integer DEFAULT 1,
    "window_start" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."rate_limit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reflections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_email" "text" NOT NULL,
    "reflection" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reflections" OWNER TO "postgres";


COMMENT ON TABLE "public"."reflections" IS 'Spiritual reflections table with RLS enabled for user data security';



CREATE TABLE IF NOT EXISTS "public"."security_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "table_name" "text",
    "record_id" "uuid",
    "ip_address" "text",
    "user_agent" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."security_audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" integer NOT NULL,
    "currency" "text" DEFAULT 'IDR'::"text",
    "duration_days" integer NOT NULL,
    "payment_method_code" "text" DEFAULT 'BCAVA'::"text",
    "payment_method" "text" DEFAULT 'BCA Virtual Account'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."survey3000" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question1" "text" NOT NULL,
    "question2" "text" NOT NULL,
    "question3" "text" NOT NULL,
    "instagram" "text",
    "whatsapp" "text" NOT NULL,
    "email" "text",
    "name" "text" NOT NULL,
    "urgency_level" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."survey3000" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."update_banner_clicks" (
    "user_id" "uuid" NOT NULL,
    "banner_version" "text" NOT NULL,
    "clicked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."update_banner_clicks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_activities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "activity_type" "text" NOT NULL,
    "xp_earned" integer DEFAULT 0 NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."user_activities" REPLICA IDENTITY FULL;


ALTER TABLE "public"."user_activities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_contact_info" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email_encrypted" "text" NOT NULL,
    "email_hash" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_contact_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_webinar" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "phone_number" "text",
    "order_id" "text",
    "paid_at" timestamp with time zone DEFAULT "now"(),
    "ends_at" timestamp with time zone DEFAULT ("now"() + '30 days'::interval),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'Active'::"text",
    "origin" "text"
);


ALTER TABLE "public"."user_webinar" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_webinar" IS 'Table for all webinar participants (USA and Indonesia)';



COMMENT ON COLUMN "public"."user_webinar"."status" IS 'Automatically managed by tr_sync_usa_webinar_status trigger';



COMMENT ON COLUMN "public"."user_webinar"."origin" IS 'Indicates the source product: USA or Indonesia';



CREATE TABLE IF NOT EXISTS "public"."verse_notif" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "display_name" "text" NOT NULL,
    "verse_title" "text" NOT NULL,
    "verse_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."verse_notif" REPLICA IDENTITY FULL;


ALTER TABLE "public"."verse_notif" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waiting_payment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "user_email" "text" NOT NULL,
    "customer_phone" "text",
    "subscription_type" "text",
    "amount_paid" integer,
    "currency" "text" DEFAULT 'IDR'::"text",
    "status" "text" DEFAULT 'pending'::"text",
    "tripay_reference" "text",
    "ip_address" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "user_name" "text",
    "affiliate_id" "uuid",
    "affiliate_email" "text",
    "user_agent" "text",
    "commission_rate" numeric DEFAULT 0.30
);


ALTER TABLE "public"."waiting_payment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."xp_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "xp_amount" integer NOT NULL,
    "transaction_type" "text" NOT NULL,
    "reason" "text",
    "activity_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."xp_transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."auth_request_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."auth_request_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."email_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."email_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."global_product" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."global_product_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."absen_hidup"
    ADD CONSTRAINT "absen_hidup_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."absen_hidup"
    ADD CONSTRAINT "absen_hidup_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_roles"
    ADD CONSTRAINT "admin_roles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audio_tracks"
    ADD CONSTRAINT "audio_tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."auth_request_logs"
    ADD CONSTRAINT "auth_request_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."commissions"
    ADD CONSTRAINT "commissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."data_classification"
    ADD CONSTRAINT "data_classification_pkey" PRIMARY KEY ("table_name");



ALTER TABLE ONLY "public"."debug_logs"
    ADD CONSTRAINT "debug_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."device_tokens"
    ADD CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."device_tokens"
    ADD CONSTRAINT "device_tokens_user_id_token_key" UNIQUE ("user_id", "token");



ALTER TABLE ONLY "public"."elite_habits"
    ADD CONSTRAINT "elite_habits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_logs"
    ADD CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."general_action"
    ADD CONSTRAINT "general_action_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."global_member"
    ADD CONSTRAINT "global_member_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."global_product"
    ADD CONSTRAINT "global_product_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gold_reports"
    ADD CONSTRAINT "gold_reports_message_id_key" UNIQUE ("message_id");



ALTER TABLE ONLY "public"."gold_reports"
    ADD CONSTRAINT "gold_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."page_visits"
    ADD CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."photo_credit"
    ADD CONSTRAINT "photo_credit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."photo_credit"
    ADD CONSTRAINT "photo_credit_tripay_reference_key" UNIQUE ("tripay_reference");



ALTER TABLE ONLY "public"."photo_credit"
    ADD CONSTRAINT "photo_credit_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."pixel_events"
    ADD CONSTRAINT "pixel_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."rate_limit_log"
    ADD CONSTRAINT "rate_limit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reflections"
    ADD CONSTRAINT "reflections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_audit_log"
    ADD CONSTRAINT "security_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."survey3000"
    ADD CONSTRAINT "survey3000_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pro_subscriptions"
    ADD CONSTRAINT "unique_active_subscription_per_user" UNIQUE ("user_id", "status") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "public"."update_banner_clicks"
    ADD CONSTRAINT "update_banner_clicks_pk" PRIMARY KEY ("user_id", "banner_version");



ALTER TABLE ONLY "public"."user_webinar"
    ADD CONSTRAINT "usa_webinar_order_id_key" UNIQUE ("order_id");



ALTER TABLE ONLY "public"."user_webinar"
    ADD CONSTRAINT "usa_webinar_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activities"
    ADD CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_contact_info"
    ADD CONSTRAINT "user_contact_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_contact_info"
    ADD CONSTRAINT "user_contact_info_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."verse_notif"
    ADD CONSTRAINT "verse_notif_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pro_subscriptions"
    ADD CONSTRAINT "vip_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pro_subscriptions"
    ADD CONSTRAINT "vip_subscriptions_tripay_reference_key" UNIQUE ("tripay_reference");



ALTER TABLE ONLY "public"."waiting_payment"
    ADD CONSTRAINT "waiting_payment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."withdrawals"
    ADD CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."xp_transactions"
    ADD CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id");



CREATE INDEX "elite_habits_created_at_idx" ON "public"."elite_habits" USING "btree" ("created_at");



CREATE INDEX "elite_habits_date_idx" ON "public"."elite_habits" USING "btree" ("date");



CREATE INDEX "elite_habits_user_email_idx" ON "public"."elite_habits" USING "btree" ("user_email") WHERE ("user_email" IS NOT NULL);



CREATE INDEX "elite_habits_user_id_idx" ON "public"."elite_habits" USING "btree" ("user_id");



CREATE INDEX "idx_analytics_content_id" ON "public"."analytics_events" USING "btree" ("content_id");



CREATE INDEX "idx_analytics_created_at" ON "public"."analytics_events" USING "btree" ("created_at");



CREATE INDEX "idx_analytics_event_type" ON "public"."analytics_events" USING "btree" ("event_type");



CREATE INDEX "idx_analytics_path" ON "public"."analytics_events" USING "btree" ("path");



CREATE INDEX "idx_analytics_session_id" ON "public"."analytics_events" USING "btree" ("session_id");



CREATE INDEX "idx_audio_tracks_category_language" ON "public"."audio_tracks" USING "btree" ("category", "language");



CREATE INDEX "idx_audio_tracks_language" ON "public"."audio_tracks" USING "btree" ("language");



CREATE INDEX "idx_chat_messages_channel_id" ON "public"."chat_messages" USING "btree" ("channel_id");



CREATE INDEX "idx_chat_messages_created_at" ON "public"."chat_messages" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_chat_messages_user_created" ON "public"."chat_messages" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_chat_messages_user_id" ON "public"."chat_messages" USING "btree" ("user_id");



CREATE INDEX "idx_email_logs_knowledge_base_id" ON "public"."email_logs" USING "btree" ("knowledge_base_id");



CREATE INDEX "idx_general_action_created_at" ON "public"."general_action" USING "btree" ("created_at");



CREATE INDEX "idx_general_action_user_id" ON "public"."general_action" USING "btree" ("user_id");



CREATE INDEX "idx_global_product_address" ON "public"."global_product" USING "btree" ("address");



CREATE INDEX "idx_gold_reports_created_at" ON "public"."gold_reports" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_gold_reports_message_id" ON "public"."gold_reports" USING "btree" ("message_id");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("user_id", "notification_type") WHERE ("notification_type" IS NOT NULL);



CREATE INDEX "idx_photo_credit_tripay_reference" ON "public"."photo_credit" USING "btree" ("tripay_reference");



CREATE UNIQUE INDEX "idx_pixel_events_unique_event" ON "public"."pixel_events" USING "btree" ("event_id", "pixel_id") WHERE ("event_id" IS NOT NULL);



CREATE INDEX "idx_pro_subscriptions_email" ON "public"."pro_subscriptions" USING "btree" ("user_email");



CREATE INDEX "idx_pro_subscriptions_user_id" ON "public"."pro_subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_is_pro" ON "public"."profiles" USING "btree" ("is_pro");



CREATE INDEX "idx_profiles_level" ON "public"."profiles" USING "btree" ("level");



CREATE INDEX "idx_profiles_shopauto_shop_id" ON "public"."profiles" USING "btree" ((("shopauto_settings" ->> 'shopeShopId'::"text")));



CREATE INDEX "idx_profiles_streak_days" ON "public"."profiles" USING "btree" ("streak_days");



CREATE INDEX "idx_profiles_total_journal" ON "public"."profiles" USING "btree" ("total_journal");



CREATE INDEX "idx_profiles_total_verses" ON "public"."profiles" USING "btree" ("total_verses");



CREATE INDEX "idx_profiles_updated_at" ON "public"."profiles" USING "btree" ("updated_at");



CREATE INDEX "idx_profiles_user_email" ON "public"."profiles" USING "btree" ("user_email");



CREATE INDEX "idx_profiles_user_id" ON "public"."profiles" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_user_id_fast" ON "public"."profiles" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_user_id_updated_at" ON "public"."profiles" USING "btree" ("user_id", "updated_at");



CREATE INDEX "idx_reflections_created_at" ON "public"."reflections" USING "btree" ("created_at");



CREATE INDEX "idx_reflections_user_email" ON "public"."reflections" USING "btree" ("user_email");



CREATE INDEX "idx_reflections_user_id" ON "public"."reflections" USING "btree" ("user_id");



CREATE INDEX "idx_user_webinar_email" ON "public"."user_webinar" USING "btree" ("email");



CREATE INDEX "idx_verse_notif_created_at" ON "public"."verse_notif" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_verse_notif_user_id" ON "public"."verse_notif" USING "btree" ("user_id");



CREATE INDEX "idx_waiting_payment_status" ON "public"."waiting_payment" USING "btree" ("status");



CREATE INDEX "idx_waiting_payment_tripay_reference" ON "public"."waiting_payment" USING "btree" ("tripay_reference");



CREATE INDEX "idx_waiting_payment_user_id" ON "public"."waiting_payment" USING "btree" ("user_id");



CREATE INDEX "update_banner_clicks_version_idx" ON "public"."update_banner_clicks" USING "btree" ("banner_version");



CREATE OR REPLACE TRIGGER "audit_chat_messages_trigger" AFTER INSERT ON "public"."chat_messages" FOR EACH ROW EXECUTE FUNCTION "public"."audit_chat_access"();



CREATE OR REPLACE TRIGGER "audit_pro_changes_trigger" AFTER INSERT OR UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."audit_pro_changes"();



CREATE OR REPLACE TRIGGER "audit_vip_subscription_changes" AFTER INSERT OR UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."audit_vip_changes"();



CREATE OR REPLACE TRIGGER "auto_activate_subscription_trigger" BEFORE INSERT OR UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."auto_activate_subscription"();



CREATE OR REPLACE TRIGGER "auto_cleanup_pro_trigger" BEFORE UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."auto_cleanup_pro_on_update"();



CREATE OR REPLACE TRIGGER "auto_populate_elite_habit_email_trigger" BEFORE INSERT ON "public"."elite_habits" FOR EACH ROW EXECUTE FUNCTION "public"."auto_populate_elite_habit_email"();



CREATE OR REPLACE TRIGGER "enhanced_admin_role_access_monitor" AFTER INSERT OR DELETE OR UPDATE ON "public"."admin_roles" FOR EACH ROW EXECUTE FUNCTION "public"."enhanced_admin_role_access_log"();



CREATE OR REPLACE TRIGGER "enhanced_admin_role_audit_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."admin_roles" FOR EACH ROW EXECUTE FUNCTION "public"."enhanced_admin_role_audit"();



CREATE OR REPLACE TRIGGER "handle_elite_habits_updated_at" BEFORE UPDATE ON "public"."elite_habits" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "monitor_device_tokens_access" AFTER INSERT OR DELETE OR UPDATE ON "public"."device_tokens" FOR EACH ROW EXECUTE FUNCTION "public"."monitor_sensitive_data_access"();



CREATE OR REPLACE TRIGGER "monitor_user_contact_info_access" AFTER INSERT OR DELETE OR UPDATE ON "public"."user_contact_info" FOR EACH ROW EXECUTE FUNCTION "public"."monitor_sensitive_data_access"();



CREATE OR REPLACE TRIGGER "on_insert_populate_affiliate_email_global" BEFORE INSERT ON "public"."global_product" FOR EACH ROW EXECUTE FUNCTION "public"."populate_affiliate_email"();



CREATE OR REPLACE TRIGGER "on_insert_populate_affiliate_email_waiting" BEFORE INSERT ON "public"."waiting_payment" FOR EACH ROW EXECUTE FUNCTION "public"."populate_affiliate_email"();



CREATE OR REPLACE TRIGGER "on_payment_success_commission_global" AFTER UPDATE ON "public"."global_product" FOR EACH ROW EXECUTE FUNCTION "public"."handle_successful_payment_commission"();



CREATE OR REPLACE TRIGGER "on_payment_success_commission_waiting" AFTER UPDATE ON "public"."waiting_payment" FOR EACH ROW EXECUTE FUNCTION "public"."handle_successful_waiting_payment_commission"();



CREATE OR REPLACE TRIGGER "photo_credit_changes" AFTER UPDATE ON "public"."photo_credit" FOR EACH ROW EXECUTE FUNCTION "public"."photo_credit_broadcast_trigger"();



CREATE OR REPLACE TRIGGER "pro_subscription_change_trigger" AFTER INSERT OR UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."broadcast_pro_subscription_change"();



CREATE OR REPLACE TRIGGER "profiles_set_level_trg" BEFORE INSERT OR UPDATE OF "experience_points" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_profile_level_from_xp"();



CREATE OR REPLACE TRIGGER "reflections_counter_delete" AFTER DELETE ON "public"."reflections" FOR EACH ROW EXECUTE FUNCTION "public"."reflections_counter_sync"();



CREATE OR REPLACE TRIGGER "reflections_counter_insert" AFTER INSERT ON "public"."reflections" FOR EACH ROW EXECUTE FUNCTION "public"."reflections_counter_sync"();



CREATE OR REPLACE TRIGGER "reflections_counter_update" AFTER UPDATE OF "user_id" ON "public"."reflections" FOR EACH ROW WHEN (("old"."user_id" IS DISTINCT FROM "new"."user_id")) EXECUTE FUNCTION "public"."reflections_counter_sync"();



CREATE OR REPLACE TRIGGER "sync_elite_habit_count_delete" AFTER DELETE ON "public"."elite_habits" FOR EACH ROW EXECUTE FUNCTION "public"."sync_elite_habit_count"();



CREATE OR REPLACE TRIGGER "sync_elite_habit_count_insert" AFTER INSERT ON "public"."elite_habits" FOR EACH ROW EXECUTE FUNCTION "public"."sync_elite_habit_count"();



CREATE OR REPLACE TRIGGER "sync_elite_habit_count_update" AFTER UPDATE ON "public"."elite_habits" FOR EACH ROW EXECUTE FUNCTION "public"."sync_elite_habit_count"();



CREATE OR REPLACE TRIGGER "tr_sync_user_webinar_status" BEFORE INSERT OR UPDATE ON "public"."user_webinar" FOR EACH ROW EXECUTE FUNCTION "public"."sync_user_webinar_status"();



CREATE OR REPLACE TRIGGER "trg_general_action_sync_display_name" BEFORE INSERT OR UPDATE OF "user_id", "display_name" ON "public"."general_action" FOR EACH ROW EXECUTE FUNCTION "public"."general_action_sync_display_name"();



CREATE OR REPLACE TRIGGER "trg_photo_credit_replace" BEFORE INSERT ON "public"."photo_credit" FOR EACH ROW EXECUTE FUNCTION "public"."photo_credit_replace_on_reference"();



CREATE OR REPLACE TRIGGER "trg_photo_credit_upsert" BEFORE INSERT ON "public"."photo_credit" FOR EACH ROW EXECUTE FUNCTION "public"."photo_credit_upsert"();



CREATE OR REPLACE TRIGGER "trg_reject_mock_yahoo_general_action" BEFORE INSERT OR UPDATE ON "public"."general_action" FOR EACH ROW EXECUTE FUNCTION "public"."function_reject_mock"();



CREATE OR REPLACE TRIGGER "trg_set_user_id_pro_subscriptions" BEFORE INSERT OR UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."set_user_id_from_email"();



CREATE OR REPLACE TRIGGER "trg_update_profile_on_activity" AFTER INSERT ON "public"."user_activities" FOR EACH ROW EXECUTE FUNCTION "public"."fn_update_profile_on_activity"();



CREATE OR REPLACE TRIGGER "trg_xp_transactions_after_insert" AFTER INSERT ON "public"."xp_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."handle_xp_transaction_trigger"();



CREATE OR REPLACE TRIGGER "trigger_sync_display_name" BEFORE INSERT ON "public"."verse_notif" FOR EACH ROW EXECUTE FUNCTION "public"."sync_verse_notif_display_name"();



CREATE OR REPLACE TRIGGER "update_audio_tracks_updated_at" BEFORE UPDATE ON "public"."audio_tracks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_device_tokens_updated_at" BEFORE UPDATE ON "public"."device_tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notification_settings_updated_at" BEFORE UPDATE ON "public"."notification_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_vip_subscriptions_updated_at" BEFORE UPDATE ON "public"."pro_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."absen_hidup"
    ADD CONSTRAINT "absen_hidup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."analytics_events"
    ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."audio_tracks"
    ADD CONSTRAINT "audio_tracks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."commissions"
    ADD CONSTRAINT "commissions_affiliate_user_id_fkey" FOREIGN KEY ("affiliate_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."device_tokens"
    ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."elite_habits"
    ADD CONSTRAINT "elite_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."global_member"
    ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."global_product"
    ADD CONSTRAINT "global_product_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."gold_reports"
    ADD CONSTRAINT "gold_reports_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gold_reports"
    ADD CONSTRAINT "gold_reports_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notification_settings"
    ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."page_visits"
    ADD CONSTRAINT "page_visits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."update_banner_clicks"
    ADD CONSTRAINT "update_banner_clicks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pro_subscriptions"
    ADD CONSTRAINT "vip_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waiting_payment"
    ADD CONSTRAINT "waiting_payment_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."withdrawals"
    ADD CONSTRAINT "withdrawals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Admin can manage all subscriptions" ON "public"."pro_subscriptions" TO "service_role" WITH CHECK (true);



CREATE POLICY "Admins can view all withdrawals" ON "public"."withdrawals" FOR SELECT TO "authenticated" USING ("public"."is_verified_admin"("auth"."uid"()));



CREATE POLICY "Admins can view audit logs" ON "public"."security_audit_log" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."achievements"))))));



CREATE POLICY "Affiliates cannot directly insert commissions from client-side." ON "public"."commissions" FOR INSERT TO "authenticated" WITH CHECK (false);



CREATE POLICY "Allow authenticated users to select their own photo_credit" ON "public"."photo_credit" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Allow individual read access" ON "public"."global_member" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow insert own clicks" ON "public"."update_banner_clicks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow public insert to analytics_events" ON "public"."analytics_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public inserts" ON "public"."survey3000" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read access" ON "public"."user_webinar" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Allow read access to analytics_events" ON "public"."analytics_events" FOR SELECT USING (true);



CREATE POLICY "Allow read own clicks" ON "public"."update_banner_clicks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow service role full access" ON "public"."user_webinar" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Allow users to manage their own absen_hidup record" ON "public"."absen_hidup" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow users to read their own subscription" ON "public"."pro_subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Allow viewing all verse notifications" ON "public"."verse_notif" FOR SELECT USING (true);



CREATE POLICY "Anon can update withdrawals" ON "public"."withdrawals" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can update withdrawals" ON "public"."withdrawals" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can view active subscription plans" ON "public"."subscription_plans" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view gold reports" ON "public"."gold_reports" FOR SELECT USING (true);



CREATE POLICY "Anyone can view public audio tracks" ON "public"."audio_tracks" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Anyone can view withdrawals" ON "public"."withdrawals" FOR SELECT USING (true);



CREATE POLICY "Auth users can view profiles" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can create audio tracks" ON "public"."audio_tracks" FOR INSERT WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Enable insert for all" ON "public"."pixel_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."email_logs" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."page_visits" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable insert for everyone" ON "public"."global_product" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable public read access for all users" ON "public"."chat_messages" FOR SELECT USING (true);



CREATE POLICY "Enable public select" ON "public"."global_product" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."page_visits" FOR SELECT USING (true);



CREATE POLICY "Enable select for all" ON "public"."pixel_events" FOR SELECT USING (true);



CREATE POLICY "Only admins can delete gold reports" ON "public"."gold_reports" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Only admins can insert gold reports" ON "public"."gold_reports" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Only service role can create subscriptions" ON "public"."pro_subscriptions" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Only verified admins can manage data classification" ON "public"."data_classification" USING ("public"."is_verified_admin"("auth"."uid"()));



CREATE POLICY "Only verified admins can view data classification" ON "public"."data_classification" FOR SELECT USING ("public"."is_verified_admin"("auth"."uid"()));



CREATE POLICY "Secure device token access" ON "public"."device_tokens" FOR SELECT USING ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'device_tokens'::"text")));



CREATE POLICY "Secure device token delete" ON "public"."device_tokens" FOR DELETE USING ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'device_tokens'::"text")));



CREATE POLICY "Secure device token insert" ON "public"."device_tokens" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'device_tokens'::"text")));



CREATE POLICY "Secure device token update" ON "public"."device_tokens" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'device_tokens'::"text")));



CREATE POLICY "Service role can create subscriptions" ON "public"."pro_subscriptions" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Service role can manage debug logs" ON "public"."debug_logs" USING (true);



CREATE POLICY "Super admins can create admin roles" ON "public"."admin_roles" FOR INSERT TO "authenticated" WITH CHECK ((("public"."verify_admin_with_failsafe"("auth"."uid"(), 'super_admin'::"text") ->> 'is_admin'::"text"))::boolean);



CREATE POLICY "Super admins can delete admin roles" ON "public"."admin_roles" FOR DELETE TO "authenticated" USING ((("public"."verify_admin_with_failsafe"("auth"."uid"(), 'super_admin'::"text") ->> 'is_admin'::"text"))::boolean);



CREATE POLICY "Super admins can update admin roles" ON "public"."admin_roles" FOR UPDATE TO "authenticated" USING ((("public"."verify_admin_with_failsafe"("auth"."uid"(), 'super_admin'::"text") ->> 'is_admin'::"text"))::boolean) WITH CHECK ((("public"."verify_admin_with_failsafe"("auth"."uid"(), 'super_admin'::"text") ->> 'is_admin'::"text"))::boolean);



CREATE POLICY "System can insert audit logs" ON "public"."security_audit_log" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can manage rate limits" ON "public"."rate_limit_log" USING ((("auth"."uid"() IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ('admin'::"text" = ANY ("profiles"."achievements")))))));



CREATE POLICY "Ultra secure contact info access" ON "public"."user_contact_info" FOR SELECT USING ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'user_contact_info'::"text")));



CREATE POLICY "Ultra secure contact info insert" ON "public"."user_contact_info" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'user_contact_info'::"text")));



CREATE POLICY "Ultra secure contact info update" ON "public"."user_contact_info" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND "public"."check_sensitive_data_rate_limit"("auth"."uid"(), 'user_contact_info'::"text")));



CREATE POLICY "Users can create their own XP transactions" ON "public"."xp_transactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own activities" ON "public"."user_activities" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own verse notifications" ON "public"."verse_notif" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own elite habits" ON "public"."elite_habits" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own reflections" ON "public"."reflections" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own elite habits" ON "public"."elite_habits" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own reflections" ON "public"."reflections" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own notification settings" ON "public"."notification_settings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own subscription" ON "public"."pro_subscriptions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own profile" ON "public"."profiles" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can only access their own profile" ON "public"."profiles" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can only delete their own subscription" ON "public"."pro_subscriptions" FOR DELETE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can only insert their own subscription" ON "public"."pro_subscriptions" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can only update their own subscription" ON "public"."pro_subscriptions" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can only view their own subscription" ON "public"."pro_subscriptions" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can request withdrawal" ON "public"."withdrawals" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can select own reflections" ON "public"."reflections" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own elite habits" ON "public"."elite_habits" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own reflections" ON "public"."reflections" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own audio tracks" ON "public"."audio_tracks" FOR UPDATE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can update their own notification settings" ON "public"."notification_settings" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own subscription" ON "public"."pro_subscriptions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own elite habits" ON "public"."elite_habits" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own withdrawals" ON "public"."withdrawals" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own XP transactions" ON "public"."xp_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own activities" ON "public"."user_activities" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own audio tracks" ON "public"."audio_tracks" FOR SELECT USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can view their own commissions." ON "public"."commissions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "affiliate_user_id"));



CREATE POLICY "Users can view their own notification settings" ON "public"."notification_settings" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own subscription" ON "public"."pro_subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users read own subscriptions" ON "public"."pro_subscriptions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Verified admins can view all subscriptions" ON "public"."pro_subscriptions" FOR SELECT USING ("public"."is_verified_admin"("auth"."uid"()));



ALTER TABLE "public"."absen_hidup" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow_read_admin_roles" ON "public"."admin_roles" FOR SELECT USING (true);



ALTER TABLE "public"."analytics_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audio_tracks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."auth_request_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "chat_delete" ON "public"."chat_messages" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "user_id") OR ("auth"."uid"() = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'::"uuid")));



CREATE POLICY "chat_insert" ON "public"."chat_messages" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "chat_select" ON "public"."chat_messages" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."commissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_classification" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."debug_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."device_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."elite_habits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "elite_habits_insert" ON "public"."elite_habits" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."email_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."general_action" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."global_member" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."global_product" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gold_reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_own" ON "public"."general_action" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."notification_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."page_visits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."photo_credit" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "photo_credit_insert_own" ON "public"."photo_credit" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."pixel_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pro_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_update" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (((("user_id" IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR (("id" IS NOT NULL) AND ("id" = "auth"."uid"())))) WITH CHECK (((("user_id" IS NOT NULL) AND ("user_id" = "auth"."uid"())) OR (("id" IS NOT NULL) AND ("id" = "auth"."uid"()))));



ALTER TABLE "public"."rate_limit_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reflections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_audit_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_own" ON "public"."general_action" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "simple_read_admin_roles" ON "public"."admin_roles" FOR SELECT USING (true);



ALTER TABLE "public"."subscription_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."survey3000" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."update_banner_clicks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_contact_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_webinar" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."verse_notif" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waiting_payment" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "waiting_payment_delete_own" ON "public"."waiting_payment" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "waiting_payment_insert_own" ON "public"."waiting_payment" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "waiting_payment_select_own" ON "public"."waiting_payment" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "waiting_payment_update_own" ON "public"."waiting_payment" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."withdrawals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."xp_transactions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."global_member";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."global_product";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."gold_reports";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."photo_credit";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."pixel_events";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."pro_subscriptions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."verse_notif";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."activate_pro_subscription"("p_tripay_reference" "text", "p_payment_method" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."activate_pro_subscription"("p_tripay_reference" "text", "p_payment_method" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."activate_pro_subscription"("p_tripay_reference" "text", "p_payment_method" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."add_achievement"("user_id" "uuid", "achievement" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_achievement"("user_id" "uuid", "achievement" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_achievement"("user_id" "uuid", "achievement" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."add_pro_user_by_email"("p_email" "text", "p_subscription_type" "text", "p_duration_days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."add_pro_user_by_email"("p_email" "text", "p_subscription_type" "text", "p_duration_days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_pro_user_by_email"("p_email" "text", "p_subscription_type" "text", "p_duration_days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_payout_queue_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_payout_queue_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_payout_queue_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_system_health_check"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_system_health_check"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_system_health_check"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_chat_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_chat_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_chat_access"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_payment_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_payment_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_payment_access"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_payment_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_payment_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_payment_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_pro_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_pro_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_pro_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_subscription_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_subscription_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_subscription_access"() TO "service_role";



GRANT ALL ON FUNCTION "public"."audit_vip_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."audit_vip_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."audit_vip_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_activate_subscription"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_activate_subscription"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_activate_subscription"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_cleanup_pro_on_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_cleanup_pro_on_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_cleanup_pro_on_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_expire_pro_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_expire_pro_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_expire_pro_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_populate_elite_habit_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_populate_elite_habit_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_populate_elite_habit_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_sync_profile_metadata"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_sync_profile_metadata"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_sync_profile_metadata"() TO "service_role";



GRANT ALL ON FUNCTION "public"."award_audio_xp"("user_uuid" "uuid", "is_journal" boolean, "minutes_listened" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."award_audio_xp"("user_uuid" "uuid", "is_journal" boolean, "minutes_listened" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."award_audio_xp"("user_uuid" "uuid", "is_journal" boolean, "minutes_listened" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."award_journal_xp"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."award_journal_xp"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."award_journal_xp"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."award_xp"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."award_xp"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."award_xp"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."award_xp_with_daily_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."award_xp_with_daily_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."award_xp_with_daily_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."award_xp_with_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."award_xp_with_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."award_xp_with_limit"("p_user_id" "uuid", "p_xp_amount" integer, "p_activity_type" "text", "p_reason" "text", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."broadcast_pro_subscription_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."broadcast_pro_subscription_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."broadcast_pro_subscription_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bytea_to_text"("data" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_level_from_xp"("total_xp" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_level_from_xp"("total_xp" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_level_from_xp"("total_xp" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_level_from_xp_backup_500"("total_xp" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_level_from_xp_backup_500"("total_xp" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_level_from_xp_backup_500"("total_xp" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_subscription_end_date"("p_subscription_type" "text", "p_start_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_subscription_end_date"("p_subscription_type" "text", "p_start_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_subscription_end_date"("p_subscription_type" "text", "p_start_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."can_access_payment_transaction"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."can_access_payment_transaction"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_access_payment_transaction"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."can_access_verse"("p_user_id" "uuid", "p_verse_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."can_access_verse"("p_user_id" "uuid", "p_verse_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_access_verse"("p_user_id" "uuid", "p_verse_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_and_award_achievements"("user_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_and_award_achievements"("user_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_and_award_achievements"("user_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_daily_audio_limit"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_daily_audio_limit"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_daily_audio_limit"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_daily_chat_limit"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_daily_chat_limit"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_daily_chat_limit"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_daily_journal_limit"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_daily_journal_limit"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_daily_journal_limit"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_journal_spam_limits"("p_user_id" "uuid", "journal_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_journal_spam_limits"("p_user_id" "uuid", "journal_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_journal_spam_limits"("p_user_id" "uuid", "journal_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_action" "text", "p_max_attempts" integer, "p_window_minutes" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_action" "text", "p_max_attempts" integer, "p_window_minutes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_action" "text", "p_max_attempts" integer, "p_window_minutes" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_sensitive_data_rate_limit"("p_user_id" "uuid", "p_table_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."check_sensitive_data_rate_limit"("p_user_id" "uuid", "p_table_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_sensitive_data_rate_limit"("p_user_id" "uuid", "p_table_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_unified_pro_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_unified_pro_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_unified_pro_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_user_notification_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."check_user_notification_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_user_notification_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."check_weekly_challenge_bonus"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_weekly_challenge_bonus"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_weekly_challenge_bonus"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_chat_message_user_names"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_chat_message_user_names"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_chat_message_user_names"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_roles"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_roles"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_roles"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_pro_subscriptions"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_pro_subscriptions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_pro_subscriptions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_waiting_payments"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_waiting_payments"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_waiting_payments"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_offline_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_offline_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_offline_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_user_display_names"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_user_display_names"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_user_display_names"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_waiting_payment_24h"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_waiting_payment_24h"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_waiting_payment_24h"() TO "service_role";



GRANT ALL ON FUNCTION "public"."confirm_payment_make_pro"("p_tripay_reference" "text", "p_subscription_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."confirm_payment_make_pro"("p_tripay_reference" "text", "p_subscription_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."confirm_payment_make_pro"("p_tripay_reference" "text", "p_subscription_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."create_missing_profiles"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_missing_profiles"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_missing_profiles"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_payment_with_validation"("p_user_id" "uuid", "p_subscription_type" "text", "p_payment_method" "text", "p_user_phone" "text", "p_user_full_name" "text", "p_user_email" "text", "p_tripay_reference" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_payment_with_validation"("p_user_id" "uuid", "p_subscription_type" "text", "p_payment_method" "text", "p_user_phone" "text", "p_user_full_name" "text", "p_user_email" "text", "p_tripay_reference" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_payment_with_validation"("p_user_id" "uuid", "p_subscription_type" "text", "p_payment_method" "text", "p_user_phone" "text", "p_user_full_name" "text", "p_user_email" "text", "p_tripay_reference" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_pending_payment"("p_user_id" "uuid", "p_email" "text", "p_tripay_reference" "text", "p_amount" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."create_pending_payment"("p_user_id" "uuid", "p_email" "text", "p_tripay_reference" "text", "p_amount" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_pending_payment"("p_user_id" "uuid", "p_email" "text", "p_tripay_reference" "text", "p_amount" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_email"() TO "service_role";
GRANT ALL ON FUNCTION "public"."current_user_email"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."decrypt_email"("p_encrypted_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."decrypt_email"("p_encrypted_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrypt_email"("p_encrypted_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."emergency_revoke_admin_role"("p_target_user_id" "uuid", "p_reason" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."emergency_revoke_admin_role"("p_target_user_id" "uuid", "p_reason" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."emergency_revoke_admin_role"("p_target_user_id" "uuid", "p_reason" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."encrypt_email"("p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."encrypt_email"("p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."encrypt_email"("p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."encrypt_payment_field"("p_data" "text", "p_field_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."encrypt_payment_field"("p_data" "text", "p_field_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."encrypt_payment_field"("p_data" "text", "p_field_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."enhanced_admin_role_access_log"() TO "anon";
GRANT ALL ON FUNCTION "public"."enhanced_admin_role_access_log"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enhanced_admin_role_access_log"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enhanced_admin_role_audit"() TO "anon";
GRANT ALL ON FUNCTION "public"."enhanced_admin_role_audit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enhanced_admin_role_audit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."enhanced_payment_access_control"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."enhanced_payment_access_control"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."enhanced_payment_access_control"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."ensure_payment_tracking"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_payment_tracking"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_payment_tracking"() TO "service_role";



GRANT ALL ON FUNCTION "public"."expire_subscriptions"() TO "anon";
GRANT ALL ON FUNCTION "public"."expire_subscriptions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."expire_subscriptions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fix_user_levels"() TO "anon";
GRANT ALL ON FUNCTION "public"."fix_user_levels"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fix_user_levels"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_update_profile_on_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_update_profile_on_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_update_profile_on_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."force_global_cache_refresh"() TO "anon";
GRANT ALL ON FUNCTION "public"."force_global_cache_refresh"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."force_global_cache_refresh"() TO "service_role";



GRANT ALL ON FUNCTION "public"."function_reject_mock"() TO "anon";
GRANT ALL ON FUNCTION "public"."function_reject_mock"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."function_reject_mock"() TO "service_role";



GRANT ALL ON FUNCTION "public"."general_action_sync_display_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."general_action_sync_display_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."general_action_sync_display_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_auth_request_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_auth_request_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_auth_request_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_display_name"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_display_name"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_display_name"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_user_fast"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_fast"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_fast"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_daily_xp_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_daily_xp_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_daily_xp_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_level_from_xp"("xp_amount" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_level_from_xp"("xp_amount" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_level_from_xp"("xp_amount" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_masked_payment_transaction"("p_transaction_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_masked_payment_transaction"("p_transaction_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_masked_payment_transaction"("p_transaction_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_payment_access_summary"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_payment_access_summary"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_payment_access_summary"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_payment_status"("tripay_references" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_payment_status"("tripay_references" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_payment_status"("tripay_references" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_public_pro_status"("user_ids" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."get_public_pro_status"("user_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_public_pro_status"("user_ids" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_remaining_daily_xp"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_remaining_daily_xp"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_remaining_daily_xp"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_secure_payment_transaction"("p_transaction_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_secure_payment_transaction"("p_transaction_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_secure_payment_transaction"("p_transaction_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_email_safe"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email_safe"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email_safe"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_email_secure"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_email_secure"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_email_secure"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_payment_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_payment_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_payment_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_payment_transactions"("p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_payment_transactions"("p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_payment_transactions"("p_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_xp_for_next_level"("current_level" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_xp_for_next_level"("current_level" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_xp_for_next_level"("current_level" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_xp_thresholds"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_xp_thresholds"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_xp_thresholds"() TO "service_role";



GRANT ALL ON FUNCTION "public"."grant_admin_role"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."grant_admin_role"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."grant_admin_role"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."grant_pro_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."grant_pro_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."grant_pro_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_daily_login"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_daily_login"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_daily_login"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user_trial"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user_trial"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user_trial"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_subscription_payment"("p_user_id" "uuid", "p_user_email" "text", "p_plan" "text", "p_amount" numeric, "p_tripay_ref" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_subscription_payment"("p_user_id" "uuid", "p_user_email" "text", "p_plan" "text", "p_amount" numeric, "p_tripay_ref" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_subscription_payment"("p_user_id" "uuid", "p_user_email" "text", "p_plan" "text", "p_amount" numeric, "p_tripay_ref" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_subscription_upgrade"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_subscription_upgrade"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_subscription_upgrade"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_successful_payment_commission"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_successful_payment_commission"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_successful_payment_commission"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_successful_waiting_payment_commission"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_successful_waiting_payment_commission"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_successful_waiting_payment_commission"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_xp_transaction_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_xp_transaction_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_xp_transaction_trigger"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_pro_achievement"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_pro_achievement"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_pro_achievement"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "postgres";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "anon";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "service_role";



GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "service_role";



GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_total_journal"("user_id_param" "uuid", "source_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_total_journal"("user_id_param" "uuid", "source_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_total_journal"("user_id_param" "uuid", "source_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_total_verses"() TO "anon";
GRANT ALL ON FUNCTION "public"."increment_total_verses"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_total_verses"() TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_total_verses"("user_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_total_verses"("user_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_total_verses"("user_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_total_verses_unlimited"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_total_verses_unlimited"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_total_verses_unlimited"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_verse_count"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_verse_count"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_verse_count"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_super_admin_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_super_admin_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_super_admin_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_verified_admin"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_verified_admin"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_verified_admin"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_auth_request"("p_user_id" "uuid", "p_request_type" "text", "p_user_agent" "text", "p_ip_address" "text", "p_component_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."log_auth_request"("p_user_id" "uuid", "p_request_type" "text", "p_user_agent" "text", "p_ip_address" "text", "p_component_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_auth_request"("p_user_id" "uuid", "p_request_type" "text", "p_user_agent" "text", "p_ip_address" "text", "p_component_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_data_access"("p_table_name" "text", "p_operation" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."log_data_access"("p_table_name" "text", "p_operation" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_data_access"("p_table_name" "text", "p_operation" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_sensitive_action"("p_action" "text", "p_table_name" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."log_sensitive_action"("p_action" "text", "p_table_name" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_sensitive_action"("p_action" "text", "p_table_name" "text", "p_record_id" "uuid", "p_metadata" "jsonb") TO "service_role";



REVOKE ALL ON FUNCTION "public"."log_storage_action_and_call_edge"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."log_storage_action_and_call_edge"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mark_notification_type_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."mark_notification_type_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_notification_type_shown"("p_user_id" "uuid", "p_notification_type" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."mask_sensitive_payment_data"("p_bank_account" "text", "p_amount" numeric, "p_payment_instructions" "jsonb", "p_callback_data" "jsonb", "p_moota_webhook_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."mask_sensitive_payment_data"("p_bank_account" "text", "p_amount" numeric, "p_payment_instructions" "jsonb", "p_callback_data" "jsonb", "p_moota_webhook_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mask_sensitive_payment_data"("p_bank_account" "text", "p_amount" numeric, "p_payment_instructions" "jsonb", "p_callback_data" "jsonb", "p_moota_webhook_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."monitor_sensitive_data_access"() TO "anon";
GRANT ALL ON FUNCTION "public"."monitor_sensitive_data_access"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."monitor_sensitive_data_access"() TO "service_role";



GRANT ALL ON FUNCTION "public"."photo_credit_broadcast_trigger"() TO "anon";
GRANT ALL ON FUNCTION "public"."photo_credit_broadcast_trigger"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."photo_credit_broadcast_trigger"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."photo_credit_replace_on_reference"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."photo_credit_replace_on_reference"() TO "anon";
GRANT ALL ON FUNCTION "public"."photo_credit_replace_on_reference"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."photo_credit_replace_on_reference"() TO "service_role";
GRANT ALL ON FUNCTION "public"."photo_credit_replace_on_reference"() TO "supabase_admin";



GRANT ALL ON FUNCTION "public"."photo_credit_upsert"() TO "anon";
GRANT ALL ON FUNCTION "public"."photo_credit_upsert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."photo_credit_upsert"() TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_affiliate_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_affiliate_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_affiliate_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."populate_elite_habit_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."populate_elite_habit_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."populate_elite_habit_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."prevent_unauthorized_pro"() TO "anon";
GRANT ALL ON FUNCTION "public"."prevent_unauthorized_pro"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."prevent_unauthorized_pro"() TO "service_role";



GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text", "p_payment_method" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text", "p_payment_method" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_tripay_payment_callback"("p_tripay_reference" "text", "p_payment_status" "text", "p_payment_method" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."reflections_counter_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."reflections_counter_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reflections_counter_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reflections_counter_sync"() TO "anon";
GRANT ALL ON FUNCTION "public"."reflections_counter_sync"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reflections_counter_sync"() TO "service_role";



GRANT ALL ON FUNCTION "public"."revoke_admin_role"("p_target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."revoke_admin_role"("p_target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."revoke_admin_role"("p_target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."revoke_pro_status"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."revoke_pro_status"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."revoke_pro_status"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."secure_admin_role_grant"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone, "p_justification" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."secure_admin_role_grant"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone, "p_justification" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."secure_admin_role_grant"("p_target_user_id" "uuid", "p_role" "text", "p_expires_at" timestamp with time zone, "p_justification" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_chat_message"("p_message" "text", "p_channel_id" "text", "p_is_private" boolean, "p_allowed_users" "uuid"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."send_order_to_vps"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_order_to_vps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_order_to_vps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_message_subscription_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_message_subscription_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_message_subscription_type"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_profile_level_from_xp"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_profile_level_from_xp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_profile_level_from_xp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_user_id_from_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_user_id_from_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_user_id_from_email"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_user_id_from_subscription"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_user_id_from_subscription"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_user_id_from_subscription"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_days_remaining_daily"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_days_remaining_daily"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_days_remaining_daily"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_display_name_to_metadata"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_display_name_to_metadata"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_display_name_to_metadata"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_elite_habit_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_elite_habit_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_elite_habit_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_pro_status_from_subscription"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_pro_status_from_subscription"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_pro_status_from_subscription"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_to_metadata"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_to_metadata"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_to_metadata"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_reflection_count"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_reflection_count"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_reflection_count"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user_webinar_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user_webinar_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user_webinar_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_verse_notif_display_name"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_verse_notif_display_name"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_verse_notif_display_name"() TO "service_role";



GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."text_to_bytea"("data" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."track_user_presence"("p_email" "text", "p_display_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."track_user_presence"("p_email" "text", "p_display_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_user_presence"("p_email" "text", "p_display_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_log_storage_action"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_log_storage_action"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_log_storage_action"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_cleanup_waiting_payment"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_cleanup_waiting_payment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_cleanup_waiting_payment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_journal_tracking"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_journal_tracking"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_journal_tracking"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_last_login" timestamp with time zone, "p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_last_login" timestamp with time zone, "p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_last_login" timestamp with time zone, "p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login_date" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login_date" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login_date" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile_last_login"("p_user_id" "uuid", "p_last_login" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_streak"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_streak"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_streak"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_subscription_status_manually"("p_subscription_id" "uuid", "p_status" "text", "p_subscription_type" "text", "p_duration_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_subscription_status_manually"("p_subscription_id" "uuid", "p_status" "text", "p_subscription_type" "text", "p_duration_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_subscription_status_manually"("p_subscription_id" "uuid", "p_status" "text", "p_subscription_type" "text", "p_duration_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_total_journal_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_total_journal_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_total_journal_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_total_journal_count_delete"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_total_journal_count_delete"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_total_journal_count_delete"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_online_status"("p_user_id" "uuid", "p_email" "text", "p_display_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_online_status"("p_user_id" "uuid", "p_email" "text", "p_display_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_online_status"("p_user_id" "uuid", "p_email" "text", "p_display_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_streak"("user_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_streak"("user_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_streak"("user_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v1mc"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v4"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_nil"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_dns"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_oid"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_url"() TO "service_role";



GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "postgres";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "anon";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."uuid_ns_x500"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_admin_role_operation"("p_target_user_id" "uuid", "p_role" "text", "p_operation" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_admin_role_operation"("p_target_user_id" "uuid", "p_role" "text", "p_operation" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_admin_role_operation"("p_target_user_id" "uuid", "p_role" "text", "p_operation" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_journal_entry"("journal_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_journal_entry"("journal_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_journal_entry"("journal_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_payment_access"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_payment_access"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_payment_access"("p_user_id" "uuid", "p_transaction_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_payment_transaction_access"("p_transaction_id" "uuid", "p_access_type" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_payment_transaction_access"("p_transaction_id" "uuid", "p_access_type" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_payment_transaction_access"("p_transaction_id" "uuid", "p_access_type" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_admin_with_failsafe"("p_user_id" "uuid", "p_required_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_admin_with_failsafe"("p_user_id" "uuid", "p_required_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_admin_with_failsafe"("p_user_id" "uuid", "p_required_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."waiting_payment_upsert"() TO "anon";
GRANT ALL ON FUNCTION "public"."waiting_payment_upsert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."waiting_payment_upsert"() TO "service_role";



GRANT ALL ON FUNCTION "public"."waiting_payment_upsert_tripay_by_username"() TO "anon";
GRANT ALL ON FUNCTION "public"."waiting_payment_upsert_tripay_by_username"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."waiting_payment_upsert_tripay_by_username"() TO "service_role";






























GRANT ALL ON TABLE "public"."absen_hidup" TO "anon";
GRANT ALL ON TABLE "public"."absen_hidup" TO "authenticated";
GRANT ALL ON TABLE "public"."absen_hidup" TO "service_role";



GRANT ALL ON SEQUENCE "public"."absen_hidup_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."absen_hidup_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."absen_hidup_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."withdrawals" TO "authenticated";
GRANT ALL ON TABLE "public"."withdrawals" TO "service_role";
GRANT UPDATE ON TABLE "public"."withdrawals" TO "anon";



GRANT ALL ON TABLE "public"."admin_payout_queue" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_payout_queue" TO "service_role";



GRANT ALL ON TABLE "public"."admin_roles" TO "anon";
GRANT ALL ON TABLE "public"."admin_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_roles" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_events" TO "anon";
GRANT ALL ON TABLE "public"."analytics_events" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_events" TO "service_role";



GRANT ALL ON TABLE "public"."audio_tracks" TO "anon";
GRANT ALL ON TABLE "public"."audio_tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."audio_tracks" TO "service_role";



GRANT ALL ON TABLE "public"."auth_request_logs" TO "anon";
GRANT ALL ON TABLE "public"."auth_request_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."auth_request_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."auth_request_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."auth_request_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."auth_request_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."commissions" TO "anon";
GRANT ALL ON TABLE "public"."commissions" TO "authenticated";
GRANT ALL ON TABLE "public"."commissions" TO "service_role";



GRANT ALL ON TABLE "public"."data_classification" TO "anon";
GRANT ALL ON TABLE "public"."data_classification" TO "authenticated";
GRANT ALL ON TABLE "public"."data_classification" TO "service_role";



GRANT ALL ON TABLE "public"."debug_logs" TO "anon";
GRANT ALL ON TABLE "public"."debug_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."debug_logs" TO "service_role";



GRANT ALL ON TABLE "public"."device_tokens" TO "anon";
GRANT ALL ON TABLE "public"."device_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."device_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."elite_habits" TO "anon";
GRANT ALL ON TABLE "public"."elite_habits" TO "authenticated";
GRANT ALL ON TABLE "public"."elite_habits" TO "service_role";



GRANT ALL ON TABLE "public"."email_logs" TO "anon";
GRANT ALL ON TABLE "public"."email_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."email_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."email_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."email_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."email_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."general_action" TO "anon";
GRANT ALL ON TABLE "public"."general_action" TO "authenticated";
GRANT ALL ON TABLE "public"."general_action" TO "service_role";



GRANT ALL ON TABLE "public"."global_member" TO "anon";
GRANT ALL ON TABLE "public"."global_member" TO "authenticated";
GRANT ALL ON TABLE "public"."global_member" TO "service_role";



GRANT ALL ON TABLE "public"."global_product" TO "anon";
GRANT ALL ON TABLE "public"."global_product" TO "authenticated";
GRANT ALL ON TABLE "public"."global_product" TO "service_role";
GRANT SELECT ON TABLE "public"."global_product" TO PUBLIC;



GRANT ALL ON SEQUENCE "public"."global_product_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."global_product_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."global_product_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."gold_reports" TO "anon";
GRANT ALL ON TABLE "public"."gold_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."gold_reports" TO "service_role";



GRANT ALL ON TABLE "public"."notification_settings" TO "anon";
GRANT ALL ON TABLE "public"."notification_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_settings" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."page_visits" TO "anon";
GRANT ALL ON TABLE "public"."page_visits" TO "authenticated";
GRANT ALL ON TABLE "public"."page_visits" TO "service_role";



GRANT ALL ON SEQUENCE "public"."page_visits_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."page_visits_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."page_visits_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."photo_credit" TO "anon";
GRANT ALL ON TABLE "public"."photo_credit" TO "authenticated";
GRANT ALL ON TABLE "public"."photo_credit" TO "service_role";



GRANT ALL ON TABLE "public"."pixel_events" TO "anon";
GRANT ALL ON TABLE "public"."pixel_events" TO "authenticated";
GRANT ALL ON TABLE "public"."pixel_events" TO "service_role";



GRANT ALL ON TABLE "public"."pro_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."pro_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."pro_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."rate_limit_log" TO "anon";
GRANT ALL ON TABLE "public"."rate_limit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."rate_limit_log" TO "service_role";



GRANT ALL ON TABLE "public"."reflections" TO "anon";
GRANT ALL ON TABLE "public"."reflections" TO "authenticated";
GRANT ALL ON TABLE "public"."reflections" TO "service_role";



GRANT ALL ON TABLE "public"."security_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."security_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."security_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."survey3000" TO "anon";
GRANT ALL ON TABLE "public"."survey3000" TO "authenticated";
GRANT ALL ON TABLE "public"."survey3000" TO "service_role";



GRANT ALL ON TABLE "public"."update_banner_clicks" TO "anon";
GRANT ALL ON TABLE "public"."update_banner_clicks" TO "authenticated";
GRANT ALL ON TABLE "public"."update_banner_clicks" TO "service_role";



GRANT ALL ON TABLE "public"."user_activities" TO "anon";
GRANT ALL ON TABLE "public"."user_activities" TO "authenticated";
GRANT ALL ON TABLE "public"."user_activities" TO "service_role";



GRANT ALL ON TABLE "public"."user_contact_info" TO "anon";
GRANT ALL ON TABLE "public"."user_contact_info" TO "authenticated";
GRANT ALL ON TABLE "public"."user_contact_info" TO "service_role";



GRANT ALL ON TABLE "public"."user_webinar" TO "anon";
GRANT ALL ON TABLE "public"."user_webinar" TO "authenticated";
GRANT ALL ON TABLE "public"."user_webinar" TO "service_role";



GRANT ALL ON TABLE "public"."verse_notif" TO "anon";
GRANT ALL ON TABLE "public"."verse_notif" TO "authenticated";
GRANT ALL ON TABLE "public"."verse_notif" TO "service_role";



GRANT ALL ON TABLE "public"."waiting_payment" TO "anon";
GRANT ALL ON TABLE "public"."waiting_payment" TO "authenticated";
GRANT ALL ON TABLE "public"."waiting_payment" TO "service_role";



GRANT ALL ON TABLE "public"."xp_transactions" TO "anon";
GRANT ALL ON TABLE "public"."xp_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."xp_transactions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























