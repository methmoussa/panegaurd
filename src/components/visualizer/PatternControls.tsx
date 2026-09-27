"use client";
import { PatternOverlay } from "./PatternOverlay";
import { PATTERN_OPTIONS, MARKER_SIZES, MARKER_LABELS, sizeDescription } from "@/lib/patterns";
import type { VisualizerSettings } from "@/types";

export function PatternControls({ settings, updateSettings }: { settings: VisualizerSettings; updateSettings: (patch: Partial<VisualizerSettings>) => void }) {
  return (
              <div className="controls-panel">
                <fieldset className="pattern-fieldset">
                  <legend>Pattern</legend>
                  <div className="pattern-options">
                    {PATTERN_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`pattern-option ${settings.pattern === option.value ? "selected" : ""}`}
                        aria-pressed={settings.pattern === option.value}
                        onClick={() => updateSettings({ pattern: option.value })}
                        title={option.description}
                      >
                        <span className="pattern-swatch"><PatternOverlay pattern={option.value} markerSize={.5} opacity={.86} contrast="dark" spacingInches={2} dimensions={{ width: 10, height: 6, unit: "in" }} /></span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <details className="disclosure customize-disclosure">
                  <summary>Customize design</summary>
                  <div className="disclosure-content">
                <div className="control-row">
                  <label htmlFor="marker-size">Physical size <strong>{MARKER_LABELS[MARKER_SIZES.indexOf(settings.markerSize as typeof MARKER_SIZES[number])] ?? "Custom"}</strong></label>
                  <input id="marker-size" type="range" min="0" max="2" step="1" value={Math.max(0, MARKER_SIZES.indexOf(settings.markerSize as typeof MARKER_SIZES[number]))} aria-valuetext={sizeDescription(settings)} onChange={(event) => updateSettings({ markerSize: MARKER_SIZES[Number(event.target.value)] })} />
                  <p className="dimension-help">{sizeDescription(settings)}{settings.pattern === "leaves" || settings.pattern === "stars" ? "; decorative tips extend beyond the solid core." : "."}</p>
                </div>
                <div className="control-row">
                  <label htmlFor="pattern-opacity">Preview opacity <strong>{Math.round(settings.opacity * 100)}%</strong></label>
                  <input id="pattern-opacity" type="range" min="0.65" max="1" step="0.05" value={settings.opacity} onChange={(event) => updateSettings({ opacity: Number(event.target.value) })} />
                  <p className="dimension-help">Visual simulation only. Install opaque material with strong contrast against reflections; white is generally more visible.</p>
                </div>
                <div className="control-split">
                  <div><span className="control-label">Contrast</span><div className="compact-switch"><button type="button" aria-pressed={settings.contrast === "light"} onClick={() => updateSettings({ contrast: "light" })}>Light</button><button type="button" aria-pressed={settings.contrast === "dark"} onClick={() => updateSettings({ contrast: "dark" })}>Dark</button></div></div>
                  <div><span className="control-label">Maximum spacing</span><div className="compact-switch"><button type="button" aria-pressed={settings.spacingInches === 1} onClick={() => updateSettings({ spacingInches: 1 })}>1″</button><button type="button" aria-pressed={settings.spacingInches === 1.5} onClick={() => updateSettings({ spacingInches: 1.5 })}>1.5″</button><button type="button" aria-pressed={settings.spacingInches === 2} onClick={() => updateSettings({ spacingInches: 2 })}>2″</button></div></div>
                </div>
                  </div>
                </details>
                <p className="design-spec-summary">{sizeDescription(settings)} · {settings.spacingInches}″ spacing</p>
              </div>
  );
}
