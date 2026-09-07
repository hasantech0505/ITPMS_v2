/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shared derivations for the CRM module.
 *
 * The old module showed status and left you to work out what to do about it.
 * These helpers turn the stored fields into the two questions that actually
 * matter: who has never been answered, and who is stalled with no agreed next
 * step. Every screen reads from here so the numbers on Today, on the pipeline
 * cards and in the table can never disagree with each other.
 */

import { Company, Contact, Meeting, Task } from "../../types";

/** The four stages a lead moves through, in order. */
export type PipelineStage = "NEW" | "CONTACTED" | "IN_TALKS" | "PARTNER";

export const PIPELINE_STAGES: { key: PipelineStage; label: string; accent: string; chipBg: string; chipText: string; chipBorder: string }[] = [
  { key: "NEW",       label: "New lead",  accent: "#94a3b8", chipBg: "#f1f5f9", chipText: "#475569", chipBorder: "#e2e8f0" },
  { key: "CONTACTED", label: "Contacted", accent: "#0284c7", chipBg: "#f0f9ff", chipText: "#075985", chipBorder: "#bae6fd" },
  { key: "IN_TALKS",  label: "In talks",  accent: "#f59e0b", chipBg: "#fffbeb", chipText: "#92400e", chipBorder: "#fde68a" },
  { key: "PARTNER",   label: "Partner",   accent: "#10b981", chipBg: "#ecfdf5", chipText: "#065f46", chipBorder: "#a7f3d0" },
];

/** Company.status is the stored value; the pipeline is what we show. */
export function stageOf(company: Company): PipelineStage {
  switch (company.status) {
    case "PARTNER": return "PARTNER";
    case "NEGOTIATION": return "IN_TALKS";
    case "CONTACTED": return "CONTACTED";
    default: return "NEW"; // LEAD and INACTIVE both start on the left
  }
}

/** Writing back: the pipeline stage a user picks maps to a stored status. */
export function statusForStage(stage: PipelineStage): Company["status"] {
  switch (stage) {
    case "PARTNER": return "PARTNER";
    case "IN_TALKS": return "NEGOTIATION";
    case "CONTACTED": return "CONTACTED";
    default: return "LEAD";
  }
}

export function stageMeta(stage: PipelineStage) {
  return PIPELINE_STAGES.find((s) => s.key === stage) || PIPELINE_STAGES[0];
}

/** Whole days between an ISO-ish date string and today. Null when unparseable. */
export function daysSince(dateStr?: string): number | null {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
}

/** "3 days ago", "Never", "Today" — for the last-contact column. */
export function describeLastContact(dateStr?: string): string {
  const d = daysSince(dateStr);
  if (d === null) return "Never";
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 14) return `${d} days ago`;
  if (d < 60) return `${Math.floor(d / 7)} weeks ago`;
  return `${Math.floor(d / 30)} months ago`;
}

/**
 * Queue 1: nobody has answered these yet. A lead sitting at NEW with no recorded
 * contact date is someone we imported and then forgot.
 */
export function needsFirstResponse(company: Company): boolean {
  return stageOf(company) === "NEW" && !company.lastContactedDate;
}

/** A company has a next step if someone wrote down what it is, or when it is. */
export function hasNextStep(company: Company): boolean {
  return Boolean((company.nextStep && company.nextStep.trim()) || company.nextFollowUpDate);
}

/**
 * Queue 2: we spoke to them and then nothing was agreed. This is the group that
 * explains "22 contacted, 0 advanced" -- they are not lost, they are unattended.
 */
export function isStalled(company: Company): boolean {
  const stage = stageOf(company);
  return (stage === "CONTACTED" || stage === "IN_TALKS") && !hasNextStep(company);
}

/** Days of silence, used to sort the stalled queue worst-first. */
export function silentDays(company: Company): number {
  return daysSince(company.lastContactedDate) ?? Number.MAX_SAFE_INTEGER;
}

/** What the "Next step" column shows, and whether it should look urgent. */
export function nextStepLabel(company: Company): { text: string; tone: "ok" | "warn" | "danger" } {
  if (needsFirstResponse(company)) return { text: "First contact overdue", tone: "danger" };
  if (company.nextStep && company.nextStep.trim()) {
    return { text: company.nextStep.trim(), tone: "ok" };
  }
  if (company.nextFollowUpDate) {
    return { text: `Follow up ${formatShortDate(company.nextFollowUpDate)}`, tone: "ok" };
  }
  const d = daysSince(company.lastContactedDate);
  return { text: d === null ? "Not set" : `Not set · silent ${d} days`, tone: "warn" };
}

export function formatShortDate(dateStr?: string): string {
  if (!dateStr) return "";
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return dateStr;
  return dt.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** Two-letter badge for a company or person, so rows are scannable. */
export function initialsOf(name: string): string {
  const parts = (name || "").trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Contact data quality.
 *
 * Imports put job titles and meeting summaries into the name field, so the list
 * ended up showing "DATA INGENER" and "HEAD OF PROJECTS | SENIOR LECTURER ON IT
 * LAW" as if they were people. Rather than render those as names, we flag them
 * and offer a fix. Deliberately conservative: it is better to miss a bad record
 * than to tell someone their real name is wrong.
 */
const ROLE_WORDS = [
  "head of", "senior", "lecturer", "engineer", "ingener", "manager", "director",
  "team", "summary", "department", "ceo", "cto", "coo", "founder", "specialist",
  "developer", "analyst", "consultant", "officer", "president", "sales",
  "marketing", "recruiter", "project", "meeting",
];

export function contactNameLooksWrong(contact: Contact): boolean {
  const name = (contact.fullName || "").trim();
  if (!name) return true;
  if (name.includes("|")) return true;            // two titles joined together
  if (name.length > 40) return true;              // a sentence, not a name
  if (/[0-9@]/.test(name)) return true;           // an id or an email
  const lower = name.toLowerCase();
  if (ROLE_WORDS.some((w) => lower.includes(w))) return true;
  if (contact.role && lower === contact.role.trim().toLowerCase()) return true;
  return false;
}

/** A note that is really a meeting write-up, so we can offer to move it. */
export function noteLooksLikeMeeting(note: string): boolean {
  const n = (note || "").toLowerCase();
  return n.includes("during the meeting") || n.includes("meeting summary") || n.includes("the conversation focused");
}

export function countContactsNeedingFix(contacts: Contact[]): number {
  return contacts.filter(contactNameLooksWrong).length;
}

/** Companies grouped for the pipeline cards. */
export function stageCounts(companies: Company[]): Record<PipelineStage, number> {
  const counts: Record<PipelineStage, number> = { NEW: 0, CONTACTED: 0, IN_TALKS: 0, PARTNER: 0 };
  companies.forEach((c) => { counts[stageOf(c)] += 1; });
  return counts;
}

/** One merged, newest-first stream of everything that happened with a company. */
export interface ActivityEntry {
  id: string;
  kind: "meeting" | "task" | "note";
  title: string;
  detail: string;
  date: string;
  overdue?: boolean;
}

export function activityFor(companyId: string, meetings: Meeting[], tasks: Task[], contacts: Contact[]): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  meetings.filter((m) => m.companyId === companyId).forEach((m) => {
    entries.push({
      id: m.id,
      kind: "meeting",
      title: m.title || "Meeting",
      detail: `${m.status === "SCHEDULED" ? "Scheduled" : m.status === "COMPLETED" ? "Held" : "Cancelled"} · ${formatShortDate(m.dateTime)}`,
      date: m.dateTime,
    });
  });

  tasks.filter((t) => t.companyId === companyId).forEach((t) => {
    const overdue = t.status !== "DONE" && (daysSince(t.dueDate) ?? -1) > 0;
    entries.push({
      id: t.id,
      kind: "task",
      title: t.title,
      detail: `Task · due ${formatShortDate(t.dueDate)}${t.assignedTo ? ` · ${t.assignedTo}` : ""}`,
      date: t.dueDate,
      overdue,
    });
  });

  contacts.filter((c) => c.companyId === companyId && c.notes && c.notes.trim()).forEach((c) => {
    entries.push({
      id: `note-${c.id}`,
      kind: "note",
      title: `Note about ${contactNameLooksWrong(c) ? c.companyName || "this company" : c.fullName}`,
      detail: c.notes.trim(),
      date: "",
    });
  });

  return entries.sort((a, b) => {
    const at = new Date(a.date).getTime();
    const bt = new Date(b.date).getTime();
    if (Number.isNaN(at) && Number.isNaN(bt)) return 0;
    if (Number.isNaN(at)) return 1;
    if (Number.isNaN(bt)) return -1;
    return bt - at;
  });
}
