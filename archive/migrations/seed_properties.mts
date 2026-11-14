/**
 * One-time (idempotent) migration: loads the real Qashqadaryo property
 * inventory (src/features/infrastructure/propertySeedData.ts) into the
 * persisted `properties` collection in server/db_store.json, so property
 * records actually exist as backend rows the Edit Profile UI can PUT
 * updates against. Existing properties.json rows are left untouched;
 * only properties whose id isn't already present are added, so this is
 * safe to re-run.
 *
 * Run with: npx tsx seed_properties.mts
 */
import fs from "fs";
import path from "path";
import { SEED_PROPERTIES } from "./src/features/infrastructure/propertySeedData";

const dbPath = path.join(process.cwd(), "server", "db_store.json");

const raw = fs.readFileSync(dbPath, "utf-8");
const db = JSON.parse(raw);
db.properties = db.properties || [];

let added = 0;
let skipped = 0;
for (const prop of SEED_PROPERTIES) {
  const exists = db.properties.some((p: any) => p.id === prop.id);
  if (exists) {
    skipped++;
    continue;
  }
  db.properties.push(prop);
  added++;
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
console.log(`Seeded ${added} new properties, skipped ${skipped} already present. Total properties: ${db.properties.length}`);
