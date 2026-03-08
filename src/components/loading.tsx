import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
   AirplaneLoading
   Props:
     isLoading  — show/hide
     message    — optional text under the plane (default "Loading…")
     fullScreen — true = fixed overlay, false = fills parent container
───────────────────────────────────────────────────────── */
interface AirplaneLoadingProps {
  isLoading?: boolean;
  message?: string;
  fullScreen?: boolean;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

  /* ── base ── */
  .al-wrap {
    font-family: 'Ubuntu', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #050e0c;
    overflow: hidden;
  }
  .al-wrap.al-fixed {
    position: fixed;
    inset: 0;
    z-index: 9999;
  }
  .al-wrap.al-relative {
    position: relative;
    width: 100%;
    min-height: 260px;
  }

  /* ── sky gradient ── */
  .al-sky {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 60% 30%, rgba(13,122,104,.4) 0%, transparent 65%),
      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(8,61,51,.5) 0%, transparent 55%),
      linear-gradient(180deg, #03090b 0%, #050e0c 40%, #061411 100%);
  }

  /* ── star field ── */
  .al-stars {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .al-star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #fff;
    border-radius: 50%;
    animation: alStarTwinkle var(--d) ease-in-out infinite alternate;
    opacity: var(--op);
  }
  @keyframes alStarTwinkle {
    from { opacity: var(--op); }
    to   { opacity: calc(var(--op) * 0.2); }
  }

  /* ── runway ── */
  .al-runway-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 38%;
    overflow: hidden;
  }
  .al-runway {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(180deg, transparent 0%, rgba(13,122,104,.06) 40%, rgba(13,122,104,.12) 100%);
  }
  /* perspective grid floor */
  .al-grid {
    position: absolute;
    bottom: 0;
    left: -50%;
    right: -50%;
    height: 100%;
    background-image:
      linear-gradient(rgba(13,122,104,.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,122,104,.18) 1px, transparent 1px);
    background-size: 60px 40px;
    transform: perspective(400px) rotateX(62deg);
    transform-origin: bottom center;
    animation: alGridScroll 1.8s linear infinite;
  }
  @keyframes alGridScroll {
    from { background-position: 0 0; }
    to   { background-position: 0 40px; }
  }

  /* ── runway center line dashes ── */
  .al-dashes {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 12px;
    overflow: hidden;
  }
  .al-dash {
    flex-shrink: 0;
    width: 6px;
    height: 22px;
    background: rgba(255,255,255,.25);
    border-radius: 3px;
    animation: alDashMove 1.8s linear infinite;
  }
  @keyframes alDashMove {
    from { transform: translateY(0); }
    to   { transform: translateY(34px); }
  }

  /* ── ground glow ── */
  .al-glow {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 30px;
    background: radial-gradient(ellipse at center, rgba(13,122,104,.35) 0%, transparent 70%);
    filter: blur(6px);
  }

  /* ── horizon line ── */
  .al-horizon {
    position: absolute;
    bottom: 38%;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(13,122,104,.5) 20%, rgba(77,184,168,.6) 50%, rgba(13,122,104,.5) 80%, transparent);
  }
  /* horizon glow shimmer */
  .al-horizon::after {
    content: '';
    position: absolute;
    inset: -2px 0;
    background: inherit;
    filter: blur(4px);
    opacity: .5;
  }

  /* ── main airplane SVG container ── */
  .al-plane-container {
    position: absolute;
    bottom: 38%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    pointer-events: none;
  }

  /* takeoff: start on ground left→right, lift off and exit top-right */
  .al-plane-takeoff {
    animation: alTakeoff 3.2s cubic-bezier(.4,0,.2,1) infinite;
    transform-origin: center bottom;
  }
  @keyframes alTakeoff {
    0%   { transform: translate(-180px, 0px)   rotate(0deg);   opacity: 0; }
    8%   { opacity: 1; }
    30%  { transform: translate(-40px, 0px)    rotate(0deg);   opacity: 1; }
    55%  { transform: translate(60px, -55px)   rotate(-11deg); opacity: 1; }
    80%  { transform: translate(200px, -160px) rotate(-18deg); opacity: .7; }
    95%  { transform: translate(340px, -280px) rotate(-22deg); opacity: 0; }
    100% { transform: translate(360px, -300px) rotate(-22deg); opacity: 0; }
  }

  /* landing: enter from top-right, descend, touch down, roll to stop */
  .al-plane-landing {
    animation: alLanding 3.2s cubic-bezier(.4,0,.2,1) infinite;
    transform-origin: center bottom;
  }
  @keyframes alLanding {
    0%   { transform: translate(300px, -260px) rotate(10deg);  opacity: 0; }
    8%   { opacity: 1; }
    40%  { transform: translate(80px, -50px)   rotate(6deg);   opacity: 1; }
    58%  { transform: translate(-20px, 0px)    rotate(2deg);   opacity: 1; }
    70%  { transform: translate(-80px, 0px)    rotate(0deg);   opacity: 1; }
    90%  { transform: translate(-200px, 0px)   rotate(0deg);   opacity: .5; }
    100% { transform: translate(-240px, 0px)   rotate(0deg);   opacity: 0; }
  }

  /* ── engine heat shimmer ── */
  .al-exhaust {
    position: absolute;
    right: -18px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 8px;
    background: radial-gradient(ellipse at left, rgba(13,122,104,.7), transparent);
    filter: blur(3px);
    animation: alExhaust .4s ease-in-out infinite alternate;
  }
  @keyframes alExhaust {
    from { opacity: .6; transform: translateY(-50%) scaleX(1); }
    to   { opacity: 1;  transform: translateY(-50%) scaleX(1.4); }
  }

  /* ── wheel sparks on landing ── */
  .al-sparks {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 12px;
    opacity: 0;
  }
  .al-plane-landing .al-sparks {
    animation: alSparks 3.2s ease infinite;
  }
  @keyframes alSparks {
    0%,52%   { opacity: 0; }
    58%,65%  { opacity: 1; }
    70%      { opacity: 0; }
    100%     { opacity: 0; }
  }
  .al-spark {
    position: absolute;
    bottom: 0;
    width: 2px;
    height: 6px;
    background: #4db8a8;
    border-radius: 1px;
    animation: alSparkFly .3s ease-out infinite;
  }
  .al-spark:nth-child(1) { left: 8px;  animation-delay: 0s;    height: 5px; }
  .al-spark:nth-child(2) { left: 16px; animation-delay: .05s;  height: 8px; }
  .al-spark:nth-child(3) { left: 24px; animation-delay: .1s;   height: 4px; }
  .al-spark:nth-child(4) { left: 32px; animation-delay: .02s;  height: 7px; }
  @keyframes alSparkFly {
    from { transform: translateY(0) rotate(-15deg); opacity: 1; }
    to   { transform: translateY(-10px) rotate(10deg); opacity: 0; }
  }

  /* ── cloud layers ── */
  .al-clouds {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .al-cloud {
    position: absolute;
    border-radius: 50px;
    background: rgba(255,255,255,.04);
    filter: blur(8px);
    animation: alCloudDrift var(--cd) linear infinite;
  }
  @keyframes alCloudDrift {
    from { transform: translateX(110vw); }
    to   { transform: translateX(-30vw); }
  }

  /* ── speed lines ── */
  .al-speedlines {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .al-sline {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(13,122,104,.4), transparent);
    animation: alSlineFly var(--sl) linear infinite;
    opacity: 0;
  }
  @keyframes alSlineFly {
    0%   { transform: translateX(100vw); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: .6; }
    100% { transform: translateX(-20vw); opacity: 0; }
  }

  /* ── center UI ── */
  .al-ui {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    margin-top: -60px;
  }

  /* ── brand name ── */
  .al-brand {
    font-size: clamp(1.4rem, 4vw, 2rem);
    font-weight: 700;
    letter-spacing: 3px;
    color: #fff;
    text-transform: uppercase;
  }
  .al-brand span { color: #0d7a68; }

  /* ── phase label ── */
  .al-phase {
    font-size: .72rem;
    font-weight: 500;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #4db8a8;
    animation: alPhasePulse 1.6s ease-in-out infinite alternate;
  }
  @keyframes alPhasePulse {
    from { opacity: .5; }
    to   { opacity: 1; }
  }

  /* ── progress bar ── */
  .al-progress-track {
    width: clamp(200px, 40vw, 320px);
    height: 3px;
    background: rgba(255,255,255,.08);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  .al-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #0d7a68, #4db8a8);
    animation: alProgressSweep 3.2s linear infinite;
    box-shadow: 0 0 8px rgba(13,122,104,.6);
  }
  @keyframes alProgressSweep {
    0%   { width: 0%;   margin-left: 0%; }
    50%  { width: 60%;  margin-left: 20%; }
    100% { width: 0%;   margin-left: 100%; }
  }

  /* ── message ── */
  .al-message {
    font-size: .78rem;
    color: rgba(255,255,255,.38);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* ── fade-in/out transition ── */
  .al-fade-in  { animation: alFadeIn  .4s ease both; }
  .al-fade-out { animation: alFadeOut .4s ease both; }
  @keyframes alFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes alFadeOut { from { opacity:1 } to { opacity:0 } }
`;

/* ── Deterministic star positions (no random on every render) ── */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  top:  ((i * 37 + 13) % 100),
  left: ((i * 61 + 7)  % 100),
  size: ((i * 17 + 3)  % 3) + 1,
  op:   (((i * 29 + 11) % 7) + 3) / 10,
  dur:  (((i * 43 + 5)  % 4) + 2) + "s",
}));

const CLOUDS = [
  { top: "18%", width: 180, height: 28, delay: "0s",   dur: "18s" },
  { top: "28%", width: 120, height: 18, delay: "-6s",  dur: "22s" },
  { top: "12%", width: 220, height: 34, delay: "-11s", dur: "26s" },
  { top: "35%", width: 90,  height: 14, delay: "-3s",  dur: "15s" },
];

const SPEED_LINES = Array.from({ length: 10 }, (_, i) => ({
  top:   `${10 + i * 7}%`,
  width: `${80 + ((i * 31) % 120)}px`,
  left:  `${(i * 13) % 30}%`,
  delay: `-${((i * 0.4) % 3.2).toFixed(1)}s`,
  dur:   `${(1.2 + (i * 0.3) % 1.5).toFixed(1)}s`,
}));

/* ── Airplane SVG — clean side-view wide-body ── */
const PlaneSVG = ({ size = 110 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.44}
    viewBox="0 0 220 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", filter: "drop-shadow(0 0 12px rgba(13,122,104,.55))" }}
  >
    {/* Fuselage */}
    <ellipse cx="110" cy="48" rx="100" ry="17" fill="url(#fuse)" />
    {/* Nose */}
    <path d="M210 48 Q220 47 218 48 Q220 49 210 48Z" fill="#d0eae6" />
    {/* Cockpit window */}
    <ellipse cx="192" cy="44" rx="9" ry="6" fill="#e8f8f5" opacity=".9" />
    <ellipse cx="178" cy="43" rx="7" ry="5" fill="#cdf0ea" opacity=".75" />
    {/* Main wing */}
    <path d="M115 48 L158 28 L172 31 L140 48 L172 65 L158 68Z" fill="url(#wing)" />
    {/* Wing highlight */}
    <path d="M118 46 L157 29 L165 30 L130 47Z" fill="rgba(220,245,242,.12)" />
    {/* Tail horizontal */}
    <path d="M24 48 L46 38 L54 40 L38 48 L54 56 L46 58Z" fill="url(#tail)" />
    {/* Tail fin vertical */}
    <path d="M28 48 L50 22 L55 24 L40 48Z" fill="url(#tailfin)" />
    {/* Engine pod */}
    <ellipse cx="148" cy="65" rx="22" ry="8" fill="url(#engine)" transform="rotate(-3 148 65)" />
    {/* Engine intake glow */}
    <ellipse cx="168" cy="64" rx="4" ry="6" fill="rgba(125,212,200,.75)" />
    {/* Engine exhaust glow */}
    <ellipse cx="128" cy="65" rx="3" ry="4" fill="rgba(13,122,104,.5)" />
    {/* Windows row */}
    {[60,74,88,102,116,130,144,158,168,178].map((x, i) => (
      <rect key={i} x={x} y="41" width="8" height="6" rx="2.5"
        fill="#d4f0eb" opacity={i > 6 ? .65 : .85} />
    ))}
    {/* Belly stripe */}
    <path d="M22 52 Q110 57 210 49" stroke="rgba(77,184,168,.2)" strokeWidth="1" fill="none" />
    {/* Landing gear (tiny wheels) */}
    <circle cx="90"  cy="65" r="4" fill="rgba(13,122,104,.5)" />
    <circle cx="150" cy="73" r="3.5" fill="rgba(13,122,104,.4)" />

    <defs>
      <linearGradient id="fuse" x1="10" y1="31" x2="210" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#4a8a80" />
        <stop offset="35%"  stopColor="#b8deda" />
        <stop offset="65%"  stopColor="#e0f5f2" />
        <stop offset="100%" stopColor="#6aada5" />
      </linearGradient>
      <linearGradient id="wing" x1="115" y1="28" x2="172" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%"  stopColor="#7ac8be" />
        <stop offset="100%" stopColor="#3a7870" />
      </linearGradient>
      <linearGradient id="tail" x1="24" y1="38" x2="54" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%"  stopColor="#5a9990" />
        <stop offset="100%" stopColor="#2e6860" />
      </linearGradient>
      <linearGradient id="tailfin" x1="28" y1="22" x2="55" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%"  stopColor="#4a8880" />
        <stop offset="100%" stopColor="#1e5850" />
      </linearGradient>
      <linearGradient id="engine" x1="126" y1="57" x2="170" y2="73" gradientUnits="userSpaceOnUse">
        <stop offset="0%"  stopColor="#1e5850" />
        <stop offset="60%" stopColor="#5aaaa0" />
        <stop offset="100%" stopColor="#a0d8d2" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Loading({
  isLoading = true,
  message   = "Loading",
  fullScreen = true,
}: AirplaneLoadingProps) {
  const [phase, setPhase]   = useState<"takeoff" | "landing">("takeoff");
  const [visible, setVisible] = useState(isLoading);

  /* ── Alternate takeoff / landing every cycle ── */
  useEffect(() => {
    if (!isLoading) return;
    const id = setInterval(() => {
      setPhase(p => p === "takeoff" ? "landing" : "takeoff");
    }, 3200);
    return () => clearInterval(id);
  }, [isLoading]);

  /* ── Fade-out when done loading ── */
  useEffect(() => {
    if (isLoading) { setVisible(true); return; }
    const id = setTimeout(() => setVisible(false), 420);
    return () => clearTimeout(id);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div
        className={`al-wrap ${fullScreen ? "al-fade-in al-fixed" : "al-relative"} ${!isLoading ? "al-fade-out" : ""}`}
        role="status"
        aria-label="Loading"
      >
        {/* Sky */}
        <div className="al-sky" />

        {/* Stars */}
        <div className="al-stars">
          {STARS.map((s, i) => (
            <div key={i} className="al-star" style={{
              top: `${s.top}%`, left: `${s.left}%`,
              width: s.size, height: s.size,
              "--d": s.dur, "--op": s.op,
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Clouds */}
        <div className="al-clouds">
          {CLOUDS.map((c, i) => (
            <div key={i} className="al-cloud" style={{
              top: c.top, width: c.width, height: c.height,
              "--cd": c.dur,
              animationDelay: c.delay,
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Speed lines */}
        <div className="al-speedlines">
          {SPEED_LINES.map((l, i) => (
            <div key={i} className="al-sline" style={{
              top: l.top, width: l.width, left: l.left,
              "--sl": l.dur,
              animationDelay: l.delay,
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Horizon */}
        <div className="al-horizon" />

        {/* Runway */}
        <div className="al-runway-wrap">
          <div className="al-runway">
            <div className="al-grid" />
            <div className="al-dashes">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="al-dash" style={{ animationDelay: `${i * -0.22}s` }} />
              ))}
            </div>
          </div>
          <div className="al-glow" />
        </div>

        {/* Airplane */}
        <div className="al-plane-container">
          <div className={phase === "takeoff" ? "al-plane-takeoff" : "al-plane-landing"}
            style={{ position: "relative" }}>
            <PlaneSVG size={120} />
            {/* Engine exhaust */}
            <div className="al-exhaust" />
            {/* Landing sparks */}
            <div className="al-sparks">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="al-spark" />
              ))}
            </div>
          </div>
        </div>

        {/* UI overlay */}
        <div className="al-ui">
          {/* Brand */}
          <div className="al-brand">
            Omelette<span>'</span>s
          </div>

          {/* Phase */}
          <div className="al-phase">
            {phase === "takeoff" ? "✈ Preparing for Takeoff" : "✈ On Final Approach"}
          </div>

          {/* Progress bar */}
          <div className="al-progress-track">
            <div className="al-progress-fill" />
          </div>

          {/* Message */}
          <div className="al-message">{message}</div>
        </div>
      </div>
    </>
  );
}