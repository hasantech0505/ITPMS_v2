/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { ResidentRepository } from "../repositories/resident.repository";

const MARKER_PATH = path.join(process.cwd(), "server", ".migrations_applied.json");
const MIGRATION_KEY = "residentsCorrectionV1";
const UPDATES_PATH = path.join(process.cwd(), "residents_updates.json");
const DB_PATH = path.join(process.cwd(), "server", "db_store.json");

// V2 (2026-09-01): a second, separate correction pass sourced fresh from the
// official register's currently-active-residents sheet (77 companies), run
// after discovering that server/postgres.ts's residents INSERT/UPSERT was
// silently dropping district/industry/activityType/phone (among other
// columns) on every write - which is why V1's corrections above never
// actually reached Postgres and kept appearing to "revert." That write-path
// bug is now fixed, so this V2 pass is what actually makes the district/
// industry data stick. See apply_district_industry_correction_v2.mts for
// the full story.
const MIGRATION_KEY_V2 = "residentsCorrectionV2";
const UPDATES_PATH_V2 = path.join(process.cwd(), "residents_updates_v2.json");

// Cleanup (2026-09-01, night): a leftover "TEST" resident (INN 123123123)
// has been sitting in the database since the user was probing the original
// Add-Resident bug, and it kept blocking every later attempt to actually
// test Add Resident with that same INN - the backend's duplicate-INN check
// correctly (if unhelpfully, before the alert-message fix in src/App.tsx)
// rejected every subsequent "test" submission. One-time, run-once cleanup
// so this stops needing to be flagged manually every time it comes up.
const MIGRATION_KEY_CLEANUP_TEST = "residentsCleanupTestRecordV1";

function readMarkers(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(MARKER_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeMarkers(markers: Record<string, boolean>) {
  try {
    fs.writeFileSync(MARKER_PATH, JSON.stringify(markers, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write migration marker:", err);
  }
}

/**
 * Applies a set of {id, patch} updates to server/db_store.json in ONE
 * synchronous read-modify-write pass, instead of looping
 * ResidentRepository.updateResident() (one readDB()/writeDB()/
 * saveDocToPostgres() round-trip PER resident).
 *
 * NOTE (2026-09-01, night): that per-item approach is what caused the
 * "1 updated, 76 not found" / later "11 updated, 66 not found" results seen
 * on real boots, even though every id in the update files genuinely existed
 * in db_store.json both before and after each run. The real cause:
 * `EntityRepository.getFullState()` "keeps the JSON cache warm" by
 * overwriting db_store.json with whatever Postgres currently holds every
 * time it runs - and it runs on every `/api/db` request, which the running
 * frontend fires on its own (page loads, refreshes) completely independent
 * of server startup. A ~150-item loop of awaited per-resident round-trips
 * leaves a multi-second window where any one of those ordinary frontend
 * requests can land mid-loop and silently overwrite db_store.json out from
 * under it. Sequencing the corrections at startup (done earlier the same
 * night, see server.ts) only protected against the ONE competing call this
 * file's own author controlled - it did nothing about the frontend's.
 *
 * Collapsing this to a single synchronous read + apply-all-patches-in-memory
 * + single synchronous write closes that window to effectively zero: once
 * this function starts running there is no `await` inside the read-modify-
 * write section for the Node event loop to use to interleave a competing
 * request's write. Postgres itself is no longer written per-item here at
 * all - the corrected state is left for server.ts's existing post-correction
 * `getFullState()` + `syncDataToPostgres()` call to push in one bulk pass,
 * which both avoids re-introducing the race AND is far fewer round-trips.
 */
function applyPatchesInMemory(
  updates: Array<{ id: string; inn?: string; name: string; patch: Record<string, any> }>
): { ok: number; missing: number; statusChanges: string[] } {
  let db: any;
  try {
    db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  } catch {
    db = { residents: [] };
  }
  db.residents = db.residents || [];

  const byId = new Map<string, any>();
  for (const r of db.residents) byId.set(r.id, r);

  let ok = 0;
  let missing = 0;
  const statusChanges: string[] = [];

  for (const u of updates) {
    const existing = byId.get(u.id);
    if (!existing) {
      missing++;
      continue;
    }
    Object.assign(existing, u.patch);
    ok++;
    if (u.patch.status) {
      statusChanges.push(`${u.name}: status -> ${u.patch.status}`);
    }
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

  return { ok, missing, statusChanges };
}

/**
 * One-time startup correction: backfills real district / industry /
 * activityType / phone (and a handful of stale statuses) onto existing
 * resident records - sourced from the official IT Park register Excel
 * (matched by INN) plus legalAddress-derived districts for residents
 * outside that register.
 *
 * Runs automatically on server boot, right here, so nothing needs to be run
 * manually in a separate terminal: restart `npm run dev` once and this
 * applies itself directly to db_store.json (see applyPatchesInMemory()
 * above for why it no longer goes through ResidentRepository.updateResident
 * per item), then marks itself done in server/.migrations_applied.json so
 * it never re-runs on later restarts. Postgres receives the correction via
 * server.ts's subsequent full-state sync, not from this function directly.
 * To force a re-run (e.g. after refreshing residents_updates.json with a
 * newer correction set), delete that marker file or the
 * "residentsCorrectionV1" key inside it.
 */
export async function applyPendingResidentCorrections(): Promise<void> {
  const markers = readMarkers();
  if (markers[MIGRATION_KEY]) {
    return; // already applied on a previous startup
  }

  if (!fs.existsSync(UPDATES_PATH)) {
    return; // nothing to apply
  }

  let updates: Array<{ id: string; inn?: string; name: string; patch: Record<string, any> }>;
  try {
    updates = JSON.parse(fs.readFileSync(UPDATES_PATH, "utf-8"));
  } catch (err) {
    console.warn("⚠️ Could not read residents_updates.json:", err);
    return;
  }

  console.log(`⚡ Applying ${updates.length} pending resident data corrections (district/industry/activityType/phone/status)...`);

  const { ok, missing, statusChanges } = applyPatchesInMemory(updates);

  console.log(`✅ Resident data correction complete: ${ok} updated, ${missing} not found.`);
  if (statusChanges.length) {
    console.log("   Status corrections applied:");
    for (const line of statusChanges) console.log("     - " + line);
  }

  const freshMarkers = readMarkers();
  freshMarkers[MIGRATION_KEY] = true;
  writeMarkers(freshMarkers);
}


/**
 * Second-round startup correction - see MIGRATION_KEY_V2 comment above for
 * why this exists as a separate pass from applyPendingResidentCorrections().
 * Runs automatically on server boot, same self-marking behavior: applies
 * once, then never again unless residentsCorrectionV2 is removed from
 * server/.migrations_applied.json.
 */
export async function applyPendingResidentCorrectionsV2(): Promise<void> {
  const markers = readMarkers();
  if (markers[MIGRATION_KEY_V2]) {
    return; // already applied on a previous startup
  }

  if (!fs.existsSync(UPDATES_PATH_V2)) {
    return; // nothing to apply
  }

  let updates: Array<{ id: string; inn?: string; name: string; patch: Record<string, any> }>;
  try {
    updates = JSON.parse(fs.readFileSync(UPDATES_PATH_V2, "utf-8"));
  } catch (err) {
    console.warn("⚠️ Could not read residents_updates_v2.json:", err);
    return;
  }

  console.log(`⚡ Applying ${updates.length} pending resident data corrections V2 (district/industry/activityType/phone from the 77-company active register)...`);

  const { ok, missing } = applyPatchesInMemory(updates);

  console.log(`✅ Resident data correction V2 complete: ${ok} updated, ${missing} not found.`);

  const freshMarkers = readMarkers();
  freshMarkers[MIGRATION_KEY_V2] = true;
  writeMarkers(freshMarkers);
}

/**
 * One-time cleanup: removes the leftover "TEST" resident (INN 123123123)
 * created while probing the original Add-Resident bug. Uses
 * ResidentRepository.deleteResident() directly (a single item, not a loop),
 * so it deletes from both db_store.json and Postgres in one normal write -
 * none of the batch-correction race conditions above apply to a single
 * delete.
 */
export async function cleanupLeftoverTestResident(): Promise<void> {
  const markers = readMarkers();
  if (markers[MIGRATION_KEY_CLEANUP_TEST]) {
    return; // already applied on a previous startup
  }

  try {
    let db: any;
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch {
      db = { residents: [] };
    }
    const residents = db.residents || [];
    const testRecord = residents.find(
      (r: any) => r.registrationNumber === "123123123" || (r.companyName || "").trim().toUpperCase() === "TEST"
    );

    if (testRecord) {
      const deleted = await ResidentRepository.deleteResident(testRecord.id);
      console.log(
        deleted
          ? `🧹 Removed leftover TEST resident (${testRecord.id}, INN ${testRecord.registrationNumber}).`
          : `⚠️ Found TEST resident ${testRecord.id} but delete reported not-found - leaving it in place.`
      );
    } else {
      console.log("🧹 No leftover TEST resident found - nothing to clean up.");
    }
  } catch (err) {
    console.warn("⚠️ TEST resident cleanup error:", err);
  }

  const freshMarkers = readMarkers();
  freshMarkers[MIGRATION_KEY_CLEANUP_TEST] = true;
  writeMarkers(freshMarkers);
}
