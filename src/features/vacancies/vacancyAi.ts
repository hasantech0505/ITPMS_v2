/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Thin client for the Resident Vacancies "Explain this match" AI endpoint
 * (server/services/ai.service.ts's explainVacancyMatch). The score and
 * every fact behind it are always computed deterministically by
 * vacancyMatching.ts on both sides - this call only asks for a natural-
 * language phrasing of those facts. Falls back gracefully (usedAI: false)
 * if Groq isn't configured or the call fails, matching the rest of the
 * app's AI features (see edoReportAi.ts for the identical pattern).
 */

import type { Talent, Vacancy } from "../../types";
import type { VacancyMatchBreakdown } from "./vacancyMatching";

async function postJson<T>(url: string, body: any): Promise<T> {
  const token = localStorage.getItem("itpms_access_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  return res.json();
}

export function explainVacancyMatch(params: { talent: Talent; vacancy: Vacancy }) {
  return postJson<{ explanation: string; score: number; breakdown: VacancyMatchBreakdown; usedAI: boolean }>(
    "/api/ai/vacancies/explain-match",
    params
  );
}
