/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  BarChart2, 
  AlertTriangle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { CalculatedKPI } from "../types/kpiTypes";
import { formatKpiValue } from "../utils/kpiCalculations";

interface PerformanceForecastProps {
  calculatedKpis: CalculatedKPI[];
  t: (key: string, fallback?: string) => string;
}

export default function PerformanceForecast({ calculatedKpis, t }: PerformanceForecastProps) {
  const exportKpi = calculatedKpis.find((k) => k.id === "export_volume");
  const hasExportData = exportKpi?.dataAvailable !== false;

  // Only forecast KPIs that have real reported data — a linear run-rate
  // projection on top of a "No data reported" 0 would be misleading.
  const forecastableKpis = calculatedKpis.filter((k) => k.dataAvailable !== false).slice(0, 3);

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t("Predictive BI Engine")}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{t("Q4 Year-End Run-Rate Forecast")}</span>
          </div>
          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            {t("executiveDashboard.forecastTitle", "PERFORMANCE FORECAST & YEAR-END PROJECTION")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("Projected Q4 2026 outcomes based on current run-rate momentum.")}
          </p>
        </div>

        {!hasExportData && (
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold text-slate-600 block">{t("IT EXPORT TRAJECTORY UNAVAILABLE")}</span>
              <span className="text-slate-500">{t("Resident export revenue hasn't been imported yet")}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Export volume trajectory chart — only rendered once real export data exists */}
        <div className="lg:col-span-2 h-64 bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-2 text-[11px] font-bold text-slate-600">
            <span>{t("IT EXPORT VOLUME TRAJECTORY ($ Millions USD)")}</span>
            {hasExportData && (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" /> {t("Target")}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block" /> {t("Actual")}
                </span>
              </div>
            )}
          </div>

          {hasExportData && exportKpi ? (
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart
                data={[{ period: "2026 Actual", actual: exportKpi.actual / 1_000_000, target: exportKpi.annualTarget / 1_000_000 }]}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="targetColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}M`} />
                <Tooltip
                  formatter={(val: any) => [`$${val}M`, ""]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="target" stroke="#10b981" strokeWidth={2} fill="url(#targetColor)" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={3} fill="url(#forecastColor)" name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-xs text-slate-400 font-medium">
                {t("No export revenue history is on file yet, so a trajectory chart can't be drawn honestly.")}
                <br />{t("This will populate once resident export data is imported.")}
              </p>
            </div>
          )}
        </div>

        {/* Forecast Summary Cards — only KPIs with real reported data */}
        <div className="space-y-3">
          {forecastableKpis.map((kpi) => (
            <div key={kpi.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>{t(kpi.nameKey, kpi.defaultName)}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono uppercase">
                  {t("Q4 Forecast")}
                </span>
              </div>

              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500">{t("Current Actual")}:</span>
                <span className="font-bold text-slate-900">{formatKpiValue(kpi.actual, kpi.unit)}</span>
              </div>

              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500">{t("Annual Target")}:</span>
                <span className="font-bold text-slate-700">{formatKpiValue(kpi.annualTarget, kpi.unit)}</span>
              </div>

              <div className="flex justify-between items-baseline text-xs pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-bold">{t("Projected Finish")}:</span>
                <span className="font-black text-indigo-600">{formatKpiValue(kpi.forecast, kpi.unit)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
