/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, AlertOctagon, RotateCcw, Calendar, FileText, User } from "lucide-react";
import { ResidentAudit, AuditCorrection } from "./auditTypes";

interface ReturnForCorrectionModalProps {
  audit: ResidentAudit;
  currentUser: string;
  onClose: () => void;
  onSubmit: (correction: Omit<AuditCorrection, "id" | "returnedAt">) => Promise<void>;
}

export default function ReturnForCorrectionModal({
  audit,
  currentUser,
  onClose,
  onSubmit
}: ReturnForCorrectionModalProps) {
  const [reason, setReason] = useState("");
  const [problemsIdentified, setProblemsIdentified] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  
  // Default deadline: 14 days from now
  const defaultDeadline = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("HIGH");
  const [reviewer, setReviewer] = useState(currentUser || audit.assignedReviewerName || "Senior Compliance Reviewer");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !problemsIdentified.trim() || !correctiveAction.trim()) {
      alert("Please provide the Reason, Problems Identified, and Required Corrective Action.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        auditId: audit.id,
        reason: reason.trim(),
        problemsIdentified: problemsIdentified.trim(),
        correctiveAction: correctiveAction.trim(),
        priority,
        deadline,
        returnedBy: reviewer,
        version: (audit.returnCount || 0) + 1
      });
      onClose();
    } catch (err) {
      console.error("Failed to return audit for correction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="return-for-correction-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Return Audit for Correction
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                {audit.companyName} • Reporting Year {audit.reportingYear} • Current Returns: {audit.returnCount || 0}
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

        {/* Warning Banner */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Returning this audit report puts the workflow on hold.</p>
            <p className="text-[11px] text-amber-800">
              The resident will receive an immediate formal notice with your identified deficiencies and corrective instructions. Previous submissions and document versions are strictly preserved in the audit history.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Reason for Return *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Export revenue documentation missing or inconsistent"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Problems Identified (Deficiencies) *
            </label>
            <textarea
              required
              rows={3}
              value={problemsIdentified}
              onChange={(e) => setProblemsIdentified(e.target.value)}
              placeholder="Detail specific discrepancies found during compliance and financial check (e.g. Foreign client bank payment receipts do not match registered contract sum)..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Required Corrective Action *
            </label>
            <textarea
              required
              rows={3}
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="Instruct the resident on exact remedial documents or revised audit tables required for resubmission..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Resubmission Deadline *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (Default)</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Reviewing Officer
              </label>
              <input
                type="text"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Issuing Notice..." : "Return to Resident"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
