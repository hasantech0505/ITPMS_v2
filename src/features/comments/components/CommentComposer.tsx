import React, { useState } from "react";
import { 
  Rocket, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Building2, 
  Building, 
  Users, 
  Calendar, 
  Tag, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText
} from "lucide-react";
import { 
  CommentCategory, 
  CommentPriority, 
  Startup, 
  Resident, 
  Office, 
  UserRole 
} from "../../../types";

interface CommentComposerProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: UserRole | string;
  currentUserAvatar?: string;
  currentUserDepartment?: string;
  currentUserEmail?: string;
  startups: Startup[];
  residents: Resident[];
  offices: Office[];
  onSubmit: (commentData: {
    title: string;
    content: string;
    category: CommentCategory;
    priority: CommentPriority;
    targetEntity?: "startup" | "resident" | "office" | "talent" | "event" | "project" | "general";
    targetEntityId?: string;
    targetEntityName?: string;
    tags: string[];
  }) => void;
  onCancel?: () => void;
}

export default function CommentComposer({
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserAvatar,
  currentUserDepartment,
  currentUserEmail,
  startups,
  residents,
  offices,
  onSubmit,
  onCancel
}: CommentComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommentCategory>("ideas");
  const [priority, setPriority] = useState<CommentPriority>("HIGH");
  const [targetType, setTargetType] = useState<string>("general");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      label: "🚀 Startup Acceleration Proposal",
      category: "startups" as CommentCategory,
      priority: "HIGH" as CommentPriority,
      title: "Co-Investment Matching Grant for Early-Traction Cohort",
      content: "We propose establishing a matching grant facility (up to $15,000 equivalent) for startups reaching $5k+ monthly recurring export revenue...",
      tags: "Startups, VentureFund, ExportGrowth"
    },
    {
      label: "🏢 Resident Exporter Support",
      category: "residents" as CommentCategory,
      priority: "CRITICAL" as CommentPriority,
      title: "Streamlined Customs & Zero-VAT Export Documentation",
      content: "Residents require expedited verification procedures for international service agreements with EU/US clients...",
      tags: "ResidentExport, ZeroVAT, Compliance"
    },
    {
      label: "⚡ Infrastructure & Bandwidth Upgrade",
      category: "infrastructure" as CommentCategory,
      priority: "HIGH" as CommentPriority,
      title: "Upgrade High-Capacity Fiber Internet at Regional Tech Hub",
      content: "To support new BPO voice operations, we need dedicated optical failover with guaranteed 99.9% SLA uptime...",
      tags: "Infrastructure, FiberOptic, BPO"
    },
    {
      label: "🎓 Youth Tech & Talent Boost",
      category: "talent" as CommentCategory,
      priority: "MEDIUM" as CommentPriority,
      title: "Foreign Language & Technical Training Boot Camp",
      content: "Propose launching an intensive 8-week boot camp for Kashkadarya university students preparing for remote IT jobs...",
      tags: "TalentPool, Education, YouthJobs"
    }
  ];

  const handleApplyTemplate = (tmpl: typeof templates[0]) => {
    setTitle(tmpl.title);
    setContent(tmpl.content);
    setCategory(tmpl.category);
    setPriority(tmpl.priority);
    setTagsInput(tmpl.tags);
    setShowTemplates(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let targetEntity: any = "general";
    let targetEntityId: string | undefined = undefined;
    let targetEntityName: string | undefined = undefined;

    if (targetType === "startup" && selectedEntityId) {
      targetEntity = "startup";
      targetEntityId = selectedEntityId;
      targetEntityName = startups.find(s => s.id === selectedEntityId)?.name;
    } else if (targetType === "resident" && selectedEntityId) {
      targetEntity = "resident";
      targetEntityId = selectedEntityId;
      const res = residents.find(r => r.id === selectedEntityId);
      targetEntityName = res?.companyName || (res as any)?.name;
    } else if (targetType === "office" && selectedEntityId) {
      targetEntity = "office";
      targetEntityId = selectedEntityId;
      const off = offices.find(o => o.id === selectedEntityId);
      targetEntityName = off ? `Room ${off.roomNumber} (${off.building})` : undefined;
    } else if (targetType !== "general") {
      targetEntity = targetType as any;
    }

    const parsedTags = tagsInput
      .split(",")
      .map(t => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    onSubmit({
      title: title.trim() || undefined as any,
      content: content.trim(),
      category,
      priority,
      targetEntity,
      targetEntityId,
      targetEntityName,
      tags: parsedTags.length > 0 ? parsedTags : ["KashkadaryaTech", "ITPark"]
    });

    setTitle("");
    setContent("");
    setTagsInput("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#74BD22] to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Rocket className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Submit Stakeholder Comment & Project Booster
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share strategic proposals, operational feedback, or vote to boost key initiatives for IT Park Kashkadarya.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#74BD22] bg-[#74BD22]/10 border border-[#74BD22]/20 hover:bg-[#74BD22]/20 rounded-lg cursor-pointer transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Templates</span>
        </button>
      </div>

      {/* Quick Template Picker dropdown */}
      {showTemplates && (
        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select a quick framework template:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {templates.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="text-left p-2.5 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-[#74BD22]">
                  {tmpl.label}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {tmpl.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Proposal / Discussion Headline <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Seed matching fund for Shakhrisabz Agritech cohort..."
            className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
          />
        </div>

        {/* Category, Priority & Target Entity in responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category / Pillar
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CommentCategory)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="ideas">💡 Innovation & Strategic Ideas</option>
              <option value="startups">🚀 Startups & Incubation</option>
              <option value="residents">🏢 Residents & IT Exporters</option>
              <option value="infrastructure">🏗️ Infrastructure & Smart Hub</option>
              <option value="talent">🎓 Talent Pool & BPO Academy</option>
              <option value="events">📅 Events & Hackathons</option>
              <option value="crm">🌐 Global Outreach & CRM</option>
              <option value="governance">⚖️ Legal & Governance</option>
              <option value="general">💬 General Discussion</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Impact / Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as CommentPriority)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="CRITICAL">🔴 Critical Priority (Immediate)</option>
              <option value="HIGH">🟠 High Impact (Strategic)</option>
              <option value="MEDIUM">🔵 Medium Priority (Planned)</option>
              <option value="ROUTINE">⚪ Routine / General Note</option>
            </select>
          </div>

          {/* Linked Target Entity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Link to Ecosystem Entity
            </label>
            <select
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value);
                setSelectedEntityId("");
              }}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="general">General Regional Ecosystem</option>
              <option value="startup">Specific Startup</option>
              <option value="resident">Specific Resident Company</option>
              <option value="office">Specific Office / Property</option>
              <option value="talent">Talent Academy Program</option>
              <option value="event">Upcoming Event / Hackathon</option>
            </select>
          </div>
        </div>

        {/* Specific Entity Picker if applicable */}
        {targetType === "startup" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Startup Company
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="">-- Choose Startup --</option>
              {startups.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.stage} - {s.industry})
                </option>
              ))}
            </select>
          </div>
        )}

        {targetType === "resident" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Resident Exporter
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="">-- Choose Resident Company --</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.companyName || (r as any).name} ({r.registrationNumber || "Resident"})
                </option>
              ))}
            </select>
          </div>
        )}

        {targetType === "office" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Property / Office Facility
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            >
              <option value="">-- Choose Property Asset --</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  Room {o.roomNumber} ({o.building} - Floor {o.floor})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Content Textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Detailed Proposal & Comments <span className="text-emerald-500">*</span>
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your detailed recommendation, project feedback, or operational requirement..."
            required
            className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
          />
        </div>

        {/* Tags input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Tags / Keywords <span className="text-slate-400 font-normal">(Comma-separated)</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. ITExport, BPO, VentureFund, Shahrisabz"
            className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
          />
        </div>

        {/* Footer info & submit */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>Posting as:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{currentUserName}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-mono">
              {currentUserRole}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#74BD22] to-emerald-500 hover:from-[#62a31b] hover:to-emerald-600 disabled:opacity-40 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-500/20 transition-all scale-100 hover:scale-102"
            >
              <Rocket className="w-4 h-4" />
              <span>Publish Project Booster</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
