import { useTranslation } from "react-i18next";
import { Image } from "@heroui/image";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaRocket, FaUsers, FaAward, FaHandshake,
  FaStar, FaGlobe, FaCheck, FaPlaneDeparture,
} from "react-icons/fa6";
import { MdSecurity } from "react-icons/md";
import { TbTruckDelivery, TbHeadset, TbCertificate } from "react-icons/tb";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1776761678/omelett%27s/public/logo/web-app%20logo/ChatGPT_Image_Apr_21_2026_03_31_35_PM_s9jezl.png";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --pri: #0d7a68;
  --pri2: #0a6455;
  --acc: #4db8a8;
  --acc2: #7dd4c8;
  --red: #E43636;
  --bg: #ffffff;
  --bg2: #f7faf9;
  --bg3: #eef5f3;
  --tx: #1a2e2a;
  --tx2: #3d5c55;
  --tx3: #6b8f86;
  --bd: rgba(13,122,104,.12);
  --card: #ffffff;
  --glass: rgba(255,255,255,.8);
  --shadow: 0 4px 24px rgba(0,0,0,.06);
  --shadow2: 0 12px 40px rgba(0,0,0,.08);
}

.dark {
  --bg: #0a1210;
  --bg2: #0e1a17;
  --bg3: #12221d;
  --tx: #e8f5f1;
  --tx2: #9dbcb4;
  --tx3: #6b8f86;
  --bd: rgba(77,184,168,.12);
  --card: rgba(255,255,255,.04);
  --glass: rgba(255,255,255,.06);
  --shadow: 0 4px 24px rgba(0,0,0,.2);
  --shadow2: 0 12px 40px rgba(0,0,0,.3);
}

*, *::before, *::after { box-sizing: border-box; }

.ab, .ab * {
  font-family: 'Noto Sans Lao', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

@keyframes shimTxt { 0% { background-position: -200% center } 100% { background-position: 200% center } }
@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes orbPulse { 0%,100% { opacity: .08 } 50% { opacity: .18 } }
@keyframes scan { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }

/* ═══ HERO ═══ */
.ab-hero {
  position: relative; overflow: hidden; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg);
}
.ab-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(13,122,104,.06) 0%, transparent 70%);
}
.dark .ab-hero::before {
  background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(13,122,104,.15) 0%, transparent 70%);
}
.dark .ab-hero {
  background: linear-gradient(170deg, #060e0c 0%, #0a1814 50%, #060e0c 100%);
}

.ab-hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(13,122,104,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13,122,104,.04) 1px, transparent 1px);
  background-size: 72px 72px;
}
.dark .ab-hero-grid {
  background-image:
    linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
}

.ab-orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(80px); animation: orbPulse 6s ease-in-out infinite;
}

.ab-scan-line {
  position: relative; height: 1px; max-width: 400px; margin: 0 auto 28px;
  background: var(--bd); overflow: hidden;
}
.ab-scan-line::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, var(--acc), transparent);
  animation: scan 3s linear infinite;
}

.ab-hero-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
}

/* ═══ TEXT ═══ */
.ab-h1 {
  font-family: 'Inter', 'Noto Sans Lao', sans-serif;
  font-size: clamp(3.2rem, 9vw, 7rem);
  font-weight: 800; line-height: .9; letter-spacing: -2px;
  color: var(--tx);
}
.ab-h1 .shim {
  background: linear-gradient(135deg, var(--pri) 0%, var(--acc2) 45%, var(--pri) 100%);
  background-size: 220% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: shimTxt 5s linear infinite;
}
.dark .ab-h1 .shim {
  background: linear-gradient(135deg, #fff 0%, var(--acc2) 45%, #fff 100%);
  background-size: 220% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ab-h2 {
  font-family: 'Inter', 'Noto Sans Lao', sans-serif;
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  font-weight: 700; color: var(--tx); line-height: 1.15;
}

.ab-tag {
  font-size: .6rem; font-weight: 700; letter-spacing: 3.5px;
  text-transform: uppercase; color: var(--acc);
}

.ab-body {
  font-size: .88rem; color: var(--tx3); line-height: 1.78;
  max-width: 500px;
}

/* ═══ COMPONENTS ═══ */
.ab-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 16px; border-radius: 20px;
  background: rgba(13,122,104,.08); border: 1px solid rgba(13,122,104,.15);
  color: var(--pri); font-size: .62rem; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
}
.dark .ab-pill {
  background: rgba(13,122,104,.14); border-color: rgba(13,122,104,.28);
  color: var(--acc2);
}

.ab-bar {
  height: 3px; width: 40px; border-radius: 2px;
  background: linear-gradient(90deg, var(--pri), var(--acc));
  margin-bottom: 12px;
}
.ab-bar-c { margin-left: auto; margin-right: auto; }

.ab-accent {
  width: 48px; height: 3px; border-radius: 2px;
  background: linear-gradient(90deg, var(--pri), var(--acc));
  margin: 12px 0 20px;
}

/* hero stat */
.ab-hstat {
  border-radius: 16px; padding: 16px 10px; text-align: center;
  background: var(--card); border: 1px solid var(--bd);
  box-shadow: var(--shadow); transition: all .25s;
}
.ab-hstat:hover {
  transform: translateY(-3px); box-shadow: var(--shadow2);
  border-color: rgba(13,122,104,.25);
}

/* stat card */
.ab-stat {
  position: relative; border-radius: 20px; overflow: hidden;
  padding: 28px 16px; text-align: center;
  background: var(--card); border: 1px solid var(--bd);
  box-shadow: var(--shadow); transition: all .3s;
}
.ab-stat::before {
  content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
  background: linear-gradient(90deg, transparent, var(--bd), transparent);
}
.ab-stat:hover {
  transform: translateY(-6px); box-shadow: var(--shadow2);
  border-color: rgba(13,122,104,.2);
}
.ab-stat-ico {
  width: 50px; height: 50px; border-radius: 14px;
  margin: 0 auto 14px; display: flex; align-items: center; justify-content: center;
  background: rgba(13,122,104,.08); border: 1px solid rgba(13,122,104,.15);
  color: var(--pri); font-size: 18px;
}
.dark .ab-stat-ico {
  background: rgba(13,122,104,.18); border-color: rgba(77,184,168,.22);
  color: var(--acc);
}
.ab-stat-val { font-size: 2.2rem; font-weight: 800; color: var(--tx); line-height: 1; margin-bottom: 5px; }
.ab-stat-lbl { font-size: .6rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--tx3); }
.ab-stat-desc { font-size: .68rem; color: var(--tx3); opacity: .6; margin-top: 5px; }

/* glass panel */
.ab-glass {
  background: var(--glass); border: 1px solid var(--bd);
  backdrop-filter: blur(20px) saturate(1.3);
  box-shadow: var(--shadow2);
  position: relative; overflow: hidden; border-radius: 24px;
}
.ab-glass::before {
  content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(13,122,104,.1), transparent);
  pointer-events: none;
}
.dark .ab-glass {
  background: rgba(255,255,255,.04);
  border-color: rgba(255,255,255,.08);
}

/* logo card */
.ab-lcard {
  border-radius: 14px; overflow: hidden;
  background: var(--card); border: 1px solid var(--bd);
  box-shadow: var(--shadow); transition: all .28s;
}
.ab-lcard:hover {
  transform: translateY(-4px); border-color: rgba(13,122,104,.25);
  box-shadow: var(--shadow2);
}
.ab-fade-l {
  position: absolute; left: 0; top: 0; bottom: 0; width: 80px;
  background: linear-gradient(to right, var(--bg2), transparent);
  z-index: 10; pointer-events: none;
}
.ab-fade-r {
  position: absolute; right: 0; top: 0; bottom: 0; width: 80px;
  background: linear-gradient(to left, var(--bg2), transparent);
  z-index: 10; pointer-events: none;
}
.dark .ab-fade-l { background: linear-gradient(to right, var(--bg2), transparent); }
.dark .ab-fade-r { background: linear-gradient(to left, var(--bg2), transparent); }

.ab-swipe { transition: transform .4s cubic-bezier(.25,.46,.45,.94); user-select: none; touch-action: pan-y; }
.ab-swipe.dragging { transition: none; }

/* feature row */
.ab-feat {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 14px; border-radius: 12px;
  background: rgba(13,122,104,.03); border: 1px solid var(--bd);
  transition: all .2s;
}
.ab-feat:hover { background: rgba(13,122,104,.07); }
.dark .ab-feat { background: rgba(255,255,255,.02); }
.dark .ab-feat:hover { background: rgba(13,122,104,.08); }
.ab-feat-dot {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
  background: rgba(13,122,104,.1); border: 1px solid rgba(13,122,104,.2);
  display: flex; align-items: center; justify-content: center;
}
.dark .ab-feat-dot {
  background: rgba(13,122,104,.3); border-color: rgba(77,184,168,.3);
}

/* badge */
.ab-badge {
  border-radius: 16px; padding: 20px 12px; text-align: center;
  background: var(--card); border: 1px solid var(--bd);
  box-shadow: var(--shadow); transition: all .25s;
}
.ab-badge:hover {
  background: rgba(13,122,104,.04); transform: translateY(-3px);
  border-color: rgba(13,122,104,.2); box-shadow: var(--shadow2);
}
.dark .ab-badge:hover { background: rgba(13,122,104,.08); }
.ab-badge-ico {
  width: 44px; height: 44px; border-radius: 12px;
  margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;
  background: rgba(13,122,104,.08); border: 1px solid rgba(13,122,104,.12);
  color: var(--pri); font-size: 16px;
}
.dark .ab-badge-ico {
  background: rgba(13,122,104,.18); border-color: rgba(77,184,168,.2);
  color: var(--acc);
}

/* trust pill */
.ab-trust {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 20px;
  background: var(--card); border: 1px solid var(--bd);
  font-size: .72rem; color: var(--tx3); transition: all .2s;
  box-shadow: var(--shadow);
}
.ab-trust:hover {
  background: rgba(13,122,104,.06); color: var(--tx2);
  border-color: rgba(13,122,104,.2);
}
.dark .ab-trust:hover { background: rgba(13,122,104,.12); color: var(--acc2); }

/* quote */
.ab-quote {
  border-left: 3px solid var(--acc);
  padding: 14px 20px; border-radius: 0 12px 12px 0;
  background: rgba(13,122,104,.04);
  font-style: italic; font-size: .86rem;
  color: var(--tx3); line-height: 1.7;
}
.dark .ab-quote { background: rgba(13,122,104,.06); }

/* sections */
.ab-sec {
  position: relative; padding: 96px 0;
  background: var(--bg);
}
.ab-sec-alt { background: var(--bg2); }
.ab-sec-grad {
  background: var(--bg);
}
.dark .ab-sec-grad {
  background: radial-gradient(ellipse 70% 50% at 30% 40%, rgba(13,122,104,.12) 0%, transparent 60%),
              radial-gradient(ellipse 55% 60% at 80% 70%, rgba(8,61,51,.08) 0%, transparent 55%),
              var(--bg);
}

.ab-dots {
  position: absolute; inset: 0; pointer-events: none; opacity: .02;
  background-image: radial-gradient(circle, var(--tx) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* button */
.ab-btn {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 14px 32px; border-radius: 50px; border: none;
  cursor: pointer; font-family: inherit; font-size: .88rem; font-weight: 600;
  color: #fff; background: linear-gradient(135deg, #0d7a68, #0a6455);
  box-shadow: 0 6px 24px rgba(13,122,104,.3);
  transition: all .25s; letter-spacing: .3px;
}
.ab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(13,122,104,.45);
}

/* subtitle chips */
.ab-chip {
  font-size: clamp(.76rem, 1.5vw, 1rem);
  color: var(--tx3); font-weight: 300;
  letter-spacing: 4px; text-transform: uppercase;
}
.ab-chip-hl {
  color: var(--pri); font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  padding: 4px 16px; border-radius: 8px;
  background: rgba(13,122,104,.06); border: 1px solid rgba(13,122,104,.12);
}
.dark .ab-chip { color: rgba(255,255,255,.4); }
.dark .ab-chip-hl {
  color: var(--acc); background: rgba(13,122,104,.12);
  border-color: rgba(77,184,168,.2);
}

/* divider line */
.ab-divider { height: 1px; background: var(--bd); }

@media (max-width: 640px) {
  .ab-h1 { letter-spacing: -1px; }
  .ab-hero { min-height: auto; }
  .ab-sec { padding: 64px 0; }
}
`;

export default function AboutPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const all = (data.products || [])
          .map((p: any) => {
            const logo = p.Logo?.trim() || p.logo?.trim() || p.Image?.trim() || p.image?.trim() || "";
            if (!logo) return null;
            return { logo, name: p.Name || p.name || "Brand Logo" };
          })
          .filter(Boolean);
        setLogos(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 5;
      if (w >= 1024) return 4;
      if (w >= 768) return 3;
      if (w >= 480) return 2;
      return 1;
    };
    const h = () => {
      setSlidesPerView(calc());
      setCurrentSlide(0);
    };
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const totalSlides = Math.ceil(logos.length / slidesPerView);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) setCurrentX(e.touches[0].clientX);
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentSlide(p => Math.min(p + 1, totalSlides - 1));
      else setCurrentSlide(p => Math.max(p - 1, 0));
    }
  }, [isDragging, startX, currentX, totalSlides]);

  if (!mounted) return null;

  const ani = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  const STATS_HERO = [
    { icon: <FaPlaneDeparture />, val: "500+", lbl: t("models_and_collectors") || "Models" },
    { icon: <FaUsers />, val: "50+", lbl: t("collectors_and_models") || "Collectors" },
    { icon: <FaAward />, val: "4.9★", lbl: t("rating") || "Rating" },
    { icon: <FaGlobe />, val: "5+", lbl: t("countries") || "Countries" },
  ];

  const STATS_NUM = [
    { icon: <FaRocket />, val: "100+", lbl: t("modelsSold") || "Models Sold", desc: t("modelsSoldDesc") || "Premium Collectibles" },
    { icon: <FaUsers />, val: "98%", lbl: t("happyClients") || "Happy Clients", desc: t("happyClientsDesc") || "Worldwide" },
    { icon: <FaStar />, val: "4.9★", lbl: t("qualityRating") || "Quality Rating", desc: t("qualityRatingDesc") || "Customer Satisfaction" },
    { icon: <FaHandshake />, val: "50+", lbl: t("brandPartners") || "Brand Partners", desc: t("brandPartnersDesc") || "Global Network" },
  ];

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ab">
        {/* ═══ HERO ═══ */}
        <section className="ab-hero">
          <div className="ab-hero-grid" />
          <div className="ab-orb" style={{ width: 500, height: 500, top: "-10%", right: "-6%", background: "radial-gradient(circle, rgba(13,122,104,.15) 0%, transparent 70%)" }} />
          <div className="ab-orb" style={{ width: 300, height: 300, bottom: "-5%", left: "3%", background: "radial-gradient(circle, rgba(13,122,104,.1) 0%, transparent 70%)", animationDelay: "3s" }} />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="ab-scan-line" />

            <div className="flex flex-col items-center text-center gap-6">
              <motion.div {...ani(0.04)}>
                <div className="">✦ {t("premiumCollection") || "Premium Aviation Collection"} ✦</div>
              </motion.div>

              <motion.div {...ani(0.08)}>
                <h1 className="ab-h1">
                  <span className="shim">Omelette</span>
                  <span style={{ WebkitTextFillColor: "var(--red)" }}>'</span>
                  <span className="shim">s</span>
                </h1>
              </motion.div>

              <motion.div {...ani(0.12)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="ab-chip">Elevating</span>
                <span className="ab-chip-hl" style={{ fontSize: "clamp(.76rem,1.5vw,1rem)" }}>
                  {t("oms") || "Aviation"}
                </span>
                <span className="ab-chip">Passion</span>
              </motion.div>

              <motion.p {...ani(0.16)} className="ab-body" style={{ margin: "0 auto" }}>
                {t("intro") ||
                  "Where aviation passion meets exquisite craftsmanship. Premium aircraft models that capture the spirit of flight with meticulous detail and authentic heritage."}
              </motion.p>

              <motion.div {...ani(0.2)}>
                <Link to="/Omelette's">
                  <button className="ab-btn">
                    <FaPlaneDeparture style={{ fontSize: 15 }} />
                    {t("exploreButton") || "Explore Collection"}
                  </button>
                </Link>
              </motion.div>

              <motion.div {...ani(0.26)} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg mt-4">
                {STATS_HERO.map((s, i) => (
                  <div key={i} className="ab-hstat">
                    <div style={{ color: "var(--pri)", fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--tx)", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: ".56rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--tx3)", marginTop: 4 }}>{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="ab-hero-fade" />
        </section>

        {/* ═══ STATS ═══ */}
        <section className="ab-sec ab-sec-alt">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div {...ani()} className="text-center mb-14">
              <div className="ab-bar ab-bar-c" />
              <span className="ab-tag">{t("title_desc") || "Our Journey"}</span>
              <h2 className="ab-h2 mt-3">{t("title_desc") || "Our Journey in Numbers"}</h2>
              <p className="ab-body" style={{ margin: "10px auto 0" }}>
                {t("subtitle_desc") || "Years of excellence, countless satisfied collectors, and a growing community of aviation enthusiasts"}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS_NUM.map((item, i) => (
                <motion.div key={i} {...ani(i * 0.07)}>
                  <div className="ab-stat">
                    <div className="ab-stat-ico">{item.icon}</div>
                    <div className="ab-stat-val">{item.val}</div>
                    <div className="ab-stat-lbl">{item.lbl}</div>
                    <div className="ab-stat-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PARTNERS ═══ */}
        <section className="ab-sec">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div {...ani()} className="text-center mb-14">
              <div className="ab-bar ab-bar-c" />
              <span className="ab-tag">{t("title_logos") || "Trusted Partners"}</span>
              <h2 className="ab-h2 mt-3">{t("title_logos") || "Our Trusted Partners & Brands"}</h2>
              <p className="ab-body" style={{ margin: "10px auto 0" }}>
                {t("subtitle_logos") || "Collaborating with industry leaders and premium brands"}
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center gap-4 py-10">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: 120, height: 120, borderRadius: 14, background: "var(--bg3)" }} />
                ))}
              </div>
            ) : logos.length === 0 ? (
              <div className="text-center py-14" style={{ color: "var(--tx3)" }}>
                <FaGlobe style={{ fontSize: 34, margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                <p style={{ fontSize: ".84rem" }}>{t("noLogos") || "No partner logos available"}</p>
              </div>
            ) : (
              <>
                {/* Desktop marquee */}
                <div className="hidden lg:block relative overflow-hidden">
                  <div className="ab-fade-l" />
                  <div className="ab-fade-r" />
                  <div style={{ display: "flex", animation: "marquee 60s linear infinite", width: "max-content" }}>
                    {[...logos, ...logos].map((item, i) => (
                      <div key={i} style={{ flexShrink: 0, padding: "10px 14px" }}>
                        <div className="ab-lcard" style={{ width: 140, height: 140 }}>
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="w-full h-full object-contain p-4"
                            loading="lazy"
                            onError={e => {
                              const el = e.target as HTMLImageElement;
                              el.style.display = "none";
                              el.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:10px"><span style="font-size:.68rem;color:var(--tx3);text-align:center;opacity:.5">${item.name}</span></div>`;
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile swipe */}
                <div className="lg:hidden relative">
                  <div className="overflow-hidden px-8">
                    <div
                      ref={slideRef}
                      className={`ab-swipe flex ${isDragging ? "dragging" : ""}`}
                      style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {logos.map((item, i) => (
                        <div key={i} className="flex-shrink-0 px-2" style={{ width: `${100 / slidesPerView}%` }}>
                          <div className="ab-lcard" style={{ height: 125 }}>
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="w-full h-full object-contain p-4"
                              loading="lazy"
                              onError={e => {
                                const el = e.target as HTMLImageElement;
                                el.style.display = "none";
                                el.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><span style="font-size:.68rem;color:var(--tx3);opacity:.5;text-align:center">${item.name}</span></div>`;
                              }}
                            />
                          </div>
                          <p style={{ fontSize: ".65rem", color: "var(--tx3)", opacity: 0.5, textAlign: "center", marginTop: 6 }} className="truncate">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                      {Array.from({ length: totalSlides }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          style={{
                            height: 4,
                            width: i === currentSlide ? 24 : 4,
                            borderRadius: 2,
                            background: i === currentSlide ? "var(--acc)" : "var(--bd)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all .3s",
                            padding: 0,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <p style={{ textAlign: "center", fontSize: ".56rem", color: "var(--tx3)", opacity: 0.4, marginTop: 8, letterSpacing: "2px", textTransform: "uppercase" }}>
                    {t("swipeHint") || "swipe to explore"}
                  </p>
                </div>
              </>
            )}

            {/* Partner badges */}
            <motion.div {...ani(0.1)} className="mt-14">
              <div className="ab-divider" style={{ marginBottom: 28 }} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <FaCheck />, title: t("qualityAssured") || "Quality Assured", desc: t("qualityAssuredDesc") || "Premium Standards" },
                  { icon: <MdSecurity />, title: t("secure_partner") || "Secure", desc: t("secureDesc") || "Trusted Partnerships" },
                  { icon: <FaHandshake />, title: t("reliable") || "Reliable", desc: t("reliableDesc") || "Long-term Relations" },
                  { icon: <FaStar />, title: t("exclusive") || "Exclusive", desc: t("exclusiveDesc") || "Limited Partnerships" },
                ].map((item, i) => (
                  <motion.div key={i} {...ani(i * 0.06)}>
                    <div className="ab-badge">
                      <div className="ab-badge-ico">{item.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: ".78rem", color: "var(--tx2)", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: ".68rem", color: "var(--tx3)", opacity: 0.6 }}>{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ MISSION & VISION ═══ */}
        <section className="ab-sec ab-sec-alt">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div {...ani()} className="text-center mb-14">
              <div className="ab-bar ab-bar-c" />
              <span className="ab-tag">{t("title_purpose") || "Purpose & Promise"}</span>
              <h2 className="ab-h2 mt-3">{t("title_purpose") || "Our Purpose & Promise"}</h2>
              <p className="ab-body" style={{ margin: "10px auto 0" }}>
                {t("subtitle_purpose") || "Driving passion for aviation through exceptional craftsmanship"}
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <Tabs
                aria-label="Mission and Vision"
                classNames={{
                  tabList: "p-1 rounded-xl gap-2",
                  tab: "rounded-lg data-[selected=true]:text-white text-sm font-semibold",
                  cursor: "rounded-lg",
                  panel: "pt-0",
                }}
                style={
                  {
                    "--heroui-tab-list-bg": "var(--card)",
                    "--heroui-cursor-bg": "var(--pri)",
                  } as any
                }
              >
                <Tab
                  key="mission"
                  title={
                    <div className="flex items-center gap-2 px-2 py-1">
                      <FaRocket style={{ fontSize: 12, color: "var(--acc)" }} />
                      <span>{t("tabTitle") || "Mission"}</span>
                    </div>
                  }
                >
                  <motion.div {...ani()} className="ab-glass mt-4">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div style={{ padding: "clamp(24px, 5vw, 44px)" }}>
                        <h3 className="ab-h2" style={{ marginBottom: 12 }}>
                          {t("title_mission") || "To Inspire Aviation Passion"}
                        </h3>
                        <div className="ab-accent" />
                        <div className="flex flex-col gap-3">
                          {((t("points", { returnObjects: true }) as string[]) || [
                            "Deliver premium, authentic aircraft models",
                            "Foster a global community of aviation enthusiasts",
                            "Maintain uncompromising quality standards",
                            "Provide exceptional customer experiences",
                            "Promote aviation heritage and innovation",
                          ]).map((item, i) => (
                            <div key={i} className="ab-feat">
                              <div className="ab-feat-dot">
                                <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="var(--acc2)" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span style={{ fontSize: ".84rem", color: "var(--tx3)", lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
                        <Image
                          src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/2_vwhyiw.png"
                          alt="Mission"
                          className="w-full h-full object-cover"
                          style={{ minHeight: 260 }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--bg) 0%, transparent 40%)", pointerEvents: "none", opacity: 0.6 }} />
                      </div>
                    </div>
                  </motion.div>
                </Tab>

                <Tab
                  key="vision"
                  title={
                    <div className="flex items-center gap-2 px-2 py-1">
                      <FaGlobe style={{ fontSize: 12, color: "var(--acc)" }} />
                      <span>{t("tabTitle_vision") || "Vision"}</span>
                    </div>
                  }
                >
                  <motion.div {...ani()} className="ab-glass mt-4">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div style={{ position: "relative", minHeight: 260, overflow: "hidden", order: 2 }} className="lg:order-1">
                        <Image
                          src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/3_jgef5j.png"
                          alt="Vision"
                          className="w-full h-full object-cover"
                          style={{ minHeight: 260 }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, var(--bg) 0%, transparent 40%)", pointerEvents: "none", opacity: 0.6 }} />
                      </div>
                      <div style={{ padding: "clamp(24px, 5vw, 44px)", order: 1 }} className="lg:order-2">
                        <h3 className="ab-h2" style={{ marginBottom: 12 }}>
                          {t("title_vision") || "Global Aviation Leadership"}
                        </h3>
                        <div className="ab-accent" />
                        <p style={{ fontSize: ".86rem", color: "var(--tx3)", lineHeight: 1.78, marginBottom: 20 }}>
                          {t("description") ||
                            "To become the world's most trusted destination for premium aviation collectibles, setting new standards for quality, authenticity, and customer experience."}
                        </p>
                        <div className="ab-quote">
                          &ldquo;
                          {t("quote_subtitle") ||
                            "Where every model tells a story, and every collector becomes part of aviation history."}
                          &rdquo;
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="ab-sec ab-sec-grad relative overflow-hidden">
          <div className="ab-dots" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div {...ani()}>
              <div className="ab-bar ab-bar-c" />
              <span className="ab-tag" style={{ textAlign: "center", display: "block", marginBottom: 14 }}>
                ✦ Join The Community ✦
              </span>
              <h2 className="ab-h2 mb-4">{t("title_start") || "Ready to Start Your Aviation Collection?"}</h2>
              <p className="ab-body" style={{ margin: "0 auto 36px" }}>
                {t("subtitle_start") || "Join thousands of satisfied collectors who trust Omelette's for premium aviation models."}
              </p>
              <Link to="/help">
                <button className="ab-btn">
                  <TbHeadset style={{ fontSize: 16 }} />
                  {t("contactButton") || "Contact Expert"}
                </button>
              </Link>
            </motion.div>

            <motion.div {...ani(0.14)} className="flex flex-wrap justify-center gap-3 mt-12 pt-10" style={{ borderTop: "1px solid var(--bd)" }}>
              {[
                { icon: <MdSecurity />, lbl: t("trustIndicators.securePayment") || "Secure Payment" },
                { icon: <TbTruckDelivery />, lbl: t("trustIndicators.freeShipping") || "Free Shipping*" },
                { icon: <TbHeadset />, lbl: t("trustIndicators.support24_7") || "24/7 Support" },
                { icon: <TbCertificate />, lbl: t("trustIndicators.authenticity") || "Authenticity" },
              ].map((item, i) => (
                <div key={i} className="ab-trust">
                  {item.icon}
                  <span>{item.lbl}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}