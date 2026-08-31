/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Rocket, Building2, MapPin, DollarSign, Users, Target } from "lucide-react";
import { Startup, KASHKADARYA_DISTRICTS, KashkadaryaDistrict } from "../../../types";
import { useLanguage } from "../../../lib/LanguageContext";

interface StartupFormModalProps {
  onClose: () => void;
  onSave: (startupData: Partial<Startup>) => Promise<void>;
  initialData?: Startup | null;
}

export default function StartupFormModal({
  onClose,
  onSave,
  initialData
}: StartupFormModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(initialData?.name || "");
  const [founder, setFounder] = useState(initialData?.founder || "");
  const [district, setDistrict] = useState<KashkadaryaDistrict>(initialData?.district || "Qarshi");
  const [industry, setIndustry] = useState(initialData?.industry || "EdTech");
  const [stage, setStage] = useState<any>(initialData?.stage || "MVP");
  const [status, setStatus] = useState<any>(initialData?.status || "ACCELERATING");
  const [program, setProgram] = useState(initialData?.program || "Incubation");
  const [cohort, setCohort] = useState(initialData?.cohort || "2026 Cohort");
  const [businessModel, setBusinessModel] = useState(initialData?.businessModel || "B2B SaaS");
  const [description, setDescription] = useState(initialData?.description || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "+998 90 ");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [mrr, setMrr] = useState(initialData?.mrr?.toString() || "0");
  const [revenue, setRevenue] = useState(initialData?.revenue?.toString() || "0");
  const [fundingRaised, setFundingRaised] = useState(initialData?.fundingRaised?.toString() || "0");
  const [fundingStatus, setFundingStatus] = useState(initialData?.fundingStatus || "Pre-Seed");
  const [employees, setEmployees] = useState(initialData?.employees?.toString() || "2");
  const [jobsCreated, setJobsCreated] = useState(initialData?.jobsCreated?.toString() || "1");
  const [payingCustomers, setPayingCustomers] = useState(initialData?.payingCustomers?.toString() || "0");
  
  // Next action
  const [nextActionTitle, setNextActionTitle] = useState(initialData?.nextAction?.action || "");
  const [nextActionPriority, setNextActionPriority] = useState<any>(initialData?.nextAction?.priority || "HIGH");
  const [nextActionDue, setNextActionDue] = useState(initialData?.nextAction?.dueDate || "2026-10-15");
  const [nextActionAssignee, setNextActionAssignee] = useState(initialData?.nextAction?.assignedTo || "Dilnoza Alimova");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !founder.trim()) return;

    setSaving(true);
    try {
      const parsedMrr = parseFloat(mrr) || 0;
      const parsedRev = parseFloat(revenue) || 0;
      const parsedFunding = parseFloat(fundingRaised) || 0;
      const parsedEmp = parseInt(employees, 10) || 1;
      const parsedJobs = parseInt(jobsCreated, 10) || Math.max(0, parsedEmp - 1);
      const parsedPaying = parseInt(payingCustomers, 10) || 0;

      const payload: Partial<Startup> = {
        name: name.trim(),
        founder: founder.trim(),
        district,
        industry,
        stage,
        status,
        program,
        cohort,
        businessModel,
        description: description.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
        mrr: parsedMrr,
        revenue: parsedRev,
        fundingRaised: parsedFunding,
        fundingStatus,
        employees: parsedEmp,
        jobsCreated: parsedJobs,
        payingCustomers: parsedPaying,
        totalCustomers: parsedPaying > 0 ? parsedPaying * 3 : 10,
        activeUsers: parsedPaying > 0 ? parsedPaying * 10 : 50,
        joinedAt: initialData?.joinedAt || new Date().toISOString().split("T")[0],
        nextAction: nextActionTitle.trim() ? {
          action: nextActionTitle.trim(),
          priority: nextActionPriority,
          dueDate: nextActionDue,
          assignedTo: nextActionAssignee,
          status: "IN_PROGRESS"
        } : undefined
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error("Failed to save startup:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="startup-form-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {initialData ? `${t("Edit Startup")}: ${initialData.name}` : t("Register New Technology Startup")}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t("Record new startup venture into IT Park Kashkadarya incubation pipeline.")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/50">
          
          {/* Section 1: Core Entity Info */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-2">
              {t("1. Venture & Founder Details")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Startup Name *")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("e.g. AgroSense AI")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Founder / CEO *")}</label>
                <input
                  type="text"
                  required
                  placeholder={t("e.g. Jasur Rakhmonov")}
                  value={founder}
                  onChange={(e) => setFounder(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Administrative District *")}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as KashkadaryaDistrict)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  {KASHKADARYA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{t(d)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Industry Sector")}</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="AgriTech">{t("AgriTech")}</option>
                  <option value="EdTech">{t("EdTech")}</option>
                  <option value="FinTech">{t("FinTech")}</option>
                  <option value="HealthTech">{t("HealthTech")}</option>
                  <option value="AI / ML">{t("AI / ML")}</option>
                  <option value="Logistics">{t("Logistics")}</option>
                  <option value="BPO / Enterprise">{t("BPO / Enterprise")}</option>
                  <option value="CleanTech / Energy">{t("CleanTech / Energy")}</option>
                  <option value="E-Commerce">{t("E-Commerce")}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Lifecycle Stage")}</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="IDEA">{t("Idea (Validation)")}</option>
                  <option value="PRE_MVP">{t("Pre-MVP (Prototyping)")}</option>
                  <option value="MVP">{t("MVP (Launched)")}</option>
                  <option value="EARLY_REVENUE">{t("Early Revenue (Monetizing)")}</option>
                  <option value="GROWTH">{t("Growth (Scaling MRR)")}</option>
                  <option value="SCALE">{t("Scale (Regional Expansion)")}</option>
                  <option value="GRADUATED">{t("Graduated (IT Park Resident)")}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Program Track & Cohort")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Incubation">{t("Incubation")}</option>
                    <option value="Acceleration">{t("Acceleration")}</option>
                    <option value="Startup Garage">{t("Startup Garage")}</option>
                    <option value="Local2Global">{t("Local2Global")}</option>
                    <option value="Hackathon">{t("Hackathon")}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t("2026 Cohort")}
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">{t("Solution & Product Description")}</label>
              <textarea
                rows={2}
                placeholder={t("Brief explanation of product problem, customer segment and technology...")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Section 2: Economics, Traction & Headcount */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-2">
              {t("2. Economics, Traction & Employment")}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Monthly Recurring Revenue (USD)")}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Paying Customers")}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={payingCustomers}
                  onChange={(e) => setPayingCustomers(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Funding Raised (USD)")}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={fundingRaised}
                  onChange={(e) => setFundingRaised(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Team Headcount")}</label>
                <input
                  type="number"
                  placeholder="2"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("New Jobs Created")}</label>
                <input
                  type="number"
                  placeholder="1"
                  value={jobsCreated}
                  onChange={(e) => setJobsCreated(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Funding Stage")}</label>
                <select
                  value={fundingStatus}
                  onChange={(e) => setFundingStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Bootstrapped">{t("Bootstrapped")}</option>
                  <option value="Pre-Seed">{t("Pre-Seed")}</option>
                  <option value="Seed">{t("Seed")}</option>
                  <option value="Series A">{t("Series A")}</option>
                  <option value="Grant Funded">{t("Grant Funded")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Next Best Action */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-2">
              {t("3. Next Best Action for IT Park Officer")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-bold mb-1">{t("Action Description")}</label>
                <input
                  type="text"
                  placeholder={t("e.g. Schedule commercial pilot demo with Regional Health Authority")}
                  value={nextActionTitle}
                  onChange={(e) => setNextActionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Action Priority")}</label>
                <select
                  value={nextActionPriority}
                  onChange={(e) => setNextActionPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="CRITICAL">{t("Critical")}</option>
                  <option value="HIGH">{t("High")}</option>
                  <option value="MEDIUM">{t("Medium")}</option>
                  <option value="LOW">{t("Low")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Official Contacts */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-2">
              {t("4. Contact & Digital Channels")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Email")}</label>
                <input
                  type="email"
                  placeholder="contact@startup.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Phone")}</label>
                <input
                  type="text"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">{t("Website")}</label>
                <input
                  type="text"
                  placeholder="https://startup.uz"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {saving ? t("Saving Record...") : (initialData ? t("Save Changes") : t("Register Startup"))}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
