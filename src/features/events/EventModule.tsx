/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CalendarDays, 
  Search, 
  Plus, 
  X, 
  ChevronRight, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight,
  Edit,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Building,
  Users,
  Briefcase,
  FileText,
  Info
} from "lucide-react";
import { Event, KASHKADARYA_DISTRICTS } from "../../types";
import ExportImportManager from "../../components/ExportImportManager";

interface EventModuleProps {
  events: Event[];
  onAdd: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdate: (id: string, event: Partial<Event>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

const REGIONS_LIST = [
  "Tashkent City",
  "Tashkent Region",
  "Samarkand",
  "Bukhara",
  "Fergana",
  "Andijan",
  "Namangan",
  "Kashkadarya",
  "Surkhandarya",
  "Jizzakh",
  "Syrdarya",
  "Navoi",
  "Khorezm",
  "Republic of Karakalpakstan"
];

const EVENT_TYPES = [
  "CONFERENCE",
  "HACKATHON",
  "WORKSHOP",
  "MEETUP",
  "ACCELERATION_DEMO"
];

const MONTHS_MAP: { [key: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

export default function EventModule({ 
  events, 
  onAdd, 
  onUpdate, 
  onDelete, 
  userRole, 
  onSyncState 
}: EventModuleProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [quarterFilter, setQuarterFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [monthFilter, setMonthFilter] = useState("ALL");

  // Sorting State
  const [sortBy, setSortBy] = useState<"eventDate" | "title" | "participantCount" | "startupCount" | "year">("eventDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selected Detail drawer and Modals
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    eventType: "MEETUP",
    eventDate: new Date().toISOString().split("T")[0],
    region: "Tashkent City",
    district: "",
    venue: "",
    organizer: "IT Park Uzbekistan",
    partners: "",
    participantCount: 0,
    startupCount: 0,
    reportUrl: "",
    notes: ""
  });

  const extractDateParts = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { year: new Date().getFullYear(), month: new Date().getMonth() + 1, quarter: Math.floor(new Date().getMonth() / 3) + 1 };
    }
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const quarter = Math.floor((month - 1) / 3) + 1;
    return { year, month, quarter };
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.venue || !formData.district) {
      alert("Title, District, and Venue are required");
      return;
    }

    const { year, month, quarter } = extractDateParts(formData.eventDate);

    const payload = {
      title: formData.title,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      year,
      month,
      quarter,
      region: formData.region,
      district: formData.district,
      venue: formData.venue,
      organizer: formData.organizer,
      partners: formData.partners.trim() || null,
      participantCount: Number(formData.participantCount) || 0,
      startupCount: Number(formData.startupCount) || 0,
      reportUrl: formData.reportUrl.trim() || null,
      notes: formData.notes.trim() || null
    };

    await onAdd(payload);
    setShowAddModal(false);
    resetForm();
    if (onSyncState) onSyncState();
  };

  const handleEditEventClick = (event: Event) => {
    setFormData({
      title: event.title,
      eventType: event.eventType,
      eventDate: event.eventDate,
      region: event.region,
      district: event.district,
      venue: event.venue,
      organizer: event.organizer,
      partners: event.partners || "",
      participantCount: event.participantCount,
      startupCount: event.startupCount,
      reportUrl: event.reportUrl || "",
      notes: event.notes || ""
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!formData.title || !formData.venue || !formData.district) {
      alert("Title, District, and Venue are required");
      return;
    }

    const { year, month, quarter } = extractDateParts(formData.eventDate);

    const payload: Partial<Event> = {
      title: formData.title,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      year,
      month,
      quarter,
      region: formData.region,
      district: formData.district,
      venue: formData.venue,
      organizer: formData.organizer,
      partners: formData.partners.trim() || null,
      participantCount: Number(formData.participantCount) || 0,
      startupCount: Number(formData.startupCount) || 0,
      reportUrl: formData.reportUrl.trim() || null,
      notes: formData.notes.trim() || null,
      updatedAt: new Date().toISOString()
    };

    await onUpdate(selectedEvent.id, payload);
    setShowEditModal(false);
    setSelectedEvent({
      ...selectedEvent,
      ...payload
    } as Event);
    resetForm();
    if (onSyncState) onSyncState();
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete || !onDelete) return;
    await onDelete(eventToDelete.id);
    setShowDeleteConfirm(false);
    setEventToDelete(null);
    setSelectedEvent(null);
    if (onSyncState) onSyncState();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      eventType: "MEETUP",
      eventDate: new Date().toISOString().split("T")[0],
      region: "Tashkent City",
      district: "",
      venue: "",
      organizer: "IT Park Uzbekistan",
      partners: "",
      participantCount: 0,
      startupCount: 0,
      reportUrl: "",
      notes: ""
    });
  };

  // Get dynamic unique filters values
  const uniqueYears = Array.from(new Set(events.map(e => e.year).filter((y): y is number => y !== undefined && y !== null))).sort((a, b) => b - a);
  const uniqueRegions = Array.from(new Set(events.map(e => e.region).filter((r): r is string => Boolean(r)))).sort();

  // Filter Logic
  const filteredEvents = events.filter(e => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = (e.title || "").toLowerCase().includes(query) ||
                          (e.venue || "").toLowerCase().includes(query) ||
                          (e.organizer || "").toLowerCase().includes(query) ||
                          (e.district || "").toLowerCase().includes(query);
    
    const matchesType = typeFilter === "ALL" || e.eventType === typeFilter;
    const matchesYear = yearFilter === "ALL" || String(e.year) === yearFilter;
    const matchesQuarter = quarterFilter === "ALL" || String(e.quarter) === quarterFilter;
    const matchesRegion = regionFilter === "ALL" || e.region === regionFilter;
    const matchesMonth = monthFilter === "ALL" || String(e.month) === monthFilter;

    return matchesSearch && matchesType && matchesYear && matchesQuarter && matchesRegion && matchesMonth;
  });

  // Sorting Logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  const toggleSort = (field: "eventDate" | "title" | "participantCount" | "startupCount" | "year") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  return (
    <div id="event-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Events & Hackathons</h1>
          <p className="text-xs text-slate-500 mt-0.5">Planning and executing regional technology meetups, international hackathons, and webinars.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportImportManager
            module="events"
            moduleTitle="Events & Hackathons"
            data={events}
            columns={[
              { key: "title", label: "Event Title", required: true, type: "string" },
              { key: "eventType", label: "Event Type", required: true, type: "string" },
              { key: "eventDate", label: "Event Date", required: true, type: "date" },
              { key: "region", label: "Region", required: true, type: "string" },
              { key: "district", label: "District", required: true, type: "string" },
              { key: "venue", label: "Venue", required: true, type: "string" },
              { key: "organizer", label: "Organizer", required: true, type: "string" },
              { key: "participantCount", label: "Participant Count", type: "number" },
              { key: "startupCount", label: "Startup Count", type: "number" },
              { key: "partners", label: "Partners", type: "string" },
              { key: "reportUrl", label: "Report URL", type: "string" },
              { key: "notes", label: "Notes", type: "string" }
            ]}
            onImportCompleted={() => onSyncState && onSyncState()}
            userRole={userRole as any}
          />

          {!isReadOnly && (
            <button
              id="create-event-btn"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-600/10 h-[38px]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event File</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="event-search-input"
            type="text"
            placeholder="Search event title, venue, district, organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Selection Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Event Type Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Event Type</label>
            <select
              id="filter-event-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white cursor-pointer outline-none"
            >
              <option value="ALL">All Types</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Region</label>
            <select
              id="filter-region"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white cursor-pointer outline-none"
            >
              <option value="ALL">All Regions</option>
              {uniqueRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Year</label>
            <select
              id="filter-year"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white cursor-pointer outline-none"
            >
              <option value="ALL">All Years</option>
              {uniqueYears.map(y => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>

          {/* Quarter Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Quarter</label>
            <select
              id="filter-quarter"
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white cursor-pointer outline-none"
            >
              <option value="ALL">All Quarters</option>
              <option value="1">Q1 (Jan - Mar)</option>
              <option value="2">Q2 (Apr - Jun)</option>
              <option value="3">Q3 (Jul - Sep)</option>
              <option value="4">Q4 (Oct - Dec)</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Month</label>
            <select
              id="filter-month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white cursor-pointer outline-none"
            >
              <option value="ALL">All Months</option>
              {Object.entries(MONTHS_MAP).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort("title")}>
                <div className="flex items-center gap-1">
                  <span>Title</span>
                  {sortBy === "title" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort("eventDate")}>
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  {sortBy === "eventDate" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="py-3 px-4">Region & District</th>
              <th className="py-3 px-4">Venue</th>
              <th className="py-3 px-4">Organizer</th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort("participantCount")}>
                <div className="flex items-center gap-1">
                  <span>Participants</span>
                  {sortBy === "participantCount" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort("startupCount")}>
                <div className="flex items-center gap-1">
                  <span>Startups</span>
                  {sortBy === "startupCount" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort("year")}>
                <div className="flex items-center gap-1">
                  <span>Quarter / Year</span>
                  {sortBy === "year" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedEvents.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 italic text-xs">
                  No matching events found.
                </td>
              </tr>
            ) : (
              sortedEvents.map((e) => (
                <tr
                  id={`event-row-${e.id}`}
                  key={e.id}
                  onClick={() => setSelectedEvent(e)}
                  className="hover:bg-slate-50/50 transition-all text-xs cursor-pointer"
                >
                  <td className="py-3 px-4 font-semibold text-slate-800">{e.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase">
                      {e.eventType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{e.eventDate}</td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700 font-medium">{e.region}</div>
                    <div className="text-[10px] text-slate-400">{e.district}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{e.venue}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{e.organizer}</td>
                  <td className="py-3 px-4 font-semibold font-mono text-slate-700">{e.participantCount}</td>
                  <td className="py-3 px-4 font-semibold font-mono text-slate-700">{e.startupCount}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[10px]">
                    Q{e.quarter} / {e.year}
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(ev) => ev.stopPropagation()}>
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEvent(e)}
                        title="View Details"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL DRAWER */}
      {selectedEvent && (
        <div id="event-detail-drawer" className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{selectedEvent.title}</h2>
                  <span className="text-xs text-slate-500">Category: {selectedEvent.eventType}</span>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Event Metadata */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Details</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Scheduled Date</span>
                    <span className="font-bold block font-mono text-slate-800 mt-1">{selectedEvent.eventDate}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Quarter / Year</span>
                    <span className="font-bold block font-mono text-slate-800 mt-1">Q{selectedEvent.quarter} / {selectedEvent.year}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Region</span>
                    <span className="font-bold block text-slate-800 mt-1">{selectedEvent.region}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">District</span>
                    <span className="font-bold block text-slate-800 mt-1">{selectedEvent.district}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg col-span-2">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Venue</span>
                    <span className="font-bold block text-slate-800 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedEvent.venue}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Organizer</span>
                    <span className="font-bold block text-slate-800 mt-1">{selectedEvent.organizer}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Partners</span>
                    <span className="font-bold block text-slate-800 mt-1">{selectedEvent.partners || "None declared"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Participants</span>
                    <span className="font-bold block text-emerald-600 font-mono mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      {selectedEvent.participantCount} Attending
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-slate-400 text-[10px] block font-semibold uppercase tracking-wider">Startups Involved</span>
                    <span className="font-bold block text-blue-600 font-mono mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-500" />
                      {selectedEvent.startupCount} Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Link */}
              {selectedEvent.reportUrl && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Campaign Compliance Report
                  </h4>
                  <p className="text-[10px] text-emerald-700 mt-1">An official results submission document is attached for this event.</p>
                  <a 
                    href={selectedEvent.reportUrl} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-800 mt-2 hover:underline"
                  >
                    <span>View Submission File</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Notes</h3>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-sans">
                  {selectedEvent.notes || "No additional administrative logs or context written."}
                </div>
              </div>
            </div>

            {/* Footer with Edit and Delete capabilities */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                {!isReadOnly && (
                  <button
                    onClick={() => handleDeleteClick(selectedEvent)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <button
                    onClick={() => handleEditEventClick(selectedEvent)}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow-md shadow-indigo-600/10 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showAddModal && (
        <div id="add-event-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Draft Event Campaign File</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Title *</label>
                  <input
                    id="form-event-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. UzVenture Summit 2026"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type *</label>
                  <select
                    id="form-event-type"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                  >
                    {EVENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Date *</label>
                  <input
                    id="form-event-date"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Organizer */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organizer *</label>
                  <input
                    id="form-event-organizer"
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Region */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region *</label>
                  <select
                    id="form-event-region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                  >
                    {REGIONS_LIST.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District *</label>
                  <select
                    id="form-event-district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="">Select District</option>
                    {KASHKADARYA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue (Address/Hall) *</label>
                  <input
                    id="form-event-venue"
                    type="text"
                    required
                    placeholder="e.g. Block HQ, Conference Room B"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Partners */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partners (Optional)</label>
                  <input
                    id="form-event-partners"
                    type="text"
                    placeholder="e.g. Ministry of Digital Tech, EPAM Systems"
                    value={formData.partners}
                    onChange={(e) => setFormData({ ...formData, partners: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Participant Count */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participant Count</label>
                  <input
                    id="form-event-participants"
                    type="number"
                    min="0"
                    value={formData.participantCount}
                    onChange={(e) => setFormData({ ...formData, participantCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Startup Count */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Startup Count</label>
                  <input
                    id="form-event-startups"
                    type="number"
                    min="0"
                    value={formData.startupCount}
                    onChange={(e) => setFormData({ ...formData, startupCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Report URL */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report URL (Optional)</label>
                  <input
                    id="form-event-report"
                    type="url"
                    placeholder="https://example.com/reports/venturesummit.pdf"
                    value={formData.reportUrl}
                    onChange={(e) => setFormData({ ...formData, reportUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes (Optional)</label>
                  <textarea
                    id="form-event-notes"
                    rows={3}
                    placeholder="Enter key agenda details, milestones, or outcome expectations..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-event-register"
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {showEditModal && (
        <div id="edit-event-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Update Event Campaign File</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Title *</label>
                  <input
                    id="edit-event-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type *</label>
                  <select
                    id="edit-event-type"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                  >
                    {EVENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Event Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Date *</label>
                  <input
                    id="edit-event-date"
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Organizer */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organizer *</label>
                  <input
                    id="edit-event-organizer"
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Region */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region *</label>
                  <select
                    id="edit-event-region"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer outline-none focus:border-emerald-500"
                  >
                    {REGIONS_LIST.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District *</label>
                  <select
                    id="edit-event-district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="">Select District</option>
                    {KASHKADARYA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue (Address/Hall) *</label>
                  <input
                    id="edit-event-venue"
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Partners */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partners (Optional)</label>
                  <input
                    id="edit-event-partners"
                    type="text"
                    value={formData.partners}
                    onChange={(e) => setFormData({ ...formData, partners: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Participant Count */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Participant Count</label>
                  <input
                    id="edit-event-participants"
                    type="number"
                    min="0"
                    value={formData.participantCount}
                    onChange={(e) => setFormData({ ...formData, participantCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Startup Count */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Startup Count</label>
                  <input
                    id="edit-event-startups"
                    type="number"
                    min="0"
                    value={formData.startupCount}
                    onChange={(e) => setFormData({ ...formData, startupCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Report URL */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report URL (Optional)</label>
                  <input
                    id="edit-event-report"
                    type="url"
                    value={formData.reportUrl}
                    onChange={(e) => setFormData({ ...formData, reportUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes (Optional)</label>
                  <textarea
                    id="edit-event-notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-event-update"
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteConfirm && eventToDelete && (
        <div id="delete-confirm-dialog" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-slate-800">Confirm Event Deletion</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Are you sure you want to permanently delete event campaign <strong className="text-slate-700">"{eventToDelete.title}"</strong>? This will purge all associated metric files across the environment.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEventToDelete(null);
                }}
                className="px-3.5 py-1.5 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-red-600/10"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
