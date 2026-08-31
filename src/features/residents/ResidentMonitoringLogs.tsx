/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  User, 
  FileText,
  Clock,
  ArrowUpRight,
  X
} from "lucide-react";
import { Resident, ResidentMonitoringVisit, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentMonitoringLogsProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export default function ResidentMonitoringLogs({ 
  residents, 
  onUpdate, 
  userRole, 
  onSyncState 
}: ResidentMonitoringLogsProps) {
  const { t } = useLanguage();
  const [showAddVisit, setShowAddVisit] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Schedule Visit Form States
  const [visitForm, setVisitForm] = useState({
    residentId: "",
    visitDate: new Date().toISOString().split("T")[0],
    officer: "Dilnoza Alimova",
    problems: "",
    priority: "LOW" as "LOW" | "MEDIUM" | "HIGH",
    recommendations: "",
    status: "PENDING" as "PENDING" | "RESOLVED" | "CRITICAL"
  });

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter residents that are Active or Suspended
  const activeResidents = residents.filter(r => r.status === ResidentStatus.ACTIVE || r.status === ResidentStatus.SUSPENDED);

  // Aggregate all monitoring logs across all active residents
  interface CombinedVisit extends ResidentMonitoringVisit {
    companyName: string;
    residentId: string;
  }

  const allVisits: CombinedVisit[] = [];
  activeResidents.forEach(r => {
    if (r.monitoringHistory) {
      r.monitoringHistory.forEach(v => {
        allVisits.push({
          ...v,
          companyName: r.companyName,
          residentId: r.id
        });
      });
    }
  });

  // Sort visits chronologically (latest first)
  const sortedVisits = allVisits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  // Filtered visits list
  const filteredVisits = sortedVisits.filter(v => {
    const matchesSearch = 
      v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.problems.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "ALL" || v.priority === priorityFilter;
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Metrics
  const totalInspections = allVisits.length;
  const criticalCount = allVisits.filter(v => v.status === "CRITICAL").length;
  const pendingCount = allVisits.filter(v => v.status === "PENDING").length;

  const handleAddVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.residentId || !visitForm.problems) {
      alert("Please select a resident and describe the audit details.");
      return;
    }

    const selectedRes = residents.find(r => r.id === visitForm.residentId);
    if (!selectedRes) return;

    const newVisit: ResidentMonitoringVisit = {
      id: `mon-${Date.now()}`,
      visitDate: visitForm.visitDate,
      officer: visitForm.officer,
      problems: visitForm.problems,
      priority: visitForm.priority,
      recommendations: visitForm.recommendations || "No recommendations",
      photos: [],
      status: visitForm.status,
      followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    };

    const updatedHistory = [newVisit, ...(selectedRes.monitoringHistory || [])];

    await onUpdate(visitForm.residentId, {
      monitoringHistory: updatedHistory,
      notes: [...(selectedRes.notes || []), `New inspection visit logged by ${visitForm.officer} on ${visitForm.visitDate}. Status: ${visitForm.status}.`]
    });

    setShowAddVisit(false);
    setVisitForm({
      residentId: "",
      visitDate: new Date().toISOString().split("T")[0],
      officer: "Dilnoza Alimova",
      problems: "",
      priority: "LOW",
      recommendations: "",
      status: "PENDING"
    });
    if (onSyncState) onSyncState();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Metrics panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Audits Logged</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{totalInspections} audits</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg shrink-0 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Critical Violations</span>
            <span className="text-xl font-extrabold text-rose-700 font-mono">{criticalCount} flagged</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pending Action</span>
            <span className="text-xl font-extrabold text-slate-800 font-mono">{pendingCount} re-visits</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit notes or officer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="ALL">All Statuses</option>
              <option value="RESOLVED">Resolved</option>
              <option value="PENDING">Pending Action</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowAddVisit(true)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-all shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Inspection</span>
          </button>
        )}
      </div>

      {/* Visits list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historical Inspection Timeline</span>
          <span className="text-[10px] text-slate-400 font-mono">Showing {filteredVisits.length} of {allVisits.length} visits</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredVisits.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              No inspection records match these filters.
            </div>
          ) : (
            filteredVisits.map((v) => (
              <div key={v.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3 hover:bg-slate-50/40 transition-all text-xs">
                {/* Meta details */}
                <div className="space-y-1 md:w-1/4">
                  <span className="font-bold text-slate-800 block truncate" title={v.companyName}>
                    {v.companyName}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{v.visitDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{v.officer}</span>
                    </div>
                  </div>
                </div>

                {/* Problems & recommendations */}
                <div className="space-y-1.5 flex-1 md:px-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Problems Identified</span>
                    <p className="text-slate-600 leading-relaxed font-semibold">{v.problems}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Corrective Action / Recommendation</span>
                    <p className="text-slate-500 leading-relaxed font-medium italic">{v.recommendations}</p>
                  </div>
                </div>

                {/* Status labels */}
                <div className="flex items-center md:flex-col gap-2 shrink-0 md:items-end justify-between md:justify-start">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                    v.priority === "HIGH" ? "bg-rose-50 text-rose-700 border-rose-100" :
                    v.priority === "MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>
                    {v.priority} Priority
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                    v.status === "RESOLVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    v.status === "CRITICAL" ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {v.status === "RESOLVED" ? "RESOLVED" : v.status === "CRITICAL" ? "CRITICAL VIOLATION" : "RE-AUDIT PENDING"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SCHEDULE VISIT MODAL */}
      {showAddVisit && (
        <div id="schedule-inspection-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Log/Schedule Audit Inspection</h2>
              <button onClick={() => setShowAddVisit(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVisitSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Resident Enterprise *</label>
                  <select
                    required
                    value={visitForm.residentId}
                    onChange={(e) => setVisitForm({ ...visitForm, residentId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="">-- Choose Resident --</option>
                    {activeResidents.map(r => (
                      <option key={r.id} value={r.id}>{r.companyName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visit Date</label>
                    <input
                      type="date"
                      value={visitForm.visitDate}
                      onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Officer</label>
                    <input
                      type="text"
                      value={visitForm.officer}
                      onChange={(e) => setVisitForm({ ...visitForm, officer: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Level</label>
                    <select
                      value={visitForm.priority}
                      onChange={(e) => setVisitForm({ ...visitForm, priority: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit Status</label>
                    <select
                      value={visitForm.status}
                      onChange={(e) => setVisitForm({ ...visitForm, status: e.target.value as any })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      <option value="PENDING">Re-Audit Pending</option>
                      <option value="RESOLVED">Resolved / Clear</option>
                      <option value="CRITICAL">Critical Violation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problems Identified *</label>
                  <textarea
                    rows={2}
                    required
                    value={visitForm.problems}
                    onChange={(e) => setVisitForm({ ...visitForm, problems: e.target.value })}
                    placeholder="Describe any discovered violations, revenue misreporting, or floor area issues..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corrective Recommendations</label>
                  <textarea
                    rows={2}
                    value={visitForm.recommendations}
                    onChange={(e) => setVisitForm({ ...visitForm, recommendations: e.target.value })}
                    placeholder="Enter actionable guidelines e.g. correct financial audits within 10 days..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVisit(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Visit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
