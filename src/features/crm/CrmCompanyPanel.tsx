/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Everything about one company, in one place.
 *
 * This is where Meetings Register and Action Tasks went. As top-level tabs they
 * were permanently empty and had no context; here they are one activity stream
 * belonging to the company you are looking at. The next-step box at the top is
 * the piece the old module had nowhere for -- and the reason 22 contacted leads
 * had all stopped moving.
 */

import React, { useMemo, useState } from "react";
import {
  Calendar, ChevronDown, Clock, ListTodo, Mail, Pencil, Plus, Send, StickyNote, X,
} from "lucide-react";
import { Company, Contact, Meeting, Task } from "../../types";
import {
  PIPELINE_STAGES, PipelineStage, activityFor, contactNameLooksWrong,
  describeLastContact, formatShortDate, hasNextStep, initialsOf, stageMeta, stageOf,
} from "./crmDerive";

interface CrmCompanyPanelProps {
  company: Company;
  contacts: Contact[];
  meetings: Meeting[];
  tasks: Task[];
  isReadOnly: boolean;
  onClose: () => void;
  onChangeStage: (company: Company, stage: PipelineStage) => void;
  onSaveNextStep: (company: Company, nextStep: string, followUpDate: string) => void;
  onAddMeeting: (company: Company) => void;
  onAddTask: (company: Company) => void;
  onEditCompany: (id: string) => void;
  onEditContact: (id: string) => void;
  onAddContact: (company: Company) => void;
}

export default function CrmCompanyPanel({
  company, contacts, meetings, tasks, isReadOnly, onClose, onChangeStage,
  onSaveNextStep, onAddMeeting, onAddTask, onEditCompany, onEditContact, onAddContact,
}: CrmCompanyPanelProps) {

  const [stageOpen, setStageOpen] = useState(false);
  const [editingNext, setEditingNext] = useState(false);
  const [nextText, setNextText] = useState(company.nextStep || "");
  const [nextDate, setNextDate] = useState(company.nextFollowUpDate || "");

  const stage = stageOf(company);
  const meta = stageMeta(stage);
  const companyContacts = useMemo(() => contacts.filter((c) => c.companyId === company.id), [contacts, company.id]);
  const activity = useMemo(
    () => activityFor(company.id, meetings, tasks, contacts),
    [company.id, meetings, tasks, contacts]
  );

  const stepSet = hasNextStep(company);

  const save = () => {
    onSaveNextStep(company, nextText.trim(), nextDate);
    setEditingNext(false);
  };

  const facts: { label: string; value?: string }[] = [
    { label: "Country", value: company.country },
    { label: "Company size", value: company.employeeCountBand },
    { label: "Vertical", value: company.segment || company.industry },
    { label: "Source", value: company.leadSource },
    { label: "Last contact", value: describeLastContact(company.lastContactedDate) },
    { label: "Lead score", value: company.leadScore ? `${company.leadScore}/100` : undefined },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/30" />

      <aside
        onClick={(e) => { e.stopPropagation(); setStageOpen(false); }}
        className="relative w-full max-w-[900px] h-full bg-white shadow-2xl flex flex-col animate-[slideIn_.15s_ease-out]"
      >
        {/* Header */}
        <header className="px-7 pt-5 pb-4 border-b border-slate-200 flex flex-col gap-3.5 shrink-0">
          <div className="flex items-start justify-between gap-5">
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="text-[21px] font-bold text-slate-900 tracking-tight truncate">{company.name}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[12.5px] text-slate-500">{company.country || "Country not recorded"}</span>
                {company.website && (
                  <>
                    <span className="text-slate-300">·</span>
                    <a
                      href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                      target="_blank" rel="noreferrer"
                      className="text-[12.5px] text-emerald-600 hover:text-emerald-700"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  disabled={isReadOnly}
                  onClick={() => setStageOpen(!stageOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 h-[38px] border text-[12px] font-bold cursor-pointer disabled:cursor-default transition-colors"
                  style={{ background: meta.chipBg, color: meta.chipText, borderColor: meta.chipBorder }}
                >
                  {meta.label}
                  {!isReadOnly && <ChevronDown className="w-3 h-3" />}
                </button>
                {stageOpen && (
                  <div className="absolute z-20 top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[150px]">
                    {PIPELINE_STAGES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { onChangeStage(company, s.key); setStageOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle" style={{ background: s.accent }} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isReadOnly && (
                <button
                  onClick={() => onEditCompany(company.id)}
                  title="Edit company"
                  className="w-[38px] h-[38px] border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                title="Close"
                className="w-[38px] h-[38px] border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
              >
                <X className="w-[17px] h-[17px]" />
              </button>
            </div>
          </div>

          {/* The next-step box. */}
          <div className={`rounded-[10px] px-4 py-3 border ${stepSet ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            {editingNext ? (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">What happens next?</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    autoFocus
                    value={nextText}
                    onChange={(e) => setNextText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditingNext(false); }}
                    placeholder="e.g. Send the BPO incentives comparison"
                    className="grow bg-white border border-slate-200 rounded-lg px-3 py-2 text-[12.5px] outline-hidden focus:border-slate-400"
                  />
                  <input
                    type="date"
                    value={nextDate ? nextDate.slice(0, 10) : ""}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[12.5px] outline-hidden focus:border-slate-400"
                  />
                  <button onClick={save} className="bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-bold px-4 h-[38px] rounded-lg cursor-pointer transition-colors">
                    Save
                  </button>
                  <button onClick={() => setEditingNext(false)} className="text-[11.5px] font-semibold text-slate-500 px-2 cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className={`w-4 h-4 shrink-0 ${stepSet ? "text-emerald-700" : "text-amber-700"}`} />
                  <div className="flex flex-col gap-px min-w-0">
                    <span className={`text-[12.5px] font-bold ${stepSet ? "text-emerald-900" : "text-amber-900"}`}>
                      {stepSet
                        ? company.nextStep || `Follow up on ${formatShortDate(company.nextFollowUpDate)}`
                        : `No next step set${company.lastContactedDate ? ` — silent since ${formatShortDate(company.lastContactedDate)}` : ""}`}
                    </span>
                    <span className={`text-[11.5px] ${stepSet ? "text-emerald-700" : "text-amber-700"}`}>
                      {stepSet && company.nextFollowUpDate
                        ? `Due ${formatShortDate(company.nextFollowUpDate)}`
                        : stepSet
                        ? "No date set"
                        : "A lead with nothing agreed is a lead that stops moving."}
                    </span>
                  </div>
                </div>
                {!isReadOnly && (
                  <button
                    onClick={() => { setNextText(company.nextStep || ""); setNextDate(company.nextFollowUpDate || ""); setEditingNext(true); }}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-bold px-4 h-[34px] rounded-lg cursor-pointer shrink-0 transition-colors"
                  >
                    {stepSet ? "Change" : "Set next step"}
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="grow grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] overflow-hidden">

          {/* Activity: meetings, tasks and notes in one stream. */}
          <div className="px-7 py-5 lg:border-r border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[13.5px] font-bold text-slate-900">Activity</h3>
              {!isReadOnly && (
                <div className="flex gap-1.5">
                  <SmallBtn onClick={() => onAddMeeting(company)} icon={<Calendar className="w-3.5 h-3.5" />}>Meeting</SmallBtn>
                  <SmallBtn onClick={() => onAddTask(company)} icon={<ListTodo className="w-3.5 h-3.5" />}>Task</SmallBtn>
                </div>
              )}
            </div>

            {activity.length === 0 ? (
              <div className="border border-dashed border-slate-300 rounded-xl px-5 py-9 flex flex-col items-center gap-2 text-center">
                <StickyNote className="w-5 h-5 text-slate-300" />
                <span className="text-[12.5px] text-slate-500">Nothing recorded for this company yet.</span>
                {!isReadOnly && (
                  <span className="text-[11.5px] text-slate-400">Log a meeting or a task and it will appear here.</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                {activity.map((a, i) => (
                  <div key={a.id} className="grid grid-cols-[30px_minmax(0,1fr)] gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center border ${
                        a.kind === "task" && a.overdue ? "bg-amber-50 border-amber-200"
                          : a.kind === "meeting" ? "bg-sky-50 border-sky-200"
                          : "bg-slate-100 border-slate-200"
                      }`}>
                        {a.kind === "meeting" ? <Calendar className="w-3.5 h-3.5 text-sky-700" />
                          : a.kind === "task" ? <ListTodo className={`w-3.5 h-3.5 ${a.overdue ? "text-amber-700" : "text-slate-600"}`} />
                          : <StickyNote className="w-3.5 h-3.5 text-slate-600" />}
                      </div>
                      {i < activity.length - 1 && <div className="w-px grow bg-slate-200 min-h-[22px]" />}
                    </div>
                    <div className="pb-5 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12.5px] font-bold text-slate-900">{a.title}</span>
                        {a.overdue && (
                          <span className="bg-rose-50 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Overdue</span>
                        )}
                      </div>
                      {a.kind === "note" ? (
                        <p className="bg-slate-50 border-l-2 border-slate-300 rounded-r-lg px-3 py-2.5 text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">
                          {a.detail}
                        </p>
                      ) : (
                        <span className="text-[11.5px] text-slate-500">{a.detail}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contacts and facts. */}
          <div className="px-7 lg:px-5 py-5 bg-slate-50 flex flex-col gap-5 overflow-y-auto">

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Contacts ({companyContacts.length})
                </span>
                {!isReadOnly && (
                  <button onClick={() => onAddContact(company)} className="flex items-center gap-1 text-[11.5px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>

              {companyContacts.length === 0 ? (
                <p className="text-[12px] text-slate-400">Nobody recorded yet.</p>
              ) : (
                companyContacts.map((c) => {
                  const broken = contactNameLooksWrong(c);
                  return (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-[10px] px-3.5 py-3 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 ${
                          broken ? "bg-amber-50 text-amber-700 border border-dashed border-amber-400" : "bg-emerald-50 text-emerald-800"
                        }`}>
                          {broken ? "?" : initialsOf(c.fullName)}
                        </div>
                        <div className="flex flex-col gap-px min-w-0">
                          {broken ? (
                            <button
                              onClick={() => onEditContact(c.id)}
                              className="text-[12.5px] font-bold text-amber-700 italic text-left cursor-pointer hover:underline"
                            >
                              Name missing — add it
                            </button>
                          ) : (
                            <span className="text-[12.5px] font-bold text-slate-900 truncate">{c.fullName}</span>
                          )}
                          <span className="text-[11.5px] text-slate-500 truncate">{c.role || (broken ? c.fullName : "Role not recorded")}</span>
                        </div>
                      </div>
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-[11.5px] text-emerald-600 hover:text-emerald-700 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </a>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company facts</span>
              <div className="bg-white border border-slate-200 rounded-[10px] p-3.5 grid grid-cols-2 gap-3.5">
                {facts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.label}</span>
                    <span className={`text-[12.5px] font-semibold ${f.value ? "text-slate-900" : "text-slate-300"}`}>
                      {f.value || "Not set"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {company.competingOptions && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comparing us against</span>
                <p className="bg-white border border-slate-200 rounded-[10px] px-3.5 py-3 text-[12px] text-slate-700 leading-relaxed">
                  {company.competingOptions}
                </p>
              </div>
            )}

            {!isReadOnly && companyContacts.some((c) => c.email) && (
              <a
                href={`mailto:${companyContacts.map((c) => c.email).filter(Boolean).join(",")}`}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold h-[38px] rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Email this company
              </a>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function SmallBtn({ children, icon, onClick }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 text-[11.5px] font-bold px-3 h-8 border border-slate-200 rounded-lg cursor-pointer transition-colors"
    >
      {icon}{children}
    </button>
  );
}
