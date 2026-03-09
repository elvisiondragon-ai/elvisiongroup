--
-- PostgreSQL database dump
--

\restrict Po8OzuQlaX31RLV8XX7onBFtwCARMrDlBnYdAhyhl8c8O7tIQDfrlWGDT3y8Gng

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Homebrew)

-- Started on 2025-09-23 21:20:47 WIB

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
-- TOC entry 4066 (class 0 OID 155881)
-- Dependencies: 382
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, name, description, price, currency, duration_days, payment_method_code, payment_method, is_active, created_at, updated_at) FROM stdin;
1_year	1 Year Subscription	Annual subscription with full access	800000	IDR	365	BCAVA	BCA Virtual Account	t	2025-08-20 02:01:52.12394+00	2025-08-20 02:01:52.12394+00
1_month	1 Month Subscription	Monthly subscription with full access	100000	IDR	30	BCAVA	BCA Virtual Account	t	2025-08-20 02:01:52.12394+00	2025-08-20 02:01:52.12394+00
1_week	1 Week Subscription	Weekly subscription with full access	30000	IDR	7	BCAVA	BCA Virtual Account	t	2025-08-20 02:01:52.12394+00	2025-08-20 02:01:52.12394+00
1_day	1 Day Subscription	Daily subscription with full access	4000	IDR	1	BCAVA	BCA Virtual Account	t	2025-08-20 02:01:52.12394+00	2025-08-20 02:01:52.12394+00
\.


-- Completed on 2025-09-23 21:20:50 WIB

--
-- PostgreSQL database dump complete
--

\unrestrict Po8OzuQlaX31RLV8XX7onBFtwCARMrDlBnYdAhyhl8c8O7tIQDfrlWGDT3y8Gng

