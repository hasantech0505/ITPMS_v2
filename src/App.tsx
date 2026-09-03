/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginModule from "./features/auth/LoginModule";

// Code-split every other module: App.tsx previously imported all of these
// eagerly, so a single page load fetched/transformed ~100+ files (including
// heavy libs like maplibre-gl and recharts) up front regardless of which
// tab was active. React.lazy() defers each one until its tab is first
// opened, which is what actually made "opening pages" and "moving between
// modules" feel slow.
const Dashboard = React.lazy(() => import("./features/dashboard/Dashboard"));
const StartupModule = React.lazy(() => import("./features/startups/StartupModule"));
const ResidentModule = React.lazy(() => import("./features/residents/ResidentModule"));
const InfrastructureModule = React.lazy(() => import("./features/infrastructure/InfrastructureModule"));
const TalentModule = React.lazy(() => import("./features/talent/TalentModule"));
const BuildingsModule = React.lazy(() => import("./features/buildings/BuildingsModule"));
const EventModule = React.lazy(() => import("./features/events/EventModule"));
const CRMModule = React.lazy(() => import("./features/crm/CRMModule"));
const AnalyticsModule = React.lazy(() => import("./features/analytics/AnalyticsModule"));
const CopilotModule = React.lazy(() => import("./features/ai/CopilotModule"));
const CommentsModule = React.lazy(() => import("./features/comments/CommentsModule"));
const UserManagementModule = React.lazy(() => import("./features/auth/UserManagementModule"));
const PlanningModule = React.lazy(() => import("./features/planning/PlanningModule"));
const EdoReportModule = React.lazy(() => import("./features/edoReport/EdoReportModule"));
import ITParkBrandBackground, { BrandBackgroundVariant } from "./components/ITParkBrandBackground";
import { Property } from "./features/infrastructure/propertyTypes";

// UI/UX Icons
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  FileSpreadsheet, 
  ShieldAlert, 
  Printer, 
  HelpCircle,
  FileCheck,
  UserCheck2,
  Users,
  X
} from "lucide-react";
import { 
  Startup, 
  Resident, 
  Office, 
  Talent, 
  Event, 
  Company, 
  Contact, 
  Meeting, 
  Task, 
  ActivityLog, 
  UserRole,
  BuildingRecord,
  ProjectComment,
  PlanningItem,
  OutreachCampaign,
  EdoReport
} from "./types";

function ModuleLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-emerald-500 dark:border-t-[var(--sidebar-accent,#00E5FF)] rounded-full animate-spin" />
      <span className="text-xs font-bold uppercase tracking-wider">Loading module…</span>
    </div>
  );
}

export default function App() {
  // Authentication & Session Persistence
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    avatarUrl?: string;
  } | null>(() => {
    const saved = localStorage.getItem("itpms_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const rawHash = window.location.hash.replace("#", "");
    const tabName = rawHash.split("?")[0];
    if (tabName && ["dashboard", "analytics", "startups", "residents", "infrastructure", "buildings", "talent", "events", "comments", "crm", "ai", "reports", "edoReport", "planning", "users", "settings"].some(t => tabName.startsWith(t))) {
      return tabName;
    }
    return "dashboard";
  });

  // Keep URL hash synchronized for seamless browser back/forward and routing
  useEffect(() => {
    const handleSyncHash = () => {
      const rawHash = window.location.hash.replace("#", "");
      const tabName = rawHash.split("?")[0];
      if (tabName && tabName !== activeTab && ["dashboard", "analytics", "startups", "residents", "infrastructure", "buildings", "talent", "events", "comments", "crm", "ai", "reports", "edoReport", "planning", "users", "settings"].some(t => tabName.startsWith(t))) {
        setActiveTab(tabName);
      }
    };

    window.addEventListener("hashchange", handleSyncHash);
    window.addEventListener("popstate", handleSyncHash);
    return () => {
      window.removeEventListener("hashchange", handleSyncHash);
      window.removeEventListener("popstate", handleSyncHash);
    };
  }, [activeTab]);

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    if (!window.location.hash.startsWith(`#${tab}`)) {
      window.history.pushState(null, "", `#${tab}`);
    }
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("itpms_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role as UserRole;
      } catch (e) {
        return UserRole.MANAGER;
      }
    }
    return UserRole.MANAGER;
  });

  const handleLoginSuccess = (user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    avatarUrl?: string;
  }) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem("itpms_user", JSON.stringify(user));
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("itpms_refresh_token");
    if (refreshToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        // Silently ignore network logout errors
      }
    }
    setCurrentUser(null);
    localStorage.removeItem("itpms_user");
    localStorage.removeItem("itpms_access_token");
    localStorage.removeItem("itpms_refresh_token");
  };

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // DB States
  const [startups, setStartups] = useState<Startup[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [talent, setTalent] = useState<Talent[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [kpiTargets, setKpiTargets] = useState<any[]>([]);
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>([]);
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([]);
  const [edoReports, setEdoReports] = useState<EdoReport[]>([]);

  // AI Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to the ITPMS AI Workspace. Ask me anything about the legal residents list, IT export numbers, tech block room leases, or upcoming hackathons!" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Exchanges the stored refresh token for a new access token, persisting
  // both to localStorage. Returns the new access token, or null if the
  // refresh itself failed (refresh token missing, expired, or revoked -
  // session cannot be recovered without a fresh login).
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("itpms_refresh_token");
    if (!refreshToken) return null;
    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      if (!refreshRes.ok) return null;
      const refreshData = await refreshRes.json();
      const payload = refreshData.data || refreshData;
      const newAccessToken = payload.accessToken;
      const newRefreshToken = payload.refreshToken;
      if (!newAccessToken) return null;
      localStorage.setItem("itpms_access_token", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("itpms_refresh_token", newRefreshToken);
      }
      return newAccessToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  };

  // Clears the local session when it can no longer be recovered (refresh
  // failed). Shared by session validation on load and by authFetch below.
  const forceLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("itpms_user");
    localStorage.removeItem("itpms_access_token");
    localStorage.removeItem("itpms_refresh_token");
  };

  // Validate authentication session on app load
  useEffect(() => {
    const validateSession = async () => {
      const accessToken = localStorage.getItem("itpms_access_token");
      if (!accessToken) {
        if (currentUser) {
          setCurrentUser(null);
          localStorage.removeItem("itpms_user");
        }
        return;
      }

      try {
        let res = await fetch("/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (res.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            res = await fetch("/api/auth/me", {
              headers: { "Authorization": `Bearer ${newAccessToken}` }
            });
          }
        }

        if (res.ok) {
          const result = await res.json();
          const user = result.data?.user || result.user;
          if (user) {
            setCurrentUser(user);
            setUserRole(user.role as UserRole);
            localStorage.setItem("itpms_user", JSON.stringify(user));
          }
        } else {
          // Token invalid and could not be refreshed
          forceLogout();
        }
      } catch (err) {
        console.error("Auth validation error:", err);
      }
    };

    validateSession();
  }, []);

  // Fetch full DB on mount
  const syncState = async () => {
    const token = localStorage.getItem("itpms_access_token");
    if (!token) {
      // No session yet (still validating, or logged out) - /api/db always requires
      // auth, so skip the guaranteed-401 request instead of spamming the console.
      return;
    }
    setIsSyncing(true);
    try {
      const headers: Record<string, string> = { "Authorization": `Bearer ${token}` };
      const response = await authFetch("/api/db", { headers });
      if (response.ok) {
        const data = await response.json();
        setStartups(data.startups || []);
        setResidents(data.residents || []);
        setOffices(data.offices || []);
        setProperties(data.properties || []);
        setTalent(data.talent || []);
        setBuildings(data.buildings || []);
        setEvents(data.events || []);
        setCompanies(data.companies || []);
        setContacts(data.contacts || []);
        setMeetings(data.meetings || []);
        setTasks(data.tasks || []);
        setActivityLogs(data.activityLogs || []);
        setComments(data.comments || []);
        setKpiTargets(data.kpiTargets || []);
        setPlanningItems(data.planningItems || []);
        setCampaigns(data.campaigns || []);
        setEdoReports(data.edoReports || []);
      }
    } catch (e) {
      console.error("Failed to sync database state:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncState();
  }, [currentUser]);

  // Helper header generator with current simulated context and JWT token
  const getContextHeaders = () => {
    const token = localStorage.getItem("itpms_access_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-user-context": JSON.stringify({
        id: currentUser?.id || "u-1",
        name: currentUser?.name || "Hasan Abdukarimov",
        role: userRole
      })
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // fetch() wrapper used by every CRUD dispatcher (and by syncState) below.
  // Without this, any session left open longer than the access token's
  // lifetime (15 min by default - see server/utils/jwt.ts) started failing
  // every Add/Edit/Delete/Save with a raw "Token verification failed or
  // token has expired" alert, even though a perfectly good refresh token
  // was sitting in localStorage the whole time and the app already knew how
  // to use one (see validateSession's on-load check above) - it just never
  // did so for anything after the initial page load. On a 401, this
  // silently refreshes the access token and retries the request once
  // before giving up; if the refresh itself fails (refresh token expired
  // or revoked), it logs the session out locally so the user sees a clean
  // "please log in again" state instead of a wall of failed requests.
  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const withToken = (token: string | null): RequestInit => {
      const headers: Record<string, string> = { ...(options.headers as Record<string, string> | undefined) };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return { ...options, headers };
    };

    let res = await fetch(url, withToken(localStorage.getItem("itpms_access_token")));

    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        res = await fetch(url, withToken(newToken));
      } else {
        forceLogout();
      }
    }

    return res;
  };

  // --- CRUD DISPATCH ACTIONS ---

  // Every controller error (validation failures, duplicate-key rejections,
  // unhandled exceptions caught by server/middleware/errorHandler.ts) comes
  // back as { success: false, message, errors? } (see server/utils/
  // response.ts's sendError()). The three dispatchers below used to either
  // show a hardcoded generic alert ("Action rejected by the server.", with
  // no indication of WHY - e.g. a duplicate INN) or, for edit/delete, show
  // NOTHING at all on failure, silently leaving the UI as if nothing
  // happened. Centralized here so every module's add/edit/delete surfaces
  // the server's actual reason.
  const extractErrorMessage = async (res: Response, fallback: string): Promise<string> => {
    try {
      const body = await res.json();
      if (body && typeof body.message === "string" && body.message.trim()) {
        return body.message;
      }
    } catch {
      // response body wasn't JSON (or was empty) - fall through to the generic message
    }
    return fallback;
  };

  // Add Item Generic
  // NOTE (2026-09-01, night): now returns a boolean (true = succeeded) so
  // callers - e.g. ResidentModule's "Register Certified IT Park Resident"
  // modal - can tell whether their submission actually went through. It
  // used to return nothing at all, so `await onAdd(payload)` always
  // resolved normally even on a server rejection (a duplicate INN, a
  // missing required field), and every caller unconditionally closed its
  // modal and reset its form right after - the user would see the "action
  // rejected" alert, click OK, and find their whole form gone, forcing them
  // to retype everything just to fix the one field that was wrong.
  const handleAddItem = async (entity: string, payload: any, updateState: (prev: any) => void): Promise<boolean> => {
    try {
      const res = await authFetch(`/api/${entity}`, {
        method: "POST",
        headers: getContextHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newItem = await res.json();
        updateState((prev: any[]) => {
          const exists = prev.some((item: any) => item.id === newItem.id);
          return exists ? prev.map((item: any) => item.id === newItem.id ? newItem : item) : [...prev, newItem];
        });
        // Re-sync after a tick to keep logs aligned
        setTimeout(syncState, 200);
        return true;
      } else {
        alert(await extractErrorMessage(res, "Action rejected by the server."));
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update Item Generic - same return-value fix as handleAddItem above.
  const handleUpdateItem = async (entity: string, id: string, payload: any, updateState: (prev: any) => void): Promise<boolean> => {
    try {
      const res = await authFetch(`/api/${entity}/${id}`, {
        method: "PUT",
        headers: getContextHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedItem = await res.json();
        updateState((prev: any[]) => {
          const exists = prev.some((item: any) => item.id === id || item.id === updatedItem.id);
          if (exists) {
            return prev.map((item: any) => (item.id === id || item.id === updatedItem.id) ? updatedItem : item);
          } else {
            return [...prev, updatedItem];
          }
        });
        setTimeout(syncState, 200);
        return true;
      } else {
        alert(await extractErrorMessage(res, "Update rejected by the server."));
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Delete Item Generic - same return-value fix as handleAddItem above.
  const handleDeleteItem = async (entity: string, id: string, updateState: (prev: any) => void): Promise<boolean> => {
    try {
      const res = await authFetch(`/api/${entity}/${id}`, {
        method: "DELETE",
        headers: getContextHeaders()
      });
      if (res.ok) {
        updateState((prev: any[]) => prev.filter(item => item.id !== id));
        setTimeout(syncState, 200);
        return true;
      } else {
        alert(await extractErrorMessage(res, "Delete rejected by the server."));
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Per-KPI target edit: upserts into the "kpiTargets" override collection
  // (PUT if an override already exists for this KPI id, POST to create one
  // otherwise) so an admin can adjust a 2026 goal without touching source code.
  const handleUpdateKpiTarget = (
    id: string,
    annualTarget: number,
    quarterlyTargets: { q1: number; q2: number; q3: number; q4: number }
  ) => {
    const existing = kpiTargets.some((k: any) => k.id === id);
    const payload = {
      id,
      annualTarget,
      quarterlyTargets,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.name || "Hasan Abdukarimov"
    };
    if (existing) {
      handleUpdateItem("kpiTargets", id, payload, setKpiTargets);
    } else {
      handleAddItem("kpiTargets", payload, setKpiTargets);
    }
  };

  // --- GLOBAL FLOATING COPILOT & COMMAND PALETTE ---
  const [showGlobalChat, setShowGlobalChat] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [globalChatMessages, setGlobalChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Salam, Hasan! I am your global floating ITPMS Google Studio assistant. Ask me any analytical question, draft emails, or trigger task automations from any screen!" }
  ]);
  const [globalChatInput, setGlobalChatInput] = useState("");
  const [isGlobalChatLoading, setIsGlobalChatLoading] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");

  const handleSendGlobalChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalChatInput.trim() || isGlobalChatLoading) return;

    const userText = globalChatInput.trim();
    setGlobalChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setGlobalChatInput("");
    setIsGlobalChatLoading(true);

    try {
      const res = await fetch("/api/ai/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "chat-global",
          text: userText,
          userId: "u-1"
        })
      });
      const data = await res.json();
      setGlobalChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
      if (userText.toLowerCase().includes("create task") || userText.toLowerCase().includes("meeting")) {
        syncState();
      }
    } catch (err) {
      setGlobalChatMessages(prev => [...prev, { sender: "ai", text: "Failed to connect to the Google Studio platform." }]);
    } finally {
      setIsGlobalChatLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered command palette matches
  const cmdMatches = {
    startups: startups.filter(s => (s?.name || "").toLowerCase().includes(cmdSearch.toLowerCase()) || (s?.founder || "").toLowerCase().includes(cmdSearch.toLowerCase())),
    residents: residents.filter(r => (r?.companyName || "").toLowerCase().includes(cmdSearch.toLowerCase()) || (r?.director || "").toLowerCase().includes(cmdSearch.toLowerCase())),
    talent: talent.filter(t => (t?.fullName || "").toLowerCase().includes(cmdSearch.toLowerCase()) || (t?.skills || []).some(sk => (sk || "").toLowerCase().includes(cmdSearch.toLowerCase())))
  };

  if (!currentUser) {
    return <LoginModule onLoginSuccess={handleLoginSuccess} />;
  }

  // Derive background pattern variant from active tab
  let bgVariant: BrandBackgroundVariant = "default";
  if (activeTab === "dashboard") bgVariant = "executive";
  else if (activeTab === "analytics") bgVariant = "analytics";
  else if (activeTab === "startups") bgVariant = "startups";
  else if (activeTab.startsWith("residents")) {
    bgVariant = activeTab === "residents-compliance" ? "compliance" : "residents";
  } else if (activeTab === "infrastructure") bgVariant = "regional";

  return (
    <div className="flex bg-slate-100 dark:bg-[#0B1220] min-h-screen text-slate-800 dark:text-slate-100 antialiased font-sans relative transition-colors">
      {/* Global Layered IT Park Uzbekistan Brand Background */}
      <ITParkBrandBackground variant={bgVariant} />

      {/* Sidebar navigation control */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }} 
        userRole={userRole} 
        currentUser={currentUser}
        onLogout={handleLogout}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          userRole={userRole}
          syncState={syncState}
          isSyncing={isSyncing} 
          globalSearch={globalSearch} 
          setGlobalSearch={setGlobalSearch} 
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Outer content container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          <Suspense fallback={<ModuleLoadingFallback />}>
          {activeTab === "dashboard" && (
            <Dashboard 
              startups={startups} 
              residents={residents} 
              offices={offices} 
              talent={talent} 
              events={events} 
              companies={companies}
              contacts={contacts}
              meetings={meetings}
              activityLogs={activityLogs} 
              kpiTargetOverrides={kpiTargets}
              onUpdateKpiTarget={handleUpdateKpiTarget}
              setActiveTab={handleNavigateTab} 
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsModule
              residents={residents}
              startups={startups}
              talent={talent}
              offices={offices}
              events={events}
              companies={companies}
              contacts={contacts}
              meetings={meetings}
              tasks={tasks}
              activityLogs={activityLogs}
              userRole={userRole}
              setActiveTab={handleNavigateTab}
            />
          )}

          {activeTab === "startups" && (
            <StartupModule 
              startups={startups} 
              onAdd={(payload) => handleAddItem("startups", payload, setStartups)}
              onUpdate={(id, payload) => handleUpdateItem("startups", id, payload, setStartups)}
              onDelete={(id) => handleDeleteItem("startups", id, setStartups)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab.startsWith("residents") && (
            <ResidentModule 
              activeSubTab={activeTab}
              setActiveSubTab={setActiveTab}
              residents={residents}
              onAdd={(payload) => handleAddItem("residents", payload, setResidents)}
              onUpdate={(id, payload) => handleUpdateItem("residents", id, payload, setResidents)}
              onDelete={(id) => handleDeleteItem("residents", id, setResidents)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab === "infrastructure" && (
            <InfrastructureModule 
              offices={offices} 
              startups={startups} 
              residents={residents} 
              properties={properties}
              onUpdateOffice={(id, payload) => handleUpdateItem("offices", id, payload, setOffices)}
              onAddProperty={(payload) => handleAddItem("properties", payload, setProperties)}
              onUpdateProperty={(id, payload) => handleUpdateItem("properties", id, payload, setProperties)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab === "talent" && (
            <TalentModule 
              talent={talent} 
              onAdd={(payload) => handleAddItem("talent", payload, setTalent)}
              onUpdate={(id, payload) => handleUpdateItem("talent", id, payload, setTalent)}
              onDelete={(id) => handleDeleteItem("talent", id, setTalent)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab === "buildings" && (
            <BuildingsModule
              buildings={buildings}
              onAdd={(payload) => handleAddItem("buildings", payload, setBuildings)}
              onUpdate={(id, payload) => handleUpdateItem("buildings", id, payload, setBuildings)}
              onDelete={(id) => handleDeleteItem("buildings", id, setBuildings)}
              userRole={userRole}
            />
          )}

          {activeTab === "events" && (
            <EventModule 
              events={events} 
              onAdd={(payload) => handleAddItem("events", payload, setEvents)}
              onUpdate={(id, payload) => handleUpdateItem("events", id, payload, setEvents)}
              onDelete={(id) => handleDeleteItem("events", id, setEvents)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab === "comments" && (
            <CommentsModule
              comments={comments}
              startups={startups}
              residents={residents}
              offices={offices}
              onAddComment={(p) => handleAddItem("comments", p, setComments)}
              onUpdateComment={(id, p) => handleUpdateItem("comments", id, p, setComments)}
              onDeleteComment={(id) => handleDeleteItem("comments", id, setComments)}
              currentUser={currentUser}
              userRole={userRole}
              onSyncState={syncState}
            />
          )}

          {activeTab === "crm" && (
            <CRMModule 
              companies={companies} 
              contacts={contacts} 
              meetings={meetings} 
              tasks={tasks} 
              onAddCompany={(p) => handleAddItem("companies", p, setCompanies)}
              onUpdateCompany={(id, p) => handleUpdateItem("companies", id, p, setCompanies)}
              onDeleteCompany={(id) => handleDeleteItem("companies", id, setCompanies)}
              onAddContact={(p) => handleAddItem("contacts", p, setContacts)}
              onUpdateContact={(id, p) => handleUpdateItem("contacts", id, p, setContacts)}
              onDeleteContact={(id) => handleDeleteItem("contacts", id, setContacts)}
              onAddMeeting={(p) => handleAddItem("meetings", p, setMeetings)}
              onUpdateMeeting={(id, p) => handleUpdateItem("meetings", id, p, setMeetings)}
              onAddTask={(p) => handleAddItem("tasks", p, setTasks)}
              onUpdateTask={(id, p) => handleUpdateItem("tasks", id, p, setTasks)}
              onDeleteTask={(id) => handleDeleteItem("tasks", id, setTasks)}
              campaigns={campaigns}
              onAddCampaign={(p) => handleAddItem("campaigns", p, setCampaigns)}
              onUpdateCampaign={(id, p) => handleUpdateItem("campaigns", id, p, setCampaigns)}
              onDeleteCampaign={(id) => handleDeleteItem("campaigns", id, setCampaigns)}
              userRole={userRole} 
              onSyncState={syncState}
            />
          )}

          {activeTab === "ai" && (
            <CopilotModule 
              userRole={userRole}
              onSyncState={syncState}
            />
          )}

          {activeTab === "reports" && (
            <div id="reports-tab" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <FileSpreadsheet className="w-5.5 h-5.5 text-indigo-600" />
                    Live System Activity Logs
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">Continuous administrative audit trails of all operations within the ITPMS platform.</p>
                </div>
                <button
                  id="print-audit-report-btn"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Export Printable Report</span>
                </button>
              </div>

              {/* Table of Activity logs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Activity Log ID</th>
                      <th className="py-3 px-4">Administrator Name</th>
                      <th className="py-3 px-4">Role Context</th>
                      <th className="py-3 px-4">Action Log Details</th>
                      <th className="py-3 px-4">Entity Type</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                        <td className="py-3 px-4 font-mono font-bold text-slate-400 dark:text-slate-500">{log.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.userName}</td>
                        <td className="py-3 px-4">
                          <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded text-[9px] font-bold font-mono uppercase">
                            {log.userRole}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">{log.entity}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <UserManagementModule userRole={userRole} onSyncState={syncState} />
          )}

          {activeTab === "planning" && (
            <PlanningModule
              planningItems={planningItems}
              onAdd={(payload) => handleAddItem("planningItems", payload, setPlanningItems)}
              onUpdate={(id, payload) => handleUpdateItem("planningItems", id, payload, setPlanningItems)}
              onDelete={(id) => handleDeleteItem("planningItems", id, setPlanningItems)}
            />
          )}

          {activeTab === "edoReport" && (
            <EdoReportModule
              edoReports={edoReports}
              residents={residents}
              startups={startups}
              properties={properties}
              onAdd={(payload) => handleAddItem("edoReports", payload, setEdoReports)}
              onUpdate={(id, payload) => handleUpdateItem("edoReports", id, payload, setEdoReports)}
              onDelete={(id) => handleDeleteItem("edoReports", id, setEdoReports)}
              currentUser={currentUser}
            />
          )}
          </Suspense>
        </main>
      </div>

      {/* --- GLOBAL COMMAND PALETTE MODAL --- */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-start justify-center pt-[10%] px-4 animate-in fade-in-50 duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs font-sans">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type to search exporters, startups, talent, or execute AI commands..."
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden font-medium text-xs"
              />
              <button 
                onClick={() => { setShowCommandPalette(false); setCmdSearch(""); }}
                className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-bold transition-all text-[9px] uppercase"
              >
                ESC
              </button>
            </div>

            {/* Results or Presets */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-4">
              {!cmdSearch ? (
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Strategic AI Prompts Quickstart</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setActiveTab("ai");
                        setShowCommandPalette(false);
                      }}
                      className="text-left p-2.5 hover:bg-indigo-50/50 border border-slate-100 rounded-xl transition-all block space-y-0.5 cursor-pointer"
                    >
                      <span className="font-bold text-indigo-600 block">⚡ Startup Mentoring Diagnostic</span>
                      <span className="text-slate-500 text-[10px]">Scans MRR growth curves and lists applicants needing acceleration.</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("ai");
                        setShowCommandPalette(false);
                      }}
                      className="text-left p-2.5 hover:bg-indigo-50/50 border border-slate-100 rounded-xl transition-all block space-y-0.5 cursor-pointer"
                    >
                      <span className="font-bold text-indigo-600 block">⚡ Exporters Benefit Auditor</span>
                      <span className="text-slate-500 text-[10px]">Triggers an audit of Resident tax exemptions and exports ratios.</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("ai");
                        setShowCommandPalette(false);
                      }}
                      className="text-left p-2.5 hover:bg-indigo-50/50 border border-slate-100 rounded-xl transition-all block space-y-0.5 cursor-pointer"
                    >
                      <span className="font-bold text-indigo-600 block">⚡ Outbound CRM Pipeline Review</span>
                      <span className="text-slate-500 text-[10px]">Identifies high score BPO leads without any scheduled syncs.</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("ai");
                        setShowCommandPalette(false);
                      }}
                      className="text-left p-2.5 hover:bg-indigo-50/50 border border-slate-100 rounded-xl transition-all block space-y-0.5 cursor-pointer"
                    >
                      <span className="font-bold text-indigo-600 block">⚡ Infrastructure Lease Audit</span>
                      <span className="text-slate-500 text-[10px]">Scans room occupancy parameters and highlights maintenance tasks.</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Ecosystem Match Findings</h5>
                  
                  {/* Startups results */}
                  {cmdMatches.startups.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block px-1">Startups Hub ({cmdMatches.startups.length})</span>
                      {cmdMatches.startups.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveTab("startups");
                            setShowCommandPalette(false);
                            setCmdSearch("");
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition-all"
                        >
                          <span className="font-bold text-slate-700">{s.name} <span className="text-slate-400 font-normal">({s.founder})</span></span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">{s.stage}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Residents results */}
                  {cmdMatches.residents.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block px-1">Resident Exporters ({cmdMatches.residents.length})</span>
                      {cmdMatches.residents.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setActiveTab("residents");
                            setShowCommandPalette(false);
                            setCmdSearch("");
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition-all"
                        >
                          <span className="font-bold text-slate-700">{r.companyName} <span className="text-slate-400 font-normal">({r.director})</span></span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Talent results */}
                  {cmdMatches.talent.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block px-1">Vetted Talent ({cmdMatches.talent.length})</span>
                      {cmdMatches.talent.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            setActiveTab("talent");
                            setShowCommandPalette(false);
                            setCmdSearch("");
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center transition-all"
                        >
                          <span className="font-bold text-slate-700">{t.fullName} <span className="text-slate-400 font-normal">({t.university})</span></span>
                          <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase">{t.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {cmdMatches.startups.length === 0 && cmdMatches.residents.length === 0 && cmdMatches.talent.length === 0 && (
                    <p className="text-slate-400 py-4 text-center font-medium">No system matches. Try querying "EPAM" or "Paymart".</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Command Palette Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-400 flex justify-between items-center text-[10px] font-mono">
              <span>Use <strong>Cmd+K</strong> or <strong>Ctrl+K</strong> to summon anytime</span>
              <span>IT Park Kashkadarya Management System</span>
            </div>
          </div>
        </div>
      )}

      {/* --- GLOBAL COLLAPSIBLE FLOATING COPILOT CHAT --- */}
      <div className="fixed bottom-6 right-6 z-40 text-xs font-sans">
        {showGlobalChat ? (
          <div className="bg-slate-900 border border-slate-800 w-80 h-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-white font-bold uppercase text-[9px] tracking-wider">
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>ITPMS Active Google Studio Overlay</span>
              </div>
              <button 
                onClick={() => setShowGlobalChat(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Pane */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {globalChatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2.5 rounded-xl leading-relaxed max-w-[220px] font-medium ${
                    m.sender === "user" ? "bg-indigo-600 text-white font-bold" : "bg-slate-800 text-slate-200 border border-slate-700/50"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isGlobalChatLoading && (
                <div className="flex justify-start items-center gap-2 text-slate-500 font-semibold text-[10px] animate-pulse">
                  <span>Synthesizing database...</span>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendGlobalChat} className="p-2.5 bg-slate-950 border-t border-slate-850 flex gap-2">
              <input
                type="text"
                value={globalChatInput}
                onChange={(e) => setGlobalChatInput(e.target.value)}
                placeholder="Ask about exports, resident registrations..."
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-lg text-[11px] focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setShowGlobalChat(true)}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 animate-bounce duration-1000"
            title="Summon ITPMS Google Studio"
          >
            <BrainCircuit className="w-6 h-6 text-white animate-pulse" />
          </button>
        )}
      </div>
    </div>
  );
}
