/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The people list, rebuilt.
 *
 * The old cards put name, role, a whole company paragraph and six
 * pipe-separated facts into one italic grey line, at ragged heights, two to a
 * row. Worse, imports had written job titles into the name field, so the list
 * showed "DATA INGENER" and "HEAD OF PROJECTS | SENIOR LECTURER ON IT LAW" as
 * if they were people.
 *
 * Now: one line per person, grouped under their company, company facts on the
 * group header instead of repeated in every card, contact details clickable,
 * notes collapsed to a line. Records with a broken name are shown as broken and
 * offered a fix rather than quietly rendered as a person.
 */

import React, { useMemo, useState } from "react";
import {
  AlertTriangle, Calendar, ChevronDown, ChevronRight, Linkedin, Mail, Pencil, Phone, Trash2, UserRound,
} from "lucide-react";
import { Company, Contact } from "../../types";
import {
  contactNameLooksWrong, describeLastContact, initialsOf, noteLooksLikeMeeting,
} from "./crmDerive";

interface CrmPeopleListProps {
  contacts: Contact[];
  companies: Company[];
  isReadOnly: boolean;
  onEditContact: (id: string) => void;
  onDeleteContact: (contact: Contact) => void;
  onOpenCompany: (id: string) => void;
}

export default function CrmPeopleList({
  contacts, companies, isReadOnly, onEditContact, onDeleteContact, onOpenCompany,
}: CrmPeopleListProps) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [openNote, setOpenNote] = useState<string | null>(null);

  const needFixing = useMemo(() => contacts.filter(contactNameLooksWrong).length, [contacts]);

  // Group by company so a company's facts are stated once, not per card.
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; name: string; company?: Company; people: Contact[] }>();
    contacts.forEach((c) => {
      const key = c.companyId || c.companyName || "unassigned";
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: c.companyName || "No company recorded",
          company: companies.find((co) => co.id === c.companyId),
          people: [],
        });
      }
      map.get(key)!.people.push(c);
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, companies]);

  const toggle = (key: string) =>
    setCollapsed((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  if (contacts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
        <p className="text-[13px] font-semibold text-slate-700">No people match these filters.</p>
        <p className="text-[12px] text-slate-400 mt-1">Clear a filter or widen the search to see more.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Name the mess instead of hiding it in the card titles. */}
      {needFixing > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-[18px] py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-[17px] h-[17px] text-amber-700 shrink-0" />
            <div className="flex flex-col gap-px">
              <span className="text-[12.5px] font-bold text-amber-900">
                {needFixing} contact{needFixing > 1 ? "s have" : " has"} a job title or note where the name should be
              </span>
              <span className="text-[11.5px] text-amber-700">
                They came in from imports. Fixing them makes search and email actually work.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="grid grid-cols-[34px_minmax(0,1.35fr)_minmax(0,1.15fr)_130px_100px] gap-4 px-[18px] py-2.5 border-b border-slate-200">
          <span />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Person</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reach them</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last contact</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</span>
        </div>

        {groups.map((group) => {
          const isCollapsed = collapsed.includes(group.key);
          const co = group.company;
          const facts = [co?.country, co?.employeeCountBand ? `${co.employeeCountBand} staff` : null, co?.segment || co?.industry]
            .filter(Boolean)
            .join(" · ");

          return (
            <div key={group.key}>
              <div className="px-[18px] py-2.5 bg-slate-50 border-y border-slate-200 flex items-center gap-2.5">
                <button onClick={() => toggle(group.key)} className="cursor-pointer text-slate-500" aria-label="Toggle group">
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[12.5px] font-bold text-slate-900">{group.name}</span>
                {facts && <span className="text-[11.5px] text-slate-500 truncate">{facts}</span>}
                <span className="text-[11px] text-slate-400">
                  {group.people.length} {group.people.length === 1 ? "person" : "people"}
                </span>
                <div className="grow" />
                {co && (
                  <button
                    onClick={() => onOpenCompany(co.id)}
                    className="text-[11.5px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    Open company
                  </button>
                )}
              </div>

              {!isCollapsed && group.people.map((p) => {
                const broken = contactNameLooksWrong(p);
                const hasNote = Boolean(p.notes && p.notes.trim());
                const noteIsMeeting = hasNote && noteLooksLikeMeeting(p.notes);

                return (
                  <div key={p.id}>
                    <div className="grid grid-cols-[34px_minmax(0,1.35fr)_minmax(0,1.15fr)_130px_100px] gap-4 items-center px-[18px] py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">

                      {broken ? (
                        <div className="w-[30px] h-[30px] rounded-full bg-amber-50 border border-dashed border-amber-400 flex items-center justify-center">
                          <UserRound className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                      ) : (
                        <div className="w-[30px] h-[30px] rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center">
                          {initialsOf(p.fullName)}
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5 min-w-0">
                        {broken ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-amber-700 italic">Name missing</span>
                            {!isReadOnly && (
                              <button
                                onClick={() => onEditContact(p.id)}
                                className="bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.5 border border-amber-200 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
                              >
                                Add name
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-[13px] font-bold text-slate-900 truncate">{p.fullName}</span>
                        )}
                        <span className="text-[11.5px] text-slate-500 truncate">
                          {broken
                            ? `Recorded as “${p.fullName}”`
                            : p.role || <span className="italic text-slate-400">Role not recorded</span>}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        {p.email && (
                          <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-[12px] text-emerald-600 hover:text-emerald-700 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{p.email}</span>
                          </a>
                        )}
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 text-[12px] text-emerald-600 hover:text-emerald-700 truncate">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{p.phone}</span>
                          </a>
                        )}
                        {!p.email && !p.phone && p.linkedInUrl && (
                          <a href={p.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px] text-emerald-600 hover:text-emerald-700 truncate">
                            <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">LinkedIn profile</span>
                          </a>
                        )}
                        {!p.email && !p.phone && !p.linkedInUrl && (
                          <span className="text-[12px] text-slate-400 italic">No contact details</span>
                        )}
                      </div>

                      <span className="text-[12px] text-slate-500">{describeLastContact(co?.lastContactedDate)}</span>

                      <div className="flex gap-1.5 justify-end">
                        {p.email && (
                          <a href={`mailto:${p.email}`} title="Email" className="w-7 h-7 rounded-[7px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {!isReadOnly && (
                          <>
                            <button onClick={() => onEditContact(p.id)} title="Edit" className="w-7 h-7 rounded-[7px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => onDeleteContact(p)} title="Delete" className="w-7 h-7 rounded-[7px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-200 cursor-pointer transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* One line, expandable — not a four-line italic wall. */}
                    {hasNote && (
                      <div className="pl-[68px] pr-[18px] pb-3 border-b border-slate-100">
                        {noteIsMeeting ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 min-w-0">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span className="text-[11.5px] text-slate-600 truncate">
                                This looks like a meeting summary: “{p.notes.trim().slice(0, 90)}…”
                              </span>
                            </div>
                            {!isReadOnly && (
                              <button
                                onClick={() => onEditContact(p.id)}
                                className="bg-white hover:bg-slate-50 text-slate-900 text-[11px] font-bold px-3 h-[30px] border border-slate-200 rounded-lg cursor-pointer shrink-0 transition-colors"
                              >
                                Move to meeting notes
                              </button>
                            )}
                          </div>
                        ) : openNote === p.id ? (
                          <div className="flex flex-col gap-1.5">
                            <p className="text-[11.5px] text-slate-600 leading-relaxed whitespace-pre-line">{p.notes.trim()}</p>
                            <button onClick={() => setOpenNote(null)} className="text-[11.5px] font-bold text-emerald-600 self-start cursor-pointer">Hide note</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11.5px] text-slate-500 truncate">{p.notes.trim()}</span>
                            <button onClick={() => setOpenNote(p.id)} className="text-[11.5px] font-bold text-emerald-600 shrink-0 cursor-pointer">Read note</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
