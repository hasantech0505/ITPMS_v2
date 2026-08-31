/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  RotateCcw, 
  AlertTriangle, 
  Building2, 
  Users, 
  ShieldCheck, 
  Layers
} from "lucide-react";
import { ResidentAudit, calculateDaysRemaining } from "./auditTypes";

interface AuditAnalyticsSectionProps {
  audits: ResidentAudit[];
  selectedYear: number;
}

interface ReviewerMetric {
  total: number;
  approved: number;
  returned: number;
  pending: number;
}

export default function AuditAnalyticsSection({
  audits,
  selectedYear
}: AuditAnalyticsSectionProps) {
  const yearAudits = audits.filter(a => a.reportingYear === selectedYear);

  // Dynamic rates
  const totalRequired = yearAudits.length || 1;
  const submittedCount = yearAudits.filter(a => a.status !== "PENDING_SUBMISSION").length;
  const approvedCount = yearAudits.filter(a => a.status === "APPROVED").length;
  const returnedCount = yearAudits.filter(a => a.status === "RETURNED_FOR_CORRECTION" || a.returnCount > 0).length;
  const overdueCount = yearAudits.filter(a => a.status !== "APPROVED" && (calculateDaysRemaining(a.dueDate) < 0 || a.status === "OVERDUE")).length;

  const submissionRate = Math.round((submittedCount / totalRequired) * 100);
  const approvalRate = submittedCount > 0 ? Math.round((approvedCount / submittedCount) * 100) : 0;
  const returnRate = submittedCount > 0 ? Math.round((returnedCount / submittedCount) * 100) : 0;
  const overdueRate = Math.round((overdueCount / totalRequired) * 100);

  // Breakdown by Reviewer
  const reviewerStats = useMemo<Record<string, ReviewerMetric>>(() => {
    const map: Record<string, ReviewerMetric> = {};
    yearAudits.forEach(a => {
      const rev = a.assignedReviewerName || "Unassigned";
      if (!map[rev]) {
        map[rev] = { total: 0, approved: 0, returned: 0, pending: 0 };
      }
      map[rev].total += 1;
      if (a.status === "APPROVED") map[rev].approved += 1;
      if (a.status === "RETURNED_FOR_CORRECTION") map[rev].returned += 1;
      if (a.status === "UNDER_REVIEW" || a.status === "RESUBMITTED") map[rev].pending += 1;
    });
    return map;
  }, [yearAudits]);

  // Breakdown by Audit Firm
  const firmStats = useMemo(() => {
    const map: Record<string, number> = {};
    yearAudits.forEach(a => {
      if (a.auditFirm) {
        map[a.auditFirm] = (map[a.auditFirm] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [yearAudits]);

  // Multi-Year Historical Compliance Comparison
  const yearlyTrends = useMemo(() => {
    const years = [2024, 2025, 2026];
    return years.map(yr => {
      const list = audits.filter(a => a.reportingYear === yr);
      const req = list.length || 1;
      const app = list.filter(a => a.status === "APPROVED").length;
      const sub = list.filter(a => a.status !== "PENDING_SUBMISSION").length;
      const rate = Math.round((app / req) * 100);
      return { year: yr, required: req, submitted: sub, approved: app, rate };
    });
  }, [audits]);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 4 Primary Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-sky-600 font-bold uppercase tracking-wider">
            <span>Audit Submission Rate</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{submissionRate}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${submissionRate}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">{submittedCount} of {totalRequired} required submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-600 font-bold uppercase tracking-wider">
            <span>Approval Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{approvalRate}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${approvalRate}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">{approvedCount} approved of {submittedCount} submissions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold uppercase tracking-wider">
            <span>Return for Correction Rate</span>
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{returnRate}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${returnRate}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">{returnedCount} returned cases</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold uppercase tracking-wider">
            <span>Overdue Delinquency Rate</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{overdueRate}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${overdueRate}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 block">{overdueCount} overdue delinquent residents</span>
        </div>

      </div>

      {/* Operational Efficiency Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Review Turnaround</span>
            <p className="text-xl font-black text-slate-900">4.2 Calendar Days</p>
            <span className="text-[11px] text-slate-500">From submission upload to initial reviewer decision</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Resident Correction Time</span>
            <p className="text-xl font-black text-slate-900">6.8 Calendar Days</p>
            <span className="text-[11px] text-slate-500">From return issuance to revised package resubmission</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Reviewer Performance & Audit Firm Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Reviewer Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Compliance Officer Workload & Output
            </h3>
            <span className="text-xs font-bold text-slate-400 font-mono">{selectedYear} Cycle</span>
          </div>

          <div className="space-y-3">
            {(Object.entries(reviewerStats) as [string, ReviewerMetric][]).map(([name, stats]) => (
              <div key={name} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{name}</span>
                  <span className="font-mono font-bold text-slate-700">{stats.total} assigned</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-white p-1.5 rounded-md border border-slate-200">
                    <span className="font-bold text-emerald-700 block">{stats.approved}</span>
                    <span className="text-slate-400 text-[10px]">Approved</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-md border border-slate-200">
                    <span className="font-bold text-amber-700 block">{stats.returned}</span>
                    <span className="text-slate-400 text-[10px]">Returned</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-md border border-slate-200">
                    <span className="font-bold text-blue-700 block">{stats.pending}</span>
                    <span className="text-slate-400 text-[10px]">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Independent Audit Firms Engaged */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              Accredited Audit Firms Engagement Share
            </h3>
            <span className="text-xs font-bold text-slate-400 font-mono">{firmStats.length} Firms</span>
          </div>

          <div className="space-y-2 text-xs">
            {firmStats.map(([firm, count]) => {
              const pct = Math.round((count / (submittedCount || 1)) * 100);
              return (
                <div key={firm} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[280px]" title={firm}>{firm}</span>
                    <span className="font-mono font-bold text-slate-900">{count} reports <span className="text-slate-400 text-[10px]">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Year-over-Year Compliance Trend Comparison */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Year-over-Year Statutory Compliance Cycle Comparison
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Historical audit compliance performance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {yearlyTrends.map((trend) => (
            <div key={trend.year} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 font-mono">{trend.year} Audit Cycle</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  trend.rate >= 90 ? "bg-emerald-100 text-emerald-800" :
                  trend.rate >= 50 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                }`}>
                  {trend.rate}% Compliance
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Required Reports:</span>
                  <b className="text-slate-800 font-mono">{trend.required}</b>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Submitted Reports:</span>
                  <b className="text-sky-700 font-mono">{trend.submitted}</b>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Approved Compliant:</span>
                  <b className="text-emerald-700 font-mono">{trend.approved}</b>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
