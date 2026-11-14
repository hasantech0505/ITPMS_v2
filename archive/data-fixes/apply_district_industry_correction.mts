/**
 * One-time correction: backfills real `district` and `industry` values on
 * resident records from the official IT Park resident register
 * (Residents.xlsx, "Hudud/Shahar-tuman" and "Faoliyat turi" columns),
 * matched by INN (registrationNumber). Every field was previously null,
 * which is why the Residents table and the dashboard's Geographic
 * Distribution / Strategic Scorecard widgets showed the generic
 * "Software Development" / 0% placeholders for every company - those are
 * UI fallback defaults, not real stored data.
 *
 * Run with: npx tsx apply_district_industry_correction.mts
 * Safe to re-run - only ever calls ResidentRepository.updateResident.
 */
import "dotenv/config";
import fs from "fs";
import { ResidentRepository } from "./server/repositories/resident.repository";

interface Patch {
  id: string;
  inn: string;
  name: string;
  patch: { district?: string; industry?: string };
}

async function main() {
  const patches: Patch[] = JSON.parse(fs.readFileSync("/tmp/resident_patches.json", "utf-8"));
  console.log(`Applying district/industry corrections to ${patches.length} residents...\n`);

  let ok = 0;
  let missing = 0;
  for (const p of patches) {
    const result = await ResidentRepository.updateResident(p.id, p.patch);
    if (!result) {
      console.warn(`  ! ${p.id} (${p.name}, INN ${p.inn}) not found - skipped`);
      missing++;
      continue;
    }
    ok++;
  }

  console.log(`\nDone. ${ok} residents corrected, ${missing} not found.`);
  console.log("Restart `npm run dev` (or refresh) to see corrected districts/industries.");
}

main().catch((err) => {
  console.error("Correction script crashed:", err);
  process.exit(1);
});
