/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Trash2, 
  RefreshCw, 
  AlertOctagon, 
  AlertTriangle,
  History,
  FileText,
  BadgeAlert,
  Clock,
  X
} from "lucide-react";
import { Resident, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentRemovedArchiveProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export default function ResidentRemovedArchive({ 
  residents, 
  onUpdate, 
  userRole, 
  onSyncState 
}: ResidentRemovedArchiveProps) {
  const { t } = useLanguage();
  const [showRestoreModal, setShowRestoreModal] = useState<Resident | null>(null);

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter residents that are in REMOVED or REVOKED statuses
  const removedResidents = residents.filter(r => r.status === ResidentStatus.REMOVED || r.status === ResidentStatus.REVOKED);

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRestoreModal) return;

    const today = new Date().toISOString().split("T")[0];
    await onUpdate(showRestoreModal.id, {
      status: ResidentStatus.ACTIVE,
      approvedAt: today,
      notes: [...(showRestoreModal.notes || []), `License formally reinstated and reactivated upon legal/board appeal clearance on ${today}.`]
    });

    setShowRestoreModal(null);
    if (onSyncState) onSyncState();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-tight flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            {t("Revoked & Removed Registry")}
          </h2>
          <span className="text-[10px] text-slate-400 block font-semibold">Regulatory archive containing blacklisted or terminated corporate licenses due to compliance violations.</span>
        </div>
        <span className="text-[10px] bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider border border-rose-500/20">
          Regulatory Archive
        </span>
      </div>

      {/* Grid listing */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Revoked Enterprise</th>
                <th className="py-3 px-4">Date Revoked</th>
                <th className="py-3 px-4">Audit Violation Reason</th>
                <th className="py-3 px-4 text-right">Tax Debt/Claims</th>
                <th className="py-3 px-4">Appeals Log</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {removedResidents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <AlertTriangle className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-semibold">No revoked or removed residents in the archive.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                removedResidents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <span>{r.companyName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono font-semibold">INN: {r.registrationNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono font-medium">{r.removedDate || r.appliedAt}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-medium text-rose-700" title={r.removedReason || "Audit non-compliance"}>
                      {r.removedReason || "Failure to submit quarterly financial declarations."}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                      {r.removedDebt ? `$${r.removedDebt.toLocaleString()}` : "$0"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg max-w-[150px] truncate" title={r.removedAppeal}>
                        <Clock className="w-3.5 h-3.5" />
                        {r.removedAppeal || "No appeal submitted"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isReadOnly && (
                        <button
                          onClick={() => setShowRestoreModal(r)}
                          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-950 text-white font-bold text-[9px] px-2.5 py-1 rounded-md cursor-pointer transition-all uppercase inline-flex justify-center"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reactivate License</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REACTIVATE LICENSE MODAL */}
      {showRestoreModal && (
        <div id="restore-removed-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                Reactivate Corporate License
              </h2>
              <button onClick={() => setShowRestoreModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to reinstate the certified IT Resident status for <b>{showRestoreModal.companyName}</b>? This will restore their 0% corporate tax exemptions.
            </p>

            <form onSubmit={handleRestore} className="space-y-4">
              <div className="space-y-2 border border-slate-100 p-3 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600">
                <div>Reason for deletion: <span className="text-rose-600">{showRestoreModal.removedReason}</span></div>
                <div>Appeals Clearance: <span className="text-amber-700">{showRestoreModal.removedAppeal || "Approved by board"}</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRestoreModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Reactivate License Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
