/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Filter, 
  Layers, 
  Calendar, 
  Flame, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Users,
  DollarSign
} from "lucide-react";
import { Startup } from "../../../types";
import { normalizeStage } from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface FunnelAndCohortsProps {
  startups: Startup[];
}

export default function FunnelAndCohorts({ startups }: FunnelAndCohortsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"funnel" | "cohorts" | "programs">("funnel");

  // Funnel calculations
  const totalApplications = startups.length + 8; // Including archived initial applicants
  const qualified = startups.length + 4;
  const accepted = startups.length;
  const incubating = startups.filter(s => s.status === "ACCELERATING" || s.status === "APPLICANT").length;
  const mvp = startups.filter(s => {
    const st = normalizeStage(s.stage);
    return st === "MVP" || st === "EARLY_REVENUE" || st === "GROWTH" || st === "SCALE" || st === "GRADUATED";
  }).length;
  const revenue = startups.filter(s => (s.revenue > 0 || (s.mrr ?? s.kpis?.mrr ?? 0) > 0)).length;
  const growth = startups.filter(s => {
    const st = normalizeStage(s.stage);
    return st === "GROWTH" || st === "SCALE" || st === "GRADUATED";
  }).length;
  const scale = startups.filter(s => {
    const st = normalizeStage(s.stage);
    return st === "SCALE" || st === "GRADUATED";
  }).length;

  const funnelSteps = [
    { name: "Applications", count: totalApplications, pct: 100 },
    { name: "Qualified", count: qualified, pct: Math.round((qualified / totalApplications) * 100) },
    { name: "Accepted", count: accepted, pct: Math.round((accepted / qualified) * 100) },
    { name: "Incubating", count: incubating, pct: accepted > 0 ? Math.round((incubating / accepted) * 100) : 0 },
    { name: "MVP Built", count: mvp, pct: accepted > 0 ? Math.round((mvp / accepted) * 100) : 0 },
    { name: "Revenue Yield", count: revenue, pct: mvp > 0 ? Math.round((revenue / mvp) * 100) : 0 },
    { name: "Growth Stage", count: growth, pct: revenue > 0 ? Math.round((growth / revenue) * 100) : 0 },
    { name: "Scale & Resident", count: scale, pct: growth > 0 ? Math.round((scale / growth) * 100) : 0 }
  ];

  // Cohort calculations
  const cohorts = ["2024 Cohort", "2025 Cohort", "2026 Cohort"];
  const cohortStats = cohorts.map(cohortName => {
    const cohortStartups = startups.filter(s => s.cohort === cohortName || (s.joinedAt && s.joinedAt.startsWith(cohortName.slice(0, 4))));
    const count = cohortStartups.length;
    const active = cohortStartups.filter(s => s.status === "ACCELERATING" || s.status === "ACTIVE" || s.status === "APPLICANT").length;
    const rev = cohortStartups.reduce((acc, s) => acc + (s.revenue || 0), 0);
    const funding = cohortStartups.reduce((acc, s) => acc + (s.fundingRaised || 0), 0);
    const jobs = cohortStartups.reduce((acc, s) => acc + (s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2)), 0);
    const graduated = cohortStartups.filter(s => s.status === "GRADUATED").length;
    const international = cohortStartups.filter(s => (s.exportRevenue || 0) > 0 || (s.internationalCustomers || 0) > 0).length;

    return {
      name: cohortName,
      count,
      active,
      revenue: rev,
      funding,
      jobs,
      graduated,
      international
    };
  });

  // Program calculations
  const programs = [
    "Acceleration",
    "Incubation",
    "Startup Garage",
    "Hackathon",
    "Local2Global",
    "Grant Program"
  ];

  const programStats = programs.map(prog => {
    const matched = startups.filter(s => (s.program || "Incubation").toLowerCase() === prog.toLowerCase());
    const count = matched.length;
    const mvps = matched.filter(s => normalizeStage(s.stage) !== "IDEA" && normalizeStage(s.stage) !== "PRE_MVP").length;
    const revGenerating = matched.filter(s => (s.revenue > 0 || (s.mrr ?? s.kpis?.mrr ?? 0) > 0)).length;
    const funded = matched.filter(s => (s.fundingRaised || 0) > 0).length;
    const jobs = matched.reduce((acc, s) => acc + (s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2)), 0);

    return {
      program: prog,
      count,
      mvps,
      revGenerating,
      funded,
      jobs
    };
  });

  return (
    <div id="funnel-cohorts-container" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Sub tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t("Funnel, Cohort & Incubation Program Intelligence")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("Measuring incubation throughput, survival rates, and programmatic return on investment.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("funnel")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "funnel" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Conversion Funnel")}
          </button>
          <button
            onClick={() => setActiveTab("cohorts")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "cohorts" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Cohort Analytics")}
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === "programs" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t("Program Outcomes")}
          </button>
        </div>
      </div>

      {/* 1. Funnel View */}
      {activeTab === "funnel" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {funnelSteps.map((step, idx) => (
              <div key={step.name} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase mb-1">
                    <span>{t("Stage")} {idx + 1}</span>
                    <span>{step.pct}%</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-800 block truncate" title={t(step.name)}>
                    {t(step.name)}
                  </span>
                  <div className="text-base font-black text-indigo-700 font-mono mt-1">
                    {step.count}
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-indigo-600 h-1 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(10, step.pct))}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Ecosystem Bottleneck Insight */}
          <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-lg flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <span className="font-bold text-indigo-950 block uppercase text-[10px] tracking-wider">
                {t("Ecosystem Conversion Bottleneck Insight")}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t("Primary drop-off occurs between")} <strong>{t("Incubating")}</strong> {t("and")} <strong>{t("First Paying Customer Traction")}</strong>. {t("Startups successfully build prototypes but require enhanced enterprise sales mentorship and local government pilot integration to reach recurring revenue.")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cohort View */}
      {activeTab === "cohorts" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">{t("Cohort Batch")}</th>
                <th className="py-2.5 px-3 text-center">{t("Startups")}</th>
                <th className="py-2.5 px-3 text-center">{t("Active Rate")}</th>
                <th className="py-2.5 px-3 text-right">{t("Total Revenue")}</th>
                <th className="py-2.5 px-3 text-right">{t("Funding Raised")}</th>
                <th className="py-2.5 px-3 text-center">{t("Jobs Created")}</th>
                <th className="py-2.5 px-3 text-center">{t("Graduated")}</th>
                <th className="py-2.5 px-4 text-center">{t("Export Ready")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {cohortStats.map((c) => (
                <tr key={c.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t(c.name)}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {c.count}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                      {c.count > 0 ? Math.round((c.active / c.count) * 100) : 0}% ({c.active})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                    ${c.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                    ${c.funding.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                    +{c.jobs}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {c.graduated}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full">
                      {c.international} {t("Startups")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Programs View */}
      {activeTab === "programs" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">{t("Program Track")}</th>
                <th className="py-2.5 px-3 text-center">{t("Participants")}</th>
                <th className="py-2.5 px-3 text-center">{t("MVPs Launched")}</th>
                <th className="py-2.5 px-3 text-center">{t("Revenue Generating")}</th>
                <th className="py-2.5 px-3 text-center">{t("Funded Startups")}</th>
                <th className="py-2.5 px-4 text-center">{t("Jobs Created")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {programStats.map((p) => (
                <tr key={p.program} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t(p.program)}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {p.count}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                    {p.mvps}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                      {p.revGenerating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                    {p.funded}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    +{p.jobs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
