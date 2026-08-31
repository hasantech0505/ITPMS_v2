/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  MapPin, 
  Building2, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight
} from "lucide-react";
import { RegionalDistrictPerformance, StatusType } from "../types/kpiTypes";

interface RegionalPerformanceProps {
  districtData: RegionalDistrictPerformance[];
  onNavigateToDistrict?: (districtId: string) => void;
  t: (key: string, fallback?: string) => string;
}

export default function RegionalPerformance({ 
  districtData, 
  onNavigateToDistrict, 
  t 
}: RegionalPerformanceProps) {
  
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
            <span>{t("ACHIEVED", "ACHIEVED")}</span>
          </span>
        );
      case "ON_TRACK":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{t("ON TRACK", "ON TRACK")}</span>
          </span>
        );
      case "AT_RISK":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>{t("AT RISK", "AT RISK")}</span>
          </span>
        );
      case "BEHIND":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
            <span>{t("BEHIND", "BEHIND")}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#70B22C]/15 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300/40">
              {t("executiveDashboard.geographicDistribution", "GEOGRAPHIC DISTRIBUTION")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Qashqadaryo Region")}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
            {t("executiveDashboard.geographicDistribution", "GEOGRAPHIC DISTRIBUTION")}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              "executiveDashboard.geographicDistributionSubtitle",
              "District-level IT Park residents and job performance across Qashqadaryo"
            )}
          </p>
        </div>

        {/* Top-Right Summary: Dynamic Total Districts */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {t("Total Districts", "TOTAL DISTRICTS")}
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {districtData.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              {districtData.length}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Grid: 3 cards desktop, 2 cards tablet, 1 card mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districtData.map((d) => {
          // Resident achievement %
          const resPct = d.residentsTarget > 0 ? Math.round((d.residentsActual / d.residentsTarget) * 100) : 0;
          // Jobs achievement %
          const jobsPct = d.jobsTarget > 0 ? Math.round((d.jobsActual / d.jobsTarget) * 100) : 0;

          // 50% Residents + 50% Jobs weighted performance
          const overallPerformancePct = Math.round((resPct + jobsPct) / 2);

          // Calculate status based strictly on Residents & Jobs
          const computedStatus: StatusType =
            overallPerformancePct >= 80 ? "ON_TRACK" : overallPerformancePct >= 60 ? "AT_RISK" : "BEHIND";

          return (
            <div
              key={d.districtId}
              className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl flex flex-col justify-between hover:bg-white hover:border-emerald-500/40 transition-all hover:shadow-xs min-w-0 group"
            >
              <div className="space-y-3.5">
                {/* 1. DISTRICT NAME & STATUS */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-200/50 pb-2.5">
                  <div className="min-w-0">
                    <h4 className="text-base font-black text-slate-900 tracking-tight break-words">
                      {t(d.districtName)}
                    </h4>
                  </div>
                  <div className="shrink-0">{getStatusBadge(computedStatus)}</div>
                </div>

                {/* 2. RESIDENTS */}
                <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {t("Residents", "Residents")}
                    </span>
                    <span className="font-extrabold text-emerald-700 font-mono">
                      {resPct}%
                    </span>
                  </div>
                  
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 font-medium">{t("Actual / Target", "Actual / Target")}</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {d.residentsActual}{" "}
                      <span className="text-slate-400 font-normal">/ {d.residentsTarget}</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, resPct)}%` }}
                    />
                  </div>
                </div>

                {/* 3. JOBS CREATED */}
                <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      {t("Jobs Created", "Jobs Created")}
                    </span>
                    <span className="font-extrabold text-sky-700 font-mono">
                      {jobsPct}%
                    </span>
                  </div>
                  
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400 font-medium">{t("Actual / Target", "Actual / Target")}</span>
                    <span className="font-extrabold text-slate-900 font-mono">
                      {d.jobsActual.toLocaleString()}{" "}
                      <span className="text-slate-400 font-normal">/ {d.jobsTarget.toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, jobsPct)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Optional District Action */}
              {onNavigateToDistrict && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => onNavigateToDistrict(d.districtId)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs group-hover:border-slate-300"
                  >
                    <span>{t("View District", "View District")}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
