/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Building2, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle, 
  Upload, 
  Download, 
  Eye, 
  MessageSquare, 
  Bell, 
  ArrowUpRight, 
  Check, 
  Layers, 
  Clock, 
  Send, 
  FileSpreadsheet, 
  UserCheck,
  ChevronRight,
  Sparkles,
  Printer
} from "lucide-react";
import { 
  ResidentAudit, 
  AuditStatus, 
  AuditDocument, 
  AuditChecklistItem, 
  ChecklistResult, 
  STATUS_CONFIG 
} from "./auditTypes";

interface AuditDetailDrawerProps {
  audit: ResidentAudit;
  currentUser: string;
  userRole: string;
  onClose: () => void;
  onUpdateAudit: (updatedAudit: ResidentAudit) => Promise<void>;
  onOpenReturnModal: () => void;
  onOpenApproveModal: () => void;
  onOpenResubmitModal: () => void;
  onOpenEscalateModal: () => void;
  onOpenReminderModal: () => void;
}

type DetailTab = "overview" | "documents" | "checklist" | "corrections" | "timeline" | "communications";

export default function AuditDetailDrawer({
  audit,
  currentUser,
  userRole,
  onClose,
  onUpdateAudit,
  onOpenReturnModal,
  onOpenApproveModal,
  onOpenResubmitModal,
  onOpenEscalateModal,
  onOpenReminderModal
}: AuditDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [activeDocCategory, setActiveDocCategory] = useState<string>("ALL");
  const [selectedDocPreview, setSelectedDocPreview] = useState<AuditDocument | null>(null);

  const statusInfo = STATUS_CONFIG[audit.status] || STATUS_CONFIG.PENDING_SUBMISSION;
  const isApproved = audit.status === "APPROVED";
  const isOverdue = audit.status === "OVERDUE" || (audit.status !== "APPROVED" && new Date(audit.dueDate) < new Date());

  // Handle checklist update
  const handleChecklistResultChange = async (itemId: string, newResult: ChecklistResult) => {
    const updatedChecklist = (audit.checklist || []).map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          result: newResult,
          reviewedBy: currentUser || "Compliance Officer",
          reviewedAt: new Date().toISOString().split("T")[0]
        };
      }
      return item;
    });

    const updatedAudit: ResidentAudit = {
      ...audit,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    await onUpdateAudit(updatedAudit);
  };

  const handleChecklistCommentChange = async (itemId: string, comment: string) => {
    const updatedChecklist = (audit.checklist || []).map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          comment,
          reviewedBy: currentUser || "Compliance Officer"
        };
      }
      return item;
    });

    const updatedAudit: ResidentAudit = {
      ...audit,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    await onUpdateAudit(updatedAudit);
  };

  const filteredDocs = activeDocCategory === "ALL" 
    ? (audit.documents || []) 
    : (audit.documents || []).filter(d => d.documentType === activeDocCategory);

  // Group checklist by category
  const categories = ["Activity Compliance", "Financial Review", "Export Review", "Document Review"] as const;

  return (
    <div 
      id="audit-detail-drawer"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50 animate-in fade-in"
    >
      <div className="bg-white w-full max-w-4xl h-full flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-extrabold text-emerald-400 text-base shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                  {audit.companyName}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  INN: {audit.stir}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.badgeClass}`}>
                  {isOverdue && !isApproved ? `OVERDUE • ${statusInfo.label}` : statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Reporting Cycle: <b className="text-emerald-400">{audit.reportingYear}</b></span>
                <span>•</span>
                <span>Statutory Due Date: <b className="text-white font-mono">{audit.dueDate}</b></span>
                <span>•</span>
                <span>Returns: <b className="text-amber-400">{audit.returnCount || 0}</b></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              title="Print / Export PDF"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (Context-aware based on current state) */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reviewer:</span>
            <span className="font-semibold text-slate-800">{audit.assignedReviewerName || "Unassigned"}</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Firm:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[160px]">{audit.auditFirm || "Not attached"}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Send Reminder Action */}
            <button
              onClick={onOpenReminderModal}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Reminder</span>
            </button>

            {/* Return for Correction */}
            {audit.status !== "APPROVED" && audit.status !== "PENDING_SUBMISSION" && (
              <button
                onClick={onOpenReturnModal}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return for Correction</span>
              </button>
            )}

            {/* Resubmit Upload */}
            {(audit.status === "RETURNED_FOR_CORRECTION" || audit.status === "PENDING_SUBMISSION") && (
              <button
                onClick={onOpenResubmitModal}
                className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Submission</span>
              </button>
            )}

            {/* Approve Audit */}
            {audit.status !== "APPROVED" && audit.status !== "PENDING_SUBMISSION" && (
              <button
                onClick={onOpenApproveModal}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve Audit</span>
              </button>
            )}

            {/* Escalate */}
            {audit.status !== "APPROVED" && audit.status !== "ESCALATED" && (
              <button
                onClick={onOpenEscalateModal}
                className="px-2.5 py-1.5 bg-rose-50 border border-rose-300 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Escalate</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & Entity Info
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "documents"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Submitted Documents</span>
            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px]">
              {audit.documents?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "checklist"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Compliance Checklist</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px]">
              {audit.checklist?.filter(c => c.result === "PASS").length || 0}/{audit.checklist?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("corrections")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "corrections"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Corrections & Returns</span>
            {audit.returnCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                {audit.returnCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "timeline"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Audit Timeline
          </button>

          <button
            onClick={() => setActiveTab("communications")}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "communications"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>Communications</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
              {audit.notifications?.length || 0}
            </span>
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Section A: Resident Information */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Section A • Resident Enterprise Profile
                  </h2>
                  <span className="text-[11px] font-bold text-slate-400">
                    ID: {audit.residentIdCode || audit.residentId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Company Legal Name</span>
                    <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{audit.companyName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">INN (STIR) Code</span>
                    <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{audit.stir}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Regional District</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{audit.residentDistrict || "Qarshi"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">General Director / CEO</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{audit.residentDirector || "Authorized Officer"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Primary Business Activity</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{audit.residentIndustry || "Software Development"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Official Contact</span>
                    <span className="font-medium text-slate-700 text-xs mt-0.5 block">{audit.residentPhone || "+998 75 200 4545"} • {audit.residentEmail || "info@company.uz"}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Annual Export</span>
                    <span className="font-extrabold text-emerald-600 text-sm block">
                      ${(audit.residentExportVolume || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Domestic Revenue</span>
                    <span className="font-bold text-slate-700 text-sm block">
                      ${(audit.residentDomesticVolume || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Rating</span>
                    <span className={`inline-block px-2 py-0.5 rounded-md font-black text-xs mt-0.5 ${
                      audit.riskLevel === "HIGH" ? "bg-rose-100 text-rose-800" :
                      audit.riskLevel === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {audit.riskLevel} RISK
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Status</span>
                    <span className={`inline-block px-2 py-0.5 rounded-md font-black text-xs mt-0.5 ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section B: Annual Audit Information */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    Section B • Audit Certification & Auditor Record
                  </h2>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    Reporting Cycle: {audit.reportingYear}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Statutory Due Date</span>
                    <span className="font-mono font-black text-slate-900 text-xs mt-0.5 block">{audit.dueDate}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Submission Date</span>
                    <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">
                      {audit.submissionDate || "Pending Initial Upload"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Audit Report Number</span>
                    <span className="font-mono font-semibold text-slate-800 text-xs mt-0.5 block">
                      {audit.auditReportNumber || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Independent Audit Firm</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{audit.auditFirm || "Not Attached"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Certified Auditor Name</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{audit.auditorName || "Not Provided"}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Assigned IT Park Reviewer</span>
                    <span className="font-bold text-blue-800 text-xs mt-0.5 block">{audit.assignedReviewerName || "Unassigned"}</span>
                  </div>
                </div>

                {audit.finalComment && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Final Approval Commentary (Approved by {audit.approvedBy} on {audit.approvedAt}):
                    </span>
                    <p className="text-slate-700 italic">{audit.finalComment}</p>
                  </div>
                )}
              </div>

              {/* Quick Checklist Summary Widget */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Review Checklist Progress
                  </h3>
                  <button
                    onClick={() => setActiveTab("checklist")}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Full Checklist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {categories.map((cat) => {
                    const items = (audit.checklist || []).filter(c => c.category === cat);
                    const passed = items.filter(c => c.result === "PASS").length;
                    const failed = items.filter(c => c.result === "FAIL").length;
                    const isAllPassed = items.length > 0 && passed === items.length;

                    return (
                      <div key={cat} className={`p-3 rounded-xl border ${
                        failed > 0 ? "bg-rose-50 border-rose-200 text-rose-900" :
                        isAllPassed ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
                        "bg-slate-50 border-slate-200 text-slate-800"
                      }`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 truncate">{cat}</span>
                        <span className="text-base font-black block mt-1">
                          {passed}/{items.length}
                        </span>
                        <span className="text-[10px] font-semibold block opacity-80">
                          {failed > 0 ? `${failed} Failed` : isAllPassed ? "All Passed" : "In Progress"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SUBMITTED DOCUMENTS & VERSIONS */}
          {activeTab === "documents" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {["ALL", "Audit Report", "Auditor's Opinion", "Financial Statements", "Export Documentation", "Supporting Documents"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveDocCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        activeDocCategory === cat
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={onOpenResubmitModal}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document / Version</span>
                </button>
              </div>

              {filteredDocs.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No documents uploaded under this category yet.</p>
                  <p className="text-[11px] text-slate-400">Click "Upload Document" to attach official PDF packages.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredDocs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-black text-slate-900 truncate">{doc.fileName}</h3>
                            <span className="px-2 py-0.2 rounded-md text-[10px] font-black font-mono bg-purple-100 text-purple-800">
                              v{doc.version}
                            </span>
                            <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                              {doc.documentType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Uploaded by <b className="text-slate-600">{doc.uploadedBy}</b> on {doc.uploadedAt} • {doc.fileSize || "3.5 MB"}
                          </p>
                          {doc.notes && (
                            <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded-md">
                              "{doc.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>Preview</span>
                        </button>
                        <a
                          href={`#download-${doc.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Simulated secure download for ${doc.fileName}`);
                          }}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Preview Modal */}
              {selectedDocPreview && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl border border-slate-200">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="text-xs font-black text-slate-900 truncate">{selectedDocPreview.fileName}</h3>
                          <span className="text-[10px] text-slate-500">Version v{selectedDocPreview.version} • {selectedDocPreview.documentType}</span>
                        </div>
                      </div>
                      <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-slate-900 text-slate-200 p-8 rounded-xl font-mono text-xs space-y-3 min-h-[220px] flex flex-col justify-center items-center text-center">
                      <ShieldCheck className="w-12 h-12 text-emerald-400 mb-2" />
                      <p className="font-bold text-white text-sm">Official IT Park Electronic Digital Signature (EDS) Verified</p>
                      <p className="text-slate-400 text-xs max-w-md">
                        Document Hash: SHA256:{Math.random().toString(36).substring(2, 15).toUpperCase()}...<br/>
                        Signer: {audit.auditorName || "Independent Auditor"} ({audit.auditFirm || "Certified Audit Firm"})
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedDocPreview(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STRUCTURED REVIEWER CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Official Statutory Compliance Checklist</p>
                  <p className="text-[11px] text-blue-800">
                    Review each criterion across Activity, Financial, Export, and Document integrity. Mark Pass, Fail, or Not Applicable (NA) and provide notes for any flagged discrepancies.
                  </p>
                </div>
              </div>

              {categories.map((category) => {
                const items = (audit.checklist || []).filter(c => c.category === category);
                return (
                  <div key={category} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {category}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400">
                        {items.filter(i => i.result === "PASS").length}/{items.length} Passed
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="pt-3 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-xs font-medium text-slate-800 leading-relaxed min-w-0">
                              {item.item}
                            </div>

                            {/* Pass / Fail / NA selector buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleChecklistResultChange(item.id, "PASS")}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                  item.result === "PASS"
                                    ? "bg-emerald-600 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                                }`}
                              >
                                Pass
                              </button>

                              <button
                                type="button"
                                onClick={() => handleChecklistResultChange(item.id, "FAIL")}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                  item.result === "FAIL"
                                    ? "bg-rose-600 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                                }`}
                              >
                                Fail
                              </button>

                              <button
                                type="button"
                                onClick={() => handleChecklistResultChange(item.id, "NA")}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                  item.result === "NA"
                                    ? "bg-slate-700 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                N/A
                              </button>
                            </div>
                          </div>

                          {/* Reviewer commentary field */}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.comment || ""}
                              onChange={(e) => handleChecklistCommentChange(item.id, e.target.value)}
                              placeholder="Reviewer comment / findings on this item..."
                              className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-700 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-hidden"
                            />
                            {item.reviewedBy && (
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                Reviewed by {item.reviewedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: CORRECTIONS & RETURNS */}
          {activeTab === "corrections" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  Correction & Return History (Total: {audit.returnCount || 0})
                </h3>
                {audit.status !== "APPROVED" && (
                  <button
                    onClick={onOpenReturnModal}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Issue New Return</span>
                  </button>
                )}
              </div>

              {(!audit.corrections || audit.corrections.length === 0) ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No correction returns issued.</p>
                  <p className="text-[11px] text-slate-400">This resident's submission has not been returned for deficiencies.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {audit.corrections.map((cor, idx) => (
                    <div key={cor.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800">
                            Return #{cor.version || idx + 1}
                          </span>
                          <h4 className="text-xs font-black text-slate-900">{cor.reason}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cor.priority === "CRITICAL" ? "bg-rose-100 text-rose-800" :
                          cor.priority === "HIGH" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                        }`}>
                          Priority: {cor.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Problems Identified</span>
                          <p className="text-slate-800">{cor.problemsIdentified}</p>
                        </div>

                        <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Required Corrective Action</span>
                          <p className="text-slate-800">{cor.correctiveAction}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Returned by <b className="text-slate-700">{cor.returnedBy}</b> on {cor.returnedAt}</span>
                        <span>Resubmission Deadline: <b className="text-amber-700 font-mono">{cor.deadline}</b></span>
                      </div>

                      {cor.resolvedAt && (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-center justify-between">
                          <span>Resolved on {cor.resolvedAt}: {cor.resolutionNotes || "Corrected documents reviewed and accepted."}</span>
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CHRONOLOGICAL AUDIT TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                Chronological Compliance & Audit Timeline
              </h3>

              <div className="relative border-l-2 border-slate-200 ml-4 pl-4 space-y-6">
                {(audit.events || []).map((ev) => (
                  <div key={ev.id} className="relative group">
                    {/* Circle marker */}
                    <div className={`absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      ev.eventType === "APPROVED" ? "bg-emerald-500" :
                      ev.eventType === "RETURNED" ? "bg-amber-500" :
                      ev.eventType === "ESCALATED" ? "bg-rose-600" :
                      ev.eventType === "SUBMITTED" || ev.eventType === "RESUBMITTED" ? "bg-purple-500" :
                      "bg-slate-400"
                    }`}></div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-900">{ev.description}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{ev.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Actor: <b className="text-slate-700">{ev.performedBy}</b> • Event: <span className="font-mono text-[10px] uppercase">{ev.eventType}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COMMUNICATIONS & NOTIFICATIONS */}
          {activeTab === "communications" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Communication & Notification Dispatch History
                </h3>
                <button
                  onClick={onOpenReminderModal}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notice / Reminder</span>
                </button>
              </div>

              {(!audit.notifications || audit.notifications.length === 0) ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No communication logs recorded yet.</p>
                  <p className="text-[11px] text-slate-400">Automated deadline triggers and manual notices will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {audit.notifications.map((notif) => (
                    <div key={notif.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            notif.channel === "EMAIL" ? "bg-blue-100 text-blue-800" :
                            notif.channel === "TELEGRAM" ? "bg-sky-100 text-sky-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {notif.channel}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{notif.subject}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">{notif.sentAt}</span>
                      </div>

                      <p className="text-xs text-slate-700 whitespace-pre-line bg-slate-50 p-2.5 rounded-lg font-mono text-[11px]">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Recipient: <b className="text-slate-600">{notif.recipient}</b></span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          {notif.deliveryStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
