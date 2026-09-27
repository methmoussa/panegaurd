import type {
  AssessmentAnswers,
  AssessmentResult,
  FactorExplanation,
  PriorityLevel,
} from "../types";

type AssessmentWeights = {
  [Field in keyof AssessmentAnswers]: Readonly<Record<AssessmentAnswers[Field], number>>;
};

/**
 * Screening rules live together here so that the heuristic is inspectable and
 * can be tuned without changing the UI. Points are not a probability model.
 */
export const ASSESSMENT_CONFIG: {
  readonly weights: AssessmentWeights;
  readonly moderateAt: number;
  readonly highAt: number;
  readonly previousCollisionMinimum: PriorityLevel;
} = {
  weights: {
    reflection: { trees: 3, sky: 2, mixed: 2, buildings: 1, little: 0, unsure: 1 },
    vegetation: { lots: 2, some: 1, none: 0 },
    birdActivity: { yes: 1, no: 0, unsure: 0.5 },
    lighting: { often: 2, sometimes: 1, rarely: 0 },
    existingTreatment: { pattern: -3, screen: -3, "few-decals": 0, none: 2, unsure: 1 },
    previousCollision: { yes: 4, no: 0, unsure: 0 },
  },
  moderateAt: 4,
  highAt: 8,
  previousCollisionMinimum: "MODERATE",
};

export const PRIORITY_EXPLANATIONS: Readonly<Record<PriorityLevel, string>> = {
  HIGH: "Several characteristics associated with bird-window collisions are present. This window is a strong candidate for treatment.",
  MODERATE: "Some potential collision factors are present. A visible exterior treatment can make the glass easier for birds to recognize as a barrier.",
  LOW: "Fewer common collision factors were identified, but no questionnaire can guarantee that a window is collision-free.",
};

/** Handles older or corrupted browser session data without yielding NaN. */
function safeWeight<T extends string>(weights: Readonly<Record<T, number>>, answer: T): number {
  const value = weights[answer];
  return Number.isFinite(value) ? value : 0;
}

function factor(
  id: FactorExplanation["id"],
  label: string,
  detail: string,
): FactorExplanation {
  return { id, label, detail };
}

/** Only describes observations the user actually selected. */
export function getAssessmentFactors(answers: AssessmentAnswers): FactorExplanation[] {
  const factors: FactorExplanation[] = [];

  switch (answers.reflection) {
    case "trees":
      factors.push(factor("reflection", "Strong vegetation reflection", "Reflected trees may appear to birds as flyable habitat."));
      break;
    case "sky":
      factors.push(factor("reflection", "Open-sky reflection", "Reflected sky can make glass difficult for birds to recognize."));
      break;
    case "mixed":
      factors.push(factor("reflection", "Vegetation reflected in glass", "The reflection includes habitat cues birds may fly toward."));
      break;
    case "buildings":
      factors.push(factor("reflection", "Noticeable reflection", "Visible reflections can make the glass less obvious as a barrier."));
      break;
    case "unsure":
      factors.push(factor("reflection", "Reflection needs a closer look", "Check the glass from outside at different times of day."));
      break;
  }

  if (answers.vegetation === "lots") {
    factors.push(factor("vegetation", "Nearby vegetation", "Plants close to the window may also appear in reflections."));
  } else if (answers.vegetation === "some") {
    factors.push(factor("vegetation", "Some nearby vegetation", "Nearby plants can contribute to reflected habitat."));
  }

  if (answers.birdActivity === "yes") {
    factors.push(factor("birdActivity", "Bird gathering area nearby", "Birds regularly gather near this window."));
  } else if (answers.birdActivity === "unsure") {
    factors.push(factor("birdActivity", "Bird activity uncertain", "Watch for regular bird activity near the glass."));
  }

  if (answers.lighting === "often") {
    factors.push(factor("lighting", "Night lighting", "Lights regularly visible near this window may affect birds at night."));
  } else if (answers.lighting === "sometimes") {
    factors.push(factor("lighting", "Occasional night lighting", "Lights are sometimes visible near the glass at night."));
  }

  if (answers.existingTreatment === "none") {
    factors.push(factor("existingTreatment", "No exterior treatment", "No closely spaced marking or screen is currently on the outside surface."));
  } else if (answers.existingTreatment === "few-decals") {
    factors.push(factor("existingTreatment", "Only a few decals", "Widely spaced individual decals leave much of the glass unmarked."));
  } else if (answers.existingTreatment === "unsure") {
    factors.push(factor("existingTreatment", "Treatment not confirmed", "Check whether a closely spaced treatment is visible on the outside surface."));
  }

  if (answers.previousCollision === "yes") {
    factors.push(factor("previousCollision", "Previous collision observed", "A collision at this window is a reason to prioritize a closer look."));
  }

  return factors;
}

/** A transparent priority screen, not a predicted collision probability. */
export function assessWindow(answers: AssessmentAnswers): AssessmentResult {
  const { weights, moderateAt, highAt } = ASSESSMENT_CONFIG;
  const rawScore =
    safeWeight(weights.reflection, answers.reflection) +
    safeWeight(weights.vegetation, answers.vegetation) +
    safeWeight(weights.birdActivity, answers.birdActivity) +
    safeWeight(weights.lighting, answers.lighting) +
    safeWeight(weights.existingTreatment, answers.existingTreatment) +
    safeWeight(weights.previousCollision, answers.previousCollision);
  const score = Math.max(0, rawScore);

  let priority: PriorityLevel = score >= highAt ? "HIGH" : score >= moderateAt ? "MODERATE" : "LOW";
  if (answers.previousCollision === "yes" && priority === "LOW") {
    priority = ASSESSMENT_CONFIG.previousCollisionMinimum;
  }

  return {
    priority,
    score,
    factors: getAssessmentFactors(answers),
    explanation: PRIORITY_EXPLANATIONS[priority],
  };
}
