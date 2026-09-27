"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import type { ActionPlan, VisualizerSettings } from "@/types";

export function DownloadPlan({ plan, settings, isSample }: { plan: ActionPlan; settings: VisualizerSettings; isSample: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download() {
    setBusy(true);
    setError("");
    try {
      const { createPlanPdf } = await import("@/lib/planPdf");
      const bytes = await createPlanPdf(plan, settings, isSample);
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = isSample ? "PaneGuard-sample-plan.pdf" : "PaneGuard-window-plan.pdf";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the PDF. Try Print / save as PDF.");
    } finally { setBusy(false); }
  }
  return <div className="pdf-download">
    <button className="button button-primary" type="button" disabled={busy} onClick={download}><Download size={18} />{busy ? "Preparing PDF…" : "Download PDF"}</button>
    {error && <p className="dimension-error" role="alert">{error}</p>}
  </div>;
}
