/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Save, 
  User, 
  Calendar, 
  FileText, 
  Check, 
  Clock, 
  TrendingUp,
  Plus,
  Search,
  Filter,
  DollarSign,
  Briefcase,
  Users,
  ShieldCheck,
  FileCheck,
  Globe,
  Trash2,
  ExternalLink,
  Download
} from "lucide-react";
import { Resident, ResidentQuarterlyReport, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentReportsGridProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

const QUARTERS: { quarter: "Q1" | "Q2" | "Q3" | "Q4"; year: number }[] = [
  { quarter: "Q1", year: 2025 },
  { quarter: "Q2", year: 2025 },
  { quarter: "Q3", year: 2025 },
  { quarter: "Q4", year: 2025 },
  { quarter: "Q1", year: 2026 }
];

export default function ResidentReportsGrid({ 
  residents, 
  onUpdate, 
  userRole, 
  onSyncState 
}: ResidentReportsGridProps) {
  const { t } = useLanguage();

  // Active or Suspended Residents who submit reports
  const activeResidents = residents.filter(
    r => r.status === ResidentStatus.ACTIVE || r.status === ResidentStatus.SUSPENDED
  );

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedQuarterFilter, setSelectedQuarterFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"MATRIX" | "LEDGER">("MATRIX");

  // Audit Cell Modal state
  const [selectedCell, setSelectedCell] = useState<{
    resident: Resident;
    report: ResidentQuarterlyReport;
  } | null>(null);

  const [auditForm, setAuditForm] = useState({
    status: "NOT_SUBMITTED" as "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "LATE",
    reviewer: "Dilnoza Alimova",
    comments: "",
    exportVolume: 0,
    domesticVolume: 0,
    employeesCount: 0,
    taxesSaved: 0,
    exportCountries: "",
    productsExported: "",
    documentUrl: ""
  });

  // New Report Filing Modal State
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileForm, setFileForm] = useState({
    residentId: activeResidents[0]?.id || "",
    quarter: "Q1" as "Q1" | "Q2" | "Q3" | "Q4",
    year: 2026,
    status: "SUBMITTED" as "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "LATE",
    exportVolume: 0,
    domesticVolume: 0,
    employeesCount: 0,
    taxesSaved: 0,
    exportCountries: "USA, Germany, UAE",
    productsExported: "Custom Enterprise Software & Cloud Services",
    documentUrl: "https://it-park.uz/declarations/Q1_2026_Report.pdf",
    comments: "Quarterly declaration submitted for audit."
  });

  // Filter residents based on search
  const filteredResidents = activeResidents.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (r.companyName || "").toLowerCase().includes(query) ||
      (r.registrationNumber || "").includes(searchQuery) ||
      (r.industry || "").toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (statusFilter !== "ALL") {
      const hasStatus = (r.quarterlyReports || []).some(rep => rep.status === statusFilter);
      if (!hasStatus) return false;
    }

    return true;
  });

  // Calculate top KPI stats
  const allReportsList = activeResidents.flatMap(r => r.quarterlyReports || []);
  const totalReportsCount = allReportsList.length;
  const approvedReports = allReportsList.filter(r => r.status === "APPROVED");
  const pendingReports = allReportsList.filter(r => r.status === "SUBMITTED");
  const lateReports = allReportsList.filter(r => r.status === "LATE");

  const totalAuditedExports = approvedReports.reduce((acc, r) => acc + (r.reportedExportVolume || 0), 0);
  const totalTaxesSaved = approvedReports.reduce((acc, r) => acc + (r.taxesSaved || 0), 0);

  const complianceRate = activeResidents.length > 0 
    ? Math.round((approvedReports.length / (activeResidents.length * QUARTERS.length)) * 100) 
    : 0;

  // Handle clicking a cell in the matrix
  const handleCellClick = (resident: Resident, q: "Q1" | "Q2" | "Q3" | "Q4", y: number) => {
    let report = (resident.quarterlyReports || []).find(r => r.quarter === q && r.year === y);
    
    if (!report) {
      report = {
        quarter: q,
        year: y,
        status: "NOT_SUBMITTED",
        deadline: `${y}-${q === "Q1" ? "04-15" : q === "Q2" ? "07-15" : q === "Q3" ? "10-15" : "01-15"}`
      };
    }

    setSelectedCell({ resident, report });
    setAuditForm({
      status: report.status,
      reviewer: report.reviewer || "Dilnoza Alimova",
      comments: report.comments || "",
      exportVolume: report.reportedExportVolume || 0,
      domesticVolume: report.reportedDomesticVolume || 0,
      employeesCount: report.reportedEmployeesCount || 0,
      taxesSaved: report.taxesSaved || 0,
      exportCountries: (report.exportCountries || []).join(", "),
      productsExported: report.productsExported || "",
      documentUrl: report.documentUrl || ""
    });
  };

  // Save audit updates
  const handleSaveAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCell) return;

    const { resident, report } = selectedCell;
    const today = new Date().toISOString().split("T")[0];

    const countriesArr = auditForm.exportCountries
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);

    const updatedReport: ResidentQuarterlyReport = {
      ...report,
      status: auditForm.status,
      reviewer: auditForm.reviewer,
      comments: auditForm.comments,
      submittedDate: auditForm.status !== "NOT_SUBMITTED" ? (report.submittedDate || today) : undefined,
      reportedExportVolume: Number(auditForm.exportVolume) || 0,
      reportedDomesticVolume: Number(auditForm.domesticVolume) || 0,
      reportedEmployeesCount: Number(auditForm.employeesCount) || 0,
      taxesSaved: Number(auditForm.taxesSaved) || 0,
      exportCountries: countriesArr,
      productsExported: auditForm.productsExported,
      documentUrl: auditForm.documentUrl,
      lateIndicator: auditForm.status === "LATE" || report.lateIndicator
    };

    const otherReports = (resident.quarterlyReports || []).filter(
      r => !(r.quarter === report.quarter && r.year === report.year)
    );
    const newReportsList = [updatedReport, ...otherReports];

    const updatedPayload: Partial<Resident> = {
      quarterlyReports: newReportsList,
      notes: [
        ...(resident.notes || []),
        `Quarterly report ${report.quarter} ${report.year} updated to ${auditForm.status} on ${today}.`
      ]
    };

    // If approved, update resident master figures if provided
    if (auditForm.status === "APPROVED") {
      if (auditForm.exportVolume > 0) {
        updatedPayload.exportVolume = Math.max(resident.exportVolume || 0, Number(auditForm.exportVolume));
      }
      if (auditForm.domesticVolume > 0) {
        updatedPayload.domesticVolume = Math.max(resident.domesticVolume || 0, Number(auditForm.domesticVolume));
      }
      if (auditForm.employeesCount > 0) {
        updatedPayload.employeesCount = Number(auditForm.employeesCount);
      }
    }

    await onUpdate(resident.id, updatedPayload);
    setSelectedCell(null);
    if (onSyncState) onSyncState();
  };

  // Delete/Remove report cell
  const handleDeleteReport = async () => {
    if (!selectedCell) return;
    const { resident, report } = selectedCell;

    const remainingReports = (resident.quarterlyReports || []).filter(
      r => !(r.quarter === report.quarter && r.year === report.year)
    );

    await onUpdate(resident.id, {
      quarterlyReports: remainingReports
    });

    setSelectedCell(null);
    if (onSyncState) onSyncState();
  };

  // Submit / File New Quarterly Report
  const handleFileNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileForm.residentId) return;

    const resident = activeResidents.find(r => r.id === fileForm.residentId);
    if (!resident) return;

    const today = new Date().toISOString().split("T")[0];
    const deadlineMap: Record<string, string> = {
      Q1: `${fileForm.year}-04-15`,
      Q2: `${fileForm.year}-07-15`,
      Q3: `${fileForm.year}-10-15`,
      Q4: `${fileForm.year + 1}-01-15`
    };

    const countriesArr = fileForm.exportCountries
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);

    const newReport: ResidentQuarterlyReport = {
      quarter: fileForm.quarter,
      year: Number(fileForm.year),
      status: fileForm.status,
      submittedDate: today,
      deadline: deadlineMap[fileForm.quarter] || `${fileForm.year}-04-15`,
      reviewer: "Dilnoza Alimova",
      comments: fileForm.comments,
      reportedExportVolume: Number(fileForm.exportVolume) || 0,
      reportedDomesticVolume: Number(fileForm.domesticVolume) || 0,
      reportedEmployeesCount: Number(fileForm.employeesCount) || 0,
      taxesSaved: Number(fileForm.taxesSaved) || 0,
      exportCountries: countriesArr,
      productsExported: fileForm.productsExported,
      documentUrl: fileForm.documentUrl,
      lateIndicator: fileForm.status === "LATE"
    };

    const existingReports = resident.quarterlyReports || [];
    const otherReports = existingReports.filter(
      r => !(r.quarter === fileForm.quarter && r.year === Number(fileForm.year))
    );
    const updatedReportsList = [newReport, ...otherReports];

    const updatedPayload: Partial<Resident> = {
      quarterlyReports: updatedReportsList,
      notes: [
        ...(resident.notes || []),
        `Applied quarterly report ${fileForm.quarter} ${fileForm.year} on ${today}. Status: ${fileForm.status}.`
      ]
    };

    if (fileForm.status === "APPROVED") {
      if (fileForm.exportVolume > 0) {
        updatedPayload.exportVolume = Math.max(resident.exportVolume || 0, Number(fileForm.exportVolume));
      }
      if (fileForm.domesticVolume > 0) {
        updatedPayload.domesticVolume = Math.max(resident.domesticVolume || 0, Number(fileForm.domesticVolume));
      }
      if (fileForm.employeesCount > 0) {
        updatedPayload.employeesCount = Number(fileForm.employeesCount);
      }
    }

    await onUpdate(resident.id, updatedPayload);
    setShowFileModal(false);
    if (onSyncState) onSyncState();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold hover:bg-emerald-100 shadow-xs";
      case "SUBMITTED":
        return "bg-blue-50 text-blue-700 border-blue-200 font-bold hover:bg-blue-100 shadow-xs";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold hover:bg-rose-100 shadow-xs";
      case "LATE":
        return "bg-amber-50 text-amber-700 border-amber-200 font-bold hover:bg-amber-100 shadow-xs";
      default:
        return "bg-slate-50 text-slate-400 border-slate-200 font-medium hover:bg-slate-100";
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* TOP SUMMARY STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Declarations */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quarterly Filings
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800 font-mono">{totalReportsCount}</span>
              <span className="text-[10px] font-semibold text-slate-400">reports</span>
            </div>
            <span className="text-[10px] text-blue-600 font-bold block">{pendingReports.length} pending review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Compliance Rate */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Compliance Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800 font-mono">{complianceRate}%</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">{approvedReports.length} certified declarations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Total Audited Exports */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Audited IT Exports
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800 font-mono">${(totalAuditedExports || 0).toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block">Verified by IT Park audit</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Tax Privileges Saved */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tax Exemptions Claimed
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800 font-mono">${(totalTaxesSaved || 0).toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-amber-600 font-bold block">{lateReports.length} late submissions logged</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* FILTER AND ACTION CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search enterprise or INN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved / Certified</option>
            <option value="SUBMITTED">Submitted / In Review</option>
            <option value="REJECTED">Rejected</option>
            <option value="LATE">Late Submission</option>
            <option value="NOT_SUBMITTED">Not Submitted</option>
          </select>

          {/* Quarter Filter */}
          <select
            value={selectedQuarterFilter}
            onChange={(e) => setSelectedQuarterFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="ALL">All Quarters (2025 - 2026)</option>
            <option value="Q1-2025">Q1 2025</option>
            <option value="Q2-2025">Q2 2025</option>
            <option value="Q3-2025">Q3 2025</option>
            <option value="Q4-2025">Q4 2025</option>
            <option value="Q1-2026">Q1 2026</option>
          </select>
        </div>

        {/* View Mode & Submit Button */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode("MATRIX")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "MATRIX" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Matrix
            </button>
            <button
              onClick={() => setViewMode("LEDGER")}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === "LEDGER" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Detailed Ledger
            </button>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setShowFileModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Apply Quarterly Report</span>
            </button>
          )}
        </div>

      </div>

      {/* MATRIX VIEW */}
      {viewMode === "MATRIX" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Resident Enterprise</th>
                  {QUARTERS.filter(q => selectedQuarterFilter === "ALL" || selectedQuarterFilter === `${q.quarter}-${q.year}`).map((q) => (
                    <th key={`${q.quarter}-${q.year}`} className="py-3.5 px-4 text-center">
                      {q.quarter} {q.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((res) => {
                    return (
                      <tr key={res.id} className="hover:bg-slate-50/40 transition-all">
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-800 block">{res.companyName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            INN: {res.registrationNumber} &bull; {res.district || "Kashkadarya"}
                          </span>
                        </td>
                        
                        {QUARTERS.filter(q => selectedQuarterFilter === "ALL" || selectedQuarterFilter === `${q.quarter}-${q.year}`).map((q) => {
                          const rep = (res.quarterlyReports || []).find(r => r.quarter === q.quarter && r.year === q.year);
                          const status = rep ? rep.status : "NOT_SUBMITTED";

                          return (
                            <td key={`${q.quarter}-${q.year}`} className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleCellClick(res, q.quarter, q.year)}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold uppercase transition-all tracking-wide cursor-pointer w-32 ${getStatusBadge(status)}`}
                              >
                                {status.replace("_", " ")}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      No matching resident reports found for the current search/filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED LEDGER VIEW */}
      {viewMode === "LEDGER" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Resident Enterprise</th>
                  <th className="py-3.5 px-4">Quarter</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Export Volume ($)</th>
                  <th className="py-3.5 px-4">Domestic Rev. ($)</th>
                  <th className="py-3.5 px-4">Headcount</th>
                  <th className="py-3.5 px-4">Tax Exemptions ($)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredResidents.flatMap(r => 
                  (r.quarterlyReports || []).map(rep => ({ resident: r, report: rep }))
                ).length > 0 ? (
                  filteredResidents.flatMap(r => 
                    (r.quarterlyReports || []).map(rep => ({ resident: r, report: rep }))
                  ).map(({ resident, report }) => (
                    <tr key={`${resident.id}-${report.quarter}-${report.year}`} className="hover:bg-slate-50/40 transition-all">
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-800 block">{resident.companyName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">INN: {resident.registrationNumber}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {report.quarter} {report.year}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase border ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                        ${(report.reportedExportVolume || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                        ${(report.reportedDomesticVolume || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {report.reportedEmployeesCount || 0} staff
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-600 font-bold">
                        ${(report.taxesSaved || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleCellClick(resident, report.quarter, report.year)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Audit / Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No quarterly declaration records submitted yet. Click <b>Apply Quarterly Report</b> above to log one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CELL AUDITING & REVIEW MODAL */}
      {selectedCell && (
        <div id="audit-report-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Quarterly Declaration Review
                </h2>
                <span className="text-[10px] text-slate-400 block font-extrabold uppercase">
                  {selectedCell.resident.companyName} &bull; {selectedCell.report.quarter} {selectedCell.report.year}
                </span>
              </div>
              <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAudit} className="space-y-4">
              <div className="space-y-3">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Declaration Status</label>
                    <select
                      disabled={isReadOnly}
                      value={auditForm.status}
                      onChange={(e) => setAuditForm({ ...auditForm, status: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="NOT_SUBMITTED">Not Submitted</option>
                      <option value="SUBMITTED">Submitted / In Review</option>
                      <option value="APPROVED">Approved / Certified</option>
                      <option value="REJECTED">Rejected / Needs Correction</option>
                      <option value="LATE">Late Submission</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auditor Reviewer</label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={auditForm.reviewer}
                      onChange={(e) => setAuditForm({ ...auditForm, reviewer: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Financials & Staffing */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported IT Exports ($)</label>
                    <input
                      type="number"
                      disabled={isReadOnly}
                      value={auditForm.exportVolume}
                      onChange={(e) => setAuditForm({ ...auditForm, exportVolume: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domestic Revenue ($)</label>
                    <input
                      type="number"
                      disabled={isReadOnly}
                      value={auditForm.domesticVolume}
                      onChange={(e) => setAuditForm({ ...auditForm, domesticVolume: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IT Specialist Staff</label>
                    <input
                      type="number"
                      disabled={isReadOnly}
                      value={auditForm.employeesCount}
                      onChange={(e) => setAuditForm({ ...auditForm, employeesCount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taxes Saved ($)</label>
                    <input
                      type="number"
                      disabled={isReadOnly}
                      value={auditForm.taxesSaved}
                      onChange={(e) => setAuditForm({ ...auditForm, taxesSaved: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-amber-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Export Countries</label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={auditForm.exportCountries}
                    onChange={(e) => setAuditForm({ ...auditForm, exportCountries: e.target.value })}
                    placeholder="E.g. USA, Germany, UAE, Japan"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Products / Software Services</label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={auditForm.productsExported}
                    onChange={(e) => setAuditForm({ ...auditForm, productsExported: e.target.value })}
                    placeholder="E.g. Fintech Mobile App Development, ERP Integration"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attached Declaration File / Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={auditForm.documentUrl}
                      onChange={(e) => setAuditForm({ ...auditForm, documentUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono"
                    />
                    {auditForm.documentUrl && (
                      <a
                        href={auditForm.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Auditor Remarks / Audit Log</label>
                  <textarea
                    rows={2}
                    disabled={isReadOnly}
                    value={auditForm.comments}
                    onChange={(e) => setAuditForm({ ...auditForm, comments: e.target.value })}
                    placeholder="E.g. Certified against bank export receipts and tax records."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                  />
                </div>

              </div>

              {!isReadOnly && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  {selectedCell.report.status !== "NOT_SUBMITTED" ? (
                    <button
                      type="button"
                      onClick={handleDeleteReport}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Report</span>
                    </button>
                  ) : <div />}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCell(null)}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Declaration Audit</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* FILE NEW QUARTERLY REPORT MODAL */}
      {showFileModal && (
        <div id="file-new-report-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[92vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  Apply Quarterly Report
                </h2>
                <span className="text-[10px] text-slate-400 block font-semibold">
                  Submit a official quarterly financial & tax declaration for an IT Park Resident.
                </span>
              </div>
              <button onClick={() => setShowFileModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileNewReport} className="space-y-3.5">
              
              {/* Resident Enterprise Selection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Resident Enterprise</label>
                <select
                  value={fileForm.residentId}
                  onChange={(e) => setFileForm({ ...fileForm, residentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white"
                  required
                >
                  {activeResidents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.companyName} (INN: {r.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fiscal Quarter & Year */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quarter</label>
                  <select
                    value={fileForm.quarter}
                    onChange={(e) => setFileForm({ ...fileForm, quarter: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="Q1">Q1 (Jan - Mar)</option>
                    <option value="Q2">Q2 (Apr - Jun)</option>
                    <option value="Q3">Q3 (Jul - Sep)</option>
                    <option value="Q4">Q4 (Oct - Dec)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Year</label>
                  <select
                    value={fileForm.year}
                    onChange={(e) => setFileForm({ ...fileForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initial Status</label>
                  <select
                    value={fileForm.status}
                    onChange={(e) => setFileForm({ ...fileForm, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="SUBMITTED">Submitted for Review</option>
                    <option value="APPROVED">Certified & Approved</option>
                    <option value="LATE">Late Submission</option>
                  </select>
                </div>
              </div>

              {/* Revenue Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quarterly Exports ($ USD)</label>
                  <input
                    type="number"
                    value={fileForm.exportVolume}
                    onChange={(e) => setFileForm({ ...fileForm, exportVolume: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domestic Revenue ($ USD)</label>
                  <input
                    type="number"
                    value={fileForm.domesticVolume}
                    onChange={(e) => setFileForm({ ...fileForm, domesticVolume: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Headcount & Taxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active IT Specialists</label>
                  <input
                    type="number"
                    value={fileForm.employeesCount}
                    onChange={(e) => setFileForm({ ...fileForm, employeesCount: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tax Exemptions Saved ($)</label>
                  <input
                    type="number"
                    value={fileForm.taxesSaved}
                    onChange={(e) => setFileForm({ ...fileForm, taxesSaved: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export Destination Countries</label>
                <input
                  type="text"
                  value={fileForm.exportCountries}
                  onChange={(e) => setFileForm({ ...fileForm, exportCountries: e.target.value })}
                  placeholder="E.g. USA, Germany, UAE, Japan"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Products / Services Exported</label>
                <input
                  type="text"
                  value={fileForm.productsExported}
                  onChange={(e) => setFileForm({ ...fileForm, productsExported: e.target.value })}
                  placeholder="E.g. SaaS Platform Development, IT Outsourcing"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Declaration Document Link / PDF</label>
                <input
                  type="text"
                  value={fileForm.documentUrl}
                  onChange={(e) => setFileForm({ ...fileForm, documentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Remarks</label>
                <textarea
                  rows={2}
                  value={fileForm.comments}
                  onChange={(e) => setFileForm({ ...fileForm, comments: e.target.value })}
                  placeholder="Add any notes regarding hardcopy verification or bank receipts..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFileModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Quarterly Report</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
