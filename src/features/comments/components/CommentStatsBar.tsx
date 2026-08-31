import React from "react";
import { 
  Rocket, 
  MessageSquare, 
  CheckCircle2, 
  Flame, 
  Lightbulb, 
  Users2, 
  TrendingUp 
} from "lucide-react";
import { ProjectComment } from "../../../types";

interface CommentStatsBarProps {
  comments: ProjectComment[];
  onOpenQuickBoostModal: () => void;
}

export default function CommentStatsBar({ comments, onOpenQuickBoostModal }: CommentStatsBarProps) {
  const totalComments = comments.length;
  const totalBoosts = comments.reduce((acc, c) => acc + (c.boostCount || 0), 0);
  const implementedCount = comments.filter((c) => ["IMPLEMENTED", "RESOLVED"].includes(c.status)).length;
  const criticalCount = comments.filter((c) => c.priority === "CRITICAL" && c.status !== "RESOLVED").length;
  const totalReplies = comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Project Boosts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#74BD22]/10 to-transparent rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-[#74BD22]/15 text-[#74BD22] flex items-center justify-center font-bold">
            <Rocket className="w-5 h-5" />
          </div>
          <button
            onClick={onOpenQuickBoostModal}
            className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-md bg-[#74BD22] text-slate-950 hover:bg-[#8be028] cursor-pointer transition-all shadow-xs"
          >
            + Quick Boost
          </button>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalBoosts.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <span>Community & Stakeholder Boosts</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* 2. Active Discussions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalComments} <span className="text-xs text-slate-400 font-normal font-mono">({totalReplies} replies)</span>
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Active Feedback & Proposal Threads
          </div>
        </div>
      </div>

      {/* 3. Implemented Outcomes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {implementedCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Implemented & Resolved Directives
          </div>
        </div>
      </div>

      {/* 4. Critical Attention */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {criticalCount}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            High Priority Active Directives
          </div>
        </div>
      </div>
    </div>
  );
}
