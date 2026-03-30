import { Link } from "@heroui/link";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";

/* ─────────────────────────────────────────────────────────
   Layout + Footer CSS
───────────────────────────────────────────────────────── */
const layoutCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  :root {
    --navbar-h: 64px;
    --mobile-navbar-h: 56px;
    --mobile-footer-h: 64px;
    --teal:      #0d7a68;
    --teal-mid:  #4db8a8;
    --teal-pale: #7dd4c8;

    /* ── Footer theme tokens — DARK (default) ── */
    --ft-bg-base:        #060f0d;
    --ft-bg-mid:         #07120f;
    --ft-bg-deep:        #081a15;
    --ft-border-top:     rgba(13,122,104,.32);
    --ft-glow-a:         rgba(13,122,104,.16);
    --ft-glow-b:         rgba(8,61,51,.38);
    --ft-glow-c:         rgba(13,122,104,.10);
    --ft-dot-color:      rgba(13,122,104,.12);
    --ft-desc-color:     rgba(255,255,255,.36);
    --ft-link-color:     rgba(255,255,255,.4);
    --ft-link-hover:     rgba(255,255,255,.82);
    --ft-copy-color:     rgba(255,255,255,.28);
    --ft-wordmark-from:  #ffffff;
    --ft-wordmark-mid:   #7dd4c8;
    --ft-shadow-glow-a:  rgba(13,122,104,.22);
    --ft-shadow-glow-b:  rgba(13,122,104,.44);
  }

  /* ── Footer theme tokens — LIGHT ── */
  html.light {
    --ft-bg-base:        #f0faf8;
    --ft-bg-mid:         #e8f7f4;
    --ft-bg-deep:        #ddf2ee;
    --ft-border-top:     rgba(13,122,104,.22);
    --ft-glow-a:         rgba(13,122,104,.08);
    --ft-glow-b:         rgba(13,122,104,.12);
    --ft-glow-c:         rgba(13,122,104,.06);
    --ft-dot-color:      rgba(13,122,104,.10);
    --ft-desc-color:     rgba(0,0,0,.52);
    --ft-link-color:     rgba(0,0,0,.45);
    --ft-link-hover:     rgba(0,0,0,.85);
    --ft-copy-color:     rgba(0,0,0,.38);
    --ft-wordmark-from:  #0a3d33;
    --ft-wordmark-mid:   #0d7a68;
    --ft-shadow-glow-a:  rgba(13,122,104,.10);
    --ft-shadow-glow-b:  rgba(13,122,104,.20);
  }

  html, body {
    overflow-x: hidden;
    max-width: 100vw;
    background-color: #050e0c;
  }

  html.light body {
    background-color: #f0faf8;
  }

  /* ── Keyframes ── */
  @keyframes ftShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ftGlow {
    0%,100% { box-shadow: 0 -3px 32px var(--ft-shadow-glow-a); }
    50%     { box-shadow: 0 -3px 52px var(--ft-shadow-glow-b); }
  }
  @keyframes ftPulse {
    0%,100% { opacity: .45; }
    50%     { opacity: .85; }
  }
  @keyframes ftOrbit {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ftDotBlink {
    0%,100% { opacity: .35; transform: scale(.85); }
    50%     { opacity: 1;   transform: scale(1.15); }
  }
  @keyframes ftLineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  /* ══════════════════════════════════════════
     FOOTER SHELL
  ══════════════════════════════════════════ */
  .ft-footer {
    position: relative;
    overflow: hidden;
    border-top: 1px solid var(--ft-border-top);
    background:
      radial-gradient(ellipse 80% 60% at 50% 110%, var(--ft-glow-a) 0%, transparent 65%),
      radial-gradient(ellipse 40% 80% at 8%  50%,  var(--ft-glow-b) 0%, transparent 55%),
      radial-gradient(ellipse 32% 65% at 92% 30%,  var(--ft-glow-c) 0%, transparent 55%),
      linear-gradient(180deg, var(--ft-bg-base) 0%, var(--ft-bg-mid) 50%, var(--ft-bg-deep) 100%);
    transition: background .35s ease, border-color .35s ease, box-shadow .35s ease;
    animation: ftGlow 5s ease-in-out infinite;
    font-family: 'Ubuntu', sans-serif;
    flex-shrink: 0;
  }

  .ft-dotgrid {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, var(--ft-dot-color) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.4) 35%, rgba(0,0,0,.75) 100%);
  }

  .ft-orbit-wrap {
    position: absolute;
    bottom: -50px; right: -50px;
    width: 200px; height: 200px;
    pointer-events: none; opacity: .07;
  }
  .ft-orbit-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1px solid var(--teal-mid);
    animation: ftOrbit 24s linear infinite;
  }
  .ft-orbit-ring-2 {
    position: absolute; inset: 24px;
    border-radius: 50%;
    border: 1px dashed var(--teal-mid);
    animation: ftOrbit 15s linear infinite reverse;
  }

  /* ── MAIN 4-col GRID — desktop ── */
  .ft-body {
    position: relative; z-index: 10;
    max-width: 1280px; margin: 0 auto;
    padding: 60px 48px 40px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 52px;
  }

  /* ── Brand logo + wordmark row ── */
  .ft-brand-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 10px;
  }

  .ft-logo {
    width: 56px;
    height: 56px;
    object-fit: contain;
    border-radius: 10px;
    flex-shrink: 0;
    /* subtle glow to tie into teal theme */
    filter: drop-shadow(0 0 10px rgba(13,122,104,.55));
    transition: filter .3s ease;
  }
  .ft-logo:hover {
    filter: drop-shadow(0 0 18px rgba(77,184,168,.75));
  }

  .ft-brand-text {}

  .ft-wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 300;
    letter-spacing: 2px;
    line-height: 1;
    margin-bottom: 3px;
    background: linear-gradient(135deg, var(--ft-wordmark-from) 0%, var(--ft-wordmark-mid) 42%, var(--ft-wordmark-from) 100%);
    background-size: 220% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ftShimmer 5s linear infinite;
  }
  .ft-wordmark em {
    -webkit-text-fill-color: #E43636;
    font-style: italic;
  }

  .ft-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: .82rem;
    font-style: italic;
    color: rgba(77,184,168,.65);
    letter-spacing: 1.5px;
    margin-bottom: 0;
  }

  .ft-desc {
    font-size: .78rem;
    line-height: 1.8;
    color: var(--ft-desc-color);
    max-width: 290px;
    margin-bottom: 28px;
    margin-top: 18px;
    transition: color .35s ease;
  }

  /* live status pill */
  .ft-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(13,122,104,.14);
    border: 1px solid rgba(13,122,104,.28);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: .63rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(77,184,168,.88);
  }
  .ft-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4db8a8;
    box-shadow: 0 0 7px rgba(77,184,168,.85);
    animation: ftDotBlink 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* nav column heading */
  .ft-col-title {
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--teal-mid);
    margin-bottom: 22px;
    position: relative;
    padding-bottom: 13px;
  }
  .ft-col-title::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0;
    height: 1px; width: 26px;
    background: linear-gradient(90deg, var(--teal), transparent);
    transform-origin: left;
    animation: ftLineGrow 1.2s ease both;
  }

  .ft-nav-list {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ft-nav-link {
    font-size: .8rem;
    color: var(--ft-link-color);
    text-decoration: none !important;
    letter-spacing: .3px;
    transition: color .2s ease, padding-left .2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-nav-link::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--teal);
    opacity: 0;
    flex-shrink: 0;
    transition: opacity .2s ease;
  }
  .ft-nav-link:hover {
    color: var(--ft-link-hover) !important;
    padding-left: 5px;
  }
  .ft-nav-link:hover::before { opacity: 1; }

  /* horizontal rule */
  .ft-divider {
    position: relative; z-index: 10;
    max-width: 1280px; margin: 0 auto;
    padding: 0 48px;
  }
  .ft-divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(13,122,104,.38) 20%, rgba(77,184,168,.28) 50%, rgba(13,122,104,.38) 80%, transparent);
  }

  /* bottom bar */
  .ft-bottom-bar {
    position: relative; z-index: 10;
    max-width: 1280px; margin: 0 auto;
    padding: 18px 48px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ft-copy {
    font-size: .72rem;
    color: var(--ft-copy-color);
    letter-spacing: .5px;
    transition: color .35s ease;
  }
  .ft-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ft-badge {
    font-size: .58rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(77,184,168,.7);
    background: rgba(13,122,104,.16);
    border: 1px solid rgba(77,184,168,.18);
    border-radius: 20px;
    padding: 3px 11px;
    transition: background .22s, border-color .22s, color .22s;
    cursor: default;
  }
  .ft-badge:hover {
    background: rgba(13,122,104,.3);
    border-color: rgba(77,184,168,.4);
    color: rgba(77,184,168,.95);
  }

  .ft-bottom-line {
    height: 2px;
    background: linear-gradient(90deg, transparent, #0d7a68 20%, #4db8a8 50%, #0d7a68 80%, transparent);
    opacity: .55;
  }

  /* ══════════════════════════════════════════
     MOBILE OVERRIDES
  ══════════════════════════════════════════ */

  .mobile-content-wrap { padding-bottom: 0; }

  @media (max-width: 1023px) {
    :root { --navbar-h: 56px; }
    img, video, canvas, svg { max-width: 100%; height: auto; }
  }

  @media (max-width: 639px) {
    .ft-body {
      grid-template-columns: 1fr;
      padding: 32px 20px 24px;
      gap: 28px;
    }
    .ft-bottom-bar {
      padding: 14px 20px 20px;
      flex-direction: column;
      align-items: flex-start;
    }
    .ft-divider { padding: 0 20px; }
    .ft-logo { width: 44px; height: 44px; }
    .ft-wordmark { font-size: 2rem; }
  }
`;

const LOGO_URL =
  "https://res.cloudinary.com/deahgtn57/image/upload/v1774000744/omelett%27s/public/logo/ChatGPT_Image_Mar_13_2026_05_25_31_PM_yfp4b7.png";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("hasVisited");
    if (!alreadyVisited) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisited", "true");
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: layoutCSS }} />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main content ── */}
      <main
        className="flex-grow w-full"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        <div className="mobile-content-wrap">
          {isLoading ? <Loading /> : children}
        </div>
      </main>

      {/* ── Mobile bottom nav — ONLY phone & tablet (< 1024px) ── */}
      <MobileFooter />

      {/* ── Desktop footer — ONLY large screens (≥ 1024px) ── */}
      <footer className="ft-footer hidden lg:block w-full">

        {/* Background textures */}
        <div className="ft-dotgrid" />

        {/* Decorative orbit rings bottom-right */}
        <div className="ft-orbit-wrap">
          <div className="ft-orbit-ring" />
          <div className="ft-orbit-ring-2" />
        </div>

        {/* ── 4-column content grid ── */}
        <div className="ft-body">

          {/* Col 1 — Brand */}
          <div>
            {/* Logo + wordmark side by side */}
            <div className="ft-brand-row">
              <img
                src={LOGO_URL}
                alt="Omelette's logo"
                className="ft-logo"
              />
              <div className="ft-brand-text">
                <div className="ft-wordmark">Omelette<em>'</em>s</div>
                <div className="ft-tagline">Premium Aviation Collectibles</div>
              </div>
            </div>

            <p className="ft-desc">
              Handcrafted scale models for discerning collectors and aviation
              enthusiasts. Each piece honours the golden age of flight —
              precision-engineered to the finest detail.
            </p>
            <div className="ft-status">
              <div className="ft-status-dot" />
              All models in stock
            </div>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <div className="ft-col-title">Explore</div>
            <ul className="ft-nav-list">
              {[
                { label: "Collection",   href: "/Omelette's" },
                { label: "New Arrivals", href: "/Omelette's" },
                { label: "Best Sellers", href: "/Omelette's" },
                { label: "Gift Sets",    href: "/Omelette's" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="ft-nav-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <div className="ft-col-title">Company</div>
            <ul className="ft-nav-list">
              {[
                { label: "About Us",  href: "/about" },
                { label: "Our Story", href: "/about" },
                { label: "Contact",   href: "/help" },
                { label: "FAQ",       href: "/help" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="ft-nav-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Information */}
          <div>
            <div className="ft-col-title">Information</div>
            <ul className="ft-nav-list">
              {[
                { label: "Shipping Policy", href: "/help" },
                { label: "Returns",         href: "/help" },
                { label: "Authenticity",    href: "/about" },
                { label: "Care Guide",      href: "/help" },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="ft-nav-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="ft-divider">
          <div className="ft-divider-line" />
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom-bar">
          <span className="ft-copy">© 2023–2026 Omelette's · All rights reserved</span>
          <div className="ft-badges">
            <span className="ft-badge">v0.0.1</span>
            <span className="ft-badge">Premium Quality</span>
            <span className="ft-badge">Certified Authentic</span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="ft-bottom-line" />

      </footer>
    </div>
  );
}