import React from "react";
import { 
  Search, 
  Filter, 
  Flame, 
  Clock, 
  MessageSquare, 
  Layers, 
  Rocket, 
  Building2, 
  Building, 
  Users, 
  Calendar, 
  Lightbulb, 
  CheckCircle2, 
  Printer, 
  Download 
} from "lucide-react";
import { CommentCategory, CommentStatus, CommentPriority } from "../../../types";

interface CommentFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  sortBy: "boosted" | "newest" | "active" | "priority";
  onSortChange: (sortBy: "boosted" | "newest" | "active" | "priority") => void;
  onExportCsv: () => void;
  onPrint: () => void;
  totalResults: number;
}

export default function CommentFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  onExportCsv,
  onPrint,
  totalResults
}: CommentFilterBarProps) {
  const categories = [
    { id: "all", label: "All Topics", icon: Layers },
    { id: "ideas", label: "💡 Innovation Ideas", icon: Lightbulb },
    { id: "startups", label: "🚀 Startups", icon: Rocket },
    { id: "residents", label: "🏢 Residents", icon: Building2 },
    { id: "infrastructure", label: "🏗️ Infrastructure", icon: Building },
    { id: "talent", label: "🎓 Talent", icon: Users },
    { id: "events", label: "📅 Events", icon: Calendar },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search discussions, proposals, tags (#ITExport, #Agritech), authors..."
            className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action buttons (Export & Print) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
            title="Export all comments and feedback to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-[#74BD22]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
            title="Print executive summary of discussions"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#74BD22] text-slate-950 shadow-xs scale-102"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter Dropdowns & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#74BD22]"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PLANNED">Planned</option>
              <option value="IMPLEMENTED">Implemented</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#74BD22]"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🔵 Medium</option>
              <option value="ROUTINE">⚪ Routine</option>
            </select>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Sort by:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onSortChange("boosted")}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                sortBy === "boosted"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Most Boosted</span>
            </button>

            <button
              onClick={() => onSortChange("newest")}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                sortBy === "newest"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Clock className="w-3 h-3 text-blue-500" />
              <span>Newest</span>
            </button>

            <button
              onClick={() => onSortChange("active")}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                sortBy === "active"
                  ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3 h-3 text-purple-500" />
              <span>Most Active</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 pl-2">
            ({totalResults} {totalResults === 1 ? "thread" : "threads"})
          </span>
        </div>
      </div>
    </div>
  );
}
