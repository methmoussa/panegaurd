import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "@/styles/landing.css";

const sources = [
  {
    number: "01",
    organization: "U.S. Fish & Wildlife Service",
    title: "Threats to Birds: Collisions (Buildings & Glass)",
    href: "https://www.fws.gov/story/threats-birds-collisions-buildings-glass",
    summary: "The scale and setting of bird-glass collisions in the United States, and how reflections, landscaping, and lighting can affect birds.",
    points: ["More than one billion birds collide with glass annually in the U.S.", "Most fatal collisions occur at homes and buildings shorter than four stories.", "Reflections of sky and vegetation can make glass appear like habitat."],
  },
  {
    number: "02",
    organization: "American Bird Conservancy",
    title: "Solutions for Homes",
    href: "https://abcbirds.org/strategies/solutions-for-homes/",
    summary: "Practical guidance for choosing windows to address and applying visible treatments to residential glass.",
    points: ["The preferred spacing is two inches or less in both directions.", "Exterior placement keeps markings visible against strong reflections.", "Dots and similar shapes should be at least one-quarter inch across; stripes at least one-eighth inch wide."],
  },
  {
    number: "03",
    organization: "United Nations",
    title: "Sustainable Development Goal 15 — Life on Land",
    href: "https://sdgs.un.org/goals/goal15",
    summary: "The United Nations goal focused on protecting terrestrial ecosystems and halting biodiversity loss.",
    points: ["Reducing preventable bird mortality is one practical contribution to biodiversity conservation.", "PaneGuard’s SDG connection is a project aim, not a measured impact claim."],
  },
];

export default function SourcesPage() {
  return (
    <div className="pg-page pg-sources-page">
      <SiteHeader />
      <main id="main-content">
        <section className="pg-sources-hero pg-container"><p className="pg-section-kicker">The evidence behind the experience</p><h1>Good design starts with <em>good sources.</em></h1><p>PaneGuard turns published bird-window guidance into a practical planning experience. These are the primary references for the facts and recommendations in the app.</p><span className="pg-reviewed">Last reviewed September 23, 2026</span></section>

        <section className="pg-sources-list pg-container" aria-label="Primary sources">
          {sources.map((source) => <article className="pg-source-card" key={source.number}><div className="pg-source-num">{source.number}</div><div className="pg-source-content"><p className="pg-source-org">{source.organization}</p><h2>{source.title}</h2><p className="pg-source-summary">{source.summary}</p><ul>{source.points.map((point) => <li key={point}>{point}</li>)}</ul><a href={source.href} target="_blank" rel="noopener noreferrer" className="pg-inline-cta">Read the original source <span aria-hidden="true">↗</span></a></div></article>)}
        </section>

        <section className="pg-sources-method"><div className="pg-container pg-method-grid"><div><p className="pg-section-kicker">How PaneGuard uses this evidence</p><h2>A screening tool, <em>not a prediction.</em></h2></div><div className="pg-method-copy"><p>PaneGuard asks about characteristics associated with collision hazards and uses a transparent scoring heuristic to suggest a <strong>treatment priority</strong>. It does not calculate an exact probability of collision or certify any window as collision-proof.</p><p>The visualizer uses American Bird Conservancy&apos;s close-spacing guidance as a planning reference. Layout counts are approximations; check the instructions for your chosen product before installing it.</p><p>Your photo is processed locally in your browser. PaneGuard does not upload it to a server.</p></div></div></section>

        <section className="pg-sources-cta pg-container"><div><p className="pg-section-kicker">Put the guidance to work</p><h2>See what could change on <em>your window.</em></h2></div><Link href="/check" className="pg-button pg-button-primary">Check my window <span aria-hidden="true">→</span></Link></section>
      </main>
      <SiteFooter />
    </div>
  );
}
