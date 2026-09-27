import { afterEach, describe, expect, it, vi } from "vitest";
import { completeAnswers, sanitizeAnswers, sanitizeSettings, dimensionText, localImage } from "./validation";
import { DEFAULT_VISUALIZER_SETTINGS, physicalSize, PATTERN_OPTIONS } from "./patterns";
import { previewGeometry } from "./preview";
import { SAMPLE_ANSWERS } from "./sample";
import { calculateTreatmentLayout, convertDimension } from "./calculator";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("untrusted saved data", () => {
  it("requires all six valid enums and discards unknown fields", () => {
    expect(completeAnswers(SAMPLE_ANSWERS)).toBe(true);
    expect(completeAnswers({ ...SAMPLE_ANSWERS, reflection: "constructor" })).toBe(false);
    expect(sanitizeAnswers({ reflection: "sky", lighting: 3, extra: true })).toEqual({ reflection: "sky" });
    for (const value of [null, [], "text", 4]) expect(sanitizeAnswers(value)).toEqual({});
  });
  it("normalizes every persisted design field", () => {
    expect(sanitizeSettings({ pattern: "bad", markerSize: -1, opacity: Infinity, contrast: "red", spacingInches: 1e-300 })).toEqual({
      ...DEFAULT_VISUALIZER_SETTINGS, markerSize: .25, spacingInches: 1,
    });
    expect(sanitizeSettings({ markerSize: 1000, opacity: -5, spacingInches: 999 })).toMatchObject({ markerSize: .5, opacity: .65, spacingInches: 2 });
    for (const value of [null, [], "bad"]) expect(sanitizeSettings(value)).toEqual(DEFAULT_VISUALIZER_SETTINGS);
    for (const value of ["Infinity", "NaN", "-1", "", {}, "1e999"]) expect(dimensionText(value)).toBe("");
  });
  it("accepts only the bundled sample or local raster data", () => {
    expect(localImage("/sample-window.svg")).toBe("/sample-window.svg");
    expect(localImage("data:image/png;base64,AAAA")).not.toBeNull();
    for (const value of ["https://example.com/photo.jpg", "data:image/svg+xml;base64,AAAA", "data:image/png;base64,?"])
      expect(localImage(value)).toBeNull();
  });
  it("recovers from malformed JSON and invalid answers after a fresh load", async () => {
    const values = new Map([["paneguard.session.v1.answers", '{"reflection":"invalid"}'], ["paneguard.visualizer.v2", "{"]]);
    vi.stubGlobal("window", { sessionStorage: { getItem: (key: string) => values.get(key) ?? null } });
    const session = await import("./session");
    expect(session.loadAnswers()).toEqual({});
    expect(session.loadDesign().settings).toEqual(DEFAULT_VISUALIZER_SETTINGS);
    expect(session.loadImage()).toBeNull();
  });
  it("keeps the newest image and answers when storage is blocked", async () => {
    vi.stubGlobal("window", { get sessionStorage() { throw new Error("blocked"); } });
    const session = await import("./session");
    expect(session.saveImage("data:image/png;base64,AAAA")).toBe(false);
    session.saveAnswers(SAMPLE_ANSWERS);
    session.saveAssessmentStep(4);
    expect(session.loadImage()).toBe("data:image/png;base64,AAAA");
    expect(session.loadAnswers()).toEqual(SAMPLE_ANSWERS);
    expect(session.loadAssessmentStep()).toBe(4);
    session.clearImage();
    expect(session.loadImage()).toBeNull();
  });
  it("removes an older persisted image when the replacement exceeds quota", async () => {
    const values = new Map([["paneguard.session.v1.image", "/sample-window.svg"]]);
    vi.stubGlobal("window", { sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: () => { throw new Error("quota"); },
      removeItem: (key: string) => values.delete(key),
    } });
    const session = await import("./session");
    session.saveImage("data:image/jpeg;base64,AAAA");
    expect(values.has("paneguard.session.v1.image")).toBe(false);
    expect(session.loadSampleMode()).toBe(false);
  });
});

describe("physical planning", () => {
  it("keeps equivalent units stable through repeated conversions", () => {
    let width = "36", height = "60";
    for (let i = 0; i < 20; i++) {
      width = convertDimension(convertDimension(convertDimension(width, "in", "cm"), "cm", "ft"), "ft", "in");
      height = convertDimension(convertDimension(convertDimension(height, "in", "cm"), "cm", "ft"), "ft", "in");
    }
    expect(calculateTreatmentLayout({ width: Number(width), height: Number(height), unit: "in" }, "dots")?.estimatedCount).toBe(589);
    expect(convertDimension("0.01", "in", "ft")).not.toBe("0");
    for (const boundary of ["1", "240"]) {
      const width = Number(convertDimension(boundary, "in", "ft"));
      expect(calculateTreatmentLayout({ width, height: 5, unit: "ft" }, "dots")).not.toBeNull();
    }
  });
  it("rejects unrealistic panes without overflowing", () => {
    for (const width of [.01, 0, -1, 241, 1e300, Infinity, NaN])
      expect(calculateTreatmentLayout({ width, height: 60, unit: "in" }, "dots")).toBeNull();
  });
  it("uses at least a quarter-inch core and an eighth-inch stripe", () => {
    expect(physicalSize("dots", .25)).toBe(.25);
    expect(physicalSize("leaves", .25)).toBe(.25);
    expect(physicalSize("vertical", .25)).toBe(.125);
  });
  it("uses isotropic geometry at portrait, square, and extreme image ratios", () => {
    for (const ratio of [.1, .5, 1, 1.5, 4, 10]) for (const option of PATTERN_OPTIONS) {
      const geometry = previewGeometry({ ...DEFAULT_VISUALIZER_SETTINGS, pattern: option.value }, { width: 36, height: 60, unit: "in" }, ratio);
      expect(geometry.width / geometry.height).toBeCloseTo(ratio);
      expect(geometry.tileX).toBeGreaterThan(0);
      expect(geometry.tileY).toBeGreaterThan(0);
      expect(Number.isFinite(geometry.size)).toBe(true);
    }
    expect(previewGeometry(DEFAULT_VISUALIZER_SETTINGS, { width: 36, height: 60, unit: "in" }, .6).aspectMismatch).toBe(false);
    expect(previewGeometry(DEFAULT_VISUALIZER_SETTINGS, { width: 36, height: 60, unit: "in" }, 1.5).aspectMismatch).toBe(true);
  });
});
