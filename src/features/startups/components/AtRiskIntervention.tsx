/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle, AlertCircle, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";
import { Startup } from "../../../types";
import { calculateStartupHealth, calculateInvestmentReadiness } from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface AtRiskInterventionProps {
  startups: Startup[];
  onSelectStartup: (startup: Startup) => void;
}

export default function AtRiskIntervention({
  startups,
  onSelectStartup
}: AtRiskInterventionProps) {
  const { t } = useLanguage();
  // Filter startups that need attention or are at risk
  const interventionList = startups
    .map(s => {
      const health = calculateStartupHealth(s);
      const invest = calculateInvestmentReadiness(s);
      let priority: "CRITICAL" | "HIGH" | "MEDIUM" = "MEDIUM";
      if (health.status === "AT_RISK") {
        priority = "CRITICAL";
      } else if (health.status === "NEEDS_ATTENTION") {
        priority = "HIGH";
      }

      return {
        startup: s,
        health,
        invest,
        priority,
        problem: health.reason,
        recommendedAction: invest.recommendedAction || s.nextAction?.action || t("Assign dedicated mentor for strategy review.")
      };
    })
    .filter(item => item.health.status === "AT_RISK" || item.health.status === "NEEDS_ATTENTION");

  // Sort: AT_RISK first, then by health score ascending
  interventionList.sort((a, b) => a.health.score - b.health.score);

  if (interventionList.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t("All Cohort Startups are Healthy")}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{t("No critical bottlenecks or stalled revenue trajectories detected across current incubation batches.")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="at-risk-intervention-container" className="bg-white border border-rose-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>{t("Startups Requiring IT Park Management Intervention")}</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-black font-mono">
                {interventionList.length} {t("Flagged")}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("Proactive alerts based on lack of customer traction, delayed milestones, or regulatory blockers.")}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-rose-50/50 border-b border-rose-100 text-[10px] font-bold text-rose-900 uppercase tracking-wider">
              <th className="py-2.5 px-4">{t("Startup")}</th>
              <th className="py-2.5 px-4">{t("Problem / Risk Factor")}</th>
              <th className="py-2.5 px-3 text-center">{t("Health Status")}</th>
              <th className="py-2.5 px-3 text-center">{t("Priority")}</th>
              <th className="py-2.5 px-4">{t("Recommended Intervention Action")}</th>
              <th className="py-2.5 px-4 text-right">{t("Action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {interventionList.map(({ startup: s, health, priority, problem, recommendedAction }) => (
              <tr
                key={s.id}
                onClick={() => onSelectStartup(s)}
                className="hover:bg-rose-50/30 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4 font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{s.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">({s.district || "Qarshi"})</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-slate-600 max-w-[240px]">
                  <span className="text-[11px] italic leading-tight block">
                    "{problem}"
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      health.status === "AT_RISK"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        health.status === "AT_RISK" ? "bg-rose-600" : "bg-amber-600"
                      }`}
                    />
                    <span>{health.status === "AT_RISK" ? t("At Risk") : t("Attention")}</span>
                    <span className="font-mono text-[9px] font-black">({health.score}/100)</span>
                  </span>
                </td>

                <td className="py-3 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider uppercase ${
                      priority === "CRITICAL"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {t(priority)}
                  </span>
                </td>

                <td className="py-3 px-4 text-slate-700 max-w-[280px]">
                  <span className="text-[11px] font-medium block leading-snug">
                    {recommendedAction}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStartup(s);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    <span>{t("Intervene")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
