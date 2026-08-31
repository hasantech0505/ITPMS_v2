/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ChevronRight,
  Pencil
} from "lucide-react";
import { CalculatedKPI, StatusType } from "../types/kpiTypes";
import { formatKpiValue, formatKpiGap } from "../utils/kpiCalculations";
import EditKpiTargetModal from "./EditKpiTargetModal";

interface StrategicScorecardProps {
  calculatedKpis: CalculatedKPI[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onNavigateToModule: (module: string) => void;
  onUpdateKpiTarget: (id: string, annualTarget: number, quarterlyTargets: { q1: number; q2: number; q3: number; q4: number }) => void;
  t: (key: string, fallback?: string) => string;
}

function formattedTargetForKpi(kpi: CalculatedKPI): string {
  return formatKpiValue(kpi.annualTarget, kpi.unit);
}

export default function StrategicScorecard({
  calculatedKpis,
  selectedCategory,
  setSelectedCategory,
  onNavigateToModule,
  onUpdateKpiTarget,
  t
}: StrategicScorecardProps) {
  const [editingKpi, setEditingKpi] = useState<CalculatedKPI | null>(null);

  const filteredKpis = selectedCategory === "all"
    ? calculatedKpis
    : calculatedKpis.filter((k) => k.category === selectedCategory);

  // Status Badge UI
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            {t("ACHIEVED")}
          </span>
        );
      case "ON_TRACK":
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {t("ON TRACK")}
          </span>
        );
      case "AT_RISK":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {t("AT RISK")}
          </span>
        );
      case "BEHIND":
        return (
          <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            {t("BEHIND")}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
      {/* Scorecard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {t("2026 Strategic Plan")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("11 Primary Performance Indicators")}</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600 shrink-0" />
            {t("executiveDashboard.scorecardTitle", "2026 STRATEGIC SCORECARD")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Annual strategic goals vs actual achievement, current period trajectory, and progress tracking.")}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {[
            { id: "all", label: t("All Targets") },
            { id: "residents", label: t("Residents") },
            { id: "export", label: t("Export") },
            { id: "revenue", label: t("Services") },
            { id: "jobs", label: t("Jobs") },
            { id: "startups", label: t("Startups") },
            { id: "space", label: t("Space") }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Scorecard Grid / Rows */}
      <div className="space-y-3">
        {filteredKpis.map((kpi) => {
          const formattedActual = formatKpiValue(kpi.actual, kpi.unit);
          const formattedTarget = formatKpiValue(kpi.annualTarget, kpi.unit);
          const formattedPeriodTarget = formatKpiValue(kpi.periodTarget, kpi.unit);
          const isGapNegative = kpi.gap < 0;

          if (kpi.dataAvailable === false) {
            return (
              <div
                key={kpi.id}
                className="bg-slate-50/40 border border-dashed border-slate-200 rounded-xl p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center"
              >
                <div className="md:col-span-4 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-500">
                      {t(kpi.nameKey, kpi.defaultName)}
                    </h3>
                    <span className="text-[9px] bg-slate-200/80 text-slate-700 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                      {t(kpi.category)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    {t("Target")}: {formattedTargetForKpi(kpi)} — {t("source data not yet imported")}.
                  </p>
                </div>
                <div className="md:col-span-8 flex items-center justify-end gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-slate-100 text-slate-400 border border-slate-200">
                    {t("NO DATA REPORTED")}
                  </span>
                  <button
                    onClick={() => setEditingKpi(kpi)}
                    title={t("Edit KPI Target")}
                    className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 cursor-pointer shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={kpi.id}
              className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 hover:bg-slate-50 transition-all hover:border-slate-300 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center"
            >
              {/* Title & Category */}
              <div className="md:col-span-4 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t(kpi.nameKey, kpi.defaultName)}
                  </h3>
                  <span className="text-[9px] bg-slate-200/80 text-slate-700 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                    {t(kpi.category)}
                  </span>
                </div>
                {kpi.actionNote && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                    {kpi.actionNote}
                  </p>
                )}
              </div>

              {/* Values & Achievement % */}
              <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("Actual / Target")}</span>
                  <div className="text-xs sm:text-sm font-black text-slate-900">
                    {formattedActual}{" "}
                    <span className="text-slate-400 text-xs font-normal">
                      / {formattedTarget}
                    </span>
                  </div>
                </div>

                <div className="text-right md:text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t("Achievement")}</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600">
                    {kpi.achievementPercentage}%
                  </span>
                </div>
              </div>

              {/* Trajectory & Gap */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                  <span className="text-slate-500">{t("Q3 Trajectory")}: <strong className="text-slate-800">{formattedPeriodTarget}</strong></span>
                  <span className={isGapNegative ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                    {t("Gap")}: {formatKpiGap(kpi.gap, kpi.unit)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
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

              {/* Status Badge */}
              <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2">
                {getStatusBadge(kpi.status)}
                <button
                  onClick={() => setEditingKpi(kpi)}
                  title={t("Edit KPI Target")}
                  className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 cursor-pointer shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editingKpi && (
        <EditKpiTargetModal
          kpi={editingKpi}
          onClose={() => setEditingKpi(null)}
          onSave={(annualTarget, quarterlyTargets) => onUpdateKpiTarget(editingKpi.id, annualTarget, quarterlyTargets)}
          t={t}
        />
      )}
    </div>
  );
}
