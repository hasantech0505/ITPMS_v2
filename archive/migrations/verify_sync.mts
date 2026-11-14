import { config } from "./server/config/env";
import { getPool, isPlaceholderDbUrl } from "./server/postgres";

async function main() {
  const dbUrl = config.databaseUrl;
  if (!dbUrl || isPlaceholderDbUrl(dbUrl)) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }
  const pool = getPool(dbUrl);
  if (!pool) {
    console.error("Could not create pool.");
    process.exit(1);
  }
  const tables = [
    "residents", "startups", "users", "companies", "contacts", "properties",
    "events", "activity_logs", "planning_items", "ai_conversations", "ai_messages",
    "buildings",
  ];
  for (const t of tables) {
    try {
      const res = await pool.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`${t}: ${res.rows[0].count}`);
    } catch (err: any) {
      console.log(`${t}: ERROR - ${err.message}`);
    }
  }
  await pool.end();
}

main().catch((err) => {
  console.error("Crashed:", err);
  process.exit(1);
});
