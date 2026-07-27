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
  AiOutlineGift, 
  AiOutlineCheck, 
  AiOutlineSound,
  AiOutlineMuted,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
  AiOutlinePause,
  AiOutlineDownload,
} from "react-icons/ai";
import { FaPlay } from "react-icons/fa6";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

interface Product {
  ID: string;
  Name: string;
  Images?: { image_meain?: string | null };
}

interface TikTokVideo {
  id: number;
  url: string;
  title: string;
  likes: number;
  liked: boolean;
}

const AIRLINES = [
  { id:"thai",name:"Thai Airways",country:"Thailand",desc:"Thailand's flag carrier, known for its graceful service and iconic purple-gold livery across Asia and beyond.",logo:"https://res.cloudinary.com/deahgtn57/image/upload/v1749979001/omelett%27s/public/c919/thai_yomquy.png",plane:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/115_mwwmjj.png",scale:"1:200",length:"34 cm",edition:"Limited" },
  { id:"emirates",name:"Emirates",country:"UAE",desc:"Dubai's world-renowned airline — synonymous with luxury, the A380, and connecting 150+ destinations globally.",logo:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978995/omelett%27s/public/c919/emirates_vpql4a.png",plane:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/103_qxckbi.png",scale:"1:200",length:"36 cm",edition:"Premium" },
  { id:"qatar",name:"Qatar Airways",country:"Qatar",desc:"Award-winning airline of Qatar, celebrated for its five-star onboard experience and deep maroon livery.",logo:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978999/omelett%27s/public/c919/Qatar-Airways-Logo_p6p1ud.png",plane:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/105_xitts5.png",scale:"1:200",length:"33 cm",edition:"Collector" },
  { id:"lao",name:"Lao Airlines",country:"Laos",desc:"Lao PDR's national carrier, connecting Southeast Asia with warm Lao hospitality at 30,000 feet.",logo:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978996/omelett%27s/public/c919/logo-laoairlines_rmrpmm.png",plane:"https://res.cloudinary.com/deahgtn57/image/upload/v1749979263/omelett%27s/public/c919/109_sqz5zm.png",scale:"1:200",length:"30 cm",edition:"Special" },
  { id:"comac",name:"Comac C919",country:"China",desc:"China's first domestically produced narrow-body jet — a landmark milestone in commercial aviation history.",logo:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978995/omelett%27s/public/c919/Comac-Logo-768x432_jsuohq.png",plane:"https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/104_kukfrn.png",scale:"1:200",length:"32 cm",edition:"Historic" },
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --p:#0d7a68;--p2:#0a6455;--a:#4db8a8;--a2:#7dd4c8;--r:#E43636;
  --bg:#ffffff;--bg2:#f7faf9;--bg3:#eef5f3;
  --tx:#1a2e2a;--tx2:#3d5c55;--tx3:#6b8f86;
  --bd:rgba(13,122,104,.12);--cd:#ffffff;
  --glass:rgba(255,255,255,.8);
  --sh:0 4px 24px rgba(0,0,0,.06);--sh2:0 12px 40px rgba(0,0,0,.08);
}
.dark{
  --bg:#0a1210;--bg2:#0e1a17;--bg3:#12221d;
  --tx:#e8f5f1;--tx2:#9dbcb4;--tx3:#6b8f86;
  --bd:rgba(77,184,168,.12);--cd:rgba(255,255,255,.04);
  --glass:rgba(255,255,255,.06);
  --sh:0 4px 24px rgba(0,0,0,.2);--sh2:0 12px 40px rgba(0,0,0,.3);
}
*,*::before,*::after{box-sizing:border-box;margin:0}
.ix,.ix *{font-family:'Noto Sans Lao','Inter',-apple-system,sans-serif}

@keyframes shim{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes drift{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes glow{0%,100%{opacity:.06}50%{opacity:.15}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:none}}
@keyframes slideR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes ken{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
@keyframes modalPop{from{opacity:0;transform:scale(.94) translateY(14px)}to{opacity:1;transform:none}}
@keyframes barGlow{0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes shimmerGold{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(1deg)}}
@keyframes orbPulse{0%,100%{opacity:.06}50%{opacity:.15}}
@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes pulseRing{0%{transform:scale(0.95);opacity:0.5}50%{transform:scale(1);opacity:1}100%{transform:scale(0.95);opacity:0.5}}
@keyframes heartBurst{0%{transform:scale(1)}25%{transform:scale(1.4)}50%{transform:scale(0.9)}75%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes floatHeart{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(0);opacity:0}}
@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}

.shim{background:linear-gradient(120deg,var(--p),var(--a2) 40%,var(--p));background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shim 4s linear infinite}
.dark .shim{background:linear-gradient(120deg,#fff,var(--a2) 40%,#fff);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shim 4s linear infinite}

/* ═══ HERO ═══ */
.hro{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;background:var(--bg)}
.hro::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 50% 30%,rgba(13,122,104,.06) 0%,transparent 70%)}
.dark .hro::before{background:radial-gradient(ellipse 80% 60% at 50% 30%,rgba(13,122,104,.15) 0%,transparent 70%)}
.dark .hro{background:linear-gradient(170deg,#060e0c 0%,#0a1814 50%,#060e0c 100%)}

.hro-mesh{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(13,122,104,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(13,122,104,.04) 1px,transparent 1px);background-size:72px 72px}
.dark .hro-mesh{background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)}

.hro-orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px);animation:orbPulse 6s ease-in-out infinite}
.hro-ring{position:absolute;border-radius:50%;border:1px solid rgba(13,122,104,.07);pointer-events:none;animation:spin 50s linear infinite}

.hro-scan-line{position:relative;height:1px;max-width:400px;margin:0 auto 24px;background:var(--bd);overflow:hidden}
.hro-scan-line::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,var(--a),transparent);animation:scan 3s linear infinite}

.hro-fade{position:absolute;bottom:0;left:0;right:0;height:120px;background:linear-gradient(to bottom,transparent,var(--bg));pointer-events:none}

/* ═══ TIKTOK VIDEO CAROUSEL ═══ */
.tiktok-carousel{position:relative;border-radius:20px;overflow:hidden;background:#000;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.08);aspect-ratio:9/16;max-width:320px;width:100%}
.tiktok-carousel:fullscreen {
  max-width: 100vw !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  aspect-ratio: auto !important;
  width: 100vw !important;
  height: 100vh !important;
}
.tiktok-carousel:fullscreen .tiktok-video-wrapper {
  width: 100vw !important;
  height: 100vh !important;
}
.tiktok-carousel:fullscreen .tiktok-video {
  object-fit: contain !important;
}
.tiktok-video-wrapper{position:relative;width:100%;height:100%;overflow:hidden}
.tiktok-video{width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:9/16}
.tiktok-overlay{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.7) 100%)}
.tiktok-gradient-top{position:absolute;top:0;left:0;right:0;height:50%;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.2) 0%,transparent 100%)}
.tiktok-progress{position:absolute;bottom:64px;left:0;right:0;height:3px;background:rgba(255,255,255,.2);z-index:15}
.tiktok-progress-bar{height:100%;background:linear-gradient(90deg,var(--p),var(--a));transition:width .1s linear;border-radius:0 2px 2px 0}
.tiktok-dots{position:absolute;top:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:20;pointer-events:auto;flex-wrap:wrap;justify-content:center;max-width:80%}
.tiktok-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.3);border:none;padding:0;cursor:pointer;transition:all .3s}
.tiktok-dot.active{background:#fff;width:20px;border-radius:3px}

/* ===== iOS FROSTED GLASS CONTROLS - MATCHING FOOTER ===== */
.tiktok-controls-bottom {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 20;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2px;
  padding: 6px 8px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(50px) saturate(2.2) brightness(1.15);
  -webkit-backdrop-filter: blur(50px) saturate(2.2) brightness(1.15);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 1px 3px rgba(0,0,0,.04),
    0 8px 24px rgba(0,0,0,.08),
    0 0 0 0.5px rgba(0,0,0,.03),
    0 1px 0 rgba(255,255,255,.85) inset;
}

.tiktok-controls-bottom::before {
  content: '';
  position: absolute;
  top: 0; left: 12%; right: 12%; height: 0.5px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.9) 50%, transparent);
  border-radius: 24px;
  pointer-events: none;
}

.tiktok-controls-bottom::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 100%);
  pointer-events: none;
  z-index: -1;
}

.dark .tiktok-controls-bottom {
  background: rgba(12, 22, 19, 0.55);
  backdrop-filter: blur(50px) saturate(2) brightness(0.85);
  -webkit-backdrop-filter: blur(50px) saturate(2) brightness(0.85);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 1px 3px rgba(0,0,0,.15),
    0 8px 28px rgba(0,0,0,.35),
    0 0 0 0.5px rgba(255,255,255,.03),
    0 1px 0 rgba(255,255,255,.04) inset;
}
.dark .tiktok-controls-bottom::before {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.06) 50%, transparent);
}
.dark .tiktok-controls-bottom::after {
  background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, transparent 100%);
}

/* ── Control Items ── */
.tiktok-control-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 3px 4px;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(.34,1.56,.64,1);
  -webkit-tap-highlight-color: transparent;
  background: transparent;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  min-width: 32px;
}
.tiktok-control-item:active { transform: scale(0.9); }
.tiktok-control-item.active {
  background: rgba(13, 122, 104, 0.1);
}
.dark .tiktok-control-item.active {
  background: rgba(13, 122, 104, 0.22);
}

.tiktok-control-item .icon-wrap {
  width: 32px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px;
  transition: background 0.2s, transform 0.22s cubic-bezier(.34,1.56,.64,1);
}
.tiktok-control-item.active .icon-wrap {
  background: rgba(13, 122, 104, .12);
  transform: translateY(-1px) scale(1.05);
}
.dark .tiktok-control-item.active .icon-wrap {
  background: rgba(77, 184, 168, .18);
}

.tiktok-control-item .icon {
  display: flex;
  transition: color 0.2s;
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}
.tiktok-control-item.active .icon { color: #0d7a68; }
.dark .tiktok-control-item .icon { color: rgba(255, 255, 255, 0.4); }
.dark .tiktok-control-item.active .icon { color: #4db8a8; }

.tiktok-control-item .label {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.35);
  transition: color 0.2s, font-weight 0.15s;
}
.tiktok-control-item.active .label {
  color: #0d7a68;
  font-weight: 700;
}
.dark .tiktok-control-item .label { color: rgba(255, 255, 255, 0.3); }
.dark .tiktok-control-item.active .label { color: #4db8a8; font-weight: 700; }

/* Play button slightly larger */
.tiktok-play-btn .icon-wrap { width: 36px; height: 30px; }
.tiktok-play-btn .icon { font-size: 18px; }

/* Spacer */
.tiktok-spacer { flex: 1; }

/* TikTok Side Actions */
.tiktok-actions{position:absolute;right:10px;bottom:100px;display:flex;flex-direction:column;gap:14px;z-index:20;pointer-events:auto}
.tiktok-action-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;color:#fff;cursor:pointer;transition:all .3s;padding:3px;position:relative}
.tiktok-action-btn .icon-wrap{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);box-shadow:0 4px 16px rgba(0,0,0,.15)}
.tiktok-action-btn:hover .icon-wrap{background:rgba(255,255,255,.25);transform:scale(1.08)}
.tiktok-action-btn:active .icon-wrap{transform:scale(0.92)}
.tiktok-action-btn .count{font-size:10px;font-weight:600;letter-spacing:.3px;color:rgba(255,255,255,.8);text-shadow:0 2px 8px rgba(0,0,0,.3)}

.tiktok-action-btn.like-btn .icon-wrap{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.1)}
.tiktok-action-btn.like-btn:hover .icon-wrap{background:rgba(255,255,255,.2)}
.tiktok-action-btn.like-btn .icon-wrap.liked{background:rgba(13,122,104,.85);border-color:#0d7a68;box-shadow:0 0 24px rgba(13,122,104,.3);animation:heartBurst .4s ease}
.tiktok-action-btn.like-btn .icon-wrap.liked .like-icon{animation:heartBurst .4s ease;display:inline-block;color:#fff}
.tiktok-action-btn.like-btn .count.liked{color:#0d7a68}

.tiktok-action-btn.share-btn .icon-wrap{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.1)}
.tiktok-action-btn.share-btn:hover .icon-wrap{background:rgba(255,255,255,.2)}
.tiktok-share-tooltip{position:absolute;bottom:100%;right:50%;transform:translateX(50%);background:rgba(0,0,0,.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:#fff;padding:4px 12px;border-radius:8px;font-size:10px;white-space:nowrap;margin-bottom:8px;animation:slideUp .3s ease;border:1px solid rgba(255,255,255,.08)}

.tiktok-action-btn .float-hearts{position:absolute;pointer-events:none}
.tiktok-action-btn .float-heart{position:absolute;color:#0d7a68;font-size:18px;animation:floatHeart 1s ease-out forwards}

.tiktok-info{position:absolute;bottom:82px;left:14px;right:60px;z-index:20;pointer-events:none}
.tiktok-info-title{color:#fff;font-size:13px;font-weight:700;text-shadow:0 2px 12px rgba(0,0,0,.6);margin-bottom:3px;display:flex;align-items:center;gap:6px}
.tiktok-info-title .verified{color:var(--p);font-size:11px;text-shadow:0 2px 8px rgba(0,0,0,.3)}
.tiktok-info-sub{color:rgba(255,255,255,.6);font-size:10px;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.tiktok-info-sub span{margin:0 4px}

/* section */
.sec{position:relative;padding:clamp(56px,9vw,88px) 0;background:var(--bg);transition:background .3s}
.sec-alt{background:var(--bg2)}
.sec-grad{background:var(--bg)}
.dark .sec-grad{background:radial-gradient(ellipse 70% 50% at 30% 40%,rgba(13,122,104,.12) 0%,transparent 60%),radial-gradient(ellipse 55% 60% at 80% 70%,rgba(8,61,51,.08) 0%,transparent 55%),var(--bg)}

/* typography */
.h1{font-family:'Inter','Noto Sans Lao',sans-serif;font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;line-height:.9;letter-spacing:-2px;color:var(--tx)}
.h2{font-family:'Inter','Noto Sans Lao',sans-serif;font-size:clamp(1.5rem,3.5vw,2.4rem);font-weight:700;color:var(--tx);line-height:1.12;letter-spacing:-.5px}
.tag{font-size:.58rem;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:var(--p);display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(13,122,104,.06);border:1px solid rgba(13,122,104,.1)}
.dark .tag{color:var(--a);background:rgba(77,184,168,.08);border-color:rgba(77,184,168,.15)}
.bar{height:3px;width:36px;border-radius:2px;background:linear-gradient(90deg,var(--p),var(--a))}
.body{font-size:.9rem;color:var(--tx3);line-height:1.7;max-width:480px}

/* pill (hero) */
.hero-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:20px;background:rgba(13,122,104,.08);border:1px solid rgba(13,122,104,.15);color:var(--p);font-size:.62rem;font-weight:700;letter-spacing:2px;text-transform:uppercase}
.dark .hero-pill{background:rgba(13,122,104,.14);border-color:rgba(13,122,104,.28);color:var(--a2)}

/* stat */
.st{font-size:clamp(1.4rem,3vw,2.2rem);font-weight:800;line-height:1;color:var(--tx)}

/* card */
.cd{background:var(--cd);border:1px solid var(--bd);border-radius:18px;overflow:hidden;box-shadow:var(--sh);transition:all .32s cubic-bezier(.22,1,.36,1)}
.cd:hover{transform:translateY(-5px);box-shadow:var(--sh2);border-color:rgba(13,122,104,.18)}

/* slide */
.stk{display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:6px;padding-right:16px}
.stk::-webkit-scrollbar{display:none}
.stk>*{scroll-snap-align:start;flex-shrink:0}

/* arrows */
.nav-btn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;border:1.5px solid var(--bd);background:var(--cd);color:var(--tx3)}
.nav-btn:hover{background:var(--p);color:#fff;border-color:var(--p)}

/* display overlay */
.dsp-card .dsp-ov{opacity:0;transition:opacity .3s}
.dsp-card:hover .dsp-ov{opacity:1}

/* btn */
.btn-main{display:inline-flex;align-items:center;gap:9px;padding:13px 30px;border-radius:50px;border:none;cursor:pointer;font-family:inherit;font-size:.88rem;font-weight:600;color:#fff;background:linear-gradient(135deg,var(--p),var(--p2));box-shadow:0 6px 24px rgba(13,122,104,.3);transition:all .25s;text-decoration:none;letter-spacing:.2px}
.btn-main:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(13,122,104,.45)}

/* corners */
.corner{position:absolute;width:18px;height:18px;border-color:rgba(13,122,104,.4);border-style:solid;pointer-events:none;z-index:5}

/* quality icon */
.q-ico{width:42px;height:42px;border-radius:12px;background:var(--p);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 14px rgba(13,122,104,.2)}

/* airline modal */
.al-bk{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.5);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:16px}
.dark .al-bk{background:rgba(0,0,0,.7)}
.al-m{position:relative;width:100%;max-width:880px;background:var(--bg);border:1px solid var(--bd);border-radius:20px;overflow:hidden;box-shadow:var(--sh2);animation:modalPop .32s cubic-bezier(.22,1,.36,1) both}
.dark .al-m{background:var(--bg2)}
.al-m-top{height:3px;background:linear-gradient(90deg,transparent,var(--p) 20%,var(--a) 50%,var(--p) 80%,transparent);background-size:300% auto;animation:barGlow 3s linear infinite}
.al-m-hdr{padding:22px 26px 0;display:flex;justify-content:space-between;align-items:flex-start}
.al-m-ey{font-size:.58rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--p);margin-bottom:3px}
.dark .al-m-ey{color:var(--a)}
.al-m-tt{font-size:1.4rem;font-weight:800;color:var(--tx);letter-spacing:-.4px}
.al-m-tt span{color:var(--p)}.dark .al-m-tt span{color:var(--a)}
.al-m-x{width:30px;height:30px;border-radius:50%;background:rgba(228,54,54,.06);border:1px solid rgba(228,54,54,.15);color:var(--tx3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:all .25s;flex-shrink:0}
.al-m-x:hover{background:#E43636;border-color:#E43636;color:#fff;transform:rotate(90deg)}
.al-tabs{display:flex;gap:7px;padding:16px 26px 0;overflow-x:auto;scrollbar-width:none}
.al-tabs::-webkit-scrollbar{display:none}
.al-tab{display:flex;align-items:center;gap:7px;padding:5px 11px;border-radius:10px;border:1px solid var(--bd);background:transparent;cursor:pointer;transition:all .25s;white-space:nowrap;flex-shrink:0}
.al-tab:hover{border-color:rgba(13,122,104,.25);background:rgba(13,122,104,.04)}
.al-tab.on{border-color:var(--p);background:rgba(13,122,104,.08)}
.dark .al-tab.on{background:rgba(13,122,104,.16);border-color:var(--a)}
.al-tab img{height:18px;max-width:40px;object-fit:contain}
.al-tab span{font-size:.68rem;font-weight:600;color:var(--tx3);transition:color .2s}
.al-tab:hover span,.al-tab.on span{color:var(--p)}
.dark .al-tab:hover span,.dark .al-tab.on span{color:#fff}
.al-body{display:grid;grid-template-columns:1fr 1.15fr;gap:22px;padding:18px 26px 22px;align-items:center;min-height:240px}
.al-logo{height:40px;max-width:160px;object-fit:contain;margin-bottom:10px}
.al-nm{font-size:1.2rem;font-weight:800;color:var(--tx);margin-bottom:2px}
.al-co{font-size:.6rem;letter-spacing:2px;text-transform:uppercase;color:var(--p);font-weight:600;opacity:.7;margin-bottom:10px}
.dark .al-co{color:var(--a)}
.al-desc{font-size:.84rem;line-height:1.55;color:var(--tx3);margin-bottom:16px;max-width:270px}
.al-sp-tag{font-size:.56rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--p);opacity:.6;display:flex;align-items:center;gap:10px;margin-bottom:10px}
.dark .al-sp-tag{color:var(--a)}
.al-sp-tag::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--bd),transparent)}
.al-sps{display:flex;gap:20px}
.al-sp-v{font-size:1rem;font-weight:800;color:var(--p);line-height:1.2;margin-bottom:2px}
.dark .al-sp-v{color:var(--a)}
.al-sp-l{font-size:.56rem;letter-spacing:1px;text-transform:uppercase;color:var(--tx3);font-weight:500}
.al-plane{position:relative;border-radius:14px;overflow:hidden;background:var(--bg3);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;min-height:200px;padding:16px}
.dark .al-plane{background:rgba(13,122,104,.04)}
.al-plane-g{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 60%,rgba(13,122,104,.05) 0%,transparent 70%);pointer-events:none}
.dark .al-plane-g{background:radial-gradient(ellipse 70% 55% at 50% 60%,rgba(13,122,104,.1) 0%,transparent 70%)}
.al-plane img{width:100%;max-height:180px;object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 6px 14px rgba(0,0,0,.08));animation:slideR .5s cubic-bezier(.22,1,.36,1) both}
.dark .al-plane img{filter:drop-shadow(0 6px 14px rgba(0,0,0,.25))}
.al-dots{display:flex;justify-content:center;gap:6px;padding:12px 0 18px;border-top:1px solid var(--bd);margin:0 26px}
.al-dot{height:5px;width:5px;border-radius:3px;background:var(--bd);cursor:pointer;border:none;padding:0;transition:all .25s}
.al-dot.on{background:var(--p);width:22px}.dark .al-dot.on{background:var(--a)}

/* ═══ PROMO CARDS - NEW 4 CARD SECTION ═══ */
.promo-cards-section {
  margin-top: 40px;
}

.promo-cards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.promo-cards-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--tx);
  margin-top: 4px;
}

.promo-cards-subtitle {
  font-size: 0.85rem;
  color: var(--tx3);
  margin-top: 2px;
}

.promo-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.promo-card {
  position: relative;
  background: var(--cd);
  border: 1px solid var(--bd);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  box-shadow: var(--sh);
}

.promo-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--sh2);
  border-color: rgba(13, 122, 104, 0.25);
}

.promo-card-image {
  position: relative;
  width: 100%;
  padding-top: 75%;
  overflow: hidden;
  background: var(--bg3);
}

.promo-card-image img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.promo-card:hover .promo-card-image img {
  transform: translate(-50%, -50%) scale(1.05);
}

.promo-card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--p);
  color: #fff;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 16px;
  z-index: 2;
}

.promo-card-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  z-index: 2;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.promo-card-content {
  padding: 14px 16px 16px;
}

.promo-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--tx);
  margin-bottom: 1px;
}

.promo-card-subtitle {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--p);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.promo-card-desc {
  font-size: 0.75rem;
  color: var(--tx3);
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promo-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 14px;
  border-radius: 16px;
  border: 1.5px solid var(--p);
  background: transparent;
  color: var(--p);
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  text-decoration: none;
}

.promo-card-btn:hover {
  background: var(--p);
  color: #fff;
  transform: translateX(3px);
}

.promo-card-btn.download-btn {
  background: var(--p);
  color: #fff;
  border-color: var(--p);
}

.promo-card-btn.download-btn:hover {
  background: var(--p2);
  transform: scale(1.02);
  border-color: var(--p2);
}

/* ── Promo Modal ── */
.promo-modal-backdrop{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.85);backdrop-filter:blur(16px);display:flex;align-items:center;justify-content:center;padding:20px}
.promo-modal-content{position:relative;max-width:900px;width:100%;max-height:90vh;overflow:auto}
.promo-modal-content img{width:100%;height:auto;border-radius:16px;box-shadow:0 40px 80px rgba(0,0,0,.5)}
.promo-modal-close{position:absolute;top:-48px;right:0;background:none;border:none;color:rgba(255,255,255,.5);font-size:28px;cursor:pointer;transition:color .3s;padding:8px}
.promo-modal-close:hover{color:#fff}
.promo-modal-hint{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.5);backdrop-filter:blur(8px);padding:6px 18px;border-radius:20px;color:rgba(255,255,255,.4);font-size:.7rem;border:1px solid rgba(255,255,255,.05)}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .promo-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

@media (max-width: 640px) {
  .promo-cards-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .promo-cards-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .promo-cards-title {
    font-size: 0.95rem;
  }
  .promo-cards-subtitle {
    font-size: 0.75rem;
  }
  .promo-card-content {
    padding: 10px 12px 12px;
  }
  .promo-card-title {
    font-size: 0.75rem;
  }
  .promo-card-desc {
    font-size: 0.65rem;
    -webkit-line-clamp: 2;
  }
  .promo-card-btn {
    font-size: 0.55rem;
    padding: 4px 10px;
  }
  .promo-card-badge {
    font-size: 0.4rem;
    padding: 2px 8px;
    top: 6px;
    right: 6px;
  }
  .promo-card-icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
    top: 6px;
    left: 6px;
  }
}

.tiktok-section-wrapper {
  padding-bottom: clamp(80px, 15vh, 120px);
}

@media(max-width:640px){
  .h1{letter-spacing:-1px}
  .hro{min-height:auto}
  .sec{padding:clamp(44px,8vw,72px) 0}
  .al-body{grid-template-columns:1fr;gap:14px;padding:14px 18px 18px}
  .al-m-hdr{padding:16px 18px 0}
  .al-tabs{padding:12px 18px 0}
  .al-dots{margin:0 18px}
  .al-plane{min-height:160px}
  .al-desc{max-width:100%}
  .tiktok-carousel{max-width:100% !important;border-radius:12px}
  .tiktok-actions{right:6px;gap:10px}
  .tiktok-action-btn .icon-wrap{width:34px;height:34px;font-size:14px}
  .tiktok-info{left:10px;right:50px;bottom:74px}
  .tiktok-info-title{font-size:11px}
  .tiktok-info-sub{font-size:9px}
  .tiktok-controls-bottom{padding:4px 6px;gap:1px;bottom:8px;left:8px;right:8px;border-radius:18px}
  .tiktok-control-item{padding:2px 2px;min-width:26px}
  .tiktok-control-item .icon-wrap{width:24px;height:20px}
  .tiktok-control-item .icon{font-size:12px}
  .tiktok-control-item .label{font-size:6px}
  .tiktok-play-btn .icon-wrap{width:28px;height:24px}
  .tiktok-play-btn .icon{font-size:14px}
  .tiktok-dots{gap:4px;top:8px}
  .tiktok-dot{width:4px;height:4px}
  .tiktok-dot.active{width:14px}
  .tiktok-progress{bottom:56px}
  .tiktok-section-wrapper {
    padding-bottom: clamp(100px, 20vh, 140px);
  }
}

@media(min-width:641px) and (max-width:1024px) {
  .tiktok-section-wrapper {
    padding-bottom: clamp(60px, 10vh, 100px);
  }
}
`;

const Corners = () => (
  <>
    {(["tl","tr","bl","br"] as const).map(c => (
      <div key={c} className="corner" style={{
        top:c[0]==="t"?8:"auto", bottom:c[0]==="b"?8:"auto",
        left:c[1]==="l"?8:"auto", right:c[1]==="r"?8:"auto",
        borderWidth:c==="tl"?"2px 0 0 2px":c==="tr"?"2px 2px 0 0":c==="bl"?"0 0 2px 2px":"0 2px 2px 0",
      }} />
    ))}
  </>
);

const ani = (d = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: .55, ease: "easeOut" as const, delay: d },
});

export default function IndexPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number|null>(null);
  const [counters, setCounters] = useState({ collectors:0, models:0, sat:0 });
  const [selImg, setSelImg] = useState<number|null>(null);
  const [modalOn, setModalOn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [alModal, setAlModal] = useState(false);
  const [alIdx, setAlIdx] = useState(0);
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [floatingHearts, setFloatingHearts] = useState<{id: number; x: number; y: number}[]>([]);
  const [shareTooltip, setShareTooltip] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const prodRef = useRef<HTMLDivElement>(null!);
  const dispRef = useRef<HTMLDivElement>(null!);
  const videoRef = useRef<HTMLVideoElement>(null);
  const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

  // ============ PROMO CARDS DATA ============
  const promoCards = [
    {
      id: 1,
      title: "Aircraft Body",
      subtitle: "Precision 1:200 Scale",
      desc: "Meticulously crafted aircraft body with authentic airline livery and exceptional detail.",
      icon: "✈️",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/115_mwwmjj.png",
      badge: "Premium",
      link: "/oms-store"
    },
    {
      id: 2,
      title: "Landing Gear",
      subtitle: "Engineering Excellence",
      desc: "Fully detailed landing gear with realistic struts, wheels, and hydraulic components.",
      icon: "🛬",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/103_qxckbi.png",
      badge: "Detailed",
      link: "/oms-store"
    },
    {
      id: 3,
      title: "Display Stand",
      subtitle: "Elegant Presentation",
      desc: "Premium acrylic display stand with secure mounting for perfect presentation.",
      icon: "🏛️",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1779621029/omelett%27s/public/promotion_post/84_tana7u.png",
      badge: "Premium",
      link: "/oms-store"
    },
    {
      id: 4,
      title: "Download Details",
      subtitle: "Digital Collection",
      desc: "Download your aircraft model certificate, assembly guide, and exclusive content.",
      icon: "📥",
      image: "https://res.cloudinary.com/deahgtn57/image/upload/v1769280086/omelett%27s/public/index%20page/WhatsApp_Image_2025-07-12_at_20.39.20_3f364bf1_dzua9j.jpg",
      badge: "Digital",
      isDownload: true,
      downloadUrl: "https://res.cloudinary.com/deahgtn57/image/upload/v1779621029/omelett%27s/public/promotion_post/84_tana7u.png"
    },
  ];

  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideo[]>([
    {
      id: 1,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868187/omelett%27s/public/video/Initial_Scene_-_2026-06-05_202606051358_do1wke.mp4",
      title: "Premium Aircraft Models 1",
      likes: 1247,
      liked: false,
    },
    {
      id: 2,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868191/omelett%27s/public/video/Untitled_Scene_06-06_08_20_39_202606061539_nr4hs5.mp4",
      title: "Premium Aircraft Models 2",
      likes: 980,
      liked: false,
    },
    {
      id: 3,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868188/omelett%27s/public/video/Initial_Scene_-_2026-06-07_202606071613_vdnalm.mp4",
      title: "Premium Aircraft Models 3",
      likes: 756,
      liked: false,
    },
    {
      id: 4,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868174/omelett%27s/public/video/Boeing_777_lifts_off_night_202606121842_ns7bwf.mp4",
      title: "Premium Aircraft Models 4",
      likes: 1532,
      liked: false,
    },
    {
      id: 5,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868184/omelett%27s/public/video/Initial_Scene_-_2026-06-04_202606042354_ob6ohj.mp4",
      title: "Premium Aircraft Models 5",
      likes: 642,
      liked: false,
    },
    {
      id: 6,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868181/omelett%27s/public/video/Initial_Scene_-_2026-06-01_202606011937_it9htk.mp4",
      title: "Premium Aircraft Models 6",
      likes: 843,
      liked: false,
    },
    {
      id: 7,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868178/omelett%27s/public/video/COMAC_C919_Lao_Airlines_China_202606140148_g8dpm3.mp4",
      title: "Premium Aircraft Models 7",
      likes: 1098,
      liked: false,
    },
    {
      id: 8,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868177/omelett%27s/public/video/Aircraft_ceremony_at_internation__202606140137_f9u5zv.mp4",
      title: "Premium Aircraft Models 8",
      likes: 532,
      liked: false,
    },
    {
      id: 9,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868176/omelett%27s/public/video/Aircraft_rolling_out_of_factory_202606140147_y0hi6o.mp4",
      title: "Premium Aircraft Models 9",
      likes: 1290,
      liked: false,
    },
    {
      id: 10,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868175/omelett%27s/public/video/COMAC_C919_flying_above_Laos_202606140137_y3qkc8.mp4",
      title: "Premium Aircraft Models 10",
      likes: 721,
      liked: false,
    },
    {
      id: 11,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868175/omelett%27s/public/video/Airbus_A380_taxiing_airport_night_202606111645_x6vn78.mp4",
      title: "Premium Aircraft Models 11",
      likes: 864,
      liked: false,
    },
    {
      id: 12,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868172/omelett%27s/public/video/Airbus_A380_landing_at_night_202606111633_qd9es0.mp4",
      title: "Premium Aircraft Models 12",
      likes: 944,
      liked: false,
    },
    {
      id: 13,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868171/omelett%27s/public/video/3_202606082244_bpmky7.mp4",
      title: "Premium Aircraft Models 13",
      likes: 1102,
      liked: false,
    },
    {
      id: 14,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868169/omelett%27s/public/video/4_202606082244_i8j6l7.mp4",
      title: "Premium Aircraft Models 14",
      likes: 675,
      liked: false,
    },
    {
      id: 15,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781868166/omelett%27s/public/video/7_202606082244_c28wmj.mp4",
      title: "Premium Aircraft Models 15",
      likes: 1375,
      liked: false,
    },
    {
      id: 16,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781874747/omelett%27s/public/video/LANEXANG_AIRWAYS_Boeing_777_MAX_202606071809_cktsoa.mp4",
      title: "Premium Aircraft Models 16",
      likes: 1375,
      liked: false,
    },
    {
      id: 17,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781874746/omelett%27s/public/video/Boeing_777_MAX_parked_airport_202606071726_202606071809_kgwl6c.mp4",
      title: "Premium Aircraft Models 17",
      likes: 1375,
      liked: false,
    },
    {
      id: 18,
      url: "https://res.cloudinary.com/deahgtn57/video/upload/v1781874747/omelett%27s/public/video/Boeing_777_MAX_assembly_factory_202606071809_craxjw.mp4",
      title: "Premium Aircraft Models 18",
      likes: 1375,
      liked: false,
    },
  ]);

  const carousel = [
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
    "https://res.cloudinary.com/deahgtn57/image/upload/v1784974773/omelett%27s/public/index%20page/WhatsApp_Image_2026-07-25_at_4.54.48_PM_8_zlmeki.jpg",
    
  ];

  const displays = [
    { title:"Executive Office Desk",desc:"Perfect for CEO offices and corporate executives",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768752540/omelett%27s/public/index%20page/Gemini_Generated_Image_7iobqh7iobqh7iob_icvb7s.png",feats:["Creates professional impression","Excellent conversation starter","Enhances executive decor"] },
    { title:"Hotel Lobby Display",desc:"Creates an impressive first impression for luxury hotels",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768752541/omelett%27s/public/index%20page/Gemini_Generated_Image_siz6n9siz6n9siz6_1_otwyyi.png",feats:["Impressive entrance display","Luxury ambiance enhancer","Guest conversation piece"] },
    { title:"Restaurant & Café Tables",desc:"Enhances dining experience with aviation elegance",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_9yzxph9yzxph9yzx_qddg29.png",feats:["Unique table centerpiece","Enhances dining atmosphere","Memorable customer experience"] },
    { title:"Home Library & Study",desc:"Adds sophistication to personal collections",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768898745/omelett%27s/public/index%20page/Gemini_Generated_Image_5x190o5x190o5x19_jsfors.png",feats:["Personal collection showcase","Intellectual ambiance","Conversation starter"] },
    { title:"Conference Room Centerpiece",desc:"Elevates business meetings and presentations",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768899031/omelett%27s/public/index%20page/Gemini_Generated_Image_nq65ulnq65ulnq65_wggw70.png",feats:["Professional meeting ambiance","Inspires innovation","Project success symbol"] },
    { title:"Luxury Gift",desc:"The perfect premium gift for aviation enthusiasts",img:"https://res.cloudinary.com/deahgtn57/image/upload/v1768899543/omelett%27s/public/index%20page/Gemini_Generated_Image_s2daccs2daccs2da_vgtpw1.png",feats:["Premium gift packaging","Elegant presentation","Memorable for any occasion"] },
  ];

  const quality = [
    { title:"Precision Engineering", desc:"0.01mm tolerance in manufacturing" },
    { title:"Premium Materials", desc:"Aerospace-grade metals and finishes" },
    { title:"Artisan Detailing", desc:"Hand-finished by master craftsmen" },
    { title:"Certified Authenticity", desc:"Documented provenance for each piece" },
  ];

  useEffect(() => {
    const handleFullscreenChange = () => {};
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // fetch products
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API_URL}?t=${Date.now()}`);
        const d = await r.json();
        if (d.success && Array.isArray(d.products))
          setProducts(d.products.slice(0, 6).map((p: any) => ({ ID: p.ID, Name: p.Name, Images: p.Images || {} })));
      } catch { setProducts([]); }
      finally { setLoading(false); }
    })();
  }, [API_URL]);

  // counters
  useEffect(() => {
    const t = setTimeout(() => {
      [{ k:"collectors" as const,end:1000,inc:25,ms:18 },{ k:"models" as const,end:50,inc:1,ms:30 },{ k:"sat" as const,end:98,inc:2,ms:22 }]
        .forEach(({ k,end,inc,ms }) => { let v=0; const id=setInterval(() => { v+=inc; if(v>=end){setCounters(p=>({...p,[k]:end}));clearInterval(id);}else setCounters(p=>({...p,[k]:v})); },ms); });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Hero carousel auto-slide
  useEffect(() => { 
    const id = setInterval(() => setSlide(p => (p + 1) % carousel.length), 4000); 
    return () => clearInterval(id); 
  }, []);

  // Video navigation functions
  const goToPreviousVideo = useCallback(() => {
    const prevIndex = (currentVideoIndex - 1 + tiktokVideos.length) % tiktokVideos.length;
    setCurrentVideoIndex(prevIndex);
    const video = videoRef.current;
    if (video) {
      setIsVideoLoading(true);
      video.load();
      setTimeout(() => {
        video.play().catch(() => {});
      }, 100);
      setVideoProgress(0);
    }
  }, [currentVideoIndex, tiktokVideos.length]);

  const goToNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % tiktokVideos.length;
    setCurrentVideoIndex(nextIndex);
    const video = videoRef.current;
    if (video) {
      setIsVideoLoading(true);
      video.load();
      setTimeout(() => {
        video.play().catch(() => {});
      }, 100);
      setVideoProgress(0);
    }
  }, [currentVideoIndex, tiktokVideos.length]);

  // ============ VIDEO AUTO-PLAY SEQUENCE ============
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        setVideoProgress((videoElement.currentTime / videoElement.duration) * 100);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsVideoLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsVideoLoading(true);
    };

    const handleCanPlay = () => {
      setIsVideoLoading(false);
    };

    const handleEnded = () => {
      setVideoProgress(0);
      if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
      autoAdvanceTimeout = setTimeout(() => {
        const nextIndex = (currentVideoIndex + 1) % tiktokVideos.length;
        setCurrentVideoIndex(nextIndex);
        if (videoElement) {
          setIsVideoLoading(true);
          videoElement.load();
          setTimeout(() => {
            videoElement.play().catch(() => {});
          }, 100);
          setVideoProgress(0);
        }
      }, 800);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('ended', handleEnded);

    videoElement.muted = true;
    videoElement.play().catch(() => {});

    let hideTimeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleInteraction = () => resetTimer();
    videoElement.addEventListener('click', handleInteraction);
    videoElement.addEventListener('touchstart', handleInteraction);
    resetTimer();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(videoElement);
    
    return () => {
      observer.disconnect();
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('click', handleInteraction);
      videoElement.removeEventListener('touchstart', handleInteraction);
      clearTimeout(hideTimeout);
      if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
      videoElement.pause();
    };
  }, [currentVideoIndex, tiktokVideos.length]);

  // modal handlers
  const openDsp = (i: number) => { setSelImg(i); setModalOn(true); document.body.style.overflow="hidden"; };
  const closeDsp = useCallback(() => { setModalOn(false); setSelImg(null); document.body.style.overflow=""; }, []);
  const nextDsp = useCallback(() => setSelImg(p => p!==null?(p+1)%displays.length:0), []);
  const prevDsp = useCallback(() => setSelImg(p => p!==null?(p-1+displays.length)%displays.length:0), []);
  const openAl = useCallback((i: number) => { setAlIdx(i); setAlModal(true); document.body.style.overflow="hidden"; }, []);
  const closeAl = useCallback(() => { setAlModal(false); document.body.style.overflow=""; }, []);

  // Video control functions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const restartVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsSoundOn(!video.muted);
  }, [isSoundOn]);

  const handleLike = useCallback((index: number) => {
    setTiktokVideos(prev => {
      const newVideos = [...prev];
      const video = newVideos[index];
      if (video.liked) {
        video.likes -= 1;
      } else {
        video.likes += 1;
        const heartId = Date.now();
        setFloatingHearts(prev => [...prev, { id: heartId, x: Math.random() * 40 + 30, y: Math.random() * 40 + 30 }]);
        setTimeout(() => {
          setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
        }, 1000);
      }
      video.liked = !video.liked;
      return newVideos;
    });
  }, []);

  const handleShare = useCallback(async () => {
    const video = tiktokVideos[currentVideoIndex];
    const shareData = {
      title: video.title,
      text: `Check out this amazing video! ${video.title}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setShareTooltip(true);
        setTimeout(() => setShareTooltip(false), 2000);
      }
    } catch (error) {
      // User cancelled or error
    }
  }, [currentVideoIndex, tiktokVideos]);

  const goToVideo = useCallback((index: number) => {
    if (index === currentVideoIndex) return;
    setCurrentVideoIndex(index);
    const video = videoRef.current;
    if (video) {
      setIsVideoLoading(true);
      video.load();
      setTimeout(() => {
        video.play().catch(() => {});
      }, 100);
      setVideoProgress(0);
    }
  }, [currentVideoIndex]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (modalOn) { if(e.key==="Escape")closeDsp(); if(e.key==="ArrowRight")nextDsp(); if(e.key==="ArrowLeft")prevDsp(); }
      if (alModal) { if(e.key==="Escape")closeAl(); if(e.key==="ArrowRight")setAlIdx(p=>(p+1)%AIRLINES.length); if(e.key==="ArrowLeft")setAlIdx(p=>(p-1+AIRLINES.length)%AIRLINES.length); }
      if (promoModalOpen) { if(e.key==="Escape")setPromoModalOpen(false); }
      if (!modalOn && !alModal && !promoModalOpen) {
        if (e.key === ' ') {
          e.preventDefault();
          togglePlay();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNextVideo();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPreviousVideo();
        }
      }
    };
    window.addEventListener("keydown",h);
    return () => window.removeEventListener("keydown",h);
  }, [modalOn,alModal,closeDsp,nextDsp,prevDsp,closeAl,promoModalOpen,togglePlay,goToNextVideo,goToPreviousVideo]);

  // body lock
  useEffect(() => {
    document.body.style.overflow = modalOn||alModal||promoModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow=""; };
  }, [modalOn,alModal,promoModalOpen]);

  const scroll = (ref: React.RefObject<HTMLDivElement>, dir: "l"|"r") => {
    ref.current?.scrollBy({ left: dir==="l" ? -(ref.current.clientWidth*.75) : (ref.current.clientWidth*.75), behavior:"smooth" });
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Helmet>
        <title>{t("home.title")}</title>
        <meta name="description" content={t("home.description")} />
      </Helmet>

      <div className="ix">
        {/* ═══ HERO ═══ */}
        <section className="hro">
          <div className="hro-mesh" />
          <div className="hro-orb" style={{ width:450,height:450,top:"5%",right:"8%",background:"radial-gradient(circle,rgba(13,122,104,.12) 0%,transparent 70%)" }} />
          <div className="hro-orb" style={{ width:300,height:300,bottom:"12%",left:"5%",background:"radial-gradient(circle,rgba(77,184,168,.08) 0%,transparent 70%)",animationDelay:"3s" }} />
          <div className="hro-ring hidden lg:block" style={{ width:500,height:500,top:"50%",right:"-40px",transform:"translateY(-50%)" }}>
            <div style={{ position:"absolute",width:360,height:360,top:"50%",left:"50%",transform:"translate(-50%,-50%)",border:"1px dashed rgba(13,122,104,.04)",borderRadius:"50%" }} />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
            <div className="hro-scan-line" />
            
            {/* ═══ HERO IMAGE CAROUSEL ═══ */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden mb-8"
              style={{ 
                aspectRatio: "16/9",
                background: "rgba(0,0,0,.2)",
                border: "1px solid rgba(255,255,255,.06)",
                boxShadow: "0 20px 60px rgba(0,0,0,.4)"
              }}
            >
              {carousel.map((img, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ 
                    opacity: index === slide ? 1 : 0,
                    scale: index === slide ? 1 : 1.05
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ zIndex: index === slide ? 1 : 0 }}
                >
                  <Image 
                    isBlurred 
                    className="w-full h-full object-cover"
                    src={img} 
                    alt={`Product ${index + 1}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>
              ))}
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {carousel.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSlide(index)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: index === slide ? "28px" : "8px",
                      height: "8px",
                      background: index === slide ? "var(--p)" : "rgba(255,255,255,.3)",
                      border: "none",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
              
              <Corners />
            </motion.div>

            {/* Hero Content */}
            <div className="text-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hero-pill mx-auto mb-4"
                style={{ display: "inline-flex" }}
              >
                ✦ {t("premiumCollection") || "Premium Collection"} ✦
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h1"
              >
                <span className="shim">Omelette</span>
                <span style={{ WebkitTextFillColor:"var(--r)" }}>'</span>
                <span className="shim">s</span>
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="bar" />
              </motion.div>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="body"
                style={{ margin:"16px auto 24px", textAlign:"center" }}
              >
                Premium 1:200 scale aircraft models. Crafted with precision for collectors and aviation enthusiasts.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/oms-store" className="btn-main" style={{ borderRadius:8 }}>
                  {t("viewModels") || "View Collection"} <AiOutlineRight size={17} />
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex justify-center gap-8 md:gap-12 mt-10"
              >
                {[
                  { val:`${counters.collectors}+`, lbl:t("collectors") || "Collectors" },
                  { val:`${counters.models}+`, lbl:t("models") || "Models" },
                  { val:`${counters.sat}%`, lbl:t("satisfaction") || "Satisfaction" },
                ].map((s,i) => (
                  <div key={i} className="text-center">
                    <div className="st">{s.val}</div>
                    <div style={{ fontSize:".6rem",letterSpacing:"2px",textTransform:"uppercase",color:"var(--tx3)",marginTop:2 }}>{s.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="hro-fade" />
        </section>

        {/* ═══ CURATED EXCELLENCE ═══ */}
        <section className="sec sec-alt">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
              <motion.div {...ani()}>
                <span className="tag">{t("featuredCollection")}</span>
                <h2 className="h2 mt-3">{t("curatedExcellence")}</h2>
                <div className="bar mt-2" />
                <p className="body mt-1">{t("discoverPremiumSelection")}</p>
              </motion.div>
              <motion.div {...ani(.1)} className="flex items-center gap-3 flex-shrink-0">
                <button className="nav-btn" onClick={() => scroll(prodRef,"l")}><AiOutlineLeft size={16} /></button>
                <button className="nav-btn" onClick={() => scroll(prodRef,"r")} style={{ background:"var(--p)",color:"#fff",borderColor:"var(--p)" }}><AiOutlineRight size={16} /></button>
                <Link href="/oms-store" className="hidden sm:inline-flex items-center gap-1" style={{ color:"var(--p)",fontWeight:600,fontSize:".84rem",textDecoration:"none" }}>
                  {t("viewFullCollection")} <AiOutlineRight size={13} />
                </Link>
              </motion.div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <AirplaneLoading isLoading fullScreen={false} message="Loading models..." />
              </div>
            ) : (
              <motion.div {...ani(.12)} ref={prodRef} className="stk">
                {products.map((p,i) => (
                  <div key={p.ID} className="cd" style={{ width:"clamp(240px,72vw,300px)" }}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                    <div className="relative overflow-hidden" style={{ aspectRatio:"1/1" }}>
                      <Image isBlurred className="w-full h-full object-cover"
                        style={{ transform:hovered===i?"scale(1.05)":"scale(1)",transition:"transform .5s cubic-bezier(.22,1,.36,1)" }}
                        src={p.Images?.image_meain || "/placeholder.jpg"} alt={p.Name} />
                      <div className="absolute inset-0 flex items-end justify-center pb-5" style={{ background:hovered===i?"linear-gradient(to top,rgba(4,11,9,.65),transparent 55%)":"transparent",transition:"background .35s" }}>
                        {hovered===i && (
                          <Link href={`/product/${p.ID}`} style={{ background:"#fff",color:"var(--p)",padding:"7px 18px",borderRadius:50,fontWeight:600,fontSize:".78rem",textDecoration:"none",animation:"fadeUp .2s ease" }}>
                            {t("viewDetails")} →
                          </Link>
                        )}
                      </div>
                      <div className="absolute top-3 left-3" style={{ background:"var(--p)",color:"#fff",fontSize:".56rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"3px 9px",borderRadius:50 }}>
                        {t("aircraftModel")}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate" style={{ fontSize:".95rem",color:"var(--tx)" }}>{p.Name}</h3>
                      <p style={{ fontSize:".74rem",color:"var(--tx3)",marginBottom:8 }}>{t("premiumScaleModel")}</p>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize:".68rem",color:"#f59e0b" }}>★★★★★</span>
                        <span style={{ fontSize:".76rem",color:"var(--p)",fontWeight:700 }}>287,000K</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/oms-store" className="flex-shrink-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center"
                  style={{ width:"clamp(180px,18vw,220px)",background:"linear-gradient(135deg,var(--p),var(--p2))",minHeight:300,textDecoration:"none",color:"#fff",gap:10,padding:24,transition:"transform .3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="translateY(-5px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform="translateY(0)"}>
                  <div style={{ width:46,height:46,borderRadius:"50%",border:"2px solid rgba(255,255,255,.4)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <AiOutlineRight size={18} />
                  </div>
                  <span style={{ fontWeight:600,fontSize:".84rem",textAlign:"center",lineHeight:1.3 }}>{t("viewFullCollection")}</span>
                </Link>
              </motion.div>
            )}

            <div className="sm:hidden text-center mt-8">
              <Link href="/oms-store" className="btn-main" style={{ padding:"11px 26px" }}>
                {t("viewFullCollection")} <AiOutlineRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ PERFECT DISPLAY ═══ */}
        <section className="sec sec-grad relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
              <motion.div {...ani()}>
                <span className="tag">{t("perfectDisplay")}</span>
                <h2 className="h2 mt-3">{t("whereToDisplay")}</h2>
                <div className="bar mt-2" />
                <p className="body mt-1">{t("premiumAircraftModels")}</p>
              </motion.div>
              <motion.div {...ani(.1)} className="flex items-center gap-3 flex-shrink-0">
                <button className="nav-btn" onClick={() => scroll(dispRef,"l")}><AiOutlineLeft size={16} /></button>
                <button className="nav-btn" onClick={() => scroll(dispRef,"r")} style={{ background:"var(--p)",color:"#fff",borderColor:"var(--p)" }}><AiOutlineRight size={16} /></button>
              </motion.div>
            </div>

            <motion.div {...ani(.12)} ref={dispRef} className="stk">
              {displays.map((d,i) => (
                <div key={i} className="dsp-card cd cursor-pointer" style={{ width:"clamp(220px,68vw,280px)" }} onClick={() => openDsp(i)}>
                  <div className="relative overflow-hidden" style={{ aspectRatio:"1/1" }}>
                    <Image isBlurred className="w-full h-full object-cover" src={d.img} alt={d.title} />
                    <div className="dsp-ov absolute inset-0 flex items-center justify-center" style={{ background:"rgba(4,11,9,.45)",backdropFilter:"blur(2px)" }}>
                      <span style={{ background:"rgba(255,255,255,.92)",color:"var(--p)",fontWeight:700,fontSize:".68rem",letterSpacing:"1.5px",textTransform:"uppercase",padding:"6px 14px",borderRadius:50 }}>
                        {t("clickToView")||"View →"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3" style={{ width:24,height:24,borderRadius:"50%",background:"var(--p)",color:"#fff",fontWeight:700,fontSize:".64rem",display:"flex",alignItems:"center",justifyContent:"center" }}>{i+1}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate" style={{ fontSize:".92rem",color:"var(--tx)" }}>{t(d.title)}</h3>
                    <p style={{ fontSize:".72rem",color:"var(--tx3)",lineHeight:1.4 }}>{t(d.desc)}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ═══ NEW 4-CARD PROMOTION SECTION ═══ */}
            <motion.div 
              {...ani(.15)} 
              className="promo-cards-section"
            >
              <div className="promo-cards-header">
                <div>
                  <span className="tag">Premium Collection</span>
                  <h3 className="promo-cards-title">Every Detail Matters</h3>
                  <p className="promo-cards-subtitle">Discover what makes our aircraft models extraordinary</p>
                </div>
                <Link href="/oms-store" className="text-sm font-semibold text-[var(--p)] hover:opacity-80 transition-opacity flex items-center gap-1">
                  View All <AiOutlineRight size={14} />
                </Link>
              </div>

              <div className="promo-cards-grid">
                {promoCards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: card.id * 0.08 }}
                    viewport={{ once: true }}
                    className="promo-card"
                  >
                    <div className="promo-card-image">
                      <Image
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain"
                        style={{ padding: '12px' }}
                      />
                      <span className="promo-card-badge">{card.badge}</span>
                      <span className="promo-card-icon">{card.icon}</span>
                    </div>
                    <div className="promo-card-content">
                      <h4 className="promo-card-title">{card.title}</h4>
                      <p className="promo-card-subtitle">{card.subtitle}</p>
                      <p className="promo-card-desc">{card.desc}</p>
                      {card.isDownload ? (
                        <button 
                          className="promo-card-btn download-btn"
                          onClick={() => handleDownload(card.downloadUrl!)}
                        >
                          <AiOutlineDownload size={14} /> Download
                        </button>
                      ) : (
                        <Link href={card.link} className="promo-card-btn">
                          Learn More <AiOutlineRight size={14} />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CRAFTSMANSHIP - TIKTOK VIDEO ═══ */}
        <section className="sec sec-alt tiktok-section-wrapper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div {...ani()}>
                <span className="tag">{t("craftsmanship")}</span>
                <h2 className="h2 mt-3">{t("uncompromisingQuality")}</h2>
                <div className="bar mt-2" />
                <p className="body mt-1 mb-6">{t("eachModelIsTestament")}</p>

                <div className="flex flex-col gap-5">
                  {quality.map((f,i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="q-ico">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-0.5" style={{ fontSize:".92rem",color:"var(--tx)" }}>{t(f.title)}</h4>
                        <p style={{ fontSize:".8rem",color:"var(--tx3)" }}>{t(f.desc)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/about" className="mt-7 inline-flex items-center gap-2" style={{ color:"var(--p)",fontWeight:600,fontSize:".88rem",textDecoration:"none" }}>
                  {t("show_details")}
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              </motion.div>

              {/* TikTok Video */}
              <motion.div {...ani(.1)} className="flex justify-center">
                <div className="tiktok-carousel">
                  <div className="tiktok-video-wrapper">
                    <video
                      ref={videoRef}
                      className="tiktok-video"
                      playsInline
                      autoPlay
                      muted
                      key={currentVideoIndex}
                      poster="https://res.cloudinary.com/deahgtn57/image/upload/v1757573548/omelett%27s/public/image/fly_h2va9e.png"
                    >
                      <source 
                        src={tiktokVideos[currentVideoIndex].url} 
                        type="video/mp4" 
                      />
                      Your browser does not support the video tag.
                    </video>

                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                        <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}

                    <div className="tiktok-gradient-top" />
                    <div className="tiktok-overlay" />

                    <div className="tiktok-progress">
                      <div className="tiktok-progress-bar" style={{ width: `${videoProgress}%` }} />
                    </div>

                    {tiktokVideos.length > 1 && (
                      <div className="tiktok-dots">
                        {tiktokVideos.map((_, index) => (
                          <button
                            key={index}
                            className={`tiktok-dot ${currentVideoIndex === index ? 'active' : ''}`}
                            onClick={() => goToVideo(index)}
                          />
                        ))}
                      </div>
                    )}

                    <div className="tiktok-info">
                      <div className="tiktok-info-title">
                        ✈️ {tiktokVideos[currentVideoIndex].title}
                        <span className="verified">✓</span>
                      </div>
                      <div className="tiktok-info-sub">
                        Premium Quality <span>•</span> 1:200 Scale <span>•</span> #Aviation
                      </div>
                    </div>

                    {/* ===== CONTROLS - FOOTER STYLE (NO FULLSCREEN) ===== */}
                    <div className="tiktok-controls-bottom">
                      <button 
                        className="tiktok-control-item"
                        onClick={goToPreviousVideo}
                        aria-label="Previous video"
                      >
                        <span className="icon-wrap">
                          <span className="icon"><AiOutlineLeft size={18} /></span>
                        </span>
                        <span className="label">Prev</span>
                      </button>

                      <button 
                        className="tiktok-control-item tiktok-play-btn active"
                        onClick={togglePlay}
                      >
                        <span className="icon-wrap">
                          <span className="icon">
                            {isPlaying ? <AiOutlinePause size={20} /> : <FaPlay size={20} />}
                          </span>
                        </span>
                        <span className="label">{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>

                      <button 
                        className="tiktok-control-item"
                        onClick={goToNextVideo}
                        aria-label="Next video"
                      >
                        <span className="icon-wrap">
                          <span className="icon"><AiOutlineRight size={18} /></span>
                        </span>
                        <span className="label">Next</span>
                      </button>

                      <div className="tiktok-spacer" />

                      <button 
                        className="tiktok-control-item"
                        onClick={restartVideo}
                      >
                        <span className="icon-wrap">
                          <span className="icon">⟳</span>
                        </span>
                        <span className="label">Replay</span>
                      </button>

                      <button 
                        className={`tiktok-control-item ${isSoundOn ? 'active' : ''}`}
                        onClick={toggleSound}
                      >
                        <span className="icon-wrap">
                          <span className="icon">
                            {isSoundOn ? <AiOutlineSound size={16} /> : <AiOutlineMuted size={16} />}
                          </span>
                        </span>
                        <span className="label">{isSoundOn ? 'Sound' : 'Mute'}</span>
                      </button>
                    </div>

                    {/* Side Actions */}
                    <div className="tiktok-actions">
                      <button 
                        className="tiktok-action-btn like-btn"
                        onClick={() => handleLike(currentVideoIndex)}
                      >
                        <div className={`icon-wrap ${tiktokVideos[currentVideoIndex].liked ? 'liked' : ''}`}>
                          {tiktokVideos[currentVideoIndex].liked ? (
                            <AiFillHeart size={18} className="like-icon" />
                          ) : (
                            <AiOutlineHeart size={18} />
                          )}
                        </div>
                        <span className={`count ${tiktokVideos[currentVideoIndex].liked ? 'liked' : ''}`}>
                          {tiktokVideos[currentVideoIndex].likes.toLocaleString()}
                        </span>
                      </button>

                      <button 
                        className="tiktok-action-btn share-btn"
                        onClick={handleShare}
                        style={{ position: 'relative' }}
                      >
                        <div className="icon-wrap">
                          <AiOutlineShareAlt size={18} />
                        </div>
                        <span className="count">Share</span>
                        {shareTooltip && (
                          <div className="tiktok-share-tooltip">
                            Copied!
                          </div>
                        )}
                      </button>
                    </div>

                    {floatingHearts.map(heart => (
                      <div
                        key={heart.id}
                        style={{
                          position: 'absolute',
                          right: `${heart.x}px`,
                          bottom: `${heart.y}px`,
                          zIndex: 30,
                          pointerEvents: 'none',
                          fontSize: '20px',
                          color: '#0d7a68',
                          animation: 'floatHeart 1s ease-out forwards'
                        }}
                      >
                        <FaHeart size={22} color="#0d7a68" />
                      </div>
                    ))}
                  </div>

                  <Corners />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {modalOn && selImg !== null && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:"fixed",inset:0,zIndex:99999,background:"rgba(0,0,0,.85)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:12 }} onClick={closeDsp}>
            <motion.div initial={{ opacity:0,scale:.94,y:16 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:.94,y:16 }} transition={{ duration:.25 }}
              className="relative w-full overflow-hidden flex flex-col lg:flex-row" style={{ maxWidth:940,maxHeight:"calc(100vh - 24px)",background:"var(--bg)",borderRadius:18,border:"1px solid var(--bd)",boxShadow:"0 40px 100px rgba(0,0,0,.5)" }}
              onClick={e => e.stopPropagation()}>
              <button onClick={closeDsp} style={{ position:"absolute",top:12,right:12,zIndex:60,background:"#E43636",color:"#fff",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <AiOutlineClose size={13} />
              </button>
              <div style={{ position:"absolute",top:12,left:12,zIndex:60,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:".68rem",fontWeight:600,padding:"3px 10px",borderRadius:20 }}>
                {selImg+1} / {displays.length}
              </div>
              <button onClick={e => { e.stopPropagation(); prevDsp(); }} style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:60,background:"var(--bg)",border:"1px solid var(--bd)",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <AiOutlineLeft size={13} />
              </button>
              <button onClick={e => { e.stopPropagation(); nextDsp(); }} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",zIndex:60,background:"var(--bg)",border:"1px solid var(--bd)",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                <AiOutlineRight size={13} />
              </button>
              <div className="lg:w-1/2 flex items-center justify-center p-6" style={{ background:"var(--bg3)",minHeight:240 }}>
                <Image isBlurred className="w-full object-contain rounded-xl" style={{ maxHeight:"54vh" }} src={displays[selImg].img} alt={displays[selImg].title} />
              </div>
              <div className="lg:w-1/2 p-6 overflow-y-auto flex flex-col" style={{ maxHeight:"calc(100vh - 24px)" }}>
                <span style={{ display:"inline-block",background:"var(--p)",color:"#fff",fontSize:".6rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",padding:"3px 10px",borderRadius:50,marginBottom:12,alignSelf:"flex-start" }}>
                  {displays[selImg].title==="Luxury Gift"?t("premiumGift")||"Premium Gift":t("displaySetting")||"Display Setting"}
                </span>
                <h3 className="font-bold mb-2 leading-snug" style={{ fontSize:"clamp(1.2rem,2.8vw,1.7rem)",color:"var(--tx)" }}>{t(displays[selImg].title)}</h3>
                <p style={{ fontSize:".86rem",color:"var(--tx3)",lineHeight:1.6,marginBottom:16 }}>{t(displays[selImg].desc)}</p>
                <h4 style={{ fontSize:".64rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--p)",marginBottom:10 }}>{t("keyFeatures")||"Key Features"}</h4>
                <div className="flex flex-col gap-3 mb-5">
                  {displays[selImg].feats.map((f,i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div style={{ width:18,height:18,borderRadius:"50%",background:"var(--p)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                        <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span style={{ fontSize:".82rem",color:"var(--tx3)" }}>{t(f)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:"1px solid var(--bd)",paddingTop:12,marginTop:"auto" }}>
                  <p style={{ fontSize:".6rem",color:"var(--tx3)",opacity:.5,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:7 }}>{t("otherDisplaySettings")||"Other Settings"}</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {displays.map((d,i) => (
                      <button key={i} onClick={() => setSelImg(i)} style={{ padding:0,border:i===selImg?"2px solid var(--p)":"2px solid transparent",borderRadius:6,overflow:"hidden",cursor:"pointer",aspectRatio:"1/1",background:"none",transition:"all .2s" }}>
                        <Image className="w-full h-full object-cover" src={d.img} alt={d.title} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {promoModalOpen && (
          <motion.div 
            className="promo-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPromoModalOpen(false)}
          >
            <motion.div
              className="promo-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="promo-modal-close"
                onClick={() => setPromoModalOpen(false)}
              >
                ✕
              </button>
              <Image
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1779621029/omelett%27s/public/promotion_post/84_tana7u.png"
                alt={t("premiumGiftPackaging") || "Premium Gift Packaging"}
                className="rounded-xl"
              />
              <div className="promo-modal-hint">Click anywhere to close</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alModal && (
          <motion.div className="al-bk" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={closeAl}>
            <motion.div className="al-m" onClick={e => e.stopPropagation()} initial={{ opacity:0,scale:.94,y:14 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:.94,y:14 }}>
              <div className="al-m-top" />
              <div className="al-m-hdr">
                <div>
                  <div className="al-m-ey">✦ Aviation Collection ✦</div>
                  <div className="al-m-tt">Our&nbsp;<span>Scale Models</span></div>
                </div>
                <button className="al-m-x" onClick={closeAl}>×</button>
              </div>
              <div className="al-tabs">
                {AIRLINES.map((a,i) => (
                  <button key={a.id} className={`al-tab${alIdx===i?" on":""}`} onClick={() => setAlIdx(i)}>
                    <img src={a.logo} alt={a.name} />
                    <span>{a.name}</span>
                  </button>
                ))}
              </div>
              <div className="al-body">
                <div>
                  <img key={AIRLINES[alIdx].id+"-l"} src={AIRLINES[alIdx].logo} alt={AIRLINES[alIdx].name} className="al-logo" />
                  <div className="al-nm">{AIRLINES[alIdx].name}</div>
                  <div className="al-co">{AIRLINES[alIdx].country}</div>
                  <div className="al-desc">{AIRLINES[alIdx].desc}</div>
                  <div className="al-sp-tag">Model Specifications</div>
                  <div className="al-sps">
                    <div><div className="al-sp-v">{AIRLINES[alIdx].scale}</div><div className="al-sp-l">Scale</div></div>
                    <div><div className="al-sp-v">{AIRLINES[alIdx].length}</div><div className="al-sp-l">Length</div></div>
                    <div><div className="al-sp-v">{AIRLINES[alIdx].edition}</div><div className="al-sp-l">Edition</div></div>
                  </div>
                </div>
                <div className="al-plane">
                  <div className="al-plane-g" />
                  <img key={AIRLINES[alIdx].id+"-p"} src={AIRLINES[alIdx].plane} alt={AIRLINES[alIdx].name+" model"} />
                </div>
              </div>
              <div className="al-dots">
                {AIRLINES.map((_,i) => <button key={i} className={`al-dot${alIdx===i?" on":""}`} onClick={() => setAlIdx(i)} />)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DefaultLayout>
  );
}