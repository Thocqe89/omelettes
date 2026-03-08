import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaStar, FaTruck } from "react-icons/fa";
import DefaultLayout from "@/layouts/default";
import { AiOutlineLeft, AiOutlineRight, AiOutlineShoppingCart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { HiShoppingCart } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Textarea, Checkbox,
} from "@heroui/react";
import { IoClose } from "react-icons/io5";

/* ─────────────────────────────────────────────────────────
   Types (unchanged from original)
───────────────────────────────────────────────────────── */
interface Product {
  ID: string; Name: string; Type: string; Size: string;
  "Qty Bought": number; "Final Selling Price": number;
  Status?: string; Notes?: string; Image?: string;
  Phone?: string; Logo?: string; Rating?: number;
  Images?: Record<string, string | null>;
}
interface OrderDetails {
  productId: string; productName: string; price: number; quantity: number;
  customerName: string; phone: string; address: string; notes: string; includeLogistics: boolean;
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

/* ─────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');
  .sp-root, .sp-root * { font-family: 'Ubuntu', sans-serif; }

  /* ── keyframes ── */
  @keyframes spShimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spGridMove   { from{background-position:0 0} to{background-position:0 38px} }
  @keyframes spTwinkle    { from{opacity:var(--oa)} to{opacity:calc(var(--oa)*0.1)} }
  @keyframes spCloudDrift { from{transform:translateX(110vw)} to{transform:translateX(-30vw)} }
  @keyframes spSline { 0%{transform:translateX(110vw);opacity:0} 8%{opacity:1} 92%{opacity:.5} 100%{transform:translateX(-20vw);opacity:0} }
  @keyframes spTakeoff {
    0%{transform:translate(-200px,2px) rotate(0deg);opacity:0} 6%{opacity:1}
    28%{transform:translate(-50px,2px) rotate(0deg);opacity:1}
    55%{transform:translate(50px,-52px) rotate(-12deg);opacity:1}
    78%{transform:translate(190px,-158px) rotate(-20deg);opacity:.7}
    100%{transform:translate(360px,-310px) rotate(-24deg);opacity:0}
  }
  @keyframes spLanding {
    0%{transform:translate(320px,-270px) rotate(11deg);opacity:0} 6%{opacity:1}
    38%{transform:translate(90px,-52px) rotate(6deg);opacity:1}
    56%{transform:translate(-10px,2px) rotate(2deg);opacity:1}
    70%{transform:translate(-75px,2px) rotate(0deg);opacity:1}
    100%{transform:translate(-260px,2px) rotate(0deg);opacity:0}
  }
  @keyframes spExhaust  { from{opacity:.55;transform:translateY(-50%) scaleX(1)} to{opacity:1;transform:translateY(-50%) scaleX(1.5)} }
  @keyframes spSparks   { 0%,50%{opacity:0} 57%,63%{opacity:1} 68%,100%{opacity:0} }
  @keyframes spSparkFly { from{transform:translateY(0) rotate(-15deg);opacity:1} to{transform:translateY(-9px) rotate(12deg);opacity:0} }
  @keyframes spPhasePulse { from{opacity:.4} to{opacity:1} }
  @keyframes spSpin     { to{transform:rotate(360deg)} }
  @keyframes spGlowPulse { 0%,100%{box-shadow:0 0 0 0 rgba(13,122,104,.4)} 50%{box-shadow:0 0 0 8px rgba(13,122,104,0)} }
  @keyframes spCardIn   { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:scale(1)} }
  @keyframes spPriceIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spFadeIn   { from{opacity:0} to{opacity:1} }

  /* ── Intro overlay ── */
  .sp-intro {
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:#050e0c;overflow:hidden;
    transition:opacity .6s ease,transform .6s ease;
  }
  .sp-intro.exiting { opacity:0;transform:translateY(-12px);pointer-events:none; }
  .sp-intro-sky {
    position:absolute;inset:0;
    background:
      radial-gradient(ellipse 70% 50% at 62% 30%,rgba(13,122,104,.42) 0%,transparent 65%),
      radial-gradient(ellipse 45% 65% at 8% 82%,rgba(8,61,51,.55) 0%,transparent 55%),
      linear-gradient(180deg,#02080a 0%,#050e0c 40%,#061411 100%);
  }
  .sp-grid {
    position:absolute;bottom:0;left:-50%;right:-50%;height:42%;
    background-image:linear-gradient(rgba(13,122,104,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(13,122,104,.16) 1px,transparent 1px);
    background-size:56px 38px;
    transform:perspective(380px) rotateX(60deg);transform-origin:bottom center;
    animation:spGridMove 1.6s linear infinite;
  }
  .sp-horizon { position:absolute;bottom:42%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(13,122,104,.5) 20%,rgba(77,184,168,.65) 50%,rgba(13,122,104,.5) 80%,transparent);filter:blur(.5px); }
  .sp-horizon::after { content:'';position:absolute;inset:-3px 0;background:inherit;filter:blur(5px);opacity:.4; }
  .sp-glow-floor { position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:55%;height:28px;background:radial-gradient(ellipse at center,rgba(13,122,104,.32) 0%,transparent 70%);filter:blur(7px); }
  .sp-star  { position:absolute;border-radius:50%;background:#fff;animation:spTwinkle var(--d) ease-in-out infinite alternate; }
  .sp-cloud { position:absolute;border-radius:50px;background:rgba(255,255,255,.035);filter:blur(9px);animation:spCloudDrift var(--cd) linear infinite; }
  .sp-sline { position:absolute;height:1px;background:linear-gradient(90deg,transparent,rgba(13,122,104,.45),transparent);animation:spSline var(--sl) linear infinite;opacity:0; }
  .sp-plane-wrap { position:absolute;bottom:42%;left:0;right:0;display:flex;justify-content:center; }
  .sp-takeoff { animation:spTakeoff 2.4s cubic-bezier(.4,0,.2,1) both;transform-origin:center bottom; }
  .sp-landing { animation:spLanding 2.4s cubic-bezier(.4,0,.2,1) both;transform-origin:center bottom; }
  .sp-exhaust { position:absolute;right:-16px;top:50%;transform:translateY(-50%);width:20px;height:7px;background:radial-gradient(ellipse at left,rgba(13,122,104,.75),transparent);filter:blur(3px);animation:spExhaust .38s ease-in-out infinite alternate; }
  .sp-sparks  { position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:36px;height:10px;opacity:0; }
  .sp-landing .sp-sparks { animation:spSparks 2.4s ease infinite; }
  .sp-spark   { position:absolute;bottom:0;width:2px;background:#4db8a8;border-radius:1px;animation:spSparkFly .28s ease-out infinite; }
  .sp-spark:nth-child(1){left:6px;height:5px} .sp-spark:nth-child(2){left:14px;height:8px;animation-delay:.04s}
  .sp-spark:nth-child(3){left:22px;height:4px;animation-delay:.09s} .sp-spark:nth-child(4){left:30px;height:7px;animation-delay:.02s}
  .sp-intro-ui { position:relative;z-index:10;display:flex;flex-direction:column;align-items:center;gap:14px;margin-top:-48px; }
  .sp-brand    { font-size:clamp(1.6rem,5vw,2.4rem);font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#fff; }
  .sp-brand em { color:#E43636;font-style:normal; }
  .sp-phase    { font-size:.7rem;font-weight:500;letter-spacing:4px;text-transform:uppercase;color:#4db8a8;animation:spPhasePulse 1.4s ease-in-out infinite alternate; }
  .sp-bar-track { width:clamp(220px,38vw,340px);height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden; }
  .sp-bar-fill  { height:100%;border-radius:2px;background:linear-gradient(90deg,#0d7a68,#4db8a8);box-shadow:0 0 10px rgba(13,122,104,.6);transition:width .1s linear; }
  .sp-sub       { font-size:.7rem;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.32); }

  /* ── Page ── */
  .sp-page { min-height:100vh;background:#f4f8f7; }
  .dark .sp-page { background:#0f1a18; }

  /* ── Header ── */
  .sp-header {
    position:relative;overflow:hidden;
    background:linear-gradient(135deg,#050e0c 0%,#0d7a68 55%,#0a5a4c 100%);
    padding:72px 24px 60px;text-align:center;
  }
  .sp-header-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px; }
  .sp-header-orb  { position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none; }
  .sp-header h1 {
    position:relative;z-index:2;
    font-size:clamp(3rem,9vw,6rem);font-weight:700;letter-spacing:-1px;line-height:1;
    background:linear-gradient(135deg,#fff 0%,#7dd4c8 42%,#fff 100%);
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    animation:spShimmer 4s linear infinite;
  }
  .sp-header h1 em { -webkit-text-fill-color:#E43636;font-style:normal; }
  .sp-header-sub  { position:relative;z-index:2;margin-top:10px;font-size:clamp(.85rem,2vw,1.1rem);color:rgba(255,255,255,.6);letter-spacing:2px;text-transform:uppercase; }
  .sp-header-pill { position:relative;z-index:2;display:inline-flex;align-items:center;gap:7px;margin-top:18px;padding:6px 18px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.78);font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase; }
  .sp-pill-dot    { width:7px;height:7px;border-radius:50%;background:#4db8a8;box-shadow:0 0 6px #4db8a8;display:inline-block; }

  /* ── Search ── */
  .sp-search-wrap { display:flex;justify-content:center;padding:28px 16px 12px; }
  .sp-search { position:relative;width:100%;max-width:500px; }
  .sp-search input { width:100%;padding:13px 44px 13px 50px;border-radius:50px;border:2px solid rgba(13,122,104,.22);background:#fff;color:#111;font-size:.93rem;font-family:'Ubuntu',sans-serif;box-shadow:0 4px 22px rgba(0,0,0,.07);outline:none;transition:border-color .25s,box-shadow .25s; }
  .dark .sp-search input { background:#1a2e29;color:#e5f5f2;border-color:rgba(77,184,168,.25); }
  .sp-search input:focus { border-color:#0d7a68;box-shadow:0 4px 22px rgba(13,122,104,.22); }
  .sp-search input::placeholder { color:rgba(0,0,0,.35); }
  .dark .sp-search input::placeholder { color:rgba(255,255,255,.3); }
  .sp-search-icon  { position:absolute;left:17px;top:50%;transform:translateY(-50%);color:#0d7a68;pointer-events:none; }
  .sp-search-clear { position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:rgba(0,0,0,.35);transition:color .2s; }
  .sp-search-clear:hover { color:#E43636; }
  .sp-count { text-align:center;font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(13,122,104,.6);margin-bottom:4px; }

  /* ── Cards ── */
  .sp-cards { display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:26px;padding:8px 0 44px; }
  .sp-card  { background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(13,122,104,.1);box-shadow:0 4px 22px rgba(0,0,0,.07);display:flex;flex-direction:column;animation:spCardIn .5s ease both;transition:box-shadow .3s ease; }
  .dark .sp-card { background:#1a2e29;border-color:rgba(77,184,168,.14); }
  .sp-card:hover { box-shadow:0 22px 55px rgba(0,0,0,.14); }

  /* image zone */
  .sp-img-zone { position:relative;height:250px;overflow:hidden;cursor:zoom-in;background:#0a0f0e; }
  .sp-img-blur { position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(18px);transform:scale(1.12);opacity:.55; }
  .sp-img-dim  { position:absolute;inset:0;background:rgba(0,0,0,.1); }
  .sp-img-main { position:relative;z-index:2;width:100%;height:100%;object-fit:contain;transition:transform .5s ease; }
  .sp-card:hover .sp-img-main { transform:scale(1.04); }
  .sp-status { position:absolute;top:10px;left:10px;z-index:15;padding:3px 10px;border-radius:5px;font-size:.6rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:#0d7a68;color:#fff; }
  .sp-nav   { position:absolute;top:50%;transform:translateY(-50%);z-index:20;background:rgba(5,14,12,.55);border:none;cursor:pointer;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;transition:background .2s; }
  .sp-nav:hover { background:rgba(13,122,104,.85); }
  .sp-nav-l { left:10px; } .sp-nav-r { right:10px; }
  .sp-img-dots { position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:10; }
  .sp-dot      { width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.42);border:none;padding:0;cursor:pointer;transition:all .25s; }
  .sp-dot.on   { background:#0d7a68;width:16px;border-radius:3px; }

  /* body */
  .sp-body  { padding:18px 18px 16px;flex:1;display:flex;flex-direction:column; }
  .sp-name  { font-size:1.05rem;font-weight:700;color:#0d7a68;line-height:1.25;margin-bottom:2px; }
  .dark .sp-name { color:#7dd4c8; }
  .sp-price { font-size:1.12rem;font-weight:700;color:#E43636;animation:spPriceIn .5s ease both; }
  .sp-stars { display:flex;align-items:center;gap:2px;margin:6px 0 2px; }
  .sp-star-count { font-size:.72rem;color:rgba(0,0,0,.38);margin-left:4px; }
  .dark .sp-star-count { color:rgba(255,255,255,.32); }
  .sp-meta   { display:flex;flex-direction:column;gap:3px;margin-top:6px; }
  .sp-meta p { font-size:.8rem;color:rgba(0,0,0,.45);margin:0; }
  .dark .sp-meta p { color:rgba(255,255,255,.38); }
  .sp-meta span { color:#0d7a68;font-weight:600; }
  .dark .sp-meta span { color:#4db8a8; }
  .sp-cta {
    margin-top:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:linear-gradient(135deg,#0d7a68,#0a6455);color:#fff;
    font-size:.88rem;font-weight:600;letter-spacing:.5px;font-family:'Ubuntu',sans-serif;
    padding:11px 22px;border-radius:50px;border:none;cursor:pointer;
    box-shadow:0 6px 20px rgba(13,122,104,.32);
    animation:spGlowPulse 2.5s infinite;
    transition:transform .2s,box-shadow .3s;
  }
  .sp-cta:hover { transform:translateY(-1px);box-shadow:0 10px 28px rgba(13,122,104,.48); }

  /* spinner */
  .sp-spinner-wrap  { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 0;gap:14px; }
  .sp-spinner       { width:44px;height:44px;border:3px solid rgba(13,122,104,.18);border-top-color:#0d7a68;border-radius:50%;animation:spSpin .8s linear infinite; }
  .sp-spinner-label { font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(13,122,104,.6); }

  /* empty */
  .sp-empty { text-align:center;padding:72px 16px;color:rgba(0,0,0,.38); }
  .dark .sp-empty { color:rgba(255,255,255,.28); }

  /* modal */
  .sp-modal-summary { background:#f0faf8;border-radius:12px;padding:18px;border:1px solid rgba(13,122,104,.14); }
  .dark .sp-modal-summary { background:rgba(13,122,104,.09);border-color:rgba(77,184,168,.18); }
  .sp-modal-label { font-size:.68rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0d7a68;margin-bottom:10px; }
  .sp-modal-row   { font-size:.87rem;color:rgba(0,0,0,.55);margin-bottom:4px; }
  .dark .sp-modal-row { color:rgba(255,255,255,.5); }
  .sp-modal-val   { color:#0d7a68;font-weight:600; }
  .dark .sp-modal-val { color:#4db8a8; }
  .sp-modal-note  { font-size:.78rem;color:#E43636;margin-top:8px; }
  .sp-wa-btn { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;font-weight:700;font-size:.92rem;letter-spacing:.5px;font-family:'Ubuntu',sans-serif;padding:11px 24px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(37,211,102,.28);transition:box-shadow .3s,transform .2s; }
  .sp-wa-btn:hover { box-shadow:0 10px 28px rgba(37,211,102,.42);transform:translateY(-1px); }
  .sp-cancel-btn  { padding:10px 18px;background:none;border:1px solid rgba(0,0,0,.12);border-radius:8px;cursor:pointer;font-size:.88rem;color:rgba(0,0,0,.48);font-family:'Ubuntu',sans-serif;transition:all .2s; }
  .dark .sp-cancel-btn { border-color:rgba(255,255,255,.14);color:rgba(255,255,255,.42); }
  .sp-cancel-btn:hover { border-color:#E43636;color:#E43636; }

  /* lightbox */
  .sp-lb { position:fixed;inset:0;z-index:9990;background:rgba(2,8,7,.93);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px; }
  .sp-lb-img { max-width:92vw;max-height:80vh;object-fit:contain;border-radius:10px;box-shadow:0 24px 64px rgba(0,0,0,.65); }
  .sp-lb-nav { position:absolute;top:50%;transform:translateY(-50%);background:rgba(13,122,104,.3);border:1px solid rgba(13,122,104,.45);border-radius:50%;width:46px;height:46px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:background .2s; }
  .sp-lb-nav:hover { background:#0d7a68; }
  .sp-lb-nav-l { left:16px; } .sp-lb-nav-r { right:16px; }
  .sp-lb-close { position:absolute;top:16px;right:16px;background:#E43636;border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;transition:transform .2s;z-index:2; }
  .sp-lb-close:hover { transform:scale(1.1); }
  .sp-lb-thumbs { position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;max-width:90vw;overflow-x:auto;padding:4px; }
  .sp-lb-thumb  { width:50px;height:38px;border-radius:5px;object-fit:cover;border:2px solid transparent;opacity:.5;cursor:pointer;transition:opacity .2s,border-color .2s;flex-shrink:0; }
  .sp-lb-thumb.on { border-color:#0d7a68;opacity:1; }
  .sp-lb-counter { position:absolute;top:18px;left:50%;transform:translateX(-50%);background:rgba(5,14,12,.7);color:#fff;padding:4px 16px;border-radius:20px;font-size:.75rem;letter-spacing:1px;font-family:'Ubuntu',sans-serif; }

  /* footer */
  .sp-footer-bar { height:3px;background:linear-gradient(90deg,#0d7a68,#4db8a8);border-radius:2px;width:60px;margin:0 auto; }

  @media(max-width:640px){
    .sp-cards { grid-template-columns:1fr; }
    .sp-header { padding:50px 16px 42px; }
    .sp-lb-nav { display:none; }
  }
`;

/* ── Deterministic intro data ── */
const STARS  = Array.from({length:52},(_,i)=>({ top:((i*37+13)%100), left:((i*61+7)%100), size:((i*17+3)%3)+1, oa:(((i*29+11)%7)+3)/10, dur:(((i*43+5)%4)+2)+"s" }));
const CLOUDS = [{top:"18%",w:165,h:25,del:"-1s",dur:"17s"},{top:"27%",w:112,h:16,del:"-7s",dur:"22s"},{top:"11%",w:205,h:31,del:"-13s",dur:"26s"}];
const LINES  = Array.from({length:8},(_,i)=>({ top:`${8+i*8}%`, width:`${72+(i*31)%112}px`, left:`${(i*13)%28}%`, delay:`-${((i*0.45)%2.4).toFixed(1)}s`, dur:`${(1.1+(i*0.28)%1.3).toFixed(1)}s` }));

/* ── Airplane SVG ── */
const Plane = ({size=116}:{size?:number}) => (
  <svg width={size} height={size*0.44} viewBox="0 0 220 96" fill="none"
    style={{display:"block",filter:"drop-shadow(0 0 14px rgba(13,122,104,.6))"}}>
    <ellipse cx="110" cy="48" rx="100" ry="17" fill="url(#spFuse)"/>
    <path d="M210 48 Q220 47 218 48 Q220 49 210 48Z" fill="#d0eae6"/>
    <ellipse cx="192" cy="44" rx="9" ry="6" fill="#e8f8f5" opacity=".9"/>
    <ellipse cx="178" cy="43" rx="7" ry="5" fill="#cdf0ea" opacity=".75"/>
    <path d="M115 48 L158 28 L172 31 L140 48 L172 65 L158 68Z" fill="url(#spWing)"/>
    <path d="M118 46 L157 29 L165 30 L130 47Z" fill="rgba(220,245,242,.12)"/>
    <path d="M24 48 L46 38 L54 40 L38 48 L54 56 L46 58Z" fill="url(#spTail)"/>
    <path d="M28 48 L50 22 L55 24 L40 48Z" fill="url(#spTailFin)"/>
    <ellipse cx="148" cy="65" rx="22" ry="8" fill="url(#spEng)" transform="rotate(-3 148 65)"/>
    <ellipse cx="168" cy="64" rx="4" ry="6" fill="rgba(125,212,200,.75)"/>
    <ellipse cx="128" cy="65" rx="3" ry="4" fill="rgba(13,122,104,.5)"/>
    {[60,74,88,102,116,130,144,158,168,178].map((x,i)=>(
      <rect key={i} x={x} y="41" width="8" height="6" rx="2.5" fill="#d4f0eb" opacity={i>6?.65:.85}/>
    ))}
    <circle cx="90" cy="65" r="4" fill="rgba(13,122,104,.5)"/>
    <circle cx="150" cy="73" r="3.5" fill="rgba(13,122,104,.4)"/>
    <defs>
      <linearGradient id="spFuse" x1="10" y1="31" x2="210" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4a8a80"/><stop offset="35%" stopColor="#b8deda"/>
        <stop offset="65%" stopColor="#e0f5f2"/><stop offset="100%" stopColor="#6aada5"/>
      </linearGradient>
      <linearGradient id="spWing" x1="115" y1="28" x2="172" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7ac8be"/><stop offset="100%" stopColor="#3a7870"/>
      </linearGradient>
      <linearGradient id="spTail" x1="24" y1="38" x2="54" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5a9990"/><stop offset="100%" stopColor="#2e6860"/>
      </linearGradient>
      <linearGradient id="spTailFin" x1="28" y1="22" x2="55" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4a8880"/><stop offset="100%" stopColor="#1e5850"/>
      </linearGradient>
      <linearGradient id="spEng" x1="126" y1="57" x2="170" y2="73" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e5850"/><stop offset="60%" stopColor="#5aaaa0"/><stop offset="100%" stopColor="#a0d8d2"/>
      </linearGradient>
    </defs>
  </svg>
);

/* ── Animated price (your original logic) ── */
const AnimatedPrice = ({ price }: { price: number }) => {
  const [displayPrice, setDisplayPrice] = React.useState(0);
  React.useEffect(() => {
    const duration = 1500, frameDuration = 1000/60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      setDisplayPrice(Math.round(price * (frame / totalFrames)));
      if (frame === totalFrames) { clearInterval(counter); setDisplayPrice(price); }
    }, frameDuration);
    return () => clearInterval(counter);
  }, [price]);
  return (
    <motion.span className="sp-price" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.5 }}>
      {displayPrice.toLocaleString()} ₭
    </motion.span>
  );
};

/* ═════════════════════════════════════════════════════════
   Main Component
═════════════════════════════════════════════════════════ */
export default function Omellets() {
  const { t } = useTranslation();
  const [entries,      setEntries]      = React.useState<Product[]>([]);
  const [loading,      setLoading]      = React.useState(true);
  const [searchTerm,   setSearchTerm]   = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [orderDetails,    setOrderDetails]    = React.useState<OrderDetails>({
    productId:"", productName:"", price:0, quantity:1,
    customerName:"", phone:"", address:"", notes:"", includeLogistics:false,
  });

  // Lightbox — your original state names preserved
  const [lightboxOpen,          setLightboxOpen]          = React.useState(false);
  const [selectedProductImages, setSelectedProductImages] = React.useState<string[]>([]);
  const [selectedImageIndex,    setSelectedImageIndex]    = React.useState(0);

  // Intro loader
  const [introVisible,  setIntroVisible]  = React.useState(true);
  const [introPhase,    setIntroPhase]    = React.useState<"takeoff"|"landing">("takeoff");
  const [introExiting,  setIntroExiting]  = React.useState(false);
  const [introProgress, setIntroProgress] = React.useState(0);

  /* ── Intro timeline ── */
  React.useEffect(() => {
    let prog = 0;
    const progId = setInterval(() => { prog++; setIntroProgress(Math.min(prog,100)); if(prog>=100) clearInterval(progId); }, 45);
    const landId = setTimeout(() => setIntroPhase("landing"), 2400);
    const exitId = setTimeout(() => setIntroExiting(true),    4200);
    const doneId = setTimeout(() => setIntroVisible(false),   4800);
    return () => { clearInterval(progId); clearTimeout(landId); clearTimeout(exitId); clearTimeout(doneId); };
  }, []);

  /* ── Keyboard for lightbox ── */
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")      setLightboxOpen(false);
      if (e.key === "ArrowRight")  setSelectedImageIndex(p => (p+1) % selectedProductImages.length);
      if (e.key === "ArrowLeft")   setSelectedImageIndex(p => (p-1+selectedProductImages.length) % selectedProductImages.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxOpen, selectedProductImages.length]);

  /* ── Fetch (your original logic unchanged) ── */
  React.useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setEntries(data.products.map((p: any) => ({
            ID: p.ID||"N/A", Name: p.Name||"N/A", Type: p.Type||"-", Size: p.Size||"-",
            "Qty Bought": Number(p["Qty Bought"])||0,
            "Final Selling Price": Number(p["Final Selling Price"])||0,
            Status: p.Status||"", Notes: p.Notes||"",
            Image: p.Image||"", Phone: p.Phone||"", Logo: p.logo||"",
            Images: p.Images||{},
            Rating: Math.min(5, Math.max(0, Number(p.Rating)||4)),
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [t]);

  /* ── Helpers (your original logic unchanged) ── */
  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setOrderDetails({ productId:product.ID, productName:product.Name,
      price:product["Final Selling Price"], quantity:1,
      customerName:"", phone:"", address:"", notes:"", includeLogistics:false });
    onOpen();
  };

  const handleOrderSubmit = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    const formattedTime = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const message = `🛒 New Order Request | ${formattedDate} at ${formattedTime}\n
Product Details | 
ID: OMS-00-00-${orderDetails.productId}
Name: ${orderDetails.productName}
Type: ${selectedProduct?.Type}
Size: ${selectedProduct?.Size}
Price: ${orderDetails.price.toLocaleString()} ₭
Quantity: ${orderDetails.quantity}
${orderDetails.includeLogistics ? `time_label: ${orderDetails.address}` : ''}
Additional Notes: ${orderDetails.notes || 'None'}
*Logistics services provided free of charge 
____________________________
${orderDetails.includeLogistics ? ' Pickup at T2 bannakham, sekhodthabong district, Vientiane province, Laos' : ''}`;
    window.open(`https://wa.me/8562055058028?text=${encodeURIComponent(message)}`, '_blank');
    onOpenChange();
  };

  function getAllImages(product: Product): string[] {
    const images: string[] = [];
    const keys = ["image_meain","image_1","image_2","image_3","image_4","image_5",
      "image_6","image_7","image_8","image_9","image_10","image_11",
      "image_12","image_13","image_14","image_15"] as const;
    if (product.Images) keys.forEach(k => { const u=product.Images?.[k]; if(u&&u.trim()!=="") images.push(u.trim()); });
    if (images.length===0) {
      if (product.Image?.trim()) images.push(product.Image.trim());
      else if (product.Logo?.trim()) images.push(product.Logo.trim());
      else images.push("https://res.cloudinary.com/deahgtn57/image/upload/v1757573548/omelett%27s/public/image/fly_h2va9e.png");
    }
    return images;
  }

  function handleNextImage(id: string, total: number) { setImageIndexes(p=>({...p,[id]:((p[id]??0)+1)%total})); }
  function handlePrevImage(id: string, total: number) { setImageIndexes(p=>({...p,[id]:((p[id]??0)-1+total)%total})); }

  const filteredEntries = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Airplane intro loader ── */}
      {introVisible && (
        <div className={`sp-intro${introExiting?" exiting":""}`}>
          <div className="sp-intro-sky" />
          {STARS.map((s,i) => (
            <div key={i} className="sp-star"
              style={{ top:`${s.top}%`,left:`${s.left}%`,width:s.size,height:s.size,"--d":s.dur,"--oa":s.oa } as React.CSSProperties} />
          ))}
          {CLOUDS.map((c,i) => (
            <div key={i} className="sp-cloud"
              style={{ top:c.top,width:c.w,height:c.h,"--cd":c.dur,animationDelay:c.del } as React.CSSProperties} />
          ))}
          {LINES.map((l,i) => (
            <div key={i} className="sp-sline"
              style={{ top:l.top,width:l.width,left:l.left,"--sl":l.dur,animationDelay:l.delay } as React.CSSProperties} />
          ))}
          <div className="sp-horizon" />
          <div className="sp-grid" />
          <div className="sp-glow-floor" />
          <div className="sp-plane-wrap">
            <div className={introPhase==="takeoff"?"sp-takeoff":"sp-landing"} style={{ position:"relative" }}>
              <Plane size={122} />
              <div className="sp-exhaust" />
              <div className="sp-sparks">{[0,1,2,3].map(i=><div key={i} className="sp-spark"/>)}</div>
            </div>
          </div>
          <div className="sp-intro-ui">
            <div className="sp-brand">Omelette<em>'</em>s</div>
            <div className="sp-phase">{introPhase==="takeoff"?"✈  Preparing for Takeoff":"✈  On Final Approach"}</div>
            <div className="sp-bar-track"><div className="sp-bar-fill" style={{ width:`${introProgress}%` }}/></div>
            <div className="sp-sub">Premium Aircraft Collection</div>
          </div>
        </div>
      )}

      <div className="sp-root sp-page">

        {/* ── Header ── */}
        <div className="sp-header">
          <div className="sp-header-grid" />
          <div className="sp-header-orb" style={{ width:440,height:440,top:"-25%",right:"8%",background:"radial-gradient(circle,rgba(13,122,104,.28) 0%,transparent 70%)" }} />
          <div className="sp-header-orb" style={{ width:280,height:280,bottom:"-35%",left:"4%",background:"radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%)" }} />
          <h1>Omelette<em>'</em>s</h1>
          <p className="sp-header-sub">{t("premium_airplane_models") || "Premium Model Aircraft • Collectors & Enthusiasts"}</p>
          <div className="sp-header-pill">
            <span className="sp-pill-dot" />
            ✈ Collection Store
          </div>
        </div>

        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 20px" }}>

          {/* ── Search ── */}
          <div className="sp-search-wrap">
            <div className="sp-search">
              <FiSearch size={18} className="sp-search-icon" />
              <input
                type="text"
                placeholder={t("search") || "Search airplane models..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="sp-search-clear" onClick={() => setSearchTerm("")} aria-label="Clear search">
                  <IoClose size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="sp-spinner-wrap">
              <div className="sp-spinner" />
              <span className="sp-spinner-label">Loading</span>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredEntries.length === 0 && (
            <div className="sp-empty">
              <div style={{ fontSize:"2.8rem",marginBottom:12,opacity:.35 }}>✈</div>
              <p style={{ fontWeight:700,fontSize:"1rem",marginBottom:6 }}>{t("no_results_found")||"No results found"}</p>
              <p style={{ fontSize:".85rem" }}>Try a different search term</p>
            </div>
          )}

          {/* Count */}
          {!loading && filteredEntries.length > 0 && (
            <p className="sp-count">{filteredEntries.length} model{filteredEntries.length!==1?"s":""} found</p>
          )}

          {/* Cards */}
          {!loading && filteredEntries.length > 0 && (
            <div className="sp-cards">
              {filteredEntries.map((entry, idx) => {
                const images = getAllImages(entry);
                const curIdx = imageIndexes[entry.ID] ?? 0;
                return (
                  <motion.div key={entry.ID} className="sp-card"
                    style={{ animationDelay:`${idx*0.055}s` }}
                    whileHover={{ y:-5 }}
                    transition={{ type:"spring", stiffness:280, damping:20 }}>

                    {/* Image zone */}
                    <div className="sp-img-zone"
                      onClick={() => { setSelectedProductImages(images); setSelectedImageIndex(curIdx); setLightboxOpen(true); }}>
                      <div className="sp-img-blur" style={{ backgroundImage:`url(${images[curIdx]})` }}/>
                      <div className="sp-img-dim"/>
                      <img className="sp-img-main" src={images[curIdx]} alt={`${entry.Name} ${curIdx+1}`} loading="lazy"/>
                      {entry.Status && <div className="sp-status">{entry.Status}</div>}
                      {images.length > 1 && (
                        <>
                          <button className="sp-nav sp-nav-l" onClick={e=>{e.stopPropagation();handlePrevImage(entry.ID,images.length);}}>
                            <AiOutlineLeft size={14}/>
                          </button>
                          <button className="sp-nav sp-nav-r" onClick={e=>{e.stopPropagation();handleNextImage(entry.ID,images.length);}}>
                            <AiOutlineRight size={14}/>
                          </button>
                          <div className="sp-img-dots">
                            {images.slice(0,8).map((_,i)=>(
                              <button key={i} className={`sp-dot${i===curIdx?" on":""}`}
                                onClick={e=>{e.stopPropagation();setImageIndexes(p=>({...p,[entry.ID]:i}));}}/>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Body */}
                    <div className="sp-body">
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap" }}>
                        <h3 className="sp-name">{entry.Name}</h3>
                        <AnimatedPrice price={entry["Final Selling Price"]}/>
                      </div>
                      <div className="sp-stars">
                        {[...Array(5)].map((_,i)=>(
                          <FaStar key={i} size={13} style={{ color:i<(entry.Rating||0)?"#f59e0b":"rgba(0,0,0,.18)" }}/>
                        ))}
                        <span className="sp-star-count">({entry.Rating||0}/5)</span>
                      </div>
                      <div className="sp-meta">
                        <p>{t("id")}: <span>OMS-00-00-{entry.ID}</span></p>
                        <p>{t("type")}: <span>{entry.Type}</span></p>
                        <p>{t("size")}: <span>{entry.Size}</span></p>
                        <p>{t("quantity")}: <span>{entry["Qty Bought"]}</span></p>
                      </div>
                      <button className="sp-cta" onClick={() => openOrderModal(entry)}>
                        <AiOutlineShoppingCart size={18}/>
                        <span className="hidden sm:inline">{t("shop_now")||"Order Now"}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && <div style={{ paddingBottom:44,display:"flex",justifyContent:"center" }}><div className="sp-footer-bar"/></div>}
        </div>
      </div>

      {/* ══════════════ Order Modal (your original logic) ══════════════ */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div style={{ display:"flex",alignItems:"center",gap:8,fontFamily:"'Ubuntu',sans-serif",fontWeight:700 }}>
                  <HiShoppingCart style={{ color:"#0d7a68" }} size={20}/>
                  {t("models")} | {selectedProduct?.Name}
                </div>
              </ModalHeader>
              <ModalBody style={{ gap:16 }}>
                <div className="sp-modal-summary">
                  <div className="sp-modal-label">{t("order_summary")}</div>
                  {([
                    [t("id"),    `OMS-00-00-${selectedProduct?.ID}`],
                    [t("name"),  selectedProduct?.Name],
                    [t("size"),  selectedProduct?.Size],
                    [t("type"),  selectedProduct?.Type],
                    [t("price"), `${selectedProduct?.["Final Selling Price"].toLocaleString()} ₭`],
                  ] as [string,string|undefined][]).map(([label,val],i) => (
                    <div key={i} className="sp-modal-row">{label}: <span className="sp-modal-val">{val}</span></div>
                  ))}
                  {orderDetails.includeLogistics && (
                    <div className="sp-modal-row">{t("time_label")}: <span className="sp-modal-val">{orderDetails.address}</span></div>
                  )}
                  <div className="sp-modal-note">*{t("free_logistics_info")}</div>
                </div>

                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <Checkbox isSelected={orderDetails.includeLogistics}
                    onValueChange={checked => setOrderDetails({...orderDetails,includeLogistics:checked})}/>
                  <span style={{ fontSize:".88rem" }}>{t("i_will_pick_up")}</span>
                  <FaTruck style={{ color:"#0d7a68",marginLeft:6 }}/>
                </div>

                {orderDetails.includeLogistics && (
                  <Textarea label={t("location-text")||"Location"}
                    placeholder={t("pickup_time_instruction")||"Enter the time you will pick up yourself"}
                    value={orderDetails.address}
                    onChange={e => setOrderDetails({...orderDetails,address:e.target.value})}
                    minRows={3}/>
                )}

                <Textarea label={t("additional_notes")||"Additional Notes (Optional)"}
                  placeholder={t("any_special_requests")||"Any special requests or notes..."}
                  value={orderDetails.notes}
                  onChange={e => setOrderDetails({...orderDetails,notes:e.target.value})}
                  minRows={2}/>
              </ModalBody>
              <ModalFooter style={{ gap:10 }}>
                <button className="sp-cancel-btn" onClick={onClose}>Cancel</button>
                <button className="sp-wa-btn" onClick={handleOrderSubmit}>
                  <FaWhatsapp size={18}/> Send via WhatsApp
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ══════════════ Lightbox (upgraded: thumbnails + keyboard + AnimatePresence) ══════════════ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div className="sp-lb"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:.22 }}
            onClick={() => setLightboxOpen(false)}>

            <button className="sp-lb-close" onClick={e=>{e.stopPropagation();setLightboxOpen(false);}}>
              <IoClose size={20}/>
            </button>

            {selectedProductImages.length > 1 && (
              <>
                <button className="sp-lb-nav sp-lb-nav-l"
                  onClick={e=>{e.stopPropagation();setSelectedImageIndex(p=>(p-1+selectedProductImages.length)%selectedProductImages.length);}}>
                  <AiOutlineLeft size={22}/>
                </button>
                <button className="sp-lb-nav sp-lb-nav-r"
                  onClick={e=>{e.stopPropagation();setSelectedImageIndex(p=>(p+1)%selectedProductImages.length);}}>
                  <AiOutlineRight size={22}/>
                </button>
              </>
            )}

            <motion.img key={selectedImageIndex} className="sp-lb-img"
              src={selectedProductImages[selectedImageIndex]}
              alt={`Fullscreen view ${selectedImageIndex+1}`}
              onClick={e=>e.stopPropagation()}
              initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:.95 }} transition={{ duration:.2 }}/>

            {selectedProductImages.length > 1 && (
              <>
                <div className="sp-lb-counter">{selectedImageIndex+1} / {selectedProductImages.length}</div>
                <div className="sp-lb-thumbs" onClick={e=>e.stopPropagation()}>
                  {selectedProductImages.map((src,i) => (
                    <img key={i} src={src} className={`sp-lb-thumb${i===selectedImageIndex?" on":""}`}
                      onClick={() => setSelectedImageIndex(i)} alt={`thumb ${i+1}`}/>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
}