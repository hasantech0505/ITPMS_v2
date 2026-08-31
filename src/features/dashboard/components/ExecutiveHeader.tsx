/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  Filter, 
  Calendar, 
  MapPin, 
  RefreshCw, 
  LayoutDashboard, 
  BarChart3, 
  Lightbulb,
  Clock,
  Sparkles
} from "lucide-react";
import { PeriodType } from "../utils/kpiCalculations";

interface ExecutiveHeaderProps {
  selectedYear: string;
  setSelectedYear: (y: string) => void;
  selectedPeriod: PeriodType;
  setSelectedPeriod: (p: PeriodType) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  lastUpdated: string;
  viewMode: "control_center" | "historical_bi" | "ideas_hub";
  setViewMode: (v: "control_center" | "historical_bi" | "ideas_hub") => void;
  t: (key: string, fallback?: string) => string;
}

export default function ExecutiveHeader({
  selectedYear,
  setSelectedYear,
  selectedPeriod,
  setSelectedPeriod,
  selectedRegion,
  setSelectedRegion,
  selectedDistrict,
  setSelectedDistrict,
  lastUpdated,
  viewMode,
  setViewMode,
  t
}: ExecutiveHeaderProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
      {/* Top Bar: Title & View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border" style={{ background: "rgba(0,229,255,0.14)", color: "var(--sidebar-accent,#00E5FF)", borderColor: "rgba(0,229,255,0.35)" }}>
              <Sparkles className="w-3 h-3" />
              {t("IT Park Kashkadarya")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {viewMode === "control_center"
                ? t("2026 Strategic Target Engine")
                : viewMode === "historical_bi"
                ? t("Official BI & Analytics Hub")
                : t("Strategic Initiatives & Proposals")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {viewMode === "control_center"
              ? t("executiveDashboard.controlCenterTitle", "EXECUTIVE CONTROL CENTER")
              : viewMode === "historical_bi"
              ? t("executiveDashboard.historicalBiTitle", "EXECUTIVE BI & ANALYTICS")
              : t("executiveDashboard.ideasHubTitle", "EXECUTIVE IDEAS & INITIATIVES HUB")}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {viewMode === "control_center"
              ? t(
                  "executiveDashboard.subtitle",
                  "Real-time strategic decision dashboard: Tracking 2026 annual KPIs, expected trajectories, risks, and international outreach."
                )
              : viewMode === "historical_bi"
              ? t(
                  "executiveDashboard.biSubtitle",
                  "Comprehensive official IT Park indicators, regional district breakdown, historical growth, and talent density metrics."
                )
              : t(
                  "executiveDashboard.ideasSubtitle",
                  "Executive pipeline of high-impact strategic proposals, ecosystem acceleration projects, and tech ventures."
                )}
          </p>
        </div>

        {/* View Switcher Tabs (Executive Navigation) */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shrink-0 self-start lg:self-center">
          <button
            type="button"
            onClick={() => setViewMode("control_center")}
            className={`px-3.5 py-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "control_center"
                ? "text-[#001217] shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
            style={viewMode === "control_center" ? { background: "var(--sidebar-accent, #00E5FF)" } : undefined}
          >
            <LayoutDashboard className={`w-4 h-4 ${viewMode === "control_center" ? "text-[#001217]" : "text-[var(--sidebar-accent,#00E5FF)]"}`} />
            <span>{t("executiveDashboard.tabControlCenter", "Executive Control")}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("historical_bi")}
            className={`px-3.5 py-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "historical_bi"
                ? "text-[#001217] shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
            style={viewMode === "historical_bi" ? { background: "var(--sidebar-accent, #00E5FF)" } : undefined}
          >
            <BarChart3 className={`w-4 h-4 ${viewMode === "historical_bi" ? "text-[#001217]" : "text-[var(--sidebar-accent,#00E5FF)]"}`} />
            <span>{t("executiveDashboard.tabHistoricalBi", "BI & Analytics")}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("ideas_hub")}
            className={`px-3.5 py-2 rounded-lg font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === "ideas_hub"
                ? "text-[#001217] shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
            style={viewMode === "ideas_hub" ? { background: "var(--sidebar-accent, #00E5FF)" } : undefined}
          >
            <Lightbulb className={`w-4 h-4 ${viewMode === "ideas_hub" ? "text-[#001217]" : "text-amber-300"}`} />
            <span>{t("executiveDashboard.tabIdeasHub", "Ideas Hub")}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-[var(--sidebar-accent,#00E5FF)]" />
            <span className="text-[10px] text-slate-400 uppercase font-bold">{t("Year:")}</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="2026" className="bg-slate-900 text-white">{t("2026 (Strategic Plan)")}</option>
              <option value="2025" className="bg-slate-900 text-white">{t("2025 (Historical)")}</option>
              <option value="2024" className="bg-slate-900 text-white">{t("2024 (Historical)")}</option>
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-slate-300">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-2">{t("Period:")}</span>
            {(["q1", "q2", "q3", "q4", "ytd"] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer uppercase ${
                  selectedPeriod === p
                    ? "bg-emerald-500 text-slate-950 font-black shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="Qashqadaryo" className="bg-slate-900 text-white">{t("Qashqadaryo Region")}</option>
              <option value="All Uzbekistan" className="bg-slate-900 text-white">{t("All Uzbekistan")}</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">{t("All Districts")}</option>
              <option value="Qarshi" className="bg-slate-900 text-white">{t("Qarshi City")}</option>
              <option value="Shahrisabz" className="bg-slate-900 text-white">{t("Shahrisabz")}</option>
              <option value="Kitob" className="bg-slate-900 text-white">{t("Kitob")}</option>
              <option value="Koson" className="bg-slate-900 text-white">{t("Koson")}</option>
              <option value="Muborak" className="bg-slate-900 text-white">{t("Muborak")}</option>
              <option value="Guzor" className="bg-slate-900 text-white">{t("Gʻuzor / Dehqonobod")}</option>
            </select>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-[var(--sidebar-accent,#00E5FF)]" />
          <span>{t("Updated:")} {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
