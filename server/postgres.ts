/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;

// Postgres returns NUMERIC/DECIMAL columns as strings by default (to avoid float
// precision loss). The app expects real JS numbers everywhere (matches the old
// db_store.json behavior), so coerce them app-wide. OID 1700 = numeric.
pg.types.setTypeParser(1700, (val: string | null) => (val === null ? null : parseFloat(val)));

// Collections with a dedicated, fully-typed table (see server/db/schema.sql) whose
// column names already match the app's camelCase field names 1:1, plus the two that
// need a JS-name -> SQL-table-name translation.
export const TYPED_TABLE_COLLECTIONS = [
  "users", "startups", "residents", "activityLogs", "tasks", "meetings", "events",
  "offices", "talent", "companies", "contacts", "buildings", "assets", "maintenance",
  "utilities", "reservations", "inspections", "contracts",
];
const TABLE_NAME_MAP: Record<string, string> = {
  activityLogs: "activity_logs",
  events: '"ITEvent"',
};

// Newer/ad hoc collections with no dedicated table yet - stored as JSONB rows in the
// generic entity_store table instead (see schema.sql). Any collection name NOT in
// TYPED_TABLE_COLLECTIONS automatically falls back to entity_store, so future new
// modules never need a schema migration just to get real persistence.
export const GENERIC_STORE_COLLECTIONS = [
  "properties", "planningItems", "kpiTargets", "comments", "campaigns", "aiConversations", "aiMessages",
];

let pool: pg.Pool | null = null;
let currentConnectionString = "";

/**
 * Helper to check if a database URL is a placeholder or invalid connection string.
 */
export function isPlaceholderDbUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim().toLowerCase();
  if (
    !trimmed ||
    trimmed === "base" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed.includes("@base") ||
    trimmed.includes("//base") ||
    trimmed.includes("hostname") ||
    trimmed.includes("username:password") ||
    trimmed.includes("your_database_url") ||
    trimmed.includes("example.com") ||
    trimmed.includes("localhost:5432/database")
  ) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname;
    if (!host || host === "base" || host === "hostname" || host === "example.com" || host === "your_host") {
      return true;
    }
  } catch (e) {
    if (!trimmed.startsWith("postgres://") && !trimmed.startsWith("postgresql://")) {
      return true;
    }
  }

  return false;
}

/**
 * Configure and get/create a PostgreSQL connection pool.
 * Dynamically re-creates the pool if the connection string changes.
 */
export function getPool(connectionString?: string): pg.Pool | null {
  const uri = connectionString || process.env.DATABASE_URL || "";
  
  if (isPlaceholderDbUrl(uri)) {
    if (pool) {
      pool.end().catch(() => {});
      pool = null;
    }
    return null;
  }

  if (pool && currentConnectionString === uri) {
    return pool;
  }

  if (pool) {
    console.log("🔄 Closing existing PostgreSQL connection pool...");
    pool.end().catch(err => console.warn("Error ending previous pool:", err));
  }

  currentConnectionString = uri;

  try {
    console.log("🔌 Initializing new PostgreSQL connection pool for URI:", uri.replace(/:[^:@/]+@/, ":****@"));
    pool = new Pool({
      connectionString: uri,
      ssl: uri.includes("localhost") || uri.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.warn("PostgreSQL pool idle error (fallback active):", err?.message || err);
    });

    return pool;
  } catch (err) {
    console.warn("Failed to initialize PostgreSQL pool:", err);
    pool = null;
    return null;
  }
}

/**
 * Gracefully end the pool during server shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    console.log("🔌 Gracefully closing PostgreSQL connection pool...");
    try {
      await pool.end();
    } catch (e: any) {
      console.warn("Warning closing PostgreSQL pool:", e?.message || e);
    }
    pool = null;
  }
}

/**
 * Safe parameterized query executor against active pool.
 */
export async function queryPostgres<T = any>(text: string, params?: any[]): Promise<T[] | null> {
  const activePool = getPool();
  if (!activePool) return null;
  try {
    const res = await activePool.query(text, params);
    return res.rows;
  } catch (err: any) {
    console.error("PostgreSQL Query Error:", err?.message || err);
    throw err;
  }
}

/**
 * Generates the live PostgreSQL DDL script for IT Park management tables.
 */
export function getPostgresDDL(): string {
  try {
    const schemaPath = path.join(process.cwd(), "server", "db", "schema.sql");
    return fs.readFileSync(schemaPath, "utf-8");
  } catch (err) {
    console.warn("Could not read schema.sql file directly:", err);
    return "";
  }
}

/**
 * Test a PostgreSQL connection URI and create tables if they do not exist.
 */
export async function testAndMigratePostgres(connectionString: string): Promise<{ success: boolean; message: string; log: string[] }> {
  const logs: string[] = ["Starting connection handshake..."];
  if (isPlaceholderDbUrl(connectionString)) {
    logs.push("Placeholder database URL detected. Dual-sync relational database is inactive.");
    return {
      success: false,
      message: "Placeholder connection string provided. Running in local JSON storage mode.",
      log: logs
    };
  }

  let client: pg.Client | null = null;

  try {
    client = new pg.Client({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000
    });

    logs.push("Acquiring server socket...");
    await client.connect();
    logs.push("✅ Connection socket established successfully.");

    const dbTimeResult = await client.query("SELECT NOW() as now, version();");
    const dbTime = dbTimeResult.rows[0].now;
    const dbVersion = dbTimeResult.rows[0].version.split(" ")[1] || "PostgreSQL";
    logs.push(`Connected to ${dbVersion}. Server local time: ${dbTime}`);

    // Trigger schema table initializations
    logs.push("Evaluating relation catalogs (DDL validation & migrations)...");
    const ddl = getPostgresDDL();
    if (ddl) {
      await client.query(ddl);
      logs.push("✅ Relational schema DDL & indexes applied successfully.");
    } else {
      logs.push("⚠️ DDL script empty, skipping migration step.");
    }

    logs.push("✅ Schema catalog verification complete. All physical relation models primed.");

    return {
      success: true,
      message: "PostgreSQL Connection Verified & Relational Schema Migrated Successfully!",
      log: logs
    };
  } catch (error: any) {
    console.warn("PostgreSQL connection info:", error?.message || error);
    logs.push(`⚠️ Handshake notice: ${error?.message || error}`);
    return {
      success: false,
      message: error?.message || "Failed to establish a valid connection.",
      log: logs
    };
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

/**
 * Bulk exports local JSON / Firestore collections straight into PostgreSQL relational tables.
 */
export async function syncDataToPostgres(connectionString: string, currentData: any): Promise<{ success: boolean; count: number; log: string[] }> {
  const logs: string[] = ["Initializing Postgres bulk synchronization..."];
  if (isPlaceholderDbUrl(connectionString)) {
    return { success: false, count: 0, log: ["Placeholder database URL provided."] };
  }
  let client: pg.Client | null = null;
  let totalRows = 0;

  try {
    client = new pg.Client({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    await client.connect();
    logs.push("Connected to Postgres. Starting data population phase...");

    // 1. Sync Users
    const users = currentData.users || [];
    if (users.length > 0) {
      logs.push(`Streaming ${users.length} users...`);
      for (const u of users) {
        await client.query(`
          INSERT INTO users (id, email, password, name, role, department, "avatarUrl", active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            password = EXCLUDED.password,
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            department = EXCLUDED.department,
            "avatarUrl" = EXCLUDED."avatarUrl",
            active = EXCLUDED.active
        `, [u.id, u.email || "", u.password || "password", u.name || "", u.role || "MANAGER", u.department || null, u.avatarUrl || null, u.active !== false]);
        totalRows++;
      }
    }

    // 2. Sync Startups
    const startups = currentData.startups || [];
    if (startups.length > 0) {
      logs.push(`Streaming ${startups.length} startups...`);
      for (const s of startups) {
        await client.query(`
          INSERT INTO startups (id, name, founder, email, phone, stage, status, industry, employees, revenue, "fundingRaised", "joinedAt", description, notes, documents, kpis)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            founder = EXCLUDED.founder,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            stage = EXCLUDED.stage,
            status = EXCLUDED.status,
            industry = EXCLUDED.industry,
            employees = EXCLUDED.employees,
            revenue = EXCLUDED.revenue,
            "fundingRaised" = EXCLUDED."fundingRaised",
            "joinedAt" = EXCLUDED."joinedAt",
            description = EXCLUDED.description,
            notes = EXCLUDED.notes,
            documents = EXCLUDED.documents,
            kpis = EXCLUDED.kpis
        `, [
          s.id, s.name || "", s.founder || "", s.email || null, s.phone || null,
          s.stage || null, s.status || null, s.industry || null, Number(s.employees) || 0,
          Number(s.revenue) || 0, Number(s.fundingRaised) || 0, s.joinedAt || null, s.description || null,
          s.notes || [], s.documents || [], s.kpis ? JSON.stringify(s.kpis) : null
        ]);
        totalRows++;
      }
    }

    // 3. Sync Residents
    const residents = currentData.residents || [];
    if (residents.length > 0) {
      logs.push(`Streaming ${residents.length} IT Resident exporters...`);
      for (const r of residents) {
        await client.query(`
          INSERT INTO residents (id, "companyName", director, "registrationNumber", "legalAddress", "employeesCount", "exportVolume", "domesticVolume", status, "appliedAt", "approvedAt", "benefitsApplied", notes, documents)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            "companyName" = EXCLUDED."companyName",
            director = EXCLUDED.director,
            "registrationNumber" = EXCLUDED."registrationNumber",
            "legalAddress" = EXCLUDED."legalAddress",
            "employeesCount" = EXCLUDED."employeesCount",
            "exportVolume" = EXCLUDED."exportVolume",
            "domesticVolume" = EXCLUDED."domesticVolume",
            status = EXCLUDED.status,
            "appliedAt" = EXCLUDED."appliedAt",
            "approvedAt" = EXCLUDED."approvedAt",
            "benefitsApplied" = EXCLUDED."benefitsApplied",
            notes = EXCLUDED.notes,
            documents = EXCLUDED.documents
        `, [
          r.id, r.companyName || "", r.director || null, r.registrationNumber || null,
          r.legalAddress || null, Number(r.employeesCount) || 0, Number(r.exportVolume) || 0,
          Number(r.domesticVolume) || 0, r.status || "PENDING", r.appliedAt || null, r.approvedAt || null,
          r.benefitsApplied || [], r.notes || [], r.documents || []
        ]);
        totalRows++;
      }
    }

    // 4. Sync Activity Logs
    const logsData = currentData.activityLogs || [];
    if (logsData.length > 0) {
      logs.push(`Streaming ${logsData.length} global audit records...`);
      for (const log of logsData) {
        await client.query(`
          INSERT INTO activity_logs (id, "userId", "userName", "userRole", action, entity, "entityId", timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [log.id, log.userId || "u-system", log.userName || null, log.userRole || null, log.action || "", log.entity || null, log.entityId || null, log.timestamp || ""]);
        totalRows++;
      }
    }

    // 5. Sync Tasks
    const tasks = currentData.tasks || [];
    if (tasks.length > 0) {
      logs.push(`Streaming ${tasks.length} tasks...`);
      for (const t of tasks) {
        await client.query(`
          INSERT INTO tasks (id, title, "assignedTo", "dueDate", priority, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            "assignedTo" = EXCLUDED."assignedTo",
            "dueDate" = EXCLUDED."dueDate",
            priority = EXCLUDED.priority,
            status = EXCLUDED.status
        `, [t.id, t.title || "", t.assignedTo || null, t.dueDate || null, t.priority || "MEDIUM", t.status || "TODO"]);
        totalRows++;
      }
    }

    // 6. Sync Meetings
    const meetings = currentData.meetings || [];
    if (meetings.length > 0) {
      logs.push(`Streaming ${meetings.length} meetings...`);
      for (const m of meetings) {
        await client.query(`
          INSERT INTO meetings (id, title, "companyId", "companyName", attendees, "dateTime", notes, summary, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            "companyId" = EXCLUDED."companyId",
            "companyName" = EXCLUDED."companyName",
            attendees = EXCLUDED.attendees,
            "dateTime" = EXCLUDED."dateTime",
            notes = EXCLUDED.notes,
            summary = EXCLUDED.summary,
            status = EXCLUDED.status
        `, [m.id, m.title || "", m.companyId || null, m.companyName || null, m.attendees || [], m.dateTime || null, m.notes || null, m.summary || null, m.status || "SCHEDULED"]);
        totalRows++;
      }
    }

    // 7. Sync Events
    const events = currentData.events || [];
    if (events.length > 0) {
      logs.push(`Streaming ${events.length} IT events...`);
      for (const e of events) {
        await client.query(`
          INSERT INTO "ITEvent" (
            id, title, "eventType", "eventDate", year, month, quarter, region, district, venue, organizer, partners, "participantCount", "startupCount", "reportUrl", notes, "createdAt", "updatedAt"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            "eventType" = EXCLUDED."eventType",
            "eventDate" = EXCLUDED."eventDate",
            year = EXCLUDED.year,
            month = EXCLUDED.month,
            quarter = EXCLUDED.quarter,
            region = EXCLUDED.region,
            district = EXCLUDED.district,
            venue = EXCLUDED.venue,
            organizer = EXCLUDED.organizer,
            partners = EXCLUDED.partners,
            "participantCount" = EXCLUDED."participantCount",
            "startupCount" = EXCLUDED."startupCount",
            "reportUrl" = EXCLUDED."reportUrl",
            notes = EXCLUDED.notes,
            "createdAt" = EXCLUDED."createdAt",
            "updatedAt" = EXCLUDED."updatedAt"
        `, [
          e.id, e.title || "", e.eventType || "MEETUP", e.eventDate || "",
          Number(e.year) || 2026, Number(e.month) || 1, Number(e.quarter) || 1,
          e.region || "", e.district || "", e.venue || "", e.organizer || "",
          e.partners || null, Number(e.participantCount) || 0, Number(e.startupCount) || 0,
          e.reportUrl || null, e.notes || null, e.createdAt || new Date().toISOString(), e.updatedAt || new Date().toISOString()
        ]);
        totalRows++;
      }
    }

    // 8. Sync Offices
    const offices = currentData.offices || [];
    if (offices.length > 0) {
      logs.push(`Streaming ${offices.length} offices...`);
      for (const o of offices) {
        await client.query(`
          INSERT INTO offices (id, "roomNumber", building, floor, "areaSqM", "monthlyRent", status, "currentTenantId", "currentTenantName", "leaseStart", "leaseEnd")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            "roomNumber" = EXCLUDED."roomNumber",
            building = EXCLUDED.building,
            floor = EXCLUDED.floor,
            "areaSqM" = EXCLUDED."areaSqM",
            "monthlyRent" = EXCLUDED."monthlyRent",
            status = EXCLUDED.status,
            "currentTenantId" = EXCLUDED."currentTenantId",
            "currentTenantName" = EXCLUDED."currentTenantName",
            "leaseStart" = EXCLUDED."leaseStart",
            "leaseEnd" = EXCLUDED."leaseEnd"
        `, [
          o.id, o.roomNumber || "", o.building || "BLOCK_HQ", Number(o.floor) || 1,
          Number(o.areaSqM) || 0, Number(o.monthlyRent) || 0, o.status || "VACANT",
          o.currentTenantId || null, o.currentTenantName || null, o.leaseStart || null, o.leaseEnd || null
        ]);
        totalRows++;
      }
    }

    // 9. Sync Talent
    const talent = currentData.talent || [];
    if (talent.length > 0) {
      logs.push(`Streaming ${talent.length} talent candidates...`);
      for (const t of talent) {
        await client.query(`
          INSERT INTO talent (id, "fullName", university, major, "graduationYear", skills, status, phone, email, "englishLevel", "gitHubUrl", certifications, "codingScore", "englishScore", "softSkillsScore")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO UPDATE SET
            "fullName" = EXCLUDED."fullName",
            university = EXCLUDED.university,
            major = EXCLUDED.major,
            "graduationYear" = EXCLUDED."graduationYear",
            skills = EXCLUDED.skills,
            status = EXCLUDED.status,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            "englishLevel" = EXCLUDED."englishLevel",
            "gitHubUrl" = EXCLUDED."gitHubUrl",
            certifications = EXCLUDED.certifications,
            "codingScore" = EXCLUDED."codingScore",
            "englishScore" = EXCLUDED."englishScore",
            "softSkillsScore" = EXCLUDED."softSkillsScore"
        `, [
          t.id, t.fullName || "", t.university || null, t.major || null, Number(t.graduationYear) || 2026,
          t.skills || [], t.status || "STUDENT", t.phone || "", t.email || "", t.englishLevel || "B2",
          t.gitHubUrl || null, t.certifications || [],
          t.testScores ? Number(t.testScores.coding) || 0 : 0,
          t.testScores ? Number(t.testScores.english) || 0 : 0,
          t.testScores ? Number(t.testScores.softSkills) || 0 : 0
        ]);
        totalRows++;
      }
    }

    // 10. Sync Companies
    const companies = currentData.companies || [];
    if (companies.length > 0) {
      logs.push(`Streaming ${companies.length} CRM companies...`);
      for (const c of companies) {
        await client.query(`
          INSERT INTO companies (id, name, country, industry, website, "leadScore", status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            country = EXCLUDED.country,
            industry = EXCLUDED.industry,
            website = EXCLUDED.website,
            "leadScore" = EXCLUDED."leadScore",
            status = EXCLUDED.status
        `, [
          c.id, c.name || "", c.country || null, c.industry || null, c.website || "",
          Number(c.leadScore) || 0, c.status || "LEAD"
        ]);
        totalRows++;
      }
    }

    // 11. Sync Contacts
    const contacts = currentData.contacts || [];
    if (contacts.length > 0) {
      logs.push(`Streaming ${contacts.length} CRM contacts...`);
      for (const con of contacts) {
        await client.query(`
          INSERT INTO contacts (id, "companyId", "companyName", "fullName", role, email, phone, "linkedInUrl", notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            "companyId" = EXCLUDED."companyId",
            "companyName" = EXCLUDED."companyName",
            "fullName" = EXCLUDED."fullName",
            role = EXCLUDED.role,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            "linkedInUrl" = EXCLUDED."linkedInUrl",
            notes = EXCLUDED.notes
        `, [
          con.id, con.companyId || null, con.companyName || null, con.fullName || "",
          con.role || null, con.email || "", con.phone || "", con.linkedInUrl || null, con.notes || ""
        ]);
        totalRows++;
      }
    }

    // 12. Sync Buildings
    const buildings = currentData.buildings || [];
    if (buildings.length > 0) {
      logs.push(`Streaming ${buildings.length} building facilities...`);
      for (const b of buildings) {
        await client.query(`
          INSERT INTO buildings (id, name, code, address, region, district, coordinates, "constructionYear", floors, "totalArea", "totalOffices", capacity, "parkingSpots", "meetingRooms", status, images, "virtualTourUrl", documents)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            code = EXCLUDED.code,
            address = EXCLUDED.address,
            region = EXCLUDED.region,
            district = EXCLUDED.district,
            coordinates = EXCLUDED.coordinates,
            "constructionYear" = EXCLUDED."constructionYear",
            floors = EXCLUDED.floors,
            "totalArea" = EXCLUDED."totalArea",
            "totalOffices" = EXCLUDED."totalOffices",
            capacity = EXCLUDED.capacity,
            "parkingSpots" = EXCLUDED."parkingSpots",
            "meetingRooms" = EXCLUDED."meetingRooms",
            status = EXCLUDED.status,
            images = EXCLUDED.images,
            "virtualTourUrl" = EXCLUDED."virtualTourUrl",
            documents = EXCLUDED.documents
        `, [
          b.id, b.name || "", b.code || null, b.address || null, b.region || null, b.district || null,
          b.coordinates || null, Number(b.constructionYear) || 2022, Number(b.floors) || 1,
          Number(b.totalArea) || 0, Number(b.totalOffices) || 0, Number(b.capacity) || 0,
          Number(b.parkingSpots) || 0, Number(b.meetingRooms) || 0, b.status || "ACTIVE",
          b.images || [], b.virtualTourUrl || null, b.documents || []
        ]);
        totalRows++;
      }
    }

    // 13. Sync Assets
    const assets = currentData.assets || [];
    if (assets.length > 0) {
      logs.push(`Streaming ${assets.length} assets...`);
      for (const a of assets) {
        await client.query(`
          INSERT INTO assets (id, name, "serialNumber", category, "purchaseDate", "warrantyExpiry", condition, "assignedOfficeId", "assignedOfficeNumber", "assignedUserId", "assignedUserName", "purchaseCost", image, "maintenanceHistory")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            "serialNumber" = EXCLUDED."serialNumber",
            category = EXCLUDED.category,
            "purchaseDate" = EXCLUDED."purchaseDate",
            "warrantyExpiry" = EXCLUDED."warrantyExpiry",
            condition = EXCLUDED.condition,
            "assignedOfficeId" = EXCLUDED."assignedOfficeId",
            "assignedOfficeNumber" = EXCLUDED."assignedOfficeNumber",
            "assignedUserId" = EXCLUDED."assignedUserId",
            "assignedUserName" = EXCLUDED."assignedUserName",
            "purchaseCost" = EXCLUDED."purchaseCost",
            image = EXCLUDED.image,
            "maintenanceHistory" = EXCLUDED."maintenanceHistory"
        `, [
          a.id, a.name || "", a.serialNumber || null, a.category || null, a.purchaseDate || null, a.warrantyExpiry || null,
          a.condition || "EXCELLENT", a.assignedOfficeId || null, a.assignedOfficeNumber || null,
          a.assignedUserId || null, a.assignedUserName || null, Number(a.purchaseCost) || 0, a.image || null,
          a.maintenanceHistory || []
        ]);
        totalRows++;
      }
    }

    // 14. Sync Maintenance
    const maintenance = currentData.maintenance || [];
    if (maintenance.length > 0) {
      logs.push(`Streaming ${maintenance.length} maintenance records...`);
      for (const m of maintenance) {
        await client.query(`
          INSERT INTO maintenance (id, category, title, description, priority, status, "assignedEngineer", "createdAt", "officeId", "officeNumber", "buildingBlock", "beforePhoto", "afterPhoto", "completionReport", timeline)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO UPDATE SET
            category = EXCLUDED.category,
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            priority = EXCLUDED.priority,
            status = EXCLUDED.status,
            "assignedEngineer" = EXCLUDED."assignedEngineer",
            "createdAt" = EXCLUDED."createdAt",
            "officeId" = EXCLUDED."officeId",
            "officeNumber" = EXCLUDED."officeNumber",
            "buildingBlock" = EXCLUDED."buildingBlock",
            "beforePhoto" = EXCLUDED."beforePhoto",
            "afterPhoto" = EXCLUDED."afterPhoto",
            "completionReport" = EXCLUDED."completionReport",
            timeline = EXCLUDED.timeline
        `, [
          m.id, m.category || null, m.title || "", m.description || null, m.priority || "MEDIUM", m.status || "OPEN",
          m.assignedEngineer || null, m.createdAt || null, m.officeId || null, m.officeNumber || null, m.buildingBlock || null,
          m.beforePhoto || null, m.afterPhoto || null, m.completionReport || null,
          JSON.stringify(m.timeline || [])
        ]);
        totalRows++;
      }
    }

    // 15. Sync Utilities
    const utilities = currentData.utilities || [];
    if (utilities.length > 0) {
      logs.push(`Streaming ${utilities.length} utility consumption logs...`);
      for (const u of utilities) {
        await client.query(`
          INSERT INTO utilities (id, "buildingBlock", month, "electricityKwh", "electricityCost", "waterM3", "waterCost", "internetMbps", "internetCost", "heatingGcal", "heatingCost")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            "buildingBlock" = EXCLUDED."buildingBlock",
            month = EXCLUDED.month,
            "electricityKwh" = EXCLUDED."electricityKwh",
            "electricityCost" = EXCLUDED."electricityCost",
            "waterM3" = EXCLUDED."waterM3",
            "waterCost" = EXCLUDED."waterCost",
            "internetMbps" = EXCLUDED."internetMbps",
            "internetCost" = EXCLUDED."internetCost",
            "heatingGcal" = EXCLUDED."heatingGcal",
            "heatingCost" = EXCLUDED."heatingCost"
        `, [
          u.id, u.buildingBlock || "BLOCK_HQ", u.month || "",
          u.electricity ? Number(u.electricity.kwh) || 0 : 0,
          u.electricity ? Number(u.electricity.cost) || 0 : 0,
          u.water ? Number(u.water.m3) || 0 : 0,
          u.water ? Number(u.water.cost) || 0 : 0,
          u.internet ? Number(u.internet.mbps) || 0 : 0,
          u.internet ? Number(u.internet.cost) || 0 : 0,
          u.heating ? Number(u.heating.gcal) || 0 : 0,
          u.heating ? Number(u.heating.cost) || 0 : 0
        ]);
        totalRows++;
      }
    }

    // 16. Sync Reservations
    const reservations = currentData.reservations || [];
    if (reservations.length > 0) {
      logs.push(`Streaming ${reservations.length} facility reservations...`);
      for (const resv of reservations) {
        await client.query(`
          INSERT INTO reservations (id, "roomName", "buildingBlock", floor, "reservedBy", "residentName", date, "startTime", "endTime", purpose, status, recurring)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO UPDATE SET
            "roomName" = EXCLUDED."roomName",
            "buildingBlock" = EXCLUDED."buildingBlock",
            floor = EXCLUDED.floor,
            "reservedBy" = EXCLUDED."reservedBy",
            "residentName" = EXCLUDED."residentName",
            date = EXCLUDED.date,
            "startTime" = EXCLUDED."startTime",
            "endTime" = EXCLUDED."endTime",
            purpose = EXCLUDED.purpose,
            status = EXCLUDED.status,
            recurring = EXCLUDED.recurring
        `, [
          resv.id, resv.roomName || "", resv.buildingBlock || null, Number(resv.floor) || 1,
          resv.reservedBy || null, resv.residentName || null, resv.date || null, resv.startTime || null,
          resv.endTime || null, resv.purpose || null, resv.status || "APPROVED", resv.recurring === true
        ]);
        totalRows++;
      }
    }

    // 17. Sync Inspections
    const inspections = currentData.inspections || [];
    if (inspections.length > 0) {
      logs.push(`Streaming ${inspections.length} facility audits...`);
      for (const i of inspections) {
        await client.query(`
          INSERT INTO inspections (id, "buildingBlock", type, "inspectionDate", "inspectorName", "inspectorAgency", status, findings, recommendations, "certificateUrl", documents)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            "buildingBlock" = EXCLUDED."buildingBlock",
            type = EXCLUDED.type,
            "inspectionDate" = EXCLUDED."inspectionDate",
            "inspectorName" = EXCLUDED."inspectorName",
            "inspectorAgency" = EXCLUDED."inspectorAgency",
            status = EXCLUDED.status,
            findings = EXCLUDED.findings,
            recommendations = EXCLUDED.recommendations,
            "certificateUrl" = EXCLUDED."certificateUrl",
            documents = EXCLUDED.documents
        `, [
          i.id, i.buildingBlock || null, i.type || null, i.inspectionDate || null, i.inspectorName || null,
          i.inspectorAgency || null, i.status || "PASSED", i.findings || null, i.recommendations || null,
          i.certificateUrl || null, i.documents || []
        ]);
        totalRows++;
      }
    }

    // 18. Sync Contracts
    const contracts = currentData.contracts || [];
    if (contracts.length > 0) {
      logs.push(`Streaming ${contracts.length} resident contracts...`);
      for (const cr of contracts) {
        await client.query(`
          INSERT INTO contracts (id, "contractNumber", "tenantId", "tenantName", "officeId", "officeNumber", "buildingBlock", "contractType", "startDate", "endDate", "monthlyRentUSD", status, "documentUrl", "digitalSignature", "signedAt", payments)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO UPDATE SET
            "contractNumber" = EXCLUDED."contractNumber",
            "tenantId" = EXCLUDED."tenantId",
            "tenantName" = EXCLUDED."tenantName",
            "officeId" = EXCLUDED."officeId",
            "officeNumber" = EXCLUDED."officeNumber",
            "buildingBlock" = EXCLUDED."buildingBlock",
            "contractType" = EXCLUDED."contractType",
            "startDate" = EXCLUDED."startDate",
            "endDate" = EXCLUDED."endDate",
            "monthlyRentUSD" = EXCLUDED."monthlyRentUSD",
            status = EXCLUDED.status,
            "documentUrl" = EXCLUDED."documentUrl",
            "digitalSignature" = EXCLUDED."digitalSignature",
            "signedAt" = EXCLUDED."signedAt",
            payments = EXCLUDED.payments
        `, [
          cr.id, cr.contractNumber || null, cr.tenantId || null, cr.tenantName || null, cr.officeId || null,
          cr.officeNumber || null, cr.buildingBlock || null, cr.contractType || "LEASE", cr.startDate || null,
          cr.endDate || null, Number(cr.monthlyRentUSD) || 0, cr.status || "ACTIVE", cr.documentUrl || null,
          cr.digitalSignature || null, cr.signedAt || null, JSON.stringify(cr.payments || [])
        ]);
        totalRows++;
      }
    }

    // Everything else (properties, planningItems, kpiTargets, comments, campaigns,
    // aiConversations, aiMessages, and any future ad hoc collection with no dedicated
    // typed table above) goes into the generic entity_store JSONB fallback instead of
    // being silently skipped.
    const handledCollections = new Set([
      "users", "startups", "residents", "activityLogs", "tasks", "meetings", "events",
      "offices", "talent", "companies", "contacts", "buildings", "assets", "maintenance",
      "utilities", "reservations", "inspections", "contracts",
      // non-EntityRepository collections managed by their own repositories already:
      "refresh_tokens", "roles", "permissions", "role_permissions", "user_roles",
    ]);
    for (const [collectionName, records] of Object.entries(currentData)) {
      if (handledCollections.has(collectionName)) continue;
      if (!Array.isArray(records) || records.length === 0) continue;

      logs.push(`Streaming ${records.length} ${collectionName} (generic entity_store)...`);
      for (const record of records as any[]) {
        if (!record || !record.id) continue;
        const { id: _omitId, ...rest } = record;
        await client.query(
          `INSERT INTO entity_store (collection, id, data, "updatedAt")
           VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
           ON CONFLICT (collection, id) DO UPDATE SET
             data = EXCLUDED.data,
             "updatedAt" = CURRENT_TIMESTAMP`,
          [collectionName, record.id, JSON.stringify(rest)]
        );
        totalRows++;
      }
    }

    logs.push(`✅ Relational population finalized! Synced ${totalRows} entity tuples into active PostgreSQL schema.`);
    return {
      success: true,
      count: totalRows,
      log: logs
    };
  } catch (error: any) {
    console.error("PostgreSQL sync failure:", error);
    logs.push(`❌ Error: ${error.message}`);
    return {
      success: false,
      count: totalRows,
      log: logs
    };
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

/**
 * Smart active-write proxy keeping PostgreSQL dynamically in sync with web server updates.
 */
export async function saveDocToPostgres(collection: string, docId: string, fields: any) {
  const activePool = getPool();
  if (!activePool) return;

  try {
    if (collection === "users") {
      await activePool.query(`
        INSERT INTO users (id, email, password, name, role, department, "avatarUrl", active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          password = EXCLUDED.password,
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          department = EXCLUDED.department,
          "avatarUrl" = EXCLUDED."avatarUrl",
          active = EXCLUDED.active
      `, [docId, fields.email || "", fields.password || "password", fields.name || "", fields.role || "MANAGER", fields.department || null, fields.avatarUrl || null, fields.active !== false]);
    } else if (collection === "startups") {
      await activePool.query(`
        INSERT INTO startups (id, name, founder, email, phone, stage, status, industry, employees, revenue, "fundingRaised", "joinedAt", description, notes, documents, kpis)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          founder = EXCLUDED.founder,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          stage = EXCLUDED.stage,
          status = EXCLUDED.status,
          industry = EXCLUDED.industry,
          employees = EXCLUDED.employees,
          revenue = EXCLUDED.revenue,
          "fundingRaised" = EXCLUDED."fundingRaised",
          "joinedAt" = EXCLUDED."joinedAt",
          description = EXCLUDED.description,
          notes = EXCLUDED.notes,
          documents = EXCLUDED.documents,
          kpis = EXCLUDED.kpis
      `, [
        docId, fields.name || "", fields.founder || "", fields.email || null, fields.phone || null,
        fields.stage || null, fields.status || null, fields.industry || null, Number(fields.employees) || 0,
        Number(fields.revenue) || 0, Number(fields.fundingRaised) || 0, fields.joinedAt || null, fields.description || null,
        fields.notes || [], fields.documents || [], fields.kpis ? JSON.stringify(fields.kpis) : null
      ]);
    } else if (collection === "residents") {
      await activePool.query(`
        INSERT INTO residents (id, "companyName", director, "registrationNumber", "legalAddress", "employeesCount", "exportVolume", "domesticVolume", status, "appliedAt", "approvedAt", "benefitsApplied", notes, documents)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          "companyName" = EXCLUDED."companyName",
          director = EXCLUDED.director,
          "registrationNumber" = EXCLUDED."registrationNumber",
          "legalAddress" = EXCLUDED."legalAddress",
          "employeesCount" = EXCLUDED."employeesCount",
          "exportVolume" = EXCLUDED."exportVolume",
          "domesticVolume" = EXCLUDED."domesticVolume",
          status = EXCLUDED.status,
          "appliedAt" = EXCLUDED."appliedAt",
          "approvedAt" = EXCLUDED."approvedAt",
          "benefitsApplied" = EXCLUDED."benefitsApplied",
          notes = EXCLUDED.notes,
          documents = EXCLUDED.documents
      `, [
        docId, fields.companyName || "", fields.director || null, fields.registrationNumber || null,
        fields.legalAddress || null, Number(fields.employeesCount) || 0, Number(fields.exportVolume) || 0,
        Number(fields.domesticVolume) || 0, fields.status || "PENDING", fields.appliedAt || null, fields.approvedAt || null,
        fields.benefitsApplied || [], fields.notes || [], fields.documents || []
      ]);
    } else if (collection === "activityLogs") {
      await activePool.query(`
        INSERT INTO activity_logs (id, "userId", "userName", "userRole", action, entity, "entityId", timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [docId, fields.userId || "u-system", fields.userName || null, fields.userRole || null, fields.action || "", fields.entity || null, fields.entityId || null, fields.timestamp || ""]);
    } else if (collection === "tasks") {
      await activePool.query(`
        INSERT INTO tasks (id, title, "assignedTo", "dueDate", priority, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          "assignedTo" = EXCLUDED."assignedTo",
          "dueDate" = EXCLUDED."dueDate",
          priority = EXCLUDED.priority,
          status = EXCLUDED.status
      `, [docId, fields.title || "", fields.assignedTo || null, fields.dueDate || null, fields.priority || "MEDIUM", fields.status || "TODO"]);
    } else if (collection === "meetings") {
      await activePool.query(`
        INSERT INTO meetings (id, title, "companyId", "companyName", attendees, "dateTime", notes, summary, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          "companyId" = EXCLUDED."companyId",
          "companyName" = EXCLUDED."companyName",
          attendees = EXCLUDED.attendees,
          "dateTime" = EXCLUDED."dateTime",
          notes = EXCLUDED.notes,
          summary = EXCLUDED.summary,
          status = EXCLUDED.status
      `, [docId, fields.title || "", fields.companyId || null, fields.companyName || null, fields.attendees || [], fields.dateTime || null, fields.notes || null, fields.summary || null, fields.status || "SCHEDULED"]);
    } else if (collection === "events") {
      await activePool.query(`
        INSERT INTO "ITEvent" (
          id, title, "eventType", "eventDate", year, month, quarter, region, district, venue, organizer, partners, "participantCount", "startupCount", "reportUrl", notes, "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          "eventType" = EXCLUDED."eventType",
          "eventDate" = EXCLUDED."eventDate",
          year = EXCLUDED.year,
          month = EXCLUDED.month,
          quarter = EXCLUDED.quarter,
          region = EXCLUDED.region,
          district = EXCLUDED.district,
          venue = EXCLUDED.venue,
          organizer = EXCLUDED.organizer,
          partners = EXCLUDED.partners,
          "participantCount" = EXCLUDED."participantCount",
          "startupCount" = EXCLUDED."startupCount",
          "reportUrl" = EXCLUDED."reportUrl",
          notes = EXCLUDED.notes,
          "createdAt" = EXCLUDED."createdAt",
          "updatedAt" = EXCLUDED."updatedAt"
      `, [
        docId, fields.title || "", fields.eventType || "MEETUP", fields.eventDate || "",
        Number(fields.year) || 2026, Number(fields.month) || 1, Number(fields.quarter) || 1,
        fields.region || "", fields.district || "", fields.venue || "", fields.organizer || "",
        fields.partners || null, Number(fields.participantCount) || 0, Number(fields.startupCount) || 0,
        fields.reportUrl || null, fields.notes || null, fields.createdAt || new Date().toISOString(), fields.updatedAt || new Date().toISOString()
      ]);
    } else if (collection === "offices") {
      await activePool.query(`
        INSERT INTO offices (id, "roomNumber", building, floor, "areaSqM", "monthlyRent", status, "currentTenantId", "currentTenantName", "leaseStart", "leaseEnd")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          "roomNumber" = EXCLUDED."roomNumber",
          building = EXCLUDED.building,
          floor = EXCLUDED.floor,
          "areaSqM" = EXCLUDED."areaSqM",
          "monthlyRent" = EXCLUDED."monthlyRent",
          status = EXCLUDED.status,
          "currentTenantId" = EXCLUDED."currentTenantId",
          "currentTenantName" = EXCLUDED."currentTenantName",
          "leaseStart" = EXCLUDED."leaseStart",
          "leaseEnd" = EXCLUDED."leaseEnd"
      `, [
        docId, fields.roomNumber || "", fields.building || "BLOCK_HQ", Number(fields.floor) || 1,
        Number(fields.areaSqM) || 0, Number(fields.monthlyRent) || 0, fields.status || "VACANT",
        fields.currentTenantId || null, fields.currentTenantName || null, fields.leaseStart || null, fields.leaseEnd || null
      ]);
    } else if (collection === "talent") {
      await activePool.query(`
        INSERT INTO talent (id, "fullName", university, major, "graduationYear", skills, status, phone, email, "englishLevel", "gitHubUrl", certifications, "codingScore", "englishScore", "softSkillsScore")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          "fullName" = EXCLUDED."fullName",
          university = EXCLUDED.university,
          major = EXCLUDED.major,
          "graduationYear" = EXCLUDED."graduationYear",
          skills = EXCLUDED.skills,
          status = EXCLUDED.status,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          "englishLevel" = EXCLUDED."englishLevel",
          "gitHubUrl" = EXCLUDED."gitHubUrl",
          certifications = EXCLUDED.certifications,
          "codingScore" = EXCLUDED."codingScore",
          "englishScore" = EXCLUDED."englishScore",
          "softSkillsScore" = EXCLUDED."softSkillsScore"
      `, [
        docId, fields.fullName || "", fields.university || null, fields.major || null, Number(fields.graduationYear) || 2026,
        fields.skills || [], fields.status || "STUDENT", fields.phone || "", fields.email || "", fields.englishLevel || "B2",
        fields.gitHubUrl || null, fields.certifications || [],
        fields.testScores ? Number(fields.testScores.coding) || 0 : 0,
        fields.testScores ? Number(fields.testScores.english) || 0 : 0,
        fields.testScores ? Number(fields.testScores.softSkills) || 0 : 0
      ]);
    } else if (collection === "companies") {
      await activePool.query(`
        INSERT INTO companies (id, name, country, industry, website, "leadScore", status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          country = EXCLUDED.country,
          industry = EXCLUDED.industry,
          website = EXCLUDED.website,
          "leadScore" = EXCLUDED."leadScore",
          status = EXCLUDED.status
      `, [
        docId, fields.name || "", fields.country || null, fields.industry || null, fields.website || "",
        Number(fields.leadScore) || 0, fields.status || "LEAD"
      ]);
    } else if (collection === "contacts") {
      await activePool.query(`
        INSERT INTO contacts (id, "companyId", "companyName", "fullName", role, email, phone, "linkedInUrl", notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          "companyId" = EXCLUDED."companyId",
          "companyName" = EXCLUDED."companyName",
          "fullName" = EXCLUDED."fullName",
          role = EXCLUDED.role,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          "linkedInUrl" = EXCLUDED."linkedInUrl",
          notes = EXCLUDED.notes
      `, [
        docId, fields.companyId || null, fields.companyName || null, fields.fullName || "",
        fields.role || null, fields.email || "", fields.phone || "", fields.linkedInUrl || null, fields.notes || ""
      ]);
    } else if (collection === "buildings") {
      await activePool.query(`
        INSERT INTO buildings (id, name, code, address, region, district, coordinates, "constructionYear", floors, "totalArea", "totalOffices", capacity, "parkingSpots", "meetingRooms", status, images, "virtualTourUrl", documents, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          code = EXCLUDED.code,
          address = EXCLUDED.address,
          region = EXCLUDED.region,
          district = EXCLUDED.district,
          coordinates = EXCLUDED.coordinates,
          "constructionYear" = EXCLUDED."constructionYear",
          floors = EXCLUDED.floors,
          "totalArea" = EXCLUDED."totalArea",
          "totalOffices" = EXCLUDED."totalOffices",
          capacity = EXCLUDED.capacity,
          "parkingSpots" = EXCLUDED."parkingSpots",
          "meetingRooms" = EXCLUDED."meetingRooms",
          status = EXCLUDED.status,
          images = EXCLUDED.images,
          "virtualTourUrl" = EXCLUDED."virtualTourUrl",
          documents = EXCLUDED.documents,
          notes = EXCLUDED.notes
      `, [
        docId, fields.name || "", fields.code || null, fields.address || null, fields.region || null, fields.district || null,
        fields.coordinates || null, Number(fields.constructionYear) || 2022, Number(fields.floors) || 1,
        Number(fields.totalArea) || 0, Number(fields.totalOffices) || 0, Number(fields.capacity) || 0,
        Number(fields.parkingSpots) || 0, Number(fields.meetingRooms) || 0, fields.status || "ACTIVE",
        fields.images || [], fields.virtualTourUrl || null, fields.documents || [], fields.notes || null
      ]);
    } else if (collection === "assets") {
      await activePool.query(`
        INSERT INTO assets (id, name, "serialNumber", category, "purchaseDate", "warrantyExpiry", condition, "assignedOfficeId", "assignedOfficeNumber", "assignedUserId", "assignedUserName", "purchaseCost", image, "maintenanceHistory")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          "serialNumber" = EXCLUDED."serialNumber",
          category = EXCLUDED.category,
          "purchaseDate" = EXCLUDED."purchaseDate",
          "warrantyExpiry" = EXCLUDED."warrantyExpiry",
          condition = EXCLUDED.condition,
          "assignedOfficeId" = EXCLUDED."assignedOfficeId",
          "assignedOfficeNumber" = EXCLUDED."assignedOfficeNumber",
          "assignedUserId" = EXCLUDED."assignedUserId",
          "assignedUserName" = EXCLUDED."assignedUserName",
          "purchaseCost" = EXCLUDED."purchaseCost",
          image = EXCLUDED.image,
          "maintenanceHistory" = EXCLUDED."maintenanceHistory"
      `, [
        docId, fields.name || "", fields.serialNumber || null, fields.category || null, fields.purchaseDate || null, fields.warrantyExpiry || null,
        fields.condition || "EXCELLENT", fields.assignedOfficeId || null, fields.assignedOfficeNumber || null,
        fields.assignedUserId || null, fields.assignedUserName || null, Number(fields.purchaseCost) || 0, fields.image || null,
        fields.maintenanceHistory || []
      ]);
    } else if (collection === "maintenance") {
      await activePool.query(`
        INSERT INTO maintenance (id, category, title, description, priority, status, "assignedEngineer", "createdAt", "officeId", "officeNumber", "buildingBlock", "beforePhoto", "afterPhoto", "completionReport", timeline)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          category = EXCLUDED.category,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          priority = EXCLUDED.priority,
          status = EXCLUDED.status,
          "assignedEngineer" = EXCLUDED."assignedEngineer",
          "createdAt" = EXCLUDED."createdAt",
          "officeId" = EXCLUDED."officeId",
          "officeNumber" = EXCLUDED."officeNumber",
          "buildingBlock" = EXCLUDED."buildingBlock",
          "beforePhoto" = EXCLUDED."beforePhoto",
          "afterPhoto" = EXCLUDED."afterPhoto",
          "completionReport" = EXCLUDED."completionReport",
          timeline = EXCLUDED.timeline
      `, [
        docId, fields.category || null, fields.title || "", fields.description || null, fields.priority || "MEDIUM", fields.status || "OPEN",
        fields.assignedEngineer || null, fields.createdAt || null, fields.officeId || null, fields.officeNumber || null, fields.buildingBlock || null,
        fields.beforePhoto || null, fields.afterPhoto || null, fields.completionReport || null,
        JSON.stringify(fields.timeline || [])
      ]);
    } else if (collection === "utilities") {
      await activePool.query(`
        INSERT INTO utilities (id, "buildingBlock", month, "electricityKwh", "electricityCost", "waterM3", "waterCost", "internetMbps", "internetCost", "heatingGcal", "heatingCost")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          "buildingBlock" = EXCLUDED."buildingBlock",
          month = EXCLUDED.month,
          "electricityKwh" = EXCLUDED."electricityKwh",
          "electricityCost" = EXCLUDED."electricityCost",
          "waterM3" = EXCLUDED."waterM3",
          "waterCost" = EXCLUDED."waterCost",
          "internetMbps" = EXCLUDED."internetMbps",
          "internetCost" = EXCLUDED."internetCost",
          "heatingGcal" = EXCLUDED."heatingGcal",
          "heatingCost" = EXCLUDED."heatingCost"
      `, [
        docId, fields.buildingBlock || "BLOCK_HQ", fields.month || "",
        fields.electricity ? Number(fields.electricity.kwh) || 0 : 0,
        fields.electricity ? Number(fields.electricity.cost) || 0 : 0,
        fields.water ? Number(fields.water.m3) || 0 : 0,
        fields.water ? Number(fields.water.cost) || 0 : 0,
        fields.internet ? Number(fields.internet.mbps) || 0 : 0,
        fields.internet ? Number(fields.internet.cost) || 0 : 0,
        fields.heating ? Number(fields.heating.gcal) || 0 : 0,
        fields.heating ? Number(fields.heating.cost) || 0 : 0
      ]);
    } else if (collection === "reservations") {
      await activePool.query(`
        INSERT INTO reservations (id, "roomName", "buildingBlock", floor, "reservedBy", "residentName", date, "startTime", "endTime", purpose, status, recurring)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          "roomName" = EXCLUDED."roomName",
          "buildingBlock" = EXCLUDED."buildingBlock",
          floor = EXCLUDED.floor,
          "reservedBy" = EXCLUDED."reservedBy",
          "residentName" = EXCLUDED."residentName",
          date = EXCLUDED.date,
          "startTime" = EXCLUDED."startTime",
          "endTime" = EXCLUDED."endTime",
          purpose = EXCLUDED.purpose,
          status = EXCLUDED.status,
          recurring = EXCLUDED.recurring
      `, [
        docId, fields.roomName || "", fields.buildingBlock || null, Number(fields.floor) || 1,
        fields.reservedBy || null, fields.residentName || null, fields.date || null, fields.startTime || null,
        fields.endTime || null, fields.purpose || null, fields.status || "APPROVED", fields.recurring === true
      ]);
    } else if (collection === "inspections") {
      await activePool.query(`
        INSERT INTO inspections (id, "buildingBlock", type, "inspectionDate", "inspectorName", "inspectorAgency", status, findings, recommendations, "certificateUrl", documents)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          "buildingBlock" = EXCLUDED."buildingBlock",
          type = EXCLUDED.type,
          "inspectionDate" = EXCLUDED."inspectionDate",
          "inspectorName" = EXCLUDED."inspectorName",
          "inspectorAgency" = EXCLUDED."inspectorAgency",
          status = EXCLUDED.status,
          findings = EXCLUDED.findings,
          recommendations = EXCLUDED.recommendations,
          "certificateUrl" = EXCLUDED."certificateUrl",
          documents = EXCLUDED.documents
      `, [
        docId, fields.buildingBlock || null, fields.type || null, fields.inspectionDate || null, fields.inspectorName || null,
        fields.inspectorAgency || null, fields.status || "PASSED", fields.findings || null, fields.recommendations || null,
        fields.certificateUrl || null, fields.documents || []
      ]);
    } else if (collection === "contracts") {
      await activePool.query(`
        INSERT INTO contracts (id, "contractNumber", "tenantId", "tenantName", "officeId", "officeNumber", "buildingBlock", "contractType", "startDate", "endDate", "monthlyRentUSD", status, "documentUrl", "digitalSignature", "signedAt", payments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          "contractNumber" = EXCLUDED."contractNumber",
          "tenantId" = EXCLUDED."tenantId",
          "tenantName" = EXCLUDED."tenantName",
          "officeId" = EXCLUDED."officeId",
          "officeNumber" = EXCLUDED."officeNumber",
          "buildingBlock" = EXCLUDED."buildingBlock",
          "contractType" = EXCLUDED."contractType",
          "startDate" = EXCLUDED."startDate",
          "endDate" = EXCLUDED."endDate",
          "monthlyRentUSD" = EXCLUDED."monthlyRentUSD",
          status = EXCLUDED.status,
          "documentUrl" = EXCLUDED."documentUrl",
          "digitalSignature" = EXCLUDED."digitalSignature",
          "signedAt" = EXCLUDED."signedAt",
          payments = EXCLUDED.payments
      `, [
        docId, fields.contractNumber || null, fields.tenantId || null, fields.tenantName || null, fields.officeId || null,
        fields.officeNumber || null, fields.buildingBlock || null, fields.contractType || "LEASE", fields.startDate || null,
        fields.endDate || null, Number(fields.monthlyRentUSD) || 0, fields.status || "ACTIVE", fields.documentUrl || null,
        fields.digitalSignature || null, fields.signedAt || null, JSON.stringify(fields.payments || [])
      ]);
    } else {
      // Generic fallback: any collection without a dedicated typed table (properties,
      // planningItems, kpiTargets, comments, campaigns, aiConversations, aiMessages, or
      // any future ad hoc collection) is stored as a JSONB row instead of being dropped.
      const { id: _omitId, ...rest } = fields || {};
      await activePool.query(
        `INSERT INTO entity_store (collection, id, data, "updatedAt")
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (collection, id) DO UPDATE SET
           data = EXCLUDED.data,
           "updatedAt" = CURRENT_TIMESTAMP`,
        [collection, docId, JSON.stringify(rest)]
      );
    }
  } catch (err: any) {
    if (err?.code === "ENOTFOUND" || err?.message?.includes("EAI_AGAIN") || err?.message?.includes("getaddrinfo")) {
      if (pool) {
        pool.end().catch(() => {});
        pool = null;
      }
    } else {
      console.warn(`PostgreSQL: Write notice for '${collection}':`, err?.message || err);
    }
  }
}

/**
 * Smart active-write deletion proxy keeping PostgreSQL in sync.
 */
export async function deleteDocFromPostgres(collection: string, docId: string) {
  const activePool = getPool();
  if (!activePool) return;

  try {
    let tableName = collection;
    if (collection === "activityLogs") tableName = "activity_logs";
    else if (collection === "events") tableName = '"ITEvent"';

    const allowedTables = [
      "users", "startups", "residents", "activity_logs", "tasks", "meetings", '"ITEvent"',
      "offices", "talent", "companies", "contacts", "buildings", "assets", "maintenance",
      "utilities", "reservations", "inspections", "contracts"
    ];

    if (allowedTables.includes(tableName)) {
      await activePool.query(`DELETE FROM ${tableName} WHERE id = $1`, [docId]);
      console.log(`🔌 Synced: Deleted doc '${docId}' from table '${tableName}' in PostgreSQL.`);
    } else {
      await activePool.query(`DELETE FROM entity_store WHERE collection = $1 AND id = $2`, [collection, docId]);
      console.log(`🔌 Synced: Deleted doc '${docId}' from entity_store (collection '${collection}') in PostgreSQL.`);
    }
  } catch (err: any) {
    if (err?.code === "ENOTFOUND" || err?.message?.includes("EAI_AGAIN") || err?.message?.includes("getaddrinfo")) {
      if (pool) {
        pool.end().catch(() => {});
        pool = null;
      }
    } else {
      console.warn(`PostgreSQL: Deletion notice for '${collection}':`, err?.message || err);
    }
  }
}

/**
 * Read an entire collection from PostgreSQL - a typed table when one exists
 * (server/db/schema.sql), otherwise the generic entity_store JSONB fallback.
 * Returns null (not []) when Postgres is unreachable or the query itself fails,
 * so callers can distinguish "genuinely empty" from "couldn't ask Postgres" and
 * fall back to the local db_store.json cache only in the latter case.
 */
export async function getCollectionFromPostgres(collection: string): Promise<any[] | null> {
  const activePool = getPool();
  if (!activePool) return null;

  try {
    if (TYPED_TABLE_COLLECTIONS.includes(collection)) {
      const tableName = TABLE_NAME_MAP[collection] || collection;
      const res = await activePool.query(`SELECT * FROM ${tableName}`);
      return res.rows;
    }

    const res = await activePool.query(
      `SELECT id, data FROM entity_store WHERE collection = $1`,
      [collection]
    );
    return res.rows.map((r) => ({ id: r.id, ...r.data }));
  } catch (err: any) {
    console.warn(`PostgreSQL: read notice for '${collection}':`, err?.message || err);
    return null;
  }
}

/**
 * Read a single item by id from PostgreSQL. Same null-vs-not-found semantics as
 * getCollectionFromPostgres above (null = couldn't ask Postgres at all).
 */
export async function getItemFromPostgresById(collection: string, id: string): Promise<any | null> {
  const activePool = getPool();
  if (!activePool) return null;

  try {
    if (TYPED_TABLE_COLLECTIONS.includes(collection)) {
      const tableName = TABLE_NAME_MAP[collection] || collection;
      const res = await activePool.query(`SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`, [id]);
      return res.rows[0] || null;
    }

    const res = await activePool.query(
      `SELECT id, data FROM entity_store WHERE collection = $1 AND id = $2 LIMIT 1`,
      [collection, id]
    );
    if (res.rows.length === 0) return null;
    return { id: res.rows[0].id, ...res.rows[0].data };
  } catch (err: any) {
    console.warn(`PostgreSQL: getItemById notice for '${collection}':`, err?.message || err);
    return null;
  }
}

/**
 * Read every known collection (typed tables + entity_store) from PostgreSQL and
 * assemble them into the same shape db_store.json used to have. Returns null if
 * Postgres is unreachable, so EntityRepository can fall back to the JSON file.
 */
export async function getFullStateFromPostgres(): Promise<any | null> {
  const activePool = getPool();
  if (!activePool) return null;

  const allCollections = [...TYPED_TABLE_COLLECTIONS, ...GENERIC_STORE_COLLECTIONS];
  const result: any = {};

  try {
    for (const collection of allCollections) {
      const rows = await getCollectionFromPostgres(collection);
      if (rows !== null) result[collection] = rows;
    }
    return result;
  } catch (err: any) {
    console.warn("PostgreSQL: getFullState notice:", err?.message || err);
    return null;
  }
}

