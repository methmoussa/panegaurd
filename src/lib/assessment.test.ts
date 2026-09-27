import { describe, expect, it } from "vitest";
import type { AssessmentAnswers } from "../types";
import { assessWindow, getAssessmentFactors } from "./assessment";
import { SAMPLE_ANSWERS } from "./sample";

const lowAnswers: AssessmentAnswers = {
  reflection: "little",
  vegetation: "none",
  birdActivity: "no",
  lighting: "rarely",
  existingTreatment: "pattern",
  previousCollision: "no",
};

describe("assessment screening heuristic", () => {
  it("returns LOW for few observed factors", () => {
    const result = assessWindow(lowAnswers);
    expect(result.priority).toBe("LOW");
    expect(result.score).toBe(0);
    expect(result.factors).toEqual([]);
  });

  it("returns MODERATE for a middle range of factors", () => {
    const result = assessWindow({
      ...lowAnswers,
      reflection: "sky",
      vegetation: "some",
      birdActivity: "yes",
      existingTreatment: "few-decals",
    });
    expect(result.priority).toBe("MODERATE");
    expect(result.score).toBe(4);
  });

  it("returns HIGH when several factors are present", () => {
    const result = assessWindow(SAMPLE_ANSWERS);
    expect(result.priority).toBe("HIGH");
    expect(result.score).toBe(9);
    expect(result.factors.map((item) => item.id)).toEqual([
      "reflection",
      "vegetation",
      "birdActivity",
      "lighting",
      "existingTreatment",
    ]);
  });

  it("meaningfully raises priority after an observed collision", () => {
    const answers: AssessmentAnswers = {
      ...lowAnswers,
      reflection: "buildings",
      vegetation: "some",
      existingTreatment: "none",
    };
    expect(assessWindow(answers).priority).toBe("MODERATE");
    const observed = assessWindow({ ...answers, previousCollision: "yes" });
    expect(observed.priority).toBe("HIGH");
    expect(observed.factors.some((item) => item.id === "previousCollision")).toBe(true);
  });

  it("keeps a previously collided window at least MODERATE even if protected", () => {
    const result = assessWindow({ ...lowAnswers, previousCollision: "yes" });
    expect(result.score).toBe(1);
    expect(result.priority).toBe("MODERATE");
  });

  it("lowers priority with a closely spaced exterior treatment", () => {
    const noProtection = assessWindow(SAMPLE_ANSWERS);
    const protectedResult = assessWindow({ ...SAMPLE_ANSWERS, existingTreatment: "screen" });
    expect(noProtection.priority).toBe("HIGH");
    expect(protectedResult.priority).toBe("MODERATE");
    expect(protectedResult.score).toBe(4);
    expect(protectedResult.factors.some((item) => item.id === "existingTreatment")).toBe(false);
  });

  it("never emits NaN or a negative score for corrupted saved answers", () => {
    const malformed = {
      ...lowAnswers,
      reflection: "invalid",
      vegetation: "invalid",
      lighting: "invalid",
    } as unknown as AssessmentAnswers;
    const result = assessWindow(malformed);
    expect(Number.isFinite(result.score)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(["LOW", "MODERATE", "HIGH"]).toContain(result.priority);
  });

  it("only explains selected answers", () => {
    const factors = getAssessmentFactors({
      ...lowAnswers,
      reflection: "trees",
      lighting: "often",
    });
    expect(factors.map((item) => item.id)).toEqual(["reflection", "lighting"]);
  });
});
