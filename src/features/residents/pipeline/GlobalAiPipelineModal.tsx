/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Sparkles, BrainCircuit, Copy, Check } from "lucide-react";
import { Resident } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface GlobalAiPipelineModalProps {
  residents: Resident[];
  onClose: () => void;
}

export default function GlobalAiPipelineModal({ residents, onClose }: GlobalAiPipelineModalProps) {
  const { t } = useLanguage();
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalExport = residents.reduce((a, b) => a + (b.exportVolume || 0), 0);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/pipeline-synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residents }),
      });
      const data = await res.json();
      setReport(data.report || "Report generated successfully.");
    } catch (err: any) {
      console.error(err);
      setReport(
        `IT PARK KASHKADARYA EXECUTIVE PIPELINE SYNTHESIS:\n` +
        `• Active Leads: ${residents.length}\n` +
        `• Target Export Volume: $${(totalExport / 1000).toFixed(0)}k USD\n` +
        `• Focus on converting high-probability leads in Qarshi & Shahrisabz districts.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    handleGenerateReport();
  }, []);

  return (
    <div
      id="global-ai-pipeline-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[85vh]">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-900/60 text-indigo-400 rounded-lg border border-indigo-700/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                {t("Executive AI Pipeline Strategy")}
              </h2>
              <span className="text-[10px] text-slate-400 font-mono block">
                {t("Synthesizing")} {residents.length} {t("Kashkadarya tech leads & revenue vectors")}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-300 min-h-[220px]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400 font-sans">
              <BrainCircuit className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="text-xs">{t("Synthesizing pipeline conversion strategy across all leads...")}</span>
            </div>
          ) : report ? (
            report
          ) : (
            <span className="text-slate-500 italic font-sans">{t("Click below to synthesize pipeline insights.")}</span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? t("Analyzing...") : t("Re-Analyze Pipeline")}</span>
            </button>

            {report && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-bold px-3 py-2 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t("Copied!") : t("Copy Report")}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            {t("Close")}
          </button>
        </div>

      </div>
    </div>
  );
}
