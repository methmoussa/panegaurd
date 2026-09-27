import type {
  ActionPlan,
  AssessmentAnswers,
  AssessmentResult,
  DimensionUnit,
  PatternStyle,
  TreatmentLayout,
  WindowDimensions,
} from "../types";
import { MAX_SPACING_INCHES, normalizeSpacingInches } from "./patterns";

const CENTIMETERS_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
export const MIN_DIMENSION_INCHES = 1;
export const MAX_DIMENSION_INCHES = 240;

export function convertDimension(value: string, previous: DimensionUnit, next: DimensionUnit): string {
  if (!value.trim() || !Number.isFinite(Number(value)) || Number(value) <= 0) return value;
  const inches = toInches(Number(value), previous);
  const converted = next === "in" ? inches : next === "ft" ? inches / 12 : inches * 2.54;
  return Number.isFinite(converted) ? String(Number(converted.toPrecision(12))) : "";
}

export function toInches(value: number, unit: DimensionUnit): number {
  if (!Number.isFinite(value)) return Number.NaN;
  switch (unit) {
    case "in":
      return value;
    case "cm":
      return value / CENTIMETERS_PER_INCH;
    case "ft":
      return value * INCHES_PER_FOOT;
    default:
      return Number.NaN;
  }
}

export function hasValidDimensions(dimensions: WindowDimensions | null | undefined): dimensions is WindowDimensions {
  if (!dimensions) return false;
  const width = toInches(dimensions.width, dimensions.unit);
  const height = toInches(dimensions.height, dimensions.unit);
  const withinBounds = (value: number) => Number.isFinite(value) &&
    value >= MIN_DIMENSION_INCHES - 1e-9 && value <= MAX_DIMENSION_INCHES + 1e-9;
  return withinBounds(width) && withinBounds(height);
}

/**
 * Places a mark at each edge and divides the span into gaps no larger than the
 * selected maximum. Product installation instructions may require more marks.
 */
export function calculateTreatmentLayout(
  dimensions: WindowDimensions | null | undefined,
  style: PatternStyle,
  requestedSpacingInches = MAX_SPACING_INCHES,
): TreatmentLayout | null {
  if (!hasValidDimensions(dimensions)) return null;

  const widthInches = toInches(dimensions.width, dimensions.unit);
  const heightInches = toInches(dimensions.height, dimensions.unit);
  const spacingInches = normalizeSpacingInches(requestedSpacingInches);
  // Ignore conversion noise at an integer boundary, not meaningful fractions.
  const columns = Math.ceil(widthInches / spacingInches - 1e-9) + 1;
  const rows = Math.ceil(heightInches / spacingInches - 1e-9) + 1;
  const approximateMarkers = columns * rows;
  const verticalLineCount = columns;
  const horizontalLineCount = rows;
  const areaSquareFeet = (widthInches * heightInches) / (INCHES_PER_FOOT ** 2);
  if (
    !Number.isSafeInteger(columns) ||
    !Number.isSafeInteger(rows) ||
    !Number.isSafeInteger(approximateMarkers) ||
    !Number.isFinite(areaSquareFeet)
  ) {
    return null;
  }
  const lineStyle = style === "vertical" || style === "horizontal" || style === "grid";
  const estimatedCount =
    style === "vertical"
      ? verticalLineCount
      : style === "horizontal"
        ? horizontalLineCount
        : style === "grid"
          ? verticalLineCount + horizontalLineCount
          : approximateMarkers;

  return {
    widthInches,
    heightInches,
    areaSquareFeet,
    spacingInches,
    columns,
    rows,
    approximateMarkers,
    verticalLineCount,
    horizontalLineCount,
    estimatedCount,
    estimatedUnit: lineStyle ? "lines" : "markers",
  };
}

/** Build plan content directly from the answers and selected treatment. */
export function buildActionPlan(
  answers: AssessmentAnswers,
  assessment: AssessmentResult,
  dimensions: WindowDimensions,
  design: PatternStyle,
  layout: TreatmentLayout,
): ActionPlan {
  const actions = [
    "Apply the visible treatment to the exterior surface, following the product instructions.",
    `Keep horizontal and vertical gaps at ${layout.spacingInches} ${layout.spacingInches === 1 ? "inch" : "inches"} or less.`,
    "Check periodically for missing or damaged markings.",
  ];

  if (answers.lighting === "often" || answers.lighting === "sometimes") {
    actions.push("Reduce unnecessary nighttime lighting near the window where practical.");
  }
  if (answers.previousCollision === "yes") {
    actions.push("Monitor this window after installation and revisit the treatment if collisions continue.");
  }

  return {
    priority: assessment.priority,
    factors: assessment.factors,
    dimensions,
    design,
    layout,
    actions,
    evidenceNote:
      "PaneGuard uses published bird-collision guidance to help plan a treatment. It does not certify a window as collision-proof.",
  };
}
