/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Calendar, ArrowRight, Clock, CheckCircle2, Tag } from "lucide-react";
import { ExecutiveActionItem } from "../types/kpiTypes";

interface UpcomingActionsProps {
  actionItems: ExecutiveActionItem[];
  onNavigateToModule: (module: string) => void;
  t: (key: string, fallback?: string) => string;
}

export default function UpcomingActions({
  actionItems,
  onNavigateToModule,
  t
}: UpcomingActionsProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Strategic Timeline")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Operations Schedule")}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            {t("executiveDashboard.next30DaysTitle", "NEXT 30 DAYS EXECUTIVE SCHEDULE")}
          </h3>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          {actionItems.length} {t("Milestones Scheduled")}
        </span>
      </div>

      <div className="space-y-2.5">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-900 text-white rounded-xl flex flex-col items-center justify-center shrink-0 font-mono">
                <span className="text-xs font-black uppercase tracking-widest">{item.displayDate}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[9px] bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                    {t(item.category)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{t("Scheduled date")}: {item.date}</span>
                </p>
              </div>
            </div>

            {item.targetModule && (
              <button
                onClick={() => onNavigateToModule(item.targetModule!)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>{item.actionLabel ? t(item.actionLabel) : t("View")}</span>
                <ArrowRight className="w-3 h-3 text-indigo-600" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
