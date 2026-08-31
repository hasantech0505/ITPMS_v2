/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ERPBuilding {
  id: string;
  name: string;
  code: string;
  address: string;
  region: string;
  district: string;
  coordinates: string;
  constructionYear: number;
  floors: number;
  totalArea: number;
  totalOffices: number;
  capacity: number;
  parkingSpots: number;
  meetingRooms: number;
  status: "ACTIVE" | "UNDER_CONSTRUCTION" | "MAINTENANCE";
  images: string[];
  virtualTourUrl?: string;
  documents: string[];
  floorPlans: string[];
  emergencyContacts: string[];
  managerName: string;
  managerPhone: string;
  cadastreNumber: string;
}

export interface ERPAsset {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  purchaseDate: string;
  warrantyExpiry: string;
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  assignedOfficeId: string;
  assignedOfficeNumber: string;
  assignedUserId?: string;
  assignedUserName?: string;
  purchaseCost: number;
  image?: string;
  maintenanceHistory: string[];
}

export interface ERPMaintenance {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  assignedEngineer: string;
  createdAt: string;
  officeId: string;
  officeNumber: string;
  buildingBlock: string;
  beforePhoto?: string;
  afterPhoto?: string;
  completionReport?: string;
  timeline: Array<{ status: string; date: string; note: string }>;
}

export interface ERPUtility {
  id: string;
  buildingBlock: string;
  month: string;
  electricity: { kwh: number; cost: number };
  water: { m3: number; cost: number };
  internet: { mbps: number; cost: number };
  heating: { gcal: number; cost: number };
}

export interface ERPReservation {
  id: string;
  roomName: string;
  buildingBlock: string;
  floor: number;
  reservedBy: string;
  residentName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  recurring: boolean;
}

export interface ERPInspection {
  id: string;
  buildingBlock: string;
  type: "FIRE_SAFETY" | "BUILDING_INTEGRITY" | "INFRASTRUCTURE" | "SANITAIRY";
  inspectionDate: string;
  inspectorName: string;
  inspectorAgency: string;
  status: "PASSED" | "PASSED_WITH_CONDITIONS" | "FAILED" | "PENDING";
  findings: string;
  recommendations: string;
  certificateUrl: string;
  documents: string[];
}

export interface ERPContract {
  id: string;
  contractNumber: string;
  tenantId: string;
  tenantName: string;
  officeId: string;
  officeNumber: string;
  buildingBlock: string;
  contractType: "LEASE" | "UTILITIES_SERVICE" | "COWORKING";
  startDate: string;
  endDate: string;
  monthlyRentUSD: number;
  status: "ACTIVE" | "PENDING_SIGNATURE" | "EXPIRED" | "TERMINATED";
  documentUrl: string;
  digitalSignature?: string;
  signedAt?: string;
  payments: Array<{ date: string; amount: number; invoiceNo: string; status: "PAID" | "PENDING" }>;
}
