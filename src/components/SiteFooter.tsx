import Link from "next/link";
import { PaneGuardMark } from "./SiteHeader";
import "@/styles/landing.css";

export function SiteFooter() {
  return (
    <footer className="pg-footer">
      <div className="pg-container pg-footer-main">
        <div className="pg-footer-identity">
          <Link href="/" className="pg-brand pg-brand-footer" aria-label="PaneGuard home">
            <PaneGuardMark className="pg-brand-mark" />
            <span>PaneGuard</span>
          </Link>
          <p>Built for healthier coexistence between cities and wildlife.</p>
        </div>
        <nav aria-label="Footer navigation" className="pg-footer-nav">
          <Link href="/check">Check a window</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/sources">Sources</Link>
          <Link href="/#sdg-15">SDG 15</Link>
        </nav>
      </div>
      <div className="pg-container pg-footer-bottom">
        <span>© {new Date().getFullYear()} PaneGuard</span>
        <span>Small changes in glass. More room for life.</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
