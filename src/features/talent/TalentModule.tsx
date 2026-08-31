/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users2, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  X, 
  ChevronRight, 
  FileCheck, 
  Github, 
  GraduationCap, 
  Trash2,
  Award,
  BookOpen,
  Pencil
} from "lucide-react";
import { Talent, TalentStatus } from "../../types";
import ExportImportManager from "../../components/ExportImportManager";
import { useLanguage } from "../../lib/LanguageContext";

interface TalentModuleProps {
  talent: Talent[];
  onAdd: (talent: Omit<Talent, "id">) => Promise<void>;
  onUpdate: (id: string, talent: Partial<Talent>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

export default function TalentModule({ talent, onAdd, onUpdate, onDelete, userRole, onSyncState }: TalentModuleProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("ALL");
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTalentId, setEditingTalentId] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    university: "Tashkent University of Information Technologies (TUIT)",
    major: "",
    graduationYear: 2026,
    skills: "React, TypeScript",
    status: TalentStatus.CANDIDATE,
    phone: "",
    email: "",
    englishLevel: "B2" as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
    gitHubUrl: "",
    codingScore: 85,
    englishScore: 80,
    softSkillsScore: 80,
    certifications: "EF SET B2 English"
  });

  // Extract all unique skills across all talents
  const allSkills = Array.from(new Set(talent.flatMap(t => t.skills || [])));

  // Filter Logic
  const filteredTalent = talent.filter(t => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = (t.fullName || "").toLowerCase().includes(query) ||
                          (t.university || "").toLowerCase().includes(query) ||
                          (t.major || "").toLowerCase().includes(query);
    const matchesSkill = skillFilter === "ALL" || (t.skills || []).includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  const DEFAULT_TALENT_FORM = {
    fullName: "",
    university: "Tashkent University of Information Technologies (TUIT)",
    major: "",
    graduationYear: 2026,
    skills: "React, TypeScript",
    status: TalentStatus.CANDIDATE,
    phone: "",
    email: "",
    englishLevel: "B2" as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
    gitHubUrl: "",
    codingScore: 85,
    englishScore: 80,
    softSkillsScore: 80,
    certifications: "EF SET B2 English"
  };

  const handleOpenEditTalent = (candidate: Talent) => {
    setFormData({
      fullName: candidate.fullName || "",
      university: candidate.university || DEFAULT_TALENT_FORM.university,
      major: candidate.major || "",
      graduationYear: candidate.graduationYear || 2026,
      skills: (candidate.skills || []).join(", "),
      status: candidate.status,
      phone: candidate.phone || "",
      email: candidate.email || "",
      englishLevel: candidate.englishLevel || "B2",
      gitHubUrl: candidate.gitHubUrl || "",
      codingScore: candidate.testScores?.coding ?? 80,
      englishScore: candidate.testScores?.english ?? 80,
      softSkillsScore: candidate.testScores?.softSkills ?? 80,
      certifications: (candidate.certifications || []).join(", ")
    });
    setEditingTalentId(candidate.id);
    setSelectedTalent(null);
    setShowAddModal(true);
  };

  const handleRegisterTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.major) {
      alert(t("Full Name, Major and Email are required"));
      return;
    }

    const payload = {
      fullName: formData.fullName,
      university: formData.university,
      major: formData.major,
      graduationYear: Number(formData.graduationYear) || 2026,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      status: formData.status,
      phone: formData.phone || "+998 90 000 00 00",
      email: formData.email,
      englishLevel: formData.englishLevel,
      gitHubUrl: formData.gitHubUrl || undefined,
      certifications: formData.certifications.split(",").map(c => c.trim()).filter(Boolean),
      testScores: {
        coding: Number(formData.codingScore) || 80,
        english: Number(formData.englishScore) || 80,
        softSkills: Number(formData.softSkillsScore) || 80
      }
    };

    if (editingTalentId) {
      await onUpdate(editingTalentId, payload);
    } else {
      await onAdd(payload);
    }

    setShowAddModal(false);
    setEditingTalentId(null);
    setFormData(DEFAULT_TALENT_FORM);
  };

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  return (
    <div id="talent-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t("Talent Pool Directory")}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t("Vetted pool of Uzbekistan's technology students and developers matched with IT Residents.")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportImportManager
            module="talent"
            moduleTitle={t("Talent Pool Directory")}
            data={talent}
            columns={[
              { key: "fullName", label: "Full Name", required: true, type: "string" },
              { key: "email", label: "Email", required: true, type: "email" },
              { key: "phone", label: "Phone", type: "phone" },
              { key: "university", label: "University", type: "string" },
              { key: "major", label: "Major", required: true, type: "string" },
              { key: "graduationYear", label: "Graduation Year", type: "number" },
              { key: "englishLevel", label: "English Level", type: "string" },
              { key: "gitHubUrl", label: "GitHub URL", type: "string" },
              { key: "status", label: "Status", type: "string" }
            ]}
            onImportCompleted={() => onSyncState && onSyncState()}
            userRole={userRole as any}
          />
          {!isReadOnly && (
            <button
              id="add-candidate-btn"
              onClick={() => { setEditingTalentId(null); setFormData(DEFAULT_TALENT_FORM); setShowAddModal(true); }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-600/10 h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>{t("Add Candidate")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview stats widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Indexed Talents")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{talent.length} {t("Engineers")}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-x border-slate-200 md:px-6 py-3 md:py-0">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Top Universities")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{t("TUIT, Inha, WIUT, Amity")}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Average Coding Score")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">86% {t("Proficiency")}</span>
          </div>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="talent-search-input"
            type="text"
            placeholder={t("Search candidate name, major, university...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
          />
        </div>

        <select
          id="skill-filter-select"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white cursor-pointer w-full md:w-44"
        >
          <option value="ALL">{t("All Skills")}</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Grid Layout of Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTalent.map((c) => (
          <div
            id={`talent-card-${c.id}`}
            key={c.id}
            onClick={() => setSelectedTalent(c)}
            className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-emerald-600">
                    {c.fullName.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{c.fullName}</h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{c.major}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  c.status === "EMPLOYED" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="flex items-start gap-1.5 text-[10px] text-slate-500 mt-4">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{c.university} ({c.graduationYear})</span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {c.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-[9px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-medium text-slate-600">
                    {skill}
                  </span>
                ))}
                {c.skills.length > 3 && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">
                    +{c.skills.length - 3} {t("more")}
                  </span>
                )}
              </div>
            </div>

            {/* Test Indicators */}
            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("Coding Score")}</span>
                <span className="font-extrabold text-slate-800 font-mono">{c.testScores.coding}%</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("English Lvl")}</span>
                <span className="font-extrabold text-indigo-600 font-mono">{c.englishLevel}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedTalent(c); }}
                className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-bold transition-all"
              >
                <span>{t("Inspect")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL DRAWER */}
      {selectedTalent && (
        <div id="talent-detail-drawer" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-indigo-600 border border-slate-200">
                  {selectedTalent.fullName.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selectedTalent.fullName}</h2>
                  <span className="text-xs text-slate-500">{selectedTalent.status} &bull; {t("English")} {selectedTalent.englishLevel}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTalent(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Academics */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Academic Track")}</h3>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>{selectedTalent.university}</span>
                  </div>
                  <p className="text-slate-600 pl-6">{selectedTalent.major} &bull; {t("Expected Class of")} {selectedTalent.graduationYear}</p>
                </div>
              </div>

              {/* Skills and Github */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono font-bold">{t("Skills Inventory")}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTalent.skills.map((s, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-medium text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>

                {selectedTalent.gitHubUrl && (
                  <a
                    id="github-profile-link"
                    href={selectedTalent.gitHubUrl}
                    target="_blank"
                    rel="referrer"
                    className="flex items-center gap-2 p-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold justify-center hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>{t("View GitHub Portfolio")}</span>
                  </a>
                )}
              </div>

              {/* Verified Test Indicators */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Platform Audit Scores")}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{t("Coding Proficiency")}</span>
                      <span className="font-mono">{selectedTalent.testScores.coding}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedTalent.testScores.coding}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{t("English Grammar & Speaking")}</span>
                      <span className="font-mono">{selectedTalent.testScores.english}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedTalent.testScores.english}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{t("Soft Skills (Behavioral Audit)")}</span>
                      <span className="font-mono">{selectedTalent.testScores.softSkills}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedTalent.testScores.softSkills}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications and credentials list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Indexed Credentials")}</h3>
                <div className="space-y-2">
                  {selectedTalent.certifications?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              {!isReadOnly && (
                <button
                  id="delete-talent-btn"
                  onClick={async () => { await onDelete(selectedTalent.id); setSelectedTalent(null); }}
                  className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  {t("Delete Profile")}
                </button>
              )}
              {!isReadOnly && (
                <button
                  id="edit-talent-btn"
                  onClick={() => handleOpenEditTalent(selectedTalent)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {t("Edit Profile")}
                </button>
              )}
              <button
                onClick={() => setSelectedTalent(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
              >
                {t("Close specs")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER CANDIDATE MODAL */}
      {showAddModal && (
        <div id="add-talent-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingTalentId ? t("Edit Developer Profile") : t("Register Developer Profile")}
              </h2>
              <button onClick={() => { setShowAddModal(false); setEditingTalentId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterTalent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Full Legal Name *")}</label>
                  <input
                    id="form-talent-name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t("Candidate Full Name")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Major Field *")}</label>
                  <input
                    id="form-talent-major"
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder={t("e.g. Computer Science")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("University *")}</label>
                  <select
                    id="form-talent-uni"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer font-medium text-slate-700"
                  >
                    <option value="Tashkent University of Information Technologies (TUIT)">{t("Tashkent University of Information Technologies (TUIT)")}</option>
                    <option value="Inha University in Tashkent (IUT)">{t("Inha University in Tashkent (IUT)")}</option>
                    <option value="Westminster International University in Tashkent (WIUT)">{t("Westminster International University in Tashkent (WIUT)")}</option>
                    <option value="Amity University in Tashkent">{t("Amity University in Tashkent")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Graduation Year")}</label>
                  <input
                    id="form-talent-grad"
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Email Address *")}</label>
                  <input
                    id="form-talent-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("candidate@gmail.com")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Phone number")}</label>
                  <input
                    id="form-talent-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t("+998 9...")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("English Level")}</label>
                  <select
                    id="form-talent-english"
                    value={formData.englishLevel}
                    onChange={(e) => setFormData({ ...formData, englishLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("GitHub Profile URL")}</label>
                  <input
                    id="form-talent-github"
                    type="url"
                    value={formData.gitHubUrl}
                    onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
                    placeholder={t("https://github.com/...")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Technical Skills (comma-separated)")}</label>
                <input
                  id="form-talent-skills"
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder={t("React, Node.js, Python...")}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Coding Score %")}</label>
                  <input
                    id="form-talent-coding"
                    type="number"
                    value={formData.codingScore}
                    onChange={(e) => setFormData({ ...formData, codingScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("English Score %")}</label>
                  <input
                    id="form-talent-english-pct"
                    type="number"
                    value={formData.englishScore}
                    onChange={(e) => setFormData({ ...formData, englishScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Soft Skills %")}</label>
                  <input
                    id="form-talent-soft"
                    type="number"
                    value={formData.softSkillsScore}
                    onChange={(e) => setFormData({ ...formData, softSkillsScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingTalentId(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  id="submit-talent-register"
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  {editingTalentId ? t("Save Changes") : t("Register Candidate")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
