import { Link } from "@heroui/link";
import { AiOutlineUp } from "react-icons/ai";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";
import { ToastProvider } from "@heroui/toast";
import OMS_Loading from "@/components/oms_loading";

/* ── Animated footer CSS ── */
const footerCSS = `
  @keyframes ftPlanefly {
    0%   { left: -80px; transform: translateY(0px) rotate(0deg); opacity: 0; }
    4%   { opacity: 1; }
    20%  { transform: translateY(-7px) rotate(-4deg); }
    40%  { transform: translateY(-11px) rotate(-2deg); }
    60%  { transform: translateY(-5px) rotate(1deg); }
    80%  { transform: translateY(-2px) rotate(0deg); opacity: 1; }
    96%  { opacity: 1; }
    100% { left: calc(100% + 80px); transform: translateY(0px) rotate(0deg); opacity: 0; }
  }
  @keyframes ftRunway {
    from { background-position: 0 0; }
    to   { background-position: -48px 0; }
  }
  @keyframes ftShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ftGlow {
    0%,100% { box-shadow: 0 -2px 20px rgba(13,122,104,.3); }
    50%     { box-shadow: 0 -2px 36px rgba(13,122,104,.6); }
  }
  @keyframes ftPulse {
    0%,100% { opacity: .55; }
    50%     { opacity: .9; }
  }

  .ft-footer {
    position: relative;
    overflow: hidden;
    border-radius: 10px 10px 0 0;
    border-top: 1.5px solid rgba(13,122,104,.4);
    background: linear-gradient(180deg, #050e0c 0%, #081a16 35%, #0d7a68 100%);
    animation: ftGlow 4s ease-in-out infinite;
    font-family: 'Ubuntu', sans-serif;
  }

  /* scrolling runway dashes at top edge */
  .ft-runway {
    position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(77,184,168,.6) 0px, rgba(77,184,168,.6) 20px,
      transparent 20px, transparent 48px
    );
    animation: ftRunway 1.2s linear infinite;
  }

  /* subtle grid texture */
  .ft-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(13,122,104,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,122,104,.06) 1px, transparent 1px);
    background-size: 32px 18px;
  }

  /* flight corridor */
  .ft-sky {
    position: absolute;
    top: 0; left: 0; right: 0; height: 28px;
    overflow: hidden; pointer-events: none;
  }

  /* the flying plane */
  .ft-plane {
    position: absolute;
    top: 5px; left: -80px;
    filter: drop-shadow(0 0 5px rgba(13,122,104,.75));
    animation: ftPlanefly 7s cubic-bezier(.4,0,.2,1) infinite;
    animation-delay: 1.2s;
    will-change: left, transform;
  }

  /* contrail */
  .ft-contrail {
    position: absolute;
    top: 13px; left: -80px;
    height: 1.5px; width: 0;
    background: linear-gradient(90deg, transparent, rgba(77,184,168,.45), rgba(255,255,255,.25));
    border-radius: 2px; filter: blur(1px);
    animation: ftPlanefly 7s cubic-bezier(.4,0,.2,1) infinite;
    animation-delay: 1.1s;
    opacity: .6;
  }

  /* content row */
  .ft-content {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 6px 10px;
    padding: 26px 16px 10px;
  }

  /* brand shimmer */
  .ft-brand-name {
    font-weight: 700;
    background: linear-gradient(135deg, #fff 0%, #7dd4c8 45%, #fff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ftShimmer 3s linear infinite;
  }
  .ft-brand-name em { -webkit-text-fill-color: #E43636; font-style: normal; }

  .ft-sep     { color: rgba(255,255,255,.22); font-size: .75rem; }
  .ft-copy    { color: rgba(255,255,255,.5);  font-size: .75rem; animation: ftPulse 4s ease-in-out infinite; }
  .ft-version {
    color: rgba(77,184,168,.9); font-size: .62rem; font-weight: 600;
    letter-spacing: 1.5px; text-transform: uppercase;
    background: rgba(13,122,104,.28); border: 1px solid rgba(77,184,168,.3);
    border-radius: 20px; padding: 2px 9px;
  }

  /* bottom teal line */
  .ft-bottom {
    position: relative; z-index: 10; height: 2px;
    background: linear-gradient(90deg, transparent, #0d7a68 20%, #4db8a8 50%, #0d7a68 80%, transparent);
    opacity: .7;
  }
`;

/* ── Tiny plane SVG ── */
const FooterPlane = () => (
  <svg width="40" height="17" viewBox="0 0 80 34" fill="none">
    <ellipse cx="40" cy="17" rx="36" ry="6" fill="url(#fpF)" />
    <path d="M76 17 Q80 16.5 79 17 Q80 17.5 76 17Z" fill="#d0eae6" />
    <ellipse cx="69" cy="15.5" rx="3.5" ry="2.5" fill="#e8f8f5" opacity=".9" />
    <ellipse cx="63" cy="15"   rx="2.8" ry="2"   fill="#cdf0ea" opacity=".75" />
    <path d="M42 17 L58 10 L62 11 L52 17 L62 23 L58 24Z" fill="url(#fpW)" />
    <path d="M9 17 L17 13 L20 14 L14 17 L20 20 L17 21Z"  fill="#3a7870" />
    <path d="M10 17 L19 7 L21 8 L15 17Z" fill="#2e6860" />
    <ellipse cx="53" cy="23" rx="8" ry="3" fill="url(#fpE)" transform="rotate(-3 53 23)" />
    <ellipse cx="60" cy="22.5" rx="1.5" ry="2.5" fill="rgba(125,212,200,.8)" />
    {[22,28,34,40,46,52,58,63].map((x,i)=>(
      <rect key={i} x={x} y="14.5" width="3.5" height="2.5" rx="1"
        fill="#d4f0eb" opacity={i>5?.55:.85}/>
    ))}
    <defs>
      <linearGradient id="fpF" x1="4" y1="11" x2="76" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%"  stopColor="#3a7870"/><stop offset="40%" stopColor="#b8deda"/>
        <stop offset="70%" stopColor="#e0f5f2"/><stop offset="100%" stopColor="#5a9a90"/>
      </linearGradient>
      <linearGradient id="fpW" x1="42" y1="10" x2="62" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7ac8be"/><stop offset="100%" stopColor="#2e6860"/>
      </linearGradient>
      <linearGradient id="fpE" x1="45" y1="20" x2="61" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e5850"/><stop offset="100%" stopColor="#7ac8be"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth < 768 ? 100 : 300;
      setShowScrollTop(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* <ToastProvider placement="bottom-right" toastOffset={60} /> */}
      <style dangerouslySetInnerHTML={{ __html: footerCSS }} />

      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <div className="w-full overflow-x-hidden">
          {isLoading ? (
            <>
              <Loading />
              {/* <OMS_Loading /> */}
            </>
          ) : (
            children
          )}
        </div>

        {/* Fixed Scroll to Top Button */}
        {/* {showScrollTop && (
          <button
            aria-label="Scroll to top"
            className="fixed z-[10000] bg-white dark:bg-slate-800 text-[#0d7a68] p-2 rounded-full shadow-lg border border-[#0d7a68] hover:bg-[#0d7a68] hover:text-white transition-all duration-300"
            style={{ bottom: 'calc(80px + 1rem)', right: '1rem' }}
            onClick={scrollToTop}
          >
            <AiOutlineUp className="w-5 h-5" />
          </button>
        )} */}
      </main>

      <MobileFooter />

      {/* ── Animated Footer — hidden on mobile ── */}
      <footer className="ft-footer hidden sm:block w-full shadow-lg">

        {/* Scrolling runway dashes */}
        <div className="ft-runway" />

        {/* Grid texture */}
        <div className="ft-grid" />

        {/* Airplane flight corridor */}
        <div className="ft-sky">
          <div className="ft-contrail" />
          <div className="ft-plane"><FooterPlane /></div>
        </div>

        {/* Text content */}
        <div className="ft-content">
          <Link
            isExternal
            href="/"
            title="Omelette's"
            className="flex items-center gap-1.5 text-white no-underline"
            style={{ fontSize: ".82rem", fontWeight: 500 }}
          >
            {/* <span style={{ color: "rgba(255,255,255,.65)" }}>Powered by</span> */}
            <span className="ft-brand-name">Omelette<em>'</em>s</span>
          </Link>

          <span className="ft-sep">|</span>
          <span className="ft-copy">Copyright © 2023–2025</span>
          <span className="ft-sep">|</span>
          <span className="ft-version">v0.0.1</span>
        </div>

        {/* Bottom accent line */}
        <div className="ft-bottom" />

      </footer>
    </div>
  );
}