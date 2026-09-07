/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The CRM's front door.
 *
 * The old module opened on a table of 30 rows and six KPI tiles, half of them
 * zero, and never said what to do. This screen answers one question: what is
 * waiting for me right now. Two queues -- nobody answered these, and these went
 * quiet with nothing agreed -- each row carrying the single action that moves it
 * on.
 */

import React, { useMemo, useState } from "react";
import {
  AlertCircle, Calendar, CheckSquare, ChevronRight, Clock, Plus, Sparkles, Square,
} from "lucide-react";
import { Company, Contact, Meeting, Task } from "../../types";
import {
  PipelineStage, daysSince, describeLastContact, formatShortDate,
  isStalled, needsFirstResponse, silentDays, stageCounts,
} from "./crmDerive";

interface CrmTodayProps {
  companies: Company[];
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  isReadOnly: boolean;
  onOpenCompany: (id: string) => void;
  onLogFirstContact: (company: Company) => void;
  onSetNextStep: (company: Company) => void;
  onToggleTask: (task: Task) => void;
  onGoToStage: (stage: PipelineStage) => void;
  onAddTask: () => void;
  onScheduleMeeting: () => void;
}

const PAGE = 4;

export default function CrmToday({
  companies, contacts, meetings, tasks, isReadOnly,
  onOpenCompany, onLogFirstContact, onSetNextStep, onToggleTask,
  onGoToStage, onAddTask, onScheduleMeeting,
}: CrmTodayProps) {
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllStalled, setShowAllStalled] = useState(false);

  const counts = useMemo(() => stageCounts(companies), [companies]);

  // Oldest first: the lead nobody answered longest ago is the most embarrassing one.
  const unanswered = useMemo(
    () => companies.filter(needsFirstResponse).slice().sort((a, b) => a.name.localeCompare(b.name)),
    [companies]
  );

  // Worst silence first.
  const stalled = useMemo(
    () => companies.filter(isStalled).slice().sort((a, b) => silentDays(b) - silentDays(a)),
    [companies]
  );

  const contactedTotal = counts.CONTACTED + counts.IN_TALKS + counts.PARTNER;
  const advanced = counts.IN_TALKS + counts.PARTNER;

  const weekMeetings = useMemo(() => {
    return meetings
      .filter((m) => {
        if (m.status === "CANCELLED") return false;
        const d = daysSince(m.dateTime);
        return d !== null && d <= 0 && d > -8; // scheduled within the next week
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [meetings]);

  const openTasks = useMemo(
    () => tasks.filter((t) => t.status !== "DONE").slice(0, 5),
    [tasks]
  );

  // The warmest stalled lead is the one worth nudging first.
  const suggestion = useMemo(() => {
    if (stalled.length === 0) return null;
    return stalled.slice().sort((a, b) => (b.leadScore || 0) - (a.leadScore || 0))[0];
  }, [stalled]);

  const contactCountFor = (companyId: string) => contacts.filter((c) => c.companyId === companyId).length;

  return (
    <div className="space-y-4">

      {/* One sentence about the state of the pipeline, then the real numbers. */}
      <div className="bg-white border border-slate-200 border-l-[3px] border-l-amber-500 rounded-xl px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
            {advanced === 0 && contactedTotal > 0
              ? `${contactedTotal} companies contacted, none moved forward yet`
              : `${advanced} of ${contactedTotal} contacted companies have moved forward`}
          </h3>
          <p className="text-[12.5px] text-slate-500">
            {stalled.length > 0
              ? "Setting a next step is what moves a lead on. These are the ones with nothing agreed."
              : "Every contacted lead has a next step recorded. Nothing is drifting."}
          </p>
        </div>
        <div className="flex gap-7 shrink-0 lg:pl-6 lg:border-l border-slate-200">
          <button onClick={() => onGoToStage("NEW")} className="flex flex-col gap-0.5 text-left cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total leads</span>
            <span className="text-[22px] font-bold text-slate-900 leading-none">{companies.length}</span>
          </button>
          <button onClick={() => onGoToStage("CONTACTED")} className="flex flex-col gap-0.5 text-left cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contacted</span>
            <span className="text-[22px] font-bold text-slate-900 leading-none">{counts.CONTACTED}</span>
          </button>
          <button onClick={() => onGoToStage("IN_TALKS")} className="flex flex-col gap-0.5 text-left cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In talks</span>
            <span className={`text-[22px] font-bold leading-none ${counts.IN_TALKS === 0 ? "text-amber-500" : "text-slate-900"}`}>{counts.IN_TALKS}</span>
          </button>
          <button onClick={() => onGoToStage("PARTNER")} className="flex flex-col gap-0.5 text-left cursor-pointer">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Partners</span>
            <span className={`text-[22px] font-bold leading-none ${counts.PARTNER === 0 ? "text-slate-300" : "text-slate-900"}`}>{counts.PARTNER}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">

        <div className="flex flex-col gap-4">

          {/* Queue 1 */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <header className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h4 className="text-[13.5px] font-bold text-slate-900">Waiting for a first response</h4>
                <span className="bg-rose-50 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full">{unanswered.length}</span>
              </div>
              <span className="text-[11.5px] text-slate-400">Never contacted</span>
            </header>

            {unanswered.length === 0 ? (
              <EmptyQueue text="Everyone has been contacted at least once." />
            ) : (
              <>
                {(showAllNew ? unanswered : unanswered.slice(0, PAGE)).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onOpenCompany(c.id)}
                    className="grid grid-cols-[minmax(0,1fr)_150px_130px_auto] gap-4 items-center px-5 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[13px] font-bold text-slate-900 truncate">{c.name}</span>
                      <span className="text-[11.5px] text-slate-500 truncate">
                        {contactCountFor(c.id) > 0
                          ? `${contactCountFor(c.id)} contact${contactCountFor(c.id) > 1 ? "s" : ""}`
                          : "No contact person yet"}
                        {c.website ? ` · ${c.website.replace(/^https?:\/\//, "")}` : ""}
                      </span>
                    </div>
                    <span className="text-[12px] text-slate-600 truncate">{c.country || "—"}</span>
                    <span className="text-[12px] text-amber-700 font-semibold">Never contacted</span>
                    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      {!isReadOnly && (
                        <button
                          onClick={() => onLogFirstContact(c)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[11.5px] font-bold px-3.5 h-[34px] rounded-lg cursor-pointer transition-colors"
                        >
                          Log first contact
                        </button>
                      )}
                      <button
                        onClick={() => onOpenCompany(c.id)}
                        className="bg-white hover:bg-slate-50 text-slate-600 text-[11.5px] font-semibold px-3 h-[34px] border border-slate-200 rounded-lg cursor-pointer transition-colors"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
                {unanswered.length > PAGE && (
                  <button
                    onClick={() => setShowAllNew(!showAllNew)}
                    className="w-full py-2.5 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {showAllNew ? "Show fewer" : `Show ${unanswered.length - PAGE} more`}
                  </button>
                )}
              </>
            )}
          </section>

          {/* Queue 2 */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <header className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <h4 className="text-[13.5px] font-bold text-slate-900">Contacted, but no next step set</h4>
                <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">{stalled.length}</span>
              </div>
              <span className="text-[11.5px] text-slate-400">Longest silence first</span>
            </header>

            {stalled.length === 0 ? (
              <EmptyQueue text="Every contacted lead has an agreed next step." />
            ) : (
              <>
                {(showAllStalled ? stalled : stalled.slice(0, 3)).map((c) => {
                  const days = daysSince(c.lastContactedDate);
                  return (
                    <div
                      key={c.id}
                      onClick={() => onOpenCompany(c.id)}
                      className="grid grid-cols-[minmax(0,1fr)_150px_130px_auto] gap-4 items-center px-5 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 truncate">{c.name}</span>
                        <span className="text-[11.5px] text-slate-500 truncate">
                          {c.segment || c.industry || "—"}
                          {c.leadScore ? ` · score ${c.leadScore}` : ""}
                        </span>
                      </div>
                      <span className="text-[12px] text-slate-600 truncate">{c.country || "—"}</span>
                      <span className={`text-[12px] font-semibold ${days !== null && days > 14 ? "text-amber-700" : "text-slate-500"}`}>
                        {days === null ? "No contact date" : `Silent ${days} days`}
                      </span>
                      <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        {!isReadOnly && (
                          <button
                            onClick={() => onSetNextStep(c)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-bold px-3.5 h-[34px] rounded-lg cursor-pointer transition-colors"
                          >
                            Set next step
                          </button>
                        )}
                        <button
                          onClick={() => onOpenCompany(c.id)}
                          className="bg-white hover:bg-slate-50 text-slate-600 text-[11.5px] font-semibold px-3 h-[34px] border border-slate-200 rounded-lg cursor-pointer transition-colors"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  );
                })}
                {stalled.length > 3 && (
                  <button
                    onClick={() => setShowAllStalled(!showAllStalled)}
                    className="w-full py-2.5 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {showAllStalled ? "Show fewer" : `Show ${stalled.length - 3} more`}
                  </button>
                )}
              </>
            )}
          </section>
        </div>

        {/* Right rail: what used to be two permanently empty tabs. */}
        <div className="flex flex-col gap-4">

          <section className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[13.5px] font-bold text-slate-900">This week</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next 7 days</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Meetings</span>
              {weekMeetings.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-[10px] px-3.5 py-4 flex flex-col items-center gap-2 text-center">
                  <Calendar className="w-5 h-5 text-slate-300" />
                  <span className="text-[12px] text-slate-500">Nothing scheduled</span>
                  {!isReadOnly && (
                    <button
                      onClick={onScheduleMeeting}
                      className="bg-white hover:bg-slate-50 text-slate-900 text-[11.5px] font-bold px-3 h-8 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                    >
                      Schedule a meeting
                    </button>
                  )}
                </div>
              ) : (
                weekMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.companyId && onOpenCompany(m.companyId)}
                    className="flex items-start gap-2.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-[10px] text-left cursor-pointer transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[12.5px] font-semibold text-slate-900 truncate">{m.title}</span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {m.companyName} · {formatShortDate(m.dateTime)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open tasks</span>
              {openTasks.length === 0 ? (
                <p className="text-[12px] text-slate-400 px-1">No open tasks.</p>
              ) : (
                openTasks.map((t) => {
                  const overdue = (daysSince(t.dueDate) ?? -1) > 0;
                  return (
                    <div key={t.id} className="flex items-start gap-2.5 px-3 py-2.5 bg-slate-50 rounded-[10px]">
                      <button
                        onClick={() => !isReadOnly && onToggleTask(t)}
                        className="mt-0.5 shrink-0 cursor-pointer"
                        aria-label="Mark task done"
                      >
                        {t.status === "DONE"
                          ? <CheckSquare className="w-[15px] h-[15px] text-emerald-500" />
                          : <Square className="w-[15px] h-[15px] text-slate-300" />}
                      </button>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[12.5px] font-semibold text-slate-900">{t.title}</span>
                        <span className={`text-[11px] font-semibold ${overdue ? "text-rose-500" : "text-slate-500"}`}>
                          {t.dueDate ? `Due ${formatShortDate(t.dueDate)}` : "No due date"}
                          {t.companyName ? ` · ${t.companyName}` : ""}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              {!isReadOnly && (
                <button
                  onClick={onAddTask}
                  className="flex items-center gap-1 text-[11.5px] font-bold text-emerald-600 hover:text-emerald-700 py-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add task
                </button>
              )}
            </div>
          </section>

          {suggestion && (
            <section className="bg-indigo-50 border border-indigo-200 rounded-xl px-[18px] py-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-[15px] h-[15px] text-indigo-700" />
                <span className="text-[12px] font-bold text-indigo-800 uppercase tracking-wider">Suggestion</span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-indigo-900">
                <strong>{suggestion.name}</strong>{" "}
                {suggestion.lastContactedDate
                  ? `was last contacted ${describeLastContact(suggestion.lastContactedDate).toLowerCase()}`
                  : "has no recorded contact date"}
                {suggestion.leadScore ? ` and scores ${suggestion.leadScore}/100` : ""} — the warmest lead with nothing agreed.
              </p>
              <button
                onClick={() => onSetNextStep(suggestion)}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-[11.5px] font-bold px-3.5 h-[34px] rounded-lg cursor-pointer self-start transition-colors"
              >
                Set a next step
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyQueue({ text }: { text: string }) {
  return (
    <div className="px-5 py-8 flex flex-col items-center gap-2 text-center">
      <ChevronRight className="w-5 h-5 text-emerald-500" />
      <span className="text-[12.5px] text-slate-500">{text}</span>
    </div>
  );
}
