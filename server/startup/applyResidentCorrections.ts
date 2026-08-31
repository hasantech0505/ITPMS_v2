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
 * One-time startup correction: backfills real district / industry /
 * activityType / phone (and a handful of stale statuses) onto existing
 * resident records - sourced from the official IT Park register Excel
 * (matched by INN) plus legalAddress-derived districts for residents
 * outside that register.
 *
 * Runs automatically on server boot, right here, so nothing needs to be
 * run manually in a separate terminal: restart `npm run dev` once and this
 * applies itself through ResidentRepository.updateResident (which writes
 * to Postgres and the db_store.json fallback exactly like every other
 * write in the app), then marks itself done in
 * server/.migrations_applied.json so it never re-runs on later restarts.
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

  let ok = 0;
  let missing = 0;
  const statusChanges: string[] = [];

  for (const u of updates) {
    try {
      const result = await ResidentRepository.updateResident(u.id, u.patch);
      if (result) {
        ok++;
        if (u.patch.status) {
          statusChanges.push(`${u.name}: status -> ${u.patch.status}`);
        }
      } else {
        missing++;
      }
    } catch (err) {
      console.warn(`  ! Failed to correct resident ${u.id} (${u.name}):`, err);
    }
  }

  console.log(`✅ Resident data correction complete: ${ok} updated, ${missing} not found.`);
  if (statusChanges.length) {
    console.log("   Status corrections applied:");
    for (const line of statusChanges) console.log("     - " + line);
  }

  markers[MIGRATION_KEY] = true;
  writeMarkers(markers);
}
