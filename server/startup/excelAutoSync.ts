/**
 * Website -> Excel auto-sync.
 *
 * Watches server/db_store.json. A few seconds after the website saves something, rows that exist in
 * the website but not yet in the Excel workbooks (Residents, Startups, Events, Talent Pool) are
 * appended to the ORIGINAL workbooks in EXCEL_SOURCE_DIR. Nothing in Excel is changed or deleted,
 * and each workbook is backed up to server/backups/excel first. If a workbook is open in Excel the
 * sync waits and tries again. The logic lives in scripts/export-excel.mjs (also usable by hand).
 *
 * Turn off with EXCEL_AUTO_SYNC=false in .env.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const DB_PATH = path.join(process.cwd(), "server", "db_store.json");
const SETTLE_MS = 8_000; // wait for the burst of saves to finish
const RETRY_MS = 120_000; // workbook open in Excel / temporary error

export function startExcelAutoSync(): void {
  const dir = process.env.EXCEL_SOURCE_DIR;
  if (!dir || process.env.EXCEL_AUTO_SYNC === "false") {
    console.log("ℹ️ Excel auto-sync is off (set EXCEL_SOURCE_DIR in .env to turn it on).");
    return;
  }
  let timer: NodeJS.Timeout | null = null;
  let running = false;
  let again = false;

  const run = async () => {
    if (running) { again = true; return; }
    running = true;
    try {
      const mod = await import(/* @vite-ignore */ pathToFileURL(path.join(process.cwd(), "scripts", "export-excel.mjs")).href);
      const r = await mod.syncToExcel({ dir, dbPath: DB_PATH, apply: true, log: () => {} });
      if (r.added) console.log(`📗 Excel auto-sync: added ${r.added} new row(s) from the website.`);
      if (r.skippedLocked.length || r.errors.length) {
        if (r.errors.length) console.warn("⚠️ Excel auto-sync:", r.errors.join("; "));
        schedule(RETRY_MS);
      }
    } catch (e: any) {
      console.warn("⚠️ Excel auto-sync failed:", e?.message || e);
      schedule(RETRY_MS);
    } finally {
      running = false;
      if (again) { again = false; schedule(SETTLE_MS); }
    }
  };
  const schedule = (ms: number) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, ms);
  };

  // watchFile polls, which is more reliable than fs.watch on Windows and network drives.
  fs.watchFile(DB_PATH, { interval: 3_000 }, (cur, prev) => {
    if (cur.mtimeMs !== prev.mtimeMs) schedule(SETTLE_MS);
  });
  schedule(20_000); // also catch up shortly after the server starts
  console.log(`📗 Excel auto-sync is on (folder: ${dir}).`);
}
