/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Target, Save } from "lucide-react";
import { CalculatedKPI } from "../types/kpiTypes";

const UNIT_HINT: Record<string, string> = {
  count: "raw count",
  currency_usd: "USD",
  currency_uzs_b: "Billion UZS",
  sqm: "square meters (m²)"
};

interface EditKpiTargetModalProps {
  kpi: CalculatedKPI;
  onClose: () => void;
  onSave: (annualTarget: number, quarterlyTargets: { q1: number; q2: number; q3: number; q4: number }) => void;
  t: (key: string, fallback?: string) => string;
}

export default function EditKpiTargetModal({ kpi, onClose, onSave, t }: EditKpiTargetModalProps) {
  const [annualTarget, setAnnualTarget] = useState<number>(kpi.annualTarget);
  const [q1, setQ1] = useState<number>(kpi.quarterlyTargets.q1);
  const [q2, setQ2] = useState<number>(kpi.quarterlyTargets.q2);
  const [q3, setQ3] = useState<number>(kpi.quarterlyTargets.q3);
  const [q4, setQ4] = useState<number>(kpi.quarterlyTargets.q4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(annualTarget, { q1, q2, q3, q4 });
    onClose();
  };

  const inputClass =
    "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500";

  return (
    <div
      id="edit-kpi-target-modal"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              {t("Edit KPI Target")}
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {t(kpi.nameKey, kpi.defaultName)}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-[11px] text-slate-400 font-medium">
            {t("Values entered in")}: <span className="font-bold text-slate-600">{UNIT_HINT[kpi.unit] || kpi.unit}</span>
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("Annual Target (2026)")} *
            </label>
            <input
              id="kpi-annual-target-input"
              type="number"
              required
              step="any"
              value={annualTarget}
              onChange={(e) => setAnnualTarget(parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("Quarterly Targets")}
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t("Q1")}</span>
                <input
                  type="number"
                  step="any"
                  value={q1}
                  onChange={(e) => setQ1(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t("Q2")}</span>
                <input
                  type="number"
                  step="any"
                  value={q2}
                  onChange={(e) => setQ2(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t("Q3")}</span>
                <input
                  type="number"
                  step="any"
                  value={q3}
                  onChange={(e) => setQ3(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t("Q4")}</span>
                <input
                  type="number"
                  step="any"
                  value={q4}
                  onChange={(e) => setQ4(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {t("Save Target")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
