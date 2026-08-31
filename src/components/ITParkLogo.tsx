/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import itparkIconUrl from "../assets/itpark-icon.png";

export type ITParkLogoVariant = "full" | "symbol" | "badge" | "regional" | "horizontal";

interface ITParkLogoProps {
  className?: string;
  variant?: ITParkLogoVariant;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  subtext?: string;
  isDark?: boolean;
}

/**
 * Official IT Park Uzbekistan Vector Logo Component
 * Faithfully reproduces the official brand mark:
 * 1. Organic bright green (#74BD22 / #76BC21) shield/leaf symbol
 * 2. Inner white human/network figure with head circle and node-tipped raised arms
 * 3. Official wordmark: "IT PARK" in bold graphite + "UZBEKISTAN" in green pill badge
 */
export default function ITParkLogo({
  className = "",
  variant = "full",
  size = "md",
  subtext,
  isDark
}: ITParkLogoProps) {
  // Dimension sizing maps
  const symbolSizeMap = {
    xs: { w: 24, h: 20, text: "text-xs", badge: "text-[8px] py-0.5 px-1.5" },
    sm: { w: 32, h: 26, text: "text-sm", badge: "text-[9px] py-0.5 px-2" },
    md: { w: 42, h: 35, text: "text-base", badge: "text-[10px] py-0.5 px-2.5" },
    lg: { w: 56, h: 46, text: "text-xl", badge: "text-xs py-1 px-3" },
    xl: { w: 76, h: 63, text: "text-2xl", badge: "text-sm py-1 px-3.5" },
  };

  const { w, h, text, badge } = symbolSizeMap[size] || symbolSizeMap.md;

  // The authentic IT Park brand green hex
  const BRAND_GREEN = "#74BD22";
  const CHARCOAL = "#27292D";

  // Official IT Park Uzbekistan symbol (real brand artwork, not a redrawn approximation)
  const SymbolSvg = (
    <img
      src={itparkIconUrl}
      width={w}
      height={h}
      alt="IT Park Symbol"
      className="shrink-0 drop-shadow-xs object-contain"
      style={{ width: w, height: "auto" }}
    />
  );

  if (variant === "symbol") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {SymbolSvg}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 ${className}`}>
        {SymbolSvg}
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-xs text-slate-900 dark:text-white uppercase font-sans">
            IT PARK
          </span>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
            {subtext || "UZBEKISTAN"}
          </span>
        </div>
      </div>
    );
  }

  // Full / Horizontal / Regional Wordmark
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {SymbolSvg}

      <div className="flex flex-col leading-none">
        {/* Main "IT PARK" Header */}
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight font-sans ${text} ${
              isDark ? "text-white" : "text-slate-900 dark:text-white"
            }`}
            style={{ letterSpacing: "-0.03em" }}
          >
            IT PARK
          </span>
        </div>

        {/* Official "UZBEKISTAN" green pill badge or regional subtext */}
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={`inline-block font-extrabold text-white uppercase rounded-md tracking-wider ${badge}`}
            style={{ backgroundColor: BRAND_GREEN }}
          >
            UZBEKISTAN
          </span>

          {variant === "regional" && (
            <span className="text-[10px] font-bold tracking-tight text-slate-500 dark:text-slate-400 uppercase font-mono pl-0.5">
              • {subtext || "KASHKADARYA"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
