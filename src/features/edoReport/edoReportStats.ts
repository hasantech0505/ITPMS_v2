/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resident, Startup, EdoReportSection, EdoReportSectionKey, EdoReportStatItem, EdoReportNarrativeBlock } from "../../types";
import { Property } from "../infrastructure/propertyTypes";

// ------------------------------------------------------------------
// Period helpers
// ------------------------------------------------------------------

export interface PeriodRange {
  period: string;      // "2026-Q2"
  periodLabel: string; // "2026 йил 2-чорак"
  start: Date;
  end: Date;
}

const QUARTER_LABELS: Record<number, string> = {
  1: "1-чорак",
  2: "2-чорак",
  3: "3-чорак",
  4: "4-чорак",
};

export function currentQuarter(date: Date = new Date()): { year: number; quarter: 1 | 2 | 3 | 4 } {
  const q = (Math.floor(date.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
  return { year: date.getFullYear(), quarter: q };
}

export function quarterRange(year: number, quarter: 1 | 2 | 3 | 4): PeriodRange {
  const startMonth = (quarter - 1) * 3;
  const start = new Date(Date.UTC(year, startMonth, 1));
  const end = new Date(Date.UTC(year, startMonth + 3, 0, 23, 59, 59));
  return {
    period: `${year}-Q${quarter}`,
    periodLabel: `${year} йил ${QUARTER_LABELS[quarter]}`,
    start,
    end,
  };
}

export function parsePeriod(period: string): PeriodRange {
  const m = /^(\d{4})-Q([1-4])$/.exec(period || "");
  if (!m) {
    const { year, quarter } = currentQuarter();
    return quarterRange(year, quarter);
  }
  return quarterRange(parseInt(m[1], 10), parseInt(m[2], 10) as 1 | 2 | 3 | 4);
}

function inRange(dateStr: string | undefined, range: PeriodRange): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return d >= range.start && d <= range.end;
}

function sum(nums: (number | undefined)[]): number {
  return nums.reduce((acc: number, n) => acc + (typeof n === "number" && !isNaN(n) ? n : 0), 0);
}

function topEntries(counts: Record<string, number>, n: number): string {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
  if (entries.length === 0) return "—";
  return entries.map(([k, v]) => `${k} (${v})`).join(", ");
}

function groupCount<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item) || "Unspecified";
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// ------------------------------------------------------------------
// Section I — Residents
// ------------------------------------------------------------------

export function computeResidentAutoStats(residents: Resident[], range: PeriodRange): Record<string, number | string> {
  const active = residents.filter((r) => r.status === "ACTIVE");
  const exportVolumeUsd = sum(active.map((r) => r.exportVolume));
  const domesticVolumeUsd = sum(active.map((r) => r.domesticVolume));
  const employeesTotal = sum(active.map((r) => r.employeesCount));
  const exporterCount = active.filter((r) => (r.exportVolume || 0) > 0).length;
  const newInPeriod = residents.filter((r) => inRange(r.approvedAt, range) || (!r.approvedAt && inRange(r.appliedAt, range))).length;
  const byIndustry = groupCount(active, (r) => r.industry || "Unspecified");
  const byDistrict = groupCount(active, (r) => r.district || "Unspecified");

  return {
    "Faol rezidentlar soni (Active residents)": active.length,
    "Eksport hajmi, USD (Export volume)": formatUsd(exportVolumeUsd),
    "Ichki xizmatlar hajmi, USD (Domestic services volume)": formatUsd(domesticVolumeUsd),
    "Xodimlar soni (Employees)": formatNumber(employeesTotal),
    "Eksportyor korxonalar (Exporter companies)": exporterCount,
    [`Ushbu davrda qabul qilingan yangi rezidentlar (New in ${range.periodLabel})`]: newInPeriod,
    "Yetakchi faoliyat yo'nalishlari (Top industries)": topEntries(byIndustry, 5),
    "Tumanlar bo'yicha taqsimot (Top districts)": topEntries(byDistrict, 5),
  };
}

export function defaultResidentManualStats(): EdoReportStatItem[] {
  return [
    { id: cryptoId(), label: "Xorijiy kapital ishtirokidagi kompaniyalar (Foreign-capital companies)", value: "" },
    { id: cryptoId(), label: "Xorijiy IT/BPO kompaniyalar bilan o'tkazilgan onlayn uchrashuvlar (Online meetings with foreign companies)", value: "" },
    { id: cryptoId(), label: "Yangi jalb qilingan xorijiy kompaniyalar (New foreign companies engaged)", value: "" },
    { id: cryptoId(), label: "Zero Risk dasturi ishtirokchilari (Zero Risk program participants)", value: "" },
    { id: cryptoId(), label: "Tashrif buyurilgan tuman-shahar hokimliklari (District/city hokimiyats visited)", value: "" },
  ];
}

export function defaultResidentNarrative(): EdoReportNarrativeBlock[] {
  return [
    { id: cryptoId(), heading: "Xorijiy IT va BPO kompaniyalarni jalb qilish bo'yicha natijalar", body: "" },
    { id: cryptoId(), heading: "Xorijiy bozorlar bo'yicha tadqiqotlar", body: "" },
    { id: cryptoId(), heading: "Xalqaro xizmat safarlarini tashkil etish bo'yicha", body: "" },
    { id: cryptoId(), heading: "Zero Risk dasturi", body: "" },
    { id: cryptoId(), heading: "Tumanlarda IT-ni rivojlantirish yo'nalishida", body: "" },
  ];
}

// ------------------------------------------------------------------
// Section II — Startups
// ------------------------------------------------------------------

export function computeStartupAutoStats(startups: Startup[], range: PeriodRange): Record<string, number | string> {
  const newInPeriod = startups.filter((s) => inRange(s.joinedAt, range));
  const fundingRaisedTotal = sum(startups.map((s) => s.fundingRaised));
  const exportRevenueTotal = sum(startups.map((s) => s.exportRevenue));
  const jobsCreatedTotal = sum(startups.map((s) => s.jobsCreated));
  const byProgram = groupCount(
    startups.filter((s) => !!s.program),
    (s) => s.program as string
  );

  return {
    "Jami startaplar soni (Total startups)": startups.length,
    [`Ushbu davrda ro'yxatga olingan yangi startaplar (New in ${range.periodLabel})`]: newInPeriod.length,
    "Jalb qilingan investitsiya, USD (Total funding raised)": formatUsd(fundingRaisedTotal),
    "Eksport daromadi, USD (Total export revenue)": formatUsd(exportRevenueTotal),
    "Yaratilgan ish o'rinlari (Jobs created)": formatNumber(jobsCreatedTotal),
    "Dasturlar bo'yicha taqsimot (By program)": topEntries(byProgram, 6),
  };
}

export function defaultStartupManualStats(): EdoReportStatItem[] {
  return [
    { id: cryptoId(), label: "Mahalliy tadbirlar soni (Local events organized)", value: "" },
    { id: cryptoId(), label: "Tadbirlarda qamrab olingan yoshlar (Youth reached)", value: "" },
    { id: cryptoId(), label: "Grant mablag'lari, so'm (Grants awarded, UZS)", value: "" },
  ];
}

export function defaultStartupNarrative(): EdoReportNarrativeBlock[] {
  return [
    { id: cryptoId(), heading: "Aksellerasiya dasturi", body: "" },
    { id: cryptoId(), heading: "Inkubatsiya dasturi", body: "" },
    { id: cryptoId(), heading: "Hackathon va Ideathon tanlovlari", body: "" },
    { id: cryptoId(), heading: "Investitsiya bo'yicha ma'lumot", body: "" },
    { id: cryptoId(), heading: "PF-59-sonli qaror ijrosi va OTMlar bilan ishlash", body: "" },
  ];
}

// ------------------------------------------------------------------
// Section III — Infrastructure
// ------------------------------------------------------------------

export function computeInfrastructureAutoStats(properties: Property[], range: PeriodRange): Record<string, number | string> {
  const totalAreaSqm = sum(properties.map((p) => p.areaSqM));
  const occupied = properties.filter((p) => p.status === "Occupied");
  const available = properties.filter((p) => p.status === "Available for Rent" || p.status === "Available for Sale" || p.status === "Rent & Sale");
  const byDistrict = groupCount(properties, (p) => p.district || p.city || "Unspecified");

  return {
    "Katalogdagi obyektlar soni (Catalogued objects)": properties.length,
    "Umumiy maydon, kv.m (Total area, sq.m)": formatNumber(totalAreaSqm),
    "Band qilingan obyektlar (Occupied)": occupied.length,
    "Bo'sh/ijaraga tayyor obyektlar (Available)": available.length,
    "Tumanlar bo'yicha taqsimot (By district)": topEntries(byDistrict, 5),
  };
}

export function defaultInfrastructureManualStats(): EdoReportStatItem[] {
  return [
    { id: cryptoId(), label: "Zero Risk dasturi doirasida joylashtirilgan korxonalar (Companies placed under Zero Risk)", value: "" },
    { id: cryptoId(), label: "Jalb qilinayotgan BPO kompaniyalari (BPO companies being onboarded)", value: "" },
  ];
}

export function defaultInfrastructureNarrative(): EdoReportNarrativeBlock[] {
  return [
    { id: cryptoId(), heading: "Infratuzilma bazasini shakllantirish", body: "" },
    { id: cryptoId(), heading: "Bino-inshoot to'g'risida", body: "" },
    { id: cryptoId(), heading: "Keyingi bosqichdagi asosiy vazifalar", body: "" },
  ];
}

// ------------------------------------------------------------------
// Section assembly
// ------------------------------------------------------------------

export function cryptoId(): string {
  return `edo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SECTION_TITLES: Record<EdoReportSectionKey, string> = {
  residents: "I. РЕЗИДЕНТЛИК ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ",
  startups: "II. СТАРТАПЛАР ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ",
  infrastructure: "III. ИНФРАТУЗИЛМА ЙЎНАЛИШИ БЎЙИЧА МАЪЛУМОТ",
};

export function buildFreshSection(
  key: EdoReportSectionKey,
  range: PeriodRange,
  data: { residents: Resident[]; startups: Startup[]; properties: Property[] }
): EdoReportSection {
  const autoStats =
    key === "residents"
      ? computeResidentAutoStats(data.residents, range)
      : key === "startups"
      ? computeStartupAutoStats(data.startups, range)
      : computeInfrastructureAutoStats(data.properties, range);

  const manualStats =
    key === "residents" ? defaultResidentManualStats() : key === "startups" ? defaultStartupManualStats() : defaultInfrastructureManualStats();

  const narrative =
    key === "residents" ? defaultResidentNarrative() : key === "startups" ? defaultStartupNarrative() : defaultInfrastructureNarrative();

  return {
    key,
    title: SECTION_TITLES[key],
    autoStats,
    autoStatsUpdatedAt: new Date().toISOString(),
    manualStats,
    narrative,
  };
}

/** Recompute just the autoStats for a section, leaving manualStats/narrative untouched. */
export function refreshSectionAutoStats(
  section: EdoReportSection,
  range: PeriodRange,
  data: { residents: Resident[]; startups: Startup[]; properties: Property[] }
): EdoReportSection {
  const autoStats =
    section.key === "residents"
      ? computeResidentAutoStats(data.residents, range)
      : section.key === "startups"
      ? computeStartupAutoStats(data.startups, range)
      : computeInfrastructureAutoStats(data.properties, range);
  return { ...section, autoStats, autoStatsUpdatedAt: new Date().toISOString() };
}

/**
 * Build the 3 sections for a brand new report. When a previous report exists,
 * its narrative HEADINGS (structure) are carried over with blank bodies so staff
 * don't have to retype the outline each quarter — but content is never copied
 * forward, since every period needs fresh, accurate figures.
 */
export function buildSectionsForNewReport(
  range: PeriodRange,
  data: { residents: Resident[]; startups: Startup[]; properties: Property[] },
  previous?: EdoReportSection[]
): EdoReportSection[] {
  const keys: EdoReportSectionKey[] = ["residents", "startups", "infrastructure"];
  return keys.map((key) => {
    const fresh = buildFreshSection(key, range, data);
    const prevSection = previous?.find((s) => s.key === key);
    if (!prevSection) return fresh;
    return {
      ...fresh,
      manualStats: prevSection.manualStats.map((m) => ({ ...m, value: "" })),
      narrative: prevSection.narrative.map((n) => ({ ...n, body: "" })),
    };
  });
}
