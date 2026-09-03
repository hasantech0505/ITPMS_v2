-- ========================================================
-- IT PARK UZBEKISTAN MANAGEMENT SYSTEM RELATIONAL SCHEMA
-- Production-Ready PostgreSQL DDL & Migration Definitions
-- ========================================================

-- Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table (RBAC Core)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) DEFAULT 'password',
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',
  department VARCHAR(100),
  "avatarUrl" VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Refresh Tokens Table (Auth)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(100) PRIMARY KEY,
  "userId" VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "tokenHash" VARCHAR(500) NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Startups Table
CREATE TABLE IF NOT EXISTS startups (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  founder VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(150),
  stage VARCHAR(50),
  status VARCHAR(50),
  industry VARCHAR(100),
  employees INTEGER DEFAULT 0,
  revenue NUMERIC(15, 2) DEFAULT 0.0,
  "fundingRaised" NUMERIC(15, 2) DEFAULT 0.0,
  "joinedAt" VARCHAR(50),
  description TEXT,
  notes TEXT[],
  documents TEXT[],
  kpis TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Registered IT Park Residents Table
CREATE TABLE IF NOT EXISTS residents (
  id VARCHAR(100) PRIMARY KEY,
  "companyName" VARCHAR(255) NOT NULL,
  director VARCHAR(255),
  "registrationNumber" VARCHAR(100) UNIQUE,
  "legalAddress" TEXT,
  "employeesCount" INTEGER DEFAULT 0,
  "exportVolume" NUMERIC(15, 2) DEFAULT 0.0,
  "domesticVolume" NUMERIC(15, 2) DEFAULT 0.0,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  "appliedAt" VARCHAR(50),
  "approvedAt" VARCHAR(50),
  "benefitsApplied" TEXT[],
  notes TEXT[],
  documents TEXT[],
  email VARCHAR(255),
  phone VARCHAR(150),
  website VARCHAR(500),
  telegram VARCHAR(100),
  linkedin VARCHAR(500),
  district VARCHAR(100),
  industry VARCHAR(100),
  "activityType" VARCHAR(100),
  "assignedManager" VARCHAR(100),
  "potentialStage" VARCHAR(100),
  "potentialFounder" VARCHAR(255),
  "potentialSource" VARCHAR(255),
  "potentialProbability" INTEGER DEFAULT 0,
  "potentialOwner" VARCHAR(255),
  "potentialNextFollowUp" VARCHAR(50),
  "potentialNotes" TEXT,
  "potentialTimeline" JSONB DEFAULT '[]'::jsonb,
  "upcomingStage" VARCHAR(100),
  "upcomingDetails" JSONB DEFAULT '{}'::jsonb,
  "removedDate" VARCHAR(50),
  "removedReason" TEXT,
  "removedDebt" NUMERIC(15, 2) DEFAULT 0.0,
  "removedInspection" TEXT,
  "removedAppeal" TEXT,
  "removedCourt" TEXT,
  "removedCanReapply" BOOLEAN DEFAULT TRUE,
  "monitoringHistory" JSONB DEFAULT '[]'::jsonb,
  "quarterlyReports" JSONB DEFAULT '[]'::jsonb,
  "docFiles" JSONB DEFAULT '[]'::jsonb,
  meetings JSONB DEFAULT '[]'::jsonb,
  tasks JSONB DEFAULT '[]'::jsonb,
  "historyLogs" JSONB DEFAULT '[]'::jsonb,
  photos TEXT[],
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Security & Operation Activity Audit Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(100) PRIMARY KEY,
  "userId" VARCHAR(100) NOT NULL,
  "userName" VARCHAR(255),
  "userRole" VARCHAR(50),
  action VARCHAR(255) NOT NULL,
  entity VARCHAR(100),
  "entityId" VARCHAR(100),
  timestamp VARCHAR(100) NOT NULL,
  details TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tasks Management Table
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  "assignedTo" VARCHAR(100),
  "dueDate" VARCHAR(50),
  priority VARCHAR(50) DEFAULT 'MEDIUM',
  status VARCHAR(50) DEFAULT 'TODO',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Companies CRM Table
CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  industry VARCHAR(255),
  website VARCHAR(500),
  "leadScore" INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'LEAD',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Contacts CRM Table
CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(100) PRIMARY KEY,
  "companyId" VARCHAR(100) REFERENCES companies(id) ON DELETE SET NULL,
  "companyName" VARCHAR(255),
  "fullName" VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(150),
  "linkedInUrl" VARCHAR(500),
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Meetings Calendar Table
CREATE TABLE IF NOT EXISTS meetings (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  "companyId" VARCHAR(100) REFERENCES companies(id) ON DELETE SET NULL,
  "companyName" VARCHAR(255),
  attendees TEXT[],
  "dateTime" VARCHAR(50),
  notes TEXT,
  summary TEXT,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. IT Events Management Table
CREATE TABLE IF NOT EXISTS "ITEvent" (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  "eventType" VARCHAR(100) NOT NULL,
  "eventDate" VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  region VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  organizer VARCHAR(255) NOT NULL,
  partners TEXT,
  "participantCount" INTEGER DEFAULT 0,
  "startupCount" INTEGER DEFAULT 0,
  "reportUrl" TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Offices Real Estate Table
CREATE TABLE IF NOT EXISTS offices (
  id VARCHAR(100) PRIMARY KEY,
  "roomNumber" VARCHAR(50) NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor INTEGER,
  "areaSqM" NUMERIC(10, 2) DEFAULT 0.0,
  "monthlyRent" NUMERIC(15, 2) DEFAULT 0.0,
  status VARCHAR(50) DEFAULT 'VACANT',
  "currentTenantId" VARCHAR(100),
  "currentTenantName" VARCHAR(255),
  "leaseStart" VARCHAR(50),
  "leaseEnd" VARCHAR(50),
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Talent Directory Table
CREATE TABLE IF NOT EXISTS talent (
  id VARCHAR(100) PRIMARY KEY,
  "fullName" VARCHAR(255) NOT NULL,
  university VARCHAR(255),
  major VARCHAR(255),
  "graduationYear" INTEGER,
  skills TEXT[],
  status VARCHAR(50),
  phone VARCHAR(150),
  email VARCHAR(255),
  "englishLevel" VARCHAR(10),
  "gitHubUrl" VARCHAR(500),
  "cvUrl" VARCHAR(1000),
  "languages" JSONB DEFAULT '[]'::jsonb,
  certifications TEXT[],
  "codingScore" INTEGER DEFAULT 0,
  "englishScore" INTEGER DEFAULT 0,
  "softSkillsScore" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Buildings Infrastructure Table
CREATE TABLE IF NOT EXISTS buildings (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(100) UNIQUE,
  address TEXT,
  region VARCHAR(100),
  district VARCHAR(100),
  coordinates VARCHAR(100),
  "constructionYear" INTEGER,
  floors INTEGER,
  "totalArea" NUMERIC(15, 2),
  "totalOffices" INTEGER,
  capacity INTEGER,
  "parkingSpots" INTEGER,
  "meetingRooms" INTEGER,
  status VARCHAR(50),
  images TEXT[],
  "virtualTourUrl" VARCHAR(500),
  documents TEXT[],
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Assets Inventory Table
CREATE TABLE IF NOT EXISTS assets (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "serialNumber" VARCHAR(100),
  category VARCHAR(100),
  "purchaseDate" VARCHAR(50),
  "warrantyExpiry" VARCHAR(50),
  condition VARCHAR(50),
  "assignedOfficeId" VARCHAR(100),
  "assignedOfficeNumber" VARCHAR(50),
  "assignedUserId" VARCHAR(100),
  "assignedUserName" VARCHAR(255),
  "purchaseCost" NUMERIC(15, 2) DEFAULT 0.0,
  image VARCHAR(500),
  "maintenanceHistory" TEXT[],
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Maintenance Tickets Table
CREATE TABLE IF NOT EXISTS maintenance (
  id VARCHAR(100) PRIMARY KEY,
  category VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50),
  status VARCHAR(50) DEFAULT 'OPEN',
  "assignedEngineer" VARCHAR(255),
  "createdAt" VARCHAR(50),
  "officeId" VARCHAR(100),
  "officeNumber" VARCHAR(50),
  "buildingBlock" VARCHAR(100),
  "beforePhoto" VARCHAR(500),
  "afterPhoto" VARCHAR(500),
  "completionReport" TEXT,
  timeline TEXT
);

-- 16. Building Utilities Log Table
CREATE TABLE IF NOT EXISTS utilities (
  id VARCHAR(100) PRIMARY KEY,
  "buildingBlock" VARCHAR(100) NOT NULL,
  month VARCHAR(50) NOT NULL,
  "electricityKwh" NUMERIC(15, 2),
  "electricityCost" NUMERIC(15, 2),
  "waterM3" NUMERIC(15, 2),
  "waterCost" NUMERIC(15, 2),
  "internetMbps" NUMERIC(15, 2),
  "internetCost" NUMERIC(15, 2),
  "heatingGcal" NUMERIC(15, 2),
  "heatingCost" NUMERIC(15, 2)
);

-- 17. Facility Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(100) PRIMARY KEY,
  "roomName" VARCHAR(255) NOT NULL,
  "buildingBlock" VARCHAR(100),
  floor INTEGER,
  "reservedBy" VARCHAR(255),
  "residentName" VARCHAR(255),
  date VARCHAR(50),
  "startTime" VARCHAR(20),
  "endTime" VARCHAR(20),
  purpose TEXT,
  status VARCHAR(50),
  recurring BOOLEAN DEFAULT FALSE
);

-- 18. Facility Inspections Table
CREATE TABLE IF NOT EXISTS inspections (
  id VARCHAR(100) PRIMARY KEY,
  "buildingBlock" VARCHAR(100),
  type VARCHAR(100),
  "inspectionDate" VARCHAR(50),
  "inspectorName" VARCHAR(255),
  "inspectorAgency" VARCHAR(255),
  status VARCHAR(50),
  findings TEXT,
  recommendations TEXT,
  "certificateUrl" VARCHAR(500),
  documents TEXT[]
);

-- 19. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id VARCHAR(100) PRIMARY KEY,
  "contractNumber" VARCHAR(100) UNIQUE,
  "tenantId" VARCHAR(100),
  "tenantName" VARCHAR(255),
  "officeId" VARCHAR(100),
  "officeNumber" VARCHAR(50),
  "buildingBlock" VARCHAR(100),
  "contractType" VARCHAR(100),
  "startDate" VARCHAR(50),
  "endDate" VARCHAR(50),
  "monthlyRentUSD" NUMERIC(15, 2) DEFAULT 0.0,
  status VARCHAR(50),
  "documentUrl" VARCHAR(500),
  "digitalSignature" VARCHAR(255),
  "signedAt" VARCHAR(50),
  payments TEXT
);

-- 20. Roles Table (RBAC)
CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 21. Permissions Table (RBAC)
CREATE TABLE IF NOT EXISTS permissions (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(100) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 22. Role Permissions Association Table (RBAC)
CREATE TABLE IF NOT EXISTS role_permissions (
  "roleId" VARCHAR(100) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  "permissionId" VARCHAR(100) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY ("roleId", "permissionId")
);

-- 23. User Roles Association Table (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  "userId" VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "roleId" VARCHAR(100) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY ("userId", "roleId")
);

-- ========================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ========================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens ("userId");
CREATE INDEX IF NOT EXISTS idx_residents_status ON residents (status);
CREATE INDEX IF NOT EXISTS idx_residents_reg_num ON residents ("registrationNumber");
CREATE INDEX IF NOT EXISTS idx_startups_status ON startups (status);
CREATE INDEX IF NOT EXISTS idx_events_date ON "ITEvent" ("eventDate");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs ("userId");
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts ("companyId");
CREATE INDEX IF NOT EXISTS idx_meetings_company ON meetings ("companyId");
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles (name);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions (name);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions (module);

-- 24. Generic Entity Store (JSONB fallback for collections without a dedicated
-- typed table above: properties, planningItems, kpiTargets, comments, campaigns,
-- aiConversations, aiMessages, and any future ad hoc collection the generic
-- entity API auto-vivifies). Keeps the app's "any new collection just works"
-- flexibility while still getting real Postgres persistence (no more silent
-- reverts from the old db_store.json flat file).
CREATE TABLE IF NOT EXISTS entity_store (
  collection VARCHAR(100) NOT NULL,
  id VARCHAR(100) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection, id)
);

CREATE INDEX IF NOT EXISTS idx_entity_store_collection ON entity_store (collection);

-- Widen phone columns on databases that already ran an earlier version of this
-- schema (VARCHAR(50) was too narrow for some real imported phone data). Safe to
-- run repeatedly.
ALTER TABLE residents ALTER COLUMN phone TYPE VARCHAR(150);
ALTER TABLE talent ALTER COLUMN phone TYPE VARCHAR(150);
ALTER TABLE contacts ALTER COLUMN phone TYPE VARCHAR(150);
ALTER TABLE startups ALTER COLUMN phone TYPE VARCHAR(150);

-- Talent: add the CV link field (a URL to an externally-hosted resume, e.g. a
-- OneDrive Word doc link - not an uploaded file). Safe to run repeatedly.
ALTER TABLE talent ADD COLUMN IF NOT EXISTS "cvUrl" VARCHAR(1000);

-- Talent: add a structured list of additional languages a candidate speaks
-- beyond English (each entry: {language, level}). Safe to run repeatedly.
ALTER TABLE talent ADD COLUMN IF NOT EXISTS "languages" JSONB DEFAULT '[]'::jsonb;

