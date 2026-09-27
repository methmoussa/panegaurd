import type { PatternStyle, VisualizerSettings } from "../types";

/** Published 2 × 2 inch guidance informs this application's layout cap. */
export const MAX_SPACING_INCHES = 2;

export const DEFAULT_VISUALIZER_SETTINGS: VisualizerSettings = {
  pattern: "dots",
  markerSize: .375,
  opacity: 1,
  contrast: "light",
  spacingInches: MAX_SPACING_INCHES,
};

export const PATTERN_OPTIONS: ReadonlyArray<{
  value: PatternStyle;
  label: string;
  description: string;
}> = [
  { value: "dots", label: "Dots", description: "Minimal, closely spaced markers" },
  { value: "vertical", label: "Vertical lines", description: "Clean lines across the glass" },
  { value: "horizontal", label: "Horizontal lines", description: "Even bands from top to bottom" },
  { value: "grid", label: "Grid", description: "A quiet geometric pattern" },
  { value: "leaves", label: "Leaves", description: "A repeated botanical motif" },
  { value: "stars", label: "Stars", description: "A playful repeated motif" },
] as const;

export function patternLabel(style: PatternStyle): string {
  return PATTERN_OPTIONS.find((option) => option.value === style)?.label ?? "Dots";
}

/** Prevent saved or edited settings from requesting wider-than-guidance gaps. */
export function normalizeSpacingInches(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return MAX_SPACING_INCHES;
  return Math.max(1, Math.min(value, MAX_SPACING_INCHES));
}

export const MARKER_SIZES = [.25, .375, .5] as const;
export const MARKER_LABELS = ["Subtle", "Standard", "Bold"] as const;

export function physicalSize(pattern: PatternStyle, markerSize: number): number {
  return ["vertical", "horizontal", "grid"].includes(pattern) ? markerSize / 2 : markerSize;
}

export function sizeDescription(settings: VisualizerSettings): string {
  const size = physicalSize(settings.pattern, settings.markerSize);
  return `${size} in ${["vertical", "horizontal", "grid"].includes(settings.pattern) ? "line width" : settings.pattern === "dots" ? "dot diameter" : "solid core diameter"}`;
}
