/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Building2, TrendingUp, Users, DollarSign, ArrowRight } from "lucide-react";
import { Startup, KASHKADARYA_DISTRICTS } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface DistrictPerformanceProps {
  startups: Startup[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export default function DistrictPerformance({
  startups,
  selectedDistrict,
  onSelectDistrict
}: DistrictPerformanceProps) {
  const { t } = useLanguage();
  // Aggregate stats per district using official districts
  const districtData = KASHKADARYA_DISTRICTS.map(dist => {
    const matched = startups.filter(s => (s.district || "Qarshi").toLowerCase() === dist.toLowerCase());
    const count = matched.length;
    const active = matched.filter(s => s.status === "ACCELERATING" || s.status === "ACTIVE" || s.status === "APPLICANT").length;
    const revenue = matched.reduce((acc, s) => acc + (s.revenue || 0), 0);
    const jobs = matched.reduce((acc, s) => acc + (s.jobsCreated ?? Math.max(0, (s.employees || 1) - 2)), 0);
    const funding = matched.reduce((acc, s) => acc + (s.fundingRaised || 0), 0);

    return {
      district: dist,
      count,
      active,
      revenue,
      jobs,
      funding
    };
  }).filter(d => d.count > 0 || ["Qarshi", "Shahrisabz", "Kitob", "Koson", "Muborak", "Gʻuzor", "Dehqonobod"].includes(d.district));

  // Sort by startup count descending
  districtData.sort((a, b) => b.count - a.count);

  return (
    <div id="district-performance-container" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t("Kashkadarya District Startup Distribution & Economic Traction")}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t("Monitoring technology entrepreneurship adoption and direct jobs creation across official administrative units.")}
            </p>
          </div>
        </div>

        {selectedDistrict !== "ALL" && (
          <button
            onClick={() => onSelectDistrict("ALL")}
            className="text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg font-semibold transition-all self-start sm:self-auto cursor-pointer"
          >
            {t("Show All Districts")} ({selectedDistrict})
          </button>
        )}
      </div>

      {/* District table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4">{t("District")}</th>
              <th className="py-2.5 px-4 text-center">{t("Startups")}</th>
              <th className="py-2.5 px-4 text-center">{t("Active")}</th>
              <th className="py-2.5 px-4 text-right">{t("Revenue (USD)")}</th>
              <th className="py-2.5 px-4 text-center">{t("Jobs Created")}</th>
              <th className="py-2.5 px-4 text-right">{t("Funding Raised")}</th>
              <th className="py-2.5 px-4 text-right">{t("Action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {districtData.map((d) => {
              const isSelected = (selectedDistrict || "").toLowerCase() === (d.district || "").toLowerCase();

              return (
                <tr
                  key={d.district}
                  onClick={() => onSelectDistrict(isSelected ? "ALL" : d.district)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? "bg-indigo-50/70 font-semibold" : "hover:bg-slate-50/70"
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{d.district}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                    {d.count}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                      {d.active}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                    ${d.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                    +{d.jobs}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    ${d.funding.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-600 text-white" 
                          : "text-indigo-600 hover:bg-indigo-50"
                      }`}
                    >
                      {isSelected ? t("Filtered") : t("Filter")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
