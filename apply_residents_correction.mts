/**
 * One-time correction: back-fills district / industry / activityType / phone
 * (and 5 stale status values) on existing resident records using real data
 * from the official IT Park resident register Excel file, matched by INN
 * (registrationNumber). Every one of these 146 companies already exists in
 * the database — this only fills in fields that were empty/null (which is
 * why the Residents table was showing the same generic "Software
 * Development" / "Qarshi" / phone placeholder for almost every row: those
 * are UI fallback defaults in ResidentEnrichment.ts, not real stored data).
 *
 * Run this yourself: `npx tsx apply_residents_correction.mts`
 * Safe to re-run - it only ever calls ResidentRepository.updateResident,
 * which upserts the same corrected values again.
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { ResidentRepository } from "./server/repositories/resident.repository";

async function main() {
  const updatesPath = path.join(process.cwd(), "residents_updates.json");
  const updates: Array<{ id: string; inn: string; name: string; patch: Record<string, any> }> =
    JSON.parse(fs.readFileSync(updatesPath, "utf-8"));

  console.log(`Applying corrections to ${updates.length} residents...\n`);

  let ok = 0;
  let missing = 0;
  const statusChanges: string[] = [];

  for (const u of updates) {
    const result = await ResidentRepository.updateResident(u.id, u.patch);
    if (!result) {
      console.warn(`  ! ${u.id} (${u.name}) not found - skipped`);
      missing++;
      continue;
    }
    ok++;
    if (u.patch.status) {
      statusChanges.push(`${u.name} (INN ${u.inn}): status -> ${u.patch.status}`);
    }
  }

  console.log(`\nDone. ${ok} residents corrected, ${missing} not found.`);
  if (statusChanges.length) {
    console.log(`\nStatus corrections applied (backed by the 2024/2025/2026 "removed" and "upcoming" sheets):`);
    for (const line of statusChanges) console.log("  - " + line);
  }
  console.log("\nRestart `npm run dev` (or just refresh) to see the corrected data.");
}

main().catch((err) => {
  console.error("Correction script crashed:", err);
  process.exit(1);
});
