/**
 * Final, safe data push: reads db_store.json directly from disk (bypassing
 * EntityService/EntityRepository's Postgres-aware getFullState(), which has
 * a side effect of overwriting the local JSON file with whatever it reads
 * back from Postgres -- exactly what corrupted db_store.json last time).
 * This script only ever reads the local file and pushes it to Postgres; it
 * never reads from Postgres, so there's no way for it to overwrite anything
 * locally.
 */
import fs from "fs";
import path from "path";
import { config } from "./server/config/env";
import { syncDataToPostgres, isPlaceholderDbUrl } from "./server/postgres";

async function main() {
  const dbUrl = config.databaseUrl;
  if (!dbUrl || isPlaceholderDbUrl(dbUrl)) {
    console.error("DATABASE_URL is not set or is a placeholder. Aborting.");
    process.exit(1);
  }

  const dbPath = path.join(process.cwd(), "server", "db_store.json");
  const fullState = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  console.log("Read local db_store.json. Record counts:");
  for (const [k, v] of Object.entries(fullState)) {
    if (Array.isArray(v)) console.log(`  ${k}: ${v.length}`);
  }

  console.log("\nSyncing to Postgres...");
  const result = await syncDataToPostgres(dbUrl, fullState);
  console.log(result.success ? `Sync succeeded (${result.count} records).` : "Sync failed.");
  console.log("Log (last 30 lines):", result.log.slice(-30).join("\n"));

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error("Script crashed:", err);
  process.exit(1);
});
