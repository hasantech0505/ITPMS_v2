/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { Resident, ResidentStatus } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface PromoteLeadModalProps {
  lead: Resident;
  onClose: () => void;
  onUpdate: (id: string, updated: Partial<Resident>) => Promise<void>;
  onSyncState?: () => void;
}

export default function PromoteLeadModal({
  lead,
  onClose,
  onUpdate,
  onSyncState
}: PromoteLeadModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    registrationNumber: lead.registrationNumber?.startsWith("POT-") ? "" : (lead.registrationNumber || ""),
    legalAddress: lead.legalAddress || `${lead.district || "Qarshi"}, Mustaqillik Avenue 10`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.registrationNumber.trim() || !formData.legalAddress.trim()) {
      alert(t("INN (9 digits) and Legal Address are required for certification."));
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(lead.id, {
        registrationNumber: formData.registrationNumber.trim(),
        legalAddress: formData.legalAddress.trim(),
        status: ResidentStatus.ACTIVE,
        potentialStage: "Upcoming Resident",
        potentialProbability: 100,
        notes: [
          `[Certification Approval: ${new Date().toISOString().split("T")[0]}] Promoted from Pipeline Deal to Certified Resident Status.`,
          ...(lead.notes || [])
        ]
      });

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
      id="promote-lead-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              {t("Certify & Promote Lead")}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t("Promoting")} <b>{lead.companyName}</b> {t("into the official IT Park certified resident register. Enter their state tax registration number (INN) and official legal address.")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t("INN Tax Number (9 Digits) *")}
            </label>
            <input
              type="text"
              required
              pattern="\d{9}"
              title={t("INN tax number must be exactly 9 digits.")}
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              placeholder={t("e.g. 301456987")}
              className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t("Official Legal Address *")}
            </label>
            <input
              type="text"
              required
              value={formData.legalAddress}
              onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
              placeholder={t("e.g. Qarshi city, Mustaqillik street 42")}
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
              {isSubmitting ? t("Certifying...") : t("Confirm Certification")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
