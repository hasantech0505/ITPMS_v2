/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Plus,
  ArrowRight
} from "lucide-react";
import { Resident } from "../../../types";
import { PipelineStage, PIPELINE_STAGES, DEFAULT_PROBABILITIES } from "./pipelineTypes";
import LeadCard from "./LeadCard";

interface PipelineBoardProps {
  residents: Resident[];
  onOpenDrawer: (lead: Resident) => void;
  onMoveStage: (id: string, stage: PipelineStage, direction: "LEFT" | "RIGHT") => void;
  isReadOnly?: boolean;
  viewLayout: "kanban" | "focused" | "compact";
  onAddNewLeadClick?: () => void;
}

export default function PipelineBoard({
  residents,
  onOpenDrawer,
  onMoveStage,
  isReadOnly = false,
  viewLayout,
  onAddNewLeadClick
}: PipelineBoardProps) {
  // Mobile active stage state (for <= 767px screens or Focused mode)
  const [mobileActiveStage, setMobileActiveStage] = useState<PipelineStage>("New Lead");

  // Group leads by stage
  const stageData = PIPELINE_STAGES.map((stage) => {
    const cards = residents.filter(r => (r.potentialStage || "New Lead") === stage);
    const totalExport = cards.reduce((acc, c) => acc + (c.exportVolume || 0), 0);
    const weightedExport = cards.reduce((acc, c) => {
      const prob = (c.potentialProbability ?? DEFAULT_PROBABILITIES[stage]) / 100;
      return acc + (c.exportVolume || 0) * prob;
    }, 0);

    return {
      stage,
      cards,
      totalExport,
      weightedExport,
      defaultProb: DEFAULT_PROBABILITIES[stage]
    };
  });

  const activeMobileData = stageData.find(s => s.stage === mobileActiveStage) || stageData[0];
  const activeMobileIndex = PIPELINE_STAGES.indexOf(mobileActiveStage);

  return (
    <div className="w-full min-w-0 space-y-4">

      {/* =========================================================================
          1. MOBILE & TABLET STAGE SELECTOR TABS (Shown on < lg screens or when in "focused" view)
      ========================================================================= */}
      <div className={`w-full min-w-0 ${viewLayout === "focused" ? "block" : "block xl:hidden"}`}>
        <div className="bg-white border border-slate-200/90 rounded-xl p-2 shadow-xs">
          {/* Horizontally scrollable stage selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {stageData.map(({ stage, cards }) => {
              const isSelected = mobileActiveStage === stage;
              return (
                <button
                  key={stage}
                  onClick={() => setMobileActiveStage(stage)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-emerald-400" : "bg-slate-400"}`} />
                  <span>{stage}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700 font-bold"
                  }`}>
                    {cards.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile / Focused Active Stage Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 mt-3 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                {activeMobileData.stage}
              </h2>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                {activeMobileData.cards.length} {activeMobileData.cards.length === 1 ? "Deal" : "Deals"}
              </span>
            </div>

            {/* Quick Next / Prev Stage buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={activeMobileIndex === 0}
                onClick={() => setMobileActiveStage(PIPELINE_STAGES[activeMobileIndex - 1])}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Previous Stage"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <button
                disabled={activeMobileIndex === PIPELINE_STAGES.length - 1}
                onClick={() => setMobileActiveStage(PIPELINE_STAGES[activeMobileIndex + 1])}
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                title="Next Stage"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stage summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Export</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                ${(activeMobileData.totalExport / 1000).toFixed(0)}k USD
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Weighted Expected</span>
              <span className="text-sm font-extrabold text-emerald-600 font-mono">
                ${(activeMobileData.weightedExport / 1000).toFixed(0)}k USD
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Probability</span>
              <span className="text-sm font-extrabold text-indigo-600 font-mono">
                {activeMobileData.defaultProb}%
              </span>
            </div>
          </div>

          {/* Cards for active mobile stage (Stacked 100% width) */}
          <div className="space-y-3 pt-2">
            {activeMobileData.cards.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-4 text-slate-400 bg-slate-50/50">
                <Layers className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No leads in "{activeMobileData.stage}"</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Advance leads from previous stages or register a new candidate.
                </p>
                {onAddNewLeadClick && !isReadOnly && (
                  <button
                    onClick={onAddNewLeadClick}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Lead to this Stage</span>
                  </button>
                )}
              </div>
            ) : (
              activeMobileData.cards.map((card) => (
                <LeadCard
                  key={card.id}
                  card={card}
                  stage={activeMobileData.stage}
                  onOpenDrawer={onOpenDrawer}
                  onMoveStage={onMoveStage}
                  isFirstStage={activeMobileIndex === 0}
                  isLastStage={activeMobileIndex === PIPELINE_STAGES.length - 1}
                  isReadOnly={isReadOnly}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP 7-STAGE KANBAN BOARD (Shown on >= xl screens in "kanban" mode)
      ========================================================================= */}
      {viewLayout === "kanban" && (
        <div className="hidden xl:block w-full min-w-0">
          {/* Kanban Columns Grid - Uses auto-fit or responsive 7-col layout */}
          <div className="grid grid-cols-7 gap-3 w-full min-w-0 items-start">
            {stageData.map(({ stage, cards, totalExport, weightedExport }, stageIdx) => {
              const isFirst = stageIdx === 0;
              const isLast = stageIdx === stageData.length - 1;

              return (
                <div
                  key={stage}
                  className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs min-w-0 w-full h-[660px]"
                >
                  {/* Column Header */}
                  <div className="space-y-2 mb-2 shrink-0 min-w-0">
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <h2 
                          className="text-xs font-black text-slate-800 truncate"
                          title={stage}
                        >
                          {stage}
                        </h2>
                      </div>
                      <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-mono shrink-0 shadow-2xs">
                        {cards.length}
                      </span>
                    </div>

                    {/* Column Mini KPI Summary */}
                    <div className="grid grid-cols-2 text-[10px] text-slate-500 font-mono bg-white/90 p-1.5 rounded-lg border border-slate-200/70 gap-1">
                      <div className="min-w-0">
                        <span className="text-slate-400 block text-[8px] uppercase font-sans font-bold">Target:</span>
                        <span className="font-extrabold text-slate-900 truncate block">${(totalExport / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="min-w-0 text-right">
                        <span className="text-slate-400 block text-[8px] uppercase font-sans font-bold">Weighted:</span>
                        <span className="font-extrabold text-emerald-600 truncate block">${(weightedExport / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>

                  {/* Cards Scrollable Column Body */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5 scrollbar-thin min-w-0">
                    {cards.length === 0 ? (
                      <div className="h-32 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-400 gap-1 bg-white/40 p-2 text-center">
                        <Layers className="w-4 h-4 text-slate-300" />
                        <span className="font-medium">No leads</span>
                      </div>
                    ) : (
                      cards.map((card) => (
                        <LeadCard
                          key={card.id}
                          card={card}
                          stage={stage}
                          onOpenDrawer={onOpenDrawer}
                          onMoveStage={onMoveStage}
                          isFirstStage={isFirst}
                          isLastStage={isLast}
                          isReadOnly={isReadOnly}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. COMPACT MATRIX VIEW (Optional view for high-density overview)
      ========================================================================= */}
      {viewLayout === "compact" && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Probability</th>
                  <th className="py-3 px-4">Export Target</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Founder</th>
                  <th className="py-3 px-4">Lead Owner</th>
                  <th className="py-3 px-4">Next Follow-Up</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {residents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 italic">
                      No leads match the selected filters.
                    </td>
                  </tr>
                ) : (
                  residents.map((card) => {
                    const prob = card.potentialProbability ?? 20;
                    const stage = (card.potentialStage || "New Lead") as PipelineStage;
                    return (
                      <tr
                        key={card.id}
                        onClick={() => onOpenDrawer(card)}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {card.companyName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {stage}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-emerald-600">{prob}%</span>
                            <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${prob}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ${((card.exportVolume || 0) / 1000).toFixed(0)}k USD
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {card.district || "Qarshi"}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {card.potentialFounder || card.director}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {card.potentialOwner || "Unassigned"}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {card.potentialNextFollowUp || "-"}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenDrawer(card)}
                            className="p-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                          >
                            Inspect &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
