export default function LandingIllustration() {
  return (
    <div className="pg-hero-art">
      <svg
        className="pg-window-illustration"
        viewBox="0 0 760 745"
        role="img"
        aria-labelledby="pg-art-title pg-art-desc"
      >
        <title id="pg-art-title">Residential window with a bird-friendly dot treatment</title>
        <desc id="pg-art-desc">
          A large window reflects sky and trees. Small, evenly spaced dots cover the right side
          of the glass to show a visible exterior treatment.
        </desc>
        <defs>
          <linearGradient id="pg-glass" x1="0" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#D9E5DF" />
            <stop offset=".42" stopColor="#A4BDB4" />
            <stop offset="1" stopColor="#435F54" />
          </linearGradient>
          <linearGradient id="pg-wall" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#E7DED0" />
            <stop offset="1" stopColor="#CDBBA8" />
          </linearGradient>
          <linearGradient id="pg-glow" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#F3E4C5" stopOpacity=".48" />
            <stop offset="1" stopColor="#F3E4C5" stopOpacity="0" />
          </linearGradient>
          <pattern id="pg-dot-pattern" width="29" height="29" patternUnits="userSpaceOnUse">
            <circle cx="14.5" cy="14.5" r="3.2" fill="#F9F7E9" opacity=".98" />
          </pattern>
          <clipPath id="pg-glass-clip">
            <rect x="116" y="79" width="529" height="548" rx="3" />
          </clipPath>
        </defs>
        <rect width="760" height="745" rx="28" fill="url(#pg-wall)" />
        <path d="M0 91h760M0 647h760" stroke="#F5EFE3" strokeWidth="2" opacity=".55" />
        <rect x="86" y="48" width="588" height="611" rx="8" fill="#F6F0E4" />
        <rect x="100" y="62" width="560" height="582" rx="3" fill="#28453D" />
        <g clipPath="url(#pg-glass-clip)">
          <rect x="116" y="79" width="529" height="548" fill="url(#pg-glass)" />
          <ellipse cx="538" cy="142" rx="152" ry="111" fill="url(#pg-glow)" />
          <path d="M116 301c81-17 157-49 250-56 101-7 175 29 279 3V79H116Z" fill="#DCE9E2" opacity=".41" />
          <path d="M116 416c65-21 92-64 162-63 78 1 133 53 208 47 61-6 107-50 159-50v277H116Z" fill="#658B74" opacity=".37" />
          <path d="M116 490c81-75 132-87 194-55 68 35 113 64 187 40 56-18 86-47 148-48v200H116Z" fill="#3C6955" opacity=".45" />
          <path d="M116 548c60-77 116-90 169-55 59 39 92 57 150 28 73-35 117-41 210-12v118H116Z" fill="#234D3D" opacity=".54" />
          <g fill="#244F39" opacity=".55">
            <path d="M125 359c13-56 29-85 53-139 18 60 24 104 26 139ZM176 391c8-52 25-103 45-139 21 61 25 93 28 139ZM593 382c11-57 26-98 45-139 17 43 26 81 35 139Z" />
            <path d="M282 468c16-66 34-107 55-157 28 72 34 116 40 157ZM424 498c14-75 39-130 58-172 32 69 42 120 45 172Z" />
          </g>
          <g stroke="#183F30" strokeWidth="4" opacity=".34">
            <path d="M178 581V300M222 610V342M337 629V398M478 629V403M637 581V350" />
          </g>
          <path d="m116 79 231 0-231 325Z" fill="#FCF9ED" opacity=".13" />
          <path d="m645 80-164 0 164 364Z" fill="#FAF9EB" opacity=".12" />
          <rect x="379" y="79" width="266" height="548" fill="url(#pg-dot-pattern)" />
        </g>
        <path d="M380 79v548" stroke="#F8F4E8" strokeWidth="2" strokeDasharray="4 8" opacity=".85" />
        <rect x="108" y="70" width="545" height="565" rx="4" stroke="#173D30" strokeWidth="16" fill="none" />
        <rect x="365" y="70" width="16" height="565" fill="#173D30" />
        <rect x="108" y="626" width="545" height="12" fill="#E9DDC9" opacity=".8" />
        <rect x="71" y="646" width="619" height="20" rx="2" fill="#F6EFE1" />
        <rect x="63" y="665" width="635" height="11" rx="1" fill="#BBA893" />
        <g fill="#295640" opacity=".85">
          <path d="M16 627c1-90 19-163 49-211 5 96 2 174-12 227Z" />
          <path d="M7 619c-22-69-9-148 15-196 35 78 48 147 39 220Z" />
          <path d="M744 640c-23-92-26-157-4-213 35 56 48 136 19 224Z" />
        </g>
        <circle cx="596" cy="190" r="4" fill="#FAF4DA" opacity=".85" />
      </svg>
      <div className="pg-art-badge">
        <span className="pg-art-badge-icon" aria-hidden="true">✦</span>
        <span><strong>Beautiful by design.</strong><small>Visible to birds, at home on your window.</small></span>
      </div>
      <div className="pg-art-caption"><span className="pg-caption-rule" /> A clearer boundary for birds</div>
    </div>
  );
}
