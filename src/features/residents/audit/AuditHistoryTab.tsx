/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle, 
  RotateCcw, 
  ShieldAlert, 
  Upload, 
  FileText,
  Clock
} from "lucide-react";
import { ResidentAudit, AuditEvent } from "./auditTypes";

interface AuditHistoryTabProps {
  audits: ResidentAudit[];
  onSelectAudit: (audit: ResidentAudit) => void;
}

interface FlattenedHistoricalEvent extends AuditEvent {
  companyName: string;
  stir: string;
  reportingYear: number;
  auditRecord: ResidentAudit;
}

export default function AuditHistoryTab({
  audits,
  onSelectAudit
}: AuditHistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  // Collect all events across all audits
  const allEvents: FlattenedHistoricalEvent[] = useMemo(() => {
    const list: FlattenedHistoricalEvent[] = [];
    audits.forEach(a => {
      (a.events || []).forEach(ev => {
        list.push({
          ...ev,
          companyName: a.companyName,
          stir: a.stir,
          reportingYear: a.reportingYear,
          auditRecord: a
        });
      });
    });

    // Sort descending by date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [audits]);

  // Filtered list
  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      const term = (searchTerm || "").toLowerCase();
      const matchesSearch = 
        ev.companyName.toLowerCase().includes(term) ||
        ev.stir.toLowerCase().includes(term) ||
        ev.description.toLowerCase().includes(term) ||
        ev.performedBy.toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (eventTypeFilter !== "ALL" && ev.eventType !== eventTypeFilter) return false;
      if (yearFilter !== "ALL" && ev.reportingYear !== Number(yearFilter)) return false;

      return true;
    });
  }, [allEvents, searchTerm, eventTypeFilter, yearFilter]);

  const distinctYears = useMemo(() => Array.from(new Set(allEvents.map(e => e.reportingYear))).sort((a, b) => b - a), [allEvents]);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "RETURNED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ESCALATED":
        return "bg-rose-100 text-rose-800 border-rose-200 font-black";
      case "SUBMITTED":
      case "RESUBMITTED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "NOTIFICATION_SENT":
      case "REMINDER_SENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search historical audit actions, resident, reviewer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold bg-white"
            >
              <option value="ALL">All Event Types</option>
              <option value="CREATED">Created</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RETURNED">Returned for Correction</option>
              <option value="RESUBMITTED">Resubmitted</option>
              <option value="APPROVED">Approved</option>
              <option value="ESCALATED">Escalated</option>
              <option value="REMINDER_SENT">Reminders / Notices</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold bg-white"
            >
              <option value="ALL">All Cycles</option>
              {distinctYears.map(y => (
                <option key={y} value={y}>{y} Cycle</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Historical Event Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-slate-700" />
            Statutory Audit & Compliance Audit Log ({filteredEvents.length} recorded events)
          </h3>
          <span className="text-[11px] text-slate-400">Complete immutable audit trail</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 italic">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No audit events match the specified filters.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 pl-4 space-y-4">
            {filteredEvents.map((ev) => (
              <div 
                key={ev.id}
                onClick={() => onSelectAudit(ev.auditRecord)}
                className="relative group bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
              >
                {/* Bullet */}
                <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-500 group-hover:bg-emerald-500 transition-colors"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs">{ev.companyName}</span>
                    <span className="text-[10px] font-mono text-slate-400">INN: {ev.stir}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700">
                      {ev.reportingYear} Cycle
                    </span>
                    <span className={`px-2 py-0.2 rounded-md text-[10px] font-black uppercase border ${getEventBadge(ev.eventType)}`}>
                      {ev.eventType}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {ev.createdAt}
                  </span>
                </div>

                <p className="text-xs text-slate-800 mt-2 font-medium">
                  {ev.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1 border-t border-slate-50">
                  <span>Actor / Officer: <b className="text-slate-700">{ev.performedBy}</b></span>
                  <span className="text-emerald-700 font-bold text-[11px] group-hover:underline">Open Audit Record →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
