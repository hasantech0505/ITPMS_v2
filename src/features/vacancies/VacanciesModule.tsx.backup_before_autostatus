/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Plus,
  X,
  ChevronRight,
  Trash2,
  Pencil,
  Sparkles,
  Users2,
  MapPin,
  Wallet,
  CalendarClock,
  UserPlus,
  Loader2,
  CheckCircle2,
  Building2
} from "lucide-react";
import {
  Vacancy,
  VacancyApplication,
  VacancyApplicationStage,
  VacancyEmploymentType,
  VacancySeniority,
  VacancyStatus,
  Talent,
  Resident,
  LanguageProficiencyLevel
} from "../../types";
import ExportImportManager from "../../components/ExportImportManager";
import { useLanguage } from "../../lib/LanguageContext";
import { rankCandidatesForVacancy, scoreCandidateForVacancy, VacancyMatchBreakdown } from "./vacancyMatching";
import { explainVacancyMatch } from "./vacancyAi";

interface VacanciesModuleProps {
  vacancies: Vacancy[];
  vacancyApplications: VacancyApplication[];
  talent: Talent[];
  residents: Resident[];
  onAddVacancy: (payload: Omit<Vacancy, "id">) => Promise<boolean> | void;
  onUpdateVacancy: (id: string, payload: Partial<Vacancy>) => Promise<boolean> | void;
  onDeleteVacancy: (id: string) => Promise<boolean> | void;
  onAddApplication: (payload: Omit<VacancyApplication, "id">) => Promise<boolean> | void;
  onUpdateApplication: (id: string, payload: Partial<VacancyApplication>) => Promise<boolean> | void;
  onDeleteApplication: (id: string) => Promise<boolean> | void;
  userRole: string;
  onSyncState?: () => void;
}

const STAGES: VacancyApplicationStage[] = ["APPLIED", "SCREENING", "INTERVIEWING", "OFFER", "HIRED", "REJECTED", "WITHDRAWN"];

const STAGE_COLUMN_STYLE: Record<VacancyApplicationStage, string> = {
  APPLIED: "bg-slate-50 border-slate-200",
  SCREENING: "bg-indigo-50/40 border-indigo-100",
  INTERVIEWING: "bg-blue-50/40 border-blue-100",
  OFFER: "bg-amber-50/40 border-amber-100",
  HIRED: "bg-emerald-50/40 border-emerald-100",
  REJECTED: "bg-rose-50/30 border-rose-100",
  WITHDRAWN: "bg-slate-50 border-slate-200"
};

const STATUS_BADGE: Record<VacancyStatus, string> = {
  OPEN: "bg-emerald-50 text-emerald-700",
  ON_HOLD: "bg-amber-50 text-amber-700",
  FILLED: "bg-indigo-50 text-indigo-700",
  CLOSED: "bg-slate-100 text-slate-500",
  EXPIRED: "bg-rose-50 text-rose-700"
};

const EMPLOYMENT_TYPES: VacancyEmploymentType[] = ["Full-time", "Part-time", "Internship", "Remote", "Contract"];
const SENIORITY_LEVELS: VacancySeniority[] = ["Intern", "Junior", "Mid", "Senior", "Lead"];
const VACANCY_STATUSES: VacancyStatus[] = ["OPEN", "ON_HOLD", "FILLED", "CLOSED", "EXPIRED"];
const ENGLISH_LEVELS: LanguageProficiencyLevel[] = ["None", "A1", "A2", "B1", "B2", "C1", "C2", "Native"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function scoreTierClasses(score: number): string {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

const DEFAULT_FORM = {
  residentId: "",
  title: "",
  department: "",
  employmentType: "Full-time" as VacancyEmploymentType,
  seniority: "Mid" as VacancySeniority,
  location: "",
  requiredSkills: "",
  preferredSkills: "",
  englishLevel: "" as "" | LanguageProficiencyLevel,
  numberOfOpenings: 1,
  salaryMin: "" as number | "",
  salaryMax: "" as number | "",
  salaryNegotiable: false,
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "OPEN" as VacancyStatus,
  deadlineDate: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  notes: ""
};

export default function VacanciesModule({
  vacancies,
  vacancyApplications,
  talent,
  residents,
  onAddVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  userRole,
  onSyncState
}: VacanciesModuleProps) {
  const { t } = useLanguage();
  const isReadOnly = false; // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only - matches TalentModule/InfrastructureModule convention.

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | VacancyStatus>("ALL");
  const [seniorityFilter, setSeniorityFilter] = useState<"ALL" | VacancySeniority>("ALL");

  const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const [explainTarget, setExplainTarget] = useState<{ talent: Talent; vacancy: Vacancy } | null>(null);
  const [explainResult, setExplainResult] = useState<{ explanation: string; usedAI: boolean } | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const selectedVacancy = vacancies.find((v) => v.id === selectedVacancyId) || null;

  const applicationsByVacancy = (vacancyId: string) => vacancyApplications.filter((a) => a.vacancyId === vacancyId);

  const openVacanciesCount = vacancies.filter((v) => v.status === "OPEN").length;
  const totalApplicants = vacancyApplications.length;
  const positionsFilled = vacancies.filter((v) => v.status === "FILLED").length;

  const filteredVacancies = vacancies.filter((v) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (v.title || "").toLowerCase().includes(query) ||
      (v.residentName || "").toLowerCase().includes(query) ||
      (v.requiredSkills || []).some((s) => s.toLowerCase().includes(query));
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    const matchesSeniority = seniorityFilter === "ALL" || v.seniority === seniorityFilter;
    return matchesSearch && matchesStatus && matchesSeniority;
  });

  // ---------------------------------------------------------------------
  // Form handling (post / edit vacancy)
  // ---------------------------------------------------------------------
  const openPostModal = () => {
    setEditingVacancyId(null);
    setFormData(DEFAULT_FORM);
    setShowPostModal(true);
  };

  const openEditModal = (v: Vacancy) => {
    setFormData({
      residentId: v.residentId,
      title: v.title,
      department: v.department || "",
      employmentType: v.employmentType,
      seniority: v.seniority,
      location: v.location,
      requiredSkills: (v.requiredSkills || []).join(", "),
      preferredSkills: (v.preferredSkills || []).join(", "),
      englishLevel: v.englishLevel || "",
      numberOfOpenings: v.numberOfOpenings,
      salaryMin: v.salaryMin ?? "",
      salaryMax: v.salaryMax ?? "",
      salaryNegotiable: v.salaryNegotiable,
      description: v.description,
      responsibilities: (v.responsibilities || []).join(", "),
      requirements: (v.requirements || []).join(", "),
      benefits: (v.benefits || []).join(", "),
      status: v.status,
      deadlineDate: v.deadlineDate || "",
      contactPerson: v.contactPerson || "",
      contactEmail: v.contactEmail || "",
      contactPhone: v.contactPhone || "",
      notes: v.notes || ""
    });
    setEditingVacancyId(v.id);
    setShowPostModal(true);
  };

  const handleSaveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    const resident = residents.find((r) => r.id === formData.residentId);
    if (!resident || !formData.title || !formData.location || !formData.description) {
      alert(t("Resident, Title, Location, and Description are required"));
      return;
    }

    const payload: any = {
      residentId: resident.id,
      residentName: resident.companyName,
      title: formData.title,
      department: formData.department || undefined,
      employmentType: formData.employmentType,
      seniority: formData.seniority,
      location: formData.location,
      requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      preferredSkills: formData.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      englishLevel: formData.englishLevel || undefined,
      numberOfOpenings: Number(formData.numberOfOpenings) || 1,
      salaryMin: formData.salaryMin === "" ? undefined : Number(formData.salaryMin),
      salaryMax: formData.salaryMax === "" ? undefined : Number(formData.salaryMax),
      salaryNegotiable: formData.salaryNegotiable,
      description: formData.description,
      responsibilities: formData.responsibilities.split(",").map((s) => s.trim()).filter(Boolean),
      requirements: formData.requirements.split(",").map((s) => s.trim()).filter(Boolean),
      benefits: formData.benefits.split(",").map((s) => s.trim()).filter(Boolean),
      status: formData.status,
      deadlineDate: formData.deadlineDate || undefined,
      contactPerson: formData.contactPerson || undefined,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      notes: formData.notes || undefined,
      updatedAt: new Date().toISOString()
    };

    if (editingVacancyId) {
      await onUpdateVacancy(editingVacancyId, payload);
    } else {
      payload.postedDate = todayIso();
      payload.createdAt = new Date().toISOString();
      await onAddVacancy(payload);
    }

    setShowPostModal(false);
    setEditingVacancyId(null);
    setFormData(DEFAULT_FORM);
  };

  const handleDeleteVacancy = async (id: string) => {
    if (!confirm(t("Delete this vacancy and its posting? Existing applications remain in the pipeline history."))) return;
    await onDeleteVacancy(id);
    setSelectedVacancyId(null);
  };

  // ---------------------------------------------------------------------
  // Applications / matching
  // ---------------------------------------------------------------------
  const handleAddApplicant = async (vacancy: Vacancy, candidate: Talent, breakdown: VacancyMatchBreakdown) => {
    const already = vacancyApplications.some((a) => a.vacancyId === vacancy.id && a.talentId === candidate.id);
    if (already) return;
    const now = new Date().toISOString();
    await onAddApplication({
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      residentId: vacancy.residentId,
      talentId: candidate.id,
      candidateName: candidate.fullName,
      stage: "APPLIED",
      appliedDate: todayIso(),
      matchScore: breakdown.score,
      notes: "",
      history: [{ date: now, stage: "APPLIED", note: t("Added from candidate matching panel") }],
      createdAt: now
    } as Omit<VacancyApplication, "id">);
    onSyncState && onSyncState();
  };

  const handleStageChange = async (app: VacancyApplication, newStage: VacancyApplicationStage) => {
    if (newStage === app.stage) return;
    const now = new Date().toISOString();
    await onUpdateApplication(app.id, {
      stage: newStage,
      updatedAt: now,
      history: [...(app.history || []), { date: now, stage: newStage }]
    });

    if (newStage === "HIRED" && selectedVacancy && selectedVacancy.status !== "FILLED") {
      if (confirm(t("Candidate marked HIRED. Also mark this vacancy as FILLED?"))) {
        await onUpdateVacancy(selectedVacancy.id, {
          status: "FILLED",
          filledDate: todayIso(),
          filledByTalentId: app.talentId,
          updatedAt: now
        });
      }
    }
    onSyncState && onSyncState();
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm(t("Remove this application from the pipeline?"))) return;
    await onDeleteApplication(id);
  };

  const openExplainModal = async (candidate: Talent, vacancy: Vacancy) => {
    setExplainTarget({ talent: candidate, vacancy });
    setExplainResult(null);
    setExplainLoading(true);
    try {
      const result = await explainVacancyMatch({ talent: candidate, vacancy });
      setExplainResult({ explanation: result.explanation, usedAI: result.usedAI });
    } catch (err) {
      console.error(err);
      setExplainResult({ explanation: t("Could not reach the AI explainer right now - the deterministic score above is still accurate."), usedAI: false });
    } finally {
      setExplainLoading(false);
    }
  };

  const rankedCandidates = useMemo(() => {
    if (!selectedVacancy) return [];
    return rankCandidatesForVacancy(talent, selectedVacancy).slice(0, 12);
  }, [selectedVacancy, talent]);

  return (
    <div id="vacancies-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t("Resident Vacancies")}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Job openings posted on behalf of resident companies, matched against the Talent Pool.")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportImportManager
            module="vacancies"
            moduleTitle={t("Resident Vacancies")}
            data={vacancies}
            columns={[
              { key: "title", label: "Title", required: true, type: "string" },
              { key: "residentName", label: "Resident", required: true, type: "string" },
              { key: "employmentType", label: "Employment Type", type: "string" },
              { key: "seniority", label: "Seniority", type: "string" },
              { key: "location", label: "Location", type: "string" },
              { key: "numberOfOpenings", label: "Openings", type: "number" },
              { key: "status", label: "Status", type: "string" },
              { key: "postedDate", label: "Posted Date", type: "string" }
            ]}
            onImportCompleted={() => onSyncState && onSyncState()}
            userRole={userRole as any}
          />
          {!isReadOnly && (
            <button
              id="post-vacancy-btn"
              onClick={openPostModal}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-violet-600/10 h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>{t("Post Vacancy")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-100 rounded-lg text-violet-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Open Vacancies")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{openVacanciesCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-x border-slate-200 md:px-6 py-3 md:py-0">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Total Applicants")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{totalApplicants}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Positions Filled")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{positionsFilled}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="vacancy-search-input"
            type="text"
            placeholder={t("Search title, resident, or skill...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer w-full md:w-40"
        >
          <option value="ALL">{t("All Statuses")}</option>
          {VACANCY_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={seniorityFilter}
          onChange={(e) => setSeniorityFilter(e.target.value as any)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer w-full md:w-40"
        >
          <option value="ALL">{t("All Levels")}</option>
          {SENIORITY_LEVELS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Vacancy grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVacancies.map((v) => {
          const applicantCount = applicationsByVacancy(v.id).length;
          return (
            <div
              id={`vacancy-card-${v.id}`}
              key={v.id}
              onClick={() => setSelectedVacancyId(v.id)}
              className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-snug">{v.title}</h3>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {v.residentName}
                    </span>
                  </div>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${STATUS_BADGE[v.status]}`}>
                    {v.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {v.location}
                  </span>
                  <span className="font-mono font-bold text-violet-600">{v.seniority}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {(v.requiredSkills || []).slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[9px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">
                      {s}
                    </span>
                  ))}
                  {(v.requiredSkills || []).length > 3 && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">
                      +{(v.requiredSkills || []).length - 3} {t("more")}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("Openings")}</span>
                  <span className="font-extrabold text-slate-800 font-mono">{v.numberOfOpenings}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("Applicants")}</span>
                  <span className="font-extrabold text-indigo-600 font-mono">{applicantCount}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedVacancyId(v.id); }}
                  className="flex items-center gap-0.5 text-violet-600 hover:text-violet-700 font-bold transition-all"
                >
                  <span>{t("Open")}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredVacancies.length === 0 && (
          <div className="col-span-full text-center py-12 text-xs text-slate-400 italic bg-white border border-dashed border-slate-200 rounded-xl">
            {t("No vacancies match the current filters.")}
          </div>
        )}
      </div>

      {/* VACANCY DETAIL MODAL */}
      {selectedVacancy && (
        <div id="vacancy-detail-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-6xl max-h-[92vh] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50 rounded-t-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selectedVacancy.title}</h2>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${STATUS_BADGE[selectedVacancy.status]}`}>
                    {selectedVacancy.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {selectedVacancy.residentName} &bull; {selectedVacancy.location} &bull; {selectedVacancy.seniority} &bull; {selectedVacancy.employmentType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isReadOnly && (
                  <button
                    onClick={() => openEditModal(selectedVacancy)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t("Edit")}
                  </button>
                )}
                {!isReadOnly && (
                  <button
                    onClick={() => handleDeleteVacancy(selectedVacancy.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("Delete")}
                  </button>
                )}
                <button onClick={() => setSelectedVacancyId(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{t("Openings")}</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedVacancy.numberOfOpenings}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{t("Salary")}</span>
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    {selectedVacancy.salaryMin || selectedVacancy.salaryMax
                      ? `$${selectedVacancy.salaryMin ?? "?"}-${selectedVacancy.salaryMax ?? "?"}`
                      : t("Not specified")}
                    {selectedVacancy.salaryNegotiable ? ` (${t("negotiable")})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{t("Deadline")}</span>
                  <span className="font-bold text-slate-800 font-mono flex items-center gap-1">
                    <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                    {selectedVacancy.deadlineDate || t("Open-ended")}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">{t("Min. English")}</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedVacancy.englishLevel || t("Not required")}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t("Description")}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{selectedVacancy.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t("Required Skills")}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedVacancy.requiredSkills || []).map((s, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg font-medium text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
                {(selectedVacancy.preferredSkills || []).length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t("Preferred Skills")}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedVacancy.preferredSkills || []).map((s, i) => (
                        <span key={i} className="text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg font-medium text-indigo-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Matching candidates panel */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  {t("Matching Candidates")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rankedCandidates.map(({ talent: candidate, match }) => {
                    const alreadyApplied = vacancyApplications.some((a) => a.vacancyId === selectedVacancy.id && a.talentId === candidate.id);
                    return (
                      <div key={candidate.id} className="border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{candidate.fullName}</span>
                            <span className="text-[10px] text-slate-500">{candidate.major} &bull; {candidate.university}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border font-mono ${scoreTierClasses(match.score)}`}>
                            {match.score}/100
                          </span>
                        </div>
                        {match.missingRequiredSkills.length > 0 && (
                          <p className="text-[10px] text-rose-600">
                            {t("Missing")}: {match.missingRequiredSkills.join(", ")}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => openExplainModal(candidate, selectedVacancy)}
                            className="flex items-center gap-1 text-[10px] font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            {t("Explain match")}
                          </button>
                          {!isReadOnly && (
                            <button
                              disabled={alreadyApplied}
                              onClick={() => handleAddApplicant(selectedVacancy, candidate, match)}
                              className={`flex items-center gap-1 text-[10px] font-bold ml-auto px-2 py-1 rounded-lg cursor-pointer ${
                                alreadyApplied
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "bg-violet-600 text-white hover:bg-violet-700"
                              }`}
                            >
                              <UserPlus className="w-3 h-3" />
                              {alreadyApplied ? t("Already Applied") : t("Add as Applicant")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {rankedCandidates.length === 0 && (
                    <div className="col-span-full text-center py-6 text-[11px] text-slate-400 italic">
                      {t("No candidates in the Talent Pool yet.")}
                    </div>
                  )}
                </div>
              </div>

              {/* Applications pipeline board */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("Applications Pipeline")}</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {STAGES.map((stage) => {
                    const apps = applicationsByVacancy(selectedVacancy.id).filter((a) => a.stage === stage);
                    return (
                      <div key={stage} className={`space-y-2 p-3 rounded-xl border shrink-0 w-56 ${STAGE_COLUMN_STYLE[stage]}`}>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                          {stage} ({apps.length})
                        </span>
                        <div className="space-y-2">
                          {apps.map((app) => (
                            <div key={app.id} className="bg-white border border-slate-200 p-2.5 rounded-lg space-y-1.5 relative group">
                              <span className="text-xs font-semibold text-slate-800 block leading-snug pr-4">{app.candidateName}</span>
                              {typeof app.matchScore === "number" && (
                                <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded border font-mono inline-block ${scoreTierClasses(app.matchScore)}`}>
                                  {app.matchScore}/100
                                </span>
                              )}
                              {!isReadOnly && (
                                <select
                                  value={app.stage}
                                  onChange={(e) => handleStageChange(app, e.target.value as VacancyApplicationStage)}
                                  className="w-full text-[9px] border border-slate-200 rounded px-1 py-1 bg-white cursor-pointer font-semibold text-slate-600"
                                >
                                  {STAGES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              )}
                              {!isReadOnly && (
                                <button
                                  onClick={() => handleDeleteApplication(app.id)}
                                  className="absolute top-1.5 right-1.5 text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          {apps.length === 0 && (
                            <div className="text-center py-4 text-[10px] text-slate-400 italic">{t("Empty")}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAIN MATCH MODAL */}
      {explainTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                {t("Match Explanation")}
              </h3>
              <button onClick={() => setExplainTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {explainTarget.talent.fullName} &rarr; {explainTarget.vacancy.title}
            </p>
            {explainLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-4 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Generating explanation...")}
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-700 leading-relaxed">{explainResult?.explanation}</p>
                {explainResult && !explainResult.usedAI && (
                  <p className="text-[9px] text-slate-400 italic">{t("Deterministic phrasing (AI explainer unavailable).")}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* POST / EDIT VACANCY MODAL */}
      {showPostModal && (
        <div id="post-vacancy-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingVacancyId ? t("Edit Vacancy") : t("Post New Vacancy")}
              </h2>
              <button onClick={() => { setShowPostModal(false); setEditingVacancyId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVacancy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Resident Company *")}</label>
                  <select
                    required
                    value={formData.residentId}
                    onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    <option value="">{t("Select resident...")}</option>
                    {residents.map((r) => (
                      <option key={r.id} value={r.id}>{r.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Job Title *")}</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("e.g. Frontend Developer (React)")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Department")}</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Location *")}</label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t("e.g. Qarshi (on-site), Remote, Hybrid")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Employment Type")}</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as VacancyEmploymentType })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    {EMPLOYMENT_TYPES.map((et) => (<option key={et} value={et}>{et}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Seniority")}</label>
                  <select
                    value={formData.seniority}
                    onChange={(e) => setFormData({ ...formData, seniority: e.target.value as VacancySeniority })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    {SENIORITY_LEVELS.map((sl) => (<option key={sl} value={sl}>{sl}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Number of Openings")}</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.numberOfOpenings}
                    onChange={(e) => setFormData({ ...formData, numberOfOpenings: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Status")}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as VacancyStatus })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    {VACANCY_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Min. English Level")}</label>
                  <select
                    value={formData.englishLevel}
                    onChange={(e) => setFormData({ ...formData, englishLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    <option value="">{t("Not required")}</option>
                    {ENGLISH_LEVELS.map((lvl) => (<option key={lvl} value={lvl}>{lvl}</option>))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Application Deadline")}</label>
                  <input
                    type="date"
                    value={formData.deadlineDate}
                    onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Salary Min (USD/mo)")}</label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Salary Max (USD/mo)")}</label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value === "" ? "" : Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    id="salary-negotiable"
                    type="checkbox"
                    checked={formData.salaryNegotiable}
                    onChange={(e) => setFormData({ ...formData, salaryNegotiable: e.target.checked })}
                    className="cursor-pointer"
                  />
                  <label htmlFor="salary-negotiable" className="text-xs font-semibold text-slate-600 cursor-pointer">{t("Negotiable")}</label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Description *")}</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Required Skills (comma-separated)")}</label>
                  <input
                    type="text"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    placeholder={t("React, Node.js, PostgreSQL...")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Preferred Skills (comma-separated)")}</label>
                  <input
                    type="text"
                    value={formData.preferredSkills}
                    onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Contact Person")}</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Contact Email")}</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowPostModal(false); setEditingVacancyId(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-violet-600/10"
                >
                  {editingVacancyId ? t("Save Changes") : t("Post Vacancy")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
