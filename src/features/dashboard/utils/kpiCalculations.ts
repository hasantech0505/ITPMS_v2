/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrategicKPI, CalculatedKPI, StatusType } from "../types/kpiTypes";

export type PeriodType = "q1" | "q2" | "q3" | "q4" | "ytd";

/**
 * Format KPI values for UI display cleanly with zero floating point precision artifacts
 */
export function formatKpiValue(
  value: number,
  unit: StrategicKPI["unit"],
  options?: { compact?: boolean; precision?: number }
): string {
  if (isNaN(value) || value === null || value === undefined) {
    return "0";
  }

  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const sign = isNegative ? "−" : "";

  if (unit === "currency_usd") {
    if (absVal >= 1_000_000) {
      const millions = absVal / 1_000_000;
      // Strip trailing .0 if integer millions e.g. 5.0 -> 5.0M or 5M
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return `${sign}$${formatted}M`;
    }
    if (absVal >= 1_000) {
      const thousands = absVal / 1_000;
      const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
      return `${sign}$${formatted}K`;
    }
    return `${sign}$${Math.round(absVal).toLocaleString()}`;
  }

  if (unit === "currency_uzs_b") {
    // Value is already in Billions of UZS (e.g. 59.3, 68, 90, 8.7)
    // Round to max 1 decimal place to eliminate floating point artifacts like -8.700000000000003
    const rounded = Math.round(absVal * 10) / 10;
    const formatted = rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1);
    return `${sign}${formatted}B UZS`;
  }

  if (unit === "sqm") {
    const rounded = Math.round(absVal);
    return `${sign}${rounded.toLocaleString()} m²`;
  }

  // Count / integer
  const rounded = Math.round(absVal);
  return `${sign}${rounded.toLocaleString()}`;
}

/**
 * Format Gap cleanly with proper sign (e.g. "−$1.5M", "+2", "−8.7B UZS", "−189")
 */
export function formatKpiGap(gap: number, unit: StrategicKPI["unit"]): string {
  // Eliminate floating point noise
  const cleanGap = Math.round(gap * 100) / 100;
  if (Math.abs(cleanGap) < 0.001) {
    return "0";
  }
  if (cleanGap < 0) {
    return `−${formatKpiValue(Math.abs(cleanGap), unit)}`;
  }
  return `+${formatKpiValue(cleanGap, unit)}`;
}

/**
 * Format percentage cleanly without float artifacts (e.g. 92%, 58%, 100%)
 */
export function formatPercentage(pct: number): string {
  if (isNaN(pct) || pct === null || pct === undefined) return "0%";
  return `${Math.round(pct)}%`;
}

/**
 * Calculate required monthly pace to achieve annual target from current period
 */
export function calculateRequiredPace(
  kpi: StrategicKPI,
  period: PeriodType = "ytd"
): {
  requiredRemaining: number;
  remainingMonths: number;
  pacePerMonth: number;
  displayPace: string;
} {
  const requiredRemaining = Math.max(0, kpi.annualTarget - kpi.actual);
  
  // Determine remaining months in 2026 based on chosen checkpoint
  let remainingMonths = 4; // Default Q3 / YTD (Aug-Dec = 4 months)
  if (period === "q1") remainingMonths = 9;
  else if (period === "q2") remainingMonths = 6;
  else if (period === "q3" || period === "ytd") remainingMonths = 4;
  else if (period === "q4") remainingMonths = 1;

  if (requiredRemaining <= 0) {
    return {
      requiredRemaining: 0,
      remainingMonths,
      pacePerMonth: 0,
      displayPace: "Annual target reached"
    };
  }

  const rawPace = requiredRemaining / remainingMonths;
  let displayPace = "";

  if (kpi.unit === "currency_usd") {
    displayPace = `${formatKpiValue(rawPace, "currency_usd")}/mo`;
  } else if (kpi.unit === "currency_uzs_b") {
    const paceUZS = Math.round(rawPace * 10) / 10;
    const formatted = paceUZS % 1 === 0 ? paceUZS.toFixed(0) : paceUZS.toFixed(1);
    displayPace = `${formatted}B UZS/mo`;
  } else if (kpi.unit === "sqm") {
    displayPace = `${Math.round(rawPace).toLocaleString()} m²/mo`;
  } else {
    // Count / integer
    if (rawPace < 10 && rawPace % 1 !== 0) {
      displayPace = `+${rawPace.toFixed(1)}/mo`;
    } else {
      displayPace = `+${Math.round(rawPace).toLocaleString()}/mo`;
    }
  }

  return {
    requiredRemaining,
    remainingMonths,
    pacePerMonth: rawPace,
    displayPace
  };
}

/**
 * Calculates dynamic trajectory, target gap, required velocity, forecast, and status
 */
export function calculateKpiMetrics(
  kpi: StrategicKPI,
  period: PeriodType = "ytd"
): CalculatedKPI {
  // Determine expected trajectory target for chosen period
  let periodTarget = kpi.annualTarget;
  if (period === "q1") periodTarget = kpi.quarterlyTargets.q1;
  else if (period === "q2") periodTarget = kpi.quarterlyTargets.q2;
  else if (period === "q3" || period === "ytd") periodTarget = kpi.quarterlyTargets.q3;
  else if (period === "q4") periodTarget = kpi.quarterlyTargets.q4;

  const trajectoryExpected = periodTarget;
  const achievementPercentage = Math.round((kpi.actual / kpi.annualTarget) * 100);
  const trajectoryAchievementPct = Math.round((kpi.actual / trajectoryExpected) * 100);

  // Gap against expected trajectory at this point in the year (clean rounded)
  const rawGap = kpi.actual - trajectoryExpected;
  const gap = Math.round(rawGap * 100) / 100;
  
  // Remaining to annual target
  const requiredToTarget = Math.max(0, kpi.annualTarget - kpi.actual);
  
  // Required monthly or quarterly velocity (e.g. 1 quarter remaining)
  const requiredVelocity = Number((requiredToTarget / 1).toFixed(1));

  // Trend vs previous period
  const trendPercentage = kpi.previousActual > 0
    ? Math.round(((kpi.actual - kpi.previousActual) / kpi.previousActual) * 100)
    : 100;

  // Linear / trend-projected year-end forecast
  // Projected = Actual + (Actual / 3 quarters elapsed) * 1 quarter remaining
  const runRateQuarterly = kpi.actual / 3;
  const forecast = kpi.dataAvailable === false ? 0 : Math.round((kpi.actual + runRateQuarterly) * 10) / 10;

  const rawForecastGap = forecast - kpi.annualTarget;
  const forecastGap = Math.round(rawForecastGap * 100) / 100;

  // Determine status objectively
  let status: StatusType = "ON_TRACK";
  if (achievementPercentage >= 100) {
    status = "COMPLETED";
  } else if (trajectoryAchievementPct >= 90) {
    status = "ON_TRACK";
  } else if (trajectoryAchievementPct >= 70) {
    status = "AT_RISK";
  } else {
    status = "BEHIND";
  }

  return {
    ...kpi,
    achievementPercentage,
    periodTarget,
    trajectoryExpected,
    gap,
    requiredVelocity,
    trendPercentage,
    forecast,
    forecastGap,
    status
  };
}

/**
 * Calculates overall Strategy Health Score (0% - 100%)
 * Uses configurable weighting across categories
 */
export function calculateStrategyHealthScore(calculatedKpis: CalculatedKPI[]): {
  overallScorePct: number;
  status: StatusType;
  trendVsPreviousPct: number;
  categoryBreakdown: { category: string; label: string; scorePct: number }[];
} {
  let totalWeight = 0;
  let weightedScoreSum = 0;

  calculatedKpis.forEach((kpi) => {
    // Skip KPIs whose real-world data hasn't been reported/imported yet —
    // they should not silently drag the weighted health score toward zero.
    if (kpi.dataAvailable === false) return;

    // Score ratio capped at 100% for health weighting
    const ratio = Math.min(1.2, kpi.actual / kpi.trajectoryExpected);
    const score = Math.min(100, Math.round(ratio * 100));
    
    weightedScoreSum += score * kpi.healthWeight;
    totalWeight += kpi.healthWeight;
  });

  const overallScorePct = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 0;

  // Weighted average of each reported KPI's own trend vs its previous period —
  // computed from real actual/previousActual values rather than a fixed figure.
  let trendWeightSum = 0;
  let trendWeightedSum = 0;
  calculatedKpis.forEach((kpi) => {
    if (kpi.dataAvailable === false) return;
    trendWeightedSum += kpi.trendPercentage * kpi.healthWeight;
    trendWeightSum += kpi.healthWeight;
  });
  const trendVsPreviousPct = trendWeightSum > 0 ? Math.round((trendWeightedSum / trendWeightSum) * 10) / 10 : 0;

  let status: StatusType = "ON_TRACK";
  if (overallScorePct >= 85) status = "ON_TRACK";
  else if (overallScorePct >= 65) status = "AT_RISK";
  else status = "BEHIND";

  // Category breakdowns
  const categoryMap: Record<string, { label: string; totalPct: number; count: number }> = {
    residents: { label: "Residents & Growth", totalPct: 0, count: 0 },
    export: { label: "IT Export & Global", totalPct: 0, count: 0 },
    revenue: { label: "Domestic Services", totalPct: 0, count: 0 },
    jobs: { label: "Job Creation", totalPct: 0, count: 0 },
    startups: { label: "Startups & Investment", totalPct: 0, count: 0 },
    space: { label: "Infrastructure", totalPct: 0, count: 0 }
  };

  calculatedKpis.forEach((kpi) => {
    if (kpi.dataAvailable === false) return;
    const cat = categoryMap[kpi.category] || { label: kpi.category, totalPct: 0, count: 0 };
    const pct = Math.min(100, Math.round((kpi.actual / kpi.trajectoryExpected) * 100));
    cat.totalPct += pct;
    cat.count += 1;
    categoryMap[kpi.category] = cat;
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .filter(([_, data]) => data.count > 0)
    .map(([catKey, data]) => ({
      category: catKey,
      label: data.label,
      scorePct: Math.round(data.totalPct / data.count)
    }));

  return {
    overallScorePct,
    status,
    trendVsPreviousPct,
    categoryBreakdown
  };
}
