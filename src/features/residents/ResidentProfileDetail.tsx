/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  ChevronLeft, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  ShieldCheck, 
  FileCheck, 
  Calendar, 
  TrendingUp, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckSquare, 
  Plus, 
  Check, 
  MessageSquare, 
  Trash2, 
  Upload, 
  Download, 
  Award,
  Save,
  Send,
  History,
  Image,
  Clock,
  Briefcase,
  Pencil,
  X
} from "lucide-react";
import { 
  Resident, 
  ResidentStatus, 
  ResidentMonitoringVisit, 
  ResidentQuarterlyReport, 
  ResidentDocument, 
  ResidentMeeting, 
  ResidentTask, 
  ResidentHistoryLog,
  KASHKADARYA_DISTRICTS
} from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentProfileDetailProps {
  resident: Resident;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole: string;
}

type TabType = 
  | "overview" 
  | "monitoring" 
  | "reports" 
  | "documents" 
  | "meetings" 
  | "tasks" 
  | "notes" 
  | "timeline";

export default function ResidentProfileDetail({ 
  resident, 
  onClose, 
  onUpdate, 
  userRole 
}: ResidentProfileDetailProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Local state forms
  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");

  const [newVisit, setNewVisit] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    officer: "Dilnoza Alimova",
    problems: "",
    priority: "LOW" as "LOW" | "MEDIUM" | "HIGH",
    recommendations: "",
    status: "RESOLVED" as "RESOLVED" | "PENDING" | "CRITICAL"
  });

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // --- Edit Profile ---
  const AVAILABLE_BENEFITS = [
    "0% Corporate Income Tax",
    "7.5% Personal Income Tax",
    "0% Customs Duty",
    "0% Value Added Tax"
  ];

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    companyName: resident.companyName || "",
    director: resident.director || "",
    registrationNumber: resident.registrationNumber || "",
    legalAddress: resident.legalAddress || "",
    district: resident.district || "Qarshi",
    industry: resident.industry || "",
    activityType: resident.activityType || "",
    employeesCount: resident.employeesCount || 0,
    exportVolume: resident.exportVolume || 0,
    domesticVolume: resident.domesticVolume || 0,
    email: resident.email || "",
    phone: resident.phone || "",
    website: resident.website || "",
    telegram: resident.telegram || "",
    linkedIn: resident.linkedIn || "",
    assignedManager: resident.assignedManager || "",
    status: resident.status,
    benefitsApplied: resident.benefitsApplied || []
  });

  const handleOpenEditModal = () => {
    setEditForm({
      companyName: resident.companyName || "",
      director: resident.director || "",
      registrationNumber: resident.registrationNumber || "",
      legalAddress: resident.legalAddress || "",
      district: resident.district || "Qarshi",
      industry: resident.industry || "",
      activityType: resident.activityType || "",
      employeesCount: resident.employeesCount || 0,
      exportVolume: resident.exportVolume || 0,
      domesticVolume: resident.domesticVolume || 0,
      email: resident.email || "",
      phone: resident.phone || "",
      website: resident.website || "",
      telegram: resident.telegram || "",
      linkedIn: resident.linkedIn || "",
      assignedManager: resident.assignedManager || "",
      status: resident.status,
      benefitsApplied: resident.benefitsApplied || []
    });
    setShowEditModal(true);
  };

  const toggleEditBenefit = (b: string) => {
    setEditForm((prev) => ({
      ...prev,
      benefitsApplied: prev.benefitsApplied.includes(b)
        ? prev.benefitsApplied.filter((x) => x !== b)
        : [...prev.benefitsApplied, b]
    }));
  };

  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Updated resident profile (Enterprise Registry Data)`,
      userId: "u-1",
      userName: "Dilnoza Alimova",
      timestamp: new Date().toISOString().split("T")[0]
    };

    await onUpdate(resident.id, {
      ...editForm,
      historyLogs: [log, ...(resident.historyLogs || [])]
    });
    setShowEditModal(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const notesList = resident.notes || [];
    const updatedNotes = [...notesList, newNote.trim()];

    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Added profile discussion note: "${newNote.trim().slice(0, 30)}..."`,
      userId: "u-1",
      userName: "Dilnoza Alimova",
      timestamp: new Date().toISOString().split("T")[0]
    };

    await onUpdate(resident.id, {
      notes: updatedNotes,
      historyLogs: [log, ...(resident.historyLogs || [])]
    });
    setNewNote("");
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const taskList = resident.tasks || [];
    const newTask: ResidentTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedTo: "Resident Officer",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: "MEDIUM",
      status: "TODO"
    };

    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Created audit checklist task: "${newTaskTitle.trim()}"`,
      userId: "u-1",
      userName: "Dilnoza Alimova",
      timestamp: new Date().toISOString().split("T")[0]
    };

    await onUpdate(resident.id, {
      tasks: [...taskList, newTask],
      historyLogs: [log, ...(resident.historyLogs || [])]
    });
    setNewTaskTitle("");
  };

  const handleToggleTask = async (taskId: string) => {
    const taskList = resident.tasks || [];
    const updatedTasks = taskList.map(task => {
      if (task.id === taskId) {
        return { ...task, status: task.status === "DONE" ? "TODO" as const : "DONE" as const };
      }
      return task;
    });

    await onUpdate(resident.id, { tasks: updatedTasks });
  };

  const handleAddMeeting = async () => {
    if (!newMeetingTitle.trim() || !newMeetingDate) return;
    const meetingsList = resident.meetings || [];
    const newMeeting: ResidentMeeting = {
      id: `meet-${Date.now()}`,
      title: newMeetingTitle.trim(),
      dateTime: newMeetingDate,
      notes: "CRM scheduled video conference.",
      status: "SCHEDULED"
    };

    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Scheduled compliance meeting: "${newMeetingTitle.trim()}"`,
      userId: "u-1",
      userName: "Dilnoza Alimova",
      timestamp: new Date().toISOString().split("T")[0]
    };

    await onUpdate(resident.id, {
      meetings: [...meetingsList, newMeeting],
      historyLogs: [log, ...(resident.historyLogs || [])]
    });
    setNewMeetingTitle("");
    setNewMeetingDate("");
  };

  const handleAddInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.problems.trim()) {
      alert("Please enter inspection details.");
      return;
    }

    const visitItem: ResidentMonitoringVisit = {
      id: `mon-${Date.now()}`,
      visitDate: newVisit.visitDate,
      officer: newVisit.officer,
      problems: newVisit.problems,
      priority: newVisit.priority,
      recommendations: newVisit.recommendations || "N/A",
      photos: [],
      status: newVisit.status,
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    };

    const logs = resident.monitoringHistory || [];
    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Logged on-site inspection visit. Problems: ${newVisit.problems.slice(0, 30)}`,
      userId: "u-1",
      userName: newVisit.officer,
      timestamp: newVisit.visitDate
    };

    await onUpdate(resident.id, {
      monitoringHistory: [visitItem, ...logs],
      historyLogs: [log, ...(resident.historyLogs || [])]
    });

    setNewVisit({
      visitDate: new Date().toISOString().split("T")[0],
      officer: "Dilnoza Alimova",
      problems: "",
      priority: "LOW",
      recommendations: "",
      status: "RESOLVED"
    });
  };

  const handleMockUpload = async () => {
    const docName = prompt("Enter file name to upload (mock drag-and-drop):", "export_contracts_2026.pdf");
    if (!docName) return;

    const docList = resident.docFiles || [];
    const newDoc: ResidentDocument = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docName.split('.').pop()?.toUpperCase() || "PDF",
      uploadedAt: new Date().toISOString().split("T")[0]
    };

    const log: ResidentHistoryLog = {
      id: `hist-${Date.now()}`,
      action: `Uploaded legal document: "${docName}"`,
      userId: "u-1",
      userName: "Dilnoza Alimova",
      timestamp: new Date().toISOString().split("T")[0]
    };

    await onUpdate(resident.id, {
      docFiles: [...docList, newDoc],
      historyLogs: [log, ...(resident.historyLogs || [])]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* breadcrumb back button */}
      <button
        id="profile-back-btn"
        onClick={onClose}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer select-none transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Resident Tracker</span>
      </button>

      {/* CRM Dynamic Lead Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">{resident.companyName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono font-medium">
              <span>INN: {resident.registrationNumber}</span>
              <span>•</span>
              <span>Director: {resident.director}</span>
              <span>•</span>
              <span>Industry: {resident.industry || "Software Dev"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wide select-none ${
            resident.status === ResidentStatus.ACTIVE ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
            resident.status === ResidentStatus.PENDING ? "bg-amber-50 text-amber-700 border-amber-100" :
            "bg-slate-50 text-slate-500 border-slate-200"
          }`}>
            {resident.status}
          </span>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full select-none font-bold">
            Owner: {resident.assignedManager || "Dilnoza Alimova"}
          </span>
          {!isReadOnly && (
            <button
              id="resident-edit-profile-btn"
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-lg cursor-pointer shadow-md transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile sub-tab selector */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-bold scrollbar-none select-none">
        {[
          { id: "overview", label: "Overview" },
          { id: "monitoring", label: "Monitoring Visits" },
          { id: "reports", label: "Quarterly Reports" },
          { id: "documents", label: "Documents Manager" },
          { id: "meetings", label: "Meetings log" },
          { id: "tasks", label: "Checklist Tasks" },
          { id: "notes", label: "Auditor Notepad" },
          { id: "timeline", label: "Timeline logs" }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`profile-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive ? "border-emerald-600 text-emerald-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs panels container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        
        {/* OVERVIEW PANEL */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Left section: Registry details */}
            <div className="md:col-span-2 space-y-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">Enterprise Registry Data</h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Director</span>
                  <span className="text-slate-700 block mt-0.5">{resident.director}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INN (9-digit Tax Code)</span>
                  <span className="text-slate-700 font-mono font-bold block mt-0.5">{resident.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Legal Address</span>
                  <span className="text-slate-700 block mt-0.5">{resident.legalAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered District</span>
                  <span className="text-slate-700 block mt-0.5">{resident.district || "Mirzo Ulugbek District"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
                  <span className="text-slate-700 block mt-0.5">{resident.email || "info@itcompany.uz"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Phone</span>
                  <span className="text-slate-700 block mt-0.5">{resident.phone || "+998 71 123 4567"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Corporate Website</span>
                  <a href={resident.website || "#"} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 mt-0.5">
                    <span>{resident.website || "https://itcompany.uz"}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Staff Headcount</span>
                  <span className="text-slate-700 font-mono font-bold block mt-0.5">{resident.employeesCount || 5} employees</span>
                </div>
              </div>

              {/* Photos Panel */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">On-Site Office Photos</span>
                <div className="grid grid-cols-3 gap-3">
                  {(resident.photos || []).map((p, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-50">
                      <img src={p} alt="office" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {!isReadOnly && (
                    <button
                      onClick={() => alert("Upload photo action triggered.")}
                      className="border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-all text-slate-400 text-[10px] cursor-pointer h-28"
                    >
                      <Image className="w-5 h-5 text-slate-300" />
                      <span>Upload Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Benefits applied list */}
            <div className="space-y-4 md:col-span-1 border-l border-slate-100 md:pl-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">Legislative Tax Privileges</h3>
              
              <div className="space-y-3">
                {resident.benefitsApplied && resident.benefitsApplied.length > 0 ? (
                  resident.benefitsApplied.map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-semibold leading-relaxed">{b}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 py-1">
                    <AlertTriangle className="w-4 h-4 text-slate-300" />
                    <span>No tax benefits registered for potential CRM leads.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MONITORING PANEL */}
        {activeTab === "monitoring" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* inspection logging form */}
            {!isReadOnly && (
              <form onSubmit={handleAddInspection} className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Log On-Site Compliance Audit</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Date</label>
                    <input
                      type="date"
                      value={newVisit.visitDate}
                      onChange={(e) => setNewVisit({ ...newVisit, visitDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inspector Officer</label>
                    <input
                      type="text"
                      value={newVisit.officer}
                      onChange={(e) => setNewVisit({ ...newVisit, officer: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgency Level</label>
                    <select
                      value={newVisit.priority}
                      onChange={(e) => setNewVisit({ ...newVisit, priority: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Status</label>
                    <select
                      value={newVisit.status}
                      onChange={(e) => setNewVisit({ ...newVisit, status: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="RESOLVED">Resolved</option>
                      <option value="PENDING">Re-Visit Pending</option>
                      <option value="CRITICAL">Critical Violation</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problems Identified *</label>
                    <input
                      type="text"
                      required
                      value={newVisit.problems}
                      onChange={(e) => setNewVisit({ ...newVisit, problems: e.target.value })}
                      placeholder="Describe any legal violations or floor plan layout problems..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actionable recommendations</label>
                    <input
                      type="text"
                      value={newVisit.recommendations}
                      onChange={(e) => setNewVisit({ ...newVisit, recommendations: e.target.value })}
                      placeholder="Enter guidelines e.g. submit correct audits within 10 days"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Submit Visit log</span>
                  </button>
                </div>
              </form>
            )}

            {/* List timeline */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">Historical Inspection Visit Log</h3>
              
              {resident.monitoringHistory && resident.monitoringHistory.length > 0 ? (
                resident.monitoringHistory.map((visit) => (
                  <div key={visit.id} className="border border-slate-100 hover:border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-3 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          visit.status === "RESOLVED" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700 animate-pulse"
                        }`}>
                          {visit.status}
                        </span>
                        <span className="font-bold text-slate-700 font-mono text-[10px]">{visit.visitDate}</span>
                        <span className="text-slate-400 text-[10px]">by {visit.officer}</span>
                      </div>
                      <p className="font-semibold text-slate-600 leading-relaxed mt-1">Audit Notes: {visit.problems}</p>
                      <p className="text-slate-500 font-medium italic">Guidelines: {visit.recommendations}</p>
                    </div>

                    <div className="shrink-0 flex items-center md:items-end justify-between md:flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">Follow-Up: {visit.followUpDate}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        visit.priority === "HIGH" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"
                      }`}>
                        {visit.priority} Priority
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-8 border border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-slate-300" />
                  <span>No physical audit inspections logged for this resident enterprise.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REPORTS PANEL */}
        {activeTab === "reports" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quarterly Declaration Audits</h3>
                <span className="text-[10px] text-slate-400 block font-semibold">Financial, export, and employment filings submitted by {resident.companyName}.</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {(resident.quarterlyReports || []).length} Filed Reports
              </span>
            </div>
            
            {(resident.quarterlyReports && resident.quarterlyReports.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resident.quarterlyReports.map((rep) => (
                  <div key={`${rep.quarter}-${rep.year}`} className="border border-slate-200 bg-white p-4 rounded-xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 text-xs block">{rep.quarter} {rep.year} Financial Declaration</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono font-medium">
                          <span>Deadline: {rep.deadline}</span>
                          <span>&bull;</span>
                          <span>Reviewed: {rep.submittedDate || "Not reviewed"}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase border ${
                        rep.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        rep.status === "SUBMITTED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        rep.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                        "bg-slate-50 text-slate-400 border-slate-200"
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-sans font-bold uppercase">IT Exports</span>
                        <span className="font-bold text-emerald-600">${(rep.reportedExportVolume || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-sans font-bold uppercase">Domestic</span>
                        <span className="font-bold text-indigo-600">${(rep.reportedDomesticVolume || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-sans font-bold uppercase">Staff</span>
                        <span className="font-bold text-slate-700">{rep.reportedEmployeesCount || 0} jobs</span>
                      </div>
                    </div>

                    {rep.taxesSaved ? (
                      <div className="text-[10px] text-amber-700 bg-amber-50/60 border border-amber-100 px-2.5 py-1 rounded-md font-medium flex justify-between items-center">
                        <span>Tax Privileges Saved:</span>
                        <strong className="font-mono">${rep.taxesSaved.toLocaleString()}</strong>
                      </div>
                    ) : null}

                    {rep.exportCountries && rep.exportCountries.length > 0 && (
                      <div className="text-[10px] text-slate-500 font-medium">
                        <span className="font-bold text-slate-600">Export Markets: </span>
                        <span>{rep.exportCountries.join(", ")}</span>
                      </div>
                    )}

                    {rep.comments && (
                      <p className="text-[10px] text-slate-600 font-medium italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong className="not-italic text-slate-700">Auditor Note: </strong>
                        {rep.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex flex-col items-center justify-center gap-2 py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-300" />
                <span className="font-medium text-slate-500">No quarterly declarations logged yet for this enterprise.</span>
                <span className="text-[11px] text-slate-400">Quarterly reports can be applied and audited from the Quarterly Reports module.</span>
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTS PANEL */}
        {activeTab === "documents" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Files Manager</h3>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleMockUpload}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all uppercase"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(resident.docFiles || []).map((doc) => (
                <div key={doc.id} className="border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs bg-slate-50/20">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
                    <div className="overflow-hidden space-y-0.5">
                      <span className="font-extrabold text-slate-700 block truncate" title={doc.name}>{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono font-bold">{doc.type} • {doc.uploadedAt}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading file "${doc.name}" mock payload...`)}
                    className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 bg-white hover:shadow-xs transition-all cursor-pointer shrink-0"
                    title="Download Copy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEETINGS PANEL */}
        {activeTab === "meetings" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Schedule Meeting form */}
            {!isReadOnly && (
              <div className="md:col-span-1 bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3.5 h-fit">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Schedule video conference</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discussion Agenda *</label>
                    <input
                      type="text"
                      value={newMeetingTitle}
                      onChange={(e) => setNewMeetingTitle(e.target.value)}
                      placeholder="e.g. Export quota verification"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meeting Date/Time *</label>
                    <input
                      type="datetime-local"
                      value={newMeetingDate}
                      onChange={(e) => setNewMeetingDate(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMeeting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    Schedule Meeting
                  </button>
                </div>
              </div>
            )}

            {/* Meetings list */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">Scheduled Conferences</h3>
              
              {resident.meetings && resident.meetings.length > 0 ? (
                resident.meetings.map((meet) => (
                  <div key={meet.id} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3 text-xs bg-slate-50/20">
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800 block">{meet.title}</span>
                      <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-mono font-semibold">
                        <div className="flex items-center gap-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{meet.dateTime.replace('T', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium italic mt-1">Status Notes: {meet.notes}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      meet.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                    }`}>
                      {meet.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-8 border border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-slate-300" />
                  <span>No scheduled meetings logged in database.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TASKS PANEL */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Create task input */}
            {!isReadOnly && (
              <div className="md:col-span-1 bg-slate-50/50 border border-slate-200 rounded-xl p-4 space-y-3 h-fit">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Assign Audit Task</h4>
                
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task item title..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    Add Task Item
                  </button>
                </div>
              </div>
            )}

            {/* Checklist items log */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">Audit Compliance Checklist</h3>
              
              {resident.tasks && resident.tasks.length > 0 ? (
                resident.tasks.map((task) => {
                  const isDone = task.status === "DONE";
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => !isReadOnly && handleToggleTask(task.id)}
                      className={`border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs transition-all ${
                        isReadOnly ? "" : "cursor-pointer hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>
                        <span className={`font-bold text-slate-700 block truncate ${
                          isDone ? "line-through text-slate-400 font-medium" : ""
                        }`} title={task.title}>
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 select-none">
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">Due: {task.dueDate}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          task.priority === "HIGH" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-8 border border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-slate-300" />
                  <span>No audit tasks assigned for this resident enterprise.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NOTES PANEL */}
        {activeTab === "notes" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Notepad area */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">Discussion Summaries & Notes</h3>
              <textarea
                disabled={isReadOnly}
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write and save custom auditor reports, discussion summaries, or compliance logs..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              {!isReadOnly && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </button>
                </div>
              )}
            </div>

            {/* Saved notepad logs */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Historic Notes Log ({resident.notes ? resident.notes.length : 0})</span>
              
              {resident.notes && resident.notes.length > 0 ? (
                resident.notes.map((note, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-xs space-y-1 hover:bg-slate-50 transition-all font-semibold">
                    <p className="text-slate-600 leading-relaxed font-semibold">{note}</p>
                    <span className="text-[9px] text-slate-400 font-mono block text-right">Audit Entry #{idx + 1}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-6 border border-dashed border-slate-200 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-slate-300" />
                  <span>No notepad entries found for this resident enterprise.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TIMELINE PANEL */}
        {activeTab === "timeline" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">System Activity Audit Trail</h3>
            
            <div className="relative border-l-2 border-slate-100 pl-5 ml-2.5 space-y-6">
              {resident.historyLogs && resident.historyLogs.length > 0 ? (
                resident.historyLogs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    {/* Circle bullet node */}
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-white border-2 border-emerald-500 z-10"></div>
                    
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-slate-800 block">{log.action}</span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono font-medium">
                        <span>User: {log.userName}</span>
                        <span>•</span>
                        <span>Timestamp: {log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 py-8 border border-dashed border-slate-200 rounded-xl -ml-5">
                  <History className="w-5 h-5 text-slate-300" />
                  <span>No background activity logs logged for this resident.</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div id="resident-edit-profile-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Edit Resident Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProfile} className="space-y-5">
              {/* Company Registry Info */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Registry Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.companyName}
                      onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Director *</label>
                    <input
                      type="text"
                      required
                      value={editForm.director}
                      onChange={(e) => setEditForm({ ...editForm, director: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INN (9-digit Tax Code) *</label>
                    <input
                      type="text"
                      required
                      value={editForm.registrationNumber}
                      onChange={(e) => setEditForm({ ...editForm, registrationNumber: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered District</label>
                    <select
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                    >
                      {KASHKADARYA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Legal Address</label>
                    <input
                      type="text"
                      value={editForm.legalAddress}
                      onChange={(e) => setEditForm({ ...editForm, legalAddress: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity Type</label>
                    <input
                      type="text"
                      value={editForm.activityType}
                      onChange={(e) => setEditForm({ ...editForm, activityType: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Website</label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telegram</label>
                    <input
                      type="text"
                      value={editForm.telegram}
                      onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn</label>
                    <input
                      type="text"
                      value={editForm.linkedIn}
                      onChange={(e) => setEditForm({ ...editForm, linkedIn: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Manager</label>
                    <input
                      type="text"
                      value={editForm.assignedManager}
                      onChange={(e) => setEditForm({ ...editForm, assignedManager: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Financials */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status &amp; Financials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resident Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ResidentStatus })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                    >
                      {Object.values(ResidentStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Headcount</label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.employeesCount}
                      onChange={(e) => setEditForm({ ...editForm, employeesCount: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export Volume (USD)</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={editForm.exportVolume}
                      onChange={(e) => setEditForm({ ...editForm, exportVolume: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domestic Volume (USD)</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={editForm.domesticVolume}
                      onChange={(e) => setEditForm({ ...editForm, domesticVolume: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tax Benefits */}
              <div className="space-y-1.5 border border-slate-100 p-3 bg-slate-50/50 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Legislative Tax Privileges</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {AVAILABLE_BENEFITS.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={editForm.benefitsApplied.includes(b)}
                        onChange={() => toggleEditBenefit(b)}
                        className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
