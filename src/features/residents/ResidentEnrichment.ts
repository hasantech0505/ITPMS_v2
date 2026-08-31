/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Resident, ResidentStatus, ResidentMonitoringVisit, ResidentQuarterlyReport } from "../../types";
import { deriveDistrictFromAddress } from "../../utils/districtFromAddress";

export const localSeedResidents: Resident[] = [
  {
    id: "res-pot-1",
    companyName: "UzPay Technologies LLC",
    director: "Olim Shokirov",
    registrationNumber: "302987123",
    legalAddress: "Tashkent, Yunusabad, block 4",
    employeesCount: 15,
    exportVolume: 120000,
    domesticVolume: 450000,
    status: ResidentStatus.POTENTIAL,
    benefitsApplied: [],
    appliedAt: "2026-06-01",
    notes: ["Highly interested in zero income tax regime.", "Scheduled meeting to audit product architecture."],
    documents: [],
    potentialStage: "Meeting Scheduled",
    potentialFounder: "Olim Shokirov",
    potentialSource: "Inbound Marketing",
    potentialProbability: 60,
    potentialOwner: "Dilnoza Alimova",
    potentialNextFollowUp: "2026-07-18",
  },
  {
    id: "res-pot-2",
    companyName: "Samarkand AI Hub",
    director: "Karim Umarov",
    registrationNumber: "305112344",
    legalAddress: "Samarkand, Dahbed Street 12",
    employeesCount: 8,
    exportVolume: 45000,
    domesticVolume: 15000,
    status: ResidentStatus.POTENTIAL,
    benefitsApplied: [],
    appliedAt: "2026-05-10",
    notes: ["Developing voice AI models for call centers.", "Currently collecting standard licensing documentation."],
    documents: [],
    potentialStage: "Document Collection",
    potentialFounder: "Karim Umarov",
    potentialSource: "Referral",
    potentialProbability: 80,
    potentialOwner: "Sarvar Mukhammadiev",
    potentialNextFollowUp: "2026-07-22",
  },
  {
    id: "res-pot-3",
    companyName: "Tashkent Game Studios",
    director: "Javohir Meliboev",
    registrationNumber: "308223998",
    legalAddress: "Tashkent, Mirzo Ulugbek District",
    employeesCount: 4,
    exportVolume: 18000,
    domesticVolume: 5000,
    status: ResidentStatus.POTENTIAL,
    benefitsApplied: [],
    appliedAt: "2026-06-15",
    notes: ["Independent studio launching games on Steam.", "First introductory call finished."],
    documents: [],
    potentialStage: "New Lead",
    potentialFounder: "Javohir Meliboev",
    potentialSource: "Steam Spy Scraping",
    potentialProbability: 30,
    potentialOwner: "Hasan Abdukarimov",
    potentialNextFollowUp: "2026-07-25",
  },
  {
    id: "res-rem-1",
    companyName: "GigaCode LLC",
    director: "Timur Kasimov",
    registrationNumber: "306456789",
    legalAddress: "Bukhara, M. Iqbol Street",
    employeesCount: 12,
    exportVolume: 5000,
    domesticVolume: 240000,
    status: ResidentStatus.REMOVED,
    benefitsApplied: ["0% Corporate Income Tax"],
    appliedAt: "2023-01-10",
    approvedAt: "2023-02-01",
    removedDate: "2026-01-15",
    removedReason: "Failure to meet mandatory IT Export Quota (Export was < $20K/yr)",
    removedDebt: 4500,
    removedInspection: "Official Audit visit identified 95% domestic revenue with no real export products.",
    removedAppeal: "Awaiting legal committee decision on custom tariff retro-payments.",
    removedCourt: "None",
    removedCanReapply: true,
    notes: ["Removed during Q4 2025 systemic inspection campaign."],
    documents: ["revocation_decree_345.pdf"]
  }
];

export const ensureResidentEnrichment = (r: Resident): Resident => {
  const defaultBenefits = r.benefitsApplied && r.benefitsApplied.length > 0
    ? r.benefitsApplied 
    : ["0% Corporate Income Tax", "7.5% Personal Income Tax", "0% Customs Duty"];

  const docFiles = r.docFiles || [
    { id: `doc-${r.id}-1`, name: "resident_permit_2020.pdf", type: "PDF", uploadedAt: r.appliedAt || "2025-06-01" },
    { id: `doc-${r.id}-2`, name: "tax_registration_inn.pdf", type: "PDF", uploadedAt: r.appliedAt || "2025-06-01" }
  ];

  const quarterlyReports = r.quarterlyReports || [
    { quarter: "Q1", year: 2026, status: r.status === "ACTIVE" ? "APPROVED" : "NOT_SUBMITTED", deadline: "2026-04-15", submittedDate: r.status === "ACTIVE" ? "2026-04-10" : undefined, reviewer: "Dilnoza Alimova" },
    { quarter: "Q4", year: 2025, status: r.status === "ACTIVE" ? "APPROVED" : "NOT_SUBMITTED", deadline: "2026-01-15", submittedDate: r.status === "ACTIVE" ? "2026-01-12" : undefined, reviewer: "Sarvar Mukhammadiev" },
    { quarter: "Q3", year: 2025, status: r.status === "ACTIVE" ? "APPROVED" : "NOT_SUBMITTED", deadline: "2025-10-15", submittedDate: r.status === "ACTIVE" ? "2025-10-14" : undefined, reviewer: "Dilnoza Alimova" },
    { quarter: "Q2", year: 2025, status: r.status === "ACTIVE" ? "APPROVED" : "NOT_SUBMITTED", deadline: "2025-07-15", submittedDate: r.status === "ACTIVE" ? "2025-07-18" : undefined, reviewer: "Hasan Abdukarimov", lateIndicator: true }
  ];

  const monitoringHistory = r.monitoringHistory || (
    r.status === "ACTIVE" ? [
      { id: `mon-${r.id}-1`, visitDate: "2026-03-10", officer: "Dilnoza Alimova", problems: "None. Perfect export indicators.", priority: "LOW" as const, recommendations: "Keep up the excellent export growth.", photos: [], status: "RESOLVED" as const, followUpDate: "2026-09-10" },
      { id: `mon-${r.id}-2`, visitDate: "2025-09-15", officer: "Hasan Abdukarimov", problems: "Slight delays in property allocation setup.", priority: "MEDIUM" as const, recommendations: "Coordinated with property team.", photos: [], status: "RESOLVED" as const, followUpDate: "2026-03-15" }
    ] : []
  );

  const meetings = r.meetings || [
    { id: `meet-${r.id}-1`, title: "Annual Resident Review", dateTime: "2026-03-05T14:00", notes: "Reviewed export milestones. Epam committed to training 1,000 extra students.", status: "COMPLETED" as const },
    { id: `meet-${r.id}-2`, title: "Compliance Check-in", dateTime: "2026-06-15T10:00", notes: "Regular audit preparation check.", status: "SCHEDULED" as const }
  ];

  const tasks = r.tasks || [
    { id: `task-${r.id}-1`, title: "Submit Q2 Export Declarations", assignedTo: r.assignedManager || "Dilnoza Alimova", dueDate: "2026-07-15", priority: "HIGH" as const, status: "TODO" as const },
    { id: `task-${r.id}-2`, title: "Update INN Legal Record Address", assignedTo: "Director", dueDate: "2026-05-30", priority: "MEDIUM" as const, status: "DONE" as const }
  ];

  const historyLogs = r.historyLogs || [
    { id: `hist-${r.id}-1`, action: "Status updated to ACTIVE", userId: "u-1", userName: "Hasan Abdukarimov", timestamp: r.approvedAt || r.appliedAt || "2025-06-01" },
    { id: `hist-${r.id}-2`, action: "Resident License Certified", userId: "u-1", userName: "Hasan Abdukarimov", timestamp: r.appliedAt || "2025-06-01" }
  ];

  let email = r.email || "info@itcompany.uz";
  let phone = r.phone || "+998 75 123 4567";
  let website = r.website || "https://itcompany.uz";
  let industry = r.industry || "Software Development";
  let district = r.district || deriveDistrictFromAddress(r.legalAddress) || "Qarshi";
  let assignedManager = r.assignedManager || "Dilnoza Alimova";

  if (r.id === "res-1") {
    email = "qarshi@epam.com";
    phone = "+998 75 200 4545";
    website = "https://epam.com";
    industry = "Software Development";
    district = "Qarshi";
    assignedManager = "Dilnoza Alimova";
  } else if (r.id === "res-2") {
    email = "info@exadel.uz";
    phone = "+998 75 200 9090";
    website = "https://exadel.com";
    industry = "FinTech";
    district = "Shahrisabz";
    assignedManager = "Hasan Abdukarimov";
  } else if (r.id === "res-3") {
    email = "contact@onesoft.uz";
    phone = "+998 90 321 0987";
    website = "https://onesoft.uz";
    industry = "BPO & IT Services";
    district = "Koson";
    assignedManager = "Sarvar Mukhammadiev";
  } else if (r.id === "res-4") {
    email = "sardor@turansystems.uz";
    phone = "+998 93 456 7890";
    website = "https://turansystems.uz";
    industry = "EdTech";
    district = "Kitob";
    assignedManager = "Dilnoza Alimova";
  }

  const potentialStage = r.potentialStage || (
    r.status === "POTENTIAL" 
      ? (r.id === "res-pot-1" ? "Meeting Scheduled" : r.id === "res-pot-2" ? "Document Collection" : "New Lead")
      : undefined
  );
  const potentialFounder = r.potentialFounder || (r.status === "POTENTIAL" ? "Sardor Ahmedov" : undefined);
  const potentialSource = r.potentialSource || "IT Park Outreach";
  const potentialProbability = r.potentialProbability || (r.id === "res-pot-1" ? 60 : r.id === "res-pot-2" ? 80 : 30);
  const potentialOwner = r.potentialOwner || assignedManager;
  const potentialNextFollowUp = r.potentialNextFollowUp || "2026-07-20";

  const upcomingStage = r.upcomingStage || (
    r.status === "PENDING" ? "Document Review" : undefined
  );

  return {
    ...r,
    email,
    phone,
    website,
    industry,
    district,
    assignedManager,
    benefitsApplied: defaultBenefits,
    docFiles,
    quarterlyReports,
    monitoringHistory,
    meetings,
    tasks,
    historyLogs,
    potentialStage,
    potentialFounder,
    potentialSource,
    potentialProbability,
    potentialOwner,
    potentialNextFollowUp,
    upcomingStage,
    photos: r.photos || [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&fit=crop"
    ]
  };
};
