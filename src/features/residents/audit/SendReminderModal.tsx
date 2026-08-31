/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Send, Bell, Mail, MessageSquare, Smartphone, Check } from "lucide-react";
import { ResidentAudit, AuditNotification, NotificationTriggerType } from "./auditTypes";

interface SendReminderModalProps {
  audit: ResidentAudit;
  onClose: () => void;
  onSend: (notification: Omit<AuditNotification, "id" | "sentAt" | "deliveryStatus">) => Promise<void>;
}

export default function SendReminderModal({
  audit,
  onClose,
  onSend
}: SendReminderModalProps) {
  const [channel, setChannel] = useState<"EMAIL" | "TELEGRAM" | "PORTAL">("EMAIL");
  const [template, setTemplate] = useState<NotificationTriggerType>("DEADLINE_REMINDER_14D");
  const [recipient, setRecipient] = useState(
    channel === "EMAIL" 
      ? (audit.residentEmail || "director@company.uz") 
      : (audit.residentPhone || "+998 75 221 0000")
  );
  const [subject, setSubject] = useState(`[IT Park Kashkadarya] Annual Audit ${audit.reportingYear} Submission Notice`);
  const [message, setMessage] = useState(
    `Dear Resident Company Management,\n\nThis is an official notice regarding the statutory annual audit submission for the ${audit.reportingYear} reporting period. The regulatory due date is ${audit.dueDate}.\n\nPlease ensure your certified independent audit report and auditor's opinion are uploaded through the IT Park Resident Portal.\n\nBest regards,\nIT Park Kashkadarya Regional Directorate`
  );
  const [isSending, setIsSending] = useState(false);

  const handleTemplateChange = (tpl: NotificationTriggerType) => {
    setTemplate(tpl);
    if (tpl === "DEADLINE_REMINDER_30D") {
      setSubject(`[IT Park Reminder] 30 Days Remaining: Annual Audit Report ${audit.reportingYear}`);
      setMessage(
        `Dear ${audit.companyName} Management,\n\nWe would like to remind you that the annual audit report for the ${audit.reportingYear} financial year is due in 30 days on ${audit.dueDate}.\n\nPlease prepare the independent audit review with your certified audit firm.`
      );
    } else if (tpl === "DEADLINE_REMINDER_14D") {
      setSubject(`[URGENT] 14 Days Remaining: Annual Audit ${audit.reportingYear} Deadline`);
      setMessage(
        `Urgent Reminder for ${audit.companyName}:\n\nYour annual audit report for the ${audit.reportingYear} cycle is due in 14 days on ${audit.dueDate}. Failure to submit by the deadline may trigger compliance review and risk status elevation.`
      );
    } else if (tpl === "OVERDUE_ALERT") {
      setSubject(`[STATUTORY OVERDUE NOTICE] Delinquent Annual Audit Report ${audit.reportingYear}`);
      setMessage(
        `OFFICIAL NOTICE OF NON-COMPLIANCE:\n\nThe annual audit submission for ${audit.companyName} regarding reporting year ${audit.reportingYear} was due on ${audit.dueDate} and is currently OVERDUE.\n\nImmediate submission is required within 5 business days to prevent administrative sanction or resident certificate suspension review.`
      );
    } else if (tpl === "RETURNED_NOTICE") {
      setSubject(`[Action Required] Corrective Resubmission Requested: Audit ${audit.reportingYear}`);
      setMessage(
        `Dear ${audit.companyName},\n\nYour submitted ${audit.reportingYear} audit package has been returned for correction. Please review the specific deficiencies in the portal and provide the updated documents before the resubmission deadline.`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await onSend({
        auditId: audit.id,
        type: template,
        recipient: recipient.trim(),
        subject: subject.trim(),
        message: message.trim(),
        channel,
        relatedAuditStatus: audit.status
      });
      onClose();
    } catch (err) {
      console.error("Failed to dispatch reminder:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div 
      id="send-reminder-modal"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Dispatch Compliance Reminder
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                {audit.companyName} • Due: {audit.dueDate} • Status: {audit.status}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => { setChannel("EMAIL"); setRecipient(audit.residentEmail || "director@company.uz"); }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              channel === "EMAIL"
                ? "bg-blue-50 border-blue-400 text-blue-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => { setChannel("TELEGRAM"); setRecipient(audit.residentPhone || "+998 90 123 4567"); }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              channel === "TELEGRAM"
                ? "bg-sky-50 border-sky-400 text-sky-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Telegram Bot</span>
          </button>

          <button
            type="button"
            onClick={() => { setChannel("PORTAL"); setRecipient("Resident Portal Workspace"); }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              channel === "PORTAL"
                ? "bg-purple-50 border-purple-400 text-purple-800 shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Portal Alert</span>
          </button>
        </div>

        {/* Template selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Notice Template
          </label>
          <select
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value as NotificationTriggerType)}
            className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
          >
            <option value="DEADLINE_REMINDER_30D">30-Day Standard Deadline Reminder</option>
            <option value="DEADLINE_REMINDER_14D">14-Day Urgent Reminder</option>
            <option value="OVERDUE_ALERT">Statutory Overdue Sanction Warning</option>
            <option value="RETURNED_NOTICE">Correction & Deficiencies Follow-up</option>
            <option value="CUSTOM_REMINDER">Custom Notification</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Recipient Destination *
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Subject Line *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Message Body *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Sending..." : "Dispatch Notice"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
