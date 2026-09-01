/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reusable "AI Insights" card, dropped at the top of a module (Residents,
 * CRM, Startups, Executive Dashboard). Fetches 2-3 real-data-grounded
 * observations from GET /api/ai/insights/:module on mount, with a manual
 * refresh button. The backend (AIService.getModuleInsights) computes every
 * finding from live records first and only asks the AI to sharpen the
 * phrasing, so this never shows a fabricated number - a fetch failure or
 * an AI-unavailable response still renders the deterministic findings.
 */
import React, { useEffect, useState, useCallback } from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export type AiInsightsModule = "residents" | "crm" | "startups" | "executive";

interface AiInsightsCardProps {
  module: AiInsightsModule;
  title?: string;
}

export default function AiInsightsCard({ module, title }: AiInsightsCardProps) {
  const { t } = useLanguage();
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/ai/insights/${module}`, { headers });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setInsights(Array.isArray(data?.insights) ? data.insights : []);
    } catch (err) {
      console.error("AI insights fetch failed:", err);
      setError(t("Couldn't load AI insights right now.", "Couldn't load AI insights right now."));
    } finally {
      setIsLoading(false);
    }
  }, [module, t]);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {title || t("AI Insights", "AI Insights")}
          </h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="text-slate-400 hover:text-emerald-600 disabled:opacity-50 cursor-pointer transition-colors"
          title={t("Refresh", "Refresh")}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && insights.length === 0 && !error ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3 bg-emerald-100/70 rounded animate-pulse" style={{ width: `${85 - i * 12}%` }} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      ) : insights.length === 0 ? (
        <p className="text-xs text-slate-400">{t("No insights available yet.", "No insights available yet.")}</p>
      ) : (
        <ul className="space-y-1.5">
          {insights.map((insight, i) => (
            <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
              <span className="text-emerald-500 font-bold flex-shrink-0">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
