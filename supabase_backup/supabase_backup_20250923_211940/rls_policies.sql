-- TOC entry 4680 (class 0 OID 155579)
-- Dependencies: 342
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4681 (class 0 OID 155585)
-- Dependencies: 343
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4682 (class 0 OID 155590)
-- Dependencies: 344
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4683 (class 0 OID 155597)
-- Dependencies: 345
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4684 (class 0 OID 155602)
-- Dependencies: 346
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4685 (class 0 OID 155607)
-- Dependencies: 347
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4686 (class 0 OID 155612)
-- Dependencies: 348
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4687 (class 0 OID 155627)
-- Dependencies: 350
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4688 (class 0 OID 155635)
-- Dependencies: 351
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4689 (class 0 OID 155641)
-- Dependencies: 353
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4690 (class 0 OID 155649)
-- Dependencies: 354
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4691 (class 0 OID 155655)
-- Dependencies: 355
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4692 (class 0 OID 155658)
-- Dependencies: 356
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4693 (class 0 OID 155663)
-- Dependencies: 357
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4694 (class 0 OID 155669)
-- Dependencies: 358
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4695 (class 0 OID 155675)
-- Dependencies: 359
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4729 (class 3256 OID 156484)
-- Name: pro_subscriptions Admin can manage all subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admin can manage all subscriptions" ON public.pro_subscriptions TO service_role WITH CHECK (true);


--
-- TOC entry 4730 (class 3256 OID 156485)
-- Name: security_audit_log Admins can view audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND ('admin'::text = ANY (profiles.achievements))))));


--
-- TOC entry 4731 (class 3256 OID 156486)
-- Name: subscription_plans Anyone can view active subscription plans; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans FOR SELECT USING ((is_active = true));


--
-- TOC entry 4732 (class 3256 OID 156487)
-- Name: audio_tracks Anyone can view public audio tracks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view public audio tracks" ON public.audio_tracks FOR SELECT USING ((is_public = true));


--
-- TOC entry 4804 (class 3256 OID 156788)
-- Name: profiles Auth users can view profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Auth users can view profiles" ON public.profiles FOR SELECT USING (true);


--
-- TOC entry 4733 (class 3256 OID 156488)
-- Name: audio_tracks Authenticated users can create audio tracks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create audio tracks" ON public.audio_tracks FOR INSERT WITH CHECK ((auth.uid() = created_by));


--
-- TOC entry 4734 (class 3256 OID 156489)
-- Name: chat_messages Authenticated users can create chat messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can create chat messages" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4735 (class 3256 OID 156490)
-- Name: chat_messages Channel-based chat message access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Channel-based chat message access" ON public.chat_messages FOR SELECT USING (((auth.uid() IS NOT NULL) AND (((channel_id = 'community'::text) AND (is_private = false)) OR ((is_private = true) AND (auth.uid() = ANY (allowed_users))) OR (auth.uid() = user_id) OR public.is_verified_admin(auth.uid()))));


--
-- TOC entry 4736 (class 3256 OID 156491)
-- Name: email_logs Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public.email_logs FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 4737 (class 3256 OID 156492)
-- Name: app_updates Everyone can view app updates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone can view app updates" ON public.app_updates FOR SELECT TO authenticated USING (true);


--
-- TOC entry 4808 (class 3256 OID 156826)
-- Name: chat_messages Fast chat delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Fast chat delete" ON public.chat_messages FOR DELETE USING (((auth.uid() = user_id) OR (auth.uid() = '3da83afb-aa8c-4c55-b3b0-8aa64000205f'::uuid)));


--
-- TOC entry 4806 (class 3256 OID 156824)
-- Name: chat_messages Fast chat read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Fast chat read" ON public.chat_messages FOR SELECT USING (true);


--
-- TOC entry 4807 (class 3256 OID 156825)
-- Name: chat_messages Fast chat write; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Fast chat write" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() IS NOT NULL));


--
-- TOC entry 4738 (class 3256 OID 156493)
-- Name: pro_subscriptions Only service role can create subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only service role can create subscriptions" ON public.pro_subscriptions FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 4739 (class 3256 OID 156494)
-- Name: data_classification Only verified admins can manage data classification; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only verified admins can manage data classification" ON public.data_classification USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4740 (class 3256 OID 156495)
-- Name: data_classification Only verified admins can view data classification; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only verified admins can view data classification" ON public.data_classification FOR SELECT USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4742 (class 3256 OID 156496)
-- Name: device_tokens Secure device token access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Secure device token access" ON public.device_tokens FOR SELECT USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4743 (class 3256 OID 156497)
-- Name: device_tokens Secure device token delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Secure device token delete" ON public.device_tokens FOR DELETE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4744 (class 3256 OID 156498)
-- Name: device_tokens Secure device token insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Secure device token insert" ON public.device_tokens FOR INSERT WITH CHECK (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4745 (class 3256 OID 156499)
-- Name: device_tokens Secure device token update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Secure device token update" ON public.device_tokens FOR UPDATE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'device_tokens'::text)));


--
-- TOC entry 4746 (class 3256 OID 156500)
-- Name: pro_subscriptions Service role can create subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can create subscriptions" ON public.pro_subscriptions FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 4747 (class 3256 OID 156501)
-- Name: waiting_payment Service role can do anything on waiting_payment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can do anything on waiting_payment" ON public.waiting_payment USING (true);


--
-- TOC entry 4748 (class 3256 OID 156502)
-- Name: debug_logs Service role can manage debug logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can manage debug logs" ON public.debug_logs USING (true);


--
-- TOC entry 4749 (class 3256 OID 156503)
-- Name: admin_roles Super admins can create admin roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super admins can create admin roles" ON public.admin_roles FOR INSERT TO authenticated WITH CHECK (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4750 (class 3256 OID 156504)
-- Name: admin_roles Super admins can delete admin roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super admins can delete admin roles" ON public.admin_roles FOR DELETE TO authenticated USING (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4752 (class 3256 OID 156505)
-- Name: admin_roles Super admins can update admin roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super admins can update admin roles" ON public.admin_roles FOR UPDATE TO authenticated USING (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean) WITH CHECK (((public.verify_admin_with_failsafe(auth.uid(), 'super_admin'::text) ->> 'is_admin'::text))::boolean);


--
-- TOC entry 4753 (class 3256 OID 156506)
-- Name: admin_activity_log Super admins can view admin activity logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Super admins can view admin activity logs" ON public.admin_activity_log FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.admin_roles ar
  WHERE ((ar.user_id = auth.uid()) AND (ar.role = 'super_admin'::text) AND (ar.is_active = true) AND ((ar.expires_at IS NULL) OR (ar.expires_at > now()))))));


--
-- TOC entry 4754 (class 3256 OID 156507)
-- Name: admin_activity_log System can insert admin activity logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert admin activity logs" ON public.admin_activity_log FOR INSERT TO authenticated WITH CHECK (true);


--
-- TOC entry 4755 (class 3256 OID 156508)
-- Name: security_audit_log System can insert audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert audit logs" ON public.security_audit_log FOR INSERT WITH CHECK (true);


--
-- TOC entry 4756 (class 3256 OID 156509)
-- Name: rate_limit_log System can manage rate limits; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can manage rate limits" ON public.rate_limit_log USING (((auth.uid() IS NULL) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.user_id = auth.uid()) AND ('admin'::text = ANY (profiles.achievements)))))));


--
-- TOC entry 4757 (class 3256 OID 156510)
-- Name: user_contact_info Ultra secure contact info access; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Ultra secure contact info access" ON public.user_contact_info FOR SELECT USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4758 (class 3256 OID 156511)
-- Name: user_contact_info Ultra secure contact info insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Ultra secure contact info insert" ON public.user_contact_info FOR INSERT WITH CHECK (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4759 (class 3256 OID 156512)
-- Name: user_contact_info Ultra secure contact info update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Ultra secure contact info update" ON public.user_contact_info FOR UPDATE USING (((auth.uid() = user_id) AND public.check_sensitive_data_rate_limit(auth.uid(), 'user_contact_info'::text)));


--
-- TOC entry 4760 (class 3256 OID 156513)
-- Name: xp_transactions Users can create their own XP transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own XP transactions" ON public.xp_transactions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4761 (class 3256 OID 156514)
-- Name: user_activities Users can create their own activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own activities" ON public.user_activities FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4762 (class 3256 OID 156515)
-- Name: elite_habits Users can delete own elite habits; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own elite habits" ON public.elite_habits FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4763 (class 3256 OID 156516)
-- Name: reflections Users can delete own reflections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own reflections" ON public.reflections FOR DELETE USING (((auth.uid())::text = user_id));


--
-- TOC entry 4764 (class 3256 OID 156517)
-- Name: chat_messages Users can delete their own chat messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4765 (class 3256 OID 156518)
-- Name: elite_habits Users can insert own elite habits; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own elite habits" ON public.elite_habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4766 (class 3256 OID 156519)
-- Name: reflections Users can insert own reflections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert own reflections" ON public.reflections FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- TOC entry 4767 (class 3256 OID 156520)
-- Name: notification_settings Users can insert their own notification settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own notification settings" ON public.notification_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4768 (class 3256 OID 156521)
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4769 (class 3256 OID 156522)
-- Name: pro_subscriptions Users can insert their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own subscription" ON public.pro_subscriptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4805 (class 3256 OID 156789)
-- Name: profiles Users can manage own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can manage own profile" ON public.profiles USING ((auth.uid() = user_id));


--
-- TOC entry 4770 (class 3256 OID 156523)
-- Name: pro_subscriptions Users can only delete their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can only delete their own subscription" ON public.pro_subscriptions FOR DELETE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4771 (class 3256 OID 156524)
-- Name: pro_subscriptions Users can only insert their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can only insert their own subscription" ON public.pro_subscriptions FOR INSERT TO authenticated WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4772 (class 3256 OID 156525)
-- Name: pro_subscriptions Users can only update their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can only update their own subscription" ON public.pro_subscriptions FOR UPDATE TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4773 (class 3256 OID 156526)
-- Name: pro_subscriptions Users can only view their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can only view their own subscription" ON public.pro_subscriptions FOR SELECT TO authenticated USING ((user_id = ( SELECT auth.uid() AS uid)));


--
-- TOC entry 4774 (class 3256 OID 156527)
-- Name: reflections Users can select own reflections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can select own reflections" ON public.reflections FOR SELECT USING (((auth.uid())::text = user_id));


--
-- TOC entry 4775 (class 3256 OID 156528)
-- Name: elite_habits Users can update own elite habits; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own elite habits" ON public.elite_habits FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4776 (class 3256 OID 156529)
-- Name: reflections Users can update own reflections; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own reflections" ON public.reflections FOR UPDATE USING (((auth.uid())::text = user_id)) WITH CHECK (((auth.uid())::text = user_id));


--
-- TOC entry 4777 (class 3256 OID 156530)
-- Name: audio_tracks Users can update their own audio tracks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own audio tracks" ON public.audio_tracks FOR UPDATE USING ((auth.uid() = created_by));


--
-- TOC entry 4778 (class 3256 OID 156531)
-- Name: notification_settings Users can update their own notification settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own notification settings" ON public.notification_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4741 (class 3256 OID 156532)
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4751 (class 3256 OID 156533)
-- Name: pro_subscriptions Users can update their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own subscription" ON public.pro_subscriptions FOR UPDATE USING ((auth.uid() = user_id));


--
-- TOC entry 4779 (class 3256 OID 156534)
-- Name: elite_habits Users can view own elite habits; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own elite habits" ON public.elite_habits FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4780 (class 3256 OID 156535)
-- Name: xp_transactions Users can view their own XP transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own XP transactions" ON public.xp_transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4781 (class 3256 OID 156536)
-- Name: user_activities Users can view their own activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own activities" ON public.user_activities FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4782 (class 3256 OID 156537)
-- Name: audio_tracks Users can view their own audio tracks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own audio tracks" ON public.audio_tracks FOR SELECT USING ((auth.uid() = created_by));


--
-- TOC entry 4783 (class 3256 OID 156538)
-- Name: days_remaining Users can view their own days_remaining; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own days_remaining" ON public.days_remaining FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4784 (class 3256 OID 156539)
-- Name: notification_settings Users can view their own notification settings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own notification settings" ON public.notification_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4785 (class 3256 OID 156540)
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4786 (class 3256 OID 156541)
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4787 (class 3256 OID 156542)
-- Name: pro_subscriptions Users can view their own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own subscription" ON public.pro_subscriptions FOR SELECT USING ((auth.uid() = user_id));


--
-- TOC entry 4788 (class 3256 OID 156543)
-- Name: waiting_payment Users can view their own waiting payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own waiting payments" ON public.waiting_payment FOR SELECT USING ((user_id = auth.uid()));


--
-- TOC entry 4789 (class 3256 OID 156544)
-- Name: pro_subscriptions Users read own subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users read own subscriptions" ON public.pro_subscriptions FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- TOC entry 4790 (class 3256 OID 156545)
-- Name: days_remaining Verified admins can manage days_remaining; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Verified admins can manage days_remaining" ON public.days_remaining USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4791 (class 3256 OID 156546)
-- Name: pro_subscriptions Verified admins can view all subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Verified admins can view all subscriptions" ON public.pro_subscriptions FOR SELECT USING (public.is_verified_admin(auth.uid()));


--
-- TOC entry 4696 (class 0 OID 155690)
-- Dependencies: 360
-- Name: admin_activity_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4697 (class 0 OID 155700)
-- Dependencies: 361
-- Name: admin_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4792 (class 3256 OID 156547)
-- Name: admin_roles allow_read_admin_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY allow_read_admin_roles ON public.admin_roles FOR SELECT USING (true);


--
-- TOC entry 4698 (class 0 OID 155708)
-- Dependencies: 362
-- Name: app_config; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4699 (class 0 OID 155717)
-- Dependencies: 363
-- Name: app_updates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.app_updates ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4700 (class 0 OID 155725)
-- Dependencies: 364
-- Name: audio_tracks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4701 (class 0 OID 155736)
-- Dependencies: 365
-- Name: auth_request_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.auth_request_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4811 (class 3256 OID 156854)
-- Name: chat_messages chat_delete; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY chat_delete ON public.chat_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- TOC entry 4810 (class 3256 OID 156853)
-- Name: chat_messages chat_insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY chat_insert ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- TOC entry 4702 (class 0 OID 155743)
-- Dependencies: 367
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4809 (class 3256 OID 156852)
-- Name: chat_messages chat_read; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY chat_read ON public.chat_messages FOR SELECT USING (true);


--
-- TOC entry 4703 (class 0 OID 155755)
-- Dependencies: 368
-- Name: data_classification; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.data_classification ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4704 (class 0 OID 155762)
-- Dependencies: 369
-- Name: days_remaining; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.days_remaining ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4705 (class 0 OID 155773)
-- Dependencies: 370
-- Name: debug_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.debug_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4706 (class 0 OID 155780)
-- Dependencies: 371
-- Name: device_tokens; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4707 (class 0 OID 155789)
-- Dependencies: 372
-- Name: elite_habits; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.elite_habits ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4708 (class 0 OID 155797)
-- Dependencies: 373
-- Name: email_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4709 (class 0 OID 155804)
-- Dependencies: 375
-- Name: notification_settings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4710 (class 0 OID 155811)
-- Dependencies: 376
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4711 (class 0 OID 155820)
-- Dependencies: 377
-- Name: pro_subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pro_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4712 (class 0 OID 155835)
-- Dependencies: 378
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4713 (class 0 OID 155856)
-- Dependencies: 379
-- Name: rate_limit_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4714 (class 0 OID 155865)
-- Dependencies: 380
-- Name: reflections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4715 (class 0 OID 155873)
-- Dependencies: 381
-- Name: security_audit_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4793 (class 3256 OID 156548)
-- Name: admin_roles simple_read_admin_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY simple_read_admin_roles ON public.admin_roles FOR SELECT USING (true);


--
-- TOC entry 4716 (class 0 OID 155881)
-- Dependencies: 382
-- Name: subscription_plans; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4717 (class 0 OID 155892)
-- Dependencies: 383
-- Name: user_activities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4718 (class 0 OID 155901)
-- Dependencies: 384
-- Name: user_contact_info; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_contact_info ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4719 (class 0 OID 155909)
-- Dependencies: 385
-- Name: waiting_payment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.waiting_payment ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4720 (class 0 OID 155919)
-- Dependencies: 386
-- Name: xp_transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4721 (class 0 OID 155926)
-- Dependencies: 387
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4794 (class 3256 OID 156549)
-- Name: objects   Private Signed URLs Only 1fjm550_0; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "  Private Signed URLs Only 1fjm550_0" ON storage.objects FOR SELECT TO authenticated USING ((auth.role() = 'service_role'::text));


--
-- TOC entry 4795 (class 3256 OID 156550)
-- Name: objects Anyone can view audio files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING ((bucket_id = 'audio-files'::text));


--
-- TOC entry 4796 (class 3256 OID 156551)
-- Name: objects Authenticated users can play audio files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can play audio files" ON storage.objects FOR SELECT TO authenticated USING (((bucket_id = 'audio-files'::text) AND (auth.uid() IS NOT NULL)));


--
-- TOC entry 4797 (class 3256 OID 156552)
-- Name: objects Authenticated users can upload audio; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Authenticated users can upload audio" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'audio-files'::text) AND (auth.role() = 'authenticated'::text)));


--
-- TOC entry 4798 (class 3256 OID 156553)
-- Name: objects Users can delete their own audio files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can delete their own audio files" ON storage.objects FOR DELETE USING (((bucket_id = 'audio-files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4799 (class 3256 OID 156554)
-- Name: objects Users can delete their own profile picture; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can delete their own profile picture" ON storage.objects FOR DELETE USING (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4800 (class 3256 OID 156555)
-- Name: objects Users can update their own audio files; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can update their own audio files" ON storage.objects FOR UPDATE USING (((bucket_id = 'audio-files'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4801 (class 3256 OID 156556)
-- Name: objects Users can update their own profile picture; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can update their own profile picture" ON storage.objects FOR UPDATE USING (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4802 (class 3256 OID 156557)
-- Name: objects Users can upload their own profile picture; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can upload their own profile picture" ON storage.objects FOR INSERT WITH CHECK (((bucket_id = 'profile-pictures'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


--
-- TOC entry 4803 (class 3256 OID 156558)
-- Name: objects Users can view profile pictures; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Users can view profile pictures" ON storage.objects FOR SELECT USING ((bucket_id = 'profile-pictures'::text));


--
-- TOC entry 4722 (class 0 OID 156008)
-- Dependencies: 396
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4723 (class 0 OID 156018)
-- Dependencies: 397
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4724 (class 0 OID 156027)
-- Dependencies: 398
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4725 (class 0 OID 156031)
-- Dependencies: 399
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4726 (class 0 OID 156041)
-- Dependencies: 400
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4727 (class 0 OID 156049)
-- Dependencies: 401
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4728 (class 0 OID 156056)
-- Dependencies: 402
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4812 (class 6104 OID 156559)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--
