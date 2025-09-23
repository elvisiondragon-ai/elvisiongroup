--
-- PostgreSQL database dump
--

\restrict Dg1FKfqnjUEBWxKfAqjm4jomAA4xWXYcHnQMBmRe4efFCRWqqFcIqVWUNgtWByy

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:23 WIB

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

--
-- TOC entry 4079 (class 0 OID 155835)
-- Dependencies: 378
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, display_name, level, experience_points, streak_days, achievements, created_at, updated_at, avatar_url, preferred_language, last_login_date, last_streak_bonus_date, total_verses, total_journal, daily_xp_earned, app_version, user_email, total_elite_habit, analytics_used, last_analytics_date, is_admin, phone_number, verse4_used, is_pro, subscription_type) FROM stdin;
27b15cda-a741-4723-bcca-d7e18e3d0a50	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	93	0	{}	2025-08-28 10:22:08.079621+00	2025-09-23 14:10:03.155+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a/avatar.jpg	auto	2025-09-18	\N	4	3	0	0	nandangstn69@gmail.com	3	0	2025-09-20	f	085221914038	0	f	\N
ab2fe930-d2ab-49f4-a03e-9f21d2d084d7	436f7e17-a23b-4a1b-9e2f-551e3d64ad9e	kurniawanmaghribi	1	0	0	{}	2025-09-19 23:05:42.974358+00	2025-09-19 23:05:42.974358+00	\N	auto	\N	\N	0	0	0	0	kurniawanmaghribi@gmail.com	0	0	2025-09-19	f	\N	0	f	\N
4f3490aa-1f09-4f7b-8b13-30ab8240554a	452f7104-4869-40b8-b62d-b3ba94c74c2f	nurmayni811	1	25	0	{}	2025-08-10 13:34:28.126107+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	1	0	0	nurmayni811@gmail.com	0	0	\N	f	\N	0	f	\N
8c2e8c85-7c8d-40a9-91fd-e020c459fba8	f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b	dragon9	1	0	0	{}	2025-09-19 06:00:13.771942+00	2025-09-19 06:00:13.771942+00	\N	auto	\N	\N	0	0	0	0	dragon9@yahoo.com	0	0	\N	f	\N	0	f	\N
f31a43ec-3254-49b4-8a28-8d0454628eae	75abc8b0-4011-4762-9846-516be2fc7960	trial_sam	1	0	0	{}	2025-08-26 11:15:16.23225+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	trial_sam@elvision.com	0	0	\N	f	\N	0	f	\N
1c78e9a8-667d-4e6d-9e3c-60ca3f69c481	0d9e2e63-a493-4d52-be13-404ff98987af	nurhasanhhsb75	1	0	0	{}	2025-08-25 13:05:47.434072+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	nurhasanhhsb75@gmail.com	0	0	\N	f	\N	0	f	\N
e1b7f848-8993-4fb4-a0aa-a87d48691345	cbbdfa58-c55b-4b0e-b621-57fd752e5300	elroyaldragon	1	0	0	{}	2025-08-22 04:10:34.615941+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	elroyaldragon@gmail.com	0	0	\N	f	\N	0	f	\N
d0826e83-caf9-4acb-8a61-6dccfc515146	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	10	15259	0	{level_3}	2025-08-10 12:51:05.86229+00	2025-09-18 18:43:57.614+00		auto	2025-08-10	\N	1	3	10	0	elvisiondragon@gmail.com	0	1	2025-09-16	f	\N	0	f	\N
d753c6ae-130b-491e-a658-ec2ce8be43d0	ed675b6c-0cd8-4475-aecc-74b921c68b35	Yanti	2	405	0	{}	2025-08-26 09:41:58.292511+00	2025-09-21 00:10:02.681406+00		auto	2025-09-18	\N	41	3	0	0	trial01@yahoo.com	2	0	2025-09-18	f		0	f	\N
9978e728-ed3e-4fb5-a3fe-173507f4a32f	859c9492-e8a7-4d14-b1df-31c174c13d0a	Mega Sari	3	800	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock11@yahoo.com	0	0	\N	f	\N	0	f	\N
03b523cf-edcd-4a7a-9d56-e984d8b48c45	86d4c662-8a7f-48ee-be65-5eccb530cd33	Dani Pratama	5	3200	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock12@yahoo.com	0	0	\N	f	\N	0	f	\N
2e96e967-6bff-4ea4-9b5d-44e86c795103	2f9af795-b3f0-4bf6-b2c7-d517ef16f9c9	Lina Maharani	4	1300	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock13@yahoo.com	0	0	\N	f	\N	0	f	\N
52e71c3e-add7-42b0-a858-1f98e47e6a24	608b5f46-d69b-4136-b224-1fab997563ba	Budi Hartono	4	2100	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock14@yahoo.com	0	0	\N	f	\N	0	f	\N
c5b076f8-73fb-4e43-bee1-00a44d16ca50	08ead0c3-a11d-4b9b-bf2e-abcd56388201	Fitri Handayani	6	5000	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock15@yahoo.com	0	0	\N	f	\N	0	f	\N
a3073619-2481-4907-8ae8-0b55479d1694	783dacfc-7785-476c-95b3-4b3472e7cf74	Suyin Bekasi	3	1100	0	{}	2025-09-17 22:49:13.708515+00	2025-09-23 03:42:06.326+00		auto	2025-09-18	\N	0	0	0	0	mock6@yahoo.com	0	0	\N	f		0	f	\N
087e8906-6836-478e-9633-50a173150b98	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	4	1420	0	{level_3}	2025-08-08 21:03:52.771972+00	2025-09-23 08:28:40.051609+00		auto	2025-08-08	\N	51	68	0	0	deliais2001@gmail.com	6	1	2025-09-16	f		1	f	\N
79431cbe-23c6-4021-a40a-813bfae89717	9658b272-7c15-4ca7-aa18-4fed28aab303	Tastas	1	0	0	{}	2025-09-21 06:44:06.993432+00	2025-09-23 13:25:32.142+00		auto	\N	\N	0	0	0	0	elking.bali@gmail.com	0	0	\N	f	08138383013	0	f	\N
2b2833a9-62ed-4cca-872a-5745084f707b	57626caa-1826-4c53-a6c4-0e4851ff3cc2	agung	1	0	0	{}	2025-09-17 22:19:03.438669+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	agung@itenas.ac.id	0	0	\N	f	\N	0	f	\N
0d792a6e-db08-43b2-95d1-7e4ec94dc129	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	Gustian 	9	12001	0	{}	2025-09-07 14:57:31.232395+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	0	0	0	0	mock1@yahoo.com	0	0	2025-09-16	f	\N	0	f	\N
175c98a8-9cc5-41d1-a6ce-6b6ca238c3db	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	12004	0	{}	2025-09-07 14:58:23.876038+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	0	0	0	0	mock2@yahoo.com	0	0	\N	f	\N	0	f	\N
00309bb8-b589-4f4c-b48a-a1f497a00763	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	111	0	{}	2025-08-24 01:01:57.373532+00	2025-09-18 13:28:18.649272+00	\N	auto	2025-09-18	\N	13	3	0	0	eteriaqueen@gmail.com	0	0	\N	f	\N	0	f	\N
5802813d-39fe-409f-9056-69ba9e1a9ed7	bfa4d0c1-7696-4990-8580-a2593863289a	Elvano	1	0	0	{}	2025-09-20 22:48:33.039867+00	2025-09-20 22:48:33.039867+00	\N	auto	\N	\N	0	0	0	0	acepi0383@gmail.com	0	0	\N	f	\N	0	f	\N
95f7fa50-115b-475b-a707-9a87ba8f2526	4de4d61b-b75b-4c99-a991-39a53767c3c1	vikaagustinus	1	0	0	{}	2025-08-22 05:03:20.045602+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	vikaagustinus@gmail.com	0	0	\N	f	\N	0	f	\N
fa8fcb11-1685-4486-af80-4b13b2fb64f7	ab4529d2-efa9-44aa-8a30-965319c64f65	meefta66	1	0	0	{}	2025-08-22 06:18:49.506972+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	meefta66@gmail.com	0	0	\N	f	\N	0	f	\N
57a3de08-c3bb-4bdb-8073-27b192ab0833	75558106-1c98-4818-b5af-ba72cce16fc1	najwanmart74	1	0	0	{}	2025-09-18 01:15:09.470911+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	najwanmart74@gmail.com	0	0	\N	f	\N	0	f	\N
2c5fe4cb-bfde-4bf4-ac74-2926961e65b3	824f2722-5827-4d20-adc7-5e5d4d3566d8	wandiss588	1	0	0	{}	2025-09-12 19:30:11.666152+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	wandiss588@gmail.com	0	0	\N	f	\N	0	f	\N
0caa085a-f89d-4a02-8375-e789a1d699b4	b1cd65df-f61b-41f8-82da-c87dcb1f75c9	rizkyan23	1	1	0	{}	2025-09-21 01:33:25.521311+00	2025-09-21 01:35:02.470777+00	\N	auto	\N	\N	0	1	0	0	rizkyan23@gmail.com	0	0	\N	f	\N	0	f	\N
1990c42e-4ced-4d39-ae6e-ee89fc3f89dc	a1fc4f6f-fb06-40b4-ad32-f19e198376b0	kiranaadinda090	1	0	0	{}	2025-09-18 01:59:33.012819+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	kiranaadinda090@gmail.com	0	0	\N	f	\N	0	f	\N
098e00fa-9d1d-43f4-b271-e5c9472e0f95	1ad6df3c-856e-415a-913d-be9854827527	yoedhy234	1	1	0	{}	2025-08-23 13:24:19.672037+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	3	0	0	yoedhy234@gmail.com	0	0	\N	f	\N	0	f	\N
612dd953-efad-4d40-833e-9aaec54c7b99	267439bf-0c66-4a47-b1ba-26ab611eea78	mfauzin16	1	13	0	{}	2025-08-23 05:29:16.556278+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	2	0	0	mfauzin16@gmail.com	0	0	\N	f	\N	0	f	\N
a34db619-2785-4e97-ae7c-b3daf1d28425	850faaaa-95b5-4040-9436-28644f9c24cc	fransiscayolanda203	1	0	0	{}	2025-08-19 12:55:48.448287+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	fransiscayolanda203@gmail.com	0	0	\N	f	\N	0	f	\N
7622b186-6eeb-4d70-8e86-4fadc2ec7754	f722341a-78de-430c-b72c-eb40d2c3a684	turmudzky	1	0	0	{}	2025-08-22 07:26:42.306041+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	turmudzky@gmail.com	0	0	\N	f	\N	0	f	\N
91b6af99-57fd-4671-8132-885d8e6f0d7f	b649fb20-91b4-4610-8384-b11c1b07f37f	masduqikhoirunnas	1	0	0	{}	2025-09-07 02:39:21.438372+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	masduqikhoirunnas@gmail.com	0	0	\N	f	\N	0	f	\N
c20e4f82-ec9a-43fe-8193-d300b67b3b0a	5f250128-655b-41a4-af15-9df32a5ca672	okipambudi	1	50	0	{}	2025-08-09 12:53:20.067749+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-09	\N	1	0	0	0	okipambudi@gmail.com	0	0	\N	f	\N	0	f	\N
c49adb3c-9064-4d81-a23c-23f5d1ff6b30	f6560fca-177d-497f-9225-a597ed888589	astawe	3	925	0	{level_3}	2025-08-10 12:36:37.656527+00	2025-09-23 13:49:20.19296+00		auto	2025-08-10	\N	54	22	0	0	astawebogor@gmail.com	0	0	\N	f	\N	0	f	\N
f101d440-aac5-4457-8a9a-d7fe345444b0	01e2bd25-76e5-42ce-b761-121caf83e53c	trader.anshori	1	0	0	{}	2025-08-14 07:35:59.945897+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-14	\N	0	0	0	0	trader.anshori@gmail.com	0	0	\N	f	\N	0	f	\N
1e178f36-0441-4e07-a585-aa8b6a034517	716e24e3-7f10-4df2-b64b-2cd6a05f937b	Andrie	1	96	0	{}	2025-08-10 17:44:22.119398+00	2025-09-18 04:58:27.584041+00		auto	2025-08-10	\N	0	1	0	0	andrieforthis@gmail.com	0	0	\N	f	\N	0	f	\N
01f6958a-462e-4076-8da4-2e8b67ec28ad	ef2002f9-7a58-4d14-8f10-4a0c804d89d9	akubahagia214	1	10	0	{}	2025-08-15 13:13:38.810645+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	0	0	0	0	akubahagia214@gmail.com	0	0	\N	f	\N	0	f	\N
6f73a11a-b210-468d-b0e3-57d8e7b3c3c5	a2149c29-1196-4f88-ac65-a97ffefdb8b5	vadliyes	1	0	0	{}	2025-08-10 22:57:17.353212+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	vadliyes@gmail.com	0	0	\N	f	\N	0	f	\N
66623d12-3306-44e8-9366-bd6cae5b8184	5d7bfc55-8600-4f57-a6ff-44846139dbce	hendralesmana27.hl96	1	0	0	{}	2025-08-10 22:20:10.325983+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	hendralesmana27.hl96@gmail.com	0	0	\N	f	\N	0	f	\N
9c64f73c-84f3-4fea-8e11-17623f3abe05	a1b28688-7d7d-4c16-a82b-62610a389d82	david_greeley	1	0	0	{}	2025-08-11 04:30:03.803524+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-11	\N	0	0	0	0	david_greeley@yahoo.com	0	0	\N	f	\N	0	f	\N
2616c26d-baee-4d90-82f3-d94c9261be53	139a1f11-400e-4a21-9682-4936eaf7c43f	andy75polo	1	20	0	{}	2025-08-13 00:25:06.646019+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-13	\N	0	0	0	0	andy75polo@gmail.com	0	0	\N	f	\N	0	f	\N
f7056ca4-5318-4adc-94f4-2f16eae14864	271a608c-0b55-4e42-9d13-293ad20e914e	armadi Hokky 	2	349	0	{}	2025-08-17 04:47:03.180888+00	2025-09-21 17:17:05.716858+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/271a608c-0b55-4e42-9d13-293ad20e914e/avatar.jpg	auto	2025-08-17	\N	21	8	0	0	armadijambi98@gmail.com	0	1	2025-09-21	f	\N	0	f	\N
5e3cfa20-ceda-4b01-bea2-e36e56712074	84955e07-c412-49d9-998c-a40c3340bf76	erikaruddyana	1	15	0	{}	2025-08-15 23:47:05.049319+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	0	1	0	0	erikaruddyana@gmail.com	0	0	\N	f	\N	0	f	\N
e4353ae1-632f-4d20-a558-5ee8558ac55f	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	yutoazon	1	25	0	{}	2025-08-17 22:22:52.250308+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-17	\N	0	1	0	0	yutoazon@gmail.com	0	0	\N	f	\N	0	f	\N
30c5743b-43bf-4b5c-a17b-349abdacfa91	feaa7960-1bb4-4f7c-9281-62b34f519097	muhamadrizal67	1	0	0	{}	2025-08-16 02:12:34.368832+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-16	\N	0	0	0	0	muhamadrizal67@gmail.com	0	0	\N	f	\N	0	f	\N
00ec266e-3308-4b56-bfcf-66052e28b569	9c9c8939-2137-4637-a5b7-f4c98c861376	segarmeriah05	1	3	0	{}	2025-08-15 23:49:54.94412+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	1	0	0	0	segarmeriah05@gmail.com	0	0	\N	f	\N	0	f	\N
379428ed-7d61-482a-83de-8a6d5bae8f4a	a2e8495f-d2c1-4e04-9db5-faa976f59207	Adi Setyo	1	110	0	{}	2025-08-10 09:30:40.178897+00	2025-09-18 04:58:27.584041+00		auto	2025-08-10	\N	0	3	0	0	fiaapfianayunias@gmail.com	0	0	2025-09-19	f	\N	0	f	\N
33639e85-0f8b-4ad3-8d13-f912e476a4b4	6ac2b995-a108-4fca-a91d-0d89095e1865	pharnaw	1	0	0	{}	2025-09-18 02:43:00.952876+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	pharnaw@gmail.com	0	0	\N	f	\N	0	f	\N
b77306d5-a430-420d-a106-702075edea10	71a968fa-20e2-40a3-b260-004d43cca420	Admin	1	2	0	{}	2025-08-09 11:52:17.70146+00	2025-09-18 04:58:27.584041+00		auto	2025-08-09	\N	0	0	0	0	deliais@yahoo.com	0	0	\N	f	\N	0	f	\N
41b81b24-fa97-45d6-bf06-314c3abcb0e6	8dd5df2e-73f1-4939-b0fb-312c88561c71	paryantonetpreneur	1	30	0	{}	2025-08-09 16:37:31.695228+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-09	\N	0	0	0	0	paryantonetpreneur@gmail.com	0	0	\N	f	\N	0	f	\N
5bac7061-62b3-445a-8a7d-01d67d12f696	dc756812-f530-4f52-baf3-d1d5506ac3d7	ariadyskm1967	1	0	0	{}	2025-08-10 03:53:51.583194+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	ariadyskm1967@gmail.com	0	0	\N	f	\N	0	f	\N
ec57e828-b847-463d-a156-e02bf5e4f9be	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	2	202	0	{}	2025-08-10 03:21:37.838769+00	2025-09-18 04:58:27.584041+00		auto	2025-08-10	\N	0	12	0	0	karimahabdhafidz.lamaran@gmail.com	0	0	\N	f	\N	0	f	\N
71f2a9a6-35f0-47d6-b91f-d7c2e80cde25	6b95deec-d01e-421d-863a-7f60b107217b	mastur.mha	1	0	0	{}	2025-08-10 00:55:18.220018+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	mastur.mha@gmail.com	0	0	\N	f	\N	0	f	\N
6204ada0-2d6c-401f-886d-bfd57017f34f	b5795b79-a98d-4a0e-90fe-0002b2a03153	donyprattiwa	1	20	0	{}	2025-08-10 13:22:17.753398+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	donyprattiwa@gmail.com	0	0	\N	f	\N	0	f	\N
81e366e7-912c-4da4-98ba-8b9c64e01dde	4f065a25-a458-4d75-86cc-bf80e8009f4c	laura_dahsyat	1	10	0	{}	2025-09-20 09:08:38.811786+00	2025-09-23 13:49:50.960199+00	\N	auto	\N	\N	1	0	0	0	laura_dahsyat@yahoo.com	0	0	\N	f	\N	0	f	\N
e01f606f-2608-4e50-bcb3-175185ea62d2	0c12da4d-9494-4516-9d3d-c74d6d605412	mnanangsyifa	1	10	0	{}	2025-08-10 13:52:15.793128+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	mnanangsyifa@gmail.com	0	0	\N	f	\N	0	f	\N
30987d79-abe1-4ab4-ac1d-20f037defd54	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	mumtazfeppi55561	1	60	0	{}	2025-08-10 05:56:46.75894+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	mumtazfeppi55561@gmail.com	0	0	\N	f	\N	0	f	\N
80b8e976-e0a4-4197-b80a-0381675e9bc1	2faeed2c-65c5-4fae-8b96-b1a08fc95547	nurmadokdon	1	0	0	{}	2025-08-10 10:27:09.973211+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-10	\N	0	0	0	0	nurmadokdon@gmail.com	0	0	\N	f	\N	0	f	\N
58bc0bda-2fd3-467a-a1b0-81a32e1758bb	22be002e-651c-4ec9-99a4-5432637f4706	Mujiyono	1	0	0	{}	2025-08-22 15:03:36.748656+00	2025-09-21 14:33:15.43+00		auto	2025-09-18	\N	0	0	0	0	penghusadanuswantara@gmail.com	0	0	2025-09-20	f	0883844033199	0	f	\N
908a024d-eafc-4c99-8d58-f7d046f7d6a4	1342fc5a-94b0-4e05-9dc4-43d676cbd3fe	suryanto.raka91	1	0	0	{}	2025-08-14 05:41:42.528754+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-14	\N	0	0	0	0	suryanto.raka91@gmail.com	0	0	\N	f	\N	0	f	\N
4a9738cf-55d5-4fbf-838f-6f22bb0b4633	d14df823-5cfe-4698-a0d7-19b2a49ba058	robinhalim90	1	40	0	{}	2025-08-13 17:07:52.476886+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-13	\N	1	0	0	0	robinhalim90@gmail.com	0	0	\N	f	\N	0	f	\N
8ba86687-c117-4f60-bbdc-55ab09404b43	3f41a2b4-e9b0-4210-9964-036dc46ce95c	fenny.susi	1	0	0	{}	2025-09-21 11:38:07.505827+00	2025-09-21 11:38:07.505827+00	\N	auto	\N	\N	0	0	0	0	fenny.susi@gmail.com	0	0	\N	f	\N	0	f	\N
74b3619c-f020-40f8-ae65-9b351825b553	c97115a4-d8e4-43c7-a9bd-9efa1345479b	ais	1	0	0	{}	2025-09-07 11:59:22.923035+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	0	0	0	0	aisyahmuslimah1@gmail.com	0	0	\N	f	\N	0	f	\N
f25b52eb-eff4-4410-9318-96522de90ea8	4adfa5ae-f994-4afa-bd15-f57aadf7abcf	khozinabd1	1	0	0	{}	2025-09-18 03:09:49.124837+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	khozinabd1@gmail.com	0	0	\N	f	\N	0	f	\N
36869c45-473d-4e9d-8bd5-dcb3c18a1531	6c665bce-5174-4d59-ad9a-077feccd68be	ydone25	1	2	0	{}	2025-09-07 03:30:44.511332+00	2025-09-21 01:26:43.477177+00	\N	auto	2025-09-18	\N	2	0	0	0	ydone25@gmail.com	0	0	\N	f	\N	0	f	\N
489e0cc5-e23e-4310-8514-65afd16d510c	1424b737-4447-4ced-835c-ad9d50ec255f	madusekeluarga	1	92	0	{}	2025-08-22 14:50:43.107126+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	6	0	0	0	madusekeluarga@gmail.com	0	0	\N	f	\N	0	f	\N
06d8777a-6e12-4321-a7c1-c87bcdca6d90	a695e42f-5b3e-4c5d-b462-97910d15fdfb	sutedjachandra	1	41	0	{}	2025-08-22 17:42:13.780523+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	sutedjachandra@gmail.com	0	0	\N	f	\N	0	f	\N
23909811-2bab-441b-bc0d-896daace780d	bf17a1f6-2629-45d7-b836-9453c259b308	serdaduwareng990	1	5	0	{}	2025-08-22 10:40:34.56371+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	1	0	0	serdaduwareng990@gmail.com	0	0	\N	f	\N	0	f	\N
786fb891-20d8-4c8e-9f58-cb79f9385f60	1de9ce2b-75bd-4f06-8463-3a6f7a0a9f74	nickyandreanfriday	1	0	0	{}	2025-08-28 12:06:59.787543+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	nickyandreanfriday@gmail.com	0	0	\N	f	\N	0	f	\N
c60058cd-dd9e-4c45-9f3f-c775a035967f	b894a1c3-2f26-42c0-b924-96aac802096f	mayabintang65	1	101	0	{}	2025-08-29 14:45:05.069527+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	13	3	0	0	mayabintang65@gmail.com	0	0	\N	f	\N	0	f	\N
b1641c03-be43-4b9f-addc-5a6687ab495e	d0a5e8dc-d19d-4e3d-8151-84717e325b97	anak.pinpintar	1	0	0	{}	2025-08-31 22:47:10.262838+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	anak.pinpintar@gmail.com	0	0	\N	f	\N	0	f	\N
dbeb061c-72d0-4a9a-bca7-10da30b1627d	bebce233-0b99-42c3-bf88-7f79a10eface	dunisan	1	0	0	{}	2025-08-28 15:18:38.169829+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	dunisan@yahoo.com	0	0	\N	f	\N	0	f	\N
63b0e250-6dd8-4f4a-8e89-8c3309075ce6	608aecb8-f54d-4efd-9aed-19e921a89244	rajasyuryadi788078	1	10	0	{}	2025-08-24 13:49:50.422117+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	rajasyuryadi788078@gmail.com	0	0	\N	f	\N	0	f	\N
d9b60467-38f9-4fd7-906f-aa09f9c50cca	bd1ecf18-a37e-462d-b6b3-f593a979ffe3	rifan.andrean	1	10	0	{}	2025-08-21 05:01:54.163662+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	rifan.andrean@yahoo.com	0	0	\N	f	\N	0	f	\N
7555fc05-c841-407d-8a87-0491f397e026	e0943114-4539-42ad-81b1-b72dff358451	andnasnan	1	0	0	{}	2025-08-21 04:25:20.486837+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	andnasnan@gmail.com	0	0	\N	f	\N	0	f	\N
52640616-1a79-4f97-aac6-55fc6e45b73f	7f29c1dd-39cb-4290-b1ff-d8984002952a	lee.cerl78	1	30	0	{}	2025-08-21 04:28:26.7829+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	lee.cerl78@gmail.com	0	0	\N	f	\N	0	f	\N
8278e8db-4b0f-4135-aa98-10017a6b1dd5	d828905b-bf9a-4672-9233-8411c39d4371	Agustinus	10	15000	0	{}	2025-09-07 15:00:17.38949+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	0	0	0	0	mock5@yahoo.com	0	0	\N	f	\N	0	f	\N
e3fcb745-5766-44fa-9b5d-6056a596fac8	7bc81c9a-9db5-4ac8-a0ac-5e7961db5b7d	amujib67	1	11	0	{}	2025-09-11 01:57:57.708394+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	2	0	0	0	amujib67@gmail.com	0	0	\N	f	\N	0	f	\N
83efbc9d-fa38-4e05-a4ed-69d50c49e0a5	038c077c-08e4-4d9f-adb3-053d0e9dde0b	neoronny	1	2	0	{}	2025-09-10 23:22:05.093643+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	2	0	0	0	neoronny@gmail.com	0	0	\N	f	\N	0	f	\N
08330e33-0c9a-46e7-b17c-294e06f5dbac	75aabba9-a7aa-42e5-a037-41198fff96c9	elenervina00	1	0	0	{}	2025-08-30 15:05:46.191232+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	elenervina00@gmai.com	0	0	\N	f	\N	0	f	\N
c8374509-8b7f-401c-8366-514b2c859538	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	Tian Leeeee	10	15003	0	{}	2025-09-07 14:59:56.610519+00	2025-09-19 04:05:00.918+00		auto	2025-09-18	\N	0	1	0	0	mock4@yahoo.com	0	0	\N	f	081383801234	0	f	\N
2135837f-fb38-477e-a009-f8253025da2d	c6dba04f-6496-4380-8eb7-def736566c22	m6013631	1	0	0	{}	2025-08-22 08:00:53.961019+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	m6013631@gmail.com	0	0	\N	f	\N	0	f	\N
fd9f51db-7996-4218-a965-ba8e49036974	770eaf3a-8c48-469e-aeb8-5232915f3194	donisan	1	0	0	{}	2025-08-23 14:40:34.698399+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	donisan@yahoo.com	0	0	\N	f	\N	0	f	\N
8ef7c4ff-5a6f-4ebf-a35e-86ae0dd6ea00	4b923036-d1f4-4be1-aba5-80f29f5e0cc7	koessemba	1	0	0	{}	2025-08-22 12:43:14.223291+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	koessemba@gmail.com	0	0	\N	f	\N	0	f	\N
6a9bd324-ff0b-4373-83aa-fad404ca8771	b03b0ff6-c23e-4941-a2b3-759ff31fce69	sahrannyfiraa	1	0	0	{}	2025-08-23 10:29:22.599561+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	sahrannyfiraa@gmail.com	0	0	\N	f	\N	0	f	\N
9f6d7461-7179-4d2a-b392-b83616fab7b8	f5196caa-0872-4d57-aa96-2777731107cb	george.d.mata	1	0	0	{}	2025-08-23 03:41:50.453555+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	george.d.mata@gmail.com	0	0	\N	f	\N	0	f	\N
8b60f7d7-58cb-4b0c-8c75-cb4fde70e8b2	92210ba9-cad2-4439-90b2-f8b6723b4bb5	Yanti	1	75	0	{}	2025-08-23 12:43:37.810041+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	0	1	0	0	sharyanti999@gmail.com	0	0	\N	f	\N	0	f	\N
e53cd1f5-ee18-4001-8604-f6a5b1f97b3a	ace95bc7-7dfa-4840-ab5c-e344a0054aac	fritsedwardp	1	2	0	{}	2025-08-24 15:57:12.947963+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	2	0	0	0	fritsedwardp@gmail.com	0	0	\N	f	\N	0	f	\N
e0701b91-0918-40d0-8b26-f74c24c4011c	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	394	0	{}	2025-08-10 00:15:32.542608+00	2025-09-18 10:22:52.620748+00		auto	2025-08-10	\N	5	1	0	0	syuryadi@gmail.com	0	0	\N	f	\N	0	f	\N
8898defe-c652-49ca-8b5d-e55d5d68e1f9	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	135	0	{}	2025-08-25 06:14:56.772168+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	14	9	0	0	harridavionkrisnata@gmail.com	0	0	2025-09-18	f	\N	0	f	\N
ad79a358-fb12-475f-bf80-5b975bf4e6f0	3b9a6af9-4d80-4ec0-aa6b-d09af74b7cff	feliciaquincy8989	1	0	0	{}	2025-08-25 13:52:04.34213+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	feliciaquincy8989@gmail.com	0	0	\N	f	\N	0	f	\N
bd749bfb-a34e-4c13-adf5-5a8f13a5bc6d	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	purnamahadi043	1	35	0	{}	2025-08-11 12:58:17.207132+00	2025-09-23 13:24:09.633502+00	\N	auto	2025-08-11	\N	1	3	0	0	purnamahadi043@gmail.com	0	0	2025-09-23	f	\N	0	f	\N
af91ea70-98df-439f-b69d-071fac14f5db	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	476	3	{}	2025-08-08 20:59:06.234797+00	2025-09-23 13:35:28.475+00		auto	2025-08-27	\N	28	21	0	0	srcindocs@gmail.com	5	1	2025-09-16	f		1	f	\N
bc303480-fea0-47e6-bd28-b3eebf6a9ed8	429b3c65-bd6c-49d0-9de8-a9f79be00840	ibnuaziz4f	1	0	0	{}	2025-08-20 17:18:03.114558+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	ibnuaziz4f@gmail.com	0	0	\N	f	\N	0	f	\N
8505b29d-06da-44e0-9c62-d2da92b2c7d3	b464e576-8fe3-43cc-bf22-d983edeebb5d	nadramm	1	10	0	{}	2025-08-22 12:18:22.279283+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	nadramm@gmail.com	0	0	\N	f	\N	0	f	\N
82adec27-4625-4fe5-8edf-be39ead5104f	ab68113b-cba7-4243-9544-8d932abcb521	Putri Wahyudi	8	9011	0	{}	2025-09-07 14:59:21.303067+00	2025-09-18 04:58:27.584041+00		auto	2025-09-18	\N	1	0	0	0	mock3@yahoo.com	0	0	\N	f	\N	0	f	\N
7c311c07-9e89-44f2-9fad-60548916d1fe	1388e8fc-22fd-4e49-8008-cca9ce79c4ed	trial2	1	0	0	{}	2025-08-29 17:15:49.454752+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	trial2@yahoo.com	0	0	\N	f	\N	0	f	\N
061b9bed-0958-41fa-ad5d-00c2433822b5	8e136c02-3e19-4a7c-938e-83d4d9c4a9f2	ibrahim30	1	0	0	{}	2025-08-31 21:20:28.153797+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	ibrahim30@yatdew.com	0	0	\N	f	\N	0	f	\N
0e99ad65-7dbc-4d20-a007-cb9747ecf396	6a0e36a5-c136-472a-9dd9-e8263ba84d43	surya.daary13	1	0	0	{}	2025-08-23 16:48:18.569539+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	surya.daary13@gmail	0	0	\N	f	\N	0	f	\N
0bda98b9-b406-43fd-b4cb-fcd0f5f3f96f	f8f15133-909d-47fc-97d1-3ee1e6f385ff	irccloud2025.1	1	0	0	{}	2025-09-07 13:43:28.029459+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	irccloud2025.1@gmail.com	0	0	\N	f	\N	0	f	\N
f9035357-d68b-4ea1-925c-813f885a2998	a2531f03-3428-410e-abbc-06ef9f4ffe43	fajar.sdq	1	10	0	{}	2025-09-07 14:45:54.519298+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	1	0	0	0	fajar.sdq@gmail.com	0	0	\N	f	\N	0	f	\N
9139af9a-0a8d-4330-8dd1-b4a42508f0cd	b10da140-8998-44fe-9b5f-22f1e5e89a1e	dendi123	1	0	0	{}	2025-08-28 10:12:21.147975+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	dendi123@yahoo.com	0	0	\N	f	\N	0	f	\N
11826138-e37c-48f6-908c-f226ced97b51	ecbe6450-0abe-48cd-9cce-ac9f2c7e6d19	ajaibperubahan	1	0	0	{}	2025-08-24 21:41:04.791726+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	ajaibperubahan@gmail.com	0	0	\N	f	\N	0	f	\N
af3a8564-5823-4391-9249-02928e4bee65	fa4ab5f0-e030-4aa8-910b-1580f1fd1cc0	oen.tourtravel02	1	0	0	{}	2025-08-25 07:59:30.578957+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	oen.tourtravel02@gmail.com	0	0	\N	f	\N	0	f	\N
476f7dab-d816-4c36-895e-b47acc263240	9eca5149-cfda-4b82-96fa-d6d870f0e71d	anggun2001	1	0	0	{}	2025-08-08 21:18:35.26511+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-08	\N	0	0	0	0	anggun2001@yahoo.com	0	0	\N	f	\N	0	f	\N
4bd6eaed-f39e-4cd4-b41b-dab014a0622b	1957b1b9-0523-4254-a5f9-afbbb1260ded	adityaherlansyah526	1	0	0	{}	2025-08-09 17:21:51.222634+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-09	\N	0	0	0	0	adityaherlansyah526@gmail.com	0	0	\N	f	\N	0	f	\N
03a38d63-8f6e-455c-b0cc-521eb12bd249	53a25652-85fc-49ac-8790-47c44a19d1c4	Dr Sahendra	1	0	0	{}	2025-08-09 22:11:56.828593+00	2025-09-18 04:58:27.584041+00		auto	2025-08-09	\N	0	0	0	0	silahkm@yahoo.com	0	0	\N	f	\N	0	f	\N
d99b1f7b-55b6-4ecc-b36c-6445068cb79f	ba6c3708-dc6c-435b-9967-befdabdb52ed	dewinurmayah	1	0	0	{}	2025-08-09 18:56:06.930173+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-09	\N	0	1	0	0	dewinurmayah@gmail.com	0	0	\N	f	\N	0	f	\N
83f8d12d-d6b5-4db5-b077-d4a09a1f7c2b	92ced4fc-185e-40f7-b813-63c38df4977e	abykholid28	1	0	0	{}	2025-08-09 23:24:17.006158+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-09	\N	0	0	0	0	abykholid28@gmail.com	0	0	\N	f	\N	0	f	\N
beeeaa63-4277-4a2a-a155-67f9e3eb6ed9	6317b3e8-005d-4c08-b6da-d8de06289fa7	Ananda malang	1	0	0	{}	2025-08-09 18:59:18.953658+00	2025-09-18 04:58:27.584041+00		auto	2025-08-09	\N	0	0	0	0	ananda_malang@yahoo.com	0	0	\N	f	\N	0	f	\N
7b7dd899-b9e2-4425-a3d3-2902f0aceebd	91f3b294-d544-4d42-9639-a30efa64783e	Hartono	1	26	0	{}	2025-08-11 06:57:18.832427+00	2025-09-18 04:58:27.584041+00		auto	2025-08-11	\N	0	1	0	0	ahmadnurhartono@gmail.com	0	0	\N	f	\N	0	f	\N
4879fb13-0abf-498f-b43a-d6350dd9da75	d5f611bf-95bf-4c40-8987-c964aa49ed95	brahmansiadariasli	1	0	0	{}	2025-08-16 03:10:15.59831+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-16	\N	0	0	0	0	brahmansiadariasli@gmail.com	0	0	\N	f	\N	0	f	\N
3e44666f-50d5-4502-9b32-00c26d63a4a6	c11cbf79-7e1a-41f4-95ef-9e0e4bd9df27	taaween01	1	0	0	{}	2025-08-17 03:16:42.825144+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-17	\N	0	0	0	0	taaween01@gmail.com	0	0	\N	f	\N	0	f	\N
7ab14a44-da60-41fb-b4dc-ecbb601ae6e9	c2f94d37-5057-4b2d-88e9-78d902463745	fajarcakrawala102	1	0	0	{}	2025-08-15 23:56:50.53506+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	0	0	0	0	fajarcakrawala102@gmail.com	0	0	\N	f	\N	0	f	\N
e6992499-75b3-41e8-909e-aac2f9d70f69	89a48ea9-d245-432d-93a5-6a7f7fb69bd9	juhana.aja	1	0	0	{}	2025-08-17 12:01:43.461305+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-17	\N	0	0	0	0	juhana.aja@gmail.com	0	0	\N	f	\N	0	f	\N
17fc6985-b033-4c26-914f-094ea086afba	d079c984-0ba6-442e-8ebe-73e064b8bf3e	karimahabdulhafidz	2	251	0	{}	2025-08-26 01:57:04.864452+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	4	0	0	karimahabdulhafidz@gmail.com	0	0	\N	f	\N	0	f	\N
78355c49-ff85-4392-8ab4-e5096c939def	6771e805-ffae-4367-b691-0c310e8fa6cf	steventirukan879	1	0	0	{}	2025-08-18 12:01:44.661249+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-18	\N	0	0	0	0	steventirukan879@gmail.com	0	0	\N	f	\N	0	f	\N
fa6ec41b-06eb-468b-aa23-0917b8073772	9305c52e-c5d4-4a7b-b3ea-4474ac531795	ibrahimmardianapasa	1	116	0	{}	2025-08-15 15:34:43.669098+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	0	1	0	0	ibrahimmardianapasa@gmail.com	0	0	\N	f	\N	0	f	\N
65a57d60-5bdd-4f96-9ad7-df9b23528d8d	713b8999-755c-4e1d-8609-b7ac4cd6a76b	reselleraction	1	0	0	{}	2025-08-15 22:33:08.93345+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-15	\N	0	0	0	0	reselleraction@gmail.com	0	0	\N	f	\N	0	f	\N
5d91f123-126b-4c12-9900-17bdd2a7d9a6	a5324ccb-3584-43d3-9706-9ab2155f2bbf	mahharazza	1	120	0	{}	2025-08-12 03:07:25.08696+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-12	\N	0	0	0	0	mahharazza@gmail.com	0	0	\N	f	\N	0	f	\N
32811bb2-4a62-452a-9047-690a038217b5	c27809c6-e219-4f57-87c1-e367be4d5674	armienthalib74	1	0	0	{}	2025-08-13 14:46:33.549638+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-13	\N	0	0	0	0	armienthalib74@gmail.com	0	0	\N	f	\N	0	f	\N
458c4a9c-bcbd-4882-bb0f-2d70410b808f	9a214089-fab2-4635-9939-affac7bc96f5	adinugroho.ae	1	50	0	{}	2025-08-16 03:12:43.085443+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-16	\N	1	0	0	0	adinugroho.ae@gmail.com	0	0	\N	f	\N	0	f	\N
391fb548-5f5c-4ac8-9160-63b6f5229c3b	f3d71e97-fccd-4ecd-8417-a19627ef7297	wansmochammad	1	0	0	{}	2025-09-19 10:28:10.333292+00	2025-09-19 10:28:10.333292+00	\N	auto	\N	\N	0	0	0	0	wansmochammad@gmail.com	0	0	\N	f	\N	0	f	\N
977f4dc9-bd4b-43ae-9665-cbd6f8285c1e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	193	2	{}	2025-08-10 15:52:51.59451+00	2025-09-19 19:12:11.815+00		auto	2025-08-27	\N	9	17	0	0	dragon@yahoo.com	4	0	2025-09-16	t	081383838913	0	f	\N
27d0e980-772c-4019-a951-6257cd396d3e	93cf09d0-9c02-43c1-9b88-f2fbb8323ac5	acep80329	1	0	0	{}	2025-08-18 03:50:59.382382+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-18	\N	0	0	0	0	acep80329@gmail.com	0	0	\N	f	\N	0	f	\N
6c789515-c102-4a76-a245-36653df47f18	d93b09d5-17de-4055-ab37-d4c70d0293fe	mencana kair	1	0	0	{}	2025-09-19 06:13:44.45991+00	2025-09-19 06:14:52.536+00		auto	\N	\N	0	0	0	0	testuser01@yahoo.com	0	0	2025-09-19	f	0811231313332	0	f	\N
568065d2-5fff-468c-bf75-ffc7f02568af	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	15053	0	{}	2025-08-28 19:13:40.392782+00	2025-09-21 12:18:18.290884+00		auto	2025-09-18	\N	15	11	0	0	elreyzandra@gmail.com	3	1	2025-09-19	f	088138353013	0	f	\N
181b206d-31b4-45c6-b91f-aa38a15537b3	93819275-d50f-40d7-b404-6e1043b33265	Thomas Al Akbar	1	21	0	{}	2025-09-19 07:41:49.872324+00	2025-09-19 07:56:02.431903+00	\N	auto	\N	\N	2	1	0	0	thomasakbar66@gmail.com	0	0	2025-09-19	f	\N	0	f	\N
ed4be9e3-35fe-4482-b2e2-6ed5905c1a9d	18d08fe3-6f60-4abc-a51e-75360e88d54c	Abdul Rahman	3	522	0	{level_3}	2025-08-10 08:33:25.625168+00	2025-09-23 04:14:35.47558+00		auto	2025-08-10	\N	38	1	0	0	rahman79id@gmail.com	0	0	\N	f	\N	0	f	\N
5f5f5a12-3338-4858-a461-ef76cc1b129c	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	2	355	0	{}	2025-08-09 15:48:10.917715+00	2025-09-23 07:19:29.825241+00	\N	auto	2025-08-09	\N	13	11	0	0	rudinazawa@gmail.com	2	0	2025-09-20	f	\N	0	f	\N
59088f38-1e99-4ffb-a34e-122428e7fb81	0612726d-b0fd-417f-9fae-b4e6bd79e5cd	Merry 	1	1	0	{}	2025-08-11 04:57:32.966709+00	2025-09-18 04:58:27.584041+00		auto	2025-08-11	\N	0	0	0	0	elroyaljewelry@gmail.com	0	0	\N	f	\N	0	f	\N
d5f55053-c725-479f-aabe-e74a2757d7b7	08c375cf-3e32-486b-b211-4c28e6239093	Harir	2	229	0	{}	2025-08-10 00:37:09.171326+00	2025-09-19 16:02:04.770223+00		auto	2025-08-10	\N	13	5	0	0	cikung_unya@yahoo.com	0	0	\N	f	\N	0	f	\N
51a7e04c-3699-4cc1-ad70-a9eb918ae6cb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	380	3	{}	2025-08-09 21:48:08.794746+00	2025-09-21 13:20:55.792065+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/4ae66262-c0c1-41d4-b9dd-684dd282bdfc/avatar.jpg	auto	2025-08-28	\N	17	27	0	0	pengembar4muda@gmail.com	0	0	\N	f	\N	0	f	\N
e2b9bd04-0893-4cb4-8219-c0b8401cad6c	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	6	4569	0	{level_3}	2025-08-09 11:07:55.805298+00	2025-09-18 04:58:27.584041+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/38625adb-dcfb-4bac-b473-2e6ee37af72e/avatar.jpg	auto	2025-08-09	\N	0	7	0	0	mochseno91@gmail.com	1	0	\N	f	\N	0	f	\N
26560c4d-37fa-47c5-a79f-5c5f38f97c2a	a4d0becf-27fe-4a16-bd74-8aa39fb9578a	jraymondsusilo	1	1	0	{}	2025-08-22 01:08:14.417122+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	jraymondsusilo@gmail.com	0	0	\N	f	\N	0	f	\N
4482a013-fbee-4bdf-a35e-94db58c614af	f6492019-02bb-4783-b172-53f7e71bdc5c	syaif0475	2	163	0	{}	2025-08-09 23:47:19.438322+00	2025-09-20 09:41:08.442548+00	\N	auto	2025-08-09	\N	18	0	0	0	syaif0475@gmail.com	0	0	\N	f	\N	0	f	\N
dd2b22bf-c14a-4b57-b424-66312cee8cf4	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	362	0	{}	2025-08-22 02:43:11.227314+00	2025-09-18 19:26:50.530198+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/e0d3d6b1-5b49-4920-995e-1e15d25f22b4/avatar.jpg	auto	2025-09-18	\N	2	1	0	0	aneukeyz@gmail.com	3	0	2025-09-18	f	\N	0	f	\N
e82d5d11-d79d-4f7a-9edc-7a10235e5c59	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	3	1162	0	{level_3}	2025-08-10 04:06:36.370035+00	2025-09-20 03:02:06.503406+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/74a895f6-e11e-47a6-b4d3-a89092905776/avatar.jpeg	auto	2025-08-10	\N	28	56	0	0	evira.rotorasiko37@gmail.com	0	0	2025-09-20	f	\N	0	f	\N
4c7fb41b-67d3-4c37-87db-44286eb5f195	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	chyecoding	2	263	0	{}	2025-08-09 11:19:19.558649+00	2025-09-18 23:36:29.175055+00	\N	auto	2025-08-09	\N	5	10	0	0	chyecoding@gmail.com	0	0	\N	f	\N	0	f	\N
b4a99ecb-20f6-4712-9f3f-8f991b20b401	1b6155c3-bc45-4efb-92b3-cc951f6df745	alresky5746	1	0	0	{}	2025-08-23 14:33:07.125065+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	alresky5746@gmail.com	0	0	\N	f	\N	0	f	\N
a07dca9c-1e6e-41ba-a8a7-7c54786cd2b2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	3	608	1	{level_3}	2025-08-10 07:29:06.741142+00	2025-09-21 13:53:13.522851+00	\N	auto	2025-08-25	\N	34	10	0	0	syarifudin.arif77@gmail.com	0	0	2025-09-20	f	\N	0	f	\N
589b176c-e569-4d49-bf46-be8ffc90646a	4253f35e-0225-4f27-9c42-1eba42715aea	oktavi05andri	1	2	0	{}	2025-08-14 04:00:48.329059+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-14	\N	0	1	0	0	oktavi05andri@gmail.com	0	0	\N	f	\N	0	f	\N
6aa16ed8-afcd-41aa-9a0d-1245ee584464	1943dc74-6e3e-4208-bd20-42f168635e18	mauludy.arshady	1	0	0	{}	2025-08-23 14:43:22.249134+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-09-18	\N	0	0	0	0	mauludy.arshady@gmail.com	0	0	\N	f	\N	0	f	\N
c870d3b7-e02e-4ffe-b701-fe7a9c9f2c9a	8fa357c9-4450-4e90-b3c9-6886f7159287	hendi	1	1	0	{}	2025-08-16 01:14:58.029014+00	2025-09-18 04:58:27.584041+00	\N	auto	2025-08-16	\N	0	0	0	0	hendi@yahoo.com	0	0	\N	f	\N	0	f	\N
4b1274ad-1895-4058-86e0-5a5ea2d386da	b2803bb9-d737-4420-8eb0-4a6deed56216	charismoch259	2	262	0	{}	2025-08-09 18:17:15.055317+00	2025-09-18 04:58:27.584041+00	https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/b2803bb9-d737-4420-8eb0-4a6deed56216/avatar.jpg	auto	2025-08-09	\N	10	5	0	0	charismoch259@gmail.com	0	0	2025-09-21	f	\N	0	f	\N
350e1746-53d1-4872-9390-e380526b594b	ba9ff5cb-bc04-4734-ba4e-d0765d6c8a2b	Sari Kusuma	4	1800	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock7@yahoo.com	0	0	\N	f	\N	0	f	\N
7366fa3a-0390-4590-8fb1-6b0607f92440	9f70dac9-dd00-4875-aee5-db4d7e5c23d3	Ahmad Santoso	5	2500	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock8@yahoo.com	0	0	\N	f	\N	0	f	\N
023b3089-c295-4878-9976-4019991e5cae	02ea17ec-b799-4873-84a2-f2272aad53a6	Dr. Hendro Wijaya	5	2600	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 03:22:08.408703+00	\N	auto	\N	\N	0	0	0	0	mock10@yahoo.com	0	0	\N	f	\N	0	f	\N
242c9c3a-a302-4060-8a2f-e47edd9e996b	fa3cefa6-bd80-403e-b874-9143b65bcf5b	Dewi Anggraini, A.Md.Keb	3	800	0	{}	2025-09-23 03:22:08.408703+00	2025-09-23 05:43:10.925913+00	\N	auto	\N	\N	0	0	0	0	mock9@yahoo.com	0	0	\N	f	\N	0	f	\N
e01a651c-177a-489d-8666-bc189dd236b2	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	3	961	0	{level_3}	2025-08-10 03:47:41.336406+00	2025-09-20 07:20:01.914012+00		auto	2025-08-10	\N	39	17	0	0	kikisandhi@gmail.com	0	1	2025-09-23	f	\N	0	f	\N
4745a179-b749-40e1-bb7e-410d9f882d8f	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	1576	2	{level_3}	2025-08-10 00:08:40.51429+00	2025-09-23 11:29:15.592511+00	\N	auto	2025-08-31	\N	29	59	0	0	nurul.helmie@gmail.com	3	1	2025-09-23	f	\N	0	f	\N
\.


-- Completed on 2025-09-23 21:20:27 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict Dg1FKfqnjUEBWxKfAqjm4jomAA4xWXYcHnQMBmRe4efFCRWqqFcIqVWUNgtWByy

