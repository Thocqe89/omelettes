import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaStar, FaTruck, FaCopy, FaCheck } from "react-icons/fa";
import DefaultLayout from "@/layouts/default";
import { AiOutlineLeft, AiOutlineRight, AiOutlineShoppingCart, AiOutlineArrowUp } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { HiShoppingCart } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useDisclosure } from "@heroui/react";
import { IoClose } from "react-icons/io5";
import Loading from "@/components/loading";

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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');
  .sp-root, .sp-root * { font-family: 'Ubuntu', sans-serif; }

  @keyframes spShimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spSpin       { to{transform:rotate(360deg)} }
  @keyframes spGlowPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(13,122,104,.4)} 50%{box-shadow:0 0 0 8px rgba(13,122,104,0)} }
  @keyframes spCardIn     { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:scale(1)} }
  @keyframes spPriceIn    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spFadeIn     { from{opacity:0} to{opacity:1} }
  @keyframes lbFadeIn     { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  @keyframes lbSlideUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* ── scroll-to-top button ── */
  @keyframes stbIn  { from{opacity:0;transform:translateY(12px) scale(.85)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes stbOut { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(12px) scale(.85)} }

  .sp-scroll-top {
    position: fixed;
    bottom: max(env(safe-area-inset-bottom, 0px) + 80px, 80px);
    right: 20px;
    z-index: 9000;
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.3);
    background: rgba(13,122,104,.72);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
    box-shadow:
      0 4px 16px rgba(13,122,104,.45),
      0 1px 0 rgba(255,255,255,.2) inset;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background .2s, transform .2s, box-shadow .2s;
  }
  .sp-scroll-top:hover {
    background: rgba(13,122,104,.95);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(13,122,104,.6), 0 1px 0 rgba(255,255,255,.25) inset;
  }
  .sp-scroll-top:active { transform: scale(.93); }
  .sp-scroll-top-enter { animation: stbIn .3s cubic-bezier(.22,1,.36,1) both; }
  .sp-scroll-top-exit  { animation: stbOut .25s ease both; }

  /* top gloss on the button */
  .sp-scroll-top::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
    border-radius: 50%;
    pointer-events: none;
  }

  .sp-page { min-height:100vh;background:#f4f8f7; }
  .dark .sp-page { background:#0f1a18; }

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

  .sp-search-wrap { display:flex;justify-content:center;padding:28px 16px 12px; }
  .sp-search { position:relative;width:100%;max-width:520px; }
  .sp-search-glass {
    position:relative;border-radius:50px;background:#fff;
    border:1.5px solid rgba(13,122,104,.18);
    box-shadow:0 2px 12px rgba(13,122,104,.1),0 6px 24px rgba(0,0,0,.06),0 1px 0 rgba(255,255,255,1) inset;
    transition:box-shadow .25s, border-color .25s;overflow:hidden;
  }
  .sp-search-glass:focus-within {
    border-color:rgba(13,122,104,.5);
    box-shadow:0 2px 12px rgba(13,122,104,.15),0 8px 28px rgba(13,122,104,.12),0 0 0 4px rgba(13,122,104,.07);
  }
  .dark .sp-search-glass {
    background:rgba(255,255,255,.07);backdrop-filter:blur(20px) saturate(1.8);-webkit-backdrop-filter:blur(20px) saturate(1.8);
    border-color:rgba(77,184,168,.22);box-shadow:0 4px 24px rgba(0,0,0,.2), 0 1px 0 rgba(255,255,255,.1) inset;
  }
  .dark .sp-search-glass:focus-within { border-color:rgba(77,184,168,.5);box-shadow:0 6px 28px rgba(13,122,104,.22), 0 0 0 4px rgba(77,184,168,.1); }
  .sp-search input { width:100%;padding:13px 44px 13px 50px;border-radius:50px;border:none;background:transparent;color:#0a2e28;font-size:.93rem;font-family:'Ubuntu',sans-serif;outline:none; }
  .dark .sp-search input { color:#e5f5f2; }
  .sp-search input::placeholder { color:rgba(13,122,104,.4); }
  .dark .sp-search input::placeholder { color:rgba(77,184,168,.4); }
  .sp-search-icon { position:absolute;left:17px;top:50%;transform:translateY(-50%);color:#0d7a68;pointer-events:none;z-index:2; }
  .sp-search-clear { position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(13,122,104,.08);border:1px solid rgba(13,122,104,.15);border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0d7a68;transition:background .2s,color .2s,border-color .2s;z-index:2; }
  .sp-search-clear:hover { background:rgba(228,54,54,.1);color:#E43636;border-color:rgba(228,54,54,.25); }
  .dark .sp-search-clear { background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:rgba(255,255,255,.6); }
  .sp-count { text-align:center;font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(13,122,104,.6);margin-bottom:4px; }

  .sp-cards { display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:26px;padding:8px 0 44px; }
  .sp-card  { background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(13,122,104,.1);box-shadow:0 4px 22px rgba(0,0,0,.07);display:flex;flex-direction:column;animation:spCardIn .5s ease both;transition:box-shadow .3s ease; }
  .dark .sp-card { background:#1a2e29;border-color:rgba(77,184,168,.14); }
  .sp-card:hover { box-shadow:0 22px 55px rgba(0,0,0,.14); }

  .sp-img-zone { position:relative;height:250px;overflow:hidden;cursor:zoom-in;background:#0a0f0e; }
  .sp-img-blur { position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(18px);transform:scale(1.12);opacity:.55; }
  .sp-img-dim  { position:absolute;inset:0;background:rgba(0,0,0,.1); }
  .sp-img-main { position:relative;z-index:2;width:100%;height:100%;object-fit:contain;transition:transform .5s ease; }
  .sp-card:hover .sp-img-main { transform:scale(1.04); }
  .sp-status { position:absolute;top:10px;left:10px;z-index:15;padding:3px 10px;border-radius:5px;font-size:.6rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:#0d7a68;color:#fff; }

  .sp-nav { position:absolute;top:50%;transform:translateY(-50%);z-index:20;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:rgba(255,255,255,.14);backdrop-filter:blur(16px) saturate(1.6);-webkit-backdrop-filter:blur(16px) saturate(1.6);border:1px solid rgba(255,255,255,.28);box-shadow:0 4px 16px rgba(0,0,0,.28), 0 1px 0 rgba(255,255,255,.18) inset;color:#fff;transition:background .2s, transform .18s, box-shadow .2s; }
  .sp-nav:hover { background:rgba(13,122,104,.55);backdrop-filter:blur(20px) saturate(1.8);-webkit-backdrop-filter:blur(20px) saturate(1.8);transform:translateY(-50%) scale(1.1);box-shadow:0 6px 22px rgba(13,122,104,.4), 0 1px 0 rgba(255,255,255,.2) inset; }
  .sp-nav-l { left:10px; }
  .sp-nav-r { right:10px; }

  .sp-img-dots { position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:10; }
  .sp-dot      { width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.42);border:none;padding:0;cursor:pointer;transition:all .25s; }
  .sp-dot.on   { background:#0d7a68;width:16px;border-radius:3px; }

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
  .sp-cta { margin-top:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#0d7a68,#0a6455);color:#fff;font-size:.88rem;font-weight:600;letter-spacing:.5px;font-family:'Ubuntu',sans-serif;padding:11px 22px;border-radius:50px;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(13,122,104,.32);animation:spGlowPulse 2.5s infinite;transition:transform .2s,box-shadow .3s; }
  .sp-cta:hover { transform:translateY(-1px);box-shadow:0 10px 28px rgba(13,122,104,.48); }

  .sp-spinner-wrap  { display:none; }
  .sp-empty { text-align:center;padding:72px 16px;color:rgba(0,0,0,.38); }
  .dark .sp-empty { color:rgba(255,255,255,.28); }

  .sp-lb { position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,rgba(4,10,28,.88) 0%,rgba(3,14,36,.92) 50%,rgba(2,10,26,.88) 100%);backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);display:flex;align-items:center;justify-content:center;padding:0;box-sizing:border-box; }
  .sp-lb-orb { position:absolute;pointer-events:none;border-radius:50%; }
  .sp-lb::before { content:'';position:absolute;inset:0;pointer-events:none;opacity:.04;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,1) 1px,transparent 0);background-size:26px 26px; }
  .sp-lb-frame { position:relative;max-width:min(calc(100vw - 144px), 860px);max-height:calc(100vh - 210px);width:100%;border-radius:24px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(32px) saturate(1.8);-webkit-backdrop-filter:blur(32px) saturate(1.8);box-shadow:0 40px 100px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.2) inset;padding:10px;overflow:hidden;animation:lbFadeIn .3s cubic-bezier(.22,1,.36,1) both;transform:translateY(-36px); }
  .sp-lb-frame::before { content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45) 50%,transparent);pointer-events:none;z-index:2; }
  .sp-lb-img { display:block;width:100%;max-height:calc(100vh - 230px);object-fit:contain;border-radius:16px; }
  .sp-lb-close { position:fixed;top:max(env(safe-area-inset-top, 0px) + 14px, 14px);right:16px;z-index:1000001;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(228,54,54,.5);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(228,54,54,.35), 0 1px 0 rgba(255,255,255,.15) inset;transition:background .2s, transform .2s; }
  .sp-lb-close:hover { background:rgba(228,54,54,.8);transform:scale(1.1); }
  .sp-lb-counter { position:fixed;top:max(env(safe-area-inset-top, 0px) + 14px, 14px);left:16px;z-index:1000001;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.1);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.72rem;letter-spacing:2px;font-family:'Ubuntu',sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25), 0 1px 0 rgba(255,255,255,.12) inset; }
  .sp-lb-nav { position:fixed;top:50%;transform:translateY(-50%);z-index:1000001;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,255,255,.12);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);border:1px solid rgba(255,255,255,.26);color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.16) inset;transition:background .2s, transform .2s, box-shadow .2s; }
  .sp-lb-nav:hover { background:rgba(13,122,104,.55);transform:translateY(-50%) scale(1.08);box-shadow:0 8px 28px rgba(13,122,104,.4), 0 1px 0 rgba(255,255,255,.2) inset; }
  .sp-lb-nav-l { left:12px; }
  .sp-lb-nav-r { right:12px; }
  .sp-lb-thumbs-wrap { position:fixed;bottom:max(env(safe-area-inset-bottom, 0px) + 12px, 14px);left:50%;transform:translateX(-50%);z-index:1000001;padding:8px 10px;border-radius:20px;background:rgba(255,255,255,.1);backdrop-filter:blur(24px) saturate(1.6);-webkit-backdrop-filter:blur(24px) saturate(1.6);border:1px solid rgba(255,255,255,.2);box-shadow:0 8px 32px rgba(0,0,0,.35), 0 1px 0 rgba(255,255,255,.12) inset;display:flex;gap:6px;max-width:calc(100vw - 32px);overflow-x:auto; }
  .sp-lb-thumbs-wrap::-webkit-scrollbar { display:none; }
  .sp-lb-thumb { width:48px;height:36px;border-radius:8px;object-fit:cover;border:2px solid transparent;opacity:.5;cursor:pointer;transition:opacity .2s, border-color .2s, transform .2s;flex-shrink:0; }
  .sp-lb-thumb:hover { opacity:.8;transform:scale(1.06); }
  .sp-lb-thumb.on { border-color:#4db8a8;opacity:1;box-shadow:0 0 0 1px rgba(77,184,168,.4); }

  .om-backdrop { position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,rgba(4,10,28,.88) 0%,rgba(3,14,38,.92) 50%,rgba(2,10,26,.88) 100%);backdrop-filter:blur(24px) saturate(1.6);-webkit-backdrop-filter:blur(24px) saturate(1.6);display:flex;align-items:center;justify-content:center;padding:max(env(safe-area-inset-top,0px) + 16px, 16px) max(env(safe-area-inset-right,0px) + 16px, 16px) max(env(safe-area-inset-bottom,0px) + 16px, 16px) max(env(safe-area-inset-left,0px) + 16px, 16px);box-sizing:border-box; }
  .om-backdrop::before { content:'';position:absolute;inset:0;pointer-events:none;opacity:.04;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,1) 1px,transparent 0);background-size:26px 26px; }
  .om-orb { position:absolute;pointer-events:none;border-radius:50%; }
  .om-panel { position:relative;width:100%;max-width:560px;border-radius:28px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(40px) saturate(1.8) brightness(1.08);-webkit-backdrop-filter:blur(40px) saturate(1.8) brightness(1.08);box-shadow:0 32px 80px rgba(0,0,10,.55), 0 1px 0 rgba(255,255,255,.2) inset;overflow:visible;max-height:calc(100dvh - 40px);display:flex;flex-direction:column; }
  .om-panel::before { content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45) 50%,transparent);pointer-events:none;border-radius:28px 28px 0 0; }
  .om-close { position:absolute;top:14px;right:14px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(228,54,54,.5);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.22);box-shadow:0 4px 16px rgba(228,54,54,.3), 0 1px 0 rgba(255,255,255,.15) inset;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .2s; }
  .om-close:hover { background:rgba(228,54,54,.8);transform:scale(1.1); }
  .om-header { padding:20px 52px 16px 22px;border-bottom:1px solid rgba(255,255,255,.1);flex-shrink:0; }
  .om-title { display:flex;align-items:center;gap:9px;font-size:.95rem;font-weight:700;color:#fff;font-family:'Ubuntu',sans-serif; }
  .om-title-icon { width:32px;height:32px;border-radius:10px;background:rgba(13,122,104,.45);border:1px solid rgba(77,184,168,.35);display:flex;align-items:center;justify-content:center;color:#4db8a8;flex-shrink:0; }
  .om-body { padding:18px 22px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px; }
  .om-body::-webkit-scrollbar { width:3px; }
  .om-body::-webkit-scrollbar-thumb { background:rgba(77,184,168,.5);border-radius:3px; }
  .om-summary { border-radius:16px;padding:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);position:relative;overflow:hidden; }
  .om-summary::before { content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);pointer-events:none; }
  .om-sum-label { font-size:.6rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#4db8a8;margin-bottom:10px; }
  .om-sum-row { font-size:.84rem;color:rgba(255,255,255,.5);margin-bottom:3px; }
  .om-sum-val { color:#7dd4c8;font-weight:600; }
  .om-sum-note { font-size:.75rem;color:#f87171;margin-top:8px; }
  .om-check-row { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:background .2s; }
  .om-check-row:hover { background:rgba(255,255,255,.1); }
  .om-check-box { width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(77,184,168,.5);background:rgba(13,122,104,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s,border-color .2s; }
  .om-check-box.checked { background:rgba(13,122,104,.7);border-color:#4db8a8; }
  .om-check-label { font-size:.86rem;color:rgba(255,255,255,.75);flex:1; }
  .om-field-label { font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#4db8a8;margin-bottom:7px;display:block; }
  .om-textarea { width:100%;padding:11px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(8px);color:#fff;font-size:.87rem;font-family:'Ubuntu',sans-serif;resize:vertical;min-height:72px;outline:none;transition:border-color .2s,background .2s;box-sizing:border-box; }
  .om-textarea::placeholder { color:rgba(255,255,255,.3); }
  .om-textarea:focus { border-color:rgba(77,184,168,.5);background:rgba(255,255,255,.1); }
  .om-footer { padding:14px 22px 18px;border-top:1px solid rgba(255,255,255,.1);display:flex;gap:10px;justify-content:flex-end;flex-shrink:0; }
  .om-cancel { padding:10px 18px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.55);font-size:.86rem;font-family:'Ubuntu',sans-serif;cursor:pointer;transition:all .2s; }
  .om-cancel:hover { border-color:#f87171;color:#f87171;background:rgba(228,54,54,.12); }
  .om-wa-btn { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;font-weight:700;font-size:.88rem;font-family:'Ubuntu',sans-serif;padding:10px 20px;border-radius:12px;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(37,211,102,.28);transition:box-shadow .3s,transform .2s; }
  .om-wa-btn:hover { box-shadow:0 10px 28px rgba(37,211,102,.42);transform:translateY(-1px); }

  @media(max-width:640px){
    .om-panel { border-radius:22px;max-height:calc(100dvh - 32px); }
    .om-footer { flex-direction:column; }
    .om-wa-btn, .om-cancel { width:100%;justify-content:center; }
  }

  .sp-footer-bar { height:3px;background:linear-gradient(90deg,#0d7a68,#4db8a8);border-radius:2px;width:60px;margin:0 auto; }

  @supports (height: 100dvh) {
    .sp-lb-frame { max-height: calc(100dvh - 210px); }
  }

  @media(max-width:640px){
    .sp-cards { grid-template-columns:1fr; }
    .sp-header { padding:50px 16px 42px; }
    .sp-lb { padding:0; }
    .sp-lb-nav { width:38px;height:38px; }
    .sp-lb-nav-l { left:6px; }
    .sp-lb-nav-r { right:6px; }
    .sp-lb-frame { max-width:calc(100vw - 100px);max-height:calc(100dvh - 180px);border-radius:18px;padding:6px;transform:translateY(-28px); }
    .sp-lb-thumbs-wrap { bottom:max(env(safe-area-inset-bottom, 0px) + 20px, 20px); }
    .sp-lb-close, .sp-lb-counter { top:max(env(safe-area-inset-top, 0px) + 20px, 20px); }
    /* scroll-to-top sits above the iOS pill nav — smaller on mobile */
    .sp-scroll-top {
      width: 40px; height: 40px;
      bottom: max(env(safe-area-inset-bottom, 0px) + 88px, 88px);
      right: 14px;
    }
  }
`;

const AnimatedPrice = ({ price }: { price: number }) => {
  const [displayPrice, setDisplayPrice] = React.useState(0);
  React.useEffect(() => {
    const duration = 1500, frameDuration = 1000 / 60;
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
    <motion.span className="sp-price" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5 }}>
      {displayPrice.toLocaleString()} ₭
    </motion.span>
  );
};

/* ── LazyImage — blur placeholder → full quality fade in ── */
const LazyImage = ({
  src, alt, className, style, onClick,
}: {
  src: string; alt: string; className?: string;
  style?: React.CSSProperties; onClick?: () => void;
}) => {
  const [loaded, setLoaded] = React.useState(false);

  const blurSrc = src.includes("res.cloudinary.com")
    ? src.replace("/upload/", "/upload/w_20,e_blur:800,q_1,f_auto/")
    : src;

  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden", cursor: onClick ? "zoom-in" : undefined }} onClick={onClick}>
      <img
        src={blurSrc}
        aria-hidden
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%",
          objectFit:"contain", filter:"blur(14px)", transform:"scale(1.06)",
          opacity: loaded ? 0 : 1,
          transition:"opacity .5s ease",
          pointerEvents:"none",
        }}
      />
      {!loaded && (
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(90deg,rgba(13,122,104,.05) 25%,rgba(13,122,104,.12) 50%,rgba(13,122,104,.05) 75%)",
          backgroundSize:"200% 100%",
          animation:"spShimmer 1.4s linear infinite",
          pointerEvents:"none",
        }} />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, opacity: loaded ? 1 : 0, transition:"opacity .5s ease" }}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

// Success Modal - Same glass style as order modal
const SuccessModal = ({ isOpen, onClose, requestId }: { isOpen: boolean; onClose: () => void; requestId: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div className="om-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} onClick={onClose}>
      <div className="om-orb" style={{ width: 440, height: 440, top: "-18%", left: "-10%", background: "radial-gradient(circle,rgba(13,122,104,.5) 0%,transparent 60%)", filter: "blur(55px)" }} />
      <div className="om-orb" style={{ width: 340, height: 340, bottom: "-18%", right: "-6%", background: "radial-gradient(circle,rgba(77,184,168,.35) 0%,transparent 60%)", filter: "blur(48px)" }} />
      <div className="om-orb" style={{ width: 220, height: 220, top: "30%", right: "15%", background: "radial-gradient(circle,rgba(10,60,160,.3) 0%,transparent 60%)", filter: "blur(38px)" }} />
      <motion.div className="om-panel" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 20 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
        <button className="om-close" onClick={onClose} aria-label="Close"><IoClose size={14} /></button>
        <div className="om-header">
          <div className="om-title">
            <div className="om-title-icon">
              <FaCheck size={16} />
            </div>
            <span>Order Request Sent!</span>
          </div>
        </div>
        <div className="om-body">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
              <FaWhatsapp className="text-white text-2xl" />
            </div>
            <p className="text-white/80 mb-4 text-sm">
              Your order request has been opened in WhatsApp. Please click send to complete your order.
            </p>
            
            {/* Request ID with Copy Button */}
            <div className="om-summary mb-4">
              <div className="om-sum-label">REQUEST ID</div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <code className="text-sm font-mono text-[#4db8a8]">{requestId}</code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  title="Copy Request ID"
                >
                  {copied ? <FaCheck className="text-green-500" size={14} /> : <FaCopy className="text-white/80" size={14} />}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-400 mt-2">Copied to clipboard!</p>
              )}
            </div>

            <div className="om-sum-note text-xs">
              ⚠️ Please save this Request ID for tracking your order. You'll need it for any future inquiries.
            </div>
          </div>
        </div>
        <div className="om-footer">
          <button className="om-wa-btn" onClick={onClose} style={{ background: "linear-gradient(135deg,#0d7a68,#0a6455)", boxShadow: "0 6px 20px rgba(13,122,104,.32)" }}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [orderDetails, setOrderDetails] = React.useState<OrderDetails>({
    productId: "", productName: "", price: 0, quantity: 1,
    customerName: "", phone: "", address: "", notes: "", includeLogistics: false,
  });
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [selectedProductImages, setSelectedProductImages] = React.useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  
  // Success Modal State
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [currentRequestId, setCurrentRequestId] = React.useState("");

  // ── Scroll to top ──
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Generate Request ID
  const generateRequestId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setSelectedImageIndex(p => (p + 1) % selectedProductImages.length);
      if (e.key === "ArrowLeft") setSelectedImageIndex(p => (p - 1 + selectedProductImages.length) % selectedProductImages.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxOpen, selectedProductImages.length]);

  React.useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setEntries(data.products.map((p: any) => ({
            ID: p.ID || "N/A", Name: p.Name || "N/A", Type: p.Type || "-", Size: p.Size || "-",
            "Qty Bought": Number(p["Qty Bought"]) || 0,
            "Final Selling Price": Number(p["Final Selling Price"]) || 0,
            Status: p.Status || "", Notes: p.Notes || "",
            Image: p.Image || "", Phone: p.Phone || "", Logo: p.logo || "",
            Images: p.Images || {},
            Rating: Math.min(5, Math.max(0, Number(p.Rating) || 4)),
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [t]);

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setOrderDetails({
      productId: product.ID, productName: product.Name, price: product["Final Selling Price"], quantity: 1,
      customerName: "", phone: "", address: "", notes: "", includeLogistics: false
    });
    onOpen();
  };

  const handleOrderSubmit = () => {
    const requestId = generateRequestId();
    setCurrentRequestId(requestId);
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const message = `🛒 New Order Request | ${formattedDate} at ${formattedTime}\n\n📋 Request ID: ${requestId}\n\nProduct Details |\nID: OMS-00-00-${orderDetails.productId}\nName: ${orderDetails.productName}\nType: ${selectedProduct?.Type}\nSize: ${selectedProduct?.Size}\nPrice: ${orderDetails.price.toLocaleString()} ₭\nQuantity: ${orderDetails.quantity}\n${orderDetails.includeLogistics ? `Pickup: ${orderDetails.address}` : ''}\nAdditional Notes: ${orderDetails.notes || 'None'}\n\n💰 Payment Status: PENDING\nPlease complete payment to confirm your order.`;
    
    window.open(`https://wa.me/8562055058028?text=${encodeURIComponent(message)}`, '_blank');
    onOpenChange();
    setSuccessModalOpen(true);
  };

  // ── Cloudinary URL optimizer ──
  function optimizeCloudinaryUrl(url: string, width = 1200): string {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/f_auto,q_auto:best,w_${width},c_limit/`);
  }

  function getAllImages(product: Product): string[] {
    const images: string[] = [];
    const keys = ["image_meain", "image_1", "image_2", "image_3", "image_4", "image_5", "image_6", "image_7", "image_8", "image_9", "image_10", "image_11", "image_12", "image_13", "image_14", "image_15"] as const;
    if (product.Images) keys.forEach(k => { const u = product.Images?.[k]; if (u && u.trim() !== "") images.push(optimizeCloudinaryUrl(u.trim())); });
    if (images.length === 0) {
      if (product.Image?.trim()) images.push(optimizeCloudinaryUrl(product.Image.trim()));
      else if (product.Logo?.trim()) images.push(optimizeCloudinaryUrl(product.Logo.trim()));
      else images.push("https://res.cloudinary.com/deahgtn57/image/upload/v1757573548/omelett%27s/public/image/fly_h2va9e.png");
    }
    return images;
  }

  function handleNextImage(id: string, total: number) { setImageIndexes(p => ({ ...p, [id]: ((p[id] ?? 0) + 1) % total })); }
  function handlePrevImage(id: string, total: number) { setImageIndexes(p => ({ ...p, [id]: ((p[id] ?? 0) - 1 + total) % total })); }

  const filteredEntries = entries.filter(e =>
    Object.values(e).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="sp-root sp-page">
        <div className="sp-header">
          <div className="sp-header-grid" />
          <div className="sp-header-orb" style={{ width: 440, height: 440, top: "-25%", right: "8%", background: "radial-gradient(circle,rgba(13,122,104,.28) 0%,transparent 70%)" }} />
          <div className="sp-header-orb" style={{ width: 280, height: 280, bottom: "-35%", left: "4%", background: "radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%)" }} />
          <h1>Omelette<em>'</em>s</h1>
          <p className="sp-header-sub">{t("premium_airplane_models") || "Premium Model Aircraft • Collectors & Enthusiasts"}</p>
          <div className="sp-header-pill"><span className="sp-pill-dot" />✈ Collection Store</div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="sp-search-wrap">
            <div className="sp-search">
              <div className="sp-search-glass">
                <FiSearch size={17} className="sp-search-icon" />
                <input type="text" placeholder={t("search") || "Search airplane models..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                {searchTerm && (
                  <button className="sp-search-clear" onClick={() => setSearchTerm("")} aria-label="Clear search"><IoClose size={13} /></button>
                )}
              </div>
            </div>
          </div>

          <Loading isLoading={loading} fullScreen={true} message="Loading ..." />

          {!loading && filteredEntries.length === 0 && (
            <div className="sp-empty">
              <div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: .35 }}>✈</div>
              <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>{t("no_results_found") || "No results found"}</p>
              <p style={{ fontSize: ".85rem" }}>Try a different search term</p>
            </div>
          )}

          {!loading && filteredEntries.length > 0 && (
            <p className="sp-count">{filteredEntries.length} model{filteredEntries.length !== 1 ? "s" : ""} found</p>
          )}

          {!loading && filteredEntries.length > 0 && (
            <div className="sp-cards">
              {filteredEntries.map((entry, idx) => {
                const images = getAllImages(entry);
                const curIdx = imageIndexes[entry.ID] ?? 0;
                return (
                  <motion.div key={entry.ID} className="sp-card" style={{ animationDelay: `${idx * 0.055}s` }} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}>
                    <div className="sp-img-zone" onClick={() => { setSelectedProductImages(images); setSelectedImageIndex(curIdx); setLightboxOpen(true); }}>
                      <div className="sp-img-blur" style={{ backgroundImage: `url(${images[curIdx]})` }} />
                      <div className="sp-img-dim" />
                      <LazyImage
                        src={images[curIdx]}
                        alt={`${entry.Name} ${curIdx + 1}`}
                        className="sp-img-main"
                        style={{ position: "relative", zIndex: 2 }}
                      />
                      {entry.Status && <div className="sp-status">{entry.Status}</div>}
                      {images.length > 1 && (
                        <>
                          <button className="sp-nav sp-nav-l" onClick={e => { e.stopPropagation(); handlePrevImage(entry.ID, images.length); }}><AiOutlineLeft size={13} /></button>
                          <button className="sp-nav sp-nav-r" onClick={e => { e.stopPropagation(); handleNextImage(entry.ID, images.length); }}><AiOutlineRight size={13} /></button>
                          <div className="sp-img-dots">
                            {images.slice(0, 8).map((_, i) => (
                              <button key={i} className={`sp-dot${i === curIdx ? " on" : ""}`} onClick={e => { e.stopPropagation(); setImageIndexes(p => ({ ...p, [entry.ID]: i })); }} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="sp-body">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                        <h3 className="sp-name">{entry.Name}</h3>
                        <AnimatedPrice price={entry["Final Selling Price"]} />
                      </div>
                      <div className="sp-stars">
                        {[...Array(5)].map((_, i) => <FaStar key={i} size={13} style={{ color: i < (entry.Rating || 0) ? "#f59e0b" : "rgba(0,0,0,.18)" }} />)}
                        <span className="sp-star-count">({entry.Rating || 0}/5)</span>
                      </div>
                      <div className="sp-meta">
                        <p>{t("id")}: <span>OMS-00-00-{entry.ID}</span></p>
                        <p>{t("type")}: <span>{entry.Type}</span></p>
                        <p>{t("size")}: <span>{entry.Size}</span></p>
                        <p>{t("quantity")}: <span>{entry["Qty Bought"]}</span></p>
                      </div>
                      <button className="sp-cta" onClick={() => openOrderModal(entry)}>
                        <AiOutlineShoppingCart size={18} />
                        <span className="hidden sm:inline">{t("shop_now") || "Order Now"}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && <div style={{ paddingBottom: 44, display: "flex", justifyContent: "center" }}><div className="sp-footer-bar" /></div>}
        </div>
      </div>

      {/* ── Scroll to top button ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="sp-scroll-top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 16, scale: .8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: .8 }}
            transition={{ duration: .28, ease: [.22, 1, .36, 1] }}
          >
            <AiOutlineArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Order Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="om-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} onClick={onOpenChange}>
            <div className="om-orb" style={{ width: 440, height: 440, top: "-18%", left: "-10%", background: "radial-gradient(circle,rgba(13,122,104,.5) 0%,transparent 60%)", filter: "blur(55px)" }} />
            <div className="om-orb" style={{ width: 340, height: 340, bottom: "-18%", right: "-6%", background: "radial-gradient(circle,rgba(77,184,168,.35) 0%,transparent 60%)", filter: "blur(48px)" }} />
            <div className="om-orb" style={{ width: 220, height: 220, top: "30%", right: "15%", background: "radial-gradient(circle,rgba(10,60,160,.3) 0%,transparent 60%)", filter: "blur(38px)" }} />
            <motion.div className="om-panel" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 20 }} transition={{ duration: .28, ease: [.22, 1, .36, 1] }}>
              <button className="om-close" onClick={onOpenChange} aria-label="Close"><IoClose size={14} /></button>
              <div className="om-header">
                <div className="om-title">
                  <div className="om-title-icon"><HiShoppingCart size={16} /></div>
                  <span>{t("models")} · {selectedProduct?.Name}</span>
                </div>
              </div>
              <div className="om-body">
                <div className="om-summary">
                  <div className="om-sum-label">{t("order_summary")}</div>
                  {([
                    [t("id"), `OMS-00-00-${selectedProduct?.ID}`],
                    [t("name"), selectedProduct?.Name],
                    [t("size"), selectedProduct?.Size],
                    [t("type"), selectedProduct?.Type],
                    [t("price"), `${selectedProduct?.["Final Selling Price"].toLocaleString()} ₭`],
                  ] as [string, string | undefined][]).map(([label, val], i) => (
                    <div key={i} className="om-sum-row">{label}: <span className="om-sum-val">{val}</span></div>
                  ))}
                  {orderDetails.includeLogistics && <div className="om-sum-row">{t("time_label")}: <span className="om-sum-val">{orderDetails.address}</span></div>}
                  <div className="om-sum-note">*{t("free_logistics_info")}</div>
                </div>
                <div className="om-check-row" onClick={() => setOrderDetails({ ...orderDetails, includeLogistics: !orderDetails.includeLogistics })}>
                  <div className={`om-check-box${orderDetails.includeLogistics ? " checked" : ""}`}>
                    {orderDetails.includeLogistics && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span className="om-check-label">{t("i_will_pick_up")}</span>
                  <FaTruck style={{ color: "#4db8a8", flexShrink: 0 }} size={14} />
                </div>
                {orderDetails.includeLogistics && (
                  <div>
                    <label className="om-field-label">{t("location-text") || "Pickup Time / Location"}</label>
                    <textarea className="om-textarea" placeholder={t("pickup_time_instruction") || "Enter the time you will pick up yourself"} value={orderDetails.address} onChange={e => setOrderDetails({ ...orderDetails, address: e.target.value })} rows={3} />
                  </div>
                )}
                <div>
                  <label className="om-field-label">{t("additional_notes") || "Additional Notes (Optional)"}</label>
                  <textarea className="om-textarea" placeholder={t("any_special_requests") || "Any special requests or notes..."} value={orderDetails.notes} onChange={e => setOrderDetails({ ...orderDetails, notes: e.target.value })} rows={2} />
                </div>
              </div>
              <div className="om-footer">
                <button className="om-cancel" onClick={onOpenChange}>Cancel</button>
                <button className="om-wa-btn" onClick={handleOrderSubmit}><FaWhatsapp size={16} /> Send via WhatsApp</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success Modal (Same style as order modal) ── */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        requestId={currentRequestId}
      />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div className="sp-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} onClick={() => setLightboxOpen(false)}>
            <div className="sp-lb-orb" style={{ width: 500, height: 500, top: "-15%", left: "-8%", background: "radial-gradient(circle,rgba(13,122,104,.4) 0%,transparent 60%)", filter: "blur(60px)" }} />
            <div className="sp-lb-orb" style={{ width: 380, height: 380, bottom: "-20%", right: "-5%", background: "radial-gradient(circle,rgba(77,184,168,.28) 0%,transparent 60%)", filter: "blur(50px)" }} />
            <div className="sp-lb-orb" style={{ width: 260, height: 260, top: "30%", right: "20%", background: "radial-gradient(circle,rgba(10,60,160,.3) 0%,transparent 60%)", filter: "blur(44px)" }} />
            <button className="sp-lb-close" onClick={e => { e.stopPropagation(); setLightboxOpen(false); }} aria-label="Close"><IoClose size={18} /></button>
            {selectedProductImages.length > 1 && <div className="sp-lb-counter">{selectedImageIndex + 1} / {selectedProductImages.length}</div>}
            {selectedProductImages.length > 1 && (
              <>
                <button className="sp-lb-nav sp-lb-nav-l" onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => (p - 1 + selectedProductImages.length) % selectedProductImages.length); }} aria-label="Previous"><AiOutlineLeft size={20} /></button>
                <button className="sp-lb-nav sp-lb-nav-r" onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => (p + 1) % selectedProductImages.length); }} aria-label="Next"><AiOutlineRight size={20} /></button>
              </>
            )}
            <motion.div className="sp-lb-frame" onClick={e => e.stopPropagation()} key={selectedImageIndex} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .2 }}>
              <img className="sp-lb-img" src={selectedProductImages[selectedImageIndex]} alt={`Fullscreen view ${selectedImageIndex + 1}`} />
            </motion.div>
            {selectedProductImages.length > 1 && (
              <div className="sp-lb-thumbs-wrap" onClick={e => e.stopPropagation()}>
                {selectedProductImages.map((src, i) => (
                  <img key={i} src={src} className={`sp-lb-thumb${i === selectedImageIndex ? " on" : ""}`} onClick={() => setSelectedImageIndex(i)} alt={`thumb ${i + 1}`} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
}