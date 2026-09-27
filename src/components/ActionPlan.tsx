"use client";
import { createPortal } from "react-dom";
import { patternLabel, sizeDescription } from "@/lib/patterns";
import type { ActionPlan as Plan, VisualizerSettings } from "@/types";

function formatNumber(value: number, places = 0) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: places }).format(value); }

export function ActionPlan({ plan, settings, isSample }: { plan: Plan; settings: VisualizerSettings; isSample: boolean }) {
  const content = (
            <article className="print-plan">
              <div className="plan-header"><div className="plan-wordmark"><span className="plan-logo">▦</span> PaneGuard</div><span>Bird-friendly window plan</span></div>
              {isSample && <div className="plan-demo-note">Demonstration plan · sample window and example answers</div>}
              <div className="plan-hero"><div><span className="eyebrow">Treatment priority</span><strong>{plan.priority}</strong></div><p>A planning guide based on your observations. Priority is a screening heuristic, not a collision probability.</p></div>
              <div className="plan-facts"><div><span>Window</span><strong>{formatNumber(plan.dimensions.width, 4)} × {formatNumber(plan.dimensions.height, 4)} {plan.dimensions.unit}</strong></div><div><span>Selected design</span><strong>{patternLabel(plan.design)}</strong></div><div><span>Maximum spacing</span><strong>{plan.layout.spacingInches} in × {plan.layout.spacingInches} in</strong></div><div><span>Approximate layout</span><strong>{plan.design === "vertical" ? `${plan.layout.verticalLineCount} vertical lines` : plan.design === "horizontal" ? `${plan.layout.horizontalLineCount} horizontal lines` : plan.design === "grid" ? `${plan.layout.verticalLineCount} vertical + ${plan.layout.horizontalLineCount} horizontal lines` : `${plan.layout.columns} columns × ${plan.layout.rows} rows · ${formatNumber(plan.layout.approximateMarkers)} marks`}</strong></div></div>
              <p className="plan-specification"><strong>{sizeDescription(settings)}</strong> · {settings.contrast === "light" ? "Light" : "Dark"} treatment. Use opaque, durable material clearly visible from 10 feet. Preview opacity is a visual simulation only.</p><div className="plan-columns"><div><h3>Why this window was prioritized</h3>{plan.factors.length ? <ul>{plan.factors.map((factor) => <li key={factor.id}>{factor.label}</li>)}</ul> : <p>No prominent factors selected. Continue to watch the window for collisions.</p>}</div><div><h3>Your actions</h3><ol>{plan.actions.map((action) => <li key={action}>{action}</li>)}</ol></div></div>
              <div className="plan-footer"><p>{plan.evidenceNote}</p><span>Guidance: abcbirds.org/strategies/solutions-for-homes/</span></div>
            </article>
  );
  return <>{content}{createPortal(<div className="print-only">{content}</div>, document.body)}</>;
}
