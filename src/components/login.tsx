import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaEye, FaEyeSlash, FaLock, FaEnvelope,
  FaTimes, FaArrowLeft, FaUserPlus, FaPlane
} from "react-icons/fa";
import { HiFingerPrint } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425952/omelett%27s/public/logo/web-app%20logo/white-2026.png";
const LOGO_DARK = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425959/omelett%27s/public/logo/web-app%20logo/dark-2026.png";

// Sky background image
const SKY_BG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80";

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, 'Inter', 'Segoe UI', sans-serif;
  }

  .login-container {
    min-height: 100vh;
    display: flex;
    background: var(--bg);
    position: relative;
  }
  .light .login-container { --bg: #f0f2f5; }
  .dark .login-container { --bg: #08080e; }

  /* ─── LEFT SIDE WITH SKY BG ─── */
  .brand-side {
    flex: 1.2;
    background: linear-gradient(135deg, rgba(10,100,85,0.85) 0%, rgba(10,100,85,0.7) 100%);
    background-image: url(${SKY_BG});
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 40px;
  }

  .brand-side::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(10,100,85,0.7) 0%, rgba(10,100,85,0.4) 50%, rgba(10,100,85,0.7) 100%);
    pointer-events: none;
  }

  .brand-side::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(10,100,85,0.3) 100%);
    pointer-events: none;
  }

  .brand-content {
    text-align: center;
    z-index: 10;
    padding: 20px;
    position: relative;
  }

  /* ─── PLANE ANIMATION ─── */
  .plane-icon {
    position: absolute;
    font-size: 2rem;
    color: rgba(255,255,255,0.08);
    animation: flyPlane 15s linear infinite;
  }

  .plane-icon:nth-child(1) {
    top: 15%;
    left: -5%;
    animation-delay: 0s;
    font-size: 2.5rem;
  }

  .plane-icon:nth-child(2) {
    top: 60%;
    left: -10%;
    animation-delay: -5s;
    font-size: 1.8rem;
  }

  .plane-icon:nth-child(3) {
    top: 30%;
    left: -8%;
    animation-delay: -10s;
    font-size: 2rem;
  }

  @keyframes flyPlane {
    0% {
      transform: translateX(0) translateY(0) rotate(-10deg);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateX(1200px) translateY(-30px) rotate(-5deg);
      opacity: 0;
    }
  }

  .brand-logo {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    border: 2px solid rgba(255,255,255,0.12);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 40px rgba(0,0,0,0.15);
    position: relative;
  }

  .brand-logo::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.05);
    animation: spinRing 20s linear infinite;
  }

  @keyframes spinRing {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .brand-logo:hover {
    transform: scale(1.05);
    border-color: rgba(255,255,255,0.2);
    box-shadow: 0 12px 60px rgba(0,0,0,0.2);
  }

  .brand-logo img {
    width: 100px;
    height: auto;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.1));
  }

  .brand-title {
    font-size: 2.8rem;
    font-weight: 800;
    color: white;
    margin-bottom: 10px;
    letter-spacing: -1px;
    text-shadow: 0 2px 20px rgba(0,0,0,0.1);
  }

  .brand-title span {
    color: #ff0000;
    text-shadow: 0 0 30px rgba(240,0,0,0.15);
  }

  .brand-desc {
    font-size: 1rem;
    color: rgba(255,255,255,0.85);
    max-width: 320px;
    line-height: 1.7;
    margin: 0 auto;
    text-shadow: 0 1px 10px rgba(0,0,0,0.1);
    font-weight: 300;
  }

  .brand-desc strong {
    font-weight: 600;
    color: rgba(255,255,255,0.95);
  }

  /* ─── RIGHT SIDE ─── */
  .form-side {
    flex: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    background: var(--bg);
  }

  .back-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--btn-bg);
    border: 1px solid var(--btn-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: var(--text);
    z-index: 20;
  }
  .light .back-btn { --btn-bg: rgba(0,0,0,0.04); --btn-border: rgba(0,0,0,0.08); --text: #1a1a1a; }
  .dark .back-btn { --btn-bg: rgba(255,255,255,0.04); --btn-border: rgba(255,255,255,0.08); --text: #e0e0e0; }

  .back-btn:hover {
    background: #0a6455;
    color: white;
    border-color: #0a6455;
    transform: scale(1.05);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 40px 36px;
    background: var(--card-bg);
    border-radius: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--card-border);
    backdrop-filter: blur(20px);
  }
  .light .login-card { 
    --card-bg: rgba(255,255,255,0.92);
    --card-border: rgba(255,255,255,0.5);
    --shadow: 0 24px 80px rgba(0,0,0,0.06);
  }
  .dark .login-card { 
    --card-bg: rgba(20,20,30,0.92);
    --card-border: rgba(255,255,255,0.04);
    --shadow: 0 24px 80px rgba(0,0,0,0.4);
  }

  /* Mobile logo */
  .mobile-logo {
    display: none;
    text-align: center;
    margin-bottom: 28px;
  }

  .mobile-logo-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    border: 2px solid rgba(10,100,85,0.12);
  }
  .light .mobile-logo-img { background: rgba(10,100,85,0.04); }
  .dark .mobile-logo-img { background: rgba(10,100,85,0.08); }

  .mobile-logo-img img {
    width: 48px;
    height: auto;
  }

  .mobile-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text);
  }
  .light .mobile-title { --text: #1a1a1a; }
  .dark .mobile-title { --text: white; }

  .mobile-title span {
    color: #0a6455;
  }

  /* Login Header */
  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text);
  }
  .light .login-title { --text: #1a1a1a; }
  .dark .login-title { --text: white; }

  .login-sub {
    font-size: 0.85rem;
    color: #999;
  }

  /* ─── FORM ─── */
  .input-group {
    margin-bottom: 16px;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #0a6455;
    font-size: 16px;
    opacity: 0.5;
  }

  .input-field {
    width: 100%;
    padding: 14px 14px 14px 46px;
    border: 2px solid var(--border);
    border-radius: 14px;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s;
    background: var(--input-bg);
    color: var(--text);
    font-family: inherit;
  }
  .light .input-field { 
    --border: #e4e4ea; 
    --input-bg: #f8f9fb;
    --text: #1a1a1a;
  }
  .dark .input-field { 
    --border: #2a2a38; 
    --input-bg: #14141c;
    --text: #e8e8e8;
  }

  .input-field:focus {
    border-color: #0a6455;
    box-shadow: 0 0 0 4px rgba(10,100,85,0.06);
  }

  .input-field::placeholder {
    color: #aaa;
  }

  .eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    font-size: 14px;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .eye-btn:hover {
    color: #0a6455;
  }

  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 24px;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    color: #888;
  }

  .checkbox input {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #0a6455;
  }

  .forgot-link {
    background: none;
    border: none;
    color: #0a6455;
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #0a6455, #0e7f6c);
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(10,100,85,0.2);
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(10,100,85,0.3);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  .divider {
    text-align: center;
    margin: 28px 0 22px;
    position: relative;
  }

  .divider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: var(--divider-color);
  }
  .light .divider::before { --divider-color: #e4e4ea; }
  .dark .divider::before { --divider-color: #2a2a38; }

  .divider span {
    background: var(--card-bg);
    padding: 0 14px;
    font-size: 0.75rem;
    color: #999;
    position: relative;
    z-index: 1;
  }

  .invite-btn {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 2px solid #0a6455;
    border-radius: 14px;
    color: #0a6455;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .invite-btn:hover {
    background: rgba(10,100,85,0.05);
    transform: translateY(-2px);
  }

  /* ─── MODAL ─── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal {
    background: var(--modal-bg);
    border-radius: 20px;
    max-width: 360px;
    width: 100%;
    padding: 32px 28px;
    border: 1px solid var(--modal-border);
  }
  .light .modal { 
    --modal-bg: white; 
    --modal-border: rgba(0,0,0,0.04);
  }
  .dark .modal { 
    --modal-bg: #1a1a24; 
    --modal-border: rgba(255,255,255,0.04);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text);
  }
  .light .modal-title { --text: #1a1a1a; }
  .dark .modal-title { --text: white; }

  .modal-close {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
    padding: 4px;
    transition: all 0.2s;
  }

  .modal-close:hover {
    color: #0a6455;
  }

  .modal-text {
    font-size: 0.85rem;
    color: #888;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .modal-btn {
    width: 100%;
    padding: 13px;
    background: #0a6455;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  .modal-btn:hover {
    background: #074d41;
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 1024px) {
    .brand-side {
      flex: 1;
    }
    .form-side {
      flex: 1;
    }
    .brand-logo {
      width: 150px;
      height: 150px;
    }
    .brand-logo img {
      width: 85px;
    }
    .brand-title {
      font-size: 2.4rem;
    }
  }

  @media (max-width: 860px) {
    .brand-side {
      display: none;
    }
    
    /* Mobile uses same sky background */
    .form-side {
      flex: 1;
      padding: 16px;
      background-image: url(${SKY_BG});
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .form-side::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(10,100,85,0.6) 0%, rgba(10,100,85,0.3) 100%);
      pointer-events: none;
    }

    .form-side::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 30%, rgba(10,100,85,0.2) 100%);
      pointer-events: none;
    }

    .login-card {
      padding: 32px 24px;
      max-width: 400px;
      position: relative;
      z-index: 1;
      background: var(--card-bg-mobile);
    }
    .light .login-card { 
      --card-bg-mobile: rgba(255,255,255,0.95);
    }
    .dark .login-card { 
      --card-bg-mobile: rgba(20,20,30,0.95);
    }

    .back-btn {
      top: 16px;
      right: 16px;
      width: 38px;
      height: 38px;
      z-index: 10;
    }

    .mobile-logo {
      display: block;
    }

    .login-header {
      display: none;
    }

    /* Mobile plane icons */
    .mobile-plane {
      position: absolute;
      font-size: 1.5rem;
      color: rgba(255,255,255,0.06);
      animation: flyPlaneMobile 12s linear infinite;
      z-index: 0;
    }

    .mobile-plane:nth-child(1) {
      top: 10%;
      left: -10%;
      animation-delay: 0s;
    }

    .mobile-plane:nth-child(2) {
      top: 50%;
      left: -15%;
      animation-delay: -4s;
      font-size: 1.2rem;
    }

    .mobile-plane:nth-child(3) {
      top: 80%;
      left: -5%;
      animation-delay: -8s;
      font-size: 1.8rem;
    }

    @keyframes flyPlaneMobile {
      0% {
        transform: translateX(0) translateY(0) rotate(-10deg);
        opacity: 0;
      }
      10% {
        opacity: 0.2;
      }
      90% {
        opacity: 0.2;
      }
      100% {
        transform: translateX(500px) translateY(-20px) rotate(-5deg);
        opacity: 0;
      }
    }
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 24px 18px;
      border-radius: 20px;
    }

    .mobile-logo-img {
      width: 70px;
      height: 70px;
    }

    .mobile-logo-img img {
      width: 42px;
    }

    .mobile-title {
      font-size: 1.1rem;
    }

    .input-field {
      padding: 13px 12px 13px 40px;
      font-size: 0.85rem;
    }

    .input-icon {
      left: 12px;
      font-size: 14px;
    }

    .submit-btn {
      padding: 13px;
      font-size: 0.85rem;
    }

    .invite-btn {
      padding: 12px;
      font-size: 0.85rem;
    }

    .options {
      flex-wrap: wrap;
      gap: 6px;
      margin: 16px 0 20px;
    }

    .back-btn {
      top: 12px;
      right: 12px;
      width: 34px;
      height: 34px;
      font-size: 12px;
    }

    .divider {
      margin: 24px 0 18px;
    }
  }

  @media (min-width: 1400px) {
    .brand-side {
      flex: 1.5;
    }
    .form-side {
      flex: 0.7;
    }
    .brand-logo {
      width: 220px;
      height: 220px;
    }
    .brand-logo img {
      width: 120px;
    }
    .brand-title {
      font-size: 3.2rem;
    }
    .brand-desc {
      font-size: 1.1rem;
      max-width: 380px;
    }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ─── LEFT SIDE WITH SKY BG ─── */}
      <div className="brand-side">
        {/* Flying planes animation */}
        <div className="plane-icon"><FaPlane /></div>
        <div className="plane-icon"><FaPlane /></div>
        <div className="plane-icon"><FaPlane /></div>
        
        <div className="brand-content">
          <motion.div 
            className="brand-logo"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={LOGO} alt="Logo" />
          </motion.div>
          
          <motion.h2 
            className="brand-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Omelette<span>'</span>s
          </motion.h2>
          
          <motion.p 
            className="brand-desc"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Premium aviation collectibles for <strong>discerning collectors</strong> worldwide 
          </motion.p>
        </div>
      </div>

      {/* ─── RIGHT SIDE ─── */}
      <div className="form-side">
        {/* Mobile plane icons */}
        {/* <div className="mobile-plane"><FaPlane /></div>
        <div className="mobile-plane"><FaPlane /></div>
        <div className="mobile-plane"><FaPlane /></div> */}

        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft size={14} />
        </button>

        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile Logo */}
          <div className="mobile-logo">
            <div className="mobile-logo-img">
              <img src={isDark ? LOGO : LOGO_DARK} alt="Logo" />
            </div>
            <div className="mobile-title">Omelette<span>'</span>s</div>
          </div>

          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-sub">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon"><FaEnvelope /></span>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon"><FaLock /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>

            <div className="options">
              <label className="checkbox">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="submit-btn">
              <HiFingerPrint size={16} /> Sign In
            </button>
          </form>

          <div className="divider">
            <span>New to Omelette's?</span>
          </div>

          <button className="invite-btn" onClick={() => setShowModal(true)}>
            <FaUserPlus size={14} /> Request Invitation
          </button>
        </motion.div>
      </div>

      {/* ─── MODAL ─── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">Invitation Only</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="modal-text">
                Omelette's is an exclusive community. You need an invitation 
                from an existing member to join.
              </div>
              <button 
                className="modal-btn"
                onClick={() => {
                  setShowModal(false);
                  navigate("/help");
                }}
              >
                Contact Support
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}