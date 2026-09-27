"use client";
/* eslint-disable @next/next/no-img-element -- User-selected local data URLs and the bundled SVG do not use the Next image optimizer. */

import Link from "next/link";
import { AssessmentQuestion, questions } from "@/components/AssessmentQuestion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import type { AssessmentAnswers } from "@/types";
import { SAMPLE_ANSWERS } from "@/lib/sample";
import { prepareWindowImage } from "@/lib/image";
import {
  clearImage,
  loadAnswers,
  loadAssessmentStep,
  loadImage,
  loadSampleMode,
  saveAnswers,
  saveAssessmentStep,
  saveImage,
  saveSampleMode,
} from "@/lib/session";
import { completeAnswers, sanitizeAnswers } from "@/lib/validation";
import { resetDesign } from "@/lib/session";
import { PaneGuardMark } from "@/components/SiteHeader";
import "../../styles/assessment.css";

const TOTAL_STEPS = questions.length + 1;

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}>
      <path d="M4 12h16m-7-7 7 7-7 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5" /><path d="M4 15.5v3A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-3" />
    </svg>
  );
}

export default function CheckPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRequestId = useRef(0);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>({});
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [storageNote, setStorageNote] = useState("");

  useEffect(() => {
    // Browser storage is available after mount. Defer hydration so the first
    // client render matches the server markup.
    const timer = window.setTimeout(() => {
      const storedImage = loadImage();
      setImageSrc(storedImage);
      const storedAnswers = loadAnswers();
      setAnswers(storedAnswers);
      setIsSample(loadSampleMode());
      const firstMissing = questions.findIndex(q => !storedAnswers[q.key]);
      setStep(storedImage ? Math.min(loadAssessmentStep(), firstMissing < 0 ? 6 : firstMissing + 1) : 0);
      setHydrated(true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      imageRequestId.current += 1;
    };
  }, []);

  function changeStep(nextStep: number) {
    setError("");
    setStep(nextStep);
    saveAssessmentStep(nextStep);
    requestAnimationFrame(() => document.getElementById("assessment-heading")?.focus());
  }

  async function handleFile(file?: File) {
    if (!file) return;
    const requestId = ++imageRequestId.current;
    setError("");
    setBusy(true);
    try {
      const prepared = await prepareWindowImage(file);
      if (requestId !== imageRequestId.current) return;
      const persisted = saveImage(prepared.src);
      const recovering = !imageSrc && !isSample && Object.keys(answers).length > 0;
      if (!recovering) { resetDesign(); saveAnswers({}); setAnswers({}); }
      saveSampleMode(false);
      setImageSrc(prepared.src);
      setIsSample(false);
      setStorageNote(persisted ? "" : "Your photo will remain available until this tab is refreshed.");
    } catch (caught) {
      if (requestId === imageRequestId.current) {
        setError(caught instanceof Error ? caught.message : "We couldn't prepare this image. Try another photo.");
      }
    } finally {
      if (requestId === imageRequestId.current) setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    void handleFile(event.dataTransfer.files?.[0]);
  }

  function removePhoto() {
    imageRequestId.current += 1;
    setBusy(false);
    clearImage();
    resetDesign();
    saveAnswers({});
    saveSampleMode(false);
    setImageSrc(null);
    setAnswers({});
    setIsSample(false);
    setStorageNote("");
    changeStep(0);
  }

  function selectChoice(key: keyof AssessmentAnswers, value: string) {
    const next = sanitizeAnswers({ ...answers, [key]: value });
    setAnswers(next);
    saveAnswers(next);
    setError("");
  }

  function continueFlow() {
    if (step === 0 && !imageSrc) {
      setError("Choose a window photo or try the sample window to continue.");
      return;
    }
    if (step > 0 && !answers[questions[step - 1].key]) {
      setError("Select an answer to continue.");
      return;
    }
    if (step === TOTAL_STEPS - 1) {
      if (!completeAnswers(answers)) {
        changeStep(questions.findIndex(q => !answers[q.key]) + 1);
        setError("Please complete every answer before viewing your priority.");
        return;
      }
      saveAnswers(answers);
      saveAssessmentStep(0);
      router.push("/results");
      return;
    }
    changeStep(step + 1);
  }

  function trySample() {
    imageRequestId.current += 1;
    resetDesign();
    saveImage("/sample-window.svg");
    saveAnswers(SAMPLE_ANSWERS);
    saveSampleMode(true);
    saveAssessmentStep(0);
    router.push("/results");
  }

  function dropzoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  }

  const question = step > 0 ? questions[step - 1] : null;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  if (!hydrated) return <main className="assessment-loading" aria-live="polite">Preparing your window check…</main>;

  return (
    <div className="pg-check-page">
      <header className="pg-check-nav">
        <Link href="/" className="pg-check-brand" aria-label="PaneGuard home">
          <PaneGuardMark />
          <span>PaneGuard</span>
        </Link>
        <div className="pg-check-nav-right">
          <span className="pg-check-private">Check → Design → Plan</span>
          <Link href="/sources" className="pg-check-nav-link">The science <ArrowIcon /></Link>
        </div>
      </header>

      <main className="pg-check-main" id="main-content">
        <div className="pg-check-heading-row">
          <div>
            <p className="assessment-progress-label">{step + 1} of {TOTAL_STEPS}</p>
            <div className="pg-check-progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={step + 1} aria-label="Assessment step"><span style={{ width: `${progress}%` }} /></div>
            <h1 id="assessment-heading" tabIndex={-1}>{step === 0 ? "Start with your window." : question?.title}</h1>
            <p className="pg-check-lede">{step === 0 ? "Add a photo, then answer six quick questions." : question?.description}</p>
          </div>
        </div>

        <div className="pg-check-layout">
          <section className="pg-check-card" aria-label="Window assessment">

            {step === 0 ? (
              <div className="pg-check-upload-step">
                <div className="pg-check-section-copy">
                  <p>Photograph one pane straight on, with the glass filling the frame. Avoid angled views and extra wall around the glass.</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInput} className="pg-check-file-input" tabIndex={-1} aria-label="Choose a window photo" />
                {imageSrc ? (
                  <div className="pg-check-uploaded">
                    <div className="pg-check-uploaded-image"><img src={imageSrc} alt={isSample ? "Sample residential window" : "Your selected window"} onError={() => { clearImage(); setImageSrc(null); setIsSample(false); changeStep(0); setError("We couldn't display this photo. Reselect the same window; your answers are saved."); }} /></div>
                    <div className="pg-check-uploaded-meta">
                      <span><span className="pg-check-success-dot" /> {isSample ? "Sample window ready" : "Photo ready for preview"}</span>
                      <div><button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy}>Replace</button><button type="button" onClick={removePhoto}>Remove</button></div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`pg-check-dropzone${dragActive ? " is-dragging" : ""}`}
                    onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={dropzoneKeyDown}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload a window photo"
                  >
                    <span className="pg-check-upload-icon"><UploadIcon /></span>
                    <strong>{busy ? "Preparing your photo…" : "Upload a window photo"}</strong>
                    <span>Choose a file or drop it here</span>
                    <small>JPG, PNG, or WEBP · up to 30 MB</small>
                  </div>
                )}
                <div className="pg-check-privacy-note"><LockIcon /><span>Private by design · Your photo never leaves this browser.</span></div>
                <details className="disclosure privacy-disclosure"><summary>How your photo is stored</summary><p>We resize your photo in this browser and save it in this tab’s session storage when space allows. Otherwise, it stays in memory until refresh. No account, server upload, or image analysis service is involved.</p></details>
                {storageNote && <p className="pg-check-storage-note" role="status">{storageNote}</p>}
                <div className="pg-check-sample-row"><span>Just exploring?</span><button type="button" onClick={trySample} disabled={busy}>Try a sample window <ArrowIcon /></button></div>
              </div>
            ) : (
              <div className="pg-check-question-step" key={question?.key}>
                {question && <AssessmentQuestion question={question} answers={answers} selectChoice={selectChoice} />}
              </div>
            )}

            {error && <p className="pg-check-error" role="alert">{error}</p>}
            <div className="pg-check-footer">
              <button type="button" className="pg-check-back" onClick={() => changeStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowIcon direction="left" /> Back</button>
              <button type="button" className="pg-check-continue" onClick={continueFlow} disabled={busy || !hydrated || (step === 0 && !imageSrc)}>{step === TOTAL_STEPS - 1 ? "See my priority" : "Continue"}<ArrowIcon /></button>
            </div>
          </section>

          <aside className="pg-check-aside" aria-label="Window preview and guidance">
            <div className="pg-check-aside-image">
              <img src={imageSrc ?? "/sample-window.svg"} alt={imageSrc ? "Window selected for this assessment" : "Illustration of a residential window"} />
              <div className="pg-check-aside-image-bottom"><span>{imageSrc ? (isSample ? "Sample window" : "Your window") : "Your window goes here"}</span></div>
            </div>
            <details className="disclosure"><summary>Why we’re asking these questions</summary><p>Birds can mistake reflected sky and vegetation for open habitat. Visible exterior patterns help show that glass is a barrier. Your answers help identify conditions worth addressing; you can change them before viewing your result.</p><Link href="/sources">See the science →</Link></details>
          </aside>
        </div>
        <p className="pg-check-method-note">PaneGuard uses a screening heuristic to help prioritize treatment. It does not predict an exact probability of collision.</p>
      </main>
    </div>
  );
}
