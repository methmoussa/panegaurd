# PaneGuard verification

## Live deployment — September 24, 2026

- Published the 49-file static export to Cloudflare Pages at <https://paneguard.pages.dev/>. Cloudflare's account page shows Free ($0) as the current plan.
- The live home, check, results, and sources pages loaded over HTTPS. The sample reached a plan and downloaded a PDF. A local PNG fixture was accepted by the live photo picker. No browser warning/error logs were observed in the result flow.
- `npm start` now serves the static export; it was started successfully after the export change.
- The host serves the prebuilt files only. Local image processing and PDF generation remain in the browser.

## Local judging finish — September 24, 2026

- Direct PDF download added using a lazily loaded pdf-lib module; no server or photo upload is involved.
- Type check, lint, all 27 tests, and production build passed. All four app routes remain statically prerendered.
- PDF tests cover all six designs at minimum/maximum dimensions with the longest current assessment and validate a single A4 page.
- The production app's sample journey and Download PDF button were exercised. The browser saved `PaneGuard-sample-plan.pdf` to Downloads; its rendered page was visually inspected. No browser warning/error logs were observed.
- Submission copy, a 60-second script, and local setup instructions are in `SUBMISSION.md`.
- Local-only delivery was requested. No deployment was attempted. Competition eligibility and required submission fields must be checked against the chosen event.

## Earlier second-pass audit

## Checks

- Initial baseline: install, typecheck, lint, 15 tests, production build passed.
- Final: install (zero reported vulnerabilities), typecheck, lint, 25 tests, production build passed.
- No new runtime dependencies; all four app routes remain statically prerendered.

## Browser checks completed

- All routes reviewed; sample and local PNG upload journeys completed.
- Empty-photo and unanswered-question errors; sample replacement and removal; Back selection persistence; arrow-key selection; heading focus; refresh recovery.
- Six patterns, size controls, light/dark contrast, spacing controls, and comparison endpoints. Mouse dragging and keyboard comparison verified.
- Dimensions: invalid 0.01 input, 36 × 60 inches, equivalent feet and centimeters, plan generation.
- Visualizer inspected at 1440×900, 1280×800, 1024×768, 768×1024, 430×932, 390×844. Narrow 320px assessment/results checked, including MODERATE label.
- Landscape sample and portrait raster upload reviewed; pure geometry tests cover square and extreme aspect ratios.
- No warning/error console entries in the final browser session.

## Print verification limit

The in-app browser did not expose a native print/PDF dialog. The exact print stylesheet was temporarily rendered as screen CSS at the A4 printable width (696 CSS pixels), then restored. The five-action plan occupied approximately 695 pixels of the 1024-pixel printable height, with no navigation, buttons, clipping, or extra layout space. This is a stylesheet/layout check, not a saved-PDF or physical-printer verification.

## Remaining validation

- Direct PDF saving is now verified. Native printing and a physical touch device remain unverified.
- Test with a real window photograph. Raster upload fixtures were used locally. Deployment is outside the current local-only scope.
- Preview framing is manual: use a tightly framed, straight-on photo. Adjustable boundaries and image export were intentionally deferred.

Published size/spacing, exterior-placement, collision, and SDG statements were checked against the linked ABC, USFWS, and UN pages. No claim of certified treatment performance or predicted collision probability is made.
# Progressive disclosure refinement — September 26, 2026

The focused UI pass makes Check → Design → Plan primary. Assessment scoring, calculation logic, pattern rendering, source facts, and export logic are unchanged.

## Information retention

- Collision scale and USFWS link: homepage hero and Sources. Home/low-rise context, reflections, and lighting: homepage science section and Sources.
- Screening limitations: always visible in assessment and result; fuller methodology on Sources. Every selected factor and explanation remains in the result disclosure; a previous collision is promoted in the concise factor preview.
- Photo privacy: concise statement beside upload, with local resizing/session-storage details under “How your photo is stored.”
- All six patterns and before/after controls: always visible. Physical size, preview opacity, contrast, and maximum spacing: “Customize design,” retaining existing defaults and limits.
- ABC spacing, sizing, exterior placement, contrast, and source: “Bird-friendly spacing guidance.” Preview-scale and certification limitations remain visible.
- Dimensions, units, dynamic layout and count: primary planner. Area, counts, supported bounds, edge-to-edge methodology and sample caveat: “How this estimate works.” Planning-estimate limitation remains visible.
- Action plan, PDF, print, primary sources, SDG 15 and official UN link are retained.

## Verification for this pass

- All four routes visually reviewed at desktop (1440×900) and mobile (390×844) viewport sizes.
- Sample journey, local PNG file upload, all six assessment questions, answer retention with Back, selected states, factor/privacy/guidance disclosures, all six patterns, size/opacity/contrast/spacing controls, comparison endpoints, dimensions and three-unit conversion, and plan generation exercised in the browser.
- 36×60 inches produced 19×31 marking points and 589 estimated markers; conversion to 91.44×152.4 cm and 3×5 ft preserved the estimate.
- PDF download saved successfully. Print button exercised in both in-app browser and Chrome; native print dialog/output could not be inspected through the browser tooling. Physical device and printer checks remain outside this verification.
- Typecheck, lint, 27 tests and production static build passed. No warning/error logs observed in the local review.
- Published successfully to https://paneguard.pages.dev/ using the existing Cloudflare Pages project and free hosting configuration. Public sample → results → Leaves preview → generated plan → PDF download verified after deployment.
