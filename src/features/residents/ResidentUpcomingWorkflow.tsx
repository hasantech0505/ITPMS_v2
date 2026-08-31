/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckCircle, 
  UserCheck, 
  FileText, 
  Clipboard, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  Award,
  Zap,
  Check,
  X,
  Plus,
  Search,
  Filter,
  DollarSign,
  Users,
  Building2,
  Clock,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  Trash2
} from "lucide-react";
import { Resident, ResidentStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface ResidentUpcomingWorkflowProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  onAdd?: (resident: Omit<Resident, "id"> | any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export type UpcomingStage = 
  | "Application Submitted" 
  | "Document Review" 
  | "Inspection" 
  | "Agreement" 
  | "Approved" 
  | "Resident";

const UPCOMING_STEPS: UpcomingStage[] = [
  "Application Submitted",
  "Document Review",
  "Inspection",
  "Agreement",
  "Approved",
  "Resident"
];

export default function ResidentUpcomingWorkflow({ 
  residents, 
  onUpdate, 
  onAdd,
  onDelete,
  userRole, 
  onSyncState 
}: ResidentUpcomingWorkflowProps) {
  const { t } = useLanguage();
  const [showCertifyModal, setShowCertifyModal] = useState<Resident | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState<Resident | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<Resident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("ALL");

  // New candidate form state
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newDirector, setNewDirector] = useState("");
  const [newInn, setNewInn] = useState("");
  const [newDistrict, setNewDistrict] = useState("Tashkent City");
  const [newActivity, setNewActivity] = useState("IT Services & Software Development");
  const [newProjExports, setNewProjExports] = useState<number>(150000);
  const [newProjJobs, setNewProjJobs] = useState<number>(15);

  // Certification benefits form states
  const [certifiedBenefits, setCertifiedBenefits] = useState<string[]>([
    "0% Corporate Income Tax",
    "7.5% Personal Income Tax",
    "0% Customs Duty"
  ]);

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter residents that are in PENDING status
  const pendingResidents = residents.filter(r => r.status === ResidentStatus.PENDING);

  // Advanced filtered list
  const filteredResidents = pendingResidents.filter(r => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (r.companyName || "").toLowerCase().includes(query) ||
      (r.director || "").toLowerCase().includes(query) ||
      (r.registrationNumber || "").toLowerCase().includes(query);

    const matchesStage = selectedStageFilter === "ALL" || (r.upcomingStage || "Application Submitted") === selectedStageFilter;

    return matchesSearch && matchesStage;
  });

  // Pipeline metrics
  const totalPipelineCount = pendingResidents.length;
  const projectedExportSum = pendingResidents.reduce((acc, r) => acc + (r.exportVolume || 0), 0);
  const projectedJobsSum = pendingResidents.reduce((acc, r) => acc + (r.employeesCount || 0), 0);
  const readyForCertifyCount = pendingResidents.filter(r => (r.upcomingStage || "") === "Approved" || (r.upcomingStage || "") === "Agreement").length;

  const handleAdvanceStep = async (id: string, currentStep: UpcomingStage) => {
    const currentIndex = UPCOMING_STEPS.indexOf(currentStep);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= UPCOMING_STEPS.length) return;

    const nextStep = UPCOMING_STEPS[nextIndex];

    await onUpdate(id, {
      upcomingStage: nextStep,
      notes: [...(residents.find(x => x.id === id)?.notes || []), `Advanced onboarding stage to: ${nextStep} on ${new Date().toISOString().split("T")[0]}.`]
    });
    if (onSyncState) onSyncState();
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (onDelete) {
      await onDelete(candidateId);
    } else {
      await onUpdate(candidateId, { status: ResidentStatus.REMOVED });
    }
    setShowDeleteModal(null);
    if (onSyncState) onSyncState();
  };

  const handleRegressStep = async (id: string, currentStep: UpcomingStage) => {
    const currentIndex = UPCOMING_STEPS.indexOf(currentStep);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = UPCOMING_STEPS[prevIndex];

    await onUpdate(id, {
      upcomingStage: prevStep,
      notes: [...(residents.find(x => x.id === id)?.notes || []), `Moved onboarding stage back to: ${prevStep} on ${new Date().toISOString().split("T")[0]}.`]
    });
    if (onSyncState) onSyncState();
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    const newId = `RES-PEND-${Date.now().toString().slice(-4)}`;

    const newResident: Partial<Resident> = {
      id: newId,
      companyName: newCompanyName || "Innovative IT Enterprise",
      director: newDirector || "A. Rustamov",
      registrationNumber: newInn || "309123888",
      status: ResidentStatus.PENDING,
      upcomingStage: "Application Submitted",
      appliedAt: today,
      district: newDistrict,
      activityType: newActivity,
      exportVolume: Number(newProjExports) || 100000,
      employeesCount: Number(newProjJobs) || 12,
      benefitsApplied: [],
      notes: [`Application submitted for IT Park Residency on ${today}.`]
    };

    if (onAdd) {
      await onAdd(newResident);
    } else {
      await onUpdate(newId, newResident);
    }

    // Reset form
    setShowAddModal(false);
    setNewCompanyName("");
    setNewDirector("");
    setNewInn("");
    setNewDistrict("Tashkent City");
    setNewActivity("IT Services & Software Development");
    setNewProjExports(150000);
    setNewProjJobs(15);

    if (onSyncState) onSyncState();
  };

  const handleFinalCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCertifyModal) return;

    const today = new Date().toISOString().split("T")[0];
    await onUpdate(showCertifyModal.id, {
      status: ResidentStatus.ACTIVE,
      upcomingStage: "Resident",
      approvedAt: today,
      benefitsApplied: certifiedBenefits,
      notes: [...(showCertifyModal.notes || []), `Resident application fully approved and officially certified with legislation benefits on ${today}.`]
    });

    setShowCertifyModal(null);
    if (onSyncState) onSyncState();
  };

  const toggleBenefit = (benefit: string) => {
    if (certifiedBenefits.includes(benefit)) {
      setCertifiedBenefits(certifiedBenefits.filter(b => b !== benefit));
    } else {
      setCertifiedBenefits([...certifiedBenefits, benefit]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[10px] uppercase tracking-widest">
              Onboarding Pipeline
            </span>
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Upcoming Candidate Verification Stepper
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Review incoming resident applications, inspect document compliance, and sign legislative benefit decrees.
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="upcoming-add-candidate-btn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Candidate Application
            </button>
          </div>
        )}
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Pipeline</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-800 font-mono">{totalPipelineCount}</span>
              <span className="text-[10px] font-bold text-amber-600">under review</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected IT Exports</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-800 font-mono">${(projectedExportSum / 1000).toFixed(0)}k</span>
              <span className="text-[10px] font-bold text-slate-400">USD/yr</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected New Jobs</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-800 font-mono">{projectedJobsSum}</span>
              <span className="text-[10px] font-bold text-slate-400">specialists</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ready for Decree</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-emerald-600 font-mono">{readyForCertifyCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Final Phase</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate or INN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-amber-500 font-medium text-slate-700"
          />
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Stage:</span>
          {["ALL", "Application Submitted", "Document Review", "Inspection", "Agreement", "Approved"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStageFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStageFilter === st 
                  ? "bg-slate-900 text-amber-400 font-extrabold shadow-xs" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Stages" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Pending List Stepper Rows */}
      <div className="space-y-4">
        {filteredResidents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-1.5">
            <CheckCircle className="w-8 h-8 text-slate-300" />
            <span className="text-xs font-semibold">No candidate applications match the selected criteria.</span>
          </div>
        ) : (
          filteredResidents.map((r) => {
            const currentStep = (r.upcomingStage || "Application Submitted") as UpcomingStage;
            const currentStepIndex = UPCOMING_STEPS.indexOf(currentStep);

            return (
              <div 
                key={r.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                {/* Stepper Metadata */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 uppercase tracking-tight block">{r.companyName}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">
                        {currentStep}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span>INN: <strong className="font-mono text-slate-700">{r.registrationNumber}</strong></span>
                      <span>•</span>
                      <span>Submitted: <strong>{r.appliedAt || "Recent"}</strong></span>
                      <span>•</span>
                      <span>Director: <strong>{r.director}</strong></span>
                      <span>•</span>
                      <span>District: <strong>{r.district}</strong></span>
                      <span>•</span>
                      <span>Est. Exports: <strong className="text-emerald-600 font-mono">${(r.exportVolume || 0).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Actions column */}
                  {!isReadOnly && (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Document Verification Drawer Button */}
                      <button
                        onClick={() => setShowDocModal(r)}
                        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Docs Checklist</span>
                      </button>

                      {/* Regress step button */}
                      {currentStepIndex > 0 && currentStep !== "Resident" && (
                        <button
                          onClick={() => handleRegressStep(r.id, currentStep)}
                          title="Move back to previous stage"
                          className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>
                      )}

                      {/* Advance step button */}
                      {currentStep !== "Approved" && currentStep !== "Resident" ? (
                        <button
                          onClick={() => handleAdvanceStep(r.id, currentStep)}
                          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all uppercase"
                        >
                          <span>Advance Step</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setCertifiedBenefits(["0% Corporate Income Tax", "7.5% Personal Income Tax", "0% Customs Duty"]);
                            setShowCertifyModal(r);
                          }}
                          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all uppercase shadow-md shadow-emerald-600/10"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Officially Certify</span>
                        </button>
                      )}

                      {/* Delete Candidate button */}
                      <button
                        onClick={() => setShowDeleteModal(r)}
                        title="Delete candidate application"
                        className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-all border border-rose-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress Visual Stepper */}
                <div className="grid grid-cols-5 gap-2 relative pt-1">
                  {/* Stepper connector line background */}
                  <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>

                  {UPCOMING_STEPS.slice(0, 5).map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div key={step} className="flex flex-col items-center justify-center text-center space-y-1.5 z-10">
                        {/* Step Node Circle */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold border transition-all ${
                          isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-xs" :
                          isActive ? "bg-white border-amber-500 text-amber-600 ring-4 ring-amber-500/20 font-black" :
                          "bg-white border-slate-200 text-slate-400"
                        }`}>
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3px]" /> : idx + 1}
                        </div>
                        
                        {/* Step Title Label */}
                        <span className={`text-[10px] font-bold tracking-tight block max-w-[110px] truncate ${
                          isActive ? "text-amber-700 font-extrabold" :
                          isCompleted ? "text-slate-700 font-semibold" : "text-slate-400"
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD CANDIDATE APPLICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                    Submit Candidate Application
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Add a new applicant into the IT Park resident onboarding pipeline.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCandidate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NextGen Cybertech LLC"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Director Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jamshid Alimov"
                    value={newDirector}
                    onChange={(e) => setNewDirector(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">INN Tax Number (9 digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={9}
                    placeholder="e.g. 309888777"
                    value={newInn}
                    onChange={(e) => setNewInn(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">District / Region</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800"
                  >
                    <option value="Tashkent City">Tashkent City</option>
                    <option value="Samarkand Region">Samarkand Region</option>
                    <option value="Fergana Region">Fergana Region</option>
                    <option value="Andijan Region">Andijan Region</option>
                    <option value="Bukhara Region">Bukhara Region</option>
                    <option value="Khorezm Region">Khorezm Region</option>
                    <option value="Namangan Region">Namangan Region</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Primary IT Activity Type</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering & Cloud Solutions"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Projected Exports ($/yr)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="150000"
                    value={newProjExports}
                    onChange={(e) => setNewProjExports(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Projected Workforce</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="15"
                    value={newProjJobs}
                    onChange={(e) => setNewProjJobs(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT CHECKLIST MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                    Document Compliance Verification
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{showDocModal.companyName}</p>
                </div>
              </div>
              <button onClick={() => setShowDocModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { title: "Form 1: Resident Application", desc: "Signed by company director with official stamp", status: "Verified" },
                { title: "Business Plan & Revenue Forecast", desc: "Minimum 80% export orientation projection", status: "Verified" },
                { title: "State Incorporation Certificate", desc: "Registered in Uzbekistan Unified State Register", status: "Verified" },
                { title: "Tax Authority Clearance", desc: "No outstanding tax or social debt balance", status: "Under Review" }
              ].map((doc, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 block">{doc.title}</span>
                    <span className="text-[10px] text-slate-500">{doc.desc}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    doc.status === "Verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDocModal(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL CERTIFICATION & AGREEMENT SIGNING MODAL */}
      {showCertifyModal && (
        <div id="certify-onboarding-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-5 h-5 text-emerald-500" />
                Sign Legislative Certification Decree
              </h2>
              <button onClick={() => setShowCertifyModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Confirming executive certification for <b>{showCertifyModal.companyName}</b>. Once certified, they will be registered in the official 0% Corporate Income Tax regime. Check the applicable legislations below:
            </p>

            <form onSubmit={handleFinalCertify} className="space-y-4">
              <div className="space-y-2 border border-slate-100 p-3.5 bg-slate-50/50 rounded-xl">
                {[
                  "0% Corporate Income Tax",
                  "7.5% Personal Income Tax",
                  "0% Customs Duty Exemptions",
                  "0% Social Tax / Insurance Preferential rates"
                ].map((b) => (
                  <label key={b} className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer py-1 select-none">
                    <input
                      type="checkbox"
                      checked={certifiedBenefits.includes(b)}
                      onChange={() => toggleBenefit(b)}
                      className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCertifyModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Approve & Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div id="delete-candidate-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                    Delete Candidate Application
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {showDeleteModal.companyName}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete candidate <b>{showDeleteModal.companyName}</b> (INN: <span className="font-mono">{showDeleteModal.registrationNumber}</span>)? This will remove the application from the upcoming onboarding pipeline and candidate metrics.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCandidate(showDeleteModal.id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

