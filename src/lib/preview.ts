import { calculateTreatmentLayout } from "./calculator";
import { physicalSize } from "./patterns";
import type { VisualizerSettings, WindowDimensions } from "@/types";

/** A uniform display scale keeps shapes round; mismatched photos stay illustrative. */
export function previewGeometry(settings: VisualizerSettings, dimensions: WindowDimensions | null, imageRatio: number) {
  const ratio = Number.isFinite(imageRatio) && imageRatio > 0 ? imageRatio : 1.5;
  const width = 1000, height = width / ratio;
  const layout = calculateTreatmentLayout(dimensions, settings.pattern, settings.spacingInches)
    ?? calculateTreatmentLayout({ width: 60, height: 60 / Math.min(10, Math.max(.25, ratio)), unit: "in" }, settings.pattern, settings.spacingInches)!;
  const scale = Math.min(width / layout.widthInches, height / layout.heightInches);
  const size = physicalSize(settings.pattern, settings.markerSize) * scale;
  const extent = settings.pattern === "leaves" || settings.pattern === "stars" ? size * 2 : size;
  return {
    width, height, size, extent,
    tileX: width / (layout.columns - 1),
    tileY: height / (layout.rows - 1),
    aspectMismatch: Math.abs(Math.log(ratio / (layout.widthInches / layout.heightInches))) > .08,
  };
}
