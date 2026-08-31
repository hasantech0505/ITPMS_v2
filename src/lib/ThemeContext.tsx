/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ChartThemeTokens {
  background: string;
  grid: string;
  axis: string;
  text: string;
  mutedText: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipShadow: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  indigo: string;
  purple: string;
  emerald: string;
  amber: string;
  rose: string;
  cyan: string;
}

const LIGHT_CHART_THEME: ChartThemeTokens = {
  background: "#ffffff",
  grid: "#e2e8f0",
  axis: "#64748b",
  text: "#0f172a",
  mutedText: "#94a3b8",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e2e8f0",
  tooltipText: "#0f172a",
  tooltipShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  primary: "#10b981",
  secondary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#0284c7",
  indigo: "#6366f1",
  purple: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  cyan: "#06b6d4",
};

const DARK_CHART_THEME: ChartThemeTokens = {
  background: "#111827",
  grid: "#1e293b",
  axis: "#94a3b8",
  text: "#f8fafc",
  mutedText: "#64748b",
  tooltipBg: "#182235",
  tooltipBorder: "#334155",
  tooltipText: "#f8fafc",
  tooltipShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
  primary: "#34d399",
  secondary: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#38bdf8",
  indigo: "#818cf8",
  purple: "#a78bfa",
  emerald: "#34d399",
  amber: "#fbbf24",
  rose: "#fb7185",
  cyan: "#22d3ee",
};

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  chartTheme: ChartThemeTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "itpms_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1. Initial State from localStorage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  });

  // 2. Resolve actual theme (light vs dark) based on system preference
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // 3. Listen to OS / Browser dark mode preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // Legacy fallback
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // 4. Calculate resolvedTheme
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === "system") {
      return systemPreference;
    }
    return theme;
  }, [theme, systemPreference]);

  // 5. Update DOM classes, dataset, and color-scheme
  useEffect(() => {
    const root = document.documentElement;
    
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
  }, [resolvedTheme]);

  // 6. Set theme handler with persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Failed to persist theme in localStorage", e);
    }
  };

  // 7. Toggle between light and dark
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // 8. Chart tokens based on resolved theme
  const chartTheme = useMemo(() => {
    return resolvedTheme === "dark" ? DARK_CHART_THEME : LIGHT_CHART_THEME;
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        chartTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
