/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Strategic Planning & Roadmap module — the in-app home for "what's next"
 * across the entire ITPMS platform. Each plan item is a concrete next step
 * (a feature, a fix, an integration, a process change) tracked with an
 * owner, a target date, a status, and which module of the app it belongs
 * to — turning the rollout roadmap from a static document into something
 * the team can add to, update, and check off as work actually happens.
 */

import React, { useState, useMemo } from "react";
import {
  Milestone,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Loader2,
  Users2,
  PauseCircle,
  ShieldAlert,
  Calendar,
  User,
  LayoutGrid
} from "lucide-react";
import { PlanningItem, PlanningStatus } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

interface PlanningModuleProps {
  planningItems: PlanningItem[];
  onAdd: (payload: Partial<PlanningItem>) => void;
  onUpdate: (id: string, payload: Partial<PlanningItem>) => void;
  onDelete: (id: string) => void;
}

const MODULE_OPTIONS = [
  "Dashboard",
  "Residents",
  "Startups",
  "Infrastructure",
  "Events",
  "CRM",
  "Analytics",
  "Talent",
  "AI / Google Studio",
  "Security",
  "Data & Backups",
  "General / Platform"
];

const STATUS_OPTIONS: PlanningStatus[] = ["IN_PROGRESS", "DONE", "TOGETHER", "OPTIONAL", "BLOCKED"];

function emptyForm(): Partial<PlanningItem> {
  return {
    title: "",
    description: "",
    status: "IN_PROGRESS",
    owner: "",
    targetDate: new Date().toISOString().slice(0, 10),
    module: "General / Platform"
  };
}

export default function PlanningModule({ planningItems, onAdd, onUpdate, onDelete }: PlanningModuleProps) {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const [formData, setFormData] = useState<Partial<PlanningItem>>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<PlanningItem | null>(null);

  const modulesInUse = useMemo(() => {
    const set = new Set(planningItems.map((p) => p.module).filter(Boolean));
    MODULE_OPTIONS.forEach((m) => set.add(m));
    return Array.from(set);
  }, [planningItems]);

  const filteredItems = useMemo(() => {
    return planningItems
      .filter((p) => statusFilter === "all" || p.status === statusFilter)
      .filter((p) => moduleFilter === "all" || p.module === moduleFilter)
      .sort((a, b) => (a.targetDate || "").localeCompare(b.targetDate || ""));
  }, [planningItems, statusFilter, moduleFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { DONE: 0, IN_PROGRESS: 0, TOGETHER: 0, OPTIONAL: 0, BLOCKED: 0 };
    planningItems.forEach((p) => {
      c[p.status] = (c[p.status] || 0) + 1;
    });
    return c;
  }, [planningItems]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyForm());
    setShowFormModal(true);
  };

  const openEditModal = (item: PlanningItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) return;

    if (editingItem) {
      onUpdate(editingItem.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
    } else {
      onAdd({
        ...formData,
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
    }
    setShowFormModal(false);
    setEditingItem(null);
    setFormData(emptyForm());
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const statusBadge = (status: PlanningStatus) => {
    switch (status) {
      case "DONE":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            {t("DONE")}
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Loader2 className="w-3 h-3" />
            {t("IN PROGRESS")}
          </span>
        );
      case "TOGETHER":
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Users2 className="w-3 h-3" />
            {t("TOGETHER")}
          </span>
        );
      case "OPTIONAL":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <PauseCircle className="w-3 h-3" />
            {t("OPTIONAL")}
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <ShieldAlert className="w-3 h-3" />
            {t("BLOCKED")}
          </span>
        );
    }
  };

  const inputClass =
    "w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500";

  return (
    <div id="planning-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <Milestone className="w-5.5 h-5.5 text-emerald-600" />
            {t("Strategic Planning & Roadmap")}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Track what's next across every ITPMS module — features, fixes, and process changes, each with an owner and a target date.")}
          </p>
        </div>
        <button
          id="add-planning-item-btn"
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("Add Plan Item")}</span>
        </button>
      </div>

      {/* Status summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`bg-white border rounded-xl p-3 text-left transition-all cursor-pointer ${
              statusFilter === s ? "border-emerald-400 ring-2 ring-emerald-100" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-2xl font-black text-slate-900">{counts[s] || 0}</div>
            <div className="mt-1">{statusBadge(s)}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-400">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t("Module")}</span>
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
        >
          <option value="all">{t("All Modules")}</option>
          {modulesInUse.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {statusFilter !== "all" && (
          <button
            onClick={() => setStatusFilter("all")}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer ml-auto"
          >
            {t("Clear status filter")} ×
          </button>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {filteredItems.length === 0 && (
          <div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400 font-medium">
            {t("No plan items yet. Add the first roadmap step above.")}
          </div>
        )}

        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
          >
            <div className="md:col-span-7 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <span className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                  {item.module}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-slate-500 mt-1">{item.description}</p>
              )}
            </div>

            <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-1 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" />{item.owner || t("Unassigned")}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" />{item.targetDate}</span>
            </div>

            <div className="md:col-span-2 flex items-center">
              {statusBadge(item.status)}
            </div>

            <div className="md:col-span-1 flex items-center justify-end gap-1.5">
              <button
                onClick={() => openEditModal(item)}
                title={t("Edit")}
                className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                title={t("Delete")}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingItem ? t("Edit Plan Item") : t("Add Plan Item")}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Title")} *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Description")}</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Module")}</label>
                  <select
                    value={formData.module || "General / Platform"}
                    onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                    className={`${inputClass} bg-white cursor-pointer`}
                  >
                    {modulesInUse.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Status")}</label>
                  <select
                    value={formData.status || "IN_PROGRESS"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PlanningStatus })}
                    className={`${inputClass} bg-white cursor-pointer`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Owner")}</label>
                  <input
                    type="text"
                    value={formData.owner || ""}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className={inputClass}
                    placeholder={t("Unassigned")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Target Date")}</label>
                  <input
                    type="date"
                    value={formData.targetDate || ""}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className={`${inputClass} font-mono font-bold`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingItem ? t("Save Changes") : t("Add Plan Item")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-sm font-bold text-slate-800">{t("Delete this plan item?")}</h2>
            <p className="text-xs text-slate-500">{deleteTarget.title}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
