/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// One-time import (2026-09-03): 26 new vacant-space/rental listings from the
// second Qashqadaryo viloyati "bo'sh joylar" slide deck the user uploaded
// (Qashqadaryo_viloyati_bosh_joylar_2.pptx - a follow-up/expanded version of
// the deck already imported earlier as prop-qshq-1..11). The deck listed 28
// properties; 2 of them (Nasaf ko'chasi 279-uy and Geologlar ko'chasi 22/2
// "Jurnalistlar uyi") were already present as prop-qshq-6 and prop-qshq-10
// respectively (matched by address + area + phone number) and were skipped
// to avoid duplicate listings. The remaining 26 are new and continue the
// existing id sequence as prop-qshq-12..prop-qshq-37.
//
// Each property's photos were extracted directly from the pptx (matched to
// the correct slide via each slide's own relationship file, not by
// filename) and placed under public/property-photos/<id>/photo-N.<ext> -
// the same convention the app's own PhotoUploader/upload route uses - before
// this migration ever runs, so the image URLs below resolve immediately.
//
// Fields the source listing didn't provide (rooms, parking, AC, meeting
// rooms, internet speed, cadastre number, verification) are left at
// honest "not yet known" defaults (0 / false / "" / PENDING), matching the
// convention already established by the first Qashqadaryo import rather
// than inventing plausible-looking numbers.
//
// FIX (2026-09-03, later same day): the first run of this migration set its
// own "done" marker but never actually reached Postgres. It only wrote the
// new rows into server/db_store.json directly via fs.writeFileSync -- but
// db_store.json is just a local cache (see server/repositories/
// entity.repository.ts). The very next line in server.ts's boot sequence
// calls `EntityService.getFullState()` again to build the payload for the
// closing `syncDataToPostgres()` push, and that call *also* prefers
// Postgres over the local file whenever the pool is up, so it immediately
// overwrote db_store.json's freshly-added 26 rows with the still-old
// 11-property Postgres baseline before the sync push ever ran -- a
// no-op for Postgres, even though the migration marker recorded success.
// Same failure mode already documented for the resident corrections
// (server/startup/applyResidentCorrections.ts), just not yet hit here.
// Fixed by pushing each new property straight to Postgres via
// saveDocToPostgres() *during this migration*, the same way an ordinary
// user-driven edit already does for one record -- so by the time the later
// getFullState()/syncDataToPostgres() pass re-reads Postgres, these rows
// are already there and that pass reaffirms them instead of erasing them.
import fs from "fs";
import path from "path";
import { saveDocToPostgres } from "../postgres";

const MARKER_PATH = path.join(process.cwd(), "server", ".migrations_applied.json");
const MIGRATION_KEY = "qashqadaryoPropertiesImportV2";
const DATA_PATH = path.join(process.cwd(), "server", "startup", "qashqadaryoProperties.data.json");
const DB_PATH = path.join(process.cwd(), "server", "db_store.json");

function readMarkers(): Record<string, boolean> {
  try {
    return JSON.parse(fs.readFileSync(MARKER_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeMarkers(markers: Record<string, boolean>): void {
  try {
    fs.writeFileSync(MARKER_PATH, JSON.stringify(markers, null, 2), "utf-8");
  } catch (err) {
    console.warn("⚠️ Could not write migration marker file:", err);
  }
}

export async function importQashqadaryoPropertiesV2(): Promise<void> {
  const markers = readMarkers();
  if (markers[MIGRATION_KEY]) return;

  let succeeded = false;
  try {
    const newProperties: any[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

    let db: any;
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch {
      db = {};
    }
    db.properties = db.properties || [];

    const existingIds = new Set(db.properties.map((p: any) => p.id));
    const toAdd = newProperties.filter((p) => !existingIds.has(p.id));

    for (const prop of toAdd) {
      db.properties.push(prop);
    }

    // Single synchronous write - no `await` between the read above and this
    // write, so nothing else in the process (e.g. an ordinary frontend /api/db
    // request re-warming the cache mid-import) can interleave and clobber it.
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Push each new row straight to Postgres too (entity_store, generic
    // "properties" collection) -- see the FIX note above for why this can't
    // be left to the later bulk getFullState()/syncDataToPostgres() pass
    // alone. Sequential, not Promise.all: this runs once at boot for 26
    // rows, no need to burst the pool.
    let pushedToPg = 0;
    for (const prop of toAdd) {
      try {
        await saveDocToPostgres("properties", prop.id, prop);
        pushedToPg++;
      } catch (err) {
        console.warn(`⚠️ Qashqadaryo property import (V2): failed to push ${prop.id} to Postgres:`, err);
      }
    }

    console.log(`🏢 Qashqadaryo property import (2-nusxa): added ${toAdd.length} new vacant-space listings (${newProperties.length - toAdd.length} already present, skipped); ${pushedToPg}/${toAdd.length} pushed to Postgres.`);
    succeeded = true;
  } catch (err) {
    console.warn("⚠️ Qashqadaryo property import (V2) error:", err);
  }

  // Only mark this done once it actually ran to completion -- if reading the
  // data file or db_store.json itself failed, leave the marker unset so the
  // next boot retries instead of silently pretending this happened.
  if (succeeded) {
    const freshMarkers = readMarkers();
    freshMarkers[MIGRATION_KEY] = true;
    writeMarkers(freshMarkers);
  }
}
