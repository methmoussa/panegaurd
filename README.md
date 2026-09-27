# PaneGuard

**Plan a bird-friendly window treatment.** PaneGuard turns a short window check into a design preview and a practical treatment plan.

Live site: <https://paneguard.pages.dev/>. Hosted as a static export on Cloudflare Pages Free.

## The problem

More than one billion birds collide with glass in the United States each year. Reflected sky and vegetation can make a window look like open habitat, and lighting can add hazards at night. The [U.S. Fish & Wildlife Service](https://www.fws.gov/story/threats-birds-collisions-buildings-glass) reports that most fatal collisions happen at homes and buildings shorter than four stories.

## The solution

PaneGuard guides a homeowner through three steps:

1. **Assess:** Answer a short questionnaire about reflections, surroundings, bird activity, lighting, existing treatments, and observed collisions. A transparent screening heuristic assigns a low, moderate, or high **treatment priority**.
2. **Visualize:** Preview six repeating exterior treatments on a locally selected window photo. A draggable before/after comparison, marker controls, and a maximum spacing selector make the options easy to explore.
3. **Act:** Enter window dimensions for an approximate layout, then generate and print a personalized action plan.

The photo is resized and processed in the browser. No account, API key, backend, or photo upload is needed.

## Features

- Local JPG, PNG, and WebP photo processing with preview, validation, and replacement
- Seven-step assessment with progress, keyboard support, and saved answers
- Clearly labeled heuristic priority with answer-specific explanations
- SVG visualizer with dots, vertical lines, horizontal lines, grid, leaves, and stars
- Draggable and keyboard-accessible before/after comparison
- Spacing controls limited to 2 inches or less
- Physical size presets: ¼–½ inch dot / solid motif cores, and ⅛–¼ inch stripes
- Layout estimates for inches, centimeters, and feet, including line and marking counts
- Downloadable local PDF action plan, plus a dedicated print stylesheet
- Bundled sample window and example answers for an instant demo
- Sources page that explains the evidence and the tool's limits

## SDG impact

PaneGuard supports **UN Sustainable Development Goal 15 — Life on Land** by helping people address a preventable source of bird mortality around everyday buildings. It also has a secondary connection to **SDG 11 — Sustainable Cities and Communities**.

## Tech stack

Next.js 16 App Router, React 19, TypeScript, custom responsive CSS, SVG patterns, browser Canvas APIs for local photo resizing, Lucide icons, and Vitest for pure logic tests. All core interactions run in the browser. The project builds a static export in `out/` for static hosting.

## Running locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To run project checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` creates the static site in `out/`. Run `npm start` to preview that export locally, then open <http://localhost:3000>.

## Routes

See [SUBMISSION.md](SUBMISSION.md) for submission copy, a 60-second demo script, and local judging setup. A generated example is in `output/pdf/PaneGuard-sample-plan.pdf`.

- `/` — product story and entry point
- `/check` — window photo and assessment
- `/results` — priority result, visualizer, layout, and action plan
- `/sources` — evidence and limitations

## Evidence and limitations

PaneGuard is an education and planning tool. Its priority categories use a configurable, deterministic **screening heuristic** in `src/lib/assessment.ts`; they are not mathematical predictions of collision probability. A low result does not guarantee a collision-free window. Treatment counts are planning estimates based on entered dimensions and the selected maximum spacing. Follow the instructions for the treatment product you choose, apply visual markers to the exterior surface when appropriate, and continue to watch for collisions.

The pattern selector caps horizontal and vertical intervals at the [American Bird Conservancy's 2 × 2 inch guidance](https://abcbirds.org/strategies/solutions-for-homes/). The visual preview illustrates a design; it does not inspect the glass or certify an installation.

Use a straight-on photo of one pane with little surrounding wall. Shapes remain undistorted at every photo aspect ratio. If photo and measured glass proportions differ, the preview explicitly stays illustrative. Decorative motifs include a solid core, but are not tested or certified products. Preview opacity does not specify an installation material; use a visible, opaque treatment and follow product instructions. The sample masks its frames, so its visible marks differ from the rectangular planning estimate.

Dimensions are limited to 1–240 inches per side (or their metric/feet equivalents). Layouts are conservative edge-to-edge placement estimates. Repeated unit changes preserve calculation precision. Saved answers, image URLs, and settings are validated before use; legacy pixel-based design settings are discarded.

User photos remain in the current browser tab. The app stores compressed image data in `sessionStorage` when space allows and otherwise keeps it in memory until refresh. Assessment answers and design settings persist in `sessionStorage`; no image is sent to a PaneGuard server.

## Sources

- [U.S. Fish & Wildlife Service — Threats to Birds: Collisions (Buildings & Glass)](https://www.fws.gov/story/threats-birds-collisions-buildings-glass)
- [American Bird Conservancy — Solutions for Homes](https://abcbirds.org/strategies/solutions-for-homes/)
- [United Nations — SDG 15: Life on Land](https://sdgs.un.org/goals/goal15)

