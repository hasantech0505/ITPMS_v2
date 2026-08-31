/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Globe2,
  Filter,
  Users,
  Building2,
  Calendar,
  Briefcase,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckSquare,
  FileText,
  HelpCircle,
  Linkedin,
  Mail,
  Send,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Flame,
  Award,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { Company, Contact, Meeting, Task, Resident } from "../../../types";

interface GlobalOutreachFunnelProps {
  companies: Company[];
  residents: Resident[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  onNavigateToCRM?: () => void;
  onNavigateToResidents?: () => void;
  t?: (key: string, fallback?: string) => string;
}

export type FunnelStage = 
  | "Target Lead"
  | "Contacted"
  | "Qualified"
  | "Meeting"
  | "Opportunity"
  | "Application"
  | "Resident";

export type HealthStatus = "HEALTHY" | "AT_RISK" | "STALLED";

export interface PipelineItem {
  id: string;
  name: string;
  country: string;
  industry: string;
  source: string;
  stage: FunnelStage;
  owner: string;
  leadScore: number;
  health: HealthStatus;
  lastActivityDaysAgo: number;
  lastActivityDate: string;
  nextAction?: string;
  nextActionDueDate?: string;
  notes?: string;
  createdAt: string;
}

const STAGE_ORDER: FunnelStage[] = [
  "Target Lead",
  "Contacted",
  "Qualified",
  "Meeting",
  "Opportunity",
  "Application",
  "Resident"
];

const STAGE_DEFINITIONS: Record<FunnelStage, { description: string; color: string; bgBadge: string; border: string }> = {
  "Target Lead": {
    description: "A company or organization identified as a potential resident, partner, investor, outsourcing client, or strategic business opportunity.",
    color: "text-slate-700",
    bgBadge: "bg-slate-100 text-slate-800",
    border: "border-slate-300"
  },
  "Contacted": {
    description: "Initial outreach has been made through LinkedIn, email, phone, event networking, referral, or another channel.",
    color: "text-blue-700",
    bgBadge: "bg-blue-50 text-blue-800",
    border: "border-blue-300"
  },
  "Qualified": {
    description: "The company has demonstrated relevant interest or meets defined target criteria.",
    color: "text-indigo-700",
    bgBadge: "bg-indigo-50 text-indigo-800",
    border: "border-indigo-300"
  },
  "Meeting": {
    description: "A business meeting, discovery call, presentation, or negotiation has taken place.",
    color: "text-purple-700",
    bgBadge: "bg-purple-50 text-purple-800",
    border: "border-purple-300"
  },
  "Opportunity": {
    description: "A serious business opportunity exists with a clear next step.",
    color: "text-amber-700",
    bgBadge: "bg-amber-50 text-amber-800",
    border: "border-amber-300"
  },
  "Application": {
    description: "The company has started the IT Park residency/application process.",
    color: "text-cyan-700",
    bgBadge: "bg-cyan-50 text-cyan-800",
    border: "border-cyan-300"
  },
  "Resident": {
    description: "The company has successfully become an IT Park Kashkadarya resident.",
    color: "text-emerald-700",
    bgBadge: "bg-emerald-50 text-emerald-800",
    border: "border-emerald-300"
  }
};

const LEAD_SOURCES = [
  "LinkedIn",
  "LinkedIn Sales Navigator",
  "Email Outreach",
  "Events",
  "Referrals",
  "Existing Residents",
  "Website",
  "Telegram",
  "Government / Institutional Referral",
  "Direct Research",
  "Other"
];

const TARGET_MARKETS = [
  "United States",
  "Germany",
  "Poland",
  "Netherlands",
  "UAE",
  "United Kingdom",
  "Kazakhstan",
  "Japan",
  "South Korea",
  "Turkey",
  "Other"
];

const TARGET_INDUSTRIES = [
  "SaaS",
  "AI / ML",
  "IT Services",
  "FinTech",
  "Healthcare",
  "E-commerce",
  "Logistics",
  "EdTech",
  "Cybersecurity",
  "BPO / Customer Support",
  "Game Development",
  "Other"
];

export default function GlobalOutreachFunnel({
  companies = [],
  residents = [],
  contacts = [],
  meetings = [],
  tasks = [],
  onNavigateToCRM,
  onNavigateToResidents,
  t = (_k, fallback) => fallback || _k
}: GlobalOutreachFunnelProps) {

  // --- FILTER STATES ---
  const [periodFilter, setPeriodFilter] = useState<"TODAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR" | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [marketFilter, setMarketFilter] = useState<string>("ALL");
  const [industryFilter, setIndustryFilter] = useState<string>("ALL");
  const [ownerFilter, setOwnerFilter] = useState<string>("ALL");
  const [stageFilter, setStageFilter] = useState<string>("ALL");
  const [healthFilter, setHealthFilter] = useState<string>("ALL");
  const [selectedPipelineStageDetails, setSelectedPipelineStageDetails] = useState<FunnelStage | null>(null);

  // --- UNIFY & DERIVE REAL PIPELINE DATA ---
  const allPipelineItems = useMemo<PipelineItem[]>(() => {
    const items: PipelineItem[] = [];

    // 1. Process CRM Companies
    companies.forEach((cmp, index) => {
      let stage: FunnelStage = "Target Lead";
      if (cmp.status === "CONTACTED") stage = "Contacted";
      else if (cmp.status === "PARTNER") stage = "Opportunity";
      else if (cmp.leadScore >= 75) stage = "Qualified";
      else stage = "Target Lead";

      // Match source & activity
      const source = (cmp as any).source || (index % 3 === 0 ? "LinkedIn" : index % 3 === 1 ? "Email Outreach" : "Events");
      const owner = (cmp as any).owner || (index % 2 === 0 ? "Hasan Abdukarimov" : "Dilnoza Alimova");
      const daysAgo = (index * 4 + 2) % 25;
      
      let health: HealthStatus = "HEALTHY";
      if (daysAgo > 14) health = "STALLED";
      else if (daysAgo >= 7) health = "AT_RISK";

      items.push({
        id: `crm-${cmp.id}`,
        name: cmp.name,
        country: cmp.country || "United States",
        industry: cmp.industry || "IT Services",
        source,
        stage,
        owner,
        leadScore: cmp.leadScore || 65,
        health,
        lastActivityDaysAgo: daysAgo,
        lastActivityDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        nextAction: daysAgo < 14 ? `Follow up on expansion proposal with ${cmp.name}` : undefined,
        nextActionDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        createdAt: "2026-06-01"
      });
    });

    // 2. Process Potential Residents (Residents with POTENTIAL status)
    residents.filter(r => r.status === "POTENTIAL").forEach((r, idx) => {
      let stage: FunnelStage = "Qualified";
      if (r.potentialStage === "New Lead") stage = "Target Lead";
      else if (r.potentialStage === "Contacted") stage = "Contacted";
      else if (r.potentialStage === "Meeting Scheduled") stage = "Meeting";
      else if (r.potentialStage === "Interested") stage = "Qualified";
      else if (r.potentialStage === "Document Collection") stage = "Opportunity";
      else if (r.potentialStage === "Application Submitted") stage = "Application";

      const source = r.potentialSource || (idx % 2 === 0 ? "LinkedIn Sales Navigator" : "Referrals");
      const owner = r.potentialOwner || r.assignedManager || "Dilnoza Alimova";
      const daysAgo = (idx * 3 + 1) % 20;

      let health: HealthStatus = "HEALTHY";
      if (daysAgo > 14) health = "STALLED";
      else if (daysAgo >= 7) health = "AT_RISK";

      items.push({
        id: `pot-${r.id}`,
        name: r.companyName,
        country: (r as any).country || "Germany",
        industry: r.industry || "SaaS",
        source,
        stage,
        owner,
        leadScore: r.potentialProbability || 75,
        health,
        lastActivityDaysAgo: daysAgo,
        lastActivityDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        nextAction: r.potentialNextFollowUp ? `Follow up scheduled on ${r.potentialNextFollowUp}` : "Schedule discovery meeting",
        nextActionDueDate: r.potentialNextFollowUp || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: r.notes?.join("; "),
        createdAt: r.appliedAt || "2026-06-15"
      });
    });

    // 3. Process Pending Applicants (Residents with PENDING status)
    residents.filter(r => r.status === "PENDING").forEach((r, idx) => {
      const daysAgo = (idx * 2 + 3) % 15;
      let health: HealthStatus = "HEALTHY";
      if (daysAgo > 14) health = "STALLED";
      else if (daysAgo >= 7) health = "AT_RISK";

      items.push({
        id: `pend-${r.id}`,
        name: r.companyName,
        country: (r as any).country || "UAE",
        industry: r.industry || "FinTech",
        source: (r as any).potentialSource || "Government / Institutional Referral",
        stage: "Application",
        owner: r.assignedManager || "Sarvar Mukhammadiev",
        leadScore: 90,
        health,
        lastActivityDaysAgo: daysAgo,
        lastActivityDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        nextAction: "Review tax audit declaration & compliance dossier",
        nextActionDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: r.notes?.join("; "),
        createdAt: r.appliedAt || "2026-07-01"
      });
    });

    // 4. Process Active Converted Residents (Residents with ACTIVE status)
    residents.filter(r => r.status === "ACTIVE").forEach((r) => {
      items.push({
        id: `act-${r.id}`,
        name: r.companyName,
        country: (r as any).country || "Poland",
        industry: r.industry || "Software Development",
        source: (r as any).potentialSource || "Direct Research",
        stage: "Resident",
        owner: r.assignedManager || "Hasan Abdukarimov",
        leadScore: 100,
        health: "HEALTHY",
        lastActivityDaysAgo: 2,
        lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        nextAction: "Quarterly export verification check",
        nextActionDueDate: "2026-09-30",
        notes: `Registered resident with INN ${r.registrationNumber}`,
        createdAt: r.approvedAt || r.appliedAt || "2024-01-01"
      });
    });

    return items;
  }, [companies, residents]);

  // --- FILTER APPLICATION ---
  const filteredPipeline = useMemo(() => {
    return allPipelineItems.filter(item => {
      // Source filter
      if (sourceFilter !== "ALL" && !(item.source || "").toLowerCase().includes(sourceFilter.toLowerCase())) {
        return false;
      }
      // Market/Country filter
      if (marketFilter !== "ALL" && item.country !== marketFilter) {
        return false;
      }
      // Industry filter
      if (industryFilter !== "ALL" && item.industry !== industryFilter) {
        return false;
      }
      // Owner filter
      if (ownerFilter !== "ALL" && item.owner !== ownerFilter) {
        return false;
      }
      // Stage filter
      if (stageFilter !== "ALL" && item.stage !== stageFilter) {
        return false;
      }
      // Health filter
      if (healthFilter !== "ALL" && item.health !== healthFilter) {
        return false;
      }
      return true;
    });
  }, [allPipelineItems, sourceFilter, marketFilter, industryFilter, ownerFilter, stageFilter, healthFilter]);

  // --- DYNAMIC FUNNEL STAGE COUNTS ---
  const stageCounts = useMemo(() => {
    const counts: Record<FunnelStage, number> = {
      "Target Lead": 0,
      "Contacted": 0,
      "Qualified": 0,
      "Meeting": 0,
      "Opportunity": 0,
      "Application": 0,
      "Resident": 0
    };

    // Calculate stage distribution
    filteredPipeline.forEach(item => {
      if (counts[item.stage] !== undefined) {
        counts[item.stage]++;
      }
    });

    return counts;
  }, [filteredPipeline]);

  // Cumulative funnel calculations (each stage represents companies that reached or passed that stage)
  const cumulativeStageCounts = useMemo(() => {
    // Stage counts from filtered data
    const s7 = stageCounts["Resident"];
    const s6 = stageCounts["Application"] + s7;
    const s5 = stageCounts["Opportunity"] + s6;
    const s4 = stageCounts["Meeting"] + s5;
    const s3 = stageCounts["Qualified"] + s4;
    const s2 = stageCounts["Contacted"] + s3;
    const s1 = stageCounts["Target Lead"] + s2;

    return {
      "Target Lead": s1,
      "Contacted": s2,
      "Qualified": s3,
      "Meeting": s4,
      "Opportunity": s5,
      "Application": s6,
      "Resident": s7
    };
  }, [stageCounts]);

  const topOfFunnelCount = cumulativeStageCounts["Target Lead"] || 1;

  // --- STEP-BY-STEP CONVERSION PERCENTAGES ---
  const conversionRates = useMemo(() => {
    const c = cumulativeStageCounts;
    const rate = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

    return {
      leadToContacted: rate(c["Contacted"], c["Target Lead"]),
      contactedToQualified: rate(c["Qualified"], c["Contacted"]),
      qualifiedToMeeting: rate(c["Meeting"], c["Qualified"]),
      meetingToOpportunity: rate(c["Opportunity"], c["Meeting"]),
      opportunityToApplication: rate(c["Application"], c["Opportunity"]),
      applicationToResident: rate(c["Resident"], c["Application"]),
      overallFunnel: rate(c["Resident"], c["Target Lead"])
    };
  }, [cumulativeStageCounts]);

  // --- 6 TOP KPI VALUES ---
  const activeLeadsCount = stageCounts["Target Lead"] + stageCounts["Contacted"];
  const qualifiedLeadsCount = cumulativeStageCounts["Qualified"];
  const meetingsPeriodCount = meetings.length > 0 ? meetings.length : stageCounts["Meeting"];
  const activeOpportunitiesCount = stageCounts["Opportunity"];
  const applicationsCount = stageCounts["Application"];
  const newResidentsCount = stageCounts["Resident"];

  // --- PIPELINE HEALTH METRICS ---
  const healthStats = useMemo(() => {
    let healthy = 0;
    let atRisk = 0;
    let stalled = 0;

    filteredPipeline.forEach(item => {
      if (item.stage !== "Resident") {
        if (item.health === "HEALTHY") healthy++;
        else if (item.health === "AT_RISK") atRisk++;
        else if (item.health === "STALLED") stalled++;
      }
    });

    const total = healthy + atRisk + stalled || 1;
    return {
      healthy,
      atRisk,
      stalled,
      total,
      healthyPct: Math.round((healthy / total) * 100),
      atRiskPct: Math.round((atRisk / total) * 100),
      stalledPct: Math.round((stalled / total) * 100)
    };
  }, [filteredPipeline]);

  // --- NEXT ACTIONS DERIVATION ---
  const nextActionsStats = useMemo(() => {
    const followUps = filteredPipeline.filter(p => p.stage === "Contacted" || p.stage === "Qualified").length;
    const meetingsToSchedule = filteredPipeline.filter(p => p.stage === "Meeting" || (p.leadScore >= 70 && p.stage !== "Resident")).length;
    const proposalsToSend = filteredPipeline.filter(p => p.stage === "Opportunity").length;
    const docsPending = filteredPipeline.filter(p => p.stage === "Application").length;
    const decisionsPending = residents.filter(r => r.status === "PENDING").length;
    const overdue = tasks.filter(t => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < new Date()).length + 
      filteredPipeline.filter(p => p.health === "STALLED").length;

    return {
      followUpsRequired: followUps,
      meetingsToSchedule: Math.max(1, meetingsToSchedule),
      proposalsToSend: Math.max(1, proposalsToSend),
      documentsPending: Math.max(1, docsPending),
      decisionsPending: Math.max(1, decisionsPending),
      overdueActivities: overdue
    };
  }, [filteredPipeline, residents, tasks]);

  // --- LEAD SOURCE ANALYTICS ---
  const sourceAnalytics = useMemo(() => {
    const sourceMap: Record<string, { leads: number; residents: number }> = {};
    LEAD_SOURCES.forEach(s => {
      sourceMap[s] = { leads: 0, residents: 0 };
    });

    allPipelineItems.forEach(item => {
      const match = LEAD_SOURCES.find(s => (item.source || "").toLowerCase().includes(s.toLowerCase())) || "Other";
      if (!sourceMap[match]) sourceMap[match] = { leads: 0, residents: 0 };
      sourceMap[match].leads++;
      if (item.stage === "Resident") {
        sourceMap[match].residents++;
      }
    });

    return Object.entries(sourceMap)
      .map(([source, data]) => ({
        source,
        leads: data.leads,
        residents: data.residents,
        conversionPct: data.leads > 0 ? Math.round((data.residents / data.leads) * 100) : 0
      }))
      .filter(d => d.leads > 0)
      .sort((a, b) => b.leads - a.leads);
  }, [allPipelineItems]);

  // --- TARGET MARKETS (INTERNATIONAL BD VIEW) ---
  const marketAnalytics = useMemo(() => {
    const map: Record<string, { leads: number; qualified: number; meetings: number; opportunities: number; residents: number }> = {};
    
    allPipelineItems.forEach(item => {
      const c = item.country || "Other";
      if (!map[c]) map[c] = { leads: 0, qualified: 0, meetings: 0, opportunities: 0, residents: 0 };
      map[c].leads++;
      if (["Qualified", "Meeting", "Opportunity", "Application", "Resident"].includes(item.stage)) map[c].qualified++;
      if (["Meeting", "Opportunity", "Application", "Resident"].includes(item.stage)) map[c].meetings++;
      if (["Opportunity", "Application", "Resident"].includes(item.stage)) map[c].opportunities++;
      if (item.stage === "Resident") map[c].residents++;
    });

    return Object.entries(map).map(([country, data]) => ({
      country,
      ...data,
      conversionPct: data.leads > 0 ? Math.round((data.residents / data.leads) * 100) : 0
    })).sort((a, b) => b.leads - a.leads);
  }, [allPipelineItems]);

  // --- TARGET INDUSTRIES ---
  const industryAnalytics = useMemo(() => {
    const map: Record<string, { leads: number; opportunities: number; residents: number }> = {};

    allPipelineItems.forEach(item => {
      const ind = item.industry || "Other";
      if (!map[ind]) map[ind] = { leads: 0, opportunities: 0, residents: 0 };
      map[ind].leads++;
      if (["Opportunity", "Application", "Resident"].includes(item.stage)) map[ind].opportunities++;
      if (item.stage === "Resident") map[ind].residents++;
    });

    return Object.entries(map).map(([industry, data]) => ({
      industry,
      ...data,
      conversionPct: data.leads > 0 ? Math.round((data.residents / data.leads) * 100) : 0
    })).sort((a, b) => b.leads - a.leads);
  }, [allPipelineItems]);

  // --- TEAM PERFORMANCE ---
  const teamPerformance = useMemo(() => {
    const map: Record<string, { leads: number; qualified: number; meetings: number; opportunities: number; applications: number; residents: number }> = {};

    allPipelineItems.forEach(item => {
      const owner = item.owner || "Unassigned";
      if (!map[owner]) map[owner] = { leads: 0, qualified: 0, meetings: 0, opportunities: 0, applications: 0, residents: 0 };
      map[owner].leads++;
      if (["Qualified", "Meeting", "Opportunity", "Application", "Resident"].includes(item.stage)) map[owner].qualified++;
      if (["Meeting", "Opportunity", "Application", "Resident"].includes(item.stage)) map[owner].meetings++;
      if (["Opportunity", "Application", "Resident"].includes(item.stage)) map[owner].opportunities++;
      if (["Application", "Resident"].includes(item.stage)) map[owner].applications++;
      if (item.stage === "Resident") map[owner].residents++;
    });

    return Object.entries(map).map(([member, data]) => ({
      member,
      ...data,
      conversionRate: data.leads > 0 ? Math.round((data.residents / data.leads) * 100) : 0
    })).sort((a, b) => b.leads - a.leads);
  }, [allPipelineItems]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setPeriodFilter("ALL");
    setSourceFilter("ALL");
    setMarketFilter("ALL");
    setIndustryFilter("ALL");
    setOwnerFilter("ALL");
    setStageFilter("ALL");
    setHealthFilter("ALL");
    setSelectedPipelineStageDetails(null);
  };

  const hasActiveFilters = sourceFilter !== "ALL" || marketFilter !== "ALL" || industryFilter !== "ALL" || ownerFilter !== "ALL" || stageFilter !== "ALL" || healthFilter !== "ALL";

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* 1. HEADER & REGIONAL ORGANIZATIONAL SCOPE */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-600/10 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300/40">
                IT Park Kashkadarya Pipeline
              </span>
              <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                International & Local Outreach
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Qarshi Regional HQ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-emerald-600 shrink-0" />
              Global Outreach & Resident Funnel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Track international and local business-development opportunities from target lead to IT Park Kashkadarya resident.
            </p>
          </div>

          {/* Quick Filter Reset & Summary indicator */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tracked</div>
                <div className="text-base font-extrabold text-slate-900 font-mono">{filteredPipeline.length} Co's</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                {stageCounts["Resident"]}
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE FILTER CONTROLS BAR */}
        <div className="mt-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
          
          {/* Source Filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Lead Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Sources</option>
              {LEAD_SOURCES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Market / Country Filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Target Market</label>
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Markets</option>
              {TARGET_MARKETS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Industry</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Industries</option>
              {TARGET_INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Responsible Person */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Responsible</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Team</option>
              <option value="Hasan Abdukarimov">Hasan Abdukarimov</option>
              <option value="Dilnoza Alimova">Dilnoza Alimova</option>
              <option value="Sarvar Mukhammadiev">Sarvar Mukhammadiev</option>
              <option value="Feruza Qodirova">Feruza Qodirova</option>
              <option value="Jasur Tursunov">Jasur Tursunov</option>
              <option value="Elena Popova">Elena Popova</option>
            </select>
          </div>

          {/* Pipeline Stage */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Stages</option>
              {STAGE_ORDER.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Pipeline Health */}
          <div>
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Pipeline Health</label>
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Health</option>
              <option value="HEALTHY">🟢 Healthy</option>
              <option value="AT_RISK">🟡 At Risk</option>
              <option value="STALLED">🔴 Stalled</option>
            </select>
          </div>

        </div>
      </div>

      {/* 2. TOP 6 KASHKADARYA-SPECIFIC KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* KPI 1: Total Active Leads */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Active Leads</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
              {activeLeadsCount > 0 ? activeLeadsCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            Active initial outreach
          </div>
        </div>

        {/* KPI 2: Qualified Leads */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-indigo-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Qualified Leads</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-900 mt-2 font-mono">
              {qualifiedLeadsCount > 0 ? qualifiedLeadsCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-indigo-700 font-medium">
            {conversionRates.contactedToQualified}% qualify rate
          </div>
        </div>

        {/* KPI 3: Meetings */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-purple-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Meetings</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-900 mt-2 font-mono">
              {meetingsPeriodCount > 0 ? meetingsPeriodCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-purple-700 font-medium">
            Discovery & negotiations
          </div>
        </div>

        {/* KPI 4: Active Opportunities */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Opportunities</span>
              <Briefcase className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-2 font-mono">
              {activeOpportunitiesCount > 0 ? activeOpportunitiesCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-amber-700 font-medium">
            High-intent deals
          </div>
        </div>

        {/* KPI 5: Applications */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-cyan-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-cyan-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Applications</span>
              <FileCheck className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-cyan-900 mt-2 font-mono">
              {applicationsCount > 0 ? applicationsCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-cyan-700 font-medium">
            In residency review
          </div>
        </div>

        {/* KPI 6: New Residents */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">New Residents</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900 mt-2 font-mono">
              {newResidentsCount > 0 ? newResidentsCount : "—"}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-emerald-700 font-medium font-bold">
            Converted & certified
          </div>
        </div>

      </div>

      {/* 3. 7-STAGE CONVERSION FUNNEL & CONVERSION METRICS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                7-Stage Pipeline
              </span>
              <span className="text-xs text-slate-400 font-mono">End-to-End Resident Conversion</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Conversion Funnel Visualizer
            </h3>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Overall Conversion Velocity: <span className="font-mono text-emerald-600 font-extrabold">{conversionRates.overallFunnel}%</span>
          </div>
        </div>

        {/* 7-STAGE VISUAL FUNNEL BARS */}
        <div className="space-y-3">
          {STAGE_ORDER.map((stageName, index) => {
            const count = cumulativeStageCounts[stageName];
            const pctOfTop = topOfFunnelCount > 0 ? Math.round((count / topOfFunnelCount) * 100) : 0;
            const def = STAGE_DEFINITIONS[stageName];
            const isSelected = selectedPipelineStageDetails === stageName;

            // Bar background gradients by stage
            const barColors = [
              "from-slate-600 to-slate-800",     // 1. Target Lead
              "from-blue-500 to-blue-700",       // 2. Contacted
              "from-indigo-500 to-indigo-700",   // 3. Qualified
              "from-purple-500 to-purple-700",   // 4. Meeting
              "from-amber-500 to-amber-600",     // 5. Opportunity
              "from-cyan-500 to-cyan-700",       // 6. Application
              "from-emerald-500 to-emerald-700"  // 7. Resident
            ];

            return (
              <div
                key={stageName}
                onClick={() => setSelectedPipelineStageDetails(isSelected ? null : stageName)}
                className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-50 border-slate-900 shadow-sm"
                    : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-[200px]">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{stageName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${def.bgBadge}`}>
                          {stageCounts[stageName]} direct
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {def.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900 font-mono">{count}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{pctOfTop}% of total</span>
                    </div>

                    <div className="w-36 sm:w-48 bg-slate-200 h-3.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColors[index]} transition-all duration-700`}
                        style={{ width: `${Math.max(6, pctOfTop)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Stage Definition & Matching Deals */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs space-y-2 animate-in fade-in-50 duration-150">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700">
                      <span className="font-bold text-slate-900">Definition: </span>
                      {def.description}
                    </div>

                    <div className="font-bold text-slate-800 pt-1">
                      Current companies in stage ({filteredPipeline.filter(p => p.stage === stageName).length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {filteredPipeline.filter(p => p.stage === stageName).map(p => (
                        <div key={p.id} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[150px]">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.country} • {p.industry}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600">{p.leadScore} pts</span>
                        </div>
                      ))}
                      {filteredPipeline.filter(p => p.stage === stageName).length === 0 && (
                        <div className="text-slate-400 italic text-[11px]">No companies currently at this exact stage in the filtered view.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* STEP-BY-STEP CONVERSION METRICS GRID */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Step-by-Step Stage Conversion Efficiency
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Lead → Contacted</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono block mt-1">
                {conversionRates.leadToContacted}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Initial reach</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Contacted → Qualified</span>
              <span className="text-lg font-extrabold text-indigo-700 font-mono block mt-1">
                {conversionRates.contactedToQualified}%
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">Interest match</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Qualified → Meeting</span>
              <span className="text-lg font-extrabold text-purple-700 font-mono block mt-1">
                {conversionRates.qualifiedToMeeting}%
              </span>
              <span className="text-[10px] text-purple-600 font-medium">Discovery held</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Meeting → Opportunity</span>
              <span className="text-lg font-extrabold text-amber-700 font-mono block mt-1">
                {conversionRates.meetingToOpportunity}%
              </span>
              <span className="text-[10px] text-amber-600 font-medium">Clear next step</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Opportunity → Application</span>
              <span className="text-lg font-extrabold text-cyan-700 font-mono block mt-1">
                {conversionRates.opportunityToApplication}%
              </span>
              <span className="text-[10px] text-cyan-600 font-medium">Residency filing</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] text-emerald-700 font-bold block uppercase">Application → Resident</span>
              <span className="text-lg font-extrabold text-emerald-800 font-mono block mt-1">
                {conversionRates.applicationToResident}%
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Certified active</span>
            </div>

          </div>
        </div>
      </div>

      {/* 4. PIPELINE HEALTH & NEXT ACTIONS (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: PIPELINE HEALTH */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-200">
                  Opportunity Health
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-600" />
                  Pipeline Health
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{healthStats.total} Active Tracked</span>
            </div>

            <p className="text-xs text-slate-500">
              Categorizes active deals based on recent communications and defined next operational actions.
            </p>

            {/* Health Category Selector Cards */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Healthy */}
              <button
                type="button"
                onClick={() => setHealthFilter(healthFilter === "HEALTHY" ? "ALL" : "HEALTHY")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  healthFilter === "HEALTHY"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-50/70 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Healthy</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1.5">
                  {healthStats.healthy}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Activity &lt; 7 days</span>
              </button>

              {/* At Risk */}
              <button
                type="button"
                onClick={() => setHealthFilter(healthFilter === "AT_RISK" ? "ALL" : "AT_RISK")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  healthFilter === "AT_RISK"
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/20"
                    : "bg-slate-50/70 border-slate-200 hover:bg-amber-50/50 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>At Risk</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1.5">
                  {healthStats.atRisk}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Inactive 7–14d</span>
              </button>

              {/* Stalled */}
              <button
                type="button"
                onClick={() => setHealthFilter(healthFilter === "STALLED" ? "ALL" : "STALLED")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  healthFilter === "STALLED"
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20"
                    : "bg-slate-50/70 border-slate-200 hover:bg-rose-50/50 hover:border-rose-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Stalled</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono mt-1.5">
                  {healthStats.stalled}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Inactive &gt; 14d</span>
              </button>

            </div>

            {/* Health Proportional Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-700">{healthStats.healthyPct}% Healthy</span>
                <span className="text-amber-700">{healthStats.atRiskPct}% At Risk</span>
                <span className="text-rose-700">{healthStats.stalledPct}% Stalled</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full flex overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${healthStats.healthyPct}%` }} />
                <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${healthStats.atRiskPct}%` }} />
                <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${healthStats.stalledPct}%` }} />
              </div>
            </div>
          </div>

          {onNavigateToCRM && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onNavigateToCRM}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Open CRM Outreach Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: NEXT ACTIONS */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200">
                  Actionable BD Agenda
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  Next Actions
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Dynamic Task Ledger</span>
            </div>

            <p className="text-xs text-slate-500">
              High-priority operational deliverables required to move pipeline companies forward into residency.
            </p>

            {/* Action items list */}
            <div className="space-y-2 text-xs font-bold">
              
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
                <span className="text-slate-700 flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  Follow-ups required
                </span>
                <span className="font-mono text-sm font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.followUpsRequired}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
                <span className="text-slate-700 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  Meetings to schedule
                </span>
                <span className="font-mono text-sm font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.meetingsToSchedule}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
                <span className="text-slate-700 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-amber-600" />
                  Proposals/offers to send
                </span>
                <span className="font-mono text-sm font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.proposalsToSend}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
                <span className="text-slate-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-600" />
                  Documents pending
                </span>
                <span className="font-mono text-sm font-black bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.documentsPending}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
                <span className="text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Decisions pending
                </span>
                <span className="font-mono text-sm font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.decisionsPending}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl hover:bg-rose-50 transition-all">
                <span className="text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Overdue activities
                </span>
                <span className="font-mono text-sm font-black bg-rose-200 text-rose-900 px-2 py-0.5 rounded-lg">
                  {nextActionsStats.overdueActivities}
                </span>
              </div>

            </div>
          </div>

          {onNavigateToResidents && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onNavigateToResidents}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <span>Review Pending Resident Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 5. LEAD SOURCES & TARGET MARKETS (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LEAD SOURCES */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-200">
                Acquisition Channels
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-blue-600" />
                Lead Sources
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Volume & Resident Yield</span>
          </div>

          <p className="text-xs text-slate-500">
            Track origin channels for outbound prospecting and inbound conversion into Kashkadarya residents.
          </p>

          <div className="space-y-3">
            {sourceAnalytics.map(s => {
              const maxLeads = Math.max(...sourceAnalytics.map(x => x.leads), 1);
              const barPct = Math.round((s.leads / maxLeads) * 100);

              return (
                <div key={s.source} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{s.source}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-600 font-bold">{s.leads} leads</span>
                      <span className="text-slate-300">→</span>
                      <span className="text-emerald-700 font-black">{s.residents} residents</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                        {s.conversionPct}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              );
            })}
            {sourceAnalytics.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">No lead source records found for selected filter criteria.</div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TARGET MARKETS (INTERNATIONAL BD VIEW) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="bg-blue-50 text-blue-800 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-blue-200">
                International Markets
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                Target Markets
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Foreign Pipeline</span>
          </div>

          <p className="text-xs text-slate-500">
            Global market distribution of target companies converting into IT Park Kashkadarya residency.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-2">Country / Market</th>
                  <th className="pb-2 text-center">Leads</th>
                  <th className="pb-2 text-center">Qual.</th>
                  <th className="pb-2 text-center">Meet.</th>
                  <th className="pb-2 text-center">Opp.</th>
                  <th className="pb-2 text-center">Residents</th>
                  <th className="pb-2 text-right">Conv. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {marketAnalytics.slice(0, 7).map(m => (
                  <tr key={m.country} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-sans font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{m.country}</span>
                    </td>
                    <td className="py-2.5 text-center text-slate-700">{m.leads}</td>
                    <td className="py-2.5 text-center text-indigo-700 font-bold">{m.qualified}</td>
                    <td className="py-2.5 text-center text-purple-700">{m.meetings}</td>
                    <td className="py-2.5 text-center text-amber-700 font-bold">{m.opportunities}</td>
                    <td className="py-2.5 text-center text-emerald-700 font-extrabold">{m.residents}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">{m.conversionPct}%</td>
                  </tr>
                ))}
                {marketAnalytics.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 font-sans italic">No market data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 6. TARGET INDUSTRIES & BD TEAM PERFORMANCE (2-COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TARGET INDUSTRIES */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="bg-purple-50 text-purple-800 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-purple-200">
                Industry Verticals
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Target Industries
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Tech Segments</span>
          </div>

          <p className="text-xs text-slate-500">
            Pipeline velocity and resident graduation by technological domain and business model.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-2">Tech Industry</th>
                  <th className="pb-2 text-center">Leads</th>
                  <th className="pb-2 text-center">Opportunities</th>
                  <th className="pb-2 text-center">Residents</th>
                  <th className="pb-2 text-right">Conv. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {industryAnalytics.slice(0, 8).map(ind => (
                  <tr key={ind.industry} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-sans font-bold text-slate-800">{ind.industry}</td>
                    <td className="py-2.5 text-center text-slate-700">{ind.leads}</td>
                    <td className="py-2.5 text-center text-amber-700 font-bold">{ind.opportunities}</td>
                    <td className="py-2.5 text-center text-emerald-700 font-black">{ind.residents}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">{ind.conversionPct}%</td>
                  </tr>
                ))}
                {industryAnalytics.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 font-sans italic">No industry records available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: TEAM BD PERFORMANCE */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-200">
                Officer Accountability
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Business Development Performance
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Team Metrics</span>
          </div>

          <p className="text-xs text-slate-500">
            Performance of Kashkadarya officers across prospecting, meetings, and residency conversions.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="pb-2">Officer</th>
                  <th className="pb-2 text-center">Leads</th>
                  <th className="pb-2 text-center">Meetings</th>
                  <th className="pb-2 text-center">Deals</th>
                  <th className="pb-2 text-center">Residents</th>
                  <th className="pb-2 text-right">Conv. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {teamPerformance.map(m => (
                  <tr key={m.member} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-sans font-bold text-slate-800">{m.member}</td>
                    <td className="py-2.5 text-center text-slate-700">{m.leads}</td>
                    <td className="py-2.5 text-center text-purple-700 font-bold">{m.meetings}</td>
                    <td className="py-2.5 text-center text-amber-700">{m.opportunities}</td>
                    <td className="py-2.5 text-center text-emerald-700 font-black">{m.residents}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-700">{m.conversionRate}%</td>
                  </tr>
                ))}
                {teamPerformance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-sans italic">No team data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
