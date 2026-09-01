/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Second-round correction: backfills real district / industry / activityType /
 * phone onto the 77 companies in the official, currently-active IT Park
 * resident register ("Jami-Residentlar" sheet of the client-supplied
 * Residents.xlsx), matched by INN (registrationNumber). All 77 matched an
 * existing resident record - this is purely a fill-in-the-gaps correction,
 * not a new-resident import.
 *
 * WHY THIS RE-RUN WAS NEEDED (read this before deleting this file):
 * An earlier correction pass this same day looked like it worked (its own
 * script reported "82 corrected, 0 not found") but never actually reached
 * Postgres - server/postgres.ts's saveDocToPostgres()/syncDataToPostgres()
 * INSERT statements for the "residents" collection only listed 14 of the
 * table's ~45 columns, silently dropping district/industry/activityType/
 * phone/email/website/telegram/linkedin/assignedManager and the entire CRM
 * pipeline history on every write. Worse, EntityRepository.getFullState()
 * reads Postgres-first and then "keeps db_store.json's cache warm" by
 * writing that (incomplete) Postgres data straight back into db_store.json
 * on every /api/db boot fetch - so even the correction's local JSON write
 * got silently erased the next time the app loaded. That INSERT/UPSERT gap
 * is now fixed (see server/postgres.ts) to cover the full column list, so
 * this re-run will actually stick this time.
 *
 * NOTE: this correction also runs automatically on server boot now (see
 * server/startup/applyResidentCorrections.ts's applyPendingResidentCorrectionsV2,
 * wired into server.ts) - restarting `npm run dev` is enough on its own.
 * This standalone script is kept for the record / for a manual re-run.
 *
 * Run with: npx tsx apply_district_industry_correction_v2.mts
 * Safe to re-run - only ever calls ResidentRepository.updateResident.
 */
import "dotenv/config";
import fs from "fs";
import { ResidentRepository } from "./server/repositories/resident.repository";
import { ResidentStatus } from "./src/types";

interface Patch {
  id: string;
  inn: string;
  name: string;
  patch: { district?: string; industry?: string; activityType?: string; phone?: string; status?: ResidentStatus };
}

async function main() {
  const patches: Patch[] = JSON.parse(fs.readFileSync("residents_updates_v2.json", "utf-8"));
  console.log(`Applying district/industry/activityType/phone corrections to ${patches.length} residents (the 77-company active register)...\n`);

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
  console.log("\nNote: 3 OTHER residents are currently marked ACTIVE in the database but are");
  console.log("NOT part of this 77-company official register - left untouched, flag to Hasan:");
  console.log('  - "BEKZOD MADATOV ACADEMY" MCHJ (INN 311630800) - appears in the 2026');
  console.log("    registrations sheet but not yet in the current active-register sheet");
  console.log('  - "Edits Group" MCHJ (INN 3172217 - only 7 digits, likely a data-entry error)');
  console.log('  - "TEST" (INN 123123123) - a leftover test record from Add-Resident testing;');
  console.log("    delete it from the Residents table, or note that INN is now taken if you");
  console.log("    want to re-test adding a resident.");
}

main().catch((err) => {
  console.error("Correction script crashed:", err);
  process.exit(1);
});
