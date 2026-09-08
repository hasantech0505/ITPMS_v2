/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Briefcase, Users2, CheckCircle2, ArrowRight } from "lucide-react";
import { HiringActivitySummary } from "../utils/liveDashboardData";

interface HiringActivityCardProps {
  summary: HiringActivitySummary;
  onNavigateToVacancies: () => void;
  t: (key: string, fallback?: string) => string;
}

export default function HiringActivityCard({ summary, onNavigateToVacancies, t }: HiringActivityCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 text-violet-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Job Board")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Resident Vacancies")}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-600" />
            {t("HIRING ACTIVITY")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Current open positions and applicant flow across resident companies.")}
          </p>
        </div>
        <button
          onClick={onNavigateToVacancies}
          className="text-xs font-extrabold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{t("View Vacancies")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-50 rounded-lg text-violet-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Open Vacancies")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{summary.openVacancies}<span className="text-slate-300 text-sm"> / {summary.totalVacancies}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Total Applicants")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{summary.totalApplicants}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Positions Filled")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{summary.positionsFilled}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
