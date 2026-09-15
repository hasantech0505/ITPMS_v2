--
-- PostgreSQL database dump
--

\restrict gmve2v6JGdK4eriNw5xcTugKwaBQ8WM0RlR2Lmpj3gtvnU4RCjStJ9EwMSvA6kI

-- Dumped from database version 14.20
-- Dumped by pg_dump version 18.6

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ITEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ITEvent" (
    id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    "eventType" character varying(100) NOT NULL,
    "eventDate" character varying(100) NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    quarter integer NOT NULL,
    region character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    venue character varying(255) NOT NULL,
    organizer character varying(255) NOT NULL,
    partners text,
    "participantCount" integer DEFAULT 0,
    "startupCount" integer DEFAULT 0,
    "reportUrl" text,
    notes text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id character varying(100) NOT NULL,
    "userId" character varying(100) NOT NULL,
    "userName" character varying(255),
    "userRole" character varying(50),
    action character varying(255) NOT NULL,
    entity character varying(100),
    "entityId" character varying(100),
    "timestamp" character varying(100) NOT NULL,
    details text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assets (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    "serialNumber" character varying(100),
    category character varying(100),
    "purchaseDate" character varying(50),
    "warrantyExpiry" character varying(50),
    condition character varying(50),
    "assignedOfficeId" character varying(100),
    "assignedOfficeNumber" character varying(50),
    "assignedUserId" character varying(100),
    "assignedUserName" character varying(255),
    "purchaseCost" numeric(15,2) DEFAULT 0.0,
    image character varying(500),
    "maintenanceHistory" text[],
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buildings (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(100),
    address text,
    region character varying(100),
    district character varying(100),
    coordinates character varying(100),
    "constructionYear" integer,
    floors integer,
    "totalArea" numeric(15,2),
    "totalOffices" integer,
    capacity integer,
    "parkingSpots" integer,
    "meetingRooms" integer,
    status character varying(50),
    images text[],
    "virtualTourUrl" character varying(500),
    documents text[],
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    notes text
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    country character varying(100),
    industry character varying(255),
    website character varying(500),
    "leadScore" integer DEFAULT 0,
    status character varying(50) DEFAULT 'LEAD'::character varying,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "leadSource" character varying(100),
    segment character varying(255),
    "employeeCountBand" character varying(50),
    "nextFollowUpDate" character varying(50),
    "lastContactedDate" character varying(50),
    "nextStep" text,
    "isSuccessStory" boolean DEFAULT false,
    "successStoryText" text,
    "benefitsPitched" jsonb DEFAULT '[]'::jsonb,
    "competingOptions" text
);


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contacts (
    id character varying(100) NOT NULL,
    "companyId" character varying(100),
    "companyName" character varying(255),
    "fullName" character varying(255) NOT NULL,
    role character varying(255),
    email character varying(255),
    phone character varying(150),
    "linkedInUrl" character varying(500),
    notes text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contracts (
    id character varying(100) NOT NULL,
    "contractNumber" character varying(100),
    "tenantId" character varying(100),
    "tenantName" character varying(255),
    "officeId" character varying(100),
    "officeNumber" character varying(50),
    "buildingBlock" character varying(100),
    "contractType" character varying(100),
    "startDate" character varying(50),
    "endDate" character varying(50),
    "monthlyRentUSD" numeric(15,2) DEFAULT 0.0,
    status character varying(50),
    "documentUrl" character varying(500),
    "digitalSignature" character varying(255),
    "signedAt" character varying(50),
    payments text
);


--
-- Name: entity_store; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entity_store (
    collection character varying(100) NOT NULL,
    id character varying(100) NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: inspections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inspections (
    id character varying(100) NOT NULL,
    "buildingBlock" character varying(100),
    type character varying(100),
    "inspectionDate" character varying(50),
    "inspectorName" character varying(255),
    "inspectorAgency" character varying(255),
    status character varying(50),
    findings text,
    recommendations text,
    "certificateUrl" character varying(500),
    documents text[]
);


--
-- Name: maintenance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maintenance (
    id character varying(100) NOT NULL,
    category character varying(100),
    title character varying(255) NOT NULL,
    description text,
    priority character varying(50),
    status character varying(50) DEFAULT 'OPEN'::character varying,
    "assignedEngineer" character varying(255),
    "createdAt" character varying(50),
    "officeId" character varying(100),
    "officeNumber" character varying(50),
    "buildingBlock" character varying(100),
    "beforePhoto" character varying(500),
    "afterPhoto" character varying(500),
    "completionReport" text,
    timeline text
);


--
-- Name: meetings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meetings (
    id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    "companyId" character varying(100),
    "companyName" character varying(255),
    attendees text[],
    "dateTime" character varying(50),
    notes text,
    summary text,
    status character varying(50) DEFAULT 'SCHEDULED'::character varying,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: offices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.offices (
    id character varying(100) NOT NULL,
    "roomNumber" character varying(50) NOT NULL,
    building character varying(100) NOT NULL,
    floor integer,
    "areaSqM" numeric(10,2) DEFAULT 0.0,
    "monthlyRent" numeric(15,2) DEFAULT 0.0,
    status character varying(50) DEFAULT 'VACANT'::character varying,
    "currentTenantId" character varying(100),
    "currentTenantName" character varying(255),
    "leaseStart" character varying(50),
    "leaseEnd" character varying(50),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    module character varying(100) NOT NULL,
    description text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id character varying(100) NOT NULL,
    "userId" character varying(100) NOT NULL,
    "tokenHash" character varying(500) NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id character varying(100) NOT NULL,
    "roomName" character varying(255) NOT NULL,
    "buildingBlock" character varying(100),
    floor integer,
    "reservedBy" character varying(255),
    "residentName" character varying(255),
    date character varying(50),
    "startTime" character varying(20),
    "endTime" character varying(20),
    purpose text,
    status character varying(50),
    recurring boolean DEFAULT false
);


--
-- Name: residents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.residents (
    id character varying(100) NOT NULL,
    "companyName" character varying(255) NOT NULL,
    director character varying(255),
    "registrationNumber" character varying(100),
    "legalAddress" text,
    "employeesCount" integer DEFAULT 0,
    "exportVolume" numeric(15,2) DEFAULT 0.0,
    "domesticVolume" numeric(15,2) DEFAULT 0.0,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    "appliedAt" character varying(50),
    "approvedAt" character varying(50),
    "benefitsApplied" text[],
    notes text[],
    documents text[],
    email character varying(255),
    phone character varying(150),
    website character varying(500),
    telegram character varying(100),
    linkedin character varying(500),
    district character varying(100),
    industry character varying(100),
    "activityType" character varying(100),
    "assignedManager" character varying(100),
    "potentialStage" character varying(100),
    "potentialFounder" character varying(255),
    "potentialSource" character varying(255),
    "potentialProbability" integer DEFAULT 0,
    "potentialOwner" character varying(255),
    "potentialNextFollowUp" character varying(50),
    "potentialNotes" text,
    "potentialTimeline" jsonb DEFAULT '[]'::jsonb,
    "upcomingStage" character varying(100),
    "upcomingDetails" jsonb DEFAULT '{}'::jsonb,
    "removedDate" character varying(50),
    "removedReason" text,
    "removedDebt" numeric(15,2) DEFAULT 0.0,
    "removedInspection" text,
    "removedAppeal" text,
    "removedCourt" text,
    "removedCanReapply" boolean DEFAULT true,
    "monitoringHistory" jsonb DEFAULT '[]'::jsonb,
    "quarterlyReports" jsonb DEFAULT '[]'::jsonb,
    "docFiles" jsonb DEFAULT '[]'::jsonb,
    meetings jsonb DEFAULT '[]'::jsonb,
    tasks jsonb DEFAULT '[]'::jsonb,
    "historyLogs" jsonb DEFAULT '[]'::jsonb,
    photos text[],
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    "roleId" character varying(100) NOT NULL,
    "permissionId" character varying(100) NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: startups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.startups (
    id character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    founder character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(150),
    stage character varying(50),
    status character varying(50),
    industry character varying(100),
    employees integer DEFAULT 0,
    revenue numeric(15,2) DEFAULT 0.0,
    "fundingRaised" numeric(15,2) DEFAULT 0.0,
    "joinedAt" character varying(50),
    description text,
    notes text[],
    documents text[],
    kpis text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: talent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.talent (
    id character varying(100) NOT NULL,
    "fullName" character varying(255) NOT NULL,
    university character varying(255),
    major character varying(255),
    "graduationYear" integer,
    skills text[],
    status character varying(50),
    phone character varying(150),
    email character varying(255),
    "englishLevel" character varying(10),
    "gitHubUrl" character varying(500),
    certifications text[],
    "codingScore" integer DEFAULT 0,
    "englishScore" integer DEFAULT 0,
    "softSkillsScore" integer DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "cvUrl" character varying(1000),
    languages jsonb DEFAULT '[]'::jsonb
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    "assignedTo" character varying(100),
    "dueDate" character varying(50),
    priority character varying(50) DEFAULT 'MEDIUM'::character varying,
    status character varying(50) DEFAULT 'TODO'::character varying,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "companyId" character varying(100),
    "companyName" character varying(255)
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    "userId" character varying(100) NOT NULL,
    "roleId" character varying(100) NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) DEFAULT 'password'::character varying,
    name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'VIEWER'::character varying NOT NULL,
    department character varying(100),
    "avatarUrl" character varying(500),
    active boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: utilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.utilities (
    id character varying(100) NOT NULL,
    "buildingBlock" character varying(100) NOT NULL,
    month character varying(50) NOT NULL,
    "electricityKwh" numeric(15,2),
    "electricityCost" numeric(15,2),
    "waterM3" numeric(15,2),
    "waterCost" numeric(15,2),
    "internetMbps" numeric(15,2),
    "internetCost" numeric(15,2),
    "heatingGcal" numeric(15,2),
    "heatingCost" numeric(15,2)
);


--
-- Name: vacancies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vacancies (
    id character varying(100) NOT NULL,
    "residentId" character varying(100),
    "residentName" character varying(255),
    title character varying(255) NOT NULL,
    department character varying(255),
    "employmentType" character varying(50),
    seniority character varying(50),
    location character varying(255),
    "requiredSkills" text[],
    "preferredSkills" text[],
    "englishLevel" character varying(10),
    "numberOfOpenings" integer DEFAULT 1,
    "salaryMin" numeric,
    "salaryMax" numeric,
    "salaryNegotiable" boolean DEFAULT false,
    description text,
    responsibilities text[],
    requirements text[],
    benefits text[],
    status character varying(50) DEFAULT 'OPEN'::character varying,
    "postedDate" character varying(20),
    "deadlineDate" character varying(20),
    "filledDate" character varying(20),
    "filledByTalentId" character varying(100),
    "contactPerson" character varying(255),
    "contactEmail" character varying(255),
    "contactPhone" character varying(150),
    notes text,
    "createdBy" character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: vacancy_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vacancy_applications (
    id character varying(100) NOT NULL,
    "vacancyId" character varying(100) NOT NULL,
    "vacancyTitle" character varying(255),
    "residentId" character varying(100),
    "talentId" character varying(100) NOT NULL,
    "candidateName" character varying(255),
    stage character varying(50) DEFAULT 'APPLIED'::character varying,
    "appliedDate" character varying(20),
    "matchScore" integer,
    notes text,
    history jsonb DEFAULT '[]'::jsonb,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Data for Name: ITEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ITEvent" (id, title, "eventType", "eventDate", year, month, quarter, region, district, venue, organizer, partners, "participantCount", "startupCount", "reportUrl", notes, "createdAt", "updatedAt") FROM stdin;
evt-0738	Yoshlar kuni” tashabbusi doirasida ko‘kdalalik yoshlarning "Start Up" loyihalari taqdimoti bo‘lib o‘tdi	WORKSHOP	2026-02-03	2026	2	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	Yoshlar agentligi	50	6	https://t.me/IT_Park_Qashqadaryo/2256	Ko‘kdala tumani hokimi Xurram Djurayev hamda huquq-tartibot organlari rahbarlari ishtirokida tumandagi yosh dasturchilar tomonidan ishlab chiqilgan yangi startap loyihalar taqdimoti o‘tkazildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0739	Qarshi shahrida “Hokim va yoshlar uchrashuvi”	WORKSHOP	2026-02-02	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi yuridik texnikumi	IT Парк	Qarshi shahar hokimligi	100	11	https://t.me/IT_Park_Qashqadaryo/2255	Uchrashuvdan ko‘zlangan asosiy maqsad — rezidentlar faoliyatini yanada qo‘llab-quvvatlash, hamkorlik yo‘nalishlarini kengaytirish hamda korxonalarda mavjud muammolarni bevosita o‘rganish va ularning yechimlari yuzasidan takliflarni muhokama qilishdan iborat bo'ldi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0742	Qarshi davlat texnika universitetida “Startup Roadshow” tadbiri	WORKSHOP	2026-02-27	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat texnika universiteti	IT Парк	Qarshi davlat texnika universiteti	80	9	https://t.me/kstu_uz/6231	“Startup Roadshow” loyihasi bu gal Qarshi davlat texnika universitetida o‘z ishini davom ettirdi. Tadbir texnik va muhandislik yo‘nalishida tahsil olayotgan talabalar, yosh olimlar hamda innovatsion ishlanmalar ustida ishlayotgan jamoalar uchun ochiq muloqot maydoniga aylandi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0729	IT Park Qashqadaryo filiali va Amerikaning NexGen Technologies kompaniyasi o‘rtasida onlayn hamkorlik uchrashuvi	WORKSHOP	2026-01-08	2026	1	1	Qashqadaryo viloyati	Qarshi shahri	Online	IT Парк	NexGen Technologies	10	2	https://t.me/IT_Park_Qashqadaryo/2201	IT Park Qashqadaryo filiali va Amerikaning NexGen Technologies kompaniyasi o‘rtasida onlayn hamkorlik uchrashuvi bo‘lib o‘tdi	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0730	Qarshi davlat universiteti Inkubatsiya markazida startap loyihalar muhokamasiga bag‘ishlangan uchrashuv	WORKSHOP	2026-01-13	2026	1	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat universiteti	IT Парк	Qarshi davlat universiteti	40	10	https://t.me/IT_Park_Qashqadaryo/2195	Joriy yil 13-yanvar kuni Qarshi davlat universiteti Inkubatsiya markazida IT Park Qashqadaryo filiali hamda IT rezident korxonalarining tajribali dasturchi mutaxassislari ishtirokida uchrashuv tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0731	Qarshida “American Makerspace”  yangi innovatsion markazi ochildi	WORKSHOP	2026-01-22	2026	1	1	Qashqadaryo viloyati	Qarshi shahri	American Makersopaces Center	IT Парк	American Corner	200	9	https://t.me/IT_Park_Qashqadaryo/2213	Qarshi shahrida tashkil etilgan “American Makerspace”  Qarshi markazi o‘z faoliyatini rasman boshladi.\nOchilish marosimida Raqamli texnologiyalar vaziri Sherzod Shermatov,  Oliy ta’lim, fan va innovatsiyalar vaziri Qo‘ng‘irotboy Sharipov, AQShning yurtimizdagi favqulodda va muxtor elchisi Jonatan Xenik, shuningdek, Yevropa va Afrika bo'yicha “Air Products” prezidenti Ivo Bols va Markaziy Yevropa va Markaziy Osiyo bo‘yicha “Air Products” vitse-prezidenti Vatslav Harant ishtirok etdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0732	Raqamli texnologiyalar vaziri Yoshlar Texnoparkida IT korxona vakillari bilan uchrashdi	WORKSHOP	2026-01-22	2026	1	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi Yoshlar Texnoparki	IT Парк	Raqamli texnologiyalar vazirligi	50	4	https://t.me/IT_Park_Qashqadaryo/2206	Qashqadaryo viloyatiga xizmat safari doirasida Raqamli texnologiyalar vaziri Sherzod Shermatov hamda Oliy ta’lim, fan va innovatsiyalar vaziri Qo‘ng‘irotboy Sharipov Qarshi shahrida joylashgan Yoshlar Texnoparkiga tashrif buyurib, uning faoliyati bilan yaqindan tanishdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0733	Ko'kdala tumani IT Park binosida IT sohasi Sayyor qabuli o'tkazildi	WORKSHOP	2026-01-29	2026	1	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	Raqamli texnologiyalar vazirligi	50	3	https://t.me/kashrtvuz/7520	Ko'kdala tumani IT Park binosida IT sohasi Sayyor qabuli o'tkazildi. Sayyor qabulda IT sohasi va vazirlik soha korxonalari ishtirok etdi. Aholi tomonidan berilgan muammolar joyida o'rganildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0734	Technovation Girls Uzbekistan 2026 Qarshi tadbiri	WORKSHOP	2026-02-16	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Raqamli texnologiyalar vazirligi	50	5	https://t.me/kashrtvuz/7535	16-fevral kuni biz Technovation Girls Uzbekistan’ning yangi mavsumini rasman ochildi. Ochilish tadbiri bir vaqtning o‘zida O‘zbekistonning bir nechta shaharlarida bo‘lib o‘tdi	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0748	IT Park Qashqadaryo filiali jamoasi mehnat yarmarkasida faol ishtirok etdi	WORKSHOP	2026-03-24	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	Alisher Navoiy bog'i	Qashqadaryo viloyat hokimligi	IT Парк	500	16	https://t.me/IT_Park_Qashqadaryo/2361	24-mart kuni Alisher Navoiy istirohat bog‘i hududida yoshlar uchun “Bo‘sh ish o‘rinlari mehnat yarmarkasi” tashkil etildi. Mazkur tadbirda viloyatimizdagi korxona va tashkilotlar, tadbirkorlik subyektlari hamda xorijiy nufuzli kompaniyalar o‘zlaridagi mavjud vakant ish o‘rinlari bilan ishtirok etib, yoshlar uchun keng imkoniyatlar yaratdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0736	IT Park Qashqadaryo filiali tomonidan IT Klaster o‘quv markazi bitiruvchilari uchun Startup Workshop	WORKSHOP	2026-02-25	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	IT Klaster o'quv markazi	IT Парк	AloqaBank	50	7	https://t.me/IT_Park_Qashqadaryo/2252	Joriy yil 25-fevral kuni IT Park Qashqadaryo filiali tomonidan IT Klaster o‘quv markazi bitiruvchilari uchun maxsus startup workshop tashkil etildi. Tadbir yosh mutaxassislarning innovatsion g‘oyalarini qo‘llab-quvvatlash hamda ularni amaliy startap jarayonlariga yo‘naltirishga qaratildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0737	Вилоят ҳокими бошчилигидаги раҳбарлар ёшлар билан мулоқот қилди	WORKSHOP	2026-02-26	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat universiteti	Viloyat hokimligi	IT Парк	300	35	https://t.me/qvh_axboroti/45016	вилоят ҳокими Муротжон Азимов бошчилигидаги масъул раҳбарлар Президентимизнинг ёшлар билан ўтказган мулоқотида берилган топшириқлари ижросини таъминлаш мақсадида Қарши давлат университетида "Раҳбар ва ёшлар" учрашувида иштирок этиб, воҳамиз ёшлари билан мулоқот қилди.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0751	Qashqadaryoda INKUBATSIYA DASTURI	WORKSHOP	2026-02-04	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Raqamli texnologiyalar vazirligi	71	42	https://t.me/IT_Park_Qashqadaryo/2379	IT Park Uzbekistan Qashqadaryoda o‘z tashabbuslarini rivojlantirish va ularni yangi bosqichga olib chiqishga tayyor bo‘lganlar uchun 1 oylik intensiv inkubatsiya dasturini yo‘lga qo‘ymoqda.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0752	IT Park’ga Yaponiya vakili, raqamli texnologiyalar vaziri maslahatchisi Akihiro Sakurai tashrif buyurdi	WORKSHOP	2026-02-04	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Raqamli texnologiyalar vazirligi	60	5	https://t.me/IT_Park_Qashqadaryo/2392	Tashrif doirasida IT Park faoliyati, investitsiya muhiti hamda xorijiy kompaniyalarni jalb qilish bo‘yicha olib borilayotgan ishlar muhokama qilindi. Uchrashuv davomida, xususan, chet el kompaniyalarini jalb etish masalalariga alohida e’tibor qaratildi. Shuningdek, Xitoyning bir kompaniyasi bilan hamkorlik istiqbollari yuzasidan muloqotlar olib borildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0741	Qashqadaryo IT Park filialida “Startup Roadshow” tadbiri	WORKSHOP	2026-02-27	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Qarshi davlat universiteti	50	25	https://t.me/IT_Park_Qashqadaryo/2248	Tadbir davomida O‘zbekiston Respublikasi Prezidentining “Startaplarni qo‘llab-quvvatlashning kompleks ekotizimini joriy etish chora-tadbirlari to‘g‘risida”gi PQ–59-son qarori mazmuni, undagi yangi imkoniyatlar va amaliy mexanizmlar batafsil tushuntirib berildi	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0754	IT Park Qashqadaryo filialida startapchi yoshlar bilan uchrashuv bo‘lib o‘tdi	WORKSHOP	2026-04-04	2026	4	2	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Qarshi davlat universiteti	20	10	https://t.me/IT_Park_Qashqadaryo/2401	IT Park Qashqadaryo viloyat filialida Qarshi davlat universiteti qoshidagi Inkubatsiya markazi startapchi yoshlari ishtirokida uchrashuv tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0763	Digital Inclusion tashabbusi doirasida nogironligi bo‘lgan shaxslar uchun trening	WORKSHOP	2026-06-08	2026	6	2	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Park	Raqamli texnologiyalar vazirligi	80	0	\N	“Uzbekistan Digital inclusion” loyihasi doirasida Qarshi shahrida joylashgan IT parkida seminar trening tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0764	Shahrisabz shahrida "Yangi O‘zbekistonni yoshlar quradi" shiori ostida yirik yoshlar festivali	WORKSHOP	15.06.26	2026	1	1	Qashqadaryo viloyati	Shahrisabz shahri	Oqsaroy	Yoshlar Ishlar Agentligi	IT Park	500	0	https://t.me/IT_Park_Qashqadaryo/2651	Shahrisabz shahrida "Yangi O‘zbekistonni yoshlar quradi" shiori ostida yirik yoshlar festivali bo‘lib o‘tdi.\nMazkur tadbirda IT Park Qashqadaryo ham faol ishtirok etib, yoshlar uchun axborot texnologiyalari, raqamli kasblar, startaplar va IT sohasidagi imkoniyatlar haqida ma’lumotlar taqdim etdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0744	IT Park Qashqadaryo viloyat filialida IT PARK CAPITAL vakillari bilan uchrashuv	WORKSHOP	2026-03-11	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	IT PARK CAPITAL	50	7	https://t.me/IT_Park_Qashqadaryo/2315	Uchrashuv davomida IT sohasini har tomonlama qo‘llab-quvvatlash, xususan biznesni rivojlantirish, IT-mahsulotlar va xizmatlar eksportini rag‘batlantirish, ta’lim imkoniyatlarini kengaytirish hamda startap loyihalarni moliyalashtirish masalalari muhokama qilindi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0747	“Dasturchi bo‘l” granti 1-bosqichi yopilish taqdbiri	WORKSHOP	2026-03-18	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat texnika universiteti	IT Klaster	IT Парк	100	7	https://t.me/IT_Park_Qashqadaryo/2345	Qarshi davlat texnika universitetining Raqamli texnologiyalar va Sun’iy intellekt fakultetida “Dasturchi bo‘l” granti dasturining 1-bosqich yopilish marosimi yuqori saviyada o‘tkazildi. Mazkur loyiha AloqaBank tashabbusi bilan IT Park Qashqadaryo filiali hamda Raqamli ta’limni rivojlantirish markazi hamkorligida tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0746	Turon universitetida “ENG YAXSHI STARTAP LOYIHA” tanlovi	WORKSHOP	2026-03-18	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	Turon universiteti	Turon universiteti	IT Парк	25	16	https://t.me/IT_Park_Qashqadaryo/2349	Joriy yil 18-mart kuni Turon universiteti talabalari o‘rtasida “Eng yaxshi startap loyiha” tanlovi yuqori saviyada tashkil etildi. Tadbir IT Park Qashqadaryo filiali hamda Oliy ta’lim, fan va innovatsiyalar vazirligi Qashqadaryo viloyat boshqarmasi bilan hamkorlikda o‘tkazildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0745	Qashqadaryo viloyatida “Inkubatsiya dasturi” Pitch Day tadbiri	ACCELERATION_DEMO	2026-03-16	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Raqamli texnologiyalar vazirligi	30	13	https://t.me/IT_Park_Qashqadaryo/2333	Qashqadaryo viloyatida yosh innovatorlar va startap tashabbuslarini qo‘llab-quvvatlash maqsadida tashkil etilgan “Inkubatsiya dasturi o‘quv-mashg‘uloti” yakuniga yetdi. Dastur doirasida Pitch Day hamda g‘oliblarni taqdirlash marosimi bo‘lib o‘tdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0759	Demo day Inkubatsiya dasturi	ACCELERATION_DEMO	2026-05-05	2026	5	2	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Qarshi davlat universiteti	62	21	https://t.me/IT_Park_Qashqadaryo/2534	Qashqadaryo viloyatida yosh innovatorlar va startap tashabbuslarini qo‘llab-quvvatlash maqsadida tashkil etilgan “Inkubatsiya dasturi 2026” yakuniga yetdi. Dastur doirasida Pitch Day hamda g‘oliblarni taqdirlash marosimi bo‘lib o‘tdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0755	Viloyatimizdagi umumta'lim maktablarining bitiruvchi sinf o‘quvchilari uchun Startup yo‘nalishida seminar tashkil etildi	WORKSHOP	2026-04-13	2026	4	2	Qashqadaryo viloyati	Qarshi shahri	A.Oripov maktabi	IT Парк	Raqamli texnologiyalar vazirligi	400	12	https://t.me/IT_Park_Qashqadaryo/2423	IT Park Qashqadaryo viloyat filiali tomonidan viloyatimizdagi umumta'lim maktablarining bitiruvchi sinf o‘quvchilari uchun Startup yo‘nalishida seminar tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0749	IT Park Ko‘kdala filialida “Rahbar va yoshlar” uchrashuvi	WORKSHOP	2026-03-26	2026	3	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	FVV	30	1	https://t.me/IT_Park_Qashqadaryo/2370	Joriy yil 26-mart kuni Ko‘kdala tumanidagi IT Park filialida IT Park Qashqadaryo filiali hamda Favqulodda vaziyatlar vazirligi (FVV) tuman bo‘limi hamkorligida “Rahbar va yoshlar” uchrashuvi bo‘lib o‘tdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0782	National AI Hackathon | Qarshi	WORKSHOP	2026-08-15	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat universiteti	AI Alliance	IT Park	250	50	https://t.me/IT_Park_Qashqadaryo/2931	Qarshi shahrida “National AI Hackathon” rasman start oldi. Tadbirning birinchi kunida ishtirokchilar hackathon formati, qoidalari va talablari bilan tanishib, jamoalarga birlashgan holda dastlabki AI loyihalarini ishlab chiqishni boshladilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0774	Osiyo Texnologiyalar Universitetida texnologik tanlovlar bo‘yicha ochiq seminar o‘tkazildi	WORKSHOP	2026-07-24	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Osiyo Texnologiyalar Universiteti	IT Park	Osiyo Texnologiyalar Universiteti	30	5	https://t.me/IT_Park_Qashqadaryo/2775	IT Park Qashqadaryo viloyat filiali tomonidan Osiyo Texnologiyalar Universitetida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0775	Shahrisabz davlat pedagogika instituti talabalari uchun President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari	WORKSHOP	2026-07-25	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	IT Park	IT Park	Shahrisabz davlat pedagogika instituti	40	6	https://t.me/IT_Park_Qashqadaryo/2796	IT Park Qashqadaryo viloyat filialida Shahrisabz davlat pedagogika instituti talabalari ishtirokida President Tech Award va President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0776	Xalqaro Innovatsion Universitetida “Qashqadaryo startap ligasi”ning OTM bosqichi muvaffaqiyatli o‘tkazildi	ACCELERATION_DEMO	2026-07-27	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Xalqaro Innovatsion universiteti	IT Park	Xalqaro Innovatsion universiteti	25	8	https://t.me/IT_Park_Qashqadaryo/2802	Viloyat hokimining 52-4-0-F/26-son farmoyishi asosida tashkil etilgan “Qashqadaryo startap ligasi” doirasida Xalqaro Innovatsion Universitetida OTM bosqichi bo‘lib o‘tdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0766	Qarshi Yoshlar Texnoparki hamkorligida “IDEATHON – 2026”	WORKSHOP	2026-06-24	2026	6	2	Qashqadaryo viloyati	Qarshi shahri	Qarshi Yoshlar Texnoparki	Qarshi Yoshlar Texnoparki	IT Park	60	15	https://t.me/IT_Park_Qashqadaryo/2671	Qarshi Yoshlar Texnoparkida o‘tkazilgan “IDEATHON – 2026” tanlovi yakunlandi. Tanlov davomida yoshlar, talabalar va innovatorlar o‘zlarining innovatsion g‘oyalari hamda istiqbolli loyihalarini ekspertlar hay’atiga taqdim etdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0761	Ko‘kdala tumani IT Park binosida “Yoshlar kuni” doirasida navbatdagi uchrashuv tashkil etildi.	WORKSHOP	2026-05-07	2026	5	2	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Park	Tuman hokimligi	150	15	https://t.me/IT_Park_Qashqadaryo/2562	Ko‘kdala tumanida haftaning payshanba kuni o‘tkaziladigan “Yoshlar kuni” tadbirlari doirasida tuman hokimi X. Djurayev, tuman prokurori R. Xurramov hamda tuman IIB rahbari R. Temirov joriy yilgi maktab bitiruvchi qizlari bilan uchrashib, ularning taklif va tashabbuslarini tingladi.\n\nMuloqot davomida yoshlarning yangi hayot bosqichiga qo‘yayotgan qadamlari, qiziqishlari, ta’lim jarayonidagi imkoniyat va imtiyozlari yuzasidan samimiy davra suhbati bo‘lib o‘tdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0758	Build with AI Hackathon – Karshi 2026	WORKSHOP	2026-04-18	2026	4	2	Qashqadaryo viloyati	Qarshi shahri	Qarshiu davlat texnika universiteti	Qarshiu davlat texnika universiteti	IT Park	200	30	https://t.me/IT_Park_Qashqadaryo/2508	2026-yil 18-aprel kuni Qarshi davlat texnika universiteti Raqamli texnologiyalar va sun’iy intellekt fakultetida yirik IT tadbir — “Build with AI Hackathon – Karshi 2026” muvaffaqiyatli tashkil etildi!	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0762	Dehqonobod tumani yoshlar bilan uchrashuv	WORKSHOP	2026-05-21	2026	5	2	Qashqadaryo viloyati	Dehqonobod tumani	IT Park filiali	IT Park	Raqamli texnologiyalar vazirligi	40	2	https://t.me/IT_Park_Qashqadaryo/2603	Together with representatives of the Ministry of Digital Technologies, IT Park Uzbekistan Qashqadaryo branch, telecom operators, and regional organizations, several important priorities were discussed:\n\n🔺expanding IT Park residency opportunities;\n🔺creating new jobs through digital technologies;\n🔺improving internet and mobile communication quality;\n🔺supporting youth interested in modern professions and remote work;\n🔺addressing local ICT-related challenges through direct engagement.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0772	Xalqaro Innovatsion universitetida President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari tashkil etildi	WORKSHOP	2026-07-23	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Xalqaro Innovatsion universiteti	IT Park	Xalqaro Innovatsion universitet	30	5	https://t.me/IT_Park_Qashqadaryo/2763	IT Park Qashqadaryo viloyat filiali tomonidan Osiyo Texnologiyalar Universitetida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0780	Qarshi tuman Axborot-resurs markazi vakillari bilan hamkorlik uchrashuvi o'tkazildi	WORKSHOP	2026-08-06	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	IT Park	IT Park	Qarshi tuman Axborot-resurs markazi	10	0	https://drive.google.com/drive/folders/1SdEGRCBHWttykkLR2HyDk2c1zqUyMlVl	IT Park Qashqadaryo viloyati filialida Qarshi tuman Axborot-resurs markazi vakillari bilan tashkil etilgan uchrashuvda axborot texnologiyalari sohasida hamkorlikni rivojlantirish, yoshlarni IT va raqamli kasblarga jalb etish hamda kelgusidagi qo‘shma loyihalarni amalga oshirish masalalari muhokama qilindi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0740	Qarshi shahar 3-son maktabda “Startup Roadshow” tadbiri	WORKSHOP	2026-02-27	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	Qarshi shahar 3-son maktabi	IT Парк	Qarshi shahar 3-son maktab	150	5	https://t.me/qarshish3maktab/12777	Tadbir davomida O‘zbekiston Respublikasi Prezidentining “Startaplarni qo‘llab-quvvatlashning kompleks ekotizimini joriy etish chora-tadbirlari to‘g‘risida”gi PQ–59-son qarori mazmuni, undagi yangi imkoniyatlar va amaliy mexanizmlar batafsil tushuntirib berildi	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0727	Kukdala tumanida Yangi yilda o'qish boshlanishi va sertifikatlar taqdirlash tadbiri	WORKSHOP	2026-01-05	2026	1	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	Yoshlar agentligi	100	3	https://t.me/IT_Park_Qashqadaryo/2186	Tadbir davomida IT markaz xodimlari, shuningdek o‘quv jarayonida yuqori natijalarga erishgan, sertifikatlarni muvaffaqiyatli qo‘lga kiritgan o‘quvchilarga esdalik sovg‘alari va rag‘batlantiruvchi mukofotlar topshirildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0779	Qashqadaryo Startap Ligasi – 2026 tanlovining 5-hudud (tuman/shahar) saralash bosqichi muvaffaqiyatli yakunlandi	ACCELERATION_DEMO	2026-08-05	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	Shahrisabz davlat pedagogika instituti	IT Park	Shahrisabz davlat pedagogika instituti	35	13	https://t.me/IT_Park_Qashqadaryo/2850	IT Park Qashqadaryo viloyat filiali hamda Qashqadaryo viloyati hokimligi hamkorligida Shahrisabz davlat pedagogika instituti Yoshlar markazida tashkil etilgan tanlovda yoshlar va innovatorlar o'zlarining istiqbolli startap g'oyalarini ekspertlar hay'atiga taqdim etdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0765	IT Park Qashqadaryo filialida Qarshi davlat texnika universiteti talabalari bilan uchrashuv tashkil etildi.	WORKSHOP	2026-06-19	2026	6	2	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Park	Qarshi davlat texnika universiteti	30	1	https://t.me/IT_Park_Qashqadaryo/2657	Uchrashuv davomida talabalarga IT Park faoliyati, yoshlar uchun yaratilayotgan imkoniyatlar hamda startup loyihalarni rivojlantirish bo‘yicha keng qamrovli ma’lumotlar berildi. Shuningdek, innovatsion g‘oyalarni muvaffaqiyatli biznesga aylantirish, startup ekotizimining afzalliklari va mavjud qo‘llab-quvvatlash mexanizmlari haqida batafsil tushuntirishlar olib borildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0728	IT Park Ko'kdala tumani binosida Yoshlar uchun Zakovat ko'rik tanlovi	WORKSHOP	2026-01-06	2026	1	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	Yoshlar agentligi	100	2	https://t.me/IT_Park_Qashqadaryo/2191	2026-yil 06-yanvar kuni Ko‘kdala tumanida IT Park tomonidan bilim va tafakkur sinovi — Zakovat ko‘rik-tanlovi o‘tkazildi. Tadbirda tumanning turli maktablaridan saralangan, bilimga chanqoq va izlanuvchan iqtidorli o‘quvchi yoshlar ishtirok etdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0735	Qarshida Startup Workshop	WORKSHOP	2026-02-17	2026	2	1	Qashqadaryo viloyati	Qarshi shahri	AmericanMakerspace	American Makerspace	IT Парк	60	6	https://t.me/uenteruz/1038	UEnter American Makerspace Qarshi bilan hamkorlikda startaplar, talabalar va innovatsiyalarga qiziqadigan barcha uchun amaliy seminar tashkil etdi.\nTadbir doirasida startapni ishga tushirishning asosiy vositalari va mexanizmlari, shuningdek, mavjud qo‘llab-quvvatlash dasturlari, mentorlik platformalari haqida yoritilib, ekspertlarning amaliy tavsiyalari berildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0769	Qarshi davlat texnika universitetida President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari tashkil etildi	WORKSHOP	2026-07-20	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat texnika universiteti	IT Park	Qarshi davlat texnika universiteti	30	8	https://t.me/IT_Park_Qashqadaryo/2720	IT Park Qashqadaryo viloyat filiali tomonidan Qarshi davlat texnika universitetida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0770	Turon universitetida President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari tashkil etildi	WORKSHOP	2026-07-21	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Turon Universiteti	IT Park	Turon Universiteti	10	2	https://t.me/IT_Park_Qashqadaryo/2731	IT Park Qashqadaryo viloyat filiali tomonidan Turon universitetida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0778	Qashqadaryo Startap Ligasi – 2026 tanlovining tuman (shahar) bosqichi muvaffaqiyatli yakunlandi!	ACCELERATION_DEMO	2026-08-04	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi Yoshlar Texnoparki	IT Park	Qarshi Yoshlar Texnoparki	50	20	https://t.me/IT_Park_Qashqadaryo/2833	IT Park Qashqadaryo viloyat filiali va Qashqadaryo viloyati hokimligi hamkorligida Qarshi Yoshlar Texnoparkida tashkil etilgan tanlovda yoshlar va innovatorlar o‘zlarining istiqbolli startap g‘oyalarini ekspertlar hay’atiga taqdim etdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0771	Qarshi xalqaro universitetida President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari tashkil etildi	WORKSHOP	2026-07-22	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi xalqaro universitet	IT Park	Qarshi xalqaro universitet	30	7	https://t.me/IT_Park_Qashqadaryo/2742?single	IT Park Qashqadaryo viloyat filiali tomonidan Qarshi Xalqaro Universitetida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0784	“Mustaqillikning 35 yilligi – Yangi O‘zbekiston yoshlari nigohida” vatanparvarlik va ma’rifat kuni loyihasi doirasida o‘tkazildi.	WORKSHOP	2026-08-18	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	IT Park	IT Park	IT Park	40	5	https://t.me/IT_Park_Qashqadaryo/2946	Qarshi shahridagi IT markazida “Mustaqillik — yangi O‘zbekiston yoshlari nigohida” mavzusida ma’naviy-ma’rifiy tadbir tashkil etildi. Tadbirda yoshlar mamlakatimiz mustaqilligi, Vatan ozodligi, tinchlik va taraqqiyotning ahamiyati haqida fikr almashdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0753	IT Park rezidentlari o‘rtasida so‘rovnoma o‘tkazildi	WORKSHOP	2026-03-04	2026	3	1	Qashqadaryo viloyati	Qarshi shahri	IT Park filiali	IT Парк	Prezident Administratsiyasi	15	6	https://t.me/IT_Park_Qashqadaryo/2397	Hududlarda axborot texnologiyalarining rivojlanish holatini chuqur o‘rganish maqsadida IT Park rezidentlari o‘rtasida so‘rovnoma o‘tkazildi. Mazkur tashabbus orqali biz hududlardagi IT infratuzilma, kadrlar salohiyati, mavjud imkoniyatlar hamda kompaniyalar duch kelayotgan muammolarni aniqlashni maqsad qildik.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0756	Regional Startup Support Program (Akseleratsiya Dasturi)	WORKSHOP	2026-04-16	2026	4	2	Surxondaryo viloyati	Termiz shahri	IT Park filiali	BMT UNDP	Raqamli texnologiyalar vazirligi	30	10	https://t.me/startupbaseuz/7430	2026-yil BMT TD hamkorligidagi qo‘shma loyiha doirasida Surxondaryo va Farg‘ona viloyatlarida amalga oshirilishi rejalashtirilgan va o‘zida oflayn mashg‘ulotlar, onlayn mentorlik (ustozlik) va yakuniy “Demo” tadbirlarini mujassam etgan startaplarni qo‘llab-quvvatlash dasturida IT-Parkning hududiy filiallari, xususan Surxondaryo, Qashqadaryo, Farg‘ona, Namangan va Andijon viloyatlaridan kamida 10 nafardan startap loyihalari va filial startap menejerlari ishtirok etishini ta’minlash belgilangan	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0777	Axborot texnologiyalar va menejment universiteti talabalari uchun President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari	WORKSHOP	2026-07-28	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Axborot texnologiyalar va menejment universiteti	IT Park	Axborot texnologiyalar va menejment universiteti	30	5	https://t.me/IT_Park_Qashqadaryo/2813	IT Park Qashqadaryo viloyat filialida Axborot texnologiyalar va menejment universiteti talabalari ishtirokida President Tech Award va President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0768	Qarshi davlat universitetida President Tech Award va President AI Award tanlovlari bo‘yicha targ‘ibot seminari tashkil etildi	WORKSHOP	2026-07-17	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat universiteti	IT Park	Qarshi davlat universiteti	30	12	https://t.me/IT_Park_Qashqadaryo/2726	IT Park Qashqadaryo viloyat filiali tomonidan Qarshi davlat universiteti Inkubatsiya markazida yoshlar, talabalar va innovatsion g‘oyalarga ega tashabbuskorlarni qo‘llab-quvvatlash maqsadida President Tech Award hamda President AI Award tanlovlariga bag‘ishlangan targ‘ibot seminari tashkil etildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0781	Qashqadaryo startap ligasi»ning viloyat bosqichi o‘tkazildi	ACCELERATION_DEMO	2026-08-15	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	Yoshlar Markzazi	IT Park	Yoshlar Markzazi	50	28	https://t.me/IT_Park_Qashqadaryo/2914	IT Park Qashqadaryo viloyat filiali hamda Qashqadaryo viloyati hokimligi hamkorligida Qashqadaryo viloyati Yoshlar markazida tashkil etilgan viloyat bosqichi tanlovda yoshlar va innovatorlar o'zlarining istiqbolli startap g'oyalarini ekspertlar hay'atiga taqdim etdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0783	"Dolzarb 90 kun" loyihasi doirasida Qashqadaryoda kibersport musobaqasi o‘tkazildi	WORKSHOP	2026-08-18	2026	8	3	Qashqadaryo viloyati	Qarshi shahri	IT Park	IT Park	IT Park	40	3	https://t.me/IT_Park_Qashqadaryo/2960	Musobaqada yoshlar jamoaviy ishlash, strategik fikrlash va raqamli ko‘nikmalarini sinovdan o‘tkazdilar.\n\n🥇 1-o‘rin — Original jamoasi\n🥈 2-o‘rin — Shtorm jamoasi\n🥉 3-o‘rin — Eagle jamoasi	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0767	IT Park Qashqadaryo viloyati filiali vakillari "Bo'sh ish o'rinlari mehnat yarmarkasi"da faol ishtirok etdi	WORKSHOP	2026-07-16	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	XIU	Qarshi shahar hokimligi	IT Park	200	2	https://t.me/IT_Park_Qashqadaryo/2701	2026-yil 16-iyul kuni Qarshi shahridagi 3-son texnikum hududida o'tkazilgan "Bo'sh ish o'rinlari mehnat yarmarkasi"da IT Park Qashqadaryo viloyati filiali vakillari ham faol ishtirok etib, yoshlar va ish izlovchilar uchun IT sohasidagi mavjud imkoniyatlar haqida batafsil ma'lumot berdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0743	“Hokim va yoshlar uchrashuvi” o‘tkazildi	WORKSHOP	2026-03-05	2026	3	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	IT Парк	Yoshlar agentligi	100	6	https://t.me/IT_Park_Qashqadaryo/2299	Uchrashuv davomida yoshlarning takliflari hamda muammoli murojaatlari tinglanib, ularni hal etish yuzasidan mas’ullarga joyida tegishli topshiriqlar berildi va ijrosi nazoratga olindi. Asosan o‘z-o‘zini band qilish hamda kredit olish yo‘nalishlari bo‘yicha murojaatlar kelib tushdi. Mazkur masalalar yuzasidan tegishli tashkilotlarga aniq vazifalar belgilab berilib, ularning ijrosi nazoratga olindi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0757	Qamashi tumanida rahbar va yoshlar uchrashuvi	WORKSHOP	2026-04-16	2026	4	2	Qashqadaryo viloyati	Qamashi tumani	Tuman hokimligi	Tuman hokimligi	IT Park	300	9	https://t.me/IT_Park_Qashqadaryo/2468	Qamashi tumani hokimligida yoshlar kuni munosabati bilan o‘tkazilgan navbatdagi rahbar va yoshlar uchrashuvi amaliy tashabbuslar va yangi imkoniyatlarga boy bo‘ldi. Tadbirda tuman hokimi Xurshid Usmonov boshchiligidagi rahbarlar ishtirok etdi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0773	Qarshi davlat universitetida “Qashqadaryo startap ligasi” tanlovining OTM bosqichi o’tkazildi	ACCELERATION_DEMO	2026-07-24	2026	7	3	Qashqadaryo viloyati	Qarshi shahri	Qarshi davlat universiteti	IT Park	Qarshi davlat universiteti	50	23	https://t.me/IT_Park_Qashqadaryo/2778	Viloyat hokimining 52-4-0-F/26-son farmoyishi asosida tashkil etilgan “Qashqadaryo startap ligasi” doirasida Qarshi davlat universitetida OTM bosqichi bo’lib o’tdi. Tadbir IT Park Qashqadaryo viloyat filiali hamkorligida tashkil etilib, unda talaba-yoshlar o’zlarining innovatsion va istiqbolli startap g’oyalarini ekspertlar hay’atiga taqdim etdilar.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0760	Shahrisabz davlat pedagogika institutida masofaviy xizmatlar korsatish boyicha seminar	WORKSHOP	2026-05-08	2026	5	2	Qashqadaryo viloyati	Shahrisabz shahri	Shahrisabz davlat pedagogika instituti	IT Park	Shahrisabz davlat pedagogika instituti	200	2	https://t.me/IT_Park_Qashqadaryo/2557	Seminarda 200 nafardan ortiq talaba-yoshlar, soha mutaxassislari hamda kompaniya vakillari ishtirok etdi. Tadbir davomida masofaviy xizmatlar bozori, logistika sohasidagi zamonaviy imkoniyatlar, xalqaro platformalarda ishlash hamda yuqori daromadli kasblar haqida batafsil ma’lumotlar berildi.\n\nShuningdek, ishtirokchilarga kompaniyada mavjud bo‘sh ish o‘rinlari, amaliyot dasturlari va masofadan turib ishlash imkoniyatlari taqdim etildi. Seminar yakunida faol talabalarning kompaniya bilan keyingi bosqich suhbatlariga jalb qilinishi belgilab olindi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
evt-0750	IT Park Qashqadaryo filialida “Xalq nazorati” tizimi mavzusida muhim yig‘ilish o‘tkazildi.	WORKSHOP	2026-03-29	2026	3	1	Qashqadaryo viloyati	Kukdala tumani	IT Park filiali	Qashqadaryo viloyat hokimligi	IT Парк	30	2	https://t.me/IT_Park_Qashqadaryo/2386	Yig‘ilish davomida hudud aholisi va davlat xizmatchilari o‘rtasida samarali hamkorlikni yo‘lga qo‘yishga xizmat qiluvchi ushbu interaktiv servisning imkoniyatlari muhokama qilindi. Shuningdek, tizim orqali murojaatlar bilan ishlash samaradorligini oshirish, ochiqlik va shaffoflikni ta’minlash masalalariga alohida e’tibor qaratildi.	2026-08-28 13:02:27.262+00	2026-08-28 13:02:27.262+00
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, "userId", "userName", "userRole", action, entity, "entityId", "timestamp", details, "createdAt") FROM stdin;
act-1788020563804	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PROPERTIES	properties	prop-qshq-11	2026-08-29T16:22:43.804Z	\N	2026-08-31 17:21:00.949579+00
act-1788009124396	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1788009113504	2026-08-29T13:12:04.396Z	\N	2026-08-31 17:21:01.043088+00
act-1788009113530	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_TALENT	talent	tal-1788009113504	2026-08-29T13:11:53.530Z	\N	2026-08-31 17:21:01.136511+00
act-1788006079092	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-29T12:21:19.092Z	\N	2026-08-31 17:21:01.2297+00
act-1788005554095	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0008	2026-08-29T12:12:34.095Z	\N	2026-08-31 17:21:01.323192+00
act-1788005380492	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_PLANNINGITEMS	planningItems	plan-1788005356196	2026-08-29T12:09:40.492Z	\N	2026-08-31 17:21:01.41668+00
act-1788005370404	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PLANNINGITEMS	planningItems	plan-1788005356196	2026-08-29T12:09:30.407Z	\N	2026-08-31 17:21:01.509962+00
act-1788005356601	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_PLANNINGITEMS	planningItems	plan-1788005356196	2026-08-29T12:09:16.601Z	\N	2026-08-31 17:21:01.60323+00
act-1788004798646	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_PLANNINGITEMS	planningItems	plan-1788004739583	2026-08-29T11:59:58.646Z	\N	2026-08-31 17:21:01.696328+00
act-1788004794246	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PLANNINGITEMS	planningItems	plan-1788004739583	2026-08-29T11:59:54.246Z	\N	2026-08-31 17:21:01.789491+00
act-1788004788748	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PLANNINGITEMS	planningItems	plan-1788004739583	2026-08-29T11:59:48.748Z	\N	2026-08-31 17:21:01.882396+00
act-1788004739928	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_PLANNINGITEMS	planningItems	plan-1788004739583	2026-08-29T11:58:59.928Z	\N	2026-08-31 17:21:01.975802+00
act-1788004703871	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-29T11:58:23.871Z	\N	2026-08-31 17:21:02.069932+00
act-1787992950309	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-29T08:42:30.309Z	\N	2026-08-31 17:21:02.163127+00
act-1787939983958	u-1	Hasan Abdukarimov	ADMIN	USER_LOGIN	auth	u-1	2026-08-28T17:59:43.958Z	\N	2026-08-31 17:21:02.256414+00
act-1788024826595	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0015	2026-08-29T17:33:46.595Z	\N	2026-08-31 17:21:02.351075+00
act-1788024851061	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0001	2026-08-29T17:34:11.061Z	\N	2026-08-31 17:21:02.444393+00
act-1788026067556	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PROPERTIES	properties	prop-qshq-8	2026-08-29T17:54:27.556Z	\N	2026-08-31 17:21:02.537657+00
act-1788026067558	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PROPERTIES	properties	prop-qshq-8	2026-08-29T17:54:27.558Z	\N	2026-08-31 17:21:02.630925+00
act-1788071919202	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-30T06:38:39.202Z	\N	2026-08-31 17:21:02.724227+00
act-1788186676685	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T14:31:16.685Z	\N	2026-08-31 17:21:02.817292+00
act-1788186701401	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_STARTUPS	startups	sta-1788186697834	2026-08-31T14:31:41.401Z	\N	2026-08-31 17:21:02.910527+00
act-1788197041175	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T17:24:01.175Z	\N	2026-08-31 17:24:01.947503+00
act-1788197076540	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PROPERTIES	properties	prop-qshq-9	2026-08-31T17:24:36.540Z	\N	2026-08-31 17:24:37.310247+00
act-1788197076568	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_PROPERTIES	properties	prop-qshq-9	2026-08-31T17:24:36.568Z	\N	2026-08-31 17:24:37.366644+00
act-1788197223720	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_STARTUPS	startups	stu-0622	2026-08-31T17:27:03.720Z	\N	2026-08-31 17:27:05.175273+00
act-1788197240255	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_STARTUPS	startups	stu-0623	2026-08-31T17:27:20.255Z	\N	2026-08-31 17:27:21.045536+00
act-1788198969966	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T17:56:09.966Z	\N	2026-08-31 17:56:10.725401+00
act-1788199022621	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_STARTUPS	startups	sta-1788199021495	2026-08-31T17:57:02.621Z	\N	2026-08-31 17:57:04.065113+00
act-1788199044269	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_STARTUPS	startups	sta-1788199021495	2026-08-31T17:57:24.269Z	\N	2026-08-31 17:57:25.113256+00
act-1788199633546	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T18:07:13.546Z	\N	2026-08-31 18:07:14.312248+00
act-1788200336333	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T18:18:56.334Z	\N	2026-08-31 18:18:57.184606+00
act-1788201086274	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_COMMENTS	comments	com-1788201084844	2026-08-31T18:31:26.274Z	\N	2026-08-31 18:31:27.121092+00
act-1788201137756	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_COMMENTS	comments	com-1788201084844	2026-08-31T18:32:17.757Z	\N	2026-08-31 18:32:18.691187+00
act-1788203536566	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T19:12:16.566Z	\N	2026-08-31 19:12:17.330883+00
act-1788203550770	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_STARTUPS	startups	sta-1788203550582	2026-08-31T19:12:30.770Z	\N	2026-08-31 19:12:31.55673+00
act-1788203571785	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_STARTUPS	startups	sta-1788203550582	2026-08-31T19:12:51.785Z	\N	2026-08-31 19:12:52.566041+00
act-1788207112302	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T20:11:52.302Z	\N	2026-08-31 20:11:52.31656+00
act-1788207308483	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_STARTUPS	startups	sta-1788207308457	2026-08-31T20:15:08.483Z	\N	2026-08-31 20:15:08.499034+00
act-1788207355397	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_STARTUPS	startups	sta-1788207308457	2026-08-31T20:15:55.397Z	\N	2026-08-31 20:15:55.420171+00
act-1788208211852	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-08-31T20:30:11.852Z	\N	2026-08-31 20:30:11.880583+00
act-1788239363104	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T05:09:23.104Z	\N	2026-09-01 05:09:23.120431+00
act-1788239395973	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_BUILDINGS	buildings	bui-1788239395875	2026-09-01T05:09:55.973Z	\N	2026-09-01 05:09:55.989953+00
act-1788239515693	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T05:11:55.693Z	\N	2026-09-01 05:11:55.723298+00
act-1788239540640	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T05:12:20.640Z	\N	2026-09-01 05:12:20.662832+00
act-1788240659542	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T05:30:59.542Z	\N	2026-09-01 05:30:59.972723+00
act-1788241957744	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T05:52:37.744Z	\N	2026-09-01 05:52:38.180629+00
act-1788244771361	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T06:39:31.361Z	\N	2026-09-01 06:39:31.779537+00
act-1788246667029	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T07:11:07.029Z	\N	2026-09-01 07:11:07.043654+00
act-1788246669803	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T07:11:09.803Z	\N	2026-09-01 07:11:09.817269+00
act-1788246696037	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T07:11:36.037Z	\N	2026-09-01 07:11:36.461632+00
act-1788257619772	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T10:13:39.772Z	\N	2026-09-01 10:13:40.870897+00
act-1788257625418	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T10:13:45.418Z	\N	2026-09-01 10:13:46.508546+00
act-1788257629336	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T10:13:49.336Z	\N	2026-09-01 10:13:50.42353+00
act-1788257747732	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_BUILDINGS	buildings	bui-1788257746592	2026-09-01T10:15:47.732Z	\N	2026-09-01 10:15:48.823625+00
act-1788257760781	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_BUILDINGS	buildings	bui-1788239395875	2026-09-01T10:16:00.781Z	\N	2026-09-01 10:16:01.897162+00
act-1788257764507	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_BUILDINGS	buildings	bui-1788257746592	2026-09-01T10:16:04.507Z	\N	2026-09-01 10:16:05.619712+00
act-1788257914580	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_EVENTS	events	eve-1788257914455	2026-09-01T10:18:34.580Z	\N	2026-09-01 10:18:36.389579+00
act-1788257919357	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_EVENTS	events	eve-1788257914455	2026-09-01T10:18:39.357Z	\N	2026-09-01 10:18:40.4728+00
act-1788257939111	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_RESIDENT	residents	res-1788257938997	2026-09-01T10:18:59.111Z	\N	2026-09-01 10:19:00.215153+00
act-1788258811400	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-01T10:33:31.400Z	\N	2026-09-01 10:33:32.49031+00
act-1788263055926	u-4	Shohjaxon Xudoyberdiyev	MANAGER	USER_LOGIN	auth	u-4	2026-09-01T11:44:15.926Z	\N	2026-09-01 11:44:15.939908+00
act-1788268814151	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_RESIDENT	residents	res-1788268814033	2026-09-01T13:20:14.151Z	\N	2026-09-01 13:20:15.622748+00
act-1788269190670	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_RESIDENT	residents	res-1788268814033	2026-09-01T13:26:30.670Z	\N	2026-09-01 13:26:32.153984+00
act-1788269988143	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0046	2026-09-01T13:39:48.143Z	\N	2026-09-01 13:39:49.615671+00
act-1788269992625	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0046	2026-09-01T13:39:52.625Z	\N	2026-09-01 13:39:54.086911+00
act-1788286195411	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0002	2026-09-01T18:09:55.411Z	\N	2026-09-01 18:09:55.461018+00
act-1788286200944	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0002	2026-09-01T18:10:00.944Z	\N	2026-09-01 18:10:00.996117+00
act-1788286204593	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0002	2026-09-01T18:10:04.593Z	\N	2026-09-01 18:10:04.678749+00
act-1788287279011	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0046	2026-09-01T18:27:59.011Z	\N	2026-09-01 18:27:59.039421+00
act-1788287288329	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0046	2026-09-01T18:28:08.329Z	\N	2026-09-01 18:28:08.344943+00
act-1788287394335	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0175	2026-09-01T18:29:54.335Z	\N	2026-09-01 18:29:54.351427+00
act-1788287658877	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_COMPANIES	companies	com-1788287658854	2026-09-01T18:34:18.877Z	\N	2026-09-01 18:34:18.898282+00
act-1788287663173	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_COMPANIES	companies	com-1788287658854	2026-09-01T18:34:23.173Z	\N	2026-09-01 18:34:23.196042+00
act-1788287704294	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMPANIES	companies	co-0825	2026-09-01T18:35:04.295Z	\N	2026-09-01 18:35:04.312324+00
act-1788287994001	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T18:39:54.001Z	\N	2026-09-01 18:39:54.020082+00
act-1788287998343	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-01T18:39:58.343Z	\N	2026-09-01 18:39:58.374003+00
act-1788322883172	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:21:23.172Z	\N	2026-09-02 04:21:23.186054+00
act-1788322906909	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:21:46.909Z	\N	2026-09-02 04:21:46.923945+00
act-1788322924446	u-5	Jasurbek Beknazarov	MANAGER	USER_LOGIN	auth	u-5	2026-09-02T04:22:04.446Z	\N	2026-09-02 04:22:04.460727+00
act-1788322944377	u-3	Islom Karimov	MANAGER	USER_LOGIN	auth	u-3	2026-09-02T04:22:24.377Z	\N	2026-09-02 04:22:24.394433+00
act-1788322952234	u-4	Shohjaxon Xudoyberdiyev	MANAGER	USER_LOGIN	auth	u-4	2026-09-02T04:22:32.234Z	\N	2026-09-02 04:22:32.249101+00
act-1788323307475	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:28:27.475Z	\N	2026-09-02 04:28:27.4915+00
act-1788323677585	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:34:37.585Z	\N	2026-09-02 04:34:37.604165+00
act-1788323707734	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:35:07.734Z	\N	2026-09-02 04:35:07.748727+00
act-1788323708283	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T04:35:08.283Z	\N	2026-09-02 04:35:08.298194+00
act-1788324072023	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-02T04:41:12.023Z	\N	2026-09-02 04:41:12.038593+00
act-1788324079653	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-02T04:41:19.653Z	\N	2026-09-02 04:41:19.672228+00
act-1788324087110	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_KPITARGETS	kpiTargets	export_volume	2026-09-02T04:41:27.110Z	\N	2026-09-02 04:41:27.127095+00
act-1788324093163	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_KPITARGETS	kpiTargets	services_volume	2026-09-02T04:41:33.163Z	\N	2026-09-02 04:41:33.176933+00
act-1788324564385	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_STARTUPS	startups	sta-1788324564265	2026-09-02T04:49:24.385Z	\N	2026-09-02 04:49:24.40412+00
act-1788324584693	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_STARTUPS	startups	sta-1788324564265	2026-09-02T04:49:44.693Z	\N	2026-09-02 04:49:44.714694+00
act-1788325071538	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0154	2026-09-02T04:57:51.538Z	\N	2026-09-02 04:57:51.552457+00
act-1788325078043	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_RESIDENT	residents	res-0150	2026-09-02T04:57:58.043Z	\N	2026-09-02 04:57:58.055829+00
act-1788325390145	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_TALENT	talent	tal-1788325390034	2026-09-02T05:03:10.145Z	\N	2026-09-02 05:03:10.16257+00
act-1788325499973	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_COMMENTS	comments	com-1788325498497	2026-09-02T05:04:59.973Z	\N	2026-09-02 05:04:59.988377+00
act-1788325518741	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T05:05:18.741Z	\N	2026-09-02 05:05:18.754665+00
act-1788325522602	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T05:05:22.602Z	\N	2026-09-02 05:05:22.624557+00
act-1788325525922	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T05:05:25.922Z	\N	2026-09-02 05:05:25.945022+00
act-1788325701896	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T05:08:21.896Z	\N	2026-09-02 05:08:21.9095+00
act-1788333096004	u-3	Islom Karimov	MANAGER	UPDATE_STARTUPS	startups	stu-0616	2026-09-02T07:11:36.004Z	\N	2026-09-02 07:11:36.023761+00
act-1788333132458	u-3	Islom Karimov	MANAGER	UPDATE_STARTUPS	startups	stu-0672	2026-09-02T07:12:12.458Z	\N	2026-09-02 07:12:12.485858+00
act-1788333166300	u-3	Islom Karimov	MANAGER	UPDATE_STARTUPS	startups	stu-0654	2026-09-02T07:12:46.300Z	\N	2026-09-02 07:12:46.313291+00
act-1788333193876	u-3	Islom Karimov	MANAGER	UPDATE_STARTUPS	startups	stu-0690	2026-09-02T07:13:13.876Z	\N	2026-09-02 07:13:13.890472+00
act-1788340227785	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T09:10:27.785Z	\N	2026-09-02 09:10:27.801842+00
act-1788366292479	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-02T16:24:52.479Z	\N	2026-09-02 16:24:53.110141+00
act-1788367778488	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_TALENT	talent	tal-1788367778368	2026-09-02T16:49:38.488Z	\N	2026-09-02 16:49:39.125093+00
act-1788368267308	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_TALENT	talent	tal-1788368267177	2026-09-02T16:57:47.308Z	\N	2026-09-02 16:57:47.911905+00
act-1788368297341	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1788367778368	2026-09-02T16:58:17.341Z	\N	2026-09-02 16:58:17.993388+00
act-1788368300166	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1788368267177	2026-09-02T16:58:20.166Z	\N	2026-09-02 16:58:20.758761+00
act-1788368302863	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1788368267177	2026-09-02T16:58:22.863Z	\N	2026-09-02 16:58:23.478217+00
act-1788368304656	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1788325390034	2026-09-02T16:58:24.656Z	\N	2026-09-02 16:58:25.259801+00
act-1788368349282	u-3	Islom Karimov	MANAGER	USER_LOGIN	auth	u-3	2026-09-02T16:59:09.282Z	\N	2026-09-02 16:59:09.883556+00
act-1788368376524	u-3	Islom Karimov	MANAGER	USER_LOGIN	auth	u-3	2026-09-02T16:59:36.524Z	\N	2026-09-02 16:59:36.540818+00
act-1788368380819	u-3	Islom Karimov	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T16:59:40.819Z	\N	2026-09-02 16:59:40.834063+00
act-1788368381919	u-3	Islom Karimov	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T16:59:41.919Z	\N	2026-09-02 16:59:41.932178+00
act-1788368386908	u-3	Islom Karimov	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-02T16:59:46.908Z	\N	2026-09-02 16:59:46.922909+00
act-1788406573155	u-3	Islom Karimov	MANAGER	DELETE_TALENT	talent	tal-1788367778368	2026-09-03T03:36:13.155Z	\N	2026-09-03 03:36:13.930653+00
act-1788406575871	u-3	Islom Karimov	MANAGER	DELETE_TALENT	talent	tal-1788325390034	2026-09-03T03:36:15.871Z	\N	2026-09-03 03:36:16.62569+00
act-1788406578622	u-3	Islom Karimov	MANAGER	DELETE_TALENT	talent	tal-1788325390034	2026-09-03T03:36:18.622Z	\N	2026-09-03 03:36:19.425781+00
act-1788406696380	u-3	Islom Karimov	MANAGER	CREATE_TALENT	talent	tal-1788406696359	2026-09-03T03:38:16.380Z	\N	2026-09-03 03:38:16.395148+00
act-1788406700023	u-3	Islom Karimov	MANAGER	DELETE_TALENT	talent	tal-1788406696359	2026-09-03T03:38:20.023Z	\N	2026-09-03 03:38:20.04884+00
act-1788406707177	u-3	Islom Karimov	MANAGER	CREATE_TALENT	talent	tal-1788406707156	2026-09-03T03:38:27.177Z	\N	2026-09-03 03:38:27.195407+00
act-1788408090639	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-03T04:01:30.639Z	\N	2026-09-03 04:01:31.34682+00
act-1788408961108	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788408961085	2026-09-03T04:16:01.108Z	\N	2026-09-03 04:16:01.120582+00
act-1788408964045	u-5	Jasurbek Beknazarov	MANAGER	DELETE_TALENT	talent	tal-1788406707156	2026-09-03T04:16:04.045Z	\N	2026-09-03 04:16:04.060756+00
act-1788409175589	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409175568	2026-09-03T04:19:35.589Z	\N	2026-09-03 04:19:35.602923+00
act-1788409192594	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_TALENT	talent	tal-1788408961085	2026-09-03T04:19:52.594Z	\N	2026-09-03 04:19:52.608864+00
act-1788409198629	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_TALENT	talent	tal-1788408961085	2026-09-03T04:19:58.629Z	\N	2026-09-03 04:19:58.649751+00
act-1788409207959	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_TALENT	talent	tal-1788408961085	2026-09-03T04:20:07.959Z	\N	2026-09-03 04:20:07.97267+00
act-1788409479817	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409479791	2026-09-03T04:24:39.817Z	\N	2026-09-03 04:24:39.831337+00
act-1788409626094	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409626073	2026-09-03T04:27:06.094Z	\N	2026-09-03 04:27:06.107181+00
act-1788409639220	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_TALENT	talent	tal-1788409626073	2026-09-03T04:27:19.220Z	\N	2026-09-03 04:27:19.23968+00
act-1788409765496	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409765474	2026-09-03T04:29:25.496Z	\N	2026-09-03 04:29:25.512223+00
act-1788409870902	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409870876	2026-09-03T04:31:10.902Z	\N	2026-09-03 04:31:10.92094+00
act-1788409945527	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788409945506	2026-09-03T04:32:25.527Z	\N	2026-09-03 04:32:25.554051+00
act-1788410241997	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788410241976	2026-09-03T04:37:21.997Z	\N	2026-09-03 04:37:22.014126+00
act-1788410806221	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788410806199	2026-09-03T04:46:46.221Z	\N	2026-09-03 04:46:46.235309+00
act-1788413429158	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788413429127	2026-09-03T05:30:29.158Z	\N	2026-09-03 05:30:29.176636+00
act-1788415399931	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-03T06:03:19.931Z	\N	2026-09-03 06:03:19.952075+00
act-1788416207629	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788416207608	2026-09-03T06:16:47.629Z	\N	2026-09-03 06:16:47.65111+00
act-1788416492196	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788416492174	2026-09-03T06:21:32.196Z	\N	2026-09-03 06:21:32.214484+00
act-1788417111452	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788417111426	2026-09-03T06:31:51.453Z	\N	2026-09-03 06:31:51.464911+00
act-1788450279518	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-03T15:44:39.518Z	\N	2026-09-03 15:44:39.534789+00
act-1788452586046	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-03T16:23:06.046Z	\N	2026-09-03 16:23:06.832248+00
act-1788452594099	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_EDOREPORTS	edoReports	edo-1788452593961-tvvgwcw	2026-09-03T16:23:14.099Z	\N	2026-09-03 16:23:14.897515+00
act-1788452643065	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_EDOREPORTS	edoReports	edo-1788452593961-tvvgwcw	2026-09-03T16:24:03.065Z	\N	2026-09-03 16:24:03.848197+00
act-1788455175632	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-03T17:06:15.632Z	\N	2026-09-03 17:06:16.40555+00
act-1788455247770	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_EDOREPORTS	edoReports	edo-1788455246419-1vwafmc	2026-09-03T17:07:27.770Z	\N	2026-09-03 17:07:28.577289+00
act-1788455254998	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_EDOREPORTS	edoReports	edo-1788455246419-1vwafmc	2026-09-03T17:07:34.998Z	\N	2026-09-03 17:07:35.805242+00
act-1788455259383	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_EDOREPORTS	edoReports	edo-1788455246419-1vwafmc	2026-09-03T17:07:39.383Z	\N	2026-09-03 17:07:40.32539+00
act-1788455275122	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_EDOREPORTS	edoReports	edo-1788452593961-tvvgwcw	2026-09-03T17:07:55.122Z	\N	2026-09-03 17:07:56.048887+00
act-1788457583536	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-03T17:46:23.536Z	\N	2026-09-03 17:46:24.316558+00
act-1788458063901	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_EDOREPORTS	edoReports	edo-1788458063021-8lb27zm	2026-09-03T17:54:23.901Z	\N	2026-09-03 17:54:23.92127+00
act-1788495666143	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788495666122	2026-09-04T04:21:06.143Z	\N	2026-09-04 04:21:06.161649+00
act-1788496235128	u-5	Jasurbek Beknazarov	MANAGER	CREATE_TALENT	talent	tal-1788496235108	2026-09-04T04:30:35.128Z	\N	2026-09-04 04:30:35.144937+00
act-1788496353552	u-4	Shohjaxon Xudoyberdiyev	MANAGER	USER_LOGIN	auth	u-4	2026-09-04T04:32:33.552Z	\N	2026-09-04 04:32:33.571772+00
act-1788496521517	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0082	2026-09-04T04:35:21.517Z	\N	2026-09-04 04:35:21.535134+00
act-1788496535702	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0143	2026-09-04T04:35:35.702Z	\N	2026-09-04 04:35:35.72161+00
act-1788496540841	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0142	2026-09-04T04:35:40.841Z	\N	2026-09-04 04:35:40.862633+00
act-1788496555460	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0156	2026-09-04T04:35:55.460Z	\N	2026-09-04 04:35:55.476437+00
act-1788496577594	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0135	2026-09-04T04:36:17.594Z	\N	2026-09-04 04:36:17.616164+00
act-1788496742217	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0146	2026-09-04T04:39:02.217Z	\N	2026-09-04 04:39:02.235532+00
act-1788496777919	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0092	2026-09-04T04:39:37.919Z	\N	2026-09-04 04:39:37.93784+00
act-1788496785614	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0152	2026-09-04T04:39:45.614Z	\N	2026-09-04 04:39:45.632663+00
act-1788496790839	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0145	2026-09-04T04:39:50.839Z	\N	2026-09-04 04:39:50.858084+00
act-1788496814447	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0140	2026-09-04T04:40:14.447Z	\N	2026-09-04 04:40:14.466791+00
act-1788496819918	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0144	2026-09-04T04:40:19.918Z	\N	2026-09-04 04:40:19.939339+00
act-1788496825287	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0148	2026-09-04T04:40:25.287Z	\N	2026-09-04 04:40:25.30538+00
act-1788496830307	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0159	2026-09-04T04:40:30.307Z	\N	2026-09-04 04:40:30.328034+00
act-1788496842469	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0153	2026-09-04T04:40:42.469Z	\N	2026-09-04 04:40:42.490093+00
act-1788496887347	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0161	2026-09-04T04:41:27.347Z	\N	2026-09-04 04:41:27.365949+00
act-1788496901544	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0154	2026-09-04T04:41:41.544Z	\N	2026-09-04 04:41:41.561239+00
act-1788496935228	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-1788268814033	2026-09-04T04:42:15.228Z	\N	2026-09-04 04:42:15.249757+00
act-1788496938816	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-1788257938997	2026-09-04T04:42:18.816Z	\N	2026-09-04 04:42:18.834576+00
act-1788496941509	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0157	2026-09-04T04:42:21.509Z	\N	2026-09-04 04:42:21.530668+00
act-1788496944372	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0150	2026-09-04T04:42:24.372Z	\N	2026-09-04 04:42:24.393322+00
act-1788497053453	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_RESIDENT	residents	res-0051	2026-09-04T04:44:13.453Z	\N	2026-09-04 04:44:13.474837+00
act-1788497821065	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-04T04:57:01.065Z	\N	2026-09-04 04:57:01.088322+00
act-1788497916369	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:36.369Z	\N	2026-09-04 04:58:36.392763+00
act-1788497924993	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:44.993Z	\N	2026-09-04 04:58:45.014439+00
act-1788497930149	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:50.149Z	\N	2026-09-04 04:58:50.167242+00
act-1788497930996	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:50.996Z	\N	2026-09-04 04:58:51.012499+00
act-1788497932190	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:52.190Z	\N	2026-09-04 04:58:52.207718+00
act-1788497933111	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:58:53.111Z	\N	2026-09-04 04:58:53.129535+00
act-1788497964954	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T04:59:24.954Z	\N	2026-09-04 04:59:24.97405+00
act-1788498032372	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-04T05:00:32.372Z	\N	2026-09-04 05:00:32.390293+00
act-1788757244240	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0010	2026-09-07T05:00:44.240Z	\N	2026-09-07 05:00:44.261662+00
act-1788757257242	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0032	2026-09-07T05:00:57.242Z	\N	2026-09-07 05:00:57.261381+00
act-1788757262663	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0016	2026-09-07T05:01:02.663Z	\N	2026-09-07 05:01:02.681288+00
act-1788757266943	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0014	2026-09-07T05:01:06.943Z	\N	2026-09-07 05:01:06.962285+00
act-1788757271694	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0030	2026-09-07T05:01:11.694Z	\N	2026-09-07 05:01:11.71418+00
act-1788757279710	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0030	2026-09-07T05:01:19.710Z	\N	2026-09-07 05:01:19.731096+00
act-1788757281811	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0014	2026-09-07T05:01:21.811Z	\N	2026-09-07 05:01:21.835663+00
act-1788757283928	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0032	2026-09-07T05:01:23.928Z	\N	2026-09-07 05:01:23.947857+00
act-1788757289071	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0016	2026-09-07T05:01:29.071Z	\N	2026-09-07 05:01:29.092007+00
act-1788757294154	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_RESIDENT	residents	res-0010	2026-09-07T05:01:34.154Z	\N	2026-09-07 05:01:34.174975+00
act-1788759027481	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_TALENT	talent	tal-1788496235108	2026-09-07T05:30:27.481Z	\N	2026-09-07 05:30:27.498918+00
act-1788762364036	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-07T06:26:04.036Z	\N	2026-09-07 06:26:04.055776+00
act-1788773610159	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMPANIES	companies	co-0797	2026-09-07T09:33:30.159Z	\N	2026-09-07 09:33:30.177585+00
act-1788773618813	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMPANIES	companies	co-0797	2026-09-07T09:33:38.813Z	\N	2026-09-07 09:33:38.833388+00
act-1788777477770	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-07T10:37:57.770Z	\N	2026-09-07 10:37:57.795848+00
act-1788800496507	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_VACANCIES	vacancies	vac-1788800495475	2026-09-07T17:01:36.507Z	\N	2026-09-07 17:01:39.395847+00
act-1788800496833	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_VACANCIES	vacancies	vac-1788800495978	2026-09-07T17:01:36.833Z	\N	2026-09-07 17:01:39.718591+00
act-1788800504277	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_VACANCIES	vacancies	vac-1788800495978	2026-09-07T17:01:44.277Z	\N	2026-09-07 17:01:47.196995+00
act-1788800519504	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_VACANCYAPPLICATIONS	vacancyApplications	vac-1788800519380	2026-09-07T17:01:59.504Z	\N	2026-09-07 17:02:02.410881+00
act-1788801078615	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-07T17:11:18.615Z	\N	2026-09-07 17:11:21.521156+00
act-1788801096549	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_VACANCYAPPLICATIONS	vacancyApplications	vac-1788800519380	2026-09-07T17:11:36.549Z	\N	2026-09-07 17:11:39.772265+00
act-1788801101931	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_VACANCYAPPLICATIONS	vacancyApplications	vac-1788800519380	2026-09-07T17:11:41.931Z	\N	2026-09-07 17:11:44.905367+00
act-1788853805682	u-5	Jasurbek Beknazarov	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-08T07:50:05.682Z	\N	2026-09-08 07:50:05.695959+00
act-1788862550103	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1788862550080	2026-09-08T10:15:50.103Z	\N	2026-09-08 10:15:50.116792+00
act-1788862758381	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1788862758352	2026-09-08T10:19:18.381Z	\N	2026-09-08 10:19:18.411881+00
act-1788862793016	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_VACANCIES	vacancies	vac-1788862550080	2026-09-08T10:19:53.016Z	\N	2026-09-08 10:19:53.029649+00
act-1788863156488	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1788863156457	2026-09-08T10:25:56.488Z	\N	2026-09-08 10:25:56.50203+00
act-1788863651790	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1788863651771	2026-09-08T10:34:11.790Z	\N	2026-09-08 10:34:11.80768+00
act-1788864905469	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-08T10:55:05.469Z	\N	2026-09-08 10:55:05.478572+00
act-1788885747285	u-1	Hasan Abdukarimov	SUPER_ADMIN	UPDATE_KPITARGETS	kpiTargets	export_companies	2026-09-08T16:42:27.285Z	\N	2026-09-08 16:42:30.353098+00
act-1788886768304	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-08T16:59:28.304Z	\N	2026-09-08 16:59:31.353404+00
act-1789042145995	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1789042145973	2026-09-10T12:09:05.995Z	\N	2026-09-10 12:09:06.014162+00
act-1789042146109	u-4	Shohjaxon Xudoyberdiyev	MANAGER	CREATE_VACANCIES	vacancies	vac-1789042146087	2026-09-10T12:09:06.109Z	\N	2026-09-10 12:09:06.122562+00
act-1789042158339	u-4	Shohjaxon Xudoyberdiyev	MANAGER	DELETE_VACANCIES	vacancies	vac-1789042146087	2026-09-10T12:09:18.339Z	\N	2026-09-10 12:09:18.357047+00
act-1789042386765	u-4	Shohjaxon Xudoyberdiyev	MANAGER	UPDATE_COMMENTS	comments	com-1788325498497	2026-09-10T12:13:06.765Z	\N	2026-09-10 12:13:06.786507+00
act-1789148391771	u-1	Hasan Abdukarimov	SUPER_ADMIN	USER_LOGIN	auth	u-1	2026-09-11T17:39:51.771Z	\N	2026-09-11 17:39:51.788612+00
act-1789148398683	u-1	Hasan Abdukarimov	SUPER_ADMIN	CREATE_TALENT	talent	tal-1789148398660	2026-09-11T17:39:58.683Z	\N	2026-09-11 17:39:58.697205+00
act-1789148402557	u-1	Hasan Abdukarimov	SUPER_ADMIN	DELETE_TALENT	talent	tal-1789148398660	2026-09-11T17:40:02.557Z	\N	2026-09-11 17:40:02.576361+00
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assets (id, name, "serialNumber", category, "purchaseDate", "warrantyExpiry", condition, "assignedOfficeId", "assignedOfficeNumber", "assignedUserId", "assignedUserName", "purchaseCost", image, "maintenanceHistory", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.buildings (id, name, code, address, region, district, coordinates, "constructionYear", floors, "totalArea", "totalOffices", capacity, "parkingSpots", "meetingRooms", status, images, "virtualTourUrl", documents, "createdAt", "updatedAt", notes) FROM stdin;
bldg-qshq-07	Bunyodkor ko'chasi 5/6	QSHQ-BLDG-07	Qarshi shahri, Bunyodkor ko'chasi, 5/6-uy	Kashkadarya	Qarshi	\N	2022	5	80.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-07/cover.jpg}	https://maps.app.goo.gl/uQF3X9tCCvj7DPCw8	{}	2026-08-31 17:21:14.585887+00	2026-08-31 17:21:14.585887+00	\N
bldg-qshq-09	Yettitom shaharchasi 2	QSHQ-BLDG-09	Ko'kdala tumani, Yettitom shaharchasi, 2-uy	Kashkadarya	Ko'kdala	\N	2022	3	500.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-09/cover.jpg}	https://maps.app.goo.gl/8wSq9vnQL5k8TL1u5	{}	2026-08-31 17:21:14.772653+00	2026-08-31 17:21:14.772653+00	\N
bldg-qshq-11	Mustaqillik ko'chasi 7	QSHQ-BLDG-11	Qarshi shahri, Mustaqillik ko'chasi, 7 uy	Kashkadarya	Qarshi	\N	2022	4	400.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-11/cover.png}	https://maps.app.goo.gl/MHyE5xvXb1gcobEs9	{}	2026-08-31 17:21:14.959296+00	2026-08-31 17:21:14.959296+00	\N
bldg-qshq-02	Zardo'zli ko'chasi 26	QSHQ-BLDG-02	Qarshi shahar, Qarloq bog'ot MFY, Zardo'zli kuchasi 26-uy	Kashkadarya	Qarshi	\N	2022	5	2900.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-02/cover.jpeg}	https://maps.app.goo.gl/zmXUy1CjqgSnmgF7A	{}	2026-08-31 17:21:14.119535+00	2026-08-31 17:21:14.119535+00	\N
bldg-qshq-03	Nasaf ko'chasi 176A	QSHQ-BLDG-03	Qarshi shahar, Nasaf kuchasi 176 A	Kashkadarya	Qarshi	\N	2022	3	300.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-03/cover.jpeg}	https://maps.app.goo.gl/FFAHkNBQ2t89JYEr9	{}	2026-08-31 17:21:14.212636+00	2026-08-31 17:21:14.212636+00	\N
bldg-qshq-04	Qarloq Bog'ot 410	QSHQ-BLDG-04	Qarshi shahar, Qarloq bog'ot MFY, Qarloq bog'ot 410-uy	Kashkadarya	Qarshi	\N	2022	4	1800.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-04/cover.jpeg}	https://maps.app.goo.gl/zWpehuPGbUDtZ829A	{}	2026-08-31 17:21:14.306068+00	2026-08-31 17:21:14.306068+00	\N
bldg-qshq-05	Nasaf ko'chasi (Qarloq Bog'ot)	QSHQ-BLDG-05	Qarshi shahar, Qarluq bog'ot MFY, Nasaf kuchasi	Kashkadarya	Qarshi	\N	2022	4	900.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-05/cover.jpeg}	https://maps.app.goo.gl/hqfjoFWT8hic51296	{}	2026-08-31 17:21:14.399713+00	2026-08-31 17:21:14.399713+00	\N
bldg-qshq-08	Mustaqillik shox ko'chasi 225	QSHQ-BLDG-08	Qarshi shahri, Mustaqillik shox ko'chasi, 225-uy	Kashkadarya	Qarshi	\N	2022	5	72.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-08/cover.jpg}	https://maps.app.goo.gl/SZhCtxQzt9e8rGon7	{}	2026-08-31 17:21:14.679206+00	2026-08-31 17:21:14.679206+00	\N
bldg-qshq-01	Bunyodkor ko'chasi 15	QSHQ-BLDG-01	Qarshi shahar, 1-mikro mitti tuman, Bunyodkor kuchasi 15-uy	Kashkadarya	Qarshi	\N	2022	4	1100.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-01/cover.jpeg}	https://maps.app.goo.gl/ukRrnmnHdKzbpz4t9	{}	2026-08-31 17:21:14.025005+00	2026-08-31 17:21:14.025005+00	\N
bldg-qshq-06	Nasaf ko'chasi 279 (Mag'zon)	QSHQ-BLDG-06	Qarshi shahar, Mag'zon MFY, Nasaf kuchasi 279 uy	Kashkadarya	Qarshi	\N	2022	2	300.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-06/cover.jpeg}	https://maps.app.goo.gl/FMHh3MeTytf3ukKj6	{}	2026-08-31 17:21:14.49273+00	2026-08-31 17:21:14.49273+00	\N
bldg-qshq-10	Geologlar ko'chasi 22/2 (Jurnalistlar uyi)	QSHQ-BLDG-10	Qarshi shahar, Geologlar kuchasi, 22/2 uy (Jurnalistlar uyi)	Kashkadarya	Qarshi	\N	2022	3	3300.00	0	0	0	0	ACTIVE	{/buildings/bldg-qshq-10/cover.jpeg}	https://maps.app.goo.gl/SFXBmFzbEvtogXAM7	{}	2026-08-31 17:21:14.865956+00	2026-08-31 17:21:14.865956+00	\N
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.companies (id, name, country, industry, website, "leadScore", status, "createdAt", "updatedAt", "leadSource", segment, "employeeCountBand", "nextFollowUpDate", "lastContactedDate", "nextStep", "isSuccessStory", "successStoryText", "benefitsPitched", "competingOptions") FROM stdin;
co-0815	Apinizer	Ozarbayjan	BPO	https://www.apinizer.com/	70	CONTACTED	2026-08-31 17:21:09.823664+00	2026-08-31 17:21:09.823664+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0823	Payments & Fintech Consultant	Jordan	BPO		40	LEAD	2026-08-31 17:21:10.289981+00	2026-08-31 17:21:10.289981+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0833	NSART	Kazakhstan,Astana	BPO	https://nsartgateway.com	70	CONTACTED	2026-08-31 17:21:10.662953+00	2026-08-31 17:21:10.662953+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0797	INNOWISE	Poland	BPO	innowise.com	40	CONTACTED	2026-08-31 17:21:09.077347+00	2026-08-31 17:21:09.077347+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0811	VEEAM Software	Czech,Prague	BPO	https://www.veeam.com/	70	CONTACTED	2026-08-31 17:21:08.611543+00	2026-08-31 17:21:08.611543+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0789	Dreamlab Technologies Ltd	Kazakhstan	BPO	https://dreamlab.net	70	CONTACTED	2026-08-31 17:21:08.704628+00	2026-08-31 17:21:08.704628+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0787	Vacotel	Kazakhstan	BPO	https://vacotel.net	70	CONTACTED	2026-08-31 17:21:08.516089+00	2026-08-31 17:21:08.516089+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0821	NocodeLynx	Pakistan	BPO	www.nocodelynx.com	40	LEAD	2026-08-31 17:21:10.196743+00	2026-08-31 17:21:10.196743+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0835	DARS Consulting,BBC	United Kingdom	BPO	https://careers.bbc.co.uk/	70	CONTACTED	2026-08-31 17:21:10.7561+00	2026-08-31 17:21:10.7561+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0805	System Analytic Solutions (SAS)	Kazakhstan	BPO	https://sas.kz	40	LEAD	2026-08-31 17:21:09.450909+00	2026-08-31 17:21:09.450909+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0799	SDworx	Poland	BPO	sdworx.com	70	CONTACTED	2026-08-31 17:21:09.170605+00	2026-08-31 17:21:09.170605+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0807	Orbital.global	USA	BPO	http://orbital.global	70	CONTACTED	2026-08-31 17:21:09.544223+00	2026-08-31 17:21:09.544223+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0819	VENITRUST	Dubai, United Arab Emirates	BPO	https://venitrust.ae/	70	CONTACTED	2026-08-31 17:21:10.103674+00	2026-08-31 17:21:10.103674+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0837	DSML Kazakhstan (DSMLKZ)	Kazakhstan	BPO	https://dsml.kz/	40	LEAD	2026-08-31 17:21:11.03586+00	2026-08-31 17:21:11.03586+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0791	Yango Tech	Kazakhstan	BPO	https://tech.yango.com	70	CONTACTED	2026-08-31 17:21:08.797918+00	2026-08-31 17:21:08.797918+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0843	NAG global international marketing and investment	Tunesia ,Uzbekistan	BPO	linkedin.com/in/naoufel-daoudi-14815628b	40	LEAD	2026-08-31 17:21:11.128911+00	2026-08-31 17:21:11.128911+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0785	T-Hub	India	BPO	https://t-hub.co	70	CONTACTED	2026-08-31 17:21:08.423065+00	2026-08-31 17:21:08.423065+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0801	OLXGROUP	Poland	BPO	olxgroup.com	70	CONTACTED	2026-08-31 17:21:09.263996+00	2026-08-31 17:21:09.263996+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0803	LexisNexis Risk Solutions	Poland	BPO	https://risk.lexisnexis.com/global/en	70	CONTACTED	2026-08-31 17:21:09.357501+00	2026-08-31 17:21:09.357501+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0825	International Bridge Advisors	USA	BPO	www.internationalbridgeadvisors.com	40	LEAD	2026-08-31 17:21:10.383309+00	2026-08-31 17:21:10.383309+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0827	Zoklio	United Arab Emirates	BPO	https://www.linkedin.com/company/zoklio/jobs/	40	LEAD	2026-08-31 17:21:10.47637+00	2026-08-31 17:21:10.47637+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0839	4dev.com	Sheridan, Wyoming	BPO	https://4dev.com	70	CONTACTED	2026-08-31 17:21:10.849385+00	2026-08-31 17:21:10.849385+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0809	Invest in Pomerenia	Poland,Gdansk	BPO	https://investgda.pl/en/	70	CONTACTED	2026-08-31 17:21:09.637406+00	2026-08-31 17:21:09.637406+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0829	Flametree	Cyprus	BPO	https://flametree.ai/en-US/	40	LEAD	2026-08-31 17:21:10.569678+00	2026-08-31 17:21:10.569678+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0841	kemel.solutions	Astana, Kazakhstan	BPO	https://kemel.solutions	70	CONTACTED	2026-08-31 17:21:10.942323+00	2026-08-31 17:21:10.942323+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0813	Iconicompany	Russia	BPO	iconicompany.com	70	CONTACTED	2026-08-31 17:21:09.730579+00	2026-08-31 17:21:09.730579+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0831	Salmon	Filippin	BPO	https://salmon.ph/	70	CONTACTED	2026-08-31 17:21:09.916867+00	2026-08-31 17:21:09.916867+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0817	Olivia Centre	Poland	BPO	http://www.oliviacentre.com	70	CONTACTED	2026-08-31 17:21:10.010155+00	2026-08-31 17:21:10.010155+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0793	Chipmath	Pakistan	BPO	https://www.chipmath.com	70	CONTACTED	2026-08-31 17:21:08.891149+00	2026-08-31 17:21:08.891149+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
co-0795	ELSINORE DATA COMPANY	USA	BPO	Elsinore.org	70	CONTACTED	2026-08-31 17:21:08.984396+00	2026-08-31 17:21:08.984396+00	\N	\N	\N	\N	\N	\N	f	\N	[]	\N
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contacts (id, "companyId", "companyName", "fullName", role, email, phone, "linkedInUrl", notes, "createdAt", "updatedAt") FROM stdin;
ct-0788	co-0787	Vacotel	Business Development / Account Management	Business Development / Account Management – Wholesale Telecom (VoIP & SMS) Associated with VACOTEL (International Wholesale Carrier)	anna.dembitska@vacotel.net		\N	Market: EU | Size: 11–50 | Est. revenue: 1 | Source: Cold Email | company desicion makers should to respond and from our side all details were given	2026-08-31 17:21:11.785794+00	2026-08-31 17:21:11.785794+00
ct-0810	co-0809	Invest in Pomerenia	Invset in Pomerenia team	Procces is still going	a.pietrzak@investgda.pl		\N	Market: EU | Size: 11–50 | Est. revenue: 5 | Source: LinkedIn Outreach | Great discussion with Invest in Pomerania team on investment opportunities and strengthening international cooperation.\nDuring the meeting, we presented Uzbekistan’s IT ecosystem, highlighting key advantages for international companies — from talent availability to a rapidly growing startup environment.\nClear interest from both sides to explore practical collaboration and long-term partnership.\nLooking forward to the next steps.	2026-08-31 17:21:11.503434+00	2026-08-31 17:21:11.503434+00
ct-0842	co-0841	kemel.solutions	Abulkhair Shayakhmetov CEO@kemel.solutions | Strategic PMO Leader | Agile, AI & Tech Expert	kemel.solutions offers innovative solutions in IT, marketing, and business optimization.	linkedin.com/in/ashayakhmetov		\N	Market: CIS | Size: 1–10 | Est. revenue: 5 | Source: LinkedIn Outreach | The company has delivered 100+ projects while operating with a relatively small team. As demand grows, scaling delivery efficiently may become challenging.	2026-08-31 17:21:12.906212+00	2026-08-31 17:21:12.906212+00
ct-0792	co-0791	Yango Tech	Business Development Manager for the CIS countries	Yango is a Dubai-based global tech super-app offering ride-hailing, delivery, and AI-powered B2B solutions across 30+ countries.	zhakhmetov@yango-team.com		\N	Market: Asia-Pacific | Size: 300+ | Est. revenue: 2 | Source: Cold Email	2026-08-31 17:21:11.973188+00	2026-08-31 17:21:11.973188+00
ct-0796	co-0795	ELSINORE DATA COMPANY	he is the founder and CEO of Nautical Commerce (a marketplace platform), which intersects with Elsinore's interests in the field of modern cloud infrastructure and fintech.	founder and CEO of Nautical Commerce (a marketplace platform)	rdlee210@gmail.com		\N	Market: US | Size: 11–50 | Est. revenue: 10 | Source: Cold Email | he is the founder and CEO of Nautical Commerce (a marketplace platform), which intersects with Elsinore's interests in the field of modern cloud infrastructure and fintech.	2026-08-31 17:21:12.06656+00	2026-08-31 17:21:12.06656+00
ct-0790	co-0789	Dreamlab Technologies Ltd	Head of Projects | Senior Lecturer on IT Law	Drives development of complex software solutions for government clients	zhumabekov.a@dreamlab.kz		\N	Market: EU | Size: 101–300 | Est. revenue: 5.8 | Source: Cold Email | for colloboration need to be disscuss further	2026-08-31 17:21:11.879426+00	2026-08-31 17:21:11.879426+00
ct-0832	co-0831	Salmon	Yevgen	Salmon is a next-generation financial technology (fintech) company operating in the Philippines with a mission to democratize access to modern, intuitive financial services	+6598699165		\N	Market: Asia-Pacific | Size: 300+ | Est. revenue: 9 | Source: LinkedIn Outreach | Salmon’s tagline, "Financing reimagined with smart loans, credit, and savings," encapsulates its commitment to transforming the traditional financial landscape by making financial services accessible, transparent, and user-friendly for millions of Filipinos—from jeepney drivers and farmers to office workers and teachers.	2026-08-31 17:21:12.439897+00	2026-08-31 17:21:12.439897+00
ct-0798	co-0797	INNOWISE	Data ingener	Data Ingener	https://www.linkedin.com/company/innowise-group/about/?viewAsMember=true		\N	Market: EU | Size: 300+ | Est. revenue: 5 | Source: LinkedIn Outreach | Innowise is an international IT company that focuses on software development and IT services.We have a contact from there and there is a branch in Tashkent .	2026-08-31 17:21:12.1597+00	2026-08-31 17:21:12.1597+00
ct-0802	co-0801	OLXGROUP	Mukhammadali Shukhratov	Software Engineer	muhammadalishuhratov8@gmail.com		\N	Market: EU | Size: 51–100 | Est. revenue: 1 | Source: LinkedIn Outreach | The conversation focused primarily on attracting European IT companies to Uzbekistan, exploring opportunities within the local market, and identifying new направления that could be developed for young professionals.\n\nIn particular, we discussed the development of IT infrastructure in Uzbekistan, creating a favorable environment for international companies, and opportunities for integration into the global market.	2026-08-31 17:21:12.346539+00	2026-08-31 17:21:12.346539+00
ct-0814	co-0813	Iconicompany	Viacheslav Borisov	The company leverages LLMs, scoring systems, and vector search technologies to automate talent matching and improve IT recruitment processes.	slavb18@gmail.com		\N	Market: EU | Size: 101–300 | Est. revenue: 4 | Source: LinkedIn Outreach | CTO /Founder | Iconicompany – AI-Driven IT Staffing & Outstaffing Platform | Automating Talent Matching with LLMs, Scoring & Vector Search | Innovating IT Recruitment Since 2022	2026-08-31 17:21:11.692202+00	2026-08-31 17:21:11.692202+00
ct-0806	co-0805	System Analytic Solutions (SAS)	SAS Team	SAS Company Meeting Summary	Akerke.kz2015@mail.ru		\N	Market: Asia-Pacific | Size: 1–10 | Est. revenue: 2 | Source: Cold Email | During the meeting, the main areas of activity of SAS were presented. These included business process optimization, implementation of IT and ERP systems, analytical modeling, and data architecture solutions.\nIn addition, several major projects carried out by the company were introduced. It was highlighted that SAS has extensive experience in developing complex information systems, particularly in the transport and logistics sector.	2026-08-31 17:21:11.316133+00	2026-08-31 17:21:11.316133+00
ct-0844	co-0843	NAG global international marketing and investment	NAOUFEL DAOUDI	He aready open a company in Tashkent	ddnaoufel@gmail.com		\N	Market: MENA | Size: 1–10 | Est. revenue: 9 | Source: LinkedIn Outreach | We have a good communacation with him.He has good attitude to open branch,we are in aprocces	2026-08-31 17:21:12.999685+00	2026-08-31 17:21:12.999685+00
ct-0800	co-0799	SDworx	Ozodbek Tursunaliyev	Data ingener,HR-manager	ozodbektursunaiev@gmail.com		\N	Market: EU | Size: 101–300 | Est. revenue: 1 | Source: LinkedIn Outreach | SD Worx is a well-known European HR and payroll solutions company, mainly focused on workforce management, payroll, and HR software.	2026-08-31 17:21:12.252991+00	2026-08-31 17:21:12.252991+00
ct-0828	co-0827	Zoklio	CMO | Get Leads in 90 Days from LinkedIn | Ghostwriting	We Grow Your LinkedIn in 60 Days	linkedin.com/in/nimra-khatoon		\N	Market: EU | Size: 1–10 | Est. revenue: 5 | Source: LinkedIn Outreach | We Build Magnetic Personal Brands That Attract Clients & Opportunities	2026-08-31 17:21:13.652152+00	2026-08-31 17:21:13.652152+00
ct-0830	co-0829	Flametree	Oleg Baranov	Serial IT entrepreneur and venture investor with a strong track record in building and scaling technology businesses. Focused on AI-driven solutions, software development, and IT professional services for banks and other financial institutions.	linkedin.com/in/baranovoleg		\N	Market: EU | Size: 1–10 | Est. revenue: 5 | Source: LinkedIn Outreach	2026-08-31 17:21:13.745098+00	2026-08-31 17:21:13.745098+00
ct-0794	co-0793	Chipmath	Tech Enablement & Operations Lead | Driving Global IT Partnerships at ChipMath | Building Strategic Connections Across SaaS, AI & Cloud Ecosystems	Tech Enablement & Operations Lead	udnan.ali@chipmath.com		\N	Market: Asia-Pacific | Size: 11–50 | Est. revenue: 2 | Source: Cold Email | ChipMath is an AI-focused IT consulting company with strong GCC market positioning and cost-efficient global delivery, suitable for outsourcing, AI solutions, and digital transformation projects.	2026-08-31 17:21:13.838439+00	2026-08-31 17:21:13.838439+00
ct-0816	co-0815	Apinizer	CEO at KayraTech | Enterprise API Gateway & Integration Solutions | PhD | Retired Colonel	Apinizer is a B2B enterprise software company focused on API Management, Integration, and API Security platforms.	ramizimanov72@gmail.com		\N	Market: CIS | Size: 11–50 | Est. revenue: 5 | Source: Cold Email | IT Park Uzbekistan rules, Apinizer is  a very suitable candidate to collaborate with IT Park Uzbekistan and potentially open a branch there as an IT Park resident.	2026-08-31 17:21:13.931668+00	2026-08-31 17:21:13.931668+00
ct-0836	co-0835	DARS Consulting,BBC	Sergey Stanovkin	Meeting with Sergey Stanovkin	sergey@stanovkin.london		\N	Market: EU | Size: 300+ | Est. revenue: 18 | Source: LinkedIn Outreach | Initial online meeting conducted with Sergey Stanovkin (Managing Partner, DARS Consulting, UK). Discussed IT Park Uzbekistan residency program, foreign investment opportunities, BPO development, and potential cooperation in attracting international IT companies. Follow-up discussions are planned.	2026-08-31 17:21:12.62662+00	2026-08-31 17:21:12.62662+00
ct-0838	co-0837	DSML Kazakhstan (DSMLKZ)	Anuar Aimoldin	DSML Kazakhstan (DSMLKZ)	-		\N	Market: CIS | Size: 1–10 | Est. revenue: 5 | Source: LinkedIn Outreach	2026-08-31 17:21:12.719899+00	2026-08-31 17:21:12.719899+00
ct-0840	co-0839	4dev.com	Business Development Manager	Global contractor workflows. Manage contractors in 150+ countries, keep documents ready, and stay compliant.	righthererightnow21@mail.ru     linkedin.com/in/davletbaeva		\N	Market: EU | Size: 101–300 | Est. revenue: 8 | Source: LinkedIn Outreach | she answered:\nHello @hasanabdukarimov , I apologize for the delayed response. I’m currently attending ChinaJoy and will be back only next Thursday. I'll get back to you with an update at my earliest convenience upon my return. Truly appreciate your understanding🙏🙏	2026-08-31 17:21:12.812952+00	2026-08-31 17:21:12.812952+00
ct-0804	co-0803	LexisNexis Risk Solutions	Polina Kolesnikova	AI Market Development Specialist	linkedin.com/in/polina-kolesnikova		\N	Market: EU | Size: 51–100 | Est. revenue: 1 | Source: LinkedIn Outreach | We discussed potential opportunities for collaboration, and I’m glad to see strong interest in Uzbekistan’s IT Park and its growing ecosystem.\n\nIt’s always inspiring to connect with professionals in compliance, fraud prevention, and payments, and explore ways to build international partnerships.\n\nLooking forward to staying in touch and developing this connection further.	2026-08-31 17:21:11.222248+00	2026-08-31 17:21:11.222248+00
ct-0834	co-0833	NSART	Nurgozha Kaliaskarov	NSART – AI, GovTech & Digital Infrastructure Company	nur@nsart.kz		\N	Market: MENA | Size: 11–50 | Est. revenue: 9 | Source: LinkedIn Outreach | interested in IT Park Uzbekistan, ongoing, opening telegram group and started exchanging documents and sending invitation letter for ICTWEEK 2026	2026-08-31 17:21:12.53313+00	2026-08-31 17:21:12.53313+00
ct-0812	co-0811	VEEAM Software	Python Developer	During the session, we discussed real-world experience: • How to move from a local IT environment to a global tech company • The importance of QA, automation, and cybersecurity skills • What companies like Veeam actually expect from engineers	linkedin.com/in/davron-nematov		\N	Market: EU | Size: 300+ | Est. revenue: 6 | Source: LinkedIn Outreach | My role in this session was as an active participant — asking questions, analyzing the company, and connecting theory with real industry insights.	2026-08-31 17:21:11.598802+00	2026-08-31 17:21:11.598802+00
ct-0822	co-0821	NocodeLynx	Bubble.io Developer | Product Manager | SQA Specialist Awais ur Rehman	IT Services and IT Consulting	linkedin.com/in/awais-ur-rehman-41220a316		\N	Market: Asia-Pacific | Size: 1–10 | Est. revenue: 5 | Source: LinkedIn Outreach | To explore potential cooperation opportunities between IT Park Kashkadarya, the Digitalization Department of Kashkadarya Region, and NoCodeLynx in the fields of AI, automation, startup development, and digital transformation.	2026-08-31 17:21:13.372678+00	2026-08-31 17:21:13.372678+00
ct-0818	co-0817	Olivia Centre	Expert in the office market, remote & hybrid work trends, office transformation, community-building and employee well-being | Director at Olivia Centre🌇 | Amateur Winter Sailor | Atlanta Experience by Maciej Kotarski	Olivia Centre	maciej.kotarski@oliviacentre.com		\N	Market: EU | Size: 11–50 | Est. revenue: 3 | Source: LinkedIn Outreach | Discussed cooperation with IT Park Uzbekistan focused on IT talent development, international partnerships, outsourcing, and strengthening ties between European and Central Asian tech ecosystems. Potential joint initiatives and strategic partnerships planned.	2026-08-31 17:21:13.279226+00	2026-08-31 17:21:13.279226+00
ct-0824	co-0823	Payments & Fintech Consultant	Software Engineer | Fintech | Consultation | Product, Systems & Technical Strategy	Software Engineer | Fintech | Consultation | Product, Systems & Technical Strategy	linkedin.com/in/saleem-khair-359795108		\N	Market: Asia-Pacific | Size: 11–50 | Est. revenue: 1 | Source: LinkedIn Outreach	2026-08-31 17:21:13.465966+00	2026-08-31 17:21:13.465966+00
ct-0826	co-0825	International Bridge Advisors	Senior Engineer/Application Engineer- International Business Consultant Mainly Commodities, Steel/Metal, and Renewable Energy Sector, (Aircraft Engineer - Professional UAV Pilot) - Currently in China.	International Business Specialist,	linkedin.com/in/massoodsharify786		\N	Market: Asia-Pacific | Size: 11–50 | Est. revenue: 7 | Source: LinkedIn Outreach | "Unlocking Global Potential, Empowering Business Growth"	2026-08-31 17:21:13.55895+00	2026-08-31 17:21:13.55895+00
ct-0808	co-0807	Orbital.global	Co-Founder, Orbital Data Consulting | eDiscovery & Legal Technology Expert	Helping you produce defensible digital evidence | eDiscovery | Digital Forensics | Cyber Security | Co-Founder, Orbital Data Consulting	hunniford@hotmail.com		\N	Market: US | Size: 11–50 | Est. revenue: 5 | Source: LinkedIn Outreach | Orbital Global (officially Orbital Data Consulting) is a pioneering legal technology consulting firm founded in 2020 by Bill Odom and Andy Hunniford. The company represents a new paradigm in the eDiscovery and digital forensics industry as the world's first eDiscovery legal services consulting company entirely optimized to thrive in the cloud.	2026-08-31 17:21:11.409768+00	2026-08-31 17:21:11.409768+00
ct-0786	co-0785	T-Hub	CEO / Chief Innovation Officer / Corporate Innovation Head (To Be Identified)	CEO / Chief Innovation Officer / Head – Corporate Innovation / Partnerships Director	info@t-hub.co		\N	Market: Asia-Pacific | Size: 101–300 | Est. revenue: 0.1 | Source: Website Research | 20-march will be next discussion	2026-08-31 17:21:13.092912+00	2026-08-31 17:21:13.092912+00
ct-0820	co-0819	VENITRUST	Gabriele Lantini · 1st  B2B Market Validation & Infrastructure in the United Arab Emirates | GCC Strategic Expansion | Founder & CEO @ VENITRUST | Accelerating Cash Collection for B2B Leaders.	Gabriele Lantini appears to be an Italian entrepreneur, business developer, and former startup founder who has worked in both digital transformation and HR technology. More recently,	gabriele.lantini@gmail.com		\N	Market: Asia-Pacific | Size: 101–300 | Est. revenue: 6 | Source: LinkedIn Outreach | He can orginize online meeting for startups and Rezidents of IT Park Kashkadarya	2026-08-31 17:21:13.186128+00	2026-08-31 17:21:13.186128+00
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contracts (id, "contractNumber", "tenantId", "tenantName", "officeId", "officeNumber", "buildingBlock", "contractType", "startDate", "endDate", "monthlyRentUSD", status, "documentUrl", "digitalSignature", "signedAt", payments) FROM stdin;
\.


--
-- Data for Name: entity_store; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.entity_store (collection, id, data, "createdAt", "updatedAt") FROM stdin;
vacancies	vac-1788800495475	{"title": "Dispatcher", "status": "OPEN", "benefits": [], "location": "Qarshi city", "createdAt": "2026-09-07T17:01:35.091Z", "salaryMax": 1000, "salaryMin": 500, "seniority": "Mid", "updatedAt": "2026-09-07T17:01:35.091Z", "department": "Dispatch", "postedDate": "2026-09-07", "residentId": "res-0046", "description": "Skills need", "deadlineDate": "2026-09-30", "englishLevel": "C1", "requirements": [], "residentName": "«NNT EXPRESS INC» MCHJ", "employmentType": "Full-time", "requiredSkills": [], "preferredSkills": [], "numberOfOpenings": 10, "responsibilities": [], "salaryNegotiable": true}	2026-09-07 17:01:39.262619+00	2026-09-07 17:01:39.262619+00
properties	prop-qshq-13	{"city": "Qarshi", "name": "Qarshi - Uzbekiston ko’chasi", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-13/photo-1.png"], "status": "Pending Verification", "address": "Qarshi shahri, Uzbekiston ko’chasi", "areaSqM": 60, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-13/photo-1.png", "ownerPhone": "+998 88 898 60 60", "description": "Manzil: Qarshi shahri, Uzbekiston ko’chasi. Bino maydoni 60 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/hriyVan7i6FoAMov8. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 88 898 60 60", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.551582+00	2026-09-08 17:01:36.821097+00
planningItems	plan-007	{"owner": "Hasan Abdukarimov", "title": "Initialize a git repository for ITPMS", "module": "Data & Backups", "status": "BLOCKED", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-09-02", "description": "No version control exists on this project yet. Two (now three, observed live during this session) silent db_store.json data reverts have happened — this is the single highest-value safety net still missing."}	2026-08-31 17:21:16.080854+00	2026-09-08 17:01:40.486661+00
planningItems	plan-001	{"owner": "Engineering", "title": "Rename AI Copilot branding to Google Studio", "module": "AI / Google Studio", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "All user-facing 'AI Copilot' labels, chat greetings, and dashboard copy switched to 'Google Studio' wording after the provider switch back to Gemini."}	2026-08-31 17:21:17.013998+00	2026-09-08 17:01:40.782241+00
planningItems	plan-008	{"owner": "Hasan Abdukarimov", "title": "Security hardening pass", "module": "Security", "status": "TOGETHER", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-09-15", "description": "Open /api/auth/register endpoint, placeholder JWT secrets, and a wildcard CORS_ORIGIN all need a decision on the right production posture before go-live."}	2026-08-31 17:21:16.174188+00	2026-09-08 17:01:40.879961+00
planningItems	plan-010	{"owner": "Unassigned", "title": "Configure a real Google Maps API key", "module": "Infrastructure", "status": "OPTIONAL", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-09-20", "description": "The Infrastructure / Property Marketplace map views are still running on the placeholder key from setup."}	2026-08-31 17:21:16.547243+00	2026-09-08 17:01:41.17561+00
planningItems	plan-006	{"owner": "Engineering", "title": "i18n: AnalyticsModule.tsx", "module": "Analytics", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "Completed — cross-module charts, KPIs, the Custom Report Studio, and the AI forecast card's surrounding text are now translated (the 'Gemini' brand name itself was left as-is)."}	2026-08-31 17:21:16.640439+00	2026-09-08 17:01:40.584297+00
planningItems	plan-009	{"owner": "Unassigned", "title": "Edit Profile pattern for CRM (companies/contacts) + fix dormant comment-edit", "module": "General / Platform", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "updatedAt": "2026-08-29T15:34:29.216163+00:00", "targetDate": "2026-09-20", "description": "Companies and contacts in the CRM module had no edit or delete path at all -- built full Edit Profile support for both (status field added to companies, phone/notes added to contacts, delete-with-confirmation for both), matching the Events module's pattern. Separately, CommentCard.tsx already had a fully-coded 'Edit Post' menu item and isAuthor check that was never wired up (onEditComment was never passed from CommentsModule.tsx) -- wired it to a small edit modal so authors can now edit their own posted comments; delete-own-comment was already working. This closes out the last item of the module-by-module Edit Profile audit -- Startups, Residents, Infrastructure, Talent, and now CRM/Comments are all done."}	2026-08-31 17:21:17.107422+00	2026-09-08 17:01:40.684428+00
planningItems	plan-003	{"owner": "Engineering", "title": "Strategic Planning & Roadmap module + sidebar entry", "module": "General / Platform", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "This module: a project-wide board of next steps (this very item), replacing the static roadmap document with something the team can edit directly."}	2026-08-31 17:21:16.827283+00	2026-09-08 17:01:41.275945+00
planningItems	plan-005	{"owner": "Engineering", "title": "i18n: OfficialITParkDashboard.tsx + ExecutiveIdeasHub.tsx", "module": "Dashboard", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "Completed — both views now use the shared t() translation system for their English UI chrome (the Uzbek government-report facsimile content in OfficialITParkDashboard was left as authentic Uzbek by design)."}	2026-08-31 17:21:16.360716+00	2026-09-08 17:01:40.977363+00
planningItems	plan-002	{"owner": "Engineering", "title": "Per-KPI target edit on Executive Dashboard", "module": "Dashboard", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "Admins can now adjust a KPI's annual and quarterly targets inline from the Strategic Scorecard instead of the values being hardcoded in kpiData.ts."}	2026-08-31 17:21:16.733971+00	2026-09-08 17:01:41.375815+00
aiConversations	conv-1787992967287	{"title": "Main AI Workspace", "pinned": false, "createdAt": "2026-08-29T08:42:47.287Z", "updatedAt": "2026-08-29T08:42:47.287Z"}	2026-08-31 17:21:17.29403+00	2026-09-08 17:01:42.161006+00
aiMessages	msg-1788016752729-u	{"text": "Analyze the top exporting residents in Qashqadaryo and calculate their tax exemption savings for 2026.", "sender": "user", "timestamp": "2026-08-29T15:19:12.729Z", "conversationId": "conv-1787992967287"}	2026-08-31 17:21:17.387343+00	2026-09-08 17:01:42.259114+00
aiMessages	msg-1788004824304-u	{"text": "Analyze the top exporting residents in Qashqadaryo and their 2026 tax exemption savings", "sender": "user", "timestamp": "2026-08-29T12:00:24.304Z", "conversationId": "conv-1787992967287"}	2026-08-31 17:21:17.480431+00	2026-09-08 17:01:42.357389+00
planningItems	plan-012	{"owner": "Hasan Abdukarimov", "title": "Persist properties + build Edit/Verify Profile for Infrastructure", "module": "Infrastructure", "status": "DONE", "createdAt": "2026-08-29T12:51:15.210767+00:00", "updatedAt": "2026-08-29T12:51:15.210767+00:00", "targetDate": "2026-08-29", "description": "Properties existed only as frontend seed data with zero backend persistence. Added a properties collection to db_store.json (seeded via seed_properties.mts), wired onAddProperty/onUpdateProperty through the generic entity API, and built an Edit / Verify Property form (room count, parking, available-from date, marketplace status, AC/meeting rooms, verified-on-site checkbox). i18n for this module and its new fields is still outstanding."}	2026-08-31 17:21:16.45398+00	2026-09-08 17:01:41.076086+00
properties	prop-qshq-3	{"city": "Qarshi", "name": "Qarshi - Nasaf ko'chasi 176A", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-3/photo-1.jpg", "/property-photos/prop-qshq-3/photo-2.jpg", "/property-photos/prop-qshq-3/photo-3.jpg", "/property-photos/prop-qshq-3/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Nasaf ko'chasi 176A", "areaSqM": 300, "district": "Qarshi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-3/photo-1.jpg", "ownerPhone": "+998 91 322 40 72", "description": "Manzil: Qarshi shahri, Nasaf ko'chasi 176A. Bino maydoni 300 m.kv, 3 qavat (2-3-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/FFAHkNBQ2t89JYEr9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 322 40 72", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.894153+00	2026-09-08 17:01:36.920058+00
aiMessages	msg-1788004824356-ai	{"text": "📊 **Top Exporting Residents in Qashqadaryo Regional Hub (2026 YTD)**\\n\\n1. **DataMesh Labs (Qarshi):** $1,420,000 USD (Cloud Data Engineering & DevOps — US & EU Clients)\\n2. **UzSoft Solutions (Shahrisabz):** $980,000 USD (Enterprise ERP & Fintech Systems — GCC & MENA)\\n3. **CyberShield Uz (Qarshi):** $750,000 USD (Penetration Testing & Security Ops — Central Europe)\\n4. **BPO Nexus Central (Kitob):** $520,000 USD (Multilingual Customer Support & Telematics — North America)\\n5. **AgroTech Global (Koson):** $310,000 USD (Smart Agriculture IoT Firmware — East Asia)\\n\\n📈 **Summary:** Total regional export volume is **$0.00M USD** across 82 active resident firms. 68% of 2026 annual target achieved.", "sender": "ai", "timestamp": "2026-08-29T12:00:24.356Z", "conversationId": "conv-1787992967287", "suggestedQuestions": ["Show top exporting residents in Qashqadaryo", "Draft compliance reminder for pending resident reports", "Explain IT Park tax exemption benefits for BPO companies", "Analyze regional job creation trajectory for 2026"]}	2026-08-31 17:21:17.57377+00	2026-09-08 17:01:42.457673+00
properties	prop-qshq-22	{"city": "Qarshi", "name": "Qarshi - Mustaqillik ko’chasi, 35 uy", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-22/photo-1.png", "/property-photos/prop-qshq-22/photo-2.png", "/property-photos/prop-qshq-22/photo-3.png", "/property-photos/prop-qshq-22/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, Mustaqillik ko’chasi, 35 uy", "areaSqM": 1400, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-22/photo-1.png", "ownerPhone": "+998 90 356 01 28", "description": "Manzil: Qarshi shahri, Mustaqillik ko’chasi, 35 uy. Bino maydoni 1400 m.kv, 3 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 356 01 28", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.57583+00	2026-09-08 17:01:37.120606+00
properties	prop-qshq-10	{"city": "Qarshi", "name": "Qarshi - Geologlar ko'chasi 22/2 (Jurnalistlar uyi)", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-10/photo-1.jpg", "/property-photos/prop-qshq-10/photo-2.jpg", "/property-photos/prop-qshq-10/photo-3.jpg", "/property-photos/prop-qshq-10/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Geologlar ko'chasi 22/2-uy (Jurnalistlar uyi, bino podvalida joy)", "areaSqM": 3300, "district": "Qarshi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-10/photo-1.jpg", "ownerPhone": "Ko'rsatilmagan", "description": "Manzil: Qarshi shahri, Geologlar ko'chasi 22/2-uy (Jurnalistlar uyi, bino podvalida joy). Bino maydoni 3300 m.kv, Bino 3 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/SFXBmFzbEvtogXAM7. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "Ko'rsatilmagan", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.800514+00	2026-09-08 17:01:37.219451+00
properties	prop-qshq-7	{"city": "Qarshi", "name": "Qarshi - Bunyodkor ko'chasi 5/6", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-7/photo-1.jpg", "/property-photos/prop-qshq-7/photo-2.jpg", "/property-photos/prop-qshq-7/photo-3.jpg", "/property-photos/prop-qshq-7/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Bunyodkor ko'chasi 5/6-uy (bino podvalida joylashgan)", "areaSqM": 80, "district": "Qarshi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-7/photo-1.jpg", "ownerPhone": "+998 90 426 83 93", "description": "Manzil: Qarshi shahri, Bunyodkor ko'chasi 5/6-uy (bino podvalida joylashgan). Bino maydoni 80 m.kv, Bino 5 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/uQF3X9tCCvj7DPCw8. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Panjiyev Ulug'bek (rektor)", "managerPhone": "+998 90 426 83 93", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.239601+00	2026-09-08 17:01:37.316778+00
properties	prop-qshq-8	{"city": "Qarshi", "name": "Qarshi - Mustaqillik shox ko'chasi 225", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-8/photo-1.jpg", "/property-photos/prop-qshq-8/photo-2.jpg", "/property-photos/prop-qshq-8/photo-3.jpg", "/property-photos/prop-qshq-8/photo-4.jpg", "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80"], "status": "Pending Verification", "address": "Qarshi shahri, Mustaqillik shox ko'chasi 225-uy (bino podvalida joylashgan)", "areaSqM": 72, "district": "Qarshi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-8/photo-1.jpg", "ownerPhone": "+998 97 200 78 09", "description": "Manzil: Qarshi shahri, Mustaqillik shox ko'chasi 225-uy (bino podvalida joylashgan). Bino maydoni 72 m.kv, Bino 5 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/SZhCtxQzt9e8rGon7. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Samijon Domla", "managerPhone": "+998 97 200 78 09", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.052625+00	2026-09-08 17:01:37.020752+00
edoReports	edo-1788458063021-8lb27zm	{"title": "IT-ПАРКНИНГ ҚАШҚАДАРЁ ВИЛОЯТ ФИЛИАЛИ БЎЙИЧА", "period": "2026-Q3", "status": "DRAFT", "sections": [{"key": "residents", "title": "I. РЕЗИДЕНТЛИК ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ", "autoStats": {"Xodimlar soni (Employees)": "521", "Eksport hajmi, USD (Export volume)": "$0", "Faol rezidentlar soni (Active residents)": 81, "Eksportyor korxonalar (Exporter companies)": 0, "Tumanlar bo'yicha taqsimot (Top districts)": "Unspecified (47), Qarshi (22), Koson (3), Shahrisabz (3), Qarshi District (2)", "Yetakchi faoliyat yo'nalishlari (Top industries)": "Unspecified (47), IT ta'lim (10), Eksport (8), Qo'llab-quvvatlash (5), Litsenziyalarni sotish (4)", "Ichki xizmatlar hajmi, USD (Domestic services volume)": "$0", "Ushbu davrda qabul qilingan yangi rezidentlar (New in 2026 йил 3-чорак)": 13}, "narrative": [{"id": "edo-1788458063018-j4a3hdv", "body": "", "heading": "Xorijiy IT va BPO kompaniyalarni jalb qilish bo'yicha natijalar"}, {"id": "edo-1788458063018-2ivvx8h", "body": "", "heading": "Xorijiy bozorlar bo'yicha tadqiqotlar"}, {"id": "edo-1788458063018-ipqqs69", "body": "", "heading": "Xalqaro xizmat safarlarini tashkil etish bo'yicha"}, {"id": "edo-1788458063018-2glqdru", "body": "", "heading": "Zero Risk dasturi"}, {"id": "edo-1788458063018-s97fv4r", "body": "", "heading": "Tumanlarda IT-ni rivojlantirish yo'nalishida"}], "manualStats": [{"id": "edo-1788458063018-yerqmbo", "label": "Xorijiy kapital ishtirokidagi kompaniyalar (Foreign-capital companies)", "value": ""}, {"id": "edo-1788458063018-ye2x69s", "label": "Xorijiy IT/BPO kompaniyalar bilan o'tkazilgan onlayn uchrashuvlar (Online meetings with foreign companies)", "value": ""}, {"id": "edo-1788458063018-nsiu1z3", "label": "Yangi jalb qilingan xorijiy kompaniyalar (New foreign companies engaged)", "value": ""}, {"id": "edo-1788458063018-9d8nm2p", "label": "Zero Risk dasturi ishtirokchilari (Zero Risk program participants)", "value": ""}, {"id": "edo-1788458063018-u6uhedh", "label": "Tashrif buyurilgan tuman-shahar hokimliklari (District/city hokimiyats visited)", "value": ""}], "autoStatsUpdatedAt": "2026-09-03T17:54:23.018Z"}, {"key": "startups", "title": "II. СТАРТАПЛАР ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ", "autoStats": {"Jami startaplar soni (Total startups)": 116, "Yaratilgan ish o'rinlari (Jobs created)": "0", "Dasturlar bo'yicha taqsimot (By program)": "—", "Eksport daromadi, USD (Total export revenue)": "$0", "Jalb qilingan investitsiya, USD (Total funding raised)": "$1,390,000", "Ushbu davrda ro'yxatga olingan yangi startaplar (New in 2026 йил 3-чорак)": 0}, "narrative": [{"id": "edo-1788458063020-tnfi196", "body": "", "heading": "Aksellerasiya dasturi"}, {"id": "edo-1788458063020-lup0nyp", "body": "", "heading": "Inkubatsiya dasturi"}, {"id": "edo-1788458063020-m7umvc0", "body": "", "heading": "Hackathon va Ideathon tanlovlari"}, {"id": "edo-1788458063020-lqinl5a", "body": "", "heading": "Investitsiya bo'yicha ma'lumot"}, {"id": "edo-1788458063020-g93dka1", "body": "", "heading": "PF-59-sonli qaror ijrosi va OTMlar bilan ishlash"}], "manualStats": [{"id": "edo-1788458063020-21p7r4i", "label": "Mahalliy tadbirlar soni (Local events organized)", "value": ""}, {"id": "edo-1788458063020-862u5qi", "label": "Tadbirlarda qamrab olingan yoshlar (Youth reached)", "value": ""}, {"id": "edo-1788458063020-jcknwri", "label": "Grant mablag'lari, so'm (Grants awarded, UZS)", "value": ""}], "autoStatsUpdatedAt": "2026-09-03T17:54:23.020Z"}, {"key": "infrastructure", "title": "III. ИНФРАТУЗИЛМА ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ", "autoStats": {"Band qilingan obyektlar (Occupied)": 0, "Umumiy maydon, kv.m (Total area, sq.m)": "22,587", "Tumanlar bo'yicha taqsimot (By district)": "Qarshi (27), Qarloq Bog'ot MFY (3), Yettitom shaharchasi (1), 1-Mikrotuman (1), 3-mitti tumani (1)", "Bo'sh/ijaraga tayyor obyektlar (Available)": 0, "Katalogdagi obyektlar soni (Catalogued objects)": 37}, "narrative": [{"id": "edo-1788458063021-v0bxwep", "body": "", "heading": "Infratuzilma bazasini shakllantirish"}, {"id": "edo-1788458063021-fs2z8h6", "body": "", "heading": "Bino-inshoot to'g'risida"}, {"id": "edo-1788458063021-y0466en", "body": "", "heading": "Keyingi bosqichdagi asosiy vazifalar"}], "manualStats": [{"id": "edo-1788458063021-0wp6zu2", "label": "Zero Risk dasturi doirasida joylashtirilgan korxonalar (Companies placed under Zero Risk)", "value": ""}, {"id": "edo-1788458063021-wicy1w9", "label": "Jalb qilinayotgan BPO kompaniyalari (BPO companies being onboarded)", "value": ""}], "autoStatsUpdatedAt": "2026-09-03T17:54:23.021Z"}], "createdAt": "2026-09-03T17:54:23.021Z", "createdBy": "Hasan Abdukarimov", "updatedAt": "2026-09-03T17:54:23.021Z", "periodLabel": "2026 йил 3-чорак"}	2026-09-03 17:54:23.898485+00	2026-09-08 17:01:42.657283+00
planningItems	plan-004	{"owner": "Engineering", "title": "Residents module i18n (Uzbek / Russian)", "module": "Residents", "status": "IN_PROGRESS", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-09-10", "description": "33 files across dashboard, audit, and pipeline sub-views. Work was split into 4 batches and paused mid-way; a few stray scratch files in _i18n_scratch/ need review before the merge into LanguageContext.tsx."}	2026-08-31 17:21:16.267386+00	2026-09-08 17:01:41.473131+00
planningItems	plan-011	{"owner": "Engineering", "title": "Build Edit Profile for the Residents module", "module": "Residents", "status": "DONE", "createdAt": "2026-08-29T00:00:00.000Z", "targetDate": "2026-08-29", "description": "ResidentProfileDetail.tsx had no edit state, save handler, or Edit button at all — the largest module in the app (11 sub-views) had zero ability to correct a resident's data after creation. Added an Edit Profile modal covering company registry data, contact info, status, financials, and tax benefits, wired through the existing onUpdate CRUD path."}	2026-08-31 17:21:16.920503+00	2026-09-08 17:01:41.570555+00
properties	prop-qshq-12	{"city": "Qarshi", "name": "Qarshi - Guzor ko’chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-12/photo-1.png", "/property-photos/prop-qshq-12/photo-2.png", "/property-photos/prop-qshq-12/photo-3.png", "/property-photos/prop-qshq-12/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, Guzor ko’chasi", "areaSqM": 120, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-12/photo-1.png", "ownerPhone": "+998 91 262 19 29", "description": "Manzil: Qarshi shahri, Guzor ko’chasi. Bino maydoni 120 m.kv, 3 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://yandex.uz/maps/-/CTUhz630. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 262 19 29", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.450524+00	2026-09-08 17:01:37.414672+00
properties	prop-qshq-4	{"city": "Qarshi", "name": "Qarshi, Qarloq Bog'ot MFY - 410-uy", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-4/photo-1.jpg", "/property-photos/prop-qshq-4/photo-2.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Qarloq Bog'ot MFY, Qarloq Bog'ot 410-uy", "areaSqM": 1800, "district": "Qarloq Bog'ot MFY", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-4/photo-1.jpg", "ownerPhone": "+998 97 229 17 47", "description": "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Qarloq Bog'ot 410-uy. Bino maydoni 1800 m.kv, 4 qavat (2-3-4-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/zWpehuPGbUDtZ829A. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 229 17 47", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.612969+00	2026-09-08 17:01:37.713927+00
properties	prop-qshq-9	{"city": "Ko'kdala", "name": "Ko'kdala - Yettitom shaharchasi 2-uy", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-9/photo-1.jpg", "/property-photos/prop-qshq-9/photo-2.jpg", "/property-photos/prop-qshq-9/photo-3.jpg", "/property-photos/prop-qshq-9/photo-4.jpg"], "status": "Pending Verification", "address": "Ko'kdala tumani, Yettitom shaharchasi, 2-uy (bino podvalida joy)", "areaSqM": 500, "district": "Yettitom shaharchasi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-9/photo-1.jpg", "ownerPhone": "+998 88 253 18 88", "description": "Manzil: Ko'kdala tumani, Yettitom shaharchasi, 2-uy (bino podvalida joy). Bino maydoni 500 m.kv, Bino 3 qavatli (taklif etilayotgan joy - podval qavatida). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/8wSq9vnQL5k8TL1u5. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 88 253 18 88", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.519413+00	2026-09-08 17:01:37.811384+00
properties	prop-qshq-1	{"city": "Qarshi", "name": "Qarshi, 1-Mikrotuman - Bunyodkor ko'chasi 15", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-1/photo-1.jpg", "/property-photos/prop-qshq-1/photo-2.jpg", "/property-photos/prop-qshq-1/photo-3.jpg", "/property-photos/prop-qshq-1/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, 1-mikrotuman, Bunyodkor ko'chasi 15-uy", "areaSqM": 1100, "district": "1-Mikrotuman", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-1/photo-1.jpg", "ownerPhone": "+998 99 105 33 35", "description": "Manzil: Qarshi shahri, 1-mikrotuman, Bunyodkor ko'chasi 15-uy. Bino maydoni 1100 m.kv, 4 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Oylik ijara narxi: 2000 $ (rasmiy ro'yxatda ko'rsatilgan). Joylashuv: https://maps.app.goo.gl/ukRrnmnHdKzbpz4t9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "monthlyRent": 2000, "managerPhone": "+998 99 105 33 35", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.332995+00	2026-09-08 17:01:37.614432+00
comments	com-1788325498497	{"tags": ["KashkadaryaTech", "ITPark"], "title": "test", "status": "OPEN", "content": "pptx ishlatish kk", "replies": [{"id": "rep-1788325517347", "content": "test", "authorId": "u-1", "commentId": "com-1788325498497", "createdAt": "2026-09-02T05:05:17.347Z", "reactions": {}, "authorName": "Hasan Abdukarimov", "authorRole": "SUPER_ADMIN", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Executive Board"}, {"id": "rep-1788325521210", "content": "test", "authorId": "u-1", "commentId": "com-1788325498497", "createdAt": "2026-09-02T05:05:21.210Z", "reactions": {}, "authorName": "Hasan Abdukarimov", "authorRole": "SUPER_ADMIN", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Executive Board"}, {"id": "rep-1788325524529", "content": "test", "authorId": "u-1", "commentId": "com-1788325498497", "createdAt": "2026-09-02T05:05:24.529Z", "reactions": {}, "authorName": "Hasan Abdukarimov", "authorRole": "SUPER_ADMIN", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Executive Board"}, {"id": "rep-1788368386310", "content": "Hop boladi", "authorId": "u-3", "commentId": "com-1788325498497", "createdAt": "2026-09-02T16:59:46.310Z", "reactions": {}, "authorName": "Islom Karimov", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}, {"id": "rep-1788497879751", "content": "Residentlar bo'limiga :jami rezidentlar,upcoming residents,Mahrum bo'lgan rezidentlar,potensial rezidents", "authorId": "u-4", "commentId": "com-1788325498497", "createdAt": "2026-09-04T04:57:59.751Z", "reactions": {}, "authorName": "Shohjaxon Xudoyberdiyev", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}, {"id": "rep-1788497947431", "content": "Faoliyat turlarini to'liq qo'shish kerak:OAV DTni ishlab chiqish Qo'llab-quvvatlash Litsenziyalarni sotish Marketpleyslar Ma'lumotlarni qayta ishlash Fintex IT konsalting IT ta'lim Xosting DAKni sotish Gamedev DTda reklama maydoni BPO Kreativ iqtisodiyot Venchur fond Kibersport Akseleratsiya dasturi HQ", "authorId": "u-4", "commentId": "com-1788325498497", "createdAt": "2026-09-04T04:59:07.431Z", "reactions": {}, "authorName": "Shohjaxon Xudoyberdiyev", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}, {"id": "rep-1788853792448", "content": "Talent Poolda ish bilan ta'minlangan yoki band talantlarni rang bilan ajratish", "authorId": "u-5", "commentId": "com-1788325498497", "createdAt": "2026-09-08T07:49:52.448Z", "reactions": {}, "authorName": "Jasurbek Beknazarov", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}, {"id": "rep-1788864819664", "content": "Vakansiyalar bo'limida rezident bo'lmagan korxonalarni olib tashlash", "authorId": "u-4", "commentId": "com-1788325498497", "createdAt": "2026-09-08T10:53:39.664Z", "reactions": {}, "authorName": "Shohjaxon Xudoyberdiyev", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}, {"id": "rep-1789042301664", "content": "Vakansiyalar bo'limida rezident bo'lmagan korxonalarni olib tashlash kerak,faqat faol rezidentlarni qoldirish yoki hammasini o'z xoxishi bilan kiritish funkiyasini yoqish kerak", "authorId": "u-4", "commentId": "com-1788325498497", "createdAt": "2026-09-10T12:11:41.664Z", "reactions": {}, "authorName": "Shohjaxon Xudoyberdiyev", "authorRole": "MANAGER", "isOfficial": false, "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "authorDepartment": "Operations"}], "authorId": "u-1", "category": "ideas", "priority": "HIGH", "boostedBy": [], "createdAt": "2026-09-02T05:04:58.497Z", "reactions": {"like": ["u-1"]}, "updatedAt": "2026-09-02T05:04:58.497Z", "authorName": "Hasan Abdukarimov", "authorRole": "SUPER_ADMIN", "boostCount": 0, "authorEmail": "h.abdukarimov@outsource.gov.uz", "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop", "targetEntity": "general", "authorDepartment": "Executive Board"}	2026-09-02 05:04:59.968121+00	2026-09-10 12:13:06.758043+00
properties	prop-qshq-25	{"city": "Qarshi", "name": "Qarshi - Zarinka ruparasida, Original super marketi katorida", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-25/photo-1.png", "/property-photos/prop-qshq-25/photo-2.png", "/property-photos/prop-qshq-25/photo-3.png", "/property-photos/prop-qshq-25/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shaxar, Zarinka ruparasida, Original super marketi katorida", "areaSqM": 100, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-25/photo-1.png", "ownerPhone": "+998 88 475 22 22", "description": "Manzil: Qarshi shaxar, Zarinka ruparasida, Original super marketi katorida. Bino maydoni 100 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 88 475 22 22", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.879522+00	2026-09-08 17:01:37.908881+00
properties	prop-qshq-15	{"city": "Qarshi", "name": "Qarshi - Amir Timur ko’chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-15/photo-1.png", "/property-photos/prop-qshq-15/photo-2.png", "/property-photos/prop-qshq-15/photo-3.png", "/property-photos/prop-qshq-15/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, Amir Timur ko’chasi", "areaSqM": 1200, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-15/photo-1.png", "ownerPhone": "+998 90 722 24 99", "description": "Manzil: Qarshi shahri, Amir Timur ko’chasi. Bino maydoni 1200 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 722 24 99", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.754309+00	2026-09-08 17:01:38.107115+00
aiMessages	msg-1788017059044-ai	{"text": "📊 **Top Exporting Residents in Qashqadaryo Regional Hub (2026 YTD)**\\n\\n1. **DataMesh Labs (Qarshi):** $1,420,000 USD (Cloud Data Engineering & DevOps — US & EU Clients)\\n2. **UzSoft Solutions (Shahrisabz):** $980,000 USD (Enterprise ERP & Fintech Systems — GCC & MENA)\\n3. **CyberShield Uz (Qarshi):** $750,000 USD (Penetration Testing & Security Ops — Central Europe)\\n4. **BPO Nexus Central (Kitob):** $520,000 USD (Multilingual Customer Support & Telematics — North America)\\n5. **AgroTech Global (Koson):** $310,000 USD (Smart Agriculture IoT Firmware — East Asia)\\n\\n📈 **Summary:** Total regional export volume is **$0.00M USD** across 82 active resident firms. 68% of 2026 annual target achieved.", "sender": "ai", "timestamp": "2026-08-29T15:24:19.044Z", "conversationId": "conv-1787992967287", "suggestedQuestions": ["Show top exporting residents in Qashqadaryo", "Draft compliance reminder for pending resident reports", "Explain IT Park tax exemption benefits for BPO companies", "Analyze regional job creation trajectory for 2026"]}	2026-08-31 17:21:17.666997+00	2026-09-08 17:01:42.557575+00
properties	prop-qshq-6	{"city": "Qarshi", "name": "Qarshi, Mag'zon MFY - Nasaf ko'chasi 279", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-6/photo-1.jpg", "/property-photos/prop-qshq-6/photo-2.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Mag'zon MFY, Nasaf ko'chasi 279-uy", "areaSqM": 300, "district": "Mag'zon MFY", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-6/photo-1.jpg", "ownerPhone": "+998 99 655 44 46", "description": "Manzil: Qarshi shahri, Mag'zon MFY, Nasaf ko'chasi 279-uy. Bino maydoni 300 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/FMHh3MeTytf3ukKj6. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 99 655 44 46", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.98746+00	2026-09-08 17:01:38.305168+00
properties	prop-qshq-18	{"city": "Qarshi", "name": "Qarshi - Infin banki ruparasida", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-18/photo-1.png"], "status": "Pending Verification", "address": "Infin banki ruparasida", "areaSqM": 120, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-18/photo-1.png", "ownerPhone": "+998 97 382 74 47", "description": "Manzil: Infin banki ruparasida. Bino maydoni 120 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 382 74 47", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.163517+00	2026-09-08 17:01:38.403164+00
properties	prop-qshq-16	{"city": "Qarshi", "name": "Qarshi - Sokin Plaza mexmonxona yonida", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-16/photo-1.png", "/property-photos/prop-qshq-16/photo-2.png", "/property-photos/prop-qshq-16/photo-3.png", "/property-photos/prop-qshq-16/photo-4.png"], "status": "Pending Verification", "address": "Sokin Plaza mexmonxona yonida", "areaSqM": 200, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-16/photo-1.png", "ownerPhone": "+998 97 802 23 33", "description": "Manzil: Sokin Plaza mexmonxona yonida. Bino maydoni 200 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 802 23 33", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.862947+00	2026-09-08 17:01:38.207117+00
properties	prop-qshq-33	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-33/photo-1.png", "/property-photos/prop-qshq-33/photo-2.png", "/property-photos/prop-qshq-33/photo-3.png", "/property-photos/prop-qshq-33/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 65, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-33/photo-1.png", "ownerPhone": "+998 90 176 86 61", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 65 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Qarshi shaxar, Hamkor bank yoni Aroma kafesi ro‘parasi, Orzu bozori atrofida joylashgan (https://maps.app.goo.gl/SHmzMR2822Nnfb6H8). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 176 86 61", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.695023+00	2026-09-08 17:01:38.702424+00
properties	prop-qshq-11	{"city": "Qarshi", "name": "Qarshi - Mustaqillik ko'chasi 7", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-11/photo-1.jpg", "/property-photos/prop-qshq-11/photo-2.jpg", "/property-photos/prop-qshq-11/photo-3.jpg", "/property-photos/prop-qshq-11/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Mustaqillik ko'chasi 7-uy, Uzmobile ", "areaSqM": 400, "district": "Qarshi", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-11/photo-1.jpg", "ownerPhone": "Ko'rsatilmagan", "description": "Manzil: Qarshi shahri, Mustaqillik ko'chasi 7-uy. Bino maydoni 400 m.kv, 4 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/MHyE5xvXb1gcobEs9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "Ko'rsatilmagan", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.426231+00	2026-09-08 17:01:38.501469+00
properties	prop-qshq-36	{"city": "Dehqonobod", "name": "Dehqonobod - Dehqonobod tuman davlat xizmatlari markazi binosining bo'sh turgan qismi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-36/photo-1.png", "/property-photos/prop-qshq-36/photo-2.png", "/property-photos/prop-qshq-36/photo-3.png", "/property-photos/prop-qshq-36/photo-4.png"], "status": "Pending Verification", "address": "Dehqonobod tuman", "areaSqM": 250, "district": "Dehqonobod", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-36/photo-1.png", "ownerPhone": "+998 91 947 29 89", "description": "Manzil: Dehqonobod tuman. Bino maydoni 250 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Dehqonobod tuman davlat xizmatlari markazi binosining bo'sh turgan qismi. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 947 29 89", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:26.045708+00	2026-09-08 17:01:38.60259+00
kpiTargets	export_companies	{"updatedAt": "2026-09-02T04:41:18.309Z", "updatedBy": "Hasan Abdukarimov", "annualTarget": 10, "quarterlyTargets": {"q1": 2, "q2": 5, "q3": 8, "q4": 10}}	2026-09-01 07:11:07.022867+00	2026-09-08 17:01:41.768051+00
properties	prop-qshq-20	{"city": "Qarshi", "name": "Qarshi - Amir Timur ko’chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-20/photo-1.png", "/property-photos/prop-qshq-20/photo-2.png"], "status": "Pending Verification", "address": "Qarshi shahri, Amir Timur ko’chasi", "areaSqM": 100, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-20/photo-1.png", "ownerPhone": "+998 90 518 10 73", "description": "Manzil: Qarshi shahri, Amir Timur ko’chasi. Bino maydoni 100 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 518 10 73", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.372391+00	2026-09-08 17:01:38.801448+00
kpiTargets	export_volume	{"updatedAt": "2026-09-02T04:41:25.780Z", "updatedBy": "Hasan Abdukarimov", "annualTarget": 5000000, "quarterlyTargets": {"q1": 1000000, "q2": 2200000, "q3": 3600000, "q4": 5000000}}	2026-09-02 04:41:27.105058+00	2026-09-08 17:01:41.867101+00
kpiTargets	services_volume	{"updatedAt": "2026-09-02T04:41:31.829Z", "updatedBy": "Hasan Abdukarimov", "annualTarget": 90, "quarterlyTargets": {"q1": 20, "q2": 44, "q3": 68, "q4": 90}}	2026-09-02 04:41:33.157801+00	2026-09-08 17:01:41.96537+00
properties	prop-qshq-24	{"city": "Qarshi", "name": "Qarshi - xokimiyatini oldida, Anis magazini ruparasida", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-24/photo-1.png", "/property-photos/prop-qshq-24/photo-2.png", "/property-photos/prop-qshq-24/photo-3.png", "/property-photos/prop-qshq-24/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shaxar xokimiyatini oldida, Anis magazini ruparasida", "areaSqM": 100, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-24/photo-1.png", "ownerPhone": "+998 97 229 33 29", "description": "Manzil: Qarshi shaxar xokimiyatini oldida, Anis magazini ruparasida. Bino maydoni 100 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 229 33 29", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.779585+00	2026-09-08 17:01:38.899518+00
properties	prop-qshq-28	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-28/photo-1.png", "/property-photos/prop-qshq-28/photo-2.png", "/property-photos/prop-qshq-28/photo-3.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 60, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-28/photo-1.png", "ownerPhone": "+998 90 721 97 00", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 60 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Qarshi shaxar xokimligi yonida. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 721 97 00", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.181412+00	2026-09-08 17:01:39.096724+00
properties	prop-qshq-27	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi, Qarshi, Qashqadaryo Viloyati", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-27/photo-1.png", "/property-photos/prop-qshq-27/photo-2.jpg", "/property-photos/prop-qshq-27/photo-3.jpg", "/property-photos/prop-qshq-27/photo-4.jpg"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi, Qashqadaryo Viloyati", "areaSqM": 350, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-27/photo-1.png", "ownerPhone": "+998 97 832 22 00", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi, Qashqadaryo Viloyati. Bino maydoni 350 m.kv, 4 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/Q19Z6WvBv8NKyHLs9. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 832 22 00", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.080111+00	2026-09-08 17:01:38.997372+00
properties	prop-qshq-17	{"city": "Qarshi", "name": "Qarshi - 3-mitti tumani, Ipak yoʻli banki va apelsin restorani yonida", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-17/photo-1.png", "/property-photos/prop-qshq-17/photo-2.png", "/property-photos/prop-qshq-17/photo-3.png", "/property-photos/prop-qshq-17/photo-4.png"], "status": "Pending Verification", "address": "3-mitti tumani, Ipak yoʻli banki va apelsin restorani yonida", "areaSqM": 200, "district": "3-mitti tumani", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-17/photo-1.png", "ownerPhone": "+998 91 227 47 93", "description": "Manzil: 3-mitti tumani, Ipak yoʻli banki va apelsin restorani yonida. Bino maydoni 200 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 227 47 93", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.963698+00	2026-09-08 17:01:39.29709+00
planningItems	plan-013	{"owner": "Hasan Abdukarimov", "title": "Build Edit Profile for the Talent module + i18n", "module": "Talent", "status": "DONE", "createdAt": "2026-08-29T12:51:15.210767+00:00", "updatedAt": "2026-08-29T12:51:15.210767+00:00", "targetDate": "2026-08-29", "description": "Talent had zero edit-related code -- candidate records (test scores, contact info, status) could only ever be added, never corrected. Added onUpdate wiring end to end (TalentModuleProps -> App.tsx -> EntityService), an 'Edit Profile' button in the candidate detail drawer that reopens the existing registration form pre-filled, and a dynamic modal title/submit label for add vs. edit. Confirmed Talent's RBAC entity-permission mapping correctly falls through to the existing infrastructure.read/infrastructure.manage default -- no RBAC change needed. Full en/uz/ru translation pass also completed for the entire module (58 t() call sites, 53 new dictionary keys) since the module had never been translated at all."}	2026-08-31 17:21:17.200706+00	2026-09-08 17:01:41.667942+00
properties	prop-qshq-14	{"city": "Qarshi", "name": "Qarshi - xokimligi yonida", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-14/photo-1.png", "/property-photos/prop-qshq-14/photo-2.png", "/property-photos/prop-qshq-14/photo-3.png", "/property-photos/prop-qshq-14/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, xokimligi yonida", "areaSqM": 50, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-14/photo-1.png", "ownerPhone": "+998 90 887 78 79", "description": "Manzil: Qarshi shahri, xokimligi yonida. Bino maydoni 50 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 887 78 79", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:23.65158+00	2026-09-08 17:01:37.513323+00
properties	prop-qshq-34	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi, 47-uy", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-34/photo-1.png", "/property-photos/prop-qshq-34/photo-2.png", "/property-photos/prop-qshq-34/photo-3.png", "/property-photos/prop-qshq-34/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, 47-uy, Qarshi shaxar", "areaSqM": 70, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-34/photo-1.png", "ownerPhone": "+998 94 560 65 45", "description": "Manzil: O‘zbekiston ko‘chasi, 47-uy, Qarshi shaxar. Bino maydoni 70 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Qarshi shaxar xokimligi ro‘parasida. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 94 560 65 45", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.797417+00	2026-09-08 17:01:39.394312+00
properties	prop-qshq-37	{"city": "Yakkabogʻ", "name": "Yakkabogʻ - Yakkabog‘ tuman Davlat kadastrlari palatasi Ma`muriy binosining bo`sh turgan joyi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-37/photo-1.png", "/property-photos/prop-qshq-37/photo-2.png", "/property-photos/prop-qshq-37/photo-3.png", "/property-photos/prop-qshq-37/photo-4.png"], "status": "Pending Verification", "address": "Yakkabog‘ tuman", "areaSqM": 690, "district": "Yakkabogʻ", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-37/photo-1.png", "ownerPhone": "+998 91 947 29 89", "description": "Manzil: Yakkabog‘ tuman. Bino maydoni 690 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Yakkabog‘ tuman Davlat kadastrlari palatasi Ma`muriy binosining bo`sh turgan joyi. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 947 29 89", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:26.541552+00	2026-09-08 17:01:39.491668+00
properties	prop-qshq-26	{"city": "Qarshi", "name": "Qarshi - orenter Mumtoz choyhona", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-26/photo-1.png", "/property-photos/prop-qshq-26/photo-2.png", "/property-photos/prop-qshq-26/photo-3.png", "/property-photos/prop-qshq-26/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shaxar, orenter Mumtoz choyhona", "areaSqM": 700, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-26/photo-1.png", "ownerPhone": "+998 97 294 99 19", "description": "Manzil: Qarshi shaxar, orenter Mumtoz choyhona. Bino maydoni 700 m.kv, 3 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 294 99 19", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.981086+00	2026-09-08 17:01:38.00677+00
properties	prop-qshq-29	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-29/photo-1.png", "/property-photos/prop-qshq-29/photo-2.png", "/property-photos/prop-qshq-29/photo-3.png", "/property-photos/prop-qshq-29/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 170, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-29/photo-1.png", "ownerPhone": "+998 90 617 70 01", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 170 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Mittivoy magazin. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 617 70 01", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.280223+00	2026-09-08 17:01:39.197195+00
properties	prop-qshq-5	{"city": "Qarshi", "name": "Qarshi, Qarloq Bog'ot MFY - Nasaf ko'chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-5/photo-1.jpg", "/property-photos/prop-qshq-5/photo-2.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Qarloq Bog'ot MFY, Nasaf ko'chasi", "areaSqM": 900, "district": "Qarloq Bog'ot MFY", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-5/photo-1.jpg", "ownerPhone": "+998 91 220 10 00", "description": "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Nasaf ko'chasi. Bino maydoni 900 m.kv, 4 qavat (2-3-4-qavatlardan foydalanish mumkin). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/hqfjoFWT8hic51296. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 91 220 10 00", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.146078+00	2026-09-08 17:01:39.591118+00
properties	prop-qshq-23	{"city": "Qarshi", "name": "Qarshi - Nuriston MFY, Omad ko'chasi, 3/50-uy", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-23/photo-1.png", "/property-photos/prop-qshq-23/photo-2.png", "/property-photos/prop-qshq-23/photo-3.png", "/property-photos/prop-qshq-23/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, Nuriston MFY, Omad ko'chasi, 3/50-uy", "areaSqM": 691, "district": "Nuriston MFY", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-23/photo-1.png", "ownerPhone": "+998 90 356 01 28", "description": "Manzil: Qarshi shahri, Nuriston MFY, Omad ko'chasi, 3/50-uy. Bino maydoni 691 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 356 01 28", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.678035+00	2026-09-08 17:01:39.691181+00
properties	prop-qshq-2	{"city": "Qarshi", "name": "Qarshi, Qarloq Bog'ot MFY - Zardo'zli ko'chasi 26", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-2/photo-1.jpg", "/property-photos/prop-qshq-2/photo-2.jpg", "/property-photos/prop-qshq-2/photo-3.jpg", "/property-photos/prop-qshq-2/photo-4.jpg"], "status": "Pending Verification", "address": "Qarshi shahri, Qarloq Bog'ot MFY, Zardo'zli ko'chasi 26-uy", "areaSqM": 2900, "district": "Qarloq Bog'ot MFY", "timeline": [{"date": "2026-08-29", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-2/photo-1.jpg", "ownerPhone": "+998 97 222 00 08", "description": "Manzil: Qarshi shahri, Qarloq Bog'ot MFY, Zardo'zli ko'chasi 26-uy. Bino maydoni 2900 m.kv, 5 qavat (mansard bilan). Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: https://maps.app.goo.gl/zmXUy1CjqgSnmgF7A. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-08-29 holatiga). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 97 222 00 08", "parkingSpots": 0, "availableDate": "2026-08-29", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-08-31 17:21:15.707+00	2026-09-08 17:01:39.790128+00
properties	prop-qshq-31	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-31/photo-1.png", "/property-photos/prop-qshq-31/photo-2.png", "/property-photos/prop-qshq-31/photo-3.png", "/property-photos/prop-qshq-31/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 450, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-31/photo-1.png", "ownerPhone": "+998 90 721 97 00", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 450 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Qarshi shaxar. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 721 97 00", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.484752+00	2026-09-08 17:01:39.887629+00
properties	prop-qshq-30	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-30/photo-1.png", "/property-photos/prop-qshq-30/photo-2.png", "/property-photos/prop-qshq-30/photo-3.png", "/property-photos/prop-qshq-30/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 66, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-30/photo-1.png", "ownerPhone": "+998 90 342 30 03", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 66 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Qarshi shaxar xokimligi ro‘parasida. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 342 30 03", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.38381+00	2026-09-08 17:01:39.98486+00
properties	prop-qshq-21	{"city": "Qarshi", "name": "Qarshi - Islom Karimov kuchasi 11 uy", "type": "Office", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-21/photo-1.png", "/property-photos/prop-qshq-21/photo-2.png", "/property-photos/prop-qshq-21/photo-3.png", "/property-photos/prop-qshq-21/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shahri, Islom Karimov kuchasi 11 uy", "areaSqM": 73, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-21/photo-1.png", "ownerPhone": "+998 93 697 02 00", "description": "Manzil: Qarshi shahri, Islom Karimov kuchasi 11 uy. Bino maydoni 73 m.kv, 3 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 93 697 02 00", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.471811+00	2026-09-08 17:01:40.085126+00
properties	prop-qshq-32	{"city": "Qarshi", "name": "Qarshi - O‘zbekiston ko‘chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-32/photo-1.png", "/property-photos/prop-qshq-32/photo-2.png", "/property-photos/prop-qshq-32/photo-3.png", "/property-photos/prop-qshq-32/photo-4.png"], "status": "Pending Verification", "address": "O‘zbekiston ko‘chasi, Qarshi shaxar", "areaSqM": 3000, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-32/photo-1.png", "ownerPhone": "+998 90 720 17 66", "description": "Manzil: O‘zbekiston ko‘chasi, Qarshi shaxar. Bino maydoni 3000 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Orenter Qarshi shaxar. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 720 17 66", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.58837+00	2026-09-08 17:01:40.185164+00
properties	prop-qshq-19	{"city": "Qarshi", "name": "Qarshi - Boxodir SHerqulov ko’chasi", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-19/photo-1.png", "/property-photos/prop-qshq-19/photo-2.png", "/property-photos/prop-qshq-19/photo-3.png"], "status": "Pending Verification", "address": "Qarshi shahri, Boxodir SHerqulov ko’chasi", "areaSqM": 100, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-19/photo-1.png", "ownerPhone": "+998 93 687 07 93", "description": "Manzil: Qarshi shahri, Boxodir SHerqulov ko’chasi. Bino maydoni 100 m.kv, 2 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 93 687 07 93", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:24.272922+00	2026-09-08 17:01:40.283464+00
properties	prop-qshq-35	{"city": "Qarshi", "name": "Qarshi - Vacant space (contact +998 90 721 97 00)", "type": "Commercial Building", "hasAC": false, "rooms": 0, "images": ["/property-photos/prop-qshq-35/photo-1.png", "/property-photos/prop-qshq-35/photo-2.png", "/property-photos/prop-qshq-35/photo-3.png", "/property-photos/prop-qshq-35/photo-4.png"], "status": "Pending Verification", "address": "Qarshi shaxar", "areaSqM": 550, "district": "Qarshi", "timeline": [{"date": "2026-09-03", "user": "Data Import", "stage": "Found", "description": "Qashqadaryo viloyat hokimiyatining rasmiy bo'sh joylar ro'yxatidan olindi (PPTX ma'lumotnoma, 2-nusxa)."}], "verified": false, "documents": [], "ownerName": "Qashqadaryo viloyat hokimiyati", "utilities": {"waterCost": 0, "internetCost": 0, "electricityCost": 0}, "coverImage": "/property-photos/prop-qshq-35/photo-1.png", "ownerPhone": "+998 90 721 97 00", "description": "Manzil: Qarshi shaxar. Bino maydoni 550 m.kv, 1 qavat. Internet: mavjud (tezlik ko'rsatilmagan). Ijara narxi kelishuv asosida (bozor narxidan kelib chiqib belgilanadi). Joylashuv: Qarshi shaxar. Manba: Qashqadaryo viloyat hokimiyatining bo'sh joylar ro'yxati (2026-09-03 holatiga, 2-fayl). Xonalar soni, avtoturargoh, konditsioner va yig'ilishlar xonasi mavjudligi hali tekshirilmagan -- joyga tashrif buyurilgach aniqlanadi.", "managerName": "Belgilanmagan", "managerPhone": "+998 90 721 97 00", "parkingSpots": 0, "availableDate": "2026-09-03", "nearbyTransit": [], "pipelineStage": "Found", "cadastreNumber": "", "hasMeetingRooms": false, "nearbyResidents": [], "inspectionReport": {"notes": "Joyga tashrif buyurish kutilmoqda.", "status": "PENDING", "findings": "Hali tekshirilmagan -- ob'ekt Qashqadaryo viloyat hokimiyati ro'yxatidan olindi.", "inspectorName": "", "inspectionDate": ""}, "internetSpeedMbps": 0, "nearbyUniversities": []}	2026-09-03 17:46:25.921394+00	2026-09-08 17:01:40.381178+00
\.


--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inspections (id, "buildingBlock", type, "inspectionDate", "inspectorName", "inspectorAgency", status, findings, recommendations, "certificateUrl", documents) FROM stdin;
\.


--
-- Data for Name: maintenance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance (id, category, title, description, priority, status, "assignedEngineer", "createdAt", "officeId", "officeNumber", "buildingBlock", "beforePhoto", "afterPhoto", "completionReport", timeline) FROM stdin;
\.


--
-- Data for Name: meetings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.meetings (id, title, "companyId", "companyName", attendees, "dateTime", notes, summary, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: offices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.offices (id, "roomNumber", building, floor, "areaSqM", "monthlyRent", status, "currentTenantId", "currentTenantName", "leaseStart", "leaseEnd", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, module, description, "createdAt") FROM stdin;
p-users-read	users.read	users	View user directory and user profiles	2026-08-31 17:23:50.644381+00
p-users-create	users.create	users	Create new platform user accounts	2026-08-31 17:23:50.742931+00
p-users-update	users.update	users	Edit user profile information and status	2026-08-31 17:23:50.836473+00
p-users-delete	users.delete	users	Delete user accounts	2026-08-31 17:23:50.928229+00
p-residents-read	residents.read	residents	View IT Park registered residents list and details	2026-08-31 17:23:51.023581+00
p-residents-create	residents.create	residents	Register new IT Park resident applications	2026-08-31 17:23:51.116506+00
p-residents-update	residents.update	residents	Update resident status, tax benefits and quarterly reports	2026-08-31 17:23:51.209317+00
p-residents-delete	residents.delete	residents	Revoke resident status or remove resident records	2026-08-31 17:23:51.301534+00
p-startups-read	startups.read	startups	View startup ecosystem listings, KPIs, and founders	2026-08-31 17:23:51.393357+00
p-startups-create	startups.create	startups	Onboard new startups to incubation/acceleration	2026-08-31 17:23:51.485022+00
p-startups-update	startups.update	startups	Update startup progress, KPIs, and funding status	2026-08-31 17:23:51.576668+00
p-startups-delete	startups.delete	startups	Remove startups from acceleration records	2026-08-31 17:23:51.66807+00
p-events-read	events.read	events	View IT event schedules, locations and reports	2026-08-31 17:23:51.759851+00
p-events-manage	events.manage	events	Create, edit, and organize IT events and hackathons	2026-08-31 17:23:51.85202+00
p-crm-read	crm.read	crm	View CRM leads, contacts, companies, and meetings	2026-08-31 17:23:51.943746+00
p-crm-manage	crm.manage	crm	Manage CRM pipeline, add contacts, log meetings	2026-08-31 17:23:52.035519+00
p-analytics-read	analytics.read	analytics	Access executive dashboards, export stats, and AI forecasts	2026-08-31 17:23:52.127294+00
p-analytics-manage	analytics.manage	analytics	Adjust strategic KPI targets and goals on the executive dashboard	2026-08-31 17:23:52.219473+00
p-infra-read	infrastructure.read	infrastructure	View office space vacancies, buildings, and assets	2026-08-31 17:23:52.320543+00
p-infra-manage	infrastructure.manage	infrastructure	Manage leases, contracts, assets, and maintenance tickets	2026-08-31 17:23:52.411966+00
p-audit-read	audit.read	audit	View system audit logs, security events, and user activity	2026-08-31 17:23:52.505511+00
p-planning-read	planning.read	planning	View the strategic planning & roadmap board	2026-08-31 17:23:52.597001+00
p-planning-manage	planning.manage	planning	Create, edit, and update strategic planning & roadmap items	2026-08-31 17:23:52.688744+00
p-settings-manage	settings.manage	settings	Manage RBAC roles, permission assignments, and system config	2026-08-31 17:23:52.780805+00
p-edoreports-read	edoReports.read	edoReports	View Edo Ijro Tizim quarterly reports	2026-09-03 16:22:47.859004+00
p-edoreports-manage	edoReports.manage	edoReports	Create, edit, and export Edo Ijro Tizim quarterly reports	2026-09-03 16:22:47.96041+00
p-vacancies-read	vacancies.read	vacancies	View resident job vacancies and candidate applications	2026-09-07 16:53:55.065634+00
p-vacancies-manage	vacancies.manage	vacancies	Post, edit, and manage vacancies and their candidate pipeline	2026-09-07 16:53:55.163844+00
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (id, "userId", "tokenHash", "expiresAt", revoked, "createdAt") FROM stdin;
rt-1788197041061-7620	u-1	648ec36315b6bac671855c965c81778de1131933abbd744c517c4a22dc150b5c	2026-09-07 17:24:01.061+00	t	2026-08-31 17:24:01.061+00
rt-1788198965290-5333	u-1	b69a78525e0358c28cb1b747e27c01a7ab620b00dd7df8337d218b07eda65400	2026-09-07 17:56:05.289+00	f	2026-08-31 17:56:05.29+00
rt-1788198969857-4375	u-1	1e19aff4242286c5b7d3d64bfb4177339f4760e011f84453ccce30748e225460	2026-09-07 17:56:09.857+00	t	2026-08-31 17:56:09.857+00
rt-1788199633435-7982	u-1	a9c6ae1cac60bee76132d89cd19ae3849f3aa920b3ebce6e540cfabd7b17681f	2026-09-07 18:07:13.435+00	t	2026-08-31 18:07:13.435+00
rt-1788200336210-8440	u-1	f0188837bef2fa9b8278302d6e48f9ab45d88954cd4cf4bcb193247a64445787	2026-09-07 18:18:56.21+00	f	2026-08-31 18:18:56.21+00
rt-1788203536448-6533	u-1	61482f9ddb2004db813dc60b4408d7a03370b04df68648a046a40d445aef9e2d	2026-09-07 19:12:16.448+00	t	2026-08-31 19:12:16.448+00
rt-1788207112282-2530	u-1	af4ee774cb05a784bdf11a677db8a4c30740988312b95f70bb3e7845871b714f	2026-09-07 20:11:52.282+00	t	2026-08-31 20:11:52.282+00
rt-1788239363087-2079	u-1	d769219d0ac660899efbd074a4f11d31f77c98780f88cb5c2e24052ddc21be28	2026-09-08 05:09:23.087+00	t	2026-09-01 05:09:23.087+00
rt-1788239515677-426	u-1	75e6f6a8ee5beab5fffd95c957dcd195677e7a91fb3c3adf1614c270ee0dac72	2026-09-08 05:11:55.677+00	f	2026-09-01 05:11:55.677+00
rt-1788240659419-1314	u-1	e4f6a635503255f13c64cf95fce270250e76a9cf1da5ee5133a5e75c659d2fba	2026-09-08 05:30:59.418+00	t	2026-09-01 05:30:59.419+00
rt-1788241954801-7705	u-1	4e772c98c706f21ea7c1b16447d3cb5c6e041de70746dd3d0dd2488021b380b8	2026-09-08 05:52:34.8+00	f	2026-09-01 05:52:34.801+00
rt-1788241957623-6075	u-1	33f47f4d78aa683f90954c8c4d5ccd8b6bdece0944f2a1c59e8ab10bfebc9c1d	2026-09-08 05:52:37.623+00	t	2026-09-01 05:52:37.623+00
rt-1788244766776-700	u-1	c4ff76674e19e8ba9328374b9191c97ddbf8719753d3ff023d227dbb57183b32	2026-09-08 06:39:26.776+00	f	2026-09-01 06:39:26.776+00
rt-1788239540624-8933	u-1	908318cc3a0218196aafccebfa185bf9f77dc2cd3bcf58c66d473c857f8c33d9	2026-09-08 05:12:20.624+00	t	2026-09-01 05:12:20.624+00
rt-1788245438430-6470	u-1	7c7a08a12a3462a0e66dc385c67d4566206dc2ac5321352db656ff032e6abf38	2026-09-08 06:50:38.43+00	t	2026-09-01 06:50:38.43+00
rt-1788267741970-1129	u-1	4cc31d41df2d140c83cc94a5b4a48f71186a8b963f24c94b3633cde6596aee99	2026-09-08 13:02:21.97+00	t	2026-09-01 13:02:21.97+00
rt-1788244771248-2268	u-1	4728ee23e4a0eb75a879fcad79bc10bc6bb1063a48ff9c2ac2a24c59c43b5139	2026-09-08 06:39:31.248+00	t	2026-09-01 06:39:31.248+00
rt-1788246688995-4988	u-1	12913756ac3687ddeb9339ea19544f4228571cc57e21b57fca5daa41c56dbc54	2026-09-08 07:11:28.995+00	f	2026-09-01 07:11:28.995+00
rt-1788246367556-8175	u-1	4e7619cff7a3c3c935faf72e05a788d220af68cca6c705a85c930136adc31fd3	2026-09-08 07:06:07.556+00	t	2026-09-01 07:06:07.556+00
rt-1788267741972-4850	u-1	4cc31d41df2d140c83cc94a5b4a48f71186a8b963f24c94b3633cde6596aee99	2026-09-08 13:02:21.972+00	t	2026-09-01 13:02:21.972+00
rt-1788246689024-6837	u-1	581771b33bb3d7e381494f5452675bf9fa8cd65e9968d3abfd2d7054ff069f13	2026-09-08 07:11:29.024+00	t	2026-09-01 07:11:29.024+00
rt-1788257603192-7968	u-1	e447c11cf351b49ec799e2e424d7544fac92fee72f9f58a05dc5003025d80550	2026-09-08 10:13:23.192+00	t	2026-09-01 10:13:23.192+00
rt-1788257603195-165	u-1	e447c11cf351b49ec799e2e424d7544fac92fee72f9f58a05dc5003025d80550	2026-09-08 10:13:23.195+00	t	2026-09-01 10:13:23.195+00
rt-1788258807708-4912	u-1	ecfa8a881305aac320f0bd3ad2d21f30a7cf85089a798dc1d1524bac6a2cceb5	2026-09-08 10:33:27.708+00	f	2026-09-01 10:33:27.708+00
rt-1788258811290-7782	u-1	557c228c0a116970e71fda68c1c2187ff96476a53999d16809bcaff0c1ae5637	2026-09-08 10:33:31.29+00	t	2026-09-01 10:33:31.29+00
rt-1788263055909-2173	u-4	eef82aae2fab8412c6c377fd333f591b78052f5752437039ce9d48b7019432ad	2026-09-08 11:44:15.909+00	f	2026-09-01 11:44:15.909+00
rt-1788255976407-385	u-1	8245745a81bfe29c1393b5b5f06dae16726a3c41e8a211a035657beb5ad3bd48	2026-09-08 09:46:16.407+00	t	2026-09-01 09:46:16.407+00
rt-1788261297500-2596	u-1	c02ee6357e07c4b6092e040437f3f702eb75f4fa9247562ed9af7d03dd9b8d1b	2026-09-08 11:14:57.5+00	t	2026-09-01 11:14:57.5+00
rt-1788261297641-516	u-1	c02ee6357e07c4b6092e040437f3f702eb75f4fa9247562ed9af7d03dd9b8d1b	2026-09-08 11:14:57.641+00	t	2026-09-01 11:14:57.641+00
rt-1788323307459-3873	u-1	1e7d38d9c825ac1bb5000e4b156e59f8e9e21227763bd95cfa5a35b3280ba078	2026-09-09 04:28:27.459+00	t	2026-09-02 04:28:27.459+00
rt-1788269328160-632	u-1	e488537bec8179f12659b251594002a22bee375a0eab62b42aa2b965030cced0	2026-09-08 13:28:48.16+00	t	2026-09-01 13:28:48.16+00
rt-1788268746434-1185	u-1	85d6321037675662b3e029587b8045a9376f8ed9c1f3056a2945c9b02a429d5d	2026-09-08 13:19:06.434+00	t	2026-09-01 13:19:06.434+00
rt-1788268746443-1367	u-1	85d6321037675662b3e029587b8045a9376f8ed9c1f3056a2945c9b02a429d5d	2026-09-08 13:19:06.443+00	t	2026-09-01 13:19:06.443+00
rt-1788322883156-8293	u-1	21a1ee1861d351d3f6c21850cf63b999afbc93024420c7023b00e22b4ed153a1	2026-09-09 04:21:23.156+00	t	2026-09-02 04:21:23.157+00
rt-1788269978060-9436	u-1	11dbe7b871f57c2b96c397ad04083deb2864366a83540ca496e815b7a3a80f20	2026-09-08 13:39:38.06+00	t	2026-09-01 13:39:38.06+00
rt-1788269978076-4104	u-1	11dbe7b871f57c2b96c397ad04083deb2864366a83540ca496e815b7a3a80f20	2026-09-08 13:39:38.076+00	t	2026-09-01 13:39:38.076+00
rt-1788286180981-6282	u-1	90b73b88ab339e074904e3d9fe20d935190e6585f30a3f43d240656a8ebff852	2026-09-08 18:09:40.981+00	f	2026-09-01 18:09:40.982+00
rt-1788322906895-1077	u-1	825ae60dbb95890b273f31290066842d9e19646df9056696cf67f32862e37fdd	2026-09-09 04:21:46.895+00	t	2026-09-02 04:21:46.895+00
rt-1788323677568-6893	u-1	97f960f14028df909aa777bb71c564011e214b4468677d4f553ea22821f019fa	2026-09-09 04:34:37.568+00	t	2026-09-02 04:34:37.568+00
rt-1788323707719-3928	u-1	19e20df1e8f79492e2acb96f6b49d690951673523a60830b7334cb1f5bf45d9a	2026-09-09 04:35:07.719+00	t	2026-09-02 04:35:07.719+00
rt-1788324779307-2293	u-1	d7117b93c964ae296d67bb6f8d52379c19fd4bcfe92a114886dca99899826cb0	2026-09-09 04:52:59.307+00	t	2026-09-02 04:52:59.307+00
rt-1788287231072-2127	u-1	e14c084045580c3b9ac4ed7149d28c42fd97ef0968cfe6dbcec22802a71743a1	2026-09-08 18:27:11.072+00	t	2026-09-01 18:27:11.072+00
rt-1788325701879-6793	u-1	b27676b0d693ec2411b9d08390957f51d16979be4f1f1a3f5631ac35aa9bd068	2026-09-09 05:08:21.879+00	t	2026-09-02 05:08:21.879+00
rt-1788322924430-7459	u-5	8c357035f2be0dd1f27d2438c2401784050132d62f8d6a1cb99b3795e7356413	2026-09-09 04:22:04.43+00	t	2026-09-02 04:22:04.43+00
rt-1788287231077-4508	u-1	e14c084045580c3b9ac4ed7149d28c42fd97ef0968cfe6dbcec22802a71743a1	2026-09-08 18:27:11.077+00	t	2026-09-01 18:27:11.077+00
rt-1788286181008-9156	u-1	fc9e73bc1dd23cce35c13eae7bdedb233057df2bf27dfd35b8d6303fdc2d7406	2026-09-08 18:09:41.008+00	t	2026-09-01 18:09:41.009+00
rt-1788286181017-8989	u-1	fc9e73bc1dd23cce35c13eae7bdedb233057df2bf27dfd35b8d6303fdc2d7406	2026-09-08 18:09:41.017+00	t	2026-09-01 18:09:41.017+00
rt-1788329087955-7325	u-1	d6bb999bdc55507c62d97eba657cb8f72d050e4ac1e3ebef5aa6dfa83a2edf36	2026-09-09 06:04:47.955+00	t	2026-09-02 06:04:47.955+00
rt-1788208211833-7235	u-1	5e2ab666b18b9cfecbbe774626e46b087cbf6322c36ca1b5e05a69e24a962f33	2026-09-07 20:30:11.833+00	t	2026-08-31 20:30:11.833+00
rt-1788323708269-8693	u-1	65b8e2762ead69c88c8d72f38475a3cbd537931bb47be38269f8bb991762801f	2026-09-09 04:35:08.269+00	t	2026-09-02 04:35:08.269+00
rt-1788322952217-2649	u-4	7e46e12b0eb61cf1ac3e4bad5e1fd3e5eceea16612dd1dea5ffe7a9d29e25eb3	2026-09-09 04:22:32.217+00	t	2026-09-02 04:22:32.217+00
rt-1788322944361-4132	u-3	94417cc75958933c6a27651e8516c45106e9ae9e96bd028dd2616d7242dd8bd4	2026-09-09 04:22:24.361+00	t	2026-09-02 04:22:24.361+00
rt-1788332917802-423	u-3	88e4add8b58199f966bfa5a70ca3034be1562f08db4376e5173ac3d1a53d0243	2026-09-09 07:08:37.802+00	f	2026-09-02 07:08:37.802+00
rt-1788332917802-2318	u-3	88e4add8b58199f966bfa5a70ca3034be1562f08db4376e5173ac3d1a53d0243	2026-09-09 07:08:37.802+00	f	2026-09-02 07:08:37.802+00
rt-1788409625940-5415	u-5	ad17d8dd19517da114ab6760efea0cf7f256a7163f2b02bb698fc48d3a7d40d9	2026-09-10 04:27:05.94+00	t	2026-09-03 04:27:05.94+00
rt-1788345347303-5239	u-5	b9fc21a65bfeb34dd6de0135339cad53491f9938aa0575fc87742988c7fb67b5	2026-09-09 10:35:47.303+00	t	2026-09-02 10:35:47.303+00
rt-1788345347309-4168	u-5	b9fc21a65bfeb34dd6de0135339cad53491f9938aa0575fc87742988c7fb67b5	2026-09-09 10:35:47.309+00	t	2026-09-02 10:35:47.309+00
rt-1788286181018-7555	u-1	fc9e73bc1dd23cce35c13eae7bdedb233057df2bf27dfd35b8d6303fdc2d7406	2026-09-08 18:09:41.018+00	t	2026-09-01 18:09:41.018+00
rt-1788366288867-8047	u-1	597474157a0c65dd7e3a8ba87c5ef9119591cb51f7fc23facd68267b401e94e6	2026-09-09 16:24:48.867+00	f	2026-09-02 16:24:48.867+00
rt-1788410806057-4098	u-5	c10f624d52c32b6ebfc0b50016ba8b32ff0feef62c7eeadae2e0a0db61219864	2026-09-10 04:46:46.057+00	t	2026-09-03 04:46:46.057+00
rt-1788366292366-2372	u-1	df1373f298f09bc8c7543df83f44667cbf7dc512df6c07e6deaf0890eeca6279	2026-09-09 16:24:52.366+00	t	2026-09-02 16:24:52.366+00
rt-1788367751126-5481	u-1	1dc77f07e3c8afafcb248d1570b79d64e6459ac03b094d1c60ff1364ba268a54	2026-09-09 16:49:11.125+00	t	2026-09-02 16:49:11.127+00
rt-1788367751131-2233	u-1	1dc77f07e3c8afafcb248d1570b79d64e6459ac03b094d1c60ff1364ba268a54	2026-09-09 16:49:11.131+00	t	2026-09-02 16:49:11.131+00
rt-1788367751136-2183	u-1	1dc77f07e3c8afafcb248d1570b79d64e6459ac03b094d1c60ff1364ba268a54	2026-09-09 16:49:11.136+00	t	2026-09-02 16:49:11.136+00
rt-1788367751186-4283	u-1	1dc77f07e3c8afafcb248d1570b79d64e6459ac03b094d1c60ff1364ba268a54	2026-09-09 16:49:11.186+00	t	2026-09-02 16:49:11.199+00
rt-1788366196549-1901	u-1	2fbf2c7dda86b0733ff115ae9fd46a4046c3e6843985c3ba9ece519391a3f83a	2026-09-09 16:23:16.549+00	t	2026-09-02 16:23:16.549+00
rt-1788368376508-5178	u-3	3b2fba30393646a37ee39e3a05b78bb2c1b9ced239b49be7cf26245a97ca467f	2026-09-09 16:59:36.508+00	t	2026-09-02 16:59:36.508+00
rt-1788368349167-9655	u-3	dd58114f2bad39354672c117564c5c8ab83cde7678539ef02e27aadb3d846a2c	2026-09-09 16:59:09.167+00	t	2026-09-02 16:59:09.167+00
rt-1788406560688-3193	u-3	f9897a4979267b63e4b674c337905407e57bedd1f9f3b248bcdc68bf4b5cd418	2026-09-10 03:36:00.688+00	t	2026-09-03 03:36:00.688+00
rt-1788406562333-430	u-3	1a47769c7cfbbfcf0aa9e43a1fc87bbcab4d1289bbd12b19c4f258b97ab20d4d	2026-09-10 03:36:02.333+00	t	2026-09-03 03:36:02.335+00
rt-1788408087276-9929	u-3	005377763295afbed01eeeaf708313e20e904041bf86c3ef6d8c018309a07ec7	2026-09-10 04:01:27.275+00	f	2026-09-03 04:01:27.276+00
rt-1788353106862-2298	u-5	0c7ff58779c7c3d73f8d668461afaf5a26783d9b8f430aa9d8fe66ac4f82a65f	2026-09-09 12:45:06.862+00	t	2026-09-02 12:45:06.862+00
rt-1788353106865-261	u-5	0c7ff58779c7c3d73f8d668461afaf5a26783d9b8f430aa9d8fe66ac4f82a65f	2026-09-09 12:45:06.865+00	t	2026-09-02 12:45:06.865+00
rt-1788408653946-6513	u-5	ae0d409802710a4093a25342d2950a11f9b28145d9772e784c80eaf4a48e4db8	2026-09-10 04:10:53.946+00	t	2026-09-03 04:10:53.946+00
rt-1788408653951-7151	u-5	ae0d409802710a4093a25342d2950a11f9b28145d9772e784c80eaf4a48e4db8	2026-09-10 04:10:53.951+00	t	2026-09-03 04:10:53.951+00
rt-1788413428978-1155	u-5	3cb32f0d41e491e522d70a83337e819d34bf39eea35242e15f37817f478561da	2026-09-10 05:30:28.978+00	t	2026-09-03 05:30:28.978+00
rt-1788416207463-5673	u-5	0f03671827834d59f1b1e2ac87c5484a399de109d90b92a058898dcea43cb85f	2026-09-10 06:16:47.463+00	t	2026-09-03 06:16:47.463+00
rt-1788408060786-9048	u-3	48c81b7babe3b310c59b7b9e164e87161c0d03900f788829f9a9da0fe9ce3f76	2026-09-10 04:01:00.785+00	t	2026-09-03 04:01:00.786+00
rt-1788408060787-4436	u-3	48c81b7babe3b310c59b7b9e164e87161c0d03900f788829f9a9da0fe9ce3f76	2026-09-10 04:01:00.787+00	t	2026-09-03 04:01:00.787+00
rt-1788444223619-4325	u-3	89548c37dce00d9d536216d54ba1ccba8aba35fcf8fe16e0673622482493c603	2026-09-10 14:03:43.619+00	t	2026-09-03 14:03:43.619+00
rt-1788450120334-4952	u-3	3198a510886b629a0865c4938d5bea313ca421d25ddcc02789161d8beb6bfb68	2026-09-10 15:42:00.334+00	t	2026-09-03 15:42:00.334+00
rt-1788450120343-629	u-3	3198a510886b629a0865c4938d5bea313ca421d25ddcc02789161d8beb6bfb68	2026-09-10 15:42:00.343+00	t	2026-09-03 15:42:00.343+00
rt-1788408090528-9583	u-1	e20720547eaf7a91f1133f6384da32e46051f94703b533726c3b0cea8e6691e8	2026-09-10 04:01:30.528+00	t	2026-09-03 04:01:30.528+00
rt-1788452581620-9325	u-1	245ea4c36a1fd5b9dc4fa0c572415513f3a04ef3cb80c2223d16b73607bd50c6	2026-09-10 16:23:01.618+00	f	2026-09-03 16:23:01.62+00
rt-1788452581622-5067	u-1	245ea4c36a1fd5b9dc4fa0c572415513f3a04ef3cb80c2223d16b73607bd50c6	2026-09-10 16:23:01.622+00	f	2026-09-03 16:23:01.622+00
rt-1788455175520-3372	u-1	9338dd2fbcd41817451d8bd84b2aaec1af0b992a82cc3aa32db9969bf46841d2	2026-09-10 17:06:15.52+00	t	2026-09-03 17:06:15.52+00
rt-1788452585930-7844	u-1	0b9cd698dbe6296c732c5e64bf3a8f2866b35726c37e302e52e96809d6dc2e9f	2026-09-10 16:23:05.93+00	t	2026-09-03 16:23:05.93+00
rt-1788455169744-5288	u-1	b663ae1c18a463e803b667997e418f256a6ee0ad7ea40b8995fcc2e8eb333790	2026-09-10 17:06:09.679+00	f	2026-09-03 17:06:09.744+00
rt-1788455169892-991	u-1	b663ae1c18a463e803b667997e418f256a6ee0ad7ea40b8995fcc2e8eb333790	2026-09-10 17:06:09.892+00	f	2026-09-03 17:06:09.892+00
rt-1788456558075-4418	u-1	9f1f60ebbad4b39d377bc4bfd6f800b1f5a02aeff7e439ca0cdc7bbc9ba5863e	2026-09-10 17:29:18.075+00	t	2026-09-03 17:29:18.075+00
rt-1788456558081-9730	u-1	9f1f60ebbad4b39d377bc4bfd6f800b1f5a02aeff7e439ca0cdc7bbc9ba5863e	2026-09-10 17:29:18.081+00	t	2026-09-03 17:29:18.082+00
rt-1788417111291-6886	u-5	0dd518c6969b44ee1b5c631a63743ecbc17d4d80a294428cf181ee26f17a2cd3	2026-09-10 06:31:51.291+00	t	2026-09-03 06:31:51.291+00
rt-1788450279500-5765	u-1	78604889ca97e5ee5f706b8cfc01ae6f73af36340ec4b01837b95703ca6ad818	2026-09-10 15:44:39.5+00	t	2026-09-03 15:44:39.5+00
rt-1788415841670-8786	u-4	2f0680e13296fc75540001f06968fc2410f05cc06cfd9df51ebb2cff25d5507d	2026-09-10 06:10:41.67+00	t	2026-09-03 06:10:41.67+00
rt-1788415841693-9257	u-4	2f0680e13296fc75540001f06968fc2410f05cc06cfd9df51ebb2cff25d5507d	2026-09-10 06:10:41.693+00	t	2026-09-03 06:10:41.693+00
rt-1788415298151-2702	u-1	eb693300a2ec12331e670d91d404be3888e6a315e25ffb479ac3cfc0bac76086	2026-09-10 06:01:38.151+00	t	2026-09-03 06:01:38.151+00
rt-1788415298152-9821	u-1	eb693300a2ec12331e670d91d404be3888e6a315e25ffb479ac3cfc0bac76086	2026-09-10 06:01:38.152+00	t	2026-09-03 06:01:38.152+00
rt-1788329087961-3623	u-1	d6bb999bdc55507c62d97eba657cb8f72d050e4ac1e3ebef5aa6dfa83a2edf36	2026-09-09 06:04:47.961+00	t	2026-09-02 06:04:47.961+00
rt-1788340227768-6299	u-1	10184e379107f7f23c4ccfb896c5514ab4270809cb653510646eeee7989a6411	2026-09-09 09:10:27.768+00	t	2026-09-02 09:10:27.768+00
rt-1788414064030-5049	u-1	86e41daa6794ae64483c3116ec94cf18d707671a696bad60592b6f27965faef3	2026-09-10 05:41:04.03+00	t	2026-09-03 05:41:04.03+00
rt-1788414064034-1622	u-1	86e41daa6794ae64483c3116ec94cf18d707671a696bad60592b6f27965faef3	2026-09-10 05:41:04.034+00	t	2026-09-03 05:41:04.034+00
rt-1788456558083-1896	u-1	9f1f60ebbad4b39d377bc4bfd6f800b1f5a02aeff7e439ca0cdc7bbc9ba5863e	2026-09-10 17:29:18.083+00	t	2026-09-03 17:29:18.083+00
rt-1788456558086-2685	u-1	9f1f60ebbad4b39d377bc4bfd6f800b1f5a02aeff7e439ca0cdc7bbc9ba5863e	2026-09-10 17:29:18.086+00	t	2026-09-03 17:29:18.086+00
rt-1788457579906-4184	u-1	25527381bb1e0850583267fa07bbe16c1347506a47534ca9f87d323260a32975	2026-09-10 17:46:19.906+00	f	2026-09-03 17:46:19.906+00
rt-1788496339213-6916	u-4	c5f83e2e0ab0c3a54b6c8e04e36a4cde12adea345f0f3b87d71adc603c734c24	2026-09-11 04:32:19.213+00	f	2026-09-04 04:32:19.213+00
rt-1788763200316-7565	u-4	6ce13ebe2d2b8586daa5a4ff2c636b7112fd94acdcae6e06531f1030059456a7	2026-09-14 06:40:00.316+00	t	2026-09-07 06:40:00.316+00
rt-1788497964806-9556	u-4	656efff264fe2560a89adae3051d9697112e282c8b9d1111693b6ee2ad6537fe	2026-09-11 04:59:24.806+00	t	2026-09-04 04:59:24.806+00
rt-1788496138208-598	u-1	cc37641472cffef4cdad28ceaeca5671273a19ed3e2c30aa44ae711457a4a7a9	2026-09-11 04:28:58.208+00	t	2026-09-04 04:28:58.208+00
rt-1788496138223-8837	u-1	cc37641472cffef4cdad28ceaeca5671273a19ed3e2c30aa44ae711457a4a7a9	2026-09-11 04:28:58.223+00	t	2026-09-04 04:28:58.223+00
rt-1788497817731-4901	u-1	f2c51866e5c4b771fc45fda80059e4642f218d0cbc7a69ae8192548a87ee7ba8	2026-09-11 04:56:57.731+00	f	2026-09-04 04:56:57.731+00
rt-1788496353535-699	u-4	2c0206315080e08ba01c71bb3e33a70c587e19399c24571f40befacb4ef9aa79	2026-09-11 04:32:33.535+00	t	2026-09-04 04:32:33.535+00
rt-1788498902157-4190	u-1	ae50f983f67bbe80c3c65f4bdb5b73822e2f5a34baf180dc52ac99bdfffdbd2a	2026-09-11 05:15:02.157+00	t	2026-09-04 05:15:02.157+00
rt-1788498902163-2747	u-1	ae50f983f67bbe80c3c65f4bdb5b73822e2f5a34baf180dc52ac99bdfffdbd2a	2026-09-11 05:15:02.163+00	t	2026-09-04 05:15:02.163+00
rt-1788497821045-7239	u-1	3fd931d8facb6417fc16021e7704e8cd3cd4a52c83e129f52479f2cf47bf0444	2026-09-11 04:57:01.045+00	t	2026-09-04 04:57:01.045+00
rt-1788457911961-8305	u-1	3942ba096af6a490ca2d8aad40324d40ef17390644400dc261ccc8c7f805f94b	2026-09-10 17:51:51.961+00	t	2026-09-03 17:51:51.961+00
rt-1788457911961-6094	u-1	3942ba096af6a490ca2d8aad40324d40ef17390644400dc261ccc8c7f805f94b	2026-09-10 17:51:51.961+00	t	2026-09-03 17:51:51.961+00
rt-1788756709078-801	u-5	c17c349698d812ed95c5644736b0bfedad0929ca408e553f3b600b8263f1d331	2026-09-14 04:51:49.078+00	t	2026-09-07 04:51:49.078+00
rt-1788756709079-9426	u-5	c17c349698d812ed95c5644736b0bfedad0929ca408e553f3b600b8263f1d331	2026-09-14 04:51:49.079+00	t	2026-09-07 04:51:49.079+00
rt-1788698582225-5217	u-1	896bc0344222106710585b9cb3e8d99d21c47b7074f3f160c57d0369b5e8a8fc	2026-09-13 12:43:02.225+00	t	2026-09-06 12:43:02.225+00
rt-1788698582233-6592	u-1	896bc0344222106710585b9cb3e8d99d21c47b7074f3f160c57d0369b5e8a8fc	2026-09-13 12:43:02.233+00	t	2026-09-06 12:43:02.233+00
rt-1788763200323-9211	u-4	6ce13ebe2d2b8586daa5a4ff2c636b7112fd94acdcae6e06531f1030059456a7	2026-09-14 06:40:00.323+00	t	2026-09-07 06:40:00.323+00
rt-1788497547500-7830	u-1	07df4330aa1c187ddf1324ef4eb4609e7a60b6f24e54e77d825430c0339b8eea	2026-09-11 04:52:27.5+00	t	2026-09-04 04:52:27.5+00
rt-1788497547500-1991	u-1	07df4330aa1c187ddf1324ef4eb4609e7a60b6f24e54e77d825430c0339b8eea	2026-09-11 04:52:27.5+00	t	2026-09-04 04:52:27.5+00
rt-1788518084092-8926	u-1	f28fa20c59b1f3e55c45b04fbc9b3a8f2da1a9d1aaccca9bbd3c145384153654	2026-09-11 10:34:44.092+00	t	2026-09-04 10:34:44.092+00
rt-1788495665977-3703	u-5	175672a80cbcece2508bbe65070d70f594c96d64fae9c9f3f887206586a1c37a	2026-09-11 04:21:05.977+00	t	2026-09-04 04:21:05.977+00
rt-1788757177550-3536	u-4	7d385ba66e3dd9e4997259e47e8c697ee3c8d493780559b636f82ac015ed63c1	2026-09-14 04:59:37.55+00	t	2026-09-07 04:59:37.55+00
rt-1788757177551-419	u-4	7d385ba66e3dd9e4997259e47e8c697ee3c8d493780559b636f82ac015ed63c1	2026-09-14 04:59:37.551+00	t	2026-09-07 04:59:37.551+00
rt-1788795880536-3866	u-1	cbfe892b3faa8648f9c71c14906ba4cafa55fe37027598a949dbcf37d0771fa7	2026-09-14 15:44:40.535+00	t	2026-09-07 15:44:40.536+00
rt-1788777477752-8980	u-1	8923a447806d2ffa5417e6237cc39748e9088945c15957dca3012a0e19018610	2026-09-14 10:37:57.752+00	t	2026-09-07 10:37:57.752+00
rt-1788785953226-2332	u-1	eb7a78c6cd2320fd56955016ec19d3d7bd110c0b5bda794b5a87f11fd2d10723	2026-09-14 12:59:13.226+00	f	2026-09-07 12:59:13.226+00
rt-1788785953246-4566	u-1	eb7a78c6cd2320fd56955016ec19d3d7bd110c0b5bda794b5a87f11fd2d10723	2026-09-14 12:59:13.246+00	f	2026-09-07 12:59:13.246+00
rt-1788756513718-5366	u-1	9993c43fe25f2e61e1b20307911d1415d5bd9d25528aeae45c0dcc665e934896	2026-09-14 04:48:33.718+00	t	2026-09-07 04:48:33.718+00
rt-1788756513725-9016	u-1	9993c43fe25f2e61e1b20307911d1415d5bd9d25528aeae45c0dcc665e934896	2026-09-14 04:48:33.725+00	t	2026-09-07 04:48:33.725+00
rt-1788762364022-7223	u-1	6c630347a7bddac5f7fed3197170b73a0e061a5047753db830bdf1de7e7d52f9	2026-09-14 06:26:04.022+00	t	2026-09-07 06:26:04.022+00
rt-1788777472148-7387	u-1	dbc33d2bae994115134a895fac3ed94c9defb5bdfee0e4de80ddb43a7ac5fc2d	2026-09-14 10:37:52.148+00	f	2026-09-07 10:37:52.148+00
rt-1788457583425-3971	u-1	7aed725cf31235c66095f05ffd6d7169ddba7612743fec0b66f0c8bcd622a8cc	2026-09-10 17:46:23.425+00	t	2026-09-03 17:46:23.426+00
rt-1788795880538-2414	u-1	cbfe892b3faa8648f9c71c14906ba4cafa55fe37027598a949dbcf37d0771fa7	2026-09-14 15:44:40.538+00	t	2026-09-07 15:44:40.538+00
rt-1788750200024-740	u-1	6b2f586b311800a0d40ec787fc43a77d6b8b1c8ceb79b10396a01826dfe3af76	2026-09-14 03:03:20.024+00	t	2026-09-07 03:03:20.024+00
rt-1788750200025-5135	u-1	6b2f586b311800a0d40ec787fc43a77d6b8b1c8ceb79b10396a01826dfe3af76	2026-09-14 03:03:20.025+00	t	2026-09-07 03:03:20.025+00
rt-1788799246584-9205	u-1	6f1b010d6f806e6f17bdc2856a5957ee9ef855006f650619735381ec1e1e021f	2026-09-14 16:40:46.584+00	t	2026-09-07 16:40:46.584+00
rt-1788799246584-4875	u-1	6f1b010d6f806e6f17bdc2856a5957ee9ef855006f650619735381ec1e1e021f	2026-09-14 16:40:46.584+00	t	2026-09-07 16:40:46.584+00
rt-1788505866746-9955	u-1	2f7f5a5140653dabbfb473aa73543d7022d256fd055f44a091bad8d111f5ca0b	2026-09-11 07:11:06.746+00	t	2026-09-04 07:11:06.746+00
rt-1788505866753-1027	u-1	2f7f5a5140653dabbfb473aa73543d7022d256fd055f44a091bad8d111f5ca0b	2026-09-11 07:11:06.753+00	t	2026-09-04 07:11:06.753+00
rt-1788776941533-1988	u-1	21ad79e472cc2ba3b610db9709fed082f60ab20c9ca633c6fd9ac98216f3fc03	2026-09-14 10:29:01.533+00	t	2026-09-07 10:29:01.533+00
rt-1788759010054-1598	u-5	e735a9e993ac91beaec748e8441336c737ff8f232f853c73fa5841031343c774	2026-09-14 05:30:10.054+00	t	2026-09-07 05:30:10.054+00
rt-1788773543172-4160	u-4	ec4b7b0dccc293966ffd4e05e62ea69b90e73b8702a3dd8fa047811b5a852ac1	2026-09-14 09:32:23.172+00	t	2026-09-07 09:32:23.172+00
rt-1788773543179-8765	u-4	ec4b7b0dccc293966ffd4e05e62ea69b90e73b8702a3dd8fa047811b5a852ac1	2026-09-14 09:32:23.179+00	t	2026-09-07 09:32:23.179+00
rt-1788776941533-93	u-1	21ad79e472cc2ba3b610db9709fed082f60ab20c9ca633c6fd9ac98216f3fc03	2026-09-14 10:29:01.533+00	t	2026-09-07 10:29:01.533+00
rt-1788762356078-7909	u-1	e2078267af0725803666824499eeff4a233a54ebb3a7767c972f1b81bf41ef2f	2026-09-14 06:25:56.078+00	t	2026-09-07 06:25:56.078+00
rt-1788762356093-5561	u-1	e2078267af0725803666824499eeff4a233a54ebb3a7767c972f1b81bf41ef2f	2026-09-14 06:25:56.093+00	t	2026-09-07 06:25:56.093+00
rt-1788517827175-1724	u-1	cb90bfb2cecf3a0b09eac05c7f59ecb24aceb8a29cd0670b7fb8691282606e32	2026-09-11 10:30:27.175+00	t	2026-09-04 10:30:27.175+00
rt-1788795880607-1414	u-1	cbfe892b3faa8648f9c71c14906ba4cafa55fe37027598a949dbcf37d0771fa7	2026-09-14 15:44:40.607+00	t	2026-09-07 15:44:40.607+00
rt-1788795880657-1162	u-1	cbfe892b3faa8648f9c71c14906ba4cafa55fe37027598a949dbcf37d0771fa7	2026-09-14 15:44:40.657+00	t	2026-09-07 15:44:40.657+00
rt-1788800029854-2505	u-1	f47f8defaba538f7318eb03503a2ba2cf06fd0e0d40553f7036db7fe6250406c	2026-09-14 16:53:49.854+00	t	2026-09-07 16:53:49.854+00
rt-1788800929776-9764	u-1	4c84ffa6dac11cea6fb2824d8f127cc23ffbcac338a28d10334e8c21ff17fa55	2026-09-14 17:08:49.776+00	t	2026-09-07 17:08:49.776+00
rt-1788800932605-9448	u-1	d69a5a43a42395898e13313a463ffe3032cc39d03353998d4fd44e5d4e2faa2b	2026-09-14 17:08:52.605+00	f	2026-09-07 17:08:52.605+00
rt-1788803598115-1640	u-1	c1567ddc8d1be3a5df874a2bebf22fc106910fb4f3c172c6b8f6fa75db6dc808	2026-09-14 17:53:18.115+00	t	2026-09-07 17:53:18.115+00
rt-1788803598117-713	u-1	c1567ddc8d1be3a5df874a2bebf22fc106910fb4f3c172c6b8f6fa75db6dc808	2026-09-14 17:53:18.117+00	t	2026-09-07 17:53:18.117+00
rt-1788803598121-3188	u-1	c1567ddc8d1be3a5df874a2bebf22fc106910fb4f3c172c6b8f6fa75db6dc808	2026-09-14 17:53:18.121+00	t	2026-09-07 17:53:18.121+00
rt-1788801078495-7132	u-1	2df15760944a12efd67f340de737607108be059f2cd68a1eb83ba79a6bfb366b	2026-09-14 17:11:18.495+00	t	2026-09-07 17:11:18.495+00
rt-1788885713356-3159	u-1	9c5bd41b5af19ea2bae31293d85d2e1417ae783427601cf90d4f9adeb1fbeab5	2026-09-15 16:41:53.356+00	t	2026-09-08 16:41:53.356+00
rt-1788886763394-2717	u-1	4a68514ba6068b43b99e96a71e0861a6980fa781e470da0a67ca479ba7915c68	2026-09-15 16:59:23.394+00	f	2026-09-08 16:59:23.394+00
rt-1788886768189-6958	u-1	21563b3bd37e738944e77f056e3c76cb71179842ccc88461fadb5bd731b720d2	2026-09-15 16:59:28.189+00	f	2026-09-08 16:59:28.189+00
rt-1788803597961-9274	u-1	f4853abc50d0d728983679f26786cf3b13bf3d8f94d06ceb1e8c85ef3c52d226	2026-09-14 17:53:17.961+00	f	2026-09-07 17:53:17.961+00
rt-1788879422856-4832	u-1	836e3fdd814bbefc532532201e7d6790fc38f889619d082bee20fe8160085960	2026-09-15 14:57:02.856+00	t	2026-09-08 14:57:02.856+00
rt-1788931445577-8393	u-1	af12b20d7e4b90b4a081ea48048a674664d390ff933171fe46e21326b235aa89	2026-09-16 05:24:05.577+00	f	2026-09-09 05:24:05.577+00
rt-1788949183540-9733	u-1	39fa354cefd4e9e66af05d2eb9358cdb473bb5d741764a334d5d3dfd5c0b0a7e	2026-09-16 10:19:43.54+00	t	2026-09-09 10:19:43.54+00
rt-1788949183544-3019	u-1	39fa354cefd4e9e66af05d2eb9358cdb473bb5d741764a334d5d3dfd5c0b0a7e	2026-09-16 10:19:43.544+00	t	2026-09-09 10:19:43.544+00
rt-1789014204752-403	u-1	4e86c25b9ff2b1cc681e846ceb93a456dd9282fa91ce68c4efd997283c46c4db	2026-09-17 04:23:24.752+00	f	2026-09-10 04:23:24.752+00
rt-1788802326174-1661	u-1	f672ad5b5d1069bd121f57ed46fa8f539e421b7f715c692f52cea06da9e4f959	2026-09-14 17:32:06.174+00	t	2026-09-07 17:32:06.174+00
rt-1788802326178-4750	u-1	f672ad5b5d1069bd121f57ed46fa8f539e421b7f715c692f52cea06da9e4f959	2026-09-14 17:32:06.178+00	t	2026-09-07 17:32:06.178+00
rt-1788802326180-7895	u-1	f672ad5b5d1069bd121f57ed46fa8f539e421b7f715c692f52cea06da9e4f959	2026-09-14 17:32:06.18+00	t	2026-09-07 17:32:06.18+00
rt-1788802326185-8406	u-1	f672ad5b5d1069bd121f57ed46fa8f539e421b7f715c692f52cea06da9e4f959	2026-09-14 17:32:06.185+00	t	2026-09-07 17:32:06.185+00
rt-1788840232982-7972	u-1	9a3e5bf8102f636b3b2b5fb38e841c9f2eb520a6349bcd738c9d43dd5b02dd5c	2026-09-15 04:03:52.982+00	f	2026-09-08 04:03:52.982+00
rt-1788850844425-1234	u-4	9eb2ee8b3fd2741d6d0c2a5489f8d32005373dd10cf587c3d5110a92e1f90688	2026-09-15 07:00:44.425+00	t	2026-09-08 07:00:44.425+00
rt-1788850844433-9210	u-4	9eb2ee8b3fd2741d6d0c2a5489f8d32005373dd10cf587c3d5110a92e1f90688	2026-09-15 07:00:44.433+00	t	2026-09-08 07:00:44.433+00
rt-1788862387456-4106	u-4	0364575014aaa1842f62e843439b6291130c644f28f7a1c215d3022b6a00f16e	2026-09-15 10:13:07.456+00	t	2026-09-08 10:13:07.456+00
rt-1788863651629-1954	u-4	704f24faf26b1e76ecf64864dc9dd85e2550875d5341c80d3d138a9bf45ccbbc	2026-09-15 10:34:11.629+00	t	2026-09-08 10:34:11.629+00
rt-1788836736786-8115	u-1	959b84fa8d3f610d555562c7aed232121751bdf61ceb7ee9a28567b3bd515465	2026-09-15 03:05:36.786+00	t	2026-09-08 03:05:36.786+00
rt-1788864905288-9906	u-4	fe9966e99bcb3f0f53b126f20940eaceba5718b8a32b6296b7b80d48f3890ab1	2026-09-15 10:55:05.288+00	t	2026-09-08 10:55:05.288+00
rt-1789039159454-6474	u-4	8eb49618c71cfccb8897f5b6ae8b89626de5308a52e915630177b34a82576f06	2026-09-17 11:19:19.454+00	t	2026-09-10 11:19:19.454+00
rt-1789039159455-175	u-4	8eb49618c71cfccb8897f5b6ae8b89626de5308a52e915630177b34a82576f06	2026-09-17 11:19:19.455+00	t	2026-09-10 11:19:19.455+00
rt-1789042145823-6242	u-4	c43a6e8337f3d04d5d3e2d72ee40660e16cbbd1442d3a96209590a029d8f7dc1	2026-09-17 12:09:05.823+00	f	2026-09-10 12:09:05.823+00
rt-1788949365176-5053	u-1	0fa5d6a850d7802e4a6327c77ae4b0f4ab96af7d5df38e91a82a9176513b26bf	2026-09-16 10:22:45.175+00	t	2026-09-09 10:22:45.176+00
rt-1789047431291-9712	u-1	a57d68ecb6010b56b6e10cd4d6629f47ad8e0250f2a55efffe5bb099923e35f0	2026-09-17 13:37:11.291+00	f	2026-09-10 13:37:11.291+00
rt-1788853753575-2984	u-5	688c20a3f459d98bf372d18336d7175df9edade6cda7cb3d1e95c17e39e4b9f3	2026-09-15 07:49:13.575+00	t	2026-09-08 07:49:13.575+00
rt-1788853753581-1518	u-5	688c20a3f459d98bf372d18336d7175df9edade6cda7cb3d1e95c17e39e4b9f3	2026-09-15 07:49:13.581+00	t	2026-09-08 07:49:13.581+00
rt-1789043516542-2850	u-5	ff6972eb440aacc06402efe2d58ea7b54a0ab841faa7dcd6599c990b1d468f76	2026-09-17 12:31:56.542+00	f	2026-09-10 12:31:56.542+00
rt-1789043516541-836	u-5	ff6972eb440aacc06402efe2d58ea7b54a0ab841faa7dcd6599c990b1d468f76	2026-09-17 12:31:56.541+00	f	2026-09-10 12:31:56.541+00
rt-1789047431291-7637	u-1	a57d68ecb6010b56b6e10cd4d6629f47ad8e0250f2a55efffe5bb099923e35f0	2026-09-17 13:37:11.291+00	f	2026-09-10 13:37:11.291+00
rt-1789019896429-1374	u-1	3ce53558b789f3deb94cb979669ecbfa1be781a60f30e7901372e3056164a197	2026-09-17 05:58:16.429+00	t	2026-09-10 05:58:16.429+00
rt-1789019896434-8763	u-1	3ce53558b789f3deb94cb979669ecbfa1be781a60f30e7901372e3056164a197	2026-09-17 05:58:16.434+00	t	2026-09-10 05:58:16.434+00
rt-1789064550163-7367	u-1	d41e49b6c4eb690983377a5fd80109fe1c6e139fb891e7eb98adc9ea4734922b	2026-09-17 18:22:30.163+00	f	2026-09-10 18:22:30.163+00
rt-1789064550164-4668	u-1	d41e49b6c4eb690983377a5fd80109fe1c6e139fb891e7eb98adc9ea4734922b	2026-09-17 18:22:30.164+00	f	2026-09-10 18:22:30.164+00
rt-1789148391754-6531	u-1	b06638a60cb0483aac0f74a2482733936940be75ea83da066db5c61532f0e1d9	2026-09-18 17:39:51.754+00	f	2026-09-11 17:39:51.754+00
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservations (id, "roomName", "buildingBlock", floor, "reservedBy", "residentName", date, "startTime", "endTime", purpose, status, recurring) FROM stdin;
\.


--
-- Data for Name: residents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.residents (id, "companyName", director, "registrationNumber", "legalAddress", "employeesCount", "exportVolume", "domesticVolume", status, "appliedAt", "approvedAt", "benefitsApplied", notes, documents, email, phone, website, telegram, linkedin, district, industry, "activityType", "assignedManager", "potentialStage", "potentialFounder", "potentialSource", "potentialProbability", "potentialOwner", "potentialNextFollowUp", "potentialNotes", "potentialTimeline", "upcomingStage", "upcomingDetails", "removedDate", "removedReason", "removedDebt", "removedInspection", "removedAppeal", "removedCourt", "removedCanReapply", "monitoringHistory", "quarterlyReports", "docFiles", meetings, tasks, "historyLogs", photos, "createdAt", "updatedAt") FROM stdin;
res-0007	"CHECKER"MCHJ	SODIQOV SARDOR SODIQOVICH	310829987	Qarshi sh. Navoiy mahallasi, Olimlar ko'chasi, 6-uy	1	0.00	0.00	ACTIVE	2023-10-04	2022-07-22	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 91 641-14-14	\N	\N	\N	Qarshi	Xizmat ko'rsatish	Mа'lumotlаrni joylаshtirish vа ishlov berish bo'yichа xizmаtlаr	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.880962+00	2026-08-31 17:20:07.880962+00
res-0008	"CUBO" MCHJ	ISKANDAROV TURSUNPO'LAT AZAMAT O'G'LI	312850788	Qashqadaryo viloyati, Qarshi shahri ,Oydin mahallasi,Paxtazor mitti tumani,38-uy,23-xonadon	1	0.00	0.00	ACTIVE	2026-03-04	2026-03-17	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 97 317-34-97	\N	\N	\N	Qarshi	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.693565+00	2026-08-31 17:20:07.693565+00
res-0009	"Data Drive Qarshi" MCHJ	KOSTANDACHI VADIM	312151454	Qashqadaryo viloyati, Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	78	0.00	0.00	ACTIVE	2025-05-21	2025-05-30	{}	{"Problem: Muammo yo'q",-}	{}	\N	8330710717	\N	\N	\N	Qarshi	Eksport	Web-portаllаr	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.078522+00	2026-08-31 17:20:07.078522+00
res-0087	«EPRO ZERONE» MCHJ	Imomnazarov Oqil Orif o'g'li	310222991	Muborak tumani, O'zbekiston mahallasi, Nefterazvetka ko'chasi, 7-5	0	0.00	0.00	REMOVED	\N	2023-03-31	{}	{}	{}	\N	+998 99 426-78-39	\N	\N	\N	Muborak	Ta`lim	Axborot texnologiyalari va kompyuter tizimlari sohasidagi boshqa faoliyat turlari	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.974341+00	2026-08-31 17:20:07.974341+00
res-0014	"GLOBAL EDUCATION IN KARSHI" NTM	SODIQOV SARDOR SODIQOVICH	304288699	Qashqadaryo viloyati, Qarshi sh. 4-mitti tumani, 7-uy, 56-xona	12	0.00	0.00	ACTIVE	2016-09-04	2023-08-31	{}	{"Problem: Telefonga tushub bo'lmadi",-,"Quarterly report Q1 2025 updated to APPROVED on 2026-09-07."}	{}	\N	+998 91 958-52-32	\N	\N	\N	Qarshi	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:06.698587+00	2026-08-31 17:20:06.698587+00
res-0005	"AVANGARD CALL SOLUTIONS" MCHJ	TRUNOVA IRINA VLADIMIROVNA	312220874	Qashqadaryo viloyati, Qarshi sh. Shurtan mahallasi, 7 mavzesi, 18-uy, 9-xonadon	23	0.00	0.00	ACTIVE	2025-06-20	2025-07-15	{}	{"Problem: Zero Riskdan ajratilgan joyga yangi xodimlar topish muammo"}	{}	\N	+998 91 963-73-77	\N	\N	\N	Qarshi	Eksport	Boshqа telekommunikаtsiya xizmаtlаri ko'rsаtish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.591777+00	2026-08-31 17:20:07.591777+00
res-0019	"IT PARK KUKDALA" MCHJ	JURAQULOV OMAD UKTAM O‘G‘LI	309656704	Qashqadaryo viloyati, Ko‘kdala tumani , Sho‘rquduq Xo'jaobod mahallasi, Yangichorvog' ko'chasi, 17a-uy	1	0.00	0.00	ACTIVE	2022-06-17	2024-11-29	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 94 242-71-11	\N	\N	\N	Koʻkdala	IT ta'lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.168026+00	2026-08-31 17:20:08.168026+00
res-0003	"AMIR TECH GLOB" XK	MU'TABAR QORAYEVA	309058394	Qarshi sh., Navo mahallasi, Mustaqillik ko`chasi, 1/5-uy	6	0.00	0.00	ACTIVE	2022-08-31	2022-07-22	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 91 641-14-14	\N	\N	\N	Qarshi	Qo'llab-quvvatlash	Axborot texnologiyalari va kompyuter tizimlari sohasidagi boshqa faoliyat turlari	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.36681+00	2026-08-31 17:20:08.36681+00
res-0033	"SHAHRISABZ VOICE" MCHJ	XAITOV ISKANDAR JAMSHID O‘G‘LI	311688198	Qashqadaryo viloyati, shahrisabz shahri, sohibqiron MFY, Ipak yo'li ko'chasi, 1-uy	1	0.00	0.00	ACTIVE	2024-10-18	2024-11-19	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.464829+00	2026-08-31 17:20:08.464829+00
res-0017	IT CALL KARSHI MCHJ	OSTRUMOV VLADISLAV SERGEYIVICH	311131622	Qarshi shahri Shodlik MFY Mustaqillik shox koçhasi, 21 uy	11	0.00	0.00	ACTIVE	2024-02-26	2024-03-16	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 91 774-12-09	\N	\N	\N	Qarshi	Eksport	Simsiz аloqа xizmаtlаri ko'rsаtish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.269368+00	2026-08-31 17:20:08.269368+00
res-0018	"IT KLASTER SCHOOL" NODAVLAT TA'LIM MUASSASASI	XOZRATKULOV SALIMJON SHERALIYEVICH	311444905	Qashqadaryo viloyati, Qarshi sh. Komilon mahallasi, Islom Karimov ko'chasi, 264-uy	1	0.00	0.00	ACTIVE	2024-07-03	2025-04-30	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:06.983326+00	2026-08-31 17:20:06.983326+00
res-0034	"SILKBRIDGE STUDIO" MCHJ	YULCHIYEV SHOXRUX IBRAXIMOVICH	312684890	Ko‘kdala tumani , Ko‘kdala Oltin dala mahallasi, Nurafshon ko`chasi, 10-uy	2	0.00	0.00	ACTIVE	2025-12-26	2026-01-15	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.558743+00	2026-08-31 17:20:08.558743+00
res-0032	«RUSLAN MEDIA» MCHJ	RUSTAMOV RUSLAN ULUG'BEKOVICH	304274068	Qarshi tumanii, Beshkent sh, O.Nosirov ko'chasi	4	0.00	0.00	ACTIVE	2016-08-25	2023-08-18	{}	{"Problem: Muammo yo'q",-,"Quarterly report Q1 2025 updated to APPROVED on 2026-09-07."}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.323436+00	2026-08-31 17:20:09.323436+00
res-0088	"KESH YOUNG SCHOOL" XK	Boboqulov Akram	309942886	Shahrisabz sh., Bo'ston mahallasi, Mangulik ko'chasi, 24-uy	0	0.00	0.00	REMOVED	\N	2022-12-22	{}	{}	{}	\N	+998 97 631-47-47	\N	\N	\N	Shahrisabz	Ta`lim	Boshqa toifalarga kiritilmagan ta'limning boshqa turlari	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.906034+00	2026-08-31 17:20:09.906034+00
res-0037	"TIMII SD" MCHJ	TOJIYEV AZAMAT PARDA O'G'LI	310348526	G‘uzor tumanii, G'uzor shahri Mustaqillik mahallasi, Mustaqillik ko'chasi, 175-uy	7	0.00	0.00	ACTIVE	2023-03-28	2024-02-16	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.842768+00	2026-08-31 17:20:08.842768+00
res-0025	"OQ SAROY TRUCK SOLUTION" MCHJ	QILICHEV BOBUR PARDAYEVICH	312723819	Ko‘kdala tumani , Ko‘kdala Oltin dala mahallasi, Nurafshon ko`chasi, 10-uy	1	0.00	0.00	ACTIVE	2026-01-16	2026-02-18	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.609174+00	2026-08-31 17:20:09.609174+00
res-0038	"UNITED CODERS TEAM" MCHJ	BEGALIYEV BOBUR MAXMADALI O'G'LI	310958241	Qarshi sh. Shodlik mahallasi, 5-mavzesi, 19/1-uy, 5-xonadon	1	0.00	0.00	ACTIVE	2023-12-01	2023-12-29	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.937217+00	2026-08-31 17:20:08.937217+00
res-0026	"OYBEK YOUTUBER" MCHJ	BOZOROV OYBEK ALISHER O'G'LI	311906771	Qashqadaryo viloyati, Nishon tumanii, Yangi Nishon shahri Navbahor mahallasi, Xo'jayev ko'chasi, 3/2-uy	3	0.00	0.00	ACTIVE	2025-02-11	2025-02-28	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.702225+00	2026-08-31 17:20:09.702225+00
res-0039	"VISION DIGITAL GROUPS" MCHJ	ASLONOV BEHZOD AZIMIDDIN O`G`LI	312741084	Kasbi tumanii, Qamashi QFY Nurobod mahallasi, 1-Islomobod ko‘chasi, 31-uy	1	0.00	0.00	ACTIVE	2026-01-22	2026-02-18	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.032813+00	2026-08-31 17:20:09.032813+00
res-0023	"NFM KOSON IT CAPITAL" MCHJ	IBODULLOYEV NURSULTON	312246525	Qashqadaryo viloyati, Koson tumanii, Koson shahri Bog'ishamol mahallasi, Yangi bog' ko'chasi, 29-uy	3	0.00	0.00	ACTIVE	2025-07-01	2025-15-09	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	+998 90 616-55-72	\N	\N	\N	Koson	IT ta'lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.80879+00	2026-08-31 17:20:09.80879+00
res-0040	"VOHASOFT" MCHJ	DONAYEV SARVAR G`ULOM O`G`LI	311276694	Qashqadaryo viloyati, Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	5	0.00	0.00	ACTIVE	2024-04-26	2024-08-30	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.126242+00	2026-08-31 17:20:09.126242+00
res-0036	"TIMII ITC" MCHJ	O'TKIROV JAHONGIR ISLOM O'G'LI	310348043	G‘uzor tumanii, G'uzor shahri Mustaqillik mahallasi, Mustaqillik ko'chasi, 175-uy	7	0.00	0.00	ACTIVE	2023-03-28	2024-02-16	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.749125+00	2026-08-31 17:20:08.749125+00
res-0049	"IT YAKKABOG CODE HUB" MCHJ	KUCHIMOV NURALI RAXIMJON O`G`LI	312633621	Yakkabog‘ tumani, Aygirko'l mahallasi, Aygirko'l ko'chasi, 241-uy	0	0.00	0.00	ACTIVE	2025-12-05	2026-04-02	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.467459+00	2026-08-31 17:20:11.467459+00
res-0031	"RISUMA" MCHJ	RAXMONOV ILXOM	308393954	Qarshi sh., G'.G'ulom mahallasi, Nasaf ko'chasi, 14-uy	5	0.00	0.00	ACTIVE	2021-04-14	2023-01-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.003693+00	2026-08-31 17:20:10.003693+00
res-0047	"CODELAB" xususiy korxonasi	XUJANAROV BEKZOD  MAXMARAJAJAB O'G'LI	305192304	Qashqadaryo viloyati, Shahrisabz sh. Kesh ko'chasi, 47-uy	3	0.00	0.00	ACTIVE	2018-01-04	2026-03-17	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.561078+00	2026-08-31 17:20:11.561078+00
res-0029	"QARSHI TECHNOPARK DASTURIY MAHSULOTLAR VA AXBOROT TEXNOLOGIYALARI TEXNOLOGIK PARKI DIREKSIYASI" MCHJ	TOSHMANOV RAMAZON SAYDULLA O`G`LI	311278312	Qashqadaryo viloyati, Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko`chasi, 103-uy	1	0.00	0.00	ACTIVE	2024-04-26	2024-05-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.199125+00	2026-08-31 17:20:10.199125+00
res-0175	"NORMA 747" mas'uliyati cheklangan jamiyati	\N	308546058	O'zbekiston ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	Contacted	\N	\N	30	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.21357+00	2026-08-31 17:20:20.21357+00
res-0053	"IT PARK SHAHRISABZ" NTM	XUSANOV JASURBEK SAPARALI O‘G‘LI	312886172	Qashqadaryo viloyati, Kitob tumanii, Kitob shahri	0	0.00	0.00	ACTIVE	2026-03-17	2026-04-18	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.393046+00	2026-08-31 17:20:10.393046+00
res-0054	"TECHBRIDGE ACADEMY" MCHJ	TURDIYEV NORMUROD XUSAN O'G'LI	312914310	Qashqadaryo viloyati,Yakkabog' tumai,Sandal QFY	0	0.00	0.00	ACTIVE	2026-04-15	2026-04-18	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.486679+00	2026-08-31 17:20:10.486679+00
res-0055	"SLUJBA PATRIOT SECURITY"MCHJ	TURAYEV DONIYOR RUZIBOY O`G`LI	311713016	Qashqadaryo viloyati, Yakkabog' tumani, Yakkabog' shahri Oqtosh mahallasi, Zamin ko'chasi, 305-uy	0	0.00	0.00	ACTIVE	2024-11-01	2026-05-20	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.585365+00	2026-08-31 17:20:10.585365+00
res-0052	"IT Centr Nishon" MCHJ	JUMAYEV MA'RUFJON MAXMADAMINOVICH	3164659	Qashqadaryo viloyati,Nishon tumanii,Guliston shahrchasi	0	0.00	0.00	ACTIVE	2026-03-27	2026-04-02	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.297132+00	2026-08-31 17:20:10.297132+00
res-0043	"Zukko Group" MCHJ	AHMADJONOV TEMURBEK OTABEK OG'LI	312110441	Qashqadaryo viloyati, Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	3	0.00	0.00	ACTIVE	2025-05-05	2025-05-15	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.840782+00	2026-08-31 17:20:11.840782+00
res-0048	"FET INFO GROUP" xususiy korxonasi	POLVONOV VOXID RUSTAMOVICH	305469266	Qashqadaryo viloyati, Mirishkor tumanii, Jeynov shaharchasi Ayzabod mahallasi	3	0.00	0.00	ACTIVE	2018-04-09	2021-02-26	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.94078+00	2026-08-31 17:20:11.94078+00
res-0042	"YEMAK" MCHJ	RUSTAMON RUSLAN ULUG"BEKOVICH	311038333	Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	7	0.00	0.00	ACTIVE	2024-01-15	2024-03-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.035114+00	2026-08-31 17:20:12.035114+00
res-0050	"ART-MATBAA-DESIGN" MCHJ	SATTOROV LAZIZ XOLMURODOVICH	310548174	Qashqadaryo viloyati, Qarshi sh. Ravoq mahallasi, Islom Karimov ko'chasi, 62-uy	0	0.00	0.00	ACTIVE	2023-06-08	2026-04-02	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.129296+00	2026-08-31 17:20:12.129296+00
res-0077	"ZEROTRACE" MCHJ	ISROILOV ABDULAZIZ NURBEK O‘G‘LI	313112059	Qashqadaryo viloyati, Chiroqchi tumani, Yangiqurilish MFY, Xo‘jaabdijobbor ko‘chasi, 1/5-uy.	0	0.00	0.00	ACTIVE	2026-06-17	2026-08-17	{}	{}	{}	\N	+998 (97) 011-37-56	\N	\N	\N	Chiroqchi	Litsenziyalarni sotish	Kompyuter texnologiyalаri sohаsidаgi mаslаhаt xizmаtlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.514306+00	2026-08-31 17:20:12.514306+00
res-0045	"Global System Information" MCHJ	RASHIDOV MUXAMMAD  ISMOIL O'G'LI	309049270	G‘uzor tumanii, G'uzor shahri, Nurobod ko'chasi	1	0.00	0.00	ACTIVE	2021-11-17	2021-11-30	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.280496+00	2026-08-31 17:20:11.280496+00
res-0081	"Edits Group" MCHJ	ERGASHEVA ASALOY DILMUROD QIZI	3172217	Qashqadaryo viloyati, Kasbi tumani,Mug'lon QFY	0	0.00	0.00	ACTIVE	2026-03-26	2026-04-02	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.714336+00	2026-08-31 17:20:12.714336+00
res-0085	«UNIVERSAL MAX SERVISE» MCHJ	Sa`dullayev Abdumalik	205989224	Qarshi sh., Sadoqat ko'chasi, 28-uy	0	0.00	0.00	REMOVED	\N	2023-09-15	{}	{}	{}	\N	+998 98 505-01-00	\N	\N	\N	Qarshi	Eksport	Engil avtomobillarga texnik xizmat ko'rsatish va ta'mirlash	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.689254+00	2026-08-31 17:20:13.689254+00
res-0247	"EVENING" oilaviy korxonasi	\N	310901542	Eskibog' qishlog'i, Gulshan mahallasi, 256-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.541409+00	2026-08-31 17:20:28.541409+00
res-0057	"AVTEN" MCHJ	SAMIYEV SHOXRUX ABDISALOM O‘G‘LI	312980555	Qashqadaryo viloyati, Shahrisabz tumani, Qutchi MFY, Qutchi qishlog‘i, 963-uy.	0	0.00	0.00	ACTIVE	21.04.202	2026-05-20	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.774603+00	2026-08-31 17:20:10.774603+00
res-0062	"IT VISION CENTER" NTM	SARIYEVA GUZAL BAXROMOVNA	312914674	Qashqadaryo viloyati, Muborak tumani, Yoshlik MFY, 2-mitti tuman dahasi, 199-uy	0	0.00	0.00	ACTIVE	2026-05-21	2026-06-03	{}	{"Problem: IT ta'lim bo'yicha imtiyozli kredit kerak"}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.176815+00	2026-08-31 17:20:11.176815+00
res-0061	"KASHFIYOTCHILAR 777" MCHJ	TOSHKENTOV RAUF RUSTAM O‘G‘LI	313049072	Qashqadaryo viloyati,Yakkabog' tumani ,Nurli yo‘l MFY, Lolazor qishlogʼi, 63-uy	0	0.00	0.00	ACTIVE	2026-05-18	2026-06-03	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.082592+00	2026-08-31 17:20:11.082592+00
res-0068	"KO'KDALA NEWS" mas`uliyati cheklangan jamiyati	MAXMADAMINOV SHUHRAT MUZAFFAR O`G`LI	312564709	Qashqadaryo viloyati, Ko‘kdala tumani , Chiyal Do‘stlik mahallasi, Sharq tongi ko'chasi, 3-uy	0	0.00	0.00	ACTIVE	2025-11-11	2026-07-06	{}	{}	{}	\N	+998 91 465-18-99	\N	\N	\N	Koʻkdala	IT ta'lim	Boshqа telekommunikаtsiya xizmаtlаri ko'rsаtish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.590077+00	2026-08-31 17:20:13.590077+00
res-0075	"CATE" MCHJ	AMIROV JUR’AT ERGASHEVICH	311662420	Qashqadaryo viloyati, Qarshi shahri, Navo mahallasi, Mustaqillik ko‘chasi, 1/5-uy, 1-xonadon.	0	0.00	0.00	ACTIVE	2024-10-04	2026-08-04	{}	{}	{}	\N	+998 90 716 22 81	\N	\N	\N	Qarshi	Eksport	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.31639+00	2026-08-31 17:20:12.31639+00
res-0070	"SFERA IT SOLUTIONS 24" MCHJ	Rahmatullayev Shahrixon	311523252	Qashqadaryo viloyati, Qarshi sh. Paxtazor mahallasi, Paxtazor mavzesi, 1/83-uy	0	0.00	0.00	ACTIVE	2024-08-05	2026-07-06	{}	{}	{}	\N	+998 90 326-93-90	\N	\N	\N	Qarshi	IT ta'lim	Boshqа dаsturiy tа'minotlаrni chiqаrish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.901798+00	2026-08-31 17:20:13.901798+00
res-0072	"PLASMA AI SOLUTIONS" MCHJ	SAMADOV ABDULLOX XASAN O‘G‘LI	313156099	Qashqadaryo viloyati, Qarshi shahri, Shodlik MFY, Mustaqillik ko‘chasi, Mustaqillik tor ko‘chasi, 21-uy.	0	0.00	0.00	ACTIVE	2026-07-06	2026-07-10	{}	{}	{}	\N	+998 (94) 877-87-83	\N	\N	\N	Qarshi	Litsenziyalarni sotish	Boshqа dаsturiy tа'minotlаrni chiqаrish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.494047+00	2026-08-31 17:20:13.494047+00
res-0066	"ZROK GAMES" MCHJ	DUBANEVICH ALIAKSANDR	312664393	-	0	0.00	0.00	ACTIVE	2025-12-17	-	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.792556+00	2026-08-31 17:20:13.792556+00
res-0076	"CALIFORNIUM IT ACADEMY" MCHJ	RASULOV MUXAMMADALI SODIKJON O‘G‘LI	311889596	Qashqadaryo viloyati, Qarshi shahri, Mustaqillik MFY, Mustaqillik ko‘chasi, 19-uy.	0	0.00	0.00	ACTIVE	2025-02-04	2026-08-18	{}	{}	{}	\N	+998 (90) 037-02-05	\N	\N	\N	Qarshi	Eksport,IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.41097+00	2026-08-31 17:20:12.41097+00
res-0097	"SHOHJAKHON TEAM" MCHJ	JUMAYEV SHOHJAXON ULUG`BEK O`G`LI	311153341	Shahrisabz sh. Do'stlik mahallasi, Bunyodkor ko'chasi, 156-uy	0	0.00	0.00	REMOVED	\N	2024-04-16	{}	{}	{}	\N	+998 91 787-03-87	\N	\N	\N	Shahrisabz	Ta`lim/Xizmat ko'rsatish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.971524+00	2026-08-31 17:20:15.971524+00
res-0103	"RISESOFT" MCHJ	Baratov Kobil Gafurovich	309716501	Qarshi sh. Eski-anxor mahallasi, Eski anxor ko'chasi	0	0.00	0.00	REMOVED	\N	2024-01-31	{}	{}	{}	\N	+998 90 716-51-49	\N	\N	\N	Qarshi	Xizmat ko'rsatish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.7753+00	2026-08-31 17:20:14.7753+00
res-0105	"IT TECH EDU" MCHJ	Axtamov Tursunpo`lat Faxriddin o'g'li	311094029	Muborak tumani, Tong MFY, 4 мавзеси, 10-уй.	0	0.00	0.00	REMOVED	\N	2024-02-29	{}	{}	{}	\N	+998 90 672-61-61	\N	\N	\N	Muborak	Ta`lim	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.977196+00	2026-08-31 17:20:14.977196+00
res-0083	"ZMT INTEGRITY KARSHI" MCHJ	Ubaydullayev Xojiakbar Maxamadjon o'g'li	310571210	Qarshi shahar Shodlik MFY Mustaqillik shox koçhasi, 21 uy	0	0.00	0.00	REMOVED	\N	2023-08-31	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.277822+00	2026-08-31 17:20:14.277822+00
res-0069	"DATAI SERVICES" MCHJ	HAQQULOV FAZLIDDIN FAXRIDDINOVICH	313068825	Qashqadaryo viloyati, Qarshi shahar.Shodlik MFY, Mustaqillik ko'chasi, Mustaqillik tor ko'chasi, 21-uy	0	0.00	0.00	ACTIVE	2026-05-29	2026-07-06	{}	{}	{}	\N	+998 (77) 002-06-60	\N	\N	\N	Qarshi	Eksport	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.917037+00	2026-08-31 17:20:12.917037+00
res-0106	"IT EDU KOSON"MCHJ	MADIYAROV ZAFARBEK ILXOM O`G`LI	311199743	Koson tumani, Qo'yi Obron shaharchasi Qo'yi Obron mahallasi, Qo'yi Obron ko'chasi, 31-uy	0	0.00	0.00	REMOVED	\N	2024-04-16	{}	{}	{}	\N	+998 77 877-18-00	\N	\N	\N	Koson	Ta`lim	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.070373+00	2026-08-31 17:20:15.070373+00
res-0101	"SAYFULLO HOJAMATXON" MCHJ	Hojimatova Rano Hojamatovna	311146516	Kitob tumani, Kitob shahri Ali Qushchi mahallasi, Katta yo‘l ko'chasi, 365-uy	0	0.00	0.00	REMOVED	\N	2024-03-31	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.583901+00	2026-08-31 17:20:14.583901+00
res-0107	"AIRVOICE" MCHJ	Karimov Eldor	309707425	Qarshi sh., Naxshab mahallasi, Islom Karimov ko'chasi, 27-uy, 59-xonadon	0	0.00	0.00	REMOVED	\N	2022-08-31	{}	{}	{}	\N	+998 90 615-00-83	\N	\N	\N	Qarshi	Ta`lim	Kompyuter dasturlashtirish sohasidagi faoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.167657+00	2026-08-31 17:20:15.167657+00
res-0084	"Venasoft" MCHJ	Sardor Xaydarov	310710210	Qarshi shahar Shodlik MFY Mustaqillik shox koçhasi, 21 uy	0	0.00	0.00	REMOVED	\N	2023-08-31	{}	{}	{}	\N	+998 95 103-34-71	\N	\N	\N	Qarshi	Ta`lim	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.183796+00	2026-08-31 17:20:14.183796+00
res-0064	"CREATESOFT" MCHJ	XALILOV ABBOS	307036724	Qashqadaryo viloyati,Chiroqchi tumanii, Qahramon QFY	0	0.00	0.00	ACTIVE	2020-01-17	2026-06-22	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.011147+00	2026-08-31 17:20:13.011147+00
res-0080	"PERFECT LIFE EDU" MCHJ	NORBOYEV ANVAR SIROJIDDIN O`G`LI	307771254	Qashqadaryo viloyati, Chiroqchi tumani, Chiroqchi shahri O'zbekiston mahallasi, Qushariq ko'chasi, 22-uy	0	0.00	0.00	REMOVED	2020-09-29	2026-03-17	{}	{}	{}	\N	+998 99 446-05-50	\N	\N	\N	Chiroqchi	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.305031+00	2026-08-31 17:20:13.305031+00
res-0090	"MUSTOFA O`QUV IT CENTER" MCHJ	Mustofayev Ahmad Husan o'g'li	309434244	Chiroqchi tumani, Chiroqchi mahallasi, Chiroqchi ko'chasi, 262-uy	0	0.00	0.00	REMOVED	\N	2024-01-16	{}	{}	{}	\N	+998 33 009-00-97	\N	\N	\N	Chiroqchi	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.255823+00	2026-08-31 17:20:16.255823+00
res-0071	"GREAT GOAL ACADEMY" MCHJ	KOBILOV KOZIM MUXTORXONOVICH	311524117	Qashqadaryo viloyati, Koson tumani, Regzor MFY, Nasaf ko‘chasi, 3-uy.	0	0.00	0.00	ACTIVE	2024-08-05	2026-07-06	{}	{}	{}	\N	+998 (94) 334-00-81	\N	\N	\N	Koson	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.090752+00	2026-08-31 17:20:14.090752+00
res-0093	SMART ACADEMY MCHJ	Egamberdiyev Tursinpulat	310548729	Nishon tumani, Nishon QFY Yuksalish mahallasi, Kelajak ko'chasi, 20-uy	0	0.00	0.00	REMOVED	\N	2024-03-16	{}	{}	{}	\N	+998 99 957-46-62	\N	\N	\N	Nishon	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.357172+00	2026-08-31 17:20:16.357172+00
res-0100	"HYBRID EDUTECH GROUP" MCHJ	Ismoilov Dilshodbek Sherzod o'g'li	309094486	Qarshi sh., Shaxrisabz ko'chasi, 26-uy	0	0.00	0.00	REMOVED	\N	2023-05-31	{}	{}	{}	\N	+998 90 679-00-08	\N	\N	\N	Qarshi	Ta`lim	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.46397+00	2026-08-31 17:20:14.46397+00
res-0096	"QIZIL NATIJA"	MAMADIYEV HUMOYUN HAMDULLO O`G`LI	311345427	Qashqadaryo viloyati, Yakkabog' tumani, Yakkabog' shahri Yangiobod mahallasi, Yangiobod ko'chasi, 95-uy	0	0.00	0.00	REMOVED	\N	2024-06-14	{}	{}	{}	\N	+998 97 049-73-33	\N	\N	\N	Yakkabogʻ	Xizmat ko'rsatish	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.455785+00	2026-08-31 17:20:16.455785+00
res-0102	"SCHOOL OF IDEA" NTM	Davronov Xujamkul	309641382	Qarshi sh., Oydin mahallasi, Mustaqillik ko'chasi	0	0.00	0.00	REMOVED	\N	2023-10-31	{}	{}	{}	\N	+998 94 648-75-52	\N	\N	\N	Qarshi	Ta`lim	Umumiy o'rta ta'lim	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.677831+00	2026-08-31 17:20:14.677831+00
res-0091	"XAYRULLAYEV WEB" MCHJ	Xayrullayev Samandar Ilhom o`g`li	311165034	Касби тумани. Оккамиш МФЙ , Мустакиллик кучаси	0	0.00	0.00	REMOVED	\N	2024-03-16	{}	{}	{}	\N	+998 90 878-03-57	\N	\N	\N	Kasbi	Ta`lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.065791+00	2026-08-31 17:20:16.065791+00
res-0118	"PYRAMID EDUCATION" MCHJ	Normurodov Javohirbek G`ayrat o`g`li	311149495	Qamashi tumani, Ozbekiston mahallasi, Iftixor shoh ko'chasi, 498-uy	0	0.00	0.00	REMOVED	\N	2024-03-16	{}	{}	{}	\N	+998 99 060-06-59	\N	\N	\N	Qamashi	Ta`lim	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.426341+00	2026-08-31 17:20:18.426341+00
res-0123	"AL-Beruniy ziyo" NTM	Davronov Xujamkul	305211667	Nishon tumani, Nuriston shaharchasi, Nurchi mahallasi, Mustaqillik ko'chasi	0	0.00	0.00	REMOVED	\N	2022-07-22	{}	{}	{}	\N	+998 94 648-75-52	\N	\N	\N	Nishon	Ta`lim	Umumiy o'rta ta'lim	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.835891+00	2026-08-31 17:20:16.835891+00
res-0126	"COUT" MCHJ	QURBANAZAROV RO`ZMONBEK BAXRIDDIN	312076792	Qashqadaryo viloyati, Nishon tumanii, Nuriston shaharchasi Nurchi mahallasi,O'zbekiston ko'chasi, 26-uy	0	0.00	0.00	REMOVED	\N	2025-07-31	{}	{}	{}	\N	+998 97 097-90-23	\N	\N	\N	Nishon	Litsenziyalarni sotish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.307184+00	2026-08-31 17:20:17.307184+00
res-0161	"TECHBOR" MCHJ	XAYDAROV TEMURBEK HIKMATILLO O‘G‘LI	313237210	Qashqadaryo viloyati, Qarshi shahri, Maxallot MFY, Balx ko‘chasi, 8-uy	0	0.00	0.00	ACTIVE	2026-08-17	\N	{"0% Corporate Income Tax","7.5% Personal Income Tax","0% Customs Duty"}	{}	{}	info@itcompany.uz	+998 77 660-50-01	https://itcompany.uz	\N	\N	Qarshi	Eksport	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	Dilnoza Alimova	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[{"id": "hist-1788496802368", "action": "Updated resident profile (Enterprise Registry Data)", "userId": "u-1", "userName": "Dilnoza Alimova", "timestamp": "2026-09-04"}]	{}	2026-08-31 17:20:18.892984+00	2026-08-31 17:20:18.892984+00
res-0128	"SFERA EDUCATIONAL CENTER" MCHJ	Rahmatullayev Shahrixon	310022591	Qarshi shahar Paxtazor MFY, 1/83 uy	0	0.00	0.00	REMOVED	\N	2023-05-03	{}	{}	{}	\N	+998 90 326-93-90	\N	\N	\N	Qarshi	Ta`lim	Boshqa toifalarga kiritilmagan ta'limning boshqa turlari	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.799576+00	2026-08-31 17:20:18.799576+00
res-0121	"Prime Hub Center"	TURABAYEV NURBEK XOLMURATOVICH	311135695	Qashqadaryo viloyati, Qarshi sh. Otchopar mahallasi, Denov ko'chasi, 20-uy	0	0.00	0.00	REMOVED	\N	2024-07-15	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.6128+00	2026-08-31 17:20:18.6128+00
res-0111	"DILXIROJXON" NTM	BERDIQULOVA GULNOZ O‘ROLOVNA	305365831	Qashqadaryo viloyati, Chiroqchi tuman Beshchasma kasb hunar maktabi	0	0.00	0.00	REMOVED	\N	2024-12-28	{}	{}	{}	\N	+998 97 638-77-44	\N	\N	\N	Chiroqchi	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.573094+00	2026-08-31 17:20:15.573094+00
res-0109	"CODEFY GROUP" MCHJ	Oybek Nurimov	311889604	-	0	0.00	0.00	REMOVED	\N	-	{}	{}	{}	\N	+998 77 219-46-46	\N	\N	\N	Qarshi	Eksport	-	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.380588+00	2026-08-31 17:20:15.380588+00
res-0095	"DESIGN MASTER GROUP" MCHJ	Sattarov Behzod Salohiddin o'g'li	302954472	Qarshi sh. Islom Karimov ko`chasi, 219b-uy	0	0.00	0.00	REMOVED	\N	2024-01-31	{}	{}	{}	\N	+998 91 321-75-77	\N	\N	\N	Qarshi	Xizmat ko'rsatish	Me'morchilik sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.6472+00	2026-08-31 17:20:16.6472+00
res-0117	"Kukdala study center" MCHJ	JONTEMIROVA XUSNORA HAYITMUROD QIZI	310821974	Qashqadaryo viloyati, Ko‘kdala tumani , Torjilg‘a Torjilg'a mahallasi, Sangzor ko'chasi, 68-uy	0	0.00	0.00	REMOVED	\N	2024-04-30	{}	{}	{}	\N	+998 97 639-10-40	\N	\N	\N	Koʻkdala	Ta`lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.333044+00	2026-08-31 17:20:18.333044+00
res-0129	"F-ZONE" MCHJ	CHORIYEV BOTIR XASANOVICH	308375549	Qashqadaryo viloyati, Shahrisabz sh. Tutzor mahallasi, N.Berdiev ko'chasi, 10-uy	0	0.00	0.00	REMOVED	\N	2025-02-28	{}	{}	{}	\N	+998 93 288-72-27	\N	\N	\N	Shahrisabz	Ta`lim	Boshqа pochtа vа kurerlik fаoliyati	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.117487+00	2026-08-31 17:20:17.117487+00
res-0099	"UNIFAR GROUP" MCHJ	Nadjimov Firdavs Sherzodovich	311062717	Qarshi sh. Geolog mahallasi, Nasaf dacha ko'chasi, 14/1-uy	0	0.00	0.00	REMOVED	\N	2024-02-29	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.742569+00	2026-08-31 17:20:16.742569+00
res-0122	"IQ" nodavlat ta`lim muassasasi	URALOV ZAFAR BAXROMOVICH	308100264	Kitob tumani, kitob shahri	0	0.00	0.00	REMOVED	\N	2024-08-30	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.023844+00	2026-08-31 17:20:17.023844+00
res-0136	«ILMLARCOM» MCHJ	Suyunov Jasurbek Jalol o'g'li	310563394	Yakkabog' tumani, Madaniyat mahallasi, 64	0	0.00	0.00	REMOVED	\N	2023-07-14	{}	{}	{}	\N	+998 94 335-05-31	\N	\N	\N	Yakkabogʻ	Ta`lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.586538+00	2026-08-31 17:20:17.586538+00
res-0138	"ELEGANT JASMIN ZIYO NUR" NTM	ASQAROVA GULSHODA JAMOLOVNA	307209484	Qashqadaryo viloyati, Mirishkor tumanii, Yangi Mirishkor shaharchasi Yangi Mirishkor mahallasi	0	0.00	0.00	REMOVED	\N	2025-11-28	{}	{}	{}	\N	+998 77 006-85-88	\N	\N	\N	Mirishkor	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.706099+00	2026-08-31 17:20:18.706099+00
res-0113	"UNIVERSAL SABOQ AKADEMIYASI" MCHJ	Alibek	311622153	QASHQADARYO VILOYATI, KOSON TUMANI, YANGIOBOD MFY, SADRIDDIN АYNIY KO‘CHASI ,\n27-UY	0	0.00	0.00	REMOVED	\N	2024-10-15	{}	{}	{}	\N	+998 91 814-06-43	\N	\N	\N	Koson	Ta`lim	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.670839+00	2026-08-31 17:20:15.670839+00
res-0168	"ZIYODULLA SODIQOV" mas`uliyati cheklangan jamiyati	\N	312653716	Qilichbek-Qurg'oncha mahallasi, Uzumzor ko'chasi, 26/1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:19.931167+00	2026-08-31 17:20:19.931167+00
res-0192	"KESH HELP SERVICE" xususiy korxonasi	\N	305884409	Kesh mahallasi, Kalakon ko'chasi, 31-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.333788+00	2026-08-31 17:20:21.333788+00
res-0131	"SMARTKIDS" MCHJ	TUXTAYEV SARDOR NODIROVICH	311659519	Qashqadaryo, Shahrisabz sh. Buyuk ipak yo'li 7	0	0.00	0.00	REMOVED	\N	2025-02-28	{}	{}	{}	\N	+998 90 956-11-01	\N	\N	\N	Shahrisabz	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.146318+00	2026-08-31 17:20:18.146318+00
res-0116	"CODE TECH ACADEMY" MCHJ	Egamberdiyev Hojiakbar Salohitdinovich	310698202	Qarshi sh. Gulshan mahallasi, Nasaf ko'chasi, 339-uy, 46-xonadon	0	0.00	0.00	REMOVED	\N	2024-01-16	{}	{}	{}	\N	+998 90 609-42-00	\N	\N	\N	Qarshi	Xizmat ko'rsatish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.239877+00	2026-08-31 17:20:18.239877+00
res-0120	"JP LAND EDUCATION" NTM	Jahongir Pirnazarov	311539294	QASHQADARYO VILOYATI, G`UZOR TUMANI, SHERALI MFY, 594-UY	0	0.00	0.00	REMOVED	\N	2024-10-31	{}	{}	{}	\N	93312575	\N	\N	\N	Qarshi	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.052828+00	2026-08-31 17:20:18.052828+00
res-0191	"KIFTI-OB DIGITAL" oilaviy korxonasi	\N	307863622	Buyuk Ipak yo'li ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.240538+00	2026-08-31 17:20:21.240538+00
res-0193	"TADBIRKOR  FAYZ BARAKA" mas`uliyati cheklangan jamiyati	\N	307502604	Olmazor mahallasi, Xudoyorbek ko'chasi, 46-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.428607+00	2026-08-31 17:20:21.428607+00
res-0172	"PRO IT" mas`uliyati cheklangan jamiyati	\N	312167917	Samarqand mahallasi, Buxoro ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.025888+00	2026-08-31 17:20:20.025888+00
res-0125	"FREELANCERS ACADEMY"MCHJ	NORTURAEV JAHONGIR OBID O'G'LI	308895352	Qashqadaryo viloyati, Nishon tumanii, Yangi Nishon shahri Paxtakor mahallasi, O'zbekiston ko'chasi	0	0.00	0.00	REMOVED	\N	2022-08-19	{}	{}	{}	\N	+998 99 540-76-38	\N	\N	\N	Nishon	IT ta'lim	Boshqа dаsturiy tа'minotlаrni chiqаrish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.866599+00	2026-08-31 17:20:17.866599+00
res-0194	"SPECTR PRO" xususiy korxonasi	\N	305640309	Hamid Olimjon mahallasi, Amir Temur ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.522381+00	2026-08-31 17:20:21.522381+00
res-0195	"TOPOGRAF QURBANOV T" mas'uliyati cheklangan jamiyati	\N	306564267	Olmazor qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.615798+00	2026-08-31 17:20:21.615798+00
res-0198	"SHIRINOVA SANOBAR" oilaviy korxonasi	\N	206160615	Zanjirsaroy shox ko'chasi, 15-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.898293+00	2026-08-31 17:20:21.898293+00
res-0196	"VOHA TA`MINOT-BIZNES" mas`uliyati cheklangan jamiyati	\N	309428210	Ziyokor mahallasi, Gulzor ko'chasi, 48-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.70885+00	2026-08-31 17:20:21.70885+00
res-0199	"MK-MAKS-GREAT" mas`uliyati cheklangan jamiyati	\N	312140476	Chiyal mahallasi, Mirtemir ko'chasi, 238-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.991793+00	2026-08-31 17:20:21.991793+00
res-0163	"URAL ESHQUVVATOV" mas`uliyati cheklangan jamiyati	\N	311988631	Shayxali mahallasi, Shayxali ko'chasi, 5/69-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:19.452781+00	2026-08-31 17:20:19.452781+00
res-0197	"JO`RABEK INVEST" xususiy korxonasi	\N	302744274	Bog'ishamol mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:21.805068+00	2026-08-31 17:20:21.805068+00
res-0166	"FRIENDLY SESTEM" mas`uliyati cheklangan jamiyati	\N	310461213	Tanxoz mahallasi, Tanxoz qishlog`i, 3-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:19.741893+00	2026-08-31 17:20:19.741893+00
res-0167	"UNI-PROJECT-SERVICE" mas'uliyati cheklangan jamiyati	\N	306591464	A.Navoiy mahallasi, Yosh kuch ko'chasi, 34-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:19.835366+00	2026-08-31 17:20:19.835366+00
res-0165	"UNIVERSAL IMRON" mas`uliyati cheklangan jamiyati	\N	312733172	Xumo mahallasi, Saodatmand 2 ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:19.648142+00	2026-08-31 17:20:19.648142+00
res-0174	"INFOTECH-X" xususiy korxonasi	\N	312264432	Komilon S.Raximov mahallasi, Kuchabog' ko'chasi, 25-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.120062+00	2026-08-31 17:20:20.120062+00
res-0178	"EI-DEVS" mas`uliyati cheklangan jamiyati	\N	311535886	Bog'obod mahallasi, Soxil ko'chasi, 91-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.959521+00	2026-08-31 17:20:17.959521+00
res-0189	"KOMPYUTER KOMMUNIKATSIYA AXBOROT MASKANI" nodavlat ta`lim muassasasi	\N	302382988	Mustaqillik mahallasi, O'zbekiston ko'chasi, 235-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.676666+00	2026-08-31 17:20:23.676666+00
res-0190	"UNISET WEB GROUP" mas'uliyati cheklangan jamiyati	\N	306561872	Alaqo'yliq shaharchasi, 105-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.770019+00	2026-08-31 17:20:23.770019+00
res-0221	"BEKZOD ABBOS UNIVERSAL" mas`uliyati cheklangan jamiyati	\N	310061290	Mustaqillik mahallasi, Islom Karimov ko'chasi, 220-uy, 5n-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.863807+00	2026-08-31 17:20:23.863807+00
res-0222	"FOR OUR FAMILY" mas`uliyati cheklangan jamiyati	\N	308566627	Janub mash'ali mahallasi, Shodlik ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.956772+00	2026-08-31 17:20:23.956772+00
res-0224	"DUNYO777" mas`uliyati cheklangan jamiyati	\N	311991985	Ayzabod mahallasi, Ayzabod ko'chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.051311+00	2026-08-31 17:20:24.051311+00
res-0223	"SHUXRAT OTA 1964" xususiy korxonasi	\N	308717611	Eski Yakkabog`, mustaqillik ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.144736+00	2026-08-31 17:20:24.144736+00
res-0225	"TARNADO MOBILE" mas`uliyati cheklangan jamiyati	\N	312272859	Mug'jagul mahallasi, Nasaf ko'chasi, 37-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.23752+00	2026-08-31 17:20:24.23752+00
res-0226	"ANGEL YASINA" mas`uliyati cheklangan jamiyati	\N	311946114	Bunyodkor mahallasi, Amir Temur ko'chasi, 35-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.330777+00	2026-08-31 17:20:24.330777+00
res-0227	"JAMSHID ABDIMAJIDOVOCH" mas`uliyati cheklangan jamiyati	\N	311849273	Mustaqillik mahallasi, Olmazor ko'chasi, 36-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.424001+00	2026-08-31 17:20:24.424001+00
res-0228	"SC CYBERLEGAL" xususiy korxonasi	\N	312645456	Obod mahallasi, Mevazor ko'chasi, 24а-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.517569+00	2026-08-31 17:20:24.517569+00
res-0229	"AUTOMATION AND CONTROL SOLUTIONS" mas`uliyati cheklangan jamiyati	\N	312779305	Kimyogar mahallasi, 5-mavzesi, 186-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.610749+00	2026-08-31 17:20:24.610749+00
res-0230	"NIDDERSAN" oilaviy korxonasi	\N	310174507	Nartibaland mahallasi, Vatanparvar ko'chasi, 9-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.705317+00	2026-08-31 17:20:24.705317+00
res-0231	"THE ONLY GRAPE" mas`uliyati cheklangan jamiyati	\N	310635969	Honiyon mahallasi, Dasht qishlog'i, 45-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.798354+00	2026-08-31 17:20:24.798354+00
res-0201	"FAMILY CONSULT" xususiy korxonasi	\N	312529361	Paxtakor mahallasi, Orzumand ko'chasi, 50-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.180774+00	2026-08-31 17:20:22.180774+00
res-0203	"EDU LIGHT" mas`uliyati cheklangan jamiyati	\N	311440325	Beshariq MFY,  Baxt darvozasi shaharchasi , 238-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.274036+00	2026-08-31 17:20:22.274036+00
res-0205	"SILVER TEXNO SERVISE" mas`uliyati cheklangan jamiyati	\N	312438594	O'rtaqo'rg'on mahallasi, O'rtaqo'rg'on qishlog'i, 15-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.460373+00	2026-08-31 17:20:22.460373+00
res-0206	"GAMMA BARS" xususiy korxonasi	\N	301893219	Xo'jaguzar mahallasi, X.Olimjon ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.554586+00	2026-08-31 17:20:22.554586+00
res-0208	"ECLIPSE" xususiy korxonasi	\N	306639149	Xidoyat ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.740738+00	2026-08-31 17:20:22.740738+00
res-0209	"CRM CONTROL" mas`uliyati cheklangan jamiyati	\N	310604856	Gungon mahallasi, Navo ko'chasi, 52-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.833771+00	2026-08-31 17:20:22.833771+00
res-0210	"SHUXRAT SOLIQ MASLAHATI" mas`uliyati cheklangan jamiyati shaklidagi soliq maslahatchilari tashkiloti	\N	301570723	N.Nazarov ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.926895+00	2026-08-31 17:20:22.926895+00
res-0177	"COMPUTER NETWORK GROUP" mas`uliyati cheklangan jamiyati	\N	311483937	Komilon mahallasi, Islom Karimov ko'chasi, 296-uy, 32-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.400127+00	2026-08-31 17:20:20.400127+00
res-0179	"YUSUPOV UKTAM XUDAYBERDIYEVICH" oilaviy korxonasi	\N	303263952	Xonjon ko'chasi, 45-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.493386+00	2026-08-31 17:20:20.493386+00
res-0186	"KOMPAKT LAZER PRENT" xususiy korxonasi	\N	300468492	Xumo mahallasi, Rayonobod qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.583321+00	2026-08-31 17:20:23.583321+00
res-0207	"МИРМУХАММАД ФАЙЗ" хусусий корхонаси	\N	204914246	Узбекистон кучаси	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.647783+00	2026-08-31 17:20:22.647783+00
res-0219	"EDU-ZON HOLDING" mas`uliyati cheklangan jamiyati	\N	308651901	Alisher Navoiy mahallasi, Olimlar ko'chasi, 1A-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.391836+00	2026-08-31 17:20:26.391836+00
res-0253	"AKUSTRON" xususiy korxonasi	\N	204094120	Ibn Sino mahallasi, A.Temur ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.485309+00	2026-08-31 17:20:26.485309+00
res-0255	"MUROD WEB INVESTMENTS" mas`uliyati cheklangan jamiyati	\N	305304867	G'ofur G'ulom mahallasi, Nasaf ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.671898+00	2026-08-31 17:20:26.671898+00
res-0256	"QUANTIUM SOLUTION" mas`uliyati cheklangan jamiyati	\N	311480743	Loyqasoy mahallasi, Olmos ko'chasi, 84-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.765123+00	2026-08-31 17:20:26.765123+00
res-0257	"EVERJUST BROKER" mas'uliyati cheklangan jamiyati	\N	308475147	Amir Temur ko'chasi, 1-uy, 8-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.85857+00	2026-08-31 17:20:26.85857+00
res-0258	"YAMMIY" mas`uliyati cheklangan jamiyati	\N	312209055	Gungon mahallasi, Nasaf ko'chasi, 7/126-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.952125+00	2026-08-31 17:20:26.952125+00
res-0260	"AC QASHQADARY0" mas`uliyati cheklangan jamiyati	\N	308200440	Qarliqxona mahallasi, Islom Karimov ko'chasi, 219-b	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.045436+00	2026-08-31 17:20:27.045436+00
res-0261	"DO`STLIK" mas`uliyati cheklangan jamiyati	\N	202640795	Sho`rtan mahallasi, 7-mitti tuman, 8-uy, 1-qavat	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.138619+00	2026-08-31 17:20:27.138619+00
res-0262	"ASIA CONSULT ANDIJON" mas`uliyati cheklangan jamiyati	\N	308044840	Haramjo'y mahallasi, Haramjo'y ko'chasi, 24/1A-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.232359+00	2026-08-31 17:20:27.232359+00
res-0263	"HAMROH PRESS OAV" mas`uliyati cheklangan jamiyati	\N	305778776	Mustaqillik mahallasi, Mustaqillik ko'chasi, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.325965+00	2026-08-31 17:20:27.325965+00
res-0264	"SAG`DULLAEV SAID" oilaviy korxonasi	\N	304446493	Mag'zon mahallasi, Nasaf ko'chasi, 163-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.419076+00	2026-08-31 17:20:27.419076+00
res-0265	"ABADD" mas`uliyati cheklangan jamiyati	\N	311547064	Beglar mahallasi, To'maris ko'chasi, 20-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.51256+00	2026-08-31 17:20:27.51256+00
res-0266	"FAMILY TZIO GROUP" mas'uliyati cheklangan jamiyati	\N	306455212	Mustaqillik ko'chasi, 297-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.605885+00	2026-08-31 17:20:27.605885+00
res-0269	"KIFTI-OB SIFAT TEAM" mas`uliyati cheklangan jamiyati	\N	309300933	Jilisuv mahallasi, Bolqon qaychili ko'chasi, 41-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.699353+00	2026-08-31 17:20:27.699353+00
res-0233	"ASROR GAME STAR" oilaviy korxonasi	\N	312063144	Do'stlik mahallasi, Bunyodkor ko'chasi, 2-uy, 8-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.985335+00	2026-08-31 17:20:24.985335+00
res-0234	"IN TUNE WITH THE TIMES" mas`uliyati cheklangan jamiyati	\N	310402973	Dasht qishlog'i, Xoniyon mahallasi, 75-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.078749+00	2026-08-31 17:20:25.078749+00
res-0235	"SAMANDAR TASHABBUSI" mas`uliyati cheklangan jamiyati	\N	309006926	O'zbekiston mahallasi, Mustaqillik ko'chasi, 21-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.172193+00	2026-08-31 17:20:25.172193+00
res-0237	"KASBI ASL ARK" mas`uliyati cheklangan jamiyati	\N	308645299	Xo'jakasbi mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.265889+00	2026-08-31 17:20:25.265889+00
res-0238	"JASURBEK ASLANBEK 555" mas`uliyati cheklangan jamiyati	\N	309073496	Bo'ston mahallasi, Xumdon qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.360086+00	2026-08-31 17:20:25.360086+00
res-0240	"SUMAYYA SANJAR QIZI" xususiy korxonasi	\N	311810315	Mustaqillik mahallasi, Mustaqillik ko'chasi, 122-uy, 6-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.547875+00	2026-08-31 17:20:25.547875+00
res-0241	"ELEGANT INVEST ASIL BIZNIS" mas`uliyati cheklangan jamiyati	\N	309684417	Bo'ston mahallasi, Yangi hayot qishlog'i, 19-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.641183+00	2026-08-31 17:20:25.641183+00
res-0212	"SHXBOZ RESHALLO" xususiy korxonasi	\N	310492301	Dodiq mahallasi, Orzu ko'chasi, 110-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.113834+00	2026-08-31 17:20:23.113834+00
res-0181	"IDROKTECH" mas`uliyati cheklangan jamiyati	\N	312194092	Darvozatutak mahallasi, Urta ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.208885+00	2026-08-31 17:20:23.208885+00
res-0182	"NORBOY OTA JIZ" mas`uliyati cheklangan jamiyati	\N	309677574	Apardi mahallasi, Qushtepa qishlog`i, 56-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.30213+00	2026-08-31 17:20:23.30213+00
res-0183	"LANGFORGE AI TECHNOLOGIES" mas`uliyati cheklangan jamiyati	\N	312882835	Xumdon mahallasi, Xumdon qishlog'i, 129-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.396813+00	2026-08-31 17:20:23.396813+00
res-0184	"BIG TIM 888" mas`uliyati cheklangan jamiyati	\N	311184264	Geolog mahallasi, Nasaf ko'chasi, 12A-uy, 1-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.489819+00	2026-08-31 17:20:23.489819+00
res-0220	"LEGACY" mas'uliyati cheklangan jamiyati	\N	307003100	Sanam mahallasi, Shahrisabz ko'chasi, 128-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.20151+00	2026-08-31 17:20:26.20151+00
res-0290	"BIGWAY ACADEMY" mas`uliyati cheklangan jamiyati	\N	310952954	Zog'za mahallasi, N.Raximov ko'chasi, 47-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.196218+00	2026-08-31 17:20:29.196218+00
res-0291	"MG SCHOOL KARSHI" nodavlat ta`lim muassasasi	\N	309734187	Qarliqxona mahallasi, Islom Karimov ko'chasi, 307a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.289609+00	2026-08-31 17:20:29.289609+00
res-0292	KITOB TUMAN 3-SONLI OILAVIY BOLALAR UYI	\N	309029098	Yangiobod mahallasi, Yangibod dahasi, 9/19-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.382838+00	2026-08-31 17:20:29.382838+00
res-0293	"SANOAT SHAXODAT" nodavlat ta`lim muassasasi	\N	303325794	Loliston mahallasi, Pahtakor qishlog'i, 502-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.476085+00	2026-08-31 17:20:29.476085+00
res-0294	1-sonli bolalar musiqa va san`at maktabi	\N	203144034	Shodlik mahallasi, Mustaqillik shoh ko'chasi, 56-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.56918+00	2026-08-31 17:20:29.56918+00
res-0296	"SUYAR NEW BIZNES" mas`uliyati cheklangan jamiyati	\N	312069018	Yangi obod mahallasi, Yangiobod ko'chasi, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.662326+00	2026-08-31 17:20:29.662326+00
res-0298	"PARVEZ IT-PARK" mas`uliyati cheklangan jamiyati	\N	308681857	Otchopar mahallasi, Yo`lchilar ko`chasi, 19-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.859582+00	2026-08-31 17:20:29.859582+00
res-0299	"DORUL KASB HUNAR " mas`uliyati cheklangan jamiyati	\N	301221404	Aralovul mahallasi, Jayhun ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.952863+00	2026-08-31 17:20:29.952863+00
res-0301	"NEW TOTAL ENGLISH" nodavlat ta`lim muassasasi	\N	306896771	Ipak yo'li ko'chasi, 307-uy, 14-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.140348+00	2026-08-31 17:20:30.140348+00
res-0300	"ELEGANT NUR ZIYO PLUS" nodavlat ta`lim muassasasi	\N	305161287	Mustaqillik shox ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.046183+00	2026-08-31 17:20:30.046183+00
res-0303	"ADVANSITY AAA" mas`uliyati cheklangan jamiyati	\N	308881670	Otchopar mahallasi, Mustaqillik ko'chasi, 9/37-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.327077+00	2026-08-31 17:20:30.327077+00
res-0304	"ACCAUNT MASTERS" mas`uliyati cheklangan jamiyati	\N	310814208	Alisher Navoiy mahallasi, Xamza ko'chasi, 40-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.420943+00	2026-08-31 17:20:30.420943+00
res-0306	"GREAT COUNTER EDUCATION" mas`uliyati cheklangan jamiyati	\N	312270964	Xontepa mahallasi, Kultepa ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.514802+00	2026-08-31 17:20:30.514802+00
res-0271	"AYTI BIZNES" mas`uliyati cheklangan jamiyati	\N	311396238	Bog'obod mahallasi, Tuqmang`it qishlog`i, 1/96-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.887389+00	2026-08-31 17:20:27.887389+00
res-0272	"GRANDMASTERS SOFT" mas`uliyati cheklangan jamiyati	\N	301648845	Komilon mahallasi, Islom Karimov ko'chasi, 302-uy, 31-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.980347+00	2026-08-31 17:20:27.980347+00
res-0273	"APSIDAL" mas`uliyati cheklangan jamiyati	\N	311903579	Eskianhor mahallasi, Islom Karimov ko'chasi, 503/24-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.073538+00	2026-08-31 17:20:28.073538+00
res-0274	"ELSHOD NAJMIDDINOV" mas`uliyati cheklangan jamiyati	\N	308647177	Yangiobod qishlog`i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.166586+00	2026-08-31 17:20:28.166586+00
res-0276	"FOR EACH SOFT" mas`uliyati cheklangan jamiyati	\N	303432694	4-mitti tumani, 12-uy, 46-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.260099+00	2026-08-31 17:20:28.260099+00
res-0278	"KVALITATIVAS EKAS" mas`uliyati cheklangan jamiyati	\N	309989083	Dam mahallasi, 18-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.353352+00	2026-08-31 17:20:28.353352+00
res-0245	"XIDOYEV ZAYNIDDIN FAYZIYEVICH" xususiy korxonasi	\N	309606109	Bog'ibahor mahallasi, To'rtko'l ko'chasi, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.447001+00	2026-08-31 17:20:28.447001+00
res-0302	"MATH TEACHERS" mas`uliyati cheklangan jamiyati	\N	312463880	Talotepa mahallasi, Yunus Rajabiy ko'chasi, 9-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.233909+00	2026-08-31 17:20:30.233909+00
res-0215	"A'LO STAR" mas'uliyati cheklangan jamiyati	\N	306701239	Do'xchi qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.921213+00	2026-08-31 17:20:25.921213+00
res-0216	"SHAROFOV SIROJIDDIN IXTIYOROVICH" mas'uliyati cheklangan jamiyati	\N	307580019	Xalqa ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.014389+00	2026-08-31 17:20:26.014389+00
res-0308	"NAZORAT SIFAT TALIM" nodavlat ta`lim muassasasi	\N	311998381	Istiqlol mahallasi, Zebomaskan-8 ko'chasi, 45-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.608547+00	2026-08-31 17:20:30.608547+00
res-0217	"JM CRYPTO MINE" mas'uliyati cheklangan jamiyati	\N	308482265	Qipchoq qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.107888+00	2026-08-31 17:20:26.107888+00
res-0325	QARSHI SHAHAR 9-SON BOLALAR MUSIQA VA SAN`AT MAKTABI	\N	204213715	Chaqar mahallasi, Gulshan ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.112103+00	2026-08-31 17:20:32.112103+00
res-0326	"MUYASSAR OQUV TALIM" mas`uliyati cheklangan jamiyati	\N	312203816	O'zbekiston mahallasi, Mustaqillik ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.205915+00	2026-08-31 17:20:32.205915+00
res-0327	MUBORAK TUMAN 11-SON BOLALAR MUSIQA VA SAN`AT MAKTABI	\N	206931177	Bobur mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.298919+00	2026-08-31 17:20:32.298919+00
res-0328	"TALABALIK SARI" mas`uliyati cheklangan jamiyati	\N	312753346	Bunyodkor mahallasi, Yangi chaman ko'chasi, 3/5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.392155+00	2026-08-31 17:20:32.392155+00
res-0329	"MASTER TA`LIM KITAB" xususiy korxonasi	\N	309914041	Panji mahallasi, 153-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.486912+00	2026-08-31 17:20:32.486912+00
res-0331	KITOB TUMANI 6-SONLI OILAVIY BOLALAR UYI	\N	309024864	Istiqbol mahallasi, Yangi Charmgar dahasi, 104-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.674904+00	2026-08-31 17:20:32.674904+00
res-0332	CHIROQCHI TUMAN 17-SONLI OILAVIY BOLALAR UYI	\N	309384315	Dam mahallasi, Dam qishlog'i, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.768286+00	2026-08-31 17:20:32.768286+00
res-0335	"RIYOZIYOT ACADEMY" nodavlat ta`lim muassasasi	\N	306655059	Xamza ko'chasi, 16-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.862034+00	2026-08-31 17:20:32.862034+00
res-0336	12-sonli bolalar musiqa va san'at maktabi	\N	204329174	Yuksalish mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.048348+00	2026-08-31 17:20:33.048348+00
res-0337	"MIR ASIL SULTON" mas`uliyati cheklangan jamiyati	\N	305280456	Qarliqxona mahallasi, Islom Karimov ko'chasi, 315-uy, b-blok 1-qavat	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.141778+00	2026-08-31 17:20:33.141778+00
res-0338	"EDE MIT DEUTSCH" mas`uliyati cheklangan jamiyati	\N	312345806	Ayg'irkul mahallasi, Ayg'irkul ko'chasi, 204-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.235112+00	2026-08-31 17:20:33.235112+00
res-0339	"WORLDSCHOOL" mas`uliyati cheklangan jamiyati	\N	308933684	A.Temur ko'chasi, 139-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.341532+00	2026-08-31 17:20:33.341532+00
res-0340	"BRIDGED ACADEMY" mas`uliyati cheklangan jamiyati	\N	312362097	Tabassum mahallasi, Islom Karimov ko'chasi, 1/47-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.434607+00	2026-08-31 17:20:33.434607+00
res-0312	"TEACHER LADY" mas`uliyati cheklangan jamiyati	\N	312375437	Navoiy mahallasi, Gulmachit ko'chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.528323+00	2026-08-31 17:20:33.528323+00
res-0313	"MARVARID ACADEMY" mas`uliyati cheklangan jamiyati	\N	312911085	Ziyokor mahallasi, Ipak yo'li ko'chasi, 15-g-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.621826+00	2026-08-31 17:20:33.621826+00
res-0309	XALQARO MEDITSINA TEXNIKUMI	\N	305927455	Buyukkarvon mahallasi, O'zbekiston ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.795166+00	2026-08-31 17:20:30.795166+00
res-0285	"MOHIRBEK NUR MOBILE" mas`uliyati cheklangan jamiyati	\N	311552755	Mustaqillik mahallasi, Tabassum 2 ko'chasi, 76-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.98334+00	2026-08-31 17:20:30.98334+00
res-0281	"DIGITAL BOOKING" mas`uliyati cheklangan jamiyati	\N	312145492	Roguzar mahallasi, Kaxramon ko'chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.076857+00	2026-08-31 17:20:31.076857+00
res-0283	"LEE GOONG SOOK" oilaviy korxonasi	\N	306394985	O'zbekiston mahallasi, Mustaqillik ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.170979+00	2026-08-31 17:20:31.170979+00
res-0284	"ELSHODBEK PARDAYEVICH" xususiy korxonasi	\N	301837981	Qiziltepa mahallasi, Bobur ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.264373+00	2026-08-31 17:20:31.264373+00
res-0249	"VALIANT ORIGINAL KOMFORT" mas`uliyati cheklangan jamiyati	\N	205864317	7-mitti tumani, 15-uy, 32-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.728122+00	2026-08-31 17:20:28.728122+00
res-0250	"REAL-TECHINVEST" xususiy korxonasi	\N	307361796	Yangiobod mahallasi, Amir Temur ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.821347+00	2026-08-31 17:20:28.821347+00
res-0251	"SALTEK" xususiy korxonasi	\N	305043837	E'zoz ko'chasi, 24-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.914668+00	2026-08-31 17:20:28.914668+00
res-0252	"SHAHRISABZ DURDONASI" oilaviy korxonasi	\N	302642774	Kunchiqar mahallasi, Sharshara ko'chasi, 103-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.009663+00	2026-08-31 17:20:29.009663+00
res-0289	"WESTBRIDGE INTERNATIONAL FOUNDATION EDUCATION" mas`uliyati cheklangan jamiyati	\N	312871754	Kunchiqar mahallasi, Ipak yo'li ko'chasi, 31-e-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.10308+00	2026-08-31 17:20:29.10308+00
res-0323	2-sonli oilaviy bolalar uyi	\N	308903404	Guliston mahallasi, Buyuk Ipak yo`li ko`chasi, 65-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.01891+00	2026-08-31 17:20:32.01891+00
res-0346	"ILM VA HUNAR AKADEMIYASI" mas`uliyati cheklangan jamiyati	\N	312701742	Ayridevol mahallasi, Ayridevol 1 ko'chasi, 65-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.032357+00	2026-08-31 17:20:35.032357+00
res-0360	"KELAJAK SCHOOL VA IT KLASTER HAMKORLIGIDAGI MAKTAB" mas`uliyati cheklangan jamiyati	\N	312247524	Paxtazor mahallasi, Mustaqillik ko`chasi, 8-uy, 1-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.125612+00	2026-08-31 17:20:35.125612+00
res-0361	"LEVEL UP QARSHI" mas`uliyati cheklangan jamiyati	\N	312611474	Shodlik mahallasi, Nasaf ko`chasi, 7/43-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.218936+00	2026-08-31 17:20:35.218936+00
res-0363	KO`KDALA TUMAN KELAJAK MARKAZI	\N	309627034	Oltin dala mahallasi, Obodturmush ko'chasi, 21-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.31236+00	2026-08-31 17:20:35.31236+00
res-0364	"INNOVA EDU-ON" nodavlat ta`lim muassasasi	\N	308965486	Mahallot mahallasi, Amir Temur ko'chasi, 78-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.405831+00	2026-08-31 17:20:35.405831+00
res-0365	"PROGRESS CENTER N" nodavlat ta`lim muassasasi	\N	305706034	6-mitti tumani, 1/23-uy, 21-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.498832+00	2026-08-31 17:20:35.498832+00
res-0366	"ABITURENT ORZUSI O'QUV MARKAZI" mas'uliyati cheklangan jamiyati	\N	307847808	Mustaqillik ko'chasi, 35-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.592165+00	2026-08-31 17:20:35.592165+00
res-0367	DEHQONOBOD TUMAN 3-SON TEXNIKUMI	\N	307122752	Nodira mahallasi, Furqat ko`chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.685622+00	2026-08-31 17:20:35.685622+00
res-0368	"KELAJAK SARI YOL MAKTABI" mas`uliyati cheklangan jamiyati	\N	311405984	Neftchi mahallasi, Mustaqillik ko'chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.781897+00	2026-08-31 17:20:35.781897+00
res-0369	"OXFORD SCHOOL IN KARSHI" nodavlat ta`lim muassasasi	\N	304269888	A.Navoiy mahallasi, Qumkishloq ko'chasi, 51-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.875567+00	2026-08-31 17:20:35.875567+00
res-0370	"MAYMANOQ PARVOZLARI" mas`uliyati cheklangan jamiyati	\N	308936331	Maymanoq mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:35.968828+00	2026-08-31 17:20:35.968828+00
res-0342	"NASAF ALFA QALQON" nodavlat ta`lim muassasasi	\N	301673095	Nuriston shaharchasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.062305+00	2026-08-31 17:20:36.062305+00
res-0344	"ABA SCHOOL 1999" mas`uliyati cheklangan jamiyati	\N	312863351	Olmazor mahallasi, Qiyoqli qishlog'i, 73-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.24859+00	2026-08-31 17:20:36.24859+00
res-0345	"BUSHROO LC" mas`uliyati cheklangan jamiyati	\N	312397124	Chulquvar mahallasi, 4 mavzesi, 3-uy, 36-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.341856+00	2026-08-31 17:20:36.341856+00
res-0358	CHIROQCHI TUMAN KELAJAK MARKAZI	\N	207123746	Chiroqchi mahallasi, Chiroqchi ko`chasi, 64-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.435086+00	2026-08-31 17:20:36.435086+00
res-0349	"NASAF STUDY" nodavlat ta`lim muassasasi	\N	303788496	Buyuk Turon mahallasi, Parvoz ko'chasi, 17-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.528635+00	2026-08-31 17:20:36.528635+00
res-0315	Qarshi kasb-hunarga o'qitish markazi	\N	207314706	A.Navoiy ko'chasi, 70a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.813088+00	2026-08-31 17:20:33.813088+00
res-0334	KASBI TUMAN 2-SON TEXNIKUMI	\N	200699786	Kasbi mahallasi, Kasbi qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.907181+00	2026-08-31 17:20:33.907181+00
res-0317	"MIROBOD EDUCATION" nodavlat ta`lim muassasasi	\N	304595404	Konchilar mahallasi, 1 mitti tuman dahasi, 92-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.095316+00	2026-08-31 17:20:34.095316+00
res-0297	"EMIR-EDU GOLD" mas`uliyati cheklangan jamiyati	\N	311039047	Yangi Mirishkor mahallasi, Jomiy ko'chasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.45064+00	2026-08-31 17:20:31.45064+00
res-0319	"BAHRIYEV LC" mas`uliyati cheklangan jamiyati	\N	311961777	Paxtazor-1 mahallasi, Islom Karimov ko'chasi, 52-a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.638331+00	2026-08-31 17:20:31.638331+00
res-0320	"ALIBOYEV SAYDULLA" xususiy korxonasi	\N	311512962	Balxiyak mahallasi, Guliston ko'chasi, 28-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.731846+00	2026-08-31 17:20:31.731846+00
res-0321	"QARSHI OQUV KURSI KOMBINATI"  nodavlat ta'lim muassasasi	\N	311263807	Paxtazor mahallasi, Xonobod ko'chasi, 19-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.825094+00	2026-08-31 17:20:31.825094+00
res-0322	"AZIZ" nomli ilmiy uquv ishlab ishlab tibbiyot markazi	\N	202354296	Uljaboev ko'chasi, 1а-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.91808+00	2026-08-31 17:20:31.91808+00
res-0356	"BOZOROV SCHOOL" mas`uliyati cheklangan jamiyati	\N	311264385	Obod mahallasi, O'zbekiston ko'chasi, 75-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.749826+00	2026-08-31 17:20:34.749826+00
res-0359	"FMS TRAINING" mas`uliyati cheklangan jamiyati	\N	310818541	Aralovul mahallasi, Jayxun ko'chasi, 3-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.93892+00	2026-08-31 17:20:34.93892+00
res-0392	"DIAMIR DIAMOND" oilaviy korxonasi	\N	309800524	Qorabayir mahallasi, Qorabayir ko'chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.74158+00	2026-08-31 17:20:37.74158+00
res-0394	"YUKSAK BILIM" mas`uliyati cheklangan jamiyati	\N	312841427	Choshtepa mahallasi, Sajdagoh ko'chasi, 39-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.932956+00	2026-08-31 17:20:37.932956+00
res-0396	"DREAM FOREVER" mas`uliyati cheklangan jamiyati	\N	310173974	Chinobod qishlog'i, Qishliq mahallasi, 37-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.02612+00	2026-08-31 17:20:38.02612+00
res-0377	KOSON TUMANI "KELAJAK" MARKAZI	\N	207120710	Pudina mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.119721+00	2026-08-31 17:20:38.119721+00
res-0397	"MUSLIM ALI AKADEMIYASI" nodavlat ta`lim muassasasi	\N	310372173	Nuriston mahallasi, Alisher Navoiy ko'chasi, 347-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.213133+00	2026-08-31 17:20:38.213133+00
res-0398	"INDUSTRY EDUCATION" mas`uliyati cheklangan jamiyati	\N	312598064	Aral mahallasi, Bodomzor ko'chasi, 41-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.306496+00	2026-08-31 17:20:38.306496+00
res-0399	"MAGISTR ACADEMY NEW" mas`uliyati cheklangan jamiyati	\N	312440862	Paxtazor-1 mahallasi, Paxtazor mitti tuman dahasi, 21-a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.39976+00	2026-08-31 17:20:38.39976+00
res-0400	"NEFT VA GAZ SANOAT TA`LIM" nodavlat ta`lim muassasasi	\N	307011542	Navoiy mahallasi, Amir Temur ko'chasi, 3-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.493143+00	2026-08-31 17:20:38.493143+00
res-0372	KITOB TUMANI 1-SONLI OILAVIY BOLALAR UYI	\N	308870993	Sharq yulduzi mahallasi, Rus qishlog'i, 1/39-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.679837+00	2026-08-31 17:20:38.679837+00
res-0373	"MEHRLI QALB ORZUSI"  3-sonli oilaviy bolalr uyi	\N	309041876	Istiqlol mahallasi, Merganchi ko'chasi, 25-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.773127+00	2026-08-31 17:20:38.773127+00
res-0374	"KITOB ZIYO INTELLEKT" o'quv-ilmiy ishlab chqarish markazi	\N	303748664	Istiqlol ko'chasi, 54-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.866538+00	2026-08-31 17:20:38.866538+00
res-0375	"ALIKHAN ABA SCHOOL" mas`uliyati cheklangan jamiyati	\N	312862733	Olmazor mahallasi, Qiyoqli qishlog'i, 73-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.960057+00	2026-08-31 17:20:38.960057+00
res-0395	"KO`HINUR ACADEMY" xususiy korxonasi	\N	310072318	Nishon mahallasi, A.Beruniy ko'chasi, 42-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.053474+00	2026-08-31 17:20:39.053474+00
res-0390	"ALFA  - STAR" nodavlat ta`lim muassasasi	\N	307139628	Qarshi mahallasi, Buyuk Turon ko'chasi, 23-uy, 14-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.146695+00	2026-08-31 17:20:39.146695+00
res-0378	KITOB TUMANI 18-SONLI OILAVIY BOLALAR UYI	\N	309599291	X.Olimjon mahallasi, Olmazor ko'chasi, 1/8/2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.240115+00	2026-08-31 17:20:39.240115+00
res-0413	"CLAS AAA" mas`uliyati cheklangan jamiyati	\N	311589764	Navro'z mahallasi, O'zbekiston ko'chasi, 80-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.333968+00	2026-08-31 17:20:39.333968+00
res-0380	"MAXMUDOVA LOBAR STEP BY STEP" oilaviy korxonasi	\N	309154291	Chorshanbe mahallasi, Temirchi qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.715122+00	2026-08-31 17:20:36.715122+00
res-0381	KITOB TUMAN 15-SONLI OILAVIY BOLALAR UYI	\N	309207374	Sharq Yulduzi mahallasi, 1-uy, 85-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.808091+00	2026-08-31 17:20:36.808091+00
res-0351	"QARSHI SALOMATLIK TEXNIKUMI" mas`uliyati cheklangan jamiyati	\N	310478372	Qavali mahallasi, Jayhun ko'chasi, 1/37-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.281844+00	2026-08-31 17:20:34.281844+00
res-0352	MIRISHKOR TUMAN 3-SON BOLALAR MUSIQA VA SAN`AT MAKTABI	\N	203593553	Pomuq mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.375032+00	2026-08-31 17:20:34.375032+00
res-0353	"EURO BUSINESS SCHOOL SHAHRISABZ" mas`uliyati cheklangan jamiyati	\N	310407824	Kesh mahallasi, Ipak yo'li ko'chasi, 167-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.468139+00	2026-08-31 17:20:34.468139+00
res-0354	G`UZOR TUMANI "KELAJAK" MARKAZI	\N	207122146	Tinchlik mahallasi, Usmon Nosir ko`chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.563393+00	2026-08-31 17:20:34.563393+00
res-0355	"WESTMINSTER BM" xususiy korxonasi	\N	309839664	Yuksalish mahallasi, Tinchlik ko'chasi, 561-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.656727+00	2026-08-31 17:20:34.656727+00
res-0388	"BAXTLI MAKON" mas`uliyati cheklangan jamiyati	\N	312651544	Qatag'an mahallasi, Navodil-2 ko'chasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.461598+00	2026-08-31 17:20:37.461598+00
res-0391	"QARSHI MAXSUS O`QUV" mas'uliyati cheklangan jamiyati	\N	308243024	O'zbekiston ko'chasi, 112a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.554877+00	2026-08-31 17:20:37.554877+00
res-0379	"IT CENTR NISHON" mas`uliyati cheklangan jamiyati	\N	312908626	Yoshlar diyori mahallasi, Payvasta ko`chasi, 7-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.648338+00	2026-08-31 17:20:37.648338+00
res-0427	Qarshi tuman 7-son bolalar musiqa va san'at maktabi	\N	207021991	Mustaqillik ko'chasi, 84-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.644204+00	2026-08-31 17:20:40.644204+00
res-0428	"KARSHI  INTERNATIONAL  BRIDGE" xususiy korxonasi	\N	308294816	Oqtepa mahallasi, Xonobod ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.737672+00	2026-08-31 17:20:40.737672+00
res-0429	"NURULSHOH" mas`uliyati cheklangan jamiyati	\N	311632315	Do'stlik mahallasi, O'zbekiston ko'chasi, 51-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.831044+00	2026-08-31 17:20:40.831044+00
res-0431	"MERCURIY SHIFO" mas`uliyati cheklangan jamiyati	\N	310620591	Cho'lquvar mahallasi, 4-mavzesi, 5/1a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.924674+00	2026-08-31 17:20:40.924674+00
res-0408	"SUNBULA LUXE TOURIZM" mas'uliyati cheklangan jamiyati	\N	304018075	O'zbekiston ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.018214+00	2026-08-31 17:20:41.018214+00
res-0432	"PURSUIT OF THE FUTURE" xususiy korxonasi	\N	306402207	Xonjon ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.1116+00	2026-08-31 17:20:41.1116+00
res-0433	"OLTIN-SAXOVAT" mas`uliyati cheklangan jamiyati	\N	304612073	Kishmishtepa mahallasi, Kunchiqar ko'chasi, 2 qator	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.204967+00	2026-08-31 17:20:41.204967+00
res-0406	QAMASHI TUMAN 4-SON TEXNIKUMI	\N	308758767	Olmazor mahallasi, O'lmas qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.485661+00	2026-08-31 17:20:41.485661+00
res-0403	"AVIZO AKADEMY" mas`uliyati cheklangan jamiyati	\N	311755992	Oydin mahallasi, Paxtazor mitti tuman dahasi, 4/94-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.29846+00	2026-08-31 17:20:41.29846+00
res-0404	"YOSH MUXBIRLAR" nodavlat ta`lim muassasasi	\N	308102017	Batosh mahallasi, Mustaqillik ko'chasi, 46-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.392343+00	2026-08-31 17:20:41.392343+00
res-0407	KITOB TUMAN KELAJAK MARKAZI	\N	207121812	Bo'ston mahallasi, Shodlik ko'chasi, 161-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.579352+00	2026-08-31 17:20:41.579352+00
res-0430	"YUKSAK AVLOD" mas`uliyati cheklangan jamiyati	\N	311607946	Chiroqchi mahallasi,  Chiroqchi ko`chasi , 133-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.673505+00	2026-08-31 17:20:41.673505+00
res-0411	"MARD GVARDIYACHILAR" nodavlat ta`lim muassasasi	\N	311481583	Nartichuqur mahallasi, Mustaqillik ko'chasi, 17-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.766891+00	2026-08-31 17:20:41.766891+00
res-0443	"EXPRESS TELECOM PAY" xususiy korxonasi	\N	312643134	Navbahor mahallasi, Zebuniso ko`chasi, 1/15-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.954195+00	2026-08-31 17:20:41.954195+00
res-0444	"HITRON SYSTEMS" mas`uliyati cheklangan jamiyati	\N	311644577	Cho'lquvar mahallasi, 4-mitti tuman dahasi, 4/47-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.047706+00	2026-08-31 17:20:42.047706+00
res-0445	"XADICHA DIAMOND LYUKS" mas`uliyati cheklangan jamiyati	\N	312305546	Dasht mahallasi, Dasht qishlog'i, 32-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.141462+00	2026-08-31 17:20:42.141462+00
res-0447	"TRADE LIKE A PRO" xususiy korxonasi	\N	312781597	Chorshanbe mahallasi, Chorshanbe qishlog'i, 459-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.329648+00	2026-08-31 17:20:42.329648+00
res-0415	"CITY STUDY CENTRE" nodavlat ta`lim muassasasi	\N	305102984	Zilolbuloq ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.520911+00	2026-08-31 17:20:39.520911+00
res-0383	"JIGJON" mas`uliyati cheklangan jamiyati	\N	312378392	Yangiturmush mahallasi, Xonobod yo'li ko'chasi, 19-k-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.994829+00	2026-08-31 17:20:36.994829+00
res-0384	"TO`G`RI YO`L SARI" oilaviy korxonasi	\N	308085316	Xo'jaguzar mahallasi, Furqat ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.088335+00	2026-08-31 17:20:37.088335+00
res-0386	10-SONLI OILAVIY BOLALAR UYI	\N	309124653	Xonyon mahallasi, Ittifoq ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.274819+00	2026-08-31 17:20:37.274819+00
res-0387	"SARVAR BEKMURADOVICH" xususiy korxonasi	\N	312879133	Bog'ishamol mahallasi, Mustaqillik ko`chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.368345+00	2026-08-31 17:20:37.368345+00
res-0422	"GRAND YO'LLANMASI" xususiy korxonasi	\N	308606630	Bo'ston mahallasi, Bo'ston ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.176501+00	2026-08-31 17:20:40.176501+00
res-0423	"BERLIOZ" mas`uliyati cheklangan jamiyati	\N	305510477	Neftchi mahallasi, El Ko'chasi, 1/17-b-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.270841+00	2026-08-31 17:20:40.270841+00
res-0424	"CHAMAN ASL KASB-HUNAR" nodavlat ta`lim muassasasi	\N	309703794	Pudina mahallasi, Pudina ko'chasi, 14-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.364352+00	2026-08-31 17:20:40.364352+00
res-0425	"ALIQULOV BAXODIR SAIDOVICH" nodavlat ta`lim muassasasi	\N	207111215	Paxtakor mahallasi, 38-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.457622+00	2026-08-31 17:20:40.457622+00
res-0426	KASBI TUMANI "KELAJAK" MARKAZI	\N	207121661	Mug'lon mahallasi, Amir Temir ko'chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.550949+00	2026-08-31 17:20:40.550949+00
res-0459	"KOCHKAK MOBILE" mas`uliyati cheklangan jamiyati	\N	311573420	Kuchkak mahallasi, Anjirzor ko'chasi, 72a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.456822+00	2026-08-31 17:20:43.456822+00
res-0460	"NISHON PORLOQ EDIAL" xususiy korxonasi	\N	309269274	Gulzor mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.55063+00	2026-08-31 17:20:43.55063+00
res-0461	"AZIZOV SULAYMON" mas'uliyati cheklangan jamiyati	\N	307387810	7-mitti tumani, 35-uy, 30-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.644126+00	2026-08-31 17:20:43.644126+00
res-0462	"IBROXIM GOLDIN" xususiy korxonasi	\N	311321045	Bog'ishamol mahallasi, 102-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.737383+00	2026-08-31 17:20:43.737383+00
res-0463	"GOLDEN SIM" mas`uliyati cheklangan jamiyati	\N	311052816	Guliston mahallasi, Oybek ko'chasi, 103-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.830688+00	2026-08-31 17:20:43.830688+00
res-0437	"CHILJUVIT-MOBIL" фирмаси	\N	301866314	Чилжувит кишлоги	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.017628+00	2026-08-31 17:20:44.017628+00
res-0438	"AZIZ MOBILE SYSTEMS" mas`uliyati cheklangan jamiyati	\N	303116270	B.Ergashev ko'chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.111852+00	2026-08-31 17:20:44.111852+00
res-0450	"MMM SEVEN MAIN SERVICE" mas`uliyati cheklangan jamiyati	\N	311681169	Chiroqchi mahallasi, Mustaqillik ko'chasi, 135-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.205202+00	2026-08-31 17:20:44.205202+00
res-0442	"NASIBA ZOKIROVNA" xususiy korxonasi	\N	303446344	Mustaqillik ko'chasi, 7-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.298338+00	2026-08-31 17:20:44.298338+00
res-0439	"KUXI SAMOI NUR" хусусий фирмаси	\N	301562677	Камаши кишлоги	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.392164+00	2026-08-31 17:20:44.392164+00
res-0441	"PRODIGY MOBILE" mas`uliyati cheklangan jamiyati	\N	312596565	Xon-tepa mahallasi, Yangi Hayot ko'chasi, 34-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.485141+00	2026-08-31 17:20:44.485141+00
res-0472	"SOHA KOMFORT SERVIS" mas`uliyati cheklangan jamiyati	\N	303100632	Darvozatutak mahallasi, Vatan ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.581955+00	2026-08-31 17:20:44.581955+00
res-0474	"OLD MAKRO SIM" mas`uliyati cheklangan jamiyati	\N	310145193	Oydin mahallasi, Paxtazor mavzesi, 51-uy, 16-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.768631+00	2026-08-31 17:20:44.768631+00
res-0475	"KOPEYKA SM" mas`uliyati cheklangan jamiyati	\N	308770255	Bog'ishamol mahallasi, Xonjon ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.861813+00	2026-08-31 17:20:44.861813+00
res-0476	"ILHOM VA SHIRIN" xususiy korxonasi	\N	306416520	Jo'ra Husenov ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.955344+00	2026-08-31 17:20:44.955344+00
res-0477	"EVRO KOMFORT" xususiy korxonasi	\N	205304442	Uychilik mahallasi, Olmazor ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.048692+00	2026-08-31 17:20:45.048692+00
res-0478	"SOLIHA 666" xususiy korxonasi	\N	311727164	Nodira mahallasi, Guliston qishlog'i, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.142266+00	2026-08-31 17:20:45.142266+00
res-0449	"ISHONCH" mas`uliyati cheklangan jamiyati	\N	200695429	Charmgar mahallasi, Sayilgoh ko'chasi, 29-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.518655+00	2026-08-31 17:20:42.518655+00
res-0451	"DIGITAL GEN" mas`uliyati cheklangan jamiyati	\N	312450201	Shoyxuja mahallasi, Shoyxuja qishlog'i, 10-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.612069+00	2026-08-31 17:20:42.612069+00
res-0418	"ZIYO-NUR ILM MARKAZI" nodavlat ta`lim muassasasi	\N	306145219	Ayronchi qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.804178+00	2026-08-31 17:20:39.804178+00
res-0419	KASBI TUMAN 3-SON TEXNIKUMI	\N	308815996	Nurobod mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.896915+00	2026-08-31 17:20:39.896915+00
res-0420	"AVITSENNA SCHOOL" nodavlat ta`lim muassasasi	\N	306830822	Kunchiqar mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.989883+00	2026-08-31 17:20:39.989883+00
res-0454	"AHMEDOV GROUP" xususiy korxonasi	\N	303106039	Navoiy mahallasi, Ustozlar ko'chasi, 146-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.988608+00	2026-08-31 17:20:42.988608+00
res-0455	"TEMURBEK KOSON" mas`uliyati cheklangan jamiyati	\N	312736310	Mug'jagul mahallasi, Kuxna qal'a ko'chasi, 23-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.082142+00	2026-08-31 17:20:43.082142+00
res-0456	"SOLIHA UMAR MADINA" mas`uliyati cheklangan jamiyati	\N	312817938	Yoshlik mahallasi, Behzod ko'chasi, 170-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.175935+00	2026-08-31 17:20:43.175935+00
res-0457	"ZINNURA MAXMADALIYEVA" xususiy korxonasi	\N	304968176	Gulshan ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.269118+00	2026-08-31 17:20:43.269118+00
res-0458	"KAMUNA CITY" xususiy korxonasi	\N	310061362	Xumo mahallasi, Kulchiyal ko'chasi, 18-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.362882+00	2026-08-31 17:20:43.362882+00
res-0465	"CHAMAN QULAY XIZMAT" mas`uliyati cheklangan jamiyati	\N	312387019	Bog'obod mahallasi, Tuqmang'it qishlog'i, 372-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.544484+00	2026-08-31 17:20:46.544484+00
res-0466	"ALIQULOV ASILBEK AZAMOVICH" oilaviy korxonasi	\N	306754537	Choshtepa mahallasi, Choshtepa ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.638083+00	2026-08-31 17:20:46.638083+00
res-0467	"EL NIGOH" xususiy korxonasi	\N	305118575	Temir yo'lchi mahallasi, Iftixor ko'chasi, 2/3-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.731443+00	2026-08-31 17:20:46.731443+00
res-0468	"A`ZAM BREND ALOQA" mas`uliyati cheklangan jamiyati	\N	309752370	Otchopar mahallasi, Denov ko'chasi, 42a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.824972+00	2026-08-31 17:20:46.824972+00
res-0469	"IMRON IBROHIM KAMOLA" mas`uliyati cheklangan jamiyati	\N	311506914	Nartibaland mahallasi, Nasaf ko'chasi, 14-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.91804+00	2026-08-31 17:20:46.91804+00
res-0470	"ZIYOVIDDIN DIN NURI" mas`uliyati cheklangan jamiyati	\N	309167694	Bog'ishamol mahallasi, Xonjon ko'chasi, 243-dukon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.011147+00	2026-08-31 17:20:47.011147+00
res-0471	"ID-PAY" mas`uliyati cheklangan jamiyati	\N	311909830	Bunyodkor mahallasi, Sayqal ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.104361+00	2026-08-31 17:20:47.104361+00
res-0501	"SNZ BREND" mas`uliyati cheklangan jamiyati	\N	311079797	Tinchlik mahallasi, Xalqayo'li ko'chasi, 26-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.198127+00	2026-08-31 17:20:47.198127+00
res-0502	"YUSUF S DREAM" mas`uliyati cheklangan jamiyati	\N	312910221	Buyuk Turon mahallasi, Xulkar ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.291113+00	2026-08-31 17:20:47.291113+00
res-0503	"JALILOV IBROHIM MOBILE SERVICE" mas`uliyati cheklangan jamiyati	\N	312218076	Xabarlik mahallasi, X.Dexlavi ko'chasi, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.384375+00	2026-08-31 17:20:47.384375+00
res-0504	"SUXROB MAQSUDOVICH" mas`uliyati cheklangan jamiyati	\N	303102036	Mustaqillik ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.482646+00	2026-08-31 17:20:47.482646+00
res-0505	"ABDULAZIZ FURQATOVICH" mas`uliyati cheklangan jamiyati	\N	309424106	Rovot mahallasi, Amir Temur ko'chasi, 77-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.576237+00	2026-08-31 17:20:47.576237+00
res-0506	"QOVCHIN KOMFORT" mas`uliyati cheklangan jamiyati	\N	312487455	Qovchin mahallasi, Qovchin qishlog`i, 12/1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.669524+00	2026-08-31 17:20:47.669524+00
res-0486	"SOXIBA ASHUROVA" mas`uliyati cheklangan jamiyati	\N	311892744	Mustaqillik mahallasi, Mustaqillik ko'chasi, 491-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.889811+00	2026-08-31 17:20:45.889811+00
res-0507	"MUNIS ALO XIZMAT" mas`uliyati cheklangan jamiyati	\N	312790475	O'zbekiston mahallasi, 1-Soxil ko'chasi, 438-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.76301+00	2026-08-31 17:20:47.76301+00
res-0508	"ALOQA MEGA GROUP" mas`uliyati cheklangan jamiyati	\N	312788262	Bog'obod mahallasi, Tuqmangit qishlog'i, 32-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.856141+00	2026-08-31 17:20:47.856141+00
res-0480	"KARYER INVEST GOLD" mas`uliyati cheklangan jamiyati	\N	312354716	Mug'jagul mahallasi, Shahriobod ko'chasi, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.329192+00	2026-08-31 17:20:45.329192+00
res-0481	"ELSHOD MOBILE" mas`uliyati cheklangan jamiyati	\N	303111555	Kat mahallasi, Rayxon ko'chasi, 26-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.422485+00	2026-08-31 17:20:45.422485+00
res-0482	"OMAD FAYZ 7777" mas`uliyati cheklangan jamiyati	\N	309568433	Qavali mahallasi, Jayxun ko'chasi, 1/18-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.516142+00	2026-08-31 17:20:45.516142+00
res-0485	"MK-ERGASH" mas`uliyati cheklangan jamiyati	\N	310131322	Chiyal mahallasi, Mirtemir ko'chasi, 238-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.796656+00	2026-08-31 17:20:45.796656+00
res-0453	"BILOL SERVIC" mas`uliyati cheklangan jamiyati	\N	311292233	Xo'jaki mahallasi, Zarhal-1 ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.895136+00	2026-08-31 17:20:42.895136+00
res-0487	"KOSON BREND" mas`uliyati cheklangan jamiyati	\N	310324628	Mug'jagul mahallasi, Nasaf ko'chasi, 38-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.983181+00	2026-08-31 17:20:45.983181+00
res-0488	"AKTIV MOBIL ALOQA" xususiy korxonasi	\N	303703768	Bunyodkorlik ko'chasi, 31-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.076491+00	2026-08-31 17:20:46.076491+00
res-0490	"TAYYIB MOBILE LINE" mas`uliyati cheklangan jamiyati	\N	312893229	Chaqar mahallasi, Gubdinarik ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.263542+00	2026-08-31 17:20:46.263542+00
res-0491	"ASLAN HAMKOR AKOBIR" mas`uliyati cheklangan jamiyati	\N	310527255	Mustaqillik mahallasi, Neftchilar ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.357477+00	2026-08-31 17:20:46.357477+00
res-0492	"SUVANOVA 1971 MOBILE" mas`uliyati cheklangan jamiyati	\N	311446142	Qo'rg'oncha mahallasi, Qator-tut ko'chasi, 15-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.450912+00	2026-08-31 17:20:46.450912+00
res-0494	"BRAND O" xususiy korxonasi	\N	306525686	Kunchiqar mahallasi, 3-mitti tumani, Koinot ko'chasi, 12-uy, 7-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.162367+00	2026-08-31 17:20:49.162367+00
res-0496	"NEW BONA INTENTIO" mas`uliyati cheklangan jamiyati	\N	312507982	Paxtazor-1 mahallasi, A.Anvarov ko`chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.349985+00	2026-08-31 17:20:49.349985+00
res-0497	"ONLY MOBILE SERVICE" mas`uliyati cheklangan jamiyati	\N	303099017	Navro'z mahallasi, Navro`z ko`chasi, 33-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.443136+00	2026-08-31 17:20:49.443136+00
res-0519	"YO'LDOSHOV-DILMUROD" xususiy korxonasi	\N	307002632	Ko'kdala qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.536381+00	2026-08-31 17:20:49.536381+00
res-0515	"NURBEK GROW MEDIA" mas`uliyati cheklangan jamiyati	\N	310371665	Chiroqchi mahallasi, Dilovar ko'chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.62957+00	2026-08-31 17:20:49.62957+00
res-0499	"FAZLI SARCHASHMASI" mas`uliyati cheklangan jamiyati	\N	311450487	Fazli mahallasi, Soxil ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.722726+00	2026-08-31 17:20:49.722726+00
res-0530	"DAVRON AND ZEBUNISO" mas`uliyati cheklangan jamiyati	\N	312152359	Otchopar mahallasi, Mustaqillik ko'chasi, 23-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.816096+00	2026-08-31 17:20:49.816096+00
res-0531	"BUXORO MOBILE DINARA" mas'uliyati cheklangan jamiyati	\N	308018190	Mustaqillik mahallasi, Xusnobod ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.909312+00	2026-08-31 17:20:49.909312+00
res-0532	"FAYZULLAYEV MUSTOFA" mas`uliyati cheklangan jamiyati	\N	312192816	Bog'ishamol mahallasi, Xonjon ko'chasi, 102-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.002685+00	2026-08-31 17:20:50.002685+00
res-0533	"MEGA POINT" mas`uliyati cheklangan jamiyati	\N	312880807	Navbaxor mahallasi, Navro'z ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.096094+00	2026-08-31 17:20:50.096094+00
res-0535	"FIRE SYSTEMS TECHNOLOGY" xususiy korxonasi	\N	303341468	Mahallot ko'chasi, 4-uy, 1-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.282595+00	2026-08-31 17:20:50.282595+00
res-0536	"OFSET BRAND" mas`uliyati cheklangan jamiyati	\N	312861362	Kunchiqar mahallasi, Nurbog' ko'chasi, 232А-uy, 15-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.375803+00	2026-08-31 17:20:50.375803+00
res-0537	"CONNECT SUPER PAYNET" xususiy korxonasi	\N	301851364	U.Yusupov ko'chasi, 24-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.469119+00	2026-08-31 17:20:50.469119+00
res-0538	"SAMXIOME" xususiy korxonasi	\N	309038404	Qirg'iz qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.562356+00	2026-08-31 17:20:50.562356+00
res-0510	"IQBOLLI MATBUOT" mas`uliyati cheklangan jamiyati	\N	310636524	Beglar mahallasi, Amir Temur ko'chasi, 2/19-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.042892+00	2026-08-31 17:20:48.042892+00
res-0511	"FINBRIDGE KARSHI" mas`uliyati cheklangan jamiyati	\N	312887789	Nuriston mahallasi, 3-mitti tumani, 24-uy, 12-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.136196+00	2026-08-31 17:20:48.136196+00
res-0512	"STAR FAZLIDDIN FAYZ" mas`uliyati cheklangan jamiyati	\N	307085585	G'afur G'ulom mahallasi, 7-uy, 1-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.229738+00	2026-08-31 17:20:48.229738+00
res-0513	"YASMINA XADICHA NIGORA" mas`uliyati cheklangan jamiyati	\N	312636284	Mugjagul mahallasi, Kuxna qal'a ko'chasi, 21-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.323125+00	2026-08-31 17:20:48.323125+00
res-0514	"KOMFORT MOBILE SYSTEMS" mas`uliyati cheklangan jamiyati	\N	303107314	Nasaf mahallasi, Qizil machit ko'chasi, 1-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.416373+00	2026-08-31 17:20:48.416373+00
res-0516	"SERVIS XUJAOBOD 616" mas`uliyati cheklangan jamiyati	\N	311037611	Chorvador mahallasi, Boychibor ko'chasi, 20-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.509601+00	2026-08-31 17:20:48.509601+00
res-0500	"IT ALL STARTS" mas`uliyati cheklangan jamiyati	\N	312528498	Xonyon mahallasi, Dasht qishlog`i, 75-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.602874+00	2026-08-31 17:20:48.602874+00
res-0517	"NEW MMM MALIKA" mas`uliyati cheklangan jamiyati	\N	312433388	G'allachi mahallasi, G'allachi qishlog'i, 102-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.696127+00	2026-08-31 17:20:48.696127+00
res-0518	"IRODA PAYMENT" mas`uliyati cheklangan jamiyati	\N	312795745	Yashil Diyor mahallasi, Ibratli ko`chasi, 13-a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.789788+00	2026-08-31 17:20:48.789788+00
res-0520	"NEW FEES" mas`uliyati cheklangan jamiyati	\N	312508388	Bo'ston mahallasi, R.Xamraev ko'chasi, 28A-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.882834+00	2026-08-31 17:20:48.882834+00
res-0498	"ALOQA TA'MIR TA'MINOT" mas'uliyati cheklangan jamiyati	\N	203724562	Feruz ko'chasi, 9-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:48.975914+00	2026-08-31 17:20:48.975914+00
res-0521	"SIRIUS" xususiy korxonasi	\N	202861853	Ibn Sino ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.069403+00	2026-08-31 17:20:49.069403+00
res-0523	"SORA BARATOVNA" mas`uliyati cheklangan jamiyati	\N	309062534	Komilon mahallasi, Tupxona ko'chasi, 8-uy, 1-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.777864+00	2026-08-31 17:20:51.777864+00
res-0524	"FOZIL BARAKA SERVIS" mas`uliyati cheklangan jamiyati	\N	303098968	Qo'rg'oncha mahallasi, Qatortut ko'chasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.87104+00	2026-08-31 17:20:51.87104+00
res-0526	"NUMBER ONE MOBILE" mas`uliyati cheklangan jamiyati	\N	311771697	Istiqlol mahallasi, Mirza Tursunzoda ko'chasi, 28-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.057856+00	2026-08-31 17:20:52.057856+00
res-0527	"B E K  MOBILE SERVIS" mas`uliyati cheklangan jamiyati	\N	305354394	Xonjon ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.151834+00	2026-08-31 17:20:52.151834+00
res-0528	"GULI ASILABONU" xususiy korxonasi	\N	307925433	Ali Qushchi mahallasi, Katta yo'l ko'chasi, 123a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.247052+00	2026-08-31 17:20:52.247052+00
res-0529	"FOZILBEK AKSES" xususiy korxonasi	\N	309502444	Qirg'iz qishlog'i, Qirg'iz mahallasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.340425+00	2026-08-31 17:20:52.340425+00
res-0559	"AS PAYMENTS CAPITAL" mas`uliyati cheklangan jamiyati	\N	310060879	Do'stlik mahallasi, Manit ko'chasi, 10-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.433721+00	2026-08-31 17:20:52.433721+00
res-0560	"SMART MONEY FLOW" mas`uliyati cheklangan jamiyati	\N	311386993	Mang'it mahallasi, Otchopar qishlog'i, 72-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.5269+00	2026-08-31 17:20:52.5269+00
res-0561	"INVESTOR FAMILY 777" mas`uliyati cheklangan jamiyati	\N	312857904	Oqtepa F.Xujaev mahallasi, Sultonobod ko'chasi, 29-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.620374+00	2026-08-31 17:20:52.620374+00
res-0563	"QAYQUBOT TURON ZAMIN " mas`uliyati cheklangan jamiyati	\N	310243285	Jambul mahallasi, Jambul ko'chasi, 85-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.807421+00	2026-08-31 17:20:52.807421+00
res-0562	"NEMATILLA SATTOROV" xususiy korxonasi	\N	308969401	Paxtaobod mahallasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.713893+00	2026-08-31 17:20:52.713893+00
res-0567	"JONIBEK STUDIO" oilaviy korxonasi	\N	312480268	Chiyal mahallasi, Xusayin Boyqaro ko'chasi, 23-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.087396+00	2026-08-31 17:20:53.087396+00
res-0568	"HISOR MIX KAPITAL" xususiy korxonasi	\N	311336801	Xalqlar Do'stligi mahallasi, Xalqlar Do'stligi ko'chasi, 423-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.180863+00	2026-08-31 17:20:53.180863+00
res-0569	"FIRDAVS XO`JAMURODOV 777" xususiy korxonasi	\N	308914557	Islom Karimov ko`chasi, 376-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.2741+00	2026-08-31 17:20:53.2741+00
res-0540	"NAFISA INVEST GOLD" mas`uliyati cheklangan jamiyati	\N	312432190	Do'stlik mahallasi, Usmon Nosir ko'chasi, 5-uy, 4-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.749112+00	2026-08-31 17:20:50.749112+00
res-0541	"AZAMATBEK GOLD BUSINESS" oilaviy korxonasi	\N	312672566	Obodyurt mahallasi, Yulduz ko'chasi, 16-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.842352+00	2026-08-31 17:20:50.842352+00
res-0542	"ZBZ NEW" mas`uliyati cheklangan jamiyati	\N	312433847	Mag'zon mahallasi, Jizza ko'chasi, 92-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.935892+00	2026-08-31 17:20:50.935892+00
res-0564	"DAUR GRAND INVEST 99" xususiy korxonasi	\N	310201574	Jambul mahallasi, Sahovat ko'chasi, 282-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.900972+00	2026-08-31 17:20:52.900972+00
res-0543	"YASMINA STORE" xususiy korxonasi	\N	312473821	Xontepa mahallasi, Shukrona ko'chasi, 1/32-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.029668+00	2026-08-31 17:20:51.029668+00
res-0575	"CHAROS MAXSUS ALOQA UNIVERSAL SERVIS" xususiy korxonasi	\N	304336163	Sarbon ko'chasi, 14-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.834126+00	2026-08-31 17:20:53.834126+00
res-0545	"MAXBUBA SHUKUROVNA" mas`uliyati cheklangan jamiyati	\N	311826208	Xujaguzar mahallasi, Alisher Navoiy ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.21664+00	2026-08-31 17:20:51.21664+00
res-0546	"QUVONCHLI KUNLAR SHIRINLIGI" xususiy korxonasi	\N	311341298	Apardi mahallasi, Qushtepa qishlog`i, 221-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.309889+00	2026-08-31 17:20:51.309889+00
res-0547	"BEHRUZBEK MOBEL" mas`uliyati cheklangan jamiyati	\N	307903570	Choshtepa mahallasi, Choshtepa ko`chasi, 7-qator, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.403414+00	2026-08-31 17:20:51.403414+00
res-0548	"AZIZBEK PAYME" mas`uliyati cheklangan jamiyati	\N	312669609	Qarliqxona mahallasi, Maxmud Qoshqariy ko`chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.49717+00	2026-08-31 17:20:51.49717+00
res-0549	"OLTIN YELKAN" mas`uliyati cheklangan jamiyati	\N	312522507	Mugjagul mahallasi, Shaxriobod ko'chasi, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.591058+00	2026-08-31 17:20:51.591058+00
res-0550	"ZARIPOVA KOMILA" xususiy korxonasi	\N	312432856	Shoxbekat mahallasi, Istibol X.Nosirova ko'chasi, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.684436+00	2026-08-31 17:20:51.684436+00
res-0554	"MISS ZILOLA MOBILE" mas`uliyati cheklangan jamiyati	\N	312303779	Beshbuloq mahallasi, Olim Xo'jayev ko'chasi, 119-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.58236+00	2026-08-31 17:20:54.58236+00
res-0555	"NATIONAL SERVIC" mas`uliyati cheklangan jamiyati	\N	309110742	Fazli mahallasi, Alisher Navoiy ko`chasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.676479+00	2026-08-31 17:20:54.676479+00
res-0558	"VOHA MOBILE SERVIS" xususiy korxonasi	\N	312066551	Ulug'bek mahallasi, O'zbekiston ko'chasi, 16-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.86336+00	2026-08-31 17:20:54.86336+00
res-0557	"ALOQA VOSITACHI" mas`uliyati cheklangan jamiyati	\N	312119319	Xumo mahallasi, Rayonobod qishlog'i, 247-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.956852+00	2026-08-31 17:20:54.956852+00
res-0589	"BAHROM RASHOD HAMKOR" mas`uliyati cheklangan jamiyati	\N	311667650	Shirinobod mahallasi, Kosiblar ko'chasi, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.050182+00	2026-08-31 17:20:55.050182+00
res-0590	"QASHQADARYOINFO" mas`uliyati cheklangan jamiyati	\N	311965383	Nuriston mahallasi, 3 mavzesi, 23-uy, 15-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.143739+00	2026-08-31 17:20:55.143739+00
res-0591	"PROGRESS CONSULT COMPANY" mas'uliyati cheklangan jamiyati	\N	307579476	X.Do'stligi mahallasi, Rizvontepa ko'chasi, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.237234+00	2026-08-31 17:20:55.237234+00
res-0592	"ANIS BIZNES CENTER" oilaviy korxonasi	\N	311312333	Xontepa mahallasi, Buyuk Ipak yo'li ko'chasi, 42-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.330399+00	2026-08-31 17:20:55.330399+00
res-0593	"MUXTARAM ARZIQULOVA" oilaviy korxonasi	\N	309665914	Pachkamar mahallasi, Qorakamar qishlog`i, 855-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.423615+00	2026-08-31 17:20:55.423615+00
res-0594	"BAXODIR XAYITOVICH" oilaviy korxonasi	\N	312707575	Alisher Navoiy mahallasi, Mustaqillik ko`chasi, 197-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.516799+00	2026-08-31 17:20:55.516799+00
res-0596	"MUXRIDDIN 0111" mas`uliyati cheklangan jamiyati	\N	310535680	Obod mahallasi, O'zbekiston ko'chasi, 48-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.703168+00	2026-08-31 17:20:55.703168+00
res-0598	"IMONA-XON" mas`uliyati cheklangan jamiyati	\N	312226329	Beglar mahallasi, Chaman ko'chasi, 7-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.796472+00	2026-08-31 17:20:55.796472+00
res-0600	"SOG'LOM ZURRIYOT" oilaviy korxonasi	\N	308584139	Xalqobod mahallasi, Xalqobod qishlog'i, 423-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.88954+00	2026-08-31 17:20:55.88954+00
res-0586	"AKMAL-PORLOQ MOBIL" xususiy korxonasi	\N	301891933	Madaniyat qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.982578+00	2026-08-31 17:20:55.982578+00
res-0571	"UNIVERSAL DILLER QARSHI" mas`uliyati cheklangan jamiyati	\N	311741970	Batosh mahallasi, Yangi hayot ko'chasi, 29-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.46093+00	2026-08-31 17:20:53.46093+00
res-0572	"SHAVKAT ONLAYN UNIVERSAL" mas`uliyati cheklangan jamiyati	\N	311580760	Do'ltali mahallasi, Do'ltali qishlog'i, 116-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.55419+00	2026-08-31 17:20:53.55419+00
res-0573	"KARSHI FAST  PAYMENT" mas'uliyati cheklangan jamiyati	\N	308547927	Paxtazor mitti tumani, 11a-uy, 10-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.647364+00	2026-08-31 17:20:53.647364+00
res-0574	"NEW -IMEI -TRADE" xususiy korxonasi	\N	307403917	Talabalar ko'chasi, 61-uy, 12-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.740733+00	2026-08-31 17:20:53.740733+00
res-0606	"YOSH KOMPYUTERCHILAR" xususiy korxonasi	\N	308674359	Pillakashlik mahallasi, Ipak Yo'li ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.54647+00	2026-08-31 17:20:56.54647+00
res-0607	"TUR INVEST SY" mas`uliyati cheklangan jamiyati	\N	311229561	Jambul mahallasi, Sahovat ko'chasi, 369-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.639615+00	2026-08-31 17:20:56.639615+00
res-0577	"SPECIAL EXPRESS PAYMENTS" mas`uliyati cheklangan jamiyati	\N	311823021	Mug'lon mahallasi, Mug'lon ko'chasi, 14-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.020942+00	2026-08-31 17:20:54.020942+00
res-0579	"EXPERTS HOUSE" mas'uliyati cheklangan jamiyati	\N	305240995	Gulobod mahallasi,	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.114439+00	2026-08-31 17:20:54.114439+00
res-0556	"SAMAD BOBO BARAKA" mas`uliyati cheklangan jamiyati	\N	311427861	Xonyon mahallasi, Dasht qishlog'i, 20-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.207698+00	2026-08-31 17:20:54.207698+00
res-0580	"THE STAR OF MOBILE COMMUNICATIONS" xususiy korxonasi	\N	311713087	Bog'obod mahallasi, Uzunnavo qishlog'i, 426a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.300934+00	2026-08-31 17:20:54.300934+00
res-0552	"KIFTI-OB ALOQA SERVIS" xususiy korxonasi	\N	303762387	Cho'lpon ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.394413+00	2026-08-31 17:20:54.394413+00
res-0553	"THE ATTRACTION OF MOBILE COMMUNICATION" xususiy korxonasi	\N	303164141	3-mitti tumani, 24-uy, 12-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.487679+00	2026-08-31 17:20:54.487679+00
res-0180	"BYME" mas`uliyati cheklangan jamiyati	\N	311953311	Mang'it mahallasi, Qashqadaryo ko'chasi, 67-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.041334+00	2026-08-31 17:20:58.041334+00
res-0132	"KHABEER IT-HUB" MAS'ULIYATI CHEKLANGAN JAMIYAT	ALISHEROV MUXIDDIN XUSNIDDIN O‘G‘LI	311938241	Qashqadaryo viloyati, Qarshi shahar, Oydin MFY, Paxtazor mavzesi 51 uy 7-xonadon	0	0.00	0.00	REMOVED	\N	2025-02-28	{}	{}	{}	\N	+998 90 110-01-13	\N	\N	\N	Qarshi	Ta`lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.760981+00	2026-08-31 17:20:57.760981+00
res-0089	"CHAMANGUL EDU SCHOOL" NTM	Chamangul Yuldasheva Xakkulovna	308938978	Qarshi sh., Otchopar mahallasi, Mustaqillik ko`chasi, 16/14-uy	0	0.00	0.00	REMOVED	\N	2023-04-18	{}	{}	{}	\N	+998 91 955-82-82	\N	\N	\N	Qarshi	Ta`lim	Ta'lim sohasidagi yordamchi faoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.134672+00	2026-08-31 17:20:58.134672+00
res-0188	"THE INTER MEDIA CENTER" mas`uliyati cheklangan jamiyati	\N	306286921	O'zbekiston mahallasi, Mustaqillik ko`chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.321633+00	2026-08-31 17:20:58.321633+00
res-0584	"PALANC" хусусий фирмаси	\N	203738956	Умаров 18	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.200452+00	2026-08-31 17:20:57.200452+00
res-0213	"AZIZ FIRDAVS SHABNAM" mas'uliyati cheklangan jamiyati	\N	308088525	Amir Temur ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.416106+00	2026-08-31 17:20:58.416106+00
res-0244	"TA'LIM SIFAT INVEST" xususiy korxonasi	\N	305649303	3-mitti tumani, 67-uy, 5-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.509359+00	2026-08-31 17:20:58.509359+00
res-0602	"HURUFE" mas`uliyati cheklangan jamiyati	\N	310212173	Paxtazor mahallasi, Paxtazor mavzesi, 735-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.17165+00	2026-08-31 17:20:56.17165+00
res-0603	"BIZNES MASLAK MAKONI" mas`uliyati cheklangan jamiyati	\N	302213294	Mustaqillik ko'chasi, 3-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.266551+00	2026-08-31 17:20:56.266551+00
res-0604	"AKROM DIAMOND" xususiy korxonasi	\N	311940368	Torqopchig'ay mahallasi, Torqopchig'ay-Bo'ztepa avtomobil yo'li ko'chasi, 265-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.360142+00	2026-08-31 17:20:56.360142+00
res-0605	"SHIRINA-MALIK" oilaviy korxonasi	\N	310766204	Oydin mahallasi, Paxtazor mavzesi, 56-uy, 30-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.453403+00	2026-08-31 17:20:56.453403+00
res-0371	18-sonli bolalar musiqa va san'at maktabi	\N	206851087	Yangiobod mahallasi, A.Temur ko'chasi, 71-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.07415+00	2026-08-31 17:20:59.07415+00
res-0058	"ELDORBEK VA IMONAXON"MCHJ	AVAZOVA OZODAXON ILHOM QIZI	309515428	Qashqadaryo viloyati, Qamashi tumani, Qamashi shahri Qoratepa mahallasi, Kichikdo'stberdi, 47-uy	0	0.00	0.00	ACTIVE	2022-04-29	2026-05-20	{}	{"Problem: Yana boshqa firma ochib IT ta'lim uchun alohida kredit imtiyozini olmoqchi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.260591+00	2026-08-31 17:20:59.260591+00
res-0027	"QAMASHI EDUCATION 777" MCHJ	URALOV NURBEK ESHMO'MINOVICH	311146563	Qashqadaryo viloyati, Qamashi tumanii, Qamashi shahri O‘zbekiston mahallasi, Olmazor ko'chasi, 171-uy	1	0.00	0.00	ACTIVE	2024-03-04	2024-03-16	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.353967+00	2026-08-31 17:20:59.353967+00
res-0610	"NANO SOFT SMART" mas`uliyati cheklangan jamiyati	\N	310255800	Uychilik mahallasi, Ipak yo'li ko'chasi, 358-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.919681+00	2026-08-31 17:20:56.919681+00
res-0582	"ZARIPOV BOBUR" xususiy korxonasi	\N	305100124	Paxtaobod ko'chasi, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.012982+00	2026-08-31 17:20:57.012982+00
res-0583	"ALLONOV" mas`uliyati cheklangan jamiyati	\N	311841879	Ertepa mahallasi, Yertepa qishlog'i, 12-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.107071+00	2026-08-31 17:20:57.107071+00
res-0585	"KESH UMIDJON" oilaviy korxonasi	\N	305243571	Kulollik mahallasi, Qunduzak ko`chasi, 43-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.294+00	2026-08-31 17:20:57.294+00
res-0599	"STUDIO MIRISHKOR" mas`uliyati cheklangan jamiyati	\N	312781770	Yangi Mirishkor mahallasi, Faxriylar ko'chasi, 14-uy, 2H-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.387383+00	2026-08-31 17:20:57.387383+00
res-0588	"STAR PAYNET" xususiy korxonasi	\N	307249292	Ali Qushchi mahallasi, Muqumiy ko'chasi, 25-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.480685+00	2026-08-31 17:20:57.480685+00
res-0587	"AKRAMOV AMIRXON" xususiy korxonasi	\N	305064597	Buyuk ipak yo'li ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.574201+00	2026-08-31 17:20:57.574201+00
res-0176	"NEW INFRASTRUCTURE INVEST" mas`uliyati cheklangan jamiyati	\N	311198056	Chaman mahallasi, Chovkay mavzesi, 13-uy, 9-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:20.306638+00	2026-08-31 17:20:20.306638+00
res-0021	«MARS ELEKTRON TEXNIKA» MCHJ	NIYOZOV ZOKIRJON RAYIMOVICH	302568138	Qashqadaryo viloyati, Shahrisabz sh. Xabarlik mahallasi, Sheroziy ko'chasi, 1-uy	18	0.00	0.00	ACTIVE	2013-04-05	2023-03-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 97 385-00-27	\N	\N	\N	Shahrisabz	Litsenziyalarni sotish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.947679+00	2026-08-31 17:20:57.947679+00
res-0108	"COMFIDO" MCHJ	VALIYEV MA’RUFJON MAMADI O‘G‘LI	311699785	Qashqadaryo vil Shahrisabz tumani, Mevazor MFY, Mo'minobod qishlog'I, 677-uy	0	0.00	0.00	REMOVED	\N	2024-12-28	{}	{}	{}	\N	+998 33 892-07-70	\N	\N	\N	Shahrisabz	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.287196+00	2026-08-31 17:20:15.287196+00
res-0493	"MOBIL SERVES YANGIOBOD" mas'uliyati cheklangan jamiyati	\N	307572430	Yangiobod ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.856452+00	2026-08-31 17:21:00.856452+00
res-0279	"HAVASOBOD" mas`uliyati cheklangan jamiyati	\N	306086394	Dam mahallasi, Dam qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.697735+00	2026-08-31 17:20:58.697735+00
res-0305	"KNOWBRIDGE ACADEMY" nodavlat ta`lim muassasasi	\N	312324389	Komilon mahallasi, Amir Temur ko`chasi, 139-uy, 1N-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.791185+00	2026-08-31 17:20:58.791185+00
res-0341	"ACADEMIC BUSINESS UNIVERSITY" mas`uliyati cheklangan jamiyati	\N	308382975	Mustaqillik mahallasi, Mustaqillik shox ko'chasi, 5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.980742+00	2026-08-31 17:20:58.980742+00
res-0056	"MOBILE PROGRAM GROUP" MCHJ	ABDULLAYEVA LOBAR BOBOQUL QIZI	312785171	Baynalminal mahallasi, O'zbekiston ko'chasi, 11-uy, 2-xonadon	0	0.00	0.00	ACTIVE	2026-02-09	2026-05-20	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.681239+00	2026-08-31 17:20:10.681239+00
res-0059	"UMAR ASLIDDINOVICH" XS	CHORIYEV ASLIDDIN UROLOVICH	312868804	Qashqadaryo viloyati, Dehqonobod tumani, Qodirbaxshi MFY, Mehridil ko‘chasi, 32-uy.	0	0.00	0.00	ACTIVE	2026-05-14	2026-05-15	{}	{"Problem: Rezidentlik imtiyozlarini olish bo'yicha ma'lumotlar berildi ,","hammasini hal qilidik"}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.869802+00	2026-08-31 17:20:10.869802+00
res-0065	"SHON-ACADEMY" MCHJ	SHAKAROV OYBEK NARZULLAYEVICH	313076870	Qashqadaryo viloyati, Dehqonobod tumani,Chilgaz MFY, Obixshon qishlog'i, 14-uy	0	0.00	0.00	ACTIVE	2026-06-03	2026-06-22	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.815321+00	2026-08-31 17:20:12.815321+00
res-0124	"DASTURCHI AVLOD AKADEMIYASI" MCHJ	ZARIFOV TEMURBEK MIRZOHID O`G`LI	312109156	Qashqadaryo viloyati, Shahrisabz tumanii, Shakarteri QFY Mevazor mahallasi, Mo'minobod qishlog'i, 31-a-uy	0	0.00	0.00	REMOVED	\N	2025-08-29	{}	{}	{}	\N	+998 90 639-06-34	\N	\N	\N	Shahrisabz	Shahrisabz tumani	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.388921+00	2026-08-31 17:21:00.388921+00
res-0063	"PANJI AAT" MCHJ	KARIMOV TOSHKENT ABDIQAYUMOVICH	312308454	Qashqadaryo viloyati, Dehqonobod tumani, Qo‘rg‘ontosh MFY, Fayzobod ko‘chasi, 20-uy	0	0.00	0.00	ACTIVE	2025-07-25	2026-06-22	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.634172+00	2026-08-31 17:20:59.634172+00
res-0522	"EL-MAX" mas`uliyati cheklangan jamiyati	\N	301902141	Ayridevol mahallasi, Quyoshli-2 ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.727413+00	2026-08-31 17:20:59.727413+00
res-0464	"Z FIRST BREAD" mas`uliyati cheklangan jamiyati	\N	308882091	Zafar mahallasi, A.Temur ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.763284+00	2026-08-31 17:21:00.763284+00
res-0551	"SULTANBOBO" mas`uliyati cheklangan jamiyati	\N	310689205	Paxtazor mahallasi, O'rikzor ko'chasi, 481-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.820395+00	2026-08-31 17:20:59.820395+00
res-0434	"SHARBAT" xususiy korxonasi	\N	200703511	Kishmishtepa mahallasi, Mustaqillik ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.917026+00	2026-08-31 17:20:59.917026+00
res-0324	Узбекистон Республикаси чет тиллар таржимонлар ассоциацияси Кашкадаре филиали	\N	200671237	Хонобод кучаси 33-уй	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.012282+00	2026-08-31 17:21:00.012282+00
res-0348	SHAHRISABZ TUMANI 16-SKOLIOZ BILAN KASALLANGAN BOLALAR UCHUN SANATORIY TURIDAGI MAKTAB-INTERNATI	\N	201602304	Loliston MFY, Loliston qishlog`i, 929-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.107531+00	2026-08-31 17:21:00.107531+00
res-0405	"NASAF ZIYO EDUCATION CENTER" mas`uliyati cheklangan jamiyati	\N	311961904	Istiqlol mahallasi, 6 mitti tuman dahasi, 14-b-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.201845+00	2026-08-31 17:21:00.201845+00
res-0436	"A-ZZ-A SERVICE" mas`uliyati cheklangan jamiyati	\N	306435316	Beklar mahallasi, To'maris ko'chasi, 20-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.295481+00	2026-08-31 17:21:00.295481+00
res-0581	"BONUNUR 777" mas`uliyati cheklangan jamiyati	\N	312005319	Guliston mahallasi, Buyuk ipak yo'li ko'chasi, 6-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.482297+00	2026-08-31 17:21:00.482297+00
res-0402	"PERFECT LIFE PRIVATE AGENCY" mas'uliyati cheklangan jamiyati	\N	307958614	O'zbekiston mahallasi, Qushariq ko'chasi, 22-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.575904+00	2026-08-31 17:21:00.575904+00
res-0001	"AI FREELANCING" NTM	OLIMOV ABBOS TURG`UNOVICH	311494187	Qashqadaryo viloyati, Qarshi tumanii, Qovchin QFY Shirkent mahallasi, Shirkent qishlog'i, 14-uy	4	0.00	0.00	ACTIVE	2024-07-24	2024-07-31	{"0% Corporate Income Tax","7.5% Personal Income Tax","0% Customs Duty"}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:21:00.669844+00	2026-08-31 17:21:00.669844+00
res-0307	MIRISHKOR TUMAN 1-SONLI OILAVIY BOLALAR UYI	\N	309196114	Yangi Mirishkor mahallasi,  Chamanzor ko`chasi, 2-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.357574+00	2026-08-31 17:20:31.357574+00
res-0211	"AKMAL BOYJIGITOV" mas`uliyati cheklangan jamiyati	\N	310959897	Torjilg'a mahallasi, Maqsud Shayxzoda ko'chasi, 31-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:23.020592+00	2026-08-31 17:20:23.020592+00
res-0243	"AL VORIS EXPRESS" mas`uliyati cheklangan jamiyati	\N	311946121	Obod mahallasi, Obod ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.734618+00	2026-08-31 17:20:25.734618+00
res-0214	"OCHILOVA GULMIRA TO`LAYEVNA" mas`uliyati cheklangan jamiyati	\N	308445548	Istiqlol mahallasi, Mening yurtim-16 ko'chasi, 4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.827872+00	2026-08-31 17:20:25.827872+00
res-0286	"AKOBIR BARAKA ISSIQ KULCHALARI" mas`uliyati cheklangan jamiyati	\N	311518867	Jar mahallasi, Jar qishlog'i, 38-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:31.54421+00	2026-08-31 17:20:31.54421+00
res-0248	"DIAMOND MAN-CO" mas'uliyati cheklangan jamiyati	\N	307350311	Mustaqillik ko'chasi, 76-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:28.634871+00	2026-08-31 17:20:28.634871+00
res-0350	"YAKKABOG' KASB-HUNARGA OQITISH" mas`uliyati cheklangan jamiyati	\N	312749817	Aygirko'l mahallasi, Aygirko'l ko'chasi, 279-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.188816+00	2026-08-31 17:20:34.188816+00
res-0608	"O`ZBEKISTON VETERAN JANGCHI-FAXRIY VA NOGIRONLARI BIRLASHMASI QASHQADRYO VILOYAT BO`LIMINING SAXIY-VETERAN" unitar korxonasi	\N	301406694	Paxtazor-1 mahallasi, Islom Karimov ko'chasi, 60-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.732719+00	2026-08-31 17:20:56.732719+00
res-0382	"TALAPKER ZIYO" mas`uliyati cheklangan jamiyati	\N	307890297	Paxtazor mahallasi, Mustaqillik shoh ko'chasi, 1-5-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.901412+00	2026-08-31 17:20:36.901412+00
res-0416	"SADIK" mas`uliyati cheklangan jamiyati	\N	203252637	Cho'lquvar mahallasi, 6-mitti tuman	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.616886+00	2026-08-31 17:20:39.616886+00
res-0259	"POLAND BUSINESS SUPPORT AND VIZA" mas`uliyati cheklangan jamiyati	\N	310529854	Eskibog' qishlog'i, Gulshan mahallasi, 20-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.602629+00	2026-08-31 17:20:58.602629+00
res-0410	"XALQARO TALIM AKADEMIYASI" mas`uliyati cheklangan jamiyati	\N	311760655	Sohibqiron mahallasi, Fusunkor ko'chasi, 47-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:41.860397+00	2026-08-31 17:20:41.860397+00
res-0479	"SHAFFOF MEDICAL FARM SERVIS" mas'uliyati cheklangan jamiyati	\N	307242120	Bunyodkor mahallasi, A.Temur ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.235874+00	2026-08-31 17:20:45.235874+00
res-0483	"MILLION BIZNES MOBILE" mas'uliyati cheklangan jamiyati	\N	307433911	Tabassum mahallasi, O'zbekiston ko'chasi, 231-uy, 17-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.609566+00	2026-08-31 17:20:45.609566+00
res-0509	"PAY-SERVES" mas`uliyati cheklangan jamiyati	\N	311967619	Xojaobod mahallasi, Yangi chorvog' ko'chasi, 23-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:47.949595+00	2026-08-31 17:20:47.949595+00
res-0035	"SSOFT" MCHJ	MURATOV SHUXRAT KAXAROVICH	311071982	Qarshi sh. Buyuk turon mahallasi, Buyuk turon Maxtumquli ko`chasi, 10b-uy	17	0.00	0.00	ACTIVE	2024-01-31	2024-03-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.652945+00	2026-08-31 17:20:08.652945+00
res-0448	"ISHONCHLI PROVIDER" mas`uliyati cheklangan jamiyati	\N	310850425	Pillakashlik mahallasi, Ipak yo'li ko'chasi, 15/4-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.423117+00	2026-08-31 17:20:42.423117+00
res-0570	"GLOBAL MEGA NETWORK SYSTEM" mas`uliyati cheklangan jamiyati	\N	310682089	Batosh mahallasi, Mirmiron ko'chasi, 1/29-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.367408+00	2026-08-31 17:20:53.367408+00
res-0601	"KESH NUR TA'LIM" nodavlat ta`lim muassasasi	\N	302226554	Ipak yo'li ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.07604+00	2026-08-31 17:20:56.07604+00
res-0015	"GLOBAL EDU IN KARSHI" MCHJ	SODIQOV SARDOR SODIQOVICH	308478729	Qashqadaryo viloyati, Qarshi sh. A.Yulbarisov ko'chasi	23	0.00	0.00	ACTIVE	2021-05-06	2024-11-29	{"0% Corporate Income Tax","7.5% Personal Income Tax","0% Customs Duty"}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	+998 93 070-00-71	\N	\N	\N	Qarshi	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:06.791818+00	2026-08-31 17:20:06.791818+00
res-0232	"ELHISOB" mas`uliyati cheklangan jamiyati	\N	312845745	Shirinobod mahallasi, Ozoda ko'chasi, 19-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:24.892227+00	2026-08-31 17:20:24.892227+00
res-0270	"ALFAYUM-TURON" mas`uliyati cheklangan jamiyati	\N	308136274	Jar mahallasi, Do'stlik qishlog'i	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:27.793055+00	2026-08-31 17:20:27.793055+00
res-0435	"FAYZIYEV KLICH" xususiy korxonasi	\N	310001547	Mag'zon mahallasi, Beshdarak ko'chasi, 30-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:43.92425+00	2026-08-31 17:20:43.92425+00
res-0280	"ASHUROV ERGASH BUYUK KELAJAK" mas`uliyati cheklangan jamiyati	\N	311129679	Obod mahallasi, Yangiobod qishlog'i, 13-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.88936+00	2026-08-31 17:20:30.88936+00
res-0314	"IMKON DIYOR 777" mas`uliyati cheklangan jamiyati	\N	312333021	Annaruz mahallasi, Annaruz ko'chasi, 49-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:33.717616+00	2026-08-31 17:20:33.717616+00
res-0316	"TOLIBI ILM MEDICAL" mas`uliyati cheklangan jamiyati	\N	312509616	Oltin dala mahallasi, Oltin voha ko`chasi, 66-uy, А-Корпус	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.955021+00	2026-08-31 17:20:32.955021+00
res-0318	"PARVINAXON ZIYO" nodavlat ta`lim muassasasi	\N	308850646	A.Navoiy mahallasi, Yosh kuch ko`chasi, 38-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.000661+00	2026-08-31 17:20:34.000661+00
res-0414	QASHQADARYO VILOYATI "KELAJAK" MARKAZI	\N	207124088	Geolog mahallasi, I.Karimov ko'chasi, 219-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.427616+00	2026-08-31 17:20:39.427616+00
res-0385	"TARMOQLARARO TALIM AKADEMIYASI" mas`uliyati cheklangan jamiyati	\N	312759646	Kunchiqar mahallasi, Nurbog' ko'chasi, 2-uy, 9А-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.181602+00	2026-08-31 17:20:37.181602+00
res-0417	"SITORA IMKON PLYUS" nodavlat ta`lim muassasasi	\N	301335998	Jambul mahallasi, At-Termiziy ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:39.710411+00	2026-08-31 17:20:39.710411+00
res-0421	"ZIYO DAVR BOLALARI" nodavlat ta`lim muassasasi	\N	312025071	Mug'lon mahallasi, 11-Obodmavze ko'chasi, 28-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:40.083179+00	2026-08-31 17:20:40.083179+00
res-0440	"YANGI ALOQA" xususiy korxonasi	\N	305085634	Kimyogarlar kochasi, 1-uy, 4-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.708056+00	2026-08-31 17:20:42.708056+00
res-0484	"SHOKIROV SHOHJAXON" mas`uliyati cheklangan jamiyati	\N	312396348	Regzor mahallasi, Nasaf ko'chasi, 25-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:45.703187+00	2026-08-31 17:20:45.703187+00
res-0544	"ALLASHUKUROVA MAXFIRAT" xususiy korxonasi	\N	308917569	Ulug`bek mahallasi, O`zbekiston ko`chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.123188+00	2026-08-31 17:20:51.123188+00
res-0576	"BRAND PAYMENT" xususiy korxonasi	\N	311017636	Kunchiqar mahallasi, Koinot ko'chasi, 12-uy, 7-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:53.927367+00	2026-08-31 17:20:53.927367+00
res-0609	"PREMER NEW 777" mas`uliyati cheklangan jamiyati	\N	310371744	Shurtan mahallasi, Nasaf ko'chasi, 35-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:56.826175+00	2026-08-31 17:20:56.826175+00
res-0539	"BUXORO MOBILE DIANA" mas`uliyati cheklangan jamiyati	\N	308018208	Cho'lquvar mahallasi, Islom Karimov ko'chasi, 1a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.65588+00	2026-08-31 17:20:50.65588+00
res-0028	"QAMASHI IT PARK GRANT" MCHJ	BOYMIRZAYEVA DILRABO SUYUNOVNA	312277494	Qashqadaryo viloyati, Qamashi tumanii, Qiziltepa shaharchasi Bunyodkor mahallasi, Abdiraxmon Jomiy ko'chasi, 5-uy	3	0.00	0.00	ACTIVE	2025-08-14	2025-07-31	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.512287+00	2026-08-31 17:20:09.512287+00
res-0094	"Elite Groups" MCHJ	Erkinov Jahongir	310947556	Qarshi shahar Shodlik MFY Mustaqillik shox koçhasi, 21 uy	0	0.00	0.00	REMOVED	\N	2023-12-20	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.55186+00	2026-08-31 17:20:16.55186+00
res-0287	"PROGRESS INNOVATION" nodavlat ta`lim muassasasi	\N	305703007	A.Navoiy ko`chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:30.701813+00	2026-08-31 17:20:30.701813+00
res-0067	"Automatic technologies solutions" MCHJ	BAXRIYEV G'ULOM FAYZIYEVICH	311439965	Qashqadaryo viloyati, Qarshi sh. Mustaqillik mahallasi, mustaqillik ko'chasi 103-uy	0	0.00	0.00	ACTIVE	2024-07-02	2026-07-06	{}	{}	{}	\N	+998 90 721-70-66	\N	\N	\N	Qarshi	Qo'llab-quvvatlash	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.997425+00	2026-08-31 17:20:13.997425+00
res-0044	«AXBOROT KOMMUNIKATSIYA TEXNOLOGIYALARI MARKAZI» MCHJ	NIYAZOV DOSTON G'AYRAT O'G'LI	307332870	Qarshi sh., Naxshab mahallasi, Usta guzar ko'chasi, 62-uy	2	0.00	0.00	ACTIVE	2020-05-04	2022-12-30	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:11.747869+00	2026-08-31 17:20:11.747869+00
res-0200	"GULOMOV INDUSTRIES" mas`uliyati cheklangan jamiyati	\N	312464491	Do'stlik mahallasi, Firdavsiy ko`chasi, 51-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.087321+00	2026-08-31 17:20:22.087321+00
res-0110	"ZERO TEAM" MCHJ	RUSTAMQULOV MIRJALOL OLIM O‘G‘LI	311779614	Qshqadaryo viloyati, Chiroqchi tuman Mustaqillik kuchasi 220-uy	0	0.00	0.00	REMOVED	\N	2024-12-28	{}	{}	{}	\N	+998 50 078-04-42	\N	\N	\N	Chiroqchi	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.477331+00	2026-08-31 17:20:15.477331+00
res-0115	"QARSHI VOICE" MCHJ	TASHMAMEDOV BOGDAN ROMANOVICH	311567474	Qashqadaryo viloyati, Qarshi sh. Geolog mahallasi, Mustaqillik ko'chasi, 22/2-uy	0	0.00	0.00	REMOVED	\N	2024-09-30	{}	{}	{}	\N	+998 91 963-73-77	\N	\N	\N	Qarshi	Eksport	Boshqа telekommunikаtsiya xizmаtlаri ko'rsаtish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.44715+00	2026-08-31 17:20:59.44715+00
res-0078	"GULISTAN EST NOVA" MCHJ	BO`RIYEV ORIF XOLIQULOVICH	310573549	Mirishkor tumani, Guliston QFY Guliston mahallasi, A.Temur ko'chasi, 22b-uy	1	0.00	0.00	REMOVED	2023-06-19	2026-01-15	{}	{}	{}	\N	+998 99 016-66-40	\N	\N	\N	Mirishkor	Eksport	Ovqаtlаnishni tаshkil qilishning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.370873+00	2026-08-31 17:20:14.370873+00
res-0130	"DISPECH ZONE" MCHJ	CHORIYEV BOTIR XASANOVICH	311839998	QASHQADARYO VILOYATI, SHAHRISABZ TUMANI, CHORSHANBE MFY, CHORSHANBE QISHLOG'I, 367-UY	0	0.00	0.00	REMOVED	\N	2025-02-28	{}	{}	{}	\N	+998 95 893-03-01	\N	\N	\N	Shahrisabz	Ta`lim	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.212025+00	2026-08-31 17:20:17.212025+00
res-0086	"SHERLOCK DEDUCTION" MCHJ	Juroyev Nazirjon	308426301	Shahrisabz sh., Uychilik mahallasi, Ipak Yo'li ko'chasi, 358-uy	0	0.00	0.00	REMOVED	\N	2023-12-20	{}	{}	{}	\N	+998 97 384-21-21	\N	\N	\N	Shahrisabz	Xizmat ko'rsatish	Kompyuter uskunalarini boshqarish bo'yicha faoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.109147+00	2026-08-31 17:20:13.109147+00
res-0030	"RAQAMLI TEXNOLOGIYALARNI INTELEKTUALLASHTIRISH DIREKSIYASI" MCHJ	SHAVKATOV VAHOB SHUXRAT O'G'LI	312651426	Koson tumanii, Istiqbol mahallasi, Chilangar ko'chasi 13-uy	2	0.00	0.00	ACTIVE	2025-12-12	2026-01-15	{}	{"Problem: Telefonga tushub bo'lmadi",-,"Quarterly report Q1 2025 updated to APPROVED on 2026-09-07."}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.416861+00	2026-08-31 17:20:09.416861+00
res-0010	"ELWEB" MCHJ	HAFIZOV ABBOS BAXRIDDIN O'G'LI	307336350	Qarshi tumanii, Beshkent shahri Mustaqillik ko'chasi, 2-uy	5	0.00	0.00	ACTIVE	2020-05-05	2024-01-31	{}	{"Problem: Muammo yo'q",-,"Quarterly report Q1 2025 updated to APPROVED on 2026-09-07."}	{}	\N	+998 99 660-77-04	\N	\N	\N	Qarshi District	DTni ishlab chiqish	To'lovlаrni yig`ish bo'yichа аgentliklаr vа kredit byurolаri fаoliyati	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.498844+00	2026-08-31 17:20:07.498844+00
res-0041	"XIU QOSHIDAGI RAQAMLI TEXNOLOGIYALAR CENTER" MCHJ	Ernaqulov Sunnatillo Nurali o’g’li	311573895	Qashqadaryo viloyati, Qarshi tumanii, Bog'obod QFY Bog'obod mahallasi, Uzunnavo qishlog'i , 365-uy	57	0.00	0.00	ACTIVE	2024-08-26	2024-09-30	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.540645+00	2026-08-31 17:20:59.540645+00
res-0024	"OPEN WEB ACADEMY" MCHJ	RUSTAMOV RUSLAN ULUG'BEKOVICH	309294103	Qarshi tumanii, Beshkent shahri, A.Navoiy mahallasi, Istiqlol ko'chasi	10	0.00	0.00	ACTIVE	2022-03-31	2022-07-22	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:09.222056+00	2026-08-31 17:20:09.222056+00
res-0452	"HAQQULOV YAZNON BROKERLIK IDORASI" mas`uliyati cheklangan jamiyati	\N	311079045	Bog'ariq mahallasi, Bog'ariq-2 ko'chasi, 11-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.801424+00	2026-08-31 17:20:42.801424+00
res-0119	"AKT TIZIMLARINI RIVOJLANTIRISH" xususiy korxonasi	AMIRKULOV BAXRIDDIN JABBOROVICH	311179965	Qashqadaryo viloyati, Qarshi tumani, Yertepa QFY Guliston mahallasi, Tojikpistakent qishlog'i, 10-uy	0	0.00	0.00	REMOVED	\N	2024-05-05	{}	{}	{}	\N	+998 97 200-60-48	\N	\N	\N	Qarshi District	Xizmat ko'rsatish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:18.51955+00	2026-08-31 17:20:18.51955+00
res-0127	"Infinite IT Park" MCHJ	ALIQULOV RUSTAM NORQOBIL O`G`LI	312167687	Qashqadaryo viloyati, Yakkabog‘ tumani, Yakkabog' shahri Yangiobod mahallasi, Yangiobod ko'chasi, 212-uy	0	0.00	0.00	REMOVED	\N	2025-06-17	{}	{}	{}	\N	+998 90 136-36-37	\N	\N	\N	Yakkabogʻ	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.773089+00	2026-08-31 17:20:17.773089+00
res-0098	"ZNT Karshi" MCHJ	Xamdamova Zilola	310771397	Qarshi shahar Shodlik MFY Mustaqillik shox koçhasi, 21 uy	0	0.00	0.00	REMOVED	\N	2023-09-29	{}	{}	{}	\N	+998 99 276-22-05	\N	\N	\N	Qarshi	Eksport	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.162526+00	2026-08-31 17:20:16.162526+00
res-0104	"Space Software Hub" MCHJ	Tuychiyev Doniyor Ilyos o'g'li	310292581	Qarshi tumani, Bog'obod QFY Bog'obod qishlog'i, Bog'obod mahallasi, 1-76-uy	0	0.00	0.00	REMOVED	\N	2024-02-16	{}	{}	{}	\N	+998 97 914-64-79	\N	\N	\N	Qarshi District	Xizmat ko'rsatish	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:14.878373+00	2026-08-31 17:20:14.878373+00
res-0114	"MMAX DIZAYN STUDIO 24" MCHJ	AXMATOV MUXAMMADI XUSNIDDIN O‘G‘LI	308447853	Qashqadaryo viloyati, Yakkabog' tumani A.Temur ko'chasi 32-uy	0	0.00	0.00	REMOVED	\N	2024-12-28	{}	{}	{}	\N	+998 97 318-17-67	\N	\N	\N	Yakkabogʻ	Xizmat ko'rsatish	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:15.776136+00	2026-08-31 17:20:15.776136+00
res-0016	"ILMGA YO`L" MCHJ	ISHKULOV DOSTONBEK BOBONAZAR O`G`LI	310754401	Qashqadaryo viloyati, Nishon tumanii, Yangi Nishon shahri Ulug'bek mahallasi, Qori Niyoziy ko'chasi, 67-uy	6	0.00	0.00	ACTIVE	2023-09-04	2023-02-11	{}	{"Problem: Telefonga tushub bo'lmadi",-,"Quarterly report Q1 2025 updated to APPROVED on 2026-09-07."}	{}	\N	+998 91 950-05-84	\N	\N	\N	Nishon	IT ta'lim	Boshqа toifаlаrgа kiritilmаgаn tа'limning boshqа turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:06.887178+00	2026-08-31 17:20:06.887178+00
res-0137	"HARDWARE AND SOFTWARE SERVISES"	AXMADOV MIRSHOD MIRKOMIL O‘G‘LI	308209293	Qashqadaryo viloyati, Kitob tumani, Bog'bon QFY Sohibkor mahallasi, Ochamayli qishlog'i	0	0.00	0.00	REMOVED	\N	2024-07-31	{}	{}	{}	\N	+998 99 526-50-97	\N	\N	\N	Kitob	Xizmat ko'rsatish	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.679836+00	2026-08-31 17:20:17.679836+00
res-0079	"PRIMETRUST LOGISTICS" MCHJ	OTABOYEV BEHRO`Z OLIMJON O`G`LI	312333425	Qarshi sh. Qarlixona mahallasi, Rasul Safarov ko'chasi, 14-uy	2	0.00	0.00	REMOVED	2025-08-05	2026-01-15	{}	{}	{}	\N	+998 95 077-07-20	\N	\N	\N	Qarshi	Eksport	Boshqа toifаlаrgа kiritilmаgаn shаxsiy xizmаtlаr	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.398865+00	2026-08-31 17:20:13.398865+00
res-0139	"US HIGH QUALITY INTERNATIONAL LOGISTICS SERVICE" MCHJ	SOTTOROV SHOXRUX ULASH O`G`LI	311159412	Qashqadaryo viloyati, Qarshi tumanii, Bog'obod QFY Bog'obod mahallasi, To'qmang'it qishlog'i, 2/8-uy	0	0.00	0.00	REMOVED	\N	2024-07-31	{}	{}	{}	\N	+998 88 700-00-00	\N	\N	\N	Qarshi District	Eksport	Temir yo'l, аvtotrаnsport, dengiz yoki hаvo orqаli trаnsportdа tаshishni tаshkil qilish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:57.667427+00	2026-08-31 17:20:57.667427+00
res-0073	"REVOLUTION ACADEMY" NTM	SAYFULLAYEV ASLIDDIN SHOKIRJONOVICH	309686216	Qashqadaryo viloyati, Shahrisabz sh. Bo‘ston mahallasi, Birdamlik ko'chasi, 1-uy	0	0.00	0.00	ACTIVE	2022-06-29	10.07..2026	{}	{}	{}	\N	+998 91 322-55-44	\N	\N	\N	Shahrisabz	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:13.209543+00	2026-08-31 17:20:13.209543+00
res-0239	"FAYZ SAHOVAT BIZNES" mas`uliyati cheklangan jamiyati	\N	301283763	Geolog mahallasi, Sherqulova ko'chasi, 25-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:25.453384+00	2026-08-31 17:20:25.453384+00
res-0006	"AXBOROT TEXNOLOGIYALARI KLASTERI" MCHJ	XOZRATQULOV SALIMJON SHERALIYEVICH	311030108	Qarshi sh. Beglar mahallasi, Amir Temur ko'chasi, 2/8-uy	8	0.00	0.00	ACTIVE	2024-03-25	2022-07-22	{}	{"Problem: Telefonga tushub bo'lmadi"}	{}	\N	+998 97 313-00-55	\N	\N	\N	Qarshi	Eksport	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.78654+00	2026-08-31 17:20:07.78654+00
res-0060	"STF SCHOOL" MCHJ	MUZROFJONOV ELCHINBEK LOCHIN O‘G‘LI	313012784	QASHQADARYO VI LOY A TI , SHAHRISABZ SHAHRI , G‘ ALABA MFY , G‘ OFUR G‘ ULOM\nKO‘ CHASI , 5-UY , 15- XONADON	0	0.00	0.00	ACTIVE	2026-05-04	2026-06-03	{}	{"Problem: Muammo yo'q",-}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.984092+00	2026-08-31 17:20:10.984092+00
res-0134	"IT PARK EDUCATION KARSHI" MCHJ	Xushmurodov Shahzod Rauf o'g'li	311027283	Qarshi sh. Shodlik mahallasi, 5-mavzesi, 19/1-uy, 5-xonadon	0	0.00	0.00	REMOVED	\N	2024-01-16	{}	{}	{}	\N	+998 97 435-85-37	\N	\N	\N	Qarshi	Ta`lim	Kompyuter texnologiyalаri sohаsidаgi mаslаhаt xizmаtlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:17.400328+00	2026-08-31 17:20:17.400328+00
res-0310	"SHAMSHOD ABITURIYENT TAYYORLASH MAKTABI" nodavlat ta'lim muassasasi	\N	310152992	Chiroqchi mahallasi, Mustaqillik ko'chasi, 134-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:29.75564+00	2026-08-31 17:20:29.75564+00
res-0013	FOREACH EDUCATION	G'ANIYEV DAVLAT KOZIMOVICH	311092237	Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	20	0.00	0.00	ACTIVE	2024-02-09	2024-02-29	{}	{"Problem: Telefonga tushub bo'lmadi",-}	{}	\N	+998 91 452-55-65	\N	\N	\N	Qarshi	Qo'llab-quvvatlash	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:06.604784+00	2026-08-31 17:20:06.604784+00
res-0204	"ONE STOP JBT" mas`uliyati cheklangan jamiyati	\N	311789508	Bodomzor mahallasi, O'rikzor ko'chasi, 71-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:22.367283+00	2026-08-31 17:20:22.367283+00
res-0022	"NAVIGO" MCHJ	JALOLOV AKBARJON ABDUXOMID O`G`LI	311173855	Qarshi sh. Mustaqillik mahallasi, Mustaqillik ko'chasi, 103-uy	22	0.00	0.00	ACTIVE	2024-03-14	2024-03-31	{}	{"Problem: Zero Risk bo'yicha ma'lumot kerak ekan","Barcha ma'lumotlar tashlab berildi"}	{}	\N	+998 97 799-24-56	\N	\N	\N	Qarshi	Eksport	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:10.102935+00	2026-08-31 17:20:10.102935+00
res-0020	"IT RBR" MCHJ	RASULOV BUNYOD RAVSHAN O`G`LI	312264274	Qashqadaryo viloyati, Koson tumanii, Guvalak shaharchasi Gulobod mahallasi, Guvalak ko'chasi, 13-uy	1	0.00	0.00	ACTIVE	2025-08-08	2025-07-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 99 668-56-99	\N	\N	\N	Koson	Qo'llab-quvvatlash	Boshqа dаsturiy tа'minotlаrni chiqаrish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.188025+00	2026-08-31 17:20:07.188025+00
res-0218	"SHAHZODA-ZILOLA-OMAD" xususiy korxonasi	\N	311720625	Dehqonobod mahallasi, Muqumiy ko'chasi, 16b-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.298565+00	2026-08-31 17:20:26.298565+00
res-0004	"ASADBEK BURIYEV WS" NTM	ASADBEK BURIYEV	312256315	Qashqadaryo viloyati, Qarshi tumanii, Beshkent shahri Alisher Navoiy mahallasi, Amir Temur ko'chasi, 28-uy	1	0.00	0.00	ACTIVE	2025-07-04	2025-30-09	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 90 443-55-67	\N	\N	\N	Qarshi District	IT ta'lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.297354+00	2026-08-31 17:20:07.297354+00
res-0074	"HEALIX" MCHJ	JUMAYEV HAKIMJON G‘AYRATOVICH	312329373	Qashqadaryo viloyati, Qarshi shahri, Cho‘lquvar MFY, Islom Karimov ko‘chasi, 1-A uy.	0	0.00	0.00	ACTIVE	2025-08-04	2026-08-04	{}	{}	{}	\N	+998 (94) 649-30-00	\N	\N	\N	Qarshi	Qo'llab-quvvatlash	Mа'lumotlаrni joylаshtirish vа ishlov berish bo'yichа xizmаtlаr	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:12.222582+00	2026-08-31 17:20:12.222582+00
res-0012	"FATHTIME" MCHJ	AXMEDOV ELDORBEK FARXOD O'G'LI	311021577	Qarshi shahri Shodlik MFY Mustaqillik shox koçhasi, 21 uy	30	0.00	0.00	ACTIVE	2024-01-08	2024-01-31	{}	{"Problem: Muammo yo'q",-}	{}	\N	+998 88 678-00-11	\N	\N	\N	Qarshi	Eksport	Kompyuter dаsturlаshtirish sohаsidаgi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:07.397308+00	2026-08-31 17:20:07.397308+00
res-0254	"TURDIYEVA MUNISA FARXODOVNA" xususiy korxonasi	\N	309772236	Otchopar mahallasi, Halqlar do'stligi ko'chasi, 553-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:26.578866+00	2026-08-31 17:20:26.578866+00
res-0112	"JEYNOV SITI SIFATLI TA'LIM " MCHJ	ZIYOYEV SARDOR QUDRATILLOYEVICH	310176678	Qashqadaryo viloyati, Mirishkor tumani, Jeynov shaxarchasi, Янги ариқ МФЙ, Файзулло хужаев кучаси, 58-уй	0	0.00	0.00	REMOVED	\N	2024-12-28	{}	{}	{}	\N	+998 97 313-20-71	\N	\N	\N	Mirishkor	Ta`lim	Tа'lim sohаsidаgi yordаmchi fаoliyat	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:59.167378+00	2026-08-31 17:20:59.167378+00
res-0578	"CHIROQCHI  ALOQA  XIZMATI" mas`uliyati cheklangan jamiyati	\N	308860207	Chiroqchi mahallasi, Mustaqillik Ko'chasi	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:54.769598+00	2026-08-31 17:20:54.769598+00
res-0473	"ZAMON INNOVATSIYASI" mas'uliyati cheklangan jamiyati	\N	306677846	Paxtazor mahallasi, Islom Karimov ko'chasi, 52a-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:44.675557+00	2026-08-31 17:20:44.675557+00
res-0393	"AMSTERDAM EDU SCHOOL" nodavlat ta`lim muassasasi	\N	310260749	Komilon mahallasi, Tupxona ko'chasi, 5-uy, 46-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:37.839584+00	2026-08-31 17:20:37.839584+00
res-0534	"TOSHMURODOVA MOHIRA RUSTAM QIZI" mas`uliyati cheklangan jamiyati	\N	312719631	Do'stlik mahallasi, Firdavsiy ko'chasi, 75-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:50.189577+00	2026-08-31 17:20:50.189577+00
res-0330	"KOREAL ACADEMY CONSOLTING" mas`uliyati cheklangan jamiyati	\N	312582916	Mustaqillik mahallasi, Islom Karimov ko'chasi, 219Б-uy, 1Е-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:32.58008+00	2026-08-31 17:20:32.58008+00
res-0343	"QASHQADARYO ILM -FAN RIVOJ" nodavlat ta`lim muassasasi	\N	303004521	A.Temur ko'chasi , 43-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.155479+00	2026-08-31 17:20:36.155479+00
res-0565	"NURSERVIS GSM" mas`uliyati cheklangan jamiyati	\N	310335083	Bunyodkor mahallasi, Yangibog' ko'chasi, 66-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:52.994159+00	2026-08-31 17:20:52.994159+00
res-0595	"SPO SALANG" mas`uliyati cheklangan jamiyati	\N	308543703	Kunchiqar mahallasi, Nurbog' ko'chasi, 25-uy, 2-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:55.609859+00	2026-08-31 17:20:55.609859+00
res-0495	"TELEFORUM" mas`uliyati cheklangan jamiyati	\N	308414815	Nukrabod mahallasi, O`zbekiston mustaqilligi ko'chai, 19/5-uy, 29-xona	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:49.256225+00	2026-08-31 17:20:49.256225+00
res-0446	"ABDURASUL UNIVERSAL PLUS" mas`uliyati cheklangan jamiyati	\N	312107372	Oydin mahallasi, Xonobod yo'li ko'chasi, 40-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:42.235872+00	2026-08-31 17:20:42.235872+00
res-0133	"SHAHRISABZ GLOBAL BIZNES INKUBATOR"	TURAYEV UMARJON SODIQ O‘G‘LI	310892420	Shahrisabz shahri Qoziguzar MFY tarixiy maydon, mo'ljal hunarmandlar savdo majmuasi	0	0.00	0.00	REMOVED	\N	2025-03-14	{}	{}	{}	\N	+998 99 000-67-90	\N	\N	\N	Shahrisabz	Xizmat ko'rsatish	Iqtisodiy fаoliyatni sаmаrаli olib borishgа ko'mаklаshish vа boshqаrish	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:16.930067+00	2026-08-31 17:20:16.930067+00
res-0489	"HUSAN AVIA" mas`uliyati cheklangan jamiyati	\N	312884341	Paxtaobod mahallasi, Mustaqillik ko`chasi, 58-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:46.169869+00	2026-08-31 17:20:46.169869+00
res-0525	"RA`NO ERGASHEVA " mas`uliyati cheklangan jamiyati	\N	310625047	Mevazor mahallasi, 19/5-uy, 29-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:51.964673+00	2026-08-31 17:20:51.964673+00
res-0401	"MITTI AKADEMIYA   SDS" mas`uliyati cheklangan jamiyati	\N	309804376	Xalqlar Do'stligi mahallasi, Zarafshon ko'chasi, 214-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:38.586327+00	2026-08-31 17:20:38.586327+00
res-0311	"QASHQADARYO AVTOMOBIL O`QUV-ISHLAB CHIQARISH KOMBINATI" mas`uliyati cheklangan jamiyati	\N	201268507	Beglar mahallasi, Xo'jabog' ko'chasi, 8-uy	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:58.887186+00	2026-08-31 17:20:58.887186+00
res-0347	"IELTS-CENTER-QARSHI" mas`uliyati cheklangan jamiyati	\N	310070519	Qarliqxona mahallasi, Islom Karimov ko'chasi, 315-uy, 3n-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:36.621806+00	2026-08-31 17:20:36.621806+00
res-0357	"THE GLOBAL EXAMS SOLUTION" mas`uliyati cheklangan jamiyati	\N	312829409	Gulshan mahallasi, Nasaf ko'chasi, 337-uy, 19-xonadon	0	0.00	0.00	POTENTIAL	\N	\N	{}	{}	{}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:34.845257+00	2026-08-31 17:20:34.845257+00
res-0011	"ENTER MARKETING AGENCY" MCHJ	NURQULOV RAMZBEK ERNAZAR O'G'LI	311114904	Qashqadaryo viloyati, Qarshi sh. Cho'lquvar mahallasi, Islom Karimov ko'chasi, 1a-uy	1	0.00	0.00	ACTIVE	2024-02-19	2025-10-15	{}	{"Problem: soliq bilan muammo bo'lgan,soliq imtiyozni bermasdan ko'p pul olgan","soliq maummosi yechildi may oyidan imtiyoz ishlayapti"}	{}	\N	+998 99 335-37-36	\N	\N	\N	Qarshi	Kreativ iqtisodiyot	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	\N	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[]	{}	2026-08-31 17:20:08.069834+00	2026-08-31 17:20:08.069834+00
res-0046	«NNT EXPRESS INC» MCHJ	KAMRON XOLMURODOV	307701110	Qarshi sh, I.Karimov ko'chasi, 212	61	0.00	0.00	ACTIVE	2020-09-07	2023-03-31	{"0% Corporate Income Tax","7.5% Personal Income Tax","0% Customs Duty"}	{"Problem: Muammo yo'q",-}	{}	info@itcompany.uz	+998 75 123 4567	https://itcompany.uz	\N	\N	Qarshi	Software Development	\N	Dilnoza Alimova	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[{"id": "hist-1788287288222", "action": "Updated resident profile (Enterprise Registry Data)", "userId": "u-1", "userName": "Dilnoza Alimova", "timestamp": "2026-09-01"}, {"id": "hist-1788287278895", "action": "Updated resident profile (Enterprise Registry Data)", "userId": "u-1", "userName": "Dilnoza Alimova", "timestamp": "2026-09-01"}]	{}	2026-08-31 17:20:11.65454+00	2026-08-31 17:20:11.65454+00
res-0002	"ALTERA KTS" MCHJ	RAXMONOV FIRUZ XUDOYQULOVICH	310143663	Qashqadaryo viloyati, Shahrisabz sh. Kunchiqar mahallasi, Ipak Yo'li ko`chasi, 346-uy	7	0.00	0.00	ACTIVE	2023-01-11	2024-10-15	{"0% Corporate Income Tax","7.5% Personal Income Tax","0% Customs Duty"}	{"Problem: Korxonaga qarzdorlikni tekshrishda muammo bor edi","Hozirda Itpark.uz kabinetida online qarzdorlik hisob kitoblarini tekshirish uchun dashboard yaratilgan"}	{}	info@itcompany.uz	+998 97 380-08-20	https://itcompany.uz	\N	\N	Shahrisabz	Litsenziyalarni sotish	Аxborot texnologiyalаri vа kompyuter tizimlаri sohаsidаgi boshqа fаoliyat turlаri	Dilnoza Alimova	\N	\N	\N	0	\N	\N	\N	[]	\N	{}	\N	\N	0.00	\N	\N	\N	t	[]	[]	[]	[]	[]	[{"id": "hist-1788286200237", "action": "Updated resident profile (Enterprise Registry Data)", "userId": "u-1", "userName": "Dilnoza Alimova", "timestamp": "2026-09-01"}, {"id": "hist-1788286194705", "action": "Updated resident profile (Enterprise Registry Data)", "userId": "u-1", "userName": "Dilnoza Alimova", "timestamp": "2026-09-01"}]	{/resident-photos/res-0002/1788286204075-photo_2026-08-06_10-30-18.jpg}	2026-08-31 17:20:57.854394+00	2026-08-31 17:20:57.854394+00
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions ("roleId", "permissionId") FROM stdin;
r-superadmin	p-users-read
r-superadmin	p-users-create
r-superadmin	p-users-update
r-superadmin	p-users-delete
r-superadmin	p-residents-read
r-superadmin	p-residents-create
r-superadmin	p-residents-update
r-superadmin	p-residents-delete
r-superadmin	p-startups-read
r-superadmin	p-startups-create
r-superadmin	p-startups-update
r-superadmin	p-startups-delete
r-superadmin	p-events-read
r-superadmin	p-events-manage
r-superadmin	p-crm-read
r-superadmin	p-crm-manage
r-superadmin	p-analytics-read
r-superadmin	p-analytics-manage
r-superadmin	p-infra-read
r-superadmin	p-infra-manage
r-superadmin	p-audit-read
r-superadmin	p-planning-read
r-superadmin	p-planning-manage
r-superadmin	p-settings-manage
r-manager	p-users-read
r-manager	p-residents-read
r-manager	p-residents-create
r-manager	p-residents-update
r-manager	p-residents-delete
r-manager	p-startups-read
r-manager	p-startups-create
r-manager	p-startups-update
r-manager	p-startups-delete
r-manager	p-events-read
r-manager	p-events-manage
r-manager	p-crm-read
r-manager	p-crm-manage
r-manager	p-analytics-read
r-manager	p-analytics-manage
r-manager	p-planning-read
r-manager	p-planning-manage
r-manager	p-infra-read
r-manager	p-infra-manage
r-manager	p-audit-read
r-superadmin	p-edoreports-read
r-superadmin	p-edoreports-manage
r-manager	p-edoreports-read
r-manager	p-edoreports-manage
r-superadmin	p-vacancies-read
r-superadmin	p-vacancies-manage
r-manager	p-vacancies-read
r-manager	p-vacancies-manage
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, "createdAt") FROM stdin;
r-superadmin	SUPER_ADMIN	Full unrestricted platform administrator access	2026-08-31 17:23:50.453308+00
r-manager	MANAGER	Regional & Operations Manager for Residents, Startups, Events, and CRM	2026-08-31 17:23:50.550723+00
\.


--
-- Data for Name: startups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.startups (id, name, founder, email, phone, stage, status, industry, employees, revenue, "fundingRaised", "joinedAt", description, notes, documents, kpis, "createdAt", "updatedAt") FROM stdin;
stu-0615	MedMapp	Shohjahon Mirakov	\N	+998336797721	MVP	ACCELERATING	MedTech	0	0.00	20000.00	2025-01-01	Online telegram bot orqali bemorlarga tashxis qo'yish va tez yordam chaqirish tizimi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:56.990566+00	2026-08-31 17:19:56.990566+00
stu-0617	Test time	Salimjon Xozratqulov	\N	+998996643470	PRE_MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	Onlayn test topshirish umumiy statistika mukammal test tahlili imkoniyati, orqali natijalarni tahlil qilish va yordamida bilim darajasini aniqlash imkonini beradi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:57.178319+00	2026-08-31 17:19:57.178319+00
stu-0612	Project LA	Jahongir Davronov	\N	+998918219882	MVP	ACCELERATING	Game Dev	0	0.00	0.00	2025-01-01	Vizual 3d grafika texnologiyasiga asoslangan LA uchish apparatlari vizual boshqaruv tizimi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:56.707219+00	2026-08-31 17:19:56.707219+00
stu-0618	Intizomli	Zafarbek G’aniyev	\N	+998915628772	PRE_MVP	ACCELERATING	CRM	0	0.00	0.00	2025-01-01	Korxonalar uchun xodimlar tabel tizimini yurituvchi avtomatlashtirilgan tizim, bunda tizim face ID va QR kodlarni skanerlash texnologiyasiga asoslangan	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:57.270994+00	2026-08-31 17:19:57.270994+00
stu-0619	Raqamli kutubxona	Abbos Xalilov	\N	+998916411414	PRE_MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	Avtomatlashtirilgan axborot resur markazi (Kutubxona), bunda kitoblarni berish va olish, ularni ruyxatga olish va skanerlash avtomatlashgan holda amalga oshiriladi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:57.366824+00	2026-08-31 17:19:57.366824+00
stu-0640	AI kitob tafsiya qilish tizimi	Og'abek Toshniyozov	\N	+998972001426	MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	O‘zbekistondagi axborot-kutubxona tizimlarida sun’iy intellektga asoslangan semantik kitob tavsiya qilish tizimini joriy qilish	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:57.459895+00	2026-08-31 17:19:57.459895+00
stu-0622	Espedia	Shosura Husenova	\N	+998973112610	MVP	ACCELERATING	EdTech	1	0.00	0.00	2025-01-01	Kasbga yo'naltirilgan mobil o’quv platformasi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:55.856762+00	2026-08-31 17:19:55.856762+00
stu-0621	Beautix	Kamola Botirova	\N	+998771840518	MVP	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Kosmetika guyumlarini online xarid qilish	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:55.763752+00	2026-08-31 17:19:55.763752+00
stu-0624	Aqilli maktab	Qurbonazarov Ro'zmonbek	\N	+998970979023	MVP	ACCELERATING	EdTech	0	0.00	20000.00	2025-01-01	"Aqilli Maktab" - Xususiy Maktablar Uchun Raqamli Yechim!	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,https://startupbase.uz/uz/startups/1460}	\N	2026-08-31 17:19:56.042883+00	2026-08-31 17:19:56.042883+00
stu-0623	Stadion top	Salimjon Xozratqulov	\N	+998973130055	PRE_MVP	ACCELERATING	CRM Retail	1	0.00	0.00	2025-01-01	Mavjud mini stadionlarni online band qilish, ularga bog’lanish va ularga mavjud sharoitlarni aniqlash imkoni beruvchi platforma	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:55.949727+00	2026-08-31 17:19:55.949727+00
stu-0625	AI security	Hojiakbar Egamberdiyev	\N	+998906094200	IDEA	ACCELERATING	Al	0	0.00	0.00	2025-01-01	Jamoat joylarida Al yordamida sovuq qurollarni aniqlash tizimi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.138503+00	2026-08-31 17:19:56.138503+00
stu-0627	D-construction	Temurbek Orziyev	\N	+998990625050	MVP	ACCELERATING	CRM	0	0.00	0.00	2025-01-01	Qurilish hujjatlarini avtomatik almashish va nazorat qilish imkoni beruvchi crm tizim	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.332821+00	2026-08-31 17:19:56.332821+00
stu-0628	Sos gas	Sevinch Nuriddinova	\N	+998886381504	MVP	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Xonadonlarda Is gazi miqdorini aniqlovchi Smart uy mexanizmi, datchik va signalizatsiya orqali mobil ilovaga xabar beradi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.426457+00	2026-08-31 17:19:56.426457+00
stu-0629	Fellow traveler	Qobil Baratov	\N	+998907165149	MVP	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Yo’lovchi - loyihaning mazmuni viloyatlar va tumanlararo yo'lovchilarga avtomobil egalari bilan o'zaro aloqani ta'minlovchi mobil ilova	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.519212+00	2026-08-31 17:19:56.519212+00
stu-0630	Masters	Nodira Gofurova	\N	+998907165149	IDEA	ACCELERATING	Retail	0	0.00	0.00	2025-01-01	Ustalar xizmatini onlayn buyurtma qilish va chaqirtirishga asoslangan mobil ilova va sayt ishlab chiqish	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.613803+00	2026-08-31 17:19:56.613803+00
stu-0616	Marjon	Furqat Nurimov	\N	+998974434519	PRE_MVP	ACCELERATING	Retail	1	0.00	0.00	2025-01-01	Reklama uchun avtomobillar va yuk avtomobillari kuzovlariga reklamalar joylashtirish va qo’shimcha rekalama xizmatlarini taqdim etish loyihasi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:57.085277+00	2026-08-31 17:19:57.085277+00
stu-0613	Yammiy	Gulruh Ismoilova	\N	+998912256169	MVP	ACCELERATING	Retail	0	0.00	15000.00	2025-01-01	Ananaviy taomlarni online buyurtma qilish va davtaska xizmati	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,https://startupbase.uz/uz/startups/291}	\N	2026-08-31 17:19:56.799987+00	2026-08-31 17:19:56.799987+00
stu-0614	Next KPI	Nazirjon Jo'rayev	\N	+998502505421	PRE_MVP	ACCELERATING	CRM	0	0.00	0.00	2025-01-01	Next KPI — bu universitet pedagogik xodimlarning samaradorligini baholash va tahlil qilish uchun mo'ljallangan innovatsion dastur.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,https://startupbase.uz/uz/startups/221}	\N	2026-08-31 17:19:56.896815+00	2026-08-31 17:19:56.896815+00
stu-0662	Beenest	Javohir Baxshilloyev	\N	+998888832005	MVP	ACCELERATING	Agro tech	0	0.00	0.00	2026-01-01	Beenest — bu qishloq xo‘jaligi va asalarichilik sohalarida\nsamaradorlikni oshirishga qaratilgan sun’iy intellektga asoslangan\nraqamli platforma. Loyiha dehqonlar va asalarichilar o‘rtasidagi\nhamkorlikni avtomatlashtiradi, changlatish jarayonini AI yordamida\noptimallashtiradi va hosildorlikni oshirishga xizmat qiladi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.803281+00	2026-08-31 17:19:59.803281+00
stu-0655	Yemak	Ruslan Rustamov	\N	+998943301313	GROWTH	ACCELERATING	Socials	0	0.00	100000.00	2025-01-01	restoran, kafe va choyxonalardan mazali taomlarni yetkazib beruvchi xizmat	{}	{https://startupbase.uz/uz/startups/100}	\N	2026-08-31 17:19:59.240019+00	2026-08-31 17:19:59.240019+00
stu-0651	Solar Guard	Navruzbek Norboboyev	\N	+998940997279	IDEA	ACCELERATING	Energy	0	0.00	0.00	2025-01-01	Chang, soyalanish yoki nosozlik aniqlansa, avtomatik SMS orqali ogohlantiradi. Dronlar yordamida panellarni vizual tekshiradi vamuammoli joylarni aniqlaydi, yongʻinni bartaraf qiladi. Maxsus tozalash mexanizmi changni avtomatik artib tashlaydi. Bularning barchasi mobil ilova orqali masofadan boshqariladi.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:59.89682+00	2026-08-31 17:19:59.89682+00
stu-0633	Smart fuel	Zarina Qo'ziboyeva	\N	+998500710401	IDEA	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Innovatsion yoqilg i quyish shahobchasi, MOBIL ILOVA YOKI QR-KOD ORQALI IDENTIFIKATSIYA AVTOMOBIL YONILG'I QUYISH TIZIMI KARTOCHKA YOKI MOBIL ILOVA ORQALI TO'LOV	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.39915+00	2026-08-31 17:19:58.39915+00
stu-0634	Green credit	Marifat Eshtemirova	\N	+998993309844	IDEA	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Ekologiya sohasida imtiyozli kredit berishga asoslangan mobil ilova mexanizmi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.49343+00	2026-08-31 17:19:58.49343+00
stu-0635	Cosmetology marketplace	Sevinch Shojalilova	\N	+998910716326	IDEA	ACCELERATING	Retail	0	0.00	0.00	2025-01-01	Kosmetalogiya sohasida maxsulotlarni online sotish va buyurtma qilish imkonini beruvchi elektron savdo platformasi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.586514+00	2026-08-31 17:19:58.586514+00
stu-0636	Cosmetology marketplace	Sevinch Shojalilova	\N	+998910716326	IDEA	ACCELERATING	Retail	0	0.00	0.00	2025-01-01	Kosmetalogiya sohasida maxsulotlarni online sotish va buyurtma qilish imkonini beruvchi elektron savdo platformasi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.680511+00	2026-08-31 17:19:58.680511+00
stu-0637	Laliga manager	Salimjon Xozratqulov	\N	+998914684388	MVP	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Futbol ishqibozlari uchun cheklanmagan resurslarda, real vaqt rejimida, mukammal maydonni his qilgan holda, qimordan holi strategik o'yin platformasi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.774297+00	2026-08-31 17:19:58.774297+00
stu-0638	Tomchilab sug'orish AI asosida	Adilbek Turg'unov	\N	+998987777961	IDEA	ACCELERATING	AI, AgroTech	0	0.00	0.00	2025-01-01	Sun'iy intellect asosida Qashqadaryodagi oqova suvlarni filtrlab, tomchilatib sug‘orish tizimini optimallashtirish apparatdasturiy ta’minotini yaratish va qo’llash	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.867273+00	2026-08-31 17:19:58.867273+00
stu-0639	XIU Onlayn universitet	Asliddin Abdujabborov	\N	+998942025511	MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	Universitetlar uchun to’liq masofaviy o'quv tizimi crm dasturi. Bunda hemis tizimi bilan to'liq integratsiya mavjud.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,https://startupbase.uz/uz/startups/1948}	\N	2026-08-31 17:19:58.960263+00	2026-08-31 17:19:58.960263+00
stu-0656	Diagno AI	Javohir Jahonov	\N	+998999402807	MVP	ACCELERATING	AI, MedTech	0	0.00	0.00	2026-01-01	Diagno AI — bu sog‘liqni saqlash sohasida bemor va klinika o‘rtasidagi muloqotni raqamlashtirish va avtomatlashtirishga qaratilgan sun’iy intellekt asosidagi platformadir.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.146813+00	2026-08-31 17:19:59.146813+00
stu-0643	Green check	Dilshod Narzullayev	\N	+998943501144	MVP	ACCELERATING	Agro tech	0	0.00	0.00	2025-01-01	Sun’iy intelekt yordamida meva-sabzavotlarning kasalliklarini erta\naniqlash tizimi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing,+}	\N	2026-08-31 17:19:57.743519+00	2026-08-31 17:19:57.743519+00
stu-0644	Kelajak sari qadamlar	Bekjon Bahriddinov	\N	+998942586045	IDEA	ACCELERATING	Al	0	0.00	0.00	2025-01-01	Dronlar tizimini aqlli qo'lqoplar orqali boshqarish, qulay va innovatsion yechim	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:57.838077+00	2026-08-31 17:19:57.838077+00
stu-0645	SmartLog	Ozoda Rashidova	\N	+998973191650	IDEA	ACCELERATING	Logistics	0	0.00	0.00	2025-01-01	Sun’iy intellekt asosida marshrut tanlash GPS orqali real vaqt kuzatuv Avtomatik hujjatlashtirish Onlayn buyurtma va to‘lov tizimi.\n“SmartLog” tizimi sun’iy intellekt va GPS texnologiyalariga asoslanadi. Foydalanuvchi yukni onlayn buyurtma qiladi, tizim esa eng qisqa va xavfsiz yo‘lni avtomatik tanlaydi.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:57.931829+00	2026-08-31 17:19:57.931829+00
stu-0646	O'qish Time	Asilbek Ziyadullayev	\N	+998881113811	IDEA	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	Ushbu dastur talaba yoshlarga o`z vaqtlarini samarali taqsimlashlariga va diqqatlarini ko`proq ta`lim olishga qaratishlariga yordam beradi.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.02445+00	2026-08-31 17:19:58.02445+00
stu-0647	Giftly	Feruza Sharipova	\N	+998906756003	IDEA	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Turli tadbirlarga xizmat ko‘rsatish sohasida faoliyat yuritadigan tadbirkorlar va sovg’alar do’konlarini bitta platformada jamlash	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.119521+00	2026-08-31 17:19:58.119521+00
stu-0680	Avten uz	Shoxrux Samiyev	\N	+998971432001	MVP	ACCELERATING	Technic	0	0.00	0.00	2026-02-01	Ushbu platforma Oʻzbekistondagi yoʻlda qolib ketgan mashinalarga xizmat koʻrsatadi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:01.515345+00	2026-08-31 17:20:01.515345+00
stu-0670	Xisobchi	Dilshod Narzullayev	\N	+998943501144	MVP	ACCELERATING	Agro tech	0	0.00	0.00	2026-01-01	Qurilish sohasida foydalanadigan xom ashyolar, qum va shag'al materiallari sotuvlari uchun CRM avtomatlashgan tizimi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:00.477583+00	2026-08-31 17:20:00.477583+00
stu-0671	Vet Watch	Dilshod Narzullayev	\N	+998943501144	MVP	ACCELERATING	Agro tech	0	0.00	0.00	2026-01-01	Zamonaviy texnologiyalar yordamida chorva mollarining holatini, harakatini va salomatligini real vaqt rejimida kuzatish orqali fermerlar daromadini oshirish	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:00.571265+00	2026-08-31 17:20:00.571265+00
stu-0658	Zirh AI	Sardor Quziboyev	\N	+998700105011	MVP	ACCELERATING	Cybersecurity	0	0.00	0.00	2026-01-01	Telegram guruhlarda admin sifatida ishlaydi\nHar bir havola va faylni avtomatik tekshiradi\nXavfli kontentni: ▪ ANIQLAYDI, ▪ OGOHLANTIRADI,  ▪ O’CHIRADI	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.3348+00	2026-08-31 17:19:59.3348+00
stu-0667	Teach Check	Abdulaziz Kenjayev	\N	+998912111418	MVP	ACCELERATING	EdTech	0	0.00	0.00	2026-01-01	Bu loyiha Til o'qituvchilarining vaqtini Al yordamida avtomatlashtirish va darslarni qiziqarli qilish maqasadida metodlar va kerakli materiallarni internetdan qidirib ko'p vaqt yo'qotmasdan qisqa vaqt ichida kerakli materiallarni olish orqali 80% gacha vaqtlarini tejash va ta'lim sifatini oshirishga qaratilgan.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:00.187628+00	2026-08-31 17:20:00.187628+00
stu-0664	Locust	Firdavs Namozov	\N	+998936555056	MVP	ACCELERATING	Military	0	0.00	0.00	2026-01-01	LOCUST'ni taqdim etamiz MARL va SWARM -texnologiyalariga asoslangan inqilobiy avtonom dron tizimi boʻlib, u zamonaviy urush tushunchasini qayta belgilaydi. Ushbu innovatsion yondashuv ilg'or algoritmlar va muvofiqlashtirilgan to'da (swarm) intellekti yordamida jang maydonida operativ samaradorlik va taktik ustunlikni oshiradi.	{}	{https://prezi.com/view/FkWjfEv41GWEVftu6WmO/?referral_token=C5fsuplnB3FN}	\N	2026-08-31 17:20:01.32621+00	2026-08-31 17:20:01.32621+00
stu-0659	X Face	Gulshona Sodiqova	\N	+998773703317	MVP	ACCELERATING	Cybersecurity	0	0.00	0.00	2026-01-01	SUN'IY INTELLEKTGA ASOSLANGAN HOLDA EKRAN TASVIRLARIDAN YUZNI TANIB OLISH DASTURI, Dastur qurilmaning ekranida ijro etilayotgan medialarni doimiy tarzda kuzatib boradi va ta'qiqlangan qiyofalar paydo bo'lganda foydalanuvchini bildrishnoma orqali ogohlantiradi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.614588+00	2026-08-31 17:19:59.614588+00
stu-0657	PlantCare	Dilshod Narzullayev	\N	+998943501144	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-01-01	PlantCare — bu sun’iy intellekt asosida ishlovchi raqamli platforma bo‘lib, meva va sabzavotlarda uchraydigan kasalliklarni erta bosqichda aniqlashga mo‘ljallangan.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.427788+00	2026-08-31 17:19:59.427788+00
stu-0665	UzPast	Zahro Inatullayeva	\N	+998916356019	MVP	ACCELERATING	Turism	0	0.00	0.00	2026-01-01	UzPast — bu O‘zbekistonning qadimiy tarixi va\nmadaniy merosini raqamli ko‘rinishda keng\nommaga yetkazishga qaratilgan innovatsion\nloyiha.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing,https://startupbase.uz/uz/startups/2070}	\N	2026-08-31 17:20:00.281147+00	2026-08-31 17:20:00.281147+00
stu-0650	Cultural Camp in Uzbekistan	Aziza Nasredinova	\N	+998908901901	MVP	ACCELERATING	Turism	0	0.00	0.00	2025-01-01	"Cultural Camp in Uzbekistan" loyihasi xorijlik talaba va o'quvchilarga mo'ljallangan 6 kunlik madaniy almashinuv dasturidir. Ushbu loyiha ishtirokchilarga O'zbekistonning boy milliy an'analari, tarixi, san'ati va madaniyatini chuqur o'rganish imkonini beradi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.707525+00	2026-08-31 17:19:59.707525+00
stu-0669	Ekonomist girls	Nargiza Rahimova	\N	+998888041233	IDEA	ACCELERATING	EdTech	0	0.00	0.00	2026-01-01	VIRTUAL ISHXONA — TALABALAR UCHUN VR AMALIYOT LABORATORIYASI	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:00.377467+00	2026-08-31 17:20:00.377467+00
stu-0678	ZONIC	Og'abek Avazov	\N	+998906770327	MVP	ACCELERATING	Sport	0	0.00	0.00	2026-02-01	ZONIC - bu joylashuvga asoslangan xizmatlar va fitnes texnologiyalarini birlashtirgan Super Ilova. Platforma foydalanuvchilarga ilg'or Avstraliya fitnes metodologiyalari tajribasi uslubida yuqori intensivlikdagi mashg'ulotlarni, shuningdek, "Yugur va zabt et" tamoyiliga asoslangan musobaqalarni taklif etadi. Ilova foydalanuvchining jismoniy faolligini kuzatib boradi, yugurish yo'nalishlarini tahlil qiladi va ularga mahalliy jamoalar orasida mintaqaviy yetakchilik uchun kurashish imkonini beradi.	{}	{https://startupbase.uz/media/presentations/zonic_startupbase_1.pdf,https://startupbase.uz/uz/startups/1588}	\N	2026-08-31 17:20:01.230376+00	2026-08-31 17:20:01.230376+00
stu-0668	IT vision	Fotima Mirzapo'latova	\N	+998973160617	IDEA	ACCELERATING	Ecology	0	0.00	0.00	2026-01-01	Air Clean Drones - Innovatsion havoni tozalash tizimi shaharlarimizni toza havo bilan ta'minlash uchun zamonaviy texnologik yechim.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:01.422045+00	2026-08-31 17:20:01.422045+00
stu-0673	To'yim Bor	Doniyor Mavlonov	\N	+998943350531	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-01-01	To'yxonalarni bron qilish va xizmatlarini umumlashtiradigan platforma bo'lib, bunda siz nafaqat tuy balki biror banketlar uchun ham tadbir joylarini va xizmatlaridan foydalanishingiz mumkin.	{}	{}	\N	2026-08-31 17:20:00.758279+00	2026-08-31 17:20:00.758279+00
stu-0677	Gym Management\nSystem	G'olib Narzullayev	\N	+998908717181	MVP	ACCELERATING	Sport	0	0.00	0.00	2026-01-01	Gym Management System — sport zallarini boshqarish uchun yaratilgan\nzamonaviy ilova. U sport zali egasiga, adminlarga va oddiy\nfoydalanuvchilarga qulay tarzda ishlash imkonini beradi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:01.040602+00	2026-08-31 17:20:01.040602+00
stu-0682	MIROB AI	Sardorbek Samadov	\N	+998883104041	MVP	ACCELERATING	AgroTech	0	0.00	0.00	2026-02-01	IoT qurilmalarim yordamida tuproq namligi va sug'orish tizimlarini tahlil qilish va suv sarfini kamaytirish	{}	{https://startupbase.uz/media/presentations/Mirob_AI_Pitch_Deck.pdf}	\N	2026-08-31 17:20:02.079532+00	2026-08-31 17:20:02.079532+00
stu-0696	"Smart Irrigation AI – Mirishkor"	Sherzod Murtazoyev	\N	+998908953672	IDEA	ACCELERATING	Agro	0	0.00	0.00	2026-03-01	Mirishkor tumani dalalarida suv iste'molini optimallashtirish uchun sun'iy intellektdan foydalangan holda aqlli sug'orish tizimini ishlab chiqish.	{}	{https://startupbase.uz/media/presentations/Mirishkor_tumanda_zamonaviy_dalalarni_sugorish_texnologiyasi_boyicha.pdf,https://startupbase.uz/uz/startups/1665}	\N	2026-08-31 17:20:03.49177+00	2026-08-31 17:20:03.49177+00
stu-0676	AI HR	Temurbek Gulboyev	\N	+998939391306	MVP	ACCELERATING	HR	0	0.00	0.00	2026-01-01	Telegram bot platformasi kurinishida AI ga asoslangan xodimlar malakasini oshirish tizimi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:01.136453+00	2026-08-31 17:20:01.136453+00
stu-0706	Hallaym edu	Narzullayev Zinurbey	\N	+998908758277	MVP	ACCELERATING	EdTech	0	0.00	0.00	2026-04-01	O'zbekistonda Yangi Avlod Ta'lim Platformasi, ZOOM analigi sifatida online konferensiya orqali dars mashg'ulotlarini amalga oshiriladi	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:03.024564+00	2026-08-31 17:20:03.024564+00
stu-0692	Chiqindi resurs	Sarvinoz Rustamova	\N	+998930728434	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-03-01	Ushbu platforma chiqindilarni samarali boshqarish, qayta ishlash va ekologik madaniyatni oshirishga qaratilgan raqamli platformadir. Ilova orqali qayta ishlash punktlari xaritasi, ekobozor, ta’limiy resurslar va AI yordamchi birlashtiriladi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:03.118536+00	2026-08-31 17:20:03.118536+00
stu-0684	Logi AI	Mirjalol Shavkatov	\N	+998906792347	MVP	ACCELERATING	Logistics	0	0.00	0.00	2026-02-01	Agentli dispetcherlar bir vaqtning o'zida 100 dan ortiq brokerlar bilan gaplashishlari mumkin. RateCon ishlov berish ham qo'lda bajariladi va yordamchi bilan avtomatlashtiriladi. Numeo.ai da muhandislik tajribasiga ega.	{}	{https://startupbase.uz/media/presentations/AI_Innovation.pdf,https://startupbase.uz/uz/startups/1461}	\N	2026-08-31 17:20:01.892506+00	2026-08-31 17:20:01.892506+00
stu-0695	OXY-COLUMN	Ogabek Ravshanov	\N	+998912110157	IDEA	ACCELERATING	Ecology	0	0.00	0.00	2026-03-01	Loyiha xlorella suv o'tlari bilan to'ldirilgan shaffof ustunga asoslangan. Maxsus tizim shahar havosini so'rib oladi va uni suv tubidan o'tkazadi. Ushbu tizimda suv o'tlari fotosintez orqali karbonat angidridni yutadi va kislorodni chiqaradi.	{}	{https://startupbase.uz/media/presentations/OXY_COLUMN_Shahar_havosini_namli_bioreaktorlar_orqali_tozalash_ilmiy.pdf,https://startupbase.uz/uz/startups/1718}	\N	2026-08-31 17:20:03.398734+00	2026-08-31 17:20:03.398734+00
stu-0675	One World	B. Usarov	\N	+998906734209	IDEA	ACCELERATING	Cypto	0	0.00	0.00	2026-01-01	OneWorld — bu olti modulli yagona raqamli platforma bo'lib, foydalanuvchilarga ta'lim, investitsiya, savdo, ish topish, xayriya va shaxsiy taraqqiyotni kuzatish imkoniyatini taqdim etadi. Barcha modullar OneWallet orqali bog'langan va AI tahlil vositalari bilan qo'llab-quvvatlanadi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:00.945719+00	2026-08-31 17:20:00.945719+00
stu-0674	IT Work	Sunnatillo Bekmurodov	\N	+998997370910	MVP	ACCELERATING	HR Tech	0	0.00	0.00	2026-01-01	IT sohasida e'lonlar, buyurtmalar va ish o'rinlari (vakansiyalar) joylashtirish uchun online Platforma bo'lib xizmat qiladi.	{}	{https://itwork.uz/}	\N	2026-08-31 17:20:00.852024+00	2026-08-31 17:20:00.852024+00
stu-0694	Rent equip	Javohir Baxshullayev	\N	+998888832005	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-03-01	Foydalanuvchi (qurilish yoki ishlab chiqaruvchi tadbirkor) platformaga kirib, kerakli texnika yoki uskunani tanlaydi. Narx, mavjudlik, texnika holati va reytinglar oldindan ko‘rsatiladi. Buyurtma bir necha daqiqa ichida amalga oshiriladi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing,https://startupbase.uz/uz/startups/2060}	\N	2026-08-31 17:20:03.305644+00	2026-08-31 17:20:03.305644+00
stu-0711	MindGuard	Fotima Mirzapoʻlatova	\N	+998973160617	MVP	ACCELERATING	Cybersecurity	0	0.00	0.00	2026-05-01	MindGuard — bu bolalar va yoshlarni zararli raqamli kontentdan himoya qiluvchi innovatsion AI-platforma. Bizning vizyonimiz: "Har bir bolani internetdagi xavfdan himoya qilish, internetni bolaga moslashtirish va sog‘lom raqamli avlod yaratish	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.245318+00	2026-08-31 17:20:04.245318+00
stu-0714	Smart Diabet AI	Mehriddin Abdisamatov	\N	+998884551221	MVP	ACCELERATING	MedTech	0	0.00	0.00	2026-05-01	SMART DIABETES AI ilovasi foydalanuvchining sog’ligini sun’iy intellekt yordamida real vaqt rejimida  kuzatadi. Ilova qand darajasini baholaydi, xavfni aniqlaydi va foydalanuvchiga shaxsiy  tavsiyalar beradi. Shuningdek, zarurat tug’ilganda shifokorga murojaat qilishni tavsiya qiladi.	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.342171+00	2026-08-31 17:20:04.342171+00
stu-0712	Green Cycle	Sharipov Shohjahon	\N	+998883188185	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-05-01	Shahar ekotizimini yaxshilash uchun innovatsion texnologik yechim. Chiqindilarni yig'ishni oson, qiziqarli va foydali qilish.	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.435289+00	2026-08-31 17:20:04.435289+00
stu-0715	Smart Flaw	Sharipov Shohjahon	\N	+998882290512	MVP	ACCELERATING	SaaS	0	0.00	0.00	2026-05-01	QR kod asosida aqlli ovqat buyurtma qilish va to'lov tizimi platformasi	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.529065+00	2026-08-31 17:20:04.529065+00
stu-0713	AMI	Madina Mustafoyeva	\N	+998948511203	MVP	ACCELERATING	EdTech	0	0.00	0.00	2026-05-01	AMI 24/7 AI yordamchi, 1 soniyada javob, Xatolarni eslab qoladi, Hech qanday navbat, 24/7 mavjud	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.622479+00	2026-08-31 17:20:04.622479+00
stu-0716	SilkRoadBelt	Sevara Xasanova	\N	200156959                         883188185	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-05-01	Markaziy Osiyodagi Birinchi Milliy Taomlar Conveyor Restorani	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.715816+00	2026-08-31 17:20:04.715816+00
stu-0717	NanoStup	Shohruhbek Temirov	\N	+998501093514	MVP	ACCELERATING	Saas	0	0.00	0.00	2026-01-01	NanoStUp — AI yordamida bir necha daqiqada professional web-sayt	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing,https://startupbase.uz/uz/startups/2030}	\N	2026-08-31 17:20:04.808991+00	2026-08-31 17:20:04.808991+00
stu-0721	Price Tech	Feruza A'zamova	\N	+998973737678	IDEA	ACCELERATING	FinTech	0	0.00	0.00	2026-06-01	Price Tech — do‘konlar uchun aqlli elektron narx yorliqlari tizimi. Narxlar real vaqt rejimida avtomatik yangilanadi, xatolar va mehnat xarajatlari kamayadi. Tizim bosilganda mahsulot nomi va narxini ovozli e’lon qilib, ko‘zi ojiz xaridorlar uchun ham qulaylik yaratadi.	{}	{https://startupbase.uz/uz/startups/1932}	\N	2026-08-31 17:20:04.903269+00	2026-08-31 17:20:04.903269+00
stu-0688	NoAsk	Dilshod Jovliyev	\N	@dilshod_1103_ts	IDEA	ACCELERATING	Socials	0	0.00	0.00	2026-03-01	Restoranlardagi barcha muammolarga bitta ilovada yechim, restaranlar faoliyatini raqamlashtirish tizimi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:02.269959+00	2026-08-31 17:20:02.269959+00
stu-0689	Scanny	Kamola Botirova	\N	+998771840518	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-03-01	Noto’g’ri ovqatlanish sabab dunyodagi har 10 kishidan 9 tasining sog'lig'i ich ichidan yemirilyapti, lekin ularning o'zi ham, shifokorlar ham buni hali bilishmaydi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:02.363299+00	2026-08-31 17:20:02.363299+00
stu-0700	FoodVision AI	Muhammad Nosirov	\N	+998944690306	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-04-01	Ovqat sanoatida AI orqali kaloriya hisoblash loyihasi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:02.457792+00	2026-08-31 17:20:02.457792+00
stu-0701	Mevalarni Yig'ish Mashinasi	Vazira Normo‘minova	\N	+998908972897	IDEA	ACCELERATING	Agro	0	0.00	0.00	2026-04-01	Интенсив боғлардан данакли меваларни йиғиш машинасини такомиллаштириш	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:02.551855+00	2026-08-31 17:20:02.551855+00
stu-0702	Fonus kids	MUZAFFARBEK ZAIROV	\N	+998959550045	PRE_MVP	ACCELERATING	SaaS	0	0.00	80000.00	2026-04-01	Fonus Kids - xavfsiz videolar, ota-ona nazorati va qiziqarli ta’lim kontentini taklif qiluvchi madaniy moslashtirilgan, reklamasiz platforma.	{}	{https://startupbase.uz/media/presentations/FONUS_-_pitch_global_compressed.pdf}	\N	2026-08-31 17:20:02.645018+00	2026-08-31 17:20:02.645018+00
stu-0703	Med tahlil	Temur Abduraxmonov	\N	+998332009131	MVP	ACCELERATING	MedTech	0	0.00	0.00	2026-04-01	AI yordamida Online tibbiyot tahlili va analizlarini amalga oshirish uchun mo'ljallangan tibbiy platforma	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:02.742032+00	2026-08-31 17:20:02.742032+00
stu-0704	AtiliX	Intizor Xudoyqulova	\N	+998945881702	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-04-01	Online ayollar kiyimlarini tiktirish ya'ni atelye xizmatlarini amalga oshirish platformasi	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:02.83525+00	2026-08-31 17:20:02.83525+00
stu-0705	TechBirja	Ozodbek Zoirov	\N	+998932472247	MVP	ACCELERATING	FinTech	0	0.00	0.00	2026-04-01	O'yin akkauntlari, Telegram kanallar, username'lar, Instagram sahifalar va boshqa raqamli aktivlarni xavfsiz sotish va sotib olish platformasi.	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:02.931139+00	2026-08-31 17:20:02.931139+00
stu-0710	Agroduo	Yulduz Murodjonova	\N	+998886379222	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-05-01	Intensiv Almashlab Ekish Tizimi g‘o‘za + pomidor kombinatsiyasida yangi almashlab ekish tizimini taklif etadi.	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.1522+00	2026-08-31 17:20:04.1522+00
stu-0691	Volun Uz	Abdulaziz Kenjayev	\N	+998912111418	MVP	ACCELERATING	Turism	0	0.00	0.00	2026-03-01	Volun Uz - bu butun dunyodan kelgan ko'ngillilarni O'zbekistonning kamroq taniqli mintaqalari bilan bog'laydigan platforma. Loyiha ichki turizmni rivojlantiradi va mahalliy hamjamiyat va xorijiy ko'ngillilarni birlashtiradi.	{}	{https://startupbase.uz/media/presentations/White_Blue_Aesthetic_Minimalist_Elegant_Travel_Tour_Seoul_South_Korea_Pres_f6OmWA8.pdf,https://startupbase.uz/uz/startups/1727}	\N	2026-08-31 17:20:05.844547+00	2026-08-31 17:20:05.844547+00
stu-0699	Agroduo	Yulduz Murodjonova	\N	+998886379222	IDEA	ACCELERATING	Agro	0	0.00	0.00	2026-04-01	“Agroduo” ерни ҳолатини яхшилаш ва алмаштириб экиш.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:03.776576+00	2026-08-31 17:20:03.776576+00
stu-0611	Chill	Asilbek Shukurov	\N	+998975855432	MVP	ACCELERATING	Game Dev	0	0.00	0.00	2025-01-01	Tarixiy Shaharlarni 3d modelini vizual ko'rinishda tayyorlash va game yaratish (Yerqo'rg'on tarixiy yodgorligi misolida)	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:20:05.937557+00	2026-08-31 17:20:05.937557+00
stu-0708	STATLY	Boburjon Abdug'aniyev	\N	+998919630770	MVP	ACCELERATING	Reatail	0	0.00	0.00	2026-04-01	Savdo ombor nazorati va biznes tahlinini avtomatlashtiruvchi AI asosidagi retail platforma	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:04.058582+00	2026-08-31 17:20:04.058582+00
stu-0709	VetCare	Madina Baxromova	\N	\N	MVP	ACCELERATING	Ecology	0	0.00	0.00	2026-05-01	VetCare Platform - uy hayvonlari va ularning egalarining hayotini yaxshilash uchun raqamli yechim	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:03.965521+00	2026-08-31 17:20:03.965521+00
stu-0719	Fleet Bridge	Dilorom Poyonova	\N	+998914451334	IDEA	ACCELERATING	HR	0	0.00	0.00	2026-06-01	FleetBridge - yuk tashish kompaniyalari va CDL haydovchilarini bog‘laydigan ishga qabul qilish platformasi.	{}	{https://startupbase.uz/uz/startups/2041}	\N	2026-08-31 17:20:05.187655+00	2026-08-31 17:20:05.187655+00
stu-0720	Telemedicine	Shahzod Davlatov	\N	+998886775302	IDEA	ACCELERATING	MedTech	0	0.00	0.00	2026-06-01	O‘zbekistonda telemeditsina xizmatlarini rivojlantirishga qaratilgan platforma bo‘lib, bemorlar va shifokorlar o‘rtasida onlayn konsultatsiyalarni tashkil etadi. Platforma tibbiy tarix, laboratoriya tahlillari va shifokor tavsiyalarini yagona tizimda saqlash imkonini beradi. Daromad modeli konsultatsiyalardan olinadigan komissiya va klinikalar uchun premium obunalarga asoslangan.	{}	{https://startupbase.uz/uz/startups/1978}	\N	2026-08-31 17:20:05.750577+00	2026-08-31 17:20:05.750577+00
stu-0725	CefrUp English	Choriyeva Aziza	\N	90 875 10 14                                                   97 660 10 14.	IDEA	ACCELERATING	EdTech	0	0.00	0.00	2026-06-01	CefrUp — CEFR imtihoniga tayyorlanayotgan o‘quvchilar uchun AI asosidagi baholash platformasi bo‘lib, yozma va og‘zaki ko‘nikmalarni tahlil qiladi, natijalarni baholaydi hamda shaxsiy tavsiyalar taqdim etadi.	{}	{https://startupbase.uz/media/presentations/CefrUpEnglish_Choriyeva_Aziza.pdf,https://startupbase.uz/en/startups/2091}	\N	2026-08-31 17:20:06.314093+00	2026-08-31 17:20:06.314093+00
stu-0649	Bilimdon Bolalar  Ensiklopdiyasi	Abram Islomov	\N	+998883161881	MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	Bu ta’limni o‘yin bilan uyg‘unlashtirgan onlayn platforma bo‘lib, unda har bir bola o‘z yoshiga mos tarzda yangi bilimlarni o‘rganadi. Sayt maktab yoshdagi bo‘lgan bolalar uchun mo‘ljallangan bo‘lib, materiallar soddalashtirilgan tilda, rasmlar, videolar, va ovozli izohlar bilan boyitilgan.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:20:06.034158+00	2026-08-31 17:20:06.034158+00
stu-0722	AI Freelancing	Abbos Olimov	\N	+998978810093	IDEA	ACCELERATING	EdTech	0	0.00	0.00	2026-06-01	Sun’iy intellekt va mashinali o‘rganishga asoslangan raqamli IT-markaz	{}	{https://startupbase.uz/uz/startups/1663}	\N	2026-08-31 17:20:05.094199+00	2026-08-31 17:20:05.094199+00
stu-0726	Mediro	HAKIMJON JUMAYEV	\N	+998883837717	EARLY_REVENUE	ACCELERATING	Retail	0	0.00	0.00	2026-06-01	Mediro — qurilish materiallari va maishiy texnika savdosi uchun yaratilgan raqamli marketplace platformasi bo‘lib, xaridorlar, sotuvchilar va kuryerlarni yagona ekotizimda birlashtiradi. Platforma buyurtma berish, to‘lovlarni amalga oshirish va yetkazib berishni boshqarishni avtomatlashtiradi.	{}	{}	\N	2026-08-31 17:20:06.220841+00	2026-08-31 17:20:06.220841+00
stu-0698	LowPing UZ	Unknown	\N	aanatagaxianidesu@gmail.com	IDEA	ACCELERATING	Gaming	0	0.00	0.00	2026-03-01	O'zbekistonda Minecraft, CS2, Rust va boshqa ko'p o'yinchi o'yinlari uchun past pingli (20-50 ms) mahalliy server xosting xizmati. O'zbek o'yinchilari uchun o'zbek tilida yuqori tezlik va qo'llab-quvvatlash.	{}	{https://startupbase.uz/media/presentations/Untitled_design.pdf,https://startupbase.uz/uz/startups/1665}	\N	2026-08-31 17:20:03.681814+00	2026-08-31 17:20:03.681814+00
stu-0723	MakMak Kids	Humoyun Homidov	\N	+998996670147	MVP	ACCELERATING	EdTech	0	0.00	0.00	2026-06-01	MakMak Kids — bolalar uchun interaktiv 3D ertaklar va ta’limiy mini o‘yinlar platformasi. Loyiha ingliz tilini o‘rganish, mantiqiy fikrlash va ijodkorlikni rivojlantirishga xizmat qiladi. QR-kod orqali bolalar virtual muhitga kirib, ertak qahramonlari bilan o‘yinlar, topshiriqlar va multimedia materiallardan foydalanish imkoniyatiga ega bo‘ladi.	{}	{https://startupbase.uz/uz/startups/1823}	\N	2026-08-31 17:20:05.283128+00	2026-08-31 17:20:05.283128+00
stu-0707	My feel	Samirbek Jabborov	\N	+998888835056	MVP	ACCELERATING	Socials	0	0.00	0.00	2026-04-01	MyFeel ijtimoiy tarmog'i— raqamli charchoqdan qutilib, ijtimoiy faollik va oilaviy qadriyatlar orqali real hayotga qaytish nuqtasidir. Biz bir-biridan uzilib qolgan insonlarni umumiy xotiralar va jonli muloqot atrofida qayta birlashtirmoqchimiz	{}	{https://drive.google.com/drive/folders/1HAazCWuboChLJmchWAtNsV6loQ8sv59d?usp=sharing}	\N	2026-08-31 17:20:03.869759+00	2026-08-31 17:20:03.869759+00
stu-0672	UstaGO	Javohir Sheraliyev	\N	+998883117739	MVP	ACCELERATING	Socials	1	0.00	0.00	2026-01-01	Ustalar xizmatlarini raqamlashtirish. Mijozlar uchun tez, ishonchli va qulay bronlash tizimi yaratish.  Ishsiz yoki mustaqil ustalarga barqaror mijoz oqimini ta’minlash.  Ustalar va mijozlar o’rtasida ishonchli baholash tizimi yaratish	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing,"Agro Venture Akseleratsiyaga qushilgan"}	\N	2026-08-31 17:20:00.665005+00	2026-08-31 17:20:00.665005+00
stu-0642	Facrib AI	Omadbek Juraqulov	\N	+998942427111	MVP	ACCELERATING	AI	0	0.00	0.00	2025-01-01	Fabric AI tizimi — bu real-time ishlovchi, yuqori aniqlikdagi va to‘liq avtomatlashtirilgan mato nuqsonlarini aniqlash platformasi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing,https://startupbase.uz/uz/startups/1398}	\N	2026-08-31 17:19:57.650249+00	2026-08-31 17:19:57.650249+00
stu-0693	Waste2Gas	Zinurbey Narzullayev	\N	+998908758277	IDEA	ACCELERATING	Ecology	0	0.00	0.00	2026-03-01	Waste2Gas — qishloq xo‘jaligi va maishiy organik chiqindilarni zamonaviy biotexnologiya orqali biogaz, metan va bioo‘g‘it ga aylantiruvchi ekologik loyiha. Bu loyiha doirasida: Go‘ng, o‘simlik qoldiqlari va oziq-ovqat chiqindilari yig‘iladi Maxsus yopiq reaktorda kislorodsiz muhitda parchalanadi Hosil bo‘lgan biogaz tozalanib energiya yoki transport yoqilg‘isi sifatida ishlatiladi	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:03.212297+00	2026-08-31 17:20:03.212297+00
stu-0641	Face Check tizimi	Dilshod Narzullayev	\N	+998943501144	MVP	ACCELERATING	EdTech	0	0.00	0.00	2025-01-01	SUN’IY INTELLEKT ASOSIDAGI ”RAQAMLI DAVOMAT TIZIMI”	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:57.553757+00	2026-08-31 17:19:57.553757+00
stu-0631	Go savdo	Marjona Jo'rayeva	\N	+998908690948	IDEA	ACCELERATING	Retail	0	0.00	0.00	2025-01-01	Online oziq ovqat maxsulotlari elektron bozori tizimi, bunda yaqin hududdagi tadbirkorlar bilan o’zaro mijoz sotuvini amalga oshiradi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:20:05.564116+00	2026-08-31 17:20:05.564116+00
stu-0620	Timgames	Timur Pulatov	\N	+998880211801	MVP	ACCELERATING	Game Dev	0	0.00	0.00	2025-01-01	O'yin quyidagilarni o'z ichiga oladi: Tashlab ketilgan kasalxona. O’tmish aks-sadolari. Soyalar sizni yutib yuborishidan oldin hal qiling, omon qoling va qoching.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:55.669544+00	2026-08-31 17:19:55.669544+00
stu-0663	Work Prime (Create Soft)	Luiza Mamanazarova	\N	+998934240409	MVP	ACCELERATING	AI	0	0.00	0.00	2026-01-01	AI asosida ish izlovchilarni mutahassislik salohiyatini baholaydigan, yashirin ko‘nikmalarini aniqlaydigan va HR kompaniyalarga eng mos nomzodlarni avtomatik tavsiya qiladigan platforma.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:05.470609+00	2026-08-31 17:20:05.470609+00
stu-0687	SayyohAI	A. Sagdullayev	\N	+998974511311	MVP	ACCELERATING	Turism	0	0.00	0.00	2026-03-01	TouristAI - bu sayyohlarga joylar bo'yicha tavsiyalar beradigan va ularning savollariga javob beradigan sun'iy intellektga asoslangan innovatsion platforma. Sun'iy intellekt tarixiy yodgorliklar, mehmonxonalar, transport va mahalliy madaniyat haqida batafsil ma'lumot berish orqali sayohatni yanada qulaylashtiradi. TouristAI foydalanuvchilarga ishonchli ma'lumotlarni tez va aniq yetkazib beradi.	{}	{https://startupbase.uz/media/presentations/Untitled_presentation.pdf}	\N	2026-08-31 17:20:01.986172+00	2026-08-31 17:20:01.986172+00
stu-0666	AI Bolajon	Abdulloh Ergashov	\N	+998937703270	MVP	ACCELERATING	EdTech	0	0.00	0.00	2026-01-01	Ushbu loyiha 3-12 bolalar uchun sun'iy intellektga asoslangan ta'lim va tarbiyani birlashtirgan ilova hisoblanadi. Ilova bolalarga O'qish, yozish, matematika va mantiqiy fikrlashni o'rgatadi . Bolalar va internetda cheklanmagan, zararli: kontentni ko'rmoqda. Bu ruhiyatga salbiy ta'sir qiladi "Al Video Darslar": Bolaga yoshiga mos, xavfsiz, •rivojlantiruvchi videolarni algoritm tartiblab beradi. Telefon bola uchun zararli emas, foydali o'qituvchi qurilmaga aylanadi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:05.657373+00	2026-08-31 17:20:05.657373+00
stu-0660	CW team	Shahrizoda Shamsiddinova	\N	+998939560524	MVP	ACCELERATING	Agro tech	0	0.00	0.00	2026-01-01	Qoraqalpog‘iston Respublikasi va Qashqadaryo viloyati Nishon va Muborak tumani sanoat korxonalarida chiqindi suvlarini yuksak suv o’tlari yordamida tozalash texnologiyasini joriy qilish.Shu bilan aholi ehtiyoji uchun ikkilamchi toza suv yetqazib berish.Qishloq xo‘jaligidagi, xususan baliqchilik,parrandachilik va chorva mollari uchun ozuqa sifatida taqim etish.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:19:59.520884+00	2026-08-31 17:19:59.520884+00
stu-0697	SmartB2B	Baxtishod Turdimurodov	\N	+998933396345	IDEA	ACCELERATING	AI	0	0.00	0.00	2026-03-01	""Smart-B2B"" - sun'iy intellektga asoslangan logistika va sanoat hamkorligi uchun platforma. Mintaqaviy tadbirkorlarning xarajatlarini 15% ga kamaytirish, yo'qotishlarni (axloqiy) foydaga aylantirish va zanjirni raqamlashtirish."	{}	{https://startupbase.uz/media/presentations/Smart-B2B_Qashqadaryo.pdf,https://startupbase.uz/uz/startups/1667}	\N	2026-08-31 17:20:03.587328+00	2026-08-31 17:20:03.587328+00
stu-0648	Uzbek Vision	Davlat Ruziqulov	\N	+998932403358	IDEA	ACCELERATING	Turism	0	0.00	0.00	2025-01-01	Turistlar uchun uy hunarmandchilik labaratoriyalarini tashkil qilish, turistlar uyarda uz qo'llari bilan hunarmandchilik qilib kurishlariga imkoniyat yaratish	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.212897+00	2026-08-31 17:19:58.212897+00
stu-0724	Plasma AI	Samadov Abdulloh	\N	+998909986667	EARLY_REVENUE	ACCELERATING	LegalTech	0	0.00	25000.00	2026-yil Mart oyi	Plasma AI — davlat xaridlari (B2G) va tender jarayonlarini avtomatlashtirishga mo‘ljallangan sun’iy intellekt platformasi. Tizim UzEx kabi elektron xarid portallaridan tender hujjatlarini avtomatik yig‘adi, talablarni tahlil qiladi, moslik (compliance) tekshiruvini amalga oshiradi hamda taklif (proposal) tayyorlash jarayonini soddalashtiradi. Plasma AI korxonalarga vaqt va resurslarni tejash, xatolarni kamaytirish hamda tenderlarda g‘olib bo‘lish imkoniyatlarini oshirishga yordam beradi.	{}	{}	\N	2026-08-31 17:20:06.127403+00	2026-08-31 17:20:06.127403+00
stu-0654	UnitLab AI	Шоҳрух Бекмирзаэв	\N	+998951759204	GROWTH	ACCELERATING	AI	1	0.00	1010000.00	2025-01-01	UnitLab Ai — бу AI-қувватланган дата аннотатион (маълумотларни автоматик белгилаш) платформаси бўлиб, компьютер кўриш тизимлари учун маълумотларни белгилаш, датасетларни бошқариш ва модель валидация қилиш жараёнларини сезиларли даражада тезлаштиради.	{}	{yemak.uz}	\N	2026-08-31 17:19:59.053402+00	2026-08-31 17:19:59.053402+00
stu-0718	LC Service Bot	Nurbek Rasulov	\N	+998330033953	IDEA	ACCELERATING	EdTech	0	0.00	0.00	2026-06-01	Ta’lim markazlari uchun avtomatlashtirilgan Telegram bot platformasi. Ushbu tizim orqali ta’lim markazlari BotFather orqali o‘z botlarini tayyorlashlari, uni xizmatimga ulashlari va kerakli funksiyalarni osongina faollashtirishlari mumkin	{}	{http://startupbase.uz/uz/startups/158}	\N	2026-08-31 17:20:04.999698+00	2026-08-31 17:20:04.999698+00
stu-0652	Turizm taqvimi	Jasmina Bozorova	\N	+998935680812	MVP	ACCELERATING	Turism	0	0.00	0.00	2025-01-01	Turizm taquimi - har bir viloyatning festivaliari, bayramlari va tadbirlarini aks ettiradi. Ushbu loyiha turistlarni jalb qilish va ularning viloyatlarda ko proq vaqt o tkazishlarini ta minlashga mo'ljallangan.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:19:59.990046+00	2026-08-31 17:19:59.990046+00
stu-0683	PrimMonitor_Pro	Murodulla Mannonov	\N	+998996631056	PRE_MVP	ACCELERATING	Cybersecurity	0	0.00	0.00	2026-02-01	PrimeMonitor Pro - O'zbekiston bozoridagi yagona to'liq mahalliy B2G kiberxavfsizlik platformasi. Davlat raqamlashtirish strategiyasi va kiberxavfsizlik talablarining ortib borishi fonida bozor imkoniyatlari juda katta."	{}	{https://startupbase.uz/media/presentations/PrimeMonitor_Pro_-_Investor_Pitch_Deck___Sapfirsoft.pdf,https://startupbase.uz/uz/startups/1562}	\N	2026-08-31 17:20:02.173619+00	2026-08-31 17:20:02.173619+00
stu-0626	Smart parking	Temurbek Orziyev	\N	+998990625050	IDEA	ACCELERATING	AI	0	0.00	0.00	2025-01-01	Avtomobillar uchun avtomatlashtirilgan zamonaviy smart avtoturargoh	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:56.239532+00	2026-08-31 17:19:56.239532+00
stu-0653	Smart beshik AI	Madina Husenova	\N	+998992040766	IDEA	ACCELERATING	AI	0	0.00	0.00	2025-01-01	Smart Beshik Al loyihasining bosh magsadi - chaqaloglar uchun xavfsiz, aqlli va qulay uyqu muhitini yaratishdir. Loyiha onalarning hayotini yengillashtirish, bolalarning. tinch, uxlashini ta'minlash va ularning sog'lom rivojlanishiga hissa qo'shish uchun ishlab chiqilgan. Sun'iy intellekt texnologiyasi yordamida bola yig'isini, holatini, va kayfiyatini tahlil qiladi, shunga mos tarzda tebranadi, musiqa yoki yorug likni avtomatik boshqaradi.	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing}	\N	2026-08-31 17:20:00.083603+00	2026-08-31 17:20:00.083603+00
stu-0632	Park wise	Olima Xudoyberdiyeva	\N	+998902893069	IDEA	ACCELERATING	Socials	0	0.00	0.00	2025-01-01	Avtoturargohlarni yagona tizimini o'z ichiga olgan mobil ilova, olnine band qilish va yaqin masofadagi avtoturargohlarni aniqlash mumkin bo'ladi	{}	{https://drive.google.com/drive/folders/1Ozddb7PuF6otHH63JOVrTUyY9oBG9zKV?usp=sharing,+}	\N	2026-08-31 17:19:58.30607+00	2026-08-31 17:19:58.30607+00
stu-0681	Smart Load Monitoring System	MASHHURA IKROMOVA	\N	+998908850816	MVP	ACCELERATING	Energy	0	0.00	0.00	2026-02-01	"Smart Load Monitoring System" loyihasining asosiy maqsadi – zamonaviy texnologiyalar asosida elektr energiyasidan foydalanishni real vaqt rejimida kuzatish, tahlil qilish va samarali boshqarishni ta’minlovchi aqlli tizimni yaratishdir.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:01.60869+00	2026-08-31 17:20:01.60869+00
stu-0690	UAGRO	Беҳзод Аслонов	\N	44 77 7196 4175	MVP	ACCELERATING	Agro	1	0.00	120000.00	2026-03-01	UAGRO — бу AI-қувватланган агротех платформа бўлиб, анъанавий деҳқончиликни рақамли ва даромадли бизнес моделга айлантиришга қаратилган. Платформа фермерлар учун маҳсулот сотиб олиш, сотиш, таҳлил қилиш ва бошқариш жараёнларини бир жойда бирлаштириб, самарадорликни сезиларли даражада оширади	{}	{https://startupbase.uz/media/presentations/UAGRO_2_PhkWDZk.pdf,https://startupbase.uz/uz/startups/1679}	\N	2026-08-31 17:20:01.798977+00	2026-08-31 17:20:01.798977+00
stu-0661	Artia.uz	Mashhura Mustafayeva	\N	+998906159565	MVP	ACCELERATING	Turism	0	0.00	0.00	2026-01-01	Artvia.uz bu muammolarning barchasini bir joyda hal qiladi. Biz ijodkorlar uchun yagona marketplace yaratmoqdamiz. Unda rassomlik, haykaltaroshlik, kulolchilik, badiiy bezak san'ati va boshqa barcha yoʻnalishlar birlashadi. Platforma ijodkorlarga asarlarini yuklash, narx qoʻyish, tavsif berish va ularni keng auditoriyaga sotish imkonini beradi. AI moduli narx boʻyicha tavsiyalar beradi, tavsiflarni optimallashtiradi va ijodkorning savdo imkoniyatini oshiradi. -bu original Har bir asar uchun raqamli sertifikat beriladi ekanligini tasdiqlaydi va xaridor uchun ishonch yaratadi.	{}	{https://drive.google.com/drive/folders/1qz3AhkxJvJAlU2e5DPYS5FG2h-zAkRt5?usp=sharing}	\N	2026-08-31 17:20:05.37649+00	2026-08-31 17:20:05.37649+00
stu-0679	Osh bo'lsin	Ruslan Raxmonov	\N	+998919567908	MVP	ACCELERATING	AI	0	0.00	0.00	2026-02-01	Osh bo'lsin - bu uyda mavjud bo'lgan mahsulotlar asosida real vaqt rejimida tegishli retseptlarni taklif qiluvchi sun'iy intellektga asoslangan taom tayyorlash ekotizimi. Foydalanuvchi shunchaki rasmga oladi yoki mahsulotlarni yozadi - sun'iy intellekt ingredientlarni aniqlaydi va mos taomni tavsiya qiladi va tanlangan taomni asta-sekin o'zbek tilida namoyish etadi. Retseptlardan tashqari, loyiha sun'iy intellekt diyetologi, oziq-ovqat kaloriya skaneri, haftalik menyular, shuningdek, Yevropa taomlari va kayfiyatga asoslangan ichimliklar bo'yicha tavsiyalar kabi funksiyalarni taklif etadi. "Osh bo'lsin" - bu O'zbekistondagi birinchi AI Food-Tech yechimi bo'lib, millionlab foydalanuvchilarga vaqtni tejashga, keraksiz xarajatlarni kamaytirishga, nima pishirishni bilmaslik muammosini hal qilishga va sog'lom ovqatlanishni saqlashga yordam beradi.	{}	{https://startupbase.uz/media/presentations/Osh_bolsin.pdf,https://startupbase.uz/uz/startups/1557}	\N	2026-08-31 17:20:06.511723+00	2026-08-31 17:20:06.511723+00
stu-0686	CareerPath	Murodbek Tuychiyev	\N	+998947797185	MVP	ACCELERATING	HR Tech	0	0.00	0.00	2026-03-01	"CareerPath - bu yoshlar uchun kasb tanlash, ta'lim va mehnat bozorini bog'laydigan innovatsion platforma. Testlar va sun'iy intellekt yordamida foydalanuvchilar o'z qobiliyatlarini aniqlashlari, mos martaba yo'lini tanlashlari va ushbu sohada ta'lim va ish bilan ta'minlash imkoniyatlarini topishlari mumkin. Platformaning asosiy funktsiyalari: Karyera tanlash testi\nShaxsiy profil\nAI maslahatchisi\nIsh va ta'lim e'lonlari\nMaqsad: O'zbekistondagi yoshlarni to'g'ri kasb tanlashga yo'naltirish, ularning qobiliyatlarini rivojlantirish va ularga mehnat bozoriga samarali kirishga yordam berish."	{}	{https://startupbase.uz/media/presentations/CareerPath_Pitch_Designed.pdf,https://startupbase.uz/uz/startups/1235}	\N	2026-08-31 17:20:01.702169+00	2026-08-31 17:20:01.702169+00
stu-0685	Eduzon AI	Javohir Xusanov	\N	+998905173007	EARLY_REVENUE	ACCELERATING	Edtech	0	0.00	0.00	2026-02-01	"EduZon Davlat Test Markazi uchun zamonaviy o'quv platformasi. Biz shunchaki test tizimi emasmiz. EduZon har bir talabaning bilim darajasini haqiqiy ko'rsatkichlar bilan o'lchaydi va ularning rivojlanishi uchun aniq yo'lni taqdim etadi. EduZon nimani taklif qiladi? Aqlli tahlil: Har bir fan bo'yicha chuqur statistika\nKuchli va zaif tomonlari: Qaysi fandan ortda qolayotganingizni aniq ko'rsatadi\nO'sish monitoringi: Haftalik va oylik taraqqiyot\nShaxsiy tavsiyalar: Xatolaringiz asosida sizga mos o'quv dasturlari\nAI savollar generatori: Har qanday matndan avtomatik, yuqori sifatli test savollari\nAI-Xato tahlili: Har bir noto'g'ri javobni tahlil qiladi va ma'lum bir mavzuga tegishli tushuntirish va o'qish materiallarini taqdim etadi\nEduZon - bu bilimni o'lchaydigan va rivojlanishni boshqaradigan platforma."	{}	{https://startupbase.uz/media/presentations/EDUZON-TEST-PLATFORMASI_1.pdf,https://startupbase.uz/uz/startups/1425}	\N	2026-08-31 17:20:06.408052+00	2026-08-31 17:20:06.408052+00
\.


--
-- Data for Name: talent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.talent (id, "fullName", university, major, "graduationYear", skills, status, phone, email, "englishLevel", "gitHubUrl", certifications, "codingScore", "englishScore", "softSkillsScore", "createdAt", "updatedAt", "cvUrl", languages) FROM stdin;
tal-1788416207608	Akbarov Shuhrat Jurayevich	TATU (Toshkent Axborot Texnologiyalari Universiteti)	Java Web Dasturchi	2026	{Java,"Spring Boot",PostgreSQL,Git,React.js,Azure}	CANDIDATE	+998 90 033 51 31	shuhratakbarov5@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 06:16:47.623087+00	2026-09-03 06:16:47.623087+00	https://drive.google.com/drive/folders/1hXzcLK5N87ET9PEtuO3ZzeoQ4v16077d	[]
tal-1788413429127	Sirojov Murodxon	Qarshi Xalqaro universiteti	Iqtisodiyot	2030	{SMM}	CANDIDATE	+998 94 003 06 34	murodxonsirojov0602@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 05:30:29.148811+00	2026-09-03 05:30:29.148811+00	https://drive.google.com/drive/folders/1WWGxilHcUkJAIJXUiuCdBSYVUZPFOwOY	[]
tal-1788409626073	Farxodjon Usmonov	M.A. Arabic Philology; B.A. English & Arabic	Arabic Philology / English & Arabic	2025	{Dispatching}	CANDIDATE	+998 99 178 76 44	farkhodjonusmanov@gmail.com	C1	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:27:06.088443+00	2026-09-03 04:27:06.088443+00	https://drive.google.com/drive/folders/1bS3AYpsbWljN1tFSC1a36kL3mJCovkwR	[]
tal-1788409765474	Shomurodov O'gabek	Qarshi AT va Menejment universiteti	Economics	2026	{React,TypeScript}	CANDIDATE	+998 95 370 00 73	shomurotovogabek181@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:29:25.489946+00	2026-09-03 04:29:25.489946+00	https://drive.google.com/drive/folders/1bS3AYpsbWljN1tFSC1a36kL3mJCovkwR	[{"level": "B1", "language": "Russian"}]
tal-1788417111426	Xayrulloyev Javohirbek Xayrulloyevich	Qarshi Davlat Texnika Universiteti	Moliya va moliyaviy texnologiyalar	2026	{Word,Excel,"1C Buxgalteriya"}	CANDIDATE	+998 93 903 44 53	Javohirbek19@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 06:31:51.446172+00	2026-09-03 06:31:51.446172+00	https://drive.google.com/drive/folders/1QK9L_nIYyMsT6YrF6ZGDKLUCeWNrrGMm	[]
tal-1788496235108	Fariza	Karshi State University	Deustch Filology	2030	{"MS Office"}	CANDIDATE	+998 90 878 84 83	elyorkarshinskiy@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-04 04:30:35.126202+00	2026-09-04 04:30:35.126202+00	https://drive.google.com/drive/folders/1xngOvKwJETZnLjBEl4eCsT9Z6sIN5WEh	[]
tal-1788409479791	Bekali Normuminov	Gulistan State University (Bakalavr); Qarshi State Technical University (Master)	Mathematics / Data Science	2027	{"Virtual Assistance","Online/Web Research","Data Entry","Data Organization"}	CANDIDATE	+998 94 726 77 44	bekalinormuminov8@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:24:39.811195+00	2026-09-03 04:24:39.811195+00	https://drive.google.com/drive/folders/1dXEJVcV_FE0W4-3lTqa2Q14_tKWt-Ukr	[]
tal-1788409870876	Mahliyo Shomurodova	Webster University Tashkent	English Language and Literature / TESOL	2024	{"Educational Technology"}	CANDIDATE	+998 97 181 20 21	shomurodovamahliyo2@gmail.com	C1	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:31:10.890875+00	2026-09-03 04:31:10.890875+00	https://drive.google.com/drive/folders/1vf7WM87aH_I1Nt9eswaaEhT-X2DXiPJp	[]
tal-1788416492174	Shojalilova Sevinch Oybek qizi	Tashkent University of Information Technologies (TUIT)	Iqtisodiyot	2027	{React,TypeScript}	CANDIDATE	+998 50 079 80 05	shojalilovasevinch@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 06:21:32.18951+00	2026-09-03 06:21:32.18951+00	https://drive.google.com/drive/folders/14_bcf8tLx-eiN-MSITDg3RbR1g7tVux1	[]
tal-1788409945506	Dilorom Poyonova	Webster University Tashkent (Master)	English Philology & Teaching / TESOL	2026	{"Translation & Interpretation","Business Communication","MS Office",Leadership,"Public Speaking"}	CANDIDATE	+998 91 225 57 11	dilorompoyonova@gmail.com	C1	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:32:25.521289+00	2026-09-03 04:32:25.521289+00	https://drive.google.com/drive/folders/1kIihWaU4s5r7Barii-8Jkhgn6xhoO5XM	[]
tal-1788410241976	Quzibayeva Xolida Xaytbayevna	QDU	Ingliz tili o'qitish / Ta'lim	2010	{"Ingliz tili o'qitish","ta'lim berish"}	CANDIDATE	+998 97 313 33 34	xolida@gmail.com	C1	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:37:21.991804+00	2026-09-03 04:37:21.991804+00	https://drive.google.com/drive/folders/1Khib1XjoidY9ij17IUUCdnN2nwt_CChj	[]
tal-1788410806199	Abdug'aniyev Boburjon Akramjon o'g'li	Qarshi davlat universiteti	Muhandislik	2027	{React,Python,JavaScript}	CANDIDATE	+998 91 963 07 70	boburjonabduganiyev83@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:46:46.214902+00	2026-09-03 04:46:46.214902+00	https://drive.google.com/drive/folders/1a6MEzfT2hV6-25sauL1p-PKf8relVdCm	[]
tal-1788409175568	Ernazarov Asilbek	Qarshi Turon xususiy universiteti	IT/CRM/Support	2026	{"MS Excel",Word,PowerPoint,"CRM tizimlari"}	CANDIDATE	+998 99 548 74 56	ernazaraovasilbek1@gmail.com	B2	\N	{"EF SET B2 English"}	0	0	0	2026-09-03 04:19:35.583252+00	2026-09-03 04:19:35.583252+00	https://drive.google.com/drive/folders/1p4cw9JDR0ygrlz6Hh_vQJG5FotMVUzg0	[]
tal-1788495666122	Ikromova Zarifa Quvondiq qizi	Tashkent University of Information Technologies (TUIT)	Mathematics / Data Science	2026	{React,TypeScript}	CANDIDATE	+998 90 878 84 83	ikromovaf@gmail.com	C1	\N	{"EF SET B2 English"}	0	0	0	2026-09-04 04:21:06.141118+00	2026-09-04 04:21:06.141118+00	\N	[]
tal-1788408961085	Oxunjon Abdullayev	Tashkent University of Information Technologies (TUIT)	Computer Science / Backend Development	2026	{"Loyihada ishlamoqchi"}	CANDIDATE	+998 91 811 74 84	oxundev@gmail.com	C1	https://drive.google.com/drive/folders/1OfEcj7P2eOQIYm0MKXLpo4yPZmJ6u0Dg	{"EF SET B2 English"}	0	0	0	2026-09-03 04:16:01.100346+00	2026-09-03 04:16:01.100346+00	https://drive.google.com/drive/folders/1OfEcj7P2eOQIYm0MKXLpo4yPZmJ6u0Dg	[]
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, title, "assignedTo", "dueDate", priority, status, "createdAt", "updatedAt", "companyId", "companyName") FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles ("userId", "roleId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, name, role, department, "avatarUrl", active, "createdAt", "updatedAt") FROM stdin;
u-4	sh.xudoyberdiyev@outsource.gov.uz	$2b$10$xAms5tZDLwCKQctrFu8M1OAXVVfxLyO2HJXYf8RPtIk5Nk6C/W1V6	Shohjaxon Xudoyberdiyev	MANAGER	Operations	\N	t	2026-08-31 17:19:55.569306+00	2026-08-31 17:19:55.569306+00
u-5	j.beknazarov@outsource.gov.uz	$2b$10$dc0vH/5sY4RkNNYOCCLO/.lE1z7Cq4Zl.H/nYvkv98dAdBOZkskKm	Jasurbek Beknazarov	MANAGER	Operations	\N	t	2026-08-31 17:19:55.193294+00	2026-08-31 17:19:55.193294+00
u-1	h.abdukarimov@outsource.gov.uz	$2b$10$a2F9IqfHB578r36AKlNyu.zRvSau8UhFGLNT7h61KEGvhrS2fAsu2	Hasan Abdukarimov	SUPER_ADMIN	Executive Board	\N	t	2026-08-31 17:19:55.288277+00	2026-08-31 17:19:55.288277+00
u-2	b.qutbiddinov@outsource.gov.uz	$2b$10$YiVa.UsBdxwbdjAfSp/mtuKmYAp3aCezY0ZWwN.JFi1CU8VmLUdIu	Bunyod Qutbiddinov	MANAGER	Operations	\N	t	2026-08-31 17:19:55.381151+00	2026-08-31 17:19:55.381151+00
u-3	i.karimov@365.it-park.uz	$2b$10$z3oS6KV0S5Zwx/0XR4j.YuxPeP/G9QfTrx3RwQWUzcxY.GIL88h7m	Islom Karimov	MANAGER	Operations	\N	t	2026-08-31 17:19:55.475049+00	2026-08-31 17:19:55.475049+00
\.


--
-- Data for Name: utilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.utilities (id, "buildingBlock", month, "electricityKwh", "electricityCost", "waterM3", "waterCost", "internetMbps", "internetCost", "heatingGcal", "heatingCost") FROM stdin;
\.


--
-- Data for Name: vacancies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vacancies (id, "residentId", "residentName", title, department, "employmentType", seniority, location, "requiredSkills", "preferredSkills", "englishLevel", "numberOfOpenings", "salaryMin", "salaryMax", "salaryNegotiable", description, responsibilities, requirements, benefits, status, "postedDate", "deadlineDate", "filledDate", "filledByTalentId", "contactPerson", "contactEmail", "contactPhone", notes, "createdBy", "createdAt", "updatedAt") FROM stdin;
vac-1788862758352	res-0075	"CATE" MCHJ	SAP	Bugalteriya	Full-time	Mid	Qarshi	{"Ingliz tili"}	{}	C1	10	5000000	10000000	t	Agar siz ingliz tilini C1 darajada bilsangiz va IT sohasida talab yuqori bo‘lgan yangi yo‘nalishni o‘rganishni istasangiz, ushbu imkoniyat siz uchun.\n\nYo‘nalishlar:\n• SAP FI/CO — moliya va buxgalteriya\n• SAP MM — xarid va ta’minot\n• SAP SD — savdo va logistika\n• SAP HCM / SuccessFactors — HR\n• SAP PP — ishlab chiqarish\n• SAP EWM — ombor boshqaruvi\n• SAP ABAP — dasturlash\n• SAP Basis — tizim administratsiyasi\n• SAP BW / Analytics — analitika\n\n💼 Ta’limni muvaffaqiyatli yakunlagan ishtirokchilar ishga qabul qilish jarayoniga jalb etiladi.\n\n💰 Oylik maosh: $500–$1,000	{}	{}	{}	OPEN	2026-09-08	\N	\N	\N	+998907162281 Jur'at aka	\N	\N	\N	\N	2026-09-08 10:19:18.372262+00	2026-09-08 17:01:36.427258+00
vac-1788862550080	res-0033	"SHAHRISABZ VOICE" MCHJ	Rus tilini bilish	Call center	Full-time	Mid	Karshi,full time 	{"Rus tili"}	{}	\N	15	3000000	5000000	t	15 ta kerak	{}	{}	{}	OPEN	2026-09-08	\N	\N	\N	+998916327707 Iskandar aka 	\N	\N	\N	\N	2026-09-08 10:15:50.093943+00	2026-09-08 17:01:36.527842+00
vac-1788863156457	res-0022	"NAVIGO" MCHJ	Ingliz tili	Logistika	Full-time	Mid	Qarshi	{"Ingliz tili"}	{}	\N	50	3000000	10000000	t	Logistika kompaniyasi kengayishi uchun kdarlar kerak 	{}	{}	{}	OPEN	2026-09-08	\N	\N	\N	977992456 Akbar aka	\N	\N	\N	\N	2026-09-08 10:25:56.479063+00	2026-09-08 17:01:36.625088+00
vac-1788863651771	res-0069	"DATAI SERVICES" MCHJ	BI	BI ekportyor	Full-time	Mid	Qarshi	{}	{}	\N	10	3000000	30000000	t	Birinchi bepul 6 oy davomida o'qitib keyin o'zlari 300$ dan stependiya beriladi va 3k$ gacha oylik maosh beriladi.	{}	{}	{}	OPEN	2026-09-08	\N	\N	\N	+998973101014 Bahriddin aka 	\N	\N	\N	\N	2026-09-08 10:34:11.781384+00	2026-09-08 17:01:36.722843+00
vac-1789042145973	res-0001	"AI FREELANCING" NTM	Front Injenirng	IT ta'lim	Full-time	Mid	Qashqadaryo viloyati, Qarshi tumanii, Qovchin QFY Shirkent mahallasi, Shirkent qishlog'i, 14-uy	{}	{}	\N	2	\N	\N	t	Ta'lim markaz egasi bilan gaplashib o'zaro suhbat va kelishuv orqali\n	{}	{}	{}	OPEN	2026-09-10	\N	\N	\N	\N	\N	\N	\N	\N	2026-09-10 12:09:05.988076+00	2026-09-10 12:09:05.988076+00
\.


--
-- Data for Name: vacancy_applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vacancy_applications (id, "vacancyId", "vacancyTitle", "residentId", "talentId", "candidateName", stage, "appliedDate", "matchScore", notes, history, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: ITEvent ITEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ITEvent"
    ADD CONSTRAINT "ITEvent_pkey" PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: buildings buildings_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_code_key UNIQUE (code);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contractNumber_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT "contracts_contractNumber_key" UNIQUE ("contractNumber");


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: entity_store entity_store_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_store
    ADD CONSTRAINT entity_store_pkey PRIMARY KEY (collection, id);


--
-- Name: inspections inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inspections
    ADD CONSTRAINT inspections_pkey PRIMARY KEY (id);


--
-- Name: maintenance maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_pkey PRIMARY KEY (id);


--
-- Name: meetings meetings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT meetings_pkey PRIMARY KEY (id);


--
-- Name: offices offices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.offices
    ADD CONSTRAINT offices_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: residents residents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.residents
    ADD CONSTRAINT residents_pkey PRIMARY KEY (id);


--
-- Name: residents residents_registrationNumber_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.residents
    ADD CONSTRAINT "residents_registrationNumber_key" UNIQUE ("registrationNumber");


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY ("roleId", "permissionId");


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: startups startups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.startups
    ADD CONSTRAINT startups_pkey PRIMARY KEY (id);


--
-- Name: talent talent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.talent
    ADD CONSTRAINT talent_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId");


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
-- Name: utilities utilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.utilities
    ADD CONSTRAINT utilities_pkey PRIMARY KEY (id);


--
-- Name: vacancies vacancies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacancies
    ADD CONSTRAINT vacancies_pkey PRIMARY KEY (id);


--
-- Name: vacancy_applications vacancy_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vacancy_applications
    ADD CONSTRAINT vacancy_applications_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_logs_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs USING btree ("timestamp" DESC);


--
-- Name: idx_activity_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree ("userId");


--
-- Name: idx_contacts_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contacts_company ON public.contacts USING btree ("companyId");


--
-- Name: idx_entity_store_collection; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_entity_store_collection ON public.entity_store USING btree (collection);


--
-- Name: idx_events_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_events_date ON public."ITEvent" USING btree ("eventDate");


--
-- Name: idx_meetings_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meetings_company ON public.meetings USING btree ("companyId");


--
-- Name: idx_permissions_module; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_module ON public.permissions USING btree (module);


--
-- Name: idx_permissions_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_name ON public.permissions USING btree (name);


--
-- Name: idx_refresh_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_tokens_user_id ON public.refresh_tokens USING btree ("userId");


--
-- Name: idx_residents_reg_num; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_residents_reg_num ON public.residents USING btree ("registrationNumber");


--
-- Name: idx_residents_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_residents_status ON public.residents USING btree (status);


--
-- Name: idx_roles_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_roles_name ON public.roles USING btree (name);


--
-- Name: idx_startups_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_startups_status ON public.startups USING btree (status);


--
-- Name: idx_tasks_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (lower((email)::text));


--
-- Name: idx_vacancies_resident; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacancies_resident ON public.vacancies USING btree ("residentId");


--
-- Name: idx_vacancies_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacancies_status ON public.vacancies USING btree (status);


--
-- Name: idx_vacancy_applications_resident; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacancy_applications_resident ON public.vacancy_applications USING btree ("residentId");


--
-- Name: idx_vacancy_applications_talent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacancy_applications_talent ON public.vacancy_applications USING btree ("talentId");


--
-- Name: idx_vacancy_applications_vacancy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_vacancy_applications_vacancy ON public.vacancy_applications USING btree ("vacancyId");


--
-- Name: contacts contacts_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "contacts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: meetings meetings_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meetings
    ADD CONSTRAINT "meetings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gmve2v6JGdK4eriNw5xcTugKwaBQ8WM0RlR2Lmpj3gtvnU4RCjStJ9EwMSvA6kI

