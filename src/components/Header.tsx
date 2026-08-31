/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Bell, Shield, Calendar, RefreshCw, Menu, X } from "lucide-react";
import { UserRole } from "../types";
import { useLanguage } from "../lib/LanguageContext";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  userRole: UserRole;
  syncState: () => void;
  isSyncing: boolean;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  onToggleMobileSidebar?: () => void;
}

export default function Header({
  userRole,
  syncState,
  isSyncing,
  globalSearch,
  setGlobalSearch,
  onToggleMobileSidebar
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const notifications = [
    { id: 1, title: "Pending Resident Approval", text: "Turan Systems Development INN:314556223 submitted paperwork.", type: "warning" },
    { id: 2, title: "New AI Forecast Complete", text: "CAGR prediction for export volumes was computed successfully.", type: "success" },
    { id: 3, title: "Upcoming Meeting", text: "Plug and Play Tech Center MoU discussion scheduled for 18:00.", type: "info" }
  ];

  return (
    <header id="top-header" className="bg-white dark:bg-[var(--header-background)] border-b border-slate-200 dark:border-white/10 min-h-[4rem] h-16 px-4 sm:px-6 sticky top-0 flex items-center justify-between z-40 shadow-xs gap-2 transition-colors dark:backdrop-blur-xl">
      {/* Mobile Drawer Trigger & Search Input */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder={t("Global search across startups, residents, talent, contacts...")}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:outline-hidden focus:border-emerald-500 dark:focus:border-[var(--sidebar-accent,#00E5FF)] focus:ring-1 focus:ring-emerald-500 dark:focus:ring-[var(--sidebar-accent,#00E5FF)]/40 transition-all bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 truncate"
          />
        </div>
      </div>

      {/* Control Triggers & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Theme Switcher (Light / Dark / System) */}
        <ThemeSwitcher />

        {/* Language Switcher */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg p-0.5">
          {[
            { code: "en" as const, label: "EN", flag: "🇬🇧" },
            { code: "uz" as const, label: "UZ", flag: "🇺🇿" },
            { code: "ru" as const, label: "RU", flag: "🇷🇺" }
          ].map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                title={item.code === "en" ? "English" : item.code === "uz" ? "O'zbekcha" : "Русский"}
              >
                <span>{item.flag}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sync Trigger */}
        <button
          id="sync-db-btn"
          onClick={syncState}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title={t("Sync DB")}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isSyncing ? "animate-spin text-emerald-500 dark:text-[var(--sidebar-accent,#00E5FF)]" : ""}`} />
          <span className="hidden md:inline">{t("Sync DB")}</span>
        </button>

        {/* Signed-in role badge — reflects the server-verified role from your
            session; it is not editable here (that used to be a client-side
            selector, which never affected real permissions but was
            confusing to have around). */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg max-w-[170px] md:max-w-none">
          <Shield className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mr-1 font-mono hidden md:inline">{t("ROLE:")}</span>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[110px] md:max-w-none">
            {userRole}
          </span>
        </div>

        {/* Calendar Info (Desktop only) */}
        <div className="hidden xl:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-mono">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span>2026-08-22</span>
        </div>

        {/* Notifications Tray Trigger */}
        <div className="relative">
          <button
            id="bell-notification-trigger"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 border border-slate-200 dark:border-slate-700/80 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 relative transition-all cursor-pointer shrink-0"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1 border-2 border-white dark:border-slate-900"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div id="notification-dropdown" className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-1">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{t("Notifications Tray")}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-mono">{t("3 Active")}</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <div className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        n.type === "warning" ? "bg-amber-500" :
                        n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                      }`} />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">{n.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

