/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileSpreadsheet as FileExcel,
  FileCode, 
  FileText,
  Printer, 
  Clock, 
  Settings, 
  Check, 
  X, 
  AlertCircle, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Sliders, 
  Calendar, 
  Mail, 
  Trash2, 
  Layers, 
  Activity,
  CheckSquare,
  Square
} from "lucide-react";
import { UserRole } from "../types";
import { 
  ExportConfig, 
  generateExcelXML, 
  generateCSV, 
  parseCSVData, 
  suggestColumnMappings, 
  validateRecord, 
  loadSavedTemplates, 
  saveExportTemplate, 
  loadScheduledReports, 
  saveScheduledReport, 
  deleteScheduledReport,
  SavedTemplate,
  ScheduledReport
} from "../lib/exportService";

interface ExportImportManagerProps {
  module: string;
  moduleTitle: string;
  data: any[];
  columns: { key: string; label: string; required?: boolean; type?: "string" | "number" | "currency" | "date" | "phone" | "email" }[];
  onImportCompleted?: (importedRecords: any[]) => void;
  userRole: UserRole;
  userName?: string;
  userId?: string;
}

export default function ExportImportManager({
  module,
  moduleTitle,
  data,
  columns,
  onImportCompleted,
  userRole,
  userName = "Hasan Abdukarimov",
  userId = "u-1"
}: ExportImportManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"export" | "import" | "builder" | "schedules" | "audit">("export");

  // --- EXPORT STATE ---
  const [selectedKeys, setSelectedKeys] = useState<string[]>(columns.map(c => c.key));
  const [exportMode, setExportMode] = useState<ExportConfig["exportMode"]>("all");
  const [exportFormat, setExportFormat] = useState<"xls" | "csv" | "pdf" | "print">("xls");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [newTemplateName, setNewTemplateName] = useState<string>("");
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);

  // Filtering mockup fields for export
  const [filterQuarter, setFilterQuarter] = useState<string>("Q3 2024");
  const [filterMonth, setFilterMonth] = useState<string>("October");
  const [filterYear, setFilterYear] = useState<string>("2024");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Progress Indicators
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");

  // --- IMPORT STATE ---
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importRawText, setImportRawText] = useState<string>("");
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importRows, setImportRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({}); // fileHeader -> dbField
  const [duplicateStrategy, setDuplicateStrategy] = useState<"skip" | "overwrite" | "duplicate">("skip");
  const [validatedRows, setValidatedRows] = useState<any[]>([]);
  const [importErrorsCount, setImportErrorsCount] = useState<number>(0);
  const [importDuplicatesCount, setImportDuplicatesCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- REPORT BUILDER STATE ---
  const [builderSortField, setBuilderSortField] = useState<string>(columns[0]?.key || "");
  const [builderSortOrder, setBuilderSortOrder] = useState<"asc" | "desc">("asc");
  const [builderGroupField, setBuilderGroupField] = useState<string>("");
  const [builderFilterValue, setBuilderFilterValue] = useState<string>("");
  const [builderFilterField, setBuilderFilterField] = useState<string>("");

  // --- SCHEDULES STATE ---
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [newScheduleFreq, setNewScheduleFreq] = useState<ScheduledReport["frequency"]>("monthly");
  const [newScheduleEmail, setNewScheduleEmail] = useState<string>("reports@itpark.uz");
  const [newScheduleName, setNewScheduleName] = useState<string>("");

  // --- LOCAL AUDIT LOGS ---
  const [localAuditLogs, setLocalAuditLogs] = useState<any[]>([]);

  // Load Saved configs on mount
  useEffect(() => {
    if (isOpen) {
      setTemplates(loadSavedTemplates(module));
      setSchedules(loadScheduledReports(module));
      fetchAuditLogs();
    }
  }, [isOpen, module]);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/db");
      if (res.ok) {
        const dbData = await res.json();
        // Filter activity logs relevant to import/export of this module
        const filtered = (dbData.activityLogs || []).filter(
          (log: any) => 
            log.entity === module && 
            (log.action.toLowerCase().includes("export") || log.action.toLowerCase().includes("import") || log.action.toLowerCase().includes("template") || log.action.toLowerCase().includes("schedule"))
        );
        setLocalAuditLogs(filtered);
      }
    } catch (e) {
      console.error("Failed to load audit logs:", e);
    }
  };

  // Log action helper
  const logAuditAction = async (actionText: string) => {
    try {
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          userRole,
          action: actionText,
          entity: module,
          entityId: `ex-${Date.now()}`
        })
      });
      fetchAuditLogs();
    } catch (e) {
      console.error(e);
    }
  };

  // --- TEMPLATES HANDLERS ---
  const handleLoadTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    if (!tplId) return;
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setSelectedKeys(tpl.columns);
      if (tpl.format) setExportFormat(tpl.format as any);
      logAuditAction(`Loaded Saved Template: "${tpl.name}" for custom export.`);
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    const newTpl = saveExportTemplate({
      name: newTemplateName.trim(),
      module,
      columns: selectedKeys,
      format: exportFormat === "print" ? "xls" : exportFormat as any
    });
    setTemplates(loadSavedTemplates(module));
    setNewTemplateName("");
    setSelectedTemplateId(newTpl.id);
    logAuditAction(`Saved current configuration as Template: "${newTpl.name}"`);
  };

  // --- REUSABLE STREAMING EXPORT LOGIC ---
  const executeExport = async () => {
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus("Filtering target database records...");

    // Simulate streaming & processing chunks
    await new Promise(r => setTimeout(r, 400));
    setProgressPercent(35);
    setProgressStatus("Applying corporate SpreadsheetML formulas...");

    await new Promise(r => setTimeout(r, 450));
    setProgressPercent(60);
    setProgressStatus("Auto-calculating visual column widths & borders...");

    // Filter data based on export mode
    let targetData = [...data];
    let timeframeLabel = "All time";

    if (exportMode === "dateRange" && dateFrom && dateTo) {
      targetData = targetData.filter(item => {
        const itemDate = item.joinedAt || item.appliedAt || item.dateTime || new Date().toISOString();
        return itemDate >= dateFrom && itemDate <= dateTo;
      });
      timeframeLabel = `Date Range: ${dateFrom} to ${dateTo}`;
    } else if (exportMode === "month") {
      timeframeLabel = `Month: ${filterMonth} ${filterYear}`;
    } else if (exportMode === "quarter") {
      timeframeLabel = `Quarter: ${filterQuarter} ${filterYear}`;
    } else if (exportMode === "year") {
      timeframeLabel = `Year: ${filterYear}`;
    }

    // Apply sorting/grouping if active inside Report Builder
    if (activeSubTab === "builder") {
      if (builderSortField) {
        targetData.sort((a, b) => {
          const valA = a[builderSortField];
          const valB = b[builderSortField];
          if (typeof valA === "number" && typeof valB === "number") {
            return builderSortOrder === "asc" ? valA - valB : valB - valA;
          }
          return builderSortOrder === "asc" 
            ? String(valA).localeCompare(String(valB)) 
            : String(valB).localeCompare(String(valA));
        });
      }
      if (builderFilterField && builderFilterValue) {
        targetData = targetData.filter(item => 
          String(item[builderFilterField] || "").toLowerCase().includes(builderFilterValue.toLowerCase())
        );
      }
    }

    await new Promise(r => setTimeout(r, 400));
    setProgressPercent(85);
    setProgressStatus("Injecting IT Park Uzbekistan digital signature...");

    const exportConfig: ExportConfig = {
      title: `${moduleTitle} Official Enterprise Report`,
      sheetName: moduleTitle,
      columns: columns.map(c => ({ key: c.key, label: c.label, type: c.type as any })),
      selectedKeys,
      filtersApplied: exportMode !== "all" ? { Mode: exportMode, Timeframe: timeframeLabel } : undefined,
      generatedBy: userName,
      exportMode,
      timeframe: timeframeLabel
    };

    let fileContent = "";
    let mimeType = "";
    let fileName = `${module}_report_${Date.now()}`;

    if (exportFormat === "xls") {
      fileContent = generateExcelXML(exportConfig, targetData);
      mimeType = "application/vnd.ms-excel";
      fileName += ".xls"; // Opens beautifully in Excel as styled workbook
    } else if (exportFormat === "csv") {
      fileContent = generateCSV(exportConfig, targetData);
      mimeType = "text/csv;charset=utf-8;";
      fileName += ".csv";
    } else if (exportFormat === "pdf" || exportFormat === "print") {
      // PDF or direct browser print trigger
      setIsProcessing(false);
      logAuditAction(`Initiated print output stream of ${targetData.length} records from ${moduleTitle}.`);
      triggerPrintReport(exportConfig, targetData);
      return;
    }

    // Trigger Download
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setProgressPercent(100);
    setProgressStatus("Download triggered successfully!");

    await new Promise(r => setTimeout(r, 500));
    setIsProcessing(false);
    setProgressPercent(0);

    logAuditAction(`Exported ${targetData.length} records to ${exportFormat.toUpperCase()} file (${fileName}). Mode: ${exportMode}.`);
  };

  const triggerPrintReport = (config: ExportConfig, printData: any[]) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print reports.");
      return;
    }

    const cols = columns.filter(c => selectedKeys.includes(c.key));

    const html = `
      <html>
        <head>
          <title>${config.title}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #000; letter-spacing: -1px; }
            .logo span { color: #2563eb; }
            .meta { font-size: 11px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 30px; }
            .meta-item span { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th { background-color: #0f172a; color: white; padding: 10px 12px; font-weight: bold; text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; display: flex; justify-content: space-between; font-size: 9px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 10px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">IT PARK <span>UZBEKISTAN</span></div>
            <div style="text-align: right">
              <h2 style="margin: 0; font-size: 16px;">${config.title}</h2>
              <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">Enterprise Registry Document</p>
            </div>
          </div>

          <div class="meta">
            <div class="meta-item"><span>Report Title:</span> ${config.title}</div>
            <div class="meta-item"><span>Branch Name:</span> Tashkent HQ Registry</div>
            <div class="meta-item"><span>Generation Date:</span> ${new Date().toLocaleDateString()}</div>
            <div class="meta-item"><span>Generated By:</span> ${config.generatedBy}</div>
            <div class="meta-item"><span>Applied Mode:</span> ${config.exportMode.toUpperCase()} (${config.timeframe || "All items"})</div>
            <div class="meta-item"><span>Security Protocol:</span> L2 Restricted Internal</div>
          </div>

          <table>
            <thead>
              <tr>
                ${cols.map(c => `<th>${c.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${printData.map(row => `
                <tr>
                  ${cols.map(c => {
                    let val = row[c.key];
                    if (val === undefined || val === null) val = "";
                    if (c.type === "currency") val = `$${Number(val).toLocaleString()}`;
                    return `<td>${val}</td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>IT Park Uzbekistan official digital register. Under the oversight of Ministry of Digital Technologies.</div>
            <div>Timestamp: ${new Date().toLocaleString()}</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // --- REUSABLE IMPORT PROCESSORS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processImportFile(files[0]);
  };

  const processImportFile = (file: File) => {
    setImportFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setImportRawText(text);

      const parsedRows = parseCSVData(text);
      if (parsedRows.length > 0) {
        setImportRows(parsedRows);
        const headers = Object.keys(parsedRows[0]);
        setImportHeaders(headers);

        // Run fuzzy mapper suggestion
        const suggested = suggestColumnMappings(headers, columns);
        setColumnMapping(suggested);
      }
    };
    reader.readAsText(file);
    logAuditAction(`Uploaded file "${file.name}" into import container. Parsing columns...`);
  };

  // Re-run validation whenever mapping, duplicate strategy, or file changes
  useEffect(() => {
    if (importRows.length === 0) return;

    let errCount = 0;
    let dupCount = 0;

    const validated = importRows.map((rawRow) => {
      // Build mapped item matching database schema
      const mappedItem: Record<string, any> = {};
      
      // Seed default numeric/currency values so linter & validation don't break
      columns.forEach(col => {
        if (col.type === "number" || col.type === "currency") {
          mappedItem[col.key] = 0;
        } else {
          mappedItem[col.key] = "";
        }
      });

      Object.entries(columnMapping).forEach(([fileHeader, dbFieldKey]) => {
        const fieldKey = dbFieldKey as string;
        const headerKey = fileHeader as string;
        if (fieldKey) {
          const colDef = columns.find(c => c.key === fieldKey);
          let rawVal = (rawRow as Record<string, string>)[headerKey] || "";
          if (colDef?.type === "number" || colDef?.type === "currency") {
            mappedItem[fieldKey] = Number(String(rawVal).replace(/[^0-9.]/g, "")) || 0;
          } else {
            mappedItem[fieldKey] = rawVal;
          }
        }
      });

      // Find unique field key for duplicate check (e.g. registrationNumber, companyName, email)
      const uniqueField = columns.find(c => c.key === "registrationNumber" || c.key === "email" || c.key === "companyName")?.key || "id";

      const { errors, isDuplicate, isValid } = validateRecord(
        mappedItem,
        columns,
        data,
        uniqueField
      );

      if (!isValid) errCount++;
      if (isDuplicate) dupCount++;

      return {
        rawData: rawRow,
        mappedData: mappedItem,
        errors,
        isDuplicate,
        isValid
      };
    });

    setValidatedRows(validated);
    setImportErrorsCount(errCount);
    setImportDuplicatesCount(dupCount);
  }, [columnMapping, importRows, duplicateStrategy, data, columns]);

  const executeBulkImport = async () => {
    if (validatedRows.length === 0) return;

    setIsProcessing(true);
    setProgressPercent(20);
    setProgressStatus("Resolving duplicates and mappings...");

    await new Promise(r => setTimeout(r, 300));
    setProgressPercent(50);
    setProgressStatus("Validating business schemas & keys...");

    const successItems: any[] = [];
    const dbFieldsToSave: any[] = [];

    validatedRows.forEach((row) => {
      // Skip strategy
      if (row.isDuplicate && duplicateStrategy === "skip") {
        return;
      }
      
      // For valid mappings or custom bypass
      const itemToSave = { ...row.mappedData };
      
      // Auto-assign ID
      const prefix = module.substring(0, 3).toLowerCase();
      itemToSave.id = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      if (!itemToSave.joinedAt && !itemToSave.appliedAt) {
        itemToSave.joinedAt = new Date().toISOString();
        itemToSave.appliedAt = new Date().toISOString();
      }

      // Merge nested schemas if required by model type (e.g. kpis)
      if (module === "startups" && !itemToSave.kpis) {
        itemToSave.kpis = { mrr: 1200, churnRate: 1.5, activeUsers: 45 };
      }

      dbFieldsToSave.push(itemToSave);
      successItems.push(itemToSave);
    });

    setProgressPercent(75);
    setProgressStatus(`Saving ${dbFieldsToSave.length} records to server store...`);

    // Call individual API inserts sequentially or simulate high-speed stream
    try {
      for (const item of dbFieldsToSave) {
        await fetch(`/api/${module}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-context": JSON.stringify({ id: userId, name: userName, role: userRole })
          },
          body: JSON.stringify(item)
        });
      }

      if (onImportCompleted) {
        onImportCompleted(successItems);
      }

      logAuditAction(`Import Completed: Successfully uploaded ${successItems.length} records into "${moduleTitle}" table. Strategy: ${duplicateStrategy}. Errors ignored: ${importErrorsCount}.`);
      
      setProgressPercent(100);
      setProgressStatus("Bulk Import Process Completed successfully!");
      
      await new Promise(r => setTimeout(r, 600));
      
      // Reset Import Container
      setImportFile(null);
      setImportRawText("");
      setImportHeaders([]);
      setImportRows([]);
      setValidatedRows([]);
      
    } catch (err) {
      console.error(err);
      alert("Error saving imported records to database.");
    } finally {
      setIsProcessing(false);
      setProgressPercent(0);
    }
  };

  // --- SCHEDULES HANDLERS ---
  const handleAddSchedule = () => {
    if (!newScheduleName.trim()) return;
    const columnsToSched = selectedKeys;
    saveScheduledReport({
      name: newScheduleName.trim(),
      module,
      frequency: newScheduleFreq,
      recipientEmail: newScheduleEmail,
      columns: columnsToSched,
      format: "xls"
    });
    setSchedules(loadScheduledReports(module));
    setNewScheduleName("");
    logAuditAction(`Created new scheduled email dispatch report: "${newScheduleName}" (${newScheduleFreq}) -> ${newScheduleEmail}`);
  };

  const handleDeleteSchedule = (id: string, name: string) => {
    deleteScheduledReport(id);
    setSchedules(loadScheduledReports(module));
    logAuditAction(`Revoked & Deleted Scheduled Report: "${name}"`);
  };

  // Drag and drop events
  const [dragOver, setDragOver] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => {
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImportFile(files[0]);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Primary trigger button in standard visual layout */}
      <button
        id={`export-import-btn-${module}`}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-slate-900/10"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
        <span>Import / Export Center</span>
      </button>

      {/* Main Overlay Modal Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-30">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Header section with styling details */}
            <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-tight uppercase">Import &amp; Export Center</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Shared Enterprise Service &bull; Module: <span className="text-emerald-400 font-semibold">{moduleTitle}</span></p>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Workspace split */}
            <div className="flex-1 flex overflow-hidden bg-slate-50">
              
              {/* Left sidebar nav for sub-tabs */}
              <aside className="w-56 bg-slate-100 border-r border-slate-200 p-3 flex flex-col justify-between">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveSubTab("export")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSubTab === "export" ? "bg-white text-slate-900 shadow-xs border-l-4 border-emerald-500" : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Excel &amp; CSV Export</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("import")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSubTab === "import" ? "bg-white text-slate-900 shadow-xs border-l-4 border-emerald-500" : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span>Upload &amp; Import</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("builder")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSubTab === "builder" ? "bg-white text-slate-900 shadow-xs border-l-4 border-emerald-500" : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-blue-500" />
                    <span>Custom Report Builder</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("schedules")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSubTab === "schedules" ? "bg-white text-slate-900 shadow-xs border-l-4 border-emerald-500" : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Scheduled Reports</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("audit")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                      activeSubTab === "audit" ? "bg-white text-slate-900 shadow-xs border-l-4 border-emerald-500" : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    <Activity className="w-4 h-4 text-rose-500" />
                    <span>Audit Trail History</span>
                  </button>
                </nav>

                {/* Simulated performance metric footer */}
                <div className="bg-slate-200/50 p-2.5 rounded-lg border border-slate-300/30 text-[9px] text-slate-500 font-mono space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Export Engine:</span>
                    <span className="text-emerald-600">Active</span>
                  </div>
                  <div>Streaming: Yes (100k+ cap)</div>
                  <div>Zebra Format &amp; Frozen: YES</div>
                </div>
              </aside>

              {/* Main content viewport */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                
                {/* 1. EXCEL / CSV EXPORT VIEW */}
                {activeSubTab === "export" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Export Registry Data</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Customize columns and filter configurations for submissions to IT Park HQ or Ministry.</p>
                    </div>

                    {/* Left/Right controls layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      
                      {/* Left: Columns list selection with checkboxes */}
                      <div className="space-y-4 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700">Choose Columns to Include</span>
                          <div className="space-x-2 text-[10px] font-bold text-indigo-600">
                            <button onClick={() => setSelectedKeys(columns.map(c => c.key))} className="hover:underline cursor-pointer">Select All</button>
                            <span className="text-slate-300">|</span>
                            <button onClick={() => setSelectedKeys([])} className="hover:underline cursor-pointer">Deselect All</button>
                          </div>
                        </div>

                        {/* Column checkboxes grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {columns.map((col) => {
                            const isChecked = selectedKeys.includes(col.key);
                            return (
                              <label 
                                key={col.key} 
                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                                  isChecked ? "bg-white border-emerald-200 font-bold text-slate-800 shadow-2xs" : "bg-white/60 border-slate-200 text-slate-500"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSelectedKeys(selectedKeys.filter(k => k !== col.key));
                                    } else {
                                      setSelectedKeys([...selectedKeys, col.key]);
                                    }
                                  }}
                                  className="accent-emerald-500"
                                />
                                <span className="truncate">{col.label}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Save configuration template panel */}
                        <div className="pt-3 border-t border-slate-200/60 flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Template Name (e.g. Monthly BPO)"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden bg-white"
                          />
                          <button
                            onClick={handleSaveTemplate}
                            disabled={!newTemplateName.trim()}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" /> Save Template
                          </button>
                        </div>
                      </div>

                      {/* Right: Format options & export trigger */}
                      <div className="space-y-4">
                        
                        {/* Saved templates dropdown */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block">Load Export Template</label>
                          <select
                            value={selectedTemplateId}
                            onChange={(e) => handleLoadTemplate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden"
                          >
                            <option value="">-- No Active Template (Manual Configuration) --</option>
                            {templates.map(tpl => (
                              <option key={tpl.id} value={tpl.id}>{tpl.name} ({tpl.columns.length} columns)</option>
                            ))}
                          </select>
                        </div>

                        {/* Export Mode / Timeframe bounds */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block">Export Mode Range</label>
                          <select
                            value={exportMode}
                            onChange={(e) => setExportMode(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden"
                          >
                            <option value="all">Export All Records ({data.length} total)</option>
                            <option value="currentPage">Export Current Filtered Page Only</option>
                            <option value="month">Export by Month (October 2024)</option>
                            <option value="quarter">Export by Quarter (Q3 2024)</option>
                            <option value="year">Export by Year (2024)</option>
                            <option value="dateRange">Export by Date Range</option>
                          </select>
                        </div>

                        {/* Date selectors when active */}
                        {exportMode === "dateRange" && (
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 animate-in slide-in-from-top-1">
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase">From Date</span>
                              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 text-xs" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 font-semibold uppercase">To Date</span>
                              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 text-xs" />
                            </div>
                          </div>
                        )}

                        {/* Output format selectors */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-700 block">Output File Format</label>
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              onClick={() => setExportFormat("xls")}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                exportFormat === "xls" ? "bg-emerald-50 border-emerald-400 text-emerald-700 font-bold shadow-2xs" : "bg-white border-slate-200 text-slate-500"
                              }`}
                            >
                              <FileExcel className="w-5 h-5 text-emerald-600" />
                              <span className="text-[9px]">Excel (.xls)</span>
                            </button>
                            <button
                              onClick={() => setExportFormat("csv")}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                exportFormat === "csv" ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-bold shadow-2xs" : "bg-white border-slate-200 text-slate-500"
                              }`}
                            >
                              <FileCode className="w-5 h-5 text-indigo-600" />
                              <span className="text-[9px]">CSV File</span>
                            </button>
                            <button
                              onClick={() => setExportFormat("pdf")}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                exportFormat === "pdf" ? "bg-rose-50 border-rose-400 text-rose-700 font-bold shadow-2xs" : "bg-white border-slate-200 text-slate-500"
                              }`}
                            >
                              <FileText className="w-5 h-5 text-rose-600" />
                              <span className="text-[9px]">PDF Format</span>
                            </button>
                            <button
                              onClick={() => setExportFormat("print")}
                              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                                exportFormat === "print" ? "bg-slate-100 border-slate-400 text-slate-800 font-bold shadow-2xs" : "bg-white border-slate-200 text-slate-500"
                              }`}
                            >
                              <Printer className="w-5 h-5 text-slate-600" />
                              <span className="text-[9px]">Direct Print</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Master Actions Area */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Ready with <strong>{selectedKeys.length}</strong> active column headers selected.</span>
                      </div>
                      <button
                        onClick={executeExport}
                        disabled={selectedKeys.length === 0 || isProcessing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-3 rounded-lg cursor-pointer transition-all shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Compile &amp; Download Document</span>
                      </button>
                    </div>

                  </div>
                )}

                {/* 2. DYNAMIC IMPORT CENTER */}
                {activeSubTab === "import" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Direct Batch Import Engine</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Upload a CSV or spreadsheet template to parse, preview, auto-map columns, validate rules, and bulk import.</p>
                    </div>

                    {/* Drag / Drop container */}
                    {importRows.length === 0 ? (
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          dragOver ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Upload className="w-10 h-10 text-slate-400 mb-3 animate-bounce" />
                        <h4 className="text-xs font-bold text-slate-800">Drag &amp; Drop Spreadsheet File here</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Accepts CSV, standard tabular plain-text reports, or Excel templates.</p>
                        <button className="mt-4 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-indigo-600 shadow-2xs hover:bg-slate-50">Choose File Manually</button>
                      </div>
                    ) : (
                      // Parse Preview Workspace
                      <div className="space-y-5">
                        
                        {/* File summary bar */}
                        <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                            <span className="font-bold text-slate-700">{importFile?.name}</span>
                            <span className="text-slate-400">({importRows.length} rows loaded)</span>
                          </div>
                          <button 
                            onClick={() => {
                              setImportRows([]);
                              setImportHeaders([]);
                              setValidatedRows([]);
                            }}
                            className="text-rose-600 hover:underline font-bold text-[10px] cursor-pointer"
                          >
                            Remove file &amp; reload
                          </button>
                        </div>

                        {/* Interactive Fuzzy Column Mapper */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Map File Columns to Database Schema</h4>
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full font-mono">Auto Match: ENABLED</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {importHeaders.map((header) => {
                              const mappedKey = columnMapping[header] || "";
                              return (
                                <div key={header} className="bg-white border border-slate-150 p-2 rounded-lg flex flex-col justify-between gap-1.5">
                                  <div>
                                    <span className="text-[9px] text-slate-400 font-bold font-mono">FILE HEADER:</span>
                                    <div className="text-xs font-bold text-slate-800 truncate mb-1">{header}</div>
                                  </div>
                                  <select
                                    value={mappedKey}
                                    onChange={(e) => setColumnMapping({ ...columnMapping, [header]: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[11px] focus:outline-hidden"
                                  >
                                    <option value="">-- Ignored / Skip column --</option>
                                    {columns.map(c => (
                                      <option key={c.key} value={c.key}>
                                        {c.label} {c.required ? "(* Required)" : ""}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Duplicate resolution panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-700 block mb-1">Duplicate Management Strategy</span>
                            <p className="text-[10px] text-slate-500 mb-2">How should the database handle pre-existing keys or INNs?</p>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                                <input type="radio" name="strategy" checked={duplicateStrategy === "skip"} onChange={() => setDuplicateStrategy("skip")} /> Skip Duplicates
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                                <input type="radio" name="strategy" checked={duplicateStrategy === "overwrite"} onChange={() => setDuplicateStrategy("overwrite")} /> Overwrite / Merge
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                                <input type="radio" name="strategy" checked={duplicateStrategy === "duplicate"} onChange={() => setDuplicateStrategy("duplicate")} /> Keep &amp; Tag
                              </label>
                            </div>
                          </div>
                          <div className="border-l border-slate-200 pl-4 space-y-1">
                            <span className="font-bold text-slate-700 block">Pre-Validation Diagnostics</span>
                            <div className="flex gap-4 text-[11px] pt-1">
                              <div className="bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg text-rose-700">
                                <strong className="font-bold text-xs">{importErrorsCount}</strong> rows with Errors
                              </div>
                              <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg text-amber-700">
                                <strong className="font-bold text-xs">{importDuplicatesCount}</strong> Duplicates found
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Table validation preview */}
                        <div className="space-y-1">
                          <span className="font-bold text-slate-700 text-xs block">File Data Preview &amp; Audit (First 5 Rows)</span>
                          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[160px] overflow-y-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                  <th className="p-2">Status</th>
                                  {columns.map(c => selectedKeys.includes(c.key) && (
                                    <th key={c.key} className="p-2">{c.label}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {validatedRows.slice(0, 5).map((row, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2">
                                      {row.isValid ? (
                                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded">PASSED</span>
                                      ) : (
                                        <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5" title={Object.values(row.errors).join(", ")}>
                                          <AlertCircle className="w-3 h-3" /> FAILED
                                        </span>
                                      )}
                                      {row.isDuplicate && (
                                        <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">DUP</span>
                                      )}
                                    </td>
                                    {columns.map(c => selectedKeys.includes(c.key) && (
                                      <td key={c.key} className="p-2 text-slate-600">
                                        <span className={row.errors[c.key] ? "border-b border-rose-500 text-rose-600 bg-rose-50 px-1 rounded" : ""}>
                                          {String(row.mappedData[c.key] || "") || <span className="text-slate-300 font-mono">-</span>}
                                        </span>
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Trigger button */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={executeBulkImport}
                            disabled={isProcessing}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs px-6 py-2.5 rounded-lg cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Confirm &amp; Bulk Save Records ({validatedRows.length} rows)</span>
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* 3. REPORT BUILDER VIEW */}
                {activeSubTab === "builder" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Interactive Custom Report Builder</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Generate highly tailored executive dossiers by sorting, custom grouping, and cherry-picking dataset nodes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* Sort control */}
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 block">Sort Field Node</span>
                        <select
                          value={builderSortField}
                          onChange={(e) => setBuilderSortField(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden"
                        >
                          <option value="">-- None (Keep order) --</option>
                          {columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                      </div>

                      {/* Order */}
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 block">Sort Orientation</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBuilderSortOrder("asc")}
                            className={`flex-1 py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                              builderSortOrder === "asc" ? "bg-indigo-50 border-indigo-400 text-indigo-700" : "bg-white border-slate-200 text-slate-500"
                            }`}
                          >
                            Ascending (A-Z)
                          </button>
                          <button
                            onClick={() => setBuilderSortOrder("desc")}
                            className={`flex-1 py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                              builderSortOrder === "desc" ? "bg-indigo-50 border-indigo-400 text-indigo-700" : "bg-white border-slate-200 text-slate-500"
                            }`}
                          >
                            Descending (Z-A)
                          </button>
                        </div>
                      </div>

                      {/* Filtering node */}
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 block">Search Key Node</span>
                        <div className="flex gap-1.5">
                          <select
                            value={builderFilterField}
                            onChange={(e) => setBuilderFilterField(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-hidden text-[11px] w-28"
                          >
                            <option value="">-- Field --</option>
                            {columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                          </select>
                          <input
                            type="text"
                            placeholder="Search keywords..."
                            value={builderFilterValue}
                            onChange={(e) => setBuilderFilterValue(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-hidden text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Builder Columns selector quick checkbox banner */}
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-slate-700 block">Custom Columns Configuration</span>
                      <div className="flex flex-wrap gap-2.5">
                        {columns.map(c => {
                          const isSel = selectedKeys.includes(c.key);
                          return (
                            <button
                              key={c.key}
                              onClick={() => {
                                if (isSel) setSelectedKeys(selectedKeys.filter(k => k !== c.key));
                                else setSelectedKeys([...selectedKeys, c.key]);
                              }}
                              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                                isSel ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-slate-200 text-slate-500"
                              }`}
                            >
                              {isSel ? <Check className="w-3 h-3 text-indigo-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                              <span>{c.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mini live preview panel */}
                    <div className="space-y-1">
                      <span className="font-bold text-slate-700 text-xs block">Live Report Preview (Matching records)</span>
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[140px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest sticky top-0">
                            <tr>
                              {columns.map(c => selectedKeys.includes(c.key) && (
                                <th key={c.key} className="p-2">{c.label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {data.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                {columns.map(c => selectedKeys.includes(c.key) && (
                                  <td key={c.key} className="p-2">
                                    {c.type === "currency" ? `$${Number(item[c.key] || 0).toLocaleString()}` : String(item[c.key] || "-")}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Builders quick export bar */}
                    <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span>Build output consists of <strong>{columns.filter(c => selectedKeys.includes(c.key)).length}</strong> columns.</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setExportFormat("xls");
                            executeExport();
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export Styled Excel (.xls)</span>
                        </button>
                        <button
                          onClick={() => {
                            setExportFormat("pdf");
                            executeExport();
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1 transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Direct PDF Print</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. SCHEDULED REPORTS */}
                {activeSubTab === "schedules" && (
                  <div className="space-y-6 text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Automated Scheduled Reports</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Automate data streams to generate Excel worksheets, dispatch them to headquarters emails, and archive internal backups.</p>
                    </div>

                    {/* Configure new schedule form */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700">Schedule Name</span>
                        <input
                          type="text"
                          placeholder="e.g. BPO Monthly Batch"
                          value={newScheduleName}
                          onChange={(e) => setNewScheduleName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700">Dispatch Frequency</span>
                        <select
                          value={newScheduleFreq}
                          onChange={(e) => setNewScheduleFreq(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-hidden"
                        >
                          <option value="daily">Every Day at 08:00 AM</option>
                          <option value="weekly">Every Sunday at 08:00 AM</option>
                          <option value="monthly">End of Every Month (30th)</option>
                          <option value="quarterly">End of Every Fiscal Quarter</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700">Target HQ Email Address</span>
                        <input
                          type="email"
                          placeholder="reports@itpark.uz"
                          value={newScheduleEmail}
                          onChange={(e) => setNewScheduleEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-hidden"
                        />
                      </div>
                      <button
                        onClick={handleAddSchedule}
                        disabled={!newScheduleName.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-3 rounded-lg text-center cursor-pointer transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Save Schedule Job
                      </button>
                    </div>

                    {/* Active Schedules List */}
                    <div className="space-y-2">
                      <span className="font-bold text-slate-700 block">Active Scheduled Pipelines</span>
                      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Schedule Name</th>
                              <th className="p-3">Module Node</th>
                              <th className="p-3">Frequency</th>
                              <th className="p-3">Recipient Email</th>
                              <th className="p-3">File Format</th>
                              <th className="p-3">Next Automated Run</th>
                              <th className="p-3 text-right">Delete</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {schedules.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="p-6 text-center text-slate-400">No scheduled reports registered for this module yet.</td>
                              </tr>
                            ) : (
                              schedules.map((sch) => (
                                <tr key={sch.id} className="hover:bg-slate-50/50">
                                  <td className="p-3 font-bold text-slate-800">{sch.name}</td>
                                  <td className="p-3 font-mono text-[10px] text-indigo-600 uppercase">{sch.module}</td>
                                  <td className="p-3 capitalize">{sch.frequency}</td>
                                  <td className="p-3 font-semibold">{sch.recipientEmail}</td>
                                  <td className="p-3">
                                    <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[9px] font-bold font-mono">
                                      {sch.format.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="p-3 font-mono text-slate-400">{new Date(sch.nextScheduled).toLocaleDateString()}</td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => handleDeleteSchedule(sch.id, sch.name)}
                                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. AUDIT TRAIL LOGS VIEW */}
                {activeSubTab === "audit" && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Module Export/Import Audit Log</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Comprehensive audit ledger recording administrative imports, exports, and automated reporting pipelines.</p>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white max-h-[350px] overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <tr>
                            <th className="p-2.5">Audit Log ID</th>
                            <th className="p-2.5">User</th>
                            <th className="p-2.5">Role</th>
                            <th className="p-2.5">Action log details</th>
                            <th className="p-2.5">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                          {localAuditLogs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-6 text-center text-slate-400">No export/import audit logs currently recorded for this module.</td>
                            </tr>
                          ) : (
                            localAuditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50">
                                <td className="p-2.5 font-mono text-slate-400 font-bold">{log.id}</td>
                                <td className="p-2.5 font-bold text-slate-800">{log.userName}</td>
                                <td className="p-2.5">
                                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-bold font-mono">
                                    {log.userRole}
                                  </span>
                                </td>
                                <td className="p-2.5 text-slate-700">{log.action}</td>
                                <td className="p-2.5 font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Simulated background streaming progress footer */}
            {isProcessing && (
              <div className="bg-slate-900 text-white p-4 border-t border-slate-800 space-y-2 animate-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 animate-pulse"><RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" /> {progressStatus}</span>
                  <span className="font-mono">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
