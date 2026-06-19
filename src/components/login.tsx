import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaEye, FaEyeSlash, FaLock, FaEnvelope,
  FaTimes, FaGem, FaShieldAlt, FaRocket
} from "react-icons/fa";
import { HiFingerPrint } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Link } from "@heroui/link";

const LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425952/omelett%27s/public/logo/web-app%20logo/white-2026.png";
const LOGO_DARK = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425959/omelett%27s/public/logo/web-app%20logo/dark-2026.png";

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, 'Inter', sans-serif;
  }

  .login-container {
    min-height: 100vh;
    display: flex;
  }

  /* LEFT SIDE - GREEN BRAND SIDE */
  .brand-side {
    flex: 1;
    background: linear-gradient(135deg, #0a6455 0%, #0e7f6c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* Subtle animated dots */
  .brand-dots {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    background-image: radial-gradient(#ffffff 1px, transparent 1px);
    background-size: 30px 30px;
    animation: dotsMove 20s linear infinite;
  }

  @keyframes dotsMove {
    0% { background-position: 0 0; }
    100% { background-position: 30px 30px; }
  }

  /* Brand content */
  .brand-content {
    text-align: center;
    z-index: 10;
    padding: 40px;
  }

  .brand-logo {
    width: 200px;
    height: 200px;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30px;
    border: 2px solid rgba(255,255,255,0.15);
    transition: all 0.3s ease;
  }

  .brand-logo:hover {
    transform: scale(1.02);
    border-color: rgba(255,255,255,0.25);
  }

  .brand-logo img {
    width: 130px;
    height: auto;
  }

  .brand-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: white;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  .brand-title span {
    color: #ED0808;
  }

  .brand-desc {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.75);
    margin-bottom: 40px;
    max-width: 300px;
    line-height: 1.6;
  }

  /* Features - clean list */
  .brand-features {
    text-align: left;
    max-width: 260px;
    margin: 0 auto;
  }

  .brand-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    color: white;
  }

  .brand-feature-icon {
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-feature-text {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.8);
  }

  /* RIGHT SIDE - LOGIN FORM */
  .form-side {
    flex: 1;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .dark .form-side { --bg: #0a0a0a; }
  .light .form-side { --bg: #ffffff; }

  /* Back button */
  .back-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 18px;
    z-index: 20;
  }

  .dark .back-btn {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.1);
    color: white;
  }

  .back-btn:hover {
    background: #0a6455;
    color: white;
    border-color: #0a6455;
  }

  /* Login Card */
  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 48px 36px;
    background: var(--card-bg);
    border-radius: 32px;
    box-shadow: var(--shadow);
  }

  .light .login-card { 
    --card-bg: white;
    --shadow: 0 20px 40px rgba(0,0,0,0.05);
  }
  .dark .login-card { 
    --card-bg: #141414;
    --shadow: 0 20px 40px rgba(0,0,0,0.3);
  }

  /* Mobile logo - BIGGER */
  .mobile-logo {
    display: none;
    text-align: center;
    margin-bottom: 40px;
  }

  .mobile-logo-img {
    width: 120px;
    height: 120px;
    background: rgba(10,100,85,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    border: 2px solid rgba(10,100,85,0.15);
  }

  .mobile-logo-img img {
    width: 75px;
    height: auto;
  }

  .mobile-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .mobile-title span {
    color: #0a6455;
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .login-badge {
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 3px;
    color: #0a6455;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .login-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }

  .light .login-title { --text: #1a1a1a; }
  .dark .login-title { --text: white; }

  .login-sub {
    font-size: 0.85rem;
    color: #666;
  }

  /* Form - Your original input style */
  .input-group {
    margin-bottom: 20px;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #0a6455;
    font-size: 16px;
  }

  .input-field {
    width: 100%;
    padding: 16px 16px 16px 48px;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s;
    background: var(--input-bg);
    color: var(--text);
    font-family: inherit;
  }

  .light .input-field { 
    --border: #e0e0e0; 
    --input-bg: #f8f9fa;
  }
  .dark .input-field { 
    --border: #333; 
    --input-bg: #1a1a1a;
  }

  .input-field:focus {
    border-color: #0a6455;
    box-shadow: 0 0 0 3px rgba(10,100,85,0.1);
  }

  .input-field::placeholder {
    color: #aaa;
  }

  .eye-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .eye-btn:hover {
    color: #0a6455;
  }

  /* Options */
  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 0.8rem;
    color: #666;
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
    text-decoration: none;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 16px;
    background: #0a6455;
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .submit-btn:hover {
    background: #074d41;
    transform: translateY(-2px);
  }

  /* Divider */
  .divider {
    text-align: center;
    margin: 24px 0;
    position: relative;
  }

  .divider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: #e0e0e0;
  }

  .dark .divider::before {
    background: #333;
  }

  .divider span {
    background: var(--card-bg);
    padding: 0 12px;
    font-size: 0.75rem;
    color: #999;
    position: relative;
    z-index: 1;
  }

  /* Invite button */
  .invite-btn {
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1.5px solid #0a6455;
    border-radius: 14px;
    color: #0a6455;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .invite-btn:hover {
    background: rgba(10,100,85,0.05);
    transform: translateY(-1px);
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal {
    background: white;
    border-radius: 20px;
    max-width: 340px;
    width: 100%;
    padding: 28px;
  }

  .dark .modal {
    background: #1a1a1a;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .modal-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .dark .modal-title { color: white; }

  .modal-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;
  }

  .modal-text {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .dark .modal-text { color: #aaa; }

  .modal-btn {
    width: 100%;
    padding: 12px;
    background: #0a6455;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  /* Responsive */
  @media (max-width: 968px) {
    .brand-side {
      display: none;
    }
    
    .form-side {
      flex: 1;
    }
    
    .login-card {
      padding: 32px 24px;
      margin: 20px;
    }
    
    .back-btn {
      right: 20px;
      top: 20px;
    }

    .mobile-logo {
      display: block;
    }

    .login-header {
      display: none;
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

  // Check if dark mode is enabled
  useState(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password, rememberMe });
  };

  return (
    <div className="login-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* LEFT SIDE - GREEN BRAND */}
      <div className="brand-side">
        <div className="brand-dots" />
        
        <div className="brand-content">
          <div className="brand-logo">
            <img src={LOGO} alt="Logo" />
          </div>
          
          <h2 className="brand-title">Omelette<span>'</span>s</h2>
          
          <p className="brand-desc">
            Premium aviation collectibles for discerning collectors worldwide
          </p>
          
          <div className="brand-features">
            <div className="brand-feature">
              <div className="brand-feature-icon"><FaGem size={14} /></div>
              <span className="brand-feature-text">Exclusive limited editions</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><FaShieldAlt size={14} /></div>
              <span className="brand-feature-text">Verified & secure</span>
            </div>
            <div className="brand-feature">
              <div className="brand-feature-icon"><FaRocket size={14} /></div>
              <span className="brand-feature-text">Early access to new releases</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="form-side">
        <button onClick={() => navigate(-1)} className="back-btn">
          ✕
        </button>

        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile Logo - Using dark logo for mobile */}
          <div className="mobile-logo">
            <div className="mobile-logo-img">
              <img src={LOGO_DARK} alt="Logo" />
            </div>
           
          </div>

          {/* Desktop Header */}
          <div className="login-header">
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-sub">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Input - Your style */}
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

            {/* Password Input - Your style */}
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
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="options">
              <label className="checkbox">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/help" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              <HiFingerPrint size={18} /> Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>New to Omelette's?</span>
          </div>

          {/* Invite Button */}
          <button className="invite-btn" onClick={() => setShowModal(true)}>
            Request Invitation
          </button>
        </motion.div>
      </div>

      {/* Modal */}
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
                Omelette's is an exclusive community. You need an invitation from an existing member to join.
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