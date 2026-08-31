/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Derives a Kashkadarya district from a resident's free-text `legalAddress`
 * (e.g. "Qashqadaryo viloyati, Qarshi tumanii, Beshkent shahri Alisher
 * Navoiy mahallasi, Amir Temur ko'chasi, 28-uy" -> "Qarshi District";
 * "Qarshi sh. Navoiy mahallasi, Olimlar ko'chasi, 6-uy" -> "Qarshi").
 *
 * This is a text-matching best-effort helper, not a geocoder: it looks for
 * known district-name tokens anywhere in the address. It intentionally
 * returns null (never a guessed/invented district) when nothing in the
 * address matches a known Kashkadarya district name, e.g. an address in a
 * different region entirely.
 *
 * Distinct from `normalizeDistrict` in
 * `src/features/dashboard/utils/liveDashboardData.ts`, which normalizes an
 * *already-set* `district` field's spelling variants (the whole field IS a
 * district name). This function instead searches inside a full multi-part
 * address string for a district name buried in it, which is what's needed
 * when the `district` field itself is empty.
 *
 * Shared between the client (`src/features/residents/ResidentEnrichment.ts`)
 * and the server (`server/repositories/resident.repository.ts`, which
 * already imports other things from `src/types` — `tsx` resolves this
 * cross-boundary import at runtime the same way).
 */
export function deriveDistrictFromAddress(address?: string | null): string | null {
  if (!address) return null;

  let s = address
    .replace(/[ʻʼ'']/g, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (!s) return null;

  // Ordered most-distinctive-first to reduce false positives from short or
  // otherwise-meaningful Uzbek words (e.g. "muborak" = "blessed", which can
  // appear as part of a neighborhood name outside Muborak district itself).
  const patterns: Array<[RegExp, string]> = [
    [/shahrisabz/, "Shahrisabz"],
    [/chiroqchi/, "Chiroqchi"],
    [/dehqonobod/, "Dehqonobod"],
    [/g'?uzor/, "Gʻuzor"],
    [/yakkabog'?/, "Yakkabogʻ"],
    [/qamashi/, "Qamashi"],
    [/mirishkor/, "Mirishkor"],
    [/ko'?kdala/, "Koʻkdala"], // real district, not yet in KASHKADARYA_DISTRICTS
    [/\bkitob\b/, "Kitob"],
    [/\bkoson\b/, "Koson"],
    [/\bkasbi\b/, "Kasbi"],
    [/\bnishon\b/, "Nishon"],
    [/\bmuborak\b/, "Muborak"],
  ];

  for (const [re, name] of patterns) {
    if (re.test(s)) return name;
  }

  // Qarshi last and handled specially: it's both a city and the name of the
  // surrounding rural district ("Qarshi tumani" / "Qarshi District"), so the
  // suffix that follows it in the address decides which of the two it is.
  if (/qarshi/.test(s)) {
    const isDistrictForm = /qarshi\s*\w*\s*tuman/.test(s);
    return isDistrictForm ? "Qarshi District" : "Qarshi";
  }

  return null;
}
