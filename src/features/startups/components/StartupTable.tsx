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
  ChevronRight, 
  Trash2, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Startup } from "../../../types";
import { 
  calculateStartupHealth, 
  calculateInvestmentReadiness, 
  normalizeStage,
  LIFECYCLE_STAGES
} from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface StartupTableProps {
  startups: Startup[];
  onSelectStartup: (startup: Startup) => void;
  onOpenTraditionalProfile: (startup: Startup) => void;
  onDeleteStartup?: (id: string) => void;
  isReadOnly?: boolean;
}

export default function StartupTable({
  startups,
  onSelectStartup,
  onOpenTraditionalProfile,
  onDeleteStartup,
  isReadOnly
}: StartupTableProps) {
  const { t } = useLanguage();
  if (startups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t("No Startups Matched")}</h3>
        <p className="text-xs text-slate-500 mt-1">
          {t("Try adjusting your search query, district filter, stage selection, or health parameters.")}
        </p>
      </div>
    );
  }

  return (
    <div id="startup-table-container" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">{t("Startup")}</th>
              <th className="py-3.5 px-3">{t("District")}</th>
              <th className="py-3.5 px-3">{t("Stage")}</th>
              <th className="py-3.5 px-3">{t("Health & Reason")}</th>
              <th className="py-3.5 px-3">{t("Revenue / MRR")}</th>
              <th className="py-3.5 px-3">{t("Customers")}</th>
              <th className="py-3.5 px-3">{t("Jobs")}</th>
              <th className="py-3.5 px-3">{t("Funding")}</th>
              <th className="py-3.5 px-3">{t("Invest Readiness")}</th>
              <th className="py-3.5 px-3">{t("Next Action")}</th>
              <th className="py-3.5 px-3">{t("Status")}</th>
              <th className="py-3.5 px-4 text-right">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {startups.map((s) => {
              const health = calculateStartupHealth(s);
              const invest = calculateInvestmentReadiness(s);
              const stage = normalizeStage(s.stage);
              const mrr = s.mrr ?? s.kpis?.mrr ?? 0;
              const paying = s.payingCustomers ?? (s.totalCustomers ? Math.round(s.totalCustomers * 0.4) : (s.activeUsers ? Math.round(s.activeUsers * 0.08) : 0));
              const jobs = s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2);

              return (
                <tr
                  key={s.id}
                  id={`startup-row-${s.id}`}
                  onClick={() => onSelectStartup(s)}
                  className="hover:bg-indigo-50/30 transition-all cursor-pointer group"
                >
                  {/* Startup Name & Industry */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {s.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{s.name}</span>
                          {s.status === "GRADUATED" && (
                            <span title={t("Certified IT Park Resident")} className="text-emerald-600">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-600 font-medium">{s.industry}</span>
                          <span>&bull;</span>
                          <span>{s.cohort || `${s.foundedYear || 2025} ${t("Cohort")}`}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* District */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate max-w-[110px]">{s.district || "Qarshi"}</span>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md uppercase tracking-wider whitespace-nowrap">
                      {t(LIFECYCLE_STAGES.find(ls => ls.id === stage)?.label || stage.replace("_", " "))}
                    </span>
                  </td>

                  {/* Health Status & Reason */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1 max-w-[170px]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getHealthBadgeMeta(health.status).badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${getHealthBadgeMeta(health.status).dotClass}`} />
                          <span>{t(getHealthBadgeMeta(health.status).label)}</span>
                          {health.status !== "NO_DATA" && (
                            <span className="font-mono text-[9px] font-black opacity-80">{health.score}/100</span>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1 italic" title={health.reason}>
                        "{health.reason}"
                      </span>
                    </div>
                  </td>

                  {/* Revenue / MRR */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono">
                      <span className="font-bold text-slate-800 text-[11px] block">
                        ${mrr > 0 ? mrr.toLocaleString() : "0"} <span className="text-[9px] text-slate-400 font-sans">{t("/mo")}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ${(s.revenue || 0).toLocaleString()} {t("YTD")}
                      </span>
                    </div>
                  </td>

                  {/* Customers */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span className="font-bold text-slate-700 font-mono text-[11px] block">
                        {paying} <span className="text-[9px] text-slate-400 font-sans">{t("paying")}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {s.totalCustomers || s.activeUsers || 0} {t("total")}
                      </span>
                    </div>
                  </td>

                  {/* Jobs */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono">
                      <span className="font-bold text-slate-800 text-[11px] block">
                        +{jobs} <span className="text-[9px] text-emerald-600 font-sans font-bold">{t("new")}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {s.employees || 1} {t("team")}
                      </span>
                    </div>
                  </td>

                  {/* Funding */}
                  <td className="py-3.5 px-3">
                    <div>
                      <span className="font-bold text-slate-800 font-mono text-[11px] block">
                        ${(s.fundingRaised || 0).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 uppercase">
                        {s.fundingStatus || (s.fundingRaised > 0 ? t("Funded") : t("Bootstrapped"))}
                      </span>
                    </div>
                  </td>

                  {/* Investment Readiness */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold font-mono text-slate-700">{invest.score}</span>
                        <span className="text-[9px] text-slate-400">/100</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded w-max ${
                        invest.status === "Investor Ready"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : invest.status === "High Potential"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {t(invest.status)}
                      </span>
                    </div>
                  </td>

                  {/* Next Best Action */}
                  <td className="py-3.5 px-3">
                    <div className="max-w-[190px]">
                      {s.nextAction ? (
                        <div className="flex items-start gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                            s.nextAction.priority === "CRITICAL"
                              ? "bg-rose-500"
                              : s.nextAction.priority === "HIGH"
                              ? "bg-amber-500"
                              : "bg-indigo-500"
                          }`} />
                          <span className="text-[10px] text-slate-700 font-medium line-clamp-2" title={s.nextAction.action}>
                            {s.nextAction.action}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">{t("No next action set")}</span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase ${
                        s.status === "ACCELERATING" || s.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : s.status === "GRADUATED"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : s.status === "APPLICANT"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {t(s.status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenTraditionalProfile(s)}
                        title={t("View Official Company Profile Dossier")}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectStartup(s)}
                        title={t("Open 360° Profile")}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {!isReadOnly && onDeleteStartup && (
                        <button
                          onClick={() => {
                            if (confirm(`${t("Are you sure you want to remove startup")} "${s.name}"?`)) {
                              onDeleteStartup(s.id);
                            }
                          }}
                          title={t("Delete")}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count summary */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>{t("Showing")} <strong className="text-slate-700">{startups.length}</strong> {t("technology startups")}</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t("Healthy (Score ≥ 70)")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> {t("Attention (Score 45-69)")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> {t("At Risk (Score < 45)")}
          </span>
        </div>
      </div>
    </div>
  );
}
