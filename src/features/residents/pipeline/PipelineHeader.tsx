/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Layers, Plus, Sparkles, SlidersHorizontal, LayoutGrid, Kanban } from "lucide-react";
import { useLanguage } from "../../../lib/LanguageContext";

interface PipelineHeaderProps {
  leadCount: number;
  onOpenGlobalAiModal: () => void;
  onOpenAddLeadModal: () => void;
  isReadOnly?: boolean;
  viewLayout: "kanban" | "focused" | "compact";
  onChangeViewLayout: (mode: "kanban" | "focused" | "compact") => void;
}

export default function PipelineHeader({
  leadCount,
  onOpenGlobalAiModal,
  onOpenAddLeadModal,
  isReadOnly = false,
  viewLayout,
  onChangeViewLayout
}: PipelineHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs w-full min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Subtitle */}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              {t("Pipeline Deals & Leads")}
            </h1>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono shrink-0 shadow-2xs">
              {leadCount} {leadCount === 1 ? t("Lead") : t("Leads")}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            {t("Track, nurture, and convert potential high-export tech enterprises into certified IT Park residents.")}
          </p>
        </div>

        {/* Right Actions & Layout Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-stretch sm:self-auto">
          {/* View Mode Toggle for intermediate/large screens */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => onChangeViewLayout("kanban")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewLayout === "kanban"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title={t("Full Kanban Workflow")}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t("Kanban")}</span>
            </button>
            <button
              onClick={() => onChangeViewLayout("focused")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewLayout === "focused"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title={t("Stage Focus View")}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t("Stage Focus")}</span>
            </button>
            <button
              onClick={() => onChangeViewLayout("compact")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewLayout === "compact"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title={t("Compact Matrix View")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t("Matrix")}</span>
            </button>
          </div>

          {/* AI Pipeline Strategy Action */}
          <button
            onClick={onOpenGlobalAiModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs px-3.5 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-all shadow-xs h-[38px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="whitespace-nowrap">{t("AI Pipeline Strategy")}</span>
          </button>

          {/* Create Lead Action */}
          {!isReadOnly && (
            <button
              id="pipeline-add-lead-btn"
              onClick={onOpenAddLeadModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-all shadow-xs h-[38px]"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t("Create Lead")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
