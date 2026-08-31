/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  FileCheck, 
  Clock, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Bell, 
  Eye, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { ResidentAudit, AuditStatus, STATUS_CONFIG, calculateDaysRemaining } from "./auditTypes";

interface AuditDashboardTabProps {
  audits: ResidentAudit[];
  selectedYear: number;
  totalActiveResidentsCount: number;
  onSelectAudit: (audit: ResidentAudit) => void;
  onOpenReminderModal: (audit: ResidentAudit) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function AuditDashboardTab({
  audits,
  selectedYear,
  totalActiveResidentsCount,
  onSelectAudit,
  onOpenReminderModal,
  onNavigateToTab
}: AuditDashboardTabProps) {
  // Filter audits for the selected reporting cycle
  const yearAudits = audits.filter(a => a.reportingYear === selectedYear);

  // Dynamic KPI calculations
  const totalRequired = yearAudits.length || totalActiveResidentsCount;
  const submittedCount = yearAudits.filter(a => a.status !== "PENDING_SUBMISSION").length;
  const underReviewCount = yearAudits.filter(a => a.status === "UNDER_REVIEW" || a.status === "RESUBMITTED").length;
  const returnedCount = yearAudits.filter(a => a.status === "RETURNED_FOR_CORRECTION").length;
  const approvedCount = yearAudits.filter(a => a.status === "APPROVED").length;
  const overdueCount = yearAudits.filter(a => {
    if (a.status === "APPROVED") return false;
    const daysLeft = calculateDaysRemaining(a.dueDate);
    return daysLeft < 0 || a.status === "OVERDUE";
  }).length;
  const highRiskCount = yearAudits.filter(a => a.riskLevel === "HIGH").length;

  const complianceRate = totalRequired > 0 ? Math.round((approvedCount / totalRequired) * 100) : 0;
  const submissionRate = totalRequired > 0 ? Math.round((submittedCount / totalRequired) * 100) : 0;

  // Status Distribution
  const statusCounts: Record<AuditStatus, number> = {
    APPROVED: yearAudits.filter(a => a.status === "APPROVED").length,
    UNDER_REVIEW: yearAudits.filter(a => a.status === "UNDER_REVIEW").length,
    SUBMITTED: yearAudits.filter(a => a.status === "SUBMITTED").length,
    RESUBMITTED: yearAudits.filter(a => a.status === "RESUBMITTED").length,
    RETURNED_FOR_CORRECTION: yearAudits.filter(a => a.status === "RETURNED_FOR_CORRECTION").length,
    PENDING_SUBMISSION: yearAudits.filter(a => a.status === "PENDING_SUBMISSION").length,
    OVERDUE: overdueCount,
    REJECTED: yearAudits.filter(a => a.status === "REJECTED").length,
    ESCALATED: yearAudits.filter(a => a.status === "ESCALATED").length,
  };

  // Upcoming Deadlines (Sorted by days remaining ascending)
  const upcomingDeadlines = [...yearAudits]
    .filter(a => a.status !== "APPROVED")
    .map(a => ({
      ...a,
      daysRemaining: calculateDaysRemaining(a.dueDate)
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 6);

  // High Risk cases list
  const highRiskCases = yearAudits.filter(a => a.riskLevel === "HIGH" || a.status === "ESCALATED");

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Executive KPI Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        
        {/* Total Active Residents */}
        <div 
          onClick={() => onNavigateToTab("register")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Residents</span>
            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{totalActiveResidentsCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Certified active</span>
        </div>

        {/* Audit Reports Required */}
        <div 
          onClick={() => onNavigateToTab("register")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Required {selectedYear}</span>
            <FileCheck className="w-4 h-4 text-blue-500 group-hover:text-blue-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-blue-900 mt-1">{totalRequired}</p>
          <span className="text-[10px] text-blue-600 font-medium">Statutory cycle</span>
        </div>

        {/* Submitted */}
        <div 
          onClick={() => onNavigateToTab("register")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">Submitted</span>
            <TrendingUp className="w-4 h-4 text-sky-500 group-hover:text-sky-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-sky-900 mt-1">{submittedCount}</p>
          <span className="text-[10px] text-sky-600 font-medium">{submissionRate}% rate</span>
        </div>

        {/* Under Review */}
        <div 
          onClick={() => onNavigateToTab("under-review")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Under Review</span>
            <Clock className="w-4 h-4 text-blue-500 group-hover:text-blue-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-blue-800 mt-1">{underReviewCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">In verification</span>
        </div>

        {/* Returned for Correction */}
        <div 
          onClick={() => onNavigateToTab("returned")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Returned</span>
            <RotateCcw className="w-4 h-4 text-amber-500 group-hover:text-amber-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-amber-900 mt-1">{returnedCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Action required</span>
        </div>

        {/* Approved */}
        <div 
          onClick={() => onNavigateToTab("approved")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-emerald-900 mt-1">{approvedCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">{complianceRate}% compliance</span>
        </div>

        {/* Overdue */}
        <div 
          onClick={() => onNavigateToTab("overdue")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:text-rose-700 transition-colors" />
          </div>
          <p className="text-xl font-black text-rose-800 mt-1">{overdueCount}</p>
          <span className="text-[10px] text-rose-600 font-medium">Past deadline</span>
        </div>

        {/* High Risk */}
        <div 
          onClick={() => onNavigateToTab("escalated")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-900 tracking-wider">High Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-800 group-hover:text-rose-950 transition-colors" />
          </div>
          <p className="text-xl font-black text-rose-950 mt-1">{highRiskCount}</p>
          <span className="text-[10px] text-rose-800 font-medium">Escalated / Delinquent</span>
        </div>

      </div>

      {/* Executive Summary Banner (Director 30-second snapshot) */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Executive Compliance Overview • {selectedYear} Audit Cycle
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            {totalRequired} Required • <b className="text-white">{submittedCount} Submitted</b> • <b className="text-emerald-400">{approvedCount} Approved ({complianceRate}%)</b> • <b className="text-blue-300">{underReviewCount} Under Review</b> • <b className="text-amber-400">{returnedCount} Returned</b> • <b className="text-rose-400">{overdueCount} Overdue</b>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Compliance Rate</span>
            <span className="text-lg font-black text-emerald-400">{complianceRate}%</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Avg Review Time</span>
            <span className="text-lg font-black text-blue-400">4.2 Days</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Compliance Distribution + Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Visual Status Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Audit Compliance Status Distribution
            </h3>
            <span className="text-xs font-bold text-slate-400 font-mono">
              Total: {totalRequired}
            </span>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-2.5 text-xs">
            {[
              { label: "Approved", count: statusCounts.APPROVED, color: "bg-emerald-500", text: "text-emerald-700" },
              { label: "Under Review", count: statusCounts.UNDER_REVIEW + statusCounts.RESUBMITTED, color: "bg-blue-500", text: "text-blue-700" },
              { label: "Submitted", count: statusCounts.SUBMITTED, color: "bg-sky-500", text: "text-sky-700" },
              { label: "Returned for Correction", count: statusCounts.RETURNED_FOR_CORRECTION, color: "bg-amber-500", text: "text-amber-700" },
              { label: "Pending Initial Submission", count: statusCounts.PENDING_SUBMISSION, color: "bg-slate-300", text: "text-slate-700" },
              { label: "Overdue", count: overdueCount, color: "bg-rose-500", text: "text-rose-700" },
              { label: "Escalated Cases", count: statusCounts.ESCALATED, color: "bg-rose-900", text: "text-rose-900" },
            ].map((st) => {
              const pct = totalRequired > 0 ? Math.round((st.count / totalRequired) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{st.label}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {st.count} <span className="text-slate-400 text-[11px]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${st.color}`}
                      style={{ width: `${Math.max(pct, st.count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Risk Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Dynamic Compliance Risk Matrix
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-mono">
              {highRiskCount} High Risk
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">High Risk</span>
              <p className="text-xl font-black text-rose-900">{highRiskCount}</p>
              <span className="text-[10px] text-rose-600 block">Overdue / Escalated</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Medium Risk</span>
              <p className="text-xl font-black text-amber-900">{yearAudits.filter(a => a.riskLevel === "MEDIUM").length}</p>
              <span className="text-[10px] text-amber-700 block">Returned / Close Due</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Low Risk</span>
              <p className="text-xl font-black text-emerald-900">{yearAudits.filter(a => a.riskLevel === "LOW").length}</p>
              <span className="text-[10px] text-emerald-700 block">Approved / Compliant</span>
            </div>
          </div>

          {/* High risk cases alert list */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Priority Compliance Attention Cases
            </span>
            {highRiskCases.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No urgent high-risk cases currently detected.</p>
            ) : (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {highRiskCases.slice(0, 3).map(hr => (
                  <div 
                    key={hr.id}
                    onClick={() => onSelectAudit(hr)}
                    className="p-2 bg-rose-50/70 border border-rose-200 rounded-lg flex items-center justify-between gap-2 hover:bg-rose-100 transition-colors cursor-pointer text-xs"
                  >
                    <div className="min-w-0">
                      <span className="font-extrabold text-rose-950 block truncate">{hr.companyName}</span>
                      <span className="text-[10px] text-rose-700">
                        {hr.status === "ESCALATED" ? "Escalated to Legal" : `Overdue (Due: ${hr.dueDate}) • Returns: ${hr.returnCount}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 shrink-0 flex items-center gap-1">
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Upcoming Audit Deadlines Widget */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Upcoming Annual Audit Deadlines & Urgency Monitor
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab("register")}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Register</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Resident Company</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Statutory Due</th>
                <th className="py-2.5 px-3">Days Remaining</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3">Risk</th>
                <th className="py-2.5 px-3">Responsible Reviewer</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {upcomingDeadlines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 italic">
                    All residents are fully approved or up to date.
                  </td>
                </tr>
              ) : (
                upcomingDeadlines.map((item) => {
                  const days = item.daysRemaining;
                  const isPassed = days < 0;
                  const isUrgent = days >= 0 && days <= 14;
                  const isAttention = days > 14 && days <= 30;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-extrabold text-slate-900">{item.companyName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">INN: {item.stir}</span>
                      </td>

                      <td className="py-2.5 px-3 font-bold text-slate-700">
                        {item.reportingYear}
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {item.dueDate}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                          isPassed ? "bg-rose-100 text-rose-800" :
                          isUrgent ? "bg-amber-100 text-amber-800" :
                          isAttention ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                        }`}>
                          {isPassed ? `${Math.abs(days)}d Overdue` : `${days} days left`}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${STATUS_CONFIG[item.status]?.badgeClass || "bg-slate-100 text-slate-700"}`}>
                          {STATUS_CONFIG[item.status]?.label || item.status}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                          item.riskLevel === "HIGH" ? "bg-rose-100 text-rose-800" :
                          item.riskLevel === "MEDIUM" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        {item.assignedReviewerName || "Dilnoza Alimova"}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenReminderModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Send Notice"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectAudit(item)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            View Audit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
