/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe2, 
  ChevronDown, 
  Filter, 
  Download, 
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info
} from "lucide-react";
import { Resident, Startup } from "../../types";
import { REGIONAL_PERFORMANCE_DATA } from "./data/kpiData";
import { useLanguage } from "../../lib/LanguageContext";

interface OfficialITParkDashboardProps {
  residents: Resident[];
  startups: Startup[];
  onNavigateToResidents?: () => void;
}

export default function OfficialITParkDashboard({
  residents,
  startups,
  onNavigateToResidents
}: OfficialITParkDashboardProps) {
  const { t } = useLanguage();
  // Filters matching screenshot
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("3 Чорак");
  const [growthMode, setGrowthMode] = useState<"cumulative" | "quarterly">("cumulative");
  const [selectedRegion, setSelectedRegion] = useState<string>("Қашқадарё вилояти");
  const [displayMode, setDisplayMode] = useState<"general" | "report">("general");
  const [scriptType, setScriptType] = useState<"cyrl" | "latn">("cyrl");

  // Historical Dataset matching official IT Park Regional trend charts
  // Years: 2017 to 2026
  const years = ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

  // Yearly data matching the screenshot numbers
  const historicalData: Record<string, {
    residents: number;
    employees: number;
    revenueBillionUZS: number;
    exportMillionUSD: number;
  }> = {
    "2017": { residents: 0, employees: 0, revenueBillionUZS: 0.0, exportMillionUSD: 0.0 },
    "2018": { residents: 0, employees: 0, revenueBillionUZS: 0.0, exportMillionUSD: 0.0 },
    "2019": { residents: 0, employees: 0, revenueBillionUZS: 0.0, exportMillionUSD: 0.0 },
    "2020": { residents: 0, employees: 0, revenueBillionUZS: 0.0, exportMillionUSD: 0.0 },
    "2021": { residents: 0, employees: 0, revenueBillionUZS: 0.0, exportMillionUSD: 0.0 },
    "2022": { residents: 21, employees: 163, revenueBillionUZS: 15.10, exportMillionUSD: 0.65 },
    "2023": { residents: 31, employees: 432, revenueBillionUZS: 45.07, exportMillionUSD: 1.33 },
    "2024": { residents: 65, employees: 664, revenueBillionUZS: 59.28, exportMillionUSD: 0.91 },
    "2025": { residents: 67, employees: 664, revenueBillionUZS: 45.68, exportMillionUSD: 0.66 },
    "2026": { residents: 75, employees: 561, revenueBillionUZS: 23.70, exportMillionUSD: 0.51 },
  };

  // Get current active metrics based on filters
  const currentData = historicalData[selectedYear] || historicalData["2025"];

  // Helper for text translation between Uzbek Cyrillic and Latin / English
  const label = (cyrlText: string, latnText: string) => {
    return scriptType === "cyrl" ? cyrlText : latnText;
  };

  return (
    <div id="official-itpark-dashboard" className="space-y-6">
      
      {/* Top Filter Bar - Replicating screenshot dropdowns exactly */}
      <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs px-4 py-2 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quarter Dropdown */}
          <div className="relative">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs px-4 py-2 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="1 Чорак">{label("1 Чорак", "1-Chorak (Q1)")}</option>
              <option value="2 Чорак">{label("2 Чорак", "2-Chorak (Q2)")}</option>
              <option value="3 Чорак">{label("3 Чорак", "3-Chorak (Q3)")}</option>
              <option value="4 Чорак">{label("4 Чорак", "4-Chorak (Q4)")}</option>
              <option value="Yillik">{label("Йиллик", "Yillik (Annual)")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Metric Growth Mode Dropdown */}
          <div className="relative">
            <select
              value={growthMode}
              onChange={(e) => setGrowthMode(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs px-4 py-2 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="cumulative">{label("Ўсиб борувчи", "O'sib boruvchi (Cumulative)")}</option>
              <option value="quarterly">{label("Чораклик", "Choraklik (Quarterly)")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Region & Script Switchers */}
        <div className="flex items-center gap-2">
          {/* Script Switcher */}
          <button
            onClick={() => setScriptType(scriptType === "cyrl" ? "latn" : "cyrl")}
            className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            title={t("Toggle Uzbek Script (Cyrillic / Latin)")}
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{scriptType === "cyrl" ? "Ўз (Кирилл)" : "Uz (Lotin)"}</span>
          </button>

          {/* Region Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs px-4 py-2 pr-8 rounded-xl shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Қашқадарё вилояти">{label("Қашқадарё вилояти", "Qashqadaryo viloyati")}</option>
              <option value="Тошкент шаҳри">{label("Тошкент шаҳри", "Toshkent shahri")}</option>
              <option value="Самарқанд вилояти">{label("Самарқанд вилояти", "Samarqand viloyati")}</option>
              <option value="Фарғона вилояти">{label("Фарғона вилояти", "Farg'ona viloyati")}</option>
              <option value="Бухоро вилояти">{label("Бухоро вилояти", "Buxoro viloyati")}</option>
              <option value="Барча ҳудудлар">{label("Барча ҳудудлар", "Barcha hududlar (All)")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Primary Top KPI Cards (4 Cards matching official portal style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Resident Count */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-emerald-500/30 transition-all">
          <span className="text-slate-700 font-bold text-sm sm:text-base tracking-tight">
            {label("Резидент сони", "Rezident soni")}
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
            {currentData.residents}
          </div>
        </div>

        {/* KPI 2: Employee Count */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-amber-500/30 transition-all">
          <span className="text-amber-600 font-bold text-sm sm:text-base tracking-tight">
            {label("Ходимлар сони", "Xodimlar soni")}
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-amber-500 tracking-tight font-sans">
            {currentData.employees}
          </div>
        </div>

        {/* KPI 3: Total Revenue in Billion UZS */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-emerald-500/30 transition-all">
          <span className="text-emerald-700 font-bold text-sm sm:text-base tracking-tight">
            {label("Жами даромади млрд. сўм", "Jami daromadi mlrd. so'm")}
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight font-sans">
            {currentData.revenueBillionUZS.toFixed(2)}
          </div>
        </div>

        {/* KPI 4: Export Volume in Million USD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-2 hover:border-sky-500/30 transition-all">
          <span className="text-sky-700 font-bold text-sm sm:text-base tracking-tight">
            {label("Экспорт ҳажми миллион АҚШ доллари", "Eksport hajmi million AQSh dollari")}
          </span>
          <div className="text-4xl sm:text-5xl font-extrabold text-sky-500 tracking-tight font-sans">
            {currentData.exportMillionUSD.toFixed(2)}
          </div>
        </div>

      </div>

      {/* Main 4 Historical Bar Chart Panels (2x2 Grid for optimal readability & no overlapping text) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Resident Count Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {label("Резидент сони динамикаси", "Rezident soni dinamikasi")}
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {t("Peak")}: 75 ({label("2026 йил", "2026-yil")})
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 px-1 border-b border-slate-200">
            {years.map(yr => {
              const val = historicalData[yr].residents;
              const maxVal = 80;
              const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isSelected = yr === selectedYear;

              return (
                <div key={yr} className="flex flex-col items-center flex-1 group relative">
                  {/* Metric Value on Top of Bar */}
                  <span className={`text-[11px] font-bold mb-1.5 transition-all ${
                    isSelected ? "text-emerald-700 font-extrabold scale-110" : "text-slate-500 group-hover:text-slate-900"
                  }`}>
                    {val > 0 ? val : "0"}
                  </span>

                  {/* Vertical Bar Container */}
                  <div className="w-full bg-slate-100/80 h-36 flex items-end justify-center rounded-t-md overflow-hidden relative">
                    <div 
                      style={{ height: `${Math.max(heightPercent, val > 0 ? 8 : 3)}%` }}
                      className={`w-full transition-all duration-300 rounded-t-sm ${
                        isSelected 
                          ? "bg-[#70B22C] shadow-sm shadow-emerald-500/30" 
                          : val > 0 
                            ? "bg-emerald-500/70 group-hover:bg-emerald-600" 
                            : "bg-slate-200/60"
                      }`}
                    />
                  </div>

                  {/* Clean X-Axis Year Label */}
                  <span className={`text-[11px] font-bold mt-2 transition-all ${
                    isSelected ? "text-emerald-800 font-black" : "text-slate-500"
                  }`}>
                    {yr.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
            <span>2017 – 2026 {label("йиллар бўйича динамика", "yillar bo'yicha dinamika")}</span>
            <span className="text-slate-500 font-mono text-[11px]">{selectedYear}-йил: <strong className="text-slate-800">{historicalData[selectedYear]?.residents || 0} та</strong></span>
          </div>
        </div>

        {/* Chart 2: Employee Workforce Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {label("Ходимлар сони динамикаси", "Xodimlar soni dinamikasi")}
              </h3>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              {t("Max")}: 664 ({label("2024-2025 йиллар", "2024-2025-yillar")})
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 px-1 border-b border-slate-200">
            {years.map(yr => {
              const val = historicalData[yr].employees;
              const maxVal = 700;
              const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isSelected = yr === selectedYear;

              return (
                <div key={yr} className="flex flex-col items-center flex-1 group relative">
                  {/* Metric Value on Top of Bar */}
                  <span className={`text-[10px] font-bold mb-1.5 transition-all ${
                    isSelected ? "text-amber-700 font-extrabold scale-110" : "text-slate-500 group-hover:text-slate-900"
                  }`}>
                    {val > 0 ? val : "0"}
                  </span>

                  {/* Vertical Bar Container */}
                  <div className="w-full bg-slate-100/80 h-36 flex items-end justify-center rounded-t-md overflow-hidden relative">
                    <div 
                      style={{ height: `${Math.max(heightPercent, val > 0 ? 8 : 3)}%` }}
                      className={`w-full transition-all duration-300 rounded-t-sm ${
                        isSelected 
                          ? "bg-amber-500 shadow-sm shadow-amber-500/30" 
                          : val > 0 
                            ? "bg-amber-400/80 group-hover:bg-amber-500" 
                            : "bg-slate-200/60"
                      }`}
                    />
                  </div>

                  {/* Clean X-Axis Year Label */}
                  <span className={`text-[11px] font-bold mt-2 transition-all ${
                    isSelected ? "text-amber-800 font-black" : "text-slate-500"
                  }`}>
                    {yr.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
            <span>2017 – 2026 {label("йиллар бўйича динамика", "yillar bo'yicha dinamika")}</span>
            <span className="text-slate-500 font-mono text-[11px]">{selectedYear}-йил: <strong className="text-slate-800">{historicalData[selectedYear]?.employees || 0} та</strong></span>
          </div>
        </div>

        {/* Chart 3: Total Revenue Billion UZS Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {label("Жами даромади (млрд. сўм)", "Jami daromadi (mlrd. so'm)")}
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {t("Peak")}: 59.28 ({label("2024 йил", "2024-yil")})
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 px-1 border-b border-slate-200">
            {years.map(yr => {
              const val = historicalData[yr].revenueBillionUZS;
              const maxVal = 65;
              const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isSelected = yr === selectedYear;

              return (
                <div key={yr} className="flex flex-col items-center flex-1 group relative">
                  {/* Metric Value on Top of Bar */}
                  <span className={`text-[10px] font-bold mb-1.5 transition-all ${
                    isSelected ? "text-emerald-700 font-extrabold scale-110" : "text-slate-500 group-hover:text-slate-900"
                  }`}>
                    {val > 0 ? val.toFixed(1) : "0"}
                  </span>

                  {/* Vertical Bar Container */}
                  <div className="w-full bg-slate-100/80 h-36 flex items-end justify-center rounded-t-md overflow-hidden relative">
                    <div 
                      style={{ height: `${Math.max(heightPercent, val > 0 ? 8 : 3)}%` }}
                      className={`w-full transition-all duration-300 rounded-t-sm ${
                        isSelected 
                          ? "bg-[#70B22C] shadow-sm shadow-emerald-500/30" 
                          : val > 0 
                            ? "bg-emerald-500/70 group-hover:bg-emerald-600" 
                            : "bg-slate-200/60"
                      }`}
                    />
                  </div>

                  {/* Clean X-Axis Year Label */}
                  <span className={`text-[11px] font-bold mt-2 transition-all ${
                    isSelected ? "text-emerald-800 font-black" : "text-slate-500"
                  }`}>
                    {yr.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
            <span>2017 – 2026 {label("йиллар бўйича динамика", "yillar bo'yicha dinamika")}</span>
            <span className="text-slate-500 font-mono text-[11px]">{selectedYear}-йил: <strong className="text-slate-800">{historicalData[selectedYear]?.revenueBillionUZS.toFixed(2)} млрд</strong></span>
          </div>
        </div>

        {/* Chart 4: Export Volume Million USD Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {label("Экспорт ҳажми (млн. АҚШ доллар)", "Eksport hajmi (mln. AQSh dollar)")}
              </h3>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
              {t("Peak")}: $1.33M ({label("2023 йил", "2023-yil")})
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-8 pb-2 px-1 border-b border-slate-200">
            {years.map(yr => {
              const val = historicalData[yr].exportMillionUSD;
              const maxVal = 1.5;
              const heightPercent = maxVal > 0 ? (val / maxVal) * 100 : 0;
              const isSelected = yr === selectedYear;

              return (
                <div key={yr} className="flex flex-col items-center flex-1 group relative">
                  {/* Metric Value on Top of Bar */}
                  <span className={`text-[10px] font-bold mb-1.5 transition-all ${
                    isSelected ? "text-sky-700 font-extrabold scale-110" : "text-slate-500 group-hover:text-slate-900"
                  }`}>
                    {val > 0 ? val.toFixed(2) : "0"}
                  </span>

                  {/* Vertical Bar Container */}
                  <div className="w-full bg-slate-100/80 h-36 flex items-end justify-center rounded-t-md overflow-hidden relative">
                    <div 
                      style={{ height: `${Math.max(heightPercent, val > 0 ? 8 : 3)}%` }}
                      className={`w-full transition-all duration-300 rounded-t-sm ${
                        isSelected 
                          ? "bg-sky-500 shadow-sm shadow-sky-500/30" 
                          : val > 0 
                            ? "bg-sky-400/80 group-hover:bg-sky-500" 
                            : "bg-slate-200/60"
                      }`}
                    />
                  </div>

                  {/* Clean X-Axis Year Label */}
                  <span className={`text-[11px] font-bold mt-2 transition-all ${
                    isSelected ? "text-sky-800 font-black" : "text-slate-500"
                  }`}>
                    {yr.slice(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-1">
            <span>2017 – 2026 {label("йиллар бўйича динамика", "yillar bo'yicha dinamika")}</span>
            <span className="text-slate-500 font-mono text-[11px]">{selectedYear}-йил: <strong className="text-slate-800">${historicalData[selectedYear]?.exportMillionUSD.toFixed(2)}M</strong></span>
          </div>
        </div>

      </div>

      {/* 5. GEOGRAPHIC DISTRIBUTION / DISTRICT PERFORMANCE (DYNAMIC ADMINISTRATIVE DISTRICTS, NO EXPORT) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#70B22C]/15 text-emerald-800 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300/40">
                {label("Географик тақсимот", "Geografik taqsimot")}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{label("Қашқадарё вилояти", "Qashqadaryo viloyati")}</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1.5 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              {label("ГЕОГРАФИК ТАҚСИМОТ", "GEOGRAFIK TAQSIMOT")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {label("Қашқадарё вилояти туманлари бўйича IT-парк резидентлари ва яратилган иш ўринлари кўрсаткичлари", "Qashqadaryo viloyati tumanlari bo'yicha IT-park rezidentlari va yaratilgan ish o'rinlari ko'rsatkichlari")}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label("ЖАМИ ТУМАНЛАР", "JAMI TUMANLAR")}</div>
                <div className="text-base font-extrabold text-slate-900 font-mono">{REGIONAL_PERFORMANCE_DATA.length} {label("та", "ta")}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                {REGIONAL_PERFORMANCE_DATA.length}
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Grid: 3 cards desktop, 2 cards tablet, 1 card mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGIONAL_PERFORMANCE_DATA.map((d) => {
            const resPct = d.residentsTarget > 0 ? Math.round((d.residentsActual / d.residentsTarget) * 100) : 0;
            const jobsPct = d.jobsTarget > 0 ? Math.round((d.jobsActual / d.jobsTarget) * 100) : 0;
            const overallPerformancePct = Math.round((resPct + jobsPct) / 2);
            const statusKey = overallPerformancePct >= 80 ? "ON TRACK" : overallPerformancePct >= 60 ? "AT RISK" : "BEHIND";

            return (
              <div
                key={d.districtId}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:bg-white hover:border-emerald-500/50 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="space-y-3.5">
                  {/* District Name & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200/50 pb-2.5">
                    <div className="min-w-0">
                      <h4 className="text-base font-black text-slate-900 tracking-tight break-words">
                        {d.districtName}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${
                        statusKey === "ON TRACK"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : statusKey === "AT RISK"
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {statusKey === "ON TRACK" && label("ГРАФИКДА", "ON TRACK")}
                      {statusKey === "AT RISK" && label("ХАВФ ОСТИДА", "AT RISK")}
                      {statusKey === "BEHIND" && label("ОРТДА ҚОЛМОҚДА", "BEHIND")}
                    </span>
                  </div>

                  {/* Residents */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {label("Резидентлар", "Rezidentlar")}
                      </span>
                      <span className="font-extrabold text-emerald-700 font-mono">
                        {resPct}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400 font-medium">{label("Амалда / Режа", "Amalda / Reja")}</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        {d.residentsActual} <span className="text-slate-400 font-normal">/ {d.residentsTarget}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, resPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Jobs Created */}
                  <div className="p-3 bg-white border border-slate-200/80 rounded-xl space-y-1.5 shadow-2xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        {label("Иш ўринлари", "Ish o'rinlari")}
                      </span>
                      <span className="font-extrabold text-sky-700 font-mono">
                        {jobsPct}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400 font-medium">{label("Амалда / Режа", "Amalda / Reja")}</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        {d.jobsActual.toLocaleString()} <span className="text-slate-400 font-normal">/ {d.jobsTarget.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, jobsPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



    </div>
  );
}
