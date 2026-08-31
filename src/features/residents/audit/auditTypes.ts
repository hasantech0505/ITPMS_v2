/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AuditStatus = 
  | "PENDING_SUBMISSION"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RETURNED_FOR_CORRECTION"
  | "RESUBMITTED"
  | "APPROVED"
  | "OVERDUE"
  | "REJECTED"
  | "ESCALATED";

export type AuditRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type AuditDocumentType = 
  | "Audit Report"
  | "Auditor's Opinion"
  | "Financial Statements"
  | "Supporting Documents"
  | "Export Documentation"
  | "Other Documents";

export interface AuditDocument {
  id: string;
  auditId: string;
  documentType: AuditDocumentType;
  fileName: string;
  fileUrl?: string;
  fileSize?: string;
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

export type ChecklistResult = "PASS" | "FAIL" | "NA" | "PENDING";

export interface AuditChecklistItem {
  id: string;
  auditId: string;
  category: "Activity Compliance" | "Financial Review" | "Export Review" | "Document Review";
  item: string;
  result: ChecklistResult;
  comment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface AuditCorrection {
  id: string;
  auditId: string;
  reason: string;
  problemsIdentified: string;
  correctiveAction: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  deadline: string;
  returnedBy: string;
  returnedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  version: number;
}

export type AuditEventType = 
  | "CREATED"
  | "SUBMITTED"
  | "OPENED"
  | "ASSIGNED"
  | "REVIEW_STARTED"
  | "CHECKLIST_UPDATED"
  | "RETURNED"
  | "RESUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "ESCALATED"
  | "NOTIFICATION_SENT"
  | "DOCUMENT_UPLOADED"
  | "DOCUMENT_VERSIONED"
  | "REMINDER_SENT";

export interface AuditEvent {
  id: string;
  auditId: string;
  eventType: AuditEventType;
  description: string;
  performedBy: string;
  createdAt: string;
  details?: string;
  metadata?: Record<string, any>;
}

export type EscalationLevel = 
  | "Department Head"
  | "Branch Director"
  | "Central IT Park"
  | "Legal/Compliance";

export interface AuditEscalation {
  id: string;
  auditId: string;
  level: EscalationLevel;
  reason: string;
  assignedTo: string;
  escalatedBy: string;
  escalatedAt: string;
  resolutionDeadline?: string;
  resolution?: string;
  resolvedAt?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}

export type NotificationTriggerType = 
  | "DEADLINE_REMINDER_30D"
  | "DEADLINE_REMINDER_14D"
  | "DEADLINE_REMINDER_7D"
  | "DEADLINE_REMINDER_1D"
  | "OVERDUE_ALERT"
  | "RETURNED_NOTICE"
  | "RESUBMISSION_ALERT"
  | "APPROVAL_NOTICE"
  | "ESCALATION_ALERT"
  | "CUSTOM_REMINDER";

export interface AuditNotification {
  id: string;
  auditId: string;
  type: NotificationTriggerType;
  recipient: string;
  subject: string;
  message: string;
  channel: "EMAIL" | "TELEGRAM" | "PORTAL";
  sentAt: string;
  deliveryStatus: "SENT" | "DELIVERED" | "FAILED";
  relatedAuditStatus: string;
}

export interface ResidentAudit {
  id: string;
  residentId: string;
  companyName: string;
  stir: string; // INN (9 digits)
  residentIdCode?: string; // e.g. ITP-UZ-0142
  reportingYear: number;
  dueDate: string; // Calculated dynamically e.g. 2026-07-01
  submissionDate?: string;
  status: AuditStatus;
  riskLevel: AuditRiskLevel;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  auditFirm?: string;
  auditorName?: string;
  auditReportNumber?: string;
  auditDate?: string;
  returnCount: number;
  finalComment?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Embedded relational sub-entities
  documents: AuditDocument[];
  checklist: AuditChecklistItem[];
  corrections: AuditCorrection[];
  events: AuditEvent[];
  escalations: AuditEscalation[];
  notifications: AuditNotification[];
  
  // Cached resident profile details
  residentDistrict?: string;
  residentIndustry?: string;
  residentExportVolume?: number;
  residentDomesticVolume?: number;
  residentDirector?: string;
  residentPhone?: string;
  residentEmail?: string;
}

export interface AuditDeadlineConfig {
  dueMonth: number; // 7 = July
  dueDay: number; // 1 = 1st
  urgentThresholdDays: number; // e.g. 14 days
  attentionThresholdDays: number; // e.g. 30 days
  notificationDays: number[]; // [30, 14, 7, 1]
  regulatoryNote: string;
}

export const DEFAULT_DEADLINE_CONFIG: AuditDeadlineConfig = {
  dueMonth: 7,
  dueDay: 1,
  urgentThresholdDays: 14,
  attentionThresholdDays: 30,
  notificationDays: [30, 14, 7, 1],
  regulatoryNote: "Cabinet of Ministers Decree No. 589: IT Park residents must submit annual independent audit reports by July 1 of the subsequent calendar year."
};

export const STANDARD_CHECKLIST_TEMPLATE = [
  // Activity Compliance
  { category: "Activity Compliance" as const, item: "Actual activities correspond strictly to approved IT Park activity types" },
  { category: "Activity Compliance" as const, item: "Business activity is consistent with the resident's approved business plan" },
  { category: "Activity Compliance" as const, item: "Activities are within applicable permitted software/BPO categories" },
  { category: "Activity Compliance" as const, item: "Revenue generated from core tech activities is verified and documented" },
  
  // Financial Review
  { category: "Financial Review" as const, item: "Complete financial statement package (Balance Sheet, P&L, Cash Flow) provided" },
  { category: "Financial Review" as const, item: "Revenue and tax exemption calculations are internally consistent" },
  { category: "Financial Review" as const, item: "Independent audit firm licensed and registered in the Ministry of Economy register" },
  { category: "Financial Review" as const, item: "Financial/economic audit opinion is unqualified or issues clearly addressed" },
  
  // Export Review
  { category: "Export Review" as const, item: "Export revenue declaration and currency inflow certificates provided" },
  { category: "Export Review" as const, item: "Export contracts, foreign client invoices, and customs/bank acts verified" },
  { category: "Export Review" as const, item: "Export revenue structure documented by country and service vertical" },
  { category: "Export Review" as const, item: "Mandatory minimum export quota thresholds fulfilled as required" },
  
  // Document Review
  { category: "Document Review" as const, item: "Official independent audit report signed with electronic digital signature (EDS)" },
  { category: "Document Review" as const, item: "Certified auditor opinion letter attached with auditor license stamp" },
  { category: "Document Review" as const, item: "Required supporting financial and tax breakdown notes attached" },
  { category: "Document Review" as const, item: "Documents are legible, high resolution, and complete with no missing pages" },
  { category: "Document Review" as const, item: "Documents correspond strictly to the specified reporting calendar year" }
];

export const STATUS_CONFIG: Record<AuditStatus, { label: string; badgeClass: string; bgClass: string; borderClass: string; textClass: string }> = {
  PENDING_SUBMISSION: {
    label: "Pending Submission",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    bgClass: "bg-slate-50",
    borderClass: "border-slate-200",
    textClass: "text-slate-700"
  },
  SUBMITTED: {
    label: "Submitted",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    bgClass: "bg-sky-50",
    borderClass: "border-sky-200",
    textClass: "text-sky-800"
  },
  UNDER_REVIEW: {
    label: "Under Review",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    textClass: "text-blue-800"
  },
  RETURNED_FOR_CORRECTION: {
    label: "Returned for Correction",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    textClass: "text-amber-800"
  },
  RESUBMITTED: {
    label: "Resubmitted",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200",
    textClass: "text-purple-800"
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-800"
  },
  OVERDUE: {
    label: "Overdue",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse",
    bgClass: "bg-rose-50",
    borderClass: "border-rose-200",
    textClass: "text-rose-800"
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    textClass: "text-red-800"
  },
  ESCALATED: {
    label: "Escalated",
    badgeClass: "bg-rose-900 text-white border-rose-950 font-bold",
    bgClass: "bg-rose-950/20",
    borderClass: "border-rose-900",
    textClass: "text-rose-900"
  }
};

/**
 * Calculates days remaining until the specified due date.
 * Returns negative number if overdue.
 */
export function calculateDaysRemaining(dueDateStr: string): number {
  if (!dueDateStr) return 0;
  const now = new Date();
  const due = new Date(dueDateStr);
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

