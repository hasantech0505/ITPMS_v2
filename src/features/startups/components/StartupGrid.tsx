/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { getHealthBadgeMeta } from "../utils/startupCalculations";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Target 
} from "lucide-react";
import { Startup } from "../../../types";
import { 
  calculateStartupHealth, 
  calculateInvestmentReadiness, 
  normalizeStage,
  LIFECYCLE_STAGES
} from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface StartupGridProps {
  startups: Startup[];
  onSelectStartup: (startup: Startup) => void;
  onOpenTraditionalProfile: (startup: Startup) => void;
}

export default function StartupGrid({
  startups,
  onSelectStartup,
  onOpenTraditionalProfile
}: StartupGridProps) {
  const { t } = useLanguage();
  if (startups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t("No Startups Matched")}</h3>
        <p className="text-xs text-slate-500 mt-1">{t("Refine your search or filters.")}</p>
      </div>
    );
  }

  return (
    <div id="startup-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {startups.map((s) => {
        const health = calculateStartupHealth(s);
        const invest = calculateInvestmentReadiness(s);
        const stage = normalizeStage(s.stage);
        const mrr = s.mrr ?? s.kpis?.mrr ?? 0;
        const paying = s.payingCustomers ?? (s.totalCustomers ? Math.round(s.totalCustomers * 0.4) : (s.activeUsers ? Math.round(s.activeUsers * 0.08) : 0));
        const jobs = s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2);

        return (
          <div
            key={s.id}
            id={`startup-card-${s.id}`}
            onClick={() => onSelectStartup(s)}
            className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                        {s.name}
                      </h3>
                      {s.status === "GRADUATED" && (
                        <span title={t("Certified IT Park Resident")} className="text-emerald-600">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{s.industry}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-0.5 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {s.district || "Qarshi"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    s.status === "ACCELERATING" || s.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : s.status === "GRADUATED"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {t(s.status)}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded uppercase">
                    {t(LIFECYCLE_STAGES.find(ls => ls.id === stage)?.label || stage.replace("_", " "))}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                {s.description}
              </p>

              {/* Health and Invest Badges */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getHealthBadgeMeta(health.status).badgeClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${getHealthBadgeMeta(health.status).dotClass}`} />
                    <span>{t(getHealthBadgeMeta(health.status).label)}</span>
                    {health.status !== "NO_DATA" && (
                      <span className="font-mono text-[9px] font-black">{health.score}/100</span>
                    )}
                  </span>
                </div>

                <div className="text-[10px] font-semibold text-slate-500">
                  {t("Invest")}: <span className="font-mono font-bold text-slate-800">{invest.score}/100</span>
                </div>
              </div>

              {/* Health Reason note */}
              <div className="mt-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-1 italic">
                "{health.reason}"
              </div>
            </div>

            {/* Metrics Row */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50/70 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">{t("MRR (USD)")}</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    ${mrr > 0 ? mrr.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">{t("Paying Users")}</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {paying}
                  </span>
                </div>
                <div className="bg-slate-50/70 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">{t("Jobs Created")}</span>
                  <span className="text-xs font-black text-emerald-600 font-mono">
                    +{jobs}
                  </span>
                </div>
              </div>

              {/* Next Action Box */}
              {s.nextAction && (
                <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-700 bg-indigo-50/40 p-2 rounded-lg border border-indigo-100">
                  <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-bold text-indigo-900 block text-[9px] uppercase tracking-wider">{t("Next Action")}</span>
                    <span className="line-clamp-1">{s.nextAction.action}</span>
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTraditionalProfile(s);
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>{t("Dossier")}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStartup(s);
                  }}
                  className="text-[11px] font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t("360° Profile")}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
