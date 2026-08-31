/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Globe2, 
  Users, 
  Building2, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { CalculatedKPI, StatusType } from "../types/kpiTypes";
import { formatKpiValue } from "../utils/kpiCalculations";

interface ExecutiveKpiStripProps {
  calculatedKpis: CalculatedKPI[];
  strategyHealthScore: number;
  strategyHealthStatus: StatusType;
  strategyHealthTrendPct: number;
  atRiskResidentCount: number;
  totalResidentCount: number;
  pipelineValueUSD: number;
  pipelineCoveragePct: number;
  pipelineProspects: number;
  onNavigateToModule: (tab: string) => void;
  t: (key: string, fallback?: string) => string;
}

export default function ExecutiveKpiStrip({
  calculatedKpis,
  strategyHealthScore,
  strategyHealthStatus,
  strategyHealthTrendPct,
  atRiskResidentCount,
  totalResidentCount,
  pipelineValueUSD,
  pipelineCoveragePct,
  pipelineProspects,
  onNavigateToModule,
  t
}: ExecutiveKpiStripProps) {
  // Extract key strategic metrics from calculated list
  const exportKpi = calculatedKpis.find((k) => k.id === "export_volume");
  const residentKpi = calculatedKpis.find((k) => k.id === "new_residents");
  const jobsKpi = calculatedKpis.find((k) => k.id === "new_jobs");

  // Status Badge Colors Helper
  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            {t("COMPLETED")}
          </span>
        );
      case "ON_TRACK":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t("ON TRACK")}
          </span>
        );
      case "AT_RISK":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            {t("AT RISK")}
          </span>
        );
      case "BEHIND":
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            {t("BEHIND")}
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      
      {/* 1. STRATEGY HEALTH */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            {t("STRATEGY HEALTH")}
          </span>
          {renderStatusBadge(strategyHealthStatus)}
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {strategyHealthScore}%
            </span>
            <span className={`text-xs font-bold flex items-center ${strategyHealthTrendPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {strategyHealthTrendPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {strategyHealthTrendPct >= 0 ? "+" : ""}{strategyHealthTrendPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {t("2026 Weighted Target Score")}
          </p>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className={`h-full rounded-full ${
              strategyHealthScore >= 80 ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${strategyHealthScore}%` }}
          />
        </div>
      </div>

      {/* 2. IT EXPORT */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-sky-600" />
            {t("IT EXPORT")}
          </span>
          {exportKpi && renderStatusBadge(exportKpi.status)}
        </div>

        {exportKpi?.dataAvailable === false ? (
          <div className="my-2">
            <span className="text-lg font-black text-slate-400 tracking-tight">{t("No data reported")}</span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t("Awaiting resident export revenue import")}</p>
          </div>
        ) : (
          <>
            <div className="my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {exportKpi ? formatKpiValue(exportKpi.actual, exportKpi.unit) : "—"}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {t("of")} {exportKpi ? formatKpiValue(exportKpi.annualTarget, exportKpi.unit) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="font-extrabold text-emerald-600">
                  {exportKpi?.achievementPercentage}% {t("Achieved")}
                </span>
                <span className="text-slate-400 font-mono">
                  {t("Gap")}: ${exportKpi ? (Math.abs(exportKpi.gap) / 1000000).toFixed(1) : "0.0"}M
                </span>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${exportKpi?.achievementPercentage || 0}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* 3. NEW RESIDENTS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            {t("NEW RESIDENTS")}
          </span>
          {residentKpi && renderStatusBadge(residentKpi.status)}
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              +{residentKpi?.actual ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {t("of")} {residentKpi?.annualTarget ?? 0} {t("target")}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="font-extrabold text-emerald-600">
              {residentKpi?.achievementPercentage}% {t("Achieved")}
            </span>
            <span className="text-emerald-600 font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{residentKpi ? residentKpi.actual - residentKpi.previousActual : 0} {t("prev")}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${residentKpi?.achievementPercentage || 69}%` }}
          />
        </div>
      </div>

      {/* 4. NEW JOBS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            {t("NEW JOBS")}
          </span>
          {jobsKpi && renderStatusBadge(jobsKpi.status)}
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              +{jobsKpi?.actual ?? 0}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {t("of")} {jobsKpi?.annualTarget ?? 0} {t("target")}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="font-extrabold text-amber-600">
              {jobsKpi?.achievementPercentage}% {t("Achieved")}
            </span>
            <span className="text-slate-400 font-mono">
              {t("Trajectory")}: {jobsKpi?.trajectoryExpected}
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className="h-full bg-amber-500 rounded-full"
            style={{ width: `${jobsKpi?.achievementPercentage || 56}%` }}
          />
        </div>
      </div>

      {/* 5. INTERNATIONAL PIPELINE */}
      <div 
        onClick={() => onNavigateToModule("crm")}
        className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
            <Globe2 className="w-3.5 h-3.5 text-sky-600" />
            {t("INTL PIPELINE")}
          </span>
          <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
            {pipelineCoveragePct}% {t("COVERAGE")}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${(pipelineValueUSD / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {t("Pipeline")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {pipelineProspects} {t("prospects in CRM funnel")}
          </p>
        </div>

        <div className="text-[10px] font-extrabold text-emerald-600 group-hover:underline flex items-center gap-1">
          {t("Open CRM Outreach")} &rarr;
        </div>
      </div>

      {/* 6. AT-RISK RESIDENTS */}
      <div 
        onClick={() => onNavigateToModule("residents")}
        className="bg-white border border-rose-200/80 bg-rose-50/20 rounded-2xl p-4 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            {t("AT-RISK RESIDENTS")}
          </span>
          <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">
            {t("ACTION NEEDED")}
          </span>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700 tracking-tight">
              {atRiskResidentCount}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {t("of")} {totalResidentCount} {t("total")}
            </span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">
            {t("Revenue / headcount declining")}
          </p>
        </div>

        <div className="text-[10px] font-extrabold text-rose-700 group-hover:underline flex items-center gap-1">
          {t("Inspect At-Risk List")} &rarr;
        </div>
      </div>

    </div>
  );
}
