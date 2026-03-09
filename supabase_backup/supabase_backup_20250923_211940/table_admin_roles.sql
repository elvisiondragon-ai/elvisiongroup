--
-- PostgreSQL database dump
--

\restrict 73mkLQEagXQEkHjeGZvXVw0wyMFEopWdlXGIAyP34hqF3rvhG3AxAHegeCTitws

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:50 WIB

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
-- TOC entry 4074 (class 0 OID 155700)
-- Dependencies: 361
-- Data for Name: admin_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_roles (id, user_id, role, granted_by, granted_at, expires_at, is_active, user_email) FROM stdin;
f5f48e08-3728-467b-9414-faa2511036ed	8c2cd3b1-6b77-4df9-92c5-467182ecd13d	super_admin	8fa357c9-4450-4e90-b3c9-6886f7159287	2025-08-21 18:01:43.707646+00	\N	t	elvisiondragon@gmail.com
\.


-- Completed on 2025-09-23 21:20:53 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict 73mkLQEagXQEkHjeGZvXVw0wyMFEopWdlXGIAyP34hqF3rvhG3AxAHegeCTitws

