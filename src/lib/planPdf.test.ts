import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createPlanPdf } from "./planPdf";
import { assessWindow } from "./assessment";
import { buildActionPlan, calculateTreatmentLayout } from "./calculator";
import { DEFAULT_VISUALIZER_SETTINGS } from "./patterns";
import { SAMPLE_ANSWERS, SAMPLE_DIMENSIONS } from "./sample";
import type { AssessmentAnswers, PatternStyle } from "../types";

describe("downloadable treatment PDF", () => {
  it("creates a readable single-page A4 sample with document metadata", async () => {
    const layout = calculateTreatmentLayout(SAMPLE_DIMENSIONS, "dots")!;
    const plan = buildActionPlan(SAMPLE_ANSWERS, assessWindow(SAMPLE_ANSWERS), SAMPLE_DIMENSIONS, "dots", layout);
    const bytes = await createPlanPdf(plan, DEFAULT_VISUALIZER_SETTINGS, true);
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getPage(0).getSize()).toEqual({ width: 595.28, height: 841.89 });
    expect(pdf.getTitle()).toBe("PaneGuard - Window treatment plan");
    if (process.env.PANEGUARD_PDF_OUTPUT) {
      await mkdir(dirname(process.env.PANEGUARD_PDF_OUTPUT), { recursive: true });
      await writeFile(process.env.PANEGUARD_PDF_OUTPUT, bytes);
    }
  });
  it("fits all designs at dimension extremes with the longest current assessment", async () => {
    const answers: AssessmentAnswers = { ...SAMPLE_ANSWERS, previousCollision: "yes", lighting: "often" };
    for (const pattern of ["dots", "vertical", "horizontal", "grid", "leaves", "stars"] as PatternStyle[]) {
      for (const width of [1, 240]) {
        const dimensions = { width, height: width, unit: "in" as const };
        const layout = calculateTreatmentLayout(dimensions, pattern, 1)!;
        const plan = buildActionPlan(answers, assessWindow(answers), dimensions, pattern, layout);
        const bytes = await createPlanPdf(plan, { ...DEFAULT_VISUALIZER_SETTINGS, pattern, spacingInches: 1 }, true);
        expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
      }
    }
  });
});
