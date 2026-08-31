/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  TrendingUp, 
  Users, 
  Globe, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  ChevronDown
} from "lucide-react";
import { Resident, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentYearlyTableProps {
  residents: Resident[];
  onSelect: (resident: Resident) => void;
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
  onAddNewClick?: () => void;
}

export default function ResidentYearlyTable({
  residents,
  onSelect,
  onUpdate,
  userRole,
  onSyncState,
  onAddNewClick
}: ResidentYearlyTableProps) {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [availableYears, setAvailableYears] = useState<string[]>(["2026", "2025", "2024", "2023"]);
  const [showAddYearInput, setShowAddYearInput] = useState(false);
  const [newYearVal, setNewYearVal] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [quarterFilter, setQuarterFilter] = useState<string>("ALL");
  const [industryFilter, setIndustryFilter] = useState<string>("ALL");

  // Filter residents applied or approved in selectedYear
  const yearResidents = residents.filter((r) => {
    const appYear = r.appliedAt ? r.appliedAt.slice(0, 4) : "";
    const apprvYear = r.approvedAt ? r.approvedAt.slice(0, 4) : "";
    const matchesYear = appYear === selectedYear || apprvYear === selectedYear || (r.appliedAt && r.appliedAt.includes(selectedYear));
    return matchesYear && r.status !== ResidentStatus.REMOVED;
  });

  // Search and dropdown filtering
  const filteredList = yearResidents.filter((r) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      (r.companyName || "").toLowerCase().includes(query) ||
      (r.director || "").toLowerCase().includes(query) ||
      (r.registrationNumber || "").includes(searchTerm) ||
      (r.industry || "").toLowerCase().includes(query);

    const matchesIndustry = industryFilter === "ALL" || r.industry === industryFilter;
    
    let matchesQuarter = true;
    if (quarterFilter !== "ALL") {
      const m = r.appliedAt ? parseInt(r.appliedAt.split("-")[1], 10) : 0;
      if (quarterFilter === "Q1") matchesQuarter = m >= 1 && m <= 3;
      else if (quarterFilter === "Q2") matchesQuarter = m >= 4 && m <= 6;
      else if (quarterFilter === "Q3") matchesQuarter = m >= 7 && m <= 9;
      else if (quarterFilter === "Q4") matchesQuarter = m >= 10 && m <= 12;
    }

    return matchesSearch && matchesIndustry && matchesQuarter;
  });

  // Calculate year metrics
  const totalExports = filteredList.reduce((acc, r) => acc + (r.exportVolume || 0), 0);
  const totalWorkforce = filteredList.reduce((acc, r) => acc + (r.employeesCount || 0), 0);
  const activeCount = filteredList.filter(r => r.status === ResidentStatus.ACTIVE).length;
  const pendingCount = filteredList.filter(r => r.status === ResidentStatus.PENDING).length;

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearVal || newYearVal.length !== 4 || isNaN(Number(newYearVal))) return;
    if (!availableYears.includes(newYearVal)) {
      setAvailableYears([newYearVal, ...availableYears]);
    }
    setSelectedYear(newYearVal);
    setNewYearVal("");
    setShowAddYearInput(false);
  };

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Company Name",
      "Director",
      "INN (Reg Number)",
      `Applied Date (${selectedYear})`,
      `Approved Date (${selectedYear})`,
      "Industry",
      "District",
      "Employees",
      "Export Volume ($)",
      "Domestic Volume ($)",
      "Status",
      "Benefits Applied"
    ];

    const rows = filteredList.map(r => [
      r.id,
      `"${r.companyName.replace(/"/g, '""')}"`,
      `"${r.director.replace(/"/g, '""')}"`,
      `"${r.registrationNumber}"`,
      r.appliedAt || "",
      r.approvedAt || "",
      `"${r.industry || ""}"`,
      `"${r.district || ""}"`,
      r.employeesCount || 0,
      r.exportVolume || 0,
      r.domesticVolume || 0,
      r.status,
      `"${(r.benefitsApplied || []).join("; ")}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IT_Park_Residents_${selectedYear}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-emerald-900 border border-emerald-800 p-5 rounded-xl text-emerald-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 rounded text-xs font-black uppercase tracking-wider">
              Year {selectedYear}
            </span>
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Yearly Resident Applications & Roster
            </h2>
          </div>
          <p className="text-xs text-emerald-200 font-medium">
            Differential yearly registry tracking application cycles, onboarding approvals, export metrics, and compliance for calendar year {selectedYear}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Year Selector Control */}
          <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-[10px] font-bold text-emerald-300 uppercase">Select Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-extrabold text-white outline-none cursor-pointer text-xs"
            >
              {availableYears.map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white font-bold">{y} Ledger</option>
              ))}
            </select>
          </div>

          {!showAddYearInput ? (
            <button
              onClick={() => setShowAddYearInput(true)}
              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Year
            </button>
          ) : (
            <form onSubmit={handleAddYear} className="flex items-center gap-1">
              <input
                type="text"
                placeholder="2027"
                maxLength={4}
                value={newYearVal}
                onChange={(e) => setNewYearVal(e.target.value)}
                className="w-16 px-2 py-1 bg-emerald-950 border border-emerald-500 rounded text-xs text-white font-bold text-center"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddYearInput(false)}
                className="px-1.5 py-1 text-emerald-300 text-xs"
              >
                ✕
              </button>
            </form>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {onAddNewClick && (
            <button
              onClick={onAddNewClick}
              className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add {selectedYear} Resident
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{selectedYear} Active Residents</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">{activeCount} <span className="text-xs text-slate-400 font-normal">firms</span></span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3" /> Certified & active
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{selectedYear} Pending Onboarding</span>
          <span className="text-xl font-extrabold text-amber-600 font-mono mt-0.5 block">{pendingCount} <span className="text-xs text-slate-400 font-normal">applications</span></span>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> In review / audit
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{selectedYear} Export Revenue</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">${(totalExports / 1000000).toFixed(2)}M</span>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
            <Globe className="w-3 h-3" /> Total international volume
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{selectedYear} Workforce Created</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">{(totalWorkforce || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">IT specialists</span></span>
          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
            <Users className="w-3 h-3" /> Local & expat jobs
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${selectedYear} residents by company name, director, INN, or stack...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Quarter:</span>
            <select
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All {selectedYear} Quarters</option>
              <option value="Q1">Q1 (Jan - Mar)</option>
              <option value="Q2">Q2 (Apr - Jun)</option>
              <option value="Q3">Q3 (Jul - Sep)</option>
              <option value="Q4">Q4 (Oct - Dec)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Industry:</span>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Industries</option>
              <option value="Software Development">Software Development</option>
              <option value="FinTech">FinTech</option>
              <option value="EdTech">EdTech</option>
              <option value="BPO & IT Services">BPO & IT Services</option>
              <option value="GameDev">GameDev</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">{selectedYear} Resident Company</th>
                <th className="py-3 px-4">INN (Reg No)</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Approved Date</th>
                <th className="py-3 px-4">Industry / Region</th>
                <th className="py-3 px-4 text-right">Employees</th>
                <th className="py-3 px-4 text-right">Export Volume ($)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Tax Incentives Applied</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-semibold">No resident records found for {selectedYear} matching filters.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-100">
                          {r.companyName.charAt(0)}
                        </div>
                        <div>
                          <button
                            onClick={() => onSelect(r)}
                            className="font-bold text-slate-800 hover:text-emerald-600 transition-colors text-left"
                          >
                            {r.companyName}
                          </button>
                          <span className="text-[10px] text-slate-400 block font-medium">Director: {r.director}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{r.registrationNumber}</td>

                    <td className="py-3 px-4 text-slate-600 font-medium">{r.appliedAt || `${selectedYear}-01-10`}</td>

                    <td className="py-3 px-4 text-slate-600 font-medium">{r.approvedAt || `${selectedYear}-02-01`}</td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 block">{r.industry || "Software Dev"}</span>
                      <span className="text-[10px] text-slate-400 block">{r.district || "Tashkent City"}</span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">{r.employeesCount || 0}</td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ${(r.exportVolume || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        r.status === ResidentStatus.ACTIVE
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === ResidentStatus.PENDING
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(r.benefitsApplied || ["0% Corp Tax", "7.5% PIT"]).slice(0, 2).map((b, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium border border-slate-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelect(r)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Inspect Record
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
