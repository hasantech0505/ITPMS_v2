#!/usr/bin/env node
/**
 * Excel -> ITPMS database importer (residents, startups, events, talents).
 *
 *   node scripts/import-excel.mjs                 dry-run: shows what WOULD change, writes nothing
 *   node scripts/import-excel.mjs --apply         backs up the database, then applies the changes
 *   node scripts/import-excel.mjs --apply --allow-status-changes
 *                                                 also lets Excel change a resident's status
 *
 * Options:  --dir <folder>   the "Metadata_" folder (default: EXCEL_SOURCE_DIR from .env)
 *           --db  <file>     database file (default: server/db_store.json)
 *
 * Rules (Excel feeds the database):
 *   - Rows are matched by STIR (residents) or by name (startups, events, talents).
 *   - New rows are added.  Existing rows only get the fields Excel owns, and only
 *     when Excel has a non-empty value.
 *   - Notes, meetings, quarterly reports, photos, tasks etc. added in the website
 *     are NEVER touched or deleted.
 *   - Nothing is ever removed because it is missing from Excel.
 */
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

// ---------- arguments / config ----------
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const APPLY = flag("--apply");
const ALLOW_STATUS = flag("--allow-status-changes");

function readEnvFile() {
  try {
    const out = {};
    for (const line of fs.readFileSync(path.join(process.cwd(), ".env"), "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch { return {}; }
}
const env = { ...readEnvFile(), ...process.env };
const SOURCE_DIR = opt("--dir") || env.EXCEL_SOURCE_DIR;
const DB_PATH = opt("--db") || path.join(process.cwd(), "server", "db_store.json");
if (!SOURCE_DIR) {
  console.error('Missing the Excel folder. Put EXCEL_SOURCE_DIR=<path to the "Metadata_" folder> in .env, or pass --dir "<path>".');
  process.exit(1);
}
const FILES = {
  residents: path.join(SOURCE_DIR, "Residents.xlsx"),
  startups: path.join(SOURCE_DIR, "Startups", "Startups.xlsx"),
  events: path.join(SOURCE_DIR, "Events.xlsx"),
  talent: path.join(SOURCE_DIR, "TalentPool", "Talent Pool.xlsx"),
};

// ---------- cell helpers ----------
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
  return String(v).replace(/ /g, " ").replace(/\s+/g, " ").trim();
};
const isBlank = (v) => text(v) === "" || text(v) === "-" || text(v).toLowerCase() === "none";
const num = (v) => {
  const n = Number(text(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
function isoDate(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = text(v);
  let m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return null;
}
// style "spaced" = "+998 94 242-71-11" (residents, talents), "compact" = "+998942427111" (startups)
function phone(v, style = "spaced") {
  const raw = text(v);
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("998")) d = d.slice(3);
  if (d.length === 9) return style === "compact" ? `+998${d}` : `+998 ${d.slice(0, 2)} ${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7)}`;
  return raw;
}
const digits = (v) => text(v).replace(/\D/g, "").replace(/^998(?=\d{9}$)/, "");
const norm = (s) => text(s).toLowerCase().replace(/[ʻʼ’‘`']/g, "'");
const nameKey = (s) => norm(s).replace(/["«»]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const tokenKey = (s) => nameKey(s).split(" ").filter(Boolean).sort().join(" ");

// Same rules as normalizeDistrict() in src/features/dashboard/utils/liveDashboardData.ts
function normalizeDistrict(raw) {
  const cleaned = norm(raw);
  if (!cleaned || cleaned === "-") return null;
  const isCityForm = /shahar|shahr|sh\.$|sh$/.test(cleaned);
  const base = cleaned.replace(/\btumani\b|\btuman\b|\bt\.$|\bshahri\b|\bshahar\b|\bsh\.$/g, "").trim();
  const table = {
    qarshi: isCityForm ? "Qarshi" : "Qarshi District", shahrisabz: "Shahrisabz", chiroqchi: "Chiroqchi",
    dehqonobod: "Dehqonobod", "g'uzor": "Gʻuzor", guzor: "Gʻuzor", kasbi: "Kasbi", kitob: "Kitob", koson: "Koson",
    kukdala: "Koʻkdala", "ko'kdala": "Koʻkdala", mirishkor: "Mirishkor", muborak: "Muborak", nishon: "Nishon",
    qamashi: "Qamashi", "yakkabog'": "Yakkabogʻ", yakkabog: "Yakkabogʻ",
  };
  return table[base] || null;
}

/** Reads a sheet into row objects, finding the header row by a required header name. */
function readTable(ws, mustHave) {
  if (!ws) return [];
  const rows = [];
  ws.eachRow({ includeEmpty: false }, (row, n) => rows.push({ n, cells: row.values.slice(1).map((c) => cellValue({ value: c })) }));
  const hi = rows.findIndex((r) => r.cells.some((c) => text(c).toLowerCase().startsWith(mustHave.toLowerCase())));
  if (hi < 0) return [];
  const headers = rows[hi].cells.map((c) => text(c));
  return rows.slice(hi + 1).map((r) => {
    const o = { _row: r.n };
    headers.forEach((h, i) => { if (h) o[h] = r.cells[i]; });
    return o;
  });
}
const pick = (o, ...prefixes) => {
  for (const p of prefixes) {
    const k = Object.keys(o).find((x) => x.toLowerCase().startsWith(p.toLowerCase()));
    if (k && !isBlank(o[k])) return o[k];
  }
  return null;
};

// ---------- report ----------
const report = [];
const log = (s = "") => { report.push(s); console.log(s); };
const stats = {};
const bump = (e, k, n = 1) => { (stats[e] ||= {})[k] = (stats[e][k] || 0) + n; };

function setField(entity, rec, field, value, changes) {
  if (value === null || value === undefined || value === "") return;
  const same = field === "phone" ? digits(rec[field]) === digits(value)
    : typeof value === "string" ? norm(rec[field]) === norm(value) : rec[field] === value;
  if (same) return;
  changes.push(`${field}: ${JSON.stringify(rec[field] ?? null)} -> ${JSON.stringify(value)}`);
  rec[field] = value;
}

// ---------- entities ----------
const now = new Date().toISOString();
let uid = Date.now();
const nextId = (p) => `${p}-${uid++}`;

function importResidents(db, wb) {
  const list = db.residents;
  const byStir = new Map(list.map((r) => [text(r.registrationNumber), r]));
  const seen = new Set();
  const stir = (o) => (text(pick(o, "STIR")).match(/\d{9}/) || [null])[0];

  const base = (o, status) => ({
    companyName: text(pick(o, "Korxona nomi")),
    director: text(pick(o, "Rahbar")),
    legalAddress: text(pick(o, "Pochta manzili", "Yuridik manzil")),
    employeesCount: num(pick(o, "Xodimlar soni")),
    phone: phone(pick(o, "Telefon")),
    district: normalizeDistrict(text(pick(o, "Shahar/tuman", "Shahar/Tuman", "Tuman/Shahar"))),
    industry: text(pick(o, "Faoliyat turi")),
    activityType: text(pick(o, "IFUT")),
    appliedAt: isoDate(pick(o, "Ro‘yatdan o‘tgan", "Ro‘yxatdan o‘tgan", "Ro'yatdan", "Ro'yxatdan")),
    status,
  });
  const blank = (b, extra = {}) => ({
    id: `res-${b.registrationNumber}`, companyName: "", director: "", registrationNumber: "", legalAddress: "",
    employeesCount: 0, exportVolume: 0, domesticVolume: 0, status: "POTENTIAL", appliedAt: now.slice(0, 10),
    benefitsApplied: [], notes: [], documents: [], email: null, phone: null, website: null, telegram: null, linkedin: null,
    district: null, industry: null, activityType: null, assignedManager: null, potentialStage: null, potentialFounder: null,
    potentialSource: null, potentialProbability: 0, potentialOwner: null, potentialNextFollowUp: null, potentialNotes: null,
    potentialTimeline: [], monitoringHistory: [], quarterlyReports: [], docFiles: [], meetings: [], tasks: [],
    historyLogs: [], photos: [], createdAt: now, updatedAt: now, ...b, ...extra,
  });

  const activeRows = [
    ...readTable(wb.getWorksheet("Jami-Residentlar"), "STIR"),
    ...readTable(wb.getWorksheet("Residentlar2026"), "STIR"),
  ];
  log(`\n=== RESIDENTS (Residents.xlsx) ===`);
  for (const o of activeRows) {
    const s = stir(o);
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const f = base(o, "ACTIVE");
    f.registrationNumber = s;
    f.approvedAt = isoDate(pick(o, "Rezident sifatida", "CleanDate"));
    const rec = byStir.get(s);
    if (!rec) {
      const created = blank(f, { status: "ACTIVE", approvedAt: f.approvedAt || f.appliedAt });
      for (const k of Object.keys(created)) if (created[k] === null && f[k] !== undefined && f[k] !== null) created[k] = f[k];
      if (created.employeesCount === null) created.employeesCount = 0;
      created.companyName ||= `STIR ${s}`;
      db.__add("residents", created);
      byStir.set(s, created);
      bump("residents", "added (active)");
      log(`  + ADD   ${s}  ${created.companyName}`);
      continue;
    }
    const changes = [];
    for (const k of ["companyName", "director", "legalAddress", "phone", "industry", "activityType", "appliedAt", "approvedAt"]) setField("residents", rec, k, f[k], changes);
    // District: only fill it when the database has none (existing values were curated by hand).
    if (isBlank(rec.district)) setField("residents", rec, "district", f.district, changes);
    if (f.employeesCount !== null) setField("residents", rec, "employeesCount", f.employeesCount, changes);
    if (rec.status !== "ACTIVE") {
      const msg = `status ${rec.status} -> ACTIVE (Excel lists it as "Rezident")`;
      if (ALLOW_STATUS) {
        rec.status = "ACTIVE";
        rec.historyLogs = [...(rec.historyLogs || []), { date: now, action: "Status set to ACTIVE by Excel import" }];
        changes.push(msg);
        bump("residents", "status changed");
      } else {
        log(`  ! STATUS ${s}  ${rec.companyName}: ${msg}  [skipped - rerun with --allow-status-changes]`);
        bump("residents", "status change proposed (not applied)");
      }
    }
    if (changes.length) {
      rec.updatedAt = now;
      bump("residents", "updated");
      for (const c of changes) bump("residents", `field: ${c.split(":")[0].split(" ")[0]}`);
      if ((stats.residents.updated || 0) <= 12) log(`  ~ UPDATE ${s}  ${rec.companyName}\n      ${changes.join("\n      ")}`);
    } else bump("residents", "unchanged");
  }

  // Applications in progress and potential residents: add only the ones missing.
  const addIfMissing = (rows, label, build) => {
    for (const o of rows) {
      const s = stir(o);
      if (!s || seen.has(s) || byStir.has(s)) continue;
      seen.add(s);
      const f = base(o, "POTENTIAL");
      f.registrationNumber = s;
      const created = blank(f, build(o));
      for (const k of Object.keys(created)) if (created[k] === null && f[k] !== undefined && f[k] !== null) created[k] = f[k];
      if (created.employeesCount === null) created.employeesCount = 0;
      created.companyName ||= `STIR ${s}`;
      db.__add("residents", created);
      byStir.set(s, created);
      bump("residents", `added (${label})`);
      log(`  + ADD   ${s}  ${created.companyName}  [${label}]`);
    }
  };
  addIfMissing(readTable(wb.getWorksheet("Upcoming-Residents"), "STIR"), "upcoming", (o) => ({
    potentialStage: "Application Submitted", potentialNotes: text(pick(o, "Statusi")) || null,
  }));
  addIfMissing(readTable(wb.getWorksheet("Potential-Residents"), "STIR"), "potential", (o) => ({
    potentialStage: /gaplash/i.test(text(pick(o, "Qo‘ng‘iroq", "Qo'ng'iroq"))) ? "Contacted" : "New Lead",
    potentialNotes: text(pick(o, "Izoh")) || null,
    potentialNextFollowUp: null,
  }));
  const removedSheets = wb.worksheets.filter((w) => /maqomidan/i.test(w.title)).map((w) => w.title);
  log(`  (not imported: ${removedSheets.length} "removed residency" sheets - removed residents are managed in the website)`);
}

function mapStage(h) {
  const s = norm(h);
  if (/idea/.test(s)) return "IDEA";
  if (/pre seed/.test(s)) return "PRE_MVP";
  if (/mvp/.test(s)) return "MVP";
  if (/sotuv/.test(s)) return "GROWTH";
  if (/seed/.test(s)) return "EARLY_REVENUE";
  return "IDEA";
}
function importStartups(db, wb) {
  log(`\n=== STARTUPS (Startups.xlsx) ===`);
  const byName = new Map(db.startups.map((s) => [nameKey(s.name), s]));
  for (const o of readTable(wb.worksheets[0], "Nomi")) {
    const name = text(pick(o, "Nomi"));
    if (!name || nameKey(name) === "") continue;
    const founder = [text(o["Nomi2"]), text(o["Asoschi"])].filter((x) => x && x !== "-").join(" ");
    const f = {
      description: text(pick(o, "Tavsifi")) || null,
      phone: phone(pick(o, "Telefon"), "compact"),
      industry: text(pick(o, "Yo'nalishi", "Yo‘nalishi")) || null,
    };
    const fund = num(pick(o, "Investitsiya"));
    const rec = byName.get(nameKey(name));
    if (!rec) {
      const year = text(pick(o, "Yil")).match(/\d{4}/)?.[0];
      const created = {
        id: nextId("stu"), name, founder, email: null, phone: f.phone, stage: mapStage(text(pick(o, "Holati"))),
        status: "ACCELERATING", industry: f.industry, employees: 1, revenue: 0, fundingRaised: fund || 0,
        joinedAt: isoDate(pick(o, "Ro'yxatga", "Ro‘yxatga")) || (year ? `${year}-01-01` : now.slice(0, 10)),
        description: f.description, notes: [], documents: [text(pick(o, "Taqdimot"))].filter(Boolean), kpis: null,
        createdAt: now, updatedAt: now,
      };
      db.__add("startups", created); byName.set(nameKey(name), created);
      bump("startups", "added"); log(`  + ADD   ${name}`); continue;
    }
    const changes = [];
    // Only fill gaps: descriptions and funding in the website may have been curated by hand.
    for (const k of ["description", "phone", "industry"]) if (isBlank(rec[k]) || k === "phone") setField("startups", rec, k, f[k], changes);
    if (fund && !rec.fundingRaised) setField("startups", rec, "fundingRaised", fund, changes);
    if (changes.length) { rec.updatedAt = now; bump("startups", "updated"); log(`  ~ UPDATE ${rec.name}: ${changes.join("; ")}`); }
    else bump("startups", "unchanged");
  }
}

function mapEventType(t) {
  const s = norm(t);
  if (/pitch|demo/.test(s)) return "ACCELERATION_DEMO";
  if (/hakat|hackat/.test(s)) return "HACKATHON";
  if (/konferens|conference|forum/.test(s)) return "CONFERENCE";
  if (/uchrashuv|meetup/.test(s)) return "MEETUP";
  return "WORKSHOP";
}
function importEvents(db, wb) {
  log(`\n=== EVENTS (Events.xlsx) ===`);
  const key = (title, date) => `${nameKey(title)}|${date || ""}`;
  const have = new Set(db.events.map((e) => key(e.title, e.eventDate)));
  const haveTitle = new Set(db.events.map((e) => nameKey(e.title)));
  for (const o of readTable(wb.worksheets[0], "Tadbir nomi")) {
    const title = text(pick(o, "Tadbir nomi"));
    if (!title) continue;
    const date = isoDate(pick(o, "O'tkazilgan sanasi", "O‘tkazilgan sanasi"));
    if (have.has(key(title, date)) || haveTitle.has(nameKey(title))) { bump("events", "already in database"); continue; }
    const d = date ? new Date(date + "T00:00:00Z") : null;
    const created = {
      id: nextId("evt"), title, eventType: mapEventType(text(pick(o, "Tadbir turi"))), eventDate: date,
      year: d ? d.getUTCFullYear() : num(pick(o, "Yil")), month: d ? d.getUTCMonth() + 1 : null,
      quarter: d ? Math.floor(d.getUTCMonth() / 3) + 1 : null,
      region: text(pick(o, "Viloyat")) || "Qashqadaryo viloyati", district: text(pick(o, "Tuman/Shahar")) || null,
      venue: text(pick(o, "O'tlazilgan joy", "O‘tlazilgan joy")) || null, organizer: text(pick(o, "Tashkilotchi")) || null,
      partners: text(pick(o, "Hamkorlar")) || null, participantCount: num(pick(o, "Ishtirokchilar")) || 0,
      startupCount: num(pick(o, "Startuplar")) || 0, reportUrl: text(pick(o, "Hisobot")) || null,
      notes: text(pick(o, "Izoh")) || null, createdAt: now, updatedAt: now,
    };
    db.__add("events", created); have.add(key(title, date));
    bump("events", "added"); log(`  + ADD   ${date || "no date"}  ${title.slice(0, 90)}`);
  }
}

function importTalent(db, wb) {
  log(`\n=== TALENTS (Talent Pool.xlsx > Talent Tracking) ===`);
  const byName = new Map(db.talent.map((t) => [tokenKey(t.fullName), t]));
  for (const o of readTable(wb.getWorksheet("Talent Tracking"), "Talent")) {
    const name = text(pick(o, "F.I.O"));
    if (!name) continue;
    const f = { phone: phone(pick(o, "Telefon")), email: text(pick(o, "Email")) || null };
    const rec = byName.get(tokenKey(name));
    if (!rec) {
      const created = {
        id: nextId("tal"), fullName: name, university: text(pick(o, "Muassasa")) || null, major: text(pick(o, "Yo‘nalish", "Yo'nalish")) || null,
        graduationYear: null, skills: [], status: "CANDIDATE", phone: f.phone, email: f.email, englishLevel: null,
        gitHubUrl: null, certifications: [], codingScore: 0, englishScore: 0, softSkillsScore: 0, cvUrl: null, languages: [],
        createdAt: now, updatedAt: now,
      };
      db.__add("talent", created); byName.set(tokenKey(name), created);
      bump("talent", "added"); log(`  + ADD   ${name}  (${created.university || "-"})`); continue;
    }
    const changes = [];
    if (isBlank(rec.phone)) setField("talent", rec, "phone", f.phone, changes);
    if (isBlank(rec.email)) setField("talent", rec, "email", f.email, changes);
    if (changes.length) { rec.updatedAt = now; bump("talent", "updated"); log(`  ~ UPDATE ${rec.fullName}: ${changes.join("; ")}`); }
    else bump("talent", "unchanged");
  }
}

// ---------- main ----------
async function main() {
  log(`ITPMS Excel import  -  ${APPLY ? "APPLY" : "DRY-RUN (nothing will be written)"}  -  ${now}`);
  log(`Excel folder: ${SOURCE_DIR}`);
  log(`Database:     ${DB_PATH}`);
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  for (const k of ["residents", "startups", "events", "talent"]) db[k] ||= [];
  const before = Object.fromEntries(["residents", "startups", "events", "talent"].map((k) => [k, db[k].length]));
  Object.defineProperty(db, "__add", { enumerable: false, value: (k, rec) => db[k].push(rec) });

  const jobs = [["residents", importResidents], ["startups", importStartups], ["events", importEvents], ["talent", importTalent]];
  for (const [name, fn] of jobs) {
    if (!fs.existsSync(FILES[name])) { log(`\n!! Skipping ${name}: file not found: ${FILES[name]}`); continue; }
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(FILES[name]);
    fn(db, wb);
  }

  log(`\n=== SUMMARY ===`);
  for (const [e, s] of Object.entries(stats)) log(`  ${e}: ` + Object.entries(s).filter(([k]) => !k.startsWith("field:")).map(([k, v]) => `${k} ${v}`).join(", ") + `   (records: ${before[e]} -> ${db[e].length})`);

  if (APPLY) {
    const dir = path.join(path.dirname(DB_PATH), "backups");
    fs.mkdirSync(dir, { recursive: true });
    const backup = path.join(dir, `db_store.before-import.${now.replace(/[:.]/g, "-")}.json`);
    fs.copyFileSync(DB_PATH, backup);
    const tmp = DB_PATH + ".tmp-import";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
    fs.renameSync(tmp, DB_PATH);
    log(`\nDONE. Backup of the previous database: ${backup}`);
  } else {
    log(`\nDry-run only - no changes were written. To apply:  node scripts/import-excel.mjs --apply`);
  }
  try { fs.writeFileSync(path.join(path.dirname(DB_PATH), "import-report.txt"), report.join("\n"), "utf8"); } catch {}
}
main().catch((e) => { console.error("Import failed:", e); process.exit(1); });
