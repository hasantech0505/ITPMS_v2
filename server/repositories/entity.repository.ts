/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  saveDocToPostgres,
  deleteDocFromPostgres,
  getPool,
  getCollectionFromPostgres,
  getItemFromPostgresById,
  getFullStateFromPostgres,
} from "../postgres";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "server", "db_store.json");

// db_store.json is now a local cache / offline fallback, not the source of truth.
// When PostgreSQL is reachable, every read below goes to Postgres first; the JSON
// file is only consulted when the pool is unavailable or a query fails outright
// (never for a legitimately-empty Postgres result).
async function readDB() {
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
}

async function writeDB(data: any) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing db_store.json:", error);
  }
}

export class EntityRepository {
  static async getFullState() {
    if (getPool()) {
      const fromPg = await getFullStateFromPostgres();
      if (fromPg) {
        // Keep the local JSON cache warm too, so a later Postgres outage still has
        // something reasonably fresh to fall back to.
        writeDB(fromPg).catch(() => {});
        return fromPg;
      }
    }
    return await readDB();
  }

  static async saveFullState(data: any) {
    await writeDB(data);
    return data;
  }

  static async getCollection(entityName: string): Promise<any[]> {
    if (getPool()) {
      const fromPg = await getCollectionFromPostgres(entityName);
      if (fromPg !== null) return fromPg;
    }
    const db = await readDB();
    return db[entityName] || [];
  }

  static async getItemById(entityName: string, id: string): Promise<any | null> {
    if (getPool()) {
      const fromPg = await getItemFromPostgresById(entityName, id);
      if (fromPg) return fromPg;
    }
    const db = await readDB();
    const list = db[entityName] || [];
    return list.find((item: any) => item.id === id) || null;
  }

  static async createItem(entityName: string, item: any): Promise<any> {
    const db = await readDB();
    db[entityName] = db[entityName] || [];
    db[entityName].push(item);
    await writeDB(db);

    // Awaited (not fire-and-forget) so a read immediately after this call sees
    // consistent state in Postgres. saveDocToPostgres already swallows its own
    // errors internally and never throws, so this can't fail this operation.
    await saveDocToPostgres(entityName, item.id, item);
    return item;
  }

  static async updateItem(entityName: string, id: string, updates: any): Promise<any | null> {
    const db = await readDB();
    db[entityName] = db[entityName] || [];
    const idx = db[entityName].findIndex((item: any) => item.id === id);
    if (idx === -1) return null;

    db[entityName][idx] = { ...db[entityName][idx], ...updates };
    await writeDB(db);

    await saveDocToPostgres(entityName, id, db[entityName][idx]);
    return db[entityName][idx];
  }

  static async deleteItem(entityName: string, id: string): Promise<boolean> {
    const db = await readDB();
    db[entityName] = db[entityName] || [];
    const lenBefore = db[entityName].length;
    db[entityName] = db[entityName].filter((item: any) => item.id !== id);

    if (db[entityName].length === lenBefore) return false;

    await writeDB(db);
    await deleteDocFromPostgres(entityName, id);
    return true;
  }

  static async appendActivityLog(log: {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    action: string;
    entity: string;
    entityId: string;
    timestamp: string;
    details?: string;
  }) {
    const db = await readDB();
    db.activityLogs = [log, ...(db.activityLogs || [])];
    await writeDB(db);

    await saveDocToPostgres("activityLogs", log.id, log);
    return log;
  }
}
