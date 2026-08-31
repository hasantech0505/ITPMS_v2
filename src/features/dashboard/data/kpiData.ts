/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StrategicKPI,
  ExecutiveAlert,
  ResidentHealthSummary,
  InternationalPipelineData,
  RegionalDistrictPerformance,
  ExecutiveActionItem,
  ExecutiveBrief
} from "../types/kpiTypes";

/**
 * 2026 Official Strategic Targets & YTD Actual Data
 * Based on Kashkadarya 2026 Strategic Plan
 */
export const STRATEGIC_KPIS_2026: StrategicKPI[] = [
  {
    id: "new_residents",
    nameKey: "executiveDashboard.kpiNewResidents",
    defaultName: "New IT Park Residents",
    category: "residents",
    unit: "count",
    annualTarget: 35,
    quarterlyTargets: { q1: 8, q2: 17, q3: 26, q4: 35 },
    actual: 24, // Q3 YTD
    previousActual: 16,
    healthWeight: 0.15,
    actionNote: "On track to reach annual target of +35 companies"
  },
  {
    id: "export_companies",
    nameKey: "executiveDashboard.kpiExportCompanies",
    defaultName: "Export-Oriented IT Companies",
    category: "export",
    unit: "count",
    annualTarget: 10,
    quarterlyTargets: { q1: 2, q2: 5, q3: 8, q4: 10 },
    actual: 6,
    previousActual: 4,
    healthWeight: 0.10,
    actionNote: "Requires 2 additional export converts in Q4"
  },
  {
    id: "export_volume",
    nameKey: "executiveDashboard.kpiExportVolume",
    defaultName: "IT Export Volume",
    category: "export",
    unit: "currency_usd",
    annualTarget: 5000000, // $5,000,000
    quarterlyTargets: { q1: 1000000, q2: 2200000, q3: 3600000, q4: 5000000 },
    actual: 2100000, // $2,100,000
    previousActual: 1450000,
    healthWeight: 0.20,
    actionNote: "Below trajectory ($2.1M vs $3.6M Q3 target). Needs CRM follow-up"
  },
  {
    id: "services_volume",
    nameKey: "executiveDashboard.kpiServicesVolume",
    defaultName: "IT Services Volume",
    category: "revenue",
    unit: "currency_uzs_b",
    annualTarget: 90, // 90 Billion UZS
    quarterlyTargets: { q1: 20, q2: 45, q3: 68, q4: 90 },
    actual: 59.3, // 59.3 Billion UZS
    previousActual: 42.1,
    healthWeight: 0.15,
    actionNote: "Stable domestic IT growth across regional enterprises"
  },
  {
    id: "new_jobs",
    nameKey: "executiveDashboard.kpiNewJobs",
    defaultName: "New High-Skilled IT Jobs",
    category: "jobs",
    unit: "count",
    annualTarget: 1000,
    quarterlyTargets: { q1: 220, q2: 480, q3: 750, q4: 1000 },
    actual: 561,
    previousActual: 432,
    healthWeight: 0.15,
    actionNote: "Gap of 189 jobs against Q3 target. Acceleration required"
  },
  {
    id: "startups_count",
    nameKey: "executiveDashboard.kpiStartups",
    defaultName: "Supported Startups",
    category: "startups",
    unit: "count",
    annualTarget: 60,
    quarterlyTargets: { q1: 15, q2: 30, q3: 45, q4: 60 },
    actual: 38,
    previousActual: 28,
    healthWeight: 0.08,
    actionNote: "Incubation batch 4 starting next week"
  },
  {
    id: "investment_attracted",
    nameKey: "executiveDashboard.kpiInvestment",
    defaultName: "Investment Attracted",
    category: "investment",
    unit: "currency_usd",
    annualTarget: 500000, // $500,000
    quarterlyTargets: { q1: 100000, q2: 230000, q3: 370000, q4: 500000 },
    actual: 310000, // $310,000
    previousActual: 180000,
    healthWeight: 0.07,
    actionNote: "Venture pitch day scheduled for end of month"
  },
  {
    id: "incubation_outcomes",
    nameKey: "executiveDashboard.kpiIncubationOutcomes",
    defaultName: "Incubation / Acceleration Graduates",
    category: "startups",
    unit: "count",
    annualTarget: 3,
    quarterlyTargets: { q1: 0, q2: 1, q3: 2, q4: 3 },
    actual: 2,
    previousActual: 1,
    healthWeight: 0.03,
    actionNote: "2 teams successfully secured seed funding"
  },
  {
    id: "local_events",
    nameKey: "executiveDashboard.kpiEvents",
    defaultName: "Local IT Events & Summits",
    category: "events",
    unit: "count",
    annualTarget: 45,
    quarterlyTargets: { q1: 10, q2: 22, q3: 34, q4: 45 },
    actual: 29,
    previousActual: 19,
    healthWeight: 0.03,
    actionNote: "ICTWEEK regional forum preparation in progress"
  },
  {
    id: "office_space",
    nameKey: "executiveDashboard.kpiOfficeSpace",
    defaultName: "IT Infrastructure & Office Space",
    category: "space",
    unit: "sqm",
    annualTarget: 5000, // 5,000 m²
    quarterlyTargets: { q1: 1200, q2: 2500, q3: 3800, q4: 5000 },
    actual: 3450, // 3,450 m²
    previousActual: 2800,
    healthWeight: 0.02,
    actionNote: "New tech hub building phase 2 opening in Qarshi"
  },
  {
    id: "business_space",
    nameKey: "executiveDashboard.kpiBusinessSpace",
    defaultName: "Entrepreneur / Business Space",
    category: "space",
    unit: "sqm",
    annualTarget: 10000, // 10,000 m²
    quarterlyTargets: { q1: 2500, q2: 5000, q3: 7500, q4: 10000 },
    actual: 7100,
    previousActual: 5500,
    healthWeight: 0.02,
    actionNote: "Co-working spaces fully operational in 3 districts"
  }
];

export const EXECUTIVE_ALERTS: ExecutiveAlert[] = [
  {
    id: "alert-1",
    severity: "CRITICAL",
    titleKey: "executiveDashboard.alert1Title",
    defaultTitle: "IT Export Volume Below Q3 Trajectory",
    explanation: "Actual export volume ($2.1M) is lagging behind expected Q3 trajectory ($3.6M). Current gap: -$1.5M against Q3 milestone.",
    metric: "$2.1M / $3.6M Q3 Target",
    recommendedAction: "Accelerate high-ticket international BPO contracts and review CRM negotiations pipeline.",
    targetModule: "crm",
    linkText: "Open CRM Pipeline",
    timestamp: "10 mins ago"
  },
  {
    id: "alert-2",
    severity: "AT_RISK",
    titleKey: "executiveDashboard.alert2Title",
    defaultTitle: "7 Resident Companies Showing Performance Risk",
    explanation: "Revenue or headcount drops detected in 7 active residents over the last 30 days. Revenue down average 22%.",
    metric: "7 / 75 Residents At-Risk",
    recommendedAction: "Initiate direct compliance and advisory audit with resident founders.",
    targetModule: "residents",
    linkText: "Inspect At-Risk Residents",
    timestamp: "1 hour ago"
  },
  {
    id: "alert-3",
    severity: "FOLLOW_UP",
    titleKey: "executiveDashboard.alert3Title",
    defaultTitle: "11 International BPO Prospects Stalled > 14 Days",
    explanation: "Key potential export partners from USA and EU have had no contact activity in over two weeks.",
    metric: "11 Inactive Pipeline Leads",
    recommendedAction: "Schedule priority outreach and executive check-in calls with prospect leads.",
    targetModule: "crm",
    linkText: "View Stalled CRM Leads",
    timestamp: "3 hours ago"
  }
];

export const RESIDENT_HEALTH_DATA: ResidentHealthSummary = {
  totalResidents: 75,
  healthyCount: 54,
  watchCount: 14,
  atRiskCount: 7,
  averageHealthScore: 81.4,
  atRiskList: [
    {
      id: "res-1",
      companyName: "Kashkadarya Software Systems LLC",
      district: "Qarshi",
      primaryReason: "Quarterly export revenue declined by 24%",
      revenueChangePct: -24.0,
      employeeChangePct: -8.0,
      exportChangePct: -24.0,
      daysInactive: 12,
      healthScore: 42,
      riskLevel: "CRITICAL"
    },
    {
      id: "res-2",
      companyName: "Shahrisabz Tech Innovations",
      district: "Shahrisabz",
      primaryReason: "Headcount down 17%, no export activity recorded",
      revenueChangePct: -15.0,
      employeeChangePct: -17.0,
      exportChangePct: -30.0,
      daysInactive: 21,
      healthScore: 48,
      riskLevel: "HIGH"
    },
    {
      id: "res-3",
      companyName: "Nasaf Soft Solutions",
      district: "Qarshi",
      primaryReason: "No quarterly reporting submit for 31 consecutive days",
      revenueChangePct: -5.0,
      employeeChangePct: 0.0,
      exportChangePct: -18.0,
      daysInactive: 31,
      healthScore: 52,
      riskLevel: "HIGH"
    },
    {
      id: "res-4",
      companyName: "Kitob Cybernetics & AI Labs",
      district: "Kitob",
      primaryReason: "Export revenue drop of 19% vs previous quarter",
      revenueChangePct: -12.0,
      employeeChangePct: -4.0,
      exportChangePct: -19.0,
      daysInactive: 14,
      healthScore: 58,
      riskLevel: "MEDIUM"
    }
  ]
};

export const INTERNATIONAL_PIPELINE_DATA: InternationalPipelineData = {
  prospects: 127,
  contacted: 63,
  meetings: 27,
  negotiations: 11,
  loisMous: 4,
  converted: 2,
  pipelineValueUSD: 3800000, // $3,800,000
  remainingExportTargetUSD: 2900000, // $5.0M - $2.1M = $2.9M
  pipelineCoveragePct: 131, // ($3.8M / $2.9M) * 100
  marketBreakdown: [
    { region: "USA & Canada", prospectsCount: 42, valueUSD: 1650000, sharePct: 43.4 },
    { region: "European Union & UK", prospectsCount: 35, valueUSD: 1100000, sharePct: 28.9 },
    { region: "Middle East (GCC)", prospectsCount: 22, valueUSD: 600000, sharePct: 15.8 },
    { region: "Central Asia & CIS", prospectsCount: 18, valueUSD: 300000, sharePct: 7.9 },
    { region: "Other International", prospectsCount: 10, valueUSD: 150000, sharePct: 4.0 }
  ]
};

export const REGIONAL_PERFORMANCE_DATA: RegionalDistrictPerformance[] = [
  {
    districtId: "qarshi",
    districtName: "Qarshi",
    residentsActual: 38,
    residentsTarget: 40,
    jobsActual: 412,
    jobsTarget: 500,
    exportActualUSD: 1480000,
    exportTargetUSD: 1800000,
    status: "ON_TRACK"
  },
  {
    districtId: "shahrisabz",
    districtName: "Shahrisabz",
    residentsActual: 14,
    residentsTarget: 16,
    jobsActual: 120,
    jobsTarget: 150,
    exportActualUSD: 310000,
    exportTargetUSD: 550000,
    status: "ON_TRACK"
  },
  {
    districtId: "kitob",
    districtName: "Kitob",
    residentsActual: 8,
    residentsTarget: 12,
    jobsActual: 65,
    jobsTarget: 100,
    exportActualUSD: 180000,
    exportTargetUSD: 300000,
    status: "AT_RISK"
  },
  {
    districtId: "koson",
    districtName: "Koson",
    residentsActual: 4,
    residentsTarget: 8,
    jobsActual: 40,
    jobsTarget: 80,
    exportActualUSD: 85000,
    exportTargetUSD: 200000,
    status: "BEHIND"
  },
  {
    districtId: "muborak",
    districtName: "Muborak",
    residentsActual: 3,
    residentsTarget: 5,
    jobsActual: 35,
    jobsTarget: 50,
    exportActualUSD: 45000,
    exportTargetUSD: 150000,
    status: "AT_RISK"
  },
  {
    districtId: "guzor",
    districtName: "Gʻuzor",
    residentsActual: 2,
    residentsTarget: 4,
    jobsActual: 20,
    jobsTarget: 40,
    exportActualUSD: 0,
    exportTargetUSD: 100000,
    status: "BEHIND"
  },
  {
    districtId: "chiroqchi",
    districtName: "Chiroqchi",
    residentsActual: 2,
    residentsTarget: 4,
    jobsActual: 18,
    jobsTarget: 35,
    exportActualUSD: 0,
    exportTargetUSD: 50000,
    status: "BEHIND"
  },
  {
    districtId: "dehqonobod",
    districtName: "Dehqonobod",
    residentsActual: 1,
    residentsTarget: 3,
    jobsActual: 12,
    jobsTarget: 25,
    exportActualUSD: 0,
    exportTargetUSD: 40000,
    status: "BEHIND"
  },
  {
    districtId: "kasbi",
    districtName: "Kasbi",
    residentsActual: 1,
    residentsTarget: 3,
    jobsActual: 10,
    jobsTarget: 25,
    exportActualUSD: 0,
    exportTargetUSD: 40000,
    status: "BEHIND"
  },
  {
    districtId: "mirishkor",
    districtName: "Mirishkor",
    residentsActual: 1,
    residentsTarget: 2,
    jobsActual: 8,
    jobsTarget: 20,
    exportActualUSD: 0,
    exportTargetUSD: 30000,
    status: "BEHIND"
  },
  {
    districtId: "nishon",
    districtName: "Nishon",
    residentsActual: 1,
    residentsTarget: 3,
    jobsActual: 12,
    jobsTarget: 25,
    exportActualUSD: 0,
    exportTargetUSD: 40000,
    status: "BEHIND"
  },
  {
    districtId: "qamashi",
    districtName: "Qamashi",
    residentsActual: 2,
    residentsTarget: 4,
    jobsActual: 16,
    jobsTarget: 35,
    exportActualUSD: 0,
    exportTargetUSD: 50000,
    status: "BEHIND"
  },
  {
    districtId: "qarshi-district",
    districtName: "Qarshi District",
    residentsActual: 2,
    residentsTarget: 4,
    jobsActual: 22,
    jobsTarget: 40,
    exportActualUSD: 0,
    exportTargetUSD: 60000,
    status: "BEHIND"
  },
  {
    districtId: "yakkabog",
    districtName: "Yakkabogʻ",
    residentsActual: 2,
    residentsTarget: 4,
    jobsActual: 20,
    jobsTarget: 35,
    exportActualUSD: 0,
    exportTargetUSD: 50000,
    status: "BEHIND"
  }
];

export const UPCOMING_ACTIONS_DATA: ExecutiveActionItem[] = [
  {
    id: "act-1",
    date: "2026-08-12",
    displayDate: "12 AUG",
    title: "International BPO Prospecting Meeting (US Client - $450K potential)",
    category: "MEETING",
    priority: "HIGH",
    targetModule: "crm",
    actionLabel: "Open CRM"
  },
  {
    id: "act-2",
    date: "2026-08-14",
    displayDate: "14 AUG",
    title: "Quarterly Resident Audit & Compliance Check (7 At-Risk Residents)",
    category: "AUDIT",
    priority: "HIGH",
    targetModule: "residents",
    actionLabel: "View Residents"
  },
  {
    id: "act-3",
    date: "2026-08-18",
    displayDate: "18 AUG",
    title: "ICTWEEK Uzbekistan 2026 Regional IT Delegation Preparation",
    category: "EVENT",
    priority: "MEDIUM",
    targetModule: "events",
    actionLabel: "Event Plan"
  },
  {
    id: "act-4",
    date: "2026-08-21",
    displayDate: "21 AUG",
    title: "Kashkadarya Venture Capital Pitch Day ($500K Target)",
    category: "INVESTMENT",
    priority: "HIGH",
    targetModule: "startups",
    actionLabel: "Pitch Deck"
  },
  {
    id: "act-5",
    date: "2026-08-26",
    displayDate: "26 AUG",
    title: "Incubation Acceleration Batch #4 Final Startup Evaluation",
    category: "STARTUP",
    priority: "MEDIUM",
    targetModule: "startups",
    actionLabel: "Review Teams"
  }
];

export const EXECUTIVE_BRIEF_DATA: ExecutiveBrief = {
  date: "2026-08-08",
  overallStatus: "NEEDS_ATTENTION",
  bulletPoints: [
    {
      type: "POSITIVE",
      text: "Resident company acquisition is strong at 69% of annual goal (+24 of 35 companies)."
    },
    {
      type: "CRITICAL",
      text: "IT export volume ($2.1M) is $1.5M behind Q3 expected trajectory towards $5.0M annual target."
    },
    {
      type: "WARNING",
      text: "7 residents exhibit revenue/headcount declines requiring immediate advisory intervention."
    },
    {
      type: "POSITIVE",
      text: "International CRM pipeline holds $3.8M qualified deals (131% target coverage)."
    }
  ],
  primaryActionPriority: "Focus on closing top 3 international BPO negotiations ($1.2M total) and auditing 7 at-risk resident companies."
};
