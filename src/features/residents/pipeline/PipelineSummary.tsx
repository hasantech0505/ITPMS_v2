/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, TrendingUp, DollarSign, Zap, Clock } from "lucide-react";
import { useLanguage } from "../../../lib/LanguageContext";

interface PipelineMetrics {
  totalCount: number;
  totalTargetExport: number;
  weightedTargetExport: number;
  highProbCount: number;
  dueFollowUpsCount: number;
}

interface PipelineSummaryProps {
  metrics: PipelineMetrics;
}

export default function PipelineSummary({ metrics }: PipelineSummaryProps) {
  const { t } = useLanguage();

  return (
    <div
      id="pipeline-summary-cards"
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5 w-full min-w-0"
    >
      {/* 1. Potential Residents */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
            {t("Potential Residents")}
          </span>
          <div className="p-1.5 sm:p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {metrics.totalCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
            {t("Active pipeline leads")}
          </span>
        </div>
      </div>

      {/* 2. Target Export Volume */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
            {t("Target Export Volume")}
          </span>
          <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-emerald-600 font-mono tracking-tight">
            ${(metrics.totalTargetExport / 1000).toFixed(0)}k
          </p>
          <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
            {t("Total projected IT exports")}
          </span>
        </div>
      </div>

      {/* 3. Weighted Expected */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
            {t("Weighted Expected")}
          </span>
          <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-blue-600 font-mono tracking-tight">
            ${(metrics.weightedTargetExport / 1000).toFixed(0)}k
          </p>
          <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
            {t("Probability-adjusted target")}
          </span>
        </div>
      </div>

      {/* 4. High Probability Deals */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
            {t("High Probability Deals")}
          </span>
          <div className="p-1.5 sm:p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-amber-600 font-mono tracking-tight">
            {metrics.highProbCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
            {t("Leads with ≥ 60% probability")}
          </span>
        </div>
      </div>

      {/* 5. Follow-ups Due */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all min-w-0 col-span-2 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold uppercase tracking-wider truncate">
            {t("Follow-ups Due")}
          </span>
          <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${metrics.dueFollowUpsCount > 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"}`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${metrics.dueFollowUpsCount > 0 ? "text-rose-600" : "text-slate-700"}`}>
            {metrics.dueFollowUpsCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
            {t("Action due today or earlier")}
          </span>
        </div>
      </div>
    </div>
  );
}
