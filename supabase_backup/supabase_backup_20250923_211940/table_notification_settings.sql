--
-- PostgreSQL database dump
--

\restrict 7t9sBDe0C8lwd0QgPaZXYjWi52AZ8UfkMkF9dRCz8KbNLWAf6GpCAG1hOp9mSaa

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:43 WIB

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
-- TOC entry 4072 (class 0 OID 155804)
-- Dependencies: 375
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_settings (id, user_id, chat_notifications_enabled, quiet_hours_start, quiet_hours_end, created_at, updated_at) FROM stdin;
a3ff60f1-5e95-4fcc-867c-c3d66e34cea5	a2e8495f-d2c1-4e04-9db5-faa976f59207	t	\N	\N	2025-08-15 08:49:53.480925+00	2025-08-15 08:49:54.681093+00
25e7fbec-d886-4e26-9f75-47bcbfe476ae	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	t	\N	\N	2025-08-16 01:09:09.171755+00	2025-08-16 01:09:10.213575+00
1c993f62-9de9-4604-8be9-57b9c70abc30	3da83afb-aa8c-4c55-b3b0-8aa64000205f	t	\N	\N	2025-08-13 15:06:11.5091+00	2025-08-26 14:14:40.300081+00
a314d036-4055-42b0-9207-36c67f424e0a	23986a5e-3b51-4813-b0e2-d6f8fe4e7b0a	t	\N	\N	2025-08-28 14:27:11.846702+00	2025-08-28 14:27:13.439857+00
\.


-- Completed on 2025-09-23 21:20:47 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict 7t9sBDe0C8lwd0QgPaZXYjWi52AZ8UfkMkF9dRCz8KbNLWAf6GpCAG1hOp9mSaa

