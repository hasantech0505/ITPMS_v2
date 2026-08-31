/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Settings, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  FileText, 
  Plus, 
  Sparkles,
  Layers,
  History,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { Resident, ResidentStatus } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";
import { 
  ResidentAudit, 
  AuditStatus, 
  AuditDeadlineConfig, 
  DEFAULT_DEADLINE_CONFIG,
  AuditCorrection,
  AuditEscalation,
  AuditNotification,
  AuditDocument,
  AuditEvent
} from "./auditTypes";
import { 
  generateInitialAuditsForResidents, 
  computeDefaultDueDate, 
  computeRiskLevel, 
  calculateDaysRemaining 
} from "./auditSeedData";

// Sub-components
import AuditDashboardTab from "./AuditDashboardTab";
import AuditRegisterTab from "./AuditRegisterTab";
import AuditHistoryTab from "./AuditHistoryTab";
import AuditAnalyticsSection from "./AuditAnalyticsSection";
import AuditDetailDrawer from "./AuditDetailDrawer";
import ReturnForCorrectionModal from "./ReturnForCorrectionModal";
import ApproveAuditModal from "./ApproveAuditModal";
import ResubmitAuditModal from "./ResubmitAuditModal";
import EscalateCaseModal from "./EscalateCaseModal";
import SendReminderModal from "./SendReminderModal";
import AuditSettingsModal from "./AuditSettingsModal";

interface ResidentAuditManagementProps {
  residents: Resident[];
  onUpdate?: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole?: string;
  onSyncState?: () => void;
}

export default function ResidentAuditManagement({
  residents,
  onUpdate,
  userRole = "SUPER_ADMIN",
  onSyncState
}: ResidentAuditManagementProps) {
  const { t } = useLanguage();

  // Storage key for state persistence
  const AUDIT_STORAGE_KEY = "itpms_resident_audits_v2";
  const CONFIG_STORAGE_KEY = "itpms_audit_deadline_config_v2";

  // Deadline & Regulatory configuration
  const [config, setConfig] = useState<AuditDeadlineConfig>(() => {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_DEADLINE_CONFIG;
  });

  // State: All Audits
  const [audits, setAudits] = useState<ResidentAudit[]>(() => {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return generateInitialAuditsForResidents(residents, config);
  });

  // If residents list changes (e.g. new resident added in system), ensure an audit record exists
  useEffect(() => {
    if (residents && residents.length > 0) {
      setAudits(prev => {
        const existingResidentIds = new Set(prev.map(a => a.residentId));
        const missingResidents = residents.filter(r => 
          !existingResidentIds.has(r.id) && 
          (r.status === ResidentStatus.ACTIVE || r.status === ResidentStatus.SUSPENDED || r.status === ResidentStatus.PENDING)
        );

        if (missingResidents.length > 0) {
          const newAudits = generateInitialAuditsForResidents(missingResidents, config);
          const merged = [...prev, ...newAudits];
          localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return prev;
      });
    }
  }, [residents, config]);

  // Save changes to localStorage helper
  const saveAuditsState = (updatedList: ResidentAudit[]) => {
    setAudits(updatedList);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Selected Reporting Year State (Default: 2025 cycle - current active cycle)
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Active Main Tab inside Compliance & Audit
  // 10 Tabs: dashboard, register, pending, under-review, returned, resubmitted, approved, overdue, escalated, history, analytics
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Selected Audit for Detailed Inspection (Drawer)
  const [selectedAudit, setSelectedAudit] = useState<ResidentAudit | null>(null);

  // Modal Triggers
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeModalAudit, setActiveModalAudit] = useState<ResidentAudit | null>(null);

  // Active certified residents count
  const activeResidentsCount = useMemo(() => {
    return residents.filter(r => r.status === ResidentStatus.ACTIVE || r.status === ResidentStatus.SUSPENDED).length || audits.filter(a => a.reportingYear === selectedYear).length;
  }, [residents, audits, selectedYear]);

  // Helper to open action modals
  const handleOpenActionModal = (type: "return" | "approve" | "resubmit" | "escalate" | "reminder", audit: ResidentAudit) => {
    setActiveModalAudit(audit);
    if (type === "return") setShowReturnModal(true);
    if (type === "approve") setShowApproveModal(true);
    if (type === "resubmit") setShowResubmitModal(true);
    if (type === "escalate") setShowEscalateModal(true);
    if (type === "reminder") setShowReminderModal(true);
  };

  // Update Single Audit Record in State & Drawer
  const handleUpdateAudit = async (updated: ResidentAudit) => {
    const nextList = audits.map(a => a.id === updated.id ? updated : a);
    saveAuditsState(nextList);
    if (selectedAudit?.id === updated.id) {
      setSelectedAudit(updated);
    }
  };

  // 1. Submit Return for Correction
  const handleReturnForCorrection = async (correctionData: Omit<AuditCorrection, "id" | "returnedAt">) => {
    if (!activeModalAudit) return;
    const nowStr = new Date().toISOString().split("T")[0];
    const newReturnCount = (activeModalAudit.returnCount || 0) + 1;

    const newCorrection: AuditCorrection = {
      id: `cor-${activeModalAudit.id}-${Date.now()}`,
      returnedAt: nowStr,
      ...correctionData
    };

    const newEvent: AuditEvent = {
      id: `ev-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      eventType: "RETURNED",
      description: `Returned for correction: ${correctionData.reason}`,
      performedBy: correctionData.returnedBy,
      createdAt: nowStr
    };

    const newNotification: AuditNotification = {
      id: `notif-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      type: "RETURNED_NOTICE",
      recipient: activeModalAudit.residentEmail || "director@company.uz",
      subject: `[Action Required] Annual Audit ${activeModalAudit.reportingYear} Returned for Correction`,
      message: `Your annual audit report has been returned. Reason: ${correctionData.reason}.\nProblems: ${correctionData.problemsIdentified}\nAction Required: ${correctionData.correctiveAction}\nResubmission Deadline: ${correctionData.deadline}`,
      channel: "EMAIL",
      sentAt: nowStr,
      deliveryStatus: "DELIVERED",
      relatedAuditStatus: "RETURNED_FOR_CORRECTION"
    };

    const updatedRisk = computeRiskLevel("RETURNED_FOR_CORRECTION", activeModalAudit.dueDate, newReturnCount, false);

    const updatedAudit: ResidentAudit = {
      ...activeModalAudit,
      status: "RETURNED_FOR_CORRECTION",
      riskLevel: updatedRisk,
      returnCount: newReturnCount,
      updatedAt: nowStr,
      corrections: [...(activeModalAudit.corrections || []), newCorrection],
      events: [...(activeModalAudit.events || []), newEvent],
      notifications: [...(activeModalAudit.notifications || []), newNotification]
    };

    await handleUpdateAudit(updatedAudit);
  };

  // 2. Approve Audit
  const handleApproveAudit = async (finalComment: string, reviewerName: string) => {
    if (!activeModalAudit) return;
    const nowStr = new Date().toISOString().split("T")[0];

    const newEvent: AuditEvent = {
      id: `ev-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      eventType: "APPROVED",
      description: `Audit report approved with full compliance certification by ${reviewerName}.`,
      performedBy: reviewerName,
      createdAt: nowStr
    };

    const newNotification: AuditNotification = {
      id: `notif-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      type: "APPROVAL_NOTICE",
      recipient: activeModalAudit.residentEmail || "director@company.uz",
      subject: `[IT Park Kashkadarya] Annual Audit ${activeModalAudit.reportingYear} Approved`,
      message: `Congratulations! Your annual independent audit report for reporting period ${activeModalAudit.reportingYear} has been approved.\nComment: ${finalComment}`,
      channel: "EMAIL",
      sentAt: nowStr,
      deliveryStatus: "DELIVERED",
      relatedAuditStatus: "APPROVED"
    };

    const updatedAudit: ResidentAudit = {
      ...activeModalAudit,
      status: "APPROVED",
      riskLevel: "LOW",
      finalComment,
      approvedBy: reviewerName,
      approvedAt: nowStr,
      updatedAt: nowStr,
      events: [...(activeModalAudit.events || []), newEvent],
      notifications: [...(activeModalAudit.notifications || []), newNotification]
    };

    await handleUpdateAudit(updatedAudit);
  };

  // 3. Resubmit Audit
  const handleResubmitAudit = async (resubmissionData: {
    notes: string;
    documents: Array<Omit<AuditDocument, "id" | "auditId">>;
    submittedBy: string;
  }) => {
    if (!activeModalAudit) return;
    const nowStr = new Date().toISOString().split("T")[0];

    const formattedDocs: AuditDocument[] = resubmissionData.documents.map((d, i) => ({
      id: `doc-${activeModalAudit.id}-${Date.now()}-${i}`,
      auditId: activeModalAudit.id,
      ...d
    }));

    const newEvent: AuditEvent = {
      id: `ev-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      eventType: "RESUBMITTED",
      description: `Corrected audit submission uploaded by ${resubmissionData.submittedBy}: "${resubmissionData.notes.slice(0, 60)}..."`,
      performedBy: resubmissionData.submittedBy,
      createdAt: nowStr
    };

    const newNotification: AuditNotification = {
      id: `notif-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      type: "RESUBMISSION_ALERT",
      recipient: activeModalAudit.assignedReviewerName || "Compliance Department",
      subject: `Resubmission Received: ${activeModalAudit.companyName} (${activeModalAudit.reportingYear})`,
      message: `${activeModalAudit.companyName} has resubmitted corrected audit package for review.`,
      channel: "PORTAL",
      sentAt: nowStr,
      deliveryStatus: "DELIVERED",
      relatedAuditStatus: "RESUBMITTED"
    };

    const updatedRisk = computeRiskLevel("RESUBMITTED", activeModalAudit.dueDate, activeModalAudit.returnCount || 0, false);

    const updatedAudit: ResidentAudit = {
      ...activeModalAudit,
      status: "RESUBMITTED",
      submissionDate: nowStr,
      riskLevel: updatedRisk,
      updatedAt: nowStr,
      documents: [...(activeModalAudit.documents || []), ...formattedDocs],
      events: [...(activeModalAudit.events || []), newEvent],
      notifications: [...(activeModalAudit.notifications || []), newNotification]
    };

    await handleUpdateAudit(updatedAudit);
  };

  // 4. Escalate Case
  const handleEscalateCase = async (escalationData: Omit<AuditEscalation, "id" | "escalatedAt" | "status">) => {
    if (!activeModalAudit) return;
    const nowStr = new Date().toISOString().split("T")[0];

    const newEscalation: AuditEscalation = {
      id: `esc-${activeModalAudit.id}-${Date.now()}`,
      escalatedAt: nowStr,
      status: "OPEN",
      ...escalationData
    };

    const newEvent: AuditEvent = {
      id: `ev-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      eventType: "ESCALATED",
      description: `Case escalated to ${escalationData.level} (${escalationData.assignedTo}). Reason: ${escalationData.reason}`,
      performedBy: escalationData.escalatedBy,
      createdAt: nowStr
    };

    const newNotification: AuditNotification = {
      id: `notif-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      type: "ESCALATION_ALERT",
      recipient: escalationData.assignedTo,
      subject: `[CRITICAL ESCALATION] Compliance Case: ${activeModalAudit.companyName}`,
      message: `Audit compliance case regarding ${activeModalAudit.companyName} (${activeModalAudit.reportingYear} cycle) has been formally escalated.\nReason: ${escalationData.reason}\nTarget Resolution: ${escalationData.resolutionDeadline}`,
      channel: "PORTAL",
      sentAt: nowStr,
      deliveryStatus: "DELIVERED",
      relatedAuditStatus: "ESCALATED"
    };

    const updatedAudit: ResidentAudit = {
      ...activeModalAudit,
      status: "ESCALATED",
      riskLevel: "HIGH",
      updatedAt: nowStr,
      escalations: [...(activeModalAudit.escalations || []), newEscalation],
      events: [...(activeModalAudit.events || []), newEvent],
      notifications: [...(activeModalAudit.notifications || []), newNotification]
    };

    await handleUpdateAudit(updatedAudit);
  };

  // 5. Send Reminder
  const handleSendReminder = async (notificationData: Omit<AuditNotification, "id" | "sentAt" | "deliveryStatus">) => {
    if (!activeModalAudit) return;
    const nowStr = new Date().toISOString().split("T")[0];

    const newNotification: AuditNotification = {
      id: `notif-${activeModalAudit.id}-${Date.now()}`,
      sentAt: nowStr,
      deliveryStatus: "DELIVERED",
      ...notificationData
    };

    const newEvent: AuditEvent = {
      id: `ev-${activeModalAudit.id}-${Date.now()}`,
      auditId: activeModalAudit.id,
      eventType: "REMINDER_SENT",
      description: `Dispatched ${notificationData.channel} reminder to ${notificationData.recipient}: "${notificationData.subject}"`,
      performedBy: "Compliance Officer",
      createdAt: nowStr
    };

    const updatedAudit: ResidentAudit = {
      ...activeModalAudit,
      updatedAt: nowStr,
      events: [...(activeModalAudit.events || []), newEvent],
      notifications: [...(activeModalAudit.notifications || []), newNotification]
    };

    await handleUpdateAudit(updatedAudit);
  };

  // 6. Save Configuration & Recalculate Due Dates
  const handleSaveConfig = (newConfig: AuditDeadlineConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));

    // Recalculate due dates across audits
    const updatedAudits = audits.map(a => {
      const newDueDate = computeDefaultDueDate(a.reportingYear, newConfig);
      const newRisk = computeRiskLevel(a.status, newDueDate, a.returnCount || 0, a.escalations?.length > 0);
      return {
        ...a,
        dueDate: newDueDate,
        riskLevel: newRisk
      };
    });
    saveAuditsState(updatedAudits);
  };

  // Tab Badge counts for the selected year
  const tabCounts = useMemo(() => {
    const list = audits.filter(a => a.reportingYear === selectedYear);
    return {
      pending: list.filter(a => a.status === "PENDING_SUBMISSION").length,
      underReview: list.filter(a => a.status === "UNDER_REVIEW").length,
      returned: list.filter(a => a.status === "RETURNED_FOR_CORRECTION").length,
      resubmitted: list.filter(a => a.status === "RESUBMITTED").length,
      approved: list.filter(a => a.status === "APPROVED").length,
      overdue: list.filter(a => a.status !== "APPROVED" && (calculateDaysRemaining(a.dueDate) < 0 || a.status === "OVERDUE")).length,
      escalated: list.filter(a => a.status === "ESCALATED").length,
    };
  }, [audits, selectedYear]);

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Title & Subtitle */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Resident Audit & Compliance Management
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Statutory annual independent audit submissions, reviewer checklists, return workflows, and regulatory compliance monitoring.
            </p>
          </div>

          {/* Top Controls: Reporting Year Selector & Settings */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Reporting Year Selector */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-4 h-4 text-emerald-600 ml-1.5" />
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Reporting Cycle:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-white border border-slate-300 font-black text-xs text-slate-900 rounded-lg px-3 py-1 shadow-2xs cursor-pointer outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value={2026}>2026 Cycle (Due 2027-07-01)</option>
                <option value={2025}>2025 Cycle (Due 2026-07-01)</option>
                <option value={2024}>2024 Cycle (Due 2025-07-01)</option>
                <option value={2023}>2023 Cycle (Historical)</option>
              </select>
            </div>

            {/* Regulatory Settings Modal Toggle */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
              title="Configure Regulatory Deadline Rules"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10 Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-100 pt-3 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", count: null },
            { id: "register", label: "Audit Register", count: null },
            { id: "pending", label: "Pending Submission", count: tabCounts.pending, badge: "bg-slate-100 text-slate-700" },
            { id: "under-review", label: "Under Review", count: tabCounts.underReview, badge: "bg-blue-100 text-blue-800" },
            { id: "returned", label: "Returned", count: tabCounts.returned, badge: "bg-amber-100 text-amber-800 font-bold" },
            { id: "resubmitted", label: "Resubmitted", count: tabCounts.resubmitted, badge: "bg-purple-100 text-purple-800" },
            { id: "approved", label: "Approved", count: tabCounts.approved, badge: "bg-emerald-100 text-emerald-800" },
            { id: "overdue", label: "Overdue", count: tabCounts.overdue, badge: "bg-rose-100 text-rose-800 font-black" },
            { id: "escalated", label: "Escalated", count: tabCounts.escalated, badge: "bg-rose-900 text-white font-black" },
            { id: "history", label: "Compliance History", count: null },
            { id: "analytics", label: "Deep Analytics", count: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${tab.badge || "bg-slate-200 text-slate-800"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Routing */}
      {activeTab === "dashboard" && (
        <AuditDashboardTab
          audits={audits}
          selectedYear={selectedYear}
          totalActiveResidentsCount={activeResidentsCount}
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
          onNavigateToTab={setActiveTab}
        />
      )}

      {activeTab === "register" && (
        <AuditRegisterTab
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="ALL"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {/* Status-specific Filtered Register Views */}
      {activeTab === "pending" && (
        <AuditRegisterTab
          key="pending"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="PENDING_SUBMISSION"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "under-review" && (
        <AuditRegisterTab
          key="under-review"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="UNDER_REVIEW"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "returned" && (
        <AuditRegisterTab
          key="returned"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="RETURNED_FOR_CORRECTION"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "resubmitted" && (
        <AuditRegisterTab
          key="resubmitted"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="RESUBMITTED"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "approved" && (
        <AuditRegisterTab
          key="approved"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="APPROVED"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "overdue" && (
        <AuditRegisterTab
          key="overdue"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="OVERDUE"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "escalated" && (
        <AuditRegisterTab
          key="escalated"
          audits={audits}
          selectedYear={selectedYear}
          initialStatusFilter="ESCALATED"
          onSelectAudit={setSelectedAudit}
          onOpenReminderModal={(audit) => handleOpenActionModal("reminder", audit)}
        />
      )}

      {activeTab === "history" && (
        <AuditHistoryTab
          audits={audits}
          onSelectAudit={setSelectedAudit}
        />
      )}

      {activeTab === "analytics" && (
        <AuditAnalyticsSection
          audits={audits}
          selectedYear={selectedYear}
        />
      )}

      {/* Slide-over Audit Detail Drawer */}
      {selectedAudit && (
        <AuditDetailDrawer
          audit={selectedAudit}
          currentUser="Senior Compliance Reviewer"
          userRole={userRole}
          onClose={() => setSelectedAudit(null)}
          onUpdateAudit={handleUpdateAudit}
          onOpenReturnModal={() => handleOpenActionModal("return", selectedAudit)}
          onOpenApproveModal={() => handleOpenActionModal("approve", selectedAudit)}
          onOpenResubmitModal={() => handleOpenActionModal("resubmit", selectedAudit)}
          onOpenEscalateModal={() => handleOpenActionModal("escalate", selectedAudit)}
          onOpenReminderModal={() => handleOpenActionModal("reminder", selectedAudit)}
        />
      )}

      {/* Action Modals */}
      {showReturnModal && activeModalAudit && (
        <ReturnForCorrectionModal
          audit={activeModalAudit}
          currentUser="Senior Compliance Reviewer"
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleReturnForCorrection}
        />
      )}

      {showApproveModal && activeModalAudit && (
        <ApproveAuditModal
          audit={activeModalAudit}
          currentUser="Senior Compliance Reviewer"
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApproveAudit}
        />
      )}

      {showResubmitModal && activeModalAudit && (
        <ResubmitAuditModal
          audit={activeModalAudit}
          onClose={() => setShowResubmitModal(false)}
          onResubmit={handleResubmitAudit}
        />
      )}

      {showEscalateModal && activeModalAudit && (
        <EscalateCaseModal
          audit={activeModalAudit}
          currentUser="Compliance Auditor"
          onClose={() => setShowEscalateModal(false)}
          onEscalate={handleEscalateCase}
        />
      )}

      {showReminderModal && activeModalAudit && (
        <SendReminderModal
          audit={activeModalAudit}
          onClose={() => setShowReminderModal(false)}
          onSend={handleSendReminder}
        />
      )}

      {showSettingsModal && (
        <AuditSettingsModal
          config={config}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSaveConfig}
        />
      )}

    </div>
  );
}
