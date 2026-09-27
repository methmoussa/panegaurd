import type { AssessmentAnswers, DimensionUnit, VisualizerSettings } from "@/types";
import { ASSESSMENT_CONFIG } from "./assessment";
import { DEFAULT_VISUALIZER_SETTINGS, PATTERN_OPTIONS, normalizeSpacingInches } from "./patterns";

export function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

export function sanitizeAnswers(value: unknown): Partial<AssessmentAnswers> {
  const data = record(value);
  const entries = Object.entries(ASSESSMENT_CONFIG.weights).flatMap(([key, options]) =>
    typeof data[key] === "string" && Object.hasOwn(options, data[key]) ? [[key, data[key]]] : []);
  return Object.fromEntries(entries);
}

export function completeAnswers(value: unknown): value is AssessmentAnswers {
  return Object.keys(sanitizeAnswers(value)).length === Object.keys(ASSESSMENT_CONFIG.weights).length;
}

export function sanitizeSettings(value: unknown): VisualizerSettings {
  const data = record(value);
  return {
    pattern: PATTERN_OPTIONS.find(option => option.value === data.pattern)?.value ?? "dots",
    markerSize: typeof data.markerSize === "number" && Number.isFinite(data.markerSize)
      ? data.markerSize < .3125 ? .25 : data.markerSize < .4375 ? .375 : .5 : DEFAULT_VISUALIZER_SETTINGS.markerSize,
    opacity: typeof data.opacity === "number" && Number.isFinite(data.opacity)
      ? Math.min(1, Math.max(.65, data.opacity)) : DEFAULT_VISUALIZER_SETTINGS.opacity,
    contrast: data.contrast === "dark" ? "dark" : "light",
    spacingInches: normalizeSpacingInches(typeof data.spacingInches === "number" ? data.spacingInches : 2),
  };
}

export function sanitizeUnit(value: unknown): DimensionUnit {
  return value === "cm" || value === "ft" ? value : "in";
}

export function dimensionText(value: unknown): string {
  return typeof value === "string" && value.length <= 24 && value.trim() && Number.isFinite(Number(value)) && Number(value) > 0 ? value : "";
}

export function localImage(value: unknown): string | null {
  return typeof value === "string" && (value === "/sample-window.svg" ||
    (value.length <= 2_000_000 && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value))) ? value : null;
}
