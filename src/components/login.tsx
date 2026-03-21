import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import {
  FaEye, FaEyeSlash, FaLock, FaEnvelope,
  FaChevronDown, FaChevronUp, FaTimes,
  FaUserFriends, FaEnvelopeOpen,
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

const LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1774000744/omelett%27s/public/logo/ChatGPT_Image_Mar_13_2026_05_25_31_PM_yfp4b7.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Ubuntu', sans-serif; }

  /* ── page ── */
  .lp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 55% at 20% 30%, rgba(192,25,44,.28) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 75%, rgba(120,5,20,.35) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 65% 15%, rgba(160,15,30,.18) 0%, transparent 55%),
      linear-gradient(160deg, #0e0205 0%, #1a0008 40%, #120006 100%);
  }

  /* vivid paint orbs — these give glass something to blur over */
  .lp-orb {
    position: fixed; border-radius: 50%;
    pointer-events: none; filter: blur(70px);
  }

  /* dot grid — matches site style */
  .lp-grid {
    position: fixed; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(192,25,44,.13) 1px, transparent 1px);
    background-size: 30px 30px;
    mask-image: radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%);
  }

  /* subtle diagonal lines */
  .lp-lines {
    position: fixed; inset: 0; pointer-events: none; opacity: .07;
    background-image: repeating-linear-gradient(
      -45deg,
      rgba(192,25,44,.2) 0px, rgba(192,25,44,.2) 1px,
      transparent 1px, transparent 52px
    );
  }

  /* ── back / close button ── */
  .lp-back {
    position: fixed; z-index: 300;
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.12);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.18);
    color: rgba(255,255,255,.65); text-decoration: none;
    box-shadow: 0 4px 14px rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.1) inset;
    transition: background .2s, color .2s, transform .2s;
    font-size: 18px; font-weight: 300; line-height: 1;
    /* mobile: top-right */
    top: 18px; right: 18px; left: auto;
  }
  .lp-back:hover {
    background: rgba(192,25,44,.45);
    color: #fff; transform: scale(1.08);
    border-color: rgba(192,25,44,.5);
  }
  /* desktop: top-left */
  @media (min-width: 768px) {
    .lp-back { left: 18px; right: auto; }
  }
  /* show × on mobile, arrow on desktop */
  .lp-back-x      { display: flex; }
  .lp-back-arrow  { display: none; }
  @media (min-width: 768px) {
    .lp-back-x     { display: none; }
    .lp-back-arrow { display: flex; }
  }

  /* ── main glass card ── */
  .lp-card {
    position: relative; z-index: 10;
    width: 100%; max-width: 920px;
    margin: 0 20px;
    border-radius: 32px;
    display: flex;
    overflow: hidden;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.18);
    backdrop-filter: blur(48px) saturate(1.8) brightness(1.08);
    -webkit-backdrop-filter: blur(48px) saturate(1.8) brightness(1.08);
    box-shadow:
      0 40px 100px rgba(0,0,0,.55),
      0 1px 0 rgba(255,255,255,.2) inset,
      0 0 0 1px rgba(255,255,255,.05) inset;
  }
  /* top specular */
  .lp-card::before {
    content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.45) 50%, transparent);
    pointer-events: none; z-index: 2;
  }

  /* shimmer bar */
  .lp-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 3px; z-index: 3;
    background: linear-gradient(90deg, #c0192c, #e85566, #fff, #e85566, #c0192c);
    background-size: 300% auto;
    animation: shimmer 4s linear infinite;
  }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

  /* ── left branding pane ── */
  .lp-left {
    display: none;
    width: 42%; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 56px 40px;
    border-right: 1px solid rgba(255,255,255,.1);
    position: relative;
    background: rgba(192,25,44,.08);
  }
  @media (min-width: 768px) { .lp-left { display: flex; } }

  .lp-brand {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; gap: 20px; text-align: center;
  }

  /* logo frame */
  .lp-logo-frame {
    width: 172px; height: 172px; border-radius: 40px;
    background: rgba(192,25,44,.15);
    border: 1px solid rgba(192,25,44,.3);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    box-shadow:
      0 12px 44px rgba(192,25,44,.28),
      0 1px 0 rgba(255,255,255,.12) inset;
    animation: glowLogo 4s ease-in-out infinite;
  }
  @keyframes glowLogo {
    0%,100% { box-shadow: 0 12px 44px rgba(192,25,44,.22), 0 1px 0 rgba(255,255,255,.1) inset; }
    50%      { box-shadow: 0 18px 60px rgba(192,25,44,.42), 0 1px 0 rgba(255,255,255,.14) inset; }
  }
  .lp-logo-frame::before {
    content: ''; position: absolute; top: 0; left: 14%; right: 14%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
  }

  .lp-wordmark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem; font-weight: 600; line-height: 1;
    color: #fff; letter-spacing: 1px;
  }
  .lp-wordmark em { color: #E43636; font-style: italic; }

  .lp-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: .88rem; font-style: italic;
    color: rgba(255,180,180,.5); letter-spacing: 1.5px;
    margin-top: -8px;
  }

  .lp-sep {
    width: 40px; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(192,25,44,.7), transparent);
  }

  .lp-pill {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 16px; border-radius: 20px;
    background: rgba(192,25,44,.18);
    border: 1px solid rgba(192,25,44,.3);
    backdrop-filter: blur(8px);
    font-size: .63rem; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,160,160,.9);
  }
  .lp-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e85566; box-shadow: 0 0 6px #e85566;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }

  /* ── right form pane ── */
  .lp-right {
    flex: 1; padding: 52px 44px;
    display: flex; flex-direction: column; justify-content: center;
  }
  @media (max-width: 767px) { .lp-right { padding: 64px 28px 40px; } }

  /* mobile logo */
  .lp-mobile-top {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    margin-bottom: 32px;
  }
  @media (min-width: 768px) { .lp-mobile-top { display: none; } }
  .lp-mobile-logo {
    width: 68px; height: 68px; border-radius: 20px;
    background: rgba(192,25,44,.2);
    border: 1px solid rgba(192,25,44,.3);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 28px rgba(192,25,44,.28);
  }
  .lp-mobile-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600; color: #fff;
  }
  .lp-mobile-name em { color: #E43636; font-style: italic; }

  .lp-title { font-size: 1.45rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .lp-sub   { font-size: .78rem; color: rgba(255,255,255,.32); margin-bottom: 26px; }

  /* notice */
  .lp-notice {
    display: flex; align-items: flex-start; gap: 9px;
    padding: 11px 14px; border-radius: 12px;
    background: rgba(192,25,44,.1);
    border: 1px solid rgba(192,25,44,.22);
    border-left: 3px solid #c0192c;
    margin-bottom: 22px;
  }
  .lp-notice-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e85566; flex-shrink: 0; margin-top: 4px;
    box-shadow: 0 0 5px #e85566;
    animation: blink 2.5s ease-in-out infinite;
  }
  .lp-notice p { font-size: .75rem; color: rgba(255,255,255,.42); line-height: 1.55; }

  /* field */
  .lp-field { margin-bottom: 16px; }
  .lp-label {
    display: block; font-size: .62rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: rgba(255,160,160,.65); margin-bottom: 7px;
  }
  .lp-input-wrap { position: relative; }
  .lp-icon {
    position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
    color: rgba(192,25,44,.45); font-size: 13px;
    display: flex; align-items: center; pointer-events: none;
  }
  .lp-input {
    width: 100%; padding: 12px 14px 12px 38px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.07);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    color: #fff; font-size: .87rem;
    outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    box-shadow: 0 1px 0 rgba(255,255,255,.06) inset;
  }
  .lp-input::placeholder { color: rgba(255,255,255,.18); }
  .lp-input:focus {
    border-color: rgba(192,25,44,.55);
    background: rgba(255,255,255,.1);
    box-shadow: 0 0 0 3px rgba(192,25,44,.15), 0 1px 0 rgba(255,255,255,.08) inset;
  }
  .lp-input-pw { padding-right: 42px; }
  .lp-eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,.22); font-size: 13px;
    display: flex; align-items: center; transition: color .2s;
  }
  .lp-eye:hover { color: #e85566; }

  /* terms toggle */
  .lp-terms-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; border-radius: 12px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.09);
    backdrop-filter: blur(8px);
    font-size: .79rem; font-weight: 500; color: rgba(255,255,255,.5);
    font-family: 'Ubuntu', sans-serif; cursor: pointer;
    transition: background .2s, border-color .2s;
  }
  .lp-terms-btn:hover { background: rgba(192,25,44,.1); border-color: rgba(192,25,44,.2); }
  .lp-terms-body { overflow: hidden; margin-top: 8px; }
  .lp-terms-inner {
    padding: 13px; border-radius: 12px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    font-size: .73rem; line-height: 1.7; color: rgba(255,255,255,.35);
    max-height: 150px; overflow-y: auto;
  }
  .lp-terms-inner::-webkit-scrollbar { width: 3px; }
  .lp-terms-inner::-webkit-scrollbar-thumb { background: rgba(192,25,44,.4); border-radius: 3px; }
  .lp-terms-inner p { margin-bottom: 6px; }
  .lp-terms-inner strong { color: rgba(255,160,160,.6); font-size: .7rem; text-transform: uppercase; letter-spacing: 1px; }

  /* checkbox */
  .lp-check { display: flex; align-items: center; gap: 10px; margin: 18px 0 22px; }
  .lp-checkbox {
    width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
    border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06);
    appearance: none; cursor: pointer; transition: all .2s; position: relative;
  }
  .lp-checkbox:checked { background: #c0192c; border-color: #c0192c; box-shadow: 0 0 8px rgba(192,25,44,.45); }
  .lp-checkbox:checked::after {
    content: ''; position: absolute;
    width: 5px; height: 9px;
    border: 2px solid #fff; border-top: none; border-left: none;
    transform: rotate(42deg) translate(-1px,-1px); left: 5px; top: 1px;
  }
  .lp-check-label { font-size: .79rem; color: rgba(255,255,255,.4); cursor: pointer; line-height: 1.4; }

  /* submit */
  .lp-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    font-size: .9rem; font-weight: 600; font-family: 'Ubuntu', sans-serif;
    cursor: pointer; transition: all .22s; position: relative; overflow: hidden;
  }
  .lp-btn::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
    transition: left .5s;
  }
  .lp-btn-on { background: linear-gradient(135deg, #c0192c, #9e1224); color: #fff; box-shadow: 0 6px 22px rgba(192,25,44,.4), 0 1px 0 rgba(255,255,255,.1) inset; }
  .lp-btn-on:hover { box-shadow: 0 10px 30px rgba(192,25,44,.58); transform: translateY(-1px); }
  .lp-btn-on:hover::before { left: 150%; }
  .lp-btn-on:active { transform: scale(.98); }
  .lp-btn-off { background: rgba(255,255,255,.07); color: rgba(255,255,255,.2); cursor: not-allowed; border: 1px solid rgba(255,255,255,.06); }

  /* footer */
  .lp-foot { text-align: center; margin-top: 20px; font-size: .77rem; color: rgba(255,255,255,.3); }
  .lp-link {
    color: rgba(255,160,160,.8); font-weight: 600; background: none; border: none;
    cursor: pointer; font-size: .77rem; text-decoration: underline;
    text-underline-offset: 2px; font-family: 'Ubuntu', sans-serif;
    transition: color .2s;
  }
  .lp-link:hover { color: #e85566; }

  /* ════ MODAL — full iOS glass ════ */
  .lp-modal-bg {
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(135deg, rgba(26,0,8,.9), rgba(45,0,15,.93));
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .lp-modal {
    position: relative; width: 100%; max-width: 440px;
    border-radius: 28px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.18);
    backdrop-filter: blur(48px) saturate(1.8) brightness(1.08);
    -webkit-backdrop-filter: blur(48px) saturate(1.8) brightness(1.08);
    box-shadow: 0 32px 80px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.18) inset;
    overflow: hidden;
  }
  .lp-modal::before {
    content: ''; position: absolute; top: 0; left: 14%; right: 14%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
    pointer-events: none;
  }
  .lp-modal-bar {
    height: 2px;
    background: linear-gradient(90deg, #7a0d1b, #c0192c, #e85566, #c0192c, #7a0d1b);
    background-size: 300% auto;
    animation: shimmer 4s linear infinite;
  }
  .lp-modal-head {
    padding: 22px 22px 18px;
    border-bottom: 1px solid rgba(255,255,255,.09);
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-modal-head-left { display: flex; align-items: center; gap: 12px; }
  .lp-modal-icon {
    width: 42px; height: 42px; border-radius: 13px;
    background: rgba(192,25,44,.25); border: 1px solid rgba(192,25,44,.3);
    display: flex; align-items: center; justify-content: center;
    color: #e85566; font-size: 17px;
    box-shadow: 0 4px 14px rgba(192,25,44,.2);
  }
  .lp-modal-title { font-size: .98rem; font-weight: 700; color: #fff; }
  .lp-modal-sub   { font-size: .7rem; color: rgba(255,255,255,.38); margin-top: 1px; }
  .lp-modal-close {
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(192,25,44,.35); border: 1px solid rgba(192,25,44,.3);
    color: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 13px;
    transition: background .2s, transform .2s;
  }
  .lp-modal-close:hover { background: #c0192c; transform: scale(1.08); }
  .lp-modal-body {
    padding: 16px 22px;
    max-height: 44vh; overflow-y: auto;
    display: flex; flex-direction: column; gap: 9px;
  }
  .lp-modal-body::-webkit-scrollbar { width: 3px; }
  .lp-modal-body::-webkit-scrollbar-thumb { background: rgba(192,25,44,.4); border-radius: 3px; }
  .lp-modal-row {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 12px 13px; border-radius: 14px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.08);
    transition: background .2s;
  }
  .lp-modal-row:hover { background: rgba(192,25,44,.1); border-color: rgba(192,25,44,.18); }
  .lp-modal-row-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 13px;
  }
  .lp-modal-row-title { font-size: .81rem; font-weight: 600; color: rgba(255,255,255,.82); margin-bottom: 3px; }
  .lp-modal-row-desc  { font-size: .73rem; color: rgba(255,255,255,.38); line-height: 1.55; }
  .lp-modal-foot { padding: 14px 22px 22px; border-top: 1px solid rgba(255,255,255,.07); }
  .lp-modal-btn {
    width: 100%; padding: 13px; border-radius: 13px; border: none;
    background: linear-gradient(135deg, #c0192c, #9e1224);
    color: #fff; font-weight: 600; font-size: .88rem;
    font-family: 'Ubuntu', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(192,25,44,.35);
    transition: box-shadow .22s, transform .22s;
  }
  .lp-modal-btn:hover { box-shadow: 0 10px 28px rgba(192,25,44,.52); transform: translateY(-1px); }
  .lp-modal-note { text-align: center; font-size: .65rem; color: rgba(255,255,255,.18); margin-top: 10px; }
`;

const itemV: Variants = {
  hidden: { y: 14, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
const containerV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const modalV: Variants = {
  hidden: { opacity: 0, scale: .93, y: 18 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: .3, ease: [.22,1,.36,1] } },
  exit:    { opacity: 0, scale: .93, y: 18, transition: { duration: .2 } },
};

export default function LoginPage() {
  const [showPw,    setShowPw]    = useState(false);
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [accepted,  setAccepted]  = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) { alert("Please accept the terms first."); return; }
    console.log("Login:", { email, password });
  };

  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* bg layers */}
      <div className="lp-orb" style={{ width:560,height:560,top:"-12%",left:"-10%",background:"radial-gradient(circle,rgba(192,25,44,.5) 0%,transparent 65%)" }} />
      <div className="lp-orb" style={{ width:420,height:420,bottom:"-14%",right:"-8%",background:"radial-gradient(circle,rgba(140,10,28,.45) 0%,transparent 65%)" }} />
      <div className="lp-orb" style={{ width:300,height:300,top:"25%",right:"12%",background:"radial-gradient(circle,rgba(100,0,20,.35) 0%,transparent 65%)" }} />
      <div className="lp-orb" style={{ width:200,height:200,bottom:"20%",left:"8%",background:"radial-gradient(circle,rgba(160,15,35,.25) 0%,transparent 65%)" }} />
      <div className="lp-grid" />
      <div className="lp-lines" />

      {/* back / close */}
      <Link to="/" className="lp-back" title="Back to Home">
        <span className="lp-back-x" style={{ fontSize:18, fontWeight:300, lineHeight:1 }}>×</span>
        <span className="lp-back-arrow"><HiArrowLeft size={15} /></span>
      </Link>

      {/* glass card */}
      <motion.div
        className="lp-card"
        initial={{ opacity: 0, y: 32, scale: .97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .6, ease: [.22,1,.36,1] }}
      >
        <div className="lp-bar" />

        {/* LEFT */}
        <div className="lp-left">
          <div className="lp-brand">
            <motion.div className="lp-logo-frame" initial={{ scale:.88,opacity:0 }} animate={{ scale:1,opacity:1 }} transition={{ duration:.55,delay:.25 }}>
              <img src={LOGO} alt="OMS" style={{ width:118,height:"auto",position:"relative",zIndex:1 }} />
            </motion.div>
            <motion.div className="lp-wordmark" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ duration:.45,delay:.38 }}>
              Omelette<em>'</em>s
            </motion.div>
            <motion.div className="lp-tagline" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.45,delay:.48 }}>
              Premium Aviation Collectibles
            </motion.div>
            <div className="lp-sep" />
            <motion.div className="lp-pill" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.45,delay:.56 }}>
              <div className="lp-pill-dot" /> Members Only
            </motion.div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lp-right">
          <motion.div variants={containerV} initial="hidden" animate="visible">

            {/* mobile top */}
            <motion.div className="lp-mobile-top" variants={itemV}>
              <div className="lp-mobile-logo">
                <img src={LOGO} alt="OMS" style={{ width:42,height:"auto" }} />
              </div>
              <div className="lp-mobile-name">Omelette<em>'</em>s</div>
            </motion.div>

            <motion.div variants={itemV}>
              <div className="lp-title">Welcome back <span style={{ color:"#e85566" }}>✦</span></div>
              <div className="lp-sub">Sign in to your exclusive OMS account</div>
            </motion.div>

            <motion.div className="lp-notice" variants={itemV}>
              <div className="lp-notice-dot" />
              <p>This platform is for invited OMS members only.</p>
            </motion.div>

            <form onSubmit={onSubmit}>
              <motion.div className="lp-field" variants={itemV}>
                <label className="lp-label" htmlFor="email">Email Address</label>
                <div className="lp-input-wrap">
                  <span className="lp-icon"><FaEnvelope /></span>
                  <input id="email" type="email" className="lp-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </motion.div>

              <motion.div className="lp-field" variants={itemV}>
                <label className="lp-label" htmlFor="password">Password</label>
                <div className="lp-input-wrap">
                  <span className="lp-icon"><FaLock /></span>
                  <input id="password" type={showPw?"text":"password"} className="lp-input lp-input-pw" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="lp-eye" onClick={() => setShowPw(p=>!p)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div className="lp-field" variants={itemV}>
                <button type="button" className="lp-terms-btn" onClick={() => setShowTerms(p=>!p)}>
                  <span>Terms &amp; Conditions</span>
                  {showTerms ? <FaChevronUp size={11}/> : <FaChevronDown size={11}/>}
                </button>
                <AnimatePresence>
                  {showTerms && (
                    <motion.div className="lp-terms-body" initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }} exit={{ height:0,opacity:0 }} transition={{ duration:.25 }}>
                      <div className="lp-terms-inner">
                        <p><strong>1. Exclusive Membership</strong></p>
                        <p>OMS membership is by invitation only. Access is restricted to invited members.</p>
                        <p><strong>2. Invitation Required</strong></p>
                        <p>You must receive a valid invitation from an existing member to create an account.</p>
                        <p><strong>3. Account Security</strong></p>
                        <p>You are responsible for maintaining the confidentiality of your credentials.</p>
                        <p><strong>4. Exclusive Content</strong></p>
                        <p>All content within OMS is confidential and intended for members only.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div className="lp-check" variants={itemV}>
                <input type="checkbox" id="terms" className="lp-checkbox" checked={accepted} onChange={() => setAccepted(p=>!p)} />
                <label htmlFor="terms" className="lp-check-label">I confirm I have received an OMS invitation</label>
              </motion.div>

              <motion.button
                type="submit" disabled={!accepted}
                className={`lp-btn ${accepted?"lp-btn-on":"lp-btn-off"}`}
                variants={itemV}
                whileHover={accepted?{scale:1.01}:{}}
                whileTap={accepted?{scale:.98}:{}}
              >
                Sign In
              </motion.button>
            </form>

            <motion.div className="lp-foot" variants={itemV}>
              Don't have an account?{" "}
              <button className="lp-link" onClick={() => setShowModal(true)}>Sign up</button>
              <div style={{ fontSize:".66rem",marginTop:6,opacity:.7 }}>Membership is exclusive and requires invitation</div>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="lp-modal-bg" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:.22 }} onClick={() => setShowModal(false)}>
            {/* modal orbs */}
            <div style={{ position:"absolute",width:380,height:380,top:"-10%",left:"-8%",borderRadius:"50%",background:"radial-gradient(circle,rgba(192,25,44,.4) 0%,transparent 60%)",filter:"blur(55px)",pointerEvents:"none" }} />
            <div style={{ position:"absolute",width:300,height:300,bottom:"-10%",right:"-5%",borderRadius:"50%",background:"radial-gradient(circle,rgba(140,10,28,.3) 0%,transparent 60%)",filter:"blur(48px)",pointerEvents:"none" }} />

            <motion.div className="lp-modal" variants={modalV} initial="hidden" animate="visible" exit="exit" onClick={e=>e.stopPropagation()}>
              <div className="lp-modal-bar" />
              <div className="lp-modal-head">
                <div className="lp-modal-head-left">
                  <div className="lp-modal-icon"><FaUserFriends /></div>
                  <div>
                    <div className="lp-modal-title">OMS Membership</div>
                    <div className="lp-modal-sub">Invitation Required</div>
                  </div>
                </div>
                <button className="lp-modal-close" onClick={() => setShowModal(false)}><FaTimes size={12}/></button>
              </div>

              <div className="lp-modal-body">
                {[
                  { icon:<FaUserFriends/>, bg:"rgba(192,25,44,.2)", color:"#e85566", title:"Invitation-Only", desc:"OMS is exclusively by invitation. You cannot create an account without one from an existing member." },
                  { icon:<FaEnvelope/>,    bg:"rgba(59,130,246,.18)",color:"#60a5fa", title:"How to Get Invited",  desc:"Contact an existing OMS member and request an invitation email with registration instructions." },
                  { icon:<FaLock/>,        bg:"rgba(168,85,247,.16)",color:"#c084fc", title:"Secure & Private",    desc:"All members are verified through our invitation system with strict privacy standards." },
                ].map((r,i) => (
                  <div key={i} className="lp-modal-row">
                    <div className="lp-modal-row-icon" style={{ background:r.bg,color:r.color }}>{r.icon}</div>
                    <div>
                      <div className="lp-modal-row-title">{r.title}</div>
                      <div className="lp-modal-row-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lp-modal-foot">
                <button className="lp-modal-btn" onClick={() => { setShowModal(false); window.location.href="/help"; }}>
                  <FaEnvelopeOpen size={14}/> Request Invitation Help
                </button>
                <div className="lp-modal-note">OMS — Exclusive Membership Platform</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}