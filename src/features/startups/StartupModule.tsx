/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Rocket, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  MapPin, 
  Trophy, 
  BarChart3, 
  RotateCcw,
  Building2,
  FileSpreadsheet,
  HelpCircle,
  TrendingUp,
  Layers
} from "lucide-react";
import { Startup, UserRole, KASHKADARYA_DISTRICTS, KashkadaryaDistrict } from "../../types";
import StartupKPIs from "./components/StartupKPIs";
import StartupLifecycleBar from "./components/StartupLifecycleBar";
import StartupTable from "./components/StartupTable";
import StartupGrid from "./components/StartupGrid";
import DistrictPerformance from "./components/DistrictPerformance";
import AtRiskIntervention from "./components/AtRiskIntervention";
import TopPerformers from "./components/TopPerformers";
import FunnelAndCohorts from "./components/FunnelAndCohorts";
import Startup360Modal from "./components/Startup360Modal";
import TraditionalProfileModal from "./components/TraditionalProfileModal";
import StartupFormModal from "./components/StartupFormModal";
import { calculateStartupHealth, normalizeStage } from "./utils/startupCalculations";
import { useLanguage } from "../../lib/LanguageContext";

interface StartupModuleProps {
  startups: Startup[];
  onAdd: (startup: Partial<Startup>) => Promise<any>;
  onUpdate: (id: string, partial: Partial<Startup>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  userRole?: UserRole;
  onSyncState?: () => Promise<void>;
}

type ManagementViewSection = 
  | "ALL_STARTUPS" 
  | "INTERVENTION" 
  | "DISTRICTS" 
  | "TOP_PERFORMERS" 
  | "FUNNEL_COHORTS";

export default function StartupModule({
  startups,
  onAdd,
  onUpdate,
  onDelete,
  userRole = UserRole.MANAGER,
  onSyncState
}: StartupModuleProps) {
  const { t } = useLanguage();
  // Main view navigation tab
  const [activeSection, setActiveSection] = useState<ManagementViewSection>("ALL_STARTUPS");

  // Display style: Table vs Cards
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selected startup modals
  const [selected360Startup, setSelected360Startup] = useState<Startup | null>(null);
  const [selectedTraditionalStartup, setSelectedTraditionalStartup] = useState<Startup | null>(null);

  // Form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStartup, setEditingStartup] = useState<Startup | null>(null);

  // Multi-dimensional Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistrict, setFilterDistrict] = useState<string>("ALL");
  const [filterStage, setFilterStage] = useState<string>("ALL");
  const [filterIndustry, setFilterIndustry] = useState<string>("ALL");
  const [filterHealth, setFilterHealth] = useState<string>("ALL");
  const [filterProgram, setFilterProgram] = useState<string>("ALL");
  const [filterFunding, setFilterFunding] = useState<string>("ALL");

  // Both remaining roles (SUPER_ADMIN, MANAGER) have write access to startups.
  const isReadOnly = false;

  // Compute number of at-risk / intervention startups for tab badge
  const atRiskCount = useMemo(() => {
    return startups.filter(s => {
      const h = calculateStartupHealth(s);
      return h.status === "AT_RISK" || h.status === "NEEDS_ATTENTION";
    }).length;
  }, [startups]);

  // Extract unique industries & programs for dynamic filter options
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    startups.forEach(s => {
      if (s.industry) set.add(s.industry);
    });
    return Array.from(set).sort();
  }, [startups]);

  const availablePrograms = useMemo(() => {
    const set = new Set<string>();
    startups.forEach(s => {
      if (s.program) set.add(s.program);
    });
    return Array.from(set).sort();
  }, [startups]);

  // Filtered startups list
  const filteredStartups = useMemo(() => {
    return startups.filter(s => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (s.name || "").toLowerCase().includes(q);
        const matchesFounder = s.founder?.toLowerCase().includes(q);
        const matchesDesc = s.description?.toLowerCase().includes(q);
        const matchesInd = s.industry?.toLowerCase().includes(q);
        const matchesDist = s.district?.toLowerCase().includes(q);
        if (!matchesName && !matchesFounder && !matchesDesc && !matchesInd && !matchesDist) {
          return false;
        }
      }

      // 2. District filter
      if (filterDistrict !== "ALL") {
        if ((s.district || "Qarshi").toLowerCase() !== filterDistrict.toLowerCase()) {
          return false;
        }
      }

      // 3. Stage filter
      if (filterStage !== "ALL") {
        const stage = normalizeStage(s.stage);
        if (stage !== filterStage) {
          return false;
        }
      }

      // 4. Industry filter
      if (filterIndustry !== "ALL") {
        if (s.industry !== filterIndustry) {
          return false;
        }
      }

      // 5. Health filter
      if (filterHealth !== "ALL") {
        const h = calculateStartupHealth(s);
        if (h.status !== filterHealth) {
          return false;
        }
      }

      // 6. Program filter
      if (filterProgram !== "ALL") {
        if (s.program !== filterProgram) {
          return false;
        }
      }

      // 7. Funding filter
      if (filterFunding !== "ALL") {
        if (filterFunding === "FUNDED" && (!s.fundingRaised || s.fundingRaised <= 0)) {
          return false;
        }
        if (filterFunding === "BOOTSTRAPPED" && s.fundingRaised && s.fundingRaised > 0) {
          return false;
        }
      }

      return true;
    });
  }, [
    startups,
    searchQuery,
    filterDistrict,
    filterStage,
    filterIndustry,
    filterHealth,
    filterProgram,
    filterFunding
  ]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDistrict("ALL");
    setFilterStage("ALL");
    setFilterIndustry("ALL");
    setFilterHealth("ALL");
    setFilterProgram("ALL");
    setFilterFunding("ALL");
  };

  const hasActiveFilters = 
    searchQuery.trim() !== "" || 
    filterDistrict !== "ALL" || 
    filterStage !== "ALL" || 
    filterIndustry !== "ALL" || 
    filterHealth !== "ALL" || 
    filterProgram !== "ALL" || 
    filterFunding !== "ALL";

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Startup ID",
      "Name",
      "Founder",
      "District",
      "Stage",
      "Health Status",
      "Health Score",
      "MRR (USD)",
      "Annual Revenue (USD)",
      "Funding Raised (USD)",
      "Employees",
      "Jobs Created",
      "Paying Customers",
      "Export Revenue (USD)",
      "Next Action"
    ];

    const rows = filteredStartups.map(s => {
      const h = calculateStartupHealth(s);
      const mrr = s.mrr ?? s.kpis?.mrr ?? 0;
      const jobs = s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2);
      return [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.founder.replace(/"/g, '""')}"`,
        `"${(s.district || "Qarshi").replace(/"/g, '""')}"`,
        s.stage,
        h.status,
        h.score,
        mrr,
        s.revenue || 0,
        s.fundingRaised || 0,
        s.employees || 1,
        jobs,
        s.payingCustomers || 0,
        s.exportRevenue || 0,
        `"${(s.nextAction?.action || "").replace(/"/g, '""')}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IT_Park_Kashkadarya_Startups_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="startups-hub-module" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Page Header & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-sm shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t("Startups Hub")}
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {t("Growth Control Center")}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {t("Monitoring technology venture traction, district entrepreneurship adoption, investment readiness, and real economic impact across Qashqadaryo region.")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
            title={t("Export Startups Database to CSV")}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("Export Report")}</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={() => {
                setEditingStartup(null);
                setShowFormModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t("Register Startup")}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top 8 KPI Summary Cards */}
      <StartupKPIs startups={startups} />

      {/* 3. Visual 7-Step Lifecycle Funnel */}
      <StartupLifecycleBar
        startups={startups}
        selectedStage={filterStage}
        onSelectStage={(st) => setFilterStage(st)}
      />

      {/* 4. Section Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSection("ALL_STARTUPS")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === "ALL_STARTUPS"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t("All Startups")} ({startups.length})</span>
          </button>

          <button
            onClick={() => setActiveSection("INTERVENTION")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === "INTERVENTION"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t("Intervention Required")}</span>
            {atRiskCount > 0 && (
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                activeSection === "INTERVENTION" ? "bg-white text-rose-700" : "bg-rose-100 text-rose-800"
              }`}>
                {atRiskCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection("DISTRICTS")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === "DISTRICTS"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t("District Performance")}</span>
          </button>

          <button
            onClick={() => setActiveSection("TOP_PERFORMERS")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === "TOP_PERFORMERS"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t("Top Performers")}</span>
          </button>

          <button
            onClick={() => setActiveSection("FUNNEL_COHORTS")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === "FUNNEL_COHORTS"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t("Funnel & Cohorts")}</span>
          </button>
        </div>

        {activeSection === "ALL_STARTUPS" && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title={t("Table View")}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
              title={t("Card Grid View")}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 5. Main Section Body Display */}

      {/* SECTION: ALL STARTUPS */}
      {activeSection === "ALL_STARTUPS" && (
        <div className="space-y-4">
          
          {/* Multi-Dimensional Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t("Search startup, founder, tech...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white transition-all"
                />
              </div>

              {/* District Filter */}
              <div>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                >
                  <option value="ALL">{t("All Qashqadaryo Districts")}</option>
                  {KASHKADARYA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{t(d)} {t("District")}</option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                >
                  <option value="ALL">{t("All Lifecycle Stages")}</option>
                  <option value="IDEA">{t("Idea (Validation)")}</option>
                  <option value="PRE_MVP">{t("Pre-MVP")}</option>
                  <option value="MVP">{t("MVP (Launched)")}</option>
                  <option value="EARLY_REVENUE">{t("Early Revenue")}</option>
                  <option value="GROWTH">{t("Growth")}</option>
                  <option value="SCALE">{t("Scale")}</option>
                  <option value="GRADUATED">{t("Graduated (Resident)")}</option>
                </select>
              </div>

              {/* Health Filter */}
              <div>
                <select
                  value={filterHealth}
                  onChange={(e) => setFilterHealth(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700"
                >
                  <option value="ALL">{t("All Health Statuses")}</option>
                  <option value="HEALTHY">{t("Healthy (Score ≥ 70)")}</option>
                  <option value="NEEDS_ATTENTION">{t("Needs Attention (45-69)")}</option>
                  <option value="AT_RISK">{t("At Risk (Score < 45)")}</option>
                  <option value="NO_DATA">{t("No Data Reported")}</option>
                </select>
              </div>

            </div>

            {/* Sub-row filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Industry */}
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600"
                >
                  <option value="ALL">{t("Industry: All")}</option>
                  {availableIndustries.map((ind) => (
                    <option key={ind} value={ind}>{t(ind)}</option>
                  ))}
                </select>

                {/* Program */}
                <select
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600"
                >
                  <option value="ALL">{t("Program: All")}</option>
                  {availablePrograms.map((prog) => (
                    <option key={prog} value={prog}>{t(prog)}</option>
                  ))}
                </select>

                {/* Funding */}
                <select
                  value={filterFunding}
                  onChange={(e) => setFilterFunding(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600"
                >
                  <option value="ALL">{t("Funding: All")}</option>
                  <option value="FUNDED">{t("Funded Startups")}</option>
                  <option value="BOOTSTRAPPED">{t("Bootstrapped")}</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t("Reset All Filters")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Render Table or Grid */}
          {viewMode === "table" ? (
            <StartupTable
              startups={filteredStartups}
              onSelectStartup={(s) => setSelected360Startup(s)}
              onOpenTraditionalProfile={(s) => setSelectedTraditionalStartup(s)}
              onDeleteStartup={async (id) => {
                await onDelete(id);
                if (onSyncState) await onSyncState();
              }}
              isReadOnly={isReadOnly}
            />
          ) : (
            <StartupGrid
              startups={filteredStartups}
              onSelectStartup={(s) => setSelected360Startup(s)}
              onOpenTraditionalProfile={(s) => setSelectedTraditionalStartup(s)}
            />
          )}
        </div>
      )}

      {/* SECTION: INTERVENTION REQUIRED */}
      {activeSection === "INTERVENTION" && (
        <AtRiskIntervention
          startups={startups}
          onSelectStartup={(s) => setSelected360Startup(s)}
        />
      )}

      {/* SECTION: DISTRICT PERFORMANCE */}
      {activeSection === "DISTRICTS" && (
        <DistrictPerformance
          startups={startups}
          selectedDistrict={filterDistrict}
          onSelectDistrict={(dist) => {
            setFilterDistrict(dist);
            setActiveSection("ALL_STARTUPS");
          }}
        />
      )}

      {/* SECTION: TOP PERFORMERS */}
      {activeSection === "TOP_PERFORMERS" && (
        <TopPerformers
          startups={startups}
          onSelectStartup={(s) => setSelected360Startup(s)}
        />
      )}

      {/* SECTION: FUNNEL & COHORTS */}
      {activeSection === "FUNNEL_COHORTS" && (
        <FunnelAndCohorts startups={startups} />
      )}

      {/* 6. Comprehensive 360° Profile Modal / Drawer */}
      {selected360Startup && (
        <Startup360Modal
          startup={selected360Startup}
          onClose={() => setSelected360Startup(null)}
          onUpdate={async (id, partial) => {
            await onUpdate(id, partial);
            if (onSyncState) await onSyncState();
            // Update modal reference
            setSelected360Startup(prev => prev ? { ...prev, ...partial } : null);
          }}
          onOpenTraditionalProfile={(s) => {
            setSelectedTraditionalStartup(s);
          }}
          onEdit={(s) => {
            setSelected360Startup(null);
            setEditingStartup(s);
            setShowFormModal(true);
          }}
          isReadOnly={isReadOnly}
        />
      )}

      {/* 7. Official Institutional Dossier Profile */}
      {selectedTraditionalStartup && (
        <TraditionalProfileModal
          startup={selectedTraditionalStartup}
          onClose={() => setSelectedTraditionalStartup(null)}
        />
      )}

      {/* 8. Registration / Edit Modal */}
      {showFormModal && (
        <StartupFormModal
          onClose={() => {
            setShowFormModal(false);
            setEditingStartup(null);
          }}
          initialData={editingStartup}
          onSave={async (data) => {
            if (editingStartup) {
              await onUpdate(editingStartup.id, data);
            } else {
              await onAdd(data);
            }
            if (onSyncState) await onSyncState();
          }}
        />
      )}

    </div>
  );
}
