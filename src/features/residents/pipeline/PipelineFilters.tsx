/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { KASHKADARYA_DISTRICTS } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

export type SortOption = "export_desc" | "prob_desc" | "followup_asc" | "name_asc";

interface PipelineFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterDistrict: string;
  setFilterDistrict: (val: string) => void;
  filterIndustry: string;
  setFilterIndustry: (val: string) => void;
  filterOwner: string;
  setFilterOwner: (val: string) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  uniqueIndustries: string[];
  uniqueOwners: string[];
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function PipelineFilters({
  searchQuery,
  setSearchQuery,
  filterDistrict,
  setFilterDistrict,
  filterIndustry,
  setFilterIndustry,
  filterOwner,
  setFilterOwner,
  sortBy,
  setSortBy,
  uniqueIndustries,
  uniqueOwners,
  onResetFilters,
  hasActiveFilters
}: PipelineFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3 w-full min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 items-center w-full min-w-0">

        {/* 1. Global Search Box (spans 2 columns on wide screens) */}
        <div className="relative col-span-1 sm:col-span-2 xl:col-span-2 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={t("Search company, founder, industry, owner...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title={t("Clear search")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. District Filter */}
        <div className="min-w-0">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500 truncate cursor-pointer"
          >
            <option value="">{t("All Districts")} ({KASHKADARYA_DISTRICTS.length})</option>
            {KASHKADARYA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d} {t("District")}</option>
            ))}
          </select>
        </div>

        {/* 3. Industry Filter */}
        <div className="min-w-0">
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500 truncate cursor-pointer"
          >
            <option value="">{t("All Industries")}</option>
            {uniqueIndustries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* 4. Owner Filter */}
        <div className="min-w-0">
          <select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500 truncate cursor-pointer"
          >
            <option value="">{t("All Owners")}</option>
            {uniqueOwners.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* 5. Sort Dropdown */}
        <div className="min-w-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-bold focus:bg-white focus:outline-hidden focus:border-emerald-500 truncate cursor-pointer"
          >
            <option value="export_desc">{t("Sort: Target Export ($ High)")}</option>
            <option value="prob_desc">{t("Sort: Probability (% High)")}</option>
            <option value="followup_asc">{t("Sort: Next Follow-Up Date")}</option>
            <option value="name_asc">{t("Sort: Company Name (A-Z)")}</option>
          </select>
        </div>

      </div>

      {/* Active Filters Summary & Reset Button */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500 text-[11px]">
            <Filter className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-slate-700">{t("Active Filters:")}</span>
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                "{searchQuery}"
              </span>
            )}
            {filterDistrict && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {t("District")}: {filterDistrict}
              </span>
            )}
            {filterIndustry && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {t("Industry")}: {filterIndustry}
              </span>
            )}
            {filterOwner && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                {t("Owner")}: {filterOwner}
              </span>
            )}
          </div>

          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t("Reset Filters")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
