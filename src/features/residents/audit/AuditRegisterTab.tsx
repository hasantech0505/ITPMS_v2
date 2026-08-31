/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  CheckCircle, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Eye, 
  Bell, 
  ShieldAlert, 
  Building2,
  Calendar,
  X,
  Printer,
  Sparkles
} from "lucide-react";
import { ResidentAudit, AuditStatus, AuditRiskLevel, STATUS_CONFIG, calculateDaysRemaining } from "./auditTypes";

interface AuditRegisterTabProps {
  key?: string;
  audits: ResidentAudit[];
  selectedYear: number;
  initialStatusFilter?: string;
  onSelectAudit: (audit: ResidentAudit) => void;
  onOpenReminderModal: (audit: ResidentAudit) => void;
}

type SortField = "companyName" | "dueDate" | "submissionDate" | "status" | "riskLevel" | "updatedAt";
type SortOrder = "asc" | "desc";

export default function AuditRegisterTab({
  audits,
  selectedYear,
  initialStatusFilter = "ALL",
  onSelectAudit,
  onOpenReminderModal
}: AuditRegisterTabProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>(selectedYear ? String(selectedYear) : "ALL");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [reviewerFilter, setReviewerFilter] = useState<string>("ALL");
  const [auditFirmFilter, setAuditFirmFilter] = useState<string>("ALL");
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");

  // Sorting & Pagination
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Distinct lists for dropdowns
  const distinctYears = useMemo(() => Array.from(new Set(audits.map(a => a.reportingYear))).sort((a, b) => b - a), [audits]);
  const distinctReviewers = useMemo(() => Array.from(new Set(audits.map(a => a.assignedReviewerName).filter(Boolean))), [audits]);
  const distinctFirms = useMemo(() => Array.from(new Set(audits.map(a => a.auditFirm).filter(Boolean))), [audits]);
  const distinctDistricts = useMemo(() => Array.from(new Set(audits.map(a => a.residentDistrict).filter(Boolean))), [audits]);

  // Filtering logic
  const filteredAudits = useMemo(() => {
    return audits.filter(audit => {
      // Search
      const term = (searchTerm || "").toLowerCase();
      const matchesSearch = 
        (audit.companyName || "").toLowerCase().includes(term) ||
        (audit.stir || "").toLowerCase().includes(term) ||
        (audit.residentIdCode || "").toLowerCase().includes(term) ||
        (audit.auditorName || "").toLowerCase().includes(term) ||
        (audit.auditFirm || "").toLowerCase().includes(term) ||
        (audit.assignedReviewerName || "").toLowerCase().includes(term);

      if (!matchesSearch) return false;

      // Year Filter
      if (yearFilter !== "ALL" && audit.reportingYear !== Number(yearFilter)) {
        return false;
      }

      // Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "OVERDUE") {
          const isOverdue = audit.status !== "APPROVED" && (calculateDaysRemaining(audit.dueDate) < 0 || audit.status === "OVERDUE");
          if (!isOverdue) return false;
        } else if (audit.status !== statusFilter) {
          return false;
        }
      }

      // Risk Filter
      if (riskFilter !== "ALL" && audit.riskLevel !== riskFilter) {
        return false;
      }

      // Reviewer Filter
      if (reviewerFilter !== "ALL" && audit.assignedReviewerName !== reviewerFilter) {
        return false;
      }

      // Audit Firm Filter
      if (auditFirmFilter !== "ALL" && audit.auditFirm !== auditFirmFilter) {
        return false;
      }

      // District Filter
      if (districtFilter !== "ALL" && audit.residentDistrict !== districtFilter) {
        return false;
      }

      return true;
    });
  }, [audits, searchTerm, yearFilter, statusFilter, riskFilter, reviewerFilter, auditFirmFilter, districtFilter]);

  // Sorting logic
  const sortedAudits = useMemo(() => {
    return [...filteredAudits].sort((a, b) => {
      let aVal: any = a[sortField] || "";
      let bVal: any = b[sortField] || "";

      if (sortField === "dueDate" || sortField === "submissionDate" || sortField === "updatedAt") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAudits, sortField, sortOrder]);

  // Pagination slice
  const totalPages = Math.ceil(sortedAudits.length / itemsPerPage) || 1;
  const paginatedAudits = sortedAudits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Resident Company", "INN/STIR", "Reporting Year", "Statutory Due Date", "Submission Date", "Status", "Risk Level", "Reviewer", "Audit Firm", "Returns Count"];
    const rows = sortedAudits.map(a => [
      `"${a.companyName}"`,
      `"${a.stir}"`,
      a.reportingYear,
      `"${a.dueDate}"`,
      `"${a.submissionDate || "N/A"}"`,
      `"${a.status}"`,
      `"${a.riskLevel}"`,
      `"${a.assignedReviewerName || "Unassigned"}"`,
      `"${a.auditFirm || "N/A"}"`,
      a.returnCount || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IT_Park_Annual_Audit_Register_${yearFilter}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setYearFilter(selectedYear ? String(selectedYear) : "ALL");
    setStatusFilter("ALL");
    setRiskFilter("ALL");
    setReviewerFilter("ALL");
    setAuditFirmFilter("ALL");
    setDistrictFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || statusFilter !== "ALL" || riskFilter !== "ALL" || reviewerFilter !== "ALL" || auditFirmFilter !== "ALL" || districtFilter !== "ALL";

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* Control Bar: Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search resident company, INN/STIR, auditor, audit firm, reviewer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Register</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 text-xs">
          
          {/* Year */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Cycle Year</label>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold bg-white"
            >
              <option value="ALL">All Cycles</option>
              {distinctYears.map(y => (
                <option key={y} value={y}>{y} Cycle</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Audit Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_SUBMISSION">Pending Submission</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RETURNED_FOR_CORRECTION">Returned for Correction</option>
              <option value="RESUBMITTED">Resubmitted</option>
              <option value="APPROVED">Approved</option>
              <option value="OVERDUE">Overdue</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          {/* Risk */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold bg-white"
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Reviewer */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Reviewer</label>
            <select
              value={reviewerFilter}
              onChange={(e) => { setReviewerFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium bg-white truncate"
            >
              <option value="ALL">All Reviewers</option>
              {distinctReviewers.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Audit Firm */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Audit Firm</label>
            <select
              value={auditFirmFilter}
              onChange={(e) => { setAuditFirmFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium bg-white truncate"
            >
              <option value="ALL">All Audit Firms</option>
              {distinctFirms.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">District</label>
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium bg-white truncate"
            >
              <option value="ALL">All Districts</option>
              {distinctDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Main Audit Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Table summary count bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Showing <b className="text-slate-900">{sortedAudits.length}</b> annual audit records
          </span>
          <span className="text-slate-400 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px] tracking-wider sticky top-0 z-10">
              <tr>
                <th 
                  onClick={() => toggleSort("companyName")}
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Resident Enterprise</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-3 px-3">Reporting Year</th>

                <th 
                  onClick={() => toggleSort("dueDate")}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Statutory Due</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th 
                  onClick={() => toggleSort("submissionDate")}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Submission</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th 
                  onClick={() => toggleSort("status")}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Audit Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-3 px-3">Assigned Reviewer</th>

                <th 
                  onClick={() => toggleSort("riskLevel")}
                  className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Compliance Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                <th className="py-3 px-3">Audit Firm</th>

                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedAudits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    No annual audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAudits.map((audit) => {
                  const statusConf = STATUS_CONFIG[audit.status] || STATUS_CONFIG.PENDING_SUBMISSION;
                  const isOverdue = audit.status !== "APPROVED" && (calculateDaysRemaining(audit.dueDate) < 0 || audit.status === "OVERDUE");

                  return (
                    <tr 
                      key={audit.id}
                      onClick={() => onSelectAudit(audit)}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {audit.companyName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono font-bold">INN: {audit.stir}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-500 font-medium">{audit.residentDistrict || "Qarshi"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-black text-slate-800 text-xs px-2 py-0.5 rounded-md bg-slate-100 font-mono">
                          {audit.reportingYear}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-800">{audit.dueDate}</div>
                        {isOverdue && (
                          <span className="text-[10px] font-black text-rose-600 block">
                            {Math.abs(calculateDaysRemaining(audit.dueDate))}d overdue
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-700">
                        {audit.submissionDate ? (
                          <div>
                            <span className="font-bold text-slate-900">{audit.submissionDate}</span>
                            {audit.returnCount > 0 && (
                              <span className="text-[10px] text-amber-700 font-bold block">
                                {audit.returnCount} return(s)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not submitted</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-block border ${statusConf.badgeClass}`}>
                          {isOverdue && audit.status !== "APPROVED" ? `OVERDUE • ${statusConf.label}` : statusConf.label}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-800">
                        {audit.assignedReviewerName || "Unassigned"}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          audit.riskLevel === "HIGH" ? "bg-rose-100 text-rose-800" :
                          audit.riskLevel === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {audit.riskLevel}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate" title={audit.auditFirm}>
                        {audit.auditFirm || <span className="text-slate-400 italic">N/A</span>}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenReminderModal(audit)}
                            title="Dispatch Notice"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => onSelectAudit(audit)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Audit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedAudits.length)} of {sortedAudits.length} entries
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    currentPage === pg 
                      ? "bg-slate-900 text-white" 
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-300 rounded-lg hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
