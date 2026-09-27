"use client";
/* eslint-disable react-hooks/set-state-in-effect -- Browser-only session hydration intentionally follows the first render. */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Leaf, LockKeyhole, Printer, Ruler } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PatternControls } from "@/components/visualizer/PatternControls";
import { ActionPlan } from "@/components/ActionPlan";
import { DownloadPlan } from "@/components/DownloadPlan";
import { SiteFooter } from "@/components/SiteFooter";
import { PatternOverlay } from "@/components/visualizer/PatternOverlay";
import { assessWindow } from "@/lib/assessment";
import { buildActionPlan, calculateTreatmentLayout, hasValidDimensions, convertDimension } from "@/lib/calculator";
import { DEFAULT_VISUALIZER_SETTINGS, patternLabel } from "@/lib/patterns";
import { SAMPLE_DIMENSIONS } from "@/lib/sample";
import { clearImage, loadAnswers, loadImage, loadSampleMode, saveAssessmentStep, loadDesign, saveDesign } from "@/lib/session";
import type { AssessmentAnswers, DimensionUnit, VisualizerSettings, WindowDimensions } from "@/types";
import { completeAnswers, sanitizeSettings } from "@/lib/validation";
import { previewGeometry } from "@/lib/preview";
import "@/styles/results.css";

function formatNumber(value: number, places = 0): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: places }).format(value);
}

export default function ResultsPage() {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [settings, setSettings] = useState<VisualizerSettings>(DEFAULT_VISUALIZER_SETTINGS);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState<DimensionUnit>("in");
  const [split, setSplit] = useState(50);
  const [imageRatio, setImageRatio] = useState(1.5);
  const [planVisible, setPlanVisible] = useState(false);
  const [dimensionAttempted, setDimensionAttempted] = useState(false);

  useEffect(() => {
    const storedAnswers = loadAnswers();
    if (completeAnswers(storedAnswers)) setAnswers(storedAnswers);
    setImageSrc(loadImage());
    const sample = loadSampleMode();
    setIsSample(sample);
    if (sample) {
      setWidth(String(SAMPLE_DIMENSIONS.width));
      setHeight(String(SAMPLE_DIMENSIONS.height));
      setUnit(SAMPLE_DIMENSIONS.unit);
    }
    const design = loadDesign();
    setSettings(design.settings);
    if (design.saved) { setWidth(design.width); setHeight(design.height); setUnit(design.unit); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDesign({ settings, width, height, unit });
  }, [ready, settings, width, height, unit]);

  const dimensions: WindowDimensions | null = useMemo(() => {
    const widthValue = Number(width);
    const heightValue = Number(height);
    const candidate = { width: widthValue, height: heightValue, unit };
    return hasValidDimensions(candidate) ? candidate : null;
  }, [width, height, unit]);
  const result = useMemo(() => answers ? assessWindow(answers) : null, [answers]);
  const layout = useMemo(
    () => calculateTreatmentLayout(dimensions, settings.pattern, settings.spacingInches),
    [dimensions, settings.pattern, settings.spacingInches],
  );
  const plan = answers && result && dimensions && layout
    ? buildActionPlan(answers, result, dimensions, settings.pattern, layout)
    : null;

  function updateSettings(patch: Partial<VisualizerSettings>) {
    setSettings((current) => sanitizeSettings({ ...current, ...patch }));
  }

  function changeUnit(next: DimensionUnit) {
    setWidth((current) => convertDimension(current, unit, next));
    setHeight((current) => convertDimension(current, unit, next));
    setUnit(next);
  }

  function generatePlan() {
    setDimensionAttempted(true);
    if (!plan) {
      document.getElementById("window-width")?.focus();
      return;
    }
    setPlanVisible(true);
    requestAnimationFrame(() => document.getElementById("plan-heading")?.focus());
  }

  if (!ready) return <div className="results-loading" aria-live="polite">Preparing your window…</div>;

  if (!result) {
    return (
      <>
        <SiteHeader />
        <main className="results-empty container" id="main-content">
          <div className="results-empty-mark"><Leaf size={32} /></div>
          <p className="eyebrow">Your window</p>
          <h1 className="serif">Start with a quick look at your glass.</h1>
          <p>Answer a few questions to see which collision factors may be present, then preview a treatment on your window.</p>
          <Link href="/check" className="button button-primary">Check my window <ArrowRight size={18} /></Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="results-intro container">
          <Link className="results-back" href="/check"><ArrowLeft size={16} /> Edit assessment</Link>
          <p className="journey-label">Check <span aria-hidden="true">→</span> Design <span aria-hidden="true">→</span> Plan</p>
          <div className="results-intro-grid">
            <div className={`priority-card priority-${result.priority.toLowerCase()}`}>
              <p className="result-label">Treatment priority</p>
              <h1 className="serif">{result.priority}</h1>
              <p>{result.explanation}</p>
              <p className="priority-disclaimer">Screening result · not a collision probability</p>
              {isSample && <span className="sample-label">Sample window · demonstration data</span>}
            </div>
          <div className="factor-section">
            {result.factors.length ? (
              <>
                <p className="factor-preview">{[...result.factors].sort((a, b) => Number(b.id === "previousCollision") - Number(a.id === "previousCollision")).slice(0, 3).map(factor => factor.label).join(" · ")}</p>
                <details className="disclosure factor-disclosure"><summary>{result.factors.length} factors contributed · See all factors</summary>
                  <p className="disclosure-context">Based only on the details you selected.</p>
                  <ul className="factor-list">{result.factors.map(factor => <li key={factor.id}><strong>{factor.label}</strong><p>{factor.detail}</p></li>)}</ul>
                  <Link href="/sources">About this screening method →</Link>
                </details>
              </>
            ) : <p className="factor-none">No prominent factors were selected. Treat any window where you observe a collision.</p>}
            <a className="results-jump" href="#design-treatment">Design your window <ArrowRight size={18} /></a>
          </div>
          </div>
        </section>

        <section className="visualizer-section" id="design-treatment">
          <div className="container">
            <div className="section-title-line">
              <div>
                <h2 className="serif">Design your window</h2>
              </div>
              <p>Choose a pattern and see it on your glass.</p>
            </div>
            <div className="visualizer-workspace">
              <div className="preview-panel">
                {imageSrc ? (
                  <div className="preview-stage-wrap">
                    <div className="preview-stage" style={{ width: `min(100%, ${Math.round(imageRatio * 600)}px)`, aspectRatio: imageRatio }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={isSample ? "Illustrated sample window with trees and sky reflected in its panes" : "Your uploaded window"}
                        onLoad={(event) => {
                          const image = event.currentTarget;
                          if (image.naturalWidth > 0 && image.naturalHeight > 0) setImageRatio(image.naturalWidth / image.naturalHeight);
                        }}
                        onError={() => { clearImage(); setImageSrc(null); }}
                        className="window-image"
                      />
                      <div className="treated-layer" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
                        <PatternOverlay {...settings} dimensions={dimensions} imageRatio={imageRatio} sampleWindow={isSample} />
                      </div>
                      {split > 4 && <span className="image-state-label image-state-original">Original</span>}
                      {split < 96 && <span className="image-state-label image-state-preview">Preview</span>}
                      {split > 0 && split < 100 && <div className="compare-divider" style={{ left: `${split}%` }}><span aria-hidden="true">‹ ›</span></div>}
                      <input
                        aria-label="Drag to compare original and treatment preview"
                        aria-valuetext={`${split}% original, ${100 - split}% treatment preview`}
                        className="compare-range"
                        type="range"
                        min="0"
                        max="100"
                        value={split}
                        onChange={(event) => setSplit(Number(event.target.value))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="preview-missing"><LockKeyhole size={31} /><h3>Your photo is no longer in this tab.</h3><p>Reselect it to see your treatment on the same window. Your assessment answers are still saved.</p><Link href="/check" className="button button-secondary" onClick={() => saveAssessmentStep(0)}>Reselect photo</Link></div>
                )}
                <div className="preview-toolbar">
                  <div className="view-switch" role="group" aria-label="Comparison view">
                    <button type="button" onClick={() => setSplit(100)} aria-pressed={split === 100}>Original</button>
                    <button type="button" onClick={() => setSplit(50)} aria-pressed={split === 50}>Compare</button>
                    <button type="button" onClick={() => setSplit(0)} aria-pressed={split === 0}>Preview</button>
                  </div>
                  <span>Drag the divider to compare</span>
                </div>
              </div>

              <PatternControls settings={settings} updateSettings={updateSettings} />
            </div>
            <p className="preview-scale-note">{!dimensions ? "Illustrative preview — enter glass dimensions to set the pattern density." : previewGeometry(settings, dimensions, imageRatio).aspectMismatch ? "Photo and glass proportions differ. Marker shapes are kept undistorted, but this view is illustrative. Use a straight-on photo tightly framed around one pane." : "Approximate scale assumes the glass fills the photograph. Background, frames, or perspective change the apparent scale."} Custom motifs are not tested or certified products.</p>
            <details className="disclosure spacing-guidance"><summary>Bird-friendly spacing guidance</summary><div className="disclosure-content"><p>Spacing choices are capped at <strong>2 inches in both directions</strong>, with dots / solid motif cores at least <strong>¼ inch</strong> and lines at least <strong>⅛ inch</strong> wide.</p><p>For most visual-marker treatments, placement on the <strong>exterior surface</strong> is important because markings remain visible against reflections. Use opaque material with strong contrast, visible from 10 feet, and follow your product’s instructions.</p><a href="https://abcbirds.org/strategies/solutions-for-homes/" target="_blank" rel="noreferrer">American Bird Conservancy guidance ↗</a></div></details>
          </div>
        </section>

        <section className="planner-section container" id="window-dimensions">
          <div className="planner-heading"><div><h2 className="serif">Plan this design</h2><p>Measure one pane of glass to estimate your treatment.</p></div></div>
          <div className="planner-grid">
            <div className="dimension-card">
              <div className="dimension-card-title"><h3>Window size</h3></div>
              <div className="dimension-fields">
                <label>Width<input id="window-width" aria-describedby="dimension-error dimension-help" type="number" min="0.01" step="any" inputMode="decimal" value={width} onChange={(event) => setWidth(event.target.value)} placeholder={unit === "in" ? "e.g. 36" : unit === "cm" ? "e.g. 90" : "e.g. 3"} aria-invalid={dimensionAttempted && !dimensions} /></label>
                <label>Height<input aria-describedby="dimension-error dimension-help" type="number" min="0.01" step="any" inputMode="decimal" value={height} onChange={(event) => setHeight(event.target.value)} placeholder={unit === "in" ? "e.g. 60" : unit === "cm" ? "e.g. 150" : "e.g. 5"} aria-invalid={dimensionAttempted && !dimensions} /></label>
                <label>Unit<select value={unit} onChange={(event) => changeUnit(event.target.value as DimensionUnit)}><option value="in">inches</option><option value="cm">centimeters</option><option value="ft">feet</option></select></label>
              </div>
              {dimensionAttempted && !dimensions && <p id="dimension-error" className="dimension-error" role="alert">Enter both dimensions between 1 and 240 inches, or the equivalent in your selected unit.</p>}
              <p id="dimension-help" className="dimension-help">Glass only, excluding the frame. Plan each pane separately.</p>
            </div>
            <div className="layout-card" aria-live="polite" aria-atomic="true">
              <div className="layout-card-title"><span>Your layout</span><strong>{patternLabel(settings.pattern)}</strong></div>
              {layout ? (
                <>
                  <p className="layout-grid-summary">{layout.columns} columns × {layout.rows} rows</p>
                  <div className="layout-total"><span>{settings.pattern === "vertical" ? "Vertical lines" : settings.pattern === "horizontal" ? "Horizontal lines" : settings.pattern === "grid" ? "Total grid lines" : "Approximate marking points"}</span><strong>{formatNumber(layout.estimatedCount)}</strong></div>
                </>
              ) : <div className="layout-placeholder"><Ruler size={23} /><p>Your layout appears here once you enter dimensions.</p></div>}
              <p className="layout-caveat">Planning estimate · follow your product’s instructions.</p>
            </div>
          </div>
          <details className="disclosure estimate-guidance"><summary>How this estimate works</summary><div className="disclosure-content"><p>We place a mark at each edge and divide the span into gaps no larger than your selected spacing. Counts are conservative edge-to-edge estimates; actual product layouts may differ. Supported size: 1–240 inches (2.54–609.6 cm) per side. {isSample && "The sample masks frames, so visible marks and totals differ."}</p>{layout && <div className="layout-stats">
            <div><span>Window area</span><strong>{formatNumber(layout.areaSquareFeet, layout.areaSquareFeet < .1 ? 3 : 1)} <small>sq ft</small></strong></div>
            <div><span>Max. spacing</span><strong>{layout.spacingInches} <small>in</small></strong></div>
            <div><span>Columns</span><strong>{formatNumber(layout.columns)}</strong></div>
            <div><span>Rows</span><strong>{formatNumber(layout.rows)}</strong></div>
          </div>}</div></details>
          <div className="plan-cta"><button type="button" className="button button-primary" onClick={generatePlan}>Generate my plan <ArrowRight size={18} /></button></div>
        </section>

        {planVisible && plan && (
          <section className="action-section container" id="action-plan">
            <div className="action-section-heading"><h2 className="serif" id="plan-heading" tabIndex={-1}>Your window plan</h2></div>
            <ActionPlan plan={plan} settings={settings} isSample={isSample} />
            <div className="plan-export-actions"><DownloadPlan plan={plan} settings={settings} isSample={isSample} /><button type="button" className="button button-secondary print-button" onClick={() => window.print()}><Printer size={18} /> Print</button></div>
            <div className="plan-after"><Download size={18} /><p>Download a PDF or use your browser&apos;s print dialog. Your photo stays in this browser.</p></div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
