/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Rocket, 
  X, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ShieldCheck, 
  HandHeart, 
  Award, 
  Briefcase, 
  Sparkles, 
  Target, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Layers,
  Zap,
  Activity,
  Bookmark,
  Edit
} from "lucide-react";
import { 
  Startup, 
  StartupMilestone, 
  StartupSupportLog, 
  StartupTalentNeed,
  KashkadaryaDistrict 
} from "../../../types";
import { 
  calculateStartupHealth, 
  calculateInvestmentReadiness, 
  normalizeStage,
  LIFECYCLE_STAGES
} from "../utils/startupCalculations";
import { useLanguage } from "../../../lib/LanguageContext";

interface Startup360ModalProps {
  startup: Startup;
  onClose: () => void;
  onUpdate: (id: string, partial: Partial<Startup>) => Promise<void>;
  onOpenTraditionalProfile: (startup: Startup) => void;
  onEdit: (startup: Startup) => void;
  isReadOnly?: boolean;
}

type TabType = 
  | "OVERVIEW"
  | "TRACTION"
  | "FINANCIALS"
  | "TEAM"
  | "PRODUCT"
  | "INVESTMENT"
  | "EXPORT"
  | "MILESTONES"
  | "SUPPORT_CRM"
  | "ACTIVITY"
  | "ACHIEVEMENTS"
  | "DOCUMENTS";

export default function Startup360Modal({
  startup,
  onClose,
  onUpdate,
  onOpenTraditionalProfile,
  onEdit,
  isReadOnly
}: Startup360ModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("OVERVIEW");

  // New Milestone Form
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");

  // New Support Activity Form
  const [showAddSupport, setShowAddSupport] = useState(false);
  const [supportType, setSupportType] = useState<any>("Mentorship");
  const [supportDesc, setSupportDesc] = useState("");
  const [supportResult, setSupportResult] = useState("");
  const [supportNextStep, setSupportNextStep] = useState("");

  // New Document Form
  const [newDocName, setNewDocName] = useState("");

  // Quick note state
  const [newNote, setNewNote] = useState("");

  // Calculations
  const health = calculateStartupHealth(startup);
  const invest = calculateInvestmentReadiness(startup);
  const stage = normalizeStage(startup.stage);
  const mrr = startup.mrr ?? startup.kpis?.mrr ?? 0;
  const paying = startup.payingCustomers ?? (startup.totalCustomers ? Math.round(startup.totalCustomers * 0.4) : (startup.activeUsers ? Math.round(startup.activeUsers * 0.08) : 0));
  const jobs = startup.jobsCreated ?? Math.max(0, (startup.employees || 1) - 2);

  // Milestones progress
  const milestones = startup.milestones || [];
  const completedMilestones = milestones.filter(m => m.completed).length;
  const milestoneProgress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  // Toggle Milestone completion
  const handleToggleMilestone = async (milestoneId: string) => {
    if (isReadOnly) return;
    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        const nextCompleted = !m.completed;
        return {
          ...m,
          completed: nextCompleted,
          status: nextCompleted ? ("COMPLETED" as const) : ("IN_PROGRESS" as const),
          completionDate: nextCompleted ? new Date().toISOString().split("T")[0] : undefined
        };
      }
      return m;
    });
    await onUpdate(startup.id, { milestones: updated });
  };

  // Add Milestone
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const newMs: StartupMilestone = {
      id: `ms-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      targetDate: newMilestoneDate || new Date().toISOString().split("T")[0],
      completed: false,
      status: "IN_PROGRESS",
      owner: startup.founder
    };
    const updated = [...milestones, newMs];
    await onUpdate(startup.id, { milestones: updated });
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
    setShowAddMilestone(false);
  };

  // Add Support Log
  const handleAddSupportLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportDesc.trim()) return;
    const newLog: StartupSupportLog = {
      id: `sh-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      supportType,
      description: supportDesc.trim(),
      result: supportResult.trim() || "Recorded into IT Park CRM",
      nextStep: supportNextStep.trim(),
      officer: "Current Officer"
    };
    const updated = [newLog, ...(startup.supportHistory || [])];
    await onUpdate(startup.id, { supportHistory: updated });
    setSupportDesc("");
    setSupportResult("");
    setSupportNextStep("");
    setShowAddSupport(false);
  };

  // Add Document
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    const cleanDoc = newDocName.trim().endsWith(".pdf") ? newDocName.trim() : `${newDocName.trim()}.pdf`;
    const updated = [...(startup.documents || []), cleanDoc];
    await onUpdate(startup.id, { documents: updated });
    setNewDocName("");
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [...(startup.notes || []), newNote.trim()];
    await onUpdate(startup.id, { notes: updated });
    setNewNote("");
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "OVERVIEW", label: "Overview", icon: Building2 },
    { id: "TRACTION", label: "Traction & MRR", icon: TrendingUp },
    { id: "FINANCIALS", label: "Financials", icon: DollarSign },
    { id: "TEAM", label: "Team & Talent", icon: Users },
    { id: "PRODUCT", label: "Product & Tech", icon: Layers },
    { id: "INVESTMENT", label: "Investment (0-100)", icon: Target },
    { id: "EXPORT", label: "Export & Markets", icon: Globe },
    { id: "MILESTONES", label: "Milestones", icon: CheckCircle2 },
    { id: "SUPPORT_CRM", label: "IT Park Support", icon: HandHeart },
    { id: "ACTIVITY", label: "Growth Story", icon: Activity },
    { id: "ACHIEVEMENTS", label: "Achievements", icon: Award },
    { id: "DOCUMENTS", label: "Documents", icon: FileText }
  ];

  return (
    <div id="startup-360-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Header Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-lg border border-indigo-400/30 shrink-0">
              {startup.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">{startup.name}</h1>
                {startup.status === "GRADUATED" && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t("IT Park Resident")}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  {t(LIFECYCLE_STAGES.find(ls => ls.id === stage)?.label || stage.replace("_", " "))}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {t(startup.district || "Qarshi")}, {t("Qashqadaryo")}
                </span>
                <span>&bull;</span>
                <span className="text-slate-300 font-medium">{startup.industry}</span>
                <span>&bull;</span>
                <span>{t("Founder")}: <strong className="text-white">{startup.founder}</strong></span>
                <span>&bull;</span>
                <span>{t("Cohort")}: <strong>{startup.cohort || `${startup.foundedYear || 2025} ${t("Cohort")}`}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {!isReadOnly && (
              <button
                onClick={() => onEdit(startup)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer border border-indigo-500/30"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{t("Edit Profile")}</span>
              </button>
            )}
            <button
              onClick={() => onOpenTraditionalProfile(startup)}
              className="flex items-center gap-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer border border-indigo-500/30"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t("Official Company Profile")}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Top Health & KPI Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">{t("Startup Health")}:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${
                health.status === "HEALTHY"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : health.status === "NEEDS_ATTENTION"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : health.status === "AT_RISK"
                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  health.status === "HEALTHY" ? "bg-emerald-600" : health.status === "NEEDS_ATTENTION" ? "bg-amber-600" : health.status === "AT_RISK" ? "bg-rose-600" : "bg-slate-400"
                }`}
              />
              <span>{health.status === "HEALTHY" ? t("HEALTHY") : health.status === "NEEDS_ATTENTION" ? t("NEEDS ATTENTION") : health.status === "AT_RISK" ? t("AT RISK") : t("NO DATA REPORTED")}</span>
              {health.status !== "NO_DATA" && (
                <span className="font-mono font-black">({health.score}/100)</span>
              )}
            </span>
            <span className="text-slate-500 italic max-w-md truncate">"{health.reason}"</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 font-sans text-[10px] block">{t("MRR")}:</span>
              <span className="font-black text-slate-800">${mrr > 0 ? mrr.toLocaleString() : "0"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans text-[10px] block">{t("Funding")}:</span>
              <span className="font-black text-slate-800">${(startup.fundingRaised || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans text-[10px] block">{t("Jobs")}:</span>
              <span className="font-black text-emerald-600">+{jobs}</span>
            </div>
          </div>
        </div>

        {/* 12 Horizontal Scrollable Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isTabActive
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.label)}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content (Scrollable) */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">

          {/* 1. OVERVIEW TAB */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {/* Next Best Action Card (Top Priority Banner) */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-lg shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider block">
                      {t("Next Best Action for IT Park Team")}
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {startup.nextAction?.action || t("Conduct strategic quarterly audit and connect with prospective pilot clients.")}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                      <span>{t("Priority")}: <strong className="text-amber-400">{t(startup.nextAction?.priority || "HIGH")}</strong></span>
                      <span>&bull;</span>
                      <span>{t("Due")}: <strong>{startup.nextAction?.dueDate || "2026-09-30"}</strong></span>
                      <span>&bull;</span>
                      <span>{t("Assigned Officer")}: <strong>{startup.nextAction?.assignedTo || "Dilnoza Alimova"}</strong></span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-lg text-xs font-bold">
                  {t(startup.nextAction?.status || "IN_PROGRESS")}
                </span>
              </div>

              {/* Company Summary & Structured Metadata */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Executive Summary & Solution")}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {startup.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("Business Model")}</span>
                      <span className="font-bold text-slate-800">{startup.businessModel || t("B2B SaaS")}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("District")}</span>
                      <span className="font-bold text-slate-800">{t(startup.district || "Qarshi")}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("Program Track")}</span>
                      <span className="font-bold text-slate-800">{t(startup.program || "Acceleration")}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("Founded Year")}</span>
                      <span className="font-bold text-slate-800">{startup.foundedYear || 2024}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("Team Headcount")}</span>
                      <span className="font-bold text-slate-800 font-mono">{startup.employees || 1} {t("Heads")}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{t("Total Jobs Created")}</span>
                      <span className="font-bold text-emerald-600 font-mono">+{jobs} {t("Jobs")}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Official Channels */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Official Contacts & Links")}
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`mailto:${startup.email}`} className="text-indigo-600 hover:underline truncate">
                        {startup.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-slate-700 font-mono">{startup.phone || "+998 90 000 00 00"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={startup.website || "#"} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate flex items-center gap-1">
                        <span>{startup.website || "https://startup.uz"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Active Support Required Box */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      {t("Support Required by Founder")}
                    </span>
                    <div className="space-y-2">
                      {(startup.supportRequired || [
                        { category: "Investor", priority: "HIGH", details: t("Introductions to early stage seed investors.") },
                        { category: "Talent", priority: "MEDIUM", details: t("Need senior React & Go developer.") }
                      ]).map((sr, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <strong className="text-slate-800 font-semibold">{t(sr.category)}</strong>
                            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                              sr.priority === "CRITICAL" ? "bg-rose-100 text-rose-800" :
                              sr.priority === "HIGH" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {t(sr.priority)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">{sr.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TRACTION TAB */}
          {activeTab === "TRACTION" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Monthly Recurring Revenue")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">${mrr.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">+{startup.revenueGrowthPct || 25}% {t("QoQ growth")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Annual Run Rate (ARR)")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">${(startup.arr || mrr * 12).toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{t("Projected 12-month run-rate")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Paying Customers")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">{paying}</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">{t("of")} {startup.totalCustomers || startup.activeUsers || paying} {t("total users")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Monthly Churn Rate")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">{startup.kpis?.churnRate || 1.2}%</div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">{t("Healthy SaaS benchmark")}</span>
                </div>
              </div>

              {/* Commercial Traction & Pipeline */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("Commercial Validation & Active Client Contracts")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">{t("Active Commercial Contracts")}</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-1 block">{paying} {t("Active B2B/B2C Accounts")}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">{t("Active Pilots / POCs")}</span>
                    <span className="text-lg font-black text-indigo-600 font-mono mt-1 block">{t("3 Regional Enterprise Pilots")}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">{t("Average Contract Value (ACV)")}</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-1 block">${paying > 0 ? Math.round((mrr * 12) / paying).toLocaleString() : "0"} USD</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. FINANCIALS TAB */}
          {activeTab === "FINANCIALS" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Total Funding Raised")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">${(startup.fundingRaised || 0).toLocaleString()} USD</div>
                  <span className="text-[10px] text-indigo-600 font-bold mt-1 block">{t("Stage")}: {t(startup.fundingStatus || "Seed")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Estimated Runway")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">{t("14 Months")}</div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">{t("Sustainable cash flow")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Commercial Bank")}</span>
                  <div className="text-base font-bold text-slate-800 mt-1">{startup.bank || t("National Bank of Uzbekistan")}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{t("Official operational bank")}</span>
                </div>
              </div>

              {/* Historical revenue table */}
              {startup.historicalPerformance && startup.historicalPerformance.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Historical Financial & Employment Progression")}
                  </h3>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3">{t("Year")}</th>
                        <th className="py-2.5 px-3 text-center">{t("Employees")}</th>
                        <th className="py-2.5 px-3 text-right">{t("Revenue (USD)")}</th>
                        <th className="py-2.5 px-3 text-right">{t("Export Revenue")}</th>
                        <th className="py-2.5 px-3 text-center">{t("Jobs Created")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {startup.historicalPerformance.map((hp) => (
                        <tr key={hp.year}>
                          <td className="py-2.5 px-3 font-bold font-mono text-slate-800">{hp.year}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">{hp.employees}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">${hp.revenue.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">${(hp.exportRevenue || 0).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">+{hp.jobsCreated || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 4. TEAM & TALENT TAB */}
          {activeTab === "TEAM" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Team Breakdown */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Team Composition")} ({startup.employees || 1} {t("Total Headcount")})
                  </h3>
                  <div className="space-y-3">
                    {[
                      { role: "Software Engineers / Developers", count: startup.teamBreakdown?.developers || Math.max(1, Math.round((startup.employees || 4) * 0.6)) },
                      { role: "Product Management & UI/UX", count: startup.teamBreakdown?.product || 1 },
                      { role: "B2B Sales & Business Development", count: startup.teamBreakdown?.sales || Math.max(1, Math.round((startup.employees || 4) * 0.2)) },
                      { role: "Marketing & Growth", count: startup.teamBreakdown?.marketing || 1 },
                      { role: "Operations & Admin", count: startup.teamBreakdown?.operations || 1 }
                    ].map((item) => (
                      <div key={item.role} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-700 font-medium">{t(item.role)}</span>
                        <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded border border-slate-200">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Talent Needs (Connectable to Talent Pool) */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {t("Active Talent Needs (IT Park Talent Matching)")}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-bold">{t("Talent Pool Connected")}</span>
                  </div>

                  <div className="space-y-3">
                    {(startup.talentNeeds || [
                      { id: "tn-1", role: t("Senior Backend Developer"), priority: "HIGH" as const, department: "Developers" as const, count: 1, skillsNeeded: ["Go", "PostgreSQL", "Docker"], status: "OPEN" as const },
                      { id: "tn-2", role: t("B2B Account Manager"), priority: "MEDIUM" as const, department: "Sales" as const, count: 1, skillsNeeded: ["Enterprise Sales", "Uzbek / Russian"], status: "OPEN" as const }
                    ]).map((tn) => (
                      <div key={tn.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-800 font-bold">{tn.role}</strong>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            tn.priority === "CRITICAL" ? "bg-rose-100 text-rose-800" :
                            tn.priority === "HIGH" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"
                          }`}>
                            {t(tn.priority)} {t("PRIORITY")}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tn.skillsNeeded?.map((sk, i) => (
                            <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PRODUCT & TECH TAB */}
          {activeTab === "PRODUCT" && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t("Product Architecture & Solution Offerings")}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {startup.description}
              </p>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t("Key Services & Core Capabilities")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(startup.services || [t("Cloud Architecture"), t("API Integration"), t("Automated Analytics")]).map((srv, i) => (
                    <div key={i} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-950 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. INVESTMENT TAB */}
          {activeTab === "INVESTMENT" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-sm border border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider">
                    {t("Investment Readiness Evaluation")}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-black font-mono text-white">{invest.score}</span>
                    <span className="text-sm font-semibold text-slate-300">{t("/ 100 Score")}</span>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
                      {t(invest.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:max-w-md text-xs">
                  <div>
                    <span className="text-indigo-200 font-bold uppercase text-[10px] block">{t("Main Readiness Gap")}</span>
                    <p className="text-slate-200 text-[11px]">{invest.mainGap}</p>
                  </div>
                  <div>
                    <span className="text-indigo-200 font-bold uppercase text-[10px] block">{t("Recommended Action")}</span>
                    <p className="text-slate-200 text-[11px]">{invest.recommendedAction}</p>
                  </div>
                </div>
              </div>

              {/* Evaluation Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: t("Product Validation"), score: "85/100", note: t("Working prototype and beta users") },
                  { title: t("Market Size & TAM"), score: "80/100", note: t("Central Asian market growth") },
                  { title: t("Traction & Unit Economics"), score: "78/100", note: t("Positive monthly recurring cash") },
                  { title: t("Legal & Cap Table"), score: "70/100", note: t("Delaware / ADGM flip required for international VC") }
                ].map((ev) => (
                  <div key={ev.title} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{ev.title}</span>
                    <span className="text-base font-black font-mono text-slate-800 mt-1 block">{ev.score}</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">{ev.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. EXPORT & MARKETS TAB */}
          {activeTab === "EXPORT" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Export Readiness Lifecycle")}</span>
                  <div className="text-lg font-black text-indigo-700 mt-1">{t(startup.exportReadiness || "PREPARING")}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{t("Score")}: {startup.exportReadinessScore || 50}/100</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Direct IT Export Revenue")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">${(startup.exportRevenue || 0).toLocaleString()} USD</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{t("International contract revenue")}</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("International Clients")}</span>
                  <div className="text-xl font-extrabold text-slate-800 font-mono mt-1">{startup.internationalCustomers || 0} {t("Accounts")}</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">{t("Outside Uzbekistan")}</span>
                </div>
              </div>

              {/* Markets Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t("Current Active Markets")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(startup.currentMarkets || [t("Uzbekistan")]).map((m, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t("Target Expansion Markets (Local2Global)")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(startup.targetMarkets || [t("Kazakhstan"), t("Kyrgyzstan"), t("UAE")]).map((m, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. MILESTONES TAB */}
          {activeTab === "MILESTONES" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Milestone Progression")} ({completedMilestones}/{milestones.length} {t("Completed")})
                  </h3>
                  <div className="w-64 bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${milestoneProgress}%` }} />
                  </div>
                </div>

                {!isReadOnly && (
                  <button
                    onClick={() => setShowAddMilestone(!showAddMilestone)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t("Add Milestone")}</span>
                  </button>
                )}
              </div>

              {/* Add Milestone Form */}
              {showAddMilestone && (
                <form onSubmit={handleAddMilestone} className="bg-white border border-indigo-200 rounded-xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase">{t("Create New Milestone")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder={t("e.g. Launch AI Module or Reach $10K MRR")}
                      value={newMilestoneTitle}
                      onChange={(e) => setNewMilestoneTitle(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="date"
                      value={newMilestoneDate}
                      onChange={(e) => setNewMilestoneDate(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMilestone(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {t("Save Milestone")}
                    </button>
                  </div>
                </form>
              )}

              {/* Milestone List */}
              <div className="space-y-2.5">
                {milestones.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
                    {t("No milestones recorded yet. Add one above!")}
                  </div>
                ) : (
                  milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        m.completed ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          m.completed ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300 bg-white"
                        }`}>
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold ${m.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                            {m.title}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                            {m.targetDate && <span>{t("Target")}: {m.targetDate}</span>}
                            {m.completionDate && <span className="text-emerald-600 font-bold">{t("Completed")}: {m.completionDate}</span>}
                            {m.owner && <span>&bull; {t("Owner")}: {m.owner}</span>}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        m.completed ? "bg-emerald-100 text-emerald-800" :
                        m.status === "DELAYED" ? "bg-rose-100 text-rose-800" : "bg-indigo-100 text-indigo-800"
                      }`}>
                        {t(m.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 9. IT PARK SUPPORT CRM TAB */}
          {activeTab === "SUPPORT_CRM" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("IT Park Assistance History & Log")}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {t("Official log of mentorship, investor matchmaking, grants, and technical support provided.")}
                  </p>
                </div>

                {!isReadOnly && (
                  <button
                    onClick={() => setShowAddSupport(!showAddSupport)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t("Log Support Activity")}</span>
                  </button>
                )}
              </div>

              {/* Log Support Form */}
              {showAddSupport && (
                <form onSubmit={handleAddSupportLog} className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase">{t("Record New Support Activity")}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={supportType}
                      onChange={(e) => setSupportType(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="Mentorship">{t("Mentorship")}</option>
                      <option value="Investor introduction">{t("Investor introduction")}</option>
                      <option value="Talent matching">{t("Talent matching")}</option>
                      <option value="Export support">{t("Export support")}</option>
                      <option value="Grant">{t("Grant")}</option>
                      <option value="Legal">{t("Legal support")}</option>
                      <option value="Workspace">{t("Workspace")}</option>
                      <option value="Government support">{t("Government support")}</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder={t("Description of assistance...")}
                      value={supportDesc}
                      onChange={(e) => setSupportDesc(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder={t("Result / Outcome...")}
                      value={supportResult}
                      onChange={(e) => setSupportResult(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder={t("Next Step...")}
                      value={supportNextStep}
                      onChange={(e) => setSupportNextStep(e.target.value)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSupport(false)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {t("Record in CRM")}
                    </button>
                  </div>
                </form>
              )}

              {/* Support Timeline */}
              <div className="space-y-3">
                {(startup.supportHistory && startup.supportHistory.length > 0) ? (
                  startup.supportHistory.map((sh) => (
                    <div key={sh.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{t(sh.supportType)}</span>
                          <span className="text-[10px] text-slate-400 font-mono">&bull; {sh.date}</span>
                        </div>
                        {sh.officer && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {t("Officer")}: {sh.officer}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed">{sh.description}</p>
                      {sh.result && (
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                          <strong className="text-slate-700">{t("Result")}:</strong> {sh.result}
                        </div>
                      )}
                      {sh.nextStep && (
                        <div className="text-[11px] text-indigo-700 font-medium">
                          <strong>{t("Next Step")}:</strong> {sh.nextStep}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
                    {t("No official support records logged yet.")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 10. GROWTH STORY & ACTIVITY TAB */}
          {activeTab === "ACTIVITY" && (
            <div className="space-y-6">
              {/* Growth Story Narrative */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("Startup Growth Story & Evolution")}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "{startup.growthStory || `${startup.name} was established in ${startup.district || "Qarshi"} by ${startup.founder}. The startup has scaled from early prototype to an active technology organization generating economic impact.`}"
                </p>

                {/* Growth metrics comparison */}
                {startup.historicalPerformance && startup.historicalPerformance.length >= 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {(() => {
                      const first = startup.historicalPerformance[0];
                      const last = startup.historicalPerformance[startup.historicalPerformance.length - 1];
                      const revGrowth = first.revenue > 0 ? Math.round(((last.revenue - first.revenue) / first.revenue) * 100) : 100;
                      const empGrowth = first.employees > 0 ? Math.round(((last.employees - first.employees) / first.employees) * 100) : 100;

                      return (
                        <>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">{t("Revenue Growth")}</span>
                            <span className="text-base font-black text-slate-800 font-mono">${first.revenue.toLocaleString()} &rarr; ${last.revenue.toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">+{revGrowth}% {t("Total Expansion")}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">{t("Headcount Growth")}</span>
                            <span className="text-base font-black text-slate-800 font-mono">{first.employees} &rarr; {last.employees} {t("Heads")}</span>
                            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">+{empGrowth}% {t("Employment Created")}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">{t("Export Progression")}</span>
                            <span className="text-base font-black text-slate-800 font-mono">${(last.exportRevenue || 0).toLocaleString()} USD</span>
                            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">{t("Cross-border service exports")}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Chronological Activity Timeline */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("Chronological Activity Timeline")}
                </h3>
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                  {(startup.activityTimeline || [
                    { date: startup.joinedAt || "2024-03-15", title: t("Joined IT Park Incubation Cohort"), type: "Program" }
                  ]).map((act, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />
                      <div className="text-xs">
                        <span className="text-[10px] text-slate-400 font-mono">{act.date}</span>
                        <h4 className="font-bold text-slate-800 mt-0.5">{act.title}</h4>
                        {act.description && <p className="text-slate-500 text-[11px] mt-0.5">{act.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 11. ACHIEVEMENTS TAB */}
          {activeTab === "ACHIEVEMENTS" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("Verified Ecosystem Achievements & Awards")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(startup.achievements && startup.achievements.length > 0) ? (
                    startup.achievements.map((ach) => (
                      <div key={ach.id} className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl flex items-start gap-3 text-xs">
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-800 font-mono font-bold">{ach.date} &bull; {ach.category}</span>
                          <h4 className="font-bold text-slate-900 text-xs mt-0.5">{ach.title}</h4>
                          {ach.description && <p className="text-slate-600 text-[11px] mt-0.5">{ach.description}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-6 text-xs text-slate-500">
                      {t("No official awards or competitions registered yet.")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 12. DOCUMENTS & LEGAL TAB */}
          {activeTab === "DOCUMENTS" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("Verified Documents (Pitch Decks, Financial Models & Charters)")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(startup.documents || []).map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-slate-800 truncate">{doc}</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                        {t("VERIFIED")}
                      </span>
                    </div>
                  ))}
                </div>

                {!isReadOnly && (
                  <form onSubmit={handleAddDoc} className="flex gap-2 pt-3 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder={t("e.g. audited_tax_filing_2026.pdf")}
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {t("Attach Document")}
                    </button>
                  </form>
                )}
              </div>

              {/* Administrative Notes / Comments */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("Administrative Confidential Comments")}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(startup.notes || []).map((n, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100">
                      {n}
                    </div>
                  ))}
                </div>

                {!isReadOnly && (
                  <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder={t("Add administrative comment...")}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {t("Post Note")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span>{t("Startup ID")}: <strong className="font-mono text-slate-700">{startup.id}</strong></span>
            <span>&bull;</span>
            <span>{t("Joined")}: <strong className="font-mono text-slate-700">{startup.joinedAt}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTraditionalProfile(startup)}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-all cursor-pointer text-xs"
            >
              {t("Open Official Dossier")}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg transition-all cursor-pointer text-xs"
            >
              {t("Close Profile")}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
