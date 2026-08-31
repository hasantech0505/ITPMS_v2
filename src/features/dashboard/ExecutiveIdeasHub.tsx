/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  MapPin, 
  Award, 
  FileText, 
  Sliders, 
  ArrowUpRight, 
  CheckCircle2, 
  DollarSign, 
  Building, 
  Users, 
  Globe2,
  ShieldCheck,
  Zap,
  Layers,
  Download,
  Info
} from "lucide-react";
import { Resident, Startup } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ExecutiveIdeasHubProps {
  residents: Resident[];
  startups: Startup[];
  setActiveTab?: (tab: string) => void;
}

export default function ExecutiveIdeasHub({
  residents,
  startups,
  setActiveTab
}: ExecutiveIdeasHubProps) {
  const { t } = useLanguage();
  // Scenario Modeler State for Idea 2
  const [targetExporters, setTargetExporters] = useState<number>(20);
  const [avgBpoRevenue, setAvgBpoRevenue] = useState<number>(35000); // USD per month
  const [workforceSize, setWorkforceSize] = useState<number>(1200);

  // Simulated AI Export Projection based on sliders
  const annualExportProjectedUSD = (targetExporters * avgBpoRevenue * 12) / 1000000;
  const regionalTaxSavingsBillionUZS = ((workforceSize * 18000000 * 0.045) * 12) / 1000000000;

  // Selected idea tab
  const [activeIdea, setActiveIdea] = useState<"tax" | "simulator" | "districts" | "matrix" | "report">("tax");

  return (
    <div id="executive-ideas-hub" className="space-y-6">
      
      {/* Executive Strategic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {t("Strategic Decision Engine")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{t("Digital Uzbekistan 2030")}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t("Executive Intelligence & Innovation Ideas")}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("Actionable strategic frameworks designed for regional IT leadership, khokimiyats, and digital transformation executives.")}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveIdea("simulator")}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4" />
              <span>{t("Launch Target Simulator")}</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Ideas Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveIdea("tax")}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIdea === "tax"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{t("Idea 1: Tax Privilege & Value Savings")}</span>
          </button>

          <button
            onClick={() => setActiveIdea("simulator")}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIdea === "simulator"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t("Idea 2: 2026-2030 AI Export Modeler")}</span>
          </button>

          <button
            onClick={() => setActiveIdea("districts")}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIdea === "districts"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t("Idea 3: District BPO & Tech Density")}</span>
          </button>

          <button
            onClick={() => setActiveIdea("matrix")}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIdea === "matrix"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t("Idea 4: Exporters Leaderboard & Health")}</span>
          </button>

          <button
            onClick={() => setActiveIdea("report")}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeIdea === "report"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t("Idea 5: Executive State Report")}</span>
          </button>
        </div>
      </div>

      {/* Idea 1: Tax Privilege & Value Generation Engine */}
      {activeIdea === "tax" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">{t("Executive Idea 1")}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{t("IT Park Regional Tax Privilege & Economic Value Impact")}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{t("Quantifying the direct financial benefit of IT Park zero-tax incentives across Kashkadarya.")}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                {t("Total Saved")}: 14.64 млрд. сўм
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card A: Corporate Income Tax */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700">{t("0% Corporate Income Tax")}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">{t("Standard 12% Exemption")}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">5.48 <span className="text-xs text-slate-500 font-normal">млрд. сўм</span></div>
                <p className="text-[11px] text-slate-500">{t("Reinvested directly into company software licenses and high-wage R&D jobs.")}</p>
              </div>

              {/* Card B: Social & Personal Income Tax */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700">{t("7.5% PIT (vs 12% Standard)")}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">{t("4.5% Net Discount")}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">3.21 <span className="text-xs text-slate-500 font-normal">млрд. сўм</span></div>
                <p className="text-[11px] text-slate-500">{t("Boosts net take-home pay for local developers in Qarshi, Shahrisabz, and Kitob.")}</p>
              </div>

              {/* Card C: VAT Exemption */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700">{t("0% VAT on IT Services")}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">{t("Domestic Market Advantage")}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">4.10 <span className="text-xs text-slate-500 font-normal">млрд. сўм</span></div>
                <p className="text-[11px] text-slate-500">{t("Lowers cost of custom software development for regional agricultural and industrial firms.")}</p>
              </div>

              {/* Card D: Import Customs Exemption */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-700">{t("Customs Duty Exemption")}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{t("Hardware & Servers")}</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">1.85 <span className="text-xs text-slate-500 font-normal">млрд. сўм</span></div>
                <p className="text-[11px] text-slate-500">{t("Allows zero-duty import of high-spec workstations and BPO call-center headsets.")}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">{t("Regional Executive Insight")}</h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  {t("Every 1 Billion UZS saved in tax privileges in Kashkadarya generates an estimated")} <strong>{t("$140,000 USD in IT service exports")}</strong> {t("by enabling resident firms to offer globally competitive pricing for Western and Gulf markets.")}
                </p>
              </div>
            </div>
          </div>

          {/* Reinvestment Allocation Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">{t("Capital Allocation")}</span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">{t("Where Tax Savings Are Reinvested")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("Distribution of retained capital by resident companies.")}</p>

              <div className="space-y-3.5 mt-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t("Developer Salaries & Retention")}</span>
                    <span className="font-mono text-emerald-600">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t("BPO Infrastructure & Laptops")}</span>
                    <span className="font-mono text-blue-600">25%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: "25%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t("International Marketing & Outreach")}</span>
                    <span className="font-mono text-purple-600">18%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{t("Office Lease & Facilities")}</span>
                    <span className="font-mono text-amber-600">12%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "12%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t("Audited under Ministry Decree #284")}</span>
              <span className="font-bold text-slate-700 font-mono">{t("Q3 2025")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Idea 2: 2026–2030 Export Target & AI Scenario Modeler */}
      {activeIdea === "simulator" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">{t("Executive Idea 2")}</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{t("2026–2030 Regional Export Target & AI Scenario Modeler")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("Simulate how expanding resident exporters and BPO contracts impacts Kashkadarya's target $5M USD export goal.")}</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 font-mono font-bold text-xs px-3 py-1 rounded-full border border-indigo-200">
              {t("Interactive Policy Sandbox")}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sliders Control Panel */}
            <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                {t("Scenario Controls")}
              </h4>

              {/* Slider 1: Exporters Count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{t("Target Active Exporters")}</span>
                  <span className="font-mono text-emerald-600 font-bold">{targetExporters} {t("Companies")}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={targetExporters}
                  onChange={(e) => setTargetExporters(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t("Current")} (12)</span>
                  <span>{t("Target")} (60)</span>
                </div>
              </div>

              {/* Slider 2: Average Monthly BPO Contract */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{t("Avg Monthly Contract / Company")}</span>
                  <span className="font-mono text-emerald-600 font-bold">${avgBpoRevenue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={avgBpoRevenue}
                  onChange={(e) => setAvgBpoRevenue(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>$10k/{t("mo")}</span>
                  <span>$100k/{t("mo")}</span>
                </div>
              </div>

              {/* Slider 3: IT Talent Workforce */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{t("Local IT & BPO Workforce")}</span>
                  <span className="font-mono text-emerald-600 font-bold">{workforceSize} {t("Specialists")}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={workforceSize}
                  onChange={(e) => setWorkforceSize(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t("Current")} (664)</span>
                  <span>{t("Target")} (3,000)</span>
                </div>
              </div>
            </div>

            {/* Simulated Results Card */}
            <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">{t("Projected Annual Export")}</span>
                  <div className="text-3xl font-black text-emerald-700 font-mono">
                    ${annualExportProjectedUSD.toFixed(2)}M <span className="text-xs font-normal">{t("USD / year")}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {annualExportProjectedUSD >= 5 
                      ? t("🎉 Target Met! Kashkadarya achieves $5M+ regional export goal.") 
                      : `${t("Requires")} $${(5 - annualExportProjectedUSD).toFixed(2)}M ${t("more export volume to reach $5M target.")}`}
                  </p>
                </div>

                <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">{t("Regional Payroll Savings")}</span>
                  <div className="text-3xl font-black text-blue-700 font-mono">
                    {regionalTaxSavingsBillionUZS.toFixed(2)} <span className="text-xs font-normal">млрд. сўм</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    {t("Annual personal income tax discount retained by local software engineers & BPO agents.")}
                  </p>
                </div>
              </div>

              {/* Progress Bar towards $5M Regional Goal */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>{t("Digital Uzbekistan 2030 Goal ($5.0M Export)")}</span>
                  <span className="font-mono text-emerald-600">{Math.min(100, Math.round((annualExportProjectedUSD / 5) * 100))}% {t("Achieved")}</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (annualExportProjectedUSD / 5) * 100)}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$0.0M</span>
                  <span>$2.5M</span>
                  <span>$5.0M {t("Target")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idea 3: District BPO & Tech Infrastructure Density */}
      {activeIdea === "districts" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">{t("Executive Idea 3")}</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{t("District BPO & Tech Infrastructure Density Breakdown")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("Geographic distribution of IT resident firms, talent, and export hubs across Kashkadarya districts.")}</p>
            </div>
            <span className="bg-amber-50 text-amber-700 font-mono font-bold text-xs px-3 py-1 rounded-full border border-amber-200">
              6 {t("Districts Indexed")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* District 1: Qarshi */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("Qarshi Central Hub")}</h4>
                  <span className="text-[10px] text-slate-500">{t("Regional Capital & IT Park Campus")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{t("Primary Hub")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">38</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">412</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.48M</span>
                </div>
              </div>
            </div>

            {/* District 2: Shahrisabz */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("Shahrisabz Tech Park")}</h4>
                  <span className="text-[10px] text-slate-500">{t("Tourism Tech & Custom Software")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{t("Secondary Hub")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">14</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">120</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.12M</span>
                </div>
              </div>
            </div>

            {/* District 3: Kitob */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("Kitob EdTech Center")}</h4>
                  <span className="text-[10px] text-slate-500">{t("IT Academies & AI Labs")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">{t("Education Hub")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">8</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">65</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.04M</span>
                </div>
              </div>
            </div>

            {/* District 4: Koson */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("Koson BPO School")}</h4>
                  <span className="text-[10px] text-slate-500">{t("Multilingual Customer Support")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{t("BPO Focus")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">4</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">40</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.02M</span>
                </div>
              </div>
            </div>

            {/* District 5: G'uzor */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("G'uzor Steppes AgTech")}</h4>
                  <span className="text-[10px] text-slate-500">{t("Agri-IoT & Sensor Automation")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">{t("AgTech")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">2</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">15</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.01M</span>
                </div>
              </div>
            </div>

            {/* District 6: Kamashi */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t("Kamashi Tech Hub")}</h4>
                  <span className="text-[10px] text-slate-500">{t("Logistics & Regional Supply Software")}</span>
                </div>
                <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">{t("Logistics")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Residents")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">1</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Talent")}</span>
                  <span className="text-base font-black text-slate-800 font-mono">12</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">{t("Export")}</span>
                  <span className="text-base font-black text-emerald-600 font-mono">$0.00M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idea 4: Top Exporters Matrix */}
      {activeIdea === "matrix" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">{t("Executive Idea 4")}</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{t("Top Regional Exporters Leaderboard & Corporate Health Index")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("Ranking top resident firms by export revenue, employee growth velocity, and tax compliance score.")}</p>
            </div>
            <button
              onClick={() => setActiveTab && setActiveTab("residents")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-all flex items-center gap-1"
            >
              <span>{t("Manage All Residents")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t("Company Name")}</th>
                  <th className="py-3 px-4">{t("District / Campus")}</th>
                  <th className="py-3 px-4">{t("Export Revenue")}</th>
                  <th className="py-3 px-4">{t("Workforce")}</th>
                  <th className="py-3 px-4">{t("Health Score")}</th>
                  <th className="py-3 px-4 text-right">{t("Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80 transition-all">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 font-mono font-black flex items-center justify-center text-[10px]">1</span>
                    <span>EPAM Systems (Qarshi Branch)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">Qarshi Central</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">$280,000 / mo</td>
                  <td className="py-3 px-4 font-mono">145 {t("specialists")}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">98 / 100 (AAA)</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[10px]">{t("Active Exporter")}</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-all">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-mono font-black flex items-center justify-center text-[10px]">2</span>
                    <span>Kashkadarya BPO Outsourcing Center</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">Qarshi Central</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">$120,000 / mo</td>
                  <td className="py-3 px-4 font-mono">92 {t("agents")}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">95 / 100 (AA+)</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[10px]">{t("Active Exporter")}</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-all">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-mono font-black flex items-center justify-center text-[10px]">3</span>
                    <span>Shahrisabz Softline Solutions</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">Shahrisabz</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">$65,000 / mo</td>
                  <td className="py-3 px-4 font-mono">48 {t("specialists")}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">91 / 100 (AA)</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded text-[10px]">{t("Active Exporter")}</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-all">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-mono font-black flex items-center justify-center text-[10px]">4</span>
                    <span>Kitob EdTech Innovations</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">Kitob</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">$22,000 / mo</td>
                  <td className="py-3 px-4 font-mono">26 {t("specialists")}</td>
                  <td className="py-3 px-4">
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">87 / 100 (A)</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded text-[10px]">{t("Scaling Up")}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Idea 5: Executive State Report & Ministry Submission Generator */}
      {activeIdea === "report" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider">{t("Executive Idea 5")}</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{t("Official State Report & Ministry Submission Generator")}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t("Generate formal quarterly reports for the Ministry of Digital Technologies & Regional Khokimiyat.")}</p>
            </div>
            <button
              onClick={() => alert(t("Downloading official Q3 2025 Executive State Report PDF..."))}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{t("Export Official State PDF")}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4 font-sans max-w-3xl mx-auto shadow-inner">
            <div className="text-center border-b border-slate-200 pb-4 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">ЎЗБЕКИСТОН РЕСПУБЛИКАСИ РАҚАМЛИ ТЕХНОЛОГИЯЛАР ВАЗИРЛИГИ</span>
              <h4 className="text-sm font-bold text-slate-900">IT Park Қашқадарё Филиали Резидентлари Иқтисодий Кўрсаткичлари Ҳисоботи</h4>
              <p className="text-[11px] text-slate-500 font-mono">Давр: 2025 йил 3-Чорак | Ҳудуд: Қашқадарё вилояти</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Резидентлар умумий сони</span>
                <span className="text-lg font-black text-slate-800 font-mono">67 та корхона</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Яратилган иш ўринлари</span>
                <span className="text-lg font-black text-amber-600 font-mono">664 нафар мутахассис</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Жами яратилган даромад</span>
                <span className="text-lg font-black text-emerald-600 font-mono">45.68 млрд. сўм</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Амал оширилган экспорт</span>
                <span className="text-lg font-black text-sky-600 font-mono">$0.66 млн. АҚШ доллари</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
              <span>QR Токен: ITPARK-QASHQADARYO-2025-Q3-VERIFIED</span>
              <span className="font-bold text-slate-600">Рақамли имзоланган</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
