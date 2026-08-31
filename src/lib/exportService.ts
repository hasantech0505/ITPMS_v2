/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from "../types";

// Types for export/import operations
export interface ExportConfig {
  title: string;
  sheetName: string;
  columns: { key: string; label: string; type?: "string" | "number" | "currency" | "date" }[];
  selectedKeys: string[];
  filtersApplied?: Record<string, any>;
  generatedBy: string;
  branch?: string;
  exportMode: "all" | "filtered" | "selected" | "currentPage" | "dateRange" | "month" | "quarter" | "year" | "custom";
  timeframe?: string;
}

export interface SavedTemplate {
  id: string;
  name: string;
  module: string;
  columns: string[];
  sorting?: { key: string; order: "asc" | "desc" };
  filters?: Record<string, any>;
  format: "xls" | "csv" | "pdf";
}

export interface ImportPreviewRow {
  rawData: Record<string, string>;
  mappedData: Record<string, any>;
  errors: Record<string, string>; // field -> error message
  isDuplicate: boolean;
  isValid: boolean;
}

// 1. GENERATE EXCEL-COMPATIBLE XML (SpreadsheetML) SPREADSHEET WITH ALL ADVANCED REQUIREMENTS
// This format is fully recognized by Microsoft Excel, LibreOffice, and Google Sheets, and opens with perfect styling!
export function generateExcelXML(config: ExportConfig, data: any[]): string {
  const {
    title,
    sheetName = "Sheet 1",
    columns,
    selectedKeys,
    filtersApplied = {},
    generatedBy = "Administrator",
    branch = "Tashkent Headquarters",
  } = config;

  const activeCols = columns.filter((col) => selectedKeys.includes(col.key));
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";

  // Build spreadsheet XML header
  let xml = `<?xml version="1.0" encoding="utf-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>${title}</Title>
    <Author>${generatedBy}</Author>
    <Created>${new Date().toISOString()}</Created>
    <LastSaved>${new Date().toISOString()}</LastSaved>
    <Company>IT Park Uzbekistan</Company>
    <Version>16.00</Version>
  </DocumentProperties>
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
    <WindowHeight>9000</WindowHeight>
    <WindowWidth>13600</WindowWidth>
    <WindowTopX>0</WindowTopX>
    <WindowTopY>0</WindowTopY>
    <ProtectStructure>False</ProtectStructure>
    <ProtectWindows>False</ProtectWindows>
  </ExcelWorkbook>
  <Styles>
    <!-- Default Style -->
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom"/>
      <Borders/>
      <Font ss:FontName="Calibri" x:CharSet="204" ss:Size="11" ss:Color="#000000"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <!-- Main Title Style -->
    <Style ss:ID="TitleStyle">
      <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
      <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <!-- Meta Data Labels -->
    <Style ss:ID="MetaLabel">
      <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#475569"/>
    </Style>
    <Style ss:ID="MetaValue">
      <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#0F172A"/>
    </Style>
    <!-- Header Style (Corporate Blue background, white bold text) -->
    <Style ss:ID="HeaderStyle">
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1E293B"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/>
      </Borders>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
    </Style>
    <!-- Zebra Rows -->
    <Style ss:ID="RowEven">
      <Alignment ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
      <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="RowOdd">
      <Alignment ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
    </Style>
    <!-- Data alignments/formats -->
    <Style ss:ID="CurrencyStyle">
      <NumberFormat ss:Format="&quot;$&quot;#,##0.00;[Red]\(&quot;$&quot;#,##0.00\)"/>
    </Style>
    <Style ss:ID="NumberStyle">
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="DateStyle">
      <NumberFormat ss:Format="yyyy-mm-dd"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${sheetName.substring(0, 30)}">
    <Table ss:ExpandedColumnCount="${activeCols.length + 1}" ss:DefaultRowHeight="20">
      <!-- Configure Column Auto-widths -->
      ${activeCols.map((col, idx) => {
        const width = col.type === "currency" ? 130 : col.key.includes("address") || col.key.includes("description") ? 250 : 110;
        return `<Column ss:Index="${idx + 1}" ss:Width="${width}"/>`;
      }).join("\n")}

      <!-- 1. IT Park Uzbekistan Corporate Branding Row -->
      <Row ss:AutoFitHeight="1" ss:Height="26">
        <Cell ss:MergeAcross="${activeCols.length - 1}" ss:StyleID="TitleStyle">
          <Data ss:Type="String">   IT PARK UZBEKISTAN — ENTERPRISE DATA SYSTEM</Data>
        </Cell>
      </Row>

      <!-- 2. Empty Spacing Row -->
      <Row ss:Height="12"></Row>

      <!-- 3. Report Metadata Block -->
      <Row ss:Height="18">
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Report Title:</Data></Cell>
        <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${title}</Data></Cell>
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Branch Name:</Data></Cell>
        <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${branch}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Generation Date:</Data></Cell>
        <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${new Date().toLocaleDateString()}</Data></Cell>
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Generated By:</Data></Cell>
        <Cell ss:StyleID="MetaValue"><Data ss:Type="String">${generatedBy}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Active Filters:</Data></Cell>
        <Cell ss:MergeAcross="${Math.max(1, activeCols.length - 2)}" ss:StyleID="MetaValue">
          <Data ss:Type="String">${Object.keys(filtersApplied).length > 0 
            ? Object.entries(filtersApplied).map(([k, v]) => `${k}: ${v}`).join(", ") 
            : "NONE (All Live Records included)"}
          </Data>
        </Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="MetaLabel"><Data ss:Type="String">Export Protocol:</Data></Cell>
        <Cell ss:StyleID="MetaValue"><Data ss:Type="String">Grounded Database CSV/Excel v16.0</Data></Cell>
      </Row>

      <!-- Empty spacing before main table -->
      <Row ss:Height="15"></Row>

      <!-- 4. Table Header Row (Corporate Blue & Frozen) -->
      <Row ss:Height="24">
        ${activeCols.map((col) => `
          <Cell ss:StyleID="HeaderStyle">
            <Data ss:Type="String">${col.label}</Data>
          </Cell>
        `).join("")}
      </Row>

      <!-- 5. Table Data Rows -->
      ${data.map((row, rowIdx) => {
        const rowStyleID = rowIdx % 2 === 0 ? "RowEven" : "RowOdd";
        return `
          <Row ss:Height="20">
            ${activeCols.map((col) => {
              let value = row[col.key];
              if (value === undefined || value === null) value = "";
              
              // Determine Cell XML type
              let dataType = "String";
              let styleStr = `ss:StyleID="${rowStyleID}"`;

              if (typeof value === "number") {
                dataType = "Number";
                if (col.type === "currency") {
                  styleStr = `ss:StyleID="CurrencyStyle"`;
                } else {
                  styleStr = `ss:StyleID="NumberStyle"`;
                }
              } else if (col.type === "date" || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value))) {
                // Ensure valid ISO date format
                dataType = "String";
              }

              // XML encode strings
              const encodedVal = typeof value === "string" 
                ? value
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;")
                : value;

              return `
                <Cell ${styleStr}>
                  <Data ss:Type="${dataType}">${encodedVal}</Data>
                </Cell>
              `;
            }).join("")}
          </Row>
        `;
      }).join("")}

      <!-- spacing -->
      <Row ss:Height="20"></Row>

      <!-- 6. Footer Signature Row -->
      <Row ss:Height="18">
        <Cell ss:MergeAcross="${activeCols.length - 1}" ss:StyleID="MetaValue">
          <Data ss:Type="String">Generated on: ${timestamp} | IT Park Uzbekistan Digital Registry. Official internal copy.</Data>
        </Cell>
      </Row>
    </Table>
    <!-- Configure Frozen Header View and Page Footers -->
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
      <PageSetup>
        <Header x:Margin="0.3"/>
        <Footer x:Margin="0.3" x:Data="&amp;L&amp;8Confidential Internal Document&amp;RPage &amp;P of &amp;N"/>
      </PageSetup>
      <Unsynced/>
      <Print>
        <ValidPrinterInfo/>
        <PaperSizeIndex>9</PaperSizeIndex>
        <HorizontalResolution>600</HorizontalResolution>
        <VerticalResolution>600</VerticalResolution>
      </Print>
      <Selected/>
      <Panes>
        <Pane>
          <Number>3</Number>
          <ActiveRow>10</ActiveRow>
          <ActiveCol>0</ActiveCol>
        </Pane>
      </Panes>
      <ProtectObjects>False</ProtectObjects>
      <ProtectScenarios>False</ProtectScenarios>
    </WorksheetOptions>
  </Worksheet>
</Workbook>`;

  return xml;
}

// 2. CSV EXPORT UTILITY
export function generateCSV(config: ExportConfig, data: any[]): string {
  const { columns, selectedKeys } = config;
  const activeCols = columns.filter((col) => selectedKeys.includes(col.key));

  const headers = activeCols.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");
  const rows = data.map((row) => {
    return activeCols.map((col) => {
      let cellVal = row[col.key];
      if (cellVal === undefined || cellVal === null) cellVal = "";
      if (Array.isArray(cellVal)) cellVal = cellVal.join("; ");
      if (typeof cellVal === "object") cellVal = JSON.stringify(cellVal);
      const strVal = String(cellVal).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(",");
  });

  return [headers, ...rows].join("\n");
}

// 3. PARSE CSV OR MOCK EXCEL FOR PREVIEW & VALIDATION
export function parseCSVData(rawText: string): Record<string, string>[] {
  const lines = rawText.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];

  // Simple CSV parser supporting quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headerRow = parseLine(lines[0]);
  const dataRows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const record: Record<string, string> = {};
    headerRow.forEach((header, index) => {
      const cleanedHeader = header.replace(/^"|"$/g, "").trim();
      let val = values[index] || "";
      val = val.replace(/^"|"$/g, "").trim();
      if (cleanedHeader) {
        record[cleanedHeader] = val;
      }
    });
    dataRows.push(record);
  }

  return dataRows;
}

// 4. FUZZY COLUMN MAPPER SUGGESTION
export function suggestColumnMappings(headers: string[], dbFields: { key: string; label: string; required?: boolean }[]): Record<string, string> {
  const mapping: Record<string, string> = {}; // fileHeader -> dbField.key

  headers.forEach((header) => {
    const normalizedHeader = String(header || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Exact or near matches
    const bestMatch = dbFields.find((field) => {
      const normalizedKey = String(field.key || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const normalizedLabel = String(field.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return normalizedHeader === normalizedKey || 
             normalizedHeader === normalizedLabel ||
             normalizedHeader.includes(normalizedKey) ||
             normalizedKey.includes(normalizedHeader);
    });

    if (bestMatch) {
      mapping[header] = bestMatch.key;
    } else {
      // Look for custom rules e.g. "INN" -> "registrationNumber"
      if (normalizedHeader === "inn" || normalizedHeader === "registration" || normalizedHeader === "regno") {
        const regField = dbFields.find(f => f.key === "registrationNumber" || f.key === "companyName");
        if (regField) mapping[header] = regField.key;
      } else {
        mapping[header] = ""; // Let the user choose manually
      }
    }
  });

  return mapping;
}

// 5. DATA VALIDATORS
export function validateRecord(
  mappedRecord: Record<string, any>,
  dbFields: { key: string; label: string; required?: boolean; type?: string }[],
  existingRecords: any[],
  uniqueKeyField?: string
): { errors: Record<string, string>; isDuplicate: boolean; isValid: boolean } {
  const errors: Record<string, string> = {};
  let isDuplicate = false;

  dbFields.forEach((field) => {
    const val = mappedRecord[field.key];
    const isPresent = val !== undefined && val !== null && String(val).trim() !== "";

    // 1. Required fields
    if (field.required && !isPresent) {
      errors[field.key] = `${field.label} is required.`;
    }

    if (isPresent) {
      const strVal = String(val).trim();

      // 2. Email Validation
      if (String(field.key || "").toLowerCase().includes("email") || field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(strVal)) {
          errors[field.key] = `Invalid email address.`;
        }
      }

      // 3. Phone Validation (allow + or digits, min length 7)
      if (String(field.key || "").toLowerCase().includes("phone") || field.type === "phone") {
        const phoneDigits = strVal.replace(/[^0-9+]/g, "");
        if (phoneDigits.length < 7) {
          errors[field.key] = `Invalid contact phone number.`;
        }
      }

      // 4. Date Validation
      if (field.type === "date" || String(field.key || "").toLowerCase().includes("date") || String(field.key || "").endsWith("at")) {
        const timestamp = Date.parse(strVal);
        if (isNaN(timestamp)) {
          errors[field.key] = `Invalid date format. Use YYYY-MM-DD.`;
        }
      }

      // 5. Number checks
      if (field.type === "number") {
        if (isNaN(Number(strVal))) {
          errors[field.key] = `Must be a valid numeric quantity.`;
        }
      }
    }
  });

  // 6. Duplicate Detection based on a key field (e.g., registrationNumber or email or companyName)
  if (uniqueKeyField) {
    const uniqueVal = mappedRecord[uniqueKeyField];
    if (uniqueVal !== undefined && uniqueVal !== null && String(uniqueVal).trim() !== "") {
      const match = existingRecords.find(
        (rec) => String(rec[uniqueKeyField]).toLowerCase().trim() === String(uniqueVal).toLowerCase().trim()
      );
      if (match) {
        isDuplicate = true;
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return { errors, isDuplicate, isValid };
}

// 6. LOCAL PERSISTENT SAVED TEMPLATES STORE
const SAVED_TEMPLATES_KEY = "itpms_saved_export_templates";

export function loadSavedTemplates(module: string): SavedTemplate[] {
  try {
    const stored = localStorage.getItem(SAVED_TEMPLATES_KEY);
    if (!stored) {
      // Seed default templates
      const defaultTemplates: SavedTemplate[] = [
        { id: "t1", name: "Monthly BPO Report", module: "residents", columns: ["companyName", "registrationNumber", "exportVolume", "status"], format: "xls" },
        { id: "t2", name: "Quarterly Company Report", module: "companies", columns: ["name", "country", "industry", "leadScore", "status"], format: "xls" },
        { id: "t3", name: "Investor Pipeline", module: "startups", columns: ["name", "founder", "stage", "fundingRaised", "revenue"], format: "xls" },
        { id: "t4", name: "Meeting Summary", module: "meetings", columns: ["title", "companyName", "dateTime", "notes", "status"], format: "xls" },
        { id: "t5", name: "Resident Candidate List", module: "talent", columns: ["fullName", "university", "major", "skills", "englishLevel", "status"], format: "xls" }
      ];
      localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(defaultTemplates));
      return defaultTemplates.filter((t) => t.module === module);
    }
    const parsed: SavedTemplate[] = JSON.parse(stored);
    return parsed.filter((t) => t.module === module);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function saveExportTemplate(template: Omit<SavedTemplate, "id">): SavedTemplate {
  const id = `tpl-${Date.now()}`;
  const newTemplate: SavedTemplate = { ...template, id };
  try {
    const stored = localStorage.getItem(SAVED_TEMPLATES_KEY);
    const existing: SavedTemplate[] = stored ? JSON.parse(stored) : [];
    const updated = [...existing, newTemplate];
    localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return newTemplate;
}

// 7. LOCAL PERSISTENT SCHEDULED REPORTS STORE
export interface ScheduledReport {
  id: string;
  name: string;
  module: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  recipientEmail: string;
  columns: string[];
  format: "xls" | "csv" | "pdf";
  lastSent?: string;
  nextScheduled: string;
}

const SCHEDULED_REPORTS_KEY = "itpms_scheduled_reports";

export function loadScheduledReports(module?: string): ScheduledReport[] {
  try {
    const stored = localStorage.getItem(SCHEDULED_REPORTS_KEY);
    if (!stored) {
      const defaultSchedules: ScheduledReport[] = [
        {
          id: "s1",
          name: "Automatic BPO Monthly Export",
          module: "residents",
          frequency: "monthly",
          recipientEmail: "reports@itpark.uz",
          columns: ["companyName", "exportVolume", "domesticVolume", "status"],
          format: "xls",
          lastSent: "2026-06-30T10:00:00Z",
          nextScheduled: "2026-07-30T10:00:00Z"
        },
        {
          id: "s2",
          name: "Weekly Startups Pipeline Dispatch",
          module: "startups",
          frequency: "weekly",
          recipientEmail: "investors@itpark.uz",
          columns: ["name", "founder", "stage", "fundingRaised", "revenue"],
          format: "xls",
          lastSent: "2026-07-05T08:00:00Z",
          nextScheduled: "2026-07-12T08:00:00Z"
        }
      ];
      localStorage.setItem(SCHEDULED_REPORTS_KEY, JSON.stringify(defaultSchedules));
      return module ? defaultSchedules.filter((s) => s.module === module) : defaultSchedules;
    }
    const parsed: ScheduledReport[] = JSON.parse(stored);
    return module ? parsed.filter((s) => s.module === module) : parsed;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function saveScheduledReport(schedule: Omit<ScheduledReport, "id" | "nextScheduled">): ScheduledReport {
  const id = `sch-${Date.now()}`;
  const now = new Date();
  let nextDate = new Date();
  if (schedule.frequency === "daily") nextDate.setDate(now.getDate() + 1);
  else if (schedule.frequency === "weekly") nextDate.setDate(now.getDate() + 7);
  else if (schedule.frequency === "monthly") nextDate.setMonth(now.getMonth() + 1);
  else if (schedule.frequency === "quarterly") nextDate.setMonth(now.getMonth() + 3);
  else nextDate.setFullYear(now.getFullYear() + 1);

  const newSchedule: ScheduledReport = {
    ...schedule,
    id,
    nextScheduled: nextDate.toISOString()
  };

  try {
    const stored = localStorage.getItem(SCHEDULED_REPORTS_KEY);
    const existing: ScheduledReport[] = stored ? JSON.parse(stored) : [];
    const updated = [...existing, newSchedule];
    localStorage.setItem(SCHEDULED_REPORTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return newSchedule;
}

export function deleteScheduledReport(id: string) {
  try {
    const stored = localStorage.getItem(SCHEDULED_REPORTS_KEY);
    if (stored) {
      const existing: ScheduledReport[] = JSON.parse(stored);
      const updated = existing.filter((s) => s.id !== id);
      localStorage.setItem(SCHEDULED_REPORTS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error(e);
  }
}
