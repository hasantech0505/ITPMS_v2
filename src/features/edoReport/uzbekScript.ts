/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Best-effort Uzbek Cyrillic <-> Latin transliteration. Mechanical, not
 * AI-assisted - a handful of real cases (word-initial "е", "ц" in loan
 * words) are genuinely ambiguous without a dictionary, so this is meant
 * as a fast starting point staff review before using, not a guaranteed-
 * correct conversion.
 */

// Latin digraph -> Cyrillic letter, used by latinToCyrillic (checked before single letters).
const LATIN_DIGRAPHS: [string, string][] = [
  ["Yo", "Ё"], ["yo", "ё"],
  ["Yu", "Ю"], ["yu", "ю"],
  ["Ya", "Я"], ["ya", "я"],
  ["Sh", "Ш"], ["sh", "ш"],
  ["Ch", "Ч"], ["ch", "ч"],
  ["Ts", "Ц"], ["ts", "ц"],
];

const LATIN_TO_CYR_MAP: Record<string, string> = {
  a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж",
  k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с",
  t: "т", u: "у", v: "в", x: "х", y: "й", z: "з",
};

const CYR_TO_LATIN_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh",
  щ: "sht", ъ: "'", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o'", қ: "q", ғ: "g'", ҳ: "h",
};

function applyCase(source: string, converted: string): string {
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return converted.toUpperCase();
  }
  if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
    return converted.charAt(0).toUpperCase() + converted.slice(1);
  }
  return converted;
}

export function cyrillicToLatin(text: string): string {
  let out = "";
  let i = 0;
  const chars = Array.from(text);
  while (i < chars.length) {
    const two = chars[i] + (chars[i + 1] || "");
    const twoLower = two.toLowerCase();
    // o' / g' digraphs (ў/ғ) already map with the apostrophe baked in above.
    const oneLower = chars[i].toLowerCase();
    if (CYR_TO_LATIN_MAP[oneLower] !== undefined) {
      out += applyCase(chars[i], CYR_TO_LATIN_MAP[oneLower]);
      i += 1;
      continue;
    }
    out += chars[i];
    i += 1;
  }
  return out;
}

export function latinToCyrillic(text: string): string {
  let out = "";
  let i = 0;
  const chars = Array.from(text);
  while (i < chars.length) {
    const rest = chars.slice(i).join("");
    // o' / g' -> ў / ғ (apostrophe or the Unicode modifier letter variant)
    const apostropheMatch = /^([oOgG])['ʼ’]/.exec(rest);
    if (apostropheMatch) {
      const base = apostropheMatch[1].toLowerCase();
      const cyr = base === "o" ? "ў" : "ғ";
      out += applyCase(apostropheMatch[1], cyr);
      i += 2;
      continue;
    }
    const two = chars[i] + (chars[i + 1] || "");
    const twoLower = two.toLowerCase();
    const digraph = LATIN_DIGRAPHS.find(([lat]) => lat.toLowerCase() === twoLower);
    if (digraph) {
      const isUpper = chars[i] === chars[i].toUpperCase() && chars[i] !== chars[i].toLowerCase();
      out += isUpper ? digraph[1] : digraph[1].toLowerCase();
      i += 2;
      continue;
    }
    const oneLower = chars[i].toLowerCase();
    if (LATIN_TO_CYR_MAP[oneLower] !== undefined) {
      out += applyCase(chars[i], LATIN_TO_CYR_MAP[oneLower]);
      i += 1;
      continue;
    }
    out += chars[i];
    i += 1;
  }
  return out;
}

/** Heuristic: does this text look like it's already (mostly) Cyrillic? */
export function looksCyrillic(text: string): boolean {
  const cyrCount = (text.match(/[Ѐ-ӿ]/g) || []).length;
  const latCount = (text.match(/[A-Za-z]/g) || []).length;
  return cyrCount > latCount;
}
