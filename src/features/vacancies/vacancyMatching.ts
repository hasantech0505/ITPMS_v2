/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ---------------------------------------------------------------------------
// Deterministic Talent <-> Vacancy matching
// ---------------------------------------------------------------------------
// This module is imported by BOTH the frontend (VacanciesModule.tsx, the
// matching-candidates panel) and the backend (server/services/ai.service.ts,
// which phrases these facts into a natural-language explanation but must
// never invent or adjust the numbers itself). Keep this file framework-free
// (no React, no DOM) so it works from either side, mirroring how
// src/utils/districtFromAddress.ts is already shared the same way.
//
// The score starts at 100 and only ever goes down - every deduction traces
// to a concrete, explainable fact (a missing required skill, an English gap,
// a seniority shortfall) so the breakdown returned alongside the score can be
// shown to a manager or handed to the AI explainer verbatim, never re-derived.

import type { Talent, Vacancy, VacancySeniority, LanguageProficiencyLevel } from "../../types";

const LANGUAGE_LEVEL_ORDER: LanguageProficiencyLevel[] = ["None", "A1", "A2", "B1", "B2", "C1", "C2", "Native"];

function languageLevelRank(level: LanguageProficiencyLevel | undefined): number {
  if (!level) return 0;
  const idx = LANGUAGE_LEVEL_ORDER.indexOf(level);
  return idx === -1 ? 0 : idx;
}

// Minimum years of professional/academic-project experience a seniority band
// implies, used only as a rough proxy (years since graduation) - there is no
// real work-history field on Talent yet, so this is explicitly an estimate,
// never presented as verified experience.
const SENIORITY_MIN_YEARS: Record<VacancySeniority, number> = {
  Intern: 0,
  Junior: 0,
  Mid: 2,
  Senior: 5,
  Lead: 8,
};

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

// A candidate "has" a required/preferred skill if any of their listed skills
// contains it (or vice versa) as a substring - catches "React" matching
// "React.js" / "React Native" without needing a maintained synonym table.
function candidateHasSkill(candidateSkills: string[], targetSkill: string): boolean {
  const target = normalizeSkill(targetSkill);
  if (!target) return false;
  return candidateSkills.some((s) => {
    const cs = normalizeSkill(s);
    return cs === target || cs.includes(target) || target.includes(cs);
  });
}

export function estimateExperienceYears(talent: Talent, referenceYear?: number): number {
  const now = referenceYear ?? new Date().getFullYear();
  const years = now - (talent.graduationYear || now);
  return Math.max(0, years);
}

export interface VacancyMatchBreakdown {
  score: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  candidateEnglishLevel: LanguageProficiencyLevel;
  requiredEnglishLevel?: LanguageProficiencyLevel;
  englishMeetsRequirement: boolean;
  estimatedExperienceYears: number;
  requiredSeniority: VacancySeniority;
  seniorityMeetsRequirement: boolean;
  codingScore: number;
}

/**
 * Deterministically score how well a Talent candidate fits a Vacancy.
 * Every subtraction below is a fact captured in the returned breakdown, so
 * nothing here is a "black box" percentage - it can be explained line by
 * line to a manager (or narrated by the AI explainer, which must only
 * phrase these exact facts, never compute its own).
 */
export function scoreCandidateForVacancy(talent: Talent, vacancy: Vacancy): VacancyMatchBreakdown {
  let score = 100;
  const candidateSkills = talent.skills || [];

  // Required skills: the single biggest factor. Missing required skills
  // costs up to 45 points total, split evenly across however many are listed.
  const requiredSkills = vacancy.requiredSkills || [];
  const matchedRequiredSkills = requiredSkills.filter((s) => candidateHasSkill(candidateSkills, s));
  const missingRequiredSkills = requiredSkills.filter((s) => !candidateHasSkill(candidateSkills, s));
  if (requiredSkills.length > 0) {
    const missingRatio = missingRequiredSkills.length / requiredSkills.length;
    score -= Math.round(missingRatio * 45);
  }

  // Preferred skills: a smaller bonus-shaped deduction (up to 15 points) -
  // not having a "nice to have" skill is a minor gap, not disqualifying.
  const preferredSkills = vacancy.preferredSkills || [];
  const matchedPreferredSkills = preferredSkills.filter((s) => candidateHasSkill(candidateSkills, s));
  const missingPreferredSkills = preferredSkills.filter((s) => !candidateHasSkill(candidateSkills, s));
  if (preferredSkills.length > 0) {
    const missingRatio = missingPreferredSkills.length / preferredSkills.length;
    score -= Math.round(missingRatio * 15);
  }

  // English level: only penalize a shortfall, never reward exceeding it.
  const candidateEnglishLevel = talent.englishLevel || "None";
  const requiredEnglishLevel = vacancy.englishLevel;
  let englishMeetsRequirement = true;
  if (requiredEnglishLevel) {
    const gap = languageLevelRank(requiredEnglishLevel) - languageLevelRank(candidateEnglishLevel);
    if (gap > 0) {
      englishMeetsRequirement = false;
      score -= Math.min(20, gap * 7);
    }
  }

  // Seniority: rough proxy from years-since-graduation against the band's
  // minimum expected years. Explicitly an estimate (see SENIORITY_MIN_YEARS
  // comment) - never presented as confirmed work history.
  const estimatedExperienceYears = estimateExperienceYears(talent);
  const requiredSeniority = vacancy.seniority;
  const minYears = SENIORITY_MIN_YEARS[requiredSeniority] ?? 0;
  let seniorityMeetsRequirement = true;
  if (estimatedExperienceYears < minYears) {
    seniorityMeetsRequirement = false;
    const shortfall = minYears - estimatedExperienceYears;
    score -= Math.min(20, shortfall * 5);
  }

  // Coding test score: a light signal only (max 10-point effect) so a weak
  // required-skills match isn't masked by a single strong test result.
  const codingScore = talent.testScores?.coding ?? 0;
  if (codingScore < 50) {
    score -= Math.round((50 - codingScore) / 5);
  }

  return {
    score: Math.max(15, Math.round(score)),
    matchedRequiredSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    missingPreferredSkills,
    candidateEnglishLevel,
    requiredEnglishLevel,
    englishMeetsRequirement,
    estimatedExperienceYears,
    requiredSeniority,
    seniorityMeetsRequirement,
    codingScore,
  };
}

/**
 * Convenience wrapper for list/sort views that only need the number.
 */
export function getVacancyMatchScore(talent: Talent, vacancy: Vacancy): number {
  return scoreCandidateForVacancy(talent, vacancy).score;
}

/**
 * Rank a pool of candidates against one vacancy, best match first.
 */
export function rankCandidatesForVacancy(candidates: Talent[], vacancy: Vacancy): Array<{ talent: Talent; match: VacancyMatchBreakdown }> {
  return candidates
    .map((talent) => ({ talent, match: scoreCandidateForVacancy(talent, vacancy) }))
    .sort((a, b) => b.match.score - a.match.score);
}
