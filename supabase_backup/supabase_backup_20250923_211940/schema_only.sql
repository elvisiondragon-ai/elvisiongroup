--
-- PostgreSQL database dump
--

\restrict M1ZIQjW5RJwvwBJoLE2sl5dSX3qifRR3fFpZirH74JsCAMotVIDOeHplDitb4VI

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:02 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime_messages_publication;
DROP PUBLICATION IF EXISTS supabase_realtime;
DROP POLICY IF EXISTS "Users can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can play audio files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view audio files" ON storage.objects;
DROP POLICY IF EXISTS "  Private Signed URLs Only 1fjm550_0" ON storage.objects;
DROP POLICY IF EXISTS simple_read_admin_roles ON public.admin_roles;
DROP POLICY IF EXISTS chat_read ON public.chat_messages;
DROP POLICY IF EXISTS chat_insert ON public.chat_messages;
DROP POLICY IF EXISTS chat_delete ON public.chat_messages;
DROP POLICY IF EXISTS allow_read_admin_roles ON public.admin_roles;
DROP POLICY IF EXISTS "Verified admins can view all subscriptions" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Verified admins can manage days_remaining" ON public.days_remaining;
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can view their own waiting payments" ON public.waiting_payment;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can view their own days_remaining" ON public.days_remaining;
DROP POLICY IF EXISTS "Users can view their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can view their own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Users can view own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can update their own audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Users can update own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can select own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can only view their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can only update their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can only insert their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can only delete their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own notification settings" ON public.notification_settings;
DROP POLICY IF EXISTS "Users can insert own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can delete own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can create their own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can create their own XP transactions" ON public.xp_transactions;
DROP POLICY IF EXISTS "Ultra secure contact info update" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info insert" ON public.user_contact_info;
DROP POLICY IF EXISTS "Ultra secure contact info access" ON public.user_contact_info;
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "System can insert admin activity logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Super admins can view admin activity logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Super admins can update admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can delete admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins can create admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Service role can manage debug logs" ON public.debug_logs;
DROP POLICY IF EXISTS "Service role can do anything on waiting_payment" ON public.waiting_payment;
DROP POLICY IF EXISTS "Service role can create subscriptions" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Secure device token update" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token insert" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token delete" ON public.device_tokens;
DROP POLICY IF EXISTS "Secure device token access" ON public.device_tokens;
DROP POLICY IF EXISTS "Only verified admins can view data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Only verified admins can manage data classification" ON public.data_classification;
DROP POLICY IF EXISTS "Only service role can create subscriptions" ON public.pro_subscriptions;
DROP POLICY IF EXISTS "Fast chat write" ON public.chat_messages;
DROP POLICY IF EXISTS "Fast chat read" ON public.chat_messages;
DROP POLICY IF EXISTS "Fast chat delete" ON public.chat_messages;
DROP POLICY IF EXISTS "Everyone can view app updates" ON public.app_updates;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.email_logs;
DROP POLICY IF EXISTS "Channel-based chat message access" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can create chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can create audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Auth users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view public audio tracks" ON public.audio_tracks;
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Admin can manage all subscriptions" ON public.pro_subscriptions;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.prefixes DROP CONSTRAINT IF EXISTS "prefixes_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.pro_subscriptions DROP CONSTRAINT IF EXISTS vip_subscriptions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notification_settings DROP CONSTRAINT IF EXISTS notification_settings_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.elite_habits DROP CONSTRAINT IF EXISTS elite_habits_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.device_tokens DROP CONSTRAINT IF EXISTS device_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.days_remaining DROP CONSTRAINT IF EXISTS days_remaining_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.days_remaining DROP CONSTRAINT IF EXISTS days_remaining_subscription_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audio_tracks DROP CONSTRAINT IF EXISTS audio_tracks_created_by_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS prefixes_delete_cleanup ON storage.prefixes;
DROP TRIGGER IF EXISTS prefixes_create_hierarchy ON storage.prefixes;
DROP TRIGGER IF EXISTS objects_update_cleanup ON storage.objects;
DROP TRIGGER IF EXISTS objects_insert_create_prefix ON storage.objects;
DROP TRIGGER IF EXISTS objects_delete_cleanup ON storage.objects;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP TRIGGER IF EXISTS update_vip_subscriptions_updated_at ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS update_notification_settings_updated_at ON public.notification_settings;
DROP TRIGGER IF EXISTS update_device_tokens_updated_at ON public.device_tokens;
DROP TRIGGER IF EXISTS update_days_remaining_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS update_audio_tracks_updated_at ON public.audio_tracks;
DROP TRIGGER IF EXISTS trigger_set_subscription_type ON public.chat_messages;
DROP TRIGGER IF EXISTS trg_set_user_id_pro_subscriptions ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS sync_elite_habit_count_update ON public.elite_habits;
DROP TRIGGER IF EXISTS sync_elite_habit_count_insert ON public.elite_habits;
DROP TRIGGER IF EXISTS sync_elite_habit_count_delete ON public.elite_habits;
DROP TRIGGER IF EXISTS sync_days_remaining_table_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS monitor_user_contact_info_access ON public.user_contact_info;
DROP TRIGGER IF EXISTS monitor_device_tokens_access ON public.device_tokens;
DROP TRIGGER IF EXISTS handle_elite_habits_updated_at ON public.elite_habits;
DROP TRIGGER IF EXISTS enhanced_admin_role_audit_trigger ON public.admin_roles;
DROP TRIGGER IF EXISTS enhanced_admin_role_access_monitor ON public.admin_roles;
DROP TRIGGER IF EXISTS cleanup_waiting_payment_trigger ON public.waiting_payment;
DROP TRIGGER IF EXISTS calculate_days_remaining_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS auto_populate_elite_habit_email_trigger ON public.elite_habits;
DROP TRIGGER IF EXISTS auto_cleanup_pro_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS auto_activate_subscription_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS audit_vip_subscription_changes ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS audit_pro_changes_trigger ON public.pro_subscriptions;
DROP TRIGGER IF EXISTS audit_chat_messages_trigger ON public.chat_messages;
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS "MAILKETING WEBHOOK" ON auth.sso_providers;
DROP INDEX IF EXISTS supabase_functions.supabase_functions_hooks_request_id_idx;
DROP INDEX IF EXISTS supabase_functions.supabase_functions_hooks_h_table_id_h_name_idx;
DROP INDEX IF EXISTS storage.objects_bucket_id_level_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_prefixes_lower_name;
DROP INDEX IF EXISTS storage.idx_objects_lower_name;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_name_bucket_level_unique;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_key;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.idx_waiting_payment_user_id;
DROP INDEX IF EXISTS public.idx_waiting_payment_tripay_reference;
DROP INDEX IF EXISTS public.idx_waiting_payment_status;
DROP INDEX IF EXISTS public.idx_reflections_user_id;
DROP INDEX IF EXISTS public.idx_reflections_user_email;
DROP INDEX IF EXISTS public.idx_reflections_created_at;
DROP INDEX IF EXISTS public.idx_profiles_user_id_fast;
DROP INDEX IF EXISTS public.idx_profiles_user_email;
DROP INDEX IF EXISTS public.idx_profiles_total_verses;
DROP INDEX IF EXISTS public.idx_profiles_total_journal;
DROP INDEX IF EXISTS public.idx_profiles_streak_days;
DROP INDEX IF EXISTS public.idx_pro_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_pro_subscriptions_email;
DROP INDEX IF EXISTS public.idx_notifications_type;
DROP INDEX IF EXISTS public.idx_email_logs_knowledge_base_id;
DROP INDEX IF EXISTS public.idx_chat_messages_user_id;
DROP INDEX IF EXISTS public.idx_chat_messages_user_created;
DROP INDEX IF EXISTS public.idx_chat_messages_privacy;
DROP INDEX IF EXISTS public.idx_chat_messages_created_at;
DROP INDEX IF EXISTS public.idx_chat_messages_channel_id;
DROP INDEX IF EXISTS public.idx_audio_tracks_language;
DROP INDEX IF EXISTS public.idx_audio_tracks_category_language;
DROP INDEX IF EXISTS public.elite_habits_user_id_idx;
DROP INDEX IF EXISTS public.elite_habits_user_email_idx;
DROP INDEX IF EXISTS public.elite_habits_date_idx;
DROP INDEX IF EXISTS public.elite_habits_created_at_idx;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_clients_client_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY supabase_migrations.seed_files DROP CONSTRAINT IF EXISTS seed_files_pkey;
ALTER TABLE IF EXISTS ONLY supabase_migrations.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY supabase_migrations.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_idempotency_key_key;
ALTER TABLE IF EXISTS ONLY supabase_functions.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY supabase_functions.hooks DROP CONSTRAINT IF EXISTS hooks_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.prefixes DROP CONSTRAINT IF EXISTS prefixes_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_26 DROP CONSTRAINT IF EXISTS messages_2025_09_26_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_25 DROP CONSTRAINT IF EXISTS messages_2025_09_25_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_24 DROP CONSTRAINT IF EXISTS messages_2025_09_24_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_23 DROP CONSTRAINT IF EXISTS messages_2025_09_23_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_22 DROP CONSTRAINT IF EXISTS messages_2025_09_22_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_21 DROP CONSTRAINT IF EXISTS messages_2025_09_21_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages_2025_09_20 DROP CONSTRAINT IF EXISTS messages_2025_09_20_pkey;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.xp_transactions DROP CONSTRAINT IF EXISTS xp_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.waiting_payment DROP CONSTRAINT IF EXISTS waiting_payment_pkey;
ALTER TABLE IF EXISTS ONLY public.pro_subscriptions DROP CONSTRAINT IF EXISTS vip_subscriptions_tripay_reference_key;
ALTER TABLE IF EXISTS ONLY public.pro_subscriptions DROP CONSTRAINT IF EXISTS vip_subscriptions_pkey;
ALTER TABLE IF EXISTS ONLY public.user_contact_info DROP CONSTRAINT IF EXISTS user_contact_info_user_id_key;
ALTER TABLE IF EXISTS ONLY public.user_contact_info DROP CONSTRAINT IF EXISTS user_contact_info_pkey;
ALTER TABLE IF EXISTS ONLY public.user_activities DROP CONSTRAINT IF EXISTS user_activities_pkey;
ALTER TABLE IF EXISTS ONLY public.pro_subscriptions DROP CONSTRAINT IF EXISTS unique_active_subscription_per_user;
ALTER TABLE IF EXISTS ONLY public.subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_pkey;
ALTER TABLE IF EXISTS ONLY public.security_audit_log DROP CONSTRAINT IF EXISTS security_audit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.reflections DROP CONSTRAINT IF EXISTS reflections_pkey;
ALTER TABLE IF EXISTS ONLY public.rate_limit_log DROP CONSTRAINT IF EXISTS rate_limit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE IF EXISTS ONLY public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.notification_settings DROP CONSTRAINT IF EXISTS notification_settings_user_id_key;
ALTER TABLE IF EXISTS ONLY public.notification_settings DROP CONSTRAINT IF EXISTS notification_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.email_logs DROP CONSTRAINT IF EXISTS email_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.elite_habits DROP CONSTRAINT IF EXISTS elite_habits_pkey;
ALTER TABLE IF EXISTS ONLY public.device_tokens DROP CONSTRAINT IF EXISTS device_tokens_user_id_token_key;
ALTER TABLE IF EXISTS ONLY public.device_tokens DROP CONSTRAINT IF EXISTS device_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.debug_logs DROP CONSTRAINT IF EXISTS debug_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.days_remaining DROP CONSTRAINT IF EXISTS days_remaining_user_id_key;
ALTER TABLE IF EXISTS ONLY public.days_remaining DROP CONSTRAINT IF EXISTS days_remaining_pkey;
ALTER TABLE IF EXISTS ONLY public.data_classification DROP CONSTRAINT IF EXISTS data_classification_pkey;
ALTER TABLE IF EXISTS ONLY public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_request_logs DROP CONSTRAINT IF EXISTS auth_request_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.audio_tracks DROP CONSTRAINT IF EXISTS audio_tracks_pkey;
ALTER TABLE IF EXISTS ONLY public.app_updates DROP CONSTRAINT IF EXISTS app_updates_pkey;
ALTER TABLE IF EXISTS ONLY public.app_config DROP CONSTRAINT IF EXISTS app_config_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_roles DROP CONSTRAINT IF EXISTS admin_roles_user_id_key;
ALTER TABLE IF EXISTS ONLY public.admin_roles DROP CONSTRAINT IF EXISTS admin_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.admin_activity_log DROP CONSTRAINT IF EXISTS admin_activity_log_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_client_id_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS supabase_functions.hooks ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.email_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.auth_request_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS supabase_migrations.seed_files;
DROP TABLE IF EXISTS supabase_migrations.schema_migrations;
DROP TABLE IF EXISTS supabase_functions.migrations;
DROP SEQUENCE IF EXISTS supabase_functions.hooks_id_seq;
DROP TABLE IF EXISTS supabase_functions.hooks;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.prefixes;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages_2025_09_26;
DROP TABLE IF EXISTS realtime.messages_2025_09_25;
DROP TABLE IF EXISTS realtime.messages_2025_09_24;
DROP TABLE IF EXISTS realtime.messages_2025_09_23;
DROP TABLE IF EXISTS realtime.messages_2025_09_22;
DROP TABLE IF EXISTS realtime.messages_2025_09_21;
DROP TABLE IF EXISTS realtime.messages_2025_09_20;
DROP TABLE IF EXISTS realtime.messages;
DROP TABLE IF EXISTS public.xp_transactions;
DROP TABLE IF EXISTS public.waiting_payment;
DROP TABLE IF EXISTS public.user_contact_info;
DROP TABLE IF EXISTS public.user_activities;
DROP TABLE IF EXISTS public.subscription_plans;
DROP TABLE IF EXISTS public.security_audit_log;
DROP TABLE IF EXISTS public.reflections;
DROP TABLE IF EXISTS public.rate_limit_log;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.pro_subscriptions;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.notification_settings;
DROP SEQUENCE IF EXISTS public.email_logs_id_seq;
DROP TABLE IF EXISTS public.email_logs;
DROP TABLE IF EXISTS public.elite_habits;
DROP TABLE IF EXISTS public.device_tokens;
DROP TABLE IF EXISTS public.debug_logs;
DROP TABLE IF EXISTS public.days_remaining;
DROP TABLE IF EXISTS public.data_classification;
DROP TABLE IF EXISTS public.chat_messages;
DROP SEQUENCE IF EXISTS public.auth_request_logs_id_seq;
DROP TABLE IF EXISTS public.auth_request_logs;
DROP TABLE IF EXISTS public.audio_tracks;
DROP TABLE IF EXISTS public.app_updates;
DROP TABLE IF EXISTS public.app_config;
DROP TABLE IF EXISTS public.admin_roles;
DROP TABLE IF EXISTS public.admin_activity_log;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS supabase_functions.http_request();
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_v1_optimised(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.prefixes_insert_trigger();
DROP FUNCTION IF EXISTS storage.prefixes_delete_cleanup();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.objects_update_prefix_trigger();
DROP FUNCTION IF EXISTS storage.objects_update_cleanup();
DROP FUNCTION IF EXISTS storage.objects_insert_prefix_trigger();
DROP FUNCTION IF EXISTS storage.objects_delete_cleanup();
DROP FUNCTION IF EXISTS storage.lock_top_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_prefixes(name text);
DROP FUNCTION IF EXISTS storage.get_prefix(name text);
DROP FUNCTION IF EXISTS storage.get_level(name text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.delete_prefix_hierarchy_trigger();
DROP FUNCTION IF EXISTS storage.delete_prefix(_bucket_id text, _name text);
DROP FUNCTION IF EXISTS storage.delete_leaf_prefixes(bucket_ids text[], names text[]);
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.add_prefixes(_bucket_id text, _name text);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS public.verify_admin_with_failsafe(p_user_id uuid, p_required_role text);
DROP FUNCTION IF EXISTS public.validate_payment_transaction_access(p_transaction_id uuid, p_access_type text);
DROP FUNCTION IF EXISTS public.validate_payment_access(p_user_id uuid, p_transaction_id uuid);
DROP FUNCTION IF EXISTS public.validate_journal_entry(journal_text text);
DROP FUNCTION IF EXISTS public.validate_admin_role_operation(p_target_user_id uuid, p_role text, p_operation text);
DROP FUNCTION IF EXISTS public.update_user_streak(user_id_param uuid);
DROP FUNCTION IF EXISTS public.update_user_online_status(p_user_id uuid, p_email text, p_display_name text);
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.update_total_journal_count_delete();
DROP FUNCTION IF EXISTS public.update_total_journal_count();
DROP FUNCTION IF EXISTS public.update_subscription_status_manually(p_subscription_id uuid, p_status text, p_subscription_type text, p_duration_type text);
DROP FUNCTION IF EXISTS public.update_streak(user_uuid uuid);
DROP FUNCTION IF EXISTS public.update_journal_tracking(p_user_id uuid);
DROP FUNCTION IF EXISTS public.update_days_remaining();
DROP FUNCTION IF EXISTS public.trigger_cleanup_waiting_payment();
DROP FUNCTION IF EXISTS public.track_user_presence(p_email text, p_display_name text);
DROP FUNCTION IF EXISTS public.sync_pro_status_from_subscription(p_user_id uuid);
DROP FUNCTION IF EXISTS public.sync_elite_habit_count();
DROP FUNCTION IF EXISTS public.sync_days_remaining_table();
DROP FUNCTION IF EXISTS public.sync_all_days_remaining_table();
DROP FUNCTION IF EXISTS public.sync_all_days_remaining();
DROP FUNCTION IF EXISTS public.set_user_id_from_subscription();
DROP FUNCTION IF EXISTS public.set_user_id_from_email();
DROP FUNCTION IF EXISTS public.set_message_subscription_type();
DROP FUNCTION IF EXISTS public.send_order_to_vps();
DROP FUNCTION IF EXISTS public.send_chat_message(p_message text, p_channel_id text, p_is_private boolean, p_allowed_users uuid[]);
DROP FUNCTION IF EXISTS public.secure_admin_role_grant(p_target_user_id uuid, p_role text, p_expires_at timestamp with time zone, p_justification text);
DROP FUNCTION IF EXISTS public.revoke_pro_status(p_user_id uuid);
DROP FUNCTION IF EXISTS public.revoke_admin_role(p_target_user_id uuid);
DROP FUNCTION IF EXISTS public.refresh_all_days_remaining();
DROP FUNCTION IF EXISTS public.process_tripay_payment_callback(p_tripay_reference text, p_payment_status text, p_payment_method text);
DROP FUNCTION IF EXISTS public.process_tripay_payment_callback(p_tripay_reference text, p_payment_status text);
DROP FUNCTION IF EXISTS public.prevent_unauthorized_pro();
DROP FUNCTION IF EXISTS public.populate_elite_habit_email();
DROP FUNCTION IF EXISTS public.monitor_sensitive_data_access();
DROP FUNCTION IF EXISTS public.mask_sensitive_payment_data(p_bank_account text, p_amount numeric, p_payment_instructions jsonb, p_callback_data jsonb, p_moota_webhook_data jsonb);
DROP FUNCTION IF EXISTS public.mark_notification_type_shown(p_user_id uuid, p_notification_type character varying);
DROP FUNCTION IF EXISTS public.log_sensitive_action(p_action text, p_table_name text, p_record_id uuid, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.log_data_access(p_table_name text, p_operation text, p_record_id uuid, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.log_auth_request(p_user_id uuid, p_request_type text, p_user_agent text, p_ip_address text, p_component_name text);
DROP FUNCTION IF EXISTS public.is_verified_admin(p_user_id uuid);
DROP FUNCTION IF EXISTS public.is_super_admin_user();
DROP FUNCTION IF EXISTS public.increment_total_verses(user_id_param uuid);
DROP FUNCTION IF EXISTS public.increment_total_journal(user_id_param uuid, source_type text);
DROP FUNCTION IF EXISTS public.has_pro_achievement(p_user_id uuid);
DROP FUNCTION IF EXISTS public.handle_xp_transaction_trigger();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_subscription_upgrade();
DROP FUNCTION IF EXISTS public.handle_new_user_trial();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_daily_login(p_user_id uuid);
DROP FUNCTION IF EXISTS public.grant_pro_status(p_user_id uuid);
DROP FUNCTION IF EXISTS public.grant_admin_role(p_target_user_id uuid, p_role text, p_expires_at timestamp with time zone);
DROP FUNCTION IF EXISTS public.get_xp_thresholds();
DROP FUNCTION IF EXISTS public.get_xp_for_next_level(current_level integer);
DROP FUNCTION IF EXISTS public.get_user_payment_transactions(p_limit integer);
DROP FUNCTION IF EXISTS public.get_user_payment_status(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_user_email_secure(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_user_email_safe(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_secure_payment_transaction(p_transaction_id uuid);
DROP FUNCTION IF EXISTS public.get_remaining_daily_xp(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_payment_access_summary();
DROP FUNCTION IF EXISTS public.get_masked_payment_transaction(p_transaction_id uuid);
DROP FUNCTION IF EXISTS public.get_level_from_xp(xp_amount integer);
DROP FUNCTION IF EXISTS public.get_daily_xp_status(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_current_user_fast();
DROP FUNCTION IF EXISTS public.get_auth_request_stats();
DROP FUNCTION IF EXISTS public.force_global_cache_refresh();
DROP FUNCTION IF EXISTS public.fix_user_levels();
DROP FUNCTION IF EXISTS public.expire_subscriptions();
DROP FUNCTION IF EXISTS public.ensure_payment_tracking();
DROP FUNCTION IF EXISTS public.enhanced_payment_access_control(p_user_id uuid, p_transaction_id uuid);
DROP FUNCTION IF EXISTS public.enhanced_admin_role_audit();
DROP FUNCTION IF EXISTS public.enhanced_admin_role_access_log();
DROP FUNCTION IF EXISTS public.encrypt_payment_field(p_data text, p_field_type text);
DROP FUNCTION IF EXISTS public.encrypt_email(p_email text);
DROP FUNCTION IF EXISTS public.emergency_revoke_admin_role(p_target_user_id uuid, p_reason text);
DROP FUNCTION IF EXISTS public.decrypt_email(p_encrypted_email text);
DROP FUNCTION IF EXISTS public.daily_sync_days_remaining();
DROP FUNCTION IF EXISTS public.create_pending_payment(p_user_id uuid, p_email text, p_tripay_reference text, p_amount integer);
DROP FUNCTION IF EXISTS public.create_payment_with_validation(p_user_id uuid, p_subscription_type text, p_payment_method text, p_user_phone text, p_user_full_name text, p_user_email text, p_tripay_reference text);
DROP FUNCTION IF EXISTS public.create_missing_profiles();
DROP FUNCTION IF EXISTS public.create_chat_message(p_message text, p_channel_id text, p_is_private boolean, p_allowed_users uuid[]);
DROP FUNCTION IF EXISTS public.confirm_payment_make_pro(p_tripay_reference text, p_subscription_type text);
DROP FUNCTION IF EXISTS public.cleanup_waiting_payment_24h();
DROP FUNCTION IF EXISTS public.cleanup_user_display_names();
DROP FUNCTION IF EXISTS public.cleanup_offline_users();
DROP FUNCTION IF EXISTS public.cleanup_expired_waiting_payments();
DROP FUNCTION IF EXISTS public.cleanup_expired_pro_subscriptions();
DROP FUNCTION IF EXISTS public.cleanup_expired_admin_roles();
DROP FUNCTION IF EXISTS public.cleanup_chat_message_user_names();
DROP FUNCTION IF EXISTS public.check_weekly_challenge_bonus(p_user_id uuid);
DROP FUNCTION IF EXISTS public.check_user_notification_shown(p_user_id uuid, p_notification_type character varying);
DROP FUNCTION IF EXISTS public.check_unified_pro_status(p_user_id uuid);
DROP FUNCTION IF EXISTS public.check_sensitive_data_rate_limit(p_user_id uuid, p_table_name text);
DROP FUNCTION IF EXISTS public.check_rate_limit(p_user_id uuid, p_action text, p_max_attempts integer, p_window_minutes integer);
DROP FUNCTION IF EXISTS public.check_journal_spam_limits(p_user_id uuid, journal_text text);
DROP FUNCTION IF EXISTS public.check_daily_journal_limit(p_user_id uuid);
DROP FUNCTION IF EXISTS public.check_daily_chat_limit(p_user_id uuid);
DROP FUNCTION IF EXISTS public.check_daily_audio_limit(p_user_id uuid);
DROP FUNCTION IF EXISTS public.check_and_award_achievements(user_id_param uuid);
DROP FUNCTION IF EXISTS public.can_access_verse(p_user_id uuid, p_verse_number integer);
DROP FUNCTION IF EXISTS public.can_access_payment_transaction(p_user_id uuid, p_transaction_id uuid);
DROP FUNCTION IF EXISTS public.calculate_subscription_end_date(p_subscription_type text, p_start_date timestamp with time zone);
DROP FUNCTION IF EXISTS public.calculate_level_from_xp(total_xp integer);
DROP FUNCTION IF EXISTS public.calculate_days_remaining_trigger();
DROP FUNCTION IF EXISTS public.calculate_correct_level(exp_points integer);
DROP FUNCTION IF EXISTS public.award_xp_with_daily_limit(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.award_xp(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.award_journal_xp(user_uuid uuid);
DROP FUNCTION IF EXISTS public.award_audio_xp(user_uuid uuid, is_journal boolean, minutes_listened integer);
DROP FUNCTION IF EXISTS public.auto_populate_elite_habit_email();
DROP FUNCTION IF EXISTS public.auto_expire_pro_users();
DROP FUNCTION IF EXISTS public.auto_cleanup_pro_on_update();
DROP FUNCTION IF EXISTS public.auto_activate_subscription();
DROP FUNCTION IF EXISTS public.audit_vip_changes();
DROP FUNCTION IF EXISTS public.audit_subscription_access();
DROP FUNCTION IF EXISTS public.audit_pro_changes();
DROP FUNCTION IF EXISTS public.audit_payment_changes();
DROP FUNCTION IF EXISTS public.audit_payment_access();
DROP FUNCTION IF EXISTS public.audit_chat_access();
DROP FUNCTION IF EXISTS public.admin_system_health_check();
DROP FUNCTION IF EXISTS public.add_pro_user_by_email(p_email text, p_subscription_type text, p_duration_days integer);
DROP FUNCTION IF EXISTS public.add_achievement(user_id uuid, achievement text);
DROP FUNCTION IF EXISTS public.activate_pro_subscription(p_tripay_reference text, p_payment_method text);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP EXTENSION IF EXISTS pg_graphql;
DROP EXTENSION IF EXISTS index_advisor;
DROP EXTENSION IF EXISTS hypopg;
DROP EXTENSION IF EXISTS http;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS supabase_migrations;
DROP SCHEMA IF EXISTS supabase_functions;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP EXTENSION IF EXISTS pg_net;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP EXTENSION IF EXISTS pg_cron;
DROP SCHEMA IF EXISTS auth;
--
-- TOC entry 25 (class 2615 OID 155036)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- TOC entry 2 (class 3079 OID 155037)
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- TOC entry 35 (class 2615 OID 155088)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- TOC entry 23 (class 2615 OID 155089)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- TOC entry 22 (class 2615 OID 155090)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- TOC entry 3 (class 3079 OID 155091)
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- TOC entry 19 (class 2615 OID 155133)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- TOC entry 40 (class 2615 OID 155134)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- TOC entry 24 (class 2615 OID 155135)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- TOC entry 27 (class 2615 OID 155136)
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_functions;


--
-- TOC entry 20 (class 2615 OID 155137)
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- TOC entry 18 (class 2615 OID 155138)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- TOC entry 4 (class 3079 OID 155139)
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA public;


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION http; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION http IS 'HTTP client for PostgreSQL, allows web page retrieval inside the database.';


--
-- TOC entry 5 (class 3079 OID 155173)
-- Name: hypopg; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS hypopg WITH SCHEMA extensions;


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION hypopg; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION hypopg IS 'Hypothetical indexes for PostgreSQL';


--
-- TOC entry 6 (class 3079 OID 155195)
-- Name: index_advisor; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS index_advisor WITH SCHEMA extensions;


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION index_advisor; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION index_advisor IS 'Query index advisor';


--
-- TOC entry 11 (class 3079 OID 156658)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 11
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 7 (class 3079 OID 155208)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 8 (class 3079 OID 155245)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 9 (class 3079 OID 155282)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4832 (class 0 OID 0)
-- Dependencies: 9
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 10 (class 3079 OID 155305)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4833 (class 0 OID 0)
-- Dependencies: 10
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1363 (class 1247 OID 155317)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- TOC entry 1366 (class 1247 OID 155324)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- TOC entry 1369 (class 1247 OID 155330)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- TOC entry 1372 (class 1247 OID 155336)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- TOC entry 1375 (class 1247 OID 155344)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- TOC entry 1378 (class 1247 OID 155350)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- TOC entry 1381 (class 1247 OID 155364)
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- TOC entry 1384 (class 1247 OID 155376)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- TOC entry 1387 (class 1247 OID 155393)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- TOC entry 1390 (class 1247 OID 155396)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- TOC entry 1393 (class 1247 OID 155399)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- TOC entry 1396 (class 1247 OID 155401)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- TOC entry 591 (class 1255 OID 155405)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- TOC entry 4834 (class 0 OID 0)
-- Dependencies: 591
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 662 (class 1255 OID 155406)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- TOC entry 555 (class 1255 OID 155407)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- TOC entry 4835 (class 0 OID 0)
-- Dependencies: 555
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 547 (class 1255 OID 155408)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- TOC entry 4836 (class 0 OID 0)
-- Dependencies: 547
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 677 (class 1255 OID 155409)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- TOC entry 4837 (class 0 OID 0)
-- Dependencies: 677
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 650 (class 1255 OID 155410)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- TOC entry 4838 (class 0 OID 0)
-- Dependencies: 650
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 673 (class 1255 OID 155411)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- TOC entry 4839 (class 0 OID 0)
-- Dependencies: 673
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 482 (class 1255 OID 155412)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 438 (class 1255 OID 155413)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- TOC entry 658 (class 1255 OID 155414)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- TOC entry 4840 (class 0 OID 0)
-- Dependencies: 658
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 505 (class 1255 OID 155415)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- TOC entry 558 (class 1255 OID 155416)
-- Name: activate_pro_subscription(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.activate_pro_subscription(p_tripay_reference text, p_payment_method text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  waiting_record RECORD;
  new_subscription_id UUID;
  subscription_end_date TIMESTAMPTZ;
  calculated_days INTEGER;
BEGIN
  -- Get waiting payment record
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Waiting payment not found for reference: %', p_tripay_reference;
  END IF;
  
  -- Calculate subscription end date
  subscription_end_date := public.calculate_subscription_end_date(
    waiting_record.subscription_type, 
    now()
  );
  
  -- Calculate days remaining
  calculated_days := EXTRACT(DAY FROM (subscription_end_date - now()))::INTEGER;
  
  -- Ensure days_remaining is not negative
  IF calculated_days < 0 THEN
    calculated_days := 0;
  END IF;
  
  -- Simple INSERT (back to original)
  INSERT INTO public.pro_subscriptions (
    user_id,
    user_email, 
    customer_phone,
    subscription_type,
    amount_paid,
    currency,
    status,
    tripay_reference,
    subscription_start_date,
    subscription_end_date,
    days_remaining,
    ip_address,
    verse_access,
    pro_badge,
    created_at,
    updated_at
  ) VALUES (
    waiting_record.user_id,
    waiting_record.user_email,
    waiting_record.customer_phone,
    waiting_record.subscription_type,
    waiting_record.amount_paid,
    waiting_record.currency,
    'active',
    waiting_record.tripay_reference,
    now(),
    subscription_end_date,
    calculated_days,
    waiting_record.ip_address,
    true,
    true,
    now(),
    now()
  ) RETURNING id INTO new_subscription_id;
  
  -- Remove from waiting_payment
  DELETE FROM public.waiting_payment 
  WHERE tripay_reference = p_tripay_reference;
  
  RETURN new_subscription_id;
END;
$$;


--
-- TOC entry 500 (class 1255 OID 155417)
-- Name: add_achievement(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_achievement(user_id uuid, achievement text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE profiles 
  SET achievements = array_append(achievements, achievement),
      updated_at = NOW()
  WHERE profiles.user_id = add_achievement.user_id 
  AND NOT (achievements @> ARRAY[achievement]);
END;
$$;


--
-- TOC entry 585 (class 1255 OID 155418)
-- Name: add_pro_user_by_email(text, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_pro_user_by_email(p_email text, p_subscription_type text DEFAULT 'monthly'::text, p_duration_days integer DEFAULT 30) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 412 (class 1255 OID 155419)
-- Name: admin_system_health_check(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_system_health_check() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 518 (class 1255 OID 155420)
-- Name: audit_chat_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_chat_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 511 (class 1255 OID 155421)
-- Name: audit_payment_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_payment_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 668 (class 1255 OID 155422)
-- Name: audit_payment_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_payment_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 701 (class 1255 OID 155423)
-- Name: audit_pro_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_pro_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 631 (class 1255 OID 155424)
-- Name: audit_subscription_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_subscription_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 535 (class 1255 OID 155425)
-- Name: audit_vip_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_vip_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 667 (class 1255 OID 155426)
-- Name: auto_activate_subscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_activate_subscription() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 669 (class 1255 OID 155427)
-- Name: auto_cleanup_pro_on_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_cleanup_pro_on_update() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 617 (class 1255 OID 155428)
-- Name: auto_expire_pro_users(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_expire_pro_users() RETURNS integer
    LANGUAGE plpgsql
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


--
-- TOC entry 498 (class 1255 OID 155429)
-- Name: auto_populate_elite_habit_email(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_populate_elite_habit_email() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 554 (class 1255 OID 155430)
-- Name: award_audio_xp(uuid, boolean, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_audio_xp(user_uuid uuid, is_journal boolean DEFAULT false, minutes_listened integer DEFAULT 0) RETURNS integer
    LANGUAGE plpgsql
    AS $$
  DECLARE
      daily_total INTEGER;
  BEGIN
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total
      FROM xp_transactions
      WHERE user_id = user_uuid
      AND transaction_type = 'audio_completion'
      AND created_at >= CURRENT_DATE;

      IF daily_total >= 20 THEN RETURN 0; END IF;
      IF is_journal AND minutes_listened < 60 THEN RETURN 0; END IF;

      INSERT INTO xp_transactions (user_id, xp_amount, transaction_type,
  reason)
      VALUES (user_uuid, 10, 'audio_completion', 'Audio completed');

      IF is_journal THEN
          UPDATE profiles SET
              total_journal_sessions = total_journal_sessions + 1,
              last_activity_date = CURRENT_DATE
          WHERE user_id = user_uuid;
      ELSE
          UPDATE profiles SET
              total_verses_completed = total_verses_completed + 1,
              last_activity_date = CURRENT_DATE
          WHERE user_id = user_uuid;

          UPDATE profiles SET is_zen_master = TRUE
          WHERE user_id = user_uuid AND total_verses_completed >= 100;
      END IF;

      PERFORM update_streak(user_uuid);
      RETURN 10;
  END;
  $$;


--
-- TOC entry 512 (class 1255 OID 155431)
-- Name: award_journal_xp(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_journal_xp(user_uuid uuid) RETURNS integer
    LANGUAGE plpgsql
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


--
-- TOC entry 454 (class 1255 OID 155432)
-- Name: award_xp(uuid, integer, text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_xp(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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
    INSERT INTO public.profiles (user_id, level, experience_points, total_verses, total_journal, total_elite_habit, analytics_used)
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
        WHEN p_activity_type IN ('verse_completion', 'audio_completion') THEN COALESCE(total_verses, 0) + 1
        ELSE COALESCE(total_verses, 0)
      END,
      total_journal = CASE
        WHEN p_activity_type = 'journal_completion' THEN COALESCE(total_journal, 0) + 1
        ELSE COALESCE(total_journal, 0)
      END,
      total_elite_habit = CASE
        WHEN p_activity_type = 'elite_habit_completion' THEN COALESCE(total_elite_habit, 0) + 1
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
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);

  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, actual_xp_to_award, p_activity_type, COALESCE(p_reason, 'XP awarded'));

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
$$;


--
-- TOC entry 637 (class 1255 OID 155435)
-- Name: award_xp_with_daily_limit(uuid, integer, text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.award_xp_with_daily_limit(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 613 (class 1255 OID 155436)
-- Name: calculate_correct_level(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_correct_level(exp_points integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF exp_points < 150 THEN
    RETURN 1;
  ELSIF exp_points < 1500 THEN
    RETURN 2;
  ELSIF exp_points < 3000 THEN
    RETURN 3;
  ELSIF exp_points < 5000 THEN
    RETURN 4;
  ELSE
    RETURN 5;
  END IF;
END;
$$;


--
-- TOC entry 571 (class 1255 OID 155437)
-- Name: calculate_days_remaining_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_days_remaining_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Calculate days remaining from subscription_end_date (source of truth)
  IF NEW.subscription_end_date IS NOT NULL THEN
    NEW.days_remaining = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER);
  ELSE
    NEW.days_remaining = 0;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- TOC entry 600 (class 1255 OID 155438)
-- Name: calculate_level_from_xp(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_level_from_xp(total_xp integer) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- TOC entry 501 (class 1255 OID 155439)
-- Name: calculate_subscription_end_date(text, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_subscription_end_date(p_subscription_type text, p_start_date timestamp with time zone) RETURNS timestamp with time zone
    LANGUAGE plpgsql
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


--
-- TOC entry 577 (class 1255 OID 155440)
-- Name: can_access_payment_transaction(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_access_payment_transaction(p_user_id uuid, p_transaction_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 609 (class 1255 OID 155441)
-- Name: can_access_verse(uuid, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_access_verse(p_user_id uuid, p_verse_number integer) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 556 (class 1255 OID 155442)
-- Name: check_and_award_achievements(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_and_award_achievements(user_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 620 (class 1255 OID 155443)
-- Name: check_daily_audio_limit(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_daily_audio_limit(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- TOC entry 477 (class 1255 OID 155444)
-- Name: check_daily_chat_limit(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_daily_chat_limit(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- TOC entry 538 (class 1255 OID 155445)
-- Name: check_daily_journal_limit(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_daily_journal_limit(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- TOC entry 546 (class 1255 OID 155446)
-- Name: check_journal_spam_limits(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_journal_spam_limits(p_user_id uuid, journal_text text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 603 (class 1255 OID 155447)
-- Name: check_rate_limit(uuid, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_rate_limit(p_user_id uuid, p_action text, p_max_attempts integer DEFAULT 10, p_window_minutes integer DEFAULT 60) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 691 (class 1255 OID 155448)
-- Name: check_sensitive_data_rate_limit(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_sensitive_data_rate_limit(p_user_id uuid, p_table_name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Always allow - remove rate limiting for now
  RETURN true;
END;
$$;


--
-- TOC entry 510 (class 1255 OID 155449)
-- Name: check_unified_pro_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_unified_pro_status(p_user_id uuid) RETURNS TABLE(is_pro boolean, subscription_type text, status text, expires_at timestamp with time zone, days_remaining integer, verse_access boolean, pro_badge boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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
    ps.days_remaining,
    COALESCE(ps.verse_access, true) as verse_access,
    COALESCE(ps.pro_badge, true) as pro_badge
  FROM public.pro_subscriptions ps
  WHERE ps.user_id = p_user_id
  ORDER BY ps.created_at DESC
  LIMIT 1;
END;
$$;


--
-- TOC entry 595 (class 1255 OID 155450)
-- Name: check_user_notification_shown(uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_user_notification_shown(p_user_id uuid, p_notification_type character varying) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 484 (class 1255 OID 155451)
-- Name: check_weekly_challenge_bonus(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_weekly_challenge_bonus(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
    current_streak INTEGER := 0;
    last_date DATE;
    bonus_awarded BOOLEAN := FALSE;
BEGIN
    -- Get current streak and last streak date
    SELECT weekly_streak, last_streak_date
    INTO current_streak, last_date
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    -- If user hit 35 XP today and yesterday was also 35 XP (consecutive)
    IF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
        current_streak := current_streak + 1;
    ELSIF last_date = CURRENT_DATE THEN
        -- Same day, don't increment
        current_streak := current_streak;
    ELSE
        -- Streak broken, reset to 1
        current_streak := 1;
    END IF;
    
    -- Check if completed 7-day challenge
    IF current_streak >= 7 THEN
        -- Award 50 bonus XP
        UPDATE public.profiles
        SET experience_points = experience_points + 50,
            weekly_streak = 0, -- Reset streak after bonus
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
        -- Update streak
        UPDATE public.profiles
        SET weekly_streak = current_streak,
            last_streak_date = CURRENT_DATE
        WHERE user_id = p_user_id;
    END IF;
    
    RETURN bonus_awarded;
END;
$$;


--
-- TOC entry 475 (class 1255 OID 155452)
-- Name: cleanup_chat_message_user_names(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_chat_message_user_names() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 465 (class 1255 OID 155453)
-- Name: cleanup_expired_admin_roles(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_admin_roles() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 568 (class 1255 OID 155454)
-- Name: cleanup_expired_pro_subscriptions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_pro_subscriptions() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 492 (class 1255 OID 155455)
-- Name: cleanup_expired_waiting_payments(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_waiting_payments() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Delete waiting payments older than 24 hours
  DELETE FROM public.waiting_payment 
  WHERE expires_at < now();
END;
$$;


--
-- TOC entry 580 (class 1255 OID 155456)
-- Name: cleanup_offline_users(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_offline_users() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.online_users 
    WHERE last_seen < NOW() - INTERVAL '5 minutes';
END;
$$;


--
-- TOC entry 540 (class 1255 OID 155457)
-- Name: cleanup_user_display_names(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_user_display_names() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 468 (class 1255 OID 155458)
-- Name: cleanup_waiting_payment_24h(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_waiting_payment_24h() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM public.waiting_payment
  WHERE created_at < (NOW() - INTERVAL '24 hours');

  RAISE NOTICE 'Cleaned up waiting_payment records older than 24 hours at %', NOW();
END;
$$;


--
-- TOC entry 570 (class 1255 OID 155459)
-- Name: confirm_payment_make_pro(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.confirm_payment_make_pro(p_tripay_reference text, p_subscription_type text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 648 (class 1255 OID 155460)
-- Name: create_chat_message(text, text, boolean, uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_chat_message(p_message text, p_channel_id text DEFAULT 'community'::text, p_is_private boolean DEFAULT false, p_allowed_users uuid[] DEFAULT NULL::uuid[]) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 537 (class 1255 OID 155461)
-- Name: create_missing_profiles(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_missing_profiles() RETURNS void
    LANGUAGE plpgsql
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


--
-- TOC entry 549 (class 1255 OID 155462)
-- Name: create_payment_with_validation(uuid, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_payment_with_validation(p_user_id uuid, p_subscription_type text, p_payment_method text, p_user_phone text, p_user_full_name text, p_user_email text, p_tripay_reference text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 523 (class 1255 OID 155463)
-- Name: create_pending_payment(uuid, text, text, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_pending_payment(p_user_id uuid, p_email text, p_tripay_reference text, p_amount integer) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 628 (class 1255 OID 155464)
-- Name: daily_sync_days_remaining(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.daily_sync_days_remaining() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  sync_count INTEGER;
BEGIN
  -- Sync all active subscriptions daily
  SELECT public.sync_all_days_remaining() INTO sync_count;
  
  -- Also expire subscriptions that have passed their end date
  PERFORM public.expire_subscriptions();
  
  -- Log the sync (optional)
  RAISE NOTICE 'Daily sync completed. Updated % subscription records.', sync_count;
  
  RETURN sync_count;
END;
$$;


--
-- TOC entry 429 (class 1255 OID 155465)
-- Name: decrypt_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrypt_email(p_encrypted_email text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 587 (class 1255 OID 155466)
-- Name: emergency_revoke_admin_role(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.emergency_revoke_admin_role(p_target_user_id uuid, p_reason text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 705 (class 1255 OID 155467)
-- Name: encrypt_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.encrypt_email(p_email text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Simple obfuscation for now - can be enhanced with pgcrypto
  RETURN 'ENC:' || encode(p_email::bytea, 'base64');
END;
$$;


--
-- TOC entry 607 (class 1255 OID 155468)
-- Name: encrypt_payment_field(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.encrypt_payment_field(p_data text, p_field_type text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 486 (class 1255 OID 155469)
-- Name: enhanced_admin_role_access_log(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enhanced_admin_role_access_log() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 652 (class 1255 OID 155470)
-- Name: enhanced_admin_role_audit(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enhanced_admin_role_audit() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 434 (class 1255 OID 155471)
-- Name: enhanced_payment_access_control(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enhanced_payment_access_control(p_user_id uuid, p_transaction_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 692 (class 1255 OID 155472)
-- Name: ensure_payment_tracking(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.ensure_payment_tracking() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 639 (class 1255 OID 155473)
-- Name: expire_subscriptions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.expire_subscriptions() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Auto-expire subscriptions based on subscription_end_date
  UPDATE public.pro_subscriptions
  SET status = 'expired'
  WHERE subscription_end_date < now() 
    AND status = 'active';
END;
$$;


--
-- TOC entry 456 (class 1255 OID 155474)
-- Name: fix_user_levels(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fix_user_levels() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 533 (class 1255 OID 155475)
-- Name: force_global_cache_refresh(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.force_global_cache_refresh() RETURNS void
    LANGUAGE plpgsql
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


--
-- TOC entry 649 (class 1255 OID 155476)
-- Name: get_auth_request_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_auth_request_stats() RETURNS TABLE(component_name text, request_count bigint, unique_users bigint, last_request timestamp without time zone)
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 640 (class 1255 OID 156823)
-- Name: get_current_user_fast(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_user_fast() RETURNS TABLE(user_id uuid, display_name text, level integer, is_pro boolean)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
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


--
-- TOC entry 604 (class 1255 OID 155477)
-- Name: get_daily_xp_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_daily_xp_status(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 651 (class 1255 OID 155478)
-- Name: get_level_from_xp(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_level_from_xp(xp_amount integer) RETURNS integer
    LANGUAGE plpgsql
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


--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 651
-- Name: FUNCTION get_level_from_xp(xp_amount integer); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_level_from_xp(xp_amount integer) IS 'Calculates correct level based on total XP amount';


--
-- TOC entry 611 (class 1255 OID 155479)
-- Name: get_masked_payment_transaction(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_masked_payment_transaction(p_transaction_id uuid) RETURNS TABLE(id uuid, tripay_reference text, payment_method text, masked_amount text, currency text, status text, created_at timestamp with time zone, paid_at timestamp with time zone, expires_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 421 (class 1255 OID 155480)
-- Name: get_payment_access_summary(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_payment_access_summary() RETURNS TABLE(user_id uuid, access_count bigint, last_access timestamp with time zone, suspicious_activity boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 707 (class 1255 OID 155481)
-- Name: get_remaining_daily_xp(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_remaining_daily_xp(p_user_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 575 (class 1255 OID 155482)
-- Name: get_secure_payment_transaction(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_secure_payment_transaction(p_transaction_id uuid) RETURNS TABLE(id uuid, user_id uuid, tripay_reference text, payment_method text, masked_amount text, currency text, status text, created_at timestamp with time zone, updated_at timestamp with time zone, paid_at timestamp with time zone, expires_at timestamp with time zone, security_metadata jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 596 (class 1255 OID 155483)
-- Name: get_user_email_safe(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_email_safe(p_user_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 428 (class 1255 OID 155484)
-- Name: get_user_email_secure(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_email_secure(p_user_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 581 (class 1255 OID 155485)
-- Name: get_user_payment_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_payment_status(p_user_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 444 (class 1255 OID 155486)
-- Name: get_user_payment_transactions(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_payment_transactions(p_limit integer DEFAULT 10) RETURNS TABLE(id uuid, tripay_reference text, payment_method text, masked_amount text, currency text, status text, created_at timestamp with time zone, paid_at timestamp with time zone, expires_at timestamp with time zone)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 576 (class 1255 OID 155487)
-- Name: get_xp_for_next_level(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_xp_for_next_level(current_level integer) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- TOC entry 450 (class 1255 OID 155488)
-- Name: get_xp_thresholds(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_xp_thresholds() RETURNS jsonb
    LANGUAGE plpgsql
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


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 450
-- Name: FUNCTION get_xp_thresholds(); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_xp_thresholds() IS 'Returns XP threshold data for frontend display';


--
-- TOC entry 431 (class 1255 OID 155489)
-- Name: grant_admin_role(uuid, text, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.grant_admin_role(p_target_user_id uuid, p_role text, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 590 (class 1255 OID 155490)
-- Name: grant_pro_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.grant_pro_status(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 589 (class 1255 OID 155491)
-- Name: handle_daily_login(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_daily_login(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  user_profile RECORD;
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
  current_timestamp TIMESTAMP WITH TIME ZONE := now();
  new_streak INTEGER := 0;
  xp_awarded INTEGER := 0;
  streak_bonus_awarded BOOLEAN := false;
  should_notify BOOLEAN := false;
  result jsonb;
BEGIN
  -- Get current user profile
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = p_user_id;
  
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
  
  -- Determine new streak
  IF user_profile.last_login_date = yesterday_date THEN
    -- Consecutive login, increment streak
    new_streak := user_profile.streak_days + 1;
  ELSIF user_profile.last_login_date IS NULL OR user_profile.last_login_date < yesterday_date THEN
    -- First login or missed days, reset streak
    new_streak := 1;
  ELSE
    -- This shouldn't happen, but handle it
    new_streak := 1;
  END IF;
  
  -- Only process if this is actually a new login (not already processed today)
  IF user_profile.last_login_date != today_date THEN
    should_notify := true;
    
    -- Check for 7-day streak bonus
    IF new_streak >= 7 AND (new_streak % 7 = 0) THEN
      -- Award streak bonus (only once per 7-day cycle)
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
          jsonb_build_object('streak_days', new_streak, 'bonus_date', today_date)
        );
      END IF;
    END IF;
    
    -- Update profile with new streak, login date, and notification time
    UPDATE public.profiles
    SET 
      streak_days = new_streak,
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
    'streak_days', new_streak,
    'xp_awarded', xp_awarded,
    'streak_bonus_awarded', streak_bonus_awarded,
    'should_notify', should_notify,
    'message', CASE 
      WHEN NOT should_notify THEN 'Already logged in today'
      WHEN streak_bonus_awarded THEN 'Weekly streak bonus earned!'
      WHEN new_streak = 1 THEN 'Login streak started!'
      ELSE 'Login streak continued!'
    END
  );
  
  RETURN result;
END;
$$;


--
-- TOC entry 642 (class 1255 OID 155492)
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 452 (class 1255 OID 155493)
-- Name: handle_new_user_trial(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_trial() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  BEGIN
    -- No more automatic trials - users must pay for Pro
    RETURN NEW;
  END;
  $$;


--
-- TOC entry 563 (class 1255 OID 155494)
-- Name: handle_subscription_upgrade(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_subscription_upgrade() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 597 (class 1255 OID 155495)
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


--
-- TOC entry 616 (class 1255 OID 155496)
-- Name: handle_xp_transaction_trigger(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_xp_transaction_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Handle verse completion (audio completion)
  IF NEW.activity_type = 'audio_completion' THEN
    PERFORM increment_total_verses(NEW.user_id);
  END IF;
  
  -- Handle journal completion 
  IF NEW.activity_type IN ('journal_completion', 'journal_spiritual') THEN
    PERFORM increment_total_journal(NEW.user_id, NEW.activity_type);
  END IF;
  
  -- Update streak and check achievements after any XP transaction
  PERFORM update_user_streak(NEW.user_id);
  PERFORM check_and_award_achievements(NEW.user_id);
  
  RETURN NEW;
END;
$$;


--
-- TOC entry 645 (class 1255 OID 155497)
-- Name: has_pro_achievement(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_pro_achievement(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = p_user_id 
    AND 'pro' = ANY(achievements)
  );
END;
$$;


--
-- TOC entry 602 (class 1255 OID 155498)
-- Name: increment_total_journal(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_total_journal(user_id_param uuid, source_type text DEFAULT 'journal_entry'::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE profiles 
  SET total_journal = COALESCE(total_journal, 0) + 1
  WHERE user_id = user_id_param;
  
  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (user_id_param, 'journal_completion', jsonb_build_object('source', source_type));
END;
$$;


--
-- TOC entry 548 (class 1255 OID 155499)
-- Name: increment_total_verses(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_total_verses(user_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE profiles 
  SET total_verses = COALESCE(total_verses, 0) + 1
  WHERE user_id = user_id_param;
  
  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (user_id_param, 'verse_completion', '{"source": "audio_completion"}'::jsonb);
END;
$$;


--
-- TOC entry 451 (class 1255 OID 155500)
-- Name: is_super_admin_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_super_admin_user() RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 561 (class 1255 OID 155501)
-- Name: is_verified_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_verified_admin(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 681 (class 1255 OID 155502)
-- Name: log_auth_request(uuid, text, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_auth_request(p_user_id uuid DEFAULT NULL::uuid, p_request_type text DEFAULT 'getUser'::text, p_user_agent text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_component_name text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO auth_request_logs (user_id, request_type, user_agent, ip_address, component_name)
  VALUES (p_user_id, p_request_type, p_user_agent, p_ip_address::inet, p_component_name);
END;
$$;


--
-- TOC entry 641 (class 1255 OID 155503)
-- Name: log_data_access(text, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_data_access(p_table_name text, p_operation text, p_record_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 557 (class 1255 OID 155504)
-- Name: log_sensitive_action(text, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_sensitive_action(p_action text, p_table_name text DEFAULT NULL::text, p_record_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 528 (class 1255 OID 155505)
-- Name: mark_notification_type_shown(uuid, character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.mark_notification_type_shown(p_user_id uuid, p_notification_type character varying) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 442 (class 1255 OID 155506)
-- Name: mask_sensitive_payment_data(text, numeric, jsonb, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.mask_sensitive_payment_data(p_bank_account text, p_amount numeric, p_payment_instructions jsonb, p_callback_data jsonb, p_moota_webhook_data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 619 (class 1255 OID 155507)
-- Name: monitor_sensitive_data_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.monitor_sensitive_data_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 690 (class 1255 OID 155508)
-- Name: populate_elite_habit_email(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.populate_elite_habit_email() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 457 (class 1255 OID 155509)
-- Name: prevent_unauthorized_pro(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_unauthorized_pro() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 635 (class 1255 OID 155510)
-- Name: process_tripay_payment_callback(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_tripay_payment_callback(p_tripay_reference text, p_payment_status text) RETURNS json
    LANGUAGE plpgsql
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


--
-- TOC entry 687 (class 1255 OID 155511)
-- Name: process_tripay_payment_callback(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.process_tripay_payment_callback(p_tripay_reference text, p_payment_status text, p_payment_method text DEFAULT NULL::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  waiting_record RECORD;
  new_subscription_id UUID;
  result JSON;
BEGIN
  -- Find the waiting payment
  SELECT * INTO waiting_record
  FROM public.waiting_payment
  WHERE tripay_reference = p_tripay_reference;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Payment record not found',
      'reference', p_tripay_reference
    );
  END IF;
  
  -- If payment successful, activate subscription
  IF p_payment_status = 'PAID' THEN
    -- Move to pro_subscriptions (user gets pro access)
    new_subscription_id := public.activate_pro_subscription(
      p_tripay_reference, 
      p_payment_method
    );
    
    result := json_build_object(
      'success', true,
      'action', 'subscription_activated',
      'subscription_id', new_subscription_id,
      'user_id', waiting_record.user_id
    );
    
  ELSE
    -- Payment failed or cancelled, keep waiting_payment for potential retry
    result := json_build_object(
      'success', false,
      'action', 'payment_failed',
      'status', p_payment_status,
      'waiting_payment_id', waiting_record.id
    );
  END IF;
  
  RETURN result;
END;
$$;


--
-- TOC entry 439 (class 1255 OID 155512)
-- Name: refresh_all_days_remaining(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.refresh_all_days_remaining() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update all active subscriptions days_remaining
    UPDATE public.pro_subscriptions 
    SET days_remaining = CASE
        WHEN subscription_end_date IS NOT NULL THEN
            GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER)
        ELSE 0
    END
    WHERE status = 'active';
    
    -- Expire subscriptions with 0 days remaining
    UPDATE public.pro_subscriptions 
    SET status = 'expired'
    WHERE status = 'active' 
    AND subscription_end_date IS NOT NULL 
    AND subscription_end_date < NOW();
    
    RAISE NOTICE 'Refreshed days_remaining for all active subscriptions';
END;
$$;


--
-- TOC entry 659 (class 1255 OID 155513)
-- Name: revoke_admin_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.revoke_admin_role(p_target_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 525 (class 1255 OID 155514)
-- Name: revoke_pro_status(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.revoke_pro_status(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Remove 'pro' from achievements array
  UPDATE public.profiles 
  SET achievements = array_remove(achievements, 'pro'),
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;


--
-- TOC entry 497 (class 1255 OID 155515)
-- Name: secure_admin_role_grant(uuid, text, timestamp with time zone, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.secure_admin_role_grant(p_target_user_id uuid, p_role text, p_expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone, p_justification text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 653 (class 1255 OID 155516)
-- Name: send_chat_message(text, text, boolean, uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_chat_message(p_message text, p_channel_id text DEFAULT 'general'::text, p_is_private boolean DEFAULT false, p_allowed_users uuid[] DEFAULT NULL::uuid[]) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 586 (class 1255 OID 155517)
-- Name: send_order_to_vps(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.send_order_to_vps() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 508 (class 1255 OID 155518)
-- Name: set_message_subscription_type(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_message_subscription_type() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 550 (class 1255 OID 155519)
-- Name: set_user_id_from_email(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_user_id_from_email() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 479 (class 1255 OID 155520)
-- Name: set_user_id_from_subscription(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_user_id_from_subscription() RETURNS trigger
    LANGUAGE plpgsql
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


--
-- TOC entry 627 (class 1255 OID 155521)
-- Name: sync_all_days_remaining(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_all_days_remaining() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.pro_subscriptions 
  SET days_remaining = CASE
    WHEN subscription_end_date IS NOT NULL THEN
      GREATEST(0, EXTRACT(DAY FROM (subscription_end_date - CURRENT_TIMESTAMP))::INTEGER)
    ELSE 0
  END;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;


--
-- TOC entry 422 (class 1255 OID 155522)
-- Name: sync_all_days_remaining_table(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_all_days_remaining_table() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  updated_count INTEGER;
  sub_record RECORD;
BEGIN
  -- Clear existing data
  DELETE FROM public.days_remaining;
  
  -- Insert all current subscription data (no trial columns)
  FOR sub_record IN 
    SELECT 
      ps.id,
      ps.user_id,
      COALESCE(ps.user_email, au.email) as email,
      ps.subscription_type,
      ps.subscription_start_date,
      ps.subscription_end_date,
      ps.status,
      ps.created_at,
      GREATEST(0, EXTRACT(DAY FROM (ps.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER) as calculated_days
    FROM public.pro_subscriptions ps
    LEFT JOIN auth.users au ON ps.user_id = au.id
    WHERE ps.user_id IS NOT NULL
  LOOP
    INSERT INTO public.days_remaining (
      user_id,
      email,
      subscription_id,
      subscription_type,
      days_remaining,
      subscription_start_date,
      subscription_end_date,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      sub_record.user_id,
      sub_record.email,
      sub_record.id,
      sub_record.subscription_type,
      sub_record.calculated_days,
      sub_record.subscription_start_date,
      sub_record.subscription_end_date,
      (sub_record.status = 'active' AND sub_record.subscription_end_date > now()),
      sub_record.created_at,
      now()
    );
  END LOOP;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;


--
-- TOC entry 426 (class 1255 OID 155523)
-- Name: sync_days_remaining_table(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_days_remaining_table() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  user_email TEXT;
  calculated_days INTEGER := 0;
BEGIN
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.days_remaining WHERE subscription_id = OLD.id;
    RETURN OLD;
  END IF;

  -- Get user email (prefer from pro_subscriptions, fallback to auth.users)
  user_email := COALESCE(NEW.user_email, (SELECT email FROM auth.users WHERE id = NEW.user_id));

  -- Calculate days remaining from subscription_end_date (source of truth)
  IF NEW.subscription_end_date IS NOT NULL THEN
    calculated_days = GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - CURRENT_TIMESTAMP))::INTEGER);
  END IF;

  -- Upsert to days_remaining table (no trial columns)
  INSERT INTO public.days_remaining (
    user_id,
    email,
    subscription_id,
    subscription_type,
    days_remaining,
    subscription_start_date,
    subscription_end_date,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.user_id,
    user_email,
    NEW.id,
    NEW.subscription_type,
    calculated_days,
    NEW.subscription_start_date,
    NEW.subscription_end_date,
    (NEW.status = 'active' AND NEW.subscription_end_date > now()),
    NEW.created_at,
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    subscription_id = EXCLUDED.subscription_id,
    subscription_type = EXCLUDED.subscription_type,
    days_remaining = EXCLUDED.days_remaining,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  RETURN NEW;
END;
$$;


--
-- TOC entry 473 (class 1255 OID 155524)
-- Name: sync_elite_habit_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_elite_habit_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the profiles table with the new count for the affected user
    UPDATE public.profiles
    SET total_elite_habit = (
        SELECT COUNT(*)
        FROM public.elite_habits
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- TOC entry 633 (class 1255 OID 155525)
-- Name: sync_pro_status_from_subscription(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Do nothing, sync is not needed
  RETURN true;
END;
$$;


--
-- TOC entry 678 (class 1255 OID 155526)
-- Name: track_user_presence(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.track_user_presence(p_email text DEFAULT NULL::text, p_display_name text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    PERFORM update_user_online_status(auth.uid(), p_email, p_display_name);
END;
$$;


--
-- TOC entry 494 (class 1255 OID 155527)
-- Name: trigger_cleanup_waiting_payment(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_cleanup_waiting_payment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.waiting_payment) % 10 = 0 THEN
    PERFORM cleanup_waiting_payment_24h();
  END IF;

  RETURN NEW;
END;
$$;


--
-- TOC entry 559 (class 1255 OID 155528)
-- Name: update_days_remaining(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_days_remaining() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Calculate days remaining based on subscription_end_date
    IF NEW.subscription_end_date IS NOT NULL THEN
        NEW.days_remaining := GREATEST(0, EXTRACT(DAY FROM (NEW.subscription_end_date - NOW()))::INTEGER);
    ELSE
        NEW.days_remaining := 0;
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- TOC entry 702 (class 1255 OID 155529)
-- Name: update_journal_tracking(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_journal_tracking(p_user_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 542 (class 1255 OID 155530)
-- Name: update_streak(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_streak(user_uuid uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
  DECLARE
      last_date DATE;
      current_streak INTEGER;
  BEGIN
      SELECT last_activity_date, streak_days INTO last_date, current_streak
      FROM profiles WHERE user_id = user_uuid;

      IF last_date = CURRENT_DATE THEN
          -- Same day, no streak change
          RETURN;
      ELSIF last_date = CURRENT_DATE - 1 THEN
          -- Consecutive day, increment streak
          UPDATE profiles SET streak_days = streak_days + 1
          WHERE user_id = user_uuid;
          current_streak := current_streak + 1;
      ELSE
          -- Gap in days, reset streak to 1
          UPDATE profiles SET streak_days = 1
          WHERE user_id = user_uuid;
          current_streak := 1;
      END IF;

      -- Check Week Warrior (7 day streak)
      IF current_streak >= 7 THEN
          UPDATE profiles SET is_week_warrior = TRUE
          WHERE user_id = user_uuid;
      END IF;
  END;
  $$;


--
-- TOC entry 599 (class 1255 OID 155531)
-- Name: update_subscription_status_manually(uuid, text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_subscription_status_manually(p_subscription_id uuid, p_status text, p_subscription_type text, p_duration_type text DEFAULT 'monthly'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 463 (class 1255 OID 155532)
-- Name: update_total_journal_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_total_journal_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = NEW.user_id
    )
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$;


--
-- TOC entry 471 (class 1255 OID 155533)
-- Name: update_total_journal_count_delete(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_total_journal_count_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = OLD.user_id
    )
    WHERE user_id = OLD.user_id;

    RETURN OLD;
END;
$$;


--
-- TOC entry 443 (class 1255 OID 155534)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 418 (class 1255 OID 155535)
-- Name: update_user_online_status(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_online_status(p_user_id uuid, p_email text DEFAULT NULL::text, p_display_name text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- TOC entry 671 (class 1255 OID 155536)
-- Name: update_user_streak(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_streak(user_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  current_streak INTEGER := 0;
  consecutive_days INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
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
  
  -- Update streak in profile
  UPDATE profiles 
  SET streak_days = consecutive_days
  WHERE user_id = user_id_param;
  
END;
$$;


--
-- TOC entry 654 (class 1255 OID 155537)
-- Name: validate_admin_role_operation(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_admin_role_operation(p_target_user_id uuid, p_role text, p_operation text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 592 (class 1255 OID 155538)
-- Name: validate_journal_entry(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_journal_entry(journal_text text) RETURNS boolean
    LANGUAGE plpgsql
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


--
-- TOC entry 543 (class 1255 OID 155539)
-- Name: validate_payment_access(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_payment_access(p_user_id uuid, p_transaction_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 636 (class 1255 OID 155540)
-- Name: validate_payment_transaction_access(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_payment_transaction_access(p_transaction_id uuid, p_access_type text DEFAULT 'read'::text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 696 (class 1255 OID 155541)
-- Name: verify_admin_with_failsafe(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.verify_admin_with_failsafe(p_user_id uuid, p_required_role text DEFAULT 'admin'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- TOC entry 699 (class 1255 OID 155542)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- TOC entry 694 (class 1255 OID 155544)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- TOC entry 532 (class 1255 OID 155545)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- TOC entry 615 (class 1255 OID 155546)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- TOC entry 427 (class 1255 OID 155547)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- TOC entry 474 (class 1255 OID 155548)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- TOC entry 685 (class 1255 OID 155549)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- TOC entry 688 (class 1255 OID 155550)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- TOC entry 605 (class 1255 OID 155551)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- TOC entry 425 (class 1255 OID 155552)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- TOC entry 573 (class 1255 OID 155553)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- TOC entry 647 (class 1255 OID 155554)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- TOC entry 598 (class 1255 OID 155555)
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- TOC entry 612 (class 1255 OID 155556)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- TOC entry 572 (class 1255 OID 159469)
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
            SELECT bucket_id,
                   name,
                   storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
            SELECT p.bucket_id, p.name, p.level
            FROM storage.prefixes AS p
            JOIN uniq AS u
              ON u.bucket_id = p.bucket_id
                  AND u.name = p.name
                  AND u.level = p.level
            WHERE NOT EXISTS (
                SELECT 1
                FROM storage.objects AS o
                WHERE o.bucket_id = p.bucket_id
                  AND storage.get_level(o.name) = p.level + 1
                  AND o.name COLLATE "C" LIKE p.name || '/%'
            )
            AND NOT EXISTS (
                SELECT 1
                FROM storage.prefixes AS c
                WHERE c.bucket_id = p.bucket_id
                  AND c.level = p.level + 1
                  AND c.name COLLATE "C" LIKE p.name || '/%'
            )
        )
        DELETE FROM storage.prefixes AS p
        USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- TOC entry 665 (class 1255 OID 155557)
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- TOC entry 544 (class 1255 OID 155558)
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- TOC entry 551 (class 1255 OID 155559)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- TOC entry 593 (class 1255 OID 155560)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- TOC entry 461 (class 1255 OID 155561)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- TOC entry 545 (class 1255 OID 155562)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- TOC entry 680 (class 1255 OID 155563)
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- TOC entry 491 (class 1255 OID 155564)
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- TOC entry 499 (class 1255 OID 155565)
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- TOC entry 509 (class 1255 OID 155566)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- TOC entry 493 (class 1255 OID 155567)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- TOC entry 657 (class 1255 OID 155568)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- TOC entry 679 (class 1255 OID 159468)
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- TOC entry 415 (class 1255 OID 159470)
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 462 (class 1255 OID 155569)
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 423 (class 1255 OID 159471)
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- TOC entry 646 (class 1255 OID 155570)
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- TOC entry 478 (class 1255 OID 155571)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- TOC entry 606 (class 1255 OID 159472)
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- TOC entry 530 (class 1255 OID 155572)
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- TOC entry 483 (class 1255 OID 155573)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- TOC entry 449 (class 1255 OID 155574)
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 698 (class 1255 OID 155575)
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- TOC entry 565 (class 1255 OID 159467)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- TOC entry 574 (class 1255 OID 155577)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- TOC entry 706 (class 1255 OID 155578)
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: -
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
    DECLARE
      request_id bigint;
      payload jsonb;
      url text := TG_ARGV[0]::text;
      method text := TG_ARGV[1]::text;
      headers jsonb DEFAULT '{}'::jsonb;
      params jsonb DEFAULT '{}'::jsonb;
      timeout_ms integer DEFAULT 1000;
    BEGIN
      IF url IS NULL OR url = 'null' THEN
        RAISE EXCEPTION 'url argument is missing';
      END IF;

      IF method IS NULL OR method = 'null' THEN
        RAISE EXCEPTION 'method argument is missing';
      END IF;

      IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
        headers = '{"Content-Type": "application/json"}'::jsonb;
      ELSE
        headers = TG_ARGV[2]::jsonb;
      END IF;

      IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
        params = '{}'::jsonb;
      ELSE
        params = TG_ARGV[3]::jsonb;
      END IF;

      IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
        timeout_ms = 1000;
      ELSE
        timeout_ms = TG_ARGV[4]::integer;
      END IF;

      CASE
        WHEN method = 'GET' THEN
          SELECT http_get INTO request_id FROM net.http_get(
            url,
            params,
            headers,
            timeout_ms
          );
        WHEN method = 'POST' THEN
          payload = jsonb_build_object(
            'old_record', OLD,
            'record', NEW,
            'type', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
          );

          SELECT http_post INTO request_id FROM net.http_post(
            url,
            payload,
            params,
            headers,
            timeout_ms
          );
        ELSE
          RAISE EXCEPTION 'method argument % is invalid', method;
      END CASE;

      INSERT INTO supabase_functions.hooks
        (hook_table_id, hook_name, request_id)
      VALUES
        (TG_RELID, TG_NAME, request_id);

      RETURN NEW;
    END
  $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 342 (class 1259 OID 155579)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 4843 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 343 (class 1259 OID 155585)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- TOC entry 4844 (class 0 OID 0)
-- Dependencies: 343
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- TOC entry 344 (class 1259 OID 155590)
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 4845 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4846 (class 0 OID 0)
-- Dependencies: 344
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 345 (class 1259 OID 155597)
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 345
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 346 (class 1259 OID 155602)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 347 (class 1259 OID 155607)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 347
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 348 (class 1259 OID 155612)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 348
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 349 (class 1259 OID 155617)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_id text NOT NULL,
    client_secret_hash text NOT NULL,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- TOC entry 350 (class 1259 OID 155627)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- TOC entry 351 (class 1259 OID 155635)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 351
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 352 (class 1259 OID 155640)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 352
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 353 (class 1259 OID 155641)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- TOC entry 4853 (class 0 OID 0)
-- Dependencies: 353
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 354 (class 1259 OID 155649)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 354
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 355 (class 1259 OID 155655)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 355
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 356 (class 1259 OID 155658)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 356
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 356
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 357 (class 1259 OID 155663)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 357
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 358 (class 1259 OID 155669)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 358
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 358
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 359 (class 1259 OID 155675)
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 359
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 359
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 360 (class 1259 OID 155690)
-- Name: admin_activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action text NOT NULL,
    target_user_id uuid,
    target_resource text,
    resource_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    ip_address text,
    user_agent text,
    risk_score integer DEFAULT 0,
    requires_approval boolean DEFAULT false,
    approved_by uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 361 (class 1259 OID 155700)
-- Name: admin_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    granted_by uuid NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    user_email text
);


--
-- TOC entry 362 (class 1259 OID 155708)
-- Name: app_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_config (
    id integer DEFAULT 1 NOT NULL,
    current_version integer DEFAULT 1 NOT NULL,
    force_refresh boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT single_config CHECK ((id = 1))
);


--
-- TOC entry 363 (class 1259 OID 155717)
-- Name: app_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_updates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    version character varying(100) NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    requires_refresh boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 364 (class 1259 OID 155725)
-- Name: audio_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audio_tracks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    file_path text NOT NULL,
    file_url text,
    duration integer,
    category text DEFAULT 'verse'::text,
    created_by uuid,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    language text DEFAULT 'id'::text
);


--
-- TOC entry 365 (class 1259 OID 155736)
-- Name: auth_request_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_request_logs (
    id integer NOT NULL,
    user_id uuid,
    request_type text,
    user_agent text,
    ip_address inet,
    component_name text,
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 366 (class 1259 OID 155742)
-- Name: auth_request_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_request_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 366
-- Name: auth_request_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_request_logs_id_seq OWNED BY public.auth_request_logs.id;


--
-- TOC entry 367 (class 1259 OID 155743)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    user_name text NOT NULL,
    user_level integer DEFAULT 1 NOT NULL,
    is_pro boolean DEFAULT false,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    channel_id text DEFAULT 'community'::text,
    is_private boolean DEFAULT false,
    allowed_users uuid[],
    subscription_type text,
    is_admin boolean DEFAULT false
);

ALTER TABLE ONLY public.chat_messages REPLICA IDENTITY FULL;


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 367
-- Name: COLUMN chat_messages.subscription_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.chat_messages.subscription_type IS 'User 
  subscription type at time of message: 1_month, 1_year, or null for 
  non-pro';


--
-- TOC entry 368 (class 1259 OID 155755)
-- Name: data_classification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_classification (
    table_name text NOT NULL,
    classification text NOT NULL,
    pii_fields text[],
    retention_days integer,
    audit_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 369 (class 1259 OID 155762)
-- Name: days_remaining; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.days_remaining (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email text NOT NULL,
    subscription_id uuid,
    subscription_type text NOT NULL,
    days_remaining integer DEFAULT 0 NOT NULL,
    subscription_start_date timestamp with time zone,
    subscription_end_date timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT days_remaining_subscription_type_check CHECK ((subscription_type = ANY (ARRAY['1_month'::text, '1_year'::text, '1_week'::text, '1_day'::text, 'monthly'::text, 'yearly'::text])))
);


--
-- TOC entry 370 (class 1259 OID 155773)
-- Name: debug_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debug_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    function_name text,
    error_code text,
    error_message text,
    parameters jsonb,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 371 (class 1259 OID 155780)
-- Name: device_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token text NOT NULL,
    platform text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT device_tokens_platform_check CHECK ((platform = ANY (ARRAY['ios'::text, 'android'::text, 'web'::text])))
);


--
-- TOC entry 372 (class 1259 OID 155789)
-- Name: elite_habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.elite_habits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    exercise_type text NOT NULL,
    duration_minutes integer NOT NULL,
    date text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_email text,
    notes text
);


--
-- TOC entry 373 (class 1259 OID 155797)
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id integer NOT NULL,
    from_email character varying(255),
    subject text,
    original_content text,
    ai_response text,
    status character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    knowledge_base_id uuid
);


--
-- TOC entry 374 (class 1259 OID 155803)
-- Name: email_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 374
-- Name: email_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;


--
-- TOC entry 375 (class 1259 OID 155804)
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    chat_notifications_enabled boolean DEFAULT true NOT NULL,
    quiet_hours_start time without time zone,
    quiet_hours_end time without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 376 (class 1259 OID 155811)
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info'::text,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    notification_type character varying(100)
);


--
-- TOC entry 377 (class 1259 OID 155820)
-- Name: pro_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pro_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ip_address text,
    subscription_type text DEFAULT 'trial'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    subscription_start_date timestamp with time zone,
    subscription_end_date timestamp with time zone,
    amount_paid numeric(10,2),
    currency text DEFAULT 'IDR'::text,
    tripay_reference text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_email text,
    customer_phone text,
    verse_access boolean DEFAULT true,
    pro_badge boolean DEFAULT true,
    days_remaining integer DEFAULT 0 NOT NULL,
    CONSTRAINT vip_subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text, 'pending'::text])))
);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 377
-- Name: TABLE pro_subscriptions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.pro_subscriptions IS 'Stores ONLY confirmed paid subscriptions - users get pro access immediately';


--
-- TOC entry 378 (class 1259 OID 155835)
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    display_name text,
    level integer DEFAULT 1 NOT NULL,
    experience_points integer DEFAULT 0 NOT NULL,
    streak_days integer DEFAULT 0 NOT NULL,
    achievements text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avatar_url text,
    preferred_language text DEFAULT 'auto'::text,
    last_login_date date,
    last_streak_bonus_date date,
    total_verses integer DEFAULT 0,
    total_journal integer DEFAULT 0,
    daily_xp_earned integer DEFAULT 0,
    app_version integer DEFAULT 1,
    user_email text,
    total_elite_habit integer DEFAULT 0,
    analytics_used integer DEFAULT 0,
    last_analytics_date date,
    is_admin boolean DEFAULT false,
    phone_number text,
    verse4_used integer DEFAULT 0,
    is_pro boolean DEFAULT false,
    subscription_type text
);

ALTER TABLE ONLY public.profiles REPLICA IDENTITY FULL;


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 378
-- Name: COLUMN profiles.analytics_used; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.analytics_used IS 'Number of analytics reports used in current month (max 1 for free users)';


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 378
-- Name: COLUMN profiles.last_analytics_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.last_analytics_date IS 'Date when user last generated an analytics report';


--
-- TOC entry 379 (class 1259 OID 155856)
-- Name: rate_limit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ip_address text,
    action text NOT NULL,
    attempts integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 380 (class 1259 OID 155865)
-- Name: reflections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reflections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    user_email text NOT NULL,
    reflection text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 380
-- Name: TABLE reflections; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reflections IS 'Spiritual reflections table with RLS enabled for user data security';


--
-- TOC entry 381 (class 1259 OID 155873)
-- Name: security_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text,
    record_id uuid,
    ip_address text,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 382 (class 1259 OID 155881)
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    price integer NOT NULL,
    currency text DEFAULT 'IDR'::text,
    duration_days integer NOT NULL,
    payment_method_code text DEFAULT 'BCAVA'::text,
    payment_method text DEFAULT 'BCA Virtual Account'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 383 (class 1259 OID 155892)
-- Name: user_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    activity_type text NOT NULL,
    xp_earned integer DEFAULT 0 NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 384 (class 1259 OID 155901)
-- Name: user_contact_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_contact_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email_encrypted text NOT NULL,
    email_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 385 (class 1259 OID 155909)
-- Name: waiting_payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waiting_payment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    user_email text,
    customer_phone text,
    subscription_type text,
    amount_paid integer,
    currency text DEFAULT 'IDR'::text,
    status text DEFAULT 'pending'::text,
    tripay_reference text,
    ip_address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


--
-- TOC entry 386 (class 1259 OID 155919)
-- Name: xp_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.xp_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    xp_amount integer NOT NULL,
    transaction_type text NOT NULL,
    reason text,
    activity_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 387 (class 1259 OID 155926)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- TOC entry 388 (class 1259 OID 155951)
-- Name: messages_2025_09_20; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 389 (class 1259 OID 155960)
-- Name: messages_2025_09_21; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 390 (class 1259 OID 155969)
-- Name: messages_2025_09_22; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 391 (class 1259 OID 155978)
-- Name: messages_2025_09_23; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 392 (class 1259 OID 155987)
-- Name: messages_2025_09_24; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 409 (class 1259 OID 156671)
-- Name: messages_2025_09_25; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 410 (class 1259 OID 156682)
-- Name: messages_2025_09_26; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_09_26 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- TOC entry 393 (class 1259 OID 155996)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- TOC entry 394 (class 1259 OID 155999)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- TOC entry 395 (class 1259 OID 156007)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 396 (class 1259 OID 156008)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 396
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 397 (class 1259 OID 156018)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 398 (class 1259 OID 156027)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 399 (class 1259 OID 156031)
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 399
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 400 (class 1259 OID 156041)
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 401 (class 1259 OID 156049)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- TOC entry 402 (class 1259 OID 156056)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 403 (class 1259 OID 156064)
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 403
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: -
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- TOC entry 404 (class 1259 OID 156070)
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: -
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 404
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: -
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- TOC entry 405 (class 1259 OID 156071)
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 406 (class 1259 OID 156077)
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text
);


--
-- TOC entry 407 (class 1259 OID 156082)
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


--
-- TOC entry 3990 (class 0 OID 0)
-- Name: messages_2025_09_20; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_20 FOR VALUES FROM ('2025-09-20 00:00:00') TO ('2025-09-21 00:00:00');


--
-- TOC entry 3991 (class 0 OID 0)
-- Name: messages_2025_09_21; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_21 FOR VALUES FROM ('2025-09-21 00:00:00') TO ('2025-09-22 00:00:00');


--
-- TOC entry 3992 (class 0 OID 0)
-- Name: messages_2025_09_22; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_22 FOR VALUES FROM ('2025-09-22 00:00:00') TO ('2025-09-23 00:00:00');


--
-- TOC entry 3993 (class 0 OID 0)
-- Name: messages_2025_09_23; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_23 FOR VALUES FROM ('2025-09-23 00:00:00') TO ('2025-09-24 00:00:00');


--
-- TOC entry 3994 (class 0 OID 0)
-- Name: messages_2025_09_24; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_24 FOR VALUES FROM ('2025-09-24 00:00:00') TO ('2025-09-25 00:00:00');


--
-- TOC entry 3995 (class 0 OID 0)
-- Name: messages_2025_09_25; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_25 FOR VALUES FROM ('2025-09-25 00:00:00') TO ('2025-09-26 00:00:00');


--
-- TOC entry 3996 (class 0 OID 0)
-- Name: messages_2025_09_26; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_09_26 FOR VALUES FROM ('2025-09-26 00:00:00') TO ('2025-09-27 00:00:00');


--
-- TOC entry 4017 (class 2604 OID 156087)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4049 (class 2604 OID 156088)
-- Name: auth_request_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_request_logs ALTER COLUMN id SET DEFAULT nextval('public.auth_request_logs_id_seq'::regclass);


--
-- TOC entry 4073 (class 2604 OID 156089)
-- Name: email_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);


--
-- TOC entry 4189 (class 2604 OID 156090)
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- TOC entry 4241 (class 2606 OID 156092)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4225 (class 2606 OID 156094)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4229 (class 2606 OID 156096)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4234 (class 2606 OID 156098)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4236 (class 2606 OID 156100)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4239 (class 2606 OID 156102)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4243 (class 2606 OID 156104)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4246 (class 2606 OID 156106)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4249 (class 2606 OID 156108)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4251 (class 2606 OID 156110)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4257 (class 2606 OID 156112)
-- Name: oauth_clients oauth_clients_client_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id);


--
-- TOC entry 4260 (class 2606 OID 156114)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4262 (class 2606 OID 156116)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4270 (class 2606 OID 156118)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4273 (class 2606 OID 156120)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4276 (class 2606 OID 156122)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4278 (class 2606 OID 156124)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4283 (class 2606 OID 156126)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4286 (class 2606 OID 156128)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4289 (class 2606 OID 156130)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4294 (class 2606 OID 156132)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4297 (class 2606 OID 156134)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4310 (class 2606 OID 156136)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4312 (class 2606 OID 156138)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4314 (class 2606 OID 156140)
-- Name: admin_activity_log admin_activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_activity_log
    ADD CONSTRAINT admin_activity_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4316 (class 2606 OID 156142)
-- Name: admin_roles admin_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4318 (class 2606 OID 156144)
-- Name: admin_roles admin_roles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_user_id_key UNIQUE (user_id);


--
-- TOC entry 4320 (class 2606 OID 156146)
-- Name: app_config app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_pkey PRIMARY KEY (id);


--
-- TOC entry 4322 (class 2606 OID 156148)
-- Name: app_updates app_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_updates
    ADD CONSTRAINT app_updates_pkey PRIMARY KEY (id);


--
-- TOC entry 4324 (class 2606 OID 156150)
-- Name: audio_tracks audio_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audio_tracks
    ADD CONSTRAINT audio_tracks_pkey PRIMARY KEY (id);


--
-- TOC entry 4328 (class 2606 OID 156152)
-- Name: auth_request_logs auth_request_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_request_logs
    ADD CONSTRAINT auth_request_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4330 (class 2606 OID 156154)
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4337 (class 2606 OID 156156)
-- Name: data_classification data_classification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_classification
    ADD CONSTRAINT data_classification_pkey PRIMARY KEY (table_name);


--
-- TOC entry 4339 (class 2606 OID 156158)
-- Name: days_remaining days_remaining_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.days_remaining
    ADD CONSTRAINT days_remaining_pkey PRIMARY KEY (id);


--
-- TOC entry 4341 (class 2606 OID 156160)
-- Name: days_remaining days_remaining_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.days_remaining
    ADD CONSTRAINT days_remaining_user_id_key UNIQUE (user_id);


--
-- TOC entry 4343 (class 2606 OID 156162)
-- Name: debug_logs debug_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debug_logs
    ADD CONSTRAINT debug_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4345 (class 2606 OID 156164)
-- Name: device_tokens device_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4347 (class 2606 OID 156166)
-- Name: device_tokens device_tokens_user_id_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_token_key UNIQUE (user_id, token);


--
-- TOC entry 4351 (class 2606 OID 156168)
-- Name: elite_habits elite_habits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elite_habits
    ADD CONSTRAINT elite_habits_pkey PRIMARY KEY (id);


--
-- TOC entry 4355 (class 2606 OID 156170)
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4358 (class 2606 OID 156172)
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 4360 (class 2606 OID 156174)
-- Name: notification_settings notification_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_key UNIQUE (user_id);


--
-- TOC entry 4363 (class 2606 OID 156176)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4378 (class 2606 OID 156178)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4380 (class 2606 OID 156180)
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- TOC entry 4382 (class 2606 OID 156182)
-- Name: rate_limit_log rate_limit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limit_log
    ADD CONSTRAINT rate_limit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4387 (class 2606 OID 156184)
-- Name: reflections reflections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reflections
    ADD CONSTRAINT reflections_pkey PRIMARY KEY (id);


--
-- TOC entry 4389 (class 2606 OID 156186)
-- Name: security_audit_log security_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4391 (class 2606 OID 156188)
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 4367 (class 2606 OID 156190)
-- Name: pro_subscriptions unique_active_subscription_per_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pro_subscriptions
    ADD CONSTRAINT unique_active_subscription_per_user UNIQUE (user_id, status) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4393 (class 2606 OID 156193)
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 4395 (class 2606 OID 156195)
-- Name: user_contact_info user_contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_contact_info
    ADD CONSTRAINT user_contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4397 (class 2606 OID 156197)
-- Name: user_contact_info user_contact_info_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_contact_info
    ADD CONSTRAINT user_contact_info_user_id_key UNIQUE (user_id);


--
-- TOC entry 4369 (class 2606 OID 156199)
-- Name: pro_subscriptions vip_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pro_subscriptions
    ADD CONSTRAINT vip_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4371 (class 2606 OID 156201)
-- Name: pro_subscriptions vip_subscriptions_tripay_reference_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pro_subscriptions
    ADD CONSTRAINT vip_subscriptions_tripay_reference_key UNIQUE (tripay_reference);


--
-- TOC entry 4402 (class 2606 OID 156203)
-- Name: waiting_payment waiting_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiting_payment
    ADD CONSTRAINT waiting_payment_pkey PRIMARY KEY (id);


--
-- TOC entry 4404 (class 2606 OID 156205)
-- Name: xp_transactions xp_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.xp_transactions
    ADD CONSTRAINT xp_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 4406 (class 2606 OID 156207)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4408 (class 2606 OID 156213)
-- Name: messages_2025_09_20 messages_2025_09_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_20
    ADD CONSTRAINT messages_2025_09_20_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4410 (class 2606 OID 156215)
-- Name: messages_2025_09_21 messages_2025_09_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_21
    ADD CONSTRAINT messages_2025_09_21_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4412 (class 2606 OID 156217)
-- Name: messages_2025_09_22 messages_2025_09_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_22
    ADD CONSTRAINT messages_2025_09_22_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4414 (class 2606 OID 156219)
-- Name: messages_2025_09_23 messages_2025_09_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_23
    ADD CONSTRAINT messages_2025_09_23_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4416 (class 2606 OID 156221)
-- Name: messages_2025_09_24 messages_2025_09_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_24
    ADD CONSTRAINT messages_2025_09_24_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4461 (class 2606 OID 156679)
-- Name: messages_2025_09_25 messages_2025_09_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_25
    ADD CONSTRAINT messages_2025_09_25_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4463 (class 2606 OID 156690)
-- Name: messages_2025_09_26 messages_2025_09_26_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_09_26
    ADD CONSTRAINT messages_2025_09_26_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4421 (class 2606 OID 156223)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4418 (class 2606 OID 156225)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4427 (class 2606 OID 156227)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4425 (class 2606 OID 156229)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4429 (class 2606 OID 156231)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4431 (class 2606 OID 156233)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4439 (class 2606 OID 156235)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4442 (class 2606 OID 156237)
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- TOC entry 4447 (class 2606 OID 156239)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4445 (class 2606 OID 156241)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4449 (class 2606 OID 156243)
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- TOC entry 4453 (class 2606 OID 156245)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4455 (class 2606 OID 156247)
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- TOC entry 4457 (class 2606 OID 156249)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4459 (class 2606 OID 156251)
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- TOC entry 4226 (class 1259 OID 156252)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4300 (class 1259 OID 156253)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4301 (class 1259 OID 156254)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4302 (class 1259 OID 156255)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4247 (class 1259 OID 156256)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4227 (class 1259 OID 156257)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4232 (class 1259 OID 156258)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 4232
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4237 (class 1259 OID 156259)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4230 (class 1259 OID 156260)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4231 (class 1259 OID 156261)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4244 (class 1259 OID 156262)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4252 (class 1259 OID 156263)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4253 (class 1259 OID 156264)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4255 (class 1259 OID 156265)
-- Name: oauth_clients_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);


--
-- TOC entry 4258 (class 1259 OID 156266)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4263 (class 1259 OID 156267)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4264 (class 1259 OID 156268)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4265 (class 1259 OID 156269)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4303 (class 1259 OID 156270)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4304 (class 1259 OID 156271)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4266 (class 1259 OID 156272)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4267 (class 1259 OID 156273)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4268 (class 1259 OID 156274)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4271 (class 1259 OID 156275)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4274 (class 1259 OID 156276)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4279 (class 1259 OID 156277)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4280 (class 1259 OID 156278)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4281 (class 1259 OID 156279)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4284 (class 1259 OID 156280)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4287 (class 1259 OID 156281)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4290 (class 1259 OID 156282)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4292 (class 1259 OID 156283)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4295 (class 1259 OID 156284)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4298 (class 1259 OID 156285)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4299 (class 1259 OID 156286)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4254 (class 1259 OID 156287)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4291 (class 1259 OID 156288)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4305 (class 1259 OID 156289)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 4305
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4306 (class 1259 OID 156290)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4307 (class 1259 OID 156291)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4308 (class 1259 OID 156292)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4348 (class 1259 OID 156293)
-- Name: elite_habits_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX elite_habits_created_at_idx ON public.elite_habits USING btree (created_at);


--
-- TOC entry 4349 (class 1259 OID 156294)
-- Name: elite_habits_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX elite_habits_date_idx ON public.elite_habits USING btree (date);


--
-- TOC entry 4352 (class 1259 OID 156295)
-- Name: elite_habits_user_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX elite_habits_user_email_idx ON public.elite_habits USING btree (user_email) WHERE (user_email IS NOT NULL);


--
-- TOC entry 4353 (class 1259 OID 156296)
-- Name: elite_habits_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX elite_habits_user_id_idx ON public.elite_habits USING btree (user_id);


--
-- TOC entry 4325 (class 1259 OID 156297)
-- Name: idx_audio_tracks_category_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audio_tracks_category_language ON public.audio_tracks USING btree (category, language);


--
-- TOC entry 4326 (class 1259 OID 156298)
-- Name: idx_audio_tracks_language; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audio_tracks_language ON public.audio_tracks USING btree (language);


--
-- TOC entry 4331 (class 1259 OID 156299)
-- Name: idx_chat_messages_channel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_channel_id ON public.chat_messages USING btree (channel_id);


--
-- TOC entry 4332 (class 1259 OID 156300)
-- Name: idx_chat_messages_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at DESC);


--
-- TOC entry 4333 (class 1259 OID 156301)
-- Name: idx_chat_messages_privacy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_privacy ON public.chat_messages USING btree (channel_id, is_private);


--
-- TOC entry 4334 (class 1259 OID 156822)
-- Name: idx_chat_messages_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_user_created ON public.chat_messages USING btree (user_id, created_at DESC);


--
-- TOC entry 4335 (class 1259 OID 156790)
-- Name: idx_chat_messages_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_messages_user_id ON public.chat_messages USING btree (user_id);


--
-- TOC entry 4356 (class 1259 OID 156302)
-- Name: idx_email_logs_knowledge_base_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_logs_knowledge_base_id ON public.email_logs USING btree (knowledge_base_id);


--
-- TOC entry 4361 (class 1259 OID 156303)
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (user_id, notification_type) WHERE (notification_type IS NOT NULL);


--
-- TOC entry 4364 (class 1259 OID 156304)
-- Name: idx_pro_subscriptions_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pro_subscriptions_email ON public.pro_subscriptions USING btree (user_email);


--
-- TOC entry 4365 (class 1259 OID 156305)
-- Name: idx_pro_subscriptions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pro_subscriptions_user_id ON public.pro_subscriptions USING btree (user_id);


--
-- TOC entry 4372 (class 1259 OID 156306)
-- Name: idx_profiles_streak_days; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_streak_days ON public.profiles USING btree (streak_days);


--
-- TOC entry 4373 (class 1259 OID 156307)
-- Name: idx_profiles_total_journal; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_total_journal ON public.profiles USING btree (total_journal);


--
-- TOC entry 4374 (class 1259 OID 156308)
-- Name: idx_profiles_total_verses; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_total_verses ON public.profiles USING btree (total_verses);


--
-- TOC entry 4375 (class 1259 OID 156309)
-- Name: idx_profiles_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_user_email ON public.profiles USING btree (user_email);


--
-- TOC entry 4376 (class 1259 OID 156821)
-- Name: idx_profiles_user_id_fast; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_user_id_fast ON public.profiles USING btree (user_id);


--
-- TOC entry 4383 (class 1259 OID 156310)
-- Name: idx_reflections_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reflections_created_at ON public.reflections USING btree (created_at);


--
-- TOC entry 4384 (class 1259 OID 156311)
-- Name: idx_reflections_user_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reflections_user_email ON public.reflections USING btree (user_email);


--
-- TOC entry 4385 (class 1259 OID 156312)
-- Name: idx_reflections_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reflections_user_id ON public.reflections USING btree (user_id);


--
-- TOC entry 4398 (class 1259 OID 156313)
-- Name: idx_waiting_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_waiting_payment_status ON public.waiting_payment USING btree (status);


--
-- TOC entry 4399 (class 1259 OID 156314)
-- Name: idx_waiting_payment_tripay_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_waiting_payment_tripay_reference ON public.waiting_payment USING btree (tripay_reference);


--
-- TOC entry 4400 (class 1259 OID 156315)
-- Name: idx_waiting_payment_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_waiting_payment_user_id ON public.waiting_payment USING btree (user_id);


--
-- TOC entry 4419 (class 1259 OID 156316)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4422 (class 1259 OID 156317)
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- TOC entry 4423 (class 1259 OID 156318)
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4432 (class 1259 OID 156319)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4443 (class 1259 OID 156320)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4433 (class 1259 OID 156321)
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- TOC entry 4434 (class 1259 OID 156322)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4435 (class 1259 OID 156323)
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- TOC entry 4440 (class 1259 OID 156324)
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- TOC entry 4436 (class 1259 OID 156325)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4437 (class 1259 OID 156326)
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- TOC entry 4450 (class 1259 OID 156327)
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- TOC entry 4451 (class 1259 OID 156328)
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- TOC entry 4464 (class 0 OID 0)
-- Name: messages_2025_09_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_20_pkey;


--
-- TOC entry 4465 (class 0 OID 0)
-- Name: messages_2025_09_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_21_pkey;


--
-- TOC entry 4466 (class 0 OID 0)
-- Name: messages_2025_09_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_22_pkey;


--
-- TOC entry 4467 (class 0 OID 0)
-- Name: messages_2025_09_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_23_pkey;


--
-- TOC entry 4468 (class 0 OID 0)
-- Name: messages_2025_09_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_24_pkey;


--
-- TOC entry 4469 (class 0 OID 0)
-- Name: messages_2025_09_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_25_pkey;


--
-- TOC entry 4470 (class 0 OID 0)
-- Name: messages_2025_09_26_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_09_26_pkey;


--
-- TOC entry 4495 (class 2620 OID 156329)
-- Name: sso_providers MAILKETING WEBHOOK; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER "MAILKETING WEBHOOK" AFTER INSERT OR UPDATE ON auth.sso_providers FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/payment-created-webhook', 'POST', '{"Content-type":"application/json"}', '{}', '5000');


--
-- TOC entry 4496 (class 2620 OID 156330)
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- TOC entry 4497 (class 2620 OID 156331)
-- Name: users on_auth_user_created_trial; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created_trial AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_trial();


--
-- TOC entry 4501 (class 2620 OID 156332)
-- Name: chat_messages audit_chat_messages_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_chat_messages_trigger AFTER INSERT ON public.chat_messages FOR EACH ROW EXECUTE FUNCTION public.audit_chat_access();


--
-- TOC entry 4511 (class 2620 OID 156333)
-- Name: pro_subscriptions audit_pro_changes_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_pro_changes_trigger AFTER INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.audit_pro_changes();


--
-- TOC entry 4512 (class 2620 OID 156334)
-- Name: pro_subscriptions audit_vip_subscription_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_vip_subscription_changes AFTER INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.audit_vip_changes();


--
-- TOC entry 4513 (class 2620 OID 156335)
-- Name: pro_subscriptions auto_activate_subscription_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER auto_activate_subscription_trigger BEFORE INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.auto_activate_subscription();


--
-- TOC entry 4514 (class 2620 OID 156336)
-- Name: pro_subscriptions auto_cleanup_pro_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER auto_cleanup_pro_trigger BEFORE UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.auto_cleanup_pro_on_update();


--
-- TOC entry 4505 (class 2620 OID 156337)
-- Name: elite_habits auto_populate_elite_habit_email_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER auto_populate_elite_habit_email_trigger BEFORE INSERT ON public.elite_habits FOR EACH ROW EXECUTE FUNCTION public.auto_populate_elite_habit_email();


--
-- TOC entry 4515 (class 2620 OID 156338)
-- Name: pro_subscriptions calculate_days_remaining_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER calculate_days_remaining_trigger BEFORE INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.calculate_days_remaining_trigger();


--
-- TOC entry 4521 (class 2620 OID 156339)
-- Name: waiting_payment cleanup_waiting_payment_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER cleanup_waiting_payment_trigger AFTER INSERT ON public.waiting_payment FOR EACH ROW EXECUTE FUNCTION public.trigger_cleanup_waiting_payment();


--
-- TOC entry 4498 (class 2620 OID 156340)
-- Name: admin_roles enhanced_admin_role_access_monitor; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enhanced_admin_role_access_monitor AFTER INSERT OR DELETE OR UPDATE ON public.admin_roles FOR EACH ROW EXECUTE FUNCTION public.enhanced_admin_role_access_log();


--
-- TOC entry 4499 (class 2620 OID 156341)
-- Name: admin_roles enhanced_admin_role_audit_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enhanced_admin_role_audit_trigger AFTER INSERT OR DELETE OR UPDATE ON public.admin_roles FOR EACH ROW EXECUTE FUNCTION public.enhanced_admin_role_audit();


--
-- TOC entry 4506 (class 2620 OID 156342)
-- Name: elite_habits handle_elite_habits_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_elite_habits_updated_at BEFORE UPDATE ON public.elite_habits FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- TOC entry 4503 (class 2620 OID 156343)
-- Name: device_tokens monitor_device_tokens_access; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER monitor_device_tokens_access AFTER INSERT OR DELETE OR UPDATE ON public.device_tokens FOR EACH ROW EXECUTE FUNCTION public.monitor_sensitive_data_access();


--
-- TOC entry 4520 (class 2620 OID 156344)
-- Name: user_contact_info monitor_user_contact_info_access; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER monitor_user_contact_info_access AFTER INSERT OR DELETE OR UPDATE ON public.user_contact_info FOR EACH ROW EXECUTE FUNCTION public.monitor_sensitive_data_access();


--
-- TOC entry 4516 (class 2620 OID 156345)
-- Name: pro_subscriptions sync_days_remaining_table_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_days_remaining_table_trigger AFTER INSERT OR DELETE OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.sync_days_remaining_table();


--
-- TOC entry 4507 (class 2620 OID 156346)
-- Name: elite_habits sync_elite_habit_count_delete; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_elite_habit_count_delete AFTER DELETE ON public.elite_habits FOR EACH ROW EXECUTE FUNCTION public.sync_elite_habit_count();


--
-- TOC entry 4508 (class 2620 OID 156347)
-- Name: elite_habits sync_elite_habit_count_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_elite_habit_count_insert AFTER INSERT ON public.elite_habits FOR EACH ROW EXECUTE FUNCTION public.sync_elite_habit_count();


--
-- TOC entry 4509 (class 2620 OID 156348)
-- Name: elite_habits sync_elite_habit_count_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_elite_habit_count_update AFTER UPDATE ON public.elite_habits FOR EACH ROW EXECUTE FUNCTION public.sync_elite_habit_count();


--
-- TOC entry 4517 (class 2620 OID 156349)
-- Name: pro_subscriptions trg_set_user_id_pro_subscriptions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_set_user_id_pro_subscriptions BEFORE INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_user_id_from_email();


--
-- TOC entry 4502 (class 2620 OID 156350)
-- Name: chat_messages trigger_set_subscription_type; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_subscription_type BEFORE INSERT ON public.chat_messages FOR EACH ROW EXECUTE FUNCTION public.set_message_subscription_type();


--
-- TOC entry 4500 (class 2620 OID 156351)
-- Name: audio_tracks update_audio_tracks_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_audio_tracks_updated_at BEFORE UPDATE ON public.audio_tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4518 (class 2620 OID 156352)
-- Name: pro_subscriptions update_days_remaining_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_days_remaining_trigger BEFORE INSERT OR UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_days_remaining();


--
-- TOC entry 4504 (class 2620 OID 156353)
-- Name: device_tokens update_device_tokens_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_device_tokens_updated_at BEFORE UPDATE ON public.device_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4510 (class 2620 OID 156354)
-- Name: notification_settings update_notification_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4519 (class 2620 OID 156355)
-- Name: pro_subscriptions update_vip_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_vip_subscriptions_updated_at BEFORE UPDATE ON public.pro_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4522 (class 2620 OID 156356)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4523 (class 2620 OID 156357)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4524 (class 2620 OID 159473)
-- Name: objects objects_delete_cleanup; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_cleanup AFTER DELETE ON storage.objects REFERENCING OLD TABLE AS deleted FOR EACH STATEMENT EXECUTE FUNCTION storage.objects_delete_cleanup();


--
-- TOC entry 4525 (class 2620 OID 156359)
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- TOC entry 4526 (class 2620 OID 159475)
-- Name: objects objects_update_cleanup; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_cleanup AFTER UPDATE ON storage.objects REFERENCING OLD TABLE AS old_rows NEW TABLE AS new_rows FOR EACH STATEMENT EXECUTE FUNCTION storage.objects_update_cleanup();


--
-- TOC entry 4528 (class 2620 OID 156361)
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- TOC entry 4529 (class 2620 OID 159474)
-- Name: prefixes prefixes_delete_cleanup; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_cleanup AFTER DELETE ON storage.prefixes REFERENCING OLD TABLE AS deleted FOR EACH STATEMENT EXECUTE FUNCTION storage.prefixes_delete_cleanup();


--
-- TOC entry 4527 (class 2620 OID 156363)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4471 (class 2606 OID 156364)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4472 (class 2606 OID 156369)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4473 (class 2606 OID 156374)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4474 (class 2606 OID 156379)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4475 (class 2606 OID 156384)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4476 (class 2606 OID 156389)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4477 (class 2606 OID 156394)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4478 (class 2606 OID 156399)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4479 (class 2606 OID 156404)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4480 (class 2606 OID 156409)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4481 (class 2606 OID 156414)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4482 (class 2606 OID 156419)
-- Name: audio_tracks audio_tracks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audio_tracks
    ADD CONSTRAINT audio_tracks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4483 (class 2606 OID 156424)
-- Name: days_remaining days_remaining_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.days_remaining
    ADD CONSTRAINT days_remaining_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.pro_subscriptions(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4484 (class 2606 OID 156429)
-- Name: days_remaining days_remaining_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.days_remaining
    ADD CONSTRAINT days_remaining_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;


--
-- TOC entry 4485 (class 2606 OID 156434)
-- Name: device_tokens device_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_tokens
    ADD CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4486 (class 2606 OID 156439)
-- Name: elite_habits elite_habits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.elite_habits
    ADD CONSTRAINT elite_habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4487 (class 2606 OID 156444)
-- Name: notification_settings notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4489 (class 2606 OID 156449)
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4488 (class 2606 OID 156454)
-- Name: pro_subscriptions vip_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pro_subscriptions
    ADD CONSTRAINT vip_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4490 (class 2606 OID 156459)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4491 (class 2606 OID 156464)
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4492 (class 2606 OID 156469)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4493 (class 2606 OID 156474)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4494 (class 2606 OID 156479)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4680 (class 0 OID 155579)
-- Dependencies: 342
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4681 (class 0 OID 155585)
-- Dependencies: 343
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4682 (class 0 OID 155590)
-- Dependencies: 344
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4683 (class 0 OID 155597)
-- Dependencies: 345
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4684 (class 0 OID 155602)
-- Dependencies: 346
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4685 (class 0 OID 155607)
-- Dependencies: 347
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4686 (class 0 OID 155612)
-- Dependencies: 348
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4687 (class 0 OID 155627)
-- Dependencies: 350
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4688 (class 0 OID 155635)
-- Dependencies: 351
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4689 (class 0 OID 155641)
-- Dependencies: 353
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4690 (class 0 OID 155649)
-- Dependencies: 354
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4691 (class 0 OID 155655)
-- Dependencies: 355
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4692 (class 0 OID 155658)
-- Dependencies: 356
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4693 (class 0 OID 155663)
-- Dependencies: 357
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4694 (class 0 OID 155669)
-- Dependencies: 358
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4695 (class 0 OID 155675)
-- Dependencies: 359
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4729 (class 3256 OID 156484)
-- Name: pro_subscriptions Admin can manage all subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all subscriptions" ON public.pro_subscriptions TO service_role WITH CHECK (true);


--
-- TOC entry 4730 (class 3256 OID 156485)
-- Name: security_audit_log Admins can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND ('admin'::text = ANY (profiles.achievements))))));


--
-- TOC entry 4731 (class 3256 OID 156486)
-- Name: subscription_plans Anyone can view active subscription plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans FOR SELECT USING ((is_active = true));


--
-- TOC entry 4732 (class 3256 OID 156487)
-- Name: audio_tracks Anyone can view public audio tracks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view public audio tracks" ON public.audio_tracks FOR SELECT USING ((is_public = true));


--
-- TOC entry 4804 (class 3256 OID 156788)
-- Name: profiles Auth users can view profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Auth users can view profiles" ON public.profiles FOR SELECT USING (true);


--
-- TOC entry 4733 (class 3256 OID 156488)
-- Name: audio_tracks Authenticated users can create audio tracks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create audio tracks" ON public.audio_tracks FOR INSERT WITH CHECK ((auth.uid() = created_by));


--
-- TOC entry 4734 (class 3256 OID 156489)
-- Name: chat_messages Authenticated users can create chat messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create chat messages" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4735 (class 3256 OID 156490)
-- Name: chat_messages Channel-based chat message access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Channel-based chat message access" ON public.chat_messages FOR SELECT USING (((auth.uid() IS NOT NULL) AND (((channel_id = 'community'::text) AND (is_private = false)) OR ((is_private = true) AND (auth.uid() = ANY (allowed_users))) OR (auth.uid() = user_id) OR public.is_verified_admin(auth.uid()))));


--
-- TOC entry 4736 (class 3256 OID 156491)
-- Name: email_logs Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for authenticated users only" ON public.email_logs FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 4737 (class 3256 OID 156492)
-- Name: app_updates Everyone can view app updates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view app updates" ON public.app_updates FOR SELECT TO authenticated USING (true);


--
-- TOC entry 4808 (class 3256 OID 156826)
-- Name: chat_messages Fast chat delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Fast chat delete" ON public.chat_messages FOR DELETE USING (((auth.uid() = user_id) OR (auth.uid() = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'::uuid)));


--
-- TOC entry 4806 (class 3256 OID 156824)
-- Name: chat_messages Fast chat read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Fast chat read" ON public.chat_messages FOR SELECT USING (true);


--
-- TOC entry 4807 (class 3256 OID 156825)
-- Name: chat_messages Fast chat write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Fast chat write" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- TOC entry 4738 (class 3256 OID 156493)
-- Name: pro_subscriptions Only service role can create subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only service role can create subscriptions" ON public.pro_subscriptions FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 4739 (class 3256 OID 156494)
-- Name: data_classification Only verified admins can manage data classification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only verified admins can manage data classification" ON public.data_classification USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4740 (class 3256 OID 156495)
-- Name: data_classification Only verified admins can view data classification; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only verified admins can view data classification" ON public.data_classification FOR SELECT USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4742 (class 3256 OID 156496)
-- Name: device_tokens Secure device token access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Secure device token access" ON public.device_tokens FOR SELECT USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4743 (class 3256 OID 156497)
-- Name: device_tokens Secure device token delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Secure device token delete" ON public.device_tokens FOR DELETE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4744 (class 3256 OID 156498)
-- Name: device_tokens Secure device token insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Secure device token insert" ON public.device_tokens FOR INSERT WITH CHECK (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4745 (class 3256 OID 156499)
-- Name: device_tokens Secure device token update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Secure device token update" ON public.device_tokens FOR UPDATE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4746 (class 3256 OID 156500)
-- Name: pro_subscriptions Service role can create subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can create subscriptions" ON public.pro_subscriptions FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 4747 (class 3256 OID 156501)
-- Name: waiting_payment Service role can do anything on waiting_payment; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can do anything on waiting_payment" ON public.waiting_payment USING (true);


--
-- TOC entry 4748 (class 3256 OID 156502)
-- Name: debug_logs Service role can manage debug logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage debug logs" ON public.debug_logs USING (true);


--
-- TOC entry 4749 (class 3256 OID 156503)
-- Name: admin_roles Super admins can create admin roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can create admin roles" ON public.admin_roles FOR INSERT TO authenticated WITH CHECK (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4750 (class 3256 OID 156504)
-- Name: admin_roles Super admins can delete admin roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can delete admin roles" ON public.admin_roles FOR DELETE TO authenticated USING (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4752 (class 3256 OID 156505)
-- Name: admin_roles Super admins can update admin roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can update admin roles" ON public.admin_roles FOR UPDATE TO authenticated USING (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean) WITH CHECK (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4753 (class 3256 OID 156506)
-- Name: admin_activity_log Super admins can view admin activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Super admins can view admin activity logs" ON public.admin_activity_log FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles ar
  WHERE ((ar.user_id = auth.uid()) AND (ar.role = 'super_admin'::text) AND (ar.is_active = true) AND ((ar.expires_at IS NULL) OR (ar.expires_at > now()))))));


--
-- TOC entry 4754 (class 3256 OID 156507)
-- Name: admin_activity_log System can insert admin activity logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert admin activity logs" ON public.admin_activity_log FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 4755 (class 3256 OID 156508)
-- Name: security_audit_log System can insert audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert audit logs" ON public.security_audit_log FOR INSERT WITH CHECK (true);


--
-- TOC entry 4756 (class 3256 OID 156509)
-- Name: rate_limit_log System can manage rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage rate limits" ON public.rate_limit_log USING (((auth.uid() IS NULL) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND ('admin'::text = ANY (profiles.achievements)))))));


--
-- TOC entry 4757 (class 3256 OID 156510)
-- Name: user_contact_info Ultra secure contact info access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ultra secure contact info access" ON public.user_contact_info FOR SELECT USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4758 (class 3256 OID 156511)
-- Name: user_contact_info Ultra secure contact info insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ultra secure contact info insert" ON public.user_contact_info FOR INSERT WITH CHECK (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4759 (class 3256 OID 156512)
-- Name: user_contact_info Ultra secure contact info update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ultra secure contact info update" ON public.user_contact_info FOR UPDATE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4760 (class 3256 OID 156513)
-- Name: xp_transactions Users can create their own XP transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own XP transactions" ON public.xp_transactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4761 (class 3256 OID 156514)
-- Name: user_activities Users can create their own activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own activities" ON public.user_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4762 (class 3256 OID 156515)
-- Name: elite_habits Users can delete own elite habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own elite habits" ON public.elite_habits FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4763 (class 3256 OID 156516)
-- Name: reflections Users can delete own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own reflections" ON public.reflections FOR DELETE USING (((auth.uid())::text = user_id));


--
-- TOC entry 4764 (class 3256 OID 156517)
-- Name: chat_messages Users can delete their own chat messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4765 (class 3256 OID 156518)
-- Name: elite_habits Users can insert own elite habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own elite habits" ON public.elite_habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4766 (class 3256 OID 156519)
-- Name: reflections Users can insert own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own reflections" ON public.reflections FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- TOC entry 4767 (class 3256 OID 156520)
-- Name: notification_settings Users can insert their own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own notification settings" ON public.notification_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4768 (class 3256 OID 156521)
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4769 (class 3256 OID 156522)
-- Name: pro_subscriptions Users can insert their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own subscription" ON public.pro_subscriptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4805 (class 3256 OID 156789)
-- Name: profiles Users can manage own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own profile" ON public.profiles USING ((auth.uid() = user_id));


--
-- TOC entry 4770 (class 3256 OID 156523)
-- Name: pro_subscriptions Users can only delete their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only delete their own subscription" ON public.pro_subscriptions FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4771 (class 3256 OID 156524)
-- Name: pro_subscriptions Users can only insert their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only insert their own subscription" ON public.pro_subscriptions FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4772 (class 3256 OID 156525)
-- Name: pro_subscriptions Users can only update their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only update their own subscription" ON public.pro_subscriptions FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4773 (class 3256 OID 156526)
-- Name: pro_subscriptions Users can only view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can only view their own subscription" ON public.pro_subscriptions FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4774 (class 3256 OID 156527)
-- Name: reflections Users can select own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can select own reflections" ON public.reflections FOR SELECT USING (((auth.uid())::text = user_id));


--
-- TOC entry 4775 (class 3256 OID 156528)
-- Name: elite_habits Users can update own elite habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own elite habits" ON public.elite_habits FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4776 (class 3256 OID 156529)
-- Name: reflections Users can update own reflections; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own reflections" ON public.reflections FOR UPDATE USING (((auth.uid())::text = user_id)) WITH CHECK (((auth.uid())::text = user_id));


--
-- TOC entry 4777 (class 3256 OID 156530)
-- Name: audio_tracks Users can update their own audio tracks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own audio tracks" ON public.audio_tracks FOR UPDATE USING ((auth.uid() = created_by));


--
-- TOC entry 4778 (class 3256 OID 156531)
-- Name: notification_settings Users can update their own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notification settings" ON public.notification_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4741 (class 3256 OID 156532)
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4751 (class 3256 OID 156533)
-- Name: pro_subscriptions Users can update their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own subscription" ON public.pro_subscriptions FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4779 (class 3256 OID 156534)
-- Name: elite_habits Users can view own elite habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own elite habits" ON public.elite_habits FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4780 (class 3256 OID 156535)
-- Name: xp_transactions Users can view their own XP transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own XP transactions" ON public.xp_transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4781 (class 3256 OID 156536)
-- Name: user_activities Users can view their own activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own activities" ON public.user_activities FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4782 (class 3256 OID 156537)
-- Name: audio_tracks Users can view their own audio tracks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own audio tracks" ON public.audio_tracks FOR SELECT USING ((auth.uid() = created_by));


--
-- TOC entry 4783 (class 3256 OID 156538)
-- Name: days_remaining Users can view their own days_remaining; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own days_remaining" ON public.days_remaining FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4784 (class 3256 OID 156539)
-- Name: notification_settings Users can view their own notification settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notification settings" ON public.notification_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4785 (class 3256 OID 156540)
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4786 (class 3256 OID 156541)
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4787 (class 3256 OID 156542)
-- Name: pro_subscriptions Users can view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription" ON public.pro_subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4788 (class 3256 OID 156543)
-- Name: waiting_payment Users can view their own waiting payments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own waiting payments" ON public.waiting_payment FOR SELECT USING ((user_id = auth.uid()));


--
-- TOC entry 4789 (class 3256 OID 156544)
-- Name: pro_subscriptions Users read own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users read own subscriptions" ON public.pro_subscriptions FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- TOC entry 4790 (class 3256 OID 156545)
-- Name: days_remaining Verified admins can manage days_remaining; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Verified admins can manage days_remaining" ON public.days_remaining USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4791 (class 3256 OID 156546)
-- Name: pro_subscriptions Verified admins can view all subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Verified admins can view all subscriptions" ON public.pro_subscriptions FOR SELECT USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4696 (class 0 OID 155690)
-- Dependencies: 360
-- Name: admin_activity_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4697 (class 0 OID 155700)
-- Dependencies: 361
-- Name: admin_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4792 (class 3256 OID 156547)
-- Name: admin_roles allow_read_admin_roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY allow_read_admin_roles ON public.admin_roles FOR SELECT USING (true);


--
-- TOC entry 4698 (class 0 OID 155708)
-- Dependencies: 362
-- Name: app_config; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4699 (class 0 OID 155717)
-- Dependencies: 363
-- Name: app_updates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_updates ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4700 (class 0 OID 155725)
-- Dependencies: 364
-- Name: audio_tracks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4701 (class 0 OID 155736)
-- Dependencies: 365
-- Name: auth_request_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.auth_request_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4811 (class 3256 OID 156854)
-- Name: chat_messages chat_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY chat_delete ON public.chat_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4810 (class 3256 OID 156853)
-- Name: chat_messages chat_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY chat_insert ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4702 (class 0 OID 155743)
-- Dependencies: 367
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4809 (class 3256 OID 156852)
-- Name: chat_messages chat_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY chat_read ON public.chat_messages FOR SELECT USING (true);


--
-- TOC entry 4703 (class 0 OID 155755)
-- Dependencies: 368
-- Name: data_classification; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4704 (class 0 OID 155762)
-- Dependencies: 369
-- Name: days_remaining; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.days_remaining ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4705 (class 0 OID 155773)
-- Dependencies: 370
-- Name: debug_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.debug_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4706 (class 0 OID 155780)
-- Dependencies: 371
-- Name: device_tokens; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4707 (class 0 OID 155789)
-- Dependencies: 372
-- Name: elite_habits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.elite_habits ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4708 (class 0 OID 155797)
-- Dependencies: 373
-- Name: email_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4709 (class 0 OID 155804)
-- Dependencies: 375
-- Name: notification_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4710 (class 0 OID 155811)
-- Dependencies: 376
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4711 (class 0 OID 155820)
-- Dependencies: 377
-- Name: pro_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pro_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4712 (class 0 OID 155835)
-- Dependencies: 378
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4713 (class 0 OID 155856)
-- Dependencies: 379
-- Name: rate_limit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4714 (class 0 OID 155865)
-- Dependencies: 380
-- Name: reflections; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4715 (class 0 OID 155873)
-- Dependencies: 381
-- Name: security_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4793 (class 3256 OID 156548)
-- Name: admin_roles simple_read_admin_roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY simple_read_admin_roles ON public.admin_roles FOR SELECT USING (true);


--
-- TOC entry 4716 (class 0 OID 155881)
-- Dependencies: 382
-- Name: subscription_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4717 (class 0 OID 155892)
-- Dependencies: 383
-- Name: user_activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4718 (class 0 OID 155901)
-- Dependencies: 384
-- Name: user_contact_info; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_contact_info ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4719 (class 0 OID 155909)
-- Dependencies: 385
-- Name: waiting_payment; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.waiting_payment ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4720 (class 0 OID 155919)
-- Dependencies: 386
-- Name: xp_transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4721 (class 0 OID 155926)
-- Dependencies: 387
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4794 (class 3256 OID 156549)
-- Name: objects   Private Signed URLs Only 1fjm550_0; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "  Private Signed URLs Only 1fjm550_0" ON storage.objects FOR SELECT TO authenticated USING ((auth.role() = 'service_role'::text));


--
-- TOC entry 4795 (class 3256 OID 156550)
-- Name: objects Anyone can view audio files; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING ((bucket_id = 'audio-files'::text));


--
-- TOC entry 4796 (class 3256 OID 156551)
-- Name: objects Authenticated users can play audio files; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can play audio files" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'audio-files'::text) AND (auth.uid() IS NOT NULL)));


--
-- TOC entry 4797 (class 3256 OID 156552)
-- Name: objects Authenticated users can upload audio; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Authenticated users can upload audio" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'audio-files'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4798 (class 3256 OID 156553)
-- Name: objects Users can delete their own audio files; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can delete their own audio files" ON storage.objects FOR DELETE USING (((bucket_id = 'audio-files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4799 (class 3256 OID 156554)
-- Name: objects Users can delete their own profile picture; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can delete their own profile picture" ON storage.objects FOR DELETE USING (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4800 (class 3256 OID 156555)
-- Name: objects Users can update their own audio files; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can update their own audio files" ON storage.objects FOR UPDATE USING (((bucket_id = 'audio-files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4801 (class 3256 OID 156556)
-- Name: objects Users can update their own profile picture; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can update their own profile picture" ON storage.objects FOR UPDATE USING (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4802 (class 3256 OID 156557)
-- Name: objects Users can upload their own profile picture; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can upload their own profile picture" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4803 (class 3256 OID 156558)
-- Name: objects Users can view profile pictures; Type: POLICY; Schema: storage; Owner: -
--

CREATE POLICY "Users can view profile pictures" ON storage.objects FOR SELECT USING ((bucket_id = 'profile-pictures'::text));


--
-- TOC entry 4722 (class 0 OID 156008)
-- Dependencies: 396
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4723 (class 0 OID 156018)
-- Dependencies: 397
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4724 (class 0 OID 156027)
-- Dependencies: 398
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4725 (class 0 OID 156031)
-- Dependencies: 399
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4726 (class 0 OID 156041)
-- Dependencies: 400
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4727 (class 0 OID 156049)
-- Dependencies: 401
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4728 (class 0 OID 156056)
-- Dependencies: 402
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4812 (class 6104 OID 156559)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4813 (class 6104 OID 156560)
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


--
-- TOC entry 4814 (class 6106 OID 156561)
-- Name: supabase_realtime chat_messages; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.chat_messages;


--
-- TOC entry 4815 (class 6106 OID 156562)
-- Name: supabase_realtime notifications; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.notifications;


--
-- TOC entry 4816 (class 6106 OID 156563)
-- Name: supabase_realtime pro_subscriptions; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.pro_subscriptions;


--
-- TOC entry 4817 (class 6106 OID 156564)
-- Name: supabase_realtime profiles; Type: PUBLICATION TABLE; Schema: public; Owner: -
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.profiles;


--
-- TOC entry 4818 (class 6106 OID 156565)
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: -
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- TOC entry 3978 (class 3466 OID 156625)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- TOC entry 3983 (class 3466 OID 156669)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- TOC entry 3977 (class 3466 OID 156624)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- TOC entry 3984 (class 3466 OID 156670)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- TOC entry 3979 (class 3466 OID 156626)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- TOC entry 3980 (class 3466 OID 156627)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


-- Completed on 2025-09-23 21:20:17 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict M1ZIQjW5RJwvwBJoLE2sl5dSX3qifRR3fFpZirH74JsCAMotVIDOeHplDitb4VI

