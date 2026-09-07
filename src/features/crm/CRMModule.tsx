/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import AiInsightsCard from "../ai/AiInsightsCard";
import CrmToday from "./CrmToday";
import CrmDirectory from "./CrmDirectory";
import CrmCompanyPanel from "./CrmCompanyPanel";
import {
  PipelineStage, isStalled, needsFirstResponse, statusForStage,
} from "./crmDerive";
import { 
  Briefcase, 
  Search, 
  Plus, 
  X, 
  ChevronRight, 
  Mail, 
  Phone, 
  Linkedin, 
  Calendar, 
  BrainCircuit, 
  CheckSquare, 
  Trash2,
  FileText,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  Send,
  Building2,
  AlertCircle,
  Filter,
  ArrowRight,
  CheckCircle,
  Megaphone,
  Pencil,
  Rocket,
  Target,
  Clock
} from "lucide-react";
import { Company, Contact, Meeting, Task, OutreachCampaign, CRM_BENEFITS_PITCHED_OPTIONS } from "../../types";
import ExportImportManager from "../../components/ExportImportManager";

interface CRMModuleProps {
  companies: Company[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  onAddCompany: (c: Omit<Company, "id">) => Promise<void>;
  onUpdateCompany: (id: string, c: Partial<Company>) => Promise<void>;
  onDeleteCompany: (id: string) => Promise<void>;
  onAddContact: (c: Omit<Contact, "id">) => Promise<void>;
  onUpdateContact: (id: string, c: Partial<Contact>) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
  onAddMeeting: (m: Omit<Meeting, "id">) => Promise<void>;
  onUpdateMeeting: (id: string, m: Partial<Meeting>) => Promise<void>;
  onAddTask: (t: Omit<Task, "id">) => Promise<void>;
  onUpdateTask: (id: string, t: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  campaigns: OutreachCampaign[];
  onAddCampaign: (c: Omit<OutreachCampaign, "id">) => Promise<void>;
  onUpdateCampaign: (id: string, c: Partial<OutreachCampaign>) => Promise<void>;
  onDeleteCampaign: (id: string) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export default function CRMModule({
  companies,
  contacts,
  meetings,
  tasks,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onAddMeeting,
  onUpdateMeeting,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  userRole,
  onSyncState
}: CRMModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"today" | "directory" | "campaigns">("today");
  // Which company's panel is open. One piece of state replaces what used to be
  // two whole tabs (Meetings Register, Action Tasks) plus a contacts screen.
  const [openCompanyId, setOpenCompanyId] = useState<string | null>(null);
  // Set when Today hands off to the list pre-filtered to one pipeline stage.
  const [directoryStage, setDirectoryStage] = useState<PipelineStage | null>(null);
  // Companies or People inside Partners & Leads. Lifted out of CrmDirectory so
  // the header's Import/Export button can offer the right columns.
  const [directoryView, setDirectoryView] = useState<"companies" | "people">("companies");
  // Set when the panel was opened by a "Set next step" button, so it opens in the editor.
  const [openForNextStep, setOpenForNextStep] = useState(false);
  // Which form the create/edit dialog shows. This used to be read off
  // activeSubTab, which only worked while the page tabs happened to be named
  // after record types -- renaming the tabs left the dialog rendering nothing.
  const [modalForm, setModalForm] = useState<"company" | "contact" | "meeting" | "task">("company");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editingSprintId, setEditingSprintId] = useState<string | null>(null);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: "company" | "contact" | "sprint"; id: string; label: string } | null>(null);

  // Search & Filter states
  const [searchCompanyQuery, setSearchCompanyQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");

  const [searchContactQuery, setSearchContactQuery] = useState("");
  const [filterContactCompany, setFilterContactCompany] = useState("");

  // AI Summary States
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [meetingNotesForAI, setMeetingNotesForAI] = useState("");
  const [extractedActionItems, setExtractedActionItems] = useState<string[]>([]);
  const [isExtractingActions, setIsExtractingActions] = useState(false);
  const [addedActionsIndex, setAddedActionsIndex] = useState<number[]>([]);

  // AI Outreach States
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [emailCampaignForm, setEmailCampaignForm] = useState({
    recipientId: "",
    customRecipient: "",
    customCompany: "",
    purpose: "tax_onboarding",
    tone: "Professional",
    language: "English"
  });
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [campaignNotification, setCampaignNotification] = useState<string | null>(null);

  // CRM Add forms state
  const [newCompany, setNewCompany] = useState({
    name: "",
    country: "Uzbekistan",
    industry: "SaaS",
    website: "",
    leadScore: 50,
    status: "LEAD" as any,
    leadSource: "" as any,
    segment: "",
    employeeCountBand: "" as any,
    nextFollowUpDate: "",
    lastContactedDate: "",
    isSuccessStory: false,
    successStoryText: "",
    benefitsPitched: [] as string[],
    competingOptions: ""
  });
  const [newSprint, setNewSprint] = useState<{ name: string; segment: string; startDate: string; endDate: string; companyIds: string[]; notes: string }>({
    name: "",
    segment: "",
    startDate: "",
    endDate: "",
    companyIds: [],
    notes: ""
  });
  const [newContact, setNewContact] = useState({ companyId: "", fullName: "", role: "", email: "", phone: "", linkedInUrl: "", notes: "" });
  const [newMeeting, setNewMeeting] = useState({ title: "", companyId: "", dateTime: "", notes: "" });
  const [newTask, setNewTask] = useState({ title: "", assignedTo: "u-1", dueDate: "", priority: "MEDIUM" as any });

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Calculations for KPI Cards
  const totalLeads = companies.filter(c => c.status === "LEAD").length;
  const activePartners = companies.filter(c => c.status === "PARTNER").length;
  const averageLeadScore = companies.length > 0
    ? Math.round(companies.reduce((sum, c) => sum + c.leadScore, 0) / companies.length)
    : 0;
  const upcomingMeetingsCount = meetings.filter(m => m.status === "SCHEDULED").length;
  // Day 4 training material: "quick response times" + "no lead falls through the cracks"
  const todayISO = new Date().toISOString().split("T")[0];
  const needsFirstResponseCount = companies.filter(c => c.status === "LEAD" && !c.lastContactedDate).length;
  const overdueFollowUpCount = companies.filter(c =>
    c.nextFollowUpDate && c.nextFollowUpDate < todayISO && c.status !== "PARTNER" && c.status !== "INACTIVE"
  ).length;

  // Handle submissions
  const handleAddCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;
    if (editingCompanyId) {
      await onUpdateCompany(editingCompanyId, newCompany);
    } else {
      await onAddCompany(newCompany);
    }
    setShowAddModal(false);
    setEditingCompanyId(null);
    setNewCompany({
      name: "", country: "Uzbekistan", industry: "SaaS", website: "", leadScore: 50, status: "LEAD",
      leadSource: "", segment: "", employeeCountBand: "", nextFollowUpDate: "", lastContactedDate: "",
      isSuccessStory: false, successStoryText: "", benefitsPitched: [], competingOptions: ""
    });
  };

  const handleToggleBenefitPitched = (benefit: string) => {
    setNewCompany(prev => ({
      ...prev,
      benefitsPitched: prev.benefitsPitched.includes(benefit)
        ? prev.benefitsPitched.filter(b => b !== benefit)
        : [...prev.benefitsPitched, benefit]
    }));
  };

  const handleOpenEditCompany = (comp: Company) => {
    setNewCompany({
      name: comp.name,
      country: comp.country,
      industry: comp.industry,
      website: comp.website,
      leadScore: comp.leadScore,
      status: comp.status,
      leadSource: comp.leadSource || "",
      segment: comp.segment || "",
      employeeCountBand: comp.employeeCountBand || "",
      nextFollowUpDate: comp.nextFollowUpDate || "",
      lastContactedDate: comp.lastContactedDate || "",
      isSuccessStory: comp.isSuccessStory || false,
      successStoryText: comp.successStoryText || "",
      benefitsPitched: comp.benefitsPitched || [],
      competingOptions: comp.competingOptions || ""
    });
    setEditingCompanyId(comp.id);
    setActiveSubTab("companies");
    setShowAddModal(true);
  };

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.fullName || !newContact.companyId) return;
    const cmp = companies.find(c => c.id === newContact.companyId);
    const payload = {
      ...newContact,
      companyName: cmp ? cmp.name : "Independent"
    };
    if (editingContactId) {
      await onUpdateContact(editingContactId, payload);
    } else {
      await onAddContact(payload);
    }
    setShowAddModal(false);
    setEditingContactId(null);
    setNewContact({ companyId: "", fullName: "", role: "", email: "", phone: "", linkedInUrl: "", notes: "" });
  };

  const handleOpenEditContact = (con: Contact) => {
    setNewContact({
      companyId: con.companyId,
      fullName: con.fullName,
      role: con.role,
      email: con.email,
      phone: con.phone || "",
      linkedInUrl: con.linkedInUrl || "",
      notes: con.notes || ""
    });
    setEditingContactId(con.id);
    setActiveSubTab("contacts");
    setShowAddModal(true);
  };

  const handleRequestDelete = (kind: "company" | "contact" | "sprint", id: string, label: string) => {
    setDeleteTarget({ kind, id, label });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "company") {
      await onDeleteCompany(deleteTarget.id);
    } else if (deleteTarget.kind === "contact") {
      await onDeleteContact(deleteTarget.id);
    } else {
      await onDeleteCampaign(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  // Outreach Sprints (Campaign entity) handlers
  const handleAddSprintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprint.name || newSprint.companyIds.length === 0) return;
    if (editingSprintId) {
      await onUpdateCampaign(editingSprintId, newSprint);
    } else {
      await onAddCampaign(newSprint);
    }
    setShowSprintModal(false);
    setEditingSprintId(null);
    setNewSprint({ name: "", segment: "", startDate: "", endDate: "", companyIds: [], notes: "" });
  };

  const handleOpenEditSprint = (sprint: OutreachCampaign) => {
    setNewSprint({
      name: sprint.name,
      segment: sprint.segment,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      companyIds: sprint.companyIds,
      notes: sprint.notes || ""
    });
    setEditingSprintId(sprint.id);
    setShowSprintModal(true);
  };

  const handleToggleSprintCompany = (companyId: string) => {
    setNewSprint(prev => ({
      ...prev,
      companyIds: prev.companyIds.includes(companyId)
        ? prev.companyIds.filter(id => id !== companyId)
        : [...prev.companyIds, companyId]
    }));
  };

  // Funnel counts for a sprint: how many attached companies sit at each pipeline stage today
  const getSprintFunnel = (sprint: OutreachCampaign) => {
    const attached = companies.filter(c => sprint.companyIds.includes(c.id));
    return {
      targeted: attached.length,
      contacted: attached.filter(c => c.status === "CONTACTED" || c.status === "NEGOTIATION" || c.status === "PARTNER").length,
      negotiation: attached.filter(c => c.status === "NEGOTIATION" || c.status === "PARTNER").length,
      partner: attached.filter(c => c.status === "PARTNER").length
    };
  };

  const handleAddMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.companyId) return;
    const cmp = companies.find(c => c.id === newMeeting.companyId);
    await onAddMeeting({
      title: newMeeting.title,
      companyId: newMeeting.companyId,
      companyName: cmp ? cmp.name : "Strategic Meeting",
      attendees: ["Hasan Abdukarimov"],
      dateTime: newMeeting.dateTime || new Date().toISOString(),
      notes: newMeeting.notes || "No pre-notes entered.",
      status: "SCHEDULED"
    });
    setShowAddModal(false);
    setNewMeeting({ title: "", companyId: "", dateTime: "", notes: "" });
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    await onAddTask({
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate || new Date().toISOString().split("T")[0],
      priority: newTask.priority,
      status: "TODO"
    });
    setShowAddModal(false);
    setNewTask({ title: "", assignedTo: "u-1", dueDate: "", priority: "MEDIUM" });
  };

  // Summarize meeting notes using server-side Gemini
  const handleGenerateAISummary = async () => {
    if (!selectedMeeting) return;
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/ai/summarize-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedMeeting.title,
          rawNotes: meetingNotesForAI || selectedMeeting.notes
        })
      });
      const data = await response.json();
      if (data.summary) {
        await onUpdateMeeting(selectedMeeting.id, { summary: data.summary });
        setSelectedMeeting({
          ...selectedMeeting,
          summary: data.summary
        });
      } else {
        alert("Summary error: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      alert("Failed to connect with server-side AI summary endpoint.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // AI-powered Action Item Extractor
  const handleExtractActionItems = async () => {
    if (!selectedMeeting) return;
    setIsExtractingActions(true);
    setAddedActionsIndex([]);
    try {
      // Prompt standard workspace message API for bulleted action items
      const targetNotes = meetingNotesForAI || selectedMeeting.summary || selectedMeeting.notes;
      const response = await fetch("/api/ai/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "conv-crm-extractor",
          text: `Extract exactly 3-5 concise, specific operational task action items from the following meeting records. Ensure each starts on a new line with a hyphen (-) and lists a clear, actionable deliverable. Keep them brief.\n\nMeeting Title: ${selectedMeeting.title}\nRecord:\n${targetNotes}`
        })
      });
      const data = await response.json();
      if (data && data.text) {
        // Parse lines starting with hyphens or numbers
        const items = data.text
          .split("\n")
          .map((line: string) => line.trim().replace(/^[-*•\d.]\s*/, ""))
          .filter((line: string) => line.length > 8 && !line.toLowerCase().includes("action item"));
        
        if (items.length > 0) {
          setExtractedActionItems(items.slice(0, 5));
        } else {
          // Robust intelligent rule-based fallback tasks
          setExtractedActionItems([
            `Follow up with ${selectedMeeting.companyName} regarding alignment goals of "${selectedMeeting.title}"`,
            `Draft the preliminary MoU agreement for ${selectedMeeting.companyName} expansion privilege`,
            `Review tax forecast forecasts and schedule deep-dive session`
          ]);
        }
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      // Intelligent rule-based fallback tasks matching the meeting context
      setExtractedActionItems([
        `Follow up with ${selectedMeeting.companyName} regarding alignment goals of "${selectedMeeting.title}"`,
        `Draft the preliminary MoU agreement for ${selectedMeeting.companyName} expansion privilege`,
        `Review tax forecast forecasts and schedule deep-dive session`
      ]);
    } finally {
      setIsExtractingActions(false);
    }
  };

  // Add individual action item as real CRM task
  const handleAddExtractedTask = async (taskTitle: string, index: number) => {
    if (isReadOnly) return;
    try {
      await onAddTask({
        title: taskTitle,
        assignedTo: "u-1", // Hasan Abdukarimov
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 days from now
        priority: "MEDIUM",
        status: "TODO"
      });
      setAddedActionsIndex(prev => [...prev, index]);
    } catch (e) {
      alert("Failed to create task");
    }
  };

  // Generate outreach email campaign
  const handleGenerateOutreachEmail = async () => {
    setIsDraftingEmail(true);
    setGeneratedEmail(null);
    setCampaignNotification(null);

    let recipientName = emailCampaignForm.customRecipient;
    let companyName = emailCampaignForm.customCompany;

    if (emailCampaignForm.recipientId) {
      const selectedCon = contacts.find(c => c.id === emailCampaignForm.recipientId);
      if (selectedCon) {
        recipientName = selectedCon.fullName;
        companyName = selectedCon.companyName;
      }
    }

    let purposeText = "";
    switch (emailCampaignForm.purpose) {
      case "tax_onboarding":
        purposeText = "inviting them to explore Uzbekistan's tax-free IT Park resident regime (0% Corporate and Social taxes, 7.5% Income tax)";
        break;
      case "mou_partnership":
        purposeText = "scheduling an introductory session to establish a strategic MoU on joint high-tech venture setups in Tashkent";
        break;
      case "office_tour":
        purposeText = "organizing a physical/virtual tour of premium workspaces in our Tech Block complexes and coworking incubators";
        break;
      case "bpo_setup":
        purposeText = "providing a customized roadmap to set up a cost-effective BPO/outsourcing remote developer hub in regional centers";
        break;
      default:
        purposeText = emailCampaignForm.purpose || "exploring a strategic technological alliance";
    }

    try {
      const response = await fetch("/api/ai/email-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipientName || "Venture Partner",
          company: companyName || "Uzbekistan Ecosystem Office",
          purpose: purposeText,
          tone: emailCampaignForm.tone,
          language: emailCampaignForm.language
        })
      });
      const data = await response.json();
      if (data && data.draft) {
        // Parse Subject and Body
        const subjectMatch = data.draft.match(/Subject:\s*(.*)/i);
        const subject = subjectMatch ? subjectMatch[1].trim() : "Strategic Collaboration with IT Park Uzbekistan";
        const body = data.draft.replace(/Subject:\s*(.*)/i, "").trim();
        setGeneratedEmail({ subject, body });
      } else {
        alert("Failed to draft email from server-side engine.");
      }
    } catch (e) {
      alert("Failed to connect to email assistant server endpoint.");
    } finally {
      setIsDraftingEmail(false);
    }
  };

  // Execute / simulate sending campaigns and recording outreach task
  const handleExecuteCampaign = async () => {
    if (!generatedEmail || isReadOnly) return;
    
    let recipientName = emailCampaignForm.customRecipient;
    if (emailCampaignForm.recipientId) {
      const selectedCon = contacts.find(c => c.id === emailCampaignForm.recipientId);
      if (selectedCon) recipientName = selectedCon.fullName;
    }
    if (!recipientName) recipientName = "Global Venture Lead";

    try {
      // Auto register a follow-up action check on the task list
      await onAddTask({
        title: `Follow up on Gemini email campaign sent to ${recipientName}`,
        assignedTo: "u-1",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 5 days out
        priority: "HIGH",
        status: "TODO"
      });

      setCampaignNotification(`Outreach campaign dispatched! Follow-up action check successfully integrated into "Action Tasks" panel.`);
      setTimeout(() => setCampaignNotification(null), 8000);
    } catch (e) {
      alert("Failed to dispatch outreach task");
    }
  };

  // Filter logic
  const filteredCompanies = companies.filter(c => {
    const q = searchCompanyQuery.toLowerCase().trim();
    const matchesSearch = (c.name || "").toLowerCase().includes(q) || 
                          (c.industry || "").toLowerCase().includes(q);
    const matchesCountry = filterCountry ? c.country === filterCountry : true;
    const matchesIndustry = filterIndustry ? c.industry === filterIndustry : true;
    return matchesSearch && matchesCountry && matchesIndustry;
  });

  const filteredContacts = contacts.filter(con => {
    const q = searchContactQuery.toLowerCase().trim();
    const matchesSearch = (con.fullName || "").toLowerCase().includes(q) ||
                          (con.role || "").toLowerCase().includes(q) ||
                          (con.email || "").toLowerCase().includes(q);
    const matchesCompany = filterContactCompany ? con.companyId === filterContactCompany : true;
    return matchesSearch && matchesCompany;
  });

  // Unique countries and industries for dropdown options
  const uniqueCountries = Array.from(new Set(companies.map(c => c.country))).filter(Boolean);
  const uniqueIndustries = Array.from(new Set(companies.map(c => c.industry))).filter(Boolean);

  const openCompany = openCompanyId ? companies.find(c => c.id === openCompanyId) || null : null;

  // The badge on the Today tab: everything actually waiting on someone.
  const todoCount = companies.filter(c => needsFirstResponse(c) || isStalled(c)).length;

  const today = () => new Date().toISOString().slice(0, 10);

  /** Open the create/edit dialog on a specific form. */
  const openModal = (form: "company" | "contact" | "meeting" | "task", editId?: string) => {
    setModalForm(form);
    setEditingCompanyId(form === "company" ? editId ?? null : null);
    setEditingContactId(form === "contact" ? editId ?? null : null);
    setShowAddModal(true);
  };

  /** Move a company along the pipeline. Reaching a stage is itself contact. */
  const handleChangeStage = async (company: Company, stage: PipelineStage) => {
    const patch: Partial<Company> = { status: statusForStage(stage) };
    if (stage !== "NEW" && !company.lastContactedDate) patch.lastContactedDate = today();
    await onUpdateCompany(company.id, patch);
  };

  const handleBulkStage = async (list: Company[], stage: PipelineStage) => {
    for (const c of list) await handleChangeStage(c, stage);
  };

  /** Record what happens next -- the field the old module had nowhere for. */
  const handleSaveNextStep = async (company: Company, nextStep: string, followUpDate: string) => {
    await onUpdateCompany(company.id, {
      nextStep: nextStep || undefined,
      nextFollowUpDate: followUpDate || undefined,
    });
  };

  /** One click from the Today queue: they have now been contacted. */
  const handleLogFirstContact = async (company: Company) => {
    await onUpdateCompany(company.id, { status: "CONTACTED", lastContactedDate: today() });
    setOpenCompanyId(company.id);
  };

  const handleToggleTask = async (task: Task) => {
    await onUpdateTask(task.id, { status: task.status === "DONE" ? "TODO" : "DONE" });
  };

  return (
    <div id="crm-module" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 text-white">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold tracking-tight">Outreach & Strategic Relations</h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Overseeing cross-border investment partners, scheduling consultations, drafting campaign sequences, and delegating action checklists.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeSubTab === "directory" && directoryView === "companies" && (
            <ExportImportManager
              module="companies"
              moduleTitle="Partners & Leads"
              data={companies}
              columns={[
                { key: "name", label: "Organization Name", required: true, type: "string" },
                { key: "country", label: "Country", type: "string" },
                { key: "industry", label: "Vertical Industry", type: "string" },
                { key: "website", label: "Website", type: "string" },
                { key: "leadScore", label: "Lead Score", type: "number" },
                { key: "status", label: "Status", type: "string" },
                { key: "nextStep", label: "Next Step", type: "string" },
                { key: "nextFollowUpDate", label: "Follow Up Date", type: "date" },
                { key: "lastContactedDate", label: "Last Contacted", type: "date" }
              ]}
              onImportCompleted={() => onSyncState && onSyncState()}
              userRole={userRole as any}
            />
          )}
          {activeSubTab === "directory" && directoryView === "people" && (
            <ExportImportManager
              module="contacts"
              moduleTitle="People"
              data={contacts}
              columns={[
                { key: "fullName", label: "Full Name", required: true, type: "string" },
                { key: "companyName", label: "Company Name", required: true, type: "string" },
                { key: "role", label: "Role", type: "string" },
                { key: "email", label: "Email", required: true, type: "email" },
                { key: "phone", label: "Phone", type: "phone" },
                { key: "linkedInUrl", label: "LinkedIn URL", type: "string" },
                { key: "notes", label: "Notes", type: "string" }
              ]}
              onImportCompleted={() => onSyncState && onSyncState()}
              userRole={userRole as any}
            />
          )}

          {!isReadOnly && activeSubTab !== "campaigns" && (
            <button
              id="crm-add-btn"
              onClick={() => openModal(activeSubTab === "directory" && directoryView === "people" ? "contact" : "company")}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-500/10 h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>{activeSubTab === "directory" && directoryView === "people" ? "Add contact" : "Add CRM Entry"}</span>
            </button>
          )}
        </div>
      </div>

      {/* CRM sub-navigation. Six tabs became three: the two that were always
          empty (Meetings Register, Action Tasks) now live inside a company's
          own panel, and Global Contacts became a People switch inside Partners
          & Leads. */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          id="crm-tab-today"
          onClick={() => setActiveSubTab("today")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === "today" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Today</span>
          {todoCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-px rounded-full ml-0.5">{todoCount}</span>
          )}
        </button>
        <button
          id="crm-tab-companies"
          onClick={() => setActiveSubTab("directory")}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${activeSubTab === "directory" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
        >
          Partners &amp; Leads
        </button>
        <button
          id="crm-tab-campaigns"
          onClick={() => { setActiveSubTab("campaigns"); setGeneratedEmail(null); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${activeSubTab === "campaigns" ? "bg-indigo-600 text-white shadow-sm" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Outreach Assistant</span>
        </button>
      </div>

      {/* TODAY: the work queues */}
      {activeSubTab === "today" && (
        <CrmToday
          companies={companies}
          contacts={contacts}
          meetings={meetings}
          tasks={tasks}
          isReadOnly={isReadOnly}
          onOpenCompany={setOpenCompanyId}
          onLogFirstContact={handleLogFirstContact}
          onSetNextStep={(c) => { setOpenCompanyId(c.id); setOpenForNextStep(true); }}
          onToggleTask={handleToggleTask}
          onGoToStage={(stage) => { setDirectoryStage(stage); setActiveSubTab("directory"); }}
          onAddTask={() => openModal("task")}
          onScheduleMeeting={() => openModal("meeting")}
        />
      )}

      {/* PARTNERS & LEADS: pipeline, filters, and the companies or people list */}
      {activeSubTab === "directory" && (
        <CrmDirectory
          companies={companies}
          contacts={contacts}
          isReadOnly={isReadOnly}
          initialStage={directoryStage}
          view={directoryView}
          onViewChange={setDirectoryView}
          onOpenCompany={setOpenCompanyId}
          onChangeStage={handleChangeStage}
          onBulkStage={handleBulkStage}
          onSetNextStep={(c) => { setOpenCompanyId(c.id); setOpenForNextStep(true); }}
          onEditCompany={(id) => openModal("company", id)}
          onDeleteCompany={(c) => setDeleteTarget({ kind: "company", id: c.id, label: c.name })}
          onEditContact={(id) => openModal("contact", id)}
          onDeleteContact={(c) => setDeleteTarget({ kind: "contact", id: c.id, label: c.fullName })}
          onAddMeeting={() => openModal("meeting")}
        />
      )}

      {/* COMPANY PANEL: meetings, tasks, contacts and the next step, in context */}
      {openCompany && (
        <CrmCompanyPanel
          company={openCompany}
          contacts={contacts}
          meetings={meetings}
          tasks={tasks}
          isReadOnly={isReadOnly}
          autoEditNextStep={openForNextStep}
          onClose={() => { setOpenCompanyId(null); setOpenForNextStep(false); }}
          onChangeStage={handleChangeStage}
          onSaveNextStep={handleSaveNextStep}
          onAddMeeting={() => openModal("meeting")}
          onAddTask={() => openModal("task")}
          onEditCompany={(id) => openModal("company", id)}
          onEditContact={(id) => openModal("contact", id)}
          onAddContact={() => openModal("contact")}
        />
      )}

      {/* OUTREACH SPRINT CREATE/EDIT MODAL */}
      {showSprintModal && (
        <div id="crm-sprint-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Rocket className="w-4 h-4 text-indigo-600" />
                {editingSprintId ? "Edit Outreach Sprint" : "New Outreach Sprint"}
              </h2>
              <button onClick={() => { setShowSprintModal(false); setEditingSprintId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSprintSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sprint Name *</label>
                <input
                  id="form-sprint-name"
                  type="text"
                  required
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                  placeholder="e.g. Q4 Fintech Push - GCC"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Segment</label>
                <input
                  id="form-sprint-segment"
                  type="text"
                  value={newSprint.segment}
                  onChange={(e) => setNewSprint({ ...newSprint, segment: e.target.value })}
                  placeholder="e.g. Mid-sized fintech software firms in Germany"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date</label>
                  <input
                    id="form-sprint-start"
                    type="date"
                    value={newSprint.startDate}
                    onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">End Date</label>
                  <input
                    id="form-sprint-end"
                    type="date"
                    value={newSprint.endDate}
                    onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Attached Companies *</label>
                <div className="border border-slate-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-slate-100">
                  {companies.length > 0 ? companies.map(c => (
                    <label key={c.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] text-slate-600 font-medium cursor-pointer hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={newSprint.companyIds.includes(c.id)}
                        onChange={() => handleToggleSprintCompany(c.id)}
                        className="rounded border-slate-300"
                      />
                      <span className="flex-1">{c.name}</span>
                      <span className="text-slate-400">{c.status}</span>
                    </label>
                  )) : (
                    <p className="px-2.5 py-3 text-slate-400 italic text-[11px]">No companies to attach yet.</p>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{newSprint.companyIds.length} selected</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  id="form-sprint-notes"
                  value={newSprint.notes}
                  onChange={(e) => setNewSprint({ ...newSprint, notes: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-lg resize-none"
                />
              </div>
              <button id="submit-sprint-btn" type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">
                {editingSprintId ? "Save Changes" : "Launch Sprint"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. AI OUTREACH CAMPAIGN WRITER SUB-TAB */}
      {activeSubTab === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Campaign Config Form */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl lg:col-span-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure Outreach Campaign</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Contact Profile</label>
                <select
                  value={emailCampaignForm.recipientId}
                  onChange={(e) => {
                    const rId = e.target.value;
                    setEmailCampaignForm(prev => ({
                      ...prev,
                      recipientId: rId,
                      customRecipient: rId ? "" : prev.customRecipient,
                      customCompany: rId ? "" : prev.customCompany
                    }));
                  }}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="">-- Or enter custom prospect --</option>
                  {contacts.map(con => (
                    <option key={con.id} value={con.id}>{con.fullName} ({con.companyName})</option>
                  ))}
                </select>
              </div>

              {!emailCampaignForm.recipientId && (
                <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={emailCampaignForm.customRecipient}
                      onChange={(e) => setEmailCampaignForm({ ...emailCampaignForm, customRecipient: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company / Partner</label>
                    <input
                      type="text"
                      placeholder="e.g. Plug and Play"
                      value={emailCampaignForm.customCompany}
                      onChange={(e) => setEmailCampaignForm({ ...emailCampaignForm, customCompany: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Campaign Goal / Theme</label>
                <select
                  value={emailCampaignForm.purpose}
                  onChange={(e) => setEmailCampaignForm({ ...emailCampaignForm, purpose: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="tax_onboarding">Uzbekistan Tax-Free IT Resident Regime</option>
                  <option value="mou_partnership">Establish Strategic MoU On Venture Setup</option>
                  <option value="office_tour">Schedule Complex Office & Coworking Tour</option>
                  <option value="bpo_setup">Establish Region Developer BPO Center</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Communication Tone</label>
                  <select
                    value={emailCampaignForm.tone}
                    onChange={(e) => setEmailCampaignForm({ ...emailCampaignForm, tone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Professional">Professional & Formal</option>
                    <option value="Bold">Bold & Innovative</option>
                    <option value="Warm">Warm & Welcoming</option>
                    <option value="Diplomatic">Diplomatic</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preferred Language</label>
                  <select
                    value={emailCampaignForm.language}
                    onChange={(e) => setEmailCampaignForm({ ...emailCampaignForm, language: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Uzbek">O'zbekcha (Uzbek)</option>
                    <option value="Russian">Русский (Russian)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateOutreachEmail}
                disabled={isDraftingEmail || (!emailCampaignForm.recipientId && !emailCampaignForm.customRecipient)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{isDraftingEmail ? "Formulating Template..." : "Draft Outreach Email via Gemini"}</span>
              </button>
            </div>
          </div>

          {/* Generated Template Output Block */}
          <div className="lg:col-span-7 space-y-4">
            {campaignNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 animate-in slide-in-from-top-4">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{campaignNotification}</span>
              </div>
            )}

            {generatedEmail ? (
              <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden shadow-xl border border-slate-800 animate-in fade-in">
                {/* Inbox Client Header Style */}
                <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-400 font-mono pl-3">Outreach Campaign Dispatcher</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const copyText = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
                        navigator.clipboard.writeText(copyText);
                        setCopyFeedback(true);
                        setTimeout(() => setCopyFeedback(false), 2000);
                      }}
                      className="p-1.5 hover:bg-slate-700 text-slate-300 rounded transition-colors flex items-center gap-1 text-[10px]"
                      title="Copy full campaign text"
                    >
                      {copyFeedback ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Fields Panel */}
                <div className="px-5 py-4 border-b border-slate-800/50 space-y-2 text-xs text-slate-300 bg-slate-900/50">
                  <div className="flex">
                    <span className="text-slate-500 w-16 uppercase font-mono font-bold tracking-wider">Subject:</span>
                    <span className="text-white font-semibold">{generatedEmail.subject}</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-6 text-xs text-slate-200 leading-relaxed font-sans max-h-96 overflow-y-auto whitespace-pre-line border-b border-slate-800/50">
                  {generatedEmail.body}
                </div>

                {/* Launch Action */}
                {!isReadOnly && (
                  <div className="p-4 bg-slate-950 flex justify-end gap-3">
                    <button
                      onClick={handleExecuteCampaign}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log & Register Outreach Follow-up</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-400 bg-slate-50/50 flex flex-col items-center justify-center space-y-3 h-full min-h-[300px]">
                <BrainCircuit className="w-8 h-8 text-slate-300" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">Awaiting AI Campaign Parameter Selection</p>
                  <p className="text-[10px] text-slate-400 max-w-xs">Select target contacts, designate language preference, and click generate to design a highly personalized investment template via Gemini.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG CRM CREATION FORM MODAL */}
      {showAddModal && (
        <div id="crm-creation-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingCompanyId ? "Edit Partner Company Profile" : editingContactId ? "Edit Contact Profile" : "Create CRM Outreach File"}
              </h2>
              <button onClick={() => { setShowAddModal(false); setEditingCompanyId(null); setEditingContactId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR FOR CREATION TYPE (hidden while editing an existing record) */}
            {!editingCompanyId && !editingContactId && (
              <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-2 text-[10px] font-bold uppercase text-slate-400 text-center">
                <button onClick={() => setModalForm("company")} className={`pb-1 ${modalForm === "company" ? "border-b-2 border-slate-800 text-slate-800" : ""}`}>Partner</button>
                <button onClick={() => setModalForm("contact")} className={`pb-1 ${modalForm === "contact" ? "border-b-2 border-slate-800 text-slate-800" : ""}`}>Contact</button>
                <button onClick={() => setModalForm("meeting")} className={`pb-1 ${modalForm === "meeting" ? "border-b-2 border-slate-800 text-slate-800" : ""}`}>Meeting</button>
                <button onClick={() => setModalForm("task")} className={`pb-1 ${modalForm === "task" ? "border-b-2 border-slate-800 text-slate-800" : ""}`}>Task</button>
              </div>
            )}

            {/* 1. COMPANYS FORM */}
            {modalForm === "company" && (
              <form onSubmit={handleAddCompanySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company / Partner Name *</label>
                  <input
                    id="form-comp-name"
                    type="text"
                    required
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="e.g. Stripe, Plug and Play"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Country</label>
                    <input
                      id="form-comp-country"
                      type="text"
                      value={newCompany.country}
                      onChange={(e) => setNewCompany({ ...newCompany, country: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Industry</label>
                    <input
                      id="form-comp-industry"
                      type="text"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead score (1-100)</label>
                    <input
                      id="form-comp-score"
                      type="number"
                      min="1"
                      max="100"
                      value={newCompany.leadScore}
                      onChange={(e) => setNewCompany({ ...newCompany, leadScore: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Website URL</label>
                    <input
                      id="form-comp-web"
                      type="text"
                      value={newCompany.website}
                      onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pipeline Status</label>
                  <select
                    id="form-comp-status"
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="LEAD">LEAD</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="PARTNER">PARTNER</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-3.5">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Lead Intelligence & Follow-up</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Source</label>
                      <select
                        id="form-comp-source"
                        value={newCompany.leadSource}
                        onChange={(e) => setNewCompany({ ...newCompany, leadSource: e.target.value as any })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white cursor-pointer"
                      >
                        <option value="">-- Unspecified --</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral - Resident">Referral - Resident</option>
                        <option value="Referral - Partner">Referral - Partner</option>
                        <option value="Event / Forum">Event / Forum</option>
                        <option value="Consulting Firm">Consulting Firm</option>
                        <option value="Inbound">Inbound</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Employee Count</label>
                      <select
                        id="form-comp-headcount"
                        value={newCompany.employeeCountBand}
                        onChange={(e) => setNewCompany({ ...newCompany, employeeCountBand: e.target.value as any })}
                        className="w-full p-2 border border-slate-200 rounded-lg bg-white cursor-pointer"
                      >
                        <option value="">-- Unspecified --</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-250">51-250</option>
                        <option value="251-1000">251-1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Segment</label>
                    <input
                      id="form-comp-segment"
                      type="text"
                      value={newCompany.segment}
                      onChange={(e) => setNewCompany({ ...newCompany, segment: e.target.value })}
                      placeholder="e.g. Tech Startup, BPO Provider, Fintech"
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Last Contacted</label>
                      <input
                        id="form-comp-lastcontact"
                        type="date"
                        value={newCompany.lastContactedDate}
                        onChange={(e) => setNewCompany({ ...newCompany, lastContactedDate: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Next Follow-up</label>
                      <input
                        id="form-comp-nextfollowup"
                        type="date"
                        value={newCompany.nextFollowUpDate}
                        onChange={(e) => setNewCompany({ ...newCompany, nextFollowUpDate: e.target.value })}
                        className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Benefits Pitched</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {CRM_BENEFITS_PITCHED_OPTIONS.map(benefit => (
                        <label key={benefit} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newCompany.benefitsPitched.includes(benefit)}
                            onChange={() => handleToggleBenefitPitched(benefit)}
                            className="rounded border-slate-300"
                          />
                          {benefit}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Competing Options</label>
                    <textarea
                      id="form-comp-competitors"
                      value={newCompany.competingOptions}
                      onChange={(e) => setNewCompany({ ...newCompany, competingOptions: e.target.value })}
                      placeholder="Other countries / parks this lead is comparing us against"
                      rows={2}
                      className="w-full p-2 border border-slate-200 rounded-lg resize-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] text-slate-600 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCompany.isSuccessStory}
                        onChange={(e) => setNewCompany({ ...newCompany, isSuccessStory: e.target.checked })}
                        className="rounded border-slate-300"
                      />
                      Usable Success Story / Case Study on file
                    </label>
                    {newCompany.isSuccessStory && (
                      <textarea
                        id="form-comp-successstory"
                        value={newCompany.successStoryText}
                        onChange={(e) => setNewCompany({ ...newCompany, successStoryText: e.target.value })}
                        placeholder="Short testimonial / case study summary for marketing use"
                        rows={3}
                        className="w-full mt-1.5 p-2 border border-slate-200 rounded-lg resize-none"
                      />
                    )}
                  </div>
                </div>

                <button id="submit-comp-btn" type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">
                  {editingCompanyId ? "Save Changes" : "Register Company Leads"}
                </button>
              </form>
            )}

            {/* 2. CONTACT FORM */}
            {modalForm === "contact" && (
              <form onSubmit={handleAddContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Affiliated Partner Company *</label>
                  <select
                    id="form-con-comp"
                    required
                    value={newContact.companyId}
                    onChange={(e) => setNewContact({ ...newContact, companyId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="">-- Select Partner --</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
                  <input
                    id="form-con-name"
                    type="text"
                    required
                    value={newContact.fullName}
                    onChange={(e) => setNewContact({ ...newContact, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role / Designation *</label>
                  <input
                    id="form-con-role"
                    type="text"
                    required
                    value={newContact.role}
                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    placeholder="VP of Expansion"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email address *</label>
                    <input
                      id="form-con-email"
                      type="email"
                      required
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn profile URL</label>
                    <input
                      id="form-con-li"
                      type="url"
                      value={newContact.linkedInUrl}
                      onChange={(e) => setNewContact({ ...newContact, linkedInUrl: e.target.value })}
                      placeholder="https://linkedin..."
                      className="w-full p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone number</label>
                  <input
                    id="form-con-phone"
                    type="text"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+998 9..."
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notes</label>
                  <textarea
                    id="form-con-notes"
                    value={newContact.notes}
                    onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                    rows={2}
                    placeholder="Relationship context, preferences, follow-up notes..."
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <button id="submit-con-btn" type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">
                  {editingContactId ? "Save Changes" : "Register Contact Profile"}
                </button>
              </form>
            )}

            {/* 3. MEETINGS FORM */}
            {modalForm === "meeting" && (
              <form onSubmit={handleAddMeetingSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Affiliated Company / Partner *</label>
                  <select
                    id="form-meet-comp"
                    required
                    value={newMeeting.companyId}
                    onChange={(e) => setNewMeeting({ ...newMeeting, companyId: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="">-- Select Partner --</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Meeting Agenda / Title *</label>
                  <input
                    id="form-meet-title"
                    type="text"
                    required
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="MoU alignment session..."
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Scheduled Date & Time *</label>
                  <input
                    id="form-meet-date"
                    type="datetime-local"
                    required
                    value={newMeeting.dateTime}
                    onChange={(e) => setNewMeeting({ ...newMeeting, dateTime: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Meeting pre-notes</label>
                  <textarea
                    id="form-meet-notes"
                    rows={2}
                    value={newMeeting.notes}
                    onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                    placeholder="Agenda targets..."
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <button id="submit-meet-btn" type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">Register Meeting Ticket</button>
              </form>
            )}

            {/* 4. TASK FORM */}
            {modalForm === "task" && (
              <form onSubmit={handleAddTaskSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Task Action Description *</label>
                  <input
                    id="form-task-title"
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Verify EPAM audit invoices"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Due Date</label>
                    <input
                      id="form-task-due"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                    <select
                      id="form-task-priority"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white cursor-pointer font-bold"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>
                <button id="submit-task-btn" type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer">Post Task Check</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG (companies & contacts) */}
      {deleteTarget && (
        <div id="crm-delete-confirm-dialog" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {deleteTarget.kind === "company" ? "Confirm Partner Company Deletion" : deleteTarget.kind === "contact" ? "Confirm Contact Deletion" : "Confirm Sprint Deletion"}
                </h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Are you sure you want to permanently delete {deleteTarget.kind === "company" ? "partner company" : deleteTarget.kind === "contact" ? "contact" : "outreach sprint"}{" "}
                  <strong className="text-slate-700">"{deleteTarget.label}"</strong>?
                  {deleteTarget.kind === "company" && " Any contacts, meetings, or tasks linked to this company will remain on record but will no longer show a matched company name."}
                  {" "}This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-red-600/10"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
