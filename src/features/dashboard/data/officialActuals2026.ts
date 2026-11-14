/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Officially reported 2026 figures imported from the IT Park Kashkadarya
 * source workbooks (OneDrive: "IT Park Kashkadarya - 2025-26-27-28-29-30").
 *
 * Kept in one small, reviewable file with its source and "as of" date, so
 * every number on the dashboard can be traced back. Update the values here
 * when a newer report arrives.
 */

export interface OfficialActual {
  value: number;
  /** Human-readable period the figure covers. */
  asOf: string;
  /** Workbook > sheet the figure was read from. */
  source: string;
  /** "actual" = reported result, "forecast" = projection supplied by residents. */
  kind: "actual" | "forecast";
  note?: string;
}

export const OFFICIAL_ACTUALS_2026: Record<string, OfficialActual> = {
  // Jobs created by IT Park residents. Q1 actual 552 vs Q1 plan 515.
  new_jobs: {
    value: 552,
    asOf: "Q1 2026, report dated 01.10.2026",
    source: "Metadata_/Residents.xlsx > ' KPI кўрсаткичлари' (I-чорак амалда, jobs row, ЖАМИ)",
    kind: "actual"
  },

  // IT export services - FORECAST supplied by residents, not reported actuals.
  // Sheet total is 299.5 (thousand USD, unit confirmed by the director).
  // Note: the source sheet's own "Жами" column has #REF! errors and rows that
  // disagree with their quarter value, so the total is re-summed from the
  // Q3 column (15 residents).
  export_volume: {
    value: 299_500,
    asOf: "2026 forecast, sheet dated 06.04.2026",
    source: "04_Resident_Companies/Reports & Residents/Docs/Экспорт прогноз (10).xlsx > Лист1 (III чорак, 15 residents)",
    kind: "forecast",
    note: "299.5 thousand USD"
  },

  // Floor area of the regional IT centers. 1,784 m2 is the sheet total for all
  // 14 centers with an area; 1,514 m2 of that is in centers marked as working.
  office_space: {
    value: 1784,
    asOf: "IT-center registry (file modified 2026)",
    source: "04_Resident_Companies/Reports & Residents/IT Centers/IT-Markazlar ko'rsatkichlari......xlsx > Sheet1 (ЖАМИ, m2)",
    kind: "actual",
    note: "1,514 m2 of this is in centers currently marked as working"
  }
};
