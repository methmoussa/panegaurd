import { describe, expect, it } from "vitest";
import { assessWindow } from "./assessment";
import { buildActionPlan, calculateTreatmentLayout, hasValidDimensions, toInches } from "./calculator";
import { MAX_SPACING_INCHES } from "./patterns";
import { SAMPLE_ANSWERS, SAMPLE_DIMENSIONS } from "./sample";

describe("treatment layout", () => {
  const dimensions = { width: 36, height: 60, unit: "in" } as const;

  it("calculates columns, rows, area, and marker count", () => {
    const layout = calculateTreatmentLayout(dimensions, "dots");
    expect(layout).not.toBeNull();
    expect(layout).toMatchObject({
      columns: 19,
      rows: 31,
      approximateMarkers: 589,
      estimatedCount: 589,
      estimatedUnit: "markers",
      areaSquareFeet: 15,
    });
  });

  it("counts vertical, horizontal, and grid lines", () => {
    expect(calculateTreatmentLayout(dimensions, "vertical")).toMatchObject({
      verticalLineCount: 19,
      estimatedCount: 19,
      estimatedUnit: "lines",
    });
    expect(calculateTreatmentLayout(dimensions, "horizontal")).toMatchObject({
      horizontalLineCount: 31,
      estimatedCount: 31,
      estimatedUnit: "lines",
    });
    expect(calculateTreatmentLayout(dimensions, "grid")).toMatchObject({
      verticalLineCount: 19,
      horizontalLineCount: 31,
      estimatedCount: 50,
      estimatedUnit: "lines",
    });
  });

  it("counts decorative motifs as repeated placement points", () => {
    expect(calculateTreatmentLayout(dimensions, "leaves")?.estimatedCount).toBe(589);
    expect(calculateTreatmentLayout(dimensions, "stars")?.estimatedCount).toBe(589);
  });

  it("converts centimeters and feet to inches", () => {
    expect(toInches(2.54, "cm")).toBeCloseTo(1);
    expect(toInches(3, "ft")).toBe(36);
    expect(calculateTreatmentLayout({ width: 91.44, height: 152.4, unit: "cm" }, "dots")).toMatchObject({
      columns: 19,
      rows: 31,
      approximateMarkers: 589,
    });
  });

  it("caps a requested wider gap at two inches", () => {
    const layout = calculateTreatmentLayout(dimensions, "dots", 5);
    expect(layout?.spacingInches).toBe(MAX_SPACING_INCHES);
    expect(layout?.approximateMarkers).toBe(589);
  });

  it("handles invalid dimensions without generating unusable estimates", () => {
    expect(hasValidDimensions({ width: 0, height: 60, unit: "in" })).toBe(false);
    expect(calculateTreatmentLayout({ width: -5, height: 60, unit: "in" }, "dots")).toBeNull();
    expect(calculateTreatmentLayout({ width: Number.NaN, height: 60, unit: "in" }, "dots")).toBeNull();
    expect(calculateTreatmentLayout({ width: 36, height: 60, unit: "in" }, "dots", 1e-320)?.spacingInches).toBe(1);
    expect(calculateTreatmentLayout(null, "dots")).toBeNull();
  });

  it("builds actions from actual lighting and collision answers", () => {
    const answers = { ...SAMPLE_ANSWERS, previousCollision: "yes" } as const;
    const assessment = assessWindow(answers);
    const layout = calculateTreatmentLayout(SAMPLE_DIMENSIONS, "leaves");
    expect(layout).not.toBeNull();
    const plan = buildActionPlan(answers, assessment, SAMPLE_DIMENSIONS, "leaves", layout!);
    expect(plan.design).toBe("leaves");
    expect(plan.priority).toBe("HIGH");
    expect(plan.actions).toEqual(expect.arrayContaining([
      expect.stringContaining("nighttime lighting"),
      expect.stringContaining("collisions continue"),
    ]));
  });
});
