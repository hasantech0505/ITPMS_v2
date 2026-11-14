/**
 * One-off, properly sequenced Supabase migration for Test_v1.
 * Runs schema migration -> resident data corrections -> full data sync,
 * awaited in order (avoids the fire-and-forget race in server.ts's normal
 * startup sequence, where corrections and the initial sync both kick off
 * without waiting on each other).
 */
import { config } from "./server/config/env";
import { testAndMigratePostgres, syncDataToPostgres, isPlaceholderDbUrl } from "./server/postgres";
import { EntityService } from "./server/services/entity.service";
import { applyPendingResidentCorrections } from "./server/startup/applyResidentCorrections";

async function main() {
  const dbUrl = config.databaseUrl;
  if (!dbUrl || isPlaceholderDbUrl(dbUrl)) {
    console.error("❌ DATABASE_URL is not set or is a placeholder. Aborting.");
    process.exit(1);
  }

  console.log("Step 1/3: Running schema migration against Supabase...");
  const migrationResult = await testAndMigratePostgres(dbUrl);
  console.log(migrationResult.success ? "✅ Schema migration succeeded." : "❌ Schema migration failed:", migrationResult.message);
  if (!migrationResult.success) {
    console.log("Migration log:", migrationResult.log.join("\n"));
    process.exit(1);
  }

  console.log("\nStep 2/3: Applying pending resident data corrections (district/industry/etc.)...");
  await applyPendingResidentCorrections();
  console.log("✅ Resident corrections step complete.");

  console.log("\nStep 3/3: Syncing full application data to Supabase...");
  const fullState = await EntityService.getFullState();
  const syncResult = await syncDataToPostgres(dbUrl, fullState);
  console.log(syncResult.success ? `✅ Data sync succeeded (${syncResult.count} records).` : "❌ Data sync failed.");
  console.log("Sync log (last 20 lines):", syncResult.log.slice(-20).join("\n"));

  process.exit(syncResult.success && migrationResult.success ? 0 : 1);
}

main().catch((err) => {
  console.error("❌ Migration script crashed:", err);
  process.exit(1);
});
