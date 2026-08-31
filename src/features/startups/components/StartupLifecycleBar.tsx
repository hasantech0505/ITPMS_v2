/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Lightbulb, 
  Layers, 
  Zap, 
  TrendingUp, 
  Rocket, 
  Globe, 
  Award, 
  ChevronRight 
} from "lucide-react";
import { Startup } from "../../../types";
import { LIFECYCLE_STAGES, normalizeStage } from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface StartupLifecycleBarProps {
  startups: Startup[];
  selectedStage: string;
  onSelectStage: (stage: string) => void;
}

const STAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  IDEA: Lightbulb,
  PRE_MVP: Layers,
  MVP: Zap,
  EARLY_REVENUE: TrendingUp,
  GROWTH: Rocket,
  SCALE: Globe,
  GRADUATED: Award
};

export default function StartupLifecycleBar({ 
  startups, 
  selectedStage, 
  onSelectStage 
}: StartupLifecycleBarProps) {
  const { t } = useLanguage();
  const total = startups.length;

  // Counts per stage
  const stageCounts: Record<string, number> = {};
  LIFECYCLE_STAGES.forEach(s => {
    stageCounts[s.id] = 0;
  });

  startups.forEach(s => {
    const stage = normalizeStage(s.stage);
    if (stageCounts[stage] !== undefined) {
      stageCounts[stage]++;
    } else {
      // Fallback
      stageCounts["IDEA"] = (stageCounts["IDEA"] || 0) + 1;
    }
  });

  return (
    <div id="startup-lifecycle-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t("Startup Growth & Maturity Lifecycle")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("Progression path from problem validation to sustainable scaleup and IT Park residency.")}
            </p>
          </div>
        </div>

        {selectedStage !== "ALL" && (
          <button
            onClick={() => onSelectStage("ALL")}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-all self-start sm:self-auto cursor-pointer"
          >
            {t("Clear Stage Filter")} ({selectedStage.replace("_", " ")})
          </button>
        )}
      </div>

      {/* Stepped Lifecycle Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {LIFECYCLE_STAGES.map((st, index) => {
          const count = stageCounts[st.id] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isSelected = selectedStage === st.id;
          const Icon = STAGE_ICONS[st.id] || Rocket;

          // Next stage conversion calculation
          const nextStage = LIFECYCLE_STAGES[index + 1];
          const nextCount = nextStage ? (stageCounts[nextStage.id] || 0) : 0;
          const conversionRate = count > 0 ? Math.round((nextCount / count) * 100) : null;

          return (
            <button
              key={st.id}
              id={`lifecycle-step-${st.id.toLowerCase()}`}
              onClick={() => onSelectStage(isSelected ? "ALL" : st.id)}
              className={`relative text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20"
                  : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {t("Step")} {index + 1}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-200" : "text-slate-400"}`} />
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs font-extrabold tracking-tight">
                    {t(st.label)}
                  </span>
                  <span className={`text-sm font-black font-mono ${isSelected ? "text-white" : "text-slate-800"}`}>
                    {count}
                  </span>
                </div>

                <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                  {t(st.desc)}
                </p>
              </div>

              {/* Progress bar inside step */}
              <div className="mt-3 pt-2 border-t border-slate-200/50">
                <div className="flex justify-between items-center text-[9px] mb-1">
                  <span className={isSelected ? "text-indigo-200" : "text-slate-400"}>{t("Share")}</span>
                  <span className={`font-mono font-bold ${isSelected ? "text-white" : "text-slate-600"}`}>{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-1 rounded-full ${isSelected ? "bg-white" : "bg-indigo-500"}`} 
                    style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
