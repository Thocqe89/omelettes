import { useTranslation } from "react-i18next";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaRocket, FaUsers, FaAward, FaHandshake,
  FaStar, FaGlobe, FaCheck, FaPlane, FaPlaneDeparture,
} from "react-icons/fa6";
import { MdFlight, MdSecurity } from "react-icons/md";
import { TbTruckDelivery, TbHeadset, TbCertificate } from "react-icons/tb";
import DefaultLayout from "@/layouts/default";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   LOGO URLS
───────────────────────────────────────────── */
const LOGO_2025 = "https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png";
const LOGO_2026 = "https://res.cloudinary.com/deahgtn57/image/upload/v1774003390/omelett%27s/public/image/ChatGPT_Image_Mar_13_2026_05_25_31_PM_cm7izl.png";

/* ─────────────────────────────────────────────
   CSS
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400;1,600&display=swap');

  :root {
    --t:  #0d7a68; --t2: #0a6455; --t3: #083d33;
    --tm: #4db8a8; --tp: #7dd4c8;
    --r:  #c0192c; --r2: #9e1224; --rm: #e85566;
    --dk: #050e0c; --dk2: #07120f; --dk3: #081a15;
  }

  .ab * { font-family:'Ubuntu',sans-serif; box-sizing:border-box; }

  /* keyframes */
  @keyframes abUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes abFade  { from{opacity:0} to{opacity:1} }
  @keyframes abShim  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes abOrbit { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes abGlow  { 0%,100%{opacity:.16} 50%{opacity:.32} }
  @keyframes abRun   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes abPulse { 0%,100%{box-shadow:0 0 0 0 rgba(13,122,104,.4)} 70%{box-shadow:0 0 0 12px rgba(13,122,104,0)} }
  @keyframes abLogo  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-6px) scale(1.02)} }
  @keyframes abSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* shimmer text */
  .ab-shim-teal {
    background: linear-gradient(135deg,#fff 0%,var(--tp) 45%,#fff 100%);
    background-size:220% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:abShim 5s linear infinite;
  }

  /* ── HERO ── */
  .ab-hero {
    position:relative; min-height:100vh; display:flex; align-items:center;
    overflow:hidden;
    background:
      radial-gradient(ellipse 80% 55% at 35% 38%,rgba(13,122,104,.38) 0%,transparent 65%),
      radial-gradient(ellipse 55% 65% at 80% 75%,rgba(8,61,51,.5) 0%,transparent 55%),
      linear-gradient(160deg,#050e0c 0%,#081a15 55%,#050e0c 100%);
  }
  .ab-grid-bg {
    position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
    background-size:60px 60px;
  }
  .ab-orb {
    position:absolute; border-radius:50%; pointer-events:none; filter:blur(60px);
    animation:abGlow 5s ease-in-out infinite;
  }
  .ab-orbit {
    position:absolute; border-radius:50%; pointer-events:none;
    border:1px solid rgba(13,122,104,.1);
    animation:abOrbit 40s linear infinite;
    top:50%; left:50%;
  }
  .ab-runway {
    position:relative; height:1px;
    background:rgba(255,255,255,.07);
    overflow:hidden; border-radius:1px;
  }
  .ab-runway::after {
    content:''; position:absolute; top:0; left:0; right:0; height:100%;
    background:linear-gradient(90deg,transparent,rgba(77,184,168,.7),transparent);
    animation:abRun 3s linear infinite;
  }

  /* hero title */
  .ab-h1 { font-size:clamp(3.2rem,8vw,6.8rem); font-weight:700; line-height:1; letter-spacing:-1.5px; }
  .ab-h2 { font-family:'Cormorant Garamond',serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:600; color:#fff; line-height:1.2; }
  .ab-label { font-size:.62rem; font-weight:700; letter-spacing:3.5px; text-transform:uppercase; color:var(--tm); display:block; }
  .ab-accent { width:48px; height:3px; border-radius:2px; background:linear-gradient(90deg,var(--t),var(--tm)); margin:14px 0 22px; }
  .ab-bar { height:2px; background:linear-gradient(90deg,var(--t),var(--tm),var(--tp),var(--tm),var(--t)); background-size:250% auto; animation:abShim 4s linear infinite; }

  /* glass */
  .ab-glass {
    background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.13);
    backdrop-filter:blur(24px) saturate(1.6);
    -webkit-backdrop-filter:blur(24px) saturate(1.6);
    box-shadow:0 8px 32px rgba(0,0,0,.28), 0 1px 0 rgba(255,255,255,.09) inset;
  }
  .ab-glass::before {
    content:''; position:absolute; top:0; left:14%; right:14%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent);
    pointer-events:none;
  }

  /* stat card */
  .ab-stat {
    position:relative; border-radius:22px; overflow:hidden; padding:28px 20px; text-align:center;
    background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
    backdrop-filter:blur(16px); transition:transform .3s,box-shadow .3s;
  }
  .ab-stat::before { content:''; position:absolute; top:0; left:14%; right:14%; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent); }
  .ab-stat:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(0,0,0,.35); }
  .ab-stat-icon { width:48px; height:48px; border-radius:14px; margin:0 auto 14px; display:flex; align-items:center; justify-content:center; background:rgba(13,122,104,.22); border:1px solid rgba(77,184,168,.28); color:var(--tp); font-size:18px; }
  .ab-stat-val  { font-size:2.1rem; font-weight:700; color:#fff; line-height:1; margin-bottom:4px; }
  .ab-stat-lbl  { font-size:.68rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.4); }
  .ab-stat-desc { font-size:.72rem; color:rgba(255,255,255,.28); margin-top:4px; }

  /* logo card */
  .ab-logo-card { border-radius:16px; overflow:hidden; background:rgba(255,255,255,.05); border:1px solid rgba(13,122,104,.16); transition:transform .3s,border-color .3s,box-shadow .3s; }
  .ab-logo-card:hover { transform:translateY(-6px); border-color:rgba(77,184,168,.42); box-shadow:0 16px 40px rgba(13,122,104,.18); }

  /* feature row */
  .ab-feat { display:flex; align-items:flex-start; gap:13px; padding:13px 15px; border-radius:13px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); transition:background .2s; }
  .ab-feat:hover { background:rgba(13,122,104,.1); }
  .ab-feat-dot { width:20px; height:20px; border-radius:50%; flex-shrink:0; margin-top:2px; background:rgba(13,122,104,.45); border:1px solid rgba(77,184,168,.38); display:flex; align-items:center; justify-content:center; }

  /* badge */
  .ab-badge { border-radius:16px; padding:20px 16px; text-align:center; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); transition:background .25s,transform .25s; }
  .ab-badge:hover { background:rgba(13,122,104,.1); transform:translateY(-3px); }
  .ab-badge-icon { width:44px; height:44px; border-radius:12px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; background:rgba(13,122,104,.18); border:1px solid rgba(77,184,168,.22); color:var(--tm); font-size:16px; }

  /* trust pill */
  .ab-trust { display:flex; align-items:center; gap:7px; padding:8px 14px; border-radius:20px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09); font-size:.73rem; color:rgba(255,255,255,.55); transition:background .2s,color .2s; }
  .ab-trust:hover { background:rgba(13,122,104,.14); color:rgba(255,255,255,.85); }

  /* quote */
  .ab-quote { border-left:3px solid var(--tm); padding:13px 18px; border-radius:0 12px 12px 0; background:rgba(13,122,104,.08); font-style:italic; font-size:.88rem; color:rgba(255,255,255,.55); line-height:1.65; }

  /* swipe */
  .ab-swipe { transition:transform .4s cubic-bezier(.25,.46,.45,.94); user-select:none; touch-action:pan-y; }
  .ab-swipe.dragging { transition:none; }
  .ab-fade-l { position:absolute; left:0; top:0; bottom:0; width:72px; background:linear-gradient(to right,var(--dk2),transparent); z-index:10; pointer-events:none; }
  .ab-fade-r { position:absolute; right:0; top:0; bottom:0; width:72px; background:linear-gradient(to left,var(--dk2),transparent); z-index:10; pointer-events:none; }

  /* ══════════════════════════════════════
     LOGO EVOLUTION SECTION
  ══════════════════════════════════════ */
  .ab-evo {
    position:relative; overflow:hidden;
    background:
      radial-gradient(ellipse 70% 55% at 20% 40%, rgba(192,25,44,.18) 0%,transparent 60%),
      radial-gradient(ellipse 60% 55% at 80% 60%, rgba(13,122,104,.22) 0%,transparent 60%),
      linear-gradient(160deg,#0c0506 0%,#0d100e 50%,#0c0506 100%);
  }
  .ab-evo-dots {
    position:absolute; inset:0; pointer-events:none;
    background-image:radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px);
    background-size:28px 28px;
    mask-image:radial-gradient(ellipse 90% 90% at 50% 50%,black 40%,transparent 100%);
  }

  /* version card */
  .ab-ver-card {
    position:relative; border-radius:28px; overflow:hidden;
    backdrop-filter:blur(32px) saturate(1.8);
    -webkit-backdrop-filter:blur(32px) saturate(1.8);
    transition:transform .4s cubic-bezier(.22,1,.36,1), box-shadow .4s;
    cursor:pointer;
  }
  .ab-ver-card:hover { transform:translateY(-8px) scale(1.02); }

  /* teal version */
  .ab-ver-teal {
    background:rgba(13,122,104,.12);
    border:1px solid rgba(77,184,168,.25);
    box-shadow:0 16px 48px rgba(13,122,104,.18), 0 1px 0 rgba(255,255,255,.1) inset;
  }
  .ab-ver-teal:hover { box-shadow:0 28px 64px rgba(13,122,104,.32), 0 1px 0 rgba(255,255,255,.14) inset; }

  /* red version */
  .ab-ver-red {
    background:rgba(192,25,44,.1);
    border:1px solid rgba(232,85,102,.22);
    box-shadow:0 16px 48px rgba(192,25,44,.16), 0 1px 0 rgba(255,255,255,.08) inset;
  }
  .ab-ver-red:hover { box-shadow:0 28px 64px rgba(192,25,44,.3), 0 1px 0 rgba(255,255,255,.12) inset; }

  /* specular top edge */
  .ab-ver-card::before {
    content:''; position:absolute; top:0; left:12%; right:12%; height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);
    pointer-events:none; z-index:2;
  }

  .ab-ver-logo-wrap {
    position:relative; z-index:1;
    display:flex; align-items:center; justify-content:center;
    padding:36px 28px 20px;
  }
  .ab-ver-logo { width:130px; height:130px; object-fit:contain; filter:drop-shadow(0 12px 28px rgba(0,0,0,.45)); animation:abLogo 4s ease-in-out infinite; }
  .ab-ver-info { padding:0 24px 28px; position:relative; z-index:1; }

  /* year pill */
  .ab-year-teal { display:inline-flex; align-items:center; gap:6px; padding:4px 14px; border-radius:20px; font-size:.6rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; background:rgba(13,122,104,.2); border:1px solid rgba(77,184,168,.3); color:var(--tm); margin-bottom:10px; }
  .ab-year-red  { display:inline-flex; align-items:center; gap:6px; padding:4px 14px; border-radius:20px; font-size:.6rem; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; background:rgba(192,25,44,.18); border:1px solid rgba(232,85,102,.28); color:var(--rm); margin-bottom:10px; }

  .ab-year-dot-teal { width:5px; height:5px; border-radius:50%; background:var(--tm); box-shadow:0 0 6px var(--tm); animation:abPulse 2s infinite; }
  .ab-year-dot-red  { width:5px; height:5px; border-radius:50%; background:var(--rm); box-shadow:0 0 6px var(--rm); animation:abPulse 2s 1s infinite; }

  .ab-ver-name { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:600; color:#fff; line-height:1.15; margin-bottom:6px; }
  .ab-ver-desc { font-size:.75rem; color:rgba(255,255,255,.38); line-height:1.6; }

  /* status banner */
  .ab-status-current { display:inline-flex; align-items:center; gap:6px; font-size:.6rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; border-radius:8px; background:rgba(13,122,104,.2); border:1px solid rgba(77,184,168,.25); color:var(--tm); margin-top:10px; }
  .ab-status-soon    { display:inline-flex; align-items:center; gap:6px; font-size:.6rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; border-radius:8px; background:rgba(192,25,44,.15); border:1px solid rgba(232,85,102,.22); color:var(--rm); margin-top:10px; }

  /* connector */
  .ab-connector {
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
    position:relative;
  }
  .ab-conn-line {
    width:1.5px; flex:1; min-height:48px;
    background:linear-gradient(to bottom,rgba(77,184,168,.4),rgba(255,255,255,.12),rgba(232,85,102,.35));
    position:relative; overflow:hidden;
  }
  .ab-conn-line::after {
    content:''; position:absolute; top:0; left:0; right:0; height:30%;
    background:linear-gradient(to bottom,rgba(255,255,255,.6),transparent);
    animation:abRun 2s linear infinite;
    animation-direction:normal;
  }
  .ab-conn-mid {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
    color:rgba(255,255,255,.5); font-size:12px;
    backdrop-filter:blur(8px);
  }

  /* lightbox */
  .ab-lb {
    position:fixed; inset:0; z-index:999999;
    display:flex; align-items:center; justify-content:center; padding:20px;
    background:rgba(4,8,6,.92); backdrop-filter:blur(24px);
    animation:abFade .22s ease both;
  }
  .ab-lb-panel {
    position:relative; width:100%; max-width:380px;
    border-radius:32px; overflow:hidden;
    background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.16);
    backdrop-filter:blur(48px) saturate(1.8);
    box-shadow:0 40px 100px rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.16) inset;
    animation:abUp .3s cubic-bezier(.22,1,.36,1) both;
  }
  .ab-lb-close {
    position:absolute; top:14px; right:14px; z-index:5;
    width:30px; height:30px; border-radius:50%;
    background:rgba(228,54,54,.4); border:1px solid rgba(228,54,54,.3);
    color:#fff; display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:16px; line-height:1; font-weight:300;
    transition:background .2s,transform .2s;
  }
  .ab-lb-close:hover { background:rgba(228,54,54,.8); transform:scale(1.1); }
  .ab-lb-img { width:220px; height:220px; object-fit:contain; filter:drop-shadow(0 12px 32px rgba(0,0,0,.4)); }

  /* CTA */
  .ab-cta {
    position:relative; overflow:hidden;
    background:
      radial-gradient(ellipse 75% 55% at 30% 40%,rgba(13,122,104,.42) 0%,transparent 65%),
      radial-gradient(ellipse 55% 65% at 80% 70%,rgba(8,61,51,.48) 0%,transparent 60%),
      linear-gradient(160deg,#050e0c 0%,#081a15 55%,#050e0c 100%);
  }
  .ab-cta-dots { position:absolute; inset:0; pointer-events:none; opacity:.04; background-image:radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px); background-size:44px 44px; }
`;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function AboutPage() {
  const { t } = useTranslation();
  const [mounted,       setMounted]       = useState(false);
  const [logos,         setLogos]         = useState<any[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [currentSlide,  setCurrentSlide]  = useState(0);
  const [isDragging,    setIsDragging]    = useState(false);
  const [startX,        setStartX]        = useState(0);
  const [currentX,      setCurrentX]      = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [lightbox,      setLightbox]      = useState<{src:string;year:string;color:string}|null>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const all = (data.products || []).map((p:any) => {
          const logo = p.Logo?.trim() || p.logo?.trim() || p.Image?.trim() || p.image?.trim() || "";
          if (!logo) return null;
          return { logo, name: p.Name || p.name || "Brand Logo" };
        }).filter(Boolean);
        setLogos(all); setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) return 5; if (w >= 1024) return 4;
      if (w >= 768)  return 3; if (w >= 480)  return 2;
      return 1;
    };
    const h = () => { setSlidesPerView(calc()); setCurrentSlide(0); };
    h(); window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const totalSlides = Math.ceil(logos.length / slidesPerView);
  const handleTouchStart = useCallback((e:React.TouchEvent) => { setIsDragging(true); setStartX(e.touches[0].clientX); setCurrentX(e.touches[0].clientX); }, []);
  const handleTouchMove  = useCallback((e:React.TouchEvent) => { if (isDragging) setCurrentX(e.touches[0].clientX); }, [isDragging]);
  const handleTouchEnd   = useCallback(() => {
    if (!isDragging) return; setIsDragging(false);
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentSlide(p => Math.min(p+1, totalSlides-1));
      else           setCurrentSlide(p => Math.max(p-1, 0));
    }
  }, [isDragging, startX, currentX, totalSlides]);

  if (!mounted) return null;

  const fu = (delay=0) => ({
    initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0},
    viewport:{once:true}, transition:{duration:.55,ease:"easeOut" as const,delay},
  });

  const STATS_HERO = [
    {icon:<FaPlane/>,    val:"500+", lbl:t("models_and_collectors")||"Models"},
    {icon:<FaUsers/>,    val:"50+",  lbl:t("collectors_and_models")||"Collectors"},
    {icon:<FaAward/>,    val:"4.9★", lbl:t("rating")||"Rating"},
    {icon:<FaGlobe/>,    val:"5+",   lbl:t("countries")||"Countries"},
  ];
  const STATS_NUM = [
    {icon:<FaRocket/>,    val:"100+", lbl:t("modelsSold")||"Models Sold",      desc:t("modelsSoldDesc")||"Premium Collectibles"},
    {icon:<FaUsers/>,     val:"98%",  lbl:t("happyClients")||"Happy Clients",  desc:t("happyClientsDesc")||"Worldwide"},
    {icon:<FaStar/>,      val:"4.9★", lbl:t("qualityRating")||"Quality Rating",desc:t("qualityRatingDesc")||"Customer Satisfaction"},
    {icon:<FaHandshake/>, val:"50+",  lbl:t("brandPartners")||"Brand Partners",desc:t("brandPartnersDesc")||"Global Network"},
  ];

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <div className="ab">

        {/* ══════════════ HERO ══════════════ */}
        <section className="ab-hero">
          <div className="ab-grid-bg"/>
          <div className="ab-orb" style={{width:480,height:480,top:"-10%",right:"-5%",background:"radial-gradient(circle,rgba(13,122,104,.24) 0%,transparent 70%)"}}/>
          <div className="ab-orb" style={{width:320,height:320,bottom:"-8%",left:"3%",background:"radial-gradient(circle,rgba(13,122,104,.16) 0%,transparent 70%)",animationDelay:"2s"}}/>
          <div className="ab-orbit hidden lg:block" style={{width:540,height:540,animationDuration:"42s"}}/>
          <div className="ab-orbit hidden lg:block" style={{width:360,height:360,animationDuration:"26s",animationDirection:"reverse",borderStyle:"dashed",opacity:.4}}/>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
            <div className="ab-runway max-w-4xl mx-auto mb-12"/>
            <div className="flex flex-col items-center text-center gap-8">

              <motion.div {...fu(0)} className="inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{background:"rgba(13,122,104,.18)",border:"1px solid rgba(13,122,104,.38)",color:"#7dd4c8",fontSize:".68rem",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase"}}>
                ✦ {t("premiumCollection")} ✦
              </motion.div>

              <motion.div {...fu(.08)}>
                <h1 className="ab-h1">
                  <span className="ab-shim-teal">Omelette</span>
                  <span style={{color:"#E43636"}}>'</span>
                  <span className="ab-shim-teal">s</span>
                </h1>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginTop:16,flexWrap:"wrap"}}>
                  <span style={{fontSize:"clamp(.85rem,2vw,1.3rem)",color:"rgba(255,255,255,.55)",fontWeight:300,letterSpacing:"4px",textTransform:"uppercase"}}>Elevating</span>
                  <span style={{fontSize:"clamp(.85rem,2vw,1.3rem)",color:"var(--tm)",fontWeight:600,letterSpacing:"4px",textTransform:"uppercase",padding:"4px 16px",background:"rgba(13,122,104,.14)",border:"1px solid rgba(77,184,168,.22)",borderRadius:8}}>{t("oms")}</span>
                  <span style={{fontSize:"clamp(.85rem,2vw,1.3rem)",color:"rgba(255,255,255,.55)",fontWeight:300,letterSpacing:"4px",textTransform:"uppercase"}}>Passion</span>
                </div>
              </motion.div>

              <motion.p {...fu(.16)} style={{fontSize:"clamp(.86rem,1.8vw,1.06rem)",color:"rgba(255,255,255,.45)",maxWidth:540,lineHeight:1.8}}>
                {t("subtitle")||"Where aviation passion meets exquisite craftsmanship. Premium aircraft models that capture the spirit of flight with meticulous detail and authentic heritage."}
              </motion.p>

              <motion.div {...fu(.22)}>
                <Link to="/Omelette's">
                  <Button size="lg" style={{background:"linear-gradient(135deg,#0d7a68,#0a6455)",color:"#fff",fontWeight:600,padding:"14px 32px",borderRadius:8,boxShadow:"0 8px 28px rgba(13,122,104,.45)",border:"none",fontSize:".92rem",letterSpacing:".4px",display:"inline-flex",alignItems:"center",gap:10}}>
                    <FaPlaneDeparture style={{fontSize:17}}/> {t("exploreButton")||"Explore Collection"}
                  </Button>
                </Link>
              </motion.div>

              <motion.div {...fu(.28)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl mt-2">
                {STATS_HERO.map((s,i) => (
                  <div key={i} className="ab-glass relative rounded-2xl p-5 text-center">
                    <div style={{color:"var(--tm)",fontSize:20,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:"1.5rem",fontWeight:700,color:"#fff",lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:".62rem",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginTop:4}}>{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{background:"linear-gradient(to bottom,transparent,#050e0c)"}}/>
        </section>

        {/* ══════════════ STATS ══════════════ */}
        <section className="relative py-24" style={{background:"linear-gradient(180deg,#050e0c 0%,#07120f 100%)"}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fu(0)} className="text-center mb-16">
              <div className="ab-bar w-12 mx-auto mb-6"/>
              <span className="ab-label">{t("title_desc")||"Our Journey"}</span>
              <h2 className="ab-h2 mt-2"><span className="ab-shim-teal">{t("title_desc")||"Our Journey in Numbers"}</span></h2>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:".88rem",maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>{t("subtitle_desc")||"Years of excellence, countless satisfied collectors, and a growing community of aviation enthusiasts"}</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STATS_NUM.map((item,i) => (
                <motion.div key={i} {...fu(i*.08)}>
                  <div className="ab-stat">
                    <div className="ab-stat-icon">{item.icon}</div>
                    <div className="ab-stat-val">{item.val}</div>
                    <div className="ab-stat-lbl">{item.lbl}</div>
                    <div className="ab-stat-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ LOGO EVOLUTION ══════════════ */}
        <section className="ab-evo relative py-28">
          <div className="ab-evo-dots"/>
          {/* vivid bg orbs */}
          <div style={{position:"absolute",width:500,height:500,top:"-15%",left:"-8%",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,25,44,.28) 0%,transparent 65%)",filter:"blur(65px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:420,height:420,bottom:"-12%",right:"-6%",borderRadius:"50%",background:"radial-gradient(circle,rgba(13,122,104,.32) 0%,transparent 65%)",filter:"blur(58px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",width:260,height:260,top:"30%",right:"20%",borderRadius:"50%",background:"radial-gradient(circle,rgba(77,184,168,.12) 0%,transparent 65%)",filter:"blur(40px)",pointerEvents:"none"}}/>

          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div {...fu(0)} className="text-center mb-16">
              <div className="ab-bar w-12 mx-auto mb-6"/>
              <span className="ab-label" style={{color:"rgba(232,85,102,.8)"}}>Brand Evolution</span>
              <h2 className="ab-h2 mt-2" style={{color:"#fff"}}>Our Logo Journey</h2>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:".88rem",maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>
                From our original identity to our upcoming rebrand — two chapters of the same story.
              </p>
            </motion.div>

            {/* Two logo cards + connector */}
            <div className="flex flex-col lg:flex-row items-center gap-0 justify-center">

              {/* ── 2025 / Original ── */}
              <motion.div {...fu(.05)} style={{width:"100%",maxWidth:280}}>
                <div className="ab-ver-card ab-ver-teal" onClick={() => setLightbox({src:LOGO_2025,year:"Original Logo — 2025",color:"teal"})}>
                  <div className="ab-bar"/>
                  <div className="ab-ver-logo-wrap">
                    <img src={LOGO_2025} alt="2025 Logo" className="ab-ver-logo"/>
                  </div>
                  <div className="ab-ver-info">
                    <div className="ab-year-teal"><div className="ab-year-dot-teal"/>2025</div>
                    <div className="ab-ver-name">Original Identity</div>
                    <div className="ab-ver-desc">The mark that started our journey — clean, bold, recognizable.</div>
                    <div className="ab-status-current">✦ Current Logo</div>
                  </div>
                  {/* hover view hint */}
                  <div style={{position:"absolute",inset:0,borderRadius:28,background:"rgba(0,0,0,.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .22s"}} className="ab-hover-overlay">
                    <span style={{color:"#fff",fontSize:".72rem",letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>View Full</span>
                  </div>
                </div>
                <p style={{textAlign:"center",fontSize:".58rem",color:"rgba(255,255,255,.18)",letterSpacing:"2px",textTransform:"uppercase",marginTop:10}}>click to view</p>
              </motion.div>

              {/* ── Connector ── */}
              <motion.div {...fu(.12)} className="ab-connector" style={{padding:"0 16px",flexShrink:0,height:260}} >
                <div className="ab-conn-line"/>
                <div className="ab-conn-mid">→</div>
                <div style={{fontSize:".52rem",color:"rgba(255,255,255,.25)",letterSpacing:"2px",textTransform:"uppercase",writingMode:"horizontal-tb",textAlign:"center",lineHeight:1.5}}>
                  evolving
                </div>
                <div className="ab-conn-line"/>
              </motion.div>

              {/* ── 2026 / New ── */}
              <motion.div {...fu(.18)} style={{width:"100%",maxWidth:280}}>
                <div className="ab-ver-card ab-ver-red" onClick={() => setLightbox({src:LOGO_2026,year:"New Logo — 2026",color:"red"})}>
                  <div style={{height:2,background:"linear-gradient(90deg,var(--r2),var(--r),var(--rm),var(--r),var(--r2))",backgroundSize:"250% auto",animation:"abShim 4s linear infinite"}}/>
                  <div className="ab-ver-logo-wrap">
                    <img src={LOGO_2026} alt="2026 Logo" className="ab-ver-logo" style={{animationDelay:"2s"}}/>
                  </div>
                  <div className="ab-ver-info">
                    <div className="ab-year-red"><div className="ab-year-dot-red"/>2026</div>
                    <div className="ab-ver-name">New Identity</div>
                    <div className="ab-ver-desc">Refined, bolder, and ready for the next chapter of our story.</div>
                    <div className="ab-status-soon">⟳ Coming Soon</div>
                  </div>
                </div>
                <p style={{textAlign:"center",fontSize:".58rem",color:"rgba(255,255,255,.18)",letterSpacing:"2px",textTransform:"uppercase",marginTop:10}}>click to view</p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* CSS for hover overlay */}
        <style>{`.ab-ver-card:hover .ab-hover-overlay { opacity: 1 !important; }`}</style>

        {/* ══════════════ PARTNERS ══════════════ */}
        <section className="relative py-24" style={{background:"#07120f"}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fu(0)} className="text-center mb-16">
              <div className="ab-bar w-12 mx-auto mb-6"/>
              <span className="ab-label">{t("title_logos")||"Trusted Partners"}</span>
              <h2 className="ab-h2 mt-2" style={{color:"#fff"}}>{t("title_logos")||"Our Trusted Partners & Brands"}</h2>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:".88rem",maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>{t("subtitle_logos")||"Collaborating with industry leaders and premium brands"}</p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center gap-4 py-12">
                {[1,2,3,4].map(i => <div key={i} style={{width:120,height:120,borderRadius:16,background:"rgba(255,255,255,.05)",animation:"abGlow 2s ease-in-out infinite"}}/>)}
              </div>
            ) : logos.length === 0 ? (
              <div className="text-center py-16" style={{color:"rgba(255,255,255,.28)"}}>
                <FaGlobe style={{fontSize:36,margin:"0 auto 10px",display:"block",opacity:.3}}/>
                <p style={{fontSize:".85rem"}}>{t("noLogos")||"No partner logos available"}</p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block relative overflow-hidden">
                  <div className="ab-fade-l"/> <div className="ab-fade-r"/>
                  <motion.div animate={{x:[0,-1000]}} transition={{duration:60,repeat:Infinity,ease:"linear"}} className="flex gap-8 py-6">
                    {[...logos,...logos].map((item,i) => (
                      <div key={i} className="flex-shrink-0">
                        <motion.div whileHover={{scale:1.05}} className="ab-logo-card" style={{width:140,height:140}}>
                          <img src={item.logo} alt={item.name} className="w-full h-full object-contain p-4" loading="lazy"
                            onError={e=>{const t=e.target as HTMLImageElement;t.style.display="none";t.parentElement!.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:12px"><span style="font-size:.7rem;color:rgba(255,255,255,.35);text-align:center">${item.name}</span></div>`;}}
                          />
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                <div className="lg:hidden relative">
                  <div className="overflow-hidden px-10">
                    <div ref={slideRef} className={`ab-swipe flex ${isDragging?"dragging":""}`}
                      style={{transform:`translateX(-${currentSlide*(100/slidesPerView)}%)`}}
                      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                      {logos.map((item,i) => (
                        <div key={i} className="flex-shrink-0 px-2" style={{width:`${100/slidesPerView}%`}}>
                          <div className="ab-logo-card" style={{height:130}}>
                            <img src={item.logo} alt={item.name} className="w-full h-full object-contain p-4" loading="lazy"
                              onError={e=>{const t=e.target as HTMLImageElement;t.style.display="none";t.parentElement!.innerHTML=`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><span style="font-size:.7rem;color:rgba(255,255,255,.32);text-align:center">${item.name}</span></div>`;}}
                            />
                          </div>
                          <p style={{fontSize:".68rem",color:"rgba(255,255,255,.3)",textAlign:"center",marginTop:6}} className="truncate">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from({length:totalSlides}).map((_,i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} style={{height:4,width:i===currentSlide?24:4,borderRadius:2,background:i===currentSlide?"var(--tm)":"rgba(255,255,255,.18)",border:"none",cursor:"pointer",transition:"all .3s",padding:0}}/>
                      ))}
                    </div>
                  )}
                  <p style={{textAlign:"center",fontSize:".62rem",color:"rgba(255,255,255,.18)",marginTop:10,letterSpacing:"2px",textTransform:"uppercase"}}>{t("swipeHint")||"swipe to explore"}</p>
                </div>
              </>
            )}

            <motion.div {...fu(.1)} className="mt-16">
              <div style={{height:1,background:"rgba(255,255,255,.07)",marginBottom:28}}/>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {icon:<FaCheck/>,     title:t("qualityAssured")||"Quality Assured",   desc:t("qualityAssuredDesc")||"Premium Standards"},
                  {icon:<MdSecurity/>,  title:t("secure_partner")||"Secure",            desc:t("secureDesc")||"Trusted Partnerships"},
                  {icon:<FaHandshake/>, title:t("reliable")||"Reliable",                desc:t("reliableDesc")||"Long-term Relations"},
                  {icon:<FaStar/>,      title:t("exclusive")||"Exclusive",              desc:t("exclusiveDesc")||"Limited Partnerships"},
                ].map((item,i) => (
                  <motion.div key={i} {...fu(i*.07)}>
                    <div className="ab-badge">
                      <div className="ab-badge-icon">{item.icon}</div>
                      <div style={{fontWeight:600,fontSize:".8rem",color:"rgba(255,255,255,.7)",marginBottom:4}}>{item.title}</div>
                      <div style={{fontSize:".7rem",color:"rgba(255,255,255,.32)"}}>{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════ MISSION & VISION ══════════════ */}
        <section className="relative py-24" style={{background:"linear-gradient(180deg,#07120f 0%,#050e0c 100%)"}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div {...fu(0)} className="text-center mb-16">
              <div className="ab-bar w-12 mx-auto mb-6"/>
              <span className="ab-label">{t("title_purpose")||"Purpose & Promise"}</span>
              <h2 className="ab-h2 mt-2" style={{color:"#fff"}}>{t("title_purpose")||"Our Purpose & Promise"}</h2>
              <p style={{color:"rgba(255,255,255,.35)",fontSize:".88rem",maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>{t("subtitle_purpose")||"Driving passion for aviation through exceptional craftsmanship"}</p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <Tabs aria-label="Mission and Vision" classNames={{tabList:"p-1 rounded-xl gap-2",tab:"rounded-lg data-[selected=true]:text-white text-sm font-semibold",cursor:"rounded-lg",panel:"pt-0"}}
                style={{"--heroui-tab-list-bg":"rgba(255,255,255,.06)","--heroui-cursor-bg":"var(--t)"} as any}>
                <Tab key="mission" title={<div className="flex items-center gap-2 px-2 py-1"><FaRocket style={{fontSize:13,color:"var(--tm)"}}/><span>{t("tabTitle")||"Mission"}</span></div>}>
                  <motion.div {...fu(0)} className="ab-glass relative rounded-3xl overflow-hidden mt-4">
                    <div className="ab-bar"/>
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div style={{padding:"clamp(28px,5vw,48px)"}}>
                        <h3 className="ab-h2" style={{marginBottom:14}}>{t("title_mission")||"To Inspire Aviation Passion"}</h3>
                        <div className="ab-accent"/>
                        <div className="flex flex-col gap-3">
                          {(t("points",{returnObjects:true}) as string[] || ["Deliver premium, authentic aircraft models","Foster a global community of aviation enthusiasts","Maintain uncompromising quality standards","Provide exceptional customer experiences","Promote aviation heritage and innovation"]).map((item,i) => (
                            <div key={i} className="ab-feat">
                              <div className="ab-feat-dot"><svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#7dd4c8" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                              <span style={{fontSize:".84rem",color:"rgba(255,255,255,.6)",lineHeight:1.5}}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{position:"relative",minHeight:260,overflow:"hidden"}}>
                        <Image src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/2_vwhyiw.png" alt="Mission" className="w-full h-full object-cover" style={{minHeight:260}}/>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(5,14,12,.55) 0%,transparent 50%)",pointerEvents:"none"}}/>
                      </div>
                    </div>
                  </motion.div>
                </Tab>
                <Tab key="vision" title={<div className="flex items-center gap-2 px-2 py-1"><FaGlobe style={{fontSize:13,color:"var(--tm)"}}/><span>{t("tabTitle_vision")||"Vision"}</span></div>}>
                  <motion.div {...fu(0)} className="ab-glass relative rounded-3xl overflow-hidden mt-4">
                    <div className="ab-bar"/>
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div style={{position:"relative",minHeight:260,overflow:"hidden",order:2}} className="lg:order-1">
                        <Image src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/3_jgef5j.png" alt="Vision" className="w-full h-full object-cover" style={{minHeight:260}}/>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(270deg,rgba(5,14,12,.55) 0%,transparent 50%)",pointerEvents:"none"}}/>
                      </div>
                      <div style={{padding:"clamp(28px,5vw,48px)",order:1}} className="lg:order-2">
                        <h3 className="ab-h2" style={{marginBottom:14}}>{t("title_vision")||"Global Aviation Leadership"}</h3>
                        <div className="ab-accent"/>
                        <p style={{fontSize:".86rem",color:"rgba(255,255,255,.5)",lineHeight:1.75,marginBottom:20}}>{t("description")||"To become the world's most trusted destination for premium aviation collectibles, setting new standards for quality, authenticity, and customer experience."}</p>
                        <div className="ab-quote">"{t("quote_subtitle")||"Where every model tells a story, and every collector becomes part of aviation history."}"</div>
                      </div>
                    </div>
                  </motion.div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </section>

        {/* ══════════════ CTA ══════════════ */}
        <section className="ab-cta relative py-28">
          <div className="ab-cta-dots"/>
          <div style={{position:"absolute",width:500,height:500,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"radial-gradient(circle,rgba(13,122,104,.12) 0%,transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}}/>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div {...fu(0)}>
              <div className="ab-bar w-12 mx-auto mb-8"/>
              <span className="ab-label" style={{color:"var(--tm)",textAlign:"center"}}>✦ Join The Community ✦</span>
              <h2 className="ab-h2 mt-4" style={{textAlign:"center"}}>{t("title_start")||"Ready to Start Your Aviation Collection?"}</h2>
              <p style={{color:"rgba(255,255,255,.42)",fontSize:".93rem",lineHeight:1.8,maxWidth:500,margin:"16px auto 40px"}}>{t("subtitle_start")||"Join thousands of satisfied collectors who trust Omelette's for premium aviation models."}</p>
              <Link to="/help">
                <Button size="lg" style={{background:"linear-gradient(135deg,#0d7a68,#0a6455)",color:"#fff",fontWeight:700,padding:"15px 40px",borderRadius:8,boxShadow:"0 8px 32px rgba(13,122,104,.4)",border:"none",fontSize:".92rem",display:"inline-flex",alignItems:"center",gap:10,letterSpacing:".4px"}}>
                  <TbHeadset style={{fontSize:17}}/> {t("contactButton")||"Contact Expert"}
                </Button>
              </Link>
            </motion.div>
            <motion.div {...fu(.14)} className="flex flex-wrap justify-center gap-3 mt-14 pt-10" style={{borderTop:"1px solid rgba(255,255,255,.07)"}}>
              {[
                {icon:<MdSecurity/>,      lbl:t("trustIndicators.securePayment")||"Secure Payment"},
                {icon:<TbTruckDelivery/>, lbl:t("trustIndicators.freeShipping")||"Free Shipping*"},
                {icon:<TbHeadset/>,       lbl:t("trustIndicators.support24_7")||"24/7 Support"},
                {icon:<TbCertificate/>,   lbl:t("trustIndicators.authenticity")||"Authenticity"},
              ].map((item,i) => (
                <div key={i} className="ab-trust">{item.icon}<span>{item.lbl}</span></div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════════════ LIGHTBOX ══════════════ */}
        <AnimatePresence>
          {lightbox && (
            <motion.div className="ab-lb" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.22}} onClick={() => setLightbox(null)}>
              {/* orbs */}
              <div style={{position:"absolute",width:400,height:400,top:"-10%",left:"-8%",borderRadius:"50%",background:lightbox.color==="teal"?"radial-gradient(circle,rgba(13,122,104,.45) 0%,transparent 60%)":"radial-gradient(circle,rgba(192,25,44,.4) 0%,transparent 60%)",filter:"blur(55px)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",width:300,height:300,bottom:"-10%",right:"-5%",borderRadius:"50%",background:lightbox.color==="teal"?"radial-gradient(circle,rgba(77,184,168,.25) 0%,transparent 60%)":"radial-gradient(circle,rgba(232,85,102,.22) 0%,transparent 60%)",filter:"blur(45px)",pointerEvents:"none"}}/>

              <motion.div className="ab-lb-panel" initial={{opacity:0,y:18,scale:.94}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:18,scale:.94}} transition={{duration:.28,ease:"easeOut"}} onClick={e => e.stopPropagation()}>
                <div style={{height:3,background:lightbox.color==="teal"?"linear-gradient(90deg,#0d7a68,#4db8a8,#7dd4c8,#4db8a8,#0d7a68)":"linear-gradient(90deg,#7a0d1b,#c0192c,#e85566,#c0192c,#7a0d1b)",backgroundSize:"250% auto",animation:"abShim 3s linear infinite"}}/>
                <button className="ab-lb-close" onClick={() => setLightbox(null)}>×</button>
                <div style={{padding:"44px 32px 32px",display:"flex",flexDirection:"column",alignItems:"center",gap:18}}>
                  <img src={lightbox.src} alt="Logo" className="ab-lb-img"/>
                  <span style={{fontSize:".7rem",fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",padding:"5px 16px",borderRadius:20,background:lightbox.color==="teal"?"rgba(13,122,104,.2)":"rgba(192,25,44,.18)",border:lightbox.color==="teal"?"1px solid rgba(77,184,168,.3)":"1px solid rgba(232,85,102,.3)",color:lightbox.color==="teal"?"#4db8a8":"#e85566"}}>
                    {lightbox.year}
                  </span>
                  <p style={{fontSize:".75rem",color:"rgba(255,255,255,.32)",textAlign:"center",lineHeight:1.6,maxWidth:240}}>
                    {lightbox.color==="teal"?"Our original mark — where the story began.":"Our upcoming 2026 rebrand — bolder and refined."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DefaultLayout>
  );
}