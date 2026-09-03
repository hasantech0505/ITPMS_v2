/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { EdoReport, EdoReportSection } from "../../types";

function statLine(label: string, value: string | number): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: false }),
      new TextRun({ text: String(value), bold: true }),
    ],
  });
}

function narrativeBlock(heading: string, body: string): Paragraph[] {
  const paras: Paragraph[] = [
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: heading, bold: true })],
    }),
  ];
  const text = (body || "").trim();
  if (!text) {
    paras.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "—", italics: true, color: "888888" })],
      })
    );
    return paras;
  }
  for (const chunk of text.split(/\n{2,}/)) {
    paras.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: chunk.trim() })],
      })
    );
  }
  return paras;
}

function sectionParagraphs(section: EdoReportSection): Paragraph[] {
  const out: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 320, after: 160 },
      children: [new TextRun({ text: section.title, bold: true })],
    }),
  ];

  if (section.summaryNarrative && section.summaryNarrative.trim()) {
    // Official-document style: one flowing paragraph instead of a bullet list.
    for (const chunk of section.summaryNarrative.trim().split(/\n{2,}/)) {
      out.push(
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: chunk.trim() })],
        })
      );
    }
  } else {
    out.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: "Asosiy ko'rsatkichlar", bold: true, italics: true })],
      })
    );
    for (const [label, value] of Object.entries(section.autoStats)) {
      out.push(statLine(label, value));
    }
    for (const m of section.manualStats) {
      if (!m.value.trim()) continue;
      out.push(statLine(m.label, m.value));
    }
  }

  for (const block of section.narrative) {
    out.push(...narrativeBlock(block.heading, block.body));
  }

  return out;
}

export async function buildEdoReportDocxBlob(report: EdoReport): Promise<Blob> {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new TextRun({ text: report.title, bold: true, size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: "МАЪЛУМОТ", bold: true, size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: report.periodLabel, italics: true })],
    }),
  ];

  for (const section of report.sections) {
    children.push(...sectionParagraphs(section));
  }

  // A4 (default for this Uzbek government document) - 11906 x 16838 DXA.
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { size: { width: 11906, height: 16838 } },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
