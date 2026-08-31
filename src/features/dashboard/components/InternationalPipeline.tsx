/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Globe2, ArrowRight, TrendingUp, CheckCircle2, Users, Layers } from "lucide-react";
import { InternationalPipelineData } from "../types/kpiTypes";

interface InternationalPipelineProps {
  pipelineData: InternationalPipelineData;
  onNavigateToCrm: () => void;
  t: (key: string, fallback?: string) => string;
}

export default function InternationalPipeline({
  pipelineData,
  onNavigateToCrm,
  t
}: InternationalPipelineProps) {
  
  const funnelSteps = [
    { label: "Prospects", count: pipelineData.prospects, color: "bg-slate-200 text-slate-800" },
    { label: "Contacted", count: pipelineData.contacted, color: "bg-indigo-100 text-indigo-900" },
    { label: "Meetings", count: pipelineData.meetings, color: "bg-sky-100 text-sky-900" },
    { label: "Negotiations", count: pipelineData.negotiations, color: "bg-amber-100 text-amber-900 font-extrabold" },
    { label: "LOIs / MOUs", count: pipelineData.loisMous, color: "bg-emerald-100 text-emerald-900 font-extrabold" },
    { label: "Converted", count: pipelineData.converted, color: "bg-emerald-600 text-white font-black" }
  ];

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Global Outreach CRM")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("BPO & IT Export Pipeline")}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-sky-600" />
            {t("executiveDashboard.internationalPipelineTitle", "INTERNATIONAL PIPELINE & EXPORT COVERAGE")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Cross-border export leads, active negotiations, and regional target coverage.")}
          </p>
        </div>

        <button
          onClick={onNavigateToCrm}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>{t("Open CRM Pipeline")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pipeline Summary Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            {t("QUALIFIED PIPELINE VALUE")}
          </span>
          {pipelineData.pipelineValueDataAvailable === false ? (
            <>
              <span className="text-lg font-black text-slate-500 mt-1 block">{t("No deal-value data reported")}</span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                {t("Across")} {pipelineData.prospects} {t("international leads")}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-black text-white mt-1 block">
                ${(pipelineData.pipelineValueUSD / 1000000).toFixed(1)}M USD
              </span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                {t("Across")} {pipelineData.prospects} {t("international leads")}
              </span>
            </>
          )}
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block">
            {t("CONTACT RATE")}
          </span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {pipelineData.prospects > 0 ? Math.round((pipelineData.contacted / pipelineData.prospects) * 100) : 0}%
          </span>
          <span className="text-xs text-emerald-800 font-medium mt-1 block">
            {pipelineData.contacted} {t("of")} {pipelineData.prospects} {t("leads contacted so far")}
          </span>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-indigo-800 uppercase font-bold tracking-wider block">
            {t("TOP MARKET DESTINATION")}
          </span>
          <span className="text-2xl font-black text-indigo-900 mt-1 block">
            {pipelineData.marketBreakdown[0] ? t(pipelineData.marketBreakdown[0].region) : "—"}
          </span>
          <span className="text-xs text-indigo-700 font-medium mt-1 block">
            {pipelineData.marketBreakdown[0]?.prospectsCount ?? 0} {t("of")} {pipelineData.prospects} {t("leads")} ({pipelineData.marketBreakdown[0]?.sharePct ?? 0}%)
          </span>
        </div>
      </div>

      {/* CRM Funnel Steps */}
      <div>
        <span className="text-xs font-bold text-slate-700 uppercase block mb-2">
          {t("CONVERSION FUNNEL STAGES")}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {funnelSteps.map((step) => (
            <div
              key={step.label}
              className={`p-3 rounded-xl border border-slate-200 text-center ${step.color}`}
            >
              <span className="text-xl font-black block">{step.count}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider block mt-0.5">
                {t(step.label)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Breakdown List */}
      <div>
        <span className="text-xs font-bold text-slate-700 uppercase block mb-2">
          {t("GEOGRAPHIC MARKET BREAKDOWN")}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {pipelineData.marketBreakdown.map((m) => (
            <div key={m.region} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-800 block">{t(m.region)}</span>
              <span className="text-sm font-black text-slate-900 block font-mono">
                {m.valueDataAvailable === false ? `${m.prospectsCount} ${t("prospects")}` : `$${(m.valueUSD / 1000000).toFixed(2)}M`}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block">
                {m.sharePct}% {t("of leads")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
