/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StatusType = "ON_TRACK" | "AT_RISK" | "BEHIND" | "COMPLETED";

export interface StrategicKPI {
  id: string;
  nameKey: string;
  defaultName: string;
  category: "residents" | "export" | "revenue" | "jobs" | "startups" | "investment" | "events" | "space";
  unit: "count" | "currency_usd" | "currency_uzs_b" | "sqm";
  
  // Annual & Quarterly targets
  annualTarget: number;
  quarterlyTargets: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  
  // Current performance
  actual: number;
  previousActual: number;
  
  // Weight in overall strategy health score (0.0 to 1.0)
  healthWeight: number;
  
  // Descriptions
  actionNote?: string;

  // Set to false when the underlying real-world data has not been reported/imported yet
  // (the KPI should render "No data reported" instead of a computed number/status).
  dataAvailable?: boolean;
}

// A persisted admin override for a KPI's annual/quarterly target values.
// Stored server-side as its own "kpiTargets" collection (id === StrategicKPI.id)
// so the hand-entered 2026 plan in data/kpiData.ts stays the shipped baseline,
// while an admin's edits layer on top of it without touching source code.
export interface KpiTargetOverride {
  id: string;
  annualTarget: number;
  quarterlyTargets: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  updatedAt?: string;
  updatedBy?: string;
}

export interface CalculatedKPI extends StrategicKPI {
  achievementPercentage: number;
  periodTarget: number; // Target for selected period (e.g. Q3 YTD)
  trajectoryExpected: number;
  gap: number;
  requiredVelocity: number;
  trendPercentage: number;
  forecast: number;
  forecastGap: number;
  status: StatusType;
}

export interface ExecutiveAlert {
  id: string;
  severity: "CRITICAL" | "AT_RISK" | "FOLLOW_UP" | "INFO";
  titleKey: string;
  defaultTitle: string;
  explanation: string;
  metric: string;
  recommendedAction: string;
  targetModule: "residents" | "crm" | "startups" | "analytics" | "events";
  linkText: string;
  timestamp: string;
}

export interface AtRiskResident {
  id: string;
  companyName: string;
  district: string;
  primaryReason: string;
  revenueChangePct: number;
  employeeChangePct: number;
  exportChangePct: number;
  daysInactive: number;
  healthScore: number; // 0 - 100
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
}

export interface ResidentHealthSummary {
  totalResidents: number;
  healthyCount: number;
  watchCount: number;
  atRiskCount: number;
  averageHealthScore: number;
  atRiskList: AtRiskResident[];
}

export interface InternationalPipelineData {
  prospects: number;
  contacted: number;
  meetings: number;
  negotiations: number;
  loisMous: number;
  converted: number;
  pipelineValueUSD: number;
  remainingExportTargetUSD: number;
  pipelineCoveragePct: number; // (Pipeline value / Remaining target) * 100
  // False when no deal-value figures have been recorded for the pipeline yet.
  pipelineValueDataAvailable?: boolean;
  marketBreakdown: {
    region: string;
    prospectsCount: number;
    valueUSD: number;
    sharePct: number;
    valueDataAvailable?: boolean;
  }[];
}

export interface RegionalDistrictPerformance {
  districtId: string;
  districtName: string;
  residentsActual: number;
  residentsTarget: number;
  jobsActual: number;
  jobsTarget: number;
  exportActualUSD: number; // in USD
  exportTargetUSD: number;
  exportDataAvailable?: boolean;
  status: StatusType;
}

export interface ExecutiveActionItem {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  category: "MEETING" | "AUDIT" | "EVENT" | "INVESTMENT" | "STARTUP" | "APPROVAL";
  priority: "HIGH" | "MEDIUM" | "NORMAL";
  targetModule?: string;
  actionLabel?: string;
}

export interface ExecutiveBrief {
  date: string;
  overallStatus: "ON_TRACK" | "NEEDS_ATTENTION" | "CRITICAL";
  bulletPoints: {
    type: "POSITIVE" | "WARNING" | "CRITICAL" | "INFO";
    text: string;
  }[];
  primaryActionPriority: string;
}
