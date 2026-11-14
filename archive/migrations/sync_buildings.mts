/**
 * Adds the new `notes` column to the existing `buildings` table (schema.sql's
 * CREATE TABLE IF NOT EXISTS won't alter an already-existing table), then
 * pushes the full local db_store.json (now including the 11 buildings
 * extracted from the deck) to Postgres. Reads the local file directly,
 * bypassing EntityService.getFullState()'s Postgres-routing, for the same
 * reason final_sync.mts did.
 */
import fs from "fs";
import path from "path";
import { config } from "./server/config/env";
import { getPool, syncDataToPostgres, isPlaceholderDbUrl } from "./server/postgres";

async function main() {
  const dbUrl = config.databaseUrl;
  if (!dbUrl || isPlaceholderDbUrl(dbUrl)) {
    console.error("DATABASE_URL is not set or is a placeholder. Aborting.");
    process.exit(1);
  }

  const pool = getPool(dbUrl);
  if (!pool) {
    console.error("Could not create pool.");
    process.exit(1);
  }

  console.log("Adding notes column to buildings table (if missing)...");
  await pool.query(`ALTER TABLE buildings ADD COLUMN IF NOT EXISTS notes TEXT;`);
  console.log("Done.");

  const dbPath = path.join(process.cwd(), "server", "db_store.json");
  const fullState = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  console.log(`Local buildings count: ${(fullState.buildings || []).length}`);

  console.log("Syncing full local data to Postgres...");
  const result = await syncDataToPostgres(dbUrl, fullState);
  console.log(result.success ? `Sync succeeded (${result.count} records).` : "Sync failed.");
  console.log("Log (last 15 lines):", result.log.slice(-15).join("\n"));

  const check = await pool.query("SELECT COUNT(*) FROM buildings");
  console.log(`buildings rows in Postgres now: ${check.rows[0].count}`);

  await pool.end();
  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error("Script crashed:", err);
  process.exit(1);
});
