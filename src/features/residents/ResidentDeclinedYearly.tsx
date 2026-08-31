/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  XOctagon, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  FileText, 
  DollarSign,
  BadgeAlert,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus
} from "lucide-react";
import { Resident, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentDeclinedYearlyProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  onAdd?: (resident: Omit<Resident, "id"> | any) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export default function ResidentDeclinedYearly({
  residents,
  onUpdate,
  onAdd,
  userRole,
  onSyncState
}: ResidentDeclinedYearlyProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [showAppealModal, setShowAppealModal] = useState<Resident | null>(null);
  const [appealReason, setAppealReason] = useState("");
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  
  // State for Revoke/Decline modal
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customDirector, setCustomDirector] = useState("");
  const [customInn, setCustomInn] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeDebt, setRevokeDebt] = useState<number>(0);
  const [revokeInspection, setRevokeInspection] = useState("");
  const [canReapply, setCanReapply] = useState(true);
  const [revokeStatus, setRevokeStatus] = useState<ResidentStatus.REMOVED | ResidentStatus.REVOKED>(ResidentStatus.REVOKED);

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter residents that are in REMOVED, REVOKED, or REJECTED status
  const declinedList = residents.filter(r => 
    r.status === ResidentStatus.REMOVED || 
    r.status === ResidentStatus.REVOKED || 
    r.status === "REJECTED" as any
  );

  // Filter by year
  const filteredList = declinedList.filter(r => {
    const matchesSearch = 
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.registrationNumber.includes(searchTerm) ||
      (r.removedReason || "").toLowerCase().includes(searchTerm.toLowerCase());

    const decYear = r.removedDate ? r.removedDate.slice(0, 4) : r.appliedAt ? r.appliedAt.slice(0, 4) : "2026";
    const matchesYear = selectedYear === "ALL" || decYear === selectedYear;

    return matchesSearch && matchesYear;
  });

  const totalDebtClaims = filteredList.reduce((acc, r) => acc + (r.removedDebt || 0), 0);
  const reapplyEligibleCount = filteredList.filter(r => r.removedCanReapply !== false).length;

  const handleRecordAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAppealModal) return;

    const today = new Date().toISOString().split("T")[0];
    await onUpdate(showAppealModal.id, {
      removedAppeal: `Appeal filed on ${today}: ${appealReason}`,
      notes: [...(showAppealModal.notes || []), `Board appeal officially registered on ${today}: "${appealReason}".`]
    });

    setShowAppealModal(null);
    setAppealReason("");
    if (onSyncState) onSyncState();
  };

  const handleReinstate = async (resident: Resident) => {
    if (!confirm(`Are you sure you want to reinstate IT Park Resident license for ${resident.companyName}?`)) return;

    const today = new Date().toISOString().split("T")[0];
    await onUpdate(resident.id, {
      status: ResidentStatus.ACTIVE,
      approvedAt: today,
      notes: [...(resident.notes || []), `License formally reinstated and reactivated on ${today}.`]
    });
    if (onSyncState) onSyncState();
  };

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    if (selectedResidentId && selectedResidentId !== "NEW") {
      // Revoking existing resident
      const target = residents.find(r => r.id === selectedResidentId);
      if (!target) return;

      await onUpdate(target.id, {
        status: revokeStatus,
        removedDate: today,
        removedReason: revokeReason || "Revoked by IT Park Directorate Audit decree",
        removedDebt: Number(revokeDebt) || 0,
        removedInspection: revokeInspection || "Non-compliance identified in annual financial report",
        removedCanReapply: canReapply,
        notes: [...(target.notes || []), `Status updated to ${revokeStatus} on ${today}. Reason: ${revokeReason}`]
      });
    } else {
      // Creating a new revoked/declined entry directly
      const newId = `RES-DEC-${Date.now().toString().slice(-4)}`;
      const payload: Partial<Resident> = {
        id: newId,
        companyName: customCompanyName || "Declined Enterprise LLC",
        director: customDirector || "Not Specified",
        registrationNumber: customInn || "309999888",
        status: revokeStatus,
        appliedAt: today,
        removedDate: today,
        removedReason: revokeReason || "Application rejected during initial compliance audit",
        removedDebt: Number(revokeDebt) || 0,
        removedInspection: revokeInspection || "Documentation failed validation checks",
        removedCanReapply: canReapply,
        district: "Tashkent City",
        activityType: "IT Services & Software Development",
        exportVolume: 0,
        employeesCount: 0,
        notes: [`Created directly as ${revokeStatus} record on ${today}.`]
      };
      if (onAdd) {
        await onAdd(payload);
      } else {
        await onUpdate(newId, payload);
      }
    }

    // Reset form & close modal
    setShowRevokeModal(false);
    setSelectedResidentId("");
    setCustomCompanyName("");
    setCustomDirector("");
    setCustomInn("");
    setRevokeReason("");
    setRevokeDebt(0);
    setRevokeInspection("");
    setCanReapply(true);
    setRevokeStatus(ResidentStatus.REVOKED);
    if (onSyncState) onSyncState();
  };

  // Export CSV function for Sheet 3
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Company Name",
      "Director",
      "INN Number",
      "Decline Date",
      "Reason for Rejection/Revocation",
      "Debt Claims ($)",
      "Inspection Findings",
      "Appeals Log",
      "Can Reapply"
    ];

    const rows = filteredList.map(r => [
      r.id,
      `"${r.companyName.replace(/"/g, '""')}"`,
      `"${r.director.replace(/"/g, '""')}"`,
      `"${r.registrationNumber}"`,
      r.removedDate || r.appliedAt || "",
      `"${(r.removedReason || "Application failed audit threshold").replace(/"/g, '""')}"`,
      r.removedDebt || 0,
      `"${(r.removedInspection || "").replace(/"/g, '""')}"`,
      `"${(r.removedAppeal || "None").replace(/"/g, '""')}"`,
      r.removedCanReapply !== false ? "YES" : "NO"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IT_Park_Declined_Residents_Sheet3_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-rose-950 border border-rose-900 p-5 rounded-xl text-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-widest">Yearly Audit Log</span>
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <XOctagon className="w-4 h-4 text-rose-400" />
              Declined & Revoked Residents
            </h2>
          </div>
          <p className="text-xs text-rose-200 font-medium">
            Regulatory archive tracking rejected resident applications, revoked IT Park certificates, tax debt claims, and legal appeals organized by calendar year.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isReadOnly && (
            <button
              id="declined-revoke-resident-btn"
              onClick={() => setShowRevokeModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Decline / Revoke Resident
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-rose-900 hover:bg-rose-800 text-rose-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-800 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Declined/Revoked</span>
          <span className="text-xl font-extrabold text-rose-700 font-mono mt-0.5 block">{filteredList.length} <span className="text-xs text-slate-400 font-normal">cases</span></span>
          <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
            <ShieldAlert className="w-3 h-3" /> Mandatory revocation decrees
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Tax Claims</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">${(totalDebtClaims || 0).toLocaleString()}</span>
          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
            <DollarSign className="w-3 h-3" /> Unpaid duties/customs debt
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Re-application Eligible</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">{reapplyEligibleCount} <span className="text-xs text-slate-400 font-normal">firms</span></span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Can cure defects & re-apply
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Board Legal Appeals</span>
          <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">
            {filteredList.filter(r => r.removedAppeal && r.removedAppeal !== "None").length} <span className="text-xs text-slate-400 font-normal">appeals</span>
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
            <BadgeAlert className="w-3 h-3" /> Active legal reviews
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search declined residents by company name, director, INN, or revocation reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Year Declined:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026 Declined</option>
              <option value="2025">2025 Declined</option>
              <option value="2024">2024 Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View for Sheet 3 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Declined Enterprise</th>
                <th className="py-3 px-4">INN (Reg No)</th>
                <th className="py-3 px-4">Date Revoked</th>
                <th className="py-3 px-4">Audit Violation Reason</th>
                <th className="py-3 px-4 text-right">Tax Claims ($)</th>
                <th className="py-3 px-4">Legal Appeal Status</th>
                <th className="py-3 px-4 text-center">Re-apply Eligible</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-semibold">No declined residents found in Sheet 3 for this filter.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-xs shrink-0 border border-rose-100">
                          {r.companyName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{r.companyName}</span>
                          <span className="text-[10px] text-slate-400 block font-medium">Director: {r.director}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{r.registrationNumber}</td>

                    <td className="py-3 px-4 text-slate-600 font-medium">{r.removedDate || r.appliedAt || "2026-01-15"}</td>

                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-700">
                      {r.removedReason || "Failed mandatory export quota criteria"}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      ${(r.removedDebt || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-slate-600 truncate block text-[11px]">
                        {r.removedAppeal || "No appeal submitted yet."}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {r.removedCanReapply !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> YES
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" /> NO (Blacklisted)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setShowAppealModal(r)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Log Appeal
                        </button>
                        {!isReadOnly && (
                          <button
                            onClick={() => handleReinstate(r)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appeal Dialog Modal */}
      {showAppealModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Log Legal Appeal for {showAppealModal.companyName}
            </h3>
            <form onSubmit={handleRecordAppeal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Board Appeal Details / Case Number</label>
                <textarea
                  required
                  rows={3}
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="e.g. Case #2026-99: Export quota was met via indirect international wire transfer. Submitted bank SWIFT statements."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Revocation & Decline Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                    Issue Decline / License Revocation Decree
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Record a rejected application or revoke an active resident license.</p>
                </div>
              </div>
              <button onClick={() => setShowRevokeModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRevokeSubmit} className="space-y-4 text-xs">
              {/* Target Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Select Resident Company or Create Entry</label>
                <select
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800"
                >
                  <option value="">-- Choose Existing Active Resident to Revoke --</option>
                  {residents.filter(r => r.status !== ResidentStatus.REMOVED && r.status !== ResidentStatus.REVOKED).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.companyName} (INN: {r.registrationNumber}) [{r.status}]
                    </option>
                  ))}
                  <option value="NEW">+ Log New Declined/Rejected Enterprise</option>
                </select>
              </div>

              {/* If NEW company chosen */}
              {selectedResidentId === "NEW" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SoftTech Solutions LLC"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 text-[10px] uppercase">Director Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anvar Karimov"
                      value={customDirector}
                      onChange={(e) => setCustomDirector(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded bg-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-600 text-[10px] uppercase">INN Tax Registration Number</label>
                    <input
                      type="text"
                      required
                      placeholder="9-digit INN, e.g. 308112345"
                      value={customInn}
                      onChange={(e) => setCustomInn(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Action Status Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Decree Classification</label>
                  <select
                    value={revokeStatus}
                    onChange={(e) => setRevokeStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-bold text-rose-700"
                  >
                    <option value={ResidentStatus.REVOKED}>REVOKED (License Cancelled)</option>
                    <option value={ResidentStatus.REMOVED}>REMOVED / DECLINED (Application Rejected)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Outstanding Debt Claims ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={revokeDebt}
                    onChange={(e) => setRevokeDebt(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Reason for Revocation */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Audit Violation / Revocation Reason</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Failed 80% export revenue threshold during Q2 audit."
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Inspection Findings */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Tax / Directorate Inspection Findings</label>
                <input
                  type="text"
                  placeholder="e.g. Discrepancy in customs declare documentation."
                  value={revokeInspection}
                  onChange={(e) => setRevokeInspection(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Reapply Eligibility */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Eligible to Re-apply in Future?</span>
                  <span className="text-[10px] text-slate-500">Allow company to re-submit application after curing violations.</span>
                </div>
                <input
                  type="checkbox"
                  checked={canReapply}
                  onChange={(e) => setCanReapply(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Confirm Revocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
