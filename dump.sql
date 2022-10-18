--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ranking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ranking (
    id integer NOT NULL,
    "visitsCounter" integer NOT NULL
);


--
-- Name: ranking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ranking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ranking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ranking_id_seq OWNED BY public.ranking.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    token character varying(36) NOT NULL,
    "userId" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: shortUrls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."shortUrls" (
    id integer NOT NULL,
    "shortUrl" text NOT NULL,
    visits integer DEFAULT 0 NOT NULL,
    "urlId" integer
);


--
-- Name: shortUrls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."shortUrls_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shortUrls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."shortUrls_id_seq" OWNED BY public."shortUrls".id;


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    url text NOT NULL,
    "sessionId" integer
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: ranking id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking ALTER COLUMN id SET DEFAULT nextval('public.ranking_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: shortUrls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."shortUrls" ALTER COLUMN id SET DEFAULT nextval('public."shortUrls_id_seq"'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ranking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (3, '8210fd56-bd88-45c4-89d0-da90674f26ba', 12, '2022-10-17 14:19:07.473114');
INSERT INTO public.sessions VALUES (4, '7165f6aa-8b9d-460f-9ed3-aa827d84fb59', 17, '2022-10-17 19:39:55.307567');


--
-- Data for Name: shortUrls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."shortUrls" VALUES (8, '6f-Vi50ZlCjK6lJgdUL5R', 6, 18);
INSERT INTO public."shortUrls" VALUES (9, 'be49Fvzds24t5pFlllMZs', 0, 20);
INSERT INTO public."shortUrls" VALUES (10, 'WP_Q4erN9-Z4gIkx6yZxp', 0, 21);
INSERT INTO public."shortUrls" VALUES (11, 'wuPgBP20QNhoA_Gy6UdK8', 0, 21);
INSERT INTO public."shortUrls" VALUES (12, 'qKlsVZ8t_pk8TLdqgZ5fj', 0, 23);
INSERT INTO public."shortUrls" VALUES (13, 'RWi8oA7nf6yJfsBaiKSQJ', 0, 24);
INSERT INTO public."shortUrls" VALUES (14, 'Dytrge4CxpN2ayeVsYsMt', 0, 25);
INSERT INTO public."shortUrls" VALUES (15, 'FqI2lW6uPhZE6nZ4B24vl', 0, 26);
INSERT INTO public."shortUrls" VALUES (16, 'hg-KiAbPgXWMD0ao_q3IS', 14, 27);


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (18, 'http://www.google.com', 3);
INSERT INTO public.urls VALUES (19, 'http://www.google.com', 3);
INSERT INTO public.urls VALUES (20, 'http://www.amazon.us', 3);
INSERT INTO public.urls VALUES (21, 'http://www.youtube.com', 3);
INSERT INTO public.urls VALUES (22, 'http://www.youtube.com', 3);
INSERT INTO public.urls VALUES (23, 'http://www.gool.com', 4);
INSERT INTO public.urls VALUES (24, 'http://www.cifra.com', 4);
INSERT INTO public.urls VALUES (25, 'http://www.pepe.com', 4);
INSERT INTO public.urls VALUES (26, 'http://www.cooking.com', 4);
INSERT INTO public.urls VALUES (27, 'http://www.clickjogos.com', 4);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (12, 'jansen', 'jansen@email.com', '$2b$10$OdyTBaF6x2dPEuvX3Kvgq.fLE4CsAqoksbgD5HxXJT0iJVpGztj.S');
INSERT INTO public.users VALUES (13, 'João', 'joao@driven.com.br', '$2b$10$8M5vsYn7mhlPRCfp6EnOCef/KZC.k6Ew6DIOgOu5yLg78FuxSc4KG');
INSERT INTO public.users VALUES (14, 'ze', 'jze@email.com.br', '$2b$10$.k68bf4yyCpUORQvnb1qS.4igEBQvoroufgt9QNl7UN6Fb4DEm9VG');
INSERT INTO public.users VALUES (15, 'ze', 'ze@email.com.br', '$2b$10$L.Wus8XFLSVSmbigzVj6luKdJdHbZV9kFsAr9nkwmanDnF7LHnICu');
INSERT INTO public.users VALUES (16, 'miro', 'miot@email.com.br', '$2b$10$mj30yeJBzF/kIAHrtyWxc.VhaPNvh6I9R6.L0MqDYbQS0Rc3nTp7m');
INSERT INTO public.users VALUES (17, 'ju', 'ju@email.com.br', '$2b$10$J/KWQPEFK9tKrQbPTUYut.rZ.X3TAWFhWHirw/RgUtTXR/ztnHfMW');
INSERT INTO public.users VALUES (18, 'cleito', 'cleito@email.com.br', '$2b$10$F5RK.rSlIOCTk9VnOCsxPegqjcgRR2TiHg94exSAHK6ZOIyaNCK5C');


--
-- Name: ranking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ranking_id_seq', 1, false);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 4, true);


--
-- Name: shortUrls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."shortUrls_id_seq"', 16, true);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 27, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: ranking ranking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT ranking_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_key UNIQUE (token);


--
-- Name: shortUrls shortUrls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."shortUrls"
    ADD CONSTRAINT "shortUrls_pkey" PRIMARY KEY (id);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ranking ranking_visitsCounter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking
    ADD CONSTRAINT "ranking_visitsCounter_fkey" FOREIGN KEY ("visitsCounter") REFERENCES public."shortUrls"(id);


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: shortUrls shortUrls_urlId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."shortUrls"
    ADD CONSTRAINT "shortUrls_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES public.urls(id) ON DELETE CASCADE;


--
-- Name: urls urls_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT "urls_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

