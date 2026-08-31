import React, { useState, useMemo } from "react";
import { 
  MessageSquare, 
  Rocket, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Download, 
  Printer, 
  ShieldAlert, 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  Layers,
  X
} from "lucide-react";
import { 
  ProjectComment, 
  CommentReply, 
  CommentStatus, 
  CommentPriority, 
  CommentCategory,
  Startup, 
  Resident, 
  Office, 
  UserRole 
} from "../../types";
import CommentCard from "./components/CommentCard";
import CommentComposer from "./components/CommentComposer";
import CommentStatsBar from "./components/CommentStatsBar";
import CommentFilterBar from "./components/CommentFilterBar";
import BoostProjectModal from "./components/BoostProjectModal";
import { useLanguage } from "../../lib/LanguageContext";

interface CommentsModuleProps {
  comments: ProjectComment[];
  startups: Startup[];
  residents: Resident[];
  offices: Office[];
  onAddComment: (commentData: any) => Promise<any>;
  onUpdateComment: (id: string, updates: any) => Promise<any>;
  onDeleteComment: (id: string) => Promise<any>;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    avatarUrl?: string;
  } | null;
  userRole: UserRole | string;
  onSyncState?: () => void;
}

export default function CommentsModule({
  comments = [],
  startups = [],
  residents = [],
  offices = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  currentUser,
  userRole,
  onSyncState
}: CommentsModuleProps) {
  const { t } = useLanguage();

  const [showComposer, setShowComposer] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [editingComment, setEditingComment] = useState<ProjectComment | null>(null);
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState<"boosted" | "newest" | "active" | "priority">("boosted");
  const [showAiInsights, setShowAiInsights] = useState(false);

  const currentUserId = currentUser?.id || "u-1";
  const currentUserName = currentUser?.name || "Hasan Abdukarimov";
  const currentUserRole = currentUser?.role || userRole || "MANAGER";
  const currentUserAvatar = currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop";
  const currentUserDepartment = currentUser?.department || "Executive Office";

  // Handle boosting a comment
  const handleBoostComment = async (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    const boostedBy = target.boostedBy || [];
    const hasBoosted = boostedBy.includes(currentUserId);

    const updatedBoostedBy = hasBoosted
      ? boostedBy.filter((id) => id !== currentUserId)
      : [...boostedBy, currentUserId];

    const updatedBoostCount = Math.max(0, (target.boostCount || 0) + (hasBoosted ? -1 : 1));

    await onUpdateComment(commentId, {
      boostedBy: updatedBoostedBy,
      boostCount: updatedBoostCount,
    });
  };

  // Edit own comment (dormant menu item in CommentCard, wired up here)
  const handleEditComment = (comment: ProjectComment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleSaveEditedComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editContent.trim()) return;
    await onUpdateComment(editingComment.id, { content: editContent.trim() });
    setEditingComment(null);
    setEditContent("");
  };

  // Handle reactions
  const handleReaction = async (commentId: string, reactionType: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    const reactions = target.reactions || {};
    const currentList = reactions[reactionType] || [];
    const hasReacted = currentList.includes(currentUserId);

    const updatedList = hasReacted
      ? currentList.filter((id) => id !== currentUserId)
      : [...currentList, currentUserId];

    await onUpdateComment(commentId, {
      reactions: {
        ...reactions,
        [reactionType]: updatedList,
      },
    });
  };

  // Handle adding replies
  const handleAddReply = async (commentId: string, content: string, isOfficial?: boolean) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      commentId,
      authorId: currentUserId,
      authorName: currentUserName,
      authorRole: currentUserRole,
      authorAvatar: currentUserAvatar,
      authorDepartment: currentUserDepartment,
      content,
      createdAt: new Date().toISOString(),
      isOfficial: !!isOfficial,
      reactions: {},
    };

    const updatedReplies = [...(target.replies || []), newReply];
    await onUpdateComment(commentId, { replies: updatedReplies });
  };

  // Handle status update
  const handleUpdateStatus = async (commentId: string, status: CommentStatus) => {
    const updates: any = { status };
    if (status === "RESOLVED" || status === "IMPLEMENTED") {
      updates.resolvedAt = new Date().toISOString();
      updates.resolvedBy = currentUserId;
    }
    await onUpdateComment(commentId, updates);
  };

  // Handle toggling pin
  const handleTogglePin = async (commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;
    await onUpdateComment(commentId, { isPinned: !target.isPinned });
  };

  // Handle adding official response
  const handleAddOfficialResponse = async (commentId: string, responseText: string) => {
    await onUpdateComment(commentId, {
      isOfficialResponse: true,
      officialReplyText: responseText,
      officialReplyAuthor: `${currentUserName} (${currentUserDepartment || currentUserRole})`,
      officialReplyDate: new Date().toISOString(),
    });
  };

  // Handle new comment submission
  const handleCreateComment = async (data: {
    title: string;
    content: string;
    category: CommentCategory;
    priority: CommentPriority;
    targetEntity?: any;
    targetEntityId?: string;
    targetEntityName?: string;
    tags: string[];
  }) => {
    const newComment: Partial<ProjectComment> = {
      id: `com-${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      targetEntity: data.targetEntity,
      targetEntityId: data.targetEntityId,
      targetEntityName: data.targetEntityName,
      authorId: currentUserId,
      authorName: currentUserName,
      authorRole: currentUserRole,
      authorAvatar: currentUserAvatar,
      authorDepartment: currentUserDepartment,
      authorEmail: currentUser?.email || "user@itpark.uz",
      status: "OPEN",
      tags: data.tags,
      boostCount: 1,
      boostedBy: [currentUserId],
      reactions: {
        like: [currentUserId],
      },
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onAddComment(newComment);
    setShowComposer(false);
  };

  // Handle overall project boost from modal
  const handleBoostOverallProject = async (note: string, category: string) => {
    const boostComment: Partial<ProjectComment> = {
      id: `com-boost-${Date.now()}`,
      title: `Project Booster Pledged for ${category.toUpperCase()} 🚀`,
      content: note,
      category: category as any,
      priority: "HIGH",
      targetEntity: "project",
      targetEntityName: "IT Park Kashkadarya Ecosystem",
      authorId: currentUserId,
      authorName: currentUserName,
      authorRole: currentUserRole,
      authorAvatar: currentUserAvatar,
      authorDepartment: currentUserDepartment,
      status: "OPEN",
      tags: ["ProjectBooster", "Kashkadarya2026", "GrowthPledge"],
      boostCount: 5,
      boostedBy: [currentUserId],
      reactions: {
        boost: [currentUserId],
        like: [currentUserId],
      },
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onAddComment(boostComment);
  };

  // Filtered and Sorted Comments list
  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        // Category Filter
        if (selectedCategory !== "all" && c.category !== selectedCategory) {
          return false;
        }
        // Status Filter
        if (selectedStatus !== "all" && c.status !== selectedStatus) {
          return false;
        }
        // Priority Filter
        if (selectedPriority !== "all" && c.priority !== selectedPriority) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = c.title?.toLowerCase().includes(q);
          const matchContent = c.content?.toLowerCase().includes(q);
          const matchAuthor = c.authorName?.toLowerCase().includes(q);
          const matchEntity = c.targetEntityName?.toLowerCase().includes(q);
          const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchContent && !matchAuthor && !matchEntity && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        // Pinned always on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === "boosted") {
          return (b.boostCount || 0) - (a.boostCount || 0);
        }
        if (sortBy === "active") {
          return (b.replies?.length || 0) - (a.replies?.length || 0);
        }
        if (sortBy === "priority") {
          const pOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, ROUTINE: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [comments, selectedCategory, selectedStatus, selectedPriority, searchQuery, sortBy]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ["ID", "Title", "Category", "Author", "Role", "Status", "Priority", "Boosts", "Replies", "Created At"];
    const rows = filteredComments.map((c) => [
      c.id,
      `"${(c.title || "").replace(/"/g, '""')}"`,
      c.category,
      `"${c.authorName.replace(/"/g, '""')}"`,
      c.authorRole,
      c.status,
      c.priority,
      c.boostCount || 0,
      c.replies?.length || 0,
      c.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IT_Park_Comments_Discussions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="comments-module-root" className="space-y-6 max-w-full">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#74BD22]" />
              <span>Project Comments & Stakeholder Collaboration Hub</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#74BD22]/15 text-[#74BD22] border border-[#74BD22]/30 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>Project Boosters Live</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Community proposals, resident feedback, startup discussion threads, and executive directives to boost IT Park Kashkadarya.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAiInsights(!showAiInsights)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 cursor-pointer transition-all shadow-xs"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Sentiment Insights</span>
          </button>

          <button
            onClick={() => setShowBoostModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer shadow-md shadow-orange-500/20 transition-all scale-100 hover:scale-102"
          >
            <Rocket className="w-4 h-4 text-white" />
            <span>Boost Project 🚀</span>
          </button>

          <button
            onClick={() => setShowComposer(!showComposer)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#74BD22] hover:bg-[#62a31b] text-slate-950 cursor-pointer shadow-md shadow-emerald-500/20 transition-all scale-100 hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>{showComposer ? "Close Form" : "New Proposal / Comment"}</span>
          </button>
        </div>
      </div>

      {/* AI Sentiment & Community Summary Drawer */}
      {showAiInsights && (
        <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-slate-900/10 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-950/40 border border-indigo-500/30 rounded-2xl p-5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>AI Executive Synthesis of Stakeholder Feedback</span>
            </div>
            <button
              onClick={() => setShowAiInsights(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Top Community Demand:
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                84% of resident comments emphasize expanding fast-track digital 0% VAT customs certificates and BPO language camps.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#74BD22]"></span>
                Venture & Startup Momentum:
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                High boost velocity for the 500M UZS Agritech & AI seed matching fund for Qarshi and Shahrisabz university graduates.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Infrastructure Readiness:
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Tech Block B optical fiber upgrade is trending as priority requirement for upcoming European voice support contracts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Bar */}
      <CommentStatsBar 
        comments={comments} 
        onOpenQuickBoostModal={() => setShowBoostModal(true)} 
      />

      {/* Conditional Comment Composer */}
      {showComposer && (
        <CommentComposer
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserRole={currentUserRole}
          currentUserAvatar={currentUserAvatar}
          currentUserDepartment={currentUserDepartment}
          currentUserEmail={currentUser?.email}
          startups={startups}
          residents={residents}
          offices={offices}
          onSubmit={handleCreateComment}
          onCancel={() => setShowComposer(false)}
        />
      )}

      {/* Filter, Search & Sorting Bar */}
      <CommentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onExportCsv={handleExportCsv}
        onPrint={() => window.print()}
        totalResults={filteredComments.length}
      />

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserRole={currentUserRole}
              currentUserAvatar={currentUserAvatar}
              currentUserDepartment={currentUserDepartment}
              onBoost={handleBoostComment}
              onReaction={handleReaction}
              onAddReply={handleAddReply}
              onUpdateStatus={handleUpdateStatus}
              onTogglePin={handleTogglePin}
              onDeleteComment={onDeleteComment}
              onEditComment={handleEditComment}
              onAddOfficialResponse={handleAddOfficialResponse}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
              No comments or proposals found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                ? "Try adjusting your search filters or clear the active query."
                : "Be the first stakeholder to post a proposal and boost the project!"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedStatus("all");
                setSelectedPriority("all");
                setShowComposer(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#74BD22] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Project Booster</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Boost Modal */}
      <BoostProjectModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        comments={comments}
        currentUserName={currentUserName}
        onBoostOverallProject={handleBoostOverallProject}
      />

      {/* Edit Own Comment Modal */}
      {editingComment && (
        <div id="edit-comment-modal" className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{t("Edit Comment")}</h2>
              <button
                onClick={() => { setEditingComment(null); setEditContent(""); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditedComment} className="space-y-3.5 text-xs">
              {editingComment.title && (
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{editingComment.title}</p>
              )}
              <textarea
                id="edit-comment-textarea"
                required
                rows={6}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg text-xs"
              />
              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingComment(null); setEditContent(""); }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {t("Cancel")}
                </button>
                <button
                  id="submit-edit-comment-btn"
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  {t("Save Changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
