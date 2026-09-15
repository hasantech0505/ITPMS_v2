/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reusable collapsible section wrapper, used on the Executive Dashboard to
 * declutter a long stack of cards: related cards are grouped under one
 * header that is collapsed by default, with a one-line description (and an
 * optional stat chip) so the user knows what's inside before opening it.
 * Nothing is removed from the dashboard - it's just hidden until asked for.
 */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  description: string;
  meta?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  description,
  meta,
  defaultOpen = false,
  children
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-slate-50/80 transition-colors"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {meta && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1 whitespace-nowrap">
              {meta}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-6 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}
