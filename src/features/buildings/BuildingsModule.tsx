/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  X,
  ChevronRight,
  MapPin,
  Layers,
  Users2,
  Car,
  Trash2,
  Pencil,
  Calendar,
} from "lucide-react";
import { BuildingRecord, BuildingStatus } from "../../types";
import PhotoUploader from "../../components/PhotoUploader";
import { useLanguage } from "../../lib/LanguageContext";

interface BuildingsModuleProps {
  buildings: BuildingRecord[];
  onAdd: (building: Omit<BuildingRecord, "id">) => Promise<void>;
  onUpdate: (id: string, building: Partial<BuildingRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  userRole: string;
}

const DEFAULT_FORM = {
  name: "",
  code: "",
  address: "",
  region: "Kashkadarya",
  district: "Qarshi",
  coordinates: "",
  constructionYear: new Date().getFullYear(),
  floors: 1,
  totalArea: 0,
  totalOffices: 0,
  capacity: 0,
  parkingSpots: 0,
  meetingRooms: 0,
  status: BuildingStatus.ACTIVE,
  images: [] as string[],
  virtualTourUrl: "",
  notes: "",
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  UNDER_CONSTRUCTION: "bg-amber-50 text-amber-700",
  MAINTENANCE: "bg-rose-50 text-rose-700",
  PLANNED: "bg-slate-100 text-slate-600",
};

export default function BuildingsModule({ buildings, onAdd, onUpdate, onDelete, userRole }: BuildingsModuleProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const filtered = buildings.filter((b) => {
    const q = searchTerm.toLowerCase().trim();
    return (b.name || "").toLowerCase().includes(q) ||
      (b.address || "").toLowerCase().includes(q) ||
      (b.district || "").toLowerCase().includes(q) ||
      (b.code || "").toLowerCase().includes(q);
  });

  const totalCapacity = buildings.reduce((sum, b) => sum + (b.capacity || 0), 0);
  const totalArea = buildings.reduce((sum, b) => sum + (b.totalArea || 0), 0);

  const openEdit = (b: BuildingRecord) => {
    setFormData({
      name: b.name || "",
      code: b.code || "",
      address: b.address || "",
      region: b.region || "Kashkadarya",
      district: b.district || "Qarshi",
      coordinates: b.coordinates || "",
      constructionYear: b.constructionYear || new Date().getFullYear(),
      floors: b.floors || 1,
      totalArea: b.totalArea || 0,
      totalOffices: b.totalOffices || 0,
      capacity: b.capacity || 0,
      parkingSpots: b.parkingSpots || 0,
      meetingRooms: b.meetingRooms || 0,
      status: b.status || BuildingStatus.ACTIVE,
      images: b.images || [],
      virtualTourUrl: b.virtualTourUrl || "",
      notes: b.notes || "",
    });
    setEditingId(b.id);
    setSelectedBuilding(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert(t("Building name is required"));
      return;
    }
    const payload = { ...formData };
    if (editingId) {
      await onUpdate(editingId, payload);
    } else {
      await onAdd(payload);
    }
    setShowModal(false);
    setEditingId(null);
    setFormData(DEFAULT_FORM);
  };

  return (
    <div id="buildings-module" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t("Buildings Infrastructure")}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t("IT Park's own owned buildings and physical infrastructure -- distinct from the sourced Property Marketplace listings.")}</p>
        </div>
        <button
          id="add-building-btn"
          onClick={() => { setEditingId(null); setFormData(DEFAULT_FORM); setShowModal(true); }}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-600/10 h-[38px]"
        >
          <Plus className="w-4 h-4" />
          <span>{t("Add Building")}</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Buildings on Record")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{buildings.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-x border-slate-200 md:px-6 py-3 md:py-0">
          <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Combined Floor Area")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{totalArea.toLocaleString()} m&sup2;</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t("Total Capacity")}</span>
            <span className="text-lg font-bold text-slate-800 font-mono">{totalCapacity.toLocaleString()} {t("people")}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t("Search building name, code, address, district...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50/50"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-10 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">{buildings.length === 0 ? t("No buildings on record yet. Add the first one.") : t("No buildings match your search.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBuilding(b)}
              className="bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="h-32 bg-slate-100 relative">
                {b.images && b.images[0] ? (
                  <img src={b.images[0]} className="w-full h-full object-cover" alt={b.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Building2 className="w-8 h-8" />
                  </div>
                )}
                <span className={`absolute top-2 left-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded ${STATUS_STYLES[b.status || "ACTIVE"] || STATUS_STYLES.ACTIVE}`}>
                  {(b.status || "ACTIVE").replace(/_/g, " ")}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{b.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{b.address || b.district || t("No address on file")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[10px]">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("Floors")}</span>
                    <span className="font-extrabold text-slate-800 font-mono">{b.floors ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[8px]">{t("Capacity")}</span>
                    <span className="font-extrabold text-slate-800 font-mono">{b.capacity ?? "N/A"}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedBuilding(b); }}
                    className="flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-bold transition-all"
                  >
                    <span>{t("Inspect")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedBuilding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between animate-in slide-in-from-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">{selectedBuilding.name}</h2>
                <span className="text-xs text-slate-500">{selectedBuilding.code || t("No code assigned")}</span>
              </div>
              <button onClick={() => setSelectedBuilding(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {selectedBuilding.images && selectedBuilding.images[0] && (
                <img src={selectedBuilding.images[0]} className="w-full h-40 object-cover rounded-xl border border-slate-100" alt="" />
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Location")}</h3>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedBuilding.address || t("No address on file")}</span>
                  </div>
                  <p className="text-slate-600 pl-6">{selectedBuilding.district}, {selectedBuilding.region}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Specs")}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Floors")}</span>
                    <span className="font-bold text-slate-800">{selectedBuilding.floors ?? "N/A"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Total Area")}</span>
                    <span className="font-bold text-slate-800">{selectedBuilding.totalArea ? `${selectedBuilding.totalArea.toLocaleString()} m²` : "N/A"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Offices")}</span>
                    <span className="font-bold text-slate-800">{selectedBuilding.totalOffices ?? "N/A"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Capacity")}</span>
                    <span className="font-bold text-slate-800">{selectedBuilding.capacity ?? "N/A"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Parking")}</span>
                      <span className="font-bold text-slate-800">{selectedBuilding.parkingSpots ?? "N/A"}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold block">{t("Built")}</span>
                      <span className="font-bold text-slate-800">{selectedBuilding.constructionYear ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBuilding.notes && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{t("Notes")}</h3>
                  <p className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 whitespace-pre-wrap">{selectedBuilding.notes}</p>
                </div>
              )}

              {selectedBuilding.virtualTourUrl && (
                <a
                  href={selectedBuilding.virtualTourUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t("Open Location")}</span>
                </a>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={async () => { if (confirm(t("Delete this building record?"))) { await onDelete(selectedBuilding.id); setSelectedBuilding(null); } }}
                className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                {t("Delete")}
              </button>
              <button
                onClick={() => openEdit(selectedBuilding)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
              >
                <Pencil className="w-3.5 h-3.5" />
                {t("Edit")}
              </button>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {editingId ? t("Edit Building") : t("Add Building")}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Building Name *")}</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Building Code")}</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder={t("e.g. QSHQ-HQ-01")}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Address")}</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("District")}</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Status")}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BuildingStatus })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white cursor-pointer"
                  >
                    <option value="ACTIVE">{t("Active")}</option>
                    <option value="UNDER_CONSTRUCTION">{t("Under Construction")}</option>
                    <option value="MAINTENANCE">{t("Maintenance")}</option>
                    <option value="PLANNED">{t("Planned")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Floors")}</label>
                  <input type="number" value={formData.floors} onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Area (m²)")}</label>
                  <input type="number" value={formData.totalArea} onChange={(e) => setFormData({ ...formData, totalArea: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Offices")}</label>
                  <input type="number" value={formData.totalOffices} onChange={(e) => setFormData({ ...formData, totalOffices: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Capacity")}</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Parking")}</label>
                  <input type="number" value={formData.parkingSpots} onChange={(e) => setFormData({ ...formData, parkingSpots: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Meeting Rms")}</label>
                  <input type="number" value={formData.meetingRooms} onChange={(e) => setFormData({ ...formData, meetingRooms: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Built Year")}</label>
                  <input type="number" value={formData.constructionYear} onChange={(e) => setFormData({ ...formData, constructionYear: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Notes (rent price, contact, etc.)")}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Location Link")}</label>
                <input
                  type="url"
                  value={formData.virtualTourUrl}
                  onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Building Photo")}</label>
                {formData.images[0] && (
                  <img src={formData.images[0]} className="w-full h-28 object-cover rounded-xl border border-slate-100 mb-2" alt="" />
                )}
                <PhotoUploader
                  category="buildings"
                  folder={editingId || "new-building-pending"}
                  onUploaded={(urls) => setFormData(prev => ({ ...prev, images: [...urls, ...prev.images] }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingId(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  {editingId ? t("Save Changes") : t("Add Building")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
