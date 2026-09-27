import Link from "next/link";
import LandingIllustration from "@/components/LandingIllustration";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "@/styles/landing.css";

const FWS = "https://www.fws.gov/story/threats-birds-collisions-buildings-glass";

function ArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10h13m-5.5-5.5L16 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepIcon({ kind }: { kind: "assess" | "visualize" | "act" }) {
  if (kind === "assess") {
    return <svg viewBox="0 0 52 52" fill="none" aria-hidden="true"><rect x="8" y="10" width="36" height="32" rx="5" stroke="currentColor" strokeWidth="1.8" /><path d="M16 35.5 23 27l5 5 5.5-8 7 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="19" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>;
  }
  if (kind === "visualize") {
    return <svg viewBox="0 0 52 52" fill="none" aria-hidden="true"><rect x="7" y="8" width="38" height="36" rx="5" stroke="currentColor" strokeWidth="1.8" /><path d="M26 9v34" stroke="currentColor" strokeWidth="1.8" /><circle cx="34.5" cy="18.5" r="1.8" fill="currentColor" /><circle cx="40.5" cy="18.5" r="1.8" fill="currentColor" /><circle cx="34.5" cy="25.5" r="1.8" fill="currentColor" /><circle cx="40.5" cy="25.5" r="1.8" fill="currentColor" /><circle cx="34.5" cy="32.5" r="1.8" fill="currentColor" /><circle cx="40.5" cy="32.5" r="1.8" fill="currentColor" /></svg>;
  }
  return <svg viewBox="0 0 52 52" fill="none" aria-hidden="true"><rect x="11" y="8" width="30" height="37" rx="4" stroke="currentColor" strokeWidth="1.8" /><path d="M18 18h16M18 25h16M18 32h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="36.5" cy="35.5" r="8" fill="#E9F0E2" stroke="currentColor" strokeWidth="1.7" /><path d="m33 35.5 2.2 2.2 4.3-4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function HomePage() {
  return (
    <div className="pg-page">
      <SiteHeader />
      <main id="main-content">
        <section className="pg-hero pg-container" aria-labelledby="pg-hero-heading">
          <div className="pg-hero-copy">
            <p className="journey-label">Check → Design → Plan</p>
            <h1 id="pg-hero-heading">Make any window <em>safer for birds.</em></h1>
            <p className="pg-hero-lede">Birds can mistake glass for open habitat. Check your window, try a visible treatment, and leave with a plan.</p>
            <div className="pg-hero-actions">
              <Link className="pg-button pg-button-primary" href="/check">Check my window <ArrowIcon /></Link>
              <Link className="pg-text-link" href="#how-it-works">How it works <span aria-hidden="true">↘</span></Link>
            </div>
            <div className="pg-hero-footnote"><span className="pg-privacy-symbol" aria-hidden="true">✓</span> Your photo stays in your browser. No account needed.</div>
          <p className="hero-evidence"><strong>1 billion+</strong> bird-glass collisions each year in the U.S. <a href={FWS} target="_blank" rel="noopener noreferrer">USFWS ↗</a></p>
          </div>
          <LandingIllustration />
        </section>

        <section className="pg-section pg-steps pg-container" id="how-it-works" aria-labelledby="pg-steps-heading">
          <div className="pg-section-heading">
            <div><h2 id="pg-steps-heading">Three steps. One safer window.</h2></div>
          </div>
          <div className="pg-step-grid">
            <article className="pg-step"><div className="pg-step-top"><span>01 · CHECK</span><StepIcon kind="assess" /></div><h3>Assess.</h3><p>Add a photo and answer six quick questions.</p></article>
            <article className="pg-step"><div className="pg-step-top"><span>02 · DESIGN</span><StepIcon kind="visualize" /></div><h3>Visualize.</h3><p>Compare patterns on your own glass.</p></article>
            <article className="pg-step"><div className="pg-step-top"><span>03 · PLAN</span><StepIcon kind="act" /></div><h3>Act.</h3><p>Measure your pane and download a treatment plan.</p></article>
          </div>
        </section>

        <section className="pg-section pg-glass-section" id="why-it-matters" aria-labelledby="pg-glass-heading">
          <div className="pg-container pg-glass-grid">
            <div className="pg-glass-copy">
              
              <h2 id="pg-glass-heading">It looks like a way through. <em>It isn’t.</em></h2>
              <p>Making glass visible helps birds recognize a barrier. Most fatal collisions happen at homes and buildings under four stories—a change at home can matter.</p>
              <Link className="pg-inline-cta" href="/sources">See the science <ArrowIcon /></Link>
            </div>
            <div className="pg-glass-points">
              <div className="pg-glass-point"><span className="pg-point-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><circle cx="24" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M4 27c3-8 6-9 10-18 4 8 6 11 7 18M10 27c4-5 9-9 18-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></span><div><h3>Reflections can resemble habitat</h3><p>Sky, vegetation, and nearby landscaping can draw birds toward the glass.</p></div></div>
              <div className="pg-glass-point"><span className="pg-point-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M22 4a11 11 0 1 0 6 20A11 11 0 0 1 22 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M5 6v5M2.5 8.5h5M23 13v4m-2 2h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg></span><div><h3>Lighting changes the picture</h3><p>Unnecessary nighttime light can also contribute to collision hazards.</p></div></div>
            </div>
          </div>
        </section>

        <section className="pg-design-section pg-container" aria-labelledby="pg-design-heading">
          <div className="pg-design-visual" aria-hidden="true"><div className="pg-design-window pg-design-window-dots" /><div className="pg-design-window pg-design-window-leaves" /></div>
          <div className="pg-design-copy"><h2 id="pg-design-heading">Bird-friendly can be <em>beautiful.</em></h2><p>Closely spaced marks. A pattern that feels at home on your glass.</p><Link className="pg-inline-cta" href="/check">Try the visualizer <ArrowIcon /></Link></div>
        </section>

        <section className="pg-sdg" id="sdg-15" aria-labelledby="pg-sdg-heading"><div className="pg-container pg-sdg-inner"><div className="pg-sdg-mark"><span>15</span><small>LIFE ON LAND</small></div><div><h2 id="pg-sdg-heading">SDG 15 · Life on Land</h2><p>Small changes to glass support biodiversity and more sustainable communities (SDG 11).</p></div><a href="https://sdgs.un.org/goals/goal15" target="_blank" rel="noopener noreferrer" className="pg-sdg-link">Explore Goal 15 <span aria-hidden="true">↗</span></a></div></section>

        <section className="pg-final-cta" aria-labelledby="pg-final-heading"><div className="pg-container pg-final-inner"><h2 id="pg-final-heading">Ready to check your window?</h2><Link className="pg-button pg-button-primary pg-button-cream" href="/check">Check my window <ArrowIcon /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
