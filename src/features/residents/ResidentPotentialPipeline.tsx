/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Resident, ResidentStatus, KASHKADARYA_DISTRICTS } from "../../types";
import { PipelineStage, PIPELINE_STAGES, DEFAULT_PROBABILITIES } from "./pipeline/pipelineTypes";
import PipelineSummary from "./pipeline/PipelineSummary";
import PipelineHeader from "./pipeline/PipelineHeader";
import PipelineFilters, { SortOption } from "./pipeline/PipelineFilters";
import PipelineBoard from "./pipeline/PipelineBoard";
import LeadWorkspaceDrawer from "./pipeline/LeadWorkspaceDrawer";
import AddLeadModal from "./pipeline/AddLeadModal";
import PromoteLeadModal from "./pipeline/PromoteLeadModal";
import GlobalAiPipelineModal from "./pipeline/GlobalAiPipelineModal";

interface ResidentPotentialPipelineProps {
  residents: Resident[];
  onUpdate: (id: string, payload: Partial<Resident>) => Promise<void>;
  onAdd: (resident: Omit<Resident, "id">) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  userRole: string;
  onSyncState?: () => void;
}

// Fallback seed potential resident leads for Kashkadarya if database is empty
const defaultSeedLeads: Partial<Resident>[] = [
  {
    id: "lead-kash-1",
    companyName: "Nasaf Software Solutions",
    director: "Bobur Tursunov",
    potentialFounder: "Bobur Tursunov",
    registrationNumber: "POT-301102",
    legalAddress: "Qarshi City, Amir Temur 14",
    employeesCount: 18,
    exportVolume: 160000,
    domesticVolume: 45000,
    status: ResidentStatus.POTENTIAL,
    industry: "Software Development",
    district: "Qarshi",
    potentialStage: "Application Submitted",
    potentialProbability: 90,
    potentialOwner: "Dilnoza Alimova",
    potentialNextFollowUp: "2026-03-01",
    notes: ["Founder submitted audit financial statements. Target export market: Germany & UAE."]
  },
  {
    id: "lead-kash-2",
    companyName: "Shahrisabz Game Studio",
    director: "Sarvar Rustamov",
    potentialFounder: "Sarvar Rustamov",
    registrationNumber: "POT-301103",
    legalAddress: "Shahrisabz City, Ipak Yoli 7",
    employeesCount: 12,
    exportVolume: 220000,
    domesticVolume: 30000,
    status: ResidentStatus.POTENTIAL,
    industry: "GameDev & Animation",
    district: "Shahrisabz",
    potentialStage: "Document Collection",
    potentialProbability: 80,
    potentialOwner: "Olim Shokirov",
    potentialNextFollowUp: "2026-03-03",
    notes: ["Developing Unreal Engine 5 3D mobile games. Seeking 0% CIT exemption on Steam export royalties."]
  },
  {
    id: "lead-kash-3",
    companyName: "Kitob Cyber Dynamics",
    director: "Javohir Karimov",
    potentialFounder: "Javohir Karimov",
    registrationNumber: "POT-301104",
    legalAddress: "Kitob District, Mustaqillik 22",
    employeesCount: 15,
    exportVolume: 140000,
    domesticVolume: 55000,
    status: ResidentStatus.POTENTIAL,
    industry: "Cybersecurity",
    district: "Kitob",
    potentialStage: "Interested",
    potentialProbability: 65,
    potentialOwner: "Dilnoza Alimova",
    potentialNextFollowUp: "2026-03-05",
    notes: ["Penetration testing and SOC monitoring services for GCC banking clients."]
  },
  {
    id: "lead-kash-4",
    companyName: "Koson Data Solutions",
    director: "Farrux Qodirov",
    potentialFounder: "Farrux Qodirov",
    registrationNumber: "POT-301105",
    legalAddress: "Koson District, Buyuk Ipak Yoli 88",
    employeesCount: 8,
    exportVolume: 95000,
    domesticVolume: 40000,
    status: ResidentStatus.POTENTIAL,
    industry: "BPO & IT Outsourcing",
    district: "Koson",
    potentialStage: "Meeting Scheduled",
    potentialProbability: 50,
    potentialOwner: "Olim Shokirov",
    potentialNextFollowUp: "2026-02-28",
    notes: ["Data labeling and remote English technical support operations."]
  },
  {
    id: "lead-kash-5",
    companyName: "Muborak FinTech Labs",
    director: "Shavkat Ergashev",
    potentialFounder: "Shavkat Ergashev",
    registrationNumber: "POT-301106",
    legalAddress: "Muborak District, Neftchilar 12",
    employeesCount: 22,
    exportVolume: 310000,
    domesticVolume: 90000,
    status: ResidentStatus.POTENTIAL,
    industry: "FinTech",
    district: "Muborak",
    potentialStage: "Contacted",
    potentialProbability: 30,
    potentialOwner: "Dilnoza Alimova",
    potentialNextFollowUp: "2026-03-08",
    notes: ["Payment gateway processing middleware for cross-border e-commerce."]
  },
  {
    id: "lead-kash-6",
    companyName: "Guzor Cloud Systems",
    director: "Mansur Xamidov",
    potentialFounder: "Mansur Xamidov",
    registrationNumber: "POT-301107",
    legalAddress: "Gʻuzor District, Mustaqillik 5",
    employeesCount: 6,
    exportVolume: 75000,
    domesticVolume: 25000,
    status: ResidentStatus.POTENTIAL,
    industry: "Software Development",
    district: "Gʻuzor",
    potentialStage: "New Lead",
    potentialProbability: 15,
    potentialOwner: "Olim Shokirov",
    potentialNextFollowUp: "2026-03-10",
    notes: ["SaaS inventory ERP for agricultural supply chain."]
  },
  {
    id: "lead-kash-7",
    companyName: "Chiroqchi EdTech Academy",
    director: "Azizbek Normurodov",
    potentialFounder: "Azizbek Normurodov",
    registrationNumber: "POT-301108",
    legalAddress: "Chiroqchi District, Zarafshon 10",
    employeesCount: 14,
    exportVolume: 180000,
    domesticVolume: 60000,
    status: ResidentStatus.POTENTIAL,
    industry: "EdTech",
    district: "Chiroqchi",
    potentialStage: "Upcoming Resident",
    potentialProbability: 95,
    potentialOwner: "Dilnoza Alimova",
    potentialNextFollowUp: "2026-02-27",
    notes: ["Interactive coding platform with 45k monthly active international learners. Legal review complete."]
  }
];

export default function ResidentPotentialPipeline({
  residents,
  onUpdate,
  onAdd,
  onDelete,
  userRole,
  onSyncState
}: ResidentPotentialPipelineProps) {
  // Modal / Drawer states
  const [selectedLead, setSelectedLead] = useState<Resident | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState<Resident | null>(null);
  const [showGlobalAiModal, setShowGlobalAiModal] = useState(false);

  // View Mode: "kanban" (Full multi-column) | "focused" (Single stage focus) | "compact" (Data matrix)
  const [viewLayout, setViewLayout] = useState<"kanban" | "focused" | "compact">("kanban");

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("export_desc");

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Filter out potential leads from residents array or use fallback seeds
  const potentialResidents = useMemo(() => {
    const fromProps = (residents || []).filter(r => r.status === ResidentStatus.POTENTIAL);
    if (fromProps.length > 0) return fromProps;
    return defaultSeedLeads as Resident[];
  }, [residents]);

  // Extract unique industries and owners for dropdowns
  const uniqueIndustries = useMemo(() => {
    const set = new Set<string>();
    potentialResidents.forEach(r => {
      if (r.industry) set.add(r.industry);
    });
    return Array.from(set).sort();
  }, [potentialResidents]);

  const uniqueOwners = useMemo(() => {
    const set = new Set<string>();
    potentialResidents.forEach(r => {
      if (r.potentialOwner) set.add(r.potentialOwner);
    });
    return Array.from(set).sort();
  }, [potentialResidents]);

  // Filtered & Sorted leads
  const filteredResidents = useMemo(() => {
    return potentialResidents.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        r.companyName?.toLowerCase().includes(q) ||
        r.director?.toLowerCase().includes(q) ||
        r.potentialFounder?.toLowerCase().includes(q) ||
        r.industry?.toLowerCase().includes(q) ||
        r.district?.toLowerCase().includes(q) ||
        r.potentialOwner?.toLowerCase().includes(q);

      const matchesDistrict = !filterDistrict || r.district === filterDistrict;
      const matchesIndustry = !filterIndustry || r.industry === filterIndustry;
      const matchesOwner = !filterOwner || r.potentialOwner === filterOwner;

      return matchesSearch && matchesDistrict && matchesIndustry && matchesOwner;
    }).sort((a, b) => {
      if (sortBy === "export_desc") {
        return (b.exportVolume || 0) - (a.exportVolume || 0);
      }
      if (sortBy === "prob_desc") {
        return (b.potentialProbability || 0) - (a.potentialProbability || 0);
      }
      if (sortBy === "followup_asc") {
        return (a.potentialNextFollowUp || "9999").localeCompare(b.potentialNextFollowUp || "9999");
      }
      return (a.companyName || "").localeCompare(b.companyName || "");
    });
  }, [potentialResidents, searchQuery, filterDistrict, filterIndustry, filterOwner, sortBy]);

  // Overall KPIs calculation
  const metrics = useMemo(() => {
    const totalCount = potentialResidents.length;
    const totalTargetExport = potentialResidents.reduce((sum, r) => sum + (r.exportVolume || 0), 0);
    const weightedTargetExport = potentialResidents.reduce((sum, r) => {
      const prob = (r.potentialProbability || 20) / 100;
      return sum + (r.exportVolume || 0) * prob;
    }, 0);
    const highProbCount = potentialResidents.filter(r => (r.potentialProbability || 0) >= 60).length;

    const todayStr = new Date().toISOString().split("T")[0];
    const dueFollowUpsCount = potentialResidents.filter(r => r.potentialNextFollowUp && r.potentialNextFollowUp <= todayStr).length;

    return {
      totalCount,
      totalTargetExport,
      weightedTargetExport,
      highProbCount,
      dueFollowUpsCount
    };
  }, [potentialResidents]);

  // Move Lead stage handler
  const handleMoveStage = async (id: string, currentStage: PipelineStage, direction: "LEFT" | "RIGHT") => {
    const currentIndex = PIPELINE_STAGES.indexOf(currentStage);
    let nextIndex = currentIndex + (direction === "LEFT" ? -1 : 1);
    if (nextIndex < 0 || nextIndex >= PIPELINE_STAGES.length) return;

    const nextStage = PIPELINE_STAGES[nextIndex];
    const newProbability = DEFAULT_PROBABILITIES[nextStage];

    await onUpdate(id, {
      potentialStage: nextStage,
      potentialProbability: newProbability
    });
    if (onSyncState) onSyncState();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterDistrict("");
    setFilterIndustry("");
    setFilterOwner("");
    setSortBy("export_desc");
  };

  const hasActiveFilters = Boolean(searchQuery || filterDistrict || filterIndustry || filterOwner);

  return (
    <div className="space-y-4 sm:space-y-5 w-full min-w-0 max-w-full overflow-hidden">
      
      {/* 1. Top Header with Title, Actions & View Mode Toggles */}
      <PipelineHeader
        leadCount={filteredResidents.length}
        onOpenGlobalAiModal={() => setShowGlobalAiModal(true)}
        onOpenAddLeadModal={() => setShowAddLeadModal(true)}
        isReadOnly={isReadOnly}
        viewLayout={viewLayout}
        onChangeViewLayout={setViewLayout}
      />

      {/* 2. Responsive 5 KPI Summary Cards Grid */}
      <PipelineSummary metrics={metrics} />

      {/* 3. Responsive Filter & Search Bar */}
      <PipelineFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterDistrict={filterDistrict}
        setFilterDistrict={setFilterDistrict}
        filterIndustry={filterIndustry}
        setFilterIndustry={setFilterIndustry}
        filterOwner={filterOwner}
        setFilterOwner={setFilterOwner}
        sortBy={sortBy}
        setSortBy={setSortBy}
        uniqueIndustries={uniqueIndustries}
        uniqueOwners={uniqueOwners}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Adaptive Responsive Pipeline Board / Stage Tabs / Grid */}
      <PipelineBoard
        residents={filteredResidents}
        onOpenDrawer={(lead) => setSelectedLead(lead)}
        onMoveStage={handleMoveStage}
        isReadOnly={isReadOnly}
        viewLayout={viewLayout}
        onAddNewLeadClick={() => setShowAddLeadModal(true)}
      />

      {/* 5. Lead Workspace 360 Slide-over Drawer */}
      {selectedLead && (
        <LeadWorkspaceDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={onUpdate}
          onDelete={onDelete ? onDelete : async (id) => onUpdate(id, { status: ResidentStatus.REMOVED })}
          onPromoteClick={(lead) => {
            setShowPromoteModal(lead);
          }}
          userRole={userRole}
          onSyncState={onSyncState}
        />
      )}

      {/* 6. Create Lead Modal */}
      {showAddLeadModal && (
        <AddLeadModal
          onClose={() => setShowAddLeadModal(false)}
          onAdd={onAdd}
          onSyncState={onSyncState}
        />
      )}

      {/* 7. Certify & Promote Modal */}
      {showPromoteModal && (
        <PromoteLeadModal
          lead={showPromoteModal}
          onClose={() => setShowPromoteModal(null)}
          onUpdate={onUpdate}
          onSyncState={onSyncState}
        />
      )}

      {/* 8. Global AI Synthesis Strategy Modal */}
      {showGlobalAiModal && (
        <GlobalAiPipelineModal
          residents={potentialResidents}
          onClose={() => setShowGlobalAiModal(false)}
        />
      )}

    </div>
  );
}
