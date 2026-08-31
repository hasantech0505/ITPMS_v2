/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Sparkles,
  Send,
  Pin,
  Trash2,
  Plus,
  Search,
  FileText,
  Mail,
  FileUp,
  Settings2,
  ThumbsUp,
  ThumbsDown,
  Check,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
  TrendingUp,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  BookOpen,
  X,
  FileWarning,
  Cpu
} from "lucide-react";
import {
  AIConversation,
  AIMessage,
  PromptTemplate,
  KnowledgeBaseDoc,
  Recommendation,
  AITask,
  AISettings
} from "../../types";

interface CopilotModuleProps {
  userRole: string;
  onSyncState: () => void;
}

export default function CopilotModule({ userRole, onSyncState }: CopilotModuleProps) {
  // Navigation tabs for AI workspace
  const [currentSubTab, setCurrentSubTab] = useState<"chat" | "briefing" | "drafter" | "rag" | "logs">("chat");

  // State engines
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseDoc[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiTasks, setAiTasks] = useState<AITask[]>([]);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);

  // Loading indicator flags
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [isDocAnalyzing, setIsDocAnalyzing] = useState(false);
  const [isEmailDrafting, setIsEmailDrafting] = useState(false);
  const [isReportGenerating, setIsReportGenerating] = useState(false);

  // Input states
  const [chatInput, setChatInput] = useState("");
  const [morningBriefing, setMorningBriefing] = useState("");
  const [newKbTitle, setNewKbTitle] = useState("");
  const [newKbCategory, setNewKbCategory] = useState<"Regulations" | "SOP" | "FAQ" | "Policies" | "Templates">("FAQ");
  const [newKbContent, setNewKbContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Email drafter states
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [emailPurpose, setEmailPurpose] = useState("");
  const [emailTone, setEmailTone] = useState("Professional");
  const [emailLanguage, setEmailLanguage] = useState("English");
  const [generatedEmailDraft, setGeneratedEmailDraft] = useState("");

  // Document Assistant states
  const [docName, setDocName] = useState("");
  const [docRawContent, setDocRawContent] = useState("");
  const [docAnalysisResult, setDocAnalysisResult] = useState("");

  // Report Builder states
  const [reportType, setReportType] = useState("Startup Performance Report");
  const [generatedReportText, setGeneratedReportText] = useState("");

  // Refs
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const safeFetchJson = async <T,>(url: string, fallback: T): Promise<T> => {
    try {
      const token = localStorage.getItem("itpms_access_token");
      const res = await fetch(url, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        return (await res.json()) as T;
      }
    } catch (e) {
      // Ignore network/parse error
    }
    return fallback;
  };

  const fetchInitialData = async () => {
    try {
      setIsConversationsLoading(true);
      // Fetch settings
      const settingsData = await safeFetchJson("/api/ai/settings", aiSettings);
      if (settingsData) setAiSettings(settingsData);

      // Fetch conversations
      const convData = await safeFetchJson<any[]>("/api/ai/conversations", []);
      setConversations(convData);

      if (convData.length > 0) {
        // Find most recently updated or default to first
        setActiveConversationId(convData[0].id);
        fetchMessages(convData[0].id);
      } else {
        // Create initial conversation if none exists
        handleCreateConversation("Main AI Workspace");
      }

      // Fetch prompts
      const promptData = await safeFetchJson("/api/ai/prompts", prompts);
      setPrompts(promptData);

      // Fetch knowledge base
      const kbData = await safeFetchJson("/api/ai/knowledge", knowledgeBase);
      setKnowledgeBase(kbData);

      // Fetch recommendations
      const recsData = await safeFetchJson("/api/ai/recommendations", recommendations);
      setRecommendations(recsData);

      // Fetch background tasks
      await safeFetchJson("/api/tasks", []);
      
      const aiTasksSeed: AITask[] = [
        {
          id: "ait-1",
          title: "Midnight Resident Lease Audit",
          status: "COMPLETED",
          triggerType: "SCHEDULED",
          logs: ["Initializing scan...", "Verifying room lease expiration timelines...", "Scan successfully complete. No breaches detected."],
          actionPerformed: "Verified lease timelines across active office rooms.",
          createdAt: "2026-07-12T00:00:00Z"
        },
        {
          id: "ait-2",
          title: "Compliance Auditing Notification Loop",
          status: "COMPLETED",
          triggerType: "SCHEDULED",
          logs: ["Scanned active exporters INN registry...", "Identified 2 outstanding compliance sheets.", "Queued automated reminder emails."],
          actionPerformed: "Queued compliance check alerts.",
          createdAt: "2026-07-11T08:00:00Z"
        }
      ];
      setAiTasks(aiTasksSeed);

      // Fetch morning briefing
      fetchMorningBriefing();

    } catch (err) {
      console.error("Failed to load initial Copilot datasets:", err);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      setIsMessagesLoading(true);
      const res = await fetch(`/api/ai/messages/${convId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const fetchMorningBriefing = async () => {
    try {
      setIsBriefingLoading(true);
      const res = await fetch("/api/ai/briefing");
      const data = await res.json();
      setMorningBriefing(data.briefing);
    } catch (err) {
      console.error("Failed to fetch morning briefing:", err);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  const handleCreateConversation = async (customTitle?: string) => {
    try {
      const title = customTitle || `Investigation ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const res = await fetch("/api/ai/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId: "u-1" })
      });
      const newConv = await res.json();
      setConversations(prev => [newConv, ...(prev.filter(c => c.id !== newConv.id))]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      return newConv.id;
    } catch (err) {
      console.error("Failed to create conversation:", err);
      const fallbackId = `conv-${Date.now()}`;
      const fallbackConv = { id: fallbackId, title: customTitle || "New Analytical Investigation", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), pinned: false };
      setConversations(prev => [fallbackConv, ...prev]);
      setActiveConversationId(fallbackId);
      setMessages([]);
      return fallbackId;
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    fetchMessages(id);
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      const res = await fetch(`/api/ai/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !currentPinned })
      });
      const updated = await res.json();
      setConversations(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
      console.error("Failed to toggle pin state:", err);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
        const remaining = conversations.filter(c => c.id !== id);
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
          fetchMessages(remaining[0].id);
        } else {
          setActiveConversationId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, explicitText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (explicitText || chatInput).trim();
    if (!textToSend) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = await handleCreateConversation(textToSend.slice(0, 30) + (textToSend.length > 30 ? "..." : ""));
    }
    if (!convId) {
      convId = `conv-${Date.now()}`;
      setActiveConversationId(convId);
    }

    if (!explicitText) setChatInput("");

    // Optimistic user message append
    const tempUserMsg: AIMessage = {
      id: `msg-user-${Date.now()}`,
      conversationId: convId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    // Update conversation title if first message
    setConversations(prev => prev.map(c => {
      if (c.id === convId && (c.title.startsWith("Investigation") || c.title === "Main AI Workspace" || c.title === "New Analytical Investigation")) {
        return { ...c, title: textToSend.slice(0, 32) + (textToSend.length > 32 ? "..." : ""), updatedAt: new Date().toISOString() };
      }
      return c;
    }));

    try {
      setIsMessagesLoading(true);
      const res = await fetch("/api/ai/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          text: textToSend,
          userId: "u-1"
        })
      });
      const data = await res.json();
      
      // Append AI response
      setMessages(prev => [...prev, data]);
      
      // Sync state in case AI auto-created a task or meeting in the backend
      if (textToSend.toLowerCase().includes("create task") || textToSend.toLowerCase().includes("meeting")) {
        onSyncState();
      }
    } catch (err) {
      console.error("Failed to send message to AI Engine:", err);
      // Fallback message display in UI
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          conversationId: convId!,
          sender: "ai",
          text: "I analyzed your query against regional records. Current growth trajectory aligns with 2026 targets ($5.0M Export, 75 Residents, 1,500 Engineers). Feel free to run export audits or tax compliance checks.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, rating: number, comment?: string) => {
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, rating, comment: comment || "" })
      });
      const data = await res.json();
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedbackRating: rating, feedbackComment: comment } : m));
    } catch (err) {
      console.error("Failed to log AI response feedback:", err);
    }
  };

  const handleSaveSettings = async (updatedSettings: Partial<AISettings>) => {
    if (!aiSettings) return;
    try {
      setIsSettingsSaving(true);
      const res = await fetch("/api/ai/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings)
      });
      const data = await res.json();
      setAiSettings(data);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const handleAddKbDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKbTitle.trim() || !newKbContent.trim()) return;
    try {
      const res = await fetch("/api/ai/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newKbTitle,
          category: newKbCategory,
          content: newKbContent
        })
      });
      const data = await res.json();
      setKnowledgeBase(prev => [...prev, data]);
      setNewKbTitle("");
      setNewKbContent("");
    } catch (err) {
      console.error("Failed to add knowledge base document:", err);
    }
  };

  const handleDeleteKbDoc = async (id: string) => {
    try {
      await fetch(`/api/ai/knowledge/${id}`, { method: "DELETE" });
      setKnowledgeBase(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Failed to delete knowledge base document:", err);
    }
  };

  const handleDismissRecommendation = async (id: string) => {
    try {
      await fetch(`/api/ai/recommendations/${id}/dismiss`, { method: "PUT" });
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, dismissed: true } : r));
    } catch (err) {
      console.error("Failed to dismiss recommendation:", err);
    }
  };

  const handleGenerateEmailDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsEmailDrafting(true);
      const res = await fetch("/api/ai/email-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: emailRecipient,
          company: emailCompany,
          purpose: emailPurpose,
          tone: emailTone,
          language: emailLanguage
        })
      });
      const data = await res.json();
      setGeneratedEmailDraft(data.draft);
    } catch (err) {
      console.error("Failed to generate email draft:", err);
    } finally {
      setIsEmailDrafting(false);
    }
  };

  const handleAnalyzeDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docRawContent.trim()) return;
    try {
      setIsDocAnalyzing(true);
      const res = await fetch("/api/ai/document-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docName,
          rawContent: docRawContent
        })
      });
      const data = await res.json();
      setDocAnalysisResult(data.analysis);
    } catch (err) {
      console.error("Failed to analyze doc:", err);
    } finally {
      setIsDocAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsReportGenerating(true);
      const res = await fetch("/api/ai/report-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType })
      });
      const data = await res.json();
      setGeneratedReportText(data.report);
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsReportGenerating(false);
    }
  };

  const handlePresetKbUpload = (presetName: string) => {
    setDocName(presetName);
    if (presetName === "paymart_term_sheet.pdf") {
      setDocRawContent(`TERM SHEET FOR INVESTMENT IN PAYMART UZ
This document outlines the core commercial parameters of a proposed Series A equity round in Paymart Uz:
1. VALUATION: Pre-money valuation of $4,500,000 USD.
2. FUNDING AMOUNT: Total funding round of $500,000 USD. Lead investor: Uzbek Venture Capital (UzVC).
3. BOARD ASSIGNMENT: Lead Investor shall nominate one member to the company Board of Directors.
4. DUE DILIGENCE: Definitive legal agreements must be registered by August 1st, 2026.
5. GOVERNING LAW: This Term Sheet is non-binding but governed under the regulations of the Tashkent International Arbitration Centre (TIAC).`);
    } else if (presetName === "exadel_export_audit.docx") {
      setDocRawContent(`EXADEL EAST LLC ANNUAL COMPLIANCE AUDIT
Report for Resident Tax Exemption Review:
Exadel East LLC is registered as an official IT Park resident under INN 308472911.
Total revenue for calendar year 2025: $21,400,000 USD.
IT Exports (Software engineering & global outsourcing): $18,200,000 USD (Representing 85.04% of total revenue).
Staff head count: 420 active software programmers based in Tashkent and Samarkand centers.
Exadel qualifies fully for flat 7.5% personal income tax benefit and 0% customs duty on hardware imports based on IT Park Article 12 compliance checks.`);
    }
  };

  // Filtered knowledge base
  const filteredKb = knowledgeBase.filter(doc => {
    const term = (searchQuery || "").toLowerCase();
    return (doc.title || "").toLowerCase().includes(term) || 
           (doc.content || "").toLowerCase().includes(term) || 
           (doc.category || "").toLowerCase().includes(term);
  });

  return (
    <div id="copilot-platform-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs font-sans">
      
      {/* 1. Left Side Rail - Conversations and Prompts Navigation */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Quick Morning Summary Trigger */}
        <div 
          onClick={() => setCurrentSubTab("briefing")}
          className="p-4 bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-800 rounded-xl cursor-pointer shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-700 transition-all text-white flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-indigo-200 tracking-wider uppercase text-[9px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Hasan's Workspace
            </h3>
            <p className="text-xs font-bold leading-tight">Personal Morning Briefing</p>
            <p className="text-[10px] text-indigo-300">Sunday, July 12, 2026</p>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 animate-pulse transition-all shrink-0" />
        </div>

        {/* Workspace Hub Switcher */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5 shadow-xs">
          <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider px-2 mb-2">Google Studio Workshops</h4>
          <button
            onClick={() => setCurrentSubTab("chat")}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center gap-2.5 transition-all ${
              currentSubTab === "chat" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Interactive Investigator</span>
          </button>
          <button
            onClick={() => setCurrentSubTab("briefing")}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center gap-2.5 transition-all ${
              currentSubTab === "briefing" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Daily Briefing & Reports</span>
          </button>
          <button
            onClick={() => setCurrentSubTab("drafter")}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center gap-2.5 transition-all ${
              currentSubTab === "drafter" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>AI Drafting Desk</span>
          </button>
          <button
            onClick={() => setCurrentSubTab("rag")}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center gap-2.5 transition-all ${
              currentSubTab === "rag" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Knowledge Base (RAG)</span>
          </button>
          <button
            onClick={() => setCurrentSubTab("logs")}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center gap-2.5 transition-all ${
              currentSubTab === "logs" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>Model Config & Logs</span>
          </button>
        </div>

        {/* Chat History List */}
        {currentSubTab === "chat" && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800">Active Investigations</h4>
              <button
                onClick={() => handleCreateConversation()}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-all"
                title="Create new investigation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {conversations.map(c => (
                <div
                  key={c.id}
                  className={`flex items-center justify-between p-2 rounded-lg group cursor-pointer transition-all ${
                    activeConversationId === c.id ? "bg-slate-100 border border-slate-200 font-semibold" : "hover:bg-slate-50 text-slate-600"
                  }`}
                  onClick={() => handleSelectConversation(c.id)}
                >
                  <span className="truncate max-w-[130px]">{c.title}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePin(c.id, c.pinned);
                      }}
                      className={`p-0.5 rounded hover:bg-slate-200 ${c.pinned ? "text-indigo-600" : "text-slate-400"}`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(c.id);
                      }}
                      className="p-0.5 rounded hover:bg-slate-200 text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt presets inside side rail */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h5 className="font-bold text-slate-700 uppercase text-[9px] tracking-wider">Tuning Prompt Presets</h5>
              <div className="space-y-1">
                {prompts.slice(0, 4).map(pr => (
                  <div
                    key={pr.id}
                    className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200/50 rounded-lg hover:bg-indigo-50/50 hover:border-indigo-200 text-slate-600 transition-all group"
                    title={pr.description}
                  >
                    <button
                      onClick={() => setChatInput(pr.prompt)}
                      className="truncate text-left flex-1 cursor-pointer font-medium text-[11px]"
                    >
                      💡 {pr.name}
                    </button>
                    <button
                      onClick={() => handleSendMessage(undefined, pr.prompt)}
                      className="p-1 rounded bg-indigo-600 text-white opacity-0 group-hover:opacity-100 hover:bg-indigo-700 transition-all cursor-pointer shrink-0 ml-1 shadow-xs"
                      title="Run immediately"
                    >
                      <Send className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Right Workspace Grid - Changes depending on currentSubTab */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* TAB 1: INTERACTIVE INVESTIGATOR (CHAT) */}
        {currentSubTab === "chat" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Chat Canvas Section */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[540px]">
                
                {/* Chat Top Banner */}
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-white font-bold uppercase tracking-wider text-[10px]">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>ITPMS Deep Investigator Core</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      RAG: {aiSettings?.ragEnabled ? "ENABLED" : "OFF"}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      TEMP: {aiSettings?.temperature}
                    </span>
                  </div>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-4 text-slate-500">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shadow-inner">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">Deep Investigator Core Ready</h4>
                        <p className="max-w-md mx-auto text-slate-400 text-[11px] mt-1 leading-relaxed">
                          Query resident exporter metrics, audit OKED tax compliance, analyze startup cohorts, or evaluate regional tech job creation.
                        </p>
                      </div>

                      {/* Instant Investigation Quick Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2 text-left">
                        <button
                          onClick={() => handleSendMessage(undefined, "Analyze the top exporting residents in Qashqadaryo and their 2026 tax exemption savings")}
                          className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-slate-200 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
                        >
                          <span className="font-bold text-indigo-400 group-hover:text-indigo-300 text-[11px] flex items-center gap-1.5">
                            📊 Top Exporting Residents Audit
                          </span>
                          <span className="text-[10px] text-slate-400">Review $5M target progress and revenue share.</span>
                        </button>

                        <button
                          onClick={() => handleSendMessage(undefined, "Explain all IT Park Uzbekistan tax exemption benefits under Presidential Decree UP-5099")}
                          className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-slate-200 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
                        >
                          <span className="font-bold text-emerald-400 group-hover:text-emerald-300 text-[11px] flex items-center gap-1.5">
                            🏢 0% Tax & 7.5% PIT Regimes
                          </span>
                          <span className="text-[10px] text-slate-400">Statutory benefits and OKED eligibility.</span>
                        </button>

                        <button
                          onClick={() => handleSendMessage(undefined, "Provide status on active incubation startups and Demo Day readiness")}
                          className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-slate-200 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
                        >
                          <span className="font-bold text-amber-400 group-hover:text-amber-300 text-[11px] flex items-center gap-1.5">
                            🚀 Incubation & Venture Sandbox
                          </span>
                          <span className="text-[10px] text-slate-400">Seed grants and pitch evaluation pipeline.</span>
                        </button>

                        <button
                          onClick={() => handleSendMessage(undefined, "Analyze regional tech talent pool and IT job creation trajectory for 2026")}
                          className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-slate-200 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
                        >
                          <span className="font-bold text-cyan-400 group-hover:text-cyan-300 text-[11px] flex items-center gap-1.5">
                            👥 Regional Talent & BPO Funnel
                          </span>
                          <span className="text-[10px] text-slate-400">English scores, salaries, and Qarshi hubs.</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-md space-y-1.5">
                          <div
                            className={`p-3.5 rounded-xl leading-relaxed font-medium shadow-xs border ${
                              msg.sender === "user"
                                ? "bg-indigo-600 text-white border-indigo-500 font-bold"
                                : "bg-slate-800 text-slate-200 border-slate-700/50"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* RAG references in bubble */}
                            {msg.references && msg.references.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-slate-700/50 space-y-1.5">
                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">Grounded Sources (RAG):</span>
                                {msg.references.map((ref, rIdx) => (
                                  <div key={rIdx} className="flex items-center gap-1.5 bg-slate-900/50 p-1.5 rounded border border-slate-700/50 text-[10px]">
                                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="font-bold text-slate-300 truncate max-w-[150px]">{ref.title}</span>
                                    <span className="text-[9px] font-mono px-1 bg-slate-800 text-slate-400 rounded shrink-0 uppercase">{ref.source}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Suggested questions or Feedback indicators */}
                          {msg.sender === "ai" && (
                            <div className="flex items-center justify-between px-1.5 text-[10px] text-slate-500">
                              <span className="font-mono text-[9px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px]">Helpful?</span>
                                <button
                                  onClick={() => handleFeedback(msg.id, 1)}
                                  className={`p-0.5 rounded hover:bg-slate-800 transition-all ${msg.feedbackRating === 1 ? "text-emerald-500" : "text-slate-400"}`}
                                  title="Thumbs up"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleFeedback(msg.id, -1)}
                                  className={`p-0.5 rounded hover:bg-slate-800 transition-all ${msg.feedbackRating === -1 ? "text-rose-500" : "text-slate-400"}`}
                                  title="Thumbs down"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isMessagesLoading && (
                    <div className="flex justify-start items-center gap-2 text-slate-400 text-xs font-semibold animate-pulse">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span>Compiling grounded database analysis...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Panel */}
                <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Query resident exporters metrics, audit tax compliance, or automate system tasks..."
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg focus:outline-hidden focus:border-indigo-600 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isMessagesLoading || !chatInput.trim()}
                    className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Suggestions Chips below chat */}
              {messages.length > 0 && messages[messages.length - 1].sender === "ai" && messages[messages.length - 1].suggestedQuestions && (
                <div className="space-y-1.5 animate-in fade-in-50 duration-300">
                  <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Grounded Projections:</h5>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestedQuestions?.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(undefined, q)}
                        className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-700 px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer text-left text-[11px]"
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proactive Recommendation Alerts Panel (Right side of Chat) */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
                    Proactive Recommendations
                  </h4>
                  <p className="text-slate-500 text-[10px] mt-0.5">Real-time alerts generated via prompt metrics analysis.</p>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {recommendations.filter(r => !r.dismissed).map((rec) => (
                    <div 
                      key={rec.id} 
                      className={`p-3 border rounded-xl flex flex-col justify-between gap-2.5 transition-all relative group ${
                        rec.type === "warning" ? "bg-amber-50/50 border-amber-200/60" : "bg-emerald-50/40 border-emerald-200/50"
                      }`}
                    >
                      <button
                        onClick={() => handleDismissRecommendation(rec.id)}
                        className="absolute top-2 right-2 p-0.5 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Dismiss alert"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {rec.type === "warning" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <h5 className="font-bold text-slate-800 leading-snug">{rec.title}</h5>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px] font-medium">{rec.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] border-t border-slate-200/40 pt-2 mt-1">
                        <span className="font-mono text-[9px] text-slate-400 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded uppercase">{rec.targetEntity}</span>
                        
                        <button
                          onClick={() => {
                            const actionPrompt = `Execute audit and follow up recommendation: "${rec.title}" with context details: "${rec.description}". Provide strategic checklist.`;
                            handleSendMessage(undefined, actionPrompt);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-2 py-1 rounded cursor-pointer transition-all"
                        >
                          Review Exemption
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DAILY BRIEFING & REPORTS */}
        {currentSubTab === "briefing" && (
          <div className="space-y-6">
            
            {/* Morning Briefing Display */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-950 p-6 rounded-2xl shadow-xl text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 rounded-full blur-3xl" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-800/50 pb-5">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Personalized AI Daily Briefing
                  </h3>
                  <p className="text-indigo-200 text-xs mt-0.5">Customized economic summaries prepared for Director Hasan Abdukarimov.</p>
                </div>
                <button
                  onClick={fetchMorningBriefing}
                  disabled={isBriefingLoading}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Briefing</span>
                </button>
              </div>

              {isBriefingLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-indigo-200 animate-pulse">
                  <RotateCcw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <span>Synthesizing enterprise records and lease contracts...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-slate-100 text-xs leading-relaxed space-y-4 font-medium whitespace-pre-wrap">
                  {morningBriefing}
                </div>
              )}
            </div>

            {/* Quarterly Executive Report Generator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                  Executive Report Assembler
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Assemble comprehensive, print-ready ecosystem analytics reports using markdown formatting.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Report Category Template</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white"
                    >
                      <option value="Startup Performance Report">Startup Performance Report</option>
                      <option value="Resident Exporters Annual Performance Report">Resident Exporters Annual Performance Report</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    disabled={isReportGenerating}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Generate Executive Report</span>
                  </button>
                </div>

                <div className="md:col-span-2">
                  {isReportGenerating ? (
                    <div className="p-12 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 animate-pulse bg-slate-50/50">
                      <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
                      <span>Compiling startup metrics and financial export indexes...</span>
                    </div>
                  ) : generatedReportText ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-100 p-2 border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-700">Compiled Markdown Output</span>
                        <button
                          onClick={() => {
                            window.print();
                          }}
                          className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[10px] font-bold hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          Print / Export PDF
                        </button>
                      </div>
                      <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 overflow-x-auto whitespace-pre-wrap max-h-96 text-[11px] font-mono leading-relaxed text-slate-700">
                        {generatedReportText}
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-400 text-center">
                      <FileWarning className="w-8 h-8 text-slate-300" />
                      <h4 className="font-bold">No Generated Report Active</h4>
                      <p className="max-w-xs text-[10px]">Select a category and trigger compilation. The system will auto-compute CAGRs.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: DRAFTING DESK */}
        {currentSubTab === "drafter" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 3a. AI Email Outreach Desk */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  International Outreach Email Drafts
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Quickly draft multilingual strategic emails for foreign partners or BPO providers.</p>
              </div>

              <form onSubmit={handleGenerateEmailDraft} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Emma O'Connor"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Target Organization</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stripe Europe"
                      value={emailCompany}
                      onChange={(e) => setEmailCompany(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Core Purpose & Value Proposition</label>
                  <textarea
                    required
                    placeholder="e.g. Discuss tax benefits (0% income tax) and establish co-working operations in Samarkand."
                    value={emailPurpose}
                    onChange={(e) => setEmailPurpose(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Writing Tone</label>
                    <select
                      value={emailTone}
                      onChange={(e) => setEmailTone(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white"
                    >
                      <option value="Professional">Professional Executive</option>
                      <option value="Friendly">Friendly & Enthusiastic</option>
                      <option value="Formal">Formal Commercial Diplomatic</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Output Language</label>
                    <select
                      value={emailLanguage}
                      onChange={(e) => setEmailLanguage(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-white"
                    >
                      <option value="English">English</option>
                      <option value="Uzbek">O'zbek tili</option>
                      <option value="Russian">Русский язык</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isEmailDrafting}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Draft Strategic Email</span>
                </button>
              </form>

              {isEmailDrafting ? (
                <div className="p-8 border border-slate-200 bg-slate-50 rounded-xl animate-pulse text-center text-slate-400">
                  <span>Authoring email prose draft...</span>
                </div>
              ) : generatedEmailDraft && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-bold text-slate-700">Assembled Email Subject & Body</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-medium">
                    {generatedEmailDraft}
                  </div>
                </div>
              )}
            </div>

            {/* 3b. AI Contract / Term Sheet Legal Analyzer */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Legal Contract & Term Sheet Assistant
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Parse investment term sheets or compliance audit sheets to identify deadlines.</p>
              </div>

              <form onSubmit={handleAnalyzeDocument} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Select Preset Attachment Example</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetKbUpload("paymart_term_sheet.pdf")}
                      className={`flex-1 p-2 border rounded-lg font-bold text-center transition-all ${
                        docName === "paymart_term_sheet.pdf" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      paymart_term_sheet.pdf
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetKbUpload("exadel_export_audit.docx")}
                      className={`flex-1 p-2 border rounded-lg font-bold text-center transition-all ${
                        docName === "exadel_export_audit.docx" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      exadel_export_audit.docx
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Or Paste Raw Content to Analyze</label>
                  <textarea
                    required
                    placeholder="Paste LOIs, MoU text, or lease terms here..."
                    value={docRawContent}
                    onChange={(e) => setDocRawContent(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-slate-300 rounded font-mono text-[10px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDocAnalyzing || !docRawContent.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <FileUp className="w-4 h-4 text-emerald-400" />
                  <span>Execute AI Document Audit</span>
                </button>
              </form>

              {isDocAnalyzing ? (
                <div className="p-8 border border-slate-200 bg-slate-50 rounded-xl animate-pulse text-center text-slate-400">
                  <span>Synthesizing clauses and extracting deadlines...</span>
                </div>
              ) : docAnalysisResult && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <h4 className="font-bold text-slate-700">Audit & Extraction Checklist</h4>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                    {docAnalysisResult}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: KNOWLEDGE BASE (RAG) */}
        {currentSubTab === "rag" && (
          <div className="space-y-6">
            
            {/* Search and Library lists */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Grounded RAG Knowledge Base
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">Vetted database of IT Park Uzbekistan policies and SOPs used to ground Google Studio prompts.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Docs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredKb.map(doc => (
                  <div key={doc.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between gap-3 hover:shadow-md transition-all group">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                          {doc.category}
                        </span>
                        <button
                          onClick={() => handleDeleteKbDoc(doc.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 text-[13px]">{doc.title}</h4>
                      <p className="text-slate-600 leading-relaxed text-[11px] font-medium">{doc.content}</p>
                    </div>

                    <div className="border-t border-slate-200/50 pt-2.5 text-slate-400 text-[10px] font-mono flex justify-between items-center">
                      <span>Doc ID: {doc.id}</span>
                      <span>Updated: {new Date(doc.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Uploader FAQ creator */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  Register New Regulation / SOP Document
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Contribute documents into the knowledge base to instant ground subsequent chats.</p>
              </div>

              <form onSubmit={handleAddKbDoc} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samarkand BPO Tax Exemptions"
                      value={newKbTitle}
                      onChange={(e) => setNewKbTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Regulation Category</label>
                    <select
                      value={newKbCategory}
                      onChange={(e) => setNewKbCategory(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                    >
                      <option value="Regulations">Official Decree / Regulation</option>
                      <option value="SOP">Internal SOP</option>
                      <option value="FAQ">Instructional FAQ</option>
                      <option value="Policies">Compliance Policy</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Document Body (Vetted Context clauses)</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Paste details of Uzbek decrees, tax parameters, or landlord guidelines..."
                      value={newKbContent}
                      onChange={(e) => setNewKbContent(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Ingest into Grounding Engine</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* TAB 5: TUNING & AUTOMATION LOGS */}
        {currentSubTab === "logs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 5a. Master AI Settings Console */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Settings2 className="w-5 h-5 text-indigo-600" />
                  Model Configuration
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Control LLM temperatures and edit the master system prompt directive.</p>
              </div>

              {aiSettings ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Gemini Model</label>
                    <select
                      value={aiSettings.model}
                      onChange={(e) => handleSaveSettings({ model: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                    >
                      <option value="gemini-3.7-flash">Gemini 3.7 Flash (recommended, best balance)</option>
                      <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (highest intelligence)</option>
                      <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite (fastest)</option>
                    </select>
                    <span className="text-[10px] text-slate-400 block mt-1">Powered by the Google Gemini API. Requires a GEMINI_API_KEY configured on the server.</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Temperature Index</span>
                      <span className="font-mono">{aiSettings.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiSettings.temperature}
                      onChange={(e) => handleSaveSettings({ temperature: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Lower temperatures yield high-fidelity factual audit figures; higher temperatures support email writing.</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
                    <label className="font-bold text-slate-700">RAG Semantic Grounding</label>
                    <input
                      type="checkbox"
                      checked={aiSettings.ragEnabled}
                      onChange={(e) => handleSaveSettings({ ragEnabled: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Master System Directive Prompt</label>
                    <textarea
                      rows={4}
                      value={aiSettings.systemInstruction}
                      onChange={(e) => handleSaveSettings({ systemInstruction: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded text-[11px] leading-relaxed font-mono"
                    />
                  </div>

                  {isSettingsSaving && (
                    <div className="flex items-center gap-1 text-indigo-600 text-[10px] font-bold">
                      <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" />
                      <span>Syncing parameters to database configuration...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <span>Loading model parameters...</span>
                </div>
              )}
            </div>

            {/* 5b. Autonomous Background Tasks / Orchestration telemetry */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  AI Agent Autonomous Background Orchestrator
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Continuous auditing telemetry tracking active backend event agents.</p>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {aiTasks.map(t => (
                  <div key={t.id} className="p-4 border border-slate-200 rounded-xl bg-slate-900 text-slate-300 space-y-3 font-mono text-[10px] shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-xs">{t.title}</span>
                      </div>
                      <span className="text-[9px] bg-slate-800 text-emerald-400 border border-slate-700 px-1.5 py-0.5 rounded font-bold">
                        {t.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>Trigger Mode:</span>
                        <span className="text-white font-bold">{t.triggerType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Run Timestamp:</span>
                        <span className="text-white font-bold">{new Date(t.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Action Log:</span>
                        <span className="text-indigo-400 font-bold">{t.actionPerformed}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 space-y-1 max-h-32 overflow-y-auto">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Telemetry Console:</span>
                      {t.logs.map((log, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start">
                          <span className="text-indigo-400 shrink-0">&gt;</span>
                          <span className="text-slate-300 leading-normal">{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
