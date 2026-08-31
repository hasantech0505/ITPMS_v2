/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import ExecutiveKpiStrip from "./components/ExecutiveKpiStrip";
import StrategicScorecard from "./components/StrategicScorecard";
import TargetTrajectoryCard from "./components/TargetTrajectoryCard";
import PerformanceForecast from "./components/PerformanceForecast";
import ExecutiveAttention from "./components/ExecutiveAttention";
import ResidentPortfolioHealth from "./components/ResidentPortfolioHealth";
import InternationalPipeline from "./components/InternationalPipeline";
import RegionalPerformance from "./components/RegionalPerformance";
import UpcomingActions from "./components/UpcomingActions";
import ExecutiveAiBrief from "./components/ExecutiveAiBrief";

import { CalculatedKPI, KpiTargetOverride } from "./types/kpiTypes";
import { 
  calculateKpiMetrics, 
  calculateStrategyHealthScore, 
  PeriodType 
} from "./utils/kpiCalculations";
import {
  buildLiveStrategicKpis,
  buildLiveResidentHealth,
  buildLiveInternationalPipeline,
  buildLiveRegionalPerformance,
  buildLiveUpcomingActions,
  buildLiveExecutiveAlerts,
  buildLiveExecutiveBrief
} from "./utils/liveDashboardData";
import { Resident, Startup, Office, Event, Company, Contact, Meeting, ActivityLog } from "../../types";

interface ExecutiveControlCenterProps {
  selectedYear?: string;
  selectedPeriod?: PeriodType;
  selectedRegion?: string;
  selectedDistrict?: string;
  setActiveTab: (tab: string) => void;
  residents: Resident[];
  startups: Startup[];
  offices: Office[];
  events: Event[];
  companies: Company[];
  contacts: Contact[];
  meetings: Meeting[];
  activityLogs: ActivityLog[];
  kpiTargetOverrides: KpiTargetOverride[];
  onUpdateKpiTarget: (id: string, annualTarget: number, quarterlyTargets: { q1: number; q2: number; q3: number; q4: number }) => void;
  t: (key: string, fallback?: string) => string;
}

export default function ExecutiveControlCenter({
  selectedYear = "2026",
  selectedPeriod = "ytd",
  selectedRegion = "Qashqadaryo",
  selectedDistrict = "ALL",
  setActiveTab,
  residents,
  startups,
  offices,
  events,
  companies,
  contacts,
  meetings,
  activityLogs,
  kpiTargetOverrides,
  onUpdateKpiTarget,
  t
}: ExecutiveControlCenterProps) {
  const [selectedScorecardCategory, setSelectedScorecardCategory] = useState<string>("all");

  // Live strategic KPI actuals, computed from the real ITPMS dataset.
  const liveKpis = useMemo(
    () => buildLiveStrategicKpis(residents, startups, events, kpiTargetOverrides),
    [residents, startups, events, kpiTargetOverrides]
  );

  // Compute calculated metrics for all 2026 KPIs dynamically
  const calculatedKpis: CalculatedKPI[] = useMemo(() => {
    return liveKpis.map((kpi) => calculateKpiMetrics(kpi, selectedPeriod));
  }, [liveKpis, selectedPeriod]);

  // Compute dynamic Strategy Health Score
  const healthScoreResult = useMemo(() => {
    return calculateStrategyHealthScore(calculatedKpis);
  }, [calculatedKpis]);

  const residentHealthData = useMemo(() => buildLiveResidentHealth(residents), [residents]);
  const internationalPipelineData = useMemo(() => buildLiveInternationalPipeline(companies), [companies]);
  const regionalPerformanceData = useMemo(() => buildLiveRegionalPerformance(residents), [residents]);
  const upcomingActionsData = useMemo(() => buildLiveUpcomingActions(events), [events]);
  const executiveAlerts = useMemo(
    () => buildLiveExecutiveAlerts(residents, companies, residentHealthData),
    [residents, companies, residentHealthData]
  );
  const executiveBrief = useMemo(
    () => buildLiveExecutiveBrief(liveKpis, residentHealthData, internationalPipelineData),
    [liveKpis, residentHealthData, internationalPipelineData]
  );

  // Filter regional district data if district selected
  const filteredDistrictData = useMemo(() => {
    if (selectedDistrict === "ALL") return regionalPerformanceData;
    return regionalPerformanceData.filter((d) =>
      d.districtName.toLowerCase().includes(selectedDistrict.toLowerCase())
    );
  }, [regionalPerformanceData, selectedDistrict]);

  return (
    <div id="executive-control-center" className="space-y-6">
      
      {/* 2. EXECUTIVE KPI STRIP (6 HIGH-VALUE STRATEGIC CARDS) */}
      <ExecutiveKpiStrip
        calculatedKpis={calculatedKpis}
        strategyHealthScore={healthScoreResult.overallScorePct}
        strategyHealthStatus={healthScoreResult.status}
        strategyHealthTrendPct={healthScoreResult.trendVsPreviousPct}
        atRiskResidentCount={residentHealthData.atRiskCount}
        totalResidentCount={residentHealthData.totalResidents}
        pipelineValueUSD={internationalPipelineData.pipelineValueUSD}
        pipelineCoveragePct={internationalPipelineData.pipelineCoveragePct}
        pipelineProspects={internationalPipelineData.prospects}
        onNavigateToModule={setActiveTab}
        t={t}
      />

      {/* 3. PERFORMANCE VS TARGET (4 STRATEGIC CORE METRICS IN RESPONSIVE GRID) */}
      <TargetTrajectoryCard
        calculatedKpis={calculatedKpis}
        selectedPeriod={selectedPeriod}
        t={t}
      />

      {/* 4. EXECUTIVE AI BRIEF & IMMEDIATE ATTENTION ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <ExecutiveAiBrief
            brief={executiveBrief}
            onNavigateToAiCopilot={() => setActiveTab("ai")}
            t={t}
          />
        </div>

        <div className="lg:col-span-8">
          <ExecutiveAttention
            alerts={executiveAlerts}
            onNavigateToModule={setActiveTab}
            t={t}
          />
        </div>
      </div>

      {/* 5. PERFORMANCE FORECAST & YEAR-END PROJECTION */}
      <PerformanceForecast
        calculatedKpis={calculatedKpis}
        t={t}
      />

      {/* 6. 2026 STRATEGIC SCORECARD */}
      <StrategicScorecard
        calculatedKpis={calculatedKpis}
        selectedCategory={selectedScorecardCategory}
        setSelectedCategory={setSelectedScorecardCategory}
        onNavigateToModule={setActiveTab}
        onUpdateKpiTarget={onUpdateKpiTarget}
        t={t}
      />

      {/* 7. RESIDENT PORTFOLIO HEALTH & INTERNATIONAL PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ResidentPortfolioHealth
            healthSummary={residentHealthData}
            onNavigateToResidents={() => setActiveTab("residents")}
            t={t}
          />
        </div>

        <div className="lg:col-span-6">
          <InternationalPipeline
            pipelineData={internationalPipelineData}
            onNavigateToCrm={() => setActiveTab("crm")}
            t={t}
          />
        </div>
      </div>

      {/* 8. GEOGRAPHIC DISTRIBUTION (DISTRICT PERFORMANCE) */}
      <RegionalPerformance
        districtData={filteredDistrictData}
        onNavigateToDistrict={() => setActiveTab("analytics")}
        t={t}
      />

      {/* 9. NEXT 30 DAYS EXECUTIVE SCHEDULE */}
      <UpcomingActions
        actionItems={upcomingActionsData}
        onNavigateToModule={setActiveTab}
        t={t}
      />

    </div>
  );
}
