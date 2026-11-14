#!/usr/bin/env node
/**
 * ITPMS database -> Excel exporter (residents, startups, events, talents).
 *
 *   node scripts/export-excel.mjs            dry-run: shows which rows WOULD be added to Excel
 *   node scripts/export-excel.mjs --apply    backs up each workbook, then appends the rows
 *
 * Options:  --dir <folder>   the "Metadata_" folder (default: EXCEL_SOURCE_DIR from .env)
 *           --db  <file>     database file (default: server/db_store.json)
 *
 * Rules (the website feeds Excel - the mirror image of import-excel.mjs):
 *   - Only records that are in the website but NOT yet in Excel are appended as new rows.
 *   - Rows are matched exactly like the importer does (STIR / name / title+date), so the two
 *     scripts never create duplicates of each other.
 *   - Existing Excel rows and cells are never changed or deleted.
 *   - Each workbook is copied to server/backups/excel before it is written. If the workbook is
 *     open in Excel (a "~$" lock file exists) it is skipped and tried again later.
 *
 * Also used by the server: import { syncToExcel } from "scripts/export-excel.mjs".
 */
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import ExcelJS from "exceljs";

// ---------- helpers ----------
function cellValue(c) {
  let v = c?.value ?? null;
  if (v && typeof v === "object" && !(v instanceof Date)) {
    if ("result" in v) v = v.result;
    else if ("richText" in v) v = v.richText.map((t) => t.text).join("");
    else if ("text" in v) v = v.text;
    else v = null;
  }
  return v;
}
const text = (v) => {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).replace(/ /g, " ").replace(/\s+/g, " ").trim();
};
const norm = (s) => text(s).toLowerCase().replace(/[ʻʼ’‘`']/g, "'");
const nameKey = (s) => norm(s).replace(/["«»]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const tokenKey = (s) => nameKey(s).split(" ").filter(Boolean).sort().join(" ");
const dmy = (iso) => { const m = text(iso).match(/(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}.${m[2]}.${m[1]}` : ""; };
const isoOf = (v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = text(v);
  let m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : "";
};

/** Same person if the token sets are equal, or one name (2+ words) is contained in the other. */
const sameTokens = (a, b) => {
  const [small, big] = a.length <= b.length ? [a, b] : [b, a];
  return small.length >= 2 && small.every((t) => big.includes(t));
};

/** Row index + {header-prefix -> column} of the header row (found by a required header). */
function findHeader(ws, mustHave) {
  for (let r = 1; r <= Math.min(ws.rowCount, 15); r++) {
    const vals = ws.getRow(r).values;
    if (vals.some((c) => text(cellValue({ value: c })).toLowerCase().startsWith(mustHave.toLowerCase()))) {
      const cols = {};
      vals.forEach((c, i) => { const t = text(cellValue({ value: c })); if (t && i > 0) cols[t] = i; });
      return { row: r, cols };
    }
  }
  return null;
}
const colOf = (hdr, ...prefixes) => {
  for (const p of prefixes) {
    const k = Object.keys(hdr.cols).find((x) => x.toLowerCase().startsWith(p.toLowerCase()));
    if (k) return hdr.cols[k];
  }
  return null;
};

/** Appends one row after the last data row, copying styles and calculated formulas from the row above. */
function appendRow(ws, hdr, valuesByPrefix) {
  // Last data row = last row (below the header) that has any value in the first 4 columns.
  let last = hdr.row;
  for (let r = ws.rowCount; r > hdr.row; r--) {
    const row = ws.getRow(r);
    if ([1, 2, 3, 4].some((c) => text(cellValue(row.getCell(c))) !== "")) { last = r; break; }
  }
  const n = last + 1;
  const prev = ws.getRow(last);
  const row = ws.getRow(n);
  const width = Math.max(...Object.values(hdr.cols));
  const filled = new Set();
  for (const [prefixes, value] of valuesByPrefix) {
    const c = colOf(hdr, ...[].concat(prefixes));
    if (c && value !== null && value !== undefined && value !== "") { row.getCell(c).value = value; filled.add(c); }
  }
  for (let c = 1; c <= width; c++) {
    const src = prev.getCell(c);
    const dst = row.getCell(c);
    if (last > hdr.row && src.style) dst.style = JSON.parse(JSON.stringify(src.style));
    // Calculated columns (numbering, year/month/quarter ...): copy the formula, shifted to the new row.
    if (!filled.has(c) && src.value && typeof src.value === "object" && src.value.formula) {
      const f = src.value.formula.replace(new RegExp(`([A-Z]{1,2})${last}(?!\\d)`, "g"), `$1${n}`);
      dst.value = { formula: f };
    }
  }
  // Plain numbering column ("№", "Talent №", "N") without a formula: continue the sequence.
  for (const h of Object.keys(hdr.cols)) {
    const c = hdr.cols[h];
    if (/^(№|n|talent №)$/i.test(h) && !filled.has(c) && !(row.getCell(c).value && row.getCell(c).value.formula)) {
      const pv = cellValue(prev.getCell(c));
      if (typeof pv === "number") row.getCell(c).value = pv + 1;
    }
  }
  row.commit?.();
  // Grow the Excel table (if the sheet has one) so the new row is part of it.
  for (const t of ws.getTables?.() || []) {
    const ref = t.table?.tableRef;
    const m = ref && ref.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
    if (m && Number(m[2]) <= hdr.row && Number(m[4]) === last) {
      t.table.tableRef = `${m[1]}${m[2]}:${m[3]}${n}`;
      if (t.table.autoFilterRef) t.table.autoFilterRef = t.table.tableRef;
    }
  }
  return n;
}

// ---------- per-entity: what is missing in Excel, and how a row looks ----------
const DISTRICT_TEXT = (d) => {
  if (!d) return "";
  if (d === "Qarshi District") return "Qarshi tumani";
  if (d === "Qarshi") return "Qarshi shahri";
  if (/^(Shahrisabz)$/.test(d)) return "Shahrisabz shahri";
  return `${d} tumani`;
};
const EVENT_TYPE_TEXT = { WORKSHOP: "Воркшоп, семинар, тренинг", ACCELERATION_DEMO: "Pitch Day", HACKATHON: "Hakaton", CONFERENCE: "Konferensiya", MEETUP: "Uchrashuv" };
const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];

function exportResidents(db, wb, plan) {
  const known = new Set();
  wb.eachSheet((ws) => ws.eachRow((row) => {
    for (const c of [1, 2, 3]) { const m = text(cellValue(row.getCell(c))).match(/^\d{9}$/); if (m) known.add(m[0]); }
  }));
  const jami = wb.getWorksheet("Jami-Residentlar");
  const upcoming = wb.getWorksheet("Upcoming-Residents");
  const potential = wb.getWorksheet("Potential-Residents");
  const missing = db.residents.filter((r) => /^\d{9}$/.test(text(r.registrationNumber)) && !known.has(text(r.registrationNumber)) && r.status !== "REMOVED");
  for (const r of missing) {
    const stir = Number(text(r.registrationNumber));
    const common = [
      ["STIR", stir], ["Korxona nomi", r.companyName], ["Hudud", "Qashqadaryo viloyati"], ["Viloyat", "Qashqadaryo viloyati"],
      ["Shahar/tuman", DISTRICT_TEXT(r.district)], ["Tuman/Shahar", DISTRICT_TEXT(r.district)],
      ["Faoliyat turi", r.industry], ["Pochta manzili", r.legalAddress], ["Yuridik manzil", r.legalAddress],
      ["IFUT", r.activityType],
    ];
    if (r.status === "ACTIVE") {
      if (!jami) continue;
      plan.push({ sheet: jami, hdr: findHeader(jami, "STIR"), label: `resident ${stir} ${r.companyName} -> Jami-Residentlar`, values: [
        ...common, ["Ro‘yatdan o‘tgan", dmy(r.appliedAt)], ["Xodimlar soni", r.employeesCount || null], ["Rahbari", r.director],
        ["Telefon", r.phone], ["Status", "Rezident"], ["Rezident sifatida", dmy(r.approvedAt)],
      ] });
    } else if (r.potentialStage === "Application Submitted") {
      if (!upcoming) continue;
      plan.push({ sheet: upcoming, hdr: findHeader(upcoming, "STIR"), label: `resident ${stir} ${r.companyName} -> Upcoming-Residents`, values: [
        ...common, ["Ro‘yatdan o‘tgan", dmy(r.appliedAt)], ["Rahbari", r.director], ["Telefon", r.phone], ["Statusi", r.potentialNotes || "Ariza yuborilmoqda"],
      ] });
    } else {
      if (!potential) continue;
      plan.push({ sheet: potential, hdr: findHeader(potential, "STIR"), label: `resident ${stir} ${r.companyName} -> Potential-Residents`, values: [
        ...common, ["Telefon", r.phone], ["Qo‘ng‘iroq", r.potentialStage === "Contacted" ? "Gaplashildi" : ""], ["Izoh", r.potentialNotes],
      ] });
    }
  }
}

function exportStartups(db, wb, plan) {
  const ws = wb.worksheets[0];
  const hdr = ws && findHeader(ws, "Nomi");
  if (!hdr) return;
  const nameCol = colOf(hdr, "Nomi");
  const have = new Set();
  for (let r = hdr.row + 1; r <= ws.rowCount; r++) { const k = nameKey(cellValue(ws.getRow(r).getCell(nameCol))); if (k) have.add(k); }
  const stageText = { IDEA: "Idea", PRE_MVP: "Pre Seed", MVP: "MVP", EARLY_REVENUE: "Seed", GROWTH: "Sotuv" };
  for (const s of db.startups) {
    if (!s.name || have.has(nameKey(s.name))) continue;
    const parts = text(s.founder).split(" ");
    plan.push({ sheet: ws, hdr, label: `startup ${s.name}`, values: [
      ["Nomi", s.name], ["Tavsifi", s.description], ["Asoschi", parts[0] || ""], ["Telefon", s.phone], ["Yo'nalishi", s.industry],
      ["Holati", stageText[s.stage] || ""], ["Yil", (text(s.joinedAt).match(/\d{4}/) || [null])[0] && Number(text(s.joinedAt).slice(0, 4))],
      ["Investitsiya", s.fundingRaised || null], ["Ro'yxatga olingan", s.joinedAt ? new Date(`${s.joinedAt}T00:00:00Z`) : null],
    ] });
  }
}

function exportEvents(db, wb, plan) {
  const ws = wb.worksheets[0];
  const hdr = ws && findHeader(ws, "Tadbir nomi");
  if (!hdr) return;
  const tCol = colOf(hdr, "Tadbir nomi"), dCol = colOf(hdr, "O'tkazilgan sanasi", "O‘tkazilgan sanasi");
  const have = new Set(), haveTitle = new Set();
  for (let r = hdr.row + 1; r <= ws.rowCount; r++) {
    const t = cellValue(ws.getRow(r).getCell(tCol));
    if (!text(t)) continue;
    haveTitle.add(nameKey(t));
    have.add(`${nameKey(t)}|${isoOf(cellValue(ws.getRow(r).getCell(dCol)))}`);
  }
  for (const e of db.events) {
    if (!e.title || haveTitle.has(nameKey(e.title)) || have.has(`${nameKey(e.title)}|${e.eventDate || ""}`)) continue;
    plan.push({ sheet: ws, hdr, label: `event ${e.eventDate || "no date"} ${e.title.slice(0, 70)}`, values: [
      ["Tadbir nomi", e.title], ["Tadbir turi", EVENT_TYPE_TEXT[e.eventType] || "Воркшоп, семинар, тренинг"],
      ["O'tkazilgan sanasi", e.eventDate ? new Date(`${e.eventDate}T00:00:00Z`) : null],
      ["Viloyat", e.region], ["Tuman/Shahar", e.district], ["O'tlazilgan joy", e.venue], ["Tashkilotchi", e.organizer],
      ["Hamkorlar", e.partners], ["Ishtirokchilar", e.participantCount || null], ["Startuplar", e.startupCount || null],
      ["Hisobot", e.reportUrl], ["Izoh", e.notes],
    ] });
  }
}

function exportTalent(db, wb, plan) {
  const ws = wb.getWorksheet("Talent Tracking");
  const hdr = ws && findHeader(ws, "Talent");
  if (!hdr) return;
  const nCol = colOf(hdr, "F.I.O");
  const haveToks = [];
  for (let r = hdr.row + 1; r <= ws.rowCount; r++) { const k = tokenKey(cellValue(ws.getRow(r).getCell(nCol))); if (k) haveToks.push(k.split(" ")); }
  for (const t of db.talent) {
    if (!t.fullName || haveToks.some((x) => sameTokens(x, tokenKey(t.fullName).split(" ")))) continue;
    plan.push({ sheet: ws, hdr, label: `talent ${t.fullName}`, values: [
      ["F.I.O", t.fullName], ["Muassasa", t.university], ["Yo‘nalish", t.major], ["Telefon", t.phone], ["Email", t.email],
      ["Bosqich", "Bazaga kiritildi"], ["Qo‘shilgan", t.createdAt ? new Date(text(t.createdAt).slice(0, 10) + "T00:00:00Z") : null],
      ["Izoh", t.englishLevel ? `Til: Ingliz tili - ${t.englishLevel}` : ""],
    ] });
  }
}

// ---------- main entry ----------
const JOBS = [
  { name: "Residents", file: [["Residents.xlsx"]], run: exportResidents },
  { name: "Startups", file: [["Startups.xlsx"], ["Startups", "Startups.xlsx"]], run: exportStartups },
  { name: "Events", file: [["Events.xlsx"]], run: exportEvents },
  { name: "Talent Pool", file: [["Talent Pool.xlsx"], ["TalentPool", "Talent Pool.xlsx"]], run: exportTalent },
];

/**
 * @param {{dir:string, dbPath:string, apply?:boolean, log?:(s:string)=>void}} o
 * @returns {Promise<{added:number, skippedLocked:string[], errors:string[]}>}
 */
export async function syncToExcel({ dir, dbPath, apply = false, log = () => {} }) {
  const out = { added: 0, skippedLocked: [], errors: [] };
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  for (const job of JOBS) {
    const candidates = job.file.map((p) => path.join(dir, ...p));
    const file = candidates.find((f) => fs.existsSync(f));
    if (!file) { log(`!! ${job.name}: workbook not found (${candidates[0]})`); continue; }
    try {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(file);
      const plan = [];
      job.run(db, wb, plan);
      log(`\n=== ${job.name} (${path.basename(file)}): ${plan.length} new row(s) to add ===`);
      for (const p of plan) log(`  + ${p.label}`);
      if (!plan.length || !apply) continue;
      const lock = path.join(path.dirname(file), `~$${path.basename(file)}`);
      if (fs.existsSync(lock)) { out.skippedLocked.push(file); log(`  ! ${path.basename(file)} is open in Excel - skipped, will retry`); continue; }
      for (const p of plan) { if (p.hdr) appendRow(p.sheet, p.hdr, p.values.map(([k, v]) => [k, v])); }
      wb.calcProperties = { ...(wb.calcProperties || {}), fullCalcOnLoad: true };
      const bdir = path.join(path.dirname(dbPath), "backups", "excel");
      fs.mkdirSync(bdir, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      fs.copyFileSync(file, path.join(bdir, `${path.basename(file, ".xlsx")}.${stamp}.xlsx`));
      const tmp = path.join(os.tmpdir(), `itpms-${Date.now()}-${path.basename(file)}`);
      await wb.xlsx.writeFile(tmp);
      fs.copyFileSync(tmp, file);
      fs.unlinkSync(tmp);
      out.added += plan.length;
      log(`  ✓ ${path.basename(file)} updated (backup in server/backups/excel)`);
      // keep only the 30 newest backups per workbook
      const mine = fs.readdirSync(bdir).filter((f) => f.startsWith(path.basename(file, ".xlsx") + ".")).sort();
      for (const old of mine.slice(0, Math.max(0, mine.length - 30))) fs.unlinkSync(path.join(bdir, old));
    } catch (e) {
      out.errors.push(`${job.name}: ${e.message}`);
      log(`!! ${job.name}: ${e.message}`);
    }
  }
  return out;
}

// ---------- command line ----------
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) (async () => {
  const args = process.argv.slice(2);
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const env = { ...process.env };
  try {
    for (const line of fs.readFileSync(path.join(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#") && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no .env */ }
  const dir = opt("--dir") || env.EXCEL_SOURCE_DIR;
  if (!dir) { console.error("Set EXCEL_SOURCE_DIR in .env or pass --dir."); process.exit(1); }
  const apply = args.includes("--apply");
  console.log(`ITPMS database -> Excel  -  ${apply ? "APPLY" : "DRY-RUN (nothing will be written)"}`);
  const r = await syncToExcel({ dir, dbPath: opt("--db") || path.join(process.cwd(), "server", "db_store.json"), apply, log: console.log });
  console.log(`\nDone. Rows added: ${r.added}${r.skippedLocked.length ? `; skipped (open in Excel): ${r.skippedLocked.length}` : ""}${r.errors.length ? `; errors: ${r.errors.length}` : ""}`);
  if (!apply) console.log("Dry-run only. To apply:  npm run export:excel:apply");
})();
