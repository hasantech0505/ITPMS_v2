/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Building2, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  CheckCircle,
  Phone,
  Mail,
  Send
} from "lucide-react";
import { Resident, KASHKADARYA_DISTRICTS } from "../../../types";
import { PipelineStage, PIPELINE_STAGES, DEFAULT_PROBABILITIES } from "./pipelineTypes";

interface LeadWorkspaceDrawerProps {
  lead: Resident;
  onClose: () => void;
  onUpdate: (id: string, updated: Partial<Resident>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPromoteClick: (lead: Resident) => void;
  userRole: string;
  onSyncState?: () => void;
}

export default function LeadWorkspaceDrawer({
  lead,
  onClose,
  onUpdate,
  onDelete,
  onPromoteClick,
  userRole,
  onSyncState
}: LeadWorkspaceDrawerProps) {
  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;
  const [activeTab, setActiveTab] = useState<"profile" | "notes" | "ai_strategy">("profile");

  // Form State
  const [editForm, setEditForm] = useState<Partial<Resident>>({
    companyName: lead.companyName,
    director: lead.director || lead.potentialFounder,
    potentialFounder: lead.potentialFounder || lead.director,
    industry: lead.industry,
    district: lead.district || "Qarshi",
    exportVolume: lead.exportVolume || 0,
    domesticVolume: lead.domesticVolume || 0,
    potentialStage: lead.potentialStage || "New Lead",
    potentialProbability: lead.potentialProbability ?? DEFAULT_PROBABILITIES[lead.potentialStage as PipelineStage || "New Lead"],
    potentialOwner: lead.potentialOwner || "",
    potentialNextFollowUp: lead.potentialNextFollowUp || "",
    email: lead.email || "",
    phone: lead.phone || "",
    telegram: lead.telegram || ""
  });

  const [newNoteInput, setNewNoteInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [aiStrategyResult, setAiStrategyResult] = useState<string | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Handle saving lead profile changes
  const handleSaveLeadChanges = async () => {
    setIsSaving(true);
    try {
      await onUpdate(lead.id, editForm);
      if (onSyncState) onSyncState();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle appending note
  const handleAddNote = async () => {
    if (!newNoteInput.trim()) return;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newNote = `[${timestamp}] ${newNoteInput.trim()}`;
    const updatedNotes = [newNote, ...(lead.notes || [])];

    await onUpdate(lead.id, { notes: updatedNotes });
    setNewNoteInput("");
    if (onSyncState) onSyncState();
  };

  // Generate Gemini Deal Conversion Strategy
  const handleGenerateAiStrategy = async () => {
    setIsGeneratingStrategy(true);
    try {
      const res = await fetch("/api/ai/lead-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: editForm.companyName || lead.companyName,
          industry: editForm.industry || lead.industry,
          founder: editForm.potentialFounder || lead.potentialFounder || lead.director,
          district: editForm.district || lead.district || "Qarshi",
          exportVolume: editForm.exportVolume || lead.exportVolume || 0,
          stage: editForm.potentialStage || lead.potentialStage,
          probability: editForm.potentialProbability || lead.potentialProbability,
          owner: editForm.potentialOwner || lead.potentialOwner,
        }),
      });
      const data = await res.json();
      setAiStrategyResult(data.strategy || "AI strategy generation completed.");
    } catch (err: any) {
      console.error(err);
      setAiStrategyResult(
        `IT PARK KASHKADARYA CONVERSION PLAYBOOK:\n` +
        `• Target: $${((editForm.exportVolume || 0) / 1000).toFixed(0)}k USD software exports.\n` +
        `• Key Pitch: Special tax exemption certificate under IT Park Uzbekistan legislation.\n` +
        `• District Focus: Leverage ${editForm.district || "Qarshi"} regional office incentives.`
      );
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  return (
    <div 
      id="lead-workspace-drawer"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-xl md:max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-mono">
                Lead 360 Workspace
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {lead.id.substring(0, 8)}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 truncate mt-1">
              {editForm.companyName || lead.companyName}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick promote to resident workflow button */}
            {!isReadOnly && (
              <button
                onClick={() => onPromoteClick(lead)}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all shadow-xs"
                title="Convert this lead into a certified resident"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Certify Resident</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Navigation Subtabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 gap-2 sm:gap-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "profile" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Profile & Terms</span>
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "notes" 
                ? "border-emerald-600 text-emerald-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notes & Logs ({lead.notes?.length || 0})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("ai_strategy");
              if (!aiStrategyResult) handleGenerateAiStrategy();
            }}
            className={`py-3 text-xs font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "ai_strategy" 
                ? "border-indigo-600 text-indigo-700" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Pitch Strategy</span>
          </button>
        </div>

        {/* Drawer Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: PROFILE & DETAILS */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              {/* Pipeline Stage & Probability slider */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Pipeline Stage
                    </label>
                    <select
                      value={editForm.potentialStage || "New Lead"}
                      onChange={(e) => {
                        const newStage = e.target.value as PipelineStage;
                        setEditForm({
                          ...editForm,
                          potentialStage: newStage,
                          potentialProbability: DEFAULT_PROBABILITIES[newStage]
                        });
                      }}
                      disabled={isReadOnly}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Win Probability
                      </label>
                      <span className="text-xs font-bold font-mono text-emerald-600">
                        {editForm.potentialProbability ?? 20}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editForm.potentialProbability ?? 20}
                      onChange={(e) => setEditForm({ ...editForm, potentialProbability: Number(e.target.value) })}
                      disabled={isReadOnly}
                      className="w-full mt-2 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Core Company Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Company Registered Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.companyName || ""}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Director / Founder *
                  </label>
                  <input
                    type="text"
                    value={editForm.potentialFounder || editForm.director || ""}
                    onChange={(e) => setEditForm({ ...editForm, director: e.target.value, potentialFounder: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Industry Vertical
                  </label>
                  <input
                    type="text"
                    value={editForm.industry || ""}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kashkadarya District *
                  </label>
                  <select
                    value={editForm.district || "Qarshi"}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    {KASHKADARYA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Target Export ($ USD/yr)
                  </label>
                  <input
                    type="number"
                    value={editForm.exportVolume || 0}
                    onChange={(e) => setEditForm({ ...editForm, exportVolume: Number(e.target.value) })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Target Domestic ($ USD/yr)
                  </label>
                  <input
                    type="number"
                    value={editForm.domesticVolume || 0}
                    onChange={(e) => setEditForm({ ...editForm, domesticVolume: Number(e.target.value) })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Lead Owner
                  </label>
                  <input
                    type="text"
                    value={editForm.potentialOwner || ""}
                    onChange={(e) => setEditForm({ ...editForm, potentialOwner: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Next Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={editForm.potentialNextFollowUp || ""}
                    onChange={(e) => setEditForm({ ...editForm, potentialNextFollowUp: e.target.value })}
                    disabled={isReadOnly}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Direct Contacts Info */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Direct Contacts</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="info@company.uz"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded-md text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+998 90..."
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded-md text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Telegram</label>
                    <input
                      type="text"
                      value={editForm.telegram || ""}
                      onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                      placeholder="@handle"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded-md text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTES & TIMELINE */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              {!isReadOnly && (
                <div className="space-y-2 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <label className="text-xs font-bold text-slate-800 block">
                    Add Interaction Note / Meeting Log
                  </label>
                  <textarea
                    rows={3}
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    placeholder="e.g. Call with founder. Agreed to apply for residency in Q2..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNoteInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Append Note</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Interaction History ({lead.notes?.length || 0})
                </h4>
                {lead.notes && lead.notes.length > 0 ? (
                  <div className="space-y-2">
                    {lead.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-700 shadow-2xs">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 rounded-lg border border-slate-100">
                    No previous interaction notes logged for this lead.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI CONVERSION STRATEGY & TAX CALCULATOR */}
          {activeTab === "ai_strategy" && (
            <div className="space-y-4">
              {/* IT Park Tax Savings Simulator */}
              <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white p-4 sm:p-5 rounded-xl space-y-3 border border-emerald-800/40 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                      Tax Incentives Simulator
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    0% CIT / 0% VAT
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-800/50 text-center">
                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/30">
                    <span className="text-[9px] text-slate-300 block uppercase font-mono">Export Margin</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ${((editForm.exportVolume || lead.exportVolume || 0) / 1000).toFixed(0)}k USD
                    </span>
                  </div>

                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/30">
                    <span className="text-[9px] text-slate-300 block uppercase font-mono">Est CIT Saved</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ${Math.round((editForm.exportVolume || lead.exportVolume || 0) * 0.15).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/30">
                    <span className="text-[9px] text-slate-300 block uppercase font-mono">PIT Rate</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      7.5% (vs 12%)
                    </span>
                  </div>

                  <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/30">
                    <span className="text-[9px] text-slate-300 block uppercase font-mono">Customs Duty</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      0% Exemption
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini AI Deal Conversion Advisor */}
              <div className="bg-slate-900 text-slate-200 p-4 sm:p-5 rounded-xl space-y-3 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                      Gemini Deal Advisor
                    </span>
                  </div>

                  <button
                    onClick={handleGenerateAiStrategy}
                    disabled={isGeneratingStrategy}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingStrategy ? "Synthesizing..." : "Re-Generate"}</span>
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-300 min-h-[160px]">
                  {aiStrategyResult ? (
                    aiStrategyResult
                  ) : (
                    <span className="text-slate-500 italic font-sans">
                      Click "Re-Generate" to create a bespoke pitch strategy for this enterprise.
                    </span>
                  )}
                </div>

                {aiStrategyResult && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiStrategyResult);
                        setCopyFeedback(true);
                        setTimeout(() => setCopyFeedback(false), 2000);
                      }}
                      className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline font-bold cursor-pointer"
                    >
                      {copyFeedback ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copyFeedback ? "Copied to Clipboard!" : "Copy Pitch Script"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {!isReadOnly ? (
            <button
              onClick={async () => {
                if (confirm(`Are you sure you want to delete lead "${lead.companyName}"?`)) {
                  await onDelete(lead.id);
                  if (onSyncState) onSyncState();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            >
              Cancel
            </button>

            {!isReadOnly && (
              <button
                onClick={handleSaveLeadChanges}
                disabled={isSaving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-all shadow-2xs disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
