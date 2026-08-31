/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, AlertTriangle } from "lucide-react";
import { ResidentAudit } from "./auditTypes";

interface ApproveAuditModalProps {
  audit: ResidentAudit;
  currentUser: string;
  onClose: () => void;
  onApprove: (finalComment: string, reviewerName: string) => Promise<void>;
}

export default function ApproveAuditModal({
  audit,
  currentUser,
  onClose,
  onApprove
}: ApproveAuditModalProps) {
  const [finalComment, setFinalComment] = useState("Official independent annual audit verified and approved in accordance with IT Park resident charter regulations.");
  const [reviewerName, setReviewerName] = useState(currentUser || audit.assignedReviewerName || "Dilnoza Alimova");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingChecklist = (audit.checklist || []).filter(c => c.result === "PENDING").length;
  const failedChecklist = (audit.checklist || []).filter(c => c.result === "FAIL").length;
  const passedChecklist = (audit.checklist || []).filter(c => c.result === "PASS").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onApprove(finalComment.trim(), reviewerName.trim());
      onClose();
    } catch (err) {
      console.error("Failed to approve audit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="approve-audit-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Approve Annual Audit Report
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                {audit.companyName} • Reporting Year {audit.reportingYear}
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

        {/* Verification Status Notice */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2 text-emerald-950">
          <p className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            Compliance Verification Summary:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="font-extrabold text-emerald-700 block text-sm">{passedChecklist}</span>
              <span className="text-slate-500">Passed Items</span>
            </div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="font-extrabold text-amber-600 block text-sm">{pendingChecklist}</span>
              <span className="text-slate-500">Pending</span>
            </div>
            <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
              <span className="font-extrabold text-rose-600 block text-sm">{failedChecklist}</span>
              <span className="text-slate-500">Failed</span>
            </div>
          </div>

          {failedChecklist > 0 && (
            <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-lg text-amber-900 text-[11px] flex items-center gap-1.5 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              <span>Note: {failedChecklist} checklist item(s) are flagged as failed. Ensure corrections were verified.</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Approving Officer / Authority *
            </label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Final Compliance & Approval Commentary
            </label>
            <textarea
              rows={3}
              value={finalComment}
              onChange={(e) => setFinalComment(e.target.value)}
              placeholder="Add final compliance notes for the resident's official registry record..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Approving..." : "Confirm & Approve Audit"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
