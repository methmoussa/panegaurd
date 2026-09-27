import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { ActionPlan, VisualizerSettings } from "../types";
import { patternLabel, sizeDescription } from "./patterns";

/** Local vector PDF with selectable text. Loaded only when a download is requested. */
export async function createPlanPdf(plan: ActionPlan, settings: VisualizerSettings, isSample: boolean): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("PaneGuard - Window treatment plan");
  pdf.setAuthor("PaneGuard");
  pdf.setLanguage("en-US");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const ink = rgb(.1, .18, .14), green = rgb(.08, .3, .21), muted = rgb(.32, .39, .35);
  const paper = rgb(.97, .97, .94), rule = rgb(.82, .87, .81);
  const page = pdf.addPage([595.28, 841.89]);
  const left = 44, right = 551, span = right - left;
  let y = 791;

  function text(value: string, x: number, top: number, size = 10, font: PDFFont = regular, color = ink) {
    page.drawText(value, { x, y: top, size, font, color });
  }
  function lines(value: string, width: number, size = 10, font = regular) {
    const output: string[] = [];
    let line = "";
    for (const word of value.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(next, size) > width) { output.push(line); line = word; }
      else line = next;
    }
    if (line) output.push(line);
    return output;
  }
  function paragraph(value: string, x: number, top: number, width: number, size = 10, font = regular, color = ink) {
    const wrapped = lines(value, width, size, font);
    wrapped.forEach((line, index) => text(line, x, top - index * size * 1.45, size, font, color));
    return top - wrapped.length * size * 1.45;
  }
  function divider(top: number) {
    page.drawLine({ start: { x: left, y: top }, end: { x: right, y: top }, thickness: .7, color: rule });
  }

  text("PaneGuard", left, y, 24, serif, green);
  text("BIRD-FRIENDLY WINDOW PLAN", 366, y + 2, 9, bold, green);
  divider(y - 20);
  y -= 47;
  if (isSample) { text("DEMONSTRATION - sample window and example answers", left, y, 9, bold, muted); y -= 27; }
  text("TREATMENT PRIORITY", left, y, 9, bold, muted);
  text(plan.priority, left, y - 39, 35, serif, green);
  paragraph("Based on your observations. This screening heuristic does not predict collision probability.", 335, y - 8, 211, 10, regular, muted);
  y -= 65;

  page.drawRectangle({ x: left, y: y - 115, width: span, height: 115, color: paper });
  const number = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
  const layout = plan.layout;
  const count = plan.design === "grid" ? `${layout.verticalLineCount} vertical + ${layout.horizontalLineCount} horizontal lines`
    : plan.design === "vertical" ? `${layout.verticalLineCount} vertical lines`
    : plan.design === "horizontal" ? `${layout.horizontalLineCount} horizontal lines`
    : `${layout.columns} columns x ${layout.rows} rows (${layout.approximateMarkers} marks)`;
  const facts = [
    ["GLASS DIMENSIONS", `${number(plan.dimensions.width)} x ${number(plan.dimensions.height)} ${plan.dimensions.unit}`],
    ["SELECTED DESIGN", patternLabel(plan.design)],
    ["MAXIMUM INTERVAL", `${layout.spacingInches} inches`],
    ["APPROXIMATE LAYOUT", count],
  ];
  facts.forEach(([label, value], index) => {
    const x = left + 15 + (index % 2) * 250;
    const top = y - 20 - Math.floor(index / 2) * 51;
    text(label, x, top, 8, bold, muted);
    paragraph(value, x, top - 18, 227, 10, bold);
  });
  y -= 137;
  y = paragraph(`${sizeDescription(settings)}. ${settings.contrast === "light" ? "Light" : "Dark"} treatment. Use opaque material with strong contrast, visible from 10 feet. Preview opacity is only a simulation.`, left, y, span, 10, bold, green) - 15;

  text("What your answers show", left, y, 17, serif, green);
  y -= 24;
  const factors = plan.factors.length ? plan.factors.map(factor => factor.label).join("; ") + "."
    : "No prominent factors were selected. Low priority does not mean collision-proof; continue watching this window.";
  y = paragraph(factors, left, y, span, 10, regular, muted) - 21;
  text("Your next steps", left, y, 17, serif, green);
  y -= 25;
  for (const [index, action] of plan.actions.entries()) {
    text(`${index + 1}.`, left, y, 10, bold, green);
    y = paragraph(action, left + 20, y, span - 20) - 10;
  }
  y = paragraph("Counts are conservative edge-to-edge estimates. Measure each pane separately and follow the chosen product's installation instructions. Decorative motifs are not tested or certified products.", left, y - 4, span, 9, regular, muted) - 15;
  // Fail visibly instead of silently emitting a clipped document if future content grows.
  if (y < 115) throw new Error("This plan is too long for the PDF layout. Use Print / save as PDF instead.");
  divider(98);
  paragraph(plan.evidenceNote, left, 81, span, 8.5, regular, muted);
  text("Guidance: abcbirds.org/strategies/solutions-for-homes/", left, 46, 8.5, regular, green);
  text("1 / 1", right - 20, 46, 8, regular, muted);
  return pdf.save();
}
