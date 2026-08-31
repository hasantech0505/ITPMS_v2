/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Upload, FileCheck, ArrowRight, Layers } from "lucide-react";
import { ResidentAudit, AuditDocument, AuditDocumentType } from "./auditTypes";

interface ResubmitAuditModalProps {
  audit: ResidentAudit;
  onClose: () => void;
  onResubmit: (resubmissionData: {
    notes: string;
    documents: Array<Omit<AuditDocument, "id" | "auditId">>;
    submittedBy: string;
  }) => Promise<void>;
}

export default function ResubmitAuditModal({
  audit,
  onClose,
  onResubmit
}: ResubmitAuditModalProps) {
  const nextVersion = ((audit.documents || []).reduce((max, d) => Math.max(max, d.version || 1), 1)) + 1;
  const [submittedBy, setSubmittedBy] = useState(audit.residentDirector || "Director / Authorized Officer");
  const [resubmissionNotes, setResubmissionNotes] = useState(
    "Resubmitting revised audit documentation with updated export reconciliation declarations and renewed audit firm license."
  );
  
  const [docType, setDocType] = useState<AuditDocumentType>("Audit Report");
  const [customFileName, setCustomFileName] = useState(`${audit.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Annual_Audit_${audit.reportingYear}_v${nextVersion}.pdf`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmissionNotes.trim() || !customFileName.trim()) {
      alert("Please provide the file name and corrective explanation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDocs: Array<Omit<AuditDocument, "id" | "auditId">> = [
        {
          documentType: docType,
          fileName: customFileName.trim(),
          fileSize: "4.2 MB",
          version: nextVersion,
          uploadedBy: submittedBy.trim(),
          uploadedAt: new Date().toISOString().split("T")[0],
          notes: resubmissionNotes.trim()
        }
      ];

      await onResubmit({
        notes: resubmissionNotes.trim(),
        documents: newDocs,
        submittedBy: submittedBy.trim()
      });

      onClose();
    } catch (err) {
      console.error("Failed to resubmit audit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="resubmit-audit-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Upload Resubmission & Corrected Report
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                {audit.companyName} • New Version: <b className="text-purple-700">v{nextVersion}</b>
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

        {/* Info */}
        <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Version History Preservation Guarantee</p>
            <p className="text-[11px] text-purple-800">
              Previous version(s) ({audit.documents?.length || 0} document records) will be preserved in historical archive for reviewer version comparison.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Document Type to Resubmit
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as AuditDocumentType)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
            >
              <option value="Audit Report">Audit Report (Revised Full Package)</option>
              <option value="Auditor's Opinion">Auditor's Opinion Letter</option>
              <option value="Financial Statements">Financial Statements (Balance Sheet & P&L)</option>
              <option value="Export Documentation">Export Documentation & Banking Certificates</option>
              <option value="Supporting Documents">Supporting Clarifications / License Appendix</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Revised File Name *
            </label>
            <input
              type="text"
              required
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Submitted By (Representative) *
            </label>
            <input
              type="text"
              required
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Correction Summary & Explanation *
            </label>
            <textarea
              required
              rows={3}
              value={resubmissionNotes}
              onChange={(e) => setResubmissionNotes(e.target.value)}
              placeholder="Explain what specific corrections were made in response to the reviewer's identified deficiencies..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden"
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting v" + nextVersion + "..." : "Submit Version v" + nextVersion}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
