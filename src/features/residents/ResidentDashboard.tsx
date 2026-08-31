/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Globe, 
  Layers, 
  FileCheck, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Filter,
  BarChart2,
  Sparkles,
  Plus
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Resident, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentDashboardProps {
  residents: Resident[];
  onSelect: (resident: Resident) => void;
  onAddNewClick?: () => void;
}

export default function ResidentDashboard({ residents, onSelect, onAddNewClick }: ResidentDashboardProps) {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [timeframeMode, setTimeframeMode] = useState<"MONTHLY" | "QUARTERLY">("MONTHLY");

  const registeredResidents = residents.filter(r => r.status !== ResidentStatus.POTENTIAL && r.status !== ResidentStatus.REMOVED);
  const activeCount = registeredResidents.filter(r => r.status === ResidentStatus.ACTIVE).length;
  const pendingCount = registeredResidents.filter(r => r.status === ResidentStatus.PENDING).length;
  const potentialCount = residents.filter(r => r.status === ResidentStatus.POTENTIAL).length;

  const totalExport = registeredResidents.reduce((acc, r) => acc + (r.exportVolume || 0), 0);
  const totalDomestic = registeredResidents.reduce((acc, r) => acc + (r.domesticVolume || 0), 0);
  const totalStaff = registeredResidents.reduce((acc, r) => acc + (r.employeesCount || 0), 0);

  // Industry Distribution
  const industriesMap: Record<string, number> = {};
  registeredResidents.forEach(r => {
    const ind = r.industry || "Software Development";
    industriesMap[ind] = (industriesMap[ind] || 0) + 1;
  });
  const industryData = Object.entries(industriesMap).map(([name, value]) => ({ name, value }));

  // District Distribution
  const districtsMap: Record<string, number> = {};
  registeredResidents.forEach(r => {
    const dist = r.district || "Mirzo Ulugbek District";
    districtsMap[dist] = (districtsMap[dist] || 0) + 1;
  });
  const districtData = Object.entries(districtsMap).map(([name, value]) => ({ name, value }));

  // Compute Monthly Onboarding Intake
  const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthlyIntakeData = monthsList.map((monthName, idx) => {
    const monthNum = idx + 1; // 1 to 12
    const matchingResidents = registeredResidents.filter(r => {
      const dateStr = r.appliedAt || r.approvedAt || "";
      if (!dateStr) return false;
      const parts = dateStr.split("-");
      const rYear = parts[0] || "2026";
      const rMonth = parseInt(parts[1], 10) || 1;
      
      const yearMatches = selectedYear === "ALL" || rYear === selectedYear;
      return yearMatches && rMonth === monthNum;
    });

    const count = matchingResidents.length;
    const monthExportVolume = matchingResidents.reduce((acc, r) => acc + (r.exportVolume || 0), 0);

    return {
      period: monthName,
      newResidents: count,
      targetGoal: 4,
      accumulatedExports: monthExportVolume / 1000 // in kUSD
    };
  });

  // Compute Quarterly Onboarding Intake
  const quarterlyIntakeData = [
    { period: "Q1 (Jan-Mar)", quarterNum: 1 },
    { period: "Q2 (Apr-Jun)", quarterNum: 2 },
    { period: "Q3 (Jul-Sep)", quarterNum: 3 },
    { period: "Q4 (Oct-Dec)", quarterNum: 4 }
  ].map((q) => {
    const matchingResidents = registeredResidents.filter(r => {
      const dateStr = r.appliedAt || r.approvedAt || "";
      if (!dateStr) return false;
      const parts = dateStr.split("-");
      const rYear = parts[0] || "2026";
      const rMonth = parseInt(parts[1], 10) || 1;
      
      const yearMatches = selectedYear === "ALL" || rYear === selectedYear;
      let inQuarter = false;
      if (q.quarterNum === 1) inQuarter = rMonth >= 1 && rMonth <= 3;
      if (q.quarterNum === 2) inQuarter = rMonth >= 4 && rMonth <= 6;
      if (q.quarterNum === 3) inQuarter = rMonth >= 7 && rMonth <= 9;
      if (q.quarterNum === 4) inQuarter = rMonth >= 10 && rMonth <= 12;

      return yearMatches && inQuarter;
    });

    const count = matchingResidents.length;
    const qExportVolume = matchingResidents.reduce((acc, r) => acc + (r.exportVolume || 0), 0);

    return {
      period: q.period,
      newResidents: count,
      targetGoal: 10,
      accumulatedExports: qExportVolume / 1000
    };
  });

  const chartData = timeframeMode === "MONTHLY" ? monthlyIntakeData : quarterlyIntakeData;
  const totalAdmittedInPeriod = chartData.reduce((acc, item) => acc + item.newResidents, 0);

  const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

  const activities = [
    { id: "1", type: "cert", desc: "EPAM Systems submitted Q1 2026 Audit Report", time: "2 hours ago", status: "success" },
    { id: "2", type: "onb", desc: "Samarkand AI Hub uploaded draft bylaws", time: "5 hours ago", status: "pending" },
    { id: "3", type: "mon", desc: "Critical network violation resolved for OneSoft", time: "1 day ago", status: "success" },
    { id: "4", type: "rem", desc: "GigaCode LLC license formally revoked by board", time: "3 days ago", status: "danger" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-black rounded text-[10px] uppercase tracking-widest">
              Executive Overview
            </span>
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              IT Park Uzbekistan Resident Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Real-time analytics, quarterly admissions velocity, export revenues, and total resident statistics.
          </p>
        </div>

        {onAddNewClick && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="dashboard-add-resident-btn"
              onClick={onAddNewClick}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Resident
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{t("Active Residents")}</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">{activeCount} <span className="text-xs text-slate-400 font-normal">/ {registeredResidents.length}</span></span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+12% vs last year</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{t("Aggregate Exports")}</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">${(totalExport / 1000000).toFixed(1)}M <span className="text-xs text-slate-400 font-normal">USD</span></span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% growth yield</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{t("Total Workforce")}</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">{(totalStaff || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">staff</span></span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-1">
              <Users className="w-3 h-3" />
              <span>Avg 150 employees / firm</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{t("Onboarding & Pipeline")}</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">{pendingCount + potentialCount} <span className="text-xs text-slate-400 font-normal">Active</span></span>
            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold mt-1">
              <Zap className="w-3 h-3" />
              <span>{pendingCount} pending audit</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* NEW: Quarterly & Monthly Onboarding Velocity Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider">
                Admissions Rate
              </span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                New Resident Admissions (Monthly & Quarterly Trends)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tracks the velocity of newly onboarded IT Park resident companies across calendar months and quarters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setTimeframeMode("MONTHLY")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  timeframeMode === "MONTHLY" 
                    ? "bg-white text-emerald-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Monthly Intake
              </button>
              <button
                onClick={() => setTimeframeMode("QUARTERLY")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  timeframeMode === "QUARTERLY" 
                    ? "bg-white text-emerald-700 shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Quarterly Intake
              </button>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="2026">2026 Calendar Year</option>
                <option value="2025">2025 Calendar Year</option>
                <option value="2024">2024 Calendar Year</option>
                <option value="ALL">All Recorded Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Summary Chips for Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admitted in Selected Window</span>
            <span className="text-base font-extrabold text-slate-800 font-mono mt-0.5 block">{totalAdmittedInPeriod} companies</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Onboarding Pace</span>
            <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block">
              {(totalAdmittedInPeriod / (timeframeMode === "MONTHLY" ? 12 : 4)).toFixed(1)} / {timeframeMode === "MONTHLY" ? "month" : "quarter"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Target Goal</span>
            <span className="text-base font-extrabold text-indigo-600 font-mono mt-0.5 block">
              {timeframeMode === "MONTHLY" ? "4 per month" : "10 per quarter"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth Velocity</span>
            <span className="text-base font-extrabold text-emerald-600 font-mono mt-0.5 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> +22.4% YoY
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart View */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} fontWeight={600} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none", color: "#fff", fontSize: "12px" }}
                formatter={(value: any, name: any) => [
                  name === "newResidents" ? `${value} New Residents` : name === "targetGoal" ? `${value} Planned Target` : `$${value}k USD`,
                  name === "newResidents" ? "Newly Admitted" : name === "targetGoal" ? "Admissions Target" : "Est. Initial Exports"
                ]}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "11px", fontWeight: "600" }} />
              <Bar dataKey="newResidents" name="Newly Admitted Residents" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={38} />
              <Bar dataKey="targetGoal" name="Admissions Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={38} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Distribution Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t("Residents by Industry")}</h3>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} companies`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{registeredResidents.length}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">{t("Companies")}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 mt-4 border-t border-slate-100 pt-3">
              {industryData.map((d, index) => (
                <div key={d.name} className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="truncate">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional District Distribution Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t("Residents by District/Region")}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [`${value} Residents`, 'Count']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45}>
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Section: Recent Activities & Regime Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              {t("Recent Activity & Audits")}
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-semibold">Real-time logs</span>
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3 overflow-hidden">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    act.status === "success" ? "bg-emerald-500" :
                    act.status === "danger" ? "bg-rose-500" : "bg-amber-500"
                  }`}></span>
                  <p className="font-semibold text-slate-700 truncate">{act.desc}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regime Quick Facts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs md:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {t("Regime Benefits Checklist")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">0% Corporate Income Tax</span>
                <span className="text-[10px] text-slate-500 block">Exempted from flat corporate rates on all export yields.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">7.5% Personal Income Tax</span>
                <span className="text-[10px] text-slate-500 block">Flat preferential tax brackets for all registered company staff.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">0% Customs Duties</span>
                <span className="text-[10px] text-slate-500 block">Duty-free import of hardware, server rigs, and high-tech tools.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

