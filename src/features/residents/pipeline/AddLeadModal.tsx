/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Plus, Building2 } from "lucide-react";
import { Resident, ResidentStatus, KASHKADARYA_DISTRICTS } from "../../../types";
import { DEFAULT_PROBABILITIES, PipelineStage } from "./pipelineTypes";
import { useLanguage } from "../../../lib/LanguageContext";

interface AddLeadModalProps {
  onClose: () => void;
  onAdd: (resident: Omit<Resident, "id">) => Promise<void>;
  onSyncState?: () => void;
}

export default function AddLeadModal({ onClose, onAdd, onSyncState }: AddLeadModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    companyName: "",
    founder: "",
    industry: "Software Development",
    district: "Qarshi",
    exportVolume: 120000,
    domesticVolume: 50000,
    probability: 20,
    owner: "Olim Shokirov",
    source: "Kashkadarya Tech Expo 2026",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.founder.trim()) {
      alert(t("Company Name and Founder are required."));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<Resident, "id"> = {
        companyName: formData.companyName.trim(),
        director: formData.founder.trim(),
        registrationNumber: `POT-${Math.floor(100000 + Math.random() * 900000)}`,
        legalAddress: `${formData.district} District, Kashkadarya Region`,
        employeesCount: 10,
        exportVolume: Number(formData.exportVolume) || 0,
        domesticVolume: Number(formData.domesticVolume) || 0,
        status: ResidentStatus.POTENTIAL,
        industry: formData.industry,
        district: formData.district,
        benefitsApplied: ["0% Corporate Income Tax", "7.5% Personal Income Tax"],
        appliedAt: new Date().toISOString().split("T")[0],
        documents: [],
        potentialStage: "New Lead",
        potentialProbability: Number(formData.probability) || DEFAULT_PROBABILITIES["New Lead"],
        potentialOwner: formData.owner.trim() || "Unassigned",
        potentialNextFollowUp: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        potentialFounder: formData.founder.trim(),
        notes: formData.notes ? [`[Initial Lead Source: ${formData.source}] ${formData.notes}`] : [`Initial lead recorded via outreach source: ${formData.source}`]
      };

      await onAdd(payload);
      if (onSyncState) onSyncState();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="add-lead-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                {t("Create Potential Resident Lead")}
              </h2>
              <span className="text-[10px] text-slate-400 font-medium block">
                {t("Add a new tech enterprise to the IT Park outreach pipeline.")}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Company Name *")}
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder={t("e.g. QarshiSoft Dynamics")}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Founder / Director *")}
              </label>
              <input
                type="text"
                required
                value={formData.founder}
                onChange={(e) => setFormData({ ...formData, founder: e.target.value })}
                placeholder={t("e.g. Alisher Norov")}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Industry Vertical")}
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                <option value="Software Development">{t("Software Development")}</option>
                <option value="FinTech">{t("FinTech")}</option>
                <option value="BPO & IT Outsourcing">{t("BPO & IT Outsourcing")}</option>
                <option value="GameDev & Animation">{t("GameDev & Animation")}</option>
                <option value="EdTech">{t("EdTech")}</option>
                <option value="E-Commerce & AI">{t("E-Commerce & AI")}</option>
                <option value="Cybersecurity">{t("Cybersecurity")}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("District in Kashkadarya")}
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
              >
                {KASHKADARYA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist} {t("District")}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Target Annual Export ($ USD)")}
              </label>
              <input
                type="number"
                value={formData.exportVolume}
                onChange={(e) => setFormData({ ...formData, exportVolume: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Initial Probability %")}
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Lead Owner")}
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t("Lead Source")}
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t("Initial Notes & Context")}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("Key notes from initial discussions, export products, tech stack...")}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? t("Creating...") : t("Save Lead")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
