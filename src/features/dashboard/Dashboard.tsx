/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Clock, 
  MapPin
} from "lucide-react";
import { Startup, Resident, Office, Talent, Event, ActivityLog, Company, Contact, Meeting } from "../../types";
import { KpiTargetOverride } from "./types/kpiTypes";
import ExecutiveHeader from "./components/ExecutiveHeader";
import ExecutiveControlCenter from "./ExecutiveControlCenter";
import OfficialITParkDashboard from "./OfficialITParkDashboard";
import ExecutiveIdeasHub from "./ExecutiveIdeasHub";
import { useLanguage } from "../../lib/LanguageContext";
import { PeriodType } from "./utils/kpiCalculations";

interface DashboardProps {
  startups: Startup[];
  residents: Resident[];
  offices: Office[];
  talent: Talent[];
  events: Event[];
  companies: Company[];
  contacts: Contact[];
  meetings: Meeting[];
  activityLogs: ActivityLog[];
  kpiTargetOverrides: KpiTargetOverride[];
  onUpdateKpiTarget: (id: string, annualTarget: number, quarterlyTargets: { q1: number; q2: number; q3: number; q4: number }) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ 
  startups, 
  residents, 
  offices, 
  talent, 
  events, 
  companies,
  contacts,
  meetings,
  activityLogs, 
  kpiTargetOverrides,
  onUpdateKpiTarget,
  setActiveTab 
}: DashboardProps) {
  // View mode switcher: "control_center" (default strategic control center) | "historical_bi" | "ideas_hub"
  const [viewMode, setViewMode] = useState<"control_center" | "historical_bi" | "ideas_hub">(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "bi" || hash === "analytics" || hash === "dashboard?view=bi") return "historical_bi";
    if (hash === "ideas" || hash === "dashboard?view=ideas") return "ideas_hub";
    return "control_center";
  });

  const { t } = useLanguage();

  // Executive Filter State
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("ytd");
  const [selectedRegion, setSelectedRegion] = useState<string>("Qashqadaryo");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");

  const lastUpdated = t("Today at 09:30 AM (Real-time Sync)");

  // Handle URL hash sync for seamless browser Back/Forward navigation
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "bi" || hash === "analytics" || hash === "dashboard?view=bi") {
        setViewMode("historical_bi");
      } else if (hash === "ideas" || hash === "dashboard?view=ideas") {
        setViewMode("ideas_hub");
      } else if (hash === "dashboard" || hash === "control" || hash === "") {
        setViewMode("control_center");
      }
    };

    window.addEventListener("hashchange", handleHashSync);
    window.addEventListener("popstate", handleHashSync);
    return () => {
      window.removeEventListener("hashchange", handleHashSync);
      window.removeEventListener("popstate", handleHashSync);
    };
  }, []);

  const handleSetViewMode = (mode: "control_center" | "historical_bi" | "ideas_hub") => {
    setViewMode(mode);
    if (mode === "control_center") {
      window.history.pushState(null, "", "#dashboard");
    } else if (mode === "historical_bi") {
      window.history.pushState(null, "", "#dashboard?view=bi");
    } else if (mode === "ideas_hub") {
      window.history.pushState(null, "", "#dashboard?view=ideas");
    }
  };

  return (
    <div id="dashboard-wrapper" className="space-y-6">
      
      {/* 1. PERSISTENT EXECUTIVE HEADER & VIEW SWITCHER NAVIGATION */}
      <ExecutiveHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        lastUpdated={lastUpdated}
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        t={t}
      />

      {/* 2. PRIMARY EXECUTIVE DASHBOARD ACTIVE VIEW */}
      {viewMode === "control_center" && (
        <ExecutiveControlCenter
          selectedYear={selectedYear}
          selectedPeriod={selectedPeriod}
          selectedRegion={selectedRegion}
          selectedDistrict={selectedDistrict}
          setActiveTab={setActiveTab}
          residents={residents}
          startups={startups}
          offices={offices}
          events={events}
          companies={companies}
          contacts={contacts}
          meetings={meetings}
          activityLogs={activityLogs}
          kpiTargetOverrides={kpiTargetOverrides}
          onUpdateKpiTarget={onUpdateKpiTarget}
          t={t}
        />
      )}

      {viewMode === "historical_bi" && (
        <OfficialITParkDashboard
          residents={residents}
          startups={startups}
          onNavigateToResidents={() => setActiveTab("residents")}
        />
      )}

      {viewMode === "ideas_hub" && (
        <ExecutiveIdeasHub
          residents={residents}
          startups={startups}
          setActiveTab={setActiveTab}
        />
      )}

      {/* 3. AUDIT TRAIL & UPCOMING EVENTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80">
        
        {/* Live Audit Trail */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t("Live System Audit Trail")}</h3>
              <p className="text-[11px] text-slate-500">{t("Real-time system updates and administrative action logs.")}</p>
            </div>
            <button 
              onClick={() => setActiveTab("reports")} 
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-all uppercase cursor-pointer"
            >
              {t("Full Activity Logs")} &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {log.action} {t("by")} <span className="font-bold text-slate-900">{log.userName}</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.entity} : {log.entityId}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Events */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t("Upcoming Regional Events")}</h3>
              <p className="text-[11px] text-slate-500">{t("Acceleration & regional summits schedule.")}</p>
            </div>
            <button 
              onClick={() => setActiveTab("events")}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-all uppercase cursor-pointer"
            >
              {t("All Events")} &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 2).map((e) => (
              <div key={e.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-800">{e.title}</h4>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                    {t(e.eventType)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{e.venue} ({t(e.district)})</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
