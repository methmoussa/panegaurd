import type { AssessmentAnswers, VisualizerSettings } from "@/types";
import { dimensionText, localImage, record, sanitizeAnswers, sanitizeSettings, sanitizeUnit } from "./validation";
import { hasValidDimensions } from "./calculator";

const PREFIX = "paneguard.session.v1";
const SETTINGS_KEY = "paneguard.visualizer.v2";
const memory = new Map<string, string | null>();

// Memory is authoritative for this tab when persistence is blocked or full.
function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try { return window.sessionStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string): boolean {
  memory.set(key, value);
  try { window.sessionStorage.setItem(key, value); return true; }
  catch {
    try { window.sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
    return false;
  }
}
function remove(key: string): void {
  memory.set(key, null);
  try { window.sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
}
function parse(key: string): unknown {
  try { return JSON.parse(read(key) ?? "null"); } catch { return null; }
}
export function saveAnswers(answers: Partial<AssessmentAnswers>): void {
  write(PREFIX + ".answers", JSON.stringify(sanitizeAnswers(answers)));
}
export function loadAnswers(): Partial<AssessmentAnswers> {
  return sanitizeAnswers(parse(PREFIX + ".answers"));
}
export function saveImage(src: string): boolean {
  const image = localImage(src);
  if (!image) { clearImage(); return false; }
  return write(PREFIX + ".image", image);
}
export function loadImage(): string | null { return localImage(read(PREFIX + ".image")); }
export function clearImage(): void { remove(PREFIX + ".image"); }
export function saveSampleMode(sample: boolean): void { write(PREFIX + ".sample", String(sample)); }
export function loadSampleMode(): boolean { return loadImage() === "/sample-window.svg"; }
export function saveAssessmentStep(step: number): void { write(PREFIX + ".step", String(step)); }
export function loadAssessmentStep(): number {
  const step = Number(read(PREFIX + ".step"));
  return Number.isInteger(step) && step >= 0 && step <= 6 ? step : 0;
}
export function resetDesign(): void {
  remove(SETTINGS_KEY);
  remove("paneguard.visualizer.v1"); // Pixel-sized legacy previews are deliberately discarded.
}
export function loadDesign() {
  const data = record(parse(SETTINGS_KEY));
  const unit = sanitizeUnit(data.unit);
  const safeDimension = (value: unknown) => {
    const text = dimensionText(value);
    return hasValidDimensions({ width: Number(text), height: Number(text), unit }) ? text : "";
  };
  return {
    settings: sanitizeSettings(data.settings), width: safeDimension(data.width),
    height: safeDimension(data.height), unit,
    saved: Object.keys(data).length > 0,
  };
}
export function saveDesign(design: { settings: VisualizerSettings; width: string; height: string; unit: string }): void {
  write(SETTINGS_KEY, JSON.stringify(design));
}
