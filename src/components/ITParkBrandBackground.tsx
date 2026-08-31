/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from "react";
import { useTheme } from "../lib/ThemeContext";

export type BrandBackgroundVariant = 
  | "executive" 
  | "analytics" 
  | "startups" 
  | "residents" 
  | "compliance" 
  | "regional" 
  | "default";

interface ITParkBrandBackgroundProps {
  variant?: BrandBackgroundVariant;
  className?: string;
  intensity?: "minimal" | "subtle" | "prominent";
}

/**
 * Official IT Park Uzbekistan Global Visual Background System
 * 
 * Multi-layer architecture:
 * Layer 1: Base application background (#F5F7FA in light mode, #0B1220 in dark mode)
 * Layer 2: Abstract brand geometry derived from the IT Park Uzbekistan symbol
 *          (120° branching angles, connected nodes, organic shield contours, tech lattice)
 * Layer 3: Soft ambient IT Park green (#74BD22) radial diffuse accents
 * Layer 4: Clear content surface isolation with zero layout disruption
 */
function ITParkBrandBackgroundComponent({
  variant = "default",
  className = "",
  intensity = "subtle"
}: ITParkBrandBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Official IT Park Brand Green
  const BRAND_GREEN = "#74BD22";

  // Visual opacity calibration
  const opacityMultiplier = intensity === "minimal" ? 0.6 : intensity === "prominent" ? 1.4 : 1.0;
  
  // Vector stroke and fill opacities (2-5% in light mode, 3-7% in dark mode)
  const lineOpacity = (isDark ? 0.055 : 0.035) * opacityMultiplier;
  const nodeOpacity = (isDark ? 0.08 : 0.05) * opacityMultiplier;
  const glowOpacity = (isDark ? 0.07 : 0.035) * opacityMultiplier;
  const gridOpacity = (isDark ? 0.025 : 0.018) * opacityMultiplier;

  return (
    <div
      id="itpark-global-brand-background"
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
    >
      {/* ====================================================================
          LAYER 1: AMBIENT BRAND GRADIENTS (IT PARK GREEN ACCENTS)
          ==================================================================== */}
      {/* Top-Right Ambient Glow */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full transition-opacity duration-700 blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${BRAND_GREEN} 0%, rgba(116, 189, 34, 0) 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Bottom-Left Ambient Glow */}
      <div
        className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full transition-opacity duration-700 blur-[140px]"
        style={{
          background: `radial-gradient(circle, ${BRAND_GREEN} 0%, rgba(16, 185, 129, 0) 70%)`,
          opacity: glowOpacity * 0.75,
        }}
      />

      {/* Center Subtle Diffuse (Only in Executive / Analytics) */}
      {(variant === "executive" || variant === "analytics") && (
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full transition-opacity duration-700 blur-[150px]"
          style={{
            background: `radial-gradient(ellipse, ${BRAND_GREEN} 0%, rgba(37, 99, 235, 0) 70%)`,
            opacity: glowOpacity * 0.4,
          }}
        />
      )}

      {/* ====================================================================
          LAYER 2: ABSTRACT IT PARK GEOMETRY & CONNECTIVITY NETWORK (SVG)
          ==================================================================== */}
      <svg
        className="w-full h-full absolute inset-0 hidden sm:block"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 1000"
      >
        <defs>
          {/* Subtle Grid Dot Pattern */}
          <pattern id="itpark-tech-dots" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle
              cx="24"
              cy="24"
              r="1"
              fill={isDark ? "#94a3b8" : "#475569"}
              opacity={gridOpacity}
            />
          </pattern>

          {/* Linear Brand Stroke Gradient */}
          <linearGradient id="brand-stroke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND_GREEN} stopOpacity={lineOpacity * 1.5} />
            <stop offset="50%" stopColor={isDark ? "#38bdf8" : "#0284c7"} stopOpacity={lineOpacity * 0.8} />
            <stop offset="100%" stopColor={BRAND_GREEN} stopOpacity={lineOpacity * 0.2} />
          </linearGradient>

          {/* Node Glow Filter */}
          <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Global Tech Dot Grid */}
        <rect width="100%" height="100%" fill="url(#itpark-tech-dots)" />

        {/* ------------------------------------------------------------------
            CORE ABSTRACT BRAND ELEMENTS (UNIVERSAL)
            Abstract fragments of IT Park symbol: branching Y-arms + nodes + curves
            ------------------------------------------------------------------ */}
        
        {/* Top-Right Signature IT Park Shield Contour Arc (Abstract Curve) */}
        <path
          d="M 1200 -50 C 1350 40 1520 180 1580 380 C 1640 580 1550 780 1380 920"
          fill="none"
          stroke={BRAND_GREEN}
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity={lineOpacity * 1.2}
        />

        <path
          d="M 1250 -30 C 1380 60 1530 190 1560 360 C 1590 530 1510 700 1350 820"
          fill="none"
          stroke={isDark ? "#60a5fa" : "#3b82f6"}
          strokeWidth="1"
          opacity={lineOpacity * 0.7}
        />

        {/* Bottom-Left Organic Counter-Shield Curve */}
        <path
          d="M -50 700 C 120 740 280 820 380 950 C 480 1080 490 1200 480 1300"
          fill="none"
          stroke={BRAND_GREEN}
          strokeWidth="1.5"
          opacity={lineOpacity * 1.1}
        />

        {/* ------------------------------------------------------------------
            IT PARK 120° BRANCHING CONNECTIVITY VECTORS & NODES
            Derived from the logo's inner human/network figure
            ------------------------------------------------------------------ */}
        {/* Cluster A: Upper East Network Node Hub (Symbolic Connectivity) */}
        <g opacity={lineOpacity * 1.5}>
          {/* Main Stem */}
          <line x1="1350" y1="120" x2="1350" y2="240" stroke={BRAND_GREEN} strokeWidth="1.2" />
          {/* 120° Left Branch */}
          <line x1="1350" y1="170" x2="1260" y2="120" stroke={BRAND_GREEN} strokeWidth="1.2" />
          {/* 120° Right Branch */}
          <line x1="1350" y1="170" x2="1440" y2="120" stroke={BRAND_GREEN} strokeWidth="1.2" />
          
          {/* Connectivity Nodes */}
          <circle cx="1350" cy="120" r="4" fill={BRAND_GREEN} opacity={nodeOpacity * 1.5} />
          <circle cx="1260" cy="120" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.5} />
          <circle cx="1440" cy="120" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.5} />
          <circle cx="1350" cy="240" r="3" fill={BRAND_GREEN} opacity={nodeOpacity * 1.2} />

          {/* Extended network rays */}
          <line x1="1260" y1="120" x2="1140" y2="90" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="1440" y1="120" x2="1540" y2="180" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx="1140" cy="90" r="2.5" fill={isDark ? "#38bdf8" : "#0284c7"} opacity={nodeOpacity} />
          <circle cx="1540" cy="180" r="2.5" fill={isDark ? "#38bdf8" : "#0284c7"} opacity={nodeOpacity} />
        </g>

        {/* Cluster B: Western Ecosystem Vector Web */}
        <g opacity={lineOpacity * 1.3}>
          <line x1="80" y1="320" x2="180" y2="380" stroke="url(#brand-stroke-grad)" strokeWidth="1" />
          <line x1="180" y1="380" x2="180" y2="480" stroke="url(#brand-stroke-grad)" strokeWidth="1" />
          <line x1="180" y1="380" x2="280" y2="330" stroke="url(#brand-stroke-grad)" strokeWidth="1" />
          
          <circle cx="80" cy="320" r="3" fill={BRAND_GREEN} opacity={nodeOpacity} />
          <circle cx="180" cy="380" r="4.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.4} />
          <circle cx="180" cy="480" r="3" fill={BRAND_GREEN} opacity={nodeOpacity} />
          <circle cx="280" cy="330" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity} />
        </g>

        {/* ------------------------------------------------------------------
            VARIANT-SPECIFIC REFINED GEOMETRY
            ------------------------------------------------------------------ */}
        
        {/* 1. EXECUTIVE VARIANT: Strategic Control Network & Concentric Focal Rings */}
        {variant === "executive" && (
          <g opacity={lineOpacity * 1.2}>
            {/* Concentric Horizon Arcs */}
            <circle cx="1500" cy="150" r="180" fill="none" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="4 6" />
            <circle cx="1500" cy="150" r="320" fill="none" stroke={BRAND_GREEN} strokeWidth="0.6" strokeDasharray="2 8" />
            <circle cx="1500" cy="150" r="460" fill="none" stroke={isDark ? "#94a3b8" : "#cbd5e1"} strokeWidth="0.5" strokeDasharray="1 10" />

            {/* Strategic Axis Vector */}
            <line x1="800" y1="0" x2="1500" y2="150" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="8 8" />
            <line x1="1500" y1="150" x2="1600" y2="600" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="6 6" />
          </g>
        )}

        {/* 2. ANALYTICS VARIANT: Telemetry Grid & Data Trajectories */}
        {variant === "analytics" && (
          <g opacity={lineOpacity * 1.1}>
            {/* Fine coordinate axes */}
            <path d="M 600 0 L 600 1000 M 1100 0 L 1100 1000" stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="0.5" strokeDasharray="4 12" />
            {/* Trend trajectory vector */}
            <path d="M 50 850 Q 400 750, 800 680 T 1550 420" fill="none" stroke={BRAND_GREEN} strokeWidth="1" strokeDasharray="5 7" />
            <circle cx="800" cy="680" r="3" fill={BRAND_GREEN} opacity={nodeOpacity} />
            <circle cx="1200" cy="540" r="3" fill={BRAND_GREEN} opacity={nodeOpacity} />
          </g>
        )}

        {/* 3. STARTUPS VARIANT: Growth Curves & Venture Nodes */}
        {variant === "startups" && (
          <g opacity={lineOpacity * 1.2}>
            {/* Exponential Growth Curve Vector */}
            <path d="M 100 900 Q 600 850, 1000 600 T 1550 150" fill="none" stroke={BRAND_GREEN} strokeWidth="1.2" />
            <path d="M 120 920 Q 620 870, 1020 620 T 1570 170" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="0.8" strokeDasharray="4 6" />
            <circle cx="1000" cy="600" r="4" fill={BRAND_GREEN} opacity={nodeOpacity * 1.5} />
            <circle cx="1300" cy="350" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.3} />
          </g>
        )}

        {/* 4. RESIDENTS VARIANT: Structured Enterprise Grid Matrix */}
        {variant === "residents" && (
          <g opacity={lineOpacity * 1.1}>
            {/* Enterprise Cluster Matrix */}
            <rect x="1250" y="350" width="120" height="120" rx="8" fill="none" stroke={BRAND_GREEN} strokeWidth="0.8" strokeDasharray="3 5" />
            <rect x="1390" y="350" width="120" height="120" rx="8" fill="none" stroke={isDark ? "#60a5fa" : "#3b82f6"} strokeWidth="0.8" strokeDasharray="3 5" />
            <line x1="1370" y1="410" x2="1390" y2="410" stroke={BRAND_GREEN} strokeWidth="1" />
          </g>
        )}

        {/* 5. COMPLIANCE VARIANT: Restrained, Formal, High-Precision Baseline */}
        {variant === "compliance" && (
          <g opacity={lineOpacity * 0.8}>
            {/* Clean orthogonal precision guidelines */}
            <line x1="0" y1="120" x2="1600" y2="120" stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="0.5" strokeDasharray="2 10" />
            <line x1="0" y1="880" x2="1600" y2="880" stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="0.5" strokeDasharray="2 10" />
          </g>
        )}

        {/* 6. REGIONAL VARIANT: Kashkadarya District Network Topology */}
        {variant === "regional" && (
          <g opacity={lineOpacity * 1.3}>
            {/* Network linking regional district nodes (Qarshi, Shahrisabz, Kitob, Koson, Guzor, Yakkabog) */}
            <path d="M 400 350 L 520 280 L 680 320 L 620 450 L 480 490 Z" fill="none" stroke={BRAND_GREEN} strokeWidth="1" strokeDasharray="4 6" />
            <line x1="520" y1="280" x2="620" y2="450" stroke={BRAND_GREEN} strokeWidth="0.8" />
            
            {/* District Hub Nodes */}
            <circle cx="400" cy="350" r="4" fill={BRAND_GREEN} opacity={nodeOpacity * 1.6} />
            <circle cx="520" cy="280" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.4} />
            <circle cx="680" cy="320" r="4" fill={BRAND_GREEN} opacity={nodeOpacity * 1.6} />
            <circle cx="620" cy="450" r="5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.8} />
            <circle cx="480" cy="490" r="3.5" fill={BRAND_GREEN} opacity={nodeOpacity * 1.4} />
          </g>
        )}
      </svg>
    </div>
  );
}

export default memo(ITParkBrandBackgroundComponent);
