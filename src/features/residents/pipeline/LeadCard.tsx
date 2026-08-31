/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { User, Calendar, ArrowRight, ChevronLeft, ChevronRight, MapPin, DollarSign, Building } from "lucide-react";
import { Resident } from "../../../types";
import { PipelineStage } from "./pipelineTypes";
import { useLanguage } from "../../../lib/LanguageContext";

interface LeadCardProps {
  key?: React.Key;
  card: Resident;
  stage: PipelineStage;
  onOpenDrawer: (lead: Resident) => void;
  onMoveStage: (id: string, stage: PipelineStage, direction: "LEFT" | "RIGHT") => void;
  isFirstStage: boolean;
  isLastStage: boolean;
  isReadOnly?: boolean;
  compact?: boolean;
}

export default function LeadCard({
  card,
  stage,
  onOpenDrawer,
  onMoveStage,
  isFirstStage,
  isLastStage,
  isReadOnly = false,
  compact = false
}: LeadCardProps) {
  const { t } = useLanguage();
  const prob = card.potentialProbability ?? 20;
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = card.potentialNextFollowUp && card.potentialNextFollowUp <= todayStr;
  const founderName = card.potentialFounder || card.director || t("Unassigned Founder");
  const districtName = card.district || "Qarshi";
  const exportK = ((card.exportVolume || 0) / 1000).toFixed(0);
  const ownerName = card.potentialOwner || t("Unassigned");

  // Badge styling based on probability
  const getBadgeStyle = (p: number) => {
    if (p >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (p >= 50) return "bg-blue-50 text-blue-700 border-blue-200";
    if (p >= 30) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getProgressColor = (p: number) => {
    if (p >= 75) return "bg-emerald-500";
    if (p >= 50) return "bg-blue-500";
    if (p >= 30) return "bg-amber-500";
    return "bg-slate-400";
  };

  return (
    <div
      onClick={() => onOpenDrawer(card)}
      className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer space-y-2.5 group relative w-full min-w-0"
    >
      {/* 1. Header: Company Name & Probability Badge */}
      <div className="space-y-1 min-w-0">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3
            className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug group-hover:text-emerald-700 transition-colors break-words line-clamp-2 min-w-0 flex-1"
            title={card.companyName}
          >
            {card.companyName}
          </h3>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 font-mono ${getBadgeStyle(prob)}`}
          >
            {prob}% {t("Prob")}
          </span>
        </div>

        {/* Founder Info */}
        <p className="text-[11px] text-slate-500 truncate" title={`${t("Founder")}: ${founderName}`}>
          {t("Founder")}: <span className="font-semibold text-slate-700">{founderName}</span>
        </p>
      </div>

      {/* 2. Probability Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${getProgressColor(prob)} transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(5, prob))}%` }}
        />
      </div>

      {/* 3. Metrics Details Box */}
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/90 p-2 sm:p-2.5 rounded-lg border border-slate-100 font-medium min-w-0">
        <div className="min-w-0">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
            {t("Export Target")}
          </span>
          <span className="font-bold text-slate-900 font-mono text-xs truncate block">
            ${exportK}k USD
          </span>
        </div>
        <div className="min-w-0">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">
            {t("District")}
          </span>
          <span className="font-semibold text-slate-700 truncate block text-[11px]" title={districtName}>
            {districtName}
          </span>
        </div>
      </div>

      {/* 4. Owner & Follow-Up Date */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 gap-2 min-w-0">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <User className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate text-[10px] sm:text-[11px]" title={ownerName}>
            {ownerName}
          </span>
        </div>

        {card.potentialNextFollowUp && (
          <span
            className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 font-mono ${
              isOverdue
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-slate-100 text-slate-600"
            }`}
            title={`${t("Follow-up Date")}: ${card.potentialNextFollowUp}${isOverdue ? ` (${t("Overdue")})` : ""}`}
          >
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
            <span className="truncate">{card.potentialNextFollowUp}</span>
          </span>
        )}
      </div>

      {/* 5. Stage Transition Arrows & Inspect CTA */}
      <div
        className="flex items-center justify-between pt-2 border-t border-slate-100 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {!isReadOnly ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onMoveStage(card.id, stage, "LEFT")}
              disabled={isFirstStage}
              className="p-1 border border-slate-200 rounded-md bg-white disabled:opacity-25 hover:bg-slate-100 text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title={t("Move to previous stage")}
              aria-label={t("Move left")}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveStage(card.id, stage, "RIGHT")}
              disabled={isLastStage}
              className="p-1 border border-slate-200 rounded-md bg-white disabled:opacity-25 hover:bg-slate-100 text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
              title={t("Move to next stage")}
              aria-label={t("Move right")}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span />
        )}

        <button
          onClick={() => onOpenDrawer(card)}
          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
        >
          <span>{t("Inspect & Pitch")}</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
}
