/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Kashkadarya Region Districts (15 official administrative units, incl. Koʻkdala est. 2022)
export const KASHKADARYA_DISTRICTS = [
  "Qarshi",
  "Shahrisabz",
  "Chiroqchi",
  "Dehqonobod",
  "Gʻuzor",
  "Kasbi",
  "Kitob",
  "Koson",
  "Koʻkdala", // established 2022 (Presidential Decree PF-142), split out from neighboring districts
  "Mirishkor",
  "Muborak",
  "Nishon",
  "Qamashi",
  "Qarshi District",
  "Yakkabogʻ"
] as const;

export type KashkadaryaDistrict = typeof KASHKADARYA_DISTRICTS[number];

// User & Role-Based Access Control (RBAC) Types
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  MANAGER = "MANAGER"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  active: boolean;
}

// Startup Module Types
export enum StartupStage {
  IDEATION = "IDEATION",
  MVP = "MVP",
  EARLY_TRACTION = "EARLY_TRACTION",
  GROWTH = "GROWTH",
  SCALE = "SCALE"
}

export type StartupLifecycleStage = 
  | "IDEA"
  | "PRE_MVP"
  | "MVP"
  | "EARLY_REVENUE"
  | "GROWTH"
  | "SCALE"
  | "GRADUATED";

export type StartupHealthStatus = "HEALTHY" | "NEEDS_ATTENTION" | "AT_RISK" | "NO_DATA";

export enum StartupStatus {
  APPLICANT = "APPLICANT",
  ACCELERATING = "ACCELERATING",
  GRADUATED = "GRADUATED",
  REJECTED = "REJECTED",
  INACTIVE = "INACTIVE"
}

export interface StartupMilestone {
  id: string;
  title: string;
  targetDate?: string;
  completionDate?: string;
  completed: boolean;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "DELAYED";
  owner?: string;
  notes?: string;
}

export interface StartupSupportLog {
  id: string;
  date: string;
  supportType: 
    | "Mentorship"
    | "Investor introduction"
    | "Talent matching"
    | "Export support"
    | "International partner"
    | "Grant"
    | "Marketing"
    | "Legal"
    | "Product support"
    | "Workspace"
    | "Government support"
    | "Training"
    | "Other";
  description: string;
  result?: string;
  nextStep?: string;
  officer?: string;
}

export interface StartupSupportNeed {
  category: 
    | "Funding"
    | "Investor"
    | "Mentor"
    | "Talent"
    | "Customer"
    | "Export partner"
    | "International partner"
    | "Legal"
    | "Marketing"
    | "Product"
    | "Office"
    | "Government support";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  details?: string;
}

export interface StartupTalentNeed {
  id: string;
  role: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  department: "Developers" | "Product" | "Sales" | "Marketing" | "Operations" | "Other";
  count: number;
  skillsNeeded?: string[];
  status?: "OPEN" | "MATCHED" | "CLOSED";
}

export interface StartupAchievement {
  id: string;
  date: string;
  title: string;
  category: "Award" | "Funding" | "Partnership" | "International" | "Customer" | "Revenue" | "Launch" | "Competition";
  description?: string;
}

export interface StartupNextAction {
  action: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  assignedTo?: string;
}

export interface StartupHistoricalYear {
  year: number;
  employees: number;
  revenue: number;
  exportRevenue?: number;
  jobsCreated?: number;
}

export interface StartupTargets {
  exportTarget?: number;
  employeeTarget?: number;
  newJobsTarget?: number;
  targetYear?: number;
}

export interface Startup {
  id: string;
  name: string;
  founder: string;
  email: string;
  phone: string;
  stage: StartupStage | StartupLifecycleStage | string;
  status: StartupStatus | string;
  industry: string;
  district?: KashkadaryaDistrict | string;
  businessModel?: string; // "B2B SaaS", "Marketplace", "B2G", "B2C", "AI / DeepTech", etc.
  foundedYear?: number;
  website?: string;
  logo?: string;
  employees: number;
  jobsCreated?: number;
  revenue: number; // in USD
  mrr?: number;
  arr?: number;
  revenueGrowthPct?: number;
  payingCustomers?: number;
  totalCustomers?: number;
  customerGrowthPct?: number;
  activeUsers?: number;
  fundingRaised: number; // in USD
  fundingStatus?: "Bootstrapped" | "Seeking Funding" | "Pre-Seed" | "Seed" | "Series A" | "Funded";
  joinedAt: string;
  program?: string; // "Startup Garage", "Incubation", "Acceleration", "Hackathon", "Local2Global", "Mentorship", "Grant", "Investor Program"
  cohort?: string; // "2024 Cohort", "2025 Cohort", "2026 Cohort"
  description: string;
  notes: string[];
  documents: string[];
  
  // Health
  healthStatus?: StartupHealthStatus;
  healthScore?: number; // 0-100
  healthReason?: string;
  
  // Investment Readiness
  investmentReadinessScore?: number; // 0-100
  investmentReadinessStatus?: "Not Ready" | "Early Stage" | "Investor Ready" | "High Potential";
  investmentMainGap?: string;
  investmentRecommendedAction?: string;
  
  // Export / International
  exportRevenue?: number;
  exportReadiness?: "NOT READY" | "PREPARING" | "MARKET ENTRY" | "EXPORTING" | "SCALING";
  exportReadinessScore?: number;
  currentMarkets?: string[];
  targetMarkets?: string[];
  internationalCustomers?: number;
  
  // Team & Talent
  teamBreakdown?: {
    developers?: number;
    product?: number;
    sales?: number;
    marketing?: number;
    operations?: number;
    other?: number;
  };
  talentNeeds?: StartupTalentNeed[];
  
  // Milestones
  milestones?: StartupMilestone[];
  
  // IT Park Support CRM
  supportHistory?: StartupSupportLog[];
  supportRequired?: StartupSupportNeed[];
  
  // Next Best Action
  nextAction?: StartupNextAction;
  
  // Activity Timeline
  activityTimeline?: Array<{
    date: string;
    title: string;
    description?: string;
    type?: string;
  }>;
  
  // Achievements
  achievements?: StartupAchievement[];
  
  // Growth Story & Traditional Profile Info
  director?: string;
  services?: string[];
  bank?: string;
  historicalPerformance?: StartupHistoricalYear[];
  targets?: StartupTargets;
  growthStory?: string;

  kpis?: {
    mrr: number;
    churnRate: number;
    activeUsers: number;
  };
}

// Resident Module Types (Official Registered IT Companies in Uzbekistan with Tax/Custom benefits)
export enum ResidentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REVOKED = "REVOKED",
  POTENTIAL = "POTENTIAL",
  REMOVED = "REMOVED"
}

export interface ResidentMonitoringVisit {
  id: string;
  visitDate: string;
  officer: string;
  problems: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  recommendations: string;
  photos: string[];
  status: "PENDING" | "RESOLVED" | "CRITICAL";
  followUpDate: string;
}

export interface ResidentQuarterlyReport {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "LATE";
  submittedDate?: string;
  deadline: string;
  reviewer?: string;
  comments?: string;
  lateIndicator?: boolean;
  reportedExportVolume?: number;
  reportedDomesticVolume?: number;
  reportedEmployeesCount?: number;
  taxesSaved?: number;
  exportCountries?: string[];
  documentUrl?: string;
  productsExported?: string;
}

export interface ResidentDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url?: string;
}

export interface ResidentMeeting {
  id: string;
  title: string;
  dateTime: string;
  notes: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface ResidentTask {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

export interface ResidentHistoryLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface Resident {
  id: string;
  companyName: string;
  director: string;
  registrationNumber: string; // INN
  legalAddress: string;
  employeesCount: number;
  exportVolume: number; // in USD (crucial metric for IT Park)
  domesticVolume: number; // in USD
  status: ResidentStatus;
  benefitsApplied: string[]; // e.g. "0% Income Tax", "0% Customs Duty", "0% Social Tax"
  appliedAt: string;
  approvedAt?: string;
  notes: string[];
  documents: string[];
  
  // Custom PM/CRM Fields
  email?: string;
  phone?: string;
  website?: string;
  telegram?: string;
  linkedIn?: string;
  district?: string;
  industry?: string;
  activityType?: string;
  assignedManager?: string;
  
  // CRM Pipeline Stage (For Potential Residents)
  potentialStage?: "New Lead" | "Contacted" | "Meeting Scheduled" | "Interested" | "Document Collection" | "Application Submitted" | "Upcoming Resident";
  potentialFounder?: string;
  potentialSource?: string;
  potentialProbability?: number; // 0-100
  potentialOwner?: string;
  potentialNextFollowUp?: string;
  potentialNotes?: string;
  potentialTimeline?: Array<{ date: string; action: string; notes?: string }>;
  
  // Application Workflow (For Upcoming Residents)
  upcomingStage?: "Application Submitted" | "Document Review" | "Inspection" | "Agreement" | "Approved" | "Resident";
  upcomingDetails?: {
    reviewNotes?: string;
    inspectionDate?: string;
    agreementSigned?: boolean;
    approvedBy?: string;
  };
  
  // Removed Resident History
  removedDate?: string;
  removedReason?: string;
  removedDebt?: number;
  removedInspection?: string;
  removedAppeal?: string;
  removedCourt?: string;
  removedCanReapply?: boolean;
  
  // Monitoring history visits
  monitoringHistory?: ResidentMonitoringVisit[];
  
  // Quarterly Reports
  quarterlyReports?: ResidentQuarterlyReport[];
  
  // Profile Sub-tabs entities
  docFiles?: ResidentDocument[];
  meetings?: ResidentMeeting[];
  tasks?: ResidentTask[];
  historyLogs?: ResidentHistoryLog[];
  photos?: string[];
}

// Infrastructure Module Types
export enum BuildingBlock {
  BLOCK_A = "BLOCK_A",
  BLOCK_B = "BLOCK_B",
  BLOCK_C = "BLOCK_C",
  BLOCK_D = "BLOCK_D",
  BLOCK_HQ = "BLOCK_HQ"
}

export enum OfficeStatus {
  VACANT = "VACANT",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE"
}

export interface Office {
  id: string;
  roomNumber: string;
  building: BuildingBlock;
  floor: number;
  areaSqM: number;
  monthlyRent: number; // USD
  status: OfficeStatus;
  currentTenantId?: string; // Startup or Resident ID
  currentTenantName?: string;
  leaseStart?: string;
  leaseEnd?: string;
}

export interface Building {
  block: BuildingBlock;
  name: string;
  address: string;
  floors: number;
  totalRooms: number;
}

// Buildings Infrastructure module (backed by the "buildings" database table --
// distinct from the legacy `Building` shape above, which nothing in the app
// currently uses).
export enum BuildingStatus {
  ACTIVE = "ACTIVE",
  UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
  MAINTENANCE = "MAINTENANCE",
  PLANNED = "PLANNED",
}

export interface BuildingRecord {
  id: string;
  name: string;
  code?: string;
  address?: string;
  region?: string;
  district?: string;
  coordinates?: string;
  constructionYear?: number;
  floors?: number;
  totalArea?: number;
  totalOffices?: number;
  capacity?: number;
  parkingSpots?: number;
  meetingRooms?: number;
  status?: BuildingStatus;
  images?: string[];
  virtualTourUrl?: string;
  documents?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Talent Pool Types
export enum TalentStatus {
  STUDENT = "STUDENT",
  GRADUATE = "GRADUATE",
  CANDIDATE = "CANDIDATE",
  EMPLOYED = "EMPLOYED"
}

// A CEFR-style proficiency rating, used both for the assessed English score
// (Talent.englishLevel) and for any additional languages a candidate lists
// (Talent.languages) - a candidate is rarely monolingual, so English alone
// doesn't capture the full picture.
export type LanguageProficiencyLevel = "None" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface LanguageProficiency {
  language: string; // free text - e.g. "Russian", "Uzbek", "Korean", "Turkish"
  level: LanguageProficiencyLevel;
}

export interface Talent {
  id: string;
  fullName: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: string[];
  status: TalentStatus;
  phone: string;
  email: string;
  englishLevel: LanguageProficiencyLevel;
  gitHubUrl?: string;
  cvUrl?: string; // Link to the candidate's CV/resume (e.g. a OneDrive-hosted Word doc), not an uploaded file
  languages?: LanguageProficiency[]; // Any languages besides English (English itself is tracked via englishLevel/testScores.english)
  certifications: string[];
  testScores: {
    coding: number; // 0-100
    english: number; // 0-100
    softSkills: number; // 0-100
  };
}

// Events Module Types
export enum EventType {
  HACKATHON = "HACKATHON",
  MEETUP = "MEETUP",
  ACCELERATION_DEMO = "ACCELERATION_DEMO",
  CONFERENCE = "CONFERENCE",
  WORKSHOP = "WORKSHOP"
}

export interface Event {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  year: number;
  month: number;
  quarter: number;
  region: string;
  district: string;
  venue: string;
  organizer: string;
  partners: string | null;
  participantCount: number;
  startupCount: number;
  reportUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// CRM, Contacts & Meetings
export type CompanyLeadSource =
  | "LinkedIn"
  | "Referral - Resident"
  | "Referral - Partner"
  | "Event / Forum"
  | "Consulting Firm"
  | "Inbound"
  | "Other";

export type CompanyEmployeeBand = "1-10" | "11-50" | "51-250" | "251-1000" | "1000+";

export const CRM_BENEFITS_PITCHED_OPTIONS = [
  "Multilingual Talent Pool",
  "Government Incentives",
  "Fast Company Registration",
  "Modern Infrastructure",
  "Political & Economic Stability"
] as const;

export interface Company {
  id: string;
  name: string;
  country: string;
  industry: string;
  website: string;
  leadScore: number; // 1-100
  status: "LEAD" | "CONTACTED" | "NEGOTIATION" | "PARTNER" | "INACTIVE";
  leadSource?: CompanyLeadSource;
  segment?: string; // e.g. "Tech Startup", "BPO Provider", "Fintech"
  employeeCountBand?: CompanyEmployeeBand;
  nextFollowUpDate?: string; // ISO date - drives the "no lead falls through the cracks" alert
  lastContactedDate?: string; // ISO date
  isSuccessStory?: boolean; // true once this PARTNER has a usable case study/testimonial on file
  successStoryText?: string;
  benefitsPitched?: string[]; // subset of CRM_BENEFITS_PITCHED_OPTIONS already discussed with this lead
  competingOptions?: string; // free text: other locations/parks this lead is comparing against
}

export interface OutreachCampaign {
  id: string;
  name: string;
  segment: string; // the ICP/segment this sprint targets
  startDate: string; // ISO date
  endDate: string; // ISO date
  companyIds: string[];
  notes?: string;
}

export interface Contact {
  id: string;
  companyId: string;
  companyName: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  linkedInUrl?: string;
  notes: string;
}

export interface Meeting {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  attendees: string[];
  dateTime: string;
  notes: string;
  summary?: string; // AI Summary placeholder
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

// System Logs & Activity Logs
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "Approved Resident Registration"
  entity: string; // e.g. "Resident"
  entityId: string;
  timestamp: string;
}

// --- STRATEGIC PLANNING & ROADMAP MODULE TYPES ---
// Backs the in-app Planning module (project-wide roadmap of next steps),
// stored as its own "planningItems" collection via the generic entity API.
export type PlanningStatus = "DONE" | "IN_PROGRESS" | "TOGETHER" | "OPTIONAL" | "BLOCKED";

export interface PlanningItem {
  id: string;
  title: string;
  description: string;
  status: PlanningStatus;
  owner: string;
  targetDate: string; // ISO date (YYYY-MM-DD)
  module: string; // which ITPMS module/area this plan item belongs to
  createdAt: string;
  updatedAt?: string;
}

// --- ENTERPRISE AI COPILOT PLATFORM TYPES ---

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  userId: string;
}

export interface AIMessage {
  id: string;
  conversationId: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  references?: Array<{ title: string; link?: string; source: string }>;
  suggestedQuestions?: string[];
  feedbackRating?: number; // 1-5 or -1/1 (thumb up/down)
  feedbackComment?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: "General" | "Startups" | "Residents" | "CRM" | "Infrastructure" | "Talent" | "Reports";
  description: string;
}

export interface KnowledgeBaseDoc {
  id: string;
  title: string;
  category: "Regulations" | "SOP" | "FAQ" | "Policies" | "Templates";
  content: string;
  lastUpdated: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "warning" | "opportunity" | "info" | "action";
  targetEntity?: string;
  targetId?: string;
  createdAt: string;
  dismissed: boolean;
  score?: number; // Confidence score
}

export interface AITask {
  id: string;
  title: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  triggerType: "SCHEDULED" | "MANUAL" | "EVENT";
  logs: string[];
  actionPerformed: string;
  createdAt: string;
}

export interface AISettings {
  model: string;
  temperature: number;
  systemInstruction: string;
  ragEnabled: boolean;
}

// Project Comments & Stakeholder Collaboration Module Types
export type CommentCategory = 
  | "general" 
  | "startups" 
  | "residents" 
  | "infrastructure" 
  | "talent" 
  | "events" 
  | "crm" 
  | "ideas" 
  | "governance";

export type CommentStatus = "OPEN" | "UNDER_REVIEW" | "PLANNED" | "RESOLVED" | "IMPLEMENTED";
export type CommentPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "ROUTINE";

export interface CommentReply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole | string;
  authorAvatar?: string;
  authorDepartment?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isOfficial?: boolean;
  reactions: Record<string, string[]>;
}

export interface ProjectComment {
  id: string;
  title?: string;
  content: string;
  category: CommentCategory;
  targetEntity?: "startup" | "resident" | "office" | "talent" | "event" | "project" | "general";
  targetEntityId?: string;
  targetEntityName?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole | string;
  authorAvatar?: string;
  authorDepartment?: string;
  authorEmail?: string;
  status: CommentStatus;
  priority: CommentPriority;
  tags: string[];
  boostCount: number;
  boostedBy: string[];
  reactions: Record<string, string[]>;
  isPinned?: boolean;
  isOfficialResponse?: boolean;
  officialReplyText?: string;
  officialReplyAuthor?: string;
  officialReplyDate?: string;
  replies: CommentReply[];
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}


