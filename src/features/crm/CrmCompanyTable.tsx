/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The lead table, as something you operate rather than read.
 *
 * Sortable headers, tick boxes feeding a bulk bar, a stage chip you change in
 * place, a row that expands where it sits so you can act without navigating,
 * and a whole-row click that opens the company panel. The old version was eight
 * static columns including a lead score that only ever held two values.
 */

import React from "react";
import {
  Calendar, ChevronDown, ChevronsUpDown, ChevronUp, Mail, MoreHorizontal, Pencil, Trash2,
} from "lucide-react";
import { Company, Contact } from "../../types";
import {
  PIPELINE_STAGES, PipelineStage, describeLastContact, initialsOf, nextStepLabel,
  stageMeta, stageOf,
} from "./crmDerive";

export type SortKey = "name" | "country" | "nextStep";

interface CrmCompanyTableProps {
  companies: Company[];
  contacts: Contact[];
  selectedIds: string[];
  expandedId: string | null;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  isReadOnly: boolean;
  stageMenuFor: string | null;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSort: (key: SortKey) => void;
  onToggleExpand: (id: string) => void;
  onOpenCompany: (id: string) => void;
  onChangeStage: (company: Company, stage: PipelineStage) => void;
  onOpenStageMenu: (id: string | null) => void;
  onSetNextStep: (company: Company) => void;
  onEditCompany: (id: string) => void;
  onDeleteCompany: (company: Company) => void;
}

const GRID = "grid grid-cols-[38px_minmax(0,1.6fr)_150px_136px_minmax(0,1.15fr)_112px] gap-3.5 items-center";

export default function CrmCompanyTable({
  companies, contacts, selectedIds, expandedId, sortKey, sortDir, isReadOnly, stageMenuFor,
  onToggleSelect, onToggleSelectAll, onSort, onToggleExpand, onOpenCompany,
  onChangeStage, onOpenStageMenu, onSetNextStep, onEditCompany, onDeleteCompany,
}: CrmCompanyTableProps) {

  const allSelected = companies.length > 0 && selectedIds.length === companies.length;

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronsUpDown className="w-[11px] h-[11px]" />;
    return sortDir === "asc" ? <ChevronUp className="w-[11px] h-[11px]" /> : <ChevronDown className="w-[11px] h-[11px]" />;
  };

  const headCls = "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 cursor-pointer transition-colors";

  if (companies.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
        <p className="text-[13px] font-semibold text-slate-700">No companies match these filters.</p>
        <p className="text-[12px] text-slate-400 mt-1">Clear a filter or widen the search to see more.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      <div className={`${GRID} px-[18px] py-2.5 bg-slate-50 border-b border-slate-200`}>
        <button onClick={onToggleSelectAll} className="cursor-pointer" aria-label="Select all">
          <Box checked={allSelected} />
        </button>
        <button onClick={() => onSort("name")} className={headCls}>Company <SortIcon column="name" /></button>
        <button onClick={() => onSort("country")} className={headCls}>Country <SortIcon column="country" /></button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage</span>
        <button onClick={() => onSort("nextStep")} className={headCls}>Next step <SortIcon column="nextStep" /></button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</span>
      </div>

      {companies.map((c) => {
        const stage = stageOf(c);
        const meta = stageMeta(stage);
        const next = nextStepLabel(c);
        const isSelected = selectedIds.includes(c.id);
        const isExpanded = expandedId === c.id;
        const companyContacts = contacts.filter((ct) => ct.companyId === c.id);

        return (
          <div key={c.id} className={isExpanded ? "bg-slate-50/60" : ""}>
            <div
              onClick={() => onOpenCompany(c.id)}
              className={`${GRID} px-[18px] py-3 border-b border-slate-100 cursor-pointer transition-colors group ${
                isSelected ? "bg-slate-50 shadow-[inset_2px_0_0_#10b981]" : "hover:bg-slate-50"
              }`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onToggleSelect(c.id); }}
                className="cursor-pointer"
                aria-label={`Select ${c.name}`}
              >
                <Box checked={isSelected} />
              </button>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-[30px] h-[30px] rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {initialsOf(c.name)}
                </div>
                <div className="flex flex-col gap-px min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 truncate">{c.name}</span>
                    <span className="text-[11px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Open →</span>
                  </div>
                  <span className="text-[11.5px] text-slate-500 truncate">
                    {companyContacts.length > 0
                      ? `${companyContacts.length} contact${companyContacts.length > 1 ? "s" : ""}`
                      : "No contact person yet"}
                    {c.segment ? ` · ${c.segment}` : c.industry ? ` · ${c.industry}` : ""}
                  </span>
                </div>
              </div>

              <span className="text-[12px] text-slate-600 truncate">{c.country || "—"}</span>

              {/* Stage changes in place: no modal to open, no page to leave. */}
              <div className="relative justify-self-start" onClick={(e) => e.stopPropagation()}>
                <button
                  disabled={isReadOnly}
                  onClick={() => onOpenStageMenu(stageMenuFor === c.id ? null : c.id)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold pl-2.5 pr-2 py-1 rounded-full border cursor-pointer disabled:cursor-default transition-colors"
                  style={{ background: meta.chipBg, color: meta.chipText, borderColor: meta.chipBorder }}
                >
                  {meta.label}
                  {!isReadOnly && <ChevronDown className="w-[11px] h-[11px]" />}
                </button>
                {stageMenuFor === c.id && (
                  <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[150px]">
                    {PIPELINE_STAGES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { onChangeStage(c, s.key); onOpenStageMenu(null); }}
                        className={`w-full text-left px-3 py-2 text-[12px] font-semibold hover:bg-slate-50 cursor-pointer ${
                          s.key === stage ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: s.accent }} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className={`text-[12px] truncate ${
                next.tone === "danger" ? "text-rose-500 font-semibold"
                  : next.tone === "warn" ? "text-amber-700 font-semibold"
                  : "text-slate-900"
              }`}>
                {next.text}
              </span>

              <div className="flex gap-1.5 justify-end items-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleExpand(c.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                >
                  {isExpanded ? "Less" : "More"}
                  {isExpanded ? <ChevronUp className="w-[15px] h-[15px]" /> : <ChevronDown className="w-[15px] h-[15px]" />}
                </button>
              </div>
            </div>

            {/* The expansion: enough to act on without leaving the list. */}
            {isExpanded && (
              <div className="bg-slate-50 border-b border-slate-100 pl-[70px] pr-[18px] py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px] gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</span>
                  {companyContacts.length === 0 ? (
                    <span className="text-[12px] text-slate-400">Nobody recorded yet</span>
                  ) : (
                    companyContacts.slice(0, 2).map((ct) => (
                      <div key={ct.id} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {initialsOf(ct.fullName)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12.5px] font-bold text-slate-900 truncate">{ct.fullName}</span>
                          <span className="text-[11.5px] text-emerald-600 truncate">{ct.email || ct.phone || "No contact details"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last contact</span>
                  <span className="text-[12.5px] font-semibold text-slate-900">{describeLastContact(c.lastContactedDate)}</span>
                  {c.leadSource && <span className="text-[11.5px] text-slate-500">Source: {c.leadSource}</span>}
                  {c.competingOptions && <span className="text-[11.5px] text-slate-500 truncate">Comparing against: {c.competingOptions}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Move it forward</span>
                  <div className="flex gap-2">
                    {!isReadOnly && (
                      <button
                        onClick={() => onSetNextStep(c)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-bold px-3 h-8 rounded-lg cursor-pointer transition-colors"
                      >
                        Set next step
                      </button>
                    )}
                    <button
                      onClick={() => onOpenCompany(c.id)}
                      className="bg-white hover:bg-slate-50 text-slate-600 text-[11.5px] font-semibold px-3 h-8 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Open panel
                    </button>
                  </div>
                  {!isReadOnly && (
                    <div className="flex gap-2 mt-1">
                      <IconBtn title="Edit" onClick={() => onEditCompany(c.id)}><Pencil className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Email"><Mail className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Meeting"><Calendar className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="Delete" onClick={() => onDeleteCompany(c)} danger><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                      <IconBtn title="More"><MoreHorizontal className="w-3.5 h-3.5" /></IconBtn>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Box({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="w-[15px] h-[15px] bg-emerald-500 border-[1.75px] border-emerald-500 rounded-[4px] flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    </span>
  ) : (
    <span className="w-[15px] h-[15px] border-[1.75px] border-slate-300 rounded-[4px] block" />
  );
}

function IconBtn({ children, title, onClick, danger }: { children: React.ReactNode; title: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-7 h-7 rounded-[7px] bg-white border border-slate-200 flex items-center justify-center cursor-pointer transition-colors ${
        danger ? "text-slate-500 hover:text-rose-600 hover:border-rose-200" : "text-slate-500 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
