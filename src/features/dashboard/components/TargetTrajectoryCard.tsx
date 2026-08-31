/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Clock,
  Compass
} from "lucide-react";
import { CalculatedKPI, StatusType } from "../types/kpiTypes";
import { 
  formatKpiValue, 
  formatKpiGap, 
  formatPercentage, 
  calculateRequiredPace, 
  PeriodType 
} from "../utils/kpiCalculations";

interface TargetTrajectoryCardProps {
  calculatedKpis: CalculatedKPI[];
  selectedPeriod?: PeriodType;
  t: (key: string, fallback?: string) => string;
}

export default function TargetTrajectoryCard({ 
  calculatedKpis, 
  selectedPeriod = "ytd", 
  t 
}: TargetTrajectoryCardProps) {
  // Select the 4 core strategic executive KPIs:
  // 1. New Residents, 2. IT Export, 3. IT Services Volume, 4. New Jobs
  const targetIds = ["new_residents", "export_volume", "services_volume", "new_jobs"];
  
  const trajectoryKpis = targetIds
    .map((id) => calculatedKpis.find((k) => k.id === id))
    .filter((k): k is CalculatedKPI => Boolean(k));

  // Determine current checkpoint label (e.g., "Q3 Checkpoint" or "Q1 Checkpoint")
  const getCheckpointLabel = () => {
    switch (selectedPeriod) {
      case "q1":
        return t("Q1 Checkpoint");
      case "q2":
        return t("Q2 Checkpoint");
      case "q3":
      case "ytd":
        return t("Q3 Checkpoint");
      case "q4":
        return t("Q4 Checkpoint");
      default:
        return t("Q3 Checkpoint");
    }
  };

  const checkpointLabel = getCheckpointLabel();

  // Status Badge Component with semantic text + icon + accessible contrast
  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{t("ACHIEVED", "ACHIEVED")}</span>
          </span>
        );
      case "ON_TRACK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{t("ON TRACK", "ON TRACK")}</span>
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>{t("AT RISK", "AT RISK")}</span>
          </span>
        );
      case "BEHIND":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-50 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
            <span>{t("BEHIND", "BEHIND")}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Strategic Milestones")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("2026 Executive Checkpoint Analysis")}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 shrink-0" />
            {t("executiveDashboard.performanceVsTargetTitle", "PERFORMANCE VS TARGET")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            {t(
              "executiveDashboard.performanceVsTargetSubtitle",
              "Actual performance compared with the current-period checkpoint and annual target."
            )}
          </p>
        </div>

        <div className="self-start sm:self-center flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-semibold shrink-0">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t("Active Period")}: <strong className="text-slate-900">{checkpointLabel}</strong></span>
        </div>
      </div>

      {/* Responsive KPI Grid: 4 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {trajectoryKpis.map((kpi) => {
          const isGapNegative = kpi.gap < 0;
          const pctOfCheckpoint = Math.round((kpi.actual / kpi.trajectoryExpected) * 100);
          const paceInfo = calculateRequiredPace(kpi, selectedPeriod);
          const hasForecast = kpi.id === "export_volume" || (kpi.forecast && kpi.forecast !== kpi.actual);
          const expectedForecastGap = kpi.forecast - kpi.annualTarget;

          if (kpi.dataAvailable === false) {
            return (
              <div
                key={kpi.id}
                className="rounded-2xl border p-4 sm:p-5 flex flex-col justify-between bg-slate-50/60 border-slate-200"
              >
                <div className="flex items-start justify-between gap-2 min-h-[2.25rem]">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
                    {t(kpi.nameKey, kpi.defaultName)}
                  </h3>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-slate-100 text-slate-500 border border-slate-200">
                    {t("NO DATA")}
                  </span>
                </div>
                <div className="mt-3.5 p-3 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs">
                  <span className="text-sm font-black text-slate-400">{t("No data reported")}</span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t("Target")}: {formatKpiValue(kpi.annualTarget, kpi.unit)} — {t("source data not yet imported")}.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={kpi.id}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-sm ${
                kpi.status === "BEHIND"
                  ? "bg-rose-50/25 border-rose-200/90 hover:border-rose-300"
                  : kpi.status === "AT_RISK"
                  ? "bg-amber-50/25 border-amber-200/90 hover:border-amber-300"
                  : kpi.status === "COMPLETED"
                  ? "bg-blue-50/25 border-blue-200/90 hover:border-blue-300"
                  : "bg-emerald-50/25 border-emerald-200/90 hover:border-emerald-300"
              }`}
            >
              {/* Header: Name + Status Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 min-h-[2.25rem]">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-2">
                    {t(kpi.nameKey, kpi.defaultName)}
                  </h3>
                  <div className="shrink-0">{renderStatusBadge(kpi.status)}</div>
                </div>

                {/* Primary Metric: Actual YTD & Annual Target */}
                <div className="mt-3.5 p-3 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">
                      {t("Actual YTD")}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {t("Target")}: <strong className="text-slate-700">{formatKpiValue(kpi.annualTarget, kpi.unit)}</strong>
                    </span>
                  </div>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                      {formatKpiValue(kpi.actual, kpi.unit)}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600">
                      ({kpi.achievementPercentage}% {t("of Target")})
                    </span>
                  </div>

                  {/* Progress Bar towards annual target */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        kpi.status === "COMPLETED"
                          ? "bg-blue-600"
                          : kpi.status === "ON_TRACK"
                          ? "bg-emerald-500"
                          : kpi.status === "AT_RISK"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, kpi.achievementPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Checkpoint & Gap Comparison Breakdown */}
                <div className="mt-3 space-y-2 text-xs">
                  {/* Current Checkpoint */}
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-medium text-slate-500">{checkpointLabel}:</span>{/* already translated via getCheckpointLabel */}
                    <span className="font-bold text-slate-800">
                      {formatKpiValue(kpi.trajectoryExpected, kpi.unit)}
                    </span>
                  </div>

                  {/* Milestone Gap */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                    <span className="font-medium text-slate-500">{t("Gap")}:</span>
                    <span
                      className={`font-black text-xs ${
                        isGapNegative ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {formatKpiGap(kpi.gap, kpi.unit)}
                    </span>
                  </div>

                  {/* Checkpoint Achievement */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                    <span className="font-medium text-slate-500">{t("Checkpoint achievement")}:</span>
                    <span
                      className={`font-extrabold ${
                        pctOfCheckpoint >= 90
                          ? "text-emerald-700"
                          : pctOfCheckpoint >= 70
                          ? "text-amber-700"
                          : "text-rose-700"
                      }`}
                    >
                      {formatPercentage(pctOfCheckpoint)} {t("of checkpoint")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer: Required Pace & Optional Real Forecast */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                {/* Required Pace */}
                {paceInfo.requiredRemaining > 0 && (
                  <div className="flex items-center justify-between text-[11px] bg-slate-100/80 px-2.5 py-1.5 rounded-lg text-slate-700">
                    <span className="font-semibold text-slate-500">{t("Required pace")}:</span>
                    <span className="font-black text-slate-900 font-mono">
                      {paceInfo.displayPace}
                    </span>
                  </div>
                )}

                {/* Real Forecast if available */}
                {hasForecast && (
                  <div className="flex items-center justify-between text-[11px] bg-indigo-50/70 border border-indigo-100 px-2.5 py-1.5 rounded-lg text-indigo-900">
                    <span className="font-semibold text-indigo-700">
                      {t("Forecast")}: <strong className="text-indigo-950 font-black">{formatKpiValue(kpi.forecast, kpi.unit)}</strong>
                    </span>
                    <span className="font-black text-rose-600 font-mono">
                      {t("Expected gap")}: {formatKpiGap(expectedForecastGap, kpi.unit)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
