--
-- gitpodQL database dump
--

-- Dumped from database version 13.2 (Debian 13.2-1.pgdg100+1)
-- Dumped by pg_dump version 13.2

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: cycle_cadence_enum; Type: TYPE; Schema: public; Owner: gitpod
--

CREATE TYPE public.cycle_cadence_enum AS ENUM (
    'YEARLY',
    'QUARTERLY'
);


ALTER TYPE public.cycle_cadence_enum OWNER TO gitpod;

--
-- Name: key_result_custom_list_binding_enum; Type: TYPE; Schema: public; Owner: gitpod
--

CREATE TYPE public.key_result_custom_list_binding_enum AS ENUM (
    'MINE'
);


ALTER TYPE public.key_result_custom_list_binding_enum OWNER TO gitpod;

--
-- Name: key_result_format_enum; Type: TYPE; Schema: public; Owner: gitpod
--

CREATE TYPE public.key_result_format_enum AS ENUM (
    'NUMBER',
    'PERCENTAGE',
    'COIN_BRL'
);


ALTER TYPE public.key_result_format_enum OWNER TO gitpod;

--
-- Name: team_gender_enum; Type: TYPE; Schema: public; Owner: gitpod
--

CREATE TYPE public.team_gender_enum AS ENUM (
    'MALE',
    'FEMALE',
    'NEUTRAL'
);


ALTER TYPE public.team_gender_enum OWNER TO gitpod;

--
-- Name: user_gender_enum; Type: TYPE; Schema: public; Owner: gitpod
--

CREATE TYPE public.user_gender_enum AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public.user_gender_enum OWNER TO gitpod;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cycle; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.cycle (
    date_start timestamp without time zone NOT NULL,
    date_end timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    team_id uuid NOT NULL,
    title character varying NOT NULL,
    cadence public.cycle_cadence_enum NOT NULL,
    parent_id uuid,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.cycle OWNER TO gitpod;

--
-- Name: key_result; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.key_result (
    title character varying NOT NULL,
    goal numeric NOT NULL,
    initial_value numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    description text,
    format public.key_result_format_enum DEFAULT 'NUMBER'::public.key_result_format_enum NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    objective_id uuid NOT NULL,
    team_id uuid NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.key_result OWNER TO gitpod;

--
-- Name: key_result_check_in; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.key_result_check_in (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value real NOT NULL,
    confidence integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    key_result_id uuid NOT NULL,
    user_id uuid NOT NULL,
    comment text,
    parent_id uuid
);


ALTER TABLE public.key_result_check_in OWNER TO gitpod;

--
-- Name: key_result_comment; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.key_result_comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    key_result_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.key_result_comment OWNER TO gitpod;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO gitpod;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: gitpod
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO gitpod;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gitpod
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: objective; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.objective (
    title character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    cycle_id uuid NOT NULL,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    owner_id uuid NOT NULL
);


ALTER TABLE public.objective OWNER TO gitpod;

--
-- Name: team; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.team (
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    description text,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    parent_id uuid,
    owner_id uuid NOT NULL,
    gender public.team_gender_enum
);


ALTER TABLE public.team OWNER TO gitpod;

--
-- Name: team_users_user; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public.team_users_user (
    team_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.team_users_user OWNER TO gitpod;

--
-- Name: user; Type: TABLE; Schema: public; Owner: gitpod
--

CREATE TABLE public."user" (
    authz_sub character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role character varying,
    picture character varying,
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    gender public.user_gender_enum,
    first_name character varying NOT NULL,
    last_name character varying,
    nickname character varying,
    linked_in_profile_address character varying,
    about text
);


ALTER TABLE public."user" OWNER TO gitpod;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: cycle; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.cycle (date_start, date_end, created_at, updated_at, id, team_id, title, cadence, parent_id, active) FROM stdin;
2021-01-01 00:00:00	2020-12-31 00:00:00	2021-01-22 18:03:12.860225	2021-01-22 18:03:12.860225	8930091c-58ff-4998-9bc4-b3193ad01409	92c82e64-836c-44a5-a8c1-0db63cd340b3	2021	YEARLY	\N	t
2021-01-01 00:00:00	2021-03-31 00:00:00	2021-01-22 18:03:12.854502	2021-01-22 18:03:12.854502	8311f810-120b-4a06-a62a-d1937dba2cbf	0788abd6-4996-4224-8f24-094b2d3c0d3a	Q1	QUARTERLY	8930091c-58ff-4998-9bc4-b3193ad01409	t
2020-12-12 00:00:00	2021-03-02 00:00:00	2021-03-18 19:56:13.162328	2021-03-18 19:56:13.162328	2343197f-6bd7-4336-b276-dd94a4a7951d	d6310cc8-cc17-499b-a28c-5c600dd9714a	Q2	QUARTERLY	14b945eb-1121-48be-835a-4cf3ea96ba83	t
2020-12-12 00:00:00	2020-04-01 00:00:00	2021-02-18 14:38:17.526585	2021-02-18 14:38:17.526585	14b945eb-1121-48be-835a-4cf3ea96ba83	d6310cc8-cc17-499b-a28c-5c600dd9714a	2020	YEARLY	\N	t
2021-01-01 00:00:00	2021-02-28 00:00:00	2021-03-08 15:10:31.072826	2021-03-08 15:10:31.072826	0ed6c56e-d910-4486-bdaa-876e14e81c4f	92c82e64-836c-44a5-a8c1-0db63cd340b3	Q1	QUARTERLY	14b945eb-1121-48be-835a-4cf3ea96ba83	t
2021-01-01 00:00:00	2021-03-31 00:00:00	2021-01-22 18:03:12.864608	2021-01-22 18:03:12.864608	180dbf7c-69c7-42f6-9559-3b41ecc7a162	f5127ee8-3a54-4f48-a718-8ed5296532e6	Q1	QUARTERLY	\N	t
\.


--
-- Data for Name: key_result; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.key_result (title, goal, initial_value, created_at, updated_at, description, format, id, objective_id, team_id, owner_id) FROM stdin;
Explore Earth solar system	100	0	2021-01-22 18:03:12.887531	2021-01-22 18:03:12.887531	In this key result, we are aiming to explore the entire earth solar system	PERCENTAGE	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	638c682c-885b-480e-9df7-ce57a5e4f182	d6310cc8-cc17-499b-a28c-5c600dd9714a	922ef72a-6c3c-4075-926a-3245cdeea75f
Build autobots	100000	5000	2021-01-22 18:03:12.891911	2021-01-22 18:03:12.891911	Since we need to explore and rule the galaxy, we must build as much autobots as we can	NUMBER	e50e8736-e480-4d47-825f-12697dde39d5	638c682c-885b-480e-9df7-ce57a5e4f182	ac72283e-3620-4c6f-bc4c-7505e0cb823e	922ef72a-6c3c-4075-926a-3245cdeea75f
Earn money	100000	75999	2021-01-22 18:03:12.896099	2021-01-22 18:03:12.896099	We need money to buy stuff	COIN_BRL	4ce29ecb-78ff-4deb-be83-e8b15af1c09f	638c682c-885b-480e-9df7-ce57a5e4f182	ac72283e-3620-4c6f-bc4c-7505e0cb823e	922ef72a-6c3c-4075-926a-3245cdeea75f
Kill Rick Sanchez	1	0	2021-01-22 18:03:12.903346	2021-01-22 18:03:12.903346	DIE BITCH, DIE!!!	NUMBER	a8b49219-7cc7-45f2-b435-004384689266	5c74a2a2-859d-4593-9d90-b07c068e44fe	41a0de90-216d-4092-9d5f-1e889ec0a7cb	f120ec45-150d-4e24-b99d-34df20a80c64
REPLICATE!!!	4000	0	2021-01-22 18:03:12.883771	2021-01-22 18:03:12.883771	Lets be honest. To control the galaxy I need to replicate. I should talk to unity...	NUMBER	4bde68d1-5bd5-4877-b9a9-04d9457568a8	5ebe18ad-d3e8-47a2-b133-7a0501361eaa	0788abd6-4996-4224-8f24-094b2d3c0d3a	922ef72a-6c3c-4075-926a-3245cdeea75f
Kill stupid humans	100000	139	2021-01-22 18:03:12.899791	2021-01-22 18:03:12.899791	In this key result we will focus on killing stupid humans, like Jerry Smith	NUMBER	1c187834-d7c7-4533-af3c-35d2b648c426	d54b31bb-2dfe-46f9-bda4-792c8e557234	92c82e64-836c-44a5-a8c1-0db63cd340b3	b159ef12-9062-49c6-8afc-372e8848fb15
\.


--
-- Data for Name: key_result_check_in; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.key_result_check_in (id, value, confidence, created_at, key_result_id, user_id, comment, parent_id) FROM stdin;
ad283e4c-288e-4c2f-a281-d2a941328986	38	0	2021-02-13 18:33:10.403775	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		89938b1f-6393-4648-9104-3a174aef6e71
39eff1d6-6312-47b2-850a-8e71aacc1ea8	45	0	2021-02-13 18:33:27.9704	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		ad283e4c-288e-4c2f-a281-d2a941328986
e2e6f9be-e90c-47c1-95d1-233d33321f76	50	66	2021-02-13 18:33:41.892513	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f	dasdasdasdas	39eff1d6-6312-47b2-850a-8e71aacc1ea8
78e362c6-e679-4ee0-9a7d-183702fe671b	200	50	2021-02-15 15:05:42.050521	e50e8736-e480-4d47-825f-12697dde39d5	b159ef12-9062-49c6-8afc-372e8848fb15	teste	6609f757-00cc-4c33-ba7d-d25cf878099f
77a5d3c8-c6cc-478e-a35a-bd75bfb184e0	20000	50	2021-02-15 15:05:53.806878	e50e8736-e480-4d47-825f-12697dde39d5	b159ef12-9062-49c6-8afc-372e8848fb15	teste	78e362c6-e679-4ee0-9a7d-183702fe671b
8696b710-8de3-40d0-9adb-3c5fda8aaae7	64	32	2021-02-15 17:04:41.029761	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		e2e6f9be-e90c-47c1-95d1-233d33321f76
11d3d9b8-a272-4283-9eea-a31ddfa227b8	75	32	2021-02-15 17:04:53.515506	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f	OI?	8696b710-8de3-40d0-9adb-3c5fda8aaae7
13918c86-fbb9-4f87-839a-fe28b577fe1d	60	32	2021-02-15 17:06:14.095115	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		11d3d9b8-a272-4283-9eea-a31ddfa227b8
f209f814-c752-4a04-a0d2-9aa280c28dc6	70	32	2021-02-15 17:06:36.348308	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		13918c86-fbb9-4f87-839a-fe28b577fe1d
1f5fed97-5d04-4a31-8263-9c6fe3a2a773	65	32	2021-02-15 17:07:01.533894	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		f209f814-c752-4a04-a0d2-9aa280c28dc6
f6b02096-609a-4060-ba22-c8675a9696c0	80	32	2021-02-15 17:07:31.583824	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		1f5fed97-5d04-4a31-8263-9c6fe3a2a773
df7822c0-5d83-4924-b8cf-561846b2a01f	80	32	2021-02-15 17:10:36.716001	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f	dasdasdas	f6b02096-609a-4060-ba22-c8675a9696c0
1a44b17d-d57b-44d4-bfaa-3fd302673299	90	32	2021-02-15 17:10:48.182499	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f	dd	df7822c0-5d83-4924-b8cf-561846b2a01f
ea163d0d-487f-4d76-b320-7a15ce820910	95	32	2021-02-15 17:12:15.776354	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		1a44b17d-d57b-44d4-bfaa-3fd302673299
3d709d05-017e-4154-bec1-df980daf5066	70	32	2021-02-15 17:12:39.463933	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		ea163d0d-487f-4d76-b320-7a15ce820910
197ad0d4-803b-4f63-9818-28b673393e27	54	32	2021-02-15 17:12:53.625359	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		3d709d05-017e-4154-bec1-df980daf5066
f8fb3f0b-1898-4936-a26c-15382e81205d	70	32	2021-02-15 17:13:32.645758	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		197ad0d4-803b-4f63-9818-28b673393e27
8486c606-a355-47aa-aae1-e61762528e09	80	100	2021-02-20 15:47:48.459855	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		f8fb3f0b-1898-4936-a26c-15382e81205d
1dfbb62b-8777-4664-8298-58151994693e	2000	66	2021-03-16 14:47:48.427881	4bde68d1-5bd5-4877-b9a9-04d9457568a8	922ef72a-6c3c-4075-926a-3245cdeea75f		\N
51516bbd-4714-43de-ab39-a813577f9ecf	71	100	2021-03-16 14:49:30.591463	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		8486c606-a355-47aa-aae1-e61762528e09
9dfbe281-6d3d-44b9-8782-c99c9e911bfb	34145	50	2021-03-17 13:59:38.05631	e50e8736-e480-4d47-825f-12697dde39d5	922ef72a-6c3c-4075-926a-3245cdeea75f		77a5d3c8-c6cc-478e-a35a-bd75bfb184e0
94d4c561-e08d-4867-8e9e-7335da588311	0	0	2021-02-13 17:51:31.879241	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		\N
6c9e3a6b-e920-4634-ae7c-385adf103e61	0	0	2021-02-13 17:53:01.271564	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		94d4c561-e08d-4867-8e9e-7335da588311
3a1aefcd-d83a-4973-be94-ce9c2700a2b1	0	0	2021-02-13 17:55:19.75996	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f	TESTE	6c9e3a6b-e920-4634-ae7c-385adf103e61
fe7fbeec-fe66-4ea5-8660-c69a58b48d3d	0	0	2021-02-13 17:56:01.65532	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		3a1aefcd-d83a-4973-be94-ce9c2700a2b1
1eb3b9f4-562e-4cec-9b27-f7afb8e2b34f	5000	0	2021-02-13 17:56:28.68563	e50e8736-e480-4d47-825f-12697dde39d5	922ef72a-6c3c-4075-926a-3245cdeea75f		\N
89938b1f-6393-4648-9104-3a174aef6e71	0	0	2021-02-13 17:57:18.306075	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f		fe7fbeec-fe66-4ea5-8660-c69a58b48d3d
6609f757-00cc-4c33-ba7d-d25cf878099f	5000	0	2021-02-13 17:57:27.023452	e50e8736-e480-4d47-825f-12697dde39d5	922ef72a-6c3c-4075-926a-3245cdeea75f		1eb3b9f4-562e-4cec-9b27-f7afb8e2b34f
\.


--
-- Data for Name: key_result_comment; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.key_result_comment (id, text, created_at, updated_at, key_result_id, user_id) FROM stdin;
a4a0e701-9dff-4b67-8498-abcb3736f65a	teste	2021-02-02 20:51:30.342054	2021-02-02 20:51:30.342054	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
7a5cbc96-21c5-40c3-971f-89c4c702ff10	dasdasdsa	2021-02-09 14:57:36.687592	2021-02-09 14:57:36.687592	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
75f6133a-d2da-4388-9121-953378926b21	OK \n\nOk	2021-02-09 14:59:15.645133	2021-02-09 14:59:15.645133	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
9f6724d9-61cb-4104-a10e-b50d17305a71	teste	2021-02-09 17:12:22.732905	2021-02-09 17:12:22.732905	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
dacf875c-cefe-402e-aca8-7a341cbc9fa6	teste	2021-02-09 17:12:25.219848	2021-02-09 17:12:25.219848	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
d92e205a-364c-49ad-b5fb-f4529059a9d8	ddd	2021-02-09 17:12:39.911184	2021-02-09 17:12:39.911184	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
40b70507-284e-4be6-b3db-5220743f06b7	ddd	2021-02-09 17:12:53.921177	2021-02-09 17:12:53.921177	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
b7b6642a-8fdf-4b39-b063-085234330b0a	adasdsa	2021-02-09 17:14:10.389186	2021-02-09 17:14:10.389186	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
06d6da49-3881-4f33-a903-974a5d527b78	dasdas	2021-02-09 19:04:58.188799	2021-02-09 19:04:58.188799	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
0c932acd-0897-4a34-be83-cdc471d83f5a	dd	2021-02-09 22:07:51.59231	2021-02-09 22:07:51.59231	e50e8736-e480-4d47-825f-12697dde39d5	922ef72a-6c3c-4075-926a-3245cdeea75f
44722c45-17b9-4b71-8dc7-4673533c69eb	dsdasdas	2021-03-16 19:00:51.872803	2021-03-16 19:00:51.872803	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
edec8497-3c3a-4818-8fc2-b35589536209	dsadas	2021-03-16 19:00:53.142067	2021-03-16 19:00:53.142067	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
55e899f7-5dbd-4f2a-81f3-8321903cff6f	dddd	2021-03-16 19:00:54.55572	2021-03-16 19:00:54.55572	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
4900ae54-3184-4a62-9bd3-ab545bebadd6	dasdasdsa	2021-03-16 19:00:56.053681	2021-03-16 19:00:56.053681	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
5e69256d-e1b2-4b07-975c-c121b9649172	dddd	2021-03-16 19:00:57.334546	2021-03-16 19:00:57.334546	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
276910af-ffc1-4b77-a61a-715b641803d8	dsdaasdsad	2021-03-16 19:00:58.950036	2021-03-16 19:00:58.950036	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
60d3ec0e-ff37-4580-89e3-69f59adaabb3	dsadasdasdas	2021-03-16 19:01:00.839522	2021-03-16 19:01:00.839522	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
3458da05-6902-4f11-8f9b-eb3e7ac75a31	dadas	2021-03-16 19:01:02.357363	2021-03-16 19:01:02.357363	1c187834-d7c7-4533-af3c-35d2b648c426	922ef72a-6c3c-4075-926a-3245cdeea75f
7dbd312a-ad8d-4e3c-9eb8-216260d38d86	dsadas	2021-03-17 14:00:32.237833	2021-03-17 14:00:32.237833	661f4a2e-4afc-4d07-abe6-40b1c3b61c10	922ef72a-6c3c-4075-926a-3245cdeea75f
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1605549933223	CreateTeamTable1605549933223
2	1605550159362	CreateCycleTable1605550159362
3	1605550493548	CreateObjectiveTable1605550493548
4	1605551098826	CreateKeyResultTable1605551098826
5	1605551334075	LinkKeyResultWithObjective1605551334075
6	1605552742904	LinkObjectiveWithCycle1605552742904
7	1605553425591	AddInitialValueToKeyResult1605553425591
8	1605554594889	LinkKeyResultWithTeam1605554594889
9	1605554787852	AddsCreateAndUpdateDateToEntities1605554787852
10	1605554878321	AddsOwnerToKeyResult1605554878321
11	1605555342880	CreateProgressReportTable1605555342880
12	1605555411813	LinkProgressReportWithKeyResult1605555411813
13	1605555477834	CreateConfidenceReportTable1605555477834
14	1605555560406	LinkConfidenceReportWithKeyResult1605555560406
15	1605722152420	UpdateNamingStrategy1605722152420
16	1605722948043	AddUserTable1605722948043
17	1605723718556	FixJoinTable1605723718556
18	1605733368540	RenameUserAuthzSubAndImproveSomeTypes1605733368540
19	1605811740320	AddRoleAndPictureToUser1605811740320
20	1605815979323	AddKeyResultView1605815979323
21	1605817122617	AddUniqueIndexToKeyResultView1605817122617
22	1606311152838	ImprovesDataStructure1606311152838
23	1606313491853	MovesReportsToRealNumbers1606313491853
24	1606314925017	AddFormatToKeyResult1606314925017
25	1606414721612	AddNameToUser1606414721612
26	1607110154758	AddOwnerToObjective1607110154758
27	1607111029213	AddOwnerToTeam1607111029213
28	1608063453435	AddTeamSelfLink1608063453435
29	1608070880951	AddDescriptionToTeam1608070880951
30	1608765362618	RemovesProgressReportUniqueConstraint1608765362618
31	1609176998922	MoveFromIntToUUIDAsPrimaryKeyInCycle1609176998922
32	1609177198458	MoveFromIntToUUIDAsPrimaryKeyInKeyResultReports1609177198458
33	1609177391586	MoveFromIntToUUIDAsPrimaryKeyInKeyResult1609177391586
34	1609177488787	MoveFromIntToUUIDAsPrimaryKeyInObjective1609177488787
35	1609177596663	MoveFromIntToUUIDAsPrimaryKeyInTeam1609177596663
36	1609177695472	MoveFromIntToUUIDAsPrimaryKeyInKeyResultView1609177695472
37	1609177819989	MoveFromIntToUUIDAsPrimaryKeyInUser1609177819989
38	1609184218877	FixesKeyResultViewArray1609184218877
39	1609188048246	AddUserGender1609188048246
40	1609430094050	MergesCompanyEntityWithTeam1609430094050
41	1609868988264	AddsNameToCycle1609868988264
42	1610478253510	SplitsNameIntoFirstAndLastNames1610478253510
43	1611168926943	AddsNeutralGenderToTeam1611168926943
53	1611682078949	RenameKeyResultViewToKeyResultCustomList1611682078949
56	1611691340975	MovesToCheckInEntity1611691340975
57	1611846158592	AddsParentLinkToKeyResultCheckIn1611846158592
58	1612272860351	AddsCommentEntityToKeyResult1612272860351
59	1614113443573	AddsSettingsToUser1614113443573
60	1614115061168	UpdatesUserAboutSectionToLongText1614115061168
63	1615296809147	AddsCadenceAttributesToCycle1615296809147
64	1615492391840	AddsParentCycleToCycles1615492391840
65	1615835656993	ChangesParentTeamColumnTitle1615835656993
66	1615988871285	UpdatesKeyResultCheckInFromProgressToValue1615988871285
67	1616010887736	RemoveKeyResultCustomList1616010887736
\.


--
-- Data for Name: objective; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.objective (title, created_at, updated_at, cycle_id, id, owner_id) FROM stdin;
Control the universe	2021-01-22 18:03:12.868846	2021-01-22 18:03:12.868846	8311f810-120b-4a06-a62a-d1937dba2cbf	5ebe18ad-d3e8-47a2-b133-7a0501361eaa	b159ef12-9062-49c6-8afc-372e8848fb15
Rule the galaxy	2021-01-22 18:03:12.873359	2021-01-22 18:03:12.873359	8311f810-120b-4a06-a62a-d1937dba2cbf	638c682c-885b-480e-9df7-ce57a5e4f182	922ef72a-6c3c-4075-926a-3245cdeea75f
Bring balance to earth	2021-01-22 18:03:12.87664	2021-01-22 18:03:12.87664	8930091c-58ff-4998-9bc4-b3193ad01409	d54b31bb-2dfe-46f9-bda4-792c8e557234	b159ef12-9062-49c6-8afc-372e8848fb15
Bring chaos to the galaxy	2021-01-22 18:03:12.880185	2021-01-22 18:03:12.880185	180dbf7c-69c7-42f6-9559-3b41ecc7a162	5c74a2a2-859d-4593-9d90-b07c068e44fe	f120ec45-150d-4e24-b99d-34df20a80c64
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.team (name, created_at, updated_at, description, id, parent_id, owner_id, gender) FROM stdin;
Rick Sanchez Inc.	2021-01-22 18:03:12.812861	2021-01-22 18:03:12.812861	One of the most famous intergalatic empires, Rick Sanchez Inc. is responsible for bringing peace to the galaxy at all costs	0788abd6-4996-4224-8f24-094b2d3c0d3a	\N	922ef72a-6c3c-4075-926a-3245cdeea75f	\N
Evil Morty S/A	2021-01-22 18:03:12.817462	2021-01-22 18:03:12.817462	We dedicate our lives to end the TIRANY OF RICK SANCHEZ INC.!!!!	f5127ee8-3a54-4f48-a718-8ed5296532e6	\N	f120ec45-150d-4e24-b99d-34df20a80c64	\N
Space Force	2021-01-22 18:03:12.822176	2021-01-22 18:03:12.822176	Dedicated to bring balance to the galaxy, Space Force has the best of our company members to finish long lasting conflicts and bring peace to our controlled planets	d6310cc8-cc17-499b-a28c-5c600dd9714a	0788abd6-4996-4224-8f24-094b2d3c0d3a	922ef72a-6c3c-4075-926a-3245cdeea75f	\N
The dumbest team	2021-01-22 18:03:12.826674	2021-01-22 18:03:12.826674	Well, it is morty, right? So it is the dumbest team	ac72283e-3620-4c6f-bc4c-7505e0cb823e	d6310cc8-cc17-499b-a28c-5c600dd9714a	922ef72a-6c3c-4075-926a-3245cdeea75f	\N
Evil Morty Guerrilla	2021-01-22 18:03:12.839001	2021-01-22 18:03:12.839001	This team does strategic strikes focusing on creating chaos in the galaxy	41a0de90-216d-4092-9d5f-1e889ec0a7cb	f5127ee8-3a54-4f48-a718-8ed5296532e6	f120ec45-150d-4e24-b99d-34df20a80c64	\N
Earth Force	2021-01-22 18:03:12.832114	2021-01-22 18:03:12.832114	Dedicated to bring balance here on our home planet, Earth Force focus finishing conflicts here on earth to maintain peace	92c82e64-836c-44a5-a8c1-0db63cd340b3	0788abd6-4996-4224-8f24-094b2d3c0d3a	922ef72a-6c3c-4075-926a-3245cdeea75f	\N
\.


--
-- Data for Name: team_users_user; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public.team_users_user (team_id, user_id) FROM stdin;
d6310cc8-cc17-499b-a28c-5c600dd9714a	922ef72a-6c3c-4075-926a-3245cdeea75f
92c82e64-836c-44a5-a8c1-0db63cd340b3	b159ef12-9062-49c6-8afc-372e8848fb15
41a0de90-216d-4092-9d5f-1e889ec0a7cb	f120ec45-150d-4e24-b99d-34df20a80c64
92c82e64-836c-44a5-a8c1-0db63cd340b3	9ce87eda-64d1-4bfb-80a5-aa7811a04ea9
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: gitpod
--

COPY public."user" (authz_sub, created_at, updated_at, role, picture, id, gender, first_name, last_name, nickname, linked_in_profile_address, about) FROM stdin;
auth0|5fedf6295696ae00712ead97	2021-01-22 18:03:12.803828	2021-01-22 18:03:12.803828	GOD	https://static.wikia.nocookie.net/rickandmorty/images/a/a6/Rick_Sanchez.png	b159ef12-9062-49c6-8afc-372e8848fb15	MALE	Rick	Sanchez	\N	\N	\N
auth0|5fedf78a45226800755a887c	2021-01-22 18:03:12.80651	2021-01-22 18:03:12.80651	GOD	https://cdn.images.express.co.uk/img/dynamic/20/750x445/1278894.jpg	f120ec45-150d-4e24-b99d-34df20a80c64	MALE	Evil	Morty	\N	\N	\N
auth0|600b2b2adf7b5a00718d8aa8	2021-01-22 19:46:03.862964	2021-01-22 19:46:03.862964	Dumb	https://i.pinimg.com/originals/72/c3/3b/72c33b5df086100cfcd1c29aa02020b6.png	9ce87eda-64d1-4bfb-80a5-aa7811a04ea9	MALE	Jerry	Smith	\N	\N	\N
auth0|5fd773cfd16a7c00694ae5ff	2021-01-22 18:03:12.798091	2021-03-08 16:55:27.164472	CEO	https://vignette.wikia.nocookie.net/theapartments/images/2/2b/Screen_Shot_2019-02-06_at_11.36.07_AM.png/revision/latest?cb=20190206163327	922ef72a-6c3c-4075-926a-3245cdeea75f	MALE	Morty	Smith	\N	fdasdasdsa	testedf
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gitpod
--

SELECT pg_catalog.setval('public.migrations_id_seq', 67, true);


--
-- Name: objective PK_1084365b2a588160b31361a252e; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.objective
    ADD CONSTRAINT "PK_1084365b2a588160b31361a252e" PRIMARY KEY (id);


--
-- Name: team_users_user PK_1ca7d053d598bf3af832af0a82f; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team_users_user
    ADD CONSTRAINT "PK_1ca7d053d598bf3af832af0a82f" PRIMARY KEY (team_id, user_id);


--
-- Name: key_result_check_in PK_32838fec4e2916067f9e4919d4c; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_check_in
    ADD CONSTRAINT "PK_32838fec4e2916067f9e4919d4c" PRIMARY KEY (id);


--
-- Name: key_result_comment PK_58eec85fe36487951bfd30c755e; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_comment
    ADD CONSTRAINT "PK_58eec85fe36487951bfd30c755e" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: key_result PK_9064c5abe9ba68432934564d43f; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result
    ADD CONSTRAINT "PK_9064c5abe9ba68432934564d43f" PRIMARY KEY (id);


--
-- Name: cycle PK_af5984cb5853f1f88109c9ea2b7; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.cycle
    ADD CONSTRAINT "PK_af5984cb5853f1f88109c9ea2b7" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: team PK_f57d8293406df4af348402e4b74; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY (id);


--
-- Name: key_result_check_in UQ_984108e53a65231866cc0750ffd; Type: CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_check_in
    ADD CONSTRAINT "UQ_984108e53a65231866cc0750ffd" UNIQUE (parent_id);


--
-- Name: IDX_32ddebb98d9272939aa84b3908; Type: INDEX; Schema: public; Owner: gitpod
--

CREATE INDEX "IDX_32ddebb98d9272939aa84b3908" ON public.team_users_user USING btree (user_id);


--
-- Name: IDX_3c5aba0d3c5727d0994abf770f; Type: INDEX; Schema: public; Owner: gitpod
--

CREATE INDEX "IDX_3c5aba0d3c5727d0994abf770f" ON public.team_users_user USING btree (team_id);


--
-- Name: team_users_user FK_32ddebb98d9272939aa84b3908a; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team_users_user
    ADD CONSTRAINT "FK_32ddebb98d9272939aa84b3908a" FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: team_users_user FK_3c5aba0d3c5727d0994abf770f0; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team_users_user
    ADD CONSTRAINT "FK_3c5aba0d3c5727d0994abf770f0" FOREIGN KEY (team_id) REFERENCES public.team(id) ON DELETE CASCADE;


--
-- Name: objective FK_3e9e716f8dbeb75b4b8532d2145; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.objective
    ADD CONSTRAINT "FK_3e9e716f8dbeb75b4b8532d2145" FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- Name: objective FK_4134e15532a8beb1f20417cb14f; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.objective
    ADD CONSTRAINT "FK_4134e15532a8beb1f20417cb14f" FOREIGN KEY (cycle_id) REFERENCES public.cycle(id);


--
-- Name: key_result FK_467fb7f46035c6aa81790e6c9f2; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result
    ADD CONSTRAINT "FK_467fb7f46035c6aa81790e6c9f2" FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- Name: key_result FK_4ba6cf9e3b59bd10f6ef88aabf7; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result
    ADD CONSTRAINT "FK_4ba6cf9e3b59bd10f6ef88aabf7" FOREIGN KEY (team_id) REFERENCES public.team(id);


--
-- Name: team FK_62f429bfbac9ccd28d3a63a3308; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "FK_62f429bfbac9ccd28d3a63a3308" FOREIGN KEY (parent_id) REFERENCES public.team(id);


--
-- Name: cycle FK_8dde18c98dc33bda257338936a7; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.cycle
    ADD CONSTRAINT "FK_8dde18c98dc33bda257338936a7" FOREIGN KEY (team_id) REFERENCES public.team(id);


--
-- Name: key_result_check_in FK_984108e53a65231866cc0750ffd; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_check_in
    ADD CONSTRAINT "FK_984108e53a65231866cc0750ffd" FOREIGN KEY (parent_id) REFERENCES public.key_result_check_in(id);


--
-- Name: team FK_a5111ebcad0cc858f6527f1f60a; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT "FK_a5111ebcad0cc858f6527f1f60a" FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- Name: key_result_check_in FK_a566969fc314f93d678c30566b4; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_check_in
    ADD CONSTRAINT "FK_a566969fc314f93d678c30566b4" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: key_result FK_af1d41e09197fe425efd4c50ede; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result
    ADD CONSTRAINT "FK_af1d41e09197fe425efd4c50ede" FOREIGN KEY (objective_id) REFERENCES public.objective(id);


--
-- Name: key_result_comment FK_bbf5483ca6b4f1b29bf493a4ef2; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_comment
    ADD CONSTRAINT "FK_bbf5483ca6b4f1b29bf493a4ef2" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: cycle FK_d698254d6a0a759a16c0edb5f1f; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.cycle
    ADD CONSTRAINT "FK_d698254d6a0a759a16c0edb5f1f" FOREIGN KEY (parent_id) REFERENCES public.cycle(id);


--
-- Name: key_result_comment FK_d74632d008ba9d845cd4a6a6093; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_comment
    ADD CONSTRAINT "FK_d74632d008ba9d845cd4a6a6093" FOREIGN KEY (key_result_id) REFERENCES public.key_result(id);


--
-- Name: key_result_check_in FK_e3828c8587b64a30f69401290e3; Type: FK CONSTRAINT; Schema: public; Owner: gitpod
--

ALTER TABLE ONLY public.key_result_check_in
    ADD CONSTRAINT "FK_e3828c8587b64a30f69401290e3" FOREIGN KEY (key_result_id) REFERENCES public.key_result(id);


--
-- gitpodQL database dump complete
--
