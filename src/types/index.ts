/** Answers are observations supplied by the person assessing the window. */
export interface AssessmentAnswers {
  reflection: "trees" | "sky" | "mixed" | "buildings" | "little" | "unsure";
  vegetation: "lots" | "some" | "none";
  birdActivity: "yes" | "no" | "unsure";
  lighting: "often" | "sometimes" | "rarely";
  existingTreatment: "pattern" | "screen" | "few-decals" | "none" | "unsure";
  previousCollision: "yes" | "no" | "unsure";
}

export type PriorityLevel = "LOW" | "MODERATE" | "HIGH";

export interface FactorExplanation {
  id: keyof AssessmentAnswers;
  label: string;
  detail: string;
}

/** `score` is an internal screening value, never a collision probability. */
export interface AssessmentResult {
  priority: PriorityLevel;
  score: number;
  factors: FactorExplanation[];
  explanation: string;
}

export type PatternStyle =
  | "dots"
  | "vertical"
  | "horizontal"
  | "grid"
  | "leaves"
  | "stars";

export type DimensionUnit = "in" | "cm" | "ft";

export interface WindowDimensions {
  width: number;
  height: number;
  unit: DimensionUnit;
}

export interface VisualizerSettings {
  pattern: PatternStyle;
  /** Dot / solid motif core diameter in inches; stripe width is half this. */
  markerSize: number;
  /** Value from 0 to 1. */
  opacity: number;
  contrast: "light" | "dark";
  /** Requested maximum horizontal and vertical spacing, capped at two inches. */
  spacingInches: number;
}

export interface TreatmentLayout {
  widthInches: number;
  heightInches: number;
  areaSquareFeet: number;
  spacingInches: number;
  columns: number;
  rows: number;
  /** Placement points for dots, leaves, and stars. */
  approximateMarkers: number;
  verticalLineCount: number;
  horizontalLineCount: number;
  estimatedCount: number;
  estimatedUnit: "markers" | "lines";
}

export interface ActionPlan {
  priority: PriorityLevel;
  factors: FactorExplanation[];
  dimensions: WindowDimensions;
  design: PatternStyle;
  layout: TreatmentLayout;
  actions: string[];
  evidenceNote: string;
}
