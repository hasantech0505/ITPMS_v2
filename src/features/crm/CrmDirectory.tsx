/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Partners & Leads: the pipeline, the filters, and either the company table or
 * the people list beneath them.
 *
 * The six KPI tiles this replaces were mostly zeros and did nothing when
 * clicked. Here the four stage cards ARE the filter, the chips below are the
 * questions actually asked of this data, and People is a switch rather than a
 * seventh tab.
 */

import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, Mail, Search, UserPlus, X } from "lucide-react";
import { Company, Contact } from "../../types";
import {
  PIPELINE_STAGES, PipelineStage, daysSince, hasNextStep, needsFirstResponse,
  stageCounts, stageOf,
} from "./crmDerive";
import CrmCompanyTable, { SortKey } from "./CrmCompanyTable";
import CrmPeopleList from "./CrmPeopleList";

type QuickFilter = "none" | "needsFirst" | "silent14" | "hasNext";

interface CrmDirectoryProps {
  companies: Company[];
  contacts: Contact[];
  isReadOnly: boolean;
  initialStage?: PipelineStage | null;
  view: "companies" | "people";
  onViewChange: (view: "companies" | "people") => void;
  onOpenCompany: (id: string) => void;
  onChangeStage: (company: Company, stage: PipelineStage) => void;
  onBulkStage: (companies: Company[], stage: PipelineStage) => void;
  onSetNextStep: (company: Company) => void;
  onEditCompany: (id: string) => void;
  onDeleteCompany: (company: Company) => void;
  onEditContact: (id: string) => void;
  onDeleteContact: (contact: Contact) => void;
}

export default function CrmDirectory({
  companies, contacts, isReadOnly, initialStage = null, view, onViewChange,
  onOpenCompany, onChangeStage, onBulkStage, onSetNextStep,
  onEditCompany, onDeleteCompany, onEditContact, onDeleteContact,
}: CrmDirectoryProps) {

  const [stageFilter, setStageFilter] = useState<PipelineStage | null>(initialStage);
  const [quick, setQuick] = useState<QuickFilter>("none");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stageMenuFor, setStageMenuFor] = useState<string | null>(null);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  // Today can hand us a stage to open on ("show me the 8 new leads").
  useEffect(() => { setStageFilter(initialStage); }, [initialStage]);

  const counts = useMemo(() => stageCounts(companies), [companies]);
  const countries = useMemo(
    () => Array.from(new Set(companies.map((c) => c.country).filter(Boolean))).sort(),
    [companies]
  );

  const quickCounts = useMemo(() => ({
    needsFirst: companies.filter(needsFirstResponse).length,
    silent14: companies.filter((c) => (daysSince(c.lastContactedDate) ?? 0) > 14).length,
    hasNext: companies.filter(hasNextStep).length,
  }), [companies]);

  const visibleCompanies = useMemo(() => {
    let rows = companies.slice();

    if (stageFilter) rows = rows.filter((c) => stageOf(c) === stageFilter);
    if (country) rows = rows.filter((c) => c.country === country);
    if (quick === "needsFirst") rows = rows.filter(needsFirstResponse);
    if (quick === "silent14") rows = rows.filter((c) => (daysSince(c.lastContactedDate) ?? 0) > 14);
    if (quick === "hasNext") rows = rows.filter(hasNextStep);

    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.country || "").toLowerCase().includes(q) ||
        (c.segment || "").toLowerCase().includes(q) ||
        (c.industry || "").toLowerCase().includes(q)
      );
    }

    const dir = sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (sortKey === "country") return dir * (a.country || "").localeCompare(b.country || "");
      if (sortKey === "nextStep") {
        // Sorting by "next step" is really sorting by urgency: the ones with
        // nothing agreed and the longest silence come first.
        const score = (c: Company) => (hasNextStep(c) ? 0 : 1000) + Math.min(daysSince(c.lastContactedDate) ?? 999, 999);
        return dir * (score(b) - score(a));
      }
      return dir * a.name.localeCompare(b.name);
    });

    return rows;
  }, [companies, stageFilter, country, quick, search, sortKey, sortDir]);

  const visibleContacts = useMemo(() => {
    let rows = contacts.slice();
    if (country) {
      const ids = new Set(companies.filter((c) => c.country === country).map((c) => c.id));
      rows = rows.filter((ct) => ids.has(ct.companyId));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((ct) =>
        (ct.fullName || "").toLowerCase().includes(q) ||
        (ct.role || "").toLowerCase().includes(q) ||
        (ct.companyName || "").toLowerCase().includes(q) ||
        (ct.email || "").toLowerCase().includes(q)
      );
    }
    return rows;
  }, [contacts, companies, country, search]);

  const selectedCompanies = useMemo(
    () => visibleCompanies.filter((c) => selectedIds.includes(c.id)),
    [visibleCompanies, selectedIds]
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === visibleCompanies.length ? [] : visibleCompanies.map((c) => c.id));
  };

  const chip = (active: boolean) =>
    `text-[11.5px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
      active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
    }`;

  return (
    <div className="space-y-4" onClick={() => { setStageMenuFor(null); setBulkMenuOpen(false); }}>

      {/* The pipeline is the filter. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PIPELINE_STAGES.map((s) => {
          const active = stageFilter === s.key;
          const n = counts[s.key];
          return (
            <button
              key={s.key}
              onClick={() => { setStageFilter(active ? null : s.key); setSelectedIds([]); }}
              className={`bg-white rounded-xl px-4 py-3.5 flex flex-col gap-1 text-left cursor-pointer transition-all ${
                active ? "border-[1.5px] border-slate-900 shadow-sm" : "border border-slate-200 hover:border-slate-300"
              }`}
              style={{ borderTop: `3px solid ${s.accent}` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
              <span className={`text-[23px] font-bold leading-tight ${n === 0 ? "text-slate-300" : "text-slate-900"}`}>{n}</span>
              <span className="text-[11px] text-slate-500">
                {s.key === "NEW" && quickCounts.needsFirst > 0 ? `${quickCounts.needsFirst} never contacted` : null}
                {s.key === "CONTACTED" ? `${companies.filter((c) => stageOf(c) === "CONTACTED" && !hasNextStep(c)).length} with no next step` : null}
                {s.key === "IN_TALKS" && n === 0 ? "nobody here yet" : null}
                {s.key === "PARTNER" ? "signed agreements" : null}
                {s.key === "NEW" && quickCounts.needsFirst === 0 ? "all contacted" : null}
                {s.key === "IN_TALKS" && n > 0 ? "in active discussion" : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: view switch, search, country, saved-view chips. */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 rounded-[9px] p-[3px]">
            <button
              onClick={() => onViewChange("companies")}
              className={`text-[12px] font-bold px-3.5 py-1.5 rounded-[7px] cursor-pointer transition-all ${
                view === "companies" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Companies <span className="text-slate-400">{companies.length}</span>
            </button>
            <button
              onClick={() => onViewChange("people")}
              className={`text-[12px] font-bold px-3.5 py-1.5 rounded-[7px] cursor-pointer transition-all ${
                view === "people" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              People <span className="text-slate-400">{contacts.length}</span>
            </button>
          </div>

          <div className="relative w-full sm:w-[280px]">
            <Search className="w-[15px] h-[15px] text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={view === "companies" ? "Search company or country..." : "Search name, role or company..."}
              className="w-full bg-white border border-slate-200 rounded-lg pl-[34px] pr-3 py-2 text-[12px] text-slate-900 outline-hidden focus:border-slate-400 transition-colors"
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-100 rounded-lg px-3 py-2 text-[12px] font-semibold text-slate-600 cursor-pointer outline-hidden"
          >
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="grow" />
          <span className="text-[12px] text-slate-500">
            {view === "companies"
              ? <>Showing <strong className="text-slate-900">{visibleCompanies.length}</strong> of {companies.length}</>
              : <><strong className="text-slate-900">{visibleContacts.length}</strong> people</>}
          </span>
        </div>

        {view === "companies" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-0.5">Quick filters</span>
            <button onClick={() => setQuick(quick === "needsFirst" ? "none" : "needsFirst")} className={chip(quick === "needsFirst")}>
              Needs first response <span className={quick === "needsFirst" ? "text-white" : "text-rose-500 font-bold"}>{quickCounts.needsFirst}</span>
            </button>
            <button onClick={() => setQuick(quick === "silent14" ? "none" : "silent14")} className={chip(quick === "silent14")}>
              Silent over 14 days <span className={quick === "silent14" ? "text-white" : "text-amber-700 font-bold"}>{quickCounts.silent14}</span>
            </button>
            <button onClick={() => setQuick(quick === "hasNext" ? "none" : "hasNext")} className={chip(quick === "hasNext")}>
              Has a next step <span className={quick === "hasNext" ? "text-white" : "text-emerald-600 font-bold"}>{quickCounts.hasNext}</span>
            </button>
            {(stageFilter || quick !== "none" || country || search) && (
              <button
                onClick={() => { setStageFilter(null); setQuick("none"); setCountry(""); setSearch(""); }}
                className="flex items-center gap-1 text-[11.5px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
            <div className="grow" />
            <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-300">
              <Bookmark className="w-3.5 h-3.5" /> Saved views coming next
            </span>
          </div>
        )}
      </div>

      {/* Bulk bar: only there when something is ticked. */}
      {view === "companies" && selectedIds.length > 0 && (
        <div className="bg-slate-900 rounded-[10px] px-4 py-2.5 flex flex-wrap items-center gap-3.5" onClick={(e) => e.stopPropagation()}>
          <span className="text-[12px] font-bold text-white">
            {selectedIds.length} {selectedIds.length === 1 ? "company" : "companies"} selected
          </span>
          <div className="w-px h-[18px] bg-slate-700" />

          <div className="relative">
            <button
              onClick={() => setBulkMenuOpen(!bulkMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11.5px] font-bold px-3 h-[30px] rounded-[7px] cursor-pointer transition-colors"
            >
              Move to stage
            </button>
            {bulkMenuOpen && (
              <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[150px]">
                {PIPELINE_STAGES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => { onBulkStage(selectedCompanies, s.key); setSelectedIds([]); setBulkMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: s.accent }} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={`mailto:?bcc=${encodeURIComponent(
              contacts.filter((ct) => selectedIds.includes(ct.companyId)).map((ct) => ct.email).filter(Boolean).join(",")
            )}`}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11.5px] font-bold px-3 h-[30px] rounded-[7px] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Email contacts
          </a>

          <span className="flex items-center gap-1.5 text-slate-500 text-[11.5px] font-bold px-3 h-[30px]">
            <UserPlus className="w-3.5 h-3.5" /> Assign owner (needs an owner field)
          </span>

          <div className="grow" />
          <button onClick={() => setSelectedIds([])} className="text-[11.5px] font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors">
            Clear
          </button>
        </div>
      )}

      {view === "companies" ? (
        <CrmCompanyTable
          companies={visibleCompanies}
          contacts={contacts}
          selectedIds={selectedIds}
          expandedId={expandedId}
          sortKey={sortKey}
          sortDir={sortDir}
          isReadOnly={isReadOnly}
          stageMenuFor={stageMenuFor}
          onToggleSelect={(id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onToggleSelectAll={toggleSelectAll}
          onSort={handleSort}
          onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
          onOpenCompany={onOpenCompany}
          onChangeStage={onChangeStage}
          onOpenStageMenu={setStageMenuFor}
          onSetNextStep={onSetNextStep}
          onEditCompany={onEditCompany}
          onDeleteCompany={onDeleteCompany}
        />
      ) : (
        <CrmPeopleList
          contacts={visibleContacts}
          companies={companies}
          isReadOnly={isReadOnly}
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
          onOpenCompany={onOpenCompany}
        />
      )}
    </div>
  );
}
