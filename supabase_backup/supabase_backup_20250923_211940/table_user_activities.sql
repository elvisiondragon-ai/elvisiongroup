--
-- PostgreSQL database dump
--

\restrict 1ABaOvUUvUYfsuMn1MHWYqHnHbo2YXfFdL6yeF7LcwrAaScDTwtNn5sel1JWIxh

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:37 WIB

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
-- TOC entry 4067 (class 0 OID 155892)
-- Dependencies: 383
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_activities (id, user_id, activity_type, xp_earned, metadata, created_at) FROM stdin;
33fc6cc6-6e2c-477c-860a-3f508324da88	c644f60a-2f41-41fa-8814-b698c5154474	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 13:02:45.498896+00
bbf2e4b5-06a0-4800-91f0-eee7ee07c0d6	c644f60a-2f41-41fa-8814-b698c5154474	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 13:07:31.927801+00
3854a31f-7c4f-4ad8-aeec-78ae559fbbc4	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 13:35:29.541518+00
86e31195-d5a0-45b8-9baa-835ba8dd3ff0	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-10 13:36:38.133906+00
15f4d324-4329-41f5-8d3c-6d36db36ebe8	b5795b79-a98d-4a0e-90fe-0002b2a03153	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 13:38:32.137024+00
c88223d9-0e0f-414b-bd43-7d61bc975021	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 13:38:43.478689+00
74008a47-14be-438b-ac39-23e15182dc78	b5795b79-a98d-4a0e-90fe-0002b2a03153	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 13:42:23.100585+00
45c46a66-ff6c-4210-a63f-0e5653616d79	8dd5df2e-73f1-4939-b0fb-312c88561c71	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 13:42:37.66279+00
88cbf824-5db2-4d3e-a595-75b1d7be7ff7	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 14:11:26.184997+00
ec0e05d2-8158-402d-bb26-286fe92fec90	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 14:26:32.254016+00
9431911c-9c95-47fb-b143-c3c2410407c6	452f7104-4869-40b8-b62d-b3ba94c74c2f	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 14:31:37.325353+00
1e05f8f6-5290-4c61-acca-e831468e2a39	452f7104-4869-40b8-b62d-b3ba94c74c2f	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 14:33:43.239218+00
e81fe620-6d8f-45b4-b268-2ff5c95e4bdd	452f7104-4869-40b8-b62d-b3ba94c74c2f	journal_completion	5	{}	2025-08-10 14:34:45.524222+00
29a5ea26-6213-43ad-8380-2d845ed93b3c	0c12da4d-9494-4516-9d3d-c74d6d605412	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 14:37:11.238256+00
6998054a-8421-4caa-b318-acf17311ff7b	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 14:49:13.187732+00
78d855ef-11b3-4a3e-8a45-c42b1d317bc0	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 14:49:33.965341+00
bd7e5282-a4a7-4e58-8016-194ceda5122a	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-10 14:53:58.122234+00
47228123-dfec-40f8-a7d9-59ba5cfd7dc0	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 14:59:23.083859+00
b72ec1f2-1fb2-4d23-85d6-9d1ef8a8b0ed	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 15:05:09.415448+00
41e0606c-fcee-43bd-8654-b8093fb7410b	f6560fca-177d-497f-9225-a597ed888589	journal_completion	5	{}	2025-08-10 15:06:40.15055+00
ec39493d-5a73-44d0-a84b-f304cef0ef08	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 15:14:06.323354+00
4f04b5f8-aeca-4977-b201-722be51f423e	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 15:24:23.751234+00
37e8c6c3-b6fd-466f-b408-3f8fef8e0484	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 15:51:20.120615+00
369d8ce2-40cb-43a3-9d26-d6dd9434cde8	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 15:58:06.105671+00
7c23b2f0-2b7f-47ca-a6ad-71a8b8fa83e0	08c375cf-3e32-486b-b211-4c28e6239093	journal_completion	5	{}	2025-08-10 15:59:43.134091+00
1d896039-2584-48d1-9a05-368879429951	71a968fa-20e2-40a3-b260-004d43cca420	chat_message	1	{}	2025-08-10 16:01:23.024073+00
cfaad56b-6dd3-4c8a-8c5a-9465264c8c43	08c375cf-3e32-486b-b211-4c28e6239093	chat_message	1	{}	2025-08-10 16:01:44.556721+00
19caa20f-50db-4dbc-945b-5b0fc0836d72	08c375cf-3e32-486b-b211-4c28e6239093	chat_message	1	{}	2025-08-10 16:02:32.003665+00
83e3ac37-fe76-4516-9a80-eb5401f202f6	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 16:04:41.68742+00
f606bb77-2a2e-4c00-8775-505e4f8cf6a5	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 16:09:41.791556+00
f0b1f456-ea0b-4f1c-8077-a8b3c96bd223	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-10 16:11:14.302146+00
a57b879f-29ea-4c0a-97c7-e8c44b443986	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 16:11:59.175839+00
f5cff513-d574-44aa-ab8d-8e9f8e963e43	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 16:13:59.552762+00
b75a4f8f-f5a8-4777-a1cc-ff97c6ffd3b8	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 16:19:41.278921+00
176a11d5-f53b-40ba-a9bc-a1df7fc70b8b	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 16:24:33.97816+00
ad42c995-1aaf-4a89-98ce-6122a034035d	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-10 16:41:19.171292+00
797d0f8d-e4b0-4de2-8be9-b4259e29d845	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 16:41:54.998709+00
a4a8e452-572a-49c2-bcfa-89c510c1be6b	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-10 17:14:44.102905+00
50b47816-757f-4f9c-beb3-0bc8ea0871e4	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 17:17:42.117184+00
4566252f-3566-4602-9de8-083001006656	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-10 17:19:49.90223+00
c5146d9e-229a-4134-b3d0-1dd7feb75a12	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 17:47:10.496155+00
831a8a71-aa6d-49cb-94d5-c1fb5e6e38b7	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 17:51:11.252586+00
b3cc950b-78c5-41d5-9748-4a9a4171ed63	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 17:52:20.829538+00
1ae4c2ca-1880-4553-b418-31631e35d012	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 17:53:49.798591+00
23cf4b00-fe1d-4148-b013-036d1c6f8abf	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-10 17:58:48.896781+00
4c7f0149-8c50-4ba6-a67c-8e990a79403b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-10 17:59:07.970366+00
801b7aea-c31e-4952-8580-1395066012e6	c644f60a-2f41-41fa-8814-b698c5154474	admin_bonus	140	{"source": "admin_action"}	2025-08-10 18:10:06.62855+00
a2f3dc84-4328-4f5d-a568-5d9a6012d37d	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-10 18:11:14.933372+00
fcb24649-9135-4729-a016-ecbf4f72698b	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 18:15:54.384248+00
d5ad1a87-c8d6-4573-ae87-69288ef153a9	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 18:42:29.318839+00
4ea75953-969e-454d-a7da-7a6f28ed090a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 18:44:53.809455+00
c165ff22-9e49-4ff2-a219-0bd3fc4f0a1d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 19:09:28.015488+00
1ec791d0-acdb-453f-9719-222099f272bc	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 19:41:47.156545+00
65788868-6f4a-4b0c-a2a5-103d483096f9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-10 20:15:53.937836+00
74d241f6-77ed-41fd-8c58-9d6070921e0b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-10 20:47:43.373902+00
b0395131-82b6-452e-a2ab-dba6b2bacde3	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-10 21:16:29.404776+00
2269d9d1-58f7-4e61-ae43-8b9cb576e1e1	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-10 21:27:56.090633+00
d22178dd-61b8-4a09-b6f1-48eb6b301475	08c375cf-3e32-486b-b211-4c28e6239093	chat_message	1	{}	2025-08-10 22:14:28.619522+00
1024e901-8e31-4bf0-a02c-7a1f48858f14	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 22:16:43.93257+00
a601adbf-e289-4485-aa21-4ea31f3e686b	08c375cf-3e32-486b-b211-4c28e6239093	journal_completion	5	{}	2025-08-10 22:17:38.451828+00
e4ecc956-73b0-40e8-926b-a15fada8837b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-10 22:23:26.206408+00
e9a7f059-a5a8-4e11-a260-2e15055ab4eb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-10 22:27:24.537418+00
1f23ecf0-dafc-4a3d-881a-0cb9411c1736	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 22:48:23.91317+00
34e712ca-2620-43a7-b215-f37800502b62	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 22:58:31.826266+00
75ee03c2-c244-4925-94e7-1892177ee02d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 23:01:02.705556+00
fb01e51e-3d33-4eb7-8916-c2e70774f479	71a968fa-20e2-40a3-b260-004d43cca420	chat_message	1	{}	2025-08-10 23:13:07.655059+00
b5c1a37b-3853-4a1d-97f0-fc60f7e9f43b	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 23:18:19.19854+00
0a2e26d7-cb4e-4ca0-8ca5-9acd53c50c9c	8dd5df2e-73f1-4939-b0fb-312c88561c71	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-10 23:18:29.406788+00
908817f3-a179-41a0-b8ab-ed914a315972	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 23:20:44.923839+00
22335815-f33d-4139-b9ea-825c4ade6b7f	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 23:32:25.482433+00
e8bab530-86bb-4e51-b257-d6ead3283f6a	a2e8495f-d2c1-4e04-9db5-faa976f59207	journal_completion	5	{}	2025-08-10 23:33:17.633597+00
357cb060-58ab-44f5-a721-a4d8bec63e49	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-10 23:48:16.017831+00
5dd3e63c-b609-4ecd-a1c9-7f262e7674ca	f6560fca-177d-497f-9225-a597ed888589	journal_completion	5	{}	2025-08-10 23:51:03.954389+00
b25d833e-6f22-4622-ac50-86bcbbc73cf4	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-11 00:08:39.678421+00
0e730dff-3804-4c0c-b03e-526380fa93f1	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-11 00:08:50.627452+00
59b119cd-d733-4ab9-b905-6fb59a9b3a42	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 00:24:13.974549+00
b93fad41-9265-4481-a0bf-fc49857db17a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 00:32:34.770882+00
2d2d73cc-858a-4f6f-98f1-c1a735b77f51	a2e8495f-d2c1-4e04-9db5-faa976f59207	chat_message	1	{}	2025-08-11 00:55:03.866221+00
2e5e6b0b-09ed-4c61-80b7-2e1d9eecfeaf	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 01:01:36.109392+00
210835a4-28ee-4b62-b49b-2606f64aa313	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-11 01:07:05.547089+00
24f9a77c-b1ed-4136-a143-0f5a6622070a	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 01:07:09.178438+00
66aa109e-0194-4c5e-bcc1-e5d2a1aa1ec1	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 01:28:09.664557+00
70f58933-c84e-4990-a7ce-617b30a2a6ca	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	journal_completion	5	{}	2025-08-11 01:36:51.194535+00
02388025-2773-4107-8ed4-729c66fcc263	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 01:59:10.395311+00
7fff33a6-dff8-48d7-93ed-16542ab82dc7	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 03:05:55.481239+00
13464cd4-541a-4524-8886-769e8dce7982	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-11 03:07:27.07401+00
9c73a013-0bea-4692-9df3-ca0c10be9dc2	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 04:24:25.213105+00
13be8505-6b52-4804-a527-8b216bc0808f	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-11 04:25:58.129127+00
79ff8535-9595-4c25-b094-e310cb51668e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 04:26:14.902688+00
d94fcb4f-e1e2-4440-b12e-c420c0e23bca	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-11 04:28:31.779292+00
0a3c2255-c1d3-4275-af6b-1027a6dbd6c2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 05:35:51.903711+00
72ee5e44-d04b-40cd-a502-579990a182de	8dd5df2e-73f1-4939-b0fb-312c88561c71	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 06:23:13.498597+00
ac0af870-c87a-429e-b35a-78c899fd61ac	91f3b294-d544-4d42-9639-a30efa64783e	journal_completion	5	{}	2025-08-11 06:58:23.292421+00
ff297ca7-8d99-4e39-b9ec-169fe42dbda1	91f3b294-d544-4d42-9639-a30efa64783e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 07:00:37.666064+00
ab32ee74-c95a-4973-be27-25d0a14c2cc5	91f3b294-d544-4d42-9639-a30efa64783e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 07:18:22.315585+00
53654d4e-1526-47af-ab33-df8daf63b5ed	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 07:23:30.32816+00
96922169-5732-46ff-97ca-abb6423e92a6	91f3b294-d544-4d42-9639-a30efa64783e	chat_message	1	{}	2025-08-11 07:35:06.86087+00
b709a2c3-6df4-4a6c-90c9-c3936c0cabdd	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 07:43:51.98062+00
5d544320-b11a-4edf-834a-4e4f76f45805	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-11 07:45:08.834843+00
cf5b37c9-4b1e-4f78-8f26-1790cebc5c4f	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 08:01:25.854671+00
8d907c33-704d-4be8-8f47-cd53c89c6241	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-11 08:05:23.337293+00
764d6b97-a121-4a15-9ed9-55d01e32dce9	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 08:48:42.966661+00
4f1c6a8f-f329-4d6b-a044-01869f5322fe	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-11 08:51:57.109161+00
4f83fec0-8d5f-4c96-a39b-ae96abaf5cfe	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 08:55:30.066892+00
d0e50885-5daa-48c3-bac2-dd5abbe33b13	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-11 09:03:54.046484+00
009e908a-7dc2-4137-a6c8-a2ae239fda18	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 09:06:09.751837+00
2046b2ca-045b-4f20-9a89-1159794b48ed	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 09:08:30.808432+00
b056a22e-afe1-4a8a-baf8-b2eb35a4a856	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 09:39:46.888344+00
bc1d255c-2dd8-4cf6-b8c4-22bc0b1703a1	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 10:20:35.096373+00
3fbc09bb-45f6-44ac-a9f9-e2790a80e6a2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 14:00:50.672261+00
28297fe2-9de8-48e6-9201-220e7f9d6954	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-11 14:08:15.826482+00
5fd54dd2-c093-47f2-8f73-78aeb0d11a37	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 14:12:14.680215+00
a49904ff-0637-45de-9eb8-f245ac1e38ed	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-11 14:13:59.14879+00
4cc3df3e-4cfa-42b1-a2c0-42e211e5397c	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 14:15:47.099434+00
cd299c20-3fc9-491b-9af6-d8b6eb71b205	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 14:47:02.288134+00
21b6e219-0102-440d-8bd3-e3356ccf04d0	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 15:17:11.907546+00
124844ed-c399-4228-8a7c-fc4caedef4ee	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-11 15:22:05.378974+00
4db4a4f4-1fe9-459b-a24a-ab09542a0cd9	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 16:04:17.610285+00
7d2c0e74-6b66-4ece-a98c-208516390979	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 16:04:17.610289+00
69fdf7b8-8120-4ac9-9d34-0f1931a61f07	0612726d-b0fd-417f-9fae-b4e6bd79e5cd	chat_message	1	{}	2025-08-11 16:26:50.483094+00
c56cc825-0b3b-43c5-91ff-e90da94b46ba	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 17:23:27.526911+00
55f705a2-7601-4891-9882-454e47f0af38	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 18:34:41.267455+00
3b34fc0d-c580-48dc-a29d-756b67f6d5f2	18d08fe3-6f60-4abc-a51e-75360e88d54c	chat_message	1	{}	2025-08-11 18:39:40.557687+00
7a70f851-3bc9-4291-a8ac-86aad77a156c	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 18:50:52.908524+00
5403df0a-0283-4c52-89e9-af392e26df5e	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 19:25:04.927686+00
372060b0-ce6f-4ed1-bcf0-aa4e09e569d7	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 19:34:02.211401+00
a97a9ea5-1c63-4ff3-8ed9-b60c698bc839	716e24e3-7f10-4df2-b64b-2cd6a05f937b	journal_completion	5	{}	2025-08-11 19:34:55.470032+00
cde180b4-f61c-4d55-8147-c78d371d2879	716e24e3-7f10-4df2-b64b-2cd6a05f937b	chat_message	1	{}	2025-08-11 19:36:23.999648+00
9b0d6951-cac4-4615-bba1-7f224a3361b3	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 19:39:11.678531+00
eac95278-8f94-451e-9294-00e4ede5fe80	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-11 20:25:49.911761+00
7ef80de3-daa0-450b-bd4d-1527a504082d	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 20:28:07.871208+00
88a81d91-485c-45da-80f7-6a94f90437ac	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 21:03:02.750102+00
75c647b7-5c5f-4276-af31-be0dd1c00b4f	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 21:30:20.928399+00
b389990b-d98e-4f46-848b-0396658068e2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 21:30:54.584532+00
abeef416-abc3-4bbf-bcb0-5e48b7011e5d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 21:33:44.689941+00
bb815b95-5979-47f5-8e94-e9b08573f62d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 21:50:21.867954+00
0ad9368d-58d7-4f25-927f-1eaff1276e2f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-11 21:54:06.096605+00
000ce4a8-7895-4274-b947-b4c10b8283c1	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-11 21:56:22.052776+00
bdcf6f8c-a42c-4997-a8b6-1f53cb47a92e	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-11 22:18:10.263162+00
f8afe075-53a8-4cd2-b14b-7093e7af834a	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-11 22:48:52.092423+00
0a998fc8-177b-4ddd-a9df-268b196e8e1d	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 23:04:20.925907+00
d557facc-6012-4ba4-8045-06cf361891b8	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-11 23:24:49.972228+00
8f8b45d0-4cae-46a7-b4b0-977f4eb39bc8	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 00:45:44.724873+00
e28dbe9c-6cdc-4b00-9013-fc0041bb7be7	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-12 00:46:50.127885+00
08942d74-c661-40ad-80b5-d62197378aa3	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 00:47:38.817158+00
ea451f43-d35d-44a6-abba-f56a5846b6f1	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 00:49:46.171358+00
fae73f40-69e2-4e28-a5dc-e6b1eb9537a4	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-12 00:57:57.922857+00
b5533bdc-9ee2-4bbf-948a-f027f2e7b99c	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 01:17:55.720381+00
4ad4e1d7-96f1-414a-827e-4715c62b8ccc	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-12 01:20:00.888208+00
9543a998-cb1c-4b12-9f9e-821887b489db	38625adb-dcfb-4bac-b473-2e6ee37af72e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 02:19:59.873026+00
2560047f-d26c-4787-9fee-cef6e450ceae	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 02:20:50.331469+00
70f3ecbc-d51f-4d2f-a8e0-04ba9488ac9e	08c375cf-3e32-486b-b211-4c28e6239093	journal_completion	5	{}	2025-08-12 02:24:33.469354+00
422323db-bc53-45f2-bf7e-26d43c3cd5e0	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 02:25:04.696697+00
b1e14ba4-edbf-483b-87b8-c1645d4e82eb	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-12 02:28:50.896696+00
8c2d3a71-0b02-404f-8c89-3e79ebbecdfc	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 02:29:12.867715+00
3c3c0c50-c59b-4433-8f6b-066b7d825bb6	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 02:45:00.164212+00
37febbf2-30f5-4ebd-9bba-bc946b154397	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 02:45:00.168765+00
2ee4508e-2c54-4fbf-b46c-2512f5193ff1	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 02:45:00.170292+00
7b081304-b086-43d0-a5fc-c70f9fd8b16d	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-12 03:19:19.534244+00
a3ebb48a-2517-4e6c-9524-1c3755785a79	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 03:24:31.300765+00
614f956f-be71-44e7-a08e-45a8b1ea3190	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 03:35:35.62952+00
a60068c1-f7d2-4306-9c82-3a83e1070c81	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	chat_message	1	{}	2025-08-12 03:37:55.948726+00
b66da1c9-251a-4a9f-9ae0-3810b81a7f88	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-12 03:38:30.47117+00
487edc77-676f-484a-93f2-b73e3e7148be	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 03:40:48.797733+00
7d8109b0-7c82-4d51-9f18-f171558ec337	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 04:09:13.610456+00
76e53a5d-761e-43cc-94cd-8e6905985632	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-12 04:25:05.028928+00
faaa792e-e1cc-4f24-8186-7cc967b299e5	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-12 04:29:56.493104+00
fcbb3cf0-6f38-4029-b547-51295f7edc7a	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 05:20:37.584198+00
4eafc3bf-58e7-443f-bd4c-4b5e627e329b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-12 05:33:38.025872+00
f205d9d2-9a5b-4b23-82a4-6d88d7275227	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-12 05:42:17.282605+00
04c38f3c-6398-4c2c-bdf4-14d2c99a51a4	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	journal_completion	5	{}	2025-08-12 05:47:51.669939+00
8ebfac7d-8c7d-4a97-8d02-0928db61ef03	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 05:48:02.737464+00
3cc6edfb-378b-40c7-8c04-959f3df7b4bd	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 05:49:02.574609+00
a9b6522f-50ea-44a7-8ff5-858fd6f7043d	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-14 23:29:15.840846+00
84b8153b-7562-4ec7-bc70-43032e9206a5	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 05:50:07.592905+00
d410ebab-be55-423c-a146-71db2a3be913	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 05:52:19.938318+00
e3a353e7-0e7a-4ec3-806d-05f5dc0105dc	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 05:55:11.30908+00
0f03d6df-c4da-4d98-8ec7-1f2f95bbfc78	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-12 06:14:37.55157+00
8d790a2c-e330-4b84-857a-a3d471e6abdf	5f250128-655b-41a4-af15-9df32a5ca672	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 07:32:42.194391+00
f6d71a5a-632c-4432-aa9b-9ead6df36747	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 07:57:12.932609+00
2de82de8-391b-48ad-a232-53a25f4fac83	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 07:59:42.416769+00
7d7d2a39-6d41-4fd9-a29b-57fe9b51aee3	5f250128-655b-41a4-af15-9df32a5ca672	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 08:05:27.341206+00
b858ead2-2065-4305-8754-b958927e26df	5f250128-655b-41a4-af15-9df32a5ca672	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 08:12:21.465565+00
c4b90fcc-39d8-47f1-a38f-768756dfad81	5f250128-655b-41a4-af15-9df32a5ca672	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 08:14:42.061209+00
a89cf2c3-8900-4c13-ba1a-50efa1d780b9	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 08:30:50.833181+00
e23014b0-5d02-41d3-918a-78b87a1bc00f	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 09:01:22.518919+00
58b29235-c381-4485-9670-fc7fce6afe47	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 09:03:52.000676+00
f29f1b1a-413f-431c-a7c7-f1f0363b7adc	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-12 09:05:16.247502+00
fba84820-2ff2-4257-a28c-30096bdcfb20	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 09:07:56.882714+00
e231bee6-b9c3-46e8-bf44-bd3514c1c7ad	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 09:44:05.347116+00
2423e440-e3d7-4f94-9477-7e2504946eab	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:33:24.38154+00
83e0c4b6-522f-4ae7-b977-c66fbfb47441	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:35:31.25503+00
5f8fafb8-e1ba-4dac-873b-e5d9e37e646e	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:37:36.556263+00
e1108b75-c97e-4c44-b487-0a0d44de3398	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:39:59.924583+00
316083f1-de81-4a01-b8b8-b6d39f9c7381	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:42:04.537145+00
60040a90-81bd-473b-a49b-53a610a02010	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:44:09.767896+00
1af24b4d-ea3c-499e-979b-b3184298fd78	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:46:14.03087+00
8111c15a-e8d9-42e1-90d6-ca7558d357fb	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:49:02.790283+00
5d82d6a3-6ce2-4468-a939-ef591467dbec	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:51:08.181009+00
49abbebc-38d3-4616-a3b0-0a51444c1f62	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:53:12.672681+00
c54a7d6c-419d-4183-a7a5-b8c89fd7758c	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 10:55:16.881212+00
6b067d3b-a32e-4ec1-8de6-9e8381a1863b	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 11:48:36.415738+00
b64a1a54-61c6-4e64-95f9-97b86f2bdf12	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 11:58:24.974357+00
9b4cbb28-0b56-481e-aa69-b5a778aca0bf	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-12 11:59:25.277629+00
95a43a22-f28f-42f8-b6f8-321ed8b6d2f4	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:00:59.75182+00
93c6d998-c5ac-42aa-84ad-b0e8f649efd7	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:00:59.772122+00
9bae5ea3-19f5-456e-b480-57907285d5ad	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:00:59.775249+00
2965bc7b-d3de-4430-9b18-a6e70cf77cd3	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:00:59.786121+00
4ad4b414-48ce-47bb-9d6c-d94f8efacd9b	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:08:11.990785+00
8f5a257a-367d-409d-8a5d-43e7b09994f4	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:10:41.351427+00
b3c85ca3-6ee2-47ad-b06f-2961572ced5f	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:12:46.511196+00
f338d190-ec0a-4701-a6d4-0fb8355f74ff	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:14:51.35066+00
cda6c4cb-8c26-4a16-b8c4-8e8b515b38ac	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 12:19:35.670191+00
18834caa-2af8-4f7b-a12a-253f2181508d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-12 12:23:07.864485+00
f276c44a-86a2-403a-ab98-5ff951a35df9	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 13:04:29.768208+00
69a08fb6-e858-48df-9157-081e6fe15d7c	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-12 13:05:24.546202+00
4f821040-fcd9-4775-a570-e6f14e1263a9	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 13:59:40.278171+00
747bfc43-0f9e-468b-bde9-62956b1671c0	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 14:01:55.493326+00
44830749-2bdd-4bfe-ab6e-4e85275d60f9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-12 14:05:56.855599+00
1558db88-9921-4ff4-bf5e-71cde161b94f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-12 14:06:06.355477+00
bf87430c-91df-4d26-9b06-db8ad0243271	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 14:37:35.136785+00
e56c5d41-9f7e-47a5-8da1-6dd86634270e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 14:53:01.306544+00
e8029982-0273-491a-8c63-b75f1180243b	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 15:10:16.2639+00
e90bd455-c02f-4b2b-a400-535b9da7f8ec	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 15:15:49.734643+00
e36b48da-038c-4738-887d-112e31a44464	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 15:33:29.467054+00
120da23f-9129-4166-a0df-5807873a1014	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	5	{}	2025-08-12 15:34:17.794421+00
eda23872-63b4-4a5f-9c6e-51c09be3da4a	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 16:05:12.908205+00
7d6ed6c8-6baf-4469-af1a-8923c9e0272b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-12 16:15:38.648881+00
d554e5e1-ab42-42f6-8910-d4539e398553	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 16:59:31.859041+00
d051e371-fb7b-4dbe-9821-2b8677a65a5e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 17:25:56.890151+00
9885deed-80a2-413f-a900-0616cbae43ac	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-12 17:26:45.378265+00
843eba7f-a6ce-4982-8d1e-3f45660b4bfe	38625adb-dcfb-4bac-b473-2e6ee37af72e	journal_completion	5	{}	2025-08-12 17:30:46.845309+00
9ce1ee4e-993a-462c-9369-ff51195f4a20	38625adb-dcfb-4bac-b473-2e6ee37af72e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 17:32:11.413898+00
2dbe9d8c-09ce-4ee3-baa7-7e6d654144d0	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 17:33:06.515432+00
4d72a2a4-fad9-465b-8fd8-7afce59a3f68	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-12 17:34:46.663883+00
48cfa695-e367-44c6-9ab2-2db1d1489d81	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 17:59:49.02706+00
a1eded91-3ef3-4aa0-83da-fd556ca0f5b5	38625adb-dcfb-4bac-b473-2e6ee37af72e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 18:03:42.47518+00
f60378b8-9eb1-42b9-89d3-9c65edb0f0e7	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-12 18:04:06.524378+00
72292d8a-7153-47e9-9e27-6bedb8a2d5f3	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-12 18:04:24.150563+00
d40f9e24-62e6-4a03-8d35-e3c40547dcb2	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 18:12:46.08091+00
c2cef0a7-f75b-4e34-8061-ebd209147113	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 18:18:40.107247+00
93325924-ed08-4838-829d-d83d44a6b53c	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 18:55:01.029859+00
ea72da77-befd-487f-a942-e7af507280f9	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 19:40:49.311661+00
c2f108c5-e704-4856-adaf-1eabfa6b9783	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-12 21:46:36.198508+00
43877e25-b611-4121-b553-8e787b15080f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 21:48:46.198886+00
fc2be4de-e8e5-45be-8afa-1ba971d00a51	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 22:03:57.765447+00
50f01ee0-1265-46a6-9654-ce2dae54d840	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 22:06:11.857901+00
f6fb1f93-3ce5-4a16-935e-d8e5a20fa1fc	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-12 22:20:08.713844+00
b7cacb02-d0f6-4a31-aa14-1635933d4941	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-12 22:39:22.018505+00
3bce5124-9b8c-420e-9f15-4591424a27f0	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-12 22:54:08.959422+00
a0db471c-1dd5-4459-9426-94f122e70ca2	08c375cf-3e32-486b-b211-4c28e6239093	journal_completion	5	{}	2025-08-12 22:57:02.366987+00
90ae770b-9012-4193-b9ec-971f5ea9ceb3	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 00:37:36.506258+00
40f771d8-ca03-4848-a2fd-f8d00e28156b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 00:45:03.77082+00
e6c36223-9df5-4a82-8470-783ccdf106fd	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-13 00:46:35.387217+00
47b53c30-8b86-42f3-8d95-a6201cd999b8	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-13 01:46:25.575528+00
739783d7-e125-45cf-9535-52adfcd565c1	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 02:34:02.085951+00
0db40473-f957-42d3-97ff-10f09e7815a8	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-13 02:35:15.496316+00
db127f7b-f55d-480c-a15d-30929daf9439	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 02:55:53.67122+00
4a8026c9-05b5-4b37-b87c-265ffd4d17aa	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-13 03:04:16.891886+00
77d4a793-a6b2-40ca-915c-63907f4a28cd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 03:06:30.169462+00
36ab4c94-d8b9-47eb-b174-6c53feca0531	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 03:37:12.780351+00
c0b56879-2c72-4866-ae08-fad871f12664	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-13 04:35:37.970846+00
75a83fb2-3afb-4a1e-8607-e3c9c3e2f94d	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 04:38:24.820376+00
fb0e6f85-e223-42bd-a24d-75a3bb8a25e9	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 05:12:52.067541+00
1f37232b-533a-43ce-8756-b9d6fd5acea6	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 05:55:41.492163+00
e5e5946c-cb02-4598-b34e-b975dfdbc7ae	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 06:30:58.956341+00
f37fde1b-b26a-4719-ad09-3c380947a724	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 07:01:47.965249+00
dbfea493-d95e-4b70-9c34-3595992de803	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 07:47:45.895305+00
b453befa-c728-437f-92fe-95944058c1d0	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 07:47:51.195018+00
28ad5b25-f3de-4fcb-b877-d5060ebfc87c	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 08:57:17.276453+00
919f763c-38c7-4488-8b86-c8fe396a24f7	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-13 09:02:53.337597+00
8533c5c6-0f1b-4017-a8bc-e954f0221290	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 09:42:32.13613+00
6ee399d1-31e5-4f1e-9107-e50424957aba	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-13 12:36:31.097794+00
1ee671e8-bc10-418e-a614-988339a73212	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 13:44:21.952694+00
36c3c939-6069-45f5-b5c5-231d906da56e	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-13 13:50:48.980443+00
4cc84166-a2e6-419d-be3a-974864216fc9	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 13:53:25.134198+00
5c813033-9310-44e3-8ebf-d61d26d9a95a	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-13 13:54:19.854201+00
7c753bbf-e2c0-44b8-be20-6cc8098079fe	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 13:55:31.430777+00
58a7708a-95cf-4a4d-9ca3-6651a313d8e1	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 13:57:37.386223+00
63a15768-ed3c-4336-b0c5-b27fcf9d167d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 13:59:44.937517+00
9ea78aa6-19e1-4cf1-8457-8e7b32f0ce0f	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:04:45.460482+00
27e8c0bc-a605-429c-8df9-cf1d84ffdec5	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:12:42.915625+00
12c6e39b-2983-4d5d-8d18-763b51096796	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:21:04.551791+00
7efb6fef-191d-40d7-b225-19305f8f44b0	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:23:34.628919+00
7eccff78-e83a-4024-9a9a-3296393b4f90	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-13 14:24:02.888705+00
5ffe4ba3-68a9-4212-bbf3-2db5702847e6	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:26:04.066+00
ef1920ae-0f9d-4703-91c0-ca98b9f2be9b	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:28:12.970227+00
e773ab84-e0b9-44a0-9e32-ef1fefd25341	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-13 14:29:04.089172+00
808b8873-5de9-4d8c-8daa-e26591167e32	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:33:36.552897+00
573e2694-2159-438d-9608-4984389db668	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-13 14:45:14.647156+00
876a2ba3-33d7-40dd-ac82-a5ae39044983	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:47:48.715347+00
84d7b253-c70b-4e02-bc08-704092934510	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:51:04.538948+00
7f8eeb43-670c-4726-bf69-26010c8ae680	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 14:58:45.005481+00
f42bec16-92cb-44b1-a8d8-71bbd2ec694b	139a1f11-400e-4a21-9682-4936eaf7c43f	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 15:04:58.316966+00
5e294106-e7f2-4bd5-b8ea-bc8463ceeac5	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 15:29:53.317647+00
31f02462-abf9-40b4-a8cb-724436c738e7	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 15:38:58.167906+00
63410761-7ab2-410a-be55-20e05e6e0f94	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 15:42:39.340765+00
4257f522-8e7c-4953-995e-65d68d09a0d3	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 15:43:19.02461+00
acf36ef0-0d4a-4a38-a5c6-5923cb7fa1a5	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 15:48:18.960869+00
f3ba82d2-1dbf-45ee-8b77-cf94110eeea1	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-13 15:54:14.075067+00
1aee94ac-83ef-47c3-b277-e6bdbc14d990	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 15:56:39.362393+00
f81b226a-9394-4466-ace0-25ce6df8a740	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 16:00:15.436618+00
42265c37-6382-4c12-8965-ae5da3676ba6	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 16:04:53.979972+00
85c1c960-ab7f-4ffb-8ce7-3bf9db6d6eec	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 16:13:39.169992+00
8200d937-f49d-454d-9d74-7f1e297bdc2f	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 16:20:52.742444+00
036a9b93-f086-487a-8dda-ce58e417d571	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 16:51:04.491474+00
f624c7b1-eebe-4a56-b84b-60be068d479c	716e24e3-7f10-4df2-b64b-2cd6a05f937b	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 17:37:50.3342+00
02a03914-05bd-4978-9dfa-de8c5c124393	d14df823-5cfe-4698-a0d7-19b2a49ba058	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 17:40:19.512726+00
1bc26f52-4f9b-43a2-bee5-72cd7abbf396	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 18:25:37.154206+00
1471cf76-3b18-41ef-9625-55e37fa1d142	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-13 18:26:30.630097+00
8c6080b1-1344-46b3-aea5-8b279b211a90	d14df823-5cfe-4698-a0d7-19b2a49ba058	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 18:27:13.093355+00
b7756798-3284-48b8-8560-4e79d9aa701f	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 18:35:37.790003+00
592e64cf-1e93-4018-be4d-612ce1b58b85	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-13 18:58:54.526876+00
9cf9b514-19c9-4ff1-a8e0-6f4ff93651c8	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 20:46:35.184241+00
ed436bd1-3569-4958-a8a6-546c72726d40	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 20:46:35.184241+00
31f3cc0a-e608-4f7c-828f-4e75c7e16d3a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 21:38:31.205745+00
c64b6100-e30a-44ff-bfdd-1ed8bef64ae9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 21:39:18.182297+00
e4aecc61-4b53-4a19-b635-1941d9575a86	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-13 21:43:26.64543+00
f86fe824-e41c-4d68-8464-b8a9f0549b71	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-13 21:49:37.849286+00
ce598c46-31dc-4ea9-8944-66bcef6028f9	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-13 23:34:35.403026+00
6c017aa7-b309-49f2-b654-0b841605ab01	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-13 23:36:32.090947+00
bad3851d-4bbc-489f-8c2c-d3b1fa08572c	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 23:36:48.170181+00
566bea03-1af9-4511-9812-05e904d28776	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 23:39:20.180253+00
e4808847-d057-41ee-96a0-df619179a471	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 23:40:29.234134+00
e04a92f1-0e71-4f52-ae08-a8aa467e9484	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-13 23:43:41.918555+00
a5a4cf46-c25f-4dcf-8034-62054c4564ce	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-13 23:59:54.909251+00
bfe7147d-9844-40c4-b508-f5833a314f50	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 00:07:22.110268+00
f49dcabc-8bea-4ce1-8862-6c7c76c25f47	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 00:07:30.741105+00
2977fb23-f6b8-4e7f-bbca-6a8a993ec2f5	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 00:30:18.836519+00
6a093bad-c8d5-492c-955a-4a9a33d312f2	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 00:30:59.530147+00
b7d2e3d0-150a-4a50-b8d3-0d8938fab2ce	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 00:33:52.243055+00
10e7ce40-a123-4251-82a6-7c1d6e83a18b	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 00:38:02.089842+00
f15957b4-c7db-433a-9e3e-62bd5a3a79e6	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-24 11:49:03.343107+00
7e10d90c-6f88-48b2-9978-d36d9bf32497	139a1f11-400e-4a21-9682-4936eaf7c43f	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-14 00:42:11.390377+00
41b1fd4d-d26e-4985-8b2c-e3e0228387a2	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 02:27:19.021205+00
cd93c053-d965-4de5-8102-c491659a871f	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-14 02:29:08.981413+00
96aa22ba-dde4-43fb-b1ad-9245d9d96827	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 04:40:22.068389+00
9debb98f-82ba-4508-ae5c-4f58454fab34	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-14 04:42:03.153571+00
bbdafc56-32ac-4311-b04d-61e055e94f14	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 04:44:13.558982+00
d11fd06f-e4fa-4260-aac6-d860a76bdf26	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 04:46:19.428655+00
406a2225-4ff0-448e-a584-f394a08c81cc	38625adb-dcfb-4bac-b473-2e6ee37af72e	journal_completion	5	{}	2025-08-14 04:48:24.547929+00
a1d4e7f9-8d29-4cda-9807-56c847ec3352	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 04:48:29.891979+00
427a5d9e-0897-4f7d-9379-fee6124cd4ea	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-14 04:49:01.082131+00
de560e77-938b-4979-a23b-c60acbb76af5	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-14 06:04:17.381723+00
9bdc205b-e16e-492d-b018-d56e6237e97e	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-14 06:05:02.375366+00
23adfad2-b481-4bc5-8d5c-3da78bfef695	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-14 06:08:31.866675+00
a0100c17-bb20-41ed-aa66-2aa161085766	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 06:11:47.063861+00
106a41ce-2d94-45f6-9e63-abcffefe28bc	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-14 06:14:47.166315+00
52dbb258-5072-45f7-ab95-a40362cf1e27	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-14 06:19:27.895389+00
c15181e0-66ad-4c6c-bdc3-23c123e44620	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 06:26:27.558237+00
60d7fdae-e8ae-4e58-a575-3663e03f6429	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-14 06:36:53.081882+00
0332b57d-ef4f-4562-a6c7-7ede9a1c6c62	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 07:57:25.047436+00
89d1aa67-5b42-4d9b-a03b-4d2cec7f9f16	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 08:17:08.240921+00
e75a3573-3d56-4eed-8cb6-5c4cccfb02a8	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 08:19:16.314865+00
46fd4e55-cb0b-40e8-a9b5-480b42dfee2f	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 08:22:27.541859+00
01859c2f-5463-45d0-a9b3-2e41f87ff072	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 41, "verseTitle": "Verse 4 - Prosperity Stream (English)"}	2025-08-14 09:22:06.597727+00
01c77187-c020-432d-a6c1-5e20f3485569	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 10:21:25.05412+00
8687d146-c49d-46a4-be2c-52499284e1d2	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-08-14 11:18:54.09118+00
794083cd-d441-4c7c-85fd-25c57a978472	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 12:02:09.408849+00
2505a189-62e3-4cb3-85ce-d8e667d39d1e	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 12:07:00.113903+00
68ce3f85-8706-4b42-824d-febcc7cd7fe0	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-14 12:50:55.408486+00
f2b62880-924f-4605-ab86-a475cb9c8b07	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 12:54:35.360221+00
ea28fafb-c0cd-4f96-9028-33a6e48c630d	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 12:56:40.568364+00
92efbd8d-f39c-470b-913c-c094d0a0b25a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 13:27:15.107067+00
f4db9629-2a19-4294-a5e5-4a345fca2b2f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:31:21.8749+00
cd1b889f-e32c-4f1a-ba8a-21fef89fa57e	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:33:49.123905+00
c9283870-e590-4fd7-9a7c-a95656ef2c20	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:36:15.66731+00
0b27c8a6-94a4-43ba-b292-bd069501a912	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:40:58.273803+00
fe22ff5f-0793-4089-9915-e7d124d8a3cd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:43:29.808895+00
dc7fe1b0-20f6-42ec-ae37-53b75b6afe90	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:46:45.928927+00
897e5267-71cb-4271-8862-2e905bdc1494	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 13:54:20.544283+00
cb736ff2-f709-47e3-9c4a-eca374f68bbb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 13:57:46.598893+00
df0debb8-5841-4022-a759-95c51370b98f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-14 13:59:55.443775+00
910f9953-ca41-4a24-9641-db6e621518d3	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 14:38:07.258157+00
557c1aaf-671c-4ba8-a6ba-93b7475d1a1c	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 16:08:26.741645+00
4f2c3b93-a76c-4319-ad82-20a843519025	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 16:34:17.309724+00
3a3f003f-5315-4d42-82f4-71f6a9cc19cb	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 16:58:15.647227+00
194cb2f2-c440-4c73-b59c-90c432d2df31	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-14 16:59:07.09856+00
c0f02cf4-1f1d-4fd8-bc4d-35d885ff8609	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 17:05:39.630049+00
ea05db7a-3d8b-461d-8311-1b97f8f782d3	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 17:32:55.56108+00
86841ce7-e1b6-47a1-b13e-c5a4af19fdeb	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-14 17:36:10.200886+00
63ffaeee-b3f1-47d4-892b-69582e552766	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 22:48:34.015514+00
090e98b1-9086-430d-b6db-46308c722878	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 22:48:46.904061+00
94b9d509-6912-46b3-b1a7-68849dbe5f1e	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-14 22:51:56.477241+00
1aabeeb9-206b-4ab3-89ca-feea197d81cb	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 22:54:24.223385+00
16be3bf4-9b9c-4992-9d2c-681305d66b2f	08c375cf-3e32-486b-b211-4c28e6239093	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 23:19:24.473648+00
150a51e9-cc75-4afa-b10f-e4a1adb75725	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-14 23:25:55.378095+00
4721aa90-bc0b-4fad-81a1-e5ea4248db6a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-14 23:31:31.333675+00
2e3fd9e1-3b7a-4692-9dff-f4740e134f91	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-15 01:15:49.496781+00
6e1fbc83-9da0-468e-9d82-33fc72d22972	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-08-15 01:33:04.083917+00
846068d2-923f-4381-aa2f-2bef36a3ff89	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 01:55:44.075704+00
df7a964d-3e19-41a3-9bb8-c06dc605a91e	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 03:29:13.807898+00
3f775499-1eee-4eb0-a496-662753157c58	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-15 06:28:30.445071+00
433ad3ef-7512-4b1f-a37c-0bfdecfa041b	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 06:30:55.459244+00
41fa6aa8-12bd-4795-b2a6-dc5488e3b85f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 06:39:01.703063+00
cb6e7994-db70-44cd-ae07-e9ba9a3c4a76	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 06:41:31.426023+00
6b8010f5-1efc-4fc0-b7ca-e3157812ec00	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 07:09:12.764381+00
4b65dbff-e8c4-4b8f-99df-bb24ddb1d98d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 07:42:12.315393+00
512a893f-e64e-4c20-9776-68b905446f10	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 08:16:27.904401+00
d7764e7b-06ce-49ef-ab10-5b2efaedd828	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-15 08:20:00.359997+00
897e3db9-bbfd-43f5-bb7b-5339f787dbe6	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 08:23:00.538603+00
be52860f-ffb1-42ad-be95-487c454ab07f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 08:25:22.404273+00
d6b1c93e-533e-4f66-a4b7-5c616cb1213e	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 08:27:43.75857+00
81a25788-d3f7-476f-8d7b-4d0c7d2bd74c	a2e8495f-d2c1-4e04-9db5-faa976f59207	chat_message	1	{}	2025-08-15 08:33:43.771705+00
af81aedd-2e0f-4749-84ad-8aa1ec89078f	a2e8495f-d2c1-4e04-9db5-faa976f59207	chat_message	1	{}	2025-08-15 08:55:29.019284+00
d06cea97-198f-44c5-9b28-45ce3f1c75d6	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-15 11:23:55.996904+00
a88b658e-69b1-4904-a8e7-8d243d9173b8	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-15 11:36:45.654647+00
d258d90e-ada4-46c2-b865-b7fb52aeba1e	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-15 11:38:12.787707+00
bebbae26-61ed-49ad-8a32-b3f6adb81cd1	ef2002f9-7a58-4d14-8f10-4a0c804d89d9	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-15 13:48:29.486555+00
df895a2c-565a-43ea-aa3b-b844a7b0fcbe	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{}	2025-08-15 13:58:24.113907+00
14ec3616-d67a-4420-aeeb-18fd38d38558	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 14:02:03.580336+00
7a055ca3-e643-4449-8ad6-091727a9ad77	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 14:39:29.847603+00
25ab6e02-79c6-448e-9ffb-cc03616d1066	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 15:26:05.126679+00
df549f03-eb0d-4925-af0e-1ef6328bad03	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 15:40:21.943831+00
7a5ac4a4-40d8-409e-b17e-50fdd906753f	9305c52e-c5d4-4a7b-b3ea-4474ac531795	chat_message	1	{}	2025-08-15 15:41:04.200149+00
f419e137-b86e-427d-8f90-fd21ac5e9f43	9305c52e-c5d4-4a7b-b3ea-4474ac531795	journal_completion	5	{}	2025-08-15 15:44:07.257687+00
f60e3966-b63b-4bb9-82d8-158c6e570139	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 15:49:49.814706+00
a884b62e-c418-4c2a-be20-f372ddd561c1	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 15:56:34.506626+00
d5d16f00-67ba-45ed-b400-6e5c0339176e	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:03:12.895281+00
ac83243e-666a-4a4d-b816-982a1db37b35	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:06:19.233212+00
3cca1660-0996-4052-930f-13996e372a5a	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:15:22.050703+00
2dafa6cd-b096-45d1-ad5d-87e890b7fd6d	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:19:59.913548+00
f4e87ba9-396e-4022-aee9-4b10f60a530c	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:21:37.607596+00
901c7547-b2e4-40f4-b176-14bee2992db1	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-15 16:22:36.80829+00
49098030-3117-45e6-9858-f9e72c186802	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:23:06.011302+00
2e44d078-95ed-42fa-8b48-a075e5111c23	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-15 16:25:12.516689+00
28811b9c-db79-4ce5-a086-e1dc793112a6	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:34:51.062226+00
1a489b58-a0aa-4d6a-bef6-a2150ec6e3f4	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:37:19.490566+00
75b0ce41-17a1-42f1-aa79-3eddc78d4f84	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:41:12.915552+00
5314ee36-7aaf-4e17-a000-7fcc6c8cbb00	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:42:53.474893+00
d043a8e6-f129-4f9c-91db-ed74404971d4	b2803bb9-d737-4420-8eb0-4a6deed56216	journal_completion	5	{}	2025-08-15 16:43:25.49405+00
69a28693-452e-4eca-98f4-58aa83c46d1e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 16:57:08.952221+00
a44dea2d-c707-4a78-8daa-b8122821f90e	9305c52e-c5d4-4a7b-b3ea-4474ac531795	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 16:59:50.756042+00
9739fff8-80e2-4566-a5b4-6d8a50f87e10	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-15 17:14:29.987903+00
26b2d54c-f205-4e6a-9d3c-0c700e73231d	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 17:19:46.798461+00
1065f57b-0d26-4e64-8e71-c3141d4e54ef	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-15 17:44:52.678597+00
8c803135-e78c-4b4b-a3c2-2a878613e8e8	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 20:21:28.619822+00
155577d8-8d85-427a-9011-914823033a4d	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-15 20:24:06.452716+00
3ed0f93f-2b11-48f8-beef-218f41370f73	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:00:50.698397+00
4ea2363e-4503-4861-b535-4ed45d521e65	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:13:29.733834+00
c4a21aed-5c34-46fc-8f39-e0bad45b04a5	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-15 23:21:48.846334+00
a1c715bf-ae9c-400f-93f9-e633fc69aeba	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-15 23:23:38.31856+00
861abf16-4651-42ec-99ef-f1b98143d807	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:26:32.671079+00
6f3f1611-4176-4413-ab3c-fad4f275d5a7	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:29:11.79719+00
f7c8b58c-5c24-45f5-b312-7e85c79afdf4	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:31:35.109561+00
0e4380bf-220a-40d2-b56b-6d73a7ec8772	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:34:27.968402+00
9a71bee3-2dff-4bf0-8f05-b9001858a619	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:35:22.734925+00
ff129c6b-a37e-40fd-88cd-947d918e0872	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	5	{}	2025-08-15 23:36:23.47849+00
5f555460-40aa-4288-8b8e-55f71a523783	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:38:51.809371+00
bb4199fb-f053-4263-a528-fa29669d4e4f	a5324ccb-3584-43d3-9706-9ab2155f2bbf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:40:02.774046+00
ff9e2936-a3fc-4221-af78-308f7cdd69ab	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:46:41.197112+00
9f11b7b9-ae8e-4967-b64a-04720dc94b05	84955e07-c412-49d9-998c-a40c3340bf76	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-15 23:49:23.79685+00
931f8778-e818-4430-8c90-3495613c3f9f	84955e07-c412-49d9-998c-a40c3340bf76	journal_completion	5	{}	2025-08-15 23:50:17.048223+00
cba16aae-2afb-4bc9-9a6a-879b8bea44f5	9c9c8939-2137-4637-a5b7-f4c98c861376	chat_message	1	{}	2025-08-15 23:54:52.379024+00
56860b53-4938-4b11-b34b-eeaa94da0057	9c9c8939-2137-4637-a5b7-f4c98c861376	chat_message	1	{}	2025-08-15 23:55:40.601802+00
fe1fd2ea-703a-4bc4-b44c-ad51eb1ffd61	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 00:05:40.381754+00
4e300bd8-d3c2-4fdf-a428-8b25bf409648	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 00:08:29.634636+00
c892790a-93ae-440e-8ad9-5b79fef18793	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 00:11:08.689951+00
a0b8e4fc-a12c-470c-a813-2e9594841cb3	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 00:13:35.010502+00
ea5a00b4-cde9-40ea-a88c-054b0ef6b04b	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 00:17:59.234617+00
9e1878bf-0c14-4723-aff3-59b2065af822	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 01:02:52.5449+00
b561a763-5a7a-427f-9761-b4f12947d38c	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-16 01:05:25.6621+00
e331ab3e-aace-4312-9504-6da7c74d9163	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:07:32.151905+00
99438193-5844-4f0e-93fa-b2be15c29b48	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-16 01:09:14.463436+00
dcf5013d-c7ba-4364-979c-4bbb18db79f9	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-16 01:10:03.695529+00
4313bc0e-6403-4938-900a-26d223619f47	8fa357c9-4450-4e90-b3c9-6886f7159287	chat_message	1	{}	2025-08-16 01:15:15.559032+00
373649f8-bd95-418c-a3ea-15af8db650bd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:19:58.348862+00
4934305b-3ca0-419a-a118-e8f0a9733750	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:21:55.002075+00
2d9d5697-6de9-40e8-9615-07d71ec32b53	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:22:53.059419+00
a35e002d-7295-4f11-b494-8f48aaa63cae	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:25:16.881933+00
1fd45d6f-3224-476e-afd6-ebdc4e3087aa	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:27:12.995893+00
84173dfa-2754-43af-9e8b-9aa139a48812	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:31:06.940369+00
44e4863b-fd7b-4b18-8470-c9d29fd519cf	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:32:14.40856+00
932012e0-3d30-41ce-ac0c-1820f0adab74	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:32:45.456898+00
4ee7f8b7-3caf-404b-b223-033983519aff	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 01:34:44.73156+00
c0e5d27f-6dd4-472b-a11a-403f61b5b17c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:35:37.0387+00
f4e47319-c6ec-4a49-b7fa-f5e097ce8738	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-16 01:36:07.605654+00
aa163966-8fa6-4c25-8e41-90f8a88060e2	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-16 01:38:27.308891+00
1e6d0643-cae0-4838-b332-5ee85341f643	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-16 01:38:59.388858+00
1c18ae95-ee7e-4b21-ac8e-0f57306e3573	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:41:00.889746+00
1b46493d-cb61-426e-8580-8c8b615d23ee	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-16 01:45:04.983274+00
6ebc8ad1-9334-4ee8-a4f9-145e6af6da64	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-16 01:50:57.000986+00
38c576c4-69ef-4946-93fb-87ddc1c5720b	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 02:22:01.767233+00
c0450798-3b48-49af-8471-b76caf587570	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 02:24:05.209538+00
4b4d04c6-d36e-4fa3-a95c-f5c08ad118aa	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-16 02:25:36.335803+00
7f588465-de1f-4330-b69d-f06b4dec853e	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-16 02:38:40.509942+00
0b0470c4-700f-4cde-b9f7-02df1dcbd4f0	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-16 02:50:36.595585+00
662e34e3-d220-4d63-8f5c-09f86d48ffdf	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 02:53:14.53265+00
5d276fc9-944f-4f53-a1c1-f4fe322cccae	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 02:56:52.424503+00
5e24a4a6-e359-4bb6-b3f8-a5a9ddb9a4f6	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 03:27:31.838426+00
662093c6-d0e0-4f6c-8395-4b788743343d	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 03:30:35.533474+00
7b11460c-fd17-4901-8942-c71547bb0293	18d08fe3-6f60-4abc-a51e-75360e88d54c	journal_completion	5	{}	2025-08-16 03:41:47.376505+00
06871362-61d2-448b-acb3-06ef1b8517cd	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 04:12:22.05015+00
88c41014-be52-403a-8858-1a2e32dec877	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 04:15:05.615522+00
c894babb-06a1-4f41-a3db-a2d31940f9be	9a214089-fab2-4635-9939-affac7bc96f5	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 04:58:48.54026+00
6f08c47d-56f1-4d8a-9e6f-abb89d1d5518	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 41, "verseTitle": "Verse 4 - Prosperity Stream (English)"}	2025-08-16 05:03:40.316678+00
f56b53f6-cef4-458c-8838-da10ca217ae0	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 05:55:00.101101+00
58e5b965-b3fe-4f4f-a0f2-f91b55914e31	d14df823-5cfe-4698-a0d7-19b2a49ba058	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 06:07:30.765395+00
f8a0721e-a15e-4ed6-b54f-1c485ba1e7f6	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 06:29:58.380885+00
69e86a7b-77b0-46b3-af9f-8115acd16e9f	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 06:32:35.067967+00
6c6ab749-5b95-41c1-8ef9-94ad17ce8456	18d08fe3-6f60-4abc-a51e-75360e88d54c	chat_message	1	{}	2025-08-16 06:35:03.154726+00
fc75c2ce-acae-4040-947d-89d5c67a76f2	9a214089-fab2-4635-9939-affac7bc96f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 06:38:26.932714+00
7cedf2c2-ebf9-49f9-a6ce-3828038243f2	18d08fe3-6f60-4abc-a51e-75360e88d54c	chat_message	1	{}	2025-08-16 06:38:52.115152+00
70a5198e-3b5c-4cbc-82ee-e2bd3a1eac1a	18d08fe3-6f60-4abc-a51e-75360e88d54c	chat_message	1	{}	2025-08-16 06:40:08.39119+00
f992eb72-2a2a-4c5c-a84f-5f347471b6ab	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 07:11:58.173715+00
aedfc310-730a-4a79-b79b-5e63e132d30e	18d08fe3-6f60-4abc-a51e-75360e88d54c	chat_message	1	{}	2025-08-16 07:13:53.461484+00
0104ed1e-1b35-4af4-95f4-5bd966263b92	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	5	{}	2025-08-16 07:27:38.262164+00
820f7f5f-6193-474c-8e1a-f7dad948c638	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 07:30:26.182542+00
acbb6e30-51e5-41bf-bd38-86aa5c1cbb9a	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 41, "verseTitle": "Verse 4 - Prosperity Stream (English)"}	2025-08-16 07:43:29.139026+00
09d56321-6964-4775-8d0f-d1598f109654	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 08:00:53.378014+00
125103f5-f6bd-4dbb-a484-d03e0934c659	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-16 08:04:42.605855+00
dce91c09-b607-43b3-b9bf-430288955258	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 08:24:56.976571+00
18e5bdb9-7c04-47eb-8f83-f8624fb55aa4	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:29:18.708961+00
77238b98-fa42-475e-9ac7-ef978fd28ccd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:30:34.458357+00
a044185c-1af5-4f52-9c0d-81f8b7215588	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-16 08:35:34.713312+00
53e49083-90e6-484d-a1ac-a236d652f759	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:38:03.981509+00
4d4112de-8d18-4d54-b03a-f23744961ba5	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:40:43.294049+00
edb96411-1f51-4d49-b7cb-12443171a466	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:43:18.525472+00
8f35100c-289f-4b40-adec-ff5f56bf2c25	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:46:14.873422+00
b4de845c-85a0-40a6-917b-11a8e69d9bc7	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 08:48:54.835937+00
bc08fdf1-28fb-44e3-b43a-84858e45e2b8	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 11:05:07.032836+00
bead193e-10fe-46a9-a456-bc864c87f635	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 12:07:25.886213+00
dc4f87e2-f418-4939-9455-029275f3e710	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 13:01:12.147755+00
da082a9d-251a-4f70-8c52-0eb533461132	9a214089-fab2-4635-9939-affac7bc96f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 13:18:09.95738+00
4c3349e2-ebc9-48ff-b2ef-b9f48a3a1bb6	9a214089-fab2-4635-9939-affac7bc96f5	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 13:49:39.209655+00
f4ff145c-d828-46e6-9d95-a7f96cc27408	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-16 14:56:47.590348+00
4df6100b-268e-4cc6-a67c-02576d2164bb	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-16 16:02:23.024256+00
f04da852-bb28-4204-ba3c-e441180f112a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 16:04:46.423871+00
ddaae685-8e96-44e9-859a-03622dfddf7e	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 16:07:11.065705+00
5393d89a-fa76-4310-b5a5-b7987ce79cde	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 16:09:34.63882+00
27fe0035-5a59-449b-a657-6e56c57fe2cd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 16:53:00.827471+00
e0ab06c5-1108-4422-88d3-7bae32d1730c	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 17:02:05.318155+00
05ea9fa4-d464-4111-8521-007798faee9f	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 18:47:43.840896+00
f0c4bc8b-5525-4709-beeb-948260543ec2	b2803bb9-d737-4420-8eb0-4a6deed56216	journal_completion	5	{}	2025-08-16 18:49:24.907626+00
fae347f8-589e-42b4-be0e-d64c538d2683	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 19:04:34.815998+00
577947ae-6a3d-4a2e-8f62-62013cf8400e	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-16 19:05:17.71329+00
6ae7f60c-c1b4-4ee8-85d8-45a1d9e4c0f6	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 19:36:10.379194+00
eb12725b-a29c-45e0-8b3c-ca35d169bf2b	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-16 19:37:52.123627+00
65b16c6a-bb2a-4fbc-81b5-426577cba78d	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-16 23:42:18.67724+00
58afb339-deaa-48e1-bbea-6741e706b63a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 23:45:22.519435+00
f835a468-6758-41c3-8106-af93e06873d3	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 23:47:57.983294+00
27a84a2f-f159-4a13-b658-17b786c03236	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-16 23:50:27.665406+00
948cc7b5-5ba6-4090-a3a6-121b7e8f5db6	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 01:36:00.271743+00
202eb5b0-fe77-4b59-b4e8-0d736f452740	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 02:06:55.053845+00
55a90785-207c-4abb-82c0-6cfdd97e1d92	38625adb-dcfb-4bac-b473-2e6ee37af72e	journal_completion	5	{}	2025-08-17 05:43:55.012585+00
fba15b6f-1fa5-489d-9c2c-e2cbd50f192c	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-17 05:45:14.138512+00
82f8af27-55d6-4a82-89ec-f496b361245c	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 06:06:36.792794+00
8dc820fe-e744-4a04-b6d4-d40a92fe3377	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-17 06:07:22.395962+00
ed42eff5-c429-4280-9177-138cf0350f5c	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 06:33:33.138581+00
41d06e10-69e9-4322-bfdc-0739a4d2b95c	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	5	{}	2025-08-17 06:34:27.760334+00
6aec298e-8a37-4366-85ab-fad7cbdf57af	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 06:37:57.933104+00
54388d83-0246-43a4-8f2e-20d1083b2e88	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 07:04:57.319456+00
cfd67397-90f0-45b4-a5da-d95f0280c85c	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-06 14:24:03.769131+00
613f2640-e1b4-4623-b209-1edb44015555	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 13:41:36.579092+00
c2844a4c-a786-449e-8901-f2154d080fa6	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 14:12:13.013591+00
23acf517-1ccb-4c29-bbce-ba305e0a71bc	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-17 14:18:29.715134+00
471e00c6-c800-4b89-96cd-beb8f59a0a9b	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	5	{}	2025-08-17 14:25:34.728936+00
90dc4ff0-dc59-4f42-91ab-138b3299a36a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-08-17 14:30:05.249498+00
540251ff-5c9a-47e0-9193-399462ef01a7	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 17:51:21.794482+00
bf359f37-537c-454e-a76d-43c0761db93f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 18:43:33.699038+00
4678de1a-04d2-4fa6-b1f0-7bda646eadf2	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-17 18:45:13.428063+00
2ac6621e-777e-4dce-a741-1c46e76c36a3	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 18:55:40.984998+00
62b83517-7532-47de-b829-99fb7e527503	b2803bb9-d737-4420-8eb0-4a6deed56216	journal_completion	5	{}	2025-08-17 18:56:22.001782+00
302695c1-5287-4774-ac1e-05f5fd10893c	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 19:16:49.398131+00
1fc71e45-c2c1-40a4-937b-a07d7523cb93	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-17 19:27:33.08946+00
3c4c576c-db25-4d36-afd1-2c458ce22f94	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-17 20:16:31.766133+00
71973618-a6fc-4ce1-913e-900bcbb6d13e	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 20:18:41.225262+00
c6c37514-be07-4a81-9a1a-84025536c2b9	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 22:22:49.410882+00
b3bbc51b-5b00-4797-a5d9-2bd85b386cdd	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 22:25:11.238046+00
3a66d94c-8a45-4e49-aa98-d73769441b41	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	journal_completion	5	{}	2025-08-17 22:29:57.898467+00
f9672d09-80d9-4b6b-93ab-dffa9977cb47	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	5	{}	2025-08-17 22:30:17.33464+00
b8e720f7-6cee-45a6-9241-7c65f39c6f00	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 23:02:28.143981+00
02adb774-e6d5-4aed-a837-da8d636deb2b	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-17 23:09:16.231527+00
619ef340-a0f1-487b-81d1-3746c0280908	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-17 23:39:56.202169+00
ed7770da-f624-47d1-a1e5-607ab5dec3c8	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 02:11:41.964229+00
8516ae65-8552-47c0-bc86-fea38b6a1a7c	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-18 02:13:01.882208+00
f42f2a5b-8841-4ec7-8ad1-ab8300a9fd00	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	5	{}	2025-08-18 04:32:11.941996+00
0eec9f29-251b-4160-81c1-55d8049d7d55	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 04:35:00.980663+00
1210f787-8e2a-4217-96d0-9a695b831742	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 06:18:45.05702+00
46c9bbeb-8459-4ceb-bfc6-03d6a5b8c17f	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	5	{}	2025-08-18 06:20:07.366166+00
70255bab-a996-4d5e-8249-0b935b806f96	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-18 06:50:27.334012+00
49a44b9c-1cc6-4512-8c84-ae7979f28562	fa12011b-2a8f-41de-9bce-f9b6904d7da1	chat_message	1	{}	2025-08-18 06:55:52.473831+00
07fe8924-3d1e-42fd-9650-cd22d906bc22	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-18 08:03:48.835197+00
cc174d86-eed4-48ae-a66b-eed3079f1657	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-18 14:47:18.074619+00
0e5d7fbd-d03b-4068-8302-6f1b33f6e831	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 17:15:49.255535+00
b5fbae3d-9fbc-415d-b6b4-7699002b4c7d	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-18 17:16:43.683726+00
799a34a8-46e2-46d8-94b2-5c7a18e33819	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-18 17:48:17.366109+00
c91c95bf-1939-40da-b20c-41bdaebaab65	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 20:34:54.744853+00
16ffae4b-3cc5-46f1-b0e1-490bf187dff5	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 20:37:27.10217+00
6fbf8971-9aff-49a1-af2c-3baec11268b2	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-18 21:36:38.223902+00
23d19232-edc4-458c-8154-601a47515133	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 21:54:30.434902+00
b80dac25-aa41-4c87-9f53-abf9e5b4a7a6	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-18 21:59:48.114669+00
aea25eb0-7b54-4de9-b46e-006c31bf9306	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-18 22:05:26.658881+00
f7e35903-1dbf-41b9-ab23-201cc5f241b5	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-18 22:07:20.378253+00
78bd150a-e10d-4785-bb9d-696ab96b868d	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 22:09:40.664052+00
56c52fe7-4597-4911-b113-a17dddeb27a4	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-18 22:40:12.741973+00
3a0340f3-c110-4bc9-8802-d1e157a4e69c	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-18 22:44:15.551048+00
bb0e0d83-19a4-4e0c-a46f-9375ee2601ed	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 22:46:39.884112+00
03ce6878-28e3-4eb9-addd-987a4381f782	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-18 22:49:34.567193+00
78c41cdf-ba9a-4b82-9737-1905cc563e92	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-18 23:28:34.870108+00
0be8aa62-af00-4afc-a9ed-807e557fda8e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 01:54:48.491962+00
c05ed3e1-49ce-4060-bcc4-5cb4a60cc13b	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-19 01:55:24.616329+00
b04fe9de-bfc2-4311-bd1a-9cd16866bacb	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 03:07:22.747013+00
08f161b3-e0ef-4910-9bc2-7bf1fedca193	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 03:09:53.927406+00
dca16e9d-c728-459a-83b5-129e7112e375	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 04:04:19.236889+00
35512373-22b6-4143-8e7e-305a4801296a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 05:39:46.984636+00
bc9ad5d1-8122-4e2d-ab27-0370df9a6c7a	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 06:08:28.745781+00
fa2f79c4-7362-49fa-a2b3-a2e0769dccaa	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-06 21:47:58.500245+00
05abcda3-beab-4e7f-bae8-5e5eb3b2dd6a	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 06:13:38.451685+00
804c228a-fa6a-4872-9f01-cb3a7cf1646d	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 06:40:51.73923+00
be990c83-e9c1-4ace-a1ef-2d87d4b7f8d4	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	5	{}	2025-08-19 07:58:27.677702+00
94f348ed-dfe5-48f0-9df5-a59096c1c32d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 08:01:04.930604+00
fe408dd2-6de0-4306-b898-7ff48ccd45e9	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 08:31:14.043619+00
048d8a1c-cc32-4c50-a5a3-c81b84b9d6a9	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 10:22:32.981371+00
2bc75854-7ee5-4ac7-bbd8-aac8e2fa7cfa	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 11:33:05.570646+00
519678ee-7d43-4833-ae12-6045e7301969	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 13:45:00.338172+00
662a7f88-494b-409b-af48-ec923e1a4c65	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-19 14:42:31.469322+00
9082a49a-4bcd-4aff-a905-353490e61d70	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 14:46:11.740542+00
f16c5fb2-ce68-4b55-8b58-653aeeb34bab	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-19 15:01:30.301722+00
1c9d77b5-86ac-415f-85ad-7aa9afe3473f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 15:17:03.729881+00
bca51cd4-1f4c-44bb-b7c1-aeabe9cc25f6	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 15:19:46.7511+00
671adad7-c06c-4a6c-be7d-11f88c2fb4dd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 15:22:12.133706+00
7d25865f-d8b3-4ee4-8ec5-e86a6c77da8e	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 15:24:52.996513+00
d7287954-f71b-4ce3-8741-3172d2dc50d7	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 17:14:10.019041+00
e7022274-e695-4baa-bcfe-0b2fdc4029b8	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 17:48:53.327476+00
41cdf98c-c85f-4129-be4a-163d0f0e693c	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-19 17:54:52.214242+00
55030f6c-e930-4eb1-af58-4504212ecb7c	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 18:07:39.132568+00
8d08afae-30fc-4ce3-bc89-0efd190ecc40	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 18:25:55.604482+00
d4ae939e-8728-41db-acd9-6e302d073655	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-19 22:10:26.364068+00
7d5c87d4-82ac-4bbd-883d-bdc113378f75	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 22:12:37.175286+00
5626a45f-9198-4e8f-a81f-816699724bcf	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 22:15:24.441216+00
e428fe19-19c3-4c5d-9c56-8120891c7f1e	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-19 22:24:16.319145+00
c8c40ea1-5679-420a-a2c8-54a5fe9074da	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-19 22:24:34.29949+00
395fa71b-a803-4035-982f-2afc6b9a946e	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-19 22:58:36.677635+00
c91fdcec-1aef-491c-a7fa-d33ac87cab13	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-19 23:10:00.867978+00
42f81f74-d4cc-46bd-b7af-d22536c9ada9	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-19 23:32:32.258147+00
567ece84-5a8c-4e28-9f04-b5d6972659ee	271a608c-0b55-4e42-9d13-293ad20e914e	chat_message	1	{}	2025-08-19 23:36:33.15563+00
9c4966f0-0218-4e8e-aa4a-6fda5789d439	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 01:48:04.969233+00
469f1833-c20c-4c14-8424-b28b62b383db	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-20 01:50:18.91092+00
d2a609fe-f79d-460b-9bca-c6ca9bc33f07	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-20 02:49:43.230346+00
f48e914b-ef4a-4155-b33a-44f6b4a34844	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 02:52:06.472285+00
6f43a6b0-5d05-4962-8840-3998c591d9d9	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 02:54:50.493697+00
58e7303b-c51a-49ee-bb2e-cc949ef9c5de	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 02:56:59.154174+00
634bbcd6-3f16-4e54-83ca-15c6c2677b92	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 03:32:06.092573+00
69fa1edc-105a-4af8-80dd-ea29594b0113	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 03:45:52.688019+00
bbed1d33-aea0-4b28-bd3a-4130b088bfda	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	5	{}	2025-08-20 04:10:31.19858+00
ed27a79f-c4ad-4aa8-a7e8-ef5e4ebbe44b	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 05:15:28.342433+00
4e2aac3a-2eda-43d1-aa7d-fd98839fcddb	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 06:13:51.962903+00
74130c83-fa8f-45ca-ac69-15726edb0b27	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-20 16:46:54.458088+00
4396a864-a4c1-4858-9502-d0e60be78b2e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-20 16:51:00.272342+00
b98c7a06-766f-4086-91e7-5990c1d9f883	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 18:04:03.940238+00
4e20215e-d03d-44df-91e3-c746eb8cb0a0	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-20 18:35:50.80243+00
3d03c3f6-31bc-40c9-8bef-8911f8e813b4	a2e8495f-d2c1-4e04-9db5-faa976f59207	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-20 18:55:04.318238+00
c87d85fb-73fe-4544-b371-c26bbd21426f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 19:12:41.579108+00
c5e24489-215b-471f-aa22-ad83c7c1838a	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-20 19:14:39.684004+00
3cf3b7dc-b40b-41d3-a6e7-684e72768949	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 19:15:31.956359+00
93998393-8dc6-40e0-9bad-fbdd1f778171	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-20 19:47:17.770969+00
ac6b479f-41dd-42f6-8563-ffbe636c9143	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 22:52:40.773954+00
09851422-64da-4f6e-9405-5b0dc78c81eb	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	5	{}	2025-08-20 22:55:02.730015+00
f74daef2-b213-4b0c-9afd-c71a1bb6279d	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-20 23:26:03.358779+00
039e7881-0c62-44cd-8fb7-7eff6fe639d5	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-20 23:34:54.0435+00
fd505a6b-f95f-4bae-8bdd-fc1275634471	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-20 23:37:53.762689+00
3cd79378-b976-49b8-964a-ea4bc02cba2f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 02:15:25.009176+00
4b4fc832-beff-4ef0-962e-7c5ce75e7379	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-21 02:16:06.783785+00
f6c80019-9114-4fed-a5e2-13b7fda0d6a2	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-21 03:39:06.814319+00
b464888b-dd29-48f1-8d78-209cfd9f66ad	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 03:43:21.65459+00
9e548483-3625-488c-aa03-e25186341296	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 03:46:40.333249+00
daf97347-df8a-466e-bb95-db5e0795a6ed	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 03:49:10.850346+00
f3b7fb40-06e2-4179-86f8-3bd8f9116cc3	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 03:51:31.949192+00
30f1045d-2363-466e-b8a9-c47ff0883522	7f29c1dd-39cb-4290-b1ff-d8984002952a	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-21 04:59:52.378205+00
14a87e43-cdd6-4894-8a4f-23385613e6a8	7f29c1dd-39cb-4290-b1ff-d8984002952a	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 05:04:48.385576+00
c304aa5d-851c-4d13-a60c-1cad5f03c523	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 05:47:10.172859+00
e63dbcd0-bb75-4f0f-bf76-c489b106c514	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-21 06:19:33.350058+00
1a0be4d9-013a-4728-9897-74631115c5c0	bd1ecf18-a37e-462d-b6b3-f593a979ffe3	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-21 07:33:47.652699+00
c899de7f-3332-400c-a448-a460b9cd51c6	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 10:57:31.463688+00
cbc2c118-6047-49f7-834f-e28753ae33db	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 11:03:22.143996+00
6787e851-aa26-4d62-a306-628e25cef9c3	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 11:06:43.58365+00
56fb5aeb-8b9c-4426-a318-49d2b2da85ce	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 11:07:57.185232+00
490fbbdf-7cec-4f4c-a370-ac6694c05886	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 11:14:08.904724+00
5a0d8915-7240-4f44-a615-f0db4fdbd065	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 11:37:40.968637+00
315255d8-effa-4e73-a864-5910d57e3255	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-21 15:11:28.274692+00
f54cd433-8595-4759-8c19-621c89db975b	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-21 17:19:38.974727+00
0f9138fb-ddae-4ade-b670-eef934a22e47	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 18:08:52.838502+00
8320cdce-8e3f-45de-84e7-12d12f21e6ca	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-21 18:09:51.82051+00
0982e23a-0d2b-4286-ad22-63a750b0b04f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-21 18:41:16.773133+00
f5329d5d-fe97-47c5-a69f-4e55cbc5a57d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-21 21:31:26.743917+00
b099c0b2-1ca2-4476-9eb9-66d59bffa40b	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-21 21:39:12.786131+00
1de2a2c1-ba2f-4b1d-a464-787f973d122a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 21:43:00.255596+00
9871fe6c-3fbe-4f1e-92a4-3bd22500fc25	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 21:45:23.769609+00
99f61537-8b6c-4b66-9119-f5380c9bc332	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 21:50:56.40724+00
d56e45e2-c793-49b1-b60a-de829028099e	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-21 23:14:56.91647+00
c62eee45-eea3-45fd-867b-67b8eb3627ba	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-21 23:19:31.214616+00
5b868d1f-5688-4d6e-9869-3dc0b1096842	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 00:08:26.627024+00
09dfa520-a343-4c47-adad-b756fbd5c6ae	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	5	{}	2025-08-22 00:11:34.708016+00
5af51bf4-f5ce-45be-aa19-46727d502f41	38625adb-dcfb-4bac-b473-2e6ee37af72e	journal_completion	5	{}	2025-08-22 01:09:35.009713+00
25b2dee5-6f1d-4761-bec6-f114ceec11be	7f29c1dd-39cb-4290-b1ff-d8984002952a	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 02:04:38.613303+00
67862578-ec3e-4a5d-8653-9b8f18961882	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-22 02:20:10.351753+00
6d4475d2-f826-4a37-a394-df9209a56aa3	a4d0becf-27fe-4a16-bd74-8aa39fb9578a	chat_message	1	{}	2025-08-22 02:26:40.355046+00
0e43464c-eff2-47e5-9659-a8d5a0761229	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-22 02:29:37.124266+00
9209245e-2d1b-4f38-8b00-a43e5f71f088	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 02:31:53.352885+00
f82f0c54-a392-4b13-8602-26926f111c6b	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 02:34:27.699432+00
39330281-0015-4e07-8836-40a6b9f4bbb6	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-22 03:28:19.125645+00
da210d97-f2bc-4259-9cb1-66747b4c07d4	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-08-22 03:30:57.540421+00
c3f17c62-9958-420f-9a61-c4e17a7095a9	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 04:15:50.900716+00
1a40c8dc-721e-40a1-87cd-ea317cdb9dba	f6492019-02bb-4783-b172-53f7e71bdc5c	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 05:32:39.394244+00
b88be4ff-2b68-4900-89ff-0425be09bbb2	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 05:42:34.191769+00
2d20dc79-dec7-40b6-b087-612411d45f41	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-22 05:43:06.254961+00
4ad4979d-6617-4e3f-966b-78ededa6dbf2	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 06:13:37.86894+00
84f1d108-38af-4c1c-b1f7-1781c6f2a565	74a895f6-e11e-47a6-b4d3-a89092905776	chat_message	1	{}	2025-08-22 06:16:05.824592+00
ee58d704-71f8-4a10-9aa1-72ad49fa6006	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-22 06:25:09.891476+00
05c1183c-381d-4881-a3ef-5794cfaa39d3	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 06:27:17.084316+00
cd7f1ccc-8fdc-4e82-9270-08a00890b79b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 2, "verseTitle": "Verse 2 - Lucid Beach"}	2025-08-22 07:16:31.421395+00
5e714059-2cc0-40ad-8e6b-5638d0aba22f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-22 07:23:12.705057+00
6f78910b-a1ee-4537-9571-10ff5b35bc12	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-22 07:24:33.071881+00
3fa7dccd-5a67-4f7f-a7ca-c1a7fac57a70	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 07:27:27.169423+00
7c37fb37-0502-43f7-8646-83bb98d7bcbf	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 07:29:43.984928+00
3d78a83f-ec8c-4f5e-ac20-b0e675632c4f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-22 08:07:25.344415+00
ee19e0e8-2b8d-4f14-84f8-71f9e08da6cb	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-22 09:41:12.276964+00
1a20683f-200b-4561-895f-d74e28685ef3	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-22 11:03:30.508777+00
e7a7656b-f8e1-4346-a5e6-5ece0b06e4cd	bf17a1f6-2629-45d7-b836-9453c259b308	journal_completion	5	{}	2025-08-22 14:19:20.788017+00
2225e109-eab5-4b2d-a4df-92056419a58a	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-22 14:53:09.137284+00
dde2b224-b575-45c0-b7c3-7d13a420a98e	18d08fe3-6f60-4abc-a51e-75360e88d54c	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-22 15:05:53.913858+00
f69a35f5-26b7-4b1f-9215-e2cbf45d0821	1424b737-4447-4ced-835c-ad9d50ec255f	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 15:25:52.576182+00
59f248c3-dc4d-4c61-904d-96fe1fc46e76	b464e576-8fe3-43cc-bf22-d983edeebb5d	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 15:30:56.018346+00
5ecb34cd-7741-487d-94c5-54d015060ccb	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 17:43:55.002818+00
d879e81d-8bbb-48d4-ab79-e096755adef4	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	journal_completion	5	{}	2025-08-22 17:46:45.019773+00
095b2684-aef1-44f3-8d78-39066fd7f045	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 17:46:59.919223+00
34514d4b-5cda-4b77-9f35-07834caa3012	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-22 17:49:00.654526+00
f58730d3-33e5-4092-8810-0d64ba0df84c	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 17:51:26.87911+00
fa7d78f9-a220-4312-9b33-61ff01f17e7e	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 17:54:53.005656+00
8c1cd681-65bf-4692-9fed-a9997c0ca024	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 18:56:13.77412+00
7612feff-1f75-4c79-b4c6-bab50bb28573	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-22 18:57:14.772688+00
f3c98b33-74fd-4b4d-9db2-c5531bece407	1424b737-4447-4ced-835c-ad9d50ec255f	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 19:32:52.911015+00
644cf870-b1bd-477b-a241-1782d6a0248b	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 2, "verseTitle": "Verse 2 - Lucid Beach"}	2025-08-22 19:33:02.799334+00
852d795c-0228-461b-87ab-a0a6f1965976	1424b737-4447-4ced-835c-ad9d50ec255f	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 19:35:35.957322+00
b6b87636-0a5b-40ab-aa8c-221c87cd3ecb	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-22 20:07:31.740996+00
5e881b4e-e701-41ec-9eb1-90fdf0882b01	1424b737-4447-4ced-835c-ad9d50ec255f	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-22 20:09:24.301726+00
1a09a11e-7050-40b4-98e4-36901754e51b	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 22:45:03.093759+00
ab92447b-345b-47cf-a81a-55c7be26d1b7	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 23:01:21.450994+00
95939094-e1bf-49d6-8fbc-cfa89e32cbfb	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	5	{}	2025-08-22 23:02:14.848552+00
96b804be-d986-4644-99f4-99f1d2b18980	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	chat_message	1	{}	2025-08-22 23:07:05.753239+00
553a02a5-cb29-4c32-ac58-8d934358f7fa	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-22 23:16:04.71082+00
da81781c-ab78-4197-b82e-5dd4a305e704	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 23:19:31.818251+00
20463864-3be5-4b22-8a2f-d517c5abc3c3	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-22 23:45:33.379607+00
eb359dcf-800b-41fb-a654-e668aaa9d91b	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	5	{}	2025-08-22 23:47:34.419443+00
2ed272e7-a0ae-4d76-bd3e-0cb971508835	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-23 00:08:01.945322+00
83d5df9e-fb07-4945-a529-d27d6c2ac12b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 41, "verseTitle": "Verse 4 - Prosperity Stream (English)"}	2025-08-23 01:00:16.631158+00
80ac0b6e-a324-4ba8-af4b-14b908e81c8e	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 01:02:52.805938+00
b7871d89-2583-4682-a539-7695be1fcf64	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 04:34:24.733331+00
88565561-e4c9-405c-b210-b67f939cb449	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-23 04:35:08.407102+00
ab9e5e12-7f33-4b97-8554-7064da4143c0	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 05:07:02.115025+00
ed3cb768-00db-4676-89f5-7165c0fdd8b2	267439bf-0c66-4a47-b1ba-26ab611eea78	chat_message	1	{}	2025-08-23 05:34:31.98811+00
3c65ff2b-21ca-42c0-b25a-e68e958e50b4	267439bf-0c66-4a47-b1ba-26ab611eea78	chat_message	1	{}	2025-08-23 05:34:40.164408+00
b1358971-ab02-43a6-b30e-6d88fdd66334	267439bf-0c66-4a47-b1ba-26ab611eea78	chat_message	1	{}	2025-08-23 05:35:08.829674+00
2c895e39-65b4-4486-a30c-804b82d0c102	267439bf-0c66-4a47-b1ba-26ab611eea78	journal_completion	5	{}	2025-08-23 05:37:56.547218+00
6a3bf42a-9407-4161-b07b-332a8d5c46e9	267439bf-0c66-4a47-b1ba-26ab611eea78	journal_completion	5	{}	2025-08-23 05:37:56.556744+00
45732be4-3bc3-44c3-a4a8-1aa0f0855c2e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-23 05:42:32.602576+00
22df1cd9-ae78-4143-83e4-414e2e21e0ec	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-23 06:21:12.962776+00
ae05b6dd-289b-46a6-8c73-b9ee0fce3383	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-23 07:33:24.338853+00
258f1f28-90c1-4658-ae0d-b92ae749c620	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 07:35:34.010033+00
7baac06d-11a8-4512-a9c4-c957f6b62f53	6c75dcb7-c195-4940-a134-712ba6641ebf	chat_message	1	{}	2025-08-23 07:36:20.352554+00
8fd34482-17fc-4fba-bb8e-e81fcf78afb0	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-23 08:33:55.716858+00
85540cfe-3458-4b50-aed9-243a887210c2	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-23 08:36:54.460042+00
8d73e3a0-957d-4204-830d-2c2f768c3fbc	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 08:52:11.725731+00
af092684-149c-48aa-9bae-93f45d3c41ce	a695e42f-5b3e-4c5d-b462-97910d15fdfb	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 08:54:18.577705+00
73caf53b-133b-4226-9e76-fce619c3e40e	a695e42f-5b3e-4c5d-b462-97910d15fdfb	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 08:56:26.762191+00
1d4aa258-42b9-4d31-bd48-06c056aaa83d	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-23 09:54:51.008915+00
661ae704-69dc-4735-95e8-e7e76f39910a	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-23 10:17:59.527547+00
78080315-3697-4295-89d9-81e42ad0ccaa	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 10:35:11.956439+00
0745199b-3368-465a-a334-71aa5b1c8450	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 11:05:18.494889+00
998a4f09-88a6-426d-b571-fb79cf684bb9	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:08:02.137724+00
2cb6be4d-5ec1-482b-9156-c0052b8a98fc	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:10:21.956249+00
853c7630-0285-499c-bb8e-8e0087d4d01b	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:12:44.865377+00
2cba952a-5814-4498-bdec-09248672fc38	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:14:50.477668+00
7c4d70ec-aa9e-4c93-b725-16b0a59c5b4d	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:17:09.958978+00
6fef62a1-9e4f-41a5-a492-bfec6c7ef74a	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:19:17.282347+00
33a5d970-5ba1-4d13-a587-d6f7653d12b7	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:22:03.613438+00
5b85a080-bd0d-427d-b17d-70c46786722d	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 11:35:19.025723+00
633de856-95f6-4728-a13d-6a1df34618de	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 13:29:35.373937+00
1feca2fd-08b2-42de-bf2d-fbdfb81339e8	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 14:03:04.128537+00
7bd508b5-f4f0-4336-b95f-b9897db22fdb	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-23 15:01:41.291302+00
e710d756-ee0b-462d-ae18-d9e997901370	a695e42f-5b3e-4c5d-b462-97910d15fdfb	chat_message	1	{}	2025-08-23 15:23:27.93946+00
054812fd-beee-48cf-a7e9-8cb7699923a9	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 41, "verseTitle": "Verse 4 - Prosperity Stream (English)"}	2025-08-23 16:58:35.957438+00
786861ee-dbf8-4816-9d70-bf95fe9acf0f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 18:23:54.52986+00
74afe626-1595-4095-b124-cfeff3c3a944	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-23 18:24:46.945197+00
73a49802-6eed-44f2-9f94-793f669f6075	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-23 18:46:52.830203+00
d05f9a8d-cd5e-403b-b686-b0a2a4ec9693	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 19:13:16.202738+00
590b641e-c9c0-4696-a142-c480f25bdfb9	a695e42f-5b3e-4c5d-b462-97910d15fdfb	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-23 21:48:58.471264+00
ae0b56df-35eb-4981-ba8e-6e5c9d29b8a5	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-08-23 22:37:44.11441+00
55b4831d-fc58-451d-8dbc-ffa16219b11b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-23 22:42:57.902556+00
999dd474-070f-4da4-861d-946b98b9dbe9	1424b737-4447-4ced-835c-ad9d50ec255f	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-23 23:05:43.634091+00
24ab5abb-dd61-4bdd-a759-492822ea18b1	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-23 23:07:43.229657+00
741b35af-0f8d-46f8-b3d4-d26cf7e99f67	38625adb-dcfb-4bac-b473-2e6ee37af72e	chat_message	1	{}	2025-08-23 23:12:54.310384+00
65579f6d-59f2-4d9e-8d16-4d14e14e50a5	38625adb-dcfb-4bac-b473-2e6ee37af72e	journal_completion	5	{}	2025-08-23 23:14:35.683185+00
70db6401-dcc2-4aee-a1cf-87d56f8a82c8	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 23:20:52.225093+00
c79b0afd-4fbb-4497-93ab-da3ea297fb46	22c2ab08-6a42-44c3-b290-dedba2161dd0	chat_message	1	{}	2025-08-23 23:22:14.583198+00
4ef4fe1e-4fbd-4069-8cbc-907613a1548b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-23 23:22:40.719744+00
259ff93e-ae3f-493c-bd47-e02575b9add8	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-23 23:37:55.461939+00
998f78fa-4dbc-48ef-baf7-095267524986	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-23 23:45:02.247588+00
269e45c3-c8a9-4a5a-a97a-b9a27fa4eb3a	a695e42f-5b3e-4c5d-b462-97910d15fdfb	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 00:04:49.689181+00
ab60fd3e-5584-437a-b25e-82bc6df92a67	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-24 04:47:16.943504+00
7992359d-1428-4365-bf42-7c05248a2f67	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 04:54:30.366614+00
7952118b-2132-4e44-9252-6cadcedbaeea	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 05:01:01.894749+00
e9b17007-9f51-4b07-a43b-942bd40f17da	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 05:23:16.061978+00
646e628a-1e07-4152-8dda-9b2ac9ec943e	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 05:24:05.705086+00
6befe9bd-61be-4492-b755-2c4bd050f04d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 05:25:36.965628+00
f3cf93e2-bcc6-4cdc-a4c6-982d5fe9cb64	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 05:26:45.89836+00
93832041-347c-4e3d-b207-0687c649cc64	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 05:29:56.401856+00
c03b2f4b-437a-4afb-8cbb-76c419c48924	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-24 05:37:23.777136+00
3f895548-e4b3-4c20-b428-7057d0cc9bd7	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-24 05:44:28.262604+00
4dfb9c53-dcde-492b-b91e-dc33733d1bd8	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 05:49:28.634992+00
ca2ea6b7-61a0-42c3-8a59-516f73394b3e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 06:38:38.222721+00
9f2861e5-dd2c-498c-a286-1e2efc43f7da	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-24 06:44:13.209716+00
904d0533-2950-423b-b9e4-f93a0f8293bc	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 06:46:32.640897+00
2672375e-8422-488f-a448-b4d5f9777efd	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 06:55:41.879483+00
b2cc1d83-d094-4e2f-aab3-a9828444d172	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-24 06:56:34.023977+00
342b1668-2e83-4fc5-af73-c94d138dd7ec	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-24 06:58:44.443163+00
1784a46a-052d-4016-afd1-2f353f4a826d	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 07:01:00.447909+00
71f7c7b5-42c3-4f67-99f5-e68b3daf8fe4	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 07:38:09.021505+00
2fa27802-193e-4ebb-a328-d66a528f8da4	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-24 07:59:46.045601+00
3f781786-b391-42a1-b395-20c11e9fb50d	92210ba9-cad2-4439-90b2-f8b6723b4bb5	journal_completion	5	{}	2025-08-24 08:07:26.922774+00
f54e38cb-98f9-428d-b444-e3352fcfb1c0	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 2, "verseTitle": "Verse 2 - Lucid Beach"}	2025-08-24 08:43:46.565354+00
7dd84efc-9dc4-4894-b144-97ee6fb47729	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-24 09:02:09.633568+00
27bd4a7e-4204-4338-8502-66d03ab31b33	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 09:53:46.75617+00
684e7a90-d693-4450-adbb-2219c21f0966	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-24 11:56:29.747078+00
5ece6671-937d-425c-97b0-bda2645e2c91	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-24 12:34:49.305112+00
c317c554-6323-464f-9c6b-9738a760ce77	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 12:37:53.33077+00
0b1757f2-6c53-42f1-bbbb-9601c6354f9f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 12:38:34.713186+00
e4ee7e57-e0ea-4ea8-97ec-a098ff24481c	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 12:42:13.523774+00
ff099829-1d93-4f21-8317-0b35b0f2f9ef	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 13:07:43.276508+00
905a626a-714a-4269-a0ae-2e2f0ea9bb27	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-24 13:18:11.117602+00
6591856d-dd2e-4c59-92a2-df9f0e021b3f	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 14:05:38.044285+00
dc1a8ca7-1726-42d7-8958-d941050fc3b8	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-24 14:19:08.076694+00
d73409ce-f770-4c0c-bd45-c4a066f89f92	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 14:21:15.764653+00
82a51b6b-75fc-444c-92ee-f19b1d0ff229	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 14:22:02.872548+00
089e2796-8923-4250-9750-e227a66b01d7	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	5	{}	2025-08-24 14:22:33.123883+00
d3195908-cc78-4d40-b16a-d6415118fbfa	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 14:36:51.364097+00
0971de37-fd59-459f-bd13-9bba13920332	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 14:43:13.912307+00
e592b542-f5ba-4558-877a-6c9622ee6ca0	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-24 14:56:09.420956+00
50198cb3-7371-4853-9610-129b7f299322	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 14:58:28.704336+00
844c345d-a9f2-48c1-a539-4c9e97abfeeb	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 15:00:46.040869+00
d5e54353-0dcf-4342-b444-faba2d22460a	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 15:04:12.670629+00
ecef0820-76fa-4ed2-abeb-b1da69976629	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-24 15:09:53.257594+00
a52801d5-a737-4874-9e5b-2c71bdc40eb0	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 15:26:26.599838+00
b9264065-04aa-4ab7-8161-b4c1be55a3c2	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 15:29:24.271293+00
a23916b4-562c-417a-b5d4-eed8a7a2d105	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-24 15:38:27.979628+00
f2f520b2-a040-4630-bfdf-a9b3f5ac2ebc	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 15:41:26.442551+00
ffb8fafb-5f76-4ccf-86a4-e585ab573117	ace95bc7-7dfa-4840-ab5c-e344a0054aac	chat_message	1	{}	2025-08-24 16:01:18.138782+00
145418f0-f7ad-4550-acfa-aeeb679e84e4	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 16:04:28.218005+00
e4cf028a-2428-4ddf-a93f-67958cb96608	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-24 16:22:22.262959+00
b35c7682-ecd0-4097-8aff-f033f87ab5e5	608aecb8-f54d-4efd-9aed-19e921a89244	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 16:46:01.234537+00
a943d202-2895-4be9-a17d-3cabbcf7ade6	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 17:16:43.975252+00
53022b9d-a689-40f3-8515-febbd5cecda2	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 18:09:26.685452+00
7ddb8dde-5bd5-4c86-9712-77ac5da42172	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-24 18:10:45.642978+00
7fee64b3-7662-43f0-b8e8-35b355a81f11	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 18:33:10.599508+00
119662a3-1b03-4171-b14d-089d512fcf5e	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 18:57:10.275103+00
92bb22ec-f8f0-4536-a210-45127bad5f7b	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-24 18:57:55.628373+00
5b2da3d2-e728-443c-aa8e-7e29b8e0d3ef	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 19:20:20.485063+00
2087abcb-ab78-476b-a0de-a9ffd5366a03	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 20:39:37.251235+00
c802502b-296d-4a86-887c-79c722158266	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-24 20:41:16.558049+00
07886897-0a4e-47c7-8cae-bb8f30c9791e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-08-24 20:44:33.526058+00
28ea6917-2377-41c6-896f-55f4dccb76b8	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 22:43:55.469757+00
7fdafa28-0cec-4dee-8fdb-dda017cc9bbd	b2803bb9-d737-4420-8eb0-4a6deed56216	chat_message	1	{}	2025-08-24 22:47:00.549218+00
f04afd64-3b22-4465-bf78-092841821ad9	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 22:51:08.375865+00
13e72caf-77cb-4fd1-94fd-a0f639c90e09	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-24 23:08:16.711639+00
91cd7f8e-6d52-4cb5-bcc5-a792b44b724f	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-24 23:18:34.784336+00
a9975522-1d0b-4df2-9139-2eeb3d077fe8	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-24 23:39:35.950759+00
119073dc-702c-463f-bd28-1f238e0e6cdc	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 00:04:29.681831+00
ed6a1d14-6798-4112-8bca-068f20080184	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	5	{}	2025-08-25 00:09:26.81576+00
06597df9-28ea-46f9-87c0-d5b00bf1282b	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-25 01:39:24.52802+00
33a6e512-31e1-44e4-9f93-f8b08fd96ff5	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 01:41:38.868871+00
0d9eb00e-a6fe-484c-a14b-fab2018352b9	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-25 02:03:48.013798+00
3eb4326b-72fb-4766-8641-dfdffb1c06f3	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-25 02:05:50.414426+00
4a4af3a7-21a1-41ec-b005-ee0f1a46e96d	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-25 02:08:47.128415+00
c7dc534d-1866-4dcc-985d-cc784bebb363	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{}	2025-08-25 02:09:55.121704+00
89fa9e81-4957-4113-a988-96e9d7736812	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 02:12:41.634943+00
d320abf9-33c2-49ef-8805-ae3254cc66dd	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 02:15:12.354755+00
bbb0bf5d-e336-4f0f-ad4b-e0b62cdcea44	6c75dcb7-c195-4940-a134-712ba6641ebf	journal_completion	5	{}	2025-08-25 03:10:18.201675+00
8cbcfc5c-61eb-41f2-9100-1f4c254c2e86	6c75dcb7-c195-4940-a134-712ba6641ebf	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 03:12:24.54876+00
52aa2e15-0a5f-4932-a8e2-66d709cb1512	b2803bb9-d737-4420-8eb0-4a6deed56216	chat_message	1	{}	2025-08-25 04:57:29.73035+00
ce70113a-de3b-4c98-a1ab-4088503bf8f7	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 08:37:07.518002+00
e1db40b1-aa18-4bb2-8d2a-2423d3402d9c	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-25 08:38:42.305965+00
aacbda63-b8b4-4a54-8509-02b9f7feaf98	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-25 09:28:41.056494+00
146f584c-eab7-4362-b9fd-e45f924384e2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 09:31:14.624801+00
08eb46ac-05f4-4421-b8e4-8bc5e14ee0ed	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	5	{}	2025-08-25 10:09:57.883987+00
2d43e9c6-70fc-43e6-a18c-3d79229ee1bb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 12:35:16.179992+00
c388e265-908e-426f-91ea-b5b3c4408fdf	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	chat_message	1	{}	2025-08-25 13:07:45.186405+00
9a0a1508-cf25-46e8-95b9-5ee48141ef87	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-25 13:08:38.042929+00
7d9795e2-0f6f-4077-9d76-213261aec6a6	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 13:25:22.36661+00
08cb5ac3-655e-490d-ad45-59a1c61b3f05	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	chat_message	1	{}	2025-08-25 13:28:44.308709+00
88200838-7b94-4115-80df-44e99a96b488	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-25 14:30:58.175948+00
67b12634-d036-477c-8eb5-9efb26773a9c	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-25 14:42:31.604958+00
18cfa51b-cff8-4737-9535-a76178ff5389	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"verseId": 3, "verseTitle": "Verse 3 - Syukur Meditation"}	2025-08-25 15:47:35.156057+00
9a319900-8341-441c-8dfa-533f2f35f0c3	92210ba9-cad2-4439-90b2-f8b6723b4bb5	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 16:00:38.90021+00
936214fc-f040-4a1a-afe7-29a5051510d6	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 17:08:53.063671+00
c1e985af-bd9a-4302-84cb-1db30e132068	f6492019-02bb-4783-b172-53f7e71bdc5c	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-25 17:26:30.622078+00
26e3d39a-5ec5-4edc-b36c-c58a8e108000	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 17:32:48.502952+00
9c00c88a-ceeb-4a6c-b594-1759625f40b8	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-25 17:33:41.663072+00
2e3aba20-03ba-404a-bda3-3e02c3a84de5	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 19:01:19.326949+00
a1c096fb-588a-4c55-898a-a245b305dcb4	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	5	{}	2025-08-25 19:03:11.684748+00
42f0c516-3ef5-4530-ba67-1bee38e28f3f	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-25 20:45:29.823835+00
1d583941-a954-4059-a999-ca86a75e4e86	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 20:54:52.200319+00
fcb1cbe9-1c6f-49f2-bd07-edfb216edff3	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 22:07:45.820712+00
5191dadb-d0b6-49c0-bdf4-00f1f7597500	b2803bb9-d737-4420-8eb0-4a6deed56216	journal_completion	5	{}	2025-08-25 22:53:05.588991+00
02476f3a-9bc1-4d9f-91fc-40a1953bc80f	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{}	2025-08-25 23:01:37.002569+00
10af098c-7bff-445f-b8f2-802c4bfc4f21	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-25 23:04:30.832766+00
8d6426f1-0ce9-4cb6-acb5-27815a8b6b35	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 00:06:26.052548+00
cd724f7f-bc60-48f1-96bb-28a0be43d52b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-26 00:28:28.353832+00
ce6935dc-7444-4931-ba6e-224443132d1b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-26 01:19:15.551608+00
228c4afe-019c-4f15-965a-3a0436022782	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 02:40:12.765578+00
d7c25d2b-3d37-4b53-ba73-b90e38203da5	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-26 02:56:06.071264+00
c7263234-a916-4d67-9360-444a7051e3aa	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 03:05:41.610741+00
c2ea2f07-e908-43ed-a227-e47a5ad87a11	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-26 03:34:38.778877+00
8a0c58ce-c0b7-4dd0-8a86-0fc9acd9bfda	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{}	2025-08-26 03:35:15.725532+00
ef4accce-d2dc-446e-86f8-bd87d5f8996d	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 04:20:45.2249+00
9bf15914-a11d-45ac-9bc2-03bc47e0d386	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"verseId": 1, "verseTitle": "Verse 1 - The Space Hill"}	2025-08-26 06:10:47.795+00
185293a6-f1ab-4f3c-8193-25dd32ee8fb6	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{}	2025-08-26 07:07:04.203762+00
b2fba47f-fe86-4591-93f1-320e168e3622	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 09:37:14.324884+00
40126ab8-6022-43ed-8063-deac1b98ca72	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"journalId": 1, "journalTitle": "Guide to Inner Silence"}	2025-08-26 09:41:08.856431+00
5e083b83-3cf6-434e-acaa-3ee03271d500	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 10:09:10.041206+00
9a424c68-fa02-488b-8c79-3947505908de	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"verseId": 4, "verseTitle": "Verse 4 - Prosperity Stream"}	2025-08-26 11:33:42.119636+00
89496ad1-a8a8-45ca-ad81-6cfb67a4f730	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{}	2025-08-26 13:04:57.592675+00
767ca31d-e101-4f6f-8328-9def5e97e764	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"verseId": 5, "verseTitle": "Verse 5 - Vitality Vortex"}	2025-08-26 16:42:21.260253+00
3e94e92e-72df-408f-8f84-6f41e6209b61	d079c984-0ba6-442e-8ebe-73e064b8bf3e	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-26 17:37:38.21719+00
23162a7c-0128-45e5-967c-5eef89ee86a1	d079c984-0ba6-442e-8ebe-73e064b8bf3e	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-26 17:38:39.954692+00
335c2bd1-9d30-4bc2-9cbf-23164a1b3d54	d079c984-0ba6-442e-8ebe-73e064b8bf3e	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-26 17:41:16.535979+00
f204f881-b510-464c-b409-a43a52027892	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-26 19:12:15.603417+00
b371e135-c6df-4b69-a3d2-7c445ba93116	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-06 21:52:12.32573+00
ee4c62c6-34cc-4fec-ae70-564d004964f0	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-07 08:32:25.085926+00
706f15bb-ff51-4dc0-a65e-0ab9a8368a11	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-26 19:12:54.638912+00
93bcc54e-7096-4a72-b40a-1c12d7446302	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-26 20:04:00.32182+00
8649171c-dc66-4c35-9f69-164c87dcecf8	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-26 23:08:40.501663+00
1c2737bd-900d-4351-b8e4-13dedce5ecaf	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 04:09:04.63553+00
461f41ca-d87b-4216-9e69-81a5b750fa2c	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 04:09:37.475877+00
22ef876d-f195-4875-b1f7-e6a59d9f7e28	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 05:14:02.923138+00
f280ee70-e11d-4b34-b305-d847c9014e2b	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 05:17:13.335299+00
f6dad924-6ff5-4476-a9f4-70e5b0d05caf	d079c984-0ba6-442e-8ebe-73e064b8bf3e	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 05:47:45.811622+00
c1905d7f-1dbe-41c4-a5b0-b15b73c7cae1	d079c984-0ba6-442e-8ebe-73e064b8bf3e	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-27 05:50:20.926074+00
6f53d374-f46f-419c-9145-dd95d97dadf3	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 07:36:40.507984+00
fa8e326c-2b0c-4e17-be87-0f3eb926ef1c	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-27 08:04:03.942981+00
a6798c6b-ae03-4785-a646-f3ee4763b6e4	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"reason": "Completed Verse 1 - The Space Hill", "verseId": 1, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 1 - The Space Hill", "achievement_earned": false}	2025-08-27 08:58:45.544868+00
46ea00e9-256c-4316-90eb-269093714c1d	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-27 09:16:55.976601+00
d64afc76-14f7-4a5e-80f0-4f02ed27694f	ed675b6c-0cd8-4475-aecc-74b921c68b35	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 09:27:29.998078+00
ea891d78-c864-49d5-81a7-8e15b6038d88	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 4, "old_level": 4, "achievement_earned": false}	2025-08-27 09:57:10.171783+00
994814a5-b5a0-4508-bc16-83db6f33a2e2	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 4, "old_level": 4, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 10:23:37.743496+00
fac46eb2-16e1-440e-89ae-a3e884b83b9f	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 4, "old_level": 4, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 10:27:13.9272+00
a0d43806-8c44-4cf4-93c6-a672e07c1d48	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 10:41:24.129157+00
9e2ec4f5-b53a-49a1-a290-0c1c3eabf766	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 11:17:35.692889+00
d23f86ec-3d27-46b6-a22b-2437b8b2c695	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 11:45:29.781788+00
a03ba857-9a35-4de7-a2d7-814f1faaa3fa	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Verse 1 - The Space Hill", "verseId": 1, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 1 - The Space Hill", "achievement_earned": false}	2025-08-27 12:57:24.625369+00
455e766c-4328-45dd-be3f-a5b03a628f5d	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 13:11:04.869292+00
03301063-e1fb-47dc-9c93-2e00fe2aada3	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 13:11:25.664339+00
787d440a-c94f-43b0-8a70-d343caee0461	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-27 14:02:33.352577+00
e063a1a9-15dc-4701-b9e7-9d5124f5074d	ed289706-acf5-4af5-9301-2bfb0128f0f5	admin_bonus	500	{"reason": "Manual XP award", "level_up": true, "new_level": 3, "old_level": 2, "achievement_earned": true}	2025-08-27 14:50:56.444188+00
5ccfd3c3-e5fb-4beb-b920-d087685f19b8	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 14:51:35.687245+00
d286560f-363c-49c8-90f3-446cbbb950d2	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 16:05:51.033047+00
05230489-5c38-4f43-8fc4-df07e2318ccd	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Verse 2 - Lucid Beach", "verseId": 2, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 2 - Lucid Beach", "achievement_earned": false}	2025-08-27 16:42:00.009387+00
5e917a62-2a5c-4da8-b7f6-c8204e7c393d	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 16:46:48.231785+00
f78eb306-fc53-4ee8-ab6b-260b42791f8c	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-09-06 21:56:36.356392+00
b1003f03-18b1-415b-b50a-0ec8ba9d91ee	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 16:48:27.889972+00
e3eb6dbb-0422-4399-aaac-0e50e1e5f4df	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 16:48:53.142196+00
4787146f-54ad-48ca-9b9a-5935918507a6	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 16:49:48.289464+00
a1d503b8-9792-4029-9696-3ed98876d8f4	d079c984-0ba6-442e-8ebe-73e064b8bf3e	admin_bonus	200	{"reason": "Manual XP award", "level_up": true, "new_level": 2, "old_level": 1, "achievement_earned": false}	2025-08-27 16:54:35.854882+00
2db0adf7-1a38-4e3f-b445-2978f9372bd6	271a608c-0b55-4e42-9d13-293ad20e914e	audio_completion	10	{"reason": "Completed Verse 1 - The Space Hill", "verseId": 1, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 1 - The Space Hill", "achievement_earned": false}	2025-08-27 17:11:43.907302+00
542d6195-e4b5-4fad-83dc-767b93148e35	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 18:29:45.562784+00
d47c2e96-5c46-40f2-9499-c4d9f06d204f	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 18:30:26.180878+00
03413e39-a2b1-481a-8167-8bf2d2e76ddf	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-27 19:18:04.887366+00
7a4cfb69-1068-4116-8a3c-20c6551f3bac	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 21:53:10.480073+00
16000b95-f788-4fae-a8c7-9b750f3174cb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 21:55:11.420696+00
e349409a-1f8d-4d91-b90b-59cafa418504	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-27 22:28:53.879613+00
b354579a-aece-4ad9-94c4-056a5d70987f	b2803bb9-d737-4420-8eb0-4a6deed56216	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 22:53:20.071912+00
0d41082a-c216-4cb0-9088-112d317b7d39	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 23:00:18.352415+00
27afe1e3-f923-4ade-b526-fd13f03b7d5d	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:07:58.428477+00
d202c950-5020-4d3c-b668-e998777f0f98	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:22:31.948955+00
7e60c1c6-e105-43fd-a6f3-90977f1af043	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:22:53.650739+00
db8d7725-2172-4281-9ddf-df41a1ccb8c0	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:34:57.485237+00
080d1965-e8f1-494d-947e-441141e39b5b	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:35:06.970476+00
7ab1334b-c0f2-4157-b506-cf5bde81150c	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-27 23:36:02.372701+00
b6d9734e-3407-4150-84ab-2240cffff907	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-27 23:37:35.113351+00
959d7033-ff31-4661-bba5-f7b26ff53cf5	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 4, "old_level": 4, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-27 23:54:16.092876+00
04d243eb-bf23-425a-9845-605ec3a5fbaf	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-28 02:07:05.755578+00
235a0843-4c8b-4311-bfb5-7142e3c8ba9d	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-28 03:09:28.349605+00
4a83493e-5b1c-4f40-ae0c-fb64243d6a49	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 03:38:16.025452+00
d45ab936-d997-4683-9daa-91e40d96fac3	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 03:40:42.955353+00
a9d06bc7-f1a5-4c09-b173-14b68730b358	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 03:41:36.087969+00
78220450-7724-4b76-8032-a71f3526e812	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 04:07:38.986896+00
c629ce83-b341-4716-9746-677fe132ab1d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 04:21:06.193871+00
763f762f-0c3b-4f72-a750-af117149cb9a	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 04:23:49.722321+00
fbdae819-861d-402b-bfb5-d8d74e8c2598	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Verse 3 - Syukur Meditation", "verseId": 3, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 3 - Syukur Meditation", "achievement_earned": false}	2025-08-28 04:38:40.061319+00
dba8872e-b9e2-4621-aab9-e0ba55cc2397	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 04:39:36.745406+00
a07f17b2-7c98-48da-9092-7fa4ccab0df0	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 04:46:52.738706+00
43ebc7d8-2204-43a7-9a75-d79a72e20265	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 05:33:07.511996+00
016ca4fa-c0c4-4c15-a92b-1c67a478aec0	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 05:36:55.050137+00
3db70a5d-1514-4cf1-87f8-2e1f3402b9d5	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 05:37:56.213098+00
d65ff7a1-c93b-41e7-ae52-75732f0f394d	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 05:40:12.198271+00
24482b06-c977-460b-b249-7ecc74b44352	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 05:55:50.656435+00
fa4c4087-0f2e-4bdd-aed9-c880418c65c1	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 05:57:59.905318+00
bdb211b0-1c5d-4326-9a1c-d23d2df27796	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 06:00:10.661933+00
a9c95123-701c-46a3-8c3a-7c59ff81e01b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 06:02:18.289739+00
71637de0-ec88-46c1-9def-588ccb841aa3	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 06:04:47.326258+00
1192c7fa-ec1f-43b8-97bc-360e75dfdac8	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 06:05:58.6227+00
15a76ce3-dbfc-4238-86d6-d4cafbfd7182	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 06:06:36.596209+00
951cd2c1-9455-452b-9394-1cd4ef825cbb	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:27:22.775996+00
af10a9df-40d2-4c81-9bf7-effccb712bf0	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:33:13.911746+00
e4cb1ecb-0656-477d-8511-278db8a1695f	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:33:24.788864+00
0b9a3f29-b0fc-48ed-ae7e-09e93b3e0bd2	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:37:03.759716+00
eee4d1c9-2172-4a4f-9d2a-558977908e2e	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:37:12.909464+00
720e62e9-c46b-4fd0-923a-d5720a31fbdb	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-28 06:38:32.906128+00
b5ad7ab4-11f0-4302-a87f-49bf7404215f	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 06:41:10.291244+00
26da392b-07db-4737-8b75-e6cd07d35fd0	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 06:42:08.644328+00
887fc97c-aa30-4d2f-930a-18cb1ae5dc61	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 09:04:16.586574+00
999b82b4-594a-4b6c-99d2-5b416ee50af2	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 09:10:43.648841+00
86e5212a-061e-442f-b117-450853eaa7c4	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 09:33:16.417977+00
c5e98f36-a56c-4fd3-8107-5c5e174335d5	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 09:37:04.023291+00
f2ebf35f-6b24-4f7f-91fb-afba276a7a99	d079c984-0ba6-442e-8ebe-73e064b8bf3e	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 12:34:19.286657+00
9ee784c2-2447-43a6-b1d0-71f32022c20f	d079c984-0ba6-442e-8ebe-73e064b8bf3e	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 12:36:14.015309+00
2a2a8d62-f2f8-4331-878f-f99140169969	d079c984-0ba6-442e-8ebe-73e064b8bf3e	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 12:43:23.140159+00
7058e0eb-f47c-4cba-bc30-09064585b929	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 4, "old_level": 4, "achievement_earned": false}	2025-08-28 13:48:07.518193+00
8d0903b8-8682-433b-a72d-223097b231c6	2c89253b-a0cd-4217-acdc-f98d84d21dca	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 4, "old_level": 4, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 13:53:24.537059+00
f2b67864-e692-437f-830a-7746b60cd26a	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:55:55.98325+00
158124a0-2c73-42a8-8b6b-8779d8d40edd	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:57:07.936281+00
6b7f4e7e-a140-42a7-9804-53c011ffa265	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:58:48.456176+00
624ea860-5505-447f-9ea1-a76a21204698	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 14:00:07.051182+00
1e423a87-158a-4e45-91b9-2c6660618f76	1424b737-4447-4ced-835c-ad9d50ec255f	verse_completion	10	{}	2025-09-06 22:51:58.272719+00
6f3fff66-7718-4c51-9bfa-ac7c303e501c	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-07 08:33:06.050713+00
6d8e2760-d40d-42c6-9d78-a5cdfeb2cca1	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	verse_completion	1	{}	2025-09-07 13:27:50.999416+00
82b566a9-2241-44f4-ac38-962a388f0d0c	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	1	{}	2025-09-07 13:59:56.408755+00
79fa5bfe-15c0-4f7e-a9e1-c45776747689	a2e8495f-d2c1-4e04-9db5-faa976f59207	journal_completion	1	{}	2025-09-07 16:22:00.833235+00
3579022c-de6f-4771-bdce-e0694fedd5bf	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-07 18:37:14.616912+00
9fbc1c0b-89f6-409e-a77b-0d1465c16a68	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-08 03:24:15.360201+00
2a72ff74-2250-416c-bca0-6ed21f886b20	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-08 05:54:19.061782+00
db5c953f-5063-491b-9069-8b5d0ffe0ee9	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:59:17.485506+00
cb1715f3-2564-4cf8-8dd7-50fb4a68bc57	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 06:02:44.300095+00
b80ac596-68d9-4cc0-8585-76fc4170fc0b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	1	{}	2025-09-08 11:18:11.150204+00
258ae426-797c-4d00-befc-b68ada037006	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-08 13:17:41.986455+00
be899533-a623-48cf-a1cd-b7fc14c80703	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	verse_completion	1	{}	2025-09-08 13:51:55.502824+00
a32b1aa6-1b73-4006-8bed-98850657d3da	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	1	{}	2025-09-08 14:42:57.029111+00
381735a1-4b53-4427-8507-0bfb91967401	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	10	{}	2025-09-08 15:44:16.450136+00
1510cec6-cb0a-4eae-aa63-383cc51d658e	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-08 17:34:07.69697+00
d8016fee-4f02-42a3-a0e3-bb72061147b3	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-08 18:34:35.716097+00
23d94547-8cf4-4595-ace3-0e972cb90957	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-08 21:37:54.488125+00
226ff4e5-f8c7-440f-a7f5-c9dc5d1731e5	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-09 01:54:30.682242+00
1f659be4-ceb5-4d33-bf38-c350d300115b	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-09 03:58:36.080927+00
63a13fcb-a457-457d-b653-258ff59c2289	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	1	{}	2025-09-09 08:21:43.959817+00
4a0c27fc-9778-4e82-b84d-cbedf78b9b08	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	10	{}	2025-09-09 13:11:47.202951+00
f72a0ed7-834e-4000-9066-47ef13f1fe1f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-09 15:01:01.789998+00
45a8fb15-a1d8-41b7-b195-11de4c3f840e	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-09 19:21:50.029601+00
1a1e6f12-fbc8-416a-9cab-25b27e08e021	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-09 21:57:31.79618+00
5292bb67-a832-4c08-8184-079ff3374a77	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-10 02:37:30.387271+00
78f4f5f0-31c8-44fa-b0bc-2a65928de42d	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-10 06:07:17.585105+00
b605bb4a-e084-451d-ac75-4eead29007a8	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-10 07:20:07.711106+00
7ab19357-3c18-4998-94df-f9e0d4df1fef	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-10 11:59:58.451702+00
3f744ae7-40af-42eb-a94f-7725a6dbe3da	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	1	{}	2025-09-10 15:48:22.969928+00
aa5e3bc4-da7f-44c0-a950-f835273c5160	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-10 23:17:34.69685+00
d54a4bc1-3b5a-4ff2-a233-4d3c14bb5a28	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-10 23:49:59.693845+00
f8a8d29c-aa80-48b3-8ebe-9a8529761a4f	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-11 00:25:18.084107+00
67e68ca2-954e-4289-b213-7a8a4177f356	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-11 00:55:13.310336+00
6e576ae2-bf0f-4def-9474-c29fba0c08aa	7bc81c9a-9db5-4ac8-a0ac-5e7961db5b7d	verse_completion	1	{}	2025-09-11 03:08:55.192273+00
a7d0faf9-85c4-4d82-bbbc-d6692d2ab441	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-11 05:58:38.190763+00
e943c0f9-9d8b-4bd1-b720-c9d7450cfe4f	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-11 10:19:15.920748+00
739197d7-7ef5-41e1-85cb-c4de9d24c20c	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-11 12:54:40.672623+00
fdf73266-a52f-490f-b8fa-9b68ce339385	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-11 15:16:12.227914+00
b51cc845-5332-4678-8890-9acb5b5227d0	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-11 17:14:19.097949+00
30b4930e-e340-4cde-9953-d7b1c51e3fe8	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	1	{}	2025-09-11 23:00:59.971575+00
fca18c7e-ecc3-4028-b719-f1ec6134e393	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-12 01:58:23.215634+00
e14f0bf3-c274-4806-9a1e-c80d10040573	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-12 12:30:25.819113+00
b84d682f-4f6f-451a-af8d-6246b3695569	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-12 13:52:07.907758+00
bbf85cb7-1f71-400f-bae3-39b0480874cd	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-12 15:38:44.807726+00
74445172-81a7-441b-ba70-05e27562efb1	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-12 18:47:04.285818+00
ac046e78-678f-4811-847f-2320c5f81bc2	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-12 20:23:45.1724+00
31fefea2-941a-424b-98c4-7348f002e9ac	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-12 21:14:44.717555+00
85b465c9-248c-4387-811a-6fc56926573d	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	10	{}	2025-09-12 21:54:00.770163+00
f1e999d2-aeef-455c-b3b0-403006ab4d54	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-13 00:26:57.858402+00
9141d302-9365-4fa2-ae13-0fb172e58454	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-13 03:18:48.142019+00
254b2d0d-3825-4d8a-9dbc-2166d5d79c16	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-13 05:37:01.423226+00
b7d27c74-27b5-47ff-b501-961492d1976a	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-13 08:08:42.602087+00
60544da8-8389-48dd-8675-cd05b4c2fa50	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-13 11:23:35.045224+00
fcefed4e-e0c0-45b6-b63d-76ca7edc4810	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	1	{}	2025-09-13 13:04:00.202809+00
abc90409-b2b5-4e58-b40d-1b855fcbd8d0	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-13 14:52:18.260375+00
28200d94-f531-480c-8f30-76a363418616	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-13 19:31:00.536488+00
5d448675-f368-4a1c-b013-eebc24a7199b	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	verse_completion	10	{}	2025-09-13 21:19:28.031659+00
c3335ed7-d599-45a9-b5d0-4902e8100a0c	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	1	{}	2025-09-13 22:32:09.813066+00
552b2ab3-6d1f-4106-99ba-7a3c6115628b	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	10	{}	2025-09-13 23:19:45.786216+00
ac269a22-70de-482f-bc8f-dab51de299d4	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	1	{}	2025-09-14 03:07:06.376076+00
ccd4a919-abc7-430a-b6c7-e000fe63fef6	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-14 11:40:44.652904+00
dac66e9c-6534-4038-a975-fbdf33ae292a	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-14 12:34:49.059167+00
d1102dad-ad07-4cc2-8fdf-922f0a6aed50	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-14 13:23:52.036744+00
3f5bbf36-ccf1-4124-b716-796453c96a6a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-14 15:31:48.851261+00
1ded6533-ee0a-44c2-9ecd-6a030e417dd3	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-15 02:53:24.965269+00
cc2f026b-0991-482e-98b4-7c968c445ab3	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-15 03:30:39.493571+00
1258e965-e519-43ae-88d2-ebdbe54d7b85	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-15 07:52:14.8959+00
d6c9beb3-f0f0-4824-a244-638d945a64bb	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{}	2025-09-15 13:14:06.587383+00
06204131-5f1d-4867-91b4-6261b7f0e574	9c03719b-0e18-4851-b6ec-0abc3981df9a	chat_message	1	{}	2025-09-15 13:17:38.379537+00
bbe86b60-2fe7-4485-ab17-00550770428b	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	chat_message	1	{}	2025-09-15 13:19:12.576157+00
2e36e8f7-88f8-4532-b1e3-2886221bbb37	ab68113b-cba7-4243-9544-8d932abcb521	chat_message	1	{}	2025-09-15 13:32:32.914169+00
fddc9532-1944-4b61-8fdc-c90059b074b1	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-15 14:01:51.993256+00
09ca1f53-d87d-4489-8129-a0ae5663d862	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-09-15 15:22:42.239962+00
68c2290c-a85f-428a-8eb4-0489b61f8b46	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-15 15:40:04.868094+00
7dddb71a-397c-4551-aad6-1e3d83e7c46f	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	chat_message	1	{}	2025-09-15 16:18:18.557075+00
abaf0248-e6cc-485e-b26a-a07b1bd2e2b5	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-15 16:41:23.095904+00
5bec275d-802c-48d3-86e6-64a9c7656a3e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:58:53.72956+00
ff0316d3-f559-43bc-8b4a-facd7db399e2	1424b737-4447-4ced-835c-ad9d50ec255f	verse_completion	10	{}	2025-09-06 23:22:12.770178+00
366f516e-bad6-4bfe-8386-7637407a0587	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-07 08:55:24.143556+00
f7fb84da-207c-4e12-ac98-b5687514465b	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-07 13:32:27.599635+00
0665d9e5-bdc6-43d9-b97d-a139ecc8f33b	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-07 14:11:39.207329+00
9d6f8939-6245-4979-aa70-67dc69ad2685	a2e8495f-d2c1-4e04-9db5-faa976f59207	journal_completion	1	{}	2025-09-07 16:27:19.613493+00
fad10dce-cdd3-47f5-b94e-9de9e0ca18e2	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-07 21:28:33.78348+00
a0816254-7288-4867-8edc-536cdadd9443	55d3fa51-183a-4187-8962-5256b57c4357	journal_completion	1	{}	2025-09-08 03:40:54.663708+00
a461aef3-275f-4e95-b43b-a729a3410a08	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-08 05:55:17.510825+00
f2a2f434-2822-4123-ba24-ae59a8ebf87e	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:59:50.928205+00
26a60257-64cd-47a4-8473-bbdc484ddf36	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 06:03:51.039564+00
40625240-b57f-432c-aacb-08eed80e7083	ace95bc7-7dfa-4840-ab5c-e344a0054aac	verse_completion	1	{}	2025-09-08 11:42:31.541849+00
747b8068-fab1-4fdd-b6ca-af9cbe74e808	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-08 13:21:36.108179+00
338e2280-b689-4e29-90bb-ffc8852887dd	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	1	{}	2025-09-08 14:07:40.637455+00
80ca664e-9c4e-4a44-a974-e01f06adc65b	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	1	{}	2025-09-08 14:42:57.124843+00
ccdc71ef-97b3-4106-92a8-21f4a06c2cae	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	9	{}	2025-09-08 15:44:25.527872+00
1189eb00-64f6-40ca-8484-9c0225ff6ab5	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-08 17:34:07.715823+00
81c9f29e-3b9e-4cd1-a2f2-e54d3fd99644	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-08 19:08:08.869876+00
2d8ce63f-85fc-484a-a87e-53ab044c2596	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-08 21:38:38.628157+00
63400206-e31e-4af2-90b0-82d4fc15083f	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-09 01:58:06.459858+00
e785077b-e130-46fa-ba2d-36100c1bf4be	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-09 04:26:10.448457+00
13d5d1b0-1887-4037-9c45-afe0eec5bbde	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	9	{}	2025-09-09 09:11:18.287661+00
672909dd-1fd5-4360-9154-dbae18ba3487	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-09 13:21:06.081443+00
3e1e67dc-28a9-476b-86e7-5045bc79b7fd	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-09 15:07:35.974135+00
35411d8d-af20-407f-a322-82ec861e2dcd	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	1	{}	2025-09-09 20:54:54.393286+00
f4dd81d4-113d-4732-9f2b-cf8f6a1931d7	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-09 23:58:49.339224+00
6f533825-a93e-4e10-8ca5-a5a8d7005036	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-10 02:40:10.962445+00
be7a25cc-eb3d-4f1a-9c73-6d6ebd624d2b	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-10 06:12:10.381187+00
6061bc79-5e1f-4210-8cc5-2400f6b36c2f	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-10 11:20:01.368939+00
3eb5773c-8d82-4caa-9bc0-cdbb26fca79e	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-10 12:01:42.660837+00
864fbb99-c0b5-47f4-89ed-47b086d30288	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-10 18:22:12.82854+00
6e87cb26-27f4-47a0-87ab-cb5377e43f06	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-10 23:19:57.817862+00
1071032a-c7db-48ac-a2fd-4f2081e22fe0	f6560fca-177d-497f-9225-a597ed888589	verse_completion	5	{}	2025-09-10 23:51:52.432527+00
0403a067-05f1-4988-971e-65c51fd02855	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-11 00:26:54.176551+00
331abf2f-ed41-4b07-990f-7487a7898f07	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-11 01:01:04.784482+00
67b6e7b9-c943-4787-bb05-bde5e909966a	7bc81c9a-9db5-4ac8-a0ac-5e7961db5b7d	verse_completion	10	{}	2025-09-11 03:40:54.418587+00
c67951b4-78c2-48dc-9577-ead32974a605	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-11 07:07:10.603789+00
763aaf88-b4f7-4bb4-bea9-7c3a6ba16dc4	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-11 11:30:59.610386+00
a73e467e-7949-4216-90c6-9b34b9b62b25	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-11 13:36:22.344814+00
477a3437-7f74-4bfe-97e0-c22d571b6db3	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	1	{}	2025-09-11 16:40:51.295306+00
5c0a8edc-2d1b-4e1c-b38e-a7ff4bde7c3a	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-11 17:14:19.2161+00
310a2b4a-04d5-47c1-9530-1bd41dc64254	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-12 01:30:39.510341+00
fc187e78-7917-45f1-bcbc-a5e962afc468	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-09-12 02:01:15.292404+00
53350f08-a94b-47a3-ada0-a9168d310c47	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-12 13:18:47.755594+00
67764a1c-330a-40e5-bd2e-3c4bbce97f18	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-12 14:12:17.471365+00
9451969c-686f-400d-a6a7-760dbc0d9912	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	7	{}	2025-09-12 16:11:57.70846+00
4d167a56-fbe1-4d2d-8c6d-916fb96344b2	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-12 20:00:51.96632+00
120e4fee-7d16-4691-b1f6-6caa591f44ca	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-12 20:50:33.023613+00
40b2d341-a717-4626-93dc-49989ef41689	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-12 21:22:18.132937+00
ed729f0c-9d29-4cd3-87a0-80b3b48f8255	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-12 23:00:37.068992+00
3b4142c4-4e41-47f6-8e09-fc28a390de7c	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-13 00:33:11.485741+00
bd56dc18-4892-4ed7-a0e7-89a21d32946e	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-13 04:56:02.56674+00
776b8753-a655-4e84-820a-11293fe112d1	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-13 06:33:46.546002+00
f6bdc400-1967-473a-9d46-c843e4502325	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-13 08:23:02.374817+00
076ce178-afcf-44ff-bee2-b7b82bdc38ae	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-13 11:26:02.79815+00
3e04e07d-db2c-4901-aedf-486916f2991b	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	9	{}	2025-09-13 13:09:40.915886+00
a8ea5d5a-e70b-480b-a158-575f1602e663	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-13 15:07:59.583431+00
d7cf4876-7799-4bc4-9d29-4d09e7aa82f3	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-13 19:31:47.89324+00
c91c8c3a-bbba-4eaf-8e05-0eb05071ea93	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	verse_completion	10	{}	2025-09-13 21:49:50.216876+00
b971ccf6-b5ea-4126-b926-62bd95d3b00b	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	1	{}	2025-09-13 22:32:11.369998+00
ecacc5b4-914b-4cf4-a734-6df720560f43	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-13 23:22:08.591027+00
aee94d1c-00d9-4e10-9b48-3690f60e3229	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-14 07:31:35.92782+00
7588437b-d7fc-4c0f-970b-e37a67f426df	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-14 12:11:12.308139+00
ae1d18aa-24a9-4a51-be61-797863b2c768	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-14 13:06:42.010051+00
cde27879-25d9-4b89-b73f-90a8100111e6	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-14 13:27:22.448643+00
540edb46-d3a8-4332-a1ad-660aa8c56d9a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-14 16:40:00.886194+00
0bcabed0-51b4-4597-b3e2-1eb97611f1e3	55d3fa51-183a-4187-8962-5256b57c4357	journal_completion	1	{}	2025-09-15 02:54:50.766245+00
b6737ea6-8cbc-4b10-984b-a190d41a928a	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-15 04:01:46.723403+00
49f01db1-209a-4bc0-a0d3-f1828d481444	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-15 09:36:22.235407+00
2c6ff9b2-4a7c-447b-9628-878a3a7db63c	08c375cf-3e32-486b-b211-4c28e6239093	chat_message	1	{}	2025-09-15 13:16:08.104157+00
4dd5c424-11e4-49be-9242-0cb2a47f716e	1ad6df3c-856e-415a-913d-be9854827527	journal_completion	1	{}	2025-09-15 13:18:09.107924+00
d3decdb6-c701-4a85-aa6e-22e7748f1521	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	chat_message	1	{}	2025-09-15 13:24:06.038003+00
afd84e0a-4001-4621-94b0-f1f84e19d86a	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-15 13:38:09.77985+00
8253df81-2c46-424d-a59e-94c9e7cc759d	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-15 14:12:02.803275+00
412a1d25-aa86-4051-985f-a237f91295fd	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-09-15 15:25:11.514544+00
842e343d-d32c-42a8-a34d-d29c82917c3f	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	chat_message	1	{}	2025-09-15 16:17:57.90697+00
18e2b51c-09a7-438c-b15d-fe4af390c90f	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-15 16:38:00.878135+00
b1d45810-fc24-436b-9910-4a7cc4af803e	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	journal_completion	1	{}	2025-09-15 19:35:06.309949+00
573b821d-622b-4e62-a7d0-12ec88bdd9e9	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-15 19:39:51.426123+00
a7ffea36-8da4-4e0a-a9a8-800f7d6ec511	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-15 19:39:56.49885+00
e8bf7ee9-8089-4819-ba91-88aafd01c533	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:58:56.146701+00
406c310a-844e-4645-8159-1112c4733cca	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 13:59:57.154274+00
4ad45180-0d4e-4b14-8e9c-1aac7bc757c2	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 14:00:00.150283+00
f29d97bc-190c-468a-8350-718b4343dcd4	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 14:03:08.094337+00
a4d05a13-f23f-4a50-a9ca-60ad80a4e15b	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 4, "old_level": 4, "achievement_earned": false}	2025-08-28 14:18:46.609081+00
cf9f1074-2114-4e63-89df-53d6325a0407	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 4, "old_level": 4, "achievement_earned": false}	2025-08-28 14:23:43.188182+00
f3461482-da9c-4c3f-bbba-41e21dca8b97	2c89253b-a0cd-4217-acdc-f98d84d21dca	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 4, "old_level": 4, "achievement_earned": false}	2025-08-28 14:25:17.13141+00
bd0010f3-0073-4311-8859-0a18747f55ed	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 14:46:05.79287+00
8b1842f4-b9d3-43d0-8341-2714943575d9	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 14:50:01.254381+00
59792925-4007-4b9e-b8c5-eb22643870d7	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 14:52:09.416351+00
de61530a-65fc-40f4-9576-7b5df9895cc0	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 14:54:55.032556+00
bdf0dd57-e4ba-4f3d-999b-c7ba03e0c226	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-28 15:43:09.221405+00
55fbdc06-48a3-4a26-9f33-7fda7bf71912	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 16:10:14.593776+00
ed70c80e-382e-487e-bccc-11995d2a60d7	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 10, "old_level": 10, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:11:09.062196+00
30f14a2a-6554-44af-bf73-6d40ca84180a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 10, "old_level": 10, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:13:14.725218+00
225d725c-0f92-4b08-8826-398e51261c34	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 10, "old_level": 10, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:15:19.452415+00
93f15f81-235c-4759-ac0e-5005ea2e17ce	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:19:06.934624+00
a007e50c-cac7-426c-98f1-35514c82a57c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:21:11.944046+00
42044859-95a7-4d22-b302-8aaa5de44529	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:23:19.060957+00
8bc2337e-9b7f-4d3c-b194-71d789735e6c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 16:25:34.392172+00
68edcf83-3bc6-4b46-bb8c-bc43b8f9be91	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 17:43:01.986387+00
d9f3465d-8b39-464e-a4c2-8dd431f8d01f	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 18:31:55.675283+00
11080e34-6819-4127-80fd-3a26b3114187	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:32:27.379135+00
8d94f0aa-9ea8-4cdc-9b5f-437fd41e89d2	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 18:43:38.652841+00
71f3ba58-8b58-4bca-8e56-d3dc4cbece2f	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 18:46:04.460314+00
ff25bd19-83db-4c0e-9088-ff1c1fc466a0	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 18:48:13.082505+00
ac743af9-661a-4238-a944-6ea06fa4f8d8	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 18:51:27.724757+00
a066eef7-d49f-4a53-ae15-f5d2500ce3c5	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:04.214147+00
4adedaf4-7aed-4f13-bd25-4c9b547f2ca3	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:15.283532+00
1bd53f77-9e31-44fa-a489-f8dd005adc5a	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:18.771538+00
4b471dfb-41f5-43e1-a932-34922ddcfb5a	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:34.521224+00
2a7ce5aa-e947-44d2-9a5b-6d51fb945a25	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:46.85778+00
4c6bfdcd-5ad6-4003-98ee-9ef6b84c5f4a	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:53:57.452515+00
4bb11d4d-fcdf-441b-b9b3-db6a7e4c7b42	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 18:54:12.21762+00
bf5ac5c5-0442-4cdf-9fd6-b9761430a5f3	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-28 19:10:57.631031+00
1326fd69-a7a2-46da-8de4-583e92a4a4c1	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 19:17:15.894706+00
fc8330ef-1f31-41a0-9e03-705468251e50	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 19:17:18.666357+00
d5a83c68-3538-4312-b7e7-2f05abcb0d13	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 19:17:21.04602+00
c0e6023c-9032-4684-ab6f-fd045428eb06	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:28:07.293905+00
df33cf07-dd30-4a32-85d5-d57d9d131cfe	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:28:59.492778+00
8841e5e4-fc3b-44f3-ac94-b65c177796fb	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:29:03.638916+00
e14d78c5-b8cb-47de-bd31-c5b053a084d0	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:29:08.696252+00
41f6a99f-1df2-4a56-a05d-aad6c66f335f	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:33:57.207359+00
f7f8735d-9729-46f6-9f8f-f77a334df73d	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 19:34:01.267855+00
81dca17e-9c96-4f24-bf2a-5b696a47e1c3	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 19:35:01.511949+00
252f1152-8aac-4049-be0f-b966329f4aee	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 19:36:02.114723+00
a5a5db15-8057-4620-bc63-6184ab4f0e40	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 19:58:49.679338+00
44a7a720-4f3f-4884-bcc6-89b0b1a19ada	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:00:06.809195+00
f785b617-8abb-4168-affd-7361427f30ef	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:00:27.962421+00
983a3c04-37a0-4b90-b316-75d394902bb5	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:00:55.163972+00
4422ccc6-7ad0-4d8f-815e-b4aa7f3a39e8	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:01:17.327616+00
e07d0fe1-7114-44d6-bf94-acb69f74e4e7	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 20:06:52.448434+00
36f2d4df-775f-47d0-8dd1-5c3caae379b8	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:08:05.733745+00
2ec074b4-22a3-4d15-b0b2-c60e69e7f0db	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:45:29.604567+00
368b03cf-e183-4e42-a45e-c5603572031a	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:45:32.311616+00
d67df5f8-bee8-4735-b1df-fdf5fb05668c	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-28 20:45:34.763276+00
db331b9f-9b02-4e39-b818-887307b3bd81	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"reason": "Completed Verse 3 - Syukur Meditation", "verseId": 3, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 3 - Syukur Meditation", "achievement_earned": false}	2025-08-28 21:08:39.998434+00
fd6b730f-e6b5-4936-8fc5-3b8467d13de7	ed289706-acf5-4af5-9301-2bfb0128f0f5	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 21:21:42.531313+00
253fd607-3170-4a54-9dd7-4e958a1a9c30	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 21:30:58.095169+00
d998af36-fd0b-46f6-8bd3-6165851644fc	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-28 21:31:03.058626+00
b9875f6b-8c76-483c-8b4e-8f4d636f6aca	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 22:11:48.373326+00
9d87adf8-a974-468e-8601-087ad9fc33b0	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-28 22:15:06.424377+00
6c2c8fdd-3a3e-4ea8-a54b-45a85921ba75	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 23:17:37.004076+00
3b902950-4992-4e90-be78-682a2be2a7a7	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 23:17:39.598185+00
24693820-e9f8-4169-8b1a-0450e03722ef	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 23:20:07.329542+00
d45d02ba-eb52-44f1-ab0d-bce8499ccc11	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-28 23:20:07.905314+00
81f8dcfe-29ae-465a-a7e7-0372b85ee1c6	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-28 23:39:15.512429+00
f771f50c-96bd-4136-ad38-2f132147f41c	fa12011b-2a8f-41de-9bce-f9b6904d7da1	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-28 23:55:16.096688+00
856bcbfd-ec27-439b-8d62-d4244913fd86	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-28 23:58:33.400793+00
4969ca34-578c-42da-a7bc-4cb154dfaa99	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 1, "old_level": 1, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-29 00:00:48.767689+00
088da0b2-899f-458d-b71d-49b0bf61e0e1	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-29 00:03:06.581978+00
cf690416-4b35-49b6-83f2-e177e9ce37e2	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 2, "old_level": 2, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-29 01:01:13.905494+00
b60665b0-dcf1-474f-ab87-2db75d59a142	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": true, "new_level": 3, "old_level": 2, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": true}	2025-08-29 01:40:22.025411+00
726e8b06-8198-4b44-b00c-2d023c8cf414	f6560fca-177d-497f-9225-a597ed888589	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 01:45:35.278181+00
a726d303-843e-4256-980c-40e6f01f54b5	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-29 03:45:15.647008+00
73ffd12d-04a3-4077-a494-8ec13ec93308	f6560fca-177d-497f-9225-a597ed888589	audio_completion	10	{"reason": "Completed Verse 4 - Prosperity Stream", "verseId": 4, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 4 - Prosperity Stream", "achievement_earned": false}	2025-08-29 05:39:02.38546+00
8840a21f-a3c5-4815-8de2-a1aab2eb0611	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 10, "old_level": 10, "achievement_earned": false}	2025-08-29 06:19:09.304011+00
2b1dd268-0481-45e4-9930-e7fb0730c7dd	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 1, "old_level": 1, "achievement_earned": false}	2025-08-29 06:22:18.697553+00
24125c82-2d53-4bff-b5f7-696fb760e575	74a895f6-e11e-47a6-b4d3-a89092905776	audio_completion	10	{"reason": "Completed Guide to Inner Silence", "level_up": false, "journalId": 1, "new_level": 3, "old_level": 3, "journalTitle": "Guide to Inner Silence", "achievement_earned": false}	2025-08-29 06:24:53.415318+00
a21a8654-a6be-40cd-8d5d-38a26bf957ea	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:25:54.003596+00
baa55805-8c51-4ef5-9bc5-96962c0113aa	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:46:38.644481+00
a7ecce15-6b29-4440-ac55-9bae17d8169e	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:46:53.512698+00
987d4ccc-6f42-4133-b64d-308e2f504f01	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:46:55.644087+00
55a9f951-5cd0-4fda-9876-eaa7677af29f	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:31.458416+00
0dc81a5a-8aff-46c2-b6fe-e50cfc899005	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:37.355344+00
0df6ecbe-bf90-45d4-9c42-6fcb3dd0a6d9	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:39.688083+00
64e522c9-7c56-4215-87c9-2edcbc3defff	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:41.78459+00
d365675c-8401-4da4-961c-b3016e43b01b	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:44.551203+00
f739ed9a-0c7c-48a2-9835-3749d12d983c	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 06:56:46.674642+00
d06383c9-5bc9-4cbc-bdb6-8a3c7eb818b5	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	audio_completion	10	{"reason": "Completed Verse 1 - The Space Hill", "verseId": 1, "level_up": false, "new_level": 2, "old_level": 2, "verseTitle": "Verse 1 - The Space Hill", "achievement_earned": false}	2025-08-29 07:24:51.031224+00
69a69990-3da8-4c42-9d03-070a6f7d4d7e	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 2, "old_level": 2, "achievement_earned": false}	2025-08-29 07:29:11.184959+00
15ff9080-bf1b-47b6-b057-82556642e06e	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:09.834019+00
16204ec2-c4f8-47b8-b3fa-d31595fefbf7	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-09-06 23:50:32.64085+00
146792b6-9b11-46b0-8de0-5e9834eca454	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:12.002264+00
49a289d7-5771-4eef-8d1e-7d33b52c5137	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:13.725485+00
6a2fee2b-0579-4a30-ae7d-f6e04ac543d3	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:39.538302+00
341dfba6-75cc-4936-9410-b05b720b5855	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:40.957167+00
f3aa0e7b-4b0e-451c-95ff-f601a1b56afe	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:45.379782+00
66ea882e-cd04-40ef-b926-6603f7d36bc8	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:47.076704+00
1b5bd003-9bd2-4da9-9463-64f55a17ed67	d14df823-5cfe-4698-a0d7-19b2a49ba058	verse_completion	10	{}	2025-09-07 01:49:25.449225+00
123c7e37-e218-4115-8ce8-0bf3ce79ca94	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-07 11:50:53.75511+00
eb9b6610-30c7-4026-8280-ee4e4b814455	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-07 13:37:55.775149+00
457fe8e7-7782-4081-bd06-d8f141196d1f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-07 15:15:48.244859+00
80841201-2fa0-4a18-8dba-37b774786eb4	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-07 16:35:01.508225+00
ca43d85a-eabc-42f5-afe2-ce6c38a7a00c	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-07 21:31:42.016382+00
0933eddb-5515-4a72-b6ec-09cc0b2da463	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-08 05:05:30.205636+00
8f10a07c-0ab1-4ca8-bbff-dd0ca8a9cf3d	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:58:21.787415+00
8ec44087-4d4a-4ded-bffa-0171c0dd0e7a	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:59:50.933483+00
9db90f4e-e508-4cbf-b013-1ff3143422b1	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-08 08:48:26.155296+00
024c5a78-5732-4db1-8269-5fb4c09f74f6	ace95bc7-7dfa-4840-ab5c-e344a0054aac	verse_completion	1	{}	2025-09-08 11:42:31.542587+00
23e7aa4b-3ec8-4100-bf66-a151a53836b6	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	10	{}	2025-09-08 13:37:37.703874+00
d87b7aaf-82cc-4bdf-beda-f44ec5c459f9	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	1	{}	2025-09-08 14:07:40.634445+00
1eba8275-d8af-42d5-8be1-37cea5035236	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-08 15:12:08.153949+00
c851bdde-fd8c-4a26-bf1d-001199827001	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-08 15:44:27.285413+00
7cc41699-8f67-46ac-b4fc-6e9840baf7cd	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-08 17:34:07.744371+00
c4e4f95a-c6e8-4565-b918-445184453031	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-08 21:17:28.027261+00
ecf3e00f-fe6b-4c04-bea6-20bf3214f405	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	chat_message	1	{}	2025-09-08 21:41:17.114019+00
9763f1f7-c8f8-4501-a733-e3d174841de7	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-09 02:56:40.044352+00
fe310b35-5406-4c46-afcd-96cbd338e253	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-09 04:26:51.773213+00
87a7ffef-7d1b-460a-ae58-17ee19abe293	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-09 11:48:26.801468+00
a5f8f1a1-9d92-42dc-ae81-faf953c8e77d	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-09 13:27:52.078338+00
a195a745-e526-44d8-81b3-19b7bfa814cb	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	1	{}	2025-09-09 15:12:25.190547+00
e6b7c02b-92f7-470c-9a9a-e06bdfba1b2f	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	10	{}	2025-09-09 21:26:17.052338+00
231b070c-3b22-42e0-b60e-11eb21c25afb	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	1	{}	2025-09-10 00:01:04.44319+00
ba7eefae-188c-44b0-893e-7f1052ab4edd	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-10 04:59:50.716489+00
76e18b9e-3459-4a3d-9220-87a6b5bd95d9	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-10 06:50:57.570311+00
98a3e7ba-e731-49e0-a343-4343e76c9970	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-10 11:26:55.112762+00
727211c1-6bde-4669-a272-8e0447e8bfe4	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-10 13:45:47.493086+00
1e210511-c9d0-4a6a-80b2-bd1926cabcf3	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-10 18:23:23.808355+00
d90c8d5f-f1f4-4fee-9329-6b00f8741fe3	038c077c-08e4-4d9f-adb3-053d0e9dde0b	verse_completion	1	{}	2025-09-10 23:32:06.750964+00
14554115-1e68-4d98-8450-1802b7251b94	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-10 23:52:16.604504+00
ee0503a2-ae66-4049-9fc2-b2443032b37e	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-11 00:28:38.445894+00
2ee3ac8e-be2a-46e7-b15e-f224a9fc176a	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-11 01:06:25.039333+00
f25e1568-7d95-46de-8053-192d6362b542	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	1	{}	2025-09-11 05:25:05.516658+00
4a4f7257-d33d-4057-bb10-03dc663631be	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-11 09:15:19.265266+00
a434fa7b-1eaa-4640-b671-1b8b787f3c76	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-11 12:27:12.477811+00
43d65c6a-2dd2-4b8b-a2a3-e32153274b72	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-11 13:55:36.858661+00
e6972687-a93a-4740-90e9-a682a16751f2	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-11 17:14:19.0924+00
de6ee8db-0b26-4908-9244-d9543f4c1046	1424b737-4447-4ced-835c-ad9d50ec255f	verse_completion	10	{}	2025-09-11 22:19:53.437825+00
d8d13df2-88e3-4790-a81a-2e847b473130	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	1	{}	2025-09-12 01:34:05.243646+00
1ed426ae-dfb7-4b37-b3c9-dbb865689401	9c03719b-0e18-4851-b6ec-0abc3981df9a	chat_message	1	{}	2025-09-12 11:26:05.319612+00
de87105b-0621-44b0-a599-ae62827a8533	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-12 13:50:28.943119+00
937bef34-941e-4eba-8478-f26587dffcfc	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-12 15:36:04.649465+00
7053160a-041f-45f6-af27-b4b8e4e01dfa	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-12 17:11:10.711755+00
dc84468c-b0e1-4b1d-868c-c1f2d48d0763	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-12 20:01:35.784327+00
e42fcfe0-7cc6-4ba7-8e3f-3bcc97765cea	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-12 20:51:35.824805+00
6ff60515-12b0-4555-a9c2-c91d8d6e1fb3	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	1	{}	2025-09-12 21:48:13.547695+00
89c8e43b-59fe-4efe-b99a-1323acab73ad	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-12 23:50:24.88966+00
def99e92-93e0-44c8-8dc4-0b840fccc00e	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-13 02:56:45.58748+00
bedb91d7-8519-402c-ac49-7e14b6b0dbc5	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-13 05:20:31.399833+00
389ae65f-dcc6-4a48-a416-41d4b1f043ed	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-13 07:10:38.31053+00
6b81b8ea-67e9-4b56-9572-882abc985ba4	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-13 10:28:48.950885+00
b24b9ede-b6fa-472d-ae85-35a194175e39	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-13 11:48:24.908842+00
61d63971-b446-4feb-9d30-d2fb4055b7a6	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-13 14:36:04.278924+00
e740ca9e-0d17-408f-aac3-d9fcb4e8b4e2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-13 15:33:48.037735+00
4bfe9c2f-9e8e-4164-b8e8-e1b6e1a35ffa	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-13 19:53:46.163372+00
7b9a4654-b652-4fed-b2ac-e0aff62c200e	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	chat_message	1	{}	2025-09-13 22:31:10.275809+00
845fd7d6-70e9-4650-942e-414ee7bd72ad	b2803bb9-d737-4420-8eb0-4a6deed56216	verse_completion	1	{}	2025-09-13 23:14:18.03158+00
a12e5b15-b30e-4c5a-b7a7-5743a31ee389	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	1	{}	2025-09-13 23:26:01.318805+00
c3817084-943c-440a-ba2e-6ee3e6cd02da	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-14 11:38:53.750882+00
a2db4275-323e-43c9-9c7e-a3b1d4bf0ddb	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-14 12:27:30.270233+00
81c9be8a-f08c-4153-a591-299b87c8762c	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-14 13:17:26.551323+00
5a90dbe7-2abf-4cc9-b13d-a27f0806086c	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-14 13:38:06.267751+00
41a17714-7c3b-4d2b-9918-9b9aa80fa1f9	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-14 17:48:34.987226+00
292a50a6-c5b1-408f-8838-90c95264ef2a	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-15 03:28:10.385914+00
b8d4b9b3-14f1-484f-97aa-1c70b188d3f5	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-15 06:57:46.69337+00
ae4b7ac1-dbd1-4524-bba4-7742a134f348	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:15.852631+00
18cc8481-a5ad-490d-8ee8-51cf09c0641b	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:42.474414+00
bde7422b-b7ee-4ae8-83f1-7cbf619ce0a5	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:43.917974+00
a60170fc-7edd-4e0b-bd31-2e126604a134	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:35:49.005038+00
001a8978-dd70-42ce-84af-ab4c55a81165	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:40.877905+00
43424b29-7cdb-4bdc-b389-3fec3fa20f53	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:45.227777+00
8c2192f3-211d-4184-baba-c79f8cea3e35	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:46.803872+00
3ba6d6ca-6606-4386-a9a4-cc630d1554b1	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:51.698515+00
c8af333e-225e-4b6b-8c44-a43ba5c6ae34	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:53.244798+00
a10236f8-3859-4ae7-890c-18afa08eff2e	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:54.695269+00
58a48034-8fbd-426b-906b-5143a9c236a0	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:38:59.219726+00
9143655c-9e8a-40be-adb0-30993732cfa1	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:39:06.301543+00
61f3741f-9337-4f02-941c-816f9a19caf4	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:40:20.253645+00
31aa7ef1-3f98-4487-be88-3b9abcb30602	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:40:22.3268+00
a700abda-c3c4-4bd8-9c45-dc6636e54608	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:40:24.168963+00
23fae6a3-e09f-4f34-8261-0de84c38d687	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	5	{"reason": "Completed spiritual journal reflection", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 07:40:32.886848+00
2ab97b71-5348-4b55-98b6-9fcaf12c70d9	22c2ab08-6a42-44c3-b290-dedba2161dd0	audio_completion	10	{"reason": "Completed Verse 5 - Vitality Vortex", "verseId": 5, "level_up": false, "new_level": 3, "old_level": 3, "verseTitle": "Verse 5 - Vitality Vortex", "achievement_earned": false}	2025-08-29 08:11:20.874879+00
27f8e137-a651-4af7-bfdd-1d44d7181272	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{"reason": "Sent a chat message", "level_up": false, "new_level": 3, "old_level": 3, "achievement_earned": false}	2025-08-29 08:30:56.387005+00
cf9ffc79-f331-4afa-a14d-d5c960608ad9	6c665bce-5174-4d59-ad9a-077feccd68be	verse_completion	1	{}	2025-09-07 03:33:13.021914+00
a6101280-cc4c-4f61-92ea-3eaaa20d6ada	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-07 11:53:16.530058+00
9348beb7-6a9e-4976-b9c8-d8d37d6bdfba	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-07 13:40:31.632866+00
bcd38e33-1098-4e5b-99f6-13a7ac484873	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-07 15:29:23.101557+00
48ffe5b9-7f27-46bf-afec-b16621428b01	a2531f03-3428-410e-abbc-06ef9f4ffe43	verse_completion	10	{}	2025-09-07 17:37:08.237587+00
6bdab9f3-9f5f-4f02-8e27-5fcc4cffe8fe	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	verse_completion	10	{}	2025-09-08 02:14:08.995429+00
1df99998-c974-460c-9a62-177651af403f	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-08 05:27:38.704163+00
33c0f7e0-a111-42f7-8f11-722ae2c74732	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:58:21.793095+00
aacca864-ae3c-4181-afde-267573176995	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:59:50.95316+00
425f139d-e044-409d-9193-640e366d9242	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-08 10:11:41.994388+00
6c03421f-239f-4876-a5cd-b359ade35af9	c644f60a-2f41-41fa-8814-b698c5154474	test_direct	5	{"test": true}	2025-09-04 17:34:43.758782+00
b5cd1660-7fbc-48e5-90f0-66a68f70688e	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-08 12:35:40.803096+00
f9cc33bd-c577-4189-bf30-25c83f5266a5	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	verse_completion	1	{}	2025-09-08 13:51:50.60273+00
6dc41046-cbd2-4bb0-a493-3e2e2acb4e70	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	1	{}	2025-09-08 14:07:40.643917+00
b34550b4-58cd-4165-aedd-df6eb6a39041	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 15:29:27.804183+00
bc57333c-ace9-4e60-8c61-3d851e6f4de7	1424b737-4447-4ced-835c-ad9d50ec255f	verse_completion	1	{}	2025-09-08 16:05:47.137388+00
5a8a26ed-de55-4cd2-801d-f76c0b295823	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-08 18:03:12.554776+00
be02817a-afbc-4482-a7d4-4f21351688da	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-08 21:36:13.273879+00
110fed3d-70cd-4580-bd9c-195fb1a7e8e6	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	1	{}	2025-09-08 21:58:07.223771+00
33d78210-76e9-4a4e-a822-bd2978d5f844	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	verse_completion	1	{}	2025-09-09 03:08:18.922993+00
99213deb-c557-416a-a06e-040fb072a6d8	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-09 05:22:07.207155+00
27e80d5f-5aaa-4654-9153-501695de5cfb	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-09 12:20:27.217165+00
9ce0450f-2374-41a6-b7e7-5f3af3fea1a6	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	1	{}	2025-09-09 14:29:17.357325+00
afc82e4a-266b-4eb3-9640-8874ac91eade	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-09 18:57:29.259721+00
8a15a101-bd6d-4081-bdfb-11478c886e89	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-09 21:56:24.540918+00
7385049b-fa7e-4e03-8c30-232d1ced8fd4	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	chat_message	1	{}	2025-09-10 00:04:22.468495+00
3445ff30-7c60-43eb-b1b6-4c7be2517ee8	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-10 05:17:30.179813+00
bfdaa2c6-2a0d-489d-be7f-d9d98c66770b	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-10 06:58:00.607863+00
1cee7ddd-1ad9-4f82-a02e-d61952896dfd	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-10 11:56:28.202003+00
c7aa3bce-1df1-41bd-bdcc-b86f75e7ea09	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-10 14:07:56.672284+00
ea89cdf3-6c95-4657-8c14-2fb249fdce55	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-10 18:45:33.828925+00
6ccd8beb-f05e-44dd-a5f0-5391f892ba60	038c077c-08e4-4d9f-adb3-053d0e9dde0b	verse_completion	1	{}	2025-09-10 23:33:28.21375+00
ee72c45f-d442-4cff-a49b-fa7965eb3a09	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-11 00:15:12.258014+00
e9922c1a-c4fe-4724-b22e-54c9e775dd03	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-11 00:30:56.570193+00
42d068ea-8117-4c62-b003-a5f2c71cfa8f	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-11 01:10:15.291715+00
acc7d54b-f214-49ad-a8fb-21f6b0eef819	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-11 05:47:09.709004+00
194dbbe9-ebcd-4cda-8a0d-bf1277769891	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-11 09:46:43.60724+00
200b1a00-1d45-4c93-9909-e919a0aff9a3	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-07 05:37:00.327216+00
fe68298f-2813-43ad-bccb-d058b2d8b2d9	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-07 12:54:29.985675+00
898d6df0-be41-452c-92e2-833c2014d099	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	chat_message	1	{}	2025-09-07 13:55:22.79813+00
1d6f07b2-10dc-43ee-a43a-d4d6f197cb1b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-07 15:30:00.255599+00
da09e386-0210-4b15-932b-bea9bd01a18c	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-07 17:58:56.293089+00
1ff5dc5d-ce7c-401c-be1e-4cd3d9f0c66e	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-08 03:20:30.837964+00
74acddb4-fb4a-4cea-8792-b8dac2448089	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	1	{}	2025-09-04 18:04:29.694789+00
a62d85dd-f6db-4498-823c-1f1a36da15f6	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	1	{}	2025-09-04 18:04:46.874296+00
08310a52-025c-4ca1-8801-26b7d1abcf93	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	1	{}	2025-09-04 18:04:59.705414+00
792880ef-b7f0-4e6c-a184-be7c3a45dc8b	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-04 18:05:37.302194+00
fd1909ad-6a8f-473d-8ba3-ddccde45b1b0	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-04 18:05:49.79702+00
3a2b5860-9d69-4df0-813a-6cae7199cfd9	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	7	{}	2025-09-04 18:06:05.858914+00
15725c41-ff79-4e3a-a254-103c509c3304	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-04 18:30:43.886698+00
91e6f99b-b9f9-4485-a309-9e72c0cecf40	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-04 18:30:55.717464+00
80fe56bd-be99-4278-abd6-e166b85bfd17	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-04 18:30:56.463897+00
4cecc34c-8aaa-462c-a3ef-b02caa814975	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-04 21:33:54.315626+00
76b1acc5-e157-44b2-a3f3-0cc356cc39af	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-04 21:36:10.279014+00
e777859f-89c7-46a4-b2b9-8eb14c75b2f5	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	1	{}	2025-09-04 23:32:22.107902+00
313dc071-e2b8-479b-a522-f45e05676efc	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-04 23:55:49.794265+00
6034f197-86af-49d2-9e89-7cbe9d0fc258	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-04 23:58:48.67266+00
d9f2d352-f654-4cf6-8da2-b08fe0904c3e	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-05 00:20:51.817046+00
ac2d9e1d-17bb-4533-8b5b-eeeb254c50f5	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-05 02:24:13.728422+00
1a7537f6-ad9d-4c85-950c-bfee38631c0b	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-05 05:26:19.620341+00
3115f436-304c-4538-8759-08a02c71c877	55d3fa51-183a-4187-8962-5256b57c4357	journal_completion	1	{}	2025-09-05 05:29:17.2331+00
ea4c8cea-c125-4975-84d2-b1bd71ccb0e4	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-05 06:44:42.220142+00
4a900177-04b6-4d29-8c65-fbb557fa43a5	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-05 06:45:39.124372+00
8ae1a2a0-f1d3-43c8-8d14-fd469aba66bd	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-05 06:47:30.950815+00
671b9bc5-44e0-48ed-a0bc-4f1352186fbf	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-05 07:49:04.462131+00
d2a4124a-e8c8-4052-895b-000f61acdb04	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-05 10:24:35.978098+00
ff8896ed-3bb2-443e-bcba-b3b4cd442d99	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-05 13:36:13.818482+00
cf291603-dcdb-4aec-99a2-55aeab94cf74	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-05 16:18:42.474128+00
59ca49d4-90d4-436e-b6f8-7e0bfcc574ee	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-05 18:03:23.129851+00
c902f2c4-34d9-4d68-8c59-f702de792950	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-05 18:38:07.103116+00
96552af2-696f-4f5b-bf09-3e2506c28736	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-05 19:03:06.440992+00
9f9f2ec6-f10b-4c85-948e-1f5e80c8e81a	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-05 19:35:30.415638+00
8a0704b9-49ed-4b42-83e3-fe2c25a854f8	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-05 20:52:49.772478+00
66d852b0-8c7d-4e86-b6cd-2c2d0b948a1c	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-05 20:55:01.115319+00
10d359f2-627a-49c7-969f-f1b79a03c61d	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-05 21:18:48.800418+00
6465b689-5a13-440c-915d-29745721e6ca	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	1	{}	2025-09-05 21:29:54.745268+00
2d096ed3-93be-4793-9604-2680224c6018	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	journal_completion	1	{}	2025-09-05 21:31:49.245489+00
07e4a991-bb8e-4fe2-877b-8d08eee59fb9	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-05 21:42:02.769855+00
dcfb2613-00b7-440c-8c69-270dbbae9732	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-05 22:11:25.94775+00
8551dd15-ea4d-48b2-997b-ae919b322a67	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-05 23:16:41.500916+00
21dc05a3-b06e-4e91-8f97-54ae4a7f0904	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{}	2025-09-06 00:41:06.4392+00
ed4d2987-2f16-47e8-96fc-afc12593015d	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{}	2025-09-06 00:42:12.936109+00
b8cfa054-83ef-4fdd-b28b-8a4f7739091f	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-06 01:38:49.647429+00
86594b4f-c4dd-4352-9c96-aeb866e6570b	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-06 02:58:39.882603+00
b544078a-8b76-4cad-9996-59bbf1fd462e	55d3fa51-183a-4187-8962-5256b57c4357	journal_completion	1	{}	2025-09-06 03:30:39.549031+00
ea9e3cf0-e46a-4156-ae73-3777b58cb158	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	10	{}	2025-09-06 04:01:33.641107+00
b62e52eb-b0f6-4667-aef0-4e552576e158	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-06 04:04:34.624822+00
9a0919a5-1771-463e-a548-f177e412f23c	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-06 04:08:00.09065+00
ad147b0d-262e-43f0-9f9f-f929f0ae9004	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-06 04:12:30.043273+00
6bcbb0ea-b78d-4bbb-9182-37fb66389aa7	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-06 04:16:32.285436+00
21dc42df-b03c-412e-af2e-3e3985fd57ac	55d3fa51-183a-4187-8962-5256b57c4357	verse_completion	1	{}	2025-09-06 04:21:28.587712+00
e704f02b-79f6-4faa-ba9b-28a3f9e8a46e	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-06 06:40:01.165331+00
08e1a714-4686-4eb0-b21a-9edc32021c86	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-06 06:42:43.2345+00
bd6bc7cf-5384-4bb6-a322-03793ad8dd4e	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-06 07:13:55.017836+00
1c85e41a-8b07-4572-9588-33c8b4e4b541	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	journal_completion	1	{}	2025-09-06 09:21:02.149659+00
2f0dbb88-2600-4933-8c27-6d5d8e422a6a	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-06 09:39:40.539907+00
b7ee3c50-d144-4093-81bb-a07c46a757c1	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-06 09:40:32.917961+00
39d80951-9778-432d-b791-aafc6b5e072c	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-06 09:40:45.78022+00
086ffb98-709e-4e4a-a856-39f1dda1e212	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	7	{}	2025-09-06 09:40:56.841607+00
e77128b8-c306-4fda-8319-d0267070aa3d	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	1	{}	2025-09-06 10:08:11.801315+00
68c73a23-c2e6-44c8-88af-70f21af3b949	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-06 10:38:29.587929+00
8db6c56e-e37a-4cfe-966f-8523f3d775d2	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-08 05:28:36.168294+00
5e38f7a0-d8a8-4ac9-8ac5-befc9c08d75c	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 05:58:21.801784+00
0650dc3d-f47c-4ac2-a8ef-91c1eb885399	55d3fa51-183a-4187-8962-5256b57c4357	chat_message	1	{}	2025-09-08 06:02:44.139012+00
1cab0f8e-5793-4da7-aae3-840d9532b486	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-08 10:13:53.327677+00
64ada83b-b6e5-45f5-a7ec-e34ec348f3b9	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-08 13:06:46.561731+00
75b0755a-78c9-4407-bcf4-74a765bb62c1	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	verse_completion	1	{}	2025-09-08 13:51:50.703212+00
71808195-c9f1-4dd4-a7d8-c07d814013c1	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	1	{}	2025-09-08 14:12:22.298229+00
81e9f8e3-dc29-490e-993e-63e8ecf2bb5b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	10	{}	2025-09-08 15:42:52.765786+00
2c21fafc-669b-4f7e-ab51-115064e86503	1424b737-4447-4ced-835c-ad9d50ec255f	verse_completion	1	{}	2025-09-08 16:08:14.807202+00
e2787c98-4299-4115-9231-d5d881a074cb	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-08 18:33:50.776205+00
bbc341b4-5075-430d-8d86-20a179ad548d	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	1	{}	2025-09-08 21:36:29.1695+00
98448027-2d91-4137-8e1e-411662c7ccee	271a608c-0b55-4e42-9d13-293ad20e914e	journal_completion	1	{}	2025-09-09 00:17:21.513728+00
d4e8c9d4-c4af-419e-a7e6-655066037134	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-09 03:57:17.371124+00
cd0fff3f-93c7-4494-92fc-da3d3024f48c	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-09 06:32:41.944246+00
c7feafc5-9100-4189-bb70-34bceae52cad	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-09 12:39:55.040721+00
45812891-ab1c-4563-b1e9-eb3f8a4d94f8	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	1	{}	2025-09-09 14:36:38.459241+00
3e423077-9a4c-4934-9bfd-960120a2c58f	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-09 18:58:24.992786+00
7b1c6603-516f-47ec-afbf-e435367fbcb7	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-15 19:40:56.880809+00
d636ac7d-0369-4131-a2f8-62dcc944736c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-15 19:41:02.000098+00
200c6781-5bf7-4abe-8a97-f8998b3af44c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-15 20:13:03.174791+00
7e7c6ef1-a81c-4599-b689-58216efc9685	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-15 20:15:31.999584+00
947ba28e-9592-4227-b56d-2dd3d9ea61ec	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-15 20:28:51.834603+00
4a975dce-599a-47ee-a1a8-f38726fa6e9f	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 21:03:13.883761+00
7979e0be-0a98-4ef0-8de8-48106c91aa8d	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 21:03:20.544291+00
ef70250d-939d-407f-88ff-53c64164d0c2	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 21:03:28.467543+00
60932a72-0490-4616-954d-f85fc9394b88	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-15 21:08:04.010588+00
d17d6a66-95b7-4a9c-a1c6-ce06d023e28e	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-15 21:08:16.072439+00
fcbd3bfa-a7fb-459c-89d7-ebede8171911	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-15 21:08:22.497334+00
54202755-07ad-4301-a776-beac37658f31	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 21:30:37.004437+00
5b9bdaa6-cf7d-43d2-9929-8ea4a77cac71	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 21:30:39.768627+00
1bc3e884-14bc-4c25-be4b-63a85a4698bd	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-15 21:48:09.222894+00
a9f92cd6-273f-4ef9-ac90-ba266d0eb025	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-15 21:48:13.544458+00
fd2a6a0f-b3e1-4b2d-9b37-f90b8a563f21	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 22:01:59.83524+00
1ac8f5b4-f831-44e9-8b27-9bb8dc4b00c6	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-15 22:02:01.160276+00
d718fdd0-1346-45e8-9976-61482c2ecb59	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-15 22:38:34.828872+00
1efa27d8-ef51-4917-8ba9-e9ec0adece77	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-15 23:01:18.850468+00
5f6b7f7e-5b99-438e-a6c9-5d9e8de5697f	08c375cf-3e32-486b-b211-4c28e6239093	chat_message	1	{}	2025-09-15 23:05:21.814523+00
46e7e1f9-7c16-4484-bb5e-897912021ffc	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-15 23:43:49.209594+00
30e0c9d0-7385-43af-84c2-693d82e44864	ed289706-acf5-4af5-9301-2bfb0128f0f5	chat_message	1	{}	2025-09-15 23:59:27.439384+00
f5f2f7d3-93f5-4aa9-85a8-8ca747b54e05	ed675b6c-0cd8-4475-aecc-74b921c68b35	journal_completion	1	{}	2025-09-16 00:20:45.690694+00
2a04d039-a12f-4f3c-b7e5-1e1f7b18ace4	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-16 01:33:37.586651+00
39ae2937-848f-482f-8135-903fa13fabc6	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	1	{}	2025-09-16 02:18:25.475064+00
398f6d47-96f9-4f25-ad50-87155e268f66	4253f35e-0225-4f27-9c42-1eba42715aea	journal_completion	1	{}	2025-09-16 03:34:18.403+00
5c0bba65-1a08-492a-ba41-3e656dac3c3b	4253f35e-0225-4f27-9c42-1eba42715aea	chat_message	1	{}	2025-09-16 03:37:21.541133+00
1daec0c3-1dc8-4623-802c-89144e81545c	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-16 04:13:05.523185+00
147f770c-1b1e-4254-96d2-5ae7933ff4b8	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-16 04:43:48.836512+00
5f34c9d0-115b-4ac3-accd-8368b8d3d9d9	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-16 08:13:00.970312+00
49bad9e3-a8ba-45cb-8920-9418c11ee33d	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-16 09:51:14.939111+00
adc23431-c475-4757-a806-ea2bf2d4f60f	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-16 10:23:54.445109+00
268f0e1c-ff32-4916-9d19-339b629b629e	f6560fca-177d-497f-9225-a597ed888589	verse_completion	1	{}	2025-09-16 10:38:43.594039+00
0be23cb1-cabf-4a27-8001-c279d74bafba	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-16 11:47:37.468145+00
3258e1c6-18b2-4f89-8e1d-b26500353124	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-16 12:19:35.112337+00
8946a432-e4d8-4a4b-a85e-25c61e9b8855	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-16 15:33:29.958924+00
48070237-3055-455f-a406-a95df49ce9e8	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-16 16:34:05.776732+00
1c416dfc-a9ea-4258-ba08-13f09b36414b	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	1	{}	2025-09-16 17:13:25.458786+00
3e59f36f-9b33-445c-8a30-bcc6d4a2f95b	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-16 17:14:08.014042+00
7ac12341-6027-46ab-acfa-f8d1091755ad	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-16 17:35:58.014812+00
bd3552cb-cd87-4ab1-b6e4-722f1fc3fd0e	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-16 17:56:32.558275+00
8aba47b8-c532-4804-ae48-87f4f061d4ba	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-16 17:59:11.411022+00
314f2e0c-b009-483b-a820-02ff12e6ff9c	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-16 17:59:11.418869+00
950b2e5d-f286-45b2-abfb-e92604078488	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	1	{}	2025-09-16 17:59:11.41971+00
7beb43c9-4a36-4103-90a1-f643a9b0773c	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-16 18:35:38.664314+00
f77f3228-8b7c-46a3-8460-71a2681c994d	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-16 18:43:11.512734+00
36d70e4d-027b-4832-8b03-855f675a0fbf	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-16 18:43:20.499103+00
682d1769-3a03-4a7f-b504-3cf121166f43	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-16 18:43:36.143911+00
6ed57366-d16e-4228-bff8-e53876ade52d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-16 18:56:31.112947+00
cf152e4e-7958-449e-b33b-a00026d83459	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	1	{}	2025-09-16 19:33:15.604929+00
244244a0-1854-461c-bc03-7e64edabdb61	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-16 19:33:29.751709+00
a08538c7-3eeb-4bd1-b327-0b745a68ea41	ed289706-acf5-4af5-9301-2bfb0128f0f5	elite_habit_completion	10	{}	2025-09-16 19:37:00.859943+00
e46364d0-01c9-45f1-aecd-5d234154cffc	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	4	{}	2025-09-16 19:38:41.218905+00
00b795a0-e904-4f78-a6f7-e57a389f539f	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-16 22:05:56.481293+00
5193ec12-3411-4966-b0d8-f77bb67dc96e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-16 22:13:16.704765+00
26c0a07e-6d5f-4206-bb73-564884b2cc9e	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-09-16 22:39:16.020777+00
593334a5-27d3-4e61-8db3-5bdb612cde2b	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-09-16 22:39:51.696144+00
8ea62a5a-4c54-480a-b270-1b52eb9ca9c1	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-09-16 22:39:51.721131+00
d2af0ee5-fd52-4900-b8f5-cba8143dfd51	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-16 22:41:33.340551+00
35582ff7-c663-4a9a-a9dc-4318ce58c0fa	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-16 22:42:55.176257+00
9e4054a4-007b-498c-876b-3f679052e151	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	7	{}	2025-09-16 22:43:13.785053+00
e5e89639-d8b5-4ecc-bca9-4534df31ad9e	9c03719b-0e18-4851-b6ec-0abc3981df9a	chat_message	1	{}	2025-09-16 22:54:30.431717+00
57d44d1e-327c-48b9-86b5-4d05da5834a9	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	chat_message	1	{}	2025-09-16 23:02:08.609275+00
f07a1e14-122b-4b7f-ba39-be2ef8b347e9	9c03719b-0e18-4851-b6ec-0abc3981df9a	chat_message	1	{}	2025-09-16 23:04:44.061897+00
1a494191-26a0-4542-857f-17420c834a59	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-16 23:16:38.480029+00
1e0b94bd-a1d1-465e-9151-597e150a0049	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-16 23:17:15.149366+00
c13929d7-b1b3-4332-8ced-369d9192705e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	chat_message	1	{}	2025-09-16 23:17:15.2191+00
abfaae69-7a3d-4d6f-af7c-90ddf494f97f	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-16 23:20:32.133257+00
9f4f3593-4bcb-4b3a-9c9b-729ce145ec71	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-16 23:49:39.549279+00
72ffabb5-a1ae-4086-9321-5cb467d01493	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	1	{}	2025-09-17 00:09:56.754018+00
1ee93641-c721-4761-bd63-825ea2247ec9	c644f60a-2f41-41fa-8814-b698c5154474	chat_message	1	{}	2025-09-17 00:10:16.501387+00
4e5eaf3e-cc20-43e3-a288-74578cc02dd9	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 00:12:49.647918+00
70a38604-88df-4433-b7b0-356ab4bf6712	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 00:12:56.129713+00
eb8d1fa7-53b7-4d65-851c-c45d4f726288	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-17 00:13:52.056318+00
776216ce-f637-42ac-8aa7-c292e6f72b65	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-17 00:14:05.328369+00
d5384d15-b44a-402d-ac68-fa0f83c02d34	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-17 00:14:14.157259+00
4fc33b0a-20a2-450a-adf1-9412229dda31	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 00:14:54.112114+00
76022937-5ab2-4ab8-8efa-5d91bcce3919	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 00:15:06.335294+00
585e6c0a-20fd-402f-a968-85a9056047e0	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-17 00:16:54.728459+00
87705448-dd68-4afb-b952-b3660a935667	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	journal_completion	1	{}	2025-09-17 00:17:08.111152+00
85461b13-c0e1-4a2b-ae73-d9d544c51af0	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-17 01:05:28.607114+00
63fbcb18-6909-42db-bd42-05c032b88f2b	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-17 01:16:54.271723+00
1d21b44e-6724-42b2-a399-a315e0e70570	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-17 01:18:39.696001+00
aec9a92e-36a1-4515-9342-5c8d562c023b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 01:26:46.42116+00
d30f3686-6e31-4531-9097-fb83773ba147	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	10	{}	2025-09-17 01:27:27.03519+00
84cb6c18-35ae-4adf-a59f-cc60317a60e8	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-17 01:27:45.640887+00
27acc7de-e438-4797-94be-cc1aa87636ff	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-17 01:36:59.853666+00
835ca5f2-1a2c-4b08-9f1e-40d61071b09c	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-17 01:40:56.089075+00
4b0ce162-867f-4cfc-97a7-759c53acb39a	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-17 02:05:39.30615+00
95159315-7a42-4f86-9d66-1d50ed482756	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	verse_completion	10	{}	2025-09-17 02:06:15.321797+00
c5326e9d-3b84-46f6-b974-35e9e92dac35	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-17 03:06:32.693114+00
46a6e431-323a-409b-a3ff-c8d64df867ca	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-17 03:36:52.708478+00
1d3c774f-6607-4b56-99b8-2322c77a0385	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-17 03:37:06.710528+00
3f2d1c07-8fe4-49f7-9d06-12714d804fc2	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	1	{}	2025-09-17 07:05:13.74894+00
f3c970b4-e3c8-4a20-9012-d0f2cace4b7e	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-17 07:36:55.419501+00
c8e95edf-6210-4f23-bf26-afe34b1da3da	ab68113b-cba7-4243-9544-8d932abcb521	verse_completion	10	{}	2025-09-17 11:44:56.405247+00
66383f01-49c7-45c2-9aee-e3d717b207d5	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-17 12:56:45.92871+00
21a7f05e-d2c8-456c-8c24-4157bba7f41b	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-17 13:03:03.644341+00
9d99d836-c85f-4de5-b13e-86628ece6b5f	ed289706-acf5-4af5-9301-2bfb0128f0f5	elite_habit_completion	10	{}	2025-09-17 13:05:42.560866+00
577502d1-3a71-4705-84d2-55b424c8ad7b	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-17 14:26:43.046835+00
62a45b89-3356-44c3-9203-514a6975eff5	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-17 14:30:55.178889+00
1e020633-d04b-43c0-9f3d-67349095b221	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-17 14:53:42.113304+00
3d74e920-f425-47a6-9987-73f842938c7f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-17 15:05:30.96687+00
5e26fa01-d875-4885-b036-08a96daef05d	5f250128-655b-41a4-af15-9df32a5ca672	verse_completion	10	{}	2025-09-17 15:10:13.3794+00
eaba7a59-41fa-407f-bd49-dd2be0f01710	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-17 16:37:19.558439+00
80a4ff17-2e4d-49e3-ac03-cdce4a3c9f4a	c644f60a-2f41-41fa-8814-b698c5154474	elite_habit_completion	10	{}	2025-09-17 18:28:32.02751+00
c38afbb0-8cc3-4ee8-a682-197ea84f990a	c644f60a-2f41-41fa-8814-b698c5154474	elite_habit_completion	10	{}	2025-09-17 18:28:39.975564+00
80c58e34-2025-4ac5-b063-c91c399453d7	c644f60a-2f41-41fa-8814-b698c5154474	elite_habit_completion	8	{}	2025-09-17 18:28:41.999002+00
ab3fc4f0-8aad-4b25-814a-a446a1179ea5	ed289706-acf5-4af5-9301-2bfb0128f0f5	elite_habit_completion	10	{}	2025-09-17 19:24:09.494767+00
9d151df7-82e5-424c-9225-329eb371db1f	ed289706-acf5-4af5-9301-2bfb0128f0f5	elite_habit_completion	9	{}	2025-09-17 19:24:16.143416+00
931c384f-8424-43b4-bccf-af6a8092eac6	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-17 21:07:38.13713+00
b53c3081-ea7c-4ec1-95c0-5db2d208a817	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	journal_completion	1	{}	2025-09-17 21:10:24.776409+00
cf5f349e-29e3-4603-8f07-c47e1559e724	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-18 02:20:16.89665+00
4952eb9f-ef74-496c-aa9f-4304ae667916	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-18 02:35:58.842025+00
c2d69c0e-9986-4aaf-a485-bcf2da87acc6	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-18 03:28:50.942465+00
649afb1f-4119-4e92-b6ed-b188091ad03e	55d3fa51-183a-4187-8962-5256b57c4357	journal_completion	1	{}	2025-09-18 04:45:08.685001+00
89fd20d9-a040-431f-828c-7df5f8764c7e	ed289706-acf5-4af5-9301-2bfb0128f0f5	journal_completion	1	{}	2025-09-18 05:25:53.862531+00
2dfb9d47-d134-423e-922e-eb99720338f4	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-18 05:48:29.004126+00
2d1dd3d5-4fc4-42da-ae8e-358fed9ea723	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-18 05:50:52.688527+00
bb784002-6793-4047-aaad-7755d6b217de	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-18 06:22:14.230739+00
2ad69801-0b85-46b1-8a38-59c6ff12f45b	ed289706-acf5-4af5-9301-2bfb0128f0f5	elite_habit_completion	10	{}	2025-09-18 07:56:14.913388+00
72f07365-36cd-4e33-a530-05e267efe337	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	verse_completion	10	{}	2025-09-18 10:22:52.620748+00
60a57ed4-51dd-4f24-bb9d-f321de3f774b	ed675b6c-0cd8-4475-aecc-74b921c68b35	journal_completion	1	{}	2025-09-18 11:42:34.374303+00
4ed8a85f-9438-442e-9dcd-bc83de1e13cd	3da83afb-aa8c-4c55-b3b0-8aa64000205f	journal_completion	1	{}	2025-09-18 12:37:06.798957+00
2cbb88fa-59c1-4b5b-a2b9-650901d86bd7	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	verse_completion	10	{}	2025-09-18 13:28:18.649272+00
7a784ec6-3afd-41bb-8ac8-a4144f689fcc	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-18 15:54:23.156167+00
aa75ab55-d0cd-4b4e-a028-578356a34189	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-18 16:15:01.390984+00
4bf01b6d-6c53-4b7f-a5fb-97263d26ba49	3da83afb-aa8c-4c55-b3b0-8aa64000205f	verse_completion	10	{}	2025-09-18 18:35:23.429493+00
efed256b-44ac-4176-96d2-37d293242391	3da83afb-aa8c-4c55-b3b0-8aa64000205f	elite_habit_completion	10	{}	2025-09-18 18:35:31.688799+00
d5180eec-62fa-40be-9715-37a9d6cb66ba	3da83afb-aa8c-4c55-b3b0-8aa64000205f	elite_habit_completion	9	{}	2025-09-18 18:35:40.46681+00
8020120c-12ca-4b9c-9c93-a6bfffd839ca	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	elite_habit_completion	10	{}	2025-09-18 18:54:39.442037+00
c27e2dda-32d9-43df-87b4-466614a81ed0	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	elite_habit_completion	10	{}	2025-09-18 18:55:14.175743+00
769761f8-aafe-4fc8-a6d0-0c4e78f9528a	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-18 19:17:48.544503+00
bfad25a9-da91-43a7-8960-f36e2149428c	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	verse_completion	10	{}	2025-09-18 19:26:50.530198+00
74da0f22-b69a-43c4-a1f1-c9864f3a9f70	c644f60a-2f41-41fa-8814-b698c5154474	elite_habit_completion	10	{}	2025-09-18 22:00:26.570419+00
ca189a5a-5438-475e-90cc-c23465ae83a5	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-18 22:03:35.512+00
7791bbf7-a9e6-455a-b3f5-072ac8c3c015	c644f60a-2f41-41fa-8814-b698c5154474	journal_completion	1	{}	2025-09-18 23:16:29.865565+00
10ab412d-16d2-46d8-9495-eee0330eb2d7	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	journal_completion	1	{}	2025-09-18 23:36:29.175055+00
34ac2d05-21b1-489b-83f1-cb2c17568b6c	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-19 03:11:27.973217+00
a85cbfb4-ea12-4018-955e-d1b08e2aa3d7	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-19 03:43:17.034192+00
008c55a2-b8fb-49ba-8dfd-d05e58055a14	93819275-d50f-40d7-b404-6e1043b33265	journal_completion	1	{}	2025-09-19 07:50:07.714643+00
c97f9f56-7ce0-4d28-80f3-4d9e1a963ab1	93819275-d50f-40d7-b404-6e1043b33265	verse_completion	10	{}	2025-09-19 07:53:23.215233+00
2ba9d047-d058-4831-b662-a7b14d9ca398	93819275-d50f-40d7-b404-6e1043b33265	verse_completion	10	{}	2025-09-19 07:56:02.431903+00
1bc5a5cb-2b8e-4bf9-9f6c-653d721a19c8	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-19 11:27:51.003924+00
2ccbc857-7e33-4fef-ba85-38fa0f45396d	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-19 11:34:16.601074+00
33435921-c7de-4bcc-a273-991e7a0af843	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-19 12:06:51.605627+00
65fd5626-2812-427d-b18d-17724b4682b9	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-19 12:11:18.656742+00
c4c52ed1-7dc0-496e-9077-fc30e110e7cb	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-19 12:16:41.615812+00
49cc4a1e-cb2c-4734-b452-b0af9032ed94	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-19 14:49:28.209909+00
98d45ef9-c7cf-42c8-ad29-d13c944bc444	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-19 15:35:42.914288+00
eaefc6b2-1c2d-4fe7-9350-ac0784a368d7	08c375cf-3e32-486b-b211-4c28e6239093	verse_completion	10	{}	2025-09-19 16:02:04.770223+00
1ae34f6d-c3a7-41ec-84e1-96b648a59b57	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-19 17:04:38.951914+00
417a114d-9f1d-45bf-a253-a92180b2896f	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	elite_habit_completion	10	{}	2025-09-19 18:28:27.026669+00
86d02a4f-4a78-4ffd-aa5c-fc98b976b162	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	journal_completion	1	{}	2025-09-19 18:28:50.207296+00
df195888-3c5e-4ebc-81e7-7efd5e1abf9d	22c2ab08-6a42-44c3-b290-dedba2161dd0	verse_completion	10	{}	2025-09-19 21:08:30.822412+00
bed56dce-4141-4f94-baa8-0b42d1a79df4	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-19 23:02:41.987222+00
f5482085-3122-4ae7-a0cf-30f1861ac0d9	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-20 02:38:07.959977+00
15594437-ff3e-4428-b963-1ad19b4e5310	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	1	{}	2025-09-20 02:38:32.616776+00
3e7088a5-c304-4fe7-93f7-a530e8416f22	74a895f6-e11e-47a6-b4d3-a89092905776	journal_completion	1	{}	2025-09-20 02:40:04.019092+00
bf368ca8-4d79-4697-868c-591c042474a4	74a895f6-e11e-47a6-b4d3-a89092905776	verse_completion	10	{}	2025-09-20 03:02:06.503406+00
a8cc6f73-3b50-4b57-8b1e-f0db789d5abd	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-20 04:47:18.745424+00
1c66be08-c8bc-4913-ab6d-623dd10f9b8a	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-20 05:20:29.025223+00
e01e4b9a-ac00-4f15-9651-cb7b29f02a89	22c2ab08-6a42-44c3-b290-dedba2161dd0	journal_completion	1	{}	2025-09-20 07:20:01.914012+00
c2862ecb-2a97-4db8-9cc5-0b4ee696ed17	ed675b6c-0cd8-4475-aecc-74b921c68b35	journal_completion	1	{}	2025-09-20 08:26:48.121709+00
2ba71aa3-2355-499f-8c67-99cc1597c51c	2c89253b-a0cd-4217-acdc-f98d84d21dca	elite_habit_completion	10	{}	2025-09-20 09:20:24.541755+00
4244b215-ed07-436b-97d4-37afc2f969a9	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-20 09:27:12.997504+00
f90f7585-5780-41e0-8d61-36ecc61d82ea	f6492019-02bb-4783-b172-53f7e71bdc5c	verse_completion	10	{}	2025-09-20 09:41:08.442548+00
1ceba687-3325-4cbf-871b-baa72acb3bff	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-20 10:13:37.649141+00
997e649a-6634-47f7-80be-15e465aebb8f	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-20 10:18:36.008845+00
50dc17de-283c-4e25-b3fc-a60d73da660a	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	verse_completion	10	{}	2025-09-20 10:19:24.431228+00
cede752e-7fe3-4563-9f6d-6b0c4cdf87d5	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-20 10:28:47.203172+00
ccd8bd7c-1d87-41cb-a258-84b8ba807241	fa12011b-2a8f-41de-9bce-f9b6904d7da1	journal_completion	1	{}	2025-09-20 10:30:33.521134+00
58a86939-42d2-48dc-aa84-9360e478f532	fa12011b-2a8f-41de-9bce-f9b6904d7da1	elite_habit_completion	10	{}	2025-09-20 10:48:54.167962+00
169d9a1a-0f6a-4833-9680-385fe2b3ab58	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-20 11:31:28.795624+00
b0495733-e36f-400b-8e0c-573cf42d657b	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	9	{}	2025-09-20 11:52:06.719419+00
f611e0d8-7ea0-447f-b9bf-3ece83384cd4	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-20 13:20:21.262968+00
78d976b5-9f6e-4723-8df0-9e1d2e099cea	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-20 13:23:38.11444+00
29d6bed8-1282-46e3-a18b-8ef5355fcad3	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-20 13:47:38.364843+00
77e6af64-3032-422e-8dd8-e69728f8e392	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-20 15:48:47.079288+00
d8cf2f67-fc62-439a-b33b-55fac3f694ea	ed675b6c-0cd8-4475-aecc-74b921c68b35	verse_completion	10	{}	2025-09-20 23:57:43.868053+00
f2b83349-29c7-4f39-97ab-5a95b82254ca	ed675b6c-0cd8-4475-aecc-74b921c68b35	elite_habit_completion	10	{}	2025-09-21 00:10:02.681406+00
1a38276b-a2cd-4953-af19-8f62dd12860b	6c665bce-5174-4d59-ad9a-077feccd68be	verse_completion	1	{}	2025-09-21 01:26:43.477177+00
4bae4e1c-5110-4afe-bc0c-04845b19b060	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	verse_completion	10	{}	2025-09-21 01:31:13.707431+00
d8bb36f6-82bf-425c-9d43-cc7af2ba8d1b	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	verse_completion	10	{}	2025-09-21 01:33:54.62857+00
de52d958-4b5a-491b-82fc-6316d1d43fa5	b1cd65df-f61b-41f8-82da-c87dcb1f75c9	journal_completion	1	{}	2025-09-21 01:35:02.470777+00
aa7c59c7-7fce-4d61-a3d5-29365b23adbc	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	verse_completion	10	{}	2025-09-21 01:40:00.770176+00
f1203b80-9b69-4f65-88b5-ffc92a5dc7f8	c644f60a-2f41-41fa-8814-b698c5154474	verse_completion	10	{}	2025-09-21 02:08:37.231646+00
bbb78557-4d5a-4172-a1e6-73796bd71224	2c89253b-a0cd-4217-acdc-f98d84d21dca	elite_habit_completion	10	{}	2025-09-21 11:21:57.055867+00
9ae38b1c-46fc-48b2-9802-91dad4291cff	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-21 11:31:16.317829+00
c0cafe90-99f2-4c88-9583-f3a8ddece4d4	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-21 11:43:20.19356+00
f85c42a5-e235-4401-b7cc-98773df42447	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-21 11:47:22.560582+00
8b0d8eec-f92e-4f83-8cdc-58cec1e36b90	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-21 11:50:05.976718+00
c9f4e61a-a67c-4a71-ab83-7da69309c37c	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	journal_completion	1	{}	2025-09-21 12:18:18.290884+00
7394521c-739d-4712-bed3-5e81e08422a8	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-21 12:22:34.425793+00
c44a5351-b19f-4b61-a93f-c3b1be9fd9ac	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	10	{}	2025-09-21 13:14:00.4373+00
2ce4f9c2-427d-4fb6-a8be-465af32d0e97	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	verse_completion	10	{}	2025-09-21 13:20:55.792065+00
05306f26-8877-4ad9-a744-49819e0b536c	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	verse_completion	10	{}	2025-09-21 13:53:13.522851+00
77d6ab89-18a5-49a4-ad25-33b502c67f5b	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-21 17:13:34.657032+00
b067790d-dc0d-4e12-8554-a87228d880b5	271a608c-0b55-4e42-9d13-293ad20e914e	verse_completion	10	{}	2025-09-21 17:17:05.716858+00
90494f71-3ce3-43ea-9c2c-20bc5688c20c	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-23 03:52:52.369985+00
3ae8b4c7-44c6-43ba-a629-d4929af9c971	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	elite_habit_completion	10	{}	2025-09-23 05:12:57.695819+00
c1b92674-190f-4e79-944f-98a8d2455bc7	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	journal_completion	1	{}	2025-09-23 05:43:36.42629+00
58c4a490-b257-42cd-a11f-a50784563a71	ed289706-acf5-4af5-9301-2bfb0128f0f5	verse_completion	10	{}	2025-09-23 08:28:40.051609+00
541d9440-b4b4-4669-b5ce-b39e13cb4842	2c89253b-a0cd-4217-acdc-f98d84d21dca	journal_completion	1	{}	2025-09-23 11:29:15.592511+00
e28f7a57-d2e1-467f-8dd6-57a415f9281c	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-23 13:18:48.127011+00
7138a7e6-51fc-43f2-84f9-5d25e09423ac	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	journal_completion	1	{}	2025-09-23 13:23:18.537573+00
41375fc0-99a6-45e1-9e16-e5d8369ef42a	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	journal_completion	1	{}	2025-09-23 13:24:09.633502+00
016a2c7f-7943-48f3-83ec-11cf1553a8cb	4f065a25-a458-4d75-86cc-bf80e8009f4c	verse_completion	10	{}	2025-09-23 13:49:50.960199+00
ddce2e93-b7f1-44e8-a73b-53dd360b23c5	18d08fe3-6f60-4abc-a51e-75360e88d54c	verse_completion	10	{}	2025-09-23 04:14:35.47558+00
a0edcfd6-7f22-43ce-b240-824443a74d14	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	elite_habit_completion	10	{}	2025-09-23 05:16:04.725477+00
ee044474-2be1-4b36-8956-a2a8e1f7a2c6	fa12011b-2a8f-41de-9bce-f9b6904d7da1	verse_completion	10	{}	2025-09-23 07:19:29.825241+00
3e3ba79c-af0f-46d2-8d38-c7655ab2cf10	2c89253b-a0cd-4217-acdc-f98d84d21dca	verse_completion	10	{}	2025-09-23 11:20:24.834351+00
d7f3002c-7d0e-4771-a114-03a20b9514c9	f6560fca-177d-497f-9225-a597ed888589	journal_completion	1	{}	2025-09-23 13:16:04.827548+00
122b360c-0689-4156-8680-b14af61e6999	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	verse_completion	1	{}	2025-09-23 13:22:03.80441+00
a89590c1-acf4-4f14-aa18-47fd2716dc44	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	journal_completion	1	{}	2025-09-23 13:23:44.760734+00
6b521545-b1b4-4a25-9e04-cfeeda19c20c	f6560fca-177d-497f-9225-a597ed888589	verse_completion	10	{}	2025-09-23 13:49:20.19296+00
\.


-- Completed on 2025-09-23 21:20:40 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict 1ABaOvUUvUYfsuMn1MHWYqHnHbo2YXfFdL6yeF7LcwrAaScDTwtNn5sel1JWIxh

