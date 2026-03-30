import { useState, useEffect, useRef, useCallback } from "react";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import AirplaneLoading from "@/components/loading";
import { useTranslation } from "react-i18next";
import {
  AiOutlineRight,
  AiOutlineClose,
  AiOutlineLeft,
  AiOutlineRight as RightArrow,
} from "react-icons/ai";
import { Helmet } from "react-helmet-async";

interface Product {
  ID: string;
  Name: string;
  Images?: { image_meain?: string | null };
}

const AIRLINES = [
  {
    id: "thai",
    name: "Thai Airways",
    country: "Thailand",
    desc: "Thailand's flag carrier, known for its graceful service and iconic purple-gold livery across Asia and beyond.",
    logo: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979001/omelett%27s/public/c919/thai_yomquy.png",
    plane: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/115_mwwmjj.png",
    scale: "1:200", length: "34 cm", edition: "Limited",
    accent: "rgba(120,60,180,.18)",
  },
  {
    id: "emirates",
    name: "Emirates",
    country: "UAE",
    desc: "Dubai's world-renowned airline — synonymous with luxury, the A380, and connecting 150+ destinations globally.",
    logo: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978995/omelett%27s/public/c919/emirates_vpql4a.png",
    plane: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/103_qxckbi.png",
    scale: "1:200", length: "36 cm", edition: "Premium",
    accent: "rgba(180,30,40,.18)",
  },
  {
    id: "qatar",
    name: "Qatar Airways",
    country: "Qatar",
    desc: "Award-winning airline of Qatar, celebrated for its five-star onboard experience and deep maroon livery.",
    logo: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978999/omelett%27s/public/c919/Qatar-Airways-Logo_p6p1ud.png",
    plane: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/105_xitts5.png",
    scale: "1:200", length: "33 cm", edition: "Collector",
    accent: "rgba(100,10,30,.22)",
  },
  {
    id: "lao",
    name: "Lao Airlines",
    country: "Laos",
    desc: "Lao PDR's national carrier, connecting Southeast Asia with warm Lao hospitality at 30,000 feet.",
    logo: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978996/omelett%27s/public/c919/logo-laoairlines_rmrpmm.png",
    plane: "https://res.cloudinary.com/deahgtn57/image/upload/v1749979263/omelett%27s/public/c919/109_sqz5zm.png",
    scale: "1:200", length: "30 cm", edition: "Special",
    accent: "rgba(13,122,104,.2)",
  },
  {
    id: "comac",
    name: "Comac C919",
    country: "China",
    desc: "China's first domestically produced narrow-body jet — a landmark milestone in commercial aviation history.",
    logo: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978995/omelett%27s/public/c919/Comac-Logo-768x432_jsuohq.png",
    plane: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/104_kukfrn.png",
    scale: "1:200", length: "32 cm", edition: "Historic",
    accent: "rgba(200,30,30,.15)",
  },
];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Syne:wght@400;600;700;800&display=swap');
  :root {
    --teal:       #0d7a68;
    --teal2:      #0a6455;
    --teal3:      #083d33;
    --teal-light: #e6f4f1;
    --teal-mid:   #4db8a8;
    --teal-pale:  #7dd4c8;
    --teal-glow:  rgba(13,122,104,.28);
  }
  *, *::before, *::after {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    box-sizing: border-box;
  }
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmerTeal {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes kenBurns {
    0%   { transform: scale(1)    translate(0,0); }
    50%  { transform: scale(1.05) translate(-1%,-.5%); }
    100% { transform: scale(1)    translate(0,0); }
  }
  @keyframes glowPulse {
    0%,100% { opacity: .2; }
    50%     { opacity: .38; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 var(--teal-glow); }
    70%  { box-shadow: 0 0 0 14px rgba(13,122,104,0); }
    100% { box-shadow: 0 0 0 0 rgba(13,122,104,0); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes heroFlyIn {
    0%   { opacity: 0; transform: translateX(60px) translateY(20px) scale(.95) rotate(2deg); }
    60%  { opacity: 1; transform: translateX(-4px) translateY(-3px) scale(1.01) rotate(-.3deg); }
    100% { opacity: 1; transform: translateX(0) translateY(0) scale(1) rotate(0deg); }
  }
  @keyframes badgeIconPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.16); }
    100% { transform: scale(1); }
  }
  @keyframes countUp {
    from { transform: translateY(8px); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }
  @keyframes alModalIn {
    from { opacity: 0; transform: scale(.93) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes alBackdrop {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes alPlaneIn {
    from { opacity: 0; transform: translateX(50px) scale(.94) rotate(2deg); }
    to   { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
  }
  @keyframes alLogoIn {
    from { opacity: 0; transform: translateY(-10px) scale(.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes alShimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  .hero-img-wrap  { animation: heroFlyIn 1.1s cubic-bezier(.22,1,.36,1) both; }
  .hero-img-inner { animation: kenBurns 14s ease-in-out infinite; }
  .hero-glow-pulse { animation: glowPulse 4s ease-in-out infinite; }
  .badge-icon:hover { animation: badgeIconPop .35s ease; }
  /* ── Reveal on scroll ── */
  .reveal {
    opacity: 0; transform: translateY(28px);
    transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left {
    opacity: 0; transform: translateX(-36px);
    transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1);
  }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0; transform: translateX(36px);
    transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1);
  }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
  .reveal-delay-1 { transition-delay: .1s !important; }
  .reveal-delay-2 { transition-delay: .2s !important; }
  .reveal-delay-3 { transition-delay: .32s !important; }
  .reveal-delay-4 { transition-delay: .44s !important; }
  .reveal-delay-5 { transition-delay: .56s !important; }
  /* ── Hero entrance ── */
  .fade-up   { animation: fadeUp .7s ease both; }
  .fade-up-1 { animation: fadeUp .7s .10s ease both; }
  .fade-up-2 { animation: fadeUp .7s .22s ease both; }
  .fade-up-3 { animation: fadeUp .7s .38s ease both; }
  .fade-up-4 { animation: fadeUp .7s .54s ease both; }
  .fade-up-5 { animation: fadeUp .7s .70s ease both; }
  .teal-shimmer {
    background: linear-gradient(135deg, #ffffff 0%, var(--teal-pale) 45%, #ffffff 100%);
    background-size: 220% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerTeal 5s linear infinite;
  }
  .section-label {
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--teal);
    display: inline-block;
    background: rgba(13,122,104,0.1);
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 16px;
  }
  .dark .section-label { color: var(--teal-mid); background: rgba(77,184,168,0.1); }
  .teal-bar {
    height: 3px; width: 52px;
    background: linear-gradient(90deg, var(--teal), var(--teal-mid));
    border-radius: 2px; margin-bottom: 18px;
  }
  .card-lift {
    transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
    will-change: transform;
  }
  .card-lift:hover {
    transform: translateY(-7px);
    box-shadow: 0 24px 56px rgba(0,0,0,.14) !important;
  }
  .icon-pulse { animation: pulseRing 2.6s infinite; }
  .slide-track {
    display: flex; gap: 20px; overflow-x: auto;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
    scrollbar-width: none; padding-bottom: 8px;
    padding-left: 1px; padding-right: 16px;
  }
  .slide-track::-webkit-scrollbar { display: none; }
  .slide-track > * { scroll-snap-align: start; flex-shrink: 0; }
  .display-card .display-overlay { opacity: 0; transition: opacity .3s ease; }
  .display-card:hover .display-overlay { opacity: 1; }
  .thin-scroll::-webkit-scrollbar { width: 4px; }
  .thin-scroll::-webkit-scrollbar-track { background: transparent; }
  .thin-scroll::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 4px; }
  .stat-val {
    font-size: clamp(2.2rem, 4.5vw, 3.2rem);
    font-weight: 700; line-height: 1; color: #fff;
    animation: countUp .5s ease both;
  }
  .arrow-btn {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .25s ease;
    border: 2px solid var(--teal); background: transparent; color: var(--teal);
  }
  .arrow-btn:hover { background: var(--teal); color: #fff; }
  .arrow-btn.filled { background: var(--teal); color: #fff; }
  .arrow-btn.filled:hover { opacity: .85; }
  .carousel-slide { position: absolute; inset: 0; transition: opacity .9s cubic-bezier(.4,0,.2,1); }
  section { isolation: isolate; }

  /* ─────────────────────────────────────────────────────
     AIRLINE SECTION — FOLLOWS LIGHT/DARK MODE
  ───────────────────────────────────────────────────── */
  .al-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 40px;
  }
  @media (max-width: 900px) { .al-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 560px) { .al-grid { grid-template-columns: repeat(2, 1fr) !important; } }

  .al-card {
    position: relative;
    border-radius: 16px;
    border: 1px solid rgba(13,122,104,.15);
    background: #fff;
    padding: 24px 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }
  .dark .al-card {
    background: rgba(255,255,255,.04);
    border-color: rgba(13,122,104,.2);
  }
  .al-card:hover {
    border-color: #0d7a68;
    transform: translateY(-5px);
    box-shadow: 0 12px 36px rgba(13,122,104,.12);
  }
  .dark .al-card:hover {
    border-color: var(--teal-mid);
    box-shadow: 0 12px 36px rgba(0,0,0,.3);
    background: rgba(13,122,104,.06);
  }
  .al-card-logo {
    width: 100%;
    height: 48px;
    object-fit: contain;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
  }
  .al-card:hover .al-card-logo {
    transform: scale(1.06);
  }
  .al-card-name {
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    transition: color 0.25s;
    text-align: center;
    position: relative;
    z-index: 1;
    line-height: 1.4;
  }
  .dark .al-card-name { color: rgba(255,255,255,.8); }
  .al-card:hover .al-card-name { color: #0d7a68; }
  .dark .al-card:hover .al-card-name { color: #fff; }

  .al-card-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: rgba(13,122,104,.4);
    transition: all 0.25s;
    position: relative;
    z-index: 1;
  }
  .dark .al-card-hint { color: rgba(77,184,168,.35); }
  .al-card-hint-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0d7a68;
    flex-shrink: 0;
    opacity: .5;
    transition: opacity .25s;
  }
  .al-card:hover .al-card-hint {
    color: #0d7a68;
    gap: 8px;
  }
  .dark .al-card:hover .al-card-hint { color: var(--teal-mid); }
  .al-card:hover .al-card-hint-dot { opacity: 1; }

  /* ─────────────────────────────────────────────────────
     AIRLINE MODAL — FOLLOWS LIGHT/DARK MODE
  ───────────────────────────────────────────────────── */
  .al-modal-backdrop {
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,.5);
    backdrop-filter: blur(12px);
    animation: alBackdrop .22s ease both;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .dark .al-modal-backdrop {
    background: rgba(0,0,0,.7);
  }
  .al-modal {
    position: relative;
    width: 100%; max-width: 920px;
    background: #fff;
    border: 1px solid rgba(13,122,104,.15);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,.15);
    animation: alModalIn .38s cubic-bezier(.22,1,.36,1) both;
  }
  .dark .al-modal {
    background: #1f2937;
    border-color: rgba(13,122,104,.25);
    box-shadow: 0 30px 80px rgba(0,0,0,.5);
  }
  .al-modal-topbar {
    height: 3px;
    background: linear-gradient(90deg,
      transparent, #0d7a68 20%, #4db8a8 50%, #0d7a68 80%, transparent
    );
    background-size: 300% auto;
    animation: alShimmer 3.5s linear infinite;
  }
  .al-modal-header {
    padding: 28px 32px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .al-modal-eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #0d7a68;
    margin-bottom: 6px;
  }
  .dark .al-modal-eyebrow { color: var(--teal-mid); }
  .al-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  .dark .al-modal-title { color: #fff; }
  .al-modal-title-accent {
    color: #0d7a68;
  }
  .dark .al-modal-title-accent {
    background: linear-gradient(120deg, #0d7a68, #4db8a8, #7dd4c8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .al-modal-close {
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(228,54,54,.08);
    border: 1px solid rgba(228,54,54,.2);
    color: #999;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 18px; line-height: 1;
    transition: all 0.25s ease; flex-shrink: 0;
  }
  .dark .al-modal-close { background: rgba(228,54,54,.15); border-color: rgba(228,54,54,.3); color: rgba(255,255,255,.6); }
  .al-modal-close:hover {
    background: #E43636; border-color: #E43636; color: #fff;
    transform: scale(1.08) rotate(90deg);
  }
  /* Tabs */
  .al-tabs {
    display: flex; gap: 8px;
    padding: 20px 32px 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .al-tabs::-webkit-scrollbar { display: none; }
  .al-tab {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 14px; border-radius: 10px;
    border: 1px solid rgba(0,0,0,.08);
    background: transparent;
    cursor: pointer; transition: all 0.25s ease;
    white-space: nowrap; flex-shrink: 0;
  }
  .dark .al-tab { border-color: rgba(255,255,255,.1); }
  .al-tab:hover {
    border-color: rgba(13,122,104,.3);
    background: rgba(13,122,104,.04);
  }
  .dark .al-tab:hover { background: rgba(13,122,104,.1); border-color: rgba(13,122,104,.3); }
  .al-tab.active {
    border-color: #0d7a68;
    background: rgba(13,122,104,.08);
  }
  .dark .al-tab.active { background: rgba(13,122,104,.2); border-color: var(--teal-mid); }
  .al-tab-logo {
    height: 20px; max-width: 44px; object-fit: contain;
    transition: all 0.2s;
  }
  .al-tab-name {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem; font-weight: 600;
    color: #6b7280;
    transition: color 0.2s;
  }
  .dark .al-tab-name { color: rgba(255,255,255,.5); }
  .al-tab:hover .al-tab-name,
  .al-tab.active .al-tab-name { color: #0d7a68; }
  .dark .al-tab:hover .al-tab-name,
  .dark .al-tab.active .al-tab-name { color: #fff; }
  /* Body */
  .al-modal-body {
    display: grid; grid-template-columns: 1fr 1.2fr;
    gap: 28px; padding: 24px 32px 28px;
    align-items: center; min-height: 270px;
  }
  .al-airline-logo-big {
    height: 48px; max-width: 180px; object-fit: contain;
    margin-bottom: 14px;
    animation: alLogoIn .35s cubic-bezier(.22,1,.36,1) both;
  }
  .al-airline-name-big {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem; font-weight: 800;
    color: #111827; margin-bottom: 4px;
    letter-spacing: -0.3px;
  }
  .dark .al-airline-name-big { color: #fff; }
  .al-airline-country {
    font-size: 0.65rem; letter-spacing: 2px;
    text-transform: uppercase; color: #0d7a68;
    margin-bottom: 14px; font-weight: 600; opacity: .7;
  }
  .dark .al-airline-country { color: var(--teal-mid); }
  .al-airline-desc {
    font-size: 0.88rem; line-height: 1.6;
    color: #6b7280; margin-bottom: 22px;
    max-width: 280px;
  }
  .dark .al-airline-desc { color: rgba(255,255,255,.55); }
  .al-specs-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.6rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: #0d7a68; opacity: .6;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 14px;
  }
  .dark .al-specs-label { color: var(--teal-mid); }
  .al-specs-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(13,122,104,.2), transparent);
  }
  .dark .al-specs-label::after { background: linear-gradient(90deg, rgba(13,122,104,.4), transparent); }
  .al-specs { display: flex; gap: 24px; }
  .al-spec-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 800;
    color: #0d7a68; line-height: 1.2; margin-bottom: 3px;
  }
  .dark .al-spec-val { color: var(--teal-mid); }
  .al-spec-label {
    font-size: 0.6rem; letter-spacing: 1px;
    text-transform: uppercase; color: #9ca3af; font-weight: 500;
  }
  .dark .al-spec-label { color: rgba(255,255,255,.35); }
  /* Plane panel */
  .al-plane-panel {
    position: relative; border-radius: 16px; overflow: hidden;
    background: #f3faf8;
    border: 1px solid rgba(13,122,104,.1);
    display: flex; align-items: center; justify-content: center;
    min-height: 220px; padding: 20px;
  }
  .dark .al-plane-panel {
    background: rgba(13,122,104,.06);
    border-color: rgba(13,122,104,.15);
  }
  .al-plane-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 75% 55% at 50% 65%, rgba(13,122,104,.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .dark .al-plane-glow {
    background: radial-gradient(ellipse 75% 55% at 50% 65%, rgba(13,122,104,.15) 0%, transparent 70%);
  }
  .al-plane-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(13,122,104,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,122,104,.04) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: .5;
  }
  .al-plane-img {
    width: 100%; max-height: 200px; object-fit: contain;
    position: relative; z-index: 1;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,.12));
    animation: alPlaneIn .6s cubic-bezier(.22,1,.36,1) both;
  }
  .dark .al-plane-img { filter: drop-shadow(0 8px 20px rgba(0,0,0,.4)); }
  /* Dots */
  .al-dots {
    display: flex; justify-content: center; gap: 7px;
    padding: 16px 0 22px;
    border-top: 1px solid rgba(0,0,0,.06);
    margin: 0 32px;
  }
  .dark .al-dots { border-top-color: rgba(255,255,255,.06); }
  .al-dot {
    height: 6px; border-radius: 3px;
    background: #d1d5db;
    cursor: pointer; border: none; padding: 0;
    transition: all 0.25s cubic-bezier(.22,1,.36,1);
    width: 6px;
  }
  .dark .al-dot { background: rgba(255,255,255,.15); }
  .al-dot.active { background: #0d7a68; width: 26px; }
  .dark .al-dot.active { background: var(--teal-mid); }
  .al-dot:hover:not(.active) { background: #9ca3af; transform: scale(1.2); }
  .dark .al-dot:hover:not(.active) { background: rgba(255,255,255,.3); }
  /* Mobile */
  @media (max-width: 640px) {
    .al-modal-body { grid-template-columns: 1fr; padding: 20px 20px 24px; gap: 20px; }
    .al-modal-header { padding: 20px 20px 0; }
    .al-tabs { padding: 16px 20px 0; }
    .al-plane-panel { min-height: 180px; }
    .al-airline-desc { max-width: 100%; }
    .al-modal-title { font-size: 1.4rem; }
    .al-dots { margin: 0 20px; }
  }
  /* ── Display card hover ── */
  .display-card .display-overlay { opacity: 0; transition: opacity .3s ease; }
  .display-card:hover .display-overlay { opacity: 1; }
  /* ── Mobile ── */
  @media (max-width: 640px) {
    .hero-h1 { font-size: clamp(3rem, 14vw, 4.8rem) !important; }
    .section-label { font-size: 0.65rem; letter-spacing: 4px; }
  }
`;

const TealCorners = () => (
  <>
    {(["tl","tr","bl","br"] as const).map(p => (
      <div key={p} className="absolute pointer-events-none" style={{
        width: 20, height: 20,
        top:    p[0]==="t" ? 10 : "auto",
        bottom: p[0]==="b" ? 10 : "auto",
        left:   p[1]==="l" ? 10 : "auto",
        right:  p[1]==="r" ? 10 : "auto",
        borderColor: "rgba(13,122,104,.5)",
        borderStyle: "solid",
        borderWidth: p==="tl" ? "2px 0 0 2px" : p==="tr" ? "2px 2px 0 0" : p==="bl" ? "0 0 2px 2px" : "0 2px 2px 0",
        zIndex: 10,
      }} />
    ))}
  </>
);

const SectionHeader = ({
  label, title, subtitle, className = "",
}: { label: string; title: string; subtitle?: string; className?: string }) => (
  <div className={className}>
    <span className="section-label">{label}</span>
    <h2 className="font-bold text-gray-900 dark:text-white leading-tight" style={{ fontSize: "clamp(1.8rem,4.5vw,2.8rem)", letterSpacing: "-0.02em" }}>
      {title}
    </h2>
    <div className="teal-bar mt-3" />
    {subtitle && (
      <p className="text-gray-500 dark:text-gray-400 mt-2" style={{ fontSize: "1rem", maxWidth: 520, lineHeight: 1.5 }}>
        {subtitle}
      </p>
    )}
  </div>
);

const SlideArrows = ({
  extra, onScroll,
}: {
  trackRef: React.RefObject<HTMLDivElement>;
  extra?: React.ReactNode;
  onScroll: (dir: "left" | "right") => void;
}) => (
  <div className="flex items-center gap-3 flex-shrink-0">
    <button className="arrow-btn" onClick={() => onScroll("left")}><AiOutlineLeft size={17} /></button>
    <button className="arrow-btn filled" onClick={() => onScroll("right")}><RightArrow size={17} /></button>
    {extra}
  </div>
);

export default function IndexPage() {
  const { t } = useTranslation();
  const [products,       setProducts]       = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [hoveredCard,    setHoveredCard]    = useState<number | null>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [collectors,     setCollectors]     = useState(0);
  const [models,         setModels]         = useState(0);
  const [satisfaction,   setSatisfaction]   = useState(0);
  const [selectedImage,  setSelectedImage]  = useState<number | null>(null);
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [currentSlide,   setCurrentSlide]   = useState(0);
  const [airlineModal,   setAirlineModal]   = useState(false);
  const [activeAirline,  setActiveAirline]  = useState(0);

  const productsTrackRef = useRef<HTMLDivElement>(null!);
  const displayTrackRef  = useRef<HTMLDivElement>(null!);
  const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

  const carouselImages = [
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749979209/omelett%27s/public/image/3_b5k3zn.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.38.46_1_uxdsmf.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280092/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-17_at_17.19.02_763328b6_yyn5j8.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.38.46_rbzsvv.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-12_at_20.39.20_3f364bf1_dzua9j.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-05_at_21.12.55_5f9b48ea_spsc5v.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-11_at_18.58.37_97b3931d_xqts18.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280084/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-03_at_18.30.55_5de8865d_lc72uv.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280085/omelett%27s/public/index%20page/WhatsApp_Image_2025-06-05_at_21.19.11_f6523a25_t054ud.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-12_at_20.39.23_9277beb2_i2bq2d.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280598/omelett%27s/public/index%20page/WhatsApp_Image_2025-03-27_at_10.58.37_85769d8a_nlalyy.jpg",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-17_at_17.18.59_526cb521_b7v8t5.jpg",
  ];

  const displaySettings = [
    { title: "Executive Office Desk", description: "Perfect for CEO offices and corporate executives", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768752540/omelett%27s/public/index%20page/Gemini_Generated_Image_7iobqh7iobqh7iob_icvb7s.png", features: ["Creates professional impression","Excellent conversation starter","Enhances executive decor"] },
    { title: "Hotel Lobby Display", description: "Creates an impressive first impression for luxury hotels", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768752541/omelett%27s/public/index%20page/Gemini_Generated_Image_siz6n9siz6n9siz6_1_otwyyi.png", features: ["Impressive entrance display","Luxury ambiance enhancer","Guest conversation piece"] },
    { title: "Restaurant & Café Tables", description: "Enhances dining experience with aviation elegance", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_9yzxph9yzxph9yzx_qddg29.png", features: ["Unique table centerpiece","Enhances dining atmosphere","Memorable customer experience"] },
    { title: "Home Library & Study", description: "Adds sophistication to personal collections", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_5x190o5x190o5x19_jsfors.png", features: ["Personal collection showcase","Intellectual ambiance","Conversation starter"] },
    { title: "Conference Room Centerpiece", description: "Elevates business meetings and presentations", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768899031/omelett%27s/public/index%20page/Gemini_Generated_Image_nq65ulnq65ulnq65_wggw70.png", features: ["Professional meeting ambiance","Inspires innovation","Project success symbol"] },
    { title: "Luxury Gift", description: "The perfect premium gift for aviation enthusiasts", image: "https://res.cloudinary.com/deahgtn57/image/upload/v1768899543/omelett%27s/public/index%20page/Gemini_Generated_Image_s2daccs2daccs2da_vgtpw1.png", features: ["Premium gift packaging","Elegant presentation","Memorable for any occasion"] },
  ];

  const qualityFeatures = [
    { title: "Precision Engineering",  desc: "0.01mm tolerance in manufacturing" },
    { title: "Premium Materials",      desc: "Aerospace-grade metals and finishes" },
    { title: "Artisan Detailing",      desc: "Hand-finished by master craftsmen" },
    { title: "Certified Authenticity", desc: "Documented provenance for each piece" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}?nocache=${Date.now()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 6).map((p: any) => ({
            ID: p.ID, Name: p.Name, Images: p.Images || {},
          })));
        }
      } catch { setProducts([]); }
      finally { setLoading(false); }
    })();
  }, [API_URL]);

  useEffect(() => {
    const id = setTimeout(() => setStatsTriggered(true), 700);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!statsTriggered) return;
    [
      { s: setCollectors,   end: 1000, inc: 25,  ms: 18 },
      { s: setModels,       end: 50,   inc: 1,   ms: 30 },
      { s: setSatisfaction, end: 98,   inc: 2,   ms: 22 },
    ].forEach(({ s, end, inc, ms }) => {
      let v = 0;
      const id = setInterval(() => {
        v += inc;
        if (v >= end) { s(end); clearInterval(id); } else s(v);
      }, ms);
    });
  }, [statsTriggered]);

  const openModal = (i: number) => { setSelectedImage(i); setIsModalOpen(true); document.body.style.overflow = "hidden"; };
  const closeModal = useCallback(() => { setIsModalOpen(false); setSelectedImage(null); document.body.style.overflow = "unset"; }, []);
  const nextImg = useCallback(() => setSelectedImage(p => p !== null ? (p + 1) % displaySettings.length : 0), []);
  const prevImg = useCallback(() => setSelectedImage(p => p !== null ? (p - 1 + displaySettings.length) % displaySettings.length : 0), []);
  const openAirlineModal = useCallback((idx: number) => { setActiveAirline(idx); setAirlineModal(true); document.body.style.overflow = "hidden"; }, []);
  const closeAirlineModal = useCallback(() => { setAirlineModal(false); document.body.style.overflow = ""; }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "Escape")     closeModal();
        if (e.key === "ArrowRight") nextImg();
        if (e.key === "ArrowLeft")  prevImg();
      }
      if (airlineModal) {
        if (e.key === "Escape")     closeAirlineModal();
        if (e.key === "ArrowRight") setActiveAirline(p => (p + 1) % AIRLINES.length);
        if (e.key === "ArrowLeft")  setActiveAirline(p => (p - 1 + AIRLINES.length) % AIRLINES.length);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isModalOpen, airlineModal, closeModal, nextImg, prevImg, closeAirlineModal]);

  useEffect(() => {
    const id = setInterval(() => setCurrentSlide(p => (p + 1) % carouselImages.length), 3500);
    return () => clearInterval(id);
  }, []);

  const scrollSlide = (ref: React.RefObject<HTMLDivElement>, dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -(ref.current.clientWidth * 0.75) : (ref.current.clientWidth * 0.75), behavior: "smooth" });
  };

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Helmet>
        <title>{t("home.title")}</title>
        <meta name="description" content={t("home.description")} />
      </Helmet>

      {/* ══════════════════════════════════════════
          § 1  HERO (unchanged)
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050e0c] dark:bg-[#030a08]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 78% 56% at 64% 36%,rgba(13,122,104,.52) 0%,transparent 68%),radial-gradient(ellipse 55% 72% at 10% 80%,rgba(8,61,51,.6) 0%,transparent 60%),linear-gradient(160deg,#050e0c 0%,#0c1d1a 50%,#050e0c 100%)" }} />
          <div className="absolute inset-0 opacity-[.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="absolute rounded-full blur-3xl" style={{ width: 380, height: 380, top: "4%", right: "6%", background: "radial-gradient(circle,rgba(13,122,104,.2) 0%,transparent 70%)" }} />
          <div className="absolute rounded-full blur-3xl" style={{ width: 300, height: 300, bottom: "14%", left: "4%", background: "radial-gradient(circle,rgba(13,122,104,.15) 0%,transparent 70%)" }} />
          <div className="absolute hidden lg:block" style={{ width: 520, height: 520, top: "50%", right: "-60px", transform: "translateY(-50%)", border: "1px solid rgba(13,122,104,.1)", borderRadius: "50%", animation: "rotateSlow 45s linear infinite" }}>
            <div style={{ position: "absolute", width: 370, height: 370, top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "1px dashed rgba(13,122,104,.06)", borderRadius: "50%" }} />
          </div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-white">
              <div className="fade-up inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: "rgba(13,122,104,.18)", border: "1px solid rgba(13,122,104,.38)", color: "#7dd4c8", fontSize: ".72rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
                ✦ {t("premiumCollection")} ✦
              </div>
              <h1 className="hero-h1 fade-up-1 font-bold leading-none mb-2" style={{ fontSize: "clamp(3.6rem,8vw,7rem)", letterSpacing: "-1px" }}>
                <span className="teal-shimmer">Omelette</span>
                <span style={{ color: "#E43636" }}>'</span>
                <span className="teal-shimmer">s</span>
              </h1>
              <div className="teal-bar fade-up-1" />
              <p className="fade-up-2 leading-relaxed mb-10 text-white/60" style={{ fontSize: "1.03rem", maxWidth: 480 }}>
                {t("intro")}
              </p>
              <div className="fade-up-3">
                <Link href="/Omelette's" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#0d7a68,#0a6455)", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 600, fontSize: ".95rem", letterSpacing: ".4px", boxShadow: "0 8px 28px rgba(13,122,104,.45)", transition: "box-shadow .3s, transform .3s", textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 42px rgba(13,122,104,.65)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(13,122,104,.45)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  {t("viewModels")} <AiOutlineRight size={18} />
                </Link>
              </div>
              <div className="fade-up-4 flex gap-8 mt-14 flex-wrap">
                {[
                  { val: `${collectors}+`,   label: t("collectors") },
                  { val: `${models}+`,       label: t("models") },
                  { val: `${satisfaction}%`, label: t("satisfaction") },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="stat-val">{s.val}</div>
                    <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,.38)", marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center w-full">
              <div className="hero-img-wrap relative w-full max-w-lg">
                <div className="hero-glow-pulse absolute -inset-5 rounded-3xl blur-2xl pointer-events-none" style={{ background: "linear-gradient(135deg,#0d7a68,#4db8a8)" }} />
                <div className="absolute -inset-2 rounded-2xl pointer-events-none" style={{ border: "1px solid rgba(13,122,104,.18)", borderRadius: 20 }} />
                <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(13,122,104,.35)", background: "rgba(255,255,255,.03)", backdropFilter: "blur(4px)", padding: 5, boxShadow: "0 24px 64px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)" }}>
                  <div className="hero-img-inner rounded-xl overflow-hidden" style={{ willChange: "transform" }}>
                    <Image isBlurred className="w-full h-full object-cover rounded-xl block" style={{ display: "block", width: "100%", height: "auto" }}
                      src="https://res.cloudinary.com/deahgtn57/image/upload/v1768754623/omelett%27s/public/index%20page/A380-Emirates_ptqbpz.png"
                      alt="Premium Aircraft Model — A380 Emirates"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-xl" style={{ background: "linear-gradient(to top, rgba(5,14,12,.55), transparent)" }} />
                  <TealCorners />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom,transparent,#050e0c)" }} />
      </section>

      {/* ══════════════════════════════════════════
          § 2  CURATED EXCELLENCE (unchanged)
      ══════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-900 transition-colors duration-500" style={{ paddingTop: "clamp(72px, 10vw, 96px)", paddingBottom: "clamp(72px, 10vw, 96px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 reveal">
            <SectionHeader label={t("featuredCollection")} title={t("curatedExcellence")} subtitle={t("discoverPremiumSelection")} />
            <SlideArrows trackRef={productsTrackRef} onScroll={(dir) => scrollSlide(productsTrackRef, dir)} extra={
              <Link href="/Omelette's" className="hidden sm:inline-flex items-center gap-1" style={{ color: "#0d7a68", fontWeight: 600, fontSize: ".85rem", textDecoration: "none", letterSpacing: ".3px" }}>
                {t("viewFullCollection")} <AiOutlineRight size={14} />
              </Link>
            } />
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <AirplaneLoading isLoading={true} fullScreen={false} message="Loading models..." />
            </div>
          ) : (
            <div ref={productsTrackRef} className="slide-track reveal reveal-delay-1">
              {products.map((product, index) => (
                <div key={product.ID} className="card-lift rounded-2xl overflow-hidden group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  style={{ width: "clamp(240px, 75vw, 310px)", boxShadow: "0 4px 18px rgba(0,0,0,.07)" }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                    <Image isBlurred className="w-full h-full object-cover"
                      style={{ transform: hoveredCard === index ? "scale(1.07)" : "scale(1)", transition: "transform .55s cubic-bezier(.22,1,.36,1)" }}
                      src={product.Images?.image_meain || "/placeholder.jpg"} alt={product.Name}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-5" style={{ background: hoveredCard === index ? "linear-gradient(to top,rgba(5,14,12,.72) 0%,transparent 55%)" : "transparent", transition: "background .35s ease" }}>
                      {hoveredCard === index && (
                        <Link href={`/product/${product.ID}`} style={{ background: "#0d7a68", color: "#fff", padding: "8px 20px", borderRadius: 6, fontWeight: 600, fontSize: ".8rem", letterSpacing: ".4px", textDecoration: "none", animation: "fadeUp .22s ease" }}>
                          {t("viewDetails")} →
                        </Link>
                      )}
                    </div>
                    <div className="absolute top-3 left-3" style={{ background: "#0d7a68", color: "#fff", fontSize: ".6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "3px 9px", borderRadius: 4 }}>
                      {t("aircraftModel")}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" style={{ fontSize: "1rem" }}>{product.Name}</h3>
                    <p className="text-gray-400 dark:text-gray-500 mb-3" style={{ fontSize: ".78rem" }}>{t("premiumScaleModel")}</p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: ".7rem", color: "#f59e0b", letterSpacing: "1px" }}>★★★★★</span>
                      <span style={{ fontSize: ".78rem", color: "#0d7a68", fontWeight: 700 }}>287,000K</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/Omelette's" className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
                style={{ width: "clamp(190px,20vw,230px)", background: "linear-gradient(135deg,#0d7a68,#0a6455)", minHeight: 320, textDecoration: "none", color: "#fff", gap: 12, padding: 28, transition: "transform .35s cubic-bezier(.22,1,.36,1)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateY(0)"}
              >
                <div style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AiOutlineRight size={20} />
                </div>
                <span style={{ fontWeight: 600, fontSize: ".88rem", textAlign: "center", lineHeight: 1.35 }}>{t("viewFullCollection")}</span>
              </Link>
            </div>
          )}
          <div className="sm:hidden text-center mt-8 reveal">
            <Link href="/Omelette's" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0d7a68", color: "#fff", padding: "12px 28px", borderRadius: 8, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>
              {t("viewFullCollection")} <AiOutlineRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 2.5  AIRLINE COLLECTION — ✅ FIXED: FOLLOWS LIGHT/DARK MODE
      ══════════════════════════════════════════ */}
      <section className="bg-gray-50 dark:bg-gray-800 transition-colors duration-500" style={{ paddingTop: "clamp(72px, 10vw, 96px)", paddingBottom: "clamp(72px, 10vw, 96px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="reveal text-center">
            <SectionHeader
              label="Aviation Fleet"
              title="Our Model Airlines"
              subtitle="Explore our precision-crafted scale models for each featured airline"
            />
          </div>
          <div className="al-grid reveal reveal-delay-1">
            {AIRLINES.map((airline, i) => (
              <div key={airline.id} className="al-card" onClick={() => openAirlineModal(i)}>
                <img src={airline.logo} alt={airline.name} className="al-card-logo" />
                <div className="al-card-name">{airline.name}</div>
                <div className="al-card-hint">
                  <span className="al-card-hint-dot" />
                  View model
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 3  PERFECT DISPLAY (unchanged)
      ══════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-900 transition-colors duration-500" style={{ paddingTop: "clamp(72px, 10vw, 96px)", paddingBottom: "clamp(72px, 10vw, 96px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 reveal">
            <SectionHeader label={t("perfectDisplay")} title={t("whereToDisplay")} subtitle={t("premiumAircraftModels")} />
            <SlideArrows trackRef={displayTrackRef} onScroll={(dir) => scrollSlide(displayTrackRef, dir)} />
          </div>
          <div ref={displayTrackRef} className="slide-track reveal reveal-delay-1">
            {displaySettings.map((s, i) => (
              <div key={i} className="display-card card-lift rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
                style={{ width: "clamp(220px, 72vw, 295px)", boxShadow: "0 4px 16px rgba(0,0,0,.07)" }}
                onClick={() => openModal(i)}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <Image isBlurred className="w-full h-full object-cover" style={{ transition: "transform .5s cubic-bezier(.22,1,.36,1)" }} src={s.image} alt={s.title} />
                  <div className="display-overlay absolute inset-0 flex items-center justify-center" style={{ background: "rgba(5,14,12,.5)", backdropFilter: "blur(2px)" }}>
                    <span style={{ background: "rgba(255,255,255,.92)", color: "#0d7a68", fontWeight: 700, fontSize: ".7rem", letterSpacing: "1.5px", textTransform: "uppercase", padding: "6px 14px", borderRadius: 6 }}>
                      {t("clickToView") || "View →"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3" style={{ width: 25, height: 25, borderRadius: "50%", background: "#0d7a68", color: "#fff", fontWeight: 700, fontSize: ".66rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i + 1}
                  </div>
                </div>
                <div className="p-4 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" style={{ fontSize: ".97rem" }}>{t(s.title)}</h3>
                  <p className="text-gray-400 dark:text-gray-400 leading-snug" style={{ fontSize: ".76rem" }}>{t(s.description)}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Gift packaging strip */}
          <div className="mt-14 rounded-2xl overflow-hidden border border-[#0d7a68]/20 reveal" style={{ background: "linear-gradient(135deg,#050e0c 0%,#0c1d1a 100%)" }}>
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <span className="section-label mb-3" style={{ color: "#4db8a8" }}>{t("perfectGiftPackaging")}</span>
                <h3 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(1.6rem,3vw,2.3rem)" }}>{t("premiumGiftPresentation")}</h3>
                <p style={{ color: "rgba(255,255,255,.52)", fontSize: ".92rem", lineHeight: 1.65, marginBottom: 18 }}>{t("eachAircraftModelComes")}</p>
                {[
                  { dot: "#0d7a68", label: t("premiumGiftBox") },
                  { dot: "#4db8a8", label: t("personalizedCard") },
                  { dot: "#7dd4c8", label: t("elegantPackaging") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2">
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,.62)", fontSize: ".86rem" }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
                <Image className="w-full h-full object-cover" style={{ minHeight: 260 }}
                  src="https://res.cloudinary.com/deahgtn57/image/upload/v1769274064/omelett%27s/public/index%20page/WhatsApp_Image_2026-01-24_at_23.39.01_1_p6ptma.jpg"
                  alt={t("premiumGiftPackaging")}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg,#050e0c 0%,transparent 40%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 4  CRAFTSMANSHIP + CAROUSEL (unchanged)
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative reveal-left">
              <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(13,122,104,.18)", boxShadow: "0 18px 56px rgba(0,0,0,.11)" }}>
                <div style={{ aspectRatio: "4/3", position: "relative" }}>
                  {carouselImages.map((img, i) => (
                    <div key={i} className="carousel-slide" style={{ opacity: i === currentSlide ? 1 : 0, zIndex: i === currentSlide ? 1 : 0 }}>
                      <Image isBlurred className="w-full h-full object-cover" src={img} alt={`Photo ${i + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-1/2 flex gap-1.5 z-10" style={{ transform: "translateX(-50%)" }}>
                  {carouselImages.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} style={{ height: 5, width: i === currentSlide ? 22 : 5, borderRadius: 3, background: i === currentSlide ? "#0d7a68" : "rgba(255,255,255,.42)", border: "none", cursor: "pointer", transition: "all .4s cubic-bezier(.22,1,.36,1)", padding: 0 }} />
                  ))}
                </div>
                <TealCorners />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 px-5 py-4 rounded-xl z-10 bg-white dark:bg-gray-900" style={{ border: "1px solid rgba(13,122,104,.28)", boxShadow: "0 10px 34px rgba(0,0,0,.1)" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0d7a68", lineHeight: 1 }}>{currentSlide + 1}</span>
                <div>
                  <div className="text-gray-400 dark:text-gray-500" style={{ fontSize: ".62rem", letterSpacing: "1.5px", textTransform: "uppercase" }}>of {carouselImages.length}</div>
                  <div style={{ fontSize: ".7rem", color: "#4db8a8", fontWeight: 600 }}>Photos</div>
                </div>
              </div>
            </div>
            <div className="reveal-right">
              <SectionHeader label={t("craftsmanship")} title={t("uncompromisingQuality")} subtitle={t("eachModelIsTestament")} />
              <div className="flex flex-col gap-5 mt-2">
                {qualityFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="icon-pulse flex-shrink-0 flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: "#0d7a68" }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-0.5" style={{ fontSize: ".97rem" }}>{t(f.title)}</h4>
                      <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: ".82rem" }}>{t(f.desc)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="mt-8 inline-flex items-center gap-2" style={{ color: "#0d7a68", fontWeight: 600, fontSize: ".92rem", textDecoration: "none", transition: "gap .25s ease" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = "10px"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = "8px"}
              >
                {t("show_details")}
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  CTA (unchanged)
      ══════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ background: "linear-gradient(135deg,#050e0c 0%,#0c1d1a 55%,#083d33 100%)" }}>
        <div className="absolute inset-0 opacity-[.04] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#0d7a68 1px,transparent 0)", backgroundSize: "44px 44px" }} />
        <div className="absolute rounded-full blur-3xl pointer-events-none" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(13,122,104,.14) 0%,transparent 70%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label mb-5 text-center reveal" style={{ color: "#4db8a8" }}>✦ Join The Community ✦</span>
          <h2 className="font-bold text-white mb-4 leading-tight reveal reveal-delay-1" style={{ fontSize: "clamp(2rem,6vw,3.6rem)" }}>{t("beginYourCollection")}</h2>
          <p className="mb-10 mx-auto reveal reveal-delay-2" style={{ color: "rgba(255,255,255,.52)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 520 }}>{t("joinCollectorsWorldwide")}</p>
          <div className="reveal reveal-delay-3">
            <Link href="/help" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#0d7a68,#0a6455)", color: "#fff", padding: "15px 40px", borderRadius: 8, fontWeight: 700, fontSize: ".95rem", letterSpacing: ".4px", textDecoration: "none", boxShadow: "0 8px 32px rgba(13,122,104,.4)", transition: "box-shadow .3s, transform .3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 48px rgba(13,122,104,.6)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(13,122,104,.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {t("contact_us")} <AiOutlineRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 reveal reveal-delay-4" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
            {[
              { label: t("freeShipping"), svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4db8a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
              { label: t("authenticityGuarantee"), svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4db8a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/><path d="M9 12l2 2 4-4"/></svg> },
              { label: t("securePayment"), svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4db8a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
              { label: t("support247"), svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4db8a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
            ].map((b, i) => (
              <div key={i} className="text-center badge-icon flex flex-col items-center gap-2">
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(13,122,104,.15)", border: "1px solid rgba(13,122,104,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", transition: "background .25s, transform .3s cubic-bezier(.22,1,.36,1)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(13,122,104,.3)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(13,122,104,.15)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  {b.svg}
                </div>
                <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.5)", letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.4 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DISPLAY SETTINGS MODAL (unchanged)
      ══════════════════════════════════════════ */}
      {isModalOpen && selectedImage !== null && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(5,14,12,.92)", backdropFilter: "blur(8px)", animation: "fadeIn .25s ease both" }} onClick={closeModal} />
          <div style={{ position: "fixed", inset: 0, zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: "env(safe-area-inset-top, 12px) 12px env(safe-area-inset-bottom, 12px) 12px" }}>
            <div className="relative w-full overflow-hidden flex flex-col lg:flex-row" style={{ maxWidth: 980, maxHeight: "calc(100vh - 24px)", background: "#fff", borderRadius: 16, border: "1px solid rgba(13,122,104,.18)", boxShadow: "0 40px 100px rgba(0,0,0,.5)", animation: "fadeUp .3s cubic-bezier(.22,1,.36,1) both" }}>
              <button onClick={closeModal} style={{ position: "absolute", top: 12, right: 12, zIndex: 60, background: "#E43636", color: "#fff", border: "none", borderRadius: "50%", width: 33, height: 33, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform .2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <AiOutlineClose size={14} />
              </button>
              <div style={{ position: "absolute", top: 12, left: 12, zIndex: 60, background: "rgba(5,14,12,.72)", color: "#fff", fontSize: ".7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                {selectedImage + 1} / {displaySettings.length}
              </div>
              <button onClick={e => { e.stopPropagation(); prevImg(); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", zIndex: 60, background: "rgba(255,255,255,.92)", border: "none", borderRadius: "50%", width: 33, height: 33, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 12px rgba(0,0,0,.14)", transition: "transform .2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <AiOutlineLeft size={14} />
              </button>
              <button onClick={e => { e.stopPropagation(); nextImg(); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", zIndex: 60, background: "rgba(255,255,255,.92)", border: "none", borderRadius: "50%", width: 33, height: 33, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 12px rgba(0,0,0,.14)", transition: "transform .2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(-50%) scale(1)")}
              >
                <RightArrow size={14} />
              </button>
              <div className="lg:w-1/2 flex items-center justify-center p-6" style={{ background: "#e6f4f1", minHeight: 250 }}>
                <Image isBlurred className="w-full object-contain rounded-xl" style={{ maxHeight: "56vh", animation: "fadeIn .35s ease" }} src={displaySettings[selectedImage].image} alt={displaySettings[selectedImage].title} />
              </div>
              <div className="lg:w-1/2 p-7 overflow-y-auto thin-scroll flex flex-col" style={{ maxHeight: "calc(100vh - 24px)" }}>
                <span style={{ display: "inline-block", background: "#0d7a68", color: "#fff", fontSize: ".63rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "4px 11px", borderRadius: 4, marginBottom: 12, alignSelf: "flex-start" }}>
                  {displaySettings[selectedImage].title === "Luxury Gift" ? t("premiumGift") || "Premium Gift" : t("displaySetting") || "Display Setting"}
                </span>
                <h3 className="font-bold text-gray-900 mb-2 leading-snug" style={{ fontSize: "clamp(1.35rem,3vw,1.9rem)" }}>{t(displaySettings[selectedImage].title)}</h3>
                <p className="text-gray-500 mb-5 leading-relaxed" style={{ fontSize: ".9rem" }}>{t(displaySettings[selectedImage].description)}</p>
                <h4 style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#0d7a68", marginBottom: 10 }}>{t("keyFeatures") || "Key Features"}</h4>
                <div className="flex flex-col gap-3 mb-6">
                  {displaySettings[selectedImage].features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div style={{ width: 19, height: 19, borderRadius: "50%", background: "#0d7a68", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-600" style={{ fontSize: ".84rem" }}>{t(f)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid rgba(0,0,0,.08)", paddingTop: 13, marginTop: "auto" }}>
                  <p style={{ fontSize: ".66rem", color: "rgba(0,0,0,.32)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>{t("otherDisplaySettings") || "Other Settings"}</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {displaySettings.map((ds, i) => (
                      <button key={i} onClick={() => setSelectedImage(i)} style={{ padding: 0, border: i === selectedImage ? "2px solid #0d7a68" : "2px solid transparent", borderRadius: 6, overflow: "hidden", cursor: "pointer", aspectRatio: "1/1", background: "none", outline: i === selectedImage ? "3px solid rgba(13,122,104,.18)" : "none", transition: "all .2s" }}>
                        <Image className="w-full h-full object-cover" src={ds.image} alt={ds.title} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════
          AIRLINE MODAL — ✅ FIXED: FOLLOWS LIGHT/DARK MODE
      ══════════════════════════════════════════ */}
      {airlineModal && (
        <div className="al-modal-backdrop" onClick={closeAirlineModal}>
          <div className="al-modal" onClick={e => e.stopPropagation()}>
            <div className="al-modal-topbar" />
            <div className="al-modal-header">
              <div>
                <div className="al-modal-eyebrow">✦ Aviation Collection ✦</div>
                <div className="al-modal-title">
                  Our&nbsp;<span className="al-modal-title-accent">Scale Models</span>
                </div>
              </div>
              <button className="al-modal-close" onClick={closeAirlineModal}>×</button>
            </div>
            <div className="al-tabs">
              {AIRLINES.map((a, i) => (
                <button key={a.id} className={`al-tab${activeAirline === i ? " active" : ""}`} onClick={() => setActiveAirline(i)}>
                  <img src={a.logo} alt={a.name} className="al-tab-logo" />
                  <span className="al-tab-name">{a.name}</span>
                </button>
              ))}
            </div>
            <div className="al-modal-body">
              <div className="al-info">
                <img key={AIRLINES[activeAirline].id + "-logo"} src={AIRLINES[activeAirline].logo} alt={AIRLINES[activeAirline].name} className="al-airline-logo-big" />
                <div className="al-airline-name-big">{AIRLINES[activeAirline].name}</div>
                <div className="al-airline-country">{AIRLINES[activeAirline].country}</div>
                <div className="al-airline-desc">{AIRLINES[activeAirline].desc}</div>
                <div className="al-specs-label">Model Specifications</div>
                <div className="al-specs">
                  <div>
                    <div className="al-spec-val">{AIRLINES[activeAirline].scale}</div>
                    <div className="al-spec-label">Scale</div>
                  </div>
                  <div>
                    <div className="al-spec-val">{AIRLINES[activeAirline].length}</div>
                    <div className="al-spec-label">Length</div>
                  </div>
                  <div>
                    <div className="al-spec-val">{AIRLINES[activeAirline].edition}</div>
                    <div className="al-spec-label">Edition</div>
                  </div>
                </div>
              </div>
              <div className="al-plane-panel">
                <div className="al-plane-glow" />
                <div className="al-plane-grid" />
                <img key={AIRLINES[activeAirline].id + "-plane"} src={AIRLINES[activeAirline].plane} alt={AIRLINES[activeAirline].name + " model"} className="al-plane-img" />
              </div>
            </div>
            <div className="al-dots">
              {AIRLINES.map((_, i) => (
                <button key={i} className={`al-dot${activeAirline === i ? " active" : ""}`} onClick={() => setActiveAirline(i)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}