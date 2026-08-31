/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme, Theme } from "../lib/ThemeContext";
import { useLanguage } from "../lib/LanguageContext";

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export default function ThemeSwitcher({ compact = false, className = "" }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();

  const options: Array<{ value: Theme; label: string; icon: typeof Sun; title: string }> = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      title: t("Light Mode", "Light Mode")
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      title: t("Dark Mode", "Dark Mode")
    },
    {
      value: "system",
      label: "System",
      icon: Laptop,
      title: t("System Auto", "System Preference")
    }
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      id="theme-switcher-control"
      className={`inline-flex items-center p-0.5 rounded-lg border transition-colors ${
        resolvedTheme === "dark"
          ? "bg-slate-900 border-slate-750"
          : "bg-slate-100 border-slate-200"
      } ${className}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = theme === opt.value;

        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.value)}
            title={`${opt.title} (${opt.value === "system" ? `currently ${resolvedTheme}` : opt.value})`}
            className={`relative flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer select-none focus:outline-hidden focus:ring-1 focus:ring-emerald-500 ${
              isSelected
                ? resolvedTheme === "dark"
                  ? "bg-slate-800 text-emerald-400 shadow-xs border border-slate-700 font-extrabold"
                  : "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold"
                : resolvedTheme === "dark"
                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isSelected
                  ? resolvedTheme === "dark"
                    ? "text-emerald-400"
                    : "text-amber-500"
                  : "text-current opacity-70"
              }`}
            />
            {!compact && (
              <span className="hidden xl:inline text-[10px] tracking-tight">{opt.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
