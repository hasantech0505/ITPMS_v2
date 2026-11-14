/**
 * One-time migration: create the PostgreSQL schema (server/db/schema.sql) in the
 * database pointed to by DATABASE_URL, then bulk-copy every collection currently
 * in server/db_store.json into it.
 *
 * Run this yourself (needs a real connection to your local Postgres, which this
 * assistant's sandboxed tooling cannot reach): `npx tsx migrate_to_postgres.mts`
 *
 * Safe to re-run - every insert is an upsert (ON CONFLICT ... DO UPDATE), so running
 * this again after the app has written more data just re-syncs everything.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { testAndMigratePostgres, syncDataToPostgres, isPlaceholderDbUrl } from "./server/postgres";

async function main() {
  const connectionString = process.env.DATABASE_URL || "";

  if (isPlaceholderDbUrl(connectionString)) {
    console.error("❌ DATABASE_URL is missing or looks like a placeholder. Check your .env file.");
    process.exit(1);
  }

  console.log("Step 1/2: Applying schema (creating tables if they don't exist)...");
  const schemaResult = await testAndMigratePostgres(connectionString);
  for (const line of schemaResult.log) console.log("  " + line);
  if (!schemaResult.success) {
    console.error("❌ Schema migration failed:", schemaResult.message);
    process.exit(1);
  }
  console.log("✅ Schema ready.\n");

  console.log("Step 2/2: Copying db_store.json data into PostgreSQL...");
  const dbPath = path.join(process.cwd(), "server", "db_store.json");
  const currentData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const syncResult = await syncDataToPostgres(connectionString, currentData);
  for (const line of syncResult.log) console.log("  " + line);

  if (!syncResult.success) {
    console.error("❌ Data sync failed.");
    process.exit(1);
  }

  console.log(`\n✅ Migration complete. ${syncResult.count} records synced into PostgreSQL.`);
  console.log("Restart `npm run dev` so the app starts reading from Postgres.");
}

main().catch((err) => {
  console.error("❌ Migration script crashed:", err);
  process.exit(1);
});
