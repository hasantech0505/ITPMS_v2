/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Edo Ijro Tizim — Government Quarterly Reporting module.
 *
 * IT Park Qashqadaryo submits a periodic "Malumot" (information) document to
 * the Ministry of Digital Technologies' "Edo Ijro tizim" (document/task
 * execution oversight system), covering Residents, Startups and
 * Infrastructure. This module builds that document: the quantitative KPIs
 * are pulled live from the Residents / Startups / Property Marketplace data
 * already in ITPMS, while the narrative (foreign-company negotiations,
 * events, trips) is written by staff each period, since that content isn't
 * tracked anywhere else in the app. A finished report exports to a .docx
 * shaped like the official document.
 *
 * AI writing assistance (Groq, same integration the rest of the app uses):
 * every suggestion below is a SUGGESTION - nothing is applied until the
 * user clicks "Use this". The backend never lets the model invent or
 * change a number; it only rephrases figures this module already computed.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  Landmark,
  Plus,
  ArrowLeft,
  Save,
  FileDown,
  Trash2,
  RefreshCw,
  Loader2,
  Building2,
  Rocket,
  Warehouse,
  X,
  PlusCircle,
  Send,
  Sparkles,
  Check,
  Languages,
  TrendingUp,
} from "lucide-react";
import { EdoReport, EdoReportSection, EdoReportSectionKey, Resident, Startup } from "../../types";
import { Property } from "../infrastructure/propertyTypes";
import {
  currentQuarter,
  quarterRange,
  parsePeriod,
  buildSectionsForNewReport,
  refreshSectionAutoStats,
  cryptoId,
} from "./edoReportStats";
import { buildEdoReportDocxBlob, downloadBlob } from "./edoReportDocx";
import { polishEdoNarrative, summarizeEdoStats, compareEdoPeriods } from "./edoReportAi";
import { cyrillicToLatin, latinToCyrillic, looksCyrillic } from "./uzbekScript";

interface EdoReportModuleProps {
  edoReports: EdoReport[];
  residents: Resident[];
  startups: Startup[];
  properties: Property[];
  onAdd: (payload: Partial<EdoReport>) => Promise<boolean> | void;
  onUpdate: (id: string, payload: Partial<EdoReport>) => Promise<boolean> | void;
  onDelete: (id: string) => Promise<boolean> | void;
  currentUser?: { name?: string } | null;
}

const SECTION_META: { key: EdoReportSectionKey; label: string; icon: any }[] = [
  { key: "residents", label: "I. Residents", icon: Building2 },
  { key: "startups", label: "II. Startups", icon: Rocket },
  { key: "infrastructure", label: "III. Infrastructure", icon: Warehouse },
];

const REPORT_TITLE = "IT-ПАРКНИНГ ҚАШҚАДАРЁ ВИЛОЯТ ФИЛИАЛИ БЎЙИЧА";

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Empty narrative bodies / blank manual-stat values across a report, for the pre-submit nudge. */
function findGaps(sections: EdoReportSection[]): string[] {
  const gaps: string[] = [];
  for (const s of sections) {
    for (const block of s.narrative) {
      if (!block.body.trim()) gaps.push(`${s.title.replace(/^[IVX]+\.\s*/, "")} — "${block.heading || "Untitled"}"`);
    }
    for (const m of s.manualStats) {
      if (!m.value.trim()) gaps.push(`${s.title.replace(/^[IVX]+\.\s*/, "")} — "${m.label || "Untitled figure"}"`);
    }
  }
  return gaps;
}

export default function EdoReportModule({
  edoReports,
  residents,
  startups,
  properties,
  onAdd,
  onUpdate,
  onDelete,
  currentUser,
}: EdoReportModuleProps) {
  const [view, setView] = useState<"list" | "editor">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EdoReport | null>(null);
  const [activeSection, setActiveSection] = useState<EdoReportSectionKey>("residents");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newYear, setNewYear] = useState<number>(currentQuarter().year);
  const [newQuarter, setNewQuarter] = useState<1 | 2 | 3 | 4>(currentQuarter().quarter);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dirty, setDirty] = useState(false);

  const sortedReports = useMemo(
    () => [...edoReports].sort((a, b) => (b.period || "").localeCompare(a.period || "")),
    [edoReports]
  );

  useEffect(() => {
    if (view === "editor" && selectedId) {
      const found = edoReports.find((r) => r.id === selectedId);
      if (found) {
        setDraft(JSON.parse(JSON.stringify(found)));
        setDirty(false);
      }
    }
    // Only re-sync from server state when switching reports, not on every
    // background poll, so an in-progress edit is never clobbered mid-typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedId]);

  const liveData = { residents, startups, properties };

  // Most recent OTHER report strictly before the open one, for "compare vs previous period".
  const previousReport = useMemo(() => {
    if (!draft) return null;
    return sortedReports.find((r) => r.id !== draft.id && r.period < draft.period) || null;
  }, [sortedReports, draft?.id, draft?.period]);

  const handleCreate = async () => {
    const range = quarterRange(newYear, newQuarter);
    const existing = edoReports.find((r) => r.period === range.period);
    if (existing) {
      setSelectedId(existing.id);
      setView("editor");
      setShowNewForm(false);
      return;
    }
    const mostRecent = sortedReports[0];
    const sections = buildSectionsForNewReport(range, liveData, mostRecent?.sections);
    const nowIso = new Date().toISOString();
    const payload: Partial<EdoReport> = {
      id: cryptoId(),
      period: range.period,
      periodLabel: range.periodLabel,
      title: REPORT_TITLE,
      status: "DRAFT",
      sections,
      createdAt: nowIso,
      updatedAt: nowIso,
      createdBy: currentUser?.name || "System",
    };
    setSaving(true);
    const ok = await onAdd(payload);
    setSaving(false);
    if (ok !== false) {
      setSelectedId(payload.id!);
      setView("editor");
      setShowNewForm(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const ok = await onUpdate(draft.id, {
      title: draft.title,
      status: draft.status,
      sections: draft.sections,
      notes: draft.notes,
      submittedAt: draft.submittedAt,
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
    if (ok !== false) setDirty(false);
  };

  const handleMarkSubmitted = async () => {
    if (!draft) return;
    const gaps = findGaps(draft.sections);
    if (gaps.length > 0) {
      const preview = gaps.slice(0, 8).join("\n") + (gaps.length > 8 ? `\n...and ${gaps.length - 8} more` : "");
      const proceed = window.confirm(
        `${gaps.length} field${gaps.length === 1 ? " is" : "s are"} still empty:\n\n${preview}\n\nSubmit anyway?`
      );
      if (!proceed) return;
    }
    const nowIso = new Date().toISOString();
    const updated = { ...draft, status: "SUBMITTED" as const, submittedAt: nowIso, updatedAt: nowIso };
    setDraft(updated);
    setSaving(true);
    const ok = await onUpdate(updated.id, {
      title: updated.title,
      status: updated.status,
      sections: updated.sections,
      submittedAt: updated.submittedAt,
      updatedAt: updated.updatedAt,
    });
    setSaving(false);
    if (ok !== false) setDirty(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this report permanently? This cannot be undone.")) return;
    await onDelete(id);
    if (selectedId === id) {
      setView("list");
      setSelectedId(null);
      setDraft(null);
    }
  };

  const handleExport = async () => {
    if (!draft) return;
    setExporting(true);
    try {
      const blob = await buildEdoReportDocxBlob(draft);
      downloadBlob(blob, `EdoReport_${draft.period}.docx`);
    } finally {
      setExporting(false);
    }
  };

  const handleRefreshStats = (sectionKey: EdoReportSectionKey) => {
    if (!draft) return;
    const range = parsePeriod(draft.period);
    setDraft({
      ...draft,
      sections: draft.sections.map((s) => (s.key === sectionKey ? refreshSectionAutoStats(s, range, liveData) : s)),
    });
    setDirty(true);
  };

  const mutateSection = (sectionKey: EdoReportSectionKey, fn: (s: EdoReportSection) => EdoReportSection) => {
    if (!draft) return;
    setDraft({ ...draft, sections: draft.sections.map((s) => (s.key === sectionKey ? fn(s) : s)) });
    setDirty(true);
  };

  // ---------------- LIST VIEW ----------------
  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Landmark className="w-5.5 h-5.5 text-indigo-600" />
              Edo Ijro Tizim — Quarterly Reports
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Builds the periodic "Malumot" submitted to the Ministry of Digital Technologies' Edo Ijro tizim —
              Residents, Startups and Infrastructure KPIs are pulled live from ITPMS; narrative content is written
              per period and exported to Word.
            </p>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> New Report
          </button>
        </div>

        {showNewForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Start a new quarterly report</h3>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Year</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => setNewYear(parseInt(e.target.value, 10) || newYear)}
                  className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Quarter</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((q) => (
                    <button
                      key={q}
                      onClick={() => setNewQuarter(q as 1 | 2 | 3 | 4)}
                      className={`w-11 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                        newQuarter === q
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      Q{q}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Create
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              KPIs are computed fresh from live data; if a previous report exists, its narrative section headings are
              carried over (blank) so you don't have to retype the outline — content is never copied forward.
            </p>
          </div>
        )}

        {sortedReports.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-400 text-sm">
            No reports yet. Click "New Report" to build the first quarterly Malumot.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedReports.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedId(r.id);
                  setView("editor");
                  setActiveSection("residents");
                }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{r.period}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{r.periodLabel}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      r.status === "SUBMITTED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3">Updated {fmtDate(r.updatedAt)}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">{r.sections?.length || 0} sections</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(r.id);
                    }}
                    className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------------- EDITOR VIEW ----------------
  if (!draft) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const section = draft.sections.find((s) => s.key === activeSection) || draft.sections[0];
  const previousSection = previousReport?.sections.find((s) => s.key === activeSection) || null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setView("list");
              setSelectedId(null);
              setDraft(null);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{draft.periodLabel}</h1>
            <p className="text-xs text-slate-400">
              {draft.period} · {draft.status === "SUBMITTED" ? `Submitted ${fmtDate(draft.submittedAt)}` : "Draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-amber-600 font-medium mr-1">Unsaved changes</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-lg"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-lg"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Export .docx
          </button>
          {draft.status !== "SUBMITTED" && (
            <button
              onClick={handleMarkSubmitted}
              disabled={saving}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-3.5 py-2 rounded-lg"
            >
              <Send className="w-4 h-4" />
              Mark Submitted
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {SECTION_META.map((sm) => {
          const Icon = sm.icon;
          const isActive = activeSection === sm.key;
          return (
            <button
              key={sm.key}
              onClick={() => setActiveSection(sm.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                isActive ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {sm.label}
            </button>
          );
        })}
      </div>

      {section && (
        <SectionEditor
          section={section}
          previousSection={previousSection}
          onRefreshStats={() => handleRefreshStats(section.key)}
          onMutate={(fn) => mutateSection(section.key, fn)}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Small reusable "AI suggestion" strip: shown under whatever it applies
// to, never applied until the user clicks "Use this".
// ------------------------------------------------------------------

function AiSuggestion({
  loading,
  text,
  error,
  onAccept,
  onDiscard,
}: {
  loading: boolean;
  text: string | null;
  error: string | null;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  if (!loading && !text && !error) return null;
  return (
    <div className="mt-2 border border-indigo-200 bg-indigo-50 rounded-lg p-3">
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Asking AI...
        </div>
      ) : error ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-rose-600">{error}</span>
          <button onClick={onDiscard} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
            Dismiss
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AI suggestion
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap mb-2.5">{text}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onAccept}
              className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-md"
            >
              <Check className="w-3.5 h-3.5" /> Use this
            </button>
            <button onClick={onDiscard} className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5">
              Discard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Section editor
// ------------------------------------------------------------------

interface AiState {
  loading: boolean;
  text: string | null;
  error: string | null;
}
const AI_IDLE: AiState = { loading: false, text: null, error: null };

function SectionEditor({
  section,
  previousSection,
  onRefreshStats,
  onMutate,
}: {
  section: EdoReportSection;
  previousSection: EdoReportSection | null;
  onRefreshStats: () => void;
  onMutate: (fn: (s: EdoReportSection) => EdoReportSection) => void;
}) {
  const [summaryAi, setSummaryAi] = useState<AiState>(AI_IDLE);
  const [compareAi, setCompareAi] = useState<AiState>(AI_IDLE);
  const [polishAi, setPolishAi] = useState<Record<string, AiState>>({});

  const runSummaryDraft = async () => {
    setSummaryAi({ loading: true, text: null, error: null });
    try {
      const { summary } = await summarizeEdoStats({
        sectionTitle: section.title,
        autoStats: section.autoStats,
        manualStats: section.manualStats,
      });
      setSummaryAi({ loading: false, text: summary || null, error: summary ? null : "No figures to summarize yet." });
    } catch (err) {
      setSummaryAi({ loading: false, text: null, error: "AI request failed — try again." });
    }
  };

  const runCompare = async () => {
    if (!previousSection) return;
    setCompareAi({ loading: true, text: null, error: null });
    try {
      const { narrative, changeCount } = await compareEdoPeriods({
        sectionTitle: section.title,
        currentStats: section.autoStats,
        previousStats: previousSection.autoStats,
      });
      setCompareAi({
        loading: false,
        text: narrative || null,
        error: narrative ? null : changeCount === 0 ? "No comparable numeric changes found vs. the previous period." : "AI could not phrase this — try again.",
      });
    } catch (err) {
      setCompareAi({ loading: false, text: null, error: "AI request failed — try again." });
    }
  };

  const runPolish = async (blockId: string, heading: string, body: string) => {
    setPolishAi((prev) => ({ ...prev, [blockId]: { loading: true, text: null, error: null } }));
    try {
      const { polished } = await polishEdoNarrative({ text: body, sectionTitle: section.title, heading });
      setPolishAi((prev) => ({
        ...prev,
        [blockId]: { loading: false, text: polished || null, error: polished ? null : "Write a draft note first." },
      }));
    } catch (err) {
      setPolishAi((prev) => ({ ...prev, [blockId]: { loading: false, text: null, error: "AI request failed — try again." } }));
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Live KPIs from ITPMS</h3>
          <div className="flex items-center gap-3">
            {previousSection && (
              <button
                onClick={runCompare}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                title="Compare vs the previous saved period"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Compare vs previous period
              </button>
            )}
            <button
              onClick={onRefreshStats}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(section.autoStats).map(([label, value]) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-slate-500 leading-snug">{label}</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{String(value)}</p>
            </div>
          ))}
        </div>
        {section.autoStatsUpdatedAt && (
          <p className="text-[11px] text-slate-400 mt-3">Computed {fmtDate(section.autoStatsUpdatedAt)}</p>
        )}
        <AiSuggestion
          loading={compareAi.loading}
          text={compareAi.text}
          error={compareAi.error}
          onAccept={() => {
            if (!compareAi.text) return;
            onMutate((s) => ({
              ...s,
              narrative: [
                { id: cryptoId(), heading: "O'tgan davrga nisbatan o'zgarishlar", body: compareAi.text as string },
                ...s.narrative,
              ],
            }));
            setCompareAi(AI_IDLE);
          }}
          onDiscard={() => setCompareAi(AI_IDLE)}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Section summary (for Word export)</h3>
            <p className="text-xs text-slate-400">
              A flowing paragraph in official report style, used in place of the bullet list above when exporting.
              Optional — leave blank to export the bullets instead.
            </p>
          </div>
          <button
            onClick={runSummaryDraft}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Draft with AI
          </button>
        </div>
        <textarea
          value={section.summaryNarrative || ""}
          onChange={(e) => onMutate((s) => ({ ...s, summaryNarrative: e.target.value }))}
          placeholder="Leave blank to export the bulleted KPI list instead..."
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <AiSuggestion
          loading={summaryAi.loading}
          text={summaryAi.text}
          error={summaryAi.error}
          onAccept={() => {
            if (!summaryAi.text) return;
            onMutate((s) => ({ ...s, summaryNarrative: summaryAi.text as string }));
            setSummaryAi(AI_IDLE);
          }}
          onDiscard={() => setSummaryAi(AI_IDLE)}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Additional figures not tracked in ITPMS</h3>
            <p className="text-xs text-slate-400">
              Things like foreign-capital company counts or meeting totals aren't stored anywhere in the app yet — enter them here.
            </p>
          </div>
          <button
            onClick={() =>
              onMutate((s) => ({ ...s, manualStats: [...s.manualStats, { id: cryptoId(), label: "", value: "" }] }))
            }
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" /> Add figure
          </button>
        </div>
        <div className="space-y-2">
          {section.manualStats.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <input
                value={m.label}
                onChange={(e) =>
                  onMutate((s) => ({
                    ...s,
                    manualStats: s.manualStats.map((x) => (x.id === m.id ? { ...x, label: e.target.value } : x)),
                  }))
                }
                placeholder="Label"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                value={m.value}
                onChange={(e) =>
                  onMutate((s) => ({
                    ...s,
                    manualStats: s.manualStats.map((x) => (x.id === m.id ? { ...x, value: e.target.value } : x)),
                  }))
                }
                placeholder="Value"
                className="w-48 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => onMutate((s) => ({ ...s, manualStats: s.manualStats.filter((x) => x.id !== m.id) }))}
                className="text-slate-300 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Narrative</h3>
          <button
            onClick={() =>
              onMutate((s) => ({ ...s, narrative: [...s.narrative, { id: cryptoId(), heading: "", body: "" }] }))
            }
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" /> Add section
          </button>
        </div>
        <div className="space-y-4">
          {section.narrative.map((block) => {
            const ai = polishAi[block.id] || AI_IDLE;
            return (
              <div key={block.id} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    value={block.heading}
                    onChange={(e) =>
                      onMutate((s) => ({
                        ...s,
                        narrative: s.narrative.map((x) => (x.id === block.id ? { ...x, heading: e.target.value } : x)),
                      }))
                    }
                    placeholder="Heading"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold"
                  />
                  <button
                    onClick={() => onMutate((s) => ({ ...s, narrative: s.narrative.filter((x) => x.id !== block.id) }))}
                    className="text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={block.body}
                  onChange={(e) =>
                    onMutate((s) => ({
                      ...s,
                      narrative: s.narrative.map((x) => (x.id === block.id ? { ...x, body: e.target.value } : x)),
                    }))
                  }
                  placeholder="Write this quarter's update for this section..."
                  rows={4}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => runPolish(block.id, block.heading, block.body)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Formalize with AI
                  </button>
                  <button
                    onClick={() =>
                      onMutate((s) => ({
                        ...s,
                        narrative: s.narrative.map((x) =>
                          x.id === block.id
                            ? { ...x, body: looksCyrillic(x.body) ? cyrillicToLatin(x.body) : latinToCyrillic(x.body) }
                            : x
                        ),
                      }))
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    title="Best-effort script conversion — review before using"
                  >
                    <Languages className="w-3.5 h-3.5" /> Kirill ⇄ Lotin
                  </button>
                </div>
                <AiSuggestion
                  loading={ai.loading}
                  text={ai.text}
                  error={ai.error}
                  onAccept={() => {
                    if (!ai.text) return;
                    onMutate((s) => ({
                      ...s,
                      narrative: s.narrative.map((x) => (x.id === block.id ? { ...x, body: ai.text as string } : x)),
                    }));
                    setPolishAi((prev) => ({ ...prev, [block.id]: AI_IDLE }));
                  }}
                  onDiscard={() => setPolishAi((prev) => ({ ...prev, [block.id]: AI_IDLE }))}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
