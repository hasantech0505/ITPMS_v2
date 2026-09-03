/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Thin client for the Edo Ijro Tizim report's AI writing-assistance
 * endpoints (server/services/ai.service.ts's polishEdoNarrative /
 * summarizeEdoStats / compareEdoPeriods). Every call here returns a
 * SUGGESTION - callers decide whether to accept it, nothing is applied
 * automatically. Falls back gracefully (usedAI: false) if Groq isn't
 * configured or the call fails, matching the rest of the app's AI features.
 */

async function postJson<T>(url: string, body: any): Promise<T> {
  const token = localStorage.getItem("itpms_access_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);
  return res.json();
}

export function polishEdoNarrative(params: { text: string; sectionTitle?: string; heading?: string }) {
  return postJson<{ polished: string; usedAI: boolean }>("/api/ai/edo/polish", params);
}

export function summarizeEdoStats(params: {
  sectionTitle: string;
  autoStats: Record<string, any>;
  manualStats?: { label: string; value: string }[];
}) {
  return postJson<{ summary: string; usedAI: boolean }>("/api/ai/edo/summarize-stats", params);
}

export function compareEdoPeriods(params: {
  sectionTitle: string;
  currentStats: Record<string, any>;
  previousStats: Record<string, any>;
}) {
  return postJson<{ narrative: string; usedAI: boolean; changeCount: number }>("/api/ai/edo/compare-periods", params);
}
