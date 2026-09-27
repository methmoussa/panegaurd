import type { AssessmentAnswers, WindowDimensions } from "../types";

/** Clearly labelled demonstration inputs for the bundled sample window. */
export const SAMPLE_ANSWERS: AssessmentAnswers = {
  reflection: "trees",
  vegetation: "lots",
  birdActivity: "yes",
  lighting: "sometimes",
  existingTreatment: "none",
  previousCollision: "no",
};

export const SAMPLE_DIMENSIONS: WindowDimensions = {
  width: 60,
  height: 40,
  unit: "in",
};

export const SAMPLE_IMAGE_PATH = "/sample-window.svg";
