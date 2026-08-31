/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Startup, StartupHealthStatus } from "../../../types";

/**
 * Computes health score (0-100), health status, and explicit reason for a startup
 */
export function calculateStartupHealth(startup: Startup): {
  score: number;
  status: StartupHealthStatus;
  reason: string;
} {
  // If explicitly provided, respect existing score with fallback calculation
  if (startup.healthScore !== undefined && startup.healthStatus && startup.healthReason) {
    return {
      score: startup.healthScore,
      status: startup.healthStatus,
      reason: startup.healthReason
    };
  }

  // Be honest when we simply have no financial telemetry for this startup
  // (common for cohorts imported from a roster that only tracks name/stage/industry) —
  // show "no data reported" rather than a generic mid-range score that looks like
  // a real (if mediocre) assessment.
  const mrrSignal = startup.mrr ?? startup.kpis?.mrr ?? 0;
  const hasFinancialSignal =
    mrrSignal > 0 ||
    startup.revenue > 0 ||
    startup.fundingRaised > 0 ||
    (startup.revenueGrowthPct !== undefined) ||
    (startup.milestones && startup.milestones.length > 0) ||
    (startup.kpis?.churnRate !== undefined);

  if (!hasFinancialSignal) {
    return {
      score: 0,
      status: "NO_DATA",
      reason: "No financial data reported for this startup yet."
    };
  }

  let score = 50;
  const reasons: string[] = [];

  // 1. Revenue & MRR
  const mrr = startup.mrr ?? startup.kpis?.mrr ?? 0;
  if (mrr > 20000 || startup.revenue > 300000) {
    score += 15;
    reasons.push("Strong recurring revenue performance");
  } else if (mrr > 3000 || startup.revenue > 50000) {
    score += 10;
    reasons.push("Active monetization validated");
  } else if (startup.stage === "GROWTH" || startup.stage === "SCALE") {
    score -= 15;
    reasons.push("Low MRR for current growth stage");
  }

  // 2. Revenue & Customer Growth
  if (startup.revenueGrowthPct !== undefined && startup.revenueGrowthPct > 20) {
    score += 10;
    reasons.push(`Rapid revenue growth (+${startup.revenueGrowthPct}%)`);
  } else if (startup.revenueGrowthPct !== undefined && startup.revenueGrowthPct === 0 && startup.stage !== "IDEA") {
    score -= 15;
    reasons.push("Zero revenue growth in recent periods");
  }

  // 3. Milestone Completion
  if (startup.milestones && startup.milestones.length > 0) {
    const completedCount = startup.milestones.filter(m => m.completed).length;
    const completionRate = completedCount / startup.milestones.length;
    if (completionRate >= 0.7) {
      score += 10;
      reasons.push("Key strategic milestones achieved");
    } else if (startup.milestones.some(m => m.status === "DELAYED")) {
      score -= 10;
      reasons.push("Delayed regulatory or product milestones");
    }
  }

  // 4. Funding & Runway
  if (startup.fundingRaised > 100000) {
    score += 10;
    reasons.push("Secured institutional / angel funding");
  }

  // 5. Churn rate check
  const churn = startup.kpis?.churnRate ?? 0;
  if (churn > 5) {
    score -= 10;
    reasons.push("Elevated customer churn rate");
  } else if (churn > 0 && churn <= 1.5) {
    score += 5;
    reasons.push("Exceptional customer retention");
  }

  // Clamp 0-100
  const finalScore = Math.max(10, Math.min(99, score));
  let status: StartupHealthStatus = "HEALTHY";
  if (finalScore < 45) {
    status = "AT_RISK";
  } else if (finalScore < 70) {
    status = "NEEDS_ATTENTION";
  }

  const reason = reasons.length > 0 ? reasons.join(". ") + "." : "Standard incubation progress.";

  return {
    score: finalScore,
    status,
    reason
  };
}

/**
 * Calculates investment readiness score (0-100), status, main gap, and recommendation
 */
export function calculateInvestmentReadiness(startup: Startup): {
  score: number;
  status: "Not Ready" | "Early Stage" | "Investor Ready" | "High Potential";
  mainGap: string;
  recommendedAction: string;
} {
  if (startup.investmentReadinessScore !== undefined && startup.investmentReadinessStatus) {
    return {
      score: startup.investmentReadinessScore,
      status: startup.investmentReadinessStatus,
      mainGap: startup.investmentMainGap || "Refine institutional pitch deck & unit economics.",
      recommendedAction: startup.investmentRecommendedAction || "Schedule pitch review session with IT Park investor network."
    };
  }

  let score = 30;
  if (startup.stage === "SCALE" || startup.stage === "GRADUATED") score += 35;
  else if (startup.stage === "GROWTH") score += 25;
  else if (startup.stage === "MVP" || startup.stage === "EARLY_REVENUE") score += 15;

  const mrr = startup.mrr ?? startup.kpis?.mrr ?? 0;
  if (mrr > 20000) score += 20;
  else if (mrr > 5000) score += 10;

  if (startup.fundingRaised > 0) score += 10;
  if (startup.employees >= 10) score += 5;

  score = Math.max(15, Math.min(95, score));

  let status: "Not Ready" | "Early Stage" | "Investor Ready" | "High Potential" = "Early Stage";
  let mainGap = "Financial model validation and market expansion roadmap";
  let recommendedAction = "Connect with IT Park financial mentors to prepare investor data room";

  if (score >= 80) {
    status = "Investor Ready";
    mainGap = "Cross-border corporate structure and overseas tax compliance";
    recommendedAction = "Present to IT Park Venture Capital partners & regional angel network";
  } else if (score >= 60) {
    status = "High Potential";
    mainGap = "Scaling commercial sales pipeline and customer acquisition unit economics";
    recommendedAction = "Pair with enterprise B2B sales mentor";
  } else if (score < 40) {
    status = "Not Ready";
    mainGap = "Product-market fit validation and initial paying customer traction";
    recommendedAction = "Focus on customer discovery interviews and minimum viable prototype";
  }

  return { score, status, mainGap, recommendedAction };
}

/**
 * Standardizes startup lifecycle stage names
 */
export function normalizeStage(stage: string): string {
  const s = stage?.toUpperCase() || "IDEA";
  if (s === "IDEATION") return "IDEA";
  if (s === "EARLY_TRACTION") return "EARLY_REVENUE";
  return s;
}

export const LIFECYCLE_STAGES = [
  { id: "IDEA", label: "Idea", desc: "Concept & Problem Validation" },
  { id: "PRE_MVP", label: "Pre-MVP", desc: "Prototype & Architecture" },
  { id: "MVP", label: "MVP", desc: "Beta Launch & Initial Users" },
  { id: "EARLY_REVENUE", label: "Early Revenue", desc: "First Paying Customers & Traction" },
  { id: "GROWTH", label: "Growth", desc: "Scaling MRR & Market Share" },
  { id: "SCALE", label: "Scale", desc: "Regional Expansion & Series Funding" },
  { id: "GRADUATED", label: "Graduated", desc: "IT Park Resident / Ecosystem Alumni" }
] as const;


/**
 * Shared visual treatment for a startup health status, so every screen that
 * renders the health badge (table, grid, 360 modal) stays in sync when a new
 * status is added.
 */
export function getHealthBadgeMeta(status: StartupHealthStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case "HEALTHY":
      return { label: "Healthy", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotClass: "bg-emerald-500" };
    case "NEEDS_ATTENTION":
      return { label: "Attention", badgeClass: "bg-amber-50 text-amber-700 border border-amber-200", dotClass: "bg-amber-500" };
    case "AT_RISK":
      return { label: "At Risk", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200", dotClass: "bg-rose-500" };
    case "NO_DATA":
    default:
      return { label: "No Data Reported", badgeClass: "bg-slate-100 text-slate-500 border border-slate-200", dotClass: "bg-slate-400" };
  }
}
