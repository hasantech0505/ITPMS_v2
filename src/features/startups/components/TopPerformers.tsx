/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  CheckCircle2, 
  ChevronRight,
  Medal,
  Award
} from "lucide-react";
import { Startup } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface TopPerformersProps {
  startups: Startup[];
  onSelectStartup: (startup: Startup) => void;
}

type MetricDimension = "revenue" | "customers" | "jobs" | "funding" | "export" | "milestones";

export default function TopPerformers({
  startups,
  onSelectStartup
}: TopPerformersProps) {
  const { t } = useLanguage();
  const [dimension, setDimension] = useState<MetricDimension>("revenue");

  // Sort startups according to selected dimension
  const sorted = [...startups].sort((a, b) => {
    switch (dimension) {
      case "revenue": {
        const mrrA = a.mrr ?? a.kpis?.mrr ?? 0;
        const mrrB = b.mrr ?? b.kpis?.mrr ?? 0;
        return mrrB - mrrA;
      }
      case "customers": {
        const custA = a.payingCustomers ?? a.totalCustomers ?? a.activeUsers ?? 0;
        const custB = b.payingCustomers ?? b.totalCustomers ?? b.activeUsers ?? 0;
        return custB - custA;
      }
      case "jobs": {
        const jobsA = a.jobsCreated ?? Math.max(0, (a.employees || 1) - 2);
        const jobsB = b.jobsCreated ?? Math.max(0, (b.employees || 1) - 2);
        return jobsB - jobsA;
      }
      case "funding":
        return (b.fundingRaised || 0) - (a.fundingRaised || 0);
      case "export":
        return (b.exportRevenue || 0) - (a.exportRevenue || 0);
      case "milestones": {
        const compA = a.milestones?.filter(m => m.completed).length || 0;
        const compB = b.milestones?.filter(m => m.completed).length || 0;
        return compB - compA;
      }
      default:
        return 0;
    }
  }).slice(0, 5);

  const getDimensionValue = (s: Startup) => {
    switch (dimension) {
      case "revenue": {
        const mrr = s.mrr ?? s.kpis?.mrr ?? 0;
        return `$${mrr.toLocaleString()} ${t("/ mo MRR")}`;
      }
      case "customers": {
        const cust = s.payingCustomers ?? s.totalCustomers ?? s.activeUsers ?? 0;
        return `${cust.toLocaleString()} ${t("Users / Clients")}`;
      }
      case "jobs": {
        const jobs = s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2);
        return `+${jobs} ${t("Tech Jobs Created")}`;
      }
      case "funding":
        return `$${(s.fundingRaised || 0).toLocaleString()} ${t("USD Raised")}`;
      case "export":
        return `$${(s.exportRevenue || 0).toLocaleString()} ${t("IT Export")}`;
      case "milestones": {
        const completed = s.milestones?.filter(m => m.completed).length || 0;
        const total = s.milestones?.length || 0;
        return `${completed}/${total} ${t("Milestones")} (${total > 0 ? Math.round((completed/total)*100) : 0}%)`;
      }
    }
  };

  return (
    <div id="top-performers-container" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t("Top Performing Startups Ranking")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("Ranked by verified business metrics and verified economic output.")}
            </p>
          </div>
        </div>

        {/* Dimension Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setDimension("revenue")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              dimension === "revenue" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("MRR / Revenue")}
          </button>
          <button
            onClick={() => setDimension("customers")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              dimension === "customers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Customers")}
          </button>
          <button
            onClick={() => setDimension("jobs")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              dimension === "jobs" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Jobs Created")}
          </button>
          <button
            onClick={() => setDimension("funding")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              dimension === "funding" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Funding")}
          </button>
          <button
            onClick={() => setDimension("export")}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              dimension === "export" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("IT Export")}
          </button>
        </div>
      </div>

      {/* Top 5 list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {sorted.map((s, idx) => {
          const rankColors = [
            "from-amber-400 to-amber-600 text-white", // 1st Gold
            "from-slate-300 to-slate-500 text-white", // 2nd Silver
            "from-amber-600 to-amber-800 text-white", // 3rd Bronze
            "from-slate-100 to-slate-200 text-slate-700", // 4th
            "from-slate-100 to-slate-200 text-slate-700"  // 5th
          ];

          return (
            <div
              key={s.id}
              onClick={() => onSelectStartup(s)}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 p-4 rounded-xl transition-all cursor-pointer flex flex-col justify-between hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs bg-gradient-to-br ${rankColors[idx]}`}>
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {s.district || "Qarshi"}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-800 text-xs truncate">
                  {s.name}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {s.industry} &bull; {s.founder}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <span className="text-[11px] font-black text-indigo-700 font-mono block truncate">
                  {getDimensionValue(s)}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wider font-semibold">
                  {t("Stage")}: {s.stage.replace("_", " ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
