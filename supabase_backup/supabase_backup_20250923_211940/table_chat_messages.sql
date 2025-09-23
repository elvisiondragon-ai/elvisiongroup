--
-- PostgreSQL database dump
--

\restrict pzgQKNCgSjUeYn7gj1UpSCmh4wEqSHOKeMb43Aq7G1OledDyVzrWJYW4PWvQvc7

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:27 WIB

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
-- TOC entry 4082 (class 0 OID 155743)
-- Dependencies: 367
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, user_id, user_name, user_level, is_pro, message, created_at, channel_id, is_private, allowed_users, subscription_type, is_admin) FROM stdin;
340319ff-3992-4c11-a715-361ad2c24c6e	00000000-0000-0000-0000-000000000001	Budiyas32	3	f	asik banget apknya	2024-01-01 02:15:00+00	community	f	\N	\N	f
4b1cfdd0-2701-4fd5-b2fb-de691ba958af	00000000-0000-0000-0000-000000000002	dudungsubang	2	f	bener lebih mudah denger audionya ada historynya lagi	2024-01-01 02:16:00+00	community	f	\N	\N	f
5d04defb-f77e-43f8-907f-2b8692a2e0c9	00000000-0000-0000-0000-000000000003	andiniwati	2	f	iya jadi betah diam di aplikasi	2024-01-01 02:16:00+00	community	f	\N	\N	f
617b6753-aa61-45f2-b4da-f37903e5b0d7	00000000-0000-0000-0000-000000000004	Jason	3	f	wah iya nih ada sistem game juga	2024-01-01 02:18:00+00	community	f	\N	\N	f
442b7223-ce04-465d-a694-b415214ecaea	00000000-0000-0000-0000-000000000005	Andin	9	f	bener mas anto, seru ngejar poinnya hehe	2024-01-01 02:18:00+00	community	f	\N	\N	f
ad168240-7ade-45af-83d8-83bada08ceea	00000000-0000-0000-0000-000000000006	Master Yoga	8	f	Peringkatku naik terus nih, jadi semangat	2024-01-01 02:19:00+00	community	f	\N	\N	f
488b29be-adb3-4210-a4de-beaf18eaab62	00000000-0000-0000-0000-000000000007	SitiAisyah	2	f	fitur history itu yg paling ngebantu aku sih	2024-01-01 02:22:00+00	community	f	\N	\N	f
d9b051ab-e5f8-40b0-8597-0fd60b566b43	00000000-0000-0000-0000-000000000008	EkoPrasetyo	2	f	setuju, ga perlu cari ulang audio yg kemarin didengerin	2024-01-01 02:22:00+00	community	f	\N	\N	f
523eac46-4e5b-4aa1-80be-fcfb3c5919d4	00000000-0000-0000-0000-000000000009	IwanSetiawan	2	f	Tampilannya juga bersih, ga ribet, enak diliat	2024-01-01 02:25:00+00	community	f	\N	\N	f
dc19511d-ee88-49f0-a122-d5e0b113db42	00000000-0000-0000-0000-000000000010	DewiLestari90	1	f	baru download kemarin, langsung sukaa	2024-01-01 02:30:00+00	community	f	\N	\N	f
40bd8d83-c82f-4b4a-9c1e-aef4aad00fd7	00000000-0000-0000-0000-000000000011	Bambang_P	3	f	selamat datang mba dewi, dijamin nagih wkwk	2024-01-01 03:15:00+00	community	f	\N	\N	f
aeff3aee-3a78-4e64-bd7e-8a62a5e5272e	00000000-0000-0000-0000-000000000012	PutriAyu	2	f	notifikasinya juga ga ganggu, pas banget timingnya	2024-01-01 03:17:00+00	community	f	\N	\N	f
8fd668e9-367b-4524-92e1-09d0fd44fcaa	00000000-0000-0000-0000-000000000013	JokoWibowo88	2	f	Betul, ngingetin pas ada konten baru aja	2024-01-01 03:17:00+00	community	f	\N	\N	f
2a4692e7-3c40-4682-9f25-4e8ba3f451d4	00000000-0000-0000-0000-000000000015	RatuAisyah	3	f	aku baru dapet yg 'Expert', susah bgt yg master	2024-01-01 03:21:00+00	community	f	\N	\N	f
619741e3-d8d7-490e-843d-12dc8434885a	00000000-0000-0000-0000-000000000017	HeruSantoso	2	f	wih mantap, kejar ah	2024-01-01 03:22:00+00	community	f	\N	\N	f
7a394a6c-e42d-4c4e-a029-ab282164224c	00000000-0000-0000-0000-000000000018	LindaWati	3	f	Suka bgt sama playlistnya, bisa bikin sendiri	2024-01-01 04:40:00+00	community	f	\N	\N	f
a5d7adb7-59f0-4b3d-9400-bc83063614dd	00000000-0000-0000-0000-000000000019	AhmadZaini	3	f	iyaa, aku kelompokin per topik jadi gampang belajarnya	2024-01-01 04:41:00+00	community	f	\N	\N	f
fe27dfb1-b8b3-4163-898a-63c254e463cf	00000000-0000-0000-0000-000000000020	CitraKirana	3	f	Adminnya juga responsif, kemarin aku lapor bug cepet ditanggepin	2024-01-01 04:45:00+00	community	f	\N	\N	f
714d03d1-a6fd-482f-9c33-b39e49a9125a	00000000-0000-0000-0000-000000000021	UjangTea	1	f	dua jempol buat developernya	2024-01-01 04:46:00+00	community	f	\N	\N	f
d5c8cbe2-43b0-492c-8823-472b869f752f	00000000-0000-0000-0000-000000000022	MegaChan	2	f	Kualitas audionya jernih, pake headset makin mantap	2024-01-01 04:48:00+00	community	f	\N	\N	f
ae839289-5291-46e6-97a1-a33baeca9495	00000000-0000-0000-0000-000000000023	FirmanHakim	1	f	bener, ga pecah suaranya	2024-01-01 04:48:00+00	community	f	\N	\N	f
ad4ffe80-d904-41c0-ae9a-edc79b0ba074	00000000-0000-0000-0000-000000000024	Sari_Love	2	f	aku malah suka dengerin sambil masak, jadi ga bosen	2024-01-01 04:50:00+00	community	f	\N	\N	f
14ef1200-d297-4af9-8acd-2096aab53cf9	00000000-0000-0000-0000-000000000025	WawanKurniawan	1	f	ide bagus tuh mba sari, patut dicoba	2024-01-01 04:52:00+00	community	f	\N	\N	f
9c2a03b9-d2c6-409c-9d7d-2e5d2f761b30	00000000-0000-0000-0000-000000000026	DianPermata	2	f	Gamenya itu loh, simpel tapi bikin penasaran	2024-01-01 04:54:00+00	community	f	\N	\N	f
bcded674-43a0-4243-98d4-56c1dc87d46b	00000000-0000-0000-0000-000000000027	FajarNugroho	2	f	bener, ga sadar udah main setengah jam sendiri	2024-01-01 04:55:00+00	community	f	\N	\N	f
e53af71c-b227-4984-858b-e9d8431fb498	00000000-0000-0000-0000-000000000028	IndahPermatasari	1	f	Poinnya bisa dituker ga sih?	2024-01-01 04:58:00+00	community	f	\N	\N	f
2ba22706-b591-44f9-8168-2741e57b4c2d	00000000-0000-0000-0000-000000000029	Admin_Renata	1	f	Belum bisa kak Indah, tapi ditunggu aja updatenya ya :)	2024-01-01 05:05:00+00	community	f	\N	\N	f
6d7d31d6-db61-43e4-8d73-226403c6e041	00000000-0000-0000-0000-000000000030	AndiMalaka	1	f	wih adminnya muncul	2024-01-01 06:30:00+00	community	f	\N	\N	f
9dd79f66-1044-4c20-b583-d0f624296cb6	00000000-0000-0000-0000-000000000031	BayuPradana	2	f	siap min, ditunggu fitur barunya	2024-01-01 06:31:00+00	community	f	\N	\N	f
af13f276-94a4-4f0d-90c0-87f4cbf2721b	00000000-0000-0000-0000-000000000032	KartikaSari	3	f	Semoga ada fitur dark mode ya min kedepannya	2024-01-01 06:35:00+00	community	f	\N	\N	f
11487381-6bda-456c-9982-6b52c71a237f	00000000-0000-0000-0000-000000000033	Nurhayati85	2	f	setuju bgt, biar hemat batre juga	2024-01-01 06:36:00+00	community	f	\N	\N	f
77171b87-b11a-4bc4-afc3-4e9832660ae6	00000000-0000-0000-0000-000000000034	RudiHartono	2	f	Apk ini ringan banget, ga bikin hp lemot	2024-01-01 06:40:00+00	community	f	\N	\N	f
da077ddd-6a49-4b75-8631-d8a7f8d5c562	00000000-0000-0000-0000-000000000035	TeguhPrasetyo	2	f	iya di hp kentangku juga lancar jaya	2024-01-01 06:40:00+00	community	f	\N	\N	f
38ea2cc1-16b3-4501-ba81-d726ec8b62ad	00000000-0000-0000-0000-000000000036	VinaPanduwinataKW	2	f	Gokil, ini aplikasi yg kucari selama ini	2024-01-01 08:02:00+00	community	f	\N	\N	f
cb1e37d7-49ab-40be-82e7-d59f0c3630e7	00000000-0000-0000-0000-000000000037	YusufMaulana	3	f	Rekomen ke temen2 kantor, pada suka semua	2024-01-01 08:05:00+00	community	f	\N	\N	f
9fab74a9-5d34-4c03-920a-8b4ce0f29826	00000000-0000-0000-0000-000000000038	ZainalAbidin	2	f	Komunitasnya juga asik, jadi nambah temen	2024-01-01 08:08:00+00	community	f	\N	\N	f
1088b1f8-9095-46e7-a03f-738d0446f302	00000000-0000-0000-0000-000000000039	AsepSunandar	1	f	bener kang, pada ramah semua disini	2024-01-01 08:09:00+00	community	f	\N	\N	f
700194e5-3c31-444f-a1a6-537dea4f5d25	00000000-0000-0000-0000-000000000040	BungaCitra	3	f	pokoknya aplot konten baru terus ya min, jangan kasih kendor	2024-01-01 08:12:00+00	community	f	\N	\N	f
16cba0a5-c0f8-4ae4-9daf-1d4c004de400	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	t	Selamat malam semuanya, selamat menikmati meditasi dengan pikiran yang lepas.	2025-09-23 12:30:33.95984+00	community	f	\N	1_year	f
b9fb5d74-030e-4130-a42e-cb8534317f2c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Pagi kak	2025-09-20 23:31:06.289021+00	community	f	\N	1_day	f
91914932-46a8-44f4-b572-f30d96a9a6d6	c87bea01-bfbf-4b1f-afe0-9e8cb291af55	John Smith	2	f	Keren	2025-08-10 21:14:02.1803+00	community	f	\N	\N	f
53a6f875-1fe6-4041-a4ba-c66ec58ef7c7	2df8c250-3bbf-4df6-8ec4-13ae11783c9a	Khalid Al-Farouq	2	f	Semoga lancar	2025-08-10 21:15:02.1803+00	community	f	\N	\N	f
6088a5b0-83e8-41c8-9a92-4b0ba24fe56d	87537a09-4b4f-405e-b07a-5cba6573abcd	Haruki Tanaka	2	f	Saya suka desainnya	2025-08-10 21:16:02.1803+00	community	f	\N	\N	f
39efa706-0528-4ffe-bb99-3f3f4a93e880	704df8fc-1841-41ba-b8d8-f223483f7164	Hans Müller	2	f	Akhirnya! Sebuah aplikasi yang tidak merepotkan. Saya buka, dan semuanya sudah dalam bahasa Inggris	2025-08-10 21:12:02.1803+00	community	f	\N	\N	f
852ebdc9-f42e-4fb0-aa9f-3bc7e885348c	d4ffd5fd-d9c6-4b4a-90a3-7463d05faaae	Claire Dubois	2	f	Cara aplikasi ini menyambut saya dalam suara terasa begitu personal, siapakah itu All father yang dimaksud ?	2025-08-10 21:13:02.1803+00	community	f	\N	\N	f
1da6b2f0-99c3-4ca5-b8a3-c5f8544128b7	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	abimail	1	f	Mau daftar Pro kemana yah, semua yang chat pro semua ini	2025-09-17 14:47:09.387773+00	community	f	\N	\N	f
67ce8e7c-cfe4-4f55-acec-e6ed4bdbb644	00000000-0000-0000-0000-000000000014	HendraGunawan	4	t	eh ada yg udah dapet badge 'Master' belum?	2024-01-01 03:20:00+00	community	f	\N	\N	f
0439d877-a1f7-4fec-8d31-187995111f04	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Pagi	2025-09-18 23:20:16.999169+00	community	f	\N	\N	f
d8c23b87-f591-452d-88f6-a1ac112c9e32	00000000-0000-0000-0000-000000000016	SuryaAdi	4	t	Master harus selesain 100 audio tanpa skip kalo gasalah	2024-01-01 03:21:00+00	community	f	\N	\N	f
30a138b1-6022-44c4-871c-0b9f8a88a34e	00000000-0000-0000-0000-000000000041	CandraWijaya	4	t	setiap hari pasti buka aplikasi ini, udah jadi kebiasaan	2024-01-01 08:20:00+00	community	f	\N	\N	f
079bbc5e-adf9-4881-9509-a48c0579f69f	00000000-0000-0000-0000-000000000042	DoniSaputra	4	t	sama, pagi2 dengerin audio disini bikin semangat kerja	2024-01-01 08:21:00+00	community	f	\N	\N	f
927c03a1-d11b-4962-b1a7-cc05d297ba7b	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	mlm	2025-09-23 13:28:12.781276+00	community	f	\N	\N	f
65546ada-8b2c-40bf-8e11-95afd9f67bee	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	😄	2025-08-10 18:42:28.916231+00	community	f	\N	1_year	f
5e1b83b8-208a-475e-b3f1-180e8d4bc740	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	t	Wow aku pro 🥰🥰	2025-08-22 03:30:56.926722+00	community	f	\N	\N	f
aec9abf1-8647-47d5-ba67-45f027377dc6	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Tiap verse nya luar biasa	2025-08-23 23:12:53.834727+00	community	f	\N	1_month	f
a5bc4b48-3470-4809-b58a-21d259472a2a	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Adminnya banyak membantu dan Responsif	2025-08-28 13:58:40.49034+00	community	f	\N	\N	f
11549d7b-4cb6-4bd6-9b35-8d67326fdb7e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Terimakasih saya sampaikan kepada  admin yang responsif dan sangat membantu	2025-08-28 14:02:50.965904+00	community	f	\N	\N	f
27100631-d098-448b-aa3b-57a17d9c50a6	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	Segar nya setelah yoga dengar verse ke 5 😍😍	2025-08-12 06:14:37.080645+00	community	f	\N	1_year	f
67186edc-d73e-45d5-8a58-18cb10d965c6	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	Baru pada bermunculan	2025-08-13 14:24:02.47023+00	community	f	\N	1_year	f
28a9df6d-5839-4974-bc4c-f420efffa63d	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	Di level ku lama naiknya nikmati verse 7 dan 8 nya	2025-08-15 01:33:03.601818+00	community	f	\N	1_year	f
8dc085a9-b230-4a3b-a8a8-121c189a7846	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Setuju👍	2025-09-06 21:55:40.804759+00	community	f	\N	1_month	f
634f7c5c-c139-4259-a850-568db7167fe2	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	f	Puji syukur Tuhan YME atas segala kedamaian dan mindfullness ini, sehingga hidup jadi lebih terarah dan mudah, rezeki lancar dari segala arah.	2025-09-12 11:26:05.005255+00	community	f	\N	1_year	f
029e3ff9-0040-4049-9b5e-1660be37eb79	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	Gustian 	9	t	Sebenarnya di telegram itu ga semua orang punya biasa pake whatsapp. udah ada app ini saya delete telegram hehe	2025-09-15 13:19:12.267308+00	community	f	\N	1_year	f
dd5c8f4b-201c-4c79-b35f-015000e51088	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	Seru	2025-08-28 20:22:30.270784+00	community	f	\N	1_year	f
d7dc3642-845e-49d6-979f-f1ee8eeef180	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	t	Masyaa Alloh Tabaarokalloh  genius	2025-08-30 05:28:42.663292+00	community	f	\N	1_month	f
fc6e2de4-f41e-4dda-93f6-5cb2ce8134b1	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	4	t	Itu tombol upgrade pro di profil bang	2025-09-17 15:35:07.41862+00	community	f	\N	1_month	f
d3dfc66f-26a8-4fe1-8a93-88223a841e69	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Selamat pagi tetap semangat terus bersyukur an Nikmati prosesnya..	2025-09-05 21:34:34.404175+00	community	f	\N	1_month	f
dde39be3-f9ef-4ab2-a416-f7792321c61d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah pagi ini penuh keberlimpahan rezeki dari berbagai arah	2025-09-08 21:41:16.00067+00	community	f	\N	1_month	f
1da98057-4a4c-45af-8516-e1a1f02498e0	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	t	Alhamdulillah, semakin hari semakin membaik..	2025-09-13 22:30:39.801037+00	community	f	\N	1_month	f
962ece15-657c-4c91-8eee-76ead0161ce1	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	4	t	Keren personal analysis nya	2025-09-15 23:59:07.407229+00	community	f	\N	1_year	f
18ca5909-a9e1-4ea9-a1fa-82ad99609e9d	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Sangat bermanfaat fiturnya	2025-09-16 22:39:15.423389+00	community	f	\N	\N	f
702cb778-87ce-4085-9ab2-dcbd77bdf644	22be002e-651c-4ec9-99a4-5432637f4706	Mujiyono	1	f	Selamat sore kak admin	2025-09-20 09:48:06.003121+00	community	f	\N	\N	f
e1eeeb5e-1fd2-42d4-be80-02ef685cb796	22be002e-651c-4ec9-99a4-5432637f4706	Mujiyono	1	f	Mau nanya kak, untuk awal dengarkan audio yang mana dulu dan di dengarkan waktu kapan selama berapa hari	2025-09-20 10:42:43.918183+00	community	f	\N	\N	f
c8a23439-3bb1-4099-a932-2ed96cdeb4c2	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Selalu bisa digeser audio nya kak	2025-09-08 08:02:02.329161+00	community	f	\N	1_day	t
f5e51795-e3a6-43cd-96d7-76e207ac04a2	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Assalamu'alaikum warahmatullahi wabarakaatuh, pagi kak admin	2025-09-20 22:53:00.445729+00	community	f	\N	\N	f
fd6dfdb9-03e5-4eb8-ae16-4f8fea55798f	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Personal analysis sudah bisa digunakan, silahkan berkomentar !	2025-09-15 21:47:44.50947+00	community	f	\N	1_day	t
20fc71d9-4317-48ae-ae32-dea48de9993c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Basic Ignis tidak masalah kak ☺️	2025-09-15 21:48:13.092646+00	community	f	\N	1_day	t
6d55f484-b9e7-4fa3-985f-2fb9cc195050	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Sudah Ramai	2025-08-22 11:03:29.117149+00	community	f	\N	\N	t
813635e4-1f88-4e3f-bea9-7a4138107e94	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Server Maintenance Semalam, sekarang sudah bisa diakses	2025-08-23 22:37:42.951679+00	community	f	\N	\N	t
0238f0a3-ef21-4962-85ca-c4aa33df854c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Cache nya bersihkan	2025-08-27 09:16:55.507924+00	community	f	\N	\N	t
394b934d-557e-4167-ac5e-85e07715d3ab	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Tolong berikan saya komentar di Chat Ekosistem tentang Fitur terbaru seperti analisis agar saya bisa mengetahui feedback 😊	2025-09-16 22:05:20.199604+00	community	f	\N	1_day	t
fdb31c53-7cad-4857-a06a-295f578f12ec	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Kak Armadi jangan pakai trial01, pakai gmail saja biar lebih aman, ketik lupa password jika lupa	2025-09-18 11:29:26.809601+00	community	f	\N	1_day	f
f9b2715a-04de-4109-ad4e-7f185a2997b2	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Bersihkan cookie dan cache adalah solusi dari error	2025-08-29 06:22:17.61766+00	community	f	\N	\N	t
603fe1a1-6436-4b58-a8c0-705e7fbdb967	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Silahkan Klik Kak Nandang di Beranda Cara Menggunakan Aplikasi 😊 DM saya jika perlu bantuan spesifik	2025-09-21 01:21:52.143161+00	community	f	\N	1_day	f
c932b7c2-05f8-4f8f-89ab-072398200e2b	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	t	Assalamu'alaikum warahmatullahi wabarakaatuh, Sore, Perkenalkan saya Nandang Setiawan dari Tasikmalaya , Salam buat Altather dan admin Renata, ....mau tanya nih " Bagaimana kiat menjalankan program el-Vision agar Sukses mencapai tujuan.Terimakasih. wassalam	2025-09-21 08:35:03.024062+00	community	f	\N	1_month	f
91cf3289-6ce0-4af3-9939-8360b59d0c25	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Personal analysis bisa dibaca admin ?	2025-09-18 12:46:12.230216+00	community	f	\N	\N	f
c2c6c4b6-a6da-46d5-bdba-0fe0f97003c9	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	4	f	Disini aja kelas nya, lebih lengkap fitur disini dibanding telegram?	2025-09-15 13:13:38.666605+00	community	f	\N	1_year	f
05ea60c7-8350-43fd-b8dd-2605e1a54554	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	3	t	Makin mantap aja aplikasinya	2025-09-18 12:03:22.892842+00	community	f	\N	1_month	f
79d89277-1372-4b60-85b3-0dc879ce8bcc	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah pagi lebih nyaman dari sebelumnya Terima kasih hidupku yang penuh Cinta keberlimpahan	2025-08-24 20:44:32.249057+00	community	f	\N	1_month	f
8c4090db-47b8-43e6-9631-beceeb53ff92	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Jurnalnya keren bgt bikin kita bebas ber expresi	2025-08-14 04:49:00.540029+00	community	f	\N	1_month	f
37901527-5add-4e3c-8ea1-102d82845c8a	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah rezeki berkah berlimpah hari ini	2025-08-27 22:28:51.793144+00	community	f	\N	1_month	f
470859b8-7e67-4b59-b820-62f06db11177	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah sudah bisa login lagi, terimakasih banyak team suport Allfather	2025-08-23 22:42:56.473183+00	community	f	\N	1_month	f
df64671a-6844-47c2-8651-0346753af4d4	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah sudah bisa mnyimak Audio Bait 5, luar biasa lebih power pool badan lbih terasa nyaman. Terimakasih Allfather aplikasinya	2025-08-24 06:44:11.602998+00	community	f	\N	1_month	f
3a28a1fa-3a3e-405b-b5af-5a64972c6c2c	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Alhamdulillaah selepas sholat subuh shubuh saya dengar audionya	2025-08-28 23:17:28.414082+00	community	f	\N	\N	f
788bd14e-08ce-4a40-9b23-f2e515cc8288	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	f	Awali aktivitas pagi ini dengan rasa Syukur in Syaa Allah rezeki datang dari berbagai Arah berkah berlimpah Aamiin...	2025-09-01 21:59:34.228201+00	community	f	\N	1_month	f
68419466-f50e-4f42-9338-ce4ad4224c66	608b5f46-d69b-4136-b224-1fab997563ba	Budi Hartono	4	f	Baru selesai saya meditasi, terima kasih banyak analyticsnya	2025-09-23 13:52:25.253749+00	community	f	\N	1_month	f
2b4c93a2-383a-435e-9eef-975b37e463a7	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	4	t	Tenang nya verse 5, boleh ga sih itu itu aja?	2025-09-06 00:42:02.814727+00	community	f	\N	1_year	f
3a38d9b8-7b8c-4c6a-af6b-7a3321765fae	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Bisa dijelaskan error nya kak eteria? ☺️	2025-09-01 05:19:40.569668+00	community	f	\N	\N	t
a5c6a467-7fe2-4bb2-bb6d-66b14444aeed	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Diskusi disini kak  😃	2025-09-15 15:58:51.891192+00	community	f	\N	1_day	t
41ee7461-9b0f-4689-8b68-7829613f4ca5	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	t	Hai	2025-08-22 02:20:09.170994+00	community	f	\N	\N	f
d9e97436-3030-464b-98f7-52b72019c354	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Alhamdulillah hari ini tenang dan damai berkat apk ini	2025-08-17 05:45:13.446987+00	community	f	\N	1_month	f
6f949ae3-3869-49ce-afb6-591a50daeab1	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Makin keren aja ni aplikasinya	2025-08-23 09:54:47.700008+00	community	f	\N	1_month	f
7b3223ed-e3e0-45c8-8495-f8404e672ea1	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Isi energi dulu	2025-08-23 23:22:13.221297+00	community	f	\N	1_month	f
4979d384-51e9-4030-8ab9-db305303157c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	f	Tidak bisa karena analytics dibuat instan menggunakan algoritma elite habit, jurnal dan verse. Setelah itu terhapus dari sistem. 😊	2025-09-18 12:50:49.191293+00	community	f	\N	1_day	f
dbaa4117-c667-4535-95d7-07629d08b662	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	All father Dan El vision memang jenius Masya Allah tabarakallah	2025-08-10 14:53:57.598788+00	community	f	\N	\N	f
ef9da40e-e173-4db4-92f7-58e09055fd2f	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	Wah pada baru datang yah	2025-08-10 16:09:41.39765+00	community	f	\N	1_year	f
fb21bc01-bdea-4dd8-8a9c-7dfecbc1acfd	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Selamat siang semuanya, khusus nya allfather ,admin Renata dan admin naga, semoga Sukses semuanya, bahagia selalu, berkah dan sentiasa dalam lindunganNya, Aamiin Alloohumma Aamiin	2025-09-23 05:02:05.042273+00	community	f	\N	1_month	f
a81805ae-48e2-4a9b-8322-1475109145ad	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Selamat siang semuanya, khusus nya allfather ,admin Renata dan admin naga, semoga Sukses semuanya, bahagia selalu, berkah dan sentiasa dalam lindunganNya, Aamiin Alloohumma Aamiin	2025-09-23 05:05:37.03787+00	community	f	\N	1_month	f
9b9e5c5b-2259-47df-98ff-85484b462981	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	1	f	Selamat Siang juga	2025-09-23 05:11:35.448415+00	community	f	\N	1_year	f
4f38ed0b-3ed6-4f6f-a8b4-48512aa4e9be	2f9af795-b3f0-4bf6-b2c7-d517ef16f9c9	Lina Maharani	4	f	Selamat siang juga semuanya, salam jika all father ada	2025-09-23 05:06:51.399243+00	community	f	\N	1_month	f
598f82e2-0789-4662-a3c4-f35bcca7aa7a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	9	t	Fokus ke hasil nyata mendengar audio lebih baik, dengan rutin sebanyak mungkin sehari, aplikasi ini menjadi cerminan raport, dunia nyata menjadi sangat bagus, raportnya nya dari aplikasi ini level tinggi	2025-08-10 17:51:10.777869+00	community	f	\N	1_year	f
84745969-d0a6-4879-b5ec-26c8def9eb13	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	1	f	test	2025-08-10 14:49:12.571272+00	community	f	\N	1_year	f
6ba56a3b-d068-4c2c-a14e-e1a0f45946a6	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Alhamdulillah baru selesai verse 4 , bismillah semoga segera mendapatkan pekerjaan yang di idamkan aamiin 🤲	2025-08-10 15:56:01.362233+00	community	f	\N	\N	f
3418d55d-d1a3-48f2-a2e8-cb85f17c7b66	1d808e86-012a-4b30-80fa-c7fc2cc22c1c	Budia itb	1	f	Salam	2025-09-19 15:18:20.472614+00	community	f	\N	\N	f
929e6582-929d-4727-96b5-4dcfcc74dc78	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Yeaaay level 2 🤩, target mengejar lv 9	2025-08-10 18:11:14.398232+00	community	f	\N	\N	f
7108c267-3141-4330-a8ab-df82a203483d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Berkumpul dengan orang baik energi positifnya pasti mnyebar mnjadi vibrasi yg lebih baik, dan pastinya akan menjadi energi keberlimpahan,  di komunitas inilah  Elvision genesis tempatnya..	2025-08-13 13:54:18.767878+00	community	f	\N	1_month	f
46e2ad0a-ac02-4c3d-a4bc-f1f3c68f8e1a	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Slamat pagi smua, mau changer energi dulu.	2025-08-13 23:34:34.004987+00	community	f	\N	1_month	f
df36dcac-b160-4b9a-a9da-52e1bff50933	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	Sampurasun	1	f	Maksudnya telegram itu apa ya abang semua ? ada aplikasi lain kah  selain disini ?	2025-09-15 13:25:51.867012+00	community	f	\N	\N	f
36226250-9a43-47e7-a917-6efd4e7d3f0d	4d235fb2-c132-4bfa-b38a-9232f60f7ba7	Luki Rohman	1	f	Izin cara pakai aplikasi bagaimana ?	2025-09-19 16:06:07.278933+00	community	f	\N	\N	f
2deaa4a4-1ded-4a4e-99a8-031b276368b4	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	2	t	Alhamdulillah bisa meditasi lagi, thank you all father🙏	2025-08-15 16:25:12.021373+00	community	f	\N	1_month	f
d59129b9-69b3-49bd-b775-e85a7ceb9985	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Bisa meditasi pagi, badan lebih fres , trimaksih  all father 🙏	2025-08-15 20:24:04.300095+00	community	f	\N	1_month	f
94806ab5-7c06-4ee0-abc7-72770419f5d9	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Terima kasih App ini sangat membantu, saya semakin mudah menjalankan EL-Vision	2025-08-09 13:56:38.855537+00	community	f	\N	1_month	f
5f8bdc40-844e-4092-92a3-d90150a42ca2	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	2	t	Alhamdulillah dah bisa masuk ke pro😇	2025-08-22 06:16:05.535736+00	community	f	\N	1_month	f
8da7af75-5364-4c40-805a-3261c3e9d880	f6560fca-177d-497f-9225-a597ed888589	astawe	1	t	Begitu nyaman dan teduh hati ini, selesai dengar audio versi4,full batre tubuh	2025-08-11 08:05:22.968632+00	community	f	\N	1_month	f
6a7c8dfc-28be-4526-bc72-393ad988dbfc	f6560fca-177d-497f-9225-a597ed888589	astawe	1	t	Selamat pagi semua, salam sehat dan sukses selalu, selesai meditasi 2 menit,segar rasanya	2025-08-12 00:57:57.514578+00	community	f	\N	1_month	f
0f31fb30-040c-4066-ad83-00d8298b1380	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	1	t	Semakin hari semakin positif mendengar audio dari all father	2025-08-12 05:42:16.497673+00	community	f	\N	1_month	f
034319db-203c-452f-84e7-52686a4f6e99	f6560fca-177d-497f-9225-a597ed888589	astawe	1	t	Baru denger audio versi4 sambil mata sedikit terbuka lebih terasa nyaman, terhindar dari ngantuk	2025-08-12 11:59:24.912942+00	community	f	\N	1_month	f
9d8d285b-c7d4-43bb-8ed3-099c0977de8e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Alhamdulillah, puji Tuhan dapat masuk di komunitas, semangat untuk semua	2025-08-28 13:55:51.828912+00	community	f	\N	\N	f
3d2e1d50-4823-4ae7-b14e-bb39ad65c42a	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Aplikasi ini sangat membantu dan bermanfaat	2025-08-28 13:57:02.065046+00	community	f	\N	\N	f
de293b30-0d51-4a87-8d9e-5fb8bd78789e	18d08fe3-6f60-4abc-a51e-75360e88d54c	Abdul Rahman	1	f	alhamdulillah dan terima kasih sudah diberikan kesempatan untuk mencoba aplikasi ini	2025-08-16 07:13:53.032521+00	community	f	\N	\N	f
b29fd8be-b2d0-425a-bc33-a59352b98df4	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Salam kenal bagi rekan2 semua	2025-08-28 13:59:47.403046+00	community	f	\N	\N	f
e5cb772b-ec51-4b18-9d42-fc6340ff639e	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Kereen	2025-08-29 10:41:04.899491+00	community	f	\N	\N	f
cd648731-0d25-4b88-a693-881b1a8edad4	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Selamat pagi sahabat semua selalu bersyukur Nikmati perjalanan nya tetap semangat..	2025-09-04 21:38:15.746263+00	community	f	\N	1_month	f
a5913f8b-c2ac-4d8e-83fb-83c21ffb6517	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Mengulang lagi dr level 1 gpp tapi aplikasi ini memudahkan untuk semakin semangat🔥	2025-08-10 17:14:43.523528+00	community	f	\N	1_month	f
208f5974-7def-4f60-8157-020c8d75208d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Alhamdulillah aplikasinya keren banget, dengan aplikasi ini jadi lebih termotivasi untuk agenda hariannya, Terimakasih allfather.	2025-08-10 20:15:52.677004+00	community	f	\N	1_month	f
e92ad066-9306-4b78-9967-9cc66b195c06	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Aplikasi ini sangat membantu luar biasa	2025-08-10 14:59:12.06537+00	community	f	\N	1_month	f
ed953c1b-e1bc-4689-9035-0aea66427599	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Mantap bgt ini ngejar poinnya	2025-08-10 15:00:19.004402+00	community	f	\N	1_month	f
93545402-8167-418a-ab84-5a8f88a3619f	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Alhamdulillah... ✨🙏	2025-08-28 14:18:45.762292+00	community	f	\N	1_month	f
9550340f-064a-4d83-a558-739aa5a22a60	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Alhamdulillahi 'alaa kulli haal,  aplikasi ini  sangat mudah digunakan makin betah dibuatnya✨	2025-08-28 14:23:42.469238+00	community	f	\N	1_month	f
cc2a02bf-3160-430a-9edb-08bc1a6625cb	71a968fa-20e2-40a3-b260-004d43cca420	Admin	1	f	Udah rame aja, nitip gorengan dulu	2025-08-10 23:13:07.359965+00	community	f	\N	\N	f
5753fcb5-2870-4391-a007-23b39d07ebda	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	apa	2025-08-28 06:42:08.21884+00	community	f	\N	1_year	f
c284f932-8a82-4030-9678-f54553ff14d9	08c375cf-3e32-486b-b211-4c28e6239093	Harir	1	t	Assalamualaikum.  Weekly challenge ada dmn ya?	2025-08-10 22:14:28.061938+00	community	f	\N	1_month	f
7b014b6b-8414-48e1-8589-67a5889cfb6f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Alhamdulillah pagi ini, Senin (Smangat Meningkat) habis mnyimak audio versi 1 hati lebih nyaman merasa ringan untuk melakukan sesuatu aktivitas pagi, yang biasanya malas, maunya rebahan, sangat terbantu dgn adanya Aplikasi ini, pokonya The best lah, Terimakasih Allfather.	2025-08-10 22:23:25.044006+00	community	f	\N	1_month	f
dcd7f0d4-dd15-49a7-8c01-779981f799f5	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Alhamdulillah baru selesai denger verse 1 , isi jurnal dan renungan 2 menit... Masya Allah rasanya nge plong, bismillah kehidupan yang lebih baik	2025-08-11 07:45:08.106251+00	community	f	\N	\N	f
05ca549f-9df9-4b6b-8215-6ce78307c3fc	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Rasanya fresh banget dengerin audio el vision genesis ini🥰	2025-08-11 04:28:31.4606+00	community	f	\N	1_month	f
6173c23f-4c2e-4771-be9a-9b2113d42605	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	1	t	Wuiih audio 4 ni, luar biasa, makasi all father	2025-08-11 08:51:56.367092+00	community	f	\N	1_month	f
64421561-f607-4814-95c0-ce5937af2368	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Habis dengerin audio dipandu coach senz luar biasa berasa banget energy nya dan bisa memvisualisasikan	2025-08-11 14:08:15.281761+00	community	f	\N	1_month	f
92f0b743-96d0-4526-8493-b0800110cc94	ace95bc7-7dfa-4840-ab5c-e344a0054aac	fritsedwardp	1	t	Blm paham maklum.org baru, mhn advis	2025-08-24 16:01:17.250839+00	community	f	\N	\N	f
a2265399-cff6-4d80-8efa-760433fe434b	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	t	Wa alaikum salam, Terima kasih salam nya. Kiat menjalankan untuk pemula Step 1 - Fokus menyimak Verse, kosongkan pikiran selama mendengarkan Verse, hanya fokus setiap detail terkecil dari verse, Verse yang mana ? Disesuaikan yang dibutuhkan saja. Step 2- Mulai lakukan Elite habit ini sangat penting, meski hanya jalan kaki tapi sepenuhnya menikmati jalan kaki itu, lalu tulis di Catatan elite habit Step 3- Tulis Journal, Lepaskan apa yang ingin dicapai segera, silahkan cek contoh kasus di journal	2025-09-21 09:57:06.372979+00	community	f	\N	1_year	f
0959d8ed-268e-4d00-bf5f-e13152c984c0	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	t	Setelah konsisten melakukan per 3 hari, Klik Personal Analytics, itu akan jadi arah mempertajam harus bagaimana kedepan. Intinya: Kita akan merasakan begitu lepas dan plong menjalani hidup, rasa yakin yang nyata karena frekuensi dari dalam berubah akan mulai merubah arah hidup kita, sebagaimana yang lain.	2025-09-21 09:57:35.450627+00	community	f	\N	1_year	f
075a011c-316f-48fa-9ec9-a173c579077c	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	f	Sama sama, Silahkan terus gunakan untuk jadi progress journal pencapaian hidup.	2025-09-21 12:15:30.164816+00	community	f	\N	1_year	f
f65701a0-d326-4378-a643-dec16660e007	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	Akhirnya level 3	2025-08-27 16:05:50.483935+00	community	f	\N	1_year	f
51ec6074-4c18-46c5-9a1c-d33c80c453de	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	tesss	2025-08-28 04:46:52.344093+00	community	f	\N	1_year	f
6063b865-9c38-4e6a-b5d6-99ccaea403af	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Mantap setiap pagi good mood	2025-08-12 02:20:49.836349+00	community	f	\N	1_month	f
37308c1a-b12a-47e3-8fbc-901b340c79fb	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Audio keren selalu bikin tenang	2025-08-12 02:44:53.496198+00	community	f	\N	1_month	f
63a732a0-00b2-48a8-9b3d-2a50cd60c063	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Audio keren selalu bikin tenang	2025-08-12 02:44:54.950287+00	community	f	\N	1_month	f
0933152e-4075-47ba-95bb-b253be9e51c3	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Audio keren selalu bikin tenang	2025-08-12 02:44:55.615106+00	community	f	\N	1_month	f
b228482d-62b4-4f37-b296-725d3d599235	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Malam ini saya lebih tenang dari sebelumnya berkat menggunakan apk ini hehe	2025-08-12 17:33:05.99263+00	community	f	\N	1_month	f
63cc9343-ca62-44aa-b7d1-41905c474990	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Alhamdulillah audio disini sangat powerfull 😍	2025-08-12 18:04:06.08131+00	community	f	\N	1_month	f
44f66f64-fd29-4ee1-b095-6593ac7f832e	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	Kapan nih coach	2025-08-30 06:01:31.883558+00	community	f	\N	1_year	f
28dbaa16-e6f7-40a4-bef2-c00b9ed54a50	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	setiap hari saya putar dari verse 1-5	2025-08-29 07:29:10.362506+00	community	f	\N	1_month	f
19856b57-544c-4ce4-a560-c0d0f64e7c55	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:07.174254+00	community	f	\N	1_month	f
11ade665-ae74-4849-9ce0-12411fda8dad	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	Alhamdulillah jika semuamya lancar amin	2025-08-28 06:05:57.969609+00	community	f	\N	1_month	f
28e6c60a-aeb2-42cc-b3aa-555dc6cc59a9	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	bersihakn dlu lalu instal lagi ya	2025-08-27 13:11:24.621026+00	community	f	\N	1_month	f
7a9721ac-c8ed-4b50-849d-58f84c155a9a	267439bf-0c66-4a47-b1ba-26ab611eea78	mfauzin16	1	t	Aku pro	2025-08-23 05:34:25.987627+00	community	f	\N	\N	f
7fe42cfd-52dd-4306-84b0-05655c0ba2a4	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	1	t	Bermanfaat untuk semua .. terima kasih salam sukses	2025-08-22 07:23:12.062344+00	community	f	\N	1_month	f
dcc820f1-870e-43ee-8f5b-f77a13a238db	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Hallo	2025-09-06 04:04:30.041123+00	community	f	\N	1_month	f
605129f1-a1fb-4e86-969b-6ebfe495c78d	d079c984-0ba6-442e-8ebe-73e064b8bf3e	karimahabdulhafidz	1	t	Selamat malam, selalu gak bisa akses verse setiap kali mau akses dan XP.berkurang terus	2025-08-26 17:41:15.884368+00	community	f	\N	1_month	f
84e74a40-a7d7-4768-b192-20a78562205c	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	alhamdulillah baru bisa masuk lgi	2025-09-18 18:52:12.009618+00	community	f	\N	1_month	f
8ed51833-e4e9-40a5-967b-a4813b3bfcce	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:07.409343+00	community	f	\N	1_month	f
1eb59f70-97e4-46b6-941c-677969710ecc	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Assalamu'alaikum	2025-09-15 13:13:47.555785+00	community	f	\N	1_month	f
b105e54a-b502-4dc0-b6c9-d056c5dbc6a4	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	3	t	Selanjutnya diskusi di apk ini atau di telegram ya	2025-09-15 15:25:02.998244+00	community	f	\N	1_month	f
09803f6b-c9dd-4600-ac73-33d331f35115	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	smga selallu membntu kita semua.. fengan adanya app ini amin	2025-08-28 06:06:36.047827+00	community	f	\N	1_month	f
d28caf5c-212c-4501-b0fe-b2f04c8d593a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	level masih jauh dibawah members lain, tapi alhamdulillah, begitu banyak kemudahan  yang dapat dirasakan sejak ikuti Meditasi el vision.. ditambah lagi saat ini ada aplikasi yg keren dari All Father & team yg supper kereeen... Alhamdulillah ..alhamdulillah Alhamdulillah...	2025-08-17 14:30:04.79272+00	community	f	\N	1_month	f
27904c13-4954-4d0c-884e-65d48c8136f6	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Wa terima kasih Kak Rena	2025-09-08 05:59:15.949783+00	community	f	\N	1_month	f
0edd35fe-b411-4bfd-986e-8346aeaca5da	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Terima kasih🙏💕	2025-08-28 14:25:16.336386+00	community	f	\N	1_month	f
d2b7d79e-221a-4eba-99fe-08df52d24d9d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamdulillah,  mendengarkan meditasi malam, membuat tidur lebih nyenyak dan bangun lebih segar... Terimakasih Ya Allah Allah maha Baik	2025-09-04 14:15:44.274+00	community	f	\N	1_month	f
beacb648-529d-4d9d-bc50-9fdfccba505e	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Sejak beberapa hari meditasi dibimbing melalui Verse 4, tiba tiba rejeki mulai menghampiri seperti kebetulan ... Luar Biasa All Father ini	2025-09-06 04:07:58.502061+00	community	f	\N	1_month	f
d71de53c-8d55-459f-a19d-885fb6e4c515	9eca5149-cfda-4b82-96fa-d6d870f0e71d	anggun2001	1	f	Halo juga kk	2025-08-08 21:19:06.037567+00	community	f	\N	\N	f
dcadb9f6-c93d-4693-b0ed-7a8eeb4ef58d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	1	t	Pagi berkah, semangat mengukir kebaikan	2025-08-11 00:08:39.107089+00	community	f	\N	1_month	f
468de8cd-0358-40ca-9955-261f7dc183b6	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	1	t	.  Sehat selalu untuk anggota komunitas..	2025-08-11 00:08:50.152685+00	community	f	\N	1_month	f
4cb7ac37-2630-447c-a2be-9f52d0e074c9	f6560fca-177d-497f-9225-a597ed888589	astawe	1	t	Mencoba versi 1 dgn posisi duduk bersila, lumayan menahan rasa sakit,tp selesai juga	2025-08-11 01:07:04.825043+00	community	f	\N	1_month	f
9ce792da-ede4-4c7e-b339-f4abdbde7889	271a608c-0b55-4e42-9d13-293ad20e914e	armadi Hokky 	1	f	Alhamdulillah baru hari pertama mencoba Uda merasa ringan seluruh persendian otot	2025-08-19 23:36:32.204396+00	community	f	\N	\N	f
f6a43112-f8ad-4569-8866-75798e746877	6317b3e8-005d-4c08-b6da-d8de06289fa7	Ananda malang	1	f	Malam coach	2025-08-09 18:59:59.986826+00	community	f	\N	\N	f
aad762dc-3b5b-49ab-af7b-dc2ce94e6e2a	71a968fa-20e2-40a3-b260-004d43cca420	Admin	1	f	Halo semuanya	2025-08-09 20:57:36.932137+00	community	f	\N	\N	f
f78a9c8d-4c08-4714-97d1-42d9f2f44bf2	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Rejeki kita semua dilancarkan, pikiran tenang, tubuh makin sehat,.	2025-08-16 08:04:41.433918+00	community	f	\N	1_month	f
6d276a11-56f2-4479-afec-28701e0a6bc2	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	t	Semakin hari semakin positif, bersama All Genesis	2025-08-24 11:49:02.651419+00	community	f	\N	1_month	f
9a90e3e1-27d0-4913-97e3-615ab82b95b4	53a25652-85fc-49ac-8790-47c44a19d1c4	Dr Sahendra	1	f	Salam kenal izin gabung, keren banget aplikasi nya All father 🍷	2025-08-09 22:12:55.793237+00	community	f	\N	\N	f
ce28175e-8911-4dea-b821-eed121f2c37a	53a25652-85fc-49ac-8790-47c44a19d1c4	Dr Sahendra	1	f	Izin bertanya bagaimana membuka lagu lain atau naik level seperti suhu yang diatas ? Atau bayar kemana?	2025-08-09 22:13:59.872162+00	community	f	\N	\N	f
761de2dd-2035-47e9-b7c6-ab409acb9e5f	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	2	f	Selamat siang, baru bisa akses lagi aplikasi dan komunitas ini	2025-08-23 07:36:19.555322+00	community	f	\N	\N	f
1780e000-688a-4680-8877-2432aae30d8b	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	f	Di hp saya audio sering mati ditengah-tengah dan harus mulai dari awal lagi kenapa ya	2025-08-26 23:08:36.022719+00	community	f	\N	\N	f
7434ce3b-80af-4dde-8dd2-5853ed839abe	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Keren banget aplikasi ini, makin hari makin keren terang berkilauan dan Audonya semakin sering didengar semakin bertambah powernya	2025-09-18 13:12:51.980106+00	community	f	\N	1_month	f
0ca393f4-3387-4c4a-bc04-d75a68eb0183	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamdulillah tiap pagi bangun segar, segala sesuatu berjalan lancar...  Jadi lebih optimis di tanah rantau ini mendapat keberkahan Rizki dari Allah....  Lahaela walaqwata ilabillah	2025-09-10 00:04:17.393355+00	community	f	\N	1_month	f
172c3bd6-2b4e-4948-b606-b2b8896520be	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	3	t	Malam  ini saya buka Apk, langsung tekan update... Dan klik live  now..... Dimulai suara alLFather memulai kelas, jelaskan   fookus kesadaran  dst... Tapi ditengah² saat sampai  bicara  masuk tahap  triangle  table  1.. audio terputus.......	2025-09-15 15:22:35.186862+00	community	f	\N	1_month	f
09311004-60ee-47ef-9d2e-e6c487c813e1	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	f	Hadir menyimak	2025-09-16 13:06:15.774181+00	community	f	\N	\N	f
2b22b961-eee1-41dc-8431-f193dcfcf406	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	2	t	Versi 4 dan 5 saya kok  terkunci yaa?	2025-09-20 02:35:36.201559+00	community	f	\N	1_month	f
c068599b-3cce-419b-a56b-218c39cecca9	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	1	f	Alhamdulilah ...ya Allah	2025-08-18 06:55:51.664573+00	community	f	\N	\N	f
f9e2b465-a0ba-4e8d-b2c7-3f31d4bcbd22	b2803bb9-d737-4420-8eb0-4a6deed56216	charismoch259	2	t	💖💖💖🍯😍🤩	2025-08-25 04:57:28.983616+00	community	f	\N	1_month	f
bd056237-3eb4-4869-adc1-045c242f82ba	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	f	Kemarin bisa kenapa hari ini eror ya, ada yang sama ga?	2025-08-31 22:48:37.693251+00	community	f	\N	\N	f
4dad1f11-1abe-4b2c-afef-59051ebda394	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Oh sudah ketemu Kak Rena, trm ksh	2025-09-08 15:29:25.934252+00	community	f	\N	1_month	f
da9522e5-9e2b-40a3-9f54-0f4cc1702cc1	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Baru pagi ini buka Apk dan perhatikan ada verse Delta breathing,  alhamdulillah terasa lebih segar.... Walau belum tahu penjelasan tentang Verse ini	2025-09-12 02:01:12.036829+00	community	f	\N	1_month	f
3557a373-7b0d-4a1f-8d16-ec306ab68833	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	1	f	Alhamdulillah ..	2025-08-10 11:39:01.816759+00	community	f	\N	\N	f
238c75e5-511f-4960-81f3-1db3605126ab	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	purnamahadi043	1	f	Alhamdulillah akhirnya menemukan aplikasi yg membuat ku bisa meditasi pagi dan malam bisa nyaman tenang pikiran dan berkelimpahan terima kasih 🙏	2025-08-12 03:37:55.354159+00	community	f	\N	\N	f
d63121bc-19ae-4dfa-b9e8-7717e5291e27	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Masya:allah tanarakallah. Alhamdulillah...  Lebih mudah diakses	2025-08-10 08:21:04.86018+00	community	f	\N	1_month	f
40aff18b-a04e-43e6-a60b-7a7c16645bd6	9305c52e-c5d4-4a7b-b3ea-4474ac531795	ibrahimmardianapasa	1	f	Alhamdulillah	2025-08-15 15:41:03.482507+00	community	f	\N	\N	f
8bf687ef-dfa6-42dd-98ae-a69770e06e54	9c9c8939-2137-4637-a5b7-f4c98c861376	segarmeriah05	1	f	Alhamdulillah.....	2025-08-15 23:54:51.042534+00	community	f	\N	\N	f
a3bab7d0-2b0d-4801-90f9-75ea7887137b	9c9c8939-2137-4637-a5b7-f4c98c861376	segarmeriah05	1	f	Terimakasih banyak atas infonya serta access nya. Ini memang luar biasa banget. Sekali lagi terimakasih banyak	2025-08-15 23:55:40.055546+00	community	f	\N	\N	f
8dcea60a-8904-42cd-b567-0cce612501ab	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	chyecoding	1	t	Aku ngejar semua bisa dibukak	2025-08-22 23:07:04.847365+00	community	f	\N	1_month	f
9b46866d-73ce-4f5b-86e3-c8e7c7599098	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Alhamdulillah...  Jauh lebih tenang, hadapi politik pekerjaan dengan senyuman, nerserah diri ke Allah	2025-08-13 15:48:18.528753+00	community	f	\N	1_month	f
6ee98d31-31f3-4467-8fa7-275c036891df	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Makin membaik semakin tenang setiap hari... Insyaallah Allah segerakan  beri rizki earphone dan dimudahkan untuk ikuti  kelas selanjutnya	2025-08-13 15:56:38.9449+00	community	f	\N	1_month	f
3e6b4991-46ab-4048-8a23-b1a7fd22609a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Terbayang sudah  pencapaian ... Insyaallah Allah datangkan  melalui semesta dari arah yang tidak disangka sangka	2025-08-13 16:00:15.088281+00	community	f	\N	1_month	f
94b09afc-2c9c-4a25-bd8d-11feb15fad6f	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Usul kepada All Fathers, alangkah baiknya jika koment terbaru muncul dipaling atas, spy tdk perlu scroll terus kebawah jika ingin membaca insight2X baru dari keluarga besar El Vision	2025-09-06 04:16:27.935876+00	community	f	\N	1_month	f
b22f5789-ed61-469e-a64a-e303b1e4f793	267439bf-0c66-4a47-b1ba-26ab611eea78	mfauzin16	1	t	Aku pro	2025-08-23 05:34:39.030169+00	community	f	\N	\N	f
643e839e-d2f3-4a57-b1ca-08ed7890e9b7	a695e42f-5b3e-4c5d-b462-97910d15fdfb	sutedjachandra	1	t	Belum sempat dengar audio, audio sdh tdk bisa diakses, dimana menghubungi mentor?	2025-08-23 15:23:27.386888+00	community	f	\N	\N	f
f7df7c14-39a0-4a04-997c-aaf592c80917	b894a1c3-2f26-42c0-b924-96aac802096f	mayabintang65	1	f	jadi bisa relaksasi	2025-08-30 05:22:39.366766+00	community	f	\N	\N	f
5c970958-8b81-4349-a04c-1e931d6a180f	b894a1c3-2f26-42c0-b924-96aac802096f	mayabintang65	1	f	jadi bisa relaksasi	2025-08-30 05:22:39.366756+00	community	f	\N	\N	f
8cfe967a-625a-4f0a-b32d-af1e2a3fb92c	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	di versi terbaru makin nyaman..	2025-09-01 02:35:09.952561+00	community	f	\N	1_month	f
8dcf7e60-ca66-4de6-a192-620a182f50da	267439bf-0c66-4a47-b1ba-26ab611eea78	mfauzin16	1	t	Aku pro	2025-08-23 05:35:06.956294+00	community	f	\N	\N	f
e7d6f459-fac4-495c-b7ea-3867891b5ce4	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	t	Sedang mencoba aplikasi	2025-08-25 13:07:43.640909+00	community	f	\N	\N	f
de331afd-4c6e-4096-a2be-65c3f8ee273d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Ka Renata, masuk enggak sih kalau dengarkan audio sambil  makan siang.... Kebetulan saya makan siang diruangan tertutup sendiri dan tanpa penerangan	2025-08-13 16:04:53.204941+00	community	f	\N	1_month	f
10a6cfc9-109c-450f-9def-bca1d33fbf1f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Alhamdulliah... Pagi Allah beri kesempatan meditasi audio verse 1.. sampai selesai dengan nyaman	2025-08-13 23:39:19.608742+00	community	f	\N	1_month	f
5ab2cb2c-10e7-4db7-a43c-43d98915fced	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Alhamdulillah, hari ini dimulai dengan hati yang tenang	2025-08-13 23:40:28.66144+00	community	f	\N	1_month	f
de31d19c-13d8-48dd-bb2f-879cfcadcb8e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	1	t	Terimakasih All father, terimakasih Coch senz, kak Renata..dan terimakasih teman² positif di group ini,... Semoga sehat bahagia selalu, di beri kelimpahan rizki terus menerus...	2025-08-13 23:43:41.372475+00	community	f	\N	1_month	f
b46f4d5d-583d-4cdc-aaa8-436f8c36c8fd	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	2	t	Alhamdulillah.. Alhamdulillah.. Alhamdulillah Terimakasih sangat membantu sekali apk ini utk merilis dan melepaskan segala  segala keadaan positif dan negatif utk memperbaiki keadaan agar inner child saya terus bertumbuh dgn baik dan bijak.	2025-08-19 22:24:15.64968+00	community	f	\N	1_month	f
d235050e-4e18-4681-8dd3-8b2d9af17a31	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	eteriaqueen	1	t	Saya sama sekali blm bisa selesaikan 1 verse karena otomatis mati tiap sekian menit dan mengulang awal terus	2025-08-25 13:28:43.930275+00	community	f	\N	\N	f
abea6cc0-f1f6-40ab-b902-af2d67661674	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	2	t	Terimakasih✨ 🙏	2025-08-19 22:24:33.740566+00	community	f	\N	1_month	f
a21d9613-27a1-48c0-ab2b-c3bf9017bfe3	a4d0becf-27fe-4a16-bd74-8aa39fb9578a	jraymondsusilo	1	t	Pagi All	2025-08-22 02:26:39.755372+00	community	f	\N	1_year	f
2324ebc8-dcdd-4c0a-af80-ba3e14975fee	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:05.984821+00	community	f	\N	1_month	f
e9d055d0-edf2-4c0d-a729-6e82ac350123	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:07.653206+00	community	f	\N	1_month	f
af04e216-c9c3-4884-a5d8-7fff21c0123f	f6492019-02bb-4783-b172-53f7e71bdc5c	syaif0475	1	t	Mantap	2025-09-05 06:49:13.601101+00	community	f	\N	1_month	f
cda9bc6f-fb00-4673-a493-494eaea1ed3e	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Kak @harridavionkrisnata sudah update kak ke versi terbaru sudah seperti itu.	2025-09-08 05:58:21.305833+00	community	f	\N	1_month	f
6ff49009-08f4-48ec-a997-4e7c6067bb12	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:06.014485+00	community	f	\N	1_month	f
74a2d3f9-5a90-4c47-87c6-97cf43d7bced	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Selamat minggu Pagi.... Alhamdulillah meditasi membuat hari hari begitu segar dan menyenangkan,  berani punya impian sebesar besarnya dan yakin Allah berikan dengan Cara yang terbaik,  diluar logika manusiaaik	2025-09-06 23:50:29.363425+00	community	f	\N	1_month	f
14e14adb-0d7f-4943-855c-ea26ab293f97	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Kak @harridavionkrisnata sudah update kak ke versi terbaru sudah seperti itu.	2025-09-08 05:58:21.320935+00	community	f	\N	1_month	f
dd097265-68f9-427e-88c3-82a26af9b5f5	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Btw apakah ada yang pakai Verse 4 tapi sering putus sebelum selesai ?	2025-09-08 06:01:13.897865+00	community	f	\N	1_month	f
c3ffb631-97bb-401e-b777-dba77bcf4a01	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Keren banget aplikasi ini, makin hari makin keren terang berkilauan dan Audonya semakin sering didengar semakin bertambah powernya	2025-09-18 13:13:10.881696+00	community	f	\N	1_month	f
0be3adce-f366-4c79-b969-fb0e291b9ccd	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	2	t	Versi 4 dan 5 saya kok  terkunci yaa?	2025-09-20 02:35:36.204232+00	community	f	\N	1_month	f
c5c53017-36f4-4fb7-a13a-0aa470c87f57	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Alhamdulillah sebelum tidur menikmati dulu audio versi 4, rasanya lebih nikmat Rilex Terima Tuhan atas semua Rezeki hari ini, semua urusan di berikan kemudahan. Selamat beristirahat semua sahabat, Terima kasih Allfather.	2025-08-11 15:22:04.017379+00	community	f	\N	1_month	f
9f1ff191-eb51-493d-aee2-b79160941b14	18d08fe3-6f60-4abc-a51e-75360e88d54c	Abdul Rahman	1	f	Terima kasih coach, aplikasinya sangat berguna sekali	2025-08-11 18:39:39.826031+00	community	f	\N	\N	f
4117629f-bf33-4e2f-8e0a-15d45047675e	716e24e3-7f10-4df2-b64b-2cd6a05f937b	Andrie	1	f	Salam kenal	2025-08-11 19:36:23.199104+00	community	f	\N	\N	f
4ba2da6a-6e7a-4cd7-a977-a17cbef5bff1	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Bait satu bukit  luar angkasa dan aliran  kemakmuran	2025-08-28 23:20:02.721704+00	community	f	\N	\N	f
f50d60fe-7b89-4c13-8a12-f002da933d33	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	Kejar level 11 berapa lama itu yah	2025-08-29 09:02:39.399281+00	community	f	\N	1_year	f
91606a4e-b848-4867-aef0-8b8a72352be3	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Alhamdulillah lebih rilexs.. Selamat beristirahat sahabat semua	2025-08-31 14:40:35.442585+00	community	f	\N	1_month	f
373ef485-f3dc-4eff-9cba-c75e090c6264	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Dua kali jadwalin sesi meditasi ko gak ada apa2 ya, aku pikir bakal ada notif trus dikasih audionya apa gimana gitu?	2025-08-12 03:19:18.923373+00	community	f	\N	\N	f
dfe86075-0c45-40f4-bab3-33d1941c0c61	08c375cf-3e32-486b-b211-4c28e6239093	Harir	2	t	Waalaikumsalam	2025-09-15 13:15:31.750442+00	community	f	\N	1_month	f
6e0d9433-c8d7-41c2-b4f4-7f249e5d4a1b	ed675b6c-0cd8-4475-aecc-74b921c68b35	Yanti	2	t	Aplikasinya semakin keren d tambah fitur analyticnya jd mengerti kekurangan sy	2025-09-19 11:08:38.832653+00	community	f	\N	1_month	f
f5188ed9-667e-48ea-9d92-f3fb6760c0b0	22be002e-651c-4ec9-99a4-5432637f4706	Mujiyono	1	f	Mau nanya kak, untuk awal dengarkan audio yang mana dulu dan di dengarkan waktu kapan selama berapa hari	2025-09-20 10:41:53.726203+00	community	f	\N	\N	f
a1d6249f-24f9-4c27-8fea-4ee70135079a	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Lakukan elite habit, jurnal dan verse nanti ke personal analytics	2025-09-20 14:12:05.370743+00	community	f	\N	1_day	f
5e8b7a79-eeb0-4301-95f0-cc58e326832c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Lakukan elite habit, jurnal dan verse nanti ke personal analytics setelah 3 hari mengisi	2025-09-20 14:12:31.469937+00	community	f	\N	1_day	f
3fd31033-afe0-4846-8de7-7e5b065f30f8	f6560fca-177d-497f-9225-a597ed888589	astawe	1	t	Selesai audio versi4 ,lebih tenang dan rilexs tubuh ini, terima kasih allfather	2025-08-13 09:02:52.940974+00	community	f	\N	1_month	f
da9d49fc-24bc-4a95-becf-6a10c337d6b1	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Terimakasih banyak  utk aplikasi ini..✨💖👍	2025-09-21 11:27:40.176555+00	community	f	\N	1_month	f
4be7bc6b-2464-4148-a7d7-00d643930667	2c89253b-a0cd-4217-acdc-f98d84d21dca	nurul.helmie	4	t	Terimakasih banyak  utk aplikasi ini..✨💖👍	2025-09-21 11:27:48.950448+00	community	f	\N	1_month	f
226e723a-3b25-4f20-bf2d-a67b0cd9411c	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Kak @harridavionkrisnata sudah update kak ke versi terbaru sudah seperti itu.	2025-09-08 05:58:21.327251+00	community	f	\N	1_month	f
a75a8d83-0f49-4a5d-9a08-7a3ae97b54fe	55d3fa51-183a-4187-8962-5256b57c4357	harridavionkrisnata	1	t	Masalahnya putus dimenit diantara menit ke 20 s/d 25	2025-09-08 06:02:25.639525+00	community	f	\N	1_month	f
1dd36701-d0ef-4974-8eac-643be1cba59d	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	eteriaqueen di saya lancar lancar saja ko ka  bahkan saya barusan nyoba dari verse 1 sam 5 masih aman	2025-08-26 07:07:03.522988+00	community	f	\N	1_month	f
8e35755d-6f8e-4086-ac69-c0f22bf65936	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	1	t	semangan untuk semua .. dan sukses sllu di tahap tahap selanjutnya	2025-08-22 07:24:32.634502+00	community	f	\N	1_month	f
b2688c40-54d0-4f3a-bbe3-2c722c0daa54	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	Alhamdulillah sudah bisa mendengarkan versi 5 nya ..	2025-08-24 05:37:22.842999+00	community	f	\N	1_month	f
df34f7f2-ca1c-4656-8634-af3a334d8048	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	semangat mengejar misi	2025-08-27 16:49:47.768212+00	community	f	\N	1_month	f
b829e03e-ed30-49e0-8ca6-c98e3553bf6e	8fa357c9-4450-4e90-b3c9-6886f7159287	hendi	1	t	Anggota baru udah bayar pro apa bisa langsung akses audio ?	2025-08-16 01:15:15.009458+00	community	f	\N	1_month	f
3e2083bf-2a43-44f2-aa13-5b2bcbfa7360	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	di verse 5 musik nya makin mantap menggelegar .... semoga cepet sampe di verse2 berikutnya.. tetap konsisten kk semua	2025-08-24 05:44:27.343951+00	community	f	\N	1_month	f
ac48b108-5008-4c3c-9054-1514b9729b7f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	1	t	Lanjut ka .. malam waktu yg pas untuk meditasi	2025-08-22 17:48:59.986057+00	community	f	\N	1_month	f
2203772a-e0a9-4a37-ad55-b233f90cd2d2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	1	t	yang pastinya lebih bikin betah meditasinya .. matap ELL VISON GROUP	2025-08-23 06:21:12.041198+00	community	f	\N	1_month	f
ea60eb9a-adc6-4aa7-b8b2-aa6042a1acb7	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	yg suka mati di tengah coba di bersihkan dlu	2025-08-27 13:11:03.726489+00	community	f	\N	1_month	f
d086366e-e651-4d99-84af-74b4b98a55f0	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	aneukeyz	2	t	slmt malam	2025-08-27 16:48:27.270405+00	community	f	\N	1_month	f
d72e4a3c-5702-436b-97d6-114d2306226e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	syarifudin.arif77	2	t	Alhamduliillah dengan meditasi malam : tidur lebih nyenyak dan saat bangun	2025-09-04 14:14:06.13709+00	community	f	\N	1_month	f
2cd2ca68-b6f2-42e2-96fb-869cf2fc172e	71a968fa-20e2-40a3-b260-004d43cca420	Admin	1	f	Verse 4 buat saya merinding dengerin nya dan malu ke Tuhan 😭. All father makasih sudah hadir di dunia...	2025-08-10 16:01:22.578699+00	community	f	\N	\N	f
c0826c19-7d2f-49e5-8c78-363c28c3d942	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	6	t	Terima kasih atas aplikasinya All Father	2025-08-10 16:24:33.512227+00	community	f	\N	1_month	f
d97925a1-01f7-4c09-bf4e-843cff39da65	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	5	t	Wahh luar biasa sekali aplikasi ini, dgn aplikasi ini saya semakin mudah menjalankan hari	2025-08-10 16:41:18.723389+00	community	f	\N	1_month	f
8c79edd0-7b83-43a9-a6f4-7f47276861a7	08c375cf-3e32-486b-b211-4c28e6239093	Harir	1	t	Alhamdulillah selesai mendengarkan verse 3 utk pertama kali... ada sedikit rasa panas dibagian perut atas.. terus semangat membangun diri	2025-08-10 16:01:44.157047+00	community	f	\N	1_month	f
c9aa18b0-d5b8-42d0-952f-bead99f0d8b7	08c375cf-3e32-486b-b211-4c28e6239093	Harir	1	t	Maksudnya verse 4	2025-08-10 16:02:31.620336+00	community	f	\N	1_month	f
10babaa6-b89a-4df5-b3c7-73cde50a9b6c	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Luar biasa sekali yah aplikasi ini, sangat memudahkan kita.	2025-08-10 16:04:41.12631+00	community	f	\N	1_month	f
c4b1099b-cd9b-4e01-8bbe-96cf4487a1f5	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Terima kasih berkat Applikasi ini saya menjadi mudah,	2025-08-10 16:13:58.845254+00	community	f	\N	1_month	f
e4f88634-1935-469d-ae93-bd88191deedd	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	1	f	Ke profil - ganti nama yah biar chatnya ada nama	2025-08-10 14:49:33.635515+00	community	f	\N	1_year	f
b7d4e97b-8035-465f-b9aa-aa8719d77a56	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Menikmati rasa syukur terdalam dengan mnyimak audio hasil karya Allfather  terimakasih.	2025-08-30 12:08:41.314283+00	community	f	\N	1_month	f
168b12e0-06f3-4c1f-b150-97d2b602eee9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	f	Alhamdulillah selamat beristirahat sahabat semua...	2025-09-03 14:22:33.305729+00	community	f	\N	1_month	f
adcbdfad-ff5e-4d0e-89c4-be0e3fed626c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Tidak ada yang mati kak, semua lancar 😊	2025-08-27 14:02:32.898941+00	community	f	\N	\N	t
f9a0ee49-19cf-4c69-a03b-f45b58def97c	d828905b-bf9a-4672-9233-8411c39d4371	Agustinus	10	t	Selama ini saya sudah dapat sampai milyaran dari metode aplikasi ini, tapi tidak sihir lebih ke aplikasi ini menjernihkan pikiran dan jurnal pelepasan setiap keinginan saya tertata untuk alat ukur per 3 bulan, untuk projek projek besar saya lebih optimis dan berhasil. biaya sangat terjangkau hanya 800ribu per tahun dengan manfaat ribuan kali lipat. terima kasih eL Vision	2025-09-09 12:36:26.584789+00	community	f	\N	1_year	f
01be60b9-b65e-4e9c-b34f-dee4181868f4	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Terimakasih Allfather	2025-08-12 14:06:05.303125+00	community	f	\N	1_month	f
58d3135d-06ba-4513-8ade-e93f07cc7567	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Silahkan klik tombol update, memastikan download dan slider ☺️	2025-09-08 16:11:39.607924+00	community	f	\N	1_day	t
0c172981-e28b-42ce-8816-39568c9203da	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Terima kasih kak nurul	2025-09-18 18:31:35.206718+00	community	f	\N	1_day	f
45b716f4-cfef-4473-a20c-ba4475b3b3ef	d93b09d5-17de-4055-ab37-d4c70d0293fe	mencana kair	1	f	Baru coba suka sama alurnya	2025-09-19 06:15:43.413831+00	community	f	\N	\N	f
10db57d1-5f0e-4b5f-911e-637f6b6e3442	fa3cefa6-bd80-403e-b874-9143b65bcf5b	Dewi Anggraini, A.Md.Keb	3	f	Gak tau yang lain gimana tapi kerasa banget yah perubahan di hidupnya?	2025-09-23 00:23:47.095058+00	community	f	\N	1_month	f
d3b8ab6d-e2ed-42e9-9a85-378c5857fb7d	02ea17ec-b799-4873-84a2-f2272aad53a6	Dr. Hendro Wijaya	5	f	Lebih ke tenang dan fresh ngeliat hidup jadi rezeki memang datang asbab tentram. Sekedar sharing	2025-09-23 02:59:56.513591+00	community	f	\N	1_month	f
48e5103f-4ce1-46a5-bd9d-9bd70f96d360	9f70dac9-dd00-4875-aee5-db4d7e5c23d3	Ahmad Santoso	5	f	Setiap hari setia mendengar verse, semkain bagus ada anlytics	2025-09-22 18:33:02.528274+00	community	f	\N	1_month	f
cbbdbc04-102d-4979-aa14-40ce9d0c8dbd	ba9ff5cb-bc04-4734-ba4e-d0765d6c8a2b	Sari Kusuma	4	f	Selamat super pagi	2025-09-22 22:37:36.547035+00	community	f	\N	1_month	f
c2e9d26b-5852-4ac0-ac69-36c4dce14393	859c9492-e8a7-4d14-b1df-31c174c13d0a	Mega Sari	3	f	Lagi pada fokus dengerin Verse berapa ?	2025-09-22 22:39:20.498878+00	community	f	\N	1_month	f
e5b5fe89-7d76-4acf-b934-09fcf6233bea	86d4c662-8a7f-48ee-be65-5eccb530cd33	Dani Pratama	5	f	Salam Kenal semua	2025-09-23 03:20:03.856548+00	community	f	\N	1_month	f
3f037a5e-b1f0-4b5c-b88c-e691646dfcce	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	Gustian 	9	f	Yang penting konsisten dan jangan banyak ngeluh	2025-09-23 00:48:41.519397+00	community	f	\N	1_year	f
7c56ada4-aa59-4267-91f9-97205a85a46c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	f	Selamat datang kembali maintenance selesai ☺️	2025-09-23 03:55:50.651425+00	community	f	\N	1_day	f
440a9777-2c1f-44b8-b29c-da8565b22a13	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Selamat siang semuanya, khusus nya allfather ,admin Renata dan admin naga, semoga Sukses semuanya, bahagia selalu, berkah dan sentiasa dalam lindunganNya, Aamiin Alloohumma Aamiin	2025-09-23 05:05:37.068298+00	community	f	\N	1_month	f
dddc45cd-f192-4940-97c2-280cc1abbce7	08ead0c3-a11d-4b9b-bf2e-abcd56388201	Fitri Handayani	6	f	Asik banget ada analytics untuk yang total verse sama jorunal udah ratusan. Elite habit wajib ga sih? contohin dong Renata 	2025-09-23 05:29:37.952817+00	community	f	\N	1_month	f
751527ae-8fd5-4d4f-90f3-c51c04bb7be2	fa3cefa6-bd80-403e-b874-9143b65bcf5b	Dewi Anggraini, A.Md.Keb	3	f	Lagi rajin dengerin verse 8 love magnet 	2025-09-23 05:41:53.385183+00	community	f	\N	1_month	f
609a5699-f8c0-4708-a22a-0c53808e8839	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	f	Ngikhlasang ngelepas ring jurnal spiritual, aku bener-bener ngrasa perubahan jadi luwih gampang, muga sing liu ngalamin pisan	2025-09-23 06:20:51.334276+00	community	f	\N	1_year	f
6356be2c-bc00-4c2d-89f5-b96a40af46c9	4253f35e-0225-4f27-9c42-1eba42715aea	oktavi05andri	1	t	Good ekosistem	2025-09-16 03:37:07.789876+00	community	f	\N	1_month	f
fc252e28-dd39-4e6a-a562-b10d8b3a0225	fa12011b-2a8f-41de-9bce-f9b6904d7da1	rudinazawa	2	t	Versi 4 dan 5 saya kok  terkunci yaa?	2025-09-20 02:35:36.479008+00	community	f	\N	1_month	f
7d4409fd-3fd6-471b-8245-59a7879a5de9	ab68113b-cba7-4243-9544-8d932abcb521	Putri Wahyudi	8	t	Sebelum ada aplikasi ini semua di telegram dan aku download telegram dulu khusus untuk komunitas aja setelah ada app juga ga perlu lagi telegramnya.	2025-09-15 13:32:32.583245+00	community	f	\N	1_year	f
49f024cf-0605-49b1-8152-1ac5341c23fd	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	Tian Leeeee	10	t	Itu live ignis dasar kenapa di open public, admin renata ?	2025-09-15 16:18:18.108145+00	community	f	\N	1_year	f
6b1c8152-98c4-4fc0-9a29-fa0f86da7e9a	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Kak @harridavionkrisnata sudah update kak ke versi terbaru sudah seperti itu.	2025-09-07 15:29:56.340253+00	community	f	\N	1_day	t
c0609f07-91a4-4b55-b428-82204cb09202	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	t	semoga semakin sukses, makin lengkap fitur nya	2025-09-16 22:51:50.421984+00	community	f	\N	1_year	f
cef6bee1-c9db-4738-84ea-4a993e995f14	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	1	t	Silahkan dimulai Analysis Personal, Admin tidak bisa membaca Jurnal karena di encrypted. Sepenuhnya Ai algoritm yang bekerja Gabungan Elite habit+Jurnal+verses.	2025-09-16 04:43:48.502034+00	community	f	\N	1_day	t
4e3d9cce-5a2d-4877-9cc3-1cf484fc4ce8	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Silahkan Klik Cara Menggunakan Aplikasi Video kak	2025-09-19 19:00:40.998586+00	community	f	\N	1_day	f
bbc7a775-29de-4560-ab39-3aa2ce0e440c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	t	Silahkan Refresh 😊	2025-09-20 03:00:52.272073+00	community	f	\N	1_day	f
dfe13e25-8880-4b4c-b346-0c36675c089d	3da83afb-aa8c-4c55-b3b0-8aa64000205f	Renata	2	f	Sore kak penghusada	2025-09-20 09:52:42.058473+00	community	f	\N	1_day	f
9b9f92ca-5764-4d84-85b7-588f517e1560	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	t	Mohon bimbingannya kak admin agar saya dapat mengikuti program el-Vision	2025-09-21 00:53:54.271916+00	community	f	\N	1_month	f
0a813896-9d20-4cdb-ab71-e289fb9996ad	91f3b294-d544-4d42-9639-a30efa64783e	Hartono	2	f	Baru coba	2025-08-11 07:35:05.591337+00	community	f	\N	\N	f
968d354d-be69-4414-aa6a-af6673d8121b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Saatnya versi 4 , seperti biasa setelah menyimak tidur lebih nyaman saat bangun lebih ringan dan tdk stres. Dengan adanya aplikasi ini jadi lebih termotivasi dan terjadwal. Terima kasih allfather telah meluncurkan aplikasi ini.	2025-08-13 12:36:29.998872+00	community	f	\N	1_month	f
99cb7c79-232a-448c-9fab-5cb362c77198	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	t	Rajin menyimak audio, efek di syaraf² lbh tenang	2025-08-13 13:50:48.29384+00	community	f	\N	1_month	f
d0b4ecc0-723b-496f-abfe-40fd9a86e271	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Aku baru sadar dengan menulis Riwayat renungan setiap hari di menu jurnal menjadi bahan evaluasi harian dan hasilnya perjalanan ku lebih tetarah dengan adanya aplikasi ini, keren banget terimakasih allfather	2025-08-13 21:49:37.007197+00	community	f	\N	1_month	f
9e1efe3e-0b68-406d-b014-2fa6cf77b24a	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Test	2025-08-14 06:04:17.053065+00	community	f	\N	\N	f
5b48947a-d6dc-45b7-9d45-38a7c25bd45c	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Fungsi sudah ditambahkan, setiap anggota bisa mendelete chatnya // cari tombol sampah merah di kanan chat anda // Terima kasih. Admin Renata	2025-08-14 06:05:01.829563+00	community	f	\N	\N	f
53da4598-68e1-4f7e-bd90-348fb62d3414	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Bisa ah	2025-08-14 06:36:52.78443+00	community	f	\N	\N	f
15316a07-eb53-4df4-be1e-4603b0f6f3b2	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Ngisi energi dulu, kita tarik kekayaan	2025-08-14 06:14:46.033835+00	community	f	\N	1_month	f
8e32a0d3-2c06-4a8d-a883-8ebf33196652	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Min, ini verse 4 ada dua bahasa , yg pakai bahasa indonesia knp gak bisa di klik??	2025-08-14 06:19:27.279054+00	community	f	\N	1_month	f
f4720d7f-338a-423b-aa33-4c7b90b1ded2	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	1	t	Makin fress rasanya	2025-08-12 09:05:15.526304+00	community	f	\N	1_month	f
957cce81-8ade-4eb1-b899-65023609125c	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Alhamdulillah bgitu padat aktivitas hari ini  masih bisa malam ini di akhiri dengan  audio versi 4, penghantar  istirahat malam ini.	2025-08-12 14:05:55.528153+00	community	f	\N	1_month	f
f7cc7ad2-a0b9-4785-a69d-4d38d814eb68	a2e8495f-d2c1-4e04-9db5-faa976f59207	Adi Setyo	1	f	Saya sudah upgrade yg pro bulanan, ini langsung aktiv ya kk admin	2025-08-15 08:33:43.059556+00	community	f	\N	\N	f
3a9b3b45-82a8-43c9-89d7-3fcfa7a9b237	a2e8495f-d2c1-4e04-9db5-faa976f59207	Adi Setyo	1	f	Utk verifikasi bukti tf kemana ya yg pro bulanan?	2025-08-15 08:55:28.276349+00	community	f	\N	\N	f
254c36fb-f842-46af-a920-adde9fe41dfb	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	f	Langsung aktif iya	2025-08-15 11:23:55.570847+00	community	f	\N	\N	f
acec1604-eed8-459e-8ac4-1d3e961e1b0a	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Alhamdulillah udah bisa join lagi	2025-08-15 11:38:12.060235+00	community	f	\N	\N	f
64a8b44a-2f13-4d80-81f7-2fcb1a25482d	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Lebih relax setelah dengerin audio el genesis sebelum tidur	2025-08-12 18:04:23.859671+00	community	f	\N	1_month	f
a88b7821-8ec6-4fa3-a2e0-75038e82623b	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	2	t	Pagi ni dengar audio, badan dan pikiran lebih fres	2025-08-13 01:46:24.537793+00	community	f	\N	1_month	f
700eb5c6-fda1-4910-8d97-bf664798ea38	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Lebih semangat beraktivitas sejak rutin meditasi🔥	2025-08-13 04:35:37.475985+00	community	f	\N	1_month	f
5b5a691d-0c6c-4599-985f-e4803fd30d69	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	t	Semakin hari jiwa semaki  tenang, dengan rutin mendengarkan audio Genesis..	2025-08-14 11:18:53.118062+00	community	f	\N	1_month	f
30883550-27ee-4154-809e-8bbc61b59b3a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	10	f	Semangat semua levelup, menunggu Chapter II sampai ke verse 20	2025-08-28 09:37:03.638559+00	community	f	\N	1_year	f
a2a8541e-f346-463d-9100-f098d3a32cbf	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Alhamdulillah baru denger verse 1 , denger audio renungan 2 menitan dan juga isi jurnal melepaskan xp naik, tinggal 11 xp menuju level 2.😊	2025-08-16 01:09:13.732723+00	community	f	\N	\N	f
6e1cd603-7bf9-44e9-9ff2-dcf515d7a9a8	6c75dcb7-c195-4940-a134-712ba6641ebf	Aylen Eutychia	1	f	Suka aplikasi ini bikin semangat untuk upgrade diri Masya Allah	2025-08-16 01:10:03.182597+00	community	f	\N	\N	f
6a5d08f5-8d2f-4d13-b676-7ef8bc581756	f6560fca-177d-497f-9225-a597ed888589	astawe	3	t	Nikmatnya mendengar versi5 yg sempat berhenti saat belum berakhir ,segar raga pagi ini, bersyukur sdh di level 3	2025-08-29 01:45:34.881481+00	community	f	\N	1_month	f
b85f54d3-e8ea-4375-b863-7c21d9925536	ed289706-acf5-4af5-9301-2bfb0128f0f5	Setiadi	3	t	jadi semangat	2025-08-29 10:25:20.895046+00	community	f	\N	1_year	f
13268342-4404-44ba-8640-f99e37a0bf49	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Selamat pagi sahabat semua selalu bersyukur nikmati prosesnya tetap semangat ✊✊✊	2025-09-07 21:39:21.681871+00	community	f	\N	1_month	f
f7984c04-80af-47f4-ba60-46434416bffc	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	t	Selamat malam teman seperjuangan. Kalau kelas menunggu setiap senin. Disini tinggal klik verse langsung kelas	2025-09-15 13:17:37.991504+00	community	f	\N	1_year	f
129df5a4-7f59-4286-9d3a-e50033e7e2ff	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	3	t	Makin keren nu aplikqsinya	2025-09-01 00:16:54.342946+00	community	f	\N	1_month	f
708449c8-1aab-483f-926d-c9a2168ee4c7	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	6	t	Alhamdulillah dgn menggunakan Aplikasi ini saya bisa sampai ke singapore tanpa biaya. 😇	2025-09-04 12:50:07.074386+00	community	f	\N	1_month	f
648e5e13-76a3-4cac-b6a5-c42840f17a22	a2e8495f-d2c1-4e04-9db5-faa976f59207	Adi Setyo	1	f	Salam kenal saudara2 ku 🥰🥰🥰	2025-08-11 00:55:03.063998+00	community	f	\N	\N	f
4958040c-7b00-438a-b138-0d1c8ba11e3f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Baru bisa masuk, terimakasih allfather	2025-08-09 21:50:45.888707+00	community	f	\N	1_month	f
1c73877c-4664-49b8-8ec9-4bff81984da2	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Salam kenal sahabat semuanya	2025-08-09 22:04:14.843964+00	community	f	\N	1_month	f
dfcdfa78-91ca-4b6c-b837-899c934adfef	08c375cf-3e32-486b-b211-4c28e6239093	Harir	1	t	Salaam. Rame banget. Apa apk ini sdh lama kok baca komen kayak dah pd kenal banget..	2025-08-10 05:15:14.216874+00	community	f	\N	1_month	f
e26c7915-d202-4e46-9ddc-3daf6e4b41fd	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	1	t	Paling Kereeen, Apk paket lengkap.. Dari Audio sampe Jurnal syukur juga ada disini.. Pokoknya The Best Lah... ☺	2025-08-10 08:14:33.614085+00	community	f	\N	1_month	f
b0184cd9-e2e7-4363-9fe2-e41a2a5facdf	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	Raja Syuryadi	2	t	Kembali menjalankan rutinitas, menutup malam dengan meditasi	2025-08-12 12:23:06.910901+00	community	f	\N	1_month	f
ea791627-ac26-4b15-80e1-c25e54a9ac3d	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	1	t	Br myoba aplikasinya dr sini bisa pantau progres kita, mantap lah	2025-08-10 21:27:54.759966+00	community	f	\N	1_month	f
8b5a8e92-46a9-4692-ad59-c149350f9408	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Semakin ksini semakin terasa lebih rilex lebih nyaman  terimakasih allfather.	2025-08-14 13:59:54.345945+00	community	f	\N	1_month	f
7468e99d-fad6-4506-abbc-9551329ef7b7	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	2	t	Alhamdulillah makin tenang setelah meditasi😇	2025-08-14 17:36:09.692523+00	community	f	\N	1_month	f
b7a50c2e-6214-4209-83e1-66555f3afb8e	f6560fca-177d-497f-9225-a597ed888589	astawe	2	t	Puji syukur,malam ini sy bisa lanjut dengar versi4, terima kasih allfather	2025-08-15 13:58:23.711067+00	community	f	\N	1_month	f
b8418b37-89b8-4fe4-b9c2-f9da81253ed9	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Mantap, aplikasi ini sangat membantu	2025-08-10 15:14:05.332526+00	community	f	\N	1_month	f
f1ee2f73-dd5b-485c-979b-b6b80ae9ff57	38625adb-dcfb-4bac-b473-2e6ee37af72e	Senz	1	t	Aplikasi ini sangat berguna, membuat saya bersemangat	2025-08-10 15:24:23.109444+00	community	f	\N	1_month	f
0c27eae8-2a50-42fd-99c3-56fb97ddd421	c644f60a-2f41-41fa-8814-b698c5154474	aisah	2	t	Pagi	2025-08-22 03:28:18.512334+00	community	f	\N	\N	f
2b36adb8-a422-4d51-acbf-40c336b2a031	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	1	t	Alhamdulillah renungan pagi ini membuatku lebih yakin sesuatu yang menjadi rezekiku pasti Hadir datang menghampiri.	2025-08-11 21:56:20.892763+00	community	f	\N	1_month	f
7efc0e55-c761-418f-ab14-625f35764911	74a895f6-e11e-47a6-b4d3-a89092905776	Evira Rotorasiko	1	t	Good morning…salam sehat selalu, have a nice day😊	2025-08-12 01:20:00.455803+00	community	f	\N	1_month	f
2c7059c4-1c29-4a9c-b096-9a194e680247	22c2ab08-6a42-44c3-b290-dedba2161dd0	kiki sandhi	1	t	Br selsai denger  audio 4 , rasanya seger pikiran ini,.	2025-08-12 02:28:49.820226+00	community	f	\N	1_month	f
b0e0bb4c-572d-4011-83dd-158abed67a88	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	🔥All Father🔥	10	t	🔥🔥Selamat malam kepada seluruh anggota eL Vision Group Pengumuman Penting  7 September nanti akan gerhana bulan jam 00.00  Meditasi untuk mentralkan energi dan memperkuat energi positif sampai lepas. Bisa dengar Verse berapapun.  Untuk anggota Ignis, wajib menggunakan Kategori Verse The Three Table. Verse Tiga Meja.	2025-09-07 13:55:16.404478+00	community	f	\N	1_year	f
1f22e4ea-2eb9-4892-91ec-db6818115752	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	Gustian 	9	t	Siap All \n  Father sudah dinotif kemarin	2025-09-07 14:05:00+00	community	f	\N	1_year	f
af895b47-1948-4d26-a11b-4779b0a79af5	9c03719b-0e18-4851-b6ec-0abc3981df9a	Made Bangli	9	t	Stand \n  by	2025-09-07 14:30:00+00	community	f	\N	1_year	f
e70e3c9e-f1cf-451a-92db-e262ee758635	ab68113b-cba7-4243-9544-8d932abcb521	Putri Wahyudi	8	t	Makasih informasinya All Father semoga bisa kelas bersama	2025-09-07 14:45:00+00	community	f	\N	1_year	f
df632659-45f9-4d79-9afa-e47765bf2763	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	Tian Leeeee	10	t	Thank you \n  All Father, Noted !.	2025-09-07 15:01:00+00	community	f	\N	1_year	f
f668014a-8438-470f-b923-6e8ba64ae0d5	d828905b-bf9a-4672-9233-8411c39d4371	Agustinus	10	t	Sudah \n  saya nanti moment ini	2025-09-07 15:10:00+00	community	f	\N	1_year	f
0ea97248-c727-4c57-901c-804a05e0445e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	NANDANG SETIAWAN,S.H.,M.H.	1	f	Salam kenal bagi rekan2 semua	2025-08-28 13:59:50.721481+00	community	f	\N	\N	f
1cc34cbe-9f10-44f1-bad1-e8c1da14a9b7	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	Andin	1	f	sillahkan ke Profil dulu ganti nama Biar keren namanya	2025-08-10 12:51:18.489362+00	community	f	\N	1_year	f
fb392f79-7a05-4cc9-99a6-2a418945da6e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	Sam_165	2	t	Menikmati rasa syukur terdalam dengan mnyimak audio hasil karya Allfather  terimakasih.	2025-08-30 12:08:34.492604+00	community	f	\N	1_month	f
5b2251a6-b70d-4126-b536-cb3582008345	08c375cf-3e32-486b-b211-4c28e6239093	Harir	2	t	Menyimak...	2025-09-15 23:05:00.879914+00	community	f	\N	1_month	f
\.


-- Completed on 2025-09-23 21:20:30 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict pzgQKNCgSjUeYn7gj1UpSCmh4wEqSHOKeMb43Aq7G1OledDyVzrWJYW4PWvQvc7

