# PaneGuard — judging kit

Live demo: <https://paneguard.pages.dev/>

## One-line pitch

Turn a window check into a bird-friendly design and a practical installation plan, with your photo kept in your browser.

## Submission description

### Inspiration

A window can look like open sky or habitat to a bird. Homeowners need a practical way to move from awareness to action. PaneGuard makes that first step approachable: inspect one window, explore a visible treatment, and take away a plan.

### What it does

PaneGuard asks about six observable characteristics, explains a low, moderate, or high treatment priority, and previews six repeating patterns on a local photo. Users can compare the original view with a treatment, choose physical marker sizes and spacing, enter glass dimensions in three units, and download a one-page PDF plan. A clearly labeled sample makes the entire flow available without a photo.

### How it was built

Next.js, React, and TypeScript provide the application. SVG draws the patterns, browser Canvas resizes local photos, and session storage preserves the current tab's work. A deterministic, inspectable heuristic explains the assessment. The calculator converts dimensions and estimates an edge-to-edge layout. PDF generation runs locally with pdf-lib, loaded only when requested. Vitest checks the assessment, geometry, storage recovery, calculations, and PDF output.

### Design challenges

The main challenges were keeping patterns proportional on differently shaped photos, preserving physical dimensions through unit changes, recovering safely from invalid or unavailable browser storage, and distinguishing a helpful planning estimate from a scientific prediction. The interface explains those boundaries alongside the relevant controls.

### What makes it useful

PaneGuard connects observation, visualization, and an actionable take-away in one short flow. No account, API key, or photo upload is required. The evidence page links the guidance behind treatment spacing and placement. This supports SDG 15, Life on Land, with a secondary connection to SDG 11, Sustainable Cities and Communities.

### Limits and next steps

This is a planning prototype, not image-based detection, a collision-probability model, or a certified treatment. Decorative motifs have not undergone effectiveness testing. Next steps are real-window usability sessions, physical-device checks, and adjustable photo boundaries. No measured reduction in collisions is claimed.

## 60-second demo script

| Time | Show | Say |
| --- | --- | --- |
| 0–10s | Home page | “PaneGuard helps a homeowner turn a bird-window collision concern into a practical treatment plan.” |
| 10–20s | Check → Try a sample window → results | “We ask about visible conditions. This sample is labeled, and the result explains the answers behind its treatment priority.” |
| 20–35s | Results → treatment preview → change pattern → drag comparison | “You can explore six treatments on your own photo without uploading it. Marker size is physical, and spacing is capped at two inches.” |
| 35–45s | Dimensions and layout | “Enter the glass dimensions in inches, feet, or centimeters to estimate marks or lines. These are planning estimates.” |
| 45–55s | Generate my plan → Download PDF | “The result is a portable plan with dimensions, treatment details, installation steps, and evidence limits.” |
| 55–60s | Sources | “PaneGuard makes published guidance easier to act on, supporting Life on Land one window at a time.” |

## Local judging setup

1. Install with `npm ci` while internet access is available.
2. Run `npm run build`, then `npm start` to serve the static export.
3. Open `http://localhost:3000` and rehearse the sample journey once.
4. Keep `output/pdf/PaneGuard-sample-plan.pdf` available as a fallback artifact.
5. Stop the server with Ctrl+C before moving or zipping the project.

The live site is published on Cloudflare Pages Free. Before an actual submission, confirm the competition's eligibility, required fields, deadline, team details, and disclosure rules; these have not been certified by this project audit.
