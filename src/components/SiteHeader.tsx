import Link from "next/link";
import "@/styles/landing.css";

export function PaneGuardMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="35"
      height="35"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="32" height="32" rx="10" fill="currentColor" />
      <path d="M18 7v22M7 18h22" stroke="#D9E9CF" strokeWidth="1.6" opacity=".7" />
      <path
        d="M9.4 13.7c2.1-2.8 5.2-4.3 9.2-4.2-1.3 1.4-1.8 2.6-1.9 3.7 2.2-.3 4 .2 5.5 1.5-2.3 1.7-4.7 1.9-6.6.8-1.7-1.1-3.7-1.1-6.2-1.8Z"
        fill="#F9F5E9"
      />
      <circle cx="20.7" cy="11.8" r=".8" fill="#17372D" />
      <path d="m22.8 13.8 3.8.8-3.7 1" fill="#D6A679" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="pg-header">
      <div className="pg-container pg-header-inner">
        <Link href="/" className="pg-brand" aria-label="PaneGuard home">
          <PaneGuardMark className="pg-brand-mark" />
          <span>PaneGuard</span>
        </Link>
        <nav className="pg-nav" aria-label="Main navigation">
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#why-it-matters">Why it matters</Link>
          <Link href="/sources">Sources</Link>
        </nav>
        <Link className="pg-button pg-button-small pg-header-cta" href="/check">
          Check my window <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}

export default SiteHeader;
