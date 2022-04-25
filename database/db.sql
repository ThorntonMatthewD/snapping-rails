--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.2 (Debian 14.2-1.pgdg110+1)

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
-- Name: create_user_profile(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user_profile() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		INSERT INTO public.user_profiles
			(user_id, social_links, profile_pic_url, profile_description)
		VALUES
			(new.id, null, 'https://i.imgur.com/nybwm8a.jpeg'::character varying, '');
		
		return null;
	END;
$$;


ALTER FUNCTION public.create_user_profile() OWNER TO postgres;

--
-- Name: create_user_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user_role() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		INSERT INTO public.user_role_assignments
			(user_id, role_id)
		VALUES(new.id, 1);
	
		return null;
	END;
$$;


ALTER FUNCTION public.create_user_role() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: markers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.markers (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    lat character varying NOT NULL,
    long character varying NOT NULL,
    media_url character varying NOT NULL,
    img_url character varying NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    ingested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    marker_type smallint NOT NULL,
    author_id bigint NOT NULL
);


ALTER TABLE public.markers OWNER TO postgres;

--
-- Name: markers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.markers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.markers_id_seq OWNER TO postgres;

--
-- Name: markers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.markers_id_seq OWNED BY public.markers.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_profiles (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    social_links jsonb,
    profile_pic_url character varying DEFAULT 'https://i.imgur.com/nybwm8a.jpeg'::character varying NOT NULL,
    profile_description character varying
);


ALTER TABLE public.user_profiles OWNER TO postgres;

--
-- Name: TABLE user_profiles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_profiles IS 'Contains information pertaining to user profiles.';


--
-- Name: COLUMN user_profiles.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_profiles.user_id IS 'User id of the profile owner';


--
-- Name: COLUMN user_profiles.social_links; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_profiles.social_links IS 'Users'' Facebook, Instagram, Tik Tok, or Youtube links. NO TWITTER!';


--
-- Name: COLUMN user_profiles.profile_pic_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_profiles.profile_pic_url IS 'URL s to users'' profile pictures.';


--
-- Name: COLUMN user_profiles.profile_description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_profiles.profile_description IS 'Contains text that users enter to introduce themselves to the community.';


--
-- Name: newtable_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.newtable_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.newtable_id_seq OWNER TO postgres;

--
-- Name: newtable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.newtable_id_seq OWNED BY public.user_profiles.id;


--
-- Name: roles_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_permissions (
    id smallint NOT NULL,
    action_name character varying NOT NULL
);


ALTER TABLE public.roles_permissions OWNER TO postgres;

--
-- Name: COLUMN roles_permissions.action_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.roles_permissions.action_name IS 'The action that, when assigned to a role, someone with that role can then perform (ex: delete someone else''s post).';


--
-- Name: roles_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_permissions_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_permissions_id_seq OWNER TO postgres;

--
-- Name: roles_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_permissions_id_seq OWNED BY public.roles_permissions.id;


--
-- Name: user_role_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_role_assignments (
    id smallint NOT NULL,
    user_id bigint NOT NULL,
    role_id smallint NOT NULL
);


ALTER TABLE public.user_role_assignments OWNER TO postgres;

--
-- Name: user_role_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_role_assignments_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_role_assignments_id_seq OWNER TO postgres;

--
-- Name: user_role_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_role_assignments_id_seq OWNED BY public.user_role_assignments.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id smallint NOT NULL,
    role_name character varying
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_roles_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_roles_id_seq OWNER TO postgres;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    hashed_password text NOT NULL,
    disabled boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: markers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.markers ALTER COLUMN id SET DEFAULT nextval('public.markers_id_seq'::regclass);


--
-- Name: roles_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permissions ALTER COLUMN id SET DEFAULT nextval('public.roles_permissions_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.newtable_id_seq'::regclass);


--
-- Name: user_role_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_assignments ALTER COLUMN id SET DEFAULT nextval('public.user_role_assignments_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: markers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.markers (id, created_at, lat, long, media_url, img_url, title, description, ingested_at, marker_type, author_id) FROM stdin;
1	2022-03-01 16:27:36.119	41.980787905424904	-86.10896229743958	https://www.youtube.com/watch?v=b7IUr__Bpxk	https://i.ytimg.com/vi/b7IUr__Bpxk/maxresdefault.jpg	110 mph amtrak in Dowagiac Michigan	110 mph amtrak in Dowagiac Michigan	2022-03-01 16:32:16.541918	2	1
2	2022-03-01 17:27:35.336	39.14470603185085	141.18800640106204	https://www.youtube.com/watch?v=Cm6TLNitR0M	https://i.ytimg.com/vi/Cm6TLNitR0M/maxresdefault.jpg	Shinkasen thru Mizusawaesashi Station	310km/h Japan Shinkansen train passing by at Mizusawaesashi Station	2022-03-01 17:28:09.130814	2	1
3	2022-03-01 17:30:36.28	33.806182074263866	-84.47087287902832	https://www.youtube.com/watch?v=aEUh95tWw8g	https://i.ytimg.com/vi/aEUh95tWw8g/maxresdefault.jpg	Awesome day for railfanning at Inman yard GA	Awesome day for railfanning at Inman yard GA	2022-03-01 17:30:49.577319	2	1
4	2022-03-01 17:35:06.845	40.53539569762175	-78.38208675384523	https://www.youtube.com/watch?v=FO5jCTk0_zM	https://i.ytimg.com/vi/FO5jCTk0_zM/maxresdefault.jpg	Altoona Works (Juniata Locomotive Shop)	World's LARGEST Train Facility	2022-03-01 17:35:27.198106	2	1
5	2022-03-02 02:38:14.188	34.854369584432895	-82.41606473922731	https://www.youtube.com/watch?v=Zj852VgBZL8	https://i.ytimg.com/vi/Zj852VgBZL8/hqdefault.jpg	Train Watching at Reedy River Bridge in Greenville SC	Train Watching at Reedy River Bridge in Greenville SC	2022-03-02 02:38:26.522108	2	1
6	2022-03-02 04:35:48.321	39.11675528360561	-88.54732613497919	https://www.youtube.com/watch?v=To0cjdJ7SYY	https://i.ytimg.com/vi/To0cjdJ7SYY/maxresdefault.jpg	Siemens Charger's Lead Amtrak Trains, Effingham, IL, 1/25/18	Siemens Charger's Lead Amtrak Trains, Effingham, IL, 1/25/18	2022-03-02 04:36:03.804212	2	1
7	2022-03-02 13:52:22.871	32.87522614466411	-79.99870253083174	https://www.youtube.com/watch?v=qzRvHKlSHec	https://i.ytimg.com/vi/qzRvHKlSHec/hqdefault.jpg	Railfanning in Charleston, SC	Railfanning in Charleston, SC	2022-03-02 13:52:36.730411	2	1
8	2022-03-02 13:56:42.443	52.378009312724544	4.900503129404986	https://www.youtube.com/watch?v=bXHNFTakjXY	https://i.ytimg.com/vi/bXHNFTakjXY/maxresdefault.jpg	Amsterdam to Paris at 300 km/h	Thalys Premium Class	2022-03-02 13:57:02.987965	2	1
9	2022-03-02 20:02:38.13	35.22872359025292	-80.83577156066896	https://www.youtube.com/watch?v=cUEvPjGXyQA	https://i.ytimg.com/vi/cUEvPjGXyQA/hqdefault.jpg	CHARLOTTE STREETCARS - CITYLYNX GOLD LIN	CHARLOTTE STREETCARS - CITYLYNX GOLD LIN	2022-03-02 20:02:50.890271	2	1
10	2022-03-02 20:22:36.16	39.75984300626128	-104.99391317367554	https://www.youtube.com/watch?v=moXzci92hFQ	https://i.ytimg.com/vi/moXzci92hFQ/maxresdefault.jpg	Railfanning Downtown Denver!	Railfanning Downtown Denver!	2022-03-02 20:22:47.362144	2	1
11	2022-03-02 20:24:22.975	39.628630682596935	-78.76077175140382	https://www.youtube.com/watch?v=mRR4wbMwRjg	https://i.ytimg.com/vi/mRR4wbMwRjg/maxresdefault.jpg	Western Maryland Scenic Railroad #1309 Comes Alive	 (WMSR Steam Train Testing)	2022-03-02 20:24:44.225534	2	1
12	2022-03-02 20:25:34.544	34.50519374056261	-82.65424489974977	https://www.youtube.com/watch?v=AIWf-SjxOdc	https://i.ytimg.com/vi/AIWf-SjxOdc/maxresdefault.jpg	Pickens Railway Anderson Job Southbound + RS3L Horn 5/24/2021	Pickens Railway Anderson Job Southbound + RS3L Horn 5/24/2021	2022-03-02 20:25:51.251764	2	1
13	2022-03-02 20:25:34.544	34.50519374056261	-82.65424489974977	https://www.youtube.com/watch?v=AIWf-SjxOdc	https://i.ytimg.com/vi/AIWf-SjxOdc/maxresdefault.jpg	Pickens Railway Anderson Job Southbound + RS3L Horn 5/24/2021	Pickens Railway Anderson Job Southbound + RS3L Horn 5/24/2021	2022-03-02 20:25:51.938212	2	1
14	2022-03-02 20:26:44.398	34.50416062295334	-82.64999628067018	https://www.youtube.com/watch?v=ituhFwufHt0	https://i.ytimg.com/vi/ituhFwufHt0/maxresdefault.jpg	Anderson, SC's Underground Viaduct	Anderson, SC's Underground Viaduct	2022-03-02 20:27:02.967435	2	1
15	2022-03-02 20:27:33.4	34.499359527531176	-82.46366858482362	https://www.youtube.com/watch?v=gRJbjs_Z14o	https://i.ytimg.com/vi/gRJbjs_Z14o/maxresdefault.jpg	Short Line Interchange, Pickens and G&W Railways	Belton, SC 05/12/2020	2022-03-02 20:28:02.818371	2	1
16	2022-03-03 03:19:30.251	33.19332293451592	-80.00480166998115	https://www.youtube.com/watch?v=1zPxHzZjjJs	https://i.ytimg.com/vi/1zPxHzZjjJs/hqdefault.jpg	Railfanning the CSX A-Line in the Low country	Railfanning the CSX A-Line in the Low country	2022-03-03 03:19:39.148983	2	1
17	2022-03-03 03:44:17.616	35.251313927352975	-112.19051599502565	https://www.youtube.com/watch?v=y3Pd0qTcrM8	https://i.ytimg.com/vi/y3Pd0qTcrM8/maxresdefault.jpg	Railfanning the BNSF Transcon in Williams, Arizona	Part 1	2022-03-03 03:44:35.556558	2	1
18	2022-03-03 03:45:56.566	51.1837582257835	-115.572566986084	https://www.youtube.com/watch?v=6l8Kg0ul7VE	https://i.ytimg.com/vi/6l8Kg0ul7VE/maxresdefault.jpg	ROCKY MOUNTAINEER - Vancouver to Banff in 4 Minutes!!!	Luxury train excursions are so cool!	2022-03-03 03:46:18.571326	2	1
19	2022-03-03 03:49:43.978	46.547424619226796	7.982645630836488	https://www.youtube.com/watch?v=iCiCO8YNuAw	https://i.ytimg.com/vi/iCiCO8YNuAw/maxresdefault.jpg	Jungfraujoch In Switzerland	Highest Railway Station in Europe	2022-03-03 03:50:09.740533	2	1
21	2022-03-03 04:26:28.302	33.9850533180715	-81.0393136739731	https://www.youtube.com/watch?v=0fIZGBeX26s	https://i.ytimg.com/vi/0fIZGBeX26s/maxresdefault.jpg	Chase from Columbia to Trenton, SC	Norfolk Southern #191 - 05/04/2020	2022-03-03 04:26:56.240239	2	1
22	2022-03-03 04:29:28.246	36.07268950254448	-90.95083236694337	https://www.youtube.com/watch?v=UYYzhjUzCOU	https://i.ytimg.com/vi/UYYzhjUzCOU/hqdefault.jpg	Union Pacific Big Boy #4014	Steam Train Accelerating and Sanding Flues (8/27/21)	2022-03-03 04:29:49.546113	2	1
23	2022-03-04 01:40:36.91	34.68410641343891	-82.95075774192811	https://www.scpictureproject.org/oconee-county/seneca-train-depot.html	https://www.scpictureproject.org/wp-content/uploads/seneca-sc-train-depot.jpg	History of the Seneca Train Depot	Located in Seneca, SC	2022-03-04 01:41:30.055737	3	1
24	2022-03-04 01:42:05.42	34.68404877676357	-82.95132100582124	https://www.youtube.com/watch?v=5Yf7eINyhrU	https://i.ytimg.com/vi/5Yf7eINyhrU/hqdefault.jpg	NS 94Q arrives at Seneca, SC	1500 hrs, Mon 3 Jan 2021, 51°, 40% hum	2022-03-04 01:42:56.462561	2	1
25	2022-03-04 01:45:47.164	32.8208572910906	-83.63416314125062	https://www.youtube.com/watch?v=5WIbyDhicvs	https://i.ytimg.com/vi/5WIbyDhicvs/maxresdefault.jpg	Norfolk Southern Trains in the Heart of Georgia	Macon GA, 03/05/2016	2022-03-04 01:46:06.022977	2	1
26	2022-03-04 14:55:34.084	39.68737442710961	141.14858865737918	https://www.youtube.com/watch?v=UgXDi1lJonY	https://i.ytimg.com/vi/UgXDi1lJonY/maxresdefault.jpg	Coupling of two Japanese high speed trains at Morioka	Two Shinkasen couple at Morioka station	2022-03-04 14:56:16.900029	2	1
27	2022-03-06 03:45:53.031	34.33911494683574	-81.0811815261841	https://www.youtube.com/watch?v=y52IfhlkBUc	https://i.ytimg.com/vi/y52IfhlkBUc/maxresdefault.jpg	South Carolina Railroad Museum	Winnsboro, SC	2022-03-06 03:46:07.7351	2	1
28	2022-03-07 03:17:26.221	40.497226	-78.4844278	https://www.youtube.com/watch?v=uNqteMq0SmM	https://i.ytimg.com/vi/uNqteMq0SmM/maxresdefault.jpg	NKP 765 on the Mainline	Horseshoe Curve and Beyond (Pittsburgh, woo!!)	2022-03-07 03:17:42.924602	2	1
51	2022-03-28 02:36:07.336	30.830217140950207	-82.00762867927553	https://www.facebook.com/visitfolkston/photos/a.381112905265716/5014769391900021	https://i.imgur.com/BfGDSZT.png	Railwatch 2022 - Folkston, GA	April 1-3, Presented by the Okefenokee Chamber of Commerce	2022-03-28 02:37:48.599589	4	1
\.


--
-- Data for Name: roles_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_permissions (id, action_name) FROM stdin;
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_profiles (id, user_id, social_links, profile_pic_url, profile_description) FROM stdin;
2	7	\N	https://i.imgur.com/nybwm8a.jpeg	
1	1	{"youtube": "https://www.youtube.com/user/railcamp09", "facebook": "https://www.facebook.com/RailfanDanny/", "instagram": "https://www.instagram.com/tracey.c.green/"}	https://i.kym-cdn.com/photos/images/facebook/001/046/902/f95.jpg	Hi! My name is Matt, and I should not be allowed to have unsupervised access to a computer. Otherwise, websites like this one are created as a result.
3	2	\N	https://i.imgur.com/nybwm8a.jpeg	\N
4	4	\N	https://i.imgur.com/nybwm8a.jpeg	\N
\.


--
-- Data for Name: user_role_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_role_assignments (id, user_id, role_id) FROM stdin;
2	7	1
1	1	4
4	4	1
5	2	1
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, role_name) FROM stdin;
1	normal
2	moderator
3	administrator
4	owner
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, hashed_password, disabled) FROM stdin;
1	MattTBoy	matt@admin.com	$2b$12$a3/hjH8/pnHYl0WaPri0L.PuJdtxG0FL.yJGlxawl2B8uHIS/soaO	f
2	testguy	test@guysdomain.com	$2b$12$p/FFxgERUkMo26lwx9Jsze3VIDpcyaO0YlVNzqndLQxTacJIJHsuG	f
4	disableduser	disabled@true.com	$2b$12$cQZQFlSurjvnhtCEQkd5Oep19xMdPrjNOvEAjBbYvhPv5cT25NPT.	t
7	MyNewAccount	mynewaccount@hello.com	$2b$12$TA1mTEVtCNE63/XJTubMGeOEhdbaViFVJ96WZOSQoh.TwcfYu19IK	f
\.


--
-- Name: markers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.markers_id_seq', 118, true);


--
-- Name: newtable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.newtable_id_seq', 4, true);


--
-- Name: roles_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_permissions_id_seq', 1, false);


--
-- Name: user_role_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_role_assignments_id_seq', 5, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: markers markers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.markers
    ADD CONSTRAINT markers_pkey PRIMARY KEY (id);


--
-- Name: roles_permissions roles_permissions_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permissions
    ADD CONSTRAINT roles_permissions_pk PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pk PRIMARY KEY (id);


--
-- Name: user_role_assignments user_role_assignments_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_assignments
    ADD CONSTRAINT user_role_assignments_pk PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pk PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users user_registered_create_profile; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_registered_create_profile AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();


--
-- Name: TRIGGER user_registered_create_profile ON users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER user_registered_create_profile ON public.users IS 'After a new user registers, this trigger creates for them a row in user_profiles.';


--
-- Name: users user_registered_create_role; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER user_registered_create_role AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_user_role();


--
-- Name: TRIGGER user_registered_create_role ON users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER user_registered_create_role ON public.users IS 'After a user registers an account, this triggers creates for them a row in user_role_assignments and sets them as a "normal user".';


--
-- Name: markers markers_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.markers
    ADD CONSTRAINT markers_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: user_role_assignments user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_assignments
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: user_profiles user_profiles_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: user_role_assignments user_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_role_assignments
    ADD CONSTRAINT user_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.user_roles(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--
