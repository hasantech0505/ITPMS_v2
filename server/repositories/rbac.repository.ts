import { getPool } from "../postgres";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "server", "db_store.json");
let memoryDbCache: any = null;

async function readDB() {
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return { roles: [], permissions: [], role_permissions: [], user_roles: [] };
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db_store.json:", error);
  }
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface UserRoleRecord {
  userId: string;
  roleId: string;
}

// System Roles
export const SYSTEM_ROLES = [
  { id: "r-superadmin", name: "SUPER_ADMIN", description: "Full unrestricted platform administrator access" },
  { id: "r-manager", name: "MANAGER", description: "Regional & Operations Manager for Residents, Startups, Events, and CRM" },
];

// System Permissions grouped by module
export const SYSTEM_PERMISSIONS = [
  // Users Module
  { id: "p-users-read", name: "users.read", module: "users", description: "View user directory and user profiles" },
  { id: "p-users-create", name: "users.create", module: "users", description: "Create new platform user accounts" },
  { id: "p-users-update", name: "users.update", module: "users", description: "Edit user profile information and status" },
  { id: "p-users-delete", name: "users.delete", module: "users", description: "Delete user accounts" },

  // Residents Module
  { id: "p-residents-read", name: "residents.read", module: "residents", description: "View IT Park registered residents list and details" },
  { id: "p-residents-create", name: "residents.create", module: "residents", description: "Register new IT Park resident applications" },
  { id: "p-residents-update", name: "residents.update", module: "residents", description: "Update resident status, tax benefits and quarterly reports" },
  { id: "p-residents-delete", name: "residents.delete", module: "residents", description: "Revoke resident status or remove resident records" },

  // Startups Module
  { id: "p-startups-read", name: "startups.read", module: "startups", description: "View startup ecosystem listings, KPIs, and founders" },
  { id: "p-startups-create", name: "startups.create", module: "startups", description: "Onboard new startups to incubation/acceleration" },
  { id: "p-startups-update", name: "startups.update", module: "startups", description: "Update startup progress, KPIs, and funding status" },
  { id: "p-startups-delete", name: "startups.delete", module: "startups", description: "Remove startups from acceleration records" },

  // IT Events Module
  { id: "p-events-read", name: "events.read", module: "events", description: "View IT event schedules, locations and reports" },
  { id: "p-events-manage", name: "events.manage", module: "events", description: "Create, edit, and organize IT events and hackathons" },

  // CRM & Partners Module
  { id: "p-crm-read", name: "crm.read", module: "crm", description: "View CRM leads, contacts, companies, and meetings" },
  { id: "p-crm-manage", name: "crm.manage", module: "crm", description: "Manage CRM pipeline, add contacts, log meetings" },

  // Analytics & Reports
  { id: "p-analytics-read", name: "analytics.read", module: "analytics", description: "Access executive dashboards, export stats, and AI forecasts" },
  { id: "p-analytics-manage", name: "analytics.manage", module: "analytics", description: "Adjust strategic KPI targets and goals on the executive dashboard" },

  // Infrastructure & Real Estate
  { id: "p-infra-read", name: "infrastructure.read", module: "infrastructure", description: "View office space vacancies, buildings, and assets" },
  { id: "p-infra-manage", name: "infrastructure.manage", module: "infrastructure", description: "Manage leases, contracts, assets, and maintenance tickets" },

  // Security Audit Logs
  { id: "p-audit-read", name: "audit.read", module: "audit", description: "View system audit logs, security events, and user activity" },

  // Strategic Planning & Roadmap
  { id: "p-planning-read", name: "planning.read", module: "planning", description: "View the strategic planning & roadmap board" },
  { id: "p-planning-manage", name: "planning.manage", module: "planning", description: "Create, edit, and update strategic planning & roadmap items" },

  // Edo Ijro Tizim — Government Reporting Module
  { id: "p-edoreports-read", name: "edoReports.read", module: "edoReports", description: "View Edo Ijro Tizim quarterly reports" },
  { id: "p-edoreports-manage", name: "edoReports.manage", module: "edoReports", description: "Create, edit, and export Edo Ijro Tizim quarterly reports" },

  // System Settings & RBAC
  { id: "p-settings-manage", name: "settings.manage", module: "settings", description: "Manage RBAC roles, permission assignments, and system config" },
];

// Default Role-Permission Mappings
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: SYSTEM_PERMISSIONS.map((p) => p.name),
  MANAGER: [
    "users.read",
    "residents.read", "residents.create", "residents.update", "residents.delete",
    "startups.read", "startups.create", "startups.update", "startups.delete",
    "events.read", "events.manage",
    "crm.read", "crm.manage",
    "analytics.read", "analytics.manage",
    "planning.read", "planning.manage",
    "infrastructure.read", "infrastructure.manage",
    "edoReports.read", "edoReports.manage",
    "audit.read",
  ],
};

export class RbacRepository {
  /**
   * Seed default RBAC roles and permissions into database / db_store.
   */
  static async seedRbacData(): Promise<void> {
    const db = await readDB();
    
    // Ensure arrays exist
    db.roles = db.roles || [];
    db.permissions = db.permissions || [];
    db.role_permissions = db.role_permissions || [];
    db.user_roles = db.user_roles || [];

    // Seed roles in JSON store if missing
    for (const r of SYSTEM_ROLES) {
      if (!db.roles.some((role: Role) => role.name === r.name)) {
        db.roles.push(r);
      }
    }

    // Seed permissions in JSON store if missing
    for (const p of SYSTEM_PERMISSIONS) {
      if (!db.permissions.some((perm: Permission) => perm.name === p.name)) {
        db.permissions.push(p);
      }
    }

    // Seed role-permission associations in JSON store for all roles
    for (const [roleName, permNames] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
      const role = db.roles.find((r: Role) => r.name === roleName);
      if (!role) continue;
      for (const pName of permNames) {
        const perm = db.permissions.find((p: Permission) => p.name === pName);
        if (perm) {
          const exists = db.role_permissions.some(
            (rp: RolePermission) => rp.roleId === role.id && rp.permissionId === perm.id
          );
          if (!exists) {
            db.role_permissions.push({ roleId: role.id, permissionId: perm.id });
          }
        }
      }
    }

    await writeDB(db);

    // Sync with Postgres if pool is active
    const pool = getPool();
    if (pool) {
      try {
        for (const r of SYSTEM_ROLES) {
          await pool.query(
            `INSERT INTO roles (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING`,
            [r.id, r.name, r.description]
          );
        }

        for (const p of SYSTEM_PERMISSIONS) {
          await pool.query(
            `INSERT INTO permissions (id, name, module, description) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING`,
            [p.id, p.name, p.module, p.description]
          );
        }

        for (const [roleName, permNames] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
          const roleRes = await pool.query(`SELECT id FROM roles WHERE name = $1`, [roleName]);
          if (roleRes.rows.length === 0) continue;
          const roleId = roleRes.rows[0].id;

          for (const pName of permNames) {
            const permRes = await pool.query(`SELECT id FROM permissions WHERE name = $1`, [pName]);
            if (permRes.rows.length === 0) continue;
            const permId = permRes.rows[0].id;

            await pool.query(
              `INSERT INTO role_permissions ("roleId", "permissionId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
              [roleId, permId]
            );
          }
        }
      } catch (err) {
        console.warn("PostgreSQL RBAC seed warning:", err);
      }
    }
  }

  static async getAllRoles(): Promise<Role[]> {
    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query("SELECT * FROM roles ORDER BY name");
        if (res.rows.length > 0) return res.rows;
      } catch (e) {}
    }
    const db = await readDB();
    return db.roles || SYSTEM_ROLES;
  }

  static async getAllPermissions(): Promise<Permission[]> {
    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query("SELECT * FROM permissions ORDER BY module, name");
        if (res.rows.length > 0) return res.rows;
      } catch (e) {}
    }
    const db = await readDB();
    return db.permissions || SYSTEM_PERMISSIONS;
  }

  static async getPermissionsForRole(roleName: string): Promise<string[]> {
    const upperRole = roleName.toUpperCase();
    if (upperRole === "SUPER_ADMIN") {
      return SYSTEM_PERMISSIONS.map((p) => p.name);
    }

    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query(
          `SELECT p.name FROM permissions p
           JOIN role_permissions rp ON p.id = rp."permissionId"
           JOIN roles r ON r.id = rp."roleId"
           WHERE UPPER(r.name) = $1`,
          [upperRole]
        );
        if (res.rows.length > 0) {
          return res.rows.map((row) => row.name);
        }
      } catch (e) {}
    }

    const db = await readDB();
    const role = (db.roles || []).find((r: Role) => r.name.toUpperCase() === upperRole);
    if (!role) {
      return DEFAULT_ROLE_PERMISSIONS[upperRole] || DEFAULT_ROLE_PERMISSIONS.MANAGER;
    }

    const rolePermIds = (db.role_permissions || [])
      .filter((rp: RolePermission) => rp.roleId === role.id)
      .map((rp: RolePermission) => rp.permissionId);

    const perms = (db.permissions || [])
      .filter((p: Permission) => rolePermIds.includes(p.id))
      .map((p: Permission) => p.name);

    return perms.length > 0 ? perms : (DEFAULT_ROLE_PERMISSIONS[upperRole] || DEFAULT_ROLE_PERMISSIONS.MANAGER);
  }

  static async userHasPermission(userRole: string, requiredPermission: string): Promise<boolean> {
    const upperRole = userRole.toUpperCase();
    if (upperRole === "SUPER_ADMIN") {
      return true;
    }

    const permissions = await this.getPermissionsForRole(upperRole);
    return permissions.includes(requiredPermission);
  }
}
