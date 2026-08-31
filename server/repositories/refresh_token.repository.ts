import { getPool } from "../postgres";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const dbPath = path.join(process.cwd(), "server", "db_store.json");
let memoryDbCache: any = null;

async function readDB() {
  if (memoryDbCache) return memoryDbCache;
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    const localData = JSON.parse(content);
    memoryDbCache = localData;
    return localData;
  } catch (error) {
    return { refresh_tokens: [] };
  }
}

async function writeDB(data: any) {
  memoryDbCache = data;
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db_store.json:", error);
  }
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  revoked: boolean;
  createdAt?: string;
}

export class RefreshTokenRepository {
  static async createToken(userId: string, token: string, expiresAt: Date): Promise<RefreshTokenRecord> {
    const id = `rt-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const tokenHash = hashToken(token);
    const expiresAtStr = expiresAt.toISOString();
    const createdAtStr = new Date().toISOString();

    const pool = getPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO refresh_tokens (id, "userId", "tokenHash", "expiresAt", revoked, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, userId, tokenHash, expiresAtStr, false, createdAtStr]
        );
      } catch (err) {
        console.warn("PostgreSQL refresh_token insert failed, using fallback store:", err);
      }
    }

    const db = await readDB();
    db.refresh_tokens = db.refresh_tokens || [];
    const record: RefreshTokenRecord = {
      id,
      userId,
      tokenHash,
      expiresAt: expiresAtStr,
      revoked: false,
      createdAt: createdAtStr,
    };
    db.refresh_tokens.push(record);
    await writeDB(db);

    return record;
  }

  static async findToken(token: string): Promise<RefreshTokenRecord | null> {
    const tokenHash = hashToken(token);
    const pool = getPool();

    if (pool) {
      try {
        const res = await pool.query(
          `SELECT * FROM refresh_tokens WHERE "tokenHash" = $1 LIMIT 1`,
          [tokenHash]
        );
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            userId: r.userId || r.user_id,
            tokenHash: r.tokenHash || r.token_hash,
            expiresAt: new Date(r.expiresAt || r.expires_at).toISOString(),
            revoked: Boolean(r.revoked),
            createdAt: r.createdAt || r.created_at,
          };
        }
      } catch (err) {
        // Fallback to db_store
      }
    }

    const db = await readDB();
    const tokens: RefreshTokenRecord[] = db.refresh_tokens || [];
    const found = tokens.find((t) => t.tokenHash === tokenHash);
    return found || null;
  }

  static async revokeToken(token: string): Promise<boolean> {
    const tokenHash = hashToken(token);
    const pool = getPool();

    if (pool) {
      try {
        await pool.query(
          `UPDATE refresh_tokens SET revoked = TRUE WHERE "tokenHash" = $1`,
          [tokenHash]
        );
      } catch (err) {
        // Fallback
      }
    }

    const db = await readDB();
    const tokens: RefreshTokenRecord[] = db.refresh_tokens || [];
    let updated = false;
    for (const t of tokens) {
      if (t.tokenHash === tokenHash) {
        t.revoked = true;
        updated = true;
      }
    }
    if (updated) {
      await writeDB(db);
    }
    return updated;
  }

  static async revokeAllUserTokens(userId: string): Promise<boolean> {
    const pool = getPool();
    if (pool) {
      try {
        await pool.query(
          `UPDATE refresh_tokens SET revoked = TRUE WHERE "userId" = $1`,
          [userId]
        );
      } catch (err) {
        // Fallback
      }
    }

    const db = await readDB();
    const tokens: RefreshTokenRecord[] = db.refresh_tokens || [];
    let updated = false;
    for (const t of tokens) {
      if (t.userId === userId) {
        t.revoked = true;
        updated = true;
      }
    }
    if (updated) {
      await writeDB(db);
    }
    return updated;
  }
}
