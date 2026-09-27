import type { KeyboardEvent } from "react";
import type { AssessmentAnswers } from "@/types";

type Choice = {
  value: string;
  label: string;
  detail?: string;
  art: string;
};

export type Question = {
  key: keyof AssessmentAnswers;
  eyebrow: string;
  title: string;
  description: string;
  choices: Choice[];
};

export const questions: Question[] = [
  {
    key: "reflection",
    eyebrow: "01 / REFLECTION",
    title: "What do you usually see reflected in the glass?",
    description: "Think about the window during daylight, especially when viewed from outside.",
    choices: [
      { value: "trees", label: "Trees or dense vegetation", detail: "Leaves, branches, or garden greenery", art: "trees" },
      { value: "sky", label: "Open sky", detail: "A clear or clouded sky reflection", art: "sky" },
      { value: "mixed", label: "Buildings and vegetation", detail: "A mix of built space and greenery", art: "mixed" },
      { value: "buildings", label: "Mostly buildings", detail: "Neighboring homes or city structures", art: "buildings" },
      { value: "little", label: "Very little reflection", detail: "The glass is usually easy to see through", art: "little" },
      { value: "unsure", label: "I’m not sure", detail: "You can still complete the check", art: "unsure" },
    ],
  },
  {
    key: "vegetation",
    eyebrow: "02 / SURROUNDINGS",
    title: "Is vegetation visible close to the window from outside?",
    description: "Reflected plants can look like open habitat to a bird approaching glass.",
    choices: [
      { value: "lots", label: "Yes, lots", detail: "Trees, shrubs, or dense planting nearby", art: "trees" },
      { value: "some", label: "Some", detail: "A few plants or a smaller garden", art: "mixed" },
      { value: "none", label: "Very little or none", detail: "Mostly paved or built surroundings", art: "buildings" },
    ],
  },
  {
    key: "birdActivity",
    eyebrow: "03 / BIRD ACTIVITY",
    title: "Do birds regularly gather near this window?",
    description: "Consider feeders, bird baths, or places where birds often perch. A feeder alone does not determine safety.",
    choices: [
      { value: "yes", label: "Yes", detail: "Birds frequently gather here", art: "bird" },
      { value: "no", label: "No", detail: "I rarely notice birds close by", art: "little" },
      { value: "unsure", label: "Not sure", detail: "I haven’t paid close attention", art: "unsure" },
    ],
  },
  {
    key: "lighting",
    eyebrow: "04 / LIGHTING",
    title: "Are lights near this window visible at night?",
    description: "Include indoor lights shining through and outdoor fixtures near the glass.",
    choices: [
      { value: "often", label: "Often", detail: "Most evenings or overnight", art: "moon" },
      { value: "sometimes", label: "Sometimes", detail: "On some evenings", art: "sky" },
      { value: "rarely", label: "Rarely or never", detail: "The area is usually dark", art: "little" },
    ],
  },
  {
    key: "existingTreatment",
    eyebrow: "05 / EXISTING TREATMENT",
    title: "Is the outside of the glass already treated?",
    description: "Exterior markings are easier for birds to see against reflections.",
    choices: [
      { value: "pattern", label: "Closely spaced exterior markings", detail: "A repeated pattern across the glass", art: "pattern" },
      { value: "screen", label: "Exterior screen", detail: "A visible screen covers the window", art: "screen" },
      { value: "few-decals", label: "A few decals only", detail: "Just a small number of stickers", art: "decals" },
      { value: "none", label: "No treatment", detail: "The exterior surface is bare", art: "little" },
      { value: "unsure", label: "Not sure", detail: "I don’t know how it was applied", art: "unsure" },
    ],
  },
  {
    key: "previousCollision",
    eyebrow: "06 / OBSERVATION",
    title: "Have you observed a bird collide with this window?",
    description: "A previous collision is an important reason to give this window attention.",
    choices: [
      { value: "yes", label: "Yes", detail: "I’ve seen or found evidence of a collision", art: "bird" },
      { value: "no", label: "No", detail: "I haven’t observed one", art: "little" },
      { value: "unsure", label: "Not sure", detail: "It’s possible I missed one", art: "unsure" },
    ],
  },
];

function OptionArt({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.55, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let drawing: React.ReactNode;
  switch (kind) {
    case "trees":
      drawing = <><path d="M7 29V16m15 13V11M3 17l4-10 4 10H3Zm13-5 6-9 6 9H16Z" {...common} /><path d="M2 30h28" {...common} /></>;
      break;
    case "sky":
      drawing = <><circle cx="22" cy="9" r="4" {...common} /><path d="M2 25c4-4 8-4 12 0m2-2c4-4 8-4 13 0M4 14h8M2 18h12" {...common} /></>;
      break;
    case "mixed":
      drawing = <><path d="M3 29V14h9v15M5 17h2m3 0h1M5 21h2m3 0h1M20 29V13m-5 5 5-12 5 12H15ZM2 29h28" {...common} /></>;
      break;
    case "buildings":
      drawing = <><path d="M3 29V12h9v17m3 0V5h13v24M6 16h3m-3 5h3m9-11h2m4 0h2m-8 5h2m4 0h2m-8 5h2m4 0h2M2 29h28" {...common} /></>;
      break;
    case "bird":
      drawing = <><path d="M3 20c5-4 9-4 13 0 3-5 7-7 13-6-3 3-5 5-6 8-2 5-8 7-13 4l-4-3-3-3Z" {...common} /><path d="m14 17 4-7m-4 8-6-3" {...common} /></>;
      break;
    case "moon":
      drawing = <><path d="M23 25A12 12 0 0 1 12 5a11 11 0 1 0 11 20Z" {...common} /><path d="M24 5v5m-2.5-2.5h5M5 9v4M3 11h4" {...common} /></>;
      break;
    case "pattern":
      drawing = <>{[7, 16, 25].flatMap((x) => [7, 16, 25].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="currentColor" />))}</>;
      break;
    case "screen":
      drawing = <><rect x="4" y="4" width="24" height="24" rx="1" {...common} /><path d="M12 4v24M20 4v24M4 12h24M4 20h24" {...common} /></>;
      break;
    case "decals":
      drawing = <><circle cx="8" cy="8" r="2.2" {...common} /><circle cx="23" cy="17" r="2.2" {...common} /><circle cx="11" cy="27" r="2.2" {...common} /></>;
      break;
    case "unsure":
      drawing = <><path d="M12 10a5 5 0 1 1 7 4.6c-2.5 1.1-3.5 2.4-3.5 4.4" {...common} /><circle cx="15.5" cy="25" r="1" fill="currentColor" /></>;
      break;
    default:
      drawing = <><rect x="4" y="4" width="24" height="24" rx="2" {...common} /><path d="M4 16h24M16 4v24" {...common} /></>;
  }
  return <svg aria-hidden="true" width="34" height="34" viewBox="0 0 32 32">{drawing}</svg>;
}

export function AssessmentQuestion({ question, answers, selectChoice }: { question: Question; answers: Partial<AssessmentAnswers>; selectChoice: (key: keyof AssessmentAnswers, value: string) => void }) {
  function handleChoiceKeyDown(event: KeyboardEvent<HTMLButtonElement>, question: Question, index: number) {
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight"
      ? 1
      : event.key === "ArrowUp" || event.key === "ArrowLeft"
        ? -1
        : 0;
    if (!direction) return;
    event.preventDefault();
    const nextIndex = (index + direction + question.choices.length) % question.choices.length;
    selectChoice(question.key, question.choices[nextIndex].value);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role='radio']");
    buttons?.[nextIndex]?.focus();
  }

  return (
                <div className={`pg-check-options${question && question.choices.length > 3 ? " pg-check-options-compact" : ""}`} role="radiogroup" aria-label={question?.title}>
                  {question?.choices.map((choice, index) => {
                    const selected = answers[question.key] === choice.value;
                    return (
                      <button
                        key={choice.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected || (!answers[question.key] && index === 0) ? 0 : -1}
                        className={`pg-check-option${selected ? " is-selected" : ""}`}
                        onClick={() => selectChoice(question.key, choice.value)}
                        onKeyDown={(event) => handleChoiceKeyDown(event, question, index)}
                      >
                        <span className={`pg-check-option-art pg-check-art-${choice.art}`}><OptionArt kind={choice.art} /></span>
                        <span className="pg-check-option-text"><strong>{choice.label}</strong><small>{choice.detail}</small></span>
                        <span className="pg-check-radio-mark" aria-hidden="true">{selected && <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
                      </button>
                    );
                  })}
                </div>
  );
}
