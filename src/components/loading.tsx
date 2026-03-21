import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
   AirplaneLoading (plane removed)
   Props:
     isLoading  — show/hide
     message    — optional text (default "Loading…")
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

export default function Loading({
  isLoading = true,
  message   = "Loading",
  fullScreen = true,
}: AirplaneLoadingProps) {
  const [visible, setVisible] = useState(isLoading);

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

        {/* UI overlay */}
        <div className="al-ui">
          {/* Brand */}
          <div className="al-brand">
            Omelette<span>'</span>s
          </div>

          {/* Phase label */}
          <div className="al-phase">
            ✦ Please Wait
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