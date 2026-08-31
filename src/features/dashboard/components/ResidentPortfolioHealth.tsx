/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Users
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ResidentHealthSummary } from "../types/kpiTypes";

interface ResidentPortfolioHealthProps {
  healthSummary: ResidentHealthSummary;
  onNavigateToResidents: () => void;
  t: (key: string, fallback?: string) => string;
}

export default function ResidentPortfolioHealth({
  healthSummary,
  onNavigateToResidents,
  t
}: ResidentPortfolioHealthProps) {
  
  const pieData = [
    { name: "Healthy (Low Risk)", value: healthSummary.healthyCount, color: "#10b981" },
    { name: "Watch List (Medium Risk)", value: healthSummary.watchCount, color: "#f59e0b" },
    { name: "At Risk (Critical)", value: healthSummary.atRiskCount, color: "#f43f5e" }
  ];

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Health Matrix")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Weighted Health Index Engine")}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            {t("executiveDashboard.residentHealthTitle", "RESIDENT PORTFOLIO HEALTH")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Based on 2026 quarterly-report submission compliance — revenue/headcount trend health will apply once resident financial data is imported.")}
          </p>
        </div>

        <button
          onClick={onNavigateToResidents}
          className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{t("View All")} {healthSummary.totalResidents} {t("Residents")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Ring / Donut Visualization & Summary Metrics */}
        <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
          <div className="w-36 h-36 shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-black text-slate-900">{healthSummary.totalResidents}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">{t("Residents")}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-bold w-full min-w-0">
            <div className="flex justify-between items-center p-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t("Healthy Residents")}
              </span>
              <span className="font-black text-sm">{healthSummary.healthyCount} ({healthSummary.totalResidents > 0 ? Math.round((healthSummary.healthyCount / healthSummary.totalResidents) * 100) : 0}%)</span>
            </div>

            <div className="flex justify-between items-center p-2 bg-amber-50 text-amber-900 rounded-xl border border-amber-200/60">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {t("Watch List")}
              </span>
              <span className="font-black text-sm">{healthSummary.watchCount} ({healthSummary.totalResidents > 0 ? Math.round((healthSummary.watchCount / healthSummary.totalResidents) * 100) : 0}%)</span>
            </div>

            <div className="flex justify-between items-center p-2 bg-rose-50 text-rose-900 rounded-xl border border-rose-200/60">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                {t("At Risk (Action)")}
              </span>
              <span className="font-black text-sm">{healthSummary.atRiskCount} ({healthSummary.totalResidents > 0 ? Math.round((healthSummary.atRiskCount / healthSummary.totalResidents) * 100) : 0}%)</span>
            </div>
          </div>
        </div>

        {/* At-Risk Resident Spotlight List */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t("PRIORITY AT-RISK RESIDENT SPOTLIGHT")}</span>
            <span className="text-[10px] text-rose-600 font-mono font-bold uppercase">{t("Requires Advisory Audit")}</span>
          </div>

          <div className="space-y-2">
            {healthSummary.atRiskList.map((res) => (
              <div
                key={res.id}
                className="p-3 bg-rose-50/20 border border-rose-200/80 rounded-xl flex items-center justify-between gap-3 hover:bg-rose-50/40 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{res.companyName}</h4>
                    <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase">
                      {t(res.district)}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                    ⚠️ {t(res.primaryReason)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-rose-700 block">
                    {t(res.riskLevel)} {t("RISK")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
