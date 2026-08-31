import React, { useState } from "react";
import { 
  Rocket, 
  ThumbsUp, 
  Lightbulb, 
  CheckCircle2, 
  Pin, 
  MessageSquare, 
  CornerDownRight, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Tag, 
  Clock, 
  Building2, 
  Building, 
  Users, 
  Calendar,
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ProjectComment, CommentReply, CommentStatus, CommentPriority, UserRole } from "../../../types";

interface CommentCardProps {
  key?: React.Key;
  comment: ProjectComment;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: UserRole | string;
  currentUserAvatar?: string;
  currentUserDepartment?: string;
  onBoost: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: string) => void;
  onAddReply: (commentId: string, content: string, isOfficial?: boolean) => void;
  onUpdateStatus: (commentId: string, status: CommentStatus) => void;
  onTogglePin?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (comment: ProjectComment) => void;
  onAddOfficialResponse?: (commentId: string, responseText: string) => void;
}

export default function CommentCard({
  comment,
  currentUserId,
  currentUserName,
  currentUserRole,
  currentUserAvatar,
  currentUserDepartment,
  onBoost,
  onReaction,
  onAddReply,
  onUpdateStatus,
  onTogglePin,
  onDeleteComment,
  onEditComment,
  onAddOfficialResponse,
}: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(true);
  const [replyInput, setReplyInput] = useState("");
  const [isOfficialReply, setIsOfficialReply] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showOfficialModal, setShowOfficialModal] = useState(false);
  const [officialText, setOfficialText] = useState("");

  const isAuthor = comment.authorId === currentUserId;
  const isAdmin = currentUserRole === "SUPER_ADMIN";
  const hasBoosted = comment.boostedBy?.includes(currentUserId);
  const totalReplies = comment.replies?.length || 0;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    onAddReply(comment.id, replyInput.trim(), isOfficialReply && isAdmin);
    setReplyInput("");
    setIsOfficialReply(false);
    setShowReplies(true);
  };

  const handleSaveOfficialResponse = () => {
    if (!officialText.trim() || !onAddOfficialResponse) return;
    onAddOfficialResponse(comment.id, officialText.trim());
    setShowOfficialModal(false);
    setOfficialText("");
  };

  const getPriorityBadge = (priority: CommentPriority) => {
    switch (priority) {
      case "CRITICAL":
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Critical Priority</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">High Priority</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Routine</span>;
    }
  };

  const getStatusBadge = (status: CommentStatus) => {
    switch (status) {
      case "IMPLEMENTED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-[#74BD22]/15 text-[#74BD22] border border-[#74BD22]/30"><CheckCircle2 className="w-3 h-3" /> Implemented</span>;
      case "RESOLVED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"><Check className="w-3 h-3" /> Resolved</span>;
      case "PLANNED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"><Clock className="w-3 h-3" /> Planned</span>;
      case "UNDER_REVIEW":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"><AlertCircle className="w-3 h-3" /> Under Review</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">Open</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "startups": return <Rocket className="w-3.5 h-3.5 text-orange-500" />;
      case "residents": return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "infrastructure": return <Building className="w-3.5 h-3.5 text-blue-500" />;
      case "talent": return <Users className="w-3.5 h-3.5 text-purple-500" />;
      case "events": return <Calendar className="w-3.5 h-3.5 text-pink-500" />;
      case "ideas": return <Lightbulb className="w-3.5 h-3.5 text-amber-500" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div 
      id={`comment-card-${comment.id}`}
      className={`bg-white dark:bg-slate-900 border rounded-xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-md relative ${
        comment.isPinned 
          ? "border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10" 
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* Pinned Marker */}
      {comment.isPinned && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-[#74BD22] mb-3 pb-2 border-b border-emerald-500/20">
          <Pin className="w-3.5 h-3.5 rotate-45" />
          <span>Pinned Strategic Directive / Executive Focus</span>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {comment.authorAvatar ? (
            <img 
              src={comment.authorAvatar} 
              alt={comment.authorName} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
              {comment.authorName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {comment.authorName}
              </span>

              {/* Role badge */}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {comment.authorRole}
              </span>

              {comment.authorDepartment && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  • {comment.authorDepartment}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 capitalize">
                {getCategoryIcon(comment.category)}
                {comment.category}
              </span>
            </div>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2">
          {getPriorityBadge(comment.priority)}

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={!isAdmin && !isAuthor}
              className={`cursor-pointer ${!isAdmin && !isAuthor ? "cursor-default" : "hover:opacity-80"}`}
              title={isAdmin || isAuthor ? "Click to change status" : ""}
            >
              {getStatusBadge(comment.status)}
            </button>

            {showStatusMenu && (isAdmin || isAuthor) && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-30">
                {(["OPEN", "UNDER_REVIEW", "PLANNED", "IMPLEMENTED", "RESOLVED"] as CommentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      onUpdateStatus(comment.id, st);
                      setShowStatusMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>{st.replace("_", " ")}</span>
                    {comment.status === st && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActionMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-30 text-xs">
                {isAdmin && onTogglePin && (
                  <button
                    onClick={() => {
                      onTogglePin(comment.id);
                      setShowActionMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Pin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{comment.isPinned ? "Unpin Directive" : "Pin Directive"}</span>
                  </button>
                )}

                {isAdmin && onAddOfficialResponse && (
                  <button
                    onClick={() => {
                      setShowOfficialModal(true);
                      setShowActionMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-emerald-600 dark:text-[#74BD22] font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Response</span>
                  </button>
                )}

                {isAuthor && onEditComment && (
                  <button
                    onClick={() => {
                      onEditComment(comment);
                      setShowActionMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Post</span>
                  </button>
                )}

                {(isAdmin || isAuthor) && onDeleteComment && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this discussion thread?")) {
                        onDeleteComment(comment.id);
                      }
                      setShowActionMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 font-semibold border-t border-slate-100 dark:border-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Discussion</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Comment Content */}
      <div className="mt-3.5 space-y-2">
        {comment.title && (
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
            {comment.title}
          </h3>
        )}

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {comment.content}
        </p>

        {/* Linked Entity Pill */}
        {comment.targetEntityName && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-slate-400 uppercase font-mono">Linked Entity:</span>
            <span>{comment.targetEntityName}</span>
          </div>
        )}

        {/* Tags */}
        {comment.tags && comment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {comment.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                <span>{tag.startsWith("#") ? tag : `#${tag}`}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Official IT Park Administration Response Banner */}
      {comment.isOfficialResponse && comment.officialReplyText && (
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#74BD22]/10 to-teal-500/10 border border-[#74BD22]/30 text-xs">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-[#74BD22]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official IT Park Administration Response</span>
            </div>
            {comment.officialReplyDate && (
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(comment.officialReplyDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <p className="text-slate-800 dark:text-slate-200 font-medium">
            {comment.officialReplyText}
          </p>
          {comment.officialReplyAuthor && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              — {comment.officialReplyAuthor}
            </div>
          )}
        </div>
      )}

      {/* Bottom Bar: Boost Button & Reactions & Reply Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Boost Button */}
          <button
            id={`boost-btn-${comment.id}`}
            onClick={() => onBoost(comment.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
              hasBoosted
                ? "bg-[#74BD22] text-slate-950 font-black shadow-emerald-500/20 scale-102"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-[#74BD22]/15 hover:text-[#74BD22] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <Rocket className={`w-3.5 h-3.5 ${hasBoosted ? "animate-bounce text-slate-950" : "text-[#74BD22]"}`} />
            <span>{hasBoosted ? "Boosted!" : "Boost Project"}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${hasBoosted ? "bg-slate-950 text-[#74BD22]" : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"}`}>
              {comment.boostCount || 0}
            </span>
          </button>

          {/* Quick Reaction Pills */}
          <button
            onClick={() => onReaction(comment.id, "like")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
          >
            <ThumbsUp className="w-3 h-3 text-blue-500" />
            <span>Support</span>
            {comment.reactions?.like?.length ? (
              <span className="text-[10px] text-slate-400 font-mono">({comment.reactions.like.length})</span>
            ) : null}
          </button>

          <button
            onClick={() => onReaction(comment.id, "idea")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <span>Great Idea</span>
            {comment.reactions?.idea?.length ? (
              <span className="text-[10px] text-slate-400 font-mono">({comment.reactions.idea.length})</span>
            ) : null}
          </button>
        </div>

        {/* Replies Toggle */}
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer px-2 py-1 rounded-md"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{totalReplies} {totalReplies === 1 ? "Reply" : "Replies"}</span>
          {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Threaded Replies Section */}
      {showReplies && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 bg-slate-50/50 dark:bg-slate-950/30 -mx-4 -mb-4 p-4 rounded-b-xl">
          {comment.replies && comment.replies.length > 0 ? (
            comment.replies.map((reply) => (
              <div 
                key={reply.id} 
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  reply.isOfficial 
                    ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {reply.authorAvatar ? (
                      <img src={reply.authorAvatar} alt={reply.authorName} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {reply.authorName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white">{reply.authorName}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {reply.authorRole}
                    </span>
                    {reply.isOfficial && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#74BD22]/20 text-[#74BD22] border border-[#74BD22]/30 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> Official
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(reply.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pl-8 leading-relaxed">
                  {reply.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-xs text-slate-400">
              No replies yet. Be the first to join the conversation and boost this initiative!
            </div>
          )}

          {/* Reply Composer Input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Write a response to boost this proposal..."
                className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#74BD22]"
              />
            </div>

            {isAdmin && (
              <label className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isOfficialReply}
                  onChange={(e) => setIsOfficialReply(e.target.checked)}
                  className="rounded text-[#74BD22] focus:ring-0"
                />
                <span>Official Tag</span>
              </label>
            )}

            <button
              type="submit"
              disabled={!replyInput.trim()}
              className="px-3 py-2 bg-[#74BD22] hover:bg-[#62a31b] disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      )}

      {/* Official Response Modal (for Admins) */}
      {showOfficialModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-[#74BD22]" />
                <span>Publish Official IT Park Administration Response</span>
              </div>
              <button 
                onClick={() => setShowOfficialModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              This response will appear in a prominent verified executive banner on this discussion thread.
            </p>

            <textarea
              rows={4}
              value={officialText}
              onChange={(e) => setOfficialText(e.target.value)}
              placeholder="e.g. Approved during the regional board session. Implementation timeline scheduled for Q3 2026..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74BD22]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowOfficialModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOfficialResponse}
                disabled={!officialText.trim()}
                className="px-4 py-2 text-xs font-bold bg-[#74BD22] hover:bg-[#62a31b] disabled:opacity-40 text-slate-950 rounded-lg cursor-pointer shadow-md"
              >
                Publish Verified Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
