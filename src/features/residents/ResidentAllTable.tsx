/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  ChevronRight, 
  Trash2, 
  Filter, 
  Download, 
  ChevronDown, 
  SlidersHorizontal,
  Plus,
  Eye,
  Settings,
  X,
  Check,
  AlertTriangle,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Award,
  Briefcase
} from "lucide-react";
import { Resident, ResidentStatus, UserRole, KASHKADARYA_DISTRICTS } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";
import ExportImportManager from "../../components/ExportImportManager";

interface ResidentAllTableProps {
  residents: Resident[];
  onSelect: (resident: Resident) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  onAdd?: (payload: Omit<Resident, "id">) => Promise<any> | void;
  userRole: string;
  onSyncState?: () => void;
  onAddNewClick: () => void;
}

export default function ResidentAllTable({ 
  residents, 
  onSelect, 
  onDelete, 
  onUpdate, 
  onAdd,
  userRole, 
  onSyncState,
  onAddNewClick
}: ResidentAllTableProps) {
  const { t } = useLanguage();

  // Export & Import Columns Schema
  const exportColumns = [
    { key: "companyName", label: "Company / Enterprise Name", required: true, type: "string" as const },
    { key: "registrationNumber", label: "Registration No / TIN", required: true, type: "string" as const },
    { key: "director", label: "Director / Founder", type: "string" as const },
    { key: "industry", label: "Industry Sector", type: "string" as const },
    { key: "district", label: "District (Kashkadarya)", type: "string" as const },
    { key: "status", label: "Resident Status", type: "string" as const },
    { key: "exportVolume", label: "IT Export Volume (USD)", type: "currency" as const },
    { key: "domesticVolume", label: "Domestic Sales Volume (USD)", type: "currency" as const },
    { key: "employeesCount", label: "Staff Headcount", type: "number" as const },
    { key: "email", label: "Official Email", type: "email" as const },
    { key: "phone", label: "Contact Phone", type: "phone" as const },
    { key: "website", label: "Website", type: "string" as const },
    { key: "appliedAt", label: "Certification Date", type: "date" as const },
    { key: "legalAddress", label: "Legal Address", type: "string" as const }
  ];

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("ALL");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [exportFilter, setExportFilter] = useState("ALL"); // ALL, LOW (<50k), MED (50k-1M), HIGH (1M+)
  const [staffFilter, setStaffFilter] = useState("ALL"); // ALL, SMALL (<50), LARGE (50+)
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, PENDING, SUSPENDED

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting States
  const [sortBy, setSortBy] = useState<keyof Resident>("companyName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    companyName: true,
    director: true,
    registrationNumber: true,
    exportVolume: true,
    employeesCount: true,
    status: true,
    industry: true,
    district: true
  });
  const [showColSettings, setShowColSettings] = useState(false);

  // Multi-select / Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter residents list (official active/pending/suspended/revoked ones only by default, excluding POTENTIAL and REMOVED unless they fit the search)
  const baseList = residents.filter(r => r.status !== ResidentStatus.POTENTIAL && r.status !== ResidentStatus.REMOVED);

  const filteredResidents = baseList.filter(r => {
    const matchesSearch = 
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.registrationNumber.includes(searchTerm) ||
      (r.assignedManager && r.assignedManager.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry = industryFilter === "ALL" || r.industry === industryFilter;
    const matchesDistrict = districtFilter === "ALL" || r.district === districtFilter;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;

    let matchesExport = true;
    if (exportFilter === "LOW") matchesExport = r.exportVolume < 50000;
    else if (exportFilter === "MED") matchesExport = r.exportVolume >= 50000 && r.exportVolume < 1000000;
    else if (exportFilter === "HIGH") matchesExport = r.exportVolume >= 1000000;

    let matchesStaff = true;
    if (staffFilter === "SMALL") matchesStaff = r.employeesCount < 50;
    else if (staffFilter === "LARGE") matchesStaff = r.employeesCount >= 50;

    return matchesSearch && matchesIndustry && matchesDistrict && matchesStatus && matchesExport && matchesStaff;
  });

  // Sort Logic
  const sortedResidents = [...filteredResidents].sort((a, b) => {
    let valA = a[sortBy] ?? "";
    let valB = b[sortBy] ?? "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedResidents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedResidents = sortedResidents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Resident) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedResidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedResidents.map(r => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: "ACTIVATE" | "SUSPEND") => {
    if (selectedIds.length === 0) return;
    const newStatus = action === "ACTIVATE" ? ResidentStatus.ACTIVE : ResidentStatus.SUSPENDED;
    
    if (confirm(`Are you sure you want to change status to ${newStatus} for ${selectedIds.length} selected residents?`)) {
      for (const id of selectedIds) {
        await onUpdate(id, { status: newStatus });
      }
      setSelectedIds([]);
      if (onSyncState) onSyncState();
    }
  };

  const getIndustries = () => {
    const set = new Set<string>();
    baseList.forEach(r => { if (r.industry) set.add(r.industry); });
    return Array.from(set);
  };

  const getDistricts = () => {
    const set = new Set<string>(KASHKADARYA_DISTRICTS);
    baseList.forEach(r => { if (r.district) set.add(r.district); });
    return Array.from(set);
  };

  // Quick summary aggregates for Total Residents
  const totalActiveCount = baseList.filter(r => r.status === ResidentStatus.ACTIVE).length;
  const totalPendingCount = baseList.filter(r => r.status === ResidentStatus.PENDING).length;
  const sumExportUSD = baseList.reduce((sum, r) => sum + (r.exportVolume || 0), 0);
  const sumEmployees = baseList.reduce((sum, r) => sum + (r.employeesCount || 0), 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <p className="text-xs text-slate-300 font-medium">
            Central registry of all active, pending, and certified IT Park Uzbekistan resident companies.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isReadOnly && (
            <button
              id="header-add-resident-btn"
              onClick={onAddNewClick}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add New Resident
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards for Total Residents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-800 font-mono">{baseList.length}</span>
              <span className="text-[10px] font-bold text-emerald-600">{totalActiveCount} active</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total IT Exports</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-800 font-mono">${(sumExportUSD / 1000000).toFixed(1)}M</span>
              <span className="text-[10px] font-bold text-slate-400">USD</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IT Workforce</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-800 font-mono">{(sumEmployees || 0).toLocaleString()}</span>
              <span className="text-[10px] font-bold text-slate-400">jobs</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Certification</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-amber-600 font-mono">{totalPendingCount}</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase">Under Review</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search and Professional Filters bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-all-input"
              type="text"
              placeholder={t("Search company name, director, or INN registration number...")}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between">
            {/* Column Visibility Configuration Dropdown */}
            <div className="relative">
              <button
                id="column-visibility-toggle-btn"
                onClick={() => setShowColSettings(!showColSettings)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 cursor-pointer transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Columns</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showColSettings && (
                <div className="absolute right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-xl p-3.5 z-40 w-48 space-y-2 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visible Fields</span>
                    <button onClick={() => setShowColSettings(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {Object.keys(visibleColumns).map((col) => (
                      <label key={col} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col as keyof typeof visibleColumns]}
                          onChange={() => setVisibleColumns({
                            ...visibleColumns,
                            [col]: !visibleColumns[col as keyof typeof visibleColumns]
                          })}
                          className="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="capitalize">{col.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export & Import Manager */}
            <ExportImportManager
              module="residents"
              moduleTitle="Residents Directory"
              data={filteredResidents}
              columns={exportColumns}
              onImportCompleted={(importedRecords) => {
                if (importedRecords && importedRecords.length > 0 && onAdd) {
                  importedRecords.forEach((rec) => {
                    onAdd({
                      companyName: rec.companyName || rec.company || "Imported Enterprise",
                      registrationNumber: rec.registrationNumber || rec.regNo || `REG-${Math.floor(100000 + Math.random() * 900000)}`,
                      director: rec.director || rec.founder || "N/A",
                      email: rec.email || "info@resident.uz",
                      phone: rec.phone || "+998 75 000 0000",
                      industry: rec.industry || "Software Development",
                      district: rec.district || "Qarshi",
                      exportVolume: Number(rec.exportVolume) || 0,
                      domesticVolume: Number(rec.domesticVolume) || 0,
                      employeesCount: Number(rec.employeesCount) || 5,
                      status: (rec.status as ResidentStatus) || ResidentStatus.ACTIVE,
                      appliedAt: rec.appliedAt || rec.startDate || new Date().toISOString().split("T")[0],
                      website: rec.website || "",
                      legalAddress: rec.legalAddress || `${rec.district || "Qarshi"}, Kashkadarya Region`,
                      benefitsApplied: ["0% Corporate Income Tax", "7.5% Personal Income Tax"],
                      notes: [],
                      documents: []
                    });
                  });
                }
                if (onSyncState) onSyncState();
              }}
              userRole={userRole as any}
            />

            {/* Add Resident button */}
            {!isReadOnly && (
              <button
                id="table-apply-certified-btn"
                onClick={onAddNewClick}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-600/10"
              >
                <Plus className="w-4 h-4" />
                <span>{t("Add Resident")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Select Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          {/* Status Filter */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value={ResidentStatus.ACTIVE}>Active</option>
              <option value={ResidentStatus.PENDING}>Pending Review</option>
              <option value={ResidentStatus.SUSPENDED}>Suspended</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Industry</span>
            <select
              value={industryFilter}
              onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer"
            >
              <option value="ALL">All Industries</option>
              {getIndustries().map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">District</span>
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              {getDistricts().map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* Export Volume Filter */}
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Exports Bracket</span>
            <select
              value={exportFilter}
              onChange={(e) => { setExportFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer"
            >
              <option value="ALL">All Ranges</option>
              <option value="LOW">Low (&lt; $50k)</option>
              <option value="MED">Mid ($50k - $1M)</option>
              <option value="HIGH">High ($1M+)</option>
            </select>
          </div>

          {/* Staff Count Filter */}
          <div className="space-y-1 col-span-2 md:col-span-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Company Size</span>
            <select
              value={staffFilter}
              onChange={(e) => { setStaffFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer"
            >
              <option value="ALL">All Sizes</option>
              <option value="SMALL">Small (&lt; 50 staff)</option>
              <option value="LARGE">Large (50+ staff)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Controls Bar (shown only when rows selected) */}
      {selectedIds.length > 0 && !isReadOnly && (
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-800 font-mono">{selectedIds.length} Residents selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("ACTIVATE")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1 rounded-md cursor-pointer transition-all uppercase"
            >
              Bulk Activate
            </button>
            <button
              onClick={() => handleBulkAction("SUSPEND")}
              className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1 rounded-md cursor-pointer transition-all uppercase"
            >
              Bulk Suspend
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-800 font-bold text-[10px] px-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Master Corporate Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedResidents.length && paginatedResidents.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                {visibleColumns.companyName && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("companyName")}>
                    Resident Enterprise {sortBy === "companyName" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.director && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("director")}>
                    Director {sortBy === "director" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.registrationNumber && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("registrationNumber")}>
                    INN (Tax Code) {sortBy === "registrationNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.industry && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("industry")}>
                    Industry {sortBy === "industry" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.district && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("district")}>
                    District/Region {sortBy === "district" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.exportVolume && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort("exportVolume")}>
                    IT Exports {sortBy === "exportVolume" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.employeesCount && (
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 text-right" onClick={() => handleSort("employeesCount")}>
                    Headcount {sortBy === "employeesCount" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                )}
                {visibleColumns.status && <th className="py-3 px-4">Status</th>}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedResidents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-semibold">No resident enterprises found matching these criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedResidents.map((r) => {
                  const isRowSelected = selectedIds.includes(r.id);
                  return (
                    <tr
                      id={`resident-row-${r.id}`}
                      key={r.id}
                      onClick={() => onSelect(r)}
                      className={`hover:bg-slate-50/70 transition-all text-xs cursor-pointer ${
                        isRowSelected ? "bg-emerald-50/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => toggleSelectRow(r.id)}
                          className="rounded-sm border-slate-200 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      {visibleColumns.companyName && (
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block truncate max-w-xs">{r.companyName}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-xs block">{r.legalAddress}</span>
                        </td>
                      )}
                      {visibleColumns.director && <td className="py-3 px-4 text-slate-600 font-medium">{r.director}</td>}
                      {visibleColumns.registrationNumber && <td className="py-3 px-4 font-mono font-bold text-slate-500">{r.registrationNumber}</td>}
                      {visibleColumns.industry && <td className="py-3 px-4"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">{r.industry || "Software"}</span></td>}
                      {visibleColumns.district && <td className="py-3 px-4 text-slate-500 truncate max-w-[120px]">{r.district || "Tashkent"}</td>}
                      {visibleColumns.exportVolume && (
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                          ${r.exportVolume ? r.exportVolume.toLocaleString() : "0"}
                        </td>
                      )}
                      {visibleColumns.employeesCount && (
                        <td className="py-3 px-4 text-right font-mono text-slate-500">
                          {r.employeesCount ? r.employeesCount.toLocaleString() : "0"} staff
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                            r.status === ResidentStatus.ACTIVE ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            r.status === ResidentStatus.PENDING ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onSelect(r)}
                            className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                            title="Inspect Detailed Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isReadOnly && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove licensing certificate for ${r.companyName}? This is permanent.`)) {
                                  onDelete(r.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                              title="Revoke Certificate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>
              Showing <b>{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</b> to{" "}
              <b>{Math.min(currentPage * pageSize, totalItems)}</b> of <b>{totalItems}</b> corporate records
            </span>
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-1.5 py-0.5 border border-slate-200 rounded-md bg-white cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>per page</span>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono font-bold">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              &lt;&lt;
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              &lt;
            </button>
            <span className="px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-slate-50"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
