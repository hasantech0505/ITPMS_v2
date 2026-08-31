/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  Printer, 
  X, 
  MapPin, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  FileText,
  Mail,
  Phone
} from "lucide-react";
import { Startup } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface TraditionalProfileModalProps {
  startup: Startup;
  onClose: () => void;
}

export default function TraditionalProfileModal({
  startup,
  onClose
}: TraditionalProfileModalProps) {
  const { t } = useLanguage();
  const handlePrint = () => {
    window.print();
  };

  const hp = startup.historicalPerformance || [];

  return (
    <div id="traditional-profile-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              {t("IT Park Official Resident / Startup Institutional Profile")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t("Print Dossier")}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Sheet */}
        <div className="flex-1 p-8 sm:p-12 overflow-y-auto bg-white space-y-8 print:p-0 print:overflow-visible">
          
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block">
                {t("Ministry of Digital Technologies of the Republic of Uzbekistan")} &bull; {t("IT Park Kashkadarya")}
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {startup.name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {t("Official Enterprise Dossier & Historical Growth Report")}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded">
                {t("REG ID")}: {startup.id.toUpperCase()}
              </span>
              <div className="text-[10px] text-slate-400 font-mono block">
                {t("Doc Date")}: {new Date().toISOString().split("T")[0]}
              </div>
            </div>
          </div>

          {/* Core Entity Information Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              {t("1. General Entity Information")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Director / Founder")}</span>
                <span className="font-bold text-slate-800 block mt-0.5">{startup.founder}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Administrative District")}</span>
                <span className="font-bold text-slate-800 block mt-0.5">{t(startup.district || "Qarshi")}, {t("Qashqadaryo")}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Establishment Year")}</span>
                <span className="font-bold text-slate-800 block mt-0.5">{startup.foundedYear || 2024}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Legal / Ecosystem Status")}</span>
                <span className="font-bold text-indigo-700 block mt-0.5">{t(startup.status)} ({startup.stage})</span>
              </div>
            </div>
          </div>

          {/* Operational Scope */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              {t("2. Technical & Commercial Scope")}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {startup.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("Specialization")}</span>
                <strong className="text-slate-800">{startup.industry}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("Commercial Model")}</span>
                <strong className="text-slate-800">{startup.businessModel || t("B2B SaaS")}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("Servicing Bank")}</span>
                <strong className="text-slate-800">{startup.bank || t("National Bank of Uzbekistan")}</strong>
              </div>
            </div>
          </div>

          {/* Historical Performance Table */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              {t("3. Verified Historical Growth & Economic Output")}
            </h2>
            <table className="w-full text-left border-collapse text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                  <th className="p-2.5">{t("Year")}</th>
                  <th className="p-2.5 text-center">{t("Employees")}</th>
                  <th className="p-2.5 text-right">{t("Annual Revenue (USD)")}</th>
                  <th className="p-2.5 text-right">{t("Export Revenue (USD)")}</th>
                  <th className="p-2.5 text-center">{t("Net Jobs Created")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {hp.length > 0 ? (
                  hp.map((h) => (
                    <tr key={h.year}>
                      <td className="p-2.5 font-bold font-mono text-slate-900">{h.year}</td>
                      <td className="p-2.5 text-center font-mono">{h.employees}</td>
                      <td className="p-2.5 text-right font-mono font-semibold">${h.revenue.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono text-slate-600">${(h.exportRevenue || 0).toLocaleString()}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+{h.jobsCreated || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-slate-900">2025</td>
                    <td className="p-2.5 text-center font-mono">{startup.employees || 1}</td>
                    <td className="p-2.5 text-right font-mono font-semibold">${(startup.revenue || 0).toLocaleString()}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">${(startup.exportRevenue || 0).toLocaleString()}</td>
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">+{startup.jobsCreated || 0}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Growth Story Narrative & Strategic Targets */}
          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              {t("4. Strategic Targets & Expansion Roadmap (2026–2027)")}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Export Target (2026/27)")}</span>
                <span className="text-base font-black text-slate-900 font-mono block mt-1">
                  ${(startup.targets?.exportTarget || 100000).toLocaleString()} USD
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Headcount Target")}</span>
                <span className="text-base font-black text-slate-900 font-mono block mt-1">
                  {startup.targets?.employeeTarget || 20} {t("Team Members")}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">{t("Target New High-Tech Jobs")}</span>
                <span className="text-base font-black text-emerald-600 font-mono block mt-1">
                  +{startup.targets?.newJobsTarget || 15} {t("Positions")}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Signature & Verification Block */}
          <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-end text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">{t("IT Park Kashkadarya Regional Directorate")}</span>
              <span className="text-[11px] text-slate-500 block">{t("Monitoring, Incubation & Acceleration Department")}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{t("Verification Code")}: ITP-KASH-{startup.id.toUpperCase()}-VERIFIED</span>
            </div>
            <div className="border-b border-slate-400 w-48 text-center pb-1 text-[11px] text-slate-500">
              {t("Authorized Signature & Stamp")}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
