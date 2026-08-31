import { saveDocToPostgres, deleteDocFromPostgres, getPool, getCollectionFromPostgres } from "../postgres";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "server", "db_store.json");
let memoryDbCache: any = null;

async function readDB() {
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return { users: [] };
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db_store.json:", error);
  }
}

export interface UserRecord {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  active?: boolean;
}

export class UserRepository {
  // Shared raw read used by getAllUsers/getUsersFiltered - Postgres first, JSON fallback.
  private static async getAllUsersRaw(): Promise<UserRecord[]> {
    if (getPool()) {
      const fromPg = await getCollectionFromPostgres("users");
      if (fromPg !== null) return fromPg as UserRecord[];
    }
    const db = await readDB();
    return db.users || [];
  }

  static async findByEmail(email: string): Promise<UserRecord | null> {
    const clean = (email || "").trim().toLowerCase();
    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [clean]);
        if (res.rows.length > 0) {
          return res.rows[0] as UserRecord;
        }
      } catch (err) {
        // Fallback to local cache if pg fails
      }
    }

    const db = await readDB();
    const users: UserRecord[] = db.users || [];
    return users.find((u) => u.email.toLowerCase() === clean) || null;
  }

  static async findById(id: string): Promise<UserRecord | null> {
    const pool = getPool();
    if (pool) {
      try {
        const res = await pool.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
        if (res.rows.length > 0) {
          return res.rows[0] as UserRecord;
        }
      } catch (err) {
        // Fallback
      }
    }

    const db = await readDB();
    const users: UserRecord[] = db.users || [];
    return users.find((u) => u.id === id) || null;
  }

  static async getAllUsers(): Promise<Omit<UserRecord, "password">[]> {
    const users = await this.getAllUsersRaw();
    return users.map(({ password, ...rest }) => rest);
  }

  static async findByIdWithoutPassword(id: string): Promise<Omit<UserRecord, "password"> | null> {
    const user = await this.findById(id);
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  static async getUsersFiltered(params: {
    search?: string;
    role?: string;
    department?: string;
    active?: boolean | string;
    page?: number | string;
    limit?: number | string;
  }): Promise<{
    users: Omit<UserRecord, "password">[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let users: UserRecord[] = await this.getAllUsersRaw();

    // Filter by search query (name or email)
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }

    // Filter by role
    if (params.role && params.role.trim() && params.role !== "ALL") {
      const r = params.role.trim().toUpperCase();
      users = users.filter((u) => u.role.toUpperCase() === r);
    }

    // Filter by department
    if (params.department && params.department.trim() && params.department !== "ALL") {
      const dep = params.department.trim().toLowerCase();
      users = users.filter((u) => u.department && u.department.toLowerCase() === dep);
    }

    // Filter by active status
    if (params.active !== undefined && params.active !== null && params.active !== "" && params.active !== "ALL") {
      const isActive = String(params.active).toLowerCase() === "true";
      users = users.filter((u) => (u.active ?? true) === isActive);
    }

    const total = users.length;
    const page = Math.max(1, parseInt(String(params.page || 1), 10));
    const limit = Math.max(1, Math.min(100, parseInt(String(params.limit || 50), 10)));
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);

    const safeUsers = paginatedUsers.map(({ password, ...rest }) => ({
      ...rest,
      active: rest.active ?? true,
    }));

    return {
      users: safeUsers,
      total,
      page,
      limit,
      totalPages,
    };
  }

  static async createUser(user: UserRecord): Promise<Omit<UserRecord, "password">> {
    const db = await readDB();
    db.users = db.users || [];

    const newUser: UserRecord = {
      ...user,
      id: user.id || `u-${Date.now()}`,
      active: user.active ?? true,
    };

    db.users.push(newUser);
    await writeDB(db);

    await saveDocToPostgres("users", newUser.id, newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  static async updateUser(id: string, updates: Partial<UserRecord>): Promise<Omit<UserRecord, "password"> | null> {
    const db = await readDB();
    db.users = db.users || [];
    const idx = db.users.findIndex((u: UserRecord) => u.id === id);
    if (idx === -1) return null;

    db.users[idx] = { ...db.users[idx], ...updates };
    await writeDB(db);

    await saveDocToPostgres("users", id, db.users[idx]);
    const { password, ...safeUser } = db.users[idx];
    return safeUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    const db = await readDB();
    db.users = db.users || [];
    const initialLen = db.users.length;
    db.users = db.users.filter((u: UserRecord) => u.id !== id);
    if (db.users.length === initialLen) return false;

    await writeDB(db);
    await deleteDocFromPostgres("users", id);
    return true;
  }
}
