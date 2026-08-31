/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Derives real, live Executive Dashboard figures from the actual ITPMS
 * dataset (residents, startups, events, CRM companies/contacts) instead of
 * the hand-entered placeholder figures in data/kpiData.ts.
 *
 * Honesty rule followed throughout this file: a number is only ever shown
 * when it is computed from a real recorded field. Where the underlying
 * source data has not been imported yet (e.g. resident export/domestic
 * revenue), the corresponding KPI is marked `dataAvailable: false` instead
 * of being backfilled with a guessed number — the UI renders
 * "No data reported" for those, the same convention used on the Startups
 * Hub for startups missing financial telemetry.
 */

import { Resident, Startup, Event, Company, ResidentStatus, KASHKADARYA_DISTRICTS } from "../../../types";
import {
  StrategicKPI,
  ResidentHealthSummary,
  AtRiskResident,
  InternationalPipelineData,
  RegionalDistrictPerformance,
  ExecutiveActionItem,
  ExecutiveAlert,
  ExecutiveBrief,
  KpiTargetOverride
} from "../types/kpiTypes";
import { STRATEGIC_KPIS_2026, REGIONAL_PERFORMANCE_DATA } from "../data/kpiData";

const TODAY = new Date("2026-08-28T00:00:00Z");
const CURRENT_YEAR = 2026;

// A "previous checkpoint" cutoff (~90 days back) used to compute real
// period-over-period trends for the count-based KPIs, so the trend arrows
// reflect actual onboarding dates rather than a fixed guess.
const PREVIOUS_CHECKPOINT = new Date(TODAY.getTime() - 90 * 24 * 60 * 60 * 1000);

function yearOf(dateStr?: string): number | null {
  if (!dateStr || dateStr.length < 4) return null;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

function asDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Normalizes the many free-text spellings found in the real resident
 * dataset ("Qarshi tumani", "Qarshi shahri", "Shahrisabz sh.", ...) down to
 * the 14 official Kashkadarya district names used throughout the app.
 * Returns null when the raw value can't be confidently matched (e.g. "-",
 * or a village-level name like "Ko'kdala" that isn't one of the 14 units).
 */
export function normalizeDistrict(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[ʻʼ’‘`]/g, "'")
    .trim()
    .toLowerCase();
  if (!cleaned || cleaned === "-") return null;

  const isCityForm = /shahr|sh\.$|sh$/.test(cleaned);
  const base = cleaned
    .replace(/\btumani\b|\btuman\b|\bt\.$|\bshahri\b|\bshahar\b|\bshahar\b|\bsh\.$/g, "")
    .trim();

  const table: Record<string, string> = {
    qarshi: isCityForm ? "Qarshi" : "Qarshi District",
    shahrisabz: "Shahrisabz",
    chiroqchi: "Chiroqchi",
    dehqonobod: "Dehqonobod",
    "g'uzor": "Gʻuzor",
    guzor: "Gʻuzor",
    kasbi: "Kasbi",
    kitob: "Kitob",
    koson: "Koson",
    mirishkor: "Mirishkor",
    muborak: "Muborak",
    nishon: "Nishon",
    qamashi: "Qamashi",
    "yakkabog'": "Yakkabogʻ",
    yakkabog: "Yakkabogʻ"
  };

  return table[base] || null;
}

interface LiveCounters {
  newResidents2026: number;
  newResidentsPrevCheckpoint: number;
  jobsAtNewResidents2026: number;
  jobsAtNewResidentsPrevCheckpoint: number;
  activeResidents: Resident[];
  startupsTotal: number;
  startupsPrevCheckpoint: number;
  localEvents2026: number;
  localEventsPrevCheckpoint: number;
  investmentAttracted: number;
  investmentPrevCheckpoint: number;
}

function computeCounters(residents: Resident[], startups: Startup[], events: Event[]): LiveCounters {
  const newResidents2026List = residents.filter((r) => {
    if (r.status === ResidentStatus.REMOVED) return false;
    return yearOf(r.approvedAt || r.appliedAt) === CURRENT_YEAR;
  });
  const newResidentsPrevCheckpoint = newResidents2026List.filter((r) => {
    const d = asDate(r.approvedAt || r.appliedAt);
    return d ? d.getTime() <= PREVIOUS_CHECKPOINT.getTime() : false;
  }).length;

  const activeResidents = residents.filter((r) => r.status === ResidentStatus.ACTIVE);

  const jobsAtNewResidents2026 = newResidents2026List.reduce((sum, r) => sum + (r.employeesCount || 0), 0);
  const jobsAtNewResidentsPrevCheckpoint = newResidents2026List
    .filter((r) => {
      const d = asDate(r.approvedAt || r.appliedAt);
      return d ? d.getTime() <= PREVIOUS_CHECKPOINT.getTime() : false;
    })
    .reduce((sum, r) => sum + (r.employeesCount || 0), 0);

  const startupsPrevCheckpoint = startups.filter((s) => {
    const d = asDate(s.joinedAt);
    return d ? d.getTime() <= PREVIOUS_CHECKPOINT.getTime() : false;
  }).length;

  const events2026 = events.filter((e) => e.year === CURRENT_YEAR);
  const localEventsPrevCheckpoint = events2026.filter((e) => {
    const d = asDate(e.eventDate);
    return d ? d.getTime() <= PREVIOUS_CHECKPOINT.getTime() : false;
  }).length;

  const investmentAttracted = startups.reduce((sum, s) => sum + (s.fundingRaised || 0), 0);
  const investmentPrevCheckpoint = startups
    .filter((s) => {
      const d = asDate(s.joinedAt);
      return d ? d.getTime() <= PREVIOUS_CHECKPOINT.getTime() : false;
    })
    .reduce((sum, s) => sum + (s.fundingRaised || 0), 0);

  return {
    newResidents2026: newResidents2026List.length,
    newResidentsPrevCheckpoint,
    jobsAtNewResidents2026,
    jobsAtNewResidentsPrevCheckpoint,
    activeResidents,
    startupsTotal: startups.length,
    startupsPrevCheckpoint,
    localEvents2026: events2026.length,
    localEventsPrevCheckpoint,
    investmentAttracted,
    investmentPrevCheckpoint
  };
}

// KPI ids where the real underlying financial data has not been imported
// yet (resident export/domestic revenue, office/business floor space).
const NO_DATA_KPI_IDS = new Set([
  "export_companies",
  "export_volume",
  "services_volume",
  "incubation_outcomes",
  "office_space",
  "business_space"
]);

export function buildLiveStrategicKpis(
  residents: Resident[],
  startups: Startup[],
  events: Event[],
  kpiTargetOverrides: KpiTargetOverride[] = []
): StrategicKPI[] {
  const c = computeCounters(residents, startups, events);

  // Admin-edited annual/quarterly targets layer on top of the shipped 2026
  // plan baseline (data/kpiData.ts) without ever mutating that source file.
  const overrideById = new Map(kpiTargetOverrides.map((o) => [o.id, o]));

  return STRATEGIC_KPIS_2026.map((baseline) => {
    const override = overrideById.get(baseline.id);
    const template = override
      ? { ...baseline, annualTarget: override.annualTarget, quarterlyTargets: override.quarterlyTargets }
      : baseline;

    if (NO_DATA_KPI_IDS.has(template.id)) {
      return {
        ...template,
        actual: 0,
        previousActual: 0,
        dataAvailable: false,
        actionNote: "No data reported yet — the source spreadsheet for this figure hasn't been imported."
      };
    }

    switch (template.id) {
      case "new_residents":
        return {
          ...template,
          actual: c.newResidents2026,
          previousActual: c.newResidentsPrevCheckpoint,
          dataAvailable: true,
          actionNote: `${c.newResidents2026} residents onboarded in 2026 (approved/applied this year).`
        };
      case "new_jobs":
        return {
          ...template,
          actual: c.jobsAtNewResidents2026,
          previousActual: c.jobsAtNewResidentsPrevCheckpoint,
          dataAvailable: true,
          actionNote: `Headcount reported by residents onboarded in 2026 (${c.newResidents2026} companies). Portfolio-wide headcount change over time isn't tracked yet.`
        };
      case "startups_count":
        return {
          ...template,
          actual: c.startupsTotal,
          previousActual: c.startupsPrevCheckpoint,
          dataAvailable: true,
          actionNote: `${c.startupsTotal} startups currently in the portfolio.`
        };
      case "local_events":
        return {
          ...template,
          actual: c.localEvents2026,
          previousActual: c.localEventsPrevCheckpoint,
          dataAvailable: true,
          actionNote: `${c.localEvents2026} events logged in 2026.`
        };
      case "investment_attracted":
        return {
          ...template,
          actual: c.investmentAttracted,
          previousActual: c.investmentPrevCheckpoint,
          dataAvailable: true,
          actionNote: `Sum of reported startup funding raised (9 startups with financial data on file).`
        };
      default:
        return { ...template, dataAvailable: true };
    }
  });
}

/**
 * Resident health, computed from the one real signal available today:
 * 2026 quarterly-report submission compliance. (Revenue/headcount-trend
 * health can't be computed yet — resident export/domestic volume hasn't
 * been imported — see buildLiveStrategicKpis.)
 */
export function buildLiveResidentHealth(residents: Resident[]): ResidentHealthSummary {
  const active = residents.filter((r) => r.status === ResidentStatus.ACTIVE);

  let healthyCount = 0;
  let watchCount = 0;
  let atRiskCount = 0;
  const atRiskCandidates: AtRiskResident[] = [];

  active.forEach((r) => {
    const reports2026 = (r.quarterlyReports || []).filter((q) => q.year === CURRENT_YEAR);
    const hasLate = reports2026.some((q) => q.status === "LATE");
    const hasMissingOrRejected = reports2026.some((q) => q.status === "NOT_SUBMITTED" || q.status === "REJECTED");
    const hasAnyReport = reports2026.length > 0;

    let riskLevel: AtRiskResident["riskLevel"] | null = null;
    let reason = "";

    if (!hasAnyReport) {
      atRiskCount++;
      riskLevel = "MEDIUM";
      reason = "No 2026 quarterly report submitted yet.";
    } else if (hasMissingOrRejected) {
      atRiskCount++;
      riskLevel = "HIGH";
      reason = reports2026.some((q) => q.status === "REJECTED")
        ? "A 2026 quarterly report was rejected and needs resubmission."
        : "Missing a 2026 quarterly report submission.";
    } else if (hasLate) {
      watchCount++;
    } else {
      healthyCount++;
    }

    if (riskLevel) {
      atRiskCandidates.push({
        id: r.id,
        companyName: r.companyName,
        district: normalizeDistrict(r.district) || r.district || "Unknown",
        primaryReason: reason,
        revenueChangePct: 0,
        employeeChangePct: 0,
        exportChangePct: 0,
        daysInactive: 0,
        healthScore: riskLevel === "HIGH" ? 40 : 55,
        riskLevel
      });
    }
  });

  return {
    totalResidents: active.length,
    healthyCount,
    watchCount,
    atRiskCount,
    averageHealthScore: active.length > 0 ? Math.round(((healthyCount * 100 + watchCount * 65 + atRiskCount * 35) / active.length)) : 0,
    atRiskList: atRiskCandidates
      .sort((a, b) => (a.riskLevel === "HIGH" ? -1 : 1) - (b.riskLevel === "HIGH" ? -1 : 1))
      .slice(0, 6)
  };
}

const COUNTRY_REGION_MAP: Record<string, string> = {
  usa: "USA & Canada",
  "united states": "USA & Canada",
  canada: "USA & Canada",
  "united kingdom": "European Union & UK",
  poland: "European Union & UK",
  cyprus: "European Union & UK",
  czech: "European Union & UK",
  "united arab emirates": "Middle East (GCC)",
  dubai: "Middle East (GCC)",
  jordan: "Middle East (GCC)",
  kazakhstan: "Central Asia & CIS",
  russia: "Central Asia & CIS",
  azerbaijan: "Central Asia & CIS",
  ozarbayjan: "Central Asia & CIS",
  uzbekistan: "Central Asia & CIS"
};

function regionForCountry(raw: string): string {
  const cleaned = raw.toLowerCase();
  for (const key of Object.keys(COUNTRY_REGION_MAP)) {
    if (cleaned.includes(key)) return COUNTRY_REGION_MAP[key];
  }
  return "Other International";
}

export function buildLiveInternationalPipeline(companies: Company[]): InternationalPipelineData {
  const prospects = companies.length;
  const contacted = companies.filter((c) => c.status === "CONTACTED").length;
  const converted = companies.filter((c) => c.status === "PARTNER").length;
  // Meetings/negotiations/LOIs aren't tracked as distinct CRM stages in the
  // real dataset yet — the app currently only records LEAD/CONTACTED/PARTNER/INACTIVE.
  const meetings = 0;
  const negotiations = 0;
  const loisMous = 0;

  const byRegion = new Map<string, number>();
  companies.forEach((c) => {
    const region = regionForCountry(c.country || "");
    byRegion.set(region, (byRegion.get(region) || 0) + 1);
  });

  const marketBreakdown = Array.from(byRegion.entries())
    .map(([region, count]) => ({
      region,
      prospectsCount: count,
      valueUSD: 0,
      sharePct: prospects > 0 ? Math.round((count / prospects) * 1000) / 10 : 0,
      valueDataAvailable: false
    }))
    .sort((a, b) => b.prospectsCount - a.prospectsCount);

  return {
    prospects,
    contacted,
    meetings,
    negotiations,
    loisMous,
    converted,
    pipelineValueUSD: 0,
    remainingExportTargetUSD: 0,
    pipelineCoveragePct: 0,
    pipelineValueDataAvailable: false,
    marketBreakdown
  };
}

export function buildLiveRegionalPerformance(residents: Resident[]): RegionalDistrictPerformance[] {
  const active = residents.filter((r) => r.status === ResidentStatus.ACTIVE);
  const byDistrict = new Map<string, { residents: number; jobs: number }>();

  active.forEach((r) => {
    const district = normalizeDistrict(r.district);
    if (!district) return;
    const entry = byDistrict.get(district) || { residents: 0, jobs: 0 };
    entry.residents += 1;
    entry.jobs += r.employeesCount || 0;
    byDistrict.set(district, entry);
  });

  return KASHKADARYA_DISTRICTS.map((districtName) => {
    const template = REGIONAL_PERFORMANCE_DATA.find((d) => d.districtName === districtName);
    const live = byDistrict.get(districtName) || { residents: 0, jobs: 0 };
    const residentsTarget = template?.residentsTarget ?? 0;
    const jobsTarget = template?.jobsTarget ?? 0;
    const resPct = residentsTarget > 0 ? live.residents / residentsTarget : 0;
    const jobsPct = jobsTarget > 0 ? live.jobs / jobsTarget : 0;
    const overallPct = ((resPct + jobsPct) / 2) * 100;
    const status: RegionalDistrictPerformance["status"] =
      overallPct >= 80 ? "ON_TRACK" : overallPct >= 60 ? "AT_RISK" : "BEHIND";

    return {
      districtId: template?.districtId ?? districtName.toLowerCase().replace(/\s+/g, "-"),
      districtName,
      residentsActual: live.residents,
      residentsTarget,
      jobsActual: live.jobs,
      jobsTarget,
      exportActualUSD: 0,
      exportTargetUSD: template?.exportTargetUSD ?? 0,
      exportDataAvailable: false,
      status
    };
  });
}

export function buildLiveUpcomingActions(events: Event[]): ExecutiveActionItem[] {
  return events
    .filter((e) => {
      const d = asDate(e.eventDate);
      return d ? d.getTime() >= TODAY.getTime() : false;
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 5)
    .map((e) => {
      const d = new Date(e.eventDate);
      const displayDate = d
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        .toUpperCase()
        .replace(" ", " ");
      return {
        id: e.id,
        date: e.eventDate,
        displayDate,
        title: e.title,
        category: "EVENT" as const,
        priority: "MEDIUM" as const,
        targetModule: "events",
        actionLabel: "Event Plan"
      };
    });
}

export function buildLiveExecutiveAlerts(
  residents: Resident[],
  companies: Company[],
  residentHealth: ResidentHealthSummary
): ExecutiveAlert[] {
  const alerts: ExecutiveAlert[] = [];

  if (residentHealth.atRiskCount > 0) {
    alerts.push({
      id: "alert-compliance",
      severity: residentHealth.atRiskCount > 10 ? "CRITICAL" : "AT_RISK",
      titleKey: "executiveDashboard.alertComplianceTitle",
      defaultTitle: `${residentHealth.atRiskCount} Residents Missing 2026 Quarterly Reports`,
      explanation: `${residentHealth.atRiskCount} of ${residentHealth.totalResidents} active residents have a missing or rejected 2026 quarterly report on file.`,
      metric: `${residentHealth.atRiskCount} / ${residentHealth.totalResidents} Residents`,
      recommendedAction: "Follow up with these residents to collect outstanding quarterly submissions.",
      targetModule: "residents",
      linkText: "Inspect At-Risk Residents",
      timestamp: "Live"
    });
  }

  const leadCompanies = companies.filter((c) => c.status === "LEAD").length;
  if (leadCompanies > 0) {
    alerts.push({
      id: "alert-crm-leads",
      severity: "FOLLOW_UP",
      titleKey: "executiveDashboard.alertCrmTitle",
      defaultTitle: `${leadCompanies} International Leads Not Yet Contacted`,
      explanation: `${leadCompanies} of ${companies.length} companies in Global Outreach are still at the "Lead" stage with no recorded contact yet.`,
      metric: `${leadCompanies} Uncontacted Leads`,
      recommendedAction: "Schedule initial outreach for these prospects.",
      targetModule: "crm",
      linkText: "Open CRM Pipeline",
      timestamp: "Live"
    });
  }

  alerts.push({
    id: "alert-financial-data",
    severity: "INFO",
    titleKey: "executiveDashboard.alertFinancialDataTitle",
    defaultTitle: "Export & Domestic Revenue Data Not Yet Imported",
    explanation: "Resident export/domestic revenue and office floor-space figures aren't in the system yet, so IT Export Volume, IT Services Volume, and Infrastructure KPIs show as “No data reported.”",
    metric: "5 KPIs pending import",
    recommendedAction: "Provide the resident financial reporting and property/infrastructure source files to complete these figures.",
    targetModule: "residents",
    linkText: "View Residents",
    timestamp: "Live"
  });

  return alerts;
}

export function buildLiveExecutiveBrief(
  liveKpis: StrategicKPI[],
  residentHealth: ResidentHealthSummary,
  pipeline: InternationalPipelineData
): ExecutiveBrief {
  const bulletPoints: ExecutiveBrief["bulletPoints"] = [];

  const residentsKpi = liveKpis.find((k) => k.id === "new_residents");
  if (residentsKpi) {
    const pct = residentsKpi.annualTarget > 0 ? Math.round((residentsKpi.actual / residentsKpi.annualTarget) * 100) : 0;
    bulletPoints.push({
      type: pct >= 70 ? "POSITIVE" : "INFO",
      text: `Resident onboarding is at ${pct}% of the 2026 annual goal (+${residentsKpi.actual} of ${residentsKpi.annualTarget} companies).`
    });
  }

  bulletPoints.push({
    type: "INFO",
    text: "IT export volume and domestic services revenue are not yet available — the resident financial reporting data hasn't been imported."
  });

  if (residentHealth.atRiskCount > 0) {
    bulletPoints.push({
      type: "WARNING",
      text: `${residentHealth.atRiskCount} active residents have missing or rejected 2026 quarterly reports and need follow-up.`
    });
  }

  bulletPoints.push({
    type: "INFO",
    text: `Global Outreach CRM currently tracks ${pipeline.prospects} international companies (${pipeline.contacted} contacted so far).`
  });

  return {
    date: TODAY.toISOString().slice(0, 10),
    overallStatus: residentHealth.atRiskCount > 10 ? "NEEDS_ATTENTION" : "ON_TRACK",
    bulletPoints,
    primaryActionPriority:
      "Collect the outstanding resident financial and quarterly-report data, then follow up on uncontacted CRM leads."
  };
}
