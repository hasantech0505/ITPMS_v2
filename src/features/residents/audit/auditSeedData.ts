/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resident, ResidentStatus } from "../../../types";
import { 
  ResidentAudit, 
  AuditStatus, 
  AuditRiskLevel, 
  AuditDeadlineConfig, 
  DEFAULT_DEADLINE_CONFIG, 
  STANDARD_CHECKLIST_TEMPLATE,
  AuditDocument,
  AuditChecklistItem,
  AuditEvent,
  AuditCorrection,
  AuditEscalation,
  AuditNotification
} from "./auditTypes";

/**
 * Compute the regulatory due date dynamically based on reporting year:
 * Formula: reportingYear + 1 + July 1 (or configured month/day)
 */
export function computeDefaultDueDate(reportingYear: number, config: AuditDeadlineConfig = DEFAULT_DEADLINE_CONFIG): string {
  const targetYear = reportingYear + 1;
  const mm = String(config.dueMonth).padStart(2, "0");
  const dd = String(config.dueDay).padStart(2, "0");
  return `${targetYear}-${mm}-${dd}`;
}

/**
 * Compute days remaining until deadline.
 */
export function calculateDaysRemaining(dueDateStr: string): number {
  const due = new Date(dueDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Compute dynamic risk level based on audit state, deadline, and return history.
 */
export function computeRiskLevel(
  status: AuditStatus, 
  dueDate: string, 
  returnCount: number, 
  hasEscalation: boolean
): AuditRiskLevel {
  const isApproved = status === "APPROVED";
  const daysLeft = calculateDaysRemaining(dueDate);
  const isOverdue = daysLeft < 0 && !isApproved;

  if (hasEscalation || isOverdue || returnCount >= 2 || status === "ESCALATED" || status === "REJECTED") {
    return "HIGH";
  }

  if (
    status === "RETURNED_FOR_CORRECTION" || 
    (daysLeft <= 30 && !isApproved) || 
    (status === "UNDER_REVIEW" && returnCount >= 1)
  ) {
    return "MEDIUM";
  }

  return "LOW";
}

/**
 * Generate default checklist items for an audit record.
 */
export function generateDefaultChecklist(auditId: string, initialStatus: AuditStatus = "PENDING_SUBMISSION"): AuditChecklistItem[] {
  return STANDARD_CHECKLIST_TEMPLATE.map((tpl, idx) => {
    let result: "PASS" | "FAIL" | "NA" | "PENDING" = "PENDING";
    let comment = "";

    if (initialStatus === "APPROVED") {
      result = "PASS";
      comment = "Verified compliant with regulatory IT Park standards.";
    } else if (initialStatus === "UNDER_REVIEW" || initialStatus === "RETURNED_FOR_CORRECTION" || initialStatus === "RESUBMITTED") {
      if (idx < 5) {
        result = "PASS";
        comment = "Confirmed against registered business plan.";
      } else if (idx === 8 && initialStatus === "RETURNED_FOR_CORRECTION") {
        result = "FAIL";
        comment = "Foreign client currency certificate missing for Q3/Q4 contracts.";
      } else {
        result = idx % 3 === 0 ? "PASS" : "PENDING";
      }
    }

    return {
      id: `chk-${auditId}-${idx + 1}`,
      auditId,
      category: tpl.category,
      item: tpl.item,
      result,
      comment
    };
  });
}

/**
 * Synthesize rich annual audit records across reporting years (2024, 2025, 2026)
 * for all active/relevant resident companies in the database.
 */
export function generateInitialAuditsForResidents(
  residents: Resident[], 
  config: AuditDeadlineConfig = DEFAULT_DEADLINE_CONFIG
): ResidentAudit[] {
  const results: ResidentAudit[] = [];

  // Filter out potential or rejected candidates (audits apply to certified/active/suspended residents)
  const auditEligibleResidents = residents.filter(
    r => r.status === ResidentStatus.ACTIVE || r.status === ResidentStatus.SUSPENDED || r.status === ResidentStatus.PENDING
  );

  const activeResidents = auditEligibleResidents.length > 0 ? auditEligibleResidents : residents;

  const reviewers = [
    { id: "rev-1", name: "Dilnoza Alimova" },
    { id: "rev-2", name: "Hasan Abdukarimov" },
    { id: "rev-3", name: "Sarvar Mukhammadiev" },
    { id: "rev-4", name: "Olim Shokirov" }
  ];

  const auditFirms = [
    { firm: "PricewaterhouseCoopers Uzbekistan LLC", auditor: "Farrukh Rakhimov" },
    { firm: "Ernst & Young Advisory Services LLC", auditor: "Nodira Karimova" },
    { firm: "KPMG Audit LLC Tashkent", auditor: "Jasur Mirzayev" },
    { firm: "Deloitte & Touche Audit LLC", auditor: "Alisher Tursunov" },
    { firm: "Grant Thornton Audit LLC", auditor: "Kamola Usmonova" },
    { firm: "BDO Uzbekistan LLC", auditor: "Rustam Khasanov" },
    { firm: "PKF International Audit LLC", auditor: "Zulfiya Ergasheva" },
    { firm: "Nasaf Audit Express LLC (Qarshi)", auditor: "Bekzod Normurodov" }
  ];

  activeResidents.forEach((resident, rIdx) => {
    const reviewer = reviewers[rIdx % reviewers.length];
    const firmInfo = auditFirms[rIdx % auditFirms.length];
    const stirNumber = resident.registrationNumber?.replace(/\D/g, "") || `30${(100000 + rIdx * 73).toString()}`;

    // --- 1. REPORTING YEAR 2024 (Historical Cycle - Due 2025-07-01) ---
    const dueDate2024 = computeDefaultDueDate(2024, config);
    const auditId2024 = `aud-${resident.id}-2024`;
    const isPassed2024 = rIdx !== 3; // one historical escalated case

    const docs2024: AuditDocument[] = [
      {
        id: `doc-${auditId2024}-1`,
        auditId: auditId2024,
        documentType: "Audit Report",
        fileName: `${resident.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Annual_Audit_2024_Final.pdf`,
        fileSize: "3.4 MB",
        version: 1,
        uploadedBy: resident.director || "Director",
        uploadedAt: "2025-05-18",
        notes: "Official signed audit report with EDS."
      },
      {
        id: `doc-${auditId2024}-2`,
        auditId: auditId2024,
        documentType: "Auditor's Opinion",
        fileName: `Auditor_Opinion_${firmInfo.firm.slice(0, 10)}_2024.pdf`,
        fileSize: "1.2 MB",
        version: 1,
        uploadedBy: resident.director || "Director",
        uploadedAt: "2025-05-18",
        notes: "Unqualified clean audit opinion."
      },
      {
        id: `doc-${auditId2024}-3`,
        auditId: auditId2024,
        documentType: "Financial Statements",
        fileName: `Financial_Statements_BalanceSheet_2024.pdf`,
        fileSize: "2.1 MB",
        version: 1,
        uploadedBy: resident.director || "Director",
        uploadedAt: "2025-05-18"
      }
    ];

    const events2024: AuditEvent[] = [
      {
        id: `ev-${auditId2024}-1`,
        auditId: auditId2024,
        eventType: "CREATED",
        description: `Annual audit compliance cycle 2024 initialized. Due date set to ${dueDate2024}.`,
        performedBy: "System (Regulatory Automation)",
        createdAt: "2025-01-02"
      },
      {
        id: `ev-${auditId2024}-2`,
        auditId: auditId2024,
        eventType: "SUBMITTED",
        description: `Annual Audit Report 2024 submitted by ${resident.director} (${resident.companyName}).`,
        performedBy: resident.director || "Resident Director",
        createdAt: "2025-05-18"
      },
      {
        id: `ev-${auditId2024}-3`,
        auditId: auditId2024,
        eventType: "ASSIGNED",
        description: `Assigned to Senior Compliance Officer ${reviewer.name}.`,
        performedBy: "Department Head",
        createdAt: "2025-05-19"
      },
      {
        id: `ev-${auditId2024}-4`,
        auditId: auditId2024,
        eventType: isPassed2024 ? "APPROVED" : "ESCALATED",
        description: isPassed2024
          ? `Audit report approved with 100% compliance validation by ${reviewer.name}.`
          : `Escalated to Branch Director due to discrepancy in export contract reconciliation.`,
        performedBy: reviewer.name,
        createdAt: "2025-05-28"
      }
    ];

    results.push({
      id: auditId2024,
      residentId: resident.id,
      companyName: resident.companyName,
      stir: stirNumber,
      residentIdCode: `ITP-KASH-${String(rIdx + 1).padStart(4, "0")}`,
      reportingYear: 2024,
      dueDate: dueDate2024,
      submissionDate: "2025-05-18",
      status: isPassed2024 ? "APPROVED" : "APPROVED", // 2024 historical is resolved
      riskLevel: "LOW",
      assignedReviewerId: reviewer.id,
      assignedReviewerName: reviewer.name,
      auditFirm: firmInfo.firm,
      auditorName: firmInfo.auditor,
      auditReportNumber: `AUD-2024-${1000 + rIdx}`,
      auditDate: "2025-05-15",
      returnCount: isPassed2024 ? 0 : 1,
      finalComment: "Compliant with IT Park resident charter decree requirements.",
      approvedBy: reviewer.name,
      approvedAt: "2025-05-28",
      createdAt: "2025-01-02",
      updatedAt: "2025-05-28",
      documents: docs2024,
      checklist: generateDefaultChecklist(auditId2024, "APPROVED"),
      corrections: [],
      events: events2024,
      escalations: [],
      notifications: [
        {
          id: `notif-${auditId2024}-1`,
          auditId: auditId2024,
          type: "APPROVAL_NOTICE",
          recipient: resident.email || "director@company.uz",
          subject: "IT Park Kashkadarya - Annual Audit 2024 Approved",
          message: "Your 2024 Annual Audit report has been fully approved by the Compliance Department.",
          channel: "EMAIL",
          sentAt: "2025-05-28",
          deliveryStatus: "DELIVERED",
          relatedAuditStatus: "APPROVED"
        }
      ],
      residentDistrict: resident.district || "Qarshi",
      residentIndustry: resident.industry || "Software Development",
      residentExportVolume: resident.exportVolume,
      residentDomesticVolume: resident.domesticVolume,
      residentDirector: resident.director,
      residentPhone: resident.phone,
      residentEmail: resident.email
    });

    // --- 2. REPORTING YEAR 2025 (Current Active Cycle - Due 2026-07-01) ---
    const dueDate2025 = computeDefaultDueDate(2025, config);
    const auditId2025 = `aud-${resident.id}-2025`;
    
    // Distribute statuses across residents for a rich, realistic enterprise demo
    let status2025: AuditStatus;
    let submissionDate2025: string | undefined = undefined;
    let returnCount2025 = 0;
    const corrections2025: AuditCorrection[] = [];
    const escalations2025: AuditEscalation[] = [];
    const notifications2025: AuditNotification[] = [];

    const cyclePattern = rIdx % 7;
    if (cyclePattern === 0 || cyclePattern === 1) {
      status2025 = "APPROVED";
      submissionDate2025 = "2026-05-12";
    } else if (cyclePattern === 2) {
      status2025 = "UNDER_REVIEW";
      submissionDate2025 = "2026-06-20";
    } else if (cyclePattern === 3) {
      status2025 = "RETURNED_FOR_CORRECTION";
      submissionDate2025 = "2026-06-05";
      returnCount2025 = 1;
      corrections2025.push({
        id: `cor-${auditId2025}-1`,
        auditId: auditId2025,
        reason: "Export revenue documentation incomplete",
        problemsIdentified: "Export declarations for EU banking software contracts missing SWIFT currency conversion reconciliation statements.",
        correctiveAction: "Attach official commercial bank confirmation of foreign currency receipt and customs act of acceptance.",
        priority: "HIGH",
        deadline: "2026-07-15",
        returnedBy: reviewer.name,
        returnedAt: "2026-06-18",
        version: 1
      });
      notifications2025.push({
        id: `notif-${auditId2025}-ret1`,
        auditId: auditId2025,
        type: "RETURNED_NOTICE",
        recipient: resident.email || "finance@company.uz",
        subject: "Action Required: Annual Audit 2025 Returned for Correction",
        message: "Your 2025 Audit report was returned for correction regarding missing SWIFT foreign currency reconciliation.",
        channel: "EMAIL",
        sentAt: "2026-06-18",
        deliveryStatus: "DELIVERED",
        relatedAuditStatus: "RETURNED_FOR_CORRECTION"
      });
    } else if (cyclePattern === 4) {
      status2025 = "RESUBMITTED";
      submissionDate2025 = "2026-06-02";
      returnCount2025 = 1;
      corrections2025.push({
        id: `cor-${auditId2025}-1`,
        auditId: auditId2025,
        reason: "Auditor License Certificate expired",
        problemsIdentified: "Audit firm license certificate attached was dated 2023 without renewal appendix.",
        correctiveAction: "Provide current Ministry of Finance audit license certificate for 2025/2026.",
        priority: "MEDIUM",
        deadline: "2026-06-30",
        returnedBy: reviewer.name,
        returnedAt: "2026-06-10",
        resolvedAt: "2026-06-25",
        resolutionNotes: "Resident uploaded renewed audit firm license valid until 2028.",
        version: 1
      });
    } else if (cyclePattern === 5) {
      status2025 = "ESCALATED";
      submissionDate2025 = "2026-05-30";
      returnCount2025 = 2;
      escalations2025.push({
        id: `esc-${auditId2025}-1`,
        auditId: auditId2025,
        level: "Legal/Compliance",
        reason: "Repeated non-compliance with core IT activity verification (over 40% domestic revenue from unapproved retail trade).",
        assignedTo: "Chief Legal Counsel, IT Park Directorate",
        escalatedBy: reviewer.name,
        escalatedAt: "2026-07-02",
        resolutionDeadline: "2026-08-15",
        status: "OPEN"
      });
      notifications2025.push({
        id: `notif-${auditId2025}-esc`,
        auditId: auditId2025,
        type: "ESCALATION_ALERT",
        recipient: "compliance-head@it-park.uz",
        subject: `CRITICAL ESCALATION: ${resident.companyName} Non-Permitted Revenue`,
        message: `Audit review for ${resident.companyName} escalated to Legal department due to unapproved retail trade revenue.`,
        channel: "PORTAL",
        sentAt: "2026-07-02",
        deliveryStatus: "DELIVERED",
        relatedAuditStatus: "ESCALATED"
      });
    } else {
      status2025 = "PENDING_SUBMISSION";
      submissionDate2025 = undefined;
    }

    const docs2025: AuditDocument[] = [];
    if (submissionDate2025) {
      docs2025.push(
        {
          id: `doc-${auditId2025}-1`,
          auditId: auditId2025,
          documentType: "Audit Report",
          fileName: `${resident.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Annual_Audit_2025.pdf`,
          fileSize: "4.8 MB",
          version: status2025 === "RESUBMITTED" ? 2 : 1,
          uploadedBy: resident.director || "Director",
          uploadedAt: submissionDate2025,
          notes: status2025 === "RESUBMITTED" ? "Corrected version with appended currency receipts." : "First submission."
        },
        {
          id: `doc-${auditId2025}-2`,
          auditId: auditId2025,
          documentType: "Auditor's Opinion",
          fileName: `Auditor_Opinion_${firmInfo.firm.slice(0, 10)}_2025.pdf`,
          fileSize: "1.5 MB",
          version: 1,
          uploadedBy: resident.director || "Director",
          uploadedAt: submissionDate2025
        },
        {
          id: `doc-${auditId2025}-3`,
          auditId: auditId2025,
          documentType: "Financial Statements",
          fileName: `Full_Financial_Statements_2025.pdf`,
          fileSize: "3.1 MB",
          version: 1,
          uploadedBy: resident.director || "Director",
          uploadedAt: submissionDate2025
        },
        {
          id: `doc-${auditId2025}-4`,
          auditId: auditId2025,
          documentType: "Export Documentation",
          fileName: `Export_Contracts_Customs_Acts_2025.pdf`,
          fileSize: "6.2 MB",
          version: status2025 === "RESUBMITTED" ? 2 : 1,
          uploadedBy: resident.director || "Director",
          uploadedAt: status2025 === "RESUBMITTED" ? "2026-06-25" : submissionDate2025
        }
      );
    }

    const events2025: AuditEvent[] = [
      {
        id: `ev-${auditId2025}-1`,
        auditId: auditId2025,
        eventType: "CREATED",
        description: `Annual audit cycle 2025 generated. Statutory due date: ${dueDate2025}.`,
        performedBy: "System (Regulatory Automation)",
        createdAt: "2026-01-05"
      }
    ];

    if (submissionDate2025) {
      events2025.push(
        {
          id: `ev-${auditId2025}-2`,
          auditId: auditId2025,
          eventType: "SUBMITTED",
          description: `Annual audit report package submitted by ${resident.director}.`,
          performedBy: resident.director || "Resident Officer",
          createdAt: submissionDate2025
        },
        {
          id: `ev-${auditId2025}-3`,
          auditId: auditId2025,
          eventType: "ASSIGNED",
          description: `Assigned to reviewer ${reviewer.name}.`,
          performedBy: "Department Head",
          createdAt: submissionDate2025
        }
      );
    }

    if (status2025 === "RETURNED_FOR_CORRECTION") {
      events2025.push({
        id: `ev-${auditId2025}-4`,
        auditId: auditId2025,
        eventType: "RETURNED",
        description: `Returned for correction. Reason: Export revenue documentation incomplete.`,
        performedBy: reviewer.name,
        createdAt: "2026-06-18"
      });
    } else if (status2025 === "RESUBMITTED") {
      events2025.push(
        {
          id: `ev-${auditId2025}-4`,
          auditId: auditId2025,
          eventType: "RETURNED",
          description: `Returned for correction: Auditor license renewal required.`,
          performedBy: reviewer.name,
          createdAt: "2026-06-10"
        },
        {
          id: `ev-${auditId2025}-5`,
          auditId: auditId2025,
          eventType: "RESUBMITTED",
          description: `Corrected audit package v2 uploaded with renewed auditor license.`,
          performedBy: resident.director || "Director",
          createdAt: "2026-06-25"
        }
      );
    } else if (status2025 === "APPROVED") {
      events2025.push({
        id: `ev-${auditId2025}-4`,
        auditId: auditId2025,
        eventType: "APPROVED",
        description: `Audit report approved with full compliance certification by ${reviewer.name}.`,
        performedBy: reviewer.name,
        createdAt: "2026-05-20"
      });
    } else if (status2025 === "ESCALATED") {
      events2025.push({
        id: `ev-${auditId2025}-4`,
        auditId: auditId2025,
        eventType: "ESCALATED",
        description: `Escalated to Legal/Compliance: Unapproved revenue activities detected in auditor breakdown.`,
        performedBy: reviewer.name,
        createdAt: "2026-07-02"
      });
    }

    const calculatedRisk2025 = computeRiskLevel(status2025, dueDate2025, returnCount2025, escalations2025.length > 0);

    results.push({
      id: auditId2025,
      residentId: resident.id,
      companyName: resident.companyName,
      stir: stirNumber,
      residentIdCode: `ITP-KASH-${String(rIdx + 1).padStart(4, "0")}`,
      reportingYear: 2025,
      dueDate: dueDate2025,
      submissionDate: submissionDate2025,
      status: status2025,
      riskLevel: calculatedRisk2025,
      assignedReviewerId: reviewer.id,
      assignedReviewerName: reviewer.name,
      auditFirm: submissionDate2025 ? firmInfo.firm : undefined,
      auditorName: submissionDate2025 ? firmInfo.auditor : undefined,
      auditReportNumber: submissionDate2025 ? `AUD-2025-${1000 + rIdx}` : undefined,
      auditDate: submissionDate2025 ? "2026-05-10" : undefined,
      returnCount: returnCount2025,
      finalComment: status2025 === "APPROVED" ? "Audit approved with complete financial and export verification." : undefined,
      approvedBy: status2025 === "APPROVED" ? reviewer.name : undefined,
      approvedAt: status2025 === "APPROVED" ? "2026-05-20" : undefined,
      createdAt: "2026-01-05",
      updatedAt: status2025 === "APPROVED" ? "2026-05-20" : "2026-06-25",
      documents: docs2025,
      checklist: generateDefaultChecklist(auditId2025, status2025),
      corrections: corrections2025,
      events: events2025,
      escalations: escalations2025,
      notifications: notifications2025,
      residentDistrict: resident.district || "Qarshi",
      residentIndustry: resident.industry || "Software Development",
      residentExportVolume: resident.exportVolume,
      residentDomesticVolume: resident.domesticVolume,
      residentDirector: resident.director,
      residentPhone: resident.phone,
      residentEmail: resident.email
    });

    // --- 3. REPORTING YEAR 2026 (Upcoming Cycle - Due 2027-07-01) ---
    const dueDate2026 = computeDefaultDueDate(2026, config);
    const auditId2026 = `aud-${resident.id}-2026`;
    const isEarlyBird = rIdx === 0;

    const events2026: AuditEvent[] = [
      {
        id: `ev-${auditId2026}-1`,
        auditId: auditId2026,
        eventType: "CREATED",
        description: `Audit cycle 2026 initialized. Regulatory submission deadline: ${dueDate2026}.`,
        performedBy: "System (Regulatory Automation)",
        createdAt: "2026-06-01"
      }
    ];

    if (isEarlyBird) {
      events2026.push({
        id: `ev-${auditId2026}-2`,
        auditId: auditId2026,
        eventType: "SUBMITTED",
        description: `Early interim audit report submitted for H1 2026 preview.`,
        performedBy: resident.director || "Director",
        createdAt: "2026-07-10"
      });
    }

    results.push({
      id: auditId2026,
      residentId: resident.id,
      companyName: resident.companyName,
      stir: stirNumber,
      residentIdCode: `ITP-KASH-${String(rIdx + 1).padStart(4, "0")}`,
      reportingYear: 2026,
      dueDate: dueDate2026,
      submissionDate: isEarlyBird ? "2026-07-10" : undefined,
      status: isEarlyBird ? "UNDER_REVIEW" : "PENDING_SUBMISSION",
      riskLevel: "LOW",
      assignedReviewerId: reviewer.id,
      assignedReviewerName: reviewer.name,
      auditFirm: isEarlyBird ? firmInfo.firm : undefined,
      auditorName: isEarlyBird ? firmInfo.auditor : undefined,
      auditReportNumber: isEarlyBird ? `AUD-2026-${1000 + rIdx}` : undefined,
      returnCount: 0,
      createdAt: "2026-06-01",
      updatedAt: isEarlyBird ? "2026-07-10" : "2026-06-01",
      documents: isEarlyBird ? [
        {
          id: `doc-${auditId2026}-1`,
          auditId: auditId2026,
          documentType: "Audit Report",
          fileName: `${resident.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Interim_Audit_2026.pdf`,
          fileSize: "2.8 MB",
          version: 1,
          uploadedBy: resident.director || "Director",
          uploadedAt: "2026-07-10"
        }
      ] : [],
      checklist: generateDefaultChecklist(auditId2026, isEarlyBird ? "UNDER_REVIEW" : "PENDING_SUBMISSION"),
      corrections: [],
      events: events2026,
      escalations: [],
      notifications: [],
      residentDistrict: resident.district || "Qarshi",
      residentIndustry: resident.industry || "Software Development",
      residentExportVolume: resident.exportVolume,
      residentDomesticVolume: resident.domesticVolume,
      residentDirector: resident.director,
      residentPhone: resident.phone,
      residentEmail: resident.email
    });
  });

  return results;
}
