/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Settings, Calendar, Sliders, ShieldCheck, RefreshCw } from "lucide-react";
import { AuditDeadlineConfig } from "./auditTypes";

interface AuditSettingsModalProps {
  config: AuditDeadlineConfig;
  onClose: () => void;
  onSave: (newConfig: AuditDeadlineConfig) => void;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July (Standard Statutory Month)" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export default function AuditSettingsModal({
  config,
  onClose,
  onSave
}: AuditSettingsModalProps) {
  const [dueMonth, setDueMonth] = useState(config.dueMonth);
  const [dueDay, setDueDay] = useState(config.dueDay);
  const [urgentDays, setUrgentDays] = useState(config.urgentThresholdDays);
  const [attentionDays, setAttentionDays] = useState(config.attentionThresholdDays);
  const [regulatoryNote, setRegulatoryNote] = useState(config.regulatoryNote);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      dueMonth,
      dueDay,
      urgentThresholdDays: Number(urgentDays) || 14,
      attentionThresholdDays: Number(attentionDays) || 30,
      notificationDays: [30, 14, 7, 1],
      regulatoryNote: regulatoryNote.trim()
    });
    onClose();
  };

  return (
    <div 
      id="audit-settings-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl border border-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Audit Compliance Regulatory Settings
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                Configure Statutory Deadlines & Risk Monitoring Rules
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Dynamic Statutory Deadline Formula:
            </div>
            <p className="font-mono text-xs bg-white/90 p-2 rounded-lg border border-emerald-200 text-emerald-900 font-bold">
              Due Date = (Reporting Year + 1) + Month ({dueMonth}) + Day ({dueDay})
            </p>
            <p className="text-[11px] text-emerald-800">
              Example: Reporting Year <b>2025</b> → Due Date <b>{2025 + 1}-{String(dueMonth).padStart(2, "0")}-{String(dueDay).padStart(2, "0")}</b>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Statutory Due Month *
              </label>
              <select
                value={dueMonth}
                onChange={(e) => setDueMonth(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Statutory Due Day *
              </label>
              <input
                type="number"
                min={1}
                max={31}
                required
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Threshold Configuration (Days Before Deadline)
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                  Attention Threshold (Days)
                </label>
                <input
                  type="number"
                  min={15}
                  max={60}
                  value={attentionDays}
                  onChange={(e) => setAttentionDays(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                />
                <span className="text-[10px] text-slate-400">Default: 30 days remaining</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                  Urgent Threshold (Days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={urgentDays}
                  onChange={(e) => setUrgentDays(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold"
                />
                <span className="text-[10px] text-slate-400">Default: 14 days remaining</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Regulatory Basis Reference
            </label>
            <textarea
              rows={2}
              value={regulatoryNote}
              onChange={(e) => setRegulatoryNote(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Apply & Recalculate</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
