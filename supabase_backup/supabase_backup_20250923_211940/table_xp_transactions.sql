--
-- PostgreSQL database dump
--

\restrict oMLKgheVKDpYte3eDA6rdOlMN1agCSZjQ1REh4QAwNfNn2B2daLQiw6iZhXxTBN

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:40 WIB

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
-- TOC entry 4067 (class 0 OID 155919)
-- Dependencies: 386
-- Data for Name: xp_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.xp_transactions (id, user_id, xp_amount, transaction_type, reason, activity_id, created_at) FROM stdin;
c40860f6-07d5-4e14-8077-56d40e1d16a5	c644f60a-2f41-41fa-8814-b698c5154474	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 13:02:45.498896+00
f3ffa71b-5798-43ce-8dc1-337c3cb975cd	c644f60a-2f41-41fa-8814-b698c5154474	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 13:07:31.927801+00
557bfa4f-a147-42e7-bed2-8f147db1c90e	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 13:35:29.541518+00
779ea414-e550-451d-9041-1ab6f07b6d6c	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-10 13:36:38.133906+00
22989f56-b0d9-40b0-b29e-364848dd14f2	b5795b79-a98d-4a0e-90fe-0002b2a03153	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 13:38:32.137024+00
45f62648-19a4-4818-8f9c-77452657c99a	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 13:38:43.478689+00
33d2cc53-4ed1-4b31-9a00-3f55df949544	b5795b79-a98d-4a0e-90fe-0002b2a03153	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 13:42:23.100585+00
10aa90e7-03cc-4ed8-a7e8-6c454b25a090	8dd5df2e-73f1-4939-b0fb-312c88561c71	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 13:42:37.66279+00
2c43a204-1a8a-4791-86f9-16e32cfbb6fd	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 14:11:26.184997+00
728413d8-a7ed-4565-9848-626aa95b5e42	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 14:26:32.254016+00
62c0dfbe-2790-463c-a7f8-ae3bc964d986	452f7104-4869-40b8-b62d-b3ba94c74c2f	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 14:31:37.325353+00
99c16a20-eb8e-4e77-8c58-d841b13254bc	452f7104-4869-40b8-b62d-b3ba94c74c2f	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 14:33:43.239218+00
76420734-33b0-402e-84e7-7551c719cdd2	452f7104-4869-40b8-b62d-b3ba94c74c2f	5	earned	Completed spiritual journal reflection	\N	2025-08-10 14:34:45.524222+00
c040b931-c5cf-4af5-a903-993878cdc2d7	0c12da4d-9494-4516-9d3d-c74d6d605412	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 14:37:11.238256+00
26291a57-0644-4aef-bf4e-9e992084163e	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 14:49:13.187732+00
2120fcdb-5db6-4f3a-80c7-14b786e914a7	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 14:49:33.965341+00
c0872c1c-eeab-48e1-be0f-2fee3b590264	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-10 14:53:58.122234+00
9e360ce1-ce3c-4503-8707-ce8f342bbff9	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 14:59:23.083859+00
46f24277-6876-4d09-873b-d0ada35daccf	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 15:05:09.415448+00
44119a70-cb9b-4f29-9b3f-8e7e03f3d841	f6560fca-177d-497f-9225-a597ed888589	5	earned	Completed spiritual journal reflection	\N	2025-08-10 15:06:40.15055+00
f35c6e84-238f-40cf-8111-39679367118b	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 15:14:06.323354+00
2410b60f-822b-4f08-af62-7d53c9a1d951	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 15:24:23.751234+00
b818f407-91ad-4ba9-a789-567d42a2b3b2	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 15:51:20.120615+00
5fa7ad48-0748-400c-ae20-4f36510b0d66	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 15:58:06.105671+00
1f5997e1-fbf9-4750-8e6c-78989e8018c5	08c375cf-3e32-486b-b211-4c28e6239093	5	earned	Completed spiritual journal reflection	\N	2025-08-10 15:59:43.134091+00
a0c7bb5d-bd23-4295-a8ca-66394f0e9426	71a968fa-20e2-40a3-b260-004d43cca420	1	earned	Sent a chat message	\N	2025-08-10 16:01:23.024073+00
04f53d23-d478-446d-bb51-c2540f967c69	08c375cf-3e32-486b-b211-4c28e6239093	1	earned	Sent a chat message	\N	2025-08-10 16:01:44.556721+00
5e7079cf-7b6e-42b0-a22e-5e5730ebd68a	08c375cf-3e32-486b-b211-4c28e6239093	1	earned	Sent a chat message	\N	2025-08-10 16:02:32.003665+00
09f81f35-8ab4-4fc5-9ccb-8e458f929cbc	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 16:04:41.68742+00
5e185701-86f2-48ef-a9a1-42117e44fafb	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 16:09:41.791556+00
11990319-262d-42c6-bcb6-6eaf511830d0	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-10 16:11:14.302146+00
bd347d16-75a1-4499-b441-d79c6e75644e	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 16:11:59.175839+00
7fa3764c-687d-44d6-b7fa-624ebc10dbd5	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 16:13:59.552762+00
11cbfb93-b25f-4f3e-a028-1b0d4f324919	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 16:19:41.278921+00
293f5acf-8af7-4e8a-b022-777f7b90c62e	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 16:24:33.97816+00
a65bde44-5fe9-417b-b517-c05383119e62	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-10 16:41:19.171292+00
a2a5a363-1956-43e3-9f60-4ea1d5f79923	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 16:41:54.998709+00
d0b9adfd-61ab-4ad6-b57e-96b9d52380f9	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-10 17:14:44.102905+00
6409b104-9fbe-42ae-a005-05b2b5daa958	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 17:17:42.117184+00
6fa12486-f8b3-4d63-926f-e2d580a9a6e8	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-10 17:19:49.90223+00
d27d00fb-5226-40e7-b392-d66c51f05b08	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 17:47:10.496155+00
cf458c15-3216-4639-ad3a-2892797a589a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 17:51:11.252586+00
bfcb3cd5-6420-4026-8e9a-85367da23148	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 17:52:20.829538+00
ae344bb8-91e0-4912-9859-3ea6abdd4f9c	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 17:53:49.798591+00
3985b14e-0ad1-4a12-a337-8ca6542e38e3	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-10 17:58:48.896781+00
1bc50a12-2b41-43ed-b4c6-ae2e07ec5bf1	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-10 17:59:07.970366+00
22375174-3f4a-4494-b2e7-933835309d5f	c644f60a-2f41-41fa-8814-b698c5154474	140	earned	Manual XP award by admin	\N	2025-08-10 18:10:06.62855+00
48fe65e9-c059-4e1a-a20f-a2737adfb80e	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-10 18:11:14.933372+00
6ff45e36-298e-4380-9c7f-6b502dbd9995	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 18:15:54.384248+00
5e99cfa4-b5ca-4212-aed4-49bc2950b954	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 18:42:29.318839+00
d1417848-0079-461f-b591-e6ff6422c39a	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 18:44:53.809455+00
3d099fdf-28f5-4029-99c0-7fe76a103cf5	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 19:09:28.015488+00
f31fa82e-92c2-40e4-81a7-d74d8ad10ce3	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 19:41:47.156545+00
fd3ada6e-3b6e-484d-825c-6e68b3091095	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-10 20:15:53.937836+00
55c3c08f-3039-447d-8bbe-55aabd8258da	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-10 20:47:43.373902+00
4d5fc5be-2ff7-4e1a-b41e-e0e502abec8b	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-10 21:16:29.404776+00
31a6d3a3-28aa-4602-9b78-7f2d296df320	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-10 21:27:56.090633+00
e845ad3c-acc4-4fd1-aa7b-811b5a1b4966	08c375cf-3e32-486b-b211-4c28e6239093	1	earned	Sent a chat message	\N	2025-08-10 22:14:28.619522+00
5a07274a-21e0-4468-b840-f59607e942ff	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 22:16:43.93257+00
8cea3e9e-81b9-4628-b182-d25b4cfd9a54	08c375cf-3e32-486b-b211-4c28e6239093	5	earned	Completed spiritual journal reflection	\N	2025-08-10 22:17:38.451828+00
f6381ca8-1452-4d50-8806-a37dd4b10ee4	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-10 22:23:26.206408+00
cf5f4a0b-af4d-496f-a936-12cfc6191c24	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-10 22:27:24.537418+00
1687fb7b-9d27-4b39-bbc2-add83d32769d	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 22:48:23.91317+00
8404c1a5-f99f-4f62-a750-55b9a4ac2407	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 22:58:31.826266+00
e68f9f5a-2824-4ce7-8e9f-34f914f8d152	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 23:01:02.705556+00
2cfb8216-ba76-4897-a109-aeee37ac09be	71a968fa-20e2-40a3-b260-004d43cca420	1	earned	Sent a chat message	\N	2025-08-10 23:13:07.655059+00
3271bbef-f619-4c61-8804-e3275c526be0	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 23:18:19.19854+00
87282114-7c19-48bb-a9f7-befbcd5d578e	8dd5df2e-73f1-4939-b0fb-312c88561c71	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-10 23:18:29.406788+00
72a173df-07e5-410a-aab9-ba51be275729	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 23:20:44.923839+00
2e2040f8-4c94-42e9-b923-5c9f3c8fa536	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 23:32:25.482433+00
3492f6c2-27fa-4896-89f4-266fc6d04dc6	a2e8495f-d2c1-4e04-9db5-faa976f59207	5	earned	Completed spiritual journal reflection	\N	2025-08-10 23:33:17.633597+00
480a4dc5-276d-4905-a905-186b11d03faf	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-10 23:48:16.017831+00
325fcea9-b424-44bc-aa74-bd90082bb990	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-14 11:18:54.09118+00
1bf6847a-c9f7-4afa-949b-91e544041619	f6560fca-177d-497f-9225-a597ed888589	5	earned	Completed spiritual journal reflection	\N	2025-08-10 23:51:03.954389+00
2492b8af-4f2b-4c50-90b3-c78518450919	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-11 00:08:39.678421+00
cf7787c0-ca3d-434b-b5ea-0abde120cb17	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-11 00:08:50.627452+00
24eca567-6e00-48e7-8549-660ed6c55dfe	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 00:24:13.974549+00
64ccaa79-abea-4cd3-ac7d-5dffcbfdb0ce	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 00:32:34.770882+00
930d92e1-7148-49d3-be36-e1fb5defd13c	a2e8495f-d2c1-4e04-9db5-faa976f59207	1	earned	Sent a chat message	\N	2025-08-11 00:55:03.866221+00
3cf8a898-8f2f-4dc5-b89c-684e90317dfd	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 01:01:36.109392+00
6ebcab57-ad61-48ab-a436-31970391df1c	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-11 01:07:05.547089+00
daaae797-e711-447e-a22c-acacb414724f	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 01:07:09.178438+00
2e3eded0-23e9-43ad-b0d4-c6361b79b799	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 01:28:09.664557+00
aca95c44-0aa6-498e-9ebc-53ffeed432a6	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	5	earned	Completed spiritual journal reflection	\N	2025-08-11 01:36:51.194535+00
3a06e131-5b4b-4d8a-af3d-5f2f9337672c	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 01:59:10.395311+00
2e21d330-26ff-4849-b2ae-acd445e118fa	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 03:05:55.481239+00
9e580b07-8d89-41ee-b925-8bb1c28e3143	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-11 03:07:27.07401+00
82fb060a-b107-4885-b3d4-920457437647	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 04:24:25.213105+00
9f0983b2-49d7-4513-8b68-77ad9423fbbb	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-11 04:25:58.129127+00
285aac47-023a-4cf9-8c4d-25f736ddc9a2	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 04:26:14.902688+00
300526d9-debd-418e-8003-3383a8ff2662	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-11 04:28:31.779292+00
b62a8d84-bd95-4b9b-9f5a-5b193ca94084	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 05:35:51.903711+00
885c363d-5e30-4361-bbef-e25b974f1f53	8dd5df2e-73f1-4939-b0fb-312c88561c71	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 06:23:13.498597+00
81c10cb2-1e14-453c-9fe0-593463bf539c	91f3b294-d544-4d42-9639-a30efa64783e	5	earned	Completed spiritual journal reflection	\N	2025-08-11 06:58:23.292421+00
db9eb1e0-4265-4e99-98a8-c66e0f4d9c2a	91f3b294-d544-4d42-9639-a30efa64783e	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 07:00:37.666064+00
89c07630-2be6-43fd-b13a-9ef44152aee7	91f3b294-d544-4d42-9639-a30efa64783e	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 07:18:22.315585+00
7d9d44ad-372a-47e8-8c07-4df460da09cc	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 07:23:30.32816+00
14a7e6e9-b80f-4426-bbb2-877cadcf581d	91f3b294-d544-4d42-9639-a30efa64783e	1	earned	Sent a chat message	\N	2025-08-11 07:35:06.86087+00
2e04620f-53a3-46c5-87b1-2b1a2f9994a3	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 07:43:51.98062+00
306d9901-6e83-4f14-ae23-02d9d17d58a4	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-11 07:45:08.834843+00
66d29e08-0ba5-4742-b538-eec19b6b86aa	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 08:01:25.854671+00
a157a903-852f-437f-96ce-af5e7cb61870	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-11 08:05:23.337293+00
572a7f4b-ea2f-4ed2-b1df-e8690f36043b	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 08:48:42.966661+00
65e85e19-ff0d-4869-bc16-df809546e9e6	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-11 08:51:57.109161+00
9d3c6be1-fc0d-44e0-aa79-47fd90d733f8	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 08:55:30.066892+00
1d04230b-1422-48c3-9138-5253a45aa648	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-11 09:03:54.046484+00
503fa9b4-cdaa-4616-bd87-9c2bee9bb1e1	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 09:06:09.751837+00
f84409f5-b185-4073-9f23-a38fe86a5644	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 09:08:30.808432+00
cdfeb7c1-39a0-4ef5-a4a2-6dd03bc8536e	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 09:39:46.888344+00
442c3238-b286-4892-a16d-2915aa8725bc	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 10:20:35.096373+00
c05c0da3-985f-440e-b4d8-8aba5c83ecd1	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 14:00:50.672261+00
1274f114-7516-4dc6-96bf-3aae3541191c	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-11 14:08:15.826482+00
85e5a6bc-a893-42e7-9cc8-3688c8febf1e	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 14:12:14.680215+00
6826c7ef-f074-4eb3-9fc9-d8049cc7b392	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-11 14:13:59.14879+00
a3bda5db-543e-4f7e-bd10-0b3ce1a2e2fd	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 14:15:47.099434+00
dfeb3d06-9a8e-4ee0-aaeb-12909c175a0a	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 14:47:02.288134+00
8325f25a-ec01-4399-8b2f-afb2edb95c8b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 15:17:11.907546+00
fc1729b3-2bcf-4d41-b586-b05ed1748aa3	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-11 15:22:05.378974+00
5c5b03f0-eee3-4e00-b41f-f539f88ab2d3	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 16:04:17.610285+00
462acf0f-b5b0-4c1a-b70c-3b22fb1a64ec	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 16:04:17.610289+00
dd5a5243-52ec-4b40-8202-3e715adccdd7	0612726d-b0fd-417f-9fae-b4e6bd79e5cd	1	earned	Sent a chat message	\N	2025-08-11 16:26:50.483094+00
b10cf76d-56b7-4432-b215-55cfac7191c4	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 17:23:27.526911+00
5c76d1fe-8d3c-467a-9c4b-ee9bd8db31d7	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 18:34:41.267455+00
923a5752-40de-41f2-93ca-d466c5b94b74	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	earned	Sent a chat message	\N	2025-08-11 18:39:40.557687+00
2888acf1-0236-45a2-b189-d935a8764ba0	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 18:50:52.908524+00
38af4dcc-9bc9-4dbb-a70d-8cf3b02f9ae6	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 19:25:04.927686+00
29cd0e83-456f-4961-9b57-81ec33d6f780	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 19:34:02.211401+00
06187e77-0f75-45ee-a473-3c8342372b16	716e24e3-7f10-4df2-b64b-2cd6a05f937b	5	earned	Completed spiritual journal reflection	\N	2025-08-11 19:34:55.470032+00
1217d041-337d-4d6b-a2de-8f24a2e791f9	716e24e3-7f10-4df2-b64b-2cd6a05f937b	1	earned	Sent a chat message	\N	2025-08-11 19:36:23.999648+00
34de4e46-20cd-4409-89e3-d69fcd2f2b78	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 19:39:11.678531+00
121cbd48-0e47-4de5-8a2b-377b03dc0397	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-11 20:25:49.911761+00
28b24fba-e160-4243-a6dc-5f5375e6d836	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 20:28:07.871208+00
510d4410-cf3f-443b-b36c-90e6f8c20b2a	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 21:03:02.750102+00
87dc8f74-a6e1-4c9b-bed0-d88f73739b8f	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 21:30:20.928399+00
9c0b7150-57ba-4212-bde8-59b4816322e2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 21:30:54.584532+00
88e53dc8-fe5b-426d-b905-46f4276c04b9	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 21:33:44.689941+00
ad0e655f-ab2d-4165-842b-29a414f920e5	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 21:50:21.867954+00
b5a5cc1a-c56f-4d44-9e16-d6e3907e42e5	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-11 21:54:06.096605+00
024affc5-9598-4adf-b1cf-b20cfb069031	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-11 21:56:22.052776+00
fa8e4da6-4a23-4f26-86dd-1e7734a228ee	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Guide to Inner Silence	\N	2025-08-11 22:18:10.263162+00
c0c758f6-06f8-4224-80e9-f8f670c456ac	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-11 22:48:52.092423+00
3300c3aa-7466-43a8-a4f5-a51e32ac2cfe	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 23:04:20.925907+00
20e0fa13-15a6-4f95-a857-63817f109b37	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-11 23:24:49.972228+00
baf8ea65-c08e-4245-96e4-e7e30e989c73	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 00:45:44.724873+00
1306ba09-064a-4df8-8ac1-267d5cfecc38	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-12 00:46:50.127885+00
cd39e076-62bf-424a-ae7b-89785de0cf07	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 00:47:38.817158+00
84e3fe52-e232-4d55-8b54-6be6d3c204f4	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 00:49:46.171358+00
3dc7354c-7f60-4415-984b-8c7d1cc133c9	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-12 00:57:57.922857+00
00ff9b93-3a62-4a37-ae6c-17f074d98170	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 01:17:55.720381+00
71f15dc5-fabc-4735-b0e5-289f07c49f2c	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-12 01:20:00.888208+00
9e13e048-c0d0-4c59-9287-df99b9ba6be6	38625adb-dcfb-4bac-b473-2e6ee37af72e	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 02:19:59.873026+00
8cf709ba-e065-4bc7-9fd1-c03cd15e9a91	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 02:20:50.331469+00
9c4ff34d-3271-4ed5-9bcc-433e2d8c38f0	08c375cf-3e32-486b-b211-4c28e6239093	5	earned	Completed spiritual journal reflection	\N	2025-08-12 02:24:33.469354+00
740358e9-3923-44a1-8bea-cad6096ad8b8	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 02:25:04.696697+00
e0e69fe0-8783-4014-9287-9a2eab0147e8	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-12 02:28:50.896696+00
b0339e22-b5e2-40a1-b45a-11af02e8e6a9	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 02:29:12.867715+00
5b889215-9605-4bb5-9fb1-32aafecefdf9	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 02:45:00.164212+00
dc00810a-8ced-4bfd-9ce6-dd1e20cc9540	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 02:45:00.168765+00
65be334e-67de-44ce-ad9f-1d1bbd3c69e9	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 02:45:00.170292+00
aabc6e46-eaf2-4680-b432-034e12b1b7cf	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-12 03:19:19.534244+00
1d2ed9ed-3d9d-4aab-a0a3-77657b2e3747	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 03:24:31.300765+00
558e4cf9-5b32-42ec-a404-bac16d2e574a	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 03:35:35.62952+00
22c6ecb3-198d-4ed5-8b67-e0b494ff9e78	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	1	earned	Sent a chat message	\N	2025-08-12 03:37:55.948726+00
25d1fecb-3b23-4014-9527-ae129778b57f	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-12 03:38:30.47117+00
94a2a17b-7f93-4e31-888d-5e7c3f12db05	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 03:40:48.797733+00
54326eb5-722e-4fff-9b3a-6e5b636534fd	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 04:09:13.610456+00
62faafc6-204e-415c-b71a-1dee27b93150	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-12 04:25:05.028928+00
6c1cd5a2-93c6-466d-bbbd-fc2370ac111e	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-12 04:29:56.493104+00
242ab373-8837-4aeb-88d2-10cc539b368a	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 05:20:37.584198+00
c89cea04-5f78-46df-9974-39fb2e4b46ac	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-12 05:33:38.025872+00
81349a2c-2a6d-4ae5-8b14-7f6527f94b4f	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-12 05:42:17.282605+00
30acc568-d351-4865-8f0c-5f52e7a6ac31	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	5	earned	Completed spiritual journal reflection	\N	2025-08-12 05:47:51.669939+00
2caf3ccd-5eb1-45c2-8d4f-ff49faa868cd	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 05:48:02.737464+00
b0021e96-9d71-40fa-9fed-1e3aba41ea5a	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 05:49:02.574609+00
5de4db6c-84ea-4312-8325-577c89bf4944	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 05:50:07.592905+00
530a42ff-ef94-429d-8769-e00b71c749b9	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 05:52:19.938318+00
2a4521d2-9b76-4177-8918-c999624af965	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 05:55:11.30908+00
48e3c33b-0112-4b17-ae38-654e0d6963c2	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-12 06:14:37.55157+00
95736f57-aba6-4edb-947f-ca22c92a4247	5f250128-655b-41a4-af15-9df32a5ca672	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 07:32:42.194391+00
e50c4f54-9730-4782-92dd-9eeefafec5ed	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 07:57:12.932609+00
437f2a60-f2b5-4023-b0b9-dd0fdabe91c2	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 07:59:42.416769+00
5121abed-f453-441e-9f59-71f3bc6e836b	5f250128-655b-41a4-af15-9df32a5ca672	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 08:05:27.341206+00
13e25bfd-03bd-4934-9974-94d7bd846adc	5f250128-655b-41a4-af15-9df32a5ca672	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 08:12:21.465565+00
2debfa72-6d4d-4c4b-bdbb-bec111010d26	5f250128-655b-41a4-af15-9df32a5ca672	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 08:14:42.061209+00
f59b7d09-4a5b-48c1-a4c9-49b3e55bc16a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 08:30:50.833181+00
bcbf0e94-4dbe-4e59-ab1d-7f5f8c100175	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 09:01:22.518919+00
621e8d69-59d9-4d10-8b32-f6d76da38133	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 09:03:52.000676+00
88ed4ad6-4bab-4a44-8758-bf8a9010c19a	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-12 09:05:16.247502+00
ad4da25a-7336-4c34-baa7-3810a7afb8e5	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 09:07:56.882714+00
2be3ee59-d6b2-4c40-9ec2-3935130564b6	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 09:44:05.347116+00
88c2a270-98be-46ca-b8e8-22666e9a8e46	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:33:24.38154+00
5d432933-ca94-4c43-b6c2-00a259be2c77	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:35:31.25503+00
ef3f166e-fffa-47a4-babc-85851dd2d150	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:37:36.556263+00
7b3ebce9-dab7-4192-a556-77539ce1d8c5	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:39:59.924583+00
5e1756af-717c-4995-ae19-b7930ecb7106	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:42:04.537145+00
1f4f6062-395a-4823-b224-6a83aec3bbb0	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:44:09.767896+00
568012cb-6d67-4cd2-b8cf-a4477814c421	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:46:14.03087+00
6bb5106c-b114-4d87-8e9f-ef2960555788	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:49:02.790283+00
350940e7-9df3-4cb1-8c99-40463f99c79f	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:51:08.181009+00
1d746bf2-f370-4b6f-a0d7-0b065760b141	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:53:12.672681+00
8b7ea94f-c2b0-4732-99a9-b6b91e5d9e33	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 10:55:16.881212+00
35780244-3d89-4ae9-9b13-1117c9ac5d43	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 11:48:36.415738+00
790d9806-edaa-496e-a076-d082c698d364	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 11:58:24.974357+00
8bcdf029-3f64-4749-b876-cf58dbcf51a0	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-12 11:59:25.277629+00
d2b27c19-2a5e-458f-826b-04772bea4373	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:00:59.75182+00
4b0112bf-07ef-4e5f-b1f9-e45c2052fa26	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:00:59.772122+00
93eb630b-cbcb-4f67-8945-775d604a58eb	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:00:59.775249+00
aa63c37a-be52-452e-ae09-7c74225b88c7	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:00:59.786121+00
ea1db4ea-8100-4101-aea1-6c337a82c50f	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:08:11.990785+00
c24be595-bb10-4ef9-a177-6521d4c16d78	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:10:41.351427+00
3e653167-d7f9-4995-a74b-58a04d423932	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:12:46.511196+00
3cf60d97-b68e-449b-baba-7b915b53b2fc	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:14:51.35066+00
cfddd1a9-3b9e-4217-a929-45a0a85e8f6b	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 12:19:35.670191+00
78b185a5-7e11-4a2d-b331-bdc3d1ef5dc8	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-12 12:23:07.864485+00
2b5cb0b3-b554-431b-b26c-747793b0de7f	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 13:04:29.768208+00
ced50625-c735-4b4c-a8f3-d3bd0b991310	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-12 13:05:24.546202+00
b7ff8106-64a0-4c67-afa6-06e1dac69cf2	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 13:59:40.278171+00
221cce82-f512-47d4-b97c-42d103662d1a	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 14:01:55.493326+00
a57d9301-d99c-46fb-8546-2d4cc9517674	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-12 14:05:56.855599+00
88f00acb-bb98-4460-be69-3d4200e303b1	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-12 14:06:06.355477+00
5aeb328b-d4d9-4c65-b7f0-b9e6f1b75015	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 14:37:35.136785+00
21df73b0-c329-4372-bacd-8d9930be97c7	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 14:53:01.306544+00
808dbb8e-72ac-4ac1-8892-c4dffc99c5f7	232f25d2-b13c-4ba6-8f2b-3dc0befb5d32	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 15:10:16.2639+00
44df7a0f-0d3f-479a-9163-0804b2758765	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 15:15:49.734643+00
228d6ee5-3466-4b70-9397-0ce08e702060	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 15:33:29.467054+00
8a6e7209-574e-4fec-a584-d103f34415ea	fa12011b-2a8f-41de-9bce-f9b6904d7da1	5	earned	Completed spiritual journal reflection	\N	2025-08-12 15:34:17.794421+00
a7c2aaba-7757-4167-9b45-4feb2b8291ab	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 16:05:12.908205+00
893d5b85-188a-4be9-8a69-8eb5bc4c0c98	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-12 16:15:38.648881+00
a0cbfa27-ee72-41e7-89b4-bfab6470a611	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 16:59:31.859041+00
5c46a73f-4922-4bf1-bc53-d514f659e364	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 17:25:56.890151+00
320235b6-731f-4add-87aa-aaa6dcb101b3	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-12 17:26:45.378265+00
49f568f0-ff06-401b-b110-192958ca6e70	38625adb-dcfb-4bac-b473-2e6ee37af72e	5	earned	Completed spiritual journal reflection	\N	2025-08-12 17:30:46.845309+00
91d632fa-06ad-43d7-aee0-93b2aa023647	38625adb-dcfb-4bac-b473-2e6ee37af72e	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 17:32:11.413898+00
38db7fba-2520-4e51-bbaa-9da903957959	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 17:33:06.515432+00
ba3be0d4-193d-4eda-b1f0-64e1c9dd6c8f	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-12 17:34:46.663883+00
1963a684-940e-41a6-9bd8-b46cf29e19f5	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 17:59:49.02706+00
1950a543-7cfe-42e7-9fb9-7a8691a1febf	38625adb-dcfb-4bac-b473-2e6ee37af72e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 18:03:42.47518+00
6dd17f30-e316-4925-965f-445adf5b46be	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-12 18:04:06.524378+00
36c3d0d6-4082-40db-895f-e31aade01a52	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-12 18:04:24.150563+00
f01e83df-6362-4310-abaa-d3ffe449f17f	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 18:12:46.08091+00
4a9e4344-3704-4766-9e97-33449cd26dec	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 18:18:40.107247+00
0dbab962-3633-4d6b-810a-e8a351e1629e	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 18:55:01.029859+00
acf5f68c-c392-48ef-8815-b21afb50cc8a	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 19:40:49.311661+00
20195f2d-f6d5-4cd1-8bb3-e147331ddc9a	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-12 21:46:36.198508+00
69a6a321-7bb8-4b8f-9ed5-b34d317fb401	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 21:48:46.198886+00
1fecb721-6313-44dc-9961-ee4e1d982eee	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 22:03:57.765447+00
94c91f0e-2701-42c4-b9ff-c486b5eb4148	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 22:06:11.857901+00
4a2691bc-a448-455f-a923-12a89d39feae	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-12 22:20:08.713844+00
c97a7851-4c3a-45a7-922a-b14107cd144e	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-12 22:39:22.018505+00
f3ee3b49-c8e9-4659-b32d-42d3368e73c9	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Guide to Inner Silence	\N	2025-08-12 22:54:08.959422+00
d1b9172e-e469-47af-9dad-0730731be72d	08c375cf-3e32-486b-b211-4c28e6239093	5	earned	Completed spiritual journal reflection	\N	2025-08-12 22:57:02.366987+00
d2f31bc6-2f7b-43fe-8e41-15eaac7731bd	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 00:37:36.506258+00
74684eb4-4e7f-433a-aff3-04c82879046f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 00:45:03.77082+00
216cf993-8471-4668-93ae-b448d10e51dd	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-13 00:46:35.387217+00
985ab6f8-9966-4c77-987d-6eb95a73f625	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-13 01:46:25.575528+00
ab379414-e6d8-484e-9e38-30583a6da942	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 02:34:02.085951+00
c36130bf-31ec-476b-9e29-c04cb742da18	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-13 02:35:15.496316+00
77177752-3536-46d7-bcd4-09b2316e4f80	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 02:55:53.67122+00
b0c6b355-7ccf-44cf-9451-8dabb75767c0	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-13 03:04:16.891886+00
adbdc303-5767-463f-a991-a9272dd65a94	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 03:06:30.169462+00
4e95ed6e-f4bf-4311-9b3d-8620669fc002	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 03:37:12.780351+00
d9f18d26-3312-45d9-9cd3-5633be93dc01	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-13 04:35:37.970846+00
46a0603e-e974-4f5b-b5fb-df11d6881e29	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 04:38:24.820376+00
1925b29b-148f-4c54-8f8a-e14daf459c23	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 05:12:52.067541+00
f42d5f38-9a7c-4ae2-8a5b-81405d2e329d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 05:55:41.492163+00
fb8d6455-655e-43ea-a588-d8c8b18aafa3	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 06:30:58.956341+00
8ce4f02e-adfc-4ea7-bbd4-fee23c3a9391	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 07:01:47.965249+00
5e4794e2-e516-4cc3-b30d-3e4eb6d2a58b	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 07:47:45.895305+00
8e4b8505-2a6c-44fb-ac82-65f2a8cad394	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 07:47:51.195018+00
1de8253f-dc8a-4df1-b173-0920ded6f2e0	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 08:57:17.276453+00
921cc130-0ae7-4ac3-b21c-64e8e3a2ff25	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-13 09:02:53.337597+00
e0a3bb53-9d6e-4536-97d3-3fce196672f2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 09:42:32.13613+00
ae87e5f4-9cb0-4004-9306-d5b4bdc2046e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-13 12:36:31.097794+00
e5a6a25e-6a3e-4693-adec-57487b8f021d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 13:44:21.952694+00
df2b8ad9-8a11-422f-bb4c-a54f370b86ce	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-13 13:50:48.980443+00
fa9bf922-4dcf-4098-8a10-496f851216d4	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 13:53:25.134198+00
24ced8f5-7970-446a-9824-69c406e44e81	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-13 13:54:19.854201+00
b9bd246d-7e70-4981-bd9c-d1f6285127e6	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 13:55:31.430777+00
0bd7823f-9120-424b-8193-612f038b0cdd	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 13:57:37.386223+00
cb11eada-4abc-4f1b-bdcb-4d66698553e6	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 13:59:44.937517+00
c7fdf8b4-ff82-4164-8669-4193c4c75d48	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:04:45.460482+00
5db8ff70-ecc4-4d8e-a1e7-f54f6d5fd8d3	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:12:42.915625+00
22e95591-e875-4ae3-898f-784eb1089edd	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:21:04.551791+00
66a98098-700f-4681-914b-e762964edbfd	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:23:34.628919+00
fe842d0e-6b80-48b1-a9a6-64f442d6d7d7	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-13 14:24:02.888705+00
eab59200-cf6e-4b25-b70e-66836351ee71	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:26:04.066+00
00b8ca1e-a870-4408-9667-0b1a56eb9a56	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:28:12.970227+00
0f958d63-42f7-493d-b203-630111939331	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-13 14:29:04.089172+00
2ee148d4-d1eb-41c3-b2c5-7f64196a7e07	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:33:36.552897+00
e873c7c6-330a-4dcf-b6a7-6300c112a99b	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-13 14:45:14.647156+00
96f039dc-cd2c-4d73-b7f5-30afb9fd1bcb	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:47:48.715347+00
fb10efd4-2fc1-4a2b-99e8-1026a8b209f7	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:51:04.538948+00
f0c3c940-c084-434e-af8a-1b7d99651311	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 14:58:45.005481+00
74e1f1b0-67f1-4199-a4f9-417de26c5d13	139a1f11-400e-4a21-9682-4936eaf7c43f	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 15:04:58.316966+00
2a992863-69d8-4fd4-8a15-02a3f572b7c7	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 15:29:53.317647+00
679947f6-3320-45b0-bb3e-1132e8d35c57	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 15:38:58.167906+00
5fa1b748-933b-4008-a938-8c11d2e25087	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 15:42:39.340765+00
bf3b009e-4e32-493a-b8e2-613da79fefc9	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 15:43:19.02461+00
5b8da03f-9ee3-4bad-a67f-ecd7e9e03510	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 15:48:18.960869+00
ca0d97ba-876d-49ca-89a0-422a31221363	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-13 15:54:14.075067+00
68ea34f4-beeb-4e8c-b997-a516d95ffd29	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 15:56:39.362393+00
e7ee21d1-919e-4a0d-824b-ac4cba59945e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 16:00:15.436618+00
ae4e0a33-1d46-42de-a005-42d7cef6a22e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 16:04:53.979972+00
af503ebc-2e64-4fd1-a3a4-6775e73aef08	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 16:13:39.169992+00
03f84b31-0184-4fde-bfa3-6435533f482b	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 16:20:52.742444+00
7efe361d-fb4e-46a7-94ea-8a2e843ec118	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 16:51:04.491474+00
6bcc02c0-8031-41ff-80e6-734aaa16caa3	716e24e3-7f10-4df2-b64b-2cd6a05f937b	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 17:37:50.3342+00
eac6b7ec-072a-47c0-8986-a7b119101f33	d14df823-5cfe-4698-a0d7-19b2a49ba058	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 17:40:19.512726+00
442dd73a-ed4d-40b6-ab08-572eb4c5683f	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 18:25:37.154206+00
7586dc7f-a50c-4314-bd19-eb3aebfd93e9	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-13 18:26:30.630097+00
a9271c8b-a0c8-4eeb-9c6c-24fb45b12d73	d14df823-5cfe-4698-a0d7-19b2a49ba058	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 18:27:13.093355+00
4ad791c4-4fae-4e2b-b259-38b6bdcbea80	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 18:35:37.790003+00
18b312c4-9972-4ea2-b756-e28a0c0a566a	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-13 18:58:54.526876+00
1ce0dcaf-b56a-411b-90b1-502825b569f9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 20:46:35.184241+00
da8be12c-5dd3-4260-897b-2277a21dbd6d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 20:46:35.184241+00
a6b86e16-8660-4724-a3ad-1858127cd4bf	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 21:38:31.205745+00
12efe5a4-8ef2-42e4-8f5d-fb4f6566b1e9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 21:39:18.182297+00
8d39c10c-c547-424d-ae37-dd5e9a163e7f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-13 21:43:26.64543+00
623273a4-4dd4-4367-bc31-76b1d30dfda6	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-13 21:49:37.849286+00
beb36054-39f8-41d0-9d20-1b739410a185	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-13 23:34:35.403026+00
16993e47-cc96-4c15-a52a-915961a5534d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-13 23:36:32.090947+00
2d80c859-76b9-405f-994f-db964e54949a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 23:36:48.170181+00
262f3157-abd5-4d8f-961c-74fb1a717887	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 23:39:20.180253+00
75bafd4e-dcfe-473f-9799-da65a67ab728	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 23:40:29.234134+00
f84d69b1-fdde-46b4-bbc2-c33fe19e4f37	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-13 23:43:41.918555+00
110e4ac0-e01a-4931-a50e-ffb0aeefa616	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-13 23:59:54.909251+00
15b31def-a7d7-4faa-9fb2-8de46c776c14	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 00:07:22.110268+00
9173be71-cf38-4fe4-830a-cdf9984c0025	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 00:07:30.741105+00
5d42e94f-2944-4b3f-bbcd-1bb07e63ccda	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 00:30:18.836519+00
98bd7c22-6283-4c91-a7e1-1cee7a2682d9	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 00:30:59.530147+00
d869c063-43bd-4dfe-ad5a-8d6b2bacae3c	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 00:33:52.243055+00
e641cb9a-ac85-4c1b-aeaa-e2214f890f9e	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 00:38:02.089842+00
19ba54d5-ddf7-4b01-9660-32d74d8687b2	139a1f11-400e-4a21-9682-4936eaf7c43f	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-14 00:42:11.390377+00
9b3e2f7b-ace2-41fe-a61e-dfeabe2dce9b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 02:27:19.021205+00
24f2fadf-88e9-4b8b-bd7f-8d0695f89680	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-14 02:29:08.981413+00
57fa0a79-17c4-4339-acfc-8bf6096bb41a	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 04:40:22.068389+00
4db30e02-bcd0-4596-8088-56b8235f1ddd	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-14 04:42:03.153571+00
e9522203-d98f-4e35-bc5f-8aa8927cbd94	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 04:44:13.558982+00
d3a663be-a802-4b4c-a761-2082930c203e	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 04:46:19.428655+00
17f5f2c3-c8a4-4b2a-98d3-636bd6a4967b	38625adb-dcfb-4bac-b473-2e6ee37af72e	5	earned	Completed spiritual journal reflection	\N	2025-08-14 04:48:24.547929+00
31ca9f57-f0fb-464b-94d5-6ad9f0ee6bc7	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 04:48:29.891979+00
4cdf401f-416c-45cf-b14c-7b15f7b7392c	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-14 04:49:01.082131+00
ea4a1b10-76ba-4c69-a8e4-7e8ce540a24f	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-14 06:04:17.381723+00
e4f5bee7-11c4-407f-8131-341241ecc724	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-14 06:05:02.375366+00
9dad5834-b9cb-4a2c-b338-861f97b73ba1	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-14 06:08:31.866675+00
4f337ff3-f2d2-4b09-857a-68cfe10ad58f	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 06:11:47.063861+00
2c61b8d7-b1ce-4756-baae-3c05b34837a6	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-14 06:14:47.166315+00
cc2787b8-a9f9-4a42-b3e2-4910eb997afe	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-14 06:19:27.895389+00
eb83de0b-f941-4280-910d-a538da951f67	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 06:26:27.558237+00
1069f073-f0f0-440e-9dba-16c29e7f0600	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-14 06:36:53.081882+00
e0ab5190-e5d9-457a-8ea7-5ed3afdf1d13	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 07:57:25.047436+00
93b34313-8fcf-4517-8940-3dfefec19e1a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 08:17:08.240921+00
b311c5ed-a7a4-473e-bdbd-492873461ba1	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 08:19:16.314865+00
0d020a6b-d9ec-43c3-bbde-23d40cc44f52	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 08:22:27.541859+00
099547c7-6ca4-446f-8c4d-666c9f5cadc0	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream (English)	\N	2025-08-14 09:22:06.597727+00
3f697de6-ec1e-46fb-b8f4-41da04c5d827	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 10:21:25.05412+00
f4d7d551-87f1-484b-9fe9-6721cc828b2e	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 12:02:09.408849+00
d8d3320e-384b-4202-8734-099651a6d649	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 12:07:00.113903+00
46dffeb8-7fb1-428d-9cfe-a5590b91d27d	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-14 12:50:55.408486+00
7334ac07-ee3f-46e4-9046-451484c3938b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 12:54:35.360221+00
ce07d765-dd76-4c09-9d79-bd3f29444e29	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 12:56:40.568364+00
74e44b40-990e-4d0c-80cb-35ffbfd5873a	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 13:27:15.107067+00
96f04217-f377-43be-bfba-7af848071468	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:31:21.8749+00
fbdee1a1-c0f1-41ae-8834-50ee92b695f4	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:33:49.123905+00
4fa1aec3-023e-4e8a-a7eb-20224e41d71b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:36:15.66731+00
1fd8c87a-d5a8-4224-b4b3-11e5cbe69f08	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:40:58.273803+00
7c5acc50-a475-4604-9ace-6cbd62c9db48	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:43:29.808895+00
c82c958c-e637-4059-a843-b79ee3ced948	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:46:45.928927+00
6b9e4c0b-4a73-4ee0-a1e4-795153317daa	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 13:54:20.544283+00
6cb74c20-84fb-4003-bedb-3077cbe05bb9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 13:57:46.598893+00
e7ab3fde-7f4c-4317-861b-74fbf53a470e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-14 13:59:55.443775+00
b70377bf-d910-4047-8d24-f5a6f187994a	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 14:38:07.258157+00
c7e45605-224a-43d1-bcd4-56eb911f02b0	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 16:08:26.741645+00
17bf239f-20a3-4a22-9a7c-6c3ace0a8117	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 16:34:17.309724+00
4179affa-75ca-4a34-afe0-52d81a380ae5	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 16:58:15.647227+00
b40221e8-e7fe-4b11-80dd-a679620c607d	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-14 16:59:07.09856+00
3ad6123d-1103-40dd-a994-2aed0287c08b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 17:05:39.630049+00
a26b7da9-f646-4e4b-9321-9c0e96434772	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 17:32:55.56108+00
bac8eec5-646a-4c56-89d0-d5b37e086ba7	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-14 17:36:10.200886+00
8c029f5d-48c8-4487-9de9-bcca2e376ded	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 22:48:34.015514+00
485a03d5-bbe7-493d-8c43-394832c88a9c	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 22:48:46.904061+00
468d48fb-beb3-4a9b-be4d-83a1ddcb4914	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-14 22:51:56.477241+00
8d9d88a3-4930-4a0c-b3c8-ea3610f632ac	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 22:54:24.223385+00
0c20482a-e37a-4870-8691-003e451c7520	08c375cf-3e32-486b-b211-4c28e6239093	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 23:19:24.473648+00
fede83e1-6d99-4f59-89ea-4ce2dddec3b9	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-14 23:25:55.378095+00
7ad3fe33-a95b-47ed-b408-2d054434535b	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-14 23:29:15.840846+00
7565d202-c29e-4e4e-96ff-6ced066bb94e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-14 23:31:31.333675+00
05ca65be-7432-44e9-96ce-e5a2ed7715d8	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-15 01:15:49.496781+00
be5d40d4-fd40-428e-b3b9-cf374453b1ac	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	earned	Sent a chat message	\N	2025-08-15 01:33:04.083917+00
72c6706f-78b2-49b1-8566-4b281f8e6d43	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 01:55:44.075704+00
d64720ec-8501-42c2-af2c-6e39ebcdbde3	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 03:29:13.807898+00
9946f6a6-885b-4654-afc4-a2d7e84731ab	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-15 06:28:30.445071+00
801188ec-f72c-46f6-8893-6176e2fb6854	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 06:30:55.459244+00
8327f1b7-b4dc-44c8-9ce3-a19e310e19f0	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 06:39:01.703063+00
3bc496f0-d2e8-40f3-81f6-e500e3907c71	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 06:41:31.426023+00
770796e8-ce50-4e39-930e-d409b9092980	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 07:09:12.764381+00
78a5fce7-8915-4582-8c90-18c3e072f03c	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 07:42:12.315393+00
26e9926e-2c11-421f-8e54-eb3704637e81	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 08:16:27.904401+00
e563a4b1-c338-4237-adcd-72aa84f215e6	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-15 08:20:00.359997+00
87c177f8-cbf8-4d40-b51c-01846f2896d8	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 08:23:00.538603+00
5a646d26-f849-40de-be5b-ae313ab92534	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 08:25:22.404273+00
94ed7dc6-0ae4-4ae7-b2a5-6f3bcaff8020	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 08:27:43.75857+00
07a7e035-cfb1-4801-90e2-ce6f01c6a85c	a2e8495f-d2c1-4e04-9db5-faa976f59207	1	earned	Sent a chat message	\N	2025-08-15 08:33:43.771705+00
f3b15211-fc9a-434b-aa40-a3575f37e345	a2e8495f-d2c1-4e04-9db5-faa976f59207	1	earned	Sent a chat message	\N	2025-08-15 08:55:29.019284+00
d7ddcb1c-fb88-4926-9b09-2c52906c934f	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-15 11:23:55.996904+00
bae87f4a-96cf-4be7-b792-ed41571c7b1e	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-15 11:36:45.654647+00
29346d31-dd89-4f4e-ac98-6ea963f55ec9	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-15 11:38:12.787707+00
f54ebe33-23c2-4bbf-b678-5c6a2fb32d85	ef2002f9-7a58-4d14-8f10-4a0c804d89d9	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-15 13:48:29.486555+00
61e8b5e9-3e7b-44de-b3ae-b4f20f2e6d3e	f6560fca-177d-497f-9225-a597ed888589	1	earned	Sent a chat message	\N	2025-08-15 13:58:24.113907+00
94c13907-4197-42a7-91e3-51e4ed9eed94	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 14:02:03.580336+00
86790865-eea7-4b76-95e2-3489ab90cfb8	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 14:39:29.847603+00
851994cc-3ffa-47fb-972d-737b7569ca4d	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 15:26:05.126679+00
a4cc0139-c508-4999-8c68-e02343b25e59	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 15:40:21.943831+00
bbb0ac97-86a3-45aa-a850-edc55c60f68d	9305c52e-c5d4-4a7b-b3ea-4474ac531795	1	earned	Sent a chat message	\N	2025-08-15 15:41:04.200149+00
1ea5a7bf-86e1-4178-8c90-ca87f323db17	9305c52e-c5d4-4a7b-b3ea-4474ac531795	5	earned	Completed spiritual journal reflection	\N	2025-08-15 15:44:07.257687+00
1bd05954-cec7-4544-9d2f-8708c1e329f5	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 15:49:49.814706+00
6b09ce08-7e18-4326-83f8-438cf596d393	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 15:56:34.506626+00
ba3774b5-385d-4ef5-ae80-4a4d15c590ed	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:03:12.895281+00
50460373-de41-46b6-aaba-e075890ecd35	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:06:19.233212+00
db71f8ec-f189-4331-8d82-9b4852b396e0	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:15:22.050703+00
087111ea-cbad-4cfd-9021-00c92aec8660	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:19:59.913548+00
a337c48a-6e9d-4acb-b37a-3bfad46058ac	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:21:37.607596+00
91cde486-d61c-4581-a380-82f3119ae557	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-15 16:22:36.80829+00
a8028ee1-e845-4541-a6da-4f57566a7f98	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:23:06.011302+00
03f113e3-5c63-474a-a1f0-148f134c54a6	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-15 16:25:12.516689+00
cc49211d-a952-4dcd-bb87-53556e0991dc	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:34:51.062226+00
7d8af4e2-c31a-4ef6-bcf2-9caf2258a442	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:37:19.490566+00
e21f13ee-c3c0-49b5-a7dc-86fcbe05eef7	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:41:12.915552+00
56f23406-ce88-467e-b4d7-95cf0141a1c8	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:42:53.474893+00
4b349f78-463f-474e-b975-d19bd14ca09d	b2803bb9-d737-4420-8eb0-4a6deed56216	5	earned	Completed spiritual journal reflection	\N	2025-08-15 16:43:25.49405+00
63eca2ce-f4cd-4d94-8f85-3cd53b41b9ad	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 16:57:08.952221+00
3885833c-57a3-4d48-ac45-fea6f10edab0	9305c52e-c5d4-4a7b-b3ea-4474ac531795	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 16:59:50.756042+00
572679c8-7f1b-4d01-837a-43329a7c5de5	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-15 17:14:29.987903+00
49586f43-a6a0-4c34-a2b8-ad529dbeb690	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 17:19:46.798461+00
0d797c56-d825-4fda-9dd8-48548bc6e444	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-15 17:44:52.678597+00
0f149dc4-58cc-475e-a9c2-0c21c37bda7d	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 20:21:28.619822+00
82768977-035b-4a14-bff7-804d968a682a	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-15 20:24:06.452716+00
13cca3d5-c2b8-47f5-ba7e-ca5d0640aaf4	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:00:50.698397+00
149af232-a0a5-4a05-a6a8-c8c6b5e72a7c	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:13:29.733834+00
4c3a5b7c-1bec-4dc2-a62b-07906e4f43ea	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-15 23:21:48.846334+00
fd7a96c6-088f-4b5d-9024-1d3e0d2fca48	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-15 23:23:38.31856+00
d04ee90c-160d-4ba9-8580-012c10431e0d	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:26:32.671079+00
4c43d94f-4f85-4b70-8aee-3ae5d98b318e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:29:11.79719+00
60998362-0df6-4856-8368-5fffb4c21a5e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:31:35.109561+00
7b7990a6-9826-429a-986f-efe0a085e675	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:34:27.968402+00
7c6bdda3-2bbb-4409-8fd1-0e099c2ff714	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:35:22.734925+00
b7401c4e-e536-40f7-91c1-c06437b0931d	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	5	earned	Completed spiritual journal reflection	\N	2025-08-15 23:36:23.47849+00
1777e401-7d57-4eef-9d64-b025e175251e	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:38:51.809371+00
5d5f05d2-bad8-4027-b276-6a1b79414fdf	a5324ccb-3584-43d3-9706-9ab2155f2bbf	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:40:02.774046+00
a24a608d-18dc-468c-b248-f94709a16745	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:46:41.197112+00
290c32c8-f74b-4b43-83cd-b0a174d05510	84955e07-c412-49d9-998c-a40c3340bf76	10	earned	Completed Guide to Inner Silence	\N	2025-08-15 23:49:23.79685+00
d64e4448-3ef8-4868-b280-1523035013d6	84955e07-c412-49d9-998c-a40c3340bf76	5	earned	Completed spiritual journal reflection	\N	2025-08-15 23:50:17.048223+00
98862b09-73fb-49c3-845b-cfd4e5b4e929	9c9c8939-2137-4637-a5b7-f4c98c861376	1	earned	Sent a chat message	\N	2025-08-15 23:54:52.379024+00
cd5674bc-34ae-4899-b70f-2e6d1e0084af	9c9c8939-2137-4637-a5b7-f4c98c861376	1	earned	Sent a chat message	\N	2025-08-15 23:55:40.601802+00
2d26fa93-1f3b-4065-b109-c5019f52e72e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 00:05:40.381754+00
f8016904-2803-4991-b266-56d832766864	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 00:08:29.634636+00
0ae225a8-f389-44fc-b02f-dd3085d0a346	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 00:11:08.689951+00
7e479471-1b14-42ca-ad19-6a760f903711	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 00:13:35.010502+00
a26b41d6-ca96-410a-805a-22139c27604b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 00:17:59.234617+00
57ac234a-3597-4bce-ab7a-b1eecab5b641	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 01:02:52.5449+00
fbb016ab-e50b-4923-9e16-787ba44de8e4	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-16 01:05:25.6621+00
1135c092-df2c-48aa-84c2-13890dc263d6	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:07:32.151905+00
3424fe58-fce6-4cba-9392-bb9913d770c0	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-16 01:09:14.463436+00
2d2f5422-220b-4ed1-8062-b639582bb958	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-16 01:10:03.695529+00
44377d07-ac5c-4e2f-958f-424af822cba8	8fa357c9-4450-4e90-b3c9-6886f7159287	1	earned	Sent a chat message	\N	2025-08-16 01:15:15.559032+00
901204d7-e0c0-4f46-b7d8-7aef29ab7bd1	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:19:58.348862+00
c016ae2c-4ed1-4255-8b3e-e5bc8c723214	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:21:55.002075+00
f3485a30-ea79-4e95-8b15-d71b4db65673	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:22:53.059419+00
a81bcc20-3f2c-4561-811c-ff1d21988b6d	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:25:16.881933+00
d92540ac-92be-4cbe-9908-6b077e538e7a	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:27:12.995893+00
9505677d-5e19-467a-9007-2ddd8cf22dca	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:31:06.940369+00
6e64f156-a157-4a34-b8ed-c573e51c9ab0	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:32:14.40856+00
50766221-8d55-4273-a9fe-91381ec27b89	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:32:45.456898+00
74d5b45c-7bc5-4f7e-94a5-055aa287587e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 01:34:44.73156+00
4399cbd1-002b-4e63-bbb6-20202443fc97	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:35:37.0387+00
989979d0-89ee-496e-978a-3c80e7ecb377	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-16 01:36:07.605654+00
3919c86b-862b-416d-9b85-2a71fbde1e05	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-16 01:38:27.308891+00
e3eb76b8-eca7-4507-ab60-e42ea9907572	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-16 01:38:59.388858+00
7210eeb1-893a-482d-afc6-cf9285632061	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:41:00.889746+00
87830a6c-2f52-4b0e-b7a1-1efddea64dda	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-16 01:45:04.983274+00
7773ccb7-2723-4d71-b8a1-58c20a4c8a1c	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-16 01:50:57.000986+00
9e652594-d38e-4f7c-a877-55efb38e8947	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 02:22:01.767233+00
51c751e5-22a7-4b44-832d-47df8faffb0f	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 02:24:05.209538+00
15e90457-90e7-4de3-a37e-2dddb1ffe74c	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-16 02:25:36.335803+00
6f2224f9-5b63-4553-9354-141025f65bf2	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-16 02:38:40.509942+00
106b5bfc-befd-4fde-b1b7-b79b213603aa	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-16 02:50:36.595585+00
9d732299-0355-490e-b649-b70506ba8dbf	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 02:53:14.53265+00
4987920c-427b-4b62-9ad4-53fe105c18ad	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 02:56:52.424503+00
61312342-f96b-4aef-8a48-43b12817b247	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 03:27:31.838426+00
df63e391-e428-4567-9eb1-4d69e9c13b09	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 03:30:35.533474+00
220319cb-127f-4cbf-8b68-71e0fdd6caeb	18d08fe3-6f60-4abc-a51e-75360e88d54c	5	earned	Completed spiritual journal reflection	\N	2025-08-16 03:41:47.376505+00
99d836b2-eae3-4e43-a7e5-5fcfa156a6b1	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 04:12:22.05015+00
dff7594a-0206-4744-bf25-67e41199d94c	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 04:15:05.615522+00
bc5216ed-847f-46bd-b143-2381484f3559	9a214089-fab2-4635-9939-affac7bc96f5	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 04:58:48.54026+00
977224dc-6fd9-4e0f-a949-11c05916c2ae	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 4 - Prosperity Stream (English)	\N	2025-08-16 05:03:40.316678+00
265e49bc-81df-4dfc-8c99-db4187c6c008	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 05:55:00.101101+00
e696e3e5-95cb-4249-bb64-21689cb2f9d7	d14df823-5cfe-4698-a0d7-19b2a49ba058	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 06:07:30.765395+00
98d6f7d7-2d68-4da6-a978-360db7cb7082	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 06:29:58.380885+00
53909c2d-6b34-416a-9b51-55a797fd6b87	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 06:32:35.067967+00
d5db2a2b-72e2-46c1-923a-a722b6b9edbc	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	earned	Sent a chat message	\N	2025-08-16 06:35:03.154726+00
d4c4caa2-25c9-4f17-8cc9-4a2d345efea6	9a214089-fab2-4635-9939-affac7bc96f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 06:38:26.932714+00
717e167a-c445-484b-88b1-ca9534ad6d8b	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	earned	Sent a chat message	\N	2025-08-16 06:38:52.115152+00
a6188f8e-acab-4bc5-9abb-dca424770e5d	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	earned	Sent a chat message	\N	2025-08-16 06:40:08.39119+00
94fd7013-d2b3-4da3-933e-b7b7d952e79a	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 07:11:58.173715+00
8a1dc644-96a5-4350-a013-f036868c778c	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	earned	Sent a chat message	\N	2025-08-16 07:13:53.461484+00
0da821dc-8b96-4697-b6cf-4ae0418280b4	22c2ab08-6a42-44c3-b290-dedba2161dd0	5	earned	Completed spiritual journal reflection	\N	2025-08-16 07:27:38.262164+00
3e3fdc09-ba0b-43da-bfc8-8c0c5e2dfe66	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 07:30:26.182542+00
48cf4cb1-ca36-4eda-b9bd-a3f00dc3709e	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 4 - Prosperity Stream (English)	\N	2025-08-16 07:43:29.139026+00
ccf4a3a3-eb6f-409c-9f83-5e1f5a6aaf4a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 08:00:53.378014+00
726b9d04-ff0f-4df4-a2d2-e2e3b306b4cc	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-16 08:04:42.605855+00
dddf6bb7-71b8-4a50-89a8-3682aafdf985	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 08:24:56.976571+00
42f04c3c-4d4b-4878-9f98-59b05e2283c5	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:29:18.708961+00
2b3e7075-ccdb-445c-a9b9-cef13fda6225	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:30:34.458357+00
f1316b8d-e75f-4130-bbab-e60604fd2d1d	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-16 08:35:34.713312+00
86c0b476-2f25-4bc5-8458-e29a3e889ddc	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:38:03.981509+00
93736dd4-5284-4d2d-b44b-2268ecfd224e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:40:43.294049+00
01256bca-2301-4438-9de1-13bf13ddfa2b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:43:18.525472+00
4da4d064-e7ce-4cd9-a035-c487bcb7cef5	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:46:14.873422+00
73ee1fa6-0c9f-41d1-bb20-b484e312b20b	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 08:48:54.835937+00
11b2f57f-62c6-4a51-ad50-b9b23028ceac	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 11:05:07.032836+00
80170f7d-721a-4651-92d4-705b740ed293	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 12:07:25.886213+00
25c61488-8e68-41c8-96c3-b983f099b873	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 13:01:12.147755+00
f7f76c28-976d-43ea-b9ab-f23409468c40	9a214089-fab2-4635-9939-affac7bc96f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 13:18:09.95738+00
8ecb5687-497c-45af-9d3c-003efc54d1f6	9a214089-fab2-4635-9939-affac7bc96f5	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 13:49:39.209655+00
712fcc1b-6605-411a-8cb9-d5016b300c02	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-16 14:56:47.590348+00
67650a19-9860-4e5a-a6ef-097536de3495	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-16 16:02:23.024256+00
1d1a1647-717d-4814-ab9d-61a43f971282	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 16:04:46.423871+00
7a74237f-9bd7-44b9-839c-e663ee425616	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 16:07:11.065705+00
41ac38a6-59d8-45e3-b0cf-d70cd07e08a3	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 16:09:34.63882+00
386e290e-390c-4c50-a0b8-60b1a79f17ef	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 16:53:00.827471+00
00c77706-bb8f-48fc-baf6-201203fccb31	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 17:02:05.318155+00
fdb40ab4-eaab-4ee0-96d3-07c9a90d3411	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 18:47:43.840896+00
9004e32a-13d7-4599-910d-2d286110e8e1	b2803bb9-d737-4420-8eb0-4a6deed56216	5	earned	Completed spiritual journal reflection	\N	2025-08-16 18:49:24.907626+00
d0909709-d033-4034-bd5b-a8488d1d81c4	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 19:04:34.815998+00
619b54d7-61e9-476e-80e2-d154323ef0cd	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-16 19:05:17.71329+00
29121272-1d1a-4dc4-af5c-1cb4d80eefed	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 19:36:10.379194+00
0e840797-8cd2-43d7-831b-234d4c4a1572	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-16 19:37:52.123627+00
b16e47df-ca53-4061-815d-2f2ff462ff67	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-16 23:42:18.67724+00
0f18e11b-0370-4f92-a5cb-2b227b70870f	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 23:45:22.519435+00
47d890f2-eedd-4aec-9000-5a479fb2860c	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 23:47:57.983294+00
42d8faf6-e4ac-40d3-8a81-4489ca7f2b7c	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-16 23:50:27.665406+00
8b0fbe85-f22c-45d9-98bf-121dc548f66b	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 01:36:00.271743+00
b2a507a0-9ece-42a7-a5b2-ecf8111c3f1f	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 02:06:55.053845+00
b04567e1-f2c3-4012-a64e-a7e7a85e835f	38625adb-dcfb-4bac-b473-2e6ee37af72e	5	earned	Completed spiritual journal reflection	\N	2025-08-17 05:43:55.012585+00
3ba0e565-6f44-4b41-aeb2-a35dc9175ee1	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-17 05:45:14.138512+00
65b18f38-3353-4370-acd7-b0c044d6213c	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 06:06:36.792794+00
88e3c5a8-563f-4428-9d60-4078561faeb4	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-17 06:07:22.395962+00
8f154957-ff40-4d5f-8003-5dd58e377440	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 06:33:33.138581+00
fe9dee56-9e92-44ed-b039-f71cf56cb49e	fa12011b-2a8f-41de-9bce-f9b6904d7da1	5	earned	Completed spiritual journal reflection	\N	2025-08-17 06:34:27.760334+00
493df524-d984-474e-9ea9-6d977ed4493d	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 06:37:57.933104+00
a8d5608d-f62a-4d55-933d-b7500929566a	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 07:04:57.319456+00
bb5095e9-28c4-4e6e-aa57-272e61c58325	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 13:41:36.579092+00
c7262bae-0076-4868-8ef7-6688677ee353	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 14:12:13.013591+00
08dbbe03-63e2-448b-bdd5-28c64d7c3e52	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-17 14:18:29.715134+00
8dd240af-6d91-48a1-aee5-5199fda4feb2	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	5	earned	Completed spiritual journal reflection	\N	2025-08-17 14:25:34.728936+00
c42f305d-5596-447a-93a9-9e1eeed3d021	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	earned	Sent a chat message	\N	2025-08-17 14:30:05.249498+00
4a3562d5-b5b3-4238-989b-4d60c427aba3	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 17:51:21.794482+00
4e76e8b9-78ac-4d8d-8f9c-c7dbfb71071a	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 18:43:33.699038+00
3c35881e-b6ae-446e-884f-807bfa0d5af6	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-17 18:45:13.428063+00
3bb7b0fc-d922-4f0a-8c8a-eec5dc75b20d	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 18:55:40.984998+00
b197dd1f-a258-44e4-8819-c2c3af6260d9	b2803bb9-d737-4420-8eb0-4a6deed56216	5	earned	Completed spiritual journal reflection	\N	2025-08-17 18:56:22.001782+00
8160c385-0c30-465b-a38b-4c832fdb91ed	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 19:16:49.398131+00
423ac789-90d2-45d3-b21f-5b5ad3df8565	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-17 19:27:33.08946+00
51af37dd-10f2-4403-aaf5-8db25ecae0b8	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-17 20:16:31.766133+00
2205f5bc-7f9d-44d4-b0b9-dca07c6069df	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 20:18:41.225262+00
70c3d530-e035-4ab3-8a9c-79b85f18d226	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 22:22:49.410882+00
989e721e-13b2-41e9-a161-c5265f809c98	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 22:25:11.238046+00
2f66da2f-0c0c-4326-b003-6a65ecf8aab6	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	5	earned	Completed spiritual journal reflection	\N	2025-08-17 22:29:57.898467+00
bf93e87f-a062-4ec6-98d7-c06cb9aac18a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	5	earned	Completed spiritual journal reflection	\N	2025-08-17 22:30:17.33464+00
2a1e82f4-7685-4156-942d-d2317c31c670	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 23:02:28.143981+00
8d7f09da-1423-4117-82b4-a7b5d5af4eee	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-17 23:09:16.231527+00
d5f073b7-1180-4f18-bc09-83334d79757d	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-17 23:39:56.202169+00
e28b75ce-0aa6-49a4-b53d-8b5905a54b31	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 02:11:41.964229+00
597a7f16-df19-4372-bdfe-53a21e398f25	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-18 02:13:01.882208+00
edbb3c02-eca2-47f5-a72d-a1fe6548c213	271a608c-0b55-4e42-9d13-293ad20e914e	5	earned	Completed spiritual journal reflection	\N	2025-08-18 04:32:11.941996+00
1f792d57-8793-4cf2-8a78-5ab1b0cbe9f3	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 04:35:00.980663+00
ea2914c2-3841-4d63-95ae-8125a71cdb19	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 06:18:45.05702+00
ac94b0f6-e2f1-4ef7-a7d5-253cc7ee5040	fa12011b-2a8f-41de-9bce-f9b6904d7da1	5	earned	Completed spiritual journal reflection	\N	2025-08-18 06:20:07.366166+00
dbca4467-1653-487c-a015-ef972d35c61e	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-18 06:50:27.334012+00
39d00f2e-88c7-4dda-a355-41ec9e815ac6	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	earned	Sent a chat message	\N	2025-08-18 06:55:52.473831+00
209d5eb2-2596-47f4-80f6-97ba9f3a909b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-18 08:03:48.835197+00
cc495555-c5f2-4a43-8288-2adb6940535a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-18 14:47:18.074619+00
44714e23-cdb7-4e97-8d66-48be27f51a8b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 17:15:49.255535+00
b26c13e3-3985-4bb2-ae35-8a4a8fa80a09	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-18 17:16:43.683726+00
1c457817-3de5-43d5-b2b2-6b4b19a51045	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-18 17:48:17.366109+00
a04f3f2d-8353-4d3c-9ea2-9908a5e895ff	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 20:34:54.744853+00
e9b4e3af-f83c-4674-af21-e869db5e24eb	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 20:37:27.10217+00
18f60f80-579a-470a-917b-57c9ede1f314	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-18 21:36:38.223902+00
9cee7cd1-f6f7-4283-a8cb-129deda852dd	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 21:54:30.434902+00
e02752d1-6eb4-491b-bfd8-5ec4ab1a3ec5	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-18 21:59:48.114669+00
f63a7b16-d082-432e-82d5-0075973d902f	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-18 22:05:26.658881+00
5e761699-4331-4b0d-8743-5fac0a9811e4	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-18 22:07:20.378253+00
4d4f7d7b-4559-448b-b64b-a9a471edc576	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 22:09:40.664052+00
fc224fcc-64de-43fe-8ebe-724f710878d9	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-18 22:40:12.741973+00
79f574be-b3a0-4dfa-8501-fdd26d5419aa	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-18 22:44:15.551048+00
08484b95-9c26-428e-8b01-ebdb4250c606	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 22:46:39.884112+00
b170265d-c574-466a-a374-650a0e2a9ebb	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-18 22:49:34.567193+00
a38bc008-3714-498e-9228-09b47e56171f	fec07d17-b3f7-4a71-bd30-711c6d1d0d8e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-18 23:28:34.870108+00
332634a2-785c-46f1-91ef-6e974a620c53	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 01:54:48.491962+00
00d022de-e23a-4458-83ae-b498c4b1f013	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-19 01:55:24.616329+00
1b7223b8-b857-47c5-9114-10d931dc989e	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 03:07:22.747013+00
af2e9aec-58e1-4b4b-8ed9-bff82fb9173a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 03:09:53.927406+00
f13c1a5d-887c-4b10-872c-8a2584e60f6e	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 04:04:19.236889+00
551fd14a-2c75-4cfb-92ae-8d67eb78e7a4	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 05:39:46.984636+00
4030016b-1eae-4876-a5c9-8ef19db0a3f6	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 06:08:28.745781+00
2ef7c276-05c1-4f50-9377-9fb77bb62feb	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 06:13:38.451685+00
831a7e6f-2d94-4c47-865e-dc38003a8d28	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 06:40:51.73923+00
7444d79b-b427-4435-a3a4-541486a23c76	22c2ab08-6a42-44c3-b290-dedba2161dd0	5	earned	Completed spiritual journal reflection	\N	2025-08-19 07:58:27.677702+00
dd2b7200-4254-44ad-9b61-73b50f7c1150	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 08:01:04.930604+00
f3a2d1d9-e831-42f7-b8b0-b3b763e61e27	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 08:31:14.043619+00
3e9deea6-da1d-4d94-97ba-7b577424f90a	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 10:22:32.981371+00
0fd9bebd-c1f6-48ce-be61-b8277309f6c6	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 11:33:05.570646+00
cd66657c-8d7b-4e06-8d08-bb6f7f9e83b6	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 13:45:00.338172+00
fcd36132-1ef9-4a4b-80c4-41c05832d01d	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-19 14:42:31.469322+00
088fef2f-acc3-4e4a-a161-1b3182d3fde9	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 14:46:11.740542+00
39e0f9e7-1b6a-4f3c-91f5-500b3e7d81a6	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-19 15:01:30.301722+00
825f6fbc-cb56-49f3-a988-4f9f60e11aa4	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 15:17:03.729881+00
89db4f91-1d4c-4ac4-9dd4-95cddc050b2e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 15:19:46.7511+00
e91a38e6-98da-475b-a9a6-8ef64071ce79	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 15:22:12.133706+00
be2532a7-d2fa-4a6c-b375-87f4030aa737	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 15:24:52.996513+00
ec6aee84-0c7d-437f-bdcb-b231167e51cb	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 17:14:10.019041+00
8637ca6f-4d28-4f59-ae25-67c41a64afe3	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 17:48:53.327476+00
51d5d886-2a69-4b74-acf7-68e501f5d9d7	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-19 17:54:52.214242+00
0ca8b9ff-75e1-45dc-9021-e34108fb773b	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 18:07:39.132568+00
a06721fc-cf06-45dd-a70e-2fb519ce099c	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 18:25:55.604482+00
85708dfb-8ecd-4896-aa5a-b2d2b1760b56	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-19 22:10:26.364068+00
f1458049-26e6-4418-b3cd-641b63e16a0f	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 22:12:37.175286+00
d795089a-968a-4805-b877-b40bf9ec8ffd	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 22:15:24.441216+00
f890b432-94ab-4428-9d50-1e62596fed30	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-19 22:24:16.319145+00
a5c8a8a7-4c91-4f0b-9d72-119a3698c671	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-19 22:24:34.29949+00
5cb49068-b9bb-4dac-9d26-8dad4d5269e1	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-19 22:58:36.677635+00
0d370e6b-1434-470e-befd-57e88e036603	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-19 23:10:00.867978+00
f8f39ca3-9c04-47dd-a8d9-f7a6b7d5514c	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-19 23:32:32.258147+00
2fd44370-aa2d-4975-a6cb-d4dac1b74d2c	271a608c-0b55-4e42-9d13-293ad20e914e	1	earned	Sent a chat message	\N	2025-08-19 23:36:33.15563+00
f8146836-aef6-4d0a-91b9-272840efab17	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 01:48:04.969233+00
5a947f31-dbbd-44ad-9233-5ae082eabb1c	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-20 01:50:18.91092+00
bffe3127-1156-4e51-831a-186014bb816f	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-20 02:49:43.230346+00
0584867b-e018-4011-83c2-00f62cb3c5fc	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 02:52:06.472285+00
d26f7b0d-be75-441b-96f3-5706ca0aa1f9	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 02:54:50.493697+00
54a68e68-2196-4821-a549-345aaf8accf5	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 02:56:59.154174+00
0d4faa7f-1060-43c5-a450-1c59456ffcaf	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 03:32:06.092573+00
be17e362-41ba-4963-8a84-23f95788f109	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 03:45:52.688019+00
1d697a50-0769-4270-a7a0-e2420eff94c4	271a608c-0b55-4e42-9d13-293ad20e914e	5	earned	Completed spiritual journal reflection	\N	2025-08-20 04:10:31.19858+00
29d3a3c8-57d6-40e4-819e-d254a56fb809	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 05:15:28.342433+00
ecfa30cc-b127-41e5-97c1-d6c2655e0384	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 06:13:51.962903+00
3f68f9df-1adf-40cd-8120-0067ac5511df	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-20 16:46:54.458088+00
4d28451d-4179-47fb-8641-80f4c6f7a65b	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-20 16:51:00.272342+00
b60ab7dc-9d6a-4378-95bd-f80a4a4f1c76	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 18:04:03.940238+00
9d85f403-a664-4c8b-9d1d-19419dad7acc	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-20 18:35:50.80243+00
e66cc0cd-8015-456d-9525-b6a86a27d4fe	a2e8495f-d2c1-4e04-9db5-faa976f59207	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-20 18:55:04.318238+00
fe853377-1e23-4745-a33b-1ff53737bd62	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 19:12:41.579108+00
0ae7009f-7a7b-4ea1-99bb-eebb51a02ade	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-20 19:14:39.684004+00
19351ae0-1376-4aae-957f-2921f0349358	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 19:15:31.956359+00
aeb15972-eabb-450b-8914-d569733b9726	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-20 19:47:17.770969+00
9d4e2a08-3679-4c5d-abbd-db34c64811fe	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 22:52:40.773954+00
451dd0b6-15fa-4581-b550-a6f74cf809ea	fa12011b-2a8f-41de-9bce-f9b6904d7da1	5	earned	Completed spiritual journal reflection	\N	2025-08-20 22:55:02.730015+00
6c0da0d8-2e6c-497e-ae79-f66128325c3f	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-20 23:26:03.358779+00
77713e16-2450-47ac-aa4c-9861a9f018f0	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-20 23:34:54.0435+00
f383c072-b078-483a-a932-d16cf21220f7	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-20 23:37:53.762689+00
8b726b6b-d6ef-4f15-8254-6418c073d552	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 02:15:25.009176+00
01eff489-d72b-44cc-9c76-e503b0a05386	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-21 02:16:06.783785+00
09cb5657-bf4e-41a2-96eb-518c07e95d49	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-21 03:39:06.814319+00
85478917-8a04-4056-817c-00e0c4276d9f	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 03:43:21.65459+00
d90730f4-c582-4d3f-92e9-bd5739f0c057	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 03:46:40.333249+00
4b18c55f-9773-4acf-9783-8d44b9659bab	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 03:49:10.850346+00
67d84910-1ad0-434b-b417-b182457e4fc6	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 03:51:31.949192+00
ac83979d-e180-4163-97c3-002998d5916f	7f29c1dd-39cb-4290-b1ff-d8984002952a	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-21 04:59:52.378205+00
97e02102-9128-4067-b3f0-9deef8984e45	7f29c1dd-39cb-4290-b1ff-d8984002952a	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 05:04:48.385576+00
5199b3eb-a579-4509-ad8f-8d5f49f98c4c	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 05:47:10.172859+00
4c9eaada-0c01-44e9-bcba-105557702f3e	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-21 06:19:33.350058+00
13fa25e1-c58e-497f-90d4-483d4ae23faf	bd1ecf18-a37e-462d-b6b3-f593a979ffe3	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-21 07:33:47.652699+00
4bc3960f-aed7-4247-bfe9-0e44b4fc174f	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 10:57:31.463688+00
d6b1142f-615d-419d-8f66-0248b0f419de	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 11:03:22.143996+00
a6032e09-488e-4473-80b1-9347e7cd2410	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 11:06:43.58365+00
dfceeca8-2cb3-49b9-b4e5-d862677c4ed3	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 11:07:57.185232+00
bb83cf1f-e70a-407f-af3f-27713e4889b9	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 11:14:08.904724+00
774b21be-a2f2-4553-b8ce-9cdeaf9ff577	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 11:37:40.968637+00
9acf3212-08b0-46ba-b2e0-efd11520b490	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-21 15:11:28.274692+00
9180d9c5-244e-4c70-8e3d-69cd6f76825f	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-21 17:19:38.974727+00
0183bae0-dd81-4911-b07e-4e42766b1bbc	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 18:08:52.838502+00
c29e9221-136a-4cc4-8399-6cb8431d25e4	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-21 18:09:51.82051+00
f47f2cca-de4e-43d2-8540-29d332b17e49	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-21 18:41:16.773133+00
62c54970-9bea-4800-9663-7d74cda3298b	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-21 21:31:26.743917+00
6c1b4e4e-467c-4a75-ac3b-be318c4cd734	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-21 21:39:12.786131+00
d38f91e8-936b-4dc1-abf6-5f45cd668f63	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 21:43:00.255596+00
6ce910b7-6104-4f76-a2e0-a1058bb65631	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 21:45:23.769609+00
e8c13628-0285-4ffb-9f22-1fff2cd38434	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 21:50:56.40724+00
c68989d6-e2ba-40c7-8762-123caa1cc134	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-21 23:14:56.91647+00
5185aa84-2678-4a61-9403-86da93c858e7	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-21 23:19:31.214616+00
026977e9-9c11-453c-b124-bf600c096b47	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 00:08:26.627024+00
7a34ab82-cc48-4a59-ad77-ff8187fcab01	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	5	earned	Completed spiritual journal reflection	\N	2025-08-22 00:11:34.708016+00
db30dfde-9b49-4817-b427-cd7d7d1fb267	38625adb-dcfb-4bac-b473-2e6ee37af72e	5	earned	Completed spiritual journal reflection	\N	2025-08-22 01:09:35.009713+00
f4cbcf36-2438-4dfe-86de-a8c025ea8c8f	7f29c1dd-39cb-4290-b1ff-d8984002952a	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 02:04:38.613303+00
2a7816ca-4134-4d9c-b7c1-46ffb1a00917	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-22 02:20:10.351753+00
18faea85-161f-4bc6-af4b-5765e5777fcf	a4d0becf-27fe-4a16-bd74-8aa39fb9578a	1	earned	Sent a chat message	\N	2025-08-22 02:26:40.355046+00
3c2f05e0-d679-4586-a4d7-688c635d152f	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-22 02:29:37.124266+00
41a5b6cd-fec5-42d6-8b5c-4b177c6051ac	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 02:31:53.352885+00
519a3d88-1020-4348-96a6-d14a53969b4e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 02:34:27.699432+00
9e24fdab-ce9e-4536-abc2-8035d03be952	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-22 03:28:19.125645+00
5429b0ba-605c-42ef-9611-c5cec4aef045	c644f60a-2f41-41fa-8814-b698c5154474	1	earned	Sent a chat message	\N	2025-08-22 03:30:57.540421+00
4d4c2ece-51d3-49aa-96ef-9a28cb5bbe94	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 04:15:50.900716+00
60c4623e-37cb-498e-af3d-b5f56b336fed	f6492019-02bb-4783-b172-53f7e71bdc5c	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 05:32:39.394244+00
cd4ed914-d8a6-4517-9099-6b7519fba752	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 05:42:34.191769+00
bd7a2047-f47c-4613-b531-3183724a34aa	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-22 05:43:06.254961+00
e8ec311b-4a8c-4bf1-b838-265150771709	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 06:13:37.86894+00
01976141-b148-4876-9cb5-ad2627d7301a	74a895f6-e11e-47a6-b4d3-a89092905776	1	earned	Sent a chat message	\N	2025-08-22 06:16:05.824592+00
e5e8d303-f7c7-4f16-838c-c13811cdba74	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-22 06:25:09.891476+00
6f184ace-8f02-4f68-84e3-20e51e8dcbe0	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 06:27:17.084316+00
5f4cf091-da81-454f-abc3-19da0839e54f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 2 - Lucid Beach	\N	2025-08-22 07:16:31.421395+00
255dcb72-ae60-444c-b43c-0c9771e559a0	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-22 07:23:12.705057+00
8f2f96d2-247b-44b9-ab8e-8bc4775b433b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-22 07:24:33.071881+00
4b961857-580b-4a56-b5d3-7fbe5c31ddbb	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 07:27:27.169423+00
abba7a92-b193-4a48-bf5d-0e8759368fb2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 07:29:43.984928+00
aacf8ef4-f14b-4215-8342-fa37dd08f56f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-22 08:07:25.344415+00
9db33767-145c-4bfa-949b-e40223964c96	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-22 09:41:12.276964+00
6080fb7f-09b4-4808-9e35-c7df58ea2522	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-22 11:03:30.508777+00
ae19cf1f-20e6-4421-b997-71ea31e277f3	bf17a1f6-2629-45d7-b836-9453c259b308	5	earned	Completed spiritual journal reflection	\N	2025-08-22 14:19:20.788017+00
eca9b23b-fb47-4f29-ae99-688472d54d78	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-22 14:53:09.137284+00
f66d0ebd-3c0a-4852-9597-2c11e51300d6	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-22 15:05:53.913858+00
08e4e175-6194-4d67-8c36-027ad23de681	1424b737-4447-4ced-835c-ad9d50ec255f	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 15:25:52.576182+00
09b7b506-1b7e-4185-af6d-94a51d603fee	b464e576-8fe3-43cc-bf22-d983edeebb5d	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 15:30:56.018346+00
eef2254f-0cf3-4483-b421-834c3223bb4b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 17:43:55.002818+00
d6e21d6d-932c-418f-916c-9439157335ad	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	5	earned	Completed spiritual journal reflection	\N	2025-08-22 17:46:45.019773+00
f4ceae51-c08a-4797-865e-3d6d1861df83	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 17:46:59.919223+00
e9082434-a97f-4ecb-9648-21597acea869	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-22 17:49:00.654526+00
c0d436e8-5e91-4ecd-95d6-9163b46fc015	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 17:51:26.87911+00
a9498d4f-5bbf-42ca-bfaa-1d1a5fd8d09a	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 17:54:53.005656+00
a898b865-385d-434a-a553-fcca69d4a6a6	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 18:56:13.77412+00
b0f11947-5523-41c8-a484-a85aafed8ca1	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-22 18:57:14.772688+00
09cd6965-034c-4cc8-afbe-9758d57ef4b9	1424b737-4447-4ced-835c-ad9d50ec255f	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 19:32:52.911015+00
76d6e007-8df9-4392-9f8a-6da74f9cd400	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 2 - Lucid Beach	\N	2025-08-22 19:33:02.799334+00
a74766cb-9c00-4850-be32-2c732c9c6c3f	1424b737-4447-4ced-835c-ad9d50ec255f	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 19:35:35.957322+00
6cc2fe72-f739-402c-b049-86ae5e3c4114	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-22 20:07:31.740996+00
40ff161d-e29f-41f9-a8d1-ca1b62c944c0	1424b737-4447-4ced-835c-ad9d50ec255f	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-22 20:09:24.301726+00
3d8f05fe-dda4-4320-b359-81b1884ce49f	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 22:45:03.093759+00
1f7c99fb-14f7-4141-b98d-7d7ba97b18ee	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 23:01:21.450994+00
fdf8f93a-43b2-4879-9c19-7d650e2277e0	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	5	earned	Completed spiritual journal reflection	\N	2025-08-22 23:02:14.848552+00
b3e73f46-aebf-4b46-a7f0-c60c3d6f034e	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	earned	Sent a chat message	\N	2025-08-22 23:07:05.753239+00
d217f085-5ea7-49f7-b201-cbfa302ab7a3	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-22 23:16:04.71082+00
5d9a67e5-cbd9-4e98-bbd8-700a9df2c83e	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 23:19:31.818251+00
fd3b2515-c4ca-485c-8024-b8e933d7b65d	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	earned	Completed Guide to Inner Silence	\N	2025-08-22 23:45:33.379607+00
c43c7fcc-08d6-4fe4-aea7-59808cd6e2cd	fa12011b-2a8f-41de-9bce-f9b6904d7da1	5	earned	Completed spiritual journal reflection	\N	2025-08-22 23:47:34.419443+00
a49b5611-1211-4c82-b992-9ceb0050e583	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-23 00:08:01.945322+00
ce63d6fb-7e21-42ee-94a0-9ef0c38b8677	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream (English)	\N	2025-08-23 01:00:16.631158+00
1c087696-2815-460a-a169-6a1012736520	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 01:02:52.805938+00
2b8662af-efac-46cb-802c-ca7baca5966b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 04:34:24.733331+00
2928a4ad-4864-419c-9c2f-f0a970195fde	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-23 04:35:08.407102+00
87116808-b25d-448c-b4c6-a677c433847b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 05:07:02.115025+00
b4213447-7ac9-4353-b0e7-ee37886c7978	267439bf-0c66-4a47-b1ba-26ab611eea78	1	earned	Sent a chat message	\N	2025-08-23 05:34:31.98811+00
68a58645-9a2d-40d7-a861-fdbbce088b2a	267439bf-0c66-4a47-b1ba-26ab611eea78	1	earned	Sent a chat message	\N	2025-08-23 05:34:40.164408+00
e64ffe8c-b8b6-4c53-9227-ff96582b329e	267439bf-0c66-4a47-b1ba-26ab611eea78	1	earned	Sent a chat message	\N	2025-08-23 05:35:08.829674+00
3a3444ea-d769-4d6d-98e3-1c39d9e795ec	267439bf-0c66-4a47-b1ba-26ab611eea78	5	earned	Completed spiritual journal reflection	\N	2025-08-23 05:37:56.547218+00
7620b4df-ed68-4700-b917-24e2e6c3b539	267439bf-0c66-4a47-b1ba-26ab611eea78	5	earned	Completed spiritual journal reflection	\N	2025-08-23 05:37:56.556744+00
50efe8bb-74ed-4847-ac9b-c38bf71513c1	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-23 05:42:32.602576+00
a7f86526-7763-43e6-bfc7-2babf23b448f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-23 06:21:12.962776+00
6ee63324-edb6-49d8-94d3-5407f9f5a85d	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-23 07:33:24.338853+00
b3f2b638-3c8a-4eb5-acb0-25b7af4cdc1f	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 07:35:34.010033+00
646d4a49-790d-40ab-8a03-297a4009b436	6c75dcb7-c195-4940-a134-712ba6641ebf	1	earned	Sent a chat message	\N	2025-08-23 07:36:20.352554+00
383d5a7c-ebdc-4f1f-a4eb-48576ad862d6	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-23 08:33:55.716858+00
423b8a6b-b40f-422b-b439-b740325d3f10	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-23 08:36:54.460042+00
8d58646f-13e4-47d6-8008-796011e9f798	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 08:52:11.725731+00
e899dc56-c469-4f8a-9076-2590548d5004	a695e42f-5b3e-4c5d-b462-97910d15fdfb	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 08:54:18.577705+00
f101afd3-fe0a-4229-b2f6-46ee98b2af8c	a695e42f-5b3e-4c5d-b462-97910d15fdfb	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 08:56:26.762191+00
86620659-bfe8-40c7-8c62-74260ca0aa94	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-23 09:54:51.008915+00
ba45bf8e-b886-44fc-85fe-8778168c9c39	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-23 10:17:59.527547+00
ce3b8594-a245-4b05-a539-fa4e62710ba2	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 10:35:11.956439+00
96da864b-888e-46d7-9175-0cb5c2b222d7	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 11:05:18.494889+00
d941b423-ef62-4f0a-bea6-880764661511	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:08:02.137724+00
a423285b-0678-4ecc-8467-b6a2dc4b8794	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:10:21.956249+00
d83b7ba0-e177-471c-beda-b2643596fb0c	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:12:44.865377+00
1d3ba739-380c-4e72-a3cb-6cabfd749ab7	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:14:50.477668+00
4deecaee-bd80-4ae3-a2da-c2df1703de85	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:17:09.958978+00
43011900-193d-44f7-933f-882d9e8ac498	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:19:17.282347+00
5f6bc067-fd70-4c8a-80f7-d780be41ebb7	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:22:03.613438+00
f4b8c48d-ae31-4892-b0ba-9bc61d46786d	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 11:35:19.025723+00
467e98e8-b761-4223-8141-d42895106f19	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 13:29:35.373937+00
84583140-91f2-40aa-9240-569718c8c0bc	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 14:03:04.128537+00
cea28be3-1632-45a0-ad5e-902318d4a937	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-23 15:01:41.291302+00
971e5ffd-a92a-495d-a907-27589811a28d	a695e42f-5b3e-4c5d-b462-97910d15fdfb	1	earned	Sent a chat message	\N	2025-08-23 15:23:27.93946+00
da258806-77b5-4350-9c7f-9302346408a6	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 4 - Prosperity Stream (English)	\N	2025-08-23 16:58:35.957438+00
2f81ab17-8958-4492-9058-6510b71ce625	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 18:23:54.52986+00
c18d0f25-75d6-471e-80df-bdbe55f5f77f	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-23 18:24:46.945197+00
ca9e0126-cc97-4e8e-9b56-bc17207114de	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-23 18:46:52.830203+00
c389874d-2007-475c-924c-ae682e0123c0	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 19:13:16.202738+00
5607d799-f27a-4612-91a9-88bde5bc21c0	a695e42f-5b3e-4c5d-b462-97910d15fdfb	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-23 21:48:58.471264+00
6c60cad8-ceeb-4f6f-93f7-4cfede3e68b3	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	earned	Sent a chat message	\N	2025-08-23 22:37:44.11441+00
bb7311af-0e23-4f59-b5ce-13cd529c8e11	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-23 22:42:57.902556+00
d4c0b424-c6ac-4bb6-bce9-acd9b0f4f5ba	1424b737-4447-4ced-835c-ad9d50ec255f	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-23 23:05:43.634091+00
ba557591-99f8-46db-ae2e-611a75007e59	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-23 23:07:43.229657+00
5fcc7748-201b-4c5b-86b9-b08a717c4584	38625adb-dcfb-4bac-b473-2e6ee37af72e	1	earned	Sent a chat message	\N	2025-08-23 23:12:54.310384+00
1a679c07-6a28-47ed-8bb0-b48fee6fc7fa	38625adb-dcfb-4bac-b473-2e6ee37af72e	5	earned	Completed spiritual journal reflection	\N	2025-08-23 23:14:35.683185+00
19204726-96aa-4d03-8f9f-0828e8e95c3c	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 23:20:52.225093+00
1db362d7-f1c7-4a0f-9e1b-b4987cb5efae	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	earned	Sent a chat message	\N	2025-08-23 23:22:14.583198+00
a60db251-ac40-454b-ac85-585842157734	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-23 23:22:40.719744+00
7d4ef564-8bae-43a2-b555-41825211389f	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-23 23:37:55.461939+00
832388f6-98df-4b4d-8ff3-44a68eab307a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-23 23:45:02.247588+00
c364654f-18ad-4202-b1fd-c2ea89ecc31d	a695e42f-5b3e-4c5d-b462-97910d15fdfb	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 00:04:49.689181+00
77265ffb-ffbc-4007-bf7f-7f45afbfb825	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-24 04:47:16.943504+00
fc073b10-f576-4ba3-b6bf-0bf7a9b4df6b	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 04:54:30.366614+00
331dc520-3a12-41ef-ae4a-97bb9a7d45d6	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 05:01:01.894749+00
4a947f6d-c2e1-42ff-b7b6-4b28c7086f35	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 05:23:16.061978+00
3f624b4e-0aa3-4ac7-b16d-e707d2a6f7b1	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 05:24:05.705086+00
f1a4a77f-aaa3-4a55-a8c9-8b45dbd69b64	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 05:25:36.965628+00
0a006948-6eb7-471d-9cf4-7f19b0662e4d	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 05:26:45.89836+00
ae20b4f6-5fa9-42c3-ad2b-5ea51f94ae68	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 05:29:56.401856+00
650f375d-202c-43c9-89a0-2546fd3c7750	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-24 05:37:23.777136+00
7b5bef89-58e3-4365-bbb0-d52a0966ee7b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-24 05:44:28.262604+00
8c0d5577-ce25-47d5-8ca0-9530bc1832ab	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 05:49:28.634992+00
0437ea8b-9b6a-436c-a249-170e07b229b7	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 06:38:38.222721+00
1127cac5-5748-4702-aa5f-77ee6449bef3	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-24 06:44:13.209716+00
9389e0c8-6321-481e-86bf-cef3778e2d57	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 06:46:32.640897+00
1eb82cb8-f9c6-46e1-ad73-88d613bac3d3	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 06:55:41.879483+00
11f0b61a-b5c8-43c1-9fb1-1a0740e1c3b9	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-24 06:56:34.023977+00
cace3cf8-6a1b-42ad-8357-f2d10aed5fb6	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-24 06:58:44.443163+00
36e9edd1-89b2-4d12-a9ca-e503494bcd5f	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 07:01:00.447909+00
57d2b7c8-ec9e-4ea1-afc0-f301c3e73aa8	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 07:38:09.021505+00
3b7298a0-4421-4574-b3b6-b34c772de54d	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-24 07:59:46.045601+00
d49081dc-bb01-4038-b1c5-1553ccb1f679	92210ba9-cad2-4439-90b2-f8b6723b4bb5	5	earned	Completed spiritual journal reflection	\N	2025-08-24 08:07:26.922774+00
2d5e16d6-9500-453a-861a-52b82d8c3334	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 2 - Lucid Beach	\N	2025-08-24 08:43:46.565354+00
8e78b8f7-21bf-4345-9352-3ad77b3ad2a9	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-24 09:02:09.633568+00
0a5147c2-d775-4db1-a395-3993d29b6a6c	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 09:53:46.75617+00
23a65c4f-953b-4d69-8789-0212f2aa3170	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	earned	Sent a chat message	\N	2025-08-24 11:49:03.343107+00
e0513ab5-d5ad-4954-bbf4-448ade79822c	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-24 11:56:29.747078+00
e4dd6433-011d-458b-bfa4-c7644ffed436	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-24 12:34:49.305112+00
f0c4beee-f10f-4099-9142-86a89ff2378f	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 12:37:53.33077+00
f7a1d5d8-bc24-4ff7-8076-864ecf208e31	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 12:38:34.713186+00
2181150d-0b47-422d-a7b0-80ba1412c8e6	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 12:42:13.523774+00
c6f268ad-b6b1-44d2-be71-468297e336cd	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 13:07:43.276508+00
7ce2066a-4901-487e-9b60-781ea18c9f08	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-24 13:18:11.117602+00
7a04514d-39d9-44e6-b9ad-c4e7d97a4227	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 14:05:38.044285+00
2365cdbc-fae4-4279-8bf2-88613993d430	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-24 14:19:08.076694+00
aa187301-1f19-456c-96c4-ff4ba86dc35d	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 14:21:15.764653+00
91df5c7e-ae3c-4f7b-93e6-97f50f47d4e8	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 14:22:02.872548+00
b7b04d5b-77ce-450d-a45c-b6e0f1d85325	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	5	earned	Completed spiritual journal reflection	\N	2025-08-24 14:22:33.123883+00
0ccca12d-2255-43ca-9ffc-b3859bebd180	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 14:36:51.364097+00
1c9c17d5-8739-4cb8-aa42-91729f7c232e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 14:43:13.912307+00
30441efa-327e-4020-a8e1-06918de08f5d	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-24 14:56:09.420956+00
ec263f8d-f001-4654-b2a4-03afbe021112	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 14:58:28.704336+00
39d9a96c-8c65-4307-ab6e-509b0e2cc624	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 15:00:46.040869+00
93d5c3ad-437e-4514-b830-30c8f8042184	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 15:04:12.670629+00
508ace0a-ef39-478b-b27f-112e40ad6633	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-24 15:09:53.257594+00
70b4b05a-6201-4902-a1fd-3264941d3d36	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 15:26:26.599838+00
24890e54-e9b1-483d-a074-e631fb8fdbd4	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 15:29:24.271293+00
1ebb3801-6851-4a13-ad87-71e56258778e	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-24 15:38:27.979628+00
87203839-8220-4cc4-90e5-c494c28898a2	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 15:41:26.442551+00
5dceec65-95b4-4f53-b486-5256f78fbd44	ace95bc7-7dfa-4840-ab5c-e344a0054aac	1	earned	Sent a chat message	\N	2025-08-24 16:01:18.138782+00
23531569-4254-4080-9052-ef60f2dc36d0	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 16:04:28.218005+00
945e4971-23f3-4dd4-a04c-85478cb3db00	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-24 16:22:22.262959+00
2dd03655-085e-466d-b7f0-44c30e99d5cf	608aecb8-f54d-4efd-9aed-19e921a89244	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 16:46:01.234537+00
7c281760-60e9-4690-993a-882ca45fb70f	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 17:16:43.975252+00
5982e035-bf2b-48ac-a4bb-d1f5efff9c95	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 18:09:26.685452+00
6195345f-be92-4966-9201-784c93f3f8d4	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-24 18:10:45.642978+00
531e77d8-a949-49d9-9f23-6deeabdd142f	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 18:33:10.599508+00
8a1e0e32-59f5-4d87-a095-2c6a3832631b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 18:57:10.275103+00
b083af0d-c3d8-448f-a7da-81f520b288ff	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-24 18:57:55.628373+00
32e36fb1-8a7e-4ba0-8f1a-13b53acb86fb	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 19:20:20.485063+00
3c03a6ca-dc94-4780-8a14-9ef8c1bd354d	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 20:39:37.251235+00
8c4cbd2d-765a-4844-a0a5-169199cee488	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-24 20:41:16.558049+00
33895357-2b08-43da-8044-50cf9fb0ce15	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	earned	Sent a chat message	\N	2025-08-24 20:44:33.526058+00
cbaa0845-1535-4436-90b3-7a3fc0517a9e	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 22:43:55.469757+00
bf997c02-63bc-4111-a605-2d17f42777c0	b2803bb9-d737-4420-8eb0-4a6deed56216	1	earned	Sent a chat message	\N	2025-08-24 22:47:00.549218+00
d306e424-10be-4041-91ad-d2c65c762c4e	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 22:51:08.375865+00
5b404c30-64ab-4238-9378-d50937827904	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-24 23:08:16.711639+00
26d61c09-5695-4c80-af01-0371bafbf9ef	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Guide to Inner Silence	\N	2025-08-24 23:18:34.784336+00
df646f9e-0a7c-42c5-b464-1eb83217b39a	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-24 23:39:35.950759+00
4e9ef320-78fb-45a9-b5d6-fd92c98dddf7	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 00:04:29.681831+00
e6b0d132-73b3-43ed-815f-5e4b48582090	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	5	earned	Completed spiritual journal reflection	\N	2025-08-25 00:09:26.81576+00
d4d08fd8-28a4-4e3a-9df4-9e050ec6a306	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-25 01:39:24.52802+00
2d3f9a39-4506-468b-918e-eafeab5d3f56	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 01:41:38.868871+00
ce1dcc1a-fcaf-4eba-ba61-f8fdaf9a251a	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-25 02:03:48.013798+00
78738f9b-2c4f-42f4-857e-15e0fa58d2d7	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-25 02:05:50.414426+00
7261c210-4766-4a0d-ae67-e0f8b9a26149	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-25 02:08:47.128415+00
2cef81c0-0ff8-485d-b4b2-a52e926e26a8	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	earned	Sent a chat message	\N	2025-08-25 02:09:55.121704+00
e9ef0504-f134-443e-bb47-d715bb3b0859	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 02:12:41.634943+00
6fc4ac99-8df2-4b2f-ac05-cd1b2173417e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 02:15:12.354755+00
2f8ddc40-bbc5-418a-b07b-2df475887a88	6c75dcb7-c195-4940-a134-712ba6641ebf	5	earned	Completed spiritual journal reflection	\N	2025-08-25 03:10:18.201675+00
80315adf-f0a3-4581-83c7-a02d8171d68c	6c75dcb7-c195-4940-a134-712ba6641ebf	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 03:12:24.54876+00
8ab619bd-ce96-4ae1-97dd-8c6ff8c7826b	b2803bb9-d737-4420-8eb0-4a6deed56216	1	earned	Sent a chat message	\N	2025-08-25 04:57:29.73035+00
17d39d1a-c9ee-4a77-a842-0a2e52e19f6b	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 08:37:07.518002+00
c5824932-c6ac-4eed-8789-47a117f777e7	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-25 08:38:42.305965+00
15b58869-d45c-40cd-a6f1-b2a7cb38e101	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-25 09:28:41.056494+00
c0f14a63-d0ce-4b63-a01c-30653c7fc6d6	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 09:31:14.624801+00
3187d5a8-d118-4645-9ecc-416d58a42ed9	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	5	earned	Completed spiritual journal reflection	\N	2025-08-25 10:09:57.883987+00
5b7effb8-e191-4508-8d84-1d1743729282	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 12:35:16.179992+00
4cca9ece-4c82-4a18-a7fe-b323a9bf4a73	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	earned	Sent a chat message	\N	2025-08-25 13:07:45.186405+00
b0161915-5237-4d2e-9d14-d4c3a1c748a2	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-25 13:08:38.042929+00
2de728d4-4d2c-441f-8db9-0edd304f8c66	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 13:25:22.36661+00
1d797d8a-949a-448a-8695-88c13a37bb83	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	earned	Sent a chat message	\N	2025-08-25 13:28:44.308709+00
43cd234a-ec4c-4563-b37b-3412b3f56653	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-25 14:30:58.175948+00
ce1af27d-2903-44a2-94b6-392b4a07cf3c	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-25 14:42:31.604958+00
c9ae0071-bce9-474c-a5dc-b15741a987a3	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Verse 3 - Syukur Meditation	\N	2025-08-25 15:47:35.156057+00
568a1dbc-13a6-485b-a0e0-d1fd0f33a89b	92210ba9-cad2-4439-90b2-f8b6723b4bb5	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 16:00:38.90021+00
a328651a-ca72-434b-b353-fdc2ea44aad8	b2803bb9-d737-4420-8eb0-4a6deed56216	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 17:08:53.063671+00
1eeff55d-2ede-446c-93b8-6ec16abbd464	f6492019-02bb-4783-b172-53f7e71bdc5c	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-25 17:26:30.622078+00
2b670f79-ed17-4d76-aaa0-ce41ab452751	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 17:32:48.502952+00
7453fbcf-8f52-43c2-9a3a-1b1ca1924f8d	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-25 17:33:41.663072+00
57504005-dffa-4dba-a9bc-8be58e212629	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 19:01:19.326949+00
41969cf5-9dc0-476b-b722-71d1b3a8ff26	22c2ab08-6a42-44c3-b290-dedba2161dd0	5	earned	Completed spiritual journal reflection	\N	2025-08-25 19:03:11.684748+00
27745464-9bbc-4644-b41b-91346be3dce8	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-25 20:45:29.823835+00
bce5bf9e-1a98-480e-ab6d-30bc32d0e0ea	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 20:54:52.200319+00
bb25aaec-e9c1-4060-be30-51740014eae4	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 22:07:45.820712+00
5108fbf3-a116-4268-9963-33af3049c5ed	b2803bb9-d737-4420-8eb0-4a6deed56216	5	earned	Completed spiritual journal reflection	\N	2025-08-25 22:53:05.588991+00
dfc3919d-a7fa-43d9-abdd-40d4c81012f3	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	earned	Completed spiritual journal reflection	\N	2025-08-25 23:01:37.002569+00
b8b8f0df-00f3-40f7-8338-ee02e29fa1c0	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	earned	Completed Guide to Inner Silence	\N	2025-08-25 23:04:30.832766+00
0702e6e3-4437-49f1-b8ae-1bfbaedbf127	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 00:06:26.052548+00
597fc779-4549-4d5c-9416-a9f9e87d84d7	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-26 00:28:28.353832+00
cc4c3767-916b-4631-a699-7deb29c591f4	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-26 01:19:15.551608+00
ac8b4c0f-a025-4a30-b655-5d69e2638f55	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 02:40:12.765578+00
cceb8017-0be2-41f1-bd78-bd9b200449e7	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Guide to Inner Silence	\N	2025-08-26 02:56:06.071264+00
4cc23a52-3f47-4f5a-9cf8-9cbc080f8a87	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 03:05:41.610741+00
8c156b62-ae16-4d10-be14-6b32b89b9acd	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Guide to Inner Silence	\N	2025-08-26 03:34:38.778877+00
f4ae25d4-636c-4a11-8a09-ac1755a369a3	74a895f6-e11e-47a6-b4d3-a89092905776	5	earned	Completed spiritual journal reflection	\N	2025-08-26 03:35:15.725532+00
00ec5ee5-cb59-489f-ac93-a915ae1e3690	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 04:20:45.2249+00
64c4f5ec-f35c-4cb4-8006-a4aaa5c27fe2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	earned	Completed Verse 1 - The Space Hill	\N	2025-08-26 06:10:47.795+00
96778f45-1f47-46f6-b77a-57c59ed259fc	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	earned	Sent a chat message	\N	2025-08-26 07:07:04.203762+00
1f2e8695-b164-48b6-8557-e9cdab2f8756	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 09:37:14.324884+00
a52a65f4-e6d5-4b0b-ba1e-75a28197a2b9	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Guide to Inner Silence	\N	2025-08-26 09:41:08.856431+00
76da9e4a-2ff4-403d-8a98-6defa2192ce8	74a895f6-e11e-47a6-b4d3-a89092905776	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 10:09:10.041206+00
8b0193d6-5326-4afb-b016-12135a718c04	f6560fca-177d-497f-9225-a597ed888589	10	earned	Completed Verse 4 - Prosperity Stream	\N	2025-08-26 11:33:42.119636+00
d9d51bae-c6c6-42a2-936f-51520788913c	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	earned	Completed spiritual journal reflection	\N	2025-08-26 13:04:57.592675+00
fc022f9d-5c96-410b-9c00-aa587de19037	271a608c-0b55-4e42-9d13-293ad20e914e	10	earned	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 16:42:21.260253+00
76d29cd3-b810-4510-a73a-b8eed9e3e67d	d079c984-0ba6-442e-8ebe-73e064b8bf3e	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-26 17:37:38.21719+00
38898f0a-fdb8-4502-9d84-281d2aa1ca42	d079c984-0ba6-442e-8ebe-73e064b8bf3e	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-26 17:38:39.954692+00
e1e1255e-08aa-44fe-93ed-e2331f0c1e4c	d079c984-0ba6-442e-8ebe-73e064b8bf3e	1	chat_message	Sent a chat message	\N	2025-08-26 17:41:16.535979+00
d0f63632-c5f7-49cc-b52b-5fdccb828415	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-26 19:12:15.603417+00
1142750c-ebb5-4059-9f9e-b3b29773f5bf	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-26 19:12:54.638912+00
4f3d4b51-425a-480c-a8fd-f8da9b25307d	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-26 20:04:00.32182+00
3073f05a-4bd0-4156-9080-305e8c4ac445	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	chat_message	Sent a chat message	\N	2025-08-26 23:08:40.501663+00
137512f3-3f01-4f01-b6d5-262bb7c2cea1	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 04:09:04.63553+00
5b68b457-4b66-4821-9afe-be9774e5ffc7	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 04:09:37.475877+00
1b321f54-0550-40d8-8950-79aadf0389ca	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 05:14:02.923138+00
c58353d7-9065-4587-91cc-00d2c21da8f4	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 05:17:13.335299+00
c7072c3e-b05d-4568-90c5-3bb3ac2505d4	d079c984-0ba6-442e-8ebe-73e064b8bf3e	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 05:47:45.811622+00
8ddea83e-9c37-42d5-99e8-c0b798e44eae	d079c984-0ba6-442e-8ebe-73e064b8bf3e	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 05:50:20.926074+00
1dddd8c2-d5a7-431d-8f8c-2b73c44590c6	f6560fca-177d-497f-9225-a597ed888589	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 07:36:40.507984+00
6126294e-ec8a-4001-9f53-b1e5d36651e5	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-27 08:04:03.942981+00
27f72df6-a89d-4cfb-8a0f-64ef893975f2	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	audio_completion	Completed Verse 1 - The Space Hill	\N	2025-08-27 08:58:45.544868+00
fe53950f-3498-4964-9339-14da8f08b38b	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-08-27 09:16:55.976601+00
25b7e03a-713f-4c28-a9a4-120f595b037e	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 09:27:29.998078+00
64bd3dd1-a05f-41ab-a364-356ca6225dc3	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 09:57:10.171783+00
60ad5916-efa8-4ba5-a961-8f32b0326f01	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 10:23:37.743496+00
190041d2-f9bc-4751-90de-478b8e09236e	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 10:27:13.9272+00
ac1a31c8-c44f-4989-8e8f-c63faa0684dc	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 10:41:24.129157+00
5d97bee9-13b8-40c9-95b5-c50a4630c05f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 11:17:35.692889+00
7967160a-4b2d-4f5c-9e91-3494a27557f1	b2803bb9-d737-4420-8eb0-4a6deed56216	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 11:45:29.781788+00
44e7800d-8514-416a-81ea-dd77d7e2ea50	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Verse 1 - The Space Hill	\N	2025-08-27 12:57:24.625369+00
5b165c1b-8330-479e-9265-bddbba8075a5	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-27 13:11:04.869292+00
7396c9e6-e3b1-45e0-b81c-096f312940e0	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-27 13:11:25.664339+00
c4a2cecd-0ea6-4f8a-ba89-0ed5343799ad	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-08-27 14:02:33.352577+00
1f5c6772-4916-4ff9-96a7-e6136ac0ca6c	ed289706-acf5-4af5-9301-2bfb0128f0f5	500	admin_bonus	Manual XP award	\N	2025-08-27 14:50:56.444188+00
70867f38-9275-4f91-b7b6-ac3bc40de55d	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 14:51:35.687245+00
0598da91-cbcb-4e4a-b9e8-bc718cf8312c	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 16:05:51.033047+00
dd751f50-e881-4e00-a729-d2cad109895a	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Verse 2 - Lucid Beach	\N	2025-08-27 16:42:00.009387+00
c31796db-14f0-4fad-8a56-15bdbd9ed21c	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 16:46:48.231785+00
37737c14-30cb-4f4c-8147-c875cf318bef	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-27 16:48:27.889972+00
190ae2db-c9b0-47d4-bc2d-0aee0dc453cb	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-27 16:48:53.142196+00
2cc201b8-5633-45c4-9f49-8f527eb13eb2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-27 16:49:48.289464+00
021eff7e-daa3-475d-8751-ac0d78c445e6	d079c984-0ba6-442e-8ebe-73e064b8bf3e	200	admin_bonus	Manual XP award	\N	2025-08-27 16:54:35.854882+00
c9212da0-29c5-45ad-9929-702631d7d826	271a608c-0b55-4e42-9d13-293ad20e914e	10	audio_completion	Completed Verse 1 - The Space Hill	\N	2025-08-27 17:11:43.907302+00
a47c262e-1c58-48a5-af7c-26d891f5d144	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 18:29:45.562784+00
a9ecda96-7781-4794-bb71-e972eef28a04	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 18:30:26.180878+00
bd5cf31d-4dce-46f5-8894-a362a3cbb312	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-27 19:18:04.887366+00
f08bd3d1-6659-42e9-9729-37357c1b0d8f	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 21:53:10.480073+00
cfbda3cf-ce9d-4234-8031-450be6095634	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-27 21:55:11.420696+00
89a33b18-c3ef-4789-887f-0466b2d31aad	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	chat_message	Sent a chat message	\N	2025-08-27 22:28:53.879613+00
5a83e0d8-113d-4355-a141-ab1cd98a8b74	b2803bb9-d737-4420-8eb0-4a6deed56216	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 22:53:20.071912+00
ad1b4837-89c2-42e1-bcb1-b667cabd7f59	f6560fca-177d-497f-9225-a597ed888589	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 23:00:18.352415+00
8f9d2186-73fb-409f-91fd-ba8d81606141	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:07:58.428477+00
cb372d43-f736-4ce4-a60d-99292bcc49e2	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:22:31.948955+00
9136c6aa-2404-4d47-9151-a741f612eeeb	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:22:53.650739+00
20370cd3-6a8b-4051-9b5c-342a63a35a41	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:34:57.485237+00
0eab5719-603b-4753-ad20-04c6d427899d	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:35:06.970476+00
4a5cc68a-07ec-4b51-b6c6-61b3a952a051	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-27 23:36:02.372701+00
244d0950-c2e7-4977-b542-c5b6f49327bc	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-27 23:37:35.113351+00
f891cf54-3372-40b1-be67-37c28edc6c47	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-27 23:54:16.092876+00
052420aa-dcf2-4813-9c10-47159228b300	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-28 02:07:05.755578+00
6676f1dc-6d86-44a7-8925-dc7059f0cba1	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-28 03:09:28.349605+00
cff3b7f5-5b10-4367-ad5b-4c1b6d13491f	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 03:38:16.025452+00
80b75905-1115-4302-8179-83dec353f567	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 03:40:42.955353+00
69f17f10-fc56-460f-955f-25d4911feb7d	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 03:41:36.087969+00
d9c63ec7-2d32-4be2-8271-33e97bd476b2	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 04:07:38.986896+00
6f36496a-44f7-4576-af46-71e2996d317d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 04:21:06.193871+00
bff8e6b7-8ee2-44e9-9cf4-975f2740800d	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 04:23:49.722321+00
05f24c5c-3b46-4774-aaed-8515497184e6	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Verse 3 - Syukur Meditation	\N	2025-08-28 04:38:40.061319+00
b3fb4162-4cd7-4f5e-99f5-75f9e3c372d8	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 04:39:36.745406+00
70b2c229-5484-4491-837c-eb91ecdd6213	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 04:46:52.738706+00
9f332e27-f910-4478-9fd1-b101fedb0b7e	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 05:33:07.511996+00
cf814def-1044-4a3d-89ea-e60804f4e0af	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 05:36:55.050137+00
8ba128e8-bbf7-4b60-b523-f70d6757b61d	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 05:37:56.213098+00
a87e9cf8-4cac-4af2-b551-67298002830d	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 05:40:12.198271+00
314cc007-c18c-4225-8252-5547b8de9379	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 05:55:50.656435+00
d9bb8310-22c4-49ed-ae46-68a8131252ab	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 05:57:59.905318+00
df8ba7ed-ce17-4766-b8ec-eb6e4f594f80	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 06:00:10.661933+00
cbf0df24-23b2-4f06-a05a-0f37fd32fbc3	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 06:02:18.289739+00
ee8606b6-054c-47fa-9504-9367da8e4b88	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 06:04:47.326258+00
e588779a-c18a-448d-86fc-ca0f84b4407f	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-28 06:05:58.6227+00
d5ddbc05-0350-4f1c-a54e-49b9e76d711b	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-28 06:06:36.596209+00
4c8d5ac2-36aa-4e4a-9c30-723d464e2a76	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:27:22.775996+00
1c6384ae-c526-4824-a680-949cb6c564ea	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:33:13.911746+00
0cc9411a-d440-44f0-9b85-03fd89556738	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:33:24.788864+00
2b7b3ab7-00f7-4cb0-8de4-7e2e617c588c	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:37:03.759716+00
f3f8f409-962b-4fb7-b046-4c47f8d287e7	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:37:12.909464+00
08040123-4c6f-464f-a75d-8e767b0183e2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-28 06:38:32.906128+00
b5953b0a-ded1-4376-b704-906ac4fec027	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-08-28 06:41:10.291244+00
ec5bfd6d-7437-4046-bba2-2190a548673c	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 06:42:08.644328+00
bb63afb0-551a-4e19-94f2-142f285e430e	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 09:04:16.586574+00
de888d79-5598-47a6-a764-bdd1bf57c1d1	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	chat_message	Sent a chat message	\N	2025-08-28 09:10:43.648841+00
4ef6f6a0-e25c-47c1-9930-fe93a438a97e	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	chat_message	Sent a chat message	\N	2025-08-28 09:33:16.417977+00
112c7c61-19d6-43ad-be00-9d8d744f7874	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	chat_message	Sent a chat message	\N	2025-08-28 09:37:04.023291+00
b1a08cea-b679-4650-9a1e-acc9a538f47a	d079c984-0ba6-442e-8ebe-73e064b8bf3e	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 12:34:19.286657+00
b7d51e77-505c-47a9-a61e-3b2a36fc3016	d079c984-0ba6-442e-8ebe-73e064b8bf3e	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 12:36:14.015309+00
594f500d-f9d3-40e8-a7d6-f4ca53b2fa1d	d079c984-0ba6-442e-8ebe-73e064b8bf3e	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 12:43:23.140159+00
c7b95c47-5ac2-4aa8-9d3f-2e9771029da2	2c89253b-a0cd-4217-acdc-f98d84d21dca	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 13:48:07.518193+00
87bcc565-6d8d-4fa3-a968-7e3a8d49d042	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 13:53:24.537059+00
f0cc4c7c-ebea-4686-b866-c7237f189c67	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:55:55.98325+00
1d712038-adae-4a42-80fc-6a39be421606	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:57:07.936281+00
ac02f2d9-b10e-4831-bfae-b7f2514d66ce	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:58:48.456176+00
94380aa5-ce86-41f4-aea7-c5ee7219a20e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:58:53.72956+00
aea9d9ad-bdb6-41db-bfd6-8a4ea47e1701	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:58:56.146701+00
48c02bc6-18c2-4221-a5e1-3855ad13d4dc	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 13:59:57.154274+00
55fa58a3-ccd4-45ad-a055-3b6e219de5c1	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 14:00:00.150283+00
9c01bfda-b2dd-421d-97fd-48b56d33da97	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 14:00:07.051182+00
eb089751-0842-43b4-a6af-78e6cbac8d08	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 14:03:08.094337+00
7e7d332e-334c-455d-b414-c56c4ba58bf2	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	chat_message	Sent a chat message	\N	2025-08-28 14:18:46.609081+00
3d3a3e07-4d9c-4f46-bf32-e540e2f163d4	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	chat_message	Sent a chat message	\N	2025-08-28 14:23:43.188182+00
b1ace05d-fdd2-48cf-a0dc-85dd4e73913b	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	chat_message	Sent a chat message	\N	2025-08-28 14:25:17.13141+00
0d8f92d9-8013-49ec-a1f4-b07846329885	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 14:46:05.79287+00
6f77a296-6a97-4a0f-9a2a-162634ae2865	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 14:50:01.254381+00
a9098f75-d3f8-41f8-84b2-b05df00b450b	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 14:52:09.416351+00
4532d90f-9135-473d-8b7b-887ef6ebf8d3	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 14:54:55.032556+00
ac913a33-e82f-4ddc-a8e0-728b736f3225	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-28 15:43:09.221405+00
3b180056-57ce-4e7c-81b2-40a7abae2c4e	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 16:10:14.593776+00
583d2334-a6f5-4ade-9337-08d89ee07c0c	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:11:09.062196+00
190592f0-400f-4960-aa0d-379318648aea	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:13:14.725218+00
ebbb0012-24b3-4e49-b1fa-178fbc4d9c79	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:15:19.452415+00
9e92373f-1ed5-4e93-83d3-d8ff30e45933	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:19:06.934624+00
1a0e360a-7866-422f-bb07-2ac61372ca10	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:21:11.944046+00
b7f7dcfb-2898-4524-a847-6869022de40c	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:23:19.060957+00
a84a694f-5418-4574-9efc-10e1410406dc	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 16:25:34.392172+00
310ca300-900b-43fa-82d3-e29c0dfd1644	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 17:43:01.986387+00
e4288285-492d-41b4-9113-605c6e2707dc	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 18:31:55.675283+00
de073136-b4fa-4081-a43c-b3724174a6af	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:32:27.379135+00
61ce0735-0576-40a8-a87e-96a89a04eada	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 18:43:38.652841+00
3330c377-aa88-46f8-bbb2-555102a017b0	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 18:46:04.460314+00
76d0a2dd-d4db-4738-8be8-53a58ed8cf75	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 18:48:13.082505+00
f43d9dca-10b3-4f4b-b82f-c13142b26ecc	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 18:51:27.724757+00
678846cb-cfb6-45fb-9183-27682192116c	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:53:04.214147+00
5ccdfec4-0259-4bf9-bd50-714df57569ce	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:53:15.283532+00
3773ac0a-2725-4216-9465-dd166e3e2282	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:53:18.771538+00
85d0afbd-697e-4928-97d3-7b63866161e1	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:53:34.521224+00
035321b5-a377-454f-a7e8-862b18a77688	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 18:53:46.85778+00
00ad3cc3-87ab-4158-8e76-efdb14b14683	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:53:57.452515+00
b64fb1a6-319b-4ba2-a952-ae8239dc7690	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 18:54:12.21762+00
31dedb6b-f497-4a56-9183-87b2eaa22fb4	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-28 19:10:57.631031+00
0370df91-3f9d-4d6a-9abb-02ef46127bb6	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:17:15.894706+00
a843244b-32f7-4587-96ce-706ec1b91122	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:17:18.666357+00
ca29b463-4012-4518-a4cf-cfea17eed0b6	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:17:21.04602+00
14af951b-0d98-4302-97ad-1732951a00d5	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:28:07.293905+00
782cd53f-d24e-47ec-bcaf-cec5b8dad32b	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:28:59.492778+00
6668636b-f65e-4674-9ddf-d99c76ecdf0a	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:29:03.638916+00
081073c0-90fe-4973-8062-072ba559aa56	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:29:08.696252+00
7fba489b-1257-4698-85e0-f48899239e41	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:33:57.207359+00
8be828b3-a2bd-490a-b18c-79086c1552a9	c644f60a-2f41-41fa-8814-b698c5154474	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:34:01.267855+00
6b7b0b65-62e4-4b8c-b69c-3453bdf46dcf	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 19:35:01.511949+00
7b673bd0-3a20-421a-9d88-9145ca3fd436	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 19:36:02.114723+00
8a4497f8-afd3-43d5-a7a7-b991885044de	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 19:58:49.679338+00
d03c97ee-8f5c-4ef5-80c0-803fd00477cd	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:00:06.809195+00
d567aa38-447f-46e8-863a-12234a9bd468	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:00:27.962421+00
b277fec3-6bf5-47b6-8625-fd0045e01363	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:00:55.163972+00
7b504411-62dd-403d-89f2-efbbd3caa30f	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:01:17.327616+00
80e90b5f-1632-402d-a0c1-177689f421f8	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 20:06:52.448434+00
455f51db-d932-41fe-b72e-782e01d1d91f	22c2ab08-6a42-44c3-b290-dedba2161dd0	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:08:05.733745+00
9c84b6a8-b1bb-4e12-a157-4ddffb871272	3da83afb-aa8c-4c55-b3b0-8aa64000205f	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:18:00.15661+00
a06f0bc8-34a4-40e1-905a-204c27294499	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-28 20:22:31.057716+00
a7825e84-ef62-433d-9b2c-c1917ded1463	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:45:29.604567+00
d4c4549b-25fe-4bf2-b415-18e1647ec8e3	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:45:32.311616+00
a1ae230f-18be-455f-a656-26ef355a67f2	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 20:45:34.763276+00
202f3a6b-ebc7-493d-9bcc-85402848031e	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	audio_completion	Completed Verse 3 - Syukur Meditation	\N	2025-08-28 21:08:39.998434+00
ae5c862b-9ee9-415f-81e7-097628897f11	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 21:21:42.531313+00
04c0501f-c792-46d0-8c86-8e4ac5c1f929	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 21:30:58.095169+00
af567161-a35c-4ddc-9f3e-0a956ce0a9af	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 21:31:03.058626+00
9d8f9ffc-e41c-48ab-8e89-8c1d61314ab2	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 22:11:48.373326+00
f8b0c638-77c8-465d-b6f5-b4b7437aa4fc	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-28 22:15:06.424377+00
d50dc048-fb7b-4ead-9dda-660ac695748e	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 23:17:37.004076+00
83e359ac-2a5e-4e8a-9027-3d0a37a3709f	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 23:17:39.598185+00
e1090547-862e-4c4c-b7bc-de3756d44437	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 23:20:07.329542+00
1efb7fcc-2626-4ef3-a4a0-c88e35c2dab8	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	chat_message	Sent a chat message	\N	2025-08-28 23:20:07.905314+00
d553c581-8c5c-4836-874d-14bb6bad1d0c	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-28 23:39:15.512429+00
2b1f7188-6b97-43a8-b552-0ec835d0a7f7	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-28 23:55:16.096688+00
9a8d3d8e-a1f6-4356-851b-38247b376744	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-28 23:58:33.400793+00
aea8ead9-531b-443f-b083-924ad7dc7e76	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-29 00:00:48.767689+00
c94ab241-8b59-4ffe-b852-5a3f386af329	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 00:03:06.581978+00
f1776233-4b6d-4d3c-8252-f2cbc1363fb6	f6560fca-177d-497f-9225-a597ed888589	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-29 01:01:13.905494+00
3e803b39-e101-4f86-9f53-6ea6e4b8748d	f6560fca-177d-497f-9225-a597ed888589	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-29 01:40:22.025411+00
8c8f77d8-86c3-40c2-966a-c9573e7c4abc	f6560fca-177d-497f-9225-a597ed888589	1	chat_message	Sent a chat message	\N	2025-08-29 01:45:35.278181+00
021c0508-e867-4f15-9248-cd6bbaaed7f9	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 03:45:15.647008+00
6abfa450-f9e3-44c8-9a8a-5b5a6cef5149	f6560fca-177d-497f-9225-a597ed888589	10	audio_completion	Completed Verse 4 - Prosperity Stream	\N	2025-08-29 05:39:02.38546+00
7172a7f0-dc52-47f2-9ddc-40510fdfb67c	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	chat_message	Sent a chat message	\N	2025-08-29 06:19:09.304011+00
0b3bb9a1-dc25-4b65-8b33-f238aa4db9e2	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-08-29 06:22:18.697553+00
27644ae1-f7bb-478e-b087-9d6f7c030686	74a895f6-e11e-47a6-b4d3-a89092905776	10	audio_completion	Completed Guide to Inner Silence	\N	2025-08-29 06:24:53.415318+00
6a4963ff-e7e3-48b7-a27e-2e8049db4474	74a895f6-e11e-47a6-b4d3-a89092905776	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:25:54.003596+00
98ff0431-61f2-4551-b075-3afc17fb5f1a	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Journal entry	\N	2025-08-29 06:32:32.1125+00
a03b4186-e2ac-4daa-a67b-f26253e49e40	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:46:38.644481+00
e4d7465d-0f32-42a1-bd87-71c5384f34e4	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:46:53.512698+00
d7a80025-7225-4685-a8f9-d126166074cc	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:46:55.644087+00
b4b99da9-e604-42ad-a138-c62f193c4ec6	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:31.458416+00
1986f516-3c29-4237-b7fe-64ccb5fca8e9	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:37.355344+00
c7c9c2f5-81a0-4520-b4a6-adb6c0f51817	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:39.688083+00
33f855df-1c26-4c5d-addf-07811778692a	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:41.78459+00
5c9f3571-416f-4c65-9186-b6c86910c5a6	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:44.551203+00
2f5ba550-fff4-473e-ba07-429816a94ca6	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 06:56:46.674642+00
dfe21012-c8e8-45e1-b16d-00ec197a0865	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	audio_completion	Completed Verse 1 - The Space Hill	\N	2025-08-29 07:24:51.031224+00
e2db71f1-a909-40e0-8c57-5dd4d420b052	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	1	chat_message	Sent a chat message	\N	2025-08-29 07:29:11.184959+00
bf019098-5e3a-458a-8634-dd390aeb7284	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:09.834019+00
8fb7ea2a-917b-49a8-95a1-0293ce1b1796	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:12.002264+00
1e7f3a56-d6b9-4b82-8917-35f44c0be718	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:13.725485+00
26c935a8-43f4-41d3-ac54-496c4bebc41a	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:15.852631+00
1cf95ddc-c57e-43c9-ab7f-e5a62bca433a	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:39.538302+00
b53b33a9-d9e5-42e3-9f2c-45f00a6ea814	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:40.957167+00
a5281eda-ccf9-4e6f-bda3-5343a4fcc802	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:42.474414+00
39c69c5c-93ce-4a40-9c47-4249f7f371b4	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:43.917974+00
7669e6a1-79bd-48b7-a582-ea89c70f17ee	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:45.379782+00
6ba8b820-7a4f-42a2-81be-3d714c84bdd9	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:47.076704+00
4165cb6c-fd5a-4e81-b24c-f634b300515e	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:35:49.005038+00
10c2801a-607f-4908-af6f-b18e2525bee6	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:40.877905+00
6a0cdfc5-a8f4-46e0-8bb7-f086686d99d8	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:45.227777+00
c92ae1fa-de5f-46a9-a34b-615d31754673	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:46.803872+00
cc8fc394-8eed-40e0-a1fc-62ae4c0c40bf	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:51.698515+00
af1a0ccc-0362-4cfa-9b36-6a6983d4f518	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:53.244798+00
2cab94e3-7ad9-40c4-9416-35959990bc73	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:54.695269+00
5ef22f71-006b-4969-921b-4887ee31f7ab	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:38:59.219726+00
6a58e4dd-44ad-47a5-ad37-89f5de58866b	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:39:06.301543+00
93684fb0-df4d-4357-98d8-333463887468	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:40:20.253645+00
02d53b70-a0e5-42d7-a185-e4565e3646f0	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:40:22.3268+00
0d10ea22-5500-42fe-b571-d5d5e7c819f8	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:40:24.168963+00
97db344d-2906-40e6-baa0-5dbd0eb45165	ed289706-acf5-4af5-9301-2bfb0128f0f5	5	journal_completion	Completed spiritual journal reflection	\N	2025-08-29 07:40:32.886848+00
5329ac8c-1230-4618-a90f-58c682a62d05	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	audio_completion	Completed Verse 5 - Vitality Vortex	\N	2025-08-29 08:11:20.874879+00
89d2b314-a06b-44bf-8cd9-f2ec26a711cc	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-08-29 08:30:56.387005+00
116d4be4-91c8-4061-87ed-0a443a0eac77	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 10:08:11.801315+00
a3857414-58a7-4043-8306-0488d6f52aac	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-06 14:24:03.769131+00
4ecd480c-34cc-4c6f-9b4d-5be873828df0	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 21:52:12.32573+00
ce0cb304-2faa-4208-84bd-9dcb2d39287c	1424b737-4447-4ced-835c-ad9d50ec255f	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-06 22:51:58.272719+00
4e562507-d6a9-4eb6-9c06-a5011f86ecdc	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	chat_message	Sent a chat message	\N	2025-09-06 23:50:32.64085+00
236548e2-02a6-4ec4-836a-aa150cfa684d	6c665bce-5174-4d59-ad9a-077feccd68be	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 03:33:13.021914+00
8278f3a1-19bb-459c-b17b-a57207951047	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 08:32:25.085926+00
ea7211e9-4eea-47b4-af3f-cadd69adcace	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-07 08:55:24.143556+00
3ad2ea2e-5faf-4e27-829c-9383998afdee	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 11:53:16.530058+00
37d2ad62-1bea-409b-9449-490d7028973f	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 13:27:50.999416+00
696f2a8e-7dd7-467e-a8a1-70cba585fc95	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 13:37:55.775149+00
fdaebf08-35d1-4f81-a96d-ed19b7a3ae16	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	1	chat_message	Sent a chat message	\N	2025-09-07 13:55:22.79813+00
b03ba3ff-30eb-456d-9e0c-83ed9175f5e8	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-07 14:11:39.207329+00
6fe6eeef-fadd-4dd8-b495-2488e4e68bea	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-07 15:29:23.101557+00
91429ea3-2f2f-4364-936b-7e157dc539b9	a2e8495f-d2c1-4e04-9db5-faa976f59207	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-07 16:22:00.833235+00
3a6d0b74-0f6a-4d79-bd93-50754ccf4fa3	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 16:35:01.508225+00
0dd223af-4afa-4d99-b7fa-a4970d4478af	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-07 17:58:56.293089+00
aa917899-a06a-471c-8fc0-fe4e9f1145f9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-07 21:28:33.78348+00
dbb34923-25e6-47f5-867d-2f1f7f1ef033	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-08 02:14:08.995429+00
98f1273c-0cb7-4175-8689-a3b5350859b0	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 03:24:15.360201+00
d69fb349-e199-48f8-bb75-f2fb05fb1b9e	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 05:05:30.205636+00
eb6619cb-2129-47af-9e3a-38cd30607d07	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 05:28:36.168294+00
a18c5053-0bfb-45d9-9885-395e2451f88a	c644f60a-2f41-41fa-8814-b698c5154474	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-04 18:04:29.694789+00
6c3d214d-fd84-439d-9d13-c565978346ca	c644f60a-2f41-41fa-8814-b698c5154474	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-04 18:04:46.874296+00
b106fd51-0f1e-40d5-a40b-30baf5600756	c644f60a-2f41-41fa-8814-b698c5154474	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-04 18:04:59.705414+00
732b9c70-9b43-4c32-8555-20668b6b4b45	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:05:37.302194+00
8a0003a8-b5ec-4753-8386-8a1aee40422b	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:05:49.79702+00
02881976-9130-414f-a0e3-9d195e5aa670	c644f60a-2f41-41fa-8814-b698c5154474	7	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:06:05.858914+00
1247cf56-c4f7-4964-83e3-783e77e189bf	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:30:43.886698+00
a20d6c3e-61a1-48cb-9651-c612a924b81e	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:30:55.717464+00
98713f20-e1a5-41ed-bdd4-6c3a36e1f690	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-04 18:30:56.463897+00
7f8a5023-0a37-4da4-9cb2-995c4ac06467	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-04 21:33:54.315626+00
9703cc2d-dbb7-488c-b0b5-43818424ef1b	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-04 21:36:10.279014+00
0074dbc9-22e2-4f6c-8a27-9359b826774a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-04 23:32:22.107902+00
6d3f2472-13a1-4411-9e4e-8a9f4189328c	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-04 23:55:49.794265+00
0da8d111-920a-4b82-98d2-a9b404140a93	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-04 23:58:48.67266+00
881dd286-1084-48b0-af33-69973ca298f4	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-05 00:20:51.817046+00
54e55d4c-2f6f-4cc2-bbcb-c26c21a32745	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-05 02:24:13.728422+00
39fb14bf-a76e-4c75-9276-091fc43e1054	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-05 05:26:19.620341+00
68ae98cf-416c-4ce7-b764-90a5ca48697c	55d3fa51-183a-4187-8962-5256b57c4357	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-05 05:29:17.2331+00
dea21400-6035-4c60-b540-9cd5bfdcd4a9	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-05 06:44:42.220142+00
81e718c9-a1a1-461b-82b2-0668b7f9434c	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-05 06:45:39.124372+00
c5bca2f8-1289-4307-b1e8-767635d19c54	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 06:47:30.950815+00
91bda02f-1c75-4614-a472-cc08becff4a6	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-05 07:49:04.462131+00
246798ab-5660-441f-8a29-8c486fdc78ec	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-05 10:24:35.978098+00
8bf64df4-3de5-4943-9b63-4b6b8c81d329	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-05 13:36:13.818482+00
b5eb5995-ded3-4119-8492-25d0cf576b00	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 16:18:42.474128+00
ae6fa897-5593-40af-9792-e1945aaf6946	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 18:03:23.129851+00
549d9289-91bd-487e-806d-6316455f245a	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-05 18:38:07.103116+00
b99cdf05-ce5e-4806-9c74-98b3b83434fe	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-05 19:03:06.440992+00
cfd70dce-ada6-41c3-8d54-df9b18fc2762	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-05 19:35:30.415638+00
fcd2cfed-c0cb-47eb-8d47-5891dbf843d1	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 20:52:49.772478+00
7eca5950-5e62-40a6-b1ef-9dfa1af415b0	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 20:55:01.115319+00
2ac58ab0-4fe6-4d15-b93f-32c54148e3b3	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-05 21:18:48.800418+00
f6712035-f589-4c53-a83b-08ab6694a995	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 21:29:54.745268+00
35c90ba8-1367-4756-b829-de1969be44ef	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-05 21:31:49.245489+00
8c949bd7-7302-459d-88d8-30f4aa9eda94	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-05 21:42:02.769855+00
8e8df43c-afad-44e8-965c-ca06912cc9df	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 4 - Prosperity Stream (English)	\N	2025-09-05 22:11:25.94775+00
b6722fbb-694a-4066-b4e5-67b5cfb686e6	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 4 - Prosperity Stream (English)	\N	2025-09-05 23:16:41.500916+00
f2cdf392-4ce4-4922-b905-57b901d4709a	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-09-06 00:41:06.4392+00
8c215074-a88b-4691-b75d-fc6206b7420b	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-09-06 00:42:12.936109+00
7ee5f152-3f68-46bd-b11a-618ff19dd272	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-06 01:38:49.647429+00
39e1dd66-1bc4-4f0c-b999-828e8653116b	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 02:58:39.882603+00
b57beb26-5050-40b2-90a3-8148201b440e	55d3fa51-183a-4187-8962-5256b57c4357	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-06 03:30:39.549031+00
a4180ae4-4672-4484-a7f5-3ce4636a87b3	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-06 04:01:33.641107+00
028a09d1-ab8e-4a41-92da-0c2f6172b7a4	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-06 04:04:34.624822+00
9ab5b9b0-ff42-406d-9834-dba9fdb1c91b	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-06 04:08:00.09065+00
496a2f91-2ca6-4bd4-ac67-e54a0eba6538	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-06 04:12:30.043273+00
bd2f3054-9c51-407d-80e2-b423b9cb840a	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-06 04:16:32.285436+00
c307b902-3be6-4ec7-954c-615d91ef392c	55d3fa51-183a-4187-8962-5256b57c4357	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 04:21:28.587712+00
5e7d14c2-f121-4011-b7a3-d207f526d61c	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-06 06:40:01.165331+00
f7ee88b5-6c3f-4d91-8dd0-8a147684d162	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 06:42:43.2345+00
bbbe20fb-c80f-428f-97e4-7d66266880e2	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-06 07:13:55.017836+00
e779585b-a87c-4940-ab29-ec43aad7afad	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-06 09:21:02.149659+00
29bf8ca0-3927-4693-945b-632180c6dc02	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-06 09:39:40.539907+00
2f052d01-6bfa-4001-9590-a156a74e8ec9	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-06 09:40:32.917961+00
44262c62-4a2d-4609-9b3c-c5d8339e3aad	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-06 09:40:45.78022+00
1a46736e-2f04-4b81-8ac2-fccff36d49d2	ed289706-acf5-4af5-9301-2bfb0128f0f5	7	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-06 09:40:56.841607+00
871252b6-0fbe-4f31-8cec-33461eeb7344	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-06 10:38:29.587929+00
8d89ae03-b397-42c2-a747-d9ab413c4346	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-06 21:47:58.500245+00
f55eed98-4c09-472f-aa35-d4f9192e4e0e	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	chat_message	Sent a chat message	\N	2025-09-06 21:56:36.356392+00
ec5f9aae-facd-44ab-88a3-8e9924519866	1424b737-4447-4ced-835c-ad9d50ec255f	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-06 23:22:12.770178+00
4d76a71e-af24-48fe-8b05-027b092c94bd	d14df823-5cfe-4698-a0d7-19b2a49ba058	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-07 01:49:25.449225+00
6e4e1057-d0cb-4580-8ce6-d9d0f1c0c560	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-07 05:37:00.327216+00
e19a41a3-bf81-47e6-bb68-ac868a941376	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-07 08:33:06.050713+00
22c92bf3-1f4e-4ffe-a9ee-a7fb6fb76fb7	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-07 11:50:53.75511+00
717a6282-4145-4221-a351-5f18cc3e47d4	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-07 12:54:29.985675+00
aa70b54d-41f5-4df6-b25d-b9e96718f66a	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-07 13:32:27.599635+00
8e138c9e-f1ed-4bf3-9442-4c48e0a29841	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 13:40:31.632866+00
13385d1a-b417-42ce-ab34-c52f090522c4	b2803bb9-d737-4420-8eb0-4a6deed56216	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 13:59:56.408755+00
de4efefa-2955-4849-921a-a3f2adeb4113	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-07 15:15:48.244859+00
257de1f0-025a-4cf5-9690-84a13a9fb2b1	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-07 15:30:00.255599+00
6ea2d5ea-fb0f-4237-9d16-77f34a05fb37	a2e8495f-d2c1-4e04-9db5-faa976f59207	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-07 16:27:19.613493+00
c2947e91-f26c-4e41-b4e0-2e2a827e2798	a2531f03-3428-410e-abbc-06ef9f4ffe43	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-07 17:37:08.237587+00
ef526c9d-1661-4945-a0fd-c2d9b4399aae	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-07 18:37:14.616912+00
a2de7537-d6c9-482e-a240-fe6e69cfdb20	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-07 21:31:42.016382+00
aca66087-ff80-4087-8f96-68d857b70cb7	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 03:20:30.837964+00
4eb2d73b-0d5e-45ca-80fa-62dcbaad072c	55d3fa51-183a-4187-8962-5256b57c4357	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 03:40:54.663708+00
6b15ab14-83d5-4652-beeb-bbfaeda23a11	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-08 05:27:38.704163+00
2b4edc86-d55c-4701-b1c1-2a5f91205cb8	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 05:54:19.061782+00
23290c0d-2c3c-43ee-b56b-0c4473c1f837	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 05:55:17.510825+00
288641db-ab2a-46bc-8ad1-bf18ab245330	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:58:21.787415+00
9244a24c-f5c3-445d-b745-85c93c14dd90	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:58:21.793095+00
9c3a224d-33de-4035-933c-858abe3bd81c	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:58:21.801784+00
4a5ae1cd-b573-4d28-8122-5585c2e8e405	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:59:17.485506+00
13ccd2e2-bc9b-4943-b2e6-0d5c6c065b58	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:59:50.928205+00
9bdaa2ce-9bd0-4f02-b011-4e1bd732a16d	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:59:50.933483+00
ae9039dc-a2b8-43ab-b20b-2d4c5a72c331	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 05:59:50.95316+00
0b5af452-578a-4c33-b1bd-2995847901dd	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 06:02:44.139012+00
a78922c9-48c3-461f-8c1b-98caee0403e0	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 06:02:44.300095+00
c37f7bdb-4c90-4f0d-8110-837896d62f88	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 06:03:51.039564+00
2a25e8b7-818e-4299-9b40-6ed620211d4e	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-08 08:48:26.155296+00
f990153d-ae19-44c7-b901-4873b6da2c3e	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 10:11:41.994388+00
eecefd91-c172-4626-9e35-984fe94e858f	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 10:13:53.327677+00
1f06d4bc-9ef1-4707-82cc-f0313fdd35d0	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 11:18:11.150204+00
61bb20be-8e46-430f-8264-bbc267a3c7ca	ace95bc7-7dfa-4840-ab5c-e344a0054aac	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 11:42:31.541849+00
b942496d-2aba-41ec-beea-16ea36d0d6d7	ace95bc7-7dfa-4840-ab5c-e344a0054aac	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 11:42:31.542587+00
61c90e65-da5f-4293-8515-389a7a4cf472	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 12:35:40.803096+00
019760a9-5197-4b56-9efc-f21583e2f9c2	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-08 13:06:46.561731+00
0a0ab84d-7cd7-4488-b399-0fa867ee6b1a	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 13:17:41.986455+00
a26062b7-4771-4d7e-bdeb-357e4a8878ed	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-08 13:21:36.108179+00
3b795eca-47e8-43a0-aefd-3662a8422dd2	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-08 13:37:37.703874+00
517c3aaf-45f1-4af9-a8f3-9429e1d354e5	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 13:51:50.60273+00
40814b0d-99be-4c15-87ec-b20a66845c52	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 13:51:50.703212+00
05e1c8b6-485d-4918-a682-105ba698f923	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 13:51:55.502824+00
1bd940db-a632-4366-b7f8-ccb1f525931b	f6492019-02bb-4783-b172-53f7e71bdc5c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:07:40.637455+00
f2279cbf-6c1f-4dae-9d1e-aa853bbf71a3	f6492019-02bb-4783-b172-53f7e71bdc5c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:07:40.634445+00
40d412be-7feb-4df9-be63-69bc7d4c107a	f6492019-02bb-4783-b172-53f7e71bdc5c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:07:40.643917+00
25fc58f7-f234-4d3b-9373-aa6885e38d9b	f6492019-02bb-4783-b172-53f7e71bdc5c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:12:22.298229+00
444c834a-3882-43d3-b156-8df6e2618240	08c375cf-3e32-486b-b211-4c28e6239093	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:42:57.029111+00
0e9158c3-7d64-43d0-981b-b3806c162b2d	08c375cf-3e32-486b-b211-4c28e6239093	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 14:42:57.124843+00
63282c85-4d55-432d-a5c5-d39c9615c6ca	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-08 15:12:08.153949+00
a6be0943-dcea-4424-b7ed-224a815e2a52	55d3fa51-183a-4187-8962-5256b57c4357	1	chat_message	Sent a chat message	\N	2025-09-08 15:29:27.804183+00
73dc051c-e380-4de3-b5b7-91b86d622e39	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-08 15:42:52.765786+00
d1a9b262-2215-4138-98e4-3018f664b43d	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-08 15:44:16.450136+00
d1f1a8f0-fda4-469b-a05f-858d504d4f74	3da83afb-aa8c-4c55-b3b0-8aa64000205f	9	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 15:44:25.527872+00
70da23b7-c3e1-42e0-b5a6-2b7f25845959	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-08 15:44:27.285413+00
7154d3e1-7b9c-4699-b7a8-166a55c4c090	1424b737-4447-4ced-835c-ad9d50ec255f	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 16:05:47.137388+00
713e6806-ed6c-4dbd-876a-1ff1b4eeb323	1424b737-4447-4ced-835c-ad9d50ec255f	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 16:08:14.807202+00
0bbe85a7-0f04-45d8-b8c8-c5d68196b767	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 17:34:07.69697+00
a5579fe7-1cb6-4cbe-9721-5987e2bed5b4	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 17:34:07.715823+00
9c4e5d3d-056a-4baa-b21d-ee27e8125841	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 17:34:07.744371+00
cf45ddde-dd90-410d-951a-9d9e9064e061	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-08 18:03:12.554776+00
c6c9085b-19e1-455c-aa83-8835e94c7b75	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 18:33:50.776205+00
237b42cd-53e3-41cb-9b47-b968e02424a2	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 18:34:35.716097+00
ffe8e4e3-ec9d-48fd-be18-bdab6de97499	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 19:08:08.869876+00
ef487e39-4fb9-4c1f-aee9-23af5cd82eff	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-08 21:17:28.027261+00
5b2fab87-2b45-4b2b-a86c-fb7a003eb0d9	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 21:36:13.273879+00
92cbc6b4-ff55-48c8-8d19-5d92a1d2a7b7	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 21:36:29.1695+00
b0f205d6-9bdb-4f0d-9615-57cdd6abe050	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-08 21:37:54.488125+00
5befdefe-c82a-40f8-9ee2-1a44d4c45ee6	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 21:38:38.628157+00
69919514-d2c6-4bed-b4fd-f33f8d26a4e1	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	chat_message	Sent a chat message	\N	2025-09-08 21:41:17.114019+00
963dd991-a383-4c9e-b85f-8597b56551ce	c644f60a-2f41-41fa-8814-b698c5154474	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-08 21:58:07.223771+00
516a0f68-da50-4611-b10b-f5bfcb8e4e4a	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 00:17:21.513728+00
17c4c29f-035e-48b0-abbc-b4660fb3e348	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-09 01:54:30.682242+00
236bb3c0-fa8b-4f2a-9387-695c530d7224	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-09 01:58:06.459858+00
25f94bb2-1990-4e96-8575-86f842561cbd	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 02:56:40.044352+00
d1828f8a-229d-4d5e-a52b-90d4d5852b89	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 03:08:18.922993+00
7368e488-5f44-4c93-915d-6f6fd8f7e69a	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-09 03:57:17.371124+00
1495cb50-7fdc-41cb-b3de-631bd0d30632	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 03:58:36.080927+00
52a23e57-3b2b-4c09-9f47-0242ced903f6	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 04:26:10.448457+00
62a6d5d5-dd21-45a9-b5cb-a44927416ea7	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 04:26:51.773213+00
68601365-59c6-419b-aba4-57ed747dc3cf	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-09 05:22:07.207155+00
d8b398f6-9689-452a-9e6f-d73ffdd775af	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-09 06:32:41.944246+00
5cb1c6fa-f69e-4302-b25a-4a8a8e5c1d4b	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 08:21:43.959817+00
e0d5195a-4e5b-4c51-8026-6f74a8bdf692	18d08fe3-6f60-4abc-a51e-75360e88d54c	9	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-09 09:11:18.287661+00
3922d940-f3ea-44f6-a69a-fda9fc999a17	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-09 11:48:26.801468+00
73f49600-cf48-42ec-ba14-36f26af9116d	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-09 12:20:27.217165+00
c81715cd-8d30-49fb-911e-96f8d316c053	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 12:39:55.040721+00
70b1d072-a6d6-4435-8139-d5c24dd889af	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-09 13:11:47.202951+00
3607d338-aead-4f56-b745-d765b73c3484	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-09 13:21:06.081443+00
cf1a71f1-8a44-4a58-9e45-3fa3afb7b7fc	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 13:27:52.078338+00
438a4160-739f-4645-ad6e-41c0a5cabb05	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 14:29:17.357325+00
06f0497e-d6e1-49d8-9c6b-28c7f4512d58	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 14:36:38.459241+00
5b840278-5456-4c1e-9fc0-9d285c479485	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-09 15:01:01.789998+00
77147705-2a65-43fe-916e-25c15efe511b	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-09 15:07:35.974135+00
ab7ba909-21d6-4773-966b-53c9d0d75e80	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 15:12:25.190547+00
46a5b588-164a-4f71-83c2-f04982175474	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 18:57:29.259721+00
2f77875b-5d37-4754-b4cd-80230da1cf1d	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 18:58:24.992786+00
b0085af4-01d6-47af-a7f7-13b7e9805035	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-09 19:21:50.029601+00
f5c34d6d-5d52-4964-9881-4c924e5c85cf	b2803bb9-d737-4420-8eb0-4a6deed56216	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 20:54:54.393286+00
1b25920a-8539-4459-be44-8f8b78e5d164	b2803bb9-d737-4420-8eb0-4a6deed56216	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-09 21:26:17.052338+00
01dd99fa-7710-4be5-8c8d-725cdf44cf85	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 21:56:24.540918+00
3c652f40-8d8f-477f-8981-8f9016f698c6	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-09 21:57:31.79618+00
8f36b10d-32a5-4248-973e-bcb3df659aad	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-09 23:58:49.339224+00
6ab02205-35c3-4396-9796-693cf4ef27f0	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 00:01:04.44319+00
57c6ec8a-f9d7-406a-a509-d7de1fe90e87	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	chat_message	Sent a chat message	\N	2025-09-10 00:04:22.468495+00
d3a5391a-f563-439d-a2d7-9935c2f640fe	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 4 - Prosperity Stream (English)	\N	2025-09-10 02:37:30.387271+00
a6272616-3d03-47b7-98fb-5eede1de2c20	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 02:40:10.962445+00
9be56ae7-c198-4e61-9169-2f010509565a	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-10 04:59:50.716489+00
ea84747f-8626-4a4e-b358-75be237fc1e6	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-10 05:17:30.179813+00
8f3a67a9-bd52-4a7b-9ac8-459df9c223d7	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 06:07:17.585105+00
0efedaf3-3039-467a-890c-e9b100561203	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 06:12:10.381187+00
6e250cd6-c46f-4f8a-8945-d0e8afb2662a	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-10 06:50:57.570311+00
99015de7-f5a4-44a7-b359-4ff9ea71b5c8	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 06:58:00.607863+00
f53d55dc-21ce-43b3-b4dd-1ecc7389178c	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-10 07:20:07.711106+00
46b107f4-b652-4ee7-970f-b10899eae2b9	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-10 11:20:01.368939+00
f5ec9659-19bc-49c3-aedd-9fe9faf38bec	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 11:26:55.112762+00
ad30bdc2-e785-4862-a5c1-172e160de809	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-10 11:56:28.202003+00
582d9658-c167-433c-a6e9-9d91aff59865	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-10 11:59:58.451702+00
df891476-27f6-4fd6-b45d-c1521616bb8f	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 12:01:42.660837+00
090da38f-72fb-40a3-acbc-20e9afeb117c	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 13:45:47.493086+00
a0cc47bc-3952-4dbf-9227-e6d859867b73	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-10 14:07:56.672284+00
2554f612-f92e-479f-84b5-19ba2d3912e3	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 15:48:22.969928+00
f45ffe74-a39a-42cc-a0ce-948166474cf3	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 18:22:12.82854+00
5ab52dba-f319-49e2-a581-b48201f98e51	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 18:23:23.808355+00
e89b28ed-978d-47c4-88de-79b0e816ac1c	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-10 18:45:33.828925+00
893bdd13-65e7-446d-8517-7c805d71e151	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 23:17:34.69685+00
e1f087bb-324b-420e-a6fb-299aeeabf336	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 23:19:57.817862+00
5456d1b1-f187-4e09-afff-e5204782dffe	038c077c-08e4-4d9f-adb3-053d0e9dde0b	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 23:32:06.750964+00
eac3c951-7ff1-42c7-a16d-274668d5c1c9	038c077c-08e4-4d9f-adb3-053d0e9dde0b	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 23:33:28.21375+00
b83aaa1d-3162-435e-9e70-c30456940ede	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-10 23:49:59.693845+00
82a66e57-d9ab-40b5-9a8b-059143cd87d3	f6560fca-177d-497f-9225-a597ed888589	5	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-10 23:51:52.432527+00
85e0c9e9-9c83-46d0-bb27-d63158706f81	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-10 23:52:16.604504+00
048e468b-203d-4aba-97a7-df8db2a154b9	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-11 00:15:12.258014+00
982b9752-cd58-4631-85dc-90f3c9d2f025	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 00:25:18.084107+00
4fc5a1bd-8830-49b6-9ae4-6a78dbd540e6	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 00:26:54.176551+00
cab88f6d-e380-46f9-b926-0cb2f94b79e0	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 00:28:38.445894+00
47696b84-27db-47d6-b5ed-494ed20596fd	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 00:30:56.570193+00
173e893e-c820-4689-96ee-2539b0b5c4f4	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 00:55:13.310336+00
6b450283-b1a5-4aed-980c-195384306bc4	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 01:01:04.784482+00
f57b5103-b666-4e85-af90-b0fb57acdbce	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 01:06:25.039333+00
5ad23bf8-6ef4-45a3-ad25-b001a3e224b2	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 01:10:15.291715+00
dae0dc61-dfe1-48ba-bf20-ed6cfa34dd9b	7bc81c9a-9db5-4ac8-a0ac-5e7961db5b7d	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 03:08:55.192273+00
ba9c5704-1e76-4b9a-9693-0be6784d8fda	7bc81c9a-9db5-4ac8-a0ac-5e7961db5b7d	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-11 03:40:54.418587+00
024046cb-b5d7-4cd1-adc0-7a434b19cb08	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 05:25:05.516658+00
944e1a83-d0d5-425d-8396-8319fa72ec36	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-11 05:47:09.709004+00
7448c4cc-0cf8-4637-b75c-a6c48a4377c5	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-11 05:58:38.190763+00
4c63cb93-5605-40e9-aac4-55e0c684c27d	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-11 07:07:10.603789+00
80e5cf0b-1e34-43be-b456-3807a2c90c1a	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-11 09:15:19.265266+00
762009bb-bb90-4ca2-9227-3845a8a10399	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-11 09:46:43.60724+00
b8fb946a-757b-4c8a-8504-d4eadf14410f	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-11 10:19:15.920748+00
ba1b5ceb-a2e6-4919-9424-decc1656605f	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-11 11:30:59.610386+00
4b7df044-fa6f-4a12-9425-2f3dd48e6c34	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-11 12:27:12.477811+00
fbbb16e7-4de3-46df-8359-376b33a85f89	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 12:54:40.672623+00
d5907086-cc15-47f8-b5e8-e4212c24f355	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-11 13:36:22.344814+00
628bd8a4-f193-4e2f-bd77-0f658b0fa841	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-11 13:55:36.858661+00
6ff86121-effc-473a-9864-d461e785c156	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-11 15:16:12.227914+00
1de88084-3dfa-4829-9384-ce005c4ca3e9	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-11 16:40:51.295306+00
5d85ac5c-3652-49aa-a5cf-441e2b786b1a	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 17:14:19.0924+00
6d87ae23-77b5-4cc0-b6a8-4f84d400f5bd	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 17:14:19.097949+00
012528ae-074c-4798-9a8e-4bce1d9115d4	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 17:14:19.2161+00
de464011-9f38-455e-a44e-aa1dd3546bd3	1424b737-4447-4ced-835c-ad9d50ec255f	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-11 22:19:53.437825+00
ba6abad6-42a2-49b3-9272-60c7280fe252	b2803bb9-d737-4420-8eb0-4a6deed56216	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-11 23:00:59.971575+00
baa920be-6ccb-4651-82ec-20d3ca8ace82	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 01:30:39.510341+00
4ad21534-5815-4235-adc4-01856148d1b0	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-12 01:34:05.243646+00
c88a0808-79ec-46cb-b21b-18a460a8ea4d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-12 01:58:23.215634+00
bc90a278-e6c2-4852-a35e-f4922450abe7	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	chat_message	Sent a chat message	\N	2025-09-12 02:01:15.292404+00
fb239c16-a2cd-4202-bc4e-1ad9755a8fc1	9c03719b-0e18-4851-b6ec-0abc3981df9a	1	chat_message	Sent a chat message	\N	2025-09-12 11:26:05.319612+00
0853a9c3-d6c8-472d-8ca5-e491ff8b6d3e	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-12 12:30:25.819113+00
17a8e255-af42-40dd-8bfe-4a5b003f4a89	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 13:18:47.755594+00
3e5f7b8f-102b-4ba7-af6a-293903c730bc	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-12 13:50:28.943119+00
ebdbd252-f613-4d0b-9f61-3dd02680c796	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-12 13:52:07.907758+00
435f802a-5834-4283-a197-bdc47a738401	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-12 14:12:17.471365+00
29e21ddc-98d1-4e24-9c68-86730dc4e5fe	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-12 15:36:04.649465+00
02743b4c-3d2d-4671-a46d-dd4a3abd66ab	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 15:38:44.807726+00
b103f99e-ebe7-463b-82a9-5771440a509d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	7	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-12 16:11:57.70846+00
495a5089-9c7a-42e3-9472-9cb7ef109cc4	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-12 17:11:10.711755+00
a9241abd-1647-4c8a-8f0d-5c5d107b38a0	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-12 18:47:04.285818+00
42b9be77-9898-45cc-bd77-383ded3c80e7	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 20:00:51.96632+00
7126dd51-4065-4437-b6f6-fe920317cd21	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-12 20:01:35.784327+00
11de80fe-e90c-4b7d-8557-5fc3910883cb	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-12 20:23:45.1724+00
d5fdf444-e38b-4e35-b620-9a339a9dbfd0	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-12 20:50:33.023613+00
84da1faf-71f5-4af6-9d28-4d196aa9bb33	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 20:51:35.824805+00
801a127c-b5bb-4aba-a1e0-89d19dab0312	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-12 21:14:44.717555+00
ac2659b3-2ef9-4264-90d8-238eabb80a8b	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-12 21:22:18.132937+00
3bd06c20-bd72-4e3a-8f44-994c658208e6	b2803bb9-d737-4420-8eb0-4a6deed56216	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 21:48:13.547695+00
fb1c6571-3582-4816-93e4-cf299317c603	b2803bb9-d737-4420-8eb0-4a6deed56216	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-12 21:54:00.770163+00
487fee5d-c05c-4c68-a082-ff4218f4c3e2	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-12 23:00:37.068992+00
7f7ebc9c-7445-4f9d-86ea-988c35595ce5	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-12 23:50:24.88966+00
d1f83c90-b208-48a4-b419-46beb32b560c	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-13 00:26:57.858402+00
c2a604bd-8c28-4d89-9c12-23f921ebe565	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-13 00:33:11.485741+00
005210d0-dff9-461d-a879-1390bbc676d4	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-13 02:56:45.58748+00
d981cb55-22aa-47a6-a008-6bec3ef65f0a	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 03:18:48.142019+00
d077b795-ad31-4a10-8670-497a586e5627	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-13 04:56:02.56674+00
585b0d1a-12b7-4671-977a-4c541de1e5fc	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 05:20:31.399833+00
2d8840bb-3e63-4a12-8f39-caa072d0c653	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-13 05:37:01.423226+00
91701617-d196-4530-bde7-76751586c391	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 06:33:46.546002+00
dc5ec581-8424-490f-8bb3-edaf499cdbf1	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-13 07:10:38.31053+00
053e8489-12d8-4656-871b-21cccc079337	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-13 08:08:42.602087+00
da65b844-13e5-49e6-a48a-d5e3882899a6	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-13 08:23:02.374817+00
6df46e68-aef4-450e-9fdc-5ccb751f9676	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 10:28:48.950885+00
aaec8d84-8262-4847-8b63-5525dffa2ad6	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-13 11:23:35.045224+00
89661c46-4561-425e-b742-233d77cf4819	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 11:26:02.79815+00
0957eb2a-b5f1-40e8-a44a-52daeaa730cf	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 11:48:24.908842+00
b94429d8-413c-411e-883a-e638d9fa21a8	ed675b6c-0cd8-4475-aecc-74b921c68b35	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 13:04:00.202809+00
ae8db70e-2b4b-433f-a1c0-5f59390d14cf	ed675b6c-0cd8-4475-aecc-74b921c68b35	9	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-13 13:09:40.915886+00
4c7b8298-de4b-41ec-89cf-e7a7c3c7629e	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 14:36:04.278924+00
391b9f29-34ce-4090-bfe1-e3b9a414e167	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-13 14:52:18.260375+00
d86c9f17-cd68-4746-b0a6-cffe10b45733	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-13 15:07:59.583431+00
bbd2dd75-0a83-4605-a357-b517e309286f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-13 15:33:48.037735+00
c211cbaf-a92d-4011-9d79-d7f779651def	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 19:31:00.536488+00
13361a9b-7706-4fd3-92ea-3c8869f9c533	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-13 19:31:47.89324+00
c5e74ce9-b33c-472b-bedb-8b6318324bc8	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 19:53:46.163372+00
536f1809-d86a-4197-be81-131a119b4bbe	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-13 21:19:28.031659+00
208fe5a6-fade-445f-b3d7-90c340776ad1	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-13 21:49:50.216876+00
1cadd23a-206d-4e36-a460-65744b0e65de	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	1	chat_message	Sent a chat message	\N	2025-09-13 22:31:10.275809+00
5f6caf36-591b-4e6f-b6a5-cd3f883d2d4d	08c375cf-3e32-486b-b211-4c28e6239093	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 22:32:09.813066+00
e90cfd9b-78d4-467a-a297-37d9b652a2ad	08c375cf-3e32-486b-b211-4c28e6239093	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 22:32:11.369998+00
80bd2224-998b-4da3-83cd-8fffdfdbef4f	b2803bb9-d737-4420-8eb0-4a6deed56216	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 23:14:18.03158+00
01caebd9-81ae-4fb4-a848-43e3fdc2acf5	b2803bb9-d737-4420-8eb0-4a6deed56216	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-13 23:19:45.786216+00
3f86f52f-0ddc-487e-bbd9-e866e57f37f5	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-13 23:22:08.591027+00
8704b7da-8587-4c1f-beb4-8a3b9872a2a3	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-13 23:26:01.318805+00
804c1aa0-8efd-493b-aba9-9b45c6194bf4	18d08fe3-6f60-4abc-a51e-75360e88d54c	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-14 03:07:06.376076+00
dbdc9d70-a092-465c-8cc1-75e5c14c25cb	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-14 07:31:35.92782+00
a3f0d33c-120e-42f3-8b04-f654b0aeefea	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-14 11:38:53.750882+00
78ca3670-79e5-4ad8-9c30-1889f83b1e77	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-14 11:40:44.652904+00
7cab5ac3-2b6d-4235-b916-2713b78de618	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-14 12:11:12.308139+00
abddabc4-cc5a-432f-8e36-e1aa02a7762d	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-14 12:27:30.270233+00
31ada3fd-cb72-4b80-bcc8-ae50d47673bd	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-14 12:34:49.059167+00
b7d01780-e04e-4d96-a4a0-f223f7b68c8c	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-14 13:06:42.010051+00
ea71158b-e9bd-482f-92d6-2c53107f2f18	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-14 13:17:26.551323+00
31e38e23-95ae-4d1b-8fea-0114be98bfca	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-14 13:23:52.036744+00
2fca1dbe-2b02-47aa-adf1-25e64502dcfa	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-14 13:27:22.448643+00
3cf1b3ad-a2a1-4eb9-8d28-71d66a1b1e2a	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-14 13:38:06.267751+00
4fb153d4-e290-4277-bd6e-d91bc8a3150f	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-14 15:31:48.851261+00
0471920b-ef6e-48b9-acd0-c2037dcef94a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-14 16:40:00.886194+00
ddc863a0-94c1-4d09-b4bc-22a1039d2bed	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-14 17:48:34.987226+00
31c45c0c-b871-4af2-83cc-6a73dabae39e	55d3fa51-183a-4187-8962-5256b57c4357	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-15 02:53:24.965269+00
7245a447-80d5-4066-ad64-dd750c887717	55d3fa51-183a-4187-8962-5256b57c4357	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 02:54:50.766245+00
118eea77-6a73-4ab9-83c3-0fd7dba985a7	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 03:28:10.385914+00
99a01561-cce3-4962-a099-bab2a8537038	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 03:30:39.493571+00
13b1351f-26e5-4d2e-9a98-e6ec32cb013b	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-15 04:01:46.723403+00
cf077e69-0d8c-42eb-9936-02152f2544f5	271a608c-0b55-4e42-9d13-293ad20e914e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 06:57:46.69337+00
490d0d4a-9791-41f5-a900-184dcc4a7cc9	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-15 07:52:14.8959+00
da883d98-5731-4ae5-a243-5e02de26cdb4	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-15 09:36:22.235407+00
d6726eac-e72a-4c7e-b6a0-5c57e3215ae8	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-09-15 13:14:06.587383+00
cf753e37-f9cb-44b4-8377-20d0ab35455a	08c375cf-3e32-486b-b211-4c28e6239093	1	chat_message	Sent a chat message	\N	2025-09-15 13:16:08.104157+00
fc2699da-23d3-4383-b63f-152c059001f9	9c03719b-0e18-4851-b6ec-0abc3981df9a	1	chat_message	Sent a chat message	\N	2025-09-15 13:17:38.379537+00
e4678a37-461f-42b0-b5d6-f0f99997c5bf	1ad6df3c-856e-415a-913d-be9854827527	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 13:18:09.107924+00
b3b2afd0-26e0-44cb-9947-b8d24c4d853f	94dda7bb-aa8f-47c8-a3be-de2139f94ef9	1	chat_message	Sent a chat message	\N	2025-09-15 13:19:12.576157+00
f9e63986-15e7-47f0-9f8d-da63a49af391	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	chat_message	Sent a chat message	\N	2025-09-15 13:24:06.038003+00
082ec02e-cef0-4cf6-bcca-0afaea67927e	ab68113b-cba7-4243-9544-8d932abcb521	1	chat_message	Sent a chat message	\N	2025-09-15 13:32:32.914169+00
4c7f0e57-5d0a-4a93-b43a-8adfb91d468e	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 13:38:09.77985+00
27e8a4ee-5dad-4cf3-88c3-403e265a6ca0	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-15 14:01:51.993256+00
a3356961-cb19-47d6-9502-45b6cbdd894b	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 14:12:02.803275+00
9e43168f-282b-4a92-946a-97c3dc32fa46	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	chat_message	Sent a chat message	\N	2025-09-15 15:22:42.239962+00
53908156-9ba7-4090-9c18-6f1af14c2be3	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	chat_message	Sent a chat message	\N	2025-09-15 15:25:11.514544+00
aa18e367-48c6-4203-aff8-10bccc87193e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-15 15:40:04.868094+00
23c2b3ff-acc5-4297-a1db-0573369e39ab	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	1	chat_message	Sent a chat message	\N	2025-09-15 16:17:57.90697+00
d693fa4f-de4c-4a16-8c98-9960af85e2d6	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	1	chat_message	Sent a chat message	\N	2025-09-15 16:18:18.557075+00
88e80419-e523-40a8-b3ad-9ce7392bed86	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-15 16:38:00.878135+00
878e5876-b98d-4445-8f85-978c0de8fa82	271a608c-0b55-4e42-9d13-293ad20e914e	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 16:41:23.095904+00
431744c9-2dd4-4a7e-9479-734b32e427a2	8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 19:35:06.309949+00
69abefaf-bf83-4dda-aa02-e07d22f13fe5	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 19:39:51.426123+00
821d06e2-ed87-4dbd-9446-94554116a046	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 19:39:56.49885+00
f8833664-8258-42e8-a27e-ba5d01e04fe6	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 19:40:56.880809+00
5195f234-a237-4477-98d8-f89802039c56	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 19:41:02.000098+00
ad7b3645-5f79-456d-b1a4-8b413e9f1da7	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 20:13:03.174791+00
557889ae-9274-403f-971e-ebca5a58cb13	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-15 20:15:31.999584+00
2c527589-c075-497d-8b32-b07aaf6b1fac	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-15 20:28:51.834603+00
1686ee5f-a6da-43b6-830c-da3505449bdd	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 21:03:13.883761+00
7041ef64-ae18-431c-837a-78ccff603499	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 21:03:20.544291+00
71b42a26-acd1-4d8e-ac82-c960f75c2cb9	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 21:03:28.467543+00
b867e61f-e6c6-404a-b495-9c961ed7b1d3	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 21:08:04.010588+00
4bf63147-ff70-4494-8d5c-5603c16700c4	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 21:08:16.072439+00
d1d5b4c3-bfe7-49c2-aa82-2876349b8c59	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-15 21:08:22.497334+00
b90d6116-abdd-4fed-a286-43780fe2e248	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 21:30:37.004437+00
de423970-1888-47a3-83e5-0e8c282b8302	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 21:30:39.768627+00
4f7236a3-ecc0-44fb-bcae-a8166bca0f4e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-15 21:48:09.222894+00
f7d96ad8-e14f-4daa-bfab-1c1442f04d17	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-15 21:48:13.544458+00
c49c63ad-1e76-448e-8835-f73ce90bb807	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 22:01:59.83524+00
57d51cb8-1f93-4732-b06c-a1219580d761	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 22:02:01.160276+00
fa95dda3-314c-4a3d-8c44-fc03ca3816ff	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-15 22:38:34.828872+00
ac54159e-a383-4887-887a-6a65314c0a4e	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-15 23:01:18.850468+00
918a4229-9485-46c5-96eb-f27c105919c5	08c375cf-3e32-486b-b211-4c28e6239093	1	chat_message	Sent a chat message	\N	2025-09-15 23:05:21.814523+00
69b15dab-e296-4753-a9c0-17e2bbe599a9	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-15 23:43:49.209594+00
909c3bfa-b126-45b8-ba89-8c1a77457f82	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	chat_message	Sent a chat message	\N	2025-09-15 23:59:27.439384+00
8b926334-f887-4173-8b66-c6ad4aa011a6	ed675b6c-0cd8-4475-aecc-74b921c68b35	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 00:20:45.690694+00
dcea3929-0cef-4aa8-b418-99dff33a07ce	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-16 01:33:37.586651+00
b751b729-a177-4f21-9591-46640481552e	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 02:18:25.475064+00
5fc707d2-3b48-455a-880e-3d98fd19eddb	4253f35e-0225-4f27-9c42-1eba42715aea	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 03:34:18.403+00
060e989a-bf84-43ae-acc6-c424a3d930dc	4253f35e-0225-4f27-9c42-1eba42715aea	1	chat_message	Sent a chat message	\N	2025-09-16 03:37:21.541133+00
ef87d585-2217-4c70-a105-e853beb514a6	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 04:13:05.523185+00
5fb21ed3-53c8-42f0-aa57-8bf95a6fea93	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-16 04:43:48.836512+00
e76e280a-73a1-4c78-93a9-e765fadc3e05	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 08:13:00.970312+00
fd0985bb-e2f6-4b3c-a3d9-0f9299dc7a37	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-16 09:51:14.939111+00
0b1ef9e7-4546-4e2e-bcf0-02e3b8664484	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 10:23:54.445109+00
b74d3fc4-340e-4cea-a88b-96ea327e2209	f6560fca-177d-497f-9225-a597ed888589	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 10:38:43.594039+00
a0fc6f6b-8b1b-4f53-9c66-8085ffab8462	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 11:47:37.468145+00
0c463f4b-1693-4d0b-88be-4100a4cf2607	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-16 12:19:35.112337+00
b7670928-e60b-4b40-ab98-5fa6befe783e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-16 15:33:29.958924+00
a596f32b-97e3-46bc-b362-67263f19bc22	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 16:34:05.776732+00
d7609ed6-7f38-4039-9202-b853d7ee4c15	74a895f6-e11e-47a6-b4d3-a89092905776	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 17:13:25.458786+00
b5fe97f6-b4e2-4113-b5af-81be5d1f54ff	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 17:14:08.014042+00
5d2a7bfd-7ee2-4005-bab1-ef4e2632886b	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-16 17:35:58.014812+00
662a5046-2889-4409-bad2-210727249f85	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 17:56:32.558275+00
374811b2-d240-4110-b80d-126b9642b000	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 17:59:11.411022+00
daa42eb5-4a08-4a7b-a35a-f92b34dad354	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 17:59:11.418869+00
d80ddc1e-60f8-465b-8137-1ad20107d511	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 17:59:11.41971+00
8733cb17-5e37-4fff-82ef-782a6256f4ee	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 18:35:38.664314+00
21317d8d-d60e-40bf-afc8-6028ce3566f5	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-16 18:43:11.512734+00
63435d28-5b06-4a90-960d-eed34ad01457	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 18:43:20.499103+00
adcd529e-5eb1-4ff8-8e57-3384f1f0637e	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 18:43:36.143911+00
ff4c9230-bf43-4a29-991e-9ed573900df6	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-16 18:56:31.112947+00
295f9b55-962a-4465-8500-7291ae24e20f	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 19:33:15.604929+00
301ed290-43eb-48e2-930c-b82b4a4e4424	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 19:33:29.751709+00
f33ed46a-28f8-40d6-b3f6-70343e0dce9d	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-16 19:37:00.859943+00
74b65c3b-8acf-4f75-9275-f5b9a043dbf3	ed289706-acf5-4af5-9301-2bfb0128f0f5	4	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-16 19:38:41.218905+00
b69b17d5-6fe4-4cf1-8145-815929d6365a	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-16 22:05:56.481293+00
50c3bdda-af15-4d84-ac2c-eb2b74f8ea34	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 22:13:16.704765+00
84822cec-f76b-4406-a891-e5ad632b5c3d	c644f60a-2f41-41fa-8814-b698c5154474	1	chat_message	Sent a chat message	\N	2025-09-16 22:39:16.020777+00
f6784ab4-bd33-436c-bb01-bbb3fed170ff	c644f60a-2f41-41fa-8814-b698c5154474	1	chat_message	Sent a chat message	\N	2025-09-16 22:39:51.696144+00
f00d7416-296e-4c51-ab74-27b5897e4eeb	c644f60a-2f41-41fa-8814-b698c5154474	1	chat_message	Sent a chat message	\N	2025-09-16 22:39:51.721131+00
8832b706-7ef2-407e-8a80-9491984a8ec7	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-16 22:41:33.340551+00
767e5b0e-c676-49b4-98d7-d2e8bb5072a9	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 22:42:55.176257+00
10a41f5d-b500-4dc3-a25f-94a0266f11e4	c644f60a-2f41-41fa-8814-b698c5154474	7	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 22:43:13.785053+00
29f0de7e-c104-4922-af06-5964a511262f	9c03719b-0e18-4851-b6ec-0abc3981df9a	1	chat_message	Sent a chat message	\N	2025-09-16 22:54:30.431717+00
ed66aaee-1081-4c5e-aa93-345cb0809883	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	1	chat_message	Sent a chat message	\N	2025-09-16 23:02:08.609275+00
5ca1e2c4-4f11-4ddd-9087-1ba7d28dd2fd	9c03719b-0e18-4851-b6ec-0abc3981df9a	1	chat_message	Sent a chat message	\N	2025-09-16 23:04:44.061897+00
655f0fc6-1c2c-4635-8ed5-0537985a4b42	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-16 23:16:38.480029+00
19ffa2c7-f11a-4f9d-a69a-99596f09688e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-16 23:17:15.149366+00
58be68fb-92c1-4949-a91a-26bcf5f44f60	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	chat_message	Sent a chat message	\N	2025-09-16 23:17:15.2191+00
e2d7c640-b232-48b3-95ca-f5a3d7c467af	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-16 23:20:32.133257+00
137fdca5-41ae-4397-a071-04b6999ea6bb	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-16 23:49:39.549279+00
abf72fc6-de5c-4bde-a2a9-cc4a66045373	c644f60a-2f41-41fa-8814-b698c5154474	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:09:56.754018+00
b4530a6b-2421-4760-9fc0-a9b76681e37f	c644f60a-2f41-41fa-8814-b698c5154474	1	chat_message	Sent a chat message	\N	2025-09-17 00:10:16.501387+00
0cdbf185-5748-479a-a09a-539a0d929d3e	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:12:49.647918+00
eaa4641d-7304-4816-a615-26cb44e7ac86	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:12:56.129713+00
71df5fa8-ba64-4979-a45a-38073e4f8f5b	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:13:52.056318+00
f2ef6f9e-7255-424d-8c5f-d7ad85f87308	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:14:05.328369+00
264e820d-5cbf-4e62-bbf4-8ffb7e4feb56	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:14:14.157259+00
3a0c042c-04ab-4d0e-aa9c-0a04cd9d6ba9	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:14:54.112114+00
28e88280-3066-4c55-9970-f01117e4d5b8	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:15:06.335294+00
dfceaf0d-4427-4317-9bcb-a6ac103c8936	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:16:54.728459+00
4165255d-4995-43c8-94e1-aac118a377df	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 00:17:08.111152+00
b4a7cb8e-af90-4eda-b097-5fc1fb9cf1f2	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 01:05:28.607114+00
309812b9-db5d-463a-9c71-d42f016237d3	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 01:16:54.271723+00
68b98167-9f8f-4500-8b60-bc5a3665d96e	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 01:18:39.696001+00
132797ac-1cb6-4f94-a20a-b05879d821f7	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 01:26:46.42116+00
f7c996ad-b101-454d-a7a7-2e91f1ea5c10	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 01:27:27.03519+00
05f42843-b957-4db5-bc81-9c79a5da2e0a	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 01:27:45.640887+00
781fc27e-abe8-4023-950c-ee85da9e30b6	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 01:36:59.853666+00
6b9d9295-1506-4d79-8c09-1f8d269833df	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-17 01:40:56.089075+00
17510d0c-e3ed-42fc-b71e-b86e389d3125	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 02:05:39.30615+00
fad830b7-3d69-41ea-a1d5-d20b6cc80dd1	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-17 02:06:15.321797+00
767b1b8d-1bb1-4700-a06c-2e0118fcd3d8	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 03:06:32.693114+00
754561a2-6df7-453e-a6fe-83a84d8e512a	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-17 03:36:52.708478+00
2b5ae8c7-c61c-4554-8fc1-75774c0f5993	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-17 03:37:06.710528+00
90c5654a-1bde-40b1-afbd-cdb9b7c90a86	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 07:05:13.74894+00
44e42516-9ab7-4058-943a-1b11d4ca6513	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-17 07:36:55.419501+00
20c80e14-05ad-47d4-802f-af6f4cc72069	ab68113b-cba7-4243-9544-8d932abcb521	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 11:44:56.405247+00
dc773ee4-9494-4f61-8900-c087a0ae258d	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 12:56:45.92871+00
0f1c22dc-c264-4ed4-9100-9de8be24d20c	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 13:03:03.644341+00
e119e802-52d9-42bf-8fa7-40f36b00a105	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 13:05:42.560866+00
b7e0959a-f7fa-4d3c-94d7-9621ace08bd3	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 14:26:43.046835+00
54456315-41ee-4d6a-b5a7-229fc7fe0ada	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 14:30:55.178889+00
74b95f4e-3476-4357-9d7d-509ef3086e93	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-17 14:53:42.113304+00
35f1c981-2311-4555-882f-51f039c8f26e	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-17 15:05:30.96687+00
d7a52ba8-b453-4d61-be8b-9a887b08ab87	5f250128-655b-41a4-af15-9df32a5ca672	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-17 15:10:13.3794+00
2712bbe8-c6c0-4d66-bfc1-39b2f9f089c8	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-17 16:37:19.558439+00
469482f4-fafa-4cff-bb7d-f980f1dc88a3	c644f60a-2f41-41fa-8814-b698c5154474	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 18:28:32.02751+00
739b8fd7-731f-41cb-a289-ee2d50bbe630	c644f60a-2f41-41fa-8814-b698c5154474	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 18:28:39.975564+00
628f4c1c-679d-4997-8880-3ac918260efc	c644f60a-2f41-41fa-8814-b698c5154474	8	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 18:28:41.999002+00
096be8ef-e8b8-43ba-8c68-08d250e02eda	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 19:24:09.494767+00
ee5b1e56-29cb-4ba9-a130-0d02c9955642	ed289706-acf5-4af5-9301-2bfb0128f0f5	9	elite_habit_completion	Completed elite habit exercise	\N	2025-09-17 19:24:16.143416+00
3cd1d27e-a7f8-4cca-bdbc-374f860708bf	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-17 21:07:38.13713+00
8f0bb825-de74-4367-bb77-5acee2026d5d	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-17 21:10:24.776409+00
c70f86cf-ec24-4ea1-8a9a-7884214a239f	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-18 02:20:16.89665+00
7a214c73-d643-4f30-81bd-9ce17f4ab664	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-18 02:35:58.842025+00
02b239f1-fc95-4b36-bfff-64eeb7c30928	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-18 03:28:50.942465+00
3f4b41eb-388e-4bcd-96a0-49347c42a41c	55d3fa51-183a-4187-8962-5256b57c4357	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 04:45:08.685001+00
b85e0454-7242-44af-9f63-089e951568ae	ed289706-acf5-4af5-9301-2bfb0128f0f5	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 05:25:53.862531+00
79c9e45f-1572-4f62-8976-33627fe8f2a3	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 05:48:29.004126+00
024c91b3-41c3-4a30-9b76-845f41024ee1	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-18 05:50:52.688527+00
5266eb11-7ddf-40f0-92f3-deb2528c1363	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-18 06:22:14.230739+00
6f551df0-f1ed-44ec-8d5e-6e0b31b4703e	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 07:56:14.913388+00
6b39c7a4-d999-4ad7-ab5a-4767f351f8c3	75d762bc-5f6a-4f8e-aec0-861dee0b2b0c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-18 10:22:52.620748+00
8014a4d1-182b-4695-98f2-a74bb668dfdf	ed675b6c-0cd8-4475-aecc-74b921c68b35	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 11:42:34.374303+00
2a61410d-fd60-44e8-8b1e-d29e2e122d06	3da83afb-aa8c-4c55-b3b0-8aa64000205f	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 12:37:06.798957+00
f4663834-6593-4d7d-9888-bc2546b6b98d	2c332ea1-c255-4dd1-b7b9-d45c33c128f0	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-18 13:28:18.649272+00
f02fde7a-6ce2-4346-ad1d-a129294e047a	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-18 15:54:23.156167+00
4e0acdea-cbff-4940-a7eb-c125df65c7be	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-18 16:15:01.390984+00
99d8ee05-8fda-4801-9f95-b2e504b5a647	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-18 18:35:23.429493+00
a66c0c14-357b-49e3-af0a-49c7f91352e0	3da83afb-aa8c-4c55-b3b0-8aa64000205f	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 18:35:31.688799+00
6bbb1bdc-e869-48bc-b29e-feb8395dd0c9	3da83afb-aa8c-4c55-b3b0-8aa64000205f	9	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 18:35:40.46681+00
9ace9229-c0a9-4b88-ab0e-9e620ae1a6e2	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 18:54:39.442037+00
a02bd995-6dbe-4904-84aa-70c3782e8c4d	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 18:55:14.175743+00
d97d12c7-aef3-4c7e-8650-64c46b6f8abf	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-18 19:17:48.544503+00
5eabe369-7755-4d2a-b040-490fa555e14a	e0d3d6b1-5b49-4920-995e-1e15d25f22b4	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-18 19:26:50.530198+00
3d4508b2-3b10-4acb-9657-aa66b3b77841	c644f60a-2f41-41fa-8814-b698c5154474	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-18 22:00:26.570419+00
81e11497-2c41-4d81-9958-6344136226b4	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-18 22:03:35.512+00
c86749b0-1632-47d0-8c1e-f414652bfbba	c644f60a-2f41-41fa-8814-b698c5154474	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 23:16:29.865565+00
2489080d-352a-4fa8-89b6-95df320c06d4	ede52dc6-fc72-4a3f-bfd3-fcbcd19b0051	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-18 23:36:29.175055+00
076f8e51-3e42-4085-95c9-ed3aa348886b	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-19 03:11:27.973217+00
5af5593b-7496-4800-9e98-12070190652f	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-19 03:43:17.034192+00
d9779315-8579-4300-bbe5-ad310d7933ec	93819275-d50f-40d7-b404-6e1043b33265	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-19 07:50:07.714643+00
7e3f3949-9c7c-4991-9049-654485c351ed	93819275-d50f-40d7-b404-6e1043b33265	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-19 07:53:23.215233+00
74181656-d944-4dbf-a7de-343a3c093a30	93819275-d50f-40d7-b404-6e1043b33265	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-19 07:56:02.431903+00
51ff2621-5c52-4b57-a888-7a0d8d9adc16	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-19 11:27:51.003924+00
a5ff7cf3-6f45-4564-ac3f-7c4d3aa82e11	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-19 11:34:16.601074+00
86fcb862-2afd-4d12-a8b2-ac373d3827d3	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-19 12:06:51.605627+00
7de0a421-8bbd-4c95-b703-128d6767802c	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-19 12:11:18.656742+00
f861a761-e875-4e68-be95-50fcc2f41aa2	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-19 12:16:41.615812+00
1f3ca254-6eb2-4486-a4b3-019d88421248	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 3 - Syukur Meditation	\N	2025-09-19 14:49:28.209909+00
2378d684-afa5-4a41-aeed-e9a43d56263e	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-19 15:35:42.914288+00
7b1f2146-5e03-4671-979d-6368ccc9038d	08c375cf-3e32-486b-b211-4c28e6239093	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-19 16:02:04.770223+00
294528d6-4417-415d-8055-57742fafd042	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-19 17:04:38.951914+00
02b70816-6e50-4d99-8b32-9562804b5c6f	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-19 18:28:27.026669+00
f509a743-dc0f-47b4-9c1a-d786d358cd84	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-19 18:28:50.207296+00
83119c91-740d-4052-ab0c-1c79bc0ed95c	22c2ab08-6a42-44c3-b290-dedba2161dd0	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-19 21:08:30.822412+00
9573c411-cf12-46bb-930a-4709f2169391	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Verse 8 - Love Magnet	\N	2025-09-19 23:02:41.987222+00
069fc98c-3698-4c59-8909-e33a04be3315	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-20 02:38:07.959977+00
05e6671f-ce9e-40c4-b5da-45f50999ef01	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 02:38:32.616776+00
c0a4b781-4b85-470f-afc0-cc09201a66ef	74a895f6-e11e-47a6-b4d3-a89092905776	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 02:40:04.019092+00
1a16dfd9-3e40-4af3-b161-72de3904f836	74a895f6-e11e-47a6-b4d3-a89092905776	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-20 03:02:06.503406+00
079c7327-eb08-4d66-8430-392bd37aecf2	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-20 04:47:18.745424+00
26018d74-3f6d-4f78-8da6-46122e1bf582	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 05:20:29.025223+00
0e0b7724-0c66-4a15-835c-9199ca014cb4	22c2ab08-6a42-44c3-b290-dedba2161dd0	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 07:20:01.914012+00
d4bbe945-825d-419c-ad41-3be8e3f6f548	ed675b6c-0cd8-4475-aecc-74b921c68b35	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 08:26:48.121709+00
e19fb05f-015e-4cb0-bb65-a310f661cf32	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-20 09:20:24.541755+00
2859d5d8-ee44-459d-b08a-d4938043a6cf	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 09:27:12.997504+00
c0cce61b-73a7-4d77-850a-0dd759ee8bdf	f6492019-02bb-4783-b172-53f7e71bdc5c	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 09:41:08.442548+00
e085f886-680d-4c31-b282-879491bd6b91	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 10:13:37.649141+00
14cd5d43-af56-4fc8-9f58-d3005b84c581	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 10:18:36.008845+00
1b72f8f5-190b-4baa-8852-3698c085cb98	5d73bb7b-d8f1-4db6-96e4-c6682b9e84cd	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 10:19:24.431228+00
b21efe7e-99a1-4c16-a2b0-3c2c090765a7	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-20 10:28:47.203172+00
a9a0cf66-79cd-43cd-9d3f-8c0b18c67260	fa12011b-2a8f-41de-9bce-f9b6904d7da1	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 10:30:33.521134+00
fd4327f4-1266-4384-b070-8b583d45ef2e	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-20 10:48:54.167962+00
1bd1fc23-0b04-4df9-8f40-71679769337a	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Verse 8 - Love Magnet	\N	2025-09-20 11:31:28.795624+00
1dacde12-7ab1-4dc5-ba14-2488824c2be3	2c89253b-a0cd-4217-acdc-f98d84d21dca	9	verse_completion	Completed Verse 8 - Love Magnet	\N	2025-09-20 11:52:06.719419+00
752b3ced-8477-4e9a-bb81-27121baef2a3	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-20 13:20:21.262968+00
3277c324-9f1e-412f-9e9e-b573e803716c	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-20 13:23:38.11444+00
e6d94ab5-632c-4d3c-b085-63ff9ce5f107	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 5 - Vitality Vortex	\N	2025-09-20 13:47:38.364843+00
e04fde5f-f7fd-41fa-a5b8-c833e726e303	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-20 15:48:47.079288+00
ac4e81ac-0c61-4361-930b-52c92332297b	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-20 23:57:43.868053+00
a230202b-34c5-4017-b0b1-ce6321df937c	ed675b6c-0cd8-4475-aecc-74b921c68b35	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-21 00:10:02.681406+00
45bdb00e-895e-4bce-b8d5-ffad56a3f9ad	6c665bce-5174-4d59-ad9a-077feccd68be	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 01:26:43.477177+00
3707a216-188b-4b83-a16b-829a8dab88ef	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 01:31:13.707431+00
42ad5a14-723d-4d86-a1c9-909afdd0a8a4	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 01:33:54.62857+00
534706fc-d6ab-42d9-8dd1-0606bdd42b30	b1cd65df-f61b-41f8-82da-c87dcb1f75c9	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-21 01:35:02.470777+00
f1d274fc-4bd3-46ff-ba8a-5592c1a731c7	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-21 01:40:00.770176+00
cd7a4847-55be-4881-84a7-7258f5666f53	c644f60a-2f41-41fa-8814-b698c5154474	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-21 02:08:37.231646+00
b2bb3e49-5f1e-41af-ab81-e4ba8e7fb621	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-21 11:21:57.055867+00
197bb1ef-5daf-43de-9a94-76a84a4788e4	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 11:31:16.317829+00
34799b19-ba61-48f1-84d8-e0cfea7905bc	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-21 11:43:20.19356+00
e85cd2eb-d84b-4d50-bf0f-05c87b6c651d	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-21 11:47:22.560582+00
b19ef62a-536b-450d-bca7-5d870ed6fba3	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 11:50:05.976718+00
51da7616-4fab-46df-a478-6a832f785343	9dd6879a-ec87-4bd9-ad21-1eb6b16c7c95	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-21 12:18:18.290884+00
513d19a7-3285-4091-9ec1-98f2fe6eddb5	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 2 - Lucid Beach	\N	2025-09-21 12:22:34.425793+00
8a2c7eb0-77ea-4986-be71-c0f796474447	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 13:14:00.4373+00
8effaa03-9809-4afb-bf48-e6d24b41c4cb	4ae66262-c0c1-41d4-b9dd-684dd282bdfc	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-21 13:20:55.792065+00
a2d0fce7-75ba-46c9-ad40-10021ea36681	4ae1cbdb-6b1a-43e2-9f85-475f61fa1c9e	10	verse_completion	Completed eL Vision Delta Breathing	\N	2025-09-21 13:53:13.522851+00
f7a8390a-5cc5-4c4d-a1d1-831a5a73ca7a	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-21 17:13:34.657032+00
10b37f3d-227c-4ecb-afd8-0929ba9e0a19	271a608c-0b55-4e42-9d13-293ad20e914e	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-21 17:17:05.716858+00
cd80d255-d336-4e71-abb8-26ddd4fc95cb	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 03:52:52.369985+00
d041282b-73be-4ac0-86de-3f29259c5f6d	18d08fe3-6f60-4abc-a51e-75360e88d54c	10	verse_completion	Completed Verse 1 - The Space Hill	\N	2025-09-23 04:14:35.47558+00
ec18e859-4168-4116-8153-efae21cb9d8c	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-23 05:12:57.695819+00
47f6bf15-2310-4d3b-994f-e934bb012509	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	10	elite_habit_completion	Completed elite habit exercise	\N	2025-09-23 05:16:04.725477+00
fa92a142-06fa-4d9e-91ad-8e7de06309ae	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 05:43:36.42629+00
9b5983f3-8fed-43c2-aa8a-eaf111560051	fa12011b-2a8f-41de-9bce-f9b6904d7da1	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-23 07:19:29.825241+00
03f0bfbb-d277-4dae-aa8e-70f6b86a7cc5	ed289706-acf5-4af5-9301-2bfb0128f0f5	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 08:28:40.051609+00
b73b4610-f508-49c9-a4ad-b831f0fa8c86	2c89253b-a0cd-4217-acdc-f98d84d21dca	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 11:20:24.834351+00
2c3409d2-62c3-4ca9-aa06-66f1456af5b1	2c89253b-a0cd-4217-acdc-f98d84d21dca	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 11:29:15.592511+00
6841dde3-f15c-4ade-a635-0fe1c20d243c	f6560fca-177d-497f-9225-a597ed888589	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 13:16:04.827548+00
d1f93e3e-6e09-40ff-9028-36e54f12a621	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 13:18:48.127011+00
ea9f038a-2a65-47b7-9462-c979823b65e7	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	1	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 13:22:03.80441+00
e1f94a5e-bf87-4459-8d08-7eac8c482155	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 13:23:18.537573+00
b11cac7d-b537-49ba-af77-f111be0f1a9b	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 13:23:44.760734+00
02b234a5-4d0b-4c4f-bca1-79dd64166ab3	cdc1eaeb-10e8-49cf-a324-14c9d7666fbd	1	journal_completion	Completed spiritual journal reflection	\N	2025-09-23 13:24:09.633502+00
57fb8e74-6fb5-4e16-bdc6-7d8ec6bf7706	f6560fca-177d-497f-9225-a597ed888589	10	verse_completion	Completed Verse 4 - Prosperity Stream	\N	2025-09-23 13:49:20.19296+00
fc867c25-1ee5-413a-b185-44827b33c97a	4f065a25-a458-4d75-86cc-bf80e8009f4c	10	verse_completion	Completed Guided to Inner Silence	\N	2025-09-23 13:49:50.960199+00
\.


-- Completed on 2025-09-23 21:20:43 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict oMLKgheVKDpYte3eDA6rdOlMN1agCSZjQ1REh4QAwNfNn2B2daLQiw6iZhXxTBN

