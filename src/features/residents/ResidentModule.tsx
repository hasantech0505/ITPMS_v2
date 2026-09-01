/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Plus, AlertTriangle } from "lucide-react";
import { Resident, ResidentStatus, KASHKADARYA_DISTRICTS } from "../../types";
import { useLanguage } from "../../lib/LanguageContext";

// Modular sub-components
import { ensureResidentEnrichment, localSeedResidents } from "./ResidentEnrichment";
import ResidentDashboard from "./ResidentDashboard";
import ResidentAllTable from "./ResidentAllTable";
import Resident2026Table from "./Resident2026Table";
import ResidentDeclinedYearly from "./ResidentDeclinedYearly";
import ResidentPotentialPipeline from "./ResidentPotentialPipeline";
import ResidentUpcomingWorkflow from "./ResidentUpcomingWorkflow";
import ResidentRemovedArchive from "./ResidentRemovedArchive";
import ResidentMonitoringLogs from "./ResidentMonitoringLogs";
import ResidentReportsGrid from "./ResidentReportsGrid";
import ResidentAnalyticsDeep from "./ResidentAnalyticsDeep";
import ResidentProfileDetail from "./ResidentProfileDetail";
import ResidentAuditManagement from "./audit/ResidentAuditManagement";

interface ResidentModuleProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  residents: Resident[];
  // Return boolean so handleRegister below can tell whether the submission
  // actually succeeded before closing the modal / resetting the form - see
  // the NOTE on handleAddItem in src/App.tsx for why this matters.
  onAdd: (resident: Omit<Resident, "id">) => Promise<boolean>;
  onUpdate: (id: string, resident: Partial<Resident>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  userRole: string;
  onSyncState?: () => void;
}

export default function ResidentModule({ 
  activeSubTab, 
  setActiveSubTab, 
  residents, 
  onAdd, 
  onUpdate, 
  onDelete, 
  userRole, 
  onSyncState 
}: ResidentModuleProps) {
  const { t } = useLanguage();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for creating a new Certified Resident
  const [formData, setFormData] = useState({
    companyName: "",
    director: "",
    registrationNumber: "", // INN
    legalAddress: "",
    employeesCount: 15,
    exportVolume: 0,
    domesticVolume: 0,
    status: ResidentStatus.ACTIVE,
    industry: "Software Development",
    district: "Qarshi",
    benefits: ["0% Corporate Income Tax", "7.5% Personal Income Tax"]
  });

  // Neither remaining role (SUPER_ADMIN, MANAGER) is read-only.
  const isReadOnly = false;

  // Map backend residents ensuring all optional fields exist
  const enrichedList = (residents && residents.length > 0 ? residents : localSeedResidents).map(ensureResidentEnrichment);

  // Real industries actually in use across the live resident register (from
  // the official Residents.xlsx import), instead of a hardcoded, mostly
  // fictional 5-option list. Falls back to a small curated starter set only
  // when no resident has a real industry recorded yet.
  const realIndustries = Array.from(
    new Set((residents || []).map((r) => (r?.industry || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const industryOptions = realIndustries.length > 0
    ? realIndustries
    : ["Software Development", "IT ta'lim", "Eksport", "Xizmat ko'rsatish", "FinTech", "EdTech"];

  // Handle register new certified resident manually
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.director || !formData.registrationNumber) {
      alert("Company Name, Director and INN (Registration Number) are required");
      return;
    }

    const payload = {
      companyName: formData.companyName,
      director: formData.director,
      registrationNumber: formData.registrationNumber,
      legalAddress: formData.legalAddress || "Tashkent, Uzbekistan",
      employeesCount: Number(formData.employeesCount) || 1,
      exportVolume: Number(formData.exportVolume) || 0,
      domesticVolume: Number(formData.domesticVolume) || 0,
      status: formData.status,
      benefitsApplied: formData.benefits,
      appliedAt: new Date().toISOString().split("T")[0],
      industry: formData.industry,
      district: formData.district,
      notes: ["Manual certificate registration issued by administration."],
      documents: ["tax_registration_inn.pdf"]
    };

    // NOTE (2026-09-01, night): only close the modal and reset the form on
    // an actual success. This used to run unconditionally right after
    // `await onAdd(...)`, which always resolved even when the server
    // rejected the submission (duplicate INN, missing field) - so the user
    // would see the rejection alert, click OK, and find the whole form
    // gone, forcing them to retype the company name, director, address,
    // etc. just to fix the one field that was actually wrong.
    const succeeded = await onAdd(payload);
    if (!succeeded) {
      return;
    }

    setShowAddModal(false);

    // Reset form
    setFormData({
      companyName: "",
      director: "",
      registrationNumber: "",
      legalAddress: "",
      employeesCount: 15,
      exportVolume: 0,
      domesticVolume: 0,
      status: ResidentStatus.ACTIVE,
      industry: "Software Development",
      district: "Qarshi",
      benefits: ["0% Corporate Income Tax", "7.5% Personal Income Tax"]
    });

    if (onSyncState) onSyncState();
  };

  const toggleBenefit = (b: string) => {
    if (formData.benefits.includes(b)) {
      setFormData({ ...formData, benefits: formData.benefits.filter(x => x !== b) });
    } else {
      setFormData({ ...formData, benefits: [...formData.benefits, b] });
    }
  };

  // Several sub-panels below (all-residents table, 2026 table, declined/
  // removed archive, potential pipeline, upcoming workflow, audit
  // management, reports grid) still declare their onAdd/onUpdate/onDelete
  // props as returning `Promise<void>` - they predate the success/failure
  // boolean added to onAdd/onUpdate/onDelete above (see the NOTE on
  // handleAddItem in src/App.tsx) and haven't been updated to act on it.
  // These thin wrappers let them keep compiling and behaving exactly as
  // before (fire-and-forget) without silently dropping the real fix for
  // the primary Add Resident modal and Edit Profile modal, which use the
  // boolean-returning versions directly. Following up on these panels too
  // is tracked as a separate item.
  const onAddVoid = async (resident: Omit<Resident, "id">): Promise<void> => { await onAdd(resident); };
  const onUpdateVoid = async (id: string, resident: Partial<Resident>): Promise<void> => { await onUpdate(id, resident); };
  const onDeleteVoid = async (id: string): Promise<void> => { await onDelete(id); };

  // If a resident detailed profile is currently inspected, render it!
  if (selectedResident) {
    // Re-locate active data in enrichedList in case details changed
    const currentResData = enrichedList.find(r => r.id === selectedResident.id) || selectedResident;
    return (
      <ResidentProfileDetail
        resident={currentResData}
        onClose={() => setSelectedResident(null)}
        onUpdate={onUpdate}
        userRole={userRole}
      />
    );
  }

  // Otherwise, route dynamically based on the active nested sidebar tab
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "residents-dashboard":
        return (
          <ResidentDashboard 
            residents={enrichedList} 
            onSelect={setSelectedResident} 
          />
        );
      
      case "residents-all":
        return (
          <ResidentAllTable 
            residents={enrichedList}
            onSelect={setSelectedResident}
            onDelete={onDeleteVoid}
            onUpdate={onUpdateVoid}
            onAdd={onAddVoid}
            userRole={userRole}
            onSyncState={onSyncState}
            onAddNewClick={() => setShowAddModal(true)}
          />
        );

      case "residents-2026":
        return (
          <Resident2026Table 
            residents={enrichedList}
            onSelect={setSelectedResident}
            onUpdate={onUpdateVoid}
            userRole={userRole}
            onSyncState={onSyncState}
            onAddNewClick={() => setShowAddModal(true)}
          />
        );

      case "residents-declined":
      case "residents-removed":
        return (
          <ResidentDeclinedYearly 
            residents={enrichedList}
            onUpdate={onUpdateVoid}
            onAdd={onAddVoid}
            userRole={userRole}
            onSyncState={onSyncState}
          />
        );

      case "residents-potential":
        return (
          <ResidentPotentialPipeline 
            residents={enrichedList}
            onUpdate={onUpdateVoid}
            onAdd={onAddVoid}
            onDelete={onDeleteVoid}
            userRole={userRole}
            onSyncState={onSyncState}
          />
        );

      case "residents-upcoming":
        return (
          <ResidentUpcomingWorkflow 
            residents={enrichedList}
            onUpdate={onUpdateVoid}
            onAdd={onAddVoid}
            onDelete={onDeleteVoid}
            userRole={userRole}
            onSyncState={onSyncState}
          />
        );

      case "residents-monitoring":
      case "residents-compliance":
      case "residents-audit":
        return (
          <ResidentAuditManagement 
            residents={enrichedList}
            onUpdate={onUpdateVoid}
            userRole={userRole}
            onSyncState={onSyncState}
          />
        );

      case "residents-reports":
        return (
          <ResidentReportsGrid 
            residents={enrichedList}
            onUpdate={onUpdateVoid}
            userRole={userRole}
            onSyncState={onSyncState}
          />
        );

      case "residents-analytics":
        return (
          <ResidentAnalyticsDeep 
            residents={enrichedList}
          />
        );

      default:
        // Default fallback to Dashboard
        return (
          <ResidentDashboard 
            residents={enrichedList} 
            onSelect={setSelectedResident} 
            onAddNewClick={() => setShowAddModal(true)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab view viewport */}
      {renderSubTabContent()}

      {/* GLOBAL APPLY/ADD CERTIFICATION REGISTRATION MODAL */}
      {showAddModal && (
        <div id="add-resident-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Register Certified IT Park Resident</h2>
                <span className="text-[10px] text-slate-400 block font-semibold">Grants tax exemptions and registers legal entities on the official state database.</span>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Registered Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. EPAM Systems LLC"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Director Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.director}
                      onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                      placeholder="Director Name"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INN Tax Number (9 Digits) *</label>
                    <input
                      type="text"
                      required
                      pattern="\d{9}"
                      title="INN tax number must be exactly 9 digits."
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      placeholder="e.g. 301456987"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry</label>
                    <input
                      type="text"
                      list="resident-industry-options"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. IT ta'lim, Eksport, Software Development..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                    <datalist id="resident-industry-options">
                      {industryOptions.map((ind) => (
                        <option key={ind} value={ind} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">District</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                    >
                      {KASHKADARYA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Staff Count</label>
                    <input
                      type="number"
                      value={formData.employeesCount}
                      onChange={(e) => setFormData({ ...formData, employeesCount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exports ($)</label>
                    <input
                      type="number"
                      value={formData.exportVolume}
                      onChange={(e) => setFormData({ ...formData, exportVolume: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Domestic Revenue ($)</label>
                    <input
                      type="number"
                      value={formData.domesticVolume}
                      onChange={(e) => setFormData({ ...formData, domesticVolume: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legal Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.legalAddress}
                    onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                    placeholder="Registered physical corporate address"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                {/* Benefits select checkboxes */}
                <div className="space-y-1.5 border border-slate-100 p-3 bg-slate-50/50 rounded-lg">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Approve Legislation Benefits</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "0% Corporate Income Tax",
                      "7.5% Personal Income Tax",
                      "0% Customs Duty",
                      "0% Value Added Tax"
                    ].map((b) => (
                      <label key={b} className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                        <input
                          type="checkbox"
                          checked={formData.benefits.includes(b)}
                          onChange={() => toggleBenefit(b)}
                          className="rounded border-slate-200 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
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
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Approve Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
