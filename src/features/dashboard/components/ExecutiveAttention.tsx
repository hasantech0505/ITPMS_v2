/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { ExecutiveAlert } from "../types/kpiTypes";

interface ExecutiveAttentionProps {
  alerts: ExecutiveAlert[];
  onNavigateToModule: (module: string) => void;
  t: (key: string, fallback?: string) => string;
}

export default function ExecutiveAttention({
  alerts,
  onNavigateToModule,
  t
}: ExecutiveAttentionProps) {
  
  const getSeverityBadge = (severity: ExecutiveAlert["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            {t("CRITICAL / IMMEDIATE")}
          </span>
        );
      case "AT_RISK":
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {t("AT RISK")}
          </span>
        );
      case "FOLLOW_UP":
        return (
          <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            {t("FOLLOW-UP NEEDED")}
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {t("INFO")}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-rose-600" />
              {t("Automated Exception Engine")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Rule-based Management Alerts")}</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            {t("executiveDashboard.executiveAttentionTitle", "EXECUTIVE ATTENTION & MANAGEMENT ISSUES")}
          </h2>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          {alerts.length} {t("Action Items")}
        </span>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.severity === "CRITICAL"
                ? "bg-rose-50/40 border-rose-200 hover:border-rose-300"
                : alert.severity === "AT_RISK"
                ? "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                : "bg-indigo-50/40 border-indigo-200 hover:border-indigo-300"
            }`}
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {getSeverityBadge(alert.severity)}
                <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {t(alert.titleKey, alert.defaultTitle)}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {alert.explanation}
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs">
                <span className="text-slate-500 uppercase font-bold text-[10px]">{t("Recommended Action")}:</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                  {alert.recommendedAction}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/60">
              <span className="text-xs font-black text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs font-mono">
                {alert.metric}
              </span>

              <button
                onClick={() => onNavigateToModule(alert.targetModule)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  alert.severity === "CRITICAL"
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : alert.severity === "AT_RISK"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                <span>{alert.linkText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
