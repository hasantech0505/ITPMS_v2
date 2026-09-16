/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InspectionReport {
  status: "PASSED" | "FAILED" | "PENDING";
  inspectionDate: string;
  inspectorName: string;
  findings: string;
  notes: string;
}

export interface PropertyTimelineItem {
  stage: string;
  date: string;
  user: string;
  description: string;
}

export interface PropertyDocument {
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface PropertyUtilities {
  electricityCost: number;
  waterCost: number;
  internetCost: number;
}

export interface Property {
  id: string;
  name: string;
  type: "Office" | "Business Center" | "Coworking Space" | "Commercial Building" | "Private Office" | "Warehouse" | "Land" | "Technology Park" | "Industrial Facility" | "Retail Space";
  status: "Available for Rent" | "Available for Sale" | "Rent & Sale" | "Reserved" | "Occupied" | "Inactive" | "Pending Verification" | "Rejected";
  city: string; // e.g. Tashkent, Samarkand, Bukhara, Qarshi, Fergana, Khorezm
  district: string;
  address: string;
  monthlyRent?: number;
  purchasePrice?: number;
  areaSqM: number;
  rooms: number;
  parkingSpots: number;
  internetSpeedMbps: number;
  hasAC: boolean;
  hasMeetingRooms: boolean;
  availableDate: string;
  managerName: string;
  managerPhone: string;
  ownerName: string;
  ownerPhone: string;
  verified: boolean;
  coverImage: string;
  images: string[];
  description: string;
  nearbyUniversities: string[];
  nearbyResidents: string[];
  nearbyTransit: string[];
  cadastreNumber: string;
  inspectionReport: InspectionReport;
  pipelineStage: "Found" | "Inspection" | "Documents" | "Verified" | "Published" | "Recommended" | "Reserved" | "Occupied";
  timeline: PropertyTimelineItem[];
  documents: PropertyDocument[];
  utilities: PropertyUtilities;
}
