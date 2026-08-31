/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  BarChart3, 
  Rocket, 
  Building2, 
  Users2, 
  CalendarDays, 
  Briefcase, 
  BrainCircuit, 
  FileSpreadsheet, 
  Building, 
  Warehouse,
  UserCheck, 
  MessageSquare,
  Milestone,
  ChevronDown, 
  ChevronRight, 
  LogOut,
  X
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import ITParkLogo from "./ITParkLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  } | null;
  onLogout?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  currentUser, 
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const { t } = useLanguage();
  const [residentsExpanded, setResidentsExpanded] = useState(activeTab.startsWith("residents"));

  useEffect(() => {
    if (activeTab.startsWith("residents")) {
      setResidentsExpanded(true);
    }
  }, [activeTab]);

  const name = currentUser?.name || "Hasan Abdukarimov";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "HA";

  const menuItems = [
    { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Executive BI & Analytics", icon: BarChart3 },
    { id: "startups", label: "Startups Hub", icon: Rocket },
    { id: "residents", label: "Residents", icon: Building2 },
    { id: "infrastructure", label: "🏢 Property Marketplace", icon: Building },
    { id: "buildings", label: "Buildings Infrastructure", icon: Warehouse },
    { id: "talent", label: "Talent Pool", icon: Users2 },
    { id: "events", label: "Events & Hackathons", icon: CalendarDays },
    { id: "comments", label: "Project Comments & Hub", icon: MessageSquare },
    { id: "crm", label: "Global Outreach (CRM)", icon: Briefcase },
    { id: "ai", label: "ITPMS AI Workspace", icon: BrainCircuit },
    { id: "reports", label: "Activity Logs & Reports", icon: FileSpreadsheet },
    { id: "planning", label: "Strategic Planning & Roadmap", icon: Milestone },
    { id: "users", label: "RBAC Users", icon: UserCheck },
  ];

  const residentsSubItems = [
    { id: "residents-dashboard", label: "Dashboard Overview" },
    { id: "residents-all", label: "Total Residents" },
    { id: "residents-2026", label: "Yearly Applications" },
    { id: "residents-declined", label: "Declined & Revoked" },
    { id: "residents-upcoming", label: "Upcoming Candidates" },
    { id: "residents-reports", label: "Quarterly Reports" },
    { id: "residents-potential", label: "Potential Candidates" },
    { id: "residents-monitoring", label: "Compliance & Audit" },
    { id: "residents-analytics", label: "Deep Analytics" }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--sidebar-background,#0f172a)] text-slate-300 w-64 border-r border-[var(--border-strong,rgba(255,255,255,0.1))] relative overflow-hidden">
      {/* Ambient accent glow, echoing the Executive Dashboard canvas */}
      <div
        className="pointer-events-none absolute -top-24 -left-16 w-56 h-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--sidebar-accent, #00E5FF)" }}
        aria-hidden="true"
      />
      {/* Branding Header */}
      <div className="relative p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <ITParkLogo variant="full" size="sm" isDark={true} subtext="KASHKADARYA" />
          <div className="flex items-center gap-1.5 mt-2 pl-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#74BD22] animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {t("Kashkadarya Regional Branch")}
            </span>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Information */}
      <div className="relative p-3.5 mx-3 my-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-[var(--sidebar-accent,#00E5FF)] font-bold border border-white/10 text-xs">
            {initials}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-semibold text-white truncate">{name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--sidebar-accent, #00E5FF)" }}></span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider truncate">{userRole}</span>
            </div>
          </div>
        </div>
        {onLogout && (
          <button
            id="sidebar-logout-trigger"
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shrink-0"
            title={t("Log Out")}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;

          if (item.id === "residents") {
            const isResidentActive = activeTab.startsWith("residents");
            return (
              <div key={item.id} className="space-y-1">
                <button
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setResidentsExpanded(!residentsExpanded);
                    if (!isResidentActive) {
                      handleNavClick("residents-dashboard");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isResidentActive 
                      ? "bg-white/10 text-white font-semibold border border-white/10" 
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isResidentActive ? "text-[var(--sidebar-accent,#00E5FF)]" : "text-slate-400"}`} />
                    <span>{t(item.label)}</span>
                  </div>
                  {residentsExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
                
                {residentsExpanded && (
                  <div className="pl-4 space-y-1 border-l border-white/10 ml-4.5 mt-1 transition-all">
                    {residentsSubItems.map((sub) => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          id={`nav-item-${sub.id}`}
                          key={sub.id}
                          onClick={() => handleNavClick(sub.id)}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all text-left cursor-pointer ${
                            isSubActive 
                              ? "text-[#001217] font-semibold shadow-xs" 
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                          style={isSubActive ? { background: "var(--sidebar-accent, #00E5FF)" } : undefined}
                        >
                          <span className={`w-1 h-1 rounded-full ${isSubActive ? "bg-white" : "bg-slate-500"}`}></span>
                          <span>{t(sub.label)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive 
                  ? "text-[#001217] font-semibold shadow-lg" 
                  : "hover:bg-white/5 hover:text-white"
              }`}
              style={isActive ? { background: "var(--sidebar-accent, #00E5FF)", boxShadow: "0 8px 20px -8px var(--sidebar-accent, #00E5FF)" } : undefined}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? "text-[#001217]" : "text-slate-400"}`} />
              {t(item.label)}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="relative p-4 border-t border-white/10 text-[10px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span>{t("Enterprise Layer")}</span>
          <span className="text-[var(--sidebar-accent,#00E5FF)] font-mono">v1.4.0</span>
        </div>
        <div className="flex items-center justify-between">
          <span>{t("Server Engine")}</span>
          <span className="text-[var(--sidebar-accent,#00E5FF)]">{t("ONLINE")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside id="sidebar-container" className="hidden lg:flex flex-col h-screen sticky top-0 z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in-50"
            aria-hidden="true"
          />
          {/* Slide-out Drawer */}
          <div className="relative z-50 flex-1 max-w-[17rem] w-full animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
