/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, ShieldAlert, ArrowUpRight, UserCheck } from "lucide-react";
import { ResidentAudit, EscalationLevel, AuditEscalation } from "./auditTypes";

interface EscalateCaseModalProps {
  audit: ResidentAudit;
  currentUser: string;
  onClose: () => void;
  onEscalate: (escalation: Omit<AuditEscalation, "id" | "escalatedAt" | "status">) => Promise<void>;
}

export default function EscalateCaseModal({
  audit,
  currentUser,
  onClose,
  onEscalate
}: EscalateCaseModalProps) {
  const [level, setLevel] = useState<EscalationLevel>("Department Head");
  const [reason, setReason] = useState("");
  const [assignedTo, setAssignedTo] = useState("Chief Compliance Officer & Regional Director");
  const [resolutionDeadline, setResolutionDeadline] = useState(
    new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0]
  );
  const [escalatedBy, setEscalatedBy] = useState(currentUser || audit.assignedReviewerName || "Compliance Auditor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Please provide the justification for escalation.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onEscalate({
        auditId: audit.id,
        level,
        reason: reason.trim(),
        assignedTo: assignedTo.trim(),
        escalatedBy: escalatedBy.trim(),
        resolutionDeadline
      });
      onClose();
    } catch (err) {
      console.error("Failed to escalate audit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="escalate-case-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Escalate Compliance Case
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                {audit.companyName} • Audit Cycle {audit.reportingYear}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950">
          <p className="font-bold">Executive & Legal Review Trigger</p>
          <p className="text-[11px] text-rose-800 mt-0.5">
            Escalation flags this resident as <b>HIGH RISK</b> and directs the case file to senior leadership for formal regulatory or sanction determination.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Escalation Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as EscalationLevel)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
              >
                <option value="Department Head">Department Head</option>
                <option value="Branch Director">Branch Director (Kashkadarya)</option>
                <option value="Central IT Park">Central IT Park Directorate (Tashkent)</option>
                <option value="Legal/Compliance">Legal & Compliance Committee</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Target Resolution Date *
              </label>
              <input
                type="date"
                required
                value={resolutionDeadline}
                onChange={(e) => setResolutionDeadline(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Assigned Executive Authority *
            </label>
            <input
              type="text"
              required
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Escalation Reason & Regulatory Justification *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the serious non-compliance grounds, repeated failure to remediate, or unpermitted revenue activities..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Escalating..." : "Confirm Escalation"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
