/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Bot, ArrowRight, CheckCircle2, ShieldAlert, AlertTriangle } from "lucide-react";
import { ExecutiveBrief } from "../types/kpiTypes";

interface ExecutiveAiBriefProps {
  brief: ExecutiveBrief;
  onNavigateToAiCopilot: () => void;
  t: (key: string, fallback?: string) => string;
}

export default function ExecutiveAiBrief({
  brief,
  onNavigateToAiCopilot,
  t
}: ExecutiveAiBriefProps) {
  
  const getBulletIcon = (type: string) => {
    switch (type) {
      case "POSITIVE":
        return <span className="text-emerald-500 font-bold shrink-0">🟢</span>;
      case "CRITICAL":
        return <span className="text-rose-500 font-bold shrink-0">🔴</span>;
      case "WARNING":
        return <span className="text-amber-500 font-bold shrink-0">🟡</span>;
      default:
        return <span className="text-sky-500 font-bold shrink-0">🔵</span>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center border" style={{ background: "rgba(0,229,255,0.14)", color: "var(--sidebar-accent,#00E5FF)", borderColor: "rgba(0,229,255,0.3)" }}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--sidebar-accent,#00E5FF)" }}>
              {t("TODAY'S EXECUTIVE AI BRIEF")}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">{t("Synthesized for Management Focus")}</span>
          </div>
        </div>

        <button
          onClick={onNavigateToAiCopilot}
          className="px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:brightness-110"
          style={{ background: "var(--sidebar-accent, #00E5FF)" }}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{t("executiveDashboard.askExecutiveAi", "ASK EXECUTIVE AI")}</span>
        </button>
      </div>

      {/* Bullet Points */}
      <div className="space-y-2 text-xs">
        {brief.bulletPoints.map((bp, i) => (
          <div key={i} className="flex items-start gap-2.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            {getBulletIcon(bp.type)}
            <span className="text-slate-200 font-medium leading-relaxed">{bp.text}</span>
          </div>
        ))}
      </div>

      {/* Priority Action Box */}
      <div className="p-3 rounded-xl flex items-center justify-between gap-3 text-xs border" style={{ background: "rgba(0,229,255,0.08)", borderColor: "rgba(0,229,255,0.3)" }}>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: "var(--sidebar-accent,#00E5FF)" }}>
            {t("RECOMMENDED PRIORITY ACTION")}
          </span>
          <span className="text-white font-bold mt-0.5 block">
            {brief.primaryActionPriority}
          </span>
        </div>

        <button
          onClick={onNavigateToAiCopilot}
          className="font-extrabold flex items-center gap-1 shrink-0 cursor-pointer hover:brightness-110"
          style={{ color: "var(--sidebar-accent,#00E5FF)" }}
        >
          <span>{t("Google Studio Analysis")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
